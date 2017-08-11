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
function main() {
    describe('lifecycle hooks examples', function () {
        it('should work with ngOnInit', function () {
            // #docregion OnInit
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnInit = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnInit', []]]);
        });
        it('should work with ngDoCheck', function () {
            // #docregion DoCheck
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngDoCheck = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngDoCheck', []]]);
        });
        it('should work with ngAfterContentChecked', function () {
            // #docregion AfterContentChecked
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterContentChecked = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentChecked', []]]);
        });
        it('should work with ngAfterContentInit', function () {
            // #docregion AfterContentInit
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterContentInit = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentInit', []]]);
        });
        it('should work with ngAfterViewChecked', function () {
            // #docregion AfterViewChecked
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterViewChecked = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewChecked', []]]);
        });
        it('should work with ngAfterViewInit', function () {
            // #docregion AfterViewInit
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterViewInit = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewInit', []]]);
        });
        it('should work with ngOnDestroy', function () {
            // #docregion OnDestroy
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnDestroy = function () {
                    // ...
                };
                return MyComponent;
            }());
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnDestroy', []]]);
        });
        it('should work with ngOnChanges', function () {
            // #docregion OnChanges
            var MyComponent = (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnChanges = function (changes) {
                    // changes.prop contains the old and the new value...
                };
                return MyComponent;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Number)
            ], MyComponent.prototype, "prop", void 0);
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: "..." })
            ], MyComponent);
            // #enddocregion
            var log = createAndLogComponent(MyComponent, ['prop']);
            expect(log.length).toBe(1);
            expect(log[0][0]).toBe('ngOnChanges');
            var changes = log[0][1][0];
            expect(changes['prop'].currentValue).toBe(true);
        });
    });
    function createAndLogComponent(clazz, inputs) {
        if (inputs === void 0) { inputs = []; }
        var log = [];
        createLoggingSpiesFromProto(clazz, log);
        var inputBindings = inputs.map(function (input) { return "[" + input + "] = true"; }).join(' ');
        var ParentComponent = (function () {
            function ParentComponent() {
            }
            return ParentComponent;
        }());
        ParentComponent = __decorate([
            core_1.Component({ template: "<my-cmp " + inputBindings + "></my-cmp>" })
        ], ParentComponent);
        var fixture = testing_1.TestBed.configureTestingModule({ declarations: [ParentComponent, clazz] })
            .createComponent(ParentComponent);
        fixture.detectChanges();
        fixture.destroy();
        return log;
    }
    function createLoggingSpiesFromProto(clazz, log) {
        var proto = clazz.prototype;
        Object.keys(proto).forEach(function (method) {
            proto[method] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                log.push([method, args]);
            };
        });
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX2hvb2tzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL3RzL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1MO0FBQ25MLGlEQUE4QztBQUU5QztJQUNFLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtRQUNuQyxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsb0JBQW9CO1lBRXBCLElBQU0sV0FBVztnQkFBakI7Z0JBSUEsQ0FBQztnQkFIQyw4QkFBUSxHQUFSO29CQUNFLE1BQU07Z0JBQ1IsQ0FBQztnQkFDSCxrQkFBQztZQUFELENBQUMsQUFKRCxJQUlDO1lBSkssV0FBVztnQkFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO2VBQzNDLFdBQVcsQ0FJaEI7WUFDRCxnQkFBZ0I7WUFFaEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLHFCQUFxQjtZQUVyQixJQUFNLFdBQVc7Z0JBQWpCO2dCQUlBLENBQUM7Z0JBSEMsK0JBQVMsR0FBVDtvQkFDRSxNQUFNO2dCQUNSLENBQUM7Z0JBQ0gsa0JBQUM7WUFBRCxDQUFDLEFBSkQsSUFJQztZQUpLLFdBQVc7Z0JBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztlQUMzQyxXQUFXLENBSWhCO1lBQ0QsZ0JBQWdCO1lBRWhCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxpQ0FBaUM7WUFFakMsSUFBTSxXQUFXO2dCQUFqQjtnQkFJQSxDQUFDO2dCQUhDLDJDQUFxQixHQUFyQjtvQkFDRSxNQUFNO2dCQUNSLENBQUM7Z0JBQ0gsa0JBQUM7WUFBRCxDQUFDLEFBSkQsSUFJQztZQUpLLFdBQVc7Z0JBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztlQUMzQyxXQUFXLENBSWhCO1lBQ0QsZ0JBQWdCO1lBRWhCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLDhCQUE4QjtZQUU5QixJQUFNLFdBQVc7Z0JBQWpCO2dCQUlBLENBQUM7Z0JBSEMsd0NBQWtCLEdBQWxCO29CQUNFLE1BQU07Z0JBQ1IsQ0FBQztnQkFDSCxrQkFBQztZQUFELENBQUMsQUFKRCxJQUlDO1lBSkssV0FBVztnQkFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO2VBQzNDLFdBQVcsQ0FJaEI7WUFDRCxnQkFBZ0I7WUFFaEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsOEJBQThCO1lBRTlCLElBQU0sV0FBVztnQkFBakI7Z0JBSUEsQ0FBQztnQkFIQyx3Q0FBa0IsR0FBbEI7b0JBQ0UsTUFBTTtnQkFDUixDQUFDO2dCQUNILGtCQUFDO1lBQUQsQ0FBQyxBQUpELElBSUM7WUFKSyxXQUFXO2dCQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7ZUFDM0MsV0FBVyxDQUloQjtZQUNELGdCQUFnQjtZQUVoQixNQUFNLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQywyQkFBMkI7WUFFM0IsSUFBTSxXQUFXO2dCQUFqQjtnQkFJQSxDQUFDO2dCQUhDLHFDQUFlLEdBQWY7b0JBQ0UsTUFBTTtnQkFDUixDQUFDO2dCQUNILGtCQUFDO1lBQUQsQ0FBQyxBQUpELElBSUM7WUFKSyxXQUFXO2dCQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7ZUFDM0MsV0FBVyxDQUloQjtZQUNELGdCQUFnQjtZQUVoQixNQUFNLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyx1QkFBdUI7WUFFdkIsSUFBTSxXQUFXO2dCQUFqQjtnQkFJQSxDQUFDO2dCQUhDLGlDQUFXLEdBQVg7b0JBQ0UsTUFBTTtnQkFDUixDQUFDO2dCQUNILGtCQUFDO1lBQUQsQ0FBQyxBQUpELElBSUM7WUFKSyxXQUFXO2dCQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7ZUFDM0MsV0FBVyxDQUloQjtZQUNELGdCQUFnQjtZQUVoQixNQUFNLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsdUJBQXVCO1lBRXZCLElBQU0sV0FBVztnQkFBakI7Z0JBT0EsQ0FBQztnQkFIQyxpQ0FBVyxHQUFYLFVBQVksT0FBc0I7b0JBQ2hDLHFEQUFxRDtnQkFDdkQsQ0FBQztnQkFDSCxrQkFBQztZQUFELENBQUMsQUFQRCxJQU9DO1lBTEM7Z0JBREMsWUFBSyxFQUFFOztxREFDSztZQUZULFdBQVc7Z0JBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztlQUMzQyxXQUFXLENBT2hCO1lBQ0QsZ0JBQWdCO1lBRWhCLElBQU0sR0FBRyxHQUFHLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxJQUFNLE9BQU8sR0FBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCwrQkFBK0IsS0FBZ0IsRUFBRSxNQUFxQjtRQUFyQix1QkFBQSxFQUFBLFdBQXFCO1FBQ3BFLElBQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztRQUN0QiwyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFeEMsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLE1BQUksS0FBSyxhQUFVLEVBQW5CLENBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHekUsSUFBTSxlQUFlO1lBQXJCO1lBQ0EsQ0FBQztZQUFELHNCQUFDO1FBQUQsQ0FBQyxBQURELElBQ0M7UUFESyxlQUFlO1lBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBVyxhQUFhLGVBQVksRUFBQyxDQUFDO1dBQ3RELGVBQWUsQ0FDcEI7UUFHRCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxFQUFDLENBQUM7YUFDbkUsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN4QixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxxQ0FBcUMsS0FBZ0IsRUFBRSxHQUFVO1FBQy9ELElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO1lBQ2hDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRztnQkFBQyxjQUFjO3FCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7b0JBQWQseUJBQWM7O2dCQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBMUlELG9CQTBJQyJ9