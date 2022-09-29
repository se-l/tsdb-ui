import * as _ from "lodash";
import { ChipItem } from "./ChipItem";

export class DropZone {
    id: string;
    items: ChipItem[];
    name: string;

    constructor(id: string, items: ChipItem[], name: string = "") {
        this.id = id;
        this.items = items;
        this.name = name === "" ? id: name
    }

    itemNames() {
      return _.map(this.items, (item) => item.name);
    }
}