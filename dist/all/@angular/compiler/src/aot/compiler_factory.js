"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_1 = require("../config");
var directive_normalizer_1 = require("../directive_normalizer");
var directive_resolver_1 = require("../directive_resolver");
var lexer_1 = require("../expression_parser/lexer");
var parser_1 = require("../expression_parser/parser");
var i18n_html_parser_1 = require("../i18n/i18n_html_parser");
var metadata_resolver_1 = require("../metadata_resolver");
var html_parser_1 = require("../ml_parser/html_parser");
var ng_module_compiler_1 = require("../ng_module_compiler");
var ng_module_resolver_1 = require("../ng_module_resolver");
var ts_emitter_1 = require("../output/ts_emitter");
var pipe_resolver_1 = require("../pipe_resolver");
var dom_element_schema_registry_1 = require("../schema/dom_element_schema_registry");
var style_compiler_1 = require("../style_compiler");
var template_parser_1 = require("../template_parser/template_parser");
var url_resolver_1 = require("../url_resolver");
var view_compiler_1 = require("../view_compiler/view_compiler");
var compiler_1 = require("./compiler");
var static_reflector_1 = require("./static_reflector");
var static_symbol_1 = require("./static_symbol");
var static_symbol_resolver_1 = require("./static_symbol_resolver");
var summary_resolver_1 = require("./summary_resolver");
/**
 * Creates a new AotCompiler based on options and a host.
 */
function createAotCompiler(compilerHost, options) {
    var translations = options.translations || '';
    var urlResolver = url_resolver_1.createOfflineCompileUrlResolver();
    var symbolCache = new static_symbol_1.StaticSymbolCache();
    var summaryResolver = new summary_resolver_1.AotSummaryResolver(compilerHost, symbolCache);
    var symbolResolver = new static_symbol_resolver_1.StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    var staticReflector = new static_reflector_1.StaticReflector(summaryResolver, symbolResolver);
    var console = new core_1.ɵConsole();
    var htmlParser = new i18n_html_parser_1.I18NHtmlParser(new html_parser_1.HtmlParser(), translations, options.i18nFormat, options.missingTranslation, console);
    var config = new config_1.CompilerConfig({
        defaultEncapsulation: core_1.ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate !== false,
        missingTranslation: options.missingTranslation,
    });
    var normalizer = new directive_normalizer_1.DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
    var expressionParser = new parser_1.Parser(new lexer_1.Lexer());
    var elementSchemaRegistry = new dom_element_schema_registry_1.DomElementSchemaRegistry();
    var tmplParser = new template_parser_1.TemplateParser(config, staticReflector, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    var resolver = new metadata_resolver_1.CompileMetadataResolver(config, new ng_module_resolver_1.NgModuleResolver(staticReflector), new directive_resolver_1.DirectiveResolver(staticReflector), new pipe_resolver_1.PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    var viewCompiler = new view_compiler_1.ViewCompiler(config, staticReflector, elementSchemaRegistry);
    var compiler = new compiler_1.AotCompiler(config, compilerHost, staticReflector, resolver, tmplParser, new style_compiler_1.StyleCompiler(urlResolver), viewCompiler, new ng_module_compiler_1.NgModuleCompiler(staticReflector), new ts_emitter_1.TypeScriptEmitter(), summaryResolver, options.locale || null, options.i18nFormat || null, options.enableSummariesForJit || null, symbolResolver);
    return { compiler: compiler, reflector: staticReflector };
}
exports.createAotCompiler = createAotCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3QvY29tcGlsZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFpRztBQUNqRyxvQ0FBeUM7QUFDekMsZ0VBQTREO0FBQzVELDREQUF3RDtBQUN4RCxvREFBaUQ7QUFDakQsc0RBQW1EO0FBQ25ELDZEQUF3RDtBQUN4RCwwREFBNkQ7QUFDN0Qsd0RBQW9EO0FBQ3BELDREQUF1RDtBQUN2RCw0REFBdUQ7QUFDdkQsbURBQXVEO0FBQ3ZELGtEQUE4QztBQUM5QyxxRkFBK0U7QUFDL0Usb0RBQWdEO0FBQ2hELHNFQUFrRTtBQUNsRSxnREFBZ0U7QUFDaEUsZ0VBQTREO0FBRTVELHVDQUF1QztBQUd2Qyx1REFBbUQ7QUFDbkQsaURBQWdFO0FBQ2hFLG1FQUE4RDtBQUM5RCx1REFBc0Q7QUFHdEQ7O0dBRUc7QUFDSCwyQkFBa0MsWUFBNkIsRUFBRSxPQUEyQjtJQUUxRixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztJQUV0RCxJQUFNLFdBQVcsR0FBRyw4Q0FBK0IsRUFBRSxDQUFDO0lBQ3RELElBQU0sV0FBVyxHQUFHLElBQUksaUNBQWlCLEVBQUUsQ0FBQztJQUM1QyxJQUFNLGVBQWUsR0FBRyxJQUFJLHFDQUFrQixDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxRSxJQUFNLGNBQWMsR0FBRyxJQUFJLDZDQUFvQixDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDNUYsSUFBTSxlQUFlLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM3RSxJQUFNLE9BQU8sR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO0lBQzlCLElBQU0sVUFBVSxHQUFHLElBQUksaUNBQWMsQ0FDakMsSUFBSSx3QkFBVSxFQUFFLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdGLElBQU0sTUFBTSxHQUFHLElBQUksdUJBQWMsQ0FBQztRQUNoQyxvQkFBb0IsRUFBRSx3QkFBaUIsQ0FBQyxRQUFRO1FBQ2hELE1BQU0sRUFBRSxLQUFLO1FBQ2Isb0JBQW9CLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixLQUFLLEtBQUs7UUFDNUQsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtLQUMvQyxDQUFDLENBQUM7SUFDSCxJQUFNLFVBQVUsR0FBRyxJQUFJLDBDQUFtQixDQUN0QyxFQUFDLEdBQUcsRUFBRSxVQUFDLEdBQVcsSUFBSyxPQUFBLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQTlCLENBQThCLEVBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdGLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxhQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELElBQU0scUJBQXFCLEdBQUcsSUFBSSxzREFBd0IsRUFBRSxDQUFDO0lBQzdELElBQU0sVUFBVSxHQUFHLElBQUksZ0NBQWMsQ0FDakMsTUFBTSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9GLElBQU0sUUFBUSxHQUFHLElBQUksMkNBQXVCLENBQ3hDLE1BQU0sRUFBRSxJQUFJLHFDQUFnQixDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksc0NBQWlCLENBQUMsZUFBZSxDQUFDLEVBQ3JGLElBQUksNEJBQVksQ0FBQyxlQUFlLENBQUMsRUFBRSxlQUFlLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxFQUNyRixPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzNDLGtEQUFrRDtJQUNsRCxJQUFNLFlBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3RGLElBQU0sUUFBUSxHQUFHLElBQUksc0JBQVcsQ0FDNUIsTUFBTSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxJQUFJLDhCQUFhLENBQUMsV0FBVyxDQUFDLEVBQzNGLFlBQVksRUFBRSxJQUFJLHFDQUFnQixDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksOEJBQWlCLEVBQUUsRUFBRSxlQUFlLEVBQzdGLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLEVBQ3pGLGNBQWMsQ0FBQyxDQUFDO0lBQ3BCLE1BQU0sQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQztBQUNoRCxDQUFDO0FBcENELDhDQW9DQyJ9