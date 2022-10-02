import { CellType } from "../types/CellType";
import { DropZone } from "./DropZone";

export class Cell {
    type: CellType;
    id: number;
    position?: { [key: string]: number };
    size?: { [key: string] : number };
    resolution?: { [key: string]: number };

    constructor(
        type: CellType, 
        id: number, 
        position?: { [key: string]: number },
        size?: { [key: string]: number },
        resolution?: { [key: string]: number } ,
     ) {
        this.type = type;
        this.id = id;
        this.position = position || {x: 5, y: 10};
        this.size = size || {width: 300, height: 300 };
        this.resolution = resolution || {x: window.screen.width, y: window.screen.width};
    }

    setPosition(position: { [key: string]: number }) {
        this.setResolution()
        this.position = {x: window.screen.width / position.x, y: window.screen.width / position.y};
    }

    setResize(size: { [key: string]: number}) {
        this.setResolution()
        this.size = {
            width: window.screen.width / size.width,
            height: window.screen.height / size.height
        }
    }

    setResolution() {
        this.resolution = {x: window.screen.width, y: window.screen.height}
    }

    getPosition() {
        return {
            x: (this.resolution!.x / this.position!.x) | 0,
            y: (this.resolution!.y / this.position!.y) | 0
        }
    }

    getSize() {
        return {
            width: (this.resolution!.width / this.size!.width) | 200,
            height: (this.resolution!.height / this.size!.height) | 200
        }
    }
}