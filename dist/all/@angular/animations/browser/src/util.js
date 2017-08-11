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
exports.ONE_SECOND = 1000;
exports.SUBSTITUTION_EXPR_START = '{{';
exports.SUBSTITUTION_EXPR_END = '}}';
exports.ENTER_CLASSNAME = 'ng-enter';
exports.LEAVE_CLASSNAME = 'ng-leave';
exports.ENTER_SELECTOR = '.ng-enter';
exports.LEAVE_SELECTOR = '.ng-leave';
exports.NG_TRIGGER_CLASSNAME = 'ng-trigger';
exports.NG_TRIGGER_SELECTOR = '.ng-trigger';
exports.NG_ANIMATING_CLASSNAME = 'ng-animating';
exports.NG_ANIMATING_SELECTOR = '.ng-animating';
function resolveTimingValue(value) {
    if (typeof value == 'number')
        return value;
    var matches = value.match(/^(-?[\.\d]+)(m?s)/);
    if (!matches || matches.length < 2)
        return 0;
    return _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
}
exports.resolveTimingValue = resolveTimingValue;
function _convertTimeValueToMS(value, unit) {
    switch (unit) {
        case 's':
            return value * exports.ONE_SECOND;
        default:
            return value;
    }
}
function resolveTiming(timings, errors, allowNegativeValues) {
    return timings.hasOwnProperty('duration') ?
        timings :
        parseTimeExpression(timings, errors, allowNegativeValues);
}
exports.resolveTiming = resolveTiming;
function parseTimeExpression(exp, errors, allowNegativeValues) {
    var regex = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    var duration;
    var delay = 0;
    var easing = '';
    if (typeof exp === 'string') {
        var matches = exp.match(regex);
        if (matches === null) {
            errors.push("The provided timing value \"" + exp + "\" is invalid.");
            return { duration: 0, delay: 0, easing: '' };
        }
        duration = _convertTimeValueToMS(parseFloat(matches[1]), matches[2]);
        var delayMatch = matches[3];
        if (delayMatch != null) {
            delay = _convertTimeValueToMS(Math.floor(parseFloat(delayMatch)), matches[4]);
        }
        var easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = exp;
    }
    if (!allowNegativeValues) {
        var containsErrors = false;
        var startIndex = errors.length;
        if (duration < 0) {
            errors.push("Duration values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (delay < 0) {
            errors.push("Delay values below 0 are not allowed for this animation step.");
            containsErrors = true;
        }
        if (containsErrors) {
            errors.splice(startIndex, 0, "The provided timing value \"" + exp + "\" is invalid.");
        }
    }
    return { duration: duration, delay: delay, easing: easing };
}
function copyObj(obj, destination) {
    if (destination === void 0) { destination = {}; }
    Object.keys(obj).forEach(function (prop) { destination[prop] = obj[prop]; });
    return destination;
}
exports.copyObj = copyObj;
function normalizeStyles(styles) {
    var normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(function (data) { return copyStyles(data, false, normalizedStyles); });
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
exports.normalizeStyles = normalizeStyles;
function copyStyles(styles, readPrototype, destination) {
    if (destination === void 0) { destination = {}; }
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (var prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        copyObj(styles, destination);
    }
    return destination;
}
exports.copyStyles = copyStyles;
function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = styles[prop];
        });
    }
}
exports.setStyles = setStyles;
function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            var camelProp = dashCaseToCamelCase(prop);
            element.style[camelProp] = '';
        });
    }
}
exports.eraseStyles = eraseStyles;
function normalizeAnimationEntry(steps) {
    if (Array.isArray(steps)) {
        if (steps.length == 1)
            return steps[0];
        return animations_1.sequence(steps);
    }
    return steps;
}
exports.normalizeAnimationEntry = normalizeAnimationEntry;
function validateStyleParams(value, options, errors) {
    var params = options.params || {};
    var matches = extractStyleParams(value);
    if (matches.length) {
        matches.forEach(function (varName) {
            if (!params.hasOwnProperty(varName)) {
                errors.push("Unable to resolve the local animation param " + varName + " in the given list of values");
            }
        });
    }
}
exports.validateStyleParams = validateStyleParams;
var PARAM_REGEX = new RegExp(exports.SUBSTITUTION_EXPR_START + "\\s*(.+?)\\s*" + exports.SUBSTITUTION_EXPR_END, 'g');
function extractStyleParams(value) {
    var params = [];
    if (typeof value === 'string') {
        var val = value.toString();
        var match = void 0;
        while (match = PARAM_REGEX.exec(val)) {
            params.push(match[1]);
        }
        PARAM_REGEX.lastIndex = 0;
    }
    return params;
}
exports.extractStyleParams = extractStyleParams;
function interpolateParams(value, params, errors) {
    var original = value.toString();
    var str = original.replace(PARAM_REGEX, function (_, varName) {
        var localVal = params[varName];
        // this means that the value was never overidden by the data passed in by the user
        if (!params.hasOwnProperty(varName)) {
            errors.push("Please provide a value for the animation param " + varName);
            localVal = '';
        }
        return localVal.toString();
    });
    // we do this to assert that numeric values stay as they are
    return str == original ? value : str;
}
exports.interpolateParams = interpolateParams;
function iteratorToArray(iterator) {
    var arr = [];
    var item = iterator.next();
    while (!item.done) {
        arr.push(item.value);
        item = iterator.next();
    }
    return arr;
}
exports.iteratorToArray = iteratorToArray;
function mergeAnimationOptions(source, destination) {
    if (source.params) {
        var p0_1 = source.params;
        if (!destination.params) {
            destination.params = {};
        }
        var p1_1 = destination.params;
        Object.keys(p0_1).forEach(function (param) {
            if (!p1_1.hasOwnProperty(param)) {
                p1_1[param] = p0_1[param];
            }
        });
    }
    return destination;
}
exports.mergeAnimationOptions = mergeAnimationOptions;
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function allowPreviousPlayerStylesMerge(duration, delay) {
    return duration === 0 || delay === 0;
}
exports.allowPreviousPlayerStylesMerge = allowPreviousPlayerStylesMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGtEQUE4RztBQUVqRyxRQUFBLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFFbEIsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7QUFDL0IsUUFBQSxxQkFBcUIsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBQSxlQUFlLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFFBQUEsZUFBZSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFBLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFDN0IsUUFBQSxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBQzdCLFFBQUEsb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLFFBQUEsbUJBQW1CLEdBQUcsYUFBYSxDQUFDO0FBQ3BDLFFBQUEsc0JBQXNCLEdBQUcsY0FBYyxDQUFDO0FBQ3hDLFFBQUEscUJBQXFCLEdBQUcsZUFBZSxDQUFDO0FBRXJELDRCQUFtQyxLQUFzQjtJQUN2RCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBRTNDLElBQU0sT0FBTyxHQUFJLEtBQWdCLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQVBELGdEQU9DO0FBRUQsK0JBQStCLEtBQWEs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