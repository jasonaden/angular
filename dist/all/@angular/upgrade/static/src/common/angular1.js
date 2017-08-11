"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
var angular = {
    bootstrap: noNg,
    module: noNg,
    element: noNg,
    version: noNg,
    resumeBootstrap: noNg,
    getTestability: noNg
};
try {
    if (window.hasOwnProperty('angular')) {
        angular = window.angular;
    }
}
catch (e) {
    // ignore in CJS mode.
}
/**
 * Resets the AngularJS library.
 *
 * Used when angularjs is loaded lazily, and not available on `window`.
 *
 * @stable
 */
function setAngularLib(ng) {
    angular = ng;
}
exports.setAngularLib = setAngularLib;
/**
 * Returns the current version of the AngularJS library.
 *
 * @stable
 */
function getAngularLib() {
    return angular;
}
exports.getAngularLib = getAngularLib;
exports.bootstrap = function (e, modules, config) {
    return angular.bootstrap(e, modules, config);
};
exports.module = function (prefix, dependencies) {
    return angular.module(prefix, dependencies);
};
exports.element = function (e) { return angular.element(e); };
exports.resumeBootstrap = function () { return angular.resumeBootstrap(); };
exports.getTestability = function (e) { return angular.getTestability(e); };
exports.version = angular.version;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvY29tbW9uL2FuZ3VsYXIxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBK01IO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFHRCxJQUFJLE9BQU8sR0FRRjtJQUNQLFNBQVMsRUFBRSxJQUFJO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsZUFBZSxFQUFFLElBQUk7SUFDckIsY0FBYyxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUVGLElBQUksQ0FBQztJQUNILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sR0FBUyxNQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNYLHNCQUFzQjtBQUN4QixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsdUJBQThCLEVBQU87SUFDbkMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFGRCxzQ0FFQztBQUVEOzs7O0dBSUc7QUFDSDtJQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUZELHNDQUVDO0FBRVksUUFBQSxTQUFTLEdBQ2xCLFVBQUMsQ0FBVSxFQUFFLE9BQWlDLEVBQUUsTUFBZ0M7SUFDNUUsT0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQXJDLENBQXFDLENBQUM7QUFFakMsUUFBQSxNQUFNLEdBQUcsVUFBQyxNQUFjLEVBQUUsWUFBdUI7SUFDMUQsT0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFBcEMsQ0FBb0MsQ0FBQztBQUU1QixRQUFBLE9BQU8sR0FBRyxVQUFDLENBQW1CLElBQUssT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDO0FBRXRELFFBQUEsZUFBZSxHQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQXpCLENBQXlCLENBQUM7QUFFbEQsUUFBQSxjQUFjLEdBQUcsVUFBQyxDQUFVLElBQUssT0FBQSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUF6QixDQUF5QixDQUFDO0FBRTNELFFBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMifQ==