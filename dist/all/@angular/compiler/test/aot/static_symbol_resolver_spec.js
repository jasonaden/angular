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
// This matches .ts files but not .d.ts files.
var TS_EXT = /(^.|(?!\.d)..)\.ts$/;
describe('StaticSymbolResolver', function () {
    var noContext = new compiler_1.StaticSymbol('', '', []);
    var host;
    var symbolResolver;
    var symbolCache;
    beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
    function init(testData, summaries, summaryImportAs) {
        if (testData === void 0) { testData = DEFAULT_TEST_DATA; }
        if (summaries === void 0) { summaries = []; }
        if (summaryImportAs === void 0) { summaryImportAs = []; }
        host = new MockStaticSymbolResolverHost(testData);
        symbolResolver = new compiler_1.StaticSymbolResolver(host, symbolCache, new MockSummaryResolver(summaries, summaryImportAs));
    }
    beforeEach(function () { return init(); });
    it('should throw an exception for unsupported metadata versions', function () {
        expect(function () { return symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('src/version-error', 'e')); })
            .toThrow(new Error('Metadata version mismatch for module /tmp/src/version-error.d.ts, found version 100, expected 3'));
    });
    it('should throw an exception for version 2 metadata', function () {
        expect(function () { return symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('src/version-2-error', 'e')); })
            .toThrowError('Unsupported metadata version 2 for module /tmp/src/version-2-error.d.ts. This module should be compiled with a newer version of ngc');
    });
    it('should be produce the same symbol if asked twice', function () {
        var foo1 = symbolResolver.getStaticSymbol('main.ts', 'foo');
        var foo2 = symbolResolver.getStaticSymbol('main.ts', 'foo');
        expect(foo1).toBe(foo2);
    });
    it('should be able to produce a symbol for a module with no file', function () {
        expect(symbolResolver.getStaticSymbol('angularjs', 'SomeAngularSymbol')).toBeDefined();
    });
    it('should be able to split the metadata per symbol', function () {
        init({
            '/tmp/src/test.ts': "\n        export var a = 1;\n        export var b = 2;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'a'))
            .metadata)
            .toBe(1);
        expect(symbolResolver.resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'b'))
            .metadata)
            .toBe(2);
    });
    it('should be able to resolve static symbols with members', function () {
        init({
            '/tmp/src/test.ts': "\n        export {exportedObj} from './export';\n\n        export var obj = {a: 1};\n        export class SomeClass {\n          static someField = 2;\n        }\n      ",
            '/tmp/src/export.ts': "\n        export var exportedObj = {};\n      ",
        });
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'obj', ['a']))
            .metadata)
            .toBe(1);
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'SomeClass', ['someField']))
            .metadata)
            .toBe(2);
        expect(symbolResolver
            .resolveSymbol(symbolResolver.getStaticSymbol('/tmp/src/test.ts', 'exportedObj', ['someMember']))
            .metadata)
            .toBe(symbolResolver.getStaticSymbol('/tmp/src/export.ts', 'exportedObj', ['someMember']));
    });
    it('should use summaries in resolveSymbol and prefer them over regular metadata', function () {
        var someSymbol = symbolCache.get('/test.ts', 'a');
        init({ '/test.ts': 'export var a = 2' }, [{ symbol: someSymbol, metadata: 1 }]);
        expect(symbolResolver.resolveSymbol(someSymbol).metadata).toBe(1);
    });
    it('should be able to get all exported symbols of a file', function () {
        expect(symbolResolver.getSymbolsOf('/tmp/src/reexport/src/origin1.d.ts')).toEqual([
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'One'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'Two'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/src/origin1.d.ts', 'Three'),
        ]);
    });
    it('should be able to get all reexported symbols of a file', function () {
        expect(symbolResolver.getSymbolsOf('/tmp/src/reexport/reexport.d.ts')).toEqual([
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'One'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Two'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Four'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Five'),
            symbolResolver.getStaticSymbol('/tmp/src/reexport/reexport.d.ts', 'Thirty')
        ]);
    });
    it('should merge the exported symbols of a file with the exported symbols of its summary', function () {
        var someSymbol = symbolCache.get('/test.ts', 'a');
        init({ '/test.ts': 'export var b = 2' }, [{ symbol: symbolCache.get('/test.ts', 'a'), metadata: 1 }]);
        expect(symbolResolver.getSymbolsOf('/test.ts')).toEqual([
            symbolCache.get('/test.ts', 'a'), symbolCache.get('/test.ts', 'b')
        ]);
    });
    describe('importAs', function () {
        it('should calculate importAs relationship for non source files without summaries', function () {
            init({
                '/test.d.ts': [{
                        '__symbolic': 'module',
                        'version': 3,
                        'metadata': {
                            'a': { '__symbolic': 'reference', 'name': 'b', 'module': './test2' },
                        }
                    }],
                '/test2.d.ts': [{
                        '__symbolic': 'module',
                        'version': 3,
                        'metadata': {
                            'b': { '__symbolic': 'reference', 'name': 'c', 'module': './test3' },
                        }
                    }]
            }, []);
            symbolResolver.getSymbolsOf('/test.d.ts');
            symbolResolver.getSymbolsOf('/test2.d.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'b')))
                .toBe(symbolCache.get('/test.d.ts', 'a'));
            expect(symbolResolver.getImportAs(symbolCache.get('/test3.d.ts', 'c')))
                .toBe(symbolCache.get('/test.d.ts', 'a'));
        });
        it('should calculate importAs relationship for non source files with summaries', function () {
            init({
                '/test.ts': "\n          export {a} from './test2';\n        "
            }, [], [{
                    symbol: symbolCache.get('/test2.d.ts', 'a'),
                    importAs: symbolCache.get('/test3.d.ts', 'b')
                }]);
            symbolResolver.getSymbolsOf('/test.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'a')))
                .toBe(symbolCache.get('/test3.d.ts', 'b'));
        });
        it('should calculate importAs for symbols with members based on importAs for symbols without', function () {
            init({
                '/test.ts': "\n          export {a} from './test2';\n        "
            }, [], [{
                    symbol: symbolCache.get('/test2.d.ts', 'a'),
                    importAs: symbolCache.get('/test3.d.ts', 'b')
                }]);
            symbolResolver.getSymbolsOf('/test.ts');
            expect(symbolResolver.getImportAs(symbolCache.get('/test2.d.ts', 'a', ['someMember'])))
                .toBe(symbolCache.get('/test3.d.ts', 'b', ['someMember']));
        });
    });
    it('should replace references by StaticSymbols', function () {
        init({
            '/test.ts': "\n        import {b, y} from './test2';\n        export var a = b;\n        export var x = [y];\n\n        export function simpleFn(fnArg) {\n          return [a, y, fnArg];\n        }\n      ",
            '/test2.ts': "\n        export var b;\n        export var y;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'a')).metadata)
            .toEqual(symbolCache.get('/test2.ts', 'b'));
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'x')).metadata).toEqual([
            symbolCache.get('/test2.ts', 'y')
        ]);
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'simpleFn')).metadata).toEqual({
            __symbolic: 'function',
            parameters: ['fnArg'],
            value: [
                symbolCache.get('/test.ts', 'a'), symbolCache.get('/test2.ts', 'y'),
                Object({ __symbolic: 'reference', name: 'fnArg' })
            ]
        });
    });
    it('should ignore module references without a name', function () {
        init({
            '/test.ts': "\n        import Default from './test2';\n        export {Default};\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'Default')).metadata)
            .toBeFalsy();
    });
    it('should fill references to ambient symbols with undefined', function () {
        init({
            '/test.ts': "\n        export var y = 1;\n        export var z = [window, z];\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', 'z')).metadata).toEqual([
            undefined, symbolCache.get('/test.ts', 'z')
        ]);
    });
    it('should allow to use symbols with __', function () {
        init({
            '/test.ts': "\n        export {__a__ as __b__} from './test2';\n        import {__c__} from './test2';\n\n        export var __x__ = 1;\n        export var __y__ = __c__;\n      "
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__x__')).metadata).toBe(1);
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__y__')).metadata)
            .toBe(symbolCache.get('/test2.d.ts', '__c__'));
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.ts', '__b__')).metadata)
            .toBe(symbolCache.get('/test2.d.ts', '__a__'));
        expect(symbolResolver.getSymbolsOf('/test.ts')).toEqual([
            symbolCache.get('/test.ts', '__x__'), symbolCache.get('/test.ts', '__y__'),
            symbolCache.get('/test.ts', '__b__')
        ]);
    });
    it('should only use the arity for classes from libraries without summaries', function () {
        init({
            '/test.d.ts': [{
                    '__symbolic': 'module',
                    'version': 3,
                    'metadata': {
                        'AParam': { __symbolic: 'class' },
                        'AClass': {
                            __symbolic: 'class',
                            arity: 1,
                            members: {
                                __ctor__: [{
                                        __symbolic: 'constructor',
                                        parameters: [symbolCache.get('/test.d.ts', 'AParam')]
                                    }]
                            }
                        }
                    }
                }]
        });
        expect(symbolResolver.resolveSymbol(symbolCache.get('/test.d.ts', 'AClass')).metadata)
            .toEqual({ __symbolic: 'class', arity: 1 });
    });
    it('should be able to trace a named export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('One');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
    it('should be able to trace a renamed export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Four', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('Three');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
    it('should be able to trace an export * export', function () {
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Five', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol.name).toEqual('Five');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin5.d.ts');
    });
    it('should be able to trace a multi-level re-export', function () {
        var symbol1 = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'Thirty', '/tmp/src/main.ts'))
            .metadata;
        expect(symbol1.name).toEqual('Thirty');
        expect(symbol1.filePath).toEqual('/tmp/src/reexport/src/reexport2.d.ts');
        var symbol2 = symbolResolver.resolveSymbol(symbol1).metadata;
        expect(symbol2.name).toEqual('Thirty');
        expect(symbol2.filePath).toEqual('/tmp/src/reexport/src/origin30.d.ts');
    });
    it('should cache tracing a named export', function () {
        var moduleNameToFileNameSpy = spyOn(host, 'moduleNameToFileName').and.callThrough();
        var getMetadataForSpy = spyOn(host, 'getMetadataFor').and.callThrough();
        symbolResolver.resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'));
        moduleNameToFileNameSpy.calls.reset();
        getMetadataForSpy.calls.reset();
        var symbol = symbolResolver
            .resolveSymbol(symbolResolver.getSymbolByModule('./reexport/reexport', 'One', '/tmp/src/main.ts'))
            .metadata;
        expect(moduleNameToFileNameSpy.calls.count()).toBe(1);
        expect(getMetadataForSpy.calls.count()).toBe(0);
        expect(symbol.name).toEqual('One');
        expect(symbol.filePath).toEqual('/tmp/src/reexport/src/origin1.d.ts');
    });
});
var MockSummaryResolver = (function () {
    function MockSummaryResolver(summaries, importAs) {
        if (summaries === void 0) { summaries = []; }
        if (importAs === void 0) { importAs = []; }
        this.summaries = summaries;
        this.importAs = importAs;
    }
    MockSummaryResolver.prototype.addSummary = function (summary) { this.summaries.push(summary); };
    ;
    MockSummaryResolver.prototype.resolveSummary = function (reference) {
        return this.summaries.find(function (summary) { return summary.symbol === reference; });
    };
    ;
    MockSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        return this.summaries.filter(function (summary) { return summary.symbol.filePath === filePath; })
            .map(function (summary) { return summary.symbol; });
    };
    MockSummaryResolver.prototype.getImportAs = function (symbol) {
        var entry = this.importAs.find(function (entry) { return entry.symbol === symbol; });
        return entry ? entry.importAs : undefined;
    };
    MockSummaryResolver.prototype.isLibraryFile = function (filePath) { return filePath.endsWith('.d.ts'); };
    MockSummaryResolver.prototype.getLibraryFileName = function (filePath) { return filePath.replace(/(\.d)?\.ts$/, '.d.ts'); };
    return MockSummaryResolver;
}());
exports.MockSummaryResolver = MockSummaryResolver;
var MockStaticSymbolResolverHost = (function () {
    function MockStaticSymbolResolverHost(data, collectorOptions) {
        this.data = data;
        this.collector = new tsc_wrapped_1.MetadataCollector(collectorOptions);
    }
    // In tests, assume that symbols are not re-exported
    MockStaticSymbolResolverHost.prototype.moduleNameToFileName = function (modulePath, containingFile) {
        function splitPath(path) { return path.split(/\/|\\/g); }
        function resolvePath(pathParts) {
            var result = [];
            pathParts.forEach(function (part, index) {
                switch (part) {
                    case '':
                    case '.':
                        if (index > 0)
                            return;
                        break;
                    case '..':
                        if (index > 0 && result.length != 0)
                            result.pop();
                        return;
                }
                result.push(part);
            });
            return result.join('/');
        }
        function pathTo(from, to) {
            var result = to;
            if (to.startsWith('.')) {
                var fromParts = splitPath(from);
                fromParts.pop(); // remove the file name.
                var toParts = splitPath(to);
                result = resolvePath(fromParts.concat(toParts));
            }
            return result;
        }
        if (modulePath.indexOf('.') === 0) {
            var baseName = pathTo(containingFile, modulePath);
            var tsName = baseName + '.ts';
            if (this._getMetadataFor(tsName)) {
                return tsName;
            }
            return baseName + '.d.ts';
        }
        if (modulePath == 'unresolved') {
            return undefined;
        }
        return '/tmp/' + modulePath + '.d.ts';
    };
    MockStaticSymbolResolverHost.prototype.fileNameToModuleName = function (filePath, containingFile) {
        return filePath.replace(/(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/, '');
    };
    MockStaticSymbolResolverHost.prototype.getMetadataFor = function (moduleId) { return this._getMetadataFor(moduleId); };
    MockStaticSymbolResolverHost.prototype._getMetadataFor = function (filePath) {
        if (this.data[filePath] && filePath.match(TS_EXT)) {
            var text = this.data[filePath];
            if (typeof text === 'string') {
                var sf = ts.createSourceFile(filePath, this.data[filePath], ts.ScriptTarget.ES5, /* setParentNodes */ true);
                var diagnostics = sf.parseDiagnostics;
                if (diagnostics && diagnostics.length) {
                    var errors = diagnostics
                        .map(function (d) {
                        var _a = ts.getLineAndCharacterOfPosition(d.file, d.start), line = _a.line, character = _a.character;
                        return "(" + line + ":" + character + "): " + d.messageText;
                    })
                        .join('\n');
                    throw Error("Error encountered during parse of file " + filePath + "\n" + errors);
                }
                return [this.collector.getMetadata(sf)];
            }
        }
        var result = this.data[filePath];
        if (result) {
            return Array.isArray(result) ? result : [result];
        }
        else {
            return null;
        }
    };
    return MockStaticSymbolResolverHost;
}());
exports.MockStaticSymbolResolverHost = MockStaticSymbolResolverHost;
var DEFAULT_TEST_DATA = {
    '/tmp/src/version-error.d.ts': { '__symbolic': 'module', 'version': 100, metadata: { e: 's' } },
    '/tmp/src/version-2-error.d.ts': { '__symbolic': 'module', 'version': 2, metadata: { e: 's' } },
    '/tmp/src/reexport/reexport.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {},
        exports: [
            { from: './src/origin1', export: ['One', 'Two', { name: 'Three', as: 'Four' }] },
            { from: './src/origin5' }, { from: './src/reexport2' }
        ]
    },
    '/tmp/src/reexport/src/origin1.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            One: { __symbolic: 'class' },
            Two: { __symbolic: 'class' },
            Three: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/origin5.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            Five: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/origin30.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            Thirty: { __symbolic: 'class' },
        },
    },
    '/tmp/src/reexport/src/originNone.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {},
    },
    '/tmp/src/reexport/src/reexport2.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {},
        exports: [{ from: './originNone' }, { from: './origin30' }]
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3N5bWJvbF9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3RhdGljX3N5bWJvbF9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQTRJO0FBQzVJLG9EQUF5RTtBQUN6RSwrQkFBaUM7QUFHakMsOENBQThDO0FBQzlDLElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDO0FBRXJDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUMvQixJQUFNLFNBQVMsR0FBRyxJQUFJLHVCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxJQUFJLElBQThCLENBQUM7SUFDbkMsSUFBSSxjQUFvQyxDQUFDO0lBQ3pDLElBQUksV0FBOEIsQ0FBQztJQUVuQyxVQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0QsY0FDSSxRQUFrRCxFQUFFLFNBQXVDLEVBQzNGLGVBQXNFO1FBRHRFLHlCQUFBLEVBQUEsNEJBQWtEO1FBQUUsMEJBQUEsRUFBQSxjQUF1QztRQUMzRixnQ0FBQSxFQUFBLG9CQUFzRTtRQUN4RSxJQUFJLEdBQUcsSUFBSSw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxjQUFjLEdBQUcsSUFBSSwrQkFBb0IsQ0FDckMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxVQUFVLENBQUMsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQyxDQUFDO0lBRXpCLEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtRQUNoRSxNQUFNLENBQ0YsY0FBTSxPQUFB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