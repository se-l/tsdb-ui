import { ExpandLess, ExpandMore, Save } from "@mui/icons-material";
import { avatarClasses, Button, Divider, Grid, MenuItem, Stack, TextField, Toolbar, Typography } from "@mui/material";
import * as _ from "lodash";
import { useContext, useState} from "react";
import { post } from "../../../api/network";
import { AppContext } from "../../../AppContext";
import { ENDPOINT_VIEW_SAVE } from "../../../Constants";
import { getNewId } from "../../../utils";
import { Cell } from "../classes/Cell";
import { DropZone } from "../classes/DropZone";
import { View } from "../classes/View";
import { mapEncodingHeader } from "../Const";
import { CellType } from "../types/CellType";
import { StyledMenu } from "./AnchoredMenu";

export default function ToolbarView() {
    const aC = useContext(AppContext)
    const [viewName, setViewName] = useState<string>("")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const anchorMenuOpen = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    const appendNewCell = (cellType: CellType) => {
        let newId = getNewId(aC.dropZones)
        let dropZones = _.map(Object.keys(mapEncodingHeader), (encoding) => {
            return new DropZone(newId, encoding, [], mapEncodingHeader[encoding])
        })
        _.forEach(dropZones, (dz) => {
            aC.setDropZones(dz);
        })
        aC.setEnableRnd(true)
        aC.setCells(aC.cells.concat(new Cell(cellType, newId)))
    }

    const viewSave = () => {
        let view = new View("Shared", viewName, aC.datasets, aC.cells, Object.values(aC.dropZones))
        post(`${aC.apiUrl}${ENDPOINT_VIEW_SAVE}`, JSON.stringify(view)).then((res) => {
            if (res.ok) {
                aC.setViews(_.sortBy(_.filter(aC.views, (v) => v.name != viewName).concat(view), (v) => v.name))
            } else {
                console.log(res)
            }
        })
    }

    return (
        <Toolbar
        disableGutters
        variant="dense"
        className="toolBarView"
        sx={{ px: 1}}
        >
            <Grid direction="row" container spacing={4}>
                <Grid item>
                    <Button size="small" variant="outlined" onClick={handleClick} endIcon={anchorMenuOpen ? <ExpandLess /> : <ExpandMore />}>
                        Save View
                    </Button>
                </Grid>

                <Divider orientation="vertical"/>

                <Grid item>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>New</Typography>
                        {_.map(CellType, (key) => (
                            <Button id={`newCellButton-${key}`} variant="outlined" onClick={() => appendNewCell(key)} size="small">
                                {key}
                            </Button>

                        ))}
                    </Stack>
                </Grid>

                <Divider orientation="vertical"/>

                <Grid item>
                    <Button id={`dragResizeOff`} variant="outlined" onClick={() => aC.setEnableRnd(!aC.enableRnd)} size="small" color={aC.enableRnd ? 'warning': 'primary'}>
                        Drag/Resize: {aC.enableRnd ? "On":"Off"}
                    </Button>
                </Grid>
            </Grid>

            <StyledMenu
                anchorEl={anchorEl}
                open={anchorMenuOpen}
                onClose={handleClose}
            >
                <MenuItem disableRipple>
                    <TextField autoFocus size="small" label="View Name?" variant="outlined" value={viewName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setViewName(e.target.value)}}
                    />
                </MenuItem>

                <MenuItem
                onClick={() => {handleClose(); viewSave()}} disableRipple
                >
                    <Save />
                    Yes, Save
                </MenuItem>

            </StyledMenu>
        </Toolbar>
    )
}