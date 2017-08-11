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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var testing_1 = require("../testing");
function main() {
    testing_internal_1.describe('MockNgModuleResolver', function () {
        var ngModuleResolver;
        testing_internal_1.beforeEach(testing_internal_1.inject([core_1.Injector], function (injector) {
            ngModuleResolver = new testing_1.MockNgModuleResolver(injector, new compiler_1.JitReflector());
        }));
        testing_internal_1.describe('NgModule overriding', function () {
            testing_internal_1.it('should fallback to the default NgModuleResolver when templates are not overridden', function () {
                var ngModule = ngModuleResolver.resolve(SomeNgModule);
                testing_internal_1.expect(ngModule.declarations).toEqual([SomeDirective]);
            });
            testing_internal_1.it('should allow overriding the @NgModule', function () {
                ngModuleResolver.setNgModule(SomeNgModule, new core_1.NgModule({ declarations: [SomeOtherDirective] }));
                var ngModule = ngModuleResolver.resolve(SomeNgModule);
                testing_internal_1.expect(ngModule.declarations).toEqual([SomeOtherDirective]);
            });
        });
    });
}
exports.main = main;
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
var SomeOtherDirective = (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
}());
var SomeNgModule = (function () {
    function SomeNgModule() {
    }
    return SomeNgModule;
}());
SomeNgModule = __decorate([
    core_1.NgModule({ declarations: [SomeDirective] })
], SomeNgModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbmdfbW9kdWxlX3Jlc29sdmVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDhDQUErQztBQUMvQyxzQ0FBaUQ7QUFDakQsK0VBQW9HO0FBRXBHLHNDQUFnRDtBQUVoRDtJQUNFLDJCQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxnQkFBc0MsQ0FBQztRQUUzQyw2QkFBVSxDQUFDLHlCQUFNLENBQUMsQ0FBQyxlQUFRLENBQUMsRUFBRSxVQUFDLFFBQWtCO1lBQy9DLGdCQUFnQixHQUFHLElBQUksOEJBQW9CLENBQUMsUUFBUSxFQUFFLElBQUksdUJBQVksRUFBRSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLDJCQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDOUIscUJBQUUsQ0FBQyxtRkFBbUYsRUFDbkY7Z0JBQ0UsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN4RCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1lBRU4scUJBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFDMUMsZ0JBQWdCLENBQUMsV0FBVyxDQUN4QixZQUFZLEVBQUUsSUFBSSxlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hELHlCQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBdkJELG9CQXVCQztBQUVEO0lBQUE7SUFBcUIsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUF0QixJQUFzQjtBQUV0QjtJQUFBO0lBQTBCLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFBM0IsSUFBMkI7QUFHM0IsSUFBTSxZQUFZO0lBQWxCO0lBQ0EsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxZQUFZO0lBRGpCLGVBQVEsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUM7R0FDcEMsWUFBWSxDQUNqQiJ9