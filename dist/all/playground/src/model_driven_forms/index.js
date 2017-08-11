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
    __metadata("design:paramtypes", [forms_1.FormGroupDirective])
], ShowError);
var ReactiveForms = (function () {
    function ReactiveForms(fb) {
        this.countries = ['US', 'Canada'];
        this.form = fb.group({
            'firstName': ['', forms_1.Validators.required],
            'middleName': [''],
            'lastName': ['', forms_1.Validators.required],
            'country': ['Canada', forms_1.Validators.required],
            'creditCard': ['', forms_1.Validators.compose([forms_1.Validators.required, creditCardValidator])],
            'amount': [0, forms_1.Validators.required],
            'email': ['', forms_1.Validators.required],
            'comments': ['']
        });
    }
    ReactiveForms.prototype.onSubmit = function () {
        console.log('Submitting:');
        console.log(this.form.value);
    };
    return ReactiveForms;
}());
ReactiveForms = __decorate([
    core_1.Component({
        selector: 'reactive-forms',
        viewProviders: [forms_1.FormBuilder],
        template: "\n    <h1>Checkout Form (Reactive)</h1>\n\n    <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"form\" #f=\"ngForm\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" formControlName=\"firstName\">\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" formControlName=\"middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" formControlName=\"lastName\">\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" formControlName=\"country\">\n          <option *ngFor=\"let c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" formControlName=\"creditCard\">\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" formControlName=\"amount\">\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" formControlName=\"email\">\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" formControlName=\"comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  "
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], ReactiveForms);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [ReactiveForms],
        declarations: [ShowError, ReactiveForms],
        imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule]
    })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL21vZGVsX2RyaXZlbl9mb3Jtcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILGdDQUFnQztBQUNoQyxzQ0FBd0Q7QUFDeEQsd0NBQTRIO0FBQzVILDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFJekU7O0dBRUc7QUFDSCw2QkFBNkIsQ0FBa0I7SUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxFQUFDLG1CQUFtQixFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3JDLENBQUM7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFRSCxJQUFNLFNBQVM7SUFLYixtQkFBb0IsT0FBMkI7UUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUFDLENBQUM7SUFFNUUsc0JBQUksbUNBQVk7YUFBaEI7WUFDRSxJQUFNLElBQUksR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUMxQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FB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