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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var hash_location_component_1 = require("./hash_location_component");
var path_location_component_1 = require("./path_location_component");
var ExampleAppComponent = (function () {
    function ExampleAppComponent() {
    }
    return ExampleAppComponent;
}());
ExampleAppComponent = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "<hash-location></hash-location><path-location></path-location>"
    })
], ExampleAppComponent);
exports.ExampleAppComponent = ExampleAppComponent;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [ExampleAppComponent, path_location_component_1.PathLocationComponent, hash_location_component_1.HashLocationComponent],
        providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }],
        imports: [platform_browser_1.BrowserModule],
        bootstrap: [ExampleAppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL2xvY2F0aW9uL3RzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE4QztBQUM5QyxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBRXhELHFFQUFnRTtBQUNoRSxxRUFBZ0U7QUFNaEUsSUFBYSxtQkFBbUI7SUFBaEM7SUFDQSxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLG1CQUFtQjtJQUovQixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLGdFQUFnRTtLQUMzRSxDQUFDO0dBQ1csbUJBQW1CLENBQy9CO0FBRFksa0RBQW1CO0FBU2hDLElBQWEsU0FBUztJQUF0QjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksU0FBUztJQU5yQixlQUFRLENBQUM7UUFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSwrQ0FBcUIsRUFBRSwrQ0FBcUIsQ0FBQztRQUNqRixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUNwRCxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1FBQ3hCLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO0tBQ2pDLENBQUM7R0FDVyxTQUFTLENBQ3JCO0FBRFksOEJBQVMifQ==