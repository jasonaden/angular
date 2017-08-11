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
import { ChangeDetectionStrategy, ɵelementEventFullName as elementEventFullName } from '@angular/core';
import { rendererTypeName, tokenReference, viewClassName } from '../compile_metadata';
import { CompileReflector } from '../compile_reflector';
import { EventHandlerVars, convertActionBinding, convertPropertyBinding, convertPropertyBindingBuiltins } from '../compiler_util/expression_converter';
import { CompilerConfig } from '../config';
import { Identifiers } from '../identifiers';
import { CompilerInjectable } from '../injectable';
import { LifecycleHooks } from '../lifecycle_reflector';
import { isNgContainer } from '../ml_parser/tags';
import * as o from '../output/output_ast';
import { convertValueToOutputAst } from '../output/value_util';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { ElementAst, EmbeddedTemplateAst, NgContentAst, PropertyBindingType, templateVisitAll } from '../template_parser/template_ast';
import { componentFactoryResolverProviderDef, depDef, lifecycleHookToNodeFlag, providerDef } from './provider_compiler';
const /** @type {?} */ CLASS_ATTR = 'class';
const /** @type {?} */ STYLE_ATTR = 'style';
const /** @type {?} */ IMPLICIT_TEMPLATE_VAR = '\$implicit';
const /** @type {?} */ NG_CONTAINER_TAG = 'ng-container';
export class ViewCompileResult {
    /**
     * @param {?} viewClassVar
     * @param {?} rendererTypeVar
     */
    constructor(viewClassVar, rendererTypeVar) {
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
}
function ViewCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewCompileResult.prototype.viewClassVar;
    /** @type {?} */
    ViewCompileResult.prototype.rendererTypeVar;
}
export class ViewCompiler {
    /**
     * @param {?} _config
     * @param {?} _reflector
     * @param {?} _schemaRegistry
     */
    constructor(_config, _reflector, _schemaRegistry) {
        this._config = _config;
        this._reflector = _reflector;
        this._schemaRegistry = _schemaRegistry;
    }
    /**
     * @param {?} outputCtx
     * @param {?} component
     * @param {?} template
     * @param {?} styles
     * @param {?} usedPipes
     * @return {?}
     */
    compileComponent(outputCtx, component, template, styles, usedPipes) {
        let /** @type {?} */ embeddedViewCount = 0;
        const /** @type {?} */ staticQueryIds = findStaticQueryIds(template);
        let /** @type {?} */ renderComponentVarName = ((undefined));
        if (!component.isHost) {
            const /** @type {?} */ template = ((component.template));
            const /** @type {?} */ customRenderData = [];
            if (template.animations && template.animations.length) {
                customRenderData.push(new o.LiteralMapEntry('animation', convertValueToOutputAst(outputCtx, template.animations), true));
            }
            const /** @type {?} */ renderComponentVar = o.variable(rendererTypeName(component.type.reference));
            renderComponentVarName = ((renderComponentVar.name));
            outputCtx.statements.push(renderComponentVar
                .set(o.importExpr(Identifiers.createRendererType2).callFn([new o.LiteralMapExpr([
                    new o.LiteralMapEntry('encapsulation', o.literal(template.encapsulation), false),
                    new o.LiteralMapEntry('styles', styles, false),
                    new o.LiteralMapEntry('data', new o.LiteralMapExpr(customRenderData), false)
                ])]))
                .toDeclStmt(o.importType(Identifiers.RendererType2), [o.StmtModifier.Final, o.StmtModifier.Exported]));
        }
        const /** @type {?} */ viewBuilderFactory = (parent) => {
            const /** @type {?} */ embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(this._reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        const /** @type {?} */ visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        outputCtx.statements.push(...visitor.build());
        return new ViewCompileResult(visitor.viewName, renderComponentVarName);
    }
}
ViewCompiler.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
ViewCompiler.ctorParameters = () => [
    { type: CompilerConfig, },
    { type: CompileReflector, },
    { type: ElementSchemaRegistry, },
];
function ViewCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewCompiler.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ViewCompiler.ctorParameters;
    /** @type {?} */
    ViewCompiler.prototype._config;
    /** @type {?} */
    ViewCompiler.prototype._reflector;
    /** @type {?} */
    ViewCompiler.prototype._schemaRegistry;
}
/**
 * @record
 */
function ViewBuilderFactory() { }
function ViewBuilderFactory_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (parent: ViewBuilder): ViewBuilder;
    */
}
/**
 * @record
 */
