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
var core_1 = require("@angular/core");
var angular = require("../common/angular1");
var constants_1 = require("../common/constants");
var util_1 = require("../common/util");
var angular1_providers_1 = require("./angular1_providers");
var util_2 = require("./util");
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows AngularJS and Angular components to be used together inside a hybrid upgrade
 * application, which supports AoT compilation.
 *
 * Specifically, the classes and functions in the `upgrade/static` module allow the following:
 * 1. Creation of an Angular directive that wraps and exposes an AngularJS component so
 *    that it can be used in an Angular template. See {@link UpgradeComponent}.
 * 2. Creation of an AngularJS directive that wraps and exposes an Angular component so
 *    that it can be used in an AngularJS template. See {@link downgradeComponent}.
 * 3. Creation of an Angular root injector provider that wraps and exposes an AngularJS
 *    service so that it can be injected into an Angular context. See
 *    {@link UpgradeModule#upgrading-an-angular-1-service Upgrading an AngularJS service} below.
 * 4. Creation of an AngularJS service that wraps and exposes an Angular injectable
 *    so that it can be injected into an AngularJS context. See {@link downgradeInjectable}.
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application. See the
 *    {@link UpgradeModule#example example} below.
 *
 * ## Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. AngularJS directives always execute inside the AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside the Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be "upgraded"" to an Angular component. This is achieved by
 *    defining an Angular directive, which bootstraps the AngularJS component at its location
 *    in the DOM. See {@link UpgradeComponent}.
 * 6. An Angular component can be "downgraded"" to an AngularJS component. This is achieved by
 *    defining an AngularJS directive, which bootstraps the Angular component at its location
 *    in the DOM. See {@link downgradeComponent}.
 * 7. Whenever an "upgraded"/"downgraded" component is instantiated the host element is owned by
 *    the framework doing the instantiation. The other framework then instantiates and owns the
 *    view for that component.
 *    a. This implies that the component bindings will always follow the semantics of the
 *       instantiation framework.
 *    b. The DOM attributes are parsed by the framework that owns the current template. So
 * attributes
 *       in AngularJS templates must use kebab-case, while AngularJS templates must use camelCase.
 *    c. However the template binding syntax will always use the Angular style, e.g. square
 *       brackets (`[...]`) for property binding.
 * 8. AngularJS is always bootstrapped first and owns the root component.
 * 9. The new application is running in an Angular zone, and therefore it no longer needs calls
 * to
 *    `$apply()`.
 *
 * @howToUse
 *
 * `import {UpgradeModule} from '@angular/upgrade/static';`
 *
 * ## Example
 * Import the {@link UpgradeModule} into your top level {@link NgModule Angular `NgModule`}.
 *
 * {@example upgrade/static/ts/module.ts region='ng2-module'}
 *
 * Then bootstrap the hybrid upgrade app's module, get hold of the {@link UpgradeModule} instance
 * and use it to bootstrap the top level [AngularJS
 * module](https://docs.angularjs.org/api/ng/type/angular.Module).
 *
 * {@example upgrade/static/ts/module.ts region='bootstrap'}
 *
 * {@a upgrading-an-angular-1-service}
 *
 * ## Upgrading an AngularJS service
 *
 * There is no specific API for upgrading an AngularJS service. Instead you should just follow the
 * following recipe:
 *
 * Let's say you have an AngularJS service:
 *
 * {@example upgrade/static/ts/module.ts region="ng1-title-case-service"}
 *
 * Then you should define an Angular provider to be included in your {@link NgModule} `providers`
 * property.
 *
 * {@example upgrade/static/ts/module.ts region="upgrade-ng1-service"}
 *
 * Then you can use the "upgraded" AngularJS service by injecting it into an Angular component
 * or service.
 *
 * {@example upgrade/static/ts/module.ts region="use-ng1-upgraded-service"}
 *
 * @description
 *
 * This class is an `NgModule`, which you import to provide AngularJS core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * ## Core AngularJS services
 * Importing this {@link NgModule} will add providers for the core
 * [AngularJS services](https://docs.angularjs.org/api/ng/service) to the root injector.
 *
 * ## Bootstrap
 * The runtime instance of this class contains a {@link UpgradeModule#bootstrap `bootstrap()`}
 * method, which you use to bootstrap the top level AngularJS module onto an element in the
 * DOM for the hybrid upgrade app.
 *
 * It also contains properties to access the {@link UpgradeModule#injector root injector}, the
 * bootstrap {@link NgZone} and the
 * [AngularJS $injector](https://docs.angularjs.org/api/auto/service/$injector).
 *
 * @experimental
 */
var UpgradeModule = (function () {
    function UpgradeModule(
        /** The root {@link Injector} for the upgrade application. */
        injector, 
        /** The bootstrap zone for the upgrade application */
        ngZone) {
        this.ngZone = ngZone;
        this.injector = new util_2.NgAdapterInjector(injector);
    }
    /**
     * Bootstrap an AngularJS application from this NgModule
     * @param element the element on which to bootstrap the AngularJS application
     * @param [modules] the AngularJS modules to bootstrap for this application
     * @param [config] optional extra AngularJS bootstrap configuration
     */
    UpgradeModule.prototype.bootstrap = function (element, modules, config /*angular.IAngularBootstrapConfig*/) {
        var _this = this;
        if (modules === void 0) { modules = []; }
        var INIT_MODULE_NAME = constants_1.UPGRADE_MODULE_NAME + '.init';
        // Create an ng1 module to bootstrap
        var initModule = angular
            .module(INIT_MODULE_NAME, [])
            .value(constants_1.INJECTOR_KEY, this.injector)
            .factory(constants_1.LAZY_MODULE_REF, [constants_1.INJECTOR_KEY, function (injector) { return ({ injector: injector, needsNgZone: false }); }])
            .config([
            constants_1.$PROVIDE, constants_1.$INJECTOR,
            function ($provide, $injector) {
                if ($injector.has(constants_1.$$TESTABILITY)) {
                    $provide.decorator(constants_1.$$TESTABILITY, [
                        constants_1.$DELEGATE,
                        function (testabilityDelegate) {
                            var originalWhenStable = testabilityDelegate.whenStable;
                            var injector = _this.injector;
                            // Cannot use arrow function below because we need the context
                            var newWhenStable = function (callback) {
                                originalWhenStable.call(testabilityDelegate, function () {
                                    var ng2Testability = injector.get(core_1.Testability);
                                    if (ng2Testability.isStable()) {
                                        callback();
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(testabilityDelegate, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
                if ($injector.has(constants_1.$INTERVAL)) {
                    $provide.decorator(constants_1.$INTERVAL, [
                        constants_1.$DELEGATE,
                        function (intervalDelegate) {
                            // Wrap the $interval service so that setInterval is called outside NgZone,
                            // but the callback is still invoked within it. This is so that $interval
                            // won't block stability, which preserves the behavior from AngularJS.
                            var wrappedInterval = function (fn, delay, count, invokeApply) {
                                var pass = [];
                                for (var _i = 4; _i < arguments.length; _i++) {
                                    pass[_i - 4] = arguments[_i];
                                }
                                return _this.ngZone.runOutsideAngular(function () {
                                    return intervalDelegate.apply(void 0, [function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            // Run callback in the next VM turn - $interval calls
                                            // $rootScope.$apply, and running the callback in NgZone will
                                            // cause a '$digest already in progress' error if it's in the
                                            // same vm turn.
                                            setTimeout(function () { _this.ngZone.run(function () { return fn.apply(void 0, args); }); });
                                        }, delay, count, invokeApply].concat(pass));
                                });
                            };
                            wrappedInterval['cancel'] = intervalDelegate.cancel;
                            return wrappedInterval;
                        }
                    ]);
                }
            }
        ])
            .run([
            constants_1.$INJECTOR,
            function ($injector) {
                _this.$injector = $injector;
                // Initialize the ng1 $injector provider
                angular1_providers_1.setTempInjectorRef($injector);
                _this.injector.get(constants_1.$INJECTOR);
                // Put the injector on the DOM, so that it can be "required"
                angular.element(element).data(util_1.controllerKey(constants_1.INJECTOR_KEY), _this.injector);
                // Wire up the ng1 rootScope to run a digest cycle whenever the zone settles
                // We need to do this in the next tick so that we don't prevent the bootup
                // stabilizing
                setTimeout(function () {
                    var $rootScope = $injector.get('$rootScope');
                    var subscription = _this.ngZone.onMicrotaskEmpty.subscribe(function () { return $rootScope.$digest(); });
                    $rootScope.$on('$destroy', function () { subscription.unsubscribe(); });
                }, 0);
            }
        ]);
        var upgradeModule = angular.module(constants_1.UPGRADE_MODULE_NAME, [INIT_MODULE_NAME].concat(modules));
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        var windowAngular = window['angular'];
        windowAngular.resumeBootstrap = undefined;
        // Bootstrap the AngularJS application inside our zone
        this.ngZone.run(function () { angular.bootstrap(element, [upgradeModule.name], config); });
        // Patch resumeBootstrap() to run inside the ngZone
        if (windowAngular.resumeBootstrap) {
            var originalResumeBootstrap_1 = windowAngular.resumeBootstrap;
            var ngZone_1 = this.ngZone;
            windowAngular.resumeBootstrap = function () {
                var _this = this;
                var args = arguments;
                windowAngular.resumeBootstrap = originalResumeBootstrap_1;
                ngZone_1.run(function () { windowAngular.resumeBootstrap.apply(_this, args); });
            };
        }
    };
    return UpgradeModule;
}());
UpgradeModule = __decorate([
    core_1.NgModule({ providers: [angular1_providers_1.angular1Providers] }),
    __metadata("design:paramtypes", [core_1.Injector,
        core_1.NgZone])
], UpgradeModule);
exports.UpgradeModule = UpgradeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvc3RhdGljL3VwZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNFO0FBRXRFLDRDQUE4QztBQUM5QyxpREFBaUo7QUFDakosdUNBQTZDO0FBRTdDLDJEQUEyRTtBQUMzRSwrQkFBeUM7QUFHekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUhHO0FBRUgsSUFBYSxhQUFhO0lBUXhCO1FBQ0ksNkRBQTZEO1FBQzdELFFBQWtCO1FBQ2xCLHFEQUFxRDtRQUM5QyxNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsaUNBQVMsR0FBVCxVQUNJLE9BQWdCLEVBQUUsT0FBc0IsRUFBRSxNQUFZLENBQUMsbUNBQW1DO1FBRDlGLGlCQW1IQztRQWxIcUIsd0JBQUEsRUFBQSxZQUFzQjtRQUMxQyxJQUFNLGdCQUFnQixHQUFHLCtCQUFtQixHQUFHLE9BQU8sQ0FBQztRQUV2RCxvQ0FBb0M7UUFDcEMsSUFBTSxVQUFVLEdBQ1osT0FBTzthQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7YUFFNUIsS0FBSyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUVsQyxPQUFPLENBQ0osMkJBQWUsRUFDZixDQUFDLHdCQUFZLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEs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