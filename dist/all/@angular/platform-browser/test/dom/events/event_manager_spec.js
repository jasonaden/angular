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
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_events_1 = require("@angular/platform-browser/src/dom/events/dom_events");
var event_manager_1 = require("@angular/platform-browser/src/dom/events/event_manager");
var browser_util_1 = require("../../../testing/src/browser_util");
function main() {
    var domEventPlugin;
    var doc;
    var zone;
    testing_internal_1.describe('EventManager', function () {
        testing_internal_1.beforeEach(function () {
            doc = dom_adapter_1.getDOM().supportsDOMEvents() ? document : dom_adapter_1.getDOM().createHtmlDocument();
            zone = new ng_zone_1.NgZone({});
            domEventPlugin = new dom_events_1.DomEventsPlugin(doc, zone);
        });
        testing_internal_1.it('should delegate event bindings to plugins that are passed in from the most generic one to the most specific one', function () {
            var element = browser_util_1.el('<div></div>');
            var handler = function (e /** TODO #9100 */) { return e; };
            var plugin = new FakeEventManagerPlugin(doc, ['click']);
            var manager = new event_manager_1.EventManager([domEventPlugin, plugin], new FakeNgZone());
            manager.addEventListener(element, 'click', handler);
            testing_internal_1.expect(plugin.eventHandler['click']).toBe(handler);
        });
        testing_internal_1.it('should delegate event bindings to the first plugin supporting the event', function () {
            var element = browser_util_1.el('<div></div>');
            var clickHandler = function (e /** TODO #9100 */) { return e; };
            var dblClickHandler = function (e /** TODO #9100 */) { return e; };
            var plugin1 = new FakeEventManagerPlugin(doc, ['dblclick']);
            var plugin2 = new FakeEventManagerPlugin(doc, ['click', 'dblclick']);
            var manager = new event_manager_1.EventManager([plugin2, plugin1], new FakeNgZone());
            manager.addEventListener(element, 'click', clickHandler);
            manager.addEventListener(element, 'dblclick', dblClickHandler);
            testing_internal_1.expect(plugin2.eventHandler['click']).toBe(clickHandler);
            testing_internal_1.expect(plugin1.eventHandler['dblclick']).toBe(dblClickHandler);
        });
        testing_internal_1.it('should throw when no plugin can handle the event', function () {
            var element = browser_util_1.el('<div></div>');
            var plugin = new FakeEventManagerPlugin(doc, ['dblclick']);
            var manager = new event_manager_1.EventManager([plugin], new FakeNgZone());
            testing_internal_1.expect(function () { return manager.addEventListener(element, 'click', null); })
                .toThrowError('No event manager plugin found for event click');
        });
        testing_internal_1.it('events are caught when fired from a child', function () {
            var element = browser_util_1.el('<div><div></div></div>');
            // Workaround for https://bugs.webkit.org/show_bug.cgi?id=122755
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var child = dom_adapter_1.getDOM().firstChild(element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvent = null;
            var handler = function (e /** TODO #9100 */) { receivedEvent = e; };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            manager.addEventListener(element, 'click', handler);
            dom_adapter_1.getDOM().dispatchEvent(child, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
        });
        testing_internal_1.it('should add and remove global event listeners', function () {
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvent = null;
            var handler = function (e /** TODO #9100 */) { receivedEvent = e; };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover = manager.addGlobalEventListener('document', 'click', handler);
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
            receivedEvent = null;
            remover();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(null);
        });
    });
}
exports.main = main;
/** @internal */
var FakeEventManagerPlugin = (function (_super) {
    __extends(FakeEventManagerPlugin, _super);
    function FakeEventManagerPlugin(doc, supportedEvents) {
        var _this = _super.call(this, doc) || this;
        _this.supportedEvents = supportedEvents;
        _this.eventHandler = {};
        return _this;
    }
    FakeEventManagerPlugin.prototype.supports = function (eventName) { return this.supportedEvents.indexOf(eventName) > -1; };
    FakeEventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        this.eventHandler[eventName] = handler;
        return function () { delete (_this.eventHandler[eventName]); };
    };
    return FakeEventManagerPlugin;
}(event_manager_1.EventManagerPlugin));
var FakeNgZone = (function (_super) {
    __extends(FakeNgZone, _super);
    function FakeNgZone() {
        return _super.call(this, { enableLongStackTrace: false }) || this;
    }
    FakeNgZone.prototype.run = function (fn, applyThis, applyArgs) { return fn(); };
    FakeNgZone.prototype.runOutsideAngular = function (fn) { return fn(); };
    return FakeNgZone;
}(ng_zone_1.NgZone));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWFuYWdlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2RvbS9ldmVudHMvZXZlbnRfbWFuYWdlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDBEQUFzRDtBQUN0RCwrRUFBNEY7QUFDNUYsNkVBQXFFO0FBQ3JFLGtGQUFvRjtBQUNwRix3RkFBd0c7QUFDeEcsa0VBQXFEO0FBRXJEO0lBQ0UsSUFBSSxjQUErQixDQUFDO0lBQ3BDLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxJQUFZLENBQUM7SUFFakIsMkJBQVEsQ0FBQyxjQUFjLEVBQUU7UUFFdkIsNkJBQVUsQ0FBQztZQUNULEdBQUcsR0FBRyxvQkFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxRQUFRLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUUsSUFBSSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixjQUFjLEdBQUcsSUFBSSw0QkFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsaUhBQWlILEVBQ2pIO1lBQ0UsSUFBTSxPQUFPLEdBQUcsaUJBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsQyxJQUFNLE9BQU8sR0FBRyxVQUFDLENBQU0sQ0FBQyxpQkFBaUIsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7WUFDaEQsSUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQU0sT0FBTyxHQUFHLElBQUksNEJBQVksQ0FBQyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFB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