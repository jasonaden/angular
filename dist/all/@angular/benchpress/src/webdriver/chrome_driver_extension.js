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
var web_driver_adapter_1 = require("../web_driver_adapter");
var web_driver_extension_1 = require("../web_driver_extension");
/**
 * Set the following 'traceCategories' to collect metrics in Chrome:
 * 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing'
 *
 * In order to collect the frame rate related metrics, add 'benchmark'
 * to the list above.
 */
var ChromeDriverExtension = ChromeDriverExtension_1 = (function (_super) {
    __extends(ChromeDriverExtension, _super);
    function ChromeDriverExtension(_driver, userAgent) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        _this._firstRun = true;
        _this._majorChromeVersion = _this._parseChromeVersion(userAgent);
        return _this;
    }
    ChromeDriverExtension.prototype._parseChromeVersion = function (userAgent) {
        if (!userAgent) {
            return -1;
        }
        var v = userAgent.split(/Chrom(e|ium)\//g)[2];
        if (!v) {
            return -1;
        }
        v = v.split('.')[0];
        if (!v) {
            return -1;
        }
        return parseInt(v, 10);
    };
    ChromeDriverExtension.prototype.gc = function () { return this._driver.executeScript('window.gc()'); };
    ChromeDriverExtension.prototype.timeBegin = function (name) {
        if (this._firstRun) {
            this._firstRun = false;
            // Before the first run, read out the existing performance logs
            // so that the chrome buffer does not fill up.
            this._driver.logs('performance');
        }
        return this._driver.executeScript("console.time('" + name + "');");
    };
    ChromeDriverExtension.prototype.timeEnd = function (name, restartName) {
        if (restartName === void 0) { restartName = null; }
        var script = "console.timeEnd('" + name + "');";
        if (restartName) {
            script += "console.time('" + restartName + "');";
        }
        return this._driver.executeScript(script);
    };
    // See [Chrome Trace Event
    // Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
    ChromeDriverExtension.prototype.readPerfLog = function () {
        var _this = this;
        // TODO(tbosch): Chromedriver bug https://code.google.com/p/chromedriver/issues/detail?id=1098
        // Need to execute at least one command so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then(function (_) { return _this._driver.logs('performance'); })
            .then(function (entries) {
            var events = [];
            entries.forEach(function (entry) {
                var message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Tracing.dataCollected') {
                    events.push(message['params']);
                }
                if (message['method'] === 'Tracing.bufferUsage') {
                    throw new Error('The DevTools trace buffer filled during the test!');
                }
            });
            return _this._convertPerfRecordsToEvents(events);
        });
    };
    ChromeDriverExtension.prototype._convertPerfRecordsToEvents = function (chromeEvents, normalizedEvents) {
        var _this = this;
        if (normalizedEvents === void 0) { normalizedEvents = null; }
        if (!normalizedEvents) {
            normalizedEvents = [];
        }
        chromeEvents.forEach(function (event) {
            var categories = _this._parseCategories(event['cat']);
            var normalizedEvent = _this._convertEvent(event, categories);
            if (normalizedEvent != null)
                normalizedEvents.push(normalizedEvent);
        });
        return normalizedEvents;
    };
    ChromeDriverExtension.prototype._convertEvent = function (event, categories) {
        var name = event['name'];
        var args = event['args'];
        if (this._isEvent(categories, name, ['blink.console'])) {
            return normalizeEvent(event, { 'name': name });
        }
        else if (this._isEvent(categories, name, ['benchmark'], 'BenchmarkInstrumentation::ImplThreadRenderingStats')) {
            // TODO(goderbauer): Instead of BenchmarkInstrumentation::ImplThreadRenderingStats the
            // following events should be used (if available) for more accurate measurements:
            //   1st choice: vsync_before - ground truth on Android
            //   2nd choice: BenchmarkInstrumentation::DisplayRenderingStats - available on systems with
            //               new surfaces framework (not broadly enabled yet)
            //   3rd choice: BenchmarkInstrumentation::ImplThreadRenderingStats - fallback event that is
            //               always available if something is rendered
            var frameCount = event['args']['data']['frame_count'];
            if (frameCount > 1) {
                throw new Error('multi-frame render stats not supported');
            }
            if (frameCount == 1) {
                return normalizeEvent(event, { 'name': 'frame' });
            }
        }
        else if (this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'Rasterize') ||
            this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'CompositeLayers')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MajorGC')) {
            var normArgs = {
                'majorGc': true,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MinorGC')) {
            var normArgs = {
                'majorGc': false,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'FunctionCall') &&
            (!args || !args['data'] ||
                (args['data']['scriptName'] !== 'InjectedScript' && args['data']['scriptName'] !== ''))) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'EvaluateScript')) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'blink'], 'UpdateLayoutTree')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'UpdateLayerTree') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Layout') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Paint')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceReceivedData')) {
            var normArgs = { 'encodedDataLength': args['data']['encodedDataLength'] };
            return normalizeEvent(event, { 'name': 'receivedData', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceSendRequest')) {
            var data_1 = args['data'];
            var normArgs = { 'url': data_1['url'], 'method': data_1['requestMethod'] };
            return normalizeEvent(event, { 'name': 'sendRequest', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['blink.user_timing'], 'navigationStart')) {
            return normalizeEvent(event, { 'name': 'navigationStart' });
        }
        return null; // nothing useful in this event
    };
    ChromeDriverExtension.prototype._parseCategories = function (categories) { return categories.split(','); };
    ChromeDriverExtension.prototype._isEvent = function (eventCategories, eventName, expectedCategories, expectedName) {
        if (expectedName === void 0) { expectedName = null; }
        var hasCategories = expectedCategories.reduce(function (value, cat) { return value && eventCategories.indexOf(cat) !== -1; }, true);
        return !expectedName ? hasCategories : hasCategories && eventName === expectedName;
    };
    ChromeDriverExtension.prototype.perfLogFeatures = function () {
        return new web_driver_extension_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
    };
    ChromeDriverExtension.prototype.supports = function (capabilities) {
        return this._majorChromeVersion >= 44 && capabilities['browserName'].toLowerCase() === 'chrome';
    };
    return ChromeDriverExtension;
}(web_driver_extension_1.WebDriverExtension));
ChromeDriverExtension.PROVIDERS = [{
        provide: ChromeDriverExtension_1,
        deps: [web_driver_adapter_1.WebDriverAdapter, common_options_1.Options.USER_AGENT]
    }];
