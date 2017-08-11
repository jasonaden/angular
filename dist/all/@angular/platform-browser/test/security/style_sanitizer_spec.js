"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("../../src/dom/dom_adapter");
var style_sanitizer_1 = require("../../src/security/style_sanitizer");
function main() {
    t.describe('Style sanitizer', function () {
        var logMsgs;
        var originalLog;
        t.beforeEach(function () {
            logMsgs = [];
            originalLog = dom_adapter_1.getDOM().log; // Monkey patch DOM.log.
            dom_adapter_1.getDOM().log = function (msg) { return logMsgs.push(msg); };
        });
        t.afterEach(function () { dom_adapter_1.getDOM().log = originalLog; });
        function expectSanitize(v) { return t.expect(style_sanitizer_1.sanitizeStyle(v)); }
        t.it('sanitizes values', function () {
            expectSanitize('').toEqual('');
            expectSanitize('abc').toEqual('abc');
            expectSanitize('50px').toEqual('50px');
            expectSanitize('rgb(255, 0, 0)').toEqual('rgb(255, 0, 0)');
            expectSanitize('expression(haha)').toEqual('unsafe');
        });
        t.it('rejects unblanaced quotes', function () { expectSanitize('"value" "').toEqual('unsafe'); });
        t.it('accepts transform functions', function () {
            expectSanitize('rotate(90deg)').toEqual('rotate(90deg)');
            expectSanitize('rotate(javascript:evil())').toEqual('unsafe');
            expectSanitize('translateX(12px, -5px)').toEqual('translateX(12px, -5px)');
            expectSanitize('scale3d(1, 1, 2)').toEqual('scale3d(1, 1, 2)');
        });
        t.it('accepts gradients', function () {
            expectSanitize('linear-gradient(to bottom, #fg34a1, #bada55)')
                .toEqual('linear-gradient(to bottom, #fg34a1, #bada55)');
            expectSanitize('repeating-radial-gradient(ellipse cover, black, red, black, red)')
                .toEqual('repeating-radial-gradient(ellipse cover, black, red, black, red)');
        });
        t.it('accepts calc', function () { expectSanitize('calc(90%-123px)').toEqual('calc(90%-123px)'); });
        t.it('accepts attr', function () {
            expectSanitize('attr(value string)').toEqual('attr(value string)');
        });
        t.it('sanitizes URLs', function () {
            expectSanitize('url(foo/bar.png)').toEqual('url(foo/bar.png)');
            expectSanitize('url( foo/bar.png\n )').toEqual('url( foo/bar.png\n )');
            expectSanitize('url(javascript:evil())').toEqual('unsafe');
            expectSanitize('url(strangeprotocol:evil)').toEqual('unsafe');
        });
        t.it('accepts quoted URLs', function () {
            expectSanitize('url("foo/bar.png")').toEqual('url("foo/bar.png")');
            expectSanitize("url('foo/bar.png')").toEqual("url('foo/bar.png')");
            expectSanitize("url(  'foo/bar.png'\n )").toEqual("url(  'foo/bar.png'\n )");
            expectSanitize('url("javascript:evil()")').toEqual('unsafe');
            expectSanitize('url( " javascript:evil() " )').toEqual('unsafe');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfc2FuaXRpemVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3Qvc2VjdXJpdHkvc3R5bGVfc2FuaXRpemVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4REFBZ0U7QUFFaEUseURBQWlEO0FBQ2pELHNFQUFpRTtBQUVqRTtJQUNFLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDNUIsSUFBSSxPQUFpQixDQUFDO1FBQ3RCLElBQUksV0FBOEIsQ0FBQztRQUVuQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ1gsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsR0FBRyxvQkFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsd0JBQXdCO1lBQ3JELG9CQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsVUFBQyxHQUFHLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFqQixDQUFpQixDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFRLG9CQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsd0JBQXdCLENBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQywrQkFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpFLENBQUMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUU7WUFDdkIsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLGNBQWMsQ0FBQyxNQUFNLENB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