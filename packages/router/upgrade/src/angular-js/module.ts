/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getAngularJSGlobal} from '@angular/upgrade/static';

import {Downgraded$RouteProvider, DowngradedLocation, DowngradedPlatformLocation, DowngradedRouter} from './downgrade';
import {UpgradeLocationProvider} from './location';
import {ngRouteUpgradeModule} from './route';

const angular = getAngularJSGlobal();

export const ROUTER_UPGRADE_MODULE = 'RouterUpgradeModule';
export const upgradeModule = angular.module(ROUTER_UPGRADE_MODULE, [ngRouteUpgradeModule.name])
                                 .factory('$route', Downgraded$RouteProvider)
                                 .factory('DowngradedLocation', DowngradedLocation)
                                 .factory('DowngradedPlatformLocation', DowngradedPlatformLocation)
                                 .factory('DowngradedRouter', DowngradedRouter)
                                 .provider('$location', UpgradeLocationProvider)
                                 // Force $route to be instantiated immediately.
                                 .run(['$route', ($route: any) => {}]);
