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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var ErrorComponent = (function () {
    function ErrorComponent() {
    }
    ErrorComponent.prototype.createError = function () { throw new Error('Sourcemap test'); };
    return ErrorComponent;
}());
ErrorComponent = __decorate([
    core_1.Component({
        selector: 'error-app',
        template: "\n           <button class=\"errorButton\" (click)=\"createError()\">create error</button>"
    })
], ErrorComponent);
exports.ErrorComponent = ErrorComponent;
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [ErrorComponent], bootstrap: [ErrorComponent], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3NvdXJjZW1hcC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBT3pFLElBQWEsY0FBYztJQUEzQjtJQUVBLENBQUM7SUFEQyxvQ0FBVyxHQUFYLGNBQXNCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQscUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLGNBQWM7SUFMMUIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFFBQVEsRUFBRSw0RkFDeUU7S0FDcEYsQ0FBQztHQUNXLGNBQWMsQ0FFMUI7QUFGWSx3Q0FBYztBQUszQixJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZUFBUSxDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFDLENBQUM7R0FDNUYsYUFBYSxDQUNsQjtBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=