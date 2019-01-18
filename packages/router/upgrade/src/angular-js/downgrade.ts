/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Location, PlatformLocation} from '@angular/common';
import {Router} from '@angular/router';
import {downgradeInjectable} from '@angular/upgrade/static';
import {$routeProvider} from '../route';

// TODO: Remove downgraded Angular services in favor of building $location
// replacement in Angular and downgrading that service. Similar to the
// Downgraded$RouterProvider below
export const DowngradedLocation = downgradeInjectable(Location);
export const DowngradedPlatformLocation = downgradeInjectable(PlatformLocation);
export const DowngradedRouter = downgradeInjectable(Router);

export const Downgraded$RouteProvider = downgradeInjectable($routeProvider);