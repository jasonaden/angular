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
import { isPromise } from '../src/util/lang';
import { Inject, Injectable, InjectionToken, Optional } from './di';
/**
 * A function that will be executed when an application is initialized.
 * \@experimental
 */
export const /** @type {?} */ APP_INITIALIZER = new InjectionToken('Application Initializer');
/**
 * A class that reflects the state of running {\@link APP_INITIALIZER}s.
 *
 * \@experimental
 */
export class ApplicationInitStatus {
    /**
     * @param {?} appInits
     */
    constructor(appInits) {
        this.appInits = appInits;
        this.initialized = false;
        this._done = false;
        this._donePromise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
    /**
     * \@internal
     * @return {?}
     */
    runInitializers() {
        if (this.initialized) {
            return;
        }
        const /** @type {?} */ asyncInitPromises = [];
        const /** @type {?} */ complete = () => {
            this._done = true;
            this.resolve();
        };
        if (this.appInits) {
            for (let /** @type {?} */ i = 0; i < this.appInits.length; i++) {
                const /** @type {?} */ initResult = this.appInits[i]();
                if (isPromise(initResult)) {
                    asyncInitPromises.push(initResult);
                }
            }
        }
        Promise.all(asyncInitPromises).then(() => { complete(); }).catch(e => { this.reject(e); });
        if (asyncInitPromises.length === 0) {
            complete();
        }
        this.initialized = true;
    }
    /**
     * @return {?}
     */
    get done() { return this._done; }
    /**
     * @return {?}
     */
    get donePromise() { return this._donePromise; }
}
ApplicationInitStatus.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationInitStatus.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [APP_INITIALIZER,] }, { type: Optional },] },
];
function ApplicationInitStatus_tsickle_Closure_declarations() {
    /** @type {?} */
    ApplicationInitStatus.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ApplicationInitStatus.ctorParameters;
    /** @type {?} */
    ApplicationInitStatus.prototype.resolve;
    /** @type {?} */
    ApplicationInitStatus.prototype.reject;
    /** @type {?} */
    ApplicationInitStatus.prototype.initialized;
    /** @type {?} */
    ApplicationInitStatus.prototype._donePromise;
    /** @type {?} */
    ApplicationInitStatus.prototype._done;
    /** @type {?} */
    ApplicationInitStatus.prototype.appInits;
}
//# sourceMappingURL=application_init.js.map