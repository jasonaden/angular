/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {parseUrl, getParams, parseQueryParams} from '../src/url_parser';

fdescribe('UrlParser', () => {
  describe('parseQueryParams', () => {

    it('should parse query parameters', () => {
      const params = parseQueryParams('k=v&k/(a;b)=c');
      expect(params).toEqual({
        'k': 'v',
        'k/(a;b)': 'c',
      });
    });

    it('should parse query params', () => {
      const params = parseQueryParams('a=1&b=2');
      expect(params).toEqual({a: '1', b: '2'});
    });

    it('should parse query params when with parenthesis', () => {
      const params = parseQueryParams('a=(11)&b=(22)');
      expect(params).toEqual({a: '(11)', b: '(22)'});
    });

    it('should parse query params when with slashes', () => {
      const params = parseQueryParams('a=1/2&b=3/4');
      expect(params).toEqual({a: '1/2', b: '3/4'});
    });

    it('should parse key only query params', () => {
      const params = parseQueryParams('a');
      expect(params).toEqual({a: null});
    });

    it('should parse a value-empty query param', () => {
      const params = parseQueryParams('a=');
      expect(params).toEqual({a: undefined});
    });

    it('should parse value-empty query params', () => {
      const params = parseQueryParams('a=&b=');
      expect(params).toEqual({a: undefined, b: undefined});
    });

    it('should return an empty object for empty query params', () => {
      const params = parseQueryParams('');
      expect(params).toEqual({});
    })
  });
});
