"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("../../../core/testing/src/testing_internal");
var css_lexer_1 = require("../../src/css_parser/css_lexer");
function main() {
    function tokenize(code, trackComments, mode) {
        if (trackComments === void 0) { trackComments = false; }
        if (mode === void 0) { mode = css_lexer_1.CssLexerMode.ALL; }
        var scanner = new css_lexer_1.CssLexer().scan(code, trackComments);
        scanner.setMode(mode);
        var tokens = [];
        var output = scanner.scan();
        while (output != null) {
            var error = output.error;
            if (error != null) {
                throw css_lexer_1.cssScannerError(css_lexer_1.getToken(error), css_lexer_1.getRawMessage(error));
            }
            tokens.push(output.token);
            output = scanner.scan();
        }
        return tokens;
    }
    testing_internal_1.describe('CssLexer', function () {
        testing_internal_1.it('should lex newline characters as whitespace when whitespace mode is on', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'];
            newlines.forEach(function (line) {
                var token = tokenize(line, false, css_lexer_1.CssLexerMode.ALL_TRACK_WS)[0];
                testing_internal_1.expect(token.type).toEqual(css_lexer_1.CssTokenType.Whitespace);
            });
        });
        testing_internal_1.it('should combined newline characters as one newline token when whitespace mode is on', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'].join('');
            var tokens = tokenize(newlines, false, css_lexer_1.CssLexerMode.ALL_TRACK_WS);
            testing_internal_1.expect(tokens.length).toEqual(1);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Whitespace);
        });
        testing_internal_1.it('should not consider whitespace or newline values at all when whitespace mode is off', function () {
            var newlines = ['\n', '\r\n', '\r', '\f'].join('');
            var tokens = tokenize(newlines);
            testing_internal_1.expect(tokens.length).toEqual(0);
        });
        testing_internal_1.it('should lex simple selectors and their inner properties', function () {
            var cssCode = '\n' +
                '  .selector { my-prop: my-value; }\n';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].strValue).toEqual('{');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[3].strValue).toEqual('my-prop');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[4].strValue).toEqual(':');
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[5].strValue).toEqual('my-value');
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[6].strValue).toEqual(';');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].strValue).toEqual('}');
        });
        testing_internal_1.it('should capture the column and line values for each token', function () {
            var cssCode = '#id {\n' +
                '  prop:value;\n' +
                '}';
            var tokens = tokenize(cssCode);
            // #
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[0].column).toEqual(0);
            testing_internal_1.expect(tokens[0].line).toEqual(0);
            // id
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].column).toEqual(1);
            testing_internal_1.expect(tokens[1].line).toEqual(0);
            // {
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].column).toEqual(4);
            testing_internal_1.expect(tokens[2].line).toEqual(0);
            // prop
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[3].column).toEqual(2);
            testing_internal_1.expect(tokens[3].line).toEqual(1);
            // :
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[4].column).toEqual(6);
            testing_internal_1.expect(tokens[4].line).toEqual(1);
            // value
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[5].column).toEqual(7);
            testing_internal_1.expect(tokens[5].line).toEqual(1);
            // ;
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[6].column).toEqual(12);
            testing_internal_1.expect(tokens[6].line).toEqual(1);
            // }
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].column).toEqual(0);
            testing_internal_1.expect(tokens[7].line).toEqual(2);
        });
        testing_internal_1.it('should lex quoted strings and escape accordingly', function () {
            var cssCode = 'prop: \'some { value } \\\' that is quoted\'';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.String);
            testing_internal_1.expect(tokens[2].strValue).toEqual('\'some { value } \\\' that is quoted\'');
        });
        testing_internal_1.it('should treat attribute operators as regular characters', function () {
            tokenize('^|~+*').forEach(function (token) { testing_internal_1.expect(token.type).toEqual(css_lexer_1.CssTokenType.Character); });
        });
        testing_internal_1.it('should lex numbers properly and set them as numbers', function () {
            var cssCode = '0 1 -2 3.0 -4.001';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[0].strValue).toEqual('0');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[1].strValue).toEqual('1');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[2].strValue).toEqual('-2');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[3].strValue).toEqual('3.0');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[4].strValue).toEqual('-4.001');
        });
        testing_internal_1.it('should lex @keywords', function () {
            var cssCode = '@import()@something';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.AtKeyword);
            testing_internal_1.expect(tokens[0].strValue).toEqual('@import');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('(');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].strValue).toEqual(')');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.AtKeyword);
            testing_internal_1.expect(tokens[3].strValue).toEqual('@something');
        });
        testing_internal_1.it('should still lex a number even if it has a dimension suffix', function () {
            var cssCode = '40% is 40 percent';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[0].strValue).toEqual('40');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('%');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('is');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[3].strValue).toEqual('40');
        });
        testing_internal_1.it('should allow escaped character and unicode character-strings in CSS selectors', function () {
            var cssCode = '\\123456 .some\\thing \{\}';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[0].strValue).toEqual('\\123456');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('some\\thing');
        });
        testing_internal_1.it('should distinguish identifiers and numbers from special characters', function () {
            var cssCode = 'one*two=-4+three-4-equals_value$';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[0].strValue).toEqual('one');
            testing_internal_1.expect(tokens[1].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[1].strValue).toEqual('*');
            testing_internal_1.expect(tokens[2].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[2].strValue).toEqual('two');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[3].strValue).toEqual('=');
            testing_internal_1.expect(tokens[4].type).toEqual(css_lexer_1.CssTokenType.Number);
            testing_internal_1.expect(tokens[4].strValue).toEqual('-4');
            testing_internal_1.expect(tokens[5].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[5].strValue).toEqual('+');
            testing_internal_1.expect(tokens[6].type).toEqual(css_lexer_1.CssTokenType.Identifier);
            testing_internal_1.expect(tokens[6].strValue).toEqual('three-4-equals_value');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Character);
            testing_internal_1.expect(tokens[7].strValue).toEqual('$');
        });
        testing_internal_1.it('should filter out comments and whitespace by default', function () {
            var cssCode = '.selector /* comment */ { /* value */ }';
            var tokens = tokenize(cssCode);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].strValue).toEqual('{');
            testing_internal_1.expect(tokens[3].strValue).toEqual('}');
        });
        testing_internal_1.it('should track comments when the flag is set to true', function () {
            var cssCode = '.selector /* comment */ { /* value */ }';
            var trackComments = true;
            var tokens = tokenize(cssCode, trackComments, css_lexer_1.CssLexerMode.ALL_TRACK_WS);
            testing_internal_1.expect(tokens[0].strValue).toEqual('.');
            testing_internal_1.expect(tokens[1].strValue).toEqual('selector');
            testing_internal_1.expect(tokens[2].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[3].type).toEqual(css_lexer_1.CssTokenType.Comment);
            testing_internal_1.expect(tokens[3].strValue).toEqual('/* comment */');
            testing_internal_1.expect(tokens[4].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[5].strValue).toEqual('{');
            testing_internal_1.expect(tokens[6].strValue).toEqual(' ');
            testing_internal_1.expect(tokens[7].type).toEqual(css_lexer_1.CssTokenType.Comment);
            testing_internal_1.expect(tokens[7].strValue).toEqual('/* value */');
        });
        testing_internal_1.describe('Selector Mode', function () {
            testing_internal_1.it('should throw an error if a selector is being parsed while in the wrong mode', function () {
                var cssCode = '.class > tag';
                var capturedMessage = undefined;
                try {
                    tokenize(cssCode, false, css_lexer_1.CssLexerMode.STYLE_BLOCK);
                }
                catch (e) {
                    capturedMessage = css_lexer_1.getRawMessage(e);
                }
                testing_internal_1.expect(capturedMessage).toMatch(/Unexpected character \[\>\] at column 0:7 in expression/g);
                capturedMessage = null;
                try {
                    tokenize(cssCode, false, css_lexer_1.CssLexerMode.SELECTOR);
                }
                catch (e) {
                    capturedMessage = css_lexer_1.getRawMessage(e);
                }
                testing_internal_1.expect(capturedMessage).toEqual(null);
            });
        });
        testing_internal_1.describe('Attribute Mode', function () {
            testing_internal_1.it('should consider attribute selectors as valid input and throw when an invalid modifier is used', function () {
                function tokenizeAttr(modifier) {
                    var cssCode = 'value' + modifier + '=\'something\'';
                    return tokenize(cssCode, false, css_lexer_1.CssLexerMode.ATTRIBUTE_SELECTOR);
                }
                testing_internal_1.expect(tokenizeAttr('*').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('|').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('^').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('$').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('~').length).toEqual(4);
                testing_internal_1.expect(tokenizeAttr('').length).toEqual(3);
                testing_internal_1.expect(function () { tokenizeAttr('+'); }).toThrow();
            });
        });
        testing_internal_1.describe('Media Query Mode', function () {
            testing_internal_1.it('should validate media queries with a reduced subset of valid characters', function () {
                function tokenizeQuery(code) {
                    return tokenize(code, false, css_lexer_1.CssLexerMode.MEDIA_QUERY);
                }
                // the reason why the numbers are so high is because MediaQueries keep
                // track of the whitespace values
                testing_internal_1.expect(tokenizeQuery('(prop: value)').length).toEqual(5);
                testing_internal_1.expect(tokenizeQuery('(prop: value) and (prop2: value2)').length).toEqual(11);
                testing_internal_1.expect(tokenizeQuery('tv and (prop: value)').length).toEqual(7);
                testing_internal_1.expect(tokenizeQuery('print and ((prop: value) or (prop2: value2))').length).toEqual(15);
                testing_internal_1.expect(tokenizeQuery('(content: \'something $ crazy inside &\')').length).toEqual(5);
                testing_internal_1.expect(function () { tokenizeQuery('(max-height: 10 + 20)'); }).toThrow();
                testing_internal_1.expect(function () { tokenizeQuery('(max-height: fifty < 100)'); }).toThrow();
            });
        });
        testing_internal_1.describe('Pseudo Selector Mode', function () {
            testing_internal_1.it('should validate pseudo selector identifiers with a reduced subset of valid characters', function () {
                function tokenizePseudo(code, withArgs) {
                    if (withArgs === void 0) { withArgs = false; }
                    var mode = withArgs ? css_lexer_1.CssLexerMode.PSEUDO_SELECTOR_WITH_ARGUMENTS :
                        css_lexer_1.CssLexerMode.PSEUDO_SELECTOR;
                    return tokenize(code, false, mode);
                }
                testing_internal_1.expect(tokenizePseudo('hover').length).toEqual(1);
                testing_internal_1.expect(tokenizePseudo('focus').length).toEqual(1);
                testing_internal_1.expect(tokenizePseudo('lang(en-us)', true).length).toEqual(4);
                testing_internal_1.expect(function () { tokenizePseudo('lang(something:broken)', true); }).toThrow();
                testing_internal_1.expect(function () { tokenizePseudo('not(.selector)', true); }).toThrow();
            });
        });
        testing_internal_1.describe('Style Block Mode', function () {
            testing_internal_1.it('should style blocks with a reduced subset of valid characters', function () {
                function tokenizeStyles(code) {
                    return tokenize(code, false, css_lexer_1.CssLexerMode.STYLE_BLOCK);
                }
                testing_internal_1.expect(tokenizeStyles("\n          key: value;\n          prop: 100;\n          style: value3!important;\n        ").length).toEqual(14);
                testing_internal_1.expect(function () { return tokenizeStyles(" key$: value; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: value$; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: value + 10; "); }).toThrow();
                testing_internal_1.expect(function () { return tokenizeStyles(" key: &value; "); }).toThrow();
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2xleGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2Nzc19wYXJzZXIvY3NzX2xleGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBZ0Y7QUFDaEYsNERBQXdJO0FBRXhJO0lBQ0Usa0JBQ0ksSUFBWSxFQUFFLGFBQThCLEVBQzVDLElBQXFDO1FBRHZCLDhCQUFBLEVBQUEscUJBQThCO1FBQzVDLHFCQUFBLEVBQUEsT0FBcUIsd0JBQVksQ0FBQyxHQUFHO1FBQ3ZDLElBQU0sT0FBTyxHQUFHLElBQUksb0JBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDekQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QixJQUFNLE1BQU0sR0FBZSxFQUFFLENBQUM7UUFDOUIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE9BQU8sTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sMkJBQWUsQ0FBQyxvQkFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLHlCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsMkJBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIscUJB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QyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLEtBQUs7WUFDTCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLElBQUk7WUFDSix5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLE9BQU87WUFDUCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLElBQUk7WUFDSix5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLFFBQVE7WUFDUix5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLElBQUk7WUFDSix5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLElBQUk7WUFDSix5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFNLE9BQU8sR0FBRyw4Q0FBOEMsQ0FBQztZQUMvRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQzNELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLElBQU8seUJBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7WUFDcEMsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXpDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxQyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCLElBQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDO1lBQ3RDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFOUMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLElBQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDO1lBQ3BDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLCtFQUErRSxFQUFFO1lBQ2xGLElBQU0sT0FBTyxHQUFHLDRCQUE0QixDQUFDO1lBQzdDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFL0MseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxvRUFBb0UsRUFBRTtZQUN2RSxJQUFNLE9BQU8sR0FBRyxrQ0FBa0MsQ0FBQztZQUNuRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFM0QseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxzREFBc0QsRUFBRTtZQUN6RCxJQUFNLE9BQU8sR0FBRyx5Q0FBeUMsQ0FBQztZQUMxRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLE9BQU8sR0FBRyx5Q0FBeUMsQ0FBQztZQUMxRCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDM0IsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsd0JBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUzRSx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFcEQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4Qyx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckQseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIscUJBQUUsQ0FBQyw2RUFBNkUsRUFBRTtnQkFDaEYsSUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO2dCQUUvQixJQUFJLGVBQWUsR0FBVyxTQUFXLENBQUM7Z0JBQzFDLElBQUksQ0FBQztvQkFDSCxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSx3QkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZUFBZSxHQUFHLHlCQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBRUQseUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUMsQ0FBQztnQkFDNUYsZUFBZSxHQUFHLElBQU0sQ0FBQztnQkFFekIsSUFBSSxDQUFDO29CQUNILFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLHdCQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWCxlQUFlLEdBQUcseUJBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFRCx5QkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixxQkFBRSxDQUFDLCtGQUErRixFQUMvRjtnQkFDRSxzQkFBc0IsUUFBZ0I7b0JBQ3BDLElBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7b0JBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSx3QkFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ25FLENBQUM7Z0JBRUQseUJBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1Qyx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLHlCQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMseUJBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1Qyx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLHlCQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFM0MseUJBQU0sQ0FBQyxjQUFRLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCwyQkFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLHFCQUFFLENBQUMseUVBQXlFLEVBQUU7Z0JBQzVFLHVCQUF1QixJQUFZO29CQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsd0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekQsQ0FBQztnQkFFRCxzRUFBc0U7Z0JBQ3RFLGlDQUFpQztnQkFDakMseUJBQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCx5QkFBTSxDQUFDLGFBQWEsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUUseUJBQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLHlCQUFNLENBQUMsYUFBYSxDQUFDLDhDQUE4QyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6Rix5QkFBTSxDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFckYseUJBQU0sQ0FBQyxjQUFRLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRXBFLHlCQUFNLENBQUMsY0FBUSxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCwyQkFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLHFCQUFFLENBQUMsdUZBQXVGLEVBQ3ZGO2dCQUNFLHdCQUF3QixJQUFZLEVBQUUsUUFBZ0I7b0JBQWhCLHlCQUFBLEVBQUEsZ0JBQWdCO29CQUNwRCxJQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsd0JBQVksQ0FBQyw4QkFBOEI7d0JBQzNDLHdCQUFZLENBQUMsZUFBZSxDQUFDO29CQUNyRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBRUQseUJBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCx5QkFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELHlCQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlELHlCQUFNLENBQUMsY0FBUSxjQUFjLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFFNUUseUJBQU0sQ0FBQyxjQUFRLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCwyQkFBUSxDQUNKLGtCQUFrQixFQUFFO1lBQ2xCLHFCQUFFLENBQUMsK0RBQStELEVBQy9EO2dCQUNFLHdCQUF3QixJQUFZO29CQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsd0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekQsQ0FBQztnQkFFRCx5QkFBTSxDQUFDLGNBQWMsQ0FBQyw2RkFJNUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFaEIseUJBQU0sQ0FBQyxjQUFNLE9BQUEsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxjQUFNLE9BQUEsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDekQseUJBQU0sQ0FBQyxjQUFNLE9BQUEsY0FBYyxDQUFDLG9CQUFvQixDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDN0QseUJBQU0sQ0FBQyxjQUFNLE9BQUEsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBNVdELG9CQTRXQyJ9