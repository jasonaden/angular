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
var model_1 = require("../../model");
var validators_1 = require("../../validators");
var control_value_accessor_1 = require("../control_value_accessor");
var ng_control_1 = require("../ng_control");
var reactive_errors_1 = require("../reactive_errors");
var shared_1 = require("../shared");
exports.formControlBinding = {
    provide: ng_control_1.NgControl,
    useExisting: core_1.forwardRef(function () { return FormControlDirective; })
};
/**
 * @whatItDoes Syncs a standalone {@link FormControl} instance to a form control element.
 *
 * In other words, this directive ensures that any values written to the {@link FormControl}
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * {@link FormControl} instance (view -> model).
 *
 * @howToUse
 *
 * Use this directive if you'd like to create and manage a {@link FormControl} instance directly.
 * Simply create a {@link FormControl}, save it to your component class, and pass it into the
 * {@link FormControlDirective}.
 *
 * This directive is designed to be used as a standalone control.  Unlike {@link FormControlName},
 * it does not require that your {@link FormControl} instance be part of any parent
 * {@link FormGroup}, and it won't be registered to any {@link FormGroupDirective} that
 * exists above it.
 *
 * **Get the value**: the `value` property is always synced and available on the
 * {@link FormControl} instance. See a full list of available properties in
 * {@link AbstractControl}.
 *
 * **Set the value**: You can pass in an initial value when instantiating the {@link FormControl},
 * or you can set it programmatically later using {@link AbstractControl#setValue} or
 * {@link AbstractControl#patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl#valueChanges} event.  You can also listen to
 * {@link AbstractControl#statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `ReactiveFormsModule`
 *
 *  @stable
 */
var FormControlDirective = (function (_super) {
    __extends(FormControlDirective, _super);
    function FormControlDirective(validators, asyncValidators, valueAccessors) {
        var _this = _super.call(this) || this;
        _this.update = new core_1.EventEmitter();
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = shared_1.selectValueAccessor(_this, valueAccessors);
        return _this;
    }
    Object.defineProperty(FormControlDirective.prototype, "isDisabled", {
        set: function (isDisabled) { reactive_errors_1.ReactiveErrors.disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.ngOnChanges = function (changes) {
        if (this._isControlChanged(changes)) {
            shared_1.setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (shared_1.isPropertyUpdated(changes, this.viewModel)) {
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    };
    Object.defineProperty(FormControlDirective.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "asyncValidator", {
        get: function () {
            return shared_1.composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    FormControlDirective.prototype._isControlChanged = function (changes) {
        return changes.hasOwnProperty('form');
    };
    return FormControlDirective;
}(ng_control_1.NgControl));
__decorate([
    core_1.Input('formControl'),
    __metadata("design:type", model_1.FormControl)
], FormControlDirective.prototype, "form", void 0);
__decorate([
    core_1.Input('ngModel'),
    __metadata("design:type", Object)
], FormControlDirective.prototype, "model", void 0);
__decorate([
    core_1.Output('ngModelChange'),
    __metadata("design:type", Object)
], FormControlDirective.prototype, "update", void 0);
__decorate([
    core_1.Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], FormControlDirective.prototype, "isDisabled", null);
FormControlDirective = __decorate([
    core_1.Directive({ selector: '[formControl]', providers: [exports.formControlBinding], exportAs: 'ngForm' }),
    __param(0, core_1.Optional()), __param(0, core_1.Self()), __param(0, core_1.Inject(validators_1.NG_VALIDATORS)),
    __param(1, core_1.Optional()), __param(1, core_1.Self()), __param(1, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
    __param(2, core_1.Optional()), __param(2, core_1.Self()), __param(2, core_1.Inject(control_value_accessor_1.NG_VALUE_ACCESSOR)),
    __metadata("design:paramtypes", [Array,
        Array, Array])
], FormControlDirective);
exports.FormControlDirective = FormControlDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBbUk7QUFFbkkscUNBQXdDO0FBQ3hDLCtDQUFvRTtBQUNwRSxvRUFBa0Y7QUFDbEYsNENBQXdDO0FBQ3hDLHNEQUFrRDtBQUNsRCxvQ0FBMEg7QUFHN0csUUFBQSxrQkFBa0IsR0FBUTtJQUNyQyxPQUFPLEVBQUUsc0JBQVM7SUFDbEIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLG9CQUFvQixFQUFwQixDQUFvQixDQUFDO0NBQ3BELENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Q0c7QUFHSCxJQUFhLG9CQUFvQjtJQUFTLHdDQUFTO0lBVWpELDhCQUF1RCxVQUF3QyxFQUNsQyxlQUF1RCxFQUV4RyxjQUFzQztRQUhsRCxZQUljLGlCQUFPLFNBSVI7UUFiWSxZQUFNLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFVdkMsS0FBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLElBQUksRUFBRSxDQUFDO1FBQ2pELEtBQUksQ0FBQyxhQUFhLEdBQUcsNEJBQW1CLENBQUMsS0FBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDOztJQUNqRSxDQUFDO0lBVmIsc0JBQUksNENBQVU7YUFBZCxVQUFlLFVBQW1CLElBQUksZ0NBQWMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFZakUsMENBQVcsR0FBWCxVQUFZLE9B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