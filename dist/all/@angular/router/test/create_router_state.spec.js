"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var create_router_state_1 = require("../src/create_router_state");
var recognize_1 = require("../src/recognize");
var route_reuse_strategy_1 = require("../src/route_reuse_strategy");
var router_state_1 = require("../src/router_state");
var shared_1 = require("../src/shared");
var url_tree_1 = require("../src/url_tree");
describe('create router state', function () {
    var reuseStrategy = new route_reuse_strategy_1.DefaultRouteReuseStrategy();
    var emptyState = function () {
        return router_state_1.createEmptyState(new url_tree_1.UrlTree(new url_tree_1.UrlSegmentGroup([], {}), {}, null), RootComponent);
    };
    it('should work create new state', function () {
        var state = create_router_state_1.createRouterState(reuseStrategy, createState([
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], 'a(left:b//right:c)'), emptyState());
        checkActivatedRoute(state.root, RootComponent);
        var c = state.children(state.root);
        checkActivatedRoute(c[0], ComponentA);
        checkActivatedRoute(c[1], ComponentB, 'left');
        checkActivatedRoute(c[2], ComponentC, 'right');
    });
    it('should reuse existing nodes when it can', function () {
        var config = [
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'left' }
        ];
        var prevState = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:b)'), emptyState());
        advanceState(prevState);
        var state = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a(left:c)'), prevState);
        expect(prevState.root).toBe(state.root);
        var prevC = prevState.children(prevState.root);
        var currC = state.children(state.root);
        expect(prevC[0]).toBe(currC[0]);
        expect(prevC[1]).not.toBe(currC[1]);
        checkActivatedRoute(currC[1], ComponentC, 'left');
    });
    it('should handle componentless routes', function () {
        var config = [{
                path: 'a/:id',
                children: [
                    { path: 'b', component: ComponentA }, { path: 'c', component: ComponentB, outlet: 'right' }
                ]
            }];
        var prevState = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a/1;p=11/(b//right:c)'), emptyState());
        advanceState(prevState);
        var state = create_router_state_1.createRouterState(reuseStrategy, createState(config, 'a/2;p=22/(b//right:c)'), prevState);
        expect(prevState.root).toBe(state.root);
        var prevP = prevState.firstChild(prevState.root);
        var currP = state.firstChild(state.root);
        expect(prevP).toBe(currP);
        var currC = state.children(currP);
        expect(currP._futureSnapshot.params).toEqual({ id: '2', p: '22' });
        expect(currP._futureSnapshot.paramMap.get('id')).toEqual('2');
        expect(currP._futureSnapshot.paramMap.get('p')).toEqual('22');
        checkActivatedRoute(currC[0], ComponentA);
        checkActivatedRoute(currC[1], ComponentB, 'right');
    });
});
function advanceState(state) {
    advanceNode(state._root);
}
function advanceNode(node) {
    router_state_1.advanceActivatedRoute(node.value);
    node.children.forEach(advanceNode);
}
function createState(config, url) {
    var res = undefined;
    recognize_1.recognize(RootComponent, config, tree(url), url).forEach(function (s) { return res = s; });
    return res;
}
function checkActivatedRoute(actual, cmp, outlet) {
    if (outlet === void 0) { outlet = shared_1.PRIMARY_OUTLET; }
    if (actual === null) {
        expect(actual).toBeDefined();
    }
    else {
        expect(actual.component).toBe(cmp);
        expect(actual.outlet).toEqual(outlet);
    }
}
function tree(url) {
    return new url_tree_1.DefaultUrlSerializer().parse(url);
}
var RootComponent = (function () {
    function RootComponent() {
    }
    return RootComponent;
}());
var ComponentA = (function () {
    function ComponentA() {
    }
    return ComponentA;
}());
var ComponentB = (function () {
    function ComponentB() {
    }
    return ComponentB;
}());
var ComponentC = (function () {
    function ComponentC() {
    }
    return ComponentC;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3JvdXRlcl9zdGF0ZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3QvY3JlYXRlX3JvdXRlcl9zdGF0ZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsa0VBQTZEO0FBQzdELDhDQUEyQztBQUMzQyxvRUFBc0U7QUFDdEUsb0RBQThIO0FBQzlILHdDQUE2QztBQUM3Qyw0Q0FBK0U7QUFHL0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLElBQU0sYUFBYSxHQUFHLElBQUksZ0RBQXlCLEVBQUUsQ0FBQztJQUV0RCxJQUFNLFVBQVUsR0FBRztRQUNmLE9BQUEsK0JBQWdCLENBQUMsSUFBSSxrQkFBTyxDQUFDLElBQUksMEJBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQU0sQ0FBQyxFQUFFLGFBQWEsQ0FBQztJQUFyRixDQUFxRixDQUFDO0lBRTFGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUNqQyxJQUFNLEtBQUssR0FBRyx1Q0FBaUIsQ0FDM0IsYUFBYSxFQUFFLFdBQVcsQ0FDUDtZQUNFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDO1lBQ2xDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUM7WUFDbEQsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQztTQUNwRCxFQUNELG9CQUFvQixDQUFDLEVBQ3hDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFbEIsbUJBQW1CLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUUvQyxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFD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