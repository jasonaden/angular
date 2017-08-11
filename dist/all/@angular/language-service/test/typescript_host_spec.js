"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('completions', function () {
    var host;
    var service;
    var ngHost;
    beforeEach(function () {
        host = new test_utils_1.MockTypescriptHost(['/app/main.ts'], test_data_1.toh);
        service = ts.createLanguageService(host);
    });
    it('should be able to create a typescript host', function () { expect(function () { return new typescript_host_1.TypeScriptServiceHost(host, service); }).not.toThrow(); });
    beforeEach(function () { ngHost = new typescript_host_1.TypeScriptServiceHost(host, service); });
    it('should be able to analyze modules', function () { expect(ngHost.getAnalyzedModules()).toBeDefined(); });
    it('should be able to analyze modules in without a tsconfig.json file', function () {
        host = new test_utils_1.MockTypescriptHost(['foo.ts'], test_data_1.toh);
        service = ts.createLanguageService(host);
        ngHost = new typescript_host_1.TypeScriptServiceHost(host, service);
        expect(ngHost.getAnalyzedModules()).toBeDefined();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9ob3N0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvdHlwZXNjcmlwdF9ob3N0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0QkFBMEI7QUFDMUIsK0JBQWlDO0FBRWpDLDBEQUE2RDtBQUU3RCx5Q0FBZ0M7QUFDaEMsMkNBQWdEO0FBR2hELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsSUFBSSxJQUE0QixDQUFDO0lBQ2pDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLE1BQTZCLENBQUM7SUFFbEMsVUFBVSxDQUFDO1FBQ1QsSUFBSSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztRQUNyRCxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUM1QyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQXhDLENBQXdDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RSxFQUFFLENBQUMsbUNBQW1DLEVBQ25DLGNBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRSxFQUFFLENBQUMsbUVBQW1FLEVBQUU7UUFDdEUsSUFBSSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztRQUMvQyxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sR0FBRyxJQUFJLHVDQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=