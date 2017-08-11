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
var of_1 = require("rxjs/observable/of");
function main() {
    function simpleValidator(c) {
        return c.get('one').value === 'correct' ? null : { 'broken': true };
    }
    function asyncValidator(expected, timeouts) {
        if (timeouts === void 0) { timeouts = {}; }
        return function (c) {
            var resolve = undefined;
            var promise = new Promise(function (res) { resolve = res; });
            var t = timeouts[c.value] != null ? timeouts[c.value] : 0;
            var res = c.value != expected ? { 'async': true } : null;
            if (t == 0) {
                resolve(res);
            }
            else {
                setTimeout(function () { resolve(res); }, t);
            }
            return promise;
        };
    }
    function asyncValidatorReturningObservable(c) {
        var e = new core_1.EventEmitter();
        Promise.resolve(null).then(function () { e.emit({ 'async': true }); });
        return e;
    }
    function otherObservableValidator() { return of_1.of({ 'other': true }); }
    testing_internal_1.describe('FormGroup', function () {
        testing_internal_1.describe('value', function () {
            testing_internal_1.it('should be the reduced value of the child controls', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('111'), 'two': new forms_1.FormControl('222') });
                expect(g.value).toEqual({ 'one': '111', 'two': '222' });
            });
            testing_internal_1.it('should be empty when there are no child controls', function () {
                var g = new forms_1.FormGroup({});
                expect(g.value).toEqual({});
            });
            testing_internal_1.it('should support nested groups', function () {
                var g = new forms_1.FormGroup({
                    'one': new forms_1.FormControl('111'),
                    'nested': new forms_1.FormGroup({ 'two': new forms_1.FormControl('222') })
                });
                expect(g.value).toEqual({ 'one': '111', 'nested': { 'two': '222' } });
                (g.get('nested.two')).setValue('333');
                expect(g.value).toEqual({ 'one': '111', 'nested': { 'two': '333' } });
            });
        });
        testing_internal_1.describe('getRawValue', function () {
            var fg;
            testing_internal_1.it('should work with nested form groups/arrays', function () {
                fg = new forms_1.FormGroup({
                    'c1': new forms_1.FormControl('v1'),
                    'group': new forms_1.FormGroup({ 'c2': new forms_1.FormControl('v2'), 'c3': new forms_1.FormControl('v3') }),
                    'array': new forms_1.FormArray([new forms_1.FormControl('v4'), new forms_1.FormControl('v5')])
                });
                fg.get('group').get('c3').disable();
                fg.get('array').at(1).disable();
                expect(fg.getRawValue())
                    .toEqual({ 'c1': 'v1', 'group': { 'c2': 'v2', 'c3': 'v3' }, 'array': ['v4', 'v5'] });
            });
        });
        testing_internal_1.describe('adding and removing controls', function () {
            testing_internal_1.it('should update value and validity when control is added', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('1') });
                expect(g.value).toEqual({ 'one': '1' });
                expect(g.valid).toBe(true);
                g.addControl('two', new forms_1.FormControl('2', forms_1.Validators.minLength(10)));
                expect(g.value).toEqual({ 'one': '1', 'two': '2' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should update value and validity when control is removed', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('1'), 'two': new forms_1.FormControl('2', forms_1.Validators.minLength(10)) });
                expect(g.value).toEqual({ 'one': '1', 'two': '2' });
                expect(g.valid).toBe(false);
                g.removeControl('two');
                expect(g.value).toEqual({ 'one': '1' });
                expect(g.valid).toBe(true);
            });
        });
        testing_internal_1.describe('dirty', function () {
            var c, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(g.dirty).toEqual(false); });
            testing_internal_1.it('should be true after changing the value of the control', function () {
                c.markAsDirty();
                expect(g.dirty).toEqual(true);
            });
        });
        testing_internal_1.describe('touched', function () {
            var c, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('value');
                g = new forms_1.FormGroup({ 'one': c });
            });
            testing_internal_1.it('should be false after creating a control', function () { expect(g.touched).toEqual(false); });
            testing_internal_1.it('should be true after control is marked as touched', function () {
                c.markAsTouched();
                expect(g.touched).toEqual(true);
            });
        });
        testing_internal_1.describe('setValue', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value', function () {
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set child values', function () {
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should set child control values if disabled', function () {
                c2.disable();
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one' });
                expect(g.getRawValue()).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set group value if group is disabled', function () {
                g.disable();
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.setValue({ 'one': 'one', 'two': 'two' });
                expect(form.value).toEqual({ 'parent': { 'one': 'one', 'two': 'two' } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.setValue({ 'one': 'one', 'two': 'two' }, { onlySelf: true });
                expect(form.value).toEqual({ parent: { 'one': '', 'two': '' } });
            });
            testing_internal_1.it('should throw if fields are missing from supplied value (subset)', function () {
                expect(function () { return g.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("Must supply a value for form control with name: 'two'"));
            });
            testing_internal_1.it('should throw if a value is provided for a missing control (superset)', function () {
                expect(function () { return g.setValue({ 'one': 'one', 'two': 'two', 'three': 'three' }); })
                    .toThrowError(new RegExp("Cannot find form control with name: three"));
            });
            testing_internal_1.it('should throw if a value is not provided for a disabled control', function () {
                c2.disable();
                expect(function () { return g.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("Must supply a value for form control with name: 'two'"));
            });
            testing_internal_1.it('should throw if no controls are set yet', function () {
                var empty = new forms_1.FormGroup({});
                expect(function () { return empty.setValue({
                    'one': 'one'
                }); }).toThrowError(new RegExp("no form controls registered with this group"));
            });
            testing_internal_1.describe('setValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': g });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.setValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.setValue({ 'one': 'one', 'two': 'two' }, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    g.setValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('patchValue', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value', function () {
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set child values', function () {
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
            });
            testing_internal_1.it('should patch disabled control values', function () {
                c2.disable();
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one' });
                expect(g.getRawValue()).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should patch disabled control groups', function () {
                g.disable();
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(c.value).toEqual('one');
                expect(c2.value).toEqual('two');
                expect(g.value).toEqual({ 'one': 'one', 'two': 'two' });
            });
            testing_internal_1.it('should set parent values', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.patchValue({ 'one': 'one', 'two': 'two' });
                expect(form.value).toEqual({ 'parent': { 'one': 'one', 'two': 'two' } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'parent': g });
                g.patchValue({ 'one': 'one', 'two': 'two' }, { onlySelf: true });
                expect(form.value).toEqual({ parent: { 'one': '', 'two': '' } });
            });
            testing_internal_1.it('should ignore fields that are missing from supplied value (subset)', function () {
                g.patchValue({ 'one': 'one' });
                expect(g.value).toEqual({ 'one': 'one', 'two': '' });
            });
            testing_internal_1.it('should not ignore fields that are null', function () {
                g.patchValue({ 'one': null });
                expect(g.value).toEqual({ 'one': null, 'two': '' });
            });
            testing_internal_1.it('should ignore any value provided for a missing control (superset)', function () {
                g.patchValue({ 'three': 'three' });
                expect(g.value).toEqual({ 'one': '', 'two': '' });
            });
            testing_internal_1.describe('patchValue() events', function () {
                var form;
                var logger;
                testing_internal_1.beforeEach(function () {
                    form = new forms_1.FormGroup({ 'parent': g });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not emit valueChange events for skipped controls', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one' });
                    expect(logger).toEqual(['control1', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.patchValue({ 'one': 'one', 'two': 'two' }, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    g.patchValue({ 'one': 'one', 'two': 'two' });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('reset()', function () {
            var c, c2, g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('initial value');
                c2 = new forms_1.FormControl('');
                g = new forms_1.FormGroup({ 'one': c, 'two': c2 });
            });
            testing_internal_1.it('should set its own value if value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(g.value).toEqual({ 'one': 'initial value', 'two': '' });
            });
            testing_internal_1.it('should set its own value if boxed value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': { value: 'initial value', disabled: false }, 'two': '' });
                expect(g.value).toEqual({ 'one': 'initial value', 'two': '' });
            });
            testing_internal_1.it('should clear its own value if no value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(g.value).toEqual({ 'one': null, 'two': null });
            });
            testing_internal_1.it('should set the value of each of its child controls if value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(c.value).toBe('initial value');
                expect(c2.value).toBe('');
            });
            testing_internal_1.it('should clear the value of each of its child controls if no value passed', function () {
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(c.value).toBe(null);
                expect(c2.value).toBe(null);
            });
            testing_internal_1.it('should set the value of its parent if value passed', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset({ 'one': 'initial value', 'two': '' });
                expect(form.value).toEqual({ 'g': { 'one': 'initial value', 'two': '' } });
            });
            testing_internal_1.it('should clear the value of its parent if no value passed', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.setValue({ 'one': 'new value', 'two': 'new value' });
                g.reset();
                expect(form.value).toEqual({ 'g': { 'one': null, 'two': null } });
            });
            testing_internal_1.it('should not update the parent when explicitly specified', function () {
                var form = new forms_1.FormGroup({ 'g': g });
                g.reset({ 'one': 'new value', 'two': 'new value' }, { onlySelf: true });
                expect(form.value).toEqual({ g: { 'one': 'initial value', 'two': '' } });
            });
            testing_internal_1.it('should mark itself as pristine', function () {
                g.markAsDirty();
                expect(g.pristine).toBe(false);
                g.reset();
                expect(g.pristine).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as pristine', function () {
                c.markAsDirty();
                c2.markAsDirty();
                expect(c.pristine).toBe(false);
                expect(c2.pristine).toBe(false);
                g.reset();
                expect(c.pristine).toBe(true);
                expect(c2.pristine).toBe(true);
            });
            testing_internal_1.it('should mark the parent as pristine if all siblings pristine', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsDirty();
                expect(form.pristine).toBe(false);
                g.reset();
                expect(form.pristine).toBe(true);
            });
            testing_internal_1.it('should not mark the parent pristine if any dirty siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsDirty();
                c3.markAsDirty();
                expect(form.pristine).toBe(false);
                g.reset();
                expect(form.pristine).toBe(false);
            });
            testing_internal_1.it('should mark itself as untouched', function () {
                g.markAsTouched();
                expect(g.untouched).toBe(false);
                g.reset();
                expect(g.untouched).toBe(true);
            });
            testing_internal_1.it('should mark all child controls as untouched', function () {
                c.markAsTouched();
                c2.markAsTouched();
                expect(c.untouched).toBe(false);
                expect(c2.untouched).toBe(false);
                g.reset();
                expect(c.untouched).toBe(true);
                expect(c2.untouched).toBe(true);
            });
            testing_internal_1.it('should mark the parent untouched if all siblings untouched', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsTouched();
                expect(form.untouched).toBe(false);
                g.reset();
                expect(form.untouched).toBe(true);
            });
            testing_internal_1.it('should not mark the parent untouched if any touched siblings', function () {
                var c3 = new forms_1.FormControl('');
                var form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                g.markAsTouched();
                c3.markAsTouched();
                expect(form.untouched).toBe(false);
                g.reset();
                expect(form.untouched).toBe(false);
            });
            testing_internal_1.it('should retain previous disabled state', function () {
                g.disable();
                g.reset();
                expect(g.disabled).toBe(true);
            });
            testing_internal_1.it('should set child disabled state if boxed value passed', function () {
                g.disable();
                g.reset({ 'one': { value: '', disabled: false }, 'two': '' });
                expect(c.disabled).toBe(false);
                expect(g.disabled).toBe(false);
            });
            testing_internal_1.describe('reset() events', function () {
                var form, c3, logger;
                testing_internal_1.beforeEach(function () {
                    c3 = new forms_1.FormControl('');
                    form = new forms_1.FormGroup({ 'g': g, 'c3': c3 });
                    logger = [];
                });
                testing_internal_1.it('should emit one valueChange event per reset control', function () {
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    c.valueChanges.subscribe(function () { return logger.push('control1'); });
                    c2.valueChanges.subscribe(function () { return logger.push('control2'); });
                    c3.valueChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset();
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should not fire an event when explicitly specified', testing_1.fakeAsync(function () {
                    form.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    c.valueChanges.subscribe(function (value) { throw 'Should not happen'; });
                    g.reset({}, { emitEvent: false });
                    testing_1.tick();
                }));
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c3.statusChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset();
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
                testing_internal_1.it('should emit one statusChange event per reset control', function () {
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    c.statusChanges.subscribe(function () { return logger.push('control1'); });
                    c2.statusChanges.subscribe(function () { return logger.push('control2'); });
                    c3.statusChanges.subscribe(function () { return logger.push('control3'); });
                    g.reset({ 'one': { value: '', disabled: true } });
                    expect(logger).toEqual(['control1', 'control2', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('contains', function () {
            var group;
            testing_internal_1.beforeEach(function () {
                group = new forms_1.FormGroup({
                    'required': new forms_1.FormControl('requiredValue'),
                    'optional': new forms_1.FormControl({ value: 'disabled value', disabled: true })
                });
            });
            testing_internal_1.it('should return false when the component is disabled', function () { expect(group.contains('optional')).toEqual(false); });
            testing_internal_1.it('should return false when there is no component with the given name', function () { expect(group.contains('something else')).toEqual(false); });
            testing_internal_1.it('should return true when the component is enabled', function () {
                expect(group.contains('required')).toEqual(true);
                group.enable();
                expect(group.contains('optional')).toEqual(true);
            });
            testing_internal_1.it('should support controls with dots in their name', function () {
                expect(group.contains('some.name')).toBe(false);
                group.addControl('some.name', new forms_1.FormControl());
                expect(group.contains('some.name')).toBe(true);
            });
        });
        testing_internal_1.describe('statusChanges', function () {
            var control;
            var group;
            testing_internal_1.beforeEach(testing_1.async(function () {
                control = new forms_1.FormControl('', asyncValidatorReturningObservable);
                group = new forms_1.FormGroup({ 'one': control });
            }));
            // TODO(kara): update these tests to use fake Async
            testing_internal_1.it('should fire a statusChange if child has async validation change', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var loggedValues = [];
                group.statusChanges.subscribe({
                    next: function (status) {
                        loggedValues.push(status);
                        if (loggedValues.length === 2) {
                            expect(loggedValues).toEqual(['PENDING', 'INVALID']);
                        }
                        async.done();
                    }
                });
                control.setValue('');
            }));
        });
        testing_internal_1.describe('getError', function () {
            testing_internal_1.it('should return the error when it is present', function () {
                var c = new forms_1.FormControl('', forms_1.Validators.required);
                var g = new forms_1.FormGroup({ 'one': c });
                expect(c.getError('required')).toEqual(true);
                expect(g.getError('required', ['one'])).toEqual(true);
            });
            testing_internal_1.it('should return null otherwise', function () {
                var c = new forms_1.FormControl('not empty', forms_1.Validators.required);
                var g = new forms_1.FormGroup({ 'one': c });
                expect(c.getError('invalid')).toEqual(null);
                expect(g.getError('required', ['one'])).toEqual(null);
                expect(g.getError('required', ['invalid'])).toEqual(null);
            });
        });
        testing_internal_1.describe('validator', function () {
            function containsValidator(c) {
                return c.get('one').value && c.get('one').value.indexOf('c') !== -1 ? null :
                    { 'missing': true };
            }
            testing_internal_1.it('should run a single validator when the value changes', function () {
                var c = new forms_1.FormControl(null);
                var g = new forms_1.FormGroup({ 'one': c }, simpleValidator);
                c.setValue('correct');
                expect(g.valid).toEqual(true);
                expect(g.errors).toEqual(null);
                c.setValue('incorrect');
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ 'broken': true });
            });
            testing_internal_1.it('should support multiple validators from array', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, [simpleValidator, containsValidator]);
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ missing: true, broken: true });
                g.setValue({ one: 'c' });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
            testing_internal_1.it('should set single validator from options obj', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, { validators: simpleValidator });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
            testing_internal_1.it('should set multiple validators from options obj', function () {
                var g = new forms_1.FormGroup({ one: new forms_1.FormControl() }, { validators: [simpleValidator, containsValidator] });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ missing: true, broken: true });
                g.setValue({ one: 'c' });
                expect(g.valid).toEqual(false);
                expect(g.errors).toEqual({ broken: true });
                g.setValue({ one: 'correct' });
                expect(g.valid).toEqual(true);
            });
        });
        testing_internal_1.describe('asyncValidator', function () {
            testing_internal_1.it('should run the async validator', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value');
                var g = new forms_1.FormGroup({ 'one': c }, null, asyncValidator('expected'));
                expect(g.pending).toEqual(true);
                testing_1.tick(1);
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from array', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, null, [asyncValidator('expected'), otherObservableValidator]);
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set single async validator from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, { asyncValidators: asyncValidator('expected') });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set multiple async validators from options obj', testing_1.fakeAsync(function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl('value') }, { asyncValidators: [asyncValidator('expected'), otherObservableValidator] });
                expect(g.pending).toEqual(true);
                testing_1.tick();
                expect(g.errors).toEqual({ 'async': true, 'other': true });
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should set the parent group\'s status to pending', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                var g = new forms_1.FormGroup({ 'one': c });
                expect(g.pending).toEqual(true);
                testing_1.tick(1);
                expect(g.pending).toEqual(false);
            }));
            testing_internal_1.it('should run the parent group\'s async validator when children are pending', testing_1.fakeAsync(function () {
                var c = new forms_1.FormControl('value', null, asyncValidator('expected'));
                var g = new forms_1.FormGroup({ 'one': c }, null, asyncValidator('expected'));
                testing_1.tick(1);
                expect(g.errors).toEqual({ 'async': true });
                expect(g.get('one').errors).toEqual({ 'async': true });
            }));
        });
        testing_internal_1.describe('disable() & enable()', function () {
            testing_internal_1.it('should mark the group as disabled', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl(null) });
                expect(g.disabled).toBe(false);
                expect(g.valid).toBe(true);
                g.disable();
                expect(g.disabled).toBe(true);
                expect(g.valid).toBe(false);
                g.enable();
                expect(g.disabled).toBe(false);
                expect(g.valid).toBe(true);
            });
            testing_internal_1.it('should set the group status as disabled', function () {
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl(null) });
                expect(g.status).toEqual('VALID');
                g.disable();
                expect(g.status).toEqual('DISABLED');
                g.enable();
                expect(g.status).toBe('VALID');
            });
            testing_internal_1.it('should mark children of the group as disabled', function () {
                var c1 = new forms_1.FormControl(null);
                var c2 = new forms_1.FormControl(null);
                var g = new forms_1.FormGroup({ 'one': c1, 'two': c2 });
                expect(c1.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
                g.disable();
                expect(c1.disabled).toBe(true);
                expect(c2.disabled).toBe(true);
                g.enable();
                expect(c1.disabled).toBe(false);
                expect(c2.disabled).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls in validation', function () {
                var g = new forms_1.FormGroup({
                    nested: new forms_1.FormGroup({ one: new forms_1.FormControl(null, forms_1.Validators.required) }),
                    two: new forms_1.FormControl('two')
                });
                expect(g.valid).toBe(false);
                g.get('nested').disable();
                expect(g.valid).toBe(true);
                g.get('nested').enable();
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should ignore disabled controls when serializing value', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                expect(g.value).toEqual({ 'nested': { 'one': 'one' }, 'two': 'two' });
                g.get('nested').disable();
                expect(g.value).toEqual({ 'two': 'two' });
                g.get('nested').enable();
                expect(g.value).toEqual({ 'nested': { 'one': 'one' }, 'two': 'two' });
            });
            testing_internal_1.it('should update its value when disabled with disabled children', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one'), two: new forms_1.FormControl('two') }) });
                g.get('nested.two').disable();
                expect(g.value).toEqual({ nested: { one: 'one' } });
                g.get('nested').disable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
                g.get('nested').enable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
            });
            testing_internal_1.it('should update its value when enabled with disabled children', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one'), two: new forms_1.FormControl('two') }) });
                g.get('nested.two').disable();
                expect(g.value).toEqual({ nested: { one: 'one' } });
                g.get('nested').enable();
                expect(g.value).toEqual({ nested: { one: 'one', two: 'two' } });
            });
            testing_internal_1.it('should ignore disabled controls when determining dirtiness', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                g.get('nested.one').markAsDirty();
                expect(g.dirty).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').dirty).toBe(true);
                expect(g.dirty).toEqual(false);
                g.get('nested').enable();
                expect(g.dirty).toEqual(true);
            });
            testing_internal_1.it('should ignore disabled controls when determining touched state', function () {
                var g = new forms_1.FormGroup({ nested: new forms_1.FormGroup({ one: new forms_1.FormControl('one') }), two: new forms_1.FormControl('two') });
                g.get('nested.one').markAsTouched();
                expect(g.touched).toBe(true);
                g.get('nested').disable();
                expect(g.get('nested').touched).toBe(true);
                expect(g.touched).toEqual(false);
                g.get('nested').enable();
                expect(g.touched).toEqual(true);
            });
            testing_internal_1.it('should keep empty, disabled groups disabled when updating validity', function () {
                var group = new forms_1.FormGroup({});
                expect(group.status).toEqual('VALID');
                group.disable();
                expect(group.status).toEqual('DISABLED');
                group.updateValueAndValidity();
                expect(group.status).toEqual('DISABLED');
                group.addControl('one', new forms_1.FormControl({ value: '', disabled: true }));
                expect(group.status).toEqual('DISABLED');
                group.addControl('two', new forms_1.FormControl());
                expect(group.status).toEqual('VALID');
            });
            testing_internal_1.it('should re-enable empty, disabled groups', function () {
                var group = new forms_1.FormGroup({});
                group.disable();
                expect(group.status).toEqual('DISABLED');
                group.enable();
                expect(group.status).toEqual('VALID');
            });
            testing_internal_1.it('should not run validators on disabled controls', function () {
                var validator = jasmine.createSpy('validator');
                var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, validator);
                expect(validator.calls.count()).toEqual(1);
                g.disable();
                expect(validator.calls.count()).toEqual(1);
                g.setValue({ one: 'value' });
                expect(validator.calls.count()).toEqual(1);
                g.enable();
                expect(validator.calls.count()).toEqual(2);
            });
            testing_internal_1.describe('disabled errors', function () {
                testing_internal_1.it('should clear out group errors when disabled', function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, function () { return ({ 'expected': true }); });
                    expect(g.errors).toEqual({ 'expected': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.enable();
                    expect(g.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should re-populate group errors when enabled from a child', function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, function () { return ({ 'expected': true }); });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.addControl('two', new forms_1.FormControl());
                    expect(g.errors).toEqual({ 'expected': true });
                });
                testing_internal_1.it('should clear out async group errors when disabled', testing_1.fakeAsync(function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.enable();
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                }));
                testing_internal_1.it('should re-populate async group errors when enabled from a child', testing_1.fakeAsync(function () {
                    var g = new forms_1.FormGroup({ 'one': new forms_1.FormControl() }, null, asyncValidator('expected'));
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                    g.disable();
                    expect(g.errors).toEqual(null);
                    g.addControl('two', new forms_1.FormControl());
                    testing_1.tick();
                    expect(g.errors).toEqual({ 'async': true });
                }));
            });
            testing_internal_1.describe('disabled events', function () {
                var logger;
                var c;
                var g;
                var form;
                testing_internal_1.beforeEach(function () {
                    logger = [];
                    c = new forms_1.FormControl('', forms_1.Validators.required);
                    g = new forms_1.FormGroup({ one: c });
                    form = new forms_1.FormGroup({ g: g });
                });
                testing_internal_1.it('should emit value change events in the right order', function () {
                    c.valueChanges.subscribe(function () { return logger.push('control'); });
                    g.valueChanges.subscribe(function () { return logger.push('group'); });
                    form.valueChanges.subscribe(function () { return logger.push('form'); });
                    g.disable();
                    expect(logger).toEqual(['control', 'group', 'form']);
                });
                testing_internal_1.it('should emit status change events in the right order', function () {
                    c.statusChanges.subscribe(function () { return logger.push('control'); });
                    g.statusChanges.subscribe(function () { return logger.push('group'); });
                    form.statusChanges.subscribe(function () { return logger.push('form'); });
                    g.disable();
                    expect(logger).toEqual(['control', 'group', 'form']);
                });
            });
        });
        testing_internal_1.describe('updateTreeValidity()', function () {
            var c, c2, c3;
            var nested, form;
            var logger;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('one');
                c2 = new forms_1.FormControl('two');
                c3 = new forms_1.FormControl('three');
                nested = new forms_1.FormGroup({ one: c, two: c2 });
                form = new forms_1.FormGroup({ nested: nested, three: c3 });
                logger = [];
                c.statusChanges.subscribe(function () { return logger.push('one'); });
                c2.statusChanges.subscribe(function () { return logger.push('two'); });
                c3.statusChanges.subscribe(function () { return logger.push('three'); });
                nested.statusChanges.subscribe(function () { return logger.push('nested'); });
                form.statusChanges.subscribe(function () { return logger.push('form'); });
            });
            testing_internal_1.it('should update tree validity', function () {
                form._updateTreeValidity();
                expect(logger).toEqual(['one', 'two', 'nested', 'three', 'form']);
            });
            testing_internal_1.it('should not emit events when turned off', function () {
                form._updateTreeValidity({ emitEvent: false });
                expect(logger).toEqual([]);
            });
        });
        testing_internal_1.describe('setControl()', function () {
            var c;
            var g;
            testing_internal_1.beforeEach(function () {
                c = new forms_1.FormControl('one');
                g = new forms_1.FormGroup({ one: c });
            });
            testing_internal_1.it('should replace existing control with new control', function () {
                var c2 = new forms_1.FormControl('new!', forms_1.Validators.minLength(10));
                g.setControl('one', c2);
                expect(g.controls['one']).toEqual(c2);
                expect(g.value).toEqual({ one: 'new!' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should add control if control did not exist before', function () {
                var c2 = new forms_1.FormControl('new!', forms_1.Validators.minLength(10));
                g.setControl('two', c2);
                expect(g.controls['two']).toEqual(c2);
                expect(g.value).toEqual({ one: 'one', two: 'new!' });
                expect(g.valid).toBe(false);
            });
            testing_internal_1.it('should remove control if new control is null', function () {
                g.setControl('one', null);
                expect(g.controls['one']).not.toBeDefined();
                expect(g.value).toEqual({});
            });
            testing_internal_1.it('should only emit value change event once', function () {
                var logger = [];
                var c2 = new forms_1.FormControl('new!');
                g.valueChanges.subscribe(function () { return logger.push('change!'); });
                g.setControl('one', c2);
                expect(logger).toEqual(['change!']);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvdGVzdC9mb3JtX2dyb3VwX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMkM7QUFDM0MsaURBQTZEO0FBQzdELCtFQUFnSDtBQUNoSCx3Q0FBZ0g7QUFDaEgseUNBQXVDO0FBR3ZDO0lBQ0UseUJBQXlCLENBQWtCO1FBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCx3QkFBd0IsUUFBZ0IsRUFBRSxRQUFhO1FBQWIseUJBQUEsRUFBQSxhQUFhO1FBQ3JELE1BQU0sQ0FBQyxVQUFDLENBQWtCO1lBQ3hCLElBQUksT0FBTyxHQUEwQixTQUFXLENBQUM7WUFDakQsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sQ0FBQyxHQUFJLFFBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksR0FBSSxRQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUUsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLEdBQUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLEdBQUcsSUFBSSxDQUFDO1lBRXpELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixVQUFV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