"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test_support_1 = require("@angular/tsc-wrapped/test/test_support");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var ngc_1 = require("../src/ngc");
var perform_compile_1 = require("../src/perform-compile");
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
describe('ngc command-line', function () {
    var basePath;
    var outDir;
    var write;
    function writeConfig(tsconfig) {
        if (tsconfig === void 0) { tsconfig = '{"extends": "./tsconfig-base.json"}'; }
        write('tsconfig.json', tsconfig);
    }
    beforeEach(function () {
        basePath = test_support_1.makeTempDir();
        write = function (fileName, content) {
            var dir = path.dirname(fileName);
            if (dir != '.') {
                var newDir = path.join(basePath, dir);
                if (!fs.existsSync(newDir))
                    fs.mkdirSync(newDir);
            }
            fs.writeFileSync(path.join(basePath, fileName), content, { encoding: 'utf-8' });
        };
        write('tsconfig-base.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"skipLibCheck\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true,\n        \"module\": \"es2015\",\n        \"moduleResolution\": \"node\",\n        \"lib\": [\"es6\", \"dom\"]\n      }\n    }");
        outDir = path.resolve(basePath, 'built');
        var ngRootDir = getNgRootDir();
        var nodeModulesPath = path.resolve(basePath, 'node_modules');
        fs.mkdirSync(nodeModulesPath);
        fs.symlinkSync(path.resolve(ngRootDir, 'dist', 'all', '@angular'), path.resolve(nodeModulesPath, '@angular'));
        fs.symlinkSync(path.resolve(ngRootDir, 'node_modules', 'rxjs'), path.resolve(nodeModulesPath, 'rxjs'));
    });
    it('should compile without errors', function () {
        writeConfig();
        write('test.ts', 'export const A = 1;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var result = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error).not.toHaveBeenCalled();
        expect(result).toBe(0);
    });
    it('should be able to be called without a config file by passing options explicitly', function () {
        write('test.ts', 'export const A = 1;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        expect(function () { return perform_compile_1.performCompilation(basePath, [path.join(basePath, 'test.ts')], {
            experimentalDecorators: true,
            skipLibCheck: true,
            types: [],
            outDir: path.join(basePath, 'built'),
            declaration: true,
            module: ts.ModuleKind.ES2015,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
        }, {}); })
            .not.toThrow();
    });
    it('should not print the stack trace if user input file does not exist', function () {
        writeConfig("{\n      \"extends\": \"./tsconfig-base.json\",\n      \"files\": [\"test.ts\"]\n    }");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error)
            .toHaveBeenCalledWith("error TS6053: File '" + path.join(basePath, 'test.ts') + "' not found." +
            '\n');
        expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(1);
    });
    it('should not print the stack trace if user input file is malformed', function () {
        writeConfig();
        write('test.ts', 'foo;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error)
            .toHaveBeenCalledWith("test.ts(1,1): error TS2304: Cannot find name 'foo'." +
            '\n');
        expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(1);
    });
    it('should not print the stack trace if cannot find the imported module', function () {
        writeConfig();
        write('test.ts', "import {MyClass} from './not-exist-deps';");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error)
            .toHaveBeenCalledWith("test.ts(1,23): error TS2307: Cannot find module './not-exist-deps'." +
            '\n');
        expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(1);
    });
    it('should not print the stack trace if cannot import', function () {
        writeConfig();
        write('empty-deps.ts', 'export const A = 1;');
        write('test.ts', "import {MyClass} from './empty-deps';");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error)
            .toHaveBeenCalledWith("test.ts(1,9): error TS2305: Module '\"" + path.join(basePath, 'empty-deps') +
            "\"' has no exported member 'MyClass'." +
            '\n');
        expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(1);
    });
    it('should not print the stack trace if type mismatches', function () {
        writeConfig();
        write('empty-deps.ts', 'export const A = "abc";');
        write('test.ts', "\n      import {A} from './empty-deps';\n      A();\n    ");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
        expect(mockConsole.error)
            .toHaveBeenCalledWith('test.ts(3,7): error TS2349: Cannot invoke an expression whose type lacks a call signature. ' +
            'Type \'String\' has no compatible call signatures.\n');
        expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(1);
    });
    it('should print the stack trace on compiler internal errors', function () {
        write('test.ts', 'export const A = 1;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        var exitCode = ngc_1.main(['-p', 'not-exist'], mockConsole.error);
        expect(mockConsole.error).toHaveBeenCalled();
        expect(mockConsole.error).toHaveBeenCalledWith('Compilation failed');
        expect(exitCode).toEqual(2);
    });
    describe('compile ngfactory files', function () {
        it('should report errors for ngfactory files that are not referenced by root files', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: '{{unknownProp}}'})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
            var mockConsole = { error: function (s) { } };
            var errorSpy = spyOn(mockConsole, 'error');
            var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain('Error at ng://' + path.join(basePath, 'mymodule.ts.MyComp.html'));
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain("Property 'unknownProp' does not exist on type 'MyComp'");
            expect(exitCode).toEqual(1);
        });
        it('should report errors as coming from the html file, not the factory', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('my.component.ts', "\n        import {Component} from '@angular/core';\n        @Component({templateUrl: './my.component.html'})\n        export class MyComp {}\n      ");
            write('my.component.html', "<h1>\n        {{unknownProp}}\n       </h1>");
            write('mymodule.ts', "\n        import {NgModule} from '@angular/core';\n        import {MyComp} from './my.component';\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
            var mockConsole = { error: function (s) { } };
            var errorSpy = spyOn(mockConsole, 'error');
            var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain('Error at ng://' + path.join(basePath, 'my.component.html(1,5):'));
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain("Property 'unknownProp' does not exist on type 'MyComp'");
            expect(exitCode).toEqual(1);
        });
        it('should compile ngfactory files that are not referenced by root files', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            var exitCode = ngc_1.main(['-p', basePath]);
            expect(exitCode).toEqual(0);
            expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(true);
            expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'src', 'application_module.ngfactory.js')))
                .toBe(true);
        });
        it('should compile with an explicit tsconfig reference', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            var exitCode = ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')]);
            expect(exitCode).toEqual(0);
            expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(true);
            expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'src', 'application_module.ngfactory.js')))
                .toBe(true);
        });
        describe('closure', function () {
            it('should not generate closure specific code by default', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: ''})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var mockConsole = { error: function (s) { } };
                var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).not.toContain('@fileoverview added by tsickle');
                expect(mymoduleSource).toContain('MyComp.decorators = [');
            });
            it('should add closure annotations', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"annotateForClosureCompiler\": true\n          },\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: ''})\n        export class MyComp {\n          fn(p: any) {}\n        }\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var mockConsole = { error: function (s) { } };
                var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('@fileoverview added by tsickle');
                expect(mymoduleSource).toContain('@param {?} p');
            });
            it('should add metadata as decorators', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"annotationsAs\": \"decorators\"\n          },\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: ''})\n        export class MyComp {\n          fn(p: any) {}\n        }\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var mockConsole = { error: function (s) { } };
                var exitCode = ngc_1.main(['-p', basePath], mockConsole.error);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('MyComp = __decorate([');
            });
        });
        describe('expression lowering', function () {
            beforeEach(function () {
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"files\": [\"mymodule.ts\"]\n          }");
            });
            function compile() {
                var errors = [];
                var result = ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')], function (s) { return errors.push(s); });
                expect(errors).toEqual([]);
                return result;
            }
            it('should be able to lower a lambda expression in a provider', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: () => new Foo()}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0');
                var mymodulefactory = path.resolve(outDir, 'mymodule.ngfactory.js');
                var mymodulefactorySource = fs.readFileSync(mymodulefactory, 'utf8');
                expect(mymodulefactorySource).toContain('"someToken", i1.ɵ0');
            });
            it('should be able to lower a function expression in a provider', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: function() {return new Foo();}}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0');
                var mymodulefactory = path.resolve(outDir, 'mymodule.ngfactory.js');
                var mymodulefactorySource = fs.readFileSync(mymodulefactory, 'utf8');
                expect(mymodulefactorySource).toContain('"someToken", i1.ɵ0');
            });
            it('should able to lower multiple expressions', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()}\n            ]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ1 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ2 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ3 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0, ɵ1, ɵ2, ɵ3');
            });
            it('should be able to lower an indirect expression', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          const factory = () => new Foo();\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: factory}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0, 'Compile failed');
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0');
            });
            it('should not lower a lambda that is already exported', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          export class Foo {}\n\n          export const factory = () => new Foo();\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: factory}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).not.toContain('ɵ0');
            });
        });
        var shouldExist = function (fileName) {
            if (!fs.existsSync(path.resolve(outDir, fileName))) {
                throw new Error("Expected " + fileName + " to be emitted (outDir: " + outDir + ")");
            }
        };
        var shouldNotExist = function (fileName) {
            if (fs.existsSync(path.resolve(outDir, fileName))) {
                throw new Error("Did not expect " + fileName + " to be emitted (outDir: " + outDir + ")");
            }
        };
        it('should be able to generate a flat module library', function () {
            writeConfig("\n        {\n          \"angularCompilerOptions\": {\n            \"genDir\": \"ng\",\n            \"flatModuleId\": \"flat_module\",\n            \"flatModuleOutFile\": \"index.js\",\n            \"skipTemplateCodegen\": true\n          },\n\n          \"compilerOptions\": {\n            \"target\": \"es5\",\n            \"experimentalDecorators\": true,\n            \"noImplicitAny\": true,\n            \"moduleResolution\": \"node\",\n            \"rootDir\": \"\",\n            \"declaration\": true,\n            \"lib\": [\"es6\", \"dom\"],\n            \"baseUrl\": \".\",\n            \"outDir\": \"built\",\n            \"typeRoots\": [\"node_modules/@types\"]\n        },\n\n        \"files\": [\"public-api.ts\"]\n        }\n      ");
            write('public-api.ts', "\n        export * from './src/flat.component';\n        export * from './src/flat.module';");
            write('src/flat.component.html', '<div>flat module component</div>');
            write('src/flat.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'flat-comp',\n          templateUrl: 'flat.component.html',\n        })\n        export class FlatComponent {\n        }");
            write('src/flat.module.ts', "\n        import {NgModule} from '@angular/core';\n\n        import {FlatComponent} from './flat.component';\n\n        @NgModule({\n          declarations: [\n            FlatComponent,\n          ],\n          exports: [\n            FlatComponent,\n          ]\n        })\n        export class FlatModule {\n        }");
            var exitCode = ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')]);
            expect(exitCode).toEqual(0);
            shouldExist('index.js');
            shouldExist('index.metadata.json');
        });
        it('should be able to build a flat module passing explicit options', function () {
            write('public-api.ts', "\n        export * from './src/flat.component';\n        export * from './src/flat.module';");
            write('src/flat.component.html', '<div>flat module component</div>');
            write('src/flat.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'flat-comp',\n          templateUrl: 'flat.component.html',\n        })\n        export class FlatComponent {\n        }");
            write('src/flat.module.ts', "\n        import {NgModule} from '@angular/core';\n\n        import {FlatComponent} from './flat.component';\n\n        @NgModule({\n          declarations: [\n            FlatComponent,\n          ],\n          exports: [\n            FlatComponent,\n          ]\n        })\n        export class FlatModule {\n        }");
            var emitResult = perform_compile_1.performCompilation(basePath, [path.join(basePath, 'public-api.ts')], {
                target: ts.ScriptTarget.ES5,
                experimentalDecorators: true,
                noImplicitAny: true,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                rootDir: basePath,
                declaration: true,
                lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
                baseUrl: basePath,
                outDir: path.join(basePath, 'built'),
                typeRoots: [path.join(basePath, 'node_modules/@types')]
            }, {
                genDir: 'ng',
                flatModuleId: 'flat_module',
                flatModuleOutFile: 'index.js',
                skipTemplateCodegen: true
            });
            expect(emitResult.errorCode).toEqual(0);
            shouldExist('index.js');
            shouldExist('index.metadata.json');
        });
        describe('with a third-party library', function () {
            var writeGenConfig = function (skipCodegen) {
                writeConfig("{\n          \"angularCompilerOptions\": {\n            \"skipTemplateCodegen\": " + skipCodegen + ",\n            \"enableSummariesForJit\": true\n          },\n          \"compilerOptions\": {\n            \"target\": \"es5\",\n            \"experimentalDecorators\": true,\n            \"noImplicitAny\": true,\n            \"moduleResolution\": \"node\",\n            \"rootDir\": \"\",\n            \"declaration\": true,\n            \"lib\": [\"es6\", \"dom\"],\n            \"baseUrl\": \".\",\n            \"outDir\": \"built\",\n            \"typeRoots\": [\"node_modules/@types\"]\n          }\n        }");
            };
            beforeEach(function () {
                write('comp.ts', "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'third-party-comp',\n            template: '<div>3rdP-component</div>',\n          })\n          export class ThirdPartyComponent {\n          }");
                write('directive.ts', "\n          import {Directive, Input} from '@angular/core';\n\n          @Directive({\n            selector: '[thirdParty]',\n            host: {'[title]': 'thirdParty'},\n          })\n          export class ThirdPartyDirective {\n            @Input() thirdParty: string;\n          }");
                write('module.ts', "\n          import {NgModule} from '@angular/core';\n\n          import {ThirdPartyComponent} from './comp';\n          import {ThirdPartyDirective} from './directive';\n          import {AnotherThirdPartyModule} from './other_module';\n\n          @NgModule({\n            declarations: [\n              ThirdPartyComponent,\n              ThirdPartyDirective,\n            ],\n            exports: [\n              AnotherThirdPartyModule,\n              ThirdPartyComponent,\n              ThirdPartyDirective,\n            ],\n            imports: [AnotherThirdPartyModule]\n          })\n          export class ThirdpartyModule {\n          }");
                write('other_comp.ts', "\n          import {Component} from '@angular/core';\n\n          @Component({\n            selector: 'another-third-party-comp',\n            template: `<div i18n>other-3rdP-component\n          multi-lines</div>`,\n          })\n          export class AnotherThirdpartyComponent {\n          }");
                write('other_module.ts', "\n          import {NgModule} from '@angular/core';\n          import {AnotherThirdpartyComponent} from './other_comp';\n\n          @NgModule({\n            declarations: [AnotherThirdpartyComponent],\n            exports: [AnotherThirdpartyComponent],\n          })\n          export class AnotherThirdPartyModule {\n          }");
            });
            var modules = ['comp', 'directive', 'module', 'other_comp', 'other_module'];
            it('should honor skip code generation', function () {
                // First ensure that we skip code generation when requested;.
                writeGenConfig(/* skipCodegen */ true);
                var exitCode = ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')]);
                expect(exitCode).toEqual(0);
                modules.forEach(function (moduleName) {
                    shouldExist(moduleName + '.js');
                    shouldExist(moduleName + '.d.ts');
                    shouldExist(moduleName + '.metadata.json');
                    shouldNotExist(moduleName + '.ngfactory.js');
                    shouldNotExist(moduleName + '.ngfactory.d.ts');
                    shouldNotExist(moduleName + '.ngsummary.js');
                    shouldNotExist(moduleName + '.ngsummary.d.ts');
                    shouldNotExist(moduleName + '.ngsummary.json');
                });
            });
            it('should produce factories', function () {
                // First ensure that we skip code generation when requested;.
                writeGenConfig(/* skipCodegen */ false);
                var exitCode = ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')]);
                expect(exitCode).toEqual(0);
                modules.forEach(function (moduleName) {
                    shouldExist(moduleName + '.js');
                    shouldExist(moduleName + '.d.ts');
                    shouldExist(moduleName + '.metadata.json');
                    if (!/(directive)|(pipe)/.test(moduleName)) {
                        shouldExist(moduleName + '.ngfactory.js');
                        shouldExist(moduleName + '.ngfactory.d.ts');
                    }
                    shouldExist(moduleName + '.ngsummary.js');
                    shouldExist(moduleName + '.ngsummary.d.ts');
                    shouldExist(moduleName + '.ngsummary.json');
                    shouldNotExist(moduleName + '.ngfactory.metadata.json');
                    shouldNotExist(moduleName + '.ngsummary.metadata.json');
                });
            });
        });
        describe('with tree example', function () {
            beforeEach(function () {
                writeConfig();
                write('index_aot.ts', "\n          import {enableProdMode} from '@angular/core';\n          import {platformBrowser} from '@angular/platform-browser';\n\n          import {AppModuleNgFactory} from './tree.ngfactory';\n\n          enableProdMode();\n          platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);");
                write('tree.ts', "\n          import {Component, NgModule} from '@angular/core';\n          import {CommonModule} from '@angular/common';\n\n          @Component({\n            selector: 'tree',\n            inputs: ['data'],\n            template:\n                `<span [style.backgroundColor]=\"bgColor\"> {{data.value}} </span><tree *ngIf='data.right != null' [data]='data.right'></tree><tree *ngIf='data.left != null' [data]='data.left'></tree>`\n          })\n          export class TreeComponent {\n            data: any;\n            bgColor = 0;\n          }\n\n          @NgModule({imports: [CommonModule], bootstrap: [TreeComponent], declarations: [TreeComponent]})\n          export class AppModule {}\n        ");
            });
            it('should compile without error', function () {
                expect(ngc_1.main(['-p', path.join(basePath, 'tsconfig.json')])).toBe(0);
            });
        });
        describe('with summary libraries', function () {
            // TODO{chuckj}: Emitting using summaries only works if outDir is set to '.'
            var shouldExist = function (fileName) {
                if (!fs.existsSync(path.resolve(basePath, fileName))) {
                    throw new Error("Expected " + fileName + " to be emitted (basePath: " + basePath + ")");
                }
            };
            var shouldNotExist = function (fileName) {
                if (fs.existsSync(path.resolve(basePath, fileName))) {
                    throw new Error("Did not expect " + fileName + " to be emitted (basePath: " + basePath + ")");
                }
            };
            beforeEach(function () {
                var writeConfig = function (dir) {
                    write(path.join(dir, 'tsconfig.json'), "\n          {\n            \"angularCompilerOptions\": {\n              \"generateCodeForLibraries\": true,\n              \"enableSummariesForJit\": true\n            },\n            \"compilerOptions\": {\n              \"target\": \"es5\",\n              \"experimentalDecorators\": true,\n              \"noImplicitAny\": true,\n              \"moduleResolution\": \"node\",\n              \"rootDir\": \"\",\n              \"declaration\": true,\n              \"lib\": [\"es6\", \"dom\"],\n              \"baseUrl\": \".\",\n              \"paths\": { \"lib1/*\": [\"../lib1/*\"], \"lib2/*\": [\"../lib2/*\"] },\n              \"typeRoots\": []\n            }\n          }");
                };
                // Lib 1
                writeConfig('lib1');
                write('lib1/module.ts', "\n          import {NgModule} from '@angular/core';\n\n          export function someFactory(): any { return null; }\n\n          @NgModule({\n            providers: [{provide: 'foo', useFactory: someFactory}]\n          })\n          export class Module {}\n        ");
                // Lib 2
                writeConfig('lib2');
                write('lib2/module.ts', "\n          export {Module} from 'lib1/module';\n        ");
                // Application
                writeConfig('app');
                write('app/main.ts', "\n          import {NgModule, Inject} from '@angular/core';\n          import {Module} from 'lib2/module';\n\n          @NgModule({\n            imports: [Module]\n          })\n          export class AppModule {\n            constructor(@Inject('foo') public foo: any) {}\n          }\n        ");
            });
            it('should be able to compile library 1', function () {
                expect(ngc_1.main(['-p', path.join(basePath, 'lib1')])).toBe(0);
                shouldExist('lib1/module.js');
                shouldExist('lib1/module.ngsummary.json');
                shouldExist('lib1/module.ngsummary.js');
                shouldExist('lib1/module.ngsummary.d.ts');
                shouldExist('lib1/module.ngfactory.js');
                shouldExist('lib1/module.ngfactory.d.ts');
            });
            it('should be able to compile library 2', function () {
                expect(ngc_1.main(['-p', path.join(basePath, 'lib1')])).toBe(0);
                expect(ngc_1.main(['-p', path.join(basePath, 'lib2')])).toBe(0);
                shouldExist('lib2/module.js');
                shouldExist('lib2/module.ngsummary.json');
                shouldExist('lib2/module.ngsummary.js');
                shouldExist('lib2/module.ngsummary.d.ts');
                shouldExist('lib2/module.ngfactory.js');
                shouldExist('lib2/module.ngfactory.d.ts');
            });
            describe('building an application', function () {
                beforeEach(function () {
                    expect(ngc_1.main(['-p', path.join(basePath, 'lib1')])).toBe(0);
                    expect(ngc_1.main(['-p', path.join(basePath, 'lib2')])).toBe(0);
                });
                it('should build without error', function () {
                    expect(ngc_1.main(['-p', path.join(basePath, 'app')])).toBe(0);
                    shouldExist('app/main.js');
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9uZ2Nfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVFQUFtRTtBQUNuRSx1QkFBeUI7QUFDekIsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxrQ0FBZ0M7QUFDaEMsMERBQTZFO0FBRTdFO0lBQ0UsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNELElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUksS0FBa0QsQ0FBQztJQUV2RCxxQkFBcUIsUUFBd0Q7UUFBeEQseUJBQUEsRUFBQSxnREFBd0Q7UUFDM0UsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsVUFBVSxDQUFDO1FBQ1QsUUFBUSxHQUFHLDBCQUFXLEVBQUUsQ0FBQztRQUN6QixLQUFLLEdBQUcsVUFBQyxRQUFnQixFQUFFLE9BQWU7WUFDeEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsRUFBRSxD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