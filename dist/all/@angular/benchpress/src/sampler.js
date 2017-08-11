"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var common_options_1 = require("./common_options");
var measure_values_1 = require("./measure_values");
var metric_1 = require("./metric");
var reporter_1 = require("./reporter");
var validator_1 = require("./validator");
var web_driver_adapter_1 = require("./web_driver_adapter");
/**
 * The Sampler owns the sample loop:
 * 1. calls the prepare/execute callbacks,
 * 2. gets data from the metric
 * 3. asks the validator for a valid sample
 * 4. reports the new data to the reporter
 * 5. loop until there is a valid sample
 */
var Sampler = Sampler_1 = (function () {
    function Sampler(_driver, _metric, _reporter, _validator, _prepare, _execute, _now) {
        this._driver = _driver;
        this._metric = _metric;
        this._reporter = _reporter;
        this._validator = _validator;
        this._prepare = _prepare;
        this._execute = _execute;
        this._now = _now;
    }
    Sampler.prototype.sample = function () {
        var _this = this;
        var loop = function (lastState) {
            return _this._iterate(lastState).then(function (newState) {
                if (newState.validSample != null) {
                    return newState;
                }
                else {
                    return loop(newState);
                }
            });
        };
        return loop(new SampleState([], null));
    };
    Sampler.prototype._iterate = function (lastState) {
        var _this = this;
        var resultPromise;
        if (this._prepare !== common_options_1.Options.NO_PREPARE) {
            resultPromise = this._driver.waitFor(this._prepare);
        }
        else {
            resultPromise = Promise.resolve(null);
        }
        if (this._prepare !== common_options_1.Options.NO_PREPARE || lastState.completeSample.length === 0) {
            resultPromise = resultPromise.then(function (_) { return _this._metric.beginMeasure(); });
        }
        return resultPromise.then(function (_) { return _this._driver.waitFor(_this._execute); })
            .then(function (_) { return _this._metric.endMeasure(_this._prepare === common_options_1.Options.NO_PREPARE); })
            .then(function (measureValues) { return _this._report(lastState, measureValues); });
    };
    Sampler.prototype._report = function (state, metricValues) {
        var _this = this;
        var measureValues = new measure_values_1.MeasureValues(state.completeSample.length, this._now(), metricValues);
        var completeSample = state.completeSample.concat([measureValues]);
        var validSample = this._validator.validate(completeSample);
        var resultPromise = this._reporter.reportMeasureValues(measureValues);
        if (validSample != null) {
            resultPromise =
                resultPromise.then(function (_) { return _this._reporter.reportSample(completeSample, validSample); });
        }
        return resultPromise.then(function (_) { return new SampleState(completeSample, validSample); });
    };
    return Sampler;
}());
Sampler.PROVIDERS = [{
        provide: Sampler_1,
        deps: [
            web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter, validator_1.Validator, common_options_1.Options.PREPARE, common_options_1.Options.EXECUTE, common_options_1.Options.NOW
        ]
    }];
Sampler = Sampler_1 = __decorate([
    core_1.Injectable(),
    __param(4, core_1.Inject(common_options_1.Options.PREPARE)),
    __param(5, core_1.Inject(common_options_1.Options.EXECUTE)),
    __param(6, core_1.Inject(common_options_1.Options.NOW)),
    __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter,
        validator_1.Validator, Function,
        Function,
        Function])
], Sampler);
exports.Sampler = Sampler;
var SampleState = (function () {
    function SampleState(completeSample, validSample) {
        this.completeSample = completeSample;
        this.validSample = validSample;
    }
    return SampleState;
}());
exports.SampleState = SampleState;
var Sampler_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3NhbXBsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUU7QUFFakUsbURBQXlDO0FBQ3pDLG1EQUErQztBQUMvQyxtQ0FBZ0M7QUFDaEMsdUNBQW9DO0FBQ3BDLHlDQUFzQztBQUN0QywyREFBc0Q7QUFHdEQ7Ozs7Ozs7R0FPRztBQUVILElBQWEsT0FBTztJQU9sQixpQkFDWSxPQUF5QixFQUFVLE9BQWUsRUFBVSxTQUFtQixFQUMvRSxVQUFxQixFQUFtQyxRQUFrQixFQUNqRCxRQUFrQixFQUN0QixJQUFjO1FBSG5DLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDL0UsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFtQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2pELGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBVTtJQUFHLENBQUM7SUFFbkQsd0JBQU0sR0FBTjtRQUFBLGlCQVdDO1FBVkMsSUFBTSxJQUFJLEdBQUcsVUFBQyxTQUFzQjtZQUNsQyxNQUFNLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ2xCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxD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