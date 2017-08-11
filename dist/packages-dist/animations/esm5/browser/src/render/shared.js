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
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
/**
 * @param {?} players
 * @return {?}
 */
export function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new ɵAnimationGroupPlayer(players);
    }
}
/**
 * @param {?} driver
 * @param {?} normalizer
 * @param {?} element
 * @param {?} keyframes
 * @param {?=} preStyles
 * @param {?=} postStyles
 * @return {?}
 */
export function normalizeKeyframes(driver, normalizer, element, keyframes, preStyles, postStyles) {
    if (preStyles === void 0) { preStyles = {}; }
    if (postStyles === void 0) { postStyles = {}; }
    var /** @type {?} */ errors = [];
    var /** @type {?} */ normalizedKeyframes = [];
    var /** @type {?} */ previousOffset = -1;
    var /** @type {?} */ previousKeyframe = null;
    keyframes.forEach(function (kf) {
        var /** @type {?} */ offset = (kf['offset']);
        var /** @type {?} */ isSameOffset = offset == previousOffset;
        var /** @type {?} */ normalizedKeyframe = (isSameOffset && previousKeyframe) || {};
        Object.keys(kf).forEach(function (prop) {
            var /** @type {?} */ normalizedProp = prop;
            var /** @type {?} */ normalizedValue = kf[prop];
            if (prop !== 'offset') {
                normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
                switch (normalizedValue) {
                    case PRE_STYLE:
                        normalizedValue = preStyles[prop];
                        break;
                    case AUTO_STYLE:
                        normalizedValue = postStyles[prop];
                        break;
                    default:
                        normalizedValue =
                            normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
                        break;
                }
            }
            normalizedKeyframe[normalizedProp] = normalizedValue;
        });
        if (!isSameOffset) {
            normalizedKeyframes.push(normalizedKeyframe);
        }
        previousKeyframe = normalizedKeyframe;
        previousOffset = offset;
    });
    if (errors.length) {
        var /** @type {?} */ LINE_START = '\n - ';
        throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
    }
    return normalizedKeyframes;
}
/**
 * @param {?} player
 * @param {?} eventName
 * @param {?} event
 * @param {?} callback
 * @return {?}
 */
export function listenOnPlayer(player, eventName, event, callback) {
    switch (eventName) {
        case 'start':
            player.onStart(function () { return callback(event && copyAnimationEvent(event, 'start', player.totalTime)); });
            break;
        case 'done':
            player.onDone(function () { return callback(event && copyAnimationEvent(event, 'done', player.totalTime)); });
            break;
        case 'destroy':
            player.onDestroy(function () { return callback(event && copyAnimationEvent(event, 'destroy', player.totalTime)); });
            break;
    }
}
/**
 * @param {?} e
 * @param {?=} phaseName
 * @param {?=} totalTime
 * @return {?}
 */
export function copyAnimationEvent(e, phaseName, totalTime) {
    var /** @type {?} */ event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == undefined ? e.totalTime : totalTime);
    var /** @type {?} */ data = ((e))['_data'];
    if (data != null) {
        ((event))['_data'] = data;
    }
    return event;
}
/**
 * @param {?} element
 * @param {?} triggerName
 * @param {?} fromState
 * @param {?} toState
 * @param {?=} phaseName
 * @param {?=} totalTime
 * @return {?}
 */
export function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime) {
    if (phaseName === void 0) { phaseName = ''; }
    if (totalTime === void 0) { totalTime = 0; }
    return { element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime };
}
/**
 * @param {?} map
 * @param {?} key
 * @param {?} defaultValue
 * @return {?}
 */
export function getOrSetAsInMap(map, key, defaultValue) {
    var /** @type {?} */ value;
    if (map instanceof Map) {
        value = map.get(key);
        if (!value) {
            map.set(key, value = defaultValue);
        }
    }
    else {
        value = map[key];
        if (!value) {
            value = map[key] = defaultValue;
        }
    }
    return value;
}
/**
 * @param {?} command
 * @return {?}
 */
export function parseTimelineCommand(command) {
    var /** @type {?} */ separatorPos = command.indexOf(':');
    var /** @type {?} */ id = command.substring(1, separatorPos);
    var /** @type {?} */ action = command.substr(separatorPos + 1);
    return [id, action];
}
var /** @type {?} */ _contains = function (elm1, elm2) { return false; };
var /** @type {?} */ _matches = function (element, selector) {
    return false;
};
var /** @type {?} */ _query = function (element, selector, multi) {
    return [];
};
if (typeof Element != 'undefined') {
    // this is well supported in all browsers
    _contains = function (elm1, elm2) { return (elm1.contains(elm2)); };
    if (Element.prototype.matches) {
        _matches = function (element, selector) { return element.matches(selector); };
    }
    else {
        var /** @type {?} */ proto = (Element.prototype);
        var /** @type {?} */ fn_1 = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector ||
            proto.oMatchesSelector || proto.webkitMatchesSelector;
        if (fn_1) {
            _matches = function (element, selector) { return fn_1.apply(element, [selector]); };
        }
    }
    _query = function (element, selector, multi) {
        var /** @type {?} */ results = [];
        if (multi) {
            results.push.apply(results, element.querySelectorAll(selector));
        }
        else {
            var /** @type {?} */ elm = element.querySelector(selector);
            if (elm) {
                results.push(elm);
            }
        }
        return results;
    };
}
export var /** @type {?} */ matchesElement = _matches;
export var /** @type {?} */ containsElement = _contains;
export var /** @type {?} */ invokeQuery = _query;
//# sourceMappingURL=shared.js.map