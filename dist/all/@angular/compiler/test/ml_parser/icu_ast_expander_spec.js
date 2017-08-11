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
var icu_ast_expander_1 = require("../../src/ml_parser/icu_ast_expander");
var ast_spec_utils_1 = require("./ast_spec_utils");
function main() {
    describe('Expander', function () {
        function expand(template) {
            var htmlParser = new html_parser_1.HtmlParser();
            var res = htmlParser.parse(template, 'url', true);
            return icu_ast_expander_1.expandNodes(res.rootNodes);
        }
        it('should handle the plural expansion form', function () {
            var res = expand("{messages.length, plural,=0 {zero<b>bold</b>}}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngPlural]', 'messages.length'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngPluralCase', '=0'],
                [html.Text, 'zero', 2],
                [html.Element, 'b', 2],
                [html.Text, 'bold', 3],
            ]);
        });
        it('should handle nested expansion forms', function () {
            var res = expand("{messages.length, plural, =0 { {p.gender, select, =m {m}} }}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngPlural]', 'messages.length'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngPluralCase', '=0'],
                [html.Element, 'ng-container', 2],
                [html.Attribute, '[ngSwitch]', 'p.gender'],
                [html.Element, 'ng-template', 3],
                [html.Attribute, 'ngSwitchCase', '=m'],
                [html.Text, 'm', 4],
                [html.Text, ' ', 2],
            ]);
        });
        it('should correctly set source code positions', function () {
            var nodes = expand("{messages.length, plural,=0 {<b>bold</b>}}").nodes;
            var container = nodes[0];
            expect(container.sourceSpan.start.col).toEqual(0);
            expect(container.sourceSpan.end.col).toEqual(42);
            expect(container.startSourceSpan.start.col).toEqual(0);
            expect(container.startSourceSpan.end.col).toEqual(42);
            expect(container.endSourceSpan.start.col).toEqual(0);
            expect(container.endSourceSpan.end.col).toEqual(42);
            var switchExp = container.attrs[0];
            expect(switchExp.sourceSpan.start.col).toEqual(1);
            expect(switchExp.sourceSpan.end.col).toEqual(16);
            var template = container.children[0];
            expect(template.sourceSpan.start.col).toEqual(25);
            expect(template.sourceSpan.end.col).toEqual(41);
            var switchCheck = template.attrs[0];
            expect(switchCheck.sourceSpan.start.col).toEqual(25);
            expect(switchCheck.sourceSpan.end.col).toEqual(28);
            var b = template.children[0];
            expect(b.sourceSpan.start.col).toEqual(29);
            expect(b.endSourceSpan.end.col).toEqual(40);
        });
        it('should handle other special forms', function () {
            var res = expand("{person.gender, select, male {m} other {default}}");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'ng-container', 0],
                [html.Attribute, '[ngSwitch]', 'person.gender'],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngSwitchCase', 'male'],
                [html.Text, 'm', 2],
                [html.Element, 'ng-template', 1],
                [html.Attribute, 'ngSwitchDefault', ''],
                [html.Text, 'default', 2],
            ]);
        });
        it('should parse an expansion form as a tag single child', function () {
            var res = expand("<div><span>{a, b, =4 {c}}</span></div>");
            expect(ast_spec_utils_1.humanizeNodes(res.nodes)).toEqual([
                [html.Element, 'div', 0],
                [html.Element, 'span', 1],
                [html.Element, 'ng-container', 2],
                [html.Attribute, '[ngSwitch]', 'a'],
                [html.Element, 'ng-template', 3],
                [html.Attribute, 'ngSwitchCase', '=4'],
                [html.Text, 'c', 4],
            ]);
        });
        describe('errors', function () {
            it('should error on unknown plural cases', function () {
                expect(humanizeErrors(expand('{n, plural, unknown {-}}').errors)).toEqual([
                    "Plural cases should be \"=<number>\" or one of zero, one, two, few, many, other",
                ]);
            });
        });
    });
}
exports.main = main;
function humanizeErrors(errors) {
    return errors.map(function (error) { return error.msg; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWN1X2FzdF9leHBhbmRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9tbF9wYXJzZXIvaWN1X2FzdF9leHBhbmRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWdEO0FBQ2hELCtEQUEyRDtBQUMzRCx5RUFBa0Y7QUFHbEYsbURBQStDO0FBRS9DO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixnQkFBZ0IsUUFBZ0I7WUFDOUIsSUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7WUFDcEMsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyw4QkFBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBRXJFLE1BQU0sQ0FBQyw4QkFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDdkMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLENBQUM7Z0JBQ2pELENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQztnQkFDdEMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsSUFBSSxDQUFD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