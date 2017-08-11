"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var injectable_1 = require("../injectable");
var html_tags_1 = require("./html_tags");
var interpolation_config_1 = require("./interpolation_config");
var parser_1 = require("./parser");
var parser_2 = require("./parser");
exports.ParseTreeResult = parser_2.ParseTreeResult;
exports.TreeError = parser_2.TreeError;
var HtmlParser = (function (_super) {
    __extends(HtmlParser, _super);
    function HtmlParser() {
        return _super.call(this, html_tags_1.getHtmlTagDefinition) || this;
    }
    HtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
    };
    return HtmlParser;
}(parser_1.Parser));
HtmlParser = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [])
], HtmlParser);
exports.HtmlParser = HtmlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWxfcGFyc2VyL2h0bWxfcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDRDQUFpRDtBQUVqRCx5Q0FBaUQ7QUFDakQsK0RBQXlGO0FBQ3pGLG1DQUFpRDtBQUVqRCxtQ0FBb0Q7QUFBNUMsbUNBQUEsZUFBZSxDQUFBO0FBQUUsNkJBQUEsU0FBUyxDQUFBO0FBR2xDLElBQWEsVUFBVTtJQUFTLDhCQUFNO0lBQ3BDO2VBQWdCLGtCQUFNLGdDQUFvQixDQUFDO0lBQUUsQ0FBQztJQUU5QywwQkFBSyxHQUFMLFVBQ0ksTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBb0MsRUFDakUsbUJBQXVFO1FBRDFDLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ2pFLG9DQUFBLEVBQUEsc0JBQTJDLG1EQUE0QjtRQUN6RSxNQUFNLENBQUMsaUJBQU0sS0FBSyxZQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBZ0MsZUFBTSxHQVFyQztBQVJZLFVBQVU7SUFEdEIsK0JBQWtCLEVBQUU7O0dBQ1IsVUFBVSxDQVF0QjtBQVJZLGdDQUFVIn0=