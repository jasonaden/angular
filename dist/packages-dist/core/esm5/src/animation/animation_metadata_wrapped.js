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
import { animate as _animate, group as _group, keyframes as _keyframes, sequence as _sequence, state as _state, style as _style, transition as _transition, trigger as _trigger } from './dsl';
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 */
export var /** @type {?} */ AUTO_STYLE = '*';
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationMetadata() { }
function AnimationMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationMetadata.prototype.type;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationTriggerMetadata() { }
function AnimationTriggerMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTriggerMetadata.prototype.name;
    /** @type {?} */
    AnimationTriggerMetadata.prototype.definitions;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationStateMetadata() { }
function AnimationStateMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationStateMetadata.prototype.name;
    /** @type {?} */
    AnimationStateMetadata.prototype.styles;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationTransitionMetadata() { }
function AnimationTransitionMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTransitionMetadata.prototype.expr;
    /** @type {?} */
    AnimationTransitionMetadata.prototype.animation;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationKeyframesSequenceMetadata() { }
function AnimationKeyframesSequenceMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationKeyframesSequenceMetadata.prototype.steps;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationStyleMetadata() { }
function AnimationStyleMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationStyleMetadata.prototype.styles;
    /** @type {?} */
    AnimationStyleMetadata.prototype.offset;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationAnimateMetadata() { }
function AnimationAnimateMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationAnimateMetadata.prototype.timings;
    /** @type {?} */
    AnimationAnimateMetadata.prototype.styles;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationSequenceMetadata() { }
function AnimationSequenceMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationSequenceMetadata.prototype.steps;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @record
 */
export function AnimationGroupMetadata() { }
function AnimationGroupMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationGroupMetadata.prototype.steps;
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} name
 * @param {?} definitions
 * @return {?}
 */
export function trigger(name, definitions) {
    return _trigger(name, definitions);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} timings
 * @param {?=} styles
 * @return {?}
 */
export function animate(timings, styles) {
    return _animate(timings, styles);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} steps
 * @return {?}
 */
export function group(steps) {
    return _group(steps);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} steps
 * @return {?}
 */
export function sequence(steps) {
    return _sequence(steps);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} tokens
 * @return {?}
 */
export function style(tokens) {
    return _style(tokens);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} name
 * @param {?} styles
 * @return {?}
 */
export function state(name, styles) {
    return _state(name, styles);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} steps
 * @return {?}
 */
export function keyframes(steps) {
    return _keyframes(steps);
}
/**
 * @deprecated This symbol has moved. Please Import from \@angular/animations instead!
 * @param {?} stateChangeExpr
 * @param {?} steps
 * @return {?}
 */
export function transition(stateChangeExpr, steps) {
    return _transition(stateChangeExpr, steps);
}
/**
 * @deprecated This has been renamed to `AnimationEvent`. Please import it from \@angular/animations.
 * @record
 */
export function AnimationTransitionEvent() { }
function AnimationTransitionEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTransitionEvent.prototype.fromState;
    /** @type {?} */
    AnimationTransitionEvent.prototype.toState;
    /** @type {?} */
    AnimationTransitionEvent.prototype.totalTime;
    /** @type {?} */
    AnimationTransitionEvent.prototype.phaseName;
    /** @type {?} */
    AnimationTransitionEvent.prototype.element;
    /** @type {?} */
    AnimationTransitionEvent.prototype.triggerName;
}
//# sourceMappingURL=animation_metadata_wrapped.js.map