/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModuleRef, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operator/concatMap';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { applyRedirects } from './apply_redirects';
import { validateConfig } from './config';
import { createRouterState } from './create_router_state';
import { createUrlTree } from './create_url_tree';
import { ChildActivationEnd, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized } from './events';
import { PreActivation } from './pre_activation';
import { recognize } from './recognize';
import { DefaultRouteReuseStrategy } from './route_reuse_strategy';
import { RouterConfigLoader } from './router_config_loader';
import { advanceActivatedRoute, createEmptyState } from './router_state';
import { isNavigationCancelingError } from './shared';
import { DefaultUrlHandlingStrategy } from './url_handling_strategy';
import { UrlTree, containsTree, createEmptyUrlTree } from './url_tree';
import { forEach } from './utils/collection';
import { nodeChildrenAsMap } from './utils/tree';
/**
 * \@whatItDoes Represents the extra options used during navigation.
 *
 * \@stable
 * @record
 */
export function NavigationExtras() { }
function NavigationExtras_tsickle_Closure_declarations() {
    /**
     * Enables relative navigation from the current ActivatedRoute.
     *
     * Configuration:
     *
     * ```
     * [{
     *   path: 'parent',
     *   component: ParentComponent,
     *   children: [{
     *     path: 'list',
     *     component: ListComponent
     *   },{
     *     path: 'child',
     *     component: ChildComponent
     *   }]
     * }]
     * ```
     *
     * Navigate to list route from child route:
     *
     * ```
     *  \@Component({...})
     *  class ChildComponent {
     *    constructor(private router: Router, private route: ActivatedRoute) {}
     *
     *    go() {
     *      this.router.navigate(['../list'], { relativeTo: this.route });
     *    }
     *  }
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.relativeTo;
    /**
     * Sets query parameters to the URL.
     *
     * ```
     * // Navigate to /results?page=1
     * this.router.navigate(['/results'], { queryParams: { page: 1 } });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.queryParams;
    /**
     * Sets the hash fragment for the URL.
     *
     * ```
     * // Navigate to /results#top
     * this.router.navigate(['/results'], { fragment: 'top' });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.fragment;
    /**
     * Preserves the query parameters for the next navigation.
     *
     * deprecated, use `queryParamsHandling` instead
     *
     * ```
     * // Preserve query params from /results?page=1 to /view?page=1
     * this.router.navigate(['/view'], { preserveQueryParams: true });
     * ```
     *
     * @deprecated since v4
     * @type {?|undefined}
     */
    NavigationExtras.prototype.preserveQueryParams;
    /**
     *  config strategy to handle the query parameters for the next navigation.
     *
     * ```
     * // from /results?page=1 to /view?page=1&page=2
     * this.router.navigate(['/view'], { queryParams: { page: 2 },  queryParamsHandling: "merge" });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.queryParamsHandling;
    /**
     * Preserves the fragment for the next navigation
     *
     * ```
     * // Preserve fragment from /results#top to /view#top
     * this.router.navigate(['/view'], { preserveFragment: true });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.preserveFragment;
    /**
     * Navigates without pushing a new state into history.
     *
     * ```
     * // Navigate silently to /view
     * this.router.navigate(['/view'], { skipLocationChange: true });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.skipLocationChange;
    /**
     * Navigates while replacing the current state in history.
     *
     * ```
     * // Navigate to /view
     * this.router.navigate(['/view'], { replaceUrl: true });
     * ```
     * @type {?|undefined}
     */
    NavigationExtras.prototype.replaceUrl;
}
/**
 * @param {?} error
 * @return {?}
 */
function defaultErrorHandler(error) {
    throw error;
}
/**
 * \@internal
 * @param {?} snapshot
 * @return {?}
 */
