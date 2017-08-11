/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Factory for ViewDefinitions/NgModuleDefinitions.
 * We use a function so we can reexeute it in case an error happens and use the given logger
 * function to log the error from the definition of the node, which is shown in all browser
 * logs.
 * @record
 */
export function DefinitionFactory() { }
function DefinitionFactory_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (logger: NodeLogger): D;
    */
}
/**
 * Function to call console.error at the right source location. This is an indirection
 * via another function as browser will log the location that actually called
 * `console.error`.
 * @record
 */
export function NodeLogger() { }
function NodeLogger_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (): () => void;
    */
}
/**
 * @record
 */
export function Definition() { }
function Definition_tsickle_Closure_declarations() {
    /** @type {?} */
    Definition.prototype.factory;
}
/**
 * @record
 */
export function NgModuleDefinition() { }
function NgModuleDefinition_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleDefinition.prototype.providers;
    /** @type {?} */
    NgModuleDefinition.prototype.providersByKey;
}
/**
 * @record
 */
export function NgModuleDefinitionFactory() { }
function NgModuleDefinitionFactory_tsickle_Closure_declarations() {
}
;
/**
 * @record
 */
export function ViewDefinition() { }
function ViewDefinition_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewDefinition.prototype.flags;
    /** @type {?} */
    ViewDefinition.prototype.updateDirectives;
    /** @type {?} */
    ViewDefinition.prototype.updateRenderer;
    /** @type {?} */
    ViewDefinition.prototype.handleEvent;
    /**
     * Order: Depth first.
     * Especially providers are before elements / anchors.
     * @type {?}
     */
    ViewDefinition.prototype.nodes;
    /**
     * aggregated NodeFlags for all nodes *
     * @type {?}
     */
    ViewDefinition.prototype.nodeFlags;
    /** @type {?} */
    ViewDefinition.prototype.rootNodeFlags;
    /** @type {?} */
    ViewDefinition.prototype.lastRenderRootNode;
    /** @type {?} */
    ViewDefinition.prototype.bindingCount;
    /** @type {?} */
    ViewDefinition.prototype.outputCount;
    /**
     * Binary or of all query ids that are matched by one of the nodes.
     * This includes query ids from templates as well.
     * Used as a bloom filter.
     * @type {?}
     */
    ViewDefinition.prototype.nodeMatchedQueries;
}
/**
 * @record
 */
export function ViewDefinitionFactory() { }
function ViewDefinitionFactory_tsickle_Closure_declarations() {
}
/**
 * @record
 */
export function ViewUpdateFn() { }
function ViewUpdateFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (check: NodeCheckFn, view: ViewData): void;
    */
}
/**
 * @record
 */
export function NodeCheckFn() { }
function NodeCheckFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (view: ViewData, nodeIndex: number, argStyle: ArgumentType.Dynamic, values: any[]): any;
    */
    /* TODO: handle strange member:
    (view: ViewData, nodeIndex: number, argStyle: ArgumentType.Inline, v0?: any, v1?: any, v2?: any,
       v3?: any, v4?: any, v5?: any, v6?: any, v7?: any, v8?: any, v9?: any): any;
    */
}
/**
 * @record
 */
export function ViewHandleEventFn() { }
function ViewHandleEventFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (view: ViewData, nodeIndex: number, eventName: string, event: any): boolean;
    */
}
/**
 * A node definition in the view.
 *
 * Note: We use one type for all nodes so that loops that loop over all nodes
 * of a ViewDefinition stay monomorphic!
 * @record
 */
export function NodeDef() { }
function NodeDef_tsickle_Closure_declarations() {
    /** @type {?} */
    NodeDef.prototype.flags;
    /** @type {?} */
    NodeDef.prototype.index;
    /** @type {?} */
    NodeDef.prototype.parent;
    /** @type {?} */
    NodeDef.prototype.renderParent;
    /**
     * this is checked against NgContentDef.index to find matched nodes
     * @type {?}
     */
    NodeDef.prototype.ngContentIndex;
    /**
     * number of transitive children
     * @type {?}
     */
    NodeDef.prototype.childCount;
    /**
     * aggregated NodeFlags for all transitive children (does not include self) *
     * @type {?}
     */
    NodeDef.prototype.childFlags;
    /**
     * aggregated NodeFlags for all direct children (does not include self) *
     * @type {?}
     */
    NodeDef.prototype.directChildFlags;
    /** @type {?} */
    NodeDef.prototype.bindingIndex;
    /** @type {?} */
    NodeDef.prototype.bindings;
    /** @type {?} */
    NodeDef.prototype.bindingFlags;
    /** @type {?} */
    NodeDef.prototype.outputIndex;
    /** @type {?} */
    NodeDef.prototype.outputs;
    /**
     * references that the user placed on the element
     * @type {?}
     */
    NodeDef.prototype.references;
    /**
     * ids and value types of all queries that are matched by this node.
     * @type {?}
     */
    NodeDef.prototype.matchedQueries;
    /**
     * Binary or of all matched query ids of this node.
     * @type {?}
     */
    NodeDef.prototype.matchedQueryIds;
    /**
     * Binary or of all query ids that are matched by one of the children.
     * This includes query ids from templates as well.
     * Used as a bloom filter.
     * @type {?}
     */
    NodeDef.prototype.childMatchedQueries;
    /** @type {?} */
    NodeDef.prototype.element;
    /** @type {?} */
    NodeDef.prototype.provider;
    /** @type {?} */
    NodeDef.prototype.text;
    /** @type {?} */
    NodeDef.prototype.query;
    /** @type {?} */
    NodeDef.prototype.ngContent;
}
/**
 * @record
 */
export function BindingDef() { }
function BindingDef_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingDef.prototype.flags;
    /** @type {?} */
    BindingDef.prototype.ns;
    /** @type {?} */
    BindingDef.prototype.name;
    /** @type {?} */
    BindingDef.prototype.nonMinifiedName;
    /** @type {?} */
    BindingDef.prototype.securityContext;
    /** @type {?} */
    BindingDef.prototype.suffix;
}
/**
 * @record
 */
export function OutputDef() { }
function OutputDef_tsickle_Closure_declarations() {
    /** @type {?} */
    OutputDef.prototype.type;
    /** @type {?} */
    OutputDef.prototype.target;
    /** @type {?} */
    OutputDef.prototype.eventName;
    /** @type {?} */
    OutputDef.prototype.propName;
}
/**
 * @record
 */
export function ElementDef() { }
function ElementDef_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementDef.prototype.name;
    /** @type {?} */
    ElementDef.prototype.ns;
    /**
     * ns, name, value
     * @type {?}
     */
    ElementDef.prototype.attrs;
    /** @type {?} */
    ElementDef.prototype.template;
    /** @type {?} */
    ElementDef.prototype.componentProvider;
    /** @type {?} */
    ElementDef.prototype.componentRendererType;
    /** @type {?} */
    ElementDef.prototype.componentView;
    /**
     * visible public providers for DI in the view,
     * as see from this element. This does not include private providers.
     * @type {?}
     */
    ElementDef.prototype.publicProviders;
    /**
     * same as visiblePublicProviders, but also includes private providers
     * that are located on this element.
     * @type {?}
     */
    ElementDef.prototype.allProviders;
    /** @type {?} */
    ElementDef.prototype.handleEvent;
}
/**
 * @record
 */
export function ElementHandleEventFn() { }
function ElementHandleEventFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (view: ViewData, eventName: string, event: any): boolean;
    */
}
/**
 * @record
 */
export function ProviderDef() { }
function ProviderDef_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderDef.prototype.token;
    /** @type {?} */
    ProviderDef.prototype.value;
    /** @type {?} */
    ProviderDef.prototype.deps;
}
/**
 * @record
 */
