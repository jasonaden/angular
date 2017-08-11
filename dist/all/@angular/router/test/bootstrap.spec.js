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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var router_1 = require("@angular/router");
describe('bootstrap', function () {
    var log = [];
    var testProviders = null;
    var RootCmp = (function () {
        function RootCmp() {
            log.push('RootCmp');
        }
        return RootCmp;
    }());
    RootCmp = __decorate([
        core_1.Component({ selector: 'test-app', template: 'root <router-outlet></router-outlet>' }),
        __metadata("design:paramtypes", [])
    ], RootCmp);
    var SecondRootCmp = (function () {
        function SecondRootCmp() {
        }
        return SecondRootCmp;
    }());
    SecondRootCmp = __decorate([
        core_1.Component({ selector: 'test-app2', template: 'root <router-outlet></router-outlet>' })
    ], SecondRootCmp);
    var TestResolver = (function () {
        function TestResolver() {
        }
        TestResolver.prototype.resolve = function () {
            var resolve = null;
            var res = new Promise(function (r) { return resolve = r; });
            setTimeout(function () { return resolve('test-data'); }, 0);
            return res;
        };
        return TestResolver;
    }());
    beforeEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
        core_1.destroyPlatform();
        var el1 = platform_browser_1.ɵgetDOM().createElement('test-app', doc);
        var el2 = platform_browser_1.ɵgetDOM().createElement('test-app2', doc);
        platform_browser_1.ɵgetDOM().appendChild(doc.body, el1);
        platform_browser_1.ɵgetDOM().appendChild(doc.body, el2);
        log = [];
        testProviders = [{ provide: common_1.APP_BASE_HREF, useValue: '' }];
    }));
    afterEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
        var oldRoots = platform_browser_1.ɵgetDOM().querySelectorAll(doc, 'test-app,test-app2');
        for (var i = 0; i < oldRoots.length; i++) {
            platform_browser_1.ɵgetDOM().remove(oldRoots[i]);
        }
    }));
    it('should wait for resolvers to complete when initialNavigation = enabled', function (done) {
        var TestCmpEnabled = (function () {
            function TestCmpEnabled() {
            }
            return TestCmpEnabled;
        }());
        TestCmpEnabled = __decorate([
            core_1.Component({ selector: 'test', template: 'test' })
        ], TestCmpEnabled);
        var TestModule = (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [
                    platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([{ path: '**', component: TestCmpEnabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'enabled' })
                ],
                declarations: [RootCmp, TestCmpEnabled],
                bootstrap: [RootCmp],
                providers: testProviders.concat([TestResolver]),
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            }),
            __metadata("design:paramtypes", [router_1.Router])
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            var data = router.routerState.snapshot.root.firstChild.data;
            expect(data['test']).toEqual('test-data');
            expect(log).toEqual([
                'TestModule', 'NavigationStart', 'RoutesRecognized', 'GuardsCheckStart', 'GuardsCheckEnd',
                'ResolveStart', 'ResolveEnd', 'RootCmp', 'NavigationEnd'
            ]);
            done();
        });
    });
    it('should NOT wait for resolvers to complete when initialNavigation = legacy_enabled', function (done) {
        var TestCmpLegacyEnabled = (function () {
            function TestCmpLegacyEnabled() {
            }
            return TestCmpLegacyEnabled;
        }());
        TestCmpLegacyEnabled = __decorate([
            core_1.Component({ selector: 'test', template: 'test' })
        ], TestCmpLegacyEnabled);
        var TestModule = (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [
                    platform_browser_1.BrowserModule,
                    router_1.RouterModule.forRoot([{ path: '**', component: TestCmpLegacyEnabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'legacy_enabled' })
                ],
                declarations: [RootCmp, TestCmpLegacyEnabled],
                bootstrap: [RootCmp],
                providers: testProviders.concat([TestResolver]),
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            }),
            __metadata("design:paramtypes", [router_1.Router])
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(router.routerState.snapshot.root.firstChild).toBeNull();
            // ResolveEnd has not been emitted yet because bootstrap returned too early
            expect(log).toEqual([
                'TestModule', 'RootCmp', 'NavigationStart', 'RoutesRecognized', 'GuardsCheckStart',
                'GuardsCheckEnd', 'ResolveStart'
            ]);
            router.events.subscribe(function (e) {
                if (e instanceof router_1.NavigationEnd) {
                    done();
                }
            });
        });
    });
    it('should not run navigation when initialNavigation = disabled', function (done) {
        var TestCmpDiabled = (function () {
            function TestCmpDiabled() {
            }
            return TestCmpDiabled;
        }());
        TestCmpDiabled = __decorate([
            core_1.Component({ selector: 'test', template: 'test' })
        ], TestCmpDiabled);
        var TestModule = (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [
                    platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([{ path: '**', component: TestCmpDiabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'disabled' })
                ],
                declarations: [RootCmp, TestCmpDiabled],
                bootstrap: [RootCmp],
                providers: testProviders.concat([TestResolver]),
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            }),
            __metadata("design:paramtypes", [router_1.Router])
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(log).toEqual(['TestModule', 'RootCmp']);
            done();
        });
    });
    it('should not run navigation when initialNavigation = legacy_disabled', function (done) {
        var TestCmpLegacyDisabled = (function () {
            function TestCmpLegacyDisabled() {
            }
            return TestCmpLegacyDisabled;
        }());
        TestCmpLegacyDisabled = __decorate([
            core_1.Component({ selector: 'test', template: 'test' })
        ], TestCmpLegacyDisabled);
        var TestModule = (function () {
            function TestModule(router) {
                log.push('TestModule');
                router.events.subscribe(function (e) { return log.push(e.constructor.name); });
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [
                    platform_browser_1.BrowserModule,
                    router_1.RouterModule.forRoot([{ path: '**', component: TestCmpLegacyDisabled, resolve: { test: TestResolver } }], { useHash: true, initialNavigation: 'legacy_disabled' })
                ],
                declarations: [RootCmp, TestCmpLegacyDisabled],
                bootstrap: [RootCmp],
                providers: testProviders.concat([TestResolver]),
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            }),
            __metadata("design:paramtypes", [router_1.Router])
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            expect(log).toEqual(['TestModule', 'RootCmp']);
            done();
        });
    });
    it('should not init router navigation listeners if a non root component is bootstrapped', function (done) {
        var TestModule = (function () {
            function TestModule() {
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([], { useHash: true })],
                declarations: [SecondRootCmp, RootCmp],
                entryComponents: [SecondRootCmp],
                bootstrap: [RootCmp],
                providers: testProviders,
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            })
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            spyOn(router, 'resetRootComponentType').and.callThrough();
            var appRef = res.injector.get(core_1.ApplicationRef);
            appRef.bootstrap(SecondRootCmp);
            expect(router.resetRootComponentType).not.toHaveBeenCalled();
            done();
        });
    });
    it('should reinit router navigation listeners if a previously bootstrapped root component is destroyed', function (done) {
        var TestModule = (function () {
            function TestModule() {
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                imports: [platform_browser_1.BrowserModule, router_1.RouterModule.forRoot([], { useHash: true })],
                declarations: [SecondRootCmp, RootCmp],
                entryComponents: [SecondRootCmp],
                bootstrap: [RootCmp],
                providers: testProviders,
                schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
            })
        ], TestModule);
        platform_browser_dynamic_1.platformBrowserDynamic([]).bootstrapModule(TestModule).then(function (res) {
            var router = res.injector.get(router_1.Router);
            spyOn(router, 'resetRootComponentType').and.callThrough();
            var appRef = res.injector.get(core_1.ApplicationRef);
            appRef.components[0].onDestroy(function () {
                appRef.bootstrap(SecondRootCmp);
                expect(router.resetRootComponentType).toHaveBeenCalled();
                done();
            });
            appRef.components[0].destroy();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9ib290c3RyYXAuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUE4QztBQUM5QyxzQ0FBMkc7QUFDM0csaURBQTZDO0FBQzdDLDhEQUFxRjtBQUNyRiw4RUFBeUU7QUFDekUsMENBQTZFO0FBRzdFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3BCLElBQUksYUFBYSxHQUFVLElBQU0sQ0FBQztJQUdsQyxJQUFNLE9BQU87UUFDWDtZQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUN4QyxjQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGSyxPQUFPO1FBRFosZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLHNDQUFzQyxFQUFDLENBQUM7O09BQzlFLE9BQU8sQ0FFWjtJQUdELElBQU0sYUFBYTtRQUFuQjtRQUNBLENBQUM7UUFBRCxvQkFBQztJQUFELENBQUMsQUFERCxJQUNDO0lBREssYUFBYTtRQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsc0NBQXNDLEVBQUMsQ0FBQztPQUMvRSxhQUFhLENBQ2xCO0lBRUQ7UUFBQTtRQU9BLENBQUM7UUFOQyw4QkFBTyxHQUFQO1lBQ0UsSUFBSSxPQUFPLEdBQVEsSUFBSSxDQUFDO1lBQ3hCLElBQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxHQUFHLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQztZQUMxQyxVQUFVLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFB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