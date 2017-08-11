"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("@angular/upgrade/src/common/angular1");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    describe('examples', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should have AngularJS loaded', function () { return expect(angular.version.major).toBe(1); });
        it('should verify UpgradeAdapter example', testing_1.async(function () {
            // This is wrapping (upgrading) an AngularJS component to be used in an Angular
            // component
            var Ng1Component = (function (_super) {
                __extends(Ng1Component, _super);
                function Ng1Component(elementRef, injector) {
                    return _super.call(this, 'ng1', elementRef, injector) || this;
                }
                return Ng1Component;
            }(static_1.UpgradeComponent));
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], Ng1Component.prototype, "title", void 0);
            Ng1Component = __decorate([
                core_1.Directive({ selector: 'ng1' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1Component);
            // This is an Angular component that will be downgraded
            var Ng2Component = (function () {
                function Ng2Component() {
                }
                return Ng2Component;
            }());
            __decorate([
                core_1.Input('name'),
                __metadata("design:type", String)
            ], Ng2Component.prototype, "nameProp", void 0);
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    template: 'ng2[<ng1 [title]="nameProp">transclude</ng1>](<ng-content></ng-content>)'
                })
            ], Ng2Component);
            // This module represents the Angular pieces of the application
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () {
                };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1Component, Ng2Component],
                    entryComponents: [Ng2Component],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            // This module represents the AngularJS pieces of the application
            var ng1Module = angular
                .module('myExample', [])
                .directive('ng1', function () {
                return {
                    scope: { title: '=' },
                    transclude: true,
                    template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
                };
            })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            // This is the (AngularJS) application bootstrap element
            // Notice that it is actually a downgraded Angular component
            var element = test_helpers_1.html('<ng2 name="World">project</ng2>');
            // Let's use a helper function to make this simpler
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(element.textContent))
                    .toBe('ng2[ng1[Hello World!](transclude)](project)');
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9zdGF0aWMvaW50ZWdyYXRpb24vZXhhbXBsZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkc7QUFDM0csaURBQTRDO0FBQzVDLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsOERBQWdFO0FBQ2hFLGtEQUE0RjtBQUU1RixnREFBMkQ7QUFFM0Q7SUFDRSxRQUFRLENBQUMsVUFBVSxFQUFFO1FBRW5CLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUVuQyxFQUFFLENBQUMsOEJBQThCLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1FBRWhGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxlQUFLLENBQUM7WUFFNUMsK0VBQStFO1lBQy9FLFlBQVk7WUFFWixJQUFNLFlBQVk7Z0JBQVMsZ0NBQWdCO2dCQUd6QyxzQkFBWSxVQUFzQixFQUFFLFFBQWtCOzJCQUNwRCxrQkFBTSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQztnQkFDcEMsQ0FBQztnQkFDSCxtQkFBQztZQUFELENBQUMsQUFORCxDQUEyQix5QkFBZ0IsR0FNMUM7WUFMVTtnQkFBUixZQUFLLEVBQUU7O3VEQUFlO1lBRG5CLFlBQVk7Z0JBRGpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7aURBSUgsaUJBQVUsRUFBWSxlQUFRO2VBSGxELFlBQVksQ0FNakI7WUFFRCx1REFBdUQ7WUFLdkQsSUFBTSxZQUFZO2dCQUFsQjtnQkFFQSxDQUFDO2dCQUFELG1CQUFDO1lBQUQsQ0FBQyxBQUZELElBRUM7WUFEZ0I7Z0JBQWQsWUFBSyxDQUFDLE1BQU0sQ0FBQzs7MERBQWtCO1lBRDVCLFlBQVk7Z0JBSmpCLGdCQUFTLENBQUM7b0JBQ1QsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsUUFBUSxFQUFFLDBFQUEwRTtpQkFDckYsQ0FBQztlQUNJLFlBQVksQ0FFakI7WUFFRCwrREFBK0Q7WUFNL0QsSUFBTSxTQUFTO2dCQUFmO2dCQUdBLENBQUM7Z0JBRkMsaUNBQWEsR0FBYjtnQkFDQSxDQUFDO2dCQUNILGdCQUFDO1lBQUQsQ0FBQyxBQUhELElBR0M7WUFISyxTQUFTO2dCQUxkLGVBQVEsQ0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUMxQyxlQUFlLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsc0JBQWEsQ0FBQztpQkFDeEMsQ0FBQztlQUNJLFNBQVMsQ0FHZDtZQUVELGlFQUFpRTtZQUNqRSxJQUFNLFNBQVMsR0FDWCxPQUFPO2lCQUNGLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUV2QixTQUFTLENBQ04sS0FBSyxFQUNMO2dCQUNFLE1BQU0sQ0FBQztvQkFDTCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO29CQUNuQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLG9EQUFvRDtpQkFDL0QsQ0FBQztZQUNKLENBQUMsQ0FBQztpQkFFTCxTQUFTLENBQUMsS0FBSyxFQUFFLDJCQUFrQixDQUFDLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQztZQUV6RSx3REFBd0Q7WUFDeEQsNERBQTREO1lBQzVELElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUV4RCxtREFBbUQ7WUFDbkQsd0JBQVMsQ0FBQyxpREFBc0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTztnQkFDN0UsTUFBTSxDQUFDLHdCQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3FCQUNqQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFyRUQsb0JBcUVDIn0=