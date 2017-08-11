"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_TYPE = 'ngType';
exports.ERROR_COMPONENT_TYPE = 'ngComponentType';
exports.ERROR_DEBUG_CONTEXT = 'ngDebugContext';
exports.ERROR_ORIGINAL_ERROR = 'ngOriginalError';
exports.ERROR_LOGGER = 'ngErrorLogger';
function getType(error) {
    return error[exports.ERROR_TYPE];
}
exports.getType = getType;
function getDebugContext(error) {
    return error[exports.ERROR_DEBUG_CONTEXT];
}
exports.getDebugContext = getDebugContext;
function getOriginalError(error) {
    return error[exports.ERROR_ORIGINAL_ERROR];
}
exports.getOriginalError = getOriginalError;
function getErrorLogger(error) {
    return error[exports.ERROR_LOGGER] || defaultErrorLogger;
}
exports.getErrorLogger = getErrorLogger;
function defaultErrorLogger(console) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    console.error.apply(console, values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSVUsUUFBQSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3RCLFFBQUEsb0JBQW9CLEdBQUcsaUJBQWlCLENBQUM7QUFDekMsUUFBQSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQztBQUN2QyxRQUFBLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDO0FBQ3pDLFFBQUEsWUFBWSxHQUFHLGVBQWUsQ0FBQztBQUc1QyxpQkFBd0IsS0FBWTtJQUNsQyxNQUFNLENBQUUsS0FBYSxDQUFDLGtCQUFVLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRkQsMEJBRUM7QUFFRCx5QkFBZ0MsS0FBWTtJQUMxQyxNQUFNLENBQUUsS0FBYSxDQUFDLDJCQUFtQixDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELDBDQUVDO0FBRUQsMEJBQWlDLEtBQVk7SUFDM0MsTUFBTSxDQUFFLEtBQWEsQ0FBQyw0QkFBb0IsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixLQUFZO0lBQ3pDLE1BQU0sQ0FBRSxLQUFhLENBQUMsb0JBQVksQ0FBQyxJQUFJLGtCQUFrQixDQUFDO0FBQzVELENBQUM7QUFGRCx3Q0FFQztBQUdELDRCQUE0QixPQUFnQjtJQUFFLGdCQUFnQjtTQUFoQixVQUFnQixFQUFoQixxQkFBZ0IsRUFBaEIsSUFBZ0I7UUFBaEIsK0JBQWdCOztJQUN0RCxPQUFPLENBQUMsS0FBSyxPQUFiLE9BQU8sRUFBVyxNQUFNLEVBQUU7QUFDbEMsQ0FBQyJ9