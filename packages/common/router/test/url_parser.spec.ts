/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {parseUrl, getBalancedPositions, parseQueryParams, parseMatrixParams, parseParams, splitUrl, parseOutlet, parsePath, splitPath, parseSegment, cleanUrl} from '../src/url_parser';
import {PRIMARY_OUTLET} from "../src/shared";

describe('UrlParser', () => {
  describe('parseUrl', () => {
    it('should parse the root url', () => {
      const parsed = parseUrl('/');
      expect(parsed).toEqual({
        raw: '/',
        fragment: null,
        queryParams: null,
        segments: [{
          id: 'primary:',
          path: '',
          outlet: 'primary',
          params: null,
          children: null
        }]
      });
    });

    it('should parse non-empty urls', () => {
      const parsed = parseUrl('one/two');

      expect(parsed).toEqual({
        raw: 'one/two',
        fragment: null,
        queryParams: null,
        segments: [{
          id: 'primary:one/two',
          path: 'one/two',
          outlet: 'primary',
          params: null,
          children: null
        }]
      });
    });

    it('should parse multiple secondary segments', () => {
      const parsed = parseUrl('/one/two(left:three//right:four)');

      expect(parsed).toEqual({
        raw: '/one/two(left:three//right:four)',
        fragment: null,
        queryParams: null,
        segments: [{
          id: 'primary:one/two',
          path: 'one/two',
          outlet: 'primary',
          params: null,
          children: [{
            id: 'left:three',
            path: 'three',
            outlet: 'left',
            params: null,
            children: null
          },
          {
            id: 'right:four',
            path: 'four',
            outlet: 'right',
            params: null,
            children: null
          }]
        }]
      });
    });

    it('should parse top-level nodes with only secondary segment', () => {
      const parsed = parseUrl('/(left:one)');

      expect(parsed.segments[0].id).toBe('primary:');
      expect(parsed.segments[0].children! [0].id).toBe('left:one');
      expect(parsed.segments[0].children! [0].children).toBe(null);
    });

    it('should parse nodes with only secondary segment', () => {
      const parsed = parseUrl('/one/(left:two)');

      expect(parsed.segments[0].id).toBe('primary:one/');
      expect(parsed.segments[0].children! [0].id).toBe('left:two');
    });

    xit('should not parse empty path segments with params', () => {
      expect(() => parseUrl('/one/two/(;a=1//right:;b=2)'))
          .toThrowError(/Empty path url segment cannot have parameters/);
    });

    it('should parse scoped secondary segments', () => {
      const parsed = parseUrl('/one/(two//left:three)');

      expect(parsed.segments[0].children! [0].id).toBe('primary:two');
      expect(parsed.segments[0].children! [1].id).toBe('left:three');
    });

    xit('should parse scoped secondary segments with unscoped ones', () => {
      const parsed = parseUrl('/one/(two//left:three)(right:four)');

      // TODO(jasonaden): Handle the above scenario. It shouldn't be supported based on new
      // URL scheme.
      
      // const primary = tree.root.children[PRIMARY_OUTLET];
      // expectSegment(primary, 'one', true);
      // expectSegment(primary.children[PRIMARY_OUTLET], 'two');
      // expectSegment(primary.children['left'], 'three');
      // expectSegment(tree.root.children['right'], 'four');

      // expect(url.serialize(tree)).toEqual('/one/(two//left:three)(right:four)');
    });

    it('should parse secondary segments that have children', () => {
      const parsed = parseUrl('/one(left:two/three)');

      expect(parsed.segments.length).toBe(1);
      expect(parsed.segments[0].children![0].id).toBe('left:two/three');
    });

    it('should parse secondary segments that have children', () => {
      const parsed = parseUrl('/one//left:two/three');

      expect(parsed.segments.length).toBe(2);
      expect(parsed.segments[0].id).toBe('primary:one');
      expect(parsed.segments[1].id).toBe('left:two/three');
    });

    it('should parse an empty secondary segment group', () => {
      const parsed = parseUrl('/one()');

      expect(parsed.segments[0].id).toBe('primary:one');
      expect(parsed.segments[0].children).toBe(null);
    });

    it('should parse key-value matrix params', () => {
      const parsed = parseUrl('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');

      expect(parsed).toEqual({
        raw: '/one;a=11a;b=11b(left:two;c=22//right:three;d=33)',
        fragment: null,
        queryParams: null,
        segments: [{
          id: 'primary:one',
          path: 'one',
          outlet: 'primary',
          params: {a: '11a', b: '11b'},
          children: [{
            id: 'left:two',
            path: 'two',
            outlet: 'left',
            params: {c: '22'},
            children: null
          },
          {
            id: 'right:three',
            path: 'three',
            outlet: 'right',
            params: {d: '33'},
            children: null
          }]
        }]
      });
    });

    it('should parse key only matrix params', () => {
      const parsed = parseUrl('/one;a');

      expect(parsed.segments[0]).toEqual({
        id: 'primary:one',
        path: 'one',
        outlet: 'primary',
        params: {a: null},
        children: null
      });
    });
  });

  describe('cleanUrl', () => {
    
    it('should ignore clean URLs', () => {
      const cleaned = cleanUrl('something');

      expect(cleaned).toBe('something');
    });
    
    it('should remove leading "/"', () => {
      const cleaned = cleanUrl('/something');

      expect(cleaned).toBe('something');
    });
    
    it('should remove all leading "/" characters', () => {
      const cleaned = cleanUrl('///something');

      expect(cleaned).toBe('something');
    });
    
    it('should remove all empty parens', () => {
      const cleaned = cleanUrl('some()thing()');

      expect(cleaned).toBe('something');
    });
    
    it('should clean both at the same time', () => {
      const cleaned = cleanUrl('/something()');

      expect(cleaned).toBe('something');
    });
  });

  describe('parsePath', () => {
    it('should return self if no children', () => {
      const parsed = parsePath('');
      const parsed2 = parsePath('one/two');

      expect(parsed).toEqual({path: '', children: null});
      expect(parsed2).toEqual({path: 'one/two', children: null});
    });
    
    it('should ignore outlets and matrix params', () => {
      const parsed = parsePath('main:one/two;three=four');

      expect(parsed).toEqual({path: 'main:one/two;three=four', children: null});
    });

    it('should split children if they exist', () => {
      const parsed = parsePath('main:one/two(three/four)');
      
      expect(parsed).toEqual({path: 'main:one/two', children: 'three/four'});
    });

    it('should ignore nested children', () => {
      const parsed = parsePath('main:one/two(three/four(five/six))');
      
      expect(parsed).toEqual({path: 'main:one/two', children: 'three/four(five/six)'});
    });
  });

  describe('splitPath', () => {
    it('should return self for a simple URL', () => {
      const parsed = splitPath('one/two');

      expect(parsed).toEqual(['one/two']);
    });

    it('should split on double slash', () => {
      const parsed = splitPath('one/two//three/four');

      expect(parsed).toEqual(['one/two', 'three/four']);
    });

    it('should ignore double slashes within parens', () => {
      const parsed = splitPath('one/two//three/four/(five//six)');

      expect(parsed).toEqual(['one/two', 'three/four/(five//six)']);
    });

    it('should split after closed parens', () => {
      const parsed = splitPath('one/two//three/four/(five//six)//seven/eight');

      expect(parsed).toEqual(['one/two', 'three/four/(five//six)', 'seven/eight']);
    });

    // Breaking change from existing router. In this parser, "//" is the only way to make
    // siblings. In the old parser, "main(other)" was different than "main/(other)" but
    // only when not nested.
    it('should consider "/(" and "(" to be the same', () => {
      const parsed = splitPath('one/two/(three/four)');
      const parsed2 = splitPath('one/two(three/four)');

      expect(parsed).toEqual(['one/two/(three/four)']);
      expect(parsed2).toEqual(['one/two(three/four)']);
    });
  });

  describe('parseSegment', () => {

    it('should parse a simple segment', () => {
      const parsed = parseSegment('one/two');

      expect(parsed).toEqual({
        id: 'primary:one/two',
        path: 'one/two',
        outlet: 'primary',
        params: null,
        children: null
      });
    });

    it('should parse params from a segment', () => {
      const parsed = parseSegment('one/two;p1=one;p2=two');

      expect(parsed).toEqual({
        id: 'primary:one/two',
        path: 'one/two',
        outlet: PRIMARY_OUTLET,
        params: {p1: 'one', p2: 'two'},
        children: null
      });
    });

    it('should parse an outlet name', () => {
      const parsed = parseSegment('main:one/two');

      expect(parsed).toEqual({
        id: 'main:one/two',
        path: 'one/two',
        outlet: 'main',
        params: null,
        children: null
      });
    });

    it('should parse a child segment', () => {
      const parsed = parseSegment('one/two(three/four)');

      expect(parsed).toEqual({
        id: 'primary:one/two',
        path: 'one/two',
        outlet: 'primary',
        params: null,
        children: [{
          id: 'primary:three/four',
          path: 'three/four',
          outlet: 'primary',
          params: null,
          children: null
        }]
      });
    });

    it('should parse an empty segment', () => {
      const parsed = parseSegment('');
      const parsed2 = parseSegment();

      expect(parsed).toEqual(parsed2);
      expect(parsed).toEqual({
        id: 'primary:',
        path: '',
        outlet: 'primary',
        params: null,
        children: null
      });
    });
  });

  describe('parseOutlet', () => {
    it('should default to the primary outlet', () => {
      const parsed = parseOutlet('one/two');

      expect(parsed.name).toBe(PRIMARY_OUTLET);
      expect(parsed.path).toBe('one/two');
    });

    it('should parse an outlet name', () => {
      const parsed = parseOutlet('main:one/two');

      expect(parsed.name).toBe('main');
      expect(parsed.path).toBe('one/two');
    });

    it('should ignore colons other than the first one', () => {
      const parsed = parseOutlet('main:one/:two');

      expect(parsed.name).toBe('main');
      expect(parsed.path).toBe('one/:two');
    });
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
      expect(params).toEqual(null);
    });

    it('should handle multiple params of the same name into an array', () => {
      const params = parseAmpParams('a=foo&a=bar&a=swaz');
      expect(params).toEqual({a: ['foo', 'bar', 'swaz']});
      expect(params && params['a']).toEqual(['foo', 'bar', 'swaz']);
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
