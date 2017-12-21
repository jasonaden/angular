
import {Params} from './shared';
import {RouteConfig} from './config';

export interface RouterState {
  configToId: [RouteConfig, number][],
  configs: {
    [key: string]: RouteConfig;
  }
}

export class RouterStore {
  constructor(private state: RouterState) {

  }

  getState() {
    return this.state;
  }

  addConfig(config: RouteConfig): number {
    if (config.children && config.children.length) {
      config = {...config, children: this.mapConfigs(config.children)};
    }
    const id = nextId();
    let state = this.getState();
    state = {
      ...state,
      configToId: [...state.configToId, [config, id]],
      configs: {...state.configs, [id]: config}
    };
    return id;
  }

  private mapConfigs(configs: RouteConfig[]): number[] {
    return configs.map(config => {
      return this.addConfig(config);
    });
  }
}

const nextId = function() {
  let id = 0;
  return () => { return id++; };
}();