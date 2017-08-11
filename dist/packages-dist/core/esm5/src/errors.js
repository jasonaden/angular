/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
export var /** @type {?} */ ERROR_TYPE = 'ngType';
export var /** @type {?} */ ERROR_COMPONENT_TYPE = 'ngComponentType';
export var /** @type {?} */ ERROR_DEBUG_CONTEXT = 'ngDebugContext';
export var /** @type {?} */ ERROR_ORIGINAL_ERROR = 'ngOriginalError';
export var /** @type {?} */ ERROR_LOGGER = 'ngErrorLogger';
/**
 * @param {?} error
 * @return {?}
 */
export function getType(error) {
    return ((error))[ERROR_TYPE];
}
/**
 * @param {?} error
 * @return {?}
 */
export function getDebugContext(error) {
    return ((error))[ERROR_DEBUG_CONTEXT];
}
/**
 * @param {?} error
 * @return {?}
 */
export function getOriginalError(error) {
    return ((error))[ERROR_ORIGINAL_ERROR];
}
/**
 * @param {?} error
 * @return {?}
 */
export function getErrorLogger(error) {
    return ((error))[ERROR_LOGGER] || defaultErrorLogger;
}
/**
 * @param {?} console
 * @param {...?} values
 * @return {?}
 */
function defaultErrorLogger(console) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    console.error.apply(console, values);
}
//# sourceMappingURL=errors.js.map