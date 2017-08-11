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
    let /** @type {?} */ translations = options.translations || '';
    const /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
    const /** @type {?} */ symbolCache = new StaticSymbolCache();
    const /** @type {?} */ summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
    const /** @type {?} */ symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    const /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, symbolResolver);
    const /** @type {?} */ console = new Console();
    const /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, options.missingTranslation, console);
    const /** @type {?} */ config = new CompilerConfig({
        defaultEncapsulation: ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate !== false,
        missingTranslation: options.missingTranslation,
    });
    const /** @type {?} */ normalizer = new DirectiveNormalizer({ get: (url) => compilerHost.loadResource(url) }, urlResolver, htmlParser, config);
    const /** @type {?} */ expressionParser = new Parser(new Lexer());
    const /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
    const /** @type {?} */ tmplParser = new TemplateParser(config, staticReflector, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    const /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    const /** @type {?} */ viewCompiler = new ViewCompiler(config, staticReflector, elementSchemaRegistry);
    const /** @type {?} */ compiler = new AotCompiler(config, compilerHost, staticReflector, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, new NgModuleCompiler(staticReflector), new TypeScriptEmitter(), summaryResolver, options.locale || null, options.i18nFormat || null, options.enableSummariesForJit || null, symbolResolver);
    return { compiler, reflector: staticReflector };
}
//# sourceMappingURL=compiler_factory.js.map