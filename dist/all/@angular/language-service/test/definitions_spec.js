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
describe('definitions', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngService);
    it('should be able to find field in an interpolation', function () {
        localReference(" @Component({template: '{{\u00ABname\u00BB}}'}) export class MyComponent { \u00AB\u2206name\u2206: string;\u00BB }");
    });
    it('should be able to find a field in a attribute reference', function () {
        localReference(" @Component({template: '<input [(ngModel)]=\"\u00ABname\u00BB\">'}) export class MyComponent { \u00AB\u2206name\u2206: string;\u00BB }");
    });
    it('should be able to find a method from a call', function () {
        localReference(" @Component({template: '<div (click)=\"\u00ABmyClick\u00BB();\"></div>'}) export class MyComponent { \u00AB\u2206myClick\u2206() { }\u00BB}");
    });
    it('should be able to find a field reference in an *ngIf', function () {
        localReference(" @Component({template: '<div *ngIf=\"\u00ABinclude\u00BB\"></div>'}) export class MyComponent { \u00AB\u2206include\u2206 = true;\u00BB}");
    });
    it('should be able to find a reference to a component', function () {
        reference('parsing-cases.ts', " @Component({template: '<\u00ABtest-comp\u00BB></test-comp>'}) export class MyComponent { }");
    });
    it('should be able to find an event provider', function () {
        reference('/app/parsing-cases.ts', 'test', " @Component({template: '<test-comp (\u00ABtest\u00BB)=\"myHandler()\"></div>'}) export class MyComponent { myHandler() {} }");
    });
    it('should be able to find an input provider', function () {
        reference('/app/parsing-cases.ts', 'tcName', " @Component({template: '<test-comp [\u00ABtcName\u00BB]=\"name\"></div>'}) export class MyComponent { name = 'my name'; }");
    });
    it('should be able to find a pipe', function () {
        reference('async_pipe.d.ts', " @Component({template: '<div *ngIf=\"input | \u00ABasync\u00BB\"></div>'}) export class MyComponent { input: EventEmitter; }");
    });
    function localReference(code) {
        addCode(code, function (fileName) {
            var refResult = mockHost.getReferenceMarkers(fileName);
            for (var name_1 in refResult.references) {
                var references = refResult.references[name_1];
                var definitions = refResult.definitions[name_1];
                expect(definitions).toBeDefined(); // If this fails the test data is wrong.
                for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
                    var reference_1 = references_1[_i];
                    var definition = ngService.getDefinitionAt(fileName, reference_1.start);
                    if (definition) {
                        definition.forEach(function (d) { return expect(d.fileName).toEqual(fileName); });
                        var match = matchingSpan(definition.map(function (d) { return d.span; }), definitions);
                        if (!match) {
                            throw new Error("Expected one of " + stringifySpans(definition.map(function (d) { return d.span; })) + " to match one of " + stringifySpans(definitions));
                        }
                    }
                    else {
                        throw new Error('Expected a definition');
                    }
                }
            }
        });
    }
    function reference(referencedFile, p1, p2) {
        var code = p2 ? p2 : p1;
        var definition = p2 ? p1 : undefined;
        var span = p2 && p1.start != null ? p1 : undefined;
        if (definition && !span) {
            var referencedFileMarkers = mockHost.getReferenceMarkers(referencedFile);
            expect(referencedFileMarkers).toBeDefined(); // If this fails the test data is wrong.
            var spans = referencedFileMarkers.definitions[definition];
            expect(spans).toBeDefined(); // If this fails the test data is wrong.
            span = spans[0];
        }
        addCode(code, function (fileName) {
            var refResult = mockHost.getReferenceMarkers(fileName);
            var tests = 0;
            for (var name_2 in refResult.references) {
                var references = refResult.references[name_2];
                expect(reference).toBeDefined(); // If this fails the test data is wrong.
                for (var _i = 0, references_2 = references; _i < references_2.length; _i++) {
                    var reference_2 = references_2[_i];
                    tests++;
                    var definition_1 = ngService.getDefinitionAt(fileName, reference_2.start);
                    if (definition_1) {
                        definition_1.forEach(function (d) {
                            if (d.fileName.indexOf(referencedFile) < 0) {
                                throw new Error("Expected reference to file " + referencedFile + ", received " + d.fileName);
                            }
                            if (span) {
                                expect(d.span).toEqual(span);
                            }
                        });
                    }
                    else {
                        throw new Error('Expected a definition');
                    }
                }
            }
            if (!tests) {
                throw new Error('Expected at least one reference (test data error)');
            }
        });
    }
    function addCode(code, cb) {
        var fileName = '/app/app.component.ts';
        var originalContent = mockHost.getFileContent(fileName);
        var newContent = originalContent + code;
        mockHost.override(fileName, originalContent + code);
        try {
            cb(fileName, newContent);
        }
        finally {
            mockHost.override(fileName, undefined);
        }
    }
});
function matchingSpan(aSpans, bSpans) {
    for (var _i = 0, aSpans_1 = aSpans; _i < aSpans_1.length; _i++) {
        var a = aSpans_1[_i];
        for (var _a = 0, bSpans_1 = bSpans; _a < bSpans_1.length; _a++) {
            var b = bSpans_1[_a];
            if (a.start == b.start && a.end == b.end) {
                return a;
            }
        }
    }
}
function stringifySpan(span) {
    return span ? "(" + span.start + "-" + span.end + ")" : '<undefined>';
}
function stringifySpans(spans) {
    return spans ? "[" + spans.map(stringifySpan).join(', ') + "]" : '<empty>';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5pdGlvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9kZWZpbml0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLDREQUE4RDtBQUU5RCwwREFBNkQ7QUFFN0QseUNBQWdDO0FBRWhDLDJDQUFpRDtBQUVqRCxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbkQsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBa0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLGVBQUcsQ0FBQyxDQUFDO0lBQ3RGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNuRSxJQUFJLE1BQU0sR0FBRyxJQUFJLHVDQUFxQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRCxJQUFJLFNBQVMsR0FBRyx3Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTFCLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtRQUNyRCxjQUFjLENBQ1Ysb0hBQXNGLENBQUMsQ0FBQztJQUM5RixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtRQUM1RCxjQUFjLENBQ1Ysd0lBQXdHLENBQUMsQ0FBQztJQUNoSCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtRQUNoRCxjQUFjLENBQ1YsNklBQTZHLENBQUMsQ0FBQztJQUNySCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6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