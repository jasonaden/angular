"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var dom_adapter_1 = require("../../src/dom/dom_adapter");
var html_sanitizer_1 = require("../../src/security/html_sanitizer");
function main() {
    describe('HTML sanitizer', function () {
        var defaultDoc;
        var originalLog = null;
        var logMsgs;
        beforeEach(function () {
            defaultDoc = dom_adapter_1.getDOM().supportsDOMEvents() ? document : dom_adapter_1.getDOM().createHtmlDocument();
            logMsgs = [];
            originalLog = dom_adapter_1.getDOM().log; // Monkey patch DOM.log.
            dom_adapter_1.getDOM().log = function (msg) { return logMsgs.push(msg); };
        });
        afterEach(function () { dom_adapter_1.getDOM().log = originalLog; });
        it('serializes nested structures', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<div alt="x"><p>a</p>b<b>c<a alt="more">d</a></b>e</div>'))
                .toEqual('<div alt="x"><p>a</p>b<b>c<a alt="more">d</a></b>e</div>');
            expect(logMsgs).toEqual([]);
        });
        it('serializes self closing elements', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<p>Hello <br> World</p>'))
                .toEqual('<p>Hello <br> World</p>');
        });
        it('supports namespaced elements', function () { expect(html_sanitizer_1.sanitizeHtml(defaultDoc, 'a<my:hr/><my:div>b</my:div>c')).toEqual('abc'); });
        it('supports namespaced attributes', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<a xlink:href="something">t</a>'))
                .toEqual('<a xlink:href="something">t</a>');
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<a xlink:evil="something">t</a>')).toEqual('<a>t</a>');
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<a xlink:href="javascript:foo()">t</a>'))
                .toEqual('<a xlink:href="unsafe:javascript:foo()">t</a>');
        });
        it('supports HTML5 elements', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<main><summary>Works</summary></main>'))
                .toEqual('<main><summary>Works</summary></main>');
        });
        it('sanitizes srcset attributes', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<img srcset="/foo.png 400px, javascript:evil() 23px">'))
                .toEqual('<img srcset="/foo.png 400px, unsafe:javascript:evil() 23px">');
        });
        it('supports sanitizing plain text', function () { expect(html_sanitizer_1.sanitizeHtml(defaultDoc, 'Hello, World')).toEqual('Hello, World'); });
        it('ignores non-element, non-attribute nodes', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<!-- comments? -->no.')).toEqual('no.');
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<?pi nodes?>no.')).toEqual('no.');
            expect(logMsgs.join('\n')).toMatch(/sanitizing HTML stripped some content/);
        });
        it('supports sanitizing escaped entities', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '&#128640;')).toEqual('&#128640;');
            expect(logMsgs).toEqual([]);
        });
        it('does not warn when just re-encoding text', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<p>Hellö Wörld</p>'))
                .toEqual('<p>Hell&#246; W&#246;rld</p>');
            expect(logMsgs).toEqual([]);
        });
        it('escapes entities', function () {
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<p>Hello &lt; World</p>'))
                .toEqual('<p>Hello &lt; World</p>');
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<p>Hello < World</p>')).toEqual('<p>Hello &lt; World</p>');
            expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<p alt="% &amp; &quot; !">Hello</p>'))
                .toEqual('<p alt="% &amp; &#34; !">Hello</p>'); // NB: quote encoded as ASCII &#34;.
        });
        describe('should strip dangerous elements', function () {
            var dangerousTags = [
                'frameset', 'form', 'param', 'object', 'embed', 'textarea', 'input', 'button', 'option',
                'select', 'script', 'style', 'link', 'base', 'basefont'
            ];
            var _loop_1 = function (tag) {
                it("" + tag, function () { expect(html_sanitizer_1.sanitizeHtml(defaultDoc, "<" + tag + ">evil!</" + tag + ">")).toEqual('evil!'); });
            };
            for (var _i = 0, dangerousTags_1 = dangerousTags; _i < dangerousTags_1.length; _i++) {
                var tag = dangerousTags_1[_i];
                _loop_1(tag);
            }
            it("swallows frame entirely", function () {
                expect(html_sanitizer_1.sanitizeHtml(defaultDoc, "<frame>evil!</frame>")).not.toContain('<frame>');
            });
        });
        describe('should strip dangerous attributes', function () {
            var dangerousAttrs = ['id', 'name', 'style'];
            var _loop_2 = function (attr) {
                it("" + attr, function () {
                    expect(html_sanitizer_1.sanitizeHtml(defaultDoc, "<a " + attr + "=\"x\">evil!</a>")).toEqual('<a>evil!</a>');
                });
            };
            for (var _i = 0, dangerousAttrs_1 = dangerousAttrs; _i < dangerousAttrs_1.length; _i++) {
                var attr = dangerousAttrs_1[_i];
                _loop_2(attr);
            }
        });
        it('should not enter an infinite loop on clobbered elements', function () {
            // Some browsers are vulnerable to clobbered elements and will throw an expected exception
            // IE and EDGE does not seems to be affected by those cases
            // Anyway what we want to test is that browsers do not enter an infinite loop which would
            // result in a timeout error for the test.
            try {
                html_sanitizer_1.sanitizeHtml(defaultDoc, '<form><input name="parentNode" /></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
            try {
                html_sanitizer_1.sanitizeHtml(defaultDoc, '<form><input name="nextSibling" /></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
            try {
                html_sanitizer_1.sanitizeHtml(defaultDoc, '<form><div><div><input name="nextSibling" /></div></div></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
        });
        if (browser_util_1.browserDetection.isWebkit) {
            it('should prevent mXSS attacks', function () {
                expect(html_sanitizer_1.sanitizeHtml(defaultDoc, '<a href="&#x3000;javascript:alert(1)">CLICKME</a>'))
                    .toEqual('<a href="unsafe:javascript:alert(1)">CLICKME</a>');
            });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9zYW5pdGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC9zZWN1cml0eS9odG1sX3Nhbml0aXplcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUZBQW9GO0FBRXBGLHlEQUFpRDtBQUNqRCxvRUFBK0Q7QUFFL0Q7SUFDRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBSSxVQUFlLENBQUM7UUFDcEIsSUFBSSxXQUFXLEdBQXNCLElBQU0sQ0FBQztRQUM1QyxJQUFJLE9BQWlCLENBQUM7UUFFdEIsVUFBVSxDQUFDO1lBQ1QsVUFBVSxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLFFBQVEsR0FBRyxvQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNyRixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxHQUFHLG9CQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSx3QkFBd0I7WUFDckQsb0JBQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxVQUFDLEdBQUcsSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWpCLENBQWlCLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsY0FBUSxvQkFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUsMERBQTBELENBQUMsQ0FBQztpQkFDdkYsT0FBTyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUseUJBQXlCLENBQUMsQ0FBQztpQkFDdEQsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQzlCLGNBQVEsTUFBTSxDQUFDLDZCQUFZLENBQUMsVUFBVSxFQUFFLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsTUFBTSxDQUFDLDZCQUFZLENBQUMsVUFBVSxFQUFFLGlDQUFpQyxDQUFDLENBQUM7aUJBQzlELE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hGLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO2lCQUNyRSxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztpQkFDcEUsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsTUFBTSxDQUFDLDZCQUFZLENBQUMsVUFBVSxFQUFFLHVEQUF1RCxDQUFDLENBQUM7aUJBQ3BGLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUNoQyxjQUFRLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhGLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RSxNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNqRCxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JCLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO2lCQUN0RCxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsNkJBQVksQ0FBQyxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzVGLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO2lCQUNsRSxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFFLG9DQUFvQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRTtZQUMxQyxJQUFNLGFBQWEsR0FBRztnQkFDcEIsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRO2dCQUN2RixRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVU7YUFDeEQsQ0FBQztvQ0FFUyxHQUFHO2dCQUNaLEVBQUUsQ0FBQyxLQUFHLEdBQUssRUFDUixjQUFRLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxNQUFJLEdBQUcsZ0JBQVcsR0FBRyxNQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdGLENBQUM7WUFIRCxHQUFHLENBQUMsQ0FBYyxVQUFhLEVBQWIsK0JBQWEsRUFBYiwyQkFBYSxFQUFiLElBQWE7Z0JBQTFCLElBQU0sR0FBRyxzQkFBQTt3QkFBSCxHQUFHO2FBR2I7WUFFRCxFQUFFLENBQUMseUJBQXlCLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyw2QkFBWSxDQUFDLFVBQVUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1DQUFtQyxFQUFFO1lBQzVDLElBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztvQ0FFcEMsSUFBSTtnQkFDYixFQUFFLENBQUMsS0FBRyxJQUFNLEVBQUU7b0JBQ1osTUFBTSxDQUFDLDZCQUFZLENBQUMsVUFBVSxFQUFFLFFBQU0sSUFBSSxxQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUN2RixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7WUFKRCxHQUFHLENBQUMsQ0FBZSxVQUFjLEVBQWQsaUNBQWMsRUFBZCw0QkFBYyxFQUFkLElBQWM7Z0JBQTVCLElBQU0sSUFBSSx1QkFBQTt3QkFBSixJQUFJO2FBSWQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCwwRkFBMEY7WUFDMUYsMkRBQTJEO1lBQzNELHlGQUF5RjtZQUN6RiwwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDO2dCQUNILDZCQUFZLENBQUMsVUFBVSxFQUFFLDBDQUEwQyxDQUFDLENBQUM7WUFDdkUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gscURBQXFEO1lBQ3ZELENBQUM7WUFDRCxJQUFJLENBQUM7Z0JBQ0gsNkJBQVksQ0FBQyxVQUFVLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztZQUN4RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWCxxREFBcUQ7WUFDdkQsQ0FBQztZQUNELElBQUksQ0FBQztnQkFDSCw2QkFBWSxDQUFDLFVBQVUsRUFBRSxpRUFBaUUsQ0FBQyxDQUFDO1lBQzlGLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLHFEQUFxRDtZQUN2RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDaEMsTUFBTSxDQUFDLDZCQUFZLENBQUMsVUFBVSxFQUFFLG1EQUFtRCxDQUFDLENBQUM7cUJBQ2hGLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ25FLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWxJRCxvQkFrSUMifQ==