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
export class TestingCompilerFactoryImpl {
    /**
     * @param {?} _compilerFactory
     */
    constructor(_compilerFactory) {
        this._compilerFactory = _compilerFactory;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    createTestingCompiler(options) {
        const /** @type {?} */ compiler = (this._compilerFactory.createCompiler(options));
        return new TestingCompilerImpl(compiler, compiler.injector.get(MockDirectiveResolver), compiler.injector.get(MockPipeResolver), compiler.injector.get(MockNgModuleResolver), compiler.injector.get(CompileMetadataResolver));
    }
}
TestingCompilerFactoryImpl.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TestingCompilerFactoryImpl.ctorParameters = () => [
    { type: CompilerFactory, },
];
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
export class TestingCompilerImpl {
    /**
     * @param {?} _compiler
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _moduleResolver
     * @param {?} _metadataResolver
     */
    constructor(_compiler, _directiveResolver, _pipeResolver, _moduleResolver, _metadataResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._metadataResolver = _metadataResolver;
        this._overrider = new MetadataOverrider();
    }
    /**
     * @return {?}
     */
    get injector() { return this._compiler.injector; }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleSync(moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAsync(moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsSync(moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsAsync(moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getNgContentSelectors(component) {
        return this._compiler.getNgContentSelectors(component);
    }
    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    getComponentFactory(component) {
        return this._compiler.getComponentFactory(component);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    checkOverrideAllowed(type) {
        if (this._compiler.hasAotSummary(type)) {
            throw new Error(`${ɵstringify(type)} was AOT compiled, so its metadata cannot be changed.`);
        }
    }
    /**
     * @param {?} ngModule
     * @param {?} override
     * @return {?}
     */
    overrideModule(ngModule, override) {
        this.checkOverrideAllowed(ngModule);
        const /** @type {?} */ oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(NgModule, oldMetadata, override));
    }
    /**
     * @param {?} directive
     * @param {?} override
     * @return {?}
     */
    overrideDirective(directive, override) {
        this.checkOverrideAllowed(directive);
        const /** @type {?} */ oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(Directive, /** @type {?} */ ((oldMetadata)), override));
    }
    /**
     * @param {?} component
     * @param {?} override
     * @return {?}
     */
    overrideComponent(component, override) {
        this.checkOverrideAllowed(component);
        const /** @type {?} */ oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(Component, /** @type {?} */ ((oldMetadata)), override));
    }
    /**
     * @param {?} pipe
     * @param {?} override
     * @return {?}
     */
    overridePipe(pipe, override) {
        this.checkOverrideAllowed(pipe);
        const /** @type {?} */ oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(Pipe, oldMetadata, override));
    }
    /**
     * @param {?} summaries
     * @return {?}
     */
    loadAotSummaries(summaries) { this._compiler.loadAotSummaries(summaries); }
    /**
     * @return {?}
     */
    clearCache() { this._compiler.clearCache(); }
    /**
     * @param {?} type
     * @return {?}
     */
    clearCacheFor(type) { this._compiler.clearCacheFor(type); }
}
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
export const /** @type {?} */ platformCoreDynamicTesting = createPlatformFactory(platformCoreDynamic, 'coreDynamicTesting', [
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