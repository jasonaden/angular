/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { componentFactoryName, createHostComponentMeta, flatten, identifierName, templateSourceUrl } from '../compile_metadata';
import { Identifiers, createTokenForExternalReference } from '../identifiers';
import * as o from '../output/output_ast';
import { syntaxError } from '../util';
import { GeneratedFile } from './generated_file';
import { StaticSymbol } from './static_symbol';
import { createForJitStub, serializeSummaries } from './summary_serializer';
import { ngfactoryFilePath, splitTypescriptSuffix, summaryFileName, summaryForJitFileName } from './util';
var AotCompiler = (function () {
    /**
     * @param {?} _config
     * @param {?} _host
     * @param {?} _reflector
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _outputEmitter
     * @param {?} _summaryResolver
     * @param {?} _localeId
     * @param {?} _translationFormat
     * @param {?} _enableSummariesForJit
     * @param {?} _symbolResolver
     */
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
    /**
     * @return {?}
     */
    AotCompiler.prototype.clearCache = function () { this._metadataResolver.clearCache(); };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.analyzeModulesSync = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var /** @type {?} */ analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        analyzeResult.ngModules.forEach(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true); });
        return analyzeResult;
    };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.analyzeModulesAsync = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var /** @type {?} */ analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        return Promise
            .all(analyzeResult.ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () { return analyzeResult; });
    };
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    AotCompiler.prototype.emitAllStubs = function (analyzeResult) {
        var _this = this;
        var files = analyzeResult.files;
        var /** @type {?} */ sourceModules = files.map(function (file) {
            return _this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, false);
        });
        return flatten(sourceModules);
    };
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    AotCompiler.prototype.emitPartialStubs = function (analyzeResult) {
        var _this = this;
        var files = analyzeResult.files;
        var /** @type {?} */ sourceModules = files.map(function (file) {
            return _this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, true);
        });
        return flatten(sourceModules);
    };
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    AotCompiler.prototype.emitAllImpls = function (analyzeResult) {
        var _this = this;
        var ngModuleByPipeOrDirective = analyzeResult.ngModuleByPipeOrDirective, files = analyzeResult.files;
        var /** @type {?} */ sourceModules = files.map(function (file) { return _this._compileImplFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
        return flatten(sourceModules);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} partial
     * @return {?}
     */
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
        var /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl, true)[1];
        var /** @type {?} */ generatedFiles = [];
        var /** @type {?} */ ngFactoryOutputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        var /** @type {?} */ jitSummaryOutputCtx = this._createOutputContext(summaryForJitFileName(srcFileUrl, true));
        // create exports that user code can reference
        ngModules.forEach(function (ngModuleReference) {
            _this._ngModuleCompiler.createStub(ngFactoryOutputCtx, ngModuleReference);
            createForJitStub(jitSummaryOutputCtx, ngModuleReference);
        });
        var /** @type {?} */ partialJitStubRequired = false;
        var /** @type {?} */ partialFactoryStubRequired = false;
        // create stubs for external stylesheets (always empty, as users should not import anything from
        // the generated code)
        directives.forEach(function (dirType) {
            var /** @type {?} */ compMeta = _this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            partialJitStubRequired = true;
            if (!compMeta.isComponent) {
                return;
            } /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach(function (stylesheetMeta) {
                var /** @type {?} */ styleContext = _this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMeta.moduleUrl)), _this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
                _createTypeReferenceStub(styleContext, Identifiers.ComponentFactory);
                generatedFiles.push(_this._codegenSourceModule(/** @type {?} */ ((stylesheetMeta.moduleUrl)), styleContext));
            });
            partialFactoryStubRequired = true;
        });
        // If we need all the stubs to be generated then insert an arbitrary reference into the stub
        if ((partialFactoryStubRequired || !partial) && ngFactoryOutputCtx.statements.length <= 0) {
            _createTypeReferenceStub(ngFactoryOutputCtx, Identifiers.ComponentFactory);
        }
        if ((partialJitStubRequired || !partial || (pipes && pipes.length > 0)) &&
            jitSummaryOutputCtx.statements.length <= 0) {
            _createTypeReferenceStub(jitSummaryOutputCtx, Identifiers.ComponentFactory);
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
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._compileImplFile = function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        var /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl, true)[1];
        var /** @type {?} */ generatedFiles = [];
        var /** @type {?} */ outputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push.apply(generatedFiles, this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        // compile all ng modules
        ngModules.forEach(function (ngModuleType) { return _this._compileModule(outputCtx, ngModuleType); });
        // compile components
        directives.forEach(function (dirType) {
            var /** @type {?} */ compMeta = _this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return;
            }
            var /** @type {?} */ ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
            }
            // compile styles
            var /** @type {?} */ componentStylesheet = _this._styleCompiler.compileComponent(outputCtx, compMeta); /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach(function (stylesheetMeta) {
                generatedFiles.push(_this._codegenStyles(/** @type {?} */ ((stylesheetMeta.moduleUrl)), compMeta, stylesheetMeta, fileSuffix));
            });
            // compile components
            var /** @type {?} */ compViewVars = _this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
            _this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0) {
            var /** @type {?} */ srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} ngFactoryCtx
     * @return {?}
     */
    AotCompiler.prototype._createSummary = function (srcFileUrl, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        var _this = this;
        var /** @type {?} */ symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
        var /** @type {?} */ typeData = ngModules.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getNgModuleSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getNgModuleMetadata(ref)))
        }); }).concat(directives.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getDirectiveSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getDirectiveMetadata(ref)))
        }); }), pipes.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getPipeSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getPipeMetadata(ref)))
        }); }), injectables.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getInjectableSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getInjectableSummary(ref))).type
        }); }));
        var /** @type {?} */ forJitOutputCtx = this._createOutputContext(summaryForJitFileName(srcFileUrl, true));
        var _a = serializeSummaries(forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData), json = _a.json, exportAs = _a.exportAs;
        exportAs.forEach(function (entry) {
            ngFactoryCtx.statements.push(o.variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]));
        });
        var /** @type {?} */ summaryJson = new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
        if (this._enableSummariesForJit) {
            return [summaryJson, this._codegenSourceModule(srcFileUrl, forJitOutputCtx)];
        }
        ;
        return [summaryJson];
    };
    /**
     * @param {?} outputCtx
     * @param {?} ngModuleType
     * @return {?}
     */
    AotCompiler.prototype._compileModule = function (outputCtx, ngModuleType) {
        var /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(ngModuleType)));
        var /** @type {?} */ providers = [];
        if (this._localeId) {
            providers.push({
                token: createTokenForExternalReference(this._reflector, Identifiers.LOCALE_ID),
                useValue: this._localeId,
            });
        }
        if (this._translationFormat) {
            providers.push({
                token: createTokenForExternalReference(this._reflector, Identifiers.TRANSLATIONS_FORMAT),
                useValue: this._translationFormat
            });
        }
        this._ngModuleCompiler.compile(outputCtx, ngModule, providers);
    };
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._compileComponentFactory = function (outputCtx, compMeta, ngModule, fileSuffix) {
        var /** @type {?} */ hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
        var /** @type {?} */ hostMeta = createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
        var /** @type {?} */ hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix)
            .viewClassVar;
        var /** @type {?} */ compFactoryVar = componentFactoryName(compMeta.type.reference);
        var /** @type {?} */ inputsExprs = [];
        for (var /** @type {?} */ propName in compMeta.inputs) {
            var /** @type {?} */ templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        var /** @type {?} */ outputsExprs = [];
        for (var /** @type {?} */ propName in compMeta.outputs) {
            var /** @type {?} */ templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        outputCtx.statements.push(o.variable(compFactoryVar)
            .set(o.importExpr(Identifiers.createComponentFactory).callFn([
            o.literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference),
            o.variable(hostViewFactoryVar), new o.LiteralMapExpr(inputsExprs),
            new o.LiteralMapExpr(outputsExprs),
            o.literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(function (selector) { return o.literal(selector); }))
        ]))
            .toDeclStmt(o.importType(Identifiers.ComponentFactory, [/** @type {?} */ ((o.expressionType(outputCtx.importExpr(compMeta.type.reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]));
    };
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._compileComponent = function (outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        var _this = this;
        var /** @type {?} */ directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var /** @type {?} */ pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var _a = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template)))), parsedTemplate = _a.template, usedPipes = _a.pipes;
        var /** @type {?} */ stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        var /** @type {?} */ viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
    };
    /**
     * @param {?} genFilePath
     * @return {?}
     */
    AotCompiler.prototype._createOutputContext = function (genFilePath) {
        var _this = this;
        var /** @type {?} */ importExpr = function (symbol, typeParams) {
            if (typeParams === void 0) { typeParams = null; }
            if (!(symbol instanceof StaticSymbol)) {
                throw new Error("Internal error: unknown identifier " + JSON.stringify(symbol));
            }
            var /** @type {?} */ arity = _this._symbolResolver.getTypeArity(symbol) || 0;
            var _a = _this._symbolResolver.getImportAs(symbol) || symbol, filePath = _a.filePath, name = _a.name, members = _a.members;
            var /** @type {?} */ importModule = _this._symbolResolver.fileNameToModuleName(filePath, genFilePath);
            // It should be good enough to compare filePath to genFilePath and if they are equal
            // there is a self reference. However, ngfactory files generate to .ts but their
            // symbols have .d.ts so a simple compare is insufficient. They should be canonical
            // and is tracked by #17705.
            var /** @type {?} */ selfReference = _this._symbolResolver.fileNameToModuleName(genFilePath, genFilePath);
            var /** @type {?} */ moduleName = importModule === selfReference ? null : importModule;
            // If we are in a type expression that refers to a generic type then supply
            // the required type parameters. If there were not enough type parameters
            // supplied, supply any as the type. Outside a type expression the reference
            // should not supply type parameters and be treated as a simple value reference
            // to the constructor function itself.
            var /** @type {?} */ suppliedTypeParams = typeParams || [];
            var /** @type {?} */ missingTypeParamsCount = arity - suppliedTypeParams.length;
            var /** @type {?} */ allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(o.DYNAMIC_TYPE));
            return members.reduce(function (expr, memberName) { return expr.prop(memberName); }, /** @type {?} */ (o.importExpr(new o.ExternalReference(moduleName, name, null), allTypeParams)));
        };
        return { statements: [], genFilePath: genFilePath, importExpr: importExpr };
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} compMeta
     * @param {?} stylesheetMetadata
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._codegenStyles = function (srcFileUrl, compMeta, stylesheetMetadata, fileSuffix) {
        var /** @type {?} */ outputCtx = this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMetadata.moduleUrl)), this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
        var /** @type {?} */ compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} ctx
     * @return {?}
     */
    AotCompiler.prototype._codegenSourceModule = function (srcFileUrl, ctx) {
        return new GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
    };
    return AotCompiler;
}());
export { AotCompiler };
function AotCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    AotCompiler.prototype._config;
    /** @type {?} */
    AotCompiler.prototype._host;
    /** @type {?} */
    AotCompiler.prototype._reflector;
    /** @type {?} */
    AotCompiler.prototype._metadataResolver;
    /** @type {?} */
    AotCompiler.prototype._templateParser;
    /** @type {?} */
    AotCompiler.prototype._styleCompiler;
    /** @type {?} */
    AotCompiler.prototype._viewCompiler;
    /** @type {?} */
    AotCompiler.prototype._ngModuleCompiler;
    /** @type {?} */
    AotCompiler.prototype._outputEmitter;
    /** @type {?} */
    AotCompiler.prototype._summaryResolver;
    /** @type {?} */
    AotCompiler.prototype._localeId;
    /** @type {?} */
    AotCompiler.prototype._translationFormat;
    /** @type {?} */
    AotCompiler.prototype._enableSummariesForJit;
    /** @type {?} */
    AotCompiler.prototype._symbolResolver;
}
/**
 * @param {?} outputCtx
 * @param {?} reference
 * @return {?}
 */
