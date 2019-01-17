/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, InjectionToken, ModuleWithProviders, Optional} from '@angular/core';
import {Route, Router, RouterModule, provideRoutes} from '@angular/router';
import {UpgradeModule, getAngularJSGlobal} from '@angular/upgrade/static';

import {RenderAngularJsRoute} from './render-angular-js.component';
import {ANGULARJS_ROUTE_CONFIG, cleanUrl, isWildcard, mapRouteConfig} from './utils';

const angular = getAngularJSGlobal();

export const ADD_ANGULAR_JS_ROUTES = new InjectionToken<void>('ADD_ANGULAR_JS_ROUTES');

export declare type AddAngularJsRoutes = (routes: {[path: string]: any}) => void;

// TODO: remove this in favor of local scoped function?
export function provideAddAngularJsRoutes(router: Router): AddAngularJsRoutes {
  return (routes: {[path: string]: any}) => {
    const angularRoutes = Object.keys(routes).map(path => mapRouteConfig(path, routes[path]));

    const startIdx = router.config.findIndex((c, i, a) => isWildcard(c) || i === a.length - 1);

    // TODO: Currently mutating the config here. See if this work work immutably.
    router.config.splice(startIdx, 0, ...angularRoutes);
  };
}

export function addAngularJsRoutes(router: Router, routes: {[path: string]: any}) {
  const angularRoutes = Object.keys(routes).map(path => mapRouteConfig(path, routes[path]));

  const startIdx = router.config.findIndex((c, i, a) => isWildcard(c) || i === a.length - 1);

  // TODO: Currently mutating the config here. See if this work work immutably.
  router.config.splice(startIdx, 0, ...angularRoutes);
}

export function setupAngularJsRouteService(
    router: Router, modules: string[], ngUpgrade: UpgradeModule) {
  if (!ngUpgrade.$injector) {
    ngUpgrade.bootstrap(document.body, modules);
    // throw new Error(
    //     `AngularJsRouteService can be used only after UpgradeModule.bootstrap has been called.`);
  }

  const $rootScope = ngUpgrade.$injector.get('$rootScope');
  const $location = ngUpgrade.$injector.get('$location');
  const $routeParams = ngUpgrade.$injector.get('$routeParams');
  const $q = ngUpgrade.$injector.get('$q');
  const $injector = ngUpgrade.$injector;
  const $templateRequest = ngUpgrade.$injector.get('$templateRequest');
  const $sce = ngUpgrade.$injector.get('$sce');
  const $browser = ngUpgrade.$injector.get('$browser');

  const ajsRouteService = new AngularJsRouteService(
      $rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce, $browser, router);

  return ajsRouteService;
}

export class AngularJsRouteService {
  /** Current route. Accessible through $route.current */
  current: any = {};
  forceReload: boolean = false;

  constructor(
      private $rootScope: any, private $location: any, private $routeParams: any, private $q: any,
      private $injector: any, private $templateRequest: any, private $sce: any,
      private $browser: any, private router: Router) {
    console.group('@angular/router/upgrade:AngularJsRouteService Constructor');
    // tslint:disable
    console.log('This constructor should run when AngularJS is loaded');
    console.log(arguments);
    // tslint:enable
    console.groupEnd();
  }

  /**
   * Reloads current route. This method can be implemented using Angular router's method of
   * reloading a route.
   */
  reload() { throw new Error('NOT IMPLEMENTED'); }

  /**
   * Updates current parameters. Will read params for the current route and execute router.navigate
   * with params replaced.
   */
  updateParams(newParams: any) { throw new Error('NOT IMPLEMENTED'); }

