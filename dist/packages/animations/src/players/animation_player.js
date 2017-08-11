/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { scheduleMicroTask } from '../util';
/**
 * AnimationPlayer controls an animation sequence that was produced from a programmatic animation.
 * (see {\@link AnimationBuilder AnimationBuilder} for more information on how to create programmatic
 * animations.)
 *
 * \@experimental Animation support is experimental.
 * @record
 */
export function AnimationPlayer() { }
function AnimationPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationPlayer.prototype.onDone;
    /** @type {?} */
    AnimationPlayer.prototype.onStart;
    /** @type {?} */
    AnimationPlayer.prototype.onDestroy;
    /** @type {?} */
    AnimationPlayer.prototype.init;
    /** @type {?} */
    AnimationPlayer.prototype.hasStarted;
    /** @type {?} */
    AnimationPlayer.prototype.play;
    /** @type {?} */
    AnimationPlayer.prototype.pause;
    /** @type {?} */
    AnimationPlayer.prototype.restart;
    /** @type {?} */
    AnimationPlayer.prototype.finish;
    /** @type {?} */
    AnimationPlayer.prototype.destroy;
    /** @type {?} */
    AnimationPlayer.prototype.reset;
    /** @type {?} */
    AnimationPlayer.prototype.setPosition;
    /** @type {?} */
    AnimationPlayer.prototype.getPosition;
    /** @type {?} */
    AnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    AnimationPlayer.prototype.totalTime;
    /** @type {?|undefined} */
    AnimationPlayer.prototype.beforeDestroy;
}
/**
 * \@experimental Animation support is experimental.
 */
export class NoopAnimationPlayer {
    constructor() {
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this._destroyed = false;
        this._finished = false;
        this.parentPlayer = null;
        this.totalTime = 0;
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
    hasStarted() { return this._started; }
    /**
     * @return {?}
     */
    init() { }
    /**
     * @return {?}
     */
    play() {
        if (!this.hasStarted()) {
            this.triggerMicrotask();
            this._onStart();
        }
        this._started = true;
    }
    /**
     * @return {?}
     */
    triggerMicrotask() { scheduleMicroTask(() => this._onFinish()); }
    /**
     * @return {?}
     */
    _onStart() {
        this._onStartFns.forEach(fn => fn());
        this._onStartFns = [];
    }
    /**
     * @return {?}
     */
    pause() { }
    /**
     * @return {?}
     */
    restart() { }
    /**
     * @return {?}
     */
    finish() { this._onFinish(); }
    /**
     * @return {?}
     */
    destroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            if (!this.hasStarted()) {
                this._onStart();
            }
            this.finish();
            this._onDestroyFns.forEach(fn => fn());
            this._onDestroyFns = [];
        }
    }
    /**
     * @return {?}
     */
    reset() { }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) { }
    /**
     * @return {?}
     */
    getPosition() { return 0; }
}
function NoopAnimationPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    NoopAnimationPlayer.prototype._onDoneFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._onStartFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._onDestroyFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._started;
    /** @type {?} */
    NoopAnimationPlayer.prototype._destroyed;
    /** @type {?} */
    NoopAnimationPlayer.prototype._finished;
    /** @type {?} */
    NoopAnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    NoopAnimationPlayer.prototype.totalTime;
}
//# sourceMappingURL=animation_player.js.map