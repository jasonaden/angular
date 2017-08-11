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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */
__export(require("./schema_registry_mock"));
__export(require("./directive_resolver_mock"));
__export(require("./ng_module_resolver_mock"));
__export(require("./pipe_resolver_mock"));
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var compiler_1 = require("@angular/compiler");
var directive_resolver_mock_1 = require("./directive_resolver_mock");
var ng_module_resolver_mock_1 = require("./ng_module_resolver_mock");
var pipe_resolver_mock_1 = require("./pipe_resolver_mock");
var metadata_overrider_1 = require("./metadata_overrider");
var TestingCompilerFactoryImpl = (function () {
    function TestingCompilerFactoryImpl(_compilerFactory) {
        this._compilerFactory = _compilerFactory;
    }
    TestingCompilerFactoryImpl.prototype.createTestingCompiler = function (options) {
        var compiler = this._compilerFactory.createCompiler(options);
        return new TestingCompilerImpl(compiler, compiler.injector.get(directive_resolver_mock_1.MockDirectiveResolver), compiler.injector.get(pipe_resolver_mock_1.MockPipeResolver), compiler.injector.get(ng_module_resolver_mock_1.MockNgModuleResolver), compiler.injector.get(compiler_1.CompileMetadataResolver));
    };
    return TestingCompilerFactoryImpl;
}());
TestingCompilerFactoryImpl = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.CompilerFactory])
], TestingCompilerFactoryImpl);
exports.TestingCompilerFactoryImpl = TestingCompilerFactoryImpl;
var TestingCompilerImpl = (function () {
    function TestingCompilerImpl(_compiler, _directiveResolver, _pipeResolver, _moduleResolver, _metadataResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._metadataResolver = _metadataResolver;
        this._overrider = new metadata_overrider_1.MetadataOverrider();
    }
    Object.defineProperty(TestingCompilerImpl.prototype, "injector", {
        get: function () { return this._compiler.injector; },
        enumerable: true,
        configurable: true
    });
    TestingCompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    };
    TestingCompilerImpl.prototype.getNgContentSelectors = function (component) {
        return this._compiler.getNgContentSelectors(component);
    };
    TestingCompilerImpl.prototype.getComponentFactory = function (component) {
        return this._compiler.getComponentFactory(component);
    };
    TestingCompilerImpl.prototype.checkOverrideAllowed = function (type) {
        if (this._compiler.hasAotSummary(type)) {
            throw new Error(core_1.ɵstringify(type) + " was AOT compiled, so its metadata cannot be changed.");
        }
    };
    TestingCompilerImpl.prototype.overrideModule = function (ngModule, override) {
        this.checkOverrideAllowed(ngModule);
        var oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(core_1.NgModule, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overrideDirective = function (directive, override) {
        this.checkOverrideAllowed(directive);
        var oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(core_1.Directive, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overrideComponent = function (component, override) {
        this.checkOverrideAllowed(component);
        var oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(core_1.Component, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overridePipe = function (pipe, override) {
        this.checkOverrideAllowed(pipe);
        var oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(core_1.Pipe, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.loadAotSummaries = function (summaries) { this._compiler.loadAotSummaries(summaries); };
    TestingCompilerImpl.prototype.clearCache = function () { this._compiler.clearCache(); };
    TestingCompilerImpl.prototype.clearCacheFor = function (type) { this._compiler.clearCacheFor(type); };
    return TestingCompilerImpl;
}());
exports.TestingCompilerImpl = TestingCompilerImpl;
/**
 * Platform for dynamic tests
 *
 * @experimental
 */
exports.platformCoreDynamicTesting = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, 'coreDynamicTesting', [
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: pipe_resolver_mock_1.MockPipeResolver, deps: [core_1.Injector, compiler_1.CompileReflector] },
                { provide: compiler_1.PipeResolver, useExisting: pipe_resolver_mock_1.MockPipeResolver },
                { provide: directive_resolver_mock_1.MockDirectiveResolver, deps: [core_1.Injector, compiler_1.CompileReflector] },
                { provide: compiler_1.DirectiveResolver, useExisting: directive_resolver_mock_1.MockDirectiveResolver },
                { provide: ng_module_resolver_mock_1.MockNgModuleResolver, deps: [core_1.Injector, compiler_1.CompileReflector] },
                { provide: compiler_1.NgModuleResolver, useExisting: ng_module_resolver_mock_1.MockNgModuleResolver },
            ]
        },
        multi: true
    },
    {
        provide: testing_1.ɵTestingCompilerFactory,
        useClass: TestingCompilerFactoryImpl,
        deps: [core_1.CompilerFactory]
    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Rpbmcvc3JjL3Rlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILDRDQUF1QztBQUN2QywrQ0FBMEM7QUFDMUMsK0NBQTBDO0FBQzFDLDBDQUFxQztBQUVyQyxzQ0FBb1E7QUFDcFEsaURBQStJO0FBQy9JLDhDQUFpSztBQUNqSyxxRUFBZ0U7QUFDaEUscUVBQStEO0FBQy9ELDJEQUFzRDtBQUN0RCwyREFBdUQ7QUFHdkQsSUFBYSwwQkFBMEI7SUFDckMsb0NBQW9CLGdCQUFpQztRQUFqQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO0lBQUcsQ0FBQztJQUV6RCwwREFBcUIsR0FBckIsVUFBc0IsT0FBMEI7UUFDOUMsSUFBTSxRQUFRLEdBQWdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQzFCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywrQ0FBcUIsQ0FBQyxFQUN0RCxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQ0FBZ0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDhDQUFvQixDQUFDLEVBQ3BGLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtDQUF1QixDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0gsaUNBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVZZLDBCQUEwQjtJQUR0QyxpQkFBVSxFQUFFO3FDQUUyQixzQkFBZTtHQUQxQywwQkFBMEIsQ0FVdEM7QUFWWSxnRUFBMEI7QUFZdkM7SUFFRSw2QkFDWSxTQUFzQixFQUFV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