"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var WebAnimationsPlayer = (function () {
    function WebAnimationsPlayer(element, keyframes, options, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var _this = this;
        this.element = element;
        this.keyframes = keyframes;
        this.options = options;
        this.previousPlayers = previousPlayers;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._initialized = false;
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this.time = 0;
        this.parentPlayer = null;
        this.previousStyles = {};
        this.currentSnapshot = {};
        this._duration = options['duration'];
        this._delay = options['delay'] || 0;
        this.time = this._duration + this._delay;
        if (util_1.allowPreviousPlayerStylesMerge(this._duration, this._delay)) {
            previousPlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return _this.previousStyles[prop] = styles[prop]; });
            });
        }
    }
    WebAnimationsPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    WebAnimationsPlayer.prototype.init = function () {
        this._buildPlayer();
        this._preparePlayerBeforeStart();
    };
    WebAnimationsPlayer.prototype._buildPlayer = function () {
        var _this = this;
        if (this._initialized)
            return;
        this._initialized = true;
        var keyframes = this.keyframes.map(function (styles) { return util_1.copyStyles(styles, false); });
        var previousStyleProps = Object.keys(this.previousStyles);
        if (previousStyleProps.length) {
            var startingKeyframe_1 = keyframes[0];
            var missingStyleProps_1 = [];
            previousStyleProps.forEach(function (prop) {
                if (!startingKeyframe_1.hasOwnProperty(prop)) {
                    missingStyleProps_1.push(prop);
                }
                startingKeyframe_1[prop] = _this.previousStyles[prop];
            });
            if (missingStyleProps_1.length) {
                var self_1 = this;
                var _loop_1 = function () {
                    var kf = keyframes[i];
                    missingStyleProps_1.forEach(function (prop) {
                        kf[prop] = _computeStyle(self_1.element, prop);
                    });
                };
                // tslint:disable-next-line
                for (var i = 1; i < keyframes.length; i++) {
                    _loop_1();
                }
            }
        }
        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
        this._finalKeyframe = keyframes.length ? keyframes[keyframes.length - 1] : {};
        this._player.addEventListener('finish', function () { return _this._onFinish(); });
    };
    WebAnimationsPlayer.prototype._preparePlayerBeforeStart = function () {
        // this is required so that the player doesn't start to animate right away
        if (this._delay) {
            this._resetDomPlayerState();
        }
        else {
            this._player.pause();
        }
    };
    /** @internal */
    WebAnimationsPlayer.prototype._triggerWebAnimation = function (element, keyframes, options) {
        // jscompiler doesn't seem to know animate is a native property because it's not fully
        // supported yet across common browsers (we polyfill it for Edge/Safari) [CL #143630929]
        return element['animate'](keyframes, options);
    };
    Object.defineProperty(WebAnimationsPlayer.prototype, "domPlayer", {
        get: function () { return this._player; },
        enumerable: true,
        configurable: true
    });
    WebAnimationsPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    WebAnimationsPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    WebAnimationsPlayer.prototype.onDestroy = function (fn) { this._onDestroyFns.push(fn); };
    WebAnimationsPlayer.prototype.play = function () {
        this._buildPlayer();
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
            this._started = true;
        }
        this._player.play();
    };
    WebAnimationsPlayer.prototype.pause = function () {
        this.init();
        this._player.pause();
    };
    WebAnimationsPlayer.prototype.finish = function () {
        this.init();
        this._onFinish();
        this._player.finish();
    };
    WebAnimationsPlayer.prototype.reset = function () {
        this._resetDomPlayerState();
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    };
    WebAnimationsPlayer.prototype._resetDomPlayerState = function () {
        if (this._player) {
            this._player.cancel();
        }
    };
    WebAnimationsPlayer.prototype.restart = function () {
        this.reset();
        this.play();
    };
    WebAnimationsPlayer.prototype.hasStarted = function () { return this._started; };
    WebAnimationsPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._resetDomPlayerState();
            this._onFinish();
            this._destroyed = true;
            this._onDestroyFns.forEach(function (fn) { return fn(); });
            this._onDestroyFns = [];
        }
    };
    WebAnimationsPlayer.prototype.setPosition = function (p) { this._player.currentTime = p * this.time; };
    WebAnimationsPlayer.prototype.getPosition = function () { return this._player.currentTime / this.time; };
    Object.defineProperty(WebAnimationsPlayer.prototype, "totalTime", {
        get: function () { return this._delay + this._duration; },
        enumerable: true,
        configurable: true
    });
    WebAnimationsPlayer.prototype.beforeDestroy = function () {
        var _this = this;
        var styles = {};
        if (this.hasStarted()) {
            Object.keys(this._finalKeyframe).forEach(function (prop) {
                if (prop != 'offset') {
                    styles[prop] =
                        _this._finished ? _this._finalKeyframe[prop] : _computeStyle(_this.element, prop);
                }
            });
        }
        this.currentSnapshot = styles;
    };
    return WebAnimationsPlayer;
}());
exports.WebAnimationsPlayer = WebAnimationsPlayer;
function _computeStyle(element, prop) {
    return window.getComputedStyle(element)[prop];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfcGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfcGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsbUNBQXNFO0FBSXRFO0lBa0JFLDZCQUNXLE9BQVksRUFBUyxTQUE2QyxFQUNsRSxPQUF5QyxFQUN4QyxlQUEyQztRQUEzQyxnQ0FBQSxFQUFBLG9CQUEyQztRQUh2RCxpQkFjQztRQWJVLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFvQztRQUNsRSxZQUFPLEdBQVAsT0FBTyxDQUFrQztRQUN4QyxvQkFBZSxHQUFmLGVBQWUsQ0FBNEI7UUFwQi9DLGVBQVUsR0FBZSxFQUFFLENBQUM7UUFDNUIsZ0JBQVcsR0FBZSxFQUFFLENBQUM7UUFDN0Isa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFJL0IsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFcEIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUVULGlCQUFZLEdBQXlCLElBQUksQ0FBQztRQUMxQyxtQkFBYyxHQUEyQyxFQUFFLENBQUM7UUFDNUQsb0JBQWUsR0FBMkMsRUFBRSxDQUFDO1FBTWxFLElBQUksQ0FBQyxTQUFTLEdBQVcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQVcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUV6QyxFQUFF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