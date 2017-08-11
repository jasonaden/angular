/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
export function AnimationDslVisitor() { }
function AnimationDslVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationDslVisitor.prototype.visitTrigger;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitState;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitTransition;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitSequence;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitGroup;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitAnimate;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitStyle;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitKeyframes;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitReference;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitAnimateChild;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitAnimateRef;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitQuery;
    /** @type {?} */
    AnimationDslVisitor.prototype.visitStagger;
}
/**
 * @param {?} visitor
 * @param {?} node
 * @param {?} context
 * @return {?}
 */
export function visitAnimationNode(visitor, node, context) {
    switch (node.type) {
        case 7 /* Trigger */:
            return visitor.visitTrigger(/** @type {?} */ (node), context);
        case 0 /* State */:
            return visitor.visitState(/** @type {?} */ (node), context);
        case 1 /* Transition */:
            return visitor.visitTransition(/** @type {?} */ (node), context);
        case 2 /* Sequence */:
            return visitor.visitSequence(/** @type {?} */ (node), context);
        case 3 /* Group */:
            return visitor.visitGroup(/** @type {?} */ (node), context);
        case 4 /* Animate */:
            return visitor.visitAnimate(/** @type {?} */ (node), context);
        case 5 /* Keyframes */:
            return visitor.visitKeyframes(/** @type {?} */ (node), context);
        case 6 /* Style */:
            return visitor.visitStyle(/** @type {?} */ (node), context);
        case 8 /* Reference */:
            return visitor.visitReference(/** @type {?} */ (node), context);
        case 9 /* AnimateChild */:
            return visitor.visitAnimateChild(/** @type {?} */ (node), context);
        case 10 /* AnimateRef */:
            return visitor.visitAnimateRef(/** @type {?} */ (node), context);
        case 11 /* Query */:
            return visitor.visitQuery(/** @type {?} */ (node), context);
        case 12 /* Stagger */:
            return visitor.visitStagger(/** @type {?} */ (node), context);
        default:
            throw new Error("Unable to resolve animation metadata node #" + node.type);
    }
}
//# sourceMappingURL=animation_dsl_visitor.js.map