function UpdateExpression() { }
function UpdateExpression_tsickle_Closure_declarations() {
    /** @type {?} */
    UpdateExpression.prototype.context;
    /** @type {?} */
    UpdateExpression.prototype.nodeIndex;
    /** @type {?} */
    UpdateExpression.prototype.bindingIndex;
    /** @type {?} */
    UpdateExpression.prototype.sourceSpan;
    /** @type {?} */
    UpdateExpression.prototype.value;
}
const /** @type {?} */ LOG_VAR = o.variable('_l');
const /** @type {?} */ VIEW_VAR = o.variable('_v');
const /** @type {?} */ CHECK_VAR = o.variable('_ck');
const /** @type {?} */ COMP_VAR = o.variable('_co');
const /** @type {?} */ EVENT_NAME_VAR = o.variable('en');
const /** @type {?} */ ALLOW_DEFAULT_VAR = o.variable(`ad`);
class ViewBuilder {
    /**
     * @param {?} reflector
     * @param {?} outputCtx
     * @param {?} parent
     * @param {?} component
     * @param {?} embeddedViewIndex
     * @param {?} usedPipes
     * @param {?} staticQueryIds
     * @param {?} viewBuilderFactory
     */
    constructor(reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
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
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        // TODO(tbosch): The old view compiler used to use an `any` type
        // for the context in any embedded view. We keep this behaivor for now
        // to be able to introduce the new view compiler without too many errors.
        this.compType = this.embeddedViewIndex > 0 ?
            o.DYNAMIC_TYPE : ((o.expressionType(outputCtx.importExpr(this.component.type.reference))));
    }
    /**
     * @return {?}
     */
    get viewName() {
        return viewClassName(this.component.type.reference, this.embeddedViewIndex);
    }
    /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    visitAll(variables, astNodes) {
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach((pipe) => {
                if (pipe.pure) {
                    this.purePipeNodeIndices[pipe.name] = this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            const /** @type {?} */ queryIds = staticViewQueryIds(this.staticQueryIds);
            this.component.viewQueries.forEach((query, queryIndex) => {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                const /** @type {?} */ queryId = queryIndex + 1;
                const /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1 /* All */;
                const /** @type {?} */ flags = 134217728 /* TypeViewQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
                this.nodes.push(() => ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                        o.literal(flags), o.literal(queryId),
                        new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                    ])
                }));
            });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(() => ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                    o.literal(0 /* None */), o.NULL_EXPR, o.NULL_EXPR, o.literal(0)
                ])
            }));
        }
    }
    /**
     * @param {?=} targetStatements
     * @return {?}
     */
    build(targetStatements = []) {
        this.children.forEach((child) => child.build(targetStatements));
        const { updateRendererStmts, updateDirectivesStmts, nodeDefExprs } = this._createNodeExpressions();
        const /** @type {?} */ updateRendererFn = this._createUpdateFn(updateRendererStmts);
        const /** @type {?} */ updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        let /** @type {?} */ viewFlags = 0 /* None */;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        const /** @type {?} */ viewFactory = new o.DeclareFunctionStmt(this.viewName, [new o.FnParam(/** @type {?} */ ((LOG_VAR.name)))], [new o.ReturnStatement(o.importExpr(Identifiers.viewDef).callFn([
                o.literal(viewFlags),
                o.literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], o.importType(Identifiers.ViewDefinition), this.embeddedViewIndex === 0 ? [o.StmtModifier.Exported] : []);
        targetStatements.push(viewFactory);
        return targetStatements;
    }
    /**
     * @param {?} updateStmts
     * @return {?}
     */
    _createUpdateFn(updateStmts) {
        let /** @type {?} */ updateFn;
        if (updateStmts.length > 0) {
            const /** @type {?} */ preStmts = [];
            if (!this.component.isHost && o.findReadVarNames(updateStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = o.fn([
                new o.FnParam(/** @type {?} */ ((CHECK_VAR.name)), o.INFERRED_TYPE),
                new o.FnParam(/** @type {?} */ ((VIEW_VAR.name)), o.INFERRED_TYPE)
            ], [...preStmts, ...updateStmts], o.INFERRED_TYPE);
        }
        else {
            updateFn = o.NULL_EXPR;
        }
        return updateFn;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNgContent(ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: o.importExpr(Identifiers.ngContentDef).callFn([
                o.literal(ast.ngContentIndex), o.literal(ast.index)
            ])
        }));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitText(ast, context) {
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(ast.ngContentIndex), o.literalArr([o.literal(ast.value)])
            ])
        }));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBoundText(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        const /** @type {?} */ astWithSource = (ast.value);
        const /** @type {?} */ inter = (astWithSource.ast);
        const /** @type {?} */ updateRendererExpressions = inter.expressions.map((expr, bindingIndex) => this._preprocessUpdateExpression({ nodeIndex, bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }));
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(ast.ngContentIndex), o.literalArr(inter.strings.map(s => o.literal(s)))
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEmbeddedTemplate(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        const { flags, queryMatchesExpr, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        const /** @type {?} */ childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                o.variable(childVisitor.viewName),
            ])
        });
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElement(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        // Using a null element name creates an anchor.
        const /** @type {?} */ elName = isNgContainer(ast.name) ? null : ast.name;
        const { flags, usedEvents, queryMatchesExpr, hostBindings: dirHostBindings, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        let /** @type {?} */ inputDefs = [];
        let /** @type {?} */ updateRendererExpressions = [];
        let /** @type {?} */ outputDefs = [];
        if (elName) {
            const /** @type {?} */ hostBindings = ast.inputs
                .map((inputAst) => ({
                context: /** @type {?} */ (COMP_VAR),
                inputAst,
                dirAst: /** @type {?} */ (null),
            }))
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map((hostBinding, bindingIndex) => this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex,
                        bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }));
                inputDefs = hostBindings.map(hostBinding => elementBindingDef(hostBinding.inputAst, hostBinding.dirAst));
            }
            outputDefs = usedEvents.map(([target, eventName]) => o.literalArr([o.literal(target), o.literal(eventName)]));
        }
        templateVisitAll(this, ast.children);
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        const /** @type {?} */ compAst = ast.directives.find(dirAst => dirAst.directive.isComponent);
        let /** @type {?} */ compRendererType = (o.NULL_EXPR);
        let /** @type {?} */ compView = (o.NULL_EXPR);
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
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.elementDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                o.literal(elName),
                elName ? fixedAttrsDef(ast) : o.NULL_EXPR,
                inputDefs.length ? o.literalArr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? o.literalArr(outputDefs) : o.NULL_EXPR,
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    /**
     * @param {?} nodeIndex
     * @param {?} ast
     * @return {?}
     */
    _visitElementOrTemplate(nodeIndex, ast) {
        let /** @type {?} */ flags = 0 /* None */;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        const /** @type {?} */ usedEvents = new Map();
        ast.outputs.forEach((event) => {
            const { name, target } = elementEventNameAndTarget(event, null);
            usedEvents.set(elementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach((dirAst) => {
            dirAst.hostEvents.forEach((event) => {
                const { name, target } = elementEventNameAndTarget(event, dirAst);
                usedEvents.set(elementEventFullName(target, name), [target, name]);
            });
        });
        const /** @type {?} */ hostBindings = [];
        const /** @type {?} */ hostEvents = [];
        this._visitComponentFactoryResolverProvider(ast.directives);
        ast.providers.forEach((providerAst, providerIndex) => {
            let /** @type {?} */ dirAst = ((undefined));
            let /** @type {?} */ dirIndex = ((undefined));
            ast.directives.forEach((localDirAst, i) => {
                if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                    dirIndex = i;
                }
            });
            if (dirAst) {
                const { hostBindings: dirHostBindings, hostEvents: dirHostEvents } = this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, /** @type {?} */ ((this.staticQueryIds.get(/** @type {?} */ (ast)))));
                hostBindings.push(...dirHostBindings);
                hostEvents.push(...dirHostEvents);
            }
            else {
                this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        let /** @type {?} */ queryMatchExprs = [];
        ast.queryMatches.forEach((match) => {
            let /** @type {?} */ valueType = ((undefined));
            if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.ElementRef)) {
                valueType = 0 /* ElementRef */;
            }
            else if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.ViewContainerRef)) {
                valueType = 3 /* ViewContainerRef */;
            }
            else if (tokenReference(match.value) ===
                this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(valueType)]));
            }
        });
        ast.references.forEach((ref) => {
            let /** @type {?} */ valueType = ((undefined));
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (tokenReference(ref.value) ===
                this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(valueType)]));
            }
        });
        ast.outputs.forEach((outputAst) => {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: /** @type {?} */ ((null)) });
        });
        return {
            flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
            hostBindings,
            hostEvents: hostEvents
        };
    }
    /**
     * @param {?} providerAst
     * @param {?} dirAst
     * @param {?} directiveIndex
     * @param {?} elementNodeIndex
     * @param {?} refs
     * @param {?} queryMatches
     * @param {?} usedEvents
     * @param {?} queryIds
     * @return {?}
     */
    _visitDirective(providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        dirAst.directive.queries.forEach((query, queryIndex) => {
            const /** @type {?} */ queryId = dirAst.contentQueryStartId + queryIndex;
            const /** @type {?} */ flags = 67108864 /* TypeContentQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
            const /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1 /* All */;
            this.nodes.push(() => ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                    o.literal(flags), o.literal(queryId),
                    new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                ]),
            }));
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        let { flags, queryMatchExprs, providerExpr, depsExpr } = this._visitProviderOrDirective(providerAst, queryMatches);
        refs.forEach((ref) => {
            if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        const /** @type {?} */ inputDefs = dirAst.inputs.map((inputAst, inputIndex) => {
            const /** @type {?} */ mapValue = o.literalArr([o.literal(inputIndex), o.literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new o.LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        const /** @type {?} */ outputDefs = [];
        const /** @type {?} */ dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach((propName) => {
            const /** @type {?} */ eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new o.LiteralMapEntry(propName, o.literal(eventName), false));
            }
        });
        let /** @type {?} */ updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map((input, bindingIndex) => this._preprocessUpdateExpression({
                    nodeIndex,
                    bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }));
        }
        const /** @type {?} */ dirContextExpr = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
        const /** @type {?} */ hostBindings = dirAst.hostProperties.map((inputAst) => ({
            context: dirContextExpr,
            dirAst,
            inputAst,
        }));
        const /** @type {?} */ hostEvents = dirAst.hostEvents.map((hostEventAst) => ({
            context: dirContextExpr,
            eventAst: hostEventAst, dirAst,
        }));
        // directiveDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], childCount: number, ctor:
        //   any,
        //   deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
        //   outputs?: {[name: string]: string}, component?: () => ViewDefinition): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 /* TypeDirective */ | flags,
            nodeDef: o.importExpr(Identifiers.directiveDef).callFn([
                o.literal(flags), queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
                o.literal(childCount), providerExpr, depsExpr,
                inputDefs.length ? new o.LiteralMapExpr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? new o.LiteralMapExpr(outputDefs) : o.NULL_EXPR
            ]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type,
        });
        return { hostBindings, hostEvents };
    }
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    _visitProvider(providerAst, queryMatches) {
        this._addProviderNode(this._visitProviderOrDirective(providerAst, queryMatches));
    }
    /**
     * @param {?} directives
     * @return {?}
     */
    _visitComponentFactoryResolverProvider(directives) {
        const /** @type {?} */ componentDirMeta = directives.find(dirAst => dirAst.directive.isComponent);
        if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
            const { providerExpr, depsExpr, flags, tokenExpr } = componentFactoryResolverProviderDef(this.reflector, this.outputCtx, 8192 /* PrivateProvider */, componentDirMeta.directive.entryComponents);
            this._addProviderNode({
                providerExpr,
                depsExpr,
                flags,
                tokenExpr,
                queryMatchExprs: [],
                sourceSpan: componentDirMeta.sourceSpan
            });
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    _addProviderNode(data) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: data.sourceSpan,
            nodeFlags: data.flags,
            nodeDef: o.importExpr(Identifiers.providerDef).callFn([
                o.literal(data.flags),
                data.queryMatchExprs.length ? o.literalArr(data.queryMatchExprs) : o.NULL_EXPR,
                data.tokenExpr, data.providerExpr, data.depsExpr
            ])
        }));
    }
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    _visitProviderOrDirective(providerAst, queryMatches) {
        let /** @type {?} */ flags = 0 /* None */;
        let /** @type {?} */ queryMatchExprs = [];
        queryMatches.forEach((match) => {
            if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(4 /* Provider */)]));
            }
        });
        const { providerExpr, depsExpr, flags: providerFlags, tokenExpr } = providerDef(this.outputCtx, providerAst);
        return {
            flags: flags | providerFlags,
            queryMatchExprs,
            providerExpr,
            depsExpr,
            tokenExpr,
            sourceSpan: providerAst.sourceSpan
        };
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name == EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        let /** @type {?} */ currViewExpr = VIEW_VAR;
        for (let /** @type {?} */ currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(o.DYNAMIC_TYPE)) {
            // check references
            const /** @type {?} */ refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return o.importExpr(Identifiers.nodeValue).callFn([currViewExpr, o.literal(refNodeIndex)]);
            }
            // check variables
            const /** @type {?} */ varAst = currBuilder.variables.find((varAst) => varAst.name === name);
            if (varAst) {
                const /** @type {?} */ varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                return currViewExpr.prop('context').prop(varValue);
            }
        }
        return null;
    }
    /**
     * @param {?} sourceSpan
     * @param {?} argCount
     * @return {?}
     */
    createLiteralArrayConverter(sourceSpan, argCount) {
        if (argCount === 0) {
            const /** @type {?} */ valueExpr = o.importExpr(Identifiers.EMPTY_ARRAY);
            return () => valueExpr;
        }
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // pureArrayDef(argCount: number): NodeDef;
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: o.importExpr(Identifiers.pureArrayDef).callFn([o.literal(argCount)])
        }));
        return (args) => callCheckStmt(nodeIndex, args);
    }
    /**
     * @param {?} sourceSpan
     * @param {?} keys
     * @return {?}
     */
    createLiteralMapConverter(sourceSpan, keys) {
        if (keys.length === 0) {
            const /** @type {?} */ valueExpr = o.importExpr(Identifiers.EMPTY_MAP);
            return () => valueExpr;
        }
        // function pureObjectDef(propToIndex: {[p: string]: number}): NodeDef
        const /** @type {?} */ map = o.literalMap(keys.map((e, i) => (Object.assign({}, e, { value: o.literal(i) }))));
        const /** @type {?} */ nodeIndex = this.nodes.length;
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: o.importExpr(Identifiers.pureObjectDef).callFn([map])
        }));
        return (args) => callCheckStmt(nodeIndex, args);
    }
    /**
     * @param {?} expression
     * @param {?} name
     * @param {?} argCount
     * @return {?}
     */
    createPipeConverter(expression, name, argCount) {
        const /** @type {?} */ pipe = ((this.usedPipes.find((pipeSummary) => pipeSummary.name === name)));
        if (pipe.pure) {
            const /** @type {?} */ nodeIndex = this.nodes.length;
            // function purePipeDef(argCount: number): NodeDef;
            this.nodes.push(() => ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: o.importExpr(Identifiers.purePipeDef).callFn([o.literal(argCount)])
            }));
            // find underlying pipe in the component view
            let /** @type {?} */ compViewExpr = VIEW_VAR;
            let /** @type {?} */ compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(o.DYNAMIC_TYPE);
            }
            const /** @type {?} */ pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            const /** @type {?} */ pipeValueExpr = o.importExpr(Identifiers.nodeValue).callFn([compViewExpr, o.literal(pipeNodeIndex)]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(nodeIndex, [pipeValueExpr].concat(args)));
        }
        else {
            const /** @type {?} */ nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            const /** @type {?} */ nodeValueExpr = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr.callMethod('transform', args));
        }
    }
    /**
     * @param {?} sourceSpan
     * @param {?} pipe
     * @return {?}
     */
    _createPipe(sourceSpan, pipe) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        let /** @type {?} */ flags = 0 /* None */;
        pipe.type.lifecycleHooks.forEach((lifecycleHook) => {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === LifecycleHooks.OnDestroy) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        const /** @type {?} */ depExprs = pipe.type.diDeps.map((diDep) => depDef(this.outputCtx, diDep));
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: o.importExpr(Identifiers.pipeDef).callFn([
                o.literal(flags), this.outputCtx.importExpr(pipe.type.reference), o.literalArr(depExprs)
            ])
        }));
        return nodeIndex;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    _preprocessUpdateExpression(expression) {
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: (argCount) => this.createLiteralArrayConverter(expression.sourceSpan, argCount),
                createLiteralMapConverter: (keys) => this.createLiteralMapConverter(expression.sourceSpan, keys),
                createPipeConverter: (name, argCount) => this.createPipeConverter(expression, name, argCount)
            }, expression.value)
        };
    }
    /**
     * @return {?}
     */
    _createNodeExpressions() {
        const /** @type {?} */ self = this;
        let /** @type {?} */ updateBindingCount = 0;
        const /** @type {?} */ updateRendererStmts = [];
        const /** @type {?} */ updateDirectivesStmts = [];
        const /** @type {?} */ nodeDefExprs = this.nodes.map((factory, nodeIndex) => {
            const { nodeDef, nodeFlags, updateDirectives, updateRenderer, sourceSpan } = factory();
            if (updateRenderer) {
                updateRendererStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            const /** @type {?} */ logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new o.CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return o.applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts, updateDirectivesStmts, nodeDefExprs };
        /**
         * @param {?} nodeIndex
         * @param {?} sourceSpan
         * @param {?} expressions
         * @param {?} allowEmptyExprs
         * @return {?}
         */
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            const /** @type {?} */ updateStmts = [];
            const /** @type {?} */ exprs = expressions.map(({ sourceSpan, context, value }) => {
                const /** @type {?} */ bindingId = `${updateBindingCount++}`;
                const /** @type {?} */ nameResolver = context === COMP_VAR ? self : null;
                const { stmts, currValExpr } = convertPropertyBinding(nameResolver, context, value, bindingId);
                updateStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
                return o.applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(o.applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    }
    /**
     * @param {?} nodeIndex
     * @param {?} handlers
     * @return {?}
     */
    _createElementHandleEventFn(nodeIndex, handlers) {
        const /** @type {?} */ handleEventStmts = [];
        let /** @type {?} */ handleEventBindingCount = 0;
        handlers.forEach(({ context, eventAst, dirAst }) => {
            const /** @type {?} */ bindingId = `${handleEventBindingCount++}`;
            const /** @type {?} */ nameResolver = context === COMP_VAR ? this : null;
            const { stmts, allowDefault } = convertActionBinding(nameResolver, context, eventAst.handler, bindingId);
            const /** @type {?} */ trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            const { target: eventTarget, name: eventName } = elementEventNameAndTarget(eventAst, dirAst);
            const /** @type {?} */ fullEventName = elementEventFullName(eventTarget, eventName);
            handleEventStmts.push(o.applySourceSpanToStatementIfNeeded(new o.IfStmt(o.literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        let /** @type {?} */ handleEventFn;
        if (handleEventStmts.length > 0) {
            const /** @type {?} */ preStmts = [ALLOW_DEFAULT_VAR.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE)];
            if (!this.component.isHost && o.findReadVarNames(handleEventStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = o.fn([
                new o.FnParam(/** @type {?} */ ((VIEW_VAR.name)), o.INFERRED_TYPE),
                new o.FnParam(/** @type {?} */ ((EVENT_NAME_VAR.name)), o.INFERRED_TYPE),
                new o.FnParam(/** @type {?} */ ((EventHandlerVars.event.name)), o.INFERRED_TYPE)
            ], [...preStmts, ...handleEventStmts, new o.ReturnStatement(ALLOW_DEFAULT_VAR)], o.INFERRED_TYPE);
        }
        else {
            handleEventFn = o.NULL_EXPR;
        }
        return handleEventFn;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitDirective(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitDirectiveProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReference(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitVariable(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEvent(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElementProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAttr(ast, context) { }
}
function ViewBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewBuilder.prototype.compType;
    /** @type {?} */
    ViewBuilder.prototype.nodes;
    /** @type {?} */
    ViewBuilder.prototype.purePipeNodeIndices;
    /** @type {?} */
    ViewBuilder.prototype.refNodeIndices;
    /** @type {?} */
    ViewBuilder.prototype.variables;
    /** @type {?} */
    ViewBuilder.prototype.children;
    /** @type {?} */
    ViewBuilder.prototype.reflector;
    /** @type {?} */
    ViewBuilder.prototype.outputCtx;
    /** @type {?} */
    ViewBuilder.prototype.parent;
    /** @type {?} */
    ViewBuilder.prototype.component;
    /** @type {?} */
    ViewBuilder.prototype.embeddedViewIndex;
    /** @type {?} */
    ViewBuilder.prototype.usedPipes;
    /** @type {?} */
    ViewBuilder.prototype.staticQueryIds;
    /** @type {?} */
    ViewBuilder.prototype.viewBuilderFactory;
}
/**
 * @param {?} astNodes
 * @return {?}
 */
function needsAdditionalRootNode(astNodes) {
    const /** @type {?} */ lastAstNode = astNodes[astNodes.length - 1];
    if (lastAstNode instanceof EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
    }
    if (lastAstNode instanceof ElementAst) {
        if (isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
            return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
    }
    return lastAstNode instanceof NgContentAst;
}
/**
 * @param {?} inputAst
 * @param {?} dirAst
 * @return {?}
 */
function elementBindingDef(inputAst, dirAst) {
    switch (inputAst.type) {
        case PropertyBindingType.Attribute:
            return o.literalArr([
                o.literal(1 /* TypeElementAttribute */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Property:
            return o.literalArr([
                o.literal(8 /* TypeProperty */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Animation:
            const /** @type {?} */ bindingType = 8 /* TypeProperty */ |
                (dirAst && dirAst.directive.isComponent ? 32 /* SyntheticHostProperty */ :
                    16 /* SyntheticProperty */);
            return o.literalArr([
                o.literal(bindingType), o.literal('@' + inputAst.name), o.literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Class:
            return o.literalArr([o.literal(2 /* TypeElementClass */), o.literal(inputAst.name), o.NULL_EXPR]);
        case PropertyBindingType.Style:
            return o.literalArr([
                o.literal(4 /* TypeElementStyle */), o.literal(inputAst.name), o.literal(inputAst.unit)
            ]);
    }
}
/**
 * @param {?} elementAst
 * @return {?}
 */
function fixedAttrsDef(elementAst) {
    const /** @type {?} */ mapResult = Object.create(null);
    elementAst.attrs.forEach(attrAst => { mapResult[attrAst.name] = attrAst.value; });
    elementAst.directives.forEach(dirAst => {
        Object.keys(dirAst.directive.hostAttributes).forEach(name => {
            const /** @type {?} */ value = dirAst.directive.hostAttributes[name];
            const /** @type {?} */ prevValue = mapResult[name];
            mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return o.literalArr(Object.keys(mapResult).sort().map((attrName) => o.literalArr([o.literal(attrName), o.literal(mapResult[attrName])])));
}
/**
 * @param {?} attrName
 * @param {?} attrValue1
 * @param {?} attrValue2
 * @return {?}
 */
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return `${attrValue1} ${attrValue2}`;
    }
    else {
        return attrValue2;
    }
}
/**
 * @param {?} nodeIndex
 * @param {?} exprs
 * @return {?}
 */
function callCheckStmt(nodeIndex, exprs) {
    if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(1 /* Dynamic */), o.literalArr(exprs)]);
    }
    else {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(0 /* Inline */), ...exprs]);
    }
}
/**
 * @param {?} nodeIndex
 * @param {?} bindingIdx
 * @param {?} expr
 * @return {?}
 */
function callUnwrapValue(nodeIndex, bindingIdx, expr) {
    return o.importExpr(Identifiers.unwrapValue).callFn([
        VIEW_VAR, o.literal(nodeIndex), o.literal(bindingIdx), expr
    ]);
}
/**
 * @record
 */
function StaticAndDynamicQueryIds() { }
function StaticAndDynamicQueryIds_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticAndDynamicQueryIds.prototype.staticQueryIds;
    /** @type {?} */
    StaticAndDynamicQueryIds.prototype.dynamicQueryIds;
}
/**
 * @param {?} nodes
 * @param {?=} result
 * @return {?}
 */
function findStaticQueryIds(nodes, result = new Map()) {
    nodes.forEach((node) => {
        const /** @type {?} */ staticQueryIds = new Set();
        const /** @type {?} */ dynamicQueryIds = new Set();
        let /** @type {?} */ queryMatches = ((undefined));
        if (node instanceof ElementAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach((child) => {
                const /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(queryId => staticQueryIds.add(queryId));
                childData.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
            });
            queryMatches = node.queryMatches;
        }
        else if (node instanceof EmbeddedTemplateAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach((child) => {
                const /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
                childData.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
            });
            queryMatches = node.queryMatches;
        }
        if (queryMatches) {
            queryMatches.forEach((match) => staticQueryIds.add(match.queryId));
        }
        dynamicQueryIds.forEach(queryId => staticQueryIds.delete(queryId));
        result.set(node, { staticQueryIds, dynamicQueryIds });
    });
    return result;
}
/**
 * @param {?} nodeStaticQueryIds
 * @return {?}
 */
function staticViewQueryIds(nodeStaticQueryIds) {
    const /** @type {?} */ staticQueryIds = new Set();
    const /** @type {?} */ dynamicQueryIds = new Set();
    Array.from(nodeStaticQueryIds.values()).forEach((entry) => {
        entry.staticQueryIds.forEach(queryId => staticQueryIds.add(queryId));
        entry.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
    });
    dynamicQueryIds.forEach(queryId => staticQueryIds.delete(queryId));
    return { staticQueryIds, dynamicQueryIds };
}
/**
 * @param {?} eventAst
 * @param {?} dirAst
 * @return {?}
 */
function elementEventNameAndTarget(eventAst, dirAst) {
    if (eventAst.isAnimation) {
        return {
            name: `@${eventAst.name}.${eventAst.phase}`,
            target: dirAst && dirAst.directive.isComponent ? 'component' : null
        };
    }
    else {
        return eventAst;
    }
}
/**
 * @param {?} queryIds
 * @param {?} queryId
 * @param {?} isFirst
 * @return {?}
 */
function calcStaticDynamicQueryFlags(queryIds, queryId, isFirst) {
    let /** @type {?} */ flags = 0 /* None */;
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
//# sourceMappingURL=view_compiler.js.map