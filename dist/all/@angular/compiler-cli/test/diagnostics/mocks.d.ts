/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AotCompilerHost, CompileMetadataResolver, NgAnalyzedModules, StaticReflector, StaticSymbol, StaticSymbolResolver } from '@angular/compiler';
import { CompilerHostContext } from 'compiler-cli';
import * as ts from 'typescript';
import { DiagnosticTemplateInfo } from '../../src/diagnostics/expression_diagnostics';
import { Directory } from '../mocks';
export declare class MockLanguageServiceHost implements ts.LanguageServiceHost, CompilerHostContext {
    private scripts;
    private options;
    private context;
    private assumedExist;
    constructor(scripts: string[], files: Directory, currentDirectory?: string);
    getCompilationSettings(): ts.CompilerOptions;
    getScriptFileNames(): string[];
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    readFile(fileName: string): string;
    readResource(fileName: string): Promise<string>;
    assumeFileExists(fileName: string): void;
    fileExists(fileName: string): boolean;
    private internalReadFile(fileName);
}
export declare class DiagnosticContext {
    service: ts.LanguageService;
    program: ts.Program;
    checker: ts.TypeChecker;
    host: AotCompilerHost;
    _analyzedModules: NgAnalyzedModules;
    _staticSymbolResolver: StaticSymbolResolver | undefined;
    _reflector: StaticReflector | undefined;
    _errors: {
        e: any;
        path?: string;
    }[];
    _resolver: CompileMetadataResolver | undefined;
    _refletor: StaticReflector;
    constructor(service: ts.LanguageService, program: ts.Program, checker: ts.TypeChecker, host: AotCompilerHost);
    private collectError(e, path?);
    private readonly staticSymbolResolver;
    readonly reflector: StaticReflector;
    readonly resolver: CompileMetadataResolver;
    readonly analyzedModules: NgAnalyzedModules;
    getStaticSymbol(path: string, name: string): StaticSymbol;
}
export declare function getDiagnosticTemplateInfo(context: DiagnosticContext, type: StaticSymbol, templateFile: string, template: string): DiagnosticTemplateInfo | undefined;
