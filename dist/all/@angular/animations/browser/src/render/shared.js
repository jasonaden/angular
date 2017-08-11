"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new animations_1.NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new animations_1.ɵAnimationGroupPlayer(players);
    }
}
exports.optimizeGroupPlayer = optimizeGroupPlayer;
function normalizeKeyframes(driver, normalizer, element, keyframes, preStyles, postStyles) {
    if (preStyles === void 0) { preStyles = {}; }
    if (postStyles === void 0) { postStyles = {}; }
    var errors = [];
    var normalizedKeyframes = [];
    var previousOffset = -1;
    var previousKeyframe = null;
    keyframes.forEach(function (kf) {
        var offset = kf['offset'];
        var isSameOffset = offset == previousOffset;
        var normalizedKeyframe = (isSameOffset && previousKeyframe) || {};
        Object.keys(kf).forEach(function (prop) {
            var normalizedProp = prop;
            var normalizedValue = kf[prop];
            if (prop !== 'offset') {
                normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
                switch (normalizedValue) {
                    case animations_1.ɵPRE_STYLE:
                        normalizedValue = preStyles[prop];
                        break;
                    case animations_1.AUTO_STYLE:
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
        var LINE_START = '\n - ';
        throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
    }
    return normalizedKeyframes;
}
exports.normalizeKeyframes = normalizeKeyframes;
function listenOnPlayer(player, eventName, event, callback) {
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
exports.listenOnPlayer = listenOnPlayer;
function copyAnimationEvent(e, phaseName, totalTime) {
    var event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == undefined ? e.totalTime : totalTime);
    var data = e['_data'];
    if (data != null) {
        event['_data'] = data;
    }
    return event;
}
exports.copyAnimationEvent = copyAnimationEvent;
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime) {
    if (phaseName === void 0) { phaseName = ''; }
    if (totalTime === void 0) { totalTime = 0; }
    return { element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime };
}
exports.makeAnimationEvent = makeAnimationEvent;
function getOrSetAsInMap(map, key, defaultValue) {
    var value;
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
exports.getOrSetAsInMap = getOrSetAsInMap;
function parseTimelineCommand(command) {
    var separatorPos = command.indexOf(':');
    var id = command.substring(1, separatorPos);
    var action = command.substr(separatorPos + 1);
    return [id, action];
}
exports.parseTimelineCommand = parseTimelineCommand;
var _contains = function (elm1, elm2) { return false; };
var _matches = function (element, selector) {
    return false;
};
var _query = function (element, selector, multi) {
    return [];
};
if (typeof Element != 'undefined') {
    // this is well supported in all browsers
    _contains = function (elm1, elm2) { return elm1.contains(elm2); };
    if (Element.prototype.matches) {
        _matches = function (element, selector) { return element.matches(selector); };
    }
    else {
        var proto = Element.prototype;
        var fn_1 = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector ||
            proto.oMatchesSelector || proto.webkitMatchesSelector;
        if (fn_1) {
            _matches = function (element, selector) { return fn_1.apply(element, [selector]); };
        }
    }
    _query = function (element, selector, multi) {
        var results = [];
        if (multi) {
            results.push.apply(results, element.querySelectorAll(selector));
        }
        else {
            var elm = element.querySelector(selector);
            if (elm) {
                results.push(elm);
            }
        }
        return results;
    };
}
exports.matchesElement = _matches;
exports.containsElement = _contains;
exports.invokeQuery = _query;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQWlLO0FBS2pLLDZCQUFvQyxPQUEwQjtJQUM1RCxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxnQ0FBbUIsRUFBRSxDQUFDO1FBQ25DLEtBQUssQ0FBQztZQUNKLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEI7WUFDRSxNQUFNLENBQUMsSUFBSSxrQ0FBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0FBQ0gsQ0FBQztBQVRELGtEQVNDO0FBRUQsNEJBQ0ksTUFBdUIsRUFBRSxVQUFvQyxFQUFFLE9BQVksRUFDM0UsU0FBdUIsRUFBRSxTQUEwQixFQUNuRCxVQUEyQjtJQURGLDBCQUFBLEVBQUEsY0FBMEI7SUFDbkQsMkJBQUEsRUFBQSxlQUEyQjtJQUM3QixJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsSUFBTSxtQkFBbUIsR0FBaUIsRUFBRSxDQUFDO0lBQzdDLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUksZ0JBQWdCLEdBQW9CLElBQUksQ0FBQztJQUM3QyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtRQUNsQixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFXLENBQUM7UUFDdEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLGNBQWMsQ0FBQztRQUM5QyxJQUFNLGtCQUFrQixHQUFlLENBQUMsWUFBWSxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hGLE1BQU0s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