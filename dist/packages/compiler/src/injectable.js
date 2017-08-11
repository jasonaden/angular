/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * A replacement for \@Injectable to be used in the compiler, so that
 * we don't try to evaluate the metadata in the compiler during AoT.
 * This decorator is enough to make the compiler work with the ReflectiveInjector though.
 * \@Annotation
 * @return {?}
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */ export function CompilerInjectable() {
    return (x) => x;
}
//# sourceMappingURL=injectable.js.map