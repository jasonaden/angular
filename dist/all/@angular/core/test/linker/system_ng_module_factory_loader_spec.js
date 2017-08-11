"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("@angular/core/src/util");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
function mockSystem(modules) {
    return {
        'import': function (target) {
            testing_internal_1.expect(modules[target]).not.toBe(undefined);
            return Promise.resolve(modules[target]);
        }
    };
}
function main() {
    testing_internal_1.describe('SystemJsNgModuleLoader', function () {
        var oldSystem = null;
        testing_internal_1.beforeEach(function () {
            oldSystem = util_1.global['System'];
            util_1.global['System'] = mockSystem({
                'test.ngfactory': { 'default': 'test module factory', 'NamedNgFactory': 'test NamedNgFactory' },
                'prefixed/test/suffixed': { 'NamedNgFactory': 'test module factory' }
            });
        });
        testing_internal_1.afterEach(function () { util_1.global['System'] = oldSystem; });
        testing_internal_1.it('loads a default factory by appending the factory suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler());
            loader.load('test').then(function (contents) { testing_internal_1.expect(contents).toBe('test module factory'); });
        }));
        testing_internal_1.it('loads a named factory by appending the factory suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler());
            loader.load('test#Named').then(function (contents) {
                testing_internal_1.expect(contents).toBe('test NamedNgFactory');
            });
        }));
        testing_internal_1.it('loads a named factory with a configured prefix and suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler(), {
                factoryPathPrefix: 'prefixed/',
                factoryPathSuffix: '/suffixed',
            });
            loader.load('test#Named').then(function (contents) {
                testing_internal_1.expect(contents).toBe('test module factory');
            });
        }));
    });
}
exports.main = main;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtX25nX21vZHVsZV9mYWN0b3J5X2xvYWRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9zeXN0ZW1fbmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBK0Q7QUFDL0QsK0NBQThDO0FBQzlDLGlEQUE0QztBQUM1QywrRUFBdUc7QUFFdkcsb0JBQW9CLE9BQWdDO0lBQ2xELE1BQU0sQ0FBQztRQUNMLFFBQVEsRUFBRSxVQUFDLE1BQWM7WUFDdkIseUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVEO0lBQ0UsMkJBQVEsQ0FBQyx3QkFBd0IsRUFBRTtRQUNqQyxJQUFJLFNBQVMsR0FBUSxJQUFJLENBQUM7UUFDMUIsNkJBQVUsQ0FBQztZQUNULFNBQVMsR0FBRyxhQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDNUIsZ0JBQWdCLEVBQ1osRUFBQyxTQUFTLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUM7Z0JBQy9FLHdCQUF3QixFQUFFLEVBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUM7YUFDcEUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCw0QkFBUyxDQUFDLGNBQVEsYUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5ELHFCQUFFLENBQUMseURBQXlELEVBQUUsZUFBSyxDQUFDO1lBQy9ELElBQU0sTUFBTSxHQUFHLElBQUksNkJBQXNCLENBQUMsSUFBSSxlQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFNLHlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1AscUJBQUUsQ0FBQyx1REFBdUQsRUFBRSxlQUFLLENBQUM7WUFDN0QsSUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBc0IsQ0FBQyxJQUFJLGVBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNyQyx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNQLHFCQUFFLENBQUMsMkRBQTJELEVBQUUsZUFBSyxDQUFDO1lBQ2pFLElBQU0sTUFBTSxHQUFHLElBQUksNkJBQXNCLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRTtnQkFDeEQsaUJBQWlCLEVBQUUsV0FBVztnQkFDOUIsaUJBQWlCLEVBQUUsV0FBVzthQUMvQixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ3JDLHlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBakNELG9CQWlDQztBQUFBLENBQUMifQ==