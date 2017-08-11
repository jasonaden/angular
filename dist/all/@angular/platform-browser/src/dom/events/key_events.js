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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../dom_adapter");
var dom_tokens_1 = require("../dom_tokens");
var event_manager_1 = require("./event_manager");
var MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
var MODIFIER_KEY_GETTERS = {
    'alt': function (event) { return event.altKey; },
    'control': function (event) { return event.ctrlKey; },
    'meta': function (event) { return event.metaKey; },
    'shift': function (event) { return event.shiftKey; }
};
/**
 * @experimental
 */
var KeyEventsPlugin = KeyEventsPlugin_1 = (function (_super) {
    __extends(KeyEventsPlugin, _super);
    function KeyEventsPlugin(doc) {
        return _super.call(this, doc) || this;
    }
    KeyEventsPlugin.prototype.supports = function (eventName) { return KeyEventsPlugin_1.parseEventName(eventName) != null; };
    KeyEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var parsedEvent = KeyEventsPlugin_1.parseEventName(eventName);
        var outsideHandler = KeyEventsPlugin_1.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(function () {
            return dom_adapter_1.getDOM().onAndCancel(element, parsedEvent['domEventName'], outsideHandler);
        });
    };
    KeyEventsPlugin.parseEventName = function (eventName) {
        var parts = eventName.toLowerCase().split('.');
        var domEventName = parts.shift();
        if ((parts.length === 0) || !(domEventName === 'keydown' || domEventName === 'keyup')) {
            return null;
        }
        var key = KeyEventsPlugin_1._normalizeKey(parts.pop());
        var fullKey = '';
        MODIFIER_KEYS.forEach(function (modifierName) {
            var index = parts.indexOf(modifierName);
            if (index > -1) {
                parts.splice(index, 1);
                fullKey += modifierName + '.';
            }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
            // returning null instead of throwing to let another plugin process the event
            return null;
        }
        var result = {};
        result['domEventName'] = domEventName;
        result['fullKey'] = fullKey;
        return result;
    };
    KeyEventsPlugin.getEventFullKey = function (event) {
        var fullKey = '';
        var key = dom_adapter_1.getDOM().getEventKey(event);
        key = key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        MODIFIER_KEYS.forEach(function (modifierName) {
            if (modifierName != key) {
                var modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        fullKey += key;
        return fullKey;
    };
    KeyEventsPlugin.eventCallback = function (fullKey, handler, zone) {
        return function (event /** TODO #9100 */) {
            if (KeyEventsPlugin_1.getEventFullKey(event) === fullKey) {
                zone.runGuarded(function () { return handler(event); });
            }
        };
    };
    /** @internal */
    KeyEventsPlugin._normalizeKey = function (keyName) {
        // TODO: switch to a Map if the mapping grows too much
        switch (keyName) {
            case 'esc':
                return 'escape';
            default:
                return keyName;
        }
    };
    return KeyEventsPlugin;
}(event_manager_1.EventManagerPlugin));
KeyEventsPlugin = KeyEventsPlugin_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(dom_tokens_1.DOCUMENT)),
    __metadata("design:paramtypes", [Object])
], KeyEventsPlugin);
exports.KeyEventsPlugin = KeyEventsPlugin;
var KeyEventsPlugin_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9ldmVudHMva2V5X2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFFekQsOENBQXNDO0FBQ3RDLDRDQUF1QztBQUV2QyxpREFBbUQ7QUFFbkQsSUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxRCxJQUFNLG9CQUFvQixHQUF1RDtJQUMvRSxLQUFLLEVBQUUsVUFBQyxLQUFvQixJQUFLLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBWixDQUFZO0lBQzdDLFNBQVMsRUFBRSxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsT0FBTyxFQUFiLENBQWE7SUFDbEQsTUFBTSxFQUFFLFVBQUMsS0FBb0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxPQUFPLEVBQWIsQ0FBYTtJQUMvQyxPQUFPLEVBQUUsVUFBQyxLQUFvQixJQUFLLE9BQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxDQUFjO0NBQ2xELENBQUM7QUFFRjs7R0FFRztBQUVILElBQWEsZUFBZTtJQUFTLG1DQUFrQjtJQUNyRCx5QkFBOEIsR0FBUTtlQUFJLGtCQUFNLEdBQUcsQ0FBQztJQUFFLENBQUM7SUFFdkQsa0NBQVEsR0FBUixVQUFTLFNBQWlCLElBQWEsTUFBTSxDQUFDLGlCQUFlLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFbEcsMENBQWdCLEdBQWhCLFVBQWlCLE9BQW9CLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUN6RSxJQUFNLFdBQVcsR0FBRyxpQkFBZSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUcs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