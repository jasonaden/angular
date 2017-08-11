/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { allowPreviousPlayerStylesMerge, copyStyles } from '../../util';
export class WebAnimationsPlayer {
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @param {?=} previousPlayers
     */
    constructor(element, keyframes, options, previousPlayers = []) {
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
        this._duration = (options['duration']);
        this._delay = (options['delay']) || 0;
        this.time = this._duration + this._delay;
        if (allowPreviousPlayerStylesMerge(this._duration, this._delay)) {
            previousPlayers.forEach(player => {
                let /** @type {?} */ styles = player.currentSnapshot;
                Object.keys(styles).forEach(prop => this.previousStyles[prop] = styles[prop]);
            });
        }
    }
    /**
     * @return {?}
     */
    _onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(fn => fn());
            this._onDoneFns = [];
        }
    }
    /**
     * @return {?}
     */
    init() {
        this._buildPlayer();
        this._preparePlayerBeforeStart();
    }
    /**
     * @return {?}
     */
    _buildPlayer() {
        if (this._initialized)
            return;
        this._initialized = true;
        const /** @type {?} */ keyframes = this.keyframes.map(styles => copyStyles(styles, false));
        const /** @type {?} */ previousStyleProps = Object.keys(this.previousStyles);
        if (previousStyleProps.length) {
            let /** @type {?} */ startingKeyframe = keyframes[0];
            let /** @type {?} */ missingStyleProps = [];
            previousStyleProps.forEach(prop => {
                if (!startingKeyframe.hasOwnProperty(prop)) {
                    missingStyleProps.push(prop);
                }
                startingKeyframe[prop] = this.previousStyles[prop];
            });
            if (missingStyleProps.length) {
                const /** @type {?} */ self = this;
                // tslint:disable-next-line
                for (var /** @type {?} */ i = 1; i < keyframes.length; i++) {
                    let /** @type {?} */ kf = keyframes[i];
                    missingStyleProps.forEach(function (prop) {
                        kf[prop] = _computeStyle(self.element, prop);
                    });
                }
            }
        }
        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
        this._finalKeyframe = keyframes.length ? keyframes[keyframes.length - 1] : {};
        this._player.addEventListener('finish', () => this._onFinish());
    }
    /**
     * @return {?}
     */
    _preparePlayerBeforeStart() {
        // this is required so that the player doesn't start to animate right away
        if (this._delay) {
            this._resetDomPlayerState();
        }
        else {
            this._player.pause();
        }
    }
    /**
     * \@internal
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @return {?}
     */
    _triggerWebAnimation(element, keyframes, options) {
        // jscompiler doesn't seem to know animate is a native property because it's not fully
        // supported yet across common browsers (we polyfill it for Edge/Safari) [CL #143630929]
        return (element['animate'](keyframes, options));
    }
    /**
     * @return {?}
     */
    get domPlayer() { return this._player; }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) { this._onStartFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDone(fn) { this._onDoneFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDestroy(fn) { this._onDestroyFns.push(fn); }
    /**
     * @return {?}
     */
    play() {
        this._buildPlayer();
        if (!this.hasStarted()) {
            this._onStartFns.forEach(fn => fn());
            this._onStartFns = [];
            this._started = true;
        }
        this._player.play();
    }
    /**
     * @return {?}
     */
    pause() {
        this.init();
        this._player.pause();
    }
    /**
     * @return {?}
     */
    finish() {
        this.init();
        this._onFinish();
        this._player.finish();
    }
    /**
     * @return {?}
     */
    reset() {
        this._resetDomPlayerState();
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    }
    /**
     * @return {?}
     */
    _resetDomPlayerState() {
        if (this._player) {
            this._player.cancel();
        }
    }
    /**
     * @return {?}
     */
    restart() {
        this.reset();
        this.play();
    }
    /**
     * @return {?}
     */
    hasStarted() { return this._started; }
    /**
     * @return {?}
     */
    destroy() {
        if (!this._destroyed) {
            this._resetDomPlayerState();
            this._onFinish();
            this._destroyed = true;
            this._onDestroyFns.forEach(fn => fn());
            this._onDestroyFns = [];
        }
    }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) { this._player.currentTime = p * this.time; }
    /**
     * @return {?}
     */
    getPosition() { return this._player.currentTime / this.time; }
    /**
     * @return {?}
     */
    get totalTime() { return this._delay + this._duration; }
    /**
     * @return {?}
     */
    beforeDestroy() {
        const /** @type {?} */ styles = {};
        if (this.hasStarted()) {
            Object.keys(this._finalKeyframe).forEach(prop => {
                if (prop != 'offset') {
                    styles[prop] =
                        this._finished ? this._finalKeyframe[prop] : _computeStyle(this.element, prop);
                }
            });
        }
        this.currentSnapshot = styles;
    }
}
function WebAnimationsPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    WebAnimationsPlayer.prototype._onDoneFns;
    /** @type {?} */
    WebAnimationsPlayer.prototype._onStartFns;
    /** @type {?} */
    WebAnimationsPlayer.prototype._onDestroyFns;
    /** @type {?} */
    WebAnimationsPlayer.prototype._player;
    /** @type {?} */
    WebAnimationsPlayer.prototype._duration;
    /** @type {?} */
    WebAnimationsPlayer.prototype._delay;
    /** @type {?} */
    WebAnimationsPlayer.prototype._initialized;
    /** @type {?} */
    WebAnimationsPlayer.prototype._finished;
    /** @type {?} */
    WebAnimationsPlayer.prototype._started;
    /** @type {?} */
    WebAnimationsPlayer.prototype._destroyed;
    /** @type {?} */
    WebAnimationsPlayer.prototype._finalKeyframe;
    /** @type {?} */
    WebAnimationsPlayer.prototype.time;
    /** @type {?} */
    WebAnimationsPlayer.prototype.parentPlayer;
    /** @type {?} */
    WebAnimationsPlayer.prototype.previousStyles;
    /** @type {?} */
    WebAnimationsPlayer.prototype.currentSnapshot;
    /** @type {?} */
    WebAnimationsPlayer.prototype.element;
    /** @type {?} */
    WebAnimationsPlayer.prototype.keyframes;
    /** @type {?} */
    WebAnimationsPlayer.prototype.options;
    /** @type {?} */
    WebAnimationsPlayer.prototype.previousPlayers;
}
/**
 * @param {?} element
 * @param {?} prop
 * @return {?}
 */
function _computeStyle(element, prop) {
    return ((window.getComputedStyle(element)))[prop];
}
//# sourceMappingURL=web_animations_player.js.map