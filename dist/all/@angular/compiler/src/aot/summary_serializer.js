"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compile_metadata_1 = require("../compile_metadata");
var o = require("../output/output_ast");
var util_1 = require("../util");
var static_symbol_1 = require("./static_symbol");
var util_2 = require("./util");
function serializeSummaries(forJitCtx, summaryResolver, symbolResolver, symbols, types) {
    var toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver);
    var forJitSerializer = new ForJitSerializer(forJitCtx, symbolResolver);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach(function (resolvedSymbol) { return toJsonSerializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (var processedIndex = 0; processedIndex < toJsonSerializer.symbols.length; processedIndex++) {
        var symbol = toJsonSerializer.symbols[processedIndex];
        if (summaryResolver.isLibraryFile(symbol.filePath)) {
            var summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                var resolvedSymbol = symbolResolver.resolveSymbol(symbol);
                if (resolvedSymbol) {
                    summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
                }
            }
            if (summary) {
                if (summary.type) {
                    forJitSerializer.addLibType(summary.type);
                }
                toJsonSerializer.addOrMergeSummary(summary);
            }
        }
    }
    // Add type summaries.
    // Note: We don't add the summaries of all referenced symbols as for the ResolvedSymbols,
    // as the type summaries already contain the transitive data that they require
    // (in a minimal way).
    types.forEach(function (_a) {
        var summary = _a.summary, metadata = _a.metadata;
        forJitSerializer.addSourceType(summary, metadata);
        toJsonSerializer.addOrMergeSummary({ symbol: summary.type.reference, metadata: null, type: summary });
        if (summary.summaryKind === compile_metadata_1.CompileSummaryKind.NgModule) {
            var ngModuleSummary = summary;
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                var symbol = id.reference;
                if (summaryResolver.isLibraryFile(symbol.filePath)) {
                    var summary_1 = summaryResolver.resolveSummary(symbol);
                    if (summary_1) {
                        toJsonSerializer.addOrMergeSummary(summary_1);
                    }
                }
            });
        }
    });
    var _a = toJsonSerializer.serialize(), json = _a.json, exportAs = _a.exportAs;
    forJitSerializer.serialize(exportAs);
    return { json: json, exportAs: exportAs };
}
exports.serializeSummaries = serializeSummaries;
function deserializeSummaries(symbolCache, json) {
    var deserializer = new FromJsonDeserializer(symbolCache);
    return deserializer.deserialize(json);
}
exports.deserializeSummaries = deserializeSummaries;
function createForJitStub(outputCtx, reference) {
    return createSummaryForJitFunction(outputCtx, reference, o.NULL_EXPR);
}
exports.createForJitStub = createForJitStub;
function createSummaryForJitFunction(outputCtx, reference, value) {
    var fnName = util_2.summaryForJitName(reference.name);
    outputCtx.statements.push(o.fn([], [new o.ReturnStatement(value)], new o.ArrayType(o.DYNAMIC_TYPE)).toDeclStmt(fnName, [
        o.StmtModifier.Final, o.StmtModifier.Exported
    ]));
}
var ToJsonSerializer = (function (_super) {
    __extends(ToJsonSerializer, _super);
    function ToJsonSerializer(symbolResolver, summaryResolver) {
        var _this = _super.call(this) || this;
        _this.symbolResolver = symbolResolver;
        _this.summaryResolver = summaryResolver;
        // Note: This only contains symbols without members.
        _this.symbols = [];
        _this.indexBySymbol = new Map();
        // This now contains a `__symbol: number` in the place of
        // StaticSymbols, but otherwise has the same shape as the original objects.
        _this.processedSummaryBySymbol = new Map();
        _this.processedSummaries = [];
        return _this;
    }
    ToJsonSerializer.prototype.addOrMergeSummary = function (summary) {
        var symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we keep everything except their class decorators.
            // We need to keep e.g. the ctor args, method names, method decorators
            // so that the class can be extended in another compilation unit.
            // We don't keep the class decorators as
            // 1) they refer to data
            //   that should not cause a rebuild of downstream compilation units
            //   (e.g. inline templates of @Component, or @NgModule.declarations)
            // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
            var clone_1 = {};
            Object.keys(symbolMeta).forEach(function (propName) {
                if (propName !== 'decorators') {
                    clone_1[propName] = symbolMeta[propName];
                }
            });
            symbolMeta = clone_1;
        }
        var processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!processedSummary) {
            processedSummary = this.processValue({ symbol: summary.symbol });
            this.processedSummaries.push(processedSummary);
            this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        // Note: == on purpose to compare with undefined!
        if (processedSummary.metadata == null && symbolMeta != null) {
            processedSummary.metadata = this.processValue(symbolMeta);
        }
        // Note: == on purpose to compare with undefined!
        if (processedSummary.type == null && summary.type != null) {
            processedSummary.type = this.processValue(summary.type);
        }
    };
    ToJsonSerializer.prototype.serialize = function () {
        var _this = this;
        var exportAs = [];
        var json = JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map(function (symbol, index) {
                symbol.assertNoMembers();
                var importAs = undefined;
                if (_this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    importAs = symbol.name + "_" + index;
                    exportAs.push({ symbol: symbol, exportAs: importAs });
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    // We convert the source filenames tinto output filenames,
                    // as the generated summary file will be used when the current
                    // compilation unit is used as a library
                    filePath: _this.summaryResolver.getLibraryFileName(symbol.filePath),
                    importAs: importAs
                };
            })
        });
        return { json: json, exportAs: exportAs };
    };
    ToJsonSerializer.prototype.processValue = function (value) { return util_1.visitValue(value, this, null); };
    ToJsonSerializer.prototype.visitOther = function (value, context) {
        if (value instanceof static_symbol_1.StaticSymbol) {
            var baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            var index = this.indexBySymbol.get(baseSymbol);
            // Note: == on purpose to compare with undefined!
            if (index == null) {
                index = this.indexBySymbol.size;
                this.indexBySymbol.set(baseSymbol, index);
                this.symbols.push(baseSymbol);
            }
            return { __symbol: index, members: value.members };
        }
    };
    return ToJsonSerializer;
}(util_1.ValueTransformer));
var ForJitSerializer = (function () {
    function ForJitSerializer(outputCtx, symbolResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.data = new Map();
    }
    ForJitSerializer.prototype.addSourceType = function (summary, metadata) {
        this.data.set(summary.type.reference, { summary: summary, metadata: metadata, isLibrary: false });
    };
    ForJitSerializer.prototype.addLibType = function (summary) {
        this.data.set(summary.type.reference, { summary: summary, metadata: null, isLibrary: true });
    };
    ForJitSerializer.prototype.serialize = function (exportAs) {
        var _this = this;
        var ngModuleSymbols = new Set();
        Array.from(this.data.values()).forEach(function (_a) {
            var summary = _a.summary, metadata = _a.metadata, isLibrary = _a.isLibrary;
            if (summary.summaryKind === compile_metadata_1.CompileSummaryKind.NgModule) {
                // collect the symbols that refer to NgModule classes.
                // Note: we can't just rely on `summary.type.summaryKind` to determine this as
                // we don't add the summaries of all referenced symbols when we serialize type summaries.
                // See serializeSummaries for details.
                ngModuleSymbols.add(summary.type.reference);
                var modSummary = summary;
                modSummary.modules.forEach(function (mod) { ngModuleSymbols.add(mod.reference); });
            }
            if (!isLibrary) {
                var fnName = util_2.summaryForJitName(summary.type.reference.name);
                createSummaryForJitFunction(_this.outputCtx, summary.type.reference, _this.serializeSummaryWithDeps(summary, metadata));
            }
        });
        exportAs.forEach(function (entry) {
            var symbol = entry.symbol;
            if (ngModuleSymbols.has(symbol)) {
                var jitExportAsName = util_2.summaryForJitName(entry.exportAs);
                _this.outputCtx.statements.push(o.variable(jitExportAsName).set(_this.serializeSummaryRef(symbol)).toDeclStmt(null, [
                    o.StmtModifier.Exported
                ]));
            }
        });
    };
    ForJitSerializer.prototype.serializeSummaryWithDeps = function (summary, metadata) {
        var _this = this;
        var expressions = [this.serializeSummary(summary)];
        var providers = [];
        if (metadata instanceof compile_metadata_1.CompileNgModuleMetadata) {
            expressions.push.apply(expressions, 
            // For directives / pipes, we only add the declared ones,
            // and rely on transitively importing NgModules to get the transitive
            // summaries.
            metadata.declaredDirectives.concat(metadata.declaredPipes)
                .map(function (type) { return type.reference; })
                .concat(metadata.transitiveModule.modules.map(function (type) { return type.reference; })
                .filter(function (ref) { return ref !== metadata.type.reference; }))
                .map(function (ref) { return _this.serializeSummaryRef(ref); }));
            // Note: We don't use `NgModuleSummary.providers`, as that one is transitive,
            // and we already have transitive modules.
            providers = metadata.providers;
        }
        else if (summary.summaryKind === compile_metadata_1.CompileSummaryKind.Directive) {
            var dirSummary = summary;
            providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        // Note: We can't just refer to the `ngsummary.ts` files for `useClass` providers (as we do for
        // declaredDirectives / declaredPipes), as we allow
        // providers without ctor arguments to skip the `@Injectable` decorator,
        // i.e. we didn't generate .ngsummary.ts files for these.
        expressions.push.apply(expressions, providers.filter(function (provider) { return !!provider.useClass; }).map(function (provider) { return _this.serializeSummary({
            summaryKind: compile_metadata_1.CompileSummaryKind.Injectable, type: provider.useClass
        }); }));
        return o.literalArr(expressions);
    };
    ForJitSerializer.prototype.serializeSummaryRef = function (typeSymbol) {
        var jitImportedSymbol = this.symbolResolver.getStaticSymbol(util_2.summaryForJitFileName(typeSymbol.filePath), util_2.summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
    };
    ForJitSerializer.prototype.serializeSummary = function (data) {
        var outputCtx = this.outputCtx;
        var Transformer = (function () {
            function Transformer() {
            }
            Transformer.prototype.visitArray = function (arr, context) {
                var _this = this;
                return o.literalArr(arr.map(function (entry) { return util_1.visitValue(entry, _this, context); }));
            };
            Transformer.prototype.visitStringMap = function (map, context) {
                var _this = this;
                return new o.LiteralMapExpr(Object.keys(map).map(function (key) { return new o.LiteralMapEntry(key, util_1.visitValue(map[key], _this, context), false); }));
            };
            Transformer.prototype.visitPrimitive = function (value, context) { return o.literal(value); };
            Transformer.prototype.visitOther = function (value, context) {
                if (value instanceof static_symbol_1.StaticSymbol) {
                    return outputCtx.importExpr(value);
                }
                else {
                    throw new Error("Illegal State: Encountered value " + value);
                }
            };
            return Transformer;
        }());
        return util_1.visitValue(data, new Transformer(), null);
    };
    return ForJitSerializer;
}());
var FromJsonDeserializer = (function (_super) {
    __extends(FromJsonDeserializer, _super);
    function FromJsonDeserializer(symbolCache) {
        var _this = _super.call(this) || this;
        _this.symbolCache = symbolCache;
        return _this;
    }
    FromJsonDeserializer.prototype.deserialize = function (json) {
        var _this = this;
        var data = JSON.parse(json);
        var importAs = [];
        this.symbols = [];
        data.symbols.forEach(function (serializedSymbol) {
            var symbol = _this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
            _this.symbols.push(symbol);
            if (serializedSymbol.importAs) {
                importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
            }
        });
        var summaries = util_1.visitValue(data.summaries, this, null);
        return { summaries: summaries, importAs: importAs };
    };
    FromJsonDeserializer.prototype.visitStringMap = function (map, context) {
        if ('__symbol' in map) {
            var baseSymbol = this.symbols[map['__symbol']];
            var members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return _super.prototype.visitStringMap.call(this, map, context);
        }
    };
    return FromJsonDeserializer;
}(util_1.ValueTransformer));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2FvdC9zdW1tYXJ5X3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0RBQWtQO0FBQ2xQLHdDQUEwQztBQUUxQyxnQ0FBa0Y7QUFFbEYsaURBQWdFO0FBRWhFLCtCQUFnRTtBQUVoRSw0QkFDSSxTQUF3QixFQUFFLGVBQThDLEVBQ3hFLGNBQW9DLEVBQUUsT0FBK0IsRUFBRSxLQUlwRTtJQUNMLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDL0UsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUV6RSxzRUFBc0U7SUFDdEUsMEVBQTBFO0lBQzFFLHNCQUFzQjtJQUN0QixPQUFPLENBQUMsT0FBTyxDQUNYLFVBQUMsY0FBYyxJQUFLLE9BQUEsZ0JBQWdCLENBQUMsaUJBQWlCLENBQ2xELEVBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRLEVBQUMsQ0FBQyxFQURuRCxDQUNtRCxDQUFDLENBQUM7SUFDN0Usd0VBQXdFO0lBQ3hFLDREQUE0RDtJQUM1RCx1QkFBdUI7SUFDdkIsR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUM7UUFDaEcsSUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsTUFBTSxD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