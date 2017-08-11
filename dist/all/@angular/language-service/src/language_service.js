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
var completions_1 = require("./completions");
var definitions_1 = require("./definitions");
var diagnostics_1 = require("./diagnostics");
var hover_1 = require("./hover");
var types_1 = require("./types");
/**
 * Create an instance of an Angular `LanguageService`.
 *
 * @experimental
 */
function createLanguageService(host) {
    return new LanguageServiceImpl(host);
}
exports.createLanguageService = createLanguageService;
var LanguageServiceImpl = (function () {
    function LanguageServiceImpl(host) {
        this.host = host;
    }
    Object.defineProperty(LanguageServiceImpl.prototype, "metadataResolver", {
        get: function () { return this.host.resolver; },
        enumerable: true,
        configurable: true
    });
    LanguageServiceImpl.prototype.getTemplateReferences = function () { return this.host.getTemplateReferences(); };
    LanguageServiceImpl.prototype.getDiagnostics = function (fileName) {
        var results = [];
        var templates = this.host.getTemplates(fileName);
        if (templates && templates.length) {
            results.push.apply(results, diagnostics_1.getTemplateDiagnostics(fileName, this, templates));
        }
        var declarations = this.host.getDeclarations(fileName);
        if (declarations && declarations.length) {
            var summary = this.host.getAnalyzedModules();
            results.push.apply(results, diagnostics_1.getDeclarationDiagnostics(declarations, summary));
        }
        return uniqueBySpan(results);
    };
    LanguageServiceImpl.prototype.getPipesAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return templateInfo.pipes;
        }
        return [];
    };
    LanguageServiceImpl.prototype.getCompletionsAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return completions_1.getTemplateCompletions(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getDefinitionAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return definitions_1.getDefinition(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getHoverAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return hover_1.getHover(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getTemplateAstAtPosition = function (fileName, position) {
        var template = this.host.getTemplateAt(fileName, position);
        if (template) {
            var astResult = this.getTemplateAst(template, fileName);
            if (astResult && astResult.htmlAst && astResult.templateAst && astResult.directive &&
                astResult.directives && astResult.pipes && astResult.expressionParser)
                return {
                    position: position,
                    fileName: fileName,
                    template: template,
                    htmlAst: astResult.htmlAst,
                    directive: astResult.directive,
                    directives: astResult.directives,
                    pipes: astResult.pipes,
                    templateAst: astResult.templateAst,
                    expressionParser: astResult.expressionParser
                };
        }
        return undefined;
    };
    LanguageServiceImpl.prototype.getTemplateAst = function (template, contextFile) {
        var _this = this;
        var result = undefined;
        try {
            var resolvedMetadata = this.metadataResolver.getNonNormalizedDirectiveMetadata(template.type);
            var metadata = resolvedMetadata && resolvedMetadata.metadata;
            if (metadata) {
                var rawHtmlParser = new compiler_1.HtmlParser();
                var htmlParser = new compiler_1.I18NHtmlParser(rawHtmlParser);
                var expressionParser = new compiler_1.Parser(new compiler_1.Lexer());
                var config = new compiler_1.CompilerConfig();
                var parser = new compiler_1.TemplateParser(config, this.host.resolver.getReflector(), expressionParser, new compiler_1.DomElementSchemaRegistry(), htmlParser, null, []);
                var htmlResult = htmlParser.parse(template.source, '', true);
                var analyzedModules = this.host.getAnalyzedModules();
                var errors = undefined;
                var ngModule = analyzedModules.ngModuleByPipeOrDirective.get(template.type);
                if (!ngModule) {
                    // Reported by the the declaration diagnostics.
                    ngModule = findSuitableDefaultModule(analyzedModules);
                }
                if (ngModule) {
                    var resolvedDirectives = ngModule.transitiveModule.directives.map(function (d) { return _this.host.resolver.getNonNormalizedDirectiveMetadata(d.reference); });
                    var directives = removeMissing(resolvedDirectives).map(function (d) { return d.metadata.toSummary(); });
                    var pipes = ngModule.transitiveModule.pipes.map(function (p) { return _this.host.resolver.getOrLoadPipeMetadata(p.reference).toSummary(); });
                    var schemas = ngModule.schemas;
                    var parseResult = parser.tryParseHtml(htmlResult, metadata, directives, pipes, schemas);
                    result = {
                        htmlAst: htmlResult.rootNodes,
                        templateAst: parseResult.templateAst,
                        directive: metadata, directives: directives, pipes: pipes,
                        parseErrors: parseResult.errors, expressionParser: expressionParser, errors: errors
                    };
                }
            }
        }
        catch (e) {
            var span = template.span;
            if (e.fileName == contextFile) {
                span = template.query.getSpanAt(e.line, e.column) || span;
            }
            result = { errors: [{ kind: types_1.DiagnosticKind.Error, message: e.message, span: span }] };
        }
        return result || {};
    };
    return LanguageServiceImpl;
}());
function removeMissing(values) {
    return values.filter(function (e) { return !!e; });
}
function uniqueBySpan(elements) {
    if (elements) {
        var result = [];
        var map = new Map();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var span = element.span;
            var set = map.get(span.start);
            if (!set) {
                set = new Set();
                map.set(span.start, set);
            }
            if (!set.has(span.end)) {
                set.add(span.end);
                result.push(element);
            }
        }
        return result;
    }
}
function findSuitableDefaultModule(modules) {
    var result = undefined;
    var resultSize = 0;
    for (var _i = 0, _a = modules.ngModules; _i < _a.length; _i++) {
        var module_1 = _a[_i];
        var moduleSize = module_1.transitiveModule.directives.length;
        if (moduleSize > resultSize) {
            result = module_1;
            resultSize = moduleSize;
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Vfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2Uvc3JjL2xhbmd1YWdlX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK047QUFHL04sNkNBQXFEO0FBQ3JELDZDQUE0QztBQUM1Qyw2Q0FBZ0Y7QUFDaEYsaUNBQWlDO0FBQ2pDLGlDQUFtSztBQUduSzs7OztHQUlHO0FBQ0gsK0JBQXNDLElBQXlCO0lBQzdELE1BQU0sQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxzREFFQztBQUVEO0lBQ0UsNkJBQW9CLElBQXlCO1FBQXpCLFNBQUksR0FBSixJQUFJLENBQXFCO0lBQUcsQ0FBQztJQUVqRCxzQkFBWSxpREFBZ0I7YUFBNUIsY0FBMEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdEYsbURBQXFCLEdBQXJCLGNBQW9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRS9FLDRDQUFjLEdBQWQsVUFBZSxRQUFnQjtRQUM3QixJQUFJLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsSUFBSSxPQUFaLE9BQU8sRUFBUyxvQ0FBc0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQ3JFLENBQUM7UUFFRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxJQUFJLE9BQVosT0FBTyxFQUFTLHVDQUF5QixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsRUFBRTtRQUNwRSxDQUFDO1FBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLFFBQWdCLEVBQUUsUUFBZ0I7UUFDM0MsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQzVCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELDhDQUFnQixHQUFoQixVQUFpQixRQUFnQixFQUFFLFFBQWdCO1FBQ2pELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsb0NBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNILENBQUM7SUFFRCw2Q0FBZSxHQUFmLFVBQWdCLFFBQWdCLEVBQUUsUUFBZ0I7UUFDaEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQywyQkFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLFFBQWdCLEVBQUUsUUFBZ0I7UUFDM0MsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0lBRU8sc0RBQXdCLEdBQWhDLFVBQWlDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDakUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsV0FBVyxJQUFJLFNBQVMsQ0FBQyxTQUFTO2dCQUM5RSxTQUFTLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDO2dCQUN4RSxNQUFNLENBQUM7b0JBQ0wsUUFBUSxVQUFBO29CQUNSLFFBQVEsVUFBQTtvQkFDUixRQUFRLFVBQUE7b0JBQ1IsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPO29CQUMxQixTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVM7b0JBQzlCLFVBQVUsRUFBRSxTQUFTLENBQUMsVUFBVTtvQkFDaEMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO29CQUN0QixXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7b0JBQ2xDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxnQkFBZ0I7aUJBQzdDLENBQUM7UUFDTixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsNENBQWMsR0FBZCxVQUFlLFFBQXdCLEVBQUUsV0FBbUI7UUFBNUQsaUJBOENDO1FBN0NDLElBQUksTUFBTSxHQUF3QixTQUFTLENBQUM7UUFDNUMsSUFBSSxDQUFDO1lBQ0gsSUFBTSxnQkFBZ0IsR0FDbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlDQUFpQyxDQUFDLFFBQVEsQ0FBQyxJQUFXLENBQUMsQ0FBQztZQUNsRixJQUFNLFFBQVEsR0FBRyxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7WUFDL0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFNLGFBQWEsR0FBRyxJQUFJLHFCQUFVLEVBQUUsQ0FBQztnQkFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBSSx5QkFBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLGdCQUFnQixHQUFHLElBQUksaUJBQU0sQ0FBQyxJQUFJLGdCQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxJQUFNLE1BQU0sR0FBRyxJQUFJLHlCQUFjLEVBQUUsQ0FBQztnQkFDcEMsSUFBTSxNQUFNLEdBQUcsSUFBSSx5QkFBYyxDQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUUsZ0JBQWdCLEVBQzNELElBQUksbUNBQXdCLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RCxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3ZELElBQUksTUFBTSxHQUEyQixTQUFTLENBQUM7Z0JBQy9DLElBQUksUUFBUSxHQUFHLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsK0NBQStDO29CQUMvQyxRQUFRLEdBQUcseUJBQXlCLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3hELENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDYixJQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUMvRCxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBakUsQ0FBaUUsQ0FBQyxDQUFDO29CQUM1RSxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUF0QixDQUFzQixDQUFDLENBQUM7b0JBQ3RGLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUM3QyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBakUsQ0FBaUUsQ0FBQyxDQUFDO29CQUM1RSxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO29CQUNqQyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxHQUFHO3dCQUNQLE9BQU8sRUFBRSxVQUFVLENBQUMsU0FBUzt3QkFDN0IsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXO3dCQUNwQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsWUFBQSxFQUFFLEtBQUssT0FBQTt3QkFDdEMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLGtCQUFBLEVBQUUsTUFBTSxRQUFBO3FCQUMxRCxDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztZQUM1RCxDQUFDO1lBQ0QsTUFBTSxHQUFHLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsc0JBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxFQUFDLENBQUM7UUFDOUUsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF4SEQsSUF3SEM7QUFFRCx1QkFBMEIsTUFBZ0M7SUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBUSxDQUFDO0FBQ3hDLENBQUM7QUFFRCxzQkFHRyxRQUF5QjtJQUMxQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBQzNDLEdBQUcsQ0FBQyxDQUFrQixVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVE7WUFBekIsSUFBTSxPQUFPLGlCQUFBO1lBQ2hCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNULEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsbUNBQW1DLE9BQTBCO0lBQzNELElBQUksTUFBTSxHQUFzQyxTQUFTLENBQUM7SUFDMUQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLEdBQUcsQ0FBQyxDQUFpQixVQUFpQixFQUFqQixLQUFBLE9BQU8sQ0FBQyxTQUFTLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO1FBQWpDLElBQU0sUUFBTSxTQUFBO1FBQ2YsSUFBTSxVQUFVLEdBQUcsUUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxHQUFHLFFBQU0sQ0FBQztZQUNoQixVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzFCLENBQUM7S0FDRjtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQyJ9