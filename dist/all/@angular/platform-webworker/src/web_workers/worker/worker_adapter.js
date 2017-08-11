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
var platform_browser_1 = require("@angular/platform-browser");
/**
 * This adapter is required to log error messages.
 *
 * Note: other methods all throw as the DOM is not accessible directly in web worker context.
 */
var WorkerDomAdapter = (function (_super) {
    __extends(WorkerDomAdapter, _super);
    function WorkerDomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkerDomAdapter.makeCurrent = function () { platform_browser_1.ɵsetRootDomAdapter(new WorkerDomAdapter()); };
    WorkerDomAdapter.prototype.logError = function (error) {
        if (console.error) {
            console.error(error);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    };
    // tslint:disable-next-line:no-console
    WorkerDomAdapter.prototype.log = function (error) { console.log(error); };
    WorkerDomAdapter.prototype.logGroup = function (error) {
        if (console.group) {
            console.group(error);
            this.logError(error);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    };
    WorkerDomAdapter.prototype.logGroupEnd = function () {
        if (console.groupEnd) {
            console.groupEnd();
        }
    };
    WorkerDomAdapter.prototype.contains = function (nodeA, nodeB) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasProperty = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setProperty = function (el, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getProperty = function (el, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.invoke = function (el, methodName, args) { throw 'not implemented'; };
    Object.defineProperty(WorkerDomAdapter.prototype, "attrToPropMap", {
        get: function () { throw 'not implemented'; },
        set: function (value) { throw 'not implemented'; },
        enumerable: true,
        configurable: true
    });
    WorkerDomAdapter.prototype.parse = function (templateHtml) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.querySelector = function (el, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.querySelectorAll = function (el, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.on = function (el, evt, listener) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.onAndCancel = function (el, evt, listener) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.dispatchEvent = function (el, evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createMouseEvent = function (eventType) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createEvent = function (eventType) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.preventDefault = function (evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isPrevented = function (evt) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getInnerHTML = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTemplateContent = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getOuterHTML = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nodeName = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nodeValue = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.type = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.content = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.firstChild = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.nextSibling = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.parentElement = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.childNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.childNodesAsList = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.clearNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.appendChild = function (el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeChild = function (el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.replaceChild = function (el, newNode, oldNode) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.remove = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertBefore = function (parent, el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertAllBefore = function (parent, el, nodes) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.insertAfter = function (parent, el, node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setInnerHTML = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getText = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setText = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getValue = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setValue = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getChecked = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setChecked = function (el, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createComment = function (text) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createTemplate = function (html) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createElement = function (tagName, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createElementNS = function (ns, tagName, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createTextNode = function (text, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        throw 'not implemented';
    };
    WorkerDomAdapter.prototype.createStyleElement = function (css, doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createShadowRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getShadowRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHost = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getDistributedNodes = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.clone = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getElementsByClassName = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getElementsByTagName = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.classList = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.addClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasClass = function (element, className) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setStyle = function (element, styleName, styleValue) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeStyle = function (element, styleName) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getStyle = function (element, styleName) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        throw 'not implemented';
    };
    WorkerDomAdapter.prototype.tagName = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.attributeMap = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setAttribute = function (element, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeAttribute = function (element, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.removeAttributeNS = function (element, ns, attribute) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.templateAwareRoot = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.createHtmlDocument = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getBoundingClientRect = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTitle = function (doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setTitle = function (doc, newTitle) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.elementMatches = function (n, selector) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isTemplateElement = function (el) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isTextNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isCommentNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isElementNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.hasShadowRoot = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.isShadowRoot = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.importIntoDoc = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.adoptNode = function (node) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHref = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getEventKey = function (event) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.resolveAndSetHref = function (element, baseUrl, href) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsDOMEvents = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsNativeShadowDOM = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getGlobalEventTarget = function (doc, target) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getHistory = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getLocation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getBaseHref = function (doc) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.resetBaseElement = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getUserAgent = function () { return 'Fake user agent'; };
    WorkerDomAdapter.prototype.setData = function (element, name, value) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getComputedStyle = function (element) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getData = function (element, name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.performanceNow = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getAnimationPrefix = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.getTransitionEnd = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsAnimation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsWebAnimation = function () { throw 'not implemented'; };
    WorkerDomAdapter.prototype.supportsCookies = function () { return false; };
    WorkerDomAdapter.prototype.getCookie = function (name) { throw 'not implemented'; };
    WorkerDomAdapter.prototype.setCookie = function (name, value) { throw 'not implemented'; };
    return WorkerDomAdapter;
}(platform_browser_1.ɵDomAdapter));
exports.WorkerDomAdapter = WorkerDomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci93b3JrZXJfYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4REFBNkc7QUFFN0c7Ozs7R0FJRztBQUNIO0lBQXNDLG9DQUFVO0lBQWhEOztJQXNKQSxDQUFDO0lBckpRLDRCQUFXLEdBQWxCLGNBQXVCLHFDQUFpQixDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRSxtQ0FBUSxHQUFSLFVBQVMsS0FBVTtRQUNqQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLHNDQUFzQztZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLDhCQUFHLEdBQUgsVUFBSSxLQUFVLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkMsbUNBQVEsR0FBUixVQUFTLEtBQVU7UUFDakIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLHNDQUFzQztZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFD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