"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var Subject_1 = require("rxjs/Subject");
var of_1 = require("rxjs/observable/of");
var router_link_1 = require("./directives/router_link");
var router_link_active_1 = require("./directives/router_link_active");
var router_outlet_1 = require("./directives/router_outlet");
var route_reuse_strategy_1 = require("./route_reuse_strategy");
var router_1 = require("./router");
var router_config_loader_1 = require("./router_config_loader");
var router_outlet_context_1 = require("./router_outlet_context");
var router_preloader_1 = require("./router_preloader");
var router_state_1 = require("./router_state");
var url_handling_strategy_1 = require("./url_handling_strategy");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
/**
 * @whatItDoes Contains a list of directives
 * @stable
 */
var ROUTER_DIRECTIVES = [router_outlet_1.RouterOutlet, router_link_1.RouterLink, router_link_1.RouterLinkWithHref, router_link_active_1.RouterLinkActive];
/**
 * @whatItDoes Is used in DI to configure the router.
 * @stable
 */
exports.ROUTER_CONFIGURATION = new core_1.InjectionToken('ROUTER_CONFIGURATION');
/**
 * @docsNotRequired
 */
exports.ROUTER_FORROOT_GUARD = new core_1.InjectionToken('ROUTER_FORROOT_GUARD');
exports.ROUTER_PROVIDERS = [
    common_1.Location,
    { provide: url_tree_1.UrlSerializer, useClass: url_tree_1.DefaultUrlSerializer },
    {
        provide: router_1.Router,
        useFactory: setupRouter,
        deps: [
            core_1.ApplicationRef, url_tree_1.UrlSerializer, router_outlet_context_1.ChildrenOutletContexts, common_1.Location, core_1.Injector,
            core_1.NgModuleFactoryLoader, core_1.Compiler, router_config_loader_1.ROUTES, exports.ROUTER_CONFIGURATION,
            [url_handling_strategy_1.UrlHandlingStrategy, new core_1.Optional()], [route_reuse_strategy_1.RouteReuseStrategy, new core_1.Optional()]
        ]
    },
    router_outlet_context_1.ChildrenOutletContexts,
    { provide: router_state_1.ActivatedRoute, useFactory: rootRoute, deps: [router_1.Router] },
    { provide: core_1.NgModuleFactoryLoader, useClass: core_1.SystemJsNgModuleLoader },
    router_preloader_1.RouterPreloader,
    router_preloader_1.NoPreloading,
    router_preloader_1.PreloadAllModules,
    { provide: exports.ROUTER_CONFIGURATION, useValue: { enableTracing: false } },
];
function routerNgProbeToken() {
    return new core_1.NgProbeToken('Router', router_1.Router);
}
exports.routerNgProbeToken = routerNgProbeToken;
/**
 * @whatItDoes Adds router directives and providers.
 *
 * @howToUse
 *
 * RouterModule can be imported multiple times: once per lazily-loaded bundle.
 * Since the router deals with a global shared resource--location, we cannot have
 * more than one router service active.
 *
 * That is why there are two ways to create the module: `RouterModule.forRoot` and
 * `RouterModule.forChild`.
 *
 * * `forRoot` creates a module that contains all the directives, the given routes, and the router
 *   service itself.
 * * `forChild` creates a module that contains all the directives and the given routes, but does not
 *   include the router service.
 *
 * When registered at the root, the module should be used as follows
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forRoot(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * For submodules and lazy loaded submodules the module should be used as follows:
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forChild(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * @description
 *
 * Managing state transitions is one of the hardest parts of building applications. This is
 * especially true on the web, where you also need to ensure that the state is reflected in the URL.
 * In addition, we often want to split applications into multiple bundles and load them on demand.
 * Doing this transparently is not trivial.
 *
 * The Angular router solves these problems. Using the router, you can declaratively specify
 * application states, manage state transitions while taking care of the URL, and load bundles on
 * demand.
 *
 * [Read this developer guide](https://angular.io/docs/ts/latest/guide/router.html) to get an
 * overview of how the router should be used.
 *
 * @stable
 */
