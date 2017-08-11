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
import { Parser } from './parser';
import { getXmlTagDefinition } from './xml_tags';
export { ParseTreeResult, TreeError } from './parser';
var XmlParser = (function (_super) {
    tslib_1.__extends(XmlParser, _super);
    function XmlParser() {
        return _super.call(this, getXmlTagDefinition) || this;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    XmlParser.prototype.parse = function (source, url, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms);
    };
    return XmlParser;
}(Parser));
export { XmlParser };
//# sourceMappingURL=xml_parser.js.map