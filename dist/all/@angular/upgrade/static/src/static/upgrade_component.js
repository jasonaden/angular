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
var constants_1 = require("../common/constants");
var upgrade_helper_1 = require("../common/upgrade_helper");
var util_1 = require("../common/util");
var NOT_SUPPORTED = 'NOT_SUPPORTED';
var INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
var Bindings = (function () {
    function Bindings() {
        this.twoWayBoundProperties = [];
        this.twoWayBoundLastValues = [];
        this.expressionBoundProperties = [];
        this.propertyToOutputMap = {};
    }
    return Bindings;
}());
/**
 * @whatItDoes
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * Allows an AngularJS component to be used from Angular.
 *
 * @howToUse
 *
 * Let's assume that you have an AngularJS component called `ng1Hero` that needs
 * to be made available in Angular templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng1-hero"}
 *
 * We must create a {@link Directive} that will make this AngularJS component
 * available inside Angular templates.
 *
 * {@example upgrade/static/ts/module.ts region="ng1-hero-wrapper"}
 *
 * In this example you can see that we must derive from the {@link UpgradeComponent}
 * base class but also provide an {@link Directive `@Directive`} decorator. This is
 * because the AoT compiler requires that this information is statically available at
 * compile time.
 *
 * Note that we must do the following:
 * * specify the directive's selector (`ng1-hero`)
 * * specify all inputs and outputs that the AngularJS component expects
 * * derive from `UpgradeComponent`
 * * call the base class from the constructor, passing
 *   * the AngularJS name of the component (`ng1Hero`)
 *   * the {@link ElementRef} and {@link Injector} for the component wrapper
 *
 * @description
 *
 * A helper class that should be used as a base class for creating Angular directives
 * that wrap AngularJS components that need to be "upgraded".
 *
 * @experimental
 */
