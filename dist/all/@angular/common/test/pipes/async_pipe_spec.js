"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var spies_1 = require("../spies");
function main() {
    testing_internal_1.describe('AsyncPipe', function () {
        testing_internal_1.describe('Observable', function () {
            var emitter;
            var pipe;
            var ref;
            var message = {};
            testing_internal_1.beforeEach(function () {
                emitter = new core_1.EventEmitter();
                ref = new spies_1.SpyChangeDetectorRef();
                pipe = new common_1.AsyncPipe(ref);
            });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return null when subscribing to an observable', function () { testing_internal_1.expect(pipe.transform(emitter)).toBe(null); });
                testing_internal_1.it('should return the latest available value wrapped', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(emitter);
                    emitter.emit(message);
                    setTimeout(function () {
                        testing_internal_1.expect(pipe.transform(emitter)).toEqual(new core_1.WrappedValue(message));
                        async.done();
                    }, 0);
                }));
                testing_internal_1.it('should return same value when nothing has changed since the last call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(emitter);
                    emitter.emit(message);
                    setTimeout(function () {
                        pipe.transform(emitter);
                        testing_internal_1.expect(pipe.transform(emitter)).toBe(message);
                        async.done();
                    }, 0);
                }));
                testing_internal_1.it('should dispose of the existing subscription when subscribing to a new observable', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(emitter);
                    var newEmitter = new core_1.EventEmitter();
                    testing_internal_1.expect(pipe.transform(newEmitter)).toBe(null);
                    emitter.emit(message);
                    // this should not affect the pipe
                    setTimeout(function () {
                        testing_internal_1.expect(pipe.transform(newEmitter)).toBe(null);
                        async.done();
                    }, 0);
                }));
                testing_internal_1.it('should request a change detection check upon receiving a new value', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(emitter);
                    emitter.emit(message);
                    setTimeout(function () {
                        testing_internal_1.expect(ref.spy('markForCheck')).toHaveBeenCalled();
                        async.done();
                    }, 10);
                }));
            });
            testing_internal_1.describe('ngOnDestroy', function () {
                testing_internal_1.it('should do nothing when no subscription', function () { testing_internal_1.expect(function () { return pipe.ngOnDestroy(); }).not.toThrow(); });
                testing_internal_1.it('should dispose of the existing subscription', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(emitter);
                    pipe.ngOnDestroy();
                    emitter.emit(message);
                    setTimeout(function () {
                        testing_internal_1.expect(pipe.transform(emitter)).toBe(null);
                        async.done();
                    }, 0);
                }));
            });
        });
        testing_internal_1.describe('Promise', function () {
            var message = new Object();
            var pipe;
            var resolve;
            var reject;
            var promise;
            var ref;
            // adds longer timers for passing tests in IE
            var timer = (dom_adapter_1.getDOM() && browser_util_1.browserDetection.isIE) ? 50 : 10;
            testing_internal_1.beforeEach(function () {
                promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                ref = new spies_1.SpyChangeDetectorRef();
                pipe = new common_1.AsyncPipe(ref);
            });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return null when subscribing to a promise', function () { testing_internal_1.expect(pipe.transform(promise)).toBe(null); });
                testing_internal_1.it('should return the latest available value', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(promise);
                    resolve(message);
                    setTimeout(function () {
                        testing_internal_1.expect(pipe.transform(promise)).toEqual(new core_1.WrappedValue(message));
                        async.done();
                    }, timer);
                }));
                testing_internal_1.it('should return unwrapped value when nothing has changed since the last call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(promise);
                    resolve(message);
                    setTimeout(function () {
                        pipe.transform(promise);
                        testing_internal_1.expect(pipe.transform(promise)).toBe(message);
                        async.done();
                    }, timer);
                }));
                testing_internal_1.it('should dispose of the existing subscription when subscribing to a new promise', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    pipe.transform(promise);
                    promise = new Promise(function () { });
                    testing_internal_1.expect(pipe.transform(promise)).toBe(null);
                    // this should not affect the pipe, so it should return WrappedValue
                    resolve(message);
                    setTimeout(function () {
                        testing_internal_1.expect(pipe.transform(promise)).toBe(null);
                        async.done();
                    }, timer);
                }));
                testing_internal_1.it('should request a change detection check upon receiving a new value', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var markForCheck = ref.spy('markForCheck');
                    pipe.transform(promise);
                    resolve(message);
                    setTimeout(function () {
                        testing_internal_1.expect(markForCheck).toHaveBeenCalled();
                        async.done();
                    }, timer);
                }));
                testing_internal_1.describe('ngOnDestroy', function () {
                    testing_internal_1.it('should do nothing when no source', function () { testing_internal_1.expect(function () { return pipe.ngOnDestroy(); }).not.toThrow(); });
                    testing_internal_1.it('should dispose of the existing source', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                        pipe.transform(promise);
                        testing_internal_1.expect(pipe.transform(promise)).toBe(null);
                        resolve(message);
                        setTimeout(function () {
                            testing_internal_1.expect(pipe.transform(promise)).toEqual(new core_1.WrappedValue(message));
                            pipe.ngOnDestroy();
                            testing_internal_1.expect(pipe.transform(promise)).toBe(null);
                            async.done();
                        }, timer);
                    }));
                });
            });
        });
        testing_internal_1.describe('null', function () {
            testing_internal_1.it('should return null when given null', function () {
                var pipe = new common_1.AsyncPipe(null);
                testing_internal_1.expect(pipe.transform(null)).toEqual(null);
            });
        });
        testing_internal_1.describe('other types', function () {
            testing_internal_1.it('should throw when given an invalid object', function () {
                var pipe = new common_1.AsyncPipe(null);
                testing_internal_1.expect(function () { return pipe.transform('some bogus object'); }).toThrowError();
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfcGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvcGlwZXMvYXN5bmNfcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQTBDO0FBQzFDLHNDQUF5RDtBQUN6RCwrRUFBd0g7QUFDeEgsNkVBQXFFO0FBQ3JFLG1GQUFvRjtBQUVwRixrQ0FBOEM7QUFFOUM7SUFDRSwyQkFBUSxDQUFDLFdBQVcsRUFBRTtRQUVwQiwyQkFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLE9BQTBCLENBQUM7WUFDL0IsSUFBSSxJQUFlLENBQUM7WUFDcEIsSUFBSSxHQUFRLENBQUM7WUFDYixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFbkIsNkJBQVUsQ0FBQztnQkFDVCxPQUFPLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7Z0JBQzdCLEdBQUcsR0FBRyxJQUFJLDRCQUFvQixFQUFFLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxJQUFJLGtCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7WUFFSCwyQkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIscUJBQUUsQ0FBQyxzREFBc0QsRUFDdEQsY0FBUSx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFMUQscUJBQUUsQ0FBQyxrREFBa0QsRUFDbEQseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtvQkFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFdEIsVUFBVSxDQUFD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