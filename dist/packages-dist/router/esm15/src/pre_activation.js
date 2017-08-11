/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operator/concatMap';
import { every } from 'rxjs/operator/every';
import { first } from 'rxjs/operator/first';
import { last } from 'rxjs/operator/last';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { reduce } from 'rxjs/operator/reduce';
import { ChildActivationStart } from './events';
import { equalParamsAndUrlSegments, inheritedParamsDataResolve } from './router_state';
import { andObservables, forEach, shallowEqual, wrapIntoObservable } from './utils/collection';
import { nodeChildrenAsMap } from './utils/tree';
class CanActivate {
    /**
     * @param {?} path
     */
    constructor(path) {
        this.path = path;
    }
    /**
     * @return {?}
     */
    get route() { return this.path[this.path.length - 1]; }
}
function CanActivate_tsickle_Closure_declarations() {
    /** @type {?} */
    CanActivate.prototype.path;
}
class CanDeactivate {
    /**
     * @param {?} component
     * @param {?} route
     */
    constructor(component, route) {
        this.component = component;
        this.route = route;
    }
}
function CanDeactivate_tsickle_Closure_declarations() {
    /** @type {?} */
    CanDeactivate.prototype.component;
    /** @type {?} */
    CanDeactivate.prototype.route;
}
/**
 * This class bundles the actions involved in preactivation of a route.
 */
