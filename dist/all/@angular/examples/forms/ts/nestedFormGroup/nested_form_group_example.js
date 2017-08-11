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
var NestedFormGroupComp = (function () {
    function NestedFormGroupComp() {
        this.form = new forms_1.FormGroup({
            name: new forms_1.FormGroup({
                first: new forms_1.FormControl('Nancy', forms_1.Validators.minLength(2)),
                last: new forms_1.FormControl('Drew', forms_1.Validators.required)
            }),
            email: new forms_1.FormControl()
        });
    }
    Object.defineProperty(NestedFormGroupComp.prototype, "first", {
        get: function () { return this.form.get('name.first'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NestedFormGroupComp.prototype, "name", {
        get: function () { return this.form.get('name'); },
        enumerable: true,
        configurable: true
    });
    NestedFormGroupComp.prototype.onSubmit = function () {
        console.log(this.first.value); // 'Nancy'
        console.log(this.name.value); // {first: 'Nancy', last: 'Drew'}
        console.log(this.form.value); // {name: {first: 'Nancy', last: 'Drew'}, email: ''}
        console.log(this.form.status); // VALID
    };
    NestedFormGroupComp.prototype.setPreset = function () { this.name.setValue({ first: 'Bess', last: 'Marvin' }); };
    return NestedFormGroupComp;
}());
NestedFormGroupComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n      <p *ngIf=\"name.invalid\">Name is invalid.</p>\n\n      <div formGroupName=\"name\">\n        <input formControlName=\"first\" placeholder=\"First name\">\n        <input formControlName=\"last\" placeholder=\"Last name\">\n      </div>\n      <input formControlName=\"email\" placeholder=\"Email\">\n      <button type=\"submit\">Submit</button>\n    </form>\n\n    <button (click)=\"setPreset()\">Set preset</button>\n",
    })
], NestedFormGroupComp);
exports.NestedFormGroupComp = NestedFormGroupComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkX2Zvcm1fZ3JvdXBfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2Zvcm1zL3RzL25lc3RlZEZvcm1Hcm91cC9uZXN0ZWRfZm9ybV9ncm91cF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsZ0NBQWdDO0FBQ2hDLHVCQUF1QjtBQUN2QixzQ0FBd0M7QUFDeEMsd0NBQWtFO0FBbUJsRSxJQUFhLG1CQUFtQjtJQWpCaEM7UUFrQkUsU0FBSSxHQUFHLElBQUksaUJBQVMsQ0FBQztZQUNuQixJQUFJLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUNsQixLQUFLLEVBQUUsSUFBSSxtQkFBVyxDQUFDLE9BQU8sRUFBRSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxFQUFFLElBQUksbUJBQVcsQ0FBQyxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7YUFDbkQsQ0FBQztZQUNGLEtBQUssRUFBRSxJQUFJLG1CQUFXLEVBQUU7U0FDekIsQ0FBQyxDQUFDO0lBY0wsQ0FBQztJQVpDLHNCQUFJLHNDQUFLO2FBQVQsY0FBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFeEQsc0JBQUkscUNBQUk7YUFBUixjQUFrQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVqRCxzQ0FBUSxHQUFSO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUUsVUFBVTtRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRyxpQ0FBaUM7UUFDakUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUcsb0RBQW9EO1FBQ3BGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFFLFFBQVE7SUFDMUMsQ0FBQztJQUVELHVDQUFTLEdBQVQsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLDBCQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQztBQXJCWSxtQkFBbUI7SUFqQi9CLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUUseWVBYVg7S0FDQSxDQUFDO0dBQ1csbUJBQW1CLENBcUIvQjtBQXJCWSxrREFBbUI7QUFzQmhDLGdCQUFnQiJ9