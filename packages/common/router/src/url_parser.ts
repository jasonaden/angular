
import {BaseStore} from './base_store';

export interface UrlState {
  remaining: string;
  queryParams: {[key: string]: string | string[]};

  // configToId: [RouteConfig, number][],
  // configs: {
  //   [key: string]: NormalizedRouteConfig;
  // }
}

export interface UrlPart {
  id: number;
  raw: string;
  params: {[key: string]: string | string[]};
  children: number[];
}

export class UrlStore extends BaseStore<UrlState> {

}


export function parseUrl() {

}

export function getParams() {

}

/**
 * Turn param string into a value.
 */
export function getParamValue(val?: string): string|null|undefined {
  if (val === undefined) return null;
  if (!val.length) return undefined;
  return decode(val);
}

export function decode(s: string): string {
  return decodeURIComponent(s);
}

export function parseQueryParams(url: string): {[key: string]: string | string[]} {
  const paramsObj: {[key: string]: any} = {};

  return url.split('&').reduce((acc, param) => {
    if (!param) return acc;

    let splitIdx = param.indexOf('=');
    const paramName = param.slice(0, splitIdx === -1 ? undefined : splitIdx);
    const paramValue = getParamValue(splitIdx === -1 ? undefined : param.slice(splitIdx + 1));

    // Property already exists, convert to array
    if (acc.hasOwnProperty(paramName)) {
      if (!Array.isArray(acc[paramName])) {
        acc[paramName] = [acc[paramName]];
      }
      acc[paramName].push(paramValue);
    } else {
      acc[paramName] = paramValue;
    }

    return acc;
  }, paramsObj);
}
