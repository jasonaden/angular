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
var ts_plugin_1 = require("../src/ts_plugin");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('plugin', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var program = service.getProgram();
    var mockProject = { projectService: { logger: { info: function () { } } } };
    it('should not report errors on tour of heroes', function () {
        expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var source = _a[_i];
            expectNoDiagnostics(service.getSyntacticDiagnostics(source.fileName));
            expectNoDiagnostics(service.getSemanticDiagnostics(source.fileName));
        }
    });
    var plugin = ts_plugin_1.create({ ts: ts, languageService: service, project: mockProject, languageServiceHost: mockHost });
    it('should not report template errors on tour of heroes', function () {
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var source = _a[_i];
            // Ignore all 'cases.ts' files as they intentionally contain errors.
            if (!source.fileName.endsWith('cases.ts')) {
                expectNoDiagnostics(plugin.getSemanticDiagnostics(source.fileName));
            }
        }
    });
    it('should be able to get entity completions', function () { contains('app/app.component.ts', 'entity-amp', '&amp;', '&gt;', '&lt;', '&iota;'); });
    it('should be able to return html elements', function () {
        var htmlTags = ['h1', 'h2', 'div', 'span'];
        var locations = ['empty', 'start-tag-h1', 'h1-content', 'start-tag', 'start-tag-after-h'];
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var location_1 = locations_1[_i];
            contains.apply(void 0, ['app/app.component.ts', location_1].concat(htmlTags));
        }
    });
    it('should be able to return element diretives', function () { contains('app/app.component.ts', 'empty', 'my-app'); });
    it('should be able to return h1 attributes', function () { contains('app/app.component.ts', 'h1-after-space', 'id', 'dir', 'lang', 'onclick'); });
    it('should be able to find common angular attributes', function () {
        contains('app/app.component.ts', 'div-attributes', '(click)', '[ngClass]', '*ngIf', '*ngFor');
    });
    it('should be able to returned attribute names with an incompete attribute', function () { contains('app/parsing-cases.ts', 'no-value-attribute', 'id', 'dir', 'lang'); });
    it('should be able to return attributes of an incomplete element', function () {
        contains('app/parsing-cases.ts', 'incomplete-open-lt', 'a');
        contains('app/parsing-cases.ts', 'incomplete-open-a', 'a');
        contains('app/parsing-cases.ts', 'incomplete-open-attr', 'id', 'dir', 'lang');
    });
    it('should be able to return completions with a missing closing tag', function () { contains('app/parsing-cases.ts', 'missing-closing', 'h1', 'h2'); });
    it('should be able to return common attributes of in an unknown tag', function () { contains('app/parsing-cases.ts', 'unknown-element', 'id', 'dir', 'lang'); });
    it('should be able to get the completions at the beginning of an interpolation', function () { contains('app/app.component.ts', 'h2-hero', 'hero', 'title'); });
    it('should not include private members of the of a class', function () { contains('app/app.component.ts', 'h2-hero', '-internal'); });
    it('should be able to get the completions at the end of an interpolation', function () { contains('app/app.component.ts', 'sub-end', 'hero', 'title'); });
    it('should be able to get the completions in a property read', function () { contains('app/app.component.ts', 'h2-name', 'name', 'id'); });
    it('should be able to get a list of pipe values', function () {
        contains('app/parsing-cases.ts', 'before-pipe', 'lowercase', 'uppercase');
        contains('app/parsing-cases.ts', 'in-pipe', 'lowercase', 'uppercase');
        contains('app/parsing-cases.ts', 'after-pipe', 'lowercase', 'uppercase');
    });
    it('should be able get completions in an empty interpolation', function () { contains('app/parsing-cases.ts', 'empty-interpolation', 'title', 'subTitle'); });
    describe('with attributes', function () {
        it('should be able to complete property value', function () { contains('app/parsing-cases.ts', 'property-binding-model', 'test'); });
        it('should be able to complete an event', function () { contains('app/parsing-cases.ts', 'event-binding-model', 'modelChanged'); });
        it('should be able to complete a two-way binding', function () { contains('app/parsing-cases.ts', 'two-way-binding-model', 'test'); });
    });
    describe('with a *ngFor', function () {
        it('should include a let for empty attribute', function () { contains('app/parsing-cases.ts', 'for-empty', 'let'); });
        it('should suggest NgForRow members for let initialization expression', function () {
            contains('app/parsing-cases.ts', 'for-let-i-equal', 'index', 'count', 'first', 'last', 'even', 'odd');
        });
        it('should include a let', function () { contains('app/parsing-cases.ts', 'for-let', 'let'); });
        it('should include an "of"', function () { contains('app/parsing-cases.ts', 'for-of', 'of'); });
        it('should include field reference', function () { contains('app/parsing-cases.ts', 'for-people', 'people'); });
        it('should include person in the let scope', function () { contains('app/parsing-cases.ts', 'for-interp-person', 'person'); });
        // TODO: Enable when we can infer the element type of the ngFor
        // it('should include determine person\'s type as Person', () => {
        //   contains('app/parsing-cases.ts', 'for-interp-name', 'name', 'age');
        //   contains('app/parsing-cases.ts', 'for-interp-age', 'name', 'age');
        // });
    });
    describe('for pipes', function () {
        it('should be able to resolve lowercase', function () { contains('app/expression-cases.ts', 'string-pipe', 'substring'); });
    });
    describe('with references', function () {
        it('should list references', function () { contains('app/parsing-cases.ts', 'test-comp-content', 'test1', 'test2', 'div'); });
        it('should reference the component', function () { contains('app/parsing-cases.ts', 'test-comp-after-test', 'name'); });
        // TODO: Enable when we have a flag that indicates the project targets the DOM
        // it('should reference the element if no component', () => {
        //   contains('app/parsing-cases.ts', 'test-comp-after-div', 'innerText');
        // });
    });
    describe('for semantic errors', function () {
        it('should report access to an unknown field', function () {
            expectSemanticError('app/expression-cases.ts', 'foo', 'Identifier \'foo\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
        });
        it('should report access to an unknown sub-field', function () {
            expectSemanticError('app/expression-cases.ts', 'nam', 'Identifier \'nam\' is not defined. \'Person\' does not contain such a member');
        });
        it('should report access to a private member', function () {
            expectSemanticError('app/expression-cases.ts', 'myField', 'Identifier \'myField\' refers to a private member of the component');
        });
        it('should report numeric operator errors', function () { expectSemanticError('app/expression-cases.ts', 'mod', 'Expected a numeric type'); });
        describe('in ngFor', function () {
            function expectError(locationMarker, message) {
                expectSemanticError('app/ng-for-cases.ts', locationMarker, message);
            }
            it('should report an unknown field', function () {
                expectError('people_1', 'Identifier \'people_1\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
            });
            it('should report an unknown context reference', function () {
                expectError('even_1', 'The template context does not defined a member called \'even_1\'');
            });
            it('should report an unknown value in a key expression', function () {
                expectError('trackBy_1', 'Identifier \'trackBy_1\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
            });
        });
        describe('in ngIf', function () {
            function expectError(locationMarker, message) {
                expectSemanticError('app/ng-if-cases.ts', locationMarker, message);
            }
            it('should report an implicit context reference', function () {
                expectError('implicit', 'The template context does not defined a member called \'unknown\'');
            });
        });
    });
    function getMarkerLocation(fileName, locationMarker) {
        var location = mockHost.getMarkerLocations(fileName)[locationMarker];
        if (location == null) {
            throw new Error("No marker " + locationMarker + " found.");
        }
        return location;
    }
    function contains(fileName, locationMarker) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        var location = getMarkerLocation(fileName, locationMarker);
        expectEntries.apply(void 0, [locationMarker, plugin.getCompletionsAtPosition(fileName, location)].concat(names));
    }
    function expectEmpty(fileName, locationMarker) {
        var location = getMarkerLocation(fileName, locationMarker);
        expect(plugin.getCompletionsAtPosition(fileName, location).entries || []).toEqual([]);
    }
    function expectSemanticError(fileName, locationMarker, message) {
        var start = getMarkerLocation(fileName, locationMarker);
        var end = getMarkerLocation(fileName, locationMarker + '-end');
        var errors = plugin.getSemanticDiagnostics(fileName);
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            if (error.messageText.toString().indexOf(message) >= 0) {
                expect(error.start).toEqual(start);
                expect(error.length).toEqual(end - start);
                return;
            }
        }
        throw new Error("Expected error messages to contain " + message + ", in messages:\n  " + errors
            .map(function (e) { return e.messageText.toString(); })
            .join(',\n  '));
    }
});
function expectEntries(locationMarker, info) {
    var names = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        names[_i - 2] = arguments[_i];
    }
    var entries = {};
    if (!info) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " but no result provided");
    }
    else {
        for (var _a = 0, _b = info.entries; _a < _b.length; _a++) {
            var entry = _b[_a];
            entries[entry.name] = true;
        }
        var shouldContains = names.filter(function (name) { return !name.startsWith('-'); });
        var shouldNotContain = names.filter(function (name) { return name.startsWith('-'); });
        var missing = shouldContains.filter(function (name) { return !entries[name]; });
        var present = shouldNotContain.map(function (name) { return name.substr(1); }).filter(function (name) { return entries[name]; });
        if (missing.length) {
            throw new Error("Expected result from " + locationMarker + " to include at least one of the following, " + missing
                .join(', ') + ", in the list of entries " + info.entries.map(function (entry) { return entry.name; })
                .join(', '));
        }
        if (present.length) {
            throw new Error("Unexpected member" + (present.length > 1 ? 's' :
                '') + " included in result: " + present.join(', '));
        }
    }
}
function expectNoDiagnostics(diagnostics) {
    for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
        var diagnostic = diagnostics_1[_i];
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.start) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            console.error(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.error("" + message);
        }
    }
    expect(diagnostics.length).toBe(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfcGx1Z2luX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvdHNfcGx1Z2luX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0QkFBMEI7QUFFMUIsK0JBQWlDO0FBRWpDLDhDQUF3QztBQUV4Qyx5Q0FBZ0M7QUFDaEMsMkNBQWdEO0FBRWhELFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNuRCxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFrQixDQUFDLENBQUMsY0FBYyxFQUFFLHVCQUF1QixDQUFDLEVBQUUsZUFBRyxDQUFDLENBQUM7SUFDdEYsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVuQyxJQUFNLFdBQVcsR0FBRyxFQUFDLGNBQWMsRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxjQUFZLENBQUMsRUFBQyxFQUFDLEVBQUMsQ0FBQztJQUV0RSxFQUFFLENBQUMsNENBQTRDLEVBQUU7UUFDL0MsbUJBQW1CLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsQ0FBZSxVQUF3QixFQUF4QixLQUFBLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBeEIsY0FBd0IsRUFBeEIsSUFBd0I7WUFBdEMsSUFBSSxNQUFNLFNBQUE7WUFDYixtQkFBbUIsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEUsbUJBQW1CLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFD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