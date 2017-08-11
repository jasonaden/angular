"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var value_accessor_integration_spec_1 = require("./value_accessor_integration_spec");
function main() {
    describe('template-driven forms integration tests', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        describe('basic functionality', function () {
            it('should support ngModel for standalone fields', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                // view -> model
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
            it('should support ngModel registration with a parent form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'Nancy';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: 'Nancy' });
                expect(form.valid).toBe(false);
            }));
            it('should add novalidate by default to form element', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.getAttribute('novalidate')).toEqual('');
            }));
            it('should be possible to use native validation and angular forms', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelNativeValidateForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.hasAttribute('novalidate')).toEqual(false);
            }));
            it('should support ngModelGroup', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                // model -> view
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('Nancy');
                expect(inputs[1].nativeElement.value).toEqual('Drew');
                inputs[0].nativeElement.value = 'Carson';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                testing_1.tick();
                // view -> model
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: { first: 'Carson', last: 'Drew' }, email: 'some email' });
            }));
            it('should add controls and control groups to form control model', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('name').value).toEqual({ first: 'Nancy', last: 'Drew' });
                expect(form.control.get('name.first').value).toEqual('Nancy');
                expect(form.control.get('email').value).toEqual('some email');
            }));
            it('should remove controls and control groups from form control model', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelNgIfForm);
                fixture.componentInstance.emailShowing = true;
                fixture.componentInstance.first = 'Nancy';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('email').value).toEqual('some email');
                expect(form.value).toEqual({ name: { first: 'Nancy' }, email: 'some email' });
                // should remove individual control successfully
                fixture.componentInstance.emailShowing = false;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.control.get('email')).toBe(null);
                expect(form.value).toEqual({ name: { first: 'Nancy' } });
                expect(form.control.get('name').value).toEqual({ first: 'Nancy' });
                expect(form.control.get('name.first').value).toEqual('Nancy');
                // should remove form group successfully
                fixture.componentInstance.groupShowing = false;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.control.get('name')).toBe(null);
                expect(form.control.get('name.first')).toBe(null);
                expect(form.value).toEqual({});
            }));
            it('should set status classes with ngModel', testing_1.async(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                    input.value = 'updatedValue';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                });
            }));
            it('should set status classes with ngModel and async validators', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelAsyncValidation, NgAsyncValidator);
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-untouched']);
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-touched']);
                    input.value = 'updatedValue';
                    browser_util_1.dispatchEvent(input, 'input');
                    testing_1.tick();
                    fixture.detectChanges();
                    expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                });
            }));
            it('should set status classes with ngModelGroup and ngForm', testing_1.async(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.first = '';
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                var modelGroup = fixture.debugElement.query(by_1.By.css('[ngModelGroup]')).nativeElement;
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                // ngModelGroup creates its control asynchronously
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual([
                        'ng-invalid', 'ng-pristine', 'ng-untouched'
                    ]);
                    expect(sortedClassList(form)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual([
                        'ng-invalid', 'ng-pristine', 'ng-touched'
                    ]);
                    expect(sortedClassList(form)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                    input.value = 'updatedValue';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(sortedClassList(modelGroup)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                    expect(sortedClassList(form)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
                });
            }));
            it('should not create a template-driven form when ngNoForm is used', function () {
                var fixture = initTest(NgNoFormComp);
                fixture.detectChanges();
                expect(fixture.debugElement.children[0].providerTokens.length).toEqual(0);
            });
            it('should not add novalidate when ngNoForm is used', function () {
                var fixture = initTest(NgNoFormComp);
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.hasAttribute('novalidate')).toEqual(false);
            });
        });
        describe('name and ngModelOptions', function () {
            it('should throw if ngModel has a parent form but no name attr or standalone label', function () {
                var fixture = initTest(InvalidNgModelNoName);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("name attribute must be set"));
            });
            it('should not throw if ngModel has a parent form, no name attr, and a standalone label', function () {
                var fixture = initTest(NgModelOptionsStandalone);
                expect(function () { return fixture.detectChanges(); }).not.toThrow();
            });
            it('should not register standalone ngModels with parent form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelOptionsStandalone);
                fixture.componentInstance.one = 'some data';
                fixture.componentInstance.two = 'should not show';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                testing_1.tick();
                expect(form.value).toEqual({ one: 'some data' });
                expect(inputs[1].nativeElement.value).toEqual('should not show');
            }));
            it('should override name attribute with ngModelOptions name if provided', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.options = { name: 'override' };
                fixture.componentInstance.name = 'some data';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ override: 'some data' });
            }));
        });
        describe('submit and reset events', function () {
            it('should emit ngSubmit event with the original submit event on submit', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.event = null;
                var form = fixture.debugElement.query(by_1.By.css('form'));
                browser_util_1.dispatchEvent(form.nativeElement, 'submit');
                testing_1.tick();
                expect(fixture.componentInstance.event.type).toEqual('submit');
            }));
            it('should mark NgForm as submitted on submit event', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.submitted).toBe(false);
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                testing_1.tick();
                expect(form.submitted).toBe(true);
            }));
            it('should reset the form to empty when reset event is fired', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.componentInstance.name = 'should be cleared';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var formEl = fixture.debugElement.query(by_1.By.css('form'));
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toBe('should be cleared'); // view value
                expect(fixture.componentInstance.name).toBe('should be cleared'); // ngModel value
                expect(form.value.name).toEqual('should be cleared'); // control value
                browser_util_1.dispatchEvent(formEl.nativeElement, 'reset');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toBe(''); // view value
                expect(fixture.componentInstance.name).toBe(null); // ngModel value
                expect(form.value.name).toEqual(null); // control value
            }));
            it('should reset the form submit state when reset button is clicked', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var formEl = fixture.debugElement.query(by_1.By.css('form'));
                browser_util_1.dispatchEvent(formEl.nativeElement, 'submit');
                fixture.detectChanges();
                testing_1.tick();
                expect(form.submitted).toBe(true);
                browser_util_1.dispatchEvent(formEl.nativeElement, 'reset');
                fixture.detectChanges();
                testing_1.tick();
                expect(form.submitted).toBe(false);
            }));
        });
        describe('valueChange and statusChange events', function () {
            it('should emit valueChanges and statusChanges on init', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                expect(form.valid).toEqual(true);
                expect(form.value).toEqual({});
                var formValidity = undefined;
                var formValue = undefined;
                form.statusChanges.subscribe(function (status) { return formValidity = status; });
                form.valueChanges.subscribe(function (value) { return formValue = value; });
                testing_1.tick();
                expect(formValidity).toEqual('INVALID');
                expect(formValue).toEqual({ name: 'aa' });
            }));
            it('should mark controls dirty before emitting the value change event', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm).form;
                fixture.detectChanges();
                testing_1.tick();
                form.get('name').valueChanges.subscribe(function () { expect(form.get('name').dirty).toBe(true); });
                var inputEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                inputEl.value = 'newValue';
                browser_util_1.dispatchEvent(inputEl, 'input');
            }));
            it('should mark controls pristine before emitting the value change event when resetting ', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm).form;
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                var inputEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                inputEl.value = 'newValue';
                browser_util_1.dispatchEvent(inputEl, 'input');
                expect(form.get('name').pristine).toBe(false);
                form.get('name').valueChanges.subscribe(function () { expect(form.get('name').pristine).toBe(true); });
                browser_util_1.dispatchEvent(formEl, 'reset');
            }));
        });
        describe('disabled controls', function () {
            it('should not consider disabled controls in value or validation', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.isDisabled = false;
                fixture.componentInstance.first = '';
                fixture.componentInstance.last = 'Drew';
                fixture.componentInstance.email = 'some email';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.value).toEqual({ name: { first: '', last: 'Drew' }, email: 'some email' });
                expect(form.valid).toBe(false);
                expect(form.control.get('name.first').disabled).toBe(false);
                fixture.componentInstance.isDisabled = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.value).toEqual({ name: { last: 'Drew' }, email: 'some email' });
                expect(form.valid).toBe(true);
                expect(form.control.get('name.first').disabled).toBe(true);
            }));
            it('should add disabled attribute in the UI if disable() is called programmatically', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelGroupForm);
                fixture.componentInstance.isDisabled = false;
                fixture.componentInstance.first = 'Nancy';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                form.control.get('name.first').disable();
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css("[name=\"first\"]"));
                expect(input.nativeElement.disabled).toBe(true);
            }));
            it('should disable a custom control if disabled attr is added', testing_1.async(function () {
                var fixture = initTest(value_accessor_integration_spec_1.NgModelCustomWrapper, value_accessor_integration_spec_1.NgModelCustomComp);
                fixture.componentInstance.name = 'Nancy';
                fixture.componentInstance.isDisabled = true;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                        expect(form.control.get('name').disabled).toBe(true);
                        var customInput = fixture.debugElement.query(by_1.By.css('[name="custom"]'));
                        expect(customInput.nativeElement.disabled).toEqual(true);
                    });
                });
            }));
            it('should disable a control with unbound disabled attr', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(NgModelForm, {
                    set: {
                        template: "\n            <form>\n             <input name=\"name\" [(ngModel)]=\"name\" disabled>\n            </form>\n          ",
                    }
                });
                var fixture = initTest(NgModelForm);
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.get('name').disabled).toBe(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.disabled).toEqual(true);
                form.control.enable();
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.disabled).toEqual(false);
            }));
        });
        describe('validation directives', function () {
            it('required validator should validate checkbox', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelCheckboxRequiredValidator);
                fixture.detectChanges();
                testing_1.tick();
                var control = fixture.debugElement.children[0].injector.get(forms_1.NgForm).control.get('checkbox');
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(false);
                fixture.componentInstance.required = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(true);
                input.nativeElement.checked = true;
                browser_util_1.dispatchEvent(input.nativeElement, 'change');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(true);
                expect(control.hasError('required')).toBe(false);
                input.nativeElement.checked = false;
                browser_util_1.dispatchEvent(input.nativeElement, 'change');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toBe(true);
            }));
            it('should validate email', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelEmailValidator);
                fixture.detectChanges();
                testing_1.tick();
                var control = fixture.debugElement.children[0].injector.get(forms_1.NgForm).control.get('email');
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(control.hasError('email')).toBe(false);
                fixture.componentInstance.validatorEnabled = true;
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('');
                expect(control.hasError('email')).toBe(true);
                input.nativeElement.value = 'test@gmail.com';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('test@gmail.com');
                expect(control.hasError('email')).toBe(false);
                input.nativeElement.value = 'text';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(input.nativeElement.value).toEqual('text');
                expect(control.hasError('email')).toBe(true);
            }));
            it('should support dir validators using bindings', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidationBindings);
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                testing_1.tick();
                var required = fixture.debugElement.query(by_1.By.css('[name=required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[name=minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[name=maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[name=pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                fixture.detectChanges();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.hasError('required', ['required'])).toEqual(true);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(true);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(true);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            }));
            it('should support optional fields with string pattern validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.pattern = '[a-z]+';
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('pattern', ['tovalidate'])).toBeTruthy();
            }));
            it('should support optional fields with RegExp pattern validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.pattern = /^[a-z]+$/;
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('pattern', ['tovalidate'])).toBeTruthy();
            }));
            it('should support optional fields with minlength validator', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelMultipleValidators);
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = 2;
                fixture.detectChanges();
                testing_1.tick();
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeTruthy();
                input.nativeElement.value = '1';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(form.valid).toBeFalsy();
                expect(form.control.hasError('minlength', ['tovalidate'])).toBeTruthy();
            }));
            it('changes on bound properties should change the validation state of the form', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidationBindings);
                fixture.detectChanges();
                testing_1.tick();
                var required = fixture.debugElement.query(by_1.By.css('[name=required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[name=minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[name=maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[name=pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                expect(form.control.hasError('required', ['required'])).toEqual(false);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(false);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(false);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.control.hasError('required', ['required'])).toEqual(true);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(true);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(true);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(true);
                expect(form.valid).toEqual(false);
                expect(required.nativeElement.getAttribute('required')).toEqual('');
                expect(fixture.componentInstance.minLen.toString())
                    .toEqual(minLength.nativeElement.getAttribute('minlength'));
                expect(fixture.componentInstance.maxLen.toString())
                    .toEqual(maxLength.nativeElement.getAttribute('maxlength'));
                expect(fixture.componentInstance.pattern.toString())
                    .toEqual(pattern.nativeElement.getAttribute('pattern'));
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = null;
                fixture.componentInstance.maxLen = null;
                fixture.componentInstance.pattern = null;
                fixture.detectChanges();
                expect(form.control.hasError('required', ['required'])).toEqual(false);
                expect(form.control.hasError('minlength', ['minlength'])).toEqual(false);
                expect(form.control.hasError('maxlength', ['maxlength'])).toEqual(false);
                expect(form.control.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                expect(required.nativeElement.getAttribute('required')).toEqual(null);
                expect(required.nativeElement.getAttribute('minlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('maxlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('pattern')).toEqual(null);
            }));
        });
        describe('IME events', function () {
            it('should determine IME event handling depending on platform by default', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                var isAndroid = /android (\d+)/.test(dom_adapter_1.getDOM().getUserAgent().toLowerCase());
                if (isAndroid) {
                    // On Android, values should update immediately
                    expect(fixture.componentInstance.name).toEqual('updatedValue');
                }
                else {
                    // On other platforms, values should wait until compositionend
                    expect(fixture.componentInstance.name).toEqual('oldValue');
                    inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(fixture.componentInstance.name).toEqual('updatedValue');
                }
            }));
            it('should hold IME events until compositionend if composition mode', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(StandaloneNgModel, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: true }] } });
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                // ngModel should not update when compositionstart
                expect(fixture.componentInstance.name).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                fixture.detectChanges();
                testing_1.tick();
                // ngModel should update when compositionend
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
            it('should work normally with composition events if composition mode is off', testing_1.fakeAsync(function () {
                testing_1.TestBed.overrideComponent(StandaloneNgModel, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: false }] } });
                var fixture = initTest(StandaloneNgModel);
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                fixture.componentInstance.name = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                testing_1.tick();
                // ngModel should update normally
                expect(fixture.componentInstance.name).toEqual('updatedValue');
            }));
        });
        describe('ngModel corner cases', function () {
            it('should update the view when the model is set back to what used to be in the view', testing_1.fakeAsync(function () {
                var fixture = initTest(StandaloneNgModel);
                fixture.componentInstance.name = '';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'aa';
                input.selectionStart = 1;
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.name).toEqual('aa');
                // Programmatically update the input value to be "bb".
                fixture.componentInstance.name = 'bb';
                fixture.detectChanges();
                testing_1.tick();
                expect(input.value).toEqual('bb');
                // Programatically set it back to "aa".
                fixture.componentInstance.name = 'aa';
                fixture.detectChanges();
                testing_1.tick();
                expect(input.value).toEqual('aa');
            }));
            it('should not crash when validity is checked from a binding', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelValidBinding);
                testing_1.tick();
                expect(function () { return fixture.detectChanges(); }).not.toThrowError();
            }));
        });
    });
}
exports.main = main;
var StandaloneNgModel = (function () {
    function StandaloneNgModel() {
    }
    return StandaloneNgModel;
}());
StandaloneNgModel = __decorate([
    core_1.Component({
        selector: 'standalone-ng-model',
        template: "\n    <input type=\"text\" [(ngModel)]=\"name\">\n  "
    })
], StandaloneNgModel);
var NgModelForm = (function () {
    function NgModelForm() {
        this.options = {};
    }
    NgModelForm.prototype.onReset = function () { };
    return NgModelForm;
}());
NgModelForm = __decorate([
    core_1.Component({
        selector: 'ng-model-form',
        template: "\n    <form (ngSubmit)=\"event=$event\" (reset)=\"onReset()\">\n      <input name=\"name\" [(ngModel)]=\"name\" minlength=\"10\" [ngModelOptions]=\"options\">\n    </form>\n  "
    })
], NgModelForm);
var NgModelNativeValidateForm = (function () {
    function NgModelNativeValidateForm() {
    }
    return NgModelNativeValidateForm;
}());
NgModelNativeValidateForm = __decorate([
    core_1.Component({ selector: 'ng-model-native-validate-form', template: "<form ngNativeValidate></form>" })
], NgModelNativeValidateForm);
var NgModelGroupForm = (function () {
    function NgModelGroupForm() {
    }
    return NgModelGroupForm;
}());
NgModelGroupForm = __decorate([
    core_1.Component({
        selector: 'ng-model-group-form',
        template: "\n    <form>\n      <div ngModelGroup=\"name\">\n        <input name=\"first\" [(ngModel)]=\"first\" required [disabled]=\"isDisabled\">\n        <input name=\"last\" [(ngModel)]=\"last\">\n      </div>\n      <input name=\"email\" [(ngModel)]=\"email\">\n    </form>\n  "
    })
], NgModelGroupForm);
var NgModelValidBinding = (function () {
    function NgModelValidBinding() {
    }
    return NgModelValidBinding;
}());
NgModelValidBinding = __decorate([
    core_1.Component({
        selector: 'ng-model-valid-binding',
        template: "\n    <form>\n      <div ngModelGroup=\"name\" #group=\"ngModelGroup\">\n        <input name=\"first\" [(ngModel)]=\"first\" required>\n        {{ group.valid }}\n      </div>\n    </form>\n  "
    })
], NgModelValidBinding);
var NgModelNgIfForm = (function () {
    function NgModelNgIfForm() {
        this.groupShowing = true;
        this.emailShowing = true;
    }
    return NgModelNgIfForm;
}());
NgModelNgIfForm = __decorate([
    core_1.Component({
        selector: 'ng-model-ngif-form',
        template: "\n    <form>\n      <div ngModelGroup=\"name\" *ngIf=\"groupShowing\">\n        <input name=\"first\" [(ngModel)]=\"first\">\n      </div>\n      <input name=\"email\" [(ngModel)]=\"email\" *ngIf=\"emailShowing\">\n    </form>\n  "
    })
], NgModelNgIfForm);
var NgNoFormComp = (function () {
    function NgNoFormComp() {
    }
    return NgNoFormComp;
}());
NgNoFormComp = __decorate([
    core_1.Component({
        selector: 'ng-no-form',
        template: "\n    <form ngNoForm>\n      <input name=\"name\">\n    </form>\n  "
    })
], NgNoFormComp);
var InvalidNgModelNoName = (function () {
    function InvalidNgModelNoName() {
    }
    return InvalidNgModelNoName;
}());
InvalidNgModelNoName = __decorate([
    core_1.Component({
        selector: 'invalid-ng-model-noname',
        template: "\n    <form>\n      <input [(ngModel)]=\"name\">\n    </form>\n  "
    })
], InvalidNgModelNoName);
var NgModelOptionsStandalone = (function () {
    function NgModelOptionsStandalone() {
    }
    return NgModelOptionsStandalone;
}());
NgModelOptionsStandalone = __decorate([
    core_1.Component({
        selector: 'ng-model-options-standalone',
        template: "\n    <form>\n      <input name=\"one\" [(ngModel)]=\"one\">\n      <input [(ngModel)]=\"two\" [ngModelOptions]=\"{standalone: true}\">\n    </form>\n  "
    })
], NgModelOptionsStandalone);
var NgModelValidationBindings = (function () {
    function NgModelValidationBindings() {
    }
    return NgModelValidationBindings;
}());
NgModelValidationBindings = __decorate([
    core_1.Component({
        selector: 'ng-model-validation-bindings',
        template: "\n    <form>\n      <input name=\"required\" ngModel  [required]=\"required\">\n      <input name=\"minlength\" ngModel  [minlength]=\"minLen\">\n      <input name=\"maxlength\" ngModel [maxlength]=\"maxLen\">\n      <input name=\"pattern\" ngModel  [pattern]=\"pattern\">\n    </form>\n  "
    })
], NgModelValidationBindings);
var NgModelMultipleValidators = (function () {
    function NgModelMultipleValidators() {
    }
    return NgModelMultipleValidators;
}());
NgModelMultipleValidators = __decorate([
    core_1.Component({
        selector: 'ng-model-multiple-validators',
        template: "\n    <form>\n      <input name=\"tovalidate\" ngModel  [required]=\"required\" [minlength]=\"minLen\" [pattern]=\"pattern\">\n    </form>\n  "
    })
], NgModelMultipleValidators);
var NgModelCheckboxRequiredValidator = (function () {
    function NgModelCheckboxRequiredValidator() {
        this.accepted = false;
        this.required = false;
    }
    return NgModelCheckboxRequiredValidator;
}());
NgModelCheckboxRequiredValidator = __decorate([
    core_1.Component({
        selector: 'ng-model-checkbox-validator',
        template: "<form><input type=\"checkbox\" [(ngModel)]=\"accepted\" [required]=\"required\" name=\"checkbox\"></form>"
    })
], NgModelCheckboxRequiredValidator);
var NgModelEmailValidator = (function () {
    function NgModelEmailValidator() {
        this.validatorEnabled = false;
    }
    return NgModelEmailValidator;
}());
NgModelEmailValidator = __decorate([
    core_1.Component({
        selector: 'ng-model-email',
        template: "<form><input type=\"email\" ngModel [email]=\"validatorEnabled\" name=\"email\"></form>"
    })
], NgModelEmailValidator);
var NgAsyncValidator = NgAsyncValidator_1 = (function () {
    function NgAsyncValidator() {
    }
    NgAsyncValidator.prototype.validate = function (c) { return Promise.resolve(null); };
    return NgAsyncValidator;
}());
NgAsyncValidator = NgAsyncValidator_1 = __decorate([
    core_1.Directive({
        selector: '[ng-async-validator]',
        providers: [
            { provide: forms_1.NG_ASYNC_VALIDATORS, useExisting: core_1.forwardRef(function () { return NgAsyncValidator_1; }), multi: true }
        ]
    })
], NgAsyncValidator);
var NgModelAsyncValidation = (function () {
    function NgModelAsyncValidation() {
    }
    return NgModelAsyncValidation;
}());
NgModelAsyncValidation = __decorate([
    core_1.Component({
        selector: 'ng-model-async-validation',
        template: "<input name=\"async\" ngModel ng-async-validator>"
    })
], NgModelAsyncValidation);
function sortedClassList(el) {
    var l = dom_adapter_1.getDOM().classList(el);
    l.sort();
    return l;
}
var NgAsyncValidator_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvdGVtcGxhdGVfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFxRTtBQUNyRSxpREFBd0Y7QUFDeEYsd0NBQWtJO0FBQ2xJLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsbUZBQWlGO0FBQ2pGLHFGQUEwRjtBQUUxRjtJQUNFLFFBQVEsQ0FBQyx5Q0FBeUMsRUFBRTtRQUVsRCxrQkFBcUIsU0FBa0I7WUFBRSxvQkFBMEI7aUJBQTFCLFVBQTBCLEVBQTFCLHFCQUEwQixFQUExQixJQUEwQjtnQkFBMUIsbUNBQTBCOztZQUNqRSxpQkFBTyxDQUFDLHNCQUFzQixDQUMxQixFQUFDLFlBQVksR0FBRyxTQUFTLFNBQUssVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQVcsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsaUJBQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixFQUFFLENBQUMsOENBQThDLEVBQUUsbUJBQVMsQ0FBQztnQkFDeEQsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzVDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO2dCQUU1QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGNBQUksRUFBRSxDQUFDO2dCQUVQLGdCQUFnQjtnQkFDaEIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEs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