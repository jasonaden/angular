/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RouteConfig} from '../src/config';
import { RouterState, RouterStore } from "../src/router_store";

describe('Activation', () => {
  let state: RouterState;
  let store: RouterStore;
  const root: RouterState = {
    configs: [],
    targetUrl: null,
    previousUrl: null,
    targetState: null,
    previousState: null,
    outlets: {}
  };

  beforeEach(() => {
    store = new RouterStore(root);
  });
  describe('activateRoute', () => {
    it('should activate a simple router state', () => {
      store.addConfigs([{
        path: 'p'
      }]);
      store.setTargetUrl('');
    });
  });
});