export class PreActivation {
    /**
     * @param {?} future
     * @param {?} curr
     * @param {?} moduleInjector
     * @param {?=} forwardEvent
     */
    constructor(future, curr, moduleInjector, forwardEvent) {
        this.future = future;
        this.curr = curr;
        this.moduleInjector = moduleInjector;
        this.forwardEvent = forwardEvent;
        this.canActivateChecks = [];
        this.canDeactivateChecks = [];
    }
    /**
     * @param {?} parentContexts
     * @return {?}
     */
    initalize(parentContexts) {
        const /** @type {?} */ futureRoot = this.future._root;
        const /** @type {?} */ currRoot = this.curr ? this.curr._root : null;
        this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
    }
    /**
     * @return {?}
     */
    checkGuards() {
        if (!this.isDeactivating() && !this.isActivating()) {
            return of(true);
        }
        const /** @type {?} */ canDeactivate$ = this.runCanDeactivateChecks();
        return mergeMap.call(canDeactivate$, (canDeactivate) => canDeactivate ? this.runCanActivateChecks() : of(false));
    }
    /**
     * @return {?}
     */
    resolveData() {
        if (!this.isActivating())
            return of(null);
        const /** @type {?} */ checks$ = from(this.canActivateChecks);
        const /** @type {?} */ runningChecks$ = concatMap.call(checks$, (check) => this.runResolve(check.route));
        return reduce.call(runningChecks$, (_, __) => _);
    }
    /**
     * @return {?}
     */
    isDeactivating() { return this.canDeactivateChecks.length !== 0; }
    /**
     * @return {?}
     */
    isActivating() { return this.canActivateChecks.length !== 0; }
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @param {?} futurePath
     * @return {?}
     */
    setupChildRouteGuards(futureNode, currNode, contexts, futurePath) {
        const /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        // Process the children of the future route
        futureNode.children.forEach(c => {
            this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        // Process any children left from the current route (not active for the future route)
        forEach(prevChildren, (v, k) => this.deactivateRouteAndItsChildren(v, /** @type {?} */ ((contexts)).getContext(k)));
    }
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @param {?} futurePath
     * @return {?}
     */
    setupRouteGuards(futureNode, currNode, parentContexts, futurePath) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        const /** @type {?} */ context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        // reusing the node
        if (curr && future._routeConfig === curr._routeConfig) {
            const /** @type {?} */ shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, /** @type {?} */ ((future._routeConfig)).runGuardsAndResolvers);
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
                const /** @type {?} */ outlet = ((((context)).outlet));
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
    }
    /**
     * @param {?} curr
     * @param {?} future
     * @param {?} mode
     * @return {?}
     */
    shouldRunGuardsAndResolvers(curr, future, mode) {
        switch (mode) {
            case 'always':
                return true;
            case 'paramsOrQueryParamsChange':
                return !equalParamsAndUrlSegments(curr, future) ||
                    !shallowEqual(curr.queryParams, future.queryParams);
            case 'paramsChange':
            default:
                return !equalParamsAndUrlSegments(curr, future);
        }
    }
    /**
     * @param {?} route
     * @param {?} context
     * @return {?}
     */
    deactivateRouteAndItsChildren(route, context) {
        const /** @type {?} */ children = nodeChildrenAsMap(route);
        const /** @type {?} */ r = route.value;
        forEach(children, (node, childName) => {
            if (!r.component) {
                this.deactivateRouteAndItsChildren(node, context);
            }
            else if (context) {
                this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
            }
            else {
                this.deactivateRouteAndItsChildren(node, null);
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
    }
    /**
     * @return {?}
     */
    runCanDeactivateChecks() {
        const /** @type {?} */ checks$ = from(this.canDeactivateChecks);
        const /** @type {?} */ runningChecks$ = mergeMap.call(checks$, (check) => this.runCanDeactivate(check.component, check.route));
        return every.call(runningChecks$, (result) => result === true);
    }
    /**
     * @return {?}
     */
    runCanActivateChecks() {
        const /** @type {?} */ checks$ = from(this.canActivateChecks);
        const /** @type {?} */ runningChecks$ = concatMap.call(checks$, (check) => andObservables(from([
            this.fireChildActivationStart(check.path), this.runCanActivateChild(check.path),
            this.runCanActivate(check.route)
        ])));
        return every.call(runningChecks$, (result) => result === true);
        // this.fireChildActivationStart(check.path),
    }
    /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     * @param {?} path
     * @return {?}
     */
    fireChildActivationStart(path) {
        if (!this.forwardEvent)
            return of(true);
        const /** @type {?} */ childActivations = path.slice(0, path.length - 1).reverse().filter(_ => _ !== null);
        return andObservables(map.call(from(childActivations), (snapshot) => {
            if (this.forwardEvent && snapshot._routeConfig) {
                this.forwardEvent(new ChildActivationStart(snapshot._routeConfig));
            }
            return of(true);
        }));
    }
    /**
     * @param {?} future
     * @return {?}
     */
    runCanActivate(future) {
        const /** @type {?} */ canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of(true);
        const /** @type {?} */ obs = map.call(from(canActivate), (c) => {
            const /** @type {?} */ guard = this.getToken(c, future);
            let /** @type {?} */ observable;
            if (guard.canActivate) {
                observable = wrapIntoObservable(guard.canActivate(future, this.future));
            }
            else {
                observable = wrapIntoObservable(guard(future, this.future));
            }
            return first.call(observable);
        });
        return andObservables(obs);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    runCanActivateChild(path) {
        const /** @type {?} */ future = path[path.length - 1];
        const /** @type {?} */ canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(p => this.extractCanActivateChild(p))
            .filter(_ => _ !== null);
        return andObservables(map.call(from(canActivateChildGuards), (d) => {
            const /** @type {?} */ obs = map.call(from(d.guards), (c) => {
                const /** @type {?} */ guard = this.getToken(c, d.node);
                let /** @type {?} */ observable;
                if (guard.canActivateChild) {
                    observable = wrapIntoObservable(guard.canActivateChild(future, this.future));
                }
                else {
                    observable = wrapIntoObservable(guard(future, this.future));
                }
                return first.call(observable);
            });
            return andObservables(obs);
        }));
    }
    /**
     * @param {?} p
     * @return {?}
     */
    extractCanActivateChild(p) {
        const /** @type {?} */ canActivateChild = p._routeConfig ? p._routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    }
    /**
     * @param {?} component
     * @param {?} curr
     * @return {?}
     */
    runCanDeactivate(component, curr) {
        const /** @type {?} */ canDeactivate = curr && curr._routeConfig ? curr._routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of(true);
        const /** @type {?} */ canDeactivate$ = mergeMap.call(from(canDeactivate), (c) => {
            const /** @type {?} */ guard = this.getToken(c, curr);
            let /** @type {?} */ observable;
            if (guard.canDeactivate) {
                observable =
                    wrapIntoObservable(guard.canDeactivate(component, curr, this.curr, this.future));
            }
            else {
                observable = wrapIntoObservable(guard(component, curr, this.curr, this.future));
            }
            return first.call(observable);
        });
        return every.call(canDeactivate$, (result) => result === true);
    }
    /**
     * @param {?} future
     * @return {?}
     */
    runResolve(future) {
        const /** @type {?} */ resolve = future._resolve;
        return map.call(this.resolveNode(resolve, future), (resolvedData) => {
            future._resolvedData = resolvedData;
            future.data = Object.assign({}, future.data, inheritedParamsDataResolve(future).resolve);
            return null;
        });
    }
    /**
     * @param {?} resolve
     * @param {?} future
     * @return {?}
     */
    resolveNode(resolve, future) {
        const /** @type {?} */ keys = Object.keys(resolve);
        if (keys.length === 0) {
            return of({});
        }
        if (keys.length === 1) {
            const /** @type {?} */ key = keys[0];
            return map.call(this.getResolver(resolve[key], future), (value) => { return { [key]: value }; });
        }
        const /** @type {?} */ data = {};
        const /** @type {?} */ runningResolvers$ = mergeMap.call(from(keys), (key) => {
            return map.call(this.getResolver(resolve[key], future), (value) => {
                data[key] = value;
                return value;
            });
        });
        return map.call(last.call(runningResolvers$), () => data);
    }
    /**
     * @param {?} injectionToken
     * @param {?} future
     * @return {?}
     */
    getResolver(injectionToken, future) {
        const /** @type {?} */ resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? wrapIntoObservable(resolver.resolve(future, this.future)) :
            wrapIntoObservable(resolver(future, this.future));
    }
    /**
     * @param {?} token
     * @param {?} snapshot
     * @return {?}
     */
    getToken(token, snapshot) {
        const /** @type {?} */ config = closestLoadedConfig(snapshot);
        const /** @type {?} */ injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
    }
}
function PreActivation_tsickle_Closure_declarations() {
    /** @type {?} */
    PreActivation.prototype.canActivateChecks;
    /** @type {?} */
    PreActivation.prototype.canDeactivateChecks;
    /** @type {?} */
    PreActivation.prototype.future;
    /** @type {?} */
    PreActivation.prototype.curr;
    /** @type {?} */
    PreActivation.prototype.moduleInjector;
    /** @type {?} */
    PreActivation.prototype.forwardEvent;
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    for (let /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        const /** @type {?} */ route = s._routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
    }
    return null;
}
//# sourceMappingURL=pre_activation.js.map