ChromeDriverExtension = ChromeDriverExtension_1 = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(common_options_1.Options.USER_AGENT)),
    __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, String])
], ChromeDriverExtension);
exports.ChromeDriverExtension = ChromeDriverExtension;
function normalizeEvent(chromeEvent, data) {
    var ph = chromeEvent['ph'].toUpperCase();
    if (ph === 'S') {
        ph = 'B';
    }
    else if (ph === 'F') {
        ph = 'E';
    }
    else if (ph === 'R') {
        // mark events from navigation timing
        ph = 'I';
    }
    var result = { 'pid': chromeEvent['pid'], 'ph': ph, 'cat': 'timeline', 'ts': chromeEvent['ts'] / 1000 };
    if (ph === 'X') {
        var dur = chromeEvent['dur'];
        if (dur === undefined) {
            dur = chromeEvent['tdur'];
        }
        result['dur'] = !dur ? 0.0 : dur / 1000;
    }
    for (var prop in data) {
        result[prop] = data[prop];
    }
    return result;
}
var ChromeDriverExtension_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lX2RyaXZlcl9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvY2hyb21lX2RyaXZlcl9leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLG9EQUEwQztBQUMxQyw0REFBdUQ7QUFDdkQsZ0VBQTBGO0FBRTFGOzs7Ozs7R0FNRztBQUVILElBQWEscUJBQXFCO0lBQVMseUNBQWtCO0lBUzNELCtCQUFvQixPQUF5QixFQUE4QixTQUFpQjtRQUE1RixZQUNFLGlCQUFPLFNBRVI7UUFIbUIsYUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFGckMsZUFBUyxHQUFHLElBQUksQ0FBQztRQUl2QixLQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDOztJQUNqRSxDQUFDO0lBRU8sbURBQW1CLEdBQTNCLFVBQTRCLFNBQWlCO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUNELENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxD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