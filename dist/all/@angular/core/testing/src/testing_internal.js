"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("@angular/core/src/util");
var async_test_completer_1 = require("./async_test_completer");
var test_bed_1 = require("./test_bed");
var async_test_completer_2 = require("./async_test_completer");
exports.AsyncTestCompleter = async_test_completer_2.AsyncTestCompleter;
var test_bed_2 = require("./test_bed");
exports.inject = test_bed_2.inject;
__export(require("./logger"));
__export(require("./ng_zone_mock"));
exports.proxy = function (t) { return t; };
var _global = (typeof window === 'undefined' ? util_1.global : window);
exports.afterEach = _global.afterEach;
exports.expect = _global.expect;
var jsmBeforeEach = _global.beforeEach;
var jsmDescribe = _global.describe;
var jsmDDescribe = _global.fdescribe;
var jsmXDescribe = _global.xdescribe;
var jsmIt = _global.it;
var jsmIIt = _global.fit;
var jsmXIt = _global.xit;
var runnerStack = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
var globalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
var testBed = test_bed_1.getTestBed();
/**
 * Mechanism to run `beforeEach()` functions of Angular tests.
 *
 * Note: Jasmine own `beforeEach` is used by this library to handle DI providers.
 */
var BeforeEachRunner = (function () {
    function BeforeEachRunner(_parent) {
        this._parent = _parent;
        this._fns = [];
    }
    BeforeEachRunner.prototype.beforeEach = function (fn) { this._fns.push(fn); };
    BeforeEachRunner.prototype.run = function () {
        if (this._parent)
            this._parent.run();
        this._fns.forEach(function (fn) { fn(); });
    };
    return BeforeEachRunner;
}());
// Reset the test providers before each test
jsmBeforeEach(function () { testBed.resetTestingModule(); });
function _describe(jsmFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    var runner = new BeforeEachRunner(parentRunner);
    runnerStack.push(runner);
    var suite = jsmFn.apply(void 0, args);
    runnerStack.pop();
    return suite;
}
function describe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDescribe].concat(args));
}
exports.describe = describe;
function ddescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDDescribe].concat(args));
}
exports.ddescribe = ddescribe;
function xdescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmXDescribe].concat(args));
}
exports.xdescribe = xdescribe;
function beforeEach(fn) {
    if (runnerStack.length > 0) {
        // Inside a describe block, beforeEach() uses a BeforeEachRunner
        runnerStack[runnerStack.length - 1].beforeEach(fn);
    }
    else {
        // Top level beforeEach() are delegated to jasmine
        jsmBeforeEach(fn);
    }
}
exports.beforeEach = beforeEach;
/**
 * Allows overriding default providers defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * Example:
 *
 *   beforeEachProviders(() => [
 *     {provide: Compiler, useClass: MockCompiler},
 *     {provide: SomeToken, useValue: myValue},
 *   ]);
 */
