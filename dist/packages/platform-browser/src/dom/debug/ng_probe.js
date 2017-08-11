/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as core from '@angular/core';
import { exportNgVar } from '../util';
const /** @type {?} */ CORE_TOKENS = {
    'ApplicationRef': core.ApplicationRef,
    'NgZone': core.NgZone,
};
const /** @type {?} */ INSPECT_GLOBAL_NAME = 'probe';
const /** @type {?} */ CORE_TOKENS_GLOBAL_NAME = 'coreTokens';
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
export class NgProbeToken {
    /**
     * @param {?} name
     * @param {?} token
     */
    constructor(name, token) {
        this.name = name;
        this.token = token;
    }
}
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
    const /** @type {?} */ tokens = (extraTokens || []).concat(coreTokens || []);
    exportNgVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    exportNgVar(CORE_TOKENS_GLOBAL_NAME, Object.assign({}, CORE_TOKENS, _ngProbeTokensToMap(tokens || [])));
    return () => inspectNativeElement;
}
/**
 * @param {?} tokens
 * @return {?}
 */
function _ngProbeTokensToMap(tokens) {
    return tokens.reduce((prev, t) => (prev[t.name] = t.token, prev), {});
}
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 */
export const /** @type {?} */ ELEMENT_PROBE_PROVIDERS = [
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