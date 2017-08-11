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
var statistic_1 = require("../statistic");
var validator_1 = require("../validator");
/**
 * A validator that checks the regression slope of a specific metric.
 * Waits for the regression slope to be >=0.
 */
var RegressionSlopeValidator = RegressionSlopeValidator_1 = (function (_super) {
    __extends(RegressionSlopeValidator, _super);
    function RegressionSlopeValidator(_sampleSize, _metric) {
        var _this = _super.call(this) || this;
        _this._sampleSize = _sampleSize;
        _this._metric = _metric;
        return _this;
    }
    RegressionSlopeValidator.prototype.describe = function () {
        return { 'sampleSize': this._sampleSize, 'regressionSlopeMetric': this._metric };
    };
    RegressionSlopeValidator.prototype.validate = function (completeSample) {
        if (completeSample.length >= this._sampleSize) {
            var latestSample = completeSample.slice(completeSample.length - this._sampleSize, completeSample.length);
            var xValues = [];
            var yValues = [];
            for (var i = 0; i < latestSample.length; i++) {
                // For now, we only use the array index as x value.
                // TODO(tbosch): think about whether we should use time here instead
                xValues.push(i);
                yValues.push(latestSample[i].values[this._metric]);
            }
            var regressionSlope = statistic_1.Statistic.calculateRegressionSlope(xValues, statistic_1.Statistic.calculateMean(xValues), yValues, statistic_1.Statistic.calculateMean(yValues));
            return regressionSlope >= 0 ? latestSample : null;
        }
        else {
            return null;
        }
    };
    return RegressionSlopeValidator;
}(validator_1.Validator));
RegressionSlopeValidator.SAMPLE_SIZE = new core_1.InjectionToken('RegressionSlopeValidator.sampleSize');
RegressionSlopeValidator.METRIC = new core_1.InjectionToken('RegressionSlopeValidator.metric');
RegressionSlopeValidator.PROVIDERS = [
    {
        provide: RegressionSlopeValidator_1,
        deps: [RegressionSlopeValidator_1.SAMPLE_SIZE, RegressionSlopeValidator_1.METRIC]
    },
    { provide: RegressionSlopeValidator_1.SAMPLE_SIZE, useValue: 10 },
    { provide: RegressionSlopeValidator_1.METRIC, useValue: 'scriptTime' }
];
RegressionSlopeValidator = RegressionSlopeValidator_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(RegressionSlopeValidator_1.SAMPLE_SIZE)),
    __param(1, core_1.Inject(RegressionSlopeValidator_1.METRIC)),
    __metadata("design:paramtypes", [Number, String])
], RegressionSlopeValidator);
exports.RegressionSlopeValidator = RegressionSlopeValidator;
var RegressionSlopeValidator_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy92YWxpZGF0b3IvcmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBR2pFLDBDQUF1QztBQUN2QywwQ0FBdUM7QUFFdkM7OztHQUdHO0FBRUgsSUFBYSx3QkFBd0I7SUFBUyw0Q0FBUztJQVlyRCxrQ0FDMEQsV0FBbUIsRUFDeEIsT0FBZTtRQUZwRSxZQUdFLGlCQUFPLFNBQ1I7UUFIeUQsaUJBQVcsR0FBWCxXQUFXLENBQVE7UUFDeEIsYUFBTyxHQUFQLE9BQU8sQ0FBUTs7SUFFcEUsQ0FBQztJQUVELDJDQUFRLEdBQVI7UUFDRSxNQUFNLENBQUMsRUFBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELDJDQUFRLEdBQVIsVUFBUyxjQUErQjtRQUN0QyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQU0sWUFBWSxHQUNkLGNBQWMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRixJQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFDN0IsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3QyxtREFBbUQ7Z0JBQ25ELG9FQUFvRTtnQkFDcEUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFDRCxJQUFNLGVBQWUsR0FBRyxxQkFBUyxDQUFDLHdCQUF3QixDQUN0RCxPQUFPLEVBQUUscUJBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDMUYsTUFBTSxDQUFDLGVBQWUsSUFBSSxDQUFDLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDSCwrQkFBQztBQUFELENBQUMsQUF6Q0QsQ0FBOEMscUJBQVMsR0F5Q3REO0FBeENRLG9DQUFXLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDeEUsK0JBQU0sR0FBRyxJQUFJLHFCQUFjLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUMvRCxrQ0FBUyxHQUFHO0lBQ2pCO1FBQ0UsT0FBTyxFQUFFLDBCQUF3QjtRQUNqQyxJQUFJLEVBQUUsQ0FBQywwQkFBd0IsQ0FBQyxXQUFXLEVBQUUsMEJBQXdCLENBQUMsTUFBTSxDQUFDO0tBQzlFO0lBQ0QsRUFBQyxPQUFPLEVBQUUsMEJBQXdCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7SUFDN0QsRUFBQyxPQUFPLEVBQUUsMEJBQXdCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUM7Q0FDbkUsQ0FBQztBQVZTLHdCQUF3QjtJQURwQyxpQkFBVSxFQUFFO0lBY04sV0FBQSxhQUFNLENBQUMsMEJBQXdCLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDNUMsV0FBQSxhQUFNLENBQUMsMEJBQXdCLENBQUMsTUFBTSxDQUFDLENBQUE7O0dBZGpDLHdCQUF3QixDQXlDcEM7QUF6Q1ksNERBQXdCIn0=