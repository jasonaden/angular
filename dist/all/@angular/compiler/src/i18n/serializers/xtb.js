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
Object.defineProperty(exports, "__esModule", { value: true });
var ml = require("../../ml_parser/ast");
var xml_parser_1 = require("../../ml_parser/xml_parser");
var i18n = require("../i18n_ast");
var parse_util_1 = require("../parse_util");
var serializer_1 = require("./serializer");
var xmb_1 = require("./xmb");
var _TRANSLATIONS_TAG = 'translationbundle';
var _TRANSLATION_TAG = 'translation';
var _PLACEHOLDER_TAG = 'ph';
var Xtb = (function (_super) {
    __extends(Xtb, _super);
    function Xtb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xtb.prototype.write = function (messages, locale) { throw new Error('Unsupported'); };
    Xtb.prototype.load = function (content, url) {
        // xtb to xml nodes
        var xtbParser = new XtbParser();
        var _a = xtbParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var valueFn = function () {
                var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, errors = _a.errors;
                if (errors.length) {
                    throw new Error("xtb parse errors:\n" + errors.join('\n'));
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error("xtb parse errors:\n" + errors.join('\n'));
        }
        return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
    };
    Xtb.prototype.digest = function (message) { return xmb_1.digest(message); };
    Xtb.prototype.createNameMapper = function (message) {
        return new serializer_1.SimplePlaceholderMapper(message, xmb_1.toPublicName);
    };
    return Xtb;
}(serializer_1.Serializer));
exports.Xtb = Xtb;
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: function () {
            var value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value: value });
            return value;
        },
        set: function (_) { throw new Error('Could not overwrite an XTB translation'); },
    });
}
// Extract messages as xml nodes from the xtb file
var XtbParser = (function () {
    function XtbParser() {
        this._locale = null;
    }
    XtbParser.prototype.parse = function (xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        var xml = new xml_parser_1.XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    XtbParser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                }
                var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                ml.visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        var innerTextStart = element.startSourceSpan.end.offset;
                        var innerTextEnd = element.endSourceSpan.start.offset;
                        var content = element.startSourceSpan.start.file.content;
                        var innerText = content.slice(innerTextStart, innerTextEnd);
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    };
    XtbParser.prototype.visitAttribute = function (attribute, context) { };
    XtbParser.prototype.visitText = function (text, context) { };
    XtbParser.prototype.visitComment = function (comment, context) { };
    XtbParser.prototype.visitExpansion = function (expansion, context) { };
    XtbParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    XtbParser.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XtbParser;
}());
// Convert ml nodes (xtb syntax) to i18n nodes
var XmlToI18n = (function () {
    function XmlToI18n() {
    }
    XmlToI18n.prototype.convert = function (message, url) {
        var xmlIcu = new xml_parser_1.XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    XmlToI18n.prototype.visitText = function (text, context) { return new i18n.Text(text.value, text.sourceSpan); };
    XmlToI18n.prototype.visitExpansion = function (icu, context) {
        var caseMap = {};
        ml.visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression),
        };
    };
    XmlToI18n.prototype.visitElement = function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            var nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"name\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
        return null;
    };
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vc2VyaWFsaXplcnMveHRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHdDQUEwQztBQUMxQyx5REFBcUQ7QUFDckQsa0NBQW9DO0FBQ3BDLDRDQUF3QztBQUV4QywyQ0FBb0Y7QUFDcEYsNkJBQTJDO0FBRTNDLElBQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFDOUMsSUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7QUFDdkMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFFOUI7SUFBeUIsdUJBQVU7SUFBbkM7O0lBdUNBLENBQUM7SUF0Q0MsbUJBQUssR0FBTCxVQUFNLFFBQXdCLEVBQUUsTUFBbUIsSUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRyxrQkFBSSxHQUFKLFVBQUssT0FBZSxFQUFFLEdBQVc7UUFFL0IsbUJBQW1CO1FBQ25CLElBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDNUIsSUFBQSxrQ0FBNkQsRUFBNUQsa0JBQU0sRUFBRSw0QkFBVyxFQUFFLGtCQUFNLENBQWtDO1FBRXBFLDBCQUEwQjtRQUMxQixJQUFNLGdCQUFnQixHQUFtQyxFQUFFLENBQUM7UUFDNUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUVsQyw4RkFBOEY7UUFDOUYsNkZBQTZGO1FBQzdGLFlBQVk7UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7WUFDcEMsSUFBTSxPQUFPLEdBQUc7Z0JBQ1IsSUFBQSwrQ0FBZ0UsRUFBL0Qsd0JBQVMsRUFBRSxrQkFBTSxDQUErQztnQkFDdkUsRUFBRSxDQUFDLENB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