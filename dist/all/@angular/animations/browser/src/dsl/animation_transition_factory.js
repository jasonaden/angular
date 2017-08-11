"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../render/shared");
var util_1 = require("../util");
var animation_timeline_builder_1 = require("./animation_timeline_builder");
var animation_transition_instruction_1 = require("./animation_transition_instruction");
var EMPTY_OBJECT = {};
var AnimationTransitionFactory = (function () {
    function AnimationTransitionFactory(_triggerName, ast, _stateStyles) {
        this._triggerName = _triggerName;
        this.ast = ast;
        this._stateStyles = _stateStyles;
    }
    AnimationTransitionFactory.prototype.match = function (currentState, nextState) {
        return oneOrMoreTransitionsMatch(this.ast.matchers, currentState, nextState);
    };
    AnimationTransitionFactory.prototype.buildStyles = function (stateName, params, errors) {
        var backupStateStyler = this._stateStyles['*'];
        var stateStyler = this._stateStyles[stateName];
        var backupStyles = backupStateStyler ? backupStateStyler.buildStyles(params, errors) : {};
        return stateStyler ? stateStyler.buildStyles(params, errors) : backupStyles;
    };
    AnimationTransitionFactory.prototype.build = function (driver, element, currentState, nextState, currentOptions, nextOptions, subInstructions) {
        var errors = [];
        var transitionAnimationParams = this.ast.options && this.ast.options.params || EMPTY_OBJECT;
        var currentAnimationParams = currentOptions && currentOptions.params || EMPTY_OBJECT;
        var currentStateStyles = this.buildStyles(currentState, currentAnimationParams, errors);
        var nextAnimationParams = nextOptions && nextOptions.params || EMPTY_OBJECT;
        var nextStateStyles = this.buildStyles(nextState, nextAnimationParams, errors);
        var queriedElements = new Set();
        var preStyleMap = new Map();
        var postStyleMap = new Map();
        var isRemoval = nextState === 'void';
        var animationOptions = { params: __assign({}, transitionAnimationParams, nextAnimationParams) };
        var timelines = animation_timeline_builder_1.buildAnimationTimelines(driver, element, this.ast.animation, currentStateStyles, nextStateStyles, animationOptions, subInstructions, errors);
        if (errors.length) {
            return animation_transition_instruction_1.createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, [], [], preStyleMap, postStyleMap, errors);
        }
        timelines.forEach(function (tl) {
            var elm = tl.element;
            var preProps = shared_1.getOrSetAsInMap(preStyleMap, elm, {});
            tl.preStyleProps.forEach(function (prop) { return preProps[prop] = true; });
            var postProps = shared_1.getOrSetAsInMap(postStyleMap, elm, {});
            tl.postStyleProps.forEach(function (prop) { return postProps[prop] = true; });
            if (elm !== element) {
                queriedElements.add(elm);
            }
        });
        var queriedElementsList = util_1.iteratorToArray(queriedElements.values());
        return animation_transition_instruction_1.createTransitionInstruction(element, this._triggerName, currentState, nextState, isRemoval, currentStateStyles, nextStateStyles, timelines, queriedElementsList, preStyleMap, postStyleMap);
    };
    return AnimationTransitionFactory;
}());
exports.AnimationTransitionFactory = AnimationTransitionFactory;
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState) {
    return matchFns.some(function (fn) { return fn(currentState, nextState); });
}
var AnimationStateStyles = (function () {
    function AnimationStateStyles(styles, defaultParams) {
        this.styles = styles;
        this.defaultParams = defaultParams;
    }
    AnimationStateStyles.prototype.buildStyles = function (params, errors) {
        var finalStyles = {};
        var combinedParams = util_1.copyObj(this.defaultParams);
        Object.keys(params).forEach(function (key) {
            var value = params[key];
            if (value != null) {
                combinedParams[key] = value;
            }
        });
        this.styles.styles.forEach(function (value) {
            if (typeof value !== 'string') {
                var styleObj_1 = value;
                Object.keys(styleObj_1).forEach(function (prop) {
                    var val = styleObj_1[prop];
                    if (val.length > 1) {
                        val = util_1.interpolateParams(val, combinedParams, errors);
                    }
                    finalStyles[prop] = val;
                });
            }
        });
        return finalStyles;
    };
    return AnimationStateStyles;
}());
exports.AnimationStateStyles = AnimationStateStyles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVVBLDJDQUFpRDtBQUNqRCxnQ0FBMkY7QUFHM0YsMkVBQXFFO0FBRXJFLHVGQUErRztBQUcvRyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFFeEI7SUFDRSxvQ0FDWSxZQUFvQixFQUFTLEdBQWtCLEVBQy9DLFlBQXlEO1FBRHpELGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUMvQyxpQkFBWSxHQUFaLFlBQVksQ0FBNkM7SUFBRyxDQUFDO0lBRXpFLDBDQUFLLEdBQUwsVUFBTSxZQUFpQixFQUFFLFNBQWM7UUFDckMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsZ0RBQVcsR0FBWCxVQUFZLFNBQWlCLEVBQUUsTUFBNEIsRUFBRSxNQUFhO1FBQ3hFLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQU0sWUFBWSxHQUFHLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzVGLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDO0lBQzlFLENBQUM7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