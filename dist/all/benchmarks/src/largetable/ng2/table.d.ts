import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TableCell } from '../util';
export declare class TableComponent {
    data: TableCell[][];
    trackByIndex(index: number, item: any): number;
    getColor(row: number): SafeStyle;
}
export declare class AppModule {
    constructor(sanitizer: DomSanitizer);
}
