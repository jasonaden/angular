"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var reporter_1 = require("../reporter");
var sample_description_1 = require("../sample_description");
var util_1 = require("./util");
/**
 * A reporter for the console
 */
var ConsoleReporter = ConsoleReporter_1 = (function (_super) {
    __extends(ConsoleReporter, _super);
    function ConsoleReporter(_columnWidth, sampleDescription, _print) {
        var _this = _super.call(this) || this;
        _this._columnWidth = _columnWidth;
        _this._print = _print;
        _this._metricNames = util_1.sortedProps(sampleDescription.metrics);
        _this._printDescription(sampleDescription);
        return _this;
    }
    ConsoleReporter._lpad = function (value, columnWidth, fill) {
        if (fill === void 0) { fill = ' '; }
        var result = '';
        for (var i = 0; i < columnWidth - value.length; i++) {
            result += fill;
        }
        return result + value;
    };
    ConsoleReporter.prototype._printDescription = function (sampleDescription) {
        var _this = this;
        this._print("BENCHMARK " + sampleDescription.id);
        this._print('Description:');
        var props = util_1.sortedProps(sampleDescription.description);
        props.forEach(function (prop) { _this._print("- " + prop + ": " + sampleDescription.description[prop]); });
        this._print('Metrics:');
        this._metricNames.forEach(function (metricName) {
            _this._print("- " + metricName + ": " + sampleDescription.metrics[metricName]);
        });
        this._print('');
        this._printStringRow(this._metricNames);
        this._printStringRow(this._metricNames.map(function (_) { return ''; }), '-');
    };
    ConsoleReporter.prototype.reportMeasureValues = function (measureValues) {
        var formattedValues = this._metricNames.map(function (metricName) {
            var value = measureValues.values[metricName];
            return util_1.formatNum(value);
        });
        this._printStringRow(formattedValues);
        return Promise.resolve(null);
    };
    ConsoleReporter.prototype.reportSample = function (completeSample, validSamples) {
        this._printStringRow(this._metricNames.map(function (_) { return ''; }), '=');
        this._printStringRow(this._metricNames.map(function (metricName) { return util_1.formatStats(validSamples, metricName); }));
        return Promise.resolve(null);
    };
    ConsoleReporter.prototype._printStringRow = function (parts, fill) {
        var _this = this;
        if (fill === void 0) { fill = ' '; }
        this._print(parts.map(function (part) { return ConsoleReporter_1._lpad(part, _this._columnWidth, fill); }).join(' | '));
    };
    return ConsoleReporter;
}(reporter_1.Reporter));
ConsoleReporter.PRINT = new core_1.InjectionToken('ConsoleReporter.print');
ConsoleReporter.COLUMN_WIDTH = new core_1.InjectionToken('ConsoleReporter.columnWidth');
ConsoleReporter.PROVIDERS = [
    {
        provide: ConsoleReporter_1,
        deps: [ConsoleReporter_1.COLUMN_WIDTH, sample_description_1.SampleDescription, ConsoleReporter_1.PRINT]
    },
    { provide: ConsoleReporter_1.COLUMN_WIDTH, useValue: 18 }, {
        provide: ConsoleReporter_1.PRINT,
        useValue: function (v) {
            // tslint:disable-next-line:no-console
            console.log(v);
        }
    }
];
ConsoleReporter = ConsoleReporter_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(ConsoleReporter_1.COLUMN_WIDTH)),
    __param(2, core_1.Inject(ConsoleReporter_1.PRINT)),
    __metadata("design:paramtypes", [Number, sample_description_1.SampleDescription,
        Function])
], ConsoleReporter);
exports.ConsoleReporter = ConsoleReporter;
var ConsoleReporter_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3JlcG9ydGVyL2NvbnNvbGVfcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLHdDQUFxQztBQUNyQyw0REFBd0Q7QUFFeEQsK0JBQTJEO0FBRzNEOztHQUVHO0FBRUgsSUFBYSxlQUFlO0lBQVMsbUNBQVE7SUEyQjNDLHlCQUNrRCxZQUFvQixFQUNsRSxpQkFBb0MsRUFDRyxNQUFnQjtRQUgzRCxZQUlFLGlCQUFPLFNBR1I7UUFOaUQsa0JBQVksR0FBWixZQUFZLENBQVE7UUFFM0IsWUFBTSxHQUFOLE1BQU0sQ0FBVTtRQUV6RCxLQUFJLENBQUMsWUFBWSxHQUFHLGtCQUFXLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBQzVDLENBQUM7SUFqQmMscUJBQUssR0FBcEIsVUFBcUIsS0FBYSxFQUFFLFdBQW1CLEVBQUUsSUFBVTtRQUFWLHFCQUFBLEVBQUEsVUFBVTtRQUNqRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BELE1BQU0sSUFBSSxJQUFJLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFhTywyQ0FBaUIsR0FBekIsVUFBMEIsaUJBQW9DO1FBQTlELGlCQVlDO1FBWEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFhLGlC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