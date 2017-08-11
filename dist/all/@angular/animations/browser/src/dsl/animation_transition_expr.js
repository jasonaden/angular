"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
exports.ANY_STATE = '*';
function parseTransitionExpr(transitionValue, errors) {
    var expressions = [];
    if (typeof transitionValue == 'string') {
        transitionValue
            .split(/\s*,\s*/)
            .forEach(function (str) { return parseInnerTransitionStr(str, expressions, errors); });
    }
    else {
        expressions.push(transitionValue);
    }
    return expressions;
}
exports.parseTransitionExpr = parseTransitionExpr;
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        var result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = result;
    }
    var match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push("The provided transition expression \"" + eventStr + "\" is not supported");
        return expressions;
    }
    var fromState = match[1];
    var separator = match[2];
    var toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    var isFullAnyStateExpr = fromState == exports.ANY_STATE && toState == exports.ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return function (fromState, toState) { return parseFloat(toState) > parseFloat(fromState); };
        case ':decrement':
            return function (fromState, toState) { return parseFloat(toState) < parseFloat(fromState); };
        default:
            errors.push("The transition alias value \"" + alias + "\" is not supported");
            return '* => *';
    }
}
function makeLambdaFromStates(lhs, rhs) {
    return function (fromState, toState) {
        var lhsMatch = lhs == exports.ANY_STATE || lhs == fromState;
        var rhsMatch = rhs == exports.ANY_STATE || rhs == toState;
        if (!lhsMatch && typeof fromState === 'boolean') {
            lhsMatch = fromState ? lhs === 'true' : lhs === 'false';
        }
        if (!rhsMatch && typeof toState === 'boolean') {
            rhsMatch = toState ? rhs === 'true' : rhs === 'false';
        }
        return lhsMatch && rhsMatch;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZXhwci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2V4cHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDVSxRQUFBLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFHN0IsNkJBQ0ksZUFBNkMsRUFBRSxNQUFnQjtJQUNqRSxJQUFNLFdBQVcsR0FBMEIsRUFBRSxDQUFDO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sZUFBZSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUIsZUFBZ0I7YUFDcEIsS0FBSyxDQUFDLFNBQVMsQ0FBQzthQUNoQixPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sV0FBVyxDQUFDLElBQUksQ0FBc0IsZUFBZSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQVhELGtEQVdDO0FBRUQsaUNBQ0ksUUFBZ0IsRUFBRSxXQUFrQyxFQUFFLE1BQWdCO0lBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDO1FB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