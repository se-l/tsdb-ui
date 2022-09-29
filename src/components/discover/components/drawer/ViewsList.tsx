import { AddCircleOutline, Dashboard, ExpandLess, ExpandMore, Preview } from "@mui/icons-material";
import { Collapse, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import * as _ from "lodash"
import { useContext, useReducer, useState } from "react"
import { get } from "../../../../api/network";
import { AppContext } from "../../../../AppContext";
import { ENDPOINT_VIEW_GET } from "../../../../Constants";
import { Cell } from "../../classes/Cell";
import { ChipItem } from "../../classes/ChipItem";
import { Dataset } from "../../classes/Dataset";
import { DropZone } from "../../classes/DropZone";
import { View } from "../../classes/View";

export default function ViewsList() {
    const aC = useContext(AppContext)
    const [openViews, setOpenViews] = useState<boolean>(true)
    const [render, setRender] = useState<number>(0)

    let _init = _.reduce(_.uniq(_.map(aC.views, (v: View) => v.folder)), (result: { [ key: string]: boolean}, folder) => {
        result[folder] = true;
        return result
    }, {})

    const folderOpener = (state: any, action: { name: string; open: boolean }) => {
        state[action.name] = action.open;
        setRender(render + 1)
        return state
    }
    const [openFolders, setOpenFolders] = useReducer(folderOpener, _init)

    const onLoadView = (viewName: string) => {
        get(`${aC.apiUrl}${ENDPOINT_VIEW_GET}`).then((res) => {
            if (res.ok) {
                res.json().then((obj: any[]) => {
                    let views = _.map(obj, (o: any) => new View(
                        o.folder,
                        o.name,
                        _.map(o.datasets, (ds: any) => new Dataset(ds.name, ds.schema, ds.data, ds.code)),
                        _.map(o.cells, (c: any) => new Cell(
                            c.type, 
                            _.map(c.dropZones, (dz) => new DropZone(
                                dz.id, 
                                _.map(dz.items, (item) => new ChipItem(item.name, item.type, item.droppableId)),
                                dz.name
                            )),
                            c.name
                        ))
                    ))
                    aC.setViews(views)
                })
            } else {
                console.log(res)
            }
        })
        let view = _.filter(aC.views, (v) => v.name === viewName)[0]
        _.forEach(view.cells, (cell) => {
            _.forEach(cell.dropZones, (dz) => {
                aC.setDropZones(dz)
            })
        })
        aC.setDatasets(view.datasets)
        aC.setOpenDatasets(true)
        aC.setCells(view.cells)
    }

    return (
      <MenuList sx={{ width: "100%" }} component="nav" disablePadding dense>
        <MenuItem dense onClick={() => setOpenViews(!openViews)}>
          <ListItemIcon>
            {openViews ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText>Views</ListItemText>
          <ListItemIcon onClick={() => aC.setDiscoveryDataModalOpen(true)}>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          {/* <DataSourceModal /> */}
        </MenuItem>
        <Collapse in={aC.openDatasets} timeout="auto" unmountOnExit>
          {_.map(
            _.sortedUniq(_.map(aC.views, (v: View) => v.folder)),
            (folder: string) => {
              return (
                <>
                  <MenuItem
                    dense
                    onClick={() =>
                      setOpenFolders({
                        name: folder,
                        open: !openFolders[folder],
                      })
                    }
                  >
                    <ListItemIcon>
                      {openFolders[folder] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                    <ListItemText>{folder}</ListItemText>
                  </MenuItem>

                  <Collapse
                    in={openFolders[folder]}
                    timeout="auto"
                    unmountOnExit
                  >
                    {_.map(
                      _.sortBy(
                        _.filter(aC.views, (v: View) => v.folder === folder),
                        (v) => v.name
                      ),
                      (v) => {
                        return (
                          <MenuItem dense key={v.name}>
                            <ListItemIcon>
                              <Dashboard fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{v.name}</ListItemText>
                            <ListItemIcon
                              onClick={() => {
                                onLoadView(v.name);
                              }}
                            >
                              <Preview fontSize="small" />
                            </ListItemIcon>
                          </MenuItem>
                        );
                      }
                    )}
                  </Collapse>
                </>
              );
            }
          )}
        </Collapse>
      </MenuList>
    );
  }
