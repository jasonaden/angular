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
var index_1 = require("../index");
var router_preloader_1 = require("../src/router_preloader");
var testing_2 = require("../testing");
describe('RouterPreloader', function () {
    var LazyLoadedCmp = (function () {
        function LazyLoadedCmp() {
        }
        return LazyLoadedCmp;
    }());
    LazyLoadedCmp = __decorate([
        core_1.Component({ template: '' })
    ], LazyLoadedCmp);
    describe('should not load configurations with canLoad guard', function () {
        var LoadedModule = (function () {
            function LoadedModule() {
            }
            return LoadedModule;
        }());
        LoadedModule = __decorate([
            core_1.NgModule({
                declarations: [LazyLoadedCmp],
                imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', component: LazyLoadedCmp }])]
            })
        ], LoadedModule);
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected', canLoad: ['someGuard'] }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router], function (loader, preloader, router) {
            loader.stubbedModules = { expected: LoadedModule };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0]._loadedConfig).not.toBeDefined();
        })));
    });
    describe('should preload configurations', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected' }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router, core_1.NgModuleRef], function (loader, preloader, router, testModule) {
            var events = [];
            var LoadedModule2 = (function () {
                function LoadedModule2() {
                }
                return LoadedModule2;
            }());
            LoadedModule2 = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedCmp],
                    imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule2', component: LazyLoadedCmp }])]
                })
            ], LoadedModule2);
            var LoadedModule1 = (function () {
                function LoadedModule1() {
                }
                return LoadedModule1;
            }());
            LoadedModule1 = __decorate([
                core_1.NgModule({
                    imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', loadChildren: 'expected2' }])]
                })
            ], LoadedModule1);
            router.events.subscribe(function (e) {
                if (e instanceof index_1.RouteConfigLoadEnd || e instanceof index_1.RouteConfigLoadStart) {
                    events.push(e);
                }
            });
            loader.stubbedModules = {
                expected: LoadedModule1,
                expected2: LoadedModule2,
            };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0].loadChildren).toEqual('expected');
            var loadedConfig = c[0]._loadedConfig;
            var module = loadedConfig.module;
            expect(loadedConfig.routes[0].path).toEqual('LoadedModule1');
            expect(module._parent).toBe(testModule);
            var loadedConfig2 = loadedConfig.routes[0]._loadedConfig;
            var module2 = loadedConfig2.module;
            expect(loadedConfig2.routes[0].path).toEqual('LoadedModule2');
            expect(module2._parent).toBe(module);
            expect(events.map(function (e) { return e.toString(); })).toEqual([
                'RouteConfigLoadStart(path: lazy)',
                'RouteConfigLoadEnd(path: lazy)',
                'RouteConfigLoadStart(path: LoadedModule1)',
                'RouteConfigLoadEnd(path: LoadedModule1)',
            ]);
        })));
    });
    describe('should support modules that have already been loaded', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'lazy', loadChildren: 'expected' }])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router, core_1.NgModuleRef, core_1.Compiler], function (loader, preloader, router, testModule, compiler) {
            var LoadedModule2 = (function () {
                function LoadedModule2() {
                }
                return LoadedModule2;
            }());
            LoadedModule2 = __decorate([
                core_1.NgModule()
            ], LoadedModule2);
            var module2 = compiler.compileModuleSync(LoadedModule2).create(null);
            var LoadedModule1 = (function () {
                function LoadedModule1() {
                }
                return LoadedModule1;
            }());
            LoadedModule1 = __decorate([
                core_1.NgModule({
                    imports: [index_1.RouterModule.forChild([
                            {
                                path: 'LoadedModule2',
                                loadChildren: 'no',
                                _loadedConfig: {
                                    routes: [{ path: 'LoadedModule3', loadChildren: 'expected3' }],
                                    module: module2,
                                }
                            },
                        ])]
                })
            ], LoadedModule1);
            var LoadedModule3 = (function () {
                function LoadedModule3() {
                }
                return LoadedModule3;
            }());
            LoadedModule3 = __decorate([
                core_1.NgModule({ imports: [index_1.RouterModule.forChild([])] })
            ], LoadedModule3);
            loader.stubbedModules = {
                expected: LoadedModule1,
                expected3: LoadedModule3,
            };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            var loadedConfig = c[0]._loadedConfig;
            var module = loadedConfig.module;
            expect(module._parent).toBe(testModule);
            var loadedConfig2 = loadedConfig.routes[0]._loadedConfig;
            var loadedConfig3 = loadedConfig2.routes[0]._loadedConfig;
            var module3 = loadedConfig3.module;
            expect(module3._parent).toBe(module2);
        })));
    });
    describe('should ignore errors', function () {
        var LoadedModule = (function () {
            function LoadedModule() {
            }
            return LoadedModule;
        }());
        LoadedModule = __decorate([
            core_1.NgModule({
                declarations: [LazyLoadedCmp],
                imports: [index_1.RouterModule.forChild([{ path: 'LoadedModule1', component: LazyLoadedCmp }])]
            })
        ], LoadedModule);
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([
                        { path: 'lazy1', loadChildren: 'expected1' }, { path: 'lazy2', loadChildren: 'expected2' }
                    ])],
                providers: [{ provide: router_preloader_1.PreloadingStrategy, useExisting: router_preloader_1.PreloadAllModules }]
            });
        });
        it('should work', testing_1.fakeAsync(testing_1.inject([core_1.NgModuleFactoryLoader, router_preloader_1.RouterPreloader, index_1.Router], function (loader, preloader, router) {
            loader.stubbedModules = { expected2: LoadedModule };
            preloader.preload().subscribe(function () { });
            testing_1.tick();
            var c = router.config;
            expect(c[0]._loadedConfig).not.toBeDefined();
            expect(c[1]._loadedConfig).toBeDefined();
        })));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3ByZWxvYWRlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3Qvcm91dGVyX3ByZWxvYWRlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWdHO0FBQ2hHLGlEQUF1RTtBQUV2RSxrQ0FBK0Y7QUFFL0YsNERBQStGO0FBQy9GLHNDQUF5RTtBQUV6RSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFFMUIsSUFBTSxhQUFhO1FBQW5CO1FBQ0EsQ0FBQztRQUFELG9CQUFDO0lBQUQsQ0FBQyxBQURELElBQ0M7SUFESyxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDcEIsYUFBYSxDQUNsQjtJQUVELFFBQVEsQ0FBQyxtREFBbUQsRUFBRTtRQUs1RCxJQUFNLFlBQVk7WUFBbEI7WUFDQSxDQUFDO1lBQUQsbUJBQUM7UUFBRCxDQUFDLEFBREQsSUFDQztRQURLLFlBQVk7WUFKakIsZUFBUSxDQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsb0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUMsQ0FBQzthQUN0RixDQUFDO1dBQ0ksWUFBWSxDQUNqQjtRQUVELFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLDZCQUFtQixDQUFDLFVBQVUsQ0FDcEMsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEUsU0FBUyxFQUFFLENBQUMs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