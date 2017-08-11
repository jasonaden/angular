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
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
var shared_1 = require("../src/directives/shared");
var spies_1 = require("./spies");
var DummyControlValueAccessor = (function () {
    function DummyControlValueAccessor() {
    }
    DummyControlValueAccessor.prototype.registerOnChange = function (fn) { };
    DummyControlValueAccessor.prototype.registerOnTouched = function (fn) { };
    DummyControlValueAccessor.prototype.writeValue = function (obj) { this.writtenValue = obj; };
    return DummyControlValueAccessor;
}());
var CustomValidatorDirective = (function () {
    function CustomValidatorDirective() {
    }
    CustomValidatorDirective.prototype.validate = function (c) { return { 'custom': true }; };
    return CustomValidatorDirective;
}());
function asyncValidator(expected, timeout) {
    if (timeout === void 0) { timeout = 0; }
    return function (c) {
        var resolve = undefined;
        var promise = new Promise(function (res) { resolve = res; });
        var res = c.value != expected ? { 'async': true } : null;
        if (timeout == 0) {
            resolve(res);
        }
        else {
            setTimeout(function () { resolve(res); }, timeout);
        }
        return promise;
    };
}
function main() {
    testing_internal_1.describe('Form Directives', function () {
        var defaultAccessor;
        testing_internal_1.beforeEach(function () { defaultAccessor = new forms_1.DefaultValueAccessor(null, null, null); });
        testing_internal_1.describe('shared', function () {
            testing_internal_1.describe('selectValueAccessor', function () {
                var dir;
                testing_internal_1.beforeEach(function () { dir = new spies_1.SpyNgControl(); });
                testing_internal_1.it('should throw when given an empty array', function () { testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, []); }).toThrowError(); });
                testing_internal_1.it('should return the default value accessor when no other provided', function () { testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor])).toEqual(defaultAccessor); });
                testing_internal_1.it('should return checkbox accessor when provided', function () {
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, checkboxAccessor
                    ])).toEqual(checkboxAccessor);
                });
                testing_internal_1.it('should return select accessor when provided', function () {
                    var selectAccessor = new forms_1.SelectControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, selectAccessor
                    ])).toEqual(selectAccessor);
                });
                testing_internal_1.it('should return select multiple accessor when provided', function () {
                    var selectMultipleAccessor = new forms_1.SelectMultipleControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [
                        defaultAccessor, selectMultipleAccessor
                    ])).toEqual(selectMultipleAccessor);
                });
                testing_internal_1.it('should throw when more than one build-in accessor is provided', function () {
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    var selectAccessor = new forms_1.SelectControlValueAccessor(null, null);
                    testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, [checkboxAccessor, selectAccessor]); }).toThrowError();
                });
                testing_internal_1.it('should return custom accessor when provided', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    var checkboxAccessor = new forms_1.CheckboxControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor, customAccessor, checkboxAccessor]))
                        .toEqual(customAccessor);
                });
                testing_internal_1.it('should return custom accessor when provided with select multiple', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    var selectMultipleAccessor = new forms_1.SelectMultipleControlValueAccessor(null, null);
                    testing_internal_1.expect(shared_1.selectValueAccessor(dir, [defaultAccessor, customAccessor, selectMultipleAccessor]))
                        .toEqual(customAccessor);
                });
                testing_internal_1.it('should throw when more than one custom accessor is provided', function () {
                    var customAccessor = new spies_1.SpyValueAccessor();
                    testing_internal_1.expect(function () { return shared_1.selectValueAccessor(dir, [customAccessor, customAccessor]); }).toThrowError();
                });
            });
            testing_internal_1.describe('composeValidators', function () {
                testing_internal_1.it('should compose functions', function () {
                    var dummy1 = function (_ /** TODO #9100 */) { return ({ 'dummy1': true }); };
                    var dummy2 = function (_ /** TODO #9100 */) { return ({ 'dummy2': true }); };
                    var v = shared_1.composeValidators([dummy1, dummy2]);
                    testing_internal_1.expect(v(new forms_1.FormControl(''))).toEqual({ 'dummy1': true, 'dummy2': true });
                });
                testing_internal_1.it('should compose validator directives', function () {
                    var dummy1 = function (_ /** TODO #9100 */) { return ({ 'dummy1': true }); };
                    var v = shared_1.composeValidators([dummy1, new CustomValidatorDirective()]);
                    testing_internal_1.expect(v(new forms_1.FormControl(''))).toEqual({ 'dummy1': true, 'custom': true });
                });
            });
        });
        testing_internal_1.describe('formGroup', function () {
            var form;
            var formModel;
            var loginControlDir;
            testing_internal_1.beforeEach(function () {
                form = new forms_1.FormGroupDirective([], []);
                formModel = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(),
                    'passwords': new forms_1.FormGroup({ 'password': new forms_1.FormControl(), 'passwordConfirm': new forms_1.FormControl() })
                });
                form.form = formModel;
                loginControlDir = new forms_1.FormControlName(form, [forms_1.Validators.required], [asyncValidator('expected')], [defaultAccessor]);
                loginControlDir.name = 'login';
                loginControlDir.valueAccessor = new DummyControlValueAccessor();
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(form.control).toBe(formModel);
                testing_internal_1.expect(form.value).toBe(formModel.value);
                testing_internal_1.expect(form.valid).toBe(formModel.valid);
                testing_internal_1.expect(form.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(form.pending).toBe(formModel.pending);
                testing_internal_1.expect(form.errors).toBe(formModel.errors);
                testing_internal_1.expect(form.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(form.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(form.touched).toBe(formModel.touched);
                testing_internal_1.expect(form.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(form.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(form.valueChanges).toBe(formModel.valueChanges);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
            });
            testing_internal_1.describe('addControl', function () {
                testing_internal_1.it('should throw when no control found', function () {
                    var dir = new forms_1.FormControlName(form, null, null, [defaultAccessor]);
                    dir.name = 'invalidName';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("Cannot find control with name: 'invalidName'"));
                });
                testing_internal_1.it('should throw for a named control when no value accessor', function () {
                    var dir = new forms_1.FormControlName(form, null, null, null);
                    dir.name = 'login';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("No value accessor for form control with name: 'login'"));
                });
                testing_internal_1.it('should throw when no value accessor with path', function () {
                    var group = new forms_1.FormGroupName(form, null, null);
                    var dir = new forms_1.FormControlName(group, null, null, null);
                    group.name = 'passwords';
                    dir.name = 'password';
                    testing_internal_1.expect(function () { return form.addControl(dir); })
                        .toThrowError(new RegExp("No value accessor for form control with path: 'passwords -> password'"));
                });
                testing_internal_1.it('should set up validators', testing_1.fakeAsync(function () {
                    form.addControl(loginControlDir);
                    // sync validators are set
                    testing_internal_1.expect(formModel.hasError('required', ['login'])).toBe(true);
                    testing_internal_1.expect(formModel.hasError('async', ['login'])).toBe(false);
                    formModel.get('login').setValue('invalid value');
                    // sync validator passes, running async validators
                    testing_internal_1.expect(formModel.pending).toBe(true);
                    testing_1.tick();
                    testing_internal_1.expect(formModel.hasError('required', ['login'])).toBe(false);
                    testing_internal_1.expect(formModel.hasError('async', ['login'])).toBe(true);
                }));
                testing_internal_1.it('should write value to the DOM', function () {
                    formModel.get(['login']).setValue('initValue');
                    form.addControl(loginControlDir);
                    testing_internal_1.expect(loginControlDir.valueAccessor.writtenValue).toEqual('initValue');
                });
                testing_internal_1.it('should add the directive to the list of directives included in the form', function () {
                    form.addControl(loginControlDir);
                    testing_internal_1.expect(form.directives).toEqual([loginControlDir]);
                });
            });
            testing_internal_1.describe('addFormGroup', function () {
                var matchingPasswordsValidator = function (g) {
                    if (g.controls['password'].value != g.controls['passwordConfirm'].value) {
                        return { 'differentPasswords': true };
                    }
                    else {
                        return null;
                    }
                };
                testing_internal_1.it('should set up validator', testing_1.fakeAsync(function () {
                    var group = new forms_1.FormGroupName(form, [matchingPasswordsValidator], [asyncValidator('expected')]);
                    group.name = 'passwords';
                    form.addFormGroup(group);
                    formModel.get(['passwords', 'password']).setValue('somePassword');
                    formModel.get([
                        'passwords', 'passwordConfirm'
                    ]).setValue('someOtherPassword');
                    // sync validators are set
                    testing_internal_1.expect(formModel.hasError('differentPasswords', ['passwords'])).toEqual(true);
                    formModel.get([
                        'passwords', 'passwordConfirm'
                    ]).setValue('somePassword');
                    // sync validators pass, running async validators
                    testing_internal_1.expect(formModel.pending).toBe(true);
                    testing_1.tick();
                    testing_internal_1.expect(formModel.hasError('async', ['passwords'])).toBe(true);
                }));
            });
            testing_internal_1.describe('removeControl', function () {
                testing_internal_1.it('should remove the directive to the list of directives included in the form', function () {
                    form.addControl(loginControlDir);
                    form.removeControl(loginControlDir);
                    testing_internal_1.expect(form.directives).toEqual([]);
                });
            });
            testing_internal_1.describe('ngOnChanges', function () {
                testing_internal_1.it('should update dom values of all the directives', function () {
                    form.addControl(loginControlDir);
                    formModel.get(['login']).setValue('new value');
                    form.ngOnChanges({});
                    testing_internal_1.expect(loginControlDir.valueAccessor.writtenValue).toEqual('new value');
                });
                testing_internal_1.it('should set up a sync validator', function () {
                    var formValidator = function (c) { return ({ 'custom': true }); };
                    var f = new forms_1.FormGroupDirective([formValidator], []);
                    f.form = formModel;
                    f.ngOnChanges({ 'form': new core_1.SimpleChange(null, null, false) });
                    testing_internal_1.expect(formModel.errors).toEqual({ 'custom': true });
                });
                testing_internal_1.it('should set up an async validator', testing_1.fakeAsync(function () {
                    var f = new forms_1.FormGroupDirective([], [asyncValidator('expected')]);
                    f.form = formModel;
                    f.ngOnChanges({ 'form': new core_1.SimpleChange(null, null, false) });
                    testing_1.tick();
                    testing_internal_1.expect(formModel.errors).toEqual({ 'async': true });
                }));
            });
        });
        testing_internal_1.describe('NgForm', function () {
            var form /** TODO #9100 */;
            var formModel;
            var loginControlDir /** TODO #9100 */;
            var personControlGroupDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                form = new forms_1.NgForm([], []);
                formModel = form.form;
                personControlGroupDir = new forms_1.NgModelGroup(form, [], []);
                personControlGroupDir.name = 'person';
                loginControlDir = new forms_1.NgModel(personControlGroupDir, null, null, [defaultAccessor]);
                loginControlDir.name = 'login';
                loginControlDir.valueAccessor = new DummyControlValueAccessor();
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(form.control).toBe(formModel);
                testing_internal_1.expect(form.value).toBe(formModel.value);
                testing_internal_1.expect(form.valid).toBe(formModel.valid);
                testing_internal_1.expect(form.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(form.pending).toBe(formModel.pending);
                testing_internal_1.expect(form.errors).toBe(formModel.errors);
                testing_internal_1.expect(form.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(form.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(form.touched).toBe(formModel.touched);
                testing_internal_1.expect(form.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(form.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(form.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(form.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(form.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(form.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(form.getError('required')).toBe(formModel.getError('required'));
            });
            testing_internal_1.describe('addControl & addFormGroup', function () {
                testing_internal_1.it('should create a control with the given name', testing_1.fakeAsync(function () {
                    form.addFormGroup(personControlGroupDir);
                    form.addControl(loginControlDir);
                    testing_1.flushMicrotasks();
                    testing_internal_1.expect(formModel.get(['person', 'login'])).not.toBeNull;
                }));
                // should update the form's value and validity
            });
            testing_internal_1.describe('removeControl & removeFormGroup', function () {
                testing_internal_1.it('should remove control', testing_1.fakeAsync(function () {
                    form.addFormGroup(personControlGroupDir);
                    form.addControl(loginControlDir);
                    form.removeFormGroup(personControlGroupDir);
                    form.removeControl(loginControlDir);
                    testing_1.flushMicrotasks();
                    testing_internal_1.expect(formModel.get(['person'])).toBeNull();
                    testing_internal_1.expect(formModel.get(['person', 'login'])).toBeNull();
                }));
                // should update the form's value and validity
            });
            testing_internal_1.it('should set up sync validator', testing_1.fakeAsync(function () {
                var formValidator = function (c /** TODO #9100 */) { return ({ 'custom': true }); };
                var f = new forms_1.NgForm([formValidator], []);
                testing_1.tick();
                testing_internal_1.expect(f.form.errors).toEqual({ 'custom': true });
            }));
            testing_internal_1.it('should set up async validator', testing_1.fakeAsync(function () {
                var f = new forms_1.NgForm([], [asyncValidator('expected')]);
                testing_1.tick();
                testing_internal_1.expect(f.form.errors).toEqual({ 'async': true });
            }));
        });
        testing_internal_1.describe('FormGroupName', function () {
            var formModel /** TODO #9100 */;
            var controlGroupDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                formModel = new forms_1.FormGroup({ 'login': new forms_1.FormControl(null) });
                var parent = new forms_1.FormGroupDirective([], []);
                parent.form = new forms_1.FormGroup({ 'group': formModel });
                controlGroupDir = new forms_1.FormGroupName(parent, [], []);
                controlGroupDir.name = 'group';
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(controlGroupDir.control).toBe(formModel);
                testing_internal_1.expect(controlGroupDir.value).toBe(formModel.value);
                testing_internal_1.expect(controlGroupDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(controlGroupDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(controlGroupDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(controlGroupDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(controlGroupDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(controlGroupDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(controlGroupDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(controlGroupDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(controlGroupDir.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(controlGroupDir.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(controlGroupDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(controlGroupDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlGroupDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlGroupDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(controlGroupDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlGroupDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
        testing_internal_1.describe('FormArrayName', function () {
            var formModel;
            var formArrayDir;
            testing_internal_1.beforeEach(function () {
                var parent = new forms_1.FormGroupDirective([], []);
                formModel = new forms_1.FormArray([new forms_1.FormControl('')]);
                parent.form = new forms_1.FormGroup({ 'array': formModel });
                formArrayDir = new forms_1.FormArrayName(parent, [], []);
                formArrayDir.name = 'array';
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(formArrayDir.control).toBe(formModel);
                testing_internal_1.expect(formArrayDir.value).toBe(formModel.value);
                testing_internal_1.expect(formArrayDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(formArrayDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(formArrayDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(formArrayDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(formArrayDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(formArrayDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(formArrayDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(formArrayDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(formArrayDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(formArrayDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(formArrayDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(formArrayDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(formArrayDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(formArrayDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
        testing_internal_1.describe('FormControlDirective', function () {
            var controlDir /** TODO #9100 */;
            var control /** TODO #9100 */;
            var checkProperties = function (control) {
                testing_internal_1.expect(controlDir.control).toBe(control);
                testing_internal_1.expect(controlDir.value).toBe(control.value);
                testing_internal_1.expect(controlDir.valid).toBe(control.valid);
                testing_internal_1.expect(controlDir.invalid).toBe(control.invalid);
                testing_internal_1.expect(controlDir.pending).toBe(control.pending);
                testing_internal_1.expect(controlDir.errors).toBe(control.errors);
                testing_internal_1.expect(controlDir.pristine).toBe(control.pristine);
                testing_internal_1.expect(controlDir.dirty).toBe(control.dirty);
                testing_internal_1.expect(controlDir.touched).toBe(control.touched);
                testing_internal_1.expect(controlDir.untouched).toBe(control.untouched);
                testing_internal_1.expect(controlDir.statusChanges).toBe(control.statusChanges);
                testing_internal_1.expect(controlDir.valueChanges).toBe(control.valueChanges);
                testing_internal_1.expect(controlDir.disabled).toBe(control.disabled);
                testing_internal_1.expect(controlDir.enabled).toBe(control.enabled);
            };
            testing_internal_1.beforeEach(function () {
                controlDir = new forms_1.FormControlDirective([forms_1.Validators.required], [], [defaultAccessor]);
                controlDir.valueAccessor = new DummyControlValueAccessor();
                control = new forms_1.FormControl(null);
                controlDir.form = control;
            });
            testing_internal_1.it('should reexport control properties', function () { checkProperties(control); });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlDir.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(controlDir.getError('required')).toBe(control.getError('required'));
                control.setErrors({ required: true });
                testing_internal_1.expect(controlDir.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(controlDir.getError('required')).toBe(control.getError('required'));
            });
            testing_internal_1.it('should reexport new control properties', function () {
                var newControl = new forms_1.FormControl(null);
                controlDir.form = newControl;
                controlDir.ngOnChanges({ 'form': new core_1.SimpleChange(control, newControl, false) });
                checkProperties(newControl);
            });
            testing_internal_1.it('should set up validator', function () {
                testing_internal_1.expect(control.valid).toBe(true);
                // this will add the required validator and recalculate the validity
                controlDir.ngOnChanges({ 'form': new core_1.SimpleChange(null, control, false) });
                testing_internal_1.expect(control.valid).toBe(false);
            });
        });
        testing_internal_1.describe('NgModel', function () {
            var ngModel;
            var control;
            testing_internal_1.beforeEach(function () {
                ngModel = new forms_1.NgModel(null, [forms_1.Validators.required], [asyncValidator('expected')], [defaultAccessor]);
                ngModel.valueAccessor = new DummyControlValueAccessor();
                control = ngModel.control;
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(ngModel.control).toBe(control);
                testing_internal_1.expect(ngModel.value).toBe(control.value);
                testing_internal_1.expect(ngModel.valid).toBe(control.valid);
                testing_internal_1.expect(ngModel.invalid).toBe(control.invalid);
                testing_internal_1.expect(ngModel.pending).toBe(control.pending);
                testing_internal_1.expect(ngModel.errors).toBe(control.errors);
                testing_internal_1.expect(ngModel.pristine).toBe(control.pristine);
                testing_internal_1.expect(ngModel.dirty).toBe(control.dirty);
                testing_internal_1.expect(ngModel.touched).toBe(control.touched);
                testing_internal_1.expect(ngModel.untouched).toBe(control.untouched);
                testing_internal_1.expect(ngModel.statusChanges).toBe(control.statusChanges);
                testing_internal_1.expect(ngModel.valueChanges).toBe(control.valueChanges);
                testing_internal_1.expect(ngModel.disabled).toBe(control.disabled);
                testing_internal_1.expect(ngModel.enabled).toBe(control.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(ngModel.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(ngModel.getError('required')).toBe(control.getError('required'));
                control.setErrors({ required: true });
                testing_internal_1.expect(ngModel.hasError('required')).toBe(control.hasError('required'));
                testing_internal_1.expect(ngModel.getError('required')).toBe(control.getError('required'));
            });
            testing_internal_1.it('should throw when no value accessor with named control', function () {
                var namedDir = new forms_1.NgModel(null, null, null, null);
                namedDir.name = 'one';
                testing_internal_1.expect(function () { return namedDir.ngOnChanges({}); })
                    .toThrowError(new RegExp("No value accessor for form control with name: 'one'"));
            });
            testing_internal_1.it('should throw when no value accessor with unnamed control', function () {
                var unnamedDir = new forms_1.NgModel(null, null, null, null);
                testing_internal_1.expect(function () { return unnamedDir.ngOnChanges({}); })
                    .toThrowError(new RegExp("No value accessor for form control with unspecified name attribute"));
            });
            testing_internal_1.it('should set up validator', testing_1.fakeAsync(function () {
                // this will add the required validator and recalculate the validity
                ngModel.ngOnChanges({});
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.errors).toEqual({ 'required': true });
                ngModel.control.setValue('someValue');
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.errors).toEqual({ 'async': true });
            }));
            testing_internal_1.it('should mark as disabled properly', testing_1.fakeAsync(function () {
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', undefined, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', null, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', false, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', 'false', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange('', 0, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(false);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, '', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, 'true', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, true, false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
                ngModel.ngOnChanges({ isDisabled: new core_1.SimpleChange(null, 'anything else', false) });
                testing_1.tick();
                testing_internal_1.expect(ngModel.control.disabled).toEqual(true);
            }));
        });
        testing_internal_1.describe('FormControlName', function () {
            var formModel /** TODO #9100 */;
            var controlNameDir /** TODO #9100 */;
            testing_internal_1.beforeEach(function () {
                formModel = new forms_1.FormControl('name');
                var parent = new forms_1.FormGroupDirective([], []);
                parent.form = new forms_1.FormGroup({ 'name': formModel });
                controlNameDir = new forms_1.FormControlName(parent, [], [], [defaultAccessor]);
                controlNameDir.name = 'name';
                controlNameDir._control = formModel;
            });
            testing_internal_1.it('should reexport control properties', function () {
                testing_internal_1.expect(controlNameDir.control).toBe(formModel);
                testing_internal_1.expect(controlNameDir.value).toBe(formModel.value);
                testing_internal_1.expect(controlNameDir.valid).toBe(formModel.valid);
                testing_internal_1.expect(controlNameDir.invalid).toBe(formModel.invalid);
                testing_internal_1.expect(controlNameDir.pending).toBe(formModel.pending);
                testing_internal_1.expect(controlNameDir.errors).toBe(formModel.errors);
                testing_internal_1.expect(controlNameDir.pristine).toBe(formModel.pristine);
                testing_internal_1.expect(controlNameDir.dirty).toBe(formModel.dirty);
                testing_internal_1.expect(controlNameDir.touched).toBe(formModel.touched);
                testing_internal_1.expect(controlNameDir.untouched).toBe(formModel.untouched);
                testing_internal_1.expect(controlNameDir.statusChanges).toBe(formModel.statusChanges);
                testing_internal_1.expect(controlNameDir.valueChanges).toBe(formModel.valueChanges);
                testing_internal_1.expect(controlNameDir.disabled).toBe(formModel.disabled);
                testing_internal_1.expect(controlNameDir.enabled).toBe(formModel.enabled);
            });
            testing_internal_1.it('should reexport control methods', function () {
                testing_internal_1.expect(controlNameDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlNameDir.getError('required')).toBe(formModel.getError('required'));
                formModel.setErrors({ required: true });
                testing_internal_1.expect(controlNameDir.hasError('required')).toBe(formModel.hasError('required'));
                testing_internal_1.expect(controlNameDir.getError('required')).toBe(formModel.getError('required'));
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC9kaXJlY3RpdmVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMkM7QUFDM0MsaURBQXVFO0FBQ3ZFLCtFQUE0RjtBQUM1Rix3Q0FBd1k7QUFDeFksbURBQWdGO0FBQ2hGLGlDQUF1RDtBQUV2RDtJQUFBO0lBT0EsQ0FBQztJQUpDLG9EQUFnQixHQUFoQixVQUFpQixFQUFPLElBQUcsQ0FBQztJQUM1QixxREFBaUIsR0FBakIsVUFBa0IsRUFBTyxJQUFHLENBQUM7SUFFN0IsOENBQVUsR0FBVixVQUFXLEdBQVEsSUFBVSxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekQsZ0NBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEO0lBQUE7SUFFQSxDQUFDO0lBREMsMkNBQVEsR0FBUixVQUFTLENBQWMsSUFBc0IsTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSwrQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQsd0JBQXdCLFFBQWEsRUFBRSxPQUFXO0lBQVgsd0JBQUEsRUFBQSxXQUFXO0lBQ2hELE1BQU0sQ0FBQyxVQUFDLENBQWtCO1FBQ3hCLElBQUksT0FBTyxHQUEwQixTQUFXLENBQUM7UUFDakQsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxHQUFHLElBQUksQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUks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SyxDQUFDLENBQUM7Z0JBQ3pDLHlCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzdDLHlCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2pELHlCQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pELHlCQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3ZELHlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLHlCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBRSxDQUFDLGlDQUFpQyxFQUFFO2dCQUNwQyx5QkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSx5QkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUV2RSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7Z0JBQ3RDLHlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUs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TyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLHlCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLHlCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLHlCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVDLHlCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELHlCQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLHlCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLHlCQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELHlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzFELHlCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hELHlCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELHlCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMs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