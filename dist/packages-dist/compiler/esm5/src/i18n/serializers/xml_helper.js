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
 * @record
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */ export function IVisitor() { }
function IVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    IVisitor.prototype.visitTag;
    /** @type {?} */
    IVisitor.prototype.visitText;
    /** @type {?} */
    IVisitor.prototype.visitDeclaration;
    /** @type {?} */
    IVisitor.prototype.visitDoctype;
}
var _Visitor = (function () {
    function _Visitor() {
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    _Visitor.prototype.visitTag = function (tag) {
        var _this = this;
        var /** @type {?} */ strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return "<" + tag.name + strAttrs + "/>";
        }
        var /** @type {?} */ strChildren = tag.children.map(function (node) { return node.visit(_this); });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
    };
    /**
     * @param {?} text
     * @return {?}
     */
    _Visitor.prototype.visitText = function (text) { return text.value; };
    /**
     * @param {?} decl
     * @return {?}
     */
    _Visitor.prototype.visitDeclaration = function (decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
    };
    /**
     * @param {?} attrs
     * @return {?}
     */
    _Visitor.prototype._serializeAttributes = function (attrs) {
        var /** @type {?} */ strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    };
    /**
     * @param {?} doctype
     * @return {?}
     */
    _Visitor.prototype.visitDoctype = function (doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
    };
    return _Visitor;
}());
var /** @type {?} */ _visitor = new _Visitor();
/**
 * @param {?} nodes
 * @return {?}
 */
export function serialize(nodes) {
    return nodes.map(function (node) { return node.visit(_visitor); }).join('');
}
/**
 * @record
 */
export function Node() { }
function Node_tsickle_Closure_declarations() {
    /** @type {?} */
    Node.prototype.visit;
}
var Declaration = (function () {
    /**
     * @param {?} unescapedAttrs
     */
    function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Declaration.prototype.visit = function (visitor) { return visitor.visitDeclaration(this); };
    return Declaration;
}());
export { Declaration };
function Declaration_tsickle_Closure_declarations() {
    /** @type {?} */
    Declaration.prototype.attrs;
}
var Doctype = (function () {
    /**
     * @param {?} rootTag
     * @param {?} dtd
     */
    function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    Doctype.prototype.visit = function (visitor) { return visitor.visitDoctype(this); };
    return Doctype;
}());
export { Doctype };
function Doctype_tsickle_Closure_declarations() {
    /** @type {?} */
    Doctype.prototype.rootTag;
    /** @type {?} */
    Doctype.prototype.dtd;
}
var Tag = (function () {
    /**
     * @param {?} name
     * @param {?=} unescapedAttrs
     * @param {?=} children
     */
    function Tag(name, unescapedAttrs, children) {
        if (unescapedAttrs === void 0) { unescapedAttrs = {}; }
        if (children === void 0) { children = []; }
        var _this = this;
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Tag.prototype.visit = function (visitor) { return visitor.visitTag(this); };
    return Tag;
}());
export { Tag };
function Tag_tsickle_Closure_declarations() {
    /** @type {?} */
    Tag.prototype.attrs;
    /** @type {?} */
    Tag.prototype.name;
    /** @type {?} */
    Tag.prototype.children;
}
var Text = (function () {
    /**
     * @param {?} unescapedValue
     */
    function Text(unescapedValue) {
        this.value = _escapeXml(unescapedValue);
    }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    Text.prototype.visit = function (visitor) { return visitor.visitText(this); };
    return Text;
}());
export { Text };
function Text_tsickle_Closure_declarations() {
    /** @type {?} */
    Text.prototype.value;
}
var CR = (function (_super) {
    tslib_1.__extends(CR, _super);
    /**
     * @param {?=} ws
     */
    function CR(ws) {
        if (ws === void 0) { ws = 0; }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
    }
    return CR;
}(Text));
export { CR };
var /** @type {?} */ _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
/**
 * @param {?} text
 * @return {?}
 */
function _escapeXml(text) {
    return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
}
//# sourceMappingURL=xml_helper.js.map