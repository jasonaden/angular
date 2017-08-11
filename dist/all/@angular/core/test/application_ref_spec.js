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
var application_ref_1 = require("@angular/core/src/application_ref");
var error_handler_1 = require("@angular/core/src/error_handler");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var platform_server_1 = require("@angular/platform-server");
var testing_1 = require("../testing");
var SomeComponent = (function () {
    function SomeComponent() {
    }
    return SomeComponent;
}());
SomeComponent = __decorate([
    core_1.Component({ selector: 'bootstrap-app', template: 'hello' })
], SomeComponent);
function main() {
    describe('bootstrap', function () {
        var mockConsole;
        beforeEach(function () { mockConsole = new MockConsole(); });
        function createRootEl(selector) {
            if (selector === void 0) { selector = 'bootstrap-app'; }
            var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
            var rootEl = dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().content(dom_adapter_1.getDOM().createTemplate("<" + selector + "></" + selector + ">")));
            var oldRoots = dom_adapter_1.getDOM().querySelectorAll(doc, selector);
            for (var i = 0; i < oldRoots.length; i++) {
                dom_adapter_1.getDOM().remove(oldRoots[i]);
            }
            dom_adapter_1.getDOM().appendChild(doc.body, rootEl);
        }
        function createModule(providersOrOptions) {
            var options = {};
            if (providersOrOptions instanceof Array) {
                options = { providers: providersOrOptions };
            }
            else {
                options = providersOrOptions || {};
            }
            var errorHandler = new error_handler_1.ErrorHandler();
            errorHandler._console = mockConsole;
            var platformModule = dom_adapter_1.getDOM().supportsDOMEvents() ? platform_browser_1.BrowserModule : platform_server_1.ServerModule;
            var MyModule = (function () {
                function MyModule() {
                }
                return MyModule;
            }());
            MyModule = __decorate([
                core_1.NgModule({
                    providers: [{ provide: error_handler_1.ErrorHandler, useValue: errorHandler }, options.providers || []],
                    imports: [platformModule],
                    declarations: [SomeComponent],
                    entryComponents: [SomeComponent],
                    bootstrap: options.bootstrap || []
                })
            ], MyModule);
            if (options.ngDoBootstrap !== false) {
                MyModule.prototype.ngDoBootstrap = options.ngDoBootstrap || (function () { });
            }
            return MyModule;
        }
        it('should bootstrap a component from a child module', testing_1.async(testing_1.inject([application_ref_1.ApplicationRef, core_1.Compiler], function (app, compiler) {
            var SomeComponent = (function () {
                function SomeComponent() {
                }
                return SomeComponent;
            }());
            SomeComponent = __decorate([
                core_1.Component({
                    selector: 'bootstrap-app',
                    template: '',
                })
            ], SomeComponent);
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({
                    providers: [{ provide: 'hello', useValue: 'component' }],
                    declarations: [SomeComponent],
                    entryComponents: [SomeComponent],
                })
            ], SomeModule);
            createRootEl();
            var modFactory = compiler.compileModuleSync(SomeModule);
            var module = modFactory.create(testing_1.TestBed);
            var cmpFactory = module.componentFactoryResolver.resolveComponentFactory(SomeComponent);
            var component = app.bootstrap(cmpFactory);
            // The component should see the child module providers
            matchers_1.expect(component.injector.get('hello')).toEqual('component');
        })));
        it('should bootstrap a component with a custom selector', testing_1.async(testing_1.inject([application_ref_1.ApplicationRef, core_1.Compiler], function (app, compiler) {
            var SomeComponent = (function () {
                function SomeComponent() {
                }
                return SomeComponent;
            }());
            SomeComponent = __decorate([
                core_1.Component({
                    selector: 'bootstrap-app',
                    template: '',
                })
            ], SomeComponent);
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({
                    providers: [{ provide: 'hello', useValue: 'component' }],
                    declarations: [SomeComponent],
                    entryComponents: [SomeComponent],
                })
            ], SomeModule);
            createRootEl('custom-selector');
            var modFactory = compiler.compileModuleSync(SomeModule);
            var module = modFactory.create(testing_1.TestBed);
            var cmpFactory = module.componentFactoryResolver.resolveComponentFactory(SomeComponent);
            var component = app.bootstrap(cmpFactory, 'custom-selector');
            // The component should see the child module providers
            matchers_1.expect(component.injector.get('hello')).toEqual('component');
        })));
        describe('ApplicationRef', function () {
            beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [createModule()] }); });
            it('should throw when reentering tick', function () {
                var ReenteringComponent = (function () {
                    function ReenteringComponent(appRef) {
                        this.appRef = appRef;
                        this.reenterCount = 1;
                    }
                    ReenteringComponent.prototype.reenter = function () {
                        if (this.reenterCount--) {
                            try {
                                this.appRef.tick();
                            }
                            catch (e) {
                                this.reenterErr = e;
                            }
                        }
                    };
                    return ReenteringComponent;
                }());
                ReenteringComponent = __decorate([
                    core_1.Component({ template: '{{reenter()}}' }),
                    __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
                ], ReenteringComponent);
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [ReenteringComponent] })
                    .createComponent(ReenteringComponent);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(fixture.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(fixture.componentInstance.reenterErr.message)
                    .toBe('ApplicationRef.tick is called recursively');
            });
            describe('APP_BOOTSTRAP_LISTENER', function () {
                var capturedCompRefs;
                beforeEach(function () {
                    capturedCompRefs = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: core_1.APP_BOOTSTRAP_LISTENER,
                                multi: true,
                                useValue: function (compRef) { capturedCompRefs.push(compRef); }
                            }]
                    });
                });
                it('should be called when a component is bootstrapped', testing_1.inject([application_ref_1.ApplicationRef], function (ref) {
                    createRootEl();
                    var compRef = ref.bootstrap(SomeComponent);
                    matchers_1.expect(capturedCompRefs).toEqual([compRef]);
                }));
            });
            describe('bootstrap', function () {
                it('should throw if an APP_INITIIALIZER is not yet resolved', testing_1.withModule({
                    providers: [
                        { provide: core_1.APP_INITIALIZER, useValue: function () { return new Promise(function () { }); }, multi: true }
                    ]
                }, testing_1.inject([application_ref_1.ApplicationRef], function (ref) {
                    createRootEl();
                    matchers_1.expect(function () { return ref.bootstrap(SomeComponent); })
                        .toThrowError('Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.');
                })));
            });
        });
        describe('bootstrapModule', function () {
            var defaultPlatform;
            beforeEach(testing_1.inject([core_1.PlatformRef], function (_platform) {
                createRootEl();
                defaultPlatform = _platform;
            }));
            it('should wait for asynchronous app initializers', testing_1.async(function () {
                var resolve;
                var promise = new Promise(function (res) { resolve = res; });
                var initializerDone = false;
                setTimeout(function () {
                    resolve(true);
                    initializerDone = true;
                }, 1);
                defaultPlatform
                    .bootstrapModule(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return promise; }, multi: true }]))
                    .then(function (_) { matchers_1.expect(initializerDone).toBe(true); });
            }));
            it('should rethrow sync errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                defaultPlatform
                    .bootstrapModule(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { throw 'Test'; }, multi: true }]))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    // Error rethrown will be seen by the exception handler since it's after
                    // construction.
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
            it('should rethrow promise errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                defaultPlatform
                    .bootstrapModule(createModule([
                    { provide: core_1.APP_INITIALIZER, useValue: function () { return Promise.reject('Test'); }, multi: true }
                ]))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
            it('should throw useful error when ApplicationRef is not configured', testing_1.async(function () {
                var EmptyModule = (function () {
                    function EmptyModule() {
                    }
                    return EmptyModule;
                }());
                EmptyModule = __decorate([
                    core_1.NgModule()
                ], EmptyModule);
                return defaultPlatform.bootstrapModule(EmptyModule)
                    .then(function () { return fail('expecting error'); }, function (error) {
                    matchers_1.expect(error.message)
                        .toEqual('No ErrorHandler. Is platform module (BrowserModule) included?');
                });
            }));
            it('should call the `ngDoBootstrap` method with `ApplicationRef` on the main module', testing_1.async(function () {
                var ngDoBootstrap = jasmine.createSpy('ngDoBootstrap');
                defaultPlatform.bootstrapModule(createModule({ ngDoBootstrap: ngDoBootstrap }))
                    .then(function (moduleRef) {
                    var appRef = moduleRef.injector.get(application_ref_1.ApplicationRef);
                    matchers_1.expect(ngDoBootstrap).toHaveBeenCalledWith(appRef);
                });
            }));
            it('should auto bootstrap components listed in @NgModule.bootstrap', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ bootstrap: [SomeComponent] }))
                    .then(function (moduleRef) {
                    var appRef = moduleRef.injector.get(application_ref_1.ApplicationRef);
                    matchers_1.expect(appRef.componentTypes).toEqual([SomeComponent]);
                });
            }));
            it('should error if neither `ngDoBootstrap` nor @NgModule.bootstrap was specified', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ ngDoBootstrap: false }))
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    var expectedErrMsg = "The module MyModule was bootstrapped, but it does not declare \"@NgModule.bootstrap\" components nor a \"ngDoBootstrap\" method. Please define one of these.";
                    matchers_1.expect(e.message).toEqual(expectedErrMsg);
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Error: ' + expectedErrMsg);
                });
            }));
            it('should add bootstrapped module into platform modules list', testing_1.async(function () {
                defaultPlatform.bootstrapModule(createModule({ bootstrap: [SomeComponent] }))
                    .then(function (module) { return matchers_1.expect(defaultPlatform._modules).toContain(module); });
            }));
        });
        describe('bootstrapModuleFactory', function () {
            var defaultPlatform;
            beforeEach(testing_1.inject([core_1.PlatformRef], function (_platform) {
                createRootEl();
                defaultPlatform = _platform;
            }));
            it('should wait for asynchronous app initializers', testing_1.async(function () {
                var resolve;
                var promise = new Promise(function (res) { resolve = res; });
                var initializerDone = false;
                setTimeout(function () {
                    resolve(true);
                    initializerDone = true;
                }, 1);
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return promise; }, multi: true }]));
                defaultPlatform.bootstrapModuleFactory(moduleFactory).then(function (_) {
                    matchers_1.expect(initializerDone).toBe(true);
                });
            }));
            it('should rethrow sync errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { throw 'Test'; }, multi: true }]));
                matchers_1.expect(function () { return defaultPlatform.bootstrapModuleFactory(moduleFactory); }).toThrow('Test');
                // Error rethrown will be seen by the exception handler since it's after
                // construction.
                matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
            }));
            it('should rethrow promise errors even if the exceptionHandler is not rethrowing', testing_1.async(function () {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(createModule([{ provide: core_1.APP_INITIALIZER, useValue: function () { return Promise.reject('Test'); }, multi: true }]));
                defaultPlatform.bootstrapModuleFactory(moduleFactory)
                    .then(function () { return matchers_1.expect(false).toBe(true); }, function (e) {
                    matchers_1.expect(e).toBe('Test');
                    matchers_1.expect(mockConsole.res[0].join('#')).toEqual('ERROR#Test');
                });
            }));
        });
        describe('attachView / detachView', function () {
            var MyComp = (function () {
                function MyComp() {
                    this.name = 'Initial';
                }
                return MyComp;
            }());
            MyComp = __decorate([
                core_1.Component({ template: '{{name}}' })
            ], MyComp);
            var ContainerComp = (function () {
                function ContainerComp() {
                }
                return ContainerComp;
            }());
            __decorate([
                core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
                __metadata("design:type", core_1.ViewContainerRef)
            ], ContainerComp.prototype, "vc", void 0);
            ContainerComp = __decorate([
                core_1.Component({ template: '<ng-container #vc></ng-container>' })
            ], ContainerComp);
            var EmbeddedViewComp = (function () {
                function EmbeddedViewComp() {
                }
                return EmbeddedViewComp;
            }());
            __decorate([
                core_1.ViewChild(core_1.TemplateRef),
                __metadata("design:type", core_1.TemplateRef)
            ], EmbeddedViewComp.prototype, "tplRef", void 0);
            EmbeddedViewComp = __decorate([
                core_1.Component({ template: '<ng-template #t>Dynamic content</ng-template>' })
            ], EmbeddedViewComp);
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, ContainerComp, EmbeddedViewComp],
                    providers: [{ provide: testing_1.ComponentFixtureNoNgZone, useValue: true }]
                });
            });
            it('should dirty check attached views', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                matchers_1.expect(appRef.viewCount).toBe(0);
                appRef.tick();
                matchers_1.expect(comp.nativeElement).toHaveText('');
                appRef.attachView(comp.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(appRef.viewCount).toBe(1);
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
            });
            it('should not dirty check detached views', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(comp.componentRef.hostView);
                appRef.tick();
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
                appRef.detachView(comp.componentRef.hostView);
                comp.componentInstance.name = 'New';
                appRef.tick();
                matchers_1.expect(appRef.viewCount).toBe(0);
                matchers_1.expect(comp.nativeElement).toHaveText('Initial');
            });
            it('should detach attached views if they are destroyed', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                appRef.attachView(comp.componentRef.hostView);
                comp.destroy();
                matchers_1.expect(appRef.viewCount).toBe(0);
            });
            it('should detach attached embedded views if they are destroyed', function () {
                var comp = testing_1.TestBed.createComponent(EmbeddedViewComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                var embeddedViewRef = comp.componentInstance.tplRef.createEmbeddedView({});
                appRef.attachView(embeddedViewRef);
                embeddedViewRef.destroy();
                matchers_1.expect(appRef.viewCount).toBe(0);
            });
            it('should not allow to attach a view to both, a view container and the ApplicationRef', function () {
                var comp = testing_1.TestBed.createComponent(MyComp);
                var hostView = comp.componentRef.hostView;
                var containerComp = testing_1.TestBed.createComponent(ContainerComp);
                containerComp.detectChanges();
                var vc = containerComp.componentInstance.vc;
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                vc.insert(hostView);
                matchers_1.expect(function () { return appRef.attachView(hostView); })
                    .toThrowError('This view is already attached to a ViewContainer!');
                hostView = vc.detach(0);
                appRef.attachView(hostView);
                matchers_1.expect(function () { return vc.insert(hostView); })
                    .toThrowError('This view is already attached directly to the ApplicationRef!');
            });
        });
    });
    describe('AppRef', function () {
        var SyncComp = (function () {
            function SyncComp() {
                this.text = '1';
            }
            return SyncComp;
        }());
        SyncComp = __decorate([
            core_1.Component({ selector: 'sync-comp', template: "<span>{{text}}</span>" })
        ], SyncComp);
        var ClickComp = (function () {
            function ClickComp() {
                this.text = '1';
            }
            ClickComp.prototype.onClick = function () { this.text += '1'; };
            return ClickComp;
        }());
        ClickComp = __decorate([
            core_1.Component({ selector: 'click-comp', template: "<span (click)=\"onClick()\">{{text}}</span>" })
        ], ClickComp);
        var MicroTaskComp = (function () {
            function MicroTaskComp() {
                this.text = '1';
            }
            MicroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                Promise.resolve(null).then(function (_) { _this.text += '1'; });
            };
            return MicroTaskComp;
        }());
        MicroTaskComp = __decorate([
            core_1.Component({ selector: 'micro-task-comp', template: "<span>{{text}}</span>" })
        ], MicroTaskComp);
        var MacroTaskComp = (function () {
            function MacroTaskComp() {
                this.text = '1';
            }
            MacroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                setTimeout(function () { _this.text += '1'; }, 10);
            };
            return MacroTaskComp;
        }());
        MacroTaskComp = __decorate([
            core_1.Component({ selector: 'macro-task-comp', template: "<span>{{text}}</span>" })
        ], MacroTaskComp);
        var MicroMacroTaskComp = (function () {
            function MicroMacroTaskComp() {
                this.text = '1';
            }
            MicroMacroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                Promise.resolve(null).then(function (_) {
                    _this.text += '1';
                    setTimeout(function () { _this.text += '1'; }, 10);
                });
            };
            return MicroMacroTaskComp;
        }());
        MicroMacroTaskComp = __decorate([
            core_1.Component({ selector: 'micro-macro-task-comp', template: "<span>{{text}}</span>" })
        ], MicroMacroTaskComp);
        var MacroMicroTaskComp = (function () {
            function MacroMicroTaskComp() {
                this.text = '1';
            }
            MacroMicroTaskComp.prototype.ngOnInit = function () {
                var _this = this;
                setTimeout(function () {
                    _this.text += '1';
                    Promise.resolve(null).then(function (_) { _this.text += '1'; });
                }, 10);
            };
            return MacroMicroTaskComp;
        }());
        MacroMicroTaskComp = __decorate([
            core_1.Component({ selector: 'macro-micro-task-comp', template: "<span>{{text}}</span>" })
        ], MacroMicroTaskComp);
        var stableCalled = false;
        beforeEach(function () {
            stableCalled = false;
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    SyncComp, MicroTaskComp, MacroTaskComp, MicroMacroTaskComp, MacroMicroTaskComp, ClickComp
                ],
            });
        });
        afterEach(function () { matchers_1.expect(stableCalled).toBe(true, 'isStable did not emit true on stable'); });
        function expectStableTexts(component, expected) {
            var fixture = testing_1.TestBed.createComponent(component);
            var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
            var zone = testing_1.TestBed.get(core_1.NgZone);
            appRef.attachView(fixture.componentRef.hostView);
            zone.run(function () { return appRef.tick(); });
            var i = 0;
            appRef.isStable.subscribe({
                next: function (stable) {
                    if (stable) {
                        matchers_1.expect(i).toBeLessThan(expected.length);
                        matchers_1.expect(fixture.nativeElement).toHaveText(expected[i++]);
                        stableCalled = true;
                    }
                }
            });
        }
        it('isStable should fire on synchronous component loading', testing_1.async(function () { expectStableTexts(SyncComp, ['1']); }));
        it('isStable should fire after a microtask on init is completed', testing_1.async(function () { expectStableTexts(MicroTaskComp, ['11']); }));
        it('isStable should fire after a macrotask on init is completed', testing_1.async(function () { expectStableTexts(MacroTaskComp, ['11']); }));
        it('isStable should fire only after chain of micro and macrotasks on init are completed', testing_1.async(function () { expectStableTexts(MicroMacroTaskComp, ['111']); }));
        it('isStable should fire only after chain of macro and microtasks on init are completed', testing_1.async(function () { expectStableTexts(MacroMicroTaskComp, ['111']); }));
        describe('unstable', function () {
            var unstableCalled = false;
            afterEach(function () { matchers_1.expect(unstableCalled).toBe(true, 'isStable did not emit false on unstable'); });
            function expectUnstable(appRef) {
                appRef.isStable.subscribe({
                    next: function (stable) {
                        if (stable) {
                            stableCalled = true;
                        }
                        if (!stable) {
                            unstableCalled = true;
                        }
                    }
                });
            }
            it('should be fired after app becomes unstable', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(ClickComp);
                var appRef = testing_1.TestBed.get(application_ref_1.ApplicationRef);
                var zone = testing_1.TestBed.get(core_1.NgZone);
                appRef.attachView(fixture.componentRef.hostView);
                zone.run(function () { return appRef.tick(); });
                fixture.whenStable().then(function () {
                    expectUnstable(appRef);
                    var element = fixture.debugElement.children[0];
                    browser_util_1.dispatchEvent(element.nativeElement, 'click');
                });
            }));
        });
    });
}
exports.main = main;
var MockConsole = (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Logging from ErrorHandler should run outside of the Angular Zone.
        core_1.NgZone.assertNotInAngularZone();
        this.res.push(args);
    };
    MockConsole.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Logging from ErrorHandler should run outside of the Angular Zone.
        core_1.NgZone.assertNotInAngularZone();
        this.res.push(args);
    };
    return MockConsole;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYXBwbGljYXRpb25fcmVmX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkw7QUFDM0wscUVBQWtGO0FBQ2xGLGlFQUE2RDtBQUc3RCw4REFBd0Q7QUFDeEQsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUN0RSxtRkFBaUY7QUFDakYsMkVBQXNFO0FBQ3RFLDREQUFzRDtBQUV0RCxzQ0FBMEc7QUFHMUcsSUFBTSxhQUFhO0lBQW5CO0lBQ0EsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxhQUFhO0lBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztHQUNwRCxhQUFhLENBQ2xCO0FBRUQ7SUFDRSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLElBQUksV0FBd0IsQ0FBQztRQUU3QixVQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZELHNCQUFzQixRQUEwQjtZQUExQix5QkFBQSxFQUFBLDBCQUEwQjtZQUM5QyxJQUFNLEdBQUcsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBUSxDQUFDLENBQUM7WUFDbEMsSUFBTSxNQUFNLEdBQWdCLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQzNDLG9CQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFJLFFBQVEsV0FBTSxRQUFRLE1BQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFNLFFBQVEsR0FBRyxvQkFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFFB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