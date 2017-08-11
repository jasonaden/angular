"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var forms_1 = require("@angular/forms");
function main() {
    function syncValidator(_ /** TODO #9100 */) { return null; }
    function asyncValidator(_ /** TODO #9100 */) { return Promise.resolve(null); }
    testing_internal_1.describe('Form Builder', function () {
        var b;
        testing_internal_1.beforeEach(function () { b = new forms_1.FormBuilder(); });
        testing_internal_1.it('should create controls from a value', function () {
            var g = b.group({ 'login': 'some value' });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
        });
        testing_internal_1.it('should create controls from a boxed value', function () {
            var g = b.group({ 'login': { value: 'some value', disabled: true } });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['login'].disabled).toEqual(true);
        });
        testing_internal_1.it('should create controls from an array', function () {
            var g = b.group({ 'login': ['some value'], 'password': ['some value', syncValidator, asyncValidator] });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['password'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['password'].validator).toEqual(syncValidator);
            testing_internal_1.expect(g.controls['password'].asyncValidator).toEqual(asyncValidator);
        });
        testing_internal_1.it('should use controls', function () {
            var g = b.group({ 'login': b.control('some value', syncValidator, asyncValidator) });
            testing_internal_1.expect(g.controls['login'].value).toEqual('some value');
            testing_internal_1.expect(g.controls['login'].validator).toBe(syncValidator);
            testing_internal_1.expect(g.controls['login'].asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should create groups with a custom validator', function () {
            var g = b.group({ 'login': 'some value' }, { 'validator': syncValidator, 'asyncValidator': asyncValidator });
            testing_internal_1.expect(g.validator).toBe(syncValidator);
            testing_internal_1.expect(g.asyncValidator).toBe(asyncValidator);
        });
        testing_internal_1.it('should create control arrays', function () {
            var c = b.control('three');
            var a = b.array(['one', ['two', syncValidator], c, b.array(['four'])], syncValidator, asyncValidator);
            testing_internal_1.expect(a.value).toEqual(['one', 'two', 'three', ['four']]);
            testing_internal_1.expect(a.validator).toBe(syncValidator);
            testing_internal_1.expect(a.asyncValidator).toBe(asyncValidator);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy90ZXN0L2Zvcm1fYnVpbGRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQTRGO0FBQzVGLHdDQUEyQztBQUUzQztJQUNFLHVCQUF1QixDQUFNLENBQUMsaUJBQWlCLElBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLHdCQUF3QixDQUFNLENBQUMsaUJBQWlCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5GLDJCQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksQ0FBYyxDQUFDO1FBRW5CLDZCQUFVLENBQUMsY0FBUSxDQUFDLEdBQUcsSUFBSSxtQkFBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxxQkFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztZQUUzQyx5QkFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXBFLHlCQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMs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