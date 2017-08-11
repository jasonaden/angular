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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
    declareTestsUsingBootstrap();
}
exports.main = main;
function declareTests(_a) {
    var useJit = _a.useJit;
    // Place to put reproductions for regressions
    describe('regressions', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ declarations: [MyComp1, PlatformPipe] }); });
        describe('platform pipes', function () {
            beforeEach(function () { testing_1.TestBed.configureCompiler({ useJit: useJit }); });
            it('should overwrite them by custom pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CustomPipe] });
                var template = '{{true | somePipe}}';
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('someCustomPipe');
            });
        });
        describe('expressions', function () {
            it('should evaluate conditional and boolean operators with right precedence - #8244', function () {
                var template = "{{'red' + (true ? ' border' : '')}}";
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('red border');
            });
            it('should evaluate conditional and unary operators with right precedence - #8235', function () {
                var template = "{{!null?.length}}";
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
            });
            it('should only evaluate stateful pipes once - #10639', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CountingPipe] });
                var template = '{{(null|countingPipe)?.value}}';
                testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp1);
                CountingPipe.reset();
                fixture.detectChanges(/* checkNoChanges */ false);
                matchers_1.expect(fixture.nativeElement).toHaveText('counting pipe value');
                matchers_1.expect(CountingPipe.calls).toBe(1);
            });
            it('should only update the bound property when using asyncPipe - #15205', testing_1.fakeAsync(function () {
                var MyComp = (function () {
                    function MyComp() {
                        this.p = Promise.resolve(1);
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component({ template: '<div myDir [a]="p | async" [b]="2"></div>' })
                ], MyComp);
                var MyDir = (function () {
                    function MyDir() {
                        this.setterCalls = {};
                    }
                    Object.defineProperty(MyDir.prototype, "a", {
                        set: function (v) { this.setterCalls['a'] = v; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MyDir.prototype, "b", {
                        set: function (v) { this.setterCalls['b'] = v; },
                        enumerable: true,
                        configurable: true
                    });
                    MyDir.prototype.ngOnChanges = function (changes) { this.changes = changes; };
                    return MyDir;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Number),
                    __metadata("design:paramtypes", [Number])
                ], MyDir.prototype, "a", null);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Number),
                    __metadata("design:paramtypes", [Number])
                ], MyDir.prototype, "b", null);
                MyDir = __decorate([
                    core_1.Directive({ selector: '[myDir]' })
                ], MyDir);
                testing_1.TestBed.configureTestingModule({ declarations: [MyDir, MyComp] });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var dir = fixture.debugElement.query(platform_browser_1.By.directive(MyDir)).injector.get(MyDir);
                fixture.detectChanges();
                matchers_1.expect(dir.setterCalls).toEqual({ 'a': null, 'b': 2 });
                matchers_1.expect(Object.keys(dir.changes)).toEqual(['a', 'b']);
                dir.setterCalls = {};
                dir.changes = {};
                testing_1.tick();
                fixture.detectChanges();
                matchers_1.expect(dir.setterCalls).toEqual({ 'a': 1 });
                matchers_1.expect(Object.keys(dir.changes)).toEqual(['a']);
            }));
            it('should only evaluate methods once - #10639', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyCountingComp] });
                var template = '{{method()?.value}}';
                testing_1.TestBed.overrideComponent(MyCountingComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyCountingComp);
                MyCountingComp.reset();
                fixture.detectChanges(/* checkNoChanges */ false);
                matchers_1.expect(fixture.nativeElement).toHaveText('counting method value');
                matchers_1.expect(MyCountingComp.calls).toBe(1);
            });
            it('should evalute a conditional in a statement binding', function () {
                var SomeComponent = (function () {
                    function SomeComponent() {
                    }
                    return SomeComponent;
                }());
                SomeComponent = __decorate([
                    core_1.Component({ selector: 'some-comp', template: '<p (click)="nullValue?.click()"></p>' })
                ], SomeComponent);
                var SomeReferencedClass = (function () {
                    function SomeReferencedClass() {
                    }
                    SomeReferencedClass.prototype.click = function () { };
                    return SomeReferencedClass;
                }());
                matchers_1.expect(function () {
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent] })
                        .createComponent(SomeComponent);
                    fixture.detectChanges(/* checkNoChanges */ false);
                }).not.toThrow();
            });
        });
        describe('providers', function () {
            function createInjector(providers) {
                testing_1.TestBed.overrideComponent(MyComp1, { add: { providers: providers } });
                return testing_1.TestBed.createComponent(MyComp1).componentInstance.injector;
            }
            it('should support providers with an InjectionToken that contains a `.` in the name', function () {
                var token = new core_1.InjectionToken('a.b');
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with string token with a `.` in it', function () {
                var token = 'a.b';
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with an anonymous function as token', function () {
                var token = function () { return true; };
                var tokenValue = 1;
                var injector = createInjector([{ provide: token, useValue: tokenValue }]);
                matchers_1.expect(injector.get(token)).toEqual(tokenValue);
            });
            it('should support providers with an InjectionToken that has a StringMap as value', function () {
                var token1 = new core_1.InjectionToken('someToken');
                var token2 = new core_1.InjectionToken('someToken');
                var tokenValue1 = { 'a': 1 };
                var tokenValue2 = { 'a': 1 };
                var injector = createInjector([{ provide: token1, useValue: tokenValue1 }, { provide: token2, useValue: tokenValue2 }]);
                matchers_1.expect(injector.get(token1)).toEqual(tokenValue1);
                matchers_1.expect(injector.get(token2)).toEqual(tokenValue2);
            });
            it('should support providers that have a `name` property with a number value', function () {
                var TestClass = (function () {
                    function TestClass(name) {
                        this.name = name;
                    }
                    return TestClass;
                }());
                var data = [new TestClass(1), new TestClass(2)];
                var injector = createInjector([{ provide: 'someToken', useValue: data }]);
                matchers_1.expect(injector.get('someToken')).toEqual(data);
            });
            describe('ANALYZE_FOR_ENTRY_COMPONENTS providers', function () {
                it('should support class instances', function () {
                    var SomeObject = (function () {
                        function SomeObject() {
                        }
                        SomeObject.prototype.someMethod = function () { };
                        return SomeObject;
                    }());
                    matchers_1.expect(function () { return createInjector([
                        { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, useValue: new SomeObject(), multi: true }
                    ]); })
                        .not.toThrow();
                });
            });
        });
        it('should allow logging a previous elements class binding via interpolation', function () {
            var template = "<div [class.a]=\"true\" #el>Class: {{el.className}}</div>";
            testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp1);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('Class: a');
        });
        it('should support ngClass before a component and content projection inside of an ngIf', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [CmpWithNgContent] });
            var template = "A<cmp-content *ngIf=\"true\" [ngClass]=\"'red'\">B</cmp-content>C";
            testing_1.TestBed.overrideComponent(MyComp1, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp1);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('ABC');
        });
        it('should handle mutual recursion entered from multiple sides - #7084', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [FakeRecursiveComp, LeftComp, RightComp] });
            var fixture = testing_1.TestBed.createComponent(FakeRecursiveComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('[]');
        });
        it('should generate the correct output when constructors have the same name', function () {
            function ComponentFactory(selector, template) {
                var MyComponent = (function () {
                    function MyComponent() {
                    }
                    return MyComponent;
                }());
                MyComponent = __decorate([
                    core_1.Component({ selector: selector, template: template })
                ], MyComponent);
                return MyComponent;
            }
            var HeroComponent = ComponentFactory('my-hero', 'my hero');
            var VillainComponent = ComponentFactory('a-villain', 'a villain');
            var MainComponent = ComponentFactory('my-app', 'I was saved by <my-hero></my-hero> from <a-villain></a-villain>.');
            testing_1.TestBed.configureTestingModule({ declarations: [HeroComponent, VillainComponent, MainComponent] });
            var fixture = testing_1.TestBed.createComponent(MainComponent);
            matchers_1.expect(fixture.nativeElement).toHaveText('I was saved by my hero from a villain.');
        });
        it('should allow to use the renderer outside of views', function () {
            var MyComp = (function () {
                function MyComp(renderer) {
                    this.renderer = renderer;
                }
                return MyComp;
            }());
            MyComp = __decorate([
                core_1.Component({ template: '' }),
                __metadata("design:paramtypes", [core_1.Renderer2])
            ], MyComp);
            testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
            var ctx = testing_1.TestBed.createComponent(MyComp);
            var txtNode = ctx.componentInstance.renderer.createText('test');
            matchers_1.expect(txtNode).toHaveText('test');
        });
        it('should not recreate TemplateRef references during dirty checking', function () {
            var MyComp = (function () {
                function MyComp() {
                }
                return MyComp;
            }());
            MyComp = __decorate([
                core_1.Component({ template: '<div [someDir]="someRef"></div><ng-template #someRef></ng-template>' })
            ], MyComp);
            var MyDir = (function () {
                function MyDir() {
                }
                return MyDir;
            }());
            __decorate([
                core_1.Input('someDir'),
                __metadata("design:type", core_1.TemplateRef)
            ], MyDir.prototype, "template", void 0);
            MyDir = __decorate([
                core_1.Directive({ selector: '[someDir]' })
            ], MyDir);
            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] }).createComponent(MyComp);
            var dir = ctx.debugElement.query(platform_browser_1.By.directive(MyDir)).injector.get(MyDir);
            matchers_1.expect(dir.template).toBeUndefined();
            ctx.detectChanges();
            var template = dir.template;
            matchers_1.expect(template).toBeDefined();
            ctx.detectChanges();
            matchers_1.expect(dir.template).toBe(template);
        });
        it('should not recreate ViewContainerRefs in queries', function () {
            var MyComp = (function () {
                function MyComp() {
                    this.show = true;
                }
                return MyComp;
            }());
            __decorate([
                core_1.ViewChildren('vc', { read: core_1.ViewContainerRef }),
                __metadata("design:type", core_1.QueryList)
            ], MyComp.prototype, "viewContainers", void 0);
            MyComp = __decorate([
                core_1.Component({ template: '<div #vc></div><div *ngIf="show" #vc></div>' })
            ], MyComp);
            var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
            ctx.componentInstance.show = true;
            ctx.detectChanges();
            matchers_1.expect(ctx.componentInstance.viewContainers.length).toBe(2);
            var vc = ctx.componentInstance.viewContainers.first;
            matchers_1.expect(vc).toBeDefined();
            ctx.componentInstance.show = false;
            ctx.detectChanges();
            matchers_1.expect(ctx.componentInstance.viewContainers.first).toBe(vc);
        });
        describe('empty templates - #15143', function () {
            it('should allow empty components', function () {
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component({ template: '' })
                ], MyComp);
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.debugElement.childNodes.length).toBe(0);
            });
            it('should allow empty embedded templates', function () {
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component({ template: '<ng-template [ngIf]="true"></ng-template>' })
                ], MyComp);
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                fixture.detectChanges();
                // Note: We always need to create at least a comment in an embedded template,
                // so we can append other templates after it.
                // 1 comment for the anchor,
                // 1 comment for the empty embedded template.
                matchers_1.expect(fixture.debugElement.childNodes.length).toBe(2);
            });
        });
        it('should support @ContentChild and @Input on the same property for static queries', function () {
            var Test = (function () {
                function Test() {
                }
                return Test;
            }());
            __decorate([
                core_1.Input(), core_1.ContentChild(core_1.TemplateRef),
                __metadata("design:type", core_1.TemplateRef)
            ], Test.prototype, "tpl", void 0);
            Test = __decorate([
                core_1.Directive({ selector: 'test' })
            ], Test);
            var App = (function () {
                function App() {
                }
                return App;
            }());
            App = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n          <test></test><br>\n          <test><ng-template>Custom as a child</ng-template></test><br>\n          <ng-template #custom>Custom as a binding</ng-template>\n          <test [tpl]=\"custom\"></test><br>\n        "
                })
            ], App);
            var fixture = testing_1.TestBed.configureTestingModule({ declarations: [App, Test] }).createComponent(App);
            fixture.detectChanges();
            var testDirs = fixture.debugElement.queryAll(platform_browser_1.By.directive(Test)).map(function (el) { return el.injector.get(Test); });
            matchers_1.expect(testDirs[0].tpl).toBeUndefined();
            matchers_1.expect(testDirs[1].tpl).toBeDefined();
            matchers_1.expect(testDirs[2].tpl).toBeDefined();
        });
        it('should not add ng-version for dynamically created components', function () {
            var App = (function () {
                function App() {
                }
                return App;
            }());
            App = __decorate([
                core_1.Component({ template: '' })
            ], App);
            var MyModule = (function () {
                function MyModule() {
                }
                return MyModule;
            }());
            MyModule = __decorate([
                core_1.NgModule({ declarations: [App], entryComponents: [App] })
            ], MyModule);
            var modRef = testing_1.TestBed.configureTestingModule({ imports: [MyModule] })
                .get(core_1.NgModuleRef);
            var compRef = modRef.componentFactoryResolver.resolveComponentFactory(App).create(core_1.Injector.NULL);
            matchers_1.expect(dom_adapter_1.getDOM().hasAttribute(compRef.location.nativeElement, 'ng-version')).toBe(false);
        });
    });
}
function declareTestsUsingBootstrap() {
    // Place to put reproductions for regressions
    describe('regressions using bootstrap', function () {
        var COMP_SELECTOR = 'root-comp';
        var MockConsole = (function () {
            function MockConsole() {
                this.errors = [];
            }
            MockConsole.prototype.error = function () {
                var s = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    s[_i] = arguments[_i];
                }
                this.errors.push(s);
            };
            return MockConsole;
        }());
        var logger;
        var errorHandler;
        beforeEach(testing_1.inject([platform_browser_1.DOCUMENT], function (doc) {
            core_1.destroyPlatform();
            var el = dom_adapter_1.getDOM().createElement(COMP_SELECTOR, doc);
            dom_adapter_1.getDOM().appendChild(doc.body, el);
            logger = new MockConsole();
            errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
        }));
        afterEach(function () { core_1.destroyPlatform(); });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            // This test needs a real DOM....
            it('should keep change detecting if there was an error', function (done) {
                var ErrorComp = (function () {
                    function ErrorComp() {
                        this.value = 0;
                        this.thrownValue = 0;
                    }
                    ErrorComp.prototype.next = function () { this.value++; };
                    ErrorComp.prototype.nextAndThrow = function () {
                        this.value++;
                        this.throwIfNeeded();
                    };
                    ErrorComp.prototype.throwIfNeeded = function () {
                        core_1.NgZone.assertInAngularZone();
                        if (this.thrownValue !== this.value) {
                            this.thrownValue = this.value;
                            throw new Error("Error: " + this.value);
                        }
                    };
                    return ErrorComp;
                }());
                ErrorComp = __decorate([
                    core_1.Component({
                        selector: COMP_SELECTOR,
                        template: '<button (click)="next()"></button><button (click)="nextAndThrow()"></button><button (dirClick)="nextAndThrow()"></button><span>Value:{{value}}</span><span>{{throwIfNeeded()}}</span>'
                    })
                ], ErrorComp);
                var EventDir = (function () {
                    function EventDir() {
                        this.dirClick = new core_1.EventEmitter();
                    }
                    EventDir.prototype.onClick = function (event) { this.dirClick.next(event); };
                    return EventDir;
                }());
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", Object)
                ], EventDir.prototype, "dirClick", void 0);
                __decorate([
                    core_1.HostListener('click', ['$event']),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], EventDir.prototype, "onClick", null);
                EventDir = __decorate([
                    core_1.Directive({ selector: '[dirClick]' })
                ], EventDir);
                var TestModule = (function () {
                    function TestModule() {
                    }
                    return TestModule;
                }());
                TestModule = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule],
                        declarations: [ErrorComp, EventDir],
                        bootstrap: [ErrorComp],
                        providers: [{ provide: core_1.ErrorHandler, useValue: errorHandler }],
                    })
                ], TestModule);
                platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(TestModule).then(function (ref) {
                    core_1.NgZone.assertNotInAngularZone();
                    var appRef = ref.injector.get(core_1.ApplicationRef);
                    var compRef = appRef.components[0];
                    var compEl = compRef.location.nativeElement;
                    var nextBtn = compEl.children[0];
                    var nextAndThrowBtn = compEl.children[1];
                    var nextAndThrowDirBtn = compEl.children[2];
                    nextBtn.click();
                    assertValueAndErrors(compEl, 1, 0);
                    nextBtn.click();
                    assertValueAndErrors(compEl, 2, 2);
                    nextAndThrowBtn.click();
                    assertValueAndErrors(compEl, 3, 4);
                    nextAndThrowBtn.click();
                    assertValueAndErrors(compEl, 4, 6);
                    nextAndThrowDirBtn.click();
                    assertValueAndErrors(compEl, 5, 8);
                    nextAndThrowDirBtn.click();
                    assertValueAndErrors(compEl, 6, 10);
                    // Assert that there were no more errors
                    matchers_1.expect(logger.errors.length).toBe(12);
                    done();
                });
                function assertValueAndErrors(compEl, value, errorIndex) {
                    matchers_1.expect(compEl).toHaveText("Value:" + value);
                    matchers_1.expect(logger.errors[errorIndex][0]).toBe('ERROR');
                    matchers_1.expect(logger.errors[errorIndex][1].message).toBe("Error: " + value);
                    matchers_1.expect(logger.errors[errorIndex + 1][0]).toBe('ERROR CONTEXT');
                }
            });
        }
    });
}
var MyComp1 = (function () {
    function MyComp1(injector) {
        this.injector = injector;
    }
    return MyComp1;
}());
MyComp1 = __decorate([
    core_1.Component({ selector: 'my-comp', template: '' }),
    __metadata("design:paramtypes", [core_1.Injector])
], MyComp1);
var PlatformPipe = (function () {
    function PlatformPipe() {
    }
    PlatformPipe.prototype.transform = function (value) { return 'somePlatformPipe'; };
    return PlatformPipe;
}());
PlatformPipe = __decorate([
    core_1.Pipe({ name: 'somePipe', pure: true })
], PlatformPipe);
var CustomPipe = (function () {
    function CustomPipe() {
    }
    CustomPipe.prototype.transform = function (value) { return 'someCustomPipe'; };
    return CustomPipe;
}());
CustomPipe = __decorate([
    core_1.Pipe({ name: 'somePipe', pure: true })
], CustomPipe);
var CmpWithNgContent = (function () {
    function CmpWithNgContent() {
    }
    return CmpWithNgContent;
}());
CmpWithNgContent = __decorate([
    core_1.Component({ selector: 'cmp-content', template: "<ng-content></ng-content>" })
], CmpWithNgContent);
var MyCountingComp = MyCountingComp_1 = (function () {
    function MyCountingComp() {
    }
    MyCountingComp.prototype.method = function () {
        MyCountingComp_1.calls++;
        return { value: 'counting method value' };
    };
    MyCountingComp.reset = function () { MyCountingComp_1.calls = 0; };
    return MyCountingComp;
}());
MyCountingComp.calls = 0;
MyCountingComp = MyCountingComp_1 = __decorate([
    core_1.Component({ selector: 'counting-cmp', template: '' })
], MyCountingComp);
var CountingPipe = CountingPipe_1 = (function () {
    function CountingPipe() {
    }
    CountingPipe.prototype.transform = function (value) {
        CountingPipe_1.calls++;
        return { value: 'counting pipe value' };
    };
    CountingPipe.reset = function () { CountingPipe_1.calls = 0; };
    return CountingPipe;
}());
CountingPipe.calls = 0;
CountingPipe = CountingPipe_1 = __decorate([
    core_1.Pipe({ name: 'countingPipe' })
], CountingPipe);
var LeftComp = (function () {
    function LeftComp() {
    }
    return LeftComp;
}());
LeftComp = __decorate([
    core_1.Component({
        selector: 'left',
        template: "L<right *ngIf=\"false\"></right>",
    })
], LeftComp);
var RightComp = (function () {
    function RightComp() {
    }
    return RightComp;
}());
RightComp = __decorate([
    core_1.Component({
        selector: 'right',
        template: "R<left *ngIf=\"false\"></left>",
    })
], RightComp);
var FakeRecursiveComp = (function () {
    function FakeRecursiveComp() {
    }
    return FakeRecursiveComp;
}());
FakeRecursiveComp = __decorate([
    core_1.Component({
        selector: 'fakeRecursiveComp',
        template: "[<left *ngIf=\"false\"></left><right *ngIf=\"false\"></right>]",
    })
], FakeRecursiveComp);
exports.FakeRecursiveComp = FakeRecursiveComp;
var MyCountingComp_1, CountingPipe_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9yZWdyZXNzaW9uX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaVg7QUFDalgsaURBQThFO0FBQzlFLDhEQUFzRTtBQUN0RSw4RUFBeUU7QUFDekUsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdELDBCQUEwQixFQUFFLENBQUM7QUFDL0IsQ0FBQztBQU5ELG9CQU1DO0FBRUQsc0JBQXNCLEVBQTJCO1FBQTFCLGtCQUFNO0lBQzNCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsYUFBYSxFQUFFO1FBRXRCLFVBQVUsQ0FBQyxjQUFRLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0YsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLFVBQVUsQ0FBQyxjQUFRLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5FLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFDMUMsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDN0QsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUM7Z0JBQ3ZDLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3RELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyxpRkFBaUYsRUFBRTtnQkFDcEYsSUFBTSxRQUFRLEdBQUcscUNBQXFDLENBQUM7Z0JBQ3ZELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3RELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrRUFBK0UsRUFBRTtnQkFDbEYsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ3JDLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3RELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtnQkFDdEQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBTSxRQUFRLEdBQUcsZ0NBQWdDLENBQUM7Z0JBQ2xELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3RELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqRCxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3JCLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNoRSxpQkFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUUsbUJBQVMsQ0FBQztnQkFFL0UsSUFBTSxNQUFNO29CQURaO3dCQUVFLE1BQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixDQUFDO29CQUFELGFBQUM7Z0JBQUQsQ0FBQyxBQUZELElBRUM7Z0JBRkssTUFBTTtvQkFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLDJDQUEyQyxFQUFDLENBQUM7bUJBQzdELE1BQU0sQ0FFWDtnQkFHRCxJQUFNLEtBQUs7b0JBRFg7d0JBRUUsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO29CQVN6QyxDQUFDO29CQUxDLHNCQUFJLG9CQUFDOzZCQUFMLFVBQU0sQ0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O3VCQUFBO29CQUUvQyxzQkFBSSxvQkFBQzs2QkFBTCxVQUFNLENBQVMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozt1QkFBQTtvQkFFL0MsMkJBQVcsR0FBWCxVQUFZLE9BQXNCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxZQUFDO2dCQUFELENBQUMsQUFWRCxJQVVDO2dCQUxDO29CQURDLFlBQUssRUFBRTs7OzhDQUN1QztnQkFFL0M7b0JBREMsWUFBSyxFQUFFOzs7OENBQ3VDO2dCQVAzQyxLQUFLO29CQURWLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUM7bUJBQzNCLEtBQUssQ0FVVjtnQkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDaEUsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLHFCQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQVUsQ0FBQztnQkFFekYsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNyRCxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXJELEdBQUcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixHQUFHLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFFakIsY0FBSSxFQUFFLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUV4QixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDMUMsaUJBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakUsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUM7Z0JBQ3ZDLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQzdELElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUV4RCxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNsRSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7Z0JBRXhELElBQU0sYUFBYTtvQkFBbkI7b0JBRUEsQ0FBQztvQkFBRCxvQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxhQUFhO29CQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsc0NBQXNDLEVBQUMsQ0FBQzttQkFDL0UsYUFBYSxDQUVsQjtnQkFFRDtvQkFBQTtvQkFFQSxDQUFDO29CQURDLG1DQUFLLEdBQUwsY0FBUyxDQUFDO29CQUNaLDBCQUFDO2dCQUFELENBQUMsQUFGRCxJQUVDO2dCQUVELGlCQUFNLENBQUM7b0JBQ0wsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUM7eUJBQzFELGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFcEQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3BCLHdCQUF3QixTQUFxQjtnQkFDM0MsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLFdBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztZQUNyRSxDQUFDO1lBRUQsRUFBRSxDQUFDLGlGQUFpRixFQUFFO2dCQUNwRixJQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFFLGlCQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtnQkFDaEUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxRSxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7Z0JBQ2pFLElBQU0sS0FBSyxHQUFHLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDO2dCQUN6QixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxRSxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsK0VBQStFLEVBQUU7Z0JBQ2xGLElBQU0sTUFBTSxHQUFHLElBQUkscUJBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUMvQyxJQUFNLFdBQVcsR0FBRyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQztnQkFDN0IsSUFBTSxXQUFXLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLENBQUM7Z0JBQzdCLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FDM0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxRixpQkFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2xELGlCQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtnQkFDN0U7b0JBQ0UsbUJBQW1CLElBQVk7d0JBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtvQkFBRyxDQUFDO29CQUNyQyxnQkFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFDRCxJQUFNLElBQUksR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRSxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsd0NBQXdDLEVBQUU7Z0JBRWpELEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtvQkFDbkM7d0JBQUE7d0JBRUEsQ0FBQzt3QkFEQywrQkFBVSxHQUFWLGNBQWMsQ0FBQzt3QkFDakIsaUJBQUM7b0JBQUQsQ0FBQyxBQUZELElBRUM7b0JBRUQsaUJBQU0sQ0FDRixjQUFNLE9BQUEsY0FBYyxDQUFDO3dCQUNuQixFQUFDLE9BQU8sRUFBRSxtQ0FBNEIsRUFBRSxRQUFRLEVBQUUsSUFBSSxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO3FCQUNqRixDQUFDLEVBRkksQ0FFSixDQUFDO3lCQUNGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO1lBQzdFLElBQU0sUUFBUSxHQUFHLDJEQUF5RCxDQUFDO1lBQzNFLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDdEQsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakQsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvRkFBb0YsRUFBRTtZQUN2RixpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDbkUsSUFBTSxRQUFRLEdBQUcsbUVBQStELENBQUM7WUFDakYsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFNLE9BQU8sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO1lBQ3ZFLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3pGLElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFM0QsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtZQUM1RSwwQkFBMEIsUUFBZ0IsRUFBRSxRQUFnQjtnQkFFMUQsSUFBTSxXQUFXO29CQUFqQjtvQkFDQSxDQUFDO29CQUFELGtCQUFDO2dCQUFELENBQUMsQUFERCxJQUNDO2dCQURLLFdBQVc7b0JBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBRSxRQUFRLFVBQUEsRUFBQyxDQUFDO21CQUMxQixXQUFXLENBQ2hCO2dCQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDckIsQ0FBQztZQUNELElBQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM3RCxJQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNwRSxJQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FDbEMsUUFBUSxFQUFFLGtFQUFrRSxDQUFDLENBQUM7WUFFbEYsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZELGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1lBRXRELElBQU0sTUFBTTtnQkFDVixnQkFBbUIsUUFBbUI7b0JBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7Z0JBQUcsQ0FBQztnQkFDNUMsYUFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRkssTUFBTTtnQkFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO2lEQUVLLGdCQUFTO2VBRGxDLE1BQU0sQ0FFWDtZQUVELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDekQsSUFBTSxHQUFHLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFNUMsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEUsaUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0VBQWtFLEVBQUU7WUFFckUsSUFBTSxNQUFNO2dCQUFaO2dCQUNBLENBQUM7Z0JBQUQsYUFBQztZQUFELENBQUMsQUFERCxJQUNDO1lBREssTUFBTTtnQkFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHFFQUFxRSxFQUFDLENBQUM7ZUFDdkYsTUFBTSxDQUNYO1lBR0QsSUFBTSxLQUFLO2dCQUFYO2dCQUVBLENBQUM7Z0JBQUQsWUFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRG1CO2dCQUFqQixZQUFLLENBQUMsU0FBUyxDQUFDOzBDQUFXLGtCQUFXO21EQUFNO1lBRHpDLEtBQUs7Z0JBRFYsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQztlQUM3QixLQUFLLENBRVY7WUFFRCxJQUFNLEdBQUcsR0FDTCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUYsSUFBTSxHQUFHLEdBQVUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMscUJBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRW5GLGlCQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXJDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwQixJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQzlCLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFL0IsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3BCLGlCQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUVyRCxJQUFNLE1BQU07Z0JBRFo7b0JBS0UsU0FBSSxHQUFHLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUFELGFBQUM7WUFBRCxDQUFDLEFBTEQsSUFLQztZQUhDO2dCQURDLG1CQUFZLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLHVCQUFnQixFQUFDLENBQUM7MENBQzdCLGdCQUFTOzBEQUFtQjtZQUZ4QyxNQUFNO2dCQURYLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsNkNBQTZDLEVBQUMsQ0FBQztlQUMvRCxNQUFNLENBS1g7WUFFRCxJQUFNLEdBQUcsR0FBRyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU3RixHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEIsaUJBQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztZQUN0RCxpQkFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRXpCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ25DLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNwQixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1lBQ25DLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtnQkFFbEMsSUFBTSxNQUFNO29CQUFaO29CQUNBLENBQUM7b0JBQUQsYUFBQztnQkFBRCxDQUFDLEFBREQsSUFDQztnQkFESyxNQUFNO29CQURYLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7bUJBQ3BCLE1BQU0sQ0FDWDtnQkFFRCxJQUFNLE9BQU8sR0FDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckYsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUV4QixpQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFFMUMsSUFBTSxNQUFNO29CQUFaO29CQUNBLENBQUM7b0JBQUQsYUFBQztnQkFBRCxDQUFDLEFBREQsSUFDQztnQkFESyxNQUFNO29CQURYLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUMsQ0FBQzttQkFDN0QsTUFBTSxDQUNYO2dCQUVELElBQU0sT0FBTyxHQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXhCLDZFQUE2RTtnQkFDN0UsNkNBQTZDO2dCQUM3Qyw0QkFBNEI7Z0JBQzVCLDZDQUE2QztnQkFDN0MsaUJBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpRkFBaUYsRUFBRTtZQUVwRixJQUFNLElBQUk7Z0JBQVY7Z0JBRUEsQ0FBQztnQkFBRCxXQUFDO1lBQUQsQ0FBQyxBQUZELElBRUM7WUFEcUM7Z0JBQW5DLFlBQUssRUFBRSxFQUFFLG1CQUFZLENBQUMsa0JBQVcsQ0FBQzswQ0FBTSxrQkFBVzs2Q0FBTTtZQUR0RCxJQUFJO2dCQURULGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7ZUFDeEIsSUFBSSxDQUVUO1lBV0QsSUFBTSxHQUFHO2dCQUFUO2dCQUNBLENBQUM7Z0JBQUQsVUFBQztZQUFELENBQUMsQUFERCxJQUNDO1lBREssR0FBRztnQkFUUixnQkFBUyxDQUFDO29CQUNULFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsa09BS1Q7aUJBQ0YsQ0FBQztlQUNJLEdBQUcsQ0FDUjtZQUVELElBQU0sT0FBTyxHQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFeEIsSUFBTSxRQUFRLEdBQ1YsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMscUJBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1lBQ3ZGLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hDLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO1lBRWpFLElBQU0sR0FBRztnQkFBVDtnQkFDQSxDQUFDO2dCQUFELFVBQUM7WUFBRCxDQUFDLEFBREQsSUFDQztZQURLLEdBQUc7Z0JBRFIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztlQUNwQixHQUFHLENBQ1I7WUFHRCxJQUFNLFFBQVE7Z0JBQWQ7Z0JBQ0EsQ0FBQztnQkFBRCxlQUFDO1lBQUQsQ0FBQyxBQURELElBQ0M7WUFESyxRQUFRO2dCQURiLGVBQVEsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7ZUFDbEQsUUFBUSxDQUNiO1lBRUQsSUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUM7aUJBQ2hELEdBQUcsQ0FBQyxrQkFBVyxDQUEwQixDQUFDO1lBQzlELElBQU0sT0FBTyxHQUNULE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZGLGlCQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0UsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtRQUN0QyxJQUFNLGFBQWEsR0FBRyxXQUFXLENBQUM7UUFFbEM7WUFBQTtnQkFDRSxXQUFNLEdBQVksRUFBRSxDQUFDO1lBRXZCLENBQUM7WUFEQywyQkFBSyxHQUFMO2dCQUFNLFdBQVc7cUJBQVgsVUFBVyxFQUFYLHFCQUFXLEVBQVgsSUFBVztvQkFBWCxzQkFBVzs7Z0JBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDO1lBQ25ELGtCQUFDO1FBQUQsQ0FBQyxBQUhELElBR0M7UUFFRCxJQUFJLE1BQW1CLENBQUM7UUFDeEIsSUFBSSxZQUEwQixDQUFDO1FBRS9CLFVBQVUsQ0FBQyxnQkFBTSxDQUFDLENBQUMsMkJBQVEsQ0FBQyxFQUFFLFVBQUMsR0FBUTtZQUNyQyxzQkFBZSxFQUFFLENBQUM7WUFDbEIsSUFBTSxFQUFFLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEQsb0JBQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRW5DLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzNCLFlBQVksR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztZQUNsQyxZQUFZLENBQUMsUUFBUSxHQUFHLE1BQWEsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosU0FBUyxDQUFDLGNBQVEsc0JBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEMsRUFBRSxDQUFDLENBQUMsb0JBQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLGlDQUFpQztZQUVqQyxFQUFFLENBQUMsb0RBQW9ELEVBQUUsVUFBQyxJQUFJO2dCQU01RCxJQUFNLFNBQVM7b0JBTGY7d0JBTUUsVUFBSyxHQUFHLENBQUMsQ0FBQzt3QkFDVixnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFhbEIsQ0FBQztvQkFaQyx3QkFBSSxHQUFKLGNBQVMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsZ0NBQVksR0FBWjt3QkFDRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUN2QixDQUFDO29CQUNELGlDQUFhLEdBQWI7d0JBQ0UsYUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7d0JBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs0QkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFVLElBQUksQ0FBQyxLQUFPLENBQUMsQ0FBQzt3QkFDMUMsQ0FBQztvQkFDSCxDQUFDO29CQUNILGdCQUFDO2dCQUFELENBQUMsQUFmRCxJQWVDO2dCQWZLLFNBQVM7b0JBTGQsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsYUFBYTt3QkFDdkIsUUFBUSxFQUNKLHVMQUF1TDtxQkFDNUwsQ0FBQzttQkFDSSxTQUFTLENBZWQ7Z0JBR0QsSUFBTSxRQUFRO29CQURkO3dCQUdFLGFBQVEsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztvQkFJaEMsQ0FBQztvQkFEQywwQkFBTyxHQUFQLFVBQVEsS0FBVSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEQsZUFBQztnQkFBRCxDQUFDLEFBTkQsSUFNQztnQkFKQztvQkFEQyxhQUFNLEVBQUU7OzBEQUNxQjtnQkFHOUI7b0JBREMsbUJBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozt1REFDZ0I7Z0JBTDlDLFFBQVE7b0JBRGIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsQ0FBQzttQkFDOUIsUUFBUSxDQU1iO2dCQVFELElBQU0sVUFBVTtvQkFBaEI7b0JBQ0EsQ0FBQztvQkFBRCxpQkFBQztnQkFBRCxDQUFDLEFBREQsSUFDQztnQkFESyxVQUFVO29CQU5mLGVBQVEsQ0FBQzt3QkFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO3dCQUN4QixZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO3dCQUNuQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBQyxDQUFDO3FCQUM3RCxDQUFDO21CQUNJLFVBQVUsQ0FDZjtnQkFFRCxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO29CQUM1RCxhQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztvQkFDaEMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQWMsQ0FBbUIsQ0FBQztvQkFDbEUsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQTRCLENBQUM7b0JBQ2hFLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29CQUM5QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTlDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDaEIsb0JBQW9CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNoQixvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVuQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3hCLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDeEIsb0JBQW9CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFbkMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQzNCLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO29CQUMzQixvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUVwQyx3Q0FBd0M7b0JBQ3hDLGlCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3RDLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUVILDhCQUE4QixNQUFXLEVBQUUsS0FBYSxFQUFFLFVBQWtCO29CQUMxRSxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFTLEtBQU8sQ0FBQyxDQUFDO29CQUM1QyxpQkFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ25ELGlCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVSxLQUFPLENBQUMsQ0FBQztvQkFDckUsaUJBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDakUsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUdELElBQU0sT0FBTztJQUNYLGlCQUFtQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQUcsQ0FBQztJQUMzQyxjQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxPQUFPO0lBRFosZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO3FDQUVoQixlQUFRO0dBRGpDLE9BQU8sQ0FFWjtBQUdELElBQU0sWUFBWTtJQUFsQjtJQUVBLENBQUM7SUFEQyxnQ0FBUyxHQUFULFVBQVUsS0FBVSxJQUFTLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFDM0QsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFlBQVk7SUFEakIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7R0FDL0IsWUFBWSxDQUVqQjtBQUdELElBQU0sVUFBVTtJQUFoQjtJQUVBLENBQUM7SUFEQyw4QkFBUyxHQUFULFVBQVUsS0FBVSxJQUFTLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDekQsaUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFVBQVU7SUFEZixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztHQUMvQixVQUFVLENBRWY7QUFHRCxJQUFNLGdCQUFnQjtJQUF0QjtJQUNBLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssZ0JBQWdCO0lBRHJCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBQyxDQUFDO0dBQ3RFLGdCQUFnQixDQUNyQjtBQUdELElBQU0sY0FBYztJQUFwQjtJQVFBLENBQUM7SUFQQywrQkFBTSxHQUFOO1FBQ0UsZ0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sb0JBQUssR0FBWixjQUFpQixnQkFBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlDLHFCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFEUSxvQkFBSyxHQUFHLENBQUMsQ0FBQztBQVBiLGNBQWM7SUFEbkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO0dBQzlDLGNBQWMsQ0FRbkI7QUFHRCxJQUFNLFlBQVk7SUFBbEI7SUFPQSxDQUFDO0lBTkMsZ0NBQVMsR0FBVCxVQUFVLEtBQVU7UUFDbEIsY0FBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBQyxDQUFDO0lBQ3hDLENBQUM7SUFDTSxrQkFBSyxHQUFaLGNBQWlCLGNBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1QyxtQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRFEsa0JBQUssR0FBRyxDQUFDLENBQUM7QUFOYixZQUFZO0lBRGpCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQztHQUN2QixZQUFZLENBT2pCO0FBTUQsSUFBTSxRQUFRO0lBQWQ7SUFDQSxDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssUUFBUTtJQUpiLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEVBQUUsa0NBQWdDO0tBQzNDLENBQUM7R0FDSSxRQUFRLENBQ2I7QUFNRCxJQUFNLFNBQVM7SUFBZjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssU0FBUztJQUpkLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsT0FBTztRQUNqQixRQUFRLEVBQUUsZ0NBQThCO0tBQ3pDLENBQUM7R0FDSSxTQUFTLENBQ2Q7QUFNRCxJQUFhLGlCQUFpQjtJQUE5QjtJQUNBLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksaUJBQWlCO0lBSjdCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsbUJBQW1CO1FBQzdCLFFBQVEsRUFBRSxnRUFBNEQ7S0FDdkUsQ0FBQztHQUNXLGlCQUFpQixDQUM3QjtBQURZLDhDQUFpQiJ9