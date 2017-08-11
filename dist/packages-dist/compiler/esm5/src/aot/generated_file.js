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
import { sourceUrl } from '../compile_metadata';
import { TypeScriptEmitter } from '../output/ts_emitter';
var GeneratedFile = (function () {
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} sourceOrStmts
     */
    function GeneratedFile(srcFileUrl, genFileUrl, sourceOrStmts) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        if (typeof sourceOrStmts === 'string') {
            this.source = sourceOrStmts;
            this.stmts = null;
        }
        else {
            this.source = null;
            this.stmts = sourceOrStmts;
        }
    }
    return GeneratedFile;
}());
export { GeneratedFile };
function GeneratedFile_tsickle_Closure_declarations() {
    /** @type {?} */
    GeneratedFile.prototype.source;
    /** @type {?} */
    GeneratedFile.prototype.stmts;
    /** @type {?} */
    GeneratedFile.prototype.srcFileUrl;
    /** @type {?} */
    GeneratedFile.prototype.genFileUrl;
}
/**
 * @param {?} file
 * @param {?=} preamble
 * @return {?}
 */
export function toTypeScript(file, preamble) {
    if (preamble === void 0) { preamble = ''; }
    if (!file.stmts) {
        throw new Error("Illegal state: No stmts present on GeneratedFile " + file.genFileUrl);
    }
    return new TypeScriptEmitter().emitStatements(sourceUrl(file.srcFileUrl), file.genFileUrl, file.stmts, preamble);
}
//# sourceMappingURL=generated_file.js.map