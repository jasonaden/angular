/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
    const /** @type {?} */ toJsonSerializer = new ToJsonSerializer(symbolResolver, summaryResolver);
    const /** @type {?} */ forJitSerializer = new ForJitSerializer(forJitCtx, symbolResolver);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach((resolvedSymbol) => toJsonSerializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }));
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (let /** @type {?} */ processedIndex = 0; processedIndex < toJsonSerializer.symbols.length; processedIndex++) {
        const /** @type {?} */ symbol = toJsonSerializer.symbols[processedIndex];
        if (summaryResolver.isLibraryFile(symbol.filePath)) {
            let /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                const /** @type {?} */ resolvedSymbol = symbolResolver.resolveSymbol(symbol);
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
    types.forEach(({ summary, metadata }) => {
        forJitSerializer.addSourceType(summary, metadata);
        toJsonSerializer.addOrMergeSummary({ symbol: summary.type.reference, metadata: null, type: summary });
        if (summary.summaryKind === CompileSummaryKind.NgModule) {
            const /** @type {?} */ ngModuleSummary = (summary);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach((id) => {
                const /** @type {?} */ symbol = id.reference;
                if (summaryResolver.isLibraryFile(symbol.filePath)) {
                    const /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
                    if (summary) {
                        toJsonSerializer.addOrMergeSummary(summary);
                    }
                }
            });
        }
    });
    const { json, exportAs } = toJsonSerializer.serialize();
    forJitSerializer.serialize(exportAs);
    return { json, exportAs };
}
/**
 * @param {?} symbolCache
 * @param {?} json
 * @return {?}
 */
export function deserializeSummaries(symbolCache, json) {
    const /** @type {?} */ deserializer = new FromJsonDeserializer(symbolCache);
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
    const /** @type {?} */ fnName = summaryForJitName(reference.name);
    outputCtx.statements.push(o.fn([], [new o.ReturnStatement(value)], new o.ArrayType(o.DYNAMIC_TYPE)).toDeclStmt(fnName, [
        o.StmtModifier.Final, o.StmtModifier.Exported
    ]));
}
class ToJsonSerializer extends ValueTransformer {
    /**
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     */
    constructor(symbolResolver, summaryResolver) {
        super();
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        // Note: This only contains symbols without members.
        this.symbols = [];
        this.indexBySymbol = new Map();
        this.processedSummaryBySymbol = new Map();
        this.processedSummaries = [];
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addOrMergeSummary(summary) {
        let /** @type {?} */ symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we keep everything except their class decorators.
            // We need to keep e.g. the ctor args, method names, method decorators
            // so that the class can be extended in another compilation unit.
            // We don't keep the class decorators as
            // 1) they refer to data
            //   that should not cause a rebuild of downstream compilation units
            //   (e.g. inline templates of @Component, or @NgModule.declarations)
            // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
            const /** @type {?} */ clone = {};
            Object.keys(symbolMeta).forEach((propName) => {
                if (propName !== 'decorators') {
                    clone[propName] = symbolMeta[propName];
                }
            });
            symbolMeta = clone;
        }
        let /** @type {?} */ processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
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
    }
    /**
     * @return {?}
     */
    serialize() {
        const /** @type {?} */ exportAs = [];
        const /** @type {?} */ json = JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map((symbol, index) => {
                symbol.assertNoMembers();
                let /** @type {?} */ importAs = ((undefined));
                if (this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    importAs = `${symbol.name}_${index}`;
                    exportAs.push({ symbol, exportAs: importAs });
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    // We convert the source filenames tinto output filenames,
                    // as the generated summary file will be used when the current
                    // compilation unit is used as a library
                    filePath: this.summaryResolver.getLibraryFileName(symbol.filePath),
                    importAs: importAs
                };
            })
        });
        return { json, exportAs };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processValue(value) { return visitValue(value, this, null); }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitOther(value, context) {
        if (value instanceof StaticSymbol) {
            const /** @type {?} */ baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            let /** @type {?} */ index = this.indexBySymbol.get(baseSymbol);
            // Note: == on purpose to compare with undefined!
            if (index == null) {
                index = this.indexBySymbol.size;
                this.indexBySymbol.set(baseSymbol, index);
                this.symbols.push(baseSymbol);
            }
            return { __symbol: index, members: value.members };
        }
    }
}
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
class ForJitSerializer {
    /**
     * @param {?} outputCtx
     * @param {?} symbolResolver
     */
    constructor(outputCtx, symbolResolver) {
        this.outputCtx = outputCtx;
        this.symbolResolver = symbolResolver;
        this.data = new Map();
    }
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    addSourceType(summary, metadata) {
        this.data.set(summary.type.reference, { summary, metadata, isLibrary: false });
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addLibType(summary) {
        this.data.set(summary.type.reference, { summary, metadata: null, isLibrary: true });
    }
    /**
     * @param {?} exportAs
     * @return {?}
     */
    serialize(exportAs) {
        const /** @type {?} */ ngModuleSymbols = new Set();
        Array.from(this.data.values()).forEach(({ summary, metadata, isLibrary }) => {
            if (summary.summaryKind === CompileSummaryKind.NgModule) {
                // collect the symbols that refer to NgModule classes.
                // Note: we can't just rely on `summary.type.summaryKind` to determine this as
                // we don't add the summaries of all referenced symbols when we serialize type summaries.
                // See serializeSummaries for details.
                ngModuleSymbols.add(summary.type.reference);
                const /** @type {?} */ modSummary = (summary);
                modSummary.modules.forEach((mod) => { ngModuleSymbols.add(mod.reference); });
            }
            if (!isLibrary) {
                const /** @type {?} */ fnName = summaryForJitName(summary.type.reference.name);
                createSummaryForJitFunction(this.outputCtx, summary.type.reference, this.serializeSummaryWithDeps(summary, /** @type {?} */ ((metadata))));
            }
        });
        exportAs.forEach((entry) => {
            const /** @type {?} */ symbol = entry.symbol;
            if (ngModuleSymbols.has(symbol)) {
                const /** @type {?} */ jitExportAsName = summaryForJitName(entry.exportAs);
                this.outputCtx.statements.push(o.variable(jitExportAsName).set(this.serializeSummaryRef(symbol)).toDeclStmt(null, [
                    o.StmtModifier.Exported
                ]));
            }
        });
    }
    /**
     * @param {?} summary
     * @param {?} metadata
     * @return {?}
     */
    serializeSummaryWithDeps(summary, metadata) {
        const /** @type {?} */ expressions = [this.serializeSummary(summary)];
        let /** @type {?} */ providers = [];
        if (metadata instanceof CompileNgModuleMetadata) {
            expressions.push(...
            // For directives / pipes, we only add the declared ones,
            // and rely on transitively importing NgModules to get the transitive
            // summaries.
            metadata.declaredDirectives.concat(metadata.declaredPipes)
                .map(type => type.reference)
                .concat(metadata.transitiveModule.modules.map(type => type.reference)
                .filter(ref => ref !== metadata.type.reference))
                .map((ref) => this.serializeSummaryRef(ref)));
            // Note: We don't use `NgModuleSummary.providers`, as that one is transitive,
            // and we already have transitive modules.
            providers = metadata.providers;
        }
        else if (summary.summaryKind === CompileSummaryKind.Directive) {
            const /** @type {?} */ dirSummary = (summary);
            providers = dirSummary.providers.concat(dirSummary.viewProviders);
        }
        // Note: We can't just refer to the `ngsummary.ts` files for `useClass` providers (as we do for
        // declaredDirectives / declaredPipes), as we allow
        // providers without ctor arguments to skip the `@Injectable` decorator,
        // i.e. we didn't generate .ngsummary.ts files for these.
        expressions.push(...providers.filter(provider => !!provider.useClass).map(provider => this.serializeSummary(/** @type {?} */ ({
            summaryKind: CompileSummaryKind.Injectable, type: provider.useClass
        }))));
        return o.literalArr(expressions);
    }
    /**
     * @param {?} typeSymbol
     * @return {?}
     */
    serializeSummaryRef(typeSymbol) {
        const /** @type {?} */ jitImportedSymbol = this.symbolResolver.getStaticSymbol(summaryForJitFileName(typeSymbol.filePath), summaryForJitName(typeSymbol.name));
        return this.outputCtx.importExpr(jitImportedSymbol);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    serializeSummary(data) {
        const /** @type {?} */ outputCtx = this.outputCtx;
        class Transformer {
            /**
             * @param {?} arr
             * @param {?} context
             * @return {?}
             */
            visitArray(arr, context) {
                return o.literalArr(arr.map(entry => visitValue(entry, this, context)));
            }
            /**
             * @param {?} map
             * @param {?} context
             * @return {?}
             */
            visitStringMap(map, context) {
                return new o.LiteralMapExpr(Object.keys(map).map((key) => new o.LiteralMapEntry(key, visitValue(map[key], this, context), false)));
            }
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            visitPrimitive(value, context) { return o.literal(value); }
            /**
             * @param {?} value
             * @param {?} context
             * @return {?}
             */
            visitOther(value, context) {
                if (value instanceof StaticSymbol) {
                    return outputCtx.importExpr(value);
                }
                else {
                    throw new Error(`Illegal State: Encountered value ${value}`);
                }
            }
        }
        return visitValue(data, new Transformer(), null);
    }
}
function ForJitSerializer_tsickle_Closure_declarations() {
    /** @type {?} */
    ForJitSerializer.prototype.data;
    /** @type {?} */
    ForJitSerializer.prototype.outputCtx;
    /** @type {?} */
    ForJitSerializer.prototype.symbolResolver;
}
class FromJsonDeserializer extends ValueTransformer {
    /**
     * @param {?} symbolCache
     */
    constructor(symbolCache) {
        super();
        this.symbolCache = symbolCache;
    }
    /**
     * @param {?} json
     * @return {?}
     */
    deserialize(json) {
        const /** @type {?} */ data = JSON.parse(json);
        const /** @type {?} */ importAs = [];
        this.symbols = [];
        data.symbols.forEach((serializedSymbol) => {
            const /** @type {?} */ symbol = this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
            this.symbols.push(symbol);
            if (serializedSymbol.importAs) {
                importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
            }
        });
        const /** @type {?} */ summaries = visitValue(data.summaries, this, null);
        return { summaries, importAs };
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        if ('__symbol' in map) {
            const /** @type {?} */ baseSymbol = this.symbols[map['__symbol']];
            const /** @type {?} */ members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return super.visitStringMap(map, context);
        }
    }
}
function FromJsonDeserializer_tsickle_Closure_declarations() {
    /** @type {?} */
    FromJsonDeserializer.prototype.symbols;
    /** @type {?} */
    FromJsonDeserializer.prototype.symbolCache;
}
//# sourceMappingURL=summary_serializer.js.map