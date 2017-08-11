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
var compiler_1 = require("@angular/compiler");
var compiler_cli_1 = require("@angular/compiler-cli");
var types_1 = require("./types");
var utils_1 = require("./utils");
function findAstAt(ast, position, excludeEmpty) {
    if (excludeEmpty === void 0) { excludeEmpty = false; }
    var path = [];
    var visitor = new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visit = function (ast) {
            if ((!excludeEmpty || ast.span.start < ast.span.end) && utils_1.inSpan(position, ast.span)) {
                path.push(ast);
                compiler_1.visitAstChildren(ast, this);
            }
        };
        return class_1;
    }(compiler_1.NullAstVisitor));
    // We never care about the ASTWithSource node and its visit() method calls its ast's visit so
    // the visit() method above would never see it.
    if (ast instanceof compiler_1.ASTWithSource) {
        ast = ast.ast;
    }
    visitor.visit(ast);
    return new compiler_1.AstPath(path, position);
}
function getExpressionCompletions(scope, ast, position, query) {
    var path = findAstAt(ast, position);
    if (path.empty)
        return undefined;
    var tail = path.tail;
    var result = scope;
    function getType(ast) { return new compiler_cli_1.AstType(scope, query, {}).getType(ast); }
    // If the completion request is in a not in a pipe or property access then the global scope
    // (that is the scope of the implicit receiver) is the right scope as the user is typing the
    // beginning of an expression.
    tail.visit({
        visitBinary: function (ast) { },
        visitChain: function (ast) { },
        visitConditional: function (ast) { },
        visitFunctionCall: function (ast) { },
        visitImplicitReceiver: function (ast) { },
        visitInterpolation: function (ast) { result = undefined; },
        visitKeyedRead: function (ast) { },
        visitKeyedWrite: function (ast) { },
        visitLiteralArray: function (ast) { },
        visitLiteralMap: function (ast) { },
        visitLiteralPrimitive: function (ast) { },
        visitMethodCall: function (ast) { },
        visitPipe: function (ast) {
            if (position >= ast.exp.span.end &&
                (!ast.args || !ast.args.length || position < ast.args[0].span.start)) {
                // We are in a position a pipe name is expected.
                result = query.getPipes();
            }
        },
        visitPrefixNot: function (ast) { },
        visitNonNullAssert: function (ast) { },
        visitPropertyRead: function (ast) {
            var receiverType = getType(ast.receiver);
            result = receiverType ? receiverType.members() : scope;
        },
        visitPropertyWrite: function (ast) {
            var receiverType = getType(ast.receiver);
            result = receiverType ? receiverType.members() : scope;
        },
        visitQuote: function (ast) {
            // For a quote, return the members of any (if there are any).
            result = query.getBuiltinType(types_1.BuiltinType.Any).members();
        },
        visitSafeMethodCall: function (ast) {
            var receiverType = getType(ast.receiver);
            result = receiverType ? receiverType.members() : scope;
        },
        visitSafePropertyRead: function (ast) {
            var receiverType = getType(ast.receiver);
            result = receiverType ? receiverType.members() : scope;
        },
    });
    return result && result.values();
}
exports.getExpressionCompletions = getExpressionCompletions;
function getExpressionSymbol(scope, ast, position, query) {
    var path = findAstAt(ast, position, /* excludeEmpty */ true);
    if (path.empty)
        return undefined;
    var tail = path.tail;
    function getType(ast) { return new compiler_cli_1.AstType(scope, query, {}).getType(ast); }
    var symbol = undefined;
    var span = undefined;
    // If the completion request is in a not in a pipe or property access then the global scope
    // (that is the scope of the implicit receiver) is the right scope as the user is typing the
    // beginning of an expression.
    tail.visit({
        visitBinary: function (ast) { },
        visitChain: function (ast) { },
        visitConditional: function (ast) { },
        visitFunctionCall: function (ast) { },
        visitImplicitReceiver: function (ast) { },
        visitInterpolation: function (ast) { },
        visitKeyedRead: function (ast) { },
        visitKeyedWrite: function (ast) { },
        visitLiteralArray: function (ast) { },
        visitLiteralMap: function (ast) { },
        visitLiteralPrimitive: function (ast) { },
        visitMethodCall: function (ast) {
            var receiverType = getType(ast.receiver);
            symbol = receiverType && receiverType.members().get(ast.name);
            span = ast.span;
        },
        visitPipe: function (ast) {
            if (position >= ast.exp.span.end &&
                (!ast.args || !ast.args.length || position < ast.args[0].span.start)) {
                // We are in a position a pipe name is expected.
                var pipes = query.getPipes();
                if (pipes) {
                    symbol = pipes.get(ast.name);
                    span = ast.span;
                }
            }
        },
        visitPrefixNot: function (ast) { },
        visitNonNullAssert: function (ast) { },
        visitPropertyRead: function (ast) {
            var receiverType = getType(ast.receiver);
            symbol = receiverType && receiverType.members().get(ast.name);
            span = ast.span;
        },
        visitPropertyWrite: function (ast) {
            var receiverType = getType(ast.receiver);
            symbol = receiverType && receiverType.members().get(ast.name);
            span = ast.span;
        },
        visitQuote: function (ast) { },
        visitSafeMethodCall: function (ast) {
            var receiverType = getType(ast.receiver);
            symbol = receiverType && receiverType.members().get(ast.name);
            span = ast.span;
        },
        visitSafePropertyRead: function (ast) {
            var receiverType = getType(ast.receiver);
            symbol = receiverType && receiverType.members().get(ast.name);
            span = ast.span;
        },
    });
    if (symbol && span) {
        return { symbol: symbol, span: span };
    }
}
exports.getExpressionSymbol = getExpressionSymbol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9leHByZXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBK0c7QUFDL0csc0RBQThDO0FBRTlDLGlDQUE0RTtBQUM1RSxpQ0FBK0I7QUFJL0IsbUJBQW1CLEdBQVEsRUFBRSxRQUFnQixFQUFFLFlBQTZCO0lBQTdCLDZCQUFBLEVBQUEsb0JBQTZCO0lBQzFFLElBQU0sSUFBSSxHQUFVLEVBQUUsQ0FBQztJQUN2QixJQUFNLE9BQU8sR0FBRztRQUFrQiwyQkFBYztRQUE1Qjs7UUFPcEIsQ0FBQztRQU5DLHVCQUFLLEdBQUwsVUFBTSxHQUFRO1lBQ1osRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkYsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZiwyQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNILENBQUM7UUFDSCxjQUFDO0lBQUQsQ0FBQyxBQVBtQixDQUFjLHlCQUFjLEVBTy9DLENBQUM7SUFFRiw2RkFBNkY7SUFDN0YsK0NBQStDO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSx3QkFBYSxDQUFDLENBQUMsQ0FBQztRQUNqQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVuQixNQUFNLENBQUMsSUFBSSxr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