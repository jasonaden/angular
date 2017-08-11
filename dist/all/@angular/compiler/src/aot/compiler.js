"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("../compile_metadata");
var identifiers_1 = require("../identifiers");
var o = require("../output/output_ast");
var util_1 = require("../util");
var generated_file_1 = require("./generated_file");
var static_symbol_1 = require("./static_symbol");
var summary_serializer_1 = require("./summary_serializer");
var util_2 = require("./util");
var AotCompiler = (function () {
    function AotCompiler(_config, _host, _reflector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _enableSummariesForJit, _symbolResolver) {
        this._config = _config;
        this._host = _host;
        this._reflector = _reflector;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._outputEmitter = _outputEmitter;
        this._summaryResolver = _summaryResolver;
        this._localeId = _localeId;
        this._translationFormat = _translationFormat;
        this._enableSummariesForJit = _enableSummariesForJit;
        this._symbolResolver = _symbolResolver;
    }
    AotCompiler.prototype.clearCache = function () { this._metadataResolver.clearCache(); };
    AotCompiler.prototype.analyzeModulesSync = function (rootFiles) {
        var _this = this;
        var programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        analyzeResult.ngModules.forEach(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true); });
        return analyzeResult;
    };
    AotCompiler.prototype.analyzeModulesAsync = function (rootFiles) {
        var _this = this;
        var programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        return Promise
            .all(analyzeResult.ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () { return analyzeResult; });
    };
    AotCompiler.prototype.emitAllStubs = function (analyzeResult) {
        var _this = this;
        var files = analyzeResult.files;
        var sourceModules = files.map(function (file) {
            return _this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, false);
        });
        return compile_metadata_1.flatten(sourceModules);
    };
    AotCompiler.prototype.emitPartialStubs = function (analyzeResult) {
        var _this = this;
        var files = analyzeResult.files;
        var sourceModules = files.map(function (file) {
            return _this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, true);
        });
        return compile_metadata_1.flatten(sourceModules);
    };
    AotCompiler.prototype.emitAllImpls = function (analyzeResult) {
        var _this = this;
        var ngModuleByPipeOrDirective = analyzeResult.ngModuleByPipeOrDirective, files = analyzeResult.files;
        var sourceModules = files.map(function (file) { return _this._compileImplFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
        return compile_metadata_1.flatten(sourceModules);
    };
    AotCompiler.prototype._compileStubFile = function (srcFileUrl, directives, pipes, ngModules, partial) {
        var _this = this;
        // partial is true when we only need the files we are certain will produce a factory and/or
        // summary.
        // This is the normal case for `ngc` but if we assume libraryies are generating their own
        // factories
        // then we might need a factory for a file that re-exports a module or factory which we cannot
        // know
        // ahead of time so we need a stub generate for all non-.d.ts files. The .d.ts files do not need
        // to
        // be excluded here because they are excluded when the modules are analyzed. If a factory ends
        // up
        // not being needed, the factory file is not written in writeFile callback.
        var fileSuffix = util_2.splitTypescriptSuffix(srcFileUrl, true)[1];
        var generatedFiles = [];
        var ngFactoryOutputCtx = this._createOutputContext(util_2.ngfactoryFilePath(srcFileUrl, true));
        var jitSummaryOutputCtx = this._createOutputContext(util_2.summaryForJitFileName(srcFileUrl, true));
        // create exports that user code can reference
        ngModules.forEach(function (ngModuleReference) {
            _this._ngModuleCompiler.createStub(ngFactoryOutputCtx, ngModuleReference);
            summary_serializer_1.createForJitStub(jitSummaryOutputCtx, ngModuleReference);
        });
        var partialJitStubRequired = false;
        var partialFactoryStubRequired = false;
        // create stubs for external stylesheets (always empty, as users should not import anything from
        // the generated code)
        directives.forEach(function (dirType) {
            var compMeta = _this._metadataResolver.getDirectiveMetadata(dirType);
            partialJitStubRequired = true;
            if (!compMeta.isComponent) {
                return;
            }
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template.externalStylesheets.forEach(function (stylesheetMeta) {
                var styleContext = _this._createOutputContext(_stylesModuleUrl(stylesheetMeta.moduleUrl, _this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
                _createTypeReferenceStub(styleContext, identifiers_1.Identifiers.ComponentFactory);
                generatedFiles.push(_this._codegenSourceModule(stylesheetMeta.moduleUrl, styleContext));
            });
            partialFactoryStubRequired = true;
        });
        // If we need all the stubs to be generated then insert an arbitrary reference into the stub
        if ((partialFactoryStubRequired || !partial) && ngFactoryOutputCtx.statements.length <= 0) {
            _createTypeReferenceStub(ngFactoryOutputCtx, identifiers_1.Identifiers.ComponentFactory);
        }
        if ((partialJitStubRequired || !partial || (pipes && pipes.length > 0)) &&
            jitSummaryOutputCtx.statements.length <= 0) {
            _createTypeReferenceStub(jitSummaryOutputCtx, identifiers_1.Identifiers.ComponentFactory);
        }
        // Note: we are creating stub ngfactory/ngsummary for all source files,
        // as the real calculation requires almost the same logic as producing the real content for
        // them. Our pipeline will filter out empty ones at the end. Because of this filter, however,
        // stub references to the reference type needs to be generated even if the user cannot
        // refer to type from the `.d.ts` file to prevent the file being elided from the emit.
        generatedFiles.push(this._codegenSourceModule(srcFileUrl, ngFactoryOutputCtx));
        if (this._enableSummariesForJit) {
            generatedFiles.push(this._codegenSourceModule(srcFileUrl, jitSummaryOutputCtx));
        }
        return generatedFiles;
    };
    AotCompiler.prototype._compileImplFile = function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        var fileSuffix = util_2.splitTypescriptSuffix(srcFileUrl, true)[1];
        var generatedFiles = [];
        var outputCtx = this._createOutputContext(util_2.ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push.apply(generatedFiles, this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        // compile all ng modules
        ngModules.forEach(function (ngModuleType) { return _this._compileModule(outputCtx, ngModuleType); });
        // compile components
        directives.forEach(function (dirType) {
            var compMeta = _this._metadataResolver.getDirectiveMetadata(dirType);
            if (!compMeta.isComponent) {
                return;
            }
            var ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error("Internal Error: cannot determine the module for component " + compile_metadata_1.identifierName(compMeta.type) + "!");
            }
            // compile styles
            var componentStylesheet = _this._styleCompiler.compileComponent(outputCtx, compMeta);
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template.externalStylesheets.forEach(function (stylesheetMeta) {
                generatedFiles.push(_this._codegenStyles(stylesheetMeta.moduleUrl, compMeta, stylesheetMeta, fileSuffix));
            });
            // compile components
            var compViewVars = _this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
            _this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0) {
            var srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    };
    AotCompiler.prototype._createSummary = function (srcFileUrl, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        var _this = this;
        var symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
        var typeData = ngModules.map(function (ref) { return ({
            summary: _this._metadataResolver.getNgModuleSummary(ref),
            metadata: _this._metadataResolver.getNgModuleMetadata(ref)
        }); }).concat(directives.map(function (ref) { return ({
            summary: _this._metadataResolver.getDirectiveSummary(ref),
            metadata: _this._metadataResolver.getDirectiveMetadata(ref)
        }); }), pipes.map(function (ref) { return ({
            summary: _this._metadataResolver.getPipeSummary(ref),
            metadata: _this._metadataResolver.getPipeMetadata(ref)
        }); }), injectables.map(function (ref) { return ({
            summary: _this._metadataResolver.getInjectableSummary(ref),
            metadata: _this._metadataResolver.getInjectableSummary(ref).type
        }); }));
        var forJitOutputCtx = this._createOutputContext(util_2.summaryForJitFileName(srcFileUrl, true));
        var _a = summary_serializer_1.serializeSummaries(forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData), json = _a.json, exportAs = _a.exportAs;
        exportAs.forEach(function (entry) {
            ngFactoryCtx.statements.push(o.variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]));
        });
        var summaryJson = new generated_file_1.GeneratedFile(srcFileUrl, util_2.summaryFileName(srcFileUrl), json);
        if (this._enableSummariesForJit) {
            return [summaryJson, this._codegenSourceModule(srcFileUrl, forJitOutputCtx)];
        }
        ;
        return [summaryJson];
    };
    AotCompiler.prototype._compileModule = function (outputCtx, ngModuleType) {
        var ngModule = this._metadataResolver.getNgModuleMetadata(ngModuleType);
        var providers = [];
        if (this._localeId) {
            providers.push({
                token: identifiers_1.createTokenForExternalReference(this._reflector, identifiers_1.Identifiers.LOCALE_ID),
                useValue: this._localeId,
            });
        }
        if (this._translationFormat) {
            providers.push({
                token: identifiers_1.createTokenForExternalReference(this._reflector, identifiers_1.Identifiers.TRANSLATIONS_FORMAT),
                useValue: this._translationFormat
            });
        }
        this._ngModuleCompiler.compile(outputCtx, ngModule, providers);
    };
    AotCompiler.prototype._compileComponentFactory = function (outputCtx, compMeta, ngModule, fileSuffix) {
        var hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
        var hostMeta = compile_metadata_1.createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
        var hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix)
            .viewClassVar;
        var compFactoryVar = compile_metadata_1.componentFactoryName(compMeta.type.reference);
        var inputsExprs = [];
        for (var propName in compMeta.inputs) {
            var templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        var outputsExprs = [];
        for (var propName in compMeta.outputs) {
            var templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        outputCtx.statements.push(o.variable(compFactoryVar)
            .set(o.importExpr(identifiers_1.Identifiers.createComponentFactory).callFn([
            o.literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference),
            o.variable(hostViewFactoryVar), new o.LiteralMapExpr(inputsExprs),
            new o.LiteralMapExpr(outputsExprs),
            o.literalArr(compMeta.template.ngContentSelectors.map(function (selector) { return o.literal(selector); }))
        ]))
            .toDeclStmt(o.importType(identifiers_1.Identifiers.ComponentFactory, [o.expressionType(outputCtx.importExpr(compMeta.type.reference))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]));
    };
    AotCompiler.prototype._compileComponent = function (outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        var _this = this;
        var directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var _a = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, ngModule.schemas, compile_metadata_1.templateSourceUrl(ngModule.type, compMeta, compMeta.template)), parsedTemplate = _a.template, usedPipes = _a.pipes;
        var stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        var viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
    };
    AotCompiler.prototype._createOutputContext = function (genFilePath) {
        var _this = this;
        var importExpr = function (symbol, typeParams) {
            if (typeParams === void 0) { typeParams = null; }
            if (!(symbol instanceof static_symbol_1.StaticSymbol)) {
                throw new Error("Internal error: unknown identifier " + JSON.stringify(symbol));
            }
            var arity = _this._symbolResolver.getTypeArity(symbol) || 0;
            var _a = _this._symbolResolver.getImportAs(symbol) || symbol, filePath = _a.filePath, name = _a.name, members = _a.members;
            var importModule = _this._symbolResolver.fileNameToModuleName(filePath, genFilePath);
            // It should be good enough to compare filePath to genFilePath and if they are equal
            // there is a self reference. However, ngfactory files generate to .ts but their
            // symbols have .d.ts so a simple compare is insufficient. They should be canonical
            // and is tracked by #17705.
            var selfReference = _this._symbolResolver.fileNameToModuleName(genFilePath, genFilePath);
            var moduleName = importModule === selfReference ? null : importModule;
            // If we are in a type expression that refers to a generic type then supply
            // the required type parameters. If there were not enough type parameters
            // supplied, supply any as the type. Outside a type expression the reference
            // should not supply type parameters and be treated as a simple value reference
            // to the constructor function itself.
            var suppliedTypeParams = typeParams || [];
            var missingTypeParamsCount = arity - suppliedTypeParams.length;
            var allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(o.DYNAMIC_TYPE));
            return members.reduce(function (expr, memberName) { return expr.prop(memberName); }, o.importExpr(new o.ExternalReference(moduleName, name, null), allTypeParams));
        };
        return { statements: [], genFilePath: genFilePath, importExpr: importExpr };
    };
    AotCompiler.prototype._codegenStyles = function (srcFileUrl, compMeta, stylesheetMetadata, fileSuffix) {
        var outputCtx = this._createOutputContext(_stylesModuleUrl(stylesheetMetadata.moduleUrl, this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
        var compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
    };
    AotCompiler.prototype._codegenSourceModule = function (srcFileUrl, ctx) {
        return new generated_file_1.GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
    };
    return AotCompiler;
}());
exports.AotCompiler = AotCompiler;
function _createTypeReferenceStub(outputCtx, reference) {
    outputCtx.statements.push(o.importExpr(reference).toStmt());
}
function _resolveStyleStatements(symbolResolver, compileResult, needsShim, fileSuffix) {
    compileResult.dependencies.forEach(function (dep) {
        dep.setValue(symbolResolver.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, needsShim, fileSuffix), dep.name));
    });
}
function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
    return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
}
// Returns all the source files and a mapping from modules to directives
function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
    var _a = _createNgModules(programStaticSymbols, host, metadataResolver), ngModules = _a.ngModules, symbolsMissingModule = _a.symbolsMissingModule;
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
exports.analyzeNgModules = analyzeNgModules;
function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    var result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        var messages = result.symbolsMissingModule.map(function (s) {
            return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it.";
        });
        throw util_1.syntaxError(messages.join('\n'));
    }
    return result;
}
exports.analyzeAndValidateNgModules = analyzeAndValidateNgModules;
function _analyzeNgModules(programSymbols, ngModuleMetas, symbolsMissingModule, metadataResolver) {
    var moduleMetasByRef = new Map();
    ngModuleMetas.forEach(function (ngModule) { return moduleMetasByRef.set(ngModule.type.reference, ngModule); });
    var ngModuleByPipeOrDirective = new Map();
    var ngModulesByFile = new Map();
    var ngDirectivesByFile = new Map();
    var ngPipesByFile = new Map();
    var ngInjectablesByFile = new Map();
    var filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach(function (symbol) {
        var filePath = symbol.filePath;
        filePaths.add(filePath);
        if (metadataResolver.isInjectable(symbol)) {
            ngInjectablesByFile.set(filePath, (ngInjectablesByFile.get(filePath) || []).concat(symbol));
        }
    });
    // Looping over all modules to construct:
    // - a map from file to modules `ngModulesByFile`,
    // - a map from file to directives `ngDirectivesByFile`,
    // - a map from file to pipes `ngPipesByFile`,
    // - a map from directive/pipe to module `ngModuleByPipeOrDirective`.
    ngModuleMetas.forEach(function (ngModuleMeta) {
        var srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
            var fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach(function (pipeIdentifier) {
            var fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    var files = [];
    filePaths.forEach(function (srcUrl) {
        var directives = ngDirectivesByFile.get(srcUrl) || [];
        var pipes = ngPipesByFile.get(srcUrl) || [];
        var ngModules = ngModulesByFile.get(srcUrl) || [];
        var injectables = ngInjectablesByFile.get(srcUrl) || [];
        files.push({ srcUrl: srcUrl, directives: directives, pipes: pipes, ngModules: ngModules, injectables: injectables });
    });
    return {
        // map directive/pipe to module
        ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
        // list modules and directives for every source file
        files: files,
        ngModules: ngModuleMetas, symbolsMissingModule: symbolsMissingModule
    };
}
function extractProgramSymbols(staticSymbolResolver, files, host) {
    var staticSymbols = [];
    files.filter(function (fileName) { return host.isSourceFile(fileName); }).forEach(function (sourceFile) {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach(function (symbol) {
            var resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            var symbolMeta = resolvedSymbol.metadata;
            if (symbolMeta) {
                if (symbolMeta.__symbolic != 'error') {
                    // Ignore symbols that are only included to record error information.
                    staticSymbols.push(resolvedSymbol.symbol);
                }
            }
        });
    });
    return staticSymbols;
}
exports.extractProgramSymbols = extractProgramSymbols;
// Load the NgModules and check
// that all directives / pipes that are present in the program
// are also declared by a module.
function _createNgModules(programStaticSymbols, host, metadataResolver) {
    var ngModules = new Map();
    var programPipesAndDirectives = [];
    var ngModulePipesAndDirective = new Set();
    var addNgModule = function (staticSymbol) {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        var ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
        if (ngModule) {
            ngModules.set(ngModule.type.reference, ngModule);
            ngModule.declaredDirectives.forEach(function (dir) { return ngModulePipesAndDirective.add(dir.reference); });
            ngModule.declaredPipes.forEach(function (pipe) { return ngModulePipesAndDirective.add(pipe.reference); });
            // For every input module add the list of transitively included modules
            ngModule.transitiveModule.modules.forEach(function (modMeta) { return addNgModule(modMeta.reference); });
        }
        return !!ngModule;
    };
    programStaticSymbols.forEach(function (staticSymbol) {
        if (!addNgModule(staticSymbol) &&
            (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
            programPipesAndDirectives.push(staticSymbol);
        }
    });
    // Throw an error if any of the program pipe or directives is not declared by a module
    var symbolsMissingModule = programPipesAndDirectives.filter(function (s) { return !ngModulePipesAndDirective.has(s); });
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule: symbolsMissingModule };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvYW90L2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsd0RBQThZO0FBRTlZLDhDQUE0RTtBQUk1RSx3Q0FBMEM7QUFJMUMsZ0NBQW1EO0FBSW5ELG1EQUErQztBQUUvQyxpREFBNkM7QUFFN0MsMkRBQTBFO0FBQzFFLCtCQUEySDtBQUUzSDtJQUNFLHFCQUNZLE9BQXVCLEVBQVUsS0FBc0IsRUFDdkQsVUFBMkIsRUFBVSxpQkFBMEMsRUFDL0UsZUFBK0IsRUFBVSxjQUE2QixFQUN0RSxhQUEyQixFQUFVLGlCQUFtQyxFQUN4RSxjQUE2QixFQUM3QixnQkFBK0MsRUFBVSxTQUFzQixFQUMvRSxrQkFBK0IsRUFBVSxzQkFBb0MsRUFDN0UsZUFBcUM7UUFQckMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN2RCxlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBeUI7UUFDL0Usb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDdEUsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ3hFLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBK0I7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQy9FLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBYTtRQUFVLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBYztRQUM3RSxvQkFBZSxHQUFmLGVBQWUsQ0FBc0I7SUFBRyxDQUFDO0lBRXJELGdDQUFVLEdBQVYsY0FBZSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFF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