export function NgModuleProviderDef() { }
function NgModuleProviderDef_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleProviderDef.prototype.flags;
    /** @type {?} */
    NgModuleProviderDef.prototype.index;
    /** @type {?} */
    NgModuleProviderDef.prototype.token;
    /** @type {?} */
    NgModuleProviderDef.prototype.value;
    /** @type {?} */
    NgModuleProviderDef.prototype.deps;
}
/**
 * @record
 */
export function DepDef() { }
function DepDef_tsickle_Closure_declarations() {
    /** @type {?} */
    DepDef.prototype.flags;
    /** @type {?} */
    DepDef.prototype.token;
    /** @type {?} */
    DepDef.prototype.tokenKey;
}
/**
 * @record
 */
export function TextDef() { }
function TextDef_tsickle_Closure_declarations() {
    /** @type {?} */
    TextDef.prototype.prefix;
}
/**
 * @record
 */
export function QueryDef() { }
function QueryDef_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryDef.prototype.id;
    /** @type {?} */
    QueryDef.prototype.filterId;
    /** @type {?} */
    QueryDef.prototype.bindings;
}
/**
 * @record
 */
export function QueryBindingDef() { }
function QueryBindingDef_tsickle_Closure_declarations() {
    /** @type {?} */
    QueryBindingDef.prototype.propName;
    /** @type {?} */
    QueryBindingDef.prototype.bindingType;
}
/**
 * @record
 */
export function NgContentDef() { }
function NgContentDef_tsickle_Closure_declarations() {
    /**
     * this index is checked against NodeDef.ngContentIndex to find the nodes
     * that are matched by this ng-content.
     * Note that a NodeDef with an ng-content can be reprojected, i.e.
     * have a ngContentIndex on its own.
     * @type {?}
     */
    NgContentDef.prototype.index;
}
/**
 * @record
 */
export function NgModuleData() { }
function NgModuleData_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleData.prototype._def;
    /** @type {?} */
    NgModuleData.prototype._parent;
    /** @type {?} */
    NgModuleData.prototype._providers;
}
/**
 * View instance data.
 * Attention: Adding fields to this is performance sensitive!
 * @record
 */
export function ViewData() { }
function ViewData_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewData.prototype.def;
    /** @type {?} */
    ViewData.prototype.root;
    /** @type {?} */
    ViewData.prototype.renderer;
    /** @type {?} */
    ViewData.prototype.parentNodeDef;
    /** @type {?} */
    ViewData.prototype.parent;
    /** @type {?} */
    ViewData.prototype.viewContainerParent;
    /** @type {?} */
    ViewData.prototype.component;
    /** @type {?} */
    ViewData.prototype.context;
    /** @type {?} */
    ViewData.prototype.nodes;
    /** @type {?} */
    ViewData.prototype.state;
    /** @type {?} */
    ViewData.prototype.oldValues;
    /** @type {?} */
    ViewData.prototype.disposables;
}
/**
 * @record
 */
export function DisposableFn() { }
function DisposableFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (): void;
    */
}
/**
 * Node instance data.
 *
 * We have a separate type per NodeType to save memory
 * (TextData | ElementData | ProviderData | PureExpressionData | QueryList<any>)
 *
 * To keep our code monomorphic,
 * we prohibit using `NodeData` directly but enforce the use of accessors (`asElementData`, ...).
 * This way, no usage site can get a `NodeData` from view.nodes and then use it for different
 * purposes.
 */
export class NodeData {
}
function NodeData_tsickle_Closure_declarations() {
    /** @type {?} */
    NodeData.prototype.__brand;
}
/**
 * Data for an instantiated NodeType.Text.
 *
 * Attention: Adding fields to this is performance sensitive!
 * @record
 */
export function TextData() { }
function TextData_tsickle_Closure_declarations() {
    /** @type {?} */
    TextData.prototype.renderText;
}
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function asTextData(view, index) {
    return (view.nodes[index]);
}
/**
 * Data for an instantiated NodeType.Element.
 *
 * Attention: Adding fields to this is performance sensitive!
 * @record
 */
