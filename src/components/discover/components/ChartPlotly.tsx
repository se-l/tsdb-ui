import _ from "lodash"
import React from "react";
import Plot from "react-plotly.js"
import { propsAreEqual } from "../../../utils";

interface IChartPlotly {
    id: string;
    data: any[];
    dropZoneAxisXItems?: string[];
    dropZoneAxisYItems?: string[];
    dropZoneMarksTextItems?: string[];
    dropZoneMarksColorItems?: string[];
}

export const ChartPlotly = React.memo(({id, data, dropZoneAxisXItems=[], dropZoneAxisYItems=[], dropZoneMarksTextItems=[], dropZoneMarksColorItems=[]}: IChartPlotly ) => {
    console.log(`Render ChartPlotly ${id}`)

    let x = []
    let y = []
    if (dropZoneAxisXItems.length > 0) {
        x = _.map(data, (d) => d[dropZoneAxisXItems[0]])
    }
    if (dropZoneAxisYItems.length > 0) {
        y = _.map(data, (d) => d[dropZoneAxisYItems[0]])
    }
    var dataChart: Plotly.Data[] = [
        {
            x: x,
            y: y,
            type: "bar"
        }
    ]

    return (
        <React.Fragment>
            <Plot 
            data={dataChart}
            layout={{ autosize: true }}
            config={{ responsive: true}}
            useResizeHandler
            className="full"
            />
        </React.Fragment>
    )
}, propsAreEqual)