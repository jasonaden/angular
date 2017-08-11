/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileReflector, DirectiveResolver } from '@angular/compiler';
import { Compiler, Component, Directive, Injectable, Injector, resolveForwardRef } from '@angular/core';
/**
 * An implementation of {\@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
var MockDirectiveResolver = (function (_super) {
    tslib_1.__extends(MockDirectiveResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
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
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} component
     * @return {?}
     */
    MockDirectiveResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockDirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metadata = this._directives.get(type) || null;
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        if (!metadata) {
            return null;
        }
        var /** @type {?} */ providerOverrides = this._providerOverrides.get(type);
        var /** @type {?} */ viewProviderOverrides = this._viewProviderOverrides.get(type);
        var /** @type {?} */ providers = metadata.providers;
        if (providerOverrides != null) {
            var /** @type {?} */ originalViewProviders = metadata.providers || [];
            providers = originalViewProviders.concat(providerOverrides);
        }
        if (metadata instanceof Component) {
            var /** @type {?} */ viewProviders = metadata.viewProviders;
            if (viewProviderOverrides != null) {
                var /** @type {?} */ originalViewProviders = metadata.viewProviders || [];
                viewProviders = originalViewProviders.concat(viewProviderOverrides);
            }
            var /** @type {?} */ view = this._views.get(type) || metadata;
            var /** @type {?} */ animations = view.animations;
            var /** @type {?} */ templateUrl = view.templateUrl;
            var /** @type {?} */ inlineTemplate = this._inlineTemplates.get(type);
            if (inlineTemplate) {
                templateUrl = undefined;
            }
            else {
                inlineTemplate = view.template;
            }
            return new Component({
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
        return new Directive({
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
     * Overrides the {\@link Directive} for a directive.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockDirectiveResolver.prototype.setDirective = function (type, metadata) {
        this._directives.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * @param {?} type
     * @param {?} providers
     * @return {?}
     */
    MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
        this._providerOverrides.set(type, providers);
        this._clearCacheFor(type);
    };
    /**
     * @param {?} type
     * @param {?} viewProviders
     * @return {?}
     */
    MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
        this._viewProviderOverrides.set(type, viewProviders);
        this._clearCacheFor(type);
    };
    /**
     * Overrides the {\@link ViewMetadata} for a component.
     * @param {?} component
     * @param {?} view
     * @return {?}
     */
    MockDirectiveResolver.prototype.setView = function (component, view) {
        this._views.set(component, view);
        this._clearCacheFor(component);
    };
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     * @param {?} component
     * @param {?} template
     * @return {?}
     */
    MockDirectiveResolver.prototype.setInlineTemplate = function (component, template) {
        this._inlineTemplates.set(component, template);
        this._clearCacheFor(component);
    };
    return MockDirectiveResolver;
}(DirectiveResolver));
export { MockDirectiveResolver };
MockDirectiveResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockDirectiveResolver.ctorParameters = function () { return [
    { type: Injector, },
    { type: CompileReflector, },
]; };
function MockDirectiveResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    MockDirectiveResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    MockDirectiveResolver.ctorParameters;
    /** @type {?} */
    MockDirectiveResolver.prototype._directives;
    /** @type {?} */
    MockDirectiveResolver.prototype._providerOverrides;
    /** @type {?} */
    MockDirectiveResolver.prototype._viewProviderOverrides;
    /** @type {?} */
    MockDirectiveResolver.prototype._views;
    /** @type {?} */
    MockDirectiveResolver.prototype._inlineTemplates;
    /** @type {?} */
    MockDirectiveResolver.prototype._injector;
}
/**
 * @param {?} tree
 * @param {?} out
 * @return {?}
 */
function flattenArray(tree, out) {
    if (tree == null)
        return;
    for (var /** @type {?} */ i = 0; i < tree.length; i++) {
        var /** @type {?} */ item = resolveForwardRef(tree[i]);
        if (Array.isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
//# sourceMappingURL=directive_resolver_mock.js.map