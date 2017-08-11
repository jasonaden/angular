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
var summary_serializer_1 = require("@angular/compiler/src/aot/summary_serializer");
var o = require("@angular/compiler/src/output/output_ast");
var path = require("path");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
var EXT = /(\.d)?\.ts$/;
function main() {
    describe('AotSummaryResolver', function () {
        var summaryResolver;
        var symbolCache;
        var host;
        beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
        function init(summaries) {
            if (summaries === void 0) { summaries = {}; }
            host = new MockAotSummaryResolverHost(summaries);
            summaryResolver = new compiler_1.AotSummaryResolver(host, symbolCache);
        }
        function serialize(symbols) {
            // Note: Don't use the top level host / summaryResolver as they might not be created yet
            var mockSummaryResolver = new static_symbol_resolver_spec_1.MockSummaryResolver([]);
            var symbolResolver = new compiler_1.StaticSymbolResolver(new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost({}), symbolCache, mockSummaryResolver);
            return summary_serializer_1.serializeSummaries(createMockOutputContext(), mockSummaryResolver, symbolResolver, symbols, [])
                .json;
        }
        it('should load serialized summary files', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.resolveSummary(asymbol)).toEqual({ symbol: asymbol, metadata: 1 });
        });
        it('should not load summaries for source files', function () {
            init({});
            spyOn(host, 'loadSummary').and.callThrough();
            expect(summaryResolver.resolveSummary(symbolCache.get('/a.ts', 'a'))).toBeFalsy();
            expect(host.loadSummary).not.toHaveBeenCalled();
        });
        it('should cache summaries', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.resolveSummary(asymbol)).toBe(summaryResolver.resolveSummary(asymbol));
        });
        it('should return all symbols in a summary', function () {
            var asymbol = symbolCache.get('/a.d.ts', 'a');
            init({ '/a.ngsummary.json': serialize([{ symbol: asymbol, metadata: 1 }]) });
            expect(summaryResolver.getSymbolsOf('/a.d.ts')).toEqual([asymbol]);
        });
        it('should fill importAs for deep symbols', function () {
            var libSymbol = symbolCache.get('/lib.d.ts', 'Lib');
            var srcSymbol = symbolCache.get('/src.ts', 'Src');
            init({
                '/src.ngsummary.json': serialize([{ symbol: srcSymbol, metadata: 1 }, { symbol: libSymbol, metadata: 2 }])
            });
            summaryResolver.getSymbolsOf('/src.d.ts');
            expect(summaryResolver.getImportAs(symbolCache.get('/src.d.ts', 'Src'))).toBeFalsy();
            expect(summaryResolver.getImportAs(libSymbol))
                .toBe(symbolCache.get('/src.ngfactory.d.ts', 'Lib_1'));
        });
        describe('isLibraryFile', function () {
            it('should use host.isSourceFile to calculate the result', function () {
                init();
                expect(summaryResolver.isLibraryFile('someFile.ts')).toBe(false);
                expect(summaryResolver.isLibraryFile('someFile.d.ts')).toBe(true);
            });
            it('should calculate the result for generated files based on the result for non generated files', function () {
                init();
                spyOn(host, 'isSourceFile').and.callThrough();
                expect(summaryResolver.isLibraryFile('someFile.ngfactory.ts')).toBe(false);
                expect(host.isSourceFile).toHaveBeenCalledWith('someFile.ts');
            });
        });
    });
}
exports.main = main;
var MockAotSummaryResolverHost = (function () {
    function MockAotSummaryResolverHost(summaries) {
        this.summaries = summaries;
    }
    MockAotSummaryResolverHost.prototype.fileNameToModuleName = function (fileName) {
        return './' + path.basename(fileName).replace(EXT, '');
    };
    MockAotSummaryResolverHost.prototype.getOutputFileName = function (sourceFileName) {
        return sourceFileName.replace(EXT, '') + '.d.ts';
    };
    MockAotSummaryResolverHost.prototype.isSourceFile = function (filePath) { return !filePath.endsWith('.d.ts'); };
    MockAotSummaryResolverHost.prototype.loadSummary = function (filePath) { return this.summaries[filePath]; };
    return MockAotSummaryResolverHost;
}());
exports.MockAotSummaryResolverHost = MockAotSummaryResolverHost;
function createMockOutputContext() {
    return { statements: [], genFilePath: 'someGenFilePath', importExpr: function () { return o.NULL_EXPR; } };
}
exports.createMockOutputContext = createMockOutputContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3VtbWFyeV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWtNO0FBQ2xNLG1GQUFzRztBQUN0RywyREFBNkQ7QUFFN0QsMkJBQTZCO0FBRTdCLDZFQUFnRztBQUVoRyxJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUM7QUFFMUI7SUFDRSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxlQUFtQyxDQUFDO1FBQ3hDLElBQUksV0FBOEIsQ0FBQztRQUNuQyxJQUFJLElBQWdDLENBQUM7UUFFckMsVUFBVSxDQUFDLGNBQVEsV0FBVyxHQUFHLElBQUksNEJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdELGNBQWMsU0FBNEM7WUFBNUMsMEJBQUEsRUFBQSxjQUE0QztZQUN4RCxJQUFJLEdBQUcsSUFBSSwwQkFBMEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqRCxlQUFlLEdBQUcsSUFBSSw2QkFBa0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUVELG1CQUFtQixPQUErQjtZQUNoRCx3RkFBd0Y7WUFDeEYsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLGlEQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELElBQU0sY0FBYyxHQUFHLElBQUksK0JBQW9CLENBQzNDLElBQUksMERBQTRCLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLHVDQUFrQixDQUNkLHVCQUF1QixFQUFFLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7aUJBQ2xGLElBQUksQ0FBQztR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