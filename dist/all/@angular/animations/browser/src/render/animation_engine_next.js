"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animation_ast_builder_1 = require("../dsl/animation_ast_builder");
var animation_trigger_1 = require("../dsl/animation_trigger");
var shared_1 = require("./shared");
var timeline_animation_engine_1 = require("./timeline_animation_engine");
var transition_animation_engine_1 = require("./transition_animation_engine");
var AnimationEngine = (function () {
    function AnimationEngine(driver, normalizer) {
        var _this = this;
        this._triggerCache = {};
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = function (element, context) { };
        this._transitionEngine = new transition_animation_engine_1.TransitionAnimationEngine(driver, normalizer);
        this._timelineEngine = new timeline_animation_engine_1.TimelineAnimationEngine(driver, normalizer);
        this._transitionEngine.onRemovalComplete = function (element, context) {
            return _this.onRemovalComplete(element, context);
        };
    }
    AnimationEngine.prototype.registerTrigger = function (componentId, namespaceId, hostElement, name, metadata) {
        var cacheKey = componentId + '-' + name;
        var trigger = this._triggerCache[cacheKey];
        if (!trigger) {
            var errors = [];
            var ast = animation_ast_builder_1.buildAnimationAst(metadata, errors);
            if (errors.length) {
                throw new Error("The animation trigger \"" + name + "\" has failed to build due to the following errors:\n - " + errors.join("\n - "));
            }
            trigger = animation_trigger_1.buildTrigger(name, ast);
            this._triggerCache[cacheKey] = trigger;
        }
        this._transitionEngine.registerTrigger(namespaceId, name, trigger);
    };
    AnimationEngine.prototype.register = function (namespaceId, hostElement) {
        this._transitionEngine.register(namespaceId, hostElement);
    };
    AnimationEngine.prototype.destroy = function (namespaceId, context) {
        this._transitionEngine.destroy(namespaceId, context);
    };
    AnimationEngine.prototype.onInsert = function (namespaceId, element, parent, insertBefore) {
        this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
    };
    AnimationEngine.prototype.onRemove = function (namespaceId, element, context) {
        this._transitionEngine.removeNode(namespaceId, element, context);
    };
    AnimationEngine.prototype.disableAnimations = function (element, disable) {
        this._transitionEngine.markElementAsDisabled(element, disable);
    };
    AnimationEngine.prototype.process = function (namespaceId, element, property, value) {
        if (property.charAt(0) == '@') {
            var _a = shared_1.parseTimelineCommand(property), id = _a[0], action = _a[1];
            var args = value;
            this._timelineEngine.command(id, element, action, args);
        }
        else {
            this._transitionEngine.trigger(namespaceId, element, property, value);
        }
    };
    AnimationEngine.prototype.listen = function (namespaceId, element, eventName, eventPhase, callback) {
        // @@listen
        if (eventName.charAt(0) == '@') {
            var _a = shared_1.parseTimelineCommand(eventName), id = _a[0], action = _a[1];
            return this._timelineEngine.listen(id, element, action, callback);
        }
        return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
    };
    AnimationEngine.prototype.flush = function (microtaskId) {
        if (microtaskId === void 0) { microtaskId = -1; }
        this._transitionEngine.flush(microtaskId);
    };
    Object.defineProperty(AnimationEngine.prototype, "players", {
        get: function () {
            return this._transitionEngine.players
                .concat(this._timelineEngine.players);
        },
        enumerable: true,
        configurable: true
    });
    AnimationEngine.prototype.whenRenderingDone = function () { return this._transitionEngine.whenRenderingDone(); };
    return AnimationEngine;
}());
exports.AnimationEngine = AnimationEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2VuZ2luZV9uZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvYW5pbWF0aW9uX2VuZ2luZV9uZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0Esc0VBQStEO0FBQy9ELDhEQUF3RTtBQUl4RSxtQ0FBOEM7QUFDOUMseUVBQW9FO0FBQ3BFLDZFQUF3RTtBQUV4RTtJQVNFLHlCQUFZLE1BQXVCLEVBQUUsVUFBb0M7UUFBekUsaUJBTUM7UUFYTyxrQkFBYSxHQUFzQyxFQUFFLENBQUM7UUFFOUQsNkVBQTZFO1FBQ3RFLHNCQUFpQixHQUFHLFVBQUMsT0FBWSxFQUFFLE9BQVksSUFBTSxDQUFDLENBQUM7UUFHNUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksdURBQXlCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxtREFBdUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdkUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixHQUFHLFVBQUMsT0FBWSxFQUFFLE9BQVk7WUFDbEUsT0FBQSxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztRQUF4QyxDQUF3QyxDQUFDO0lBQy9DLENBQUM7SUFFRCx5Q0FBZSxHQUFmLFVBQ0ksV0FBbUIsRUFBRSxXQUFtQixFQUFFLFdBQWdCLEVBQUUsSUFBWSxFQUN4RSxRQUFrQztRQUNwQyxJQUFNLFFBQVEsR0FBRyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUMxQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNiLElB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