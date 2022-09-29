import * as _ from "lodash";
import { Box, Button, ButtonGroup, Divider, Drawer, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import {DragDropContext } from "react-beautiful-dnd"
import { ChipItem } from "./classes/ChipItem";
import { dataDrawerDropId, mapEncodingHeader } from "./Const";
import { DropZone } from "./classes/DropZone";
import { ENDPOINT_VIEW_GET } from "../../Constants";
import { get } from "../../api/network";
import { View } from "./classes/View";
import { Cell } from "./classes/Cell";
import { Dataset } from "./classes/Dataset";
import Layout from "../../Layout";
import { CellType } from "./types/CellType";
import CellC from "./components/CellC";
import DragResize from "./components/DragResize";
import "./discover.css"


const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const move = (
    source: any[],
    destination: any[],
    droppableSource: any,
    droppableDestination: any
    ) => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);
      const destChipItem: ChipItem = new ChipItem(
        removed.name,
        removed.type,
        droppableDestination.droppableId
      );
      destClone.splice(droppableDestination.index, 0, destChipItem);

      const result: any = {};
      result[droppableSource.droppableId] =
        droppableSource.droppableId.indexOf(dataDrawerDropId) > -1
          ? source
          : sourceClone;
      result[droppableDestination.droppableId] =
        droppableDestination.droppableId.indexOf(dataDrawerDropId) > -1
          ? destination
          : destClone;
      return result;
    }
export default function LandingDiscover() {
  const aC = useContext(AppContext);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    if (sInd === dInd) {
      const items = reorder(
        (aC.dropZones[sInd] || { items: [] }).items,
        source.index,
        destination.index
      );
      aC.setDropZones({ doppableId: sInd, items: items });
    } else {
      const result = move(
        (aC.dropZones[sInd] || { items: [] }).items,
        (aC.dropZones[dInd] || { items: [] }).items,
        source,
        destination
      );
      aC.setDropZones(new DropZone(sInd, result[sInd]));
      aC.setDropZones(new DropZone(dInd, result[dInd]));
    }
    aC.setRedrawGrid(aC.redrawGrid + 1);
  };

  const toolBarContent: any = (
    <Typography variant="h6" ml={1} noWrap sx={{ flexGrow: 1 }}>
      Discover
    </Typography>
  );

  useEffect(() => {
    get(`${aC.apiUrl}${ENDPOINT_VIEW_GET}`).then((res: any) => {
      if (res.ok) {
        res.json().then((obj: any[]) => {
          console.log(obj);
          let views = _.map(
            obj,
            (o: any) =>
              new View(
                o.folder,
                o.name,
                _.map(
                  o.datasets,
                  (ds: any) => new Dataset(ds.name, ds.schema, ds.data, ds.code)
                ),
                _.map(
                  o.cells,
                  (c: any) =>
                    new Cell(
                      c.type,
                      _.map(
                        c.dropZones,
                        (dz) =>
                          new DropZone(
                            dz.id,
                            _.map(
                              dz.items,
                              (item) =>
                                new ChipItem(
                                  item.name,
                                  item.type,
                                  item.droppableId
                                )
                            )
                          )
                      )
                    )
                )
              )
          );
          aC.setViews(views);
        });
      } else {
        console.log(res);
      }
    });
  }, [aC.apiUrl]);

  const appendNewCell = (cellType: CellType) => {
    let id = String(aC.cells.length + 1);
    let dropZones = _.map(Object.keys(mapEncodingHeader), (encoding) => {
      return new DropZone(id + encoding, [], mapEncodingHeader[encoding]);
    });
    _.forEach(dropZones, (dz) => {
      aC.setDropZones(dz);
    });
    aC.setCells(aC.cells.concat(new Cell(cellType, dropZones, "")));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ width: "100%", height: "32px" }}></div>
      <Box sx={{ display: "flex" }}>
        <Layout sideBarContent={<Drawer />} toolBarContent={toolBarContent} />
        <Box className="chartArea">
          <Stack spacing={2}>
            {_.map(aC.cells, (cell: Cell) => {
              return <CellC cell={cell} />;
            })}
          </Stack>
          <Divider />
          <DragResize>
            <Stack direction="row" spacing={2}>
              <Typography>Add Cell:</Typography>
              <ButtonGroup
                sx={{ margin: 1, display: "table" }}
                size="small"
                aria-label="small secondary button group"
              >
                {_.map(CellType, (key) => (
                  <Button
                    id={`newCellButton-${key}`}
                    variant="outlined"
                    onClick={() => appendNewCell(key)}
                  >
                    {key}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          </DragResize>
        </Box>
      </Box>
    </DragDropContext>
  );
}