
import {Params} from './shared';
import {RouteConfig, NormalizedRouteConfig} from './config';
import {BaseStore} from './base_store';
import {isEqualArray, first} from './helpers/collection';

export interface RouterState {
  configs: RouteConfig[],
  targetUrl: string | null,
  previousUrl: string | null,
  targetState: number[] | null,
  previousState: number[] | null
}

function addToChild(configs: RouteConfig[], newConfigs: RouteConfig[], targetPath: number[], currentPath: number[] = []): RouteConfig[] {
  if (isEqualArray(targetPath, currentPath)) {
    if (configs.length)
      throw new Error('Child configs already exist at targetPath: ' + targetPath.join());
    return [...newConfigs];
  }
  const invalidTargetMsg = 'Invalid targetPath: ' + targetPath.join();

  const nextChildIdx = first(targetPath.slice(currentPath.length));
  if (nextChildIdx == null) throw new Error(invalidTargetMsg);

  const nextChild = configs[nextChildIdx];
  if (!nextChild) throw new Error(invalidTargetMsg);

  return [
    ...configs.slice(0, nextChildIdx),
    {...nextChild, children: addToChild(nextChild.children || [], newConfigs, targetPath, [...currentPath, nextChildIdx])},
    ...configs.slice(nextChildIdx + 1)
  ];
}

export class RouterStore extends BaseStore<RouterState> {

  addConfig(config: RouteConfig, parentPath: number[] = []) {
    let state = this.getState();
    this.state = {...state, configs: addToChild(state.configs, [config], parentPath)};
  }

  addConfigs(configs: RouteConfig[], parentPath: number[] = []) {
    const state = this.getState();
    this.state = {...state, configs: addToChild(state.configs, configs, parentPath)};
  }

  setTargetUrl(url: string) {
    const state = this.getState();
    this.state = {...state, previousUrl: state.targetUrl, targetUrl: url};
  }
}

export function getConfig(routes: RouteConfig[], path: number[]): RouteConfig|null {
  if (!path.length) return null;

  const errMsg = `No config available at path: ${path}`;

  const selectedRoute = routes[path[0]];

  if (!selectedRoute) throw new Error(errMsg);

  if (path.length > 1) {
    if (!selectedRoute.children) {
      throw new Error(errMsg);
    }
    return getConfig(selectedRoute.children, path.slice(1));
  } else {
    return selectedRoute;
  }
}
