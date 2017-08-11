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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('integration tests', function () {
        var fixture;
        describe('directives', function () {
            it('should support dotted selectors', testing_1.async(function () {
                var MyDir = (function () {
                    function MyDir() {
                    }
                    return MyDir;
                }());
                __decorate([
                    core_1.Input('dot.name'),
                    __metadata("design:type", String)
                ], MyDir.prototype, "value", void 0);
                MyDir = __decorate([
                    core_1.Directive({ selector: '[dot.name]' })
                ], MyDir);
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyDir,
                        TestComponent,
                    ],
                });
                var template = "<div [dot.name]=\"'foo'\"></div>";
                fixture = createTestComponent(template);
                fixture.detectChanges();
                var myDir = fixture.debugElement.query(by_1.By.directive(MyDir)).injector.get(MyDir);
                matchers_1.expect(myDir.value).toEqual('foo');
            }));
        });
        describe('ng-container', function () {
            if (browser_util_1.browserDetection.isChromeDesktop) {
                it('should work regardless the namespace', testing_1.async(function () {
                    var MyCmp = (function () {
                        function MyCmp() {
                        }
                        return MyCmp;
                    }());
                    MyCmp = __decorate([
                        core_1.Component({
                            selector: 'comp',
                            template: '<svg><ng-container *ngIf="1"><rect x="10" y="10" width="30" height="30"></rect></ng-container></svg>',
                        })
                    ], MyCmp);
                    var f = testing_1.TestBed.configureTestingModule({ declarations: [MyCmp] }).createComponent(MyCmp);
                    f.detectChanges();
                    matchers_1.expect(f.nativeElement.children[0].children[0].tagName).toEqual('rect');
                }));
            }
        });
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
    }
    return TestComponent;
}());
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', template: '' })
], TestComponent);
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUEwRDtBQUMxRCxpREFBdUU7QUFDdkUsaUVBQThEO0FBRTlELG1GQUFvRjtBQUNwRiwyRUFBc0U7QUFFdEU7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUF3QyxDQUFDO1FBRTdDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDckIsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLGVBQUssQ0FBQztnQkFFdkMsSUFBTSxLQUFLO29CQUFYO29CQUVBLENBQUM7b0JBQUQsWUFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFEb0I7b0JBQWxCLFlBQUssQ0FBQyxVQUFVLENBQUM7O29EQUFlO2dCQUQ3QixLQUFLO29CQURWLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLENBQUM7bUJBQzlCLEtBQUssQ0FFVjtnQkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO29CQUM3QixZQUFZLEVBQUU7d0JBQ1osS0FBSzt3QkFDTCxhQUFhO3FCQUNkO2lCQUNGLENBQUMsQ0FBQztnQkFFSCxJQUFNLFFBQVEsR0FBRyxrQ0FBZ0MsQ0FBQztnQkFDbEQsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsRixpQkFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixFQUFFLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxFQUFFLENBQUMsc0NBQXNDLEVBQUUsZUFBSyxDQUFDO29CQU01QyxJQUFNLEtBQUs7d0JBQVg7d0JBQ0EsQ0FBQzt3QkFBRCxZQUFDO29CQUFELENBQUMsQUFERCxJQUNDO29CQURLLEtBQUs7d0JBTFYsZ0JBQVMsQ0FBQzs0QkFDVCxRQUFRLEVBQUUsTUFBTTs0QkFDaEIsUUFBUSxFQUNKLHNHQUFzRzt5QkFDM0csQ0FBQzt1QkFDSSxLQUFLLENBQ1Y7b0JBRUQsSUFBTSxDQUFDLEdBQ0gsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25GLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFFbEIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBOUNELG9CQThDQztBQUdELElBQU0sYUFBYTtJQUFuQjtJQUNBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssYUFBYTtJQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7R0FDMUMsYUFBYSxDQUNsQjtBQUVELDZCQUE2QixRQUFnQjtJQUMzQyxNQUFNLENBQUMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQztTQUN2RSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsQ0FBQyJ9