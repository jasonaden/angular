/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ EMPTY_ANIMATION_OPTIONS = {};
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
export class Ast {
    constructor() {
        this.options = EMPTY_ANIMATION_OPTIONS;
    }
    /**
     * @return {?}
     */
    get params() { return this.options['params'] || null; }
}
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
export class TriggerAst extends Ast {
    /**
     * @param {?} name
     * @param {?} states
     * @param {?} transitions
     */
    constructor(name, states, transitions) {
        super();
        this.name = name;
        this.states = states;
        this.transitions = transitions;
        this.queryCount = 0;
        this.depCount = 0;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitTrigger(this, context); }
}
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
export class StateAst extends Ast {
    /**
     * @param {?} name
     * @param {?} style
     */
    constructor(name, style) {
        super();
        this.name = name;
        this.style = style;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitState(this, context); }
}
function StateAst_tsickle_Closure_declarations() {
    /** @type {?} */
    StateAst.prototype.name;
    /** @type {?} */
    StateAst.prototype.style;
}
export class TransitionAst extends Ast {
    /**
     * @param {?} matchers
     * @param {?} animation
     */
    constructor(matchers, animation) {
        super();
        this.matchers = matchers;
        this.animation = animation;
        this.queryCount = 0;
        this.depCount = 0;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitTransition(this, context); }
}
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
export class SequenceAst extends Ast {
    /**
     * @param {?} steps
     */
    constructor(steps) {
        super();
        this.steps = steps;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitSequence(this, context); }
}
function SequenceAst_tsickle_Closure_declarations() {
    /** @type {?} */
    SequenceAst.prototype.steps;
}
export class GroupAst extends Ast {
    /**
     * @param {?} steps
     */
    constructor(steps) {
        super();
        this.steps = steps;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitGroup(this, context); }
}
function GroupAst_tsickle_Closure_declarations() {
    /** @type {?} */
    GroupAst.prototype.steps;
}
export class AnimateAst extends Ast {
    /**
     * @param {?} timings
     * @param {?} style
     */
    constructor(timings, style) {
        super();
        this.timings = timings;
        this.style = style;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitAnimate(this, context); }
}
function AnimateAst_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimateAst.prototype.timings;
    /** @type {?} */
    AnimateAst.prototype.style;
}
export class StyleAst extends Ast {
    /**
     * @param {?} styles
     * @param {?} easing
     * @param {?} offset
     */
    constructor(styles, easing, offset) {
        super();
        this.styles = styles;
        this.easing = easing;
        this.offset = offset;
        this.isEmptyStep = false;
        this.containsDynamicStyles = false;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitStyle(this, context); }
}
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
export class KeyframesAst extends Ast {
    /**
     * @param {?} styles
     */
    constructor(styles) {
        super();
        this.styles = styles;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitKeyframes(this, context); }
}
function KeyframesAst_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyframesAst.prototype.styles;
}
export class ReferenceAst extends Ast {
    /**
     * @param {?} animation
     */
    constructor(animation) {
        super();
        this.animation = animation;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitReference(this, context); }
}
function ReferenceAst_tsickle_Closure_declarations() {
    /** @type {?} */
    ReferenceAst.prototype.animation;
}
export class AnimateChildAst extends Ast {
    constructor() { super(); }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitAnimateChild(this, context); }
}
export class AnimateRefAst extends Ast {
    /**
     * @param {?} animation
     */
    constructor(animation) {
        super();
        this.animation = animation;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitAnimateRef(this, context); }
}
function AnimateRefAst_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimateRefAst.prototype.animation;
}
export class QueryAst extends Ast {
    /**
     * @param {?} selector
     * @param {?} limit
     * @param {?} optional
     * @param {?} includeSelf
     * @param {?} animation
     */
    constructor(selector, limit, optional, includeSelf, animation) {
        super();
        this.selector = selector;
        this.limit = limit;
        this.optional = optional;
        this.includeSelf = includeSelf;
        this.animation = animation;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitQuery(this, context); }
}
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
export class StaggerAst extends Ast {
    /**
     * @param {?} timings
     * @param {?} animation
     */
    constructor(timings, animation) {
        super();
        this.timings = timings;
        this.animation = animation;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitStagger(this, context); }
}
function StaggerAst_tsickle_Closure_declarations() {
    /** @type {?} */
    StaggerAst.prototype.timings;
    /** @type {?} */
    StaggerAst.prototype.animation;
}
export class TimingAst extends Ast {
    /**
     * @param {?} duration
     * @param {?=} delay
     * @param {?=} easing
     */
    constructor(duration, delay = 0, easing = null) {
        super();
        this.duration = duration;
        this.delay = delay;
        this.easing = easing;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitTiming(this, context); }
}
function TimingAst_tsickle_Closure_declarations() {
    /** @type {?} */
    TimingAst.prototype.duration;
    /** @type {?} */
    TimingAst.prototype.delay;
    /** @type {?} */
    TimingAst.prototype.easing;
}
export class DynamicTimingAst extends TimingAst {
    /**
     * @param {?} value
     */
    constructor(value) {
        super(0, 0, '');
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitTiming(this, context); }
}
function DynamicTimingAst_tsickle_Closure_declarations() {
    /** @type {?} */
    DynamicTimingAst.prototype.value;
}
//# sourceMappingURL=animation_ast.js.map