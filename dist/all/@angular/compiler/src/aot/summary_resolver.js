"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var summary_serializer_1 = require("./summary_serializer");
var util_1 = require("./util");
var AotSummaryResolver = (function () {
    function AotSummaryResolver(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        // Note: this will only contain StaticSymbols without members!
        this.summaryCache = new Map();
        this.loadedFilePaths = new Set();
        // Note: this will only contain StaticSymbols without members!
        this.importAs = new Map();
    }
    AotSummaryResolver.prototype.isLibraryFile = function (filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(util_1.stripGeneratedFileSuffix(filePath));
    };
    AotSummaryResolver.prototype.getLibraryFileName = function (filePath) { return this.host.getOutputFileName(filePath); };
    AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        var summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = this.summaryCache.get(staticSymbol);
        }
        return summary;
    };
    AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
    };
    AotSummaryResolver.prototype.getImportAs = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        return this.importAs.get(staticSymbol);
    };
    AotSummaryResolver.prototype.addSummary = function (summary) { this.summaryCache.set(summary.symbol, summary); };
    AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
        var _this = this;
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (this.isLibraryFile(filePath)) {
            var summaryFilePath = util_1.summaryFileName(filePath);
            var json = void 0;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error("Error loading summary file " + summaryFilePath);
                throw e;
            }
            if (json) {
                var _a = summary_serializer_1.deserializeSummaries(this.staticSymbolCache, json), summaries = _a.summaries, importAs = _a.importAs;
                summaries.forEach(function (summary) { return _this.summaryCache.set(summary.symbol, summary); });
                importAs.forEach(function (importAs) {
                    _this.importAs.set(importAs.symbol, _this.staticSymbolCache.get(util_1.ngfactoryFilePath(filePath), importAs.importAs));
                });
            }
        }
    };
    return AotSummaryResolver;
}());
exports.AotSummaryResolver = AotSummaryResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3Qvc3VtbWFyeV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILDJEQUEwRDtBQUMxRCwrQkFBb0Y7QUFvQnBGO0lBT0UsNEJBQW9CLElBQTRCLEVBQVUsaUJBQW9DO1FBQTFFLFNBQUksR0FBSixJQUFJLENBQXdCO1FBQVUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQU45Riw4REFBOEQ7UUFDdEQsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBdUMsQ0FBQztRQUM5RCxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDNUMsOERBQThEO1FBQ3RELGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztJQUV3QyxDQUFDO0lBRWxHLDBDQUFhLEdBQWIsVUFBYyxRQUFnQjtRQUM1QixvREFBb0Q7UUFDcEQsZ0RBQWdEO1FBQ2hELDBEQUEwRDtRQUMxRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQywrQkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCwrQ0FBa0IsR0FBbEIsVUFBbUIsUUFBZ0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsMkNBQWMsR0FBZCxVQUFlLFlBQTBCO1FBQ3ZDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsZ0JBQWdC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