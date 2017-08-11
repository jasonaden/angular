"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_cli_1 = require("@angular/compiler-cli");
var types_1 = require("./types");
var utils_1 = require("./utils");
function getTemplateDiagnostics(fileName, astProvider, templates) {
    var results = [];
    var _loop_1 = function (template) {
        var ast = astProvider.getTemplateAst(template, fileName);
        if (ast) {
            if (ast.parseErrors && ast.parseErrors.length) {
                results.push.apply(results, ast.parseErrors.map(function (e) { return ({
                    kind: types_1.DiagnosticKind.Error,
                    span: utils_1.offsetSpan(utils_1.spanOf(e.span), template.span.start),
                    message: e.msg
                }); }));
            }
            else if (ast.templateAst && ast.htmlAst) {
                var info = {
                    templateAst: ast.templateAst,
                    htmlAst: ast.htmlAst,
                    offset: template.span.start,
                    query: template.query,
                    members: template.members
                };
                var expressionDiagnostics = compiler_cli_1.getTemplateExpressionDiagnostics(info);
                results.push.apply(results, expressionDiagnostics);
            }
            if (ast.errors) {
                results.push.apply(results, ast.errors.map(function (e) { return ({ kind: e.kind, span: e.span || template.span, message: e.message }); }));
            }
        }
    };
    for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
        var template = templates_1[_i];
        _loop_1(template);
    }
    return results;
}
exports.getTemplateDiagnostics = getTemplateDiagnostics;
function getDeclarationDiagnostics(declarations, modules) {
    var results = [];
    var directives = undefined;
    var _loop_2 = function (declaration) {
        var report = function (message, span) {
            results.push({
                kind: types_1.DiagnosticKind.Error,
                span: span || declaration.declarationSpan, message: message
            });
        };
        for (var _i = 0, _a = declaration.errors; _i < _a.length; _i++) {
            var error = _a[_i];
            report(error.message, error.span);
        }
        if (declaration.metadata) {
            if (declaration.metadata.isComponent) {
                if (!modules.ngModuleByPipeOrDirective.has(declaration.type)) {
                    report("Component '" + declaration.type.name + "' is not included in a module and will not be available inside a template. Consider adding it to a NgModule declaration");
                }
                if (!declaration.metadata.template.template &&
                    !declaration.metadata.template.templateUrl) {
                    report("Component " + declaration.type.name + " must have a template or templateUrl");
                }
            }
            else {
                if (!directives) {
                    directives = new Set();
                    modules.ngModules.forEach(function (module) {
                        module.declaredDirectives.forEach(function (directive) { directives.add(directive.reference); });
                    });
                }
                if (!directives.has(declaration.type)) {
                    report("Directive '" + declaration.type.name + "' is not included in a module and will not be available inside a template. Consider adding it to a NgModule declaration");
                }
            }
        }
    };
    for (var _i = 0, declarations_1 = declarations; _i < declarations_1.length; _i++) {
        var declaration = declarations_1[_i];
        _loop_2(declaration);
    }
    return results;
}
exports.getDeclarationDiagnostics = getDeclarationDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHNEQUErRjtBQUcvRixpQ0FBb0c7QUFDcEcsaUNBQTJDO0FBTTNDLGdDQUNJLFFBQWdCLEVBQUUsV0FBd0IsRUFBRSxTQUEyQjtJQUN6RSxJQUFNLE9BQU8sR0FBZ0IsRUFBRSxDQUFDOzRCQUNyQixRQUFRO1FBQ2pCLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLElBQUksT0FBWixPQUFPLEVBQVMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQy9CLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQztvQkFDSixJQUFJLEVBQUUsc0JBQWMsQ0FBQyxLQUFLO29CQUMxQixJQUFJLEVBQUUsa0JBQVUsQ0FBQyxjQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUNyRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUc7aUJBQ2YsQ0FBQyxFQUpHLENBSUgsQ0FBQyxFQUFFO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFNLElBQUksR0FBMkI7b0JBQ25DLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FB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