"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var url_search_params_1 = require("../src/url_search_params");
function main() {
    testing_internal_1.describe('URLSearchParams', function () {
        testing_internal_1.it('should conform to spec', function () {
            var paramsString = 'q=URLUtils.searchParams&topic=api';
            var searchParams = new url_search_params_1.URLSearchParams(paramsString);
            // Tests borrowed from example at
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            // Compliant with spec described at https://url.spec.whatwg.org/#urlsearchparams
            testing_internal_1.expect(searchParams.has('topic')).toBe(true);
            testing_internal_1.expect(searchParams.has('foo')).toBe(false);
            testing_internal_1.expect(searchParams.get('topic')).toEqual('api');
            testing_internal_1.expect(searchParams.getAll('topic')).toEqual(['api']);
            testing_internal_1.expect(searchParams.get('foo')).toBe(null);
            searchParams.append('topic', 'webdev');
            testing_internal_1.expect(searchParams.getAll('topic')).toEqual(['api', 'webdev']);
            testing_internal_1.expect(searchParams.toString()).toEqual('q=URLUtils.searchParams&topic=api&topic=webdev');
            searchParams.delete('topic');
            testing_internal_1.expect(searchParams.toString()).toEqual('q=URLUtils.searchParams');
            // Test default constructor
            testing_internal_1.expect(new url_search_params_1.URLSearchParams().toString()).toBe('');
        });
        testing_internal_1.it('should optionally accept a custom parser', function () {
            var fooEveryThingParser = {
                encodeKey: function () { return 'I AM KEY'; },
                encodeValue: function () { return 'I AM VALUE'; }
            };
            var params = new url_search_params_1.URLSearchParams('', fooEveryThingParser);
            params.set('myKey', 'myValue');
            testing_internal_1.expect(params.toString()).toBe('I AM KEY=I AM VALUE');
        });
        testing_internal_1.it('should encode special characters in params', function () {
            var searchParams = new url_search_params_1.URLSearchParams();
            searchParams.append('a', '1+1');
            searchParams.append('b c', '2');
            searchParams.append('d%', '3$');
            testing_internal_1.expect(searchParams.toString()).toEqual('a=1+1&b%20c=2&d%25=3$');
        });
        testing_internal_1.it('should not encode allowed characters', function () {
            /*
             * https://tools.ietf.org/html/rfc3986#section-3.4
             * Allowed: ( pchar / "/" / "?" )
             * pchar: unreserved / pct-encoded / sub-delims / ":" / "@"
             * unreserved: ALPHA / DIGIT / "-" / "." / "_" / "~"
             * pct-encoded: "%" HEXDIG HEXDIG
             * sub-delims: "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
             *
             * & and = are excluded and should be encoded inside keys and values
             * because URLSearchParams is responsible for inserting this.
             **/
            var params = new url_search_params_1.URLSearchParams();
            '! $ \' ( ) * + , ; A 9 - . _ ~ ? / ='.split(' ').forEach(function (char, idx) { params.set("a" + idx, char); });
            testing_internal_1.expect(params.toString())
                .toBe("a0=!&a1=$&a2='&a3=(&a4=)&a5=*&a6=+&a7=,&a8=;&a9=A&a10=9&a11=-&a12=.&a13=_&a14=~&a15=?&a16=/&a17=="
                .replace(/\s/g, ''));
            // Original example from https://github.com/angular/angular/issues/9348 for posterity
            params = new url_search_params_1.URLSearchParams();
            params.set('q', 'repo:janbaer/howcani+type:issue');
            params.set('sort', 'created');
            params.set('order', 'desc');
            params.set('page', '1');
            testing_internal_1.expect(params.toString())
                .toBe('q=repo:janbaer/howcani+type:issue&sort=created&order=desc&page=1');
        });
        testing_internal_1.it('should support map-like merging operation via setAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.setAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['4']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=4&c=8&b=7');
        });
        testing_internal_1.it('should support multimap-like merging operation via appendAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.appendAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['1', '2', '3', '4', '5', '6']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=1&a=2&a=3&a=4&a=5&a=6&c=8&b=7');
        });
        testing_internal_1.it('should support multimap-like merging operation via replaceAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.replaceAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['4', '5', '6']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=4&a=5&a=6&c=8&b=7');
        });
        testing_internal_1.it('should support a clone operation via clone()', function () {
            var fooQueryEncoder = {
                encodeKey: function (k) { return encodeURIComponent(k); },
                encodeValue: function (v) { return encodeURIComponent(v); }
            };
            var paramsA = new url_search_params_1.URLSearchParams('', fooQueryEncoder);
            paramsA.set('a', '2');
            paramsA.set('q', '4+');
            paramsA.set('c', '8');
            var paramsB = new url_search_params_1.URLSearchParams();
            paramsB.set('a', '2');
            paramsB.set('q', '4+');
            paramsB.set('c', '8');
            testing_internal_1.expect(paramsB.toString()).toEqual('a=2&q=4+&c=8');
            var paramsC = paramsA.clone();
            testing_internal_1.expect(paramsC.has('a')).toBe(true);
            testing_internal_1.expect(paramsC.has('b')).toBe(false);
            testing_internal_1.expect(paramsC.has('c')).toBe(true);
            testing_internal_1.expect(paramsC.toString()).toEqual('a=2&q=4%2B&c=8');
        });
        testing_internal_1.it('should remove the parameter when set to undefined or null', function () {
            var params = new url_search_params_1.URLSearchParams('q=Q');
            params.set('q', undefined);
            testing_internal_1.expect(params.has('q')).toBe(false);
            testing_internal_1.expect(params.toString()).toEqual('');
            params.set('q', null);
            testing_internal_1.expect(params.has('q')).toBe(false);
            testing_internal_1.expect(params.toString()).toEqual('');
        });
        testing_internal_1.it('should ignore the value when append undefined or null', function () {
            var params = new url_search_params_1.URLSearchParams('q=Q');
            params.append('q', undefined);
            testing_internal_1.expect(params.toString()).toEqual('q=Q');
            params.append('q', null);
            testing_internal_1.expect(params.toString()).toEqual('q=Q');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3NlYXJjaF9wYXJhbXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC91cmxfc2VhcmNoX3BhcmFtc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLDhEQUF5RDtBQUV6RDtJQUNFLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIscUJBQUUsQ0FBQyx3QkFBd0IsRUFBRTtZQUMzQixJQUFNLFlBQVksR0FBRyxtQ0FBbUMsQ0FBQztZQUN6RCxJQUFNLFlBQVksR0FBRyxJQUFJLG1DQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkQsaUNBQWlDO1lBQ2pDLG1FQUFtRTtZQUNuRSxnRkFBZ0Y7WUFDaEYseUJBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLHlCQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1Qyx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakQseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0RCx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkMseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9B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