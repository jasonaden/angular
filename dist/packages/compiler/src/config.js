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
export class CompilerConfig {
    /**
     * @param {?=} __0
     */
    constructor({ defaultEncapsulation = ViewEncapsulation.Emulated, useJit = true, missingTranslation, enableLegacyTemplate } = {}) {
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.missingTranslation = missingTranslation || null;
        this.enableLegacyTemplate = enableLegacyTemplate !== false;
    }
}
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