var RouterModule = RouterModule_1 = (function () {
    // Note: We are injecting the Router so it gets created eagerly...
    function RouterModule(guard, router) {
    }
    /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options:
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     */
    RouterModule.forRoot = function (routes, config) {
        return {
            ngModule: RouterModule_1,
            providers: [
                exports.ROUTER_PROVIDERS,
                provideRoutes(routes),
                {
                    provide: exports.ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[router_1.Router, new core_1.Optional(), new core_1.SkipSelf()]]
                },
                { provide: exports.ROUTER_CONFIGURATION, useValue: config ? config : {} },
                {
                    provide: common_1.LocationStrategy,
                    useFactory: provideLocationStrategy,
                    deps: [
                        common_1.PlatformLocation, [new core_1.Inject(common_1.APP_BASE_HREF), new core_1.Optional()], exports.ROUTER_CONFIGURATION
                    ]
                },
                {
                    provide: router_preloader_1.PreloadingStrategy,
                    useExisting: config && config.preloadingStrategy ? config.preloadingStrategy :
                        router_preloader_1.NoPreloading
                },
                { provide: core_1.NgProbeToken, multi: true, useFactory: routerNgProbeToken },
                provideRouterInitializer(),
            ],
        };
    };
    /**
     * Creates a module with all the router directives and a provider registering routes.
     */
    RouterModule.forChild = function (routes) {
        return { ngModule: RouterModule_1, providers: [provideRoutes(routes)] };
    };
    return RouterModule;
}());
RouterModule = RouterModule_1 = __decorate([
    core_1.NgModule({ declarations: ROUTER_DIRECTIVES, exports: ROUTER_DIRECTIVES }),
    __param(0, core_1.Optional()), __param(0, core_1.Inject(exports.ROUTER_FORROOT_GUARD)), __param(1, core_1.Optional()),
    __metadata("design:paramtypes", [Object, router_1.Router])
], RouterModule);
exports.RouterModule = RouterModule;
function provideLocationStrategy(platformLocationStrategy, baseHref, options) {
    if (options === void 0) { options = {}; }
    return options.useHash ? new common_1.HashLocationStrategy(platformLocationStrategy, baseHref) :
        new common_1.PathLocationStrategy(platformLocationStrategy, baseHref);
}
exports.provideLocationStrategy = provideLocationStrategy;
function provideForRootGuard(router) {
    if (router) {
        throw new Error("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
    }
    return 'guarded';
}
exports.provideForRootGuard = provideForRootGuard;
/**
 * @whatItDoes Registers routes.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forChild(ROUTES)],
 *   providers: [provideRoutes(EXTRA_ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * @stable
 */
function provideRoutes(routes) {
    return [
        { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
        { provide: router_config_loader_1.ROUTES, multi: true, useValue: routes },
    ];
}
exports.provideRoutes = provideRoutes;
function setupRouter(ref, urlSerializer, contexts, location, injector, loader, compiler, config, opts, urlHandlingStrategy, routeReuseStrategy) {
    if (opts === void 0) { opts = {}; }
    var router = new router_1.Router(null, urlSerializer, contexts, location, injector, loader, compiler, collection_1.flatten(config));
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    if (routeReuseStrategy) {
        router.routeReuseStrategy = routeReuseStrategy;
    }
    if (opts.errorHandler) {
        router.errorHandler = opts.errorHandler;
    }
    if (opts.enableTracing) {
        var dom_1 = platform_browser_1.ɵgetDOM();
        router.events.subscribe(function (e) {
            dom_1.logGroup("Router Event: " + e.constructor.name);
            dom_1.log(e.toString());
            dom_1.log(e);
            dom_1.logGroupEnd();
        });
    }
    return router;
}
exports.setupRouter = setupRouter;
function rootRoute(router) {
    return router.routerState.root;
}
exports.rootRoute = rootRoute;
/**
 * To initialize the router properly we need to do in two steps:
 *
 * We need to start the navigation in a APP_INITIALIZER to block the bootstrap if
 * a resolver or a guards executes asynchronously. Second, we need to actually run
 * activation in a BOOTSTRAP_LISTENER. We utilize the afterPreactivation
 * hook provided by the router to do that.
 *
 * The router navigation starts, reaches the point when preactivation is done, and then
 * pauses. It waits for the hook to be resolved. We then resolve it only in a bootstrap listener.
 */
var RouterInitializer = (function () {
    function RouterInitializer(injector) {
        this.injector = injector;
        this.initNavigation = false;
        this.resultOfPreactivationDone = new Subject_1.Subject();
    }
    RouterInitializer.prototype.appInitializer = function () {
        var _this = this;
        var p = this.injector.get(common_1.LOCATION_INITIALIZED, Promise.resolve(null));
        return p.then(function () {
            var resolve = null;
            var res = new Promise(function (r) { return resolve = r; });
            var router = _this.injector.get(router_1.Router);
            var opts = _this.injector.get(exports.ROUTER_CONFIGURATION);
            if (_this.isLegacyDisabled(opts) || _this.isLegacyEnabled(opts)) {
                resolve(true);
            }
            else if (opts.initialNavigation === 'disabled') {
                router.setUpLocationChangeListener();
                resolve(true);
            }
            else if (opts.initialNavigation === 'enabled') {
                router.hooks.afterPreactivation = function () {
                    // only the initial navigation should be delayed
                    if (!_this.initNavigation) {
                        _this.initNavigation = true;
                        resolve(true);
                        return _this.resultOfPreactivationDone;
                        // subsequent navigations should not be delayed
                    }
                    else {
                        return of_1.of(null);
                    }
                };
                router.initialNavigation();
            }
            else {
                throw new Error("Invalid initialNavigation options: '" + opts.initialNavigation + "'");
            }
            return res;
        });
    };
    RouterInitializer.prototype.bootstrapListener = function (bootstrappedComponentRef) {
        var opts = this.injector.get(exports.ROUTER_CONFIGURATION);
        var preloader = this.injector.get(router_preloader_1.RouterPreloader);
        var router = this.injector.get(router_1.Router);
        var ref = this.injector.get(core_1.ApplicationRef);
        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }
        if (this.isLegacyEnabled(opts)) {
            router.initialNavigation();
        }
        else if (this.isLegacyDisabled(opts)) {
            router.setUpLocationChangeListener();
        }
        preloader.setUpPreloading();
        router.resetRootComponentType(ref.componentTypes[0]);
        this.resultOfPreactivationDone.next(null);
        this.resultOfPreactivationDone.complete();
    };
    RouterInitializer.prototype.isLegacyEnabled = function (opts) {
        return opts.initialNavigation === 'legacy_enabled' || opts.initialNavigation === true ||
            opts.initialNavigation === undefined;
    };
    RouterInitializer.prototype.isLegacyDisabled = function (opts) {
        return opts.initialNavigation === 'legacy_disabled' || opts.initialNavigation === false;
    };
    return RouterInitializer;
}());
RouterInitializer = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Injector])
], RouterInitializer);
exports.RouterInitializer = RouterInitializer;
function getAppInitializer(r) {
    return r.appInitializer.bind(r);
}
exports.getAppInitializer = getAppInitializer;
function getBootstrapListener(r) {
    return r.bootstrapListener.bind(r);
}
exports.getBootstrapListener = getBootstrapListener;
/**
 * A token for the router initializer that will be called after the app is bootstrapped.
 *
 * @experimental
 */
