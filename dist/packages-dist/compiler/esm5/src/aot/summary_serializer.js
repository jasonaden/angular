/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileNgModuleMetadata, CompileSummaryKind } from '../compile_metadata';
import * as o from '../output/output_ast';
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
import { summaryForJitFileName, summaryForJitName } from './util';
/**
 * @param {?} forJitCtx
 * @param {?} summaryResolver
 * @param {?} symbolResolver
 * @param {?} symbols
 * @param {?} types
 * @return {?}
 */
export function serializeSummaries(forJitCtx, summaryResolver, symbolResolver, symbols, types) {
    var /** @type {?} */ toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver);
    var /** @type {?} */ forJitSerializer = new ForJitSerializer(forJitCtx, symbolResolver);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach(function (resolvedSymbol) { return toJsonSerializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (var /** @type {?} */ processedIndex = 0; processedIndex < toJsonSerializer.symbols.length; processedIndex++) {
        var /** @type {?} */ symbol = toJsonSerializer.symbols[processedIndex];
        if (summaryResolver.isLibraryFile(symbol.filePath)) {
            var /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                var /** @type {?} */ resolvedSymbol = symbolResolver.resolveSymbol(symbol);
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
        if (summary.summaryKind === CompileSummaryKind.NgModule) {
            var /** @type {?} */ ngModuleSummary = (summary);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                var /** @type {?} */ symbol = id.reference;
                if (summaryResolver.isLibraryFile(symbol.filePath)) {
                    var /** @type {?} */ summary_1 = summaryResolver.resolveSummary(symbol);
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
/**
 * @param {?} symbolCache
 * @param {?} json
 * @return {?}
 */
export function deserializeSummaries(symbolCache, json) {
    var /** @type {?} */ deserializer = new FromJsonDeserializer(symbolCache);
    return deserializer.deserialize(json);
}
/**
 * @param {?} outputCtx
 * @param {?} reference
 * @return {?}
 */
export function createForJitStub(outputCtx, reference) {
    return createSummaryForJitFunction(outputCtx, reference, o.NULL_EXPR);
}
/**
 * @param {?} outputCtx
 * @param {?} reference
 * @param {?} value
 * @return {?}
 */
function createSummaryForJitFunction(outputCtx, reference, value) {
    var /** @type {?} */ fnName = summaryForJitName(reference.name);
    outputCtx.statements.push(o.fn([], [new o.ReturnStatement(value)], new o.ArrayType(o.DYNAMIC_TYPE)).toDeclStmt(fnName, [
        o.StmtModifier.Final, o.StmtModifier.Exported
    ]));
}
var ToJsonSerializer = (function (_super) {
    tslib_1.__extends(ToJsonSerializer, _super);
    /**
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     */
    function ToJsonSerializer(symbolResolver, summaryResolver) {
        var _this = _super.call(this) || this;
        _this.symbolResolver = symbolResolver;
        _this.summaryResolver = summaryResolver;
        // Note: This only contains symbols without members.
        _this.symbols = [];
        _this.indexBySymbol = new Map();
        _this.processedSummaryBySymbol = new Map();
        _this.processedSummaries = [];
        return _this;
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    ToJsonSerializer.prototype.addOrMergeSummary = function (summary) {
        var /** @type {?} */ symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we keep everything except their class decorators.
            // We need to keep e.g. the ctor args, method names, method decorators
            // so that the class can be extended in another compilation unit.
            // We don't keep the class decorators as
            // 1) they refer to data
            //   that should not cause a rebuild of downstream compilation units
            //   (e.g. inline templates of @Component, or @NgModule.declarations)
            // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
            var /** @type {?} */ clone_1 = {};
            Object.keys(symbolMeta).forEach(function (propName) {
                if (propName !== 'decorators') {
                    clone_1[propName] = symbolMeta[propName];
                }
            });
            symbolMeta = clone_1;
        }
        var /** @type {?} */ processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
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
    /**
     * @return {?}
     */
    ToJsonSerializer.prototype.serialize = function () {
        var _this = this;
        var /** @type {?} */ exportAs = [];
        var /** @type {?} */ json = JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map(function (symbol, index) {
                symbol.assertNoMembers();
                var /** @type {?} */ importAs = ((undefined));
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
    /**
     * @param {?} value
     * @return {?}
     */
    ToJsonSerializer.prototype.processValue = function (value) { return visitValue(value, this, null); };
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    ToJsonSerializer.prototype.visitOther = function (value, context) {
        if (value instanceof StaticSymbol) {
            var /** @type {?} */ baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            var /** @type {?} */ index = this.indexBySymbol.get(baseSymbol);
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
}(ValueTransformer));
function ToJsonSerializer_tsickle_Closure_declarations() {
    /** @type {?} */
    ToJsonSerializer.prototype.symbols;
    /** @type {?} */
    ToJsonSerializer.prototype.indexBySymbol;
    /** @type {?} */
    ToJsonSerializer.prototype.processedSummaryBySymbol;
    /** @type {?} */
    ToJsonSerializer.prototype.processedSummaries;
    /** @type {?} */
    ToJsonSerializer.prototype.symbolResolver;
    /** @type {?} */
    ToJsonSerializer.prototype.summaryResolver;
}
var ForJitSerializer = (function () {
    /**
     * @param {?} outputCtx
     * @param {?} symbolResolver
     */
    function ForJitSerializer(outputCtx, symbolResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.data = new Map();
    }
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    ForJitSerializer.prototype.addSourceType = function (summary, metadata) {
        this.data.set(summary.type.reference, { summary: summary, metadata: metadata, isLibrary: false });
    };
    /**
     * @param {?} summary
     * @return {?}
     */
    ForJitSerializer.prototype.addLibType = function (summary) {
        this.data.set(summary.type.reference, { summary: summary, metadata: null, isLibrary: true });
    };
    /**
     * @param {?} exportAs
     * @return {?}
     */
    ForJitSerializer.prototype.serialize = function (exportAs) {
        var _this = this;
        var /** @type {?} */ ngModuleSymbols = new Set();
        Array.from(this.data.values()).forEach(function (_a) {
            var summary = _a.summary, metadata = _a.metadata, isLibrary = _a.isLibrary;
            if (summary.summaryKind === CompileSummaryKind.NgModule) {
                // collect the symbols that refer to NgModule classes.
                // Note: we can't just rely on `summary.type.summaryKind` to determine this as
                // we don't add the summaries of all referenced symbols when we serialize type summaries.
                // See serializeSummaries for details.
                ngModuleSymbols.add(summary.type.reference);
                var /** @type {?} */ modSummary = (summary);
                modSummary.modules.forEach(function (mod) { ngModuleSymbols.add(mod.reference); });
            }
            if (!isLibrary) {
                var /** @type {?} */ fnName = summaryForJitName(summary.type.reference.name);
                createSummaryForJitFunction(_this.outputCtx, summary.type.reference, _this.serializeSummaryWithDeps(summary, /** @type {?} */ ((metadata))));
            }
        });
        exportAs.forEach(function (entry) {
            var /** @type {?} */ symbol = entry.symbol;
            if (ngModuleSymbols.has(symbol)) {
                var /** @type {?} */ jitExportAsName = summaryForJitName(entry.exportAs);
                _this.outputCtx.statements.push(o.variable(jitExportAsName).set(_this.serializeSummaryRef(symbol)).toDeclStmt(null, [
                    o.StmtModifier.Exported
                ]));
            }
        });
    };
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    ForJitSerializer.prototype.serializeSummaryWithDeps = function (summary, metadata) {
        var _this = this;
        var /** @type {?} */ expressions = [this.serializeSummary(summary)];
        var /** @type {?} */ providers = [];
        if (metadata instanceof CompileNgModuleMetadata) {
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
        else if (summary.summaryKind === CompileSummaryKind.Directive) {
            var /** @type {?} */ dirSummary = (summary);
            providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        // Note: We can't just refer to the `ngsummary.ts` files for `useClass` providers (as we do for
        // declaredDirectives / declaredPipes), as we allow
        // providers without ctor arguments to skip the `@Injectable` decorator,
        // i.e. we didn't generate .ngsummary.ts files for these.
        expressions.push.apply(expressions, providers.filter(function (provider) { return !!provider.useClass; }).map(function (provider) { return _this.serializeSummary(/** @type {?} */ ({
            summaryKind: CompileSummaryKind.Injectable, type: provider.useClass
        })); }));
        return o.literalArr(expressions);
    };
    /**
     * @param {?} typeSymbol
     * @return {?}
     */
    ForJitSerializer.prototype.serializeSummaryRef = function (typeSymbol) {
        var /** @type {?} */ jitImportedSymbol = this.symbolResolver.getStaticSymbol(summaryForJitFileName(typeSymbol.filePath), summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    ForJitSerializer.prototype.serializeSummary = function (data) {
        var /** @type {?} */ outputCtx = this.outputCtx;
        var Transformer = (function () {
            function Transformer() {
            }
            /**
             * @param {?} arr
             * @param {?} context
             * @return {?}
             */
            Transformer.prototype.visitArray = function (arr, context) {
                var _this = this;
                return o.literalArr(arr.map(function (entry) { return visitValue(entry, _this, context); }));
            };
            /**
             * @param {?} map
             * @param {?} context
             * @return {?}
             */
            Transformer.prototype.visitStringMap = function (map, context) {
                var _this = this;
                return new o.LiteralMapExpr(Object.keys(map).map(function (key) { return new o.LiteralMapEntry(key, visitValue(map[key], _this, context), false); }));
            };
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            Transformer.prototype.visitPrimitive = function (value, context) { return o.literal(value); };
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            Transformer.prototype.visitOther = function (value, context) {
                if (value instanceof StaticSymbol) {
                    return outputCtx.importExpr(value);
                }
                else {
                    throw new Error("Illegal State: Encountered value " + value);
                }
            };
            return Transformer;
        }());
        return visitValue(data, new Transformer(), null);
    };
    return ForJitSerializer;
}());
function ForJitSerializer_tsickle_Closure_declarations() {
    /** @type {?} */
    ForJitSerializer.prototype.data;
    /** @type {?} */
    ForJitSerializer.prototype.outputCtx;
    /** @type {?} */
    ForJitSerializer.prototype.symbolResolver;
}
var FromJsonDeserializer = (function (_super) {
    tslib_1.__extends(FromJsonDeserializer, _super);
    /**
     * @param {?} symbolCache
     */
    function FromJsonDeserializer(symbolCache) {
        var _this = _super.call(this) || this;
        _this.symbolCache = symbolCache;
        return _this;
    }
    /**
     * @param {?} json
     * @return {?}
     */
    FromJsonDeserializer.prototype.deserialize = function (json) {
        var _this = this;
        var /** @type {?} */ data = JSON.parse(json);
        var /** @type {?} */ importAs = [];
        this.symbols = [];
        data.symbols.forEach(function (serializedSymbol) {
            var /** @type {?} */ symbol = _this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
            _this.symbols.push(symbol);
            if (serializedSymbol.importAs) {
                importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
            }
        });
        var /** @type {?} */ summaries = visitValue(data.summaries, this, null);
        return { summaries: summaries, importAs: importAs };
    };
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    FromJsonDeserializer.prototype.visitStringMap = function (map, context) {
        if ('__symbol' in map) {
            var /** @type {?} */ baseSymbol = this.symbols[map['__symbol']];
            var /** @type {?} */ members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return _super.prototype.visitStringMap.call(this, map, context);
        }
    };
    return FromJsonDeserializer;
}(ValueTransformer));
function FromJsonDeserializer_tsickle_Closure_declarations() {
    /** @type {?} */
    FromJsonDeserializer.prototype.symbols;
    /** @type {?} */
    FromJsonDeserializer.prototype.symbolCache;
}
//# sourceMappingURL=summary_serializer.js.map