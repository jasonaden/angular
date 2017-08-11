"use strict";
/**
*@license
*Copyright Google Inc. All Rights Reserved.
*
*Use of this source code is governed by an MIT-style license that can be
*found in the LICENSE file at https://angular.io/license
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var from_1 = require("rxjs/observable/from");
var of_1 = require("rxjs/observable/of");
var catch_1 = require("rxjs/operator/catch");
var concatMap_1 = require("rxjs/operator/concatMap");
var filter_1 = require("rxjs/operator/filter");
var mergeAll_1 = require("rxjs/operator/mergeAll");
var mergeMap_1 = require("rxjs/operator/mergeMap");
var events_1 = require("./events");
var router_1 = require("./router");
var router_config_loader_1 = require("./router_config_loader");
/**
 * @whatItDoes Provides a preloading strategy.
 *
 * @experimental
 */
var PreloadingStrategy = (function () {
    function PreloadingStrategy() {
    }
    return PreloadingStrategy;
}());
exports.PreloadingStrategy = PreloadingStrategy;
/**
 * @whatItDoes Provides a preloading strategy that preloads all modules as quickly as possible.
 *
 * @howToUse
 *
 * ```
 * RouteModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
 * ```
 *
 * @experimental
 */
var PreloadAllModules = (function () {
    function PreloadAllModules() {
    }
    PreloadAllModules.prototype.preload = function (route, fn) {
        return catch_1._catch.call(fn(), function () { return of_1.of(null); });
    };
    return PreloadAllModules;
}());
exports.PreloadAllModules = PreloadAllModules;
/**
 * @whatItDoes Provides a preloading strategy that does not preload any modules.
 *
 * @description
 *
 * This strategy is enabled by default.
 *
 * @experimental
 */
var NoPreloading = (function () {
    function NoPreloading() {
    }
    NoPreloading.prototype.preload = function (route, fn) { return of_1.of(null); };
    return NoPreloading;
}());
exports.NoPreloading = NoPreloading;
/**
 * The preloader optimistically loads all router configurations to
 * make navigations into lazily-loaded sections of the application faster.
 *
 * The preloader runs in the background. When the router bootstraps, the preloader
 * starts listening to all navigation events. After every such event, the preloader
 * will check if any configurations can be loaded lazily.
 *
 * If a route is protected by `canLoad` guards, the preloaded will not load it.
 *
 * @stable
 */
var RouterPreloader = (function () {
    function RouterPreloader(router, moduleLoader, compiler, injector, preloadingStrategy) {
        this.router = router;
        this.injector = injector;
        this.preloadingStrategy = preloadingStrategy;
        var onStartLoad = function (r) { return router.triggerEvent(new events_1.RouteConfigLoadStart(r)); };
        var onEndLoad = function (r) { return router.triggerEvent(new events_1.RouteConfigLoadEnd(r)); };
        this.loader = new router_config_loader_1.RouterConfigLoader(moduleLoader, compiler, onStartLoad, onEndLoad);
    }
    ;
    RouterPreloader.prototype.setUpPreloading = function () {
        var _this = this;
        var navigations$ = filter_1.filter.call(this.router.events, function (e) { return e instanceof events_1.NavigationEnd; });
        this.subscription = concatMap_1.concatMap.call(navigations$, function () { return _this.preload(); }).subscribe(function () { });
    };
    RouterPreloader.prototype.preload = function () {
        var ngModule = this.injector.get(core_1.NgModuleRef);
        return this.processRoutes(ngModule, this.router.config);
    };
    // TODO(jasonaden): This class relies on code external to the class to call setUpPreloading. If
    // this hasn't been done, ngOnDestroy will fail as this.subscription will be undefined. This
    // should be refactored.
    RouterPreloader.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterPreloader.prototype.processRoutes = function (ngModule, routes) {
        var res = [];
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            // we already have the config loaded, just recurse
            if (route.loadChildren && !route.canLoad && route._loadedConfig) {
                var childConfig = route._loadedConfig;
                res.push(this.processRoutes(childConfig.module, childConfig.routes));
                // no config loaded, fetch the config
            }
            else if (route.loadChildren && !route.canLoad) {
                res.push(this.preloadConfig(ngModule, route));
                // recurse into children
            }
            else if (route.children) {
                res.push(this.processRoutes(ngModule, route.children));
            }
        }
        return mergeAll_1.mergeAll.call(from_1.from(res));
    };
    RouterPreloader.prototype.preloadConfig = function (ngModule, route) {
        var _this = this;
        return this.preloadingStrategy.preload(route, function () {
            var loaded$ = _this.loader.load(ngModule.injector, route);
            return mergeMap_1.mergeMap.call(loaded$, function (config) {
                route._loadedConfig = config;
                return _this.processRoutes(config.module, config.routes);
            });
        });
    };
    return RouterPreloader;
}());
RouterPreloader = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router, core_1.NgModuleFactoryLoader, core_1.Compiler,
        core_1.Injector, PreloadingStrategy])
], RouterPreloader);
exports.RouterPreloader = RouterPreloader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3ByZWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvcm91dGVyX3ByZWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztFQU1FOzs7Ozs7Ozs7OztBQUVGLHNDQUE0RztBQUc1Ryw2Q0FBMEM7QUFDMUMseUNBQXVDO0FBQ3ZDLDZDQUEyQztBQUMzQyxxREFBa0Q7QUFDbEQsK0NBQTRDO0FBQzVDLG1EQUFnRDtBQUNoRCxtREFBZ0Q7QUFFaEQsbUNBQXdGO0FBQ3hGLG1DQUFnQztBQUNoQywrREFBMEQ7QUFFMUQ7Ozs7R0FJRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZxQixnREFBa0I7QUFJeEM7Ozs7Ozs7Ozs7R0FVRztBQUNIO0lBQUE7SUFJQSxDQUFDO0lBSEMsbUNBQU8sR0FBUCxVQUFRLEtBQVksRUFBRSxFQUF5QjtRQUM3QyxNQUFNLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFNLE9BQUEsT0FBRSxDQUFFLElBQUksQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksOENBQWlCO0FBTTlCOzs7Ozs7OztHQVFHO0FBQ0g7SUFBQTtJQUVBLENBQUM7SUFEQyw4QkFBTyxHQUFQLFVBQVEsS0FBWSxFQUFFLEVBQXlCLElBQXFCLE1BQU0sQ0FBQyxPQUFFLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLG1CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxvQ0FBWTtBQUl6Qjs7Ozs7Ozs7Ozs7R0FXRztBQUVILElBQWEsZUFBZTtJQUkxQix5QkFDWSxNQUFjLEVBQUUsWUFBbUMsRUFBRSxRQUFrQixFQUN2RSxRQUFrQixFQUFVLGtCQUFzQztRQURs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