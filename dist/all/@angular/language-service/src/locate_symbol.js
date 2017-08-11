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
var compiler_cli_1 = require("@angular/compiler-cli");
var expressions_1 = require("./expressions");
var utils_1 = require("./utils");
function locateSymbol(info) {
    if (!info.position)
        return undefined;
    var templatePosition = info.position - info.template.span.start;
    var path = utils_1.findTemplateAstAt(info.templateAst, templatePosition);
    if (path.tail) {
        var symbol_1 = undefined;
        var span_1 = undefined;
        var attributeValueSymbol_1 = function (ast, inEvent) {
            if (inEvent === void 0) { inEvent = false; }
            var attribute = findAttribute(info);
            if (attribute) {
                if (utils_1.inSpan(templatePosition, utils_1.spanOf(attribute.valueSpan))) {
                    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
                    var scope = compiler_cli_1.getExpressionScope(dinfo, path, inEvent);
                    if (attribute.valueSpan) {
                        var expressionOffset = attribute.valueSpan.start.offset + 1;
                        var result = expressions_1.getExpressionSymbol(scope, ast, templatePosition - expressionOffset, info.template.query);
                        if (result) {
                            symbol_1 = result.symbol;
                            span_1 = utils_1.offsetSpan(result.span, expressionOffset);
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        path.tail.visit({
            visitNgContent: function (ast) { },
            visitEmbeddedTemplate: function (ast) { },
            visitElement: function (ast) {
                var component = ast.directives.find(function (d) { return d.directive.isComponent; });
                if (component) {
                    symbol_1 = info.template.query.getTypeSymbol(component.directive.type.reference);
                    symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'component');
                    span_1 = utils_1.spanOf(ast);
                }
                else {
                    // Find a directive that matches the element name
                    var directive = ast.directives.find(function (d) { return d.directive.selector != null && d.directive.selector.indexOf(ast.name) >= 0; });
                    if (directive) {
                        symbol_1 = info.template.query.getTypeSymbol(directive.directive.type.reference);
                        symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'directive');
                        span_1 = utils_1.spanOf(ast);
                    }
                }
            },
            visitReference: function (ast) {
                symbol_1 = ast.value && info.template.query.getTypeSymbol(compiler_1.tokenReference(ast.value));
                span_1 = utils_1.spanOf(ast);
            },
            visitVariable: function (ast) { },
            visitEvent: function (ast) {
                if (!attributeValueSymbol_1(ast.handler, /* inEvent */ true)) {
                    symbol_1 = findOutputBinding(info, path, ast);
                    symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'event');
                    span_1 = utils_1.spanOf(ast);
                }
            },
            visitElementProperty: function (ast) { attributeValueSymbol_1(ast.value); },
            visitAttr: function (ast) { },
            visitBoundText: function (ast) {
                var expressionPosition = templatePosition - ast.sourceSpan.start.offset;
                if (utils_1.inSpan(expressionPosition, ast.value.span)) {
                    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
                    var scope = compiler_cli_1.getExpressionScope(dinfo, path, /* includeEvent */ false);
                    var result = expressions_1.getExpressionSymbol(scope, ast.value, expressionPosition, info.template.query);
                    if (result) {
                        symbol_1 = result.symbol;
                        span_1 = utils_1.offsetSpan(result.span, ast.sourceSpan.start.offset);
                    }
                }
            },
            visitText: function (ast) { },
            visitDirective: function (ast) {
                symbol_1 = info.template.query.getTypeSymbol(ast.directive.type.reference);
                span_1 = utils_1.spanOf(ast);
            },
            visitDirectiveProperty: function (ast) {
                if (!attributeValueSymbol_1(ast.value)) {
                    symbol_1 = findInputBinding(info, path, ast);
                    span_1 = utils_1.spanOf(ast);
                }
            }
        }, null);
        if (symbol_1 && span_1) {
            return { symbol: symbol_1, span: utils_1.offsetSpan(span_1, info.template.span.start) };
        }
    }
}
exports.locateSymbol = locateSymbol;
function findAttribute(info) {
    if (info.position) {
        var templatePosition = info.position - info.template.span.start;
        var path = compiler_1.findNode(info.htmlAst, templatePosition);
        return path.first(compiler_1.Attribute);
    }
}
function findInputBinding(info, path, binding) {
    var element = path.first(compiler_1.ElementAst);
    if (element) {
        for (var _i = 0, _a = element.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            var invertedInput = invertMap(directive.directive.inputs);
            var fieldName = invertedInput[binding.templateName];
            if (fieldName) {
                var classSymbol = info.template.query.getTypeSymbol(directive.directive.type.reference);
                if (classSymbol) {
                    return classSymbol.members().get(fieldName);
                }
            }
        }
    }
}
function findOutputBinding(info, path, binding) {
    var element = path.first(compiler_1.ElementAst);
    if (element) {
        for (var _i = 0, _a = element.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            var invertedOutputs = invertMap(directive.directive.outputs);
            var fieldName = invertedOutputs[binding.name];
            if (fieldName) {
                var classSymbol = info.template.query.getTypeSymbol(directive.directive.type.reference);
                if (classSymbol) {
                    return classSymbol.members().get(fieldName);
                }
            }
        }
    }
}
function invertMap(obj) {
    var result = {};
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        var v = obj[name_1];
        result[v] = name_1;
    }
    return result;
}
/**
 * Wrap a symbol and change its kind to component.
 */
var OverrideKindSymbol = (function () {
    function OverrideKindSymbol(sym, kindOverride) {
        this.sym = sym;
        this.kindOverride = kindOverride;
    }
    Object.defineProperty(OverrideKindSymbol.prototype, "name", {
        get: function () { return this.sym.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "kind", {
        get: function () { return this.kindOverride; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "language", {
        get: function () { return this.sym.language; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "type", {
        get: function () { return this.sym.type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "container", {
        get: function () { return this.sym.container; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "public", {
        get: function () { return this.sym.public; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "callable", {
        get: function () { return this.sym.callable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "nullable", {
        get: function () { return this.sym.nullable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "definition", {
        get: function () { return this.sym.definition; },
        enumerable: true,
        configurable: true
    });
    OverrideKindSymbol.prototype.members = function () { return this.sym.members(); };
    OverrideKindSymbol.prototype.signatures = function () { return this.sym.signatures(); };
    OverrideKindSymbol.prototype.selectSignature = function (types) { return this.sym.selectSignature(types); };
    OverrideKindSymbol.prototype.indexed = function (argument) { return this.sym.indexed(argument); };
    return OverrideKindSymbol;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRlX3N5bWJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2Uvc3JjL2xvY2F0ZV9zeW1ib2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK0o7QUFDL0osc0RBQXlEO0FBR3pELDZDQUFrRDtBQUVsRCxpQ0FBc0c7QUFPdEcsc0JBQTZCLElBQWtCO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsRSxJQUFNLElBQUksR0FBRyx5QkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbkUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLFFBQU0sR0FBcUIsU0FBUyxDQUFDO1FBQ3pDLElBQUksTUFBSSxHQUFtQixTQUFTLENBQUM7UUFDckMsSUFBTSxzQkFBb0IsR0FBRyxVQUFDLEdBQVEsRUFBRSxPQUF3QjtZQUF4Qix3QkFBQSxFQUFBLGVBQXdCO1lBQzlELElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxjQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFNLEtBQUssR0FBRyxzQ0FBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkQsSUFBTSxLQUFLLEdBQUcsaUNB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