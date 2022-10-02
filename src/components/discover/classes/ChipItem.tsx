import { ChipType } from "../types/ChipType";

export class ChipItem {
    name: string;
    type: ChipType;
    dropZoneId: string;

    constructor(name: string, type: ChipType, dropZoneId: string) {
        this.name = name;
        this.type = type;
        this.dropZoneId = dropZoneId
    }
}

export const obj2ChipItem = (obj: any) => new ChipItem( obj.name, obj.type, obj.dropZoneId)