import { AddCircleOutline, ChevronRight, Dashboard, Delete, DoubleArrow, ExpandLess, ExpandMore, FolderOpen, Preview, ReadMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { Collapse, Fade, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { handleBreakpoints } from "@mui/system";
import * as _ from "lodash"
import { Fragment, useContext, useReducer, useState } from "react"
import { get, post } from "../../../../api/network";
import { AppContext } from "../../../../AppContext";
import { ENDPOINT_VIEW_DELETE, ENDPOINT_VIEW_GET } from "../../../../Constants";
import { Cell } from "../../classes/Cell";
import { ChipItem, obj2ChipItem } from "../../classes/ChipItem";
import { Dataset } from "../../classes/Dataset";
import { DropZone } from "../../classes/DropZone";
import { View } from "../../classes/View";
import { StyledMenu } from "../AnchoredMenu";

export default function ViewsList() {
    const aC = useContext(AppContext)
    const [openViews, setOpenViews] = useState<boolean>(true)
    const [render, setRender] = useState<number>(0)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedView, setSetelectedView] = useState<View | {[key:string]: string}>({name: ""})

    const anchorMenuOpen = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    let _init = _.reduce(_.uniq(_.map(aC.views, (v: View) => v.folder)), (result: { [ key: string]: boolean}, folder) => {
        result[folder] = true;
        return result
    }, {'Shared': true})

    const folderOpener = (state: any, action: { name: string; open: boolean }) => {
        state[action.name] = action.open;
        setRender(render + 1)
        return state
    }
    const [openFolders, setOpenFolders] = useReducer(folderOpener, _init)

    const onDeleteView = (viewName: string) => {
      post(
        `${aC.apiUrl}${ENDPOINT_VIEW_DELETE}`,
        JSON.stringify({ name: viewName, private: false })
      ).then((res) => {
        if (res.ok) {
          aC.setViews(_.filter(aC.views, (v) => v.name != viewName ));
        } else {
          console.warn(res)
        }
      })
    }

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
                            c.id,
                            c.position,
                            c.size,
                            c.resolution,
                        )),
                        _.map(o.dropZones, (dz) => new DropZone(
                          dz.cellId, 
                          dz.dropZoneName,
                          _.map(dz.items, (item) => obj2ChipItem(item)),
                          dz.name
                      )),
                      o.isPrivate,
                    ))
                    aC.setViews(views)
                })
                let view = _.filter(aC.views, (v) => v.name === viewName)[0]
                view.dropZones.forEach((dz) => {
                  aC.setDropZones(dz)
              })
              aC.setDatasets(view.datasets)
              aC.setOpenDatasets(true)
              aC.setCells(view.cells)
            } else {
                console.log(res)
            }
        })
    }

    return (
      <MenuList>
        <MenuItem dense onClick={() => setOpenViews(!openViews)}>
          <ListItemIcon>
            {openViews ? <ExpandMore /> : <ChevronRight />}
          </ListItemIcon>
          <ListItemText>Views</ListItemText>
        </MenuItem>

        <Collapse in={openViews} timeout="auto" unmountOnExit>
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
                      {openFolders[folder] ? <ExpandMore /> : <ChevronRight />}
                    </ListItemIcon>

                    <ListItemIcon sx= {{ml: -2}}>
                      <FolderOpen />
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
                          <Fragment>
                            <MenuItem
                              sx={{ pl: 5 }}
                              dense
                              key={v.name}
                              onClick={(e) => {
                                setSetelectedView(v);
                                handleClick(e);
                              }}
                            >
                              <ListItemIcon>
                                <Dashboard fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>{v.name}</ListItemText>
                              <ListItemIcon>
                                <ReadMore fontSize="small" />
                              </ListItemIcon>
                            </MenuItem>
                            <StyledMenu
                              anchorEl={anchorEl}
                              open={anchorMenuOpen}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              onClose={handleClose}
                              TransitionComponent={Fade}
                            >
                              {`   ${selectedView!.name}:`}
                              <MenuItem
                                onClick={() => {
                                  onLoadView(selectedView!.name);
                                  handleClose();
                                }}
                                disableRipple
                              >
                                <DoubleArrow />
                                Load
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  onDeleteView(selectedView!.name);
                                  handleClose();
                                }}
                                disableRipple
                              >
                                <Delete />
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  v.isPrivate = !v.isPrivate;
                                }}
                                disableRipple
                              >
                                {selectedView!.isPrivate ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                                {selectedView!.isPrivate
                                  ? "Make Public"
                                  : "Make Private"}
                              </MenuItem>
                            </StyledMenu>
                          </Fragment>
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
