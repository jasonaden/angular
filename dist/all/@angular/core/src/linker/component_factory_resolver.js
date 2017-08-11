"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var component_factory_1 = require("./component_factory");
function noComponentFactoryError(component) {
    var error = Error("No component factory found for " + util_1.stringify(component) + ". Did you add it to @NgModule.entryComponents?");
    error[ERROR_COMPONENT] = component;
    return error;
}
exports.noComponentFactoryError = noComponentFactoryError;
var ERROR_COMPONENT = 'ngComponent';
function getComponent(error) {
    return error[ERROR_COMPONENT];
}
exports.getComponent = getComponent;
var _NullComponentFactoryResolver = (function () {
    function _NullComponentFactoryResolver() {
    }
    _NullComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        throw noComponentFactoryError(component);
    };
    return _NullComponentFactoryResolver;
}());
/**
 * @stable
 */
var ComponentFactoryResolver = (function () {
    function ComponentFactoryResolver() {
    }
    return ComponentFactoryResolver;
}());
ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
exports.ComponentFactoryResolver = ComponentFactoryResolver;
var CodegenComponentFactoryResolver = (function () {
    function CodegenComponentFactoryResolver(factories, _parent, _ngModule) {
        this._parent = _parent;
        this._ngModule = _ngModule;
        this._factories = new Map();
        for (var i = 0; i < factories.length; i++) {
            var factory = factories[i];
            this._factories.set(factory.componentType, factory);
        }
    }
    CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        var factory = this._factories.get(component);
        if (!factory && this._parent) {
            factory = this._parent.resolveComponentFactory(component);
        }
        if (!factory) {
            throw noComponentFactoryError(component);
        }
        return new ComponentFactoryBoundToModule(factory, this._ngModule);
    };
    return CodegenComponentFactoryResolver;
}());
exports.CodegenComponentFactoryResolver = CodegenComponentFactoryResolver;
var ComponentFactoryBoundToModule = (function (_super) {
    __extends(ComponentFactoryBoundToModule, _super);
    function ComponentFactoryBoundToModule(factory, ngModule) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.ngModule = ngModule;
        return _this;
    }
    Object.defineProperty(ComponentFactoryBoundToModule.prototype, "selector", {
        get: function () { return this.factory.selector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactoryBoundToModule.prototype, "componentType", {
        get: function () { return this.factory.componentType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactoryBoundToModule.prototype, "ngContentSelectors", {
        get: function () { return this.factory.ngContentSelectors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactoryBoundToModule.prototype, "inputs", {
        get: function () { return this.factory.inputs; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactoryBoundToModule.prototype, "outputs", {
        get: function () { return this.factory.outputs; },
        enumerable: true,
        configurable: true
    });
    ComponentFactoryBoundToModule.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
        return this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule || this.ngModule);
    };
    return ComponentFactoryBoundToModule;
}(component_factory_1.ComponentFactory));
exports.ComponentFactoryBoundToModule = ComponentFactoryBoundToModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgsZ0NBQWtDO0FBRWxDLHlEQUFtRTtBQUduRSxpQ0FBd0MsU0FBbUI7SUFDekQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUNmLG9DQUFrQyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxtREFBZ0QsQ0FBQyxDQUFDO0lBQzNHLEtBQWEsQ0FBQyxlQUFlLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFMRCwwREFLQztBQUVELElBQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQztBQUV0QyxzQkFBNkIsS0FBWTtJQUN2QyxNQUFNLENBQUUsS0FBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFGRCxvQ0FFQztBQUdEO0lBQUE7SUFJQSxDQUFDO0lBSEMsK0RBQXVCLEdBQXZCLFVBQTJCLFNBQW9DO1FBQzdELE1BQU0sdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNILG9DQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDs7R0FFRztBQUNIO0lBQUE7SUFHQSxDQUFDO0lBQUQsK0JBQUM7QUFBRCxDQUFDLEFBSEQ7QUFDUyw2QkFBSSxHQUE2QixJQUFJLDZCQUE2QixFQUFFLENBQUM7QUFEeEQsNERBQXdCO0FBSzlDO0lBR0UseUNBQ0ksU0FBa0MsRUFBVSxPQUFpQyxFQUNyRSxTQUEyQjtRQURTLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQ3JFLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBSi9CLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztR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