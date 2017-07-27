
import {Location} from '@angular/common';
import {Compiler, Injector, NgModuleFactoryLoader, NgModuleRef, Type, isDevMode} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {from as from$} from 'rxjs/observable/from';
import {of as of$} from 'rxjs/observable/of';
import {concatMap as concatMap$} from 'rxjs/operator/concatMap';
import {every as every$} from 'rxjs/operator/every';
import {first as first$} from 'rxjs/operator/first';
import {last as last$} from 'rxjs/operator/last';
import {map as map$} from 'rxjs/operator/map';
import {mergeMap as mergeMap$} from 'rxjs/operator/mergeMap';
import {reduce as reduce$} from 'rxjs/operator/reduce';

import {applyRedirects} from './apply_redirects';
import {LoadedRouterConfig, QueryParamsHandling, ResolveData, Route, Routes, RunGuardsAndResolvers, validateConfig} from './config';
import {createRouterState} from './create_router_state';
import {createUrlTree} from './create_url_tree';
import {Event, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized} from './events';
import {recognize} from './recognize';
import {DefaultRouteReuseStrategy, DetachedRouteHandleInternal, RouteReuseStrategy} from './route_reuse_strategy';
import {RouterConfigLoader} from './router_config_loader';
import {ChildrenOutletContexts, OutletContext} from './router_outlet_context';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot, advanceActivatedRoute, createEmptyState, equalParamsAndUrlSegments, inheritedParamsDataResolve} from './router_state';
import { Params, isNavigationCancelingError } from './shared';
import {DefaultUrlHandlingStrategy, UrlHandlingStrategy} from './url_handling_strategy';
import {UrlSerializer, UrlTree, containsTree, createEmptyUrlTree} from './url_tree';
import {map, compose, andObservables, forEach, shallowEqual, waitForMap, wrapIntoObservable} from './utils/collection';
import { TreeNode, nodeChildrenAsMap } from './utils/tree';
import { Resolve, Resolver } from './interfaces';

class CanActivate {
  constructor(public path: ActivatedRouteSnapshot[]) {}
  get route(): ActivatedRouteSnapshot { return this.path[this.path.length - 1]; }
}

class CanDeactivate {
  constructor(public component: Object|null, public route: ActivatedRouteSnapshot) {}
}

/**
 * This class bundles the actions involved in preactivation of a route.
 */
export class PreActivation {
  private canActivateChecks: CanActivate[] = [];
  private canDeactivateChecks: CanDeactivate[] = [];
  private getInjector = getInjector(this.moduleInjector);
  
  constructor(
      private future: RouterStateSnapshot, private curr: RouterStateSnapshot,
      private moduleInjector: Injector) {}

  initalize(parentContexts: ChildrenOutletContexts): void {
    const futureRoot = this.future._root;
    const currRoot = this.curr ? this.curr._root : null;
    this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
  }

  checkGuards(): Observable<boolean> {
    if (!this.isDeactivating() && !this.isActivating()) {
      return of$ (true);
    }
    const canDeactivate$ = this.runCanDeactivateChecks();
    return mergeMap$.call(
        canDeactivate$,
        (canDeactivate: boolean) => canDeactivate ? this.runCanActivateChecks() : of$ (false));
  }

  resolveData(): Observable<any> {
    if (!this.isActivating()) return of$ (null);
    const checks$ = from$(this.canActivateChecks);
    const runningChecks$ =
        concatMap$.call(checks$, (check: CanActivate) => this.runResolve(check.route));
    return reduce$.call(runningChecks$, (_: any, __: any) => _);
  }

  isDeactivating(): boolean { return this.canDeactivateChecks.length !== 0; }

  isActivating(): boolean { return this.canActivateChecks.length !== 0; }


  /**
   * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
   * proper state to run `checkGuards()` method.
   */
  private setupChildRouteGuards(
      futureNode: TreeNode<ActivatedRouteSnapshot>, currNode: TreeNode<ActivatedRouteSnapshot>|null,
      contexts: ChildrenOutletContexts|null, futurePath: ActivatedRouteSnapshot[]): void {
    const prevChildren = nodeChildrenAsMap(currNode);

    // Process the children of the future route
    futureNode.children.forEach(c => {
      this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
      delete prevChildren[c.value.outlet];
    });

    // Process any children left from the current route (not active for the future route)
    forEach(
        prevChildren, (v: TreeNode<ActivatedRouteSnapshot>, k: string) =>
                          this.deactivateRouteAndItsChildren(v, contexts !.getContext(k)));
  }

