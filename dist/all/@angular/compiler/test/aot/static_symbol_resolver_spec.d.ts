/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticSymbol, StaticSymbolResolverHost, Summary, SummaryResolver } from '@angular/compiler';
import { CollectorOptions } from '@angular/tsc-wrapped';
export declare class MockSummaryResolver implements SummaryResolver<StaticSymbol> {
    private summaries;
    private importAs;
    constructor(summaries?: Summary<StaticSymbol>[], importAs?: {
        symbol: StaticSymbol;
        importAs: StaticSymbol;
    }[]);
    addSummary(summary: Summary<StaticSymbol>): void;
    resolveSummary(reference: StaticSymbol): Summary<StaticSymbol>;
    getSymbolsOf(filePath: string): StaticSymbol[];
    getImportAs(symbol: StaticSymbol): StaticSymbol;
    isLibraryFile(filePath: string): boolean;
    getLibraryFileName(filePath: string): string;
}
export declare class MockStaticSymbolResolverHost implements StaticSymbolResolverHost {
    private data;
    private collector;
    constructor(data: {
        [key: string]: any;
    }, collectorOptions?: CollectorOptions);
    moduleNameToFileName(modulePath: string, containingFile?: string): string;
    fileNameToModuleName(filePath: string, containingFile: string): string;
    getMetadataFor(moduleId: string): any;
    private _getMetadataFor(filePath);
}
