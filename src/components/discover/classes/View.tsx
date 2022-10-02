import { Cell } from "./Cell";
import { Dataset } from "./Dataset";
import { DropZone } from "./DropZone";

export class View {
    folder: string;
    name: string;
    datasets: Dataset[]
    cells: Cell[]
    dropZones: DropZone[]
    byUser?: string | undefined;
    isPrivate?: boolean;

    constructor(folder: string, name: string, datasets: Dataset[], cells: Cell[], dropZones: DropZone[], isPrivate?: boolean) {
        this.folder = folder
        this.name = name
        this.datasets = datasets
        this.cells = cells
        this.dropZones = dropZones;
        this.isPrivate = isPrivate || false;
    }
}