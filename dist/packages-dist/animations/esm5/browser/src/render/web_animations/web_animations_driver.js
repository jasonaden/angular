/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { containsElement, invokeQuery, matchesElement } from '../shared';
import { WebAnimationsPlayer } from './web_animations_player';
var WebAnimationsDriver = (function () {
    function WebAnimationsDriver() {
    }
    /**
     * @param {?} element
     * @param {?} selector
     * @return {?}
     */
    WebAnimationsDriver.prototype.matchesElement = function (element, selector) {
        return matchesElement(element, selector);
    };
    /**
     * @param {?} elm1
     * @param {?} elm2
     * @return {?}
     */
    WebAnimationsDriver.prototype.containsElement = function (elm1, elm2) { return containsElement(elm1, elm2); };
    /**
     * @param {?} element
     * @param {?} selector
     * @param {?} multi
     * @return {?}
     */
    WebAnimationsDriver.prototype.query = function (element, selector, multi) {
        return invokeQuery(element, selector, multi);
    };
    /**
     * @param {?} element
     * @param {?} prop
     * @param {?=} defaultValue
     * @return {?}
     */
    WebAnimationsDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return (((window.getComputedStyle(element)))[prop]);
    };
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var /** @type {?} */ fill = delay == 0 ? 'both' : 'forwards';
        var /** @type {?} */ playerOptions = { duration: duration, delay: delay, fill: fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var /** @type {?} */ previousWebAnimationPlayers = (previousPlayers.filter(function (player) { return player instanceof WebAnimationsPlayer; }));
        return new WebAnimationsPlayer(element, keyframes, playerOptions, previousWebAnimationPlayers);
    };
    return WebAnimationsDriver;
}());
export { WebAnimationsDriver };
/**
 * @return {?}
 */
export function supportsWebAnimations() {
    return typeof Element !== 'undefined' && typeof ((Element)).prototype['animate'] === 'function';
}
//# sourceMappingURL=web_animations_driver.js.map