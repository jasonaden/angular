"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var change_detection_util_1 = require("../change_detection_util");
var DefaultKeyValueDifferFactory = (function () {
    function DefaultKeyValueDifferFactory() {
    }
    DefaultKeyValueDifferFactory.prototype.supports = function (obj) { return obj instanceof Map || change_detection_util_1.isJsObject(obj); };
    /**
     * @deprecated v4.0.0 - ChangeDetectorRef is not used and is no longer a parameter
     */
    DefaultKeyValueDifferFactory.prototype.create = function (cd) {
        return new DefaultKeyValueDiffer();
    };
    return DefaultKeyValueDifferFactory;
}());
exports.DefaultKeyValueDifferFactory = DefaultKeyValueDifferFactory;
var DefaultKeyValueDiffer = (function () {
    function DefaultKeyValueDiffer() {
        this._records = new Map();
        this._mapHead = null;
        // _appendAfter is used in the check loop
        this._appendAfter = null;
        this._previousMapHead = null;
        this._changesHead = null;
        this._changesTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
    }
    Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
        get: function () {
            return this._additionsHead !== null || this._changesHead !== null ||
                this._removalsHead !== null;
        },
        enumerable: true,
        configurable: true
    });
    DefaultKeyValueDiffer.prototype.forEachItem = function (fn) {
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
            fn(record);
        }
    };
    DefaultKeyValueDiffer.prototype.forEachPreviousItem = function (fn) {
        var record;
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            fn(record);
        }
    };
    DefaultKeyValueDiffer.prototype.forEachChangedItem = function (fn) {
        var record;
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
            fn(record);
        }
    };
    DefaultKeyValueDiffer.prototype.forEachAddedItem = function (fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
        }
    };
    DefaultKeyValueDiffer.prototype.forEachRemovedItem = function (fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
        }
    };
    DefaultKeyValueDiffer.prototype.diff = function (map) {
        if (!map) {
            map = new Map();
        }
        else if (!(map instanceof Map || change_detection_util_1.isJsObject(map))) {
            throw new Error("Error trying to diff '" + util_1.stringify(map) + "'. Only maps and objects are allowed");
        }
        return this.check(map) ? this : null;
    };
    DefaultKeyValueDiffer.prototype.onDestroy = function () { };
    /**
     * Check the current state of the map vs the previous.
     * The algorithm is optimised for when the keys do no change.
     */
    DefaultKeyValueDiffer.prototype.check = function (map) {
        var _this = this;
        this._reset();
        var insertBefore = this._mapHead;
        this._appendAfter = null;
        this._forEach(map, function (value, key) {
            if (insertBefore && insertBefore.key === key) {
                _this._maybeAddToChanges(insertBefore, value);
                _this._appendAfter = insertBefore;
                insertBefore = insertBefore._next;
            }
            else {
                var record = _this._getOrCreateRecordForKey(key, value);
                insertBefore = _this._insertBeforeOrAppend(insertBefore, record);
            }
        });
        // Items remaining at the end of the list have been deleted
        if (insertBefore) {
            if (insertBefore._prev) {
                insertBefore._prev._next = null;
            }
            this._removalsHead = insertBefore;
            for (var record = insertBefore; record !== null; record = record._nextRemoved) {
                if (record === this._mapHead) {
                    this._mapHead = null;
                }
                this._records.delete(record.key);
                record._nextRemoved = record._next;
                record.previousValue = record.currentValue;
                record.currentValue = null;
                record._prev = null;
                record._next = null;
            }
        }
        // Make sure tails have no next records from previous runs
        if (this._changesTail)
            this._changesTail._nextChanged = null;
        if (this._additionsTail)
            this._additionsTail._nextAdded = null;
        return this.isDirty;
    };
    /**
     * Inserts a record before `before` or append at the end of the list when `before` is null.
     *
     * Notes:
     * - This method appends at `this._appendAfter`,
     * - This method updates `this._appendAfter`,
     * - The return value is the new value for the insertion pointer.
     */
    DefaultKeyValueDiffer.prototype._insertBeforeOrAppend = function (before, record) {
        if (before) {
            var prev = before._prev;
            record._next = before;
            record._prev = prev;
            before._prev = record;
            if (prev) {
                prev._next = record;
            }
            if (before === this._mapHead) {
                this._mapHead = record;
            }
            this._appendAfter = before;
            return before;
        }
        if (this._appendAfter) {
            this._appendAfter._next = record;
            record._prev = this._appendAfter;
        }
        else {
            this._mapHead = record;
        }
        this._appendAfter = record;
        return null;
    };
    DefaultKeyValueDiffer.prototype._getOrCreateRecordForKey = function (key, value) {
        if (this._records.has(key)) {
            var record_1 = this._records.get(key);
            this._maybeAddToChanges(record_1, value);
            var prev = record_1._prev;
            var next = record_1._next;
            if (prev) {
                prev._next = next;
            }
            if (next) {
                next._prev = prev;
            }
            record_1._next = null;
            record_1._prev = null;
            return record_1;
        }
        var record = new KeyValueChangeRecord_(key);
        this._records.set(key, record);
        record.currentValue = value;
        this._addToAdditions(record);
        return record;
    };
    /** @internal */
    DefaultKeyValueDiffer.prototype._reset = function () {
        if (this.isDirty) {
            var record = void 0;
            // let `_previousMapHead` contain the state of the map before the changes
            this._previousMapHead = this._mapHead;
            for (record = this._previousMapHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
            }
            // Update `record.previousValue` with the value of the item before the changes
            // We need to update all changed items (that's those which have been added and changed)
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                record.previousValue = record.currentValue;
            }
            for (record = this._additionsHead; record != null; record = record._nextAdded) {
                record.previousValue = record.currentValue;
            }
            this._changesHead = this._changesTail = null;
            this._additionsHead = this._additionsTail = null;
            this._removalsHead = null;
        }
    };
    // Add the record or a given key to the list of changes only when the value has actually changed
    DefaultKeyValueDiffer.prototype._maybeAddToChanges = function (record, newValue) {
        if (!util_1.looseIdentical(newValue, record.currentValue)) {
            record.previousValue = record.currentValue;
            record.currentValue = newValue;
            this._addToChanges(record);
        }
    };
    DefaultKeyValueDiffer.prototype._addToAdditions = function (record) {
        if (this._additionsHead === null) {
            this._additionsHead = this._additionsTail = record;
        }
        else {
            this._additionsTail._nextAdded = record;
            this._additionsTail = record;
        }
    };
    DefaultKeyValueDiffer.prototype._addToChanges = function (record) {
        if (this._changesHead === null) {
            this._changesHead = this._changesTail = record;
        }
        else {
            this._changesTail._nextChanged = record;
            this._changesTail = record;
        }
    };
    /** @internal */
    DefaultKeyValueDiffer.prototype._forEach = function (obj, fn) {
        if (obj instanceof Map) {
            obj.forEach(fn);
        }
        else {
            Object.keys(obj).forEach(function (k) { return fn(obj[k], k); });
        }
    };
    return DefaultKeyValueDiffer;
}());
exports.DefaultKeyValueDiffer = DefaultKeyValueDiffer;
/**
 * @stable
 */
var KeyValueChangeRecord_ = (function () {
    function KeyValueChangeRecord_(key) {
        this.key = key;
        this.previousValue = null;
        this.currentValue = null;
        /** @internal */
        this._nextPrevious = null;
        /** @internal */
        this._next = null;
        /** @internal */
        this._prev = null;
        /** @internal */
        this._nextAdded = null;
        /** @internal */
        this._nextRemoved = null;
        /** @internal */
        this._nextChanged = null;
    }
    return KeyValueChangeRecord_;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBcUQ7QUFDckQsa0VBQW9EO0FBS3BEO0lBQ0U7SUFBZSxDQUFDO0lBQ2hCLCtDQUFRLEdBQVIsVUFBUyxHQUFRLElBQWEsTUFBTSxDQUFDLEdBQUcsWUFBWSxHQUFHLElBQUksa0NBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFJN0U7O09BRUc7SUFDSCw2Q0FBTSxHQUFOLFVBQWEsRUFBc0I7UUFDakMsTUFBTSxDQUFDLElBQUkscUJBQXFCLEVBQVEsQ0FBQztJQUMzQyxDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLG9FQUE0QjtBQWN6QztJQUFBO1FBQ1UsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFrQyxDQUFDO1FBQ3JELGFBQVEsR0FBcUMsSUFBSSxDQUFDO1FBQzFELHlDQUF5QztRQUNqQyxpQkFBWSxHQUFxQyxJQUFJLENBQUM7UUFDdEQscUJBQWdCLEdBQXFDLElBQUksQ0FBQztRQUMxRCxpQkFBWSxHQUFxQyxJQUFJLENBQUM7UUFDdEQsaUJBQVksR0FBcUMsSUFBSSxDQUFDO1FBQ3RELG1CQUFjLEdBQXFDLElBQUksQ0FBQztRQUN4RCxtQkFBYyxHQUFxQyxJQUFJLENBQUM7UUFDeEQsa0JBQWEsR0FBcUMsSUFBSSxDQUFDO1FBQ3ZELGtCQUFhLEdBQXFDLElBQUksQ0FBQztJQW9PakUsQ0FBQztJQWxPQyxzQkFBSSwwQ0FBTzthQUFYO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFB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