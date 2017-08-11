"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _global = (typeof window === 'undefined' ? global : window);
/**
 * Wraps a test function in an asynchronous test zone. The test will automatically
 * complete when all asynchronous calls within this zone are done. Can be used
 * to wrap an {@link inject} call.
 *
 * Example:
 *
 * ```
 * it('...', async(inject([AClass], (object) => {
 *   object.doSomething.then(() => {
 *     expect(...);
 *   })
 * });
 * ```
 *
 * @stable
 */
function async(fn) {
    // If we're running using the Jasmine test framework, adapt to call the 'done'
    // function when asynchronous activity is finished.
    if (_global.jasmine) {
        // Not using an arrow function to preserve context passed from call site
        return function (done) {
            if (!done) {
                // if we run beforeEach in @angular/core/testing/testing_internal then we get no done
                // fake it here and assume sync.
                done = function () { };
                done.fail = function (e) { throw e; };
            }
            runInTestZone(fn, this, done, function (err) {
                if (typeof err === 'string') {
                    return done.fail(new Error(err));
                }
                else {
                    done.fail(err);
                }
            });
        };
    }
    // Otherwise, return a promise which will resolve when asynchronous activity
    // is finished. This will be correctly consumed by the Mocha framework with
    // it('...', async(myFn)); or can be used in a custom framework.
    // Not using an arrow function to preserve context passed from call site
    return function () {
        var _this = this;
        return new Promise(function (finishCallback, failCallback) {
            runInTestZone(fn, _this, finishCallback, failCallback);
        });
    };
}
exports.async = async;
function runInTestZone(fn, context, finishCallback, failCallback) {
    var currentZone = Zone.current;
    var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
    if (AsyncTestZoneSpec === undefined) {
        throw new Error('AsyncTestZoneSpec is needed for the async() test helper but could not be found. ' +
            'Please make sure that your environment includes zone.js/dist/async-test.js');
    }
    var ProxyZoneSpec = Zone['ProxyZoneSpec'];
    if (ProxyZoneSpec === undefined) {
        throw new Error('ProxyZoneSpec is needed for the async() test helper but could not be found. ' +
            'Please make sure that your environment includes zone.js/dist/proxy.js');
    }
    var proxyZoneSpec = ProxyZoneSpec.get();
    ProxyZoneSpec.assertPresent();
    // We need to create the AsyncTestZoneSpec outside the ProxyZone.
    // If we do it in ProxyZone then we will get to infinite recursion.
    var proxyZone = Zone.current.getZoneWith('ProxyZoneSpec');
    var previousDelegate = proxyZoneSpec.getDelegate();
    proxyZone.parent.run(function () {
        var testZoneSpec = new AsyncTestZoneSpec(function () {
            // Need to restore the original zone.
            currentZone.run(function () {
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                finishCallback();
            });
        }, function (error) {
            // Need to restore the original zone.
            currentZone.run(function () {
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                failCallback(error);
            });
        }, 'test');
        proxyZoneSpec.setDelegate(testZoneSpec);
    });
    return Zone.current.runGuarded(fn, context);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsSUFBTSxPQUFPLEdBQVEsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBRXZFOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsZUFBc0IsRUFBWTtJQUNoQyw4RUFBOEU7SUFDOUUsbURBQW1EO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLHdFQUF3RTtRQUN4RSxNQUFNLENBQUMsVUFBUyxJQUFTO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVixxRkFBcUY7Z0JBQ3JGLGdDQUFnQztnQkFDaEMsSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVMsQ0FBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFDRCxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBQyxHQUFRO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUM7SUFDRCw0RUFB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