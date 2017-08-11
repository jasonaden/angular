/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation, ɵConsole as Console } from '@angular/core';
import { CompilerConfig } from '../config';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { Lexer } from '../expression_parser/lexer';
import { Parser } from '../expression_parser/parser';
import { I18NHtmlParser } from '../i18n/i18n_html_parser';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { NgModuleCompiler } from '../ng_module_compiler';
import { NgModuleResolver } from '../ng_module_resolver';
import { TypeScriptEmitter } from '../output/ts_emitter';
import { PipeResolver } from '../pipe_resolver';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { StyleCompiler } from '../style_compiler';
import { TemplateParser } from '../template_parser/template_parser';
import { createOfflineCompileUrlResolver } from '../url_resolver';
import { ViewCompiler } from '../view_compiler/view_compiler';
import { AotCompiler } from './compiler';
import { StaticReflector } from './static_reflector';
import { StaticSymbolCache } from './static_symbol';
import { StaticSymbolResolver } from './static_symbol_resolver';
import { AotSummaryResolver } from './summary_resolver';
/**
 * Creates a new AotCompiler based on options and a host.
 * @param {?} compilerHost
 * @param {?} options
 * @return {?}
 */
export function createAotCompiler(compilerHost, options) {
    var /** @type {?} */ translations = options.translations || '';
    var /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
    var /** @type {?} */ symbolCache = new StaticSymbolCache();
    var /** @type {?} */ summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
    var /** @type {?} */ symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    var /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, symbolResolver);
    var /** @type {?} */ console = new Console();
    var /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, options.missingTranslation, console);
    var /** @type {?} */ config = new CompilerConfig({
        defaultEncapsulation: ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate !== false,
        missingTranslation: options.missingTranslation,
    });
    var /** @type {?} */ normalizer = new DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
    var /** @type {?} */ expressionParser = new Parser(new Lexer());
    var /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
    var /** @type {?} */ tmplParser = new TemplateParser(config, staticReflector, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    var /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    var /** @type {?} */ viewCompiler = new ViewCompiler(config, staticReflector, elementSchemaRegistry);
    var /** @type {?} */ compiler = new AotCompiler(config, compilerHost, staticReflector, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, new NgModuleCompiler(staticReflector), new TypeScriptEmitter(), summaryResolver, options.locale || null, options.i18nFormat || null, options.enableSummariesForJit || null, symbolResolver);
    return { compiler: compiler, reflector: staticReflector };
}
//# sourceMappingURL=compiler_factory.js.map