/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {Router} from '@angular/router';
import {UpgradeModule} from '@angular/upgrade/static';

import {$routeProvider, ADD_ANGULAR_JS_ROUTES, AddAngularJsRoutes, AngularJsRouteService, provideAddAngularJsRoutes, setup$routeProvider, setupAngularJsRouteService} from './route';

export const ANGULAR_JS_MODULES = new InjectionToken<void>('ANGULAR_JS_MODULES');
export const ANGULAR_JS_ROUTE_GETTER = new InjectionToken<void>('ANGULAR_JS_ROUTES');

@NgModule()
export class AngularJsRouteModule {
  static config(options: {modules: string[], getRoutes: () => { [path: string]: any }}):
      ModuleWithProviders<AngularJsRouteModule> {
    return {
      ngModule: AngularJsRouteModule,
      providers: [
        {provide: AngularJsRouteService, useFactory: setupAngularJsRouteService, deps: [Router]},
        {
          provide: $routeProvider,
          useFactory: setup$routeProvider,
          deps: [AngularJsRouteService, ANGULAR_JS_MODULES, UpgradeModule]
        },
        {provide: ANGULAR_JS_ROUTE_GETTER, useValue: options.getRoutes},
        {provide: ANGULAR_JS_MODULES, useValue: options.modules},
        {provide: ADD_ANGULAR_JS_ROUTES, useFactory: provideAddAngularJsRoutes, deps: [[Router]]},
      ]
    };
  }

  /**
   * When the AngularJsRouteModule is injected used, AngularJsRouteService must also be injected.
   * This is to ensure the service is created through a DI call from Angular. This is the same
   * instance that will become the $route service in AngularJS. If AngularJS requests it's
   * instance first, it's possible to have two instances which would break routing.
   */
  constructor(
      router: Router, @Inject(ANGULAR_JS_ROUTE_GETTER) getRoutes: () => {[path: string]: any},
      @Inject(ADD_ANGULAR_JS_ROUTES) addAngularJsRoutes: AddAngularJsRoutes,
      $route: AngularJsRouteService) {
    console.group('@angular/router/upgrade:AngularJsRouteModule Constructor');
    console.info('AngularJS routes get added to the router config array');
    console.info('AngularJS Routes', getRoutes());

    // Get the AngularJS route configs and add them to the current router.config property.
    // This function will also mark each route as having come from AngularJS, as well as
    // make slight adjustments to the defined path in order to make it compatible with
    // Angular's route config.
    addAngularJsRoutes(getRoutes());

    console.info('Final Router Configs', router.config);
    console.groupEnd();
  }
}
