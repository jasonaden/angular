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
var DefaultIterableDifferFactory = (function () {
    function DefaultIterableDifferFactory() {
    }
    DefaultIterableDifferFactory.prototype.supports = function (obj) { return change_detection_util_1.isListLikeIterable(obj); };
    /**
     * @deprecated v4.0.0 - ChangeDetectorRef is not used and is no longer a parameter
     */
    DefaultIterableDifferFactory.prototype.create = function (cdRefOrTrackBy, trackByFn) {
        return new DefaultIterableDiffer(trackByFn || cdRefOrTrackBy);
    };
    return DefaultIterableDifferFactory;
}());
exports.DefaultIterableDifferFactory = DefaultIterableDifferFactory;
var trackByIdentity = function (index, item) { return item; };
/**
 * @deprecated v4.0.0 - Should not be part of public API.
 */
var DefaultIterableDiffer = (function () {
    function DefaultIterableDiffer(trackByFn) {
        this._length = 0;
        this._collection = null;
        // Keeps track of the used records at any point in time (during & across `_check()` calls)
        this._linkedRecords = null;
        // Keeps track of the removed records at any point in time during `_check()` calls.
        this._unlinkedRecords = null;
        this._previousItHead = null;
        this._itHead = null;
        this._itTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._movesHead = null;
        this._movesTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
        // Keeps track of records where custom track by is the same, but item identity has changed
        this._identityChangesHead = null;
        this._identityChangesTail = null;
        this._trackByFn = trackByFn || trackByIdentity;
    }
    Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
        get: function () { return this._collection; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
        get: function () { return this._length; },
        enumerable: true,
        configurable: true
    });
    DefaultIterableDiffer.prototype.forEachItem = function (fn) {
        var record;
        for (record = this._itHead; record !== null; record = record._next) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.forEachOperation = function (fn) {
        var nextIt = this._itHead;
        var nextRemove = this._removalsHead;
        var addRemoveOffset = 0;
        var moveOffsets = null;
        while (nextIt || nextRemove) {
            // Figure out which is the next record to process
            // Order: remove, add, move
            var record = !nextRemove ||
                nextIt &&
                    nextIt.currentIndex <
                        getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ?
                nextIt :
                nextRemove;
            var adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
            var currentIndex = record.currentIndex;
            // consume the item, and adjust the addRemoveOffset and update moveDistance if necessary
            if (record === nextRemove) {
                addRemoveOffset--;
                nextRemove = nextRemove._nextRemoved;
            }
            else {
                nextIt = nextIt._next;
                if (record.previousIndex == null) {
                    addRemoveOffset++;
                }
                else {
                    // INVARIANT:  currentIndex < previousIndex
                    if (!moveOffsets)
                        moveOffsets = [];
                    var localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
                    var localCurrentIndex = currentIndex - addRemoveOffset;
                    if (localMovePreviousIndex != localCurrentIndex) {
                        for (var i = 0; i < localMovePreviousIndex; i++) {
                            var offset = i < moveOffsets.length ? moveOffsets[i] : (moveOffsets[i] = 0);
                            var index = offset + i;
                            if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                                moveOffsets[i] = offset + 1;
                            }
                        }
                        var previousIndex = record.previousIndex;
                        moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
                    }
                }
            }
            if (adjPreviousIndex !== currentIndex) {
                fn(record, adjPreviousIndex, currentIndex);
            }
        }
    };
    DefaultIterableDiffer.prototype.forEachPreviousItem = function (fn) {
        var record;
        for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.forEachAddedItem = function (fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.forEachMovedItem = function (fn) {
        var record;
        for (record = this._movesHead; record !== null; record = record._nextMoved) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.forEachRemovedItem = function (fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.forEachIdentityChange = function (fn) {
        var record;
        for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
            fn(record);
        }
    };
    DefaultIterableDiffer.prototype.diff = function (collection) {
        if (collection == null)
            collection = [];
        if (!change_detection_util_1.isListLikeIterable(collection)) {
            throw new Error("Error trying to diff '" + util_1.stringify(collection) + "'. Only arrays and iterables are allowed");
        }
        if (this.check(collection)) {
            return this;
        }
        else {
            return null;
        }
    };
    DefaultIterableDiffer.prototype.onDestroy = function () { };
    DefaultIterableDiffer.prototype.check = function (collection) {
        var _this = this;
        this._reset();
        var record = this._itHead;
        var mayBeDirty = false;
        var index;
        var item;
        var itemTrackBy;
        if (Array.isArray(collection)) {
            this._length = collection.length;
            for (var index_1 = 0; index_1 < this._length; index_1++) {
                item = collection[index_1];
                itemTrackBy = this._trackByFn(index_1, item);
                if (record === null || !util_1.looseIdentical(record.trackById, itemTrackBy)) {
                    record = this._mismatch(record, item, itemTrackBy, index_1);
                    mayBeDirty = true;
                }
                else {
                    if (mayBeDirty) {
                        // TODO(misko): can we limit this to duplicates only?
                        record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
                    }
                    if (!util_1.looseIdentical(record.item, item))
                        this._addIdentityChange(record, item);
                }
                record = record._next;
            }
        }
        else {
            index = 0;
            change_detection_util_1.iterateListLike(collection, function (item) {
                itemTrackBy = _this._trackByFn(index, item);
                if (record === null || !util_1.looseIdentical(record.trackById, itemTrackBy)) {
                    record = _this._mismatch(record, item, itemTrackBy, index);
                    mayBeDirty = true;
                }
                else {
                    if (mayBeDirty) {
                        // TODO(misko): can we limit this to duplicates only?
                        record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                    }
                    if (!util_1.looseIdentical(record.item, item))
                        _this._addIdentityChange(record, item);
                }
                record = record._next;
                index++;
            });
            this._length = index;
        }
        this._truncate(record);
        this._collection = collection;
        return this.isDirty;
    };
    Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
        /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
         * changes.
         */
        get: function () {
            return this._additionsHead !== null || this._movesHead !== null ||
                this._removalsHead !== null || this._identityChangesHead !== null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reset the state of the change objects to show no changes. This means set previousKey to
     * currentKey, and clear all of the queues (additions, moves, removals).
     * Set the previousIndexes of moved and added items to their currentIndexes
     * Reset the list of additions, moves and removals
     *
     * @internal
     */
    DefaultIterableDiffer.prototype._reset = function () {
        if (this.isDirty) {
            var record = void 0;
            var nextRecord = void 0;
            for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                record.previousIndex = record.currentIndex;
            }
            this._additionsHead = this._additionsTail = null;
            for (record = this._movesHead; record !== null; record = nextRecord) {
                record.previousIndex = record.currentIndex;
                nextRecord = record._nextMoved;
            }
            this._movesHead = this._movesTail = null;
            this._removalsHead = this._removalsTail = null;
            this._identityChangesHead = this._identityChangesTail = null;
            // todo(vicb) when assert gets supported
            // assert(!this.isDirty);
        }
    };
    /**
     * This is the core function which handles differences between collections.
     *
     * - `record` is the record which we saw at this position last time. If null then it is a new
     *   item.
     * - `item` is the current item in the collection
     * - `index` is the position of the item in the collection
     *
     * @internal
     */
    DefaultIterableDiffer.prototype._mismatch = function (record, item, itemTrackBy, index) {
        // The previous record after which we will append the current one.
        var previousRecord;
        if (record === null) {
            previousRecord = this._itTail;
        }
        else {
            previousRecord = record._prev;
            // Remove the record from the collection since we know it does not match the item.
            this._remove(record);
        }
        // Attempt to see if we have seen the item before.
        record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
        if (record !== null) {
            // We have seen this before, we need to move it forward in the collection.
            // But first we need to check if identity changed, so we can update in view if necessary
            if (!util_1.looseIdentical(record.item, item))
                this._addIdentityChange(record, item);
            this._moveAfter(record, previousRecord, index);
        }
        else {
            // Never seen it, check evicted list.
            record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
            if (record !== null) {
                // It is an item which we have evicted earlier: reinsert it back into the list.
                // But first we need to check if identity changed, so we can update in view if necessary
                if (!util_1.looseIdentical(record.item, item))
                    this._addIdentityChange(record, item);
                this._reinsertAfter(record, previousRecord, index);
            }
            else {
                // It is a new item: add it.
                record =
                    this._addAfter(new IterableChangeRecord_(item, itemTrackBy), previousRecord, index);
            }
        }
        return record;
    };
    /**
     * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
     *
     * Use case: `[a, a]` => `[b, a, a]`
     *
     * If we did not have this check then the insertion of `b` would:
     *   1) evict first `a`
     *   2) insert `b` at `0` index.
     *   3) leave `a` at index `1` as is. <-- this is wrong!
     *   3) reinsert `a` at index 2. <-- this is wrong!
     *
     * The correct behavior is:
     *   1) evict first `a`
     *   2) insert `b` at `0` index.
     *   3) reinsert `a` at index 1.
     *   3) move `a` at from `1` to `2`.
     *
     *
     * Double check that we have not evicted a duplicate item. We need to check if the item type may
     * have already been removed:
     * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
     * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
     * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
     * at the end.
     *
     * @internal
     */
    DefaultIterableDiffer.prototype._verifyReinsertion = function (record, item, itemTrackBy, index) {
        var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
        if (reinsertRecord !== null) {
            record = this._reinsertAfter(reinsertRecord, record._prev, index);
        }
        else if (record.currentIndex != index) {
            record.currentIndex = index;
            this._addToMoves(record, index);
        }
        return record;
    };
    /**
     * Get rid of any excess {@link IterableChangeRecord_}s from the previous collection
     *
     * - `record` The first excess {@link IterableChangeRecord_}.
     *
     * @internal
     */
    DefaultIterableDiffer.prototype._truncate = function (record) {
        // Anything after that needs to be removed;
        while (record !== null) {
            var nextRecord = record._next;
            this._addToRemovals(this._unlink(record));
            record = nextRecord;
        }
        if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.clear();
        }
        if (this._additionsTail !== null) {
            this._additionsTail._nextAdded = null;
        }
        if (this._movesTail !== null) {
            this._movesTail._nextMoved = null;
        }
        if (this._itTail !== null) {
            this._itTail._next = null;
        }
        if (this._removalsTail !== null) {
            this._removalsTail._nextRemoved = null;
        }
        if (this._identityChangesTail !== null) {
            this._identityChangesTail._nextIdentityChange = null;
        }
    };
    /** @internal */
    DefaultIterableDiffer.prototype._reinsertAfter = function (record, prevRecord, index) {
        if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.remove(record);
        }
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
            this._removalsHead = next;
        }
        else {
            prev._nextRemoved = next;
        }
        if (next === null) {
            this._removalsTail = prev;
        }
        else {
            next._prevRemoved = prev;
        }
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._moveAfter = function (record, prevRecord, index) {
        this._unlink(record);
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._addAfter = function (record, prevRecord, index) {
        this._insertAfter(record, prevRecord, index);
        if (this._additionsTail === null) {
            // todo(vicb)
            // assert(this._additionsHead === null);
            this._additionsTail = this._additionsHead = record;
        }
        else {
            // todo(vicb)
            // assert(_additionsTail._nextAdded === null);
            // assert(record._nextAdded === null);
            this._additionsTail = this._additionsTail._nextAdded = record;
        }
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._insertAfter = function (record, prevRecord, index) {
        // todo(vicb)
        // assert(record != prevRecord);
        // assert(record._next === null);
        // assert(record._prev === null);
        var next = prevRecord === null ? this._itHead : prevRecord._next;
        // todo(vicb)
        // assert(next != record);
        // assert(prevRecord != record);
        record._next = next;
        record._prev = prevRecord;
        if (next === null) {
            this._itTail = record;
        }
        else {
            next._prev = record;
        }
        if (prevRecord === null) {
            this._itHead = record;
        }
        else {
            prevRecord._next = record;
        }
        if (this._linkedRecords === null) {
            this._linkedRecords = new _DuplicateMap();
        }
        this._linkedRecords.put(record);
        record.currentIndex = index;
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._remove = function (record) {
        return this._addToRemovals(this._unlink(record));
    };
    /** @internal */
    DefaultIterableDiffer.prototype._unlink = function (record) {
        if (this._linkedRecords !== null) {
            this._linkedRecords.remove(record);
        }
        var prev = record._prev;
        var next = record._next;
        // todo(vicb)
        // assert((record._prev = null) === null);
        // assert((record._next = null) === null);
        if (prev === null) {
            this._itHead = next;
        }
        else {
            prev._next = next;
        }
        if (next === null) {
            this._itTail = prev;
        }
        else {
            next._prev = prev;
        }
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._addToMoves = function (record, toIndex) {
        // todo(vicb)
        // assert(record._nextMoved === null);
        if (record.previousIndex === toIndex) {
            return record;
        }
        if (this._movesTail === null) {
            // todo(vicb)
            // assert(_movesHead === null);
            this._movesTail = this._movesHead = record;
        }
        else {
            // todo(vicb)
            // assert(_movesTail._nextMoved === null);
            this._movesTail = this._movesTail._nextMoved = record;
        }
        return record;
    };
    DefaultIterableDiffer.prototype._addToRemovals = function (record) {
        if (this._unlinkedRecords === null) {
            this._unlinkedRecords = new _DuplicateMap();
        }
        this._unlinkedRecords.put(record);
        record.currentIndex = null;
        record._nextRemoved = null;
        if (this._removalsTail === null) {
            // todo(vicb)
            // assert(_removalsHead === null);
            this._removalsTail = this._removalsHead = record;
            record._prevRemoved = null;
        }
        else {
            // todo(vicb)
            // assert(_removalsTail._nextRemoved === null);
            // assert(record._nextRemoved === null);
            record._prevRemoved = this._removalsTail;
            this._removalsTail = this._removalsTail._nextRemoved = record;
        }
        return record;
    };
    /** @internal */
    DefaultIterableDiffer.prototype._addIdentityChange = function (record, item) {
        record.item = item;
        if (this._identityChangesTail === null) {
            this._identityChangesTail = this._identityChangesHead = record;
        }
        else {
            this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
        }
        return record;
    };
    DefaultIterableDiffer.prototype.toString = function () {
        var list = [];
        this.forEachItem(function (record) { return list.push(record); });
        var previous = [];
        this.forEachPreviousItem(function (record) { return previous.push(record); });
        var additions = [];
        this.forEachAddedItem(function (record) { return additions.push(record); });
        var moves = [];
        this.forEachMovedItem(function (record) { return moves.push(record); });
        var removals = [];
        this.forEachRemovedItem(function (record) { return removals.push(record); });
        var identityChanges = [];
        this.forEachIdentityChange(function (record) { return identityChanges.push(record); });
        return 'collection: ' + list.join(', ') + '\n' +
            'previous: ' + previous.join(', ') + '\n' +
            'additions: ' + additions.join(', ') + '\n' +
            'moves: ' + moves.join(', ') + '\n' +
            'removals: ' + removals.join(', ') + '\n' +
            'identityChanges: ' + identityChanges.join(', ') + '\n';
    };
    return DefaultIterableDiffer;
}());
exports.DefaultIterableDiffer = DefaultIterableDiffer;
/**
 * @stable
 */
var IterableChangeRecord_ = (function () {
    function IterableChangeRecord_(item, trackById) {
        this.item = item;
        this.trackById = trackById;
        this.currentIndex = null;
        this.previousIndex = null;
        /** @internal */
        this._nextPrevious = null;
        /** @internal */
        this._prev = null;
        /** @internal */
        this._next = null;
        /** @internal */
        this._prevDup = null;
        /** @internal */
        this._nextDup = null;
        /** @internal */
        this._prevRemoved = null;
        /** @internal */
        this._nextRemoved = null;
        /** @internal */
        this._nextAdded = null;
        /** @internal */
        this._nextMoved = null;
        /** @internal */
        this._nextIdentityChange = null;
    }
    IterableChangeRecord_.prototype.toString = function () {
        return this.previousIndex === this.currentIndex ? util_1.stringify(this.item) :
            util_1.stringify(this.item) + '[' +
                util_1.stringify(this.previousIndex) + '->' + util_1.stringify(this.currentIndex) + ']';
    };
    return IterableChangeRecord_;
}());
exports.IterableChangeRecord_ = IterableChangeRecord_;
// A linked list of CollectionChangeRecords with the same IterableChangeRecord_.item
var _DuplicateItemRecordList = (function () {
    function _DuplicateItemRecordList() {
        /** @internal */
        this._head = null;
        /** @internal */
        this._tail = null;
    }
    /**
     * Append the record to the list of duplicates.
     *
     * Note: by design all records in the list of duplicates hold the same value in record.item.
     */
    _DuplicateItemRecordList.prototype.add = function (record) {
        if (this._head === null) {
            this._head = this._tail = record;
            record._nextDup = null;
            record._prevDup = null;
        }
        else {
            // todo(vicb)
            // assert(record.item ==  _head.item ||
            //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
            this._tail._nextDup = record;
            record._prevDup = this._tail;
            record._nextDup = null;
            this._tail = record;
        }
    };
    // Returns a IterableChangeRecord_ having IterableChangeRecord_.trackById == trackById and
    // IterableChangeRecord_.currentIndex >= atOrAfterIndex
    _DuplicateItemRecordList.prototype.get = function (trackById, atOrAfterIndex) {
        var record;
        for (record = this._head; record !== null; record = record._nextDup) {
            if ((atOrAfterIndex === null || atOrAfterIndex <= record.currentIndex) &&
                util_1.looseIdentical(record.trackById, trackById)) {
                return record;
            }
        }
        return null;
    };
    /**
     * Remove one {@link IterableChangeRecord_} from the list of duplicates.
     *
     * Returns whether the list of duplicates is empty.
     */
    _DuplicateItemRecordList.prototype.remove = function (record) {
        // todo(vicb)
        // assert(() {
        //  // verify that the record being removed is in the list.
        //  for (IterableChangeRecord_ cursor = _head; cursor != null; cursor = cursor._nextDup) {
        //    if (identical(cursor, record)) return true;
        //  }
        //  return false;
        //});
        var prev = record._prevDup;
        var next = record._nextDup;
        if (prev === null) {
            this._head = next;
        }
        else {
            prev._nextDup = next;
        }
        if (next === null) {
            this._tail = prev;
        }
        else {
            next._prevDup = prev;
        }
        return this._head === null;
    };
    return _DuplicateItemRecordList;
}());
var _DuplicateMap = (function () {
    function _DuplicateMap() {
        this.map = new Map();
    }
    _DuplicateMap.prototype.put = function (record) {
        var key = record.trackById;
        var duplicates = this.map.get(key);
        if (!duplicates) {
            duplicates = new _DuplicateItemRecordList();
            this.map.set(key, duplicates);
        }
        duplicates.add(record);
    };
    /**
     * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
     * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
     *
     * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
     * have any more `a`s needs to return the second `a`.
     */
    _DuplicateMap.prototype.get = function (trackById, atOrAfterIndex) {
        var key = trackById;
        var recordList = this.map.get(key);
        return recordList ? recordList.get(trackById, atOrAfterIndex) : null;
    };
    /**
     * Removes a {@link IterableChangeRecord_} from the list of duplicates.
     *
     * The list of duplicates also is removed from the map if it gets empty.
     */
    _DuplicateMap.prototype.remove = function (record) {
        var key = record.trackById;
        var recordList = this.map.get(key);
        // Remove the list of duplicates when it gets empty
        if (recordList.remove(record)) {
            this.map.delete(key);
        }
        return record;
    };
    Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
        get: function () { return this.map.size === 0; },
        enumerable: true,
        configurable: true
    });
    _DuplicateMap.prototype.clear = function () { this.map.clear(); };
    _DuplicateMap.prototype.toString = function () { return '_DuplicateMap(' + util_1.stringify(this.map) + ')'; };
    return _DuplicateMap;
}());
function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
    var previousIndex = item.previousIndex;
    if (previousIndex === null)
        return previousIndex;
    var moveOffset = 0;
    if (moveOffsets && previousIndex < moveOffsets.length) {
        moveOffset = moveOffsets[previousIndex];
    }
    return previousIndex + addRemoveOffset + moveOffset;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBcUQ7QUFDckQsa0VBQTZFO0FBTTdFO0lBQ0U7SUFBZSxDQUFDO0lBQ2hCLCtDQUFRLEdBQVIsVUFBUyxHQUEwQixJQUFhLE1BQU0sQ0FBQywwQ0FBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFJakY7O09BRUc7SUFDSCw2Q0FBTSxHQUFOLFVBQVUsY0FBcUQsRUFBRSxTQUE4QjtRQUU3RixNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBSSxTQUFTLElBQTBCLGNBQWMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFDSCxtQ0FBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksb0VBQTRCO0FBZXpDLElBQU0sZUFBZSxHQUFHLFVBQUMsS0FBYSxFQUFFLElBQVMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUM7QUFFM0Q7O0dBRUc7QUFDSDtJQXFCRSwrQkFBWSxTQUE4QjtRQXBCbEMsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixnQkFBVyxHQUF1QixJQUFJLENBQUM7UUFDL0MsMEZBQTBGO1FBQ2xGLG1CQUFjLEdBQTBCLElBQUksQ0FBQztRQUNyRCxtRkFBbUY7UUFDM0UscUJBQWdCLEdBQTBCLElBQUksQ0FBQztRQUMvQyxvQkFBZSxHQUFrQyxJQUFJLENBQUM7UUFDdEQsWUFBTyxHQUFrQyxJQUFJLENBQUM7UUFDOUMsWUFBTyxHQUFrQyxJQUFJLENBQUM7UUFDOUMsbUJBQWMsR0FBa0MsSUFBSSxDQUFDO1FBQ3JELG1CQUFjLEdBQWtDLElBQUksQ0FBQztRQUNyRCxlQUFVLEdBQWtDLElB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