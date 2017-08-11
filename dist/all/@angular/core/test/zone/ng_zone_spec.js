"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var util_1 = require("../../src/util");
var needsLongerTimers = browser_util_1.browserDetection.isSlow || browser_util_1.browserDetection.isEdge;
var resultTimer = 1000;
var testTimeout = browser_util_1.browserDetection.isEdge ? 1200 : 500;
// Schedules a macrotask (using a timer)
function macroTask(fn, timer) {
    if (timer === void 0) { timer = 1; }
    // adds longer timers for passing tests in IE and Edge
    setTimeout(fn, needsLongerTimers ? timer : 1);
}
var _log;
var _errors;
var _traces;
var _zone;
var resolvedPromise = Promise.resolve(null);
function logOnError() {
    _zone.onError.subscribe({
        next: function (error) {
            // Error handler should run outside of the Angular zone.
            ng_zone_1.NgZone.assertNotInAngularZone();
            _errors.push(error);
            _traces.push(error.stack);
        }
    });
}
function logOnUnstable() {
    _zone.onUnstable.subscribe({ next: _log.fn('onUnstable') });
}
function logOnMicrotaskEmpty() {
    _zone.onMicrotaskEmpty.subscribe({ next: _log.fn('onMicrotaskEmpty') });
}
function logOnStable() {
    _zone.onStable.subscribe({ next: _log.fn('onStable') });
}
function runNgZoneNoLog(fn) {
    var length = _log.logItems.length;
    try {
        return _zone.run(fn);
    }
    finally {
        // delete anything which may have gotten logged.
        _log.logItems.length = length;
    }
}
function main() {
    testing_internal_1.describe('NgZone', function () {
        function createZone(enableLongStackTrace) {
            return new ng_zone_1.NgZone({ enableLongStackTrace: enableLongStackTrace });
        }
        testing_internal_1.beforeEach(function () {
            _log = new testing_internal_1.Log();
            _errors = [];
            _traces = [];
        });
        testing_internal_1.describe('long stack trace', function () {
            testing_internal_1.beforeEach(function () {
                _zone = createZone(true);
                logOnUnstable();
                logOnMicrotaskEmpty();
                logOnStable();
                logOnError();
            });
            commonTests();
            testing_internal_1.it('should produce long stack traces', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                resolve(null);
                                throw new Error('ccc');
                            }, 0);
                        }, 0);
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        testing_internal_1.expect(_traces[0].length).toBeGreaterThan(1);
                        async.done();
                    });
                });
            }), testTimeout);
            testing_internal_1.it('should produce long stack traces (when using microtasks)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        util_1.scheduleMicroTask(function () {
                            util_1.scheduleMicroTask(function () {
                                resolve(null);
                                throw new Error('ddd');
                            });
                        });
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        testing_internal_1.expect(_traces[0].length).toBeGreaterThan(1);
                        async.done();
                    });
                });
            }), testTimeout);
        });
        testing_internal_1.describe('short stack trace', function () {
            testing_internal_1.beforeEach(function () {
                _zone = createZone(false);
                logOnUnstable();
                logOnMicrotaskEmpty();
                logOnStable();
                logOnError();
            });
            commonTests();
            testing_internal_1.it('should disable long stack traces', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                resolve(null);
                                throw new Error('ccc');
                            }, 0);
                        }, 0);
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        if (_traces[0] != null) {
                            // some browsers don't have stack traces.
                            testing_internal_1.expect(_traces[0].indexOf('---')).toEqual(-1);
                        }
                        async.done();
                    });
                });
            }), testTimeout);
        });
    });
}
exports.main = main;
function commonTests() {
    testing_internal_1.describe('hasPendingMicrotasks', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(false); });
        testing_internal_1.it('should be true', function () {
            runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
            testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('hasPendingTimers', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(false); });
        testing_internal_1.it('should be true', function () {
            runNgZoneNoLog(function () { setTimeout(function () { }, 0); });
            testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('hasPendingAsyncTasks', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(false); });
        testing_internal_1.it('should be true when microtask is scheduled', function () {
            runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
            testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(true);
        });
        testing_internal_1.it('should be true when timer is scheduled', function () {
            runNgZoneNoLog(function () { setTimeout(function () { }, 0); });
            testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('isInInnerZone', function () {
        testing_internal_1.it('should return whether the code executes in the inner zone', function () {
            testing_internal_1.expect(ng_zone_1.NgZone.isInAngularZone()).toEqual(false);
            runNgZoneNoLog(function () { testing_internal_1.expect(ng_zone_1.NgZone.isInAngularZone()).toEqual(true); });
        }, testTimeout);
    });
    testing_internal_1.describe('run', function () {
        testing_internal_1.it('should return the body return value from run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { testing_internal_1.expect(_zone.run(function () { return 6; })).toEqual(6); });
            macroTask(function () { async.done(); });
        }), testTimeout);
        testing_internal_1.it('should return the body return value from runTask', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { testing_internal_1.expect(_zone.runTask(function () { return 6; })).toEqual(6); });
            macroTask(function () { async.done(); });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onStable once at the end of event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            // The test is set up in a way that causes the zone loop to run onMicrotaskEmpty twice
            // then verified that onStable is only called once at the end
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            var times = 0;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    times++;
                    _log.add("onMicrotaskEmpty " + times);
                    if (times < 2) {
                        // Scheduling a microtask causes a second digest
                        runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
                    }
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onMicrotaskEmpty 1; ' +
                    'onMicrotaskEmpty; onMicrotaskEmpty 2; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call standalone onStable', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.xit('should run subscriber listeners in the subscription zone (outside)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            // Each subscriber fires a microtask outside the Angular zone. The test
            // then verifies that those microtasks do not cause additional digests.
            var turnStart = false;
            _zone.onUnstable.subscribe({
                next: function () {
                    if (turnStart)
                        throw 'Should not call this more than once';
                    _log.add('onUnstable');
                    util_1.scheduleMicroTask(function () { });
                    turnStart = true;
                }
            });
            var turnDone = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    if (turnDone)
                        throw 'Should not call this more than once';
                    _log.add('onMicrotaskEmpty');
                    util_1.scheduleMicroTask(function () { });
                    turnDone = true;
                }
            });
            var eventDone = false;
            _zone.onStable.subscribe({
                next: function () {
                    if (eventDone)
                        throw 'Should not call this more than once';
                    _log.add('onStable');
                    util_1.scheduleMicroTask(function () { });
                    eventDone = true;
                }
            });
            macroTask(function () { _zone.run(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run subscriber listeners in the subscription zone (inside)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            // the only practical use-case to run a callback inside the zone is
            // change detection after "onMicrotaskEmpty". That's the only case tested.
            var turnDone = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMyMicrotaskEmpty');
                    if (turnDone)
                        return;
                    _zone.run(function () { util_1.scheduleMicroTask(function () { }); });
                    turnDone = true;
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onMyMicrotaskEmpty; ' +
                    'onMicrotaskEmpty; onMyMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run async tasks scheduled inside onStable outside Angular zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            _zone.onStable.subscribe({
                next: function () {
                    ng_zone_1.NgZone.assertNotInAngularZone();
                    _log.add('onMyTaskDone');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onStable; onMyTaskDone');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable once before a turn and onMicrotaskEmpty once after the turn', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    util_1.scheduleMicroTask(_log.fn('async'));
                    _log.add('run end');
                });
            });
            macroTask(function () {
                // The microtask (async) is executed after the macrotask (run)
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; run end; async; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should not run onUnstable and onMicrotaskEmpty for nested Zone.run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('start run');
                    _zone.run(function () {
                        _log.add('nested run');
                        util_1.scheduleMicroTask(_log.fn('nested run microtask'));
                    });
                    _log.add('end run');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; start run; nested run; end run; nested run microtask; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should not run onUnstable and onMicrotaskEmpty for nested Zone.run invoked from onMicrotaskEmpty', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('start run')); });
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty:started');
                    _zone.run(function () { return _log.add('nested run'); });
                    _log.add('onMicrotaskEmpty:finished');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; start run; onMicrotaskEmpty; onMicrotaskEmpty:started; nested run; onMicrotaskEmpty:finished; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each top-level run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run1')); });
            runNgZoneNoLog(function () { return macroTask(_log.fn('run2')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run1; onMicrotaskEmpty; onStable; onUnstable; run2; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each turn', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var aResolve;
            var aPromise;
            var bResolve;
            var bPromise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aPromise = new Promise(function (res) { aResolve = res; });
                    bPromise = new Promise(function (res) { bResolve = res; });
                    _log.add('run start');
                    aPromise.then(_log.fn('a then'));
                    bPromise.then(_log.fn('b then'));
                });
            });
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aResolve('a');
                    bResolve('b');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; onMicrotaskEmpty; onStable; onUnstable; a then; b then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run a function outside of the angular zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { _zone.runOutsideAngular(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('run');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty when an inner microtask is scheduled from outside angular', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var resolve;
            var promise;
            macroTask(function () {
                ng_zone_1.NgZone.assertNotInAngularZone();
                promise = new Promise(function (res) { resolve = res; });
            });
            runNgZoneNoLog(function () {
                macroTask(function () {
                    ng_zone_1.NgZone.assertInAngularZone();
                    promise.then(_log.fn('executedMicrotask'));
                });
            });
            macroTask(function () {
                ng_zone_1.NgZone.assertNotInAngularZone();
                _log.add('scheduling a microtask');
                resolve(null);
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn => setup Promise then
                'onUnstable; onMicrotaskEmpty; onStable; ' +
                    // Second VM turn (outside of angular)
                    'scheduling a microtask; onUnstable; ' +
                    // Third VM Turn => execute the microtask (inside angular)
                    // No onUnstable;  because we don't own the task which started the turn.
                    'executedMicrotask; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable only before executing a microtask scheduled in onMicrotaskEmpty ' +
            'and not onMicrotaskEmpty after executing the task', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            var ran = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!ran) {
                        _zone.run(function () {
                            util_1.scheduleMicroTask(function () {
                                ran = true;
                                _log.add('executedMicrotask');
                            });
                        });
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn => 'run' macrotask
                'onUnstable; run; onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); ' +
                    // Second microtaskDrain Turn => microtask enqueued from onMicrotaskEmpty
                    'executedMicrotask; onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty for a scheduleMicroTask in onMicrotaskEmpty triggered by ' +
            'a scheduleMicroTask in run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('scheduleMicroTask');
                    util_1.scheduleMicroTask(_log.fn('run(executeMicrotask)'));
                });
            });
            var ran = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!ran) {
                        _log.add('onMicrotaskEmpty(scheduleMicroTask)');
                        _zone.run(function () {
                            util_1.scheduleMicroTask(function () {
                                ran = true;
                                _log.add('onMicrotaskEmpty(executeMicrotask)');
                            });
                        });
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM Turn => a macrotask + the microtask it enqueues
                'onUnstable; scheduleMicroTask; run(executeMicrotask); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(scheduleMicroTask); onMicrotaskEmpty(end); ' +
                    // Second VM Turn => the microtask enqueued from onMicrotaskEmpty
                    'onMicrotaskEmpty(executeMicrotask); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should execute promises scheduled in onUnstable before promises scheduled in run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    resolvedPromise
                        .then(function (_) {
                        _log.add('promise then');
                        resolvedPromise.then(_log.fn('promise foo'));
                        return Promise.resolve(null);
                    })
                        .then(_log.fn('promise bar'));
                    _log.add('run end');
                });
            });
            var donePromiseRan = false;
            var startPromiseRan = false;
            _zone.onUnstable.subscribe({
                next: function () {
                    _log.add('onUnstable(begin)');
                    if (!startPromiseRan) {
                        _log.add('onUnstable(schedulePromise)');
                        _zone.run(function () { util_1.scheduleMicroTask(_log.fn('onUnstable(executePromise)')); });
                        startPromiseRan = true;
                    }
                    _log.add('onUnstable(end)');
                }
            });
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!donePromiseRan) {
                        _log.add('onMicrotaskEmpty(schedulePromise)');
                        _zone.run(function () { util_1.scheduleMicroTask(_log.fn('onMicrotaskEmpty(executePromise)')); });
                        donePromiseRan = true;
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn: enqueue a microtask in onUnstable
                'onUnstable; onUnstable(begin); onUnstable(schedulePromise); onUnstable(end); ' +
                    // First VM turn: execute the macrotask which enqueues microtasks
                    'run start; run end; ' +
                    // First VM turn: execute enqueued microtasks
                    'onUnstable(executePromise); promise then; promise foo; promise bar; onMicrotaskEmpty; ' +
                    // First VM turn: onTurnEnd, enqueue a microtask
                    'onMicrotaskEmpty(begin); onMicrotaskEmpty(schedulePromise); onMicrotaskEmpty(end); ' +
                    // Second VM turn: execute the microtask from onTurnEnd
                    'onMicrotaskEmpty(executePromise); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each turn, respectively', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var aResolve;
            var aPromise;
            var bResolve;
            var bPromise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aPromise = new Promise(function (res) { aResolve = res; });
                    bPromise = new Promise(function (res) { bResolve = res; });
                    aPromise.then(_log.fn('a then'));
                    bPromise.then(_log.fn('b then'));
                    _log.add('run start');
                });
            });
            runNgZoneNoLog(function () { macroTask(function () { aResolve(null); }, 10); });
            runNgZoneNoLog(function () { macroTask(function () { bResolve(null); }, 20); });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn
                'onUnstable; run start; onMicrotaskEmpty; onStable; ' +
                    // Second VM turn
                    'onUnstable; a then; onMicrotaskEmpty; onStable; ' +
                    // Third VM turn
                    'onUnstable; b then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after (respectively) all turns in a chain', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    util_1.scheduleMicroTask(function () {
                        _log.add('async1');
                        util_1.scheduleMicroTask(_log.fn('async2'));
                    });
                    _log.add('run end');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; run end; async1; async2; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty for promises created outside of run body', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var promise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _zone.runOutsideAngular(function () { promise = Promise.resolve(4).then(function (x) { return Promise.resolve(x); }); });
                    promise.then(_log.fn('promise then'));
                    _log.add('zone run');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; zone run; onMicrotaskEmpty; onStable; ' +
                    'onUnstable; promise then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
    });
    testing_internal_1.describe('exceptions', function () {
        testing_internal_1.it('should call the on error callback when it is invoked via zone.runGuarded', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () {
                var exception = new Error('sync');
                _zone.runGuarded(function () { throw exception; });
                testing_internal_1.expect(_errors.length).toBe(1);
                testing_internal_1.expect(_errors[0]).toBe(exception);
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should not call the on error callback but rethrow when it is invoked via zone.run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () {
                var exception = new Error('sync');
                testing_internal_1.expect(function () { return _zone.run(function () { throw exception; }); }).toThrowError('sync');
                testing_internal_1.expect(_errors.length).toBe(0);
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onError for errors from microtasks', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var exception = new Error('async');
            macroTask(function () { _zone.run(function () { util_1.scheduleMicroTask(function () { throw exception; }); }); });
            macroTask(function () {
                testing_internal_1.expect(_errors.length).toBe(1);
                testing_internal_1.expect(_errors[0]).toEqual(exception);
                async.done();
            }, resultTimer);
        }), testTimeout);
    });
    testing_internal_1.describe('bugs', function () {
        testing_internal_1.describe('#10503', function () {
            var ngZone;
            testing_internal_1.beforeEach(testing_internal_1.inject([ng_zone_1.NgZone], function (_ngZone) {
                // Create a zone outside the fakeAsync.
                ngZone = _ngZone;
            }));
            testing_internal_1.it('should fakeAsync even if the NgZone was created outside.', testing_1.fakeAsync(function () {
                var result = null;
                // try to escape the current fakeAsync zone by using NgZone which was created outside.
                ngZone.run(function () {
                    Promise.resolve('works').then(function (v) { return result = v; });
                    testing_1.flushMicrotasks();
                });
                testing_internal_1.expect(result).toEqual('works');
            }));
            testing_internal_1.describe('async', function () {
                var asyncResult;
                var waitLongerThenTestFrameworkAsyncTimeout = 5;
                testing_internal_1.beforeEach(function () { asyncResult = null; });
                testing_internal_1.it('should async even if the NgZone was created outside.', testing_1.async(function () {
                    // try to escape the current async zone by using NgZone which was created outside.
                    ngZone.run(function () {
                        setTimeout(function () {
                            Promise.resolve('works').then(function (v) { return asyncResult = v; });
                        }, waitLongerThenTestFrameworkAsyncTimeout);
                    });
                }));
                afterEach(function () { testing_internal_1.expect(asyncResult).toEqual('works'); });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfem9uZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3pvbmUvbmdfem9uZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMERBQXNEO0FBQ3RELGlEQUF3RTtBQUN4RSwrRUFBa0k7QUFDbEksbUZBQW9GO0FBQ3BGLHVDQUFpRDtBQUVqRCxJQUFNLGlCQUFpQixHQUFHLCtCQUFnQixDQUFDLE1BQU0sSUFBSSwrQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDN0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLElBQU0sV0FBVyxHQUFHLCtCQUFnQixDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ3pELHdDQUF3QztBQUN4QyxtQkFBbUIsRUFBNEIsRUFBRSxLQUFTO0lBQVQsc0JBQUEsRUFBQSxTQUFTO0lBQ3hELHNEQUFzRDtJQUN0RCxVQUFVLENBQUMsRUFBRSxFQUFFLGlCQUFpQixHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsSUFBSSxJQUFTLENBQUM7QUFDZCxJQUFJLE9BQWMsQ0FBQztBQUNuQixJQUFJLE9BQWMsQ0FBQztBQUNuQixJQUFJLEtBQWEsQ0FBQztBQUVsQixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTlDO0lBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDdEIsSUFBSSxFQUFFLFVBQUMsS0FBVTtZQUNmLHdEQUF3RDtZQUN4RCxnQkFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0UsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUVEO0lBQ0UsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRDtJQUNFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCx3QkFBd0IsRUFBYTtJQUNuQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFJLENBQUM7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO1lBQVMsQ0FBQztRQUNULGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDaEMsQ0FBQztBQUNILENBQUM7QUFFRDtJQUNFLDJCQUFRLENBQUMsUUFBUSxFQUFFO1FBRWpCLG9CQUFvQixvQkFBNkI7WUFDL0MsTUFBTSxDQUFDLElBQUksZ0JBQU0sQ0FBQyxFQUFDLG9CQUFvQixFQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQsNkJBQVUsQ0FBQztZQUNULElBQUksR0FBRyxJQUFJLHNCQUFHLEVBQUUsQ0FBQztZQUNqQixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQiw2QkFBVSxDQUFDO2dCQUNULEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pCLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixXQUFXLEVBQUUsQ0FBQztnQkFDZCxVQUFVLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1lBRUgsV0FBVyxFQUFFLENBQUM7WUFFZCxxQkFBRSxDQUFDLGtDQUFrQyxFQUNsQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO2dCQUNyRCxTQUFTLENBQUM7b0JBQ1IsSUFBSSxPQUE4QixDQUFDO29CQUNuQyxJQUFNLE9BQU8sR0FBaUIsSUFBSSxPQUFPLENBQUMsVUFBQyxHQUFHLElBQU8sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV2RSxLQUFLLENBQUMsR0FBRyxDQUFDO3dCQUNSLFVBQVUsQ0FBQzs0QkFDVCxVQUFVLENBQUM7Z0NBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3pCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDUixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxDQUFDLENBQUM7b0JBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0JBQ2IseUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRXBCLHFCQUFFLENBQUMsMERBQTBELEVBQzFELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7Z0JBQ3JELFNBQVMsQ0FBQztvQkFDUixJQUFJLE9BQThCLENBQUM7b0JBQ25DLElBQU0sT0FBTyxHQUFpQixJQUFJLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBTyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXZFLEtBQUssQ0FBQyxHQUFHLENBQUM7d0JBQ1Isd0JBQWlCLENBQUM7NEJBQ2hCLHdCQUFpQixDQUFDO2dDQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDekIsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0JBQ2IseUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1Qiw2QkFBVSxDQUFDO2dCQUNULEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLGFBQWEsRUFBRSxDQUFDO2dCQUNoQixtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixXQUFXLEVBQUUsQ0FBQztnQkFDZCxVQUFVLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1lBRUgsV0FBVyxFQUFFLENBQUM7WUFFZCxxQkFBRSxDQUFDLGtDQUFrQyxFQUNsQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO2dCQUNyRCxTQUFTLENBQUM7b0JBQ1IsSUFBSSxPQUE4QixDQUFDO29CQUNuQyxJQUFNLE9BQU8sR0FBaUIsSUFBSSxPQUFPLENBQUMsVUFBQyxHQUFHLElBQU8sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV2RSxLQUFLLENBQUMsR0FBRyxDQUFDO3dCQUNSLFVBQVUsQ0FBQzs0QkFDVCxVQUFVLENBQUM7Z0NBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3pCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDUixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxDQUFDLENBQUM7b0JBRUgsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0JBQ2IseUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIseUNBQXlDOzRCQUN6Qyx5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEQsQ0FBQzt3QkFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdHRCxvQkE2R0M7QUFFRDtJQUNFLDJCQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IscUJBQUUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFRLHlCQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakYscUJBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNuQixjQUFjLENBQUMsY0FBUSx3QkFBaUIsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILDJCQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IscUJBQUUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFRLHlCQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakYscUJBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNuQixjQUFjLENBQUMsY0FBUSxVQUFVLENBQUMsY0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCx5QkFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsMkJBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixxQkFBRSxDQUFDLGlCQUFpQixFQUFFLGNBQVEseUJBQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRixxQkFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLGNBQWMsQ0FBQyxjQUFRLHdCQUFpQixDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsY0FBYyxDQUFDLGNBQVEsVUFBVSxDQUFDLGNBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQseUJBQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILDJCQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLHFCQUFFLENBQUMsMkRBQTJELEVBQUU7WUFDOUQseUJBQU0sQ0FBQyxnQkFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELGNBQWMsQ0FBQyxjQUFRLHlCQUFNLENBQUMsZ0JBQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztJQUVILDJCQUFRLENBQUMsS0FBSyxFQUFFO1FBQ2QscUJBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxTQUFTLENBQUMsY0FBUSx5QkFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVELFNBQVMsQ0FBQyxjQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsa0RBQWtELEVBQ2xELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsU0FBUyxDQUFDLGNBQVEseUJBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQU0sT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRSxTQUFTLENBQUMsY0FBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwQixxQkFBRSxDQUFDLDZDQUE2QyxFQUM3Qyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELGNBQWMsQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1lBQ2hELFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2dCQUM3RSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsK0NBQStDLEVBQy9DLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsc0ZBQXNGO1lBQ3RGLDZEQUE2RDtZQUU3RCxjQUFjLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUVoRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2dCQUMvQixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLENBQUM7b0JBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxzQkFBb0IsS0FBTyxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNkLGdEQUFnRDt3QkFDaEQsY0FBYyxDQUFDLGNBQVEsd0JBQWlCLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxDQUFDO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU8sQ0FDSix5REFBeUQ7b0JBQ3pELGdEQUFnRCxDQUFDLENBQUM7Z0JBQzFELEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwQixxQkFBRSxDQUFDLGlDQUFpQyxFQUNqQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELGNBQWMsQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1lBRWhELFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2dCQUM3RSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIsc0JBQUcsQ0FBQyxvRUFBb0UsRUFDcEUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCx1RUFBdUU7WUFDdkUsdUVBQXVFO1lBRXZFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztnQkFDekIsSUFBSSxFQUFFO29CQUNKLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFBQyxNQUFNLHFDQUFxQyxDQUFDO29CQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN2Qix3QkFBaUIsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1QixTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7Z0JBQy9CLElBQUksRUFBRTtvQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7d0JBQUMsTUFBTSxxQ0FBcUMsQ0FBQztvQkFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUM3Qix3QkFBaUIsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0osRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUFDLE1BQU0scUNBQXFDLENBQUM7b0JBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3JCLHdCQUFpQixDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVCLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxTQUFTLENBQUMsY0FBUSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhELFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2dCQUM3RSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFckIscUJBQUUsQ0FBQyxtRUFBbUUsRUFDbkUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUVoRCxtRUFBbUU7WUFDbkUsMEVBQTBFO1lBQzFFLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztZQUNyQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2dCQUMvQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUMvQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7d0JBQUMsTUFBTSxDQUFDO29CQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLGNBQVEsd0JBQWlCLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNoQixPQUFPLENBQ0oseURBQXlEO29CQUN6RCxnREFBZ0QsQ0FBQyxDQUFDO2dCQUMxRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyx1RUFBdUUsRUFDdkUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUVoRCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztnQkFDdkIsSUFBSSxFQUFFO29CQUNKLGdCQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDM0IsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDaEIsT0FBTyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7Z0JBQzFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyxvRkFBb0YsRUFDcEYseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUM7Z0JBQ2IsU0FBUyxDQUFDO29CQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3RCLHdCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQztnQkFDUiw4REFBOEQ7Z0JBQzlELHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNoQixPQUFPLENBQUMsbUVBQW1FLENBQUMsQ0FBQztnQkFDbEYsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsb0VBQW9FLEVBQ3BFLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsY0FBYyxDQUFDO2dCQUNiLFNBQVMsQ0FBQztvQkFDUixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDO3dCQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3ZCLHdCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNoQixPQUFPLENBQ0osOEZBQThGLENBQUMsQ0FBQztnQkFDeEcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsa0dBQWtHLEVBQ2xHLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsY0FBYyxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUM7WUFFdEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQztnQkFDL0IsSUFBSSxFQUFFO29CQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztvQkFDckMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3hDLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU8sQ0FDSixvSEFBb0gsQ0FBQyxDQUFDO2dCQUM5SCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyxpRkFBaUYsRUFDakYseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxjQUFjLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztZQUNqRCxjQUFjLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztZQUVqRCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU8sQ0FDSiw0RkFBNEYsQ0FBQyxDQUFDO2dCQUN0RyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyx3RUFBd0UsRUFDeEUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxJQUFJLFFBQWtDLENBQUM7WUFDdkMsSUFBSSxRQUF5QixDQUFDO1lBQzlCLElBQUksUUFBa0MsQ0FBQztZQUN2QyxJQUFJLFFBQXlCLENBQUM7WUFFOUIsY0FBYyxDQUFDO2dCQUNiLFNBQVMsQ0FBQztvQkFDUixRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVuRCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDakMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxjQUFjLENBQUM7Z0JBQ2IsU0FBUyxDQUFDO29CQUNSLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZCxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU8sQ0FDSiwyR0FBMkcsQ0FBQyxDQUFDO2dCQUNySCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyxtREFBbUQsRUFDbkQseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxTQUFTLENBQUMsY0FBUSxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUQsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsdUdBQXVHLEVBQ3ZHLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsSUFBSSxPQUF3QyxDQUFDO1lBQzdDLElBQUksT0FBNkIsQ0FBQztZQUVsQyxTQUFTLENBQUM7Z0JBQ1IsZ0JBQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUNoQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQWMsVUFBQSxHQUFHLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxDQUFDO1lBRUgsY0FBYyxDQUFDO2dCQUNiLFNBQVMsQ0FBQztvQkFDUixnQkFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IsZ0JBQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDaEIsT0FBTztnQkFDSixzQ0FBc0M7Z0JBQ3RDLDBDQUEwQztvQkFDMUMsc0NBQXNDO29CQUN0QyxzQ0FBc0M7b0JBQ3RDLDBEQUEwRDtvQkFDMUQsd0VBQXdFO29CQUN4RSwrQ0FBK0MsQ0FBQyxDQUFDO2dCQUN6RCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEIscUJBQUUsQ0FBQyx5RkFBeUY7WUFDckYsbURBQW1ELEVBQ3ZELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsY0FBYyxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUM7WUFFaEQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7Z0JBQy9CLElBQUksRUFBRTtvQkFDSixJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7b0JBRXBDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDVCxLQUFLLENBQUMsR0FBRyxDQUFDOzRCQUNSLHdCQUFpQixDQUFDO2dDQUNoQixHQUFHLEdBQUcsSUFBSSxDQUFDO2dDQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs0QkFDaEMsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3BDLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU87Z0JBQ0osbUNBQW1DO2dCQUNuQyxxRkFBcUY7b0JBQ3JGLHlFQUF5RTtvQkFDekUsK0ZBQStGLENBQUMsQ0FBQztnQkFDekcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsdUdBQXVHO1lBQ25HLDRCQUE0QixFQUNoQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELGNBQWMsQ0FBQztnQkFDYixTQUFTLENBQUM7b0JBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUM5Qix3QkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztnQkFDdEQsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2dCQUMvQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO3dCQUNoRCxLQUFLLENBQUMsR0FBRyxDQUFDOzRCQUNSLHdCQUFpQixDQUFDO2dDQUNoQixHQUFHLEdBQUcsSUFBSSxDQUFDO2dDQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQzs0QkFDakQsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3BDLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxTQUFTLENBQUM7Z0JBQ1IseUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2hCLE9BQU87Z0JBQ0osMkRBQTJEO2dCQUMzRCwrSkFBK0o7b0JBQy9KLGlFQUFpRTtvQkFDakUsZ0hBQWdILENBQUMsQ0FBQztnQkFDMUgsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsa0ZBQWtGLEVBQ2xGLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsY0FBYyxDQUFDO2dCQUNiLFNBQVMsQ0FBQztvQkFDUixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0QixlQUFlO3lCQUNWLElBQUksQ0FBQyxVQUFDLENBQUM7d0JBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDekIsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixDQUFDLENBQUM7eUJBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFFNUIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3pCLElBQUksRUFBRTtvQkFDSixJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO3dCQUN4QyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQVEsd0JBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0UsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDekIsQ0FBQztvQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzlCLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2dCQUMvQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQzt3QkFDOUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFRLHdCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JGLGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNoQixPQUFPO2dCQUNKLG1EQUFtRDtnQkFDbkQsK0VBQStFO29CQUMvRSxpRUFBaUU7b0JBQ2pFLHNCQUFzQjtvQkFDdEIsNkNBQTZDO29CQUM3Qyx3RkFBd0Y7b0JBQ3hGLGdEQUFnRDtvQkFDaEQscUZBQXFGO29CQUNyRix1REFBdUQ7b0JBQ3ZELDhHQUE4RyxDQUFDLENBQUM7Z0JBQ3hILEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwQixxQkFBRSxDQUFDLHNGQUFzRixFQUN0Rix5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELElBQUksUUFBeUMsQ0FBQztZQUM5QyxJQUFJLFFBQXlCLENBQUM7WUFDOUIsSUFBSSxRQUF5QyxDQUFDO1lBQzlDLElBQUksUUFBeUIsQ0FBQztZQUU5QixjQUFjLENBQUM7Z0JBQ2IsU0FBUyxDQUFDO29CQUNSLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBYyxVQUFBLEdBQUcsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBYyxVQUFBLEdBQUcsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILGNBQWMsQ0FBQyxjQUFRLFNBQVMsQ0FBQyxjQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBFLGNBQWMsQ0FBQyxjQUFRLFNBQVMsQ0FBQyxjQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBFLFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDaEIsT0FBTztnQkFDSixnQkFBZ0I7Z0JBQ2hCLHFEQUFxRDtvQkFDckQsaUJBQWlCO29CQUNqQixrREFBa0Q7b0JBQ2xELGdCQUFnQjtvQkFDaEIsZ0RBQWdELENBQUMsQ0FBQztnQkFDMUQsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsa0dBQWtHLEVBQ2xHLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsY0FBYyxDQUFDO2dCQUNiLFNBQVMsQ0FBQztvQkFDUixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0Qix3QkFBaUIsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbkIsd0JBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNoQixPQUFPLENBQ0osNEVBQTRFLENBQUMsQ0FBQztnQkFDdEYsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsc0ZBQXNGLEVBQ3RGLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsSUFBSSxPQUFxQixDQUFDO1lBRTFCLGNBQWMsQ0FBQztnQkFDYixTQUFTLENBQUM7b0JBQ1IsS0FBSyxDQUFDLGlCQUFpQixDQUNuQixjQUFRLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU3RSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQztnQkFDUix5QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDaEIsT0FBTyxDQUNKLG9EQUFvRDtvQkFDcEQsc0RBQXNELENBQUMsQ0FBQztnQkFDaEUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsMkJBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIscUJBQUUsQ0FBQywwRUFBMEUsRUFDMUUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxTQUFTLENBQUM7Z0JBQ1IsSUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXBDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBUSxNQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU3Qyx5QkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLHlCQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsbUZBQW1GLEVBQ25GLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsU0FBUyxDQUFDO2dCQUNSLElBQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyx5QkFBTSxDQUFDLGNBQU0sT0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQVEsTUFBTSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFekUseUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBCLHFCQUFFLENBQUMsZ0RBQWdELEVBQ2hELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsSUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckMsU0FBUyxDQUFDLGNBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFRLHdCQUFpQixDQUFDLGNBQVEsTUFBTSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUYsU0FBUyxDQUFDO2dCQUNSLHlCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IseUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILDJCQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsMkJBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxNQUFjLENBQUM7WUFFbkIsNkJBQVUsQ0FBQyx5QkFBTSxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxFQUFFLFVBQUMsT0FBZTtnQkFDMUMsdUNBQXVDO2dCQUN2QyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFSixxQkFBRSxDQUFDLDBEQUEwRCxFQUFFLG1CQUFTLENBQUM7Z0JBQ3BFLElBQUksTUFBTSxHQUFXLElBQU0sQ0FBQztnQkFDNUIsc0ZBQXNGO2dCQUN0RixNQUFNLENBQUMsR0FBRyxDQUFDO29CQUNULE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsTUFBTSxHQUFHLENBQUMsRUFBVixDQUFVLENBQUMsQ0FBQztvQkFDakQseUJBQWUsRUFBRSxDQUFDO2dCQUNwQixDQUFDLENBQUMsQ0FBQztnQkFDSCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsMkJBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksV0FBbUIsQ0FBQztnQkFDeEIsSUFBTSx1Q0FBdUMsR0FBRyxDQUFDLENBQUM7Z0JBRWxELDZCQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsSUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTVDLHFCQUFFLENBQUMsc0RBQXNELEVBQUUsZUFBSyxDQUFDO29CQUM1RCxrRkFBa0Y7b0JBQ2xGLE1BQU0sQ0FBQyxHQUFHLENBQUM7d0JBQ1QsVUFBVSxDQUFDOzRCQUNULE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsV0FBVyxHQUFHLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQzt3QkFDeEQsQ0FBQyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7b0JBQzlDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsU0FBUyxDQUFDLGNBQVEseUJBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIn0=