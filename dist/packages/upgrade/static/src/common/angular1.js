/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
let angular = {
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
export function setAngularLib(ng) {
    angular = ng;
}
/**
 * Returns the current version of the AngularJS library.
 *
 * @stable
 */
export function getAngularLib() {
    return angular;
}
export const bootstrap = (e, modules, config) => angular.bootstrap(e, modules, config);
export const module = (prefix, dependencies) => angular.module(prefix, dependencies);
export const element = (e) => angular.element(e);
export const resumeBootstrap = () => angular.resumeBootstrap();
export const getTestability = (e) => angular.getTestability(e);
export const version = angular.version;
//# sourceMappingURL=angular1.js.map