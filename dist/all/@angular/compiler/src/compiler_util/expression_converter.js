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
var cdAst = require("../expression_parser/ast");
var identifiers_1 = require("../identifiers");
var o = require("../output/output_ast");
var EventHandlerVars = (function () {
    function EventHandlerVars() {
    }
    return EventHandlerVars;
}());
EventHandlerVars.event = o.variable('$event');
exports.EventHandlerVars = EventHandlerVars;
var ConvertActionBindingResult = (function () {
    function ConvertActionBindingResult(stmts, allowDefault) {
        this.stmts = stmts;
        this.allowDefault = allowDefault;
    }
    return ConvertActionBindingResult;
}());
exports.ConvertActionBindingResult = ConvertActionBindingResult;
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 */
function convertActionBinding(localResolver, implicitReceiver, action, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    var actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: function (argCount) {
            // Note: no caching for literal arrays in actions.
            return function (args) { return o.literalArr(args); };
        },
        createLiteralMapConverter: function (keys) {
            // Note: no caching for literal maps in actions.
            return function (values) {
                var entries = keys.map(function (k, i) { return ({
                    key: k.key,
                    value: values[i],
                    quoted: k.quoted,
                }); });
                return o.literalMap(entries);
            };
        },
        createPipeConverter: function (name) {
            throw new Error("Illegal State: Actions are not allowed to contain pipes. Pipe: " + name);
        }
    }, action);
    var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    var actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    var lastIndex = actionStmts.length - 1;
    var preventDefaultVar = null;
    if (lastIndex >= 0) {
        var lastStatement = actionStmts[lastIndex];
        var returnExpr = convertStmtIntoExpression(lastStatement);
        if (returnExpr) {
            // Note: We need to cast the result of the method call to dynamic,
            // as it might be a void method!
            preventDefaultVar = createPreventDefaultVar(bindingId);
            actionStmts[lastIndex] =
                preventDefaultVar.set(returnExpr.cast(o.DYNAMIC_TYPE).notIdentical(o.literal(false)))
                    .toDeclStmt(null, [o.StmtModifier.Final]);
        }
    }
    return new ConvertActionBindingResult(actionStmts, preventDefaultVar);
}
exports.convertActionBinding = convertActionBinding;
function convertPropertyBindingBuiltins(converterFactory, ast) {
    return convertBuiltins(converterFactory, ast);
}
exports.convertPropertyBindingBuiltins = convertPropertyBindingBuiltins;
var ConvertPropertyBindingResult = (function () {
    function ConvertPropertyBindingResult(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
    return ConvertPropertyBindingResult;
}());
exports.ConvertPropertyBindingResult = ConvertPropertyBindingResult;
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 */
function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    var currValExpr = createCurrValueExpr(bindingId);
    var stmts = [];
    var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    var outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    if (visitor.temporaryCount) {
        for (var i = 0; i < visitor.temporaryCount; i++) {
            stmts.push(temporaryDeclaration(bindingId, i));
        }
    }
    stmts.push(currValExpr.set(outputExpr).toDeclStmt(null, [o.StmtModifier.Final]));
    return new ConvertPropertyBindingResult(stmts, currValExpr);
}
exports.convertPropertyBinding = convertPropertyBinding;
function convertBuiltins(converterFactory, ast) {
    var visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
function temporaryName(bindingId, temporaryNumber) {
    return "tmp_" + bindingId + "_" + temporaryNumber;
}
function temporaryDeclaration(bindingId, temporaryNumber) {
    return new o.DeclareVarStmt(temporaryName(bindingId, temporaryNumber), o.NULL_EXPR);
}
exports.temporaryDeclaration = temporaryDeclaration;
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
    for (var i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
var _Mode;
(function (_Mode) {
    _Mode[_Mode["Statement"] = 0] = "Statement";
    _Mode[_Mode["Expression"] = 1] = "Expression";
})(_Mode || (_Mode = {}));
function ensureStatementMode(mode, ast) {
    if (mode !== _Mode.Statement) {
        throw new Error("Expected a statement, but saw " + ast);
    }
}
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error("Expected an expression, but saw " + ast);
    }
}
function convertToStatementIfNeeded(mode, expr) {
    if (mode === _Mode.Statement) {
        return expr.toStmt();
    }
    else {
        return expr;
    }
}
var _BuiltinAstConverter = (function (_super) {
    __extends(_BuiltinAstConverter, _super);
    function _BuiltinAstConverter(_converterFactory) {
        var _this = _super.call(this) || this;
        _this._converterFactory = _converterFactory;
        return _this;
    }
    _BuiltinAstConverter.prototype.visitPipe = function (ast, context) {
        var _this = this;
        var args = [ast.exp].concat(ast.args).map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    };
    _BuiltinAstConverter.prototype.visitLiteralArray = function (ast, context) {
        var _this = this;
        var args = ast.expressions.map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    };
    _BuiltinAstConverter.prototype.visitLiteralMap = function (ast, context) {
        var _this = this;
        var args = ast.values.map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    };
    return _BuiltinAstConverter;
}(cdAst.AstTransformer));
var _AstToIrVisitor = (function () {
    function _AstToIrVisitor(_localResolver, _implicitReceiver, bindingId) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
    }
    _AstToIrVisitor.prototype.visitBinary = function (ast, mode) {
        var op;
        switch (ast.operation) {
            case '+':
                op = o.BinaryOperator.Plus;
                break;
            case '-':
                op = o.BinaryOperator.Minus;
                break;
            case '*':
                op = o.BinaryOperator.Multiply;
                break;
            case '/':
                op = o.BinaryOperator.Divide;
                break;
            case '%':
                op = o.BinaryOperator.Modulo;
                break;
            case '&&':
                op = o.BinaryOperator.And;
                break;
            case '||':
                op = o.BinaryOperator.Or;
                break;
            case '==':
                op = o.BinaryOperator.Equals;
                break;
            case '!=':
                op = o.BinaryOperator.NotEquals;
                break;
            case '===':
                op = o.BinaryOperator.Identical;
                break;
            case '!==':
                op = o.BinaryOperator.NotIdentical;
                break;
            case '<':
                op = o.BinaryOperator.Lower;
                break;
            case '>':
                op = o.BinaryOperator.Bigger;
                break;
            case '<=':
                op = o.BinaryOperator.LowerEquals;
                break;
            case '>=':
                op = o.BinaryOperator.BiggerEquals;
                break;
            default:
                throw new Error("Unsupported operation " + ast.operation);
        }
        return convertToStatementIfNeeded(mode, new o.BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression)));
    };
    _AstToIrVisitor.prototype.visitChain = function (ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    };
    _AstToIrVisitor.prototype.visitConditional = function (ast, mode) {
        var value = this._visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression)));
    };
    _AstToIrVisitor.prototype.visitPipe = function (ast, mode) {
        throw new Error("Illegal state: Pipes should have been converted into functions. Pipe: " + ast.name);
    };
    _AstToIrVisitor.prototype.visitFunctionCall = function (ast, mode) {
        var convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        var fnResult;
        if (ast instanceof BuiltinFunctionCall) {
            fnResult = ast.converter(convertedArgs);
        }
        else {
            fnResult = this._visit(ast.target, _Mode.Expression).callFn(convertedArgs);
        }
        return convertToStatementIfNeeded(mode, fnResult);
    };
    _AstToIrVisitor.prototype.visitImplicitReceiver = function (ast, mode) {
        ensureExpressionMode(mode, ast);
        return this._implicitReceiver;
    };
    _AstToIrVisitor.prototype.visitInterpolation = function (ast, mode) {
        ensureExpressionMode(mode, ast);
        var args = [o.literal(ast.expressions.length)];
        for (var i = 0; i < ast.strings.length - 1; i++) {
            args.push(o.literal(ast.strings[i]));
            args.push(this._visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(o.literal(ast.strings[ast.strings.length - 1]));
        return ast.expressions.length <= 9 ?
            o.importExpr(identifiers_1.Identifiers.inlineInterpolate).callFn(args) :
            o.importExpr(identifiers_1.Identifiers.interpolate).callFn([args[0], o.literalArr(args.slice(1))]);
    };
    _AstToIrVisitor.prototype.visitKeyedRead = function (ast, mode) {
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this._visit(ast.obj, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
        }
    };
    _AstToIrVisitor.prototype.visitKeyedWrite = function (ast, mode) {
        var obj = this._visit(ast.obj, _Mode.Expression);
        var key = this._visit(ast.key, _Mode.Expression);
        var value = this._visit(ast.value, _Mode.Expression);
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    };
    _AstToIrVisitor.prototype.visitLiteralArray = function (ast, mode) {
        throw new Error("Illegal State: literal arrays should have been converted into functions");
    };
    _AstToIrVisitor.prototype.visitLiteralMap = function (ast, mode) {
        throw new Error("Illegal State: literal maps should have been converted into functions");
    };
    _AstToIrVisitor.prototype.visitLiteralPrimitive = function (ast, mode) {
        return convertToStatementIfNeeded(mode, o.literal(ast.value));
    };
    _AstToIrVisitor.prototype._getLocal = function (name) { return this._localResolver.getLocal(name); };
    _AstToIrVisitor.prototype.visitMethodCall = function (ast, mode) {
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            var args = this.visitAll(ast.args, _Mode.Expression);
            var result = null;
            var receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                var varExpr = this._getLocal(ast.name);
                if (varExpr) {
                    result = varExpr.callFn(args);
                }
            }
            if (result == null) {
                result = receiver.callMethod(ast.name, args);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    };
    _AstToIrVisitor.prototype.visitPrefixNot = function (ast, mode) {
        return convertToStatementIfNeeded(mode, o.not(this._visit(ast.expression, _Mode.Expression)));
    };
    _AstToIrVisitor.prototype.visitNonNullAssert = function (ast, mode) {
        return convertToStatementIfNeeded(mode, o.assertNotNull(this._visit(ast.expression, _Mode.Expression)));
    };
    _AstToIrVisitor.prototype.visitPropertyRead = function (ast, mode) {
        var leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            var result = null;
            var receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name);
            }
            if (result == null) {
                result = receiver.prop(ast.name);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    };
    _AstToIrVisitor.prototype.visitPropertyWrite = function (ast, mode) {
        var receiver = this._visit(ast.receiver, _Mode.Expression);
        if (receiver === this._implicitReceiver) {
            var varExpr = this._getLocal(ast.name);
            if (varExpr) {
                throw new Error('Cannot assign to a reference or variable!');
            }
        }
        return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this._visit(ast.value, _Mode.Expression)));
    };
    _AstToIrVisitor.prototype.visitSafePropertyRead = function (ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    };
    _AstToIrVisitor.prototype.visitSafeMethodCall = function (ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    };
    _AstToIrVisitor.prototype.visitAll = function (asts, mode) {
        var _this = this;
        return asts.map(function (ast) { return _this._visit(ast, mode); });
    };
    _AstToIrVisitor.prototype.visitQuote = function (ast, mode) {
        throw new Error("Quotes are not supported for evaluation!\n        Statement: " + ast.uninterpretedExpression + " located at " + ast.location);
    };
    _AstToIrVisitor.prototype._visit = function (ast, mode) {
        var result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    };
    _AstToIrVisitor.prototype.convertSafeAccess = function (ast, leftMostSafe, mode) {
        // If the expression contains a safe access node on the left it needs to be converted to
        // an expression that guards the access to the member by checking the receiver for blank. As
        // execution proceeds from left to right, the left most part of the expression must be guarded
        // first but, because member access is left associative, the right side of the expression is at
        // the top of the AST. The desired result requires lifting a copy of the the left part of the
        // expression up to test it for blank before generating the unguarded version.
        // Consider, for example the following expression: a?.b.c?.d.e
        // This results in the ast:
        //         .
        //        / \
        //       ?.   e
        //      /  \
        //     .    d
        //    / \
        //   ?.  c
        //  /  \
        // a    b
        // The following tree should be generated:
        //
        //        /---- ? ----\
        //       /      |      \
        //     a   /--- ? ---\  null
        //        /     |     \
        //       .      .     null
        //      / \    / \
        //     .  c   .   e
        //    / \    / \
        //   a   b  ,   d
        //         / \
        //        .   c
        //       / \
        //      a   b
        //
        // Notice that the first guard condition is the left hand of the left most safe access node
        // which comes in as leftMostSafe to this routine.
        var guardedExpression = this._visit(leftMostSafe.receiver, _Mode.Expression);
        var temporary = undefined;
        if (this.needsTemporary(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        var condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof cdAst.SafeMethodCall) {
            this._nodeMap.set(leftMostSafe, new cdAst.MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
        }
        else {
            this._nodeMap.set(leftMostSafe, new cdAst.PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
        }
        // Recursively convert the node now without the guarded member access.
        var access = this._visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(o.literal(null), access));
    };
    // Given a expression of the form a?.b.c?.d.e the the left most safe node is
    // the (a?.b). The . and ?. are left associative thus can be rewritten as:
    // ((((a?.c).b).c)?.d).e. This returns the most deeply nested safe read or
    // safe method call as this needs be transform initially to:
    //   a == null ? null : a.c.b.c?.d.e
    // then to:
    //   a == null ? null : a.b.c == null ? null : a.b.c.d.e
    _AstToIrVisitor.prototype.leftMostSafeNode = function (ast) {
        var _this = this;
        var visit = function (visitor, ast) {
            return (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            visitBinary: function (ast) { return null; },
            visitChain: function (ast) { return null; },
            visitConditional: function (ast) { return null; },
            visitFunctionCall: function (ast) { return null; },
            visitImplicitReceiver: function (ast) { return null; },
            visitInterpolation: function (ast) { return null; },
            visitKeyedRead: function (ast) { return visit(this, ast.obj); },
            visitKeyedWrite: function (ast) { return null; },
            visitLiteralArray: function (ast) { return null; },
            visitLiteralMap: function (ast) { return null; },
            visitLiteralPrimitive: function (ast) { return null; },
            visitMethodCall: function (ast) { return visit(this, ast.receiver); },
            visitPipe: function (ast) { return null; },
            visitPrefixNot: function (ast) { return null; },
            visitNonNullAssert: function (ast) { return null; },
            visitPropertyRead: function (ast) { return visit(this, ast.receiver); },
            visitPropertyWrite: function (ast) { return null; },
            visitQuote: function (ast) { return null; },
            visitSafeMethodCall: function (ast) { return visit(this, ast.receiver) || ast; },
            visitSafePropertyRead: function (ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    };
    // Returns true of the AST includes a method or a pipe indicating that, if the
    // expression is used as the target of a safe property or method access then
    // the expression should be stored into a temporary variable.
    _AstToIrVisitor.prototype.needsTemporary = function (ast) {
        var _this = this;
        var visit = function (visitor, ast) {
            return ast && (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        var visitSome = function (visitor, ast) {
            return ast.some(function (ast) { return visit(visitor, ast); });
        };
        return ast.visit({
            visitBinary: function (ast) { return visit(this, ast.left) || visit(this, ast.right); },
            visitChain: function (ast) { return false; },
            visitConditional: function (ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) ||
                    visit(this, ast.falseExp);
            },
            visitFunctionCall: function (ast) { return true; },
            visitImplicitReceiver: function (ast) { return false; },
            visitInterpolation: function (ast) { return visitSome(this, ast.expressions); },
            visitKeyedRead: function (ast) { return false; },
            visitKeyedWrite: function (ast) { return false; },
            visitLiteralArray: function (ast) { return true; },
            visitLiteralMap: function (ast) { return true; },
            visitLiteralPrimitive: function (ast) { return false; },
            visitMethodCall: function (ast) { return true; },
            visitPipe: function (ast) { return true; },
            visitPrefixNot: function (ast) { return visit(this, ast.expression); },
            visitNonNullAssert: function (ast) { return visit(this, ast.expression); },
            visitPropertyRead: function (ast) { return false; },
            visitPropertyWrite: function (ast) { return false; },
            visitQuote: function (ast) { return false; },
            visitSafeMethodCall: function (ast) { return true; },
            visitSafePropertyRead: function (ast) { return false; }
        });
    };
    _AstToIrVisitor.prototype.allocateTemporary = function () {
        var tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new o.ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    };
    _AstToIrVisitor.prototype.releaseTemporary = function (temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error("Temporary " + temporary.name + " released out of order");
        }
    };
    return _AstToIrVisitor;
}());
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        arg.forEach(function (entry) { return flattenStatements(entry, output); });
    }
    else {
        output.push(arg);
    }
}
var DefaultLocalResolver = (function () {
    function DefaultLocalResolver() {
    }
    DefaultLocalResolver.prototype.getLocal = function (name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    };
    return DefaultLocalResolver;
}());
function createCurrValueExpr(bindingId) {
    return o.variable("currVal_" + bindingId); // fix syntax highlighting: `
}
function createPreventDefaultVar(bindingId) {
    return o.variable("pd_" + bindingId);
}
function convertStmtIntoExpression(stmt) {
    if (stmt instanceof o.ExpressionStatement) {
        return stmt.expr;
    }
    else if (stmt instanceof o.ReturnStatement) {
        return stmt.value;
    }
    return null;
}
var BuiltinFunctionCall = (function (_super) {
    __extends(BuiltinFunctionCall, _super);
    function BuiltinFunctionCall(span, args, converter) {
        var _this = _super.call(this, span, null, args) || this;
        _this.args = args;
        _this.converter = converter;
        return _this;
    }
    return BuiltinFunctionCall;
}(cdAst.FunctionCall));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXJfdXRpbC9leHByZXNzaW9uX2NvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFHSCxnREFBa0Q7QUFDbEQsOENBQTJDO0FBQzNDLHdDQUEwQztBQUUxQztJQUFBO0lBQXFFLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFBdEU7QUFBdUMsc0JBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQXZELDRDQUFnQjtBQUk3QjtJQUNFLG9DQUFtQixLQUFvQixFQUFTLFlBQTJCO1FBQXhELFVBQUssR0FBTCxLQUFLLENBQWU7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBZTtJQUFHLENBQUM7SUFDakYsaUNBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLGdFQUEwQjtBQUl2Qzs7O0dBR0c7QUFDSCw4QkFDSSxhQUFtQyxFQUFFLGdCQUE4QixFQUFFLE1BQWlCLEVBQ3RGLFNBQWlCO0lBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNuQixhQUFhLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFDRCxJQUFNLHFCQUFxQixHQUFHLDhCQUE4QixDQUN4RDtRQUNFLDJCQUEyQixFQUFFLFVBQUMsUUFBZ0I7WUFDNUMsa0RBQWtEO1lBQ2xELE1BQU0sQ0FBQyxVQUFDLElBQW9CLElBQUssT0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFsQixDQUFrQixDQUFDO1FBQ3RELENBQUM7UUFDRCx5QkFBeUIsRUFBRSxVQUFDLElBQXNDO1lBQ2hFLGdEQUFnRDtZQUNoRCxNQUFNLENBQUMsVUFBQyxNQUFzQjtnQkFD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