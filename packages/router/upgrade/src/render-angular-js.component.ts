/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AngularJsRouteService} from './route';
import {ANGULARJS_ROUTE_CONFIG} from './utils';

@Component({selector: 'render-angular-js-route', template: ''})
export class RenderAngularJsRoute implements OnDestroy {
  private subscription !: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private $route: AngularJsRouteService) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.data.subscribe(d => {

      const {params, queryParams} = this.activatedRoute.snapshot;
      const preparedRoute =
          this.$route.prepareRoute(d[ANGULARJS_ROUTE_CONFIG], params, queryParams);
      this.$route.commitRoute(preparedRoute);
    });
  }

  ngOnDestroy() {
    const preparedRoute = this.$route.prepareRoute({}, {}, {});
    this.$route.commitRoute(preparedRoute);
    this.subscription.unsubscribe();
  }
}