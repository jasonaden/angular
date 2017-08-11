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
var lifecycle_reflector_1 = require("@angular/compiler/src/lifecycle_reflector");
var test_bindings_1 = require("@angular/compiler/testing/src/test_bindings");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var compile_metadata_1 = require("../src/compile_metadata");
var metadata_resolver_1 = require("../src/metadata_resolver");
var resource_loader_1 = require("../src/resource_loader");
var metadata_resolver_fixture_1 = require("./metadata_resolver_fixture");
function main() {
    describe('CompileMetadataResolver', function () {
        beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: test_bindings_1.TEST_COMPILER_PROVIDERS }); });
        it('should throw on the getDirectiveMetadata/getPipeMetadata methods if the module has not been loaded yet', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({})
            ], SomeModule);
            var SomePipe = (function () {
                function SomePipe() {
                }
                return SomePipe;
            }());
            SomePipe = __decorate([
                core_1.Pipe({ name: 'pipe' })
            ], SomePipe);
            expect(function () { return resolver.getDirectiveMetadata(ComponentWithEverythingInline); })
                .toThrowError(/Illegal state/);
            expect(function () { return resolver.getPipeMetadata(SomePipe); }).toThrowError(/Illegal state/);
        }));
        it('should read metadata in sync for components with inline resources', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [ComponentWithEverythingInline] })
            ], SomeModule);
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true);
            var meta = resolver.getDirectiveMetadata(ComponentWithEverythingInline);
            expect(meta.selector).toEqual('someSelector');
            expect(meta.exportAs).toEqual('someExportAs');
            expect(meta.isComponent).toBe(true);
            expect(meta.type.reference).toBe(ComponentWithEverythingInline);
            expect(compile_metadata_1.identifierName(meta.type)).toEqual(core_1.ɵstringify(ComponentWithEverythingInline));
            expect(meta.type.lifecycleHooks).toEqual(lifecycle_reflector_1.LIFECYCLE_HOOKS_VALUES);
            expect(meta.changeDetection).toBe(core_1.ChangeDetectionStrategy.Default);
            expect(meta.inputs).toEqual({ 'someProp': 'someProp' });
            expect(meta.outputs).toEqual({ 'someEvent': 'someEvent' });
            expect(meta.hostListeners).toEqual({ 'someHostListener': 'someHostListenerExpr' });
            expect(meta.hostProperties).toEqual({ 'someHostProp': 'someHostPropExpr' });
            expect(meta.hostAttributes).toEqual({ 'someHostAttr': 'someHostAttrValue' });
            expect(meta.template.encapsulation).toBe(core_1.ViewEncapsulation.Emulated);
            expect(meta.template.styles).toEqual(['someStyle']);
            expect(meta.template.template).toEqual('someTemplate');
            expect(meta.template.interpolation).toEqual(['{{', '}}']);
        }));
        it('should throw when reading metadata for component with external resources when sync=true is passed', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [ComponentWithExternalResources] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't compile synchronously as " + core_1.ɵstringify(ComponentWithExternalResources) + " is still being loaded!");
        }));
        it('should read external metadata when sync=false', testing_1.async(testing_1.inject([metadata_resolver_1.CompileMetadataResolver, resource_loader_1.ResourceLoader], function (resolver, resourceLoader) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [ComponentWithExternalResources] })
            ], SomeModule);
            resourceLoader.when('someTemplateUrl', 'someTemplate');
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, false).then(function () {
                var meta = resolver.getDirectiveMetadata(ComponentWithExternalResources);
                expect(meta.selector).toEqual('someSelector');
                expect(meta.template.styleUrls).toEqual(['someStyleUrl']);
                expect(meta.template.templateUrl).toEqual('someTemplateUrl');
                expect(meta.template.template).toEqual('someTemplate');
            });
            resourceLoader.flush();
        })));
        it('should use `./` as base url for templates during runtime compilation if no moduleId is given', testing_1.async(testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ComponentWithoutModuleId = (function () {
                function ComponentWithoutModuleId() {
                }
                return ComponentWithoutModuleId;
            }());
            ComponentWithoutModuleId = __decorate([
                core_1.Component({ selector: 'someComponent', templateUrl: 'someUrl' })
            ], ComponentWithoutModuleId);
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [ComponentWithoutModuleId] })
            ], SomeModule);
            resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, false).then(function () {
                var value = resolver.getDirectiveMetadata(ComponentWithoutModuleId).template.templateUrl;
                var expectedEndValue = './someUrl';
                expect(value.endsWith(expectedEndValue)).toBe(true);
            });
        })));
        it('should throw when the moduleId is not a string', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidModuleId] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("moduleId should be a string in \"ComponentWithInvalidModuleId\". See" +
                " https://goo.gl/wIDDiL for more information.\n" +
                "If you're using Webpack you should inline the template and the styles, see" +
                " https://goo.gl/X2J8zc.");
        }));
        it('should throw when metadata is incorrectly typed', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [metadata_resolver_fixture_1.MalformedStylesComponent] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Expected 'styles' to be an array of strings.");
        }));
        it('should throw with descriptive error message when a module imports itself', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = SomeModule_1 = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = SomeModule_1 = __decorate([
                core_1.NgModule({ imports: [SomeModule_1] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("'SomeModule' module can't import itself");
            var SomeModule_1;
        }));
        it('should throw with descriptive error message when provider token can not be resolved', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [MyBrokenComp1] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't resolve all parameters for MyBrokenComp1: (?).");
        }));
        it('should throw with descriptive error message when a directive is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithImportedComponent = (function () {
                function ModuleWithImportedComponent() {
                }
                return ModuleWithImportedComponent;
            }());
            ModuleWithImportedComponent = __decorate([
                core_1.NgModule({ imports: [ComponentWithoutModuleId] })
            ], ModuleWithImportedComponent);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedComponent, true); })
                .toThrowError("Unexpected directive 'ComponentWithoutModuleId' imported by the module 'ModuleWithImportedComponent'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when a pipe is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomePipe = (function () {
                function SomePipe() {
                }
                return SomePipe;
            }());
            SomePipe = __decorate([
                core_1.Pipe({ name: 'somePipe' })
            ], SomePipe);
            var ModuleWithImportedPipe = (function () {
                function ModuleWithImportedPipe() {
                }
                return ModuleWithImportedPipe;
            }());
            ModuleWithImportedPipe = __decorate([
                core_1.NgModule({ imports: [SomePipe] })
            ], ModuleWithImportedPipe);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedPipe, true); })
                .toThrowError("Unexpected pipe 'SomePipe' imported by the module 'ModuleWithImportedPipe'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when a module is passed to declarations', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({})
            ], SomeModule);
            var ModuleWithDeclaredModule = (function () {
                function ModuleWithDeclaredModule() {
                }
                return ModuleWithDeclaredModule;
            }());
            ModuleWithDeclaredModule = __decorate([
                core_1.NgModule({ declarations: [SomeModule] })
            ], ModuleWithDeclaredModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithDeclaredModule, true); })
                .toThrowError("Unexpected module 'SomeModule' declared by the module 'ModuleWithDeclaredModule'. Please add a @Pipe/@Directive/@Component annotation.");
        }));
        it('should throw with descriptive error message when a declared pipe is missing annotation', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomePipe = (function () {
                function SomePipe() {
                }
                return SomePipe;
            }());
            var ModuleWithDeclaredModule = (function () {
                function ModuleWithDeclaredModule() {
                }
                return ModuleWithDeclaredModule;
            }());
            ModuleWithDeclaredModule = __decorate([
                core_1.NgModule({ declarations: [SomePipe] })
            ], ModuleWithDeclaredModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithDeclaredModule, true); })
                .toThrowError("Unexpected value 'SomePipe' declared by the module 'ModuleWithDeclaredModule'. Please add a @Pipe/@Directive/@Component annotation.");
        }));
        it('should throw with descriptive error message when an imported module is missing annotation', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            var ModuleWithImportedModule = (function () {
                function ModuleWithImportedModule() {
                }
                return ModuleWithImportedModule;
            }());
            ModuleWithImportedModule = __decorate([
                core_1.NgModule({ imports: [SomeModule] })
            ], ModuleWithImportedModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithImportedModule, true); })
                .toThrowError("Unexpected value 'SomeModule' imported by the module 'ModuleWithImportedModule'. Please add a @NgModule annotation.");
        }));
        it('should throw with descriptive error message when null is passed to declarations', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullDeclared = (function () {
                function ModuleWithNullDeclared() {
                }
                return ModuleWithNullDeclared;
            }());
            ModuleWithNullDeclared = __decorate([
                core_1.NgModule({ declarations: [null] })
            ], ModuleWithNullDeclared);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullDeclared, true); })
                .toThrowError("Unexpected value 'null' declared by the module 'ModuleWithNullDeclared'");
        }));
        it('should throw with descriptive error message when null is passed to imports', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullImported = (function () {
                function ModuleWithNullImported() {
                }
                return ModuleWithNullImported;
            }());
            ModuleWithNullImported = __decorate([
                core_1.NgModule({ imports: [null] })
            ], ModuleWithNullImported);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullImported, true); })
                .toThrowError("Unexpected value 'null' imported by the module 'ModuleWithNullImported'");
        }));
        it('should throw with descriptive error message when a param token of a dependency is undefined', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [MyBrokenComp2] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Can't resolve all parameters for NonAnnotatedService: (?).");
        }));
        it('should throw with descriptive error message when encounter invalid provider', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ providers: [{ provide: SimpleService, useClass: undefined }] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError(/Invalid provider for SimpleService. useClass cannot be undefined./);
        }));
        it('should throw with descriptive error message when provider is undefined', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ providers: [undefined] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError(/Encountered undefined provider!/);
        }));
        it('should throw with descriptive error message when one of providers is not present', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [MyBrokenComp3] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Invalid providers for \"MyBrokenComp3\" - only instances of Provider and Type are allowed, got: [SimpleService, ?null?, ...]");
        }));
        it('should throw with descriptive error message when one of viewProviders is not present', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ declarations: [MyBrokenComp4] })
            ], SomeModule);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(SomeModule, true); })
                .toThrowError("Invalid viewProviders for \"MyBrokenComp4\" - only instances of Provider and Type are allowed, got: [?null?, ...]");
        }));
        it('should throw with descriptive error message when null or undefined is passed to module bootstrap', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithNullBootstrap = (function () {
                function ModuleWithNullBootstrap() {
                }
                return ModuleWithNullBootstrap;
            }());
            ModuleWithNullBootstrap = __decorate([
                core_1.NgModule({ bootstrap: [null] })
            ], ModuleWithNullBootstrap);
            var ModuleWithUndefinedBootstrap = (function () {
                function ModuleWithUndefinedBootstrap() {
                }
                return ModuleWithUndefinedBootstrap;
            }());
            ModuleWithUndefinedBootstrap = __decorate([
                core_1.NgModule({ bootstrap: [undefined] })
            ], ModuleWithUndefinedBootstrap);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithNullBootstrap, true); })
                .toThrowError("Unexpected value 'null' used in the bootstrap property of module 'ModuleWithNullBootstrap'");
            expect(function () {
                return resolver.loadNgModuleDirectiveAndPipeMetadata(ModuleWithUndefinedBootstrap, true);
            })
                .toThrowError("Unexpected value 'undefined' used in the bootstrap property of module 'ModuleWithUndefinedBootstrap'");
        }));
        it('should throw an error when the interpolation config has invalid symbols', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var Module1 = (function () {
                function Module1() {
                }
                return Module1;
            }());
            Module1 = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation1] })
            ], Module1);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module1, true); })
                .toThrowError("[' ', ' '] contains unusable interpolation symbol.");
            var Module2 = (function () {
                function Module2() {
                }
                return Module2;
            }());
            Module2 = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation2] })
            ], Module2);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module2, true); })
                .toThrowError("['{', '}'] contains unusable interpolation symbol.");
            var Module3 = (function () {
                function Module3() {
                }
                return Module3;
            }());
            Module3 = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation3] })
            ], Module3);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module3, true); })
                .toThrowError("['<%', '%>'] contains unusable interpolation symbol.");
            var Module4 = (function () {
                function Module4() {
                }
                return Module4;
            }());
            Module4 = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation4] })
            ], Module4);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module4, true); })
                .toThrowError("['&#', '}}'] contains unusable interpolation symbol.");
            var Module5 = (function () {
                function Module5() {
                }
                return Module5;
            }());
            Module5 = __decorate([
                core_1.NgModule({ declarations: [ComponentWithInvalidInterpolation5] })
            ], Module5);
            expect(function () { return resolver.loadNgModuleDirectiveAndPipeMetadata(Module5, true); })
                .toThrowError("['&lbrace;', '}}'] contains unusable interpolation symbol.");
        }));
        it("should throw an error when a Pipe is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyPipe = (function () {
                function MyPipe() {
                }
                return MyPipe;
            }());
            MyPipe = __decorate([
                core_1.Pipe({ name: 'pipe' })
            ], MyPipe);
            var ModuleWithPipeInBootstrap = (function () {
                function ModuleWithPipeInBootstrap() {
                }
                return ModuleWithPipeInBootstrap;
            }());
            ModuleWithPipeInBootstrap = __decorate([
                core_1.NgModule({ declarations: [MyPipe], bootstrap: [MyPipe] })
            ], ModuleWithPipeInBootstrap);
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithPipeInBootstrap); })
                .toThrowError("MyPipe cannot be used as an entry component.");
        }));
        it("should throw an error when a Service is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var ModuleWithServiceInBootstrap = (function () {
                function ModuleWithServiceInBootstrap() {
                }
                return ModuleWithServiceInBootstrap;
            }());
            ModuleWithServiceInBootstrap = __decorate([
                core_1.NgModule({ declarations: [], bootstrap: [SimpleService] })
            ], ModuleWithServiceInBootstrap);
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithServiceInBootstrap); })
                .toThrowError("SimpleService cannot be used as an entry component.");
        }));
        it("should throw an error when a Directive is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyDirective = (function () {
                function MyDirective() {
                }
                return MyDirective;
            }());
            MyDirective = __decorate([
                core_1.Directive({ selector: 'directive' })
            ], MyDirective);
            var ModuleWithDirectiveInBootstrap = (function () {
                function ModuleWithDirectiveInBootstrap() {
                }
                return ModuleWithDirectiveInBootstrap;
            }());
            ModuleWithDirectiveInBootstrap = __decorate([
                core_1.NgModule({ declarations: [], bootstrap: [MyDirective] })
            ], ModuleWithDirectiveInBootstrap);
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithDirectiveInBootstrap); })
                .toThrowError("MyDirective cannot be used as an entry component.");
        }));
        it("should not throw an error when a Component is added to module's bootstrap list", testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
            var MyComp = (function () {
                function MyComp() {
                }
                return MyComp;
            }());
            MyComp = __decorate([
                core_1.Component({ template: '' })
            ], MyComp);
            var ModuleWithComponentInBootstrap = (function () {
                function ModuleWithComponentInBootstrap() {
                }
                return ModuleWithComponentInBootstrap;
            }());
            ModuleWithComponentInBootstrap = __decorate([
                core_1.NgModule({ declarations: [MyComp], bootstrap: [MyComp] })
            ], ModuleWithComponentInBootstrap);
            expect(function () { return resolver.getNgModuleMetadata(ModuleWithComponentInBootstrap); }).not.toThrow();
        }));
    });
    it('should dedupe declarations in NgModule', testing_1.inject([metadata_resolver_1.CompileMetadataResolver], function (resolver) {
        var MyComp = (function () {
            function MyComp() {
            }
            return MyComp;
        }());
        MyComp = __decorate([
            core_1.Component({ template: '' })
        ], MyComp);
        var MyModule = (function () {
            function MyModule() {
            }
            return MyModule;
        }());
        MyModule = __decorate([
            core_1.NgModule({ declarations: [MyComp, MyComp] })
        ], MyModule);
        var modMeta = resolver.getNgModuleMetadata(MyModule);
        expect(modMeta.declaredDirectives.length).toBe(1);
        expect(modMeta.declaredDirectives[0].reference).toBe(MyComp);
    }));
}
exports.main = main;
var ComponentWithoutModuleId = (function () {
    function ComponentWithoutModuleId() {
    }
    return ComponentWithoutModuleId;
}());
ComponentWithoutModuleId = __decorate([
    core_1.Component({ selector: 'someComponent', template: '' })
], ComponentWithoutModuleId);
var ComponentWithInvalidModuleId = (function () {
    function ComponentWithInvalidModuleId() {
    }
    return ComponentWithInvalidModuleId;
}());
ComponentWithInvalidModuleId = __decorate([
    core_1.Component({ selector: 'someComponent', template: '', moduleId: 0 })
], ComponentWithInvalidModuleId);
var ComponentWithExternalResources = (function () {
    function ComponentWithExternalResources() {
    }
    return ComponentWithExternalResources;
}());
ComponentWithExternalResources = __decorate([
    core_1.Component({
        selector: 'someSelector',
        templateUrl: 'someTemplateUrl',
        styleUrls: ['someStyleUrl'],
    })
], ComponentWithExternalResources);
var ComponentWithEverythingInline = (function () {
    function ComponentWithEverythingInline() {
    }
    ComponentWithEverythingInline.prototype.ngOnChanges = function (changes) { };
    ComponentWithEverythingInline.prototype.ngOnInit = function () { };
    ComponentWithEverythingInline.prototype.ngDoCheck = function () { };
    ComponentWithEverythingInline.prototype.ngOnDestroy = function () { };
    ComponentWithEverythingInline.prototype.ngAfterContentInit = function () { };
    ComponentWithEverythingInline.prototype.ngAfterContentChecked = function () { };
    ComponentWithEverythingInline.prototype.ngAfterViewInit = function () { };
    ComponentWithEverythingInline.prototype.ngAfterViewChecked = function () { };
    return ComponentWithEverythingInline;
}());
ComponentWithEverythingInline = __decorate([
    core_1.Component({
        selector: 'someSelector',
        inputs: ['someProp'],
        outputs: ['someEvent'],
        host: {
            '[someHostProp]': 'someHostPropExpr',
            '(someHostListener)': 'someHostListenerExpr',
            'someHostAttr': 'someHostAttrValue'
        },
        exportAs: 'someExportAs',
        moduleId: 'someModuleId',
        changeDetection: core_1.ChangeDetectionStrategy.Default,
        template: 'someTemplate',
        encapsulation: core_1.ViewEncapsulation.Emulated,
        styles: ['someStyle'],
        interpolation: ['{{', '}}']
    })
], ComponentWithEverythingInline);
var MyBrokenComp1 = (function () {
    function MyBrokenComp1(dependency) {
        this.dependency = dependency;
    }
    return MyBrokenComp1;
}());
MyBrokenComp1 = __decorate([
    core_1.Component({ selector: 'my-broken-comp', template: '' }),
    __metadata("design:paramtypes", [Object])
], MyBrokenComp1);
var NonAnnotatedService = (function () {
    function NonAnnotatedService(dep) {
    }
    return NonAnnotatedService;
}());
var MyBrokenComp2 = (function () {
    function MyBrokenComp2(dependency) {
    }
    return MyBrokenComp2;
}());
MyBrokenComp2 = __decorate([
    core_1.Component({ selector: 'my-broken-comp', template: '', providers: [NonAnnotatedService] }),
    __metadata("design:paramtypes", [NonAnnotatedService])
], MyBrokenComp2);
var SimpleService = (function () {
    function SimpleService() {
    }
    return SimpleService;
}());
SimpleService = __decorate([
    core_1.Injectable()
], SimpleService);
var MyBrokenComp3 = (function () {
    function MyBrokenComp3() {
    }
    return MyBrokenComp3;
}());
MyBrokenComp3 = __decorate([
    core_1.Component({ selector: 'my-broken-comp', template: '', providers: [SimpleService, null, [null]] })
], MyBrokenComp3);
var MyBrokenComp4 = (function () {
    function MyBrokenComp4() {
    }
    return MyBrokenComp4;
}());
MyBrokenComp4 = __decorate([
    core_1.Component({ selector: 'my-broken-comp', template: '', viewProviders: [null, SimpleService, [null]] })
], MyBrokenComp4);
var ComponentWithInvalidInterpolation1 = (function () {
    function ComponentWithInvalidInterpolation1() {
    }
    return ComponentWithInvalidInterpolation1;
}());
ComponentWithInvalidInterpolation1 = __decorate([
    core_1.Component({ selector: 'someSelector', template: '', interpolation: [' ', ' '] })
], ComponentWithInvalidInterpolation1);
var ComponentWithInvalidInterpolation2 = (function () {
    function ComponentWithInvalidInterpolation2() {
    }
    return ComponentWithInvalidInterpolation2;
}());
ComponentWithInvalidInterpolation2 = __decorate([
    core_1.Component({ selector: 'someSelector', template: '', interpolation: ['{', '}'] })
], ComponentWithInvalidInterpolation2);
var ComponentWithInvalidInterpolation3 = (function () {
    function ComponentWithInvalidInterpolation3() {
    }
    return ComponentWithInvalidInterpolation3;
}());
ComponentWithInvalidInterpolation3 = __decorate([
    core_1.Component({ selector: 'someSelector', template: '', interpolation: ['<%', '%>'] })
], ComponentWithInvalidInterpolation3);
var ComponentWithInvalidInterpolation4 = (function () {
    function ComponentWithInvalidInterpolation4() {
    }
    return ComponentWithInvalidInterpolation4;
}());
ComponentWithInvalidInterpolation4 = __decorate([
    core_1.Component({ selector: 'someSelector', template: '', interpolation: ['&#', '}}'] })
], ComponentWithInvalidInterpolation4);
var ComponentWithInvalidInterpolation5 = (function () {
    function ComponentWithInvalidInterpolation5() {
    }
    return ComponentWithInvalidInterpolation5;
}());
ComponentWithInvalidInterpolation5 = __decorate([
    core_1.Component({ selector: 'someSelector', template: '', interpolation: ['&lbrace;', '}}'] })
], ComponentWithInvalidInterpolation5);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVzb2x2ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWV0YWRhdGFfcmVzb2x2ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILGlGQUFpRztBQUNqRyw2RUFBb0Y7QUFDcEYsc0NBQWtSO0FBQ2xSLGlEQUE2RDtBQUU3RCw0REFBdUQ7QUFDdkQsOERBQWlFO0FBQ2pFLDBEQUFzRDtBQUd0RCx5RUFBcUU7QUFFckU7SUFDRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFNBQVMsRUFBRSx1Q0FBdUIsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RixFQUFFLENBQUMsd0dBQXdHLEVBQ3hHLGdCQUFNLENBQUMsQ0FBQywyQ0FBdUIsQ0FBQyxFQUFFLFVBQUMsUUFBaUM7WUFFbEUsSUFBTSxVQUFVO2dCQUFoQjtnQkFDQSxDQUFDO2dCQUFELGlCQUFDO1lBQUQsQ0FBQyxBQURELElBQ0M7WUFESyxVQUFVO2dCQURmLGVBQVEsQ0FBQyxFQUFFLENBQUM7ZUFDUCxVQUFVLENBQ2Y7WUFHRCxJQUFNLFFBQVE7Z0JBQWQ7Z0JBQ0EsQ0FBQztnQkFBRCxlQUFDO1lBQUQsQ0FBQyxBQURELElBQ0M7WUFESyxRQUFRO2dCQURiLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztlQUNmLFFBQVEsQ0FDYjtZQUVELE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLG9CQUFvQixDQUFDLDZCQUE2QixDQUFDLEVBQTVELENBQTRELENBQUM7aUJBQ3JFLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxlQUFl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