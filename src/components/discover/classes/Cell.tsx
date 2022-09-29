import { CellType } from "../types/CellType";
import { DropZone } from "./DropZone";

export class Cell {
    type: CellType;
    dropZones: DropZone[];
    name: string;

    constructor(type: CellType, dropZones: DropZone[], name: string = "") {
        this.type = type;
        this.dropZones = dropZones;
        this.name = name;
    }
}