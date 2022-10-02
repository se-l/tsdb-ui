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
      aC.dropZones[sInd].items = reorder(        
        (aC.dropZones[sInd] || { items: [] }).items,
        source.index,
        destination.index
      );
    } else {
      const result = move(
        (aC.dropZones[sInd] || { items: [] }).items,
        (aC.dropZones[dInd] || { items: [] }).items,
        source,
        destination
      );
      aC.dropZones[dInd].items = result[dInd]
      aC.dropZones[sInd].items = result[sInd]
      aC.setDropZones(aC.dropZones[dInd].items);
      aC.setDropZones(aC.dropZones[sInd].items);
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
                [], [], []
          ));
          aC.setViews(views);
        });
      } else {
        console.log(res);
      }
    });
  }, [aC.apiUrl]);

  const getReqY = (): number => {
    let posYs = _.map(aC.cells, (c) => c.getPosition().y)
    let posY = Math.max(...posYs)
    if (posYs.length > 0) {
      return posY + aC.cells[posYs.indexOf(posY)].getSize().height + 100
    } else {
      return 0
    }
  }

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
        </Box>
      </Box>
    </DragDropContext>
  );
}