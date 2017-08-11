"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return '-' + m[1].toLowerCase();
    });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
/**
 * Exports the value under a given `name` in the global property `ng`. For example `ng.probe` if
 * `name` is `'probe'`.
 * @param name Name under which it will be exported. Keep in mind this will be a property of the
 * global `ng` object.
 * @param value The value to export.
 */
function exportNgVar(name, value) {
    if (!ng) {
        core_1.ɵglobal['ng'] = ng = core_1.ɵglobal['ng'] || {};
    }
    ng[name] = value;
}
exports.exportNgVar = exportNgVar;
var ng;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQWdEO0FBRWhELElBQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBR3JDLDZCQUFvQyxLQUFhO0lBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQUMsV0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCxzQkFBYzs7UUFBSyxPQUFBLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO0lBQXhCLENBQXdCLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRkQsa0RBRUM7QUFFRCw2QkFBb0MsS0FBYTtJQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUFDLFdBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsc0JBQWM7O1FBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO0lBQWxCLENBQWtCLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBRkQsa0RBRUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxxQkFBNEIsSUFBWSxFQUFFLEtBQVU7SUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1IsY0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBSSxjQUFNLENBQUMsSUFBSSxDQUFxQyxJQUFJLEVBQUUsQ0FBQztJQUM5RSxDQUFDO0lBQ0QsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNuQixDQUFDO0FBTEQsa0NBS0M7QUFFRCxJQUFJLEVBQWtDLENBQUMifQ==