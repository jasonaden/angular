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
import { InjectionToken, NgModuleFactory } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { LoadedRouterConfig } from './config';
import { flatten, wrapIntoObservable } from './utils/collection';
/**
 * \@docsNotRequired
 * \@experimental
 */
export const /** @type {?} */ ROUTES = new InjectionToken('ROUTES');
export class RouterConfigLoader {
    /**
     * @param {?} loader
     * @param {?} compiler
     * @param {?=} onLoadStartListener
     * @param {?=} onLoadEndListener
     */
    constructor(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    /**
     * @param {?} parentInjector
     * @param {?} route
     * @return {?}
     */
    load(parentInjector, route) {
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        const /** @type {?} */ moduleFactory$ = this.loadModuleFactory(/** @type {?} */ ((route.loadChildren)));
        return map.call(moduleFactory$, (factory) => {
            if (this.onLoadEndListener) {
                this.onLoadEndListener(route);
            }
            const /** @type {?} */ module = factory.create(parentInjector);
            return new LoadedRouterConfig(flatten(module.injector.get(ROUTES)), module);
        });
    }
    /**
     * @param {?} loadChildren
     * @return {?}
     */
    loadModuleFactory(loadChildren) {
        if (typeof loadChildren === 'string') {
            return fromPromise(this.loader.load(loadChildren));
        }
        else {
            return mergeMap.call(wrapIntoObservable(loadChildren()), (t) => {
                if (t instanceof NgModuleFactory) {
                    return of(t);
                }
                else {
                    return fromPromise(this.compiler.compileModuleAsync(t));
                }
            });
        }
    }
}
function RouterConfigLoader_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterConfigLoader.prototype.loader;
    /** @type {?} */
    RouterConfigLoader.prototype.compiler;
    /** @type {?} */
    RouterConfigLoader.prototype.onLoadStartListener;
    /** @type {?} */
    RouterConfigLoader.prototype.onLoadEndListener;
}
//# sourceMappingURL=router_config_loader.js.map