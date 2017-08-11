"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function devModeEqual(a, b) {
    var isListLikeIterableA = isListLikeIterable(a);
    var isListLikeIterableB = isListLikeIterable(b);
    if (isListLikeIterableA && isListLikeIterableB) {
        return areIterablesEqual(a, b, devModeEqual);
    }
    else {
        var isAObject = a && (typeof a === 'object' || typeof a === 'function');
        var isBObject = b && (typeof b === 'object' || typeof b === 'function');
        if (!isListLikeIterableA && isAObject && !isListLikeIterableB && isBObject) {
            return true;
        }
        else {
            return util_1.looseIdentical(a, b);
        }
    }
}
exports.devModeEqual = devModeEqual;
/**
 * Indicates that the result of a {@link Pipe} transformation has changed even though the
 * reference
 * has not changed.
 *
 * The wrapped value will be unwrapped by change detection, and the unwrapped value will be stored.
 *
 * Example:
 *
 * ```
 * if (this._latestValue === this._latestReturnedValue) {
 *    return this._latestReturnedValue;
 *  } else {
 *    this._latestReturnedValue = this._latestValue;
 *    return WrappedValue.wrap(this._latestValue); // this will force update
 *  }
 * ```
 * @stable
 */
var WrappedValue = (function () {
    function WrappedValue(wrapped) {
        this.wrapped = wrapped;
    }
    WrappedValue.wrap = function (value) { return new WrappedValue(value); };
    return WrappedValue;
}());
exports.WrappedValue = WrappedValue;
/**
 * Helper class for unwrapping WrappedValue s
 */
var ValueUnwrapper = (function () {
    function ValueUnwrapper() {
        this.hasWrappedValue = false;
    }
    ValueUnwrapper.prototype.unwrap = function (value) {
        if (value instanceof WrappedValue) {
            this.hasWrappedValue = true;
            return value.wrapped;
        }
        return value;
    };
    ValueUnwrapper.prototype.reset = function () { this.hasWrappedValue = false; };
    return ValueUnwrapper;
}());
exports.ValueUnwrapper = ValueUnwrapper;
/**
 * Represents a basic change from a previous to a new value.
 * @stable
 */
var SimpleChange = (function () {
    function SimpleChange(previousValue, currentValue, firstChange) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
        this.firstChange = firstChange;
    }
    /**
     * Check whether the new value is the first value assigned.
     */
    SimpleChange.prototype.isFirstChange = function () { return this.firstChange; };
    return SimpleChange;
}());
exports.SimpleChange = SimpleChange;
function isListLikeIterable(obj) {
    if (!isJsObject(obj))
        return false;
    return Array.isArray(obj) ||
        (!(obj instanceof Map) &&
            util_1.getSymbolIterator() in obj); // JS Iterable have a Symbol.iterator prop
}
exports.isListLikeIterable = isListLikeIterable;
function areIterablesEqual(a, b, comparator) {
    var iterator1 = a[util_1.getSymbolIterator()]();
    var iterator2 = b[util_1.getSymbolIterator()]();
    while (true) {
        var item1 = iterator1.next();
        var item2 = iterator2.next();
        if (item1.done && item2.done)
            return true;
        if (item1.done || item2.done)
            return false;
        if (!comparator(item1.value, item2.value))
            return false;
    }
}
exports.areIterablesEqual = areIterablesEqual;
function iterateListLike(obj, fn) {
    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            fn(obj[i]);
        }
    }
    else {
        var iterator = obj[util_1.getSymbolIterator()]();
        var item = void 0;
        while (!((item = iterator.next()).done)) {
            fn(item.value);
        }
    }
}
exports.iterateListLike = iterateListLike;
function isJsObject(o) {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}
exports.isJsObject = isJsObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnQ0FBMEQ7QUFFMUQsc0JBQTZCLENBQU0sRUFBRSxDQUFNO0lBQ3pDLElBQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsSUFBTSxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLElBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQztRQUMxRSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixJQUFJLFNBQVMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxxQkFBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFkRCxvQ0FjQztB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