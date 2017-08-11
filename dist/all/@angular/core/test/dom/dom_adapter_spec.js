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
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
function main() {
    testing_internal_1.describe('dom adapter', function () {
        var defaultDoc;
        testing_internal_1.beforeEach(function () {
            defaultDoc = dom_adapter_1.getDOM().supportsDOMEvents() ? document : dom_adapter_1.getDOM().createHtmlDocument();
        });
        testing_internal_1.it('should not coalesque text nodes', function () {
            var el1 = browser_util_1.el('<div>a</div>');
            var el2 = browser_util_1.el('<div>b</div>');
            dom_adapter_1.getDOM().appendChild(el2, dom_adapter_1.getDOM().firstChild(el1));
            testing_internal_1.expect(dom_adapter_1.getDOM().childNodes(el2).length).toBe(2);
            var el2Clone = dom_adapter_1.getDOM().clone(el2);
            testing_internal_1.expect(dom_adapter_1.getDOM().childNodes(el2Clone).length).toBe(2);
        });
        testing_internal_1.it('should clone correctly', function () {
            var el1 = browser_util_1.el('<div x="y">a<span>b</span></div>');
            var clone = dom_adapter_1.getDOM().clone(el1);
            testing_internal_1.expect(clone).not.toBe(el1);
            dom_adapter_1.getDOM().setAttribute(clone, 'test', '1');
            testing_internal_1.expect(browser_util_1.stringifyElement(clone)).toEqual('<div test="1" x="y">a<span>b</span></div>');
            testing_internal_1.expect(dom_adapter_1.getDOM().getAttribute(el1, 'test')).toBeFalsy();
            var cNodes = dom_adapter_1.getDOM().childNodes(clone);
            var firstChild = cNodes[0];
            var secondChild = cNodes[1];
            testing_internal_1.expect(dom_adapter_1.getDOM().parentElement(firstChild)).toBe(clone);
            testing_internal_1.expect(dom_adapter_1.getDOM().nextSibling(firstChild)).toBe(secondChild);
            testing_internal_1.expect(dom_adapter_1.getDOM().isTextNode(firstChild)).toBe(true);
            testing_internal_1.expect(dom_adapter_1.getDOM().parentElement(secondChild)).toBe(clone);
            testing_internal_1.expect(dom_adapter_1.getDOM().nextSibling(secondChild)).toBeFalsy();
            testing_internal_1.expect(dom_adapter_1.getDOM().isElementNode(secondChild)).toBe(true);
        });
        testing_internal_1.it('should be able to create text nodes and use them with the other APIs', function () {
            var t = dom_adapter_1.getDOM().createTextNode('hello');
            testing_internal_1.expect(dom_adapter_1.getDOM().isTextNode(t)).toBe(true);
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().appendChild(d, t);
            testing_internal_1.expect(dom_adapter_1.getDOM().getInnerHTML(d)).toEqual('hello');
        });
        testing_internal_1.it('should set className via the class attribute', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setAttribute(d, 'class', 'class1');
            testing_internal_1.expect(d.className).toEqual('class1');
        });
        testing_internal_1.it('should allow to remove nodes without parents', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            testing_internal_1.expect(function () { return dom_adapter_1.getDOM().remove(d); }).not.toThrow();
        });
        testing_internal_1.it('should parse styles with urls correctly', function () {
            var d = dom_adapter_1.getDOM().createElement('div');
            dom_adapter_1.getDOM().setStyle(d, 'background-url', 'url(http://test.com/bg.jpg)');
            testing_internal_1.expect(dom_adapter_1.getDOM().getStyle(d, 'background-url')).toBe('url(http://test.com/bg.jpg)');
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.describe('getBaseHref', function () {
                testing_internal_1.beforeEach(function () { return dom_adapter_1.getDOM().resetBaseElement(); });
                testing_internal_1.it('should return null if base element is absent', function () { testing_internal_1.expect(dom_adapter_1.getDOM().getBaseHref(defaultDoc)).toBeNull(); });
                testing_internal_1.it('should return the value of the base element', function () {
                    var baseEl = dom_adapter_1.getDOM().createElement('base');
                    dom_adapter_1.getDOM().setAttribute(baseEl, 'href', '/drop/bass/connon/');
                    var headEl = defaultDoc.head;
                    dom_adapter_1.getDOM().appendChild(headEl, baseEl);
                    var baseHref = dom_adapter_1.getDOM().getBaseHref(defaultDoc);
                    dom_adapter_1.getDOM().removeChild(headEl, baseEl);
                    dom_adapter_1.getDOM().resetBaseElement();
                    testing_internal_1.expect(baseHref).toEqual('/drop/bass/connon/');
                });
                testing_internal_1.it('should return a relative url', function () {
                    var baseEl = dom_adapter_1.getDOM().createElement('base');
                    dom_adapter_1.getDOM().setAttribute(baseEl, 'href', 'base');
                    var headEl = defaultDoc.head;
                    dom_adapter_1.getDOM().appendChild(headEl, baseEl);
                    var baseHref = dom_adapter_1.getDOM().getBaseHref(defaultDoc);
                    dom_adapter_1.getDOM().removeChild(headEl, baseEl);
                    dom_adapter_1.getDOM().resetBaseElement();
                    testing_internal_1.expect(baseHref.endsWith('/base')).toBe(true);
                });
            });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2FkYXB0ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kb20vZG9tX2FkYXB0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUE0RjtBQUM1Riw2RUFBcUU7QUFDckUsbUZBQXdGO0FBRXhGO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBSSxVQUFlLENBQUM7UUFDcEIsNkJBQVUsQ0FBQztZQUNULFVBQVUsR0FBRyxvQkFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxRQUFRLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLGlDQUFpQyxFQUFFO1lBQ3BDLElBQU0sR0FBRyxHQUFHLGlCQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0IsSUFBTSxHQUFHLEdBQUcsaUJBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMvQixvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxvQkFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDcEQseUJBQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRCxJQUFNLFFBQVEsR0FBRyxvQkFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLHlCQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLHdC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