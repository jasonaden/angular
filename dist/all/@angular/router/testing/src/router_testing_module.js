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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var testing_1 = require("@angular/common/testing");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
/**
 * @whatItDoes Allows to simulate the loading of ng modules in tests.
 *
 * @howToUse
 *
 * ```
 * const loader = TestBed.get(NgModuleFactoryLoader);
 *
 * @Component({template: 'lazy-loaded'})
 * class LazyLoadedComponent {}
 * @NgModule({
 *   declarations: [LazyLoadedComponent],
 *   imports: [RouterModule.forChild([{path: 'loaded', component: LazyLoadedComponent}])]
 * })
 *
 * class LoadedModule {}
 *
 * // sets up stubbedModules
 * loader.stubbedModules = {lazyModule: LoadedModule};
 *
 * router.resetConfig([
 *   {path: 'lazy', loadChildren: 'lazyModule'},
 * ]);
 *
 * router.navigateByUrl('/lazy/loaded');
 * ```
 *
 * @stable
 */
var SpyNgModuleFactoryLoader = (function () {
    function SpyNgModuleFactoryLoader(compiler) {
        this.compiler = compiler;
        /**
         * @docsNotRequired
         */
        this._stubbedModules = {};
    }
    Object.defineProperty(SpyNgModuleFactoryLoader.prototype, "stubbedModules", {
        /**
         * @docsNotRequired
         */
        get: function () { return this._stubbedModules; },
        /**
         * @docsNotRequired
         */
        set: function (modules) {
            var res = {};
            for (var _i = 0, _a = Object.keys(modules); _i < _a.length; _i++) {
                var t = _a[_i];
                res[t] = this.compiler.compileModuleAsync(modules[t]);
            }
            this._stubbedModules = res;
        },
        enumerable: true,
        configurable: true
    });
    SpyNgModuleFactoryLoader.prototype.load = function (path) {
        if (this._stubbedModules[path]) {
            return this._stubbedModules[path];
        }
        else {
            return Promise.reject(new Error("Cannot find module " + path));
        }
    };
    return SpyNgModuleFactoryLoader;
}());
SpyNgModuleFactoryLoader = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Compiler])
], SpyNgModuleFactoryLoader);
exports.SpyNgModuleFactoryLoader = SpyNgModuleFactoryLoader;
/**
 * Router setup factory function used for testing.
 *
 * @stable
 */
function setupTestingRouter(urlSerializer, contexts, location, loader, compiler, injector, routes, urlHandlingStrategy) {
    var router = new router_1.Router(null, urlSerializer, contexts, location, injector, loader, compiler, router_1.ɵflatten(routes));
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    return router;
}
exports.setupTestingRouter = setupTestingRouter;
/**
 * @whatItDoes Sets up the router to be used for testing.
 *
 * @howToUse
 *
 * ```
 * beforeEach(() => {
 *   TestBed.configureTestModule({
 *     imports: [
 *       RouterTestingModule.withRoutes(
 *         [{path: '', component: BlankCmp}, {path: 'simple', component: SimpleCmp}])]
 *       )
 *     ]
 *   });
 * });
 * ```
 *
 * @description
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of {@link Location}, {@link LocationStrategy}, and {@link
 * NgModuleFactoryLoader}.
 *
 * @stable
 */
