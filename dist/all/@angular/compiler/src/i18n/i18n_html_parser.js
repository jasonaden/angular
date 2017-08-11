"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var interpolation_config_1 = require("../ml_parser/interpolation_config");
var parser_1 = require("../ml_parser/parser");
var digest_1 = require("./digest");
var extractor_merger_1 = require("./extractor_merger");
var xliff_1 = require("./serializers/xliff");
var xliff2_1 = require("./serializers/xliff2");
var xmb_1 = require("./serializers/xmb");
var xtb_1 = require("./serializers/xtb");
var translation_bundle_1 = require("./translation_bundle");
var I18NHtmlParser = (function () {
    function I18NHtmlParser(_htmlParser, translations, translationsFormat, missingTranslation, console) {
        if (missingTranslation === void 0) { missingTranslation = core_1.MissingTranslationStrategy.Warning; }
        this._htmlParser = _htmlParser;
        if (translations) {
            var serializer = createSerializer(translationsFormat);
            this._translationBundle =
                translation_bundle_1.TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
        }
        else {
            this._translationBundle =
                new translation_bundle_1.TranslationBundle({}, null, digest_1.digest, undefined, missingTranslation, console);
        }
    }
    I18NHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        var parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (parseResult.errors.length) {
            return new parser_1.ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return extractor_merger_1.mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
    };
    return I18NHtmlParser;
}());
exports.I18NHtmlParser = I18NHtmlParser;
function createSerializer(format) {
    format = (format || 'xlf').toLowerCase();
    switch (format) {
        case 'xmb':
            return new xmb_1.Xmb();
        case 'xtb':
            return new xtb_1.Xtb();
        case 'xliff2':
        case 'xlf2':
            return new xliff2_1.Xliff2();
        case 'xliff':
        case 'xlf':
        default:
            return new xliff_1.Xliff();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9odG1sX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL2kxOG5faHRtbF9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEU7QUFHOUUsMEVBQW9HO0FBQ3BHLDhDQUFvRDtBQUVwRCxtQ0FBZ0M7QUFDaEMsdURBQXFEO0FBRXJELDZDQUEwQztBQUMxQywrQ0FBNEM7QUFDNUMseUNBQXNDO0FBQ3RDLHlDQUFzQztBQUN0QywyREFBdUQ7QUFFdkQ7SUFNRSx3QkFDWSxXQUF1QixFQUFFLFlBQXFCLEVBQUUsa0JBQTJCLEVBQ25GLGtCQUFtRixFQUNuRixPQUFpQjtRQURqQixtQ0FBQSxFQUFBLHFCQUFpRCxpQ0FBMEIsQ0FBQyxPQUFPO1FBRDNFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBR2pDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsa0JBQWtCO2dCQUNuQixzQ0FBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGtCQUFrQjtnQkFDbkIsSUFBSSxzQ0FBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQU0sRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEYsQ0FBQztJQUNILENBQUM7SUFFRCw4QkFBSyxHQUFMLFVBQ0ksTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBb0MsRUFDakUsbUJBQXVFO1FBRDFDLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ2pFLG9DQUFBLEVBQUEsc0JBQTJDLG1EQUE0QjtRQUN6RSxJQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFbEYsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLHdCQUFlLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVELE1BQU0sQ0FBQyxvQ0FBaUIsQ0FDcEIsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFqQ0QsSUFpQ0M7QUFqQ1ksd0NBQWM7QUFtQzNCLDBCQUEwQixNQUFlO0lBQ3ZDLE1BQU0sR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUV6QyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxLQUFLO1lBQ1IsTUFBTSxDQUFDLElBQUksU0FBRyxFQUFFLENBQUM7UUFDbkIsS0FBSyxLQUFLO1lBQ1IsTUFBTSxDQUFDLElBQUksU0FBRyxFQUFFLENBQUM7UUFDbkIsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLE1BQU07WUFDVCxNQUFNLENBQUMsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUN0QixLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssS0FBSyxDQUFDO1FBQ1g7WUFDRSxNQUFNLENBQUMsSUFBSSxhQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0FBQ0gsQ0FBQyJ9