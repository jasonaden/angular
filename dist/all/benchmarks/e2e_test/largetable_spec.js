"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var e2e_util_1 = require("e2e_util/e2e_util");
var protractor_1 = require("protractor");
describe('largetable benchmark spec', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should work for ng2', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/ng2/index.html',
        });
    });
    it('should work for ng2 switch', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/ng2_switch/index.html',
        });
    });
    it('should work for the baseline', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/baseline/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    it('should work for the incremental-dom', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/incremental_dom/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    function testTableBenchmark(openConfig) {
        e2e_util_1.openBrowser({
            url: openConfig.url,
            ignoreBrowserSynchronization: openConfig.ignoreBrowserSynchronization,
            params: [{ name: 'cols', value: 5 }, { name: 'rows', value: 5 }],
        });
        protractor_1.$('#createDom').click();
        expect(protractor_1.$('#root').getText()).toContain('0/0');
        protractor_1.$('#createDom').click();
        expect(protractor_1.$('#root').getText()).toContain('A/A');
        protractor_1.$('#destroyDom').click();
        expect(protractor_1.$('#root').getText()).toEqual('');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2V0YWJsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L2xhcmdldGFibGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxRTtBQUNyRSx5Q0FBNkI7QUFFN0IsUUFBUSxDQUFDLDJCQUEyQixFQUFFO0lBRXBDLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QixrQkFBa0IsQ0FBQztZQUNqQixHQUFHLEVBQUUsOENBQThDO1NBQ3BELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLGtCQUFrQixDQUFDO1lBQ2pCLEdBQUcsRUFBRSxxREFBcUQ7U0FDM0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7UUFDakMsa0JBQWtCLENBQUM7WUFDakIsR0FBRyxFQUFFLG1EQUFtRDtZQUN4RCw0QkFBNEIsRUFBRSxJQUFJO1NBQ25DLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLGtCQUFrQixDQUFDO1lBQ2pCLEdBQUcsRUFBRSwwREFBMEQ7WUFDL0QsNEJBQTRCLEVBQUUsSUFBSTtTQUNuQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILDRCQUE0QixVQUFpRTtRQUMzRixzQkFBVyxDQUFDO1lBQ1YsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHO1lBQ25CLDRCQUE0QixFQUFFLFVBQVUsQ0FBQyw0QkFBNEI7WUFDckUsTUFBTSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO1NBQzdELENBQUMsQ0FBQztRQUNILGNBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsY0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLGNBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsY0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLGNBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsY0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9