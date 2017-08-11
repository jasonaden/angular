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
import { CompilerInjectable } from '../injectable';
import { getHtmlTagDefinition } from './html_tags';
import { DEFAULT_INTERPOLATION_CONFIG } from './interpolation_config';
import { Parser } from './parser';
export { ParseTreeResult, TreeError } from './parser';
var HtmlParser = (function (_super) {
    tslib_1.__extends(HtmlParser, _super);
    function HtmlParser() {
        return _super.call(this, getHtmlTagDefinition) || this;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    HtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
    };
    return HtmlParser;
}(Parser));
export { HtmlParser };
HtmlParser.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
HtmlParser.ctorParameters = function () { return []; };
function HtmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlParser.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HtmlParser.ctorParameters;
}
//# sourceMappingURL=html_parser.js.map