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
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
function main() {
    var wdAdapter;
    function createMetric(perfLogs, perfLogFeatures, _a) {
        var userMetrics = (_a === void 0 ? {} : _a).userMetrics;
        if (!perfLogFeatures) {
            perfLogFeatures =
                new index_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
        }
        if (!userMetrics) {
            userMetrics = {};
        }
        wdAdapter = new MockDriverAdapter();
        var providers = [
            index_1.Options.DEFAULT_PROVIDERS, index_1.UserMetric.PROVIDERS,
            { provide: index_1.Options.USER_METRICS, useValue: userMetrics },
            { provide: index_1.WebDriverAdapter, useValue: wdAdapter }
        ];
        return core_1.Injector.create(providers).get(index_1.UserMetric);
    }
    testing_internal_1.describe('user metric', function () {
        testing_internal_1.it('should describe itself based on userMetrics', function () {
            testing_internal_1.expect(createMetric([[]], new index_1.PerfLogFeatures(), {
                userMetrics: { 'loadTime': 'time to load' }
            }).describe())
                .toEqual({ 'loadTime': 'time to load' });
        });
        testing_internal_1.describe('endMeasure', function () {
            testing_internal_1.it('should stop measuring when all properties have numeric values', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var metric = createMetric([[]], new index_1.PerfLogFeatures(), { userMetrics: { 'loadTime': 'time to load', 'content': 'time to see content' } });
                metric.beginMeasure()
                    .then(function (_) { return metric.endMeasure(true); })
                    .then(function (values) {
                    testing_internal_1.expect(values['loadTime']).toBe(25);
                    testing_internal_1.expect(values['content']).toBe(250);
                    async.done();
                });
                wdAdapter.data['loadTime'] = 25;
                // Wait before setting 2nd property.
                setTimeout(function () { wdAdapter.data['content'] = 250; }, 50);
            }), 600);
        });
    });
}
exports.main = main;
var MockDriverAdapter = (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {};
        return _this;
    }
    MockDriverAdapter.prototype.executeScript = function (script) {
        // Just handles `return window.propName` ignores `delete window.propName`.
        if (script.indexOf('return window.') == 0) {
            var metricName = script.substring('return window.'.length);
            return Promise.resolve(this.data[metricName]);
        }
        else if (script.indexOf('delete window.') == 0) {
            return Promise.resolve(null);
        }
        else {
            return Promise.reject("Unexpected syntax: " + script);
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tZXRyaWNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9tZXRyaWMvdXNlcl9tZXRyaWNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUQ7QUFDdkQsK0VBQTRHO0FBRTVHLHFDQUFpRztBQUVqRztJQUNFLElBQUksU0FBNEIsQ0FBQztJQUVqQyxzQkFDSSxRQUF3QixFQUFFLGVBQWdDLEVBQzFELEVBQTJEO1lBQTFELG1EQUFXO1FBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLGVBQWU7Z0JBQ1gsSUFBSSx1QkFBZSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQixXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFDRCxTQUFTLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ3BDLElBQU0sU0FBUyxHQUFxQjtZQUNsQyxlQUFPLENBQUMsaUJBQWlCLEVBQUUsa0JBQVUsQ0FBQyxTQUFTO1lBQy9DLEVBQUMsT0FBTyxFQUFFLGVBQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQztZQUN0RCxFQUFDLE9BQU8sRUFBRSx3QkFBZ0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO1NBQ2pELENBQUM7UUFDRixNQUFNLENBQUMsZUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQVUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCwyQkFB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