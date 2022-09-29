import { AddCircleOutline, ExpandLess, ExpandMore, TableView } from "@mui/icons-material";
import { Collapse, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import * as _ from "lodash"
import { useContext, useEffect, useReducer, useState } from "react"
import { AppContext } from "../../../../AppContext";
import { ChipItem } from "../../classes/ChipItem";
import { DropZone } from "../../classes/DropZone";
import { dataDrawerDropId } from "../../Const";
import { DropZoneC } from "../DropZoneC";

export default function DatasetsList() {
    const aC = useContext(AppContext)
    const [render, setRender] = useState<number>(0)

    let _init = _.reduce(aC.datasets, 
        (result: { [key: string]: boolean }, ds) => {
            result[ds.name] = false;
            return result
        }, {})

    const zoneOpener = (state: any, action: { name: string; open: boolean }) => {
        state[action.name] = action.open;
        setRender(render + 1)
        return state
    }
    const [openDropZones, setOpenDropZones] = useReducer(zoneOpener, _init)

    useEffect(() => {
        _.forEach(
            _.sortBy(aC.datasets, (ds) => ds.name),
            (ds) => {
                aC.setDropZones(
                  new DropZone(
                    dataDrawerDropId + ds.name,
                    _.map(
                      _.keys(ds.schema),
                      (name) =>
                        new ChipItem(name, ds.schema[name], dataDrawerDropId)
                    )
                  )
                );
            }
            )
            }, [aC.datasets]
        )

    return (
      <MenuList sx={{ width: "100%" }} component="nav" disablePadding dense>
        <MenuItem dense onClick={() => aC.setOpenDatasets(!aC.openDatasets)}>
          <ListItemIcon>
            {aC.openDatasets ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText>Data Sets</ListItemText>
          <ListItemIcon onClick={() => aC.setDiscoveryDataModalOpen(true)}>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          {/* <DataSourceModal /> */}
        </MenuItem>
        <Collapse in={aC.openDatasets} timeout="auto" unmountOnExit>
          {_.map(
            _.sortBy(aC.datasets, (ds) => ds.name),
            (ds) => {
              return (
                <MenuList
                  sx={{ width: "100%" }}
                  component="nav"
                  disablePadding
                  dense
                  key={ds.name}
                >
                  <MenuItem
                    dense
                    onClick={() =>
                      setOpenDropZones({
                        name: ds.name,
                        open: !openDropZones[ds.name],
                      })
                    }
                  >
                    <ListItemIcon>
                      {openDropZones[ds.name] ? <ExpandLess /> : <ExpandMore />}
                      <TableView fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={ds.name} />
                  </MenuItem>
                  <Collapse
                    in={openDropZones[ds.name]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <DropZoneC
                      dropZone={aC.dropZones[dataDrawerDropId + ds.name]}
                      header=""
                    ></DropZoneC>
                  </Collapse>
                </MenuList>
              );
            }
          )}
        </Collapse>
      </MenuList>
    );
}