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
import { Inject, Injectable, NgZone, ɵglobal as global } from '@angular/core';
import { DOCUMENT } from '../dom_tokens';
import { EventManagerPlugin } from './event_manager';
/**
 * Detect if Zone is present. If it is then bypass 'addEventListener' since Angular can do much more
 * efficient bookkeeping than Zone can, because we have additional information. This speeds up
 * addEventListener by 3x.
 */
var /** @type {?} */ Zone = global['Zone'];
var /** @type {?} */ __symbol__ = Zone && Zone['__symbol__'] || function (v) {
    return v;
};
var /** @type {?} */ ADD_EVENT_LISTENER = __symbol__('addEventListener');
var /** @type {?} */ REMOVE_EVENT_LISTENER = __symbol__('removeEventListener');
var DomEventsPlugin = (function (_super) {
    tslib_1.__extends(DomEventsPlugin, _super);
    /**
     * @param {?} doc
     * @param {?} ngZone
     */
    function DomEventsPlugin(doc, ngZone) {
        var _this = _super.call(this, doc) || this;
        _this.ngZone = ngZone;
        return _this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    DomEventsPlugin.prototype.supports = function (eventName) { return true; };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    DomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        /**
         * This code is about to add a listener to the DOM. If Zone.js is present, than
         * `addEventListener` has been patched. The patched code adds overhead in both
         * memory and speed (3x slower) than native. For this reason if we detect that
         * Zone.js is present we bypass zone and use native addEventListener instead.
         * The result is faster registration but the zone will not be restored. We do
         * manual zone restoration in element.ts renderEventHandlerClosure method.
         *
         * NOTE: it is possible that the element is from different iframe, and so we
         * have to check before we execute the method.
         */
        var /** @type {?} */ self = this;
        var /** @type {?} */ byPassZoneJS = element[ADD_EVENT_LISTENER];
        var /** @type {?} */ callback = (handler);
        if (byPassZoneJS) {
            callback = function () {
                return self.ngZone.runTask(/** @type {?} */ (handler), null, /** @type {?} */ (arguments), eventName);
            };
        }
        element[byPassZoneJS ? ADD_EVENT_LISTENER : 'addEventListener'](eventName, callback, false);
        return function () { return element[byPassZoneJS ? REMOVE_EVENT_LISTENER : 'removeEventListener'](eventName, /** @type {?} */ (callback), false); };
    };
    return DomEventsPlugin;
}(EventManagerPlugin));
export { DomEventsPlugin };
DomEventsPlugin.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DomEventsPlugin.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: NgZone, },
]; };
function DomEventsPlugin_tsickle_Closure_declarations() {
    /** @type {?} */
    DomEventsPlugin.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DomEventsPlugin.ctorParameters;
    /** @type {?} */
    DomEventsPlugin.prototype.ngZone;
}
//# sourceMappingURL=dom_events.js.map