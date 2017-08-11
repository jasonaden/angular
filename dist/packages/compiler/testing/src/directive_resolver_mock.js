/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
export class MockDirectiveResolver extends DirectiveResolver {
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
    constructor(_injector, reflector) {
        super(reflector);
        this._injector = _injector;
        this._directives = new Map();
        this._providerOverrides = new Map();
        this._viewProviderOverrides = new Map();
        this._views = new Map();
        this._inlineTemplates = new Map();
    }
    /**
     * @return {?}
     */
    get _compiler() { return this._injector.get(Compiler); }
    /**
     * @param {?} component
     * @return {?}
     */
    _clearCacheFor(component) { this._compiler.clearCacheFor(component); }
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        let /** @type {?} */ metadata = this._directives.get(type) || null;
        if (!metadata) {
            metadata = super.resolve(type, throwIfNotFound);
        }
        if (!metadata) {
            return null;
        }
        const /** @type {?} */ providerOverrides = this._providerOverrides.get(type);
        const /** @type {?} */ viewProviderOverrides = this._viewProviderOverrides.get(type);
        let /** @type {?} */ providers = metadata.providers;
        if (providerOverrides != null) {
            const /** @type {?} */ originalViewProviders = metadata.providers || [];
            providers = originalViewProviders.concat(providerOverrides);
        }
        if (metadata instanceof Component) {
            let /** @type {?} */ viewProviders = metadata.viewProviders;
            if (viewProviderOverrides != null) {
                const /** @type {?} */ originalViewProviders = metadata.viewProviders || [];
                viewProviders = originalViewProviders.concat(viewProviderOverrides);
            }
            let /** @type {?} */ view = this._views.get(type) || metadata;
            let /** @type {?} */ animations = view.animations;
            let /** @type {?} */ templateUrl = view.templateUrl;
            let /** @type {?} */ inlineTemplate = this._inlineTemplates.get(type);
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
    }
    /**
     * Overrides the {\@link Directive} for a directive.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    setDirective(type, metadata) {
        this._directives.set(type, metadata);
        this._clearCacheFor(type);
    }
    /**
     * @param {?} type
     * @param {?} providers
     * @return {?}
     */
    setProvidersOverride(type, providers) {
        this._providerOverrides.set(type, providers);
        this._clearCacheFor(type);
    }
    /**
     * @param {?} type
     * @param {?} viewProviders
     * @return {?}
     */
    setViewProvidersOverride(type, viewProviders) {
        this._viewProviderOverrides.set(type, viewProviders);
        this._clearCacheFor(type);
    }
    /**
     * Overrides the {\@link ViewMetadata} for a component.
     * @param {?} component
     * @param {?} view
     * @return {?}
     */
    setView(component, view) {
        this._views.set(component, view);
        this._clearCacheFor(component);
    }
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     * @param {?} component
     * @param {?} template
     * @return {?}
     */
    setInlineTemplate(component, template) {
        this._inlineTemplates.set(component, template);
        this._clearCacheFor(component);
    }
}
MockDirectiveResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockDirectiveResolver.ctorParameters = () => [
    { type: Injector, },
    { type: CompileReflector, },
];
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
    for (let /** @type {?} */ i = 0; i < tree.length; i++) {
        const /** @type {?} */ item = resolveForwardRef(tree[i]);
        if (Array.isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
//# sourceMappingURL=directive_resolver_mock.js.map