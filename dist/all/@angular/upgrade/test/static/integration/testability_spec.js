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
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("@angular/upgrade/src/common/angular1");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    describe('testability', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        var Ng2Module = (function () {
            function Ng2Module() {
            }
            Ng2Module.prototype.ngDoBootstrap = function () { };
            return Ng2Module;
        }());
        Ng2Module = __decorate([
            core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
        ], Ng2Module);
        it('should handle deferred bootstrap', testing_1.fakeAsync(function () {
            var applicationRunning = false;
            var stayedInTheZone = undefined;
            var ng1Module = angular.module('ng1', []).run(function () {
                applicationRunning = true;
                stayedInTheZone = ng_zone_1.NgZone.isInAngularZone();
            });
            var element = test_helpers_1.html('<div></div>');
            window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module);
            setTimeout(function () { window.angular.resumeBootstrap(); }, 100);
            expect(applicationRunning).toEqual(false);
            testing_1.tick(100);
            expect(applicationRunning).toEqual(true);
            expect(stayedInTheZone).toEqual(true);
        }));
        it('should wait for ng2 testability', testing_1.fakeAsync(function () {
            var ng1Module = angular.module('ng1', []);
            var element = test_helpers_1.html('<div></div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var ng2Testability = upgrade.injector.get(core_1.Testability);
                ng2Testability.increasePendingRequestCount();
                var ng2Stable = false;
                var ng1Stable = false;
                angular.getTestability(element).whenStable(function () { ng1Stable = true; });
                setTimeout(function () {
                    ng2Stable = true;
                    ng2Testability.decreasePendingRequestCount();
                }, 100);
                expect(ng1Stable).toEqual(false);
                expect(ng2Stable).toEqual(false);
                testing_1.tick(100);
                expect(ng1Stable).toEqual(true);
                expect(ng2Stable).toEqual(true);
            });
        }));
        it('should not wait for $interval', testing_1.fakeAsync(function () {
            var ng1Module = angular.module('ng1', []);
            var element = test_helpers_1.html('<div></div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var ng2Testability = upgrade.injector.get(core_1.Testability);
                var $interval = upgrade.$injector.get('$interval');
                var ng2Stable = false;
                var intervalDone = false;
                var id = $interval(function (arg) {
                    // should only be called once
                    expect(intervalDone).toEqual(false);
                    intervalDone = true;
                    expect(ng_zone_1.NgZone.isInAngularZone()).toEqual(true);
                    expect(arg).toEqual('passed argument');
                }, 200, 0, true, 'passed argument');
                ng2Testability.whenStable(function () { ng2Stable = true; });
                testing_1.tick(100);
                expect(intervalDone).toEqual(false);
                expect(ng2Stable).toEqual(true);
                testing_1.tick(200);
                expect(intervalDone).toEqual(true);
                expect($interval.cancel(id)).toEqual(true);
                // Interval should not fire after cancel
                testing_1.tick(200);
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9zdGF0aWMvaW50ZWdyYXRpb24vdGVzdGFiaWxpdHlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFxRTtBQUNyRSwwREFBc0Q7QUFDdEQsaURBQXNEO0FBQ3RELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsOERBQWdFO0FBQ2hFLGtEQUFzRDtBQUV0RCxnREFBZ0Q7QUFFaEQ7SUFDRSxRQUFRLENBQUMsYUFBYSxFQUFFO1FBRXRCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUduQyxJQUFNLFNBQVM7WUFBZjtZQUVBLENBQUM7WUFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7WUFDcEIsZ0JBQUM7UUFBRCxDQUFDLEFBRkQsSUFFQztRQUZLLFNBQVM7WUFEZCxlQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHNCQUFhLENBQUMsRUFBQyxDQUFDO1dBQzlDLFNBQVMsQ0FFZDtRQUVELEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO1lBQzVDLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQy9CLElBQUksZUFBZSxHQUFZLFNBQVcsQ0FBQztZQUMzQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQzlDLGtCQUFrQixHQUFHLElBQUksQ0FBQztnQkFDMUIsZUFBZSxHQUFHLGdCQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDN0MsQ0FBQyxDQUFD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