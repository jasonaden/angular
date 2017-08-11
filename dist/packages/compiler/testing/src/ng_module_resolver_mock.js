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
import { CompileReflector, NgModuleResolver } from '@angular/compiler';
import { Compiler, Injectable, Injector } from '@angular/core';
export class MockNgModuleResolver extends NgModuleResolver {
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
    constructor(_injector, reflector) {
        super(reflector);
        this._injector = _injector;
        this._ngModules = new Map();
    }
    /**
     * Overrides the {\@link NgModule} for a module.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    setNgModule(type, metadata) {
        this._ngModules.set(type, metadata);
        this._clearCacheFor(type);
    }
    /**
     * Returns the {\@link NgModule} for a module:
     * - Set the {\@link NgModule} to the overridden view when it exists or fallback to the
     * default
     * `NgModuleResolver`, see `setNgModule`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        return this._ngModules.get(type) || ((super.resolve(type, throwIfNotFound)));
    }
    /**
     * @return {?}
     */
    get _compiler() { return this._injector.get(Compiler); }
    /**
     * @param {?} component
     * @return {?}
     */
    _clearCacheFor(component) { this._compiler.clearCacheFor(component); }
}
MockNgModuleResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockNgModuleResolver.ctorParameters = () => [
    { type: Injector, },
    { type: CompileReflector, },
];
function MockNgModuleResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    MockNgModuleResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    MockNgModuleResolver.ctorParameters;
    /** @type {?} */
    MockNgModuleResolver.prototype._ngModules;
    /** @type {?} */
    MockNgModuleResolver.prototype._injector;
}
//# sourceMappingURL=ng_module_resolver_mock.js.map