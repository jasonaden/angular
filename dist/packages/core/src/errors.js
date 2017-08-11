/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
export const /** @type {?} */ ERROR_TYPE = 'ngType';
export const /** @type {?} */ ERROR_COMPONENT_TYPE = 'ngComponentType';
export const /** @type {?} */ ERROR_DEBUG_CONTEXT = 'ngDebugContext';
export const /** @type {?} */ ERROR_ORIGINAL_ERROR = 'ngOriginalError';
export const /** @type {?} */ ERROR_LOGGER = 'ngErrorLogger';
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
function defaultErrorLogger(console, ...values) {
    ((console.error))(...values);
}
//# sourceMappingURL=errors.js.map