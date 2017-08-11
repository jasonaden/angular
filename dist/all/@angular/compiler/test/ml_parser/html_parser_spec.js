"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../../src/ml_parser/ast");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var lexer_1 = require("../../src/ml_parser/lexer");
var ast_spec_utils_1 = require("./ast_spec_utils");
function main() {
    describe('HtmlParser', function () {
        var parser;
        beforeEach(function () { parser = new html_parser_1.HtmlParser(); });
        describe('parse', function () {
            describe('text nodes', function () {
                it('should parse root level text nodes', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('a', 'TestComp'))).toEqual([[html.Text, 'a', 0]]);
                });
                it('should parse text nodes inside regular elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div>a</div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0], [html.Text, 'a', 1]
                    ]);
                });
                it('should parse text nodes inside <ng-template> elements', function () {
                    // deprecated in 4.0
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<template>a</template>', 'TestComp'))).toEqual([
                        [html.Element, 'template', 0], [html.Text, 'a', 1]
                    ]);
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template>a</ng-template>', 'TestComp'))).toEqual([
                        [html.Element, 'ng-template', 0], [html.Text, 'a', 1]
                    ]);
                });
                it('should parse CDATA', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<![CDATA[text]]>', 'TestComp'))).toEqual([
                        [html.Text, 'text', 0]
                    ]);
                });
            });
            describe('elements', function () {
                it('should parse root level elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0]
                    ]);
                });
                it('should parse elements inside of regular elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div><span></span></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0], [html.Element, 'span', 1]
                    ]);
                });
                it('should parse elements inside  <ng-template> elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<template><span></span></template>', 'TestComp')))
                        .toEqual([[html.Element, 'template', 0], [html.Element, 'span', 1]]);
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template><span></span></ng-template>', 'TestComp')))
                        .toEqual([[html.Element, 'ng-template', 0], [html.Element, 'span', 1]]);
                });
                it('should support void elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<link rel="author license" href="/about">', 'TestComp')))
                        .toEqual([
                        [html.Element, 'link', 0],
                        [html.Attribute, 'rel', 'author license'],
                        [html.Attribute, 'href', '/about'],
                    ]);
                });
                it('should not error on void elements from HTML5 spec', function () {
                    // <base> - it can be present in head only
                    // <meta> - it can be present in head only
                    // <command> - obsolete
                    // <keygen> - obsolete
                    ['<map><area></map>', '<div><br></div>', '<colgroup><col></colgroup>',
                        '<div><embed></div>', '<div><hr></div>', '<div><img></div>', '<div><input></div>',
                        '<object><param>/<object>', '<audio><source></audio>', '<audio><track></audio>',
                        '<p><wbr></p>',
                    ].forEach(function (html) { expect(parser.parse(html, 'TestComp').errors).toEqual([]); });
                });
                it('should close void elements on text nodes', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<p>before<br>after</p>', 'TestComp'))).toEqual([
                        [html.Element, 'p', 0],
                        [html.Text, 'before', 1],
                        [html.Element, 'br', 1],
                        [html.Text, 'after', 1],
                    ]);
                });
                it('should support optional end tags', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div><p>1<p>2</div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Element, 'p', 1],
                        [html.Text, '1', 2],
                        [html.Element, 'p', 1],
                        [html.Text, '2', 2],
                    ]);
                });
                it('should support nested elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ul><li><ul><li></li></ul></li></ul>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ul', 0],
                        [html.Element, 'li', 1],
                        [html.Element, 'ul', 2],
                        [html.Element, 'li', 3],
                    ]);
                });
                it('should add the requiredParent', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><thead><tr head></tr></thead><tr noparent></tr><tbody><tr body></tr></tbody><tfoot><tr foot></tr></tfoot></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'thead', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'head', ''],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'noparent', ''],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'body', ''],
                        [html.Element, 'tfoot', 1],
                        [html.Element, 'tr', 2],
                        [html.Attribute, 'foot', ''],
                    ]);
                });
                it('should append the required parent considering ng-container', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><ng-container><tr></tr></ng-container></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'tbody', 1],
                        [html.Element, 'ng-container', 2],
                        [html.Element, 'tr', 3],
                    ]);
                });
                it('should append the required parent considering top level ng-container', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-container><tr></tr></ng-container><p></p>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-container', 0],
                        [html.Element, 'tr', 1],
                        [html.Element, 'p', 0],
                    ]);
                });
                it('should special case ng-container when adding a required parent', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<table><thead><ng-container><tr></tr></ng-container></thead></table>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'table', 0],
                        [html.Element, 'thead', 1],
                        [html.Element, 'ng-container', 2],
                        [html.Element, 'tr', 3],
                    ]);
                });
                it('should not add the requiredParent when the parent is a <ng-template>', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<template><tr></tr></template>', 'TestComp'))).toEqual([
                        [html.Element, 'template', 0],
                        [html.Element, 'tr', 1],
                    ]);
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template><tr></tr></ng-template>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-template', 0],
                        [html.Element, 'tr', 1],
                    ]);
                });
                // https://github.com/angular/angular/issues/5967
                it('should not add the requiredParent to a template root element', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<tr></tr>', 'TestComp'))).toEqual([
                        [html.Element, 'tr', 0],
                    ]);
                });
                it('should support explicit namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<myns:div></myns:div>', 'TestComp'))).toEqual([
                        [html.Element, ':myns:div', 0]
                    ]);
                });
                it('should support implicit namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg></svg>', 'TestComp'))).toEqual([
                        [html.Element, ':svg:svg', 0]
                    ]);
                });
                it('should propagate the namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<myns:div><p></p></myns:div>', 'TestComp'))).toEqual([
                        [html.Element, ':myns:div', 0],
                        [html.Element, ':myns:p', 1],
                    ]);
                });
                it('should match closing tags case sensitive', function () {
                    var errors = parser.parse('<DiV><P></p></dIv>', 'TestComp').errors;
                    expect(errors.length).toEqual(2);
                    expect(humanizeErrors(errors)).toEqual([
                        [
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:8'
                        ],
                        [
                            'dIv',
                            'Unexpected closing tag "dIv". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:12'
                        ],
                    ]);
                });
                it('should support self closing void elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<input />', 'TestComp'))).toEqual([
                        [html.Element, 'input', 0]
                    ]);
                });
                it('should support self closing foreign elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<math />', 'TestComp'))).toEqual([
                        [html.Element, ':math:math', 0]
                    ]);
                });
                it('should ignore LF immediately after textarea, pre and listing', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<p>\n</p><textarea>\n</textarea><pre>\n\n</pre><listing>\n\n</listing>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'p', 0],
                        [html.Text, '\n', 1],
                        [html.Element, 'textarea', 0],
                        [html.Element, 'pre', 0],
                        [html.Text, '\n', 1],
                        [html.Element, 'listing', 0],
                        [html.Text, '\n', 1],
                    ]);
                });
            });
            describe('attributes', function () {
                it('should parse attributes on regular elements case sensitive', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div kEy="v" key2=v2></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Attribute, 'kEy', 'v'],
                        [html.Attribute, 'key2', 'v2'],
                    ]);
                });
                it('should parse attributes without values', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<div k></div>', 'TestComp'))).toEqual([
                        [html.Element, 'div', 0],
                        [html.Attribute, 'k', ''],
                    ]);
                });
                it('should parse attributes on svg elements case sensitive', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg viewBox="0"></svg>', 'TestComp'))).toEqual([
                        [html.Element, ':svg:svg', 0],
                        [html.Attribute, 'viewBox', '0'],
                    ]);
                });
                it('should parse attributes on <ng-template> elements', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<template k="v"></template>', 'TestComp'))).toEqual([
                        [html.Element, 'template', 0],
                        [html.Attribute, 'k', 'v'],
                    ]);
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<ng-template k="v"></ng-template>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'ng-template', 0],
                        [html.Attribute, 'k', 'v'],
                    ]);
                });
                it('should support namespace', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<svg:use xlink:href="Port" />', 'TestComp'))).toEqual([
                        [html.Element, ':svg:use', 0],
                        [html.Attribute, ':xlink:href', 'Port'],
                    ]);
                });
            });
            describe('comments', function () {
                it('should preserve comments', function () {
                    expect(ast_spec_utils_1.humanizeDom(parser.parse('<!-- comment --><div></div>', 'TestComp'))).toEqual([
                        [html.Comment, 'comment', 0],
                        [html.Element, 'div', 0],
                    ]);
                });
            });
            describe('expansion forms', function () {
                it('should parse out expansion forms', function () {
                    var parsed = parser.parse("<div>before{messages.length, plural, =0 {You have <b>no</b> messages} =1 {One {{message}}}}after</div>", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Element, 'div', 0],
                        [html.Text, 'before', 1],
                        [html.Expansion, 'messages.length', 'plural', 1],
                        [html.ExpansionCase, '=0', 2],
                        [html.ExpansionCase, '=1', 2],
                        [html.Text, 'after', 1],
                    ]);
                    var cases = parsed.rootNodes[0].children[1].cases;
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(cases[0].expression, []))).toEqual([
                        [html.Text, 'You have ', 0],
                        [html.Element, 'b', 0],
                        [html.Text, 'no', 1],
                        [html.Text, ' messages', 0],
                    ]);
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(cases[1].expression, []))).toEqual([[html.Text, 'One {{message}}', 0]]);
                });
                it('should parse out expansion forms', function () {
                    var parsed = parser.parse("<div><span>{a, plural, =0 {b}}</span></div>", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Element, 'div', 0],
                        [html.Element, 'span', 1],
                        [html.Expansion, 'a', 'plural', 2],
                        [html.ExpansionCase, '=0', 3],
                    ]);
                });
                it('should parse out nested expansion forms', function () {
                    var parsed = parser.parse("{messages.length, plural, =0 { {p.gender, select, male {m}} }}", 'TestComp', true);
                    expect(ast_spec_utils_1.humanizeDom(parsed)).toEqual([
                        [html.Expansion, 'messages.length', 'plural', 0],
                        [html.ExpansionCase, '=0', 1],
                    ]);
                    var firstCase = parsed.rootNodes[0].cases[0];
                    expect(ast_spec_utils_1.humanizeDom(new html_parser_1.ParseTreeResult(firstCase.expression, []))).toEqual([
                        [html.Expansion, 'p.gender', 'select', 0],
                        [html.ExpansionCase, 'male', 1],
                        [html.Text, ' ', 0],
                    ]);
                });
                it('should error when expansion form is not closed', function () {
                    var p = parser.parse("{messages.length, plural, =0 {one}", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        [null, 'Invalid ICU message. Missing \'}\'.', '0:34']
                    ]);
                });
                it('should support ICU expressions with cases that contain numbers', function () {
                    var p = parser.parse("{sex, select, male {m} female {f} 0 {other}}", 'TestComp', true);
                    expect(p.errors.length).toEqual(0);
                });
                it('should error when expansion case is not closed', function () {
                    var p = parser.parse("{messages.length, plural, =0 {one", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        [null, 'Invalid ICU message. Missing \'}\'.', '0:29']
                    ]);
                });
                it('should error when invalid html in the case', function () {
                    var p = parser.parse("{messages.length, plural, =0 {<b/>}", 'TestComp', true);
                    expect(humanizeErrors(p.errors)).toEqual([
                        ['b', 'Only void and foreign elements can be self closed "b"', '0:30']
                    ]);
                });
            });
            describe('source spans', function () {
                it('should store the location', function () {
                    expect(ast_spec_utils_1.humanizeDomSourceSpans(parser.parse('<div [prop]="v1" (e)="do()" attr="v2" noValue>\na\n</div>', 'TestComp')))
                        .toEqual([
                        [html.Element, 'div', 0, '<div [prop]="v1" (e)="do()" attr="v2" noValue>'],
                        [html.Attribute, '[prop]', 'v1', '[prop]="v1"'],
                        [html.Attribute, '(e)', 'do()', '(e)="do()"'],
                        [html.Attribute, 'attr', 'v2', 'attr="v2"'],
                        [html.Attribute, 'noValue', '', 'noValue'],
                        [html.Text, '\na\n', 1, '\na\n'],
                    ]);
                });
                it('should set the start and end source spans', function () {
                    var node = parser.parse('<div>a</div>', 'TestComp').rootNodes[0];
                    expect(node.startSourceSpan.start.offset).toEqual(0);
                    expect(node.startSourceSpan.end.offset).toEqual(5);
                    expect(node.endSourceSpan.start.offset).toEqual(6);
                    expect(node.endSourceSpan.end.offset).toEqual(12);
                });
                it('should support expansion form', function () {
                    expect(ast_spec_utils_1.humanizeDomSourceSpans(parser.parse('<div>{count, plural, =0 {msg}}</div>', 'TestComp', true)))
                        .toEqual([
                        [html.Element, 'div', 0, '<div>'],
                        [html.Expansion, 'count', 'plural', 1, '{count, plural, =0 {msg}}'],
                        [html.ExpansionCase, '=0', 2, '=0 {msg}'],
                    ]);
                });
                it('should not report a value span for an attribute without a value', function () {
                    var ast = parser.parse('<div bar></div>', 'TestComp');
                    expect(ast.rootNodes[0].attrs[0].valueSpan).toBeUndefined();
                });
                it('should report a value span for an attribute with a value', function () {
                    var ast = parser.parse('<div bar="12"></div>', 'TestComp');
                    var attr = ast.rootNodes[0].attrs[0];
                    expect(attr.valueSpan.start.offset).toEqual(9);
                    expect(attr.valueSpan.end.offset).toEqual(13);
                });
            });
            describe('visitor', function () {
                it('should visit text nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('text', 'TestComp'));
                    expect(result).toEqual([[html.Text, 'text', 0]]);
                });
                it('should visit element nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('<div></div>', 'TestComp'));
                    expect(result).toEqual([[html.Element, 'div', 0]]);
                });
                it('should visit attribute nodes', function () {
                    var result = ast_spec_utils_1.humanizeDom(parser.parse('<div id="foo"></div>', 'TestComp'));
                    expect(result).toContain([html.Attribute, 'id', 'foo']);
                });
                it('should visit all nodes', function () {
                    var result = parser.parse('<div id="foo"><span id="bar">a</span><span>b</span></div>', 'TestComp');
                    var accumulator = [];
                    var visitor = new (function () {
                        function class_1() {
                        }
                        class_1.prototype.visit = function (node, context) { accumulator.push(node); };
                        class_1.prototype.visitElement = function (element, context) {
                            html.visitAll(this, element.attrs);
                            html.visitAll(this, element.children);
                        };
                        class_1.prototype.visitAttribute = function (attribute, context) { };
                        class_1.prototype.visitText = function (text, context) { };
                        class_1.prototype.visitComment = function (comment, context) { };
                        class_1.prototype.visitExpansion = function (expansion, context) {
                            html.visitAll(this, expansion.cases);
                        };
                        class_1.prototype.visitExpansionCase = function (expansionCase, context) { };
                        return class_1;
                    }());
                    html.visitAll(visitor, result.rootNodes);
                    expect(accumulator.map(function (n) { return n.constructor; })).toEqual([
                        html.Element, html.Attribute, html.Element, html.Attribute, html.Text, html.Element,
                        html.Text
                    ]);
                });
                it('should skip typed visit if visit() returns a truthy value', function () {
                    var visitor = new (function () {
                        function class_2() {
                        }
                        class_2.prototype.visit = function (node, context) { return true; };
                        class_2.prototype.visitElement = function (element, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitAttribute = function (attribute, context) {
                            throw Error('Unexpected');
                        };
                        class_2.prototype.visitText = function (text, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitComment = function (comment, context) { throw Error('Unexpected'); };
                        class_2.prototype.visitExpansion = function (expansion, context) {
                            throw Error('Unexpected');
                        };
                        class_2.prototype.visitExpansionCase = function (expansionCase, context) {
                            throw Error('Unexpected');
                        };
                        return class_2;
                    }());
                    var result = parser.parse('<div id="foo"></div><div id="bar"></div>', 'TestComp');
                    var traversal = html.visitAll(visitor, result.rootNodes);
                    expect(traversal).toEqual([true, true]);
                });
            });
            describe('errors', function () {
                it('should report unexpected closing tags', function () {
                    var errors = parser.parse('<div></p></div>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([[
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:5'
                        ]]);
                });
                it('should report subsequent open tags without proper close tag', function () {
                    var errors = parser.parse('<div</div>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([[
                            'div',
                            'Unexpected closing tag "div". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:4'
                        ]]);
                });
                it('should report closing tag for void elements', function () {
                    var errors = parser.parse('<input></input>', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['input', 'Void elements do not have end tags "input"', '0:7']
                    ]);
                });
                it('should report self closing html element', function () {
                    var errors = parser.parse('<p />', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['p', 'Only void and foreign elements can be self closed "p"', '0:0']
                    ]);
                });
                it('should report self closing custom element', function () {
                    var errors = parser.parse('<my-cmp />', 'TestComp').errors;
                    expect(errors.length).toEqual(1);
                    expect(humanizeErrors(errors)).toEqual([
                        ['my-cmp', 'Only void and foreign elements can be self closed "my-cmp"', '0:0']
                    ]);
                });
                it('should also report lexer errors', function () {
                    var errors = parser.parse('<!-err--><div></p></div>', 'TestComp').errors;
                    expect(errors.length).toEqual(2);
                    expect(humanizeErrors(errors)).toEqual([
                        [lexer_1.TokenType.COMMENT_START, 'Unexpected character "e"', '0:3'],
                        [
                            'p',
                            'Unexpected closing tag "p". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags',
                            '0:14'
                        ]
                    ]);
                });
            });
        });
    });
}
exports.main = main;
function humanizeErrors(errors) {
    return errors.map(function (e) {
        if (e instanceof html_parser_1.TreeError) {
            // Parser errors
            return [e.elementName, e.msg, ast_spec_utils_1.humanizeLineColumn(e.span.start)];
        }
        // Tokenizer errors
        return [e.tokenType, e.msg, ast_spec_utils_1.humanizeLineColumn(e.span.start)];
    });
}
exports.humanizeErrors = humanizeErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9wYXJzZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWxfcGFyc2VyL2h0bWxfcGFyc2VyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBZ0Q7QUFDaEQsK0RBQXVGO0FBQ3ZGLG1EQUFvRDtBQUdwRCxtREFBeUY7QUFFekY7SUFDRSxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQUksTUFBa0IsQ0FBQztRQUV2QixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2hCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtvQkFDdkMsTUFBTSxDQUFDLDRCQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7b0JBQ3BELE1BQU0sQ0FBQyw0QkFBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ3BFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7cUJBQzlDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsdURB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