function _createTypeReferenceStub(outputCtx, reference) {
    outputCtx.statements.push(o.importExpr(reference).toStmt());
}
/**
 * @param {?} symbolResolver
 * @param {?} compileResult
 * @param {?} needsShim
 * @param {?} fileSuffix
 * @return {?}
 */
function _resolveStyleStatements(symbolResolver, compileResult, needsShim, fileSuffix) {
    compileResult.dependencies.forEach(function (dep) {
        dep.setValue(symbolResolver.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, needsShim, fileSuffix), dep.name));
    });
}
/**
 * @param {?} stylesheetUrl
 * @param {?} shim
 * @param {?} suffix
 * @return {?}
 */
function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
    return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
}
/**
 * @record
 */
export function NgAnalyzedModules() { }
function NgAnalyzedModules_tsickle_Closure_declarations() {
    /** @type {?} */
    NgAnalyzedModules.prototype.ngModules;
    /** @type {?} */
    NgAnalyzedModules.prototype.ngModuleByPipeOrDirective;
    /** @type {?} */
    NgAnalyzedModules.prototype.files;
    /** @type {?|undefined} */
    NgAnalyzedModules.prototype.symbolsMissingModule;
}
/**
 * @record
 */
export function NgAnalyzeModulesHost() { }
function NgAnalyzeModulesHost_tsickle_Closure_declarations() {
    /** @type {?} */
    NgAnalyzeModulesHost.prototype.isSourceFile;
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
    var _a = _createNgModules(programStaticSymbols, host, metadataResolver), ngModules = _a.ngModules, symbolsMissingModule = _a.symbolsMissingModule;
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        var /** @type {?} */ messages = result.symbolsMissingModule.map(function (s) {
            return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it.";
        });
        throw syntaxError(messages.join('\n'));
    }
    return result;
}
/**
 * @param {?} programSymbols
 * @param {?} ngModuleMetas
 * @param {?} symbolsMissingModule
 * @param {?} metadataResolver
 * @return {?}
 */
