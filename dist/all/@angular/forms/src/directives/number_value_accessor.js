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
exports.NUMBER_VALUE_ACCESSOR = {
    provide: control_value_accessor_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return NumberValueAccessor; }),
    multi: true
};
/**
 * The accessor for writing a number value and listening to changes that is used by the
 * {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName} directives.
 *
 *  ### Example
 *  ```
 *  <input type="number" [(ngModel)]="age">
 *  ```
 */
var NumberValueAccessor = (function () {
    function NumberValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    NumberValueAccessor.prototype.writeValue = function (value) {
        // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
        var normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    };
    NumberValueAccessor.prototype.registerOnChange = function (fn) {
        this.onChange = function (value) { fn(value == '' ? null : parseFloat(value)); };
    };
    NumberValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    NumberValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    return NumberValueAccessor;
}());
NumberValueAccessor = __decorate([
    core_1.Directive({
        selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
        host: {
            '(change)': 'onChange($event.target.value)',
            '(input)': 'onChange($event.target.value)',
            '(blur)': 'onTouched()'
        },
        providers: [exports.NUMBER_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [core_1.Renderer2, core_1.ElementRef])
], NumberValueAccessor);
exports.NumberValueAccessor = NumberValueAccessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3ZhbHVlX2FjY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJFO0FBRTNFLG1FQUFpRjtBQUVwRSxRQUFBLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSwwQ0FBaUI7SUFDMUIsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLG1CQUFtQixFQUFuQixDQUFtQixDQUFDO0lBQ2xELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7OztHQVFHO0FBV0gsSUFBYSxtQkFBbUI7SUFJOUIsNkJBQW9CLFNBQW9CLEVBQVUsV0FBdUI7UUFBckQsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBSHpFLGFBQVEsR0FBRyxVQUFDLENBQU0sSUFBTSxDQUFDLENBQUM7UUFDMUIsY0FBUyxHQUFHLGNBQU8sQ0FBQyxDQUFDO0lBRXVELENBQUM7SUFFN0Usd0NBQVUsR0FBVixVQUFXLEtBQWE7UUFDdEIsb0ZBQW9GO1FBQ3BGLElBQU0sZUFBZSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELDhDQUFnQixHQUFoQixVQUFpQixFQUE0QjtRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQUMsS0FBSyxJQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQ0QsK0NBQWlCLEdBQWpCLFVBQWtCLEVBQWMsSUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFaEUsOENBQWdCLEdBQWhCLFVBQWlCLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDO0FBcEJZLG1CQUFtQjtJQVYvQixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUNKLGlHQUFpRztRQUNyRyxJQUFJLEVBQUU7WUFDSixVQUFVLEVBQUUsK0JBQStCO1lBQzNDLFNBQVMsRUFBRSwrQkFBK0I7WUFDMUMsUUFBUSxFQUFFLGFBQWE7U0FDeEI7UUFDRCxTQUFTLEVBQUUsQ0FBQyw2QkFBcUIsQ0FBQztLQUNuQyxDQUFDO3FDQUsrQixnQkFBUyxFQUF1QixpQkFBVTtHQUo5RCxtQkFBbUIsQ0FvQi9CO0FBcEJZLGtEQUFtQiJ9