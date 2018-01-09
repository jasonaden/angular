
import {BaseStore} from './base_store';
import {PRIMARY_OUTLET} from "./shared";

/**
 * Represents a piece of a URL. These must be uniquely identifiable so they can refer to
 * each other through the `children` property.
 */
export interface UrlSegment {
  /**
   * By default, the router will generate an ID by concatinating the ID from the
   * previous URL with the path for this URL. This means the ID will be the 
   * path from the root of the URL to this segment.
   */
  id: string;

  /** The path for this segment. */
  path: string;

  /** A named router outlet. This defaults to the PRIMARY_OUTLET constant. */
  outlet: string;

  /** Parsed matrix params for this segment. */
  params: {[key: string]: string | string[]} | null;

  /** Child UrlSegments by ID */
  children: UrlSegment[] | null;
}

export interface UrlState {
  raw: string;
  queryParams: {[key: string]: string | string[]} | null;
  fragment: string | null;
  segments: UrlSegment[];
}

export interface UrlPart {
  id: number;
  raw: string;
  params: {[key: string]: string | string[]};
  children: number[];
}

export function parseUrl(url: string): UrlState {
  const split = splitUrl(cleanUrl(url));

  return {
    raw: url,
    fragment: split.fragment,
    queryParams: parseQueryParams(split.queryString),
    segments: splitPath(split.main).map(parseSegment)
  };
}

/**
 * Cleans up the URL, preparing it for parsing.
 */
export function cleanUrl(url: string) {
  // Clean the URL, removing any empty parens and leading "/"
  return url.replace(/^\/+|\(\)/g, '');
}

/**
 * Parses a URL segment into a UrlSegment object.
 */
export function parseSegment(segment: string = ''): UrlSegment {
  const {path: remainingUrl, children: childPath} = parsePath(segment);
  const {name: outlet, path: mainPath} = parseOutlet(remainingUrl);
  const paramsIdx = mainPath.indexOf(';');
  const params = ~paramsIdx ? parseMatrixParams(mainPath.slice(paramsIdx + 1)) : null;
  const path = ~paramsIdx ? mainPath.slice(0, paramsIdx) : mainPath;

  const children = childPath ? splitPath(childPath).map(parseSegment) : null;
  
  return {
    id: `${outlet}:${path}`,
    path: path,
    outlet: outlet,
    params: params,
    children: children
  };
}

/**
 * Splits the URL into the parent segment (parsable by itself) and children (in parens).
 */
export function parsePath(path: string): {path: string, children: string|null} {
  const balancedPositions = getBalancedPositions('(', ')', path);
  let children = null;
  
  if (balancedPositions.exists) {
    children = path.substring(balancedPositions.start, balancedPositions.end);
    path = path.substring(0, balancedPositions.start - 1);
  }

  return {
    path: path,
    children: children
  };
}

/**
 * Splits a URL into siblings and unscoped pieces.
 */
export function splitPath(url: string): string[] {
  let parenCount = 0;

  if (url.length == 0) return [url];

  const splits = url.split('').reduce((acc, curr, idx, a) => {
    if (curr === '(') acc.parenCount++;
    if (curr === ')') acc.parenCount--;
    if (acc.parenCount) return acc;
    
    const prev = a[idx - 1];
    if (curr === prev && curr === '/') acc.indexes.push(idx - 1);
    if (idx === a.length - 1) acc.indexes.push(idx + 1);

    return acc;
  }, {parenCount: 0, indexes: [] as number[]});
  if (splits.parenCount < 0) throw new Error("Unbalanced parenthesis in URL string: " + url);
  
  return splits.indexes.reduce((acc, splitIdx, idx, a) => {
    const prevSplitIdx = a[idx - 1];
    const startIdx = idx === 0 ? 0 : prevSplitIdx + 2;
    acc.push(url.slice(startIdx, splitIdx));
    return acc;
  }, [] as string[]);
}

export function parseOutlet(url: string): {name: string, path: string} {
  const splitIdx = url.indexOf(':');

  return {
    name: url.substring(0, splitIdx) || PRIMARY_OUTLET,
    path: url.substring(splitIdx + 1)
  };
}

export function splitUrl(url: string): {main: string, queryString: string | null, fragment: string | null} {
  let fragment = null;
  let queryString = null;

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
  if (startIdx === -1) return {start: 0, end: str.length, exists: false};

  const arr = str.split('').slice(startIdx);
  const counts = arr.reduce((acc, char, idx) => {
    if (acc.endIdx === -1) {
      if (char === open) acc.open++;
      if (char === close) acc.close++;
      if (acc.open === acc.close) acc.endIdx = idx;
    }
    return acc;
  }, {open: 0, close: 0, endIdx: -1});

  if (counts.endIdx === -1) throw new Error(`String contains unbalanced ${open}${close} characters`);

  return {start: startIdx + 1, end: counts.endIdx + startIdx, exists: startIdx + 1 !== counts.endIdx + startIdx};
}

export function parseParams(paramDelim: string, valueDelim: string, paramString: string | null) {
  if (!paramString) return null;

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
export function parseMatrixParams(queryString: string | null) {
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
export function parseQueryParams(queryString: string | null) {
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


