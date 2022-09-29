import { Dataset } from "../classes/Dataset";

export interface IView {
    folder: string;
    name: string;
    byUser?: string;
    datasets: Dataset[];
}