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
import { InjectionToken } from '@angular/core';
/**
 * A bridge between a control and a native element.
 *
 * A `ControlValueAccessor` abstracts the operations of writing a new value to a
 * DOM element representing an input control.
 *
 * Please see {\@link DefaultValueAccessor} for more information.
 *
 * \@stable
 * @record
 */
export function ControlValueAccessor() { }
function ControlValueAccessor_tsickle_Closure_declarations() {
    /**
     * Write a new value to the element.
     * @type {?}
     */
    ControlValueAccessor.prototype.writeValue;
    /**
     * Set the function to be called when the control receives a change event.
     * @type {?}
     */
    ControlValueAccessor.prototype.registerOnChange;
    /**
     * Set the function to be called when the control receives a touch event.
     * @type {?}
     */
    ControlValueAccessor.prototype.registerOnTouched;
    /**
     * This function is called when the control status changes to or from "DISABLED".
     * Depending on the value, it will enable or disable the appropriate DOM element.
     *
     * \@param isDisabled
     * @type {?|undefined}
     */
    ControlValueAccessor.prototype.setDisabledState;
}
/**
 * Used to provide a {\@link ControlValueAccessor} for form controls.
 *
 * See {\@link DefaultValueAccessor} for how to implement one.
 * \@stable
 */
export const /** @type {?} */ NG_VALUE_ACCESSOR = new InjectionToken('NgValueAccessor');
//# sourceMappingURL=control_value_accessor.js.map