function beforeEachProviders(fn) {
    jsmBeforeEach(function () {
        var providers = fn();
        if (!providers)
            return;
        testBed.configureTestingModule({ providers: providers });
    });
}
exports.beforeEachProviders = beforeEachProviders;
function _it(jsmFn, name, testFn, testTimeOut) {
    if (runnerStack.length == 0) {
        // This left here intentionally, as we should never get here, and it aids debugging.
        debugger;
        throw new Error('Empty Stack!');
    }
    var runner = runnerStack[runnerStack.length - 1];
    var timeOut = Math.max(globalTimeOut, testTimeOut);
    jsmFn(name, function (done) {
        var completerProvider = {
            provide: async_test_completer_1.AsyncTestCompleter,
            useFactory: function () {
                // Mark the test as async when an AsyncTestCompleter is injected in an it()
                return new async_test_completer_1.AsyncTestCompleter();
            }
        };
        testBed.configureTestingModule({ providers: [completerProvider] });
        runner.run();
        if (testFn.length == 0) {
            var retVal = testFn();
            if (core_1.ɵisPromise(retVal)) {
                // Asynchronous test function that returns a Promise - wait for completion.
                retVal.then(done, done.fail);
            }
            else {
                // Synchronous test function - complete immediately.
                done();
            }
        }
        else {
            // Asynchronous test function that takes in 'done' parameter.
            testFn(done);
        }
    }, timeOut);
}
function it(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIt, name, fn, timeOut);
}
exports.it = it;
function xit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmXIt, name, fn, timeOut);
}
exports.xit = xit;
function iit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIIt, name, fn, timeOut);
}
exports.iit = iit;
var SpyObject = (function () {
    function SpyObject(type) {
        if (type) {
            for (var prop in type.prototype) {
                var m = null;
                try {
                    m = type.prototype[prop];
                }
                catch (e) {
                    // As we are creating spys for abstract classes,
                    // these classes might have getters that throw when they are accessed.
                    // As we are only auto creating spys for methods, this
                    // should not matter.
                }
                if (typeof m === 'function') {
                    this.spy(prop);
                }
            }
        }
    }
    SpyObject.prototype.spy = function (name) {
        if (!this[name]) {
            this[name] = jasmine.createSpy(name);
        }
        return this[name];
    };
    SpyObject.prototype.prop = function (name, value) { this[name] = value; };
    SpyObject.stub = function (object, config, overrides) {
        if (object === void 0) { object = null; }
        if (config === void 0) { config = null; }
        if (overrides === void 0) { overrides = null; }
        if (!(object instanceof SpyObject)) {
            overrides = config;
            config = object;
            object = new SpyObject();
        }
        var m = __assign({}, config, overrides);
        Object.keys(m).forEach(function (key) { object.spy(key).and.returnValue(m[key]); });
        return object;
    };
    return SpyObject;
}());
exports.SpyObject = SpyObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19pbnRlcm5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvdGVzdGluZ19pbnRlcm5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNEO0FBQ3RELCtDQUE4QztBQUU5QywrREFBMEQ7QUFDMUQsdUNBQThDO0FBRTlDLCtEQUEwRDtBQUFsRCxvREFBQSxrQkFBa0IsQ0FBQTtBQUMxQix1Q0FBa0M7QUFBMUIsNEJBQUEsTUFBTSxDQUFBO0FBRWQsOEJBQXlCO0FBQ3pCLG9DQUErQjtBQUVsQixRQUFBLEtBQUssR0FBbUIsVUFBQyxDQUFNLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDO0FBRW5ELElBQU0sT0FBTyxHQUFRLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLGFBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUUxRCxRQUFBLFNBQVMsR0FBYSxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3hDLFFBQUEsTUFBTSxHQUFzQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBRXhFLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDekMsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDdkMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQzNCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFM0IsSUFBTSxXQUFXLEdBQXVCLEVBQUUsQ0FBQztBQUMzQyxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3hDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQztBQUV2RCxJQUFNLE9BQU8sR0FBRyxxQkFBVSxFQUFFLENBQUM7QUFFN0I7Ozs7R0FJRztBQUNIO0lBR0UsMEJBQW9CLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBRnJDLFNBQUksR0FBb0IsRUFBRSxDQUFDO0lBRWEsQ0FBQztJQUVqRCxxQ0FBVSxHQUFWLFVBQVcsRUFBWSxJQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RCw4QkFBRyxHQUFIO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLElBQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQUVELDRDQUE0QztBQUM1QyxhQUFhLENBQUMsY0FBUSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXZELG1CQUFtQixLQUFlO0lBQUUsY0FBYztTQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7UUFBZCw2QkFBYzs7SUFDaEQsSUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNGLElBQU0sTUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQUMsWUFBYyxDQUFDLENBQUM7SUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QixJQUFNLEtBQUssR0FBRyxLQUFLLGVBQUksSUFBSSxDQUFDLENBQUM7SUFDN0IsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7SUFBeUIsY0FBYztTQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7UUFBZCx5QkFBYzs7SUFDckMsTUFBTSxDQUFDLFNBQVMsZ0JBQUMsV0FBVyxTQUFLLElBQUksR0FBRTtBQUN6QyxDQUFDO0FBRkQsNEJBRUM7QUFFRDtJQUEwQixjQUFjO1NBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztRQUFkLHlCQUFjOztJQUN0QyxNQUFNLENBQUMsU0FBUyxnQkFBQyxZQUFZLFNBQUssSUFBSSxHQUFFO0FBQzFDLENBQUM7QUFGRCw4QkFFQztBQUVEO0lBQTBCLGNBQWM7U0FBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1FBQWQseUJBQWM7O0lBQ3RDLE1BQU0sQ0FBQyxTQUFTLGdCQUFDLFlBQVksU0FBSyxJQUFJLEdBQUU7QUFDMUMsQ0FBQztBQUZELDhCQUVDO0FBRUQsb0JBQTJCLEVBQVk7SUFDckMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLGdFQUFnRTtRQUNoRSxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sa0RBQWtEO1FBQ2xELGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQztBQVJELGdDQVFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCw2QkFBb0MsRUFBWTtJQUM5QyxhQUFhLENBQUM7UUFDWixJQUFNLFNBQVMsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN2QixPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFORCxrREFNQztBQUdELGFBQWEsS0FBZSxFQUFFLElBQVksRUFBRSxNQUFnQixFQUFFLFdBQW1CO0lBQy9FLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixvRkFBb0Y7UUFDcEYsUUFBUSxDQUFDO1FBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsSUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFckQsS0FBSyxDQUFDLElBQUksRUFBRSxVQUFDLElBQVM7UUFDcEIsSUFBTSxpQkFBaUIsR0FBRztZQUN4QixPQUFPLEVBQUUseUNBQWtCO1lBQzNCLFVBQVUsRUFBRTtnQkFDViwyRUFBMkU7Z0JBQzNFLE1BQU0sQ0FBQyxJQUFJLHlDQUFrQixFQUFFLENBQUM7WUFDbEMsQ0FBQztTQUNGLENBQUM7UUFDRixPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFYixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBTSxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsaUJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLDJFQUEyRTtnQkFDNUQsTUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixvREFBb0Q7Z0JBQ3BELElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDZEQUE2RDtZQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2QsQ0FBQztBQUVELFlBQW1CLElBQVMsRUFBRSxFQUFPLEVBQUUsT0FBbUI7SUFBbkIsd0JBQUEsRUFBQSxjQUFtQjtJQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxnQkFFQztBQUVELGFBQW9CLElBQVMsRUFBRSxFQUFPLEVBQUUsT0FBbUI7SUFBbkIsd0JBQUEsRUFBQSxjQUFtQjtJQUN6RCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGRCxrQkFFQztBQUVELGFBQW9CLElBQVMsRUFBRSxFQUFPLEVBQUUsT0FBbUI7SUFBbkIsd0JBQUEsRUFBQSxjQUFtQjtJQUN6RCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGRCxrQkFFQztBQUVEO0lBQ0UsbUJBQVksSUFBVTtRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsR0FBRyxDQUFDLENBQUMsSUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxHQUFRLElBQUksQ0FBQztnQkFDbEIsSUFBSSxDQUFDO29CQUNILENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZ0RBQWdEO29CQUNoRCxzRUFBc0U7b0JBQ3RFLHNEQUFzRDtvQkFDdEQscUJBQXFCO2dCQUN2QixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCx1QkFBRyxHQUFILFVBQUksSUFBWTtRQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUUsSUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsTUFBTSxDQUFFLElBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsd0JBQUksR0FBSixVQUFLLElBQVksRUFBRSxLQUFVLElBQUssSUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFeEQsY0FBSSxHQUFYLFVBQVksTUFBa0IsRUFBRSxNQUFrQixFQUFFLFNBQXFCO1FBQTdELHVCQUFBLEVBQUEsYUFBa0I7UUFBRSx1QkFBQSxFQUFBLGFBQWtCO1FBQUUsMEJBQUEsRUFBQSxnQkFBcUI7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2hCLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFFRCxJQUFNLENBQUMsZ0JBQU8sTUFBTSxFQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQXhDWSw4QkFBUyJ9