"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var compile_reflector_1 = require("../compile_reflector");
var expression_converter_1 = require("../compiler_util/expression_converter");
var config_1 = require("../config");
var identifiers_1 = require("../identifiers");
var injectable_1 = require("../injectable");
var lifecycle_reflector_1 = require("../lifecycle_reflector");
var tags_1 = require("../ml_parser/tags");
var o = require("../output/output_ast");
var value_util_1 = require("../output/value_util");
var element_schema_registry_1 = require("../schema/element_schema_registry");
var template_ast_1 = require("../template_parser/template_ast");
var provider_compiler_1 = require("./provider_compiler");
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var NG_CONTAINER_TAG = 'ng-container';
var ViewCompileResult = (function () {
    function ViewCompileResult(viewClassVar, rendererTypeVar) {
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
    return ViewCompileResult;
}());
exports.ViewCompileResult = ViewCompileResult;
var ViewCompiler = (function () {
    function ViewCompiler(_config, _reflector, _schemaRegistry) {
        this._config = _config;
        this._reflector = _reflector;
        this._schemaRegistry = _schemaRegistry;
    }
    ViewCompiler.prototype.compileComponent = function (outputCtx, component, template, styles, usedPipes) {
        var _this = this;
        var embeddedViewCount = 0;
        var staticQueryIds = findStaticQueryIds(template);
        var renderComponentVarName = undefined;
        if (!component.isHost) {
            var template_1 = component.template;
            var customRenderData = [];
            if (template_1.animations && template_1.animations.length) {
                customRenderData.push(new o.LiteralMapEntry('animation', value_util_1.convertValueToOutputAst(outputCtx, template_1.animations), true));
            }
            var renderComponentVar = o.variable(compile_metadata_1.rendererTypeName(component.type.reference));
            renderComponentVarName = renderComponentVar.name;
            outputCtx.statements.push(renderComponentVar
                .set(o.importExpr(identifiers_1.Identifiers.createRendererType2).callFn([new o.LiteralMapExpr([
                    new o.LiteralMapEntry('encapsulation', o.literal(template_1.encapsulation), false),
                    new o.LiteralMapEntry('styles', styles, false),
                    new o.LiteralMapEntry('data', new o.LiteralMapExpr(customRenderData), false)
                ])]))
                .toDeclStmt(o.importType(identifiers_1.Identifiers.RendererType2), [o.StmtModifier.Final, o.StmtModifier.Exported]));
        }
        var viewBuilderFactory = function (parent) {
            var embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(_this._reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        var visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        (_a = outputCtx.statements).push.apply(_a, visitor.build());
        return new ViewCompileResult(visitor.viewName, renderComponentVarName);
        var _a;
    };
    return ViewCompiler;
}());
ViewCompiler = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [config_1.CompilerConfig, compile_reflector_1.CompileReflector,
        element_schema_registry_1.ElementSchemaRegistry])
], ViewCompiler);
exports.ViewCompiler = ViewCompiler;
var LOG_VAR = o.variable('_l');
var VIEW_VAR = o.variable('_v');
var CHECK_VAR = o.variable('_ck');
var COMP_VAR = o.variable('_co');
var EVENT_NAME_VAR = o.variable('en');
var ALLOW_DEFAULT_VAR = o.variable("ad");
var ViewBuilder = (function () {
    function ViewBuilder(reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
        this.reflector = reflector;
        this.outputCtx = outputCtx;
        this.parent = parent;
        this.component = component;
        this.embeddedViewIndex = embeddedViewIndex;
        this.usedPipes = usedPipes;
        this.staticQueryIds = staticQueryIds;
        this.viewBuilderFactory = viewBuilderFactory;
        this.nodes = [];
        this.purePipeNodeIndices = Object.create(null);
        // Need Object.create so that we don't have builtin values...
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        // TODO(tbosch): The old view compiler used to use an `any` type
        // for the context in any embedded view. We keep this behaivor for now
        // to be able to introduce the new view compiler without too many errors.
        this.compType = this.embeddedViewIndex > 0 ?
            o.DYNAMIC_TYPE :
            o.expressionType(outputCtx.importExpr(this.component.type.reference));
    }
    Object.defineProperty(ViewBuilder.prototype, "viewName", {
        get: function () {
            return compile_metadata_1.viewClassName(this.component.type.reference, this.embeddedViewIndex);
        },
        enumerable: true,
        configurable: true
    });
    ViewBuilder.prototype.visitAll = function (variables, astNodes) {
        var _this = this;
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach(function (pipe) {
                if (pipe.pure) {
                    _this.purePipeNodeIndices[pipe.name] = _this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            var queryIds_1 = staticViewQueryIds(this.staticQueryIds);
            this.component.viewQueries.forEach(function (query, queryIndex) {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                var queryId = queryIndex + 1;
                var bindingType = query.first ? 0 /* First */ : 1 /* All */;
                var flags = 134217728 /* TypeViewQuery */ | calcStaticDynamicQueryFlags(queryIds_1, queryId, query.first);
                _this.nodes.push(function () { return ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: o.importExpr(identifiers_1.Identifiers.queryDef).callFn([
                        o.literal(flags), o.literal(queryId),
                        new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                    ])
                }); });
            });
        }
        template_ast_1.templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(function () { return ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: o.importExpr(identifiers_1.Identifiers.anchorDef).callFn([
                    o.literal(0 /* None */), o.NULL_EXPR, o.NULL_EXPR, o.literal(0)
                ])
            }); });
        }
    };
    ViewBuilder.prototype.build = function (targetStatements) {
        if (targetStatements === void 0) { targetStatements = []; }
        this.children.forEach(function (child) { return child.build(targetStatements); });
        var _a = this._createNodeExpressions(), updateRendererStmts = _a.updateRendererStmts, updateDirectivesStmts = _a.updateDirectivesStmts, nodeDefExprs = _a.nodeDefExprs;
        var updateRendererFn = this._createUpdateFn(updateRendererStmts);
        var updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        var viewFlags = 0 /* None */;
        if (!this.parent && this.component.changeDetection === core_1.ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        var viewFactory = new o.DeclareFunctionStmt(this.viewName, [new o.FnParam(LOG_VAR.name)], [new o.ReturnStatement(o.importExpr(identifiers_1.Identifiers.viewDef).callFn([
                o.literal(viewFlags),
                o.literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], o.importType(identifiers_1.Identifiers.ViewDefinition), this.embeddedViewIndex === 0 ? [o.StmtModifier.Exported] : []);
        targetStatements.push(viewFactory);
        return targetStatements;
    };
    ViewBuilder.prototype._createUpdateFn = function (updateStmts) {
        var updateFn;
        if (updateStmts.length > 0) {
            var preStmts = [];
            if (!this.component.isHost && o.findReadVarNames(updateStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = o.fn([
                new o.FnParam(CHECK_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE)
            ], preStmts.concat(updateStmts), o.INFERRED_TYPE);
        }
        else {
            updateFn = o.NULL_EXPR;
        }
        return updateFn;
    };
    ViewBuilder.prototype.visitNgContent = function (ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.ngContentDef).callFn([
                o.literal(ast.ngContentIndex), o.literal(ast.index)
            ])
        }); });
    };
    ViewBuilder.prototype.visitText = function (ast, context) {
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.textDef).callFn([
                o.literal(ast.ngContentIndex), o.literalArr([o.literal(ast.value)])
            ])
        }); });
    };
    ViewBuilder.prototype.visitBoundText = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        var astWithSource = ast.value;
        var inter = astWithSource.ast;
        var updateRendererExpressions = inter.expressions.map(function (expr, bindingIndex) { return _this._preprocessUpdateExpression({ nodeIndex: nodeIndex, bindingIndex: bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }); });
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.textDef).callFn([
                o.literal(ast.ngContentIndex), o.literalArr(inter.strings.map(function (s) { return o.literal(s); }))
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    ViewBuilder.prototype.visitEmbeddedTemplate = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, queryMatchesExpr = _a.queryMatchesExpr, hostEvents = _a.hostEvents;
        var childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(identifiers_1.Identifiers.anchorDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                o.variable(childVisitor.viewName),
            ])
        }); };
    };
    ViewBuilder.prototype.visitElement = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        // Using a null element name creates an anchor.
        var elName = tags_1.isNgContainer(ast.name) ? null : ast.name;
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, usedEvents = _a.usedEvents, queryMatchesExpr = _a.queryMatchesExpr, dirHostBindings = _a.hostBindings, hostEvents = _a.hostEvents;
        var inputDefs = [];
        var updateRendererExpressions = [];
        var outputDefs = [];
        if (elName) {
            var hostBindings = ast.inputs
                .map(function (inputAst) { return ({
                context: COMP_VAR,
                inputAst: inputAst,
                dirAst: null,
            }); })
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map(function (hostBinding, bindingIndex) { return _this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex: nodeIndex,
                        bindingIndex: bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }); });
                inputDefs = hostBindings.map(function (hostBinding) { return elementBindingDef(hostBinding.inputAst, hostBinding.dirAst); });
            }
            outputDefs = usedEvents.map(function (_a) {
                var target = _a[0], eventName = _a[1];
                return o.literalArr([o.literal(target), o.literal(eventName)]);
            });
        }
        template_ast_1.templateVisitAll(this, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        var compAst = ast.directives.find(function (dirAst) { return dirAst.directive.isComponent; });
        var compRendererType = o.NULL_EXPR;
        var compView = o.NULL_EXPR;
        if (compAst) {
            compView = this.outputCtx.importExpr(compAst.directive.componentViewType);
            compRendererType = this.outputCtx.importExpr(compAst.directive.rendererType);
        }
        // elementDef(
        //   flags: NodeFlags, matchedQueriesDsl: [string | number, QueryValueType][],
        //   ngContentIndex: number, childCount: number, namespaceAndName: string,
        //   fixedAttrs: [string, string][] = [],
        //   bindings?: [BindingFlags, string, string | SecurityContext][],
        //   outputs?: ([OutputType.ElementOutput | OutputType.DirectiveHostOutput, string, string])[],
        //   handleEvent?: ElementHandleEventFn,
        //   componentView?: () => ViewDefinition, componentRendererType?: RendererType2): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(identifiers_1.Identifiers.elementDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                o.literal(elName),
                elName ? fixedAttrsDef(ast) : o.NULL_EXPR,
                inputDefs.length ? o.literalArr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? o.literalArr(outputDefs) : o.NULL_EXPR,
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    ViewBuilder.prototype._visitElementOrTemplate = function (nodeIndex, ast) {
        var _this = this;
        var flags = 0 /* None */;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        var usedEvents = new Map();
        ast.outputs.forEach(function (event) {
            var _a = elementEventNameAndTarget(event, null), name = _a.name, target = _a.target;
            usedEvents.set(core_1.ɵelementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach(function (dirAst) {
            dirAst.hostEvents.forEach(function (event) {
                var _a = elementEventNameAndTarget(event, dirAst), name = _a.name, target = _a.target;
                usedEvents.set(core_1.ɵelementEventFullName(target, name), [target, name]);
            });
        });
        var hostBindings = [];
        var hostEvents = [];
        this._visitComponentFactoryResolverProvider(ast.directives);
        ast.providers.forEach(function (providerAst, providerIndex) {
            var dirAst = undefined;
            var dirIndex = undefined;
            ast.directives.forEach(function (localDirAst, i) {
                if (localDirAst.directive.type.reference === compile_metadata_1.tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                    dirIndex = i;
                }
            });
            if (dirAst) {
                var _a = _this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, _this.staticQueryIds.get(ast)), dirHostBindings = _a.hostBindings, dirHostEvents = _a.hostEvents;
                hostBindings.push.apply(hostBindings, dirHostBindings);
                hostEvents.push.apply(hostEvents, dirHostEvents);
            }
            else {
                _this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        var queryMatchExprs = [];
        ast.queryMatches.forEach(function (match) {
            var valueType = undefined;
            if (compile_metadata_1.tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(identifiers_1.Identifiers.ElementRef)) {
                valueType = 0 /* ElementRef */;
            }
            else if (compile_metadata_1.tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(identifiers_1.Identifiers.ViewContainerRef)) {
                valueType = 3 /* ViewContainerRef */;
            }
            else if (compile_metadata_1.tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(identifiers_1.Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(valueType)]));
            }
        });
        ast.references.forEach(function (ref) {
            var valueType = undefined;
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (compile_metadata_1.tokenReference(ref.value) ===
                _this.reflector.resolveExternalReference(identifiers_1.Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(valueType)]));
            }
        });
        ast.outputs.forEach(function (outputAst) {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: null });
        });
        return {
            flags: flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
            hostBindings: hostBindings,
            hostEvents: hostEvents
        };
    };
    ViewBuilder.prototype._visitDirective = function (providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        dirAst.directive.queries.forEach(function (query, queryIndex) {
            var queryId = dirAst.contentQueryStartId + queryIndex;
            var flags = 67108864 /* TypeContentQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
            var bindingType = query.first ? 0 /* First */ : 1 /* All */;
            _this.nodes.push(function () { return ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: o.importExpr(identifiers_1.Identifiers.queryDef).callFn([
                    o.literal(flags), o.literal(queryId),
                    new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                ]),
            }); });
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        var childCount = this.nodes.length - nodeIndex - 1;
        var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
        refs.forEach(function (ref) {
            if (ref.value && compile_metadata_1.tokenReference(ref.value) === compile_metadata_1.tokenReference(providerAst.token)) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        var inputDefs = dirAst.inputs.map(function (inputAst, inputIndex) {
            var mapValue = o.literalArr([o.literal(inputIndex), o.literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new o.LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        var outputDefs = [];
        var dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach(function (propName) {
            var eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new o.LiteralMapEntry(propName, o.literal(eventName), false));
            }
        });
        var updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map(function (input, bindingIndex) { return _this._preprocessUpdateExpression({
                    nodeIndex: nodeIndex,
                    bindingIndex: bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }); });
        }
        var dirContextExpr = o.importExpr(identifiers_1.Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
        var hostBindings = dirAst.hostProperties.map(function (inputAst) { return ({
            context: dirContextExpr,
            dirAst: dirAst,
            inputAst: inputAst,
        }); });
        var hostEvents = dirAst.hostEvents.map(function (hostEventAst) { return ({
            context: dirContextExpr,
            eventAst: hostEventAst, dirAst: dirAst,
        }); });
        // directiveDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], childCount: number, ctor:
        //   any,
        //   deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
        //   outputs?: {[name: string]: string}, component?: () => ViewDefinition): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 /* TypeDirective */ | flags,
            nodeDef: o.importExpr(identifiers_1.Identifiers.directiveDef).callFn([
                o.literal(flags), queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
                o.literal(childCount), providerExpr, depsExpr,
                inputDefs.length ? new o.LiteralMapExpr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? new o.LiteralMapExpr(outputDefs) : o.NULL_EXPR
            ]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type,
        }); };
        return { hostBindings: hostBindings, hostEvents: hostEvents };
    };
    ViewBuilder.prototype._visitProvider = function (providerAst, queryMatches) {
        this._addProviderNode(this._visitProviderOrDirective(providerAst, queryMatches));
    };
    ViewBuilder.prototype._visitComponentFactoryResolverProvider = function (directives) {
        var componentDirMeta = directives.find(function (dirAst) { return dirAst.directive.isComponent; });
        if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
            var _a = provider_compiler_1.componentFactoryResolverProviderDef(this.reflector, this.outputCtx, 8192 /* PrivateProvider */, componentDirMeta.directive.entryComponents), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, flags = _a.flags, tokenExpr = _a.tokenExpr;
            this._addProviderNode({
                providerExpr: providerExpr,
                depsExpr: depsExpr,
                flags: flags,
                tokenExpr: tokenExpr,
                queryMatchExprs: [],
                sourceSpan: componentDirMeta.sourceSpan
            });
        }
    };
    ViewBuilder.prototype._addProviderNode = function (data) {
        var nodeIndex = this.nodes.length;
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: data.sourceSpan,
            nodeFlags: data.flags,
            nodeDef: o.importExpr(identifiers_1.Identifiers.providerDef).callFn([
                o.literal(data.flags),
                data.queryMatchExprs.length ? o.literalArr(data.queryMatchExprs) : o.NULL_EXPR,
                data.tokenExpr, data.providerExpr, data.depsExpr
            ])
        }); });
    };
    ViewBuilder.prototype._visitProviderOrDirective = function (providerAst, queryMatches) {
        var flags = 0 /* None */;
        var queryMatchExprs = [];
        queryMatches.forEach(function (match) {
            if (compile_metadata_1.tokenReference(match.value) === compile_metadata_1.tokenReference(providerAst.token)) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(4 /* Provider */)]));
            }
        });
        var _a = provider_compiler_1.providerDef(this.outputCtx, providerAst), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, providerFlags = _a.flags, tokenExpr = _a.tokenExpr;
        return {
            flags: flags | providerFlags,
            queryMatchExprs: queryMatchExprs,
            providerExpr: providerExpr,
            depsExpr: depsExpr,
            tokenExpr: tokenExpr,
            sourceSpan: providerAst.sourceSpan
        };
    };
    ViewBuilder.prototype.getLocal = function (name) {
        if (name == expression_converter_1.EventHandlerVars.event.name) {
            return expression_converter_1.EventHandlerVars.event;
        }
        var currViewExpr = VIEW_VAR;
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(o.DYNAMIC_TYPE)) {
            // check references
            var refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return o.importExpr(identifiers_1.Identifiers.nodeValue).callFn([currViewExpr, o.literal(refNodeIndex)]);
            }
            // check variables
            var varAst = currBuilder.variables.find(function (varAst) { return varAst.name === name; });
            if (varAst) {
                var varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                return currViewExpr.prop('context').prop(varValue);
            }
        }
        return null;
    };
    ViewBuilder.prototype.createLiteralArrayConverter = function (sourceSpan, argCount) {
        if (argCount === 0) {
            var valueExpr_1 = o.importExpr(identifiers_1.Identifiers.EMPTY_ARRAY);
            return function () { return valueExpr_1; };
        }
        var nodeIndex = this.nodes.length;
        // pureArrayDef(argCount: number): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.pureArrayDef).callFn([o.literal(argCount)])
        }); });
        return function (args) { return callCheckStmt(nodeIndex, args); };
    };
    ViewBuilder.prototype.createLiteralMapConverter = function (sourceSpan, keys) {
        if (keys.length === 0) {
            var valueExpr_2 = o.importExpr(identifiers_1.Identifiers.EMPTY_MAP);
            return function () { return valueExpr_2; };
        }
        // function pureObjectDef(propToIndex: {[p: string]: number}): NodeDef
        var map = o.literalMap(keys.map(function (e, i) { return (__assign({}, e, { value: o.literal(i) })); }));
        var nodeIndex = this.nodes.length;
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.pureObjectDef).callFn([map])
        }); });
        return function (args) { return callCheckStmt(nodeIndex, args); };
    };
    ViewBuilder.prototype.createPipeConverter = function (expression, name, argCount) {
        var pipe = this.usedPipes.find(function (pipeSummary) { return pipeSummary.name === name; });
        if (pipe.pure) {
            var nodeIndex_1 = this.nodes.length;
            // function purePipeDef(argCount: number): NodeDef;
            this.nodes.push(function () { return ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: o.importExpr(identifiers_1.Identifiers.purePipeDef).callFn([o.literal(argCount)])
            }); });
            // find underlying pipe in the component view
            var compViewExpr = VIEW_VAR;
            var compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(o.DYNAMIC_TYPE);
            }
            var pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            var pipeValueExpr_1 = o.importExpr(identifiers_1.Identifiers.nodeValue).callFn([compViewExpr, o.literal(pipeNodeIndex)]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(nodeIndex_1, [pipeValueExpr_1].concat(args))); };
        }
        else {
            var nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            var nodeValueExpr_1 = o.importExpr(identifiers_1.Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr_1.callMethod('transform', args)); };
        }
    };
    ViewBuilder.prototype._createPipe = function (sourceSpan, pipe) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        var flags = 0 /* None */;
        pipe.type.lifecycleHooks.forEach(function (lifecycleHook) {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === lifecycle_reflector_1.LifecycleHooks.OnDestroy) {
                flags |= provider_compiler_1.lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        var depExprs = pipe.type.diDeps.map(function (diDep) { return provider_compiler_1.depDef(_this.outputCtx, diDep); });
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: o.importExpr(identifiers_1.Identifiers.pipeDef).callFn([
                o.literal(flags), _this.outputCtx.importExpr(pipe.type.reference), o.literalArr(depExprs)
            ])
        }); });
        return nodeIndex;
    };
    // Attention: This might create new nodeDefs (for pipes and literal arrays and literal maps)!
    ViewBuilder.prototype._preprocessUpdateExpression = function (expression) {
        var _this = this;
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: expression_converter_1.convertPropertyBindingBuiltins({
                createLiteralArrayConverter: function (argCount) { return _this.createLiteralArrayConverter(expression.sourceSpan, argCount); },
                createLiteralMapConverter: function (keys) {
                    return _this.createLiteralMapConverter(expression.sourceSpan, keys);
                },
                createPipeConverter: function (name, argCount) {
                    return _this.createPipeConverter(expression, name, argCount);
                }
            }, expression.value)
        };
    };
    ViewBuilder.prototype._createNodeExpressions = function () {
        var self = this;
        var updateBindingCount = 0;
        var updateRendererStmts = [];
        var updateDirectivesStmts = [];
        var nodeDefExprs = this.nodes.map(function (factory, nodeIndex) {
            var _a = factory(), nodeDef = _a.nodeDef, nodeFlags = _a.nodeFlags, updateDirectives = _a.updateDirectives, updateRenderer = _a.updateRenderer, sourceSpan = _a.sourceSpan;
            if (updateRenderer) {
                updateRendererStmts.push.apply(updateRendererStmts, createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push.apply(updateDirectivesStmts, createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            var logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new o.CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return o.applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts: updateRendererStmts, updateDirectivesStmts: updateDirectivesStmts, nodeDefExprs: nodeDefExprs };
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            var updateStmts = [];
            var exprs = expressions.map(function (_a) {
                var sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
                var bindingId = "" + updateBindingCount++;
                var nameResolver = context === COMP_VAR ? self : null;
                var _b = expression_converter_1.convertPropertyBinding(nameResolver, context, value, bindingId), stmts = _b.stmts, currValExpr = _b.currValExpr;
                updateStmts.push.apply(updateStmts, stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
                return o.applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(o.applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    };
    ViewBuilder.prototype._createElementHandleEventFn = function (nodeIndex, handlers) {
        var _this = this;
        var handleEventStmts = [];
        var handleEventBindingCount = 0;
        handlers.forEach(function (_a) {
            var context = _a.context, eventAst = _a.eventAst, dirAst = _a.dirAst;
            var bindingId = "" + handleEventBindingCount++;
            var nameResolver = context === COMP_VAR ? _this : null;
            var _b = expression_converter_1.convertActionBinding(nameResolver, context, eventAst.handler, bindingId), stmts = _b.stmts, allowDefault = _b.allowDefault;
            var trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            var _c = elementEventNameAndTarget(eventAst, dirAst), eventTarget = _c.target, eventName = _c.name;
            var fullEventName = core_1.ɵelementEventFullName(eventTarget, eventName);
            handleEventStmts.push(o.applySourceSpanToStatementIfNeeded(new o.IfStmt(o.literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        var handleEventFn;
        if (handleEventStmts.length > 0) {
            var preStmts = [ALLOW_DEFAULT_VAR.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE)];
            if (!this.component.isHost && o.findReadVarNames(handleEventStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = o.fn([
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(EVENT_NAME_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(expression_converter_1.EventHandlerVars.event.name, o.INFERRED_TYPE)
            ], preStmts.concat(handleEventStmts, [new o.ReturnStatement(ALLOW_DEFAULT_VAR)]), o.INFERRED_TYPE);
        }
        else {
            handleEventFn = o.NULL_EXPR;
        }
        return handleEventFn;
    };
    ViewBuilder.prototype.visitDirective = function (ast, context) { };
    ViewBuilder.prototype.visitDirectiveProperty = function (ast, context) { };
    ViewBuilder.prototype.visitReference = function (ast, context) { };
    ViewBuilder.prototype.visitVariable = function (ast, context) { };
    ViewBuilder.prototype.visitEvent = function (ast, context) { };
    ViewBuilder.prototype.visitElementProperty = function (ast, context) { };
    ViewBuilder.prototype.visitAttr = function (ast, context) { };
    return ViewBuilder;
}());
function needsAdditionalRootNode(astNodes) {
    var lastAstNode = astNodes[astNodes.length - 1];
    if (lastAstNode instanceof template_ast_1.EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
    }
    if (lastAstNode instanceof template_ast_1.ElementAst) {
        if (tags_1.isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
            return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
    }
    return lastAstNode instanceof template_ast_1.NgContentAst;
}
function elementBindingDef(inputAst, dirAst) {
    switch (inputAst.type) {
        case template_ast_1.PropertyBindingType.Attribute:
            return o.literalArr([
                o.literal(1 /* TypeElementAttribute */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case template_ast_1.PropertyBindingType.Property:
            return o.literalArr([
                o.literal(8 /* TypeProperty */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case template_ast_1.PropertyBindingType.Animation:
            var bindingType = 8 /* TypeProperty */ |
                (dirAst && dirAst.directive.isComponent ? 32 /* SyntheticHostProperty */ :
                    16 /* SyntheticProperty */);
            return o.literalArr([
                o.literal(bindingType), o.literal('@' + inputAst.name), o.literal(inputAst.securityContext)
            ]);
        case template_ast_1.PropertyBindingType.Class:
            return o.literalArr([o.literal(2 /* TypeElementClass */), o.literal(inputAst.name), o.NULL_EXPR]);
        case template_ast_1.PropertyBindingType.Style:
            return o.literalArr([
                o.literal(4 /* TypeElementStyle */), o.literal(inputAst.name), o.literal(inputAst.unit)
            ]);
    }
}
function fixedAttrsDef(elementAst) {
    var mapResult = Object.create(null);
    elementAst.attrs.forEach(function (attrAst) { mapResult[attrAst.name] = attrAst.value; });
    elementAst.directives.forEach(function (dirAst) {
        Object.keys(dirAst.directive.hostAttributes).forEach(function (name) {
            var value = dirAst.directive.hostAttributes[name];
            var prevValue = mapResult[name];
            mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return o.literalArr(Object.keys(mapResult).sort().map(function (attrName) { return o.literalArr([o.literal(attrName), o.literal(mapResult[attrName])]); }));
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
    }
    else {
        return attrValue2;
    }
}
function callCheckStmt(nodeIndex, exprs) {
    if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(1 /* Dynamic */), o.literalArr(exprs)]);
    }
    else {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(0 /* Inline */)].concat(exprs));
    }
}
function callUnwrapValue(nodeIndex, bindingIdx, expr) {
    return o.importExpr(identifiers_1.Identifiers.unwrapValue).callFn([
        VIEW_VAR, o.literal(nodeIndex), o.literal(bindingIdx), expr
    ]);
}
function findStaticQueryIds(nodes, result) {
    if (result === void 0) { result = new Map(); }
    nodes.forEach(function (node) {
        var staticQueryIds = new Set();
        var dynamicQueryIds = new Set();
        var queryMatches = undefined;
        if (node instanceof template_ast_1.ElementAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach(function (child) {
                var childData = result.get(child);
                childData.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
                childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
            });
            queryMatches = node.queryMatches;
        }
        else if (node instanceof template_ast_1.EmbeddedTemplateAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach(function (child) {
                var childData = result.get(child);
                childData.staticQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
                childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
            });
            queryMatches = node.queryMatches;
        }
        if (queryMatches) {
            queryMatches.forEach(function (match) { return staticQueryIds.add(match.queryId); });
        }
        dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
        result.set(node, { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds });
    });
    return result;
}
function staticViewQueryIds(nodeStaticQueryIds) {
    var staticQueryIds = new Set();
    var dynamicQueryIds = new Set();
    Array.from(nodeStaticQueryIds.values()).forEach(function (entry) {
        entry.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
        entry.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
    });
    dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
    return { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds };
}
function elementEventNameAndTarget(eventAst, dirAst) {
    if (eventAst.isAnimation) {
        return {
            name: "@" + eventAst.name + "." + eventAst.phase,
            target: dirAst && dirAst.directive.isComponent ? 'component' : null
        };
    }
    else {
        return eventAst;
    }
}
function calcStaticDynamicQueryFlags(queryIds, queryId, isFirst) {
    var flags = 0 /* None */;
    // Note: We only make queries static that query for a single item.
    // This is because of backwards compatibility with the old view compiler...
    if (isFirst && (queryIds.staticQueryIds.has(queryId) || !queryIds.dynamicQueryIds.has(queryId))) {
        flags |= 268435456 /* StaticQuery */;
    }
    else {
        flags |= 536870912 /* DynamicQuery */;
    }
    return flags;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFzVDtBQUV0VCx3REFBbU87QUFDbk8sMERBQXNEO0FBQ3RELDhFQUFzTDtBQUN0TCxvQ0FBeUM7QUFFekMsOENBQTJDO0FBQzNDLDRDQUFpRDtBQUNqRCw4REFBc0Q7QUFDdEQsMENBQWdEO0FBQ2hELHdDQUEwQztBQUMxQyxtREFBNkQ7QUFFN0QsNkVBQXdFO0FBQ3hFLGdFQUE0VjtBQUc1Vix5REFBc0g7QUFFdEgsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQzNCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQixJQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQztBQUMzQyxJQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztBQUV4QztJQUNFLDJCQUFtQixZQUFvQixFQUFTLGVBQXVCO1FBQXBELGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQVE7SUFBRyxDQUFDO0lBQzdFLHdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw4Q0FBaUI7QUFLOUIsSUFBYSxZQUFZO0lBQ3ZCLHNCQUNZLE9BQXVCLEVBQVUsVUFBNEIsRUFDN0QsZUFBc0M7UUFEdEMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUM3RCxvQkFBZSxHQUFmLGVBQWUsQ0FBdUI7SUFBRyxDQUFDO0lBRXRELHVDQUFnQixHQUFoQixVQUNJLFNBQXdCLEVBQUUsU0FBbUMsRUFBRSxRQUF1QixFQUN0RixNQUFvQixFQUFFLFNBQStCO1FBRnpELGlCQTBDQztRQXZDQyxJQUFJLGlCQUFp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