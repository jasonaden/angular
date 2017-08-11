/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AbstractEmitterVisitor, CATCH_ERROR_VAR, CATCH_STACK_VAR, EmitterVisitorContext } from './abstract_emitter';
import * as o from './output_ast';
var /** @type {?} */ _debugFilePath = '/debug/lib';
/**
 * @param {?} ast
 * @return {?}
 */
export function debugOutputAstAsTypeScript(ast) {
    var /** @type {?} */ converter = new _TsEmitterVisitor();
    var /** @type {?} */ ctx = EmitterVisitorContext.createRoot();
    var /** @type {?} */ asts = Array.isArray(ast) ? ast : [ast];
    asts.forEach(function (ast) {
        if (ast instanceof o.Statement) {
            ast.visitStatement(converter, ctx);
        }
        else if (ast instanceof o.Expression) {
            ast.visitExpression(converter, ctx);
        }
        else if (ast instanceof o.Type) {
            ast.visitType(converter, ctx);
        }
        else {
            throw new Error("Don't know how to print debug info for " + ast);
        }
    });
    return ctx.toSource();
}
var TypeScriptEmitter = (function () {
    function TypeScriptEmitter() {
    }
    /**
     * @param {?} srcFilePath
     * @param {?} genFilePath
     * @param {?} stmts
     * @param {?=} preamble
     * @param {?=} emitSourceMaps
     * @return {?}
     */
    TypeScriptEmitter.prototype.emitStatementsAndContext = function (srcFilePath, genFilePath, stmts, preamble, emitSourceMaps) {
        if (preamble === void 0) { preamble = ''; }
        if (emitSourceMaps === void 0) { emitSourceMaps = true; }
        var /** @type {?} */ converter = new _TsEmitterVisitor();
        var /** @type {?} */ ctx = EmitterVisitorContext.createRoot();
        converter.visitAllStatements(stmts, ctx);
        var /** @type {?} */ preambleLines = preamble ? preamble.split('\n') : [];
        converter.reexports.forEach(function (reexports, exportedModuleName) {
            var /** @type {?} */ reexportsCode = reexports.map(function (reexport) { return reexport.name + " as " + reexport.as; }).join(',');
            preambleLines.push("export {" + reexportsCode + "} from '" + exportedModuleName + "';");
        });
        converter.importsWithPrefixes.forEach(function (prefix, importedModuleName) {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            preambleLines.push("imp" +
                ("ort * as " + prefix + " from '" + importedModuleName + "';"));
        });
        var /** @type {?} */ sm = emitSourceMaps ?
            ctx.toSourceMapGenerator(srcFilePath, genFilePath, preambleLines.length).toJsComment() :
            '';
        var /** @type {?} */ lines = preambleLines.concat([ctx.toSource(), sm]);
        if (sm) {
            // always add a newline at the end, as some tools have bugs without it.
            lines.push('');
        }
        ctx.setPreambleLineCount(preambleLines.length);
        return { sourceText: lines.join('\n'), context: ctx };
    };
    /**
     * @param {?} srcFilePath
     * @param {?} genFilePath
     * @param {?} stmts
     * @param {?=} preamble
     * @return {?}
     */
    TypeScriptEmitter.prototype.emitStatements = function (srcFilePath, genFilePath, stmts, preamble) {
        if (preamble === void 0) { preamble = ''; }
        return this.emitStatementsAndContext(srcFilePath, genFilePath, stmts, preamble).sourceText;
    };
    return TypeScriptEmitter;
}());
export { TypeScriptEmitter };
var _TsEmitterVisitor = (function (_super) {
    tslib_1.__extends(_TsEmitterVisitor, _super);
    function _TsEmitterVisitor() {
        var _this = _super.call(this, false) || this;
        _this.typeExpression = 0;
        _this.importsWithPrefixes = new Map();
        _this.reexports = new Map();
        return _this;
    }
    /**
     * @param {?} t
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitType = function (t, ctx, defaultType) {
        if (defaultType === void 0) { defaultType = 'any'; }
        if (t) {
            this.typeExpression++;
            t.visitType(this, ctx);
            this.typeExpression--;
        }
        else {
            ctx.print(null, defaultType);
        }
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value;
        if (value == null && ast.type != o.INFERRED_TYPE) {
            ctx.print(ast, "(" + value + " as any)");
            return null;
        }
        return _super.prototype.visitLiteralExpr.call(this, ast, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        if (ast.entries.length === 0) {
            ctx.print(ast, '(');
        }
        var /** @type {?} */ result = _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
        if (ast.entries.length === 0) {
            ctx.print(ast, ' as any[])');
        }
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitAssertNotNullExpr = function (ast, ctx) {
        var /** @type {?} */ result = _super.prototype.visitAssertNotNullExpr.call(this, ast, ctx);
        ctx.print(ast, '!');
        return result;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported) && stmt.value instanceof o.ExternalExpr &&
            !stmt.type) {
            // check for a reexport
            var _a = stmt.value.value, name_1 = _a.name, moduleName = _a.moduleName;
            if (moduleName) {
                var /** @type {?} */ reexports = this.reexports.get(moduleName);
                if (!reexports) {
                    reexports = [];
                    this.reexports.set(moduleName, reexports);
                }
                reexports.push({ name: /** @type {?} */ ((name_1)), as: stmt.name });
                return null;
            }
        }
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.print(stmt, "export ");
        }
        if (stmt.hasModifier(o.StmtModifier.Final)) {
            ctx.print(stmt, "const");
        }
        else {
            ctx.print(stmt, "var");
        }
        ctx.print(stmt, " " + stmt.name);
        this._printColonType(stmt.type, ctx);
        ctx.print(stmt, " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
        ctx.print(ast, "(<"); /** @type {?} */
        ((ast.type)).visitType(this, ctx);
        ctx.print(ast, ">");
        ast.value.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print(ast, "new ");
        this.typeExpression++;
        ast.classExpr.visitExpression(this, ctx);
        this.typeExpression--;
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "class " + stmt.name);
        if (stmt.parent != null) {
            ctx.print(stmt, " extends ");
            this.typeExpression++;
            stmt.parent.visitExpression(this, ctx);
            this.typeExpression--;
        }
        ctx.println(stmt, " {");
        ctx.incIndent();
        stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
        if (stmt.constructorMethod != null) {
            this._visitClassConstructor(stmt, ctx);
        }
        stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
        stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
        ctx.decIndent();
        ctx.println(stmt, "}");
        ctx.popClass();
        return null;
    };
    /**
     * @param {?} field
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassField = function (field, ctx) {
        if (field.hasModifier(o.StmtModifier.Private)) {
            // comment out as a workaround for #10967
            ctx.print(null, "/*private*/ ");
        }
        ctx.print(null, field.name);
        this._printColonType(field.type, ctx);
        ctx.println(null, ";");
    };
    /**
     * @param {?} getter
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
        if (getter.hasModifier(o.StmtModifier.Private)) {
            ctx.print(null, "private ");
        }
        ctx.print(null, "get " + getter.name + "()");
        this._printColonType(getter.type, ctx);
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(getter.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
        ctx.print(stmt, "constructor(");
        this._visitParams(stmt.constructorMethod.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.constructorMethod.body, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
    };
    /**
     * @param {?} method
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
        if (method.hasModifier(o.StmtModifier.Private)) {
            ctx.print(null, "private ");
        }
        ctx.print(null, method.name + "(");
        this._visitParams(method.params, ctx);
        ctx.print(null, ")");
        this._printColonType(method.type, ctx, 'void');
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(method.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
        ctx.print(ast, "(");
        this._visitParams(ast.params, ctx);
        ctx.print(ast, ")");
        this._printColonType(ast.type, ctx, 'void');
        ctx.println(ast, " => {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "function " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.print(stmt, ")");
        this._printColonType(stmt.type, ctx, 'void');
        ctx.println(stmt, " {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
        ctx.println(stmt, "try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR.name + ") {");
        ctx.incIndent();
        var /** @type {?} */ catchStmts = [/** @type {?} */ (CATCH_STACK_VAR.set(CATCH_ERROR_VAR.prop('stack', null)).toDeclStmt(null, [
                o.StmtModifier.Final
            ]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
        var /** @type {?} */ typeStr;
        switch (type.name) {
            case o.BuiltinTypeName.Bool:
                typeStr = 'boolean';
                break;
            case o.BuiltinTypeName.Dynamic:
                typeStr = 'any';
                break;
            case o.BuiltinTypeName.Function:
                typeStr = 'Function';
                break;
            case o.BuiltinTypeName.Number:
                typeStr = 'number';
                break;
            case o.BuiltinTypeName.Int:
                typeStr = 'number';
                break;
            case o.BuiltinTypeName.String:
                typeStr = 'string';
                break;
            default:
                throw new Error("Unsupported builtin type " + type.name);
        }
        ctx.print(null, typeStr);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitExpressionType = function (ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
        this.visitType(type.of, ctx);
        ctx.print(null, "[]");
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitMapType = function (type, ctx) {
        ctx.print(null, "{[key: string]:");
        this.visitType(type.valueType, ctx);
        ctx.print(null, "}");
        return null;
    };
    /**
     * @param {?} method
     * @return {?}
     */
    _TsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
        var /** @type {?} */ name;
        switch (method) {
            case o.BuiltinMethod.ConcatArray:
                name = 'concat';
                break;
            case o.BuiltinMethod.SubscribeObservable:
                name = 'subscribe';
                break;
            case o.BuiltinMethod.Bind:
                name = 'bind';
                break;
            default:
                throw new Error("Unknown builtin method: " + method);
        }
        return name;
    };
    /**
     * @param {?} params
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitParams = function (params, ctx) {
        var _this = this;
        this.visitAllObjects(function (param) {
            ctx.print(null, param.name);
            _this._printColonType(param.type, ctx);
        }, params, ctx, ',');
    };
    /**
     * @param {?} value
     * @param {?} typeParams
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
        var _this = this;
        var name = value.name, moduleName = value.moduleName;
        if (moduleName) {
            var /** @type {?} */ prefix = this.importsWithPrefixes.get(moduleName);
            if (prefix == null) {
                prefix = "i" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(moduleName, prefix);
            }
            ctx.print(null, prefix + ".");
        }
        ctx.print(null, /** @type {?} */ ((name)));
        if (this.typeExpression > 0) {
            // If we are in a type expression that refers to a generic type then supply
            // the required type parameters. If there were not enough type parameters
            // supplied, supply any as the type. Outside a type expression the reference
            // should not supply type parameters and be treated as a simple value reference
            // to the constructor function itself.
            var /** @type {?} */ suppliedParameters = typeParams || [];
            if (suppliedParameters.length > 0) {
                ctx.print(null, "<");
                this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, /** @type {?} */ ((typeParams)), ctx, ',');
                ctx.print(null, ">");
            }
        }
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    _TsEmitterVisitor.prototype._printColonType = function (type, ctx, defaultType) {
        if (type !== o.INFERRED_TYPE) {
            ctx.print(null, ':');
            this.visitType(type, ctx, defaultType);
        }
    };
    return _TsEmitterVisitor;
}(AbstractEmitterVisitor));
function _TsEmitterVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    _TsEmitterVisitor.prototype.typeExpression;
    /** @type {?} */
    _TsEmitterVisitor.prototype.importsWithPrefixes;
    /** @type {?} */
    _TsEmitterVisitor.prototype.reexports;
}
//# sourceMappingURL=ts_emitter.js.map