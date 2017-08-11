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
var common_options_1 = require("../common_options");
var metric_1 = require("../metric");
var web_driver_extension_1 = require("../web_driver_extension");
/**
 * A metric that reads out the performance log
 */
var PerflogMetric = PerflogMetric_1 = (function (_super) {
    __extends(PerflogMetric, _super);
    /**
     * @param driverExtension
     * @param setTimeout
     * @param microMetrics Name and description of metrics provided via console.time / console.timeEnd
     **/
    function PerflogMetric(_driverExtension, _setTimeout, _microMetrics, _forceGc, _captureFrames, _receivedData, _requestCount) {
        var _this = _super.call(this) || this;
        _this._driverExtension = _driverExtension;
        _this._setTimeout = _setTimeout;
        _this._microMetrics = _microMetrics;
        _this._forceGc = _forceGc;
        _this._captureFrames = _captureFrames;
        _this._receivedData = _receivedData;
        _this._requestCount = _requestCount;
        _this._remainingEvents = [];
        _this._measureCount = 0;
        _this._perfLogFeatures = _driverExtension.perfLogFeatures();
        if (!_this._perfLogFeatures.userTiming) {
            // User timing is needed for navigationStart.
            _this._receivedData = false;
            _this._requestCount = false;
        }
        return _this;
    }
    PerflogMetric.prototype.describe = function () {
        var res = {
            'scriptTime': 'script execution time in ms, including gc and render',
            'pureScriptTime': 'script execution time in ms, without gc nor render'
        };
        if (this._perfLogFeatures.render) {
            res['renderTime'] = 'render time in ms';
        }
        if (this._perfLogFeatures.gc) {
            res['gcTime'] = 'gc time in ms';
            res['gcAmount'] = 'gc amount in kbytes';
            res['majorGcTime'] = 'time of major gcs in ms';
            if (this._forceGc) {
                res['forcedGcTime'] = 'forced gc time in ms';
                res['forcedGcAmount'] = 'forced gc amount in kbytes';
            }
        }
        if (this._receivedData) {
            res['receivedData'] = 'encoded bytes received since navigationStart';
        }
        if (this._requestCount) {
            res['requestCount'] = 'count of requests sent since navigationStart';
        }
        if (this._captureFrames) {
            if (!this._perfLogFeatures.frameCapture) {
                var warningMsg = 'WARNING: Metric requested, but not supported by driver';
                // using dot syntax for metric name to keep them grouped together in console reporter
                res['frameTime.mean'] = warningMsg;
                res['frameTime.worst'] = warningMsg;
                res['frameTime.best'] = warningMsg;
                res['frameTime.smooth'] = warningMsg;
            }
            else {
                res['frameTime.mean'] = 'mean frame time in ms (target: 16.6ms for 60fps)';
                res['frameTime.worst'] = 'worst frame time in ms';
                res['frameTime.best'] = 'best frame time in ms';
                res['frameTime.smooth'] = 'percentage of frames that hit 60fps';
            }
        }
        for (var name_1 in this._microMetrics) {
            res[name_1] = this._microMetrics[name_1];
        }
        return res;
    };
    PerflogMetric.prototype.beginMeasure = function () {
        var _this = this;
        var resultPromise = Promise.resolve(null);
        if (this._forceGc) {
            resultPromise = resultPromise.then(function (_) { return _this._driverExtension.gc(); });
        }
        return resultPromise.then(function (_) { return _this._beginMeasure(); });
    };
    PerflogMetric.prototype.endMeasure = function (restart) {
        if (this._forceGc) {
            return this._endPlainMeasureAndMeasureForceGc(restart);
        }
        else {
            return this._endMeasure(restart);
        }
    };
    /** @internal */
    PerflogMetric.prototype._endPlainMeasureAndMeasureForceGc = function (restartMeasure) {
        var _this = this;
        return this._endMeasure(true).then(function (measureValues) {
            // disable frame capture for measurements during forced gc
            var originalFrameCaptureValue = _this._captureFrames;
            _this._captureFrames = false;
            return _this._driverExtension.gc()
                .then(function (_) { return _this._endMeasure(restartMeasure); })
                .then(function (forceGcMeasureValues) {
                _this._captureFrames = originalFrameCaptureValue;
                measureValues['forcedGcTime'] = forceGcMeasureValues['gcTime'];
                measureValues['forcedGcAmount'] = forceGcMeasureValues['gcAmount'];
                return measureValues;
            });
        });
    };
    PerflogMetric.prototype._beginMeasure = function () {
        return this._driverExtension.timeBegin(this._markName(this._measureCount++));
    };
    PerflogMetric.prototype._endMeasure = function (restart) {
        var _this = this;
        var markName = this._markName(this._measureCount - 1);
        var nextMarkName = restart ? this._markName(this._measureCount++) : null;
        return this._driverExtension.timeEnd(markName, nextMarkName)
            .then(function (_) { return _this._readUntilEndMark(markName); });
    };
    PerflogMetric.prototype._readUntilEndMark = function (markName, loopCount, startEvent) {
        var _this = this;
        if (loopCount === void 0) { loopCount = 0; }
        if (startEvent === void 0) { startEvent = null; }
        if (loopCount > _MAX_RETRY_COUNT) {
            throw new Error("Tried too often to get the ending mark: " + loopCount);
        }
        return this._driverExtension.readPerfLog().then(function (events) {
            _this._addEvents(events);
            var result = _this._aggregateEvents(_this._remainingEvents, markName);
            if (result) {
                _this._remainingEvents = events;
                return result;
            }
            var resolve;
            var promise = new Promise(function (res) { resolve = res; });
            _this._setTimeout(function () { return resolve(_this._readUntilEndMark(markName, loopCount + 1)); }, 100);
            return promise;
        });
    };
    PerflogMetric.prototype._addEvents = function (events) {
        var _this = this;
        var needSort = false;
        events.forEach(function (event) {
            if (event['ph'] === 'X') {
                needSort = true;
                var startEvent = {};
                var endEvent = {};
                for (var prop in event) {
                    startEvent[prop] = event[prop];
                    endEvent[prop] = event[prop];
                }
                startEvent['ph'] = 'B';
                endEvent['ph'] = 'E';
                endEvent['ts'] = startEvent['ts'] + startEvent['dur'];
                _this._remainingEvents.push(startEvent);
                _this._remainingEvents.push(endEvent);
            }
            else {
                _this._remainingEvents.push(event);
            }
        });
        if (needSort) {
            // Need to sort because of the ph==='X' events
            this._remainingEvents.sort(function (a, b) {
                var diff = a['ts'] - b['ts'];
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
            });
        }
    };
    PerflogMetric.prototype._aggregateEvents = function (events, markName) {
        var _this = this;
        var result = { 'scriptTime': 0, 'pureScriptTime': 0 };
        if (this._perfLogFeatures.gc) {
            result['gcTime'] = 0;
            result['majorGcTime'] = 0;
            result['gcAmount'] = 0;
        }
        if (this._perfLogFeatures.render) {
            result['renderTime'] = 0;
        }
        if (this._captureFrames) {
            result['frameTime.mean'] = 0;
            result['frameTime.best'] = 0;
            result['frameTime.worst'] = 0;
            result['frameTime.smooth'] = 0;
        }
        for (var name_2 in this._microMetrics) {
            result[name_2] = 0;
        }
        if (this._receivedData) {
            result['receivedData'] = 0;
        }
        if (this._requestCount) {
            result['requestCount'] = 0;
        }
        var markStartEvent = null;
        var markEndEvent = null;
        events.forEach(function (event) {
            var ph = event['ph'];
            var name = event['name'];
            if (ph === 'B' && name === markName) {
                markStartEvent = event;
            }
            else if (ph === 'I' && name === 'navigationStart') {
                // if a benchmark measures reload of a page, use the last
                // navigationStart as begin event
                markStartEvent = event;
            }
            else if (ph === 'E' && name === markName) {
                markEndEvent = event;
            }
        });
        if (!markStartEvent || !markEndEvent) {
            // not all events have been received, no further processing for now
            return null;
        }
        var gcTimeInScript = 0;
        var renderTimeInScript = 0;
        var frameTimestamps = [];
        var frameTimes = [];
        var frameCaptureStartEvent = null;
        var frameCaptureEndEvent = null;
        var intervalStarts = {};
        var intervalStartCount = {};
        var inMeasureRange = false;
        events.forEach(function (event) {
            var ph = event['ph'];
            var name = event['name'];
            var microIterations = 1;
            var microIterationsMatch = name.match(_MICRO_ITERATIONS_REGEX);
            if (microIterationsMatch) {
                name = microIterationsMatch[1];
                microIterations = parseInt(microIterationsMatch[2], 10);
            }
            if (event === markStartEvent) {
                inMeasureRange = true;
            }
            else if (event === markEndEvent) {
                inMeasureRange = false;
            }
            if (!inMeasureRange || event['pid'] !== markStartEvent['pid']) {
                return;
            }
            if (_this._requestCount && name === 'sendRequest') {
                result['requestCount'] += 1;
            }
            else if (_this._receivedData && name === 'receivedData' && ph === 'I') {
                result['receivedData'] += event['args']['encodedDataLength'];
            }
            if (ph === 'B' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (frameCaptureStartEvent) {
                    throw new Error('can capture frames only once per benchmark run');
                }
                if (!_this._captureFrames) {
                    throw new Error('found start event for frame capture, but frame capture was not requested in benchpress');
                }
                frameCaptureStartEvent = event;
            }
            else if (ph === 'E' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (!frameCaptureStartEvent) {
                    throw new Error('missing start event for frame capture');
                }
                frameCaptureEndEvent = event;
            }
            if (ph === 'I' && frameCaptureStartEvent && !frameCaptureEndEvent && name === 'frame') {
                frameTimestamps.push(event['ts']);
                if (frameTimestamps.length >= 2) {
                    frameTimes.push(frameTimestamps[frameTimestamps.length - 1] -
                        frameTimestamps[frameTimestamps.length - 2]);
                }
            }
            if (ph === 'B') {
                if (!intervalStarts[name]) {
                    intervalStartCount[name] = 1;
                    intervalStarts[name] = event;
                }
                else {
                    intervalStartCount[name]++;
                }
            }
            else if ((ph === 'E') && intervalStarts[name]) {
                intervalStartCount[name]--;
                if (intervalStartCount[name] === 0) {
                    var startEvent = intervalStarts[name];
                    var duration = (event['ts'] - startEvent['ts']);
                    intervalStarts[name] = null;
                    if (name === 'gc') {
                        result['gcTime'] += duration;
                        var amount = (startEvent['args']['usedHeapSize'] - event['args']['usedHeapSize']) / 1000;
                        result['gcAmount'] += amount;
                        var majorGc = event['args']['majorGc'];
                        if (majorGc && majorGc) {
                            result['majorGcTime'] += duration;
                        }
                        if (intervalStarts['script']) {
                            gcTimeInScript += duration;
                        }
                    }
                    else if (name === 'render') {
                        result['renderTime'] += duration;
                        if (intervalStarts['script']) {
                            renderTimeInScript += duration;
                        }
                    }
                    else if (name === 'script') {
                        result['scriptTime'] += duration;
                    }
                    else if (_this._microMetrics[name]) {
                        result[name] += duration / microIterations;
                    }
                }
            }
        });
        if (frameCaptureStartEvent && !frameCaptureEndEvent) {
            throw new Error('missing end event for frame capture');
        }
        if (this._captureFrames && !frameCaptureStartEvent) {
            throw new Error('frame capture requested in benchpress, but no start event was found');
        }
        if (frameTimes.length > 0) {
            this._addFrameMetrics(result, frameTimes);
        }
        result['pureScriptTime'] = result['scriptTime'] - gcTimeInScript - renderTimeInScript;
        return result;
    };
    PerflogMetric.prototype._addFrameMetrics = function (result, frameTimes) {
        result['frameTime.mean'] = frameTimes.reduce(function (a, b) { return a + b; }, 0) / frameTimes.length;
        var firstFrame = frameTimes[0];
        result['frameTime.worst'] = frameTimes.reduce(function (a, b) { return a > b ? a : b; }, firstFrame);
        result['frameTime.best'] = frameTimes.reduce(function (a, b) { return a < b ? a : b; }, firstFrame);
        result['frameTime.smooth'] =
            frameTimes.filter(function (t) { return t < _FRAME_TIME_SMOOTH_THRESHOLD; }).length / frameTimes.length;
    };
    PerflogMetric.prototype._markName = function (index) { return "" + _MARK_NAME_PREFIX + index; };
    return PerflogMetric;
}(metric_1.Metric));
PerflogMetric.SET_TIMEOUT = new core_1.InjectionToken('PerflogMetric.setTimeout');
PerflogMetric.PROVIDERS = [
    {
        provide: PerflogMetric_1,
        deps: [
            web_driver_extension_1.WebDriverExtension, PerflogMetric_1.SET_TIMEOUT, common_options_1.Options.MICRO_METRICS, common_options_1.Options.FORCE_GC,
            common_options_1.Options.CAPTURE_FRAMES, common_options_1.Options.RECEIVED_DATA, common_options_1.Options.REQUEST_COUNT
        ]
    },
    {
        provide: PerflogMetric_1.SET_TIMEOUT,
        useValue: function (fn, millis) { return setTimeout(fn, millis); }
    }
];
PerflogMetric = PerflogMetric_1 = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(PerflogMetric_1.SET_TIMEOUT)),
    __param(2, core_1.Inject(common_options_1.Options.MICRO_METRICS)),
    __param(3, core_1.Inject(common_options_1.Options.FORCE_GC)),
    __param(4, core_1.Inject(common_options_1.Options.CAPTURE_FRAMES)),
    __param(5, core_1.Inject(common_options_1.Options.RECEIVED_DATA)),
    __param(6, core_1.Inject(common_options_1.Options.REQUEST_COUNT)),
    __metadata("design:paramtypes", [web_driver_extension_1.WebDriverExtension,
        Function, Object, Boolean, Boolean, Boolean, Boolean])
], PerflogMetric);
exports.PerflogMetric = PerflogMetric;
var _MICRO_ITERATIONS_REGEX = /(.+)\*(\d+)$/;
var _MAX_RETRY_COUNT = 20;
var _MARK_NAME_PREFIX = 'benchpress';
var _MARK_NAME_FRAME_CAPTURE = 'frameCapture';
// using 17ms as a somewhat looser threshold, instead of 16.6666ms
var _FRAME_TIME_SMOOTH_THRESHOLD = 17;
var PerflogMetric_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmxvZ19tZXRyaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9tZXRyaWMvcGVyZmxvZ19tZXRyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLG9EQUEwQztBQUMxQyxvQ0FBaUM7QUFDakMsZ0VBQTBGO0FBRzFGOztHQUVHO0FBRUgsSUFBYSxhQUFhO0lBQVMsaUNBQU07SUFvQnZDOzs7O1FBSUk7SUFDSix1QkFDWSxnQkFBb0MsRUFDRCxXQUFxQixFQUN6QixhQUFzQyxFQUMzQyxRQUFpQixFQUNYLGNBQXVCLEVBQ3hCLGFBQXNCLEVBQ3RCLGFBQXNCO1FBUGpFLFlBUUUsaUJBQU8sU0FVUjtRQWpCVyxzQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBQ0QsaUJBQVcsR0FBWCxXQUFXLENBQVU7UUFDekIsbUJBQWEsR0FBYixhQUFhLENBQXlCO1FBQzNDLGNBQVEsR0FBUixRQUFRLENBQVM7UUFDWCxvQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUN4QixtQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUN0QixtQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUcvRCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLEtBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLDZDQUE2QztZQUM3QyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMzQixLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUM3QixDQUFDOztJ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