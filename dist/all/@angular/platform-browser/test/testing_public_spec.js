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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
// Services, and components for the tests.
var ChildComp = (function () {
    function ChildComp() {
        this.childBinding = 'Child';
    }
    return ChildComp;
}());
ChildComp = __decorate([
    core_1.Component({ selector: 'child-comp', template: "<span>Original {{childBinding}}</span>" }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ChildComp);
var MockChildComp = (function () {
    function MockChildComp() {
    }
    return MockChildComp;
}());
MockChildComp = __decorate([
    core_1.Component({ selector: 'child-comp', template: "<span>Mock</span>" }),
    core_1.Injectable()
], MockChildComp);
var ParentComp = (function () {
    function ParentComp() {
    }
    return ParentComp;
}());
ParentComp = __decorate([
    core_1.Component({
        selector: 'parent-comp',
        template: "Parent(<child-comp></child-comp>)",
    }),
    core_1.Injectable()
], ParentComp);
var MyIfComp = (function () {
    function MyIfComp() {
        this.showMore = false;
    }
    return MyIfComp;
}());
MyIfComp = __decorate([
    core_1.Component({ selector: 'my-if-comp', template: "MyIf(<span *ngIf=\"showMore\">More</span>)" }),
    core_1.Injectable()
], MyIfComp);
var ChildChildComp = (function () {
    function ChildChildComp() {
    }
    return ChildChildComp;
}());
ChildChildComp = __decorate([
    core_1.Component({ selector: 'child-child-comp', template: "<span>ChildChild</span>" }),
    core_1.Injectable()
], ChildChildComp);
var ChildWithChildComp = (function () {
    function ChildWithChildComp() {
        this.childBinding = 'Child';
    }
    return ChildWithChildComp;
}());
ChildWithChildComp = __decorate([
    core_1.Component({
        selector: 'child-comp',
        template: "<span>Original {{childBinding}}(<child-child-comp></child-child-comp>)</span>",
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ChildWithChildComp);
var FancyService = (function () {
    function FancyService() {
        this.value = 'real value';
    }
    FancyService.prototype.getAsyncValue = function () { return Promise.resolve('async value'); };
    FancyService.prototype.getTimeoutValue = function () {
        return new Promise(function (resolve, reject) { return setTimeout(function () { return resolve('timeout value'); }, 10); });
    };
    return FancyService;
}());
var MockFancyService = (function (_super) {
    __extends(MockFancyService, _super);
    function MockFancyService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = 'mocked out value';
        return _this;
    }
    return MockFancyService;
}(FancyService));
var TestProvidersComp = (function () {
    function TestProvidersComp(fancyService) {
        this.fancyService = fancyService;
    }
    return TestProvidersComp;
}());
TestProvidersComp = __decorate([
    core_1.Component({
        selector: 'my-service-comp',
        providers: [FancyService],
        template: "injected value: {{fancyService.value}}"
    }),
    __metadata("design:paramtypes", [FancyService])
], TestProvidersComp);
var TestViewProvidersComp = (function () {
    function TestViewProvidersComp(fancyService) {
        this.fancyService = fancyService;
    }
    return TestViewProvidersComp;
}());
TestViewProvidersComp = __decorate([
    core_1.Component({
        selector: 'my-service-comp',
        viewProviders: [FancyService],
        template: "injected value: {{fancyService.value}}"
    }),
    __metadata("design:paramtypes", [FancyService])
], TestViewProvidersComp);
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SomeDirective.prototype, "someDir", void 0);
SomeDirective = __decorate([
    core_1.Directive({ selector: '[someDir]', host: { '[title]': 'someDir' } })
], SomeDirective);
var SomePipe = (function () {
    function SomePipe() {
    }
    SomePipe.prototype.transform = function (value) { return "transformed " + value; };
    return SomePipe;
}());
SomePipe = __decorate([
    core_1.Pipe({ name: 'somePipe' })
], SomePipe);
var CompUsingModuleDirectiveAndPipe = (function () {
    function CompUsingModuleDirectiveAndPipe() {
    }
    return CompUsingModuleDirectiveAndPipe;
}());
CompUsingModuleDirectiveAndPipe = __decorate([
    core_1.Component({ selector: 'comp', template: "<div  [someDir]=\"'someValue' | somePipe\"></div>" })
], CompUsingModuleDirectiveAndPipe);
var SomeLibModule = (function () {
    function SomeLibModule() {
    }
    return SomeLibModule;
}());
SomeLibModule = __decorate([
    core_1.NgModule()
], SomeLibModule);
var CompWithUrlTemplate = (function () {
    function CompWithUrlTemplate() {
    }
    return CompWithUrlTemplate;
}());
CompWithUrlTemplate = __decorate([
    core_1.Component({ selector: 'comp', templateUrl: '/base/packages/platform-browser/test/static_assets/test.html' })
], CompWithUrlTemplate);
function main() {
    describe('public testing API', function () {
        describe('using the async helper with context passing', function () {
            beforeEach(function () { this.actuallyDone = false; });
            afterEach(function () { matchers_1.expect(this.actuallyDone).toEqual(true); });
            it('should run normal tests', function () { this.actuallyDone = true; });
            it('should run normal async tests', function (done) {
                var _this = this;
                setTimeout(function () {
                    _this.actuallyDone = true;
                    done();
                }, 0);
            });
            it('should run async tests with tasks', testing_1.async(function () {
                var _this = this;
                setTimeout(function () { return _this.actuallyDone = true; }, 0);
            }));
            it('should run async tests with promises', testing_1.async(function () {
                var _this = this;
                var p = new Promise(function (resolve, reject) { return setTimeout(resolve, 10); });
                p.then(function () { return _this.actuallyDone = true; });
            }));
        });
        describe('basic context passing to inject, fakeAsync and withModule helpers', function () {
            var moduleConfig = {
                providers: [FancyService],
            };
            beforeEach(function () { this.contextModified = false; });
            afterEach(function () { matchers_1.expect(this.contextModified).toEqual(true); });
            it('should pass context to inject helper', testing_1.inject([], function () { this.contextModified = true; }));
            it('should pass context to fakeAsync helper', testing_1.fakeAsync(function () { this.contextModified = true; }));
            it('should pass context to withModule helper - simple', testing_1.withModule(moduleConfig, function () { this.contextModified = true; }));
            it('should pass context to withModule helper - advanced', testing_1.withModule(moduleConfig).inject([FancyService], function (service) {
                matchers_1.expect(service.value).toBe('real value');
                this.contextModified = true;
            }));
            it('should preserve context when async and inject helpers are combined', testing_1.async(testing_1.inject([], function () {
                var _this = this;
                setTimeout(function () { return _this.contextModified = true; }, 0);
            })));
            it('should preserve context when fakeAsync and inject helpers are combined', testing_1.fakeAsync(testing_1.inject([], function () {
                var _this = this;
                setTimeout(function () { return _this.contextModified = true; }, 0);
                testing_1.tick(1);
            })));
        });
        describe('using the test injector with the inject helper', function () {
            describe('setting up Providers', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: FancyService, useValue: new FancyService() }] });
                    it('should use set up providers', testing_1.inject([FancyService], function (service) {
                        matchers_1.expect(service.value).toEqual('real value');
                    }));
                    it('should wait until returned promises', testing_1.async(testing_1.inject([FancyService], function (service) {
                        service.getAsyncValue().then(function (value) { return matchers_1.expect(value).toEqual('async value'); });
                        service.getTimeoutValue().then(function (value) { return matchers_1.expect(value).toEqual('timeout value'); });
                    })));
                    it('should allow the use of fakeAsync', testing_1.fakeAsync(testing_1.inject([FancyService], function (service) {
                        var value = undefined;
                        service.getAsyncValue().then(function (val) { return value = val; });
                        testing_1.tick();
                        matchers_1.expect(value).toEqual('async value');
                    })));
                    it('should allow use of "done"', function (done) {
                        testing_1.inject([FancyService], function (service) {
                            var count = 0;
                            var id = setInterval(function () {
                                count++;
                                if (count > 2) {
                                    clearInterval(id);
                                    done();
                                }
                            }, 5);
                        })(); // inject needs to be invoked explicitly with ().
                    });
                    describe('using beforeEach', function () {
                        beforeEach(testing_1.inject([FancyService], function (service) {
                            service.value = 'value modified in beforeEach';
                        }));
                        it('should use modified providers', testing_1.inject([FancyService], function (service) {
                            matchers_1.expect(service.value).toEqual('value modified in beforeEach');
                        }));
                    });
                    describe('using async beforeEach', function () {
                        beforeEach(testing_1.async(testing_1.inject([FancyService], function (service) {
                            service.getAsyncValue().then(function (value) { return service.value = value; });
                        })));
                        it('should use asynchronously modified value', testing_1.inject([FancyService], function (service) {
                            matchers_1.expect(service.value).toEqual('async value');
                        }));
                    });
                });
            });
        });
        describe('using the test injector with modules', function () {
            var moduleConfig = {
                providers: [FancyService],
                imports: [SomeLibModule],
                declarations: [SomeDirective, SomePipe, CompUsingModuleDirectiveAndPipe],
            };
            describe('setting up a module', function () {
                beforeEach(function () { return testing_1.TestBed.configureTestingModule(moduleConfig); });
                it('should use set up providers', testing_1.inject([FancyService], function (service) {
                    matchers_1.expect(service.value).toEqual('real value');
                }));
                it('should be able to create any declared components', function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    matchers_1.expect(compFixture.componentInstance).toBeAnInstanceOf(CompUsingModuleDirectiveAndPipe);
                });
                it('should use set up directives and pipes', function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    var el = compFixture.debugElement;
                    compFixture.detectChanges();
                    matchers_1.expect(el.children[0].properties['title']).toBe('transformed someValue');
                });
                it('should use set up imported modules', testing_1.inject([SomeLibModule], function (libModule) {
                    matchers_1.expect(libModule).toBeAnInstanceOf(SomeLibModule);
                }));
                describe('provided schemas', function () {
                    var ComponentUsingInvalidProperty = (function () {
                        function ComponentUsingInvalidProperty() {
                        }
                        return ComponentUsingInvalidProperty;
                    }());
                    ComponentUsingInvalidProperty = __decorate([
                        core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                    ], ComponentUsingInvalidProperty);
                    beforeEach(function () {
                        testing_1.TestBed.configureTestingModule({ schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA], declarations: [ComponentUsingInvalidProperty] });
                    });
                    it('should not error on unknown bound properties on custom elements when using the CUSTOM_ELEMENTS_SCHEMA', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(ComponentUsingInvalidProperty).componentInstance)
                            .toBeAnInstanceOf(ComponentUsingInvalidProperty);
                    });
                });
            });
            describe('per test modules', function () {
                it('should use set up providers', testing_1.withModule(moduleConfig).inject([FancyService], function (service) {
                    matchers_1.expect(service.value).toEqual('real value');
                }));
                it('should use set up directives and pipes', testing_1.withModule(moduleConfig, function () {
                    var compFixture = testing_1.TestBed.createComponent(CompUsingModuleDirectiveAndPipe);
                    var el = compFixture.debugElement;
                    compFixture.detectChanges();
                    matchers_1.expect(el.children[0].properties['title']).toBe('transformed someValue');
                }));
                it('should use set up library modules', testing_1.withModule(moduleConfig).inject([SomeLibModule], function (libModule) {
                    matchers_1.expect(libModule).toBeAnInstanceOf(SomeLibModule);
                }));
            });
            describe('components with template url', function () {
                beforeEach(testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [CompWithUrlTemplate] });
                    testing_1.TestBed.compileComponents();
                }));
                it('should allow to createSync components with templateUrl after explicit async compilation', function () {
                    var fixture = testing_1.TestBed.createComponent(CompWithUrlTemplate);
                    matchers_1.expect(fixture.nativeElement).toHaveText('from external template\n');
                });
            });
            describe('overwriting metadata', function () {
                var SomePipe = (function () {
                    function SomePipe() {
                    }
                    SomePipe.prototype.transform = function (value) { return "transformed " + value; };
                    return SomePipe;
                }());
                SomePipe = __decorate([
                    core_1.Pipe({ name: 'undefined' })
                ], SomePipe);
                var SomeDirective = (function () {
                    function SomeDirective() {
                        this.someProp = 'hello';
                    }
                    return SomeDirective;
                }());
                SomeDirective = __decorate([
                    core_1.Directive({ selector: '[undefined]' })
                ], SomeDirective);
                var SomeComponent = (function () {
                    function SomeComponent() {
                    }
                    return SomeComponent;
                }());
                SomeComponent = __decorate([
                    core_1.Component({ selector: 'comp', template: 'someText' })
                ], SomeComponent);
                var SomeOtherComponent = (function () {
                    function SomeOtherComponent() {
                    }
                    return SomeOtherComponent;
                }());
                SomeOtherComponent = __decorate([
                    core_1.Component({ selector: 'comp', template: 'someOtherText' })
                ], SomeOtherComponent);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComponent, SomeDirective, SomePipe] })
                ], SomeModule);
                beforeEach(function () { return testing_1.TestBed.configureTestingModule({ imports: [SomeModule] }); });
                describe('module', function () {
                    beforeEach(function () {
                        testing_1.TestBed.overrideModule(SomeModule, { set: { declarations: [SomeOtherComponent] } });
                    });
                    it('should work', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(SomeOtherComponent).componentInstance)
                            .toBeAnInstanceOf(SomeOtherComponent);
                    });
                });
                describe('component', function () {
                    beforeEach(function () {
                        testing_1.TestBed.overrideComponent(SomeComponent, { set: { selector: 'comp', template: 'newText' } });
                    });
                    it('should work', function () {
                        matchers_1.expect(testing_1.TestBed.createComponent(SomeComponent).nativeElement).toHaveText('newText');
                    });
                });
                describe('directive', function () {
                    beforeEach(function () {
                        testing_1.TestBed
                            .overrideComponent(SomeComponent, { set: { selector: 'comp', template: "<div someDir></div>" } })
                            .overrideDirective(SomeDirective, { set: { selector: '[someDir]', host: { '[title]': 'someProp' } } });
                    });
                    it('should work', function () {
                        var compFixture = testing_1.TestBed.createComponent(SomeComponent);
                        compFixture.detectChanges();
                        matchers_1.expect(compFixture.debugElement.children[0].properties['title']).toEqual('hello');
                    });
                });
                describe('pipe', function () {
                    beforeEach(function () {
                        testing_1.TestBed
                            .overrideComponent(SomeComponent, { set: { selector: 'comp', template: "{{'hello' | somePipe}}" } })
                            .overridePipe(SomePipe, { set: { name: 'somePipe' } });
                    });
                    it('should work', function () {
                        var compFixture = testing_1.TestBed.createComponent(SomeComponent);
                        compFixture.detectChanges();
                        matchers_1.expect(compFixture.nativeElement).toHaveText('transformed hello');
                    });
                });
                describe('template', function () {
                    var testBedSpy;
                    beforeEach(function () {
                        testBedSpy = spyOn(testing_1.getTestBed(), 'overrideComponent').and.callThrough();
                        testing_1.TestBed.overrideTemplate(SomeComponent, 'newText');
                    });
                    it("should override component's template", function () {
                        var fixture = testing_1.TestBed.createComponent(SomeComponent);
                        matchers_1.expect(fixture.nativeElement).toHaveText('newText');
                        matchers_1.expect(testBedSpy).toHaveBeenCalledWith(SomeComponent, {
                            set: { template: 'newText', templateUrl: null }
                        });
                    });
                });
            });
            describe('overriding providers', function () {
                describe('in NgModules', function () {
                    it('should support useValue', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockValue');
                    });
                    it('should support useFactory', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'dep', useValue: 'depValue' },
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: ['dep'] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: depValue');
                    });
                    it('should support @Optional without matches', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: null');
                    });
                    it('should support Optional with matches', function () {
                        testing_1.TestBed.configureTestingModule({
                            providers: [
                                { provide: 'dep', useValue: 'depValue' },
                                { provide: 'a', useValue: 'aValue' },
                            ]
                        });
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: depValue');
                    });
                    it('should support SkipSelf', function () {
                        var MyModule = (function () {
                            function MyModule() {
                            }
                            return MyModule;
                        }());
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    { provide: 'a', useValue: 'aValue' },
                                    { provide: 'dep', useValue: 'depValue' },
                                ]
                            })
                        ], MyModule);
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.SkipSelf(), 'dep']] });
                        testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'dep', useValue: 'parentDepValue' }] });
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var modFactory = compiler.compileModuleSync(MyModule);
                        matchers_1.expect(modFactory.create(testing_1.getTestBed()).injector.get('a')).toBe('mockA: parentDepValue');
                    });
                    describe('injecting eager providers into an eager overwritten provider', function () {
                        var MyModule = (function () {
                            // NgModule is eager, which makes all of its deps eager
                            function MyModule(a, b) {
                            }
                            return MyModule;
                        }());
                        MyModule = __decorate([
                            core_1.NgModule({
                                providers: [
                                    { provide: 'a', useFactory: function () { return 'aValue'; } },
                                    { provide: 'b', useFactory: function () { return 'bValue'; } },
                                ]
                            }),
                            __param(0, core_1.Inject('a')), __param(1, core_1.Inject('b')),
                            __metadata("design:paramtypes", [Object, Object])
                        ], MyModule);
                        it('should inject providers that were declared before', function () {
                            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                            testing_1.TestBed.overrideProvider('b', { useFactory: function (a) { return "mockB: " + a; }, deps: ['a'] });
                            matchers_1.expect(testing_1.TestBed.get('b')).toBe('mockB: aValue');
                        });
                        it('should inject providers that were declared afterwards', function () {
                            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                            testing_1.TestBed.overrideProvider('a', { useFactory: function (b) { return "mockA: " + b; }, deps: ['b'] });
                            matchers_1.expect(testing_1.TestBed.get('a')).toBe('mockA: bValue');
                        });
                    });
                });
                describe('in Components', function () {
                    it('should support useValue', function () {
                        var MComp = (function () {
                            function MComp() {
                            }
                            return MComp;
                        }());
                        MComp = __decorate([
                            core_1.Component({
                                template: '',
                                providers: [
                                    { provide: 'a', useValue: 'aValue' },
                                ]
                            })
                        ], MComp);
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MComp] }).createComponent(MComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockValue');
                    });
                    it('should support useFactory', function () {
                        var MyComp = (function () {
                            function MyComp() {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
                                providers: [
                                    { provide: 'dep', useValue: 'depValue' },
                                    { provide: 'a', useValue: 'aValue' },
                                ]
                            })
                        ], MyComp);
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: ['dep'] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: depValue');
                    });
                    it('should support @Optional without matches', function () {
                        var MyComp = (function () {
                            function MyComp() {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
                                providers: [
                                    { provide: 'a', useValue: 'aValue' },
                                ]
                            })
                        ], MyComp);
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: null');
                    });
                    it('should support Optional with matches', function () {
                        var MyComp = (function () {
                            function MyComp() {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
                                providers: [
                                    { provide: 'dep', useValue: 'depValue' },
                                    { provide: 'a', useValue: 'aValue' },
                                ]
                            })
                        ], MyComp);
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.Optional(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: depValue');
                    });
                    it('should support SkipSelf', function () {
                        var MyDir = (function () {
                            function MyDir() {
                            }
                            return MyDir;
                        }());
                        MyDir = __decorate([
                            core_1.Directive({
                                selector: '[myDir]',
                                providers: [
                                    { provide: 'a', useValue: 'aValue' },
                                    { provide: 'dep', useValue: 'depValue' },
                                ]
                            })
                        ], MyDir);
                        var MyComp = (function () {
                            function MyComp() {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '<div myDir></div>',
                                providers: [
                                    { provide: 'dep', useValue: 'parentDepValue' },
                                ]
                            })
                        ], MyComp);
                        testing_1.TestBed.overrideProvider('a', { useFactory: function (dep) { return "mockA: " + dep; }, deps: [[new core_1.SkipSelf(), 'dep']] });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] })
                            .createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.children[0].injector.get('a')).toBe('mockA: parentDepValue');
                    });
                    it('should support multiple providers in a template', function () {
                        var MyDir1 = (function () {
                            function MyDir1() {
                            }
                            return MyDir1;
                        }());
                        MyDir1 = __decorate([
                            core_1.Directive({
                                selector: '[myDir1]',
                                providers: [
                                    { provide: 'a', useValue: 'aValue1' },
                                ]
                            })
                        ], MyDir1);
                        var MyDir2 = (function () {
                            function MyDir2() {
                            }
                            return MyDir2;
                        }());
                        MyDir2 = __decorate([
                            core_1.Directive({
                                selector: '[myDir2]',
                                providers: [
                                    { provide: 'a', useValue: 'aValue2' },
                                ]
                            })
                        ], MyDir2);
                        var MyComp = (function () {
                            function MyComp() {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '<div myDir1></div><div myDir2></div>',
                            })
                        ], MyComp);
                        testing_1.TestBed.overrideProvider('a', { useValue: 'mockA' });
                        var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir1, MyDir2] })
                            .createComponent(MyComp);
                        matchers_1.expect(ctx.debugElement.children[0].injector.get('a')).toBe('mockA');
                        matchers_1.expect(ctx.debugElement.children[1].injector.get('a')).toBe('mockA');
                    });
                    describe('injecting eager providers into an eager overwritten provider', function () {
                        var MyComp = (function () {
                            // Component is eager, which makes all of its deps eager
                            function MyComp(a, b) {
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            core_1.Component({
                                template: '',
                                providers: [
                                    { provide: 'a', useFactory: function () { return 'aValue'; } },
                                    { provide: 'b', useFactory: function () { return 'bValue'; } },
                                ]
                            }),
                            __param(0, core_1.Inject('a')), __param(1, core_1.Inject('b')),
                            __metadata("design:paramtypes", [Object, Object])
                        ], MyComp);
                        it('should inject providers that were declared before it', function () {
                            testing_1.TestBed.overrideProvider('b', { useFactory: function (a) { return "mockB: " + a; }, deps: ['a'] });
                            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                            matchers_1.expect(ctx.debugElement.injector.get('b')).toBe('mockB: aValue');
                        });
                        it('should inject providers that were declared after it', function () {
                            testing_1.TestBed.overrideProvider('a', { useFactory: function (b) { return "mockA: " + b; }, deps: ['b'] });
                            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                            matchers_1.expect(ctx.debugElement.injector.get('a')).toBe('mockA: bValue');
                        });
                    });
                });
                it('should reset overrides when the testing modules is resetted', function () {
                    testing_1.TestBed.overrideProvider('a', { useValue: 'mockValue' });
                    testing_1.TestBed.resetTestingModule();
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'a', useValue: 'aValue' }] });
                    matchers_1.expect(testing_1.TestBed.get('a')).toBe('aValue');
                });
            });
            describe('setting up the compiler', function () {
                describe('providers', function () {
                    beforeEach(function () {
                        var resourceLoaderGet = jasmine.createSpy('resourceLoaderGet')
                            .and.returnValue(Promise.resolve('Hello world!'));
                        testing_1.TestBed.configureTestingModule({ declarations: [CompWithUrlTemplate] });
                        testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: { get: resourceLoaderGet } }] });
                    });
                    it('should use set up providers', testing_1.fakeAsync(function () {
                        testing_1.TestBed.compileComponents();
                        testing_1.tick();
                        var compFixture = testing_1.TestBed.createComponent(CompWithUrlTemplate);
                        matchers_1.expect(compFixture.nativeElement).toHaveText('Hello world!');
                    }));
                });
                describe('useJit true', function () {
                    beforeEach(function () { return testing_1.TestBed.configureCompiler({ useJit: true }); });
                    it('should set the value into CompilerConfig', testing_1.inject([compiler_1.CompilerConfig], function (config) {
                        matchers_1.expect(config.useJit).toBe(true);
                    }));
                });
                describe('useJit false', function () {
                    beforeEach(function () { return testing_1.TestBed.configureCompiler({ useJit: false }); });
                    it('should set the value into CompilerConfig', testing_1.inject([compiler_1.CompilerConfig], function (config) {
                        matchers_1.expect(config.useJit).toBe(false);
                    }));
                });
            });
        });
        describe('errors', function () {
            var originalJasmineIt;
            var originalJasmineBeforeEach;
            var patchJasmineIt = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineIt = jasmine.getEnv().it;
                jasmine.getEnv().it = function (description, fn) {
                    var done = (function () { return resolve(null); });
                    done.fail = function (err) { return reject(err); };
                    fn(done);
                    return null;
                };
                return promise;
            };
            var restoreJasmineIt = function () { return jasmine.getEnv().it = originalJasmineIt; };
            var patchJasmineBeforeEach = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineBeforeEach = jasmine.getEnv().beforeEach;
                jasmine.getEnv().beforeEach = function (fn) {
                    var done = (function () { return resolve(null); });
                    done.fail = function (err) { return reject(err); };
                    fn(done);
                };
                return promise;
            };
            var restoreJasmineBeforeEach = function () { return jasmine.getEnv().beforeEach =
                originalJasmineBeforeEach; };
            it('should fail when an asynchronous error is thrown', function (done) {
                var itPromise = patchJasmineIt();
                var barError = new Error('bar');
                it('throws an async error', testing_1.async(testing_1.inject([], function () { return setTimeout(function () { throw barError; }, 0); })));
                itPromise.then(function () { return done.fail('Expected test to fail, but it did not'); }, function (err) {
                    matchers_1.expect(err).toEqual(barError);
                    done();
                });
                restoreJasmineIt();
            });
            it('should fail when a returned promise is rejected', function (done) {
                var itPromise = patchJasmineIt();
                it('should fail with an error from a promise', testing_1.async(testing_1.inject([], function () {
                    var reject = undefined;
                    var promise = new Promise(function (_, rej) { return reject = rej; });
                    var p = promise.then(function () { return matchers_1.expect(1).toEqual(2); });
                    reject('baz');
                    return p;
                })));
                itPromise.then(function () { return done.fail('Expected test to fail, but it did not'); }, function (err) {
                    matchers_1.expect(err.message).toEqual('Uncaught (in promise): baz');
                    done();
                });
                restoreJasmineIt();
            });
            describe('components', function () {
                var resourceLoaderGet;
                beforeEach(function () {
                    resourceLoaderGet = jasmine.createSpy('resourceLoaderGet')
                        .and.returnValue(Promise.resolve('Hello world!'));
                    testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: { get: resourceLoaderGet } }] });
                });
                it('should report an error for declared components with templateUrl which never call TestBed.compileComponents', function () {
                    var itPromise = patchJasmineIt();
                    matchers_1.expect(function () {
                        return it('should fail', testing_1.withModule({ declarations: [CompWithUrlTemplate] }, function () { return testing_1.TestBed.createComponent(CompWithUrlTemplate); }));
                    })
                        .toThrowError("This test module uses the component " + core_1.ɵstringify(CompWithUrlTemplate) + " which is using a \"templateUrl\" or \"styleUrls\", but they were never compiled. " +
                        "Please call \"TestBed.compileComponents\" before your test.");
                    restoreJasmineIt();
                });
            });
            it('should error on unknown bound properties on custom elements by default', function () {
                var ComponentUsingInvalidProperty = (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    return ComponentUsingInvalidProperty;
                }());
                ComponentUsingInvalidProperty = __decorate([
                    core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                ], ComponentUsingInvalidProperty);
                var itPromise = patchJasmineIt();
                matchers_1.expect(function () { return it('should fail', testing_1.withModule({ declarations: [ComponentUsingInvalidProperty] }, function () { return testing_1.TestBed.createComponent(ComponentUsingInvalidProperty); })); })
                    .toThrowError(/Can't bind to 'someUnknownProp'/);
                restoreJasmineIt();
            });
        });
        describe('creating components', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        ChildComp,
                        MyIfComp,
                        ChildChildComp,
                        ParentComp,
                        TestProvidersComp,
                        TestViewProvidersComp,
                    ]
                });
            });
            it('should instantiate a component with valid DOM', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(ChildComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Original Child');
            }));
            it('should allow changing members of the component', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(MyIfComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf()');
                componentFixture.componentInstance.showMore = true;
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf(More)');
            }));
            it('should override a template', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(ChildComp, { set: { template: '<span>Mock</span>' } });
                var componentFixture = testing_1.TestBed.createComponent(ChildComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('Mock');
            }));
            it('should override a provider', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(TestProvidersComp, { set: { providers: [{ provide: FancyService, useClass: MockFancyService }] } });
                var componentFixture = testing_1.TestBed.createComponent(TestProvidersComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('injected value: mocked out value');
            }));
            it('should override a viewProvider', testing_1.async(function () {
                testing_1.TestBed.overrideComponent(TestViewProvidersComp, { set: { viewProviders: [{ provide: FancyService, useClass: MockFancyService }] } });
                var componentFixture = testing_1.TestBed.createComponent(TestViewProvidersComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('injected value: mocked out value');
            }));
        });
        describe('using alternate components', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MockChildComp,
                        ParentComp,
                    ]
                });
            });
            it('should override component dependencies', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(ParentComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('Parent(Mock)');
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19wdWJsaWNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC90ZXN0aW5nX3B1YmxpY19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUFpRTtBQUNqRSxzQ0FBdUw7QUFDdkwsaURBQXNHO0FBQ3RHLDJFQUFzRTtBQUV0RSwwQ0FBMEM7QUFJMUMsSUFBTSxTQUFTO0lBRWI7UUFBZ0IsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7SUFBQyxDQUFDO0lBQ2hELGdCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFISyxTQUFTO0lBRmQsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLHdDQUF3QyxFQUFDLENBQUM7SUFDdkYsaUJBQVUsRUFBRTs7R0FDUCxTQUFTLENBR2Q7QUFJRCxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFGbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7SUFDbEUsaUJBQVUsRUFBRTtHQUNQLGFBQWEsQ0FDbEI7QUFPRCxJQUFNLFVBQVU7SUFBaEI7SUFDQSxDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLFVBQVU7SUFMZixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLG1DQUFtQztLQUM5QyxDQUFDO0lBQ0QsaUJBQVUsRUFBRTtHQUNQLFVBQVUsQ0FDZjtBQUlELElBQU0sUUFBUTtJQUZkO1FBR0UsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBQUQsZUFBQztBQUFELENB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