  prepareRoute(route: any, params: any, queryParams: any): [any, boolean] {
    let lastRoute = this.current;

    const preparedRoute = parseRoute(route, params, queryParams);
    const preparedRouteIsUpdateOnly = isNavigationUpdateOnly(preparedRoute, lastRoute);

    if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
      if (this.$rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute)
              .defaultPrevented) {
        console.warn('Wire through $locationEvent when routing');
        // TODO: Solve handling $location events. Might need to re-wire from the outside back in
        // and confirm the evnet haven't been cancelled already. Definitely need to pass the event
        // object around so default can be prevented here.
        // if ($locationEvent) {
        //   $locationEvent.preventDefault();
        // }
      }
    }
    return [preparedRoute, preparedRouteIsUpdateOnly];
  }

  commitRoute([preparedRoute, preparedRouteIsUpdateOnly]: [any, boolean]) {
    let lastRoute = this.current;
    let nextRoute = preparedRoute;

    if (preparedRouteIsUpdateOnly) {
      lastRoute.params = nextRoute.params;
      angular.copy(lastRoute.params, this.$routeParams);
      this.$rootScope.$broadcast('$routeUpdate', lastRoute);
    } else if (nextRoute || lastRoute) {
      this.forceReload = false;
      this.current = nextRoute;

      let nextRoutePromise = this.$q.resolve(nextRoute);

      this.$browser.$$incOutstandingRequestCount('$route');

      nextRoutePromise.then((route: any) => this.getRedirectionData(route))
          .then((data: any) => this.handlePossibleRedirection(data))
          .then((keepProcessingRoute: any) => {
            return keepProcessingRoute &&
                nextRoutePromise.then((route: any) => this.resolveLocals(route))
                    .then((locals: any) => {
                      // after route change
                      if (nextRoute === this.current) {
                        if (nextRoute) {
                          nextRoute.locals = locals;
                          angular.copy(nextRoute.params, this.$routeParams);
                        }
                        this.$rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
                      }
                    });
          })
          .catch((error: any) => {
            if (nextRoute === this.current) {
              this.$rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          })
          .finally(() => {
            // Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
            // `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
            // `outstandingRequestCount` to hit zero.  This is important in case we are
            // redirecting
            // to a new route which also requires some asynchronous work.

            this.$browser.$$completeOutstandingRequest(angular.noop, '$route');
          });
    }
  }

  private getRedirectionData(route: any) {
    console.warn(
        'AngularJSRouteService.handlePossibleRedirection(): Review and implement Angular replacement.');

    let data = {route: route, hasRedirection: false, path: '', search: {}, url: ''};

    if (route) {
      if (route.redirectTo) {
        if (angular.isString(route.redirectTo)) {
          data.path = this.interpolate(route.redirectTo, route.params);
          data.search = route.params;
          data.hasRedirection = true;
        } else {
          let oldPath = this.$location.path();
          let oldSearch = this.$location.search();
          let newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

          if (angular.isDefined(newUrl)) {
            data.url = newUrl;
            data.hasRedirection = true;
          }
        }
      } else if (route.resolveRedirectTo) {
        return this.$q.resolve(this.$injector.invoke(route.resolveRedirectTo))
            .then((newUrl: any) => {
              if (angular.isDefined(newUrl)) {
                data.url = newUrl;
                data.hasRedirection = true;
              }

              return data;
            });
      }
    }

    return data;
  }

  /**
  * @returns {string} interpolation of the redirect path with the parameters
  */
  private interpolate(str: any, params: any) {
    let result: any[] = [];
    angular.forEach((str || '').split(':'), (segment: any, i: any) => {
      if (i === 0) {
        result.push(segment);
      } else {
        let segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
        let key = segmentMatch[1];
        result.push(params[key]);
        result.push(segmentMatch[2] || '');
        delete params[key];
      }
    });
    return result.join('');
  }

  private handlePossibleRedirection(data: any) {
    console.warn(
        'AngularJSRouteService.handlePossibleRedirection(): Review and implement Angular replacement.');

    let keepProcessingRoute = true;

    if (data.route !== this.current) {
      keepProcessingRoute = false;
    } else if (data.hasRedirection) {
      let oldUrl = this.$location.url();
      let newUrl = data.url;

      if (newUrl) {
        this.$location.url(newUrl).replace();
      } else {
        newUrl = this.$location.path(data.path).search(data.search).replace().url();
      }

      if (newUrl !== oldUrl) {
        // Exit out and don't process current next value,
        // wait for next location change from redirect
        keepProcessingRoute = false;
      }
    }

    return keepProcessingRoute;
  }

  private resolveLocals(route: any) {
    if (route) {
      let locals = angular.extend({}, route.resolve);
      angular.forEach(locals, (value: any, key: any) => {
        locals[key] = angular.isString(value) ? this.$injector.get(value) :
                                                this.$injector.invoke(value, null, null, key);
      });
      let template = this.getTemplateFor(route);
      if (angular.isDefined(template)) {
        locals['$template'] = template;
      }
      return this.$q.all(locals);
    }
  }

  private getTemplateFor(route: any) {
    let template, templateUrl;
    if (angular.isDefined(template = route.template)) {
      if (angular.isFunction(template)) {
        template = template(route.params);
      }
    } else if (angular.isDefined(templateUrl = route.templateUrl)) {
      if (angular.isFunction(templateUrl)) {
        templateUrl = templateUrl(route.params);
      }
      if (angular.isDefined(templateUrl)) {
        route.loadedTemplateUrl = this.$sce.valueOf(templateUrl);
        template = this.$templateRequest(templateUrl);
      }
    }
    return template;
  }
}

/**
 * @returns {Object} the current active route, by matching it against the URL
 */
function parseRoute(route: any, params: any, queryParams: any) {
  let parsed = inherit(route, {params: {...queryParams, ...params}, pathParams: params});
  parsed.$$route = route;
  return parsed;
}

function inherit(parent: any, extra: any) {
  return angular.extend(Object.create(parent), extra);
}

/**
 * @param {Object} newRoute - The new route configuration (as returned by `parseRoute()`).
 * @param {Object} oldRoute - The previous route configuration (as returned by
 * `parseRoute()`).
 * @returns {boolean} Whether this is an "update-only" navigation, i.e. the URL maps to the
 * same
 *                    route and it can be reused (based on the config and the type of change).
 */
function isNavigationUpdateOnly(
    newRoute: any, oldRoute: any, forceReload: boolean = false): boolean {
  console.warn('Implement `forceReload`');
  // IF this is not a forced reload
  return !forceReload
      // AND both `newRoute`/`oldRoute` are defined
      && newRoute && oldRoute
      // AND they map to the same Route Definition Object
      && (newRoute.$$route === oldRoute.$$route)
      // AND `reloadOnUrl` is disabled
      && (!newRoute.reloadOnUrl
          // OR `reloadOnSearch` is disabled
          || (!newRoute.reloadOnSearch
              // AND both routes have the same path params
              && angular.equals(newRoute.pathParams, oldRoute.pathParams)));
}
