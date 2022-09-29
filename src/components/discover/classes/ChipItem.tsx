import { ChipType } from "../types/ChipType";

export class ChipItem {
    name: string;
    type: ChipType;
    droppableId: string;

    constructor(name: string, type: ChipType, droppableId: string) {
        this.name = name;
        this.type = type;
        this.droppableId = droppableId
    }
}