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
var checkbox_value_accessor_1 = require("./directives/checkbox_value_accessor");
var default_value_accessor_1 = require("./directives/default_value_accessor");
var ng_control_status_1 = require("./directives/ng_control_status");
var ng_form_1 = require("./directives/ng_form");
var ng_model_1 = require("./directives/ng_model");
var ng_model_group_1 = require("./directives/ng_model_group");
var ng_no_validate_directive_1 = require("./directives/ng_no_validate_directive");
var number_value_accessor_1 = require("./directives/number_value_accessor");
var radio_control_value_accessor_1 = require("./directives/radio_control_value_accessor");
var range_value_accessor_1 = require("./directives/range_value_accessor");
var form_control_directive_1 = require("./directives/reactive_directives/form_control_directive");
var form_control_name_1 = require("./directives/reactive_directives/form_control_name");
var form_group_directive_1 = require("./directives/reactive_directives/form_group_directive");
var form_group_name_1 = require("./directives/reactive_directives/form_group_name");
var select_control_value_accessor_1 = require("./directives/select_control_value_accessor");
var select_multiple_control_value_accessor_1 = require("./directives/select_multiple_control_value_accessor");
var validators_1 = require("./directives/validators");
var checkbox_value_accessor_2 = require("./directives/checkbox_value_accessor");
exports.CheckboxControlValueAccessor = checkbox_value_accessor_2.CheckboxControlValueAccessor;
var default_value_accessor_2 = require("./directives/default_value_accessor");
exports.DefaultValueAccessor = default_value_accessor_2.DefaultValueAccessor;
var ng_control_1 = require("./directives/ng_control");
exports.NgControl = ng_control_1.NgControl;
var ng_control_status_2 = require("./directives/ng_control_status");
exports.NgControlStatus = ng_control_status_2.NgControlStatus;
exports.NgControlStatusGroup = ng_control_status_2.NgControlStatusGroup;
var ng_form_2 = require("./directives/ng_form");
exports.NgForm = ng_form_2.NgForm;
var ng_model_2 = require("./directives/ng_model");
exports.NgModel = ng_model_2.NgModel;
var ng_model_group_2 = require("./directives/ng_model_group");
exports.NgModelGroup = ng_model_group_2.NgModelGroup;
var number_value_accessor_2 = require("./directives/number_value_accessor");
exports.NumberValueAccessor = number_value_accessor_2.NumberValueAccessor;
var radio_control_value_accessor_2 = require("./directives/radio_control_value_accessor");
exports.RadioControlValueAccessor = radio_control_value_accessor_2.RadioControlValueAccessor;
var range_value_accessor_2 = require("./directives/range_value_accessor");
exports.RangeValueAccessor = range_value_accessor_2.RangeValueAccessor;
var form_control_directive_2 = require("./directives/reactive_directives/form_control_directive");
exports.FormControlDirective = form_control_directive_2.FormControlDirective;
var form_control_name_2 = require("./directives/reactive_directives/form_control_name");
exports.FormControlName = form_control_name_2.FormControlName;
var form_group_directive_2 = require("./directives/reactive_directives/form_group_directive");
exports.FormGroupDirective = form_group_directive_2.FormGroupDirective;
var form_group_name_2 = require("./directives/reactive_directives/form_group_name");
exports.FormArrayName = form_group_name_2.FormArrayName;
exports.FormGroupName = form_group_name_2.FormGroupName;
var select_control_value_accessor_2 = require("./directives/select_control_value_accessor");
exports.NgSelectOption = select_control_value_accessor_2.NgSelectOption;
exports.SelectControlValueAccessor = select_control_value_accessor_2.SelectControlValueAccessor;
var select_multiple_control_value_accessor_2 = require("./directives/select_multiple_control_value_accessor");
exports.NgSelectMultipleOption = select_multiple_control_value_accessor_2.NgSelectMultipleOption;
exports.SelectMultipleControlValueAccessor = select_multiple_control_value_accessor_2.SelectMultipleControlValueAccessor;
exports.SHARED_FORM_DIRECTIVES = [
    ng_no_validate_directive_1.NgNoValidate,
    select_control_value_accessor_1.NgSelectOption,
    select_multiple_control_value_accessor_1.NgSelectMultipleOption,
    default_value_accessor_1.DefaultValueAccessor,
    number_value_accessor_1.NumberValueAccessor,
    range_value_accessor_1.RangeValueAccessor,
    checkbox_value_accessor_1.CheckboxControlValueAccessor,
    select_control_value_accessor_1.SelectControlValueAccessor,
    select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor,
    radio_control_value_accessor_1.RadioControlValueAccessor,
    ng_control_status_1.NgControlStatus,
    ng_control_status_1.NgControlStatusGroup,
    validators_1.RequiredValidator,
    validators_1.MinLengthValidator,
    validators_1.MaxLengthValidator,
    validators_1.PatternValidator,
    validators_1.CheckboxRequiredValidator,
    validators_1.EmailValidator,
];
exports.TEMPLATE_DRIVEN_DIRECTIVES = [ng_model_1.NgModel, ng_model_group_1.NgModelGroup, ng_form_1.NgForm];
exports.REACTIVE_DRIVEN_DIRECTIVES = [form_control_directive_1.FormControlDirective, form_group_directive_1.FormGroupDirective, form_control_name_1.FormControlName, form_group_name_1.FormGroupName, form_group_name_1.FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
var InternalFormsSharedModule = (function () {
    function InternalFormsSharedModule() {
    }
    return InternalFormsSharedModule;
}());
InternalFormsSharedModule = __decorate([
    core_1.NgModule({
        declarations: exports.SHARED_FORM_DIRECTIVES,
        exports: exports.SHARED_FORM_DIRECTIVES,
    })
], InternalFormsSharedModule);
exports.InternalFormsSharedModule = InternalFormsSharedModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQTZDO0FBRTdDLGdGQUFrRjtBQUNsRiw4RUFBeUU7QUFDekUsb0VBQXFGO0FBQ3JGLGdEQUE0QztBQUM1QyxrREFBOEM7QUFDOUMsOERBQXlEO0FBQ3pELGtGQUFtRTtBQUNuRSw0RUFBdUU7QUFDdkUsMEZBQW9GO0FBQ3BGLDBFQUFxRTtBQUNyRSxrR0FBNkY7QUFDN0Ysd0ZBQW1GO0FBQ25GLDhGQUF5RjtBQUN6RixvRkFBOEY7QUFDOUYsNEZBQXNHO0FBQ3RHLDhHQUErSDtBQUMvSCxzREFBK0o7QUFFL0osZ0ZBQWtGO0FBQTFFLGlFQUFBLDRCQUE0QixDQUFBO0FBRXBDLDhFQUF5RTtBQUFqRSx3REFBQSxvQkFBb0IsQ0FBQTtBQUM1QixzREFBa0Q7QUFBMUMsaUNBQUEsU0FBUyxDQUFBO0FBQ2pCLG9FQUFxRjtBQUE3RSw4Q0FBQSxlQUFlLENBQUE7QUFBRSxtREFBQSxvQkFBb0IsQ0FBQTtBQUM3QyxnREFBNEM7QUFBcEMsMkJBQUEsTUFBTSxDQUFBO0FBQ2Qsa0RBQThDO0FBQXRDLDZCQUFBLE9BQU8sQ0FBQTtBQUNmLDhEQUF5RDtBQUFqRCx3Q0FBQSxZQUFZLENBQUE7QUFDcEIsNEVBQXVFO0FBQS9ELHNEQUFBLG1CQUFtQixDQUFBO0FBQzNCLDBGQUFvRjtBQUE1RSxtRUFBQSx5QkFBeUIsQ0FBQTtBQUNqQywwRUFBcUU7QUFBN0Qsb0RBQUEsa0JBQWtCLENBQUE7QUFDMUIsa0dBQTZGO0FBQXJGLHdEQUFBLG9CQUFvQixDQUFBO0FBQzVCLHdGQUFtRjtBQUEzRSw4Q0FBQSxlQUFlLENBQUE7QUFDdkIsOEZBQXlGO0FBQWpGLG9EQUFBLGtCQUFrQixDQUFBO0FBQzFCLG9GQUE4RjtBQUF0RiwwQ0FBQSxhQUFhLENBQUE7QUFBRSwwQ0FBQSxhQUFhLENBQUE7QUFDcEMsNEZBQXNHO0FBQTlGLHlEQUFBLGNBQWMsQ0FBQTtBQUFFLHFFQUFBLDBCQUEwQixDQUFBO0FBQ2xELDhHQUErSDtBQUF2SCwwRUFBQSxzQkFBc0IsQ0FBQTtBQUFFLHNGQUFBLGtDQUFrQyxDQUFBO0FBRXJELFFBQUEsc0JBQXNCLEdBQWdCO0lBQ2pELHVDQUFZO0lBQ1osOENBQWM7SUFDZCwrREFBc0I7SUFDdEIsNkNBQW9CO0lBQ3BCLDJDQUFtQjtJQUNuQix5Q0FBa0I7SUFDbEIsc0RBQTRCO0lBQzVCLDBEQUEwQjtJQUMxQiwyRUFBa0M7SUFDbEMsd0RBQXlCO0lBQ3pCLG1DQUFlO0lBQ2Ysd0NBQW9CO0lBQ3BCLDhCQUFpQjtJQUNqQiwrQkFBa0I7SUFDbEIsK0JBQWtCO0lBQ2xCLDZCQUFnQjtJQUNoQixzQ0FBeUI7SUFDekIsMkJBQWM7Q0FDZixDQUFDO0FBRVcsUUFBQSwwQkFBMEIsR0FBZ0IsQ0FBQyxrQkFBTyxFQUFFLDZCQUFZLEVBQUUsZ0JBQU0sQ0FBQyxDQUFDO0FBRTFFLFFBQUEsMEJBQTBCLEdBQ25DLENBQUMsNkNBQW9CLEVBQUUseUNBQWtCLEVBQUUsbUNBQWUsRUFBRSwrQkFBYSxFQUFFLCtCQUFhLENBQUMsQ0FBQztBQUU5Rjs7R0FFRztBQUtILElBQWEseUJBQXlCO0lBQXRDO0lBQ0EsQ0FBQztJQUFELGdDQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSx5QkFBeUI7SUFKckMsZUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFLDhCQUFzQjtRQUNwQyxPQUFPLEVBQUUsOEJBQXNCO0tBQ2hDLENBQUM7R0FDVyx5QkFBeUIsQ0FDckM7QUFEWSw4REFBeUIifQ==