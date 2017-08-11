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
var platform_browser_1 = require("@angular/platform-browser");
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var serializer_1 = require("../shared/serializer");
var service_message_broker_1 = require("../shared/service_message_broker");
var MessageBasedPlatformLocation = (function () {
    function MessageBasedPlatformLocation(_brokerFactory, _platformLocation, bus, _serializer) {
        this._brokerFactory = _brokerFactory;
        this._platformLocation = _platformLocation;
        this._serializer = _serializer;
        this._platformLocation.onPopState(this._sendUrlChangeEvent.bind(this));
        this._platformLocation.onHashChange(this._sendUrlChangeEvent.bind(this));
        this._broker = this._brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
        this._channelSink = bus.to(messaging_api_1.ROUTER_CHANNEL);
    }
    MessageBasedPlatformLocation.prototype.start = function () {
        var P = 1 /* PRIMITIVE */;
        this._broker.registerMethod('getLocation', null, this._getLocation.bind(this), serializer_1.LocationType);
        this._broker.registerMethod('setPathname', [P], this._setPathname.bind(this));
        this._broker.registerMethod('pushState', [P, P, P], this._platformLocation.pushState.bind(this._platformLocation));
        this._broker.registerMethod('replaceState', [P, P, P], this._platformLocation.replaceState.bind(this._platformLocation));
        this._broker.registerMethod('forward', null, this._platformLocation.forward.bind(this._platformLocation));
        this._broker.registerMethod('back', null, this._platformLocation.back.bind(this._platformLocation));
    };
    MessageBasedPlatformLocation.prototype._getLocation = function () {
        return Promise.resolve(this._platformLocation.location);
    };
    MessageBasedPlatformLocation.prototype._sendUrlChangeEvent = function (e) {
        this._channelSink.emit({
            'event': { 'type': e.type },
            'location': this._serializer.serialize(this._platformLocation.location, serializer_1.LocationType),
        });
    };
    MessageBasedPlatformLocation.prototype._setPathname = function (pathname) { this._platformLocation.pathname = pathname; };
    return MessageBasedPlatformLocation;
}());
MessageBasedPlatformLocation = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [service_message_broker_1.ServiceMessageBrokerFactory,
        platform_browser_1.ɵBrowserPlatformLocation, message_bus_1.MessageBus,
        serializer_1.Serializer])
], MessageBasedPlatformLocation);
exports.MessageBasedPlatformLocation = MessageBasedPlatformLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3VpL3BsYXRmb3JtX2xvY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBR0gsc0NBQXVEO0FBQ3ZELDhEQUE4RjtBQUM5RixxREFBaUQ7QUFDakQseURBQXVEO0FBQ3ZELG1EQUErRTtBQUMvRSwyRUFBbUc7QUFHbkcsSUFBYSw0QkFBNEI7SUFJdkMsc0NBQ1ksY0FBMkMsRUFDM0MsaUJBQTBDLEVBQUUsR0FBZSxFQUMzRCxXQUF1QjtRQUZ2QixtQkFBYyxHQUFkLGNBQWMsQ0FBNkI7UUFDM0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUF5QjtRQUMxQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUF5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FDUCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLDhCQUFjLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsOEJBQWMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCw0Q0FBSyxHQUFMO1FBQ0UsSUFBTSxDQUFDLG9CQUE0QixDQUFDO1FBRXBDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUseUJBQVksQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQ3ZCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FDdkIsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDekIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FDdkIsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUN2QixNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVPLG1EQUFZLEdBQXBCO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTywwREFBbUIsR0FBM0IsVUFBNEIsQ0FBUTtRQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNyQixPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBQztZQUN6QixVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSx5QkFBWSxDQUFDO1NBQ3RGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxtREFBWSxHQUFwQixVQUFxQixRQUFnQixJQUFVLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5RixtQ0FBQztBQUFELENBQUMsQUEzQ0QsSUEyQ0M7QUEzQ1ksNEJBQTRCO0lBRHhDLGlCQUFVLEVBQUU7cUNBTWlCLG9EQUEyQjtRQUN4QiwyQ0FBdUIsRUFBTyx3QkFBVTtRQUM5Qyx1QkFBVTtHQVB4Qiw0QkFBNEIsQ0EyQ3hDO0FBM0NZLG9FQUE0QiJ9