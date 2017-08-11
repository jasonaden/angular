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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var compile_metadata_1 = require("../compile_metadata");
var config_1 = require("../config");
var injectable_1 = require("../injectable");
var metadata_resolver_1 = require("../metadata_resolver");
var ng_module_compiler_1 = require("../ng_module_compiler");
var ir = require("../output/output_ast");
var output_interpreter_1 = require("../output/output_interpreter");
var output_jit_1 = require("../output/output_jit");
var style_compiler_1 = require("../style_compiler");
var summary_resolver_1 = require("../summary_resolver");
var template_parser_1 = require("../template_parser/template_parser");
var util_1 = require("../util");
var view_compiler_1 = require("../view_compiler/view_compiler");
/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 *
 * @security  When compiling templates at runtime, you must ensure that the entire template comes
 * from a trusted source. Attacker-controlled data introduced by a template could expose your
 * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
 */
var JitCompiler = (function () {
    function JitCompiler(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _summaryResolver, _compilerConfig, _console) {
        this._injector = _injector;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._summaryResolver = _summaryResolver;
        this._compilerConfig = _compilerConfig;
        this._console = _console;
        this._compiledTemplateCache = new Map();
        this._compiledHostTemplateCache = new Map();
        this._compiledDirectiveWrapperCache = new Map();
        this._compiledNgModuleCache = new Map();
        this._sharedStylesheetCount = 0;
    }
    Object.defineProperty(JitCompiler.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    JitCompiler.prototype.compileModuleSync = function (moduleType) {
        return util_1.SyncAsync.assertSync(this._compileModuleAndComponents(moduleType, true));
    };
    JitCompiler.prototype.compileModuleAsync = function (moduleType) {
        return Promise.resolve(this._compileModuleAndComponents(moduleType, false));
    };
    JitCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return util_1.SyncAsync.assertSync(this._compileModuleAndAllComponents(moduleType, true));
    };
    JitCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return Promise.resolve(this._compileModuleAndAllComponents(moduleType, false));
    };
    JitCompiler.prototype.getNgContentSelectors = function (component) {
        this._console.warn('Compiler.getNgContentSelectors is deprecated. Use ComponentFactory.ngContentSelectors instead!');
        var template = this._compiledTemplateCache.get(component);
        if (!template) {
            throw new Error("The component " + core_1.ɵstringify(component) + " is not yet compiled!");
        }
        return template.compMeta.template.ngContentSelectors;
    };
    JitCompiler.prototype.getComponentFactory = function (component) {
        var summary = this._metadataResolver.getDirectiveSummary(component);
        return summary.componentFactory;
    };
    JitCompiler.prototype.loadAotSummaries = function (summaries) {
        var _this = this;
        this.clearCache();
        flattenSummaries(summaries).forEach(function (summary) {
            _this._summaryResolver.addSummary({ symbol: summary.type.reference, metadata: null, type: summary });
        });
    };
    JitCompiler.prototype.hasAotSummary = function (ref) { return !!this._summaryResolver.resolveSummary(ref); };
    JitCompiler.prototype._filterJitIdentifiers = function (ids) {
        var _this = this;
        return ids.map(function (mod) { return mod.reference; }).filter(function (ref) { return !_this.hasAotSummary(ref); });
    };
    JitCompiler.prototype._compileModuleAndComponents = function (moduleType, isSync) {
        var _this = this;
        return util_1.SyncAsync.then(this._loadModules(moduleType, isSync), function () {
            _this._compileComponents(moduleType, null);
            return _this._compileModule(moduleType);
        });
    };
    JitCompiler.prototype._compileModuleAndAllComponents = function (moduleType, isSync) {
        var _this = this;
        return util_1.SyncAsync.then(this._loadModules(moduleType, isSync), function () {
            var componentFactories = [];
            _this._compileComponents(moduleType, componentFactories);
            return new core_1.ModuleWithComponentFactories(_this._compileModule(moduleType), componentFactories);
        });
    };
    JitCompiler.prototype._loadModules = function (mainModule, isSync) {
        var _this = this;
        var loading = [];
        var mainNgModule = this._metadataResolver.getNgModuleMetadata(mainModule);
        // Note: for runtime compilation, we want to transitively compile all modules,
        // so we also need to load the declared directives / pipes for all nested modules.
        this._filterJitIdentifiers(mainNgModule.transitiveModule.modules).forEach(function (nestedNgModule) {
            // getNgModuleMetadata only returns null if the value passed in is not an NgModule
            var moduleMeta = _this._metadataResolver.getNgModuleMetadata(nestedNgModule);
            _this._filterJitIdentifiers(moduleMeta.declaredDirectives).forEach(function (ref) {
                var promise = _this._metadataResolver.loadDirectiveMetadata(moduleMeta.type.reference, ref, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            _this._filterJitIdentifiers(moduleMeta.declaredPipes)
                .forEach(function (ref) { return _this._metadataResolver.getOrLoadPipeMetadata(ref); });
        });
        return util_1.SyncAsync.all(loading);
    };
    JitCompiler.prototype._compileModule = function (moduleType) {
        var _this = this;
        var ngModuleFactory = this._compiledNgModuleCache.get(moduleType);
        if (!ngModuleFactory) {
            var moduleMeta_1 = this._metadataResolver.getNgModuleMetadata(moduleType);
            // Always provide a bound Compiler
            var extraProviders = [this._metadataResolver.getProviderMetadata(new compile_metadata_1.ProviderMeta(core_1.Compiler, { useFactory: function () { return new ModuleBoundCompiler(_this, moduleMeta_1.type.reference); } }))];
            var outputCtx = createOutputContext();
            var compileResult = this._ngModuleCompiler.compile(outputCtx, moduleMeta_1, extraProviders);
            if (!this._compilerConfig.useJit) {
                ngModuleFactory =
                    output_interpreter_1.interpretStatements(outputCtx.statements)[compileResult.ngModuleFactoryVar];
            }
            else {
                ngModuleFactory = output_jit_1.jitStatements(compile_metadata_1.ngModuleJitUrl(moduleMeta_1), outputCtx.statements)[compileResult.ngModuleFactoryVar];
            }
            this._compiledNgModuleCache.set(moduleMeta_1.type.reference, ngModuleFactory);
        }
        return ngModuleFactory;
    };
    /**
     * @internal
     */
    JitCompiler.prototype._compileComponents = function (mainModule, allComponentFactories) {
        var _this = this;
        var ngModule = this._metadataResolver.getNgModuleMetadata(mainModule);
        var moduleByJitDirective = new Map();
        var templates = new Set();
        var transJitModules = this._filterJitIdentifiers(ngModule.transitiveModule.modules);
        transJitModules.forEach(function (localMod) {
            var localModuleMeta = _this._metadataResolver.getNgModuleMetadata(localMod);
            _this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach(function (dirRef) {
                moduleByJitDirective.set(dirRef, localModuleMeta);
                var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirRef);
                if (dirMeta.isComponent) {
                    templates.add(_this._createCompiledTemplate(dirMeta, localModuleMeta));
                    if (allComponentFactories) {
                        var template = _this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                        templates.add(template);
                        allComponentFactories.push(dirMeta.componentFactory);
                    }
                }
            });
        });
        transJitModules.forEach(function (localMod) {
            var localModuleMeta = _this._metadataResolver.getNgModuleMetadata(localMod);
            _this._filterJitIdentifiers(localModuleMeta.declaredDirectives).forEach(function (dirRef) {
                var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirRef);
                if (dirMeta.isComponent) {
                    dirMeta.entryComponents.forEach(function (entryComponentType) {
                        var moduleMeta = moduleByJitDirective.get(entryComponentType.componentType);
                        templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                    });
                }
            });
            localModuleMeta.entryComponents.forEach(function (entryComponentType) {
                if (!_this.hasAotSummary(entryComponentType.componentType.reference)) {
                    var moduleMeta = moduleByJitDirective.get(entryComponentType.componentType);
                    templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                }
            });
        });
        templates.forEach(function (template) { return _this._compileTemplate(template); });
    };
    JitCompiler.prototype.clearCacheFor = function (type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        var compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
            this._compiledTemplateCache.delete(type);
        }
    };
    JitCompiler.prototype.clearCache = function () {
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._compiledNgModuleCache.clear();
    };
    JitCompiler.prototype._createCompiledHostTemplate = function (compType, ngModule) {
        if (!ngModule) {
            throw new Error("Component " + core_1.ɵstringify(compType) + " is not part of any NgModule or the module has not been imported into your module.");
        }
        var compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (!compiledTemplate) {
            var compMeta = this._metadataResolver.getDirectiveMetadata(compType);
            assertComponent(compMeta);
            var componentFactory = compMeta.componentFactory;
            var hostClass = this._metadataResolver.getHostComponentType(compType);
            var hostMeta = compile_metadata_1.createHostComponentMeta(hostClass, compMeta, core_1.ɵgetComponentViewDefinitionFactory(componentFactory));
            compiledTemplate =
                new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
            this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
    };
    JitCompiler.prototype._createCompiledTemplate = function (compMeta, ngModule) {
        var compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
        if (!compiledTemplate) {
            assertComponent(compMeta);
            compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
            this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
        }
        return compiledTemplate;
    };
    JitCompiler.prototype._compileTemplate = function (template) {
        var _this = this;
        if (template.isCompiled) {
            return;
        }
        var compMeta = template.compMeta;
        var externalStylesheetsByModuleUrl = new Map();
        var outputContext = createOutputContext();
        var componentStylesheet = this._styleCompiler.compileComponent(outputContext, compMeta);
        compMeta.template.externalStylesheets.forEach(function (stylesheetMeta) {
            var compiledStylesheet = _this._styleCompiler.compileStyles(createOutputContext(), compMeta, stylesheetMeta);
            externalStylesheetsByModuleUrl.set(stylesheetMeta.moduleUrl, compiledStylesheet);
        });
        this._resolveStylesCompileResult(componentStylesheet, externalStylesheetsByModuleUrl);
        var directives = template.directives.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var pipes = template.ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var _a = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, template.ngModule.schemas, compile_metadata_1.templateSourceUrl(template.ngModule.type, template.compMeta, template.compMeta.template)), parsedTemplate = _a.template, usedPipes = _a.pipes;
        var compileResult = this._viewCompiler.compileComponent(outputContext, compMeta, parsedTemplate, ir.variable(componentStylesheet.stylesVar), usedPipes);
        var evalResult;
        if (!this._compilerConfig.useJit) {
            evalResult = output_interpreter_1.interpretStatements(outputContext.statements);
        }
        else {
            evalResult = output_jit_1.jitStatements(compile_metadata_1.templateJitUrl(template.ngModule.type, template.compMeta), outputContext.statements);
        }
        var viewClass = evalResult[compileResult.viewClassVar];
        var rendererType = evalResult[compileResult.rendererTypeVar];
        template.compiled(viewClass, rendererType);
    };
    JitCompiler.prototype._resolveStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        var _this = this;
        result.dependencies.forEach(function (dep, i) {
            var nestedCompileResult = externalStylesheetsByModuleUrl.get(dep.moduleUrl);
            var nestedStylesArr = _this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
            dep.setValue(nestedStylesArr);
        });
    };
    JitCompiler.prototype._resolveAndEvalStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        if (!this._compilerConfig.useJit) {
            return output_interpreter_1.interpretStatements(result.outputCtx.statements)[result.stylesVar];
        }
        else {
            return output_jit_1.jitStatements(compile_metadata_1.sharedStylesheetJitUrl(result.meta, this._sharedStylesheetCount++), result.outputCtx.statements)[result.stylesVar];
        }
    };
    return JitCompiler;
}());
JitCompiler = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [core_1.Injector, metadata_resolver_1.CompileMetadataResolver,
        template_parser_1.TemplateParser, style_compiler_1.StyleCompiler,
        view_compiler_1.ViewCompiler, ng_module_compiler_1.NgModuleCompiler,
        summary_resolver_1.SummaryResolver, config_1.CompilerConfig,
        core_1.ɵConsole])
], JitCompiler);
exports.JitCompiler = JitCompiler;
var CompiledTemplate = (function () {
    function CompiledTemplate(isHost, compType, compMeta, ngModule, directives) {
        this.isHost = isHost;
        this.compType = compType;
        this.compMeta = compMeta;
        this.ngModule = ngModule;
        this.directives = directives;
        this._viewClass = null;
        this.isCompiled = false;
    }
    CompiledTemplate.prototype.compiled = function (viewClass, rendererType) {
        this._viewClass = viewClass;
        this.compMeta.componentViewType.setDelegate(viewClass);
        for (var prop in rendererType) {
            this.compMeta.rendererType[prop] = rendererType[prop];
        }
        this.isCompiled = true;
    };
    return CompiledTemplate;
}());
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error("Could not compile '" + compile_metadata_1.identifierName(meta.type) + "' because it is not a component.");
    }
}
/**
 * Implements `Compiler` by delegating to the JitCompiler using a known module.
 */
var ModuleBoundCompiler = (function () {
    function ModuleBoundCompiler(_delegate, _ngModule) {
        this._delegate = _delegate;
        this._ngModule = _ngModule;
    }
    Object.defineProperty(ModuleBoundCompiler.prototype, "_injector", {
        get: function () { return this._delegate.injector; },
        enumerable: true,
        configurable: true
    });
    ModuleBoundCompiler.prototype.compileModuleSync = function (moduleType) {
        return this._delegate.compileModuleSync(moduleType);
    };
    ModuleBoundCompiler.prototype.compileModuleAsync = function (moduleType) {
        return this._delegate.compileModuleAsync(moduleType);
    };
    ModuleBoundCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._delegate.compileModuleAndAllComponentsSync(moduleType);
    };
    ModuleBoundCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._delegate.compileModuleAndAllComponentsAsync(moduleType);
    };
    ModuleBoundCompiler.prototype.getNgContentSelectors = function (component) {
        return this._delegate.getNgContentSelectors(component);
    };
    /**
     * Clears all caches
     */
    ModuleBoundCompiler.prototype.clearCache = function () { this._delegate.clearCache(); };
    /**
     * Clears the cache for the given component/ngModule.
     */
    ModuleBoundCompiler.prototype.clearCacheFor = function (type) { this._delegate.clearCacheFor(type); };
    return ModuleBoundCompiler;
}());
function flattenSummaries(fn, out) {
    if (out === void 0) { out = []; }
    fn().forEach(function (entry) {
        if (typeof entry === 'function') {
            flattenSummaries(entry, out);
        }
        else {
            out.push(entry);
        }
    });
    return out;
}
function createOutputContext() {
    var importExpr = function (symbol) {
        return ir.importExpr({ name: compile_metadata_1.identifierName(symbol), moduleName: null, runtime: symbol });
    };
    return { statements: [], genFilePath: '', importExpr: importExpr };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaml0L2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXVQO0FBRXZQLHdEQUE4UztBQUM5UyxvQ0FBeUM7QUFDekMsNENBQWlEO0FBQ2pELDBEQUE2RDtBQUM3RCw0REFBdUQ7QUFDdkQseUNBQTJDO0FBQzNDLG1FQUFpRTtBQUNqRSxtREFBbUQ7QUFDbkQsb0RBQW9FO0FBQ3BFLHdEQUFvRDtBQUNwRCxzRUFBa0U7QUFDbEUsZ0NBQWlEO0FBQ2pELGdFQUE0RDtBQUk1RDs7Ozs7Ozs7R0FRRztBQUVILElBQWEsV0FBVztJQU90QixxQkFDWSxTQUFtQixFQUFVLGlCQUEwQyxFQUN2RSxlQUErQixFQUFVLGNBQTZCLEVBQ3RFLGFBQTJCLEVBQVUsaUJBQW1DLEVBQ3hFLGdCQUE0QyxFQUFVLGVBQStCLEVBQ3JGLFFBQWlCO1FBSmpCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXlCO1FBQ3ZFLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQ3RFLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQVUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUN4RSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTRCO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQ3JGLGFBQVEsR0FBUixRQUFRLENBQVM7UUFYckIsMkJBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQStCLENBQUM7UUFDaEUsK0JBQTBCLEdBQUcsSUFBSSxHQUFHLEVBQStCLENBQUM7UUFDcEUsbUNBQThCLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFDakUsMkJBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQW1DLENBQUM7UUFDcEUsMkJBQXNCLEdBQUcsQ0FBQyxDQUFDO0lBT0gsQ0FBQztJQUVqQyxzQkFBSSxpQ0FBUTthQUFaLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbkQsdUNBQWlCLEdBQWpCLFVBQXFCLFVBQW1CO1FBQ3RDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFzQixVQUFtQjtRQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELHVEQUFpQyxHQUFqQyxVQUFxQyxVQUFtQjtRQUN0RCxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCx3REFBa0MsR0FBbEMsVUFBc0MsVUFBbUI7UUFFdkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCwyQ0FBcUIsR0FBckIsVUFBc0IsU0FBb0I7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQ2QsZ0dBQWdHLENBQUMsQ0FBQztRQUN0RyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLGlCQUFTLENBQUMsU0FBUyxDQUFDLDBCQUF1QixDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVUsQ0FBQyxrQkFBa0IsQ0FBQztJQUN6RCxDQUFDO0lBRUQseUNBQW1CLEdBQW5CLFVBQXVCLFNBQWtCO1FBQ3ZDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQXNCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUN2RCxDQUFDO0lBRUQsc0NBQWdCLEdBQWhCLFVBQWlCLFNBQXNCO1FBQXZDLGlCQU1DO1FBTEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87WUFDMUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FDNUIsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtQ0FBYSxHQUFiLFVBQWMsR0FBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0UsMkNBQXFCLEdBQTdCLFVBQThCLEdBQWdDO1FBQTlELGlCQUVDO1FBREMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsU0FBUyxFQUFiLENBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFTyxpREFBMkIsR0FBbkMsVUFBdUMsVUFBbUIsRUFBRSxNQUFlO1FBQTNFLGlCQU1DO1FBSkMsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQzNELEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sb0RBQThCLEdBQXRDLFVBQTBDLFVBQW1CLEVBQUUsTUFBZTtRQUE5RSxpQkFPQztRQUxDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUMzRCxJQUFNLGtCQUFrQixHQUE0QixFQUFFLENBQUM7WUFDdkQsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLG1DQUE0QixDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxrQ0FBWSxHQUFwQixVQUFxQixVQUFlLEVBQUUsTUFBZTtRQUFyRCxpQkFtQkM7UUFsQkMsSUFBTSxPQUFPLEdBQW1CLEVBQUUsQ0FBQztRQUNuQyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFHLENBQUM7UUFDOUUsOEVBQThFO1FBQzlFLGtGQUFrRjtRQUNsRixJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGNBQWM7WUFDdkYsa0ZBQWtGO1lBQ2xGLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUcsQ0FBQztZQUNoRixLQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztnQkFDcEUsSUFBTSxPQUFPLEdBQ1QsS0FBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDekYsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztpQkFDL0MsT0FBTyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLG9DQUFjLEdBQXRCLFVBQTBCLFVBQW1CO1FBQTdDLGlCQW1CQztRQWxCQyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRyxDQUFDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFNLFlBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFHLENBQUM7WUFDNUUsa0NBQWtDO1lBQ2xDLElBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLElBQUksK0JBQVksQ0FDL0UsZUFBUSxFQUFFLEVBQUMsVUFBVSxFQUFFLGNBQU0sT0FBQSxJQUFJLG1CQUFtQixDQUFDLEtBQUksRUFBRSxZQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUF4RCxDQUF3RCxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUYsSUFBTSxTQUFTLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztZQUN4QyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDNUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLGVBQWU7b0JBQ1gsd0NBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2xGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixlQUFlLEdBQUcsMEJBQWEsQ0FDM0IsaUNBQWMsQ0FBQyxZQUFVLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFHLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDNUYsQ0FBQztZQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsWUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUNELE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0NBQWtCLEdBQWxCLFVBQW1CLFVBQXFCLEVBQUUscUJBQW1EO1FBQTdGLGlCQTJDQztRQTFDQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFHLENBQUM7UUFDMUUsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0MsQ0FBQztRQUNyRSxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUU5QyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RGLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO1lBQy9CLElBQU0sZUFBZSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUcsQ0FBQztZQUMvRSxLQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtnQkFDNUUsb0JBQW9CLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDbEQsSUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBTSxRQUFRLEdBQ1YsS0FBSSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUM5RSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN4QixxQkFBcUIsQ0FBQyxJQUFJLENBQXdCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM5RSxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDL0IsSUFBTSxlQUFlLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBRyxDQUFDO1lBQy9FLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2dCQUM1RSxJQUFNLE9BQU8sR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN4QixPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFDLGtCQUFrQjt3QkFDakQsSUFBTSxVQUFVLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBRyxDQUFDO3dCQUNoRixTQUFTLENBQUMsR0FBRyxDQUNULEtBQUksQ0FBQywyQkFBMkIsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDdEYsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsZUFBZSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQyxrQkFBa0I7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRSxJQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFHLENBQUM7b0JBQ2hGLFNBQVMsQ0FBQyxHQUFHLENBQ1QsS0FBSSxDQUFDLDJCQUEyQixDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLElBQUssT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsbUNBQWEsR0FBYixVQUFjLElBQWU7UUFDM0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0NBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRU8saURBQTJCLEdBQW5DLFVBQW9DLFFBQW1CLEVBQUUsUUFBaUM7UUFFeEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDWCxlQUFhLGlCQUFTLENBQUMsUUFBUSxDQUFDLHVGQUFvRixDQUFDLENBQUM7UUFDNUgsQ0FBQztRQUNELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFCLElBQU0sZ0JBQWdCLEdBQTBCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMxRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEUsSUFBTSxRQUFRLEdBQUcsMENBQXVCLENBQ3BDLFNBQVMsRUFBRSxRQUFRLEVBQU8seUNBQWlDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ25GLGdCQUFnQjtnQkFDWixJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVPLDZDQUF1QixHQUEvQixVQUNJLFFBQWtDLEVBQUUsUUFBaUM7UUFDdkUsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDdEIsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFCLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQ25DLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTyxzQ0FBZ0IsR0FBeEIsVUFBeUIsUUFBMEI7UUFBbkQsaUJBa0NDO1FBakNDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFDRCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQU0sOEJBQThCLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFDN0UsSUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztRQUM1QyxJQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFGLFFBQVEsQ0FBQyxRQUFVLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsY0FBYztZQUM3RCxJQUFNLGtCQUFrQixHQUNwQixLQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN2Riw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixFQUFFLDhCQUE4QixDQUFDLENBQUM7UUFDdEYsSUFBTSxVQUFVLEdBQ1osUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDLENBQUM7UUFDOUYsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUN0RCxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFyRCxDQUFxRCxDQUFDLENBQUM7UUFDN0QsSUFBQSxnT0FFeUYsRUFGeEYsNEJBQXdCLEVBQUUsb0JBQWdCLENBRStDO1FBQ2hHLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQ3JELGFBQWEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEVBQ25GLFNBQVMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxVQUFlLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakMsVUFBVSxHQUFHLHdDQUFtQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixVQUFVLEdBQUcsMEJBQWEsQ0FDdEIsaUNBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNGLENBQUM7UUFDRCxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELElBQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVPLGlEQUEyQixHQUFuQyxVQUNJLE1BQTBCLEVBQUUsOEJBQStEO1FBRC9GLGlCQVFDO1FBTkMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQyxJQUFNLG1CQUFtQixHQUFHLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFHLENBQUM7WUFDaEYsSUFBTSxlQUFlLEdBQUcsS0FBSSxDQUFDLGtDQUFrQyxDQUMzRCxtQkFBbUIsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sd0RBQWtDLEdBQTFDLFVBQ0ksTUFBMEIsRUFDMUIsOEJBQStEO1FBQ2pFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsd0NBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLDBCQUFhLENBQ2hCLHlDQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsRUFDbEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF0UkQsSUFzUkM7QUF0UlksV0FBVztJQUR2QiwrQkFBa0IsRUFBRTtxQ0FTSSxlQUFRLEVBQTZCLDJDQUF1QjtRQUN0RCxnQ0FBYyxFQUEwQiw4QkFBYTtRQUN2RCw0QkFBWSxFQUE2QixxQ0FBZ0I7UUFDdEQsa0NBQWUsRUFBc0MsdUJBQWM7UUFDM0UsZUFBTztHQVpsQixXQUFXLENBc1J2QjtBQXRSWSxrQ0FBVztBQXdSeEI7SUFJRSwwQkFDVyxNQUFlLEVBQVMsUUFBbUMsRUFDM0QsUUFBa0MsRUFBUyxRQUFpQyxFQUM1RSxVQUF1QztRQUZ2QyxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBMkI7UUFDM0QsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUM1RSxlQUFVLEdBQVYsVUFBVSxDQUE2QjtRQU4xQyxlQUFVLEdBQWEsSUFBTSxDQUFDO1FBQ3RDLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFLa0MsQ0FBQztJQUV0RCxtQ0FBUSxHQUFSLFVBQVMsU0FBbUIsRUFBRSxZQUFpQjtRQUM3QyxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWtCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBRUQseUJBQXlCLElBQThCO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FDWCx3QkFBc0IsaUNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFDQUFrQyxDQUFDLENBQUM7SUFDekYsQ0FBQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsNkJBQW9CLFNBQXNCLEVBQVUsU0FBb0I7UUFBcEQsY0FBUyxHQUFULFNBQVMsQ0FBYTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7SUFBRyxDQUFDO0lBRTVFLHNCQUFJLDBDQUFTO2FBQWIsY0FBNEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFN0QsK0NBQWlCLEdBQWpCLFVBQXFCLFVBQW1CO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxnREFBa0IsR0FBbEIsVUFBc0IsVUFBbUI7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUNELCtEQUFpQyxHQUFqQyxVQUFxQyxVQUFtQjtRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsZ0VBQWtDLEdBQWxDLFVBQXNDLFVBQW1CO1FBRXZELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxtREFBcUIsR0FBckIsVUFBc0IsU0FBb0I7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0NBQVUsR0FBVixjQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVuRDs7T0FFRztJQUNILDJDQUFhLEdBQWIsVUFBYyxJQUFlLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLDBCQUFDO0FBQUQsQ0FBQyxBQWxDRCxJQWtDQztBQUdELDBCQUEwQixFQUFlLEVBQUUsR0FBOEI7SUFBOUIsb0JBQUEsRUFBQSxRQUE4QjtJQUN2RSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDtJQUNFLElBQU0sVUFBVSxHQUFHLFVBQUMsTUFBVztRQUMzQixPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBQyxJQUFJLEVBQUUsaUNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQztJQUFoRixDQUFnRixDQUFDO0lBQ3JGLE1BQU0sQ0FBQyxFQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLFlBQUEsRUFBQyxDQUFDO0FBQ3ZELENBQUMifQ==