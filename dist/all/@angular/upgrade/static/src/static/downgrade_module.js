"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var angular = require("../common/angular1");
var constants_1 = require("../common/constants");
var util_1 = require("../common/util");
var angular1_providers_1 = require("./angular1_providers");
var util_2 = require("./util");
/** @experimental */
function downgradeModule(moduleFactoryOrBootstrapFn) {
    var LAZY_MODULE_NAME = constants_1.UPGRADE_MODULE_NAME + '.lazy';
    var bootstrapFn = util_1.isFunction(moduleFactoryOrBootstrapFn) ?
        moduleFactoryOrBootstrapFn :
        function (extraProviders) {
            return platform_browser_1.platformBrowser(extraProviders).bootstrapModuleFactory(moduleFactoryOrBootstrapFn);
        };
    var injector;
    // Create an ng1 module to bootstrap.
    angular.module(LAZY_MODULE_NAME, [])
        .factory(constants_1.INJECTOR_KEY, function () {
        if (!injector) {
            throw new Error('Trying to get the Angular injector before bootstrapping an Angular module.');
        }
        return injector;
    })
        .factory(constants_1.LAZY_MODULE_REF, [
        constants_1.$INJECTOR,
        function ($injector) {
            angular1_providers_1.setTempInjectorRef($injector);
            var result = {
                needsNgZone: true,
                promise: bootstrapFn(angular1_providers_1.angular1Providers).then(function (ref) {
                    injector = result.injector = new util_2.NgAdapterInjector(ref.injector);
                    injector.get(constants_1.$INJECTOR);
                    return injector;
                })
            };
            return result;
        }
    ]);
    return LAZY_MODULE_NAME;
}
exports.downgradeModule = downgradeModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy9zdGF0aWMvZG93bmdyYWRlX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILDhEQUEwRDtBQUUxRCw0Q0FBOEM7QUFDOUMsaURBQWtHO0FBQ2xHLHVDQUF5RDtBQUV6RCwyREFBMkU7QUFDM0UsK0JBQXlDO0FBR3pDLG9CQUFvQjtBQUNwQix5QkFDSSwwQkFDK0Q7SUFDakUsSUFBTSxnQkFBZ0IsR0FBRywrQkFBbUIsR0FBRyxPQUFPLENBQUM7SUFDdkQsSUFBTSxXQUFXLEdBQUcsaUJBQVUsQ0FBQywwQkFBMEIsQ0FBQztRQUN0RCwwQkFBMEI7UUFDMUIsVUFBQyxjQUFnQztZQUM3QixPQUFBLGtDQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsc0JBQXNCLENBQUMsMEJBQTBCLENBQUM7UUFBbEYsQ0FBa0YsQ0FBQztJQUUzRixJQUFJLFFBQWtCLENBQUM7SUFFdkIscUNBQXFDO0lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDO1NBQy9CLE9BQU8sQ0FDSix3QkFBWSxFQUNaO1FBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDWCw0RUFBNEUsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztTQUNMLE9BQU8sQ0FBQywyQkFBZSxFQUFFO1FBQ3hCLHFCQUFTO1FBQ1QsVUFBQyxTQUFtQztZQUNsQyx1Q0FBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixJQUFNLE1BQU0sR0FBa0I7Z0JBQzVCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixPQUFPLEVBQUUsV0FBVyxDQUFDLHNDQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztvQkFDOUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2pFLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQVMsQ0FBQyxDQUFDO29CQUV4QixNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNsQixDQUFDLENBQUM7YUFDSCxDQUFDO1lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0lBRVAsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUF4Q0QsMENBd0NDIn0=