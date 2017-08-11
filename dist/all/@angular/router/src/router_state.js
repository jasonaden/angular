"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var map_1 = require("rxjs/operator/map");
var shared_1 = require("./shared");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
var tree_1 = require("./utils/tree");
/**
 * @whatItDoes Represents the state of the router.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
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
 * @description
 * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
 * segments, the extracted parameters, and the resolved data.
 *
 * See {@link ActivatedRoute} for more information.
 *
 * @stable
 */
var RouterState = (function (_super) {
    __extends(RouterState, _super);
    /** @internal */
    function RouterState(root, 
        /** The current snapshot of the router state */
        snapshot) {
        var _this = _super.call(this, root) || this;
        _this.snapshot = snapshot;
        setRouterState(_this, root);
        return _this;
    }
    RouterState.prototype.toString = function () { return this.snapshot.toString(); };
    return RouterState;
}(tree_1.Tree));
exports.RouterState = RouterState;
function createEmptyState(urlTree, rootComponent) {
    var snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    var emptyUrl = new BehaviorSubject_1.BehaviorSubject([new url_tree_1.UrlSegment('', {})]);
    var emptyParams = new BehaviorSubject_1.BehaviorSubject({});
    var emptyData = new BehaviorSubject_1.BehaviorSubject({});
    var emptyQueryParams = new BehaviorSubject_1.BehaviorSubject({});
    var fragment = new BehaviorSubject_1.BehaviorSubject('');
    var activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, shared_1.PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new tree_1.TreeNode(activated, []), snapshot);
}
exports.createEmptyState = createEmptyState;
function createEmptyStateSnapshot(urlTree, rootComponent) {
    var emptyParams = {};
    var emptyData = {};
    var emptyQueryParams = {};
    var fragment = '';
    var activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, shared_1.PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
    return new RouterStateSnapshot('', new tree_1.TreeNode(activated, []));
}
exports.createEmptyStateSnapshot = createEmptyStateSnapshot;
/**
 * @whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet.
 * An `ActivatedRoute` can also be used to traverse the router state tree.
 *
 * @howToUse
 *
 * ```
 * @Component({...})
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
 * @stable
 */
var ActivatedRoute = (function () {
    /** @internal */
    function ActivatedRoute(
        /** An observable of the URL segments matched by this route */
        url, 
        /** An observable of the matrix parameters scoped to this route */
        params, 
        /** An observable of the query parameters shared by all the routes */
        queryParams, 
        /** An observable of the URL fragment shared by all the routes */
        fragment, 
        /** An observable of the static and resolved data of this route. */
        data, 
        /** The outlet name of the route. It's a constant */
        outlet, 
        /** The component of the route. It's a constant */
        // TODO(vsavkin): remove |string
        component, futureSnapshot) {
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
        /** The configuration used to match this route */
        get: function () { return this._futureSnapshot.routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "root", {
        /** The root of the router state */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "parent", {
        /** The parent of this route in the router state tree */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "firstChild", {
        /** The first child of this route in the router state tree */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "children", {
        /** The children of this route in the router state tree */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "pathFromRoot", {
        /** The path from the root of the router state tree to this route */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "paramMap", {
        get: function () {
            if (!this._paramMap) {
                this._paramMap = map_1.map.call(this.params, function (p) { return shared_1.convertToParamMap(p); });
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "queryParamMap", {
        get: function () {
            if (!this._queryParamMap) {
                this._queryParamMap =
                    map_1.map.call(this.queryParams, function (p) { return shared_1.convertToParamMap(p); });
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    ActivatedRoute.prototype.toString = function () {
        return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
    };
    return ActivatedRoute;
}());
exports.ActivatedRoute = ActivatedRoute;
/** @internal */
function inheritedParamsDataResolve(route) {
    var pathToRoot = route.pathFromRoot;
    var inhertingStartingFrom = pathToRoot.length - 1;
    while (inhertingStartingFrom >= 1) {
        var current = pathToRoot[inhertingStartingFrom];
        var parent_1 = pathToRoot[inhertingStartingFrom - 1];
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
        var params = __assign({}, res.params, curr.params);
        var data = __assign({}, res.data, curr.data);
        var resolve = __assign({}, res.resolve, curr._resolvedData);
        return { params: params, data: data, resolve: resolve };
    }, { params: {}, data: {}, resolve: {} });
}
exports.inheritedParamsDataResolve = inheritedParamsDataResolve;
/**
 * @whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet
 * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
 * state tree.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'./my-component.html'})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: string = route.snapshot.params.id;
 *     const url: string = route.snapshot.url.join('');
 *     const user = route.snapshot.data.user;
 *   }
 * }
 * ```
 *
 * @stable
 */
var ActivatedRouteSnapshot = (function () {
    /** @internal */
    function ActivatedRouteSnapshot(
        /** The URL segments matched by this route */
        url, 
        /** The matrix parameters scoped to this route */
        params, 
        /** The query parameters shared by all the routes */
        queryParams, 
        /** The URL fragment shared by all the routes */
        fragment, 
        /** The static and resolved data of this route */
        data, 
        /** The outlet name of the route */
        outlet, 
        /** The component of the route */
        component, routeConfig, urlSegment, lastPathIndex, resolve) {
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
        /** The configuration used to match this route */
        get: function () { return this._routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "root", {
        /** The root of the router state */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "parent", {
        /** The parent of this route in the router state tree */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "firstChild", {
        /** The first child of this route in the router state tree */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "children", {
        /** The children of this route in the router state tree */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "pathFromRoot", {
        /** The path from the root of the router state tree to this route */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "paramMap", {
        get: function () {
            if (!this._paramMap) {
                this._paramMap = shared_1.convertToParamMap(this.params);
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "queryParamMap", {
        get: function () {
            if (!this._queryParamMap) {
                this._queryParamMap = shared_1.convertToParamMap(this.queryParams);
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    ActivatedRouteSnapshot.prototype.toString = function () {
        var url = this.url.map(function (segment) { return segment.toString(); }).join('/');
        var matched = this._routeConfig ? this._routeConfig.path : '';
        return "Route(url:'" + url + "', path:'" + matched + "')";
    };
    return ActivatedRouteSnapshot;
}());
exports.ActivatedRouteSnapshot = ActivatedRouteSnapshot;
/**
 * @whatItDoes Represents the state of the router at a moment in time.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
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
 * @description
 * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
 * the "consumed" URL segments, the extracted parameters, and the resolved data.
 *
 * @stable
 */
var RouterStateSnapshot = (function (_super) {
    __extends(RouterStateSnapshot, _super);
    /** @internal */
    function RouterStateSnapshot(
        /** The url from which this snapshot was created */
        url, root) {
        var _this = _super.call(this, root) || this;
        _this.url = url;
        setRouterState(_this, root);
        return _this;
    }
    RouterStateSnapshot.prototype.toString = function () { return serializeNode(this._root); };
    return RouterStateSnapshot;
}(tree_1.Tree));
exports.RouterStateSnapshot = RouterStateSnapshot;
function setRouterState(state, node) {
    node.value._routerState = state;
    node.children.forEach(function (c) { return setRouterState(state, c); });
}
function serializeNode(node) {
    var c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(", ") + " } " : '';
    return "" + node.value + c;
}
/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 */
function advanceActivatedRoute(route) {
    if (route.snapshot) {
        var currentSnapshot = route.snapshot;
        var nextSnapshot = route._futureSnapshot;
        route.snapshot = nextSnapshot;
        if (!collection_1.shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
            route.queryParams.next(nextSnapshot.queryParams);
        }
        if (currentSnapshot.fragment !== nextSnapshot.fragment) {
            route.fragment.next(nextSnapshot.fragment);
        }
        if (!collection_1.shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
            route.params.next(nextSnapshot.params);
        }
        if (!collection_1.shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
            route.url.next(nextSnapshot.url);
        }
        if (!collection_1.shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
            route.data.next(nextSnapshot.data);
        }
    }
    else {
        route.snapshot = route._futureSnapshot;
        // this is for resolved data
        route.data.next(route._futureSnapshot.data);
    }
}
exports.advanceActivatedRoute = advanceActivatedRoute;
function equalParamsAndUrlSegments(a, b) {
    var equalUrlParams = collection_1.shallowEqual(a.params, b.params) && url_tree_1.equalSegments(a.url, b.url);
    var parentsMismatch = !a.parent !== !b.parent;
    return equalUrlParams && !parentsMismatch &&
        (!a.parent || equalParamsAndUrlSegments(a.parent, b.parent));
}
exports.equalParamsAndUrlSegments = equalParamsAndUrlSegments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9yb3V0ZXJfc3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHSCx3REFBcUQ7QUFFckQseUNBQXNDO0FBR3RDLG1DQUE2RTtBQUM3RSx1Q0FBK0U7QUFDL0UsaURBQW9FO0FBQ3BFLHFDQUE0QztBQUc1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlCRztBQUNIO0lBQWlDLCtCQUFvQjtJQUNuRCxnQkFBZ0I7SUFDaEIscUJBQ0ksSUFBOEI7UUFDOUIsK0NBQStDO1FBQ3hDLFFBQTZCO1FBSHhDLFlBSUUsa0JBQU0sSUFBSSxDQUFDLFNBRVo7UUFIVSxjQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUV0QyxjQUFjLENBQWMsS0FBSSxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUMxQyxDQUFDO0lBRUQsOEJBQVEsR0FBUixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekQsa0JBQUM7QUFBRCxDQUFDLEFBWEQsQ0FBaUMsV0FBSSxHQVdwQztBQVhZLGtDQUFXO0FBYXhCLDBCQUFpQyxPQUFnQixFQUFFLGFBQThCO0lBQy9FLElBQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRSxJQUFNLFFBQVEsR0FBRyxJQUFJLGlDQUFlLENBQUMsQ0FBQyxJQUFJLHFCQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxJQUFNLFdBQVcsR0FBRyxJQUFJLGlDQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUMsSUFBTSxTQUFTLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLElB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