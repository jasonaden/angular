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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var application_ref_1 = require("@angular/core/src/application_ref");
var console_1 = require("@angular/core/src/console");
var testability_1 = require("@angular/core/src/testability/testability");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var NonExistentComp = (function () {
    function NonExistentComp() {
    }
    return NonExistentComp;
}());
NonExistentComp = __decorate([
    core_1.Component({ selector: 'non-existent', template: '' })
], NonExistentComp);
var HelloRootCmp = (function () {
    function HelloRootCmp() {
        this.greeting = 'hello';
    }
    return HelloRootCmp;
}());
HelloRootCmp = __decorate([
    core_1.Component({ selector: 'hello-app', template: '{{greeting}} world!' }),
    __metadata("design:paramtypes", [])
], HelloRootCmp);
var HelloRootCmpContent = (function () {
    function HelloRootCmpContent() {
    }
    return HelloRootCmpContent;
}());
HelloRootCmpContent = __decorate([
    core_1.Component({ selector: 'hello-app', template: 'before: <ng-content></ng-content> after: done' }),
    __metadata("design:paramtypes", [])
], HelloRootCmpContent);
var HelloRootCmp2 = (function () {
    function HelloRootCmp2() {
        this.greeting = 'hello';
    }
    return HelloRootCmp2;
}());
HelloRootCmp2 = __decorate([
    core_1.Component({ selector: 'hello-app-2', template: '{{greeting}} world, again!' }),
    __metadata("design:paramtypes", [])
], HelloRootCmp2);
var HelloRootCmp3 = (function () {
    function HelloRootCmp3(appBinding /** TODO #9100 */) {
        this.appBinding = appBinding;
    }
    return HelloRootCmp3;
}());
HelloRootCmp3 = __decorate([
    core_1.Component({ selector: 'hello-app', template: '' }),
    __param(0, core_1.Inject('appBinding')),
    __metadata("design:paramtypes", [Object])
], HelloRootCmp3);
var HelloRootCmp4 = (function () {
    function HelloRootCmp4(appRef) {
        this.appRef = appRef;
    }
    return HelloRootCmp4;
}());
HelloRootCmp4 = __decorate([
    core_1.Component({ selector: 'hello-app', template: '' }),
    __param(0, core_1.Inject(application_ref_1.ApplicationRef)),
    __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
], HelloRootCmp4);
var HelloRootMissingTemplate = (function () {
    function HelloRootMissingTemplate() {
    }
    return HelloRootMissingTemplate;
}());
HelloRootMissingTemplate = __decorate([
    core_1.Component({ selector: 'hello-app' })
], HelloRootMissingTemplate);
var HelloRootDirectiveIsNotCmp = (function () {
    function HelloRootDirectiveIsNotCmp() {
    }
    return HelloRootDirectiveIsNotCmp;
}());
HelloRootDirectiveIsNotCmp = __decorate([
    core_1.Directive({ selector: 'hello-app' })
], HelloRootDirectiveIsNotCmp);
var HelloOnDestroyTickCmp = (function () {
    function HelloOnDestroyTickCmp(appRef) {
        this.appRef = appRef;
    }
    HelloOnDestroyTickCmp.prototype.ngOnDestroy = function () { this.appRef.tick(); };
    return HelloOnDestroyTickCmp;
}());
HelloOnDestroyTickCmp = __decorate([
    core_1.Component({ selector: 'hello-app', template: '' }),
    __param(0, core_1.Inject(application_ref_1.ApplicationRef)),
    __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
], HelloOnDestroyTickCmp);
var HelloUrlCmp = (function () {
    function HelloUrlCmp() {
        this.greeting = 'hello';
    }
    return HelloUrlCmp;
}());
HelloUrlCmp = __decorate([
    core_1.Component({ selector: 'hello-app', templateUrl: './sometemplate.html' })
], HelloUrlCmp);
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
var HelloCmpUsingPlatformDirectiveAndPipe = (function () {
    function HelloCmpUsingPlatformDirectiveAndPipe() {
        this.show = false;
    }
    return HelloCmpUsingPlatformDirectiveAndPipe;
}());
HelloCmpUsingPlatformDirectiveAndPipe = __decorate([
    core_1.Component({ selector: 'hello-app', template: "<div  [someDir]=\"'someValue' | somePipe\"></div>" })
], HelloCmpUsingPlatformDirectiveAndPipe);
var HelloCmpUsingCustomElement = (function () {
    function HelloCmpUsingCustomElement() {
    }
    return HelloCmpUsingCustomElement;
}());
HelloCmpUsingCustomElement = __decorate([
    core_1.Component({ selector: 'hello-app', template: '<some-el [someProp]="true">hello world!</some-el>' })
], HelloCmpUsingCustomElement);
var MockConsole = (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.error = function () {
        var s = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            s[_i] = arguments[_i];
        }
        this.res.push(s);
    };
    return MockConsole;
}());
var DummyConsole = (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
var TestModule = (function () {
    function TestModule() {
    }
    return TestModule;
}());
function bootstrap(cmpType, providers, platformProviders) {
    if (providers === void 0) { providers = []; }
    if (platformProviders === void 0) { platformProviders = []; }
    var TestModule = (function () {
        function TestModule() {
        }
        return TestModule;
    }());
    TestModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [cmpType],
            bootstrap: [cmpType],
            providers: providers,
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        })
    ], TestModule);
    return platform_browser_dynamic_1.platformBrowserDynamic(platformProviders).bootstrapModule(TestModule);
}
function main() {
    var el /** TODO #9100 */, el2 /** TODO #9100 */, testProviders, lightDom /** TODO #9100 */;
    testing_internal_1.describe('bootstrap factory method', function () {
        var compilerConsole;
        testing_internal_1.beforeEachProviders(function () { return [testing_internal_1.Log]; });
        testing_internal_1.beforeEach(testing_internal_1.inject([dom_tokens_1.DOCUMENT], function (doc) {
            application_ref_1.destroyPlatform();
            compilerConsole = new DummyConsole();
            testProviders = [{ provide: console_1.Console, useValue: compilerConsole }];
            var oldRoots = dom_adapter_1.getDOM().querySelectorAll(doc, 'hello-app,hello-app-2,light-dom-el');
            for (var i = 0; i < oldRoots.length; i++) {
                dom_adapter_1.getDOM().remove(oldRoots[i]);
            }
            el = dom_adapter_1.getDOM().createElement('hello-app', doc);
            el2 = dom_adapter_1.getDOM().createElement('hello-app-2', doc);
            lightDom = dom_adapter_1.getDOM().createElement('light-dom-el', doc);
            dom_adapter_1.getDOM().appendChild(doc.body, el);
            dom_adapter_1.getDOM().appendChild(doc.body, el2);
            dom_adapter_1.getDOM().appendChild(el, lightDom);
            dom_adapter_1.getDOM().setText(lightDom, 'loading');
        }));
        testing_internal_1.afterEach(application_ref_1.destroyPlatform);
        testing_internal_1.it('should throw if bootstrapped Directive is not a Component', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (done) {
            var logger = new MockConsole();
            var errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
            matchers_1.expect(function () { return bootstrap(HelloRootDirectiveIsNotCmp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]); })
                .toThrowError("HelloRootDirectiveIsNotCmp cannot be used as an entry component.");
            done.done();
        }));
        testing_internal_1.it('should throw if no element is found', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var logger = new MockConsole();
            var errorHandler = new core_1.ErrorHandler();
            errorHandler._console = logger;
            bootstrap(NonExistentComp, [
                { provide: core_1.ErrorHandler, useValue: errorHandler }
            ]).then(null, function (reason) {
                matchers_1.expect(reason.message)
                    .toContain('The selector "non-existent" did not match any elements');
                async.done();
                return null;
            });
        }));
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.it('should forward the error to promise when bootstrap fails', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var logger = new MockConsole();
                var errorHandler = new core_1.ErrorHandler();
                errorHandler._console = logger;
                var refPromise = bootstrap(NonExistentComp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]);
                refPromise.then(null, function (reason) {
                    matchers_1.expect(reason.message)
                        .toContain('The selector "non-existent" did not match any elements');
                    async.done();
                });
            }));
            testing_internal_1.it('should invoke the default exception handler when bootstrap fails', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var logger = new MockConsole();
                var errorHandler = new core_1.ErrorHandler();
                errorHandler._console = logger;
                var refPromise = bootstrap(NonExistentComp, [{ provide: core_1.ErrorHandler, useValue: errorHandler }]);
                refPromise.then(null, function (reason) {
                    matchers_1.expect(logger.res[0].join('#'))
                        .toContain('ERROR#Error: The selector "non-existent" did not match any elements');
                    async.done();
                    return null;
                });
            }));
        }
        testing_internal_1.it('should create an injector promise', function () {
            var refPromise = bootstrap(HelloRootCmp, testProviders);
            matchers_1.expect(refPromise).not.toBe(null);
        });
        testing_internal_1.it('should set platform name to browser', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, testProviders);
            refPromise.then(function (ref) {
                matchers_1.expect(common_1.isPlatformBrowser(ref.injector.get(core_1.PLATFORM_ID))).toBe(true);
                async.done();
            });
        }));
        testing_internal_1.it('should display hello world', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, testProviders);
            refPromise.then(function (ref) {
                matchers_1.expect(el).toHaveText('hello world!');
                matchers_1.expect(el.getAttribute('ng-version')).toEqual(core_1.VERSION.full);
                async.done();
            });
        }));
        testing_internal_1.it('should throw a descriptive error if BrowserModule is installed again via a lazily loaded module', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var AsyncModule = (function () {
                function AsyncModule() {
                }
                return AsyncModule;
            }());
            AsyncModule = __decorate([
                core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
            ], AsyncModule);
            bootstrap(HelloRootCmp, testProviders)
                .then(function (ref) {
                var compiler = ref.injector.get(core_1.Compiler);
                return compiler.compileModuleAsync(AsyncModule).then(function (factory) {
                    matchers_1.expect(function () { return factory.create(ref.injector); })
                        .toThrowError("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
                });
            })
                .then(function () { return async.done(); }, function (err) { return async.fail(err); });
        }));
        testing_internal_1.it('should support multiple calls to bootstrap', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise1 = bootstrap(HelloRootCmp, testProviders);
            var refPromise2 = bootstrap(HelloRootCmp2, testProviders);
            Promise.all([refPromise1, refPromise2]).then(function (refs) {
                matchers_1.expect(el).toHaveText('hello world!');
                matchers_1.expect(el2).toHaveText('hello world, again!');
                async.done();
            });
        }));
        testing_internal_1.it('should not crash if change detection is invoked when the root component is disposed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloOnDestroyTickCmp, testProviders).then(function (ref) {
                matchers_1.expect(function () { return ref.destroy(); }).not.toThrow();
                async.done();
            });
        }));
        testing_internal_1.it('should unregister change detectors when components are disposed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloRootCmp, testProviders).then(function (ref) {
                var appRef = ref.injector.get(application_ref_1.ApplicationRef);
                ref.destroy();
                matchers_1.expect(function () { return appRef.tick(); }).not.toThrow();
                async.done();
            });
        }));
        testing_internal_1.it('should make the provided bindings available to the application component', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp3, [testProviders, { provide: 'appBinding', useValue: 'BoundValue' }]);
            refPromise.then(function (ref) {
                matchers_1.expect(ref.injector.get('appBinding')).toEqual('BoundValue');
                async.done();
            });
        }));
        testing_internal_1.it('should not override locale provided during bootstrap', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp, [testProviders], [{ provide: core_1.LOCALE_ID, useValue: 'fr-FR' }]);
            refPromise.then(function (ref) {
                matchers_1.expect(ref.injector.get(core_1.LOCALE_ID)).toEqual('fr-FR');
                async.done();
            });
        }));
        testing_internal_1.it('should avoid cyclic dependencies when root component requires Lifecycle through DI', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise = bootstrap(HelloRootCmp4, testProviders);
            refPromise.then(function (ref) {
                var appRef = ref.injector.get(application_ref_1.ApplicationRef);
                matchers_1.expect(appRef).toBeDefined();
                async.done();
            });
        }));
        testing_internal_1.it('should run platform initializers', testing_internal_1.inject([testing_internal_1.Log, testing_internal_1.AsyncTestCompleter], function (log, async) {
            var p = core_1.createPlatformFactory(platform_browser_dynamic_1.platformBrowserDynamic, 'someName', [
                { provide: core_1.PLATFORM_INITIALIZER, useValue: log.fn('platform_init1'), multi: true },
                { provide: core_1.PLATFORM_INITIALIZER, useValue: log.fn('platform_init2'), multi: true }
            ])();
            var SomeModule = (function () {
                function SomeModule() {
                }
                SomeModule.prototype.ngDoBootstrap = function () { };
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule],
                    providers: [
                        { provide: core_1.APP_INITIALIZER, useValue: log.fn('app_init1'), multi: true },
                        { provide: core_1.APP_INITIALIZER, useValue: log.fn('app_init2'), multi: true }
                    ]
                })
            ], SomeModule);
            matchers_1.expect(log.result()).toEqual('platform_init1; platform_init2');
            log.clear();
            p.bootstrapModule(SomeModule).then(function () {
                matchers_1.expect(log.result()).toEqual('app_init1; app_init2');
                async.done();
            });
        }));
        testing_internal_1.it('should remove styles when transitioning from a server render', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var RootCmp = (function () {
                function RootCmp() {
                }
                return RootCmp;
            }());
            RootCmp = __decorate([
                core_1.Component({
                    selector: 'root',
                    template: 'root',
                })
            ], RootCmp);
            var TestModule = (function () {
                function TestModule() {
                }
                return TestModule;
            }());
            TestModule = __decorate([
                core_1.NgModule({
                    bootstrap: [RootCmp],
                    declarations: [RootCmp],
                    imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'my-app' })],
                })
            ], TestModule);
            // First, set up styles to be removed.
            var dom = dom_adapter_1.getDOM();
            var platform = platform_browser_dynamic_1.platformBrowserDynamic();
            var document = platform.injector.get(dom_tokens_1.DOCUMENT);
            var style = dom.createElement('style', document);
            dom.setAttribute(style, 'ng-transition', 'my-app');
            dom.appendChild(document.head, style);
            var root = dom.createElement('root', document);
            dom.appendChild(document.body, root);
            platform.bootstrapModule(TestModule).then(function () {
                var styles = Array.prototype.slice.apply(dom.getElementsByTagName(document, 'style') || []);
                styles.forEach(function (style) { matchers_1.expect(dom.getAttribute(style, 'ng-transition')).not.toBe('my-app'); });
                async.done();
            });
        }));
        testing_internal_1.it('should register each application with the testability registry', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var refPromise1 = bootstrap(HelloRootCmp, testProviders);
            var refPromise2 = bootstrap(HelloRootCmp2, testProviders);
            Promise.all([refPromise1, refPromise2]).then(function (refs) {
                var registry = refs[0].injector.get(testability_1.TestabilityRegistry);
                var testabilities = [refs[0].injector.get(testability_1.Testability), refs[1].injector.get(testability_1.Testability)];
                Promise.all(testabilities).then(function (testabilities) {
                    matchers_1.expect(registry.findTestabilityInTree(el)).toEqual(testabilities[0]);
                    matchers_1.expect(registry.findTestabilityInTree(el2)).toEqual(testabilities[1]);
                    async.done();
                });
            });
        }));
        testing_internal_1.it('should allow to pass schemas', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            bootstrap(HelloCmpUsingCustomElement, testProviders).then(function (compRef) {
                matchers_1.expect(el).toHaveText('hello world!');
                async.done();
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYnJvd3Nlci9ib290c3RyYXBfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILDBDQUFrRDtBQUNsRCxzQ0FBK1I7QUFDL1IscUVBQWtGO0FBQ2xGLHFEQUFrRDtBQUVsRCx5RUFBMkY7QUFDM0YsK0VBQXFLO0FBQ3JLLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUN0RSwyRUFBc0U7QUFHdEUsSUFBTSxlQUFlO0lBQXJCO0lBQ0EsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxlQUFlO0lBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztHQUM5QyxlQUFlLENBQ3BCO0FBR0QsSUFBTSxZQUFZO0lBRWhCO1FBQWdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQUMsQ0FBQztJQUM1QyxtQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSEssWUFBWTtJQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUMsQ0FBQzs7R0FDOUQsWUFBWSxDQUdqQjtBQUdELElBQU0sbUJBQW1CO0lBQ3ZCO0lBQWUsQ0FBQztJQUNsQiwwQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssbUJBQW1CO0lBRHhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSwrQ0FBK0MsRUFBQyxDQUFDOztHQUN4RixtQkFBbUIsQ0FFeEI7QUFHRCxJQUFNLGFBQWE7SUFFakI7UUFBZ0IsSUFBSSxDQUFDLFFBQVEs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