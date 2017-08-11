"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_ast_builder_1 = require("../dsl/animation_ast_builder");
var animation_timeline_builder_1 = require("../dsl/animation_timeline_builder");
var element_instruction_map_1 = require("../dsl/element_instruction_map");
var shared_1 = require("./shared");
var EMPTY_INSTRUCTION_MAP = new element_instruction_map_1.ElementInstructionMap();
var TimelineAnimationEngine = (function () {
    function TimelineAnimationEngine(_driver, _normalizer) {
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._animations = {};
        this._playersById = {};
        this.players = [];
    }
    TimelineAnimationEngine.prototype.register = function (id, metadata) {
        var errors = [];
        var ast = animation_ast_builder_1.buildAnimationAst(metadata, errors);
        if (errors.length) {
            throw new Error("Unable to build the animation due to the following errors: " + errors.join("\n"));
        }
        else {
            this._animations[id] = ast;
        }
    };
    TimelineAnimationEngine.prototype._buildPlayer = function (i, preStyles, postStyles) {
        var element = i.element;
        var keyframes = shared_1.normalizeKeyframes(this._driver, this._normalizer, element, i.keyframes, preStyles, postStyles);
        return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, []);
    };
    TimelineAnimationEngine.prototype.create = function (id, element, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var errors = [];
        var ast = this._animations[id];
        var instructions;
        var autoStylesMap = new Map();
        if (ast) {
            instructions = animation_timeline_builder_1.buildAnimationTimelines(this._driver, element, ast, {}, {}, options, EMPTY_INSTRUCTION_MAP, errors);
            instructions.forEach(function (inst) {
                var styles = shared_1.getOrSetAsInMap(autoStylesMap, inst.element, {});
                inst.postStyleProps.forEach(function (prop) { return styles[prop] = null; });
            });
        }
        else {
            errors.push('The requested animation doesn\'t exist or has already been destroyed');
            instructions = [];
        }
        if (errors.length) {
            throw new Error("Unable to create the animation due to the following errors: " + errors.join("\n"));
        }
        autoStylesMap.forEach(function (styles, element) {
            Object.keys(styles).forEach(function (prop) { styles[prop] = _this._driver.computeStyle(element, prop, animations_1.AUTO_STYLE); });
        });
        var players = instructions.map(function (i) {
            var styles = autoStylesMap.get(i.element);
            return _this._buildPlayer(i, {}, styles);
        });
        var player = shared_1.optimizeGroupPlayer(players);
        this._playersById[id] = player;
        player.onDestroy(function () { return _this.destroy(id); });
        this.players.push(player);
        return player;
    };
    TimelineAnimationEngine.prototype.destroy = function (id) {
        var player = this._getPlayer(id);
        player.destroy();
        delete this._playersById[id];
        var index = this.players.indexOf(player);
        if (index >= 0) {
            this.players.splice(index, 1);
        }
    };
    TimelineAnimationEngine.prototype._getPlayer = function (id) {
        var player = this._playersById[id];
        if (!player) {
            throw new Error("Unable to find the timeline player referenced by " + id);
        }
        return player;
    };
    TimelineAnimationEngine.prototype.listen = function (id, element, eventName, callback) {
        // triggerName, fromState, toState are all ignored for timeline animations
        var baseEvent = shared_1.makeAnimationEvent(element, '', '', '');
        shared_1.listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
        return function () { };
    };
    TimelineAnimationEngine.prototype.command = function (id, element, command, args) {
        if (command == 'register') {
            this.register(id, args[0]);
            return;
        }
        if (command == 'create') {
            var options = (args[0] || {});
            this.create(id, element, options);
            return;
        }
        var player = this._getPlayer(id);
        switch (command) {
            case 'play':
                player.play();
                break;
            case 'pause':
                player.pause();
                break;
            case 'reset':
                player.reset();
                break;
            case 'restart':
                player.restart();
                break;
            case 'finish':
                player.finish();
                break;
            case 'init':
                player.init();
                break;
            case 'setPosition':
                player.setPosition(parseFloat(args[0]));
                break;
            case 'destroy':
                this.destroy(id);
                break;
        }
    };
    return TimelineAnimationEngine;
}());
exports.TimelineAnimationEngine = TimelineAnimationEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBaUg7QUFHakgsc0VBQStEO0FBQy9ELGdGQUEwRTtBQUUxRSwwRUFBcUU7QUFJckUsbUNBQXNIO0FBRXRILElBQU0scUJBQXFCLEdBQUcsSUFBSSwrQ0FBcUIsRUFBRSxDQUFDO0FBRTFEO0lBS0UsaUNBQW9CLE9BQXdCLEVBQVUsV0FBcUM7UUFBdkUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBMEI7UUFKbkYsZ0JBQVcsR0FBd0IsRUFBRSxDQUFDO1FBQ3RDLGlCQUFZLEdBQW9DLEVBQUUsQ0FBQztRQUNwRCxZQUFPLEdBQXNCLEVBQUUsQ0FBQztJQUV1RCxDQUFDO0lBRS9GLDBDQUFRLEdBQVIsVUFBUyxFQUFVLEVBQUUsUUFBK0M7UUFDbEUsSUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLHlDQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUNYLGdFQUE4RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7UUFDekYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFFTyw4Q0FBWSxHQUFwQixVQUNJLENBQStCLEVBQUUsU0FBcUIsRUFDdEQs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