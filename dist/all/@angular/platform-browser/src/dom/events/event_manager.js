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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../dom_adapter");
/**
 * @stable
 */
exports.EVENT_MANAGER_PLUGINS = new core_1.InjectionToken('EventManagerPlugins');
/**
 * @stable
 */
var EventManager = (function () {
    function EventManager(plugins, _zone) {
        var _this = this;
        this._zone = _zone;
        this._eventNameToPlugin = new Map();
        plugins.forEach(function (p) { return p.manager = _this; });
        this._plugins = plugins.slice().reverse();
    }
    EventManager.prototype.addEventListener = function (element, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    };
    EventManager.prototype.addGlobalEventListener = function (target, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    };
    EventManager.prototype.getZone = function () { return this._zone; };
    /** @internal */
    EventManager.prototype._findPluginFor = function (eventName) {
        var plugin = this._eventNameToPlugin.get(eventName);
        if (plugin) {
            return plugin;
        }
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
            var plugin_1 = plugins[i];
            if (plugin_1.supports(eventName)) {
                this._eventNameToPlugin.set(eventName, plugin_1);
                return plugin_1;
            }
        }
        throw new Error("No event manager plugin found for event " + eventName);
    };
    return EventManager;
}());
EventManager = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(exports.EVENT_MANAGER_PLUGINS)),
    __metadata("design:paramtypes", [Array, core_1.NgZone])
], EventManager);
exports.EventManager = EventManager;
var EventManagerPlugin = (function () {
    function EventManagerPlugin(_doc) {
        this._doc = _doc;
    }
    EventManagerPlugin.prototype.addGlobalEventListener = function (element, eventName, handler) {
        var target = dom_adapter_1.getDOM().getGlobalEventTarget(this._doc, element);
        if (!target) {
            throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
    };
    ;
    return EventManagerPlugin;
}());
exports.EventManagerPlugin = EventManagerPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9ldmVudHMvZXZlbnRfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHNDQUF5RTtBQUV6RSw4Q0FBc0M7QUFFdEM7O0dBRUc7QUFDVSxRQUFBLHFCQUFxQixHQUM5QixJQUFJLHFCQUFjLENBQXVCLHFCQUFxQixDQUFDLENBQUM7QUFFcEU7O0dBRUc7QUFFSCxJQUFhLFlBQVk7SUFJdkIsc0JBQTJDLE9BQTZCLEVBQVUsS0FBYTtRQUEvRixpQkFHQztRQUhpRixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBRnZGLHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1FBR2pFLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUksRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsT0FBb0IsRUFBRSxTQUFpQixFQUFFLE9BQWlCO1FBQ3pFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCw2Q0FBc0IsR0FBdEIsVUFBdUIsTUFBYyxFQUFFLFNBQWlCLEVBQUUsT0FBaUI7UUFDekUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDhCQUFPLEdBQVAsY0FBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRXhDLGdCQUFnQjtJQUNoQixxQ0FBYyxHQUFkLFVBQWUsU0FBaUI7UUFDOUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN4QyxJQUFNLFFBQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFFBQU0sQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsUUFBTSxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBMkMsU0FBVyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXRDRCxJQXNDQztBQXRDWSxZQUFZO0lBRHhCLGlCQUFVLEVBQUU7SUFLRSxXQUFBLGFBQU0sQ0FBQyw2QkFBcUIsQ0FBQyxDQUFBOzRDQUErQyxhQUFNO0dBSnBGLFlBQVksQ0FzQ3hCO0FBdENZLG9DQUFZO0FBd0N6QjtJQUNFLDRCQUFvQixJQUFTO1FBQVQsU0FBSSxHQUFKLElBQUksQ0FBSztJQUFHLENBQUM7SUFRakMsbURBQXNCLEdBQXRCLFVBQXVCLE9BQWUsRUFBRSxTQUFpQixFQUFFLE9BQWlCO1FBQzFFLElBQU0sTUFBTSxHQUFnQixvQkFBTSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5RSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE0QixNQUFNLG1CQUFjLFNBQVcsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUFBLENBQUM7SUFDSix5QkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQnFCLGdEQUFrQiJ9