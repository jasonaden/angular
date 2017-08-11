/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 * \@stable
 * @abstract
 */
export class AbstractControlDirective {
    /**
     * @return {?}
     */
    get value() { return this.control ? this.control.value : null; }
    /**
     * @return {?}
     */
    get valid() { return this.control ? this.control.valid : null; }
    /**
     * @return {?}
     */
    get invalid() { return this.control ? this.control.invalid : null; }
    /**
     * @return {?}
     */
    get pending() { return this.control ? this.control.pending : null; }
    /**
     * @return {?}
     */
    get errors() { return this.control ? this.control.errors : null; }
    /**
     * @return {?}
     */
    get pristine() { return this.control ? this.control.pristine : null; }
    /**
     * @return {?}
     */
    get dirty() { return this.control ? this.control.dirty : null; }
    /**
     * @return {?}
     */
    get touched() { return this.control ? this.control.touched : null; }
    /**
     * @return {?}
     */
    get untouched() { return this.control ? this.control.untouched : null; }
    /**
     * @return {?}
     */
    get disabled() { return this.control ? this.control.disabled : null; }
    /**
     * @return {?}
     */
    get enabled() { return this.control ? this.control.enabled : null; }
    /**
     * @return {?}
     */
    get statusChanges() {
        return this.control ? this.control.statusChanges : null;
    }
    /**
     * @return {?}
     */
    get valueChanges() {
        return this.control ? this.control.valueChanges : null;
    }
    /**
     * @return {?}
     */
    get path() { return null; }
    /**
     * @param {?=} value
     * @return {?}
     */
    reset(value = undefined) {
        if (this.control)
            this.control.reset(value);
    }
    /**
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
    }
    /**
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
    }
}
function AbstractControlDirective_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @return {?}
     */
    AbstractControlDirective.prototype.control = function () { };
}
//# sourceMappingURL=abstract_control_directive.js.map