import * as _ from "lodash";
import { ChipItem } from "./ChipItem";

export class DropZone {
    cellId: number;
    dropZoneName: string;
    items: ChipItem[];
    name: string;

    constructor(cellId: number, dropZoneName: string, items: ChipItem[], name: string = "") {
        this.cellId = cellId;
        this.dropZoneName = dropZoneName;
        this.items = items;
        this.name = name === "" ? this.id: name
    }

    get id() {
      return `${this.cellId}-${this.dropZoneName}`
    }

    itemNames() {
      return _.map(this.items, (item) => item.name);
    }
}