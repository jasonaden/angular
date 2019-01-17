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

import {ADD_ANGULAR_JS_ROUTES, AddAngularJsRoutes, AngularJsRouteService, provideAddAngularJsRoutes, setupAngularJsRouteService} from './route';

export const ANGULAR_JS_MODULES = new InjectionToken<void>('ANGULAR_JS_MODULES');
export const ANGULAR_JS_ROUTE_GETTER = new InjectionToken<void>('ANGULAR_JS_ROUTES');

@NgModule()
export class AngularJsRouteModule {
  static config(options: {modules: string[], getRoutes: () => { [path: string]: any }}):
      ModuleWithProviders<AngularJsRouteModule> {
    return {
      ngModule: AngularJsRouteModule,
      providers: [
        {
          provide: AngularJsRouteService,
          useFactory: setupAngularJsRouteService,
          deps: [Router, ANGULAR_JS_MODULES, UpgradeModule]
        },
        {provide: ANGULAR_JS_ROUTE_GETTER, useValue: options.getRoutes},
        {provide: ANGULAR_JS_MODULES, useValue: options.modules},
        {provide: ADD_ANGULAR_JS_ROUTES, useFactory: provideAddAngularJsRoutes, deps: [[Router]]},
      ]
    };
  }

  constructor(
      router: Router, @Inject(ANGULAR_JS_ROUTE_GETTER) getRoutes: () => {[path: string]: any},
      @Inject(ADD_ANGULAR_JS_ROUTES) addRoutes: AddAngularJsRoutes) {
    // tslint:disable
    console.group('@angular/router/upgrade:AngularJsRouteModule Constructor');
    console.log('AngularJS routes get added to the router config array');
    console.log('AngularJS Routes', getRoutes());

    addRoutes(getRoutes());

    console.log('Final Router Configs', router.config);
    console.groupEnd();
  }
}
