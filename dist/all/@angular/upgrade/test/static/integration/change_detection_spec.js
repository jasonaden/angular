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
    describe('scope/component change-detection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should interleave scope and component expressions', testing_1.async(function () {
            var log = [];
            var l = function (value) {
                log.push(value);
                return value + ';';
            };
            var Ng1aComponent = (function (_super) {
                __extends(Ng1aComponent, _super);
                function Ng1aComponent(elementRef, injector) {
                    return _super.call(this, 'ng1a', elementRef, injector) || this;
                }
                return Ng1aComponent;
            }(static_1.UpgradeComponent));
            Ng1aComponent = __decorate([
                core_1.Directive({ selector: 'ng1a' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1aComponent);
            var Ng1bComponent = (function (_super) {
                __extends(Ng1bComponent, _super);
                function Ng1bComponent(elementRef, injector) {
                    return _super.call(this, 'ng1b', elementRef, injector) || this;
                }
                return Ng1bComponent;
            }(static_1.UpgradeComponent));
            Ng1bComponent = __decorate([
                core_1.Directive({ selector: 'ng1b' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1bComponent);
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.l = l;
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    template: "{{l('2A')}}<ng1a></ng1a>{{l('2B')}}<ng1b></ng1b>{{l('2C')}}"
                })
            ], Ng2Component);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1aComponent, Ng1bComponent, Ng2Component],
                    entryComponents: [Ng2Component],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng1a', function () { return ({ template: '{{ l(\'ng1a\') }}' }); })
                .directive('ng1b', function () { return ({ template: '{{ l(\'ng1b\') }}' }); })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope.l = l;
                $rootScope.reset = function () { return log.length = 0; };
            });
            var element = test_helpers_1.html('<div>{{reset(); l(\'1A\');}}<ng2>{{l(\'1B\')}}</ng2>{{l(\'1C\')}}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('1A;2A;ng1a;2B;ng1b;2C;1C;');
                expect(log).toEqual(['1A', '1C', '2A', '2B', '2C', 'ng1a', 'ng1b']);
            });
        }));
        it('should propagate changes to a downgraded component inside the ngZone', testing_1.async(function () {
            var appComponent;
            var AppComponent = (function () {
                function AppComponent() {
                    appComponent = this;
                }
                return AppComponent;
            }());
            AppComponent = __decorate([
                core_1.Component({ selector: 'my-app', template: '<my-child [value]="value"></my-child>' }),
                __metadata("design:paramtypes", [])
            ], AppComponent);
            var ChildComponent = (function () {
                function ChildComponent(zone) {
                    this.zone = zone;
                }
                Object.defineProperty(ChildComponent.prototype, "value", {
                    set: function (v) { expect(core_1.NgZone.isInAngularZone()).toBe(true); },
                    enumerable: true,
                    configurable: true
                });
                ChildComponent.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['value'].isFirstChange())
                        return;
                    this.zone.onMicrotaskEmpty.subscribe(function () { expect(element.textContent).toEqual('5'); });
                    Promise.resolve().then(function () { return _this.valueFromPromise = changes['value'].currentValue; });
                };
                return ChildComponent;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Number),
                __metadata("design:paramtypes", [Number])
            ], ChildComponent.prototype, "value", null);
            ChildComponent = __decorate([
                core_1.Component({
                    selector: 'my-child',
                    template: '<div>{{ valueFromPromise }}</div>',
                }),
                __metadata("design:paramtypes", [core_1.NgZone])
            ], ChildComponent);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [AppComponent, ChildComponent],
                    entryComponents: [AppComponent],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', []).directive('myApp', static_1.downgradeComponent({ component: AppComponent }));
            var element = test_helpers_1.html('<my-app></my-app>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                appComponent.value = 5;
            });
        }));
        // This test demonstrates https://github.com/angular/angular/issues/6385
        // which was invalidly fixed by https://github.com/angular/angular/pull/6386
        // it('should not trigger $digest from an async operation in a watcher', async(() => {
        //      @Component({selector: 'my-app', template: ''})
        //      class AppComponent {
        //      }
        //      @NgModule({declarations: [AppComponent], imports: [BrowserModule]})
        //      class Ng2Module {
        //      }
        //      const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));
        //      const ng1Module = angular.module('ng1', []).directive(
        //          'myApp', adapter.downgradeNg2Component(AppComponent));
        //      const element = html('<my-app></my-app>');
        //      adapter.bootstrap(element, ['ng1']).ready((ref) => {
        //        let doTimeout = false;
        //        let timeoutId: number;
        //        ref.ng1RootScope.$watch(() => {
        //          if (doTimeout && !timeoutId) {
        //            timeoutId = window.setTimeout(function() {
        //              timeoutId = null;
        //            }, 10);
        //          }
        //        });
        //        doTimeout = true;
        //      });
        //    }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWdKO0FBQ2hKLGlEQUE0QztBQUM1Qyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLDhEQUFnRTtBQUNoRSxrREFBNEY7QUFFNUYsZ0RBQWdEO0FBRWhEO0lBQ0UsUUFBUSxDQUFDLGtDQUFrQyxFQUFFO1FBQzNDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUVuQyxFQUFFLENBQUMsbURBQW1ELEVBQUUsZUFBSyxDQUFDO1lBQ3pELElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUN6QixJQUFNLENBQUMsR0FBRyxVQUFDLEtBQWE7Z0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUdGLElBQU0sYUFBYTtnQkFBUyxpQ0FBZ0I7Z0JBQzFDLHVCQUFZLFVBQXNCLEVBQUUsUUFBa0I7MkJBQ3BELGtCQUFNLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO2dCQUNyQyxDQUFDO2dCQUNILG9CQUFDO1lBQUQsQ0FBQyxBQUpELENBQTRCLHlCQUFnQixHQUkzQztZQUpLLGFBQWE7Z0JBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7aURBRUosaUJBQVUsRUFBWSxlQUFRO2VBRGxELGFBQWEsQ0FJbEI7WUFHRCxJQUFNLGFBQWE7Z0JBQVMsaUNBQWdCO2dCQUMxQyx1QkFBWSxVQUFzQixFQUFFLFFBQWtCOzJCQUNwRCxrQkFBTSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQztnQkFDckMsQ0FBQztnQkFDSCxvQkFBQztZQUFELENBQUMsQUFKRCxDQUE0Qix5QkFBZ0IsR0FJM0M7WUFKSyxhQUFhO2dCQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO2lEQUVKLGlCQUFVLEVBQVksZUFBUTtlQURsRCxhQUFhLENBSWxCO1lBTUQsSUFBTSxZQUFZO2dCQUpsQjtvQkFLRSxNQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLENBQUM7Z0JBQUQsbUJBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUZLLFlBQVk7Z0JBSmpCLGdCQUFTLENBQUM7b0JBQ1QsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsUUFBUSxFQUFFLDZEQUE2RDtpQkFDeEUsQ0FBQztlQUNJLFlBQVksQ0FFakI7WUFPRCxJQUFNLFNBQVM7Z0JBQWY7Z0JBRUEsQ0FBQztnQkFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7Z0JBQ3BCLGdCQUFDO1lBQUQsQ0FBQyxBQUZELElBRUM7WUFGSyxTQUFTO2dCQUxkLGVBQVEsQ0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDMUQsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHNCQUFhLENBQUM7aUJBQ3hDLENBQUM7ZUFDSSxTQUFTLENBRWQ7WUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7aUJBQ3BCLFNBQVMsQ0FBQyxNQUFNLEVBQUUsY0FBTSxPQUFBLENBQUMsRUFBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxFQUFqQyxDQUFpQyxDQUFDO2lCQUMxRCxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztpQkFDMUQsU0FBUyxDQUFDLEtBQUssRUFBRSwyQkFBa0IsQ0FBQyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2lCQUMvRCxHQUFHLENBQUMsVUFBQyxVQUFxQztnQkFDekMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsY0FBTSxPQUFBLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFkLENBQWMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUV6QixJQUFNLE9BQU8sR0FDVCxtQkFBSSxDQUFDLHlFQUF5RSxDQUFDLENBQUM7WUFDcEYsd0JBQVMsQ0FBQyxpREFBc0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTztnQkFDOUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3ZFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxlQUFLLENBQUM7WUFDNUUsSUFBSSxZQUEwQixDQUFDO1lBRy9CLElBQU0sWUFBWTtnQkFFaEI7b0JBQWdCLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQUMsQ0FBQztnQkFDeEMsbUJBQUM7WUFBRCxDQUFDLEFBSEQsSUFHQztZQUhLLFlBQVk7Z0JBRGpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSx1Q0FBdUMsRUFBQyxDQUFDOztlQUM3RSxZQUFZLENBR2pCO1lBTUQsSUFBTSxjQUFjO2dCQUtsQix3QkFBb0IsSUFBWTtvQkFBWixTQUFJLEdBQUosSUFBSSxDQUFRO2dCQUFHLENBQUM7Z0JBRnBDLHNCQUFJLGlDQUFLO3lCQUFULFVBQVUsQ0FBUyxJQUFJLE1BQU0sQ0FBQyxhQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7bUJBQUE7Z0JBSXJFLG9DQUFXLEdBQVgsVUFBWSxPQUFzQjtvQkFBbEMsaUJBT0M7b0JBTkMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUFDLE1BQU0sQ0FBQztvQkFFN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQ2hDLGNBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFekQsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQXJELENBQXFELENBQUMsQ0FBQztnQkFDdEYsQ0FBQztnQkFDSCxxQkFBQztZQUFELENBQUMsQUFmRCxJQWVDO1lBWkM7Z0JBREMsWUFBSyxFQUFFOzs7dURBQzZEO1lBSGpFLGNBQWM7Z0JBSm5CLGdCQUFTLENBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSxtQ0FBbUM7aUJBQzlDLENBQUM7aURBTTBCLGFBQU07ZUFMNUIsY0FBYyxDQWVuQjtZQU9ELElBQU0sU0FBUztnQkFBZjtnQkFFQSxDQUFDO2dCQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztnQkFDcEIsZ0JBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUZLLFNBQVM7Z0JBTGQsZUFBUSxDQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUM7b0JBQzVDLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsRUFBRSxzQkFBYSxDQUFDO2lCQUN4QyxDQUFDO2VBQ0ksU0FBUyxDQUVkO1lBRUQsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUNqRCxPQUFPLEVBQUUsMkJBQWtCLENBQUMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBRzVELElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUUxQyx3QkFBUyxDQUFDLGlEQUFzQixFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO2dCQUM5RSxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCx3RUFBd0U7UUFDeEUsNEVBQTRFO1FBQzVFLHNGQUFzRjtRQUN0RixzREFBc0Q7UUFDdEQsNEJBQTRCO1FBQzVCLFNBQVM7UUFFVCwyRUFBMkU7UUFDM0UseUJBQXlCO1FBQ3pCLFNBQVM7UUFFVCx3RkFBd0Y7UUFDeEYsOERBQThEO1FBQzlELGtFQUFrRTtRQUVsRSxrREFBa0Q7UUFFbEQsNERBQTREO1FBQzVELGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMseUNBQXlDO1FBQ3pDLDBDQUEwQztRQUMxQyx3REFBd0Q7UUFDeEQsaUNBQWlDO1FBQ2pDLHFCQUFxQjtRQUNyQixhQUFhO1FBQ2IsYUFBYTtRQUNiLDJCQUEyQjtRQUMzQixXQUFXO1FBQ1gsVUFBVTtJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdJRCxvQkE2SUMifQ==