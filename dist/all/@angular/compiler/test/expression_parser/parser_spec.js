"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("@angular/compiler/src/expression_parser/ast");
var lexer_1 = require("@angular/compiler/src/expression_parser/lexer");
var parser_1 = require("@angular/compiler/src/expression_parser/parser");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var unparser_1 = require("./unparser");
var validator_1 = require("./validator");
function main() {
    function createParser() { return new parser_1.Parser(new lexer_1.Lexer()); }
    function parseAction(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseAction(text, location);
    }
    function parseBinding(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseBinding(text, location);
    }
    function parseTemplateBindingsResult(text, location, prefix) {
        if (location === void 0) { location = null; }
        return createParser().parseTemplateBindings(prefix || null, text, location);
    }
    function parseTemplateBindings(text, location, prefix) {
        if (location === void 0) { location = null; }
        return parseTemplateBindingsResult(text, location, prefix).templateBindings;
    }
    function parseInterpolation(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseInterpolation(text, location);
    }
    function splitInterpolation(text, location) {
        if (location === void 0) { location = null; }
        return createParser().splitInterpolation(text, location);
    }
    function parseSimpleBinding(text, location) {
        if (location === void 0) { location = null; }
        return createParser().parseSimpleBinding(text, location);
    }
    function checkInterpolation(exp, expected) {
        var ast = parseInterpolation(exp);
        if (expected == null)
            expected = exp;
        matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
        validator_1.validate(ast);
    }
    function checkBinding(exp, expected) {
        var ast = parseBinding(exp);
        if (expected == null)
            expected = exp;
        matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
        validator_1.validate(ast);
    }
    function checkAction(exp, expected) {
        var ast = parseAction(exp);
        if (expected == null)
            expected = exp;
        matchers_1.expect(unparser_1.unparse(ast)).toEqual(expected);
        validator_1.validate(ast);
    }
    function expectError(ast, message) {
        for (var _i = 0, _a = ast.errors; _i < _a.length; _i++) {
            var error = _a[_i];
            if (error.message.indexOf(message) >= 0) {
                return;
            }
        }
        var errMsgs = ast.errors.map(function (err) { return err.message; }).join('\n');
        throw Error("Expected an error containing \"" + message + "\" to be reported, but got the errors:\n" +
            errMsgs);
    }
    function expectActionError(text, message) {
        expectError(validator_1.validate(parseAction(text)), message);
    }
    function expectBindingError(text, message) {
        expectError(validator_1.validate(parseBinding(text)), message);
    }
    describe('parser', function () {
        describe('parseAction', function () {
            it('should parse numbers', function () { checkAction('1'); });
            it('should parse strings', function () {
                checkAction('\'1\'', '"1"');
                checkAction('"1"');
            });
            it('should parse null', function () { checkAction('null'); });
            it('should parse undefined', function () { checkAction('undefined'); });
            it('should parse unary - expressions', function () {
                checkAction('-1', '0 - 1');
                checkAction('+1', '1');
            });
            it('should parse unary ! expressions', function () {
                checkAction('!true');
                checkAction('!!true');
                checkAction('!!!true');
            });
            it('should parse postfix ! expression', function () {
                checkAction('true!');
                checkAction('a!.b');
                checkAction('a!!!!.b');
            });
            it('should parse multiplicative expressions', function () { checkAction('3*4/2%5', '3 * 4 / 2 % 5'); });
            it('should parse additive expressions', function () { checkAction('3 + 6 - 2'); });
            it('should parse relational expressions', function () {
                checkAction('2 < 3');
                checkAction('2 > 3');
                checkAction('2 <= 2');
                checkAction('2 >= 2');
            });
            it('should parse equality expressions', function () {
                checkAction('2 == 3');
                checkAction('2 != 3');
            });
            it('should parse strict equality expressions', function () {
                checkAction('2 === 3');
                checkAction('2 !== 3');
            });
            it('should parse expressions', function () {
                checkAction('true && true');
                checkAction('true || false');
            });
            it('should parse grouped expressions', function () { checkAction('(1 + 2) * 3', '1 + 2 * 3'); });
            it('should ignore comments in expressions', function () { checkAction('a //comment', 'a'); });
            it('should retain // in string literals', function () { checkAction("\"http://www.google.com\"", "\"http://www.google.com\""); });
            it('should parse an empty string', function () { checkAction(''); });
            describe('literals', function () {
                it('should parse array', function () {
                    checkAction('[1][0]');
                    checkAction('[[1]][0][0]');
                    checkAction('[]');
                    checkAction('[].length');
                    checkAction('[1, 2].length');
                });
                it('should parse map', function () {
                    checkAction('{}');
                    checkAction('{a: 1, "b": 2}[2]');
                    checkAction('{}["a"]');
                });
                it('should only allow identifier, string, or keyword as map key', function () {
                    expectActionError('{(:0}', 'expected identifier, keyword, or string');
                    expectActionError('{1234:0}', 'expected identifier, keyword, or string');
                });
            });
            describe('member access', function () {
                it('should parse field access', function () {
                    checkAction('a');
                    checkAction('this.a', 'a');
                    checkAction('a.a');
                });
                it('should only allow identifier or keyword as member names', function () {
                    expectActionError('x.(', 'identifier or keyword');
                    expectActionError('x. 1234', 'identifier or keyword');
                    expectActionError('x."foo"', 'identifier or keyword');
                });
                it('should parse safe field access', function () {
                    checkAction('a?.a');
                    checkAction('a.a?.a');
                });
            });
            describe('method calls', function () {
                it('should parse method calls', function () {
                    checkAction('fn()');
                    checkAction('add(1, 2)');
                    checkAction('a.add(1, 2)');
                    checkAction('fn().add(1, 2)');
                });
            });
            describe('functional calls', function () {
                it('should parse function calls', function () { checkAction('fn()(1, 2)'); });
            });
            describe('conditional', function () {
                it('should parse ternary/conditional expressions', function () {
                    checkAction('7 == 3 + 4 ? 10 : 20');
                    checkAction('false ? 10 : 20');
                });
                it('should report incorrect ternary operator syntax', function () {
                    expectActionError('true?1', 'Conditional expression true?1 requires all 3 expressions');
                });
            });
            describe('assignment', function () {
                it('should support field assignments', function () {
                    checkAction('a = 12');
                    checkAction('a.a.a = 123');
                    checkAction('a = 123; b = 234;');
                });
                it('should report on safe field assignments', function () { expectActionError('a?.a = 123', 'cannot be used in the assignment'); });
                it('should support array updates', function () { checkAction('a[0] = 200'); });
            });
            it('should error when using pipes', function () { expectActionError('x|blah', 'Cannot have a pipe'); });
            it('should store the source in the result', function () { matchers_1.expect(parseAction('someExpr', 'someExpr')); });
            it('should store the passed-in location', function () { matchers_1.expect(parseAction('someExpr', 'location').location).toBe('location'); });
            it('should report when encountering interpolation', function () {
                expectActionError('{{a()}}', 'Got interpolation ({{}}) where expression was expected');
            });
        });
        describe('general error handling', function () {
            it('should report an unexpected token', function () { expectActionError('[1,2] trac', 'Unexpected token \'trac\''); });
            it('should report reasonable error for unconsumed tokens', function () { expectActionError(')', 'Unexpected token ) at column 1 in [)]'); });
            it('should report a missing expected token', function () {
                expectActionError('a(b', 'Missing expected ) at the end of the expression [a(b]');
            });
        });
        describe('parseBinding', function () {
            describe('pipes', function () {
                it('should parse pipes', function () {
                    checkBinding('a(b | c)', 'a((b | c))');
                    checkBinding('a.b(c.d(e) | f)', 'a.b((c.d(e) | f))');
                    checkBinding('[1, 2, 3] | a', '([1, 2, 3] | a)');
                    checkBinding('{a: 1, "b": 2} | c', '({a: 1, "b": 2} | c)');
                    checkBinding('a[b] | c', '(a[b] | c)');
                    checkBinding('a?.b | c', '(a?.b | c)');
                    checkBinding('true | a', '(true | a)');
                    checkBinding('a | b:c | d', '((a | b:c) | d)');
                    checkBinding('a | b:(c | d)', '(a | b:(c | d))');
                });
                it('should only allow identifier or keyword as formatter names', function () {
                    expectBindingError('"Foo"|(', 'identifier or keyword');
                    expectBindingError('"Foo"|1234', 'identifier or keyword');
                    expectBindingError('"Foo"|"uppercase"', 'identifier or keyword');
                });
                it('should parse quoted expressions', function () { checkBinding('a:b', 'a:b'); });
                it('should not crash when prefix part is not tokenizable', function () { checkBinding('"a:b"', '"a:b"'); });
                it('should ignore whitespace around quote prefix', function () { checkBinding(' a :b', 'a:b'); });
                it('should refuse prefixes that are not single identifiers', function () {
                    expectBindingError('a + b:c', '');
                    expectBindingError('1:c', '');
                });
            });
            it('should store the source in the result', function () { matchers_1.expect(parseBinding('someExpr').source).toBe('someExpr'); });
            it('should store the passed-in location', function () { matchers_1.expect(parseBinding('someExpr', 'location').location).toBe('location'); });
            it('should report chain expressions', function () { expectError(parseBinding('1;2'), 'contain chained expression'); });
            it('should report assignment', function () { expectError(parseBinding('a=2'), 'contain assignments'); });
            it('should report when encountering interpolation', function () {
                expectBindingError('{{a.b}}', 'Got interpolation ({{}}) where expression was expected');
            });
            it('should parse conditional expression', function () { checkBinding('a < b ? a : b'); });
            it('should ignore comments in bindings', function () { checkBinding('a //comment', 'a'); });
            it('should retain // in string literals', function () { checkBinding("\"http://www.google.com\"", "\"http://www.google.com\""); });
            it('should retain // in : microsyntax', function () { checkBinding('one:a//b', 'one:a//b'); });
        });
        describe('parseTemplateBindings', function () {
            function keys(templateBindings) {
                return templateBindings.map(function (binding) { return binding.key; });
            }
            function keyValues(templateBindings) {
                return templateBindings.map(function (binding) {
                    if (binding.keyIsVar) {
                        return 'let ' + binding.key + (binding.name == null ? '=null' : '=' + binding.name);
                    }
                    else {
                        return binding.key + (binding.expression == null ? '' : "=" + binding.expression);
                    }
                });
            }
            function keySpans(source, templateBindings) {
                return templateBindings.map(function (binding) { return source.substring(binding.span.start, binding.span.end); });
            }
            function exprSources(templateBindings) {
                return templateBindings.map(function (binding) { return binding.expression != null ? binding.expression.source : null; });
            }
            it('should parse an empty string', function () { matchers_1.expect(parseTemplateBindings('')).toEqual([]); });
            it('should parse a string without a value', function () { matchers_1.expect(keys(parseTemplateBindings('a'))).toEqual(['a']); });
            it('should only allow identifier, string, or keyword including dashes as keys', function () {
                var bindings = parseTemplateBindings('a:\'b\'');
                matchers_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings('\'a\':\'b\'');
                matchers_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings('"a":\'b\'');
                matchers_1.expect(keys(bindings)).toEqual(['a']);
                bindings = parseTemplateBindings('a-b:\'c\'');
                matchers_1.expect(keys(bindings)).toEqual(['a-b']);
                expectError(parseTemplateBindingsResult('(:0'), 'expected identifier, keyword, or string');
                expectError(parseTemplateBindingsResult('1234:0'), 'expected identifier, keyword, or string');
            });
            it('should detect expressions as value', function () {
                var bindings = parseTemplateBindings('a:b');
                matchers_1.expect(exprSources(bindings)).toEqual(['b']);
                bindings = parseTemplateBindings('a:1+1');
                matchers_1.expect(exprSources(bindings)).toEqual(['1+1']);
            });
            it('should detect names as value', function () {
                var bindings = parseTemplateBindings('a:let b');
                matchers_1.expect(keyValues(bindings)).toEqual(['a', 'let b=\$implicit']);
            });
            it('should allow space and colon as separators', function () {
                var bindings = parseTemplateBindings('a:b');
                matchers_1.expect(keys(bindings)).toEqual(['a']);
                matchers_1.expect(exprSources(bindings)).toEqual(['b']);
                bindings = parseTemplateBindings('a b');
                matchers_1.expect(keys(bindings)).toEqual(['a']);
                matchers_1.expect(exprSources(bindings)).toEqual(['b']);
            });
            it('should allow multiple pairs', function () {
                var bindings = parseTemplateBindings('a 1 b 2');
                matchers_1.expect(keys(bindings)).toEqual(['a', 'aB']);
                matchers_1.expect(exprSources(bindings)).toEqual(['1 ', '2']);
            });
            it('should store the sources in the result', function () {
                var bindings = parseTemplateBindings('a 1,b 2');
                matchers_1.expect(bindings[0].expression.source).toEqual('1');
                matchers_1.expect(bindings[1].expression.source).toEqual('2');
            });
            it('should store the passed-in location', function () {
                var bindings = parseTemplateBindings('a 1,b 2', 'location');
                matchers_1.expect(bindings[0].expression.location).toEqual('location');
            });
            it('should support let notation', function () {
                var bindings = parseTemplateBindings('let i');
                matchers_1.expect(keyValues(bindings)).toEqual(['let i=\$implicit']);
                bindings = parseTemplateBindings('let i');
                matchers_1.expect(keyValues(bindings)).toEqual(['let i=\$implicit']);
                bindings = parseTemplateBindings('let a; let b');
                matchers_1.expect(keyValues(bindings)).toEqual(['let a=\$implicit', 'let b=\$implicit']);
                bindings = parseTemplateBindings('let a; let b;');
                matchers_1.expect(keyValues(bindings)).toEqual(['let a=\$implicit', 'let b=\$implicit']);
                bindings = parseTemplateBindings('let i-a = k-a');
                matchers_1.expect(keyValues(bindings)).toEqual(['let i-a=k-a']);
                bindings = parseTemplateBindings('keyword let item; let i = k');
                matchers_1.expect(keyValues(bindings)).toEqual(['keyword', 'let item=\$implicit', 'let i=k']);
                bindings = parseTemplateBindings('keyword: let item; let i = k');
                matchers_1.expect(keyValues(bindings)).toEqual(['keyword', 'let item=\$implicit', 'let i=k']);
                bindings = parseTemplateBindings('directive: let item in expr; let a = b', 'location');
                matchers_1.expect(keyValues(bindings)).toEqual([
                    'directive', 'let item=\$implicit', 'directiveIn=expr in location', 'let a=b'
                ]);
            });
            it('should support as notation', function () {
                var bindings = parseTemplateBindings('ngIf exp as local', 'location');
                matchers_1.expect(keyValues(bindings)).toEqual(['ngIf=exp  in location', 'let local=ngIf']);
                bindings = parseTemplateBindings('ngFor let item of items as iter; index as i', 'L');
                matchers_1.expect(keyValues(bindings)).toEqual([
                    'ngFor', 'let item=$implicit', 'ngForOf=items  in L', 'let iter=ngForOf', 'let i=index'
                ]);
            });
            it('should parse pipes', function () {
                var bindings = parseTemplateBindings('key value|pipe');
                var ast = bindings[0].expression.ast;
                matchers_1.expect(ast).toBeAnInstanceOf(ast_1.BindingPipe);
            });
            describe('spans', function () {
                it('should should support let', function () {
                    var source = 'let i';
                    matchers_1.expect(keySpans(source, parseTemplateBindings(source))).toEqual(['let i']);
                });
                it('should support multiple lets', function () {
                    var source = 'let item; let i=index; let e=even;';
                    matchers_1.expect(keySpans(source, parseTemplateBindings(source))).toEqual([
                        'let item', 'let i=index', 'let e=even'
                    ]);
                });
                it('should support a prefix', function () {
                    var source = 'let person of people';
                    var prefix = 'ngFor';
                    var bindings = parseTemplateBindings(source, null, prefix);
                    matchers_1.expect(keyValues(bindings)).toEqual([
                        'ngFor', 'let person=$implicit', 'ngForOf=people in null'
                    ]);
                    matchers_1.expect(keySpans(source, bindings)).toEqual(['', 'let person ', 'of people']);
                });
            });
        });
        describe('parseInterpolation', function () {
            it('should return null if no interpolation', function () { matchers_1.expect(parseInterpolation('nothing')).toBe(null); });
            it('should parse no prefix/suffix interpolation', function () {
                var ast = parseInterpolation('{{a}}').ast;
                matchers_1.expect(ast.strings).toEqual(['', '']);
                matchers_1.expect(ast.expressions.length).toEqual(1);
                matchers_1.expect(ast.expressions[0].name).toEqual('a');
            });
            it('should parse prefix/suffix with multiple interpolation', function () {
                var originalExp = 'before {{ a }} middle {{ b }} after';
                var ast = parseInterpolation(originalExp).ast;
                matchers_1.expect(unparser_1.unparse(ast)).toEqual(originalExp);
                validator_1.validate(ast);
            });
            it('should report empty interpolation expressions', function () {
                expectError(parseInterpolation('{{}}'), 'Blank expressions are not allowed in interpolated strings');
                expectError(parseInterpolation('foo {{  }}'), 'Parser Error: Blank expressions are not allowed in interpolated strings');
            });
            it('should parse conditional expression', function () { checkInterpolation('{{ a < b ? a : b }}'); });
            it('should parse expression with newline characters', function () {
                checkInterpolation("{{ 'foo' +\n 'bar' +\r 'baz' }}", "{{ \"foo\" + \"bar\" + \"baz\" }}");
            });
            it('should support custom interpolation', function () {
                var parser = new parser_1.Parser(new lexer_1.Lexer());
                var ast = parser.parseInterpolation('{% a %}', null, { start: '{%', end: '%}' }).ast;
                matchers_1.expect(ast.strings).toEqual(['', '']);
                matchers_1.expect(ast.expressions.length).toEqual(1);
                matchers_1.expect(ast.expressions[0].name).toEqual('a');
            });
            describe('comments', function () {
                it('should ignore comments in interpolation expressions', function () { checkInterpolation('{{a //comment}}', '{{ a }}'); });
                it('should retain // in single quote strings', function () {
                    checkInterpolation("{{ 'http://www.google.com' }}", "{{ \"http://www.google.com\" }}");
                });
                it('should retain // in double quote strings', function () {
                    checkInterpolation("{{ \"http://www.google.com\" }}", "{{ \"http://www.google.com\" }}");
                });
                it('should ignore comments after string literals', function () { checkInterpolation("{{ \"a//b\" //comment }}", "{{ \"a//b\" }}"); });
                it('should retain // in complex strings', function () {
                    checkInterpolation("{{\"//a'//b`//c`//d'//e\" //comment}}", "{{ \"//a'//b`//c`//d'//e\" }}");
                });
                it('should retain // in nested, unterminated strings', function () { checkInterpolation("{{ \"a'b`\" //comment}}", "{{ \"a'b`\" }}"); });
            });
        });
        describe('parseSimpleBinding', function () {
            it('should parse a field access', function () {
                var p = parseSimpleBinding('name');
                matchers_1.expect(unparser_1.unparse(p)).toEqual('name');
                validator_1.validate(p);
            });
            it('should report when encountering pipes', function () {
                expectError(validator_1.validate(parseSimpleBinding('a | somePipe')), 'Host binding expression cannot contain pipes');
            });
            it('should report when encountering interpolation', function () {
                expectError(validator_1.validate(parseSimpleBinding('{{exp}}')), 'Got interpolation ({{}}) where expression was expected');
            });
            it('should report when encountering field write', function () {
                expectError(validator_1.validate(parseSimpleBinding('a = b')), 'Bindings cannot contain assignments');
            });
        });
        describe('wrapLiteralPrimitive', function () {
            it('should wrap a literal primitive', function () {
                matchers_1.expect(unparser_1.unparse(validator_1.validate(createParser().wrapLiteralPrimitive('foo', null))))
                    .toEqual('"foo"');
            });
        });
        describe('error recovery', function () {
            function recover(text, expected) {
                var expr = validator_1.validate(parseAction(text));
                matchers_1.expect(unparser_1.unparse(expr)).toEqual(expected || text);
            }
            it('should be able to recover from an extra paren', function () { return recover('((a)))', 'a'); });
            it('should be able to recover from an extra bracket', function () { return recover('[[a]]]', '[[a]]'); });
            it('should be able to recover from a missing )', function () { return recover('(a;b', 'a; b;'); });
            it('should be able to recover from a missing ]', function () { return recover('[a,b', '[a, b]'); });
            it('should be able to recover from a missing selector', function () { return recover('a.'); });
            it('should be able to recover from a missing selector in a array literal', function () { return recover('[[a.], b, c]'); });
        });
        describe('offsets', function () {
            it('should retain the offsets of an interpolation', function () {
                var interpolations = splitInterpolation('{{a}}  {{b}}  {{c}}');
                matchers_1.expect(interpolations.offsets).toEqual([2, 9, 16]);
            });
            it('should retain the offsets into the expression AST of interpolations', function () {
                var source = parseInterpolation('{{a}}  {{b}}  {{c}}');
                var interpolation = source.ast;
                matchers_1.expect(interpolation.expressions.map(function (e) { return e.span.start; })).toEqual([2, 9, 16]);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUVBQW9JO0FBQ3BJLHVFQUFvRTtBQUNwRSx5RUFBc0g7QUFDdEgsMkVBQXNFO0FBR3RFLHVDQUFtQztBQUNuQyx5Q0FBcUM7QUFFckM7SUFDRSwwQkFBMEIsTUFBTSxDQUFDLElBQUksZUFBTSxDQUFDLElBQUksYUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QscUJBQXFCLElBQVksRUFBRSxRQUFvQjtRQUFwQix5QkFBQSxFQUFBLGVBQW9CO1FBQ3JELE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxzQkFBc0IsSUFBWSxFQUFFLFFBQW9CO1FBQXBCLHlCQUFBLEVBQUEsZUFBb0I7UUFDdEQsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHFDQUNJLElBQVksRUFBRSxRQUFvQixFQUFFLE1BQWU7UUFBckMseUJBQUEsRUFBQSxlQUFvQjtRQUNwQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMscUJBQXFCLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUNELCtCQUNJLElBQVksRUFBRSxRQUFvQixFQUFFLE1BQWU7UUFBckMseUJBQUEsRUFBQSxlQUFvQjtRQUNwQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUM5RSxDQUFDO0lBRUQsNEJBQTRCLElBQVksRUFBRSxRQUFvQjtRQUFwQix5QkFBQSxFQUFBLGVBQW9CO1FBQzVELE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELDRCQUE0QixJQUFZLEVBQUUsUUFBb0I7UUFBcEIseUJBQUEsRUFBQSxlQUFvQjtRQUM1RCxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCw0QkFBNEIsSUFBWSxFQUFFLFFBQW9CO1FBQXBCLHlCQUFBLEVBQUEsZUFBb0I7UUFDNUQsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsNEJBQTRCLEdBQVcsRUFBRSxRQUFpQjtRQUN4RCxJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUcsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1lBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNyQyxpQkFBTSxDQUFDLGtCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsb0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsc0JBQXNCLEdBQVcsRUFBRSxRQUFpQjtRQUNsRCxJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztZQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDckMsaUJBQU0sQ0FBQyxrQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLG9CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELHFCQUFxQixHQUFXLEVBQUUsUUFBaUI7UUFDakQsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7WUFBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLGlCQUFNLENBQUMsa0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxvQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFRCxxQkFBcUIsR0FBNEIsRUFBRSxPQUFlO1FBQ2hFLEdBQUcsQ0FBQyxDQUFnQixVQUFVLEVBQVYsS0FBQSxHQUFHLENBQUMsTUFBTSxFQUFWLGNBQVUsRUFBVixJQUFVO1lBQXpCLElBQU0sS0FBSyxTQUFBO1lBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDO1lBQ1QsQ0FBQztTQUNGO1FBQ0QsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsT0FBTyxFQUFYLENBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RCxNQUFNLEtBQUssQ0FDUCxvQ0FBaUMsT0FBTyw2Q0FBeUM7WUFDakYsT0FBTyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsMkJBQTJCLElBQVksRUFBRSxPQUFlO1FBQ3RELFdBQVcsQ0FBQyxvQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCw0QkFBNEIsSUFBWSxFQUFFLE9BQWU7UUFDdkQsV0FBVyxDQUFDLG9CQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUN0QixFQUFFLENBQUMsc0JBQXNCLEVBQUUsY0FBUSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4RCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ3pCLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFRLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhELEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxjQUFRLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxFLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDM0IsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFDekMsY0FBUSxXQUFXLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkQsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLGNBQVEsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0UsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO2dCQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QixXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7Z0JBQ3RDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO2dCQUM3QyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZCLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtnQkFDN0IsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM1QixXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsY0FBUSxXQUFXLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0YsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLGNBQVEsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFDckMsY0FBUSxXQUFXLENBQUMsMkJBQXlCLEVBQUUsMkJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxjQUFRLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRS9ELFFBQVEsQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtvQkFDdkIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN0QixXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEIsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN6QixXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQy9CLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtvQkFDckIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQixXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDakMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7b0JBQ2hFLGlCQUFpQixDQUFDLE9BQU8sRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO29CQUN0RSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUseUNBQXlDLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtvQkFDOUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQixXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtvQkFDNUQsaUJBQWlCLENBQUMsS0FBSyxFQUFFLHVCQUF1QixDQUFDLENBQUM7b0JBQ2xELGlCQUFpQixDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO29CQUN0RCxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO29CQUNuQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtvQkFDOUIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQixXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3pCLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDM0IsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxjQUFRLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO29CQUNqRCxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDcEMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtvQkFDcEQsaUJBQWlCLENBQUMsUUFBUSxFQUFFLDBEQUEwRCxDQUFDLENBQUM7Z0JBQzFGLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO2dCQUNyQixFQUFFLENBQUMsa0NBQWtDLEVBQUU7b0JBQ3JDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdEIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUMzQixXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUN6QyxjQUFRLGlCQUFpQixDQUFDLFlBQVksRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5GLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxjQUFRLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUMvQixjQUFRLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakUsRUFBRSxDQUFDLHVDQUF1QyxFQUN2QyxjQUFRLGlCQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0QsRUFBRSxDQUFDLHFDQUFxQyxFQUNyQyxjQUFRLGlCQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyRixFQUFFLENBQUMsK0NBQStDLEVBQUU7Z0JBQ2xELGlCQUFpQixDQUFDLFNBQVMsRUFBRSx3REFBd0QsQ0FBQyxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7WUFDakMsRUFBRSxDQUFDLG1DQUFtQyxFQUNuQyxjQUFRLGlCQUFpQixDQUFDLFlBQVksRUFBRSwyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUUsRUFBRSxDQUFDLHNEQUFzRCxFQUN0RCxjQUFRLGlCQUFpQixDQUFDLEdBQUcsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFL0UsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO2dCQUMzQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsdURBQXVELENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUNoQixFQUFFLENBQUMsb0JBQW9CLEVBQUU7b0JBQ3ZCLFlBQVksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ3ZDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO29CQUNyRCxZQUFZLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQ2pELFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO29CQUMzRCxZQUFZLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN2QyxZQUFZLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN2QyxZQUFZLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN2QyxZQUFZLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQy9DLFlBQVksQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO29CQUMvRCxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztvQkFDdkQsa0JBQWtCLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7b0JBQzFELGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLHVCQUF1QixDQUFDLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxjQUFRLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0UsRUFBRSxDQUFDLHNEQUFzRCxFQUN0RCxjQUFRLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFOUMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLGNBQVEsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RixFQUFFLENBQUMsd0RBQXdELEVBQUU7b0JBQzNELGtCQUFrQixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDbEMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUN2QyxjQUFRLGlCQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhFLEVBQUUsQ0FBQyxxQ0FBcUMsRUFDckMsY0FBUSxpQkFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEYsRUFBRSxDQUFDLGlDQUFpQyxFQUNqQyxjQUFRLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlFLEVBQUUsQ0FBQywwQkFBMEIsRUFDMUIsY0FBUSxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RSxFQUFFLENBQUMsK0NBQStDLEVBQUU7Z0JBQ2xELGtCQUFrQixDQUFDLFNBQVMsRUFBRSx3REFBd0QsQ0FBQyxDQUFDO1lBQzFGLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLGNBQVEsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEYsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLGNBQVEsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXRGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFDckMsY0FBUSxZQUFZLENBQUMsMkJBQXlCLEVBQUUsMkJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxjQUFRLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtZQUVoQyxjQUFjLGdCQUF1QjtnQkFDbkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLEVBQVgsQ0FBVyxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUVELG1CQUFtQixnQkFBdUI7Z0JBQ3hDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO29CQUNqQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RGLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsTUFBSSxPQUFPLENBQUMsVUFBWSxDQUFDLENBQUM7b0JBQ3BGLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1lBRUQsa0JBQWtCLE1BQWMsRUFBRSxnQkFBbUM7Z0JBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQ3ZCLFVBQUEsT0FBTyxJQUFJLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELHFCQUFxQixnQkFBdUI7Z0JBQzFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQ3ZCLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUE3RCxDQUE2RCxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUVELEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxjQUFRLGlCQUFNLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU3RixFQUFFLENBQUMsdUNBQXVDLEVBQ3ZDLGNBQVEsaUJBQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RSxFQUFFLENBQUMsMkVBQTJFLEVBQUU7Z0JBQzlFLElBQUksUUFBUSxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNoRCxpQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXRDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDaEQsaUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUV0QyxRQUFRLEdBQUcscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzlDLGlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFdEMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxpQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBRXhDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO2dCQUUzRixXQUFXLENBQ1AsMkJBQTJCLENBQUMsUUFBUSxDQUFDLEVBQUUseUNBQXlDLENBQUMsQ0FBQztZQUN4RixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtnQkFDdkMsSUFBSSxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVDLGlCQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFN0MsUUFBUSxHQUFHLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQyxpQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7Z0JBQ2pDLElBQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQUksUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QyxpQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGlCQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFN0MsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxpQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGlCQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDaEMsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELGlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLGlCQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLElBQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRCxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO2dCQUN4QyxJQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzlELGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ2hDLElBQUksUUFBUSxHQUFHLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QyxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFMUQsUUFBUSxHQUFHLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQyxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFMUQsUUFBUSxHQUFHLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNqRCxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFOUUsUUFBUSxHQUFHLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFOUUsUUFBUSxHQUFHLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRXJELFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2dCQUNoRSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixRQUFRLEdBQUcscUJBQXFCLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDakUsaUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFbkYsUUFBUSxHQUFHLHFCQUFxQixDQUFDLHdDQUF3QyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN2RixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDbEMsV0FBVyxFQUFFLHFCQUFxQixFQUFFLDhCQUE4QixFQUFFLFNBQVM7aUJBQzlFLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO2dCQUMvQixJQUFJLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDdEUsaUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBRWpGLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckYsaUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRSxhQUFhO2lCQUN4RixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDdkIsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDekQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsaUJBQVcsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsRUFBRSxDQUFDLDJCQUEyQixFQUFFO29CQUM5QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7b0JBQ3ZCLGlCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO29CQUNqQyxJQUFNLE1BQU0sR0FBRyxvQ0FBb0MsQ0FBQztvQkFDcEQsaUJBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzlELFVBQVUsRUFBRSxhQUFhLEVBQUUsWUFBWTtxQkFDeEMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtvQkFDNUIsSUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUM7b0JBQ3RDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztvQkFDdkIsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDN0QsaUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ2xDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSx3QkFBd0I7cUJBQzFELENBQUMsQ0FBQztvQkFDSCxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixFQUFFLENBQUMsd0NBQXdDLEVBQ3hDLGNBQVEsaUJBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhFLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtnQkFDaEQsSUFBTSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFHLENBQUMsR0FBb0IsQ0FBQztnQkFDL0QsaUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLGlCQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7Z0JBQzNELElBQU0sV0FBVyxHQUFHLHFDQUFxQyxDQUFDO2dCQUMxRCxJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ2xELGlCQUFNLENBQUMsa0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUMsb0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDbEQsV0FBVyxDQUNQLGtCQUFrQixDQUFDLE1BQU0sQ0FBRyxFQUM1QiwyREFBMkQsQ0FBQyxDQUFDO2dCQUVqRSxXQUFXLENBQ1Asa0JBQWtCLENBQUMsWUFBWSxDQUFHLEVBQ2xDLHlFQUF5RSxDQUFDLENBQUM7WUFDakYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQ3JDLGNBQVEsa0JBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpELEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtnQkFDcEQsa0JBQWtCLENBQUMsaUNBQWlDLEVBQUUsbUNBQTZCLENBQUMsQ0FBQztZQUN2RixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxhQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QyxJQUFNLEdBQUcsR0FDTCxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFHLENBQUMsR0FBVSxDQUFDO2dCQUN0RixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLEVBQUUsQ0FBQyxxREFBcUQsRUFDckQsY0FBUSxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVoRSxFQUFFLENBQUMsMENBQTBDLEVBQUU7b0JBQzdDLGtCQUFrQixDQUFDLCtCQUErQixFQUFFLGlDQUErQixDQUFDLENBQUM7Z0JBQ3ZGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtvQkFDN0Msa0JBQWtCLENBQUMsaUNBQStCLEVBQUUsaUNBQStCLENBQUMsQ0FBQztnQkFDdkYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUM5QyxjQUFRLGtCQUFrQixDQUFDLDBCQUF3QixFQUFFLGdCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RSxFQUFFLENBQUMscUNBQXFDLEVBQUU7b0JBQ3hDLGtCQUFrQixDQUNkLHVDQUF5QyxFQUFFLCtCQUFpQyxDQUFDLENBQUM7Z0JBQ3BGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFDbEQsY0FBUSxrQkFBa0IsQ0FBQyx5QkFBeUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakYsQ0FBQyxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixFQUFFLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ2hDLElBQU0sQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQyxpQkFBTSxDQUFDLGtCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLG9CQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFDMUMsV0FBVyxDQUNQLG9CQUFRLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsRUFDNUMsOENBQThDLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDbEQsV0FBVyxDQUNQLG9CQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFDdkMsd0RBQXdELENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtnQkFDaEQsV0FBVyxDQUFDLG9CQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO1lBQzVGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO2dCQUNwQyxpQkFBTSxDQUFDLGtCQUFPLENBQUMsb0JBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN0RSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixpQkFBaUIsSUFBWSxFQUFFLFFBQWlCO2dCQUM5QyxJQUFNLElBQUksR0FBRyxvQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxpQkFBTSxDQUFDLGtCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxFQUFFLENBQUMsK0NBQStDLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztZQUNsRixFQUFFLENBQUMsaURBQWlELEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztZQUN4RixFQUFFLENBQUMsNENBQTRDLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztZQUNqRixFQUFFLENBQUMsNENBQTRDLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUNsRixFQUFFLENBQUMsbURBQW1ELEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBYixDQUFhLENBQUMsQ0FBQztZQUM3RSxFQUFFLENBQUMsc0VBQXNFLEVBQ3RFLGNBQU0sT0FBQSxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDbEIsRUFBRSxDQUFDLCtDQUErQyxFQUFFO2dCQUNsRCxJQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBRyxDQUFDO2dCQUNuRSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7Z0JBQ3hFLElBQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLHFCQUFxQixDQUFHLENBQUM7Z0JBQzNELElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFvQixDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQVosQ0FBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdrQkQsb0JBNmtCQyJ9