import {Type} from '@angular/core';

/**
 *
 */
export interface RouteConfig {
  path?: string;
  pathMatch?: string;
  redirectTo?: string;
  outlet?: string;
  children?: RouteConfig[];
  component?: Type<any>;
  // loadChildren?: (() => Promise<Type<any>>);
  // matcher?: UrlMatcher;
  // canActivate?: any[];
  // canActivateChild?: any[];
  // canDeactivate?: any[];
  // canLoad?: any[];
  // data?: Data;
  // resolve?: ResolveData;
  // loadChildren?: LoadChildren;
  // runGuardsAndResolvers?: RunGuardsAndResolvers;
  /**
   * Filled for routes with `loadChildren` once the module has been loaded
   * @internal
   */
  // _loadedConfig?: LoadedRouterConfig;
}

export interface NormalizedRouteConfig {
  id: number;
  path?: string;
  pathMatch?: string;
  redirectTo?: string;
  outlet?: string;
  children: number[];
  component?: Type<any>;
  // loadChildren?: (() => Promise<Type<any>>);
  // matcher?: UrlMatcher;
  // canActivate?: any[];
  // canActivateChild?: any[];
  // canDeactivate?: any[];
  // canLoad?: any[];
  // data?: Data;
  // resolve?: ResolveData;
  // loadChildren?: LoadChildren;
  // runGuardsAndResolvers?: RunGuardsAndResolvers;
  /**
   * Filled for routes with `loadChildren` once the module has been loaded
   * @internal
   */
  // _loadedConfig?: LoadedRouterConfig;
}