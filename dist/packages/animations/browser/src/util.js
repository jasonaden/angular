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
import { sequence } from '@angular/animations';
export const /** @type {?} */ ONE_SECOND = 1000;
export const /** @type {?} */ SUBSTITUTION_EXPR_START = '{{';
export const /** @type {?} */ SUBSTITUTION_EXPR_END = '}}';
export const /** @type {?} */ ENTER_CLASSNAME = 'ng-enter';
export const /** @type {?} */ LEAVE_CLASSNAME = 'ng-leave';
export const /** @type {?} */ ENTER_SELECTOR = '.ng-enter';
export const /** @type {?} */ LEAVE_SELECTOR = '.ng-leave';
export const /** @type {?} */ NG_TRIGGER_CLASSNAME = 'ng-trigger';
export const /** @type {?} */ NG_TRIGGER_SELECTOR = '.ng-trigger';
export const /** @type {?} */ NG_ANIMATING_CLASSNAME = 'ng-animating';
export const /** @type {?} */ NG_ANIMATING_SELECTOR = '.ng-animating';
/**
 * @param {?} value
 * @return {?}
 */
export function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    const /** @type {?} */ matches = ((value)).match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
/**
 * @param {?} value
 * @param {?} unit
 * @return {?}
 */
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * ONE_SECOND;
        default:
            return value;
    }
}
/**
 * @param {?} timings
 * @param {?} errors
 * @param {?=} allowNegativeValues
 * @return {?}
 */
export function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ? (timings) :
        parseTimeExpression(/** @type {?} */ (timings), errors, allowNegativeValues);
}
/**
 * @param {?} exp
 * @param {?} errors
 * @param {?=} allowNegativeValues
 * @return {?}
 */
function parseTimeExpression(exp, errors, allowNegativeValues) {
    const /** @type {?} */ regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    let /** @type {?} */ duration;
    let /** @type {?} */ delay = 0;
    let /** @type {?} */ easing = '';
    if (typeof exp === 'string') {
        const /** @type {?} */ matches = exp.match(regex);
        if (matches === null) {
            errors.push(`The provided timing value "${exp}" is invalid.`);
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        const /** @type {?} */ delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(Math.floor(parseFloat(delayMatch)), matches[4]);
        }
        const /** @type {?} */ easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = (exp);
    }
    if (!allowNegativeValues) {
        let /** @type {?} */ containsErrors = false;
        let /** @type {?} */ startIndex = errors.length;
        if (duration < 0) {
            errors.push(`Duration values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push(`Delay values below 0 are not allowed for this animation step.`);
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, `The provided timing value "${exp}" is invalid.`);
        }
    }
    return { duration, delay, easing };
}
/**
 * @param {?} obj
 * @param {?=} destination
 * @return {?}
 */
export function copyObj(obj, destination = {}) {
    Object.keys(obj).forEach(prop => { destination[prop] = obj[prop]; });
    return destination;
}
/**
 * @param {?} styles
 * @return {?}
 */
export function normalizeStyles(styles) {
    const /** @type {?} */ normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(data => copyStyles(data, false, normalizedStyles));
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
/**
 * @param {?} styles
 * @param {?} readPrototype
 * @param {?=} destination
 * @return {?}
 */
export function copyStyles(styles, readPrototype, destination = {}) {
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (let /** @type {?} */ prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
/**
 * @param {?} element
 * @param {?} styles
 * @return {?}
 */
export function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(prop => {
            const /** @type {?} */ camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = styles[prop];
        });
    }
}
/**
 * @param {?} element
 * @param {?} styles
 * @return {?}
 */
export function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(prop => {
            const /** @type {?} */ camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        });
    }
}
/**
 * @param {?} steps
 * @return {?}
 */
export function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return sequence(steps);
    }
    return (steps);
}
/**
 * @param {?} value
 * @param {?} options
 * @param {?} errors
 * @return {?}
 */
export function validateStyleParams(value, options, errors) {
    const /** @type {?} */ params = options.params || {};
    const /** @type {?} */ matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach(varName => {
            if (!params.hasOwnProperty(varName)) {
                errors.push(`Unable to resolve the local animation param ${varName} in the given list of values`);
            }
        });
    }
}
const /** @type {?} */ PARAM_REGEX = new RegExp(`${SUBSTITUTION_EXPR_START}\\s*(.+?)\\s*${SUBSTITUTION_EXPR_END}`, 'g');
/**
 * @param {?} value
 * @return {?}
 */
export function extractStyleParams(value) {
    let /** @type {?} */ params = [];
    if (typeof value === 'string') {
        const /** @type {?} */ val = value.toString();
        let /** @type {?} */ match;
        while (match = PARAM_REGEX.exec(val)) {
            params.push(/** @type {?} */ (match[1]));
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
/**
 * @param {?} value
 * @param {?} params
 * @param {?} errors
 * @return {?}
 */
export function interpolateParams(value, params, errors) {
    const /** @type {?} */ original = value.toString();
    const /** @type {?} */ str = original.replace(PARAM_REGEX, (_, varName) => {
        let /** @type {?} */ localVal = params[varName];
        // this means that the value was never overidden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push(`Please provide a value for the animation param ${varName}`);
            localVal = '';
        }
        return localVal.toString();
    });
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
/**
 * @param {?} iterator
 * @return {?}
 */
export function iteratorToArray(iterator) {
    const /** @type {?} */ arr = [];
    let /** @type {?} */ item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
/**
 * @param {?} source
 * @param {?} destination
 * @return {?}
 */
export function mergeAnimationOptions(source, destination) {
    if (source.params) {
        const /** @type {?} */ p0 = source.params;
        if (!destination.params) {
            destination.params = {};
        }
        const /** @type {?} */ p1 = destination.params;
        Object.keys(p0).forEach(param => {
            if (!p1.hasOwnProperty(param)) {
                p1[param] = p0[param];
            }
        });
    }
    return destination;
}
const /** @type {?} */ DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */
export function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
/**
 * @param {?} duration
 * @param {?} delay
 * @return {?}
 */
export function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
//# sourceMappingURL=util.js.map