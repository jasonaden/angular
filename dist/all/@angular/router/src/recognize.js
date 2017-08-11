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
var Observable_1 = require("rxjs/Observable");
var of_1 = require("rxjs/observable/of");
var router_state_1 = require("./router_state");
var shared_1 = require("./shared");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
var tree_1 = require("./utils/tree");
var NoMatch = (function () {
    function NoMatch() {
    }
    return NoMatch;
}());
function recognize(rootComponentType, config, urlTree, url) {
    return new Recognizer(rootComponentType, config, urlTree, url).recognize();
}
exports.recognize = recognize;
var Recognizer = (function () {
    function Recognizer(rootComponentType, config, urlTree, url) {
        this.rootComponentType = rootComponentType;
        this.config = config;
        this.urlTree = urlTree;
        this.url = url;
    }
    Recognizer.prototype.recognize = function () {
        try {
            var rootSegmentGroup = split(this.urlTree.root, [], [], this.config).segmentGroup;
            var children = this.processSegmentGroup(this.config, rootSegmentGroup, shared_1.PRIMARY_OUTLET);
            var root = new router_state_1.ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, {}, shared_1.PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
            var rootNode = new tree_1.TreeNode(root, children);
            var routeState = new router_state_1.RouterStateSnapshot(this.url, rootNode);
            this.inheritParamsAndData(routeState._root);
            return of_1.of(routeState);
        }
        catch (e) {
            return new Observable_1.Observable(function (obs) { return obs.error(e); });
        }
    };
    Recognizer.prototype.inheritParamsAndData = function (routeNode) {
        var _this = this;
        var route = routeNode.value;
        var i = router_state_1.inheritedParamsDataResolve(route);
        route.params = Object.freeze(i.params);
        route.data = Object.freeze(i.data);
        routeNode.children.forEach(function (n) { return _this.inheritParamsAndData(n); });
    };
    Recognizer.prototype.processSegmentGroup = function (config, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return this.processChildren(config, segmentGroup);
        }
        return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
    };
    Recognizer.prototype.processChildren = function (config, segmentGroup) {
        var _this = this;
        var children = url_tree_1.mapChildrenIntoArray(segmentGroup, function (child, childOutlet) { return _this.processSegmentGroup(config, child, childOutlet); });
        checkOutletNameUniqueness(children);
        sortActivatedRouteSnapshots(children);
        return children;
    };
    Recognizer.prototype.processSegment = function (config, segmentGroup, segments, outlet) {
        for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
            var r = config_1[_i];
            try {
                return this.processSegmentAgainstRoute(r, segmentGroup, segments, outlet);
            }
            catch (e) {
                if (!(e instanceof NoMatch))
                    throw e;
            }
        }
        if (this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
            return [];
        }
        throw new NoMatch();
    };
    Recognizer.prototype.noLeftoversInUrl = function (segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    };
    Recognizer.prototype.processSegmentAgainstRoute = function (route, rawSegment, segments, outlet) {
        if (route.redirectTo)
            throw new NoMatch();
        if ((route.outlet || shared_1.PRIMARY_OUTLET) !== outlet)
            throw new NoMatch();
        if (route.path === '**') {
            var params = segments.length > 0 ? collection_1.last(segments).parameters : {};
            var snapshot_1 = new router_state_1.ActivatedRouteSnapshot(segments, params, Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, getData(route), outlet, route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
            return [new tree_1.TreeNode(snapshot_1, [])];
        }
        var _a = match(rawSegment, route, segments), consumedSegments = _a.consumedSegments, parameters = _a.parameters, lastChild = _a.lastChild;
        var rawSlicedSegments = segments.slice(lastChild);
        var childConfig = getChildConfig(route);
        var _b = split(rawSegment, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _b.segmentGroup, slicedSegments = _b.slicedSegments;
        var snapshot = new router_state_1.ActivatedRouteSnapshot(consumedSegments, parameters, Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, getData(route), outlet, route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
            var children_1 = this.processChildren(childConfig, segmentGroup);
            return [new tree_1.TreeNode(snapshot, children_1)];
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
            return [new tree_1.TreeNode(snapshot, [])];
        }
        var children = this.processSegment(childConfig, segmentGroup, slicedSegments, shared_1.PRIMARY_OUTLET);
        return [new tree_1.TreeNode(snapshot, children)];
    };
    return Recognizer;
}());
function sortActivatedRouteSnapshots(nodes) {
    nodes.sort(function (a, b) {
        if (a.value.outlet === shared_1.PRIMARY_OUTLET)
            return -1;
        if (b.value.outlet === shared_1.PRIMARY_OUTLET)
            return 1;
        return a.value.outlet.localeCompare(b.value.outlet);
    });
}
function getChildConfig(route) {
    if (route.children) {
        return route.children;
    }
    if (route.loadChildren) {
        return route._loadedConfig.routes;
    }
    return [];
}
function match(segmentGroup, route, segments) {
    if (route.path === '') {
        if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || segments.length > 0)) {
            throw new NoMatch();
        }
        return { consumedSegments: [], lastChild: 0, parameters: {} };
    }
    var matcher = route.matcher || shared_1.defaultUrlMatcher;
    var res = matcher(segments, segmentGroup, route);
    if (!res)
        throw new NoMatch();
    var posParams = {};
    collection_1.forEach(res.posParams, function (v, k) { posParams[k] = v.path; });
    var parameters = res.consumed.length > 0 ? __assign({}, posParams, res.consumed[res.consumed.length - 1].parameters) :
        posParams;
    return { consumedSegments: res.consumed, lastChild: res.consumed.length, parameters: parameters };
}
function checkOutletNameUniqueness(nodes) {
    var names = {};
    nodes.forEach(function (n) {
        var routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
            var p = routeWithSameOutletName.url.map(function (s) { return s.toString(); }).join('/');
            var c = n.value.url.map(function (s) { return s.toString(); }).join('/');
            throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
        }
        names[n.value.outlet] = n.value;
    });
}
function getSourceSegmentGroup(segmentGroup) {
    var s = segmentGroup;
    while (s._sourceSegment) {
        s = s._sourceSegment;
    }
    return s;
}
function getPathIndexShift(segmentGroup) {
    var s = segmentGroup;
    var res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
    while (s._sourceSegment) {
        s = s._sourceSegment;
        res += (s._segmentIndexShift ? s._segmentIndexShift : 0);
    }
    return res - 1;
}
function split(segmentGroup, consumedSegments, slicedSegments, config) {
    if (slicedSegments.length > 0 &&
        containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var s_1 = new url_tree_1.UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config, new url_tree_1.UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        s_1._sourceSegment = segmentGroup;
        s_1._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s_1, slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
        var s_2 = new url_tree_1.UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        s_2._sourceSegment = segmentGroup;
        s_2._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s_2, slicedSegments: slicedSegments };
    }
    var s = new url_tree_1.UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
    s._sourceSegment = segmentGroup;
    s._segmentIndexShift = consumedSegments.length;
    return { segmentGroup: s, slicedSegments: slicedSegments };
}
function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    var res = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
            var s = new url_tree_1.UrlSegmentGroup([], {});
            s._sourceSegment = segmentGroup;
            s._segmentIndexShift = segmentGroup.segments.length;
            res[getOutlet(r)] = s;
        }
    }
    return __assign({}, children, res);
}
function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes, primarySegment) {
    var res = {};
    res[shared_1.PRIMARY_OUTLET] = primarySegment;
    primarySegment._sourceSegment = segmentGroup;
    primarySegment._segmentIndexShift = consumedSegments.length;
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet(r) !== shared_1.PRIMARY_OUTLET) {
            var s = new url_tree_1.UrlSegmentGroup([], {});
            s._sourceSegment = segmentGroup;
            s._segmentIndexShift = consumedSegments.length;
            res[getOutlet(r)] = s;
        }
    }
    return res;
}
function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes) {
    return routes.some(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet(r) !== shared_1.PRIMARY_OUTLET; });
}
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
    return routes.some(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r); });
}
function emptyPathMatch(segmentGroup, slicedSegments, r) {
    if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === 'full') {
        return false;
    }
    return r.path === '' && r.redirectTo === undefined;
}
function getOutlet(route) {
    return route.outlet || shared_1.PRIMARY_OUTLET;
}
function getData(route) {
    return route.data || {};
}
function getResolve(route) {
    return route.resolve || {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9yZWNvZ25pemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUdILDhDQUEyQztBQUUzQyx5Q0FBdUM7QUFHdkMsK0NBQXVHO0FBQ3ZHLG1DQUEyRDtBQUMzRCx1Q0FBc0Y7QUFDdEYsaURBQWlEO0FBQ2pELHFDQUFzQztBQUV0QztJQUFBO0lBQWUsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBQWhCLElBQWdCO0FBRWhCLG1CQUNJLGlCQUFrQyxFQUFFLE1BQWMsRUFBRSxPQUFnQixFQUNwRSxHQUFXO0lBQ2IsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDN0UsQ0FBQztBQUpELDhCQUlDO0FBRUQ7SUFDRSxvQkFDWSxpQkFBaUMsRUFBVSxNQUFjLEVBQVUsT0FBZ0IsRUFDbkYsR0FBVztRQURYLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNuRixRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUcsQ0FBQztJQUUzQiw4QkFBUyxHQUFUO1FBQ0UsSUFBSSxDQUFDO1lBQ0gsSUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBRXBGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLHVCQUFjLENBQUMsQ0FBQztZQUV6RixJQUFNLElBQUksR0FB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