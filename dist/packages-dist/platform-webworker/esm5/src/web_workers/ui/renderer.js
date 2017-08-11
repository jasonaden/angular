/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, RendererFactory2 } from '@angular/core';
import { MessageBus } from '../shared/message_bus';
import { EVENT_2_CHANNEL, RENDERER_2_CHANNEL } from '../shared/messaging_api';
import { RenderStore } from '../shared/render_store';
import { Serializer } from '../shared/serializer';
import { ServiceMessageBrokerFactory } from '../shared/service_message_broker';
import { EventDispatcher } from '../ui/event_dispatcher';
var MessageBasedRenderer2 = (function () {
    /**
     * @param {?} _brokerFactory
     * @param {?} _bus
     * @param {?} _serializer
     * @param {?} _renderStore
     * @param {?} _rendererFactory
     */
    function MessageBasedRenderer2(_brokerFactory, _bus, _serializer, _renderStore, _rendererFactory) {
        this._brokerFactory = _brokerFactory;
        this._bus = _bus;
        this._serializer = _serializer;
        this._renderStore = _renderStore;
        this._rendererFactory = _rendererFactory;
    }
    /**
     * @return {?}
     */
    MessageBasedRenderer2.prototype.start = function () {
        var _this = this;
        var /** @type {?} */ broker = this._brokerFactory.createMessageBroker(RENDERER_2_CHANNEL);
        this._bus.initChannel(EVENT_2_CHANNEL);
        this._eventDispatcher = new EventDispatcher(this._bus.to(EVENT_2_CHANNEL), this._serializer);
        var _a = [
            2 /* RENDER_STORE_OBJECT */,
            1 /* PRIMITIVE */,
            0 /* RENDERER_TYPE_2 */,
        ], RSO = _a[0], P = _a[1], CRT = _a[2];
        var /** @type {?} */ methods = [
            ['createRenderer', this.createRenderer, RSO, CRT, P],
            ['createElement', this.createElement, RSO, P, P, P],
            ['createComment', this.createComment, RSO, P, P], ['createText', this.createText, RSO, P, P],
            ['appendChild', this.appendChild, RSO, RSO, RSO],
            ['insertBefore', this.insertBefore, RSO, RSO, RSO, RSO],
            ['removeChild', this.removeChild, RSO, RSO, RSO],
            ['selectRootElement', this.selectRootElement, RSO, P, P],
            ['parentNode', this.parentNode, RSO, RSO, P], ['nextSibling', this.nextSibling, RSO, RSO, P],
            ['setAttribute', this.setAttribute, RSO, RSO, P, P, P],
            ['removeAttribute', this.removeAttribute, RSO, RSO, P, P],
            ['addClass', this.addClass, RSO, RSO, P], ['removeClass', this.removeClass, RSO, RSO, P],
            ['setStyle', this.setStyle, RSO, RSO, P, P, P],
            ['removeStyle', this.removeStyle, RSO, RSO, P, P],
            ['setProperty', this.setProperty, RSO, RSO, P, P], ['setValue', this.setValue, RSO, RSO, P],
            ['listen', this.listen, RSO, RSO, P, P, P], ['unlisten', this.unlisten, RSO, RSO],
            ['destroy', this.destroy, RSO], ['destroyNode', this.destroyNode, RSO, P]
        ];
        methods.forEach(function (_a) {
            var name = _a[0], method = _a[1], argTypes = _a.slice(2);
            broker.registerMethod(name, argTypes, method.bind(_this));
        });
    };
    /**
     * @param {?} r
     * @return {?}
     */
    MessageBasedRenderer2.prototype.destroy = function (r) { r.destroy(); };
    /**
     * @param {?} r
     * @param {?} node
     * @return {?}
     */
    MessageBasedRenderer2.prototype.destroyNode = function (r, node) {
        if (r.destroyNode) {
            r.destroyNode(node);
        }
        this._renderStore.remove(node);
    };
    /**
     * @param {?} el
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.createRenderer = function (el, type, id) {
        this._renderStore.store(this._rendererFactory.createRenderer(el, type), id);
    };
    /**
     * @param {?} r
     * @param {?} name
     * @param {?} namespace
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.createElement = function (r, name, namespace, id) {
        this._renderStore.store(r.createElement(name, namespace), id);
    };
    /**
     * @param {?} r
     * @param {?} value
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.createComment = function (r, value, id) {
        this._renderStore.store(r.createComment(value), id);
    };
    /**
     * @param {?} r
     * @param {?} value
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.createText = function (r, value, id) {
        this._renderStore.store(r.createText(value), id);
    };
    /**
     * @param {?} r
     * @param {?} parent
     * @param {?} child
     * @return {?}
     */
    MessageBasedRenderer2.prototype.appendChild = function (r, parent, child) { r.appendChild(parent, child); };
    /**
     * @param {?} r
     * @param {?} parent
     * @param {?} child
     * @param {?} ref
     * @return {?}
     */
    MessageBasedRenderer2.prototype.insertBefore = function (r, parent, child, ref) {
        r.insertBefore(parent, child, ref);
    };
    /**
     * @param {?} r
     * @param {?} parent
     * @param {?} child
     * @return {?}
     */
    MessageBasedRenderer2.prototype.removeChild = function (r, parent, child) { r.removeChild(parent, child); };
    /**
     * @param {?} r
     * @param {?} selector
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.selectRootElement = function (r, selector, id) {
        this._renderStore.store(r.selectRootElement(selector), id);
    };
    /**
     * @param {?} r
     * @param {?} node
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.parentNode = function (r, node, id) {
        this._renderStore.store(r.parentNode(node), id);
    };
    /**
     * @param {?} r
     * @param {?} node
     * @param {?} id
     * @return {?}
     */
    MessageBasedRenderer2.prototype.nextSibling = function (r, node, id) {
        this._renderStore.store(r.nextSibling(node), id);
    };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?} namespace
     * @return {?}
     */
    MessageBasedRenderer2.prototype.setAttribute = function (r, el, name, value, namespace) {
        r.setAttribute(el, name, value, namespace);
    };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} name
     * @param {?} namespace
     * @return {?}
     */
    MessageBasedRenderer2.prototype.removeAttribute = function (r, el, name, namespace) {
        r.removeAttribute(el, name, namespace);
    };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    MessageBasedRenderer2.prototype.addClass = function (r, el, name) { r.addClass(el, name); };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    MessageBasedRenderer2.prototype.removeClass = function (r, el, name) { r.removeClass(el, name); };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    MessageBasedRenderer2.prototype.setStyle = function (r, el, style, value, flags) {
        r.setStyle(el, style, value, flags);
    };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    MessageBasedRenderer2.prototype.removeStyle = function (r, el, style, flags) {
        r.removeStyle(el, style, flags);
    };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    MessageBasedRenderer2.prototype.setProperty = function (r, el, name, value) {
        r.setProperty(el, name, value);
    };
    /**
     * @param {?} r
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    MessageBasedRenderer2.prototype.setValue = function (r, node, value) { r.setValue(node, value); };
    /**
     * @param {?} r
     * @param {?} el
     * @param {?} elName
     * @param {?} eventName
     * @param {?} unlistenId
     * @return {?}
     */
    MessageBasedRenderer2.prototype.listen = function (r, el, elName, eventName, unlistenId) {
        var _this = this;
        var /** @type {?} */ listener = function (event) {
            return _this._eventDispatcher.dispatchRenderEvent(el, elName, eventName, event);
        };
        var /** @type {?} */ unlisten = r.listen(el || elName, eventName, listener);
        this._renderStore.store(unlisten, unlistenId);
    };
    /**
     * @param {?} r
     * @param {?} unlisten
     * @return {?}
     */
    MessageBasedRenderer2.prototype.unlisten = function (r, unlisten) { unlisten(); };
    return MessageBasedRenderer2;
}());
export { MessageBasedRenderer2 };
MessageBasedRenderer2.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MessageBasedRenderer2.ctorParameters = function () { return [
    { type: ServiceMessageBrokerFactory, },
    { type: MessageBus, },
    { type: Serializer, },
    { type: RenderStore, },
    { type: RendererFactory2, },
]; };
function MessageBasedRenderer2_tsickle_Closure_declarations() {
    /** @type {?} */
    MessageBasedRenderer2.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    MessageBasedRenderer2.ctorParameters;
    /** @type {?} */
    MessageBasedRenderer2.prototype._eventDispatcher;
    /** @type {?} */
    MessageBasedRenderer2.prototype._brokerFactory;
    /** @type {?} */
    MessageBasedRenderer2.prototype._bus;
    /** @type {?} */
    MessageBasedRenderer2.prototype._serializer;
    /** @type {?} */
    MessageBasedRenderer2.prototype._renderStore;
    /** @type {?} */
    MessageBasedRenderer2.prototype._rendererFactory;
}
//# sourceMappingURL=renderer.js.map