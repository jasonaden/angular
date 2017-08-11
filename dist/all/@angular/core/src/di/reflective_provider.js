"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("../reflection/reflection");
var type_1 = require("../type");
var forward_ref_1 = require("./forward_ref");
var injection_token_1 = require("./injection_token");
var metadata_1 = require("./metadata");
var reflective_errors_1 = require("./reflective_errors");
var reflective_key_1 = require("./reflective_key");
/**
 * `Dependency` is used by the framework to extend DI.
 * This is internal to Angular and should not be used directly.
 */
var ReflectiveDependency = (function () {
    function ReflectiveDependency(key, optional, visibility) {
        this.key = key;
        this.optional = optional;
        this.visibility = visibility;
    }
    ReflectiveDependency.fromKey = function (key) {
        return new ReflectiveDependency(key, false, null);
    };
    return ReflectiveDependency;
}());
exports.ReflectiveDependency = ReflectiveDependency;
var _EMPTY_LIST = [];
var ResolvedReflectiveProvider_ = (function () {
    function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
        this.key = key;
        this.resolvedFactories = resolvedFactories;
        this.multiProvider = multiProvider;
    }
    Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
        get: function () { return this.resolvedFactories[0]; },
        enumerable: true,
        configurable: true
    });
    return ResolvedReflectiveProvider_;
}());
exports.ResolvedReflectiveProvider_ = ResolvedReflectiveProvider_;
/**
 * An internal resolved representation of a factory function created by resolving {@link
 * Provider}.
 * @experimental
 */
var ResolvedReflectiveFactory = (function () {
    function ResolvedReflectiveFactory(
        /**
         * Factory function which can return an instance of an object represented by a key.
         */
        factory, 
        /**
         * Arguments (dependencies) to the `factory` function.
         */
        dependencies) {
        this.factory = factory;
        this.dependencies = dependencies;
    }
    return ResolvedReflectiveFactory;
}());
exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
/**
 * Resolve a single provider.
 */
function resolveReflectiveFactory(provider) {
    var factoryFn;
    var resolvedDeps;
    if (provider.useClass) {
        var useClass = forward_ref_1.resolveForwardRef(provider.useClass);
        factoryFn = reflection_1.reflector.factory(useClass);
        resolvedDeps = _dependenciesFor(useClass);
    }
    else if (provider.useExisting) {
        factoryFn = function (aliasInstance) { return aliasInstance; };
        resolvedDeps = [ReflectiveDependency.fromKey(reflective_key_1.ReflectiveKey.get(provider.useExisting))];
    }
    else if (provider.useFactory) {
        factoryFn = provider.useFactory;
        resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
    }
    else {
        factoryFn = function () { return provider.useValue; };
        resolvedDeps = _EMPTY_LIST;
    }
    return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
}
/**
 * Converts the {@link Provider} into {@link ResolvedProvider}.
 *
 * {@link Injector} internally only uses {@link ResolvedProvider}, {@link Provider} contains
 * convenience provider syntax.
 */
function resolveReflectiveProvider(provider) {
    return new ResolvedReflectiveProvider_(reflective_key_1.ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi || false);
}
/**
 * Resolve a list of Providers.
 */
function resolveReflectiveProviders(providers) {
    var normalized = _normalizeProviders(providers, []);
    var resolved = normalized.map(resolveReflectiveProvider);
    var resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
    return Array.from(resolvedProviderMap.values());
}
exports.resolveReflectiveProviders = resolveReflectiveProviders;
/**
 * Merges a list of ResolvedProviders into a list where
 * each key is contained exactly once and multi providers
 * have been merged.
 */
