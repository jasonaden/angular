"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test_util_1 = require("./test_util");
describe('aot stubs', function () {
    var angularFiles = test_util_1.setup();
    it('should create empty .ngfactory and .ngsummary files for every source file', function () {
        var appDir = { 'app.ts': "export const x = 1;" };
        var rootDir = { 'app': appDir };
        var genFiles = test_util_1.compile([rootDir, angularFiles], { postCompile: test_util_1.expectNoDiagnostics, stubsOnly: true, enableSummariesForJit: true }).genFiles;
        expect(genFiles.find(function (f) { return f.genFileUrl === '/app/app.ngfactory.ts'; })).toBeTruthy();
        expect(genFiles.find(function (f) { return f.genFileUrl === '/app/app.ngsummary.ts'; })).toBeTruthy();
    });
    it('should create empty .ngstyle files for imported css files', function () {
        var appDir = {
            'app.ts': "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          template: '',\n          styleUrls: ['./style.css']\n        })\n        export class MyComp {}\n\n        @NgModule({\n          declarations: [MyComp]\n        })\n        export class MyModule {}\n        export const x = 1;\n      ",
            'style.css': ''
        };
        var rootDir = { 'app': appDir };
        var genFiles = test_util_1.compile([rootDir, angularFiles], { postCompile: test_util_1.expectNoDiagnostics, stubsOnly: true }).genFiles;
        expect(genFiles.find(function (f) { return f.genFileUrl === '/app/style.css.shim.ngstyle.ts'; })).toBeTruthy();
    });
    it('should create stub exports for NgModules of the right type', function () {
        var appDir = {
            'app.module.ts': "\n        import { NgModule } from '@angular/core';\n\n        @NgModule()\n        export class MyModule {}\n      ",
            'app.boot.ts': "\n        import {NgModuleFactory} from '@angular/core';\n        import {MyModuleNgFactory} from './app.module.ngfactory';\n        import {MyModuleNgSummary} from './app.module.ngsummary';\n        import {MyModule} from './app.module';\n\n        export const factory: NgModuleFactory<MyModule> = MyModuleNgFactory;\n        export const summary: () => any[] = MyModuleNgSummary;\n      "
        };
        var rootDir = { 'app': appDir };
        test_util_1.compile([rootDir, angularFiles], { postCompile: test_util_1.expectNoDiagnostics, stubsOnly: true, enableSummariesForJit: true });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1pdF9zdHVic19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3QvZW1pdF9zdHVic19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQWdHO0FBRWhHLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsSUFBSSxZQUFZLEdBQUcsaUJBQUssRUFBRSxDQUFDO0lBRTNCLEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtRQUM5RSxJQUFNLE1BQU0sR0FBRyxFQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBQyxDQUFDO1FBQ2pELElBQU0sT0FBTyxHQUFHLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQ3pCLElBQUEsZ0tBQVEsQ0FFdUU7UUFDdEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsVUFBVSxLQUFLLHVCQUF1QixFQUF4QyxDQUF3QyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwRixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssdUJBQXVCLEVBQXhDLENBQXdDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1FBQzlELElBQU0sTUFBTSxHQUFHO1lBQ2IsUUFBUSxFQUFFLDZVQWNUO1lBQ0QsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQztRQUNGLElBQU0sT0FBTyxHQUFHLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDO1FBQ3pCLElBQUEsbUlBQVEsQ0FDMkU7UUFDMUYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsVUFBVSxLQUFLLGdDQUFnQyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMvRixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtRQUMvRCxJQUFNLE1BQU0sR0FBRztZQUNiLGVBQWUsRUFBRSxzSEFLaEI7WUFDRCxhQUFhLEVBQUUsd1lBUWQ7U0FDRixDQUFDO1FBQ0YsSUFBTSxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDaEMsbUJBQU8sQ0FDSCxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsRUFDdkIsRUFBQyxXQUFXLEVBQUUsK0JBQW1CLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==