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
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BROWSER_ANIMATIONS_PROVIDERS, BROWSER_NOOP_ANIMATIONS_PROVIDERS } from './providers';
/**
 * \@experimental Animation support is experimental.
 */
export class BrowserAnimationsModule {
}
BrowserAnimationsModule.decorators = [
    { type: NgModule, args: [{
                exports: [BrowserModule],
                providers: BROWSER_ANIMATIONS_PROVIDERS,
            },] },
];
/** @nocollapse */
BrowserAnimationsModule.ctorParameters = () => [];
function BrowserAnimationsModule_tsickle_Closure_declarations() {
    /** @type {?} */
    BrowserAnimationsModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BrowserAnimationsModule.ctorParameters;
}
/**
 * \@experimental Animation support is experimental.
 */
export class NoopAnimationsModule {
}
NoopAnimationsModule.decorators = [
    { type: NgModule, args: [{
                exports: [BrowserModule],
                providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
            },] },
];
/** @nocollapse */
NoopAnimationsModule.ctorParameters = () => [];
function NoopAnimationsModule_tsickle_Closure_declarations() {
    /** @type {?} */
    NoopAnimationsModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NoopAnimationsModule.ctorParameters;
}
//# sourceMappingURL=module.js.map