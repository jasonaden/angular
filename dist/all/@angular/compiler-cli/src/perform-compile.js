"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var api = require("./transformers/api");
var ng = require("./transformers/entry_points");
var TS_EXT = /\.ts$/;
function isTsDiagnostics(diagnostics) {
    return diagnostics && diagnostics[0] && (diagnostics[0].file || diagnostics[0].messageText);
}
function formatDiagnostics(cwd, diags) {
    if (diags && diags.length) {
        if (isTsDiagnostics(diags)) {
            return ts.formatDiagnostics(diags, {
                getCurrentDirectory: function () { return cwd; },
                getCanonicalFileName: function (fileName) { return fileName; },
                getNewLine: function () { return ts.sys.newLine; }
            });
        }
        else {
            return diags
                .map(function (d) {
                var res = api.DiagnosticCategory[d.category];
                if (d.span) {
                    res +=
                        " at " + d.span.start.file.url + "(" + (d.span.start.line + 1) + "," + (d.span.start.col + 1) + ")";
                }
                if (d.span && d.span.details) {
                    res += ": " + d.span.details + ", " + d.message + "\n";
                }
                else {
                    res += ": " + d.message + "\n";
                }
                return res;
            })
                .join();
        }
    }
    else
        return '';
}
/**
 * Throw a syntax error exception with a message formatted for output
 * if the args parameter contains diagnostics errors.
 *
 * @param cwd   The directory to report error as relative to.
 * @param args  A list of potentially empty diagnostic errors.
 */
function throwOnDiagnostics(cwd) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.some(function (diags) { return !!(diags && diags[0]); })) {
        throw compiler_1.syntaxError(args.map(function (diags) {
            if (diags && diags[0]) {
                return formatDiagnostics(cwd, diags);
            }
        })
            .filter(function (message) { return !!message; })
            .join(''));
    }
}
exports.throwOnDiagnostics = throwOnDiagnostics;
function readConfiguration(project, basePath, checkFunc, existingOptions) {
    if (checkFunc === void 0) { checkFunc = throwOnDiagnostics; }
    // Allow a directory containing tsconfig.json as the project value
    // Note, TS@next returns an empty array, while earlier versions throw
    var projectFile = fs.lstatSync(project).isDirectory() ? path.join(project, 'tsconfig.json') : project;
    var _a = ts.readConfigFile(projectFile, ts.sys.readFile), config = _a.config, error = _a.error;
    if (error)
        checkFunc(basePath, [error]);
    var parseConfigHost = {
        useCaseSensitiveFileNames: true,
        fileExists: fs.existsSync,
        readDirectory: ts.sys.readDirectory,
        readFile: ts.sys.readFile
    };
    var parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, existingOptions);
    checkFunc(basePath, parsed.errors);
    // Default codegen goes to the current directory
    // Parsed options are already converted to absolute paths
    var ngOptions = config.angularCompilerOptions || {};
    // Ignore the genDir option
    ngOptions.genDir = basePath;
    return { parsed: parsed, ngOptions: ngOptions };
}
exports.readConfiguration = readConfiguration;
/**
 * Returns an object with two properties:
 * - `errorCode` is 0 when the compilation was successful,
 * - `result` is an `EmitResult` when the errorCode is 0, `undefined` otherwise.
 */
function performCompilation(basePath, files, options, ngOptions, consoleError, checkFunc, tsCompilerHost) {
    if (consoleError === void 0) { consoleError = console.error; }
    if (checkFunc === void 0) { checkFunc = throwOnDiagnostics; }
    var _a = ts.version.split('.'), major = _a[0], minor = _a[1];
    if (+major < 2 || (+major === 2 && +minor < 3)) {
        throw new Error('Must use TypeScript > 2.3 to have transformer support');
    }
    try {
        ngOptions.basePath = basePath;
        ngOptions.genDir = basePath;
        var host = tsCompilerHost || ts.createCompilerHost(options, true);
        host.realpath = function (p) { return p; };
        var rootFileNames_1 = files.map(function (f) { return path.normalize(f); });
        var addGeneratedFileName = function (fileName) {
            if (fileName.startsWith(basePath) && TS_EXT.exec(fileName)) {
                rootFileNames_1.push(fileName);
            }
        };
        if (ngOptions.flatModuleOutFile && !ngOptions.skipMetadataEmit) {
            var _b = tsc_wrapped_1.createBundleIndexHost(ngOptions, rootFileNames_1, host), bundleHost = _b.host, indexName = _b.indexName, errors = _b.errors;
            if (errors)
                checkFunc(basePath, errors);
            if (indexName)
                addGeneratedFileName(indexName);
            host = bundleHost;
        }
        var ngHostOptions = __assign({}, options, ngOptions);
        var ngHost = ng.createHost({ tsHost: host, options: ngHostOptions });
        var ngProgram = ng.createProgram({ rootNames: rootFileNames_1, host: ngHost, options: ngHostOptions });
        // Check parameter diagnostics
        checkFunc(basePath, ngProgram.getTsOptionDiagnostics(), ngProgram.getNgOptionDiagnostics());
        // Check syntactic diagnostics
        checkFunc(basePath, ngProgram.getTsSyntacticDiagnostics());
        // Check TypeScript semantic and Angular structure diagnostics
        checkFunc(basePath, ngProgram.getTsSemanticDiagnostics(), ngProgram.getNgStructuralDiagnostics());
        // Check Angular semantic diagnostics
        checkFunc(basePath, ngProgram.getNgSemanticDiagnostics());
        var result = ngProgram.emit({
            emitFlags: api.EmitFlags.Default |
                ((ngOptions.skipMetadataEmit || ngOptions.flatModuleOutFile) ? 0 : api.EmitFlags.Metadata)
        });
        checkFunc(basePath, result.diagnostics);
        return { errorCode: 0, result: result };
    }
    catch (e) {
        if (compiler_1.isSyntaxError(e)) {
            consoleError(e.message);
            return { errorCode: 1 };
        }
        throw e;
    }
}
exports.performCompilation = performCompilation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybS1jb21waWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9wZXJmb3JtLWNvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILDhDQUE2RDtBQUM3RCxvREFBMkQ7QUFDM0QsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsd0NBQTBDO0FBQzFDLGdEQUFrRDtBQUVsRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFJdkIseUJBQXlCLFdBQWdCO0lBQ3ZDLE1BQU0sQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUVELDJCQUEyQixHQUFXLEVBQUUsS0FBa0I7SUFDeEQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pDLG1CQUFtQixFQUFFLGNBQU0sT0FBQSxHQUFHLEVBQUgsQ0FBRztnQkFDOUIsb0JBQW9CLEVBQUUsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLEVBQVIsQ0FBUTtnQkFDMUMsVUFBVSxFQUFFLGNBQU0sT0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBZCxDQUFjO2FBQ2pDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxLQUFLO2lCQUNQLEdBQUcsQ0FBQyxVQUFB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