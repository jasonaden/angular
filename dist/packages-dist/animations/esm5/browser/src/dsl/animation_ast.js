/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
var /** @type {?} */ EMPTY_ANIMATION_OPTIONS = {};
/**
 * @record
 */
export function AstVisitor() { }
function AstVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    AstVisitor.prototype.visitTrigger;
    /** @type {?} */
    AstVisitor.prototype.visitState;
    /** @type {?} */
    AstVisitor.prototype.visitTransition;
    /** @type {?} */
    AstVisitor.prototype.visitSequence;
    /** @type {?} */
    AstVisitor.prototype.visitGroup;
    /** @type {?} */
    AstVisitor.prototype.visitAnimate;
    /** @type {?} */
    AstVisitor.prototype.visitStyle;
    /** @type {?} */
    AstVisitor.prototype.visitKeyframes;
    /** @type {?} */
    AstVisitor.prototype.visitReference;
    /** @type {?} */
    AstVisitor.prototype.visitAnimateChild;
    /** @type {?} */
    AstVisitor.prototype.visitAnimateRef;
    /** @type {?} */
    AstVisitor.prototype.visitQuery;
    /** @type {?} */
    AstVisitor.prototype.visitStagger;
    /** @type {?} */
    AstVisitor.prototype.visitTiming;
}
/**
 * @abstract
 */
var Ast = (function () {
    function Ast() {
        this.options = EMPTY_ANIMATION_OPTIONS;
    }
    Object.defineProperty(Ast.prototype, "params", {
        /**
         * @return {?}
         */
        get: function () { return this.options['params'] || null; },
        enumerable: true,
        configurable: true
    });
    return Ast;
}());
export { Ast };
function Ast_tsickle_Closure_declarations() {
    /** @type {?} */
    Ast.prototype.options;
    /**
     * @abstract
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    Ast.prototype.visit = function (ast, context) { };
}
var TriggerAst = (function (_super) {
    tslib_1.__extends(TriggerAst, _super);
    /**
     * @param {?} name
     * @param {?} states
     * @param {?} transitions
     */
    function TriggerAst(name, states, transitions) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.states = states;
        _this.transitions = transitions;
        _this.queryCount = 0;
        _this.depCount = 0;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TriggerAst.prototype.visit = function (visitor, context) { return visitor.visitTrigger(this, context); };
    return TriggerAst;
}(Ast));
export { TriggerAst };
function TriggerAst_tsickle_Closure_declarations() {
    /** @type {?} */
    TriggerAst.prototype.queryCount;
    /** @type {?} */
    TriggerAst.prototype.depCount;
    /** @type {?} */
    TriggerAst.prototype.name;
    /** @type {?} */
    TriggerAst.prototype.states;
    /** @type {?} */
    TriggerAst.prototype.transitions;
}
var StateAst = (function (_super) {
    tslib_1.__extends(StateAst, _super);
    /**
     * @param {?} name
     * @param {?} style
     */
    function StateAst(name, style) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.style = style;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    StateAst.prototype.visit = function (visitor, context) { return visitor.visitState(this, context); };
    return StateAst;
}(Ast));
export { StateAst };
function StateAst_tsickle_Closure_declarations() {
    /** @type {?} */
    StateAst.prototype.name;
    /** @type {?} */
    StateAst.prototype.style;
}
var TransitionAst = (function (_super) {
    tslib_1.__extends(TransitionAst, _super);
    /**
     * @param {?} matchers
     * @param {?} animation
     */
    function TransitionAst(matchers, animation) {
        var _this = _super.call(this) || this;
        _this.matchers = matchers;
        _this.animation = animation;
        _this.queryCount = 0;
        _this.depCount = 0;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TransitionAst.prototype.visit = function (visitor, context) { return visitor.visitTransition(this, context); };
    return TransitionAst;
}(Ast));
export { TransitionAst };
function TransitionAst_tsickle_Closure_declarations() {
    /** @type {?} */
    TransitionAst.prototype.queryCount;
    /** @type {?} */
    TransitionAst.prototype.depCount;
    /** @type {?} */
    TransitionAst.prototype.matchers;
    /** @type {?} */
    TransitionAst.prototype.animation;
}
var SequenceAst = (function (_super) {
    tslib_1.__extends(SequenceAst, _super);
    /**
     * @param {?} steps
     */
    function SequenceAst(steps) {
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    SequenceAst.prototype.visit = function (visitor, context) { return visitor.visitSequence(this, context); };
    return SequenceAst;
}(Ast));
export { SequenceAst };
function SequenceAst_tsickle_Closure_declarations() {
    /** @type {?} */
    SequenceAst.prototype.steps;
}
var GroupAst = (function (_super) {
    tslib_1.__extends(GroupAst, _super);
    /**
     * @param {?} steps
     */
    function GroupAst(steps) {
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    GroupAst.prototype.visit = function (visitor, context) { return visitor.visitGroup(this, context); };
    return GroupAst;
}(Ast));
export { GroupAst };
function GroupAst_tsickle_Closure_declarations() {
    /** @type {?} */
    GroupAst.prototype.steps;
}
var AnimateAst = (function (_super) {
    tslib_1.__extends(AnimateAst, _super);
    /**
     * @param {?} timings
     * @param {?} style
     */
    function AnimateAst(timings, style) {
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.style = style;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AnimateAst.prototype.visit = function (visitor, context) { return visitor.visitAnimate(this, context); };
    return AnimateAst;
}(Ast));
export { AnimateAst };
function AnimateAst_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimateAst.prototype.timings;
    /** @type {?} */
    AnimateAst.prototype.style;
}
var StyleAst = (function (_super) {
    tslib_1.__extends(StyleAst, _super);
    /**
     * @param {?} styles
     * @param {?} easing
     * @param {?} offset
     */
    function StyleAst(styles, easing, offset) {
        var _this = _super.call(this) || this;
        _this.styles = styles;
        _this.easing = easing;
        _this.offset = offset;
        _this.isEmptyStep = false;
        _this.containsDynamicStyles = false;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    StyleAst.prototype.visit = function (visitor, context) { return visitor.visitStyle(this, context); };
    return StyleAst;
}(Ast));
export { StyleAst };
function StyleAst_tsickle_Closure_declarations() {
    /** @type {?} */
    StyleAst.prototype.isEmptyStep;
    /** @type {?} */
    StyleAst.prototype.containsDynamicStyles;
    /** @type {?} */
    StyleAst.prototype.styles;
    /** @type {?} */
    StyleAst.prototype.easing;
    /** @type {?} */
    StyleAst.prototype.offset;
}
var KeyframesAst = (function (_super) {
    tslib_1.__extends(KeyframesAst, _super);
    /**
     * @param {?} styles
     */
    function KeyframesAst(styles) {
        var _this = _super.call(this) || this;
        _this.styles = styles;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    KeyframesAst.prototype.visit = function (visitor, context) { return visitor.visitKeyframes(this, context); };
    return KeyframesAst;
}(Ast));
export { KeyframesAst };
function KeyframesAst_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyframesAst.prototype.styles;
}
var ReferenceAst = (function (_super) {
    tslib_1.__extends(ReferenceAst, _super);
    /**
     * @param {?} animation
     */
    function ReferenceAst(animation) {
        var _this = _super.call(this) || this;
        _this.animation = animation;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReferenceAst.prototype.visit = function (visitor, context) { return visitor.visitReference(this, context); };
    return ReferenceAst;
}(Ast));
export { ReferenceAst };
function ReferenceAst_tsickle_Closure_declarations() {
    /** @type {?} */
    ReferenceAst.prototype.animation;
}
var AnimateChildAst = (function (_super) {
    tslib_1.__extends(AnimateChildAst, _super);
    function AnimateChildAst() {
        return _super.call(this) || this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AnimateChildAst.prototype.visit = function (visitor, context) { return visitor.visitAnimateChild(this, context); };
    return AnimateChildAst;
}(Ast));
export { AnimateChildAst };
var AnimateRefAst = (function (_super) {
    tslib_1.__extends(AnimateRefAst, _super);
    /**
     * @param {?} animation
     */
    function AnimateRefAst(animation) {
        var _this = _super.call(this) || this;
        _this.animation = animation;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AnimateRefAst.prototype.visit = function (visitor, context) { return visitor.visitAnimateRef(this, context); };
    return AnimateRefAst;
}(Ast));
export { AnimateRefAst };
function AnimateRefAst_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimateRefAst.prototype.animation;
}
var QueryAst = (function (_super) {
    tslib_1.__extends(QueryAst, _super);
    /**
     * @param {?} selector
     * @param {?} limit
     * @param {?} optional
     * @param {?} includeSelf
     * @param {?} animation
     */
    function QueryAst(selector, limit, optional, includeSelf, animation) {
        var _this = _super.call(this) || this;
        _this.selector = selector;
        _this.limit = limit;
        _this.optional = optional;
        _this.includeSelf = includeSelf;
        _this.animation = animation;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    QueryAst.prototype.visit = function (visitor, context) { return visitor.visitQuery(this, context); };
    return QueryAst;
}(Ast));
export { QueryAst };
function QueryAst_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryAst.prototype.originalSelector;
    /** @type {?} */
    QueryAst.prototype.selector;
    /** @type {?} */
    QueryAst.prototype.limit;
    /** @type {?} */
    QueryAst.prototype.optional;
    /** @type {?} */
    QueryAst.prototype.includeSelf;
    /** @type {?} */
    QueryAst.prototype.animation;
}
var StaggerAst = (function (_super) {
    tslib_1.__extends(StaggerAst, _super);
    /**
     * @param {?} timings
     * @param {?} animation
     */
    function StaggerAst(timings, animation) {
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.animation = animation;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    StaggerAst.prototype.visit = function (visitor, context) { return visitor.visitStagger(this, context); };
    return StaggerAst;
}(Ast));
export { StaggerAst };
function StaggerAst_tsickle_Closure_declarations() {
    /** @type {?} */
    StaggerAst.prototype.timings;
    /** @type {?} */
    StaggerAst.prototype.animation;
}
var TimingAst = (function (_super) {
    tslib_1.__extends(TimingAst, _super);
    /**
     * @param {?} duration
     * @param {?=} delay
     * @param {?=} easing
     */
    function TimingAst(duration, delay, easing) {
        if (delay === void 0) { delay = 0; }
        if (easing === void 0) { easing = null; }
        var _this = _super.call(this) || this;
        _this.duration = duration;
        _this.delay = delay;
        _this.easing = easing;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TimingAst.prototype.visit = function (visitor, context) { return visitor.visitTiming(this, context); };
    return TimingAst;
}(Ast));
export { TimingAst };
function TimingAst_tsickle_Closure_declarations() {
    /** @type {?} */
    TimingAst.prototype.duration;
    /** @type {?} */
    TimingAst.prototype.delay;
    /** @type {?} */
    TimingAst.prototype.easing;
}
var DynamicTimingAst = (function (_super) {
    tslib_1.__extends(DynamicTimingAst, _super);
    /**
     * @param {?} value
     */
    function DynamicTimingAst(value) {
        var _this = _super.call(this, 0, 0, '') || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DynamicTimingAst.prototype.visit = function (visitor, context) { return visitor.visitTiming(this, context); };
    return DynamicTimingAst;
}(TimingAst));
export { DynamicTimingAst };
function DynamicTimingAst_tsickle_Closure_declarations() {
    /** @type {?} */
    DynamicTimingAst.prototype.value;
}
//# sourceMappingURL=animation_ast.js.map