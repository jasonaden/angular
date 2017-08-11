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
export class AnimationGroupPlayer {
    /**
     * @param {?} _players
     */
    constructor(_players) {
        this._players = _players;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this._onDestroyFns = [];
        this.parentPlayer = null;
        this.totalTime = 0;
        let /** @type {?} */ doneCount = 0;
        let /** @type {?} */ destroyCount = 0;
        let /** @type {?} */ startCount = 0;
        const /** @type {?} */ total = this._players.length;
        if (total == 0) {
            scheduleMicroTask(() => this._onFinish());
        }
        else {
            this._players.forEach(player => {
                player.parentPlayer = this;
                player.onDone(() => {
                    if (++doneCount >= total) {
                        this._onFinish();
                    }
                });
                player.onDestroy(() => {
                    if (++destroyCount >= total) {
                        this._onDestroy();
                    }
                });
                player.onStart(() => {
                    if (++startCount >= total) {
                        this._onStart();
                    }
                });
            });
        }
        this.totalTime = this._players.reduce((time, player) => Math.max(time, player.totalTime), 0);
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
    init() { this._players.forEach(player => player.init()); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) { this._onStartFns.push(fn); }
    /**
     * @return {?}
     */
    _onStart() {
        if (!this.hasStarted()) {
            this._onStartFns.forEach(fn => fn());
            this._onStartFns = [];
            this._started = true;
        }
    }
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
    play() {
        if (!this.parentPlayer) {
            this.init();
        }
        this._onStart();
        this._players.forEach(player => player.play());
    }
    /**
     * @return {?}
     */
    pause() { this._players.forEach(player => player.pause()); }
    /**
     * @return {?}
     */
    restart() { this._players.forEach(player => player.restart()); }
    /**
     * @return {?}
     */
    finish() {
        this._onFinish();
        this._players.forEach(player => player.finish());
    }
    /**
     * @return {?}
     */
    destroy() { this._onDestroy(); }
    /**
     * @return {?}
     */
    _onDestroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            this._onFinish();
            this._players.forEach(player => player.destroy());
            this._onDestroyFns.forEach(fn => fn());
            this._onDestroyFns = [];
        }
    }
    /**
     * @return {?}
     */
    reset() {
        this._players.forEach(player => player.reset());
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) {
        const /** @type {?} */ timeAtPosition = p * this.totalTime;
        this._players.forEach(player => {
            const /** @type {?} */ position = player.totalTime ? Math.min(1, timeAtPosition / player.totalTime) : 1;
            player.setPosition(position);
        });
    }
    /**
     * @return {?}
     */
    getPosition() {
        let /** @type {?} */ min = 0;
        this._players.forEach(player => {
            const /** @type {?} */ p = player.getPosition();
            min = Math.min(p, min);
        });
        return min;
    }
    /**
     * @return {?}
     */
    get players() { return this._players; }
    /**
     * @return {?}
     */
    beforeDestroy() {
        this.players.forEach(player => {
            if (player.beforeDestroy) {
                player.beforeDestroy();
            }
        });
    }
}
function AnimationGroupPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationGroupPlayer.prototype._onDoneFns;
    /** @type {?} */
    AnimationGroupPlayer.prototype._onStartFns;
    /** @type {?} */
    AnimationGroupPlayer.prototype._finished;
    /** @type {?} */
    AnimationGroupPlayer.prototype._started;
    /** @type {?} */
    AnimationGroupPlayer.prototype._destroyed;
    /** @type {?} */
    AnimationGroupPlayer.prototype._onDestroyFns;
    /** @type {?} */
    AnimationGroupPlayer.prototype.parentPlayer;
    /** @type {?} */
    AnimationGroupPlayer.prototype.totalTime;
    /** @type {?} */
    AnimationGroupPlayer.prototype._players;
}
//# sourceMappingURL=animation_group_player.js.map