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
import { ɵlooseIdentical as looseIdentical } from '@angular/core';
import { Validators } from '../validators';
import { CheckboxControlValueAccessor } from './checkbox_value_accessor';
import { DefaultValueAccessor } from './default_value_accessor';
import { normalizeAsyncValidator, normalizeValidator } from './normalize_validator';
import { NumberValueAccessor } from './number_value_accessor';
import { RadioControlValueAccessor } from './radio_control_value_accessor';
import { RangeValueAccessor } from './range_value_accessor';
import { SelectControlValueAccessor } from './select_control_value_accessor';
import { SelectMultipleControlValueAccessor } from './select_multiple_control_value_accessor';
/**
 * @param {?} name
 * @param {?} parent
 * @return {?}
 */
export function controlPath(name, parent) {
    return ((parent.path)).concat([name]);
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
export function setUpControl(control, dir) {
    if (!control)
        _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor)
        _throwError(dir, 'No value accessor for form control with');
    control.validator = Validators.compose([/** @type {?} */ ((control.validator)), dir.validator]);
    control.asyncValidator = Validators.composeAsync([/** @type {?} */ ((control.asyncValidator)), dir.asyncValidator]); /** @type {?} */
    ((dir.valueAccessor)).writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    if (((dir.valueAccessor)).setDisabledState) {
        control.registerOnDisabledChange(function (isDisabled) { /** @type {?} */ ((((dir.valueAccessor)).setDisabledState))(isDisabled); });
    }
    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach(function (validator) {
        if (((validator)).registerOnValidatorChange)
            ((((validator)).registerOnValidatorChange))(function () { return control.updateValueAndValidity(); });
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (((validator)).registerOnValidatorChange)
            ((((validator)).registerOnValidatorChange))(function () { return control.updateValueAndValidity(); });
    });
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
export function cleanUpControl(control, dir) {
    ((dir.valueAccessor)).registerOnChange(function () { return _noControlError(dir); }); /** @type {?} */
    ((dir.valueAccessor)).registerOnTouched(function () { return _noControlError(dir); });
    dir._rawValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    if (control)
        control._clearChangeFns();
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
function setUpViewChangePipeline(control, dir) {
    ((dir.valueAccessor)).registerOnChange(function (newValue) {
        control._pendingValue = newValue;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
function setUpBlurPipeline(control, dir) {
    ((dir.valueAccessor)).registerOnTouched(function () {
        control._pendingTouched = true;
        if (control.updateOn === 'blur')
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
function updateControl(control, dir) {
    dir.viewToModelUpdate(control._pendingValue);
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
function setUpModelChangePipeline(control, dir) {
    control.registerOnChange(function (newValue, emitModelEvent) {
        ((
        // control -> view
        dir.valueAccessor)).writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
}
/**
 * @param {?} control
 * @param {?} dir
 * @return {?}
 */
export function setUpFormContainer(control, dir) {
    if (control == null)
        _throwError(dir, 'Cannot find control with');
    control.validator = Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
/**
 * @param {?} dir
 * @return {?}
 */
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
/**
 * @param {?} dir
 * @param {?} message
 * @return {?}
 */
function _throwError(dir, message) {
    var /** @type {?} */ messageEnd;
    if (((dir.path)).length > 1) {
        messageEnd = "path: '" + (((dir.path))).join(' -> ') + "'";
    }
    else if (((dir.path))[0]) {
        messageEnd = "name: '" + dir.path + "'";
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(message + " " + messageEnd);
}
/**
 * @param {?} validators
 * @return {?}
 */
export function composeValidators(validators) {
    return validators != null ? Validators.compose(validators.map(normalizeValidator)) : null;
}
/**
 * @param {?} validators
 * @return {?}
 */
export function composeAsyncValidators(validators) {
    return validators != null ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) :
        null;
}
/**
 * @param {?} changes
 * @param {?} viewModel
 * @return {?}
 */
export function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    var /** @type {?} */ change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !looseIdentical(viewModel, change.currentValue);
}
var /** @type {?} */ BUILTIN_ACCESSORS = [
    CheckboxControlValueAccessor,
    RangeValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
];
/**
 * @param {?} valueAccessor
 * @return {?}
 */
export function isBuiltInAccessor(valueAccessor) {
    return BUILTIN_ACCESSORS.some(function (a) { return valueAccessor.constructor === a; });
}
/**
 * @param {?} dir
 * @param {?} valueAccessors
 * @return {?}
 */
export function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    var /** @type {?} */ defaultAccessor = undefined;
    var /** @type {?} */ builtinAccessor = undefined;
    var /** @type {?} */ customAccessor = undefined;
    valueAccessors.forEach(function (v) {
        if (v.constructor === DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor)
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor)
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    _throwError(dir, 'No valid value accessor for form control with');
    return null;
}
//# sourceMappingURL=shared.js.map