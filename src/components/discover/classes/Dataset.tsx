import { IDataset } from "../types/IDataset";

export class Dataset implements IDataset {
    name: string;
    schema: any;
    data: any[];
    code?: string;

    constructor(name: string, schema: string, data: any[], code: string = "") {
        this.name = name;
        this.schema = schema;
        this.data = data;
        this.code = code;
    }
}