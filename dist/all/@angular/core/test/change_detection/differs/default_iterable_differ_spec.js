"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var default_iterable_differ_1 = require("@angular/core/src/change_detection/differs/default_iterable_differ");
var iterable_1 = require("../../change_detection/iterable");
var util_1 = require("../../change_detection/util");
var ItemWithId = (function () {
    function ItemWithId(id) {
        this.id = id;
    }
    ItemWithId.prototype.toString = function () { return "{id: " + this.id + "}"; };
    return ItemWithId;
}());
var ComplexItem = (function () {
    function ComplexItem(id, color) {
        this.id = id;
        this.color = color;
    }
    ComplexItem.prototype.toString = function () { return "{id: " + this.id + ", color: " + this.color + "}"; };
    return ComplexItem;
}());
// todo(vicb): UnmodifiableListView / frozen object when implemented
function main() {
    describe('iterable differ', function () {
        describe('DefaultIterableDiffer', function () {
            var differ;
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(); });
            it('should support list and iterables', function () {
                var f = new default_iterable_differ_1.DefaultIterableDifferFactory();
                expect(f.supports([])).toBeTruthy();
                expect(f.supports(new iterable_1.TestIterable())).toBeTruthy();
                expect(f.supports(new Map())).toBeFalsy();
                expect(f.supports(null)).toBeFalsy();
            });
            it('should support iterables', function () {
                var l = new iterable_1.TestIterable();
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                l.list = [1];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]'],
                    additions: ['1[null->0]']
                }));
                l.list = [2, 1];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]'],
                    previous: ['1[0->1]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]']
                }));
            });
            it('should detect additions', function () {
                var l = [];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({ collection: [] }));
                l.push('a');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                l.push('b');
                differ.check(l);
                expect(differ.toString())
                    .toEqual(util_1.iterableChangesAsString({ collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));
            });
            it('should support changing the reference', function () {
                var l = [0];
                differ.check(l);
                l = [1, 0];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['1[null->0]', '0[0->1]'],
                    previous: ['0[0->1]'],
                    additions: ['1[null->0]'],
                    moves: ['0[0->1]']
                }));
                l = [2, 1, 0];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[null->0]', '1[0->1]', '0[1->2]'],
                    previous: ['1[0->1]', '0[1->2]'],
                    additions: ['2[null->0]'],
                    moves: ['1[0->1]', '0[1->2]']
                }));
            });
            it('should handle swapping element', function () {
                var l = [1, 2];
                differ.check(l);
                l.length = 0;
                l.push(2);
                l.push(1);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['2[1->0]', '1[0->1]'],
                    previous: ['1[0->1]', '2[1->0]'],
                    moves: ['2[1->0]', '1[0->1]']
                }));
            });
            it('should handle incremental swapping element', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.splice(1, 1);
                l.splice(0, 0, 'b');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
                l.splice(1, 1);
                l.push('a');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b', 'c[2->1]', 'a[1->2]'],
                    previous: ['b', 'a[1->2]', 'c[2->1]'],
                    moves: ['c[2->1]', 'a[1->2]']
                }));
            });
            it('should detect changes in list', function () {
                var l = [];
                differ.check(l);
                l.push('a');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a[null->0]'],
                    additions: ['a[null->0]']
                }));
                l.push('b');
                differ.check(l);
                expect(differ.toString())
                    .toEqual(util_1.iterableChangesAsString({ collection: ['a', 'b[null->1]'], previous: ['a'], additions: ['b[null->1]'] }));
                l.push('c');
                l.push('d');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'c[null->2]', 'd[null->3]'],
                    previous: ['a', 'b'],
                    additions: ['c[null->2]', 'd[null->3]']
                }));
                l.splice(2, 1);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b', 'd[3->2]'],
                    previous: ['a', 'b', 'c[2->null]', 'd[3->2]'],
                    moves: ['d[3->2]'],
                    removals: ['c[2->null]']
                }));
                l.length = 0;
                l.push('d');
                l.push('c');
                l.push('b');
                l.push('a');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['d[2->0]', 'c[null->1]', 'b[1->2]', 'a[0->3]'],
                    previous: ['a[0->3]', 'b[1->2]', 'd[2->0]'],
                    additions: ['c[null->1]'],
                    moves: ['d[2->0]', 'b[1->2]', 'a[0->3]']
                }));
            });
            it('should ignore [NaN] != [NaN]', function () {
                var l = [NaN];
                differ.check(l);
                differ.check(l);
                expect(differ.toString())
                    .toEqual(util_1.iterableChangesAsString({ collection: [NaN], previous: [NaN] }));
            });
            it('should detect [NaN] moves', function () {
                var l = [NaN, NaN];
                differ.check(l);
                l.unshift('foo');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['foo[null->0]', 'NaN[0->1]', 'NaN[1->2]'],
                    previous: ['NaN[0->1]', 'NaN[1->2]'],
                    additions: ['foo[null->0]'],
                    moves: ['NaN[0->1]', 'NaN[1->2]']
                }));
            });
            it('should remove and add same item', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.splice(1, 1);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'c[2->1]'],
                    previous: ['a', 'b[1->null]', 'c[2->1]'],
                    moves: ['c[2->1]'],
                    removals: ['b[1->null]']
                }));
                l.splice(1, 0, 'b');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]', 'c[1->2]'],
                    previous: ['a', 'c[1->2]'],
                    additions: ['b[null->1]'],
                    moves: ['c[1->2]']
                }));
            });
            it('should support duplicates', function () {
                var l = ['a', 'a', 'a', 'b', 'b'];
                differ.check(l);
                l.splice(0, 1);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'a', 'b[3->2]', 'b[4->3]'],
                    previous: ['a', 'a', 'a[2->null]', 'b[3->2]', 'b[4->3]'],
                    moves: ['b[3->2]', 'b[4->3]'],
                    removals: ['a[2->null]']
                }));
            });
            it('should support insertions/moves', function () {
                var l = ['a', 'a', 'b', 'b'];
                differ.check(l);
                l.splice(0, 0, 'b');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[2->0]', 'a[0->1]', 'a[1->2]', 'b', 'b[null->4]'],
                    previous: ['a[0->1]', 'a[1->2]', 'b[2->0]', 'b'],
                    additions: ['b[null->4]'],
                    moves: ['b[2->0]', 'a[0->1]', 'a[1->2]']
                }));
            });
            it('should not report unnecessary moves', function () {
                var l = ['a', 'b', 'c'];
                differ.check(l);
                l.length = 0;
                l.push('b');
                l.push('a');
                l.push('c');
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['b[1->0]', 'a[0->1]', 'c'],
                    previous: ['a[0->1]', 'b[1->0]', 'c'],
                    moves: ['b[1->0]', 'a[0->1]']
                }));
            });
            // https://github.com/angular/angular/issues/17852
            it('support re-insertion', function () {
                var l = ['a', '*', '*', 'd', '-', '-', '-', 'e'];
                differ.check(l);
                l[1] = 'b';
                l[5] = 'c';
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['a', 'b[null->1]', '*[1->2]', 'd', '-', 'c[null->5]', '-[5->6]', 'e'],
                    previous: ['a', '*[1->2]', '*[2->null]', 'd', '-', '-[5->6]', '-[6->null]', 'e'],
                    additions: ['b[null->1]', 'c[null->5]'],
                    moves: ['*[1->2]', '-[5->6]'],
                    removals: ['*[2->null]', '-[6->null]'],
                }));
            });
            describe('forEachOperation', function () {
                function stringifyItemChange(record, p, c, originalIndex) {
                    var suffix = originalIndex == null ? '' : ' [o=' + originalIndex + ']';
                    var value = record.item;
                    if (record.currentIndex == null) {
                        return "REMOVE " + value + " (" + p + " -> VOID)" + suffix;
                    }
                    else if (record.previousIndex == null) {
                        return "INSERT " + value + " (VOID -> " + c + ")" + suffix;
                    }
                    else {
                        return "MOVE " + value + " (" + p + " -> " + c + ")" + suffix;
                    }
                }
                function modifyArrayUsingOperation(arr, endData, prev, next) {
                    var value = null;
                    if (prev == null) {
                        value = endData[next];
                        arr.splice(next, 0, value);
                    }
                    else if (next == null) {
                        value = arr[prev];
                        arr.splice(prev, 1);
                    }
                    else {
                        value = arr[prev];
                        arr.splice(prev, 1);
                        arr.splice(next, 0, value);
                    }
                    return value;
                }
                it('should trigger a series of insert/move/remove changes for inputs that have been diffed', function () {
                    var startData = [0, 1, 2, 3, 4, 5];
                    var endData = [6, 2, 7, 0, 4, 8];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        var value = modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'INSERT 6 (VOID -> 0)', 'MOVE 2 (3 -> 1) [o=2]', 'INSERT 7 (VOID -> 2)',
                        'REMOVE 1 (4 -> VOID) [o=1]', 'REMOVE 3 (4 -> VOID) [o=3]',
                        'REMOVE 5 (5 -> VOID) [o=5]', 'INSERT 8 (VOID -> 5)'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should consider inserting/removing/moving items with respect to items that have not moved at all', function () {
                    var startData = [0, 1, 2, 3];
                    var endData = [2, 1];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'REMOVE 0 (0 -> VOID) [o=0]', 'MOVE 2 (1 -> 0) [o=2]', 'REMOVE 3 (2 -> VOID) [o=3]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should be able to manage operations within a criss/cross of move operations', function () {
                    var startData = [1, 2, 3, 4, 5, 6];
                    var endData = [3, 6, 4, 9, 1, 2];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 3 (2 -> 0) [o=2]', 'MOVE 6 (5 -> 1) [o=5]', 'MOVE 4 (4 -> 2) [o=3]',
                        'INSERT 9 (VOID -> 3)', 'REMOVE 5 (6 -> VOID) [o=4]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should skip moves for multiple nodes that have not moved', function () {
                    var startData = [0, 1, 2, 3, 4];
                    var endData = [4, 1, 2, 3, 0, 5];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 4 (4 -> 0) [o=4]', 'MOVE 1 (2 -> 1) [o=1]', 'MOVE 2 (3 -> 2) [o=2]',
                        'MOVE 3 (4 -> 3) [o=3]', 'INSERT 5 (VOID -> 5)'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should not fail', function () {
                    var startData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                    var endData = [10, 11, 1, 5, 7, 8, 0, 5, 3, 6];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([
                        'MOVE 10 (10 -> 0) [o=10]', 'MOVE 11 (11 -> 1) [o=11]', 'MOVE 1 (3 -> 2) [o=1]',
                        'MOVE 5 (7 -> 3) [o=5]', 'MOVE 7 (9 -> 4) [o=7]', 'MOVE 8 (10 -> 5) [o=8]',
                        'REMOVE 2 (7 -> VOID) [o=2]', 'INSERT 5 (VOID -> 7)', 'REMOVE 4 (9 -> VOID) [o=4]',
                        'REMOVE 9 (10 -> VOID) [o=9]'
                    ]);
                    expect(startData).toEqual(endData);
                });
                it('should trigger nothing when the list is completely full of replaced items that are tracked by the index', function () {
                    differ = new default_iterable_differ_1.DefaultIterableDiffer(function (index) { return index; });
                    var startData = [1, 2, 3, 4];
                    var endData = [5, 6, 7, 8];
                    differ = differ.diff(startData);
                    differ = differ.diff(endData);
                    var operations = [];
                    differ.forEachOperation(function (item, prev, next) {
                        var value = modifyArrayUsingOperation(startData, endData, prev, next);
                        operations.push(stringifyItemChange(item, prev, next, item.previousIndex));
                    });
                    expect(operations).toEqual([]);
                });
            });
            describe('diff', function () {
                it('should return self when there is a change', function () {
                    expect(differ.diff(['a', 'b'])).toBe(differ);
                });
                it('should return null when there is no change', function () {
                    differ.diff(['a', 'b']);
                    expect(differ.diff(['a', 'b'])).toEqual(null);
                });
                it('should treat null as an empty list', function () {
                    differ.diff(['a', 'b']);
                    expect(differ.diff(null).toString()).toEqual(util_1.iterableChangesAsString({
                        previous: ['a[0->null]', 'b[1->null]'],
                        removals: ['a[0->null]', 'b[1->null]']
                    }));
                });
                it('should throw when given an invalid collection', function () {
                    expect(function () { return differ.diff('invalid'); }).toThrowError(/Error trying to diff 'invalid'/);
                });
            });
        });
        describe('trackBy function by id', function () {
            var differ;
            var trackByItemId = function (index, item) { return item.id; };
            var buildItemList = function (list) { return list.map(function (val) { return new ItemWithId(val); }); };
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(trackByItemId); });
            it('should treat the collection as dirty if identity changes', function () {
                differ.diff(buildItemList(['a']));
                expect(differ.diff(buildItemList(['a']))).toBe(differ);
            });
            it('should treat seen records as identity changes, not additions', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a}[null->0]", "{id: b}[null->1]", "{id: c}[null->2]"],
                    additions: ["{id: a}[null->0]", "{id: b}[null->1]", "{id: c}[null->2]"]
                }));
                l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a}", "{id: b}", "{id: c}"],
                    identityChanges: ["{id: a}", "{id: b}", "{id: c}"],
                    previous: ["{id: a}", "{id: b}", "{id: c}"]
                }));
            });
            it('should have updated properties in identity change collection', function () {
                var l = [new ComplexItem('a', 'blue'), new ComplexItem('b', 'yellow')];
                differ.check(l);
                l = [new ComplexItem('a', 'orange'), new ComplexItem('b', 'red')];
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ["{id: a, color: orange}", "{id: b, color: red}"],
                    identityChanges: ["{id: a, color: orange}", "{id: b, color: red}"],
                    previous: ["{id: a, color: orange}", "{id: b, color: red}"]
                }));
            });
            it('should track moves normally', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                l = buildItemList(['b', 'a', 'c']);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
                    identityChanges: ['{id: b}[1->0]', '{id: a}[0->1]', '{id: c}'],
                    previous: ['{id: a}[0->1]', '{id: b}[1->0]', '{id: c}'],
                    moves: ['{id: b}[1->0]', '{id: a}[0->1]']
                }));
            });
            it('should track duplicate reinsertion normally', function () {
                var l = buildItemList(['a', 'a']);
                differ.check(l);
                l = buildItemList(['b', 'a', 'a']);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: b}[null->0]', '{id: a}[0->1]', '{id: a}[1->2]'],
                    identityChanges: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    previous: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    moves: ['{id: a}[0->1]', '{id: a}[1->2]'],
                    additions: ['{id: b}[null->0]']
                }));
            });
            it('should track removals normally', function () {
                var l = buildItemList(['a', 'b', 'c']);
                differ.check(l);
                l.splice(2, 1);
                differ.check(l);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['{id: a}', '{id: b}'],
                    previous: ['{id: a}', '{id: b}', '{id: c}[2->null]'],
                    removals: ['{id: c}[2->null]']
                }));
            });
        });
        describe('trackBy function by index', function () {
            var differ;
            var trackByIndex = function (index, item) { return index; };
            beforeEach(function () { differ = new default_iterable_differ_1.DefaultIterableDiffer(trackByIndex); });
            it('should track removals normally', function () {
                differ.check(['a', 'b', 'c', 'd']);
                differ.check(['e', 'f', 'g', 'h']);
                differ.check(['e', 'f', 'h']);
                expect(differ.toString()).toEqual(util_1.iterableChangesAsString({
                    collection: ['e', 'f', 'h'],
                    previous: ['e', 'f', 'h', 'h[3->null]'],
                    removals: ['h[3->null]'],
                    identityChanges: ['h']
                }));
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhHQUF1STtBQUV2SSw0REFBNkQ7QUFDN0Qsb0RBQW9FO0FBRXBFO0lBQ0Usb0JBQW9CLEVBQVU7UUFBVixPQUFFLEdBQUYsRUFBRSxDQUFRO0lBQUcsQ0FBQztJQUVsQyw2QkFBUSxHQUFSLGNBQWEsTUFBTSxDQUFDLFVBQVEsSUFBSSxDQUFDLEVBQUUsTUFBRyxDQUFDLENBQUMsQ0FBQztJQUMzQyxpQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7SUFDRSxxQkFBb0IsRUFBVSxFQUFVLEtBQWE7UUFBakMsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBRXpELDhCQUFRLEdBQVIsY0FBYSxNQUFNLENBQUMsVUFBUSxJQUFJLENBQUMsRUFBRSxpQkFBWSxJQUFJLENBQUMsS0FBSyxNQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLGtCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRCxvRUFBb0U7QUFDcEU7SUFDRSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLElBQUksTUFBa0MsQ0FBQztZQUV2QyxVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSwrQ0FBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUQsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxJQUFNLENBQUMsR0FBRyxJQUFJLHNEQUE0QixFQUFFLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxDQUFD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