/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { containsElement, invokeQuery, matchesElement } from '../shared';
import { WebAnimationsPlayer } from './web_animations_player';
export class WebAnimationsDriver {
    /**
     * @param {?} element
     * @param {?} selector
     * @return {?}
     */
    matchesElement(element, selector) {
        return matchesElement(element, selector);
    }
    /**
     * @param {?} elm1
     * @param {?} elm2
     * @return {?}
     */
    containsElement(elm1, elm2) { return containsElement(elm1, elm2); }
    /**
     * @param {?} element
     * @param {?} selector
     * @param {?} multi
     * @return {?}
     */
    query(element, selector, multi) {
        return invokeQuery(element, selector, multi);
    }
    /**
     * @param {?} element
     * @param {?} prop
     * @param {?=} defaultValue
     * @return {?}
     */
    computeStyle(element, prop, defaultValue) {
        return (((window.getComputedStyle(element)))[prop]);
    }
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    animate(element, keyframes, duration, delay, easing, previousPlayers = []) {
        const /** @type {?} */ fill = delay == 0 ? 'both' : 'forwards';
        const /** @type {?} */ playerOptions = { duration, delay, fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        const /** @type {?} */ previousWebAnimationPlayers = (previousPlayers.filter(player => { return player instanceof WebAnimationsPlayer; }));
        return new WebAnimationsPlayer(element, keyframes, playerOptions, previousWebAnimationPlayers);
    }
}
/**
 * @return {?}
 */
export function supportsWebAnimations() {
    return typeof Element !== 'undefined' && typeof ((Element)).prototype['animate'] === 'function';
}
//# sourceMappingURL=web_animations_driver.js.map