exports.ROUTER_INITIALIZER = new core_1.InjectionToken('Router Initializer');
function provideRouterInitializer() {
    return [
        RouterInitializer,
        {
            provide: core_1.APP_INITIALIZER,
            multi: true,
            useFactory: getAppInitializer,
            deps: [RouterInitializer]
        },
        { provide: exports.ROUTER_INITIALIZER, useFactory: getBootstrapListener, deps: [RouterInitializer] },
        { provide: core_1.APP_BOOTSTRAP_LISTENER, multi: true, useExisting: exports.ROUTER_INITIALIZER },
    ];
}
exports.provideRouterInitializer = provideRouterInitializer;
var RouterModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvcm91dGVyX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILDBDQUE4SjtBQUM5SixzQ0FBb1Q7QUFDcFQsOERBQTREO0FBQzVELHdDQUFxQztBQUNyQyx5Q0FBdUM7QUFHdkMsd0RBQXdFO0FBQ3hFLHNFQUFpRTtBQUNqRSw0REFBd0Q7QUFDeEQsK0RBQTBEO0FBQzFELG1DQUE4QztBQUM5QywrREFBOEM7QUFDOUMsaUVBQStEO0FBQy9ELHVEQUF3RztBQUN4RywrQ0FBOEM7QUFDOUMsaUVBQTREO0FBQzVELHVDQUErRDtBQUMvRCxpREFBMkM7QUFHM0M7OztHQUdHO0FBQ0gsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLDRCQUFZLEVBQUUsd0JBQVUsRUFBRSxnQ0FBa0IsRUFBRSxxQ0FBZ0IsQ0FBQyxDQUFDO0FBRTNGOzs7R0FHRztBQUNVLFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxxQkFBYyxDQUFlLHNCQUFzQixDQUFDLENBQUM7QUFFN0Y7O0dBRUc7QUFDVSxRQUFBLG9CQUFvQixHQUFHLElBQUkscUJBQWMsQ0FBTyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXhFLFFBQUEsZ0JBQWdCLEdBQWU7SUFDMUMsaUJBQVE7SUFDUixFQUFDLE9BQU8sRUFBRSx3QkFBYSxFQUFFLFFBQVEsRUFBRSwrQkFBb0IsRUFBQztJQUN4RDtRQUNFLE9BQU8sRUFBRSxlQUFNO1FBQ2YsVUFBVSxFQUFFLFdBQVc7UUFDdkIsSUFBSSxFQUFFO1lBQ0oscUJBQWMsRUFBRSx3QkFBYSxFQUFFLDhDQUFzQixFQUFFLGlCQUFRLEVBQUUsZUFBUTtZQUN6RSw0QkFBcUIsRUFBRSxlQUFRLEVBQUUsNkJBQU0sRUFBRSw0QkFBb0I7WUFDN0QsQ0FBQywyQ0FBbUIsRUFBRSxJQUFJLGVBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyx5Q0FBa0IsRUFBRSxJQUFJLGVBQVEsRUFBRSxDQUFDO1NBQzVFO0tBQ0Y7SUFDRCw4Q0FBc0I7SUFDdEIsRUFBQyxPQUFPLEVBQUUsNkJBQWMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGVBQU0sQ0FBQyxFQUFDO0lBQ2hFLEVBQUMsT0FBTyxFQUFFLDRCQUFxQixFQUFFLFFBQVEsRUFBRSw2QkFBc0IsRUFBQztJQUNsRSxrQ0FBZTtJQUNmLCtCQUFZO0lBQ1osb0NBQWlCO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLDRCQUFvQixFQUFFLFFBQVEsRUFBRSxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUMsRUFBQztDQUNsRSxDQUFDO0FBRUY7SUFDRSxNQUFNLENBQUMsSUFBSSxtQkFBWSxDQUFDLFFBQVEsRUFBRSxlQUFNLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRkQsZ0RBRUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrREc7QUFFSCxJQUFhLFlBQVk7SUFDdkIsa0VBQWtFO0lBQ2xFLHNCQUFzRCxLQUFVLEVBQWMsTUFBYztJQUFHLENBQUM7SUFFaEc7Ozs7Ozs7Ozs7T0FVRztJQUNJLG9CQUFPLEdBQWQsVUFBZSxNQUFjLEVBQUUsTUFBcUI7UUFDbEQsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGNBQVk7WUFDdEIsU0FBUyxFQUFFO2dCQUNULHdCQUFnQjtnQkFDaEIsYUFBYSxDQUFDLE1BQU0sQ0FBQztnQkFDckI7b0JBQ0UsT0FBTyxFQUFFLDRCQUFvQjtvQkFDN0IsVUFBVSxFQUFFLG1CQUFtQjtvQkFDL0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFNLEVBQUUsSUFBSSxlQUFRLEVBQUUsRUFBRSxJQUFJLGVBQVEsRUFBRSxDQUFDLENBQUM7aUJBQ2pEO2dCQUNELEVBQUMsT0FBTyxFQUFFLDRCQUFvQixFQUFFLFFBQVEsRUFBRSxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBQztnQkFDL0Q7b0JBQ0UsT0FBTyxFQUFFLHlCQUFnQjtvQkFDekIsVUFBVSxFQUFFLHVCQUF1QjtvQkFDbkMsSUFBSSxFQUFFO3dCQUNKLHlCQUFnQixFQUFFLENBQUMsSUFBSSxhQUFNLENBQUMsc0JBQWEsQ0FBQyxFQUFFLElBQUksZUFBUSxFQUFFLENBQUMsRUFBRSw0QkFBb0I7cUJBQ3BGO2lCQUNGO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxxQ0FBa0I7b0JBQzNCLFdBQVcsRUFBRSxNQUFNLElBQUksTUFBTSxDQUFDLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0I7d0JBQ3pCLCtCQUFZO2lCQUNoRTtnQkFDRCxFQUFDLE9BQU8sRUFBRSxtQkFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFDO2dCQUNwRSx3QkFBd0IsRUFBRTthQUMzQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSSxxQkFBUSxHQUFmLFVBQWdCLE1BQWM7UUFDNUIsTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQVksRUFBRSxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQ3RFLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFuREQsSUFtREM7QUFuRFksWUFBWTtJQUR4QixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFDLENBQUM7SUFHekQsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsYUFBTSxDQUFDLDRCQUFvQixDQUFDLENBQUEsRUFBYyxXQUFBLGVBQVEsRUFBRSxDQUFBOzZDQUFTLGVBQU07R0FGakYsWUFBWSxDQW1EeEI7QUFuRFksb0NBQVk7QUFxRHpCLGlDQUNJLHdCQUEwQyxFQUFFLFFBQWdCLEVBQUUsT0FBMEI7SUFBMUIsd0JBQUEsRUFBQSxZQUEwQjtJQUMxRixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLDZCQUFvQixDQUFDLHdCQUF3QixFQUFFLFFBQVEsQ0FBQztRQUM1RCxJQUFJLDZCQUFvQixDQUFDLHdCQUF3QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFKRCwwREFJQztBQUVELDZCQUFvQyxNQUFjO0lBQ2hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxNQUFNLElBQUksS0FBSyxDQUNYLHNHQUFzRyxDQUFDLENBQUM7SUFDOUcsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQU5ELGtEQU1DO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCx1QkFBOEIsTUFBYztJQUMxQyxNQUFNLENBQUM7UUFDTCxFQUFDLE9BQU8sRUFBRSxtQ0FBNEIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7UUFDdEUsRUFBQyxPQUFPLEVBQUUsNkJBQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7S0FDakQsQ0FBQztBQUNKLENBQUM7QUFMRCxzQ0FLQztBQTZERCxxQkFDSSxHQUFtQixFQUFFLGFBQTRCLEVBQUUsUUFBZ0MsRUFDbkYsUUFBa0IsRUFBRSxRQUFrQixFQUFFLE1BQTZCLEVBQUUsUUFBa0IsRUFDekYsTUFBaUIsRUFBRSxJQUF1QixFQUFFLG1CQUF5QyxFQUNyRixrQkFBdUM7SUFEcEIscUJBQUEsRUFBQSxTQUF1QjtJQUU1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FDckIsSUFBSSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG9CQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUUxRixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBQ25ELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQ2pELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDMUMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQU0sS0FBRyxHQUFHLDBCQUFNLEVBQUUsQ0FBQztRQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDdkIsS0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBdUIsQ0FBQyxDQUFDLFdBQVksQ0FBQyxJQUFNLENBQUMsQ0FBQztZQUMzRCxLQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLEtBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxLQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBL0JELGtDQStCQztBQUVELG1CQUEwQixNQUFjO0lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztBQUNqQyxDQUFDO0FBRkQsOEJBRUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBRUgsSUFBYSxpQkFBaUI7SUFJNUIsMkJBQW9CLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFIOUIsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFDaEMsOEJBQXlCLEdBQUcsSUFBSSxpQkFBTyxFQUFRLENBQUM7SUFFZixDQUFDO0lBRTFDLDBDQUFjLEdBQWQ7UUFBQSxpQkFvQ0M7UUFuQ0MsSUFBTSxDQUFDLEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDZCQUFvQixFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2RixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNaLElBQUksT0FBTyxHQUFhLElBQU0sQ0FBQztZQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sR0FBRyxDQUFDLEVBQVgsQ0FBVyxDQUFDLENBQUM7WUFDMUMsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLENBQUM7WUFDekMsSUFBTSxJQUFJLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsNEJBQW9CLENBQUMsQ0FBQztZQUVyRCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoQixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztnQkFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWhCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUc7b0JBQ2hDLGdEQUFnRDtvQkFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7d0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDZCxNQUFNLENBQUMsS0FBSSxDQUFDLHlCQUF5QixDQUFDO3dCQUV0QywrQ0FBK0M7b0JBQ2pELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLE9BQUUsQ0FBRSxJQUFJLENBQVEsQ0FBQztvQkFDMUIsQ0FBQztnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFN0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXVDLElBQUksQ0FBQyxpQkFBaUIsTUFBRyxDQUFDLENBQUM7WUFDcEYsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw2Q0FBaUIsR0FBakIsVUFBa0Isd0JBQTJDO1FBQzNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDRCQUFvQixDQUFDLENBQUM7UUFDckQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0NBQWUsQ0FBQyxDQUFDO1FBQ3JELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxDQUFDO1FBQ3pDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsS0FBSyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFFRCxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRU8sMkNBQWUsR0FBdkIsVUFBd0IsSUFBa0I7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssSUFBSTtZQUNqRixJQUFJLENBQUMsaUJBQWlCLEtBQUssU0FBUyxDQUFDO0lBQzNDLENBQUM7SUFFTyw0Q0FBZ0IsR0FBeEIsVUFBeUIsSUFBa0I7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssS0FBSyxDQUFDO0lBQzFGLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUExRUQsSUEwRUM7QUExRVksaUJBQWlCO0lBRDdCLGlCQUFVLEVBQUU7cUNBS21CLGVBQVE7R0FKM0IsaUJBQWlCLENBMEU3QjtBQTFFWSw4Q0FBaUI7QUE0RTlCLDJCQUFrQyxDQUFvQjtJQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUZELDhDQUVDO0FBRUQsOEJBQXFDLENBQW9CO0lBQ3ZELE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFGRCxvREFFQztBQUVEOzs7O0dBSUc7QUFDVSxRQUFBLGtCQUFrQixHQUMzQixJQUFJLHFCQUFjLENBQXVDLG9CQUFvQixDQUFDLENBQUM7QUFFbkY7SUFDRSxNQUFNLENBQUM7UUFDTCxpQkFBaUI7UUFDakI7WUFDRSxPQUFPLEVBQUUsc0JBQWU7WUFDeEIsS0FBSyxFQUFFLElBQUk7WUFDWCxVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDO1NBQzFCO1FBQ0QsRUFBQyxPQUFPLEVBQUUsMEJBQWtCLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7UUFDMUYsRUFBQyxPQUFPLEVBQUUsNkJBQXNCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsMEJBQWtCLEVBQUM7S0FDaEYsQ0FBQztBQUNKLENBQUM7QUFaRCw0REFZQyJ9