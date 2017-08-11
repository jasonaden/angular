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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var merge_1 = require("rxjs/observable/merge");
var timer_1 = require("rxjs/observable/timer");
var do_1 = require("rxjs/operator/do");
var value_accessor_integration_spec_1 = require("./value_accessor_integration_spec");
function main() {
    describe('reactive forms integration tests', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule, forms_1.ReactiveFormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        describe('basic functionality', function () {
            it('should work with single controls', function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('old value');
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('old value');
                input.nativeElement.value = 'updated value';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                // view -> model
                expect(control.value).toEqual('updated value');
            });
            it('should work with formGroups (model -> view)', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('loginValue');
            });
            it('should add novalidate by default to form', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var form = fixture.debugElement.query(by_1.By.css('form'));
                expect(form.nativeElement.getAttribute('novalidate')).toEqual('');
            });
            it('work with formGroups (view -> model)', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'updatedValue';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.value).toEqual({ 'login': 'updatedValue' });
            });
        });
        describe('re-bound form groups', function () {
            it('should update DOM elements initially', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.detectChanges();
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('newValue') });
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('newValue');
            });
            it('should update model when UI changes', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({ 'login': new forms_1.FormControl('newValue') });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'Nancy';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                expect(newForm.value).toEqual({ login: 'Nancy' });
                newForm.setValue({ login: 'Carson' });
                fixture.detectChanges();
                expect(input.nativeElement.value).toEqual('Carson');
            });
            it('should update nested form group model when UI changes', function () {
                var fixture = initTest(NestedFormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(), 'password': new forms_1.FormControl() }) });
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl('Nancy'), 'password': new forms_1.FormControl('secret') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('Nancy');
                expect(inputs[1].nativeElement.value).toEqual('secret');
                inputs[0].nativeElement.value = 'Carson';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                expect(newForm.value).toEqual({ signin: { login: 'Carson', password: 'secret' } });
                newForm.setValue({ signin: { login: 'Bess', password: 'otherpass' } });
                fixture.detectChanges();
                expect(inputs[0].nativeElement.value).toEqual('Bess');
            });
            it('should pick up dir validators from form controls', function () {
                var fixture = initTest(LoginIsEmptyWrapper, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.get('login').errors).toEqual({ required: true });
                var newForm = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                expect(newForm.get('login').errors).toEqual({ required: true });
            });
            it('should pick up dir validators from nested form groups', function () {
                var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.get('signin').valid).toBe(false);
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                expect(form.get('signin').valid).toBe(false);
            });
            it('should strip named controls that are not found', function () {
                var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                form.addControl('email', new forms_1.FormControl('email'));
                fixture.detectChanges();
                var emailInput = fixture.debugElement.query(by_1.By.css('[formControlName="email"]'));
                expect(emailInput.nativeElement.value).toEqual('email');
                var newForm = new forms_1.FormGroup({
                    'signin': new forms_1.FormGroup({ 'login': new forms_1.FormControl(''), 'password': new forms_1.FormControl('') })
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                emailInput = fixture.debugElement.query(by_1.By.css('[formControlName="email"]'));
                expect(emailInput).toBe(null);
            });
            it('should strip array controls that are not found', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).not.toBeDefined();
                cityArray.push(new forms_1.FormControl('LA'));
                fixture.detectChanges();
                inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).toBeDefined();
                var newArr = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var newForm = new forms_1.FormGroup({ cities: newArr });
                fixture.componentInstance.form = newForm;
                fixture.componentInstance.cityArray = newArr;
                fixture.detectChanges();
                inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2]).not.toBeDefined();
            });
            describe('nested control rebinding', function () {
                it('should attach dir to control when leaf control changes', function () {
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
                    var fixture = initTest(FormGroupComp);
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.removeControl('login');
                    form.addControl('login', new forms_1.FormControl('newValue'));
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('newValue');
                    input.nativeElement.value = 'user input';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ login: 'user input' });
                    form.setValue({ login: 'Carson' });
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('Carson');
                });
                it('should attach dirs to all child controls when group control changes', function () {
                    var fixture = initTest(NestedFormGroupComp, LoginIsEmptyValidator);
                    var form = new forms_1.FormGroup({
                        signin: new forms_1.FormGroup({ login: new forms_1.FormControl('oldLogin'), password: new forms_1.FormControl('oldPassword') })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.removeControl('signin');
                    form.addControl('signin', new forms_1.FormGroup({ login: new forms_1.FormControl('newLogin'), password: new forms_1.FormControl('newPassword') }));
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.value).toEqual('newLogin');
                    expect(inputs[1].nativeElement.value).toEqual('newPassword');
                    inputs[0].nativeElement.value = 'user input';
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ signin: { login: 'user input', password: 'newPassword' } });
                    form.setValue({ signin: { login: 'Carson', password: 'Drew' } });
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.value).toEqual('Carson');
                    expect(inputs[1].nativeElement.value).toEqual('Drew');
                });
                it('should attach dirs to all present child controls when array control changes', function () {
                    var fixture = initTest(FormArrayComp);
                    var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                    var form = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    form.removeControl('cities');
                    form.addControl('cities', new forms_1.FormArray([new forms_1.FormControl('LA')]));
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('LA');
                    input.nativeElement.value = 'MTV';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ cities: ['MTV'] });
                    form.setValue({ cities: ['LA'] });
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('LA');
                });
            });
        });
        describe('form arrays', function () {
            it('should support form arrays', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                // model -> view
                expect(inputs[0].nativeElement.value).toEqual('SF');
                expect(inputs[1].nativeElement.value).toEqual('NY');
                expect(form.value).toEqual({ cities: ['SF', 'NY'] });
                inputs[0].nativeElement.value = 'LA';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                //  view -> model
                expect(form.value).toEqual({ cities: ['LA', 'NY'] });
            });
            it('should support pushing new controls to form arrays', function () {
                var fixture = initTest(FormArrayComp);
                var cityArray = new forms_1.FormArray([new forms_1.FormControl('SF'), new forms_1.FormControl('NY')]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                cityArray.push(new forms_1.FormControl('LA'));
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[2].nativeElement.value).toEqual('LA');
                expect(form.value).toEqual({ cities: ['SF', 'NY', 'LA'] });
            });
            it('should support form groups nested in form arrays', function () {
                var fixture = initTest(FormArrayNestedGroup);
                var cityArray = new forms_1.FormArray([
                    new forms_1.FormGroup({ town: new forms_1.FormControl('SF'), state: new forms_1.FormControl('CA') }),
                    new forms_1.FormGroup({ town: new forms_1.FormControl('NY'), state: new forms_1.FormControl('NY') })
                ]);
                var form = new forms_1.FormGroup({ cities: cityArray });
                fixture.componentInstance.form = form;
                fixture.componentInstance.cityArray = cityArray;
                fixture.detectChanges();
                var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                expect(inputs[0].nativeElement.value).toEqual('SF');
                expect(inputs[1].nativeElement.value).toEqual('CA');
                expect(inputs[2].nativeElement.value).toEqual('NY');
                expect(inputs[3].nativeElement.value).toEqual('NY');
                expect(form.value).toEqual({
                    cities: [{ town: 'SF', state: 'CA' }, { town: 'NY', state: 'NY' }]
                });
                inputs[0].nativeElement.value = 'LA';
                browser_util_1.dispatchEvent(inputs[0].nativeElement, 'input');
                fixture.detectChanges();
                expect(form.value).toEqual({
                    cities: [{ town: 'LA', state: 'CA' }, { town: 'NY', state: 'NY' }]
                });
            });
        });
        describe('programmatic changes', function () {
            it('should update the value in the DOM when setValue() is called', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                login.setValue('newValue');
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('newValue');
            });
            describe('disabled controls', function () {
                it('should add disabled attribute to an individual control when instantiated as disabled', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl({ value: 'some value', disabled: true });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to formControlName when instantiated as disabled', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl({ value: 'some value', disabled: true });
                    fixture.componentInstance.form = new forms_1.FormGroup({ login: control });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to an individual control when disable() is called', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('some value');
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.disable();
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.disabled).toBe(true);
                    control.enable();
                    fixture.detectChanges();
                    expect(input.nativeElement.disabled).toBe(false);
                });
                it('should add disabled attribute to child controls when disable() is called on group', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('login') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.disable();
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    form.enable();
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.disabled).toBe(false);
                });
                it('should not add disabled attribute to custom controls when disable() is called', function () {
                    var fixture = initTest(value_accessor_integration_spec_1.MyInputForm, value_accessor_integration_spec_1.MyInput);
                    var control = new forms_1.FormControl('some value');
                    fixture.componentInstance.form = new forms_1.FormGroup({ login: control });
                    fixture.detectChanges();
                    control.disable();
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('my-input'));
                    expect(input.nativeElement.getAttribute('disabled')).toBe(null);
                });
            });
        });
        describe('user input', function () {
            it('should mark controls as touched after interacting with the DOM control', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input'));
                expect(login.touched).toBe(false);
                browser_util_1.dispatchEvent(loginEl.nativeElement, 'blur');
                expect(login.touched).toBe(true);
            });
        });
        describe('submit and reset events', function () {
            it('should emit ngSubmit event with the original submit event on submit', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.componentInstance.event = null;
                fixture.detectChanges();
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                fixture.detectChanges();
                expect(fixture.componentInstance.event.type).toEqual('submit');
            });
            it('should mark formGroup as submitted on submit event', function () {
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('loginValue') });
                fixture.detectChanges();
                var formGroupDir = fixture.debugElement.children[0].injector.get(forms_1.FormGroupDirective);
                expect(formGroupDir.submitted).toBe(false);
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(formEl, 'submit');
                fixture.detectChanges();
                expect(formGroupDir.submitted).toEqual(true);
            });
            it('should set value in UI when form resets to that value programmatically', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('some value');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(loginEl.value).toBe('some value');
                form.reset({ 'login': 'reset value' });
                expect(loginEl.value).toBe('reset value');
            });
            it('should clear value in UI when form resets programmatically', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('some value');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(loginEl.value).toBe('some value');
                form.reset();
                expect(loginEl.value).toBe('');
            });
        });
        describe('value changes and status changes', function () {
            it('should mark controls as dirty before emitting a value change event', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': login });
                fixture.detectChanges();
                login.valueChanges.subscribe(function () { expect(login.dirty).toBe(true); });
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                loginEl.value = 'newValue';
                browser_util_1.dispatchEvent(loginEl, 'input');
            });
            it('should mark control as pristine before emitting a value change event when resetting ', function () {
                var fixture = initTest(FormGroupComp);
                var login = new forms_1.FormControl('oldValue');
                var form = new forms_1.FormGroup({ 'login': login });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var loginEl = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                loginEl.value = 'newValue';
                browser_util_1.dispatchEvent(loginEl, 'input');
                expect(login.pristine).toBe(false);
                login.valueChanges.subscribe(function () { expect(login.pristine).toBe(true); });
                form.reset();
            });
        });
        describe('setting status classes', function () {
            it('should work with single fields', function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required);
                fixture.componentInstance.control = control;
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
            it('should work with single fields and async validators', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', null, uniqLoginAsyncValidator('good'));
                fixture.debugElement.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-pending', 'ng-pristine', 'ng-touched']);
                input.value = 'good';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            }));
            it('should work with single fields that combines async and sync validators', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('good'));
                fixture.debugElement.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'bad';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-pending', 'ng-touched']);
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-invalid', 'ng-touched']);
                input.value = 'good';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                fixture.detectChanges();
                expect(sortedClassList(input)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            }));
            it('should work with single fields in parent forms', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
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
            it('should work with formGroup', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                var formEl = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                expect(sortedClassList(formEl)).toEqual(['ng-invalid', 'ng-pristine', 'ng-untouched']);
                browser_util_1.dispatchEvent(input, 'blur');
                fixture.detectChanges();
                expect(sortedClassList(formEl)).toEqual(['ng-invalid', 'ng-pristine', 'ng-touched']);
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                expect(sortedClassList(formEl)).toEqual(['ng-dirty', 'ng-touched', 'ng-valid']);
            });
        });
        describe('updateOn options', function () {
            describe('on blur', function () {
                it('should not update value or validity based on user input until blur', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should not update parent group value/validity from child until blur', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' }) });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ login: '' }, 'Expected group value to remain unchanged until blur.');
                    expect(form.valid).toBe(false, 'Expected no validation to occur on group until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(form.value)
                        .toEqual({ login: 'Nancy' }, 'Expected group value to change once input blurred.');
                    expect(form.valid).toBe(true, 'Expected validation to run once input blurred.');
                });
                it('should not wait for blur event to update if value is set programmatically', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.setValue('Nancy');
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected value to propagate to view immediately.');
                    expect(control.value).toEqual('Nancy', 'Expected model value to update immediately.');
                    expect(control.valid).toBe(true, 'Expected validation to run immediately.');
                });
                it('should not update dirty state until control is blurred', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected control to start out pristine.');
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected control to stay pristine until blurred.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(true, 'Expected control to update dirty state when blurred.');
                });
                it('should continue waiting for blur to update if previously blurred', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('Nancy', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'focus');
                    input.value = '';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to remain unchanged until second blur.');
                    expect(control.valid).toBe(true, 'Expected validation not to run until second blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to update when blur occurs again.');
                    expect(control.valid).toBe(false, 'Expected validation to run when blur occurs again.');
                });
                it('should not use stale pending value if value set programmatically', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    control.setValue('Nancy');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(input.value).toEqual('Nancy', 'Expected programmatic value to stick after blur.');
                });
                it('should set initial value and validity on init', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('Nancy', { validators: forms_1.Validators.maxLength(3), updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected value to be set in the view.');
                    expect(control.value).toEqual('Nancy', 'Expected initial model value to be set.');
                    expect(control.valid).toBe(false, 'Expected validation to run on initial value.');
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(true, 'Expected control to be dirty on blur.');
                    control.reset();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(input.value).toEqual('', 'Expected view value to reset');
                    expect(control.value).toBe(null, 'Expected pending value to reset.');
                    expect(control.dirty).toBe(false, 'Expected pending dirty value to reset.');
                });
                it('should not emit valueChanges or statusChanges until blur', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var values = [];
                    var sub = merge_1.merge(control.valueChanges, control.statusChanges).subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID'], 'Expected valueChanges and statusChanges on blur.');
                    sub.unsubscribe();
                });
                it('should mark as pristine properly if pending dirty', function () {
                    var fixture = initTest(FormControlComp);
                    var control = new forms_1.FormControl('', { updateOn: 'blur' });
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'aa';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    control.markAsPristine();
                    expect(control.dirty).toBe(false, 'Expected control to become pristine.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.dirty).toBe(false, 'Expected pending dirty value to reset.');
                });
                it('should update on blur with group updateOn', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ login: control }, { updateOn: 'blur' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should update on blur with array updateOn', function () {
                    var fixture = initTest(FormArrayComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var cityArray = new forms_1.FormArray([control], { updateOn: 'blur' });
                    var formGroup = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = formGroup;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value)
                        .toEqual('Nancy', 'Expected value to change once control is blurred.');
                    expect(control.valid).toBe(true, 'Expected validation to run once control is blurred.');
                });
                it('should allow child control updateOn blur to override group updateOn', function () {
                    var fixture = initTest(NestedFormGroupComp);
                    var loginControl = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'change' });
                    var passwordControl = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ signin: new forms_1.FormGroup({ login: loginControl, password: passwordControl }) }, { updateOn: 'blur' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var _a = fixture.debugElement.queryAll(by_1.By.css('input')), loginInput = _a[0], passwordInput = _a[1];
                    loginInput.nativeElement.value = 'Nancy';
                    browser_util_1.dispatchEvent(loginInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(loginControl.value).toEqual('Nancy', 'Expected value change on input.');
                    expect(loginControl.valid).toBe(true, 'Expected validation to run on input.');
                    passwordInput.nativeElement.value = 'Carson';
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('', 'Expected value to remain unchanged until blur.');
                    expect(passwordControl.valid).toBe(false, 'Expected no validation to occur until blur.');
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'blur');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('Carson', 'Expected value to change once control is blurred.');
                    expect(passwordControl.valid)
                        .toBe(true, 'Expected validation to run once control is blurred.');
                });
            });
            describe('on submit', function () {
                it('should set initial value and validity on init', function () {
                    var fixture = initTest(FormGroupComp);
                    var form = new forms_1.FormGroup({
                        login: new forms_1.FormControl('Nancy', { validators: forms_1.Validators.required, updateOn: 'submit' })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected initial value to propagate to view.');
                    expect(form.value).toEqual({ login: 'Nancy' }, 'Expected initial value to be set.');
                    expect(form.valid).toBe(true, 'Expected form to run validation on initial value.');
                });
                it('should not update value or validity until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected form value to remain unchanged on input.');
                    expect(formGroup.valid).toBe(false, 'Expected form validation not to run on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected form value to remain unchanged on blur.');
                    expect(formGroup.valid).toBe(false, 'Expected form validation not to run on blur.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected form value to update on submit.');
                    expect(formGroup.valid).toBe(true, 'Expected form validation to run on submit.');
                });
                it('should not update after submit until a second submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    input.value = '';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected value not to change until a second submit.');
                    expect(formGroup.valid)
                        .toBe(true, 'Expected validation not to run until a second submit.');
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: '' }, 'Expected value to update on the second submit.');
                    expect(formGroup.valid).toBe(false, 'Expected validation to run on a second submit.');
                });
                it('should not wait for submit to set value programmatically', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    formGroup.setValue({ login: 'Nancy' });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    expect(input.value).toEqual('Nancy', 'Expected view value to update immediately.');
                    expect(formGroup.value)
                        .toEqual({ login: 'Nancy' }, 'Expected form value to update immediately.');
                    expect(formGroup.valid).toBe(true, 'Expected form validation to run immediately.');
                });
                it('should not update dirty until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(false, 'Expected dirty not to change on input.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(false, 'Expected dirty not to change on blur.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.dirty).toBe(true, 'Expected dirty to update on submit.');
                });
                it('should not update touched until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected touched not to change until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(true, 'Expected touched to update on submit.');
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    formGroup.reset();
                    fixture.detectChanges();
                    expect(input.value).toEqual('', 'Expected view value to reset.');
                    expect(formGroup.value).toEqual({ login: null }, 'Expected form value to reset');
                    expect(formGroup.dirty).toBe(false, 'Expected dirty to stay false on reset.');
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on reset.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.value)
                        .toEqual({ login: null }, 'Expected form value to stay empty on submit');
                    expect(formGroup.dirty).toBe(false, 'Expected dirty to stay false on submit.');
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on submit.');
                });
                it('should not emit valueChanges or statusChanges until submit', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'submit' });
                    var formGroup = new forms_1.FormGroup({ login: control });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var values = [];
                    var streams = merge_1.merge(control.valueChanges, control.statusChanges, formGroup.valueChanges, formGroup.statusChanges);
                    var sub = streams.subscribe(function (val) { return values.push(val); });
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on input');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(values).toEqual([], 'Expected no valueChanges or statusChanges on blur');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(values).toEqual(['Nancy', 'VALID', { login: 'Nancy' }, 'VALID'], 'Expected valueChanges and statusChanges to update on submit.');
                    sub.unsubscribe();
                });
                it('should not run validation for onChange controls on submit', function () {
                    var validatorSpy = jasmine.createSpy('validator');
                    var groupValidatorSpy = jasmine.createSpy('groupValidatorSpy');
                    var fixture = initTest(NestedFormGroupComp);
                    var formGroup = new forms_1.FormGroup({
                        signin: new forms_1.FormGroup({ login: new forms_1.FormControl(), password: new forms_1.FormControl() }),
                        email: new forms_1.FormControl('', { updateOn: 'submit' })
                    });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    formGroup.get('signin.login').setValidators(validatorSpy);
                    formGroup.get('signin').setValidators(groupValidatorSpy);
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(validatorSpy).not.toHaveBeenCalled();
                    expect(groupValidatorSpy).not.toHaveBeenCalled();
                });
                it('should mark as untouched properly if pending touched', function () {
                    var fixture = initTest(FormGroupComp);
                    var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    formGroup.markAsUntouched();
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected group to become untouched.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(formGroup.touched).toBe(false, 'Expected touched to stay false on submit.');
                });
                it('should update on submit with group updateOn', function () {
                    var fixture = initTest(FormGroupComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ login: control }, { updateOn: 'submit' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    browser_util_1.dispatchEvent(input, 'blur');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(control.value).toEqual('Nancy', 'Expected value to change on submit.');
                    expect(control.valid).toBe(true, 'Expected validation to run on submit.');
                });
                it('should update on submit with array updateOn', function () {
                    var fixture = initTest(FormArrayComp);
                    var control = new forms_1.FormControl('', forms_1.Validators.required);
                    var cityArray = new forms_1.FormArray([control], { updateOn: 'submit' });
                    var formGroup = new forms_1.FormGroup({ cities: cityArray });
                    fixture.componentInstance.form = formGroup;
                    fixture.componentInstance.cityArray = cityArray;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                    input.value = 'Nancy';
                    browser_util_1.dispatchEvent(input, 'input');
                    fixture.detectChanges();
                    expect(control.value).toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(control.valid).toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(control.value).toEqual('Nancy', 'Expected value to change once control on submit');
                    expect(control.valid).toBe(true, 'Expected validation to run on submit.');
                });
                it('should allow child control updateOn submit to override group updateOn', function () {
                    var fixture = initTest(NestedFormGroupComp);
                    var loginControl = new forms_1.FormControl('', { validators: forms_1.Validators.required, updateOn: 'change' });
                    var passwordControl = new forms_1.FormControl('', forms_1.Validators.required);
                    var formGroup = new forms_1.FormGroup({ signin: new forms_1.FormGroup({ login: loginControl, password: passwordControl }) }, { updateOn: 'submit' });
                    fixture.componentInstance.form = formGroup;
                    fixture.detectChanges();
                    var _a = fixture.debugElement.queryAll(by_1.By.css('input')), loginInput = _a[0], passwordInput = _a[1];
                    loginInput.nativeElement.value = 'Nancy';
                    browser_util_1.dispatchEvent(loginInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(loginControl.value).toEqual('Nancy', 'Expected value change on input.');
                    expect(loginControl.valid).toBe(true, 'Expected validation to run on input.');
                    passwordInput.nativeElement.value = 'Carson';
                    browser_util_1.dispatchEvent(passwordInput.nativeElement, 'input');
                    fixture.detectChanges();
                    expect(passwordControl.value)
                        .toEqual('', 'Expected value to remain unchanged until submit.');
                    expect(passwordControl.valid)
                        .toBe(false, 'Expected no validation to occur until submit.');
                    var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                    browser_util_1.dispatchEvent(form, 'submit');
                    fixture.detectChanges();
                    expect(passwordControl.value).toEqual('Carson', 'Expected value to change on submit.');
                    expect(passwordControl.valid).toBe(true, 'Expected validation to run on submit.');
                });
            });
        });
        describe('ngModel interactions', function () {
            it('should support ngModel for complex forms', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupNgModel);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('') });
                fixture.componentInstance.login = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                expect(fixture.componentInstance.login).toEqual('updatedValue');
            }));
            it('should support ngModel for single fields', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlNgModel);
                fixture.componentInstance.control = new forms_1.FormControl('');
                fixture.componentInstance.login = 'oldValue';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                expect(input.value).toEqual('oldValue');
                input.value = 'updatedValue';
                browser_util_1.dispatchEvent(input, 'input');
                testing_1.tick();
                expect(fixture.componentInstance.login).toEqual('updatedValue');
            }));
            it('should not update the view when the value initially came from the view', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlNgModel);
                fixture.componentInstance.control = new forms_1.FormControl('');
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'aa';
                input.setSelectionRange(1, 2);
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                // selection start has not changed because we did not reset the value
                expect(input.selectionStart).toEqual(1);
            }));
            it('should work with updateOn submit', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupNgModel);
                var formGroup = new forms_1.FormGroup({ login: new forms_1.FormControl('', { updateOn: 'submit' }) });
                fixture.componentInstance.form = formGroup;
                fixture.componentInstance.login = 'initial';
                fixture.detectChanges();
                testing_1.tick();
                var input = fixture.debugElement.query(by_1.By.css('input')).nativeElement;
                input.value = 'Nancy';
                browser_util_1.dispatchEvent(input, 'input');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.login)
                    .toEqual('initial', 'Expected ngModel value to remain unchanged on input.');
                var form = fixture.debugElement.query(by_1.By.css('form')).nativeElement;
                browser_util_1.dispatchEvent(form, 'submit');
                fixture.detectChanges();
                testing_1.tick();
                expect(fixture.componentInstance.login)
                    .toEqual('Nancy', 'Expected ngModel value to update on submit.');
            }));
        });
        describe('validations', function () {
            it('required validator should validate checkbox', function () {
                var fixture = initTest(FormControlCheckboxRequiredValidator);
                var control = new forms_1.FormControl(false, forms_1.Validators.requiredTrue);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                var checkbox = fixture.debugElement.query(by_1.By.css('input'));
                expect(checkbox.nativeElement.checked).toBe(false);
                expect(control.hasError('required')).toEqual(true);
                checkbox.nativeElement.checked = true;
                browser_util_1.dispatchEvent(checkbox.nativeElement, 'change');
                fixture.detectChanges();
                expect(checkbox.nativeElement.checked).toBe(true);
                expect(control.hasError('required')).toEqual(false);
            });
            it('should use sync validators defined in html', function () {
                var fixture = initTest(LoginIsEmptyWrapper, LoginIsEmptyValidator);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                var required = fixture.debugElement.query(by_1.By.css('[required]'));
                var minLength = fixture.debugElement.query(by_1.By.css('[minlength]'));
                var maxLength = fixture.debugElement.query(by_1.By.css('[maxlength]'));
                var pattern = fixture.debugElement.query(by_1.By.css('[pattern]'));
                required.nativeElement.value = '';
                minLength.nativeElement.value = '1';
                maxLength.nativeElement.value = '1234';
                pattern.nativeElement.value = '12';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
                expect(form.hasError('loginIsEmpty')).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            });
            it('should use sync validators using bindings', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
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
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
                required.nativeElement.value = '1';
                minLength.nativeElement.value = '123';
                maxLength.nativeElement.value = '123';
                pattern.nativeElement.value = '123';
                browser_util_1.dispatchEvent(required.nativeElement, 'input');
                browser_util_1.dispatchEvent(minLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(maxLength.nativeElement, 'input');
                browser_util_1.dispatchEvent(pattern.nativeElement, 'input');
                expect(form.valid).toEqual(true);
            });
            it('changes on bound properties should change the validation state of the form', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
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
                expect(form.hasError('required', ['login'])).toEqual(false);
                expect(form.hasError('minlength', ['min'])).toEqual(false);
                expect(form.hasError('maxlength', ['max'])).toEqual(false);
                expect(form.hasError('pattern', ['pattern'])).toEqual(false);
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
                expect(form.hasError('required', ['login'])).toEqual(true);
                expect(form.hasError('minlength', ['min'])).toEqual(true);
                expect(form.hasError('maxlength', ['max'])).toEqual(true);
                expect(form.hasError('pattern', ['pattern'])).toEqual(true);
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
                expect(form.hasError('required', ['login'])).toEqual(false);
                expect(form.hasError('minlength', ['min'])).toEqual(false);
                expect(form.hasError('maxlength', ['max'])).toEqual(false);
                expect(form.hasError('pattern', ['pattern'])).toEqual(false);
                expect(form.valid).toEqual(true);
                expect(required.nativeElement.getAttribute('required')).toEqual(null);
                expect(required.nativeElement.getAttribute('minlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('maxlength')).toEqual(null);
                expect(required.nativeElement.getAttribute('pattern')).toEqual(null);
            });
            it('should support rebound controls with rebound validators', function () {
                var fixture = initTest(ValidationBindingsForm);
                var form = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = form;
                fixture.componentInstance.required = true;
                fixture.componentInstance.minLen = 3;
                fixture.componentInstance.maxLen = 3;
                fixture.componentInstance.pattern = '.{3,}';
                fixture.detectChanges();
                var newForm = new forms_1.FormGroup({
                    'login': new forms_1.FormControl(''),
                    'min': new forms_1.FormControl(''),
                    'max': new forms_1.FormControl(''),
                    'pattern': new forms_1.FormControl('')
                });
                fixture.componentInstance.form = newForm;
                fixture.detectChanges();
                fixture.componentInstance.required = false;
                fixture.componentInstance.minLen = null;
                fixture.componentInstance.maxLen = null;
                fixture.componentInstance.pattern = null;
                fixture.detectChanges();
                expect(newForm.hasError('required', ['login'])).toEqual(false);
                expect(newForm.hasError('minlength', ['min'])).toEqual(false);
                expect(newForm.hasError('maxlength', ['max'])).toEqual(false);
                expect(newForm.hasError('pattern', ['pattern'])).toEqual(false);
                expect(newForm.valid).toEqual(true);
            });
            it('should use async validators defined in the html', testing_1.fakeAsync(function () {
                var fixture = initTest(UniqLoginWrapper, UniqLoginValidator);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('') });
                testing_1.tick();
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.pending).toEqual(true);
                testing_1.tick(100);
                expect(form.hasError('uniqLogin', ['login'])).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick(100);
                expect(form.valid).toEqual(true);
            }));
            it('should use sync validators defined in the model', function () {
                var fixture = initTest(FormGroupComp);
                var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa', forms_1.Validators.required) });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                expect(form.valid).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.valid).toEqual(false);
            });
            it('should use async validators defined in the model', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('expected'));
                var form = new forms_1.FormGroup({ 'login': control });
                fixture.componentInstance.form = form;
                fixture.detectChanges();
                testing_1.tick();
                expect(form.hasError('required', ['login'])).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'wrong value';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(form.pending).toEqual(true);
                testing_1.tick();
                expect(form.hasError('uniqLogin', ['login'])).toEqual(true);
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick();
                expect(form.valid).toEqual(true);
            }));
            it('async validator should not override result of sync validator', testing_1.fakeAsync(function () {
                var fixture = initTest(FormGroupComp);
                var control = new forms_1.FormControl('', forms_1.Validators.required, uniqLoginAsyncValidator('expected', 100));
                fixture.componentInstance.form = new forms_1.FormGroup({ 'login': control });
                fixture.detectChanges();
                testing_1.tick();
                expect(control.hasError('required')).toEqual(true);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'expected';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.pending).toEqual(true);
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                testing_1.tick(110);
                expect(control.valid).toEqual(false);
            }));
            it('should cancel observable properly between validation runs', testing_1.fakeAsync(function () {
                var fixture = initTest(FormControlComp);
                var resultArr = [];
                fixture.componentInstance.control =
                    new forms_1.FormControl('', null, observableValidator(resultArr));
                fixture.detectChanges();
                testing_1.tick(100);
                expect(resultArr.length).toEqual(1, "Expected source observable to emit once on init.");
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = 'a';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                input.nativeElement.value = 'aa';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                fixture.detectChanges();
                testing_1.tick(100);
                expect(resultArr.length)
                    .toEqual(2, "Expected original observable to be canceled on the next value change.");
            }));
        });
        describe('errors', function () {
            it('should throw if a form isn\'t passed into formGroup', function () {
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroup expects a FormGroup instance"));
            });
            it('should throw if formControlName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <input type=\"text\" formControlName=\"login\">\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName must be used with a parent formGroup directive"));
            });
            it('should throw if formControlName is used with NgForm', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <input type=\"text\" formControlName=\"login\">\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName must be used with a parent formGroup directive."));
            });
            it('should throw if formControlName is used with NgModelGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <div ngModelGroup=\"parent\">\n              <input type=\"text\" formControlName=\"login\">\n            </div>\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formControlName cannot be used with an ngModelGroup parent."));
            });
            it('should throw if formGroupName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div formGroupName=\"person\">\n            <input type=\"text\" formControlName=\"login\">\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroupName must be used with a parent formGroup directive"));
            });
            it('should throw if formGroupName is used with NgForm', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form>\n            <div formGroupName=\"person\">\n              <input type=\"text\" formControlName=\"login\">\n            </div>\n          </form>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formGroupName must be used with a parent formGroup directive."));
            });
            it('should throw if formArrayName is used without a control container', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div formArrayName=\"cities\">\n           <input type=\"text\" formControlName=\"login\">\n         </div>"
                    }
                });
                var fixture = initTest(FormGroupComp);
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("formArrayName must be used with a parent formGroup directive"));
            });
            it('should throw if ngModel is used alone under formGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div [formGroup]=\"form\">\n           <input type=\"text\" [(ngModel)]=\"data\">\n         </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModel cannot be used to register form controls with a parent formGroup directive."));
            });
            it('should not throw if ngModel is used alone under formGroup with standalone: true', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n         <div [formGroup]=\"form\">\n            <input type=\"text\" [(ngModel)]=\"data\" [ngModelOptions]=\"{standalone: true}\">\n         </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); }).not.toThrowError();
            });
            it('should throw if ngModel is used alone with formGroupName', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div [formGroup]=\"form\">\n            <div formGroupName=\"person\">\n              <input type=\"text\" [(ngModel)]=\"data\">\n            </div>\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ person: new forms_1.FormGroup({}) });
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive."));
            });
            it('should throw if ngModelGroup is used with formGroup', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <div [formGroup]=\"form\">\n            <div ngModelGroup=\"person\">\n              <input type=\"text\" [(ngModel)]=\"data\">\n            </div>\n          </div>\n        "
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({});
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp("ngModelGroup cannot be used with a parent formGroup directive"));
            });
            it('should throw if radio button name does not match formControlName attr', function () {
                testing_1.TestBed.overrideComponent(FormGroupComp, {
                    set: {
                        template: "\n          <form [formGroup]=\"form\">hav\n            <input type=\"radio\" formControlName=\"food\" name=\"drink\" value=\"chicken\">\n          </form>"
                    }
                });
                var fixture = initTest(FormGroupComp);
                fixture.componentInstance.form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish') });
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(new RegExp('If you define both a name and a formControlName'));
            });
        });
        describe('IME events', function () {
            it('should determine IME event handling depending on platform by default', function () {
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                var isAndroid = /android (\d+)/.test(dom_adapter_1.getDOM().getUserAgent().toLowerCase());
                if (isAndroid) {
                    // On Android, values should update immediately
                    expect(fixture.componentInstance.control.value).toEqual('updatedValue');
                }
                else {
                    // On other platforms, values should wait for compositionend
                    expect(fixture.componentInstance.control.value).toEqual('oldValue');
                    inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.control.value).toEqual('updatedValue');
                }
            });
            it('should hold IME events until compositionend if composition mode', function () {
                testing_1.TestBed.overrideComponent(FormControlComp, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: true }] } });
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                // should not update when compositionstart
                expect(fixture.componentInstance.control.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionend', { target: { value: 'updatedValue' } });
                fixture.detectChanges();
                // should update when compositionend
                expect(fixture.componentInstance.control.value).toEqual('updatedValue');
            });
            it('should work normally with composition events if composition mode is off', function () {
                testing_1.TestBed.overrideComponent(FormControlComp, { set: { providers: [{ provide: forms_1.COMPOSITION_BUFFER_MODE, useValue: false }] } });
                var fixture = initTest(FormControlComp);
                fixture.componentInstance.control = new forms_1.FormControl('oldValue');
                fixture.detectChanges();
                var inputEl = fixture.debugElement.query(by_1.By.css('input'));
                var inputNativeEl = inputEl.nativeElement;
                expect(inputNativeEl.value).toEqual('oldValue');
                inputEl.triggerEventHandler('compositionstart', null);
                inputNativeEl.value = 'updatedValue';
                browser_util_1.dispatchEvent(inputNativeEl, 'input');
                fixture.detectChanges();
                // formControl should update normally
                expect(fixture.componentInstance.control.value).toEqual('updatedValue');
            });
        });
    });
}
exports.main = main;
function uniqLoginAsyncValidator(expectedValue, timeout) {
    if (timeout === void 0) { timeout = 0; }
    return function (c) {
        var resolve;
        var promise = new Promise(function (res) { resolve = res; });
        var res = (c.value == expectedValue) ? null : { 'uniqLogin': true };
        setTimeout(function () { return resolve(res); }, timeout);
        return promise;
    };
}
function observableValidator(resultArr) {
    return function (c) {
        return do_1._do.call(timer_1.timer(100), function (resp) { return resultArr.push(resp); });
    };
}
function loginIsEmptyGroupValidator(c) {
    return c.controls['login'].value == '' ? { 'loginIsEmpty': true } : null;
}
var LoginIsEmptyValidator = (function () {
    function LoginIsEmptyValidator() {
    }
    return LoginIsEmptyValidator;
}());
LoginIsEmptyValidator = __decorate([
    core_1.Directive({
        selector: '[login-is-empty-validator]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useValue: loginIsEmptyGroupValidator, multi: true }]
    })
], LoginIsEmptyValidator);
var UniqLoginValidator = UniqLoginValidator_1 = (function () {
    function UniqLoginValidator() {
    }
    UniqLoginValidator.prototype.validate = function (c) { return uniqLoginAsyncValidator(this.expected)(c); };
    return UniqLoginValidator;
}());
__decorate([
    core_1.Input('uniq-login-validator'),
    __metadata("design:type", Object)
], UniqLoginValidator.prototype, "expected", void 0);
UniqLoginValidator = UniqLoginValidator_1 = __decorate([
    core_1.Directive({
        selector: '[uniq-login-validator]',
        providers: [{
                provide: forms_1.NG_ASYNC_VALIDATORS,
                useExisting: core_1.forwardRef(function () { return UniqLoginValidator_1; }),
                multi: true
            }]
    })
], UniqLoginValidator);
function sortedClassList(el) {
    return dom_adapter_1.getDOM().classList(el).sort();
}
var FormControlComp = (function () {
    function FormControlComp() {
    }
    return FormControlComp;
}());
FormControlComp = __decorate([
    core_1.Component({ selector: 'form-control-comp', template: "<input type=\"text\" [formControl]=\"control\">" })
], FormControlComp);
var FormGroupComp = (function () {
    function FormGroupComp() {
    }
    return FormGroupComp;
}());
FormGroupComp = __decorate([
    core_1.Component({
        selector: 'form-group-comp',
        template: "\n    <form [formGroup]=\"form\" (ngSubmit)=\"event=$event\">\n      <input type=\"text\" formControlName=\"login\">\n    </form>"
    })
], FormGroupComp);
var NestedFormGroupComp = (function () {
    function NestedFormGroupComp() {
    }
    return NestedFormGroupComp;
}());
NestedFormGroupComp = __decorate([
    core_1.Component({
        selector: 'nested-form-group-comp',
        template: "\n    <form [formGroup]=\"form\">\n      <div formGroupName=\"signin\" login-is-empty-validator>\n        <input formControlName=\"login\">\n        <input formControlName=\"password\">\n      </div>\n      <input *ngIf=\"form.contains('email')\" formControlName=\"email\">\n    </form>"
    })
], NestedFormGroupComp);
var FormArrayComp = (function () {
    function FormArrayComp() {
    }
    return FormArrayComp;
}());
FormArrayComp = __decorate([
    core_1.Component({
        selector: 'form-array-comp',
        template: "\n    <form [formGroup]=\"form\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\">\n          <input [formControlName]=\"i\">\n        </div>\n      </div>\n     </form>"
    })
], FormArrayComp);
var FormArrayNestedGroup = (function () {
    function FormArrayNestedGroup() {
    }
    return FormArrayNestedGroup;
}());
FormArrayNestedGroup = __decorate([
    core_1.Component({
        selector: 'form-array-nested-group',
        template: "\n     <div [formGroup]=\"form\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\" [formGroupName]=\"i\">\n          <input formControlName=\"town\">\n          <input formControlName=\"state\">\n        </div>\n      </div>\n     </div>"
    })
], FormArrayNestedGroup);
var FormGroupNgModel = (function () {
    function FormGroupNgModel() {
    }
    return FormGroupNgModel;
}());
FormGroupNgModel = __decorate([
    core_1.Component({
        selector: 'form-group-ng-model',
        template: "\n  <form [formGroup]=\"form\">\n    <input type=\"text\" formControlName=\"login\" [(ngModel)]=\"login\">\n   </form>"
    })
], FormGroupNgModel);
var FormControlNgModel = (function () {
    function FormControlNgModel() {
    }
    return FormControlNgModel;
}());
FormControlNgModel = __decorate([
    core_1.Component({
        selector: 'form-control-ng-model',
        template: "<input type=\"text\" [formControl]=\"control\" [(ngModel)]=\"login\">"
    })
], FormControlNgModel);
var LoginIsEmptyWrapper = (function () {
    function LoginIsEmptyWrapper() {
    }
    return LoginIsEmptyWrapper;
}());
LoginIsEmptyWrapper = __decorate([
    core_1.Component({
        selector: 'login-is-empty-wrapper',
        template: "\n    <div [formGroup]=\"form\" login-is-empty-validator>\n      <input type=\"text\" formControlName=\"login\" required>\n      <input type=\"text\" formControlName=\"min\" minlength=\"3\">\n      <input type=\"text\" formControlName=\"max\" maxlength=\"3\">\n      <input type=\"text\" formControlName=\"pattern\" pattern=\".{3,}\">\n   </div>"
    })
], LoginIsEmptyWrapper);
var ValidationBindingsForm = (function () {
    function ValidationBindingsForm() {
    }
    return ValidationBindingsForm;
}());
ValidationBindingsForm = __decorate([
    core_1.Component({
        selector: 'validation-bindings-form',
        template: "\n    <div [formGroup]=\"form\">\n      <input name=\"required\" type=\"text\" formControlName=\"login\" [required]=\"required\">\n      <input name=\"minlength\" type=\"text\" formControlName=\"min\" [minlength]=\"minLen\">\n      <input name=\"maxlength\" type=\"text\" formControlName=\"max\" [maxlength]=\"maxLen\">\n      <input name=\"pattern\" type=\"text\" formControlName=\"pattern\" [pattern]=\"pattern\">\n   </div>"
    })
], ValidationBindingsForm);
var FormControlCheckboxRequiredValidator = (function () {
    function FormControlCheckboxRequiredValidator() {
    }
    return FormControlCheckboxRequiredValidator;
}());
FormControlCheckboxRequiredValidator = __decorate([
    core_1.Component({
        selector: 'form-control-checkbox-validator',
        template: "<input type=\"checkbox\" [formControl]=\"control\">"
    })
], FormControlCheckboxRequiredValidator);
var UniqLoginWrapper = (function () {
    function UniqLoginWrapper() {
    }
    return UniqLoginWrapper;
}());
UniqLoginWrapper = __decorate([
    core_1.Component({
        selector: 'uniq-login-wrapper',
        template: "\n  <div [formGroup]=\"form\">\n    <input type=\"text\" formControlName=\"login\" uniq-login-validator=\"expected\">\n  </div>"
    })
], UniqLoginWrapper);
var UniqLoginValidator_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmVfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvcmVhY3RpdmVfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUE0RTtBQUM1RSxpREFBaUY7QUFDakYsd0NBQW1QO0FBQ25QLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsbUZBQWlGO0FBQ2pGLCtDQUE0QztBQUM1QywrQ0FBNEM7QUFDNUMsdUNBQXFDO0FBRXJDLHFGQUF1RTtBQUV2RTtJQUNFLFFBQVEsQ0FBQyxrQ0FBa0MsRUFBRTtRQUUzQyxrQkFBcUIsU0FBa0I7WUFBRSxvQkFBMEI7aUJBQTFCLFVBQTBCLEVBQTFCLHFCQUEwQixFQUExQixJQUEwQjtnQkFBMUIsbUNBQTBCOztZQUNqRSxpQkFBTyxDQUFDLHNCQUFzQixDQUMxQixFQUFDLFlBQVksR0FBRyxTQUFTLFNBQUssVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQVcsRUFBRSwyQkFBbUIsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM3RixNQUFNLENBQUMsaUJBQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztnQkFDNUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUV4QixnQkFBZ0I7Z0JBQ2hCLElBQU0sS0FBSyxHQUFHLE9B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