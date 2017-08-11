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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var client_message_broker_1 = require("../shared/client_message_broker");
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var serializer_1 = require("../shared/serializer");
var WebWorkerPlatformLocation = (function (_super) {
    __extends(WebWorkerPlatformLocation, _super);
    function WebWorkerPlatformLocation(brokerFactory, bus, _serializer) {
        var _this = _super.call(this) || this;
        _this._serializer = _serializer;
        _this._popStateListeners = [];
        _this._hashChangeListeners = [];
        _this._location = null;
        _this._broker = brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
        _this._channelSource = bus.from(messaging_api_1.ROUTER_CHANNEL);
        _this._channelSource.subscribe({
            next: function (msg) {
                var listeners = null;
                if (msg.hasOwnProperty('event')) {
                    var type = msg['event']['type'];
                    if (type === 'popstate') {
                        listeners = _this._popStateListeners;
                    }
                    else if (type === 'hashchange') {
                        listeners = _this._hashChangeListeners;
                    }
                    if (listeners) {
                        // There was a popState or hashChange event, so the location object thas been updated
                        _this._location = _this._serializer.deserialize(msg['location'], serializer_1.LocationType);
                        listeners.forEach(function (fn) { return fn(msg['event']); });
                    }
                }
            }
        });
        _this.initialized = new Promise(function (res) { return _this.initializedResolve = res; });
        return _this;
    }
    /** @internal **/
    WebWorkerPlatformLocation.prototype.init = function () {
        var _this = this;
        var args = new client_message_broker_1.UiArguments('getLocation');
        return this._broker.runOnService(args, serializer_1.LocationType).then(function (val) {
            _this._location = val;
            _this.initializedResolve();
            return true;
        }, function (err) { throw new Error(err); });
    };
    WebWorkerPlatformLocation.prototype.getBaseHrefFromDOM = function () {
        throw new Error('Attempt to get base href from DOM from WebWorker. You must either provide a value for the APP_BASE_HREF token through DI or use the hash location strategy.');
    };
    WebWorkerPlatformLocation.prototype.onPopState = function (fn) { this._popStateListeners.push(fn); };
    WebWorkerPlatformLocation.prototype.onHashChange = function (fn) { this._hashChangeListeners.push(fn); };
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "pathname", {
        get: function () { return this._location ? this._location.pathname : '<unknown>'; },
        set: function (newPath) {
            if (this._location === null) {
                throw new Error('Attempt to set pathname before value is obtained from UI');
            }
            this._location.pathname = newPath;
            var fnArgs = [new client_message_broker_1.FnArg(newPath, 1 /* PRIMITIVE */)];
            var args = new client_message_broker_1.UiArguments('setPathname', fnArgs);
            this._broker.runOnService(args, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "search", {
        get: function () { return this._location ? this._location.search : '<unknown>'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebWorkerPlatformLocation.prototype, "hash", {
        get: function () { return this._location ? this._location.hash : '<unknown>'; },
        enumerable: true,
        configurable: true
    });
    WebWorkerPlatformLocation.prototype.pushState = function (state, title, url) {
        var fnArgs = [
            new client_message_broker_1.FnArg(state, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(title, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(url, 1 /* PRIMITIVE */),
        ];
        var args = new client_message_broker_1.UiArguments('pushState', fnArgs);
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.replaceState = function (state, title, url) {
        var fnArgs = [
            new client_message_broker_1.FnArg(state, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(title, 1 /* PRIMITIVE */),
            new client_message_broker_1.FnArg(url, 1 /* PRIMITIVE */),
        ];
        var args = new client_message_broker_1.UiArguments('replaceState', fnArgs);
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.forward = function () {
        var args = new client_message_broker_1.UiArguments('forward');
        this._broker.runOnService(args, null);
    };
    WebWorkerPlatformLocation.prototype.back = function () {
        var args = new client_message_broker_1.UiArguments('back');
        this._broker.runOnService(args, null);
    };
    return WebWorkerPlatformLocation;
}(common_1.PlatformLocation));
WebWorkerPlatformLocation = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [client_message_broker_1.ClientMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer])
], WebWorkerPlatformLocation);
exports.WebWorkerPlatformLocation = WebWorkerPlatformLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci9wbGF0Zm9ybV9sb2NhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBeUU7QUFDekUsc0NBQXVEO0FBQ3ZELHlFQUFvSDtBQUNwSCxxREFBaUQ7QUFDakQseURBQXVEO0FBQ3ZELG1EQUErRTtBQUcvRSxJQUFhLHlCQUF5QjtJQUFTLDZDQUFnQjtJQVM3RCxtQ0FDSSxhQUF5QyxFQUFFLEdBQWUsRUFBVSxXQUF1QjtRQUQvRixZQUVFLGlCQUFPLFNBd0JSO1FBekJ1RSxpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQVJ2Rix3QkFBa0IsR0FBb0IsRUFBRSxDQUFDO1FBQ3pDLDBCQUFvQixHQUFvQixFQUFFLENBQUM7UUFDM0MsZUFBUyxHQUFpQixJQUFNLENBQUM7UUFRdkMsS0FBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUMsOEJBQWMsQ0FBQyxDQUFDO1FBQ2pFLEtBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyw4QkFBYyxDQUFDLENBQUM7UUFFL0MsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7WUFDNUIsSUFBSSxFQUFFLFVBQUMsR0FBeUI7Z0JBQzlCLElBQUksU0FBUyxHQUF5QixJQUFJLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxJQUFNLElBQUksR0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMs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