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
var main_1 = require("../src/main");
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
describe('compiler-cli', function () {
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
            fs.writeFileSync(path.join(basePath, fileName), content, { encoding: 'utf-8' });
        };
        write('tsconfig-base.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"declaration\": true,\n        \"module\": \"es2015\",\n        \"moduleResolution\": \"node\",\n        \"lib\": [\"es6\", \"dom\"]\n      }\n    }");
        outDir = path.resolve(basePath, 'built');
        var ngRootDir = getNgRootDir();
        var nodeModulesPath = path.resolve(basePath, 'node_modules');
        fs.mkdirSync(nodeModulesPath);
        fs.symlinkSync(path.resolve(ngRootDir, 'dist', 'all', '@angular'), path.resolve(nodeModulesPath, '@angular'));
        fs.symlinkSync(path.resolve(ngRootDir, 'node_modules', 'rxjs'), path.resolve(nodeModulesPath, 'rxjs'));
    });
    it('should compile without errors', function (done) {
        writeConfig();
        write('test.ts', 'export const A = 1;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error).not.toHaveBeenCalled();
            expect(exitCode).toEqual(0);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should not print the stack trace if user input file does not exist', function (done) {
        writeConfig("{\n      \"extends\": \"./tsconfig-base.json\",\n      \"files\": [\"test.ts\"]\n    }");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error)
                .toHaveBeenCalledWith("Error File '" + path.join(basePath, 'test.ts') + "' not found.");
            expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should not print the stack trace if user input file is malformed', function (done) {
        writeConfig();
        write('test.ts', 'foo;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error)
                .toHaveBeenCalledWith('Error at ' + path.join(basePath, 'test.ts') + ":1:1: Cannot find name 'foo'.");
            expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should not print the stack trace if cannot find the imported module', function (done) {
        writeConfig();
        write('test.ts', "import {MyClass} from './not-exist-deps';");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error)
                .toHaveBeenCalledWith('Error at ' + path.join(basePath, 'test.ts') +
                ":1:23: Cannot find module './not-exist-deps'.");
            expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should not print the stack trace if cannot import', function (done) {
        writeConfig();
        write('empty-deps.ts', 'export const A = 1;');
        write('test.ts', "import {MyClass} from './empty-deps';");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error)
                .toHaveBeenCalledWith('Error at ' + path.join(basePath, 'test.ts') + ":1:9: Module '\"" +
                path.join(basePath, 'empty-deps') + "\"' has no exported member 'MyClass'.");
            expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should not print the stack trace if type mismatches', function (done) {
        writeConfig();
        write('empty-deps.ts', 'export const A = "abc";');
        write('test.ts', "\n      import {A} from './empty-deps';\n      A();\n    ");
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: basePath }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error)
                .toHaveBeenCalledWith('Error at ' + path.join(basePath, 'test.ts') +
                ':3:7: Cannot invoke an expression whose type lacks a call signature. ' +
                'Type \'String\' has no compatible call signatures.');
            expect(mockConsole.error).not.toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    it('should print the stack trace on compiler internal errors', function (done) {
        write('test.ts', 'export const A = 1;');
        var mockConsole = { error: function (s) { } };
        spyOn(mockConsole, 'error');
        main_1.main({ p: 'not-exist' }, mockConsole.error)
            .then(function (exitCode) {
            expect(mockConsole.error).toHaveBeenCalled();
            expect(mockConsole.error).toHaveBeenCalledWith('Compilation failed');
            expect(exitCode).toEqual(1);
            done();
        })
            .catch(function (e) { return done.fail(e); });
    });
    describe('compile ngfactory files', function () {
        it('should only compile ngfactory files that are referenced by root files by default', function (done) {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            main_1.main({ p: basePath })
                .then(function (exitCode) {
                expect(exitCode).toEqual(0);
                expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(false);
                done();
            })
                .catch(function (e) { return done.fail(e); });
        });
        it('should report errors for ngfactory files that are not referenced by root files', function (done) {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"],\n          \"angularCompilerOptions\": {\n            \"alwaysCompileGeneratedCode\": true\n          }\n        }");
            write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: '{{unknownProp}}'})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
            var mockConsole = { error: function (s) { } };
            var errorSpy = spyOn(mockConsole, 'error');
            main_1.main({ p: basePath }, mockConsole.error)
                .then(function (exitCode) {
                expect(errorSpy).toHaveBeenCalledTimes(1);
                expect(errorSpy.calls.mostRecent().args[0])
                    .toContain('Error at ' + path.join(basePath, 'mymodule.ngfactory.ts'));
                expect(errorSpy.calls.mostRecent().args[0])
                    .toContain("Property 'unknownProp' does not exist on type 'MyComp'");
                expect(exitCode).toEqual(1);
                done();
            })
                .catch(function (e) { return done.fail(e); });
        });
        it('should compile ngfactory files that are not referenced by root files', function (done) {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"],\n          \"angularCompilerOptions\": {\n            \"alwaysCompileGeneratedCode\": true\n          }\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            main_1.main({ p: basePath })
                .then(function (exitCode) {
                expect(exitCode).toEqual(0);
                expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(true);
                expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'src', 'application_module.ngfactory.js')))
                    .toBe(true);
                done();
            })
                .catch(function (e) { return done.fail(e); });
        });
        it('should not produce ngsummary files by default', function (done) {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {NgModule} from '@angular/core';\n\n        @NgModule()\n        export class MyModule {}\n      ");
            main_1.main({ p: basePath })
                .then(function (exitCode) {
                expect(exitCode).toEqual(0);
                expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngsummary.js'))).toBe(false);
                done();
            })
                .catch(function (e) { return done.fail(e); });
        });
        it('should produce ngsummary files if configured', function (done) {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"],\n          \"angularCompilerOptions\": {\n            \"enableSummariesForJit\": true,\n            \"alwaysCompileGeneratedCode\": true\n          }\n        }");
            write('mymodule.ts', "\n        import {NgModule} from '@angular/core';\n\n        @NgModule()\n        export class MyModule {}\n      ");
            main_1.main({ p: basePath })
                .then(function (exitCode) {
                expect(exitCode).toEqual(0);
                expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngsummary.js'))).toBe(true);
                done();
            })
                .catch(function (e) { return done.fail(e); });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvbWFpbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdUVBQW1FO0FBQ25FLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFFN0Isb0NBQWlDO0FBRWpDO0lBQ0UsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNELElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxRQUFRLENBQUMsY0FBYyxFQUFFO0lBQ3ZCLElBQUksUUFBZ0IsQ0FBQztJQUNyQixJQUFJLE1BQWMsQ0FBQztJQUNuQixJQUFJLEtBQWtELENBQUM7SUFFdkQscUJBQXFCLFFBQXdEO1FBQXhELHlCQUFBLEVBQUEsZ0RBQXdEO1FBQzNFLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELFVBQVUsQ0FBQztRQUNULFFBQVEsR0FBRywwQkFBVyxFQUFFLENBQUM7UUFDekIsS0FBSyxHQUFHLFVBQUMsUUFBZ0IsRUFBRSxPQUFlO1lBQ3hDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLG9CQUFvQixFQUFFLG1TQVUxQixDQUFDLENBQUM7UUFDSixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxR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