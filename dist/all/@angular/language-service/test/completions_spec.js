"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('completions', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngService);
    it('should be able to get entity completions', function () { contains('/app/test.ng', 'entity-amp', '&amp;', '&gt;', '&lt;', '&iota;'); });
    it('should be able to return html elements', function () {
        var htmlTags = ['h1', 'h2', 'div', 'span'];
        var locations = ['empty', 'start-tag-h1', 'h1-content', 'start-tag', 'start-tag-after-h'];
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var location_1 = locations_1[_i];
            contains.apply(void 0, ['/app/test.ng', location_1].concat(htmlTags));
        }
    });
    it('should be able to return element diretives', function () { contains('/app/test.ng', 'empty', 'my-app'); });
    it('should be able to return h1 attributes', function () { contains('/app/test.ng', 'h1-after-space', 'id', 'dir', 'lang', 'onclick'); });
    it('should be able to find common angular attributes', function () { contains('/app/test.ng', 'div-attributes', '(click)', '[ngClass]'); });
    it('should be able to get completions in some random garbage', function () {
        var fileName = '/app/test.ng';
        mockHost.override(fileName, ' > {{tle<\n  {{retl  ><bel/beled}}di>\n   la</b  </d    &a  ');
        expect(function () { return ngService.getCompletionsAt(fileName, 31); }).not.toThrow();
        mockHost.override(fileName, undefined);
    });
    it('should be able to infer the type of a ngForOf', function () {
        addCode("\n      interface Person {\n        name: string,\n        street: string\n      }\n\n      @Component({template: '<div *ngFor=\"let person of people\">{{person.~{name}name}}</div'})\n      export class MyComponent {\n        people: Person[]\n      }", function () { contains('/app/app.component.ts', 'name', 'name', 'street'); });
    });
    it('should be able to infer the type of a ngForOf with an async pipe', function () {
        addCode("\n      interface Person {\n        name: string,\n        street: string\n      }\n\n      @Component({template: '<div *ngFor=\"let person of people | async\">{{person.~{name}name}}</div'})\n      export class MyComponent {\n        people: Promise<Person[]>;\n      }", function () { contains('/app/app.component.ts', 'name', 'name', 'street'); });
    });
    it('should be able to complete every character in the file', function () {
        var fileName = '/app/test.ng';
        expect(function () {
            var chance = 0.05;
            var requests = 0;
            function tryCompletionsAt(position) {
                try {
                    if (Math.random() < chance) {
                        ngService.getCompletionsAt(fileName, position);
                        requests++;
                    }
                }
                catch (e) {
                    // Emit enough diagnostic information to reproduce the error.
                    console.error("Position: " + position + "\nContent: \"" + mockHost.getFileContent(fileName) + "\"\nStack:\n" + e.stack);
                    throw e;
                }
            }
            try {
                var originalContent = mockHost.getFileContent(fileName);
                // For each character in the file, add it to the file and request a completion after it.
                for (var index = 0, len = originalContent.length; index < len; index++) {
                    var content_1 = originalContent.substr(0, index);
                    mockHost.override(fileName, content_1);
                    tryCompletionsAt(index);
                }
                // For the complete file, try to get a completion at every character.
                mockHost.override(fileName, originalContent);
                for (var index = 0, len = originalContent.length; index < len; index++) {
                    tryCompletionsAt(index);
                }
                // Delete random characters in the file until we get an empty file.
                var content = originalContent;
                while (content.length > 0) {
                    var deleteIndex = Math.floor(Math.random() * content.length);
                    content = content.slice(0, deleteIndex - 1) + content.slice(deleteIndex + 1);
                    mockHost.override(fileName, content);
                    var requestIndex = Math.floor(Math.random() * content.length);
                    tryCompletionsAt(requestIndex);
                }
                // Build up the string from zero asking for a completion after every char
                buildUp(originalContent, function (text, position) {
                    mockHost.override(fileName, text);
                    tryCompletionsAt(position);
                });
            }
            finally {
                mockHost.override(fileName, undefined);
            }
        }).not.toThrow();
    });
    describe('with regression tests', function () {
        it('should not crash with an incomplete component', function () {
            expect(function () {
                var code = "\n@Component({\n  template: '~{inside-template}'\n})\nexport class MyComponent {\n\n}";
                addCode(code, function (fileName) { contains(fileName, 'inside-template', 'h1'); });
            }).not.toThrow();
        });
        it('should hot crash with an incomplete class', function () {
            expect(function () {
                addCode('\nexport class', function (fileName) { ngHost.updateAnalyzedModules(); });
            }).not.toThrow();
        });
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
    function contains(fileName, locationMarker) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        var location = mockHost.getMarkerLocations(fileName)[locationMarker];
        if (location == null) {
            throw new Error("No marker " + locationMarker + " found.");
        }
        expectEntries.apply(void 0, [locationMarker, ngService.getCompletionsAt(fileName, location)].concat(names));
    }
});
function expectEntries(locationMarker, completions) {
    var names = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        names[_i - 2] = arguments[_i];
    }
    var entries = {};
    if (!completions) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " but no result provided");
    }
    if (!completions.length) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " an empty result provided");
    }
    else {
        for (var _a = 0, completions_1 = completions; _a < completions_1.length; _a++) {
            var entry = completions_1[_a];
            entries[entry.name] = true;
        }
        var missing = names.filter(function (name) { return !entries[name]; });
        if (missing.length) {
            throw new Error("Expected result from " + locationMarker + " to include at least one of the following, " + missing.join(', ') + ", in the list of entries " + completions.map(function (entry) { return entry.name; }).join(', '));
        }
    }
}
function buildUp(originalText, cb) {
    var count = originalText.length;
    var inString = (new Array(count)).fill(false);
    var unused = (new Array(count)).fill(1).map(function (v, i) { return i; });
    function getText() {
        return new Array(count)
            .fill(1)
            .map(function (v, i) { return i; })
            .filter(function (i) { return inString[i]; })
            .map(function (i) { return originalText[i]; })
            .join('');
    }
    function randomUnusedIndex() { return Math.floor(Math.random() * unused.length); }
    var _loop_1 = function () {
        var unusedIndex = randomUnusedIndex();
        var index = unused[unusedIndex];
        if (index == null)
            throw new Error('Internal test buildup error');
        if (inString[index])
            throw new Error('Internal test buildup error');
        inString[index] = true;
        unused.splice(unusedIndex, 1);
        var text = getText();
        var position = inString.filter(function (_, i) { return i <= index; }).map(function (v) { return v ? 1 : 0; }).reduce(function (p, v) { return p + v; }, 0);
        cb(text, position);
    };
    while (unused.length > 0) {
        _loop_1();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9jb21wbGV0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNEJBQTBCO0FBQzFCLCtCQUFpQztBQUVqQyw0REFBOEQ7QUFFOUQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztJQUN0RixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbkUsSUFBSSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFTLEdBQUcsd0NBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUUxQixFQUFFLENBQUMsMENBQTBDLEVBQzFDLGNBQVEsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RixFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0MsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxJQUFJLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzFGLEdBQUcsQ0FBQyxDQUFpQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7WUFBekIsSUFBSSxVQUFRLGtCQUFBO1lBQ2YsUUFBUSxnQkFBQyxjQUFjLEVBQUUsVUFBUSxTQUFLLFFBQVEsR0FBRTtTQUNqRDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUM1QyxjQUFRLFFBQVEsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsRUFBRSxDQUFDLHdDQUF3QyxFQUN4QyxjQUFRLFFBQVEsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxRixFQUFFLENBQUMsa0RBQWtELEVBQ2xELGNBQVEsUUFBUSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRixFQUFFLENBQUMsMERBQTBELEVBQUU7UUFDN0QsSUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLDhEQUE4RCxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFO1FBQ2xELE9BQU8sQ0FDSCw2UEFTQSxFQUNBLGNBQVEsUUFBUSxDQUFDLHVCQUF1QixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrRUFBa0UsRUFBRTtRQUNyRSxPQUFPLENBQ0gsK1FBU0EsRUFDQSxjQUFRLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7UUFDM0QsSUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO1FBRWhDLE1BQU0sQ0FBQztZQUNMLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDakIsMEJBQTBCLFFBQWdCO2dCQUN4QyxJQUFJLENBQUM7b0JBQ0gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzNCLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQy9DLFFBQVEsRUFBRSxDQUFDO29CQUNiLENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNYLDZEQUE2RDtvQkFDN0QsT0FBTyxDQUFDLEtBQUssQ0FDVCxlQUFhLFFBQVEscUJBQWUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsb0JBQWMsQ0FBQyxDQUFDLEtBQU8sQ0FBQyxDQUFDO29CQUNsRyxNQUFNLENBQUMsQ0FBQztnQkFDVixDQUFDO1lBQ0gsQ0FBQztZQUNELElBQUksQ0FBQztnQkFDSCxJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBRyxDQUFDO2dCQUU1RCx3RkFBd0Y7Z0JBQ3hGLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7b0JBQ3ZFLElBQU0sU0FBTyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNqRCxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFPLENBQUMsQ0FBQztvQkFDckMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQscUVBQXFFO2dCQUNyRSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztvQkFDdkUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7Z0JBRUQsbUVBQW1FO2dCQUNuRSxJQUFJLE9BQU8sR0FBRyxlQUFlLENBQUM7Z0JBQzlCLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDMUIsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMvRCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM3RSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFFckMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNoRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFFRCx5RUFBeUU7Z0JBQ3pFLE9BQU8sQ0FBQyxlQUFlLEVBQUUsVUFBQyxJQUFJLEVBQUUsUUFBUTtvQkFDdEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2xDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7b0JBQVMsQ0FBQztnQkFDVCxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFXLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxNQUFNLENBQUM7Z0JBQ0wsSUFBTSxJQUFJLEdBQUcsdUZBTW5CLENBQUM7Z0JBQ0ssT0FBTyxDQUFDLElBQUksRUFBRSxVQUFBLFFBQVEsSUFBTSxRQUFRLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLE1BQU0sQ0FBQztnQkFDTCxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBQSxRQUFRLElBQU0sTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILGlCQUFpQixJQUFZLEVBQUUsRUFBZ0Q7UUFDN0UsSUFBTSxRQUFRLEdBQUcsdUJBQXVCLENBQUM7UUFDekMsSUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxJQUFNLFVBQVUsR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUM7WUFDSCxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNCLENBQUM7Z0JBQVMsQ0FBQztZQUNULFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVcsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBRUQsa0JBQWtCLFFBQWdCLEVBQUUsY0FBc0I7UUFBRSxlQUFrQjthQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7WUFBbEIsOEJBQWtCOztRQUM1RSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFhLGNBQWMsWUFBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELGFBQWEsZ0JBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFNBQUssS0FBSyxHQUFFO0lBQzFGLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUdILHVCQUF1QixjQUFzQixFQUFFLFdBQXdCO0lBQUUsZUFBa0I7U0FBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO1FBQWxCLDhCQUFrQjs7SUFDekYsSUFBSSxPQUFPLEdBQThCLEVBQUUsQ0FBQztJQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FDWCwwQkFBd0IsY0FBYyxvQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBeUIsQ0FBQyxDQUFDO0lBQ3RHLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQ1gsMEJBQXdCLGNBQWMsb0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsOEJBQTJCLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixHQUFHLENBQUMsQ0FBYyxVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVc7WUFBeEIsSUFBSSxLQUFLLG9CQUFBO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDNUI7UUFDRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FDWCwwQkFBd0IsY0FBYyxtREFBOEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUNBQTRCLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1FBQzNMLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELGlCQUFpQixZQUFvQixFQUFFLEVBQTRDO0lBQ2pGLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFFaEMsSUFBSSxRQUFRLEdBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxJQUFJLE1BQU0sR0FBYSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFFbkU7UUFDRSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2xCLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDUCxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQzthQUNoQixNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFDO2FBQ3hCLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBZixDQUFlLENBQUM7YUFDekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFRCwrQkFBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBR2hGLElBQUksV0FBVyxHQUFHLGlCQUFpQixFQUFFLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BFLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDckIsSUFBSSxRQUFRLEdBQ1IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLElBQUksS0FBSyxFQUFWLENBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxFQUFMLENBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFYRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQzs7S0FXdkI7QUFDSCxDQUFDIn0=