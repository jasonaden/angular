"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var fs = require("fs");
var path = require("path");
var tsickle = require("tsickle");
var ts = require("typescript");
var compiler_host_1 = require("../compiler_host");
var check_types_1 = require("../diagnostics/check_types");
var api_1 = require("./api");
var lower_expressions_1 = require("./lower_expressions");
var node_emitter_transform_1 = require("./node_emitter_transform");
var GENERATED_FILES = /\.ngfactory\.js$|\.ngstyle\.js$|\.ngsummary\.js$/;
var SUMMARY_JSON_FILES = /\.ngsummary.json$/;
var emptyModules = {
    ngModules: [],
    ngModuleByPipeOrDirective: new Map(),
    files: []
};
var AngularCompilerProgram = (function () {
    function AngularCompilerProgram(rootNames, options, host, oldProgram) {
        this.rootNames = rootNames;
        this.options = options;
        this.host = host;
        this.oldProgram = oldProgram;
        this._structuralDiagnostics = [];
        this.oldTsProgram = oldProgram ? oldProgram.getTsProgram() : undefined;
        this.tsProgram = ts.createProgram(rootNames, options, host, this.oldTsProgram);
        this.srcNames =
            this.tsProgram.getSourceFiles()
                .map(function (sf) { return sf.fileName; })
                .filter(function (f) { return !f.match(/\.ngfactory\.[\w.]+$|\.ngstyle\.[\w.]+$|\.ngsummary\.[\w.]+$/); });
        this.metadataCache = new lower_expressions_1.LowerMetadataCache({ quotedNames: true }, !!options.strictMetadataEmit);
        this.aotCompilerHost = new compiler_host_1.CompilerHost(this.tsProgram, options, host, /* collectorOptions */ undefined, this.metadataCache);
        if (host.readResource) {
            this.aotCompilerHost.loadResource = host.readResource.bind(host);
        }
        var aotOptions = getAotCompilerOptions(options);
        this.compiler = compiler_1.createAotCompiler(this.aotCompilerHost, aotOptions).compiler;
    }
    // Program implementation
    AngularCompilerProgram.prototype.getTsProgram = function () { return this.programWithStubs; };
    AngularCompilerProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
        return this.tsProgram.getOptionsDiagnostics(cancellationToken);
    };
    AngularCompilerProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
        return getNgOptionDiagnostics(this.options);
    };
    AngularCompilerProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
    };
    AngularCompilerProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
        return this.structuralDiagnostics;
    };
    AngularCompilerProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
        return this.programWithStubs.getSemanticDiagnostics(sourceFile, cancellationToken);
    };
    AngularCompilerProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
        var compilerDiagnostics = this.generatedFileDiagnostics;
        // If we have diagnostics during the parser phase the type check phase is not meaningful so skip
        // it.
        if (compilerDiagnostics && compilerDiagnostics.length)
            return compilerDiagnostics;
        return this.typeChecker.getDiagnostics(fileName, cancellationToken);
    };
    AngularCompilerProgram.prototype.loadNgStructureAsync = function () {
        var _this = this;
        return this.compiler.analyzeModulesAsync(this.rootNames)
            .catch(this.catchAnalysisError.bind(this))
            .then(function (analyzedModules) {
            if (_this._analyzedModules) {
                throw new Error('Angular structure loaded both synchronously and asynchronsly');
            }
            _this._analyzedModules = analyzedModules;
        });
    };
    AngularCompilerProgram.prototype.getLazyRoutes = function (cancellationToken) { return {}; };
    AngularCompilerProgram.prototype.emit = function (_a) {
        var _this = this;
        var _b = _a.emitFlags, emitFlags = _b === void 0 ? api_1.EmitFlags.Default : _b, cancellationToken = _a.cancellationToken;
        var emitMap = new Map();
        var tsickleCompilerHostOptions = {
            googmodule: false,
            untyped: true,
            convertIndexImportShorthand: true,
            transformDecorators: this.options.annotationsAs !== 'decorators',
            transformTypesToClosure: this.options.annotateForClosureCompiler,
        };
        var tsickleHost = {
            shouldSkipTsickleProcessing: function (fileName) { return /\.d\.ts$/.test(fileName); },
            pathToModuleName: function (context, importPath) { return ''; },
            shouldIgnoreWarningsForPath: function (filePath) { return false; },
            fileNameToModuleId: function (fileName) { return fileName; },
        };
        var expectedOut = this.options.expectedOut ?
            this.options.expectedOut.map(function (f) { return path.resolve(process.cwd(), f); }) :
            undefined;
        var result = tsickle.emitWithTsickle(this.programWithStubs, tsickleHost, tsickleCompilerHostOptions, this.host, this.options, 
        /* targetSourceFile */ undefined, createWriteFileCallback(emitFlags, this.host, this.metadataCache, emitMap, expectedOut), cancellationToken, (emitFlags & (api_1.EmitFlags.DTS | api_1.EmitFlags.JS)) == api_1.EmitFlags.DTS, this.calculateTransforms());
        this.generatedFiles.forEach(function (file) {
            // In order not to replicate the TS calculation of the out folder for files
            // derive the out location for .json files from the out location of the .ts files
            if (file.source && file.source.length && SUMMARY_JSON_FILES.test(file.genFileUrl)) {
                // If we have emitted the ngsummary.ts file, ensure the ngsummary.json file is emitted to
                // the same location.
                var emittedFile = emitMap.get(file.srcFileUrl);
                if (emittedFile) {
                    var fileName = path.join(path.dirname(emittedFile), path.basename(file.genFileUrl));
                    _this.host.writeFile(fileName, file.source, false, function (error) { });
                }
            }
        });
        // Ensure that expected output files exist.
        for (var _i = 0, _c = expectedOut || []; _i < _c.length; _i++) {
            var out = _c[_i];
            fs.appendFileSync(out, '', 'utf8');
        }
        return result;
    };
    Object.defineProperty(AngularCompilerProgram.prototype, "analyzedModules", {
        // Private members
        get: function () {
            return this._analyzedModules || (this._analyzedModules = this.analyzeModules());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "structuralDiagnostics", {
        get: function () {
            return this.analyzedModules && this._structuralDiagnostics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "stubs", {
        get: function () {
            return this._stubs || (this._stubs = this.generateStubs());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "stubFiles", {
        get: function () {
            return this._stubFiles ||
                (this._stubFiles = this.stubs.reduce(function (files, generatedFile) {
                    if (generatedFile.source || (generatedFile.stmts && generatedFile.stmts.length)) {
                        return files.concat([generatedFile.genFileUrl]);
                    }
                    return files;
                }, []));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "programWithStubsHost", {
        get: function () {
            return this._programWithStubsHost || (this._programWithStubsHost = createProgramWithStubsHost(this.stubs, this.tsProgram, this.host));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "programWithStubs", {
        get: function () {
            return this._programWithStubs || (this._programWithStubs = this.createProgramWithStubs());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "generatedFiles", {
        get: function () {
            return this._generatedFiles || (this._generatedFiles = this.generateFiles());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "typeChecker", {
        get: function () {
            return (this._typeChecker && !this._typeChecker.partialResults) ?
                this._typeChecker :
                (this._typeChecker = this.createTypeChecker());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "generatedFileDiagnostics", {
        get: function () {
            return this.generatedFiles && this._generatedFileDiagnostics;
        },
        enumerable: true,
        configurable: true
    });
    AngularCompilerProgram.prototype.calculateTransforms = function () {
        var beforeTs = [];
        if (!this.options.disableExpressionLowering) {
            beforeTs.push(lower_expressions_1.getExpressionLoweringTransformFactory(this.metadataCache));
        }
        if (!this.options.skipTemplateCodegen) {
            beforeTs.push(node_emitter_transform_1.getAngularEmitterTransformFactory(this.generatedFiles));
        }
        return { beforeTs: beforeTs };
    };
    AngularCompilerProgram.prototype.catchAnalysisError = function (e) {
        if (compiler_1.isSyntaxError(e)) {
            var parserErrors = compiler_1.getParseErrors(e);
            if (parserErrors && parserErrors.length) {
                this._structuralDiagnostics =
                    parserErrors.map(function (e) { return ({
                        message: e.contextualMessage(),
                        category: api_1.DiagnosticCategory.Error,
                        span: e.span
                    }); });
            }
            else {
                this._structuralDiagnostics = [{ message: e.message, category: api_1.DiagnosticCategory.Error }];
            }
            this._analyzedModules = emptyModules;
            return emptyModules;
        }
        throw e;
    };
    AngularCompilerProgram.prototype.analyzeModules = function () {
        try {
            return this.compiler.analyzeModulesSync(this.srcNames);
        }
        catch (e) {
            return this.catchAnalysisError(e);
        }
    };
    AngularCompilerProgram.prototype.generateStubs = function () {
        return this.options.skipTemplateCodegen ? [] :
            this.options.generateCodeForLibraries === false ?
                this.compiler.emitPartialStubs(this.analyzedModules) :
                this.compiler.emitAllStubs(this.analyzedModules);
    };
    AngularCompilerProgram.prototype.generateFiles = function () {
        try {
            // Always generate the files if requested to ensure we capture any diagnostic errors but only
            // keep the results if we are not skipping template code generation.
            var result = this.compiler.emitAllImpls(this.analyzedModules);
            return this.options.skipTemplateCodegen ? [] : result;
        }
        catch (e) {
            if (compiler_1.isSyntaxError(e)) {
                this._generatedFileDiagnostics = [{ message: e.message, category: api_1.DiagnosticCategory.Error }];
                return [];
            }
            throw e;
        }
    };
    AngularCompilerProgram.prototype.createTypeChecker = function () {
        return new check_types_1.TypeChecker(this.tsProgram, this.options, this.host, this.aotCompilerHost, this.options, this.analyzedModules, this.generatedFiles);
    };
    AngularCompilerProgram.prototype.createProgramWithStubs = function () {
        // If we are skipping code generation just use the original program.
        // Otherwise, create a new program that includes the stub files.
        return this.options.skipTemplateCodegen ?
            this.tsProgram :
            ts.createProgram(this.rootNames.concat(this.stubFiles), this.options, this.programWithStubsHost);
    };
    return AngularCompilerProgram;
}());
function createProgram(_a) {
    var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram;
    return new AngularCompilerProgram(rootNames, options, host, oldProgram);
}
exports.createProgram = createProgram;
// Compute the AotCompiler options
function getAotCompilerOptions(options) {
    var missingTranslation = core_1.MissingTranslationStrategy.Warning;
    switch (options.i18nInMissingTranslations) {
        case 'ignore':
            missingTranslation = core_1.MissingTranslationStrategy.Ignore;
            break;
        case 'error':
            missingTranslation = core_1.MissingTranslationStrategy.Error;
            break;
    }
    var translations = '';
    if (options.i18nInFile) {
        if (!options.locale) {
            throw new Error("The translation file (" + options.i18nInFile + ") locale must be provided.");
        }
        translations = fs.readFileSync(options.i18nInFile, 'utf8');
    }
    else {
        // No translations are provided, ignore any errors
        // We still go through i18n to remove i18n attributes
        missingTranslation = core_1.MissingTranslationStrategy.Ignore;
    }
    return {
        locale: options.i18nInLocale,
        i18nFormat: options.i18nInFormat || options.i18nOutFormat, translations: translations, missingTranslation: missingTranslation,
        enableLegacyTemplate: options.enableLegacyTemplate,
        enableSummariesForJit: true,
    };
}
function writeMetadata(emitFilePath, sourceFile, metadataCache) {
    if (/\.js$/.test(emitFilePath)) {
        var path_1 = emitFilePath.replace(/\.js$/, '.metadata.json');
        // Beginning with 2.1, TypeScript transforms the source tree before emitting it.
        // We need the original, unmodified, tree which might be several levels back
        // depending on the number of transforms performed. All SourceFile's prior to 2.1
        // will appear to be the original source since they didn't include an original field.
        var collectableFile = sourceFile;
        while (collectableFile.original) {
            collectableFile = collectableFile.original;
        }
        var metadata = metadataCache.getMetadata(collectableFile);
        if (metadata) {
            var metadataText = JSON.stringify([metadata]);
            fs.writeFileSync(path_1, metadataText, { encoding: 'utf-8' });
        }
    }
}
function createWriteFileCallback(emitFlags, host, metadataCache, emitMap, expectedOut) {
    return function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
        var srcFile;
        if (sourceFiles && sourceFiles.length == 1) {
            srcFile = sourceFiles[0];
            emitMap.set(srcFile.fileName, fileName);
        }
        var absFile = path.resolve(process.cwd(), fileName);
        var generatedFile = GENERATED_FILES.test(fileName);
        // Don't emit unexpected files nor empty generated files
        if ((!expectedOut || expectedOut.indexOf(absFile) > -1) && (!generatedFile || data)) {
            host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
            if (srcFile && !generatedFile && (emitFlags & api_1.EmitFlags.Metadata) != 0) {
                writeMetadata(fileName, srcFile, metadataCache);
            }
        }
    };
}
function getNgOptionDiagnostics(options) {
    if (options.annotationsAs) {
        switch (options.annotationsAs) {
            case 'decorators':
            case 'static fields':
                break;
            default:
                return [{
                        message: 'Angular compiler options "annotationsAs" only supports "static fields" and "decorators"',
                        category: api_1.DiagnosticCategory.Error
                    }];
        }
    }
    return [];
}
function createProgramWithStubsHost(generatedFiles, originalProgram, originalHost) {
    return new (function () {
        function class_1() {
            var _this = this;
            this.getDefaultLibFileName = function (options) {
                return originalHost.getDefaultLibFileName(options);
            };
            this.getCurrentDirectory = function () { return originalHost.getCurrentDirectory(); };
            this.getCanonicalFileName = function (fileName) { return originalHost.getCanonicalFileName(fileName); };
            this.useCaseSensitiveFileNames = function () { return originalHost.useCaseSensitiveFileNames(); };
            this.getNewLine = function () { return originalHost.getNewLine(); };
            this.realPath = function (p) { return p; };
            this.fileExists = function (fileName) {
                return _this.generatedFiles.has(fileName) || originalHost.fileExists(fileName);
            };
            this.generatedFiles =
                new Map(generatedFiles.filter(function (g) { return g.source || (g.stmts && g.stmts.length); })
                    .map(function (g) { return [g.genFileUrl, { g: g }]; }));
            this.writeFile = originalHost.writeFile;
            if (originalHost.getDirectories) {
                this.getDirectories = function (path) { return originalHost.getDirectories(path); };
            }
            if (originalHost.directoryExists) {
                this.directoryExists = function (directoryName) { return originalHost.directoryExists(directoryName); };
            }
            if (originalHost.getCancellationToken) {
                this.getCancellationToken = function () { return originalHost.getCancellationToken(); };
            }
            if (originalHost.getDefaultLibLocation) {
                this.getDefaultLibLocation = function () { return originalHost.getDefaultLibLocation(); };
            }
            if (originalHost.trace) {
                this.trace = function (s) { return originalHost.trace(s); };
            }
        }
        class_1.prototype.getSourceFile = function (fileName, languageVersion, onError) {
            var data = this.generatedFiles.get(fileName);
            if (data) {
                return data.s || (data.s = ts.createSourceFile(fileName, data.g.source || compiler_1.toTypeScript(data.g), languageVersion));
            }
            return originalProgram.getSourceFile(fileName) ||
                originalHost.getSourceFile(fileName, languageVersion, onError);
        };
        class_1.prototype.readFile = function (fileName) {
            var data = this.generatedFiles.get(fileName);
            if (data) {
                return data.g.source || compiler_1.toTypeScript(data.g);
            }
            return originalHost.readFile(fileName);
        };
        return class_1;
    }());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3Byb2dyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBb0s7QUFDcEssc0NBQXlEO0FBQ3pELHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsaUNBQW1DO0FBQ25DLCtCQUFpQztBQUVqQyxrREFBaUU7QUFDakUsMERBQXVEO0FBRXZELDZCQUFvSDtBQUNwSCx5REFBOEY7QUFDOUYsbUVBQTJFO0FBRTNFLElBQU0sZUFBZSxHQUFHLGtEQUFrRCxDQUFDO0FBRTNFLElBQU0sa0JBQWtCLEdBQUcsbUJBQW1CLENBQUM7QUFFL0MsSUFBTSxZQUFZLEdBQXNCO0lBQ3RDLFNBQVMsRUFBRSxFQUFFO0lBQ2IseUJBQXlCLEVBQUUsSUFBSSxHQUFHLEVBQUU7SUFDcEMsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFDO0FBRUY7SUFvQkUsZ0NBQ1ksU0FBbUIsRUFBVSxPQUF3QixFQUFVLElBQWtCLEVBQ2pGLFVBQW9CO1FBRHBCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQWM7UUFDakYsZUFBVSxHQUFWLFVBQVUsQ0FBVTtRQVp4QiwyQkFBc0IsR0FBaUIsRUFBRSxDQUFDO1FBYWhELElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDdkUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsUUFBUTtZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxF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