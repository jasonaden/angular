"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var injectable_1 = require("./injectable");
var SummaryResolver = (function () {
    function SummaryResolver() {
    }
    return SummaryResolver;
}());
exports.SummaryResolver = SummaryResolver;
var JitSummaryResolver = (function () {
    function JitSummaryResolver() {
        this._summaries = new Map();
    }
    JitSummaryResolver.prototype.isLibraryFile = function (fileName) { return false; };
    ;
    JitSummaryResolver.prototype.getLibraryFileName = function (fileName) { return null; };
    JitSummaryResolver.prototype.resolveSummary = function (reference) {
        return this._summaries.get(reference) || null;
    };
    ;
    JitSummaryResolver.prototype.getSymbolsOf = function (filePath) { return []; };
    JitSummaryResolver.prototype.getImportAs = function (reference) { return reference; };
    JitSummaryResolver.prototype.addSummary = function (summary) { this._summaries.set(summary.symbol, summary); };
    ;
    return JitSummaryResolver;
}());
JitSummaryResolver = __decorate([
    injectable_1.CompilerInjectable()
], JitSummaryResolver);
exports.JitSummaryResolver = JitSummaryResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9zdW1tYXJ5X3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBU0EsMkNBQWdEO0FBUWhEO0lBQUE7SUFPQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBxQiwwQ0FBZTtBQVVyQyxJQUFhLGtCQUFrQjtJQUQvQjtRQUVVLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztJQVVoRSxDQUFDO0lBUkMsMENBQWEsR0FBYixVQUFjLFFBQWdCLElBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFBQSxDQUFDO0lBQzNELCtDQUFrQixHQUFsQixVQUFtQixRQUFnQixJQUFpQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRSwyQ0FBYyxHQUFkLFVBQWUsU0FBb0I7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUNoRCxDQUFDO0lBQUEsQ0FBQztJQUNGLHlDQUFZLEdBQVosVUFBYSxRQUFnQixJQUFpQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRCx3Q0FBVyxHQUFYLFVBQVksU0FBb0IsSUFBZSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNsRSx1Q0FBVSxHQUFWLFVBQVcsT0FBMkIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUFBLENBQUM7SUFDNUYseUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQVhZLGtCQUFrQjtJQUQ5QiwrQkFBa0IsRUFBRTtHQUNSLGtCQUFrQixDQVc5QjtBQVhZLGdEQUFrQiJ9