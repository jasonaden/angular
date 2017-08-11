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
 * @whatItDoes Represents the version of Angular
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7OztHQUlHO0FBQ0g7SUFDRSxpQkFBbUIsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBRW5DLHNCQUFJLDBCQUFLO2FBQVQsY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdkQsc0JBQUksMEJBQUs7YUFBVCxjQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV2RCxzQkFBSSwwQkFBSzthQUFULGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDekUsY0FBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksMEJBQU87QUFVcEI7O0dBRUc7QUFDVSxRQUFBLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDIn0=