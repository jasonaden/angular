"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @whatItDoes Provides a way to customize when activated routes get reused.
 *
 * @experimental
 */
var RouteReuseStrategy = (function () {
    function RouteReuseStrategy() {
    }
    return RouteReuseStrategy;
}());
exports.RouteReuseStrategy = RouteReuseStrategy;
/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
var DefaultRouteReuseStrategy = (function () {
    function DefaultRouteReuseStrategy() {
    }
    DefaultRouteReuseStrategy.prototype.shouldDetach = function (route) { return false; };
    DefaultRouteReuseStrategy.prototype.store = function (route, detachedTree) { };
    DefaultRouteReuseStrategy.prototype.shouldAttach = function (route) { return false; };
    DefaultRouteReuseStrategy.prototype.retrieve = function (route) { return null; };
    DefaultRouteReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
        return future.routeConfig === curr.routeConfig;
    };
    return DefaultRouteReuseStrategy;
}());
exports.DefaultRouteReuseStrategy = DefaultRouteReuseStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfcmV1c2Vfc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3JvdXRlX3JldXNlX3N0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBeUJIOzs7O0dBSUc7QUFDSDtJQUFBO0lBbUJBLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFuQnFCLGdEQUFrQjtBQXFCeEM7O0dBRUc7QUFDSDtJQUFBO0lBUUEsQ0FBQztJQVBDLGdEQUFZLEdBQVosVUFBYSxLQUE2QixJQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLHlDQUFLLEdBQUwsVUFBTSxLQUE2QixFQUFFLFlBQWlDLElBQVMsQ0FBQztJQUNoRixnREFBWSxHQUFaLFVBQWEsS0FBNkIsSUFBYSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0RSw0Q0FBUSxHQUFSLFVBQVMsS0FBNkIsSUFBOEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEYsb0RBQWdCLEdBQWhCLFVBQWlCLE1BQThCLEVBQUUsSUFBNEI7UUFDM0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNqRCxDQUFDO0lBQ0gsZ0NBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDhEQUF5QiJ9