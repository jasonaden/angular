"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var GENERATED_FILE = /\.ngfactory\.|\.ngsummary\./;
var GENERATED_MODULE = /\.ngfactory$|\.ngsummary$/;
var JIT_SUMMARY_FILE = /\.ngsummary\./;
var JIT_SUMMARY_NAME = /NgSummary$/;
function ngfactoryFilePath(filePath, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    var urlWithSuffix = splitTypescriptSuffix(filePath, forceSourceFile);
    return urlWithSuffix[0] + ".ngfactory" + urlWithSuffix[1];
}
exports.ngfactoryFilePath = ngfactoryFilePath;
function stripGeneratedFileSuffix(filePath) {
    return filePath.replace(GENERATED_FILE, '.');
}
exports.stripGeneratedFileSuffix = stripGeneratedFileSuffix;
function isGeneratedFile(filePath) {
    return GENERATED_FILE.test(filePath);
}
exports.isGeneratedFile = isGeneratedFile;
function splitTypescriptSuffix(path, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), forceSourceFile ? '.ts' : '.d.ts'];
    }
    var lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
exports.splitTypescriptSuffix = splitTypescriptSuffix;
function summaryFileName(fileName) {
    var fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return fileNameWithoutSuffix + ".ngsummary.json";
}
exports.summaryFileName = summaryFileName;
function summaryForJitFileName(fileName, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    var urlWithSuffix = splitTypescriptSuffix(stripGeneratedFileSuffix(fileName), forceSourceFile);
    return urlWithSuffix[0] + ".ngsummary" + urlWithSuffix[1];
}
exports.summaryForJitFileName = summaryForJitFileName;
function stripSummaryForJitFileSuffix(filePath) {
    return filePath.replace(JIT_SUMMARY_FILE, '.');
}
exports.stripSummaryForJitFileSuffix = stripSummaryForJitFileSuffix;
function summaryForJitName(symbolName) {
    return symbolName + "NgSummary";
}
exports.summaryForJitName = summaryForJitName;
function stripSummaryForJitNameSuffix(symbolName) {
    return symbolName.replace(JIT_SUMMARY_NAME, '');
}
exports.stripSummaryForJitNameSuffix = stripSummaryForJitNameSuffix;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sdUJBQXVCLEdBQUcsa0NBQWtDLENBQUM7QUFDbkUsSUFBTSxjQUFjLEdBQUcsNkJBQTZCLENBQUM7QUFDckQsSUFBTSxnQkFBZ0IsR0FBRywyQkFBMkIsQ0FBQztBQUNyRCxJQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztBQUN6QyxJQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQztBQUV0QywyQkFBa0MsUUFBZ0IsRUFBRSxlQUF1QjtJQUF2QixnQ0FBQSxFQUFBLHVCQUF1QjtJQUN6RSxJQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkUsTUFBTSxDQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsa0JBQWEsYUFBYSxDQUFDLENBQUMsQ0FBRyxDQUFDO0FBQzVELENBQUM7QUFIRCw4Q0FHQztBQUVELGtDQUF5QyxRQUFnQjtJQUN2RCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDREQUVDO0FBRUQseUJBQWdDLFFBQWdCO0lBQzlDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCwwQ0FFQztBQUVELCtCQUFzQyxJQUFZLEVBQUUsZUFBdUI7SUFBdkIsZ0NBQUEsRUFBQSx1QkFBdUI7SUFDekUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXRDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQVpELHNEQVlDO0FBRUQseUJBQWdDLFFBQWdCO0lBQzlDLElBQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RSxNQUFNLENBQUkscUJBQXFCLG9CQUFpQixDQUFDO0FBQ25ELENBQUM7QUFIRCwwQ0FHQztBQUVELCtCQUFzQyxRQUFnQixFQUFFLGVBQXVCO0lBQXZCLGdDQUFBLEVBQUEsdUJBQXVCO0lBQzdFLElBQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2pHLE1BQU0sQ0FBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLGtCQUFhLGFBQWEsQ0FBQyxDQUFDLENBQUcsQ0FBQztBQUM1RCxDQUFDO0FBSEQsc0RBR0M7QUFFRCxzQ0FBNkMsUUFBZ0I7SUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELG9FQUVDO0FBRUQsMkJBQWtDLFVBQWtCO0lBQ2xELE1BQU0sQ0FBSSxVQUFVLGNBQVcsQ0FBQztBQUNsQyxDQUFDO0FBRkQsOENBRUM7QUFFRCxzQ0FBNkMsVUFBa0I7SUFDN0QsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUZELG9FQUVDIn0=