"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var static_symbol_1 = require("./aot/static_symbol");
var util_1 = require("./aot/util");
var assertions_1 = require("./assertions");
var cpl = require("./compile_metadata");
var compile_reflector_1 = require("./compile_reflector");
var config_1 = require("./config");
var directive_normalizer_1 = require("./directive_normalizer");
var directive_resolver_1 = require("./directive_resolver");
var identifiers_1 = require("./identifiers");
var injectable_1 = require("./injectable");
var lifecycle_reflector_1 = require("./lifecycle_reflector");
var ng_module_resolver_1 = require("./ng_module_resolver");
var pipe_resolver_1 = require("./pipe_resolver");
var element_schema_registry_1 = require("./schema/element_schema_registry");
var summary_resolver_1 = require("./summary_resolver");
var util_2 = require("./util");
exports.ERROR_COLLECTOR_TOKEN = new core_1.InjectionToken('ErrorCollector');
// Design notes:
// - don't lazily create metadata:
//   For some metadata, we need to do async work sometimes,
//   so the user has to kick off this loading.
//   But we want to report errors even when the async work is
//   not required to check that the user would have been able
//   to wait correctly.
var CompileMetadataResolver = (function () {
    function CompileMetadataResolver(_config, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
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
    CompileMetadataResolver.prototype.getReflector = function () { return this._reflector; };
    CompileMetadataResolver.prototype.clearCacheFor = function (type) {
        var dirMeta = this._directiveCache.get(type);
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
    };
    CompileMetadataResolver.prototype.clearCache = function () {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    };
    CompileMetadataResolver.prototype._createProxyClass = function (baseType, name) {
        var delegate = null;
        var proxyClass = function () {
            if (!delegate) {
                throw new Error("Illegal state: Class " + name + " for type " + core_1.ɵstringify(baseType) + " is not compiled yet!");
            }
            return delegate.apply(this, arguments);
        };
        proxyClass.setDelegate = function (d) {
            delegate = d;
            proxyClass.prototype = d.prototype;
        };
        // Make stringify work correctly
        proxyClass.overriddenName = name;
        return proxyClass;
    };
    CompileMetadataResolver.prototype.getGeneratedClass = function (dirType, name) {
        if (dirType instanceof static_symbol_1.StaticSymbol) {
            return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), name);
        }
        else {
            return this._createProxyClass(dirType, name);
        }
    };
    CompileMetadataResolver.prototype.getComponentViewClass = function (dirType) {
        return this.getGeneratedClass(dirType, cpl.viewClassName(dirType, 0));
    };
    CompileMetadataResolver.prototype.getHostComponentViewClass = function (dirType) {
        return this.getGeneratedClass(dirType, cpl.hostViewClassName(dirType));
    };
    CompileMetadataResolver.prototype.getHostComponentType = function (dirType) {
        var name = cpl.identifierName({ reference: dirType }) + "_Host";
        if (dirType instanceof static_symbol_1.StaticSymbol) {
            return this._staticSymbolCache.get(dirType.filePath, name);
        }
        else {
            var HostClass = function HostClass() { };
            HostClass.overriddenName = name;
            return HostClass;
        }
    };
    CompileMetadataResolver.prototype.getRendererType = function (dirType) {
        if (dirType instanceof static_symbol_1.StaticSymbol) {
            return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), cpl.rendererTypeName(dirType));
        }
        else {
            // returning an object as proxy,
            // that we fill later during runtime compilation.
            return {};
        }
    };
    CompileMetadataResolver.prototype.getComponentFactory = function (selector, dirType, inputs, outputs) {
        if (dirType instanceof static_symbol_1.StaticSymbol) {
            return this._staticSymbolCache.get(util_1.ngfactoryFilePath(dirType.filePath), cpl.componentFactoryName(dirType));
        }
        else {
            var hostView = this.getHostComponentViewClass(dirType);
            // Note: ngContentSelectors will be filled later once the template is
            // loaded.
            return core_1.ɵccf(selector, dirType, hostView, inputs, outputs, []);
        }
    };
    CompileMetadataResolver.prototype.initComponentFactory = function (factory, ngContentSelectors) {
        if (!(factory instanceof static_symbol_1.StaticSymbol)) {
            (_a = factory.ngContentSelectors).push.apply(_a, ngContentSelectors);
        }
        var _a;
    };
    CompileMetadataResolver.prototype._loadSummary = function (type, kind) {
        var typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            var summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    };
    CompileMetadataResolver.prototype.loadDirectiveMetadata = function (ngModuleType, directiveType, isSync) {
        var _this = this;
        if (this._directiveCache.has(directiveType)) {
            return null;
        }
        directiveType = core_1.resolveForwardRef(directiveType);
        var _a = this.getNonNormalizedDirectiveMetadata(directiveType), annotation = _a.annotation, metadata = _a.metadata;
        var createDirectiveMetadata = function (templateMetadata) {
            var normalizedDirMeta = new cpl.CompileDirectiveMetadata({
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
                _this.initComponentFactory(metadata.componentFactory, templateMetadata.ngContentSelectors);
            }
            _this._directiveCache.set(directiveType, normalizedDirMeta);
            _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return null;
        };
        if (metadata.isComponent) {
            var template = metadata.template;
            var templateMeta = this._directiveNormalizer.normalizeTemplate({
                ngModuleType: ngModuleType,
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
            if (core_1.ɵisPromise(templateMeta) && isSync) {
                this._reportError(componentStillLoadingError(directiveType), directiveType);
                return null;
            }
            return util_2.SyncAsync.then(templateMeta, createDirectiveMetadata);
        }
        else {
            // directive
            createDirectiveMetadata(null);
            return null;
        }
    };
    CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function (directiveType) {
        var _this = this;
        directiveType = core_1.resolveForwardRef(directiveType);
        if (!directiveType) {
            return null;
        }
        var cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
            return cacheEntry;
        }
        var dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
            return null;
        }
        var nonNormalizedTemplateMetadata = undefined;
        if (dirMeta instanceof core_1.Component) {
            // component
            assertions_1.assertArrayOfStrings('styles', dirMeta.styles);
            assertions_1.assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
            assertions_1.assertInterpolationSymbols('interpolation', dirMeta.interpolation);
            var animations = dirMeta.animations;
            nonNormalizedTemplateMetadata = new cpl.CompileTemplateMetadata({
                encapsulation: util_2.noUndefined(dirMeta.encapsulation),
                template: util_2.noUndefined(dirMeta.template),
                templateUrl: util_2.noUndefined(dirMeta.templateUrl),
                styles: dirMeta.styles || [],
                styleUrls: dirMeta.styleUrls || [],
                animations: animations || [],
                interpolation: util_2.noUndefined(dirMeta.interpolation),
                isInline: !!dirMeta.template,
                externalStylesheets: [],
                ngContentSelectors: []
            });
        }
        var changeDetectionStrategy = null;
        var viewProviders = [];
        var entryComponentMetadata = [];
        var selector = dirMeta.selector;
        if (dirMeta instanceof core_1.Component) {
            // Component
            changeDetectionStrategy = dirMeta.changeDetection;
            if (dirMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
            }
            if (dirMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                    .map(function (type) { return _this._getEntryComponentMetadata(type); })
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(util_2.syntaxError("Directive " + stringifyType(directiveType) + " has no selector, please add it!"), directiveType);
                selector = 'error';
            }
        }
        var providers = [];
        if (dirMeta.providers != null) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
        }
        var queries = [];
        var viewQueries = [];
        if (dirMeta.queries != null) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        var metadata = cpl.CompileDirectiveMetadata.create({
            isHost: false,
            selector: selector,
            exportAs: util_2.noUndefined(dirMeta.exportAs),
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
        cacheEntry = { metadata: metadata, annotation: dirMeta };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
    };
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     */
    CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
        var dirMeta = this._directiveCache.get(directiveType);
        if (!dirMeta) {
            this._reportError(util_2.syntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
        }
        return dirMeta;
    };
    CompileMetadataResolver.prototype.getDirectiveSummary = function (dirType) {
        var dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
        if (!dirSummary) {
            this._reportError(util_2.syntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
        }
        return dirSummary;
    };
    CompileMetadataResolver.prototype.isDirective = function (type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Directive) ||
            this._directiveResolver.isDirective(type);
    };
    CompileMetadataResolver.prototype.isPipe = function (type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.Pipe) ||
            this._pipeResolver.isPipe(type);
    };
    CompileMetadataResolver.prototype.isNgModule = function (type) {
        return !!this._loadSummary(type, cpl.CompileSummaryKind.NgModule) ||
            this._ngModuleResolver.isNgModule(type);
    };
    CompileMetadataResolver.prototype.getNgModuleSummary = function (moduleType) {
        var moduleSummary = this._loadSummary(moduleType, cpl.CompileSummaryKind.NgModule);
        if (!moduleSummary) {
            var moduleMeta = this.getNgModuleMetadata(moduleType, false);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    };
    /**
     * Loads the declared directives and pipes of an NgModule.
     */
    CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function (moduleType, isSync, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        var loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach(function (id) {
                var promise = _this.loadDirectiveMetadata(moduleType, id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach(function (id) { return _this._loadPipeMetadata(id.reference); });
        }
        return Promise.all(loading);
    };
    CompileMetadataResolver.prototype.getNgModuleMetadata = function (moduleType, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        moduleType = core_1.resolveForwardRef(moduleType);
        var compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        var meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        var declaredDirectives = [];
        var exportedNonModuleIdentifiers = [];
        var declaredPipes = [];
        var importedModules = [];
        var exportedModules = [];
        var providers = [];
        var entryComponents = [];
        var bootstrapComponents = [];
        var schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach(function (importedType) {
                var importedModuleType = undefined;
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    var moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push.apply(providers, _this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType));
                    }
                }
                if (importedModuleType) {
                    if (_this._checkSelfImport(moduleType, importedModuleType))
                        return;
                    var importedModuleSummary = _this.getNgModuleSummary(importedModuleType);
                    if (!importedModuleSummary) {
                        _this._reportError(util_2.syntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'. Please add a @NgModule annotation."), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach(function (exportedType) {
                if (!isValidType(exportedType)) {
                    _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var exportedModuleSummary = _this.getNgModuleSummary(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        var transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach(function (declaredType) {
                if (!isValidType(declaredType)) {
                    _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var declaredIdentifier = _this._getIdentifierMetadata(declaredType);
                if (_this.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else if (_this.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    _this._reportError(util_2.syntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'. Please add a @Pipe/@Directive/@Component annotation."), moduleType);
                    return;
                }
            });
        }
        var exportedDirectives = [];
        var exportedPipes = [];
        exportedNonModuleIdentifiers.forEach(function (exportedId) {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                _this._reportError(util_2.syntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
                return;
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push.apply(providers, this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push.apply(entryComponents, flattenAndDedupeArray(meta.entryComponents)
                .map(function (type) { return _this._getEntryComponentMetadata(type); }));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(function (type) {
                if (!isValidType(type)) {
                    _this._reportError(util_2.syntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                bootstrapComponents.push(_this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push.apply(entryComponents, bootstrapComponents.map(function (type) { return _this._getEntryComponentMetadata(type.reference); }));
        if (meta.schemas) {
            schemas.push.apply(schemas, flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new cpl.CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers: providers,
            entryComponents: entryComponents,
            bootstrapComponents: bootstrapComponents,
            schemas: schemas,
            declaredDirectives: declaredDirectives,
            exportedDirectives: exportedDirectives,
            declaredPipes: declaredPipes,
            exportedPipes: exportedPipes,
            importedModules: importedModules,
            exportedModules: exportedModules,
            transitiveModule: transitiveModule,
            id: meta.id || null,
        });
        entryComponents.forEach(function (id) { return transitiveModule.addEntryComponent(id); });
        providers.forEach(function (provider) { return transitiveModule.addProvider(provider, compileMeta.type); });
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    };
    CompileMetadataResolver.prototype._checkSelfImport = function (moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
            this._reportError(util_2.syntaxError("'" + stringifyType(moduleType) + "' module can't import itself"), moduleType);
            return true;
        }
        return false;
    };
    CompileMetadataResolver.prototype._getTypeDescriptor = function (type) {
        if (this.isDirective(type)) {
            return 'directive';
        }
        if (this.isPipe(type)) {
            return 'pipe';
        }
        if (this.isNgModule(type)) {
            return 'module';
        }
        if (type.provide) {
            return 'provider';
        }
        return 'value';
    };
    CompileMetadataResolver.prototype._addTypeToModule = function (type, moduleType) {
        var oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(util_2.syntaxError("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! " +
                ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") +
                ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
            return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
    };
    CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function (importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        var result = new cpl.TransitiveCompileNgModuleMetadata();
        var modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach(function (modSummary) {
            modSummary.modules.forEach(function (mod) { return result.addModule(mod); });
            modSummary.entryComponents.forEach(function (comp) { return result.addEntryComponent(comp); });
            var addedTokens = new Set();
            modSummary.providers.forEach(function (entry) {
                var tokenRef = cpl.tokenReference(entry.provider.token);
                var prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                var moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addExportedDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addExportedPipe(id); });
        });
        importedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addPipe(id); });
        });
        return result;
    };
    CompileMetadataResolver.prototype._getIdentifierMetadata = function (type) {
        type = core_1.resolveForwardRef(type);
        return { reference: type };
    };
    CompileMetadataResolver.prototype.isInjectable = function (type) {
        var annotations = this._reflector.annotations(type);
        // Note: We need an exact check here as @Component / @Directive / ... inherit
        // from @CompilerInjectable!
        return annotations.some(function (ann) { return ann.constructor === core_1.Injectable; });
    };
    CompileMetadataResolver.prototype.getInjectableSummary = function (type) {
        return {
            summaryKind: cpl.CompileSummaryKind.Injectable,
            type: this._getTypeMetadata(type, null, false)
        };
    };
    CompileMetadataResolver.prototype._getInjectableMetadata = function (type, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        var typeSummary = this._loadSummary(type, cpl.CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    };
    CompileMetadataResolver.prototype._getTypeMetadata = function (type, dependencies, throwOnUnknownDeps) {
        if (dependencies === void 0) { dependencies = null; }
        if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
        var identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: lifecycle_reflector_1.getAllLifecycleHooks(this._reflector, identifier.reference),
        };
    };
    CompileMetadataResolver.prototype._getFactoryMetadata = function (factory, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        factory = core_1.resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    };
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     */
    CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
        var pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(util_2.syntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeMeta || null;
    };
    CompileMetadataResolver.prototype.getPipeSummary = function (pipeType) {
        var pipeSummary = this._loadSummary(pipeType, cpl.CompileSummaryKind.Pipe);
        if (!pipeSummary) {
            this._reportError(util_2.syntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeSummary;
    };
    CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function (pipeType) {
        var pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    };
    CompileMetadataResolver.prototype._loadPipeMetadata = function (pipeType) {
        pipeType = core_1.resolveForwardRef(pipeType);
        var pipeAnnotation = this._pipeResolver.resolve(pipeType);
        var pipeMeta = new cpl.CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    };
    CompileMetadataResolver.prototype._getDependenciesMetadata = function (typeOrFunc, dependencies, throwOnUnknownDeps) {
        var _this = this;
        if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
        var hasUnknownDeps = false;
        var params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        var dependenciesMetadata = params.map(function (param) {
            var isAttribute = false;
            var isHost = false;
            var isSelf = false;
            var isSkipSelf = false;
            var isOptional = false;
            var token = null;
            if (Array.isArray(param)) {
                param.forEach(function (paramEntry) {
                    if (paramEntry instanceof core_1.Host) {
                        isHost = true;
                    }
                    else if (paramEntry instanceof core_1.Self) {
                        isSelf = true;
                    }
                    else if (paramEntry instanceof core_1.SkipSelf) {
                        isSkipSelf = true;
                    }
                    else if (paramEntry instanceof core_1.Optional) {
                        isOptional = true;
                    }
                    else if (paramEntry instanceof core_1.Attribute) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    }
                    else if (paramEntry instanceof core_1.Inject) {
                        token = paramEntry.token;
                    }
                    else if (paramEntry instanceof core_1.InjectionToken) {
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
                return null;
            }
            return {
                isAttribute: isAttribute,
                isHost: isHost,
                isSelf: isSelf,
                isSkipSelf: isSkipSelf,
                isOptional: isOptional,
                token: _this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            var depsTokens = dependenciesMetadata.map(function (dep) { return dep ? stringifyType(dep.token) : '?'; }).join(', ');
            var message = "Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ").";
            if (throwOnUnknownDeps) {
                this._reportError(util_2.syntaxError(message), typeOrFunc);
            }
            else {
                this._console.warn("Warning: " + message + " This will become an error in Angular v5.x");
            }
        }
        return dependenciesMetadata;
    };
    CompileMetadataResolver.prototype._getTokenMetadata = function (token) {
        token = core_1.resolveForwardRef(token);
        var compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    };
    CompileMetadataResolver.prototype._getProvidersMetadata = function (providers, targetEntryComponents, debugInfo, compileProviders, type) {
        var _this = this;
        if (compileProviders === void 0) { compileProviders = []; }
        providers.forEach(function (provider, providerIdx) {
            if (Array.isArray(provider)) {
                _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = core_1.resolveForwardRef(provider);
                var providerMeta = undefined;
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    _this._validateProvider(provider);
                    providerMeta = new cpl.ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new cpl.ProviderMeta(provider, { useClass: provider });
                }
                else if (provider === void 0) {
                    _this._reportError(util_2.syntaxError("Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files."));
                    return;
                }
                else {
                    var providersInfo = providers.reduce(function (soFar, seenProvider, seenProviderIdx) {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push("" + stringifyType(seenProvider));
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push("?" + stringifyType(seenProvider) + "?");
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])
                        .join(', ');
                    _this._reportError(util_2.syntaxError("Invalid " + (debugInfo ? debugInfo : 'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
                    return;
                }
                if (providerMeta.token ===
                    _this._reflector.resolveExternalReference(identifiers_1.Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push.apply(targetEntryComponents, _this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(_this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    };
    CompileMetadataResolver.prototype._validateProvider = function (provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(util_2.syntaxError("Invalid provider for " + stringifyType(provider.provide) + ". useClass cannot be " + provider.useClass + ".\n           Usually it happens when:\n           1. There's a circular dependency (might be caused by using index.ts (barrel) files).\n           2. Class was used before it was declared. Use forwardRef in this case."));
        }
    };
    CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function (provider, type) {
        var _this = this;
        var components = [];
        var collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(util_2.syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(util_2.syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach(function (identifier) {
            var entry = _this._getEntryComponentMetadata(identifier.reference, false);
            if (entry) {
                components.push(entry);
            }
        });
        return components;
    };
    CompileMetadataResolver.prototype._getEntryComponentMetadata = function (dirType, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
            return { componentType: dirType, componentFactory: dirMeta.metadata.componentFactory };
        }
        var dirSummary = this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
        if (dirSummary && dirSummary.isComponent) {
            return { componentType: dirType, componentFactory: dirSummary.componentFactory };
        }
        if (throwIfNotFound) {
            throw util_2.syntaxError(dirType.name + " cannot be used as an entry component.");
        }
        return null;
    };
    CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
        var compileDeps = undefined;
        var compileTypeMetadata = null;
        var compileFactoryMetadata = null;
        var token = this._getTokenMetadata(provider.token);
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
    };
    CompileMetadataResolver.prototype._getQueriesMetadata = function (queries, isViewQuery, directiveType) {
        var _this = this;
        var res = [];
        Object.keys(queries).forEach(function (propertyName) {
            var query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(_this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    };
    CompileMetadataResolver.prototype._queryVarBindings = function (selector) { return selector.split(/\s*,\s*/); };
    CompileMetadataResolver.prototype._getQueryMetadata = function (q, propertyName, typeOrFunc) {
        var _this = this;
        var selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(function (varName) { return _this._getTokenMetadata(varName); });
        }
        else {
            if (!q.selector) {
                this._reportError(util_2.syntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
                selectors = [];
            }
            else {
                selectors = [this._getTokenMetadata(q.selector)];
            }
        }
        return {
            selectors: selectors,
            first: q.first,
            descendants: q.descendants, propertyName: propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : null
        };
    };
    CompileMetadataResolver.prototype._reportError = function (error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    };
    return CompileMetadataResolver;
}());
CompileMetadataResolver = __decorate([
    injectable_1.CompilerInjectable(),
    __param(8, core_1.Optional()),
    __param(10, core_1.Optional()), __param(10, core_1.Inject(exports.ERROR_COLLECTOR_TOKEN)),
    __metadata("design:paramtypes", [config_1.CompilerConfig, ng_module_resolver_1.NgModuleResolver,
        directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver,
        summary_resolver_1.SummaryResolver,
        element_schema_registry_1.ElementSchemaRegistry,
        directive_normalizer_1.DirectiveNormalizer, core_1.ɵConsole,
        static_symbol_1.StaticSymbolCache,
        compile_reflector_1.CompileReflector, Function])
], CompileMetadataResolver);
exports.CompileMetadataResolver = CompileMetadataResolver;
function flattenArray(tree, out) {
    if (out === void 0) { out = []; }
    if (tree) {
        for (var i = 0; i < tree.length; i++) {
            var item = core_1.resolveForwardRef(tree[i]);
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
function dedupeArray(array) {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}
function flattenAndDedupeArray(tree) {
    return dedupeArray(flattenArray(tree));
}
function isValidType(value) {
    return (value instanceof static_symbol_1.StaticSymbol) || (value instanceof core_1.Type);
}
function extractIdentifiers(value, targetIdentifiers) {
    util_2.visitValue(value, new _CompileValueConverter(), targetIdentifiers);
}
var _CompileValueConverter = (function (_super) {
    __extends(_CompileValueConverter, _super);
    function _CompileValueConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    _CompileValueConverter.prototype.visitOther = function (value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    };
    return _CompileValueConverter;
}(util_2.ValueTransformer));
function stringifyType(type) {
    if (type instanceof static_symbol_1.StaticSymbol) {
        return type.name + " in " + type.filePath;
    }
    else {
        return core_1.ɵstringify(type);
    }
}
/**
 * Indicates that a component is still being loaded in a synchronous compile.
 */
function componentStillLoadingError(compType) {
    var error = Error("Can't compile synchronously as " + core_1.ɵstringify(compType) + " is still being loaded!");
    error[core_1.ɵERROR_COMPONENT_TYPE] = compType;
    return error;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWV0YWRhdGFfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlZO0FBRXpZLHFEQUFvRTtBQUNwRSxtQ0FBNkM7QUFDN0MsMkNBQThFO0FBQzlFLHdDQUEwQztBQUMxQyx5REFBcUQ7QUFDckQsbUNBQXdDO0FBQ3hDLCtEQUEyRDtBQUMzRCwyREFBdUQ7QUFDdkQsNkNBQTBDO0FBQzFDLDJDQUFnRDtBQUNoRCw2REFBMkQ7QUFDM0QsMkRBQXNEO0FBQ3RELGlEQUE2QztBQUM3Qyw0RUFBdUU7QUFDdkUsdURBQW1EO0FBQ25ELCtCQUF5RjtBQUc1RSxRQUFBLHFCQUFxQixHQUFHLElBQUkscUJBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTFFLGdCQUFnQjtBQUNoQixrQ0FBa0M7QUFDbEMsMkRBQTJEO0FBQzNELDhDQUE4QztBQUM5Qyw2REFBNkQ7QUFDN0QsNkRBQTZEO0FBQzdELHVCQUF1QjtBQUV2QixJQUFhLHVCQUF1QjtJQVNsQyxpQ0FDWSxPQUF1QixFQUFVLGlCQUFtQyxFQUNwRSxrQkFBcUMsRUFBVSxhQUEyQixFQUMxRSxnQkFBc0MsRUFDdEMsZUFBc0MsRUFDdEMsb0JBQXlDLEVBQVUsUUFBaUIsRUFDeEQsa0JBQXFDLEVBQ2pELFVBQTRCLEVBQ2UsZUFBZ0M7UUFQM0UsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ3BFLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMxRSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXNCO1FBQ3RDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN0Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXFCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUN4RCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ2pELGVBQVUsR0FBVixVQUFVLENBQWtCO1FBQ2Usb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBaEIvRSxpQ0FBNEIsR0FDaEMsSUFBSSxHQUFHLEVBQThFLENBQUM7UUFDbEYsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBMkMsQ0FBQztRQUNyRSxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUEwQyxDQUFDO1FBQ2xFLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztRQUMzRCxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUEwQyxDQUFDO1FBQ25FLHFCQUFnQixHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO0lBVStCLENBQUM7SUFFM0YsOENBQVksR0FBWixjQUFtQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFNUQsK0NBQWEsR0FBYixVQUFjLElBQWU7UUFDM0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELENBQUM7SUFDSCxDQUFDO0lBRUQsNENBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVPLG1EQUFpQixHQUF6QixVQUEwQixRQUFhLEVBQUUsSUFBWTtRQUNuRCxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUM7UUFDekIsSUFBTSxVQUFVLEdBQXdCO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLElBQUksS0FBSyxDQUNYLDBCQUF3QixJQUFJLGtCQUFhLGlCQUFTLENBQUMsUUFBUSxDQUFDLDBCQUF1QixDQUFDLENBQUM7WUFDM0YsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsV0FBVyxHQUFHLFVBQUMsQ0FBQztZQUN6QixRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ1AsVUFBVyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVDLENBQUMsQ0FBQztRQUNGLGdDQUFnQztRQUMxQixVQUFXLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUN4QyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxtREFBaUIsR0FBekIsVUFBMEIsT0FBWSxFQUFFLElBQVk7UUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLDRCQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLHdCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0gsQ0FBQztJQUVPLHVEQUFxQixHQUE3QixVQUE4QixPQUFZO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELDJEQUF5QixHQUF6QixVQUEwQixPQUFZO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxzREFBb0IsR0FBcEIsVUFBcUIsT0FBWTtRQUMvQixJQUFNLElBQUksR0FBTSxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLFVBQU8sQ0FBQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksNEJBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFNLFNBQVMsR0FBUSx1QkFBc0IsQ0FBQyxDQUFDO1lBQy9DLFNBQVMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRWhDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFFTyxpREFBZSxHQUF2QixVQUF3QixPQUFZO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSw0QkFBWSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FDOUIsd0JBQWlCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLGdDQUFnQztZQUNoQyxpREFBaUQ7WUFDakQsTUFBTSxDQUFNLEVBQUUsQ0FBQztRQUNqQixDQUFDO0lBQ0gsQ0FBQztJQUVPLHFEQUFtQixHQUEzQixVQUNJLFFBQWdCLEVBQUUsT0FBWSxFQUFFLE1BQW9DLEVBQ3BFLE9BQWdDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSw0QkFBWSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FDOUIsd0JBQWlCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RCxxRUFBcUU7WUFDckUsVUFBVTtZQUNWLE1BQU0sQ0FBQyxXQUFzQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQU8sUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkYsQ0FBQztJQUNILENBQUM7SUFFTyxzREFBb0IsR0FBNUIsVUFDSSxPQUEyQyxFQUFFLGtCQUE0QjtRQUMzRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxZQUFZLDRCQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsQ0FBQSxLQUFBLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQSxDQUFDLElBQUksV0FBSSxrQkFBa0IsRUFBRTtRQUN6RCxDQUFDOztJQUNILENBQUM7SUFFTyw4Q0FBWSxHQUFwQixVQUFxQixJQUFTLEVBQUUsSUFBNEI7UUFDMUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0QsV0FBVyxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssSUFBSSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDOUUsQ0FBQztJQUVELHVEQUFxQixHQUFyQixVQUFzQixZQUFpQixFQUFFLGFBQWtCLEVBQUUsTUFBZTtRQUE1RSxpQkE4REM7UUE3REMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsYUFBYSxHQUFHLHdCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNDLElBQUEsMERBQWdGLEVBQS9FLDBCQUFVLEVBQUUsc0JBQVEsQ0FBNEQ7UUFFdkYsSUFBTSx1QkFBdUIsR0FBRyxVQUFDLGdCQUFvRDtZQUNuRixJQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLHdCQUF3QixDQUFDO2dCQUN6RCxNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztnQkFDakMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO2dCQUMzQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7Z0JBQzNCLGVBQWUsRUFBRSxRQUFRLENBQUMsZUFBZTtnQkFDekMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2dCQUN2QixPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ3pCLGFBQWEsRUFBRSxRQUFRLENBQUMsYUFBYTtnQkFDckMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjO2dCQUN2QyxjQUFjLEVBQUUsUUFBUSxDQUFDLGNBQWM7Z0JBQ3ZDLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztnQkFDN0IsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO2dCQUNyQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ3pCLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztnQkFDakMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlO2dCQUN6QyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsaUJBQWlCO2dCQUM3QyxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7Z0JBQ25DLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxnQkFBZ0I7Z0JBQzNDLFFBQVEsRUFBRSxnQkFBZ0I7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixLQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLGdCQUFrQixFQUFFLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDOUYsQ0FBQztZQUNELEtBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzNELEtBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBVSxDQUFDO1lBQ3JDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDL0QsWUFBWSxjQUFBO2dCQUNaLGFBQWEsRUFBRSxhQUFhO2dCQUM1QixTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDO2dCQUN4RSxhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWE7Z0JBQ3JDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtnQkFDM0IsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO2dCQUNqQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07Z0JBQ3ZCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztnQkFDN0IsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO2dCQUMvQixhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWE7YUFDdEMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLENBQUMsaUJBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUNELE1BQU0sQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixZQUFZO1lBQ1osdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsbUVBQWlDLEdBQWpDLFVBQWtDLGFBQWtCO1FBQXBELGlCQStHQztRQTdHQyxhQUFhLEdBQUcsd0JBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQixDQUFDO1FBQ0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFJLDZCQUE2QixHQUFnQyxTQUFXLENBQUM7UUFFN0UsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLGdCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFlBQVk7WUFDWixpQ0FBb0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLGlDQUFvQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckQsdUNBQTBCLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVuRSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBRXRDLDZCQUE2QixHQUFHLElBQUksR0FBRyxDQUFDLHVCQUF1QixDQUFDO2dCQUM5RCxhQUFhLEVBQUUsa0JBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUNqRCxRQUFRLEVBQUUsa0JBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO2dCQUN2QyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUM3QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFO2dCQUM1QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFO2dCQUNsQyxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7Z0JBQzVCLGFBQWEsRUFBRSxrQkFBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ2pELFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVE7Z0JBQzVCLG1CQUFtQixFQUFFLEVBQUU7Z0JBQ3ZCLGtCQUFrQixFQUFFLEVBQUU7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksdUJBQXVCLEdBQTRCLElBQU0sQ0FBQztRQUM5RCxJQUFJLGFBQWEsR0FBa0MsRUFBRSxDQUFDO1FBQ3RELElBQUksc0JBQXNCLEdBQXdDLEVBQUUsQ0FBQztRQUNyRSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxnQkFBUyxDQUFDLENBQUMsQ0FBQztZQUNqQyxZQUFZO1lBQ1osdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGVBQWlCLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLGFBQWEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQ3RDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsc0JBQXNCLEVBQzdDLHlCQUFzQixhQUFhLENBQUMsYUFBYSxDQUFDLE9BQUcsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixzQkFBc0IsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO3FCQUN6QyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFHLEVBQXZDLENBQXVDLENBQUM7cUJBQ3RELE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsQ0FBQztZQUNuRSxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sWUFBWTtZQUNaLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsWUFBWSxDQUNiLGtCQUFXLENBQ1AsZUFBYSxhQUFhLENBQUMsYUFBYSxDQUFDLHFDQUFrQyxDQUFDLEVBQ2hGLGFBQWEsQ0FBQyxDQUFDO2dCQUNuQixRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3JCLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQWtDLEVBQUUsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUIsU0FBUyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDbEMsT0FBTyxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsRUFDekMscUJBQWtCLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBRyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQStCLEVBQUUsQ0FBQztRQUM3QyxJQUFJLFdBQVcsR0FBK0IsRUFBRSxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1QixPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUM7WUFDbkQsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsa0JBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3ZDLFdBQVcsRUFBRSxDQUFDLENBQUMsNkJBQTZCO1lBQzVDLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1lBQzFDLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsZUFBZSxFQUFFLHVCQUF1QjtZQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFO1lBQzVCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRTtZQUN4QixTQUFTLEVBQUUsU0FBUyxJQUFJLEVBQUU7WUFDMUIsYUFBYSxFQUFFLGFBQWEsSUFBSSxFQUFFO1lBQ2xDLE9BQU8sRUFBRSxPQUFPLElBQUksRUFBRTtZQUN0QixXQUFXLEVBQUUsV0FBVyxJQUFJLEVBQUU7WUFDOUIsZUFBZSxFQUFFLHNCQUFzQjtZQUN2QyxpQkFBaUIsRUFBRSw2QkFBNkIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDO2dCQUN6QyxJQUFJO1lBQ3ZELFlBQVksRUFBRSw2QkFBNkIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUk7WUFDeEYsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7WUFDbEMsUUFBUSxDQUFDLGdCQUFnQjtnQkFDckIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0YsQ0FBQztRQUNELFVBQVUsR0FBRyxFQUFDLFFBQVEsVUFBQSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxzREFBb0IsR0FBcEIsVUFBcUIsYUFBa0I7UUFDckMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFHLENBQUM7UUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUNQLGdKQUE4SSxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQUcsQ0FBQyxFQUNsTCxhQUFhLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQscURBQW1CLEdBQW5CLFVBQW9CLE9BQVk7UUFDOUIsSUFBTSxVQUFVLEdBQ2lCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5RixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUNQLDZEQUEyRCxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQUcsQ0FBQyxFQUN6RixPQUFPLENBQUMsQ0FBQztRQUNmLENBQUM7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCw2Q0FBVyxHQUFYLFVBQVksSUFBUztRQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7WUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsd0NBQU0sR0FBTixVQUFPLElBQVM7UUFDZCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7WUFDekQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELDRDQUFVLEdBQVYsVUFBVyxJQUFTO1FBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztZQUM3RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxvREFBa0IsR0FBbEIsVUFBbUIsVUFBZTtRQUNoQyxJQUFJLGFBQWEsR0FDZSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0YsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0QsYUFBYSxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzNELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0VBQW9DLEdBQXBDLFVBQXFDLFVBQWUsRUFBRSxNQUFlLEVBQUUsZUFBc0I7UUFBN0YsaUJBY0M7UUFkc0UsZ0NBQUEsRUFBQSxzQkFBc0I7UUFFM0YsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN2RSxJQUFNLE9BQU8sR0FBbUIsRUFBRSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtnQkFDckMsSUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM3RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRSxJQUFLLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQscURBQW1CLEdBQW5CLFVBQW9CLFVBQWUsRUFBRSxlQUFzQjtRQUEzRCxpQkFtTEM7UUFuTG9DLGdDQUFBLEVBQUEsc0JBQXNCO1FBQ3pELFVBQVUsR0FBRyx3QkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDckIsQ0FBQztRQUNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBTSxrQkFBa0IsR0FBb0MsRUFBRSxDQUFDO1FBQy9ELElBQU0sNEJBQTRCLEdBQW9DLEVBQUUsQ0FBQztRQUN6RSxJQUFNLGFBQWEsR0FBb0MsRUFBRSxDQUFDO1FBQzFELElBQU0sZUFBZSxHQUFpQyxFQUFFLENBQUM7UUFDekQsSUFBTSxlQUFlLEdBQWlDLEVBQUUsQ0FBQztRQUN6RCxJQUFNLFNBQVMsR0FBa0MsRUFBRSxDQUFDO1FBQ3BELElBQU0sZUFBZSxHQUF3QyxFQUFFLENBQUM7UUFDaEUsSUFBTSxtQkFBbUIsR0FBb0MsRUFBRSxDQUFDO1FBQ2hFLElBQU0sT0FBTyxHQUFxQixFQUFFLENBQUM7UUFFckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFlBQVk7Z0JBQ3ZELElBQUksa0JBQWtCLEdBQWMsU0FBVyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixrQkFBa0IsR0FBRyxZQUFZLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBTSxtQkFBbUIsR0FBd0IsWUFBWSxDQUFDO29CQUM5RCxrQkFBa0IsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUM7b0JBQ2xELEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLFNBQVMsQ0FBQyxJQUFJLE9BQWQsU0FBUyxFQUFTLEtBQUksQ0FBQyxxQkFBcUIsQ0FDeEMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFDOUMsZ0NBQThCLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFHLEVBQUUsRUFBRSxFQUN0RSxZQUFZLENBQUMsRUFBRTtvQkFDckIsQ0FBQztnQkFDSCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO3dCQUFDLE1BQU0sQ0FBQztvQkFDbEUsSUFBTSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDMUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLEtBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCxnQkFBYyxLQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLFVBQUssYUFBYSxDQUFDLFlBQVksQ0FBQyxrQ0FBNkIsYUFBYSxDQUFDLFVBQVUsQ0FBQywwQ0FBdUMsQ0FBQyxFQUNyTCxVQUFVLENBQUMsQ0FBQzt3QkFDaEIsTUFBTSxDQUFDO29CQUNULENBQUM7b0JBQ0QsZUFBZSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEtBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCx1QkFBcUIsYUFBYSxDQUFDLFlBQVksQ0FBQyxrQ0FBNkIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFHLENBQUMsRUFDOUcsVUFBVSxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQztnQkFDVCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFlBQVk7Z0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsS0FBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUNQLHVCQUFxQixhQUFhLENBQUMsWUFBWSxDQUFDLGtDQUE2QixhQUFhLENBQUMsVUFBVSxDQUFDLE1BQUcsQ0FBQyxFQUM5RyxVQUFVLENBQUMsQ0FBQztvQkFDaEIsTUFBTSxDQUFDO2dCQUNULENBQUM7Z0JBQ0QsSUFBTSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3BFLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztvQkFDMUIsZUFBZSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLDRCQUE0QixDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELG1EQUFtRDtRQUNuRCxxQ0FBcUM7UUFDckMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQy9GLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxZQUFZO2dCQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLEtBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCx1QkFBcUIsYUFBYSxDQUFDLFlBQVksQ0FBQyxrQ0FBNkIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFHLENBQUMsRUFDOUcsVUFBVSxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQztnQkFDVCxDQUFDO2dCQUNELElBQU0sa0JBQWtCLEdBQUcsS0FBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNyRSxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2xELGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUM1QyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQzdDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDaEQsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUN2QyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEtBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCxnQkFBYyxLQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLFVBQUssYUFBYSxDQUFDLFlBQVksQ0FBQyxrQ0FBNkIsYUFBYSxDQUFDLFVBQVUsQ0FBQyw0REFBeUQsQ0FBQyxFQUN2TSxVQUFVLENBQUMsQ0FBQztvQkFDaEIsTUFBTSxDQUFDO2dCQUNULENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFNLGtCQUFrQixHQUFvQyxFQUFFLENBQUM7UUFDL0QsSUFBTSxhQUFhLEdBQW9DLEVBQUUsQ0FBQztRQUMxRCw0QkFBNEIsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0Qsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNwQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDL0IsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsWUFBWSxDQUNiLGtCQUFXLENBQ1Asa0JBQWdCLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsY0FBUyxhQUFhLENBQUMsVUFBVSxDQUFDLDhDQUEyQyxDQUFDLEVBQ3RMLFVBQVUsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLENBQUM7WUFDVCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCw4Q0FBOEM7UUFDOUMsOERBQThEO1FBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25CLFNBQVMsQ0FBQyxJQUFJLE9BQWQsU0FBUyxFQUFTLElBQUksQ0FBQyxxQkFBcUIsQ0FDeEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQy9CLGdDQUE4QixhQUFhLENBQUMsVUFBVSxDQUFDLE1BQUcsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7UUFDbkYsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLGVBQWUsQ0FBQyxJQUFJLE9BQXBCLGVBQWUsRUFBUyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2lCQUN6QyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFHLEVBQXZDLENBQXVDLENBQUMsRUFBRTtRQUNsRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkIscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsS0FBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUNQLHVCQUFxQixhQUFhLENBQUMsSUFBSSxDQUFDLG9EQUErQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQUcsQ0FBQyxFQUN4SCxVQUFVLENBQUMsQ0FBQztvQkFDaEIsTUFBTSxDQUFDO2dCQUNULENBQUM7Z0JBQ0QsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELGVBQWUsQ0FBQyxJQUFJLE9BQXBCLGVBQWUsRUFDUixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRyxFQUFqRCxDQUFpRCxDQUFDLEVBQUU7UUFFM0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLElBQUksT0FBWixPQUFPLEVBQVMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3ZELENBQUM7UUFFRCxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDNUMsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7WUFDdkMsU0FBUyxXQUFBO1lBQ1QsZUFBZSxpQkFBQTtZQUNmLG1CQUFtQixxQkFBQTtZQUNuQixPQUFPLFNBQUE7WUFDUCxrQkFBa0Isb0JBQUE7WUFDbEIsa0JBQWtCLG9CQUFBO1lBQ2xCLGFBQWEsZUFBQTtZQUNiLGFBQWEsZUFBQTtZQUNiLGVBQWUsaUJBQUE7WUFDZixlQUFlLGlCQUFBO1lBQ2YsZ0JBQWdCLGtCQUFBO1lBQ2hCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7UUFDeEUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBYSxDQUFDLElBQUksQ0FBQyxFQUExRCxDQUEwRCxDQUFDLENBQUM7UUFDNUYsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU8sa0RBQWdCLEdBQXhCLFVBQXlCLFVBQXFCLEVBQUUsa0JBQTZCO1FBQzNFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUFDLE1BQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQ0FBOEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxvREFBa0IsR0FBMUIsVUFBMkIsSUFBZTtRQUN4QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBRSxJQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFHTyxrREFBZ0IsR0FBeEIsVUFBeUIsSUFBZSxFQUFFLFVBQXFCO1FBQzdELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCxVQUFRLGFBQWEsQ0FBQyxJQUFJLENBQUMsbURBQThDLGFBQWEsQ0FBQyxTQUFTLENBQUMsYUFBUSxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQUk7aUJBQ3RJLDRCQUEwQixhQUFhLENBQUMsSUFBSSxDQUFDLHlDQUFvQyxhQUFhLENBQUMsU0FBUyxDQUFDLGFBQVEsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFJLENBQUE7aUJBQzlJLGtFQUFnRSxhQUFhLENBQUMsSUFBSSxDQUFDLHNDQUFpQyxhQUFhLENBQUMsU0FBUyxDQUFDLGFBQVEsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFHLENBQUEsQ0FBQyxFQUNyTCxVQUFVLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLGdFQUE4QixHQUF0QyxVQUNJLGVBQTZDLEVBQzdDLGVBQTZDO1FBQy9DLHFGQUFxRjtRQUNyRixJQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO1FBQzNELElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQ2hELGVBQWUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTtZQUN6RCxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztZQUMzRCxVQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1lBQzdFLElBQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7WUFDbkMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2dCQUNqQyxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFELElBQUksV0FBVyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDakIsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7b0JBQzdCLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUNELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN6Qyx5RUFBeUU7Z0JBQ3pFLHVFQUF1RTtnQkFDdkUsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3RCxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUMzQixXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxQixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVO1lBQ2pDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQztZQUMvRSxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztRQUNILGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVO1lBQ2pDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7WUFDdkUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyx3REFBc0IsR0FBOUIsVUFBK0IsSUFBZTtRQUM1QyxJQUFJLEdBQUcsd0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCw4Q0FBWSxHQUFaLFVBQWEsSUFBUztRQUNwQixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCw2RUFBNkU7UUFDN0UsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLFdBQVcsS0FBSyxpQkFBVSxFQUE5QixDQUE4QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHNEQUFvQixHQUFwQixVQUFxQixJQUFTO1FBQzVCLE1BQU0sQ0FBQztZQUNMLFdBQVcsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsVUFBVTtZQUM5QyxJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1NBQy9DLENBQUM7SUFDSixDQUFDO0lBRU8sd0RBQXNCLEdBQTlCLFVBQStCLElBQWUsRUFBRSxZQUErQjtRQUEvQiw2QkFBQSxFQUFBLG1CQUErQjtRQUU3RSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0UsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztRQUMxQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVPLGtEQUFnQixHQUF4QixVQUNJLElBQWUsRUFBRSxZQUErQixFQUNoRCxrQkFBeUI7UUFEUiw2QkFBQSxFQUFBLG1CQUErQjtRQUNoRCxtQ0FBQSxFQUFBLHlCQUF5QjtRQUMzQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDO1lBQ0wsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO1lBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUM7WUFDN0YsY0FBYyxFQUFFLDBDQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUM1RSxDQUFDO0lBQ0osQ0FBQztJQUVPLHFEQUFtQixHQUEzQixVQUE0QixPQUFpQixFQUFFLFlBQStCO1FBQS9CLDZCQUFBLEVBQUEsbUJBQStCO1FBRTVFLE9BQU8sR0FBRyx3QkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxFQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlEQUFlLEdBQWYsVUFBZ0IsUUFBYTtRQUMzQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUNiLGtCQUFXLENBQ1Asc0lBQW9JLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBRyxDQUFDLEVBQ25LLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0RBQWMsR0FBZCxVQUFlLFFBQWE7UUFDMUIsSUFBTSxXQUFXLEdBQ1csSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JGLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsWUFBWSxDQUNiLGtCQUFXLENBQ1Asd0RBQXNELGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBRyxDQUFDLEVBQ3JGLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCx1REFBcUIsR0FBckIsVUFBc0IsUUFBYTtRQUNqQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDZCxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxtREFBaUIsR0FBekIsVUFBMEIsUUFBYTtRQUNyQyxRQUFRLEdBQUcsd0JBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFHLENBQUM7UUFFOUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUM7WUFDM0MsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7WUFDckMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1lBQ3pCLElBQUksRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUk7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTywwREFBd0IsR0FBaEMsVUFDSSxVQUE4QixFQUFFLFlBQXdCLEVBQ3hELGtCQUF5QjtRQUY3QixpQkFrRUM7UUFoRUcsbUNBQUEsRUFBQSx5QkFBeUI7UUFDM0IsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQU0sTUFBTSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFNUUsSUFBTSxvQkFBb0IsR0FBc0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUs7WUFDL0UsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVO29CQUN2QixFQUFFLENBQUMsQ0FBQyxVQUFVLFlBQVksV0FBSSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDaEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxZQUFZLFdBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2hCLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsWUFBWSxlQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUNwQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLFlBQVksZUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDcEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxZQUFZLGdCQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUNuQixLQUFLLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztvQkFDbkMsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxZQUFZLGFBQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3hDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO29CQUMzQixDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLFlBQVkscUJBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hELEtBQUssR0FBRyxVQUFVLENBQUM7b0JBQ3JCLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDcEQsS0FBSyxHQUFHLFVBQVUsQ0FBQztvQkFDckIsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDdEIsTUFBTSxDQUFDLElBQU0sQ0FBQztZQUNoQixDQUFDO1lBRUQsTUFBTSxDQUFDO2dCQUNMLFdBQVcsYUFBQTtnQkFDWCxNQUFNLFFBQUE7Z0JBQ04sTUFBTSxRQUFBO2dCQUNOLFVBQVUsWUFBQTtnQkFDVixVQUFVLFlBQUE7Z0JBQ1YsS0FBSyxFQUFFLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7YUFDckMsQ0FBQztRQUVKLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLFVBQVUsR0FDWixvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQXBDLENBQW9DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkYsSUFBTSxPQUFPLEdBQ1Qsc0NBQW9DLGFBQWEsQ0FBQyxVQUFVLENBQUMsV0FBTSxVQUFVLE9BQUksQ0FBQztZQUN0RixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBWSxPQUFPLCtDQUE0QyxDQUFDLENBQUM7WUFDdEYsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDOUIsQ0FBQztJQUVPLG1EQUFpQixHQUF6QixVQUEwQixLQUFVO1FBQ2xDLEtBQUssR0FBRyx3QkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxJQUFJLFlBQXNDLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixZQUFZLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sWUFBWSxHQUFHLEVBQUMsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxFQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVPLHVEQUFxQixHQUE3QixVQUNJLFNBQXFCLEVBQUUscUJBQTBELEVBQ2pGLFNBQWtCLEVBQUUsZ0JBQW9ELEVBQ3hFLElBQVU7UUFIZCxpQkFpREM7UUEvQ3VCLGlDQUFBLEVBQUEscUJBQW9EO1FBRTFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFhLEVBQUUsV0FBbUI7WUFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDM0YsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsR0FBRyx3QkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxZQUFZLEdBQXFCLFNBQVcsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkYsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNqQyxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2xFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7Z0JBQ3RFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLEtBQUksQ0FBQyxZQUFZLENBQUMsa0JBQVcsQ0FDekIsd0lBQXdJLENBQUMsQ0FBQyxDQUFDO29CQUMvSSxNQUFNLENBQUM7Z0JBQ1QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFNLGFBQWEsR0FDSixTQUFTLENBQUMsTUFBTSxDQUN0QixVQUFDLEtBQWUsRUFBRSxZQUFpQixFQUFFLGVBQXVCO3dCQUMxRCxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUcsQ0FBQyxDQUFDO3dCQUMvQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBRyxDQUFDLENBQUM7d0JBQ2pELENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDcEIsQ0FBQzt3QkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNmLENBQUMsRUFDRCxFQUFFLENBQUU7eUJBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQixLQUFJLENBQUMsWUFBWSxDQUNiLGtCQUFXLENBQ1AsY0FBVyxTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVUsbUVBQTZELGFBQWEsTUFBRyxDQUFDLEVBQy9ILElBQUksQ0FBQyxDQUFDO29CQUNWLE1BQU0sQ0FBQztnQkFDVCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLO29CQUNsQixLQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLHlCQUFXLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZGLHFCQUFxQixDQUFDLElBQUksT0FBMUIscUJBQXFCLEVBQVMsS0FBSSxDQUFDLCtCQUErQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDMUYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVPLG1EQUFpQixHQUF6QixVQUEwQixRQUFhO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQVcsQ0FDekIsMEJBQXdCLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLDZCQUF3QixRQUFRLENBQUMsUUFBUSwrTkFHeEIsQ0FBQyxDQUFDLENBQUM7UUFDakYsQ0FBQztJQUNILENBQUM7SUFFTyxpRUFBK0IsR0FBdkMsVUFBd0MsUUFBMEIsRUFBRSxJQUFVO1FBQTlFLGlCQTBCQztRQXhCQyxJQUFNLFVBQVUsR0FBd0MsRUFBRSxDQUFDO1FBQzNELElBQU0sb0JBQW9CLEdBQW9DLEVBQUUsQ0FBQztRQUVqRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLFlBQVksQ0FDYixrQkFBVyxDQUFDLGdFQUFnRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekYsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FBQyxzRUFBc0UsQ0FBQyxFQUNuRixJQUFJLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVU7WUFDdEMsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDM0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVPLDREQUEwQixHQUFsQyxVQUFtQyxPQUFZLEVBQUUsZUFBc0I7UUFBdEIsZ0NBQUEsRUFBQSxzQkFBc0I7UUFFckUsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLEVBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFrQixFQUFDLENBQUM7UUFDekYsQ0FBQztRQUNELElBQU0sVUFBVSxHQUNpQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUYsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxFQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLGdCQUFrQixFQUFDLENBQUM7UUFDbkYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxrQkFBVyxDQUFJLE9BQU8sQ0FBQyxJQUFJLDJDQUF3QyxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQscURBQW1CLEdBQW5CLFVBQW9CLFFBQTBCO1FBQzVDLElBQUksV0FBVyxHQUFzQyxTQUFXLENBQUM7UUFDakUsSUFBSSxtQkFBbUIsR0FBNEIsSUFBTSxDQUFDO1FBQzFELElBQUksc0JBQXNCLEdBQStCLElBQU0sQ0FBQztRQUNoRSxJQUFJLEtBQUssR0FBNkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU3RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0QixtQkFBbUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUYsV0FBVyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxpRkFBaUY7Z0JBQ2pGLEtBQUssR0FBRyxFQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBQyxDQUFDO1lBQzVDLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9CLHNCQUFzQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM5RixXQUFXLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQzlDLENBQUM7UUFFRCxNQUFNLENBQUM7WUFDTCxLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO1lBQzNCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTO1lBQzVGLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUVPLHFEQUFtQixHQUEzQixVQUNJLE9BQStCLEVBQUUsV0FBb0IsRUFDckQsYUFBd0I7UUFGNUIsaUJBYUM7UUFWQyxJQUFNLEdBQUcsR0FBK0IsRUFBRSxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBb0I7WUFDaEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU8sbURBQWlCLEdBQXpCLFVBQTBCLFFBQWEsSUFBYyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEYsbURBQWlCLEdBQXpCLFVBQTBCLENBQVEsRUFBRSxZQUFvQixFQUFFLFVBQThCO1FBQXhGLGlCQXdCQztRQXRCQyxJQUFJLFNBQXFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkMsU0FBUztnQkFDTCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1FBQ3pGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxZQUFZLENBQ2Isa0JBQVcsQ0FDUCxnREFBNkMsWUFBWSxnQkFBUyxhQUFhLENBQUMsVUFBVSxDQUFDLGdEQUE0QyxDQUFDLEVBQzVJLFVBQVUsQ0FBQyxDQUFDO2dCQUNoQixTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUM7WUFDTCxTQUFTLFdBQUE7WUFDVCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7WUFDZCxXQUFXLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxZQUFZLGNBQUE7WUFDeEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFNO1NBQ3ZELENBQUM7SUFDSixDQUFDO0lBRU8sOENBQVksR0FBcEIsVUFBcUIsS0FBVSxFQUFFLElBQVUsRUFBRSxTQUFlO1FBQzFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFoL0JELElBZy9CQztBQWgvQlksdUJBQXVCO0lBRG5DLCtCQUFrQixFQUFFO0lBZ0JkLFdBQUEsZUFBUSxFQUFFLENBQUE7SUFFVixZQUFBLGVBQVEsRUFBRSxDQUFBLEVBQUUsWUFBQSxhQUFNLENBQUMsNkJBQXFCLENBQUMsQ0FBQTtxQ0FQekIsdUJBQWMsRUFBNkIscUNBQWdCO1FBQ2hELHNDQUFpQixFQUF5Qiw0QkFBWTtRQUN4RCxrQ0FBZTtRQUNoQiwrQ0FBcUI7UUFDaEIsMENBQW1CLEVBQW9CLGVBQU87UUFDcEMsaUNBQWlCO1FBQ3JDLG9DQUFnQjtHQWhCN0IsdUJBQXVCLENBZy9CbkM7QUFoL0JZLDBEQUF1QjtBQWsvQnBDLHNCQUFzQixJQUFXLEVBQUUsR0FBb0I7SUFBcEIsb0JBQUEsRUFBQSxRQUFvQjtJQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckMsSUFBTSxJQUFJLEdBQUcsd0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxxQkFBcUIsS0FBWTtJQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCwrQkFBK0IsSUFBVztJQUN4QyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFFRCxxQkFBcUIsS0FBVTtJQUM3QixNQUFNLENBQUMsQ0FBQyxLQUFLLFlBQVksNEJBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLFdBQUksQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCw0QkFBNEIsS0FBVSxFQUFFLGlCQUFrRDtJQUN4RixpQkFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLHNCQUFzQixFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQ7SUFBcUMsMENBQWdCO0lBQXJEOztJQUlBLENBQUM7SUFIQywyQ0FBVSxHQUFWLFVBQVcsS0FBVSxFQUFFLGlCQUFrRDtRQUN2RSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBcUMsdUJBQWdCLEdBSXBEO0FBRUQsdUJBQXVCLElBQVM7SUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLDRCQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBSSxJQUFJLENBQUMsSUFBSSxZQUFPLElBQUksQ0FBQyxRQUFVLENBQUM7SUFDNUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILG9DQUFvQyxRQUFtQjtJQUNyRCxJQUFNLEtBQUssR0FDUCxLQUFLLENBQUMsb0NBQWtDLGlCQUFTLENBQUMsUUFBUSxDQUFDLDRCQUF5QixDQUFDLENBQUM7SUFDekYsS0FBYSxDQUFDLDRCQUFxQixDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDIn0=