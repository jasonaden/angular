"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var ts = require("typescript");
var source_map_util_1 = require("../output/source_map_util");
var test_util_1 = require("./test_util");
describe('compiler (unbundled Angular)', function () {
    var angularFiles = test_util_1.setup();
    describe('Quickstart', function () {
        it('should compile', function () {
            var genFiles = test_util_1.compile([QUICKSTART, angularFiles]).genFiles;
            expect(genFiles.find(function (f) { return /app\.component\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
            expect(genFiles.find(function (f) { return /app\.module\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
        });
    });
    describe('aot source mapping', function () {
        var componentPath = '/app/app.component.ts';
        var ngComponentPath = 'ng:///app/app.component.ts';
        var rootDir;
        var appDir;
        beforeEach(function () {
            appDir = {
                'app.module.ts': "\n              import { NgModule }      from '@angular/core';\n\n              import { AppComponent }  from './app.component';\n\n              @NgModule({\n                declarations: [ AppComponent ],\n                bootstrap:    [ AppComponent ]\n              })\n              export class AppModule { }\n            "
            };
            rootDir = { 'app': appDir };
        });
        function compileApp() {
            var genFiles = test_util_1.compile([rootDir, angularFiles]).genFiles;
            return genFiles.find(function (genFile) { return genFile.srcFileUrl === componentPath && genFile.genFileUrl.endsWith('.ts'); });
        }
        function findLineAndColumn(file, token) {
            var index = file.indexOf(token);
            if (index === -1) {
                return { line: null, column: null };
            }
            var linesUntilToken = file.slice(0, index).split('\n');
            var line = linesUntilToken.length;
            var column = linesUntilToken[linesUntilToken.length - 1].length;
            return { line: line, column: column };
        }
        function createComponentSource(componentDecorator) {
            return "\n        import { NgModule, Component } from '@angular/core';\n\n        @Component({\n          " + componentDecorator + "\n        })\n        export class AppComponent {\n          someMethod() {}\n        }\n      ";
        }
        describe('inline templates', function () {
            var ngUrl = ngComponentPath + ".AppComponent.html";
            function templateDecorator(template) { return "template: `" + template + "`,"; }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        describe('external templates', function () {
            var ngUrl = 'ng:///app/app.component.html';
            var templateUrl = '/app/app.component.html';
            function templateDecorator(template) {
                appDir['app.component.html'] = template;
                return "templateUrl: 'app.component.html',";
            }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        function declareTests(_a) {
            var ngUrl = _a.ngUrl, templateDecorator = _a.templateDecorator;
            it('should use the right source url in html parse errors', function () {
                appDir['app.component.ts'] = createComponentSource(templateDecorator('<div>\n  </error>'));
                expect(function () { return compileApp(); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl + "@1:2"));
            });
            it('should use the right source url in template parse errors', function () {
                appDir['app.component.ts'] =
                    createComponentSource(templateDecorator('<div>\n  <div unknown="{{ctxProp}}"></div>'));
                expect(function () { return compileApp(); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl + "@1:7"));
            });
            it('should create a sourceMap for the template', function () {
                var template = 'Hello World!';
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(sourceMap.file).toEqual(genFile.genFileUrl);
                // the generated file contains code that is not mapped to
                // the template but rather to the original source file (e.g. import statements, ...)
                var templateIndex = sourceMap.sources.indexOf(ngUrl);
                expect(sourceMap.sourcesContent[templateIndex]).toEqual(template);
                // for the mapping to the original source file we don't store the source code
                // as we want to keep whatever TypeScript / ... produced for them.
                var sourceIndex = sourceMap.sources.indexOf(ngComponentPath);
                expect(sourceMap.sourcesContent[sourceIndex]).toBe(' ');
            });
            it('should map elements correctly to the source', function () {
                var template = '<div>\n   <span></span></div>';
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "'span'")))
                    .toEqual({ line: 2, column: 3, source: ngUrl });
            });
            it('should map bindings correctly to the source', function () {
                var template = "<div>\n   <span [title]=\"someMethod()\"></span></div>";
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "someMethod()")))
                    .toEqual({ line: 2, column: 9, source: ngUrl });
            });
            it('should map events correctly to the source', function () {
                var template = "<div>\n   <span (click)=\"someMethod()\"></span></div>";
                appDir['app.component.ts'] = createComponentSource(templateDecorator(template));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, findLineAndColumn(genSource, "someMethod()")))
                    .toEqual({ line: 2, column: 9, source: ngUrl });
            });
            it('should map non template parts to the source file', function () {
                appDir['app.component.ts'] = createComponentSource(templateDecorator('Hello World!'));
                var genFile = compileApp();
                var genSource = compiler_1.toTypeScript(genFile);
                var sourceMap = source_map_util_1.extractSourceMap(genSource);
                expect(source_map_util_1.originalPositionFor(sourceMap, { line: 1, column: 0 }))
                    .toEqual({ line: 1, column: 0, source: ngComponentPath });
            });
        }
    });
    describe('errors', function () {
        it('should only warn if not all arguments of an @Injectable class can be resolved', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Injectable} from '@angular/core';\n\n                @Injectable()\n                export class MyService {\n                  constructor(a: boolean) {}\n                }\n              "
                }
            };
            var warnSpy = spyOn(console, 'warn');
            test_util_1.compile([FILES, angularFiles]);
            expect(warnSpy).toHaveBeenCalledWith("Warning: Can't resolve all parameters for MyService in /app/app.ts: (?). This will become an error in Angular v5.x");
        });
        it('should be able to suppress a null access', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                interface Person { name: string; }\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '{{maybe_person!.name}}'\n                })\n                export class MyComp {\n                  maybe_person?: Person;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            test_util_1.compile([FILES, angularFiles], { postCompile: test_util_1.expectNoDiagnostics });
        });
        it('should not contain a self import in factory', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                interface Person { name: string; }\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '{{person.name}}'\n                })\n                export class MyComp {\n                  person: Person;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            test_util_1.compile([FILES, angularFiles], {
                postCompile: function (program) {
                    var factorySource = program.getSourceFile('/app/app.ngfactory.ts');
                    expect(factorySource.text).not.toContain('\'/app/app.ngfactory\'');
                }
            });
        });
    });
    it('should report when a component is declared in any module', function () {
        var FILES = {
            app: {
                'app.ts': "\n          import {Component, NgModule} from '@angular/core';\n\n          @Component({selector: 'my-comp', template: ''})\n          export class MyComp {}\n\n          @NgModule({})\n          export class MyModule {}\n        "
            }
        };
        expect(function () { return test_util_1.compile([FILES, angularFiles]); })
            .toThrowError(/Cannot determine the module for class MyComp/);
    });
    it('should add the preamble to generated files', function () {
        var FILES = {
            app: {
                'app.ts': "\n              import { NgModule, Component } from '@angular/core';\n\n              @Component({ template: '' })\n              export class AppComponent {}\n\n              @NgModule({ declarations: [ AppComponent ] })\n              export class AppModule { }\n            "
            }
        };
        var genFilePreamble = '/* Hello world! */';
        var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
        var genFile = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/app.ts' && gf.genFileUrl.endsWith('.ts'); });
        var genSource = compiler_1.toTypeScript(genFile, genFilePreamble);
        expect(genSource.startsWith(genFilePreamble)).toBe(true);
    });
    it('should be able to use animation macro methods', function () {
        var FILES = {
            app: {
                'app.ts': "\n      import {Component, NgModule} from '@angular/core';\n      import {trigger, state, style, transition, animate} from '@angular/animations';\n\n      export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';\n\n      @Component({\n        selector: 'app-component',\n        template: '<div></div>',\n        animations: [\n          trigger('bodyExpansion', [\n            state('collapsed', style({height: '0px'})),\n            state('expanded', style({height: '*'})),\n            transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),\n          ]),\n          trigger('displayMode', [\n            state('collapsed', style({margin: '0'})),\n            state('default', style({margin: '16px 0'})),\n            state('flat', style({margin: '0'})),\n            transition('flat <=> collapsed, default <=> collapsed, flat <=> default',\n                      animate(EXPANSION_PANEL_ANIMATION_TIMING)),\n          ]),\n        ],\n      })\n      export class AppComponent { }\n\n      @NgModule({ declarations: [ AppComponent ] })\n      export class AppModule { }\n    "
            }
        };
        test_util_1.compile([FILES, angularFiles]);
    });
    it('should detect an entry component via an indirection', function () {
        var FILES = {
            app: {
                'app.ts': "\n          import {NgModule, ANALYZE_FOR_ENTRY_COMPONENTS} from '@angular/core';\n          import {AppComponent} from './app.component';\n          import {COMPONENT_VALUE, MyComponent} from './my-component';\n\n          @NgModule({\n            declarations: [ AppComponent, MyComponent ],\n            bootstrap: [ AppComponent ],\n            providers: [{\n              provide: ANALYZE_FOR_ENTRY_COMPONENTS,\n              multi: true,\n              useValue: COMPONENT_VALUE\n            }],\n          })\n          export class AppModule { }\n        ",
                'app.component.ts': "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'app-component',\n            template: '<div></div>',\n          })\n          export class AppComponent { }\n        ",
                'my-component.ts': "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'my-component',\n            template: '<div></div>',\n          })\n          export class MyComponent {}\n\n          export const COMPONENT_VALUE = [{a: 'b', component: MyComponent}];\n        "
            }
        };
        var result = test_util_1.compile([FILES, angularFiles]);
        var appModuleFactory = result.genFiles.find(function (f) { return /my-component\.ngfactory/.test(f.genFileUrl); });
        expect(appModuleFactory).toBeDefined();
        if (appModuleFactory) {
            expect(compiler_1.toTypeScript(appModuleFactory)).toContain('MyComponentNgFactory');
        }
    });
    describe('ComponentFactories', function () {
        it('should include inputs, outputs and ng-content selectors in the component factory', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import {Component, NgModule, Input, Output} from '@angular/core';\n\n                @Component({\n                  selector: 'my-comp',\n                  template: '<ng-content></ng-content><ng-content select=\"child\"></ng-content>'\n                })\n                export class MyComp {\n                  @Input('aInputName')\n                  aInputProp: string;\n\n                  @Output('aOutputName')\n                  aOutputProp: any;\n                }\n\n                @NgModule({\n                  declarations: [MyComp]\n                })\n                export class MyModule {}\n              "
                }
            };
            var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
            var genFile = genFiles.find(function (genFile) { return genFile.srcFileUrl === '/app/app.ts'; });
            var genSource = compiler_1.toTypeScript(genFile);
            var createComponentFactoryCall = /ɵccf\([^)]*\)/m.exec(genSource)[0].replace(/\s*/g, '');
            // selector
            expect(createComponentFactoryCall).toContain('my-comp');
            // inputs
            expect(createComponentFactoryCall).toContain("{aInputProp:'aInputName'}");
            // outputs
            expect(createComponentFactoryCall).toContain("{aOutputProp:'aOutputName'}");
            // ngContentSelectors
            expect(createComponentFactoryCall).toContain("['*','child']");
        });
    });
    describe('generated templates', function () {
        it('should not call `check` for directives without bindings nor ngDoCheck/ngOnInit', function () {
            var FILES = {
                app: {
                    'app.ts': "\n                import { NgModule, Component } from '@angular/core';\n\n                @Component({ template: '' })\n                export class AppComponent {}\n\n                @NgModule({ declarations: [ AppComponent ] })\n                export class AppModule { }\n              "
                }
            };
            var genFiles = test_util_1.compile([FILES, angularFiles]).genFiles;
            var genFile = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/app.ts' && gf.genFileUrl.endsWith('.ts'); });
            var genSource = compiler_1.toTypeScript(genFile);
            expect(genSource).not.toContain('check(');
        });
    });
    describe('inheritance with summaries', function () {
        function compileParentAndChild(_a) {
            var parentClassDecorator = _a.parentClassDecorator, parentModuleDecorator = _a.parentModuleDecorator, childClassDecorator = _a.childClassDecorator, childModuleDecorator = _a.childModuleDecorator;
            var libInput = {
                'lib': {
                    'base.ts': "\n              import {Injectable, Pipe, Directive, Component, NgModule} from '@angular/core';\n\n              " + parentClassDecorator + "\n              export class Base {}\n\n              " + parentModuleDecorator + "\n              export class BaseModule {}\n            "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n              import {Injectable, Pipe, Directive, Component, NgModule} from '@angular/core';\n              import {Base} from '../lib/base';\n\n              " + childClassDecorator + "\n              export class Extends extends Base {}\n\n              " + childModuleDecorator + "\n              export class MyModule {}\n            "
                }
            };
            var libOutDir = test_util_1.compile([libInput, angularFiles], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([libOutDir, appInput, angularFiles], { useSummaries: true }).genFiles;
            return genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
        }
        it('should inherit ctor and lifecycle hooks from classes in other compilation units', function () {
            var libInput = {
                'lib': {
                    'base.ts': "\n            export class AParam {}\n\n            export class Base {\n              constructor(a: AParam) {}\n              ngOnDestroy() {}\n            }\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            import {NgModule, Component} from '@angular/core';\n            import {Base} from '../lib/base';\n\n            @Component({template: ''})\n            export class Extends extends Base {}\n\n            @NgModule({\n              declarations: [Extends]\n            })\n            export class MyModule {}\n          "
                }
            };
            var libOutDir = test_util_1.compile([libInput, angularFiles], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([libOutDir, appInput, angularFiles], { useSummaries: true }).genFiles;
            var mainNgFactory = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
            var flags = 16384 /* TypeDirective */ | 32768 /* Component */ | 131072 /* OnDestroy */;
            expect(compiler_1.toTypeScript(mainNgFactory))
                .toContain(flags + ",(null as any),0,i1.Extends,[i2.AParam]");
        });
        it('should inherit ctor and lifecycle hooks from classes in other compilation units over 2 levels', function () {
            var lib1Input = {
                'lib1': {
                    'base.ts': "\n            export class AParam {}\n\n            export class Base {\n              constructor(a: AParam) {}\n              ngOnDestroy() {}\n            }\n          "
                }
            };
            var lib2Input = {
                'lib2': {
                    'middle.ts': "\n            import {Base} from '../lib1/base';\n            export class Middle extends Base {}\n          "
                }
            };
            var appInput = {
                'app': {
                    'main.ts': "\n            import {NgModule, Component} from '@angular/core';\n            import {Middle} from '../lib2/middle';\n\n            @Component({template: ''})\n            export class Extends extends Middle {}\n\n            @NgModule({\n              declarations: [Extends]\n            })\n            export class MyModule {}\n          "
                }
            };
            var lib1OutDir = test_util_1.compile([lib1Input, angularFiles], { useSummaries: true }).outDir;
            var lib2OutDir = test_util_1.compile([lib1OutDir, lib2Input, angularFiles], { useSummaries: true }).outDir;
            var genFiles = test_util_1.compile([lib2OutDir, appInput, angularFiles], { useSummaries: true }).genFiles;
            var mainNgFactory = genFiles.find(function (gf) { return gf.srcFileUrl === '/app/main.ts'; });
            var flags = 16384 /* TypeDirective */ | 32768 /* Component */ | 131072 /* OnDestroy */;
            expect(compiler_1.toTypeScript(mainNgFactory))
                .toContain(flags + ",(null as any),0,i1.Extends,[i2.AParam_2]");
        });
        describe('Injectable', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: '@Injectable()',
                    parentModuleDecorator: '@NgModule({providers: [Base]})',
                    childClassDecorator: '@Injectable()',
                    childModuleDecorator: '@NgModule({providers: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: '@Injectable()',
                    parentModuleDecorator: '@NgModule({providers: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({providers: [Extends]})',
                }); })
                    .toThrowError('Class Extends in /app/main.ts extends from a Injectable in another compilation unit without duplicating the decorator. ' +
                    'Please add a Injectable or Pipe or Directive or Component or NgModule decorator to the class.');
            });
        });
        describe('Component', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Component({template: ''})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Component({template: ''})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})'
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Component({template: ''})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError('Class Extends in /app/main.ts extends from a Directive in another compilation unit without duplicating the decorator. ' +
                    'Please add a Directive or Component decorator to the class.');
            });
        });
        describe('Directive', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Directive({selector: '[someDir]'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Directive({selector: '[someDir]'})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Directive({selector: '[someDir]'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError('Class Extends in /app/main.ts extends from a Directive in another compilation unit without duplicating the decorator. ' +
                    'Please add a Directive or Component decorator to the class.');
            });
        });
        describe('Pipe', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@Pipe({name: 'somePipe'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: "@Pipe({name: 'somePipe'})",
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@Pipe({name: 'somePipe'})",
                    parentModuleDecorator: '@NgModule({declarations: [Base]})',
                    childClassDecorator: '',
                    childModuleDecorator: '@NgModule({declarations: [Extends]})',
                }); })
                    .toThrowError('Class Extends in /app/main.ts extends from a Pipe in another compilation unit without duplicating the decorator. ' +
                    'Please add a Pipe decorator to the class.');
            });
        });
        describe('NgModule', function () {
            it('should allow to inherit', function () {
                var mainNgFactory = compileParentAndChild({
                    parentClassDecorator: "@NgModule()",
                    parentModuleDecorator: '',
                    childClassDecorator: "@NgModule()",
                    childModuleDecorator: '',
                });
                expect(mainNgFactory).toBeTruthy();
            });
            it('should error if the child class has no matching decorator', function () {
                expect(function () { return compileParentAndChild({
                    parentClassDecorator: "@NgModule()",
                    parentModuleDecorator: '',
                    childClassDecorator: '',
                    childModuleDecorator: '',
                }); })
                    .toThrowError('Class Extends in /app/main.ts extends from a NgModule in another compilation unit without duplicating the decorator. ' +
                    'Please add a NgModule decorator to the class.');
            });
        });
    });
});
describe('compiler (bundled Angular)', function () {
    test_util_1.setup({ compileAngular: false, compileAnimations: false });
    var angularFiles;
    beforeAll(function () {
        var emittingHost = new test_util_1.EmittingCompilerHost(['@angular/core/index'], { emitMetadata: false });
        // Create the metadata bundled
        var indexModule = emittingHost.effectiveName('@angular/core/index');
        var bundler = new tsc_wrapped_1.MetadataBundler(indexModule, '@angular/core', new test_util_1.MockMetadataBundlerHost(emittingHost));
        var bundle = bundler.getMetadataBundle();
        var metadata = JSON.stringify(bundle.metadata, null, ' ');
        var bundleIndexSource = tsc_wrapped_1.privateEntriesToIndex('./index', bundle.privates);
        emittingHost.override('@angular/core/bundle_index.ts', bundleIndexSource);
        emittingHost.addWrittenFile('@angular/core/package.json', JSON.stringify({ typings: 'bundle_index.d.ts' }));
        emittingHost.addWrittenFile('@angular/core/bundle_index.metadata.json', metadata);
        // Emit the sources
        var bundleIndexName = emittingHost.effectiveName('@angular/core/bundle_index.ts');
        var emittingProgram = ts.createProgram([bundleIndexName], test_util_1.settings, emittingHost);
        emittingProgram.emit();
        angularFiles = emittingHost.writtenAngularFiles();
    });
    describe('Quickstart', function () {
        it('should compile', function () {
            var genFiles = test_util_1.compile([QUICKSTART, angularFiles]).genFiles;
            expect(genFiles.find(function (f) { return /app\.component\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
            expect(genFiles.find(function (f) { return /app\.module\.ngfactory\.ts/.test(f.genFileUrl); })).toBeDefined();
        });
    });
    describe('Bundled library', function () {
        var libraryFiles;
        beforeAll(function () {
            // Emit the library bundle
            var emittingHost = new test_util_1.EmittingCompilerHost(['/bolder/index.ts'], { emitMetadata: false, mockData: LIBRARY });
            // Create the metadata bundled
            var indexModule = '/bolder/public-api';
            var bundler = new tsc_wrapped_1.MetadataBundler(indexModule, 'bolder', new test_util_1.MockMetadataBundlerHost(emittingHost));
            var bundle = bundler.getMetadataBundle();
            var metadata = JSON.stringify(bundle.metadata, null, ' ');
            var bundleIndexSource = tsc_wrapped_1.privateEntriesToIndex('./public-api', bundle.privates);
            emittingHost.override('/bolder/index.ts', bundleIndexSource);
            emittingHost.addWrittenFile('/bolder/index.metadata.json', metadata);
            // Emit the sources
            var emittingProgram = ts.createProgram(['/bolder/index.ts'], test_util_1.settings, emittingHost);
            emittingProgram.emit();
            var libFiles = emittingHost.written;
            // Copy the .html file
            var htmlFileName = '/bolder/src/bolder.component.html';
            libFiles.set(htmlFileName, emittingHost.readFile(htmlFileName));
            libraryFiles = test_util_1.arrayToMockDir(test_util_1.toMockFileArray(libFiles).map(function (_a) {
                var fileName = _a.fileName, content = _a.content;
                return ({ fileName: "/node_modules" + fileName, content: content });
            }));
        });
        it('should compile', function () { return test_util_1.compile([LIBRARY_USING_APP, libraryFiles, angularFiles]); });
    });
});
var QUICKSTART = {
    quickstart: {
        app: {
            'app.component.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<h1>Hello {{name}}</h1>'\n        })\n        export class AppComponent {\n          name = 'Angular';\n        }\n      ",
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { toString }      from './utils';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      ",
            // #15420
            'utils.ts': "\n        export function toString(value: any): string {\n          return  '';\n        }\n      "
        }
    }
};
var LIBRARY = {
    bolder: {
        'public-api.ts': "\n      export * from './src/bolder.component';\n      export * from './src/bolder.module';\n    ",
        src: {
            'bolder.component.ts': "\n        import {Component, Input} from '@angular/core';\n\n        @Component({\n          selector: 'bolder',\n          templateUrl: './bolder.component.html'\n        })\n        export class BolderComponent {\n          @Input() data: string;\n        }\n      ",
            'bolder.component.html': "\n        <b>{{data}}</b>\n      ",
            'bolder.module.ts': "\n        import {NgModule} from '@angular/core';\n        import {BolderComponent} from './bolder.component';\n\n        @NgModule({\n          declarations: [BolderComponent],\n          exports: [BolderComponent]\n        })\n        export class BolderModule {}\n      "
        }
    }
};
var LIBRARY_USING_APP = {
    'lib-user': {
        app: {
            'app.component.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<h1>Hello <bolder [data]=\"name\"></bolder></h1>'\n        })\n        export class AppComponent {\n          name = 'Angular';\n        }\n      ",
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { BolderModule }  from 'bolder';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ],\n          imports:      [ BolderModule ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvYW90L2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBOEQ7QUFFOUQsb0RBQTRFO0FBQzVFLCtCQUFpQztBQUVqQyw2REFBZ0Y7QUFFaEYseUNBQXlLO0FBRXpLLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRTtJQUN2QyxJQUFJLFlBQVksR0FBRyxpQkFBSyxFQUFFLENBQUM7SUFFM0IsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFDWixJQUFBLG1FQUFRLENBQXdDO1lBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsK0JBQStCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQU0sYUFBYSxHQUFHLHVCQUF1QixDQUFDO1FBQzlDLElBQU0sZUFBZSxHQUFHLDRCQUE0QixDQUFDO1FBRXJELElBQUksT0FBc0IsQ0FBQztRQUMzQixJQUFJLE1BQXFCLENBQUM7UUFFMUIsVUFBVSxDQUFDO1lBQ1QsTUFBTSxHQUFHO2dCQUNQLGVBQWUsRUFBRSwwVUFVWjthQUNOLENBQUM7WUFD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