"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../dom/dom_adapter");
var generic_browser_adapter_1 = require("./generic_browser_adapter");
var _attrToPropMap = {
    'class': 'className',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var DOM_KEY_LOCATION_NUMPAD = 3;
// Map to convert some key or keyIdentifier values to what will be returned by getEventKey
var _keyMap = {
    // The following values are here for cross-browser compatibility and to match the W3C standard
    // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
    '\b': 'Backspace',
    '\t': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    'Del': 'Delete',
    'Esc': 'Escape',
    'Left': 'ArrowLeft',
    'Right': 'ArrowRight',
    'Up': 'ArrowUp',
    'Down': 'ArrowDown',
    'Menu': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'Win': 'OS'
};
// There is a bug in Chrome for numeric keypad keys:
// https://code.google.com/p/chromium/issues/detail?id=155654
// 1, 2, 3 ... are reported as A, B, C ...
var _chromeNumKeyPadMap = {
    'A': '1',
    'B': '2',
    'C': '3',
    'D': '4',
    'E': '5',
    'F': '6',
    'G': '7',
    'H': '8',
    'I': '9',
    'J': '*',
    'K': '+',
    'M': '-',
    'N': '.',
    'O': '/',
    '\x60': '0',
    '\x90': 'NumLock'
};
var nodeContains;
if (core_1.ɵglobal['Node']) {
    nodeContains = core_1.ɵglobal['Node'].prototype.contains || function (node) {
        return !!(this.compareDocumentPosition(node) & 16);
    };
}
/**
 * A `DomAdapter` powered by full browser DOM APIs.
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
/* tslint:disable:requireParameterType no-console */
var BrowserDomAdapter = (function (_super) {
    __extends(BrowserDomAdapter, _super);
    function BrowserDomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserDomAdapter.prototype.parse = function (templateHtml) { throw new Error('parse not implemented'); };
    BrowserDomAdapter.makeCurrent = function () { dom_adapter_1.setRootDomAdapter(new BrowserDomAdapter()); };
    BrowserDomAdapter.prototype.hasProperty = function (element, name) { return name in element; };
    BrowserDomAdapter.prototype.setProperty = function (el, name, value) { el[name] = value; };
    BrowserDomAdapter.prototype.getProperty = function (el, name) { return el[name]; };
    BrowserDomAdapter.prototype.invoke = function (el, methodName, args) {
        (_a = el)[methodName].apply(_a, args);
        var _a;
    };
    // TODO(tbosch): move this into a separate environment class once we have it
    BrowserDomAdapter.prototype.logError = function (error) {
        if (window.console) {
            if (console.error) {
                console.error(error);
            }
            else {
                console.log(error);
            }
        }
    };
    BrowserDomAdapter.prototype.log = function (error) {
        if (window.console) {
            window.console.log && window.console.log(error);
        }
    };
    BrowserDomAdapter.prototype.logGroup = function (error) {
        if (window.console) {
            window.console.group && window.console.group(error);
        }
    };
    BrowserDomAdapter.prototype.logGroupEnd = function () {
        if (window.console) {
            window.console.groupEnd && window.console.groupEnd();
        }
    };
    Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
        get: function () { return _attrToPropMap; },
        enumerable: true,
        configurable: true
    });
    BrowserDomAdapter.prototype.contains = function (nodeA, nodeB) { return nodeContains.call(nodeA, nodeB); };
    BrowserDomAdapter.prototype.querySelector = function (el, selector) { return el.querySelector(selector); };
    BrowserDomAdapter.prototype.querySelectorAll = function (el, selector) { return el.querySelectorAll(selector); };
    BrowserDomAdapter.prototype.on = function (el, evt, listener) { el.addEventListener(evt, listener, false); };
    BrowserDomAdapter.prototype.onAndCancel = function (el, evt, listener) {
        el.addEventListener(evt, listener, false);
        // Needed to follow Dart's subscription semantic, until fix of
        // https://code.google.com/p/dart/issues/detail?id=17406
        return function () { el.removeEventListener(evt, listener, false); };
    };
    BrowserDomAdapter.prototype.dispatchEvent = function (el, evt) { el.dispatchEvent(evt); };
    BrowserDomAdapter.prototype.createMouseEvent = function (eventType) {
        var evt = document.createEvent('MouseEvent');
        evt.initEvent(eventType, true, true);
        return evt;
    };
    BrowserDomAdapter.prototype.createEvent = function (eventType) {
        var evt = document.createEvent('Event');
        evt.initEvent(eventType, true, true);
        return evt;
    };
    BrowserDomAdapter.prototype.preventDefault = function (evt) {
        evt.preventDefault();
        evt.returnValue = false;
    };
    BrowserDomAdapter.prototype.isPrevented = function (evt) {
        return evt.defaultPrevented || evt.returnValue != null && !evt.returnValue;
    };
    BrowserDomAdapter.prototype.getInnerHTML = function (el) { return el.innerHTML; };
    BrowserDomAdapter.prototype.getTemplateContent = function (el) {
        return 'content' in el && el instanceof HTMLTemplateElement ? el.content : null;
    };
    BrowserDomAdapter.prototype.getOuterHTML = function (el) { return el.outerHTML; };
    BrowserDomAdapter.prototype.nodeName = function (node) { return node.nodeName; };
    BrowserDomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
    BrowserDomAdapter.prototype.type = function (node) { return node.type; };
    BrowserDomAdapter.prototype.content = function (node) {
        if (this.hasProperty(node, 'content')) {
            return node.content;
        }
        else {
            return node;
        }
    };
    BrowserDomAdapter.prototype.firstChild = function (el) { return el.firstChild; };
    BrowserDomAdapter.prototype.nextSibling = function (el) { return el.nextSibling; };
    BrowserDomAdapter.prototype.parentElement = function (el) { return el.parentNode; };
    BrowserDomAdapter.prototype.childNodes = function (el) { return el.childNodes; };
    BrowserDomAdapter.prototype.childNodesAsList = function (el) {
        var childNodes = el.childNodes;
        var res = new Array(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    BrowserDomAdapter.prototype.clearNodes = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };
    BrowserDomAdapter.prototype.appendChild = function (el, node) { el.appendChild(node); };
    BrowserDomAdapter.prototype.removeChild = function (el, node) { el.removeChild(node); };
    BrowserDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) { el.replaceChild(newChild, oldChild); };
    BrowserDomAdapter.prototype.remove = function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        return node;
    };
    BrowserDomAdapter.prototype.insertBefore = function (parent, ref, node) { parent.insertBefore(node, ref); };
    BrowserDomAdapter.prototype.insertAllBefore = function (parent, ref, nodes) {
        nodes.forEach(function (n) { return parent.insertBefore(n, ref); });
    };
    BrowserDomAdapter.prototype.insertAfter = function (parent, ref, node) { parent.insertBefore(node, ref.nextSibling); };
    BrowserDomAdapter.prototype.setInnerHTML = function (el, value) { el.innerHTML = value; };
    BrowserDomAdapter.prototype.getText = function (el) { return el.textContent; };
    BrowserDomAdapter.prototype.setText = function (el, value) { el.textContent = value; };
    BrowserDomAdapter.prototype.getValue = function (el) { return el.value; };
    BrowserDomAdapter.prototype.setValue = function (el, value) { el.value = value; };
    BrowserDomAdapter.prototype.getChecked = function (el) { return el.checked; };
    BrowserDomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
    BrowserDomAdapter.prototype.createComment = function (text) { return document.createComment(text); };
    BrowserDomAdapter.prototype.createTemplate = function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t;
    };
    BrowserDomAdapter.prototype.createElement = function (tagName, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createElement(tagName);
    };
    BrowserDomAdapter.prototype.createElementNS = function (ns, tagName, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createElementNS(ns, tagName);
    };
    BrowserDomAdapter.prototype.createTextNode = function (text, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createTextNode(text);
    };
    BrowserDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        if (doc === void 0) { doc = document; }
        var el = doc.createElement('SCRIPT');
        el.setAttribute(attrName, attrValue);
        return el;
    };
    BrowserDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        var style = doc.createElement('style');
        this.appendChild(style, this.createTextNode(css));
        return style;
    };
    BrowserDomAdapter.prototype.createShadowRoot = function (el) { return el.createShadowRoot(); };
    BrowserDomAdapter.prototype.getShadowRoot = function (el) { return el.shadowRoot; };
    BrowserDomAdapter.prototype.getHost = function (el) { return el.host; };
    BrowserDomAdapter.prototype.clone = function (node) { return node.cloneNode(true); };
    BrowserDomAdapter.prototype.getElementsByClassName = function (element, name) {
        return element.getElementsByClassName(name);
    };
    BrowserDomAdapter.prototype.getElementsByTagName = function (element, name) {
        return element.getElementsByTagName(name);
    };
    BrowserDomAdapter.prototype.classList = function (element) { return Array.prototype.slice.call(element.classList, 0); };
    BrowserDomAdapter.prototype.addClass = function (element, className) { element.classList.add(className); };
    BrowserDomAdapter.prototype.removeClass = function (element, className) { element.classList.remove(className); };
    BrowserDomAdapter.prototype.hasClass = function (element, className) {
        return element.classList.contains(className);
    };
    BrowserDomAdapter.prototype.setStyle = function (element, styleName, styleValue) {
        element.style[styleName] = styleValue;
    };
    BrowserDomAdapter.prototype.removeStyle = function (element, stylename) {
        // IE requires '' instead of null
        // see https://github.com/angular/angular/issues/7916
        element.style[stylename] = '';
    };
    BrowserDomAdapter.prototype.getStyle = function (element, stylename) { return element.style[stylename]; };
    BrowserDomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        var value = this.getStyle(element, styleName) || '';
        return styleValue ? value == styleValue : value.length > 0;
    };
    BrowserDomAdapter.prototype.tagName = function (element) { return element.tagName; };
    BrowserDomAdapter.prototype.attributeMap = function (element) {
        var res = new Map();
        var elAttrs = element.attributes;
        for (var i = 0; i < elAttrs.length; i++) {
            var attrib = elAttrs[i];
            res.set(attrib.name, attrib.value);
        }
        return res;
    };
    BrowserDomAdapter.prototype.hasAttribute = function (element, attribute) {
        return element.hasAttribute(attribute);
    };
    BrowserDomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) {
        return element.hasAttributeNS(ns, attribute);
    };
    BrowserDomAdapter.prototype.getAttribute = function (element, attribute) {
        return element.getAttribute(attribute);
    };
    BrowserDomAdapter.prototype.getAttributeNS = function (element, ns, name) {
        return element.getAttributeNS(ns, name);
    };
    BrowserDomAdapter.prototype.setAttribute = function (element, name, value) { element.setAttribute(name, value); };
    BrowserDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) {
        element.setAttributeNS(ns, name, value);
    };
    BrowserDomAdapter.prototype.removeAttribute = function (element, attribute) { element.removeAttribute(attribute); };
    BrowserDomAdapter.prototype.removeAttributeNS = function (element, ns, name) {
        element.removeAttributeNS(ns, name);
    };
    BrowserDomAdapter.prototype.templateAwareRoot = function (el) { return this.isTemplateElement(el) ? this.content(el) : el; };
    BrowserDomAdapter.prototype.createHtmlDocument = function () {
        return document.implementation.createHTMLDocument('fakeTitle');
    };
    BrowserDomAdapter.prototype.getBoundingClientRect = function (el) {
        try {
            return el.getBoundingClientRect();
        }
        catch (e) {
            return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
        }
    };
    BrowserDomAdapter.prototype.getTitle = function (doc) { return document.title; };
    BrowserDomAdapter.prototype.setTitle = function (doc, newTitle) { document.title = newTitle || ''; };
    BrowserDomAdapter.prototype.elementMatches = function (n, selector) {
        if (n instanceof HTMLElement) {
            return n.matches && n.matches(selector) ||
                n.msMatchesSelector && n.msMatchesSelector(selector) ||
                n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
        }
        return false;
    };
    BrowserDomAdapter.prototype.isTemplateElement = function (el) {
        return el instanceof HTMLElement && el.nodeName == 'TEMPLATE';
    };
    BrowserDomAdapter.prototype.isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
    BrowserDomAdapter.prototype.isCommentNode = function (node) { return node.nodeType === Node.COMMENT_NODE; };
    BrowserDomAdapter.prototype.isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
    BrowserDomAdapter.prototype.hasShadowRoot = function (node) {
        return node.shadowRoot != null && node instanceof HTMLElement;
    };
    BrowserDomAdapter.prototype.isShadowRoot = function (node) { return node instanceof DocumentFragment; };
    BrowserDomAdapter.prototype.importIntoDoc = function (node) { return document.importNode(this.templateAwareRoot(node), true); };
    BrowserDomAdapter.prototype.adoptNode = function (node) { return document.adoptNode(node); };
    BrowserDomAdapter.prototype.getHref = function (el) { return el.href; };
    BrowserDomAdapter.prototype.getEventKey = function (event) {
        var key = event.key;
        if (key == null) {
            key = event.keyIdentifier;
            // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
            // Safari cf
            // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
            if (key == null) {
                return 'Unidentified';
            }
            if (key.startsWith('U+')) {
                key = String.fromCharCode(parseInt(key.substring(2), 16));
                if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                    // There is a bug in Chrome for numeric keypad keys:
                    // https://code.google.com/p/chromium/issues/detail?id=155654
                    // 1, 2, 3 ... are reported as A, B, C ...
                    key = _chromeNumKeyPadMap[key];
                }
            }
        }
        return _keyMap[key] || key;
    };
    BrowserDomAdapter.prototype.getGlobalEventTarget = function (doc, target) {
        if (target === 'window') {
            return window;
        }
        if (target === 'document') {
            return document;
        }
        if (target === 'body') {
            return document.body;
        }
        return null;
    };
    BrowserDomAdapter.prototype.getHistory = function () { return window.history; };
    BrowserDomAdapter.prototype.getLocation = function () { return window.location; };
    BrowserDomAdapter.prototype.getBaseHref = function (doc) {
        var href = getBaseElementHref();
        return href == null ? null : relativePath(href);
    };
    BrowserDomAdapter.prototype.resetBaseElement = function () { baseElement = null; };
    BrowserDomAdapter.prototype.getUserAgent = function () { return window.navigator.userAgent; };
    BrowserDomAdapter.prototype.setData = function (element, name, value) {
        this.setAttribute(element, 'data-' + name, value);
    };
    BrowserDomAdapter.prototype.getData = function (element, name) {
        return this.getAttribute(element, 'data-' + name);
    };
    BrowserDomAdapter.prototype.getComputedStyle = function (element) { return getComputedStyle(element); };
    // TODO(tbosch): move this into a separate environment class once we have it
    BrowserDomAdapter.prototype.supportsWebAnimation = function () {
        return typeof Element.prototype['animate'] === 'function';
    };
    BrowserDomAdapter.prototype.performanceNow = function () {
        // performance.now() is not available in all browsers, see
        // http://caniuse.com/#search=performance.now
        return window.performance && window.performance.now ? window.performance.now() :
            new Date().getTime();
    };
    BrowserDomAdapter.prototype.supportsCookies = function () { return true; };
    BrowserDomAdapter.prototype.getCookie = function (name) { return common_1.ɵparseCookieValue(document.cookie, name); };
    BrowserDomAdapter.prototype.setCookie = function (name, value) {
        // document.cookie is magical, assigning into it assigns/overrides one cookie value, but does
        // not clear other cookies.
        document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    };
    return BrowserDomAdapter;
}(generic_browser_adapter_1.GenericBrowserDomAdapter));
exports.BrowserDomAdapter = BrowserDomAdapter;
var baseElement = null;
function getBaseElementHref() {
    if (!baseElement) {
        baseElement = document.querySelector('base');
        if (!baseElement) {
            return null;
        }
    }
    return baseElement.getAttribute('href');
}
// based on urlUtils.js in AngularJS 1
var urlParsingNode;
function relativePath(url) {
    if (!urlParsingNode) {
        urlParsingNode = document.createElement('a');
    }
    urlParsingNode.setAttribute('href', url);
    return (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname :
        '/' + urlParsingNode.pathname;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvYnJvd3Nlci9icm93c2VyX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsMENBQXNFO0FBQ3RFLHNDQUFnRDtBQUVoRCxrREFBcUQ7QUFFckQscUVBQW1FO0FBRW5FLElBQU0sY0FBYyxHQUFHO0lBQ3JCLE9BQU8sRUFBRSxXQUFXO0lBQ3BCLFdBQVcsRUFBRSxXQUFXO0lBQ3hCLFVBQVUsRUFBRSxVQUFVO0lBQ3RCLFVBQVUsRUFBRSxVQUFVO0NBQ3ZCLENBQUM7QUFFRixJQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQUVsQywwRkFBMEY7QUFDMUYsSUFBTSxPQUFPLEdBQTBCO0lBQ3JDLDhGQUE4RjtJQUM5RixrREFBa0Q7SUFDbEQsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLEtBQUs7SUFDWCxNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUUsUUFBUTtJQUNmLEtBQUssRUFBRSxRQUFRO0lBQ2YsTUFBTSxFQUFFLFdBQVc7SUFDbkIsT0FBTyxFQUFFLFlBQVk7SUFDckIsSUFBSSxFQUFFLFNBQVM7SUFDZixNQUFNLEVBQUUsV0FBVztJQUNuQixNQUFNLEVBQUUsYUFBYTtJQUNyQixRQUFRLEVBQUUsWUFBWTtJQUN0QixLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQyxJQUFNLG1CQUFtQixHQUFHO0lBQzFCLEdBQUcsRUFBRSxHQUFHO0lBQ1IsR0FBRyxFQUFFLEdBQUc7SUFDUixHQUFHLEVBQUUsR0FBRztJQUNSLEdBQUcsRUFBRSxHQUFHO0lBQ1IsR0FBRyxFQUFFLEdBQUc7SUFD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