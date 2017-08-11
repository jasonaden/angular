"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validators_1 = require("../validators");
var checkbox_value_accessor_1 = require("./checkbox_value_accessor");
var default_value_accessor_1 = require("./default_value_accessor");
var normalize_validator_1 = require("./normalize_validator");
var number_value_accessor_1 = require("./number_value_accessor");
var radio_control_value_accessor_1 = require("./radio_control_value_accessor");
var range_value_accessor_1 = require("./range_value_accessor");
var select_control_value_accessor_1 = require("./select_control_value_accessor");
var select_multiple_control_value_accessor_1 = require("./select_multiple_control_value_accessor");
function controlPath(name, parent) {
    return parent.path.concat([name]);
}
exports.controlPath = controlPath;
function setUpControl(control, dir) {
    if (!control)
        _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor)
        _throwError(dir, 'No value accessor for form control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    if (dir.valueAccessor.setDisabledState) {
        control.registerOnDisabledChange(function (isDisabled) { dir.valueAccessor.setDisabledState(isDisabled); });
    }
    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
}
exports.setUpControl = setUpControl;
function cleanUpControl(control, dir) {
    dir.valueAccessor.registerOnChange(function () { return _noControlError(dir); });
    dir.valueAccessor.registerOnTouched(function () { return _noControlError(dir); });
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
exports.cleanUpControl = cleanUpControl;
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange(function (newValue) {
        control._pendingValue = newValue;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(function () {
        control._pendingTouched = true;
        if (control.updateOn === 'blur')
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    dir.viewToModelUpdate(control._pendingValue);
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
}
function setUpModelChangePipeline(control, dir) {
    control.registerOnChange(function (newValue, emitModelEvent) {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
}
function setUpFormContainer(control, dir) {
    if (control == null)
        _throwError(dir, 'Cannot find control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
exports.setUpFormContainer = setUpFormContainer;
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    var messageEnd;
    if (dir.path.length > 1) {
        messageEnd = "path: '" + dir.path.join(' -> ') + "'";
    }
    else if (dir.path[0]) {
        messageEnd = "name: '" + dir.path + "'";
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(message + " " + messageEnd);
}
function composeValidators(validators) {
    return validators != null ? validators_1.Validators.compose(validators.map(normalize_validator_1.normalizeValidator)) : null;
}
exports.composeValidators = composeValidators;
function composeAsyncValidators(validators) {
    return validators != null ? validators_1.Validators.composeAsync(validators.map(normalize_validator_1.normalizeAsyncValidator)) :
        null;
}
exports.composeAsyncValidators = composeAsyncValidators;
function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    var change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !core_1.ɵlooseIdentical(viewModel, change.currentValue);
}
exports.isPropertyUpdated = isPropertyUpdated;
var BUILTIN_ACCESSORS = [
    checkbox_value_accessor_1.CheckboxControlValueAccessor,
    range_value_accessor_1.RangeValueAccessor,
    number_value_accessor_1.NumberValueAccessor,
    select_control_value_accessor_1.SelectControlValueAccessor,
    select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor,
    radio_control_value_accessor_1.RadioControlValueAccessor,
];
function isBuiltInAccessor(valueAccessor) {
    return BUILTIN_ACCESSORS.some(function (a) { return valueAccessor.constructor === a; });
}
exports.isBuiltInAccessor = isBuiltInAccessor;
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    var defaultAccessor = undefined;
    var builtinAccessor = undefined;
    var customAccessor = undefined;
    valueAccessors.forEach(function (v) {
        if (v.constructor === default_value_accessor_1.DefaultValueAccessor) {
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
exports.selectValueAccessor = selectValueAccessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQWdFO0FBRWhFLDRDQUF5QztBQUd6QyxxRUFBdUU7QUFHdkUsbUVBQThEO0FBRTlELDZEQUFrRjtBQUNsRixpRUFBNEQ7QUFDNUQsK0VBQXlFO0FBQ3pFLCtEQUEwRDtBQUUxRCxpRkFBMkU7QUFDM0UsbUdBQTRGO0FBSTVGLHFCQUE0QixJQUFZLEVBQUUsTUFBd0I7SUFDaEUsTUFBTSxDQUFLLE1BQU0sQ0FBQyxJQUFNLFNBQUUsSUFBSSxHQUFFO0FBQ2xDLENBQUM7QUFGRCxrQ0FFQztBQUVELHNCQUE2QixPQUFvQixFQUFFLEdBQWM7SUFDL0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFBQyxXQUFXLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFDM0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1FBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO0lBRXBGLE9BQU8sQ0FBQyxTQUFTLEdBQUcsdUJBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBVyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdFLE9BQU8sQ0FBQyxjQUFjLEdBQUcsdUJBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBZ0IsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNqRyxHQUFHLENBQUMsYUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFOUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLHdCQUF3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