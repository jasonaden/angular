/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AotSummaryResolverHost } from '@angular/compiler';
import { OutputContext } from '@angular/compiler/src/util';
export declare function main(): void;
export declare class MockAotSummaryResolverHost implements AotSummaryResolverHost {
    private summaries;
    constructor(summaries: {
        [fileName: string]: string;
    });
    fileNameToModuleName(fileName: string): string;
    getOutputFileName(sourceFileName: string): string;
    isSourceFile(filePath: string): boolean;
    loadSummary(filePath: string): string;
}
export declare function createMockOutputContext(): OutputContext;
