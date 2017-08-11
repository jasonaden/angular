"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("./output_ast");
var source_map_1 = require("./source_map");
var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
var _INDENT_WITH = '  ';
exports.CATCH_ERROR_VAR = o.variable('error', null, null);
exports.CATCH_STACK_VAR = o.variable('stack', null, null);
var OutputEmitter = (function () {
    function OutputEmitter() {
    }
    return OutputEmitter;
}());
exports.OutputEmitter = OutputEmitter;
var _EmittedLine = (function () {
    function _EmittedLine(indent) {
        this.indent = indent;
        this.partsLength = 0;
        this.parts = [];
        this.srcSpans = [];
    }
    return _EmittedLine;
}());
var EmitterVisitorContext = (function () {
    function EmitterVisitorContext(_indent) {
        this._indent = _indent;
        this._classes = [];
        this._preambleLineCount = 0;
        this._lines = [new _EmittedLine(_indent)];
    }
    EmitterVisitorContext.createRoot = function () { return new EmitterVisitorContext(0); };
    Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
        get: function () { return this._lines[this._lines.length - 1]; },
        enumerable: true,
        configurable: true
    });
    EmitterVisitorContext.prototype.println = function (from, lastPart) {
        if (lastPart === void 0) { lastPart = ''; }
        this.print(from || null, lastPart, true);
    };
    EmitterVisitorContext.prototype.lineIsEmpty = function () { return this._currentLine.parts.length === 0; };
    EmitterVisitorContext.prototype.lineLength = function () {
        return this._currentLine.indent * _INDENT_WITH.length + this._currentLine.partsLength;
    };
    EmitterVisitorContext.prototype.print = function (from, part, newLine) {
        if (newLine === void 0) { newLine = false; }
        if (part.length > 0) {
            this._currentLine.parts.push(part);
            this._currentLine.partsLength += part.length;
            this._currentLine.srcSpans.push(from && from.sourceSpan || null);
        }
        if (newLine) {
            this._lines.push(new _EmittedLine(this._indent));
        }
    };
    EmitterVisitorContext.prototype.removeEmptyLastLine = function () {
        if (this.lineIsEmpty()) {
            this._lines.pop();
        }
    };
    EmitterVisitorContext.prototype.incIndent = function () {
        this._indent++;
        if (this.lineIsEmpty()) {
            this._currentLine.indent = this._indent;
        }
    };
    EmitterVisitorContext.prototype.decIndent = function () {
        this._indent--;
        if (this.lineIsEmpty()) {
            this._currentLine.indent = this._indent;
        }
    };
    EmitterVisitorContext.prototype.pushClass = function (clazz) { this._classes.push(clazz); };
    EmitterVisitorContext.prototype.popClass = function () { return this._classes.pop(); };
    Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
        get: function () {
            return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
        },
        enumerable: true,
        configurable: true
    });
    EmitterVisitorContext.prototype.toSource = function () {
        return this.sourceLines
            .map(function (l) { return l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : ''; })
            .join('\n');
    };
    EmitterVisitorContext.prototype.toSourceMapGenerator = function (sourceFilePath, genFilePath, startsAtLine) {
        if (startsAtLine === void 0) { startsAtLine = 0; }
        var map = new source_map_1.SourceMapGenerator(genFilePath);
        var firstOffsetMapped = false;
        var mapFirstOffsetIfNeeded = function () {
            if (!firstOffsetMapped) {
                // Add a single space so that tools won't try to load the file from disk.
                // Note: We are using virtual urls like `ng:///`, so we have to
                // provide a content here.
                map.addSource(sourceFilePath, ' ').addMapping(0, sourceFilePath, 0, 0);
                firstOffsetMapped = true;
            }
        };
        for (var i = 0; i < startsAtLine; i++) {
            map.addLine();
            mapFirstOffsetIfNeeded();
        }
        this.sourceLines.forEach(function (line, lineIdx) {
            map.addLine();
            var spans = line.srcSpans;
            var parts = line.parts;
            var col0 = line.indent * _INDENT_WITH.length;
            var spanIdx = 0;
            // skip leading parts without source spans
            while (spanIdx < spans.length && !spans[spanIdx]) {
                col0 += parts[spanIdx].length;
                spanIdx++;
            }
            if (spanIdx < spans.length && lineIdx === 0 && col0 === 0) {
                firstOffsetMapped = true;
            }
            else {
                mapFirstOffsetIfNeeded();
            }
            while (spanIdx < spans.length) {
                var span = spans[spanIdx];
                var source = span.start.file;
                var sourceLine = span.start.line;
                var sourceCol = span.start.col;
                map.addSource(source.url, source.content)
                    .addMapping(col0, source.url, sourceLine, sourceCol);
                col0 += parts[spanIdx].length;
                spanIdx++;
                // assign parts without span or the same span to the previous segment
                while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
                    col0 += parts[spanIdx].length;
                    spanIdx++;
                }
            }
        });
        return map;
    };
    EmitterVisitorContext.prototype.setPreambleLineCount = function (count) { return this._preambleLineCount = count; };
    EmitterVisitorContext.prototype.spanOf = function (line, column) {
        var emittedLine = this._lines[line - this._preambleLineCount];
        if (emittedLine) {
            var columnsLeft = column - emittedLine.indent;
            for (var partIndex = 0; partIndex < emittedLine.parts.length; partIndex++) {
                var part = emittedLine.parts[partIndex];
                if (part.length > columnsLeft) {
                    return emittedLine.srcSpans[partIndex];
                }
                columnsLeft -= part.length;
            }
        }
        return null;
    };
    Object.defineProperty(EmitterVisitorContext.prototype, "sourceLines", {
        get: function () {
            if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
                return this._lines.slice(0, -1);
            }
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    return EmitterVisitorContext;
}());
exports.EmitterVisitorContext = EmitterVisitorContext;
var AbstractEmitterVisitor = (function () {
    function AbstractEmitterVisitor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
    }
    AbstractEmitterVisitor.prototype.visitExpressionStmt = function (stmt, ctx) {
        stmt.expr.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    };
    AbstractEmitterVisitor.prototype.visitReturnStmt = function (stmt, ctx) {
        ctx.print(stmt, "return ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    };
    AbstractEmitterVisitor.prototype.visitIfStmt = function (stmt, ctx) {
        ctx.print(stmt, "if (");
        stmt.condition.visitExpression(this, ctx);
        ctx.print(stmt, ") {");
        var hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
            ctx.print(stmt, " ");
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.removeEmptyLastLine();
            ctx.print(stmt, " ");
        }
        else {
            ctx.println();
            ctx.incIndent();
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.decIndent();
            if (hasElseCase) {
                ctx.println(stmt, "} else {");
                ctx.incIndent();
                this.visitAllStatements(stmt.falseCase, ctx);
                ctx.decIndent();
            }
        }
        ctx.println(stmt, "}");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitThrowStmt = function (stmt, ctx) {
        ctx.print(stmt, "throw ");
        stmt.error.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitCommentStmt = function (stmt, ctx) {
        var lines = stmt.comment.split('\n');
        lines.forEach(function (line) { ctx.println(stmt, "// " + line); });
        return null;
    };
    AbstractEmitterVisitor.prototype.visitWriteVarExpr = function (expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        ctx.print(expr, expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function (expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "[");
        expr.index.visitExpression(this, ctx);
        ctx.print(expr, "] = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    AbstractEmitterVisitor.prototype.visitWritePropExpr = function (expr, ctx) {
        var lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "." + expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr, ctx) {
        expr.receiver.visitExpression(this, ctx);
        var name = expr.name;
        if (expr.builtin != null) {
            name = this.getBuiltinMethodName(expr.builtin);
            if (name == null) {
                // some builtins just mean to skip the call.
                return null;
            }
        }
        ctx.print(expr, "." + name + "(");
        this.visitAllExpressions(expr.args, ctx, ",");
        ctx.print(expr, ")");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print(expr, "(");
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(expr, ")");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
        var varName = ast.name;
        if (ast.builtin != null) {
            switch (ast.builtin) {
                case o.BuiltinVar.Super:
                    varName = 'super';
                    break;
                case o.BuiltinVar.This:
                    varName = 'this';
                    break;
                case o.BuiltinVar.CatchError:
                    varName = exports.CATCH_ERROR_VAR.name;
                    break;
                case o.BuiltinVar.CatchStack:
                    varName = exports.CATCH_STACK_VAR.name;
                    break;
                default:
                    throw new Error("Unknown builtin variable " + ast.builtin);
            }
        }
        ctx.print(ast, varName);
        return null;
    };
    AbstractEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print(ast, "new ");
        ast.classExpr.visitExpression(this, ctx);
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
        var value = ast.value;
        if (typeof value === 'string') {
            ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
        }
        else {
            ctx.print(ast, "" + value);
        }
        return null;
    };
    AbstractEmitterVisitor.prototype.visitConditionalExpr = function (ast, ctx) {
        ctx.print(ast, "(");
        ast.condition.visitExpression(this, ctx);
        ctx.print(ast, '? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(ast, ': ');
        ast.falseCase.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitNotExpr = function (ast, ctx) {
        ctx.print(ast, '!');
        ast.condition.visitExpression(this, ctx);
        return null;
    };
    AbstractEmitterVisitor.prototype.visitAssertNotNullExpr = function (ast, ctx) {
        ast.condition.visitExpression(this, ctx);
        return null;
    };
    AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
        var opStr;
        switch (ast.operator) {
            case o.BinaryOperator.Equals:
                opStr = '==';
                break;
            case o.BinaryOperator.Identical:
                opStr = '===';
                break;
            case o.BinaryOperator.NotEquals:
                opStr = '!=';
                break;
            case o.BinaryOperator.NotIdentical:
                opStr = '!==';
                break;
            case o.BinaryOperator.And:
                opStr = '&&';
                break;
            case o.BinaryOperator.Or:
                opStr = '||';
                break;
            case o.BinaryOperator.Plus:
                opStr = '+';
                break;
            case o.BinaryOperator.Minus:
                opStr = '-';
                break;
            case o.BinaryOperator.Divide:
                opStr = '/';
                break;
            case o.BinaryOperator.Multiply:
                opStr = '*';
                break;
            case o.BinaryOperator.Modulo:
                opStr = '%';
                break;
            case o.BinaryOperator.Lower:
                opStr = '<';
                break;
            case o.BinaryOperator.LowerEquals:
                opStr = '<=';
                break;
            case o.BinaryOperator.Bigger:
                opStr = '>';
                break;
            case o.BinaryOperator.BiggerEquals:
                opStr = '>=';
                break;
            default:
                throw new Error("Unknown operator " + ast.operator);
        }
        ctx.print(ast, "(");
        ast.lhs.visitExpression(this, ctx);
        ctx.print(ast, " " + opStr + " ");
        ast.rhs.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitReadPropExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, ".");
        ctx.print(ast, ast.name);
        return null;
    };
    AbstractEmitterVisitor.prototype.visitReadKeyExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, "[");
        ast.index.visitExpression(this, ctx);
        ctx.print(ast, "]");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        ctx.print(ast, "[");
        this.visitAllExpressions(ast.entries, ctx, ',');
        ctx.print(ast, "]");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
        var _this = this;
        ctx.print(ast, "{");
        this.visitAllObjects(function (entry) {
            ctx.print(ast, escapeIdentifier(entry.key, _this._escapeDollarInStrings, entry.quoted) + ":");
            entry.value.visitExpression(_this, ctx);
        }, ast.entries, ctx, ',');
        ctx.print(ast, "}");
        return null;
    };
    AbstractEmitterVisitor.prototype.visitCommaExpr = function (ast, ctx) {
        ctx.print(ast, '(');
        this.visitAllExpressions(ast.parts, ctx, ',');
        ctx.print(ast, ')');
        return null;
    };
    AbstractEmitterVisitor.prototype.visitAllExpressions = function (expressions, ctx, separator) {
        var _this = this;
        this.visitAllObjects(function (expr) { return expr.visitExpression(_this, ctx); }, expressions, ctx, separator);
    };
    AbstractEmitterVisitor.prototype.visitAllObjects = function (handler, expressions, ctx, separator) {
        var incrementedIndent = false;
        for (var i = 0; i < expressions.length; i++) {
            if (i > 0) {
                if (ctx.lineLength() > 80) {
                    ctx.print(null, separator, true);
                    if (!incrementedIndent) {
                        // continuation are marked with double indent.
                        ctx.incIndent();
                        ctx.incIndent();
                        incrementedIndent = true;
                    }
                }
                else {
                    ctx.print(null, separator, false);
                }
            }
            handler(expressions[i]);
        }
        if (incrementedIndent) {
            // continuation are marked with double indent.
            ctx.decIndent();
            ctx.decIndent();
        }
    };
    AbstractEmitterVisitor.prototype.visitAllStatements = function (statements, ctx) {
        var _this = this;
        statements.forEach(function (stmt) { return stmt.visitStatement(_this, ctx); });
    };
    return AbstractEmitterVisitor;
}());
exports.AbstractEmitterVisitor = AbstractEmitterVisitor;
function escapeIdentifier(input, escapeDollar, alwaysQuote) {
    if (alwaysQuote === void 0) { alwaysQuote = true; }
    if (input == null) {
        return null;
    }
    var body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, function () {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            match[_i] = arguments[_i];
        }
        if (match[0] == '$') {
            return escapeDollar ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return "\\" + match[0];
        }
    });
    var requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
    return requiresQuotes ? "'" + body + "'" : body;
}
exports.escapeIdentifier = escapeIdentifier;
function _createIndent(count) {
    var res = '';
    for (var i = 0; i < count; i++) {
        res += _INDENT_WITH;
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvYWJzdHJhY3RfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILGdDQUFrQztBQUNsQywyQ0FBZ0Q7QUFFaEQsSUFBTSw4QkFBOEIsR0FBRyxnQkFBZ0IsQ0FBQztBQUN4RCxJQUFNLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDO0FBQ3JELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQztBQUNiLFFBQUEsZUFBZSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsRCxRQUFBLGVBQWUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFL0Q7SUFBQTtJQUlBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSnFCLHNDQUFhO0FBTW5DO0lBSUUsc0JBQW1CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSGpDLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFVBQUssR0FBYSxFQUFFLENBQUM7UUFDckIsYUFBUSxHQUE2QixFQUFFLENBQUM7SUFDSixDQUFDO0lBQ3ZDLG1CQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFFRDtJQU9FLCtCQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUgzQixhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3Qix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFFUSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUFDLENBQUM7SUFONUUsZ0NBQVUsR0FBakIsY0FBNkMsTUFBTSxDQUFD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