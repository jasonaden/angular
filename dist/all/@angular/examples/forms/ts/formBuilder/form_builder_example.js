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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #docregion Component
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var FormBuilderComp = (function () {
    function FormBuilderComp(fb) {
        this.form = fb.group({
            name: fb.group({
                first: ['Nancy', forms_1.Validators.minLength(2)],
                last: 'Drew',
            }),
            email: '',
        });
    }
    return FormBuilderComp;
}());
FormBuilderComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <form [formGroup]=\"form\">\n      <div formGroupName=\"name\">\n        <input formControlName=\"first\" placeholder=\"First\">\n        <input formControlName=\"last\" placeholder=\"Last\">\n      </div>\n      <input formControlName=\"email\" placeholder=\"Email\">\n      <button>Submit</button>\n    </form>\n    \n    <p>Value: {{ form.value | json }}</p>\n    <p>Validation status: {{ form.status }}</p>\n  "
    }),
    __param(0, core_1.Inject(forms_1.FormBuilder)),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], FormBuilderComp);
exports.FormBuilderComp = FormBuilderComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHVCQUF1QjtBQUN2QixzQ0FBZ0Q7QUFDaEQsd0NBQWtFO0FBa0JsRSxJQUFhLGVBQWU7SUFHMUIseUJBQWlDLEVBQWU7UUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUNiLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxFQUFFLE1BQU07YUFDYixDQUFDO1lBQ0YsS0FBSyxFQUFFLEVBQUU7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLGVBQWU7SUFoQjNCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUUsc2FBWVQ7S0FDRixDQUFDO0lBSWEsV0FBQSxhQUFNLENBQUMsbUJBQVcsQ0FBQyxDQUFBO3FDQUFLLG1CQUFXO0dBSHJDLGVBQWUsQ0FZM0I7QUFaWSwwQ0FBZTtBQWE1QixnQkFBZ0IifQ==