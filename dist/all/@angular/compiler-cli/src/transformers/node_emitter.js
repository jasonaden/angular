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
var ts = require("typescript");
var METHOD_THIS_NAME = 'this';
var CATCH_ERROR_NAME = 'error';
var CATCH_STACK_NAME = 'stack';
var TypeScriptNodeEmitter = (function () {
    function TypeScriptNodeEmitter() {
    }
    TypeScriptNodeEmitter.prototype.updateSourceFile = function (sourceFile, stmts, preamble) {
        var converter = new _NodeEmitterVisitor();
        // [].concat flattens the result so that each `visit...` method can also return an array of
        // stmts.
        var statements = [].concat.apply([], stmts.map(function (stmt) { return stmt.visitStatement(converter, null); }).filter(function (stmt) { return stmt != null; }));
        var newSourceFile = ts.updateSourceFileNode(sourceFile, converter.getReexports().concat(converter.getImports(), statements));
        if (preamble) {
            if (preamble.startsWith('/*') && preamble.endsWith('*/')) {
                preamble = preamble.substr(2, preamble.length - 4);
            }
            if (!statements.length) {
                statements.push(ts.createEmptyStatement());
            }
            statements[0] = ts.setSyntheticLeadingComments(statements[0], [{ kind: ts.SyntaxKind.MultiLineCommentTrivia, text: preamble, pos: -1, end: -1 }]);
        }
        return [newSourceFile, converter.getNodeMap()];
    };
    return TypeScriptNodeEmitter;
}());
exports.TypeScriptNodeEmitter = TypeScriptNodeEmitter;
function createLiteral(value) {
    if (value === null) {
        return ts.createNull();
    }
    else if (value === undefined) {
        return ts.createIdentifier('undefined');
    }
    else {
        return ts.createLiteral(value);
    }
}
/**
 * Visits an output ast and produces the corresponding TypeScript synthetic nodes.
 */
