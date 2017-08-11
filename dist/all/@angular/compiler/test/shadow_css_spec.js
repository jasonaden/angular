"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shadow_css_1 = require("@angular/compiler/src/shadow_css");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
function main() {
    describe('ShadowCss', function () {
        function s(css, contentAttr, hostAttr) {
            if (hostAttr === void 0) { hostAttr = ''; }
            var shadowCss = new shadow_css_1.ShadowCss();
            var shim = shadowCss.shimCssText(css, contentAttr, hostAttr);
            var nlRegexp = /\n/g;
            return browser_util_1.normalizeCSS(shim.replace(nlRegexp, ''));
        }
        it('should handle empty string', function () { expect(s('', 'a')).toEqual(''); });
        it('should add an attribute to every rule', function () {
            var css = 'one {color: red;}two {color: red;}';
            var expected = 'one[a] {color:red;}two[a] {color:red;}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle invalid css', function () {
            var css = 'one {color: red;}garbage';
            var expected = 'one[a] {color:red;}garbage';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should add an attribute to every selector', function () {
            var css = 'one, two {color: red;}';
            var expected = 'one[a], two[a] {color:red;}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should support newlines in the selector and content ', function () {
            var css = 'one, \ntwo {\ncolor: red;}';
            var expected = 'one[a], two[a] {color:red;}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle media rules', function () {
            var css = '@media screen and (max-width:800px, max-height:100%) {div {font-size:50px;}}';
            var expected = '@media screen and (max-width:800px, max-height:100%) {div[a] {font-size:50px;}}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle page rules', function () {
            var css = '@page {div {font-size:50px;}}';
            var expected = '@page {div[a] {font-size:50px;}}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle document rules', function () {
            var css = '@document url(http://www.w3.org/) {div {font-size:50px;}}';
            var expected = '@document url(http://www.w3.org/) {div[a] {font-size:50px;}}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle media rules with simple rules', function () {
            var css = '@media screen and (max-width: 800px) {div {font-size: 50px;}} div {}';
            var expected = '@media screen and (max-width:800px) {div[a] {font-size:50px;}} div[a] {}';
            expect(s(css, 'a')).toEqual(expected);
        });
        it('should handle support rules', function () {
            var css = '@supports (display: flex) {section {display: flex;}}';
            var expected = '@supports (display:flex) {section[a] {display:flex;}}';
            expect(s(css, 'a')).toEqual(expected);
        });
        // Check that the browser supports unprefixed CSS animation
        it('should handle keyframes rules', function () {
            var css = '@keyframes foo {0% {transform:translate(-50%) scaleX(0);}}';
            expect(s(css, 'a')).toEqual(css);
        });
        it('should handle -webkit-keyframes rules', function () {
            var css = '@-webkit-keyframes foo {0% {-webkit-transform:translate(-50%) scaleX(0);}}';
            expect(s(css, 'a')).toEqual(css);
        });
        it('should handle complicated selectors', function () {
            expect(s('one::before {}', 'a')).toEqual('one[a]::before {}');
            expect(s('one two {}', 'a')).toEqual('one[a] two[a] {}');
            expect(s('one > two {}', 'a')).toEqual('one[a] > two[a] {}');
            expect(s('one + two {}', 'a')).toEqual('one[a] + two[a] {}');
            expect(s('one ~ two {}', 'a')).toEqual('one[a] ~ two[a] {}');
            var res = s('.one.two > three {}', 'a'); // IE swap classes
            expect(res == '.one.two[a] > three[a] {}' || res == '.two.one[a] > three[a] {}')
                .toEqual(true);
            expect(s('one[attr="value"] {}', 'a')).toEqual('one[attr="value"][a] {}');
            expect(s('one[attr=value] {}', 'a')).toEqual('one[attr="value"][a] {}');
            expect(s('one[attr^="value"] {}', 'a')).toEqual('one[attr^="value"][a] {}');
            expect(s('one[attr$="value"] {}', 'a')).toEqual('one[attr$="value"][a] {}');
            expect(s('one[attr*="value"] {}', 'a')).toEqual('one[attr*="value"][a] {}');
            expect(s('one[attr|="value"] {}', 'a')).toEqual('one[attr|="value"][a] {}');
            expect(s('one[attr~="value"] {}', 'a')).toEqual('one[attr~="value"][a] {}');
            expect(s('one[attr="va lue"] {}', 'a')).toEqual('one[attr="va lue"][a] {}');
            expect(s('one[attr] {}', 'a')).toEqual('one[attr][a] {}');
            expect(s('[is="one"] {}', 'a')).toEqual('[is="one"][a] {}');
        });
        describe((':host'), function () {
            it('should handle no context', function () { expect(s(':host {}', 'a', 'a-host')).toEqual('[a-host] {}'); });
            it('should handle tag selector', function () { expect(s(':host(ul) {}', 'a', 'a-host')).toEqual('ul[a-host] {}'); });
            it('should handle class selector', function () { expect(s(':host(.x) {}', 'a', 'a-host')).toEqual('.x[a-host] {}'); });
            it('should handle attribute selector', function () {
                expect(s(':host([a="b"]) {}', 'a', 'a-host')).toEqual('[a="b"][a-host] {}');
                expect(s(':host([a=b]) {}', 'a', 'a-host')).toEqual('[a="b"][a-host] {}');
            });
            it('should handle multiple tag selectors', function () {
                expect(s(':host(ul,li) {}', 'a', 'a-host')).toEqual('ul[a-host], li[a-host] {}');
                expect(s(':host(ul,li) > .z {}', 'a', 'a-host'))
                    .toEqual('ul[a-host] > .z[a], li[a-host] > .z[a] {}');
            });
            it('should handle multiple class selectors', function () {
                expect(s(':host(.x,.y) {}', 'a', 'a-host')).toEqual('.x[a-host], .y[a-host] {}');
                expect(s(':host(.x,.y) > .z {}', 'a', 'a-host'))
                    .toEqual('.x[a-host] > .z[a], .y[a-host] > .z[a] {}');
            });
            it('should handle multiple attribute selectors', function () {
                expect(s(':host([a="b"],[c=d]) {}', 'a', 'a-host'))
                    .toEqual('[a="b"][a-host], [c="d"][a-host] {}');
            });
            it('should handle pseudo selectors', function () {
                expect(s(':host(:before) {}', 'a', 'a-host')).toEqual('[a-host]:before {}');
                expect(s(':host:before {}', 'a', 'a-host')).toEqual('[a-host]:before {}');
                expect(s(':host:nth-child(8n+1) {}', 'a', 'a-host')).toEqual('[a-host]:nth-child(8n+1) {}');
                expect(s(':host:nth-of-type(8n+1) {}', 'a', 'a-host'))
                    .toEqual('[a-host]:nth-of-type(8n+1) {}');
                expect(s(':host(.class):before {}', 'a', 'a-host')).toEqual('.class[a-host]:before {}');
                expect(s(':host.class:before {}', 'a', 'a-host')).toEqual('.class[a-host]:before {}');
                expect(s(':host(:not(p)):before {}', 'a', 'a-host')).toEqual('[a-host]:not(p):before {}');
            });
        });
        describe((':host-context'), function () {
            it('should handle tag selector', function () {
                expect(s(':host-context(div) {}', 'a', 'a-host')).toEqual('div[a-host], div [a-host] {}');
                expect(s(':host-context(ul) > .y {}', 'a', 'a-host'))
                    .toEqual('ul[a-host] > .y[a], ul [a-host] > .y[a] {}');
            });
            it('should handle class selector', function () {
                expect(s(':host-context(.x) {}', 'a', 'a-host')).toEqual('.x[a-host], .x [a-host] {}');
                expect(s(':host-context(.x) > .y {}', 'a', 'a-host'))
                    .toEqual('.x[a-host] > .y[a], .x [a-host] > .y[a] {}');
            });
            it('should handle attribute selector', function () {
                expect(s(':host-context([a="b"]) {}', 'a', 'a-host'))
                    .toEqual('[a="b"][a-host], [a="b"] [a-host] {}');
                expect(s(':host-context([a=b]) {}', 'a', 'a-host'))
                    .toEqual('[a=b][a-host], [a="b"] [a-host] {}');
            });
        });
        it('should support polyfill-next-selector', function () {
            var css = s('polyfill-next-selector {content: \'x > y\'} z {}', 'a');
            expect(css).toEqual('x[a] > y[a]{}');
            css = s('polyfill-next-selector {content: "x > y"} z {}', 'a');
            expect(css).toEqual('x[a] > y[a]{}');
            css = s("polyfill-next-selector {content: 'button[priority=\"1\"]'} z {}", 'a');
            expect(css).toEqual('button[priority="1"][a]{}');
        });
        it('should support polyfill-unscoped-rule', function () {
            var css = s('polyfill-unscoped-rule {content: \'#menu > .bar\';color: blue;}', 'a');
            expect(css).toContain('#menu > .bar {;color:blue;}');
            css = s('polyfill-unscoped-rule {content: "#menu > .bar";color: blue;}', 'a');
            expect(css).toContain('#menu > .bar {;color:blue;}');
            css = s("polyfill-unscoped-rule {content: 'button[priority=\"1\"]'}", 'a');
            expect(css).toContain('button[priority="1"] {}');
        });
        it('should support multiple instances polyfill-unscoped-rule', function () {
            var css = s('polyfill-unscoped-rule {content: \'foo\';color: blue;}' +
                'polyfill-unscoped-rule {content: \'bar\';color: blue;}', 'a');
            expect(css).toContain('foo {;color:blue;}');
            expect(css).toContain('bar {;color:blue;}');
        });
        it('should support polyfill-rule', function () {
            var css = s('polyfill-rule {content: \':host.foo .bar\';color: blue;}', 'a', 'a-host');
            expect(css).toEqual('.foo[a-host] .bar[a] {;color:blue;}');
            css = s('polyfill-rule {content: ":host.foo .bar";color:blue;}', 'a', 'a-host');
            expect(css).toEqual('.foo[a-host] .bar[a] {;color:blue;}');
            css = s("polyfill-rule {content: 'button[priority=\"1\"]'}", 'a', 'a-host');
            expect(css).toEqual('button[priority="1"][a] {}');
        });
        it('should handle ::shadow', function () {
            var css = s('x::shadow > y {}', 'a');
            expect(css).toEqual('x[a] > y[a] {}');
        });
        it('should handle /deep/', function () {
            var css = s('x /deep/ y {}', 'a');
            expect(css).toEqual('x[a] y {}');
        });
        it('should handle >>>', function () {
            var css = s('x >>> y {}', 'a');
            expect(css).toEqual('x[a] y {}');
        });
        it('should handle ::ng-deep', function () {
            var css = '::ng-deep y {}';
            expect(s(css, 'a')).toEqual('y {}');
            css = 'x ::ng-deep y {}';
            expect(s(css, 'a')).toEqual('x[a] y {}');
            css = ':host > ::ng-deep .x {}';
            expect(s(css, 'a', 'h')).toEqual('[h] > .x {}');
            css = ':host ::ng-deep > .x {}';
            expect(s(css, 'a', 'h')).toEqual('[h] > .x {}');
            css = ':host > ::ng-deep > .x {}';
            expect(s(css, 'a', 'h')).toEqual('[h] > > .x {}');
        });
        it('should pass through @import directives', function () {
            var styleStr = '@import url("https://fonts.googleapis.com/css?family=Roboto");';
            var css = s(styleStr, 'a');
            expect(css).toEqual(styleStr);
        });
        it('should shim rules after @import', function () {
            var styleStr = '@import url("a"); div {}';
            var css = s(styleStr, 'a');
            expect(css).toEqual('@import url("a"); div[a] {}');
        });
        it('should leave calc() unchanged', function () {
            var styleStr = 'div {height:calc(100% - 55px);}';
            var css = s(styleStr, 'a');
            expect(css).toEqual('div[a] {height:calc(100% - 55px);}');
        });
        it('should strip comments', function () { expect(s('/* x */b {c}', 'a')).toEqual('b[a] {c}'); });
        it('should ignore special characters in comments', function () { expect(s('/* {;, */b {c}', 'a')).toEqual('b[a] {c}'); });
        it('should support multiline comments', function () { expect(s('/* \n */b {c}', 'a')).toEqual('b[a] {c}'); });
        it('should keep sourceMappingURL comments', function () {
            expect(s('b {c}/*# sourceMappingURL=data:x */', 'a'))
                .toEqual('b[a] {c}/*# sourceMappingURL=data:x */');
            expect(s('b {c}/* #sourceMappingURL=data:x */', 'a'))
                .toEqual('b[a] {c}/* #sourceMappingURL=data:x */');
        });
    });
    describe('processRules', function () {
        describe('parse rules', function () {
            function captureRules(input) {
                var result = [];
                shadow_css_1.processRules(input, function (cssRule) {
                    result.push(cssRule);
                    return cssRule;
                });
                return result;
            }
            it('should work with empty css', function () { expect(captureRules('')).toEqual([]); });
            it('should capture a rule without body', function () { expect(captureRules('a;')).toEqual([new shadow_css_1.CssRule('a', '')]); });
            it('should capture css rules with body', function () { expect(captureRules('a {b}')).toEqual([new shadow_css_1.CssRule('a', 'b')]); });
            it('should capture css rules with nested rules', function () {
                expect(captureRules('a {b {c}} d {e}')).toEqual([
                    new shadow_css_1.CssRule('a', 'b {c}'), new shadow_css_1.CssRule('d', 'e')
                ]);
            });
            it('should capture multiple rules where some have no body', function () {
                expect(captureRules('@import a ; b {c}')).toEqual([
                    new shadow_css_1.CssRule('@import a', ''), new shadow_css_1.CssRule('b', 'c')
                ]);
            });
        });
        describe('modify rules', function () {
            it('should allow to change the selector while preserving whitespaces', function () {
                expect(shadow_css_1.processRules('@import a; b {c {d}} e {f}', function (cssRule) { return new shadow_css_1.CssRule(cssRule.selector + '2', cssRule.content); }))
                    .toEqual('@import a2; b2 {c {d}} e2 {f}');
            });
            it('should allow to change the content', function () {
                expect(shadow_css_1.processRules('a {b}', function (cssRule) { return new shadow_css_1.CssRule(cssRule.selector, cssRule.content + '2'); }))
                    .toEqual('a {b2}');
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93X2Nzc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9zaGFkb3dfY3NzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0Y7QUFDbEYsbUZBQWdGO0FBRWhGO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUVwQixXQUFXLEdBQVcsRUFBRSxXQUFtQixFQUFFLFFBQXFCO1lBQXJCLHlCQUFBLEVBQUEsYUFBcUI7WUFDaEUsSUFBTSxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFFLENBQUM7WUFDbEMsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsY0FBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVFLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFNLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQztZQUNqRCxJQUFNLFFBQVEsR0FBRyx3Q0FBd0MsQ0FBQztZQUMxRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLEdBQUcsR0FBRywwQkFBMEIsQ0FBQztZQUN2QyxJQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztZQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQztZQUNyQyxJQUFNLFFBQVEsR0FBRyw2QkFBNkIsQ0FBQztZQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtZQUN6RCxJQUFNLEdBQUcsR0FBRyw0QkFBNEIsQ0FBQztZQUN6QyxJQUFNLFFBQVEsR0FBRyw2QkFBNkIsQ0FBQztZQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLEdBQUcsR0FBRyw4RUFBOEUsQ0FBQztZQUMzRixJQUFNLFFBQVEsR0FDVixpRkFBaUYsQ0FBQztZQUN0RixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtZQUM3QixJQUFNLEdBQUcsR0FBRywrQkFBK0IsQ0FBQztZQUM1QyxJQUFNLFFBQVEsR0FBRyxrQ0FBa0MsQ0FBQztZQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFNLEdBQUcsR0FBRywyREFBMkQsQ0FBQztZQUN4RSxJQUFNLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztZQUNoRixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLEdBQUcsR0FBRyxzRUFBc0UsQ0FBQztZQUNuRixJQUFNLFFBQVEsR0FBRywwRUFBMEUsQ0FBQztZQUM1RixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtZQUNoQyxJQUFNLEdBQUcsR0FBRyxzREFBc0QsQ0FBQztZQUNuRSxJQUFNLFFBQVEsR0FBRyx1REFBdUQsQ0FBQztZQUN6RSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILDJEQUEyRDtRQUMzRCxFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsSUFBTSxHQUFHLEdBQUcsNERBQTRELENBQUM7WUFDekUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxHQUFHLEdBQUcsNEVBQTRFLENBQUM7WUFDekYsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDN0QsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUUsa0JBQWtCO1lBQzlELE1BQU0sQ0FBQyxHQUFHLElBQUksMkJBQTJCLElBQUksR0FBRyxJQUFJLDJCQUEyQixDQUFDO2lCQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsQixFQUFFLENBQUMsMEJBQTBCLEVBQzFCLGNBQVEsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0UsRUFBRSxDQUFDLDRCQUE0QixFQUM1QixjQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpGLEVBQUUsQ0FBQyw4QkFBOEIsRUFDOUIsY0FBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqRixFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDNUUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7Z0JBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ2pGLE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUMzQyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDakYsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQzNDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO2dCQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDOUMsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQzVFLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7Z0JBQzVGLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNqRCxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFDeEYsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFDdEYsTUFBTSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUM1RixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDMUIsRUFBRSxDQUFDLDRCQUE0QixFQUFFO2dCQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2dCQUMxRixNQUFNLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDaEQsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7Z0JBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBRXZGLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNoRCxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2hELE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDOUMsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsa0RBQWtELEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVyQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxpRUFBK0QsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLGlFQUFpRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BGLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVyRCxHQUFHLEdBQUcsQ0FBQyxDQUFDLCtEQUErRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVyRCxHQUFHLEdBQUcsQ0FBQyxDQUFDLDREQUEwRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM3RCxJQUFNLEdBQUcsR0FDTCxDQUFDLENBQUMsd0RBQXdEO2dCQUNwRCx3REFBd0QsRUFDNUQsR0FBRyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBRTNELEdBQUcsR0FBRyxDQUFDLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUUzRCxHQUFHLEdBQUcsQ0FBQyxDQUFDLG1EQUFpRCxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUU7WUFDdEIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFDO1lBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztZQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QyxHQUFHLEdBQUcseUJBQXlCLENBQUM7WUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hELEdBQUcsR0FBRyx5QkFBeUIsQ0FBQztZQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEQsR0FBRyxHQUFHLDJCQUEyQixDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLFFBQVEsR0FBRyxnRUFBZ0UsQ0FBQztZQUNsRixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMsSUFBTSxRQUFRLEdBQUcsMEJBQTBCLENBQUM7WUFDNUMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsSUFBTSxRQUFRLEdBQUcsaUNBQWlDLENBQUM7WUFDbkQsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUJBQXVCLEVBQUUsY0FBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMsY0FBUSxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEUsRUFBRSxDQUFDLG1DQUFtQyxFQUNuQyxjQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkUsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMscUNBQXFDLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ2hELE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxDQUFDLENBQUMscUNBQXFDLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ2hELE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDdEIsc0JBQXNCLEtBQWE7Z0JBQ2pDLElBQU0sTUFBTSxHQUFjLEVBQUUsQ0FBQztnQkFDN0IseUJBQVksQ0FBQyxLQUFLLEVBQUUsVUFBQyxPQUFPO29CQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQixNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNqQixDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsY0FBUSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbEYsRUFBRSxDQUFDLG9DQUFvQyxFQUNwQyxjQUFRLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLG9CQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFFLEVBQUUsQ0FBQyxvQ0FBb0MsRUFDcEMsY0FBUSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxvQkFBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RSxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLE1BQU0sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDOUMsSUFBSSxvQkFBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLG9CQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztpQkFDakQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUU7Z0JBQzFELE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDaEQsSUFBSSxvQkFBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLG9CQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztpQkFDcEQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDdkIsRUFBRSxDQUFDLGtFQUFrRSxFQUFFO2dCQUNyRSxNQUFNLENBQUMseUJBQVksQ0FDUiw0QkFBNEIsRUFDNUIsVUFBQyxPQUFnQixJQUFLLE9BQUEsSUFBSSxvQkFBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQyxDQUFDO3FCQUNsRixPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLHlCQUFZLENBQ1IsT0FBTyxFQUNQLFVBQUMsT0FBZ0IsSUFBSyxPQUFBLElBQUksb0JBQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQXBELENBQW9ELENBQUMsQ0FBQztxQkFDbEYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE3VEQsb0JBNlRDIn0=