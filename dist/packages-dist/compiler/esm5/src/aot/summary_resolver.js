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
var AotSummaryResolver = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     */
    function AotSummaryResolver(host, staticSymbolCache) {
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
    AotSummaryResolver.prototype.isLibraryFile = function (filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(stripGeneratedFileSuffix(filePath));
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.getLibraryFileName = function (filePath) { return this.host.getOutputFileName(filePath); };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        var /** @type {?} */ summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = ((this.summaryCache.get(staticSymbol)));
        }
        return summary;
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    AotSummaryResolver.prototype.getImportAs = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        return ((this.importAs.get(staticSymbol)));
    };
    /**
     * @param {?} summary
     * @return {?}
     */
    AotSummaryResolver.prototype.addSummary = function (summary) { this.summaryCache.set(summary.symbol, summary); };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
        var _this = this;
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (this.isLibraryFile(filePath)) {
            var /** @type {?} */ summaryFilePath = summaryFileName(filePath);
            var /** @type {?} */ json = void 0;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error("Error loading summary file " + summaryFilePath);
                throw e;
            }
            if (json) {
                var _a = deserializeSummaries(this.staticSymbolCache, json), summaries = _a.summaries, importAs = _a.importAs;
                summaries.forEach(function (summary) { return _this.summaryCache.set(summary.symbol, summary); });
                importAs.forEach(function (importAs) {
                    _this.importAs.set(importAs.symbol, _this.staticSymbolCache.get(ngfactoryFilePath(filePath), importAs.importAs));
                });
            }
        }
    };
    return AotSummaryResolver;
}());
export { AotSummaryResolver };
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