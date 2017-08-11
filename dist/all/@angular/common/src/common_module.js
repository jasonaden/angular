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
var index_1 = require("./directives/index");
var localization_1 = require("./localization");
var index_2 = require("./pipes/index");
// Note: This does not contain the location providers,
// as they need some platform specific implementations to work.
/**
 * The module that includes all the basic Angular directives like {@link NgIf}, {@link NgForOf}, ...
 *
 * @stable
 */
var CommonModule = (function () {
    function CommonModule() {
    }
    return CommonModule;
}());
CommonModule = __decorate([
    core_1.NgModule({
        declarations: [index_1.COMMON_DIRECTIVES, index_2.COMMON_PIPES],
        exports: [index_1.COMMON_DIRECTIVES, index_2.COMMON_PIPES],
        providers: [
            { provide: localization_1.NgLocalization, useClass: localization_1.NgLocaleLocalization },
        ],
    })
], CommonModule);
exports.CommonModule = CommonModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvY29tbW9uX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF1QztBQUV2Qyw0Q0FBbUY7QUFDbkYsK0NBQW9FO0FBQ3BFLHVDQUEyQztBQUczQyxzREFBc0Q7QUFDdEQsK0RBQStEO0FBQy9EOzs7O0dBSUc7QUFRSCxJQUFhLFlBQVk7SUFBekI7SUFDQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLFlBQVk7SUFQeEIsZUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFLENBQUMseUJBQWlCLEVBQUUsb0JBQVksQ0FBQztRQUMvQyxPQUFPLEVBQUUsQ0FBQyx5QkFBaUIsRUFBRSxvQkFBWSxDQUFDO1FBQzFDLFNBQVMsRUFBRTtZQUNULEVBQUMsT0FBTyxFQUFFLDZCQUFjLEVBQUUsUUFBUSxFQUFFLG1DQUFvQixFQUFDO1NBQzFEO0tBQ0YsQ0FBQztHQUNXLFlBQVksQ0FDeEI7QUFEWSxvQ0FBWSJ9