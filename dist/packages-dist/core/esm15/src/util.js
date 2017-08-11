/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ __window = typeof window !== 'undefined' && window;
const /** @type {?} */ __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
const /** @type {?} */ __global = typeof global !== 'undefined' && global;
const /** @type {?} */ _global = __window || __global || __self;
export { _global as global };
let /** @type {?} */ _symbolIterator = null;
/**
 * @return {?}
 */
export function getSymbolIterator() {
    if (!_symbolIterator) {
        const /** @type {?} */ Symbol = _global['Symbol'];
        if (Symbol && Symbol.iterator) {
            _symbolIterator = Symbol.iterator;
        }
        else {
            // es6-shim specific logic
            const /** @type {?} */ keys = Object.getOwnPropertyNames(Map.prototype);
            for (let /** @type {?} */ i = 0; i < keys.length; ++i) {
                const /** @type {?} */ key = keys[i];
                if (key !== 'entries' && key !== 'size' &&
                    ((Map)).prototype[key] === Map.prototype['entries']) {
                    _symbolIterator = key;
                }
            }
        }
    }
    return _symbolIterator;
}
/**
 * @param {?} fn
 * @return {?}
 */
export function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
/**
 * @param {?} token
 * @return {?}
 */
export function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token instanceof Array) {
        return '[' + token.map(stringify).join(', ') + ']';
    }
    if (token == null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return `${token.overriddenName}`;
    }
    if (token.name) {
        return `${token.name}`;
    }
    const /** @type {?} */ res = token.toString();
    if (res == null) {
        return '' + res;
    }
    const /** @type {?} */ newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
//# sourceMappingURL=util.js.map