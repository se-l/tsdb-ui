import * as _ from "lodash";
import { Box, Typography } from "@mui/material";
import React from "react";
import { DropZone } from "../classes/DropZone";
import { DropZoneC } from "./DropZoneC";
import { ColorLens, TextFormat } from "@mui/icons-material";

const mapName2Jsx: { [key: string]: JSX.Element} = {
    TextFormatIcon: <TextFormat sx={{ margin: "auto 0 auto 0"}} />,
    ColorLensIcon: <ColorLens sx={{ margin: "auto 0 auto 0"}} />,
}
const getHeaderJsx = (name: string): JSX.Element => {
    if (Object.keys(mapName2Jsx).includes(name)) {
        return mapName2Jsx[name];
    } else {
        return (
            <Typography sx={{ fontWeight: "bold", margin: "auto 0 auto 0" }}>
                {name}
            </Typography>
        )
    }
}

interface IPlotEncodings {
    dropZones: DropZone[];
}

export default React.memo(function PlotEncodings({dropZones}: IPlotEncodings) {
    console.log("PlotEncodings")

    return (
        <Box>
            <Typography sx={{ fontWeight: "bold" }}>Encoding</Typography>
            {_.map(dropZones, (dz) => {
                return <DropZoneC dropZone={dz} header={getHeaderJsx(dz.name)} />;
            })}
        </Box>
    )
})