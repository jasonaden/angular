/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UpgradeModule} from '@angular/upgrade/static';
import {Subscription} from 'rxjs';
import {AngularJsRouteService} from './route';

@Component({selector: 'render-angular-js-route', template: ''})
export class RenderAngularJsRoute implements OnDestroy {
  private subscription !: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private $route: AngularJsRouteService) {}

  ngOnInit() {
    // const $route = this.ngUpgrade.$injector.get('$route');
    this.subscription = this.activatedRoute.data.subscribe(d => {
      // tslint:disable
      console.log('$route', this.$route);
      console.log('data: ', d);
      // tslint:enable
      const {params, queryParams} = this.activatedRoute.snapshot;
      const preparedRoute = this.$route.prepareRoute(d, params, queryParams);
      this.$route.commitRoute(preparedRoute);
    });
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }
}