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
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("./compile_metadata");
var identifiers_1 = require("./identifiers");
var parse_util_1 = require("./parse_util");
var template_ast_1 = require("./template_parser/template_ast");
var ProviderError = (function (_super) {
    __extends(ProviderError, _super);
    function ProviderError(message, span) {
        return _super.call(this, span, message) || this;
    }
    return ProviderError;
}(parse_util_1.ParseError));
exports.ProviderError = ProviderError;
var ProviderViewContext = (function () {
    function ProviderViewContext(reflector, component) {
        var _this = this;
        this.reflector = reflector;
        this.component = component;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new Map();
        component.viewProviders.forEach(function (provider) {
            if (_this.viewProviders.get(compile_metadata_1.tokenReference(provider.token)) == null) {
                _this.viewProviders.set(compile_metadata_1.tokenReference(provider.token), true);
            }
        });
    }
    return ProviderViewContext;
}());
exports.ProviderViewContext = ProviderViewContext;
var ProviderElementContext = (function () {
    function ProviderElementContext(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, isTemplate, contentQueryStartId, _sourceSpan) {
        var _this = this;
        this.viewContext = viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._hasViewContainer = false;
        this._queriedTokens = new Map();
        this._attrs = {};
        attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
        var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
        this._contentQueries = _getContentQueries(contentQueryStartId, directivesMeta);
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._addQueryReadsTo(provider.token, provider.token, _this._queriedTokens);
        });
        if (isTemplate) {
            var templateRefId = identifiers_1.createTokenForExternalReference(this.viewContext.reflector, identifiers_1.Identifiers.TemplateRef);
            this._addQueryReadsTo(templateRefId, templateRefId, this._queriedTokens);
        }
        refs.forEach(function (refAst) {
            var defaultQueryValue = refAst.value ||
                identifiers_1.createTokenForExternalReference(_this.viewContext.reflector, identifiers_1.Identifiers.ElementRef);
            _this._addQueryReadsTo({ value: refAst.name }, defaultQueryValue, _this._queriedTokens);
        });
        if (this._queriedTokens.get(this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.ViewContainerRef))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        Array.from(this._allProviders.values()).forEach(function (provider) {
            var eager = provider.eager || _this._queriedTokens.get(compile_metadata_1.tokenReference(provider.token));
            if (eager) {
                _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    ProviderElementContext.prototype.afterElement = function () {
        var _this = this;
        // collect lazy providers
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    };
    Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
        get: function () {
            // Note: Maps keep their insertion order.
            var lazyProviders = [];
            var eagerProviders = [];
            this._transformedProviders.forEach(function (provider) {
                if (provider.eager) {
                    eagerProviders.push(provider);
                }
                else {
                    lazyProviders.push(provider);
                }
            });
            return lazyProviders.concat(eagerProviders);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
        get: function () {
            var sortedProviderTypes = this.transformProviders.map(function (provider) { return provider.token.identifier; });
            var sortedDirectives = this._directiveAsts.slice();
            sortedDirectives.sort(function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                sortedProviderTypes.indexOf(dir2.directive.type); });
            return sortedDirectives;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
        get: function () { return this._hasViewContainer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "queryMatches", {
        get: function () {
            var allMatches = [];
            this._queriedTokens.forEach(function (matches) { allMatches.push.apply(allMatches, matches); });
            return allMatches;
        },
        enumerable: true,
        configurable: true
    });
    ProviderElementContext.prototype._addQueryReadsTo = function (token, defaultValue, queryReadTokens) {
        this._getQueriesFor(token).forEach(function (query) {
            var queryValue = query.meta.read || defaultValue;
            var tokenRef = compile_metadata_1.tokenReference(queryValue);
            var queryMatches = queryReadTokens.get(tokenRef);
            if (!queryMatches) {
                queryMatches = [];
                queryReadTokens.set(tokenRef, queryMatches);
            }
            queryMatches.push({ queryId: query.queryId, value: queryValue });
        });
    };
    ProviderElementContext.prototype._getQueriesFor = function (token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(compile_metadata_1.tokenReference(token));
            if (queries) {
                result.push.apply(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this.viewContext.viewQueries.get(compile_metadata_1.tokenReference(token));
        if (queries) {
            result.push.apply(result, queries);
        }
        return result;
    };
    ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
        var _this = this;
        var resolvedProvider = this._allProviders.get(compile_metadata_1.tokenReference(token));
        if (!resolvedProvider || ((requestingProviderType === template_ast_1.ProviderAstType.Directive ||
            requestingProviderType === template_ast_1.ProviderAstType.PublicService) &&
            resolvedProvider.providerType === template_ast_1.ProviderAstType.PrivateService) ||
            ((requestingProviderType === template_ast_1.ProviderAstType.PrivateService ||
                requestingProviderType === template_ast_1.ProviderAstType.PublicService) &&
                resolvedProvider.providerType === template_ast_1.ProviderAstType.Builtin)) {
            return null;
        }
        var transformedProviderAst = this._transformedProviders.get(compile_metadata_1.tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(compile_metadata_1.tokenReference(token)) != null) {
            this.viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + compile_metadata_1.tokenName(token), this._sourceSpan));
            return null;
        }
        this._seenProviders.set(compile_metadata_1.tokenReference(token), true);
        var transformedProviders = resolvedProvider.providers.map(function (provider) {
            var transformedUseValue = provider.useValue;
            var transformedUseExisting = provider.useExisting;
            var transformedDeps = undefined;
            if (provider.useExisting != null) {
                var existingDiDep = _this._getDependency(resolvedProvider.providerType, { token: provider.useExisting }, eager);
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                var deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            else if (provider.useClass) {
                var deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(compile_metadata_1.tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = false; }
        if (dep.isAttribute) {
            var attrValue = this._attrs[dep.token.value];
            return { isValue: true, value: attrValue == null ? null : attrValue };
        }
        if (dep.token != null) {
            // access builtints
            if ((requestingProviderType === template_ast_1.ProviderAstType.Directive ||
                requestingProviderType === template_ast_1.ProviderAstType.Component)) {
                if (compile_metadata_1.tokenReference(dep.token) ===
                    this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.Renderer) ||
                    compile_metadata_1.tokenReference(dep.token) ===
                        this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.ElementRef) ||
                    compile_metadata_1.tokenReference(dep.token) ===
                        this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.ChangeDetectorRef) ||
                    compile_metadata_1.tokenReference(dep.token) ===
                        this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.TemplateRef)) {
                    return dep;
                }
                if (compile_metadata_1.tokenReference(dep.token) ===
                    this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.ViewContainerRef)) {
                    this._hasViewContainer = true;
                }
            }
            // access the injector
            if (compile_metadata_1.tokenReference(dep.token) ===
                this.viewContext.reflector.resolveExternalReference(identifiers_1.Identifiers.Injector)) {
                return dep;
            }
            // access providers
            if (this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager) != null) {
                return dep;
            }
        }
        return null;
    };
    ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = false; }
        var currElement = this;
        var currEager = eager;
        var result = null;
        if (!dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
            if (!result && dep.isOptional) {
                result = { isValue: true, value: null };
            }
        }
        else {
            // check parent elements
            while (!result && currElement._parent) {
                var prevElement = currElement;
                currElement = currElement._parent;
                if (prevElement._isViewRoot) {
                    currEager = false;
                }
                result = currElement._getLocalDependency(template_ast_1.ProviderAstType.PublicService, dep, currEager);
            }
            // check @Host restriction
            if (!result) {
                if (!dep.isHost || this.viewContext.component.isHost ||
                    this.viewContext.component.type.reference === compile_metadata_1.tokenReference(dep.token) ||
                    this.viewContext.viewProviders.get(compile_metadata_1.tokenReference(dep.token)) != null) {
                    result = dep;
                }
                else {
                    result = dep.isOptional ? result = { isValue: true, value: null } : null;
                }
            }
        }
        if (!result) {
            this.viewContext.errors.push(new ProviderError("No provider for " + compile_metadata_1.tokenName(dep.token), this._sourceSpan));
        }
        return result;
    };
    return ProviderElementContext;
}());
exports.ProviderElementContext = ProviderElementContext;
var NgModuleProviderAnalyzer = (function () {
    function NgModuleProviderAnalyzer(reflector, ngModule, extraProviders, sourceSpan) {
        var _this = this;
        this.reflector = reflector;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._errors = [];
        this._allProviders = new Map();
        ngModule.transitiveModule.modules.forEach(function (ngModuleType) {
            var ngModuleProvider = { token: { identifier: ngModuleType }, useClass: ngModuleType };
            _resolveProviders([ngModuleProvider], template_ast_1.ProviderAstType.PublicService, true, sourceSpan, _this._errors, _this._allProviders);
        });
        _resolveProviders(ngModule.transitiveModule.providers.map(function (entry) { return entry.provider; }).concat(extraProviders), template_ast_1.ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
    }
    NgModuleProviderAnalyzer.prototype.parse = function () {
        var _this = this;
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.token, provider.eager);
        });
        if (this._errors.length > 0) {
            var errorString = this._errors.join('\n');
            throw new Error("Provider parse errors:\n" + errorString);
        }
        // Note: Maps keep their insertion order.
        var lazyProviders = [];
        var eagerProviders = [];
        this._transformedProviders.forEach(function (provider) {
            if (provider.eager) {
                eagerProviders.push(provider);
            }
            else {
                lazyProviders.push(provider);
            }
        });
        return lazyProviders.concat(eagerProviders);
    };
    NgModuleProviderAnalyzer.prototype._getOrCreateLocalProvider = function (token, eager) {
        var _this = this;
        var resolvedProvider = this._allProviders.get(compile_metadata_1.tokenReference(token));
        if (!resolvedProvider) {
            return null;
        }
        var transformedProviderAst = this._transformedProviders.get(compile_metadata_1.tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(compile_metadata_1.tokenReference(token)) != null) {
            this._errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + compile_metadata_1.tokenName(token), resolvedProvider.sourceSpan));
            return null;
        }
        this._seenProviders.set(compile_metadata_1.tokenReference(token), true);
        var transformedProviders = resolvedProvider.providers.map(function (provider) {
            var transformedUseValue = provider.useValue;
            var transformedUseExisting = provider.useExisting;
            var transformedDeps = undefined;
            if (provider.useExisting != null) {
                var existingDiDep = _this._getDependency({ token: provider.useExisting }, eager, resolvedProvider.sourceSpan);
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                var deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            else if (provider.useClass) {
                var deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(compile_metadata_1.tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    NgModuleProviderAnalyzer.prototype._getDependency = function (dep, eager, requestorSourceSpan) {
        if (eager === void 0) { eager = false; }
        var foundLocal = false;
        if (!dep.isSkipSelf && dep.token != null) {
            // access the injector
            if (compile_metadata_1.tokenReference(dep.token) ===
                this.reflector.resolveExternalReference(identifiers_1.Identifiers.Injector) ||
                compile_metadata_1.tokenReference(dep.token) ===
                    this.reflector.resolveExternalReference(identifiers_1.Identifiers.ComponentFactoryResolver)) {
                foundLocal = true;
                // access providers
            }
            else if (this._getOrCreateLocalProvider(dep.token, eager) != null) {
                foundLocal = true;
            }
        }
        var result = dep;
        if (dep.isSelf && !foundLocal) {
            if (dep.isOptional) {
                result = { isValue: true, value: null };
            }
            else {
                this._errors.push(new ProviderError("No provider for " + compile_metadata_1.tokenName(dep.token), requestorSourceSpan));
            }
        }
        return result;
    };
    return NgModuleProviderAnalyzer;
}());
exports.NgModuleProviderAnalyzer = NgModuleProviderAnalyzer;
function _transformProvider(provider, _a) {
    var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
    return {
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
    };
}
function _transformProviderAst(provider, _a) {
    var eager = _a.eager, providers = _a.providers;
    return new template_ast_1.ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
}
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    var providersByToken = new Map();
    directives.forEach(function (directive) {
        var dirProvider = { token: { identifier: directive.type }, useClass: directive.type };
        _resolveProviders([dirProvider], directive.isComponent ? template_ast_1.ProviderAstType.Component : template_ast_1.ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    var directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
    directivesWithComponentFirst.forEach(function (directive) {
        _resolveProviders(directive.providers, template_ast_1.ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(directive.viewProviders, template_ast_1.ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
    });
    return providersByToken;
}
function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
    providers.forEach(function (provider) {
        var resolvedProvider = targetProvidersByToken.get(compile_metadata_1.tokenReference(provider.token));
        if (resolvedProvider != null && !!resolvedProvider.multiProvider !== !!provider.multi) {
            targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + compile_metadata_1.tokenName(resolvedProvider.token), sourceSpan));
        }
        if (!resolvedProvider) {
            var lifecycleHooks = provider.token.identifier &&
                provider.token.identifier.lifecycleHooks ?
                provider.token.identifier.lifecycleHooks :
                [];
            var isUseValue = !(provider.useClass || provider.useExisting || provider.useFactory);
            resolvedProvider = new template_ast_1.ProviderAst(provider.token, !!provider.multi, eager || isUseValue, [provider], providerType, lifecycleHooks, sourceSpan);
            targetProvidersByToken.set(compile_metadata_1.tokenReference(provider.token), resolvedProvider);
        }
        else {
            if (!provider.multi) {
                resolvedProvider.providers.length = 0;
            }
            resolvedProvider.providers.push(provider);
        }
    });
}
function _getViewQueries(component) {
    // Note: queries start with id 1 so we can use the number in a Bloom filter!
    var viewQueryId = 1;
    var viewQueries = new Map();
    if (component.viewQueries) {
        component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, { meta: query, queryId: viewQueryId++ }); });
    }
    return viewQueries;
}
function _getContentQueries(contentQueryStartId, directives) {
    var contentQueryId = contentQueryStartId;
    var contentQueries = new Map();
    directives.forEach(function (directive, directiveIndex) {
        if (directive.queries) {
            directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, { meta: query, queryId: contentQueryId++ }); });
        }
    });
    return contentQueries;
}
function _addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach(function (token) {
        var entry = map.get(compile_metadata_1.tokenReference(token));
        if (!entry) {
            entry = [];
            map.set(compile_metadata_1.tokenReference(token), entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcHJvdmlkZXJfYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBR0gsdURBQWdRO0FBRWhRLDZDQUEyRTtBQUMzRSwyQ0FBeUQ7QUFDekQsK0RBQTZIO0FBRTdIO0lBQW1DLGlDQUFVO0lBQzNDLHVCQUFZLE9BQWUsRUFBRSxJQUFxQjtlQUFJLGtCQUFNLElBQUksRUFBRSxPQUFPLENBQUM7SUFBRSxDQUFDO0lBQy9FLG9CQUFDO0FBQUQsQ0FBQyxBQUZELENBQW1DLHVCQUFVLEdBRTVDO0FBRlksc0NBQWE7QUFTMUI7SUFXRSw2QkFBbUIsU0FBMkIsRUFBUyxTQUFtQztRQUExRixpQkFRQztRQVJrQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQTBCO1FBRjFGLFdBQU0sR0FBb0IsRUFBRSxDQUFDO1FBRzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFDN0MsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGlDQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsaUNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0QsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILDBCQUFDO0FB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