var _NodeEmitterVisitor = (function () {
    function _NodeEmitterVisitor() {
        this._nodeMap = new Map();
        this._importsWithPrefixes = new Map();
        this._reexports = new Map();
    }
    _NodeEmitterVisitor.prototype.getReexports = function () {
        return Array.from(this._reexports.entries())
            .map(function (_a) {
            var exportedFilePath = _a[0], reexports = _a[1];
            return ts.createExportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, ts.createNamedExports(reexports.map(function (_a) {
                var name = _a.name, as = _a.as;
                return ts.createExportSpecifier(name, as);
            })), 
            /* moduleSpecifier */ createLiteral(exportedFilePath));
        });
    };
    _NodeEmitterVisitor.prototype.getImports = function () {
        return Array.from(this._importsWithPrefixes.entries())
            .map(function (_a) {
            var namespace = _a[0], prefix = _a[1];
            return ts.createImportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* importClause */ ts.createImportClause(
            /* name */ undefined, ts.createNamespaceImport(ts.createIdentifier(prefix))), 
            /* moduleSpecifier */ createLiteral(namespace));
        });
    };
    _NodeEmitterVisitor.prototype.getNodeMap = function () { return this._nodeMap; };
    _NodeEmitterVisitor.prototype.record = function (ngNode, tsNode) {
        var _this = this;
        if (tsNode && !this._nodeMap.has(tsNode)) {
            this._nodeMap.set(tsNode, ngNode);
            ts.forEachChild(tsNode, function (child) { return _this.record(ngNode, tsNode); });
        }
        return tsNode;
    };
    _NodeEmitterVisitor.prototype.getModifiers = function (stmt) {
        var modifiers = [];
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported)) {
            modifiers.push(ts.createToken(ts.SyntaxKind.ExportKeyword));
        }
        return modifiers;
    };
    // StatementVisitor
    _NodeEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt) {
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported) && stmt.value instanceof compiler_1.ExternalExpr &&
            !stmt.type) {
            // check for a reexport
            var _a = stmt.value.value, name_1 = _a.name, moduleName = _a.moduleName;
            if (moduleName) {
                var reexports = this._reexports.get(moduleName);
                if (!reexports) {
                    reexports = [];
                    this._reexports.set(moduleName, reexports);
                }
                reexports.push({ name: name_1, as: stmt.name });
                return null;
            }
        }
        var varDeclList = ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier(stmt.name), 
            /* type */ undefined, (stmt.value && stmt.value.visitExpression(this, null)) || undefined)]);
        if (stmt.hasModifier(compiler_1.StmtModifier.Exported)) {
            // Note: We need to add an explicit variable and export declaration so that
            // the variable can be referred in the same file as well.
            var tsVarStmt = this.record(stmt, ts.createVariableStatement(/* modifiers */ [], varDeclList));
            var exportStmt = this.record(stmt, ts.createExportDeclaration(
            /*decorators*/ undefined, /*modifiers*/ undefined, ts.createNamedExports([ts.createExportSpecifier(stmt.name, stmt.name)])));
            return [tsVarStmt, exportStmt];
        }
        return this.record(stmt, ts.createVariableStatement(this.getModifiers(stmt), varDeclList));
    };
    _NodeEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        return this.record(stmt, ts.createFunctionDeclaration(
        /* decorators */ undefined, this.getModifiers(stmt), 
        /* asteriskToken */ undefined, stmt.name, /* typeParameters */ undefined, stmt.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, this._visitStatements(stmt.statements)));
    };
    _NodeEmitterVisitor.prototype.visitExpressionStmt = function (stmt) {
        return this.record(stmt, ts.createStatement(stmt.expr.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitReturnStmt = function (stmt) {
        return this.record(stmt, ts.createReturn(stmt.value ? stmt.value.visitExpression(this, null) : undefined));
    };
    _NodeEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt) {
        var _this = this;
        var modifiers = this.getModifiers(stmt);
        var fields = stmt.fields.map(function (field) { return ts.createProperty(
        /* decorators */ undefined, /* modifiers */ undefined, field.name, 
        /* questionToken */ undefined, 
        /* type */ undefined, ts.createNull()); });
        var getters = stmt.getters.map(function (getter) { return ts.createGetAccessor(
        /* decorators */ undefined, /* modifiers */ undefined, getter.name, /* parameters */ [], 
        /* type */ undefined, _this._visitStatements(getter.body)); });
        var constructor = (stmt.constructorMethod && [ts.createConstructor(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* parameters */ stmt.constructorMethod.params.map(function (p) { return ts.createParameter(
            /* decorators */ undefined, 
            /* modifiers */ undefined, 
            /* dotDotDotToken */ undefined, p.name); }), this._visitStatements(stmt.constructorMethod.body))]) ||
            [];
        // TODO {chuckj}: Determine what should be done for a method with a null name.
        var methods = stmt.methods.filter(function (method) { return method.name; })
            .map(function (method) { return ts.createMethodDeclaration(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* astriskToken */ undefined, method.name /* guarded by filter */, 
        /* questionToken */ undefined, /* typeParameters */ undefined, method.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, _this._visitStatements(method.body)); });
        return this.record(stmt, ts.createClassDeclaration(
        /* decorators */ undefined, modifiers, stmt.name, /* typeParameters*/ undefined, stmt.parent && [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [stmt.parent.visitExpression(this, null)])] ||
            [], fields.concat(getters, constructor, methods)));
    };
    _NodeEmitterVisitor.prototype.visitIfStmt = function (stmt) {
        return this.record(stmt, ts.createIf(stmt.condition.visitExpression(this, null), this._visitStatements(stmt.trueCase), stmt.falseCase && stmt.falseCase.length && this._visitStatements(stmt.falseCase) ||
            undefined));
    };
    _NodeEmitterVisitor.prototype.visitTryCatchStmt = function (stmt) {
        return this.record(stmt, ts.createTry(this._visitStatements(stmt.bodyStmts), ts.createCatchClause(CATCH_ERROR_NAME, this._visitStatementsPrefix([ts.createVariableStatement(
            /* modifiers */ undefined, [ts.createVariableDeclaration(CATCH_STACK_NAME, /* type */ undefined, ts.createPropertyAccess(ts.createIdentifier(CATCH_ERROR_NAME), ts.createIdentifier(CATCH_STACK_NAME)))])], stmt.catchStmts)), 
        /* finallyBlock */ undefined));
    };
    _NodeEmitterVisitor.prototype.visitThrowStmt = function (stmt) {
        return this.record(stmt, ts.createThrow(stmt.error.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitCommentStmt = function (stmt) { return null; };
    // ExpressionVisitor
    _NodeEmitterVisitor.prototype.visitReadVarExpr = function (expr) {
        switch (expr.builtin) {
            case compiler_1.BuiltinVar.This:
                return this.record(expr, ts.createIdentifier(METHOD_THIS_NAME));
            case compiler_1.BuiltinVar.CatchError:
                return this.record(expr, ts.createIdentifier(CATCH_ERROR_NAME));
            case compiler_1.BuiltinVar.CatchStack:
                return this.record(expr, ts.createIdentifier(CATCH_STACK_NAME));
            case compiler_1.BuiltinVar.Super:
                return this.record(expr, ts.createSuper());
        }
        if (expr.name) {
            return this.record(expr, ts.createIdentifier(expr.name));
        }
        throw Error("Unexpected ReadVarExpr form");
    };
    _NodeEmitterVisitor.prototype.visitWriteVarExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createIdentifier(expr.name), expr.value.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitWriteKeyExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createElementAccess(expr.receiver.visitExpression(this, null), expr.index.visitExpression(this, null)), expr.value.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitWritePropExpr = function (expr) {
        return this.record(expr, ts.createAssignment(ts.createPropertyAccess(expr.receiver.visitExpression(this, null), expr.name), expr.value.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr) {
        var _this = this;
        var methodName = getMethodName(expr);
        return this.record(expr, ts.createCall(ts.createPropertyAccess(expr.receiver.visitExpression(this, null), methodName), 
        /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    _NodeEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createCall(expr.fn.visitExpression(this, null), /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    _NodeEmitterVisitor.prototype.visitInstantiateExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createNew(expr.classExpr.visitExpression(this, null), /* typeArguments */ undefined, expr.args.map(function (arg) { return arg.visitExpression(_this, null); })));
    };
    _NodeEmitterVisitor.prototype.visitLiteralExpr = function (expr) { return this.record(expr, createLiteral(expr.value)); };
    _NodeEmitterVisitor.prototype.visitExternalExpr = function (expr) {
        return this.record(expr, this._visitIdentifier(expr.value));
    };
    _NodeEmitterVisitor.prototype.visitConditionalExpr = function (expr) {
        // TODO {chuckj}: Review use of ! on flaseCase. Should it be non-nullable?
        return this.record(expr, ts.createConditional(expr.condition.visitExpression(this, null), expr.trueCase.visitExpression(this, null), expr.falseCase.visitExpression(this, null)));
        ;
    };
    _NodeEmitterVisitor.prototype.visitNotExpr = function (expr) {
        return this.record(expr, ts.createPrefix(ts.SyntaxKind.ExclamationToken, expr.condition.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitAssertNotNullExpr = function (expr) {
        return expr.condition.visitExpression(this, null);
    };
    _NodeEmitterVisitor.prototype.visitCastExpr = function (expr) {
        return expr.value.visitExpression(this, null);
    };
    _NodeEmitterVisitor.prototype.visitFunctionExpr = function (expr) {
        return this.record(expr, ts.createFunctionExpression(
        /* modifiers */ undefined, /* astriskToken */ undefined, /* name */ undefined, 
        /* typeParameters */ undefined, expr.params.map(function (p) { return ts.createParameter(
        /* decorators */ undefined, /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, p.name); }), 
        /* type */ undefined, this._visitStatements(expr.statements)));
    };
    _NodeEmitterVisitor.prototype.visitBinaryOperatorExpr = function (expr) {
        var binaryOperator;
        switch (expr.operator) {
            case compiler_1.BinaryOperator.And:
                binaryOperator = ts.SyntaxKind.AmpersandAmpersandToken;
                break;
            case compiler_1.BinaryOperator.Bigger:
                binaryOperator = ts.SyntaxKind.GreaterThanToken;
                break;
            case compiler_1.BinaryOperator.BiggerEquals:
                binaryOperator = ts.SyntaxKind.GreaterThanEqualsToken;
                break;
            case compiler_1.BinaryOperator.Divide:
                binaryOperator = ts.SyntaxKind.SlashToken;
                break;
            case compiler_1.BinaryOperator.Equals:
                binaryOperator = ts.SyntaxKind.EqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Identical:
                binaryOperator = ts.SyntaxKind.EqualsEqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Lower:
                binaryOperator = ts.SyntaxKind.LessThanToken;
                break;
            case compiler_1.BinaryOperator.LowerEquals:
                binaryOperator = ts.SyntaxKind.LessThanEqualsToken;
                break;
            case compiler_1.BinaryOperator.Minus:
                binaryOperator = ts.SyntaxKind.MinusToken;
                break;
            case compiler_1.BinaryOperator.Modulo:
                binaryOperator = ts.SyntaxKind.PercentToken;
                break;
            case compiler_1.BinaryOperator.Multiply:
                binaryOperator = ts.SyntaxKind.AsteriskToken;
                break;
            case compiler_1.BinaryOperator.NotEquals:
                binaryOperator = ts.SyntaxKind.ExclamationEqualsToken;
                break;
            case compiler_1.BinaryOperator.NotIdentical:
                binaryOperator = ts.SyntaxKind.ExclamationEqualsEqualsToken;
                break;
            case compiler_1.BinaryOperator.Or:
                binaryOperator = ts.SyntaxKind.BarBarToken;
                break;
            case compiler_1.BinaryOperator.Plus:
                binaryOperator = ts.SyntaxKind.PlusToken;
                break;
            default:
                throw new Error("Unknown operator: " + expr.operator);
        }
        return this.record(expr, ts.createBinary(expr.lhs.visitExpression(this, null), binaryOperator, expr.rhs.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitReadPropExpr = function (expr) {
        return this.record(expr, ts.createPropertyAccess(expr.receiver.visitExpression(this, null), expr.name));
    };
    _NodeEmitterVisitor.prototype.visitReadKeyExpr = function (expr) {
        return this.record(expr, ts.createElementAccess(expr.receiver.visitExpression(this, null), expr.index.visitExpression(this, null)));
    };
    _NodeEmitterVisitor.prototype.visitLiteralArrayExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createArrayLiteral(expr.entries.map(function (entry) { return entry.visitExpression(_this, null); })));
    };
    _NodeEmitterVisitor.prototype.visitLiteralMapExpr = function (expr) {
        var _this = this;
        return this.record(expr, ts.createObjectLiteral(expr.entries.map(function (entry) { return ts.createPropertyAssignment(entry.quoted ? ts.createLiteral(entry.key) : entry.key, entry.value.visitExpression(_this, null)); })));
    };
    _NodeEmitterVisitor.prototype.visitCommaExpr = function (expr) {
        var _this = this;
        return this.record(expr, expr.parts.map(function (e) { return e.visitExpression(_this, null); })
            .reduce(function (left, right) {
            return left ? ts.createBinary(left, ts.SyntaxKind.CommaToken, right) : right;
        }, null));
    };
    _NodeEmitterVisitor.prototype._visitStatements = function (statements) {
        return this._visitStatementsPrefix([], statements);
    };
    _NodeEmitterVisitor.prototype._visitStatementsPrefix = function (prefix, statements) {
        var _this = this;
        return ts.createBlock(prefix.concat(statements.map(function (stmt) { return stmt.visitStatement(_this, null); }).filter(function (f) { return f != null; })));
    };
    _NodeEmitterVisitor.prototype._visitIdentifier = function (value) {
        var name = value.name, moduleName = value.moduleName;
        var prefixIdent = null;
        if (moduleName) {
            var prefix = this._importsWithPrefixes.get(moduleName);
            if (prefix == null) {
                prefix = "i" + this._importsWithPrefixes.size;
                this._importsWithPrefixes.set(moduleName, prefix);
            }
            prefixIdent = ts.createIdentifier(prefix);
        }
        // name can only be null during JIT which never executes this code.
        var result = prefixIdent ? ts.createPropertyAccess(prefixIdent, name) : ts.createIdentifier(name);
        return result;
    };
    return _NodeEmitterVisitor;
}());
function getMethodName(methodRef) {
    if (methodRef.name) {
        return methodRef.name;
    }
    else {
        switch (methodRef.builtin) {
            case compiler_1.BuiltinMethod.Bind:
                return 'bind';
            case compiler_1.BuiltinMethod.ConcatArray:
                return 'concat';
            case compiler_1.BuiltinMethod.SubscribeObservable:
                return 'subscribe';
        }
    }
    throw new Error('Unexpected method reference form');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvbm9kZV9lbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQWtvQjtBQUNsb0IsK0JBQWlDO0FBSWpDLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBRWpDO0lBQUE7SUF1QkEsQ0FBQztJQXRCQyxnREFBZ0IsR0FBaEIsVUFBaUIsVUFBeUIsRUFBRSxLQUFrQixFQUFFLFFBQWlCO1FBRS9FLElBQU0sU0FBUyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUM1QywyRkFBMkY7UUFDM0YsU0FBUztRQUNULElBQU0sVUFBVSxHQUFVLEVBQUUsQ0FBQyxNQUFNLE9BQVQsRUFBRSxFQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLElBQUksSUFBSSxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7UUFDN0YsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUN6QyxVQUFVLEVBQU0sU0FBUyxDQUFDLFlBQVksRUFBRSxRQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBSyxVQUFVLEVBQUUsQ0FBQztRQUN6RixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsUUFB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