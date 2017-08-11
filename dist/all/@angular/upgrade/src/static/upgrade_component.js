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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9zdGF0aWMvdXBncmFkZV9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMEo7QUFFMUosaURBQTJDO0FBQzNDLDJEQUFpRztBQUNqRyx1Q0FBMEM7QUFFMUMsSUFBTSxhQUFhLEdBQVEsZUFBZSxDQUFDO0FBQzNDLElBQU0sYUFBYSxHQUFHO0lBQ3BCLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQztBQUVGO0lBQUE7UUFDRSwwQkFBcUIsR0FBYSxFQUFFLENBQUM7UUFDckMsMEJBQXFCLEdBQVUsRUFBRSxDQUFDO1FBRWxDLDhCQUF5QixHQUFhLEVBQUUsQ0FBQztRQUV6Qyx3QkFBbUIsR0FBaUMsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNHO0FBQ0g7SUFxQkU7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsMEJBQW9CLElBQVksRUFBVSxVQUFzQixFQUFVLFFBQWtCO1FBQXhFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUMxRixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksOEJBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxN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