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
var index_1 = require("../../index");
function main() {
    function createReporters(ids) {
        var r = index_1.Injector
            .create([
            ids.map(function (id) { return ({ provide: id, useValue: new MockReporter(id) }); }),
            index_1.MultiReporter.provideWith(ids)
        ])
            .get(index_1.MultiReporter);
        return Promise.resolve(r);
    }
    testing_internal_1.describe('multi reporter', function () {
        testing_internal_1.it('should reportMeasureValues to all', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var mv = new index_1.MeasureValues(0, new Date(), {});
            createReporters(['m1', 'm2']).then(function (r) { return r.reportMeasureValues(mv); }).then(function (values) {
                testing_internal_1.expect(values).toEqual([{ 'id': 'm1', 'values': mv }, { 'id': 'm2', 'values': mv }]);
                async.done();
            });
        }));
        testing_internal_1.it('should reportSample to call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var completeSample = [new index_1.MeasureValues(0, new Date(), {}), new index_1.MeasureValues(1, new Date(), {})];
            var validSample = [completeSample[1]];
            createReporters(['m1', 'm2'])
                .then(function (r) { return r.reportSample(completeSample, validSample); })
                .then(function (values) {
                testing_internal_1.expect(values).toEqual([
                    { 'id': 'm1', 'completeSample': completeSample, 'validSample': validSample },
                    { 'id': 'm2', 'completeSample': completeSample, 'validSample': validSample }
                ]);
                async.done();
            });
        }));
    });
}
exports.main = main;
var MockReporter = (function (_super) {
    __extends(MockReporter, _super);
    function MockReporter(_id) {
        var _this = _super.call(this) || this;
        _this._id = _id;
        return _this;
    }
    MockReporter.prototype.reportMeasureValues = function (values) {
        return Promise.resolve({ 'id': this._id, 'values': values });
    };
    MockReporter.prototype.reportSample = function (completeSample, validSample) {
        return Promise.resolve({ 'id': this._id, 'completeSample': completeSample, 'validSample': validSample });
    };
    return MockReporter;
}(index_1.Reporter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcmVwb3J0ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9yZXBvcnRlci9tdWx0aV9yZXBvcnRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtFQUE0RztBQUU1RyxxQ0FBNkU7QUFFN0U7SUFDRSx5QkFBeUIsR0FBVTtRQUNqQyxJQUFNLENBQUMsR0FBRyxnQkFBUTthQUNILE1BQU0sQ0FBQztZQUNOLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUEvQyxDQUErQyxDQUFDO1lBQzlELHFCQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztTQUMvQixDQUFDO2FBQ0QsR0FBRyxDQUFDLHFCQUFhLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsMkJBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUV6QixxQkFBRSxDQUFDLG1DQUFtQyxFQUNuQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELElBQU0sRUFBRSxHQUFHLElBQUkscUJBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRCxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUUvRSx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pGLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLHFCQUFFLENBQUMsNkJBQTZCLEVBQUUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNwRixJQUFNLGNBQWMsR0FDaEIsQ0FBQyxJQUFJLHFCQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxxQkFBYSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBTSxXQUFXLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QyxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxFQUEzQyxDQUEyQyxDQUFDO2lCQUN4RCxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUVYLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUNyQixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUM7b0JBQzFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBQztpQkFDM0UsQ0FBQyxDQUFDO2dCQUNILEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXpDRCxvQkF5Q0M7QUFFRDtJQUEyQixnQ0FBUTtJQUNqQyxzQkFBb0IsR0FBVztRQUEvQixZQUFtQyxpQkFBTyxTQUFHO1FBQXpCLFNBQUcsR0FBSCxHQUFHLENBQVE7O0lBQWEsQ0FBQztJQUU3QywwQ0FBbUIsR0FBbkIsVUFBb0IsTUFBcUI7UUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsbUNBQVksR0FBWixVQUFhLGNBQStCLEVBQUUsV0FBNEI7UUFFeEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQ2xCLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFaRCxDQUEyQixnQkFBUSxHQVlsQyJ9