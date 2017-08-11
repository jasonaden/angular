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
var util_1 = require("@angular/compiler/src/aot/util");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
var summary_resolver_spec_1 = require("./summary_resolver_spec");
function main() {
    describe('summary serializer', function () {
        var summaryResolver;
        var symbolResolver;
        var symbolCache;
        var host;
        beforeEach(function () { symbolCache = new compiler_1.StaticSymbolCache(); });
        function init(summaries, metadata) {
            if (summaries === void 0) { summaries = {}; }
            if (metadata === void 0) { metadata = {}; }
            host = new summary_resolver_spec_1.MockAotSummaryResolverHost(summaries);
            summaryResolver = new compiler_1.AotSummaryResolver(host, symbolCache);
            symbolResolver = new compiler_1.StaticSymbolResolver(new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost(metadata), symbolCache, summaryResolver);
        }
        describe('summaryFileName', function () {
            it('should add .ngsummary.json to the filename', function () {
                init();
                expect(util_1.summaryFileName('a.ts')).toBe('a.ngsummary.json');
                expect(util_1.summaryFileName('a.d.ts')).toBe('a.ngsummary.json');
                expect(util_1.summaryFileName('a.js')).toBe('a.ngsummary.json');
            });
        });
        it('should serialize various data correctly', function () {
            init();
            var serializedData = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/some_values.ts', 'Values'),
                    metadata: {
                        aNumber: 1,
                        aString: 'hello',
                        anArray: [1, 2],
                        aStaticSymbol: symbolCache.get('/tmp/some_symbol.ts', 'someName'),
                        aStaticSymbolWithMembers: symbolCache.get('/tmp/some_symbol.ts', 'someName', ['someMember']),
                    }
                },
                {
                    symbol: symbolCache.get('/tmp/some_service.ts', 'SomeService'),
                    metadata: {
                        __symbolic: 'class',
                        members: { 'aMethod': { __symbolic: 'function' } },
                        statics: { aStatic: true },
                        decorators: ['aDecoratorData']
                    }
                }
            ], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Injectable,
                        type: {
                            reference: symbolCache.get('/tmp/some_service.ts', 'SomeService'),
                        }
                    },
                    metadata: null
                }]);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, serializedData.json).summaries;
            expect(summaries.length).toBe(2);
            // Note: change from .ts to .d.ts is expected
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/some_values.d.ts', 'Values'));
            expect(summaries[0].metadata).toEqual({
                aNumber: 1,
                aString: 'hello',
                anArray: [1, 2],
                aStaticSymbol: symbolCache.get('/tmp/some_symbol.d.ts', 'someName'),
                aStaticSymbolWithMembers: symbolCache.get('/tmp/some_symbol.d.ts', 'someName', ['someMember'])
            });
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/some_service.d.ts', 'SomeService'));
            // serialization should drop class decorators
            expect(summaries[1].metadata).toEqual({
                __symbolic: 'class',
                members: { aMethod: { __symbolic: 'function' } },
                statics: { aStatic: true }
            });
            expect(summaries[1].type.type.reference)
                .toBe(symbolCache.get('/tmp/some_service.d.ts', 'SomeService'));
        });
        it('should automatically add exported directives / pipes of NgModules that are not source files', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [], [
                {
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Pipe,
                        type: {
                            reference: symbolCache.get('/tmp/external.ts', 'SomeExternalPipe'),
                        }
                    },
                    metadata: null
                },
                {
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Directive,
                        type: {
                            reference: symbolCache.get('/tmp/external.ts', 'SomeExternalDir'),
                        },
                        providers: [],
                        viewProviders: [],
                    },
                    metadata: null
                }
            ]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            });
            var serialized = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.NgModule,
                        type: { reference: symbolCache.get('/tmp/some_module.ts', 'SomeModule') },
                        exportedPipes: [
                            { reference: symbolCache.get('/tmp/some_pipe.ts', 'SomePipe') },
                            { reference: symbolCache.get('/tmp/external.d.ts', 'SomeExternalPipe') }
                        ],
                        exportedDirectives: [
                            { reference: symbolCache.get('/tmp/some_dir.ts', 'SomeDir') },
                            { reference: symbolCache.get('/tmp/external.d.ts', 'SomeExternalDir') }
                        ],
                        providers: [],
                        modules: [],
                    },
                    metadata: null
                }]);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, serialized.json).summaries;
            expect(summaries.length).toBe(3);
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/some_module.d.ts', 'SomeModule'));
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalDir'));
            expect(summaries[2].symbol)
                .toBe(symbolCache.get('/tmp/external.d.ts', 'SomeExternalPipe'));
        });
        it('should automatically add the metadata of referenced symbols that are not in the source files', function () {
            init();
            var externalSerialized = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [
                {
                    symbol: symbolCache.get('/tmp/external.ts', 'PROVIDERS'),
                    metadata: [symbolCache.get('/tmp/external_svc.ts', 'SomeService')]
                },
                {
                    symbol: symbolCache.get('/tmp/external_svc.ts', 'SomeService'),
                    metadata: { __symbolic: 'class' }
                }
            ], [{
                    summary: {
                        summaryKind: compiler_1.CompileSummaryKind.Injectable,
                        type: {
                            reference: symbolCache.get('/tmp/external_svc.ts', 'SomeService'),
                        }
                    },
                    metadata: null
                }]);
            init({
                '/tmp/external.ngsummary.json': externalSerialized.json,
            }, {
                '/tmp/local.ts': "\n          export var local = 'a';\n        ",
                '/tmp/non_summary.d.ts': { __symbolic: 'module', version: 3, metadata: { 'external': 'b' } }
            });
            var serialized = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'main'),
                    metadata: {
                        local: symbolCache.get('/tmp/local.ts', 'local'),
                        external: symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'),
                        externalNonSummary: symbolCache.get('/tmp/non_summary.d.ts', 'external')
                    }
                }], []);
            var summaries = summary_serializer_1.deserializeSummaries(symbolCache, serialized.json).summaries;
            // Note: local should not show up!
            expect(summaries.length).toBe(4);
            expect(summaries[0].symbol).toBe(symbolCache.get('/tmp/test.d.ts', 'main'));
            expect(summaries[0].metadata).toEqual({
                local: symbolCache.get('/tmp/local.d.ts', 'local'),
                external: symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'),
                externalNonSummary: symbolCache.get('/tmp/non_summary.d.ts', 'external')
            });
            expect(summaries[1].symbol).toBe(symbolCache.get('/tmp/external.d.ts', 'PROVIDERS'));
            expect(summaries[1].metadata).toEqual([symbolCache.get('/tmp/external_svc.d.ts', 'SomeService')]);
            // there was no summary for non_summary, but it should have
            // been serialized as well.
            expect(summaries[2].symbol).toBe(symbolCache.get('/tmp/non_summary.d.ts', 'external'));
            expect(summaries[2].metadata).toEqual('b');
            // SomService is a transitive dep, but should have been serialized as well.
            expect(summaries[3].symbol).toBe(symbolCache.get('/tmp/external_svc.d.ts', 'SomeService'));
            expect(summaries[3].type.type.reference)
                .toBe(symbolCache.get('/tmp/external_svc.d.ts', 'SomeService'));
        });
        it('should create "importAs" names for non source symbols', function () {
            init();
            var serialized = summary_serializer_1.serializeSummaries(summary_resolver_spec_1.createMockOutputContext(), summaryResolver, symbolResolver, [{
                    symbol: symbolCache.get('/tmp/test.ts', 'main'),
                    metadata: [
                        symbolCache.get('/tmp/external.d.ts', 'lib'),
                        symbolCache.get('/tmp/external.d.ts', 'lib', ['someMember']),
                    ]
                }], []);
            // Note: no entry for the symbol with members!
            expect(serialized.exportAs).toEqual([
                { symbol: symbolCache.get('/tmp/external.d.ts', 'lib'), exportAs: 'lib_1' }
            ]);
            var deserialized = summary_serializer_1.deserializeSummaries(symbolCache, serialized.json);
            // Note: no entry for the symbol with members!
            expect(deserialized.importAs).toEqual([
                { symbol: symbolCache.get('/tmp/external.d.ts', 'lib'), importAs: 'lib_1' }
            ]);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9zZXJpYWxpemVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2FvdC9zdW1tYXJ5X3NlcmlhbGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFrTDtBQUNsTCxtRkFBc0c7QUFDdEcsdURBQStEO0FBRS9ELDZFQUEyRTtBQUMzRSxpRUFBNEY7QUFHNUY7SUFDRSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxlQUFtQyxDQUFDO1FBQ3hDLElBQUksY0FBb0MsQ0FBQztRQUN6QyxJQUFJLFdBQThCLENBQUM7UUFDbkMsSUFBSSxJQUFnQyxDQUFDO1FBRXJDLFVBQVUsQ0FBQyxjQUFRLFdBQVcsR0FBRyxJQUFJLDRCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxjQUNJLFNBQTRDLEVBQUUsUUFBbUM7WUFBakYsMEJBQUEsRUFBQSxjQUE0QztZQUFFLHlCQUFBLEVBQUEsYUFBbUM7WUFDbkYsSUFBSSxHQUFHLElBQUksa0RBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakQsZUFBZSxHQUFHLElBQUksNkJBQWtCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVELGNBQWMsR0FBRyxJQUFJLCtCQUFvQixDQUNyQyxJQUFJLDBEQUE0QixDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBRUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLHNCQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDekQsTUFBTSxDQUFDLHNC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