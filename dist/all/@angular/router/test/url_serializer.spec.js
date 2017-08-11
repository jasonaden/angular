"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../src/shared");
var url_tree_1 = require("../src/url_tree");
describe('url serializer', function () {
    var url = new url_tree_1.DefaultUrlSerializer();
    it('should parse the root url', function () {
        var tree = url.parse('/');
        expectSegment(tree.root, '');
        expect(url.serialize(tree)).toEqual('/');
    });
    it('should parse non-empty urls', function () {
        var tree = url.parse('one/two');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one/two');
        expect(url.serialize(tree)).toEqual('/one/two');
    });
    it('should parse multiple secondary segments', function () {
        var tree = url.parse('/one/two(left:three//right:four)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one/two');
        expectSegment(tree.root.children['left'], 'three');
        expectSegment(tree.root.children['right'], 'four');
        expect(url.serialize(tree)).toEqual('/one/two(left:three//right:four)');
    });
    it('should parse top-level nodes with only secondary segment', function () {
        var tree = url.parse('/(left:one)');
        expect(tree.root.numberOfChildren).toEqual(1);
        expectSegment(tree.root.children['left'], 'one');
        expect(url.serialize(tree)).toEqual('/(left:one)');
    });
    it('should parse nodes with only secondary segment', function () {
        var tree = url.parse('/one/(left:two)');
        var one = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(one, 'one', true);
        expect(one.numberOfChildren).toEqual(1);
        expectSegment(one.children['left'], 'two');
        expect(url.serialize(tree)).toEqual('/one/(left:two)');
    });
    it('should not parse empty path segments with params', function () {
        expect(function () { return url.parse('/one/two/(;a=1//right:;b=2)'); })
            .toThrowError(/Empty path url segment cannot have parameters/);
    });
    it('should parse scoped secondary segments', function () {
        var tree = url.parse('/one/(two//left:three)');
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, 'one', true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], 'two');
        expectSegment(primary.children['left'], 'three');
        expect(url.serialize(tree)).toEqual('/one/(two//left:three)');
    });
    it('should parse scoped secondary segments with unscoped ones', function () {
        var tree = url.parse('/one/(two//left:three)(right:four)');
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, 'one', true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], 'two');
        expectSegment(primary.children['left'], 'three');
        expectSegment(tree.root.children['right'], 'four');
        expect(url.serialize(tree)).toEqual('/one/(two//left:three)(right:four)');
    });
    it('should parse secondary segments that have children', function () {
        var tree = url.parse('/one(left:two/three)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one');
        expectSegment(tree.root.children['left'], 'two/three');
        expect(url.serialize(tree)).toEqual('/one(left:two/three)');
    });
    it('should parse an empty secondary segment group', function () {
        var tree = url.parse('/one()');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one');
        expect(url.serialize(tree)).toEqual('/one');
    });
    it('should parse key-value matrix params', function () {
        var tree = url.parse('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one;a=11a;b=11b');
        expectSegment(tree.root.children['left'], 'two;c=22');
        expectSegment(tree.root.children['right'], 'three;d=33');
        expect(url.serialize(tree)).toEqual('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');
    });
    it('should parse key only matrix params', function () {
        var tree = url.parse('/one;a');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one;a=');
        expect(url.serialize(tree)).toEqual('/one;a=');
    });
    it('should parse query params (root)', function () {
        var tree = url.parse('/?a=1&b=2');
        expect(tree.root.children).toEqual({});
        expect(tree.queryParams).toEqual({ a: '1', b: '2' });
        expect(url.serialize(tree)).toEqual('/?a=1&b=2');
    });
    it('should parse query params', function () {
        var tree = url.parse('/one?a=1&b=2');
        expect(tree.queryParams).toEqual({ a: '1', b: '2' });
    });
    it('should parse query params when with parenthesis', function () {
        var tree = url.parse('/one?a=(11)&b=(22)');
        expect(tree.queryParams).toEqual({ a: '(11)', b: '(22)' });
    });
    it('should parse query params when with slashes', function () {
        var tree = url.parse('/one?a=1/2&b=3/4');
        expect(tree.queryParams).toEqual({ a: '1/2', b: '3/4' });
    });
    it('should parse key only query params', function () {
        var tree = url.parse('/one?a');
        expect(tree.queryParams).toEqual({ a: '' });
    });
    it('should parse a value-empty query param', function () {
        var tree = url.parse('/one?a=');
        expect(tree.queryParams).toEqual({ a: '' });
    });
    it('should parse value-empty query params', function () {
        var tree = url.parse('/one?a=&b=');
        expect(tree.queryParams).toEqual({ a: '', b: '' });
    });
    it('should serializer query params', function () {
        var tree = url.parse('/one?a');
        expect(url.serialize(tree)).toEqual('/one?a=');
    });
    it('should handle multiple query params of the same name into an array', function () {
        var tree = url.parse('/one?a=foo&a=bar&a=swaz');
        expect(tree.queryParams).toEqual({ a: ['foo', 'bar', 'swaz'] });
        expect(tree.queryParamMap.get('a')).toEqual('foo');
        expect(tree.queryParamMap.getAll('a')).toEqual(['foo', 'bar', 'swaz']);
        expect(url.serialize(tree)).toEqual('/one?a=foo&a=bar&a=swaz');
    });
    it('should parse fragment', function () {
        var tree = url.parse('/one#two');
        expect(tree.fragment).toEqual('two');
        expect(url.serialize(tree)).toEqual('/one#two');
    });
    it('should parse fragment (root)', function () {
        var tree = url.parse('/#one');
        expectSegment(tree.root, '');
        expect(url.serialize(tree)).toEqual('/#one');
    });
    it('should parse empty fragment', function () {
        var tree = url.parse('/one#');
        expect(tree.fragment).toEqual('');
        expect(url.serialize(tree)).toEqual('/one#');
    });
    describe('encoding/decoding', function () {
        it('should encode/decode path segments and parameters', function () {
            var u = "/" + url_tree_1.encode("one two") + ";" + url_tree_1.encode("p 1") + "=" + url_tree_1.encode("v 1") + ";" + url_tree_1.encode("p 2") + "=" + url_tree_1.encode("v 2");
            var tree = url.parse(u);
            expect(tree.root.children[shared_1.PRIMARY_OUTLET].segments[0].path).toEqual('one two');
            expect(tree.root.children[shared_1.PRIMARY_OUTLET].segments[0].parameters)
                .toEqual((_a = {}, _a['p 1'] = 'v 1', _a['p 2'] = 'v 2', _a));
            expect(url.serialize(tree)).toEqual(u);
            var _a;
        });
        it('should encode/decode "slash" in path segments and parameters', function () {
            var u = "/" + url_tree_1.encode("one/two") + ";" + url_tree_1.encode("p/1") + "=" + url_tree_1.encode("v/1") + "/three";
            var tree = url.parse(u);
            var segment = tree.root.children[shared_1.PRIMARY_OUTLET].segments[0];
            expect(segment.path).toEqual('one/two');
            expect(segment.parameters).toEqual({ 'p/1': 'v/1' });
            expect(segment.parameterMap.get('p/1')).toEqual('v/1');
            expect(segment.parameterMap.getAll('p/1')).toEqual(['v/1']);
            expect(url.serialize(tree)).toEqual(u);
        });
        it('should encode/decode query params', function () {
            var u = "/one?" + url_tree_1.encode("p 1") + "=" + url_tree_1.encode("v 1") + "&" + url_tree_1.encode("p 2") + "=" + url_tree_1.encode("v 2");
            var tree = url.parse(u);
            expect(tree.queryParams).toEqual({ 'p 1': 'v 1', 'p 2': 'v 2' });
            expect(tree.queryParamMap.get('p 1')).toEqual('v 1');
            expect(tree.queryParamMap.get('p 2')).toEqual('v 2');
            expect(url.serialize(tree)).toEqual(u);
        });
        it('should encode query params leaving sub-delimiters intact', function () {
            var percentChars = '/?#[]&+= ';
            var percentCharsEncoded = '%2F%3F%23%5B%5D%26%2B%3D%20';
            var intactChars = '!$\'()*,;:';
            var params = percentChars + intactChars;
            var paramsEncoded = percentCharsEncoded + intactChars;
            var mixedCaseString = 'sTrInG';
            expect(percentCharsEncoded).toEqual(url_tree_1.encode(percentChars));
            expect(intactChars).toEqual(url_tree_1.encode(intactChars));
            // Verify it replaces repeated characters correctly
            expect(paramsEncoded + paramsEncoded).toEqual(url_tree_1.encode(params + params));
            // Verify it doesn't change the case of alpha characters
            expect(mixedCaseString + paramsEncoded).toEqual(url_tree_1.encode(mixedCaseString + params));
        });
        it('should encode/decode fragment', function () {
            var u = "/one#" + encodeURI("one two=three four");
            var tree = url.parse(u);
            expect(tree.fragment).toEqual('one two=three four');
            expect(url.serialize(tree)).toEqual(u);
        });
    });
    describe('error handling', function () {
        it('should throw when invalid characters inside children', function () {
            expect(function () { return url.parse('/one/(left#one)'); })
                .toThrowError('Cannot parse url \'/one/(left#one)\'');
        });
        it('should throw when missing closing )', function () {
            expect(function () { return url.parse('/one/(left'); }).toThrowError('Cannot parse url \'/one/(left\'');
        });
    });
});
function expectSegment(segment, expected, hasChildren) {
    if (hasChildren === void 0) { hasChildren = false; }
    if (segment.segments.filter(function (s) { return s.path === ''; }).length > 0) {
        throw new Error("UrlSegments cannot be empty " + segment.segments);
    }
    var p = segment.segments.map(function (p) { return url_tree_1.serializePath(p); }).join('/');
    expect(p).toEqual(expected);
    expect(Object.keys(segment.children).length > 0).toEqual(hasChildren);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3NlcmlhbGl6ZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L3VybF9zZXJpYWxpemVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx3Q0FBNkM7QUFDN0MsNENBQTZGO0FBRTdGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFNLEdBQUcsR0FBRyxJQUFJLCtCQUFvQixFQUFFLENBQUM7SUFFdkMsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQzlCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDaEMsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1FBQzdDLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUUzRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMs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