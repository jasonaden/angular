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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var control_value_accessor_1 = require("./control_value_accessor");
var ng_control_1 = require("./ng_control");
exports.RADIO_VALUE_ACCESSOR = {
    provide: control_value_accessor_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return RadioControlValueAccessor; }),
    multi: true
};
/**
 * Internal class used by Angular to uncheck radio buttons with the matching name.
 */
var RadioControlRegistry = (function () {
    function RadioControlRegistry() {
        this._accessors = [];
    }
    RadioControlRegistry.prototype.add = function (control, accessor) {
        this._accessors.push([control, accessor]);
    };
    RadioControlRegistry.prototype.remove = function (accessor) {
        for (var i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    };
    RadioControlRegistry.prototype.select = function (accessor) {
        var _this = this;
        this._accessors.forEach(function (c) {
            if (_this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    };
    RadioControlRegistry.prototype._isSameGroup = function (controlPair, accessor) {
        if (!controlPair[0].control)
            return false;
        return controlPair[0]._parent === accessor._control._parent &&
            controlPair[1].name === accessor.name;
    };
    return RadioControlRegistry;
}());
RadioControlRegistry = __decorate([
    core_1.Injectable()
], RadioControlRegistry);
exports.RadioControlRegistry = RadioControlRegistry;
/**
 * @whatItDoes  Writes radio control values and listens to radio control changes.
 *
 * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
 * to keep the view synced with the {@link FormControl} model.
 *
 * @howToUse
 *
 * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
 * value accessor will be active on any radio control that has a form directive. You do
 * **not** need to add a special selector to activate it.
 *
 * ### How to use radio buttons with form directives
 *
 * To use radio buttons in a template-driven form, you'll want to ensure that radio buttons
 * in the same group have the same `name` attribute.  Radio buttons with different `name`
 * attributes do not affect each other.
 *
 * {@example forms/ts/radioButtons/radio_button_example.ts region='TemplateDriven'}
 *
 * When using radio buttons in a reactive form, radio buttons in the same group should have the
 * same `formControlName`. You can also add a `name` attribute, but it's optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 *  * **npm package**: `@angular/forms`
 *
 *  @stable
 */
var RadioControlValueAccessor = (function () {
    function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    RadioControlValueAccessor.prototype.ngOnInit = function () {
        this._control = this._injector.get(ng_control_1.NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    };
    RadioControlValueAccessor.prototype.ngOnDestroy = function () { this._registry.remove(this); };
    RadioControlValueAccessor.prototype.writeValue = function (value) {
        this._state = value === this.value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', this._state);
    };
    RadioControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function () {
            fn(_this.value);
            _this._registry.select(_this);
        };
    };
    RadioControlValueAccessor.prototype.fireUncheck = function (value) { this.writeValue(value); };
    RadioControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    RadioControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    RadioControlValueAccessor.prototype._checkName = function () {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
            this._throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    };
    RadioControlValueAccessor.prototype._throwNameError = function () {
        throw new Error("\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type=\"radio\" formControlName=\"food\" name=\"food\">\n    ");
    };
    return RadioControlValueAccessor;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RadioControlValueAccessor.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RadioControlValueAccessor.prototype, "formControlName", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RadioControlValueAccessor.prototype, "value", void 0);
RadioControlValueAccessor = __decorate([
    core_1.Directive({
        selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
        host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
        providers: [exports.RADIO_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [core_1.Renderer2, core_1.ElementRef,
        RadioControlRegistry, core_1.Injector])
], RadioControlValueAccessor);
exports.RadioControlValueAccessor = RadioControlValueAccessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkg7QUFFM0gsbUVBQWlGO0FBQ2pGLDJDQUF1QztBQUUxQixRQUFBLG9CQUFvQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSwwQ0FBaUI7SUFDMUIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF5QixFQUF6QixDQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOztHQUVHO0FBRUgsSUFBYSxvQkFBb0I7SUFEakM7UUFFVSxlQUFVLEdBQVUsRUFBRSxDQUFDO0lBOEJqQyxDQUFDO0lBNUJDLGtDQUFHLEdBQUgsVUFBSSxPQUFrQixFQUFFLFFBQW1DO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELHFDQUFNLEdBQU4sVUFBTyxRQUFtQztRQUN4QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUM7WUFDVCxD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