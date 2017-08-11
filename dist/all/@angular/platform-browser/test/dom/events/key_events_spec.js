"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var key_events_1 = require("@angular/platform-browser/src/dom/events/key_events");
function main() {
    testing_internal_1.describe('KeyEventsPlugin', function () {
        testing_internal_1.it('should ignore unrecognized events', function () {
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.unknownmodifier.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.unknownmodifier.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('unknownevent.control.shift.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('unknownevent.enter')).toEqual(null);
        });
        testing_internal_1.it('should correctly parse event names', function () {
            // key with no modifier
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'enter' });
            // key with modifiers:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.control.shift.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift.enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.shift.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift.enter' });
            // key with modifiers in a different order:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.shift.control.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift.enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.shift.control.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift.enter' });
            // key that is also a modifier:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.shift.control'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'shift.control' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.shift.control'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'shift.control' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.control.shift'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.shift'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift' });
        });
        testing_internal_1.it('should alias esc to escape', function () {
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.esc'))
                .toEqual(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.escape'));
        });
        testing_internal_1.it('should implement addGlobalEventListener', function () {
            var plugin = new key_events_1.KeyEventsPlugin(document);
            spyOn(plugin, 'addEventListener').and.callFake(function () { });
            testing_internal_1.expect(function () { return plugin.addGlobalEventListener('window', 'keyup.control.esc', function () { }); })
                .not.toThrowError();
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50c19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2RvbS9ldmVudHMva2V5X2V2ZW50c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLGtGQUFvRjtBQUVwRjtJQUNFLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFFMUIscUJBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtZQUN0Qyx5QkFBTSxDQUFDLDRCQUFlLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hFLHlCQUFNLENBQUMsNEJBQWUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQseUJBQU0sQ0FBQyw0QkFBZSxDQUFDLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RGLHlCQUFNLENBQUMsNEJBQWUsQ0FBQyxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRix5QkFBTSxDQUFDLDRCQUFlLENBQUMsY0FBYyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekYseUJBQU0sQ0FBQyw0QkFBZSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2Qyx1QkFBdUI7WUFDdkIseUJBQU0sQ0FBQyw0QkFBZSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FB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