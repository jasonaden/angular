"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var trace;
var events;
function detectWTF() {
    var wtf = util_1.global /** TODO #9100 */['wtf'];
    if (wtf) {
        trace = wtf['trace'];
        if (trace) {
            events = trace['events'];
            return true;
        }
    }
    return false;
}
exports.detectWTF = detectWTF;
function createScope(signature, flags) {
    if (flags === void 0) { flags = null; }
    return events.createScope(signature, flags);
}
exports.createScope = createScope;
function leave(scope, returnValue) {
    trace.leaveScope(scope, returnValue);
    return returnValue;
}
exports.leave = leave;
function startTimeRange(rangeType, action) {
    return trace.beginTimeRange(rangeType, action);
}
exports.startTimeRange = startTimeRange;
function endTimeRange(range) {
    trace.endTimeRange(range);
}
exports.endTimeRange = endTimeRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3RmX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9wcm9maWxlL3d0Zl9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQStCO0FBNEIvQixJQUFJLEtBQVksQ0FBQztBQUNqQixJQUFJLE1BQWMsQ0FBQztBQUVuQjtJQUNFLElBQU0sR0FBRyxHQUFTLGFBQWEsQ0FBQyxpQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ1IsS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVZELDhCQVVDO0FBRUQscUJBQTRCLFNBQWlCLEVBQUUsS0FBaUI7SUFBakIsc0JBQUEsRUFBQSxZQUFpQjtJQUM5RCxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUZELGtDQUVDO0FBSUQsZUFBeUIsS0FBWSxFQUFFLFdBQWlCO0lBQ3RELEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUhELHNCQUdDO0FBRUQsd0JBQStCLFNBQWlCLEVBQUUsTUFBYztJQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELHdDQUVDO0FBRUQsc0JBQTZCLEtBQVk7SUFDdkMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsb0NBRUMifQ==