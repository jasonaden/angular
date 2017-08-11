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
var parse5 = require('parse5');
var platform_browser_1 = require("@angular/platform-browser");
var compiler_1 = require("@angular/compiler");
var treeAdapter;
var _attrToPropMap = {
    'class': 'className',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var mapProps = ['attribs', 'x-attribsNamespace', 'x-attribsPrefix'];
function _notImplemented(methodName) {
    return new Error('This method is not implemented in Parse5DomAdapter: ' + methodName);
}
function _getElement(el, name) {
    for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.name === name) {
            return node;
        }
    }
    return null;
}
/**
 * Parses a document string to a Document object.
 */
function parseDocument(html) {
    var doc = parse5.parse(html, { treeAdapter: parse5.treeAdapters.htmlparser2 });
    var docElement = _getElement(doc, 'html');
    doc['head'] = _getElement(docElement, 'head');
    doc['body'] = _getElement(docElement, 'body');
    doc['_window'] = {};
    return doc;
}
exports.parseDocument = parseDocument;
/* tslint:disable:requireParameterType */
/**
 * A `DomAdapter` powered by the `parse5` NodeJS module.
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
var Parse5DomAdapter = (function (_super) {
    __extends(Parse5DomAdapter, _super);
    function Parse5DomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parse5DomAdapter.makeCurrent = function () {
        treeAdapter = parse5.treeAdapters.htmlparser2;
        platform_browser_1.ɵsetRootDomAdapter(new Parse5DomAdapter());
    };
    Parse5DomAdapter.prototype.contains = function (nodeA, nodeB) {
        var inner = nodeB;
        while (inner) {
            if (inner === nodeA)
                return true;
            inner = inner.parent;
        }
        return false;
    };
    Parse5DomAdapter.prototype.hasProperty = function (element, name) {
        return _HTMLElementPropertyList.indexOf(name) > -1;
    };
    // TODO(tbosch): don't even call this method when we run the tests on server side
    // by not using the DomRenderer in tests. Keeping this for now to make tests happy...
    Parse5DomAdapter.prototype.setProperty = function (el, name, value) {
        if (name === 'innerHTML') {
            this.setInnerHTML(el, value);
        }
        else if (name === 'innerText') {
            this.setText(el, value);
        }
        else if (name === 'className') {
            el.attribs['class'] = el.className = value;
        }
        else {
            // Store the property in a separate property bag so that it doesn't clobber
            // actual parse5 properties on the Element.
            el.properties = el.properties || {};
            el.properties[name] = value;
        }
    };
    // TODO(tbosch): don't even call this method when we run the tests on server side
    // by not using the DomRenderer in tests. Keeping this for now to make tests happy...
    Parse5DomAdapter.prototype.getProperty = function (el, name) {
        return el.properties ? el.properties[name] : undefined;
    };
    Parse5DomAdapter.prototype.logError = function (error) { console.error(error); };
    // tslint:disable-next-line:no-console
    Parse5DomAdapter.prototype.log = function (error) { console.log(error); };
    Parse5DomAdapter.prototype.logGroup = function (error) { console.error(error); };
    Parse5DomAdapter.prototype.logGroupEnd = function () { };
    Object.defineProperty(Parse5DomAdapter.prototype, "attrToPropMap", {
        get: function () { return _attrToPropMap; },
        enumerable: true,
        configurable: true
    });
    Parse5DomAdapter.prototype.querySelector = function (el, selector) {
        return this.querySelectorAll(el, selector)[0] || null;
    };
    Parse5DomAdapter.prototype.querySelectorAll = function (el, selector) {
        var _this = this;
        var res = [];
        var _recursive = function (result, node, selector, matcher) {
            var cNodes = node.childNodes;
            if (cNodes && cNodes.length > 0) {
                for (var i = 0; i < cNodes.length; i++) {
                    var childNode = cNodes[i];
                    if (_this.elementMatches(childNode, selector, matcher)) {
                        result.push(childNode);
                    }
                    _recursive(result, childNode, selector, matcher);
                }
            }
        };
        var matcher = new compiler_1.SelectorMatcher();
        matcher.addSelectables(compiler_1.CssSelector.parse(selector));
        _recursive(res, el, selector, matcher);
        return res;
    };
    Parse5DomAdapter.prototype.elementMatches = function (node, selector, matcher) {
        if (matcher === void 0) { matcher = null; }
        if (this.isElementNode(node) && selector === '*') {
            return true;
        }
        var result = false;
        if (selector && selector.charAt(0) == '#') {
            result = this.getAttribute(node, 'id') == selector.substring(1);
        }
        else if (selector) {
            if (!matcher) {
                matcher = new compiler_1.SelectorMatcher();
                matcher.addSelectables(compiler_1.CssSelector.parse(selector));
            }
            var cssSelector = new compiler_1.CssSelector();
            cssSelector.setElement(this.tagName(node));
            if (node.attribs) {
                for (var attrName in node.attribs) {
                    cssSelector.addAttribute(attrName, node.attribs[attrName]);
                }
            }
            var classList = this.classList(node);
            for (var i = 0; i < classList.length; i++) {
                cssSelector.addClassName(classList[i]);
            }
            matcher.match(cssSelector, function (selector, cb) { result = true; });
        }
        return result;
    };
    Parse5DomAdapter.prototype.on = function (el, evt, listener) {
        var listenersMap = el._eventListenersMap;
        if (!listenersMap) {
            listenersMap = {};
            el._eventListenersMap = listenersMap;
        }
        var listeners = listenersMap[evt] || [];
        listenersMap[evt] = listeners.concat([listener]);
    };
    Parse5DomAdapter.prototype.onAndCancel = function (el, evt, listener) {
        this.on(el, evt, listener);
        return function () { remove((el._eventListenersMap[evt]), listener); };
    };
    Parse5DomAdapter.prototype.dispatchEvent = function (el, evt) {
        if (!evt.target) {
            evt.target = el;
        }
        if (el._eventListenersMap) {
            var listeners = el._eventListenersMap[evt.type];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](evt);
                }
            }
        }
        if (el.parent) {
            this.dispatchEvent(el.parent, evt);
        }
        if (el._window) {
            this.dispatchEvent(el._window, evt);
        }
    };
    Parse5DomAdapter.prototype.createMouseEvent = function (eventType) { return this.createEvent(eventType); };
    Parse5DomAdapter.prototype.createEvent = function (eventType) {
        var event = {
            type: eventType,
            defaultPrevented: false,
            preventDefault: function () { event.defaultPrevented = true; }
        };
        return event;
    };
    Parse5DomAdapter.prototype.preventDefault = function (event) { event.returnValue = false; };
    Parse5DomAdapter.prototype.isPrevented = function (event) { return event.returnValue != null && !event.returnValue; };
    Parse5DomAdapter.prototype.getInnerHTML = function (el) {
        return parse5.serialize(this.templateAwareRoot(el), { treeAdapter: treeAdapter });
    };
    Parse5DomAdapter.prototype.getTemplateContent = function (el) { return null; };
    Parse5DomAdapter.prototype.getOuterHTML = function (el) {
        var fragment = treeAdapter.createDocumentFragment();
        this.appendChild(fragment, el);
        return parse5.serialize(fragment, { treeAdapter: treeAdapter });
    };
    Parse5DomAdapter.prototype.nodeName = function (node) { return node.tagName; };
    Parse5DomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
    Parse5DomAdapter.prototype.type = function (node) { throw _notImplemented('type'); };
    Parse5DomAdapter.prototype.content = function (node) { return node.childNodes[0]; };
    Parse5DomAdapter.prototype.firstChild = function (el) { return el.firstChild; };
    Parse5DomAdapter.prototype.nextSibling = function (el) { return el.nextSibling; };
    Parse5DomAdapter.prototype.parentElement = function (el) { return el.parent; };
    Parse5DomAdapter.prototype.childNodes = function (el) { return el.childNodes; };
    Parse5DomAdapter.prototype.childNodesAsList = function (el) {
        var childNodes = el.childNodes;
        var res = new Array(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    Parse5DomAdapter.prototype.clearNodes = function (el) {
        while (el.childNodes.length > 0) {
            this.remove(el.childNodes[0]);
        }
    };
    Parse5DomAdapter.prototype.appendChild = function (el, node) {
        this.remove(node);
        treeAdapter.appendChild(this.templateAwareRoot(el), node);
    };
    Parse5DomAdapter.prototype.removeChild = function (el, node) {
        if (el.childNodes.indexOf(node) > -1) {
            this.remove(node);
        }
    };
    Parse5DomAdapter.prototype.remove = function (el) {
        var parent = el.parent;
        if (parent) {
            var index = parent.childNodes.indexOf(el);
            parent.childNodes.splice(index, 1);
        }
        var prev = el.previousSibling;
        var next = el.nextSibling;
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev;
        }
        el.prev = null;
        el.next = null;
        el.parent = null;
        return el;
    };
    Parse5DomAdapter.prototype.insertBefore = function (parent, ref, newNode) {
        this.remove(newNode);
        if (ref) {
            treeAdapter.insertBefore(parent, newNode, ref);
        }
        else {
            this.appendChild(parent, newNode);
        }
    };
    Parse5DomAdapter.prototype.insertAllBefore = function (parent, ref, nodes) {
        var _this = this;
        nodes.forEach(function (n) { return _this.insertBefore(parent, ref, n); });
    };
    Parse5DomAdapter.prototype.insertAfter = function (parent, ref, node) {
        if (ref.nextSibling) {
            this.insertBefore(parent, ref.nextSibling, node);
        }
        else {
            this.appendChild(parent, node);
        }
    };
    Parse5DomAdapter.prototype.setInnerHTML = function (el, value) {
        this.clearNodes(el);
        var content = parse5.parseFragment(value, { treeAdapter: treeAdapter });
        for (var i = 0; i < content.childNodes.length; i++) {
            treeAdapter.appendChild(el, content.childNodes[i]);
        }
    };
    Parse5DomAdapter.prototype.getText = function (el, isRecursive) {
        if (this.isTextNode(el)) {
            return el.data;
        }
        if (this.isCommentNode(el)) {
            // In the DOM, comments within an element return an empty string for textContent
            // However, comment node instances return the comment content for textContent getter
            return isRecursive ? '' : el.data;
        }
        if (!el.childNodes || el.childNodes.length == 0) {
            return '';
        }
        var textContent = '';
        for (var i = 0; i < el.childNodes.length; i++) {
            textContent += this.getText(el.childNodes[i], true);
        }
        return textContent;
    };
    Parse5DomAdapter.prototype.setText = function (el, value) {
        if (this.isTextNode(el) || this.isCommentNode(el)) {
            el.data = value;
        }
        else {
            this.clearNodes(el);
            if (value !== '')
                treeAdapter.insertText(el, value);
        }
    };
    Parse5DomAdapter.prototype.getValue = function (el) { return el.value; };
    Parse5DomAdapter.prototype.setValue = function (el, value) { el.value = value; };
    Parse5DomAdapter.prototype.getChecked = function (el) { return el.checked; };
    Parse5DomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
    Parse5DomAdapter.prototype.createComment = function (text) { return treeAdapter.createCommentNode(text); };
    Parse5DomAdapter.prototype.createTemplate = function (html) {
        var template = treeAdapter.createElement('template', 'http://www.w3.org/1999/xhtml', []);
        var content = parse5.parseFragment(html, { treeAdapter: treeAdapter });
        treeAdapter.setTemplateContent(template, content);
        return template;
    };
    Parse5DomAdapter.prototype.createElement = function (tagName) {
        return treeAdapter.createElement(tagName, 'http://www.w3.org/1999/xhtml', []);
    };
    Parse5DomAdapter.prototype.createElementNS = function (ns, tagName) {
        return treeAdapter.createElement(tagName, ns, []);
    };
    Parse5DomAdapter.prototype.createTextNode = function (text) {
        var t = this.createComment(text);
        t.type = 'text';
        return t;
    };
    Parse5DomAdapter.prototype.createScriptTag = function (attrName, attrValue) {
        return treeAdapter.createElement('script', 'http://www.w3.org/1999/xhtml', [{ name: attrName, value: attrValue }]);
    };
    Parse5DomAdapter.prototype.createStyleElement = function (css) {
        var style = this.createElement('style');
        this.setText(style, css);
        return style;
    };
    Parse5DomAdapter.prototype.createShadowRoot = function (el) {
        el.shadowRoot = treeAdapter.createDocumentFragment();
        el.shadowRoot.parent = el;
        return el.shadowRoot;
    };
    Parse5DomAdapter.prototype.getShadowRoot = function (el) { return el.shadowRoot; };
    Parse5DomAdapter.prototype.getHost = function (el) { return el.host; };
    Parse5DomAdapter.prototype.getDistributedNodes = function (el) { throw _notImplemented('getDistributedNodes'); };
    Parse5DomAdapter.prototype.clone = function (node) {
        var _recursive = function (node) {
            var nodeClone = Object.create(Object.getPrototypeOf(node));
            for (var prop in node) {
                var desc = Object.getOwnPropertyDescriptor(node, prop);
                if (desc && 'value' in desc && typeof desc.value !== 'object') {
                    nodeClone[prop] = node[prop];
                }
            }
            nodeClone.parent = null;
            nodeClone.prev = null;
            nodeClone.next = null;
            nodeClone.children = null;
            mapProps.forEach(function (mapName) {
                if (node[mapName] != null) {
                    nodeClone[mapName] = {};
                    for (var prop in node[mapName]) {
                        nodeClone[mapName][prop] = node[mapName][prop];
                    }
                }
            });
            var cNodes = node.children;
            if (cNodes) {
                var cNodesClone = new Array(cNodes.length);
                for (var i = 0; i < cNodes.length; i++) {
                    var childNode = cNodes[i];
                    var childNodeClone = _recursive(childNode);
                    cNodesClone[i] = childNodeClone;
                    if (i > 0) {
                        childNodeClone.prev = cNodesClone[i - 1];
                        cNodesClone[i - 1].next = childNodeClone;
                    }
                    childNodeClone.parent = nodeClone;
                }
                nodeClone.children = cNodesClone;
            }
            return nodeClone;
        };
        return _recursive(node);
    };
    Parse5DomAdapter.prototype.getElementsByClassName = function (element, name) {
        return this.querySelectorAll(element, '.' + name);
    };
    Parse5DomAdapter.prototype.getElementsByTagName = function (element, name) {
        return this.querySelectorAll(element, name);
    };
    Parse5DomAdapter.prototype.classList = function (element) {
        var classAttrValue = null;
        var attributes = element.attribs;
        if (attributes && attributes['class'] != null) {
            classAttrValue = attributes['class'];
        }
        return classAttrValue ? classAttrValue.trim().split(/\s+/g) : [];
    };
    Parse5DomAdapter.prototype.addClass = function (element, className) {
        var classList = this.classList(element);
        var index = classList.indexOf(className);
        if (index == -1) {
            classList.push(className);
            element.attribs['class'] = element.className = classList.join(' ');
        }
    };
    Parse5DomAdapter.prototype.removeClass = function (element, className) {
        var classList = this.classList(element);
        var index = classList.indexOf(className);
        if (index > -1) {
            classList.splice(index, 1);
            element.attribs['class'] = element.className = classList.join(' ');
        }
    };
    Parse5DomAdapter.prototype.hasClass = function (element, className) {
        return this.classList(element).indexOf(className) > -1;
    };
    Parse5DomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        var value = this.getStyle(element, styleName) || '';
        return styleValue ? value == styleValue : value.length > 0;
    };
    /** @internal */
    Parse5DomAdapter.prototype._readStyleAttribute = function (element) {
        var styleMap = {};
        var attributes = element.attribs;
        if (attributes && attributes['style'] != null) {
            var styleAttrValue = attributes['style'];
            var styleList = styleAttrValue.split(/;+/g);
            for (var i = 0; i < styleList.length; i++) {
                if (styleList[i].length > 0) {
                    var style = styleList[i];
                    var colon = style.indexOf(':');
                    if (colon === -1) {
                        throw new Error("Invalid CSS style: " + style);
                    }
                    styleMap[style.substr(0, colon).trim()] = style.substr(colon + 1).trim();
                }
            }
        }
        return styleMap;
    };
    /** @internal */
    Parse5DomAdapter.prototype._writeStyleAttribute = function (element, styleMap) {
        var styleAttrValue = '';
        for (var key in styleMap) {
            var newValue = styleMap[key];
            if (newValue) {
                styleAttrValue += key + ':' + styleMap[key] + ';';
            }
        }
        element.attribs['style'] = styleAttrValue;
    };
    Parse5DomAdapter.prototype.setStyle = function (element, styleName, styleValue) {
        var styleMap = this._readStyleAttribute(element);
        styleMap[styleName] = styleValue;
        this._writeStyleAttribute(element, styleMap);
    };
    Parse5DomAdapter.prototype.removeStyle = function (element, styleName) { this.setStyle(element, styleName, null); };
    Parse5DomAdapter.prototype.getStyle = function (element, styleName) {
        var styleMap = this._readStyleAttribute(element);
        return styleMap.hasOwnProperty(styleName) ? styleMap[styleName] : '';
    };
    Parse5DomAdapter.prototype.tagName = function (element) { return element.tagName == 'style' ? 'STYLE' : element.tagName; };
    Parse5DomAdapter.prototype.attributeMap = function (element) {
        var res = new Map();
        var elAttrs = treeAdapter.getAttrList(element);
        for (var i = 0; i < elAttrs.length; i++) {
            var attrib = elAttrs[i];
            res.set(attrib.name, attrib.value);
        }
        return res;
    };
    Parse5DomAdapter.prototype.hasAttribute = function (element, attribute) {
        return element.attribs && element.attribs[attribute] != null;
    };
    Parse5DomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) {
        return this.hasAttribute(element, attribute);
    };
    Parse5DomAdapter.prototype.getAttribute = function (element, attribute) {
        return this.hasAttribute(element, attribute) ? element.attribs[attribute] : null;
    };
    Parse5DomAdapter.prototype.getAttributeNS = function (element, ns, attribute) {
        return this.getAttribute(element, attribute);
    };
    Parse5DomAdapter.prototype.setAttribute = function (element, attribute, value) {
        if (attribute) {
            element.attribs[attribute] = value;
            if (attribute === 'class') {
                element.className = value;
            }
        }
    };
    Parse5DomAdapter.prototype.setAttributeNS = function (element, ns, attribute, value) {
        this.setAttribute(element, attribute, value);
    };
    Parse5DomAdapter.prototype.removeAttribute = function (element, attribute) {
        if (attribute) {
            delete element.attribs[attribute];
        }
    };
    Parse5DomAdapter.prototype.removeAttributeNS = function (element, ns, name) { throw 'not implemented'; };
    Parse5DomAdapter.prototype.templateAwareRoot = function (el) {
        return this.isTemplateElement(el) ? treeAdapter.getTemplateContent(el) : el;
    };
    Parse5DomAdapter.prototype.createHtmlDocument = function () {
        var newDoc = treeAdapter.createDocument();
        newDoc.title = 'fakeTitle';
        var head = treeAdapter.createElement('head', null, []);
        var body = treeAdapter.createElement('body', 'http://www.w3.org/1999/xhtml', []);
        this.appendChild(newDoc, head);
        this.appendChild(newDoc, body);
        newDoc['head'] = head;
        newDoc['body'] = body;
        newDoc['_window'] = {};
        return newDoc;
    };
    Parse5DomAdapter.prototype.getBoundingClientRect = function (el) { return { left: 0, top: 0, width: 0, height: 0 }; };
    Parse5DomAdapter.prototype.getTitle = function (doc) { return this.getText(this.getTitleNode(doc)) || ''; };
    Parse5DomAdapter.prototype.setTitle = function (doc, newTitle) {
        this.setText(this.getTitleNode(doc), newTitle || '');
    };
    Parse5DomAdapter.prototype.isTemplateElement = function (el) {
        return this.isElementNode(el) && this.tagName(el) === 'template';
    };
    Parse5DomAdapter.prototype.isTextNode = function (node) { return treeAdapter.isTextNode(node); };
    Parse5DomAdapter.prototype.isCommentNode = function (node) { return treeAdapter.isCommentNode(node); };
    Parse5DomAdapter.prototype.isElementNode = function (node) { return node ? treeAdapter.isElementNode(node) : false; };
    Parse5DomAdapter.prototype.hasShadowRoot = function (node) { return node.shadowRoot != null; };
    Parse5DomAdapter.prototype.isShadowRoot = function (node) { return this.getShadowRoot(node) == node; };
    Parse5DomAdapter.prototype.importIntoDoc = function (node) { return this.clone(node); };
    Parse5DomAdapter.prototype.adoptNode = function (node) { return node; };
    Parse5DomAdapter.prototype.getHref = function (el) { return this.getAttribute(el, 'href'); };
    Parse5DomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        if (href == null) {
            el.href = baseUrl;
        }
        else {
            el.href = baseUrl + '/../' + href;
        }
    };
    /** @internal */
    Parse5DomAdapter.prototype._buildRules = function (parsedRules, css) {
        var rules = [];
        for (var i = 0; i < parsedRules.length; i++) {
            var parsedRule = parsedRules[i];
            var rule = {};
            rule['cssText'] = css;
            rule['style'] = { content: '', cssText: '' };
            if (parsedRule.type == 'rule') {
                rule['type'] = 1;
                rule['selectorText'] =
                    parsedRule.selectors.join(', '.replace(/\s{2,}/g, ' ')
                        .replace(/\s*~\s*/g, ' ~ ')
                        .replace(/\s*\+\s*/g, ' + ')
                        .replace(/\s*>\s*/g, ' > ')
                        .replace(/\[(\w+)=(\w+)\]/g, '[$1="$2"]'));
                if (parsedRule.declarations == null) {
                    continue;
                }
                for (var j = 0; j < parsedRule.declarations.length; j++) {
                    var declaration = parsedRule.declarations[j];
                    rule['style'] = declaration.property[declaration.value];
                    rule['style'].cssText += declaration.property + ': ' + declaration.value + ';';
                }
            }
            else if (parsedRule.type == 'media') {
                rule['type'] = 4;
                rule['media'] = { mediaText: parsedRule.media };
                if (parsedRule.rules) {
                    rule['cssRules'] = this._buildRules(parsedRule.rules);
                }
            }
            rules.push(rule);
        }
        return rules;
    };
    Parse5DomAdapter.prototype.supportsDOMEvents = function () { return false; };
    Parse5DomAdapter.prototype.supportsNativeShadowDOM = function () { return false; };
    Parse5DomAdapter.prototype.getGlobalEventTarget = function (doc, target) {
        if (target == 'window') {
            return doc._window;
        }
        else if (target == 'document') {
            return doc;
        }
        else if (target == 'body') {
            return doc.body;
        }
    };
    Parse5DomAdapter.prototype.getBaseHref = function (doc) {
        var base = this.querySelector(doc, 'base');
        var href = '';
        if (base) {
            href = this.getHref(base);
        }
        // TODO(alxhub): Need relative path logic from BrowserDomAdapter here?
        return href == null ? null : href;
    };
    Parse5DomAdapter.prototype.resetBaseElement = function () { throw 'not implemented'; };
    Parse5DomAdapter.prototype.getHistory = function () { throw 'not implemented'; };
    Parse5DomAdapter.prototype.getLocation = function () { throw 'not implemented'; };
    Parse5DomAdapter.prototype.getUserAgent = function () { return 'Fake user agent'; };
    Parse5DomAdapter.prototype.getData = function (el, name) { return this.getAttribute(el, 'data-' + name); };
    Parse5DomAdapter.prototype.getComputedStyle = function (el) { throw 'not implemented'; };
    Parse5DomAdapter.prototype.setData = function (el, name, value) { this.setAttribute(el, 'data-' + name, value); };
    // TODO(tbosch): move this into a separate environment class once we have it
    Parse5DomAdapter.prototype.supportsWebAnimation = function () { return false; };
    Parse5DomAdapter.prototype.performanceNow = function () { return Date.now(); };
    Parse5DomAdapter.prototype.getAnimationPrefix = function () { return ''; };
    Parse5DomAdapter.prototype.getTransitionEnd = function () { return 'transitionend'; };
    Parse5DomAdapter.prototype.supportsAnimation = function () { return true; };
    Parse5DomAdapter.prototype.replaceChild = function (el, newNode, oldNode) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.parse = function (templateHtml) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.invoke = function (el, methodName, args) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.getEventKey = function (event) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.supportsCookies = function () { return false; };
    Parse5DomAdapter.prototype.getCookie = function (name) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.setCookie = function (name, value) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.animate = function (element, keyframes, options) { throw new Error('not implemented'); };
    Parse5DomAdapter.prototype.getTitleNode = function (doc) {
        var title = this.querySelector(doc, 'title');
        if (!title) {
            title = this.createElement('title');
            this.appendChild(this.querySelector(doc, 'head'), title);
        }
        return title;
    };
    return Parse5DomAdapter;
}(platform_browser_1.ɵDomAdapter));
exports.Parse5DomAdapter = Parse5DomAdapter;
// TODO: build a proper list, this one is all the keys of a HTMLInputElement
var _HTMLElementPropertyList = [
    'webkitEntries',
    'incremental',
    'webkitdirectory',
    'selectionDirection',
    'selectionEnd',
    'selectionStart',
    'labels',
    'validationMessage',
    'validity',
    'willValidate',
    'width',
    'valueAsNumber',
    'valueAsDate',
    'value',
    'useMap',
    'defaultValue',
    'type',
    'step',
    'src',
    'size',
    'required',
    'readOnly',
    'placeholder',
    'pattern',
    'name',
    'multiple',
    'min',
    'minLength',
    'maxLength',
    'max',
    'list',
    'indeterminate',
    'height',
    'formTarget',
    'formNoValidate',
    'formMethod',
    'formEnctype',
    'formAction',
    'files',
    'form',
    'disabled',
    'dirName',
    'checked',
    'defaultChecked',
    'autofocus',
    'autocomplete',
    'alt',
    'align',
    'accept',
    'onautocompleteerror',
    'onautocomplete',
    'onwaiting',
    'onvolumechange',
    'ontoggle',
    'ontimeupdate',
    'onsuspend',
    'onsubmit',
    'onstalled',
    'onshow',
    'onselect',
    'onseeking',
    'onseeked',
    'onscroll',
    'onresize',
    'onreset',
    'onratechange',
    'onprogress',
    'onplaying',
    'onplay',
    'onpause',
    'onmousewheel',
    'onmouseup',
    'onmouseover',
    'onmouseout',
    'onmousemove',
    'onmouseleave',
    'onmouseenter',
    'onmousedown',
    'onloadstart',
    'onloadedmetadata',
    'onloadeddata',
    'onload',
    'onkeyup',
    'onkeypress',
    'onkeydown',
    'oninvalid',
    'oninput',
    'onfocus',
    'onerror',
    'onended',
    'onemptied',
    'ondurationchange',
    'ondrop',
    'ondragstart',
    'ondragover',
    'ondragleave',
    'ondragenter',
    'ondragend',
    'ondrag',
    'ondblclick',
    'oncuechange',
    'oncontextmenu',
    'onclose',
    'onclick',
    'onchange',
    'oncanplaythrough',
    'oncanplay',
    'oncancel',
    'onblur',
    'onabort',
    'spellcheck',
    'isContentEditable',
    'contentEditable',
    'outerText',
    'innerText',
    'accessKey',
    'hidden',
    'webkitdropzone',
    'draggable',
    'tabIndex',
    'dir',
    'translate',
    'lang',
    'title',
    'childElementCount',
    'lastElementChild',
    'firstElementChild',
    'children',
    'onwebkitfullscreenerror',
    'onwebkitfullscreenchange',
    'nextElementSibling',
    'previousElementSibling',
    'onwheel',
    'onselectstart',
    'onsearch',
    'onpaste',
    'oncut',
    'oncopy',
    'onbeforepaste',
    'onbeforecut',
    'onbeforecopy',
    'shadowRoot',
    'dataset',
    'classList',
    'className',
    'outerHTML',
    'innerHTML',
    'scrollHeight',
    'scrollWidth',
    'scrollTop',
    'scrollLeft',
    'clientHeight',
    'clientWidth',
    'clientTop',
    'clientLeft',
    'offsetParent',
    'offsetHeight',
    'offsetWidth',
    'offsetTop',
    'offsetLeft',
    'localName',
    'prefix',
    'namespaceURI',
    'id',
    'style',
    'attributes',
    'tagName',
    'parentElement',
    'textContent',
    'baseURI',
    'ownerDocument',
    'nextSibling',
    'previousSibling',
    'lastChild',
    'firstChild',
    'childNodes',
    'parentNode',
    'nodeType',
    'nodeValue',
    'nodeName',
    'closure_lm_714617',
    '__jsaction',
];
function remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
        list.splice(index, 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2U1X2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3BhcnNlNV9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUdqQyw4REFBNkc7QUFDN0csOENBQStEO0FBRS9ELElBQUksV0FBZ0IsQ0FBQztBQUVyQixJQUFNLGNBQWMsR0FBNEI7SUFDOUMsT0FBTyxFQUFFLFdBQVc7SUFDcEIsV0FBVyxFQUFFLFdBQVc7SUFDeEIsVUFBVSxFQUFFLFVBQVU7SUFDdEIsVUFBVSxFQUFFLFVBQVU7Q0FDdkIsQ0FBQztBQUVGLElBQU0sUUFBUSxHQUFHLENBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFFdEUseUJBQXlCLFVBQWtCO0lBQ3pDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxzREFBc0QsR0FBRyxVQUFVLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRUQscUJBQXFCLEVBQU8sRUFBRSxJQUFZO0lBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsdUJBQThCLElB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