export function ElementData() { }
function ElementData_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementData.prototype.renderElement;
    /** @type {?} */
    ElementData.prototype.componentView;
    /** @type {?} */
    ElementData.prototype.viewContainer;
    /** @type {?} */
    ElementData.prototype.template;
}
/**
 * @record
 */
export function ViewContainerData() { }
function ViewContainerData_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewContainerData.prototype._embeddedViews;
}
/**
 * @record
 */
export function TemplateData() { }
function TemplateData_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateData.prototype._projectedViews;
}
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function asElementData(view, index) {
    return (view.nodes[index]);
}
/**
 * Data for an instantiated NodeType.Provider.
 *
 * Attention: Adding fields to this is performance sensitive!
 * @record
 */
export function ProviderData() { }
function ProviderData_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderData.prototype.instance;
}
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function asProviderData(view, index) {
    return (view.nodes[index]);
}
/**
 * Data for an instantiated NodeType.PureExpression.
 *
 * Attention: Adding fields to this is performance sensitive!
 * @record
 */
export function PureExpressionData() { }
function PureExpressionData_tsickle_Closure_declarations() {
    /** @type {?} */
    PureExpressionData.prototype.value;
}
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function asPureExpressionData(view, index) {
    return (view.nodes[index]);
}
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 * @param {?} view
 * @param {?} index
 * @return {?}
 */
export function asQueryList(view, index) {
    return (view.nodes[index]);
}
/**
 * @record
 */
export function RootData() { }
function RootData_tsickle_Closure_declarations() {
    /** @type {?} */
    RootData.prototype.injector;
    /** @type {?} */
    RootData.prototype.ngModule;
    /** @type {?} */
    RootData.prototype.projectableNodes;
    /** @type {?} */
    RootData.prototype.selectorOrNode;
    /** @type {?} */
    RootData.prototype.renderer;
    /** @type {?} */
    RootData.prototype.rendererFactory;
    /** @type {?} */
    RootData.prototype.errorHandler;
    /** @type {?} */
    RootData.prototype.sanitizer;
}
/**
 * @abstract
 */
export class DebugContext {
}
function DebugContext_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.view = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.nodeIndex = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.injector = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.component = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.providerTokens = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.references = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.context = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.componentRenderElement = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DebugContext.prototype.renderNode = function () { };
    /**
     * @abstract
     * @param {?} console
     * @param {...?} values
     * @return {?}
     */
    DebugContext.prototype.logError = function (console, values) { };
}
/**
 * @record
 */
export function ProviderOverride() { }
function ProviderOverride_tsickle_Closure_declarations() {
    /** @type {?} */
    ProviderOverride.prototype.token;
    /** @type {?} */
    ProviderOverride.prototype.flags;
    /** @type {?} */
    ProviderOverride.prototype.value;
    /** @type {?} */
    ProviderOverride.prototype.deps;
}
/**
 * This object is used to prevent cycles in the source files and to have a place where
 * debug mode can hook it. It is lazily filled when `isDevMode` is known.
 */
export const /** @type {?} */ Services = {
    setCurrentNode: /** @type {?} */ ((undefined)),
    createRootView: /** @type {?} */ ((undefined)),
    createEmbeddedView: /** @type {?} */ ((undefined)),
    createComponentView: /** @type {?} */ ((undefined)),
    createNgModuleRef: /** @type {?} */ ((undefined)),
    overrideProvider: /** @type {?} */ ((undefined)),
    clearProviderOverrides: /** @type {?} */ ((undefined)),
    checkAndUpdateView: /** @type {?} */ ((undefined)),
    checkNoChangesView: /** @type {?} */ ((undefined)),
    destroyView: /** @type {?} */ ((undefined)),
    resolveDep: /** @type {?} */ ((undefined)),
    createDebugContext: /** @type {?} */ ((undefined)),
    handleEvent: /** @type {?} */ ((undefined)),
    updateDirectives: /** @type {?} */ ((undefined)),
    updateRenderer: /** @type {?} */ ((undefined)),
    dirtyParentQueries: /** @type {?} */ ((undefined)),
};
//# sourceMappingURL=types.js.map