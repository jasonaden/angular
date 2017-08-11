export declare class TableCell {
    row: number;
    col: number;
    value: string;
    constructor(row: number, col: number, value: string);
}
export declare let maxRow: number;
export declare let maxCol: number;
export declare const emptyTable: TableCell[][];
export declare function buildTable(): TableCell[][];
