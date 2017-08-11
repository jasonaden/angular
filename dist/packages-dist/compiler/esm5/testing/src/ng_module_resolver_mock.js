/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileReflector, NgModuleResolver } from '@angular/compiler';
import { Compiler, Injectable, Injector } from '@angular/core';
var MockNgModuleResolver = (function (_super) {
    tslib_1.__extends(MockNgModuleResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
    function MockNgModuleResolver(_injector, reflector) {
        var _this = _super.call(this, reflector) || this;
        _this._injector = _injector;
        _this._ngModules = new Map();
        return _this;
    }
    /**
     * Overrides the {\@link NgModule} for a module.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockNgModuleResolver.prototype.setNgModule = function (type, metadata) {
        this._ngModules.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {\@link NgModule} for a module:
     * - Set the {\@link NgModule} to the overridden view when it exists or fallback to the
     * default
     * `NgModuleResolver`, see `setNgModule`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockNgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        return this._ngModules.get(type) || ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
    };
    Object.defineProperty(MockNgModuleResolver.prototype, "_compiler", {
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} component
     * @return {?}
     */
    MockNgModuleResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    return MockNgModuleResolver;
}(NgModuleResolver));
export { MockNgModuleResolver };
MockNgModuleResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockNgModuleResolver.ctorParameters = function () { return [
    { type: Injector, },
    { type: CompileReflector, },
]; };
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