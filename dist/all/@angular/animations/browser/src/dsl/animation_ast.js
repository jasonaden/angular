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
var EMPTY_ANIMATION_OPTIONS = {};
var Ast = (function () {
    function Ast() {
        this.options = EMPTY_ANIMATION_OPTIONS;
    }
    Object.defineProperty(Ast.prototype, "params", {
        get: function () { return this.options['params'] || null; },
        enumerable: true,
        configurable: true
    });
    return Ast;
}());
exports.Ast = Ast;
var TriggerAst = (function (_super) {
    __extends(TriggerAst, _super);
    function TriggerAst(name, states, transitions) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.states = states;
        _this.transitions = transitions;
        _this.queryCount = 0;
        _this.depCount = 0;
        return _this;
    }
    TriggerAst.prototype.visit = function (visitor, context) { return visitor.visitTrigger(this, context); };
    return TriggerAst;
}(Ast));
exports.TriggerAst = TriggerAst;
var StateAst = (function (_super) {
    __extends(StateAst, _super);
    function StateAst(name, style) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.style = style;
        return _this;
    }
    StateAst.prototype.visit = function (visitor, context) { return visitor.visitState(this, context); };
    return StateAst;
}(Ast));
exports.StateAst = StateAst;
var TransitionAst = (function (_super) {
    __extends(TransitionAst, _super);
    function TransitionAst(matchers, animation) {
        var _this = _super.call(this) || this;
        _this.matchers = matchers;
        _this.animation = animation;
        _this.queryCount = 0;
        _this.depCount = 0;
        return _this;
    }
    TransitionAst.prototype.visit = function (visitor, context) { return visitor.visitTransition(this, context); };
    return TransitionAst;
}(Ast));
exports.TransitionAst = TransitionAst;
var SequenceAst = (function (_super) {
    __extends(SequenceAst, _super);
    function SequenceAst(steps) {
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    SequenceAst.prototype.visit = function (visitor, context) { return visitor.visitSequence(this, context); };
    return SequenceAst;
}(Ast));
exports.SequenceAst = SequenceAst;
var GroupAst = (function (_super) {
    __extends(GroupAst, _super);
    function GroupAst(steps) {
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    GroupAst.prototype.visit = function (visitor, context) { return visitor.visitGroup(this, context); };
    return GroupAst;
}(Ast));
exports.GroupAst = GroupAst;
var AnimateAst = (function (_super) {
    __extends(AnimateAst, _super);
    function AnimateAst(timings, style) {
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.style = style;
        return _this;
    }
    AnimateAst.prototype.visit = function (visitor, context) { return visitor.visitAnimate(this, context); };
    return AnimateAst;
}(Ast));
exports.AnimateAst = AnimateAst;
var StyleAst = (function (_super) {
    __extends(StyleAst, _super);
    function StyleAst(styles, easing, offset) {
        var _this = _super.call(this) || this;
        _this.styles = styles;
        _this.easing = easing;
        _this.offset = offset;
        _this.isEmptyStep = false;
        _this.containsDynamicStyles = false;
        return _this;
    }
    StyleAst.prototype.visit = function (visitor, context) { return visitor.visitStyle(this, context); };
    return StyleAst;
}(Ast));
exports.StyleAst = StyleAst;
var KeyframesAst = (function (_super) {
    __extends(KeyframesAst, _super);
    function KeyframesAst(styles) {
        var _this = _super.call(this) || this;
        _this.styles = styles;
        return _this;
    }
    KeyframesAst.prototype.visit = function (visitor, context) { return visitor.visitKeyframes(this, context); };
    return KeyframesAst;
}(Ast));
exports.KeyframesAst = KeyframesAst;
var ReferenceAst = (function (_super) {
    __extends(ReferenceAst, _super);
    function ReferenceAst(animation) {
        var _this = _super.call(this) || this;
        _this.animation = animation;
        return _this;
    }
    ReferenceAst.prototype.visit = function (visitor, context) { return visitor.visitReference(this, context); };
    return ReferenceAst;
}(Ast));
exports.ReferenceAst = ReferenceAst;
var AnimateChildAst = (function (_super) {
    __extends(AnimateChildAst, _super);
    function AnimateChildAst() {
        return _super.call(this) || this;
    }
    AnimateChildAst.prototype.visit = function (visitor, context) { return visitor.visitAnimateChild(this, context); };
    return AnimateChildAst;
}(Ast));
exports.AnimateChildAst = AnimateChildAst;
var AnimateRefAst = (function (_super) {
    __extends(AnimateRefAst, _super);
    function AnimateRefAst(animation) {
        var _this = _super.call(this) || this;
        _this.animation = animation;
        return _this;
    }
    AnimateRefAst.prototype.visit = function (visitor, context) { return visitor.visitAnimateRef(this, context); };
    return AnimateRefAst;
}(Ast));
exports.AnimateRefAst = AnimateRefAst;
var QueryAst = (function (_super) {
    __extends(QueryAst, _super);
    function QueryAst(selector, limit, optional, includeSelf, animation) {
        var _this = _super.call(this) || this;
        _this.selector = selector;
        _this.limit = limit;
        _this.optional = optional;
        _this.includeSelf = includeSelf;
        _this.animation = animation;
        return _this;
    }
    QueryAst.prototype.visit = function (visitor, context) { return visitor.visitQuery(this, context); };
    return QueryAst;
}(Ast));
exports.QueryAst = QueryAst;
var StaggerAst = (function (_super) {
    __extends(StaggerAst, _super);
    function StaggerAst(timings, animation) {
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.animation = animation;
        return _this;
    }
    StaggerAst.prototype.visit = function (visitor, context) { return visitor.visitStagger(this, context); };
    return StaggerAst;
}(Ast));
exports.StaggerAst = StaggerAst;
var TimingAst = (function (_super) {
    __extends(TimingAst, _super);
    function TimingAst(duration, delay, easing) {
        if (delay === void 0) { delay = 0; }
        if (easing === void 0) { easing = null; }
        var _this = _super.call(this) || this;
        _this.duration = duration;
        _this.delay = delay;
        _this.easing = easing;
        return _this;
    }
    TimingAst.prototype.visit = function (visitor, context) { return visitor.visitTiming(this, context); };
    return TimingAst;
}(Ast));
exports.TimingAst = TimingAst;
var DynamicTimingAst = (function (_super) {
    __extends(DynamicTimingAst, _super);
    function DynamicTimingAst(value) {
        var _this = _super.call(this, 0, 0, '') || this;
        _this.value = value;
        return _this;
    }
    DynamicTimingAst.prototype.visit = function (visitor, context) { return visitor.visitTiming(this, context); };
    return DynamicTimingAst;
}(TimingAst));
exports.DynamicTimingAst = DynamicTimingAst;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBU0EsSUFBTSx1QkFBdUIsR0FBcUIsRUFBRSxDQUFDO0FBbUJyRDtJQUFBO1FBRVMsWUFBTyxHQUFxQix1QkFBdUIsQ0FBQztJQUc3RCxDQUFDO0lBREMsc0JBQUksdUJBQU07YUFBVixjQUEyQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNyRixVQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMcUIsa0JBQUc7QUFPekI7SUFBZ0MsOEJBQUc7SUFJakMsb0JBQW1CLElBQVksRUFBUyxNQUFrQixFQUFTLFdBQTRCO1FBQS9GLFlBQ0UsaUJBQU8sU0FDUjtRQUZrQixVQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTSxHQUFOLE1BQU0sQ0FBWTtRQUFTLGlCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUh4RixnQkFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixjQUFRLEdBQVcsQ0FBQyxDQUFDOztJQUk1QixDQUFDO0lBRUQsMEJBQUssR0FBTCxVQUFNLE9BQW1CLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0YsaUJBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBZ0MsR0FBRyxHQVNsQztBQVRZLGdDQUFVO0FBV3ZCO0lBQThCLDRCQUFHO0lBQy9CLGtCQUFtQixJQUFZLEVBQVMsS0FBZTtRQUF2RCxZQUEyRCxpQkFBTyxTQUFHO1FBQWxELFVBQUksR0FBSixJQUFJLENBQVE7UUFBUyxXQUFLLEdBQUws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