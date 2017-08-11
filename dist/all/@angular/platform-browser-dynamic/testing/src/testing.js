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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/compiler/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var testing_3 = require("@angular/platform-browser/testing");
var dom_test_component_renderer_1 = require("./dom_test_component_renderer");
__export(require("./private_export_testing"));
/**
 * @stable
 */
exports.platformBrowserDynamicTesting = core_1.createPlatformFactory(testing_1.platformCoreDynamicTesting, 'browserDynamicTesting', platform_browser_dynamic_1.ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * @stable
 */
var BrowserDynamicTestingModule = (function () {
    function BrowserDynamicTestingModule() {
    }
    return BrowserDynamicTestingModule;
}());
BrowserDynamicTestingModule = __decorate([
    core_1.NgModule({
        exports: [testing_3.BrowserTestingModule],
        providers: [
            { provide: testing_2.TestComponentRenderer, useClass: dom_test_component_renderer_1.DOMTestComponentRenderer },
        ]
    })
], BrowserDynamicTestingModule);
exports.BrowserDynamicTestingModule = BrowserDynamicTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy90ZXN0aW5nL3NyYy90ZXN0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgscURBQXFFO0FBQ3JFLHNDQUEyRjtBQUMzRixpREFBNEQ7QUFDNUQsOEVBQThJO0FBQzlJLDZEQUF1RTtBQUV2RSw2RUFBdUU7QUFFdkUsOENBQXdDO0FBRXhDOztHQUVHO0FBQ1UsUUFBQSw2QkFBNkIsR0FBRyw0QkFBcUIsQ0FDOUQsb0NBQTBCLEVBQUUsdUJBQXVCLEVBQ25ELHVFQUEyQyxDQUFDLENBQUM7QUFFakQ7Ozs7R0FJRztBQU9ILElBQWEsMkJBQTJCO0lBQXhDO0lBQ0EsQ0FBQztJQUFELGtDQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSwyQkFBMkI7SUFOdkMsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFLENBQUMsOEJBQW9CLENBQUM7UUFDL0IsU0FBUyxFQUFFO1lBQ1QsRUFBQyxPQUFPLEVBQUUsK0JBQXFCLEVBQUUsUUFBUSxFQUFFLHNEQUF3QixFQUFDO1NBQ3JFO0tBQ0YsQ0FBQztHQUNXLDJCQUEyQixDQUN2QztBQURZLGtFQUEyQiJ9