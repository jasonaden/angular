/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RouteConfig} from '../src/config';
import { RouterState, RouterStore } from "../src/router_store";

fdescribe('Activation', () => {
  let state: RouterState;
  let store: RouterStore;
  const root: RouterState = {
    configToId: [],
    configs: {},
    targetUrl: null,
    previousUrl: null,
    targetState: null,
    previousState: null
  };

  beforeEach(() => {
    store = new RouterStore(root);
  });
  describe('activateRoute', () => {
    it('should activate a simple router state', () => {
      store.addConfigs([{
        path: ''
      }]);
      store.setTargetUrl('');
    });
  });
});
