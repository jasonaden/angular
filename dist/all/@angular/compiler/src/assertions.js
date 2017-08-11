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
function assertArrayOfStrings(identifier, value) {
    if (!core_1.isDevMode() || value == null) {
        return;
    }
    if (!Array.isArray(value)) {
        throw new Error("Expected '" + identifier + "' to be an array of strings.");
    }
    for (var i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
            throw new Error("Expected '" + identifier + "' to be an array of strings.");
        }
    }
}
exports.assertArrayOfStrings = assertArrayOfStrings;
var INTERPOLATION_BLACKLIST_REGEXPS = [
    /^\s*$/,
    /[<>]/,
    /^[{}]$/,
    /&(#|[a-z])/i,
    /^\/\//,
];
function assertInterpolationSymbols(identifier, value) {
    if (value != null && !(Array.isArray(value) && value.length == 2)) {
        throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
    }
    else if (core_1.isDevMode() && value != null) {
        var start_1 = value[0];
        var end_1 = value[1];
        // black list checking
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(function (regexp) {
            if (regexp.test(start_1) || regexp.test(end_1)) {
                throw new Error("['" + start_1 + "', '" + end_1 + "'] contains unusable interpolation symbol.");
            }
        });
    }
}
exports.assertInterpolationSymbols = assertInterpolationSymbols;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hc3NlcnRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXdDO0FBR3hDLDhCQUFxQyxVQUFrQixFQUFFLEtBQVU7SUFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBUyxFQUFFLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFhLFVBQVUsaUNBQThCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBYSxVQUFVLGlDQUE4QixDQUFDLENBQUM7UUFDekUsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBWkQsb0RBWUM7QUFFRCxJQUFNLCtCQUErQixHQUFHO0lBQ3RDLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLGFBQWE7SUFDYixPQUFPO0NBQ1IsQ0FBQztBQUVGLG9DQUEyQyxVQUFrQixFQUFFLEtBQVU7SUFDdkUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWEsVUFBVSxvQ0FBaUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsRUFBRSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQU0sT0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQVcsQ0FBQztRQUNqQyxJQUFNLEtBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFXLENBQUM7UUFDL0Isc0JBQXNCO1FBQ3RCLCtCQUErQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFLLE9BQUssWUFBTyxLQUFHLCtDQUE0QyxDQUFDLENBQUM7WUFDcEYsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFiRCxnRUFhQyJ9