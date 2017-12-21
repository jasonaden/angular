
/**
 *
 */
export interface RouteConfig {
  path?: string;
  pathMatch?: string;
  redirectTo?: string;
  outlet?: string;
  children?: RouteConfig[];
  // loadChildren?: (() => Promise<Type<any>>);
  // matcher?: UrlMatcher;
  // component?: Type<any>;
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
