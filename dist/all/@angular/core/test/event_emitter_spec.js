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
var event_emitter_1 = require("../src/event_emitter");
function main() {
    testing_internal_1.describe('EventEmitter', function () {
        var emitter;
        testing_internal_1.beforeEach(function () { emitter = new event_emitter_1.EventEmitter(); });
        testing_internal_1.it('should call the next callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({
                next: function (value) {
                    testing_internal_1.expect(value).toEqual(99);
                    async.done();
                }
            });
            emitter.emit(99);
        }));
        testing_internal_1.it('should call the throw callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({
                next: function () { },
                error: function (error) {
                    testing_internal_1.expect(error).toEqual('Boom');
                    async.done();
                }
            });
            emitter.error('Boom');
        }));
        testing_internal_1.it('should work when no throw callback is provided', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({ next: function () { }, error: function (_) { async.done(); } });
            emitter.error('Boom');
        }));
        testing_internal_1.it('should call the return callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({ next: function () { }, error: function (_) { }, complete: function () { async.done(); } });
            emitter.complete();
        }));
        testing_internal_1.it('should subscribe to the wrapper synchronously', function () {
            var called = false;
            emitter.subscribe({ next: function (value) { called = true; } });
            emitter.emit(99);
            testing_internal_1.expect(called).toBe(true);
        });
        testing_internal_1.it('delivers next and error events synchronously', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            emitter.subscribe({
                next: function (x) {
                    log.push(x);
                    testing_internal_1.expect(log).toEqual([1, 2]);
                },
                error: function (err) {
                    log.push(err);
                    testing_internal_1.expect(log).toEqual([1, 2, 3, 4]);
                    async.done();
                }
            });
            log.push(1);
            emitter.emit(2);
            log.push(3);
            emitter.error(4);
            log.push(5);
        }));
        testing_internal_1.it('delivers next and complete events synchronously', function () {
            var log = [];
            emitter.subscribe({
                next: function (x) {
                    log.push(x);
                    testing_internal_1.expect(log).toEqual([1, 2]);
                },
                error: null,
                complete: function () {
                    log.push(4);
                    testing_internal_1.expect(log).toEqual([1, 2, 3, 4]);
                }
            });
            log.push(1);
            emitter.emit(2);
            log.push(3);
            emitter.complete();
            log.push(5);
            testing_internal_1.expect(log).toEqual([1, 2, 3, 4, 5]);
        });
        testing_internal_1.it('delivers events asynchronously when forced to async mode', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var e = new event_emitter_1.EventEmitter(true);
            var log = [];
            e.subscribe(function (x) {
                log.push(x);
                testing_internal_1.expect(log).toEqual([1, 3, 2]);
                async.done();
            });
            log.push(1);
            e.emit(2);
            log.push(3);
        }));
        testing_internal_1.it('reports whether it has subscribers', function () {
            var e = new event_emitter_1.EventEmitter(false);
            testing_internal_1.expect(e.observers.length > 0).toBe(false);
            e.subscribe({ next: function () { } });
            testing_internal_1.expect(e.observers.length > 0).toBe(true);
        });
        // TODO: vsavkin: add tests cases
        // should call dispose on the subscription if generator returns {done:true}
        // should call dispose on the subscription on throw
        // should call dispose on the subscription on return
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZW1pdHRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2V2ZW50X2VtaXR0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUF3SDtBQUN4SCxzREFBa0Q7QUFFbEQ7SUFDRSwyQkFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixJQUFJLE9BQTBCLENBQUM7UUFFL0IsNkJBQVUsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFJLDRCQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBELHFCQUFFLENBQUMsK0JBQStCLEVBQy9CLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDaEIsSUFBSSxFQUFFLFVBQUMsS0FBVTtvQkFDZix5QkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLGdDQUFnQyxFQUNoQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELE9BQU8sQ0FBQyxTQUFTLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxjQUFPLENBQUM7Z0JBQ2QsS0FBSyxFQUFFLFVBQUMsS0FBVTtvQkFDaEIseUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzlCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lB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