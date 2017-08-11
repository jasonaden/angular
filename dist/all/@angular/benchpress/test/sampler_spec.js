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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../index");
function main() {
    var EMPTY_EXECUTE = function () { };
    testing_internal_1.describe('sampler', function () {
        var sampler;
        function createSampler(_a) {
            var _b = _a === void 0 ? {} : _a, driver = _b.driver, metric = _b.metric, reporter = _b.reporter, validator = _b.validator, prepare = _b.prepare, execute = _b.execute;
            var time = 1000;
            if (!metric) {
                metric = new MockMetric([]);
            }
            if (!reporter) {
                reporter = new MockReporter([]);
            }
            if (driver == null) {
                driver = new MockDriverAdapter([]);
            }
            var providers = [
                index_1.Options.DEFAULT_PROVIDERS, index_1.Sampler.PROVIDERS, { provide: index_1.Metric, useValue: metric },
                { provide: index_1.Reporter, useValue: reporter }, { provide: index_1.WebDriverAdapter, useValue: driver },
                { provide: index_1.Options.EXECUTE, useValue: execute }, { provide: index_1.Validator, useValue: validator },
                { provide: index_1.Options.NOW, useValue: function () { return new Date(time++); } }
            ];
            if (prepare != null) {
                providers.push({ provide: index_1.Options.PREPARE, useValue: prepare });
            }
            sampler = index_1.Injector.create(providers).get(index_1.Sampler);
        }
        testing_internal_1.it('should call the prepare and execute callbacks using WebDriverAdapter.waitFor', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            var count = 0;
            var driver = new MockDriverAdapter([], function (callback) {
                var result = callback();
                log.push(result);
                return Promise.resolve(result);
            });
            createSampler({
                driver: driver,
                validator: createCountingValidator(2),
                prepare: function () { return count++; },
                execute: function () { return count++; },
            });
            sampler.sample().then(function (_) {
                testing_internal_1.expect(count).toBe(4);
                testing_internal_1.expect(log).toEqual([0, 1, 2, 3]);
                async.done();
            });
        }));
        testing_internal_1.it('should call prepare, beginMeasure, execute, endMeasure for every iteration', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var workCount = 0;
            var log = [];
            createSampler({
                metric: createCountingMetric(log),
                validator: createCountingValidator(2),
                prepare: function () { log.push("p" + workCount++); },
                execute: function () { log.push("w" + workCount++); }
            });
            sampler.sample().then(function (_) {
                testing_internal_1.expect(log).toEqual([
                    'p0',
                    ['beginMeasure'],
                    'w1',
                    ['endMeasure', false, { 'script': 0 }],
                    'p2',
                    ['beginMeasure'],
                    'w3',
                    ['endMeasure', false, { 'script': 1 }],
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should call execute, endMeasure for every iteration if there is no prepare callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            var workCount = 0;
            createSampler({
                metric: createCountingMetric(log),
                validator: createCountingValidator(2),
                execute: function () { log.push("w" + workCount++); },
                prepare: null
            });
            sampler.sample().then(function (_) {
                testing_internal_1.expect(log).toEqual([
                    ['beginMeasure'],
                    'w0',
                    ['endMeasure', true, { 'script': 0 }],
                    'w1',
                    ['endMeasure', true, { 'script': 1 }],
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should only collect metrics for execute and ignore metrics from prepare', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var scriptTime = 0;
            var iterationCount = 1;
            createSampler({
                validator: createCountingValidator(2),
                metric: new MockMetric([], function () {
                    var result = Promise.resolve({ 'script': scriptTime });
                    scriptTime = 0;
                    return result;
                }),
                prepare: function () { scriptTime = 1 * iterationCount; },
                execute: function () {
                    scriptTime = 10 * iterationCount;
                    iterationCount++;
                }
            });
            sampler.sample().then(function (state) {
                testing_internal_1.expect(state.completeSample.length).toBe(2);
                testing_internal_1.expect(state.completeSample[0]).toEqual(mv(0, 1000, { 'script': 10 }));
                testing_internal_1.expect(state.completeSample[1]).toEqual(mv(1, 1001, { 'script': 20 }));
                async.done();
            });
        }));
        testing_internal_1.it('should call the validator for every execution and store the valid sample', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            var validSample = [mv(null, null, {})];
            createSampler({
                metric: createCountingMetric(),
                validator: createCountingValidator(2, validSample, log),
                execute: EMPTY_EXECUTE
            });
            sampler.sample().then(function (state) {
                testing_internal_1.expect(state.validSample).toBe(validSample);
                // TODO(tbosch): Why does this fail??
                // expect(log).toEqual([
                //   ['validate', [{'script': 0}], null],
                //   ['validate', [{'script': 0}, {'script': 1}], validSample]
                // ]);
                testing_internal_1.expect(log.length).toBe(2);
                testing_internal_1.expect(log[0]).toEqual(['validate', [mv(0, 1000, { 'script': 0 })], null]);
                testing_internal_1.expect(log[1]).toEqual(['validate', [mv(0, 1000, { 'script': 0 }), mv(1, 1001, { 'script': 1 })], validSample]);
                async.done();
            });
        }));
        testing_internal_1.it('should report the metric values', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            var validSample = [mv(null, null, {})];
            createSampler({
                validator: createCountingValidator(2, validSample),
                metric: createCountingMetric(),
                reporter: new MockReporter(log),
                execute: EMPTY_EXECUTE
            });
            sampler.sample().then(function (_) {
                // TODO(tbosch): Why does this fail??
                // expect(log).toEqual([
                //   ['reportMeasureValues', 0, {'script': 0}],
                //   ['reportMeasureValues', 1, {'script': 1}],
                //   ['reportSample', [{'script': 0}, {'script': 1}], validSample]
                // ]);
                testing_internal_1.expect(log.length).toBe(3);
                testing_internal_1.expect(log[0]).toEqual(['reportMeasureValues', mv(0, 1000, { 'script': 0 })]);
                testing_internal_1.expect(log[1]).toEqual(['reportMeasureValues', mv(1, 1001, { 'script': 1 })]);
                testing_internal_1.expect(log[2]).toEqual([
                    'reportSample', [mv(0, 1000, { 'script': 0 }), mv(1, 1001, { 'script': 1 })], validSample
                ]);
                async.done();
            });
        }));
    });
}
exports.main = main;
function mv(runIndex, time, values) {
    return new index_1.MeasureValues(runIndex, new Date(time), values);
}
function createCountingValidator(count, validSample, log) {
    if (log === void 0) { log = []; }
    return new MockValidator(log, function (completeSample) {
        count--;
        if (count === 0) {
            return validSample || completeSample;
        }
        else {
            return null;
        }
    });
}
function createCountingMetric(log) {
    if (log === void 0) { log = []; }
    var scriptTime = 0;
    return new MockMetric(log, function () { return ({ 'script': scriptTime++ }); });
}
var MockDriverAdapter = (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter(_log, _waitFor) {
        if (_log === void 0) { _log = []; }
        if (_waitFor === void 0) { _waitFor = null; }
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._waitFor = _waitFor;
        return _this;
    }
    MockDriverAdapter.prototype.waitFor = function (callback) {
        if (this._waitFor != null) {
            return this._waitFor(callback);
        }
        else {
            return Promise.resolve(callback());
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
var MockValidator = (function (_super) {
    __extends(MockValidator, _super);
    function MockValidator(_log, _validate) {
        if (_log === void 0) { _log = []; }
        if (_validate === void 0) { _validate = null; }
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._validate = _validate;
        return _this;
    }
    MockValidator.prototype.validate = function (completeSample) {
        var stableSample = this._validate != null ? this._validate(completeSample) : completeSample;
        this._log.push(['validate', completeSample, stableSample]);
        return stableSample;
    };
    return MockValidator;
}(index_1.Validator));
var MockMetric = (function (_super) {
    __extends(MockMetric, _super);
    function MockMetric(_log, _endMeasure) {
        if (_log === void 0) { _log = []; }
        if (_endMeasure === void 0) { _endMeasure = null; }
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._endMeasure = _endMeasure;
        return _this;
    }
    MockMetric.prototype.beginMeasure = function () {
        this._log.push(['beginMeasure']);
        return Promise.resolve(null);
    };
    MockMetric.prototype.endMeasure = function (restart) {
        var measureValues = this._endMeasure != null ? this._endMeasure() : {};
        this._log.push(['endMeasure', restart, measureValues]);
        return Promise.resolve(measureValues);
    };
    return MockMetric;
}(index_1.Metric));
var MockReporter = (function (_super) {
    __extends(MockReporter, _super);
    function MockReporter(_log) {
        if (_log === void 0) { _log = []; }
        var _this = _super.call(this) || this;
        _this._log = _log;
        return _this;
    }
    MockReporter.prototype.reportMeasureValues = function (values) {
        this._log.push(['reportMeasureValues', values]);
        return Promise.resolve(null);
    };
    MockReporter.prototype.reportSample = function (completeSample, validSample) {
        this._log.push(['reportSample', completeSample, validSample]);
        return Promise.resolve(null);
    };
    return MockReporter;
}(index_1.Reporter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy90ZXN0L3NhbXBsZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrRUFBNEc7QUFFNUcsa0NBQWtIO0FBRWxIO0lBQ0UsSUFBTSxhQUFhLEdBQUcsY0FBTyxDQUFDLENBQUM7SUFFL0IsMkJBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsSUFBSSxPQUFnQixDQUFDO1FBRXJCLHVCQUF1QixFQU9qQjtnQkFQaUIsNEJBT2pCLEVBUGtCLGtCQUFNLEVBQUUsa0JBQU0sRUFBRSxzQkFBUSxFQUFFLHdCQUFTLEVBQUUsb0JBQU8sRUFBRSxvQkFBTztZQVEzRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sR0FBRyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxJQUFNLFNBQVMsR0FBRztnQkFDaEIsZUFBTyxDQUFDLGlCQUFpQixFQUFFLGVBQU8sQ0FBQyxTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7Z0JBQ2pGLEVBQUMsT0FBTyxFQUFFLGdCQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFB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