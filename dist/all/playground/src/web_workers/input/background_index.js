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
var platform_webworker_1 = require("@angular/platform-webworker");
var platform_webworker_dynamic_1 = require("@angular/platform-webworker-dynamic");
var index_common_1 = require("./index_common");
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ imports: [platform_webworker_1.WorkerAppModule], bootstrap: [index_common_1.InputCmp], declarations: [index_common_1.InputCmp] })
], ExampleModule);
function main() {
    platform_webworker_dynamic_1.platformWorkerAppDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZF9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9zcmMvd2ViX3dvcmtlcnMvaW5wdXQvYmFja2dyb3VuZF9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF1QztBQUN2QyxrRUFBNEQ7QUFDNUQsa0ZBQTZFO0FBRTdFLCtDQUF3QztBQUd4QyxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsb0NBQWUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLHVCQUFRLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyx1QkFBUSxDQUFDLEVBQUMsQ0FBQztHQUNsRixhQUFhLENBQ2xCO0FBRUQ7SUFDRSxxREFBd0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRkQsb0JBRUMifQ==