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
var metric_1 = require("../metric");
var MultiMetric = (function (_super) {
    __extends(MultiMetric, _super);
    function MultiMetric(_metrics) {
        var _this = _super.call(this) || this;
        _this._metrics = _metrics;
        return _this;
    }
    MultiMetric.provideWith = function (childTokens) {
        return [
            {
                provide: _CHILDREN,
                useFactory: function (injector) { return childTokens.map(function (token) { return injector.get(token); }); },
                deps: [core_1.Injector]
            },
            {
                provide: MultiMetric,
                useFactory: function (children) { return new MultiMetric(children); },
                deps: [_CHILDREN]
            }
        ];
    };
    /**
     * Starts measuring
     */
    MultiMetric.prototype.beginMeasure = function () {
        return Promise.all(this._metrics.map(function (metric) { return metric.beginMeasure(); }));
    };
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    MultiMetric.prototype.endMeasure = function (restart) {
        return Promise.all(this._metrics.map(function (metric) { return metric.endMeasure(restart); }))
            .then(function (values) { return mergeStringMaps(values); });
    };
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    MultiMetric.prototype.describe = function () {
        return mergeStringMaps(this._metrics.map(function (metric) { return metric.describe(); }));
    };
    return MultiMetric;
}(metric_1.Metric));
exports.MultiMetric = MultiMetric;
function mergeStringMaps(maps) {
    var result = {};
    maps.forEach(function (map) { Object.keys(map).forEach(function (prop) { result[prop] = map[prop]; }); });
    return result;
}
var _CHILDREN = new core_1.InjectionToken('MultiMetric.children');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfbWV0cmljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvbWV0cmljL211bHRpX21ldHJpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUQ7QUFFdkQsb0NBQWlDO0FBRWpDO0lBQWlDLCtCQUFNO0lBZ0JyQyxxQkFBb0IsUUFBa0I7UUFBdEMsWUFBMEMsaUJBQU8sU0FBRztRQUFoQyxjQUFRLEdBQVIsUUFBUSxDQUFVOztJQUFhLENBQUM7SUFmN0MsdUJBQVcsR0FBbEIsVUFBbUIsV0FBa0I7UUFDbkMsTUFBTSxDQUFDO1lBQ0w7Z0JBQ0UsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFVBQVUsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxFQUE3QyxDQUE2QztnQkFDakYsSUFBSSxFQUFFLENBQUMsZUFBUSxDQUFDO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLFVBQVUsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBekIsQ0FBeUI7Z0JBQzdELElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUNsQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBSUQ7O09BRUc7SUFDSCxrQ0FBWSxHQUFaO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsZ0NBQVUsR0FBVixVQUFXLE9BQWdCO1FBQ3pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO2FBQ3RFLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLGVBQWUsQ0FBTSxNQUFNLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSCw4QkFBUSxHQUFSO1FBQ0UsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sSUFBSyxPQUFBLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTFDRCxDQUFpQyxlQUFNLEdBMEN0QztBQTFDWSxrQ0FBVztBQTRDeEIseUJBQXlCLElBQStCO0lBQ3RELElBQU0sTUFBTSxHQUE0QixFQUFFLENBQUM7SUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRixNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQyJ9