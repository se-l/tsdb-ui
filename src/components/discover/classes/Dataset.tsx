export class Dataset {
    id: number;
    name: string;
    schema: any;
    data: any[];
    code?: string;

    constructor(id: number, name: string, schema: string, data: any[], code?: string) {
        this.id = id;
        this.name = name;
        this.schema = schema;
        this.data = data;
        this.code = code || "";
    }
}