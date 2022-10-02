import * as _ from "lodash";
import { RemoveCircleOutline } from "@mui/icons-material";
import { Box, Grid, ListItemIcon, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { AppContext } from "../../../AppContext";
import { Cell } from "../classes/Cell";
import { DropZoneRow } from "../Const";
import { CellType } from "../types/CellType";
import { ChartPlotly } from "./ChartPlotly";
import PlotEncodings from "./PlotEncodings";

interface ICellC {
    cell: Cell,
}

export default function CellC({cell}: ICellC) {
    const aC = useContext(AppContext)
    const [encodingOpen, setEncodingOpen] = useState<boolean>(true)

    const getItemNames = (dropZoneName: string) => {
        return aC.dropZones[`${cell.id}-${dropZoneName}`].itemNames()
    }

    useEffect(() => {
        console.log("Render CellC")
    }, [aC.dropZones])

    let Plot = <></>
    if (cell.type === CellType.Grid) {
        // Plot = (
        //     <ChartAgGrid
        //     id={cell.name}
        //     rowData={aC.datasets.length >0 ? aC.datasets[0].data : []}
        //     dropZon
        //     />
        // )
    } else if (cell.type === CellType.Plotly) {
        Plot = (
            <ChartPlotly
            data={aC.datasets.length > 0 ? aC.datasets[0].data : []}
            dropZoneAxisXItems={getItemNames(DropZoneRow.dropZoneAxisX)}
            dropZoneAxisYItems={getItemNames(DropZoneRow.dropZoneAxisY)}
            dropZoneMarksTextItems={getItemNames(DropZoneRow.dropZoneMarksText)}
            dropZoneMarksColorItems={getItemNames(DropZoneRow.dropZoneMarksColor)}
            />
        )
    }

    const removeCell = (cell: Cell) => {
        const [rm] = aC.cells.splice(aC.cells.indexOf(cell), 1);
        aC.setCells(aC.cells)
        aC.setRedrawGrid(aC.redrawGrid + 1)
    }

    return (
        <Rnd
        onDragStop={(e, d: any) => {
            cell.setPosition({x: d.x, y: d.y})
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
            cell.setResize({width: ref.clientWidth, height: ref.clientHeight })
        }}
        default={{
            height: cell.getSize().height,
            width: cell.getSize().width,
            x: cell.getPosition().x,
            y: cell.getPosition().y,
        }}
        disableDragging={!aC.enableRnd}
        enableResizing={aC.enableRnd}
        >
            <Paper elevation={6} sx={{height: "100%", width: "100%"}}>
            <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={2} sx={{ display: aC.layoutDrawerOpen === true ? "block" : "none"}}>
                    <ListItemIcon onClick={() => removeCell(cell)}>
                        <RemoveCircleOutline fontSize="small" />
                    </ListItemIcon>
                    <Box sx={{display: encodingOpen ? "block" : "none" }}>
                        <PlotEncodings dropZones={_.filter(aC.dropZones, (dz) => dz.cellId === cell.id)} />
                    </Box>
                </Grid>
                <Grid item xs={10}>
                    {Plot}
                </Grid>
            </Grid>
            </Paper>
        </Rnd>
    )
}