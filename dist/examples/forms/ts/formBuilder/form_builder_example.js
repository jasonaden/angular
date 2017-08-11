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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #docregion Component
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let FormBuilderComp = class FormBuilderComp {
    constructor(fb) {
        this.form = fb.group({
            name: fb.group({
                first: ['Nancy', forms_1.Validators.minLength(2)],
                last: 'Drew',
            }),
            email: '',
        });
    }
};
FormBuilderComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form [formGroup]="form">
      <div formGroupName="name">
        <input formControlName="first" placeholder="First">
        <input formControlName="last" placeholder="Last">
      </div>
      <input formControlName="email" placeholder="Email">
      <button>Submit</button>
    </form>
    
    <p>Value: {{ form.value | json }}</p>
    <p>Validation status: {{ form.status }}</p>
  `
    }),
    __param(0, core_1.Inject(forms_1.FormBuilder))
], FormBuilderComp);
exports.FormBuilderComp = FormBuilderComp;
// #enddocregion
//# sourceMappingURL=form_builder_example.js.map