"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a filePath and name and can be used as a hash table key.
 */
var StaticSymbol = (function () {
    function StaticSymbol(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
    }
    StaticSymbol.prototype.assertNoMembers = function () {
        if (this.members.length) {
            throw new Error("Illegal state: symbol without members expected, but got " + JSON.stringify(this) + ".");
        }
    };
    return StaticSymbol;
}());
exports.StaticSymbol = StaticSymbol;
/**
 * A cache of static symbol used by the StaticReflector to return the same symbol for the
 * same symbol values.
 */
var StaticSymbolCache = (function () {
    function StaticSymbolCache() {
        this.cache = new Map();
    }
    StaticSymbolCache.prototype.get = function (declarationFile, name, members) {
        members = members || [];
        var memberSuffix = members.length ? "." + members.join('.') : '';
        var key = "\"" + declarationFile + "\"." + name + memberSuffix;
        var result = this.cache.get(key);
        if (!result) {
            result = new StaticSymbol(declarationFile, name, members);
            this.cache.set(key, result);
        }
        return result;
    };
    return StaticSymbolCache;
}());
exports.StaticSymbolCache = StaticSymbolCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3N5bWJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3Qvc3RhdGljX3N5bWJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7O0dBSUc7QUFDSDtJQUNFLHNCQUFtQixRQUFnQixFQUFTLElBQVksRUFBUyxPQUFpQjtRQUEvRCxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQVU7SUFBRyxDQUFDO0lBRXRGLHNDQUFlLEdBQWY7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FDWCw2REFBMkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFDLENBQUM7UUFDMUYsQ0FBQztJQUNILENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBVFksb0NBQVk7QUFXekI7OztHQUdHO0FBQ0g7SUFBQTtRQUNVLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztJQWFsRCxDQUFDO0lBWEMsK0JBQUcsR0FBSCxVQUFJLGVBQXVCLEVBQUUsSUFBWSxFQUFFLE9BQWtCO1FBQzNELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNwRSxJQUFNLEdBQUcsR0FBRyxPQUFJLGVBQWUsV0FBSyxJQUFJLEdBQUcsWUFBYyxDQUFDO1FBQzFELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLDhDQUFpQiJ9