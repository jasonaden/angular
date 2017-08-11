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
import { APP_ID, NgModule, NgZone, PLATFORM_INITIALIZER, createPlatformFactory, platformCore } from '@angular/core';
import { BrowserModule, ɵBrowserDomAdapter as BrowserDomAdapter, ɵELEMENT_PROBE_PROVIDERS as ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';
import { BrowserDetection, createNgZone } from './browser_util';
/**
 * @return {?}
 */
function initBrowserTests() {
    BrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
}
const /** @type {?} */ _TEST_BROWSER_PLATFORM_PROVIDERS = [{ provide: PLATFORM_INITIALIZER, useValue: initBrowserTests, multi: true }];
/**
 * Platform for testing
 *
 * \@stable
 */
export const /** @type {?} */ platformBrowserTesting = createPlatformFactory(platformCore, 'browserTesting', _TEST_BROWSER_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * \@stable
 */
export class BrowserTestingModule {
}
BrowserTestingModule.decorators = [
    { type: NgModule, args: [{
                exports: [BrowserModule],
                providers: [
                    { provide: APP_ID, useValue: 'a' },
                    ELEMENT_PROBE_PROVIDERS,
                    { provide: NgZone, useFactory: createNgZone },
                ]
            },] },
];
/** @nocollapse */
BrowserTestingModule.ctorParameters = () => [];
function BrowserTestingModule_tsickle_Closure_declarations() {
    /** @type {?} */
    BrowserTestingModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BrowserTestingModule.ctorParameters;
}
//# sourceMappingURL=browser.js.map