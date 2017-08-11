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
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
function main() {
    describe('value accessors', function () {
        function initTest(component) {
            var directives = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                directives[_i - 1] = arguments[_i];
            }
            testing_1.TestBed.configureTestingModule({ declarations: [component].concat(directives), imports: [forms_1.FormsModule, forms_1.ReactiveFormsModule] });
            return testing_1.TestBed.createComponent(component);
        }
        it('should support <input> without type', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input [formControl]=\"control\">" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl('old');
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.value).toEqual('old');
            input.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(input.nativeElement, 'input');
            // view -> model
            expect(control.value).toEqual('new');
        });
        it('should support <input type=text>', function () {
            var fixture = initTest(FormGroupComp);
            var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('old') });
            fixture.componentInstance.form = form;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.value).toEqual('old');
            input.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(input.nativeElement, 'input');
            // view -> model
            expect(form.value).toEqual({ 'login': 'new' });
        });
        it('should ignore the change event for <input type=text>', function () {
            var fixture = initTest(FormGroupComp);
            var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('oldValue') });
            fixture.componentInstance.form = form;
            fixture.detectChanges();
            var input = fixture.debugElement.query(by_1.By.css('input'));
            form.valueChanges.subscribe({ next: function (value) { throw 'Should not happen'; } });
            input.nativeElement.value = 'updatedValue';
            browser_util_1.dispatchEvent(input.nativeElement, 'change');
        });
        it('should support <textarea>', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<textarea [formControl]=\"control\"></textarea>" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl('old');
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var textarea = fixture.debugElement.query(by_1.By.css('textarea'));
            expect(textarea.nativeElement.value).toEqual('old');
            textarea.nativeElement.value = 'new';
            browser_util_1.dispatchEvent(textarea.nativeElement, 'input');
            // view -> model
            expect(control.value).toEqual('new');
        });
        it('should support <type=checkbox>', function () {
            testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input type=\"checkbox\" [formControl]=\"control\">" } });
            var fixture = initTest(FormControlComp);
            var control = new forms_1.FormControl(true);
            fixture.componentInstance.control = control;
            fixture.detectChanges();
            // model -> view
            var input = fixture.debugElement.query(by_1.By.css('input'));
            expect(input.nativeElement.checked).toBe(true);
            input.nativeElement.checked = false;
            browser_util_1.dispatchEvent(input.nativeElement, 'change');
            // view -> model
            expect(control.value).toBe(false);
        });
        describe('should support <type=number>', function () {
            it('with basic use case', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                // model -> view
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('10');
                input.nativeElement.value = '20';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                // view -> model
                expect(control.value).toEqual(20);
            });
            it('when value is cleared in the UI', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10, forms_1.Validators.required);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                var input = fixture.debugElement.query(by_1.By.css('input'));
                input.nativeElement.value = '';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.valid).toBe(false);
                expect(control.value).toEqual(null);
                input.nativeElement.value = '0';
                browser_util_1.dispatchEvent(input.nativeElement, 'input');
                expect(control.valid).toBe(true);
                expect(control.value).toEqual(0);
            });
            it('when value is cleared programmatically', function () {
                var fixture = initTest(FormControlNumberInput);
                var control = new forms_1.FormControl(10);
                fixture.componentInstance.control = control;
                fixture.detectChanges();
                control.setValue(null);
                var input = fixture.debugElement.query(by_1.By.css('input'));
                expect(input.nativeElement.value).toEqual('');
            });
        });
        describe('select controls', function () {
            describe('in reactive forms', function () {
                it("should support primitive values", function () {
                    var fixture = initTest(FormControlNameSelect);
                    fixture.detectChanges();
                    // model -> view
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('SF');
                    expect(sfOption.nativeElement.selected).toBe(true);
                    select.nativeElement.value = 'NY';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(sfOption.nativeElement.selected).toBe(false);
                    expect(fixture.componentInstance.form.value).toEqual({ 'city': 'NY' });
                });
                it("should support objects", function () {
                    var fixture = initTest(FormControlSelectNgValue);
                    fixture.detectChanges();
                    // model -> view
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should throw an error if compareWith is not a function', function () {
                    var fixture = initTest(FormControlSelectWithCompareFn);
                    fixture.componentInstance.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', function () {
                    var fixture = initTest(FormControlSelectWithCompareFn);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
            });
            describe('in template-driven forms', function () {
                it('with option values that are objects', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'Buffalo' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var nycOption = fixture.debugElement.queryAll(by_1.By.css('option'))[1];
                    // model -> view
                    expect(select.nativeElement.value).toEqual('1: Object');
                    expect(nycOption.nativeElement.selected).toBe(true);
                    select.nativeElement.value = '2: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    // view -> model
                    expect(comp.selectedCity['name']).toEqual('Buffalo');
                }));
                it('when new options are added', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    comp.cities.push({ 'name': 'Buffalo' });
                    comp.selectedCity = comp.cities[2];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var buffalo = fixture.debugElement.queryAll(by_1.By.css('option'))[2];
                    expect(select.nativeElement.value).toEqual('2: Object');
                    expect(buffalo.nativeElement.selected).toBe(true);
                }));
                it('when options are removed', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[1];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    expect(select.nativeElement.value).toEqual('1: Object');
                    comp.cities.pop();
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(select.nativeElement.value).not.toEqual('1: Object');
                }));
                it('when option values have same content, but different identities', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'NYC' }];
                    comp.selectedCity = comp.cities[0];
                    fixture.detectChanges();
                    comp.selectedCity = comp.cities[2];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var secondNYC = fixture.debugElement.queryAll(by_1.By.css('option'))[2];
                    expect(select.nativeElement.value).toEqual('2: Object');
                    expect(secondNYC.nativeElement.selected).toBe(true);
                }));
                it('should work with null option', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectWithNullForm);
                    var comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }];
                    comp.selectedCity = null;
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = '2: Object';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(comp.selectedCity['name']).toEqual('NYC');
                    select.nativeElement.value = '0: null';
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(comp.selectedCity).toEqual(null);
                }));
                it('should throw an error when compareWith is not a function', function () {
                    var fixture = initTest(NgModelSelectWithCustomCompareFnForm);
                    var comp = fixture.componentInstance;
                    comp.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelSelectWithCustomCompareFnForm);
                    var comp = fixture.componentInstance;
                    comp.selectedCity = { id: 1, name: 'SF' };
                    comp.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'LA' }];
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                }));
            });
        });
        describe('select multiple controls', function () {
            describe('in reactive forms', function () {
                it('should support primitive values', function () {
                    var fixture = initTest(FormControlSelectMultiple);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual("0: 'SF'");
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should support objects', function () {
                    var fixture = initTest(FormControlSelectMultipleNgValue);
                    fixture.detectChanges();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                });
                it('should throw an error when compareWith is not a function', function () {
                    var fixture = initTest(FormControlSelectMultipleWithCompareFn);
                    fixture.componentInstance.compareFn = null;
                    expect(function () { return fixture.detectChanges(); })
                        .toThrowError(/compareWith must be a function, but received null/);
                });
                it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                    var fixture = initTest(FormControlSelectMultipleWithCompareFn);
                    fixture.detectChanges();
                    testing_1.tick();
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                    expect(select.nativeElement.value).toEqual('0: Object');
                    expect(sfOption.nativeElement.selected).toBe(true);
                }));
            });
            describe('in template-driven forms', function () {
                var fixture;
                var comp;
                beforeEach(function () {
                    fixture = initTest(NgModelSelectMultipleForm);
                    comp = fixture.componentInstance;
                    comp.cities = [{ 'name': 'SF' }, { 'name': 'NYC' }, { 'name': 'Buffalo' }];
                });
                var detectChangesAndTick = function () {
                    fixture.detectChanges();
                    testing_1.tick();
                };
                var setSelectedCities = function (selectedCities) {
                    comp.selectedCities = selectedCities;
                    detectChangesAndTick();
                };
                var selectOptionViaUI = function (valueString) {
                    var select = fixture.debugElement.query(by_1.By.css('select'));
                    select.nativeElement.value = valueString;
                    browser_util_1.dispatchEvent(select.nativeElement, 'change');
                    detectChangesAndTick();
                };
                var assertOptionElementSelectedState = function (selectedStates) {
                    var options = fixture.debugElement.queryAll(by_1.By.css('option'));
                    if (options.length !== selectedStates.length) {
                        throw 'the selected state values to assert does not match the number of options';
                    }
                    for (var i = 0; i < selectedStates.length; i++) {
                        expect(options[i].nativeElement.selected).toBe(selectedStates[i]);
                    }
                };
                it('should reflect state of model after option selected and new options subsequently added', testing_1.fakeAsync(function () {
                    setSelectedCities([]);
                    selectOptionViaUI('1: Object');
                    assertOptionElementSelectedState([false, true, false]);
                    comp.cities.push({ 'name': 'Chicago' });
                    detectChangesAndTick();
                    assertOptionElementSelectedState([false, true, false, false]);
                }));
                it('should reflect state of model after option selected and then other options removed', testing_1.fakeAsync(function () {
                    setSelectedCities([]);
                    selectOptionViaUI('1: Object');
                    assertOptionElementSelectedState([false, true, false]);
                    comp.cities.pop();
                    detectChangesAndTick();
                    assertOptionElementSelectedState([false, true]);
                }));
            });
            it('should throw an error when compareWith is not a function', function () {
                var fixture = initTest(NgModelSelectMultipleWithCustomCompareFnForm);
                var comp = fixture.componentInstance;
                comp.compareFn = null;
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/compareWith must be a function, but received null/);
            });
            it('should compare options using provided compareWith function', testing_1.fakeAsync(function () {
                var fixture = initTest(NgModelSelectMultipleWithCustomCompareFnForm);
                var comp = fixture.componentInstance;
                comp.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'LA' }];
                comp.selectedCities = [comp.cities[0]];
                fixture.detectChanges();
                testing_1.tick();
                var select = fixture.debugElement.query(by_1.By.css('select'));
                var sfOption = fixture.debugElement.query(by_1.By.css('option'));
                expect(select.nativeElement.value).toEqual('0: Object');
                expect(sfOption.nativeElement.selected).toBe(true);
            }));
        });
        describe('should support <type=radio>', function () {
            describe('in reactive forms', function () {
                it('should support basic functionality', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(form.get('food').value).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    form.get('food').setValue('fish');
                    fixture.detectChanges();
                    // programmatic change -> view
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                });
                it('should support an initial undefined value', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl(), 'drink': new forms_1.FormControl() });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                });
                it('should reset properly', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.reset();
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                });
                it('should properly set value to null and undefined', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('chicken'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    form.get('food').setValue(null);
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    form.get('food').setValue('chicken');
                    fixture.detectChanges();
                    form.get('food').setValue(undefined);
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                });
                it('should use formControlName to group radio buttons when name is absent', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var foodCtrl = new forms_1.FormControl('fish');
                    var drinkCtrl = new forms_1.FormControl('sprite');
                    fixture.componentInstance.form = new forms_1.FormGroup({ 'food': foodCtrl, 'drink': drinkCtrl });
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    inputs[0].nativeElement.checked = true;
                    fixture.detectChanges();
                    var value = fixture.componentInstance.form.value;
                    expect(value.food).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    drinkCtrl.setValue('cola');
                    fixture.detectChanges();
                    expect(inputs[0].nativeElement.checked).toEqual(true);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(true);
                    expect(inputs[3].nativeElement.checked).toEqual(false);
                });
                it('should support removing controls from <type=radio>', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var showRadio = new forms_1.FormControl('yes');
                    var form = new forms_1.FormGroup({ 'food': new forms_1.FormControl('fish'), 'drink': new forms_1.FormControl('sprite') });
                    fixture.componentInstance.form = form;
                    fixture.componentInstance.showRadio = showRadio;
                    showRadio.valueChanges.subscribe(function (change) {
                        (change === 'yes') ? form.addControl('food', new forms_1.FormControl('fish')) :
                            form.removeControl('food');
                    });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('[value="no"]'));
                    browser_util_1.dispatchEvent(input.nativeElement, 'change');
                    fixture.detectChanges();
                    expect(form.value).toEqual({ drink: 'sprite' });
                });
                it('should differentiate controls on different levels with the same name', function () {
                    testing_1.TestBed.overrideComponent(FormControlRadioButtons, {
                        set: {
                            template: "\n              <div [formGroup]=\"form\">\n                <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n                <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n                <div formGroupName=\"nested\">\n                  <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n                  <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n                </div>\n              </div>\n              "
                        }
                    });
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({
                        food: new forms_1.FormControl('fish'),
                        nested: new forms_1.FormGroup({ food: new forms_1.FormControl('fish') })
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    fixture.detectChanges();
                    // view -> model
                    expect(form.get('food').value).toEqual('chicken');
                    expect(form.get('nested.food').value).toEqual('fish');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                });
                it('should disable all radio buttons when disable() is called', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({ food: new forms_1.FormControl('fish'), drink: new forms_1.FormControl('cola') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toEqual(false);
                    expect(inputs[1].nativeElement.disabled).toEqual(false);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                    form.get('food').disable();
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                    form.disable();
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(true);
                    expect(inputs[3].nativeElement.disabled).toEqual(true);
                    form.enable();
                    expect(inputs[0].nativeElement.disabled).toEqual(false);
                    expect(inputs[1].nativeElement.disabled).toEqual(false);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                });
                it('should disable all radio buttons when initially disabled', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var form = new forms_1.FormGroup({
                        food: new forms_1.FormControl({ value: 'fish', disabled: true }),
                        drink: new forms_1.FormControl('cola')
                    });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toEqual(true);
                    expect(inputs[1].nativeElement.disabled).toEqual(true);
                    expect(inputs[2].nativeElement.disabled).toEqual(false);
                    expect(inputs[3].nativeElement.disabled).toEqual(false);
                });
                it('should work with reusing controls', function () {
                    var fixture = initTest(FormControlRadioButtons);
                    var food = new forms_1.FormControl('chicken');
                    fixture.componentInstance.form =
                        new forms_1.FormGroup({ 'food': food, 'drink': new forms_1.FormControl('') });
                    fixture.detectChanges();
                    var newForm = new forms_1.FormGroup({ 'food': food, 'drink': new forms_1.FormControl('') });
                    fixture.componentInstance.form = newForm;
                    fixture.detectChanges();
                    newForm.setValue({ food: 'fish', drink: '' });
                    fixture.detectChanges();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toBe(false);
                    expect(inputs[1].nativeElement.checked).toBe(true);
                });
            });
            describe('in template-driven forms', function () {
                it('should support basic functionality', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.detectChanges();
                    testing_1.tick();
                    // model -> view
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    testing_1.tick();
                    // view -> model
                    expect(fixture.componentInstance.food).toEqual('chicken');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should support multiple named <type=radio> groups', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.componentInstance.drink = 'sprite';
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(true);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                    browser_util_1.dispatchEvent(inputs[0].nativeElement, 'change');
                    testing_1.tick();
                    expect(fixture.componentInstance.food).toEqual('chicken');
                    expect(fixture.componentInstance.drink).toEqual('sprite');
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(true);
                }));
                it('should support initial undefined value', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    expect(inputs[2].nativeElement.checked).toEqual(false);
                    expect(inputs[3].nativeElement.checked).toEqual(false);
                }));
                it('should support resetting properly', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.query(by_1.By.css('form'));
                    browser_util_1.dispatchEvent(form.nativeElement, 'reset');
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should support setting value to null and undefined', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.food = null;
                    fixture.detectChanges();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                    fixture.componentInstance.food = 'chicken';
                    fixture.detectChanges();
                    testing_1.tick();
                    fixture.componentInstance.food = undefined;
                    fixture.detectChanges();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.checked).toEqual(false);
                    expect(inputs[1].nativeElement.checked).toEqual(false);
                }));
                it('should disable radio controls properly with programmatic call', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRadioForm);
                    fixture.componentInstance.food = 'fish';
                    fixture.detectChanges();
                    testing_1.tick();
                    var form = fixture.debugElement.children[0].injector.get(forms_1.NgForm);
                    form.control.get('food').disable();
                    testing_1.tick();
                    var inputs = fixture.debugElement.queryAll(by_1.By.css('input'));
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    expect(inputs[1].nativeElement.disabled).toBe(true);
                    expect(inputs[2].nativeElement.disabled).toBe(false);
                    expect(inputs[3].nativeElement.disabled).toBe(false);
                    form.control.disable();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.disabled).toBe(true);
                    expect(inputs[1].nativeElement.disabled).toBe(true);
                    expect(inputs[2].nativeElement.disabled).toBe(true);
                    expect(inputs[3].nativeElement.disabled).toBe(true);
                    form.control.enable();
                    testing_1.tick();
                    expect(inputs[0].nativeElement.disabled).toBe(false);
                    expect(inputs[1].nativeElement.disabled).toBe(false);
                    expect(inputs[2].nativeElement.disabled).toBe(false);
                    expect(inputs[3].nativeElement.disabled).toBe(false);
                }));
            });
        });
        describe('should support <type=range>', function () {
            describe('in reactive forms', function () {
                it('with basic use case', function () {
                    var fixture = initTest(FormControlRangeInput);
                    var control = new forms_1.FormControl(10);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    // model -> view
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('10');
                    input.nativeElement.value = '20';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    // view -> model
                    expect(control.value).toEqual(20);
                });
                it('when value is cleared in the UI', function () {
                    var fixture = initTest(FormControlNumberInput);
                    var control = new forms_1.FormControl(10, forms_1.Validators.required);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    input.nativeElement.value = '';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    expect(control.valid).toBe(false);
                    expect(control.value).toEqual(null);
                    input.nativeElement.value = '0';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    expect(control.valid).toBe(true);
                    expect(control.value).toEqual(0);
                });
                it('when value is cleared programmatically', function () {
                    var fixture = initTest(FormControlNumberInput);
                    var control = new forms_1.FormControl(10);
                    fixture.componentInstance.control = control;
                    fixture.detectChanges();
                    control.setValue(null);
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('');
                });
            });
            describe('in template-driven forms', function () {
                it('with basic use case', testing_1.fakeAsync(function () {
                    var fixture = initTest(NgModelRangeForm);
                    // model -> view
                    fixture.componentInstance.val = 4;
                    fixture.detectChanges();
                    testing_1.tick();
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toBe('4');
                    fixture.detectChanges();
                    testing_1.tick();
                    var newVal = '4';
                    input.triggerEventHandler('input', { target: { value: newVal } });
                    testing_1.tick();
                    // view -> model
                    fixture.detectChanges();
                    expect(typeof (fixture.componentInstance.val)).toBe('number');
                }));
            });
        });
        describe('custom value accessors', function () {
            describe('in reactive forms', function () {
                it('should support basic functionality', function () {
                    var fixture = initTest(WrappedValueForm, WrappedValue);
                    var form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa') });
                    fixture.componentInstance.form = form;
                    fixture.detectChanges();
                    // model -> view
                    var input = fixture.debugElement.query(by_1.By.css('input'));
                    expect(input.nativeElement.value).toEqual('!aa!');
                    input.nativeElement.value = '!bb!';
                    browser_util_1.dispatchEvent(input.nativeElement, 'input');
                    // view -> model
                    expect(form.value).toEqual({ 'login': 'bb' });
                    // custom validator
                    expect(form.get('login').errors).toEqual({ 'err': true });
                    form.setValue({ login: 'expected' });
                    expect(form.get('login').errors).toEqual(null);
                });
                it('should support non builtin input elements that fire a change event without a \'target\' property', function () {
                    var fixture = initTest(MyInputForm, MyInput);
                    fixture.componentInstance.form = new forms_1.FormGroup({ 'login': new forms_1.FormControl('aa') });
                    fixture.detectChanges();
                    var input = fixture.debugElement.query(by_1.By.css('my-input'));
                    expect(input.componentInstance.value).toEqual('!aa!');
                    input.componentInstance.value = '!bb!';
                    input.componentInstance.onInput.subscribe(function (value) {
                        expect(fixture.componentInstance.form.value).toEqual({ 'login': 'bb' });
                    });
                    input.componentInstance.dispatchChangeEvent();
                });
                it('should support custom accessors without setDisabledState - formControlName', function () {
                    var fixture = initTest(WrappedValueForm, WrappedValue);
                    fixture.componentInstance.form = new forms_1.FormGroup({
                        'login': new forms_1.FormControl({ value: 'aa', disabled: true }),
                    });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.form.status).toEqual('DISABLED');
                    expect(fixture.componentInstance.form.get('login').status).toEqual('DISABLED');
                });
                it('should support custom accessors without setDisabledState - formControlDirective', function () {
                    testing_1.TestBed.overrideComponent(FormControlComp, { set: { template: "<input type=\"text\" [formControl]=\"control\" wrapped-value>" } });
                    var fixture = initTest(FormControlComp);
                    fixture.componentInstance.control = new forms_1.FormControl({ value: 'aa', disabled: true });
                    fixture.detectChanges();
                    expect(fixture.componentInstance.control.status).toEqual('DISABLED');
                });
            });
            describe('in template-driven forms', function () {
                it('should support standard writing to view and model', testing_1.async(function () {
                    var fixture = initTest(NgModelCustomWrapper, NgModelCustomComp);
                    fixture.componentInstance.name = 'Nancy';
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        fixture.detectChanges();
                        fixture.whenStable().then(function () {
                            // model -> view
                            var customInput = fixture.debugElement.query(by_1.By.css('[name="custom"]'));
                            expect(customInput.nativeElement.value).toEqual('Nancy');
                            customInput.nativeElement.value = 'Carson';
                            browser_util_1.dispatchEvent(customInput.nativeElement, 'input');
                            fixture.detectChanges();
                            // view -> model
                            expect(fixture.componentInstance.name).toEqual('Carson');
                        });
                    });
                }));
            });
        });
    });
}
exports.main = main;
var FormControlComp = (function () {
    function FormControlComp() {
    }
    return FormControlComp;
}());
FormControlComp = __decorate([
    core_1.Component({ selector: 'form-control-comp', template: "<input type=\"text\" [formControl]=\"control\">" })
], FormControlComp);
exports.FormControlComp = FormControlComp;
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
exports.FormGroupComp = FormGroupComp;
var FormControlNumberInput = (function () {
    function FormControlNumberInput() {
    }
    return FormControlNumberInput;
}());
FormControlNumberInput = __decorate([
    core_1.Component({
        selector: 'form-control-number-input',
        template: "<input type=\"number\" [formControl]=\"control\">"
    })
], FormControlNumberInput);
var FormControlNameSelect = (function () {
    function FormControlNameSelect() {
        this.cities = ['SF', 'NY'];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl('SF') });
    }
    return FormControlNameSelect;
}());
FormControlNameSelect = __decorate([
    core_1.Component({
        selector: 'form-control-name-select',
        template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [value]=\"c\"></option>\n      </select>\n    </div>"
    })
], FormControlNameSelect);
var FormControlSelectNgValue = (function () {
    function FormControlSelectNgValue() {
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl(this.cities[0]) });
    }
    return FormControlSelectNgValue;
}());
FormControlSelectNgValue = __decorate([
    core_1.Component({
        selector: 'form-control-select-ngValue',
        template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
    })
], FormControlSelectNgValue);
var FormControlSelectWithCompareFn = (function () {
    function FormControlSelectWithCompareFn() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl({ id: 1, name: 'SF' }) });
    }
    return FormControlSelectWithCompareFn;
}());
FormControlSelectWithCompareFn = __decorate([
    core_1.Component({
        selector: 'form-control-select-compare-with',
        template: "\n    <div [formGroup]=\"form\">\n      <select formControlName=\"city\" [compareWith]=\"compareFn\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
    })
], FormControlSelectWithCompareFn);
var FormControlSelectMultiple = (function () {
    function FormControlSelectMultiple() {
        this.cities = ['SF', 'NY'];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl(['SF']) });
    }
    return FormControlSelectMultiple;
}());
FormControlSelectMultiple = __decorate([
    core_1.Component({
        selector: 'form-control-select-multiple',
        template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [value]=\"c\">{{c}}</option>\n      </select>\n    </div>"
    })
], FormControlSelectMultiple);
var FormControlSelectMultipleNgValue = (function () {
    function FormControlSelectMultipleNgValue() {
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl([this.cities[0]]) });
    }
    return FormControlSelectMultipleNgValue;
}());
FormControlSelectMultipleNgValue = __decorate([
    core_1.Component({
        selector: 'form-control-select-multiple',
        template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
    })
], FormControlSelectMultipleNgValue);
var FormControlSelectMultipleWithCompareFn = (function () {
    function FormControlSelectMultipleWithCompareFn() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.cities = [{ id: 1, name: 'SF' }, { id: 2, name: 'NY' }];
        this.form = new forms_1.FormGroup({ city: new forms_1.FormControl([{ id: 1, name: 'SF' }]) });
    }
    return FormControlSelectMultipleWithCompareFn;
}());
FormControlSelectMultipleWithCompareFn = __decorate([
    core_1.Component({
        selector: 'form-control-select-multiple-compare-with',
        template: "\n    <div [formGroup]=\"form\">\n      <select multiple formControlName=\"city\" [compareWith]=\"compareFn\">\n        <option *ngFor=\"let c of cities\" [ngValue]=\"c\">{{c.name}}</option>\n      </select>\n    </div>"
    })
], FormControlSelectMultipleWithCompareFn);
var NgModelSelectForm = (function () {
    function NgModelSelectForm() {
        this.selectedCity = {};
        this.cities = [];
    }
    return NgModelSelectForm;
}());
NgModelSelectForm = __decorate([
    core_1.Component({
        selector: 'ng-model-select-form',
        template: "\n    <select [(ngModel)]=\"selectedCity\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
    })
], NgModelSelectForm);
var NgModelSelectWithNullForm = (function () {
    function NgModelSelectWithNullForm() {
        this.selectedCity = {};
        this.cities = [];
    }
    return NgModelSelectWithNullForm;
}());
NgModelSelectWithNullForm = __decorate([
    core_1.Component({
        selector: 'ng-model-select-null-form',
        template: "\n    <select [(ngModel)]=\"selectedCity\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n      <option [ngValue]=\"null\">Unspecified</option>\n    </select>\n  "
    })
], NgModelSelectWithNullForm);
var NgModelSelectWithCustomCompareFnForm = (function () {
    function NgModelSelectWithCustomCompareFnForm() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.selectedCity = {};
        this.cities = [];
    }
    return NgModelSelectWithCustomCompareFnForm;
}());
NgModelSelectWithCustomCompareFnForm = __decorate([
    core_1.Component({
        selector: 'ng-model-select-compare-with',
        template: "\n    <select [(ngModel)]=\"selectedCity\" [compareWith]=\"compareFn\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
    })
], NgModelSelectWithCustomCompareFnForm);
var NgModelSelectMultipleWithCustomCompareFnForm = (function () {
    function NgModelSelectMultipleWithCustomCompareFnForm() {
        this.compareFn = function (o1, o2) { return o1 && o2 ? o1.id === o2.id : o1 === o2; };
        this.selectedCities = [];
        this.cities = [];
    }
    return NgModelSelectMultipleWithCustomCompareFnForm;
}());
NgModelSelectMultipleWithCustomCompareFnForm = __decorate([
    core_1.Component({
        selector: 'ng-model-select-multiple-compare-with',
        template: "\n    <select multiple [(ngModel)]=\"selectedCities\" [compareWith]=\"compareFn\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
    })
], NgModelSelectMultipleWithCustomCompareFnForm);
var NgModelSelectMultipleForm = (function () {
    function NgModelSelectMultipleForm() {
        this.cities = [];
    }
    return NgModelSelectMultipleForm;
}());
NgModelSelectMultipleForm = __decorate([
    core_1.Component({
        selector: 'ng-model-select-multiple-form',
        template: "\n    <select multiple [(ngModel)]=\"selectedCities\">\n      <option *ngFor=\"let c of cities\" [ngValue]=\"c\"> {{c.name}} </option>\n    </select>\n  "
    })
], NgModelSelectMultipleForm);
var FormControlRangeInput = (function () {
    function FormControlRangeInput() {
    }
    return FormControlRangeInput;
}());
FormControlRangeInput = __decorate([
    core_1.Component({
        selector: 'form-control-range-input',
        template: "<input type=\"range\" [formControl]=\"control\">"
    })
], FormControlRangeInput);
var NgModelRangeForm = (function () {
    function NgModelRangeForm() {
    }
    return NgModelRangeForm;
}());
NgModelRangeForm = __decorate([
    core_1.Component({ selector: 'ng-model-range-form', template: '<input type="range" [(ngModel)]="val">' })
], NgModelRangeForm);
var FormControlRadioButtons = (function () {
    function FormControlRadioButtons() {
        this.showRadio = new forms_1.FormControl('yes');
    }
    return FormControlRadioButtons;
}());
FormControlRadioButtons = __decorate([
    core_1.Component({
        selector: 'form-control-radio-buttons',
        template: "\n    <form [formGroup]=\"form\" *ngIf=\"showRadio.value === 'yes'\">\n      <input type=\"radio\" formControlName=\"food\" value=\"chicken\">\n      <input type=\"radio\" formControlName=\"food\" value=\"fish\">\n      <input type=\"radio\" formControlName=\"drink\" value=\"cola\">\n      <input type=\"radio\" formControlName=\"drink\" value=\"sprite\">\n    </form>\n    <input type=\"radio\" [formControl]=\"showRadio\" value=\"yes\">\n    <input type=\"radio\" [formControl]=\"showRadio\" value=\"no\">"
    })
], FormControlRadioButtons);
exports.FormControlRadioButtons = FormControlRadioButtons;
var NgModelRadioForm = (function () {
    function NgModelRadioForm() {
    }
    return NgModelRadioForm;
}());
NgModelRadioForm = __decorate([
    core_1.Component({
        selector: 'ng-model-radio-form',
        template: "\n    <form>\n      <input type=\"radio\" name=\"food\" [(ngModel)]=\"food\" value=\"chicken\">\n      <input type=\"radio\" name=\"food\"  [(ngModel)]=\"food\" value=\"fish\">\n\n      <input type=\"radio\" name=\"drink\" [(ngModel)]=\"drink\" value=\"cola\">\n      <input type=\"radio\" name=\"drink\" [(ngModel)]=\"drink\" value=\"sprite\">\n    </form>\n  "
    })
], NgModelRadioForm);
var WrappedValue = WrappedValue_1 = (function () {
    function WrappedValue() {
    }
    WrappedValue.prototype.writeValue = function (value) { this.value = "!" + value + "!"; };
    WrappedValue.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    WrappedValue.prototype.registerOnTouched = function (fn) { };
    WrappedValue.prototype.handleOnInput = function (value) { this.onChange(value.substring(1, value.length - 1)); };
    WrappedValue.prototype.validate = function (c) { return c.value === 'expected' ? null : { 'err': true }; };
    return WrappedValue;
}());
WrappedValue = WrappedValue_1 = __decorate([
    core_1.Directive({
        selector: '[wrapped-value]',
        host: { '(input)': 'handleOnInput($event.target.value)', '[value]': 'value' },
        providers: [
            { provide: forms_1.NG_VALUE_ACCESSOR, multi: true, useExisting: WrappedValue_1 },
            { provide: forms_1.NG_VALIDATORS, multi: true, useExisting: WrappedValue_1 }
        ]
    })
], WrappedValue);
var MyInput = (function () {
    function MyInput(cd) {
        this.onInput = new core_1.EventEmitter();
        cd.valueAccessor = this;
    }
    MyInput.prototype.writeValue = function (value) { this.value = "!" + value + "!"; };
    MyInput.prototype.registerOnChange = function (fn) { this.onInput.subscribe({ next: fn }); };
    MyInput.prototype.registerOnTouched = function (fn) { };
    MyInput.prototype.dispatchChangeEvent = function () { this.onInput.emit(this.value.substring(1, this.value.length - 1)); };
    return MyInput;
}());
__decorate([
    core_1.Output('input'),
    __metadata("design:type", Object)
], MyInput.prototype, "onInput", void 0);
MyInput = __decorate([
    core_1.Component({ selector: 'my-input', template: '' }),
    __metadata("design:paramtypes", [forms_1.NgControl])
], MyInput);
exports.MyInput = MyInput;
var MyInputForm = (function () {
    function MyInputForm() {
    }
    return MyInputForm;
}());
MyInputForm = __decorate([
    core_1.Component({
        selector: 'my-input-form',
        template: "\n    <div [formGroup]=\"form\">\n      <my-input formControlName=\"login\"></my-input>\n    </div>"
    })
], MyInputForm);
exports.MyInputForm = MyInputForm;
var WrappedValueForm = (function () {
    function WrappedValueForm() {
    }
    return WrappedValueForm;
}());
WrappedValueForm = __decorate([
    core_1.Component({
        selector: 'wrapped-value-form',
        template: "\n    <div [formGroup]=\"form\">\n      <input type=\"text\" formControlName=\"login\" wrapped-value>\n    </div>"
    })
], WrappedValueForm);
var NgModelCustomComp = NgModelCustomComp_1 = (function () {
    function NgModelCustomComp() {
        this.isDisabled = false;
    }
    NgModelCustomComp.prototype.writeValue = function (value) { this.model = value; };
    NgModelCustomComp.prototype.registerOnChange = function (fn) { this.changeFn = fn; };
    NgModelCustomComp.prototype.registerOnTouched = function () { };
    NgModelCustomComp.prototype.setDisabledState = function (isDisabled) { this.isDisabled = isDisabled; };
    return NgModelCustomComp;
}());
__decorate([
    core_1.Input('disabled'),
    __metadata("design:type", Boolean)
], NgModelCustomComp.prototype, "isDisabled", void 0);
NgModelCustomComp = NgModelCustomComp_1 = __decorate([
    core_1.Component({
        selector: 'ng-model-custom-comp',
        template: "\n    <input name=\"custom\" [(ngModel)]=\"model\" (ngModelChange)=\"changeFn($event)\" [disabled]=\"isDisabled\">\n  ",
        providers: [{ provide: forms_1.NG_VALUE_ACCESSOR, multi: true, useExisting: NgModelCustomComp_1 }]
    })
], NgModelCustomComp);
exports.NgModelCustomComp = NgModelCustomComp;
var NgModelCustomWrapper = (function () {
    function NgModelCustomWrapper() {
        this.isDisabled = false;
    }
    return NgModelCustomWrapper;
}());
NgModelCustomWrapper = __decorate([
    core_1.Component({
        selector: 'ng-model-custom-wrapper',
        template: "\n    <form>\n      <ng-model-custom-comp name=\"name\" [(ngModel)]=\"name\" [disabled]=\"isDisabled\"></ng-model-custom-comp>\n    </form>\n  "
    })
], NgModelCustomWrapper);
exports.NgModelCustomWrapper = NgModelCustomWrapper;
var WrappedValue_1, NgModelCustomComp_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVfYWNjZXNzb3JfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3Rlc3QvdmFsdWVfYWNjZXNzb3JfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFzRjtBQUN0RixpREFBd0Y7QUFDeEYsd0NBQWdNO0FBQ2hNLGlFQUE4RDtBQUM5RCxtRkFBaUY7QUFFakY7SUFDRSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFFMUIsa0JBQXFCLFNBQWtCO1lBQUUsb0JBQTBCO2lCQUExQixVQUEwQixFQUExQixxQkFBMEIsRUFBMUIsSUFBMEI7Z0JBQTFCLG1DQUEwQjs7WUFDakUsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEdBQUcsU0FBUyxTQUFLLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFXLEVBQUUsMkJBQW1CLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDN0YsTUFBTSxDQUFDLGlCQUFPLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIsZUFBZSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLG1DQUFpQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMxQyxJQUFNLE9BQU8sR0FBRyxJQUFJLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDNUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXhCLGdCQUFnQjtZQUNoQixJQUFNLEtB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