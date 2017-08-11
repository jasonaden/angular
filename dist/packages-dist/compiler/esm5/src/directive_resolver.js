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
import { Component, Directive, HostBinding, HostListener, Input, Output, Query, resolveForwardRef, ɵstringify as stringify } from '@angular/core';
import { CompileReflector } from './compile_reflector';
import { CompilerInjectable } from './injectable';
import { splitAtColon } from './util';
var DirectiveResolver = (function () {
    /**
     * @param {?} _reflector
     */
    function DirectiveResolver(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    DirectiveResolver.prototype.isDirective = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            var /** @type {?} */ metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                var /** @type {?} */ propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + stringify(type));
        }
        return null;
    };
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
        var /** @type {?} */ inputs = [];
        var /** @type {?} */ outputs = [];
        var /** @type {?} */ host = {};
        var /** @type {?} */ queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            var /** @type {?} */ input = findLast(propertyMetadata[propName], function (a) { return a instanceof Input; });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            var /** @type {?} */ output = findLast(propertyMetadata[propName], function (a) { return a instanceof Output; });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            var /** @type {?} */ hostBindings = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostBinding; });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
                    var /** @type {?} */ startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                    }
                    else if (startWith === '[') {
                        throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                    }
                    host["[" + hostBinding.hostPropertyName + "]"] = propName;
                }
                else {
                    host["[" + propName + "]"] = propName;
                }
            });
            var /** @type {?} */ hostListeners = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostListener; });
            hostListeners.forEach(function (hostListener) {
                var /** @type {?} */ args = hostListener.args || [];
                host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
            });
            var /** @type {?} */ query = findLast(propertyMetadata[propName], function (a) { return a instanceof Query; });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    };
    /**
     * @param {?} def
     * @return {?}
     */
    DirectiveResolver.prototype._extractPublicName = function (def) { return splitAtColon(def, [/** @type {?} */ ((null)), def])[1].trim(); };
    /**
     * @param {?} bindings
     * @return {?}
     */
    DirectiveResolver.prototype._dedupeBindings = function (bindings) {
        var /** @type {?} */ names = new Set();
        var /** @type {?} */ reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var /** @type {?} */ i = bindings.length - 1; i >= 0; i--) {
            var /** @type {?} */ binding = bindings[i];
            var /** @type {?} */ name_1 = this._extractPublicName(binding);
            if (!names.has(name_1)) {
                names.add(name_1);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, directiveType) {
        var /** @type {?} */ mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var /** @type {?} */ mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var /** @type {?} */ mergedHost = directive.host ? tslib_1.__assign({}, directive.host, host) : host;
        var /** @type {?} */ mergedQueries = directive.queries ? tslib_1.__assign({}, directive.queries, queries) : queries;
        if (directive instanceof Component) {
            return new Component({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                moduleId: directive.moduleId,
                queries: mergedQueries,
                changeDetection: directive.changeDetection,
                providers: directive.providers,
                viewProviders: directive.viewProviders,
                entryComponents: directive.entryComponents,
                template: directive.template,
                templateUrl: directive.templateUrl,
                styles: directive.styles,
                styleUrls: directive.styleUrls,
                encapsulation: directive.encapsulation,
                animations: directive.animations,
                interpolation: directive.interpolation
            });
        }
        else {
            return new Directive({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                queries: mergedQueries,
                providers: directive.providers
            });
        }
    };
    return DirectiveResolver;
}());
export { DirectiveResolver };
DirectiveResolver.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
DirectiveResolver.ctorParameters = function () { return [
    { type: CompileReflector, },
]; };
function DirectiveResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DirectiveResolver.ctorParameters;
    /** @type {?} */
    DirectiveResolver.prototype._reflector;
}
/**
 * @param {?} type
 * @return {?}
 */
function isDirectiveMetadata(type) {
    return type instanceof Directive;
}
/**
 * @template T
 * @param {?} arr
 * @param {?} condition
 * @return {?}
 */
export function findLast(arr, condition) {
    for (var /** @type {?} */ i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
//# sourceMappingURL=directive_resolver.js.map