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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
function main() {
    describe('di metadata examples', function () {
        describe('Inject', function () {
            it('works', function () {
                // #docregion Inject
                var Engine = (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = (function () {
                    function Car(engine) {
                        this.engine = engine;
                    }
                    return Car;
                }());
                Car = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject('MyEngine')),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                var injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: 'MyEngine', useClass: Engine }, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
            it('works without decorator', function () {
                // #docregion InjectWithoutDecorator
                var Engine = (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = (function () {
                    function Car(engine) {
                        this.engine = engine;
                    } // same as constructor(@Inject(Engine) engine:Engine)
                    return Car;
                }());
                Car = __decorate([
                    core_1.Injectable(),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                var injector = core_1.ReflectiveInjector.resolveAndCreate([Engine, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
        });
        describe('Optional', function () {
            it('works', function () {
                // #docregion Optional
                var Engine = (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = (function () {
                    function Car(engine) {
                        this.engine = engine;
                    }
                    return Car;
                }());
                Car = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Optional()),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                var injector = core_1.ReflectiveInjector.resolveAndCreate([Car]);
                expect(injector.get(Car).engine).toBeNull();
                // #enddocregion
            });
        });
        describe('Injectable', function () {
            it('works', function () {
                // #docregion Injectable
                var UsefulService = (function () {
                    function UsefulService() {
                    }
                    return UsefulService;
                }());
                UsefulService = __decorate([
                    core_1.Injectable()
                ], UsefulService);
                var NeedsService = (function () {
                    function NeedsService(service) {
                        this.service = service;
                    }
                    return NeedsService;
                }());
                NeedsService = __decorate([
                    core_1.Injectable(),
                    __metadata("design:paramtypes", [UsefulService])
                ], NeedsService);
                var injector = core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]);
                expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
                // #enddocregion
            });
            it('throws without Injectable', function () {
                // #docregion InjectableThrows
                var UsefulService = (function () {
                    function UsefulService() {
                    }
                    return UsefulService;
                }());
                var NeedsService = (function () {
                    function NeedsService(service) {
                        this.service = service;
                    }
                    return NeedsService;
                }());
                expect(function () { return core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]); }).toThrow();
                // #enddocregion
            });
        });
        describe('Self', function () {
            it('works', function () {
                // #docregion Self
                var Dependency = (function () {
                    function Dependency() {
                    }
                    return Dependency;
                }());
                var NeedsDependency = (function () {
                    function NeedsDependency(dependency) {
                        this.dependency = dependency;
                    }
                    return NeedsDependency;
                }());
                NeedsDependency = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Self()),
                    __metadata("design:paramtypes", [Dependency])
                ], NeedsDependency);
                var inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                var nd = inj.get(NeedsDependency);
                expect(nd.dependency instanceof Dependency).toBe(true);
                inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                var child = inj.resolveAndCreateChild([NeedsDependency]);
                expect(function () { return child.get(NeedsDependency); }).toThrowError();
                // #enddocregion
            });
        });
        describe('SkipSelf', function () {
            it('works', function () {
                // #docregion SkipSelf
                var Dependency = (function () {
                    function Dependency() {
                    }
                    return Dependency;
                }());
                var NeedsDependency = (function () {
                    function NeedsDependency(dependency) {
                        this.dependency = dependency;
                        this.dependency = dependency;
                    }
                    return NeedsDependency;
                }());
                NeedsDependency = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.SkipSelf()),
                    __metadata("design:paramtypes", [Dependency])
                ], NeedsDependency);
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                var child = parent.resolveAndCreateChild([NeedsDependency]);
                expect(child.get(NeedsDependency).dependency instanceof Dependency).toBe(true);
                var inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                expect(function () { return inj.get(NeedsDependency); }).toThrowError();
                // #enddocregion
            });
        });
        describe('Host', function () {
            it('works', function () {
                // #docregion Host
                var OtherService = (function () {
                    function OtherService() {
                    }
                    return OtherService;
                }());
                var HostService = (function () {
                    function HostService() {
                    }
                    return HostService;
                }());
                var ChildDirective = (function () {
                    function ChildDirective(os, hs) {
                        this.logs = [];
                        // os is null: true
                        this.logs.push("os is null: " + (os === null));
                        // hs is an instance of HostService: true
                        this.logs.push("hs is an instance of HostService: " + (hs instanceof HostService));
                    }
                    return ChildDirective;
                }());
                ChildDirective = __decorate([
                    core_1.Directive({ selector: 'child-directive' }),
                    __param(0, core_1.Optional()), __param(0, core_1.Host()), __param(1, core_1.Optional()), __param(1, core_1.Host()),
                    __metadata("design:paramtypes", [OtherService, HostService])
                ], ChildDirective);
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        viewProviders: [HostService],
                        template: '<child-directive></child-directive>',
                    })
                ], ParentCmp);
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                App = __decorate([
                    core_1.Component({
                        selector: 'app',
                        viewProviders: [OtherService],
                        template: '<parent-cmp></parent-cmp>',
                    })
                ], App);
                // #enddocregion
                testing_1.TestBed.configureTestingModule({
                    declarations: [App, ParentCmp, ChildDirective],
                });
                var cmp = undefined;
                expect(function () { return cmp = testing_1.TestBed.createComponent(App); }).not.toThrow();
                expect(cmp.debugElement.children[0].children[0].injector.get(ChildDirective).logs).toEqual([
                    'os is null: true',
                    'hs is an instance of HostService: true',
                ]);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvbWV0YWRhdGFfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEySDtBQUMzSCxpREFBZ0U7QUFFaEU7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNqQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLG9CQUFvQjtnQkFDcEI7b0JBQUE7b0JBQWMsQ0FBQztvQkFBRCxhQUFDO2dCQUFELENBQUMsQUFBZixJQUFlO2dCQUdmLElBQU0sR0FBRztvQkFDUCxhQUF1QyxNQUFjO3dCQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBQUcsQ0FBQztvQkFDM0QsVUFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxHQUFHO29CQURSLGlCQUFVLEVBQUU7b0JBRUUsV0FBQSxhQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7cURBQWdCLE1BQU07bUJBRGpELEdBQUcsQ0FFUjtnQkFFRCxJQUFNLFFBQVEsR0FDVix5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFeEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUQsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO2dCQUM1QixvQ0FBb0M7Z0JBQ3BDO29CQUFBO29CQUFjLENBQUM7b0JBQUQsYUFBQztnQkFBRCxDQUFDLEFBQWYsSUFBZTtnQkFHZixJQUFNLEdBQUc7b0JBQ1AsYUFBbUIsTUFBYzt3QkFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO29CQUNqQyxDQUFDLENBQUUscURBQXFEO29CQUMxRCxVQUFDO2dCQUFELENBQUMsQUFIRCxJQUdDO2dCQUhLLEdBQUc7b0JBRFIsaUJBQVUsRUFBRTtxREFFZ0IsTUFBTTttQkFEN0IsR0FBRyxDQUdSO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlELGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNuQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLHNCQUFzQjtnQkFDdEI7b0JBQUE7b0JBQWMsQ0FBQztvQkFBRCxhQUFDO2dCQUFELENBQUMsQUFBZixJQUFlO2dCQUdmLElBQU0sR0FBRztvQkFDUCxhQUErQixNQUFjO3dCQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBQUcsQ0FBQztvQkFDbkQsVUFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxHQUFHO29CQURSLGlCQUFVLEVBQUU7b0JBRUUsV0FBQSxlQUFRLEVBQUUsQ0FBQTtxREFBZ0IsTUFBTTttQkFEekMsR0FBRyxDQUVSO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVDLGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLHdCQUF3QjtnQkFFeEIsSUFBTSxhQUFhO29CQUFuQjtvQkFDQSxDQUFDO29CQUFELG9CQUFDO2dCQUFELENBQUMsQUFERCxJQUNDO2dCQURLLGFBQWE7b0JBRGxCLGlCQUFVLEVBQUU7bUJBQ1AsYUFBYSxDQUNsQjtnQkFHRCxJQUFNLFlBQVk7b0JBQ2hCLHNCQUFtQixPQUFzQjt3QkFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtvQkFBRyxDQUFDO29CQUMvQyxtQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxZQUFZO29CQURqQixpQkFBVSxFQUFFO3FEQUVpQixhQUFhO21CQURyQyxZQUFZLENBRWpCO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BGLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sWUFBWSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9FLGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtnQkFDOUIsOEJBQThCO2dCQUM5QjtvQkFBQTtvQkFBcUIsQ0FBQztvQkFBRCxvQkFBQztnQkFBRCxDQUFDLEFBQXRCLElBQXNCO2dCQUV0QjtvQkFDRSxzQkFBbUIsT0FBc0I7d0JBQXRCLFlBQU8sR0FBUCxPQUFPLENBQWU7b0JBQUcsQ0FBQztvQkFDL0MsbUJBQUM7Z0JBQUQsQ0FBQyxBQUZELElBRUM7Z0JBRUQsTUFBTSxDQUFDLGNBQU0sT0FBQSx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQyxFQUFsRSxDQUFrRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzNGLGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNmLEVBQUUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ1Ysa0JBQWtCO2dCQUNsQjtvQkFBQTtvQkFBa0IsQ0FBQztvQkFBRCxpQkFBQztnQkFBRCxDQUFDLEFBQW5CLElBQW1CO2dCQUduQixJQUFNLGVBQWU7b0JBQ25CLHlCQUEyQixVQUFzQjt3QkFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtvQkFBRyxDQUFDO29CQUN2RCxzQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxlQUFlO29CQURwQixpQkFBVSxFQUFFO29CQUVFLFdBQUEsV0FBSSxFQUFFLENBQUE7cURBQW9CLFVBQVU7bUJBRDdDLGVBQWUsQ0FFcEI7Z0JBRUQsSUFBSSxHQUFHLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDN0UsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFcEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLFlBQVksVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2RCxHQUFHLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsY0FBTSxPQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEQsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ1Ysc0JBQXNCO2dCQUN0QjtvQkFBQTtvQkFBa0IsQ0FBQztvQkFBRCxpQkFBQztnQkFBRCxDQUFDLEFBQW5CLElBQW1CO2dCQUduQixJQUFNLGVBQWU7b0JBQ25CLHlCQUErQixVQUFzQjt3QkFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTt3QkFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztvQkFBQyxDQUFDO29CQUMxRixzQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxlQUFlO29CQURwQixpQkFBVSxFQUFFO29CQUVFLFdBQUEsZUFBUSxFQUFFLENBQUE7cURBQW9CLFVBQVU7bUJBRGpELGVBQWUsQ0FFcEI7Z0JBRUQsSUFBTSxNQUFNLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLFlBQVksVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUvRSxJQUFNLEdBQUcsR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxNQUFNLENBQUMsY0FBTSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEQsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ2YsRUFBRSxDQUFDLE9BQU8sRUFBRTtnQkFDVixrQkFBa0I7Z0JBQ2xCO29CQUFBO29CQUFvQixDQUFDO29CQUFELG1CQUFDO2dCQUFELENBQUMsQUFBckIsSUFBcUI7Z0JBQ3JCO29CQUFBO29CQUFtQixDQUFDO29CQUFELGtCQUFDO2dCQUFELENBQUMsQUFBcEIsSUFBb0I7Z0JBR3BCLElBQU0sY0FBYztvQkFHbEIsd0JBQWdDLEVBQWdCLEVBQXNCLEVBQWU7d0JBRnJGLFNBQUksR0FBYSxFQUFFLENBQUM7d0JBR2xCLG1CQUFtQjt3QkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWUsRUFBRSxLQUFLLElBQUksQ0FBRSxDQUFDLENBQUM7d0JBQzdDLHlDQUF5Qzt3QkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0NBQXFDLEVBQUUsWUFBWSxXQUFXLENBQUUsQ0FBQyxDQUFDO29CQUNuRixDQUFDO29CQUNILHFCQUFDO2dCQUFELENBQUMsQUFURCxJQVNDO2dCQVRLLGNBQWM7b0JBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztvQkFJMUIsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsV0FBSSxFQUFFLENBQUEsRUFBb0IsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsV0FBSSxFQUFFLENBQUE7cURBQWpDLFlBQVksRUFBMEIsV0FBVzttQkFIakYsY0FBYyxDQVNuQjtnQkFPRCxJQUFNLFNBQVM7b0JBQWY7b0JBQ0EsQ0FBQztvQkFBRCxnQkFBQztnQkFBRCxDQUFDLEFBREQsSUFDQztnQkFESyxTQUFTO29CQUxkLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFlBQVk7d0JBQ3RCLGFBQWEsRUFBRSxDQUFDLFdBQVcsQ0FBQzt3QkFDNUIsUUFBUSxFQUFFLHFDQUFxQztxQkFDaEQsQ0FBQzttQkFDSSxTQUFTLENBQ2Q7Z0JBT0QsSUFBTSxHQUFHO29CQUFUO29CQUNBLENBQUM7b0JBQUQsVUFBQztnQkFBRCxDQUFDLEFBREQsSUFDQztnQkFESyxHQUFHO29CQUxSLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsYUFBYSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUM3QixRQUFRLEVBQUUsMkJBQTJCO3FCQUN0QyxDQUFDO21CQUNJLEdBQUcsQ0FDUjtnQkFDRCxnQkFBZ0I7Z0JBRWhCLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7b0JBQzdCLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDO2lCQUMvQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxHQUFHLEdBQTBCLFNBQVcsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLGNBQU0sT0FBQSxHQUFHLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRS9ELE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3pGLGtCQUFrQjtvQkFDbEIsd0NBQXdDO2lCQUN6QyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBN0tELG9CQTZLQyJ9