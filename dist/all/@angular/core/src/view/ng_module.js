"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = require("../di/injector");
var ng_module_factory_1 = require("../linker/ng_module_factory");
var util_1 = require("./util");
var NOT_CREATED = new Object();
var InjectorRefTokenKey = util_1.tokenKey(injector_1.Injector);
var NgModuleRefTokenKey = util_1.tokenKey(ng_module_factory_1.NgModuleRef);
function moduleProvideDef(flags, token, value, deps) {
    var depDefs = util_1.splitDepsDsl(deps);
    return {
        // will bet set by the module definition
        index: -1,
        deps: depDefs, flags: flags, token: token, value: value
    };
}
exports.moduleProvideDef = moduleProvideDef;
function moduleDef(providers) {
    var providersByKey = {};
    for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        provider.index = i;
        providersByKey[util_1.tokenKey(provider.token)] = provider;
    }
    return {
        // Will be filled later...
        factory: null,
        providersByKey: providersByKey,
        providers: providers
    };
}
exports.moduleDef = moduleDef;
function initNgModule(data) {
    var def = data._def;
    var providers = data._providers = new Array(def.providers.length);
    for (var i = 0; i < def.providers.length; i++) {
        var provDef = def.providers[i];
        providers[i] = provDef.flags & 4096 /* LazyProvider */ ? NOT_CREATED :
            _createProviderInstance(data, provDef);
    }
}
exports.initNgModule = initNgModule;
function resolveNgModuleDep(data, depDef, notFoundValue) {
    if (notFoundValue === void 0) { notFoundValue = injector_1.Injector.THROW_IF_NOT_FOUND; }
    if (depDef.flags & 8 /* Value */) {
        return depDef.token;
    }
    if (depDef.flags & 2 /* Optional */) {
        notFoundValue = null;
    }
    if (depDef.flags & 1 /* SkipSelf */) {
        return data._parent.get(depDef.token, notFoundValue);
    }
    var tokenKey = depDef.tokenKey;
    switch (tokenKey) {
        case InjectorRefTokenKey:
        case NgModuleRefTokenKey:
            return data;
    }
    var providerDef = data._def.providersByKey[tokenKey];
    if (providerDef) {
        var providerInstance = data._providers[providerDef.index];
        if (providerInstance === NOT_CREATED) {
            providerInstance = data._providers[providerDef.index] =
                _createProviderInstance(data, providerDef);
        }
        return providerInstance;
    }
    return data._parent.get(depDef.token, notFoundValue);
}
exports.resolveNgModuleDep = resolveNgModuleDep;
function _createProviderInstance(ngModule, providerDef) {
    var injectable;
    switch (providerDef.flags & 201347067 /* Types */) {
        case 512 /* TypeClassProvider */:
            injectable = _createClass(ngModule, providerDef.value, providerDef.deps);
            break;
        case 1024 /* TypeFactoryProvider */:
            injectable = _callFactory(ngModule, providerDef.value, providerDef.deps);
            break;
        case 2048 /* TypeUseExistingProvider */:
            injectable = resolveNgModuleDep(ngModule, providerDef.deps[0]);
            break;
        case 256 /* TypeValueProvider */:
            injectable = providerDef.value;
            break;
    }
    return injectable;
}
function _createClass(ngModule, ctor, deps) {
    var len = deps.length;
    var injectable;
    switch (len) {
        case 0:
            injectable = new ctor();
            break;
        case 1:
            injectable = new ctor(resolveNgModuleDep(ngModule, deps[0]));
            break;
        case 2:
            injectable =
                new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
            break;
        case 3:
            injectable = new ctor(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
            break;
        default:
            var depValues = new Array(len);
            for (var i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            injectable = new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
    }
    return injectable;
}
function _callFactory(ngModule, factory, deps) {
    var len = deps.length;
    var injectable;
    switch (len) {
        case 0:
            injectable = factory();
            break;
        case 1:
            injectable = factory(resolveNgModuleDep(ngModule, deps[0]));
            break;
        case 2:
            injectable =
                factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]));
            break;
        case 3:
            injectable = factory(resolveNgModuleDep(ngModule, deps[0]), resolveNgModuleDep(ngModule, deps[1]), resolveNgModuleDep(ngModule, deps[2]));
            break;
        default:
            var depValues = Array(len);
            for (var i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            injectable = factory.apply(void 0, depValues);
    }
    return injectable;
}
function callNgModuleLifecycle(ngModule, lifecycles) {
    var def = ngModule._def;
    for (var i = 0; i < def.providers.length; i++) {
        var provDef = def.providers[i];
        if (provDef.flags & 131072 /* OnDestroy */) {
            var instance = ngModule._providers[i];
            if (instance && instance !== NOT_CREATED) {
                instance.ngOnDestroy();
            }
        }
    }
}
exports.callNgModuleLifecycle = callNgModuleLifecycle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdmlldy9uZ19tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyQ0FBNEQ7QUFDNUQsaUVBQXdEO0FBR3hELCtCQUE4QztBQUU5QyxJQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBRWpDLElBQU0sbUJBQW1CLEdBQUcsZUFBUSxDQUFDLG1CQUFRLENBQUMsQ0FBQztBQUMvQyxJQUFNLG1CQUFtQixHQUFHLGVBQVEsQ0FBQywrQkFBVyxDQUFDLENBQUM7QUFFbEQsMEJBQ0ksS0FBZ0IsRUFBRSxLQUFVLEVBQUUsS0FBVSxFQUN4QyxJQUErQjtJQUNqQyxJQUFNLE9BQU8sR0FBRyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLE1BQU0sQ0FBQztRQUNMLHdDQUF3QztRQUN4QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLE9BQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxLQUFLLE9BQUE7S0FDbkMsQ0FBQztBQUNKLENBQUM7QUFURCw0Q0FTQztBQUVELG1CQUEwQixTQUFnQztJQUN4RCxJQUFNLGNBQWMsR0FBeUMsRUFBRSxDQUFDO0lBQ2hFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzFDLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNuQixjQUFjLENBQUMsZUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsTUFBTSxD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