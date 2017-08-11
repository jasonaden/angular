/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as core from '@angular/core';
import { exportNgVar } from '../util';
var /** @type {?} */ CORE_TOKENS = {
    'ApplicationRef': core.ApplicationRef,
    'NgZone': core.NgZone,
};
var /** @type {?} */ INSPECT_GLOBAL_NAME = 'probe';
var /** @type {?} */ CORE_TOKENS_GLOBAL_NAME = 'coreTokens';
/**
 * Returns a {\@link DebugElement} for the given native DOM element, or
 * null if the given native element does not have an Angular view associated
 * with it.
 * @param {?} element
 * @return {?}
 */
export function inspectNativeElement(element) {
    return core.getDebugNode(element);
}
/**
 * Deprecated. Use the one from '\@angular/core'.
 * @deprecated
 */
var NgProbeToken = (function () {
    /**
     * @param {?} name
     * @param {?} token
     */
    function NgProbeToken(name, token) {
        this.name = name;
        this.token = token;
    }
    return NgProbeToken;
}());
export { NgProbeToken };
function NgProbeToken_tsickle_Closure_declarations() {
    /** @type {?} */
    NgProbeToken.prototype.name;
    /** @type {?} */
    NgProbeToken.prototype.token;
}
/**
 * @param {?} extraTokens
 * @param {?} coreTokens
 * @return {?}
 */
export function _createNgProbe(extraTokens, coreTokens) {
    var /** @type {?} */ tokens = (extraTokens || []).concat(coreTokens || []);
    exportNgVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    exportNgVar(CORE_TOKENS_GLOBAL_NAME, tslib_1.__assign({}, CORE_TOKENS, _ngProbeTokensToMap(tokens || [])));
    return function () { return inspectNativeElement; };
}
/**
 * @param {?} tokens
 * @return {?}
 */
function _ngProbeTokensToMap(tokens) {
    return tokens.reduce(function (prev, t) { return (prev[t.name] = t.token, prev); }, {});
}
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 */
export var /** @type {?} */ ELEMENT_PROBE_PROVIDERS = [
    {
        provide: core.APP_INITIALIZER,
        useFactory: _createNgProbe,
        deps: [
            [NgProbeToken, new core.Optional()],
            [core.NgProbeToken, new core.Optional()],
        ],
        multi: true,
    },
];
//# sourceMappingURL=ng_probe.js.map