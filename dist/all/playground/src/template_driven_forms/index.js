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
/* tslint:disable:no-console  */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
/**
 * A domain model we are binding the form controls to.
 */
var CheckoutModel = (function () {
    function CheckoutModel() {
        this.country = 'Canada';
    }
    return CheckoutModel;
}());
/**
 * Custom validator.
 */
function creditCardValidator(c) {
    if (c.value && /^\d{16}$/.test(c.value)) {
        return null;
    }
    else {
        return { 'invalidCreditCard': true };
    }
}
var creditCardValidatorBinding = {
    provide: forms_1.NG_VALIDATORS,
    useValue: creditCardValidator,
    multi: true
};
var CreditCardValidator = (function () {
    function CreditCardValidator() {
    }
    return CreditCardValidator;
}());
CreditCardValidator = __decorate([
    core_1.Directive({ selector: '[credit-card]', providers: [creditCardValidatorBinding] })
], CreditCardValidator);
/**
 * This is a component that displays an error message.
 *
 * For instance,
 *
 * <show-error control="creditCard" [errors]="['required', 'invalidCreditCard']"></show-error>
 *
 * Will display the "is required" error if the control is empty, and "invalid credit card" if the
 * control is not empty
 * but not valid.
 *
 * In a real application, this component would receive a service that would map an error code to an
 * actual error message.
 * To make it simple, we are using a simple map here.
 */
var ShowError = (function () {
    function ShowError(formDir) {
        this.formDir = formDir;
    }
    Object.defineProperty(ShowError.prototype, "errorMessage", {
        get: function () {
            var form = this.formDir.form;
            var control = form.get(this.controlPath);
            if (control && control.touched) {
                for (var i = 0; i < this.errorTypes.length; ++i) {
                    if (control.hasError(this.errorTypes[i])) {
                        return this._errorMessage(this.errorTypes[i]);
                    }
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ShowError.prototype._errorMessage = function (code) {
        var config = {
            'required': 'is required',
            'invalidCreditCard': 'is invalid credit card number',
        };
        return config[code];
    };
    return ShowError;
}());
ShowError = __decorate([
    core_1.Component({
        selector: 'show-error',
        inputs: ['controlPath: control', 'errorTypes: errors'],
        template: "\n    <span *ngIf=\"errorMessage !== null\">{{errorMessage}}</span>\n  "
    }),
    __param(0, core_1.Host()),
    __metadata("design:paramtypes", [forms_1.NgForm])
], ShowError);
var TemplateDrivenForms = (function () {
    function TemplateDrivenForms() {
        this.model = new CheckoutModel();
        this.countries = ['US', 'Canada'];
    }
    TemplateDrivenForms.prototype.onSubmit = function () {
        console.log('Submitting:');
        console.log(this.model);
    };
    return TemplateDrivenForms;
}());
TemplateDrivenForms = __decorate([
    core_1.Component({
        selector: 'template-driven-forms',
        template: "\n    <h1>Checkout Form</h1>\n\n    <form (ngSubmit)=\"onSubmit()\" #f=\"ngForm\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" name=\"firstName\" [(ngModel)]=\"model.firstName\" required>\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" name=\"middleName\" [(ngModel)]=\"model.middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" name=\"lastName\" [(ngModel)]=\"model.lastName\" required>\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" name=\"country\" [(ngModel)]=\"model.country\">\n          <option *ngFor=\"let c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" name=\"creditCard\" [(ngModel)]=\"model.creditCard\" required credit-card>\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" name=\"amount\" [(ngModel)]=\"model.amount\" required>\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" name=\"email\" [(ngModel)]=\"model.email\" required>\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" name=\"comments\" [(ngModel)]=\"model.comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  "
    })
], TemplateDrivenForms);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({
        declarations: [TemplateDrivenForms, CreditCardValidator, ShowError],
        bootstrap: [TemplateDrivenForms],
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
    })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3RlbXBsYXRlX2RyaXZlbl9mb3Jtcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILGdDQUFnQztBQUVoQyxzQ0FBbUU7QUFDbkUsd0NBQTBGO0FBQzFGLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFJekU7O0dBRUc7QUFDSDtJQUFBO1FBSUUsWUFBTyxHQUFXLFFBQVEsQ0FBQztJQU03QixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQUVEOztHQUVHO0FBQ0gsNkJBQTZCLENBQWM7SUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxFQUFDLG1CQUFtQixFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3JDLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUscUJBQWE7SUFDdEIsUUFBUSxFQUFFLG1CQUFtQjtJQUM3QixLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFHRixJQUFNLG1CQUFtQjtJQUF6QjtJQUNBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssbUJBQW1CO0lBRHhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDLEVBQUMsQ0FBQztHQUMxRSxtQkFBbUIsQ0FDeEI7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQVFILElBQU0sU0FBUztJQUtiLG1C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