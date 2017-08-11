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
import { CompileReflector, PipeResolver } from '@angular/compiler';
import { Compiler, Injectable, Injector } from '@angular/core';
export class MockPipeResolver extends PipeResolver {
    /**
     * @param {?} _injector
     * @param {?} refector
     */
    constructor(_injector, refector) {
        super(refector);
        this._injector = _injector;
        this._pipes = new Map();
    }
    /**
     * @return {?}
     */
    get _compiler() { return this._injector.get(Compiler); }
    /**
     * @param {?} pipe
     * @return {?}
     */
    _clearCacheFor(pipe) { this._compiler.clearCacheFor(pipe); }
    /**
     * Overrides the {\@link Pipe} for a pipe.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    setPipe(type, metadata) {
        this._pipes.set(type, metadata);
        this._clearCacheFor(type);
    }
    /**
     * Returns the {\@link Pipe} for a pipe:
     * - Set the {\@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        let /** @type {?} */ metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = ((super.resolve(type, throwIfNotFound)));
        }
        return metadata;
    }
}
MockPipeResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockPipeResolver.ctorParameters = () => [
    { type: Injector, },
    { type: CompileReflector, },
];
function MockPipeResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    MockPipeResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    MockPipeResolver.ctorParameters;
    /** @type {?} */
    MockPipeResolver.prototype._pipes;
    /** @type {?} */
    MockPipeResolver.prototype._injector;
}
//# sourceMappingURL=pipe_resolver_mock.js.map