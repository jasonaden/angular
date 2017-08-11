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
export class AotCompiler {
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
    constructor(_config, _host, _reflector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _enableSummariesForJit, _symbolResolver) {
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
    clearCache() { this._metadataResolver.clearCache(); }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    analyzeModulesSync(rootFiles) {
        const /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        const /** @type {?} */ analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        analyzeResult.ngModules.forEach(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true));
        return analyzeResult;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    analyzeModulesAsync(rootFiles) {
        const /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        const /** @type {?} */ analyzeResult = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        return Promise
            .all(analyzeResult.ngModules.map(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false)))
            .then(() => analyzeResult);
    }
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    emitAllStubs(analyzeResult) {
        const { files } = analyzeResult;
        const /** @type {?} */ sourceModules = files.map(file => this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, false));
        return flatten(sourceModules);
    }
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    emitPartialStubs(analyzeResult) {
        const { files } = analyzeResult;
        const /** @type {?} */ sourceModules = files.map(file => this._compileStubFile(file.srcUrl, file.directives, file.pipes, file.ngModules, true));
        return flatten(sourceModules);
    }
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    emitAllImpls(analyzeResult) {
        const { ngModuleByPipeOrDirective, files } = analyzeResult;
        const /** @type {?} */ sourceModules = files.map(file => this._compileImplFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables));
        return flatten(sourceModules);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} partial
     * @return {?}
     */
    _compileStubFile(srcFileUrl, directives, pipes, ngModules, partial) {
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
        const /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl, true)[1];
        const /** @type {?} */ generatedFiles = [];
        const /** @type {?} */ ngFactoryOutputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        const /** @type {?} */ jitSummaryOutputCtx = this._createOutputContext(summaryForJitFileName(srcFileUrl, true));
        // create exports that user code can reference
        ngModules.forEach((ngModuleReference) => {
            this._ngModuleCompiler.createStub(ngFactoryOutputCtx, ngModuleReference);
            createForJitStub(jitSummaryOutputCtx, ngModuleReference);
        });
        let /** @type {?} */ partialJitStubRequired = false;
        let /** @type {?} */ partialFactoryStubRequired = false;
        // create stubs for external stylesheets (always empty, as users should not import anything from
        // the generated code)
        directives.forEach((dirType) => {
            const /** @type {?} */ compMeta = this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            partialJitStubRequired = true;
            if (!compMeta.isComponent) {
                return;
            } /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach((stylesheetMeta) => {
                const /** @type {?} */ styleContext = this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMeta.moduleUrl)), this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
                _createTypeReferenceStub(styleContext, Identifiers.ComponentFactory);
                generatedFiles.push(this._codegenSourceModule(/** @type {?} */ ((stylesheetMeta.moduleUrl)), styleContext));
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
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    _compileImplFile(srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        const /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl, true)[1];
        const /** @type {?} */ generatedFiles = [];
        const /** @type {?} */ outputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push(...this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        // compile all ng modules
        ngModules.forEach((ngModuleType) => this._compileModule(outputCtx, ngModuleType));
        // compile components
        directives.forEach((dirType) => {
            const /** @type {?} */ compMeta = this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return;
            }
            const /** @type {?} */ ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error(`Internal Error: cannot determine the module for component ${identifierName(compMeta.type)}!`);
            }
            // compile styles
            const /** @type {?} */ componentStylesheet = this._styleCompiler.compileComponent(outputCtx, compMeta); /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach((stylesheetMeta) => {
                generatedFiles.push(this._codegenStyles(/** @type {?} */ ((stylesheetMeta.moduleUrl)), compMeta, stylesheetMeta, fileSuffix));
            });
            // compile components
            const /** @type {?} */ compViewVars = this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
            this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0) {
            const /** @type {?} */ srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} ngFactoryCtx
     * @return {?}
     */
    _createSummary(srcFileUrl, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        const /** @type {?} */ symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(symbol => this._symbolResolver.resolveSymbol(symbol));
        const /** @type {?} */ typeData = [
            ...ngModules.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getNgModuleSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(ref)))
            })),
            ...directives.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getDirectiveSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getDirectiveMetadata(ref)))
            })),
            ...pipes.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getPipeSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getPipeMetadata(ref)))
            })),
            ...injectables.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getInjectableSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getInjectableSummary(ref))).type
            }))
        ];
        const /** @type {?} */ forJitOutputCtx = this._createOutputContext(summaryForJitFileName(srcFileUrl, true));
        const { json, exportAs } = serializeSummaries(forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData);
        exportAs.forEach((entry) => {
            ngFactoryCtx.statements.push(o.variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]));
        });
        const /** @type {?} */ summaryJson = new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
        if (this._enableSummariesForJit) {
            return [summaryJson, this._codegenSourceModule(srcFileUrl, forJitOutputCtx)];
        }
        ;
        return [summaryJson];
    }
    /**
     * @param {?} outputCtx
     * @param {?} ngModuleType
     * @return {?}
     */
    _compileModule(outputCtx, ngModuleType) {
        const /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(ngModuleType)));
        const /** @type {?} */ providers = [];
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
    }
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @return {?}
     */
    _compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix) {
        const /** @type {?} */ hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
        const /** @type {?} */ hostMeta = createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
        const /** @type {?} */ hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix)
            .viewClassVar;
        const /** @type {?} */ compFactoryVar = componentFactoryName(compMeta.type.reference);
        const /** @type {?} */ inputsExprs = [];
        for (let /** @type {?} */ propName in compMeta.inputs) {
            const /** @type {?} */ templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        const /** @type {?} */ outputsExprs = [];
        for (let /** @type {?} */ propName in compMeta.outputs) {
            const /** @type {?} */ templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        outputCtx.statements.push(o.variable(compFactoryVar)
            .set(o.importExpr(Identifiers.createComponentFactory).callFn([
            o.literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference),
            o.variable(hostViewFactoryVar), new o.LiteralMapExpr(inputsExprs),
            new o.LiteralMapExpr(outputsExprs),
            o.literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(selector => o.literal(selector)))
        ]))
            .toDeclStmt(o.importType(Identifiers.ComponentFactory, [/** @type {?} */ ((o.expressionType(outputCtx.importExpr(compMeta.type.reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]));
    }
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @return {?}
     */
    _compileComponent(outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        const /** @type {?} */ directives = directiveIdentifiers.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
        const /** @type {?} */ pipes = ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        const { template: parsedTemplate, pipes: usedPipes } = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template))));
        const /** @type {?} */ stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        const /** @type {?} */ viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
    }
    /**
     * @param {?} genFilePath
     * @return {?}
     */
    _createOutputContext(genFilePath) {
        const /** @type {?} */ importExpr = (symbol, typeParams = null) => {
            if (!(symbol instanceof StaticSymbol)) {
                throw new Error(`Internal error: unknown identifier ${JSON.stringify(symbol)}`);
            }
            const /** @type {?} */ arity = this._symbolResolver.getTypeArity(symbol) || 0;
            const { filePath, name, members } = this._symbolResolver.getImportAs(symbol) || symbol;
            const /** @type {?} */ importModule = this._symbolResolver.fileNameToModuleName(filePath, genFilePath);
            // It should be good enough to compare filePath to genFilePath and if they are equal
            // there is a self reference. However, ngfactory files generate to .ts but their
            // symbols have .d.ts so a simple compare is insufficient. They should be canonical
            // and is tracked by #17705.
            const /** @type {?} */ selfReference = this._symbolResolver.fileNameToModuleName(genFilePath, genFilePath);
            const /** @type {?} */ moduleName = importModule === selfReference ? null : importModule;
            // If we are in a type expression that refers to a generic type then supply
            // the required type parameters. If there were not enough type parameters
            // supplied, supply any as the type. Outside a type expression the reference
            // should not supply type parameters and be treated as a simple value reference
            // to the constructor function itself.
            const /** @type {?} */ suppliedTypeParams = typeParams || [];
            const /** @type {?} */ missingTypeParamsCount = arity - suppliedTypeParams.length;
            const /** @type {?} */ allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(o.DYNAMIC_TYPE));
            return members.reduce((expr, memberName) => expr.prop(memberName), /** @type {?} */ (o.importExpr(new o.ExternalReference(moduleName, name, null), allTypeParams)));
        };
        return { statements: [], genFilePath, importExpr };
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} compMeta
     * @param {?} stylesheetMetadata
     * @param {?} fileSuffix
     * @return {?}
     */
    _codegenStyles(srcFileUrl, compMeta, stylesheetMetadata, fileSuffix) {
        const /** @type {?} */ outputCtx = this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMetadata.moduleUrl)), this._styleCompiler.needsStyleShim(compMeta), fileSuffix));
        const /** @type {?} */ compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} ctx
     * @return {?}
     */
    _codegenSourceModule(srcFileUrl, ctx) {
        return new GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
    }
}
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
    compileResult.dependencies.forEach((dep) => {
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
    return `${stylesheetUrl}${shim ? '.shim' : ''}.ngstyle${suffix}`;
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
    const { ngModules, symbolsMissingModule } = _createNgModules(programStaticSymbols, host, metadataResolver);
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    const /** @type {?} */ result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        const /** @type {?} */ messages = result.symbolsMissingModule.map(s => `Cannot determine the module for class ${s.name} in ${s.filePath}! Add ${s.name} to the NgModule to fix it.`);
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
    const /** @type {?} */ moduleMetasByRef = new Map();
    ngModuleMetas.forEach((ngModule) => moduleMetasByRef.set(ngModule.type.reference, ngModule));
    const /** @type {?} */ ngModuleByPipeOrDirective = new Map();
    const /** @type {?} */ ngModulesByFile = new Map();
    const /** @type {?} */ ngDirectivesByFile = new Map();
    const /** @type {?} */ ngPipesByFile = new Map();
    const /** @type {?} */ ngInjectablesByFile = new Map();
    const /** @type {?} */ filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach((symbol) => {
        const /** @type {?} */ filePath = symbol.filePath;
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
    ngModuleMetas.forEach((ngModuleMeta) => {
        const /** @type {?} */ srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach((dirIdentifier) => {
            const /** @type {?} */ fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach((pipeIdentifier) => {
            const /** @type {?} */ fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    const /** @type {?} */ files = [];
    filePaths.forEach((srcUrl) => {
        const /** @type {?} */ directives = ngDirectivesByFile.get(srcUrl) || [];
        const /** @type {?} */ pipes = ngPipesByFile.get(srcUrl) || [];
        const /** @type {?} */ ngModules = ngModulesByFile.get(srcUrl) || [];
        const /** @type {?} */ injectables = ngInjectablesByFile.get(srcUrl) || [];
        files.push({ srcUrl, directives, pipes, ngModules, injectables });
    });
    return {
        // map directive/pipe to module
        ngModuleByPipeOrDirective,
        // list modules and directives for every source file
        files,
        ngModules: ngModuleMetas, symbolsMissingModule
    };
}
/**
 * @param {?} staticSymbolResolver
 * @param {?} files
 * @param {?} host
 * @return {?}
 */
export function extractProgramSymbols(staticSymbolResolver, files, host) {
    const /** @type {?} */ staticSymbols = [];
    files.filter(fileName => host.isSourceFile(fileName)).forEach(sourceFile => {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach((symbol) => {
            const /** @type {?} */ resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            const /** @type {?} */ symbolMeta = resolvedSymbol.metadata;
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
    const /** @type {?} */ ngModules = new Map();
    const /** @type {?} */ programPipesAndDirectives = [];
    const /** @type {?} */ ngModulePipesAndDirective = new Set();
    const /** @type {?} */ addNgModule = (staticSymbol) => {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        const /** @type {?} */ ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
        if (ngModule) {
            ngModules.set(ngModule.type.reference, ngModule);
            ngModule.declaredDirectives.forEach((dir) => ngModulePipesAndDirective.add(dir.reference));
            ngModule.declaredPipes.forEach((pipe) => ngModulePipesAndDirective.add(pipe.reference));
            // For every input module add the list of transitively included modules
            ngModule.transitiveModule.modules.forEach(modMeta => addNgModule(modMeta.reference));
        }
        return !!ngModule;
    };
    programStaticSymbols.forEach((staticSymbol) => {
        if (!addNgModule(staticSymbol) &&
            (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
            programPipesAndDirectives.push(staticSymbol);
        }
    });
    // Throw an error if any of the program pipe or directives is not declared by a module
    const /** @type {?} */ symbolsMissingModule = programPipesAndDirectives.filter(s => !ngModulePipesAndDirective.has(s));
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule };
}
//# sourceMappingURL=compiler.js.map