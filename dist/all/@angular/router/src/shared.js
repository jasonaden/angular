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
 * @whatItDoes Name of the primary outlet.
 *
 * @stable
 */
exports.PRIMARY_OUTLET = 'primary';
var ParamsAsMap = (function () {
    function ParamsAsMap(params) {
        this.params = params || {};
    }
    ParamsAsMap.prototype.has = function (name) { return this.params.hasOwnProperty(name); };
    ParamsAsMap.prototype.get = function (name) {
        if (this.has(name)) {
            var v = this.params[name];
            return Array.isArray(v) ? v[0] : v;
        }
        return null;
    };
    ParamsAsMap.prototype.getAll = function (name) {
        if (this.has(name)) {
            var v = this.params[name];
            return Array.isArray(v) ? v : [v];
        }
        return [];
    };
    Object.defineProperty(ParamsAsMap.prototype, "keys", {
        get: function () { return Object.keys(this.params); },
        enumerable: true,
        configurable: true
    });
    return ParamsAsMap;
}());
/**
 * Convert a {@link Params} instance to a {@link ParamMap}.
 *
 * @stable
 */
function convertToParamMap(params) {
    return new ParamsAsMap(params);
}
exports.convertToParamMap = convertToParamMap;
var NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
function navigationCancelingError(message) {
    var error = Error('NavigationCancelingError: ' + message);
    error[NAVIGATION_CANCELING_ERROR] = true;
    return error;
}
exports.navigationCancelingError = navigationCancelingError;
function isNavigationCancelingError(error) {
    return error[NAVIGATION_CANCELING_ERROR];
}
exports.isNavigationCancelingError = isNavigationCancelingError;
// Matches the route configuration (`route`) against the actual URL (`segments`).
function defaultUrlMatcher(segments, segmentGroup, route) {
    var parts = route.path.split('/');
    if (parts.length > segments.length) {
        // The actual URL is shorter than the config, no match
        return null;
    }
    if (route.pathMatch === 'full' &&
        (segmentGroup.hasChildren() || parts.length < segments.length)) {
        // The config is longer than the actual URL but we are looking for a full match, return null
        return null;
    }
    var posParams = {};
    // Check each config part against the actual URL
    for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        var segment = segments[index];
        var isParameter = part.startsWith(':');
        if (isParameter) {
            posParams[part.substring(1)] = segment;
        }
        else if (part !== segment.path) {
            // The actual URL part does not match the config, no match
            return null;
        }
    }
    return { consumed: segments.slice(0, parts.length), posParams: posParams };
}
exports.defaultUrlMatcher = defaultUrlMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFNSDs7OztHQUlHO0FBQ1UsUUFBQSxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBMkN4QztJQUdFLHFCQUFZLE1BQWM7UUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFBQyxDQUFDO0lBRTNELHlCQUFHLEdBQUgsVUFBSSxJQUFZLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RSx5QkFBRyxHQUFILFVBQUksSUFBWTtRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw0QkFBTSxHQUFOLFVBQU8sSUFBWTtRQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxNQUFNLENBQUMs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