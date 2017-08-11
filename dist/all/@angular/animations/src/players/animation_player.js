"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var util_1 = require("../util");
/**
 * @experimental Animation support is experimental.
 */
var NoopAnimationPlayer = (function () {
    function NoopAnimationPlayer() {
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this._destroyed = false;
        this._finished = false;
        this.parentPlayer = null;
        this.totalTime = 0;
    }
    NoopAnimationPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    NoopAnimationPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    NoopAnimationPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    NoopAnimationPlayer.prototype.onDestroy = function (fn) { this._onDestroyFns.push(fn); };
    NoopAnimationPlayer.prototype.hasStarted = function () { return this._started; };
    NoopAnimationPlayer.prototype.init = function () { };
    NoopAnimationPlayer.prototype.play = function () {
        if (!this.hasStarted()) {
            this.triggerMicrotask();
            this._onStart();
        }
        this._started = true;
    };
    /* @internal */
    NoopAnimationPlayer.prototype.triggerMicrotask = function () {
        var _this = this;
        util_1.scheduleMicroTask(function () { return _this._onFinish(); });
    };
    NoopAnimationPlayer.prototype._onStart = function () {
        this._onStartFns.forEach(function (fn) { return fn(); });
        this._onStartFns = [];
    };
    NoopAnimationPlayer.prototype.pause = function () { };
    NoopAnimationPlayer.prototype.restart = function () { };
    NoopAnimationPlayer.prototype.finish = function () { this._onFinish(); };
    NoopAnimationPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._destroyed = true;
            if (!this.hasStarted()) {
                this._onStart();
            }
            this.finish();
            this._onDestroyFns.forEach(function (fn) { return fn(); });
            this._onDestroyFns = [];
        }
    };
    NoopAnimationPlayer.prototype.reset = function () { };
    NoopAnimationPlayer.prototype.setPosition = function (p) { };
    NoopAnimationPlayer.prototype.getPosition = function () { return 0; };
    return NoopAnimationPlayer;
}());
exports.NoopAnimationPlayer = NoopAnimationPlayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3BsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL3BsYXllcnMvYW5pbWF0aW9uX3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGdDQUEwQztBQTRCMUM7O0dBRUc7QUFDSDtJQVNFO1FBUlEsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQUM1QixnQkFBVyxHQUFlLEVBQUUsQ0FBQztRQUM3QixrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNuQixpQkFBWSxHQUF5QixJQUFJLENBQUM7UUFDMUMsY0FBUyxHQUFHLENBQUMsQ0FBQztJQUNOLENBQUM7SUFDUix1Q0FBUyxHQUFqQjtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLEVBQUUsRUFBSixDQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUNELHFDQUFPLEdBQVAsVUFBUSxFQUFjLElBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELG9DQUFNLEdBQU4sVUFBTyxFQUFjLElBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELHVDQUFTLEdBQVQsVUFBVSxFQUFjLElBQVUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLHdDQUFVLEdBQVYsY0FBd0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9DLGtDQUFJLEdBQUosY0FBYyxDQUFDO0lBQ2Ysa0NBQUksR0FBSjtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxlQUFlO0lBQ2YsOENBQWdCLEdBQWhCO1FBQUEsaUJBQWlFO1FBQTVDLHdCQUFpQixDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxFQUFFLEVBQWhCLENBQWdCLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFekQsc0NBQVEsR0FBaEI7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxtQ0FBSyxHQUFMLGNBQWUsQ0FBQztJQUNoQixxQ0FBTyxHQUFQLGNBQWlCLENBQUM7SUFDbEIsb0NBQU0sR0FBTixjQUFpQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLHFDQUFPLEdBQVA7UUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBQ0QsbUNBQUssR0FBTCxjQUFlLENBQUM7SUFDaEIseUNBQVcsR0FBWCxVQUFZLENBQVMsSUFBUyxDQUFDO0lBQy9CLHlDQUFXLEdBQVgsY0FBd0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsMEJBQUM7QUFBRCxDQUFDLEFBdkRELElBdURDO0FBdkRZLGtEQUFtQiJ9