"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var statistic_1 = require("../statistic");
function formatNum(n) {
    return n.toFixed(2);
}
exports.formatNum = formatNum;
function sortedProps(obj) {
    return Object.keys(obj).sort();
}
exports.sortedProps = sortedProps;
function formatStats(validSamples, metricName) {
    var samples = validSamples.map(function (measureValues) { return measureValues.values[metricName]; });
    var mean = statistic_1.Statistic.calculateMean(samples);
    var cv = statistic_1.Statistic.calculateCoefficientOfVariation(samples, mean);
    var formattedMean = formatNum(mean);
    // Note: Don't use the unicode character for +- as it might cause
    // hickups for consoles...
    return isNaN(cv) ? formattedMean : formattedMean + "+-" + Math.floor(cv) + "%";
}
exports.formatStats = formatStats;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3JlcG9ydGVyL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwwQ0FBdUM7QUFFdkMsbUJBQTBCLENBQVM7SUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUZELDhCQUVDO0FBRUQscUJBQTRCLEdBQXlCO0lBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pDLENBQUM7QUFGRCxrQ0FFQztBQUVELHFCQUE0QixZQUE2QixFQUFFLFVBQWtCO0lBQzNFLElBQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxhQUFhLElBQUksT0FBQSxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7SUFDcEYsSUFBTSxJQUFJLEdBQUcscUJBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBTSxFQUFFLEdBQUcscUJBQVMsQ0FBQywrQkFBK0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEUsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLGlFQUFpRTtJQUNqRSwwQkFBMEI7SUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLEdBQU0sYUFBYSxVQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQUcsQ0FBQztBQUM1RSxDQUFDO0FBUkQsa0NBUUMifQ==