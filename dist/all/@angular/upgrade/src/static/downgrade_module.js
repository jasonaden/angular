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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL3N0YXRpYy9kb3duZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsOERBQTBEO0FBRTFELDRDQUE4QztBQUM5QyxpREFBa0c7QUFDbEcsdUNBQXlEO0FBRXpELDJEQUEyRTtBQUMzRSwrQkFBeUM7QUFHekMsb0JBQW9CO0FBQ3BCLHlCQUNJLDBCQUMrRDtJQUNqRSxJQUFNLGdCQUFnQixHQUFHLCtCQUFtQixHQUFHLE9BQU8sQ0FBQztJQUN2RCxJQUFNLFdBQVcsR0FBRyxpQkFBVSxDQUFDLDBCQUEwQixDQUFDO1FBQ3RELDBCQUEwQjtRQUMxQixVQUFDLGNBQWdDO1lBQzdCLE9BQUEsa0NBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQywwQkFBMEIsQ0FBQztRQUFsRixDQUFrRixDQUFDO0lBRTNGLElBQUksUUFBa0IsQ0FBQztJQUV2QixxQ0FBcUM7SUFDckMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7U0FDL0IsT0FBTyxDQUNKLHdCQUFZLEVBQ1o7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUNYLDRFQUE0RSxDQUFDLENBQUM7UUFDcEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQyxDQUFDO1NBQ0wsT0FBTyxDQUFDLDJCQUFlLEVBQUU7UUFDeEIscUJBQVM7UUFDVCxVQUFDLFNBQW1DO1lBQ2xDLHVDQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLElBQU0sTUFBTSxHQUFrQjtnQkFDNUIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLE9BQU8sRUFBRSxXQUFXLENBQUMsc0NBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO29CQUM5QyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBUyxDQUFDLENBQUM7b0JBRXhCLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQzthQUNILENBQUM7WUFDRixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FDRixDQUFDLENBQUM7SUFFUCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQXhDRCwwQ0F3Q0MifQ==