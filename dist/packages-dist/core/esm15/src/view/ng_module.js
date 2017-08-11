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
import { Injector } from '../di/injector';
import { NgModuleRef } from '../linker/ng_module_factory';
import { splitDepsDsl, tokenKey } from './util';
const /** @type {?} */ NOT_CREATED = new Object();
const /** @type {?} */ InjectorRefTokenKey = tokenKey(Injector);
const /** @type {?} */ NgModuleRefTokenKey = tokenKey(NgModuleRef);
/**
 * @param {?} flags
 * @param {?} token
 * @param {?} value
 * @param {?} deps
 * @return {?}
 */
export function moduleProvideDef(flags, token, value, deps) {
    const /** @type {?} */ depDefs = splitDepsDsl(deps);
    return {
        // will bet set by the module definition
        index: -1,
        deps: depDefs, flags, token, value
    };
}
/**
 * @param {?} providers
 * @return {?}
 */
export function moduleDef(providers) {
    const /** @type {?} */ providersByKey = {};
    for (let /** @type {?} */ i = 0; i < providers.length; i++) {
        const /** @type {?} */ provider = providers[i];
        provider.index = i;
        providersByKey[tokenKey(provider.token)] = provider;
    }
    return {
        // Will be filled later...
        factory: null,
        providersByKey,
        providers
    };
}
/**
 * @param {?} data
 * @return {?}
 */
export function initNgModule(data) {
    const /** @type {?} */ def = data._def;
    const /** @type {?} */ providers = data._providers = new Array(def.providers.length);
    for (let /** @type {?} */ i = 0; i < def.providers.length; i++) {
        const /** @type {?} */ provDef = def.providers[i];
        providers[i] = provDef.flags & 4096 /* LazyProvider */ ? NOT_CREATED :
            _createProviderInstance(data, provDef);
    }
}
/**
 * @param {?} data
 * @param {?} depDef
 * @param {?=} notFoundValue
 * @return {?}
 */
export function resolveNgModuleDep(data, depDef, notFoundValue = Injector.THROW_IF_NOT_FOUND) {
    if (depDef.flags & 8 /* Value */) {
        return depDef.token;
    }
    if (depDef.flags & 2 /* Optional */) {
        notFoundValue = null;
    }
    if (depDef.flags & 1 /* SkipSelf */) {
        return data._parent.get(depDef.token, notFoundValue);
    }
    const /** @type {?} */ tokenKey = depDef.tokenKey;
    switch (tokenKey) {
        case InjectorRefTokenKey:
        case NgModuleRefTokenKey:
            return data;
    }
    const /** @type {?} */ providerDef = data._def.providersByKey[tokenKey];
    if (providerDef) {
        let /** @type {?} */ providerInstance = data._providers[providerDef.index];
        if (providerInstance === NOT_CREATED) {
            providerInstance = data._providers[providerDef.index] =
                _createProviderInstance(data, providerDef);
        }
        return providerInstance;
    }
    return data._parent.get(depDef.token, notFoundValue);
}
/**
 * @param {?} ngModule
 * @param {?} providerDef
 * @return {?}
 */
function _createProviderInstance(ngModule, providerDef) {
    let /** @type {?} */ injectable;
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
/**
 * @param {?} ngModule
 * @param {?} ctor
 * @param {?} deps
 * @return {?}
 */
function _createClass(ngModule, ctor, deps) {
    const /** @type {?} */ len = deps.length;
    let /** @type {?} */ injectable;
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
            const /** @type {?} */ depValues = new Array(len);
            for (let /** @type {?} */ i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            injectable = new ctor(...depValues);
    }
    return injectable;
}
/**
 * @param {?} ngModule
 * @param {?} factory
 * @param {?} deps
 * @return {?}
 */
function _callFactory(ngModule, factory, deps) {
    const /** @type {?} */ len = deps.length;
    let /** @type {?} */ injectable;
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
            const /** @type {?} */ depValues = Array(len);
            for (let /** @type {?} */ i = 0; i < len; i++) {
                depValues[i] = resolveNgModuleDep(ngModule, deps[i]);
            }
            injectable = factory(...depValues);
    }
    return injectable;
}
/**
 * @param {?} ngModule
 * @param {?} lifecycles
 * @return {?}
 */
export function callNgModuleLifecycle(ngModule, lifecycles) {
    const /** @type {?} */ def = ngModule._def;
    for (let /** @type {?} */ i = 0; i < def.providers.length; i++) {
        const /** @type {?} */ provDef = def.providers[i];
        if (provDef.flags & 131072 /* OnDestroy */) {
            const /** @type {?} */ instance = ngModule._providers[i];
            if (instance && instance !== NOT_CREATED) {
                instance.ngOnDestroy();
            }
        }
    }
}
//# sourceMappingURL=ng_module.js.map