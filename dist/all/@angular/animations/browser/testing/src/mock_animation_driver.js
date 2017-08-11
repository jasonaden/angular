"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var shared_1 = require("../../src/render/shared");
var util_1 = require("../../src/util");
/**
 * @experimental Animation support is experimental.
 */
var MockAnimationDriver = (function () {
    function MockAnimationDriver() {
    }
    MockAnimationDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    MockAnimationDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    MockAnimationDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    MockAnimationDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return defaultValue || '';
    };
    MockAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var player = new MockAnimationPlayer(element, keyframes, duration, delay, easing, previousPlayers);
        MockAnimationDriver.log.push(player);
        return player;
    };
    return MockAnimationDriver;
}());
MockAnimationDriver.log = [];
exports.MockAnimationDriver = MockAnimationDriver;
/**
 * @experimental Animation support is experimental.
 */
var MockAnimationPlayer = (function (_super) {
    __extends(MockAnimationPlayer, _super);
    function MockAnimationPlayer(element, keyframes, duration, delay, easing, previousPlayers) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.keyframes = keyframes;
        _this.duration = duration;
        _this.delay = delay;
        _this.easing = easing;
        _this.previousPlayers = previousPlayers;
        _this.__finished = false;
        _this.__started = false;
        _this.previousStyles = {};
        _this._onInitFns = [];
        _this.currentSnapshot = {};
        if (util_1.allowPreviousPlayerStylesMerge(duration, delay)) {
            previousPlayers.forEach(function (player) {
                if (player instanceof MockAnimationPlayer) {
                    var styles_1 = player.currentSnapshot;
                    Object.keys(styles_1).forEach(function (prop) { return _this.previousStyles[prop] = styles_1[prop]; });
                }
            });
        }
        _this.totalTime = delay + duration;
        return _this;
    }
    /* @internal */
    MockAnimationPlayer.prototype.onInit = function (fn) { this._onInitFns.push(fn); };
    /* @internal */
    MockAnimationPlayer.prototype.init = function () {
        _super.prototype.init.call(this);
        this._onInitFns.forEach(function (fn) { return fn(); });
        this._onInitFns = [];
    };
    MockAnimationPlayer.prototype.finish = function () {
        _super.prototype.finish.call(this);
        this.__finished = true;
    };
    MockAnimationPlayer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.__finished = true;
    };
    /* @internal */
    MockAnimationPlayer.prototype.triggerMicrotask = function () { };
    MockAnimationPlayer.prototype.play = function () {
        _super.prototype.play.call(this);
        this.__started = true;
    };
    MockAnimationPlayer.prototype.hasStarted = function () { return this.__started; };
    MockAnimationPlayer.prototype.beforeDestroy = function () {
        var _this = this;
        var captures = {};
        Object.keys(this.previousStyles).forEach(function (prop) {
            captures[prop] = _this.previousStyles[prop];
        });
        if (this.hasStarted()) {
            // when assembling the captured styles, it's important that
            // we build the keyframe styles in the following order:
            // {other styles within keyframes, ... previousStyles }
            this.keyframes.forEach(function (kf) {
                Object.keys(kf).forEach(function (prop) {
                    if (prop != 'offset') {
                        captures[prop] = _this.__finished ? kf[prop] : animations_1.AUTO_STYLE;
                    }
                });
            });
        }
        this.currentSnapshot = captures;
    };
    return MockAnimationPlayer;
}(animations_1.NoopAnimationPlayer));
exports.MockAnimationPlayer = MockAnimationPlayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19hbmltYXRpb25fZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3Rpbmcvc3JjL21vY2tfYW5pbWF0aW9uX2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBaUc7QUFHakcsa0RBQXFGO0FBQ3JGLHVDQUE4RDtBQUU5RDs7R0FFRztBQUNIO0lBQUE7SUF5QkEsQ0FBQztJQXRCQyw0Q0FBYyxHQUFkLFVBQWUsT0FBWSxFQUFFLFFBQWdCO1FBQzNDLE1BQU0sQ0FBQyx1QkFBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsNkNBQWUsR0FBZixVQUFnQixJQUFTLEVBQUUsSUFBUyxJQUFhLE1BQU0sQ0FBQyx3QkFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsbUNBQUssR0FBTCxVQUFNLE9BQVksRUFBRSxRQUFnQixFQUFFLEtBQWM7UUFDbEQsTUFBTSxDQUFDLG9CQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsMENBQVksR0FBWixVQUFhLE9BQVksRUFBRSxJQUFZLEVBQUUsWUFBcUI7UUFDNUQsTUFBTSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELHFDQUFPLEdBQVAsVUFDSSxPQUFZLEVBQUUsU0FBNkMsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFDNUYsTUFBYyxFQUFFLGVBQTJCO1FBQTNCLGdDQUFBLEVBQUEsb0JBQTJCO1FBQzdDLElBQU0sTUFBTSxHQUNSLElBQUksbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMxRixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFrQixNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF6QkQ7QUFDUyx1QkFBRyxHQUFzQixFQUFFLENBQUM7QUFEeEIsa0RBQW1CO0FBMkJoQzs7R0FFRztBQUNIO0lBQXlDLHVDQUFtQjtJQU8xRCw2QkFDVyxPQUFZLEVBQVMsU0FBNkMsRUFDbEUsUUFBZ0IsRUFBUyxLQUFhLEVBQVMsTUFBYyxFQUM3RCxlQUFzQjtRQUhqQyxZQUlFLGlCQUFPLFNBWVI7UUFmVSxhQUFPLEdBQVAsT0FBTyxDQUFLO1FBQVMsZUFBUyxHQUFULFNBQVMsQ0FBb0M7UUFDbEUsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQUFTLFdBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxZQUFNLEdBQU4sTUFBTSxDQUFRO1FBQzdELHFCQUFlLEdBQWYsZUFBZSxDQUFPO1FBVHpCLGdCQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGVBQVMsR0FBRyxLQUFLLENBQUM7UUFDbkIsb0JBQWMsR0FBcUMsRUFBRSxDQUFDO1FBQ3JELGdCQUFVLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxxQkFBZSxHQUFlLEVBQUUsQ0FBQztRQVF0QyxFQUFFLENBQUMsQ0FBQyxxQ0FBOEIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxJQUFNLFFBQU0sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO29CQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBTSxDQUFDLElBQUksQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7Z0JBQ2hGLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7O0lBQ3BDLENBQUM7SUFFRCxlQUFlO0lBQ2Ysb0NBQU0sR0FBTixVQUFPLEVBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkQsZUFBZTtJQUNmLGtDQUFJLEdBQUo7UUFDRSxpQkFBTSxJQUFJLFdBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxFQUFFLEVBQUosQ0FBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELG9DQUFNLEdBQU47UUFDRSxpQkFBTSxNQUFNLFdBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxxQ0FBTyxHQUFQO1FBQ0UsaUJBQU0sT0FBTyxXQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGVBQWU7SUFDZiw4Q0FBZ0IsR0FBaEIsY0FBb0IsQ0FBQztJQUVyQixrQ0FBSSxHQUFKO1FBQ0UsaUJBQU0sSUFBSSxXQUFFLENBQUM7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQsd0NBQVUsR0FBVixjQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUV2QywyQ0FBYSxHQUFiO1FBQUEsaUJBcUJDO1FBcEJDLElBQU0sUUFBUSxHQUFlLEVBQUUsQ0FBQztRQUVoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0QiwyREFBMkQ7WUFDM0QsdURBQXVEO1lBQ3ZELHVEQUF1RDtZQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtvQkFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyx1QkFBVSxDQUFDO29CQUMzRCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7SUFDbEMsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQTdFRCxDQUF5QyxnQ0FBbUIsR0E2RTNEO0FBN0VZLGtEQUFtQiJ9