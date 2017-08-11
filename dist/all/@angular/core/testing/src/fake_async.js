"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
var ProxyZoneSpec = Zone['ProxyZoneSpec'];
var _fakeAsyncTestZoneSpec = null;
/**
 * Clears out the shared fake async zone for a test.
 * To be called in a global `beforeEach`.
 *
 * @experimental
 */
function resetFakeAsyncZone() {
    _fakeAsyncTestZoneSpec = null;
    ProxyZoneSpec.assertPresent().resetDelegate();
}
exports.resetFakeAsyncZone = resetFakeAsyncZone;
var _inFakeAsyncCall = false;
/**
 * Wraps a function to be executed in the fakeAsync zone:
 * - microtasks are manually executed by calling `flushMicrotasks()`,
 * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
 *
 * If there are any pending timers at the end of the function, an exception will be thrown.
 *
 * Can be used to wrap inject() calls.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @param fn
 * @returns The function wrapped to be executed in the fakeAsync zone
 *
 * @experimental
 */
function fakeAsync(fn) {
    // Not using an arrow function to preserve context passed from call site
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var proxyZoneSpec = ProxyZoneSpec.assertPresent();
        if (_inFakeAsyncCall) {
            throw new Error('fakeAsync() calls can not be nested');
        }
        _inFakeAsyncCall = true;
        try {
            if (!_fakeAsyncTestZoneSpec) {
                if (proxyZoneSpec.getDelegate() instanceof FakeAsyncTestZoneSpec) {
                    throw new Error('fakeAsync() calls can not be nested');
                }
                _fakeAsyncTestZoneSpec = new FakeAsyncTestZoneSpec();
            }
            var res = void 0;
            var lastProxyZoneSpec = proxyZoneSpec.getDelegate();
            proxyZoneSpec.setDelegate(_fakeAsyncTestZoneSpec);
            try {
                res = fn.apply(this, args);
                flushMicrotasks();
            }
            finally {
                proxyZoneSpec.setDelegate(lastProxyZoneSpec);
            }
            if (_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
                throw new Error(_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " " +
                    "periodic timer(s) still in the queue.");
            }
            if (_fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
                throw new Error(_fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
            }
            return res;
        }
        finally {
            _inFakeAsyncCall = false;
            resetFakeAsyncZone();
        }
    };
}
exports.fakeAsync = fakeAsync;
function _getFakeAsyncZoneSpec() {
    if (_fakeAsyncTestZoneSpec == null) {
        throw new Error('The code should be running in the fakeAsync zone to call this function');
    }
    return _fakeAsyncTestZoneSpec;
}
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
 *
 * The microtasks queue is drained at the very start of this function and after any timer callback
 * has been executed.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @experimental
 */
function tick(millis) {
    if (millis === void 0) { millis = 0; }
    _getFakeAsyncZoneSpec().tick(millis);
}
exports.tick = tick;
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone by
 * draining the macrotask queue until it is empty. The returned value is the milliseconds
 * of time that would have been elapsed.
 *
 * @param maxTurns
 * @returns The simulated time elapsed, in millis.
 *
 * @experimental
 */
function flush(maxTurns) {
    return _getFakeAsyncZoneSpec().flush(maxTurns);
}
exports.flush = flush;
/**
 * Discard all remaining periodic tasks.
 *
 * @experimental
 */
function discardPeriodicTasks() {
    var zoneSpec = _getFakeAsyncZoneSpec();
    var pendingTimers = zoneSpec.pendingPeriodicTimers;
    zoneSpec.pendingPeriodicTimers.length = 0;
}
exports.discardPeriodicTasks = discardPeriodicTasks;
/**
 * Flush any pending microtasks.
 *
 * @experimental
 */
function flushMicrotasks() {
    _getFakeAsyncZoneSpec().flushMicrotasks();
}
exports.flushMicrotasks = flushMicrotasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvZmFrZV9hc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILElBQU0scUJBQXFCLEdBQUksSUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFJckUsSUFBTSxhQUFhLEdBQ2QsSUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRW5DLElBQUksc0JBQXNCLEdBQVEsSUFBSSxDQUFDO0FBRXZDOzs7OztHQUtHO0FBQ0g7SUFDRSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7SUFDOUIsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFIRCxnREFHQztBQUVELElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRTdCOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILG1CQUEwQixFQUFZO0lBQ3BDLHdFQUF3RTtJQUN4RSxNQUFNLENBQUM7UUFBUyxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLHlCQUFjOztRQUM1QixJQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDcEQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQztZQUNILEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFlBQVkscUJBQXFCLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7Z0JBQ3pELENBQUM7Z0JBRUQsc0JBQXNCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1lBQ3ZELENBQUM7WUFFRCxJQUFJLEdBQUcsU0FBSyxDQUFDO1lBQ2IsSUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsYUFBYSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQztnQkFDSCxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLGVBQWUsRUFBRSxDQUFDO1lBQ3BCLENBQUM7b0JBQVMsQ0FBQztnQkFDVCxhQUFhLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLElBQUksS0FBSyxDQUNSLHNCQUFzQixDQUFDLHFCQUFxQixDQUFDLE1BQU0sTUFBRztvQkFDekQsdUNBQXVDLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLElBQUksS0FBSyxDQUNSLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxNQUFNLGtDQUErQixDQUFDLENBQUM7WUFDckYsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO2dCQUFTLENBQUM7WUFDVCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDekIsa0JBQWtCLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTNDRCw4QkEyQ0M7QUFFRDtJQUNFLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFDRCxNQUFNLENBQUMsc0JBQXNCLENBQUM7QUFDaEMsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsY0FBcUIsTUFBa0I7SUFBbEIsdUJBQUEsRUFBQSxVQUFrQjtJQUNyQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsb0JBRUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxlQUFzQixRQUFpQjtJQUNyQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELHNCQUVDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBTSxRQUFRLEdBQUcscUJBQXFCLEVBQUUsQ0FBQztJQUN6QyxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMscUJBQXFCLENBQUM7SUFDckQsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUpELG9EQUlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQ0UscUJBQXFCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBRkQsMENBRUMifQ==