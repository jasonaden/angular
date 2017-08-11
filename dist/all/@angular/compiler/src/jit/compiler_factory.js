"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var static_symbol_1 = require("../aot/static_symbol");
var compile_reflector_1 = require("../compile_reflector");
var config_1 = require("../config");
var directive_normalizer_1 = require("../directive_normalizer");
var directive_resolver_1 = require("../directive_resolver");
var lexer_1 = require("../expression_parser/lexer");
var parser_1 = require("../expression_parser/parser");
var i18n = require("../i18n/index");
var injectable_1 = require("../injectable");
var metadata_resolver_1 = require("../metadata_resolver");
var html_parser_1 = require("../ml_parser/html_parser");
var ng_module_compiler_1 = require("../ng_module_compiler");
var ng_module_resolver_1 = require("../ng_module_resolver");
var pipe_resolver_1 = require("../pipe_resolver");
var resource_loader_1 = require("../resource_loader");
var dom_element_schema_registry_1 = require("../schema/dom_element_schema_registry");
var element_schema_registry_1 = require("../schema/element_schema_registry");
var style_compiler_1 = require("../style_compiler");
var summary_resolver_1 = require("../summary_resolver");
var template_parser_1 = require("../template_parser/template_parser");
var url_resolver_1 = require("../url_resolver");
var view_compiler_1 = require("../view_compiler/view_compiler");
var compiler_1 = require("./compiler");
var jit_reflector_1 = require("./jit_reflector");
var _NO_RESOURCE_LOADER = {
    get: function (url) {
        throw new Error("No ResourceLoader implementation has been provided. Can't read the url \"" + url + "\"");
    }
};
var baseHtmlParser = new core_1.InjectionToken('HtmlParser');
/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
exports.COMPILER_PROVIDERS = [
    { provide: compile_reflector_1.CompileReflector, useValue: new jit_reflector_1.JitReflector() },
    { provide: resource_loader_1.ResourceLoader, useValue: _NO_RESOURCE_LOADER },
    { provide: summary_resolver_1.JitSummaryResolver, deps: [] },
    { provide: summary_resolver_1.SummaryResolver, useExisting: summary_resolver_1.JitSummaryResolver },
    { provide: core_1.ɵConsole, deps: [] },
    { provide: lexer_1.Lexer, deps: [] },
    { provide: parser_1.Parser, deps: [lexer_1.Lexer] },
    {
        provide: baseHtmlParser,
        useClass: html_parser_1.HtmlParser,
        deps: [],
    },
    {
        provide: i18n.I18NHtmlParser,
        useFactory: function (parser, translations, format, config, console) {
            translations = translations || '';
            var missingTranslation = translations ? config.missingTranslation : core_1.MissingTranslationStrategy.Ignore;
            return new i18n.I18NHtmlParser(parser, translations, format, missingTranslation, console);
        },
        deps: [
            baseHtmlParser,
            [new core_1.Optional(), new core_1.Inject(core_1.TRANSLATIONS)],
            [new core_1.Optional(), new core_1.Inject(core_1.TRANSLATIONS_FORMAT)],
            [config_1.CompilerConfig],
            [core_1.ɵConsole],
        ]
    },
    {
        provide: html_parser_1.HtmlParser,
        useExisting: i18n.I18NHtmlParser,
    },
    {
        provide: template_parser_1.TemplateParser, deps: [config_1.CompilerConfig, compile_reflector_1.CompileReflector,
            parser_1.Parser, element_schema_registry_1.ElementSchemaRegistry,
            i18n.I18NHtmlParser, core_1.ɵConsole, [core_1.Optional, template_parser_1.TEMPLATE_TRANSFORMS]]
    },
    { provide: directive_normalizer_1.DirectiveNormalizer, deps: [resource_loader_1.ResourceLoader, url_resolver_1.UrlResolver, html_parser_1.HtmlParser, config_1.CompilerConfig] },
    { provide: metadata_resolver_1.CompileMetadataResolver, deps: [config_1.CompilerConfig, ng_module_resolver_1.NgModuleResolver,
            directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver,
            summary_resolver_1.SummaryResolver,
            element_schema_registry_1.ElementSchemaRegistry,
            directive_normalizer_1.DirectiveNormalizer, core_1.ɵConsole,
            [core_1.Optional, static_symbol_1.StaticSymbolCache],
            compile_reflector_1.CompileReflector,
            [core_1.Optional, metadata_resolver_1.ERROR_COLLECTOR_TOKEN]] },
    url_resolver_1.DEFAULT_PACKAGE_URL_PROVIDER,
    { provide: style_compiler_1.StyleCompiler, deps: [url_resolver_1.UrlResolver] },
    { provide: view_compiler_1.ViewCompiler, deps: [config_1.CompilerConfig, compile_reflector_1.CompileReflector, element_schema_registry_1.ElementSchemaRegistry] },
    { provide: ng_module_compiler_1.NgModuleCompiler, deps: [compile_reflector_1.CompileReflector] },
    { provide: config_1.CompilerConfig, useValue: new config_1.CompilerConfig() },
    { provide: compiler_1.JitCompiler, deps: [core_1.Injector, metadata_resolver_1.CompileMetadataResolver,
            template_parser_1.TemplateParser, style_compiler_1.StyleCompiler,
            view_compiler_1.ViewCompiler, ng_module_compiler_1.NgModuleCompiler,
            summary_resolver_1.SummaryResolver, config_1.CompilerConfig,
            core_1.ɵConsole] },
    { provide: core_1.Compiler, useExisting: compiler_1.JitCompiler },
    { provide: dom_element_schema_registry_1.DomElementSchemaRegistry, deps: [] },
    { provide: element_schema_registry_1.ElementSchemaRegistry, useExisting: dom_element_schema_registry_1.DomElementSchemaRegistry },
    { provide: url_resolver_1.UrlResolver, deps: [core_1.PACKAGE_ROOT_URL] },
    { provide: directive_resolver_1.DirectiveResolver, deps: [compile_reflector_1.CompileReflector] },
    { provide: pipe_resolver_1.PipeResolver, deps: [compile_reflector_1.CompileReflector] },
    { provide: ng_module_resolver_1.NgModuleResolver, deps: [compile_reflector_1.CompileReflector] },
];
var JitCompilerFactory = (function () {
    function JitCompilerFactory(defaultOptions) {
        var compilerOptions = {
            useDebug: core_1.isDevMode(),
            useJit: true,
            defaultEncapsulation: core_1.ViewEncapsulation.Emulated,
            missingTranslation: core_1.MissingTranslationStrategy.Warning,
            enableLegacyTemplate: true,
        };
        this._defaultOptions = [compilerOptions].concat(defaultOptions);
    }
    JitCompilerFactory.prototype.createCompiler = function (options) {
        if (options === void 0) { options = []; }
        var opts = _mergeOptions(this._defaultOptions.concat(options));
        var injector = core_1.Injector.create([
            exports.COMPILER_PROVIDERS, {
                provide: config_1.CompilerConfig,
                useFactory: function () {
                    return new config_1.CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        enableLegacyTemplate: opts.enableLegacyTemplate,
                    });
                },
                deps: []
            },
            opts.providers
        ]);
        return injector.get(core_1.Compiler);
    };
    return JitCompilerFactory;
}());
JitCompilerFactory = __decorate([
    injectable_1.CompilerInjectable(),
    __param(0, core_1.Inject(core_1.COMPILER_OPTIONS)),
    __metadata("design:paramtypes", [Array])
], JitCompilerFactory);
exports.JitCompilerFactory = JitCompilerFactory;
/**
 * A platform that included corePlatform and the compiler.
 *
 * @experimental
 */
exports.platformCoreDynamic = core_1.createPlatformFactory(core_1.platformCore, 'coreDynamic', [
    { provide: core_1.COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: core_1.CompilerFactory, useClass: JitCompilerFactory, deps: [core_1.COMPILER_OPTIONS] },
]);
function _mergeOptions(optionsArr) {
    return {
        useJit: _lastDefined(optionsArr.map(function (options) { return options.useJit; })),
        defaultEncapsulation: _lastDefined(optionsArr.map(function (options) { return options.defaultEncapsulation; })),
        providers: _mergeArrays(optionsArr.map(function (options) { return options.providers; })),
        missingTranslation: _lastDefined(optionsArr.map(function (options) { return options.missingTranslation; })),
        enableLegacyTemplate: _lastDefined(optionsArr.map(function (options) { return options.enableLegacyTemplate; })),
    };
}
function _lastDefined(args) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
function _mergeArrays(parts) {
    var result = [];
    parts.forEach(function (part) { return part && result.push.apply(result, part); });
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9qaXQvY29tcGlsZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFtVjtBQUVuVixzREFBdUQ7QUFDdkQsMERBQXNEO0FBQ3RELG9DQUF5QztBQUN6QyxnRUFBNEQ7QUFDNUQsNERBQXdEO0FBQ3hELG9EQUFpRDtBQUNqRCxzREFBbUQ7QUFDbkQsb0NBQXNDO0FBQ3RDLDRDQUFpRDtBQUNqRCwwREFBb0Y7QUFDcEYsd0RBQW9EO0FBQ3BELDREQUF1RDtBQUN2RCw0REFBdUQ7QUFDdkQsa0RBQThDO0FBQzlDLHNEQUFrRDtBQUNsRCxxRkFBK0U7QUFDL0UsNkVBQXdFO0FBQ3hFLG9EQUFnRDtBQUNoRCx3REFBd0U7QUFDeEUsc0VBQXVGO0FBQ3ZGLGdEQUEwRTtBQUMxRSxnRUFBNEQ7QUFFNUQsdUNBQXVDO0FBQ3ZDLGlEQUE2QztBQUU3QyxJQUFNLG1CQUFtQixHQUFtQjtJQUMxQyxHQUFHLEVBQUgsVUFBSSxHQUFXO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FDWCw4RUFBMkUsR0FBRyxPQUFHLENBQUMsQ0FBQztJQUFBLENBQUM7Q0FDN0YsQ0FBQztBQUVGLElBQU0sY0FBYyxHQUFHLElBQUkscUJBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUV4RDs7O0dBR0c7QUFDVSxRQUFBLGtCQUFrQixHQUFxQjtJQUNsRCxFQUFDLE9BQU8sRUFBRSxvQ0FBZ0IsRUFBRSxRQUFRLEVBQUUsSUFBSSw0QkFBWSxFQUFFLEVBQUM7SUFDekQsRUFBQyxPQUFPLEVBQUUsZ0NBQWMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7SUFDeEQsRUFBQyxPQUFPLEVBQUUscUNBQWtCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUN2QyxF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