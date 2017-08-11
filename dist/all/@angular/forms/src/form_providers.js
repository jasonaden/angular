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
var directives_1 = require("./directives");
var radio_control_value_accessor_1 = require("./directives/radio_control_value_accessor");
var form_builder_1 = require("./form_builder");
/**
 * The ng module for forms.
 * @stable
 */
var FormsModule = (function () {
    function FormsModule() {
    }
    return FormsModule;
}());
FormsModule = __decorate([
    core_1.NgModule({
        declarations: directives_1.TEMPLATE_DRIVEN_DIRECTIVES,
        providers: [radio_control_value_accessor_1.RadioControlRegistry],
        exports: [directives_1.InternalFormsSharedModule, directives_1.TEMPLATE_DRIVEN_DIRECTIVES]
    })
], FormsModule);
exports.FormsModule = FormsModule;
/**
 * The ng module for reactive forms.
 * @stable
 */
var ReactiveFormsModule = (function () {
    function ReactiveFormsModule() {
    }
    return ReactiveFormsModule;
}());
ReactiveFormsModule = __decorate([
    core_1.NgModule({
        declarations: [directives_1.REACTIVE_DRIVEN_DIRECTIVES],
        providers: [form_builder_1.FormBuilder, radio_control_value_accessor_1.RadioControlRegistry],
        exports: [directives_1.InternalFormsSharedModule, directives_1.REACTIVE_DRIVEN_DIRECTIVES]
    })
], ReactiveFormsModule);
exports.ReactiveFormsModule = ReactiveFormsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBdUM7QUFFdkMsMkNBQStHO0FBQy9HLDBGQUErRTtBQUMvRSwrQ0FBMkM7QUFHM0M7OztHQUdHO0FBTUgsSUFBYSxXQUFXO0lBQXhCO0lBQ0EsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxXQUFXO0lBTHZCLGVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSx1Q0FBMEI7UUFDeEMsU0FBUyxFQUFFLENBQUMsbURBQW9CLENBQUM7UUFDakMsT0FBTyxFQUFFLENBQUMsc0NBQXlCLEVBQUUsdUNBQTBCLENBQUM7S0FDakUsQ0FBQztHQUNXLFdBQVcsQ0FDdkI7QUFEWSxrQ0FBVztBQUd4Qjs7O0dBR0c7QUFNSCxJQUFhLG1CQUFtQjtJQUFoQztJQUNBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksbUJBQW1CO0lBTC9CLGVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSxDQUFDLHVDQUEwQixDQUFDO1FBQzFDLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsbURBQW9CLENBQUM7UUFDOUMsT0FBTyxFQUFFLENBQUMsc0NBQXlCLEVBQUUsdUNBQTBCLENBQUM7S0FDakUsQ0FBQztHQUNXLG1CQUFtQixDQUMvQjtBQURZLGtEQUFtQiJ9