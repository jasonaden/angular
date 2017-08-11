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
var digest_1 = require("../digest");
var i18n = require("../i18n_ast");
var parse_util_1 = require("../parse_util");
var serializer_1 = require("./serializer");
var xml = require("./xml_helper");
var _VERSION = '2.0';
var _XMLNS = 'urn:oasis:names:tc:xliff:document:2.0';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG = 'en';
var _PLACEHOLDER_TAG = 'ph';
var _PLACEHOLDER_SPANNING_TAG = 'pc';
var _XLIFF_TAG = 'xliff';
var _SOURCE_TAG = 'source';
var _TARGET_TAG = 'target';
var _UNIT_TAG = 'unit';
// http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
var Xliff2 = (function (_super) {
    __extends(Xliff2, _super);
    function Xliff2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xliff2.prototype.write = function (messages, locale) {
        var visitor = new _WriteVisitor();
        var units = [];
        messages.forEach(function (message) {
            var unit = new xml.Tag(_UNIT_TAG, { id: message.id });
            var notes = new xml.Tag('notes');
            if (message.description || message.meaning) {
                if (message.description) {
                    notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'description' }, [new xml.Text(message.description)]));
                }
                if (message.meaning) {
                    notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'meaning' }, [new xml.Text(message.meaning)]));
                }
            }
            message.sources.forEach(function (source) {
                notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'location' }, [
                    new xml.Text(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))
                ]));
            });
            notes.children.push(new xml.CR(6));
            unit.children.push(new xml.CR(6), notes);
            var segment = new xml.Tag('segment');
            segment.children.push(new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new xml.CR(6));
            unit.children.push(new xml.CR(6), segment, new xml.CR(4));
            units.push(new xml.CR(4), unit);
        });
        var file = new xml.Tag('file', { 'original': 'ng.template', id: 'ngi18n' }, units.concat([new xml.CR(2)]));
        var xliff = new xml.Tag(_XLIFF_TAG, { version: _VERSION, xmlns: _XMLNS, srcLang: locale || _DEFAULT_SOURCE_LANG }, [new xml.CR(2), file, new xml.CR()]);
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }), new xml.CR(), xliff, new xml.CR()
        ]);
    };
    Xliff2.prototype.load = function (content, url) {
        // xliff to xml nodes
        var xliff2Parser = new Xliff2Parser();
        var _a = xliff2Parser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff2 parse errors:\n" + errors.join('\n'));
        }
        return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
    };
    Xliff2.prototype.digest = function (message) { return digest_1.decimalDigest(message); };
    return Xliff2;
}(serializer_1.Serializer));
exports.Xliff2 = Xliff2;
var _WriteVisitor = (function () {
    function _WriteVisitor() {
    }
    _WriteVisitor.prototype.visitText = function (text, context) { return [new xml.Text(text.value)]; };
    _WriteVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    _WriteVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new xml.Text(c + " {")].concat(icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    _WriteVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        var type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            var tagPh = new xml.Tag(_PLACEHOLDER_TAG, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type: type,
                disp: "<" + ph.tag + "/>",
            });
            return [tagPh];
        }
        var tagPc = new xml.Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type: type,
            dispStart: "<" + ph.tag + ">",
            dispEnd: "</" + ph.tag + ">",
        });
        var nodes = [].concat.apply([], ph.children.map(function (node) { return node.visit(_this); }));
        if (nodes.length) {
            nodes.forEach(function (node) { return tagPc.children.push(node); });
        }
        else {
            tagPc.children.push(new xml.Text(''));
        }
        return [tagPc];
    };
    _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
        var idStr = (this._nextPlaceholderId++).toString();
        return [new xml.Tag(_PLACEHOLDER_TAG, {
                id: idStr,
                equiv: ph.name,
                disp: "{{" + ph.value + "}}",
            })];
    };
    _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        var cases = Object.keys(ph.value.cases).map(function (value) { return value + ' {...}'; }).join(' ');
        var idStr = (this._nextPlaceholderId++).toString();
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: idStr, equiv: ph.name, disp: "{" + ph.value.expression + ", " + ph.value.type + ", " + cases + "}" })];
    };
    _WriteVisitor.prototype.serialize = function (nodes) {
        var _this = this;
        this._nextPlaceholderId = 0;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor;
}());
// Extract messages as xml nodes from the xliff file
var Xliff2Parser = (function () {
    function Xliff2Parser() {
        this._locale = null;
    }
    Xliff2Parser.prototype.parse = function (xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var xml = new xml_parser_1.XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    Xliff2Parser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = null;
                var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, "Message " + id + " misses a translation");
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                var innerTextStart = element.startSourceSpan.end.offset;
                var innerTextEnd = element.endSourceSpan.start.offset;
                var content = element.startSourceSpan.start.file.content;
                var innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _XLIFF_TAG:
                var localeAttr = element.attrs.find(function (attr) { return attr.name === 'trgLang'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                var versionAttr = element.attrs.find(function (attr) { return attr.name === 'version'; });
                if (versionAttr) {
                    var version = versionAttr.value;
                    if (version !== '2.0') {
                        this._addError(element, "The XLIFF file version " + version + " is not compatible with XLIFF 2.0 serializer");
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                    }
                }
                break;
            default:
                ml.visitAll(this, element.children, null);
        }
    };
    Xliff2Parser.prototype.visitAttribute = function (attribute, context) { };
    Xliff2Parser.prototype.visitText = function (text, context) { };
    Xliff2Parser.prototype.visitComment = function (comment, context) { };
    Xliff2Parser.prototype.visitExpansion = function (expansion, context) { };
    Xliff2Parser.prototype.visitExpansionCase = function (expansionCase, context) { };
    Xliff2Parser.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return Xliff2Parser;
}());
// Convert ml nodes (xliff syntax) to i18n nodes
var XmlToI18n = (function () {
    function XmlToI18n() {
    }
    XmlToI18n.prototype.convert = function (message, url) {
        var xmlIcu = new xml_parser_1.XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] : [].concat.apply([], ml.visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    XmlToI18n.prototype.visitText = function (text, context) { return new i18n.Text(text.value, text.sourceSpan); };
    XmlToI18n.prototype.visitElement = function (el, context) {
        var _this = this;
        switch (el.name) {
            case _PLACEHOLDER_TAG:
                var nameAttr = el.attrs.find(function (attr) { return attr.name === 'equiv'; });
                if (nameAttr) {
                    return [new i18n.Placeholder('', nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equiv\" attribute");
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                var startAttr = el.attrs.find(function (attr) { return attr.name === 'equivStart'; });
                var endAttr = el.attrs.find(function (attr) { return attr.name === 'equivEnd'; });
                if (!startAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equivStart\" attribute");
                }
                else if (!endAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equivEnd\" attribute");
                }
                else {
                    var startId = startAttr.value;
                    var endId = endAttr.value;
                    var nodes = [];
                    return nodes.concat.apply(nodes, [new i18n.Placeholder('', startId, el.sourceSpan)].concat(el.children.map(function (node) { return node.visit(_this, null); }), [new i18n.Placeholder('', endId, el.sourceSpan)]));
                }
                break;
            default:
                this._addError(el, "Unexpected tag");
        }
        return null;
    };
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
            nodes: [].concat.apply([], ml.visitAll(this, icuCase.expression)),
        };
    };
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
function getTypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
        case 'b':
        case 'i':
        case 'u':
            return 'fmt';
        case 'img':
            return 'image';
        case 'a':
            return 'link';
        default:
            return 'other';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vc2VyaWFsaXplcnMveGxpZmYyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHdDQUEwQztBQUMxQyx5REFBcUQ7QUFDckQsb0NBQXdDO0FBQ3hDLGtDQUFvQztBQUNwQyw0Q0FBd0M7QUFFeEMsMkNBQXdDO0FBQ3hDLGtDQUFvQztBQUVwQyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdkIsSUFBTSxNQUFNLEdBQUcsdUNBQXVDLENBQUM7QUFDdkQseUNBQXlDO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBRXZDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQixJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDN0IsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUV6Qiw4RUFBOEU7QUFDOUU7SUFBNEIsMEJBQVU7SUFBdEM7O0lBZ0ZBLENBQUM7SUEvRUMsc0JBQUssR0FBTCxVQUFNLFFBQXdCLEVBQUUsTUFBbUI7UUFDakQsSUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNwQyxJQUFNLEtBQUssR0FBZSxFQUFFLENBQUM7UUFFN0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDdEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcs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