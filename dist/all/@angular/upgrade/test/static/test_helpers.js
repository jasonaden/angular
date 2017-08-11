"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@angular/upgrade/src/common/constants");
var static_1 = require("@angular/upgrade/static");
__export(require("../common/test_helpers"));
function bootstrap(platform, Ng2Module, element, ng1Module) {
    // We bootstrap the Angular module first; then when it is ready (async) we bootstrap the AngularJS
    // module on the bootstrap element (also ensuring that AngularJS errors will fail the test).
    return platform.bootstrapModule(Ng2Module).then(function (ref) {
        var upgrade = ref.injector.get(static_1.UpgradeModule);
        var failHardModule = function ($provide) {
            $provide.value('$exceptionHandler', function (err) { throw err; });
        };
        upgrade.bootstrap(element, [failHardModule, ng1Module.name]);
        return upgrade;
    });
}
exports.bootstrap = bootstrap;
function $apply(adapter, exp) {
    var $rootScope = adapter.$injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$apply(exp);
}
exports.$apply = $apply;
function $digest(adapter) {
    var $rootScope = adapter.$injector.get(constants_1.$ROOT_SCOPE);
    $rootScope.$digest();
}
exports.$digest = $digest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy90ZXN0X2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFJSCxtRUFBa0U7QUFDbEUsa0RBQXNEO0FBRXRELDRDQUF1QztBQUV2QyxtQkFDSSxRQUFxQixFQUFFLFNBQW1CLEVBQUUsT0FBZ0IsRUFBRSxTQUEwQjtJQUMxRixrR0FBa0c7SUFDbEcsNEZBQTRGO0lBQzVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7UUFDakQsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsc0JBQWEsQ0FBQyxDQUFDO1FBQ2hELElBQU0sY0FBYyxHQUFRLFVBQUMsUUFBaUM7WUFDNUQsUUFBUSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLEdBQVEsSUFBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQztRQUNGLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBWkQsOEJBWUM7QUFFRCxnQkFBdUIsT0FBc0IsRUFBRSxHQUEwQjtJQUN2RSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUE4QixDQUFDO0lBQ25GLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUhELHdCQUdDO0FBRUQsaUJBQXdCLE9BQXNCO0lBQzVDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUFXLENBQThCLENBQUM7SUFDbkYsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFIRCwwQkFHQyJ9