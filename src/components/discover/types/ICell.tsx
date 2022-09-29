import { DropZone } from "../classes/DropZone";
import { CellType } from "./CellType";

export interface ICell {
    type: CellType;
    name?: string;
    dropZones: DropZone[];
}