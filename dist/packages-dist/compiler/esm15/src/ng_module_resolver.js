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
import { NgModule, ɵstringify as stringify } from '@angular/core';
import { CompileReflector } from './compile_reflector';
import { findLast } from './directive_resolver';
import { CompilerInjectable } from './injectable';
/**
 * @param {?} obj
 * @return {?}
 */
function _isNgModuleMetadata(obj) {
    return obj instanceof NgModule;
}
/**
 * Resolves types to {\@link NgModule}.
 */
export class NgModuleResolver {
    /**
     * @param {?} _reflector
     */
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isNgModule(type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); }
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        const /** @type {?} */ ngModuleMeta = findLast(this._reflector.annotations(type), _isNgModuleMetadata);
        if (ngModuleMeta) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error(`No NgModule metadata found for '${stringify(type)}'.`);
            }
            return null;
        }
    }
}
NgModuleResolver.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
NgModuleResolver.ctorParameters = () => [
    { type: CompileReflector, },
];
function NgModuleResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgModuleResolver.ctorParameters;
    /** @type {?} */
    NgModuleResolver.prototype._reflector;
}
//# sourceMappingURL=ng_module_resolver.js.map