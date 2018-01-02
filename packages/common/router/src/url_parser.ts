
import {BaseStore} from './base_store';

export interface UrlState {
  remaining: string;
  queryParams: {[key: string]: string | string[]};
  fragment: any;

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

export function parseUrl(url: string): UrlState {
  const split = splitUrl(url);

  return {
    remaining: split.main.startsWith('/') ? split.main.slice(1) : split.main,
    fragment: split.fragment,
    queryParams: parseQueryParams(split.queryString)
  };
}

export function splitUrl(url: string): {main: string, queryString?: string, fragment?: string} {
  let fragment;
  let queryString;

  // Split URL fragment per https://tools.ietf.org/html/rfc3986#section-3.5
  const fragmentIdx = url.indexOf('#');
  if (~fragmentIdx) {
    fragment = decode(url.substring(fragmentIdx + 1));
    url = url.substring(0, fragmentIdx);
  }

  // Split query params
  const queryIdx = url.indexOf('?');
  if (~queryIdx) {
    queryString = url.substring(queryIdx + 1);
    url = url.substring(0, queryIdx);
  }

  return {
    main: url,
    fragment,
    queryString
  };
}

/**
 * Get the string positions between balanced characters.
 */
export function getBalancedPositions(open: string, close: string, str: string) {
  const startIdx = str.indexOf(open);
  if (startIdx === -1) return {start: 0, end: str.length};

  const arr = str.split('').slice(startIdx + 1);
  const counts = arr.reduce((acc, char, idx) => {
    if (!acc.endIdx) {
      if (char === open) acc.open++;
      if (char === close) acc.close++;
      if (acc.open === acc.close) acc.endIdx = idx;
    }
    return acc;
  }, {open: 1, close: 0, endIdx: 0});

  if (!counts.endIdx) throw new Error(`String contains unbalanced ${open}${close} characters`);

  return {start: startIdx + 1, end: counts.endIdx + startIdx + 1};
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

export function parseParams(paramDelim: string, valueDelim: string, paramString?: string ) {
  const paramsObj: {[key: string]: any} = {};
  
  if (!paramString) return paramsObj;

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
 * Converts matrix params string into a set of key/value pairs:
 *
 * ```
 * const parsed = parseMatrixParams('a=b;c=d;x=1;x=2;x=3;y=;z');
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
export function parseMatrixParams(queryString?: string): {[key: string]: string | string[]} {
  return parseParams(';', '=', queryString);
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
export function parseQueryParams(queryString?: string): {[key: string]: string | string[]} {
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


