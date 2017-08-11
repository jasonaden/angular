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
var core_1 = require("@angular/core");
var static_symbol_1 = require("./aot/static_symbol");
var selector_1 = require("./selector");
var util_1 = require("./util");
// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
var CompileAnimationEntryMetadata = (function () {
    function CompileAnimationEntryMetadata(name, definitions) {
        if (name === void 0) { name = null; }
        if (definitions === void 0) { definitions = null; }
        this.name = name;
        this.definitions = definitions;
    }
    return CompileAnimationEntryMetadata;
}());
exports.CompileAnimationEntryMetadata = CompileAnimationEntryMetadata;
var CompileAnimationStateMetadata = (function () {
    function CompileAnimationStateMetadata() {
    }
    return CompileAnimationStateMetadata;
}());
exports.CompileAnimationStateMetadata = CompileAnimationStateMetadata;
var CompileAnimationStateDeclarationMetadata = (function (_super) {
    __extends(CompileAnimationStateDeclarationMetadata, _super);
    function CompileAnimationStateDeclarationMetadata(stateNameExpr, styles) {
        var _this = _super.call(this) || this;
        _this.stateNameExpr = stateNameExpr;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationStateDeclarationMetadata;
}(CompileAnimationStateMetadata));
exports.CompileAnimationStateDeclarationMetadata = CompileAnimationStateDeclarationMetadata;
var CompileAnimationStateTransitionMetadata = (function (_super) {
    __extends(CompileAnimationStateTransitionMetadata, _super);
    function CompileAnimationStateTransitionMetadata(stateChangeExpr, steps) {
        var _this = _super.call(this) || this;
        _this.stateChangeExpr = stateChangeExpr;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationStateTransitionMetadata;
}(CompileAnimationStateMetadata));
exports.CompileAnimationStateTransitionMetadata = CompileAnimationStateTransitionMetadata;
var CompileAnimationMetadata = (function () {
    function CompileAnimationMetadata() {
    }
    return CompileAnimationMetadata;
}());
exports.CompileAnimationMetadata = CompileAnimationMetadata;
var CompileAnimationKeyframesSequenceMetadata = (function (_super) {
    __extends(CompileAnimationKeyframesSequenceMetadata, _super);
    function CompileAnimationKeyframesSequenceMetadata(steps) {
        if (steps === void 0) { steps = []; }
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationKeyframesSequenceMetadata;
}(CompileAnimationMetadata));
exports.CompileAnimationKeyframesSequenceMetadata = CompileAnimationKeyframesSequenceMetadata;
var CompileAnimationStyleMetadata = (function (_super) {
    __extends(CompileAnimationStyleMetadata, _super);
    function CompileAnimationStyleMetadata(offset, styles) {
        if (styles === void 0) { styles = null; }
        var _this = _super.call(this) || this;
        _this.offset = offset;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationStyleMetadata;
}(CompileAnimationMetadata));
exports.CompileAnimationStyleMetadata = CompileAnimationStyleMetadata;
var CompileAnimationAnimateMetadata = (function (_super) {
    __extends(CompileAnimationAnimateMetadata, _super);
    function CompileAnimationAnimateMetadata(timings, styles) {
        if (timings === void 0) { timings = 0; }
        if (styles === void 0) { styles = null; }
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationAnimateMetadata;
}(CompileAnimationMetadata));
exports.CompileAnimationAnimateMetadata = CompileAnimationAnimateMetadata;
var CompileAnimationWithStepsMetadata = (function (_super) {
    __extends(CompileAnimationWithStepsMetadata, _super);
    function CompileAnimationWithStepsMetadata(steps) {
        if (steps === void 0) { steps = null; }
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationWithStepsMetadata;
}(CompileAnimationMetadata));
exports.CompileAnimationWithStepsMetadata = CompileAnimationWithStepsMetadata;
var CompileAnimationSequenceMetadata = (function (_super) {
    __extends(CompileAnimationSequenceMetadata, _super);
    function CompileAnimationSequenceMetadata(steps) {
        if (steps === void 0) { steps = null; }
        return _super.call(this, steps) || this;
    }
    return CompileAnimationSequenceMetadata;
}(CompileAnimationWithStepsMetadata));
exports.CompileAnimationSequenceMetadata = CompileAnimationSequenceMetadata;
var CompileAnimationGroupMetadata = (function (_super) {
    __extends(CompileAnimationGroupMetadata, _super);
    function CompileAnimationGroupMetadata(steps) {
        if (steps === void 0) { steps = null; }
        return _super.call(this, steps) || this;
    }
    return CompileAnimationGroupMetadata;
}(CompileAnimationWithStepsMetadata));
exports.CompileAnimationGroupMetadata = CompileAnimationGroupMetadata;
function _sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
var _anonymousTypeIndex = 0;
function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    var ref = compileIdentifier.reference;
    if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.name;
    }
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    var identifier = core_1.ɵstringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = "anonymous_" + _anonymousTypeIndex++;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = _sanitizeIdentifier(identifier);
    }
    return identifier;
}
exports.identifierName = identifierName;
function identifierModuleUrl(compileIdentifier) {
    var ref = compileIdentifier.reference;
    if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.filePath;
    }
    // Runtime type
    return "./" + core_1.ɵstringify(ref);
}
exports.identifierModuleUrl = identifierModuleUrl;
function viewClassName(compType, embeddedTemplateIndex) {
    return "View_" + identifierName({ reference: compType }) + "_" + embeddedTemplateIndex;
}
exports.viewClassName = viewClassName;
function rendererTypeName(compType) {
    return "RenderType_" + identifierName({ reference: compType });
}
exports.rendererTypeName = rendererTypeName;
function hostViewClassName(compType) {
    return "HostView_" + identifierName({ reference: compType });
}
exports.hostViewClassName = hostViewClassName;
function componentFactoryName(compType) {
    return identifierName({ reference: compType }) + "NgFactory";
}
exports.componentFactoryName = componentFactoryName;
var CompileSummaryKind;
(function (CompileSummaryKind) {
    CompileSummaryKind[CompileSummaryKind["Pipe"] = 0] = "Pipe";
    CompileSummaryKind[CompileSummaryKind["Directive"] = 1] = "Directive";
    CompileSummaryKind[CompileSummaryKind["NgModule"] = 2] = "NgModule";
    CompileSummaryKind[CompileSummaryKind["Injectable"] = 3] = "Injectable";
})(CompileSummaryKind = exports.CompileSummaryKind || (exports.CompileSummaryKind = {}));
function tokenName(token) {
    return token.value != null ? _sanitizeIdentifier(token.value) : identifierName(token.identifier);
}
exports.tokenName = tokenName;
function tokenReference(token) {
    if (token.identifier != null) {
        return token.identifier.reference;
    }
    else {
        return token.value;
    }
}
exports.tokenReference = tokenReference;
/**
 * Metadata about a stylesheet
 */
var CompileStylesheetMetadata = (function () {
    function CompileStylesheetMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, moduleUrl = _b.moduleUrl, styles = _b.styles, styleUrls = _b.styleUrls;
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
    return CompileStylesheetMetadata;
}());
exports.CompileStylesheetMetadata = CompileStylesheetMetadata;
/**
 * Metadata regarding compilation of a template.
 */
var CompileTemplateMetadata = (function () {
    function CompileTemplateMetadata(_a) {
        var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline;
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error("'interpolation' should have a start and an end symbol.");
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
    }
    CompileTemplateMetadata.prototype.toSummary = function () {
        return {
            animations: this.animations.map(function (anim) { return anim.name; }),
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation,
        };
    };
    return CompileTemplateMetadata;
}());
exports.CompileTemplateMetadata = CompileTemplateMetadata;
/**
 * Metadata regarding compilation of a directive.
 */
var CompileDirectiveMetadata = (function () {
    function CompileDirectiveMetadata(_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, hostListeners = _a.hostListeners, hostProperties = _a.hostProperties, hostAttributes = _a.hostAttributes, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
    }
    CompileDirectiveMetadata.create = function (_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        var hostListeners = {};
        var hostProperties = {};
        var hostAttributes = {};
        if (host != null) {
            Object.keys(host).forEach(function (key) {
                var value = host[key];
                var matches = key.match(HOST_REG_EXP);
                if (matches === null) {
                    hostAttributes[key] = value;
                }
                else if (matches[1] != null) {
                    hostProperties[matches[1]] = value;
                }
                else if (matches[2] != null) {
                    hostListeners[matches[2]] = value;
                }
            });
        }
        var inputsMap = {};
        if (inputs != null) {
            inputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        var outputsMap = {};
        if (outputs != null) {
            outputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost: isHost,
            type: type,
            isComponent: !!isComponent, selector: selector, exportAs: exportAs, changeDetection: changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners: hostListeners,
            hostProperties: hostProperties,
            hostAttributes: hostAttributes,
            providers: providers,
            viewProviders: viewProviders,
            queries: queries,
            viewQueries: viewQueries,
            entryComponents: entryComponents,
            template: template,
            componentViewType: componentViewType,
            rendererType: rendererType,
            componentFactory: componentFactory,
        });
    };
    CompileDirectiveMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Directive,
            type: this.type,
            isComponent: this.isComponent,
            selector: this.selector,
            exportAs: this.exportAs,
            inputs: this.inputs,
            outputs: this.outputs,
            hostListeners: this.hostListeners,
            hostProperties: this.hostProperties,
            hostAttributes: this.hostAttributes,
            providers: this.providers,
            viewProviders: this.viewProviders,
            queries: this.queries,
            viewQueries: this.viewQueries,
            entryComponents: this.entryComponents,
            changeDetection: this.changeDetection,
            template: this.template && this.template.toSummary(),
            componentViewType: this.componentViewType,
            rendererType: this.rendererType,
            componentFactory: this.componentFactory
        };
    };
    return CompileDirectiveMetadata;
}());
exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
/**
 * Construct {@link CompileDirectiveMetadata} from {@link ComponentTypeMetadata} and a selector.
 */
function createHostComponentMeta(hostTypeReference, compMeta, hostViewType) {
    var template = selector_1.CssSelector.parse(compMeta.selector)[0].getMatchingElementTemplate();
    return CompileDirectiveMetadata.create({
        isHost: true,
        type: { reference: hostTypeReference, diDeps: [], lifecycleHooks: [] },
        template: new CompileTemplateMetadata({
            encapsulation: core_1.ViewEncapsulation.None,
            template: template,
            templateUrl: '',
            styles: [],
            styleUrls: [],
            ngContentSelectors: [],
            animations: [],
            isInline: true,
            externalStylesheets: [],
            interpolation: null
        }),
        exportAs: null,
        changeDetection: core_1.ChangeDetectionStrategy.Default,
        inputs: [],
        outputs: [],
        host: {},
        isComponent: true,
        selector: '*',
        providers: [],
        viewProviders: [],
        queries: [],
        viewQueries: [],
        componentViewType: hostViewType,
        rendererType: { id: '__Host__', encapsulation: core_1.ViewEncapsulation.None, styles: [], data: {} },
        entryComponents: [],
        componentFactory: null
    });
}
exports.createHostComponentMeta = createHostComponentMeta;
var CompilePipeMetadata = (function () {
    function CompilePipeMetadata(_a) {
        var type = _a.type, name = _a.name, pure = _a.pure;
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    CompilePipeMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    };
    return CompilePipeMetadata;
}());
exports.CompilePipeMetadata = CompilePipeMetadata;
/**
 * Metadata regarding compilation of a module.
 */
var CompileNgModuleMetadata = (function () {
    function CompileNgModuleMetadata(_a) {
        var type = _a.type, providers = _a.providers, declaredDirectives = _a.declaredDirectives, exportedDirectives = _a.exportedDirectives, declaredPipes = _a.declaredPipes, exportedPipes = _a.exportedPipes, entryComponents = _a.entryComponents, bootstrapComponents = _a.bootstrapComponents, importedModules = _a.importedModules, exportedModules = _a.exportedModules, schemas = _a.schemas, transitiveModule = _a.transitiveModule, id = _a.id;
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
    }
    CompileNgModuleMetadata.prototype.toSummary = function () {
        var module = this.transitiveModule;
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: module.entryComponents,
            providers: module.providers,
            modules: module.modules,
            exportedDirectives: module.exportedDirectives,
            exportedPipes: module.exportedPipes
        };
    };
    return CompileNgModuleMetadata;
}());
exports.CompileNgModuleMetadata = CompileNgModuleMetadata;
var TransitiveCompileNgModuleMetadata = (function () {
    function TransitiveCompileNgModuleMetadata() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
    }
    TransitiveCompileNgModuleMetadata.prototype.addProvider = function (provider, module) {
        this.providers.push({ provider: provider, module: module });
    };
    TransitiveCompileNgModuleMetadata.prototype.addDirective = function (id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function (id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addPipe = function (id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function (id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addModule = function (id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function (ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
            this.entryComponentsSet.add(ec.componentType);
            this.entryComponents.push(ec);
        }
    };
    return TransitiveCompileNgModuleMetadata;
}());
exports.TransitiveCompileNgModuleMetadata = TransitiveCompileNgModuleMetadata;
function _normalizeArray(obj) {
    return obj || [];
}
var ProviderMeta = (function () {
    function ProviderMeta(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
    return ProviderMeta;
}());
exports.ProviderMeta = ProviderMeta;
function flatten(list) {
    return list.reduce(function (flat, item) {
        var flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
    }, []);
}
exports.flatten = flatten;
function sourceUrl(url) {
    // Note: We need 3 "/" so that ng shows up as a separate domain
    // in the chrome dev tools.
    return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
}
exports.sourceUrl = sourceUrl;
function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
    var url;
    if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof static_symbol_1.StaticSymbol) {
            // Note: a .ts file might contain multiple components with inline templates,
            // so we need to give them unique urls, as these will be used for sourcemaps.
            url = compMeta.type.reference.filePath + "." + compMeta.type.reference.name + ".html";
        }
        else {
            url = identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".html";
        }
    }
    else {
        url = templateMeta.templateUrl;
    }
    // always prepend ng:// to make angular resources easy to find and not clobber
    // user resources.
    return sourceUrl(url);
}
exports.templateSourceUrl = templateSourceUrl;
function sharedStylesheetJitUrl(meta, id) {
    var pathParts = meta.moduleUrl.split(/\/\\/g);
    var baseName = pathParts[pathParts.length - 1];
    return sourceUrl("css/" + id + baseName + ".ngstyle.js");
}
exports.sharedStylesheetJitUrl = sharedStylesheetJitUrl;
function ngModuleJitUrl(moduleMeta) {
    return sourceUrl(identifierName(moduleMeta.type) + "/module.ngfactory.js");
}
exports.ngModuleJitUrl = ngModuleJitUrl;
function templateJitUrl(ngModuleType, compMeta) {
    return sourceUrl(identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".ngfactory.js");
}
exports.templateJitUrl = templateJitUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb21waWxlX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHNDQUF5SjtBQUV6SixxREFBaUQ7QUFFakQsdUNBQXVDO0FBQ3ZDLCtCQUFvQztBQUlwQywyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBQ2hDLGtDQUFrQztBQUNsQyxzQ0FBc0M7QUFDdEMsSUFBTSxZQUFZLEdBQUcsb0RBQW9ELENBQUM7QUFFMUU7SUFDRSx1Q0FDVyxJQUF3QixFQUN4QixXQUF3RDtRQUR4RCxxQkFBQSxFQUFBLFdBQXdCO1FBQ3hCLDRCQUFBLEVBQUEsa0JBQXdEO1FBRHhELFNBQUksR0FBSixJQUFJLENBQW9CO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUE2QztJQUFHLENBQUM7SUFDekUsb0NBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHNFQUE2QjtBQU0xQztJQUFBO0lBQXFELENBQUM7SUFBRCxvQ0FBQztBQUFELENBQUMsQUFBdEQsSUFBc0Q7QUFBaEMsc0VBQTZCO0FBRW5EO0lBQThELDREQUE2QjtJQUN6RixrREFBbUIsYUFBcUIsRUFBUyxNQUFxQztRQUF0RixZQUNFLGlCQUFPLFNBQ1I7UUFGa0IsbUJBQWEsR0FBYixhQUFhLENBQVE7UUFBUyxZQUFNLEdBQU4sTUFBTSxDQUErQjs7SUFFdEYsQ0FBQztJQUNILCtDQUFDO0FBQUQsQ0FBQyxBQUpELENBQThELDZCQUE2QixHQUkxRjtBQUpZLDRGQUF3QztBQU1yRDtJQUE2RCwyREFBNkI7SUFDeEYsaURBQ1csZUFBa0YsRUFDbEYsS0FBK0I7UUFGMUMsWUFHRSxpQkFBTyxTQUNSO1FBSFUscUJBQWUsR0FBZixlQUFlLENBQW1FO1FBQ2xGLFdBQUssR0FBTCxLQUFLLENBQTBCOztJQUUxQyxD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