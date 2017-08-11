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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9zdGF0aWMvdXBncmFkZV9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBc0U7QUFFdEUsNENBQThDO0FBQzlDLGlEQUFpSjtBQUNqSix1Q0FBNkM7QUFFN0MsMkRBQTJFO0FBQzNFLCtCQUF5QztBQUd6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpSEc7QUFFSCxJQUFhLGFBQWE7SUFReEI7UUFDSSw2REFBNkQ7UUFDN0QsUUFBa0I7UUFDbEIscURBQXFEO1FBQzlDLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQ0FBUyxHQUFULFVBQ0ksT0FBZ0IsRUFBRSxPQUFzQixFQUFFLE1BQVksQ0FBQyxtQ0FBbUM7UUFEOUYsaUJBbUhDO1FBbEhxQix3QkFBQSxFQUFBLFlBQXNCO1FBQzFDLElBQU0sZ0JBQWdCLEdBQUcsK0JBQW1CLEdBQUcsT0FBTyxDQUFDO1FBRXZELG9DQUFvQztRQUNwQyxJQUFNLFVBQVUsR0FDWixPQUFPO2FBQ0YsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQzthQUU1QixLQUFLLENBQUMsd0JBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBRWxDLE9BQU8sQ0FDSiwyQkFBZSxFQUNmLENBQUMsd0JBQVksRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxDQUFDLEVBQUMs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