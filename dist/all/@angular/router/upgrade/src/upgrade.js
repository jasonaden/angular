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
var router_1 = require("@angular/router");
var static_1 = require("@angular/upgrade/static");
/**
 * @whatItDoes Creates an initializer that in addition to setting up the Angular
 * router sets up the ngRoute integration.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * @experimental
 */
exports.RouterUpgradeInitializer = {
    provide: core_1.APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: locationSyncBootstrapListener,
    deps: [static_1.UpgradeModule]
};
/**
 * @internal
 */
function locationSyncBootstrapListener(ngUpgrade) {
    return function () { setUpLocationSync(ngUpgrade); };
}
exports.locationSyncBootstrapListener = locationSyncBootstrapListener;
/**
 * @whatItDoes Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the Angular location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * @experimental
 */
function setUpLocationSync(ngUpgrade) {
    if (!ngUpgrade.$injector) {
        throw new Error("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
    }
    var router = ngUpgrade.injector.get(router_1.Router);
    var url = document.createElement('a');
    ngUpgrade.$injector.get('$rootScope')
        .$on('$locationChangeStart', function (_, next, __) {
        url.href = next;
        router.navigateByUrl(url.pathname + url.search + url.hash);
    });
}
exports.setUpLocationSync = setUpLocationSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci91cGdyYWRlL3NyYy91cGdyYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQW1GO0FBQ25GLDBDQUF1QztBQUN2QyxrREFBc0Q7QUFJdEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDVSxRQUFBLHdCQUF3QixHQUFHO0lBQ3RDLE9BQU8sRUFBRSw2QkFBc0I7SUFDL0IsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsNkJBQTZCO0lBQ3pDLElBQUksRUFBRSxDQUFDLHNCQUFhLENBQUM7Q0FDdEIsQ0FBQztBQUVGOztHQUVHO0FBQ0gsdUNBQThDLFNBQXdCO0lBQ3BFLE1BQU0sQ0FBQyxjQUFRLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFGRCxzRUFFQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCwyQkFBa0MsU0FBd0I7SUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLCtNQUdiLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFNLE1BQU0sR0FBVyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsQ0FBQztJQUN0RCxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXhDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztTQUNoQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsVUFBQyxDQUFNLEVBQUUsSUFBWSxFQUFFLEVBQVU7UUFDNUQsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQWhCRCw4Q0FnQkMifQ==