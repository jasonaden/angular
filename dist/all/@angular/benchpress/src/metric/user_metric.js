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
var web_driver_adapter_1 = require("../web_driver_adapter");
var UserMetric = UserMetric_1 = (function (_super) {
    __extends(UserMetric, _super);
    function UserMetric(_userMetrics, _wdAdapter) {
        var _this = _super.call(this) || this;
        _this._userMetrics = _userMetrics;
        _this._wdAdapter = _wdAdapter;
        return _this;
    }
    /**
     * Starts measuring
     */
    UserMetric.prototype.beginMeasure = function () { return Promise.resolve(true); };
    /**
     * Ends measuring.
     */
    UserMetric.prototype.endMeasure = function (restart) {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var adapter = this._wdAdapter;
        var names = Object.keys(this._userMetrics);
        function getAndClearValues() {
            Promise.all(names.map(function (name) { return adapter.executeScript("return window." + name); }))
                .then(function (values) {
                if (values.every(function (v) { return typeof v === 'number'; })) {
                    Promise.all(names.map(function (name) { return adapter.executeScript("delete window." + name); }))
                        .then(function (_) {
                        var map = {};
                        for (var i = 0, n = names.length; i < n; i++) {
                            map[names[i]] = values[i];
                        }
                        resolve(map);
                    }, reject);
                }
                else {
                    setTimeout(getAndClearValues, 100);
                }
            }, reject);
        }
        getAndClearValues();
        return promise;
    };
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    UserMetric.prototype.describe = function () { return this._userMetrics; };
    return UserMetric;
}(metric_1.Metric));
UserMetric.PROVIDERS = [{ provide: UserMetric_1, deps: [common_options_1.Options.USER_METRICS, web_driver_adapter_1.WebDriverAdapter] }];
UserMetric = UserMetric_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(common_options_1.Options.USER_METRICS)),
    __metadata("design:paramtypes", [Object, web_driver_adapter_1.WebDriverAdapter])
], UserMetric);
exports.UserMetric = UserMetric;
var UserMetric_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tZXRyaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9tZXRyaWMvdXNlcl9tZXRyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLG9EQUEwQztBQUMxQyxvQ0FBaUM7QUFDakMsNERBQXVEO0FBR3ZELElBQWEsVUFBVTtJQUFTLDhCQUFNO0lBSXBDLG9CQUMwQyxZQUFxQyxFQUNuRSxVQUE0QjtRQUZ4QyxZQUdFLGlCQUFPLFNBQ1I7UUFIeUMsa0JBQVksR0FBWixZQUFZLENBQXlCO1FBQ25FLGdCQUFVLEdBQVYsVUFBVSxDQUFrQjs7SUFFeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUNBQVksR0FBWixjQUErQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUQ7O09BRUc7SUFDSCwrQkFBVSxHQUFWLFVBQVcsT0FBZ0I7UUFDekIsSUFBSSxPQUE4QixDQUFDO1FBQ25DLElBQUksTUFBNEIsQ0FBQztRQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQ25DLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDZCxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2hDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdDO1lBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBaUIsSUFBTSxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQztpQkFDekUsSUFBSSxDQUFDLFVBQUMsTUFBYTtnQkFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBaUIsSUFBTSxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQzt5QkFDekUsSUFBSSxDQUFDLFVBQUMsQ0FBUTt3QkFDYixJQUFNLEdBQUcsR0FBdUIsRUFBRSxDQUFDO3dCQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUM3QyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixDQUFDO3dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0QsVUFBVSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxDQUFDO1lBQ0gsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDZCQUFRLEdBQVIsY0FBbUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLGlCQUFDO0FBQUQsQ0FBQyxBQXRERCxDQUFnQyxlQUFNLEdBc0RyQztBQXJEUSxvQkFBUyxHQUNNLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLHdCQUFPLENBQUMsWUFBWSxFQUFFLHFDQUFnQixDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBRm5GLFVBQVU7SUFEdEIsaUJBQVUsRUFBRTtJQU1OLFdBQUEsYUFBTSxDQUFDLHdCQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7NkNBQ1QscUNBQWdCO0dBTjdCLFVBQVUsQ0FzRHRCO0FBdERZLGdDQUFVIn0=