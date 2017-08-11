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
var core_1 = require("@angular/core");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var typescript_symbols_1 = require("../../src/diagnostics/typescript_symbols");
var mocks_1 = require("../mocks");
function calcRootPath() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
var realFiles = new Map();
var MockLanguageServiceHost = (function () {
    function MockLanguageServiceHost(scripts, files, currentDirectory) {
        if (currentDirectory === void 0) { currentDirectory = '/'; }
        this.scripts = scripts;
        this.assumedExist = new Set();
        this.options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            strictNullChecks: true,
            baseUrl: currentDirectory,
            lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
            paths: { '@angular/*': [calcRootPath() + '/packages/*'] }
        };
        this.context = new mocks_1.MockAotContext(currentDirectory, files);
    }
    MockLanguageServiceHost.prototype.getCompilationSettings = function () { return this.options; };
    MockLanguageServiceHost.prototype.getScriptFileNames = function () { return this.scripts; };
    MockLanguageServiceHost.prototype.getScriptVersion = function (fileName) { return '0'; };
    MockLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
        var content = this.internalReadFile(fileName);
        if (content) {
            return ts.ScriptSnapshot.fromString(content);
        }
    };
    MockLanguageServiceHost.prototype.getCurrentDirectory = function () { return this.context.currentDirectory; };
    MockLanguageServiceHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockLanguageServiceHost.prototype.readFile = function (fileName) { return this.internalReadFile(fileName); };
    MockLanguageServiceHost.prototype.readResource = function (fileName) { return Promise.resolve(''); };
    MockLanguageServiceHost.prototype.assumeFileExists = function (fileName) { this.assumedExist.add(fileName); };
    MockLanguageServiceHost.prototype.fileExists = function (fileName) {
        return this.assumedExist.has(fileName) || this.internalReadFile(fileName) != null;
    };
    MockLanguageServiceHost.prototype.internalReadFile = function (fileName) {
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = path.dirname(ts.getDefaultLibFilePath(this.getCompilationSettings()));
            fileName = path.join(libPath, basename);
        }
        if (fileName.startsWith('app/')) {
            fileName = path.join(this.context.currentDirectory, fileName);
        }
        if (this.context.fileExists(fileName)) {
            return this.context.readFile(fileName);
        }
        if (realFiles.has(fileName)) {
            return realFiles.get(fileName);
        }
        if (fs.existsSync(fileName)) {
            var content = fs.readFileSync(fileName, 'utf8');
            realFiles.set(fileName, content);
            return content;
        }
        return undefined;
    };
    return MockLanguageServiceHost;
}());
exports.MockLanguageServiceHost = MockLanguageServiceHost;
var staticSymbolCache = new compiler_1.StaticSymbolCache();
var summaryResolver = new compiler_1.AotSummaryResolver({
    loadSummary: function (filePath) { return null; },
    isSourceFile: function (sourceFilePath) { return true; },
    getOutputFileName: function (sourceFilePath) { return sourceFilePath; }
}, staticSymbolCache);
var DiagnosticContext = (function () {
    // tslint:enable
    function DiagnosticContext(service, program, checker, host) {
        this.service = service;
        this.program = program;
        this.checker = checker;
        this.host = host;
        this._errors = [];
    }
    DiagnosticContext.prototype.collectError = function (e, path) { this._errors.push({ e: e, path: path }); };
    Object.defineProperty(DiagnosticContext.prototype, "staticSymbolResolver", {
        get: function () {
            var _this = this;
            var result = this._staticSymbolResolver;
            if (!result) {
                result = this._staticSymbolResolver = new compiler_1.StaticSymbolResolver(this.host, staticSymbolCache, summaryResolver, function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "reflector", {
        get: function () {
            var _this = this;
            if (!this._reflector) {
                var ssr = this.staticSymbolResolver;
                var result = this._reflector = new compiler_1.StaticReflector(summaryResolver, ssr, [], [], function (e, filePath) { return _this.collectError(e, filePath); });
                this._reflector = result;
                return result;
            }
            return this._reflector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "resolver", {
        get: function () {
            var _this = this;
            var result = this._resolver;
            if (!result) {
                var moduleResolver = new compiler_1.NgModuleResolver(this.reflector);
                var directiveResolver = new compiler_1.DirectiveResolver(this.reflector);
                var pipeResolver = new compiler_1.PipeResolver(this.reflector);
                var elementSchemaRegistry = new compiler_1.DomElementSchemaRegistry();
                var resourceLoader = new (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_1.prototype.get = function (url) { return Promise.resolve(''); };
                    return class_1;
                }(compiler_1.ResourceLoader));
                var urlResolver = compiler_1.createOfflineCompileUrlResolver();
                var htmlParser = new (function (_super) {
                    __extends(class_2, _super);
                    function class_2() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_2.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
                        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
                        if (interpolationConfig === void 0) { interpolationConfig = compiler_1.DEFAULT_INTERPOLATION_CONFIG; }
                        return new compiler_1.ParseTreeResult([], []);
                    };
                    return class_2;
                }(compiler_1.HtmlParser));
                // This tracks the CompileConfig in codegen.ts. Currently these options
                // are hard-coded.
                var config = new compiler_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
                var directiveNormalizer = new compiler_1.DirectiveNormalizer(resourceLoader, urlResolver, htmlParser, config);
                result = this._resolver = new compiler_1.CompileMetadataResolver(config, moduleResolver, directiveResolver, pipeResolver, new compiler_1.JitSummaryResolver(), elementSchemaRegistry, directiveNormalizer, new core_1.ɵConsole(), staticSymbolCache, this.reflector, function (error, type) { return _this.collectError(error, type && type.filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "analyzedModules", {
        get: function () {
            var analyzedModules = this._analyzedModules;
            if (!analyzedModules) {
                var analyzeHost = { isSourceFile: function (filePath) { return true; } };
                var programSymbols = compiler_1.extractProgramSymbols(this.staticSymbolResolver, this.program.getSourceFiles().map(function (sf) { return sf.fileName; }), analyzeHost);
                analyzedModules = this._analyzedModules =
                    compiler_1.analyzeNgModules(programSymbols, analyzeHost, this.resolver);
            }
            return analyzedModules;
        },
        enumerable: true,
        configurable: true
    });
    DiagnosticContext.prototype.getStaticSymbol = function (path, name) {
        return staticSymbolCache.get(path, name);
    };
    return DiagnosticContext;
}());
exports.DiagnosticContext = DiagnosticContext;
function compileTemplate(context, type, template) {
    // Compiler the template string.
    var resolvedMetadata = context.resolver.getNonNormalizedDirectiveMetadata(type);
    var metadata = resolvedMetadata && resolvedMetadata.metadata;
    if (metadata) {
        var rawHtmlParser = new compiler_1.HtmlParser();
        var htmlParser = new compiler_1.I18NHtmlParser(rawHtmlParser);
        var expressionParser = new compiler_1.Parser(new compiler_1.Lexer());
        var config = new compiler_1.CompilerConfig();
        var parser = new compiler_1.TemplateParser(config, context.reflector, expressionParser, new compiler_1.DomElementSchemaRegistry(), htmlParser, null, []);
        var htmlResult = htmlParser.parse(template, '', true);
        var analyzedModules = context.analyzedModules;
        // let errors: Diagnostic[]|undefined = undefined;
        var ngModule = analyzedModules.ngModuleByPipeOrDirective.get(type);
        if (ngModule) {
            var resolvedDirectives = ngModule.transitiveModule.directives.map(function (d) { return context.resolver.getNonNormalizedDirectiveMetadata(d.reference); });
            var directives = removeMissing(resolvedDirectives).map(function (d) { return d.metadata.toSummary(); });
            var pipes = ngModule.transitiveModule.pipes.map(function (p) { return context.resolver.getOrLoadPipeMetadata(p.reference).toSummary(); });
            var schemas = ngModule.schemas;
            var parseResult = parser.tryParseHtml(htmlResult, metadata, directives, pipes, schemas);
            return {
                htmlAst: htmlResult.rootNodes,
                templateAst: parseResult.templateAst,
                directive: metadata, directives: directives, pipes: pipes,
                parseErrors: parseResult.errors, expressionParser: expressionParser
            };
        }
    }
}
function getDiagnosticTemplateInfo(context, type, templateFile, template) {
    var compiledTemplate = compileTemplate(context, type, template);
    if (compiledTemplate && compiledTemplate.templateAst) {
        var members = typescript_symbols_1.getClassMembers(context.program, context.checker, type);
        if (members) {
            var sourceFile_1 = context.program.getSourceFile(type.filePath);
            var query = typescript_symbols_1.getSymbolQuery(context.program, context.checker, sourceFile_1, function () {
                return typescript_symbols_1.getPipesTable(sourceFile_1, context.program, context.checker, compiledTemplate.pipes);
            });
            return {
                fileName: templateFile,
                offset: 0, query: query, members: members,
                htmlAst: compiledTemplate.htmlAst,
                templateAst: compiledTemplate.templateAst
            };
        }
    }
}
exports.getDiagnosticTemplateInfo = getDiagnosticTemplateInfo;
function removeMissing(values) {
    return values.filter(function (e) { return !!e; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9kaWFnbm9zdGljcy9tb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBMGlCO0FBQzFpQixzQ0FBcUU7QUFFckUsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFHakMsK0VBQWtJO0FBQ2xJLGtDQUFtRDtBQUVuRDtJQUNFLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRCxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7QUFFNUM7SUFLRSxpQ0FBb0IsT0FBaUIsRUFBRSxLQUFnQixFQUFFLGdCQUE4QjtRQUE5QixpQ0FBQSxFQUFBLHNCQUE4QjtRQUFuRSxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBRjdCLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUd2QyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRztZQUMzQixNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1lBQzlCLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO1lBQ2hELHFCQUFxQixFQUFFLElBQUk7WUFDM0Isc0JBQXNCLEVBQUUsSUFBSTtZQUM1QixjQUFjLEVBQUUsS0FBSztZQUNyQixhQUFhLEVBQUUsS0FBSztZQUNwQixZ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