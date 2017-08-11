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
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */
/**
 * @whatItDoes Represents the version of angular/animations
 *
 * @stable
 */
var Version = (function () {
    function Version(full) {
        this.full = full;
    }
    Object.defineProperty(Version.prototype, "major", {
        get: function () { return this.full.split('.')[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Version.prototype, "minor", {
        get: function () { return this.full.split('.')[1]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Version.prototype, "patch", {
        get: function () { return this.full.split('.').slice(2).join('.'); },
        enumerable: true,
        configurable: true
    });
    return Version;
}());
exports.Version = Version;
/**
 * @stable
 */
exports.VERSION = new Version('0.0.0-PLACEHOLDER');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL3ZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7OztHQUlHO0FBRUg7Ozs7R0FJRztBQUNIO0lBQ0UsaUJBQW1CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztJQUVuQyxzQkFBSSwwQkFBSzthQUFULGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXZELHNCQUFJLDBCQUFLO2FBQVQsY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdkQsc0JBQUksMEJBQUs7YUFBVCxjQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pFLGNBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDBCQUFPO0FBVXBCOztHQUVHO0FBQ1UsUUFBQSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyJ9