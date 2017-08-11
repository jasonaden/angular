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
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DOCUMENT } from '../dom_tokens';
import { EventManagerPlugin } from './event_manager';
var /** @type {?} */ EVENT_NAMES = {
    // pan
    'pan': true,
    'panstart': true,
    'panmove': true,
    'panend': true,
    'pancancel': true,
    'panleft': true,
    'panright': true,
    'panup': true,
    'pandown': true,
    // pinch
    'pinch': true,
    'pinchstart': true,
    'pinchmove': true,
    'pinchend': true,
    'pinchcancel': true,
    'pinchin': true,
    'pinchout': true,
    // press
    'press': true,
    'pressup': true,
    // rotate
    'rotate': true,
    'rotatestart': true,
    'rotatemove': true,
    'rotateend': true,
    'rotatecancel': true,
    // swipe
    'swipe': true,
    'swipeleft': true,
    'swiperight': true,
    'swipeup': true,
    'swipedown': true,
    // tap
    'tap': true,
};
/**
 * A DI token that you can use to provide{\@link HammerGestureConfig} to Angular. Use it to configure
 * Hammer gestures.
 *
 * \@experimental
 */
export var /** @type {?} */ HAMMER_GESTURE_CONFIG = new InjectionToken('HammerGestureConfig');
/**
 * @record
 */
export function HammerInstance() { }
function HammerInstance_tsickle_Closure_declarations() {
    /** @type {?} */
    HammerInstance.prototype.on;
    /** @type {?} */
    HammerInstance.prototype.off;
}
/**
 * \@experimental
 */
var HammerGestureConfig = (function () {
    function HammerGestureConfig() {
        this.events = [];
        this.overrides = {};
    }
    /**
     * @param {?} element
     * @return {?}
     */
    HammerGestureConfig.prototype.buildHammer = function (element) {
        var /** @type {?} */ mc = new Hammer(element);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (var /** @type {?} */ eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    };
    return HammerGestureConfig;
}());
export { HammerGestureConfig };
HammerGestureConfig.decorators = [
    { type: Injectable },
];
/** @nocollapse */
HammerGestureConfig.ctorParameters = function () { return []; };
function HammerGestureConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    HammerGestureConfig.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HammerGestureConfig.ctorParameters;
    /** @type {?} */
    HammerGestureConfig.prototype.events;
    /** @type {?} */
    HammerGestureConfig.prototype.overrides;
}
var HammerGesturesPlugin = (function (_super) {
    tslib_1.__extends(HammerGesturesPlugin, _super);
    /**
     * @param {?} doc
     * @param {?} _config
     */
    function HammerGesturesPlugin(doc, _config) {
        var _this = _super.call(this, doc) || this;
        _this._config = _config;
        return _this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.supports = function (eventName) {
        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
            return false;
        }
        if (!((window)).Hammer) {
            throw new Error("Hammer.js is not loaded, can not bind " + eventName + " event");
        }
        return true;
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    HammerGesturesPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        var /** @type {?} */ zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        return zone.runOutsideAngular(function () {
            // Creating the manager bind events, must be done outside of angular
            var /** @type {?} */ mc = _this._config.buildHammer(element);
            var /** @type {?} */ callback = function (eventObj) {
                zone.runGuarded(function () { handler(eventObj); });
            };
            mc.on(eventName, callback);
            return function () { return mc.off(eventName, callback); };
        });
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.isCustomEvent = function (eventName) { return this._config.events.indexOf(eventName) > -1; };
    return HammerGesturesPlugin;
}(EventManagerPlugin));
export { HammerGesturesPlugin };
HammerGesturesPlugin.decorators = [
    { type: Injectable },
];
/** @nocollapse */
HammerGesturesPlugin.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: HammerGestureConfig, decorators: [{ type: Inject, args: [HAMMER_GESTURE_CONFIG,] },] },
]; };
function HammerGesturesPlugin_tsickle_Closure_declarations() {
    /** @type {?} */
    HammerGesturesPlugin.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HammerGesturesPlugin.ctorParameters;
    /** @type {?} */
    HammerGesturesPlugin.prototype._config;
}
//# sourceMappingURL=hammer_gestures.js.map