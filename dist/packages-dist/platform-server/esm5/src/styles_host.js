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
import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT, ɵSharedStylesHost as SharedStylesHost, ɵTRANSITION_ID, ɵgetDOM as getDOM } from '@angular/platform-browser';
var ServerStylesHost = (function (_super) {
    tslib_1.__extends(ServerStylesHost, _super);
    /**
     * @param {?} doc
     * @param {?} transitionId
     */
    function ServerStylesHost(doc, transitionId) {
        var _this = _super.call(this) || this;
        _this.doc = doc;
        _this.transitionId = transitionId;
        _this.head = null;
        _this.head = getDOM().getElementsByTagName(doc, 'head')[0];
        return _this;
    }
    /**
     * @param {?} style
     * @return {?}
     */
    ServerStylesHost.prototype._addStyle = function (style) {
        var /** @type {?} */ adapter = (getDOM());
        var /** @type {?} */ el = adapter.createElement('style');
        adapter.setText(el, style);
        if (!!this.transitionId) {
            adapter.setAttribute(el, 'ng-transition', this.transitionId);
        }
        adapter.appendChild(this.head, el);
    };
    /**
     * @param {?} additions
     * @return {?}
     */
    ServerStylesHost.prototype.onStylesAdded = function (additions) {
        var _this = this;
        additions.forEach(function (style) { return _this._addStyle(style); });
    };
    return ServerStylesHost;
}(SharedStylesHost));
export { ServerStylesHost };
ServerStylesHost.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServerStylesHost.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ɵTRANSITION_ID,] },] },
]; };
function ServerStylesHost_tsickle_Closure_declarations() {
    /** @type {?} */
    ServerStylesHost.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ServerStylesHost.ctorParameters;
    /** @type {?} */
    ServerStylesHost.prototype.head;
    /** @type {?} */
    ServerStylesHost.prototype.doc;
    /** @type {?} */
    ServerStylesHost.prototype.transitionId;
}
//# sourceMappingURL=styles_host.js.map