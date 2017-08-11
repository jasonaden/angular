/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomElementSchemaRegistry } from '@angular/compiler';
import { Inject, Injectable, NgZone, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, ɵNAMESPACE_URIS as NAMESPACE_URIS, ɵSharedStylesHost as SharedStylesHost, ɵflattenStyles as flattenStyles, ɵgetDOM as getDOM, ɵshimContentAttribute as shimContentAttribute, ɵshimHostAttribute as shimHostAttribute } from '@angular/platform-browser';
var /** @type {?} */ EMPTY_ARRAY = [];
var ServerRendererFactory2 = (function () {
    /**
     * @param {?} ngZone
     * @param {?} document
     * @param {?} sharedStylesHost
     */
    function ServerRendererFactory2(ngZone, document, sharedStylesHost) {
        this.ngZone = ngZone;
        this.document = document;
        this.sharedStylesHost = sharedStylesHost;
        this.rendererByCompId = new Map();
        this.schema = new DomElementSchemaRegistry();
        this.defaultRenderer = new DefaultServerRenderer2(document, ngZone, this.schema);
    }
    ;
    /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    ServerRendererFactory2.prototype.createRenderer = function (element, type) {
        if (!element || !type) {
            return this.defaultRenderer;
        }
        switch (type.encapsulation) {
            case ViewEncapsulation.Native:
            case ViewEncapsulation.Emulated: {
                var /** @type {?} */ renderer = this.rendererByCompId.get(type.id);
                if (!renderer) {
                    renderer = new EmulatedEncapsulationServerRenderer2(this.document, this.ngZone, this.sharedStylesHost, this.schema, type);
                    this.rendererByCompId.set(type.id, renderer);
                }
                ((renderer)).applyToHost(element);
                return renderer;
            }
            case ViewEncapsulation.Native:
                throw new Error('Native encapsulation is not supported on the server!');
            default: {
                if (!this.rendererByCompId.has(type.id)) {
                    var /** @type {?} */ styles = flattenStyles(type.id, type.styles, []);
                    this.sharedStylesHost.addStyles(styles);
                    this.rendererByCompId.set(type.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
        }
    };
    /**
     * @return {?}
     */
    ServerRendererFactory2.prototype.begin = function () { };
    /**
     * @return {?}
     */
    ServerRendererFactory2.prototype.end = function () { };
    return ServerRendererFactory2;
}());
export { ServerRendererFactory2 };
ServerRendererFactory2.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServerRendererFactory2.ctorParameters = function () { return [
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: SharedStylesHost, },
]; };
function ServerRendererFactory2_tsickle_Closure_declarations() {
    /** @type {?} */
    ServerRendererFactory2.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ServerRendererFactory2.ctorParameters;
    /** @type {?} */
    ServerRendererFactory2.prototype.rendererByCompId;
    /** @type {?} */
    ServerRendererFactory2.prototype.defaultRenderer;
    /** @type {?} */
    ServerRendererFactory2.prototype.schema;
    /** @type {?} */
    ServerRendererFactory2.prototype.ngZone;
    /** @type {?} */
    ServerRendererFactory2.prototype.document;
    /** @type {?} */
    ServerRendererFactory2.prototype.sharedStylesHost;
}
var DefaultServerRenderer2 = (function () {
    /**
     * @param {?} document
     * @param {?} ngZone
     * @param {?} schema
     */
    function DefaultServerRenderer2(document, ngZone, schema) {
        this.document = document;
        this.ngZone = ngZone;
        this.schema = schema;
        this.data = Object.create(null);
    }
    /**
     * @return {?}
     */
    DefaultServerRenderer2.prototype.destroy = function () { };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createElement = function (name, namespace, debugInfo) {
        if (namespace) {
            return getDOM().createElementNS(NAMESPACE_URIS[namespace], name);
        }
        return getDOM().createElement(name);
    };
    /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createComment = function (value, debugInfo) { return getDOM().createComment(value); };
    /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createText = function (value, debugInfo) { return getDOM().createTextNode(value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.appendChild = function (parent, newChild) { getDOM().appendChild(parent, newChild); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        if (parent) {
            getDOM().insertBefore(parent, refChild, newChild);
        }
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeChild = function (parent, oldChild) {
        if (parent) {
            getDOM().removeChild(parent, oldChild);
        }
    };
    /**
     * @param {?} selectorOrNode
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
        var /** @type {?} */ el;
        if (typeof selectorOrNode === 'string') {
            el = getDOM().querySelector(this.document, selectorOrNode);
            if (!el) {
                throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
            }
        }
        else {
            el = selectorOrNode;
        }
        getDOM().clearNodes(el);
        return el;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultServerRenderer2.prototype.parentNode = function (node) { return getDOM().parentElement(node); };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultServerRenderer2.prototype.nextSibling = function (node) { return getDOM().nextSibling(node); };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        if (namespace) {
            getDOM().setAttributeNS(el, NAMESPACE_URIS[namespace], namespace + ':' + name, value);
        }
        else {
            getDOM().setAttribute(el, name, value);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        if (namespace) {
            getDOM().removeAttributeNS(el, NAMESPACE_URIS[namespace], name);
        }
        else {
            getDOM().removeAttribute(el, name);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultServerRenderer2.prototype.addClass = function (el, name) { getDOM().addClass(el, name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeClass = function (el, name) { getDOM().removeClass(el, name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setStyle = function (el, style, value, flags) {
        getDOM().setStyle(el, style, value);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeStyle = function (el, style, flags) {
        getDOM().removeStyle(el, style);
    };
    /**
     * @param {?} tagName
     * @param {?} propertyName
     * @return {?}
     */
    DefaultServerRenderer2.prototype._isSafeToReflectProperty = function (tagName, propertyName) {
        return this.schema.securityContext(tagName, propertyName, true) ===
            this.schema.securityContext(tagName, propertyName, false);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setProperty = function (el, name, value) {
        checkNoSyntheticProp(name, 'property');
        getDOM().setProperty(el, name, value);
        // Mirror property values for known HTML element properties in the attributes.
        var /** @type {?} */ tagName = ((el.tagName)).toLowerCase();
        if (value != null && (typeof value === 'number' || typeof value == 'string') &&
            this.schema.hasElement(tagName, EMPTY_ARRAY) &&
            this.schema.hasProperty(tagName, name, EMPTY_ARRAY) &&
            this._isSafeToReflectProperty(tagName, name)) {
            this.setAttribute(el, name, value.toString());
        }
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setValue = function (node, value) { getDOM().setText(node, value); };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    DefaultServerRenderer2.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        // Note: We are not using the EventsPlugin here as this is not needed
        // to run our tests.
        checkNoSyntheticProp(eventName, 'listener');
        var /** @type {?} */ el = typeof target === 'string' ? getDOM().getGlobalEventTarget(this.document, target) : target;
        var /** @type {?} */ outsideHandler = function (event) { return _this.ngZone.runGuarded(function () { return callback(event); }); };
        return this.ngZone.runOutsideAngular(function () { /** @type {?} */ return (getDOM().onAndCancel(el, eventName, outsideHandler)); });
    };
    return DefaultServerRenderer2;
}());
function DefaultServerRenderer2_tsickle_Closure_declarations() {
    /** @type {?} */
    DefaultServerRenderer2.prototype.data;
    /** @type {?} */
    DefaultServerRenderer2.prototype.destroyNode;
    /** @type {?} */
    DefaultServerRenderer2.prototype.document;
    /** @type {?} */
    DefaultServerRenderer2.prototype.ngZone;
    /** @type {?} */
    DefaultServerRenderer2.prototype.schema;
}
var /** @type {?} */ AT_CHARCODE = '@'.charCodeAt(0);
/**
 * @param {?} name
 * @param {?} nameKind
 * @return {?}
 */
function checkNoSyntheticProp(name, nameKind) {
    if (name.charCodeAt(0) === AT_CHARCODE) {
        throw new Error("Found the synthetic " + nameKind + " " + name + ". Please include either \"BrowserAnimationsModule\" or \"NoopAnimationsModule\" in your application.");
    }
}
var EmulatedEncapsulationServerRenderer2 = (function (_super) {
    tslib_1.__extends(EmulatedEncapsulationServerRenderer2, _super);
    /**
     * @param {?} document
     * @param {?} ngZone
     * @param {?} sharedStylesHost
     * @param {?} schema
     * @param {?} component
     */
    function EmulatedEncapsulationServerRenderer2(document, ngZone, sharedStylesHost, schema, component) {
        var _this = _super.call(this, document, ngZone, schema) || this;
        _this.component = component;
        var /** @type {?} */ styles = flattenStyles(component.id, component.styles, []);
        sharedStylesHost.addStyles(styles);
        _this.contentAttr = shimContentAttribute(component.id);
        _this.hostAttr = shimHostAttribute(component.id);
        return _this;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    EmulatedEncapsulationServerRenderer2.prototype.applyToHost = function (element) { _super.prototype.setAttribute.call(this, element, this.hostAttr, ''); };
    /**
     * @param {?} parent
     * @param {?} name
     * @return {?}
     */
    EmulatedEncapsulationServerRenderer2.prototype.createElement = function (parent, name) {
        var /** @type {?} */ el = _super.prototype.createElement.call(this, parent, name);
        _super.prototype.setAttribute.call(this, el, this.contentAttr, '');
        return el;
    };
    return EmulatedEncapsulationServerRenderer2;
}(DefaultServerRenderer2));
function EmulatedEncapsulationServerRenderer2_tsickle_Closure_declarations() {
    /** @type {?} */
    EmulatedEncapsulationServerRenderer2.prototype.contentAttr;
    /** @type {?} */
    EmulatedEncapsulationServerRenderer2.prototype.hostAttr;
    /** @type {?} */
    EmulatedEncapsulationServerRenderer2.prototype.component;
}
//# sourceMappingURL=server_renderer.js.map