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
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */ export const /** @type {?} */ ANY_STATE = '*';
/**
 * @param {?} transitionValue
 * @param {?} errors
 * @return {?}
 */
export function parseTransitionExpr(transitionValue, errors) {
    const /** @type {?} */ expressions = [];
    if (typeof transitionValue == 'string') {
        ((transitionValue))
            .split(/\s*,\s*/)
            .forEach(str => parseInnerTransitionStr(str, expressions, errors));
    }
    else {
        expressions.push(/** @type {?} */ (transitionValue));
    }
    return expressions;
}
/**
 * @param {?} eventStr
 * @param {?} expressions
 * @param {?} errors
 * @return {?}
 */
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        const /** @type {?} */ result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = (result);
    }
    const /** @type {?} */ match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push(`The provided transition expression "${eventStr}" is not supported`);
        return expressions;
    }
    const /** @type {?} */ fromState = match[1];
    const /** @type {?} */ separator = match[2];
    const /** @type {?} */ toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    const /** @type {?} */ isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
/**
 * @param {?} alias
 * @param {?} errors
 * @return {?}
 */
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return (fromState, toState) => parseFloat(toState) > parseFloat(fromState);
        case ':decrement':
            return (fromState, toState) => parseFloat(toState) < parseFloat(fromState);
        default:
            errors.push(`The transition alias value "${alias}" is not supported`);
            return '* => *';
    }
}
/**
 * @param {?} lhs
 * @param {?} rhs
 * @return {?}
 */
function makeLambdaFromStates(lhs, rhs) {
    return (fromState, toState) => {
        let /** @type {?} */ lhsMatch = lhs == ANY_STATE || lhs == fromState;
        let /** @type {?} */ rhsMatch = rhs == ANY_STATE || rhs == toState;
        if (!lhsMatch && typeof fromState === 'boolean') {
            lhsMatch = fromState ? lhs === 'true' : lhs === 'false';
        }
        if (!rhsMatch && typeof toState === 'boolean') {
            rhsMatch = toState ? rhs === 'true' : rhs === 'false';
        }
        return lhsMatch && rhsMatch;
    };
}
//# sourceMappingURL=animation_transition_expr.js.map