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

@Component({selector: 'render-angular-js-route', template: ''})
export class RenderAngularJsRoute implements OnDestroy {
  private subscription !: Subscription;

  constructor(private snapshot: ActivatedRoute, private ngUpgrade: UpgradeModule) {}

  ngOnInit() {
    const $route = this.ngUpgrade.$injector.get('$route');
    this.subscription = this.snapshot.data.subscribe(d => {
      console.log('$route', $route);
      console.log('data: ', d);
      const preparedRoute = $route.prepareRoute(d);
      $route.commitRoute(preparedRoute);
    });
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }
}