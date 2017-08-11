"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("../expression_parser/lexer");
var parser_1 = require("../expression_parser/parser");
var html = require("../ml_parser/ast");
var html_tags_1 = require("../ml_parser/html_tags");
var i18n = require("./i18n_ast");
var placeholder_1 = require("./serializers/placeholder");
var _expParser = new parser_1.Parser(new lexer_1.Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 */
function createI18nMessageFactory(interpolationConfig) {
    var visitor = new _I18nVisitor(_expParser, interpolationConfig);
    return function (nodes, meaning, description, id) {
        return visitor.toI18nMessage(nodes, meaning, description, id);
    };
}
exports.createI18nMessageFactory = createI18nMessageFactory;
var _I18nVisitor = (function () {
    function _I18nVisitor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
    }
    _I18nVisitor.prototype.toI18nMessage = function (nodes, meaning, description, id) {
        this._isIcu = nodes.length == 1 && nodes[0] instanceof html.Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new placeholder_1.PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        var i18nodes = html.visitAll(this, nodes, {});
        return new i18n.Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    };
    _I18nVisitor.prototype.visitElement = function (el, context) {
        var children = html.visitAll(this, el.children);
        var attrs = {};
        el.attrs.forEach(function (attr) {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        var isVoid = html_tags_1.getHtmlTagDefinition(el.name).isVoid;
        var startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = el.sourceSpan.toString();
        var closePhName = '';
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = "</" + el.name + ">";
        }
        return new i18n.TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, el.sourceSpan);
    };
    _I18nVisitor.prototype.visitAttribute = function (attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    };
    _I18nVisitor.prototype.visitText = function (text, context) {
        return this._visitTextWithInterpolation(text.value, text.sourceSpan);
    };
    _I18nVisitor.prototype.visitComment = function (comment, context) { return null; };
    _I18nVisitor.prototype.visitExpansion = function (icu, context) {
        var _this = this;
        this._icuDepth++;
        var i18nIcuCases = {};
        var i18nIcu = new i18n.Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach(function (caze) {
            i18nIcuCases[caze.value] = new i18n.Container(caze.expression.map(function (node) { return node.visit(_this, {}); }), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            var expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations. We need to create a new visitor (they are not re-entrant) to compute the
        // message id.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        var phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        var visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
        return new i18n.IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    };
    _I18nVisitor.prototype.visitExpansionCase = function (icuCase, context) {
        throw new Error('Unreachable code');
    };
    _I18nVisitor.prototype._visitTextWithInterpolation = function (text, sourceSpan) {
        var splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new i18n.Text(text, sourceSpan);
        }
        // Return a group of text + expressions
        var nodes = [];
        var container = new i18n.Container(nodes, sourceSpan);
        var _a = this._interpolationConfig, sDelimiter = _a.start, eDelimiter = _a.end;
        for (var i = 0; i < splitInterpolation.strings.length - 1; i++) {
            var expression = splitInterpolation.expressions[i];
            var baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
            var phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new i18n.Text(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new i18n.Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        // The last index contains no expression
        var lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new i18n.Text(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    };
    return _I18nVisitor;
}());
var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
function _extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaTE4bi9pMThuX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG9EQUFvRTtBQUNwRSxzREFBdUU7QUFDdkUsdUNBQXlDO0FBQ3pDLG9EQUE0RDtBQUk1RCxpQ0FBbUM7QUFDbkMseURBQThEO0FBRTlELElBQU0sVUFBVSxHQUFHLElBQUksZUFBZ0IsQ0FBQyxJQUFJLGFBQWUsRUFBRSxDQUFDLENBQUM7QUFFL0Q7O0dBRUc7QUFDSCxrQ0FBeUMsbUJBQXdDO0lBRS9FLElBQU0sT0FBTyxHQUFHLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBRWxFLE1BQU0sQ0FBQyxVQUFDLEtBQWtCLEVBQUUsT0FBZSxFQUFFLFdBQW1CLEVBQUUsRUFBVTtRQUNqRSxPQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQXRELENBQXNELENBQUM7QUFDcEUsQ0FBQztBQU5ELDREQU1DO0FBRUQ7SUFPRSxzQkFDWSxpQkFBbUMsRUFDbkMsb0JBQXlDO1FBRHpDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFxQjtJQUFHLENBQUM7SUFFbEQsb0NBQWEsR0FBcEIsVUFBcUIsS0FBa0IsRUFBRSxPQUFlLEVBQUUsV0FBbUIsRUFBRSxFQUFVO1FBRXZGLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLG9CQUFvQixH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