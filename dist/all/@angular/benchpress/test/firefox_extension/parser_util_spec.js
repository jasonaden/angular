"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var parser_util_1 = require("../../src/firefox_extension/lib/parser_util");
function assertEventsEqual(actualEvents, expectedEvents) {
    expect(actualEvents.length == expectedEvents.length);
    for (var i = 0; i < actualEvents.length; ++i) {
        var actualEvent = actualEvents[i];
        var expectedEvent = expectedEvents[i];
        for (var key in actualEvent) {
            expect(actualEvent[key]).toEqual(expectedEvent[key]);
        }
    }
}
;
function main() {
    describe('convertPerfProfileToEvents', function () {
        it('should convert single instantaneous event', function () {
            var profileData = {
                threads: [
                    { samples: [{ time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }] }
                ]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }]);
        });
        it('should convert single non-instantaneous event', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 100, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'B', ts: 1, name: 'script' }, { ph: 'E', ts: 100, name: 'script' }]);
        });
        it('should convert multiple instantaneous events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'PresShell::Paint' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }, { ph: 'X', ts: 2, name: 'render' }]);
        });
        it('should convert multiple mixed events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'PresShell::Paint' }] },
                            { time: 5, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 10, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [
                { ph: 'X', ts: 1, name: 'script' }, { ph: 'X', ts: 2, name: 'render' },
                { ph: 'B', ts: 5, name: 'script' }, { ph: 'E', ts: 10, name: 'script' }
            ]);
        });
        it('should add args to gc events', function () {
            var profileData = { threads: [{ samples: [{ time: 1, frames: [{ location: 'forceGC' }] }] }] };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'gc', args: { usedHeapSize: 0 } }]);
        });
        it('should skip unknown events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'foo' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }]);
        });
    });
}
exports.main = main;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3V0aWxfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9wYXJzZXJfdXRpbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkVBQXVGO0FBRXZGLDJCQUEyQixZQUFtQixFQUFFLGNBQXFCO0lBQ25FLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM3QyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFBQSxDQUFDO0FBRUY7SUFDRSxRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLElBQU0sV0FBVyxHQUFHO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUUsdUNBQXVDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztpQkFDdEY7YUFDRixDQUFDO1lBQ0Ys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