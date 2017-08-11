"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var perf_util_1 = require("e2e_util/perf_util");
var protractor_1 = require("protractor");
var tree_data_1 = require("./tree_data");
describe('tree benchmark perf', function () {
    var _oldRootEl;
    beforeEach(function () { return _oldRootEl = protractor_1.browser.rootEl; });
    afterEach(function () {
        protractor_1.browser.rootEl = _oldRootEl;
        perf_util_1.verifyNoBrowserErrors();
    });
    tree_data_1.Benchmarks.forEach(function (benchmark) {
        describe(benchmark.id, function () {
            it('should work for createOnly', function (done) {
                runTreeBenchmark({
                    id: 'createOnly',
                    benchmark: benchmark,
                    prepare: function () { return protractor_1.$(tree_data_1.CreateBtn).click(); },
                    work: function () { return protractor_1.$(tree_data_1.DestroyBtn).click(); }
                }).then(done, done.fail);
            });
            it('should work for createDestroy', function (done) {
                runTreeBenchmark({
                    id: 'createDestroy',
                    benchmark: benchmark,
                    work: function () {
                        protractor_1.$(tree_data_1.DestroyBtn).click();
                        protractor_1.$(tree_data_1.CreateBtn).click();
                    }
                }).then(done, done.fail);
            });
            it('should work for update', function (done) {
                runTreeBenchmark({ id: 'update', benchmark: benchmark, work: function () { return protractor_1.$(tree_data_1.CreateBtn).click(); } })
                    .then(done, done.fail);
            });
            if (benchmark.buttons.indexOf(tree_data_1.DetectChangesBtn) !== -1) {
                it('should work for detectChanges', function (done) {
                    runTreeBenchmark({
                        id: 'detectChanges',
                        benchmark: benchmark,
                        work: function () { return protractor_1.$(tree_data_1.DetectChangesBtn).click(); },
                        setup: function () { return protractor_1.$(tree_data_1.DestroyBtn).click(); }
                    }).then(done, done.fail);
                });
            }
        });
    });
});
function runTreeBenchmark(_a) {
    var id = _a.id, benchmark = _a.benchmark, prepare = _a.prepare, setup = _a.setup, work = _a.work;
    var params = [{ name: 'depth', value: 11 }];
    if (benchmark.extraParams) {
        params = params.concat(benchmark.extraParams);
    }
    protractor_1.browser.rootEl = tree_data_1.RootEl;
    return perf_util_1.runBenchmark({
        id: benchmark.id + "." + id,
        url: benchmark.url,
        ignoreBrowserSynchronization: benchmark.ignoreBrowserSynchronization,
        params: params,
        work: work,
        prepare: prepare,
        setup: setup
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9wZXJmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L3RyZWVfcGVyZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdEQUF1RTtBQUN2RSx5Q0FBc0M7QUFFdEMseUNBQW1HO0FBRW5HLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUU5QixJQUFJLFVBQWUsQ0FBQztJQUNwQixVQUFVLENBQUMsY0FBTSxPQUFBLFVBQVUsR0FBRyxvQkFBTyxDQUFDLE1BQU0sRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBRTlDLFNBQVMsQ0FBQztRQUNSLG9CQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUM1QixpQ0FBcUIsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO1FBQzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ3JCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxVQUFDLElBQUk7Z0JBQ3BDLGdCQUFnQixDQUFDO29CQUNmLEVBQUUsRUFBRSxZQUFZO29CQUNoQixTQUFTLFdBQUE7b0JBQ1QsT0FBTyxFQUFFLGNBQU0sT0FBQSxjQUFDLENBQUMscUJBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFwQixDQUFvQjtvQkFDbkMsSUFBSSxFQUFFLGNBQU0sT0FBQSxjQUFDLENBQUMsc0JBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFyQixDQUFxQjtpQkFDbEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLFVBQUMsSUFBSTtnQkFDdkMsZ0JBQWdCLENBQUM7b0JBQ2YsRUFBRSxFQUFFLGVBQWU7b0JBQ25CLFNB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