function defaultRouterHook(snapshot) {
    return (of(null));
}
/**
 * \@whatItDoes Provides the navigation and url manipulation capabilities.
 *
 * See {\@link Routes} for more details and examples.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
export class Router {
    /**
     * @param {?} rootComponentType
     * @param {?} urlSerializer
     * @param {?} rootContexts
     * @param {?} location
     * @param {?} injector
     * @param {?} loader
     * @param {?} compiler
     * @param {?} config
     */
    constructor(rootComponentType, urlSerializer, rootContexts, location, injector, loader, compiler, config) {
        this.rootComponentType = rootComponentType;
        this.urlSerializer = urlSerializer;
        this.rootContexts = rootContexts;
        this.location = location;
        this.config = config;
        this.navigations = new BehaviorSubject(/** @type {?} */ ((null)));
        this.routerEvents = new Subject();
        this.navigationId = 0;
        /**
         * Error handler that is invoked when a navigation errors.
         *
         * See {\@link ErrorHandler} for more information.
         */
        this.errorHandler = defaultErrorHandler;
        /**
         * Indicates if at least one navigation happened.
         */
        this.navigated = false;
        /**
         * Used by RouterModule. This allows us to
         * pause the navigation either before preactivation or after it.
         * \@internal
         */
        this.hooks = {
            beforePreactivation: defaultRouterHook,
            afterPreactivation: defaultRouterHook
        };
        /**
         * Extracts and merges URLs. Used for AngularJS to Angular migrations.
         */
        this.urlHandlingStrategy = new DefaultUrlHandlingStrategy();
        this.routeReuseStrategy = new DefaultRouteReuseStrategy();
        const /** @type {?} */ onLoadStart = (r) => this.triggerEvent(new RouteConfigLoadStart(r));
        const /** @type {?} */ onLoadEnd = (r) => this.triggerEvent(new RouteConfigLoadEnd(r));
        this.ngModule = injector.get(NgModuleRef);
        this.resetConfig(config);
        this.currentUrlTree = createEmptyUrlTree();
        this.rawUrlTree = this.currentUrlTree;
        this.configLoader = new RouterConfigLoader(loader, compiler, onLoadStart, onLoadEnd);
        this.currentRouterState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        this.processNavigations();
    }
    /**
     * \@internal
     * TODO: this should be removed once the constructor of the router made internal
     * @param {?} rootComponentType
     * @return {?}
     */
    resetRootComponentType(rootComponentType) {
        this.rootComponentType = rootComponentType;
        // TODO: vsavkin router 4.0 should make the root component set to null
        // this will simplify the lifecycle of the router.
        this.currentRouterState.root.component = this.rootComponentType;
    }
    /**
     * Sets up the location change listener and performs the initial navigation.
     * @return {?}
     */
    initialNavigation() {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), { replaceUrl: true });
        }
    }
    /**
     * Sets up the location change listener.
     * @return {?}
     */
    setUpLocationChangeListener() {
        // Zone.current.wrap is needed because of the issue with RxJS scheduler,
        // which does not work properly with zone.js in IE and Safari
        if (!this.locationSubscription) {
            this.locationSubscription = (this.location.subscribe(Zone.current.wrap((change) => {
                const /** @type {?} */ rawUrlTree = this.urlSerializer.parse(change['url']);
                const /** @type {?} */ source = change['type'] === 'popstate' ? 'popstate' : 'hashchange';
                setTimeout(() => { this.scheduleNavigation(rawUrlTree, source, { replaceUrl: true }); }, 0);
            })));
        }
    }
    /**
     * The current route state
     * @return {?}
     */
    get routerState() { return this.currentRouterState; }
    /**
     * The current url
     * @return {?}
     */
    get url() { return this.serializeUrl(this.currentUrlTree); }
    /**
     * An observable of router events
     * @return {?}
     */
    get events() { return this.routerEvents; }
    /**
     * \@internal
     * @param {?} e
     * @return {?}
     */
    triggerEvent(e) { this.routerEvents.next(e); }
    /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     * @param {?} config
     * @return {?}
     */
    resetConfig(config) {
        validateConfig(config);
        this.config = config;
        this.navigated = false;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    ngOnDestroy() { this.dispose(); }
    /**
     * Disposes of the router
     * @return {?}
     */
    dispose() {
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
            this.locationSubscription = ((null));
        }
    }
    /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     * @param {?} commands
     * @param {?=} navigationExtras
     * @return {?}
     */
    createUrlTree(commands, navigationExtras = {}) {
        const { relativeTo, queryParams, fragment, preserveQueryParams, queryParamsHandling, preserveFragment } = navigationExtras;
        if (isDevMode() && preserveQueryParams && (console) && (console.warn)) {
            console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
        }
        const /** @type {?} */ a = relativeTo || this.routerState.root;
        const /** @type {?} */ f = preserveFragment ? this.currentUrlTree.fragment : fragment;
        let /** @type {?} */ q = null;
        if (queryParamsHandling) {
            switch (queryParamsHandling) {
                case 'merge':
                    q = Object.assign({}, this.currentUrlTree.queryParams, queryParams);
                    break;
                case 'preserve':
                    q = this.currentUrlTree.queryParams;
                    break;
                default:
                    q = queryParams || null;
            }
        }
        else {
            q = preserveQueryParams ? this.currentUrlTree.queryParams : queryParams || null;
        }
        return createUrlTree(a, this.currentUrlTree, commands, /** @type {?} */ ((q)), /** @type {?} */ ((f)));
    }
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     * @param {?} url
     * @param {?=} extras
     * @return {?}
     */
    navigateByUrl(url, extras = { skipLocationChange: false }) {
        const /** @type {?} */ urlTree = url instanceof UrlTree ? url : this.parseUrl(url);
        const /** @type {?} */ mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
        return this.scheduleNavigation(mergedTree, 'imperative', extras);
    }
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     * @param {?} commands
     * @param {?=} extras
     * @return {?}
     */
    navigate(commands, extras = { skipLocationChange: false }) {
        validateCommands(commands);
        if (typeof extras.queryParams === 'object' && extras.queryParams !== null) {
            extras.queryParams = this.removeEmptyProps(extras.queryParams);
        }
        return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
    }
    /**
     * Serializes a {\@link UrlTree} into a string
     * @param {?} url
     * @return {?}
     */
    serializeUrl(url) { return this.urlSerializer.serialize(url); }
    /**
     * Parses a string into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    parseUrl(url) { return this.urlSerializer.parse(url); }
    /**
     * Returns whether the url is activated
     * @param {?} url
     * @param {?} exact
     * @return {?}
     */
    isActive(url, exact) {
        if (url instanceof UrlTree) {
            return containsTree(this.currentUrlTree, url, exact);
        }
        const /** @type {?} */ urlTree = this.urlSerializer.parse(url);
        return containsTree(this.currentUrlTree, urlTree, exact);
    }
    /**
     * @param {?} params
     * @return {?}
     */
    removeEmptyProps(params) {
        return Object.keys(params).reduce((result, key) => {
            const /** @type {?} */ value = params[key];
            if (value !== null && value !== undefined) {
                result[key] = value;
            }
            return result;
        }, {});
    }
    /**
     * @return {?}
     */
    processNavigations() {
        concatMap
            .call(this.navigations, (nav) => {
            if (nav) {
                this.executeScheduledNavigation(nav);
                // a failed navigation should not stop the router from processing
                // further navigations => the catch
                return nav.promise.catch(() => { });
            }
            else {
                return (of(null));
            }
        })
            .subscribe(() => { });
    }
    /**
     * @param {?} rawUrl
     * @param {?} source
     * @param {?} extras
     * @return {?}
     */
    scheduleNavigation(rawUrl, source, extras) {
        const /** @type {?} */ lastNavigation = this.navigations.value;
        // If the user triggers a navigation imperatively (e.g., by using navigateByUrl),
        // and that navigation results in 'replaceState' that leads to the same URL,
        // we should skip those.
        if (lastNavigation && source !== 'imperative' && lastNavigation.source === 'imperative' &&
            lastNavigation.rawUrl.toString() === rawUrl.toString()) {
            return Promise.resolve(true); // return value is not used
        }
        // Because of a bug in IE and Edge, the location class fires two events (popstate and
        // hashchange) every single time. The second one should be ignored. Otherwise, the URL will
        // flicker.
        if (lastNavigation && source == 'hashchange' && lastNavigation.source === 'popstate' &&
            lastNavigation.rawUrl.toString() === rawUrl.toString()) {
            return Promise.resolve(true); // return value is not used
        }
        let /** @type {?} */ resolve = null;
        let /** @type {?} */ reject = null;
        const /** @type {?} */ promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const /** @type {?} */ id = ++this.navigationId;
        this.navigations.next({ id, source, rawUrl, extras, resolve, reject, promise });
        // Make sure that the error is propagated even though `processNavigations` catch
        // handler does not rethrow
        return promise.catch((e) => Promise.reject(e));
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    executeScheduledNavigation({ id, rawUrl, extras, resolve, reject }) {
        const /** @type {?} */ url = this.urlHandlingStrategy.extract(rawUrl);
        const /** @type {?} */ urlTransition = !this.navigated || url.toString() !== this.currentUrlTree.toString();
        if (urlTransition && this.urlHandlingStrategy.shouldProcessUrl(rawUrl)) {
            this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
            Promise.resolve()
                .then((_) => this.runNavigate(url, rawUrl, !!extras.skipLocationChange, !!extras.replaceUrl, id, null))
                .then(resolve, reject);
            // we cannot process the current URL, but we could process the previous one =>
            // we need to do some cleanup
        }
        else if (urlTransition && this.rawUrlTree &&
            this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
            this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
            Promise.resolve()
                .then((_) => this.runNavigate(url, rawUrl, false, false, id, createEmptyState(url, this.rootComponentType).snapshot))
                .then(resolve, reject);
        }
        else {
            this.rawUrlTree = rawUrl;
            resolve(null);
        }
    }
    /**
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} shouldPreventPushState
     * @param {?} shouldReplaceUrl
     * @param {?} id
     * @param {?} precreatedState
     * @return {?}
     */
    runNavigate(url, rawUrl, shouldPreventPushState, shouldReplaceUrl, id, precreatedState) {
        if (id !== this.navigationId) {
            this.location.go(this.urlSerializer.serialize(this.currentUrlTree));
            this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url), `Navigation ID ${id} is not equal to the current navigation id ${this.navigationId}`));
            return Promise.resolve(false);
        }
        return new Promise((resolvePromise, rejectPromise) => {
            // create an observable of the url and route state snapshot
            // this operation do not result in any side effects
            let /** @type {?} */ urlAndSnapshot$;
            if (!precreatedState) {
                const /** @type {?} */ moduleInjector = this.ngModule.injector;
                const /** @type {?} */ redirectsApplied$ = applyRedirects(moduleInjector, this.configLoader, this.urlSerializer, url, this.config);
                urlAndSnapshot$ = mergeMap.call(redirectsApplied$, (appliedUrl) => {
                    return map.call(recognize(this.rootComponentType, this.config, appliedUrl, this.serializeUrl(appliedUrl)), (snapshot) => {
                        this.routerEvents.next(new RoutesRecognized(id, this.serializeUrl(url), this.serializeUrl(appliedUrl), snapshot));
                        return { appliedUrl, snapshot };
                    });
                });
            }
            else {
                urlAndSnapshot$ = of({ appliedUrl: url, snapshot: precreatedState });
            }
            const /** @type {?} */ beforePreactivationDone$ = mergeMap.call(urlAndSnapshot$, (p) => {
                return map.call(this.hooks.beforePreactivation(p.snapshot), () => p);
            });
            // run preactivation: guards and data resolvers
            let /** @type {?} */ preActivation;
            const /** @type {?} */ preactivationSetup$ = map.call(beforePreactivationDone$, ({ appliedUrl, snapshot }) => {
                const /** @type {?} */ moduleInjector = this.ngModule.injector;
                preActivation = new PreActivation(snapshot, this.currentRouterState.snapshot, moduleInjector, (evt) => this.triggerEvent(evt));
                preActivation.initalize(this.rootContexts);
                return { appliedUrl, snapshot };
            });
            const /** @type {?} */ preactivationCheckGuards$ = mergeMap.call(preactivationSetup$, ({ appliedUrl, snapshot }) => {
                if (this.navigationId !== id)
                    return of(false);
                this.triggerEvent(new GuardsCheckStart(id, this.serializeUrl(url), appliedUrl, snapshot));
                return map.call(preActivation.checkGuards(), (shouldActivate) => {
                    this.triggerEvent(new GuardsCheckEnd(id, this.serializeUrl(url), appliedUrl, snapshot, shouldActivate));
                    return { appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate };
                });
            });
            const /** @type {?} */ preactivationResolveData$ = mergeMap.call(preactivationCheckGuards$, (p) => {
                if (this.navigationId !== id)
                    return of(false);
                if (p.shouldActivate && preActivation.isActivating()) {
                    this.triggerEvent(new ResolveStart(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
                    return map.call(preActivation.resolveData(), () => {
                        this.triggerEvent(new ResolveEnd(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
                        return p;
                    });
                }
                else {
                    return of(p);
                }
            });
            const /** @type {?} */ preactivationDone$ = mergeMap.call(preactivationResolveData$, (p) => {
                return map.call(this.hooks.afterPreactivation(p.snapshot), () => p);
            });
            // create router state
            // this operation has side effects => route state is being affected
            const /** @type {?} */ routerState$ = map.call(preactivationDone$, ({ appliedUrl, snapshot, shouldActivate }) => {
                if (shouldActivate) {
                    const /** @type {?} */ state = createRouterState(this.routeReuseStrategy, snapshot, this.currentRouterState);
                    return { appliedUrl, state, shouldActivate };
                }
                else {
                    return { appliedUrl, state: null, shouldActivate };
                }
            });
            // applied the new router state
            // this operation has side effects
            let /** @type {?} */ navigationIsSuccessful;
            const /** @type {?} */ storedState = this.currentRouterState;
            const /** @type {?} */ storedUrl = this.currentUrlTree;
            routerState$
                .forEach(({ appliedUrl, state, shouldActivate }) => {
                if (!shouldActivate || id !== this.navigationId) {
                    navigationIsSuccessful = false;
                    return;
                }
                this.currentUrlTree = appliedUrl;
                this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);
                this.currentRouterState = state;
                if (!shouldPreventPushState) {
                    const /** @type {?} */ path = this.urlSerializer.serialize(this.rawUrlTree);
                    if (this.location.isCurrentPathEqualTo(path) || shouldReplaceUrl) {
                        this.location.replaceState(path);
                    }
                    else {
                        this.location.go(path);
                    }
                }
                new ActivateRoutes(this.routeReuseStrategy, state, storedState, (evt) => this.triggerEvent(evt))
                    .activate(this.rootContexts);
                navigationIsSuccessful = true;
            })
                .then(() => {
                if (navigationIsSuccessful) {
                    this.navigated = true;
                    this.routerEvents.next(new NavigationEnd(id, this.serializeUrl(url), this.serializeUrl(this.currentUrlTree)));
                    resolvePromise(true);
                }
                else {
                    this.resetUrlToCurrentUrlTree();
                    this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url), ''));
                    resolvePromise(false);
                }
            }, (e) => {
                if (isNavigationCancelingError(e)) {
                    this.resetUrlToCurrentUrlTree();
                    this.navigated = true;
                    this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url), e.message));
                    resolvePromise(false);
                }
                else {
                    this.routerEvents.next(new NavigationError(id, this.serializeUrl(url), e));
                    try {
                        resolvePromise(this.errorHandler(e));
                    }
                    catch (ee) {
                        rejectPromise(ee);
                    }
                }
                this.currentRouterState = storedState;
                this.currentUrlTree = storedUrl;
                this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);
                this.location.replaceState(this.serializeUrl(this.rawUrlTree));
            });
        });
    }
    /**
     * @return {?}
     */
    resetUrlToCurrentUrlTree() {
        const /** @type {?} */ path = this.urlSerializer.serialize(this.rawUrlTree);
        this.location.replaceState(path);
    }
}
function Router_tsickle_Closure_declarations() {
    /** @type {?} */
    Router.prototype.currentUrlTree;
    /** @type {?} */
    Router.prototype.rawUrlTree;
    /** @type {?} */
    Router.prototype.navigations;
    /** @type {?} */
    Router.prototype.routerEvents;
    /** @type {?} */
    Router.prototype.currentRouterState;
    /** @type {?} */
    Router.prototype.locationSubscription;
    /** @type {?} */
    Router.prototype.navigationId;
    /** @type {?} */
    Router.prototype.configLoader;
    /** @type {?} */
    Router.prototype.ngModule;
    /**
     * Error handler that is invoked when a navigation errors.
     *
     * See {\@link ErrorHandler} for more information.
     * @type {?}
     */
    Router.prototype.errorHandler;
    /**
     * Indicates if at least one navigation happened.
     * @type {?}
     */
    Router.prototype.navigated;
    /**
     * Used by RouterModule. This allows us to
     * pause the navigation either before preactivation or after it.
     * \@internal
     * @type {?}
     */
    Router.prototype.hooks;
    /**
     * Extracts and merges URLs. Used for AngularJS to Angular migrations.
     * @type {?}
     */
    Router.prototype.urlHandlingStrategy;
    /** @type {?} */
    Router.prototype.routeReuseStrategy;
    /** @type {?} */
    Router.prototype.rootComponentType;
    /** @type {?} */
    Router.prototype.urlSerializer;
    /** @type {?} */
    Router.prototype.rootContexts;
    /** @type {?} */
    Router.prototype.location;
    /** @type {?} */
    Router.prototype.config;
}
class ActivateRoutes {
    /**
     * @param {?} routeReuseStrategy
     * @param {?} futureState
     * @param {?} currState
     * @param {?} forwardEvent
     */
    constructor(routeReuseStrategy, futureState, currState, forwardEvent) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
        this.forwardEvent = forwardEvent;
    }
    /**
     * @param {?} parentContexts
     * @return {?}
     */
    activate(parentContexts) {
        const /** @type {?} */ futureRoot = this.futureState._root;
        const /** @type {?} */ currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentContexts);
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    deactivateChildRoutes(futureNode, currNode, contexts) {
        const /** @type {?} */ children = nodeChildrenAsMap(currNode);
        // Recurse on the routes active in the future state to de-activate deeper children
        futureNode.children.forEach(futureChild => {
            const /** @type {?} */ childOutletName = futureChild.value.outlet;
            this.deactivateRoutes(futureChild, children[childOutletName], contexts);
            delete children[childOutletName];
        });
        // De-activate the routes that will not be re-used
        forEach(children, (v, childName) => {
            this.deactivateRouteAndItsChildren(v, contexts);
        });
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContext
     * @return {?}
     */
    deactivateRoutes(futureNode, currNode, parentContext) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        if (future === curr) {
            // Reusing the node, check to see if the children need to be de-activated
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const /** @type {?} */ context = parentContext.getContext(future.outlet);
                if (context) {
                    this.deactivateChildRoutes(futureNode, currNode, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.deactivateChildRoutes(futureNode, currNode, parentContext);
            }
        }
        else {
            if (curr) {
                // Deactivate the current route which will not be re-used
                this.deactivateRouteAndItsChildren(currNode, parentContext);
            }
        }
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    deactivateRouteAndItsChildren(route, parentContexts) {
        if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
            this.detachAndStoreRouteSubtree(route, parentContexts);
        }
        else {
            this.deactivateRouteAndOutlet(route, parentContexts);
        }
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    detachAndStoreRouteSubtree(route, parentContexts) {
        const /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context && context.outlet) {
            const /** @type {?} */ componentRef = context.outlet.detach();
            const /** @type {?} */ contexts = context.children.onOutletDeactivated();
            this.routeReuseStrategy.store(route.value.snapshot, { componentRef, route, contexts });
        }
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    deactivateRouteAndOutlet(route, parentContexts) {
        const /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context) {
            const /** @type {?} */ children = nodeChildrenAsMap(route);
            const /** @type {?} */ contexts = route.value.component ? context.children : parentContexts;
            forEach(children, (v, k) => this.deactivateRouteAndItsChildren(v, contexts));
            if (context.outlet) {
                // Destroy the component
                context.outlet.deactivate();
                // Destroy the contexts for all the outlets that were in the component
                context.children.onOutletDeactivated();
            }
        }
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    activateChildRoutes(futureNode, currNode, contexts) {
        const /** @type {?} */ children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(c => { this.activateRoutes(c, children[c.value.outlet], contexts); });
        if (futureNode.children.length && futureNode.value.routeConfig) {
            this.forwardEvent(new ChildActivationEnd(futureNode.value.routeConfig));
        }
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @return {?}
     */
    activateRoutes(futureNode, currNode, parentContexts) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        advanceActivatedRoute(future);
        // reusing the node
        if (future === curr) {
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
                this.activateChildRoutes(futureNode, currNode, context.children);
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, currNode, parentContexts);
            }
        }
        else {
            if (future.component) {
                // if we have a normal route, we need to place the component into the outlet and recurse.
                const /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
                if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
                    const /** @type {?} */ stored = ((this.routeReuseStrategy.retrieve(future.snapshot)));
                    this.routeReuseStrategy.store(future.snapshot, null);
                    context.children.onOutletReAttached(stored.contexts);
                    context.attachRef = stored.componentRef;
                    context.route = stored.route.value;
                    if (context.outlet) {
                        // Attach right away when the outlet has already been instantiated
                        // Otherwise attach from `RouterOutlet.ngOnInit` when it is instantiated
                        context.outlet.attach(stored.componentRef, stored.route.value);
                    }
                    advanceActivatedRouteNodeAndItsChildren(stored.route);
                }
                else {
                    const /** @type {?} */ config = parentLoadedConfig(future.snapshot);
                    const /** @type {?} */ cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;
                    context.route = future;
                    context.resolver = cmpFactoryResolver;
                    if (context.outlet) {
                        // Activate the outlet when it has already been instantiated
                        // Otherwise it will get activated from its `ngOnInit` when instantiated
                        context.outlet.activateWith(future, cmpFactoryResolver);
                    }
                    this.activateChildRoutes(futureNode, null, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, null, parentContexts);
            }
        }
    }
}
function ActivateRoutes_tsickle_Closure_declarations() {
    /** @type {?} */
    ActivateRoutes.prototype.routeReuseStrategy;
    /** @type {?} */
    ActivateRoutes.prototype.futureState;
    /** @type {?} */
    ActivateRoutes.prototype.currState;
    /** @type {?} */
    ActivateRoutes.prototype.forwardEvent;
}
/**
 * @param {?} node
 * @return {?}
 */
function advanceActivatedRouteNodeAndItsChildren(node) {
    advanceActivatedRoute(node.value);
    node.children.forEach(advanceActivatedRouteNodeAndItsChildren);
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function parentLoadedConfig(snapshot) {
    for (let /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        const /** @type {?} */ route = s._routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
        if (route && route.component)
            return null;
    }
    return null;
}
/**
 * @param {?} commands
 * @return {?}
 */
function validateCommands(commands) {
    for (let /** @type {?} */ i = 0; i < commands.length; i++) {
        const /** @type {?} */ cmd = commands[i];
        if (cmd == null) {
            throw new Error(`The requested path contains ${cmd} segment at index ${i}`);
        }
    }
}
//# sourceMappingURL=router.js.map