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
var expression_type_1 = require("./expression_type");
var symbols_1 = require("./symbols");
function getTemplateExpressionDiagnostics(info) {
    var visitor = new ExpressionDiagnosticsVisitor(info, function (path, includeEvent) {
        return getExpressionScope(info, path, includeEvent);
    });
    compiler_1.templateVisitAll(visitor, info.templateAst);
    return visitor.diagnostics;
}
exports.getTemplateExpressionDiagnostics = getTemplateExpressionDiagnostics;
function getExpressionDiagnostics(scope, ast, query, context) {
    if (context === void 0) { context = {}; }
    var analyzer = new expression_type_1.AstType(scope, query, context);
    analyzer.getDiagnostics(ast);
    return analyzer.diagnostics;
}
exports.getExpressionDiagnostics = getExpressionDiagnostics;
function getReferences(info) {
    var result = [];
    function processReferences(references) {
        var _loop_1 = function (reference) {
            var type = undefined;
            if (reference.value) {
                type = info.query.getTypeSymbol(compiler_1.tokenReference(reference.value));
            }
            result.push({
                name: reference.name,
                kind: 'reference',
                type: type || info.query.getBuiltinType(symbols_1.BuiltinType.Any),
                get definition() { return getDefinitionOf(info, reference); }
            });
        };
        for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
            var reference = references_1[_i];
            _loop_1(reference);
        }
    }
    var visitor = new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visitEmbeddedTemplate = function (ast, context) {
            _super.prototype.visitEmbeddedTemplate.call(this, ast, context);
            processReferences(ast.references);
        };
        class_1.prototype.visitElement = function (ast, context) {
            _super.prototype.visitElement.call(this, ast, context);
            processReferences(ast.references);
        };
        return class_1;
    }(compiler_1.RecursiveTemplateAstVisitor));
    compiler_1.templateVisitAll(visitor, info.templateAst);
    return result;
}
function getDefinitionOf(info, ast) {
    if (info.fileName) {
        var templateOffset = info.offset;
        return [{
                fileName: info.fileName,
                span: {
                    start: ast.sourceSpan.start.offset + templateOffset,
                    end: ast.sourceSpan.end.offset + templateOffset
                }
            }];
    }
}
function getVarDeclarations(info, path) {
    var result = [];
    var current = path.tail;
    while (current) {
        if (current instanceof compiler_1.EmbeddedTemplateAst) {
            var _loop_2 = function (variable) {
                var name_1 = variable.name;
                // Find the first directive with a context.
                var context = current.directives.map(function (d) { return info.query.getTemplateContext(d.directive.type.reference); })
                    .find(function (c) { return !!c; });
                // Determine the type of the context field referenced by variable.value.
                var type = undefined;
                if (context) {
                    var value = context.get(variable.value);
                    if (value) {
                        type = value.type;
                        var kind = info.query.getTypeKind(type);
                        if (kind === symbols_1.BuiltinType.Any || kind == symbols_1.BuiltinType.Unbound) {
                            // The any type is not very useful here. For special cases, such as ngFor, we can do
                            // better.
                            type = refinedVariableType(type, info, current);
                        }
                    }
                }
                if (!type) {
                    type = info.query.getBuiltinType(symbols_1.BuiltinType.Any);
                }
                result.push({
                    name: name_1,
                    kind: 'variable', type: type, get definition() { return getDefinitionOf(info, variable); }
                });
            };
            for (var _i = 0, _a = current.variables; _i < _a.length; _i++) {
                var variable = _a[_i];
                _loop_2(variable);
            }
        }
        current = path.parentOf(current);
    }
    return result;
}
function refinedVariableType(type, info, templateElement) {
    // Special case the ngFor directive
    var ngForDirective = templateElement.directives.find(function (d) {
        var name = compiler_1.identifierName(d.directive.type);
        return name == 'NgFor' || name == 'NgForOf';
    });
    if (ngForDirective) {
        var ngForOfBinding = ngForDirective.inputs.find(function (i) { return i.directiveName == 'ngForOf'; });
        if (ngForOfBinding) {
            var bindingType = new expression_type_1.AstType(info.members, info.query, {}).getType(ngForOfBinding.value);
            if (bindingType) {
                var result = info.query.getElementType(bindingType);
                if (result) {
                    return result;
                }
            }
        }
    }
    // We can't do better, return any
    return info.query.getBuiltinType(symbols_1.BuiltinType.Any);
}
function getEventDeclaration(info, includeEvent) {
    var result = [];
    if (includeEvent) {
        // TODO: Determine the type of the event parameter based on the Observable<T> or EventEmitter<T>
        // of the event.
        result = [{ name: '$event', kind: 'variable', type: info.query.getBuiltinType(symbols_1.BuiltinType.Any) }];
    }
    return result;
}
function getExpressionScope(info, path, includeEvent) {
    var result = info.members;
    var references = getReferences(info);
    var variables = getVarDeclarations(info, path);
    var events = getEventDeclaration(info, includeEvent);
    if (references.length || variables.length || events.length) {
        var referenceTable = info.query.createSymbolTable(references);
        var variableTable = info.query.createSymbolTable(variables);
        var eventsTable = info.query.createSymbolTable(events);
        result = info.query.mergeSymbolTable([result, referenceTable, variableTable, eventsTable]);
    }
    return result;
}
exports.getExpressionScope = getExpressionScope;
var ExpressionDiagnosticsVisitor = (function (_super) {
    __extends(ExpressionDiagnosticsVisitor, _super);
    function ExpressionDiagnosticsVisitor(info, getExpressionScope) {
        var _this = _super.call(this) || this;
        _this.info = info;
        _this.getExpressionScope = getExpressionScope;
        _this.diagnostics = [];
        _this.path = new compiler_1.AstPath([]);
        return _this;
    }
    ExpressionDiagnosticsVisitor.prototype.visitDirective = function (ast, context) {
        // Override the default child visitor to ignore the host properties of a directive.
        if (ast.inputs && ast.inputs.length) {
            compiler_1.templateVisitAll(this, ast.inputs, context);
        }
    };
    ExpressionDiagnosticsVisitor.prototype.visitBoundText = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, ast.sourceSpan.start.offset, false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitDirectiveProperty = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, this.attributeValueLocation(ast), false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitElementProperty = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, this.attributeValueLocation(ast), false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitEvent = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.handler, this.attributeValueLocation(ast), true);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitVariable = function (ast) {
        var directive = this.directiveSummary;
        if (directive && ast.value) {
            var context = this.info.query.getTemplateContext(directive.type.reference);
            if (context && !context.has(ast.value)) {
                if (ast.value === '$implicit') {
                    this.reportError('The template context does not have an implicit value', spanOf(ast.sourceSpan));
                }
                else {
                    this.reportError("The template context does not defined a member called '" + ast.value + "'", spanOf(ast.sourceSpan));
                }
            }
        }
    };
    ExpressionDiagnosticsVisitor.prototype.visitElement = function (ast, context) {
        this.push(ast);
        _super.prototype.visitElement.call(this, ast, context);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        var previousDirectiveSummary = this.directiveSummary;
        this.push(ast);
        // Find directive that refernces this template
        this.directiveSummary =
            ast.directives.map(function (d) { return d.directive; }).find(function (d) { return hasTemplateReference(d.type); });
        // Process children
        _super.prototype.visitEmbeddedTemplate.call(this, ast, context);
        this.pop();
        this.directiveSummary = previousDirectiveSummary;
    };
    ExpressionDiagnosticsVisitor.prototype.attributeValueLocation = function (ast) {
        var path = compiler_1.findNode(this.info.htmlAst, ast.sourceSpan.start.offset);
        var last = path.tail;
        if (last instanceof compiler_1.Attribute && last.valueSpan) {
            // Add 1 for the quote.
            return last.valueSpan.start.offset + 1;
        }
        return ast.sourceSpan.start.offset;
    };
    ExpressionDiagnosticsVisitor.prototype.diagnoseExpression = function (ast, offset, includeEvent) {
        var _this = this;
        var scope = this.getExpressionScope(this.path, includeEvent);
        (_a = this.diagnostics).push.apply(_a, getExpressionDiagnostics(scope, ast, this.info.query, {
            event: includeEvent
        }).map(function (d) { return ({
            span: offsetSpan(d.ast.span, offset + _this.info.offset),
            kind: d.kind,
            message: d.message
        }); }));
        var _a;
    };
    ExpressionDiagnosticsVisitor.prototype.push = function (ast) { this.path.push(ast); };
    ExpressionDiagnosticsVisitor.prototype.pop = function () { this.path.pop(); };
    ExpressionDiagnosticsVisitor.prototype.reportError = function (message, span) {
        if (span) {
            this.diagnostics.push({ span: offsetSpan(span, this.info.offset), kind: expression_type_1.DiagnosticKind.Error, message: message });
        }
    };
    ExpressionDiagnosticsVisitor.prototype.reportWarning = function (message, span) {
        this.diagnostics.push({ span: offsetSpan(span, this.info.offset), kind: expression_type_1.DiagnosticKind.Warning, message: message });
    };
    return ExpressionDiagnosticsVisitor;
}(compiler_1.RecursiveTemplateAstVisitor));
function hasTemplateReference(type) {
    if (type.diDeps) {
        for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
            var diDep = _a[_i];
            if (diDep.token && diDep.token.identifier &&
                compiler_1.identifierName(diDep.token.identifier) == 'TemplateRef')
                return true;
        }
    }
    return false;
}
function offsetSpan(span, amount) {
    return { start: span.start + amount, end: span.end + amount };
}
function spanOf(sourceSpan) {
    return { start: sourceSpan.start.offset, end: sourceSpan.end.offset };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9kaWFnbm9zdGljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvZGlhZ25vc3RpY3MvZXhwcmVzc2lvbl9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBaVo7QUFFaloscURBQXdHO0FBQ3hHLHFDQUE2RztBQWlCN0csMENBQWlELElBQTRCO0lBRTNFLElBQU0sT0FBTyxHQUFHLElBQUksNEJBQTRCLENBQzVDLElBQUksRUFBRSxVQUFDLElBQXFCLEVBQUUsWUFBcUI7UUFDekMsT0FBQSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQztJQUE1QyxDQUE0QyxDQUFDLENBQUM7SUFDNUQsMkJBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUM3QixDQUFDO0FBUEQsNEVBT0M7QUFFRCxrQ0FDSSxLQUFrQixFQUFFLEdBQVEsRUFBRSxLQUFrQixFQUNoRCxPQUEwQztJQUExQyx3QkFBQSxFQUFBLFlBQTBDO0lBQzVDLElBQU0sUUFBUSxHQUFHLElBQUkseUJBQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7QUFDOUIsQ0FBQztBQU5ELDREQU1DO0FBRUQsdUJBQXVCLElBQTRCO0lBQ2pELElBQU0sTUFBTSxHQUF3QixFQUFFLENBQUM7SUFFdkMsMkJBQTJCLFVBQTBCO2dDQUN4QyxTQUFTO1lBQ2xCLElBQUksSUFBSSxHQUFxQixTQUFTLENBQUM7WUFDdkMsRUFBRSxDQUFDLENB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