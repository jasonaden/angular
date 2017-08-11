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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vYW5ndWxhcjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUErTUg7SUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUdELElBQUksT0FBTyxHQVFGO0lBQ1AsU0FBUyxFQUFFLElBQUk7SUFDZixNQUFNLEVBQUUsSUFBSTtJQUNaLE9BQU8sRUFBRSxJQUFJO0lBQ2IsT0FBTyxFQUFFLElBQUk7SUFDYixlQUFlLEVBQUUsSUFBSTtJQUNyQixjQUFjLEVBQUUsSUFBSTtDQUNyQixDQUFDO0FBRUYsSUFBSSxDQUFDO0lBQ0gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsT0FBTyxHQUFTLE1BQU8sQ0FBQyxPQUFPLENBQUM7SUFDbEMsQ0FBQztBQUNILENBQUM7QUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsc0JBQXNCO0FBQ3hCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCx1QkFBOEIsRUFBTztJQUNuQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQUZELHNDQUVDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRkQsc0NBRUM7QUFFWSxRQUFBLFNBQVMsR0FDbEIsVUFBQyxDQUFVLEVBQUUsT0FBaUMsRUFBRSxNQUFnQztJQUM1RSxPQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFBckMsQ0FBcUMsQ0FBQztBQUVqQyxRQUFBLE1BQU0sR0FBRyxVQUFDLE1BQWMsRUFBRSxZQUF1QjtJQUMxRCxPQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQztBQUFwQyxDQUFvQyxDQUFDO0FBRTVCLFFBQUEsT0FBTyxHQUFHLFVBQUMsQ0FBbUIsSUFBSyxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQWxCLENBQWtCLENBQUM7QUFFdEQsUUFBQSxlQUFlLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBekIsQ0FBeUIsQ0FBQztBQUVsRCxRQUFBLGNBQWMsR0FBRyxVQUFDLENBQVUsSUFBSyxPQUFBLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUM7QUFFM0QsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyJ9