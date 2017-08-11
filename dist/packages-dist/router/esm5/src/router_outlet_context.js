/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Store contextual information about a {\@link RouterOutlet}
 *
 * \@stable
 */
var OutletContext = (function () {
    function OutletContext() {
        this.outlet = null;
        this.route = null;
        this.resolver = null;
        this.children = new ChildrenOutletContexts();
        this.attachRef = null;
    }
    return OutletContext;
}());
export { OutletContext };
function OutletContext_tsickle_Closure_declarations() {
    /** @type {?} */
    OutletContext.prototype.outlet;
    /** @type {?} */
    OutletContext.prototype.route;
    /** @type {?} */
    OutletContext.prototype.resolver;
    /** @type {?} */
    OutletContext.prototype.children;
    /** @type {?} */
    OutletContext.prototype.attachRef;
}
/**
 * Store contextual information about the children (= nested) {\@link RouterOutlet}
 *
 * \@stable
 */
var ChildrenOutletContexts = (function () {
    function ChildrenOutletContexts() {
        this.contexts = new Map();
    }
    /**
     * Called when a `RouterOutlet` directive is instantiated
     * @param {?} childName
     * @param {?} outlet
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onChildOutletCreated = function (childName, outlet) {
        var /** @type {?} */ context = this.getOrCreateContext(childName);
        context.outlet = outlet;
        this.contexts.set(childName, context);
    };
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onChildOutletDestroyed = function (childName) {
        var /** @type {?} */ context = this.getContext(childName);
        if (context) {
            context.outlet = null;
        }
    };
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onOutletDeactivated = function () {
        var /** @type {?} */ contexts = this.contexts;
        this.contexts = new Map();
        return contexts;
    };
    /**
     * @param {?} contexts
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onOutletReAttached = function (contexts) { this.contexts = contexts; };
    /**
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.getOrCreateContext = function (childName) {
        var /** @type {?} */ context = this.getContext(childName);
        if (!context) {
            context = new OutletContext();
            this.contexts.set(childName, context);
        }
        return context;
    };
    /**
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.getContext = function (childName) { return this.contexts.get(childName) || null; };
    return ChildrenOutletContexts;
}());
export { ChildrenOutletContexts };
function ChildrenOutletContexts_tsickle_Closure_declarations() {
    /** @type {?} */
    ChildrenOutletContexts.prototype.contexts;
}
//# sourceMappingURL=router_outlet_context.js.map