  /**
   * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
   * proper state to run `checkGuards()` method.
   */
  private setupRouteGuards(
      futureNode: TreeNode<ActivatedRouteSnapshot>, currNode: TreeNode<ActivatedRouteSnapshot>,
      parentContexts: ChildrenOutletContexts|null, futurePath: ActivatedRouteSnapshot[]): void {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;
    const context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;

    // reusing the node
    if (curr && future._routeConfig === curr._routeConfig) {
      const shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(
          curr, future, future._routeConfig !.runGuardsAndResolvers);
      if (shouldRunGuardsAndResolvers) {
        this.canActivateChecks.push(new CanActivate(futurePath));
      } else {
        // we need to set the data
        future.data = curr.data;
        future._resolvedData = curr._resolvedData;
      }

      // If we have a component, we need to go through an outlet.
      if (future.component) {
        this.setupChildRouteGuards(
            futureNode, currNode, context ? context.children : null, futurePath);

        // if we have a componentless route, we recurse but keep the same outlet map.
      } else {
        this.setupChildRouteGuards(futureNode, currNode, parentContexts, futurePath);
      }

      if (shouldRunGuardsAndResolvers) {
        const outlet = context !.outlet !;
        this.canDeactivateChecks.push(new CanDeactivate(outlet.component, curr));
      }
    } else {
      if (curr) {
        this.deactivateRouteAndItsChildren(currNode, context);
      }

      this.canActivateChecks.push(new CanActivate(futurePath));
      // If we have a component, we need to go through an outlet.
      if (future.component) {
        this.setupChildRouteGuards(futureNode, null, context ? context.children : null, futurePath);

        // if we have a componentless route, we recurse but keep the same outlet map.
      } else {
        this.setupChildRouteGuards(futureNode, null, parentContexts, futurePath);
      }
    }
  }

  private shouldRunGuardsAndResolvers(
      curr: ActivatedRouteSnapshot, future: ActivatedRouteSnapshot,
      mode: RunGuardsAndResolvers|undefined): boolean {
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

  private deactivateRouteAndItsChildren(
      route: TreeNode<ActivatedRouteSnapshot>, context: OutletContext|null): void {
    const children = nodeChildrenAsMap(route);
    const r = route.value;

    forEach(children, (node: TreeNode<ActivatedRouteSnapshot>, childName: string) => {
      if (!r.component) {
        this.deactivateRouteAndItsChildren(node, context);
      } else if (context) {
        this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
      } else {
        this.deactivateRouteAndItsChildren(node, null);
      }
    });

    if (!r.component) {
      this.canDeactivateChecks.push(new CanDeactivate(null, r));
    } else if (context && context.outlet && context.outlet.isActivated) {
      this.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
    } else {
      this.canDeactivateChecks.push(new CanDeactivate(null, r));
    }
  }

  private runCanDeactivateChecks(): Observable<boolean> {
    const checks$ = from$(this.canDeactivateChecks);
    const runningChecks$ = mergeMap$.call(
        checks$, (check: CanDeactivate) => this.runCanDeactivate(check.component, check.route));
    return every$.call(runningChecks$, (result: boolean) => result === true);
  }

  private runCanActivateChecks(): Observable<boolean> {
    const checks$ = from$(this.canActivateChecks);
    const runningChecks$ = mergeMap$.call(
        checks$, (check: CanActivate) => andObservables(from$(
                     [this.runCanActivateChild(check.path), this.runCanActivate(check.route)])));
    return every$.call(runningChecks$, (result: boolean) => result === true);
  }

  private runCanActivate(future: ActivatedRouteSnapshot): Observable<boolean> {
    const canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
    if (!canActivate || canActivate.length === 0) return of$ (true);
    const obs = map$.call(from$(canActivate), (c: any) => {
      const guard = this.getInjector(future).get(c);
      let observable: Observable<boolean>;
      if (guard.canActivate) {
        observable = wrapIntoObservable(guard.canActivate(future, this.future));
      } else {
        observable = wrapIntoObservable(guard(future, this.future));
      }
      return first$.call(observable);
    });
    return andObservables(obs);
  }

  private runCanActivateChild(path: ActivatedRouteSnapshot[]): Observable<boolean> {
    const future = path[path.length - 1];

    const canActivateChildGuards = path.slice(0, path.length - 1)
                                       .reverse()
                                       .map(p => this.extractCanActivateChild(p))
                                       .filter(_ => _ !== null);

    return andObservables(map$.call(from$(canActivateChildGuards), (d: any) => {
      const obs = map$.call(from$(d.guards), (c: any) => {
        const guard = this.getInjector(d.node).get(c);
        let observable: Observable<boolean>;
        if (guard.canActivateChild) {
          observable = wrapIntoObservable(guard.canActivateChild(future, this.future));
        } else {
          observable = wrapIntoObservable(guard(future, this.future));
        }
        return first$.call(observable);
      });
      return andObservables(obs);
    }));
  }

  private extractCanActivateChild(p: ActivatedRouteSnapshot):
      {node: ActivatedRouteSnapshot, guards: any[]}|null {
    const canActivateChild = p._routeConfig ? p._routeConfig.canActivateChild : null;
    if (!canActivateChild || canActivateChild.length === 0) return null;
    return {node: p, guards: canActivateChild};
  }

  private runCanDeactivate(component: Object|null, curr: ActivatedRouteSnapshot):
      Observable<boolean> {
    const canDeactivate = curr && curr._routeConfig ? curr._routeConfig.canDeactivate : null;
    if (!canDeactivate || canDeactivate.length === 0) return of$ (true);
    const canDeactivate$ = mergeMap$.call(from$(canDeactivate), (c: any) => {
      const guard = this.getInjector(curr).get(c);
      let observable: Observable<boolean>;
      if (guard.canDeactivate) {
        observable =
            wrapIntoObservable(guard.canDeactivate(component, curr, this.curr, this.future));
      } else {
        observable = wrapIntoObservable(guard(component, curr, this.curr, this.future));
      }
      return first$.call(observable);
    });
    return every$.call(canDeactivate$, (result: any) => result === true);
  }

  private runResolve(future: ActivatedRouteSnapshot): Observable<any> {
    const resolve = future._resolve;
    return map$.call(resolveNode(resolve, this.getInjector(future), future, this.future), (resolvedData: any): any => {
      future._resolvedData = resolvedData;
      future.data = {...future.data, ...inheritedParamsDataResolve(future).resolve};
      return null;
    });
  }

}

function closestLoadedConfig(snapshot: ActivatedRouteSnapshot): LoadedRouterConfig|null {
  if (!snapshot) return null;

  for (let s = snapshot.parent; s; s = s.parent) {
    const route = s._routeConfig;
    if (route && route._loadedConfig) return route._loadedConfig;
  }

  return null;
}

/**
 * Returns a function that will get the injector from a module or return the default injector.
 */
function getInjector(defaultInjector: Injector): (snapshot: ActivatedRouteSnapshot) => Injector {
  return (snapshot: ActivatedRouteSnapshot) => {
    const config = closestLoadedConfig(snapshot);
    return config ? config.module.injector : defaultInjector;
  }
}

/**
 * Returns a resolver Observable (converted from Promise, Observable, or Boolean) representing 
 * running a resolver.
 */
function getResolver<T>(resolver: Resolver<T> | Resolve<T>, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  resolver = typeof resolver === 'function' ? {resolve: resolver} : resolver;
  return wrapIntoObservable(resolver.resolve(route, state));
}

function resolveNode(resolveTokens: ResolveData, injector: Injector, futureRoute: ActivatedRouteSnapshot, currState: RouterStateSnapshot): Observable<any> {
  const keys = Object.keys(resolveTokens);
  if (keys.length === 0) {
    return of$({});
  }
  const data: {[k: string]: any} = {};

  const runningResolvers2$ = compose(
    map((token: string) => injector.get(token) as Resolver<any>),
    map((resolver: Resolver<any>) => getResolver(resolver, futureRoute, currState))
  )

  const runningResolvers$ = mergeMap$.call(from$(keys), (key: string) => {
    return map$.call(
      getResolver(injector.get(resolveTokens[key]), futureRoute, currState),
      (value: any) => {
        data[key] = value;
        return value;
      });
  });
  return map$.call(last$.call(runningResolvers$), () => data);
}