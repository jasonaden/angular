import { AngularCompilerOptions } from '@angular/tsc-wrapped';
import * as ts from 'typescript';
export interface NgTools_InternalApi_NG2_CodeGen_Options {
    basePath: string;
    compilerOptions: ts.CompilerOptions;
    program: ts.Program;
    host: ts.CompilerHost;
    angularCompilerOptions: AngularCompilerOptions;
    i18nFormat?: string;
    i18nFile?: string;
    locale?: string;
    missingTranslation?: string;
    readResource: (fileName: string) => Promise<string>;
}
export interface NgTools_InternalApi_NG2_ListLazyRoutes_Options {
    program: ts.Program;
    host: ts.CompilerHost;
    angularCompilerOptions: AngularCompilerOptions;
    entryModule: string;
}
export interface NgTools_InternalApi_NG_2_LazyRouteMap {
    [route: string]: string;
}
export interface NgTools_InternalApi_NG2_ExtractI18n_Options {
    basePath: string;
    compilerOptions: ts.CompilerOptions;
    program: ts.Program;
    host: ts.CompilerHost;
    angularCompilerOptions: AngularCompilerOptions;
    i18nFormat?: string;
    readResource: (fileName: string) => Promise<string>;
    locale?: string;
    outFile?: string;
}
