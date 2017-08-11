/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { CompilerInjectable } from './injectable';
/**
 * @record
 */
export function Summary() { }
function Summary_tsickle_Closure_declarations() {
    /** @type {?} */
    Summary.prototype.symbol;
    /** @type {?} */
    Summary.prototype.metadata;
    /** @type {?|undefined} */
    Summary.prototype.type;
}
/**
 * @abstract
 */
export class SummaryResolver {
}
function SummaryResolver_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} fileName
     * @return {?}
     */
    SummaryResolver.prototype.isLibraryFile = function (fileName) { };
    /**
     * @abstract
     * @param {?} fileName
     * @return {?}
     */
    SummaryResolver.prototype.getLibraryFileName = function (fileName) { };
    /**
     * @abstract
     * @param {?} reference
     * @return {?}
     */
    SummaryResolver.prototype.resolveSummary = function (reference) { };
    /**
     * @abstract
     * @param {?} filePath
     * @return {?}
     */
    SummaryResolver.prototype.getSymbolsOf = function (filePath) { };
    /**
     * @abstract
     * @param {?} reference
     * @return {?}
     */
    SummaryResolver.prototype.getImportAs = function (reference) { };
    /**
     * @abstract
     * @param {?} summary
     * @return {?}
     */
    SummaryResolver.prototype.addSummary = function (summary) { };
}
export class JitSummaryResolver {
    constructor() {
        this._summaries = new Map();
    }
    /**
     * @param {?} fileName
     * @return {?}
     */
    isLibraryFile(fileName) { return false; }
    ;
    /**
     * @param {?} fileName
     * @return {?}
     */
    getLibraryFileName(fileName) { return null; }
    /**
     * @param {?} reference
     * @return {?}
     */
    resolveSummary(reference) {
        return this._summaries.get(reference) || null;
    }
    ;
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) { return []; }
    /**
     * @param {?} reference
     * @return {?}
     */
    getImportAs(reference) { return reference; }
    /**
     * @param {?} summary
     * @return {?}
     */
    addSummary(summary) { this._summaries.set(summary.symbol, summary); }
    ;
}
JitSummaryResolver.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
JitSummaryResolver.ctorParameters = () => [];
function JitSummaryResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    JitSummaryResolver.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    JitSummaryResolver.ctorParameters;
    /** @type {?} */
    JitSummaryResolver.prototype._summaries;
}
//# sourceMappingURL=summary_resolver.js.map