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
var lower_expressions_1 = require("../../src/transformers/lower_expressions");
var mocks_1 = require("../mocks");
describe('Expression lowering', function () {
    it('should be able to lower a simple expression', function () {
        expect(convert('const a = 1 +◊b: 2◊;')).toBe('const b = 2; const a = 1 + b; export { b };');
    });
    it('should be able to lower an expression in a decorator', function () {
        expect(convert("\n        import {Component} from '@angular/core';\n        \n        @Component({\n          provider: [{provide: 'someToken', useFactory:\u25CAl: () => null\u25CA}]\n        })\n        class MyClass {}\n    ")).toContain('const l = () => null; exports.l = l;');
    });
});
function convert(annotatedSource) {
    var annotations = [];
    var adjustment = 0;
    var unannotatedSource = annotatedSource.replace(/◊([a-zA-Z]+):(.*)◊/g, function (text, name, source, index) {
        annotations.push({ start: index + adjustment, length: source.length, name: name });
        adjustment -= text.length - source.length;
        return source;
    });
    var baseFileName = 'someFile';
    var moduleName = '/' + baseFileName;
    var fileName = moduleName + '.ts';
    var context = new mocks_1.MockAotContext('/', (_a = {}, _a[baseFileName + '.ts'] = unannotatedSource, _a));
    var host = new mocks_1.MockCompilerHost(context);
    var sourceFile = ts.createSourceFile(fileName, unannotatedSource, ts.ScriptTarget.Latest, /* setParentNodes */ true);
    var requests = new Map();
    for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
        var annotation = annotations_1[_i];
        var node = findNode(sourceFile, annotation.start, annotation.length);
        if (!node)
            throw new Error('Invalid test specification. Could not find the node to substitute');
        var location_1 = node.pos;
        requests.set(location_1, { name: annotation.name, kind: node.kind, location: location_1, end: node.end });
    }
    var program = ts.createProgram([fileName], { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 }, host);
    var moduleSourceFile = program.getSourceFile(fileName);
    var transformers = {
        before: [lower_expressions_1.getExpressionLoweringTransformFactory({
                getRequests: function (sourceFile) {
                    if (sourceFile.fileName == moduleSourceFile.fileName) {
                        return requests;
                    }
                    else {
                        return new Map();
                    }
                }
            })]
    };
    var result = '';
    var emitResult = program.emit(moduleSourceFile, function (emittedFileName, data, writeByteOrderMark, onError, sourceFiles) {
        if (fileName.startsWith(moduleName)) {
            result = data;
        }
    }, undefined, undefined, transformers);
    return normalizeResult(result);
    var _a;
}
;
function findNode(node, start, length) {
    function find(node) {
        if (node.getFullStart() == start && node.getEnd() == start + length) {
            return node;
        }
        if (node.getFullStart() <= start && node.getEnd() >= start + length) {
            return ts.forEachChild(node, find);
        }
    }
    return ts.forEachChild(node, find);
}
function normalizeResult(result) {
    // Remove TypeScript prefixes
    // Remove new lines
    // Squish adjacent spaces
    // Remove prefix and postfix spaces
    return result.replace('"use strict";', ' ')
        .replace('exports.__esModule = true;', ' ')
        .replace('Object.defineProperty(exports, "__esModule", { value: true });', ' ')
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
        .replace(/^ /g, '')
        .replace(/ $/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfZXhwcmVzc2lvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L3RyYW5zZm9ybWVycy9sb3dlcl9leHByZXNzaW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLDhFQUFvSTtBQUNwSSxrQ0FBcUU7QUFFckUsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtRQUNoRCxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUM5RixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLG9OQU9kLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQkFBaUIsZUFBdUI7SUFDdEMsSUFBTSxXQUFXLEdBQW9ELEVBQUUsQ0FBQztJQUN4RSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBTSxpQkFBaUIsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUM3QyxxQkFBcUIsRUFDckIsVUFBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLE1BQWMsRUFBRSxLQUFhO1FBQ3hELFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDLENBQUM7UUFDM0UsVUFBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMxQyxNQUFNLENBQUMs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