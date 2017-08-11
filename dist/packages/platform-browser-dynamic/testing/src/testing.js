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
import { platformCoreDynamicTesting } from '@angular/compiler/testing';
import { NgModule, createPlatformFactory } from '@angular/core';
import { TestComponentRenderer } from '@angular/core/testing';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS as INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { DOMTestComponentRenderer } from './dom_test_component_renderer';
export { ɵDOMTestComponentRenderer } from './private_export_testing';
/**
 * \@stable
 */
export const /** @type {?} */ platformBrowserDynamicTesting = createPlatformFactory(platformCoreDynamicTesting, 'browserDynamicTesting', INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * \@stable
 */
export class BrowserDynamicTestingModule {
}
BrowserDynamicTestingModule.decorators = [
    { type: NgModule, args: [{
                exports: [BrowserTestingModule],
                providers: [
                    { provide: TestComponentRenderer, useClass: DOMTestComponentRenderer },
                ]
            },] },
];
/** @nocollapse */
BrowserDynamicTestingModule.ctorParameters = () => [];
function BrowserDynamicTestingModule_tsickle_Closure_declarations() {
    /** @type {?} */
    BrowserDynamicTestingModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BrowserDynamicTestingModule.ctorParameters;
}
//# sourceMappingURL=testing.js.map