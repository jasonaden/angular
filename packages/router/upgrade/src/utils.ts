/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Route} from '@angular/router';

export const ANGULARJS_ROUTE_CONFIG = Symbol('ANGULARJS_ROUTE_CONFIG');

/**
 * Maps AngularJS path and route config to Angular route config.
 */
export function mapRouteConfig(path: string, route: any): Route {
  return {path: cleanUrl(path), data: {ANGULARJS_ROUTE_CONFIG: route}};
}

/**
 * Takes a URL string and converts to something the Angular Router can understand. For example,
 * in AngularJS Router you specify the root by using `/` at the beginning of the URL string. In
 * the Angular Router, a `/` preceding the URL is illegal.
 */
export function cleanUrl(url: string) {
  return url.charAt(0) === '/' ? url.slice(1) : url;
}

/**
 * Determine if the route is a wildcard.
 */
export function isWildcard(c: Route) {
  return (c.pathMatch !== 'full' && c.path === '') || c.path === '**';
}
