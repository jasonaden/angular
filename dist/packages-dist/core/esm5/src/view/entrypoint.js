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
import { Injector } from '../di/injector';
import { NgModuleFactory } from '../linker/ng_module_factory';
import { initServicesIfNeeded } from './services';
import { Services } from './types';
import { resolveDefinition } from './util';
/**
 * @param {?} override
 * @return {?}
 */
export function overrideProvider(override) {
    initServicesIfNeeded();
    return Services.overrideProvider(override);
}
/**
 * @return {?}
 */
export function clearProviderOverrides() {
    initServicesIfNeeded();
    return Services.clearProviderOverrides();
}
/**
 * @param {?} ngModuleType
 * @param {?} bootstrapComponents
 * @param {?} defFactory
 * @return {?}
 */
export function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
    return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
}
var NgModuleFactory_ = (function (_super) {
    tslib_1.__extends(NgModuleFactory_, _super);
    /**
     * @param {?} moduleType
     * @param {?} _bootstrapComponents
     * @param {?} _ngModuleDefFactory
     */
    function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
        var _this = 
        // Attention: this ctor is called as top level function.
        // Putting any logic in here will destroy closure tree shaking!
        _super.call(this) || this;
        _this.moduleType = moduleType;
        _this._bootstrapComponents = _bootstrapComponents;
        _this._ngModuleDefFactory = _ngModuleDefFactory;
        return _this;
    }
    /**
     * @param {?} parentInjector
     * @return {?}
     */
    NgModuleFactory_.prototype.create = function (parentInjector) {
        initServicesIfNeeded();
        var /** @type {?} */ def = resolveDefinition(this._ngModuleDefFactory);
        return Services.createNgModuleRef(this.moduleType, parentInjector || Injector.NULL, this._bootstrapComponents, def);
    };
    return NgModuleFactory_;
}(NgModuleFactory));
function NgModuleFactory__tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleFactory_.prototype.moduleType;
    /** @type {?} */
    NgModuleFactory_.prototype._bootstrapComponents;
    /** @type {?} */
    NgModuleFactory_.prototype._ngModuleDefFactory;
}
//# sourceMappingURL=entrypoint.js.map