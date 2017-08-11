"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
var html_tags_1 = require("@angular/compiler/src/ml_parser/html_tags");
function main() {
    describe('Node serializer', function () {
        var parser;
        beforeEach(function () { parser = new html_parser_1.HtmlParser(); });
        it('should support element', function () {
            var html = '<p></p>';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support attributes', function () {
            var html = '<p k="value"></p>';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support text', function () {
            var html = 'some text';
            var ast = parser.parse(html, 'url');
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support expansion', function () {
            var html = '{number, plural, =0 {none} =1 {one} other {many}}';
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support comment', function () {
            var html = '<!--comment-->';
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
        it('should support nesting', function () {
            var html = "<div i18n=\"meaning|desc\">\n        <span>{{ interpolation }}</span>\n        <!--comment-->\n        <p expansion=\"true\">\n          {number, plural, =0 {{sex, select, other {<b>?</b>}}}}\n        </p>                            \n      </div>";
            var ast = parser.parse(html, 'url', true);
            expect(serializeNodes(ast.rootNodes)).toEqual([html]);
        });
    });
}
exports.main = main;
var _SerializerVisitor = (function () {
    function _SerializerVisitor() {
    }
    _SerializerVisitor.prototype.visitElement = function (element, context) {
        if (html_tags_1.getHtmlTagDefinition(element.name).isVoid) {
            return "<" + element.name + this._visitAll(element.attrs, ' ') + "/>";
        }
        return "<" + element.name + this._visitAll(element.attrs, ' ') + ">" + this._visitAll(element.children) + "</" + element.name + ">";
    };
    _SerializerVisitor.prototype.visitAttribute = function (attribute, context) {
        return attribute.name + "=\"" + attribute.value + "\"";
    };
    _SerializerVisitor.prototype.visitText = function (text, context) { return text.value; };
    _SerializerVisitor.prototype.visitComment = function (comment, context) { return "<!--" + comment.value + "-->"; };
    _SerializerVisitor.prototype.visitExpansion = function (expansion, context) {
        return "{" + expansion.switchValue + ", " + expansion.type + "," + this._visitAll(expansion.cases) + "}";
    };
    _SerializerVisitor.prototype.visitExpansionCase = function (expansionCase, context) {
        return " " + expansionCase.value + " {" + this._visitAll(expansionCase.expression) + "}";
    };
    _SerializerVisitor.prototype._visitAll = function (nodes, join) {
        var _this = this;
        if (join === void 0) { join = ''; }
        if (nodes.length == 0) {
            return '';
        }
        return join + nodes.map(function (a) { return a.visit(_this, null); }).join(join);
    };
    return _SerializerVisitor;
}());
var serializerVisitor = new _SerializerVisitor();
function serializeNodes(nodes) {
    return nodes.map(function (node) { return node.visit(serializerVisitor, null); });
}
exports.serializeNodes = serializeNodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0X3NlcmlhbGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWxfcGFyc2VyL2FzdF9zZXJpYWxpemVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwyRUFBdUU7QUFDdkUsdUVBQStFO0FBRS9FO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLElBQUksTUFBa0IsQ0FBQztRQUV2QixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQztZQUNqQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUU7WUFDeEIsSUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLElBQU0sR0FBRyxHQUFHLE1BQU0s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