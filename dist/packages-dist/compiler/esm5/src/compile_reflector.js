/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Provides access to reflection data about symbols that the compiler needs.
 * @abstract
 */
var CompileReflector = (function () {
    function CompileReflector() {
    }
    return CompileReflector;
}());
export { CompileReflector };
function CompileReflector_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} typeOrFunc
     * @return {?}
     */
    CompileReflector.prototype.parameters = function (typeOrFunc) { };
    /**
     * @abstract
     * @param {?} typeOrFunc
     * @return {?}
     */
    CompileReflector.prototype.annotations = function (typeOrFunc) { };
    /**
     * @abstract
     * @param {?} typeOrFunc
     * @return {?}
     */
    CompileReflector.prototype.propMetadata = function (typeOrFunc) { };
    /**
     * @abstract
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    CompileReflector.prototype.hasLifecycleHook = function (type, lcProperty) { };
    /**
     * @abstract
     * @param {?} type
     * @param {?} cmpMetadata
     * @return {?}
     */
    CompileReflector.prototype.componentModuleUrl = function (type, cmpMetadata) { };
    /**
     * @abstract
     * @param {?} ref
     * @return {?}
     */
    CompileReflector.prototype.resolveExternalReference = function (ref) { };
}
//# sourceMappingURL=compile_reflector.js.map