function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
    for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        var existing = normalizedProvidersMap.get(provider.key.id);
        if (existing) {
            if (provider.multiProvider !== existing.multiProvider) {
                throw reflective_errors_1.mixingMultiProvidersWithRegularProvidersError(existing, provider);
            }
            if (provider.multiProvider) {
                for (var j = 0; j < provider.resolvedFactories.length; j++) {
                    existing.resolvedFactories.push(provider.resolvedFactories[j]);
                }
            }
            else {
                normalizedProvidersMap.set(provider.key.id, provider);
            }
        }
        else {
            var resolvedProvider = void 0;
            if (provider.multiProvider) {
                resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
            }
            else {
                resolvedProvider = provider;
            }
            normalizedProvidersMap.set(provider.key.id, resolvedProvider);
        }
    }
    return normalizedProvidersMap;
}
exports.mergeResolvedReflectiveProviders = mergeResolvedReflectiveProviders;
function _normalizeProviders(providers, res) {
    providers.forEach(function (b) {
        if (b instanceof type_1.Type) {
            res.push({ provide: b, useClass: b });
        }
        else if (b && typeof b == 'object' && b.provide !== undefined) {
            res.push(b);
        }
        else if (b instanceof Array) {
            _normalizeProviders(b, res);
        }
        else {
            throw reflective_errors_1.invalidProviderError(b);
        }
    });
    return res;
}
function constructDependencies(typeOrFunc, dependencies) {
    if (!dependencies) {
        return _dependenciesFor(typeOrFunc);
    }
    else {
        var params_1 = dependencies.map(function (t) { return [t]; });
        return dependencies.map(function (t) { return _extractToken(typeOrFunc, t, params_1); });
    }
}
exports.constructDependencies = constructDependencies;
function _dependenciesFor(typeOrFunc) {
    var params = reflection_1.reflector.parameters(typeOrFunc);
    if (!params)
        return [];
    if (params.some(function (p) { return p == null; })) {
        throw reflective_errors_1.noAnnotationError(typeOrFunc, params);
    }
    return params.map(function (p) { return _extractToken(typeOrFunc, p, params); });
}
function _extractToken(typeOrFunc, metadata, params) {
    var token = null;
    var optional = false;
    if (!Array.isArray(metadata)) {
        if (metadata instanceof metadata_1.Inject) {
            return _createDependency(metadata.token, optional, null);
        }
        else {
            return _createDependency(metadata, optional, null);
        }
    }
    var visibility = null;
    for (var i = 0; i < metadata.length; ++i) {
        var paramMetadata = metadata[i];
        if (paramMetadata instanceof type_1.Type) {
            token = paramMetadata;
        }
        else if (paramMetadata instanceof metadata_1.Inject) {
            token = paramMetadata.token;
        }
        else if (paramMetadata instanceof metadata_1.Optional) {
            optional = true;
        }
        else if (paramMetadata instanceof metadata_1.Self || paramMetadata instanceof metadata_1.SkipSelf) {
            visibility = paramMetadata;
        }
        else if (paramMetadata instanceof injection_token_1.InjectionToken) {
            token = paramMetadata;
        }
    }
    token = forward_ref_1.resolveForwardRef(token);
    if (token != null) {
        return _createDependency(token, optional, visibility);
    }
    else {
        throw reflective_errors_1.noAnnotationError(typeOrFunc, params);
    }
}
function _createDependency(token, optional, visibility) {
    return new ReflectiveDependency(reflective_key_1.ReflectiveKey.get(token), optional, visibility);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL3JlZmxlY3RpdmVfcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1REFBbUQ7QUFDbkQsZ0NBQTZCO0FBRTdCLDZDQUFnRDtBQUNoRCxxREFBaUQ7QUFDakQsdUNBQTREO0FBRTVELHlEQUEySDtBQUMzSCxtREFBK0M7QUFNL0M7OztHQUdHO0FBQ0g7SUFDRSw4QkFDVyxHQUFrQixFQUFTLFFBQWlCLEVBQVMsVUFBOEI7UUFBbkYsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVM7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFvQjtJQUFHLENBQUM7SUFFM0YsNEJBQU8sR0FBZCxVQUFlLEdBQWtCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFQWSxvREFBb0I7QUFTakMsSUFBTSxXQUFXLEdBQVUsRUFBRSxDQUFDO0FBcUM5QjtJQUNFLHFDQUNXLEdBQWtCLEVBQVMsaUJBQThDLEVBQ3pFLGFBQXNCO1FBRHRCLFFBQUcsR0FBSCxHQUFHLENBQWU7UUFBUyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQTZCO1FBQ3pFLGtCQUFhLEdBQWIsYUFBYSxDQUFTO0lBQUcsQ0FBQztJQUVyQyxzQkFBSSx3REFBZTthQUFuQixjQUFtRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDeEYsa0NBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLGtFQUEyQjtBQVF4Qzs7OztHQUlHO0FBQ0g7SUFDRTtRQUNJ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