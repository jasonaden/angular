/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';

/**
 * @whatItDoes Name of the primary outlet.
 *
 * @stable
 */
export const PRIMARY_OUTLET = 'primary';

/**
 * A collection of parameters.
 *
 * @stable
 */
export type Params = {
  [key: string]: string | string[]
};

/**
 * Single RouteState. Immutable & serializable.
 */
export interface RouteState {
  url: {path: string, parameters: {[key: string]: string | string[]}}[];
  params: Params;
  queryParams: Params;
  fragment: string;
  outlet: string;
  config: number;
}


export const RouteStateToken = new InjectionToken('ROUTE_STATE_TOKEN');