function _analyzeNgModules(programSymbols, ngModuleMetas, symbolsMissingModule, metadataResolver) {
    var /** @type {?} */ moduleMetasByRef = new Map();
    ngModuleMetas.forEach(function (ngModule) { return moduleMetasByRef.set(ngModule.type.reference, ngModule); });
    var /** @type {?} */ ngModuleByPipeOrDirective = new Map();
    var /** @type {?} */ ngModulesByFile = new Map();
    var /** @type {?} */ ngDirectivesByFile = new Map();
    var /** @type {?} */ ngPipesByFile = new Map();
    var /** @type {?} */ ngInjectablesByFile = new Map();
    var /** @type {?} */ filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach(function (symbol) {
        var /** @type {?} */ filePath = symbol.filePath;
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
        var /** @type {?} */ srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
            var /** @type {?} */ fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach(function (pipeIdentifier) {
            var /** @type {?} */ fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    var /** @type {?} */ files = [];
    filePaths.forEach(function (srcUrl) {
        var /** @type {?} */ directives = ngDirectivesByFile.get(srcUrl) || [];
        var /** @type {?} */ pipes = ngPipesByFile.get(srcUrl) || [];
        var /** @type {?} */ ngModules = ngModulesByFile.get(srcUrl) || [];
        var /** @type {?} */ injectables = ngInjectablesByFile.get(srcUrl) || [];
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
/**
 * @param {?} staticSymbolResolver
 * @param {?} files
 * @param {?} host
 * @return {?}
 */
export function extractProgramSymbols(staticSymbolResolver, files, host) {
    var /** @type {?} */ staticSymbols = [];
    files.filter(function (fileName) { return host.isSourceFile(fileName); }).forEach(function (sourceFile) {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach(function (symbol) {
            var /** @type {?} */ resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            var /** @type {?} */ symbolMeta = resolvedSymbol.metadata;
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
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function _createNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ ngModules = new Map();
    var /** @type {?} */ programPipesAndDirectives = [];
    var /** @type {?} */ ngModulePipesAndDirective = new Set();
    var /** @type {?} */ addNgModule = function (staticSymbol) {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        var /** @type {?} */ ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
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
    var /** @type {?} */ symbolsMissingModule = programPipesAndDirectives.filter(function (s) { return !ngModulePipesAndDirective.has(s); });
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule: symbolsMissingModule };
}
//# sourceMappingURL=compiler.js.map