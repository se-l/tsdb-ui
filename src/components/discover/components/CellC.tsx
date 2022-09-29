import { RemoveCircleOutline } from "@mui/icons-material";
import { Grid, ListItemIcon } from "@mui/material";
import { useContext, useEffect } from "react";
import { AppContext } from "../../../AppContext";
import { Cell } from "../classes/Cell";
import { CellType } from "../types/CellType";
import { ChartPlotly } from "./ChartPlotly";
import DragResize from "./DragResize";
import PlotEncodings from "./PlotEncodings";

interface ICellC {
    cell: Cell,
}

export default function CellC({cell}: ICellC) {
    const aC = useContext(AppContext)

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
            id={cell.name}
            data={aC.datasets.length >0 ? aC.datasets[0].data : []}
            dropZoneAxisXItems={aC.dropZones[cell.dropZones[0].id].itemNames()}
            dropZoneAxisYItems={aC.dropZones[cell.dropZones[1].id].itemNames()}
            dropZoneMarksTextItems={aC.dropZones[cell.dropZones[2].id].itemNames()}
            dropZoneMarksColorItems={aC.dropZones[cell.dropZones[3].id].itemNames()}
            />
        )
    }

    const removeCell = (cell: Cell) => {
        const [rm] = aC.cells.splice(aC.cells.indexOf(cell), 1);
        aC.setCells(aC.cells)
        aC.setRedrawGrid(aC.redrawGrid + 1)
    }

    return (
        <DragResize>
            <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={2} sx={{ display: aC.layoutDrawerOpen === true ? "block" : "none"}}>
                    <ListItemIcon onClick={() => removeCell(cell)}>
                        <RemoveCircleOutline fontSize="small" />
                    </ListItemIcon>
                    <PlotEncodings id={cell.name} dropZones={cell.dropZones} />
                </Grid>
                <Grid item xs={10}>
                    {Plot}
                </Grid>
            </Grid>
        </DragResize>
    )
}