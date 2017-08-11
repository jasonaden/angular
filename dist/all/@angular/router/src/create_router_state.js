"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var router_state_1 = require("./router_state");
var tree_1 = require("./utils/tree");
function createRouterState(routeReuseStrategy, curr, prevState) {
    var root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
    return new router_state_1.RouterState(root, curr);
}
exports.createRouterState = createRouterState;
function createNode(routeReuseStrategy, curr, prevState) {
    // reuse an activated route that is currently displayed on the screen
    if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
        var value = prevState.value;
        value._futureSnapshot = curr.value;
        var children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
        return new tree_1.TreeNode(value, children);
        // retrieve an activated route that is used to be displayed, but is not currently displayed
    }
    else if (routeReuseStrategy.retrieve(curr.value)) {
        var tree = routeReuseStrategy.retrieve(curr.value).route;
        setFutureSnapshotsOfActivatedRoutes(curr, tree);
        return tree;
    }
    else {
        var value = createActivatedRoute(curr.value);
        var children = curr.children.map(function (c) { return createNode(routeReuseStrategy, c); });
        return new tree_1.TreeNode(value, children);
    }
}
function setFutureSnapshotsOfActivatedRoutes(curr, result) {
    if (curr.value.routeConfig !== result.value.routeConfig) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot created from a different route');
    }
    if (curr.children.length !== result.children.length) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot with a different number of children');
    }
    result.value._futureSnapshot = curr.value;
    for (var i = 0; i < curr.children.length; ++i) {
        setFutureSnapshotsOfActivatedRoutes(curr.children[i], result.children[i]);
    }
}
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
    return curr.children.map(function (child) {
        for (var _i = 0, _a = prevState.children; _i < _a.length; _i++) {
            var p = _a[_i];
            if (routeReuseStrategy.shouldReuseRoute(p.value.snapshot, child.value)) {
                return createNode(routeReuseStrategy, child, p);
            }
        }
        return createNode(routeReuseStrategy, child);
    });
}
function createActivatedRoute(c) {
    return new router_state_1.ActivatedRoute(new BehaviorSubject_1.BehaviorSubject(c.url), new BehaviorSubject_1.BehaviorSubject(c.params), new BehaviorSubject_1.BehaviorSubject(c.queryParams), new BehaviorSubject_1.BehaviorSubject(c.fragment), new BehaviorSubject_1.BehaviorSubject(c.data), c.outlet, c.component, c);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3JvdXRlcl9zdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvY3JlYXRlX3JvdXRlcl9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHdEQUFxRDtBQUdyRCwrQ0FBd0c7QUFDeEcscUNBQXNDO0FBRXRDLDJCQUNJLGtCQUFzQyxFQUFFLElBQXlCLEVBQ2pFLFNBQXNCO0lBQ3hCLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ2pHLE1BQU0sQ0FBQyxJQUFJLDBCQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFMRCw4Q0FLQztBQUVELG9CQUNJLGtCQUFzQyxFQUFFLElBQXNDLEVBQzlFLFNBQW9DO0lBQ3RDLHFFQUFxRTtJQUNyRSxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQzlCLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNuQyxJQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLElBQUksZUFBUSxDQUFpQixLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckQsMkZBQTJGO0lBQzdGLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxD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