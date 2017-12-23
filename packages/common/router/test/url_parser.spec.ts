/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getParams, parseUrl, parseUrlPath, parseQueryParams} from '../src/url_parser';

fdescribe('UrlParser', () => {
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
    });

    it('should handle multiple query params of the same name into an array', () => {
      const params = parseQueryParams('a=foo&a=bar&a=swaz');
      expect(params).toEqual({a: ['foo', 'bar', 'swaz']});
      expect(params['a']).toEqual(['foo', 'bar', 'swaz']);
    });

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
});
