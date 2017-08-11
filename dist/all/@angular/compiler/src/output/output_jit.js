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
var core_1 = require("@angular/core");
var compile_metadata_1 = require("../compile_metadata");
var abstract_emitter_1 = require("./abstract_emitter");
var abstract_js_emitter_1 = require("./abstract_js_emitter");
var o = require("./output_ast");
function evalExpression(sourceUrl, ctx, vars) {
    var fnBody = ctx.toSource() + "\n//# sourceURL=" + sourceUrl;
    var fnArgNames = [];
    var fnArgValues = [];
    for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    if (core_1.isDevMode()) {
        // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
        // E.g. ```
        // function anonymous(a,b,c
        // /**/) { ... }```
        // We don't want to hard code this fact, so we auto detect it via an empty function first.
        var emptyFn = new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat('return null;'))))().toString();
        var headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += "\n" + ctx.toSourceMapGenerator(sourceUrl, sourceUrl, headerLines).toJsComment();
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
function jitStatements(sourceUrl, statements) {
    var converter = new JitEmitterVisitor();
    var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
    converter.visitAllStatements(statements, ctx);
    converter.createReturnStmt(ctx);
    return evalExpression(sourceUrl, ctx, converter.getArgs());
}
exports.jitStatements = jitStatements;
var JitEmitterVisitor = (function (_super) {
    __extends(JitEmitterVisitor, _super);
    function JitEmitterVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._evalArgNames = [];
        _this._evalArgValues = [];
        _this._evalExportedVars = [];
        return _this;
    }
    JitEmitterVisitor.prototype.createReturnStmt = function (ctx) {
        var stmt = new o.ReturnStatement(new o.LiteralMapExpr(this._evalExportedVars.map(function (resultVar) { return new o.LiteralMapEntry(resultVar, o.variable(resultVar), false); })));
        stmt.visitStatement(this, ctx);
    };
    JitEmitterVisitor.prototype.getArgs = function () {
        var result = {};
        for (var i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    };
    JitEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        var value = ast.value.runtime;
        var id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            var name_1 = compile_metadata_1.identifierName({ reference: ast.value.runtime }) || 'val';
            this._evalArgNames.push("jit_" + name_1 + "_" + id);
        }
        ctx.print(ast, this._evalArgNames[id]);
        return null;
    };
    JitEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
    };
    JitEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
    };
    JitEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
    };
    return JitEmitterVisitor;
}(abstract_js_emitter_1.AbstractJsEmitterVisitor));
exports.JitEmitterVisitor = JitEmitterVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2ppdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2ppdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFDeEMsd0RBQW1EO0FBRW5ELHVEQUF5RDtBQUN6RCw2REFBK0Q7QUFDL0QsZ0NBQWtDO0FBRWxDLHdCQUNJLFNBQWlCLEVBQUUsR0FBMEIsRUFBRSxJQUEwQjtJQUMzRSxJQUFJLE1BQU0sR0FBTSxHQUFHLENBQUMsUUFBUSxFQUFFLHdCQUFtQixTQUFXLENBQUM7SUFDN0QsSUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO0lBQ2hDLElBQU0sV0FBVyxHQUFVLEVBQUUsQ0FBQztJQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNCLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsZ0JBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQiwwRkFBMEY7UUFDMUYsV0FBVztRQUNYLDJCQUEyQjtRQUMzQixtQkFBbUI7UUFDbkIsMEZBQTBGO1FBQzFGLElBQU0sT0FBTyxHQUFHLEtBQUksUUFBUSxZQUFSLFFBQVEsa0JBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBRSxRQUFRLEVBQUUsQ0FBQztRQUM5RSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFD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