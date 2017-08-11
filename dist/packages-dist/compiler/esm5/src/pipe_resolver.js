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
import { Pipe, resolveForwardRef, ɵstringify as stringify } from '@angular/core';
import { CompileReflector } from './compile_reflector';
import { findLast } from './directive_resolver';
import { CompilerInjectable } from './injectable';
/**
 * @param {?} type
 * @return {?}
 */
function _isPipeMetadata(type) {
    return type instanceof Pipe;
}
/**
 * Resolve a `Type` for {\@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {\@link Compiler}
 */
var PipeResolver = (function () {
    /**
     * @param {?} _reflector
     */
    function PipeResolver(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    PipeResolver.prototype.isPipe = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(_isPipeMetadata);
    };
    /**
     * Return {\@link Pipe} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metas = this._reflector.annotations(resolveForwardRef(type));
        if (metas) {
            var /** @type {?} */ annotation = findLast(metas, _isPipeMetadata);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Pipe decorator found on " + stringify(type));
        }
        return null;
    };
    return PipeResolver;
}());
export { PipeResolver };
PipeResolver.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
PipeResolver.ctorParameters = function () { return [
    { type: CompileReflector, },
]; };
function PipeResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    PipeResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PipeResolver.ctorParameters;
    /** @type {?} */
    PipeResolver.prototype._reflector;
}
//# sourceMappingURL=pipe_resolver.js.map