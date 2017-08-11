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
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpTestingController } from './api';
import { HttpClientTestingBackend } from './backend';
/**
 * Configures `HttpClientTestingBackend` as the `HttpBackend` used by `HttpClient`.
 *
 * Inject `HttpTestingController` to expect and flush requests in your tests.
 *
 * \@experimental
 */
var HttpClientTestingModule = (function () {
    function HttpClientTestingModule() {
    }
    return HttpClientTestingModule;
}());
export { HttpClientTestingModule };
HttpClientTestingModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule,
                ],
                providers: [
                    HttpClientTestingBackend,
                    { provide: HttpBackend, useExisting: HttpClientTestingBackend },
                    { provide: HttpTestingController, useExisting: HttpClientTestingBackend },
                ],
            },] },
];
/** @nocollapse */
HttpClientTestingModule.ctorParameters = function () { return []; };
function HttpClientTestingModule_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpClientTestingModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HttpClientTestingModule.ctorParameters;
}
//# sourceMappingURL=module.js.map