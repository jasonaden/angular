"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var constants_1 = require("./constants");
var downgrade_component_adapter_1 = require("./downgrade_component_adapter");
var util_1 = require("./util");
var downgradeCount = 0;
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows an Angular component to be used from AngularJS.
 *
 * @howToUse
 *
 * Let's assume that you have an Angular component called `ng2Heroes` that needs
 * to be made available in AngularJS templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng2-heroes"}
 *
 * We must create an AngularJS [directive](https://docs.angularjs.org/guide/directive)
 * that will make this Angular component available inside AngularJS templates.
 * The `downgradeComponent()` function returns a factory function that we
 * can use to define the AngularJS directive that wraps the "downgraded" component.
 *
 * {@example upgrade/static/ts/module.ts region="ng2-heroes-wrapper"}
 *
 * @description
 *
 * A helper function that returns a factory function to be used for registering an
 * AngularJS wrapper directive for "downgrading" an Angular component.
 *
 * The parameter contains information about the Component that is being downgraded:
 *
 * * `component: Type<any>`: The type of the Component that will be downgraded
 *
 * @experimental
 */
function downgradeComponent(info) {
    var idPrefix = "NG2_UPGRADE_" + downgradeCount++ + "_";
    var idCount = 0;
    var directiveFactory = function ($compile, $injector, $parse) {
        // When using `UpgradeModule`, we don't need to ensure callbacks to Angular APIs (e.g. change
        // detection) are run inside the Angular zone, because `$digest()` will be run inside the zone
        // (except if explicitly escaped, in which case we shouldn't force it back in).
        // When using `downgradeModule()` though, we need to ensure such callbacks are run inside the
        // Angular zone.
        var needsNgZone = false;
        var wrapCallback = function (cb) { return cb; };
        var ngZone;
        return {
            restrict: 'E',
            terminal: true,
            require: [constants_1.REQUIRE_INJECTOR, constants_1.REQUIRE_NG_MODEL],
            link: function (scope, element, attrs, required) {
                // We might have to compile the contents asynchronously, because this might have been
                // triggered by `UpgradeNg1ComponentAdapterBuilder`, before the Angular templates have
                // been compiled.
                var ngModel = required[1];
                var parentInjector = required[0];
                var ranAsync = false;
                if (!parentInjector) {
                    var lazyModuleRef = $injector.get(constants_1.LAZY_MODULE_REF);
                    needsNgZone = lazyModuleRef.needsNgZone;
                    parentInjector = lazyModuleRef.injector || lazyModuleRef.promise;
                }
                var doDowngrade = function (injector) {
                    var componentFactoryResolver = injector.get(core_1.ComponentFactoryResolver);
                    var componentFactory = componentFactoryResolver.resolveComponentFactory(info.component);
                    if (!componentFactory) {
                        throw new Error('Expecting ComponentFactory for: ' + util_1.getComponentName(info.component));
                    }
                    var id = idPrefix + (idCount++);
                    var injectorPromise = new ParentInjectorPromise(element);
                    var facade = new downgrade_component_adapter_1.DowngradeComponentAdapter(id, element, attrs, scope, ngModel, injector, $injector, $compile, $parse, componentFactory, wrapCallback);
                    var projectableNodes = facade.compileContents();
                    facade.createComponent(projectableNodes);
                    facade.setupInputs(needsNgZone, info.propagateDigest);
                    facade.setupOutputs();
                    facade.registerCleanup(needsNgZone);
                    injectorPromise.resolve(facade.getInjector());
                    if (ranAsync) {
                        // If this is run async, it is possible that it is not run inside a
                        // digest and initial input values will not be detected.
                        scope.$evalAsync(function () { });
                    }
                };
                var downgradeFn = !needsNgZone ? doDowngrade : function (injector) {
                    if (!ngZone) {
                        ngZone = injector.get(core_1.NgZone);
                        wrapCallback = function (cb) { return function () {
                            return core_1.NgZone.isInAngularZone() ? cb() : ngZone.run(cb);
                        }; };
                    }
                    wrapCallback(function () { return doDowngrade(injector); })();
                };
                if (isThenable(parentInjector)) {
                    parentInjector.then(downgradeFn);
                }
                else {
                    downgradeFn(parentInjector);
                }
                ranAsync = true;
            }
        };
    };
    // bracket-notation because of closure - see #14441
    directiveFactory['$inject'] = [constants_1.$COMPILE, constants_1.$INJECTOR, constants_1.$PARSE];
    return directiveFactory;
}
exports.downgradeComponent = downgradeComponent;
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of Angular 1's $compile.
 */
var ParentInjectorPromise = (function () {
    function ParentInjectorPromise(element) {
        this.element = element;
        this.injectorKey = util_1.controllerKey(constants_1.INJECTOR_KEY);
        this.callbacks = [];
        // Store the promise on the element.
        element.data(this.injectorKey, this);
    }
    ParentInjectorPromise.prototype.then = function (callback) {
        if (this.injector) {
            callback(this.injector);
        }
        else {
            this.callbacks.push(callback);
        }
    };
    ParentInjectorPromise.prototype.resolve = function (injector) {
        this.injector = injector;
        // Store the real injector on the element.
        this.element.data(this.injectorKey, injector);
        // Release the element to prevent memory leaks.
        this.element = null;
        // Run the queued callbacks.
        this.callbacks.forEach(function (callback) { return callback(injector); });
        this.callbacks.length = 0;
    };
    return ParentInjectorPromise;
}());
function isThenable(obj) {
    return util_1.isFunction(obj.then);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy9jb21tb24vZG93bmdyYWRlX2NvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFpRztBQUdqRyx5Q0FBMkg7QUFDM0gsNkVBQXdFO0FBQ3hFLCtCQUFrRjtBQU9sRixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFFdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NHO0FBQ0gsNEJBQW1DLElBVWxDO0lBQ0MsSUFBTSxRQUFRLEdBQUcsaUJBQWUsY0FBYyxFQUFFLE1BQUcsQ0FBQztJQUNwRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFaEIsSUFBTSxnQkFBZ0IsR0FDVyxVQUNJLFFBQWlDLEVBQ2pDLFNBQW1DLEVBQ25DLE1BQTZCO1FBQ2hFLDZGQUE2RjtRQUM3Riw4RkFBOEY7UUFDOUYsK0VBQStFO1FBQy9FLDZGQUE2RjtRQUM3RixnQkFBZ0I7UUFDaEIsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksWUFBWSxHQUFHLFVBQUksRUFBVyxJQUFLLE9BQUEsRUFBRSxFQUFGLENBQUUsQ0FBQztRQUMxQyxJQUFJLE1BQWMsQ0FBQztRQUVuQixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsR0FBRztZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLENBQUMsNEJBQWdCLEVBQUUsNEJBQWdCLENBQUM7WUFDN0MsSUFBSSxFQUFFLFVBQUMsS0FBcUIsRUFBRSxPQUFpQyxFQUFFLEtBQTBCLEVBQ3BGLFFBQWU7Z0JBQ3BCLHFGQUFxRjtnQkFDckYsc0ZBQXNGO2dCQUN0RixpQkFBaUI7Z0JBRWpCLElBQU0sT0FBTyxHQUErQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7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