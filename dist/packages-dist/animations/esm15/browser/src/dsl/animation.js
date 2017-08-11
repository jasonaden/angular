/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { normalizeStyles } from '../util';
import { buildAnimationAst } from './animation_ast_builder';
import { buildAnimationTimelines } from './animation_timeline_builder';
import { ElementInstructionMap } from './element_instruction_map';
export class Animation {
    /**
     * @param {?} _driver
     * @param {?} input
     */
    constructor(_driver, input) {
        this._driver = _driver;
        const /** @type {?} */ errors = [];
        const /** @type {?} */ ast = buildAnimationAst(input, errors);
        if (errors.length) {
            const /** @type {?} */ errorMessage = `animation validation failed:\n${errors.join("\n")}`;
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    /**
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} destinationStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @return {?}
     */
    buildTimelines(element, startingStyles, destinationStyles, options, subInstructions) {
        const /** @type {?} */ start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) : (startingStyles);
        const /** @type {?} */ dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) : (destinationStyles);
        const /** @type {?} */ errors = [];
        subInstructions = subInstructions || new ElementInstructionMap();
        const /** @type {?} */ result = buildAnimationTimelines(this._driver, element, this._animationAst, start, dest, options, subInstructions, errors);
        if (errors.length) {
            const /** @type {?} */ errorMessage = `animation building failed:\n${errors.join("\n")}`;
            throw new Error(errorMessage);
        }
        return result;
    }
}
function Animation_tsickle_Closure_declarations() {
    /** @type {?} */
    Animation.prototype._animationAst;
    /** @type {?} */
    Animation.prototype._driver;
}
//# sourceMappingURL=animation.js.map