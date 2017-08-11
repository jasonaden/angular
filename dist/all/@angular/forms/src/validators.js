"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forkJoin_1 = require("rxjs/observable/forkJoin");
var fromPromise_1 = require("rxjs/observable/fromPromise");
var map_1 = require("rxjs/operator/map");
function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
/**
 * Providers for validators to be used for {@link FormControl}s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * @stable
 */
exports.NG_VALIDATORS = new core_1.InjectionToken('NgValidators');
/**
 * Providers for asynchronous validators to be used for {@link FormControl}s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See {@link NG_VALIDATORS} for more details.
 *
 * @stable
 */
exports.NG_ASYNC_VALIDATORS = new core_1.InjectionToken('NgAsyncValidators');
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {@link FormControl} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", Validators.required)
 * ```
 *
 * @stable
 */
var Validators = (function () {
    function Validators() {
    }
    /**
     * Validator that requires controls to have a value greater than a number.
     */
    Validators.min = function (min) {
        return function (control) {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
        };
    };
    /**
     * Validator that requires controls to have a value less than a number.
     */
    Validators.max = function (max) {
        return function (control) {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
        };
    };
    /**
     * Validator that requires controls to have a non-empty value.
     */
    Validators.required = function (control) {
        return isEmptyInputValue(control.value) ? { 'required': true } : null;
    };
    /**
     * Validator that requires control value to be true.
     */
    Validators.requiredTrue = function (control) {
        return control.value === true ? null : { 'required': true };
    };
    /**
     * Validator that performs email validation.
     */
    Validators.email = function (control) {
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    };
    /**
     * Validator that requires controls to have a value of a minimum length.
     */
    Validators.minLength = function (minLength) {
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            var length = control.value ? control.value.length : 0;
            return length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': length } } :
                null;
        };
    };
    /**
     * Validator that requires controls to have a value of a maximum length.
     */
    Validators.maxLength = function (maxLength) {
        return function (control) {
            var length = control.value ? control.value.length : 0;
            return length > maxLength ?
                { 'maxlength': { 'requiredLength': maxLength, 'actualLength': length } } :
                null;
        };
    };
    /**
     * Validator that requires a control to match a regex to its value.
     */
    Validators.pattern = function (pattern) {
        if (!pattern)
            return Validators.nullValidator;
        var regex;
        var regexStr;
        if (typeof pattern === 'string') {
            regexStr = "^" + pattern + "$";
            regex = new RegExp(regexStr);
        }
        else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = control.value;
            return regex.test(value) ? null :
                { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
        };
    };
    /**
     * No-op validator.
     */
    Validators.nullValidator = function (c) { return null; };
    Validators.compose = function (validators) {
        if (!validators)
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    };
    Validators.composeAsync = function (validators) {
        if (!validators)
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return map_1.map.call(forkJoin_1.forkJoin(observables), _mergeErrors);
        };
    };
    return Validators;
}());
exports.Validators = Validators;
function isPresent(o) {
    return o != null;
}
function toObservable(r) {
    var obs = core_1.ɵisPromise(r) ? fromPromise_1.fromPromise(r) : r;
    if (!(core_1.ɵisObservable(obs))) {
        throw new Error("Expected validator to return Promise or Observable.");
    }
    return obs;
}
exports.toObservable = toObservable;
function _executeValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _executeAsyncValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _mergeErrors(arrayOfErrors) {
    var res = arrayOfErrors.reduce(function (res, errors) {
        return errors != null ? __assign({}, res, errors) : res;
    }, {});
    return Object.keys(res).length === 0 ? null : res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCxzQ0FBcUc7QUFFckcscURBQWtEO0FBQ2xELDJEQUF3RDtBQUN4RCx5Q0FBc0M7QUFJdEMsMkJBQTJCLEtBQVU7SUFDbkMsOERBQThEO0lBQzlELE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDVSxRQUFBLGFBQWEsR0FBRyxJQUFJLHFCQUFjLENBQTRCLGNBQWMsQ0FBQyxDQUFDO0FBRTNGOzs7Ozs7Ozs7R0FTRztBQUNVLFFBQUEsbUJBQW1CLEdBQzVCLElBQUkscUJBQWMsQ0FBNEIsbUJBQW1CLENBQUMsQ0FBQztBQUV2RSxJQUFNLFlBQVksR0FDZCw0TEFBNEwsQ0FBQztBQUVqTTs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0g7SUFBQTtJQXNJQSxDQUFDO0lBcklDOztPQUVHO0lBQ0ksY0FBRyxHQUFWLFVBQVcsR0FBVztRQUNwQixNQUFNLENBQUMsVUFBQyxPQUF3QjtZQUM5QixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUUseURBQXlEO1lBQ3pFLENBQUM7WUFDRCxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLDJFQUEyRTtZQUMzRSwwRkFBMEY7WUFDMUYsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsRUFB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