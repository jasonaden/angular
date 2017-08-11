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
import { ɵisPromise as isPromise } from '@angular/core';
export const /** @type {?} */ MODULE_SUFFIX = '';
const /** @type {?} */ CAMEL_CASE_REGEXP = /([A-Z])/g;
const /** @type {?} */ DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */
export function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, (...m) => '-' + m[1].toLowerCase());
}
/**
 * @param {?} input
 * @return {?}
 */
export function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
}
/**
 * @param {?} input
 * @param {?} defaultValues
 * @return {?}
 */
export function splitAtColon(input, defaultValues) {
    return _splitAt(input, ':', defaultValues);
}
/**
 * @param {?} input
 * @param {?} defaultValues
 * @return {?}
 */
export function splitAtPeriod(input, defaultValues) {
    return _splitAt(input, '.', defaultValues);
}
/**
 * @param {?} input
 * @param {?} character
 * @param {?} defaultValues
 * @return {?}
 */
function _splitAt(input, character, defaultValues) {
    const /** @type {?} */ characterIndex = input.indexOf(character);
    if (characterIndex == -1)
        return defaultValues;
    return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
/**
 * @param {?} value
 * @param {?} visitor
 * @param {?} context
 * @return {?}
 */
export function visitValue(value, visitor, context) {
    if (Array.isArray(value)) {
        return visitor.visitArray(/** @type {?} */ (value), context);
    }
    if (isStrictStringMap(value)) {
        return visitor.visitStringMap(/** @type {?} */ (value), context);
    }
    if (value == null || typeof value == 'string' || typeof value == 'number' ||
        typeof value == 'boolean') {
        return visitor.visitPrimitive(value, context);
    }
    return visitor.visitOther(value, context);
}
/**
 * @param {?} val
 * @return {?}
 */
export function isDefined(val) {
    return val !== null && val !== undefined;
}
/**
 * @template T
 * @param {?} val
 * @return {?}
 */
export function noUndefined(val) {
    return val === undefined ? ((null)) : val;
}
/**
 * @record
 */
export function ValueVisitor() { }
function ValueVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    ValueVisitor.prototype.visitArray;
    /** @type {?} */
    ValueVisitor.prototype.visitStringMap;
    /** @type {?} */
    ValueVisitor.prototype.visitPrimitive;
    /** @type {?} */
    ValueVisitor.prototype.visitOther;
}
export class ValueTransformer {
    /**
     * @param {?} arr
     * @param {?} context
     * @return {?}
     */
    visitArray(arr, context) {
        return arr.map(value => visitValue(value, this, context));
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        const /** @type {?} */ result = {};
        Object.keys(map).forEach(key => { result[key] = visitValue(map[key], this, context); });
        return result;
    }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitPrimitive(value, context) { return value; }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitOther(value, context) { return value; }
}
export const /** @type {?} */ SyncAsync = {
    assertSync: (value) => {
        if (isPromise(value)) {
            throw new Error(`Illegal state: value cannot be a promise`);
        }
        return value;
    },
    then: (value, cb) => { return isPromise(value) ? value.then(cb) : cb(value); },
    all: (syncAsyncValues) => {
        return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : (syncAsyncValues);
    }
};
/**
 * @param {?} msg
 * @param {?=} parseErrors
 * @return {?}
 */
export function syntaxError(msg, parseErrors) {
    const /** @type {?} */ error = Error(msg);
    ((error))[ERROR_SYNTAX_ERROR] = true;
    if (parseErrors)
        ((error))[ERROR_PARSE_ERRORS] = parseErrors;
    return error;
}
const /** @type {?} */ ERROR_SYNTAX_ERROR = 'ngSyntaxError';
const /** @type {?} */ ERROR_PARSE_ERRORS = 'ngParseErrors';
/**
 * @param {?} error
 * @return {?}
 */
export function isSyntaxError(error) {
    return ((error))[ERROR_SYNTAX_ERROR];
}
/**
 * @param {?} error
 * @return {?}
 */
export function getParseErrors(error) {
    return ((error))[ERROR_PARSE_ERRORS] || [];
}
/**
 * @param {?} s
 * @return {?}
 */
export function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
const /** @type {?} */ STRING_MAP_PROTO = Object.getPrototypeOf({});
/**
 * @param {?} obj
 * @return {?}
 */
function isStrictStringMap(obj) {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
/**
 * @param {?} str
 * @return {?}
 */
export function utf8Encode(str) {
    let /** @type {?} */ encoded = '';
    for (let /** @type {?} */ index = 0; index < str.length; index++) {
        let /** @type {?} */ codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            const /** @type {?} */ low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}
/**
 * @record
 */
export function OutputContext() { }
function OutputContext_tsickle_Closure_declarations() {
    /** @type {?} */
    OutputContext.prototype.genFilePath;
    /** @type {?} */
    OutputContext.prototype.statements;
    /** @type {?} */
    OutputContext.prototype.importExpr;
}
//# sourceMappingURL=util.js.map