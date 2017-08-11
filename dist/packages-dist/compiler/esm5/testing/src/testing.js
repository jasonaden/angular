/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
export { MockSchemaRegistry } from './schema_registry_mock';
export { MockDirectiveResolver } from './directive_resolver_mock';
export { MockNgModuleResolver } from './ng_module_resolver_mock';
export { MockPipeResolver } from './pipe_resolver_mock';
import { createPlatformFactory, Injectable, COMPILER_OPTIONS, CompilerFactory, Injector, NgModule, Component, Directive, Pipe, ɵstringify } from '@angular/core';
import { ɵTestingCompilerFactory as TestingCompilerFactory } from '@angular/core/testing';
import { platformCoreDynamic, DirectiveResolver, NgModuleResolver, PipeResolver, CompileMetadataResolver, CompileReflector } from '@angular/compiler';
import { MockDirectiveResolver } from './directive_resolver_mock';
import { MockNgModuleResolver } from './ng_module_resolver_mock';
import { MockPipeResolver } from './pipe_resolver_mock';
import { MetadataOverrider } from './metadata_overrider';
var TestingCompilerFactoryImpl = (function () {
    /**
     * @param {?} _compilerFactory
     */
    function TestingCompilerFactoryImpl(_compilerFactory) {
        this._compilerFactory = _compilerFactory;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    TestingCompilerFactoryImpl.prototype.createTestingCompiler = function (options) {
        var /** @type {?} */ compiler = (this._compilerFactory.createCompiler(options));
        return new TestingCompilerImpl(compiler, compiler.injector.get(MockDirectiveResolver), compiler.injector.get(MockPipeResolver), compiler.injector.get(MockNgModuleResolver), compiler.injector.get(CompileMetadataResolver));
    };
    return TestingCompilerFactoryImpl;
}());
export { TestingCompilerFactoryImpl };
TestingCompilerFactoryImpl.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TestingCompilerFactoryImpl.ctorParameters = function () { return [
    { type: CompilerFactory, },
]; };
function TestingCompilerFactoryImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    TestingCompilerFactoryImpl.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TestingCompilerFactoryImpl.ctorParameters;
    /** @type {?} */
    TestingCompilerFactoryImpl.prototype._compilerFactory;
}
var TestingCompilerImpl = (function () {
    /**
     * @param {?} _compiler
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _moduleResolver
     * @param {?} _metadataResolver
     */
    function TestingCompilerImpl(_compiler, _directiveResolver, _pipeResolver, _moduleResolver, _metadataResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._metadataResolver = _metadataResolver;
        this._overrider = new MetadataOverrider();
    }
    Object.defineProperty(TestingCompilerImpl.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return this._compiler.injector; },
        enumerable: true,
        configurable: true
    });
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    };
    /**
     * @param {?} component
     * @return {?}
     */
    TestingCompilerImpl.prototype.getNgContentSelectors = function (component) {
        return this._compiler.getNgContentSelectors(component);
    };
    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    TestingCompilerImpl.prototype.getComponentFactory = function (component) {
        return this._compiler.getComponentFactory(component);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    TestingCompilerImpl.prototype.checkOverrideAllowed = function (type) {
        if (this._compiler.hasAotSummary(type)) {
            throw new Error(ɵstringify(type) + " was AOT compiled, so its metadata cannot be changed.");
        }
    };
    /**
     * @param {?} ngModule
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideModule = function (ngModule, override) {
        this.checkOverrideAllowed(ngModule);
        var /** @type {?} */ oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(NgModule, oldMetadata, override));
    };
    /**
     * @param {?} directive
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideDirective = function (directive, override) {
        this.checkOverrideAllowed(directive);
        var /** @type {?} */ oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(Directive, /** @type {?} */ ((oldMetadata)), override));
    };
    /**
     * @param {?} component
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideComponent = function (component, override) {
        this.checkOverrideAllowed(component);
        var /** @type {?} */ oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(Component, /** @type {?} */ ((oldMetadata)), override));
    };
    /**
     * @param {?} pipe
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overridePipe = function (pipe, override) {
        this.checkOverrideAllowed(pipe);
        var /** @type {?} */ oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(Pipe, oldMetadata, override));
    };
    /**
     * @param {?} summaries
     * @return {?}
     */
    TestingCompilerImpl.prototype.loadAotSummaries = function (summaries) { this._compiler.loadAotSummaries(summaries); };
    /**
     * @return {?}
     */
    TestingCompilerImpl.prototype.clearCache = function () { this._compiler.clearCache(); };
    /**
     * @param {?} type
     * @return {?}
     */
    TestingCompilerImpl.prototype.clearCacheFor = function (type) { this._compiler.clearCacheFor(type); };
    return TestingCompilerImpl;
}());
export { TestingCompilerImpl };
function TestingCompilerImpl_tsickle_Closure_declarations() {
    /** @type {?} */
    TestingCompilerImpl.prototype._overrider;
    /** @type {?} */
    TestingCompilerImpl.prototype._compiler;
    /** @type {?} */
    TestingCompilerImpl.prototype._directiveResolver;
    /** @type {?} */
    TestingCompilerImpl.prototype._pipeResolver;
    /** @type {?} */
    TestingCompilerImpl.prototype._moduleResolver;
    /** @type {?} */
    TestingCompilerImpl.prototype._metadataResolver;
}
/**
 * Platform for dynamic tests
 *
 * \@experimental
 */
export var /** @type {?} */ platformCoreDynamicTesting = createPlatformFactory(platformCoreDynamic, 'coreDynamicTesting', [
    {
        provide: COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: MockPipeResolver, deps: [Injector, CompileReflector] },
                { provide: PipeResolver, useExisting: MockPipeResolver },
                { provide: MockDirectiveResolver, deps: [Injector, CompileReflector] },
                { provide: DirectiveResolver, useExisting: MockDirectiveResolver },
                { provide: MockNgModuleResolver, deps: [Injector, CompileReflector] },
                { provide: NgModuleResolver, useExisting: MockNgModuleResolver },
            ]
        },
        multi: true
    },
    {
        provide: TestingCompilerFactory,
        useClass: TestingCompilerFactoryImpl,
        deps: [CompilerFactory]
    }
]);
//# sourceMappingURL=testing.js.map