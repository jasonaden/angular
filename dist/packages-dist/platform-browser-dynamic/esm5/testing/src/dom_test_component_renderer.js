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
import { Inject, Injectable } from '@angular/core';
import { TestComponentRenderer } from '@angular/core/testing';
import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/platform-browser';
/**
 * A DOM based implementation of the TestComponentRenderer.
 */
var DOMTestComponentRenderer = (function (_super) {
    tslib_1.__extends(DOMTestComponentRenderer, _super);
    /**
     * @param {?} _doc
     */
    function DOMTestComponentRenderer(_doc /** TODO #9100 */) {
        var _this = _super.call(this) || this;
        _this._doc = _doc; /** TODO #9100 */
        return _this;
    }
    /**
     * @param {?} rootElId
     * @return {?}
     */
    DOMTestComponentRenderer.prototype.insertRootElement = function (rootElId) {
        var /** @type {?} */ rootEl = (getDOM().firstChild(getDOM().content(getDOM().createTemplate("<div id=\"" + rootElId + "\"></div>"))));
        // TODO(juliemr): can/should this be optional?
        var /** @type {?} */ oldRoots = getDOM().querySelectorAll(this._doc, '[id^=root]');
        for (var /** @type {?} */ i = 0; i < oldRoots.length; i++) {
            getDOM().remove(oldRoots[i]);
        }
        getDOM().appendChild(this._doc.body, rootEl);
    };
    return DOMTestComponentRenderer;
}(TestComponentRenderer));
export { DOMTestComponentRenderer };
DOMTestComponentRenderer.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DOMTestComponentRenderer.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
]; };
function DOMTestComponentRenderer_tsickle_Closure_declarations() {
    /** @type {?} */
    DOMTestComponentRenderer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DOMTestComponentRenderer.ctorParameters;
    /** @type {?} */
    DOMTestComponentRenderer.prototype._doc;
}
//# sourceMappingURL=dom_test_component_renderer.js.map