var UpgradeComponent = (function () {
    /**
     * Create a new `UpgradeComponent` instance. You should not normally need to do this.
     * Instead you should derive a new class from this one and call the super constructor
     * from the base class.
     *
     * {@example upgrade/static/ts/module.ts region="ng1-hero-wrapper" }
     *
     * * The `name` parameter should be the name of the AngularJS directive.
     * * The `elementRef` and `injector` parameters should be acquired from Angular by dependency
     *   injection into the base class constructor.
     *
     * Note that we must manually implement lifecycle hooks that call through to the super class.
     * This is because, at the moment, the AoT compiler is not able to tell that the
     * `UpgradeComponent`
     * already implements them and so does not wire up calls to them at runtime.
     */
    function UpgradeComponent(name, elementRef, injector) {
        this.name = name;
        this.elementRef = elementRef;
        this.injector = injector;
        this.helper = new upgrade_helper_1.UpgradeHelper(injector, name, elementRef);
        this.$injector = this.helper.$injector;
        this.element = this.helper.element;
        this.$element = this.helper.$element;
        this.directive = this.helper.directive;
        this.bindings = this.initializeBindings(this.directive);
        // We ask for the AngularJS scope from the Angular injector, since
        // we will put the new component scope onto the new injector for each component
        var $parentScope = injector.get(constants_1.$SCOPE);
        // QUESTION 1: Should we create an isolated scope if the scope is only true?
        // QUESTION 2: Should we make the scope accessible through `$element.scope()/isolateScope()`?
        this.$componentScope = $parentScope.$new(!!this.directive.scope);
        this.initializeOutputs();
    }
    UpgradeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Collect contents, insert and compile template
        var attachChildNodes = this.helper.prepareTransclusion();
        var linkFn = this.helper.compileTemplate();
        // Instantiate controller
        var controllerType = this.directive.controller;
        var bindToController = this.directive.bindToController;
        if (controllerType) {
            this.controllerInstance = this.helper.buildController(controllerType, this.$componentScope);
        }
        else if (bindToController) {
            throw new Error("Upgraded directive '" + this.directive.name + "' specifies 'bindToController' but no controller.");
        }
        // Set up outputs
        this.bindingDestination = bindToController ? this.controllerInstance : this.$componentScope;
        this.bindOutputs();
        // Require other controllers
        var requiredControllers = this.helper.resolveAndBindRequiredControllers(this.controllerInstance);
        // Hook: $onChanges
        if (this.pendingChanges) {
            this.forwardChanges(this.pendingChanges);
            this.pendingChanges = null;
        }
        // Hook: $onInit
        if (this.controllerInstance && util_1.isFunction(this.controllerInstance.$onInit)) {
            this.controllerInstance.$onInit();
        }
        // Hook: $doCheck
        if (this.controllerInstance && util_1.isFunction(this.controllerInstance.$doCheck)) {
            var callDoCheck = function () { return _this.controllerInstance.$doCheck(); };
            this.unregisterDoCheckWatcher = this.$componentScope.$parent.$watch(callDoCheck);
            callDoCheck();
        }
        // Linking
        var link = this.directive.link;
        var preLink = (typeof link == 'object') && link.pre;
        var postLink = (typeof link == 'object') ? link.post : link;
        var attrs = NOT_SUPPORTED;
        var transcludeFn = NOT_SUPPORTED;
        if (preLink) {
            preLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        linkFn(this.$componentScope, null, { parentBoundTranscludeFn: attachChildNodes });
        if (postLink) {
            postLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        // Hook: $postLink
        if (this.controllerInstance && util_1.isFunction(this.controllerInstance.$postLink)) {
            this.controllerInstance.$postLink();
        }
    };
    UpgradeComponent.prototype.ngOnChanges = function (changes) {
        if (!this.bindingDestination) {
            this.pendingChanges = changes;
        }
        else {
            this.forwardChanges(changes);
        }
    };
    UpgradeComponent.prototype.ngDoCheck = function () {
        var _this = this;
        var twoWayBoundProperties = this.bindings.twoWayBoundProperties;
        var twoWayBoundLastValues = this.bindings.twoWayBoundLastValues;
        var propertyToOutputMap = this.bindings.propertyToOutputMap;
        twoWayBoundProperties.forEach(function (propName, idx) {
            var newValue = _this.bindingDestination[propName];
            var oldValue = twoWayBoundLastValues[idx];
            if (!core_1.ɵlooseIdentical(newValue, oldValue)) {
                var outputName = propertyToOutputMap[propName];
                var eventEmitter = _this[outputName];
                eventEmitter.emit(newValue);
                twoWayBoundLastValues[idx] = newValue;
            }
        });
    };
    UpgradeComponent.prototype.ngOnDestroy = function () {
        if (util_1.isFunction(this.unregisterDoCheckWatcher)) {
            this.unregisterDoCheckWatcher();
        }
        if (this.controllerInstance && util_1.isFunction(this.controllerInstance.$onDestroy)) {
            this.controllerInstance.$onDestroy();
        }
        this.$componentScope.$destroy();
    };
    UpgradeComponent.prototype.initializeBindings = function (directive) {
        var _this = this;
        var btcIsObject = typeof directive.bindToController === 'object';
        if (btcIsObject && Object.keys(directive.scope).length) {
            throw new Error("Binding definitions on scope and controller at the same time is not supported.");
        }
        var context = (btcIsObject) ? directive.bindToController : directive.scope;
        var bindings = new Bindings();
        if (typeof context == 'object') {
            Object.keys(context).forEach(function (propName) {
                var definition = context[propName];
                var bindingType = definition.charAt(0);
                // QUESTION: What about `=*`? Ignore? Throw? Support?
                switch (bindingType) {
                    case '@':
                    case '<':
                        // We don't need to do anything special. They will be defined as inputs on the
                        // upgraded component facade and the change propagation will be handled by
                        // `ngOnChanges()`.
                        break;
                    case '=':
                        bindings.twoWayBoundProperties.push(propName);
                        bindings.twoWayBoundLastValues.push(INITIAL_VALUE);
                        bindings.propertyToOutputMap[propName] = propName + 'Change';
                        break;
                    case '&':
                        bindings.expressionBoundProperties.push(propName);
                        bindings.propertyToOutputMap[propName] = propName;
                        break;
                    default:
                        var json = JSON.stringify(context);
                        throw new Error("Unexpected mapping '" + bindingType + "' in '" + json + "' in '" + _this.name + "' directive.");
                }
            });
        }
        return bindings;
    };
    UpgradeComponent.prototype.initializeOutputs = function () {
        var _this = this;
        // Initialize the outputs for `=` and `&` bindings
        this.bindings.twoWayBoundProperties.concat(this.bindings.expressionBoundProperties)
            .forEach(function (propName) {
            var outputName = _this.bindings.propertyToOutputMap[propName];
            _this[outputName] = new core_1.EventEmitter();
        });
    };
    UpgradeComponent.prototype.bindOutputs = function () {
        var _this = this;
        // Bind `&` bindings to the corresponding outputs
        this.bindings.expressionBoundProperties.forEach(function (propName) {
            var outputName = _this.bindings.propertyToOutputMap[propName];
            var emitter = _this[outputName];
            _this.bindingDestination[propName] = function (value) { return emitter.emit(value); };
        });
    };
    UpgradeComponent.prototype.forwardChanges = function (changes) {
        var _this = this;
        // Forward input changes to `bindingDestination`
        Object.keys(changes).forEach(function (propName) { return _this.bindingDestination[propName] = changes[propName].currentValue; });
        if (util_1.isFunction(this.bindingDestination.$onChanges)) {
            this.bindingDestination.$onChanges(changes);
        }
    };
    return UpgradeComponent;
}());
exports.UpgradeComponent = UpgradeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvc3RhdGljL3VwZ3JhZGVfY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTBKO0FBRTFKLGlEQUEyQztBQUMzQywyREFBaUc7QUFDakcsdUNBQTBDO0FBRTFDLElBQU0sYUFBYSxHQUFRLGVBQWUsQ0FBQztBQUMzQyxJQUFNLGFBQWEsR0FBRztJQUNwQixpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUM7QUFFRjtJQUFBO1FBQ0UsMEJBQXFCLEdBQWEsRUFBRSxDQUFDO1FBQ3JDLDBCQUFxQixHQUFVLEVBQUUsQ0FBQztRQUVsQyw4QkFBeUIsR0FBYSxFQUFFLENBQUM7UUFFekMsd0JBQW1CLEdBQWlDLEVBQUUsQ0FBQztJQUN6RCxDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDRztBQUNIO0lBcUJFOzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILDBCQUFvQixJQUFZLEVBQVUsVUFBc0IsRUFBVSxRQUFrQjtRQUF4RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDMUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDhCQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRXZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJ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