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

  it('should store the default state', () => {
    expect(store.getState()).toBe(root);
  });

  it('should create an ID for a new config', () => {
    const config = [{path: 'abc'}];
    store.addConfigs(config);

    const state = store.getState();

    const storedConfig = getConfig(state.configs, [0]) !;

    expect(storedConfig.path).toBe('abc');
  });

  it('should normalize nested configs', () => {
    const config = [{
      path: 'parent', children: [{
        path: 'child'
      }]
    }];
    store.addConfigs(config);

    const state = store.getState();

    const parentConfig = getConfig(state.configs, [0]) !;
    const childConfig = getConfig(state.configs, [0, 0]) !;

    expect(parentConfig.path).toEqual('parent');
    expect(childConfig.path).toEqual('child');
  });

  it('should allow adding configs individually', () => {
    store.addConfig({path: 'parent'});

    const state = store.getState();

    expect(getConfig(state.configs, [0])!.path).toBe('parent');
  });

  it('should allow adding configs individually after first add', () => {
    const parentConfig = {path: 'parent'};
    const childConfig = {path: 'child'};
    store.addConfig(parentConfig);

    store.addConfig(childConfig, [0]);
    const state = store.getState();

    expect(getConfig(state.configs, [0])!.path).toBe('parent');
    expect(getConfig(state.configs, [0, 0])!.path).toBe('child');
  });

  it('should allow complex adding of configs', () => {
    const parents = [{path: 'a'}, {path: 'aa'}];
    const child = {path: 'ab'};
    const children = [{path: 'aab'}, {path: 'aabb'}];
    const grandchild = {path: 'aabbc'};

    store.addConfigs(parents);
    store.addConfig(child, [0]);
    store.addConfigs(children, [1]);
    store.addConfig(grandchild, [1, 1]);

    const configs = store.getState().configs;

    expect(configs).toEqual([
      {path: 'a', children: [{path: 'ab'}]},
      {path: 'aa', children: [
        {path: 'aab'},
        {path: 'aabb', children: [{path: 'aabbc'}]}
      ]},

    ]);
  });

  it('should error when children are added where they already exist', () => {
    store.addConfig({path: 'parent', children: [{path: 'child'}]});

    expect(() => store.addConfig({path: 'sibling'}, [0]))
      .toThrowError('Child configs already exist at targetPath: 0');;
  });
});