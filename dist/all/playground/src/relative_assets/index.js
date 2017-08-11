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
var my_cmp_1 = require("./app/my_cmp");
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
var RelativeApp = (function () {
    function RelativeApp() {
    }
    return RelativeApp;
}());
RelativeApp = __decorate([
    core_1.Component({
        selector: 'relative-app',
        template: "component = <my-cmp></my-cmp>",
    })
], RelativeApp);
exports.RelativeApp = RelativeApp;
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [RelativeApp, my_cmp_1.MyCmp], bootstrap: [RelativeApp], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3JlbGF0aXZlX2Fzc2V0cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBRXpFLHVDQUFtQztBQUVuQztJQUNFLGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCxvQkFFQztBQU1ELElBQWEsV0FBVztJQUF4QjtJQUNBLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksV0FBVztJQUp2QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLCtCQUErQjtLQUMxQyxDQUFDO0dBQ1csV0FBVyxDQUN2QjtBQURZLGtDQUFXO0FBSXhCLElBQU0sYUFBYTtJQUFuQjtJQUNBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssYUFBYTtJQURsQixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsY0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFDLENBQUM7R0FDN0YsYUFBYSxDQUNsQiJ9