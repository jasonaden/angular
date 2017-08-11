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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var spies_1 = require("./spies");
var ChildComp = (function () {
    function ChildComp() {
    }
    return ChildComp;
}());
ChildComp = __decorate([
    core_1.Component({ selector: 'child-cmp' })
], ChildComp);
var SomeComp = (function () {
    function SomeComp() {
    }
    return SomeComp;
}());
SomeComp = __decorate([
    core_1.Component({ selector: 'some-cmp', template: 'someComp' })
], SomeComp);
var SomeCompWithUrlTemplate = (function () {
    function SomeCompWithUrlTemplate() {
    }
    return SomeCompWithUrlTemplate;
}());
SomeCompWithUrlTemplate = __decorate([
    core_1.Component({ selector: 'some-cmp', templateUrl: './someTpl' })
], SomeCompWithUrlTemplate);
function main() {
    describe('RuntimeCompiler', function () {
        describe('compilerComponentSync', function () {
            describe('never resolving loader', function () {
                var StubResourceLoader = (function () {
                    function StubResourceLoader() {
                    }
                    StubResourceLoader.prototype.get = function (url) { return new Promise(function () { }); };
                    return StubResourceLoader;
                }());
                beforeEach(function () {
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useClass: StubResourceLoader, deps: [] }] });
                });
                it('should throw when using a templateUrl that has not been compiled before', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeCompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents().then(function () {
                        matchers_1.expect(function () { return testing_1.TestBed.createComponent(SomeCompWithUrlTemplate); })
                            .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(SomeCompWithUrlTemplate) + " is still being loaded!");
                    });
                }));
                it('should throw when using a templateUrl in a nested component that has not been compiled before', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeComp, ChildComp] });
                    testing_1.TestBed.overrideComponent(ChildComp, { set: { templateUrl: '/someTpl.html' } });
                    testing_1.TestBed.overrideComponent(SomeComp, { set: { template: '<child-cmp></child-cmp>' } });
                    testing_1.TestBed.compileComponents().then(function () {
                        matchers_1.expect(function () { return testing_1.TestBed.createComponent(SomeComp); })
                            .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ChildComp) + " is still being loaded!");
                    });
                });
            });
            describe('resolving loader', function () {
                var StubResourceLoader = (function () {
                    function StubResourceLoader() {
                    }
                    StubResourceLoader.prototype.get = function (url) { return Promise.resolve('hello'); };
                    return StubResourceLoader;
                }());
                beforeEach(function () {
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useClass: StubResourceLoader, deps: [] }] });
                });
                it('should allow to use templateUrl components that have been loaded before', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [SomeCompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents().then(function () {
                        var fixture = testing_1.TestBed.createComponent(SomeCompWithUrlTemplate);
                        matchers_1.expect(fixture.nativeElement).toHaveText('hello');
                    });
                }));
            });
        });
    });
    describe('RuntimeCompiler', function () {
        var compiler;
        var resourceLoader;
        var dirResolver;
        var injector;
        beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: [spies_1.SpyResourceLoader.PROVIDE] }); });
        beforeEach(testing_1.fakeAsync(testing_1.inject([core_1.Compiler, compiler_1.ResourceLoader, compiler_1.DirectiveResolver, core_1.Injector], function (_compiler, _resourceLoader, _dirResolver, _injector) {
            compiler = _compiler;
            resourceLoader = _resourceLoader;
            dirResolver = _dirResolver;
            injector = _injector;
        })));
        describe('compileModuleAsync', function () {
            it('should allow to use templateUrl components', testing_1.fakeAsync(function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({
                        declarations: [SomeCompWithUrlTemplate],
                        entryComponents: [SomeCompWithUrlTemplate]
                    })
                ], SomeModule);
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve('hello'); });
                var ngModuleFactory = undefined;
                compiler.compileModuleAsync(SomeModule).then(function (f) { return ngModuleFactory = f; });
                testing_1.tick();
                matchers_1.expect(ngModuleFactory.moduleType).toBe(SomeModule);
            }));
        });
        describe('compileModuleSync', function () {
            it('should throw when using a templateUrl that has not been compiled before', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeCompWithUrlTemplate], entryComponents: [SomeCompWithUrlTemplate] })
                ], SomeModule);
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve(''); });
                matchers_1.expect(function () { return compiler.compileModuleSync(SomeModule); })
                    .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(SomeCompWithUrlTemplate) + " is still being loaded!");
            });
            it('should throw when using a templateUrl in a nested component that has not been compiled before', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp, ChildComp], entryComponents: [SomeComp] })
                ], SomeModule);
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve(''); });
                dirResolver.setView(SomeComp, new core_1.ɵViewMetadata({ template: '' }));
                dirResolver.setView(ChildComp, new core_1.ɵViewMetadata({ templateUrl: '/someTpl.html' }));
                matchers_1.expect(function () { return compiler.compileModuleSync(SomeModule); })
                    .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ChildComp) + " is still being loaded!");
            });
            it('should allow to use templateUrl components that have been loaded before', testing_1.fakeAsync(function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({
                        declarations: [SomeCompWithUrlTemplate],
                        entryComponents: [SomeCompWithUrlTemplate]
                    })
                ], SomeModule);
                resourceLoader.spy('get').and.callFake(function () { return Promise.resolve('hello'); });
                compiler.compileModuleAsync(SomeModule);
                testing_1.tick();
                var ngModuleFactory = compiler.compileModuleSync(SomeModule);
                matchers_1.expect(ngModuleFactory).toBeTruthy();
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9jb21waWxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9ydW50aW1lX2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw4Q0FBb0U7QUFDcEUsc0NBQStJO0FBQy9JLGlEQUE4RTtBQUM5RSwyRUFBc0U7QUFFdEUsaUNBQTBDO0FBRzFDLElBQU0sU0FBUztJQUFmO0lBQ0EsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxTQUFTO0lBRGQsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQztHQUM3QixTQUFTLENBQ2Q7QUFHRCxJQUFNLFFBQVE7SUFBZDtJQUNBLENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxRQUFRO0lBRGIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQyxDQUFDO0dBQ2xELFFBQVEsQ0FDYjtBQUdELElBQU0sdUJBQXVCO0lBQTdCO0lBQ0EsQ0FBQztJQUFELDhCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyx1QkFBdUI7SUFENUIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDO0dBQ3RELHVCQUF1QixDQUM1QjtBQUVEO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBRTFCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ2pDO29CQUFBO29CQUVBLENBQUM7b0JBREMsZ0NBQUcsR0FBSCxVQUFJLEdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JB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