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
import { Attribute, ChangeDetectorRef, ComponentFactoryResolver, Directive, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { ChildrenOutletContexts } from '../router_outlet_context';
import { ActivatedRoute } from '../router_state';
import { PRIMARY_OUTLET } from '../shared';
/**
 * \@whatItDoes Acts as a placeholder that Angular dynamically fills based on the current router
 * state.
 *
 * \@howToUse
 *
 * ```
 * <router-outlet></router-outlet>
 * <router-outlet name='left'></router-outlet>
 * <router-outlet name='right'></router-outlet>
 * ```
 *
 * A router outlet will emit an activate event any time a new component is being instantiated,
 * and a deactivate event when it is being destroyed.
 *
 * ```
 * <router-outlet
 *   (activate)='onActivate($event)'
 *   (deactivate)='onDeactivate($event)'></router-outlet>
 * ```
 * \@ngModule RouterModule
 *
 * \@stable
 */
var RouterOutlet = (function () {
    /**
     * @param {?} parentContexts
     * @param {?} location
     * @param {?} resolver
     * @param {?} name
     * @param {?} changeDetector
     */
    function RouterOutlet(parentContexts, location, resolver, name, changeDetector) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.activated = null;
        this._activatedRoute = null;
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
    }
    /**
     * @return {?}
     */
    RouterOutlet.prototype.ngOnDestroy = function () { this.parentContexts.onChildOutletDestroyed(this.name); };
    /**
     * @return {?}
     */
    RouterOutlet.prototype.ngOnInit = function () {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            var /** @type {?} */ context = this.parentContexts.getContext(this.name);
            if (context && context.route) {
                if (context.attachRef) {
                    // `attachRef` is populated when there is an existing component to mount
                    this.attach(context.attachRef, context.route);
                }
                else {
                    // otherwise the component defined in the configuration is created
                    this.activateWith(context.route, context.resolver || null);
                }
            }
        }
    };
    Object.defineProperty(RouterOutlet.prototype, "locationInjector", {
        /**
         * @deprecated since v4 *
         * @return {?}
         */
        get: function () { return this.location.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "locationFactoryResolver", {
        /**
         * @deprecated since v4 *
         * @return {?}
         */
        get: function () { return this.resolver; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "isActivated", {
        /**
         * @return {?}
         */
        get: function () { return !!this.activated; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "component", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return (this._activatedRoute);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "activatedRouteData", {
        /**
         * @return {?}
         */
        get: function () {
            if (this._activatedRoute) {
                return this._activatedRoute.snapshot.data;
            }
            return {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     * @return {?}
     */
    RouterOutlet.prototype.detach = function () {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        this.location.detach();
        var /** @type {?} */ cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     * @param {?} ref
     * @param {?} activatedRoute
     * @return {?}
     */
    RouterOutlet.prototype.attach = function (ref, activatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
    };
    /**
     * @return {?}
     */
    RouterOutlet.prototype.deactivate = function () {
        if (this.activated) {
            var /** @type {?} */ c = this.component;
            this.activated.destroy();
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    };
    /**
     * @param {?} activatedRoute
     * @param {?} resolver
     * @return {?}
     */
    RouterOutlet.prototype.activateWith = function (activatedRoute, resolver) {
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        var /** @type {?} */ snapshot = activatedRoute._futureSnapshot;
        var /** @type {?} */ component = (((snapshot._routeConfig)).component);
        resolver = resolver || this.resolver;
        var /** @type {?} */ factory = resolver.resolveComponentFactory(component);
        var /** @type {?} */ childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        var /** @type {?} */ injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
        this.activated = this.location.createComponent(factory, this.location.length, injector);
        // Calling `markForCheck` to make sure we will run the change detection when the
        // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
        this.changeDetector.markForCheck();
        this.activateEvents.emit(this.activated.instance);
    };
    return RouterOutlet;
}());
export { RouterOutlet };
RouterOutlet.decorators = [
    { type: Directive, args: [{ selector: 'router-outlet', exportAs: 'outlet' },] },
];
/** @nocollapse */
RouterOutlet.ctorParameters = function () { return [
    { type: ChildrenOutletContexts, },
    { type: ViewContainerRef, },
    { type: ComponentFactoryResolver, },
    { type: undefined, decorators: [{ type: Attribute, args: ['name',] },] },
    { type: ChangeDetectorRef, },
]; };
RouterOutlet.propDecorators = {
    "activateEvents": [{ type: Output, args: ['activate',] },],
    "deactivateEvents": [{ type: Output, args: ['deactivate',] },],
};
function RouterOutlet_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterOutlet.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RouterOutlet.ctorParameters;
    /** @type {?} */
    RouterOutlet.propDecorators;
    /** @type {?} */
    RouterOutlet.prototype.activated;
    /** @type {?} */
    RouterOutlet.prototype._activatedRoute;
    /** @type {?} */
    RouterOutlet.prototype.name;
    /** @type {?} */
    RouterOutlet.prototype.activateEvents;
    /** @type {?} */
    RouterOutlet.prototype.deactivateEvents;
    /** @type {?} */
    RouterOutlet.prototype.parentContexts;
    /** @type {?} */
    RouterOutlet.prototype.location;
    /** @type {?} */
    RouterOutlet.prototype.resolver;
    /** @type {?} */
    RouterOutlet.prototype.changeDetector;
}
var OutletInjector = (function () {
    /**
     * @param {?} route
     * @param {?} childContexts
     * @param {?} parent
     */
    function OutletInjector(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    OutletInjector.prototype.get = function (token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
    };
    return OutletInjector;
}());
function OutletInjector_tsickle_Closure_declarations() {
    /** @type {?} */
    OutletInjector.prototype.route;
    /** @type {?} */
    OutletInjector.prototype.childContexts;
    /** @type {?} */
    OutletInjector.prototype.parent;
}
//# sourceMappingURL=router_outlet.js.map