var RouterTestingModule = RouterTestingModule_1 = (function () {
    function RouterTestingModule() {
    }
    RouterTestingModule.withRoutes = function (routes) {
        return { ngModule: RouterTestingModule_1, providers: [router_1.provideRoutes(routes)] };
    };
    return RouterTestingModule;
}());
RouterTestingModule = RouterTestingModule_1 = __decorate([
    core_1.NgModule({
        exports: [router_1.RouterModule],
        providers: [
            router_1.ɵROUTER_PROVIDERS, { provide: common_1.Location, useClass: testing_1.SpyLocation },
            { provide: common_1.LocationStrategy, useClass: testing_1.MockLocationStrategy },
            { provide: core_1.NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader }, {
                provide: router_1.Router,
                useFactory: setupTestingRouter,
                deps: [
                    router_1.UrlSerializer, router_1.ChildrenOutletContexts, common_1.Location, core_1.NgModuleFactoryLoader, core_1.Compiler, core_1.Injector,
                    router_1.ROUTES, [router_1.UrlHandlingStrategy, new core_1.Optional()]
                ]
            },
            { provide: router_1.PreloadingStrategy, useExisting: router_1.NoPreloading }, router_1.provideRoutes([])
        ]
    })
], RouterTestingModule);
exports.RouterTestingModule = RouterTestingModule;
var RouterTestingModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Rlc3RpbmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3Rpbmcvc3JjL3JvdXRlcl90ZXN0aW5nX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUEyRDtBQUMzRCxtREFBMEU7QUFDMUUsc0NBQThJO0FBQzlJLDBDQUFxUDtBQUlyUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUVILElBQWEsd0JBQXdCO0lBc0JuQyxrQ0FBb0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXJCdEM7O1dBRUc7UUFDSyxvQkFBZSxHQUFvRCxFQUFFLENBQUM7SUFrQnJDLENBQUM7SUFiMUMsc0JBQUksb0RBQWM7UUFRbEI7O1dBRUc7YUFDSCxjQUE4QyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFkNUU7O1dBRUc7YUFDSCxVQUFtQixPQUE4QjtZQUMvQyxJQUFNLEdBQUcsR0FBMEIsRUFBRSxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxDQUFZLFVBQW9CLEVBQXBCLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0I7Z0JBQS9CLElBQU0sQ0FBQyxTQUFBO2dCQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFTRCx1Q0FBSSxHQUFKLFVBQUssSUFBWTtRQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHdCQUFzQixJQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7SUFDSCxDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBL0JELElBK0JDO0FBL0JZLHdCQUF3QjtJQURwQyxpQkFBVSxFQUFFO3FDQXVCbUIsZUFBUTtHQXRCM0Isd0JBQXdCLENBK0JwQztBQS9CWSw0REFBd0I7QUFpQ3JDOzs7O0dBSUc7QUFDSCw0QkFDSSxhQUE0QixFQUFFLFFBQWdDLEVBQUUsUUFBa0IsRUFDbEYsTUFBNkIsRUFBRSxRQUFrQixFQUFFLFFBQWtCLEVBQUUsTUFBaUIsRUFDeEYsbUJBQXlDO0lBQzNDLElBQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUNyQixJQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVGLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFDbkQsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVZELGdEQVVDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQWlCSCxJQUFhLG1CQUFtQjtJQUFoQztJQUlBLENBQUM7SUFIUSw4QkFBVSxHQUFqQixVQUFrQixNQUFjO1FBQzlCLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxxQkFBbUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxzQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLG1CQUFtQjtJQWhCL0IsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQztRQUN2QixTQUFTLEVBQUU7WUFDVCwwQkFBZ0IsRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBUSxFQUFFLFFBQVEsRUFBRSxxQkFBVyxFQUFDO1lBQzVELEVBQUMsT0FBTyxFQUFFLHlCQUFnQixFQUFFLFFBQVEsRUFBRSw4QkFBb0IsRUFBQztZQUMzRCxFQUFDLE9BQU8sRUFBRSw0QkFBcUIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUMsRUFBRTtnQkFDcEUsT0FBTyxFQUFFLGVBQU07Z0JBQ2YsVUFBVSxFQUFFLGtCQUFrQjtnQkFDOUIsSUFBSSxFQUFFO29CQUNKLHNCQUFhLEVBQUUsK0JBQXNCLEVBQUUsaUJBQVEsRUFBRSw0QkFBcUIsRUFBRSxlQUFRLEVBQUUsZUFBUTtvQkFDMUYsZUFBTSxFQUFFLENBQUMsNEJBQW1CLEVBQUUsSUFBSSxlQUFRLEVBQUUsQ0FBQztpQkFDOUM7YUFDRjtZQUNELEVBQUMsT0FBTyxFQUFFLDJCQUFrQixFQUFFLFdBQVcsRUFBRSxxQkFBWSxFQUFDLEVBQUUsc0JBQWEsQ0FBQyxFQUFFLENBQUM7U0FDNUU7S0FDRixDQUFDO0dBQ1csbUJBQW1CLENBSS9CO0FBSlksa0RBQW1CIn0=