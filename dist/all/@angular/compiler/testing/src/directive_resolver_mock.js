"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
/**
 * An implementation of {@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
var MockDirectiveResolver = (function (_super) {
    __extends(MockDirectiveResolver, _super);
    function MockDirectiveResolver(_injector, reflector) {
        var _this = _super.call(this, reflector) || this;
        _this._injector = _injector;
        _this._directives = new Map();
        _this._providerOverrides = new Map();
        _this._viewProviderOverrides = new Map();
        _this._views = new Map();
        _this._inlineTemplates = new Map();
        return _this;
    }
    Object.defineProperty(MockDirectiveResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(core_1.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockDirectiveResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    MockDirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metadata = this._directives.get(type) || null;
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        if (!metadata) {
            return null;
        }
        var providerOverrides = this._providerOverrides.get(type);
        var viewProviderOverrides = this._viewProviderOverrides.get(type);
        var providers = metadata.providers;
        if (providerOverrides != null) {
            var originalViewProviders = metadata.providers || [];
            providers = originalViewProviders.concat(providerOverrides);
        }
        if (metadata instanceof core_1.Component) {
            var viewProviders = metadata.viewProviders;
            if (viewProviderOverrides != null) {
                var originalViewProviders = metadata.viewProviders || [];
                viewProviders = originalViewProviders.concat(viewProviderOverrides);
            }
            var view = this._views.get(type) || metadata;
            var animations = view.animations;
            var templateUrl = view.templateUrl;
            var inlineTemplate = this._inlineTemplates.get(type);
            if (inlineTemplate) {
                templateUrl = undefined;
            }
            else {
                inlineTemplate = view.template;
            }
            return new core_1.Component({
                selector: metadata.selector,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                host: metadata.host,
                exportAs: metadata.exportAs,
                moduleId: metadata.moduleId,
                queries: metadata.queries,
                changeDetection: metadata.changeDetection,
                providers: providers,
                viewProviders: viewProviders,
                entryComponents: metadata.entryComponents,
                template: inlineTemplate,
                templateUrl: templateUrl,
                animations: animations,
                styles: view.styles,
                styleUrls: view.styleUrls,
                encapsulation: view.encapsulation,
                interpolation: view.interpolation
            });
        }
        return new core_1.Directive({
            selector: metadata.selector,
            inputs: metadata.inputs,
            outputs: metadata.outputs,
            host: metadata.host,
            providers: providers,
            exportAs: metadata.exportAs,
            queries: metadata.queries
        });
    };
    /**
     * Overrides the {@link Directive} for a directive.
     */
    MockDirectiveResolver.prototype.setDirective = function (type, metadata) {
        this._directives.set(type, metadata);
        this._clearCacheFor(type);
    };
    MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
        this._providerOverrides.set(type, providers);
        this._clearCacheFor(type);
    };
    MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
        this._viewProviderOverrides.set(type, viewProviders);
        this._clearCacheFor(type);
    };
    /**
     * Overrides the {@link ViewMetadata} for a component.
     */
    MockDirectiveResolver.prototype.setView = function (component, view) {
        this._views.set(component, view);
        this._clearCacheFor(component);
    };
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     */
    MockDirectiveResolver.prototype.setInlineTemplate = function (component, template) {
        this._inlineTemplates.set(component, template);
        this._clearCacheFor(component);
    };
    return MockDirectiveResolver;
}(compiler_1.DirectiveResolver));
MockDirectiveResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Injector, compiler_1.CompileReflector])
], MockDirectiveResolver);
exports.MockDirectiveResolver = MockDirectiveResolver;
function flattenArray(tree, out) {
    if (tree == null)
        return;
    for (var i = 0; i < tree.length; i++) {
        var item = core_1.resolveForwardRef(tree[i]);
        if (Array.isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBc0U7QUFDdEUsc0NBQXFKO0FBSXJKOzs7R0FHRztBQUVILElBQWEscUJBQXFCO0lBQVMseUNBQWlCO0lBTzFELCtCQUFvQixTQUFtQixFQUFFLFNBQTJCO1FBQXBFLFlBQXdFLGtCQUFNLFNBQVMsQ0FBQyxTQUFHO1FBQXZFLGVBQVMsR0FBVCxTQUFTLENBQVU7UUFOL0IsaUJBQVcsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUM5Qyx3QkFBa0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUNqRCw0QkFBc0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUNyRCxZQUFNLEdBQUcsSUFBSSxHQUFHLEVBQTJCLENBQUM7UUFDNUMsc0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7O0lBRWtDLENBQUM7SUFFM0Ysc0JBQVksNENBQVM7YUFBckIsY0FBb0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbEUsOENBQWMsR0FBdEIsVUFBdUIsU0FBb0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFLekYsdUNBQU8sR0FBUCxVQUFRLElBQWUsRUFBRSxlQUFzQjtRQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUM3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENB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