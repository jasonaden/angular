"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var of_1 = require("rxjs/observable/of");
var timer_1 = require("rxjs/observable/timer");
var first_1 = require("rxjs/operator/first");
var map_1 = require("rxjs/operator/map");
var normalize_validator_1 = require("../src/directives/normalize_validator");
function main() {
    function validator(key, error) {
        return function (c) {
            var r = {};
            r[key] = error;
            return r;
        };
    }
    var AsyncValidatorDirective = (function () {
        function AsyncValidatorDirective(expected, error) {
            this.expected = expected;
            this.error = error;
        }
        AsyncValidatorDirective.prototype.validate = function (c) {
            var _this = this;
            return Observable_1.Observable.create(function (obs) {
                var error = _this.expected !== c.value ? _this.error : null;
                obs.next(error);
                obs.complete();
            });
        };
        return AsyncValidatorDirective;
    }());
    testing_internal_1.describe('Validators', function () {
        testing_internal_1.describe('min', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should return null if NaN after parsing', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('a'))).toBeNull(); });
            testing_internal_1.it('should return a validation error on small values', function () {
                testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(1))).toEqual({ 'min': { 'min': 2, 'actual': 1 } });
            });
            testing_internal_1.it('should return a validation error on small values converted from strings', function () {
                testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('1'))).toEqual({ 'min': { 'min': 2, 'actual': '1' } });
            });
            testing_internal_1.it('should not error on big values', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should not error on equal values', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl(2))).toBeNull(); });
            testing_internal_1.it('should not error on equal values when value is string', function () { testing_internal_1.expect(forms_1.Validators.min(2)(new forms_1.FormControl('2'))).toBeNull(); });
            testing_internal_1.it('should validate as expected when min value is a string', function () {
                testing_internal_1.expect(forms_1.Validators.min('2')(new forms_1.FormControl(1))).toEqual({
                    'min': { 'min': '2', 'actual': 1 }
                });
            });
            testing_internal_1.it('should return null if min value is undefined', function () { testing_internal_1.expect(forms_1.Validators.min(undefined)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should return null if min value is null', function () { testing_internal_1.expect(forms_1.Validators.min(null)(new forms_1.FormControl(3))).toBeNull(); });
        });
        testing_internal_1.describe('max', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should return null if NaN after parsing', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('aaa'))).toBeNull(); });
            testing_internal_1.it('should return a validation error on big values', function () {
                testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(3))).toEqual({ 'max': { 'max': 2, 'actual': 3 } });
            });
            testing_internal_1.it('should return a validation error on big values converted from strings', function () {
                testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('3'))).toEqual({ 'max': { 'max': 2, 'actual': '3' } });
            });
            testing_internal_1.it('should not error on small values', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(1))).toBeNull(); });
            testing_internal_1.it('should not error on equal values', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl(2))).toBeNull(); });
            testing_internal_1.it('should not error on equal values when value is string', function () { testing_internal_1.expect(forms_1.Validators.max(2)(new forms_1.FormControl('2'))).toBeNull(); });
            testing_internal_1.it('should validate as expected when max value is a string', function () {
                testing_internal_1.expect(forms_1.Validators.max('2')(new forms_1.FormControl(3))).toEqual({
                    'max': { 'max': '2', 'actual': 3 }
                });
            });
            testing_internal_1.it('should return null if max value is undefined', function () { testing_internal_1.expect(forms_1.Validators.max(undefined)(new forms_1.FormControl(3))).toBeNull(); });
            testing_internal_1.it('should return null if max value is null', function () { testing_internal_1.expect(forms_1.Validators.max(null)(new forms_1.FormControl(3))).toBeNull(); });
        });
        testing_internal_1.describe('required', function () {
            testing_internal_1.it('should error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(''))).toEqual({ 'required': true }); });
            testing_internal_1.it('should error on null', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(null))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on undefined', function () {
                testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(undefined))).toEqual({ 'required': true });
            });
            testing_internal_1.it('should not error on a non-empty string', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl('not empty'))).toBeNull(); });
            testing_internal_1.it('should accept zero as valid', function () { testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl(0))).toBeNull(); });
            testing_internal_1.it('should error on an empty array', function () { return testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl([]))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on a non-empty array', function () { return testing_internal_1.expect(forms_1.Validators.required(new forms_1.FormControl([1, 2]))).toBeNull(); });
        });
        testing_internal_1.describe('requiredTrue', function () {
            testing_internal_1.it('should error on false', function () { return testing_internal_1.expect(forms_1.Validators.requiredTrue(new forms_1.FormControl(false))).toEqual({ 'required': true }); });
            testing_internal_1.it('should not error on true', function () { return testing_internal_1.expect(forms_1.Validators.requiredTrue(new forms_1.FormControl(true))).toBeNull(); });
        });
        testing_internal_1.describe('email', function () {
            testing_internal_1.it('should error on invalid email', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl('some text'))).toEqual({ 'email': true }); });
            testing_internal_1.it('should not error on valid email', function () { return testing_internal_1.expect(forms_1.Validators.email(new forms_1.FormControl('test@gmail.com'))).toBeNull(); });
        });
        testing_internal_1.describe('minLength', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl('aa'))).toBeNull(); });
            testing_internal_1.it('should error on short strings', function () {
                testing_internal_1.expect(forms_1.Validators.minLength(2)(new forms_1.FormControl('a'))).toEqual({
                    'minlength': { 'requiredLength': 2, 'actualLength': 1 }
                });
            });
            testing_internal_1.it('should not error when FormArray has valid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.minLength(2)(fa)).toBeNull();
            });
            testing_internal_1.it('should error when FormArray has invalid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.minLength(2)(fa)).toEqual({
                    'minlength': { 'requiredLength': 2, 'actualLength': 1 }
                });
            });
        });
        testing_internal_1.describe('maxLength', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl(undefined))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl('aa'))).toBeNull(); });
            testing_internal_1.it('should error on long strings', function () {
                testing_internal_1.expect(forms_1.Validators.maxLength(2)(new forms_1.FormControl('aaa'))).toEqual({
                    'maxlength': { 'requiredLength': 2, 'actualLength': 3 }
                });
            });
            testing_internal_1.it('should not error when FormArray has valid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.maxLength(2)(fa)).toBeNull();
            });
            testing_internal_1.it('should error when FormArray has invalid length', function () {
                var fa = new forms_1.FormArray([new forms_1.FormControl(''), new forms_1.FormControl('')]);
                testing_internal_1.expect(forms_1.Validators.maxLength(1)(fa)).toEqual({
                    'maxlength': { 'requiredLength': 1, 'actualLength': 2 }
                });
            });
        });
        testing_internal_1.describe('pattern', function () {
            testing_internal_1.it('should not error on an empty string', function () { testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(''))).toBeNull(); });
            testing_internal_1.it('should not error on null', function () { testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on undefined', function () {
                testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]+')(new forms_1.FormControl(undefined))).toBeNull();
            });
            testing_internal_1.it('should not error on null value and "null" pattern', function () { testing_internal_1.expect(forms_1.Validators.pattern('null')(new forms_1.FormControl(null))).toBeNull(); });
            testing_internal_1.it('should not error on valid strings', function () { return testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]*')(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should error on failure to match string', function () {
                testing_internal_1.expect(forms_1.Validators.pattern('[a-zA-Z ]*')(new forms_1.FormControl('aaa0'))).toEqual({
                    'pattern': { 'requiredPattern': '^[a-zA-Z ]*$', 'actualValue': 'aaa0' }
                });
            });
            testing_internal_1.it('should accept RegExp object', function () {
                var pattern = new RegExp('[a-zA-Z ]+');
                testing_internal_1.expect(forms_1.Validators.pattern(pattern)(new forms_1.FormControl('aaAA'))).toBeNull();
            });
            testing_internal_1.it('should error on failure to match RegExp object', function () {
                var pattern = new RegExp('^[a-zA-Z ]*$');
                testing_internal_1.expect(forms_1.Validators.pattern(pattern)(new forms_1.FormControl('aaa0'))).toEqual({
                    'pattern': { 'requiredPattern': '/^[a-zA-Z ]*$/', 'actualValue': 'aaa0' }
                });
            });
            testing_internal_1.it('should not error on "null" pattern', function () { return testing_internal_1.expect(forms_1.Validators.pattern(null)(new forms_1.FormControl('aaAA'))).toBeNull(); });
            testing_internal_1.it('should not error on "undefined" pattern', function () { return testing_internal_1.expect(forms_1.Validators.pattern(undefined)(new forms_1.FormControl('aaAA'))).toBeNull(); });
        });
        testing_internal_1.describe('compose', function () {
            testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.compose(null)).toBe(null); });
            testing_internal_1.it('should collect errors from all the validators', function () {
                var c = forms_1.Validators.compose([validator('a', true), validator('b', true)]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'a': true, 'b': true });
            });
            testing_internal_1.it('should run validators left to right', function () {
                var c = forms_1.Validators.compose([validator('a', 1), validator('a', 2)]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'a': 2 });
            });
            testing_internal_1.it('should return null when no errors', function () {
                var c = forms_1.Validators.compose([forms_1.Validators.nullValidator, forms_1.Validators.nullValidator]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toBeNull();
            });
            testing_internal_1.it('should ignore nulls', function () {
                var c = forms_1.Validators.compose([null, forms_1.Validators.required]);
                testing_internal_1.expect(c(new forms_1.FormControl(''))).toEqual({ 'required': true });
            });
        });
        testing_internal_1.describe('composeAsync', function () {
            testing_internal_1.describe('promises', function () {
                function promiseValidator(response) {
                    return function (c) {
                        var res = c.value != 'expected' ? response : null;
                        return Promise.resolve(res);
                    };
                }
                testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.composeAsync(null)).toBeNull(); });
                testing_internal_1.it('should collect errors from all the validators', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true }), promiseValidator({ 'two': true })]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true, 'two': true });
                }));
                testing_internal_1.it('should normalize and evaluate async validator-directives correctly', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([normalize_validator_1.normalizeAsyncValidator(new AsyncValidatorDirective('expected', { 'one': true }))]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                }));
                testing_internal_1.it('should return null when no errors', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true })]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('expected')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toBeNull();
                }));
                testing_internal_1.it('should ignore nulls', testing_1.fakeAsync(function () {
                    var v = forms_1.Validators.composeAsync([promiseValidator({ 'one': true }), null]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick();
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                }));
            });
            testing_internal_1.describe('observables', function () {
                function observableValidator(response) {
                    return function (c) {
                        var res = c.value != 'expected' ? response : null;
                        return of_1.of(res);
                    };
                }
                testing_internal_1.it('should return null when given null', function () { testing_internal_1.expect(forms_1.Validators.composeAsync(null)).toBeNull(); });
                testing_internal_1.it('should collect errors from all the validators', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true }), observableValidator({ 'two': true })]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true, 'two': true });
                });
                testing_internal_1.it('should normalize and evaluate async validator-directives correctly', function () {
                    var v = forms_1.Validators.composeAsync([normalize_validator_1.normalizeAsyncValidator(new AsyncValidatorDirective('expected', { 'one': true }))]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                });
                testing_internal_1.it('should return null when no errors', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true })]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('expected')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toBeNull();
                });
                testing_internal_1.it('should ignore nulls', function () {
                    var v = forms_1.Validators.composeAsync([observableValidator({ 'one': true }), null]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_internal_1.expect(errorMap).toEqual({ 'one': true });
                });
                testing_internal_1.it('should wait for all validators before setting errors', testing_1.fakeAsync(function () {
                    function getTimerObs(time, errorMap) {
                        return function (c) { return map_1.map.call(timer_1.timer(time), function () { return errorMap; }); };
                    }
                    var v = forms_1.Validators.composeAsync([getTimerObs(100, { one: true }), getTimerObs(200, { two: true })]);
                    var errorMap = undefined;
                    first_1.first.call(v(new forms_1.FormControl('invalid')))
                        .subscribe(function (errors) { return errorMap = errors; });
                    testing_1.tick(100);
                    testing_internal_1.expect(errorMap).not.toBeDefined("Expected errors not to be set until all validators came back.");
                    testing_1.tick(100);
                    testing_internal_1.expect(errorMap).toEqual({ one: true, two: true }, "Expected errors to merge once all validators resolved.");
                }));
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC92YWxpZGF0b3JzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBc0Q7QUFDdEQsK0VBQWdGO0FBQ2hGLHdDQUFxRztBQUNyRyw4Q0FBMkM7QUFDM0MseUNBQXVDO0FBQ3ZDLCtDQUE0QztBQUM1Qyw2Q0FBMEM7QUFDMUMseUNBQXNDO0FBQ3RDLDZFQUE4RTtBQUc5RTtJQUNFLG1CQUFtQixHQUFXLEVBQUUsS0FBVTtRQUN4QyxNQUFNLENBQUMsVUFBQyxDQUFrQjtZQUN4QixJQUFNLENBQUMsR0FBcUIsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDZixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEO1FBQ0UsaUNBQW9CLFFBQWdCLEVBQVUsS0FBVTtZQUFwQyxhQUFRLEdBQVIsUUFBUSxDQUFRO1lBQVUsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFHLENBQUM7UUFFNUQsMENBQVEsR0FBUixVQUFTLENBQU07WUFBZixpQkFNQztZQUxDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQVE7Z0JBQ2hDLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDNUQsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQVZELElBVUM7SUFFRCwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNy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