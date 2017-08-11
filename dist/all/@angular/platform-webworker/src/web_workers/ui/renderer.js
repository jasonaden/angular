"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var render_store_1 = require("../shared/render_store");
var serializer_1 = require("../shared/serializer");
var service_message_broker_1 = require("../shared/service_message_broker");
var event_dispatcher_1 = require("../ui/event_dispatcher");
var MessageBasedRenderer2 = (function () {
    function MessageBasedRenderer2(_brokerFactory, _bus, _serializer, _renderStore, _rendererFactory) {
        this._brokerFactory = _brokerFactory;
        this._bus = _bus;
        this._serializer = _serializer;
        this._renderStore = _renderStore;
        this._rendererFactory = _rendererFactory;
    }
    MessageBasedRenderer2.prototype.start = function () {
        var _this = this;
        var broker = this._brokerFactory.createMessageBroker(messaging_api_1.RENDERER_2_CHANNEL);
        this._bus.initChannel(messaging_api_1.EVENT_2_CHANNEL);
        this._eventDispatcher = new event_dispatcher_1.EventDispatcher(this._bus.to(messaging_api_1.EVENT_2_CHANNEL), this._serializer);
        var _a = [
            2 /* RENDER_STORE_OBJECT */,
            1 /* PRIMITIVE */,
            0 /* RENDERER_TYPE_2 */,
        ], RSO = _a[0], P = _a[1], CRT = _a[2];
        var methods = [
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
    MessageBasedRenderer2.prototype.destroy = function (r) { r.destroy(); };
    MessageBasedRenderer2.prototype.destroyNode = function (r, node) {
        if (r.destroyNode) {
            r.destroyNode(node);
        }
        this._renderStore.remove(node);
    };
    MessageBasedRenderer2.prototype.createRenderer = function (el, type, id) {
        this._renderStore.store(this._rendererFactory.createRenderer(el, type), id);
    };
    MessageBasedRenderer2.prototype.createElement = function (r, name, namespace, id) {
        this._renderStore.store(r.createElement(name, namespace), id);
    };
    MessageBasedRenderer2.prototype.createComment = function (r, value, id) {
        this._renderStore.store(r.createComment(value), id);
    };
    MessageBasedRenderer2.prototype.createText = function (r, value, id) {
        this._renderStore.store(r.createText(value), id);
    };
    MessageBasedRenderer2.prototype.appendChild = function (r, parent, child) { r.appendChild(parent, child); };
    MessageBasedRenderer2.prototype.insertBefore = function (r, parent, child, ref) {
        r.insertBefore(parent, child, ref);
    };
    MessageBasedRenderer2.prototype.removeChild = function (r, parent, child) { r.removeChild(parent, child); };
    MessageBasedRenderer2.prototype.selectRootElement = function (r, selector, id) {
        this._renderStore.store(r.selectRootElement(selector), id);
    };
    MessageBasedRenderer2.prototype.parentNode = function (r, node, id) {
        this._renderStore.store(r.parentNode(node), id);
    };
    MessageBasedRenderer2.prototype.nextSibling = function (r, node, id) {
        this._renderStore.store(r.nextSibling(node), id);
    };
    MessageBasedRenderer2.prototype.setAttribute = function (r, el, name, value, namespace) {
        r.setAttribute(el, name, value, namespace);
    };
    MessageBasedRenderer2.prototype.removeAttribute = function (r, el, name, namespace) {
        r.removeAttribute(el, name, namespace);
    };
    MessageBasedRenderer2.prototype.addClass = function (r, el, name) { r.addClass(el, name); };
    MessageBasedRenderer2.prototype.removeClass = function (r, el, name) { r.removeClass(el, name); };
    MessageBasedRenderer2.prototype.setStyle = function (r, el, style, value, flags) {
        r.setStyle(el, style, value, flags);
    };
    MessageBasedRenderer2.prototype.removeStyle = function (r, el, style, flags) {
        r.removeStyle(el, style, flags);
    };
    MessageBasedRenderer2.prototype.setProperty = function (r, el, name, value) {
        r.setProperty(el, name, value);
    };
    MessageBasedRenderer2.prototype.setValue = function (r, node, value) { r.setValue(node, value); };
    MessageBasedRenderer2.prototype.listen = function (r, el, elName, eventName, unlistenId) {
        var _this = this;
        var listener = function (event) {
            return _this._eventDispatcher.dispatchRenderEvent(el, elName, eventName, event);
        };
        var unlisten = r.listen(el || elName, eventName, listener);
        this._renderStore.store(unlisten, unlistenId);
    };
    MessageBasedRenderer2.prototype.unlisten = function (r, unlisten) { unlisten(); };
    return MessageBasedRenderer2;
}());
MessageBasedRenderer2 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus,
        serializer_1.Serializer, render_store_1.RenderStore,
        core_1.RendererFactory2])
], MessageBasedRenderer2);
exports.MessageBasedRenderer2 = MessageBasedRenderer2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3VpL3JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTBHO0FBRTFHLHFEQUFpRDtBQUNqRCx5REFBNEU7QUFDNUUsdURBQW1EO0FBQ25ELG1EQUFpRTtBQUNqRSwyRUFBbUc7QUFDbkcsMkRBQXVEO0FBR3ZELElBQWEscUJBQXFCO0lBR2hDLCtCQUNZLGNBQTJDLEVBQVUsSUFBZ0IsRUFDckUsV0FBdUIsRUFBVSxZQUF5QixFQUMxRCxnQkFBa0M7UUFGbEMsbUJBQWMsR0FBZCxjQUFjLENBQTZCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNyRSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQzFELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFBRyxDQUFDO0lBRWxELHFDQUFLLEdBQUw7UUFBQSxpQkFtQ0M7UUFsQ0MsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxrQ0FBa0IsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLCtCQUFlLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLCtCQUFlLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdkYsSUFBQTs7OztTQUlMLEVBSk0sV0FBRyxFQUFFLFNBQUMsRUFBRSxXQUFHLENBSWhCO1FBRUYsSUFBTSxPQUFPLEdBQVk7WUFDdkIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLEdB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