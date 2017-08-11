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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi9kb3duZ3JhZGVfY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQWlHO0FBR2pHLHlDQUEySDtBQUMzSCw2RUFBd0U7QUFDeEUsK0JBQWtGO0FBT2xGLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCw0QkFBbUMsSUFVbEM7SUFDQyxJQUFNLFFBQVEsR0FBRyxpQkFBZSxjQUFjLEVBQUUsTUFBRyxDQUFDO0lBQ3BELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVoQixJQUFNLGdCQUFnQixHQUNXLFVBQ0ksUUFBaUMsRUFDakMsU0FBbUMsRUFDbkMsTUFBNkI7UUFDaEUsNkZBQTZGO1FBQzdGLDhGQUE4RjtRQUM5RiwrRUFBK0U7UUFDL0UsNkZBQTZGO1FBQzdGLGdCQUFnQjtRQUNoQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxZQUFZLEdBQUcsVUFBSSxFQUFXLElBQUssT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDO1FBQzFDLElBQUksTUFBYyxDQUFDO1FBRW5CLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxHQUFHO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsQ0FBQyw0QkFBZ0IsRUFBRSw0QkFBZ0IsQ0FBQztZQUM3QyxJQUFJLEVBQUUsVUFBQyxLQUFxQixFQUFFLE9BQWlDLEVBQUUsS0FBMEIsRUFDcEYsUUFBZTtnQkFDcEIscUZBQXFGO2dCQUNyRixzRkFBc0Y7Z0JBQ3RGLGlCQUFpQjtnQkFFakIsSUFBTSxPQUFPLEdBQStCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFB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