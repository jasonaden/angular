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
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var from_1 = require("rxjs/observable/from");
var of_1 = require("rxjs/observable/of");
var catch_1 = require("rxjs/operator/catch");
var concatAll_1 = require("rxjs/operator/concatAll");
var first_1 = require("rxjs/operator/first");
var map_1 = require("rxjs/operator/map");
var mergeMap_1 = require("rxjs/operator/mergeMap");
var EmptyError_1 = require("rxjs/util/EmptyError");
var config_1 = require("./config");
var shared_1 = require("./shared");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
var NoMatch = (function () {
    function NoMatch(segmentGroup) {
        this.segmentGroup = segmentGroup || null;
    }
    return NoMatch;
}());
var AbsoluteRedirect = (function () {
    function AbsoluteRedirect(urlTree) {
        this.urlTree = urlTree;
    }
    return AbsoluteRedirect;
}());
function noMatch(segmentGroup) {
    return new Observable_1.Observable(function (obs) { return obs.error(new NoMatch(segmentGroup)); });
}
function absoluteRedirect(newTree) {
    return new Observable_1.Observable(function (obs) { return obs.error(new AbsoluteRedirect(newTree)); });
}
function namedOutletsRedirect(redirectTo) {
    return new Observable_1.Observable(function (obs) { return obs.error(new Error("Only absolute redirects can have named outlets. redirectTo: '" + redirectTo + "'")); });
}
function canLoadFails(route) {
    return new Observable_1.Observable(function (obs) { return obs.error(shared_1.navigationCancelingError("Cannot load children because the guard of the route \"path: '" + route.path + "'\" returned false")); });
}
/**
 * Returns the `UrlTree` with the redirection applied.
 *
 * Lazy modules are loaded along the way.
 */
function applyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
    return new ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config).apply();
}
exports.applyRedirects = applyRedirects;
var ApplyRedirects = (function () {
    function ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
        this.configLoader = configLoader;
        this.urlSerializer = urlSerializer;
        this.urlTree = urlTree;
        this.config = config;
        this.allowRedirects = true;
        this.ngModule = moduleInjector.get(core_1.NgModuleRef);
    }
    ApplyRedirects.prototype.apply = function () {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, shared_1.PRIMARY_OUTLET);
        var urlTrees$ = map_1.map.call(expanded$, function (rootSegmentGroup) { return _this.createUrlTree(rootSegmentGroup, _this.urlTree.queryParams, _this.urlTree.fragment); });
        return catch_1._catch.call(urlTrees$, function (e) {
            if (e instanceof AbsoluteRedirect) {
                // after an absolute redirect we do not apply any more redirects!
                _this.allowRedirects = false;
                // we need to run matching, so we can fetch all lazy-loaded modules
                return _this.match(e.urlTree);
            }
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        });
    };
    ApplyRedirects.prototype.match = function (tree) {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, tree.root, shared_1.PRIMARY_OUTLET);
        var mapped$ = map_1.map.call(expanded$, function (rootSegmentGroup) {
            return _this.createUrlTree(rootSegmentGroup, tree.queryParams, tree.fragment);
        });
        return catch_1._catch.call(mapped$, function (e) {
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        });
    };
    ApplyRedirects.prototype.noMatchError = function (e) {
        return new Error("Cannot match any routes. URL Segment: '" + e.segmentGroup + "'");
    };
    ApplyRedirects.prototype.createUrlTree = function (rootCandidate, queryParams, fragment) {
        var root = rootCandidate.segments.length > 0 ?
            new url_tree_1.UrlSegmentGroup([], (_a = {}, _a[shared_1.PRIMARY_OUTLET] = rootCandidate, _a)) :
            rootCandidate;
        return new url_tree_1.UrlTree(root, queryParams, fragment);
        var _a;
    };
    ApplyRedirects.prototype.expandSegmentGroup = function (ngModule, routes, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return map_1.map.call(this.expandChildren(ngModule, routes, segmentGroup), function (children) { return new url_tree_1.UrlSegmentGroup([], children); });
        }
        return this.expandSegment(ngModule, segmentGroup, routes, segmentGroup.segments, outlet, true);
    };
    // Recursively expand segment groups for all the child outlets
    ApplyRedirects.prototype.expandChildren = function (ngModule, routes, segmentGroup) {
        var _this = this;
        return collection_1.waitForMap(segmentGroup.children, function (childOutlet, child) { return _this.expandSegmentGroup(ngModule, routes, child, childOutlet); });
    };
    ApplyRedirects.prototype.expandSegment = function (ngModule, segmentGroup, routes, segments, outlet, allowRedirects) {
        var _this = this;
        var routes$ = of_1.of.apply(void 0, routes);
        var processedRoutes$ = map_1.map.call(routes$, function (r) {
            var expanded$ = _this.expandSegmentAgainstRoute(ngModule, segmentGroup, routes, r, segments, outlet, allowRedirects);
            return catch_1._catch.call(expanded$, function (e) {
                if (e instanceof NoMatch) {
                    return of_1.of(null);
                }
                throw e;
            });
        });
        var concattedProcessedRoutes$ = concatAll_1.concatAll.call(processedRoutes$);
        var first$ = first_1.first.call(concattedProcessedRoutes$, function (s) { return !!s; });
        return catch_1._catch.call(first$, function (e, _) {
            if (e instanceof EmptyError_1.EmptyError) {
                if (_this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
                    return of_1.of(new url_tree_1.UrlSegmentGroup([], {}));
                }
                throw new NoMatch(segmentGroup);
            }
            throw e;
        });
    };
    ApplyRedirects.prototype.noLeftoversInUrl = function (segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    };
    ApplyRedirects.prototype.expandSegmentAgainstRoute = function (ngModule, segmentGroup, routes, route, paths, outlet, allowRedirects) {
        if (getOutlet(route) !== outlet) {
            return noMatch(segmentGroup);
        }
        if (route.redirectTo === undefined) {
            return this.matchSegmentAgainstRoute(ngModule, segmentGroup, route, paths);
        }
        if (allowRedirects && this.allowRedirects) {
            return this.expandSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, paths, outlet);
        }
        return noMatch(segmentGroup);
    };
    ApplyRedirects.prototype.expandSegmentAgainstRouteUsingRedirect = function (ngModule, segmentGroup, routes, route, segments, outlet) {
        if (route.path === '**') {
            return this.expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet);
        }
        return this.expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet);
    };
    ApplyRedirects.prototype.expandWildCardWithParamsAgainstRouteUsingRedirect = function (ngModule, routes, route, outlet) {
        var _this = this;
        var newTree = this.applyRedirectCommands([], route.redirectTo, {});
        if (route.redirectTo.startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap_1.mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
            var group = new url_tree_1.UrlSegmentGroup(newSegments, {});
            return _this.expandSegment(ngModule, group, routes, newSegments, outlet, false);
        });
    };
    ApplyRedirects.prototype.expandRegularSegmentAgainstRouteUsingRedirect = function (ngModule, segmentGroup, routes, route, segments, outlet) {
        var _this = this;
        var _a = match(segmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
        if (!matched)
            return noMatch(segmentGroup);
        var newTree = this.applyRedirectCommands(consumedSegments, route.redirectTo, positionalParamSegments);
        if (route.redirectTo.startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap_1.mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
            return _this.expandSegment(ngModule, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
        });
    };
    ApplyRedirects.prototype.matchSegmentAgainstRoute = function (ngModule, rawSegmentGroup, route, segments) {
        var _this = this;
        if (route.path === '**') {
            if (route.loadChildren) {
                return map_1.map.call(this.configLoader.load(ngModule.injector, route), function (cfg) {
                    route._loadedConfig = cfg;
                    return new url_tree_1.UrlSegmentGroup(segments, {});
                });
            }
            return of_1.of(new url_tree_1.UrlSegmentGroup(segments, {}));
        }
        var _a = match(rawSegmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild;
        if (!matched)
            return noMatch(rawSegmentGroup);
        var rawSlicedSegments = segments.slice(lastChild);
        var childConfig$ = this.getChildConfig(ngModule, route);
        return mergeMap_1.mergeMap.call(childConfig$, function (routerConfig) {
            var childModule = routerConfig.module;
            var childConfig = routerConfig.routes;
            var _a = split(rawSegmentGroup, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _a.segmentGroup, slicedSegments = _a.slicedSegments;
            if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
                var expanded$_1 = _this.expandChildren(childModule, childConfig, segmentGroup);
                return map_1.map.call(expanded$_1, function (children) { return new url_tree_1.UrlSegmentGroup(consumedSegments, children); });
            }
            if (childConfig.length === 0 && slicedSegments.length === 0) {
                return of_1.of(new url_tree_1.UrlSegmentGroup(consumedSegments, {}));
            }
            var expanded$ = _this.expandSegment(childModule, segmentGroup, childConfig, slicedSegments, shared_1.PRIMARY_OUTLET, true);
            return map_1.map.call(expanded$, function (cs) {
                return new url_tree_1.UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children);
            });
        });
    };
    ApplyRedirects.prototype.getChildConfig = function (ngModule, route) {
        var _this = this;
        if (route.children) {
            // The children belong to the same module
            return of_1.of(new config_1.LoadedRouterConfig(route.children, ngModule));
        }
        if (route.loadChildren) {
            // lazy children belong to the loaded module
            if (route._loadedConfig !== undefined) {
                return of_1.of(route._loadedConfig);
            }
            return mergeMap_1.mergeMap.call(runCanLoadGuard(ngModule.injector, route), function (shouldLoad) {
                if (shouldLoad) {
                    return map_1.map.call(_this.configLoader.load(ngModule.injector, route), function (cfg) {
                        route._loadedConfig = cfg;
                        return cfg;
                    });
                }
                return canLoadFails(route);
            });
        }
        return of_1.of(new config_1.LoadedRouterConfig([], ngModule));
    };
    ApplyRedirects.prototype.lineralizeSegments = function (route, urlTree) {
        var res = [];
        var c = urlTree.root;
        while (true) {
            res = res.concat(c.segments);
            if (c.numberOfChildren === 0) {
                return of_1.of(res);
            }
            if (c.numberOfChildren > 1 || !c.children[shared_1.PRIMARY_OUTLET]) {
                return namedOutletsRedirect(route.redirectTo);
            }
            c = c.children[shared_1.PRIMARY_OUTLET];
        }
    };
    ApplyRedirects.prototype.applyRedirectCommands = function (segments, redirectTo, posParams) {
        return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
    };
    ApplyRedirects.prototype.applyRedirectCreatreUrlTree = function (redirectTo, urlTree, segments, posParams) {
        var newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
        return new url_tree_1.UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
    };
    ApplyRedirects.prototype.createQueryParams = function (redirectToParams, actualParams) {
        var res = {};
        collection_1.forEach(redirectToParams, function (v, k) {
            var copySourceValue = typeof v === 'string' && v.startsWith(':');
            if (copySourceValue) {
                var sourceName = v.substring(1);
                res[k] = actualParams[sourceName];
            }
            else {
                res[k] = v;
            }
        });
        return res;
    };
    ApplyRedirects.prototype.createSegmentGroup = function (redirectTo, group, segments, posParams) {
        var _this = this;
        var updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
        var children = {};
        collection_1.forEach(group.children, function (child, name) {
            children[name] = _this.createSegmentGroup(redirectTo, child, segments, posParams);
        });
        return new url_tree_1.UrlSegmentGroup(updatedSegments, children);
    };
    ApplyRedirects.prototype.createSegments = function (redirectTo, redirectToSegments, actualSegments, posParams) {
        var _this = this;
        return redirectToSegments.map(function (s) { return s.path.startsWith(':') ? _this.findPosParam(redirectTo, s, posParams) :
            _this.findOrReturn(s, actualSegments); });
    };
    ApplyRedirects.prototype.findPosParam = function (redirectTo, redirectToUrlSegment, posParams) {
        var pos = posParams[redirectToUrlSegment.path.substring(1)];
        if (!pos)
            throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + redirectToUrlSegment.path + "'.");
        return pos;
    };
    ApplyRedirects.prototype.findOrReturn = function (redirectToUrlSegment, actualSegments) {
        var idx = 0;
        for (var _i = 0, actualSegments_1 = actualSegments; _i < actualSegments_1.length; _i++) {
            var s = actualSegments_1[_i];
            if (s.path === redirectToUrlSegment.path) {
                actualSegments.splice(idx);
                return s;
            }
            idx++;
        }
        return redirectToUrlSegment;
    };
    return ApplyRedirects;
}());
function runCanLoadGuard(moduleInjector, route) {
    var canLoad = route.canLoad;
    if (!canLoad || canLoad.length === 0)
        return of_1.of(true);
    var obs = map_1.map.call(from_1.from(canLoad), function (injectionToken) {
        var guard = moduleInjector.get(injectionToken);
        return collection_1.wrapIntoObservable(guard.canLoad ? guard.canLoad(route) : guard(route));
    });
    return collection_1.andObservables(obs);
}
function match(segmentGroup, route, segments) {
    if (route.path === '') {
        if ((route.pathMatch === 'full') && (segmentGroup.hasChildren() || segments.length > 0)) {
            return { matched: false, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
        }
        return { matched: true, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
    }
    var matcher = route.matcher || shared_1.defaultUrlMatcher;
    var res = matcher(segments, segmentGroup, route);
    if (!res) {
        return {
            matched: false,
            consumedSegments: [],
            lastChild: 0,
            positionalParamSegments: {},
        };
    }
    return {
        matched: true,
        consumedSegments: res.consumed,
        lastChild: res.consumed.length,
        positionalParamSegments: res.posParams,
    };
}
function split(segmentGroup, consumedSegments, slicedSegments, config) {
    if (slicedSegments.length > 0 &&
        containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var s = new url_tree_1.UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new url_tree_1.UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
        var s = new url_tree_1.UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: slicedSegments };
    }
    return { segmentGroup: segmentGroup, slicedSegments: slicedSegments };
}
function mergeTrivialChildren(s) {
    if (s.numberOfChildren === 1 && s.children[shared_1.PRIMARY_OUTLET]) {
        var c = s.children[shared_1.PRIMARY_OUTLET];
        return new url_tree_1.UrlSegmentGroup(s.segments.concat(c.segments), c.children);
    }
    return s;
}
function addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    var res = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (isEmptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
            res[getOutlet(r)] = new url_tree_1.UrlSegmentGroup([], {});
        }
    }
    return __assign({}, children, res);
}
function createChildrenForEmptySegments(routes, primarySegmentGroup) {
    var res = {};
    res[shared_1.PRIMARY_OUTLET] = primarySegmentGroup;
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet(r) !== shared_1.PRIMARY_OUTLET) {
            res[getOutlet(r)] = new url_tree_1.UrlSegmentGroup([], {});
        }
    }
    return res;
}
function containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r) && getOutlet(r) !== shared_1.PRIMARY_OUTLET; });
}
function containsEmptyPathRedirects(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r); });
}
function isEmptyPathRedirect(segmentGroup, segments, r) {
    if ((segmentGroup.hasChildren() || segments.length > 0) && r.pathMatch === 'full') {
        return false;
    }
    return r.path === '' && r.redirectTo !== undefined;
}
function getOutlet(route) {
    return route.outlet || shared_1.PRIMARY_OUTLET;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9hcHBseV9yZWRpcmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILHNDQUFvRDtBQUNwRCw4Q0FBMkM7QUFFM0MsNkNBQTBDO0FBQzFDLHlDQUF1QztBQUN2Qyw2Q0FBMkM7QUFDM0MscURBQWtEO0FBQ2xELDZDQUEwQztBQUMxQyx5Q0FBc0M7QUFDdEMsbURBQWdEO0FBQ2hELG1EQUFnRDtBQUVoRCxtQ0FBMkQ7QUFFM0QsbUNBQTZGO0FBQzdGLHVDQUErRTtBQUMvRSxpREFBMkY7QUFFM0Y7SUFHRSxpQkFBWSxZQUE4QjtRQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQztJQUFDLENBQUM7SUFDM0YsY0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7SUFDRSwwQkFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFDekMsdUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVELGlCQUFpQixZQUE2QjtJQUM1QyxNQUFNLENBQUMsSUFBSSx1QkFBVSxDQUNqQixVQUFDLEdBQThCLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQsMEJBQTBCLE9BQWdCO0lBQ3hDLE1BQU0sQ0FBQyxJQUFJLHVCQUFVLENBQ2pCLFVBQUMsR0FBOEIsSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUVELDhCQUE4QixVQUFrQjtJQUM5QyxNQUFNLENBQUMsSUFBSSx1QkFBVSxDQUNqQixVQUFDLEdBQThCLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUNuRCxrRUFBZ0UsVUFBVSxNQUFHLENBQUMsQ0FBQyxFQUQvQyxDQUMrQyxDQUFDLENBQUM7QUFDM0YsQ0FBQztBQUVELHNCQUFzQixLQUFZO0lBQ2hDLE1BQU0sQ0FBQyxJQUFJLHVCQUFVLENBQ2pCLFVBQUMsR0FBaUMsSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUNBQXdCLENBQ3JFLGtFQUErRCxLQUFLLENBQUMsSUFBSSx1QkFBbUIsQ0FBQyxDQUFDLEVBRDNELENBQzJELENBQUMsQ0FBQztBQUMxRyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILHdCQUNJLGNBQXdCLEVBQUUsWUFBZ0MsRUFBRSxhQUE0QixFQUN4RixPQUFnQixFQUFFLE1BQWM7SUFDbEMsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNsRyxDQUFDO0FBSkQsd0NBSUM7QUFFRDtJQUlFLHdCQUNJLGNBQXdCLEVBQVUsWUFBZ0MsRUFDMUQsYUFBNEIsRUFBVSxPQUFnQixFQUFVLE1BQWM7UUFEcEQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQzFELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFMbEYsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFNckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGtCQUFXLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsOEJBQUssR0FBTDtRQUFBLGlCQW9CQztRQW5CQyxJQUFNLFNBQVMsR0FDWCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLHVCQUFjLENBQUMsQ0FBQztRQUMzRixJQUFNLFNBQVMsR0FBRyxTQUFHLENBQUMsSUFBSSxDQUN0QixTQUFTLEVBQUUsVUFBQyxnQkFBaUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxhQUFhLENBQ3JELGdCQUFnQixFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBVSxDQUFDLEVBRGpDLENBQ2lDLENBQUMsQ0FBQztRQUN6RixNQUFNLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFNO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLGlFQUFpRTtnQkFDakUsS0FBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLG1FQUFtRTtnQkFDbkUsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLDhCQUFLLEdBQWIsVUFBYyxJQUFhO1FBQTNCLGlCQWFDO1FBWkMsSUFBTSxTQUFTLEdBQ1gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLHVCQUFjLENBQUMsQ0FBQztRQUNuRixJQUFNLE9BQU8sR0FBRyxTQUFHLENBQUMsSUFBSSxDQUNwQixTQUFTLEVBQUUsVUFBQyxnQkFBaUM7WUFDOUIsT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVUsQ0FBQztRQUF2RSxDQUF1RSxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBTTtZQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHFDQUFZLEdBQXBCLFVBQXFCLENBQVU7UUFDN0IsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDRDQUEwQyxDQUFDLENBQUMsWUFBWSxNQUFHLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRU8sc0NBQWEsR0FBckIsVUFBc0IsYUFBOEIsRUFBRSxXQUFtQixFQUFFLFFBQWdCO1FBRXpGLElBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDMUMsSUFBSSwwQkFBZSxDQUFDLEVBQUUsWUFBRyxHQUFDLHVCQUFjLElBQUcsYUFBYSxNQUFFO1lBQzFELGFBQWEsQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxrQkFBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7O0lBQ2xELENBQUM7SUFFTywyQ0FBa0IsR0FBMUIsVUFDSSxRQUEwQixFQUFFLE1BQWUsRUFBRSxZQUE2QixFQUMxRSxNQUFjO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxTQUFHLENBQUMsSUFBSSxDQUNYLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFDbkQsVUFBQyxRQUFhLElBQUssT0FBQSxJQUFJLDBCQUFlLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFRCw4REFBOEQ7SUFDdEQsdUNBQWMsR0FBdEIsVUFDSSxRQUEwQixFQUFFLE1BQWUsRUFDM0MsWUFBNkI7UUFGakMsaUJBTUM7UUFIQyxNQUFNLENBQUMsdUJBQVUsQ0FDYixZQUFZLENBQUMsUUFBUSxFQUNyQixVQUFDLFdBQVcsRUFBRSxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQTdELENBQTZELENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRU8sc0NBQWEsR0FBckIsVUFDSSxRQUEwQixFQUFFLFlBQTZCLEVBQUUsTUFBZSxFQUMxRSxRQUFzQixFQUFFLE1BQWMsRUFDdEMsY0FBdUI7UUFIM0IsaUJBNkJDO1FBekJDLElBQU0sT0FBTyxHQUFHLE9BQUUsZUFBSyxNQUFNLENBQUMsQ0FBQztRQUMvQixJQUFNLGdCQUFnQixHQUFHLFNBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBTTtZQUNoRCxJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMseUJBQXlCLENBQzVDLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxjQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQU07Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN6QixNQUFNLENBQUMsT0FBRSxDQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuQixDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQU0seUJBQXlCLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRSxJQUFNLE1BQU0sR0FBRyxhQUFLLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQyxDQUFNLEVBQUUsQ0FBTTtZQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksdUJBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxDQUFDLE9BQUUsQ0FBRSxJQUFJLDBCQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7Z0JBRUQsTUFBTSxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBRUQsTUFBTSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyx5Q0FBZ0IsR0FBeEIsVUFBeUIsWUFBNkIsRUFBRSxRQUFzQixFQUFFLE1BQWM7UUFFNUYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU8sa0RBQXlCLEdBQWpDLFVBQ0ksUUFBMEIsRUFBRSxZQUE2QixFQUFFLE1BQWUsRUFBRSxLQUFZLEVBQ3hGLEtBQW1CLEVBQUUsTUFBYyxFQUFFLGNBQXVCO1FBQzlELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FDOUMsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8sK0RBQXNDLEdBQTlDLFVBQ0ksUUFBMEIsRUFBRSxZQUE2QixFQUFFLE1BQWUsRUFBRSxLQUFZLEVBQ3hGLFFBQXNCLEVBQUUsTUFBYztRQUN4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FDekQsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQ3JELFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLDBFQUFpRCxHQUF6RCxVQUNJLFFBQTBCLEVBQUUsTUFBZSxFQUFFLEtBQVksRUFDekQsTUFBYztRQUZsQixpQkFZQztRQVRDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFVBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxNQUFNLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFDLFdBQXlCO1lBQ3RGLElBQU0sS0FBSyxHQUFHLElBQUksMEJBQWUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxzRUFBNkMsR0FBckQsVUFDSSxRQUEwQixFQUFFLFlBQTZCLEVBQUUsTUFBZSxFQUFFLEtBQVksRUFDeEYsUUFBc0IsRUFBRSxNQUFjO1FBRjFDLGlCQWtCQztRQWZPLElBQUEseUNBQ2tDLEVBRGpDLG9CQUFPLEVBQUUsc0NBQWdCLEVBQUUsd0JBQVMsRUFBRSxvREFBdUIsQ0FDM0I7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDdEMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLFVBQVksRUFBTyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELE1BQU0sQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFLFVBQUMsV0FBeUI7WUFDdEYsTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQ3JCLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFDckYsS0FBSyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxpREFBd0IsR0FBaEMsVUFDSSxRQUEwQixFQUFFLGVBQWdDLEVBQUUsS0FBWSxFQUMxRSxRQUFzQjtRQUYxQixpQkE0Q0M7UUF6Q0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLENBQUMsU0FBRyxDQUFDLElBQUksQ0FDWCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLFVBQUMsR0FBdUI7b0JBQ3hFLEtBQUssQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO29CQUMxQixNQUFNLENBQUMsSUFBSSwwQkFBZSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQUUsQ0FBRSxJQUFJLDBCQUFlLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVLLElBQUEsNENBQWdGLEVBQS9FLG9CQUFPLEVBQUUsc0NBQWdCLEVBQUUsd0JBQVMsQ0FBNEM7UUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTlDLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUxRCxNQUFNLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsWUFBZ0M7WUFDbEUsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBRWxDLElBQUEsNkVBQ3NFLEVBRHJFLDhCQUFZLEVBQUUsa0NBQWMsQ0FDMEM7WUFFN0UsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxXQUFTLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLENBQUMsU0FBRyxDQUFDLElBQUksQ0FDWCxXQUFTLEVBQUUsVUFBQyxRQUFhLElBQUssT0FBQSxJQUFJLDBCQUFlLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLEVBQS9DLENBQStDLENBQUMsQ0FBQztZQUNyRixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsT0FBRSxDQUFFLElBQUksMEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFFRCxJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUNoQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsdUJBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRixNQUFNLENBQUMsU0FBRyxDQUFDLElBQUksQ0FDWCxTQUFTLEVBQUUsVUFBQyxFQUFtQjtnQkFDaEIsT0FBQSxJQUFJLDBCQUFlLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQXRFLENBQXNFLENBQUMsQ0FBQztRQUM3RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyx1Q0FBYyxHQUF0QixVQUF1QixRQUEwQixFQUFFLEtBQVk7UUFBL0QsaUJBMkJDO1FBMUJDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25CLHlDQUF5QztZQUN6QyxNQUFNLENBQUMsT0FBRSxDQUFFLElBQUksMkJBQWtCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2Qiw0Q0FBNEM7WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsT0FBRSxDQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBRUQsTUFBTSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLFVBQUMsVUFBbUI7Z0JBRWxGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLFNBQUcsQ0FBQyxJQUFJLENBQ1gsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxVQUFDLEdBQXVCO3dCQUN4RSxLQUFLLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQzt3QkFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQztvQkFDYixDQUFDLENBQUMsQ0FBQztnQkFDVCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQUUsQ0FBRSxJQUFJLDJCQUFrQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTywyQ0FBa0IsR0FBMUIsVUFBMkIsS0FBWSxFQUFFLE9BQWdCO1FBQ3ZELElBQUksR0FBRyxHQUFpQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNyQixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ1osR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsT0FBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFVBQVksQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFFRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFFTyw4Q0FBcUIsR0FBN0IsVUFDSSxRQUFzQixFQUFFLFVBQWtCLEVBQUUsU0FBb0M7UUFDbEYsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FDbkMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRU8sb0RBQTJCLEdBQW5DLFVBQ0ksVUFBa0IsRUFBRSxPQUFnQixFQUFFLFFBQXNCLEVBQzVELFNBQW9DO1FBQ3RDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkYsTUFBTSxDQUFDLElBQUksa0JBQU8sQ0FDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDOUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTywwQ0FBaUIsR0FBekIsVUFBMEIsZ0JBQXdCLEVBQUUsWUFBb0I7UUFDdEUsSUFBTSxHQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLG9CQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxDQUFNLEVBQUUsQ0FBUztZQUMxQyxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTywyQ0FBa0IsR0FBMUIsVUFDSSxVQUFrQixFQUFFLEtBQXNCLEVBQUUsUUFBc0IsRUFDbEUsU0FBb0M7UUFGeEMsaUJBV0M7UUFSQyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU3RixJQUFJLFFBQVEsR0FBbUMsRUFBRSxDQUFDO1FBQ2xELG9CQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQXNCLEVBQUUsSUFBWTtZQUMzRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksMEJBQWUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLHVDQUFjLEdBQXRCLFVBQ0ksVUFBa0IsRUFBRSxrQkFBZ0MsRUFBRSxjQUE0QixFQUNsRixTQUFvQztRQUZ4QyxpQkFNQztRQUhDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQ3pCLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQztZQUMzQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsRUFEN0QsQ0FDNkQsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTyxxQ0FBWSxHQUFwQixVQUNJLFVBQWtCLEVBQUUsb0JBQWdDLEVBQ3BELFNBQW9DO1FBQ3RDLElBQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDUCxNQUFNLElBQUksS0FBSyxDQUNYLHlCQUF1QixVQUFVLHdCQUFtQixvQkFBb0IsQ0FBQyxJQUFJLE9BQUksQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU8scUNBQVksR0FBcEIsVUFBcUIsb0JBQWdDLEVBQUUsY0FBNEI7UUFDakYsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osR0FBRyxDQUFDLENBQVksVUFBYyxFQUFkLGlDQUFjLEVBQWQsNEJBQWMsRUFBZCxJQUFjO1lBQXpCLElBQU0sQ0FBQyx1QkFBQTtZQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUM7WUFDRCxHQUFHLEVBQUUsQ0FBQztTQUNQO1FBQ0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQzlCLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUF4VkQsSUF3VkM7QUFFRCx5QkFBeUIsY0FBd0IsRUFBRSxLQUFZO0lBQzdELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsT0FBRSxDQUFFLElBQUksQ0FBQyxDQUFDO0lBRXZELElBQU0sR0FBRyxHQUFHLFNBQUcsQ0FBQyxJQUFJLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQUMsY0FBbUI7UUFDdEQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsK0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLDJCQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVELGVBQWUsWUFBNkIsRUFBRSxLQUFZLEVBQUUsUUFBc0I7SUFNaEYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQzNGLENBQUM7UUFFRCxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLDBCQUFpQixDQUFDO0lBQ25ELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5ELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNULE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsZ0JBQWdCLEVBQVMsRUFBRTtZQUMzQixTQUFTLEVBQUUsQ0FBQztZQUNaLHVCQUF1QixFQUFFLEVBQUU7U0FDNUIsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUM7UUFDTCxPQUFPLEVBQUUsSUFBSTtRQUNiLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxRQUFVO1FBQ2hDLFNBQVMsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQVE7UUFDaEMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLFNBQVc7S0FDekMsQ0FBQztBQUNKLENBQUM7QUFFRCxlQUNJLFlBQTZCLEVBQUUsZ0JBQThCLEVBQUUsY0FBNEIsRUFDM0YsTUFBZTtJQUNqQixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDekIsMENBQTBDLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBTSxDQUFDLEdBQUcsSUFBSSwwQkFBZSxDQUN6QixnQkFBZ0IsRUFBRSw4QkFBOEIsQ0FDMUIsTUFBTSxFQUFFLElBQUksMEJBQWUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRixNQUFNLENBQUMsRUFBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDM0IsMEJBQTBCLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBTSxDQUFDLEdBQUcsSUFBSSwwQkFBZSxDQUN6QixZQUFZLENBQUMsUUFBUSxFQUFFLGtDQUFrQyxDQUM5QixZQUFZLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3RixNQUFNLENBQUMsRUFBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxnQkFBQSxFQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFDLFlBQVksY0FBQSxFQUFFLGNBQWMsZ0JBQUEsRUFBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCw4QkFBOEIsQ0FBa0I7SUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksMEJBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELDRDQUNJLFlBQTZCLEVBQUUsY0FBNEIsRUFBRSxNQUFlLEVBQzVFLFFBQTJDO0lBQzdDLElBQU0sR0FBRyxHQUFzQyxFQUFFLENBQUM7SUFDbEQsR0FBRyxDQUFDLENBQVksVUFBTSxFQUFOLGlCQUFNLEVBQU4sb0JBQU0sRUFBTixJQUFNO1FBQWpCLElBQU0sQ0FBQyxlQUFBO1FBQ1YsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEYsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksMEJBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUNGO0lBQ0QsTUFBTSxjQUFLLFFBQVEsRUFBSyxHQUFHLEVBQUU7QUFDL0IsQ0FBQztBQUVELHdDQUNJLE1BQWUsRUFBRSxtQkFBb0M7SUFDdkQsSUFBTSxHQUFHLEdBQXNDLEVBQUUsQ0FBQztJQUNsRCxHQUFHLENBQUMsdUJBQWMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0lBQzFDLEdBQUcsQ0FBQyxDQUFZLFVBQU0sRUFBTixpQkFBTSxFQUFOLG9CQUFNLEVBQU4sSUFBTTtRQUFqQixJQUFNLENBQUMsZUFBQTtRQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyx1QkFBYyxDQUFDLENBQUMsQ0FBQztZQUNyRCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSwwQkFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQ0Y7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELG9EQUNJLFlBQTZCLEVBQUUsUUFBc0IsRUFBRSxNQUFlO0lBQ3hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNkLFVBQUEsQ0FBQyxJQUFJLE9BQUEsbUJBQW1CLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssdUJBQWMsRUFBakYsQ0FBaUYsQ0FBQyxDQUFDO0FBQzlGLENBQUM7QUFFRCxvQ0FDSSxZQUE2QixFQUFFLFFBQXNCLEVBQUUsTUFBZTtJQUN4RSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLG1CQUFtQixDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRUQsNkJBQ0ksWUFBNkIsRUFBRSxRQUFzQixFQUFFLENBQVE7SUFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEYsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7QUFDckQsQ0FBQztBQUVELG1CQUFtQixLQUFZO0lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLHVCQUFjLENBQUM7QUFDeEMsQ0FBQyJ9