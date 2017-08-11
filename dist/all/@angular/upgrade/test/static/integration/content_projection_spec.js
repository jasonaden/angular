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
    describe('content projection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should instantiate ng2 in ng1 template and project content', testing_1.async(function () {
            // the ng2 component that will be used in ng1 (downgraded)
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.prop = 'NG2';
                    this.ngContent = 'ng2-content';
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: "{{ prop }}(<ng-content></ng-content>)" })
            ], Ng2Component);
            // our upgrade module to host the component to downgrade
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component]
                })
            ], Ng2Module);
            // the ng1 app module that will consume the downgraded component
            var ng1Module = angular
                .module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['prop'] = 'NG1';
                $rootScope['ngContent'] = 'ng1-content';
            });
            var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ ngContent }}~</ng2>{{ \']\' }}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('ng1[NG2(~ng1-content~)]');
            });
        }));
        it('should correctly project structural directives', testing_1.async(function () {
            var Ng2Component = (function () {
                function Ng2Component() {
                }
                return Ng2Component;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], Ng2Component.prototype, "itemId", void 0);
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: 'ng2-{{ itemId }}(<ng-content></ng-content>)' })
            ], Ng2Component);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['items'] = [
                    { id: 'a', subitems: [1, 2, 3] }, { id: 'b', subitems: [4, 5, 6] },
                    { id: 'c', subitems: [7, 8, 9] }
                ];
            });
            var element = test_helpers_1.html("\n           <ng2 ng-repeat=\"item in items\" [item-id]=\"item.id\">\n             <div ng-repeat=\"subitem in item.subitems\">{{ subitem }}</div>\n           </ng2>\n         ");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2-a( 123 )ng2-b( 456 )ng2-c( 789 )');
            });
        }));
        it('should instantiate ng1 in ng2 template and project content', testing_1.async(function () {
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.prop = 'ng2';
                    this.transclude = 'ng2-transclude';
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    template: "{{ 'ng2(' }}<ng1>{{ transclude }}</ng1>{{ ')' }}",
                })
            ], Ng2Component);
            var Ng1WrapperComponent = (function (_super) {
                __extends(Ng1WrapperComponent, _super);
                function Ng1WrapperComponent(elementRef, injector) {
                    return _super.call(this, 'ng1', elementRef, injector) || this;
                }
                return Ng1WrapperComponent;
            }(static_1.UpgradeComponent));
            Ng1WrapperComponent = __decorate([
                core_1.Directive({ selector: 'ng1' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1WrapperComponent);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1WrapperComponent, Ng2Component],
                    entryComponents: [Ng2Component],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', function () { return ({
                transclude: true,
                template: '{{ prop }}(<ng-transclude></ng-transclude>)'
            }); })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['prop'] = 'ng1';
                $rootScope['transclude'] = 'ng1-transclude';
            });
            var element = test_helpers_1.html('<div>{{ \'ng1(\' }}<ng2></ng2>{{ \')\' }}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('ng1(ng2(ng1(ng2-transclude)))');
            });
        }));
        it('should support multi-slot projection', testing_1.async(function () {
            var Ng2Component = (function () {
                function Ng2Component() {
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    template: '2a(<ng-content select=".ng1a"></ng-content>)' +
                        '2b(<ng-content select=".ng1b"></ng-content>)'
                }),
                __metadata("design:paramtypes", [])
            ], Ng2Component);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            // The ng-if on one of the projected children is here to make sure
            // the correct slot is targeted even with structural directives in play.
            var element = test_helpers_1.html('<ng2><div ng-if="true" class="ng1a">1a</div><div' +
                ' class="ng1b">1b</div></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('2a(1a)2b(1b)');
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9wcm9qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3Qvc3RhdGljL2ludGVncmF0aW9uL2NvbnRlbnRfcHJvamVjdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEyRztBQUMzRyxpREFBNEM7QUFDNUMsOERBQXdEO0FBQ3hELDhFQUF5RTtBQUN6RSw4REFBZ0U7QUFDaEUsa0RBQTRGO0FBRTVGLGdEQUEyRDtBQUUzRDtJQUNFLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUU3QixVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsRUFBRSxDQUFDLDREQUE0RCxFQUFFLGVBQUssQ0FBQztZQUVsRSwwREFBMEQ7WUFFMUQsSUFBTSxZQUFZO2dCQURsQjtvQkFFRSxTQUFJLEdBQUcsS0FBSyxDQUFDO29CQUNiLGNBQVMsR0FBRyxhQUFhLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUQsbUJBQUM7WUFBRCxDQUFDLEFBSEQsSUFHQztZQUhLLFlBQVk7Z0JBRGpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSx1Q0FBdUMsRUFBQyxDQUFDO2VBQzFFLFlBQVksQ0FHakI7WUFFRCx3REFBd0Q7WUFNeEQsSUFBTSxTQUFTO2dCQUFmO2dCQUVBLENBQUM7Z0JBREMsaUNBQWEsR0FBYixjQUFpQixDQUFDO2dCQUNwQixnQkFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRkssU0FBUztnQkFMZCxlQUFRLENBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsRUFBRSxz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