import * as _ from "lodash"
import { DropZone } from "./components/discover/classes/DropZone"

export const propsAreEqual = (prevProps: any, nextProps: any) => {
    return _.reduce(prevProps, function(result, value, key) {
        return result && (JSON.stringify(nextProps[key]) === JSON.stringify(value))
    })
}

export const getNewId = (dropZonesMap: { [key: string]: DropZone}) => {
    return _.map(dropZonesMap, (dz) => dz.cellId).length > 0 ?
    1+ Math.max(..._.map(dropZonesMap, (dz) => typeof(dz.cellId) === 'number' ? dz.cellId : 0)) : 1
}