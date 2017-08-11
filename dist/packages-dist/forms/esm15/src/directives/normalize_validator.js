/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} validator
 * @return {?}
 */
export function normalizeValidator(validator) {
    if (((validator)).validate) {
        return (c) => ((validator)).validate(c);
    }
    else {
        return (validator);
    }
}
/**
 * @param {?} validator
 * @return {?}
 */
export function normalizeAsyncValidator(validator) {
    if (((validator)).validate) {
        return (c) => ((validator)).validate(c);
    }
    else {
        return (validator);
    }
}
//# sourceMappingURL=normalize_validator.js.map