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
var fromPromise_1 = require("rxjs/observable/fromPromise");
var of_1 = require("rxjs/observable/of");
var concatAll_1 = require("rxjs/operator/concatAll");
var every_1 = require("rxjs/operator/every");
var l = require("rxjs/operator/last");
var map_1 = require("rxjs/operator/map");
var mergeAll_1 = require("rxjs/operator/mergeAll");
var shared_1 = require("../shared");
function shallowEqualArrays(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (!shallowEqual(a[i], b[i]))
            return false;
    }
    return true;
}
exports.shallowEqualArrays = shallowEqualArrays;
function shallowEqual(a, b) {
    var k1 = Object.keys(a);
    var k2 = Object.keys(b);
    if (k1.length != k2.length) {
        return false;
    }
    var key;
    for (var i = 0; i < k1.length; i++) {
        key = k1[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
/**
 * Flattens single-level nested arrays.
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
exports.flatten = flatten;
/**
 * Return the last element of an array.
 */
function last(a) {
    return a.length > 0 ? a[a.length - 1] : null;
}
exports.last = last;
/**
 * Verifys all booleans in an array are `true`.
 */
function and(bools) {
    return !bools.some(function (v) { return !v; });
}
exports.and = and;
function forEach(map, callback) {
    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            callback(map[prop], prop);
        }
    }
}
exports.forEach = forEach;
function waitForMap(obj, fn) {
    if (Object.keys(obj).length === 0) {
        return of_1.of({});
    }
    var waitHead = [];
    var waitTail = [];
    var res = {};
    forEach(obj, function (a, k) {
        var mapped = map_1.map.call(fn(k, a), function (r) { return res[k] = r; });
        if (k === shared_1.PRIMARY_OUTLET) {
            waitHead.push(mapped);
        }
        else {
            waitTail.push(mapped);
        }
    });
    var concat$ = concatAll_1.concatAll.call(of_1.of.apply(void 0, waitHead.concat(waitTail)));
    var last$ = l.last.call(concat$);
    return map_1.map.call(last$, function () { return res; });
}
exports.waitForMap = waitForMap;
/**
 * ANDs Observables by merging all input observables, reducing to an Observable verifying all
 * input Observables return `true`.
 */
function andObservables(observables) {
    var merged$ = mergeAll_1.mergeAll.call(observables);
    return every_1.every.call(merged$, function (result) { return result === true; });
}
exports.andObservables = andObservables;
function wrapIntoObservable(value) {
    if (core_1.ɵisObservable(value)) {
        return value;
    }
    if (core_1.ɵisPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return fromPromise_1.fromPromise(Promise.resolve(value));
    }
    return of_1.of(value);
}
exports.wrapIntoObservable = wrapIntoObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFzRztBQUV0RywyREFBd0Q7QUFDeEQseUNBQXVDO0FBQ3ZDLHFEQUFrRDtBQUNsRCw2Q0FBMEM7QUFDMUMsc0NBQXdDO0FBQ3hDLHlDQUFzQztBQUN0QyxtREFBZ0Q7QUFDaEQsb0NBQXlDO0FBRXpDLDRCQUFtQyxDQUFRLEVBQUUsQ0FBUTtJQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDOUMsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBTkQsZ0RBTUM7QUFFRCxzQkFBNkIsQ0FBcUIsRUFBRSxDQUFxQjtJQUN2RSxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsS0FBSyxDQUFD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