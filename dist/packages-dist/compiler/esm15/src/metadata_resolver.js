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
import { Attribute, Component, Host, Inject, Injectable, InjectionToken, Optional, Self, SkipSelf, Type, resolveForwardRef, ɵConsole as Console, ɵERROR_COMPONENT_TYPE, ɵccf as createComponentFactory, ɵisPromise as isPromise, ɵstringify as stringify } from '@angular/core';
import { StaticSymbol, StaticSymbolCache } from './aot/static_symbol';
import { ngfactoryFilePath } from './aot/util';
import { assertArrayOfStrings, assertInterpolationSymbols } from './assertions';
import * as cpl from './compile_metadata';
import { CompileReflector } from './compile_reflector';
import { CompilerConfig } from './config';
import { DirectiveNormalizer } from './directive_normalizer';
import { DirectiveResolver } from './directive_resolver';
import { Identifiers } from './identifiers';
import { CompilerInjectable } from './injectable';
import { getAllLifecycleHooks } from './lifecycle_reflector';
import { NgModuleResolver } from './ng_module_resolver';
import { PipeResolver } from './pipe_resolver';
import { ElementSchemaRegistry } from './schema/element_schema_registry';
import { SummaryResolver } from './summary_resolver';
import { SyncAsync, ValueTransformer, noUndefined, syntaxError, visitValue } from './util';
export const /** @type {?} */ ERROR_COLLECTOR_TOKEN = new InjectionToken('ErrorCollector');
export class CompileMetadataResolver {
    /**
     * @param {?} _config
     * @param {?} _ngModuleResolver
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _summaryResolver
     * @param {?} _schemaRegistry
     * @param {?} _directiveNormalizer
     * @param {?} _console
     * @param {?} _staticSymbolCache
     * @param {?} _reflector
     * @param {?=} _errorCollector
     */
    constructor(_config, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
        this._config = _config;
        this._ngModuleResolver = _ngModuleResolver;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._summaryResolver = _summaryResolver;
        this._schemaRegistry = _schemaRegistry;
        this._directiveNormalizer = _directiveNormalizer;
        this._console = _console;
        this._staticSymbolCache = _staticSymbolCache;
        this._reflector = _reflector;
        this._errorCollector = _errorCollector;
        this._nonNormalizedDirectiveCache = new Map();
        this._directiveCache = new Map();
        this._summaryCache = new Map();
        this._pipeCache = new Map();
        this._ngModuleCache = new Map();
        this._ngModuleOfTypes = new Map();
    }
    /**
     * @return {?}
     */
    getReflector() { return this._reflector; }
    /**
     * @param {?} type
     * @return {?}
     */
    clearCacheFor(type) {
        const /** @type {?} */ dirMeta = this._directiveCache.get(type);
        this._directiveCache.delete(type);
        this._nonNormalizedDirectiveCache.delete(type);
        this._summaryCache.delete(type);
        this._pipeCache.delete(type);
        this._ngModuleOfTypes.delete(type);
        // Clear all of the NgModule as they contain transitive information!
        this._ngModuleCache.clear();
        if (dirMeta) {
            this._directiveNormalizer.clearCacheFor(dirMeta);
        }
    }
    /**
     * @return {?}
     */
    clearCache() {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    }
    /**
     * @param {?} baseType
     * @param {?} name
     * @return {?}
     */
    _createProxyClass(baseType, name) {
        let /** @type {?} */ delegate = null;
        const /** @type {?} */ proxyClass = (function () {
            if (!delegate) {
                throw new Error(`Illegal state: Class ${name} for type ${stringify(baseType)} is not compiled yet!`);
            }
            return delegate.apply(this, arguments);
        });
        proxyClass.setDelegate = (d) => {
            delegate = d;
            ((proxyClass)).prototype = d.prototype;
        };
        // Make stringify work correctly
        ((proxyClass)).overriddenName = name;
        return proxyClass;
    }
    /**
     * @param {?} dirType
     * @param {?} name
     * @return {?}
     */
    getGeneratedClass(dirType, name) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
        }
        else {
            return this._createProxyClass(dirType, name);
        }
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, cpl.viewClassName(dirType, 0));
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getHostComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, cpl.hostViewClassName(dirType));
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getHostComponentType(dirType) {
        const /** @type {?} */ name = `${cpl.identifierName({ reference: dirType })}_Host`;
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(dirType.filePath, name);
        }
        else {
            const /** @type {?} */ HostClass = (function HostClass() { });
            HostClass.overriddenName = name;
            return HostClass;
        }
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getRendererType(dirType) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), cpl.rendererTypeName(dirType));
        }
        else {
            // returning an object as proxy,
            // that we fill later during runtime compilation.
            return ({});
        }
    }
    /**
     * @param {?} selector
     * @param {?} dirType
     * @param {?} inputs
     * @param {?} outputs
     * @return {?}
     */
    getComponentFactory(selector, dirType, inputs, outputs) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), cpl.componentFactoryName(dirType));
        }
        else {
            const /** @type {?} */ hostView = this.getHostComponentViewClass(dirType);
            // Note: ngContentSelectors will be filled later once the template is
            // loaded.
            return createComponentFactory(selector, dirType, /** @type {?} */ (hostView), inputs, outputs, []);
        }
    }
    /**
     * @param {?} factory
     * @param {?} ngContentSelectors
     * @return {?}
     */
    initComponentFactory(factory, ngContentSelectors) {
        if (!(factory instanceof StaticSymbol)) {
            factory.ngContentSelectors.push(...ngContentSelectors);
        }
    }
    /**
     * @param {?} type
     * @param {?} kind
     * @return {?}
     */
    _loadSummary(type, kind) {
        let /** @type {?} */ typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            const /** @type {?} */ summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    }
    /**
     * @param {?} ngModuleType
     * @param {?} directiveType
     * @param {?} isSync
     * @return {?}
     */
    loadDirectiveMetadata(ngModuleType, directiveType, isSync) {
        if (this._directiveCache.has(directiveType)) {
            return null;
        }
        directiveType = resolveForwardRef(directiveType);
        const { annotation, metadata } = ((this.getNonNormalizedDirectiveMetadata(directiveType)));
        const /** @type {?} */ createDirectiveMetadata = (templateMetadata) => {
            const /** @type {?} */ normalizedDirMeta = new cpl.CompileDirectiveMetadata({
                isHost: false,
                type: metadata.type,
                isComponent: metadata.isComponent,
                selector: metadata.selector,
                exportAs: metadata.exportAs,
                changeDetection: metadata.changeDetection,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                hostListeners: metadata.hostListeners,
                hostProperties: metadata.hostProperties,
                hostAttributes: metadata.hostAttributes,
                providers: metadata.providers,
                viewProviders: metadata.viewProviders,
                queries: metadata.queries,
                viewQueries: metadata.viewQueries,
                entryComponents: metadata.entryComponents,
                componentViewType: metadata.componentViewType,
                rendererType: metadata.rendererType,
                componentFactory: metadata.componentFactory,
                template: templateMetadata
            });
            if (templateMetadata) {
                this.initComponentFactory(/** @type {?} */ ((metadata.componentFactory)), templateMetadata.ngContentSelectors);
            }
            this._directiveCache.set(directiveType, normalizedDirMeta);
            this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return null;
        };
        if (metadata.isComponent) {
            const /** @type {?} */ template = ((metadata.template));
            const /** @type {?} */ templateMeta = this._directiveNormalizer.normalizeTemplate({
                ngModuleType,
                componentType: directiveType,
                moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
                encapsulation: template.encapsulation,
                template: template.template,
                templateUrl: template.templateUrl,
                styles: template.styles,
                styleUrls: template.styleUrls,
                animations: template.animations,
                interpolation: template.interpolation
            });
            if (isPromise(templateMeta) && isSync) {
                this._reportError(componentStillLoadingError(directiveType), directiveType);
                return null;
            }
            return SyncAsync.then(templateMeta, createDirectiveMetadata);
        }
        else {
            // directive
            createDirectiveMetadata(null);
            return null;
        }
    }
    /**
     * @param {?} directiveType
     * @return {?}
     */
    getNonNormalizedDirectiveMetadata(directiveType) {
        directiveType = resolveForwardRef(directiveType);
        if (!directiveType) {
            return null;
        }
        let /** @type {?} */ cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
            return cacheEntry;
        }
        const /** @type {?} */ dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
            return null;
        }
        let /** @type {?} */ nonNormalizedTemplateMetadata = ((undefined));
        if (dirMeta instanceof Component) {
            // component
            assertArrayOfStrings('styles', dirMeta.styles);
            assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
            assertInterpolationSymbols('interpolation', dirMeta.interpolation);
            const /** @type {?} */ animations = dirMeta.animations;
            nonNormalizedTemplateMetadata = new cpl.CompileTemplateMetadata({
                encapsulation: noUndefined(dirMeta.encapsulation),
                template: noUndefined(dirMeta.template),
                templateUrl: noUndefined(dirMeta.templateUrl),
                styles: dirMeta.styles || [],
                styleUrls: dirMeta.styleUrls || [],
                animations: animations || [],
                interpolation: noUndefined(dirMeta.interpolation),
                isInline: !!dirMeta.template,
                externalStylesheets: [],
                ngContentSelectors: []
            });
        }
        let /** @type {?} */ changeDetectionStrategy = ((null));
        let /** @type {?} */ viewProviders = [];
        let /** @type {?} */ entryComponentMetadata = [];
        let /** @type {?} */ selector = dirMeta.selector;
        if (dirMeta instanceof Component) {
            // Component
            changeDetectionStrategy = ((dirMeta.changeDetection));
            if (dirMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, `viewProviders for "${stringifyType(directiveType)}"`, [], directiveType);
            }
            if (dirMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                    .map((type) => ((this._getEntryComponentMetadata(type))))
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(syntaxError(`Directive ${stringifyType(directiveType)} has no selector, please add it!`), directiveType);
                selector = 'error';
            }
        }
        let /** @type {?} */ providers = [];
        if (dirMeta.providers != null) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, `providers for "${stringifyType(directiveType)}"`, [], directiveType);
        }
        let /** @type {?} */ queries = [];
        let /** @type {?} */ viewQueries = [];
        if (dirMeta.queries != null) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        const /** @type {?} */ metadata = cpl.CompileDirectiveMetadata.create({
            isHost: false,
            selector: selector,
            exportAs: noUndefined(dirMeta.exportAs),
            isComponent: !!nonNormalizedTemplateMetadata,
            type: this._getTypeMetadata(directiveType),
            template: nonNormalizedTemplateMetadata,
            changeDetection: changeDetectionStrategy,
            inputs: dirMeta.inputs || [],
            outputs: dirMeta.outputs || [],
            host: dirMeta.host || {},
            providers: providers || [],
            viewProviders: viewProviders || [],
            queries: queries || [],
            viewQueries: viewQueries || [],
            entryComponents: entryComponentMetadata,
            componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) :
                null,
            rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : null,
            componentFactory: null
        });
        if (nonNormalizedTemplateMetadata) {
            metadata.componentFactory =
                this.getComponentFactory(selector, directiveType, metadata.inputs, metadata.outputs);
        }
        cacheEntry = { metadata, annotation: dirMeta };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
    }
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} directiveType
     * @return {?}
     */
    getDirectiveMetadata(directiveType) {
        const /** @type {?} */ dirMeta = ((this._directiveCache.get(directiveType)));
        if (!dirMeta) {
            this._reportError(syntaxError(`Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive ${stringifyType(directiveType)}.`), directiveType);
        }
        return dirMeta;
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getDirectiveSummary(dirType) {
        const /** @type {?} */ dirSummary = (this._loadSummary(dirType, cpl.CompileSummaryKind.Directive));
        if (!dirSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for directive ${stringifyType(dirType)}.`), dirType);
        }
        return dirSummary;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isDirective(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Directive) ||
            this._directiveResolver.isDirective(type);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isPipe(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Pipe) ||
            this._pipeResolver.isPipe(type);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isNgModule(type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.NgModule) ||
            this._ngModuleResolver.isNgModule(type);
    }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    getNgModuleSummary(moduleType) {
        let /** @type {?} */ moduleSummary = (this._loadSummary(moduleType, cpl.CompileSummaryKind.NgModule));
        if (!moduleSummary) {
            const /** @type {?} */ moduleMeta = this.getNgModuleMetadata(moduleType, false);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    }
    /**
     * Loads the declared directives and pipes of an NgModule.
     * @param {?} moduleType
     * @param {?} isSync
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    loadNgModuleDirectiveAndPipeMetadata(moduleType, isSync, throwIfNotFound = true) {
        const /** @type {?} */ ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        const /** @type {?} */ loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach((id) => {
                const /** @type {?} */ promise = this.loadDirectiveMetadata(moduleType, id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach((id) => this._loadPipeMetadata(id.reference));
        }
        return Promise.all(loading);
    }
    /**
     * @param {?} moduleType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    getNgModuleMetadata(moduleType, throwIfNotFound = true) {
        moduleType = resolveForwardRef(moduleType);
        let /** @type {?} */ compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        const /** @type {?} */ meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        const /** @type {?} */ declaredDirectives = [];
        const /** @type {?} */ exportedNonModuleIdentifiers = [];
        const /** @type {?} */ declaredPipes = [];
        const /** @type {?} */ importedModules = [];
        const /** @type {?} */ exportedModules = [];
        const /** @type {?} */ providers = [];
        const /** @type {?} */ entryComponents = [];
        const /** @type {?} */ bootstrapComponents = [];
        const /** @type {?} */ schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach((importedType) => {
                let /** @type {?} */ importedModuleType = ((undefined));
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    const /** @type {?} */ moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push(...this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, `provider for the NgModule '${stringifyType(importedModuleType)}'`, [], importedType));
                    }
                }
                if (importedModuleType) {
                    if (this._checkSelfImport(moduleType, importedModuleType))
                        return;
                    const /** @type {?} */ importedModuleSummary = this.getNgModuleSummary(importedModuleType);
                    if (!importedModuleSummary) {
                        this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(importedType)} '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'. Please add a @NgModule annotation.`), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach((exportedType) => {
                if (!isValidType(exportedType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(exportedType)}' exported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                const /** @type {?} */ exportedModuleSummary = this.getNgModuleSummary(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        const /** @type {?} */ transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach((declaredType) => {
                if (!isValidType(declaredType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                const /** @type {?} */ declaredIdentifier = this._getIdentifierMetadata(declaredType);
                if (this.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else if (this.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(declaredType)} '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'. Please add a @Pipe/@Directive/@Component annotation.`), moduleType);
                    return;
                }
            });
        }
        const /** @type {?} */ exportedDirectives = [];
        const /** @type {?} */ exportedPipes = [];
        exportedNonModuleIdentifiers.forEach((exportedId) => {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                this._reportError(syntaxError(`Can't export ${this._getTypeDescriptor(exportedId.reference)} ${stringifyType(exportedId.reference)} from ${stringifyType(moduleType)} as it was neither declared nor imported!`), moduleType);
                return;
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push(...this._getProvidersMetadata(meta.providers, entryComponents, `provider for the NgModule '${stringifyType(moduleType)}'`, [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push(...flattenAndDedupeArray(meta.entryComponents)
                .map(type => ((this._getEntryComponentMetadata(type)))));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(type => {
                if (!isValidType(type)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(type)}' used in the bootstrap property of module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                bootstrapComponents.push(this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push(...bootstrapComponents.map(type => ((this._getEntryComponentMetadata(type.reference)))));
        if (meta.schemas) {
            schemas.push(...flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new cpl.CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers,
            entryComponents,
            bootstrapComponents,
            schemas,
            declaredDirectives,
            exportedDirectives,
            declaredPipes,
            exportedPipes,
            importedModules,
            exportedModules,
            transitiveModule,
            id: meta.id || null,
        });
        entryComponents.forEach((id) => transitiveModule.addEntryComponent(id));
        providers.forEach((provider) => transitiveModule.addProvider(provider, /** @type {?} */ ((compileMeta)).type));
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    }
    /**
     * @param {?} moduleType
     * @param {?} importedModuleType
     * @return {?}
     */
    _checkSelfImport(moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
            this._reportError(syntaxError(`'${stringifyType(moduleType)}' module can't import itself`), moduleType);
            return true;
        }
        return false;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _getTypeDescriptor(type) {
        if (this.isDirective(type)) {
            return 'directive';
        }
        if (this.isPipe(type)) {
            return 'pipe';
        }
        if (this.isNgModule(type)) {
            return 'module';
        }
        if (((type)).provide) {
            return 'provider';
        }
        return 'value';
    }
    /**
     * @param {?} type
     * @param {?} moduleType
     * @return {?}
     */
    _addTypeToModule(type, moduleType) {
        const /** @type {?} */ oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(syntaxError(`Type ${stringifyType(type)} is part of the declarations of 2 modules: ${stringifyType(oldModule)} and ${stringifyType(moduleType)}! ` +
                `Please consider moving ${stringifyType(type)} to a higher module that imports ${stringifyType(oldModule)} and ${stringifyType(moduleType)}. ` +
                `You can also create a new NgModule that exports and includes ${stringifyType(type)} then import that NgModule in ${stringifyType(oldModule)} and ${stringifyType(moduleType)}.`), moduleType);
            return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
    }
    /**
     * @param {?} importedModules
     * @param {?} exportedModules
     * @return {?}
     */
    _getTransitiveNgModuleMetadata(importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        const /** @type {?} */ result = new cpl.TransitiveCompileNgModuleMetadata();
        const /** @type {?} */ modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach((modSummary) => {
            modSummary.modules.forEach((mod) => result.addModule(mod));
            modSummary.entryComponents.forEach((comp) => result.addEntryComponent(comp));
            const /** @type {?} */ addedTokens = new Set();
            modSummary.providers.forEach((entry) => {
                const /** @type {?} */ tokenRef = cpl.tokenReference(entry.provider.token);
                let /** @type {?} */ prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                const /** @type {?} */ moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addExportedDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addExportedPipe(id));
        });
        importedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addPipe(id));
        });
        return result;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _getIdentifierMetadata(type) {
        type = resolveForwardRef(type);
        return { reference: type };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isInjectable(type) {
        const /** @type {?} */ annotations = this._reflector.annotations(type);
        // Note: We need an exact check here as @Component / @Directive / ... inherit
        // from @CompilerInjectable!
        return annotations.some(ann => ann.constructor === Injectable);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    getInjectableSummary(type) {
        return {
            summaryKind: cpl.CompileSummaryKind.Injectable,
            type: this._getTypeMetadata(type, null, false)
        };
    }
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @return {?}
     */
    _getInjectableMetadata(type, dependencies = null) {
        const /** @type {?} */ typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    }
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    _getTypeMetadata(type, dependencies = null, throwOnUnknownDeps = true) {
        const /** @type {?} */ identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: getAllLifecycleHooks(this._reflector, identifier.reference),
        };
    }
    /**
     * @param {?} factory
     * @param {?=} dependencies
     * @return {?}
     */
    _getFactoryMetadata(factory, dependencies = null) {
        factory = resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    }
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} pipeType
     * @return {?}
     */
    getPipeMetadata(pipeType) {
        const /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(syntaxError(`Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeMeta || null;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    getPipeSummary(pipeType) {
        const /** @type {?} */ pipeSummary = (this._loadSummary(pipeType, cpl.CompileSummaryKind.Pipe));
        if (!pipeSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeSummary;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    getOrLoadPipeMetadata(pipeType) {
        let /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    _loadPipeMetadata(pipeType) {
        pipeType = resolveForwardRef(pipeType);
        const /** @type {?} */ pipeAnnotation = ((this._pipeResolver.resolve(pipeType)));
        const /** @type {?} */ pipeMeta = new cpl.CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    }
    /**
     * @param {?} typeOrFunc
     * @param {?} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    _getDependenciesMetadata(typeOrFunc, dependencies, throwOnUnknownDeps = true) {
        let /** @type {?} */ hasUnknownDeps = false;
        const /** @type {?} */ params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        const /** @type {?} */ dependenciesMetadata = params.map((param) => {
            let /** @type {?} */ isAttribute = false;
            let /** @type {?} */ isHost = false;
            let /** @type {?} */ isSelf = false;
            let /** @type {?} */ isSkipSelf = false;
            let /** @type {?} */ isOptional = false;
            let /** @type {?} */ token = null;
            if (Array.isArray(param)) {
                param.forEach((paramEntry) => {
                    if (paramEntry instanceof Host) {
                        isHost = true;
                    }
                    else if (paramEntry instanceof Self) {
                        isSelf = true;
                    }
                    else if (paramEntry instanceof SkipSelf) {
                        isSkipSelf = true;
                    }
                    else if (paramEntry instanceof Optional) {
                        isOptional = true;
                    }
                    else if (paramEntry instanceof Attribute) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    }
                    else if (paramEntry instanceof Inject) {
                        token = paramEntry.token;
                    }
                    else if (paramEntry instanceof InjectionToken) {
                        token = paramEntry;
                    }
                    else if (isValidType(paramEntry) && token == null) {
                        token = paramEntry;
                    }
                });
            }
            else {
                token = param;
            }
            if (token == null) {
                hasUnknownDeps = true;
                return ((null));
            }
            return {
                isAttribute,
                isHost,
                isSelf,
                isSkipSelf,
                isOptional,
                token: this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            const /** @type {?} */ depsTokens = dependenciesMetadata.map((dep) => dep ? stringifyType(dep.token) : '?').join(', ');
            const /** @type {?} */ message = `Can't resolve all parameters for ${stringifyType(typeOrFunc)}: (${depsTokens}).`;
            if (throwOnUnknownDeps) {
                this._reportError(syntaxError(message), typeOrFunc);
            }
            else {
                this._console.warn(`Warning: ${message} This will become an error in Angular v5.x`);
            }
        }
        return dependenciesMetadata;
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _getTokenMetadata(token) {
        token = resolveForwardRef(token);
        let /** @type {?} */ compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    }
    /**
     * @param {?} providers
     * @param {?} targetEntryComponents
     * @param {?=} debugInfo
     * @param {?=} compileProviders
     * @param {?=} type
     * @return {?}
     */
    _getProvidersMetadata(providers, targetEntryComponents, debugInfo, compileProviders = [], type) {
        providers.forEach((provider, providerIdx) => {
            if (Array.isArray(provider)) {
                this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = resolveForwardRef(provider);
                let /** @type {?} */ providerMeta = ((undefined));
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    this._validateProvider(provider);
                    providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new cpl.ProviderMeta(provider, { useClass: provider });
                }
                else if (provider === void 0) {
                    this._reportError(syntaxError(`Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files.`));
                    return;
                }
                else {
                    const /** @type {?} */ providersInfo = ((providers.reduce((soFar, seenProvider, seenProviderIdx) => {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push(`${stringifyType(seenProvider)}`);
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push(`?${stringifyType(seenProvider)}?`);
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])))
                        .join(', ');
                    this._reportError(syntaxError(`Invalid ${debugInfo ? debugInfo : 'provider'} - only instances of Provider and Type are allowed, got: [${providersInfo}]`), type);
                    return;
                }
                if (providerMeta.token ===
                    this._reflector.resolveExternalReference(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push(...this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    }
    /**
     * @param {?} provider
     * @return {?}
     */
    _validateProvider(provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(syntaxError(`Invalid provider for ${stringifyType(provider.provide)}. useClass cannot be ${provider.useClass}.
           Usually it happens when:
           1. There's a circular dependency (might be caused by using index.ts (barrel) files).
           2. Class was used before it was declared. Use forwardRef in this case.`));
        }
    }
    /**
     * @param {?} provider
     * @param {?=} type
     * @return {?}
     */
    _getEntryComponentsFromProvider(provider, type) {
        const /** @type {?} */ components = [];
        const /** @type {?} */ collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!`), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!`), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach((identifier) => {
            const /** @type {?} */ entry = this._getEntryComponentMetadata(identifier.reference, false);
            if (entry) {
                components.push(entry);
            }
        });
        return components;
    }
    /**
     * @param {?} dirType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    _getEntryComponentMetadata(dirType, throwIfNotFound = true) {
        const /** @type {?} */ dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirMeta.metadata.componentFactory)) };
        }
        const /** @type {?} */ dirSummary = (this._loadSummary(dirType, cpl.CompileSummaryKind.Directive));
        if (dirSummary && dirSummary.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirSummary.componentFactory)) };
        }
        if (throwIfNotFound) {
            throw syntaxError(`${dirType.name} cannot be used as an entry component.`);
        }
        return null;
    }
    /**
     * @param {?} provider
     * @return {?}
     */
    getProviderMetadata(provider) {
        let /** @type {?} */ compileDeps = ((undefined));
        let /** @type {?} */ compileTypeMetadata = ((null));
        let /** @type {?} */ compileFactoryMetadata = ((null));
        let /** @type {?} */ token = this._getTokenMetadata(provider.token);
        if (provider.useClass) {
            compileTypeMetadata = this._getInjectableMetadata(provider.useClass, provider.dependencies);
            compileDeps = compileTypeMetadata.diDeps;
            if (provider.token === provider.useClass) {
                // use the compileTypeMetadata as it contains information about lifecycleHooks...
                token = { identifier: compileTypeMetadata };
            }
        }
        else if (provider.useFactory) {
            compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
            compileDeps = compileFactoryMetadata.diDeps;
        }
        return {
            token: token,
            useClass: compileTypeMetadata,
            useValue: provider.useValue,
            useFactory: compileFactoryMetadata,
            useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : undefined,
            deps: compileDeps,
            multi: provider.multi
        };
    }
    /**
     * @param {?} queries
     * @param {?} isViewQuery
     * @param {?} directiveType
     * @return {?}
     */
    _getQueriesMetadata(queries, isViewQuery, directiveType) {
        const /** @type {?} */ res = [];
        Object.keys(queries).forEach((propertyName) => {
            const /** @type {?} */ query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    _queryVarBindings(selector) { return selector.split(/\s*,\s*/); }
    /**
     * @param {?} q
     * @param {?} propertyName
     * @param {?} typeOrFunc
     * @return {?}
     */
    _getQueryMetadata(q, propertyName, typeOrFunc) {
        let /** @type {?} */ selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(varName => this._getTokenMetadata(varName));
        }
        else {
            if (!q.selector) {
                this._reportError(syntaxError(`Can't construct a query for the property "${propertyName}" of "${stringifyType(typeOrFunc)}" since the query selector wasn't defined.`), typeOrFunc);
                selectors = [];
            }
            else {
                selectors = [this._getTokenMetadata(q.selector)];
            }
        }
        return {
            selectors,
            first: q.first,
            descendants: q.descendants, propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : ((null))
        };
    }
    /**
     * @param {?} error
     * @param {?=} type
     * @param {?=} otherType
     * @return {?}
     */
    _reportError(error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    }
}
CompileMetadataResolver.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
CompileMetadataResolver.ctorParameters = () => [
    { type: CompilerConfig, },
    { type: NgModuleResolver, },
    { type: DirectiveResolver, },
    { type: PipeResolver, },
    { type: SummaryResolver, },
    { type: ElementSchemaRegistry, },
    { type: DirectiveNormalizer, },
    { type: Console, },
    { type: StaticSymbolCache, decorators: [{ type: Optional },] },
    { type: CompileReflector, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ERROR_COLLECTOR_TOKEN,] },] },
];
function CompileMetadataResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    CompileMetadataResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CompileMetadataResolver.ctorParameters;
    /** @type {?} */
    CompileMetadataResolver.prototype._nonNormalizedDirectiveCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._summaryCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._pipeCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleOfTypes;
    /** @type {?} */
    CompileMetadataResolver.prototype._config;
    /** @type {?} */
    CompileMetadataResolver.prototype._ngModuleResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._pipeResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._summaryResolver;
    /** @type {?} */
    CompileMetadataResolver.prototype._schemaRegistry;
    /** @type {?} */
    CompileMetadataResolver.prototype._directiveNormalizer;
    /** @type {?} */
    CompileMetadataResolver.prototype._console;
    /** @type {?} */
    CompileMetadataResolver.prototype._staticSymbolCache;
    /** @type {?} */
    CompileMetadataResolver.prototype._reflector;
    /** @type {?} */
    CompileMetadataResolver.prototype._errorCollector;
}
/**
 * @param {?} tree
 * @param {?=} out
 * @return {?}
 */
function flattenArray(tree, out = []) {
    if (tree) {
        for (let /** @type {?} */ i = 0; i < tree.length; i++) {
            const /** @type {?} */ item = resolveForwardRef(tree[i]);
            if (Array.isArray(item)) {
                flattenArray(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    return out;
}
/**
 * @param {?} array
 * @return {?}
 */
function dedupeArray(array) {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}
/**
 * @param {?} tree
 * @return {?}
 */
function flattenAndDedupeArray(tree) {
    return dedupeArray(flattenArray(tree));
}
/**
 * @param {?} value
 * @return {?}
 */
function isValidType(value) {
    return (value instanceof StaticSymbol) || (value instanceof Type);
}
/**
 * @param {?} value
 * @param {?} targetIdentifiers
 * @return {?}
 */
function extractIdentifiers(value, targetIdentifiers) {
    visitValue(value, new _CompileValueConverter(), targetIdentifiers);
}
class _CompileValueConverter extends ValueTransformer {
    /**
     * @param {?} value
     * @param {?} targetIdentifiers
     * @return {?}
     */
    visitOther(value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    }
}
/**
 * @param {?} type
 * @return {?}
 */
function stringifyType(type) {
    if (type instanceof StaticSymbol) {
        return `${type.name} in ${type.filePath}`;
    }
    else {
        return stringify(type);
    }
}
/**
 * Indicates that a component is still being loaded in a synchronous compile.
 * @param {?} compType
 * @return {?}
 */
function componentStillLoadingError(compType) {
    const /** @type {?} */ error = Error(`Can't compile synchronously as ${stringify(compType)} is still being loaded!`);
    ((error))[ɵERROR_COMPONENT_TYPE] = compType;
    return error;
}
//# sourceMappingURL=metadata_resolver.js.map