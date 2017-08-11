/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operator/map';
import { PRIMARY_OUTLET, convertToParamMap } from './shared';
import { UrlSegment, equalSegments } from './url_tree';
import { shallowEqual, shallowEqualArrays } from './utils/collection';
import { Tree, TreeNode } from './utils/tree';
/**
 * \@whatItDoes Represents the state of the router.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const root: ActivatedRoute = state.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * \@description
 * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
 * segments, the extracted parameters, and the resolved data.
 *
 * See {\@link ActivatedRoute} for more information.
 *
 * \@stable
 */
var RouterState = (function (_super) {
    tslib_1.__extends(RouterState, _super);
    /**
     * \@internal
     * @param {?} root
     * @param {?} snapshot
     */
    function RouterState(root, snapshot) {
        var _this = _super.call(this, root) || this;
        _this.snapshot = snapshot;
        setRouterState(/** @type {?} */ (_this), root);
        return _this;
    }
    /**
     * @return {?}
     */
    RouterState.prototype.toString = function () { return this.snapshot.toString(); };
    return RouterState;
}(Tree));
export { RouterState };
function RouterState_tsickle_Closure_declarations() {
    /**
     * The current snapshot of the router state
     * @type {?}
     */
    RouterState.prototype.snapshot;
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyState(urlTree, rootComponent) {
    var /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    var /** @type {?} */ emptyUrl = new BehaviorSubject([new UrlSegment('', {})]);
    var /** @type {?} */ emptyParams = new BehaviorSubject({});
    var /** @type {?} */ emptyData = new BehaviorSubject({});
    var /** @type {?} */ emptyQueryParams = new BehaviorSubject({});
    var /** @type {?} */ fragment = new BehaviorSubject('');
    var /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new TreeNode(activated, []), snapshot);
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyStateSnapshot(urlTree, rootComponent) {
    var /** @type {?} */ emptyParams = {};
    var /** @type {?} */ emptyData = {};
    var /** @type {?} */ emptyQueryParams = {};
    var /** @type {?} */ fragment = '';
    var /** @type {?} */ activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
    return new RouterStateSnapshot('', new TreeNode(activated, []));
}
/**
 * \@whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet.
 * An `ActivatedRoute` can also be used to traverse the router state tree.
 *
 * \@howToUse
 *
 * ```
 * \@Component({...})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: Observable<string> = route.params.map(p => p.id);
 *     const url: Observable<string> = route.url.map(segments => segments.join(''));
 *     // route.data includes both `data` and `resolve`
 *     const user = route.data.map(d => d.user);
 *   }
 * }
 * ```
 *
 * \@stable
 */
var ActivatedRoute = (function () {
    /**
     * \@internal
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} futureSnapshot
     */
    function ActivatedRoute(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
    }
    Object.defineProperty(ActivatedRoute.prototype, "routeConfig", {
        /**
         * The configuration used to match this route
         * @return {?}
         */
        get: function () { return this._futureSnapshot.routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "root", {
        /**
         * The root of the router state
         * @return {?}
         */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "parent", {
        /**
         * The parent of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "firstChild", {
        /**
         * The first child of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "children", {
        /**
         * The children of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "pathFromRoot", {
        /**
         * The path from the root of the router state tree to this route
         * @return {?}
         */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "paramMap", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this._paramMap) {
                this._paramMap = map.call(this.params, function (p) { return convertToParamMap(p); });
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "queryParamMap", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this._queryParamMap) {
                this._queryParamMap =
                    map.call(this.queryParams, function (p) { return convertToParamMap(p); });
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRoute.prototype.toString = function () {
        return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
    };
    return ActivatedRoute;
}());
export { ActivatedRoute };
function ActivatedRoute_tsickle_Closure_declarations() {
    /**
     * The current snapshot of this route
     * @type {?}
     */
    ActivatedRoute.prototype.snapshot;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRoute.prototype._futureSnapshot;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRoute.prototype._routerState;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRoute.prototype._paramMap;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRoute.prototype._queryParamMap;
    /**
     * An observable of the URL segments matched by this route
     * @type {?}
     */
    ActivatedRoute.prototype.url;
    /**
     * An observable of the matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRoute.prototype.params;
    /**
     * An observable of the query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.queryParams;
    /**
     * An observable of the URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.fragment;
    /**
     * An observable of the static and resolved data of this route.
     * @type {?}
     */
    ActivatedRoute.prototype.data;
    /**
     * The outlet name of the route. It's a constant
     * @type {?}
     */
    ActivatedRoute.prototype.outlet;
    /** @type {?} */
    ActivatedRoute.prototype.component;
}
/**
 * \@internal
 * @param {?} route
 * @return {?}
 */
export function inheritedParamsDataResolve(route) {
    var /** @type {?} */ pathToRoot = route.pathFromRoot;
    var /** @type {?} */ inhertingStartingFrom = pathToRoot.length - 1;
    while (inhertingStartingFrom >= 1) {
        var /** @type {?} */ current = pathToRoot[inhertingStartingFrom];
        var /** @type {?} */ parent_1 = pathToRoot[inhertingStartingFrom - 1];
        // current route is an empty path => inherits its parent's params and data
        if (current.routeConfig && current.routeConfig.path === '') {
            inhertingStartingFrom--;
            // parent is componentless => current route should inherit its params and data
        }
        else if (!parent_1.component) {
            inhertingStartingFrom--;
        }
        else {
            break;
        }
    }
    return pathToRoot.slice(inhertingStartingFrom).reduce(function (res, curr) {
        var /** @type {?} */ params = tslib_1.__assign({}, res.params, curr.params);
        var /** @type {?} */ data = tslib_1.__assign({}, res.data, curr.data);
        var /** @type {?} */ resolve = tslib_1.__assign({}, res.resolve, curr._resolvedData);
        return { params: params, data: data, resolve: resolve };
    }, /** @type {?} */ ({ params: {}, data: {}, resolve: {} }));
}
/**
 * \@whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet
 * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
 * state tree.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'./my-component.html'})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: string = route.snapshot.params.id;
 *     const url: string = route.snapshot.url.join('');
 *     const user = route.snapshot.data.user;
 *   }
 * }
 * ```
 *
 * \@stable
 */
var ActivatedRouteSnapshot = (function () {
    /**
     * \@internal
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} routeConfig
     * @param {?} urlSegment
     * @param {?} lastPathIndex
     * @param {?} resolve
     */
    function ActivatedRouteSnapshot(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._routeConfig = routeConfig;
        this._urlSegment = urlSegment;
        this._lastPathIndex = lastPathIndex;
        this._resolve = resolve;
    }
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "routeConfig", {
        /**
         * The configuration used to match this route
         * @return {?}
         */
        get: function () { return this._routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "root", {
        /**
         * The root of the router state
         * @return {?}
         */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "parent", {
        /**
         * The parent of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "firstChild", {
        /**
         * The first child of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "children", {
        /**
         * The children of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "pathFromRoot", {
        /**
         * The path from the root of the router state tree to this route
         * @return {?}
         */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "paramMap", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this._paramMap) {
                this._paramMap = convertToParamMap(this.params);
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "queryParamMap", {
        /**
         * @return {?}
         */
        get: function () {
            if (!this._queryParamMap) {
                this._queryParamMap = convertToParamMap(this.queryParams);
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRouteSnapshot.prototype.toString = function () {
        var /** @type {?} */ url = this.url.map(function (segment) { return segment.toString(); }).join('/');
        var /** @type {?} */ matched = this._routeConfig ? this._routeConfig.path : '';
        return "Route(url:'" + url + "', path:'" + matched + "')";
    };
    return ActivatedRouteSnapshot;
}());
export { ActivatedRouteSnapshot };
function ActivatedRouteSnapshot_tsickle_Closure_declarations() {
    /**
     * \@internal *
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._routeConfig;
    /**
     * \@internal *
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._urlSegment;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._lastPathIndex;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._resolve;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._resolvedData;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._routerState;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._paramMap;
    /**
     * \@internal
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype._queryParamMap;
    /**
     * The URL segments matched by this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.url;
    /**
     * The matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.params;
    /**
     * The query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.queryParams;
    /**
     * The URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.fragment;
    /**
     * The static and resolved data of this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.data;
    /**
     * The outlet name of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.outlet;
    /**
     * The component of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.component;
}
/**
 * \@whatItDoes Represents the state of the router at a moment in time.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const snapshot: RouterStateSnapshot = state.snapshot;
 *     const root: ActivatedRouteSnapshot = snapshot.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * \@description
 * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
 * the "consumed" URL segments, the extracted parameters, and the resolved data.
 *
 * \@stable
 */
var RouterStateSnapshot = (function (_super) {
    tslib_1.__extends(RouterStateSnapshot, _super);
    /**
     * \@internal
     * @param {?} url
     * @param {?} root
     */
    function RouterStateSnapshot(url, root) {
        var _this = _super.call(this, root) || this;
        _this.url = url;
        setRouterState(/** @type {?} */ (_this), root);
        return _this;
    }
    /**
     * @return {?}
     */
    RouterStateSnapshot.prototype.toString = function () { return serializeNode(this._root); };
    return RouterStateSnapshot;
}(Tree));
export { RouterStateSnapshot };
function RouterStateSnapshot_tsickle_Closure_declarations() {
    /**
     * The url from which this snapshot was created
     * @type {?}
     */
    RouterStateSnapshot.prototype.url;
}
/**
 * @template U, T
 * @param {?} state
 * @param {?} node
 * @return {?}
 */
function setRouterState(state, node) {
    node.value._routerState = state;
    node.children.forEach(function (c) { return setRouterState(state, c); });
}
/**
 * @param {?} node
 * @return {?}
 */
function serializeNode(node) {
    var /** @type {?} */ c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(", ") + " } " : '';
    return "" + node.value + c;
}
/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 * @param {?} route
 * @return {?}
 */
export function advanceActivatedRoute(route) {
    if (route.snapshot) {
        var /** @type {?} */ currentSnapshot = route.snapshot;
        var /** @type {?} */ nextSnapshot = route._futureSnapshot;
        route.snapshot = nextSnapshot;
        if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
            ((route.queryParams)).next(nextSnapshot.queryParams);
        }
        if (currentSnapshot.fragment !== nextSnapshot.fragment) {
            ((route.fragment)).next(nextSnapshot.fragment);
        }
        if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
            ((route.params)).next(nextSnapshot.params);
        }
        if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
            ((route.url)).next(nextSnapshot.url);
        }
        if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
            ((route.data)).next(nextSnapshot.data);
        }
    }
    else {
        route.snapshot = route._futureSnapshot;
        // this is for resolved data
        ((route.data)).next(route._futureSnapshot.data);
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function equalParamsAndUrlSegments(a, b) {
    var /** @type {?} */ equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
    var /** @type {?} */ parentsMismatch = !a.parent !== !b.parent;
    return equalUrlParams && !parentsMismatch &&
        (!a.parent || equalParamsAndUrlSegments(a.parent, /** @type {?} */ ((b.parent))));
}
//# sourceMappingURL=router_state.js.map