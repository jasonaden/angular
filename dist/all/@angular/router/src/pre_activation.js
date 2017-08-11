"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var from_1 = require("rxjs/observable/from");
var of_1 = require("rxjs/observable/of");
var concatMap_1 = require("rxjs/operator/concatMap");
var every_1 = require("rxjs/operator/every");
var first_1 = require("rxjs/operator/first");
var last_1 = require("rxjs/operator/last");
var map_1 = require("rxjs/operator/map");
var mergeMap_1 = require("rxjs/operator/mergeMap");
var reduce_1 = require("rxjs/operator/reduce");
var events_1 = require("./events");
var router_state_1 = require("./router_state");
var collection_1 = require("./utils/collection");
var tree_1 = require("./utils/tree");
var CanActivate = (function () {
    function CanActivate(path) {
        this.path = path;
    }
    Object.defineProperty(CanActivate.prototype, "route", {
        get: function () { return this.path[this.path.length - 1]; },
        enumerable: true,
        configurable: true
    });
    return CanActivate;
}());
var CanDeactivate = (function () {
    function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
    }
    return CanDeactivate;
}());
/**
 * This class bundles the actions involved in preactivation of a route.
 */
var PreActivation = (function () {
    function PreActivation(future, curr, moduleInjector, forwardEvent) {
        this.future = future;
        this.curr = curr;
        this.moduleInjector = moduleInjector;
        this.forwardEvent = forwardEvent;
        this.canActivateChecks = [];
        this.canDeactivateChecks = [];
    }
    PreActivation.prototype.initalize = function (parentContexts) {
        var futureRoot = this.future._root;
        var currRoot = this.curr ? this.curr._root : null;
        this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
    };
    PreActivation.prototype.checkGuards = function () {
        var _this = this;
        if (!this.isDeactivating() && !this.isActivating()) {
            return of_1.of(true);
        }
        var canDeactivate$ = this.runCanDeactivateChecks();
        return mergeMap_1.mergeMap.call(canDeactivate$, function (canDeactivate) { return canDeactivate ? _this.runCanActivateChecks() : of_1.of(false); });
    };
    PreActivation.prototype.resolveData = function () {
        var _this = this;
        if (!this.isActivating())
            return of_1.of(null);
        var checks$ = from_1.from(this.canActivateChecks);
        var runningChecks$ = concatMap_1.concatMap.call(checks$, function (check) { return _this.runResolve(check.route); });
        return reduce_1.reduce.call(runningChecks$, function (_, __) { return _; });
    };
    PreActivation.prototype.isDeactivating = function () { return this.canDeactivateChecks.length !== 0; };
    PreActivation.prototype.isActivating = function () { return this.canActivateChecks.length !== 0; };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    PreActivation.prototype.setupChildRouteGuards = function (futureNode, currNode, contexts, futurePath) {
        var _this = this;
        var prevChildren = tree_1.nodeChildrenAsMap(currNode);
        // Process the children of the future route
        futureNode.children.forEach(function (c) {
            _this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        // Process any children left from the current route (not active for the future route)
        collection_1.forEach(prevChildren, function (v, k) {
            return _this.deactivateRouteAndItsChildren(v, contexts.getContext(k));
        });
    };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    PreActivation.prototype.setupRouteGuards = function (futureNode, currNode, parentContexts, futurePath) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        var context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        // reusing the node
        if (curr && future._routeConfig === curr._routeConfig) {
            var shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, future._routeConfig.runGuardsAndResolvers);
            if (shouldRunGuardsAndResolvers) {
                this.canActivateChecks.push(new CanActivate(futurePath));
            }
            else {
                // we need to set the data
                future.data = curr.data;
                future._resolvedData = curr._resolvedData;
            }
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, currNode, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, currNode, parentContexts, futurePath);
            }
            if (shouldRunGuardsAndResolvers) {
                var outlet = context.outlet;
                this.canDeactivateChecks.push(new CanDeactivate(outlet.component, curr));
            }
        }
        else {
            if (curr) {
                this.deactivateRouteAndItsChildren(currNode, context);
            }
            this.canActivateChecks.push(new CanActivate(futurePath));
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, null, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, null, parentContexts, futurePath);
            }
        }
    };
    PreActivation.prototype.shouldRunGuardsAndResolvers = function (curr, future, mode) {
        switch (mode) {
            case 'always':
                return true;
            case 'paramsOrQueryParamsChange':
                return !router_state_1.equalParamsAndUrlSegments(curr, future) ||
                    !collection_1.shallowEqual(curr.queryParams, future.queryParams);
            case 'paramsChange':
            default:
                return !router_state_1.equalParamsAndUrlSegments(curr, future);
        }
    };
    PreActivation.prototype.deactivateRouteAndItsChildren = function (route, context) {
        var _this = this;
        var children = tree_1.nodeChildrenAsMap(route);
        var r = route.value;
        collection_1.forEach(children, function (node, childName) {
            if (!r.component) {
                _this.deactivateRouteAndItsChildren(node, context);
            }
            else if (context) {
                _this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
            }
            else {
                _this.deactivateRouteAndItsChildren(node, null);
            }
        });
        if (!r.component) {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
        else if (context && context.outlet && context.outlet.isActivated) {
            this.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
        }
        else {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
    };
    PreActivation.prototype.runCanDeactivateChecks = function () {
        var _this = this;
        var checks$ = from_1.from(this.canDeactivateChecks);
        var runningChecks$ = mergeMap_1.mergeMap.call(checks$, function (check) { return _this.runCanDeactivate(check.component, check.route); });
        return every_1.every.call(runningChecks$, function (result) { return result === true; });
    };
    PreActivation.prototype.runCanActivateChecks = function () {
        var _this = this;
        var checks$ = from_1.from(this.canActivateChecks);
        var runningChecks$ = concatMap_1.concatMap.call(checks$, function (check) { return collection_1.andObservables(from_1.from([
            _this.fireChildActivationStart(check.path), _this.runCanActivateChild(check.path),
            _this.runCanActivate(check.route)
        ])); });
        return every_1.every.call(runningChecks$, function (result) { return result === true; });
        // this.fireChildActivationStart(check.path),
    };
    /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     */
    PreActivation.prototype.fireChildActivationStart = function (path) {
        var _this = this;
        if (!this.forwardEvent)
            return of_1.of(true);
        var childActivations = path.slice(0, path.length - 1).reverse().filter(function (_) { return _ !== null; });
        return collection_1.andObservables(map_1.map.call(from_1.from(childActivations), function (snapshot) {
            if (_this.forwardEvent && snapshot._routeConfig) {
                _this.forwardEvent(new events_1.ChildActivationStart(snapshot._routeConfig));
            }
            return of_1.of(true);
        }));
    };
    PreActivation.prototype.runCanActivate = function (future) {
        var _this = this;
        var canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of_1.of(true);
        var obs = map_1.map.call(from_1.from(canActivate), function (c) {
            var guard = _this.getToken(c, future);
            var observable;
            if (guard.canActivate) {
                observable = collection_1.wrapIntoObservable(guard.canActivate(future, _this.future));
            }
            else {
                observable = collection_1.wrapIntoObservable(guard(future, _this.future));
            }
            return first_1.first.call(observable);
        });
        return collection_1.andObservables(obs);
    };
    PreActivation.prototype.runCanActivateChild = function (path) {
        var _this = this;
        var future = path[path.length - 1];
        var canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(function (p) { return _this.extractCanActivateChild(p); })
            .filter(function (_) { return _ !== null; });
        return collection_1.andObservables(map_1.map.call(from_1.from(canActivateChildGuards), function (d) {
            var obs = map_1.map.call(from_1.from(d.guards), function (c) {
                var guard = _this.getToken(c, d.node);
                var observable;
                if (guard.canActivateChild) {
                    observable = collection_1.wrapIntoObservable(guard.canActivateChild(future, _this.future));
                }
                else {
                    observable = collection_1.wrapIntoObservable(guard(future, _this.future));
                }
                return first_1.first.call(observable);
            });
            return collection_1.andObservables(obs);
        }));
    };
    PreActivation.prototype.extractCanActivateChild = function (p) {
        var canActivateChild = p._routeConfig ? p._routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    };
    PreActivation.prototype.runCanDeactivate = function (component, curr) {
        var _this = this;
        var canDeactivate = curr && curr._routeConfig ? curr._routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of_1.of(true);
        var canDeactivate$ = mergeMap_1.mergeMap.call(from_1.from(canDeactivate), function (c) {
            var guard = _this.getToken(c, curr);
            var observable;
            if (guard.canDeactivate) {
                observable =
                    collection_1.wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr, _this.future));
            }
            else {
                observable = collection_1.wrapIntoObservable(guard(component, curr, _this.curr, _this.future));
            }
            return first_1.first.call(observable);
        });
        return every_1.every.call(canDeactivate$, function (result) { return result === true; });
    };
    PreActivation.prototype.runResolve = function (future) {
        var resolve = future._resolve;
        return map_1.map.call(this.resolveNode(resolve, future), function (resolvedData) {
            future._resolvedData = resolvedData;
            future.data = __assign({}, future.data, router_state_1.inheritedParamsDataResolve(future).resolve);
            return null;
        });
    };
    PreActivation.prototype.resolveNode = function (resolve, future) {
        var _this = this;
        var keys = Object.keys(resolve);
        if (keys.length === 0) {
            return of_1.of({});
        }
        if (keys.length === 1) {
            var key_1 = keys[0];
            return map_1.map.call(this.getResolver(resolve[key_1], future), function (value) {
                return _a = {}, _a[key_1] = value, _a;
                var _a;
            });
        }
        var data = {};
        var runningResolvers$ = mergeMap_1.mergeMap.call(from_1.from(keys), function (key) {
            return map_1.map.call(_this.getResolver(resolve[key], future), function (value) {
                data[key] = value;
                return value;
            });
        });
        return map_1.map.call(last_1.last.call(runningResolvers$), function () { return data; });
    };
    PreActivation.prototype.getResolver = function (injectionToken, future) {
        var resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? collection_1.wrapIntoObservable(resolver.resolve(future, this.future)) :
            collection_1.wrapIntoObservable(resolver(future, this.future));
    };
    PreActivation.prototype.getToken = function (token, snapshot) {
        var config = closestLoadedConfig(snapshot);
        var injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
    };
    return PreActivation;
}());
exports.PreActivation = PreActivation;
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    for (var s = snapshot.parent; s; s = s.parent) {
        var route = s._routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlX2FjdGl2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3ByZV9hY3RpdmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFJSCw2Q0FBMEM7QUFDMUMseUNBQXVDO0FBQ3ZDLHFEQUFrRDtBQUNsRCw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLDJDQUF3QztBQUN4Qyx5Q0FBc0M7QUFDdEMsbURBQWdEO0FBQ2hELCtDQUE0QztBQUc1QyxtQ0FBMEQ7QUFFMUQsK0NBQWtJO0FBQ2xJLGlEQUE2RjtBQUM3RixxQ0FBeUQ7QUFFekQ7SUFDRSxxQkFBbUIsSUFBOEI7UUFBOUIsU0FBSSxHQUFKLElBQUksQ0FBMEI7SUFBRyxDQUFDO0lBQ3JELHNCQUFJLDhCQUFLO2FBQVQsY0FBc0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNqRixrQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBRUQ7SUFDRSx1QkFBbUIsU0FBc0IsRUFBUyxLQUE2QjtRQUE1RCxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBd0I7SUFBRyxDQUFDO0lBQ3JGLG9CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDs7R0FFRztBQUNIO0lBSUUsdUJBQ1ksTUFBMkIsRUFBVSxJQUF5QixFQUM5RCxjQUF3QixFQUFVLFlBQXdDO1FBRDFFLFdBQU0sR0FBTixNQUFNLENBQXFCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFDOUQsbUJBQWMsR0FBZCxjQUFjLENBQVU7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBNEI7UUFMOUUsc0JBQWlCLEdBQWtCLEVBQUUsQ0FBQztRQUN0Qyx3QkFBbUIsR0FB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