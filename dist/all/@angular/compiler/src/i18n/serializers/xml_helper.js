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
var _Visitor = (function () {
    function _Visitor() {
    }
    _Visitor.prototype.visitTag = function (tag) {
        var _this = this;
        var strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return "<" + tag.name + strAttrs + "/>";
        }
        var strChildren = tag.children.map(function (node) { return node.visit(_this); });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
    };
    _Visitor.prototype.visitText = function (text) { return text.value; };
    _Visitor.prototype.visitDeclaration = function (decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
    };
    _Visitor.prototype._serializeAttributes = function (attrs) {
        var strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    };
    _Visitor.prototype.visitDoctype = function (doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
    };
    return _Visitor;
}());
var _visitor = new _Visitor();
function serialize(nodes) {
    return nodes.map(function (node) { return node.visit(_visitor); }).join('');
}
exports.serialize = serialize;
var Declaration = (function () {
    function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    Declaration.prototype.visit = function (visitor) { return visitor.visitDeclaration(this); };
    return Declaration;
}());
exports.Declaration = Declaration;
var Doctype = (function () {
    function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    ;
    Doctype.prototype.visit = function (visitor) { return visitor.visitDoctype(this); };
    return Doctype;
}());
exports.Doctype = Doctype;
var Tag = (function () {
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
    Tag.prototype.visit = function (visitor) { return visitor.visitTag(this); };
    return Tag;
}());
exports.Tag = Tag;
var Text = (function () {
    function Text(unescapedValue) {
        this.value = _escapeXml(unescapedValue);
    }
    ;
    Text.prototype.visit = function (visitor) { return visitor.visitText(this); };
    return Text;
}());
exports.Text = Text;
var CR = (function (_super) {
    __extends(CR, _super);
    function CR(ws) {
        if (ws === void 0) { ws = 0; }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
    }
    return CR;
}(Text));
exports.CR = CR;
var _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
function _escapeXml(text) {
    return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX2hlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3htbF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBU0g7SUFBQTtJQTBCQSxDQUFDO0lBekJDLDJCQUFRLEdBQVIsVUFBUyxHQUFRO1FBQWpCLGlCQVNDO1FBUkMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxNQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxPQUFJLENBQUM7UUFDckMsQ0FBQztRQUVELElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxNQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxTQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQUssR0FBRyxDQUFDLElBQUksTUFBRyxDQUFDO0lBQ3pFLENBQUM7SUFFRCw0QkFBUyxHQUFULFVBQVUsSUFBVSxJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVwRCxtQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBaUI7UUFDaEMsTUFBTSxDQUFDLFVBQVEsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBSyxDQUFDO0lBQzVELENBQUM7SUFFTyx1Q0FBb0IsR0FB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