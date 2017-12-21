/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RouterStore, RouterState} from '../src/router_store';
import {RouteConfig} from '../src/config';
import {Params} from '../src/shared';

fdescribe('RouterStore', () => {
  let state: RouterState;
  let store: RouterStore;
  const root: RouterState = {configToId: [], configs: {}};

  beforeEach(() => {
    store = new RouterStore(root);
  });

  it('should store the default state', () => {
    expect(store.getState()).toBe(root); }
  );


});