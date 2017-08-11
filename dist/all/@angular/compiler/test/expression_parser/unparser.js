"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("../../src/expression_parser/ast");
var interpolation_config_1 = require("../../src/ml_parser/interpolation_config");
var Unparser = (function () {
    function Unparser() {
    }
    Unparser.prototype.unparse = function (ast, interpolationConfig) {
        this._expression = '';
        this._interpolationConfig = interpolationConfig;
        this._visit(ast);
        return this._expression;
    };
    Unparser.prototype.visitPropertyRead = function (ast, context) {
        this._visit(ast.receiver);
        this._expression += ast.receiver instanceof ast_1.ImplicitReceiver ? "" + ast.name : "." + ast.name;
    };
    Unparser.prototype.visitPropertyWrite = function (ast, context) {
        this._visit(ast.receiver);
        this._expression +=
            ast.receiver instanceof ast_1.ImplicitReceiver ? ast.name + " = " : "." + ast.name + " = ";
        this._visit(ast.value);
    };
    Unparser.prototype.visitBinary = function (ast, context) {
        this._visit(ast.left);
        this._expression += " " + ast.operation + " ";
        this._visit(ast.right);
    };
    Unparser.prototype.visitChain = function (ast, context) {
        var len = ast.expressions.length;
        for (var i = 0; i < len; i++) {
            this._visit(ast.expressions[i]);
            this._expression += i == len - 1 ? ';' : '; ';
        }
    };
    Unparser.prototype.visitConditional = function (ast, context) {
        this._visit(ast.condition);
        this._expression += ' ? ';
        this._visit(ast.trueExp);
        this._expression += ' : ';
        this._visit(ast.falseExp);
    };
    Unparser.prototype.visitPipe = function (ast, context) {
        var _this = this;
        this._expression += '(';
        this._visit(ast.exp);
        this._expression += " | " + ast.name;
        ast.args.forEach(function (arg) {
            _this._expression += ':';
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitFunctionCall = function (ast, context) {
        var _this = this;
        this._visit(ast.target);
        this._expression += '(';
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitImplicitReceiver = function (ast, context) { };
    Unparser.prototype.visitInterpolation = function (ast, context) {
        for (var i = 0; i < ast.strings.length; i++) {
            this._expression += ast.strings[i];
            if (i < ast.expressions.length) {
                this._expression += this._interpolationConfig.start + " ";
                this._visit(ast.expressions[i]);
                this._expression += " " + this._interpolationConfig.end;
            }
        }
    };
    Unparser.prototype.visitKeyedRead = function (ast, context) {
        this._visit(ast.obj);
        this._expression += '[';
        this._visit(ast.key);
        this._expression += ']';
    };
    Unparser.prototype.visitKeyedWrite = function (ast, context) {
        this._visit(ast.obj);
        this._expression += '[';
        this._visit(ast.key);
        this._expression += '] = ';
        this._visit(ast.value);
    };
    Unparser.prototype.visitLiteralArray = function (ast, context) {
        var _this = this;
        this._expression += '[';
        var isFirst = true;
        ast.expressions.forEach(function (expression) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(expression);
        });
        this._expression += ']';
    };
    Unparser.prototype.visitLiteralMap = function (ast, context) {
        this._expression += '{';
        var isFirst = true;
        for (var i = 0; i < ast.keys.length; i++) {
            if (!isFirst)
                this._expression += ', ';
            isFirst = false;
            var key = ast.keys[i];
            this._expression += key.quoted ? JSON.stringify(key.key) : key.key;
            this._expression += ': ';
            this._visit(ast.values[i]);
        }
        this._expression += '}';
    };
    Unparser.prototype.visitLiteralPrimitive = function (ast, context) {
        if (typeof ast.value === 'string') {
            this._expression += "\"" + ast.value.replace(Unparser._quoteRegExp, '\"') + "\"";
        }
        else {
            this._expression += "" + ast.value;
        }
    };
    Unparser.prototype.visitMethodCall = function (ast, context) {
        var _this = this;
        this._visit(ast.receiver);
        this._expression += ast.receiver instanceof ast_1.ImplicitReceiver ? ast.name + "(" : "." + ast.name + "(";
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitPrefixNot = function (ast, context) {
        this._expression += '!';
        this._visit(ast.expression);
    };
    Unparser.prototype.visitNonNullAssert = function (ast, context) {
        this._visit(ast.expression);
        this._expression += '!';
    };
    Unparser.prototype.visitSafePropertyRead = function (ast, context) {
        this._visit(ast.receiver);
        this._expression += "?." + ast.name;
    };
    Unparser.prototype.visitSafeMethodCall = function (ast, context) {
        var _this = this;
        this._visit(ast.receiver);
        this._expression += "?." + ast.name + "(";
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitQuote = function (ast, context) {
        this._expression += ast.prefix + ":" + ast.uninterpretedExpression;
    };
    Unparser.prototype._visit = function (ast) { ast.visit(this); };
    return Unparser;
}());
Unparser._quoteRegExp = /"/g;
var sharedUnparser = new Unparser();
function unparse(ast, interpolationConfig) {
    if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
    return sharedUnparser.unparse(ast, interpolationConfig);
}
exports.unparse = unparse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2V4cHJlc3Npb25fcGFyc2VyL3VucGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdURBQXVVO0FBQ3ZVLGlGQUEyRztBQUUzRztJQUFBO0lBZ0xBLENBQUM7SUEzS0MsMEJBQU8sR0FBUCxVQUFRLEdBQVEsRUFBRSxtQkFBd0M7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELG9DQUFpQixHQUFqQixVQUFrQixHQUFpQixFQUFFLE9BQVk7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsUUFBUSxZQUFZLHNCQUFnQixHQUFHLEtBQUcsR0FBRyxDQUFDLElBQU0sR0FBRyxNQUFJLEdBQUcsQ0FBQyxJQUFNLENBQUM7SUFDaEcsQ0FBQztJQUVELHFDQUFrQixHQUFsQixVQUFtQixHQUFrQixFQUFFLE9BQVk7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVc7WUFDWixHQUFHLENBQUMsUUFBUSxZQUFZLHNCQUFnQixHQUFNLEdBQUcsQ0FBQyxJQUFJLFFBQUssR0FBRyxNQUFJLEdBQUcsQ0FBQyxJQUFJLFFBQUssQ0FBQztRQUNwRixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFD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