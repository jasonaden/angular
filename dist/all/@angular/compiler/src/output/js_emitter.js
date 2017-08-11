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
var abstract_emitter_1 = require("./abstract_emitter");
var abstract_js_emitter_1 = require("./abstract_js_emitter");
var o = require("./output_ast");
var JavaScriptEmitter = (function () {
    function JavaScriptEmitter() {
    }
    JavaScriptEmitter.prototype.emitStatements = function (srcFilePath, genFilePath, stmts, preamble) {
        if (preamble === void 0) { preamble = ''; }
        var converter = new JsEmitterVisitor();
        var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
        converter.visitAllStatements(stmts, ctx);
        var preambleLines = preamble ? preamble.split('\n') : [];
        converter.importsWithPrefixes.forEach(function (prefix, importedModuleName) {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            preambleLines.push("var " + prefix + " = req" +
                ("uire('" + importedModuleName + "');"));
        });
        var sm = ctx.toSourceMapGenerator(srcFilePath, genFilePath, preambleLines.length).toJsComment();
        var lines = preambleLines.concat([ctx.toSource(), sm]);
        if (sm) {
            // always add a newline at the end, as some tools have bugs without it.
            lines.push('');
        }
        return lines.join('\n');
    };
    return JavaScriptEmitter;
}());
exports.JavaScriptEmitter = JavaScriptEmitter;
var JsEmitterVisitor = (function (_super) {
    __extends(JsEmitterVisitor, _super);
    function JsEmitterVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.importsWithPrefixes = new Map();
        return _this;
    }
    JsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        var _a = ast.value, name = _a.name, moduleName = _a.moduleName;
        if (moduleName) {
            var prefix = this.importsWithPrefixes.get(moduleName);
            if (prefix == null) {
                prefix = "i" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(moduleName, prefix);
            }
            ctx.print(ast, prefix + ".");
        }
        ctx.print(ast, name);
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    return JsEmitterVisitor;
}(abstract_js_emitter_1.AbstractJsEmitterVisitor));
function exportVar(varName) {
    return "Object.defineProperty(exports, '" + varName + "', { get: function() { return " + varName + "; }});";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvanNfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFNSCx1REFBd0U7QUFDeEUsNkRBQStEO0FBQy9ELGdDQUFrQztBQUVsQztJQUFBO0lBeUJBLENBQUM7SUF4QkMsMENBQWMsR0FBZCxVQUNJLFdBQW1CLEVBQUUsV0FBbUIsRUFBRSxLQUFvQixFQUM5RCxRQUFxQjtRQUFyQix5QkFBQSxFQUFBLGFBQXFCO1FBQ3ZCLElBQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxJQUFNLEdBQUcsR0FBRyx3Q0FBcUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXpDLElBQU0sYUFBYSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzRCxTQUFTLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLGtCQUFrQjtZQUMvRCx5RkFBeUY7WUFDekYsYUFBYSxDQUFDLElBQUksQ0FDZCxTQUFPLE1BQU0sV0FBUTtpQkFDckIsV0FBUyxrQkFBa0IsUUFBSyxDQUFBLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQU0sRUFBRSxHQUNKLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzRixJQUFNLEtBQUssR0FBTyxhQUFhLFNBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQ3JELEVBQUUs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