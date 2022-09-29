import { IView } from "../types/IView";
import { Cell } from "./Cell";
import { Dataset } from "./Dataset";

export class View implements IView {
    folder: string;
    name: string;
    datasets: Dataset[]
    cells: Cell[]
    byUser?: string | undefined;

    constructor(folder: string, name: string, datasets: Dataset[], cells: Cell[]) {
        this.folder = folder
        this.name = name
        this.datasets = datasets
        this.cells = cells
    }
}