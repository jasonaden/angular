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
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("@angular/upgrade/src/common/angular1");
var constants_1 = require("@angular/upgrade/src/common/constants");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    describe('injection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should downgrade ng2 service to ng1', testing_1.async(function () {
            // Tokens used in ng2 to identify services
            var Ng2Service = new core_1.InjectionToken('ng2-service');
            // Sample ng1 NgModule for tests
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    providers: [
                        { provide: Ng2Service, useValue: 'ng2 service value' },
                    ]
                })
            ], Ng2Module);
            // create the ng1 module that will import an ng2 service
            var ng1Module = angular.module('ng1Module', []).factory('ng2Service', static_1.downgradeInjectable(Ng2Service));
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) {
                var ng1Injector = upgrade.$injector;
                expect(ng1Injector.get('ng2Service')).toBe('ng2 service value');
            });
        }));
        it('should upgrade ng1 service to ng2', testing_1.async(function () {
            // Tokens used in ng2 to identify services
            var Ng1Service = new core_1.InjectionToken('ng1-service');
            // Sample ng1 NgModule for tests
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    providers: [
                        // the following line is the "upgrade" of an AngularJS service
                        {
                            provide: Ng1Service,
                            useFactory: function (i) { return i.get('ng1Service'); },
                            deps: ['$injector']
                        }
                    ]
                })
            ], Ng2Module);
            // create the ng1 module that will import an ng2 service
            var ng1Module = angular.module('ng1Module', []).value('ng1Service', 'ng1 service value');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) {
                var ng2Injector = upgrade.injector;
                expect(ng2Injector.get(Ng1Service)).toBe('ng1 service value');
            });
        }));
        it('should initialize the upgraded injector before application run blocks are executed', testing_1.async(function () {
            var runBlockTriggered = false;
            var ng1Module = angular.module('ng1Module', []).run([
                constants_1.INJECTOR_KEY,
                function (injector) {
                    runBlockTriggered = true;
                    expect(injector.get(constants_1.$INJECTOR)).toBeDefined();
                }
            ]);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
            ], Ng2Module);
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module).then(function () {
                expect(runBlockTriggered).toBeTruthy();
            });
        }));
        it('should allow resetting angular at runtime', testing_1.async(function () {
            var wrappedBootstrapepedCalled = false;
            var n = static_1.getAngularLib();
            static_1.setAngularLib({
                bootstrap: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    wrappedBootstrapepedCalled = true;
                    n.bootstrap.apply(n, args);
                },
                module: n.module,
                element: n.element,
                version: n.version,
                resumeBootstrap: n.resumeBootstrap,
                getTestability: n.getTestability
            });
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
            ], Ng2Module);
            var ng1Module = angular.module('ng1Module', []);
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, test_helpers_1.html('<div>'), ng1Module)
                .then(function (upgrade) { expect(wrappedBootstrapepedCalled).toEqual(true); });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3Qvc3RhdGljL2ludGVncmF0aW9uL2luamVjdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtGO0FBQ2xGLGlEQUE0QztBQUM1Qyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLDhEQUFnRTtBQUNoRSxtRUFBOEU7QUFDOUUsa0RBQXlHO0FBRXpHLGdEQUFnRDtBQUVoRDtJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBRW5DLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxlQUFLLENBQUM7WUFDM0MsMENBQTBDO1lBQzFDLElBQU0sVUFBVSxHQUFHLElBQUkscUJBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVyRCxnQ0FBZ0M7WUFPaEMsSUFBTSxTQUFTO2dCQUFmO2dCQUVBLENBQUM7Z0JBREMsaUNBQWEsR0FBYixjQUFpQixDQUFDO2dCQUNwQixnQkFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRkssU0FBUztnQkFOZCxlQUFRLENBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsRUFBRSxzQkFBYSxDQUFDO29CQUN2QyxTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBQztxQkFDckQ7aUJBQ0YsQ0FBQztlQUNJLFNBQVMsQ0FFZDtZQUVELHdEQUF3RDtZQUN4RCxJQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENB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