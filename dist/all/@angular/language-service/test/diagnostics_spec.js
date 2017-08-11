"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('diagnostics', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngService);
    it('should be no diagnostics for test.ng', function () { expect(ngService.getDiagnostics('/app/test.ng')).toEqual([]); });
    describe('for semantic errors', function () {
        var fileName = '/app/test.ng';
        function diagnostics(template) {
            try {
                mockHost.override(fileName, template);
                return ngService.getDiagnostics(fileName);
            }
            finally {
                mockHost.override(fileName, undefined);
            }
        }
        function accept(template) { test_utils_1.noDiagnostics(diagnostics(template)); }
        function reject(template, message, at, len) {
            if (typeof at == 'string') {
                len = at.length;
                at = template.indexOf(at);
            }
            test_utils_1.includeDiagnostic(diagnostics(template), message, at, len);
        }
        describe('regression', function () {
            it('should be able to return diagnostics if reflector gets invalidated', function () {
                var fileName = '/app/main.ts';
                ngService.getDiagnostics(fileName);
                ngHost._reflector = null;
                ngService.getDiagnostics(fileName);
            });
            // #17611
            it('should not report diagnostic on iteration of any', function () { accept('<div *ngFor="let value of anyValue">{{value.someField}}</div>'); });
        });
        describe('with $event', function () {
            it('should accept an event', function () { accept('<div (click)="myClick($event)">Click me!</div>'); });
            it('should reject it when not in an event binding', function () {
                reject('<div [tabIndex]="$event"></div>', '\'$event\' is not defined', '$event');
            });
        });
    });
    describe('with regression tests', function () {
        it('should not crash with a incomplete *ngFor', function () {
            expect(function () {
                var code = '\n@Component({template: \'<div *ngFor></div> ~{after-div}\'}) export class MyComponent {}';
                addCode(code, function (fileName) { ngService.getDiagnostics(fileName); });
            }).not.toThrow();
        });
        it('should report a component not in a module', function () {
            var code = '\n@Component({template: \'<div></div>\'}) export class MyComponent {}';
            addCode(code, function (fileName, content) {
                var diagnostics = ngService.getDiagnostics(fileName);
                var offset = content.lastIndexOf('@Component') + 1;
                var len = 'Component'.length;
                test_utils_1.includeDiagnostic(diagnostics, 'Component \'MyComponent\' is not included in a module', offset, len);
            });
        });
        it('should not report an error for a form\'s host directives', function () {
            var code = '\n@Component({template: \'<form></form>\'}) export class MyComponent {}';
            addCode(code, function (fileName, content) {
                var diagnostics = ngService.getDiagnostics(fileName);
                expectOnlyModuleDiagnostics(diagnostics);
            });
        });
        it('should not throw getting diagnostics for an index expression', function () {
            var code = " @Component({template: '<a *ngIf=\"(auth.isAdmin | async) || (event.leads && event.leads[(auth.uid | async)])\"></a>'}) export class MyComponent {}";
            addCode(code, function (fileName) { expect(function () { return ngService.getDiagnostics(fileName); }).not.toThrow(); });
        });
        it('should not throw using a directive with no value', function () {
            var code = " @Component({template: '<form><input [(ngModel)]=\"name\" required /></form>'}) export class MyComponent { name = 'some name'; }";
            addCode(code, function (fileName) { expect(function () { return ngService.getDiagnostics(fileName); }).not.toThrow(); });
        });
        it('should report an error for invalid metadata', function () {
            var code = " @Component({template: '', provider: [{provide: 'foo', useFactor: () => 'foo' }]}) export class MyComponent { name = 'some name'; }";
            addCode(code, function (fileName, content) {
                var diagnostics = ngService.getDiagnostics(fileName);
                test_utils_1.includeDiagnostic(diagnostics, 'Function calls are not supported.', '() => \'foo\'', content);
            });
        });
        it('should not throw for an invalid class', function () {
            var code = " @Component({template: ''}) class";
            addCode(code, function (fileName) { expect(function () { return ngService.getDiagnostics(fileName); }).not.toThrow(); });
        });
        it('should not report an error for sub-types of string', function () {
            var code = " @Component({template: `<div *ngIf=\"something === 'foo'\"></div>`}) export class MyComponent { something: 'foo' | 'bar'; }";
            addCode(code, function (fileName) {
                var diagnostics = ngService.getDiagnostics(fileName);
                expectOnlyModuleDiagnostics(diagnostics);
            });
        });
        it('should report a warning if an event results in a callable expression', function () {
            var code = " @Component({template: `<div (click)=\"onClick\"></div>`}) export class MyComponent { onClick() { } }";
            addCode(code, function (fileName, content) {
                var diagnostics = ngService.getDiagnostics(fileName);
                test_utils_1.includeDiagnostic(diagnostics, 'Unexpected callable expression. Expected a method call', 'onClick', content);
            });
        });
        // #13412
        it('should not report an error for using undefined', function () {
            var code = " @Component({template: `<div *ngIf=\"something === undefined\"></div>`}) export class MyComponent { something = 'foo'; }})";
            addCode(code, function (fileName) {
                var diagnostics = ngService.getDiagnostics(fileName);
                expectOnlyModuleDiagnostics(diagnostics);
            });
        });
        // Issue #13326
        it('should report a narrow span for invalid pipes', function () {
            var code = " @Component({template: '<p> Using an invalid pipe {{data | dat}} </p>'}) export class MyComponent { data = 'some data'; }";
            addCode(code, function (fileName) {
                var diagnostic = ngService.getDiagnostics(fileName).filter(function (d) { return d.message.indexOf('pipe') > 0; })[0];
                expect(diagnostic).not.toBeUndefined();
                expect(diagnostic.span.end - diagnostic.span.start).toBeLessThan(11);
            });
        });
        // Issue #15460
        it('should be able to find members defined on an ancestor type', function () {
            var app_component = "\n        import { Component } from '@angular/core';\n        import { NgForm } from '@angular/common';\n\n        @Component({\n          selector: 'example-app',\n          template: `\n             <form #f=\"ngForm\" (ngSubmit)=\"onSubmit(f)\" novalidate>\n              <input name=\"first\" ngModel required #first=\"ngModel\">\n              <input name=\"last\" ngModel>\n              <button>Submit</button>\n            </form>\n            <p>First name value: {{ first.value }}</p>\n            <p>First name valid: {{ first.valid }}</p>\n            <p>Form value: {{ f.value | json }}</p>\n            <p>Form valid: {{ f.valid }}</p>\n         `,\n        })\n        export class AppComponent {\n          onSubmit(form: NgForm) {}\n        }\n      ";
            var fileName = '/app/app.component.ts';
            mockHost.override(fileName, app_component);
            var diagnostic = ngService.getDiagnostics(fileName);
            expect(diagnostic).toEqual([]);
        });
        it('should report an error for invalid providers', function () {
            addCode("\n        @Component({\n          template: '',\n          providers: [null]\n       })\n       export class MyComponent {}\n      ", function (fileName) {
                var diagnostics = ngService.getDiagnostics(fileName);
                var expected = diagnostics.find(function (d) { return d.message.startsWith('Invalid providers for'); });
                var notExpected = diagnostics.find(function (d) { return d.message.startsWith('Cannot read property'); });
                expect(expected).toBeDefined();
                expect(notExpected).toBeUndefined();
            });
        });
        // Issue #15768
        it('should be able to parse a template reference', function () {
            addCode("\n        @Component({\n          selector: 'my-component',\n          template: `\n            <div *ngIf=\"comps | async; let comps; else loading\">\n            </div>\n            <ng-template #loading>Loading comps...</ng-template>            \n          `\n        })\n        export class MyComponent {}\n      ", function (fileName) { return expectOnlyModuleDiagnostics(ngService.getDiagnostics(fileName)); });
        });
        // Issue #15625
        it('should not report errors for localization syntax', function () {
            addCode("\n          @Component({\n            selector: 'my-component',\n            template: `\n            <div>\n                {fieldCount, plural, =0 {no fields} =1 {1 field} other {{{fieldCount}} fields}}\n            </div>\n            `\n          })\n          export class MyComponent {\n            fieldCount: number;\n          }\n      ", function (fileName) {
                var diagnostics = ngService.getDiagnostics(fileName);
                expectOnlyModuleDiagnostics(diagnostics);
            });
        });
        // Issue #15885
        it('should be able to remove null and undefined from a type', function () {
            mockHost.overrideOptions(function (options) {
                options.strictNullChecks = true;
                return options;
            });
            addCode("\n        @Component({\n          selector: 'my-component',\n          template: ` {{test?.a}}\n          `\n        })\n        export class MyComponent {\n          test: {a: number, b: number} | null = {\n            a: 1,\n            b: 2\n          };\n        }\n      ", function (fileName) { return expectOnlyModuleDiagnostics(ngService.getDiagnostics(fileName)); });
        });
        it('should be able to resolve modules using baseUrl', function () {
            var app_component = "\n        import { Component } from '@angular/core';\n        import { NgForm } from '@angular/common';\n        import { Server } from 'app/server';\n\n        @Component({\n          selector: 'example-app',\n          template: '...',\n          providers: [Server]\n        })\n        export class AppComponent {\n          onSubmit(form: NgForm) {}\n        }\n      ";
            var app_server = "\n        export class Server {}\n      ";
            var fileName = '/app/app.component.ts';
            mockHost.override(fileName, app_component);
            mockHost.addScript('/other/files/app/server.ts', app_server);
            mockHost.overrideOptions(function (options) {
                options.baseUrl = '/other/files';
                return options;
            });
            var diagnostic = ngService.getDiagnostics(fileName);
            expect(diagnostic).toEqual([]);
        });
        function addCode(code, cb) {
            var fileName = '/app/app.component.ts';
            var originalContent = mockHost.getFileContent(fileName);
            var newContent = originalContent + code;
            mockHost.override(fileName, originalContent + code);
            ngHost.updateAnalyzedModules();
            try {
                cb(fileName, newContent);
            }
            finally {
                mockHost.override(fileName, undefined);
            }
        }
        function expectOnlyModuleDiagnostics(diagnostics) {
            // Expect only the 'MyComponent' diagnostic
            if (!diagnostics)
                throw new Error('Expecting Diagnostics');
            expect(diagnostics.length).toBe(1);
            if (diagnostics.length > 1) {
                for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
                    var diagnostic = diagnostics_1[_i];
                    if (diagnostic.message.indexOf('MyComponent') >= 0)
                        continue;
                    fail("(" + diagnostic.span.start + ":" + diagnostic.span.end + "): " + diagnostic.message);
                }
                return;
            }
            expect(diagnostics[0].message.indexOf('MyComponent') >= 0).toBeTruthy();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3Nfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9kaWFnbm9zdGljc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLDREQUE4RDtBQUU5RCwwREFBNkQ7QUFFN0QseUNBQWdDO0FBQ2hDLDJDQUFrRjtBQUVsRixRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbkQsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBa0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLGVBQUcsQ0FBQyxDQUFDO0lBQ3RGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNuRSxJQUFJLE1BQU0sR0FBRyxJQUFJLHVDQUFxQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRCxJQUFJLFNBQVMsR0FBRyx3Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFDdEMsY0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7UUFFaEMscUJBQXFCLFFBQWdCO1lBQ25DLElBQUksQ0FBQztnQkFDSCxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztn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