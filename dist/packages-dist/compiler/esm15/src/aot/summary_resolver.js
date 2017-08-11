/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { deserializeSummaries } from './summary_serializer';
import { ngfactoryFilePath, stripGeneratedFileSuffix, summaryFileName } from './util';
/**
 * @record
 */
export function AotSummaryResolverHost() { }
function AotSummaryResolverHost_tsickle_Closure_declarations() {
    /**
     * Loads an NgModule/Directive/Pipe summary file
     * @type {?}
     */
    AotSummaryResolverHost.prototype.loadSummary;
    /**
     * Returns whether a file is a source file or not.
     * @type {?}
     */
    AotSummaryResolverHost.prototype.isSourceFile;
    /**
     * Returns the output file path of a source file.
     * E.g.
     * `some_file.ts` -> `some_file.d.ts`
     * @type {?}
     */
    AotSummaryResolverHost.prototype.getOutputFileName;
}
export class AotSummaryResolver {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     */
    constructor(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryCache = new Map();
        this.loadedFilePaths = new Set();
        this.importAs = new Map();
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    isLibraryFile(filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(stripGeneratedFileSuffix(filePath));
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getLibraryFileName(filePath) { return this.host.getOutputFileName(filePath); }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    resolveSummary(staticSymbol) {
        staticSymbol.assertNoMembers();
        let /** @type {?} */ summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = ((this.summaryCache.get(staticSymbol)));
        }
        return summary;
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter((symbol) => symbol.filePath === filePath);
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    getImportAs(staticSymbol) {
        staticSymbol.assertNoMembers();
        return ((this.importAs.get(staticSymbol)));
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addSummary(summary) { this.summaryCache.set(summary.symbol, summary); }
    /**
     * @param {?} filePath
     * @return {?}
     */
    _loadSummaryFile(filePath) {
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (this.isLibraryFile(filePath)) {
            const /** @type {?} */ summaryFilePath = summaryFileName(filePath);
            let /** @type {?} */ json;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error(`Error loading summary file ${summaryFilePath}`);
                throw e;
            }
            if (json) {
                const { summaries, importAs } = deserializeSummaries(this.staticSymbolCache, json);
                summaries.forEach((summary) => this.summaryCache.set(summary.symbol, summary));
                importAs.forEach((importAs) => {
                    this.importAs.set(importAs.symbol, this.staticSymbolCache.get(ngfactoryFilePath(filePath), importAs.importAs));
                });
            }
        }
    }
}
function AotSummaryResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    AotSummaryResolver.prototype.summaryCache;
    /** @type {?} */
    AotSummaryResolver.prototype.loadedFilePaths;
    /** @type {?} */
    AotSummaryResolver.prototype.importAs;
    /** @type {?} */
    AotSummaryResolver.prototype.host;
    /** @type {?} */
    AotSummaryResolver.prototype.staticSymbolCache;
}
//# sourceMappingURL=summary_resolver.js.map