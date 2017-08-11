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
var url_sanitizer_1 = require("../../src/security/url_sanitizer");
function main() {
    t.describe('URL sanitizer', function () {
        var logMsgs;
        var originalLog;
        t.beforeEach(function () {
            logMsgs = [];
            originalLog = dom_adapter_1.getDOM().log; // Monkey patch DOM.log.
            dom_adapter_1.getDOM().log = function (msg) { return logMsgs.push(msg); };
        });
        t.afterEach(function () { dom_adapter_1.getDOM().log = originalLog; });
        t.it('reports unsafe URLs', function () {
            t.expect(url_sanitizer_1.sanitizeUrl('javascript:evil()')).toBe('unsafe:javascript:evil()');
            t.expect(logMsgs.join('\n')).toMatch(/sanitizing unsafe URL value/);
        });
        t.describe('valid URLs', function () {
            var validUrls = [
                '',
                'http://abc',
                'HTTP://abc',
                'https://abc',
                'HTTPS://abc',
                'ftp://abc',
                'FTP://abc',
                'mailto:me@example.com',
                'MAILTO:me@example.com',
                'tel:123-123-1234',
                'TEL:123-123-1234',
                '#anchor',
                '/page1.md',
                'http://JavaScript/my.js',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:video/webm;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:audio/opus;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
            ];
            var _loop_1 = function (url) {
                t.it("valid " + url, function () { return t.expect(url_sanitizer_1.sanitizeUrl(url)).toEqual(url); });
            };
            for (var _i = 0, validUrls_1 = validUrls; _i < validUrls_1.length; _i++) {
                var url = validUrls_1[_i];
                _loop_1(url);
            }
        });
        t.describe('invalid URLs', function () {
            var invalidUrls = [
                'javascript:evil()',
                'JavaScript:abc',
                'evilNewProtocol:abc',
                ' \n Java\n Script:abc',
                '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#106&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#106 &#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058',
                '&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;',
                'jav&#x09;ascript:alert();',
                'jav\u0000ascript:alert();',
                'data:;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:text/javascript;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:application/x-msdownload;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
            ];
            var _loop_2 = function (url) {
                t.it("valid " + url, function () { return t.expect(url_sanitizer_1.sanitizeUrl(url)).toMatch(/^unsafe:/); });
            };
            for (var _i = 0, invalidUrls_1 = invalidUrls; _i < invalidUrls_1.length; _i++) {
                var url = invalidUrls_1[_i];
                _loop_2(url);
            }
        });
        t.describe('valid srcsets', function () {
            var validSrcsets = [
                '',
                'http://angular.io/images/test.png',
                'http://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io/images/test.png, http://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io/images/test.png 2x',
                'http://angular.io/images/test.png 2x, http://angular.io/images/test.png 3x',
                'http://angular.io/images/test.png 1.5x',
                'http://angular.io/images/test.png 1.25x',
                'http://angular.io/images/test.png 200w, http://angular.io/images/test.png 300w',
                'https://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io:80/images/test.png, http://angular.io:8080/images/test.png',
                'http://www.angular.io:80/images/test.png, http://www.angular.io:8080/images/test.png',
                'https://angular.io/images/test.png, https://angular.io/images/test.png',
                '//angular.io/images/test.png, //angular.io/images/test.png',
                '/images/test.png, /images/test.png',
                'images/test.png, images/test.png',
                'http://angular.io/images/test.png?12345, http://angular.io/images/test.png?12345',
                'http://angular.io/images/test.png?maxage, http://angular.io/images/test.png?maxage',
                'http://angular.io/images/test.png?maxage=234, http://angular.io/images/test.png?maxage=234',
            ];
            var _loop_3 = function (srcset) {
                t.it("valid " + srcset, function () { return t.expect(url_sanitizer_1.sanitizeSrcset(srcset)).toEqual(srcset); });
            };
            for (var _i = 0, validSrcsets_1 = validSrcsets; _i < validSrcsets_1.length; _i++) {
                var srcset = validSrcsets_1[_i];
                _loop_3(srcset);
            }
        });
        t.describe('invalid srcsets', function () {
            var invalidSrcsets = [
                'ht:tp://angular.io/images/test.png',
                'http://angular.io/images/test.png, ht:tp://angular.io/images/test.png',
            ];
            var _loop_4 = function (srcset) {
                t.it("valid " + srcset, function () { return t.expect(url_sanitizer_1.sanitizeSrcset(srcset)).toMatch(/unsafe:/); });
            };
            for (var _i = 0, invalidSrcsets_1 = invalidSrcsets; _i < invalidSrcsets_1.length; _i++) {
                var srcset = invalidSrcsets_1[_i];
                _loop_4(srcset);
            }
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Nhbml0aXplcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L3NlY3VyaXR5L3VybF9zYW5pdGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhEQUFnRTtBQUVoRSx5REFBaUQ7QUFDakQsa0VBQTZFO0FBRTdFO0lBQ0UsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDMUIsSUFBSSxPQUFpQixDQUFDO1FBQ3RCLElBQUksV0FBOEIsQ0FBQztRQUVuQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ1gsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsR0FBRyxvQkFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsd0JBQXdCO1lBQ3JELG9CQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsVUFBQyxHQUFHLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFqQixDQUFpQixDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFRLG9CQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUMxQixDQUFDLENBQUMsTUFBTSxDQUFDLDJCQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7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