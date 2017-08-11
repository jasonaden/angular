"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var core_1 = require("@angular/core");
var validators_1 = require("../../validators");
var abstract_form_group_directive_1 = require("../abstract_form_group_directive");
var control_container_1 = require("../control_container");
var control_value_accessor_1 = require("../control_value_accessor");
var ng_control_1 = require("../ng_control");
var reactive_errors_1 = require("../reactive_errors");
var shared_1 = require("../shared");
var form_group_directive_1 = require("./form_group_directive");
var form_group_name_1 = require("./form_group_name");
exports.controlNameBinding = {
    provide: ng_control_1.NgControl,
    useExisting: core_1.forwardRef(function () { return FormControlName; })
};
/**
 * @whatItDoes  Syncs a {@link FormControl} in an existing {@link FormGroup} to a form control
 * element by name.
 *
 * In other words, this directive ensures that any values written to the {@link FormControl}
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * {@link FormControl} instance (view -> model).
 *
 * @howToUse
 *
 * This directive is designed to be used with a parent {@link FormGroupDirective} (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the {@link FormControl} instance you want to
 * link, and will look for a {@link FormControl} registered with that name in the
 * closest {@link FormGroup} or {@link FormArray} above it.
 *
 * **Access the control**: You can access the {@link FormControl} associated with
 * this directive by using the {@link AbstractControl#get} method.
 * Ex: `this.form.get('first');`
 *
 * **Get value**: the `value` property is always synced and available on the {@link FormControl}.
 * See a full list of available properties in {@link AbstractControl}.
 *
 *  **Set value**: You can set an initial value for the control when instantiating the
 *  {@link FormControl}, or you can set it programmatically later using
 *  {@link AbstractControl#setValue} or {@link AbstractControl#patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl#valueChanges} event.  You can also listen to
 * {@link AbstractControl#statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: {@link RadioControlValueAccessor}
 * * Selects: {@link SelectControlValueAccessor}
 *
 * **npm package**: `@angular/forms`
 *
 * **NgModule**: {@link ReactiveFormsModule}
 *
 *  @stable
 */
var FormControlName = (function (_super) {
    __extends(FormControlName, _super);
    function FormControlName(parent, validators, asyncValidators, valueAccessors) {
        var _this = _super.call(this) || this;
        _this._added = false;
        _this.update = new core_1.EventEmitter();
        _this._parent = parent;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = shared_1.selectValueAccessor(_this, valueAccessors);
        return _this;
    }
    Object.defineProperty(FormControlName.prototype, "isDisabled", {
        set: function (isDisabled) { reactive_errors_1.ReactiveErrors.disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype.ngOnChanges = function (changes) {
        if (!this._added)
            this._setUpControl();
        if (shared_1.isPropertyUpdated(changes, this.viewModel)) {
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    };
    FormControlName.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    };
    FormControlName.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    Object.defineProperty(FormControlName.prototype, "path", {
        get: function () { return shared_1.controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "formDirective", {
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "asyncValidator", {
        get: function () {
            return shared_1.composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "control", {
        get: function () { return this._control; },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype._checkParentType = function () {
        if (!(this._parent instanceof form_group_name_1.FormGroupName) &&
            this._parent instanceof abstract_form_group_directive_1.AbstractFormGroupDirective) {
            reactive_errors_1.ReactiveErrors.ngModelGroupException();
        }
        else if (!(this._parent instanceof form_group_name_1.FormGroupName) && !(this._parent instanceof form_group_directive_1.FormGroupDirective) &&
            !(this._parent instanceof form_group_name_1.FormArrayName)) {
            reactive_errors_1.ReactiveErrors.controlParentException();
        }
    };
    FormControlName.prototype._setUpControl = function () {
        this._checkParentType();
        this._control = this.formDirective.addControl(this);
        if (this.control.disabled && this.valueAccessor.setDisabledState) {
            this.valueAccessor.setDisabledState(true);
        }
        this._added = true;
    };
    return FormControlName;
}(ng_control_1.NgControl));
__decorate([
    core_1.Input('formControlName'),
    __metadata("design:type", String)
], FormControlName.prototype, "name", void 0);
__decorate([
    core_1.Input('ngModel'),
    __metadata("design:type", Object)
], FormControlName.prototype, "model", void 0);
__decorate([
    core_1.Output('ngModelChange'),
    __metadata("design:type", Object)
], FormControlName.prototype, "update", void 0);
__decorate([
    core_1.Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], FormControlName.prototype, "isDisabled", null);
FormControlName = __decorate([
    core_1.Directive({ selector: '[formControlName]', providers: [exports.controlNameBinding] }),
    __param(0, core_1.Optional()), __param(0, core_1.Host()), __param(0, core_1.SkipSelf()),
    __param(1, core_1.Optional()), __param(1, core_1.Self()), __param(1, core_1.Inject(validators_1.NG_VALIDATORS)),
    __param(2, core_1.Optional()), __param(2, core_1.Self()), __param(2, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
    __param(3, core_1.Optional()), __param(3, core_1.Self()), __param(3, core_1.Inject(control_value_accessor_1.NG_VALUE_ACCESSOR)),
    __metadata("design:paramtypes", [control_container_1.ControlContainer,
        Array,
        Array, Array])
], FormControlName);
exports.FormControlName = FormControlName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUE4SjtBQUc5SiwrQ0FBb0U7QUFDcEUsa0ZBQTRFO0FBQzVFLDBEQUFzRDtBQUN0RCxvRUFBa0Y7QUFDbEYsNENBQXdDO0FBQ3hDLHNEQUFrRDtBQUNsRCxvQ0FBeUg7QUFHekgsK0RBQTBEO0FBQzFELHFEQUErRDtBQUVsRCxRQUFBLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxzQkFBUztJQUNsQixXQUFXLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsZUFBZSxFQUFmLENBQWUsQ0FBQztDQUMvQyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0RHO0FBRUgsSUFBYSxlQUFlO0lBQVMsbUNBQVM7SUFlNUMseUJBQ29DLE1BQXdCLEVBQ2IsVUFBd0MsRUFDbEMsZUFDUCxFQUNLLGNBQXNDO1FBTHpGLFlBTUUsaUJBQU8sU0FLUjtRQXpCTyxZQUFNLEdBQUcsS0FBSyxDQUFDO1FBVUUsWUFBTSxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBV25ELEtBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUN2QyxLQUFJLENBQUMsbUJBQW1CLEdBQUcsZUFBZSxJQUFJLEVBQUUsQ0FBQztRQUNqRCxLQUFJLENBQUMsYUFBYSxHQUFHLDRCQUFtQixDQUFDLEtBQUksRUFBRSxjQUFjLENBQUMsQ0FBQzs7SUFDakUsQ0FBQztJQWJE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