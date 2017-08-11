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
import { Injectable } from '@angular/core';
import { ClientMessageBrokerFactory, FnArg, UiArguments } from '../shared/client_message_broker';
import { MessageBus } from '../shared/message_bus';
import { EVENT_2_CHANNEL, RENDERER_2_CHANNEL } from '../shared/messaging_api';
import { RenderStore } from '../shared/render_store';
import { Serializer } from '../shared/serializer';
var NamedEventEmitter = (function () {
    function NamedEventEmitter() {
    }
    /**
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    NamedEventEmitter.prototype.listen = function (eventName, callback) { this._getListeners(eventName).push(callback); };
    /**
     * @param {?} eventName
     * @param {?} listener
     * @return {?}
     */
    NamedEventEmitter.prototype.unlisten = function (eventName, listener) {
        var /** @type {?} */ listeners = this._getListeners(eventName);
        var /** @type {?} */ index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
    /**
     * @param {?} eventName
     * @param {?} event
     * @return {?}
     */
    NamedEventEmitter.prototype.dispatchEvent = function (eventName, event) {
        var /** @type {?} */ listeners = this._getListeners(eventName);
        for (var /** @type {?} */ i = 0; i < listeners.length; i++) {
            listeners[i](event);
        }
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    NamedEventEmitter.prototype._getListeners = function (eventName) {
        if (!this._listeners) {
            this._listeners = new Map();
        }
        var /** @type {?} */ listeners = this._listeners.get(eventName);
        if (!listeners) {
            listeners = [];
            this._listeners.set(eventName, listeners);
        }
        return listeners;
    };
    return NamedEventEmitter;
}());
export { NamedEventEmitter };
function NamedEventEmitter_tsickle_Closure_declarations() {
    /** @type {?} */
    NamedEventEmitter.prototype._listeners;
}
/**
 * @param {?} target
 * @param {?} eventName
 * @return {?}
 */
function eventNameWithTarget(target, eventName) {
    return target + ":" + eventName;
}
var WebWorkerRendererFactory2 = (function () {
    /**
     * @param {?} messageBrokerFactory
     * @param {?} bus
     * @param {?} _serializer
     * @param {?} renderStore
     */
    function WebWorkerRendererFactory2(messageBrokerFactory, bus, _serializer, renderStore) {
        var _this = this;
        this._serializer = _serializer;
        this.renderStore = renderStore;
        this.globalEvents = new NamedEventEmitter();
        this._messageBroker = messageBrokerFactory.createMessageBroker(RENDERER_2_CHANNEL);
        bus.initChannel(EVENT_2_CHANNEL);
        var /** @type {?} */ source = bus.from(EVENT_2_CHANNEL);
        source.subscribe({ next: function (message) { return _this._dispatchEvent(message); } });
    }
    /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.createRenderer = function (element, type) {
        var /** @type {?} */ renderer = new WebWorkerRenderer2(this);
        var /** @type {?} */ id = this.renderStore.allocateId();
        this.renderStore.store(renderer, id);
        this.callUI('createRenderer', [
            new FnArg(element, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(type, 0 /* RENDERER_TYPE_2 */),
            new FnArg(renderer, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return renderer;
    };
    /**
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.begin = function () { };
    /**
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.end = function () { };
    /**
     * @param {?} fnName
     * @param {?} fnArgs
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.callUI = function (fnName, fnArgs) {
        var /** @type {?} */ args = new UiArguments(fnName, fnArgs);
        this._messageBroker.runOnService(args, null);
    };
    /**
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.allocateNode = function () {
        var /** @type {?} */ result = new WebWorkerRenderNode();
        var /** @type {?} */ id = this.renderStore.allocateId();
        this.renderStore.store(result, id);
        return result;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.freeNode = function (node) { this.renderStore.remove(node); };
    /**
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype.allocateId = function () { return this.renderStore.allocateId(); };
    /**
     * @param {?} message
     * @return {?}
     */
    WebWorkerRendererFactory2.prototype._dispatchEvent = function (message) {
        var /** @type {?} */ element = this._serializer.deserialize(message['element'], 2 /* RENDER_STORE_OBJECT */);
        var /** @type {?} */ eventName = message['eventName'];
        var /** @type {?} */ target = message['eventTarget'];
        var /** @type {?} */ event = message['event'];
        if (target) {
            this.globalEvents.dispatchEvent(eventNameWithTarget(target, eventName), event);
        }
        else {
            element.events.dispatchEvent(eventName, event);
        }
    };
    return WebWorkerRendererFactory2;
}());
export { WebWorkerRendererFactory2 };
WebWorkerRendererFactory2.decorators = [
    { type: Injectable },
];
/** @nocollapse */
WebWorkerRendererFactory2.ctorParameters = function () { return [
    { type: ClientMessageBrokerFactory, },
    { type: MessageBus, },
    { type: Serializer, },
    { type: RenderStore, },
]; };
function WebWorkerRendererFactory2_tsickle_Closure_declarations() {
    /** @type {?} */
    WebWorkerRendererFactory2.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    WebWorkerRendererFactory2.ctorParameters;
    /** @type {?} */
    WebWorkerRendererFactory2.prototype.globalEvents;
    /** @type {?} */
    WebWorkerRendererFactory2.prototype._messageBroker;
    /** @type {?} */
    WebWorkerRendererFactory2.prototype._serializer;
    /** @type {?} */
    WebWorkerRendererFactory2.prototype.renderStore;
}
var WebWorkerRenderer2 = (function () {
    /**
     * @param {?} _rendererFactory
     */
    function WebWorkerRenderer2(_rendererFactory) {
        this._rendererFactory = _rendererFactory;
        this.data = Object.create(null);
        this.asFnArg = new FnArg(this, 2 /* RENDER_STORE_OBJECT */);
    }
    /**
     * @return {?}
     */
    WebWorkerRenderer2.prototype.destroy = function () { this.callUIWithRenderer('destroy'); };
    /**
     * @param {?} node
     * @return {?}
     */
    WebWorkerRenderer2.prototype.destroyNode = function (node) {
        this.callUIWithRenderer('destroyNode', [new FnArg(node, 2 /* RENDER_STORE_OBJECT */)]);
        this._rendererFactory.freeNode(node);
    };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    WebWorkerRenderer2.prototype.createElement = function (name, namespace) {
        var /** @type {?} */ node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createElement', [
            new FnArg(name),
            new FnArg(namespace),
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WebWorkerRenderer2.prototype.createComment = function (value) {
        var /** @type {?} */ node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createComment', [
            new FnArg(value),
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WebWorkerRenderer2.prototype.createText = function (value) {
        var /** @type {?} */ node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createText', [
            new FnArg(value),
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    WebWorkerRenderer2.prototype.appendChild = function (parent, newChild) {
        this.callUIWithRenderer('appendChild', [
            new FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(newChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    WebWorkerRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        if (!parent) {
            return;
        }
        this.callUIWithRenderer('insertBefore', [
            new FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(newChild, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(refChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    WebWorkerRenderer2.prototype.removeChild = function (parent, oldChild) {
        this.callUIWithRenderer('removeChild', [
            new FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(oldChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    WebWorkerRenderer2.prototype.selectRootElement = function (selectorOrNode) {
        var /** @type {?} */ node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('selectRootElement', [
            new FnArg(selectorOrNode),
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    WebWorkerRenderer2.prototype.parentNode = function (node) {
        var /** @type {?} */ res = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('parentNode', [
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(res, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return res;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    WebWorkerRenderer2.prototype.nextSibling = function (node) {
        var /** @type {?} */ res = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('nextSibling', [
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(res, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return res;
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    WebWorkerRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        this.callUIWithRenderer('setAttribute', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(name),
            new FnArg(value),
            new FnArg(namespace),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    WebWorkerRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        this.callUIWithRenderer('removeAttribute', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(name),
            new FnArg(namespace),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    WebWorkerRenderer2.prototype.addClass = function (el, name) {
        this.callUIWithRenderer('addClass', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(name),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    WebWorkerRenderer2.prototype.removeClass = function (el, name) {
        this.callUIWithRenderer('removeClass', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(name),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    WebWorkerRenderer2.prototype.setStyle = function (el, style, value, flags) {
        this.callUIWithRenderer('setStyle', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(style),
            new FnArg(value),
            new FnArg(flags),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    WebWorkerRenderer2.prototype.removeStyle = function (el, style, flags) {
        this.callUIWithRenderer('removeStyle', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(style),
            new FnArg(flags),
        ]);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    WebWorkerRenderer2.prototype.setProperty = function (el, name, value) {
        this.callUIWithRenderer('setProperty', [
            new FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(name),
            new FnArg(value),
        ]);
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    WebWorkerRenderer2.prototype.setValue = function (node, value) {
        this.callUIWithRenderer('setValue', [
            new FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(value),
        ]);
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} listener
     * @return {?}
     */
    WebWorkerRenderer2.prototype.listen = function (target, eventName, listener) {
        var _this = this;
        var /** @type {?} */ unlistenId = this._rendererFactory.allocateId();
        var _a = typeof target === 'string' ? [null, target, target + ":" + eventName] :
            [target, null, null], targetEl = _a[0], targetName = _a[1], fullName = _a[2];
        if (fullName) {
            this._rendererFactory.globalEvents.listen(fullName, listener);
        }
        else {
            targetEl.events.listen(eventName, listener);
        }
        this.callUIWithRenderer('listen', [
            new FnArg(targetEl, 2 /* RENDER_STORE_OBJECT */),
            new FnArg(targetName),
            new FnArg(eventName),
            new FnArg(unlistenId),
        ]);
        return function () {
            if (fullName) {
                _this._rendererFactory.globalEvents.unlisten(fullName, listener);
            }
            else {
                targetEl.events.unlisten(eventName, listener);
            }
            _this.callUIWithRenderer('unlisten', [new FnArg(unlistenId)]);
        };
    };
    /**
     * @param {?} fnName
     * @param {?=} fnArgs
     * @return {?}
     */
    WebWorkerRenderer2.prototype.callUIWithRenderer = function (fnName, fnArgs) {
        if (fnArgs === void 0) { fnArgs = []; }
        // always pass the renderer as the first arg
        this._rendererFactory.callUI(fnName, [this.asFnArg].concat(fnArgs));
    };
    return WebWorkerRenderer2;
}());
export { WebWorkerRenderer2 };
function WebWorkerRenderer2_tsickle_Closure_declarations() {
    /** @type {?} */
    WebWorkerRenderer2.prototype.data;
    /** @type {?} */
    WebWorkerRenderer2.prototype.asFnArg;
    /** @type {?} */
    WebWorkerRenderer2.prototype._rendererFactory;
}
var WebWorkerRenderNode = (function () {
    function WebWorkerRenderNode() {
        this.events = new NamedEventEmitter();
    }
    return WebWorkerRenderNode;
}());
export { WebWorkerRenderNode };
function WebWorkerRenderNode_tsickle_Closure_declarations() {
    /** @type {?} */
    WebWorkerRenderNode.prototype.events;
}
//# sourceMappingURL=renderer.js.map