"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var hammer_gestures_1 = require("@angular/platform-browser/src/dom/events/hammer_gestures");
function main() {
    testing_internal_1.describe('HammerGesturesPlugin', function () {
        testing_internal_1.it('should implement addGlobalEventListener', function () {
            var plugin = new hammer_gestures_1.HammerGesturesPlugin(document, new hammer_gestures_1.HammerGestureConfig());
            spyOn(plugin, 'addEventListener').and.callFake(function () { });
            testing_internal_1.expect(function () { return plugin.addGlobalEventListener('document', 'swipe', function () { }); }).not.toThrowError();
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyX2dlc3R1cmVzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtFQUFnRjtBQUNoRiw0RkFBbUg7QUFFbkg7SUFDRSwyQkFBUSxDQUFDLHNCQUFzQixFQUFFO1FBRS9CLHFCQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxzQ0FBb0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxxQ0FBbUIsRUFBRSxDQUFDLENBQUM7WUFFN0UsS0FBSyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQztZQUV6RCx5QkFBTSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxjQUFPLENBQUMsQ0FBQyxFQUE1RCxDQUE0RCxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBWEQsb0JBV0MifQ==