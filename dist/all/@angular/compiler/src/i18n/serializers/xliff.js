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
var _VERSION = '1.2';
var _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG = 'en';
var _PLACEHOLDER_TAG = 'x';
var _FILE_TAG = 'file';
var _SOURCE_TAG = 'source';
var _TARGET_TAG = 'target';
var _UNIT_TAG = 'trans-unit';
var _CONTEXT_GROUP_TAG = 'context-group';
var _CONTEXT_TAG = 'context';
// http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
// http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
var Xliff = (function (_super) {
    __extends(Xliff, _super);
    function Xliff() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xliff.prototype.write = function (messages, locale) {
        var visitor = new _WriteVisitor();
        var transUnits = [];
        messages.forEach(function (message) {
            var contextTags = [];
            message.sources.forEach(function (source) {
                var contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new xml.Text("" + source.startLine)]), new xml.CR(8));
                contextTags.push(new xml.CR(8), contextGroupTag);
            });
            var transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
            (_a = transUnit.children).push.apply(_a, [new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes))].concat(contextTags));
            if (message.description) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'description' }, [new xml.Text(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'meaning' }, [new xml.Text(message.meaning)]));
            }
            transUnit.children.push(new xml.CR(6));
            transUnits.push(new xml.CR(6), transUnit);
            var _a;
        });
        var body = new xml.Tag('body', {}, transUnits.concat([new xml.CR(4)]));
        var file = new xml.Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new xml.CR(4), body, new xml.CR(2)]);
        var xliff = new xml.Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }), new xml.CR(), xliff, new xml.CR()
        ]);
    };
    Xliff.prototype.load = function (content, url) {
        // xliff to xml nodes
        var xliffParser = new XliffParser();
        var _a = xliffParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff parse errors:\n" + errors.join('\n'));
        }
        return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
    };
    Xliff.prototype.digest = function (message) { return digest_1.digest(message); };
    return Xliff;
}(serializer_1.Serializer));
exports.Xliff = Xliff;
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
        var ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, 'equiv-text': "<" + ph.tag + "/>" })];
        }
        var startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, 'equiv-text': "<" + ph.tag + ">" });
        var closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype: ctype, 'equiv-text': "</" + ph.tag + ">" });
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': "{{" + ph.value + "}}" })];
    };
    _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        var equivText = "{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases).map(function (value) { return value + ' {...}'; }).join(' ') + "}";
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': equivText })];
    };
    _WriteVisitor.prototype.serialize = function (nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor;
}());
// TODO(vicb): add error management (structure)
// Extract messages as xml nodes from the xliff file
var XliffParser = (function () {
    function XliffParser() {
        this._locale = null;
    }
    XliffParser.prototype.parse = function (xliff, url) {
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
    XliffParser.prototype.visitElement = function (element, context) {
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
            case _FILE_TAG:
                var localeAttr = element.attrs.find(function (attr) { return attr.name === 'target-language'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                ml.visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                ml.visitAll(this, element.children, null);
        }
    };
    XliffParser.prototype.visitAttribute = function (attribute, context) { };
    XliffParser.prototype.visitText = function (text, context) { };
    XliffParser.prototype.visitComment = function (comment, context) { };
    XliffParser.prototype.visitExpansion = function (expansion, context) { };
    XliffParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    XliffParser.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XliffParser;
}());
// Convert ml nodes (xliff syntax) to i18n nodes
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
    XmlToI18n.prototype.visitElement = function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            var nameAttr = el.attrs.find(function (attr) { return attr.name === 'id'; });
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
        }
        else {
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
            nodes: ml.visitAll(this, icuCase.expression),
        };
    };
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
            return 'lb';
        case 'img':
            return 'image';
        default:
            return "x-" + tag;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaTE4bi9zZXJpYWxpemVycy94bGlmZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCx3Q0FBMEM7QUFDMUMseURBQXFEO0FBQ3JELG9DQUFpQztBQUNqQyxrQ0FBb0M7QUFDcEMsNENBQXdDO0FBRXhDLDJDQUF3QztBQUN4QyxrQ0FBb0M7QUFFcEMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLElBQU0sTUFBTSxHQUFHLHVDQUF1QyxDQUFDO0FBQ3ZELHlDQUF5QztBQUN6QyxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUU3QixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDekIsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM3QixJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUM7QUFDL0IsSUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7QUFDM0MsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBRS9CLDJEQUEyRDtBQUMzRCx1RkFBdUY7QUFDdkY7SUFBMkIseUJBQVU7SUFBckM7O0lBbUZBLENBQUM7SUFsRkMscUJBQUssR0FBTCxVQUFNLFFBQXdCLEVBQUUsTUFBbUI7UUFDakQsSUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNwQyxJQUFNLFVBQVUsR0FBZSxFQUFFLENBQUM7UUFFbEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDdEIsSUFBSSxXQUFXLEdBQWUsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBd0I7Z0JBQy9DLElBQUks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