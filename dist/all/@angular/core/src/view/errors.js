"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
function expressionChangedAfterItHasBeenCheckedError(context, oldValue, currValue, isFirstCheck) {
    var msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
    if (isFirstCheck) {
        msg +=
            " It seems like the view has been created after its parent and its children have been dirty checked." +
                " Has it been created in a change detection hook ?";
    }
    return viewDebugError(msg, context);
}
exports.expressionChangedAfterItHasBeenCheckedError = expressionChangedAfterItHasBeenCheckedError;
function viewWrappedDebugError(err, context) {
    if (!(err instanceof Error)) {
        // errors that are not Error instances don't have a stack,
        // so it is ok to wrap them into a new Error object...
        err = new Error(err.toString());
    }
    _addDebugContext(err, context);
    return err;
}
exports.viewWrappedDebugError = viewWrappedDebugError;
function viewDebugError(msg, context) {
    var err = new Error(msg);
    _addDebugContext(err, context);
    return err;
}
exports.viewDebugError = viewDebugError;
function _addDebugContext(err, context) {
    err[errors_1.ERROR_DEBUG_CONTEXT] = context;
    err[errors_1.ERROR_LOGGER] = context.logError.bind(context);
}
function isViewDebugError(err) {
    return !!errors_1.getDebugContext(err);
}
exports.isViewDebugError = isViewDebugError;
function viewDestroyedError(action) {
    return new Error("ViewDestroyedError: Attempt to use a destroyed view: " + action);
}
exports.viewDestroyedError = viewDestroyedError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdmlldy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxvQ0FBNkU7QUFHN0UscURBQ0ksT0FBcUIsRUFBRSxRQUFhLEVBQUUsU0FBYyxFQUFFLFlBQXFCO0lBQzdFLElBQUksR0FBRyxHQUNILGdIQUE4RyxRQUFRLDJCQUFzQixTQUFTLE9BQUksQ0FBQztJQUM5SixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLEdBQUc7WUFDQyxxR0FBcUc7Z0JBQ3JHLG1EQUFtRCxDQUFDO0lBQzFELENBQUM7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBVkQsa0dBVUM7QUFFRCwrQkFBc0MsR0FBUSxFQUFFLE9BQXFCO0lBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLDBEQUEwRDtRQUMxRCxzREFBc0Q7UUFDdEQsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFSRCxzREFRQztBQUVELHdCQUErQixHQUFXLEVBQUUsT0FBcUI7SUFDL0QsSUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBSkQsd0NBSUM7QUFFRCwwQkFBMEIsR0FBVSxFQUFFLE9BQXFCO0lBQ3hELEdBQVcsQ0FBQyw0QkFBbUIsQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUMzQyxHQUFXLENBQUMscUJBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCwwQkFBaUMsR0FBVTtJQUN6QyxNQUFNLENBQUMsQ0FBQyxDQUFDLHdCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELDRDQUVDO0FBRUQsNEJBQW1DLE1BQWM7SUFDL0MsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDBEQUF3RCxNQUFRLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBRkQsZ0RBRUMifQ==