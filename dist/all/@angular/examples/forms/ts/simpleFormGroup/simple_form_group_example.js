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
/* tslint:disable:no-console  */
// #docregion Component
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var SimpleFormGroup = (function () {
    function SimpleFormGroup() {
        this.form = new forms_1.FormGroup({
            first: new forms_1.FormControl('Nancy', forms_1.Validators.minLength(2)),
            last: new forms_1.FormControl('Drew'),
        });
    }
    Object.defineProperty(SimpleFormGroup.prototype, "first", {
        get: function () { return this.form.get('first'); },
        enumerable: true,
        configurable: true
    });
    SimpleFormGroup.prototype.onSubmit = function () {
        console.log(this.form.value); // {first: 'Nancy', last: 'Drew'}
    };
    SimpleFormGroup.prototype.setValue = function () { this.form.setValue({ first: 'Carson', last: 'Drew' }); };
    return SimpleFormGroup;
}());
SimpleFormGroup = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n      <div *ngIf=\"first.invalid\"> Name is too short. </div>\n\n      <input formControlName=\"first\" placeholder=\"First name\">\n      <input formControlName=\"last\" placeholder=\"Last name\">\n\n      <button type=\"submit\">Submit</button>\n   </form>\n   <button (click)=\"setValue()\">Set preset value</button>\n  ",
    })
], SimpleFormGroup);
exports.SimpleFormGroup = SimpleFormGroup;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX2Zvcm1fZ3JvdXBfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsZ0NBQWdDO0FBQ2hDLHVCQUF1QjtBQUN2QixzQ0FBd0M7QUFDeEMsd0NBQWtFO0FBZ0JsRSxJQUFhLGVBQWU7SUFkNUI7UUFlRSxTQUFJLEdBQUcsSUFBSSxpQkFBUyxDQUFDO1lBQ25CLEtBQUssRUFBRSxJQUFJLG1CQUFXLENBQUMsT0FBTyxFQUFFLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksRUFBRSxJQUFJLG1CQUFXLENBQUMsTUFBTSxDQUFDO1NBQzlCLENBQUMsQ0FBQztJQVNMLENBQUM7SUFQQyxzQkFBSSxrQ0FBSzthQUFULGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRW5ELGtDQUFRLEdBQVI7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxpQ0FBaUM7SUFDbEUsQ0FBQztJQUVELGtDQUFRLEdBQVIsY0FBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLHNCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSxlQUFlO0lBZDNCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUUsa1lBVVQ7S0FDRixDQUFDO0dBQ1csZUFBZSxDQWEzQjtBQWJZLDBDQUFlO0FBZ0I1QixnQkFBZ0IifQ==