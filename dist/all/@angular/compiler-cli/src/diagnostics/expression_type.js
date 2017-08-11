"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var symbols_1 = require("./symbols");
var DiagnosticKind;
(function (DiagnosticKind) {
    DiagnosticKind[DiagnosticKind["Error"] = 0] = "Error";
    DiagnosticKind[DiagnosticKind["Warning"] = 1] = "Warning";
})(DiagnosticKind = exports.DiagnosticKind || (exports.DiagnosticKind = {}));
var TypeDiagnostic = (function () {
    function TypeDiagnostic(kind, message, ast) {
        this.kind = kind;
        this.message = message;
        this.ast = ast;
    }
    return TypeDiagnostic;
}());
exports.TypeDiagnostic = TypeDiagnostic;
// AstType calculatetype of the ast given AST element.
var AstType = (function () {
    function AstType(scope, query, context) {
        this.scope = scope;
        this.query = query;
        this.context = context;
    }
    AstType.prototype.getType = function (ast) { return ast.visit(this); };
    AstType.prototype.getDiagnostics = function (ast) {
        this.diagnostics = [];
        var type = ast.visit(this);
        if (this.context.event && type.callable) {
            this.reportWarning('Unexpected callable expression. Expected a method call', ast);
        }
        return this.diagnostics;
    };
    AstType.prototype.visitBinary = function (ast) {
        var _this = this;
        // Treat undefined and null as other.
        function normalize(kind, other) {
            switch (kind) {
                case symbols_1.BuiltinType.Undefined:
                case symbols_1.BuiltinType.Null:
                    return normalize(other, symbols_1.BuiltinType.Other);
            }
            return kind;
        }
        var getType = function (ast, operation) {
            var type = _this.getType(ast);
            if (type.nullable) {
                switch (operation) {
                    case '&&':
                    case '||':
                    case '==':
                    case '!=':
                    case '===':
                    case '!==':
                        // Nullable allowed.
                        break;
                    default:
                        _this.reportError("The expression might be null", ast);
                        break;
                }
                return _this.query.getNonNullableType(type);
            }
            return type;
        };
        var leftType = getType(ast.left, ast.operation);
        var rightType = getType(ast.right, ast.operation);
        var leftRawKind = this.query.getTypeKind(leftType);
        var rightRawKind = this.query.getTypeKind(rightType);
        var leftKind = normalize(leftRawKind, rightRawKind);
        var rightKind = normalize(rightRawKind, leftRawKind);
        // The following swtich implements operator typing similar to the
        // type production tables in the TypeScript specification.
        // https://github.com/Microsoft/TypeScript/blob/v1.8.10/doc/spec.md#4.19
        var operKind = leftKind << 8 | rightKind;
        switch (ast.operation) {
            case '*':
            case '/':
            case '%':
            case '-':
            case '<<':
            case '>>':
            case '>>>':
            case '&':
            case '^':
            case '|':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    default:
                        var errorAst = ast.left;
                        switch (leftKind) {
                            case symbols_1.BuiltinType.Any:
                            case symbols_1.BuiltinType.Number:
                                errorAst = ast.right;
                                break;
                        }
                        return this.reportError('Expected a numeric type', errorAst);
                }
            case '+':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Any:
                        return this.anyType;
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.String:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.String);
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Number:
                        return this.reportError('Expected a number type', ast.left);
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Other:
                        return this.reportError('Expected a number type', ast.right);
                    default:
                        return this.reportError('Expected operands to be a string or number type', ast);
                }
            case '>':
            case '<':
            case '<=':
            case '>=':
            case '==':
            case '!=':
            case '===':
            case '!==':
                switch (operKind) {
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Any << 8 | symbols_1.BuiltinType.Other:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Boolean << 8 | symbols_1.BuiltinType.Boolean:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Number << 8 | symbols_1.BuiltinType.Number:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.String << 8 | symbols_1.BuiltinType.String:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Any:
                    case symbols_1.BuiltinType.Other << 8 | symbols_1.BuiltinType.Other:
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
                    default:
                        return this.reportError('Expected the operants to be of similar type or any', ast);
                }
            case '&&':
                return rightType;
            case '||':
                return this.query.getTypeUnion(leftType, rightType);
        }
        return this.reportError("Unrecognized operator " + ast.operation, ast);
    };
    AstType.prototype.visitChain = function (ast) {
        if (this.diagnostics) {
            // If we are producing diagnostics, visit the children
            compiler_1.visitAstChildren(ast, this);
        }
        // The type of a chain is always undefined.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
    };
    AstType.prototype.visitConditional = function (ast) {
        // The type of a conditional is the union of the true and false conditions.
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        return this.query.getTypeUnion(this.getType(ast.trueExp), this.getType(ast.falseExp));
    };
    AstType.prototype.visitFunctionCall = function (ast) {
        var _this = this;
        // The type of a function call is the return type of the selected signature.
        // The signature is selected based on the types of the arguments. Angular doesn't
        // support contextual typing of arguments so this is simpler than TypeScript's
        // version.
        var args = ast.args.map(function (arg) { return _this.getType(arg); });
        var target = this.getType(ast.target);
        if (!target || !target.callable)
            return this.reportError('Call target is not callable', ast);
        var signature = target.selectSignature(args);
        if (signature)
            return signature.result;
        // TODO: Consider a better error message here.
        return this.reportError('Unable no compatible signature found for call', ast);
    };
    AstType.prototype.visitImplicitReceiver = function (ast) {
        var _this = this;
        // Return a pseudo-symbol for the implicit receiver.
        // The members of the implicit receiver are what is defined by the
        // scope passed into this class.
        return {
            name: '$implict',
            kind: 'component',
            language: 'ng-template',
            type: undefined,
            container: undefined,
            callable: false,
            nullable: false,
            public: true,
            definition: undefined,
            members: function () { return _this.scope; },
            signatures: function () { return []; },
            selectSignature: function (types) { return undefined; },
            indexed: function (argument) { return undefined; }
        };
    };
    AstType.prototype.visitInterpolation = function (ast) {
        // If we are producing diagnostics, visit the children.
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        return this.undefinedType;
    };
    AstType.prototype.visitKeyedRead = function (ast) {
        var targetType = this.getType(ast.obj);
        var keyType = this.getType(ast.key);
        var result = targetType.indexed(keyType);
        return result || this.anyType;
    };
    AstType.prototype.visitKeyedWrite = function (ast) {
        // The write of a type is the type of the value being written.
        return this.getType(ast.value);
    };
    AstType.prototype.visitLiteralArray = function (ast) {
        var _this = this;
        // A type literal is an array type of the union of the elements
        return this.query.getArrayType((_a = this.query).getTypeUnion.apply(_a, ast.expressions.map(function (element) { return _this.getType(element); })));
        var _a;
    };
    AstType.prototype.visitLiteralMap = function (ast) {
        // If we are producing diagnostics, visit the children
        if (this.diagnostics) {
            compiler_1.visitAstChildren(ast, this);
        }
        // TODO: Return a composite type.
        return this.anyType;
    };
    AstType.prototype.visitLiteralPrimitive = function (ast) {
        // The type of a literal primitive depends on the value of the literal.
        switch (ast.value) {
            case true:
            case false:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
            case null:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Null);
            case undefined:
                return this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
            default:
                switch (typeof ast.value) {
                    case 'string':
                        return this.query.getBuiltinType(symbols_1.BuiltinType.String);
                    case 'number':
                        return this.query.getBuiltinType(symbols_1.BuiltinType.Number);
                    default:
                        return this.reportError('Unrecognized primitive', ast);
                }
        }
    };
    AstType.prototype.visitMethodCall = function (ast) {
        return this.resolveMethodCall(this.getType(ast.receiver), ast);
    };
    AstType.prototype.visitPipe = function (ast) {
        var _this = this;
        // The type of a pipe node is the return type of the pipe's transform method. The table returned
        // by getPipes() is expected to contain symbols with the corresponding transform method type.
        var pipe = this.query.getPipes().get(ast.name);
        if (!pipe)
            return this.reportError("No pipe by the name " + ast.name + " found", ast);
        var expType = this.getType(ast.exp);
        var signature = pipe.selectSignature([expType].concat(ast.args.map(function (arg) { return _this.getType(arg); })));
        if (!signature)
            return this.reportError('Unable to resolve signature for pipe invocation', ast);
        return signature.result;
    };
    AstType.prototype.visitPrefixNot = function (ast) {
        // The type of a prefix ! is always boolean.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Boolean);
    };
    AstType.prototype.visitNonNullAssert = function (ast) {
        var expressionType = this.getType(ast.expression);
        return this.query.getNonNullableType(expressionType);
    };
    AstType.prototype.visitPropertyRead = function (ast) {
        return this.resolvePropertyRead(this.getType(ast.receiver), ast);
    };
    AstType.prototype.visitPropertyWrite = function (ast) {
        // The type of a write is the type of the value being written.
        return this.getType(ast.value);
    };
    AstType.prototype.visitQuote = function (ast) {
        // The type of a quoted expression is any.
        return this.query.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    AstType.prototype.visitSafeMethodCall = function (ast) {
        return this.resolveMethodCall(this.query.getNonNullableType(this.getType(ast.receiver)), ast);
    };
    AstType.prototype.visitSafePropertyRead = function (ast) {
        return this.resolvePropertyRead(this.query.getNonNullableType(this.getType(ast.receiver)), ast);
    };
    Object.defineProperty(AstType.prototype, "anyType", {
        get: function () {
            var result = this._anyType;
            if (!result) {
                result = this._anyType = this.query.getBuiltinType(symbols_1.BuiltinType.Any);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstType.prototype, "undefinedType", {
        get: function () {
            var result = this._undefinedType;
            if (!result) {
                result = this._undefinedType = this.query.getBuiltinType(symbols_1.BuiltinType.Undefined);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    AstType.prototype.resolveMethodCall = function (receiverType, ast) {
        var _this = this;
        if (this.isAny(receiverType)) {
            return this.anyType;
        }
        // The type of a method is the selected methods result type.
        var method = receiverType.members().get(ast.name);
        if (!method)
            return this.reportError("Unknown method '" + ast.name + "'", ast);
        if (!method.type)
            return this.reportError("Could not find a type for '" + ast.name + "'", ast);
        if (!method.type.callable)
            return this.reportError("Member '" + ast.name + "' is not callable", ast);
        var signature = method.type.selectSignature(ast.args.map(function (arg) { return _this.getType(arg); }));
        if (!signature)
            return this.reportError("Unable to resolve signature for call of method " + ast.name, ast);
        return signature.result;
    };
    AstType.prototype.resolvePropertyRead = function (receiverType, ast) {
        if (this.isAny(receiverType)) {
            return this.anyType;
        }
        // The type of a property read is the seelcted member's type.
        var member = receiverType.members().get(ast.name);
        if (!member) {
            var receiverInfo = receiverType.name;
            if (receiverInfo == '$implict') {
                receiverInfo =
                    'The component declaration, template variable declarations, and element references do';
            }
            else if (receiverType.nullable) {
                return this.reportError("The expression might be null", ast.receiver);
            }
            else {
                receiverInfo = "'" + receiverInfo + "' does";
            }
            return this.reportError("Identifier '" + ast.name + "' is not defined. " + receiverInfo + " not contain such a member", ast);
        }
        if (!member.public) {
            var receiverInfo = receiverType.name;
            if (receiverInfo == '$implict') {
                receiverInfo = 'the component';
            }
            else {
                receiverInfo = "'" + receiverInfo + "'";
            }
            this.reportWarning("Identifier '" + ast.name + "' refers to a private member of " + receiverInfo, ast);
        }
        return member.type;
    };
    AstType.prototype.reportError = function (message, ast) {
        if (this.diagnostics) {
            this.diagnostics.push(new TypeDiagnostic(DiagnosticKind.Error, message, ast));
        }
        return this.anyType;
    };
    AstType.prototype.reportWarning = function (message, ast) {
        if (this.diagnostics) {
            this.diagnostics.push(new TypeDiagnostic(DiagnosticKind.Warning, message, ast));
        }
        return this.anyType;
    };
    AstType.prototype.isAny = function (symbol) {
        return !symbol || this.query.getTypeKind(symbol) == symbols_1.BuiltinType.Any ||
            (!!symbol.type && this.isAny(symbol.type));
    };
    return AstType;
}());
exports.AstType = AstType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl90eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy9leHByZXNzaW9uX3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMlU7QUFFM1UscUNBQXlGO0FBSXpGLElBQVksY0FHWDtBQUhELFdBQVksY0FBYztJQUN4QixxREFBSyxDQUFBO0lBQ0wseURBQU8sQ0FBQTtBQUNULENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUVEO0lBQ0Usd0JBQW1CLElBQW9CLEVBQVMsT0FBZSxFQUFTLEdBQVE7UUFBN0QsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFDdEYscUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLHdDQUFjO0FBSTNCLHNEQUFzRDtBQUN0RDtJQUdFLGlCQUNZLEtBQWtCLEVBQVUsS0FBa0IsRUFDOUMsT0FBcUM7UUFEckMsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDOUMsWUFBTyxHQUFQLE9BQU8sQ0FBOEI7SUFBRyxDQUFDO0lBRXJELHlCQUFPLEdBQVAsVUFBUSxHQUFRLElBQVksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJELGdDQUFjLEdBQWQsVUFBZSxHQUFRO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQU0sSUFBSSxHQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUks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