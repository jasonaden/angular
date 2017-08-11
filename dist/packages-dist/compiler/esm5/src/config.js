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
import { ViewEncapsulation } from '@angular/core';
var CompilerConfig = (function () {
    /**
     * @param {?=} __0
     */
    function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.defaultEncapsulation, defaultEncapsulation = _c === void 0 ? ViewEncapsulation.Emulated : _c, _d = _b.useJit, useJit = _d === void 0 ? true : _d, missingTranslation = _b.missingTranslation, enableLegacyTemplate = _b.enableLegacyTemplate;
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.missingTranslation = missingTranslation || null;
        this.enableLegacyTemplate = enableLegacyTemplate !== false;
    }
    return CompilerConfig;
}());
export { CompilerConfig };
function CompilerConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    CompilerConfig.prototype.defaultEncapsulation;
    /** @type {?} */
    CompilerConfig.prototype.enableLegacyTemplate;
    /** @type {?} */
    CompilerConfig.prototype.useJit;
    /** @type {?} */
    CompilerConfig.prototype.missingTranslation;
}
//# sourceMappingURL=config.js.map