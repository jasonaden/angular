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
var async_test_completer_1 = require("./async_test_completer");
var component_fixture_1 = require("./component_fixture");
var test_compiler_1 = require("./test_compiler");
var UNDEFINED = new Object();
/**
 * An abstract class for inserting the root test component element in a platform independent way.
 *
 * @experimental
 */
var TestComponentRenderer = (function () {
    function TestComponentRenderer() {
    }
    TestComponentRenderer.prototype.insertRootElement = function (rootElementId) { };
    return TestComponentRenderer;
}());
exports.TestComponentRenderer = TestComponentRenderer;
var _nextRootElementId = 0;
/**
 * @experimental
 */
exports.ComponentFixtureAutoDetect = new core_1.InjectionToken('ComponentFixtureAutoDetect');
/**
 * @experimental
 */
exports.ComponentFixtureNoNgZone = new core_1.InjectionToken('ComponentFixtureNoNgZone');
/**
 * @whatItDoes Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 * @description
 *
 * TestBed is the primary api for writing unit tests for Angular applications and libraries.
 *
 * @stable
 */
var TestBed = (function () {
    function TestBed() {
        this._instantiated = false;
        this._compiler = null;
        this._moduleRef = null;
        this._moduleFactory = null;
        this._compilerOptions = [];
        this._moduleOverrides = [];
        this._componentOverrides = [];
        this._directiveOverrides = [];
        this._pipeOverrides = [];
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._schemas = [];
        this._activeFixtures = [];
        this._aotSummaries = function () { return []; };
        this.platform = null;
        this.ngModule = null;
    }
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     *
     * @experimental
     */
    TestBed.initTestEnvironment = function (ngModule, platform, aotSummaries) {
        var testBed = getTestBed();
        testBed.initTestEnvironment(ngModule, platform, aotSummaries);
        return testBed;
    };
    /**
     * Reset the providers for the test injector.
     *
     * @experimental
     */
    TestBed.resetTestEnvironment = function () { getTestBed().resetTestEnvironment(); };
    TestBed.resetTestingModule = function () {
        getTestBed().resetTestingModule();
        return TestBed;
    };
    /**
     * Allows overriding default compiler providers and settings
     * which are defined in test_injector.js
     */
    TestBed.configureCompiler = function (config) {
        getTestBed().configureCompiler(config);
        return TestBed;
    };
    /**
     * Allows overriding default providers, directives, pipes, modules of the test injector,
     * which are defined in test_injector.js
     */
    TestBed.configureTestingModule = function (moduleDef) {
        getTestBed().configureTestingModule(moduleDef);
        return TestBed;
    };
    /**
     * Compile components with a `templateUrl` for the test's NgModule.
     * It is necessary to call this function
     * as fetching urls is asynchronous.
     */
    TestBed.compileComponents = function () { return getTestBed().compileComponents(); };
    TestBed.overrideModule = function (ngModule, override) {
        getTestBed().overrideModule(ngModule, override);
        return TestBed;
    };
    TestBed.overrideComponent = function (component, override) {
        getTestBed().overrideComponent(component, override);
        return TestBed;
    };
    TestBed.overrideDirective = function (directive, override) {
        getTestBed().overrideDirective(directive, override);
        return TestBed;
    };
    TestBed.overridePipe = function (pipe, override) {
        getTestBed().overridePipe(pipe, override);
        return TestBed;
    };
    TestBed.overrideTemplate = function (component, template) {
        getTestBed().overrideComponent(component, { set: { template: template, templateUrl: null } });
        return TestBed;
    };
    TestBed.overrideProvider = function (token, provider) {
        getTestBed().overrideProvider(token, provider);
        return TestBed;
    };
    TestBed.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = core_1.Injector.THROW_IF_NOT_FOUND; }
        return getTestBed().get(token, notFoundValue);
    };
    TestBed.createComponent = function (component) {
        return getTestBed().createComponent(component);
    };
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     *
     * @experimental
     */
    TestBed.prototype.initTestEnvironment = function (ngModule, platform, aotSummaries) {
        if (this.platform || this.ngModule) {
            throw new Error('Cannot set base providers because it has already been called');
        }
        this.platform = platform;
        this.ngModule = ngModule;
        if (aotSummaries) {
            this._aotSummaries = aotSummaries;
        }
    };
    /**
     * Reset the providers for the test injector.
     *
     * @experimental
     */
    TestBed.prototype.resetTestEnvironment = function () {
        this.resetTestingModule();
        this.platform = null;
        this.ngModule = null;
        this._aotSummaries = function () { return []; };
    };
    TestBed.prototype.resetTestingModule = function () {
        core_1.ɵclearProviderOverrides();
        this._compiler = null;
        this._moduleOverrides = [];
        this._componentOverrides = [];
        this._directiveOverrides = [];
        this._pipeOverrides = [];
        this._moduleRef = null;
        this._moduleFactory = null;
        this._compilerOptions = [];
        this._providers = [];
        this._declarations = [];
        this._imports = [];
        this._schemas = [];
        this._instantiated = false;
        this._activeFixtures.forEach(function (fixture) {
            try {
                fixture.destroy();
            }
            catch (e) {
                console.error('Error during cleanup of component', fixture.componentInstance);
            }
        });
        this._activeFixtures = [];
    };
    TestBed.prototype.configureCompiler = function (config) {
        this._assertNotInstantiated('TestBed.configureCompiler', 'configure the compiler');
        this._compilerOptions.push(config);
    };
    TestBed.prototype.configureTestingModule = function (moduleDef) {
        this._assertNotInstantiated('TestBed.configureTestingModule', 'configure the test module');
        if (moduleDef.providers) {
            (_a = this._providers).push.apply(_a, moduleDef.providers);
        }
        if (moduleDef.declarations) {
            (_b = this._declarations).push.apply(_b, moduleDef.declarations);
        }
        if (moduleDef.imports) {
            (_c = this._imports).push.apply(_c, moduleDef.imports);
        }
        if (moduleDef.schemas) {
            (_d = this._schemas).push.apply(_d, moduleDef.schemas);
        }
        var _a, _b, _c, _d;
    };
    TestBed.prototype.compileComponents = function () {
        var _this = this;
        if (this._moduleFactory || this._instantiated) {
            return Promise.resolve(null);
        }
        var moduleType = this._createCompilerAndModule();
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType)
            .then(function (moduleAndComponentFactories) {
            _this._moduleFactory = moduleAndComponentFactories.ngModuleFactory;
        });
    };
    TestBed.prototype._initIfNeeded = function () {
        if (this._instantiated) {
            return;
        }
        if (!this._moduleFactory) {
            try {
                var moduleType = this._createCompilerAndModule();
                this._moduleFactory =
                    this._compiler.compileModuleAndAllComponentsSync(moduleType).ngModuleFactory;
            }
            catch (e) {
                if (getComponentType(e)) {
                    throw new Error("This test module uses the component " + core_1.ɵstringify(getComponentType(e)) + " which is using a \"templateUrl\" or \"styleUrls\", but they were never compiled. " +
                        "Please call \"TestBed.compileComponents\" before your test.");
                }
                else {
                    throw e;
                }
            }
        }
        var ngZone = new core_1.NgZone({ enableLongStackTrace: true });
        var ngZoneInjector = core_1.Injector.create([{ provide: core_1.NgZone, useValue: ngZone }], this.platform.injector);
        this._moduleRef = this._moduleFactory.create(ngZoneInjector);
        // ApplicationInitStatus.runInitializers() is marked @internal to core. So casting to any
        // before accessing it.
        this._moduleRef.injector.get(core_1.ApplicationInitStatus).runInitializers();
        this._instantiated = true;
    };
    TestBed.prototype._createCompilerAndModule = function () {
        var _this = this;
        var providers = this._providers.concat([{ provide: TestBed, useValue: this }]);
        var declarations = this._declarations;
        var imports = [this.ngModule, this._imports];
        var schemas = this._schemas;
        var DynamicTestModule = (function () {
            function DynamicTestModule() {
            }
            return DynamicTestModule;
        }());
        DynamicTestModule = __decorate([
            core_1.NgModule({ providers: providers, declarations: declarations, imports: imports, schemas: schemas })
        ], DynamicTestModule);
        var compilerFactory = this.platform.injector.get(test_compiler_1.TestingCompilerFactory);
        this._compiler =
            compilerFactory.createTestingCompiler(this._compilerOptions.concat([{ useDebug: true }]));
        this._compiler.loadAotSummaries(this._aotSummaries);
        this._moduleOverrides.forEach(function (entry) { return _this._compiler.overrideModule(entry[0], entry[1]); });
        this._componentOverrides.forEach(function (entry) { return _this._compiler.overrideComponent(entry[0], entry[1]); });
        this._directiveOverrides.forEach(function (entry) { return _this._compiler.overrideDirective(entry[0], entry[1]); });
        this._pipeOverrides.forEach(function (entry) { return _this._compiler.overridePipe(entry[0], entry[1]); });
        return DynamicTestModule;
    };
    TestBed.prototype._assertNotInstantiated = function (methodName, methodDescription) {
        if (this._instantiated) {
            throw new Error("Cannot " + methodDescription + " when the test module has already been instantiated. " +
                ("Make sure you are not using `inject` before `" + methodName + "`."));
        }
    };
    TestBed.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = core_1.Injector.THROW_IF_NOT_FOUND; }
        this._initIfNeeded();
        if (token === TestBed) {
            return this;
        }
        // Tests can inject things from the ng module and from the compiler,
        // but the ng module can't inject things from the compiler and vice versa.
        var result = this._moduleRef.injector.get(token, UNDEFINED);
        return result === UNDEFINED ? this._compiler.injector.get(token, notFoundValue) : result;
    };
    TestBed.prototype.execute = function (tokens, fn, context) {
        var _this = this;
        this._initIfNeeded();
        var params = tokens.map(function (t) { return _this.get(t); });
        return fn.apply(context, params);
    };
    TestBed.prototype.overrideModule = function (ngModule, override) {
        this._assertNotInstantiated('overrideModule', 'override module metadata');
        this._moduleOverrides.push([ngModule, override]);
    };
    TestBed.prototype.overrideComponent = function (component, override) {
        this._assertNotInstantiated('overrideComponent', 'override component metadata');
        this._componentOverrides.push([component, override]);
    };
    TestBed.prototype.overrideDirective = function (directive, override) {
        this._assertNotInstantiated('overrideDirective', 'override directive metadata');
        this._directiveOverrides.push([directive, override]);
    };
    TestBed.prototype.overridePipe = function (pipe, override) {
        this._assertNotInstantiated('overridePipe', 'override pipe metadata');
        this._pipeOverrides.push([pipe, override]);
    };
    TestBed.prototype.overrideProvider = function (token, provider) {
        var flags = 0;
        var value;
        if (provider.useFactory) {
            flags |= 1024 /* TypeFactoryProvider */;
            value = provider.useFactory;
        }
        else {
            flags |= 256 /* TypeValueProvider */;
            value = provider.useValue;
        }
        var deps = (provider.deps || []).map(function (dep) {
            var depFlags = 0 /* None */;
            var depToken;
            if (Array.isArray(dep)) {
                dep.forEach(function (entry) {
                    if (entry instanceof core_1.Optional) {
                        depFlags |= 2 /* Optional */;
                    }
                    else if (entry instanceof core_1.SkipSelf) {
                        depFlags |= 1 /* SkipSelf */;
                    }
                    else {
                        depToken = entry;
                    }
                });
            }
            else {
                depToken = dep;
            }
            return [depFlags, depToken];
        });
        core_1.ɵoverrideProvider({ token: token, flags: flags, deps: deps, value: value });
    };
    TestBed.prototype.createComponent = function (component) {
        var _this = this;
        this._initIfNeeded();
        var componentFactory = this._compiler.getComponentFactory(component);
        if (!componentFactory) {
            throw new Error("Cannot create the component " + core_1.ɵstringify(component) + " as it was not imported into the testing module!");
        }
        var noNgZone = this.get(exports.ComponentFixtureNoNgZone, false);
        var autoDetect = this.get(exports.ComponentFixtureAutoDetect, false);
        var ngZone = noNgZone ? null : this.get(core_1.NgZone, null);
        var testComponentRenderer = this.get(TestComponentRenderer);
        var rootElId = "root" + _nextRootElementId++;
        testComponentRenderer.insertRootElement(rootElId);
        var initComponent = function () {
            var componentRef = componentFactory.create(core_1.Injector.NULL, [], "#" + rootElId, _this._moduleRef);
            return new component_fixture_1.ComponentFixture(componentRef, ngZone, autoDetect);
        };
        var fixture = !ngZone ? initComponent() : ngZone.run(initComponent);
        this._activeFixtures.push(fixture);
        return fixture;
    };
    return TestBed;
}());
exports.TestBed = TestBed;
var _testBed = null;
/**
 * @experimental
 */
function getTestBed() {
    return _testBed = _testBed || new TestBed();
}
exports.getTestBed = getTestBed;
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @stable
 */
function inject(tokens, fn) {
    var testBed = getTestBed();
    if (tokens.indexOf(async_test_completer_1.AsyncTestCompleter) >= 0) {
        // Not using an arrow function to preserve context passed from call site
        return function () {
            var _this = this;
            // Return an async test method that returns a Promise if AsyncTestCompleter is one of
            // the injected tokens.
            return testBed.compileComponents().then(function () {
                var completer = testBed.get(async_test_completer_1.AsyncTestCompleter);
                testBed.execute(tokens, fn, _this);
                return completer.promise;
            });
        };
    }
    else {
        // Not using an arrow function to preserve context passed from call site
        return function () { return testBed.execute(tokens, fn, this); };
    }
}
exports.inject = inject;
/**
 * @experimental
 */
var InjectSetupWrapper = (function () {
    function InjectSetupWrapper(_moduleDef) {
        this._moduleDef = _moduleDef;
    }
    InjectSetupWrapper.prototype._addModule = function () {
        var moduleDef = this._moduleDef();
        if (moduleDef) {
            getTestBed().configureTestingModule(moduleDef);
        }
    };
    InjectSetupWrapper.prototype.inject = function (tokens, fn) {
        var self = this;
        // Not using an arrow function to preserve context passed from call site
        return function () {
            self._addModule();
            return inject(tokens, fn).call(this);
        };
    };
    return InjectSetupWrapper;
}());
exports.InjectSetupWrapper = InjectSetupWrapper;
function withModule(moduleDef, fn) {
    if (fn) {
        // Not using an arrow function to preserve context passed from call site
        return function () {
            var testBed = getTestBed();
            if (moduleDef) {
                testBed.configureTestingModule(moduleDef);
            }
            return fn.apply(this);
        };
    }
    return new InjectSetupWrapper(function () { return moduleDef; });
}
exports.withModule = withModule;
function getComponentType(error) {
    return error[core_1.ɵERROR_COMPONENT_TYPE];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL3Rlc3RfYmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQW9jO0FBRXBjLCtEQUEwRDtBQUMxRCx5REFBcUQ7QUFFckQsaURBQXdFO0FBRXhFLElBQU0sU0FBUyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFFL0I7Ozs7R0FJRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBREMsaURBQWlCLEdBQWpCLFVBQWtCLGFBQXFCLElBQUcsQ0FBQztJQUM3Qyw0QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksc0RBQXFCO0FBSWxDLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0FBRTNCOztHQUVHO0FBQ1UsUUFBQSwwQkFBMEIsR0FDbkMsSUFBSSxxQkFBYyxDQUFZLDRCQUE0QixDQUFDLENBQUM7QUFFaEU7O0dBRUc7QUFDVSxRQUFBLHdCQUF3QixHQUFHLElBQUkscUJBQWMsQ0FBWSwwQkFBMEIsQ0FBQyxDQUFDO0FBWWxHOzs7Ozs7OztHQVFHO0FBQ0g7SUFBQTtRQStHVSxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUUvQixjQUFTLEdBQW9CLElBQU0sQ0FBQztRQUNwQyxlQUFVLEdBQXFCLElBQU0sQ0FBQztRQUN0QyxtQkFBYyxHQUF5QixJQUFNLENBQUM7UUFFOUMscUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztRQUV6QyxxQkFBZ0IsR0FBOEMsRUFBRSxDQUFDO1FBQ2pFLHdCQUFtQixHQUErQyxFQUFFLENBQUM7UUFDckUsd0JBQW1CLEdBQStDLEVBQUUsQ0FBQztRQUNyRSxtQkFBYyxHQUEwQyxFQUFFLENBQUM7UUFFM0QsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQUM1QixrQkFBYSxHQUErQixFQUFFLENBQUM7UUFDL0MsYUFBUSxHQUErQixFQUFF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