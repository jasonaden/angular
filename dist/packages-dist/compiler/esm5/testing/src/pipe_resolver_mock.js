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
import { CompileReflector, PipeResolver } from '@angular/compiler';
import { Compiler, Injectable, Injector } from '@angular/core';
var MockPipeResolver = (function (_super) {
    tslib_1.__extends(MockPipeResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} refector
     */
    function MockPipeResolver(_injector, refector) {
        var _this = _super.call(this, refector) || this;
        _this._injector = _injector;
        _this._pipes = new Map();
        return _this;
    }
    Object.defineProperty(MockPipeResolver.prototype, "_compiler", {
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} pipe
     * @return {?}
     */
    MockPipeResolver.prototype._clearCacheFor = function (pipe) { this._compiler.clearCacheFor(pipe); };
    /**
     * Overrides the {\@link Pipe} for a pipe.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockPipeResolver.prototype.setPipe = function (type, metadata) {
        this._pipes.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {\@link Pipe} for a pipe:
     * - Set the {\@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockPipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
        }
        return metadata;
    };
    return MockPipeResolver;
}(PipeResolver));
export { MockPipeResolver };
MockPipeResolver.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockPipeResolver.ctorParameters = function () { return [
    { type: Injector, },
    { type: CompileReflector, },
]; };
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