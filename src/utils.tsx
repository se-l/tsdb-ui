import * as _ from "lodash"

export const propsAreEqual = (prevProps: any, nextProps: any) => {
    return _.reduce(prevProps, function(result, value, key) {
        return result && (JSON.stringify(nextProps[key]) === JSON.stringify(value))
    })
}