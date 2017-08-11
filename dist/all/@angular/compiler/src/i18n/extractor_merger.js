"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../ml_parser/ast");
var parser_1 = require("../ml_parser/parser");
var i18n = require("./i18n_ast");
var i18n_parser_1 = require("./i18n_parser");
var parse_util_1 = require("./parse_util");
var _I18N_ATTR = 'i18n';
var _I18N_ATTR_PREFIX = 'i18n-';
var _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
var MEANING_SEPARATOR = '|';
var ID_SEPARATOR = '@@';
/**
 * Extract translatable messages from an html AST
 */
function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
    var visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.extract(nodes, interpolationConfig);
}
exports.extractMessages = extractMessages;
function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
    var visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.merge(nodes, translations, interpolationConfig);
}
exports.mergeTranslations = mergeTranslations;
var ExtractionResult = (function () {
    function ExtractionResult(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
    return ExtractionResult;
}());
exports.ExtractionResult = ExtractionResult;
var _VisitorMode;
(function (_VisitorMode) {
    _VisitorMode[_VisitorMode["Extract"] = 0] = "Extract";
    _VisitorMode[_VisitorMode["Merge"] = 1] = "Merge";
})(_VisitorMode || (_VisitorMode = {}));
/**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * @internal
 */
var _Visitor = (function () {
    function _Visitor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
    }
    /**
     * Extracts the messages from the tree
     */
    _Visitor.prototype.extract = function (nodes, interpolationConfig) {
        var _this = this;
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(function (node) { return node.visit(_this, null); });
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
    };
    /**
     * Returns a tree where all translatable nodes are translated
     */
    _Visitor.prototype.merge = function (nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        // Construct a single fake root element
        var wrapper = new html.Element('wrapper', [], nodes, undefined, undefined, undefined);
        var translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new parser_1.ParseTreeResult(translatedNode.children, this._errors);
    };
    _Visitor.prototype.visitExpansionCase = function (icuCase, context) {
        // Parse cases for translatable html attributes
        var expression = html.visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
            return new html.ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    };
    _Visitor.prototype.visitExpansion = function (icu, context) {
        this._mayBeAddBlockChildren(icu);
        var wasInIcu = this._inIcu;
        if (!this._inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this._isInTranslatableSection) {
                this._addMessage([icu]);
            }
            this._inIcu = true;
        }
        var cases = html.visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
            icu = new html.Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
    };
    _Visitor.prototype.visitComment = function (comment, context) {
        var isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
            this._reportError(comment, 'Could not start a block inside a translatable section');
            return;
        }
        var isClosing = _isClosingComment(comment);
        if (isClosing && !this._inI18nBlock) {
            this._reportError(comment, 'Trying to close an unopened block');
            return;
        }
        if (!this._inI18nNode && !this._inIcu) {
            if (!this._inI18nBlock) {
                if (isOpening) {
                    this._inI18nBlock = true;
                    this._blockStartDepth = this._depth;
                    this._blockChildren = [];
                    this._blockMeaningAndDesc =
                        comment.value.replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
                    this._openTranslatableSection(comment);
                }
            }
            else {
                if (isClosing) {
                    if (this._depth == this._blockStartDepth) {
                        this._closeTranslatableSection(comment, this._blockChildren);
                        this._inI18nBlock = false;
                        var message = this._addMessage(this._blockChildren, this._blockMeaningAndDesc);
                        // merge attributes in sections
                        var nodes = this._translateMessage(comment, message);
                        return html.visitAll(this, nodes);
                    }
                    else {
                        this._reportError(comment, 'I18N blocks should not cross element boundaries');
                        return;
                    }
                }
            }
        }
    };
    _Visitor.prototype.visitText = function (text, context) {
        if (this._isInTranslatableSection) {
            this._mayBeAddBlockChildren(text);
        }
        return text;
    };
    _Visitor.prototype.visitElement = function (el, context) {
        var _this = this;
        this._mayBeAddBlockChildren(el);
        this._depth++;
        var wasInI18nNode = this._inI18nNode;
        var wasInImplicitNode = this._inImplicitNode;
        var childNodes = [];
        var translatedChildNodes = undefined;
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        var i18nAttr = _getI18nAttr(el);
        var i18nMeta = i18nAttr ? i18nAttr.value : '';
        var isImplicit = this._implicitTags.some(function (tag) { return el.name === tag; }) && !this._inIcu &&
            !this._isInTranslatableSection;
        var isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this._inI18nNode = true;
                var message = this._addMessage(el.children, i18nMeta);
                translatedChildNodes = this._translateMessage(el, message);
            }
            if (this._mode == _VisitorMode.Extract) {
                var isTranslatable = i18nAttr || isTopLevelImplicit;
                if (isTranslatable)
                    this._openTranslatableSection(el);
                html.visitAll(this, el.children);
                if (isTranslatable)
                    this._closeTranslatableSection(el, el.children);
            }
        }
        else {
            if (i18nAttr || isTopLevelImplicit) {
                this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
            }
            if (this._mode == _VisitorMode.Extract) {
                // Descend into child nodes for extraction
                html.visitAll(this, el.children);
            }
        }
        if (this._mode === _VisitorMode.Merge) {
            var visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(function (child) {
                var visited = child.visit(_this, context);
                if (visited && !_this._isInTranslatableSection) {
                    // Do not add the children from translatable sections (= i18n blocks here)
                    // They will be added later in this loop when the block closes (i.e. on `<!-- /i18n -->`)
                    childNodes = childNodes.concat(visited);
                }
            });
        }
        this._visitAttributesOf(el);
        this._depth--;
        this._inI18nNode = wasInI18nNode;
        this._inImplicitNode = wasInImplicitNode;
        if (this._mode === _VisitorMode.Merge) {
            var translatedAttrs = this._translateAttributes(el);
            return new html.Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
    };
    _Visitor.prototype.visitAttribute = function (attribute, context) {
        throw new Error('unreachable code');
    };
    _Visitor.prototype._init = function (mode, interpolationConfig) {
        this._mode = mode;
        this._inI18nBlock = false;
        this._inI18nNode = false;
        this._depth = 0;
        this._inIcu = false;
        this._msgCountAtSectionStart = undefined;
        this._errors = [];
        this._messages = [];
        this._inImplicitNode = false;
        this._createI18nMessage = i18n_parser_1.createI18nMessageFactory(interpolationConfig);
    };
    // looks for translatable attributes
    _Visitor.prototype._visitAttributesOf = function (el) {
        var _this = this;
        var explicitAttrNameToValue = {};
        var implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(function (attr) { return attr.name.startsWith(_I18N_ATTR_PREFIX); })
            .forEach(function (attr) { return explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
            attr.value; });
        el.attrs.forEach(function (attr) {
            if (attr.name in explicitAttrNameToValue) {
                _this._addMessage([attr], explicitAttrNameToValue[attr.name]);
            }
            else if (implicitAttrNames.some(function (name) { return attr.name === name; })) {
                _this._addMessage([attr]);
            }
        });
    };
    // add a translatable message
    _Visitor.prototype._addMessage = function (ast, msgMeta) {
        if (ast.length == 0 ||
            ast.length == 1 && ast[0] instanceof html.Attribute && !ast[0].value) {
            // Do not create empty messages
            return null;
        }
        var _a = _parseMessageMeta(msgMeta), meaning = _a.meaning, description = _a.description, id = _a.id;
        var message = this._createI18nMessage(ast, meaning, description, id);
        this._messages.push(message);
        return message;
    };
    // Translates the given message given the `TranslationBundle`
    // This is used for translating elements / blocks - see `_translateAttributes` for attributes
    // no-op when called in extraction mode (returns [])
    _Visitor.prototype._translateMessage = function (el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
            var nodes = this._translations.get(message);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, "Translation unavailable for message id=\"" + this._translations.digest(message) + "\"");
        }
        return [];
    };
    // translate the attributes of an element and remove i18n specific attributes
    _Visitor.prototype._translateAttributes = function (el) {
        var _this = this;
        var attributes = el.attrs;
        var i18nParsedMessageMeta = {};
        attributes.forEach(function (attr) {
            if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                i18nParsedMessageMeta[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                    _parseMessageMeta(attr.value);
            }
        });
        var translatedAttributes = [];
        attributes.forEach(function (attr) {
            if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                // strip i18n specific attributes
                return;
            }
            if (attr.value && attr.value != '' && i18nParsedMessageMeta.hasOwnProperty(attr.name)) {
                var _a = i18nParsedMessageMeta[attr.name], meaning = _a.meaning, description = _a.description, id = _a.id;
                var message = _this._createI18nMessage([attr], meaning, description, id);
                var nodes = _this._translations.get(message);
                if (nodes) {
                    if (nodes.length == 0) {
                        translatedAttributes.push(new html.Attribute(attr.name, '', attr.sourceSpan));
                    }
                    else if (nodes[0] instanceof html.Text) {
                        var value = nodes[0].value;
                        translatedAttributes.push(new html.Attribute(attr.name, value, attr.sourceSpan));
                    }
                    else {
                        _this._reportError(el, "Unexpected translation for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
                    }
                }
                else {
                    _this._reportError(el, "Translation unavailable for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
                }
            }
            else {
                translatedAttributes.push(attr);
            }
        });
        return translatedAttributes;
    };
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     */
    _Visitor.prototype._mayBeAddBlockChildren = function (node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
            this._blockChildren.push(node);
        }
    };
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     */
    _Visitor.prototype._openTranslatableSection = function (node) {
        if (this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section start');
        }
        else {
            this._msgCountAtSectionStart = this._messages.length;
        }
    };
    Object.defineProperty(_Visitor.prototype, "_isInTranslatableSection", {
        /**
         * A translatable section could be:
         * - the content of translatable element,
         * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
         */
        get: function () {
            return this._msgCountAtSectionStart !== void 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Terminates a section.
     *
     * If a section has only one significant children (comments not significant) then we should not
     * keep the message from this children:
     *
     * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
     * - one for the <p> content with meaning and description,
     * - another one for the ICU message.
     *
     * In this case the last message is discarded as it contains less information (the AST is
     * otherwise identical).
     *
     * Note that we should still keep messages extracted from attributes inside the section (ie in the
     * ICU message here)
     */
    _Visitor.prototype._closeTranslatableSection = function (node, directChildren) {
        if (!this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section end');
            return;
        }
        var startIndex = this._msgCountAtSectionStart;
        var significantChildren = directChildren.reduce(function (count, node) { return count + (node instanceof html.Comment ? 0 : 1); }, 0);
        if (significantChildren == 1) {
            for (var i = this._messages.length - 1; i >= startIndex; i--) {
                var ast = this._messages[i].nodes;
                if (!(ast.length == 1 && ast[0] instanceof i18n.Text)) {
                    this._messages.splice(i, 1);
                    break;
                }
            }
        }
        this._msgCountAtSectionStart = undefined;
    };
    _Visitor.prototype._reportError = function (node, msg) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, msg));
    };
    return _Visitor;
}());
function _isOpeningComment(n) {
    return !!(n instanceof html.Comment && n.value && n.value.startsWith('i18n'));
}
function _isClosingComment(n) {
    return !!(n instanceof html.Comment && n.value && n.value === '/i18n');
}
function _getI18nAttr(p) {
    return p.attrs.find(function (attr) { return attr.name === _I18N_ATTR; }) || null;
}
function _parseMessageMeta(i18n) {
    if (!i18n)
        return { meaning: '', description: '', id: '' };
    var idIndex = i18n.indexOf(ID_SEPARATOR);
    var descIndex = i18n.indexOf(MEANING_SEPARATOR);
    var _a = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''], meaningAndDesc = _a[0], id = _a[1];
    var _b = (descIndex > -1) ?
        [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
        ['', meaningAndDesc], meaning = _b[0], description = _b[1];
    return { meaning: meaning, description: description, id: id };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yX21lcmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL2V4dHJhY3Rvcl9tZXJnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1Q0FBeUM7QUFFekMsOENBQW9EO0FBRXBELGlDQUFtQztBQUNuQyw2Q0FBdUQ7QUFDdkQsMkNBQXVDO0FBR3ZDLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUMxQixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQztBQUNsQyxJQUFNLDJCQUEyQixHQUFHLFNBQVMsQ0FBQztBQUM5QyxJQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUM5QixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7QUFFMUI7O0dBRUc7QUFDSCx5QkFDSSxLQUFrQixFQUFFLG1CQUF3QyxFQUFFLFlBQXNCLEVBQ3BGLGFBQXNDO0lBQ3hDLElBQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBTEQsMENBS0M7QUFFRCwyQkFDSSxLQUFrQixFQUFFLFlBQStCLEVBQUUsbUJBQXdDLEVBQzdGLFlBQXNCLEVBQUUsYUFBc0M7SUFDaEUsSUFBTSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBTEQsOENBS0M7QUFFRDtJQUNFLDBCQUFtQixRQUF3QixFQUFTLE1BQW1CO1FBQXBELGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVMsV0FB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