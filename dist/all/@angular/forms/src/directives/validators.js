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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validators_1 = require("../validators");
exports.REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return RequiredValidator; }),
    multi: true
};
exports.CHECKBOX_REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return CheckboxRequiredValidator; }),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @stable
 */
var RequiredValidator = (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) {
            this._required = value != null && value !== false && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RequiredValidator.prototype.validate = function (c) {
        return this.required ? validators_1.Validators.required(c) : null;
    };
    RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    return RequiredValidator;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RequiredValidator.prototype, "required", null);
RequiredValidator = __decorate([
    core_1.Directive({
        selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
        providers: [exports.REQUIRED_VALIDATOR],
        host: { '[attr.required]': 'required ? "" : null' }
    })
], RequiredValidator);
exports.RequiredValidator = RequiredValidator;
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @experimental
 */
var CheckboxRequiredValidator = (function (_super) {
    __extends(CheckboxRequiredValidator, _super);
    function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxRequiredValidator.prototype.validate = function (c) {
        return this.required ? validators_1.Validators.requiredTrue(c) : null;
    };
    return CheckboxRequiredValidator;
}(RequiredValidator));
CheckboxRequiredValidator = __decorate([
    core_1.Directive({
        selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
        providers: [exports.CHECKBOX_REQUIRED_VALIDATOR],
        host: { '[attr.required]': 'required ? "" : null' }
    })
], CheckboxRequiredValidator);
exports.CheckboxRequiredValidator = CheckboxRequiredValidator;
/**
 * Provider which adds {@link EmailValidator} to {@link NG_VALIDATORS}.
 */
exports.EMAIL_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return EmailValidator; }),
    multi: true
};
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @experimental
 */
var EmailValidator = (function () {
    function EmailValidator() {
    }
    Object.defineProperty(EmailValidator.prototype, "email", {
        set: function (value) {
            this._enabled = value === '' || value === true || value === 'true';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    EmailValidator.prototype.validate = function (c) {
        return this._enabled ? validators_1.Validators.email(c) : null;
    };
    EmailValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    return EmailValidator;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], EmailValidator.prototype, "email", null);
EmailValidator = __decorate([
    core_1.Directive({
        selector: '[email][formControlName],[email][formControl],[email][ngModel]',
        providers: [exports.EMAIL_VALIDATOR]
    })
], EmailValidator);
exports.EmailValidator = EmailValidator;
/**
 * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
exports.MIN_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the {@link MinLengthValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * @stable
 */
var MinLengthValidator = (function () {
    function MinLengthValidator() {
    }
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MinLengthValidator.prototype.validate = function (c) {
        return this.minlength == null ? null : this._validator(c);
    };
    MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.minLength(parseInt(this.minlength, 10));
    };
    return MinLengthValidator;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MinLengthValidator.prototype, "minlength", void 0);
MinLengthValidator = __decorate([
    core_1.Directive({
        selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
        providers: [exports.MIN_LENGTH_VALIDATOR],
        host: { '[attr.minlength]': 'minlength ? minlength : null' }
    })
], MinLengthValidator);
exports.MinLengthValidator = MinLengthValidator;
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
exports.MAX_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the {@link MaxLengthValidator} for any `formControlName,
 * `formControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 *
 * @stable
 */
var MaxLengthValidator = (function () {
    function MaxLengthValidator() {
    }
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MaxLengthValidator.prototype.validate = function (c) {
        return this.maxlength != null ? this._validator(c) : null;
    };
    MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.maxLength(parseInt(this.maxlength, 10));
    };
    return MaxLengthValidator;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MaxLengthValidator.prototype, "maxlength", void 0);
MaxLengthValidator = __decorate([
    core_1.Directive({
        selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
        providers: [exports.MAX_LENGTH_VALIDATOR],
        host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
    })
], MaxLengthValidator);
exports.MaxLengthValidator = MaxLengthValidator;
exports.PATTERN_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return PatternValidator; }),
    multi: true
};
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the {@link NG_VALIDATORS} binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 * @stable
 */
var PatternValidator = (function () {
    function PatternValidator() {
    }
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    PatternValidator.prototype.validate = function (c) { return this._validator(c); };
    PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    PatternValidator.prototype._createValidator = function () { this._validator = validators_1.Validators.pattern(this.pattern); };
    return PatternValidator;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PatternValidator.prototype, "pattern", void 0);
PatternValidator = __decorate([
    core_1.Directive({
        selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
        providers: [exports.PATTERN_VALIDATOR],
        host: { '[attr.pattern]': 'pattern ? pattern : null' }
    })
], PatternValidator);
exports.PatternValidator = PatternValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXFHO0FBSXJHLDRDQUF3RDtBQXFDM0MsUUFBQSxrQkFBa0IsR0FBbUI7SUFDaEQsT0FBTyxFQUFFLDBCQUFhO0lBQ3RCLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBaUIsRUFBakIsQ0FBaUIsQ0FBQztJQUNoRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFVyxRQUFBLDJCQUEyQixHQUFtQjtJQUN6RCxPQUFPLEVBQUUsMEJBQWE7SUFDdEIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF5QixFQUF6QixDQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGOzs7Ozs7Ozs7OztHQVdHO0FBT0gsSUFBYSxpQkFBaUI7SUFBOUI7SUFpQkEsQ0FBQztJQVpDLHNCQUFJLHVDQUFRO2FBQVosY0FBaUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBRXpELFVBQWEsS0FBcUI7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksS0FBRyxLQUFPLEtBQUssT0FBTyxDQUFDO1lBQzVFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7OztPQUx3RDtJQU96RCxvQ0FBUSxHQUFSLFVBQVMsQ0FBa0I7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxD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