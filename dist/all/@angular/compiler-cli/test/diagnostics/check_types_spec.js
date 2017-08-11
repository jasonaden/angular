"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_util_1 = require("@angular/compiler/test/aot/test_util");
var ts = require("typescript");
var check_types_1 = require("../../src/diagnostics/check_types");
function compile(rootDirs, options, tsOptions) {
    if (options === void 0) { options = {}; }
    if (tsOptions === void 0) { tsOptions = {}; }
    var rootDirArr = test_util_1.toMockFileArray(rootDirs);
    var scriptNames = rootDirArr.map(function (entry) { return entry.fileName; }).filter(test_util_1.isSource);
    var host = new test_util_1.MockCompilerHost(scriptNames, test_util_1.arrayToMockDir(rootDirArr));
    var aotHost = new test_util_1.MockAotCompilerHost(host);
    var tsSettings = __assign({}, test_util_1.settings, tsOptions);
    var program = ts.createProgram(host.scriptNames.slice(0), tsSettings, host);
    var ngChecker = new check_types_1.TypeChecker(program, tsSettings, host, aotHost, options);
    return ngChecker.getDiagnostics();
}
describe('ng type checker', function () {
    var angularFiles = test_util_1.setup();
    function accept() {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        expectNoDiagnostics(compile([angularFiles, QUICKSTART].concat(files)));
    }
    function reject(message) {
        var files = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            files[_i - 1] = arguments[_i];
        }
        var diagnostics = compile([angularFiles, QUICKSTART].concat(files));
        if (!diagnostics || !diagnostics.length) {
            throw new Error('Expected a diagnostic erorr message');
        }
        else {
            var matches = typeof message === 'string' ? function (d) { return d.message == message; } : function (d) { return message.test(d.message); };
            var matchingDiagnostics = diagnostics.filter(matches);
            if (!matchingDiagnostics || !matchingDiagnostics.length) {
                throw new Error("Expected a diagnostics matching " + message + ", received\n  " + diagnostics.map(function (d) { return d.message; }).join('\n  '));
            }
        }
    }
    it('should accept unmodified QuickStart', function () { accept(); });
    describe('with modified quickstart', function () {
        function a(template) {
            accept({ quickstart: { app: { 'app.component.ts': appComponentSource(template) } } });
        }
        function r(template, message) {
            reject(message, { quickstart: { app: { 'app.component.ts': appComponentSource(template) } } });
        }
        it('should report an invalid field access', function () { r('{{fame}}', "Property 'fame' does not exist on type 'AppComponent'."); });
        it('should reject a reference to a field of a nullable', function () { r('{{maybePerson.name}}', "Object is possibly 'undefined'."); });
        it('should accept a reference to a field of a nullable using using non-null-assert', function () { a('{{maybePerson!.name}}'); });
        it('should accept a safe property access of a nullable person', function () { a('{{maybePerson?.name}}'); });
        it('should accept a function call', function () { a('{{getName()}}'); });
        it('should reject an invalid method', function () { r('{{getFame()}}', "Property 'getFame' does not exist on type 'AppComponent'."); });
        it('should accept a field access of a method result', function () { a('{{getPerson().name}}'); });
        it('should reject an invalid field reference of a method result', function () { r('{{getPerson().fame}}', "Property 'fame' does not exist on type 'Person'."); });
        it('should reject an access to a nullable field of a method result', function () { r('{{getMaybePerson().name}}', "Object is possibly 'undefined'."); });
        it('should accept a nullable assert of a nullable field refernces of a method result', function () { a('{{getMaybePerson()!.name}}'); });
        it('should accept a safe property access of a nullable field reference of a method result', function () { a('{{getMaybePerson()?.name}}'); });
    });
});
function appComponentSource(template) {
    return "\n    import {Component} from '@angular/core';\n\n    export interface Person {\n      name: string;\n      address: Address;\n    }\n\n    export interface Address {\n      street: string;\n      city: string;\n      state: string;\n      zip: string;\n    }\n\n    @Component({\n      template: '" + template + "'\n    })\n    export class AppComponent {\n      name = 'Angular';\n      person: Person;\n      people: Person[];\n      maybePerson?: Person;\n\n      getName(): string { return this.name; }\n      getPerson(): Person { return this.person; }\n      getMaybePerson(): Person | undefined { this.maybePerson; }\n    }\n  ";
}
var QUICKSTART = {
    quickstart: {
        app: {
            'app.component.ts': appComponentSource('<h1>Hello {{name}}</h1>'),
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { toString }      from './utils';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
function expectNoDiagnostics(diagnostics) {
    if (diagnostics && diagnostics.length) {
        throw new Error(diagnostics.map(function (d) { return d.span + ": " + d.message; }).join('\n'));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tfdHlwZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L2RpYWdub3N0aWNzL2NoZWNrX3R5cGVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUdILGtFQUErTztBQUMvTywrQkFBaUM7QUFFakMsaUVBQThEO0FBRzlELGlCQUNJLFFBQWtCLEVBQUUsT0FBZ0MsRUFDcEQsU0FBa0M7SUFEZCx3QkFBQSxFQUFBLFlBQWdDO0lBQ3BELDBCQUFBLEVBQUEsY0FBa0M7SUFDcEMsSUFBTSxVQUFVLEdBQUcsMkJBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxJQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxDQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsb0JBQVEsQ0FBQyxDQUFDO0lBQzdFLElBQU0sSUFBSSxHQUFHLElBQUksNEJBQWdCLENBQUMsV0FBVyxFQUFFLDBCQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMzRSxJQUFNLE9BQU8sR0FBRyxJQUFJLCtCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLElBQU0sVUFBVSxnQkFBTyxvQkFBUSxFQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlFLElBQU0sU0FBUyxHQUFHLElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxj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