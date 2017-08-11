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
var compiler_cli_1 = require("@angular/compiler-cli");
var core_1 = require("@angular/core");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var language_service_1 = require("./language_service");
var reflector_host_1 = require("./reflector_host");
/**
 * Create a `LanguageServiceHost`
 */
function createLanguageServiceFromTypescript(host, service) {
    var ngHost = new TypeScriptServiceHost(host, service);
    var ngServer = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngServer);
    return ngServer;
}
exports.createLanguageServiceFromTypescript = createLanguageServiceFromTypescript;
/**
 * The language service never needs the normalized versions of the metadata. To avoid parsing
 * the content and resolving references, return an empty file. This also allows normalizing
 * template that are syntatically incorrect which is required to provide completions in
 * syntactically incorrect templates.
 */
var DummyHtmlParser = (function (_super) {
    __extends(DummyHtmlParser, _super);
    function DummyHtmlParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = compiler_1.DEFAULT_INTERPOLATION_CONFIG; }
        return new compiler_1.ParseTreeResult([], []);
    };
    return DummyHtmlParser;
}(compiler_1.HtmlParser));
exports.DummyHtmlParser = DummyHtmlParser;
/**
 * Avoid loading resources in the language servcie by using a dummy loader.
 */
var DummyResourceLoader = (function (_super) {
    __extends(DummyResourceLoader, _super);
    function DummyResourceLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyResourceLoader.prototype.get = function (url) { return Promise.resolve(''); };
    return DummyResourceLoader;
}(compiler_1.ResourceLoader));
exports.DummyResourceLoader = DummyResourceLoader;
/**
 * An implemntation of a `LanguageServiceHost` for a TypeScript project.
 *
 * The `TypeScriptServiceHost` implements the Angular `LanguageServiceHost` using
 * the TypeScript language services.
 *
 * @experimental
 */
var TypeScriptServiceHost = (function () {
    function TypeScriptServiceHost(host, tsService) {
        this.host = host;
        this.tsService = tsService;
        this._staticSymbolCache = new compiler_1.StaticSymbolCache();
        this._typeCache = [];
        this.modulesOutOfDate = true;
        this.fileVersions = new Map();
    }
    TypeScriptServiceHost.prototype.setSite = function (service) { this.service = service; };
    Object.defineProperty(TypeScriptServiceHost.prototype, "resolver", {
        /**
         * Angular LanguageServiceHost implementation
         */
        get: function () {
            var _this = this;
            this.validate();
            var result = this._resolver;
            if (!result) {
                var moduleResolver = new compiler_1.NgModuleResolver(this.reflector);
                var directiveResolver = new compiler_1.DirectiveResolver(this.reflector);
                var pipeResolver = new compiler_1.PipeResolver(this.reflector);
                var elementSchemaRegistry = new compiler_1.DomElementSchemaRegistry();
                var resourceLoader = new DummyResourceLoader();
                var urlResolver = compiler_1.createOfflineCompileUrlResolver();
                var htmlParser = new DummyHtmlParser();
                // This tracks the CompileConfig in codegen.ts. Currently these options
                // are hard-coded.
                var config = new compiler_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
                var directiveNormalizer = new compiler_1.DirectiveNormalizer(resourceLoader, urlResolver, htmlParser, config);
                result = this._resolver = new compiler_1.CompileMetadataResolver(config, moduleResolver, directiveResolver, pipeResolver, new compiler_1.JitSummaryResolver(), elementSchemaRegistry, directiveNormalizer, new core_1.ɵConsole(), this._staticSymbolCache, this.reflector, function (error, type) { return _this.collectError(error, type && type.filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.getTemplateReferences = function () {
        this.ensureTemplateMap();
        return this.templateReferences || [];
    };
    TypeScriptServiceHost.prototype.getTemplateAt = function (fileName, position) {
        var sourceFile = this.getSourceFile(fileName);
        if (sourceFile) {
            this.context = sourceFile.fileName;
            var node = this.findNode(sourceFile, position);
            if (node) {
                return this.getSourceFromNode(fileName, this.host.getScriptVersion(sourceFile.fileName), node);
            }
        }
        else {
            this.ensureTemplateMap();
            // TODO: Cannocalize the file?
            var componentType = this.fileToComponent.get(fileName);
            if (componentType) {
                return this.getSourceFromType(fileName, this.host.getScriptVersion(fileName), componentType);
            }
        }
        return undefined;
    };
    TypeScriptServiceHost.prototype.getAnalyzedModules = function () {
        this.validate();
        return this.ensureAnalyzedModules();
    };
    TypeScriptServiceHost.prototype.ensureAnalyzedModules = function () {
        var analyzedModules = this.analyzedModules;
        if (!analyzedModules) {
            var analyzeHost = { isSourceFile: function (filePath) { return true; } };
            var programSymbols = compiler_1.extractProgramSymbols(this.staticSymbolResolver, this.program.getSourceFiles().map(function (sf) { return sf.fileName; }), analyzeHost);
            analyzedModules = this.analyzedModules =
                compiler_1.analyzeNgModules(programSymbols, analyzeHost, this.resolver);
        }
        return analyzedModules;
    };
    TypeScriptServiceHost.prototype.getTemplates = function (fileName) {
        var _this = this;
        this.ensureTemplateMap();
        var componentType = this.fileToComponent.get(fileName);
        if (componentType) {
            var templateSource = this.getTemplateAt(fileName, 0);
            if (templateSource) {
                return [templateSource];
            }
        }
        else {
            var version_1 = this.host.getScriptVersion(fileName);
            var result_1 = [];
            // Find each template string in the file
            var visit_1 = function (child) {
                var templateSource = _this.getSourceFromNode(fileName, version_1, child);
                if (templateSource) {
                    result_1.push(templateSource);
                }
                else {
                    ts.forEachChild(child, visit_1);
                }
            };
            var sourceFile = this.getSourceFile(fileName);
            if (sourceFile) {
                this.context = sourceFile.path || sourceFile.fileName;
                ts.forEachChild(sourceFile, visit_1);
            }
            return result_1.length ? result_1 : undefined;
        }
    };
    TypeScriptServiceHost.prototype.getDeclarations = function (fileName) {
        var _this = this;
        var result = [];
        var sourceFile = this.getSourceFile(fileName);
        if (sourceFile) {
            var visit_2 = function (child) {
                var declaration = _this.getDeclarationFromNode(sourceFile, child);
                if (declaration) {
                    result.push(declaration);
                }
                else {
                    ts.forEachChild(child, visit_2);
                }
            };
            ts.forEachChild(sourceFile, visit_2);
        }
        return result;
    };
    TypeScriptServiceHost.prototype.getSourceFile = function (fileName) {
        return this.tsService.getProgram().getSourceFile(fileName);
    };
    TypeScriptServiceHost.prototype.updateAnalyzedModules = function () {
        this.validate();
        if (this.modulesOutOfDate) {
            this.analyzedModules = null;
            this._reflector = null;
            this.templateReferences = null;
            this.fileToComponent = null;
            this.ensureAnalyzedModules();
            this.modulesOutOfDate = false;
        }
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "program", {
        get: function () { return this.tsService.getProgram(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptServiceHost.prototype, "checker", {
        get: function () {
            var checker = this._checker;
            if (!checker) {
                checker = this._checker = this.program.getTypeChecker();
            }
            return checker;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.validate = function () {
        var _this = this;
        var program = this.program;
        if (this._staticSymbolResolver && this.lastProgram != program) {
            // Invalidate file that have changed in the static symbol resolver
            var invalidateFile = function (fileName) {
                return _this._staticSymbolResolver.invalidateFile(fileName);
            };
            this.clearCaches();
            var seen_1 = new Set();
            for (var _i = 0, _a = this.program.getSourceFiles(); _i < _a.length; _i++) {
                var sourceFile = _a[_i];
                var fileName = sourceFile.fileName;
                seen_1.add(fileName);
                var version = this.host.getScriptVersion(fileName);
                var lastVersion = this.fileVersions.get(fileName);
                if (version != lastVersion) {
                    this.fileVersions.set(fileName, version);
                    invalidateFile(fileName);
                }
            }
            // Remove file versions that are no longer in the file and invalidate them.
            var missing = Array.from(this.fileVersions.keys()).filter(function (f) { return !seen_1.has(f); });
            missing.forEach(function (f) { return _this.fileVersions.delete(f); });
            missing.forEach(invalidateFile);
            this.lastProgram = program;
        }
    };
    TypeScriptServiceHost.prototype.clearCaches = function () {
        this._checker = null;
        this._typeCache = [];
        this._resolver = null;
        this.collectedErrors = null;
        this.modulesOutOfDate = true;
    };
    TypeScriptServiceHost.prototype.ensureTemplateMap = function () {
        if (!this.fileToComponent || !this.templateReferences) {
            var fileToComponent = new Map();
            var templateReference = [];
            var ngModuleSummary = this.getAnalyzedModules();
            var urlResolver = compiler_1.createOfflineCompileUrlResolver();
            for (var _i = 0, _a = ngModuleSummary.ngModules; _i < _a.length; _i++) {
                var module_1 = _a[_i];
                for (var _b = 0, _c = module_1.declaredDirectives; _b < _c.length; _b++) {
                    var directive = _c[_b];
                    var metadata = this.resolver.getNonNormalizedDirectiveMetadata(directive.reference).metadata;
                    if (metadata.isComponent && metadata.template && metadata.template.templateUrl) {
                        var templateName = urlResolver.resolve(this.reflector.componentModuleUrl(directive.reference), metadata.template.templateUrl);
                        fileToComponent.set(templateName, directive.reference);
                        templateReference.push(templateName);
                    }
                }
            }
            this.fileToComponent = fileToComponent;
            this.templateReferences = templateReference;
        }
    };
    TypeScriptServiceHost.prototype.getSourceFromDeclaration = function (fileName, version, source, span, type, declaration, node, sourceFile) {
        var queryCache = undefined;
        var t = this;
        if (declaration) {
            return {
                version: version,
                source: source,
                span: span,
                type: type,
                get members() {
                    return compiler_cli_1.getClassMembersFromDeclaration(t.program, t.checker, sourceFile, declaration);
                },
                get query() {
                    if (!queryCache) {
                        var pipes_1 = t.service.getPipesAt(fileName, node.getStart());
                        queryCache = compiler_cli_1.getSymbolQuery(t.program, t.checker, sourceFile, function () { return compiler_cli_1.getPipesTable(sourceFile, t.program, t.checker, pipes_1); });
                    }
                    return queryCache;
                }
            };
        }
    };
    TypeScriptServiceHost.prototype.getSourceFromNode = function (fileName, version, node) {
        var result = undefined;
        var t = this;
        switch (node.kind) {
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.StringLiteral:
                var _a = this.getTemplateClassDeclFromNode(node), declaration = _a[0], decorator = _a[1];
                if (declaration && declaration.name) {
                    var sourceFile = this.getSourceFile(fileName);
                    return this.getSourceFromDeclaration(fileName, version, this.stringOf(node) || '', shrink(spanOf(node)), this.reflector.getStaticSymbol(sourceFile.fileName, declaration.name.text), declaration, node, sourceFile);
                }
                break;
        }
        return result;
    };
    TypeScriptServiceHost.prototype.getSourceFromType = function (fileName, version, type) {
        var result = undefined;
        var declaration = this.getTemplateClassFromStaticSymbol(type);
        if (declaration) {
            var snapshot = this.host.getScriptSnapshot(fileName);
            if (snapshot) {
                var source = snapshot.getText(0, snapshot.getLength());
                result = this.getSourceFromDeclaration(fileName, version, source, { start: 0, end: source.length }, type, declaration, declaration, declaration.getSourceFile());
            }
        }
        return result;
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "reflectorHost", {
        get: function () {
            var _this = this;
            var result = this._reflectorHost;
            if (!result) {
                if (!this.context) {
                    // Make up a context by finding the first script and using that as the base dir.
                    this.context = this.host.getScriptFileNames()[0];
                }
                // Use the file context's directory as the base directory.
                // The host's getCurrentDirectory() is not reliable as it is always "" in
                // tsserver. We don't need the exact base directory, just one that contains
                // a source file.
                var source = this.tsService.getProgram().getSourceFile(this.context);
                if (!source) {
                    throw new Error('Internal error: no context could be determined');
                }
                var tsConfigPath = findTsConfig(source.fileName);
                var basePath = path.dirname(tsConfigPath || this.context);
                var options = { basePath: basePath, genDir: basePath };
                var compilerOptions = this.host.getCompilationSettings();
                if (compilerOptions && compilerOptions.baseUrl) {
                    options.baseUrl = compilerOptions.baseUrl;
                }
                result = this._reflectorHost =
                    new reflector_host_1.ReflectorHost(function () { return _this.tsService.getProgram(); }, this.host, options);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.collectError = function (error, filePath) {
        if (filePath) {
            var errorMap = this.collectedErrors;
            if (!errorMap || !this.collectedErrors) {
                errorMap = this.collectedErrors = new Map();
            }
            var errors = errorMap.get(filePath);
            if (!errors) {
                errors = [];
                this.collectedErrors.set(filePath, errors);
            }
            errors.push(error);
        }
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "staticSymbolResolver", {
        get: function () {
            var _this = this;
            var result = this._staticSymbolResolver;
            if (!result) {
                this._summaryResolver = new compiler_1.AotSummaryResolver({
                    loadSummary: function (filePath) { return null; },
                    isSourceFile: function (sourceFilePath) { return true; },
                    getOutputFileName: function (sourceFilePath) { return sourceFilePath; }
                }, this._staticSymbolCache);
                result = this._staticSymbolResolver = new compiler_1.StaticSymbolResolver(this.reflectorHost, this._staticSymbolCache, this._summaryResolver, function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptServiceHost.prototype, "reflector", {
        get: function () {
            var _this = this;
            var result = this._reflector;
            if (!result) {
                var ssr = this.staticSymbolResolver;
                result = this._reflector = new compiler_1.StaticReflector(this._summaryResolver, ssr, [], [], function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.getTemplateClassFromStaticSymbol = function (type) {
        var source = this.getSourceFile(type.filePath);
        if (source) {
            var declarationNode = ts.forEachChild(source, function (child) {
                if (child.kind === ts.SyntaxKind.ClassDeclaration) {
                    var classDeclaration = child;
                    if (classDeclaration.name != null && classDeclaration.name.text === type.name) {
                        return classDeclaration;
                    }
                }
            });
            return declarationNode;
        }
        return undefined;
    };
    /**
     * Given a template string node, see if it is an Angular template string, and if so return the
     * containing class.
     */
    TypeScriptServiceHost.prototype.getTemplateClassDeclFromNode = function (currentToken) {
        // Verify we are in a 'template' property assignment, in an object literal, which is an call
        // arg, in a decorator
        var parentNode = currentToken.parent; // PropertyAssignment
        if (!parentNode) {
            return TypeScriptServiceHost.missingTemplate;
        }
        if (parentNode.kind !== ts.SyntaxKind.PropertyAssignment) {
            return TypeScriptServiceHost.missingTemplate;
        }
        else {
            // TODO: Is this different for a literal, i.e. a quoted property name like "template"?
            if (parentNode.name.text !== 'template') {
                return TypeScriptServiceHost.missingTemplate;
            }
        }
        parentNode = parentNode.parent; // ObjectLiteralExpression
        if (!parentNode || parentNode.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
            return TypeScriptServiceHost.missingTemplate;
        }
        parentNode = parentNode.parent; // CallExpression
        if (!parentNode || parentNode.kind !== ts.SyntaxKind.CallExpression) {
            return TypeScriptServiceHost.missingTemplate;
        }
        var callTarget = parentNode.expression;
        var decorator = parentNode.parent; // Decorator
        if (!decorator || decorator.kind !== ts.SyntaxKind.Decorator) {
            return TypeScriptServiceHost.missingTemplate;
        }
        var declaration = decorator.parent; // ClassDeclaration
        if (!declaration || declaration.kind !== ts.SyntaxKind.ClassDeclaration) {
            return TypeScriptServiceHost.missingTemplate;
        }
        return [declaration, callTarget];
    };
    TypeScriptServiceHost.prototype.getCollectedErrors = function (defaultSpan, sourceFile) {
        var errors = (this.collectedErrors && this.collectedErrors.get(sourceFile.fileName));
        return (errors && errors.map(function (e) {
            return { message: e.message, span: spanAt(sourceFile, e.line, e.column) || defaultSpan };
        })) ||
            [];
    };
    TypeScriptServiceHost.prototype.getDeclarationFromNode = function (sourceFile, node) {
        if (node.kind == ts.SyntaxKind.ClassDeclaration && node.decorators &&
            node.name) {
            for (var _i = 0, _a = node.decorators; _i < _a.length; _i++) {
                var decorator = _a[_i];
                if (decorator.expression && decorator.expression.kind == ts.SyntaxKind.CallExpression) {
                    var classDeclaration = node;
                    if (classDeclaration.name) {
                        var call = decorator.expression;
                        var target = call.expression;
                        var type = this.checker.getTypeAtLocation(target);
                        if (type) {
                            var staticSymbol = this.reflector.getStaticSymbol(sourceFile.fileName, classDeclaration.name.text);
                            try {
                                if (this.resolver.isDirective(staticSymbol)) {
                                    var metadata = this.resolver.getNonNormalizedDirectiveMetadata(staticSymbol).metadata;
                                    var declarationSpan = spanOf(target);
                                    return {
                                        type: staticSymbol,
                                        declarationSpan: declarationSpan,
                                        metadata: metadata,
                                        errors: this.getCollectedErrors(declarationSpan, sourceFile)
                                    };
                                }
                            }
                            catch (e) {
                                if (e.message) {
                                    this.collectError(e, sourceFile.fileName);
                                    var declarationSpan = spanOf(target);
                                    return {
                                        type: staticSymbol,
                                        declarationSpan: declarationSpan,
                                        errors: this.getCollectedErrors(declarationSpan, sourceFile)
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    TypeScriptServiceHost.prototype.stringOf = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return node.text;
            case ts.SyntaxKind.StringLiteral:
                return node.text;
        }
    };
    TypeScriptServiceHost.prototype.findNode = function (sourceFile, position) {
        function find(node) {
            if (position >= node.getStart() && position < node.getEnd()) {
                return ts.forEachChild(node, find) || node;
            }
        }
        return find(sourceFile);
    };
    return TypeScriptServiceHost;
}());
TypeScriptServiceHost.missingTemplate = [undefined, undefined];
exports.TypeScriptServiceHost = TypeScriptServiceHost;
function findTsConfig(fileName) {
    var dir = path.dirname(fileName);
    while (fs.existsSync(dir)) {
        var candidate = path.join(dir, 'tsconfig.json');
        if (fs.existsSync(candidate))
            return candidate;
        var parentDir = path.dirname(dir);
        if (parentDir === dir)
            break;
        dir = parentDir;
    }
}
function spanOf(node) {
    return { start: node.getStart(), end: node.getEnd() };
}
function shrink(span, offset) {
    if (offset == null)
        offset = 1;
    return { start: span.start + offset, end: span.end - offset };
}
function spanAt(sourceFile, line, column) {
    if (line != null && column != null) {
        var position_1 = ts.getPositionOfLineAndCharacter(sourceFile, line, column);
        var findChild = function findChild(node) {
            if (node.kind > ts.SyntaxKind.LastToken && node.pos <= position_1 && node.end > position_1) {
                var betterNode = ts.forEachChild(node, findChild);
                return betterNode || node;
            }
        };
        var node = ts.forEachChild(sourceFile, findChild);
        if (node) {
            return { start: node.getStart(), end: node.getEnd() };
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS9zcmMvdHlwZXNjcmlwdF9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDhDQUEwZTtBQUMxZSxzREFBNEg7QUFDNUgsc0NBQXFFO0FBQ3JFLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLHVEQUF5RDtBQUN6RCxtREFBK0M7QUFLL0M7O0dBRUc7QUFDSCw2Q0FDSSxJQUE0QixFQUFFLE9BQTJCO0lBQzNELElBQU0sTUFBTSxHQUFHLElBQUkscUJBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELElBQU0sUUFBUSxHQUFHLHdDQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBTkQsa0ZBTUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQXFDLG1DQUFVO0lBQS9DOztJQU1BLENBQUM7SUFMQywrQkFBSyxHQUFMLFVBQ0ksTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBb0MsRUFDakUsbUJBQXVFO1FBRDFDLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ2pFLG9DQUFBLEVBQUEsc0JBQTJDLHVDQUE0QjtRQUN6RSxNQUFNLENBQUMsSUFBSSwwQkFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBcUMscUJBQVUsR0FNOUM7QUFOWSwwQ0FBZTtBQVE1Qjs7R0FFRztBQUNIO0lBQXlDLHVDQUFjO0lBQXZEOztJQUVBLENBQUM7SUFEQyxpQ0FBRyxHQUFILFVBQUksR0FBVyxJQUFxQixNQUFNLENB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