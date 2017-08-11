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
import { AUTO_STYLE, style } from '@angular/animations';
import { getOrSetAsInMap } from '../render/shared';
import { ENTER_SELECTOR, LEAVE_SELECTOR, NG_ANIMATING_SELECTOR, NG_TRIGGER_SELECTOR, SUBSTITUTION_EXPR_START, copyObj, extractStyleParams, iteratorToArray, normalizeAnimationEntry, resolveTiming, validateStyleParams } from '../util';
import { AnimateAst, AnimateChildAst, AnimateRefAst, DynamicTimingAst, GroupAst, KeyframesAst, QueryAst, ReferenceAst, SequenceAst, StaggerAst, StateAst, StyleAst, TimingAst, TransitionAst, TriggerAst } from './animation_ast';
import { visitAnimationNode } from './animation_dsl_visitor';
import { parseTransitionExpr } from './animation_transition_expr';
const /** @type {?} */ SELF_TOKEN = ':self';
const /** @type {?} */ SELF_TOKEN_REGEX = new RegExp(`\s*${SELF_TOKEN}\s*,?`, 'g');
/**
 * @param {?} metadata
 * @param {?} errors
 * @return {?}
 */
export function buildAnimationAst(metadata, errors) {
    return new AnimationAstBuilderVisitor().build(metadata, errors);
}
const /** @type {?} */ LEAVE_TOKEN = ':leave';
const /** @type {?} */ LEAVE_TOKEN_REGEX = new RegExp(LEAVE_TOKEN, 'g');
const /** @type {?} */ ENTER_TOKEN = ':enter';
const /** @type {?} */ ENTER_TOKEN_REGEX = new RegExp(ENTER_TOKEN, 'g');
const /** @type {?} */ ROOT_SELECTOR = '';
export class AnimationAstBuilderVisitor {
    /**
     * @param {?} metadata
     * @param {?} errors
     * @return {?}
     */
    build(metadata, errors) {
        const /** @type {?} */ context = new AnimationAstBuilderContext(errors);
        this._resetContextStyleTimingState(context);
        return (visitAnimationNode(this, normalizeAnimationEntry(metadata), context));
    }
    /**
     * @param {?} context
     * @return {?}
     */
    _resetContextStyleTimingState(context) {
        context.currentQuerySelector = ROOT_SELECTOR;
        context.collectedStyles = {};
        context.collectedStyles[ROOT_SELECTOR] = {};
        context.currentTime = 0;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitTrigger(metadata, context) {
        let /** @type {?} */ queryCount = context.queryCount = 0;
        let /** @type {?} */ depCount = context.depCount = 0;
        const /** @type {?} */ states = [];
        const /** @type {?} */ transitions = [];
        metadata.definitions.forEach(def => {
            this._resetContextStyleTimingState(context);
            if (def.type == 0 /* State */) {
                const /** @type {?} */ stateDef = (def);
                const /** @type {?} */ name = stateDef.name;
                name.split(/\s*,\s*/).forEach(n => {
                    stateDef.name = n;
                    states.push(this.visitState(stateDef, context));
                });
                stateDef.name = name;
            }
            else if (def.type == 1 /* Transition */) {
                const /** @type {?} */ transition = this.visitTransition(/** @type {?} */ (def), context);
                queryCount += transition.queryCount;
                depCount += transition.depCount;
                transitions.push(transition);
            }
            else {
                context.errors.push('only state() and transition() definitions can sit inside of a trigger()');
            }
        });
        const /** @type {?} */ ast = new TriggerAst(metadata.name, states, transitions);
        ast.options = normalizeAnimationOptions(metadata.options);
        ast.queryCount = queryCount;
        ast.depCount = depCount;
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitState(metadata, context) {
        const /** @type {?} */ styleAst = this.visitStyle(metadata.styles, context);
        const /** @type {?} */ astParams = (metadata.options && metadata.options.params) || null;
        if (styleAst.containsDynamicStyles) {
            const /** @type {?} */ missingSubs = new Set();
            const /** @type {?} */ params = astParams || {};
            styleAst.styles.forEach(value => {
                if (isObject(value)) {
                    const /** @type {?} */ stylesObj = (value);
                    Object.keys(stylesObj).forEach(prop => {
                        extractStyleParams(stylesObj[prop]).forEach(sub => {
                            if (!params.hasOwnProperty(sub)) {
                                missingSubs.add(sub);
                            }
                        });
                    });
                }
            });
            if (missingSubs.size) {
                const /** @type {?} */ missingSubsArr = iteratorToArray(missingSubs.values());
                context.errors.push(`state("${metadata.name}", ...) must define default values for all the following style substitutions: ${missingSubsArr.join(', ')}`);
            }
        }
        const /** @type {?} */ stateAst = new StateAst(metadata.name, styleAst);
        if (astParams) {
            stateAst.options = { params: astParams };
        }
        return stateAst;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitTransition(metadata, context) {
        context.queryCount = 0;
        context.depCount = 0;
        const /** @type {?} */ entry = visitAnimationNode(this, normalizeAnimationEntry(metadata.animation), context);
        const /** @type {?} */ matchers = parseTransitionExpr(metadata.expr, context.errors);
        const /** @type {?} */ ast = new TransitionAst(matchers, entry);
        ast.options = normalizeAnimationOptions(metadata.options);
        ast.queryCount = context.queryCount;
        ast.depCount = context.depCount;
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitSequence(metadata, context) {
        const /** @type {?} */ ast = new SequenceAst(metadata.steps.map(s => visitAnimationNode(this, s, context)));
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitGroup(metadata, context) {
        const /** @type {?} */ currentTime = context.currentTime;
        let /** @type {?} */ furthestTime = 0;
        const /** @type {?} */ steps = metadata.steps.map(step => {
            context.currentTime = currentTime;
            const /** @type {?} */ innerAst = visitAnimationNode(this, step, context);
            furthestTime = Math.max(furthestTime, context.currentTime);
            return innerAst;
        });
        context.currentTime = furthestTime;
        const /** @type {?} */ ast = new GroupAst(steps);
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimate(metadata, context) {
        const /** @type {?} */ timingAst = constructTimingAst(metadata.timings, context.errors);
        context.currentAnimateTimings = timingAst;
        let /** @type {?} */ styles;
        let /** @type {?} */ styleMetadata = metadata.styles ? metadata.styles : style({});
        if (styleMetadata.type == 5 /* Keyframes */) {
            styles = this.visitKeyframes(/** @type {?} */ (styleMetadata), context);
        }
        else {
            let /** @type {?} */ styleMetadata = (metadata.styles);
            let /** @type {?} */ isEmpty = false;
            if (!styleMetadata) {
                isEmpty = true;
                const /** @type {?} */ newStyleData = {};
                if (timingAst.easing) {
                    newStyleData['easing'] = timingAst.easing;
                }
                styleMetadata = style(newStyleData);
            }
            context.currentTime += timingAst.duration + timingAst.delay;
            const /** @type {?} */ styleAst = this.visitStyle(styleMetadata, context);
            styleAst.isEmptyStep = isEmpty;
            styles = styleAst;
        }
        context.currentAnimateTimings = null;
        return new AnimateAst(timingAst, styles);
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitStyle(metadata, context) {
        const /** @type {?} */ ast = this._makeStyleAst(metadata, context);
        this._validateStyleAst(ast, context);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    _makeStyleAst(metadata, context) {
        const /** @type {?} */ styles = [];
        if (Array.isArray(metadata.styles)) {
            ((metadata.styles)).forEach(styleTuple => {
                if (typeof styleTuple == 'string') {
                    if (styleTuple == AUTO_STYLE) {
                        styles.push(/** @type {?} */ (styleTuple));
                    }
                    else {
                        context.errors.push(`The provided style string value ${styleTuple} is not allowed.`);
                    }
                }
                else {
                    styles.push(/** @type {?} */ (styleTuple));
                }
            });
        }
        else {
            styles.push(metadata.styles);
        }
        let /** @type {?} */ containsDynamicStyles = false;
        let /** @type {?} */ collectedEasing = null;
        styles.forEach(styleData => {
            if (isObject(styleData)) {
                const /** @type {?} */ styleMap = (styleData);
                const /** @type {?} */ easing = styleMap['easing'];
                if (easing) {
                    collectedEasing = (easing);
                    delete styleMap['easing'];
                }
                if (!containsDynamicStyles) {
                    for (let /** @type {?} */ prop in styleMap) {
                        const /** @type {?} */ value = styleMap[prop];
                        if (value.toString().indexOf(SUBSTITUTION_EXPR_START) >= 0) {
                            containsDynamicStyles = true;
                            break;
                        }
                    }
                }
            }
        });
        const /** @type {?} */ ast = new StyleAst(styles, collectedEasing, metadata.offset);
        ast.containsDynamicStyles = containsDynamicStyles;
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _validateStyleAst(ast, context) {
        const /** @type {?} */ timings = context.currentAnimateTimings;
        let /** @type {?} */ endTime = context.currentTime;
        let /** @type {?} */ startTime = context.currentTime;
        if (timings && startTime > 0) {
            startTime -= timings.duration + timings.delay;
        }
        ast.styles.forEach(tuple => {
            if (typeof tuple == 'string')
                return;
            Object.keys(tuple).forEach(prop => {
                const /** @type {?} */ collectedStyles = context.collectedStyles[((context.currentQuerySelector))];
                const /** @type {?} */ collectedEntry = collectedStyles[prop];
                let /** @type {?} */ updateCollectedStyle = true;
                if (collectedEntry) {
                    if (startTime != endTime && startTime >= collectedEntry.startTime &&
                        endTime <= collectedEntry.endTime) {
                        context.errors.push(`The CSS property "${prop}" that exists between the times of "${collectedEntry.startTime}ms" and "${collectedEntry.endTime}ms" is also being animated in a parallel animation between the times of "${startTime}ms" and "${endTime}ms"`);
                        updateCollectedStyle = false;
                    }
                    // we always choose the smaller start time value since we
                    // want to have a record of the entire animation window where
                    // the style property is being animated in between
                    startTime = collectedEntry.startTime;
                }
                if (updateCollectedStyle) {
                    collectedStyles[prop] = { startTime, endTime };
                }
                if (context.options) {
                    validateStyleParams(tuple[prop], context.options, context.errors);
                }
            });
        });
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitKeyframes(metadata, context) {
        if (!context.currentAnimateTimings) {
            context.errors.push(`keyframes() must be placed inside of a call to animate()`);
            return new KeyframesAst([]);
        }
        const /** @type {?} */ MAX_KEYFRAME_OFFSET = 1;
        let /** @type {?} */ totalKeyframesWithOffsets = 0;
        const /** @type {?} */ offsets = [];
        let /** @type {?} */ offsetsOutOfOrder = false;
        let /** @type {?} */ keyframesOutOfRange = false;
        let /** @type {?} */ previousOffset = 0;
        const /** @type {?} */ keyframes = metadata.steps.map(styles => {
            const /** @type {?} */ style = this._makeStyleAst(styles, context);
            let /** @type {?} */ offsetVal = style.offset != null ? style.offset : consumeOffset(style.styles);
            let /** @type {?} */ offset = 0;
            if (offsetVal != null) {
                totalKeyframesWithOffsets++;
                offset = style.offset = offsetVal;
            }
            keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
            offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
            previousOffset = offset;
            offsets.push(offset);
            return style;
        });
        if (keyframesOutOfRange) {
            context.errors.push(`Please ensure that all keyframe offsets are between 0 and 1`);
        }
        if (offsetsOutOfOrder) {
            context.errors.push(`Please ensure that all keyframe offsets are in order`);
        }
        const /** @type {?} */ length = metadata.steps.length;
        let /** @type {?} */ generatedOffset = 0;
        if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
            context.errors.push(`Not all style() steps within the declared keyframes() contain offsets`);
        }
        else if (totalKeyframesWithOffsets == 0) {
            generatedOffset = MAX_KEYFRAME_OFFSET / (length - 1);
        }
        const /** @type {?} */ limit = length - 1;
        const /** @type {?} */ currentTime = context.currentTime;
        const /** @type {?} */ currentAnimateTimings = ((context.currentAnimateTimings));
        const /** @type {?} */ animateDuration = currentAnimateTimings.duration;
        keyframes.forEach((kf, i) => {
            const /** @type {?} */ offset = generatedOffset > 0 ? (i == limit ? 1 : (generatedOffset * i)) : offsets[i];
            const /** @type {?} */ durationUpToThisFrame = offset * animateDuration;
            context.currentTime = currentTime + currentAnimateTimings.delay + durationUpToThisFrame;
            currentAnimateTimings.duration = durationUpToThisFrame;
            this._validateStyleAst(kf, context);
            kf.offset = offset;
        });
        return new KeyframesAst(keyframes);
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitReference(metadata, context) {
        const /** @type {?} */ entry = visitAnimationNode(this, normalizeAnimationEntry(metadata.animation), context);
        const /** @type {?} */ ast = new ReferenceAst(entry);
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimateChild(metadata, context) {
        context.depCount++;
        const /** @type {?} */ ast = new AnimateChildAst();
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitAnimateRef(metadata, context) {
        const /** @type {?} */ animation = this.visitReference(metadata.animation, context);
        const /** @type {?} */ ast = new AnimateRefAst(animation);
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitQuery(metadata, context) {
        const /** @type {?} */ parentSelector = ((context.currentQuerySelector));
        const /** @type {?} */ options = ((metadata.options || {}));
        context.queryCount++;
        context.currentQuery = metadata;
        const [selector, includeSelf] = normalizeSelector(metadata.selector);
        context.currentQuerySelector =
            parentSelector.length ? (parentSelector + ' ' + selector) : selector;
        getOrSetAsInMap(context.collectedStyles, context.currentQuerySelector, {});
        const /** @type {?} */ entry = visitAnimationNode(this, normalizeAnimationEntry(metadata.animation), context);
        context.currentQuery = null;
        context.currentQuerySelector = parentSelector;
        const /** @type {?} */ ast = new QueryAst(selector, options.limit || 0, !!options.optional, includeSelf, entry);
        ast.originalSelector = metadata.selector;
        ast.options = normalizeAnimationOptions(metadata.options);
        return ast;
    }
    /**
     * @param {?} metadata
     * @param {?} context
     * @return {?}
     */
    visitStagger(metadata, context) {
        if (!context.currentQuery) {
            context.errors.push(`stagger() can only be used inside of query()`);
        }
        const /** @type {?} */ timings = metadata.timings === 'full' ?
            { duration: 0, delay: 0, easing: 'full' } :
            resolveTiming(metadata.timings, context.errors, true);
        const /** @type {?} */ animation = visitAnimationNode(this, normalizeAnimationEntry(metadata.animation), context);
        return new StaggerAst(timings, animation);
    }
}
/**
 * @param {?} selector
 * @return {?}
 */
function normalizeSelector(selector) {
    const /** @type {?} */ hasAmpersand = selector.split(/\s*,\s*/).find(token => token == SELF_TOKEN) ? true : false;
    if (hasAmpersand) {
        selector = selector.replace(SELF_TOKEN_REGEX, '');
    }
    selector = selector.replace(ENTER_TOKEN_REGEX, ENTER_SELECTOR)
        .replace(LEAVE_TOKEN_REGEX, LEAVE_SELECTOR)
        .replace(/@\*/g, NG_TRIGGER_SELECTOR)
        .replace(/@\w+/g, match => NG_TRIGGER_SELECTOR + '-' + match.substr(1))
        .replace(/:animating/g, NG_ANIMATING_SELECTOR);
    return [selector, hasAmpersand];
}
/**
 * @param {?} obj
 * @return {?}
 */
function normalizeParams(obj) {
    return obj ? copyObj(obj) : null;
}
export class AnimationAstBuilderContext {
    /**
     * @param {?} errors
     */
    constructor(errors) {
        this.errors = errors;
        this.queryCount = 0;
        this.depCount = 0;
        this.currentTransition = null;
        this.currentQuery = null;
        this.currentQuerySelector = null;
        this.currentAnimateTimings = null;
        this.currentTime = 0;
        this.collectedStyles = {};
        this.options = null;
    }
}
function AnimationAstBuilderContext_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationAstBuilderContext.prototype.queryCount;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.depCount;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentTransition;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentQuery;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentQuerySelector;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentAnimateTimings;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.currentTime;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.collectedStyles;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.options;
    /** @type {?} */
    AnimationAstBuilderContext.prototype.errors;
}
/**
 * @param {?} styles
 * @return {?}
 */
function consumeOffset(styles) {
    if (typeof styles == 'string')
        return null;
    let /** @type {?} */ offset = null;
    if (Array.isArray(styles)) {
        styles.forEach(styleTuple => {
            if (isObject(styleTuple) && styleTuple.hasOwnProperty('offset')) {
                const /** @type {?} */ obj = (styleTuple);
                offset = parseFloat(/** @type {?} */ (obj['offset']));
                delete obj['offset'];
            }
        });
    }
    else if (isObject(styles) && styles.hasOwnProperty('offset')) {
        const /** @type {?} */ obj = (styles);
        offset = parseFloat(/** @type {?} */ (obj['offset']));
        delete obj['offset'];
    }
    return offset;
}
/**
 * @param {?} value
 * @return {?}
 */
function isObject(value) {
    return !Array.isArray(value) && typeof value == 'object';
}
/**
 * @param {?} value
 * @param {?} errors
 * @return {?}
 */
function constructTimingAst(value, errors) {
    let /** @type {?} */ timings = null;
    if (value.hasOwnProperty('duration')) {
        timings = (value);
    }
    else if (typeof value == 'number') {
        const /** @type {?} */ duration = resolveTiming(/** @type {?} */ (value), errors).duration;
        return new TimingAst(/** @type {?} */ (value), 0, '');
    }
    const /** @type {?} */ strValue = (value);
    const /** @type {?} */ isDynamic = strValue.split(/\s+/).some(v => v.charAt(0) == '{' && v.charAt(1) == '{');
    if (isDynamic) {
        return new DynamicTimingAst(strValue);
    }
    timings = timings || resolveTiming(strValue, errors);
    return new TimingAst(timings.duration, timings.delay, timings.easing);
}
/**
 * @param {?} options
 * @return {?}
 */
function normalizeAnimationOptions(options) {
    if (options) {
        options = copyObj(options);
        if (options['params']) {
            options['params'] = ((normalizeParams(options['params'])));
        }
    }
    else {
        options = {};
    }
    return options;
}
//# sourceMappingURL=animation_ast_builder.js.map