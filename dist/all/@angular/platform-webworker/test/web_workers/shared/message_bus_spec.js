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
var test_bed_1 = require("@angular/core/testing/src/test_bed");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var message_bus_util_1 = require("./message_bus_util");
function main() {
    /**
     * Tests the PostMessageBus
     */
    testing_internal_1.describe('MessageBus', function () {
        var bus;
        testing_internal_1.beforeEach(function () { bus = message_bus_util_1.createConnectedMessageBus(); });
        testing_internal_1.it('should pass messages in the same channel from sink to source', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL = 'CHANNEL 1';
            var MESSAGE = 'Test message';
            bus.initChannel(CHANNEL, false);
            var fromEmitter = bus.from(CHANNEL);
            fromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE);
                    async.done();
                }
            });
            var toEmitter = bus.to(CHANNEL);
            toEmitter.emit(MESSAGE);
        }));
        testing_internal_1.it('should broadcast', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL = 'CHANNEL 1';
            var MESSAGE = 'TESTING';
            var NUM_LISTENERS = 2;
            bus.initChannel(CHANNEL, false);
            var callCount = 0;
            var emitHandler = function (message) {
                testing_internal_1.expect(message).toEqual(MESSAGE);
                callCount++;
                if (callCount == NUM_LISTENERS) {
                    async.done();
                }
            };
            for (var i = 0; i < NUM_LISTENERS; i++) {
                var emitter = bus.from(CHANNEL);
                emitter.subscribe({ next: emitHandler });
            }
            var toEmitter = bus.to(CHANNEL);
            toEmitter.emit(MESSAGE);
        }));
        testing_internal_1.it('should keep channels independent', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL_ONE = 'CHANNEL 1';
            var CHANNEL_TWO = 'CHANNEL 2';
            var MESSAGE_ONE = 'This is a message on CHANNEL 1';
            var MESSAGE_TWO = 'This is a message on CHANNEL 2';
            var callCount = 0;
            bus.initChannel(CHANNEL_ONE, false);
            bus.initChannel(CHANNEL_TWO, false);
            var firstFromEmitter = bus.from(CHANNEL_ONE);
            firstFromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE_ONE);
                    callCount++;
                    if (callCount == 2) {
                        async.done();
                    }
                }
            });
            var secondFromEmitter = bus.from(CHANNEL_TWO);
            secondFromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE_TWO);
                    callCount++;
                    if (callCount == 2) {
                        async.done();
                    }
                }
            });
            var firstToEmitter = bus.to(CHANNEL_ONE);
            firstToEmitter.emit(MESSAGE_ONE);
            var secondToEmitter = bus.to(CHANNEL_TWO);
            secondToEmitter.emit(MESSAGE_TWO);
        }));
    });
    testing_internal_1.describe('PostMessageBusSink', function () {
        var bus;
        var CHANNEL = 'Test Channel';
        function setup(runInZone, zone) {
            bus.attachToZone(zone);
            bus.initChannel(CHANNEL, runInZone);
        }
        /**
         * Flushes pending messages and then runs the given function.
         */
        // TODO(mlaval): timeout is fragile, test to be rewritten
        function flushMessages(fn) { setTimeout(fn, 50); }
        testing_internal_1.it('should buffer messages and wait for the zone to exit before sending', test_bed_1.withModule({ providers: [{ provide: core_1.NgZone, useClass: testing_internal_1.MockNgZone }] })
            .inject([testing_internal_1.AsyncTestCompleter, core_1.NgZone], function (async, zone) {
            bus = message_bus_util_1.createConnectedMessageBus();
            setup(true, zone);
            var wasCalled = false;
            bus.from(CHANNEL).subscribe({ next: function (message) { wasCalled = true; } });
            bus.to(CHANNEL).emit('hi');
            flushMessages(function () {
                testing_internal_1.expect(wasCalled).toBeFalsy();
                zone.simulateZoneExit();
                flushMessages(function () {
                    testing_internal_1.expect(wasCalled).toBeTruthy();
                    async.done();
                });
            });
        }), 500);
        testing_internal_1.it('should send messages immediately when run outside the zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, core_1.NgZone], function (async, zone) {
            bus = message_bus_util_1.createConnectedMessageBus();
            setup(false, zone);
            var wasCalled = false;
            bus.from(CHANNEL).subscribe({ next: function (message) { wasCalled = true; } });
            bus.to(CHANNEL).emit('hi');
            flushMessages(function () {
                testing_internal_1.expect(wasCalled).toBeTruthy();
                async.done();
            });
        }), 10000);
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9idXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXFDO0FBQ3JDLCtEQUE4RDtBQUM5RCwrRUFBb0k7QUFHcEksdURBQTZEO0FBRTdEO0lBQ0U7O09BRUc7SUFDSCwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFJLEdBQWUsQ0FBQztRQUVwQiw2QkFBVSxDQUFDLGNBQVEsR0FBRyxHQUFHLDRDQUF5QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxxQkFBRSxDQUFDLDhEQUE4RCxFQUM5RCx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztZQUM1QixJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUM7WUFDL0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFaEMsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixJQUFJLEVBQUUsVUFBQyxPQUFZO29CQUNqQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLHFCQUFFLENBQUMsa0JBQWtCLEVBQUUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUN6RSxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUM7WUFDNUIsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQzFCLElBQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVoQyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBTSxXQUFXLEdBQUcsVUFBQyxPQUFZO2dCQUMvQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakMsU0FBUyxFQUFFLENBQUM7Z0JBQ1osRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRUYsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkMsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFRCxJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLHFCQUFFLENBQUMsa0NBQWtDLEVBQ2xDLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQ2hDLElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUNoQyxJQUFNLFdBQVcsR0FBRyxnQ0FBZ0MsQ0FBQztZQUNyRCxJQUFNLFdBQVcsR0FBRyxnQ0FBZ0MsQ0FBQztZQUNyRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDbEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFcEMsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztnQkFDekIsSUFBSSxFQUFFLFVBQUMsT0FBWTtvQkFDakIseUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDO29CQUNaLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELGlCQUFpQixDQUFDLFNBQVMsQ0FBQztnQkFDMUIsSUFBSSxFQUFFLFVBQUMsT0FBWTtvQkFDakIseUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDO29CQUNaLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRWpDLElBQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCwyQkFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksR0FBZSxDQUFDO1FBQ3BCLElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUUvQixlQUFlLFNBQWtCLEVBQUUsSUFBWTtZQUM3QyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRDs7V0FFRztRQUNILHlEQUF5RDtRQUN6RCx1QkFBdUIsRUFBYyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlELHFCQUFFLENBQUMscUVBQXFFLEVBQ3JFLHFCQUFVLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFNLEVBQUUsUUFBUSxFQUFFLDZCQUFVLEVBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0QsTUFBTSxDQUNILENBQUMscUNBQWtCLEVBQUUsYUFBTSxDQUFDLEVBQzVCLFVBQUMsS0FBeUIsRUFBRSxJQUFnQjtZQUMxQyxHQUFHLEdBQUcsNENBQXlCLEVBQUUsQ0FBQztZQUNsQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWxCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFDLE9BQVksSUFBTyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM3RSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUczQixhQUFhLENBQUM7Z0JBQ1oseUJBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFFOUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLGFBQWEsQ0FBQztvQkFDWix5QkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUMvQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUNWLEdBQUcsQ0FBQyxDQUFDO1FBRVIscUJBQUUsQ0FBQyw0REFBNEQsRUFDNUQseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixFQUFFLGFBQU0sQ0FBQyxFQUFFLFVBQUMsS0FBeUIsRUFBRSxJQUFnQjtZQUMvRSxHQUFHLEdBQUcsNENBQXlCLEVBQUUsQ0FBQztZQUNsQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRW5CLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFDLE9BQVksSUFBTyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM3RSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixhQUFhLENBQUM7Z0JBQ1oseUJBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDL0IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoSkQsb0JBZ0pDIn0=