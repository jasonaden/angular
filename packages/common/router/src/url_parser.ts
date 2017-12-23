
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
 * Converts a URL path into path plus key/value pairs for matrix parameters:
 *
 * ```
 * const parsed = parseUrlPath('parent/child;a=b;c=d;x=1;x=2;x=3;y=;z');
 * ```
 *
 */
export function parseUrlPath(path: string) {
  return path;
}

export function parseParams(paramDelim: string, valueDelim: string, paramString: string, ) {
  const paramsObj: {[key: string]: any} = {};

  return paramString.split(paramDelim).reduce((acc, param) => {
    if (!param) return acc;

    let splitIdx = param.indexOf(valueDelim);
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

/**
 * Converts a URL query string into a set of key/value pairs:
 *
 * ```
 * const parsed = parseQueryParams('a=b&c=d&x=1&x=2&x=3&y=&z');
 *
 * expect(parsed).toEqual({
 *   a: 'b',
 *   c: 'd',
 *   x: ['1', '2', '3'],
 *   y: undefined,
 *   z: null
 * });
 * ```
 */
export function parseQueryParams(queryString: string): {[key: string]: string | string[]} {
  return parseParams('&', '=', queryString);
}

/**
 * Normalizes a param into a value. If no value is passed (or value is undefined),
 * returns `null`. If empty string is passed, returns `undefined`. Otherwise decodes
 * the value.
 */
export function getParamValue(val?: string): string|null|undefined {
  if (val === undefined) return null;
  if (!val.length) return undefined;
  return decode(val);
}

export function decode(s: string): string {
  return decodeURIComponent(s);
}


