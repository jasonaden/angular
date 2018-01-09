/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RouterStore, RouterState, getConfig} from '../src/router_store';
import {RouteConfig} from '../src/config';
import {Params} from '../src/shared';

describe('RouterStore', () => {
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

  it('should store the default state', () => {
    expect(store.getState()).toBe(root);
  });

  it('should create an ID for a new config', () => {
    const config = [{path: 'abc'}];
    store.addConfigs(config);

    const state = store.getState();

    const normalizedConfig = getConfig(state, config[0]) !;
    const id = normalizedConfig.id;

    expect(id).toBe(1);
    expect(normalizedConfig.path).toBe('abc');
    expect(normalizedConfig.children).toEqual([]);
  });

  it('should normalize nested configs', () => {
    const config = [{
      path: 'parent', children: [{
        path: 'child'
      }]
    }];
    store.addConfigs(config);

    const state = store.getState();

    const parentConfig = getConfig(state, config[0]) !;
    const childConfig = getConfig(state, config[0].children[0]) !;

    expect(parentConfig.path).toEqual('parent');
    expect(childConfig.path).toEqual('child');
    expect(childConfig.id).toBe(parentConfig.children[0]);
  });

});