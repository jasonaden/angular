"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../src/util");
function iterableChangesAsString(_a) {
    var _b = _a.collection, collection = _b === void 0 ? [] : _b, _c = _a.previous, previous = _c === void 0 ? [] : _c, _d = _a.additions, additions = _d === void 0 ? [] : _d, _e = _a.moves, moves = _e === void 0 ? [] : _e, _f = _a.removals, removals = _f === void 0 ? [] : _f, _g = _a.identityChanges, identityChanges = _g === void 0 ? [] : _g;
    return 'collection: ' + collection.join(', ') + '\n' +
        'previous: ' + previous.join(', ') + '\n' +
        'additions: ' + additions.join(', ') + '\n' +
        'moves: ' + moves.join(', ') + '\n' +
        'removals: ' + removals.join(', ') + '\n' +
        'identityChanges: ' + identityChanges.join(', ') + '\n';
}
exports.iterableChangesAsString = iterableChangesAsString;
function kvcrAsString(kvcr) {
    return util_1.looseIdentical(kvcr.previousValue, kvcr.currentValue) ?
        util_1.stringify(kvcr.key) :
        (util_1.stringify(kvcr.key) + '[' + util_1.stringify(kvcr.previousValue) + '->' +
            util_1.stringify(kvcr.currentValue) + ']');
}
function kvChangesAsString(kvChanges) {
    var map = [];
    var previous = [];
    var changes = [];
    var additions = [];
    var removals = [];
    kvChanges.forEachItem(function (r) { return map.push(kvcrAsString(r)); });
    kvChanges.forEachPreviousItem(function (r) { return previous.push(kvcrAsString(r)); });
    kvChanges.forEachChangedItem(function (r) { return changes.push(kvcrAsString(r)); });
    kvChanges.forEachAddedItem(function (r) { return additions.push(kvcrAsString(r)); });
    kvChanges.forEachRemovedItem(function (r) { return removals.push(kvcrAsString(r)); });
    return testChangesAsString({ map: map, previous: previous, additions: additions, changes: changes, removals: removals });
}
exports.kvChangesAsString = kvChangesAsString;
function testChangesAsString(_a) {
    var map = _a.map, previous = _a.previous, additions = _a.additions, changes = _a.changes, removals = _a.removals;
    if (!map)
        map = [];
    if (!previous)
        previous = [];
    if (!additions)
        additions = [];
    if (!changes)
        changes = [];
    if (!removals)
        removals = [];
    return 'map: ' + map.join(', ') + '\n' +
        'previous: ' + previous.join(', ') + '\n' +
        'additions: ' + additions.join(', ') + '\n' +
        'changes: ' + changes.join(', ') + '\n' +
        'removals: ' + removals.join(', ') + '\n';
}
exports.testChangesAsString = testChangesAsString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jaGFuZ2VfZGV0ZWN0aW9uL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCx1Q0FBeUQ7QUFHekQsaUNBQ0ksRUFDbUQ7UUFEbEQsa0JBQXNCLEVBQXRCLG9DQUFzQixFQUFFLGdCQUFvQixFQUFwQixrQ0FBb0IsRUFBRSxpQkFBcUIsRUFBckIsbUNBQXFCLEVBQUUsYUFBaUIsRUFBakIsK0JBQWlCLEVBQ3RGLGdCQUFvQixFQUFwQixrQ0FBb0IsRUFBRSx1QkFBMkIsRUFBM0IseUNBQTJCO0lBQ3BELE1BQU0sQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQ2hELFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7UUFDekMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtRQUMzQyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQ25DLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7UUFDekMsbUJBQW1CLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDOUQsQ0FBQztBQVRELDBEQVNDO0FBRUQsc0JBQXNCLElBQXVDO0lBQzNELE1BQU0sQ0FBQyxxQkFBYyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN4RCxnQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsZ0JB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