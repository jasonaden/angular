/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {parseUrl, getBalancedPositions, parseUrlPath, parseQueryParams, parseMatrixParams, parseParams, splitUrl} from '../src/url_parser';

describe('UrlParser', () => {
  describe('parseUrlPath', () => {
    it('should parse the root url', () => {
      const path = parseUrlPath('/');
      expect(path).toEqual('/');
    });

    // it('should parse non-empty urls', () => {
    //   const tree = url.parse('one/two');
    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one/two');
    //   expect(url.serialize(tree)).toEqual('/one/two');
    // });

    // it('should parse multiple secondary segments', () => {
    //   const tree = url.parse('/one/two(left:three//right:four)');

    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one/two');
    //   expectSegment(tree.root.children['left'], 'three');
    //   expectSegment(tree.root.children['right'], 'four');

    //   expect(url.serialize(tree)).toEqual('/one/two(left:three//right:four)');
    // });

    // it('should parse top-level nodes with only secondary segment', () => {
    //   const tree = url.parse('/(left:one)');

    //   expect(tree.root.numberOfChildren).toEqual(1);
    //   expectSegment(tree.root.children['left'], 'one');

    //   expect(url.serialize(tree)).toEqual('/(left:one)');
    // });

    // it('should parse nodes with only secondary segment', () => {
    //   const tree = url.parse('/one/(left:two)');

    //   const one = tree.root.children[PRIMARY_OUTLET];
    //   expectSegment(one, 'one', true);
    //   expect(one.numberOfChildren).toEqual(1);
    //   expectSegment(one.children['left'], 'two');

    //   expect(url.serialize(tree)).toEqual('/one/(left:two)');
    // });

    // it('should not parse empty path segments with params', () => {
    //   expect(() => url.parse('/one/two/(;a=1//right:;b=2)'))
    //       .toThrowError(/Empty path url segment cannot have parameters/);
    // });

    // it('should parse scoped secondary segments', () => {
    //   const tree = url.parse('/one/(two//left:three)');

    //   const primary = tree.root.children[PRIMARY_OUTLET];
    //   expectSegment(primary, 'one', true);

    //   expectSegment(primary.children[PRIMARY_OUTLET], 'two');
    //   expectSegment(primary.children['left'], 'three');

    //   expect(url.serialize(tree)).toEqual('/one/(two//left:three)');
    // });

    // it('should parse scoped secondary segments with unscoped ones', () => {
    //   const tree = url.parse('/one/(two//left:three)(right:four)');

    //   const primary = tree.root.children[PRIMARY_OUTLET];
    //   expectSegment(primary, 'one', true);
    //   expectSegment(primary.children[PRIMARY_OUTLET], 'two');
    //   expectSegment(primary.children['left'], 'three');
    //   expectSegment(tree.root.children['right'], 'four');

    //   expect(url.serialize(tree)).toEqual('/one/(two//left:three)(right:four)');
    // });

    // it('should parse secondary segments that have children', () => {
    //   const tree = url.parse('/one(left:two/three)');

    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one');
    //   expectSegment(tree.root.children['left'], 'two/three');

    //   expect(url.serialize(tree)).toEqual('/one(left:two/three)');
    // });

    // it('should parse an empty secondary segment group', () => {
    //   const tree = url.parse('/one()');

    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one');

    //   expect(url.serialize(tree)).toEqual('/one');
    // });

    // it('should parse key-value matrix params', () => {
    //   const tree = url.parse('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');

    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one;a=11a;b=11b');
    //   expectSegment(tree.root.children['left'], 'two;c=22');
    //   expectSegment(tree.root.children['right'], 'three;d=33');

    //   expect(url.serialize(tree)).toEqual('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');
    // });

    // it('should parse key only matrix params', () => {
    //   const tree = url.parse('/one;a');

    //   expectSegment(tree.root.children[PRIMARY_OUTLET], 'one;a=');

    //   expect(url.serialize(tree)).toEqual('/one;a=');
    // });
  });

  describe('splitUrl', () => {
    it('should always return a "main"', () => {
      const split = splitUrl('');
      expect(split.main).toBe('');
    });

    it('should split a URL fragment', () => {
      const split = splitUrl('abc/def#fragment');
      expect(split.main).toBe('abc/def');
      expect(split.fragment).toBe('fragment');
    });

    it('should split a query string', () => {
      const split = splitUrl('abc/def?query_string');
      expect(split.main).toBe('abc/def');
      expect(split.queryString).toBe('query_string');
    });

    it('should split when both query string and fragment are defined', () => {
      const split = splitUrl('abc/def?query_string#fragment');
      expect(split.main).toBe('abc/def');
      expect(split.queryString).toBe('query_string');
      expect(split.fragment).toBe('fragment');
    });
  });

  describe('parseParams', () => {

    function parseAmpParams(paramString: string) {
      return parseParams('&', '=', paramString);
    }

    it('should parse query parameters', () => {
      const params = parseAmpParams('k=v&k/(a;b)=c');
      expect(params).toEqual({
        'k': 'v',
        'k/(a;b)': 'c',
      });
    });

    it('should parse params', () => {
      const params = parseAmpParams('a=1&b=2');
      expect(params).toEqual({a: '1', b: '2'});
    });

    it('should parse params when with parenthesis', () => {
      const params = parseAmpParams('a=(11)&b=(22)');
      expect(params).toEqual({a: '(11)', b: '(22)'});
    });

    it('should parse params when with slashes', () => {
      const params = parseAmpParams('a=1/2&b=3/4');
      expect(params).toEqual({a: '1/2', b: '3/4'});
    });

    it('should parse key only params', () => {
      const params = parseAmpParams('a');
      expect(params).toEqual({a: null});
    });

    it('should parse a value-empty query param', () => {
      const params = parseAmpParams('a=');
      expect(params).toEqual({a: undefined});
    });

    it('should parse value-empty params', () => {
      const params = parseAmpParams('a=&b=');
      expect(params).toEqual({a: undefined, b: undefined});
    });

    it('should return an empty object for empty params', () => {
      const params = parseAmpParams('');
      expect(params).toEqual({});
    });

    it('should handle multiple params of the same name into an array', () => {
      const params = parseAmpParams('a=foo&a=bar&a=swaz');
      expect(params).toEqual({a: ['foo', 'bar', 'swaz']});
      expect(params['a']).toEqual(['foo', 'bar', 'swaz']);
    });
  });

  describe('parseMatrixParams', () => {
    it('should pass parseMatrixParams example', () => {
      const parsed = parseMatrixParams('a=b;c=d;x=1;x=2;x=3;y=;z');

      expect(parsed).toEqual({
        a: 'b',
        c: 'd',
        x: ['1', '2', '3'],
        y: undefined,
        z: null
      });
    });
  });

  describe('parseQueryParams', () => {
    it('should pass parseQueryparams example', () => {
      const parsed = parseQueryParams('a=b&c=d&x=1&x=2&x=3&y=&z');

      expect(parsed).toEqual({
        a: 'b',
        c: 'd',
        x: ['1', '2', '3'],
        y: undefined,
        z: null
      });
    });
  });

  describe('getBalancedPositions', () => {
    it('ignores strings without open/close characters', () => {
      const str = 'one/two/three';

      const pos = getBalancedPositions('(', ')', str);

      expect(str.slice(pos.start, pos.end)).toBe(str);
    });

    it('finds string between single set of parens', () => {
      const str = 'one(two)three';

      const pos = getBalancedPositions('(', ')', str);

      expect(str.slice(pos.start, pos.end)).toBe('two');
    });

    it('finds string between nested sets of parens', () => {
      const str = 'one((two)(three))';

      const pos = getBalancedPositions('(', ')', str);

      expect(str.slice(pos.start, pos.end)).toBe('(two)(three)');
    });

    it('throws an error if parens are unballanced', () => {
      const str = 'one((two)(three)';

      expect(() => getBalancedPositions('(', ')', str))
        .toThrowError('String contains unbalanced () characters');
    });
  });
});
