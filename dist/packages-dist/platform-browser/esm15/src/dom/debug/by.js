/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { getDOM } from '../../dom/dom_adapter';
/**
 * Predicates for use with {\@link DebugElement}'s query functions.
 *
 * \@experimental All debugging apis are currently experimental.
 */
export class By {
    /**
     * Match all elements.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     * @return {?}
     */
    static all() { return (debugElement) => true; }
    /**
     * Match elements by the given CSS selector.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     * @param {?} selector
     * @return {?}
     */
    static css(selector) {
        return (debugElement) => {
            return debugElement.nativeElement != null ?
                getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        };
    }
    /**
     * Match elements that have the given directive present.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     * @param {?} type
     * @return {?}
     */
    static directive(type) {
        return (debugElement) => ((debugElement.providerTokens)).indexOf(type) !== -1;
    }
}
//# sourceMappingURL=by.js.map