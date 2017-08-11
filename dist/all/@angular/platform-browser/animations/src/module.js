"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var providers_1 = require("./providers");
/**
 * @experimental Animation support is experimental.
 */
var BrowserAnimationsModule = (function () {
    function BrowserAnimationsModule() {
    }
    return BrowserAnimationsModule;
}());
BrowserAnimationsModule = __decorate([
    core_1.NgModule({
        exports: [platform_browser_1.BrowserModule],
        providers: providers_1.BROWSER_ANIMATIONS_PROVIDERS,
    })
], BrowserAnimationsModule);
exports.BrowserAnimationsModule = BrowserAnimationsModule;
/**
 * @experimental Animation support is experimental.
 */
var NoopAnimationsModule = (function () {
    function NoopAnimationsModule() {
    }
    return NoopAnimationsModule;
}());
NoopAnimationsModule = __decorate([
    core_1.NgModule({
        exports: [platform_browser_1.BrowserModule],
        providers: providers_1.BROWSER_NOOP_ANIMATIONS_PROVIDERS,
    })
], NoopAnimationsModule);
exports.NoopAnimationsModule = NoopAnimationsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3NyYy9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxzQ0FBdUM7QUFDdkMsOERBQXdEO0FBRXhELHlDQUE0RjtBQUU1Rjs7R0FFRztBQUtILElBQWEsdUJBQXVCO0lBQXBDO0lBQ0EsQ0FBQztJQUFELDhCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSx1QkFBdUI7SUFKbkMsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQztRQUN4QixTQUFTLEVBQUUsd0NBQTRCO0tBQ3hDLENBQUM7R0FDVyx1QkFBdUIsQ0FDbkM7QUFEWSwwREFBdUI7QUFHcEM7O0dBRUc7QUFLSCxJQUFhLG9CQUFvQjtJQUFqQztJQUNBLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksb0JBQW9CO0lBSmhDLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7UUFDeEIsU0FBUyxFQUFFLDZDQUFpQztLQUM3QyxDQUFDO0dBQ1csb0JBQW9CLENBQ2hDO0FBRFksb0RBQW9CIn0=