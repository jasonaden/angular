import * as ts from 'typescript';
import { Diagnostics, Span } from '../src/types';
export declare type MockData = string | MockDirectory;
export declare type MockDirectory = {
    [name: string]: MockData | undefined;
};
/**
 * The cache is valid if all the returned entries are empty.
 */
export declare function validateCache(): {
    exists: string[];
    unused: string[];
    reported: string[];
};
export declare class MockTypescriptHost implements ts.LanguageServiceHost {
    private scriptNames;
    private data;
    private angularPath;
    private nodeModulesPath;
    private scriptVersion;
    private overrides;
    private projectVersion;
    private options;
    private overrideDirectory;
    constructor(scriptNames: string[], data: MockData);
    override(fileName: string, content: string): void;
    addScript(fileName: string, content: string): void;
    forgetAngular(): void;
    overrideOptions(cb: (options: ts.CompilerOptions) => ts.CompilerOptions): void;
    getCompilationSettings(): ts.CompilerOptions;
    getProjectVersion(): string;
    getScriptFileNames(): string[];
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    directoryExists(directoryName: string): boolean;
    getMarkerLocations(fileName: string): {
        [name: string]: number;
    } | undefined;
    getReferenceMarkers(fileName: string): ReferenceResult | undefined;
    getFileContent(fileName: string): string | undefined;
    private getRawFileContent(fileName);
    private getEffectiveName(name);
}
export declare type ReferenceMarkers = {
    [name: string]: Span[];
};
export interface ReferenceResult {
    text: string;
    definitions: ReferenceMarkers;
    references: ReferenceMarkers;
}
export declare function noDiagnostics(diagnostics: Diagnostics): void;
export declare function includeDiagnostic(diagnostics: Diagnostics, message: string, text?: string, len?: string): void;
export declare function includeDiagnostic(diagnostics: Diagnostics, message: string, at?: number, len?: number): void;
