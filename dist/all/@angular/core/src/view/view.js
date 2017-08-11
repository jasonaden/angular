"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("./element");
var errors_1 = require("./errors");
var ng_content_1 = require("./ng_content");
var provider_1 = require("./provider");
var pure_expression_1 = require("./pure_expression");
var query_1 = require("./query");
var refs_1 = require("./refs");
var text_1 = require("./text");
var types_1 = require("./types");
var util_1 = require("./util");
var view_attach_1 = require("./view_attach");
function viewDef(flags, nodes, updateDirectives, updateRenderer) {
    // clone nodes and set auto calculated values
    var viewBindingCount = 0;
    var viewDisposableCount = 0;
    var viewNodeFlags = 0;
    var viewRootNodeFlags = 0;
    var viewMatchedQueries = 0;
    var currentParent = null;
    var currentElementHasPublicProviders = false;
    var currentElementHasPrivateProviders = false;
    var lastRenderRootNode = null;
    for (var i = 0; i < nodes.length; i++) {
        while (currentParent && i > currentParent.index + currentParent.childCount) {
            var newParent = currentParent.parent;
            if (newParent) {
                newParent.childFlags |= currentParent.childFlags;
                newParent.childMatchedQueries |= currentParent.childMatchedQueries;
            }
            currentParent = newParent;
        }
        var node = nodes[i];
        node.index = i;
        node.parent = currentParent;
        node.bindingIndex = viewBindingCount;
        node.outputIndex = viewDisposableCount;
        // renderParent needs to account for ng-container!
        var currentRenderParent = void 0;
        if (currentParent && currentParent.flags & 1 /* TypeElement */ &&
            !currentParent.element.name) {
            currentRenderParent = currentParent.renderParent;
        }
        else {
            currentRenderParent = currentParent;
        }
        node.renderParent = currentRenderParent;
        if (node.element) {
            var elDef = node.element;
            elDef.publicProviders =
                currentParent ? currentParent.element.publicProviders : Object.create(null);
            elDef.allProviders = elDef.publicProviders;
            // Note: We assume that all providers of an element are before any child element!
            currentElementHasPublicProviders = false;
            currentElementHasPrivateProviders = false;
        }
        validateNode(currentParent, node, nodes.length);
        viewNodeFlags |= node.flags;
        viewMatchedQueries |= node.matchedQueryIds;
        if (node.element && node.element.template) {
            viewMatchedQueries |= node.element.template.nodeMatchedQueries;
        }
        if (currentParent) {
            currentParent.childFlags |= node.flags;
            currentParent.directChildFlags |= node.flags;
            currentParent.childMatchedQueries |= node.matchedQueryIds;
            if (node.element && node.element.template) {
                currentParent.childMatchedQueries |= node.element.template.nodeMatchedQueries;
            }
        }
        else {
            viewRootNodeFlags |= node.flags;
        }
        viewBindingCount += node.bindings.length;
        viewDisposableCount += node.outputs.length;
        if (!currentRenderParent && (node.flags & 3 /* CatRenderNode */)) {
            lastRenderRootNode = node;
        }
        if (node.flags & 20224 /* CatProvider */) {
            if (!currentElementHasPublicProviders) {
                currentElementHasPublicProviders = true;
                // Use prototypical inheritance to not get O(n^2) complexity...
                currentParent.element.publicProviders =
                    Object.create(currentParent.element.publicProviders);
                currentParent.element.allProviders = currentParent.element.publicProviders;
            }
            var isPrivateService = (node.flags & 8192 /* PrivateProvider */) !== 0;
            var isComponent = (node.flags & 32768 /* Component */) !== 0;
            if (!isPrivateService || isComponent) {
                currentParent.element.publicProviders[util_1.tokenKey(node.provider.token)] = node;
            }
            else {
                if (!currentElementHasPrivateProviders) {
                    currentElementHasPrivateProviders = true;
                    // Use protoyypical inheritance to not get O(n^2) complexity...
                    currentParent.element.allProviders =
                        Object.create(currentParent.element.publicProviders);
                }
                currentParent.element.allProviders[util_1.tokenKey(node.provider.token)] = node;
            }
            if (isComponent) {
                currentParent.element.componentProvider = node;
            }
        }
        if (node.childCount) {
            currentParent = node;
        }
    }
    while (currentParent) {
        var newParent = currentParent.parent;
        if (newParent) {
            newParent.childFlags |= currentParent.childFlags;
            newParent.childMatchedQueries |= currentParent.childMatchedQueries;
        }
        currentParent = newParent;
    }
    var handleEvent = function (view, nodeIndex, eventName, event) {
        return nodes[nodeIndex].element.handleEvent(view, eventName, event);
    };
    return {
        // Will be filled later...
        factory: null,
        nodeFlags: viewNodeFlags,
        rootNodeFlags: viewRootNodeFlags,
        nodeMatchedQueries: viewMatchedQueries, flags: flags,
        nodes: nodes,
        updateDirectives: updateDirectives || util_1.NOOP,
        updateRenderer: updateRenderer || util_1.NOOP,
        handleEvent: handleEvent || util_1.NOOP,
        bindingCount: viewBindingCount,
        outputCount: viewDisposableCount, lastRenderRootNode: lastRenderRootNode
    };
}
exports.viewDef = viewDef;
function validateNode(parent, node, nodeCount) {
    var template = node.element && node.element.template;
    if (template) {
        if (!template.lastRenderRootNode) {
            throw new Error("Illegal State: Embedded templates without nodes are not allowed!");
        }
        if (template.lastRenderRootNode &&
            template.lastRenderRootNode.flags & 16777216 /* EmbeddedViews */) {
            throw new Error("Illegal State: Last root node of a template can't have embedded views, at index " + node.index + "!");
        }
    }
    if (node.flags & 20224 /* CatProvider */) {
        var parentFlags = parent ? parent.flags : 0;
        if ((parentFlags & 1 /* TypeElement */) === 0) {
            throw new Error("Illegal State: StaticProvider/Directive nodes need to be children of elements or anchors, at index " + node.index + "!");
        }
    }
    if (node.query) {
        if (node.flags & 67108864 /* TypeContentQuery */ &&
            (!parent || (parent.flags & 16384 /* TypeDirective */) === 0)) {
            throw new Error("Illegal State: Content Query nodes need to be children of directives, at index " + node.index + "!");
        }
        if (node.flags & 134217728 /* TypeViewQuery */ && parent) {
            throw new Error("Illegal State: View Query nodes have to be top level nodes, at index " + node.index + "!");
        }
    }
    if (node.childCount) {
        var parentEnd = parent ? parent.index + parent.childCount : nodeCount - 1;
        if (node.index <= parentEnd && node.index + node.childCount > parentEnd) {
            throw new Error("Illegal State: childCount of node leads outside of parent, at index " + node.index + "!");
        }
    }
}
function createEmbeddedView(parent, anchorDef, viewDef, context) {
    // embedded views are seen as siblings to the anchor, so we need
    // to get the parent of the anchor and use it as parentIndex.
    var view = createView(parent.root, parent.renderer, parent, anchorDef, viewDef);
    initView(view, parent.component, context);
    createViewNodes(view);
    return view;
}
exports.createEmbeddedView = createEmbeddedView;
function createRootView(root, def, context) {
    var view = createView(root, root.renderer, null, null, def);
    initView(view, context, context);
    createViewNodes(view);
    return view;
}
exports.createRootView = createRootView;
function createComponentView(parentView, nodeDef, viewDef, hostElement) {
    var rendererType = nodeDef.element.componentRendererType;
    var compRenderer;
    if (!rendererType) {
        compRenderer = parentView.root.renderer;
    }
    else {
        compRenderer = parentView.root.rendererFactory.createRenderer(hostElement, rendererType);
    }
    return createView(parentView.root, compRenderer, parentView, nodeDef.element.componentProvider, viewDef);
}
exports.createComponentView = createComponentView;
function createView(root, renderer, parent, parentNodeDef, def) {
    var nodes = new Array(def.nodes.length);
    var disposables = def.outputCount ? new Array(def.outputCount) : null;
    var view = {
        def: def,
        parent: parent,
        viewContainerParent: null, parentNodeDef: parentNodeDef,
        context: null,
        component: null, nodes: nodes,
        state: 13 /* CatInit */, root: root, renderer: renderer,
        oldValues: new Array(def.bindingCount), disposables: disposables
    };
    return view;
}
function initView(view, component, context) {
    view.component = component;
    view.context = context;
}
function createViewNodes(view) {
    var renderHost;
    if (util_1.isComponentView(view)) {
        var hostDef = view.parentNodeDef;
        renderHost = types_1.asElementData(view.parent, hostDef.parent.index).renderElement;
    }
    var def = view.def;
    var nodes = view.nodes;
    for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        types_1.Services.setCurrentNode(view, i);
        var nodeData = void 0;
        switch (nodeDef.flags & 201347067 /* Types */) {
            case 1 /* TypeElement */:
                var el = element_1.createElement(view, renderHost, nodeDef);
                var componentView = undefined;
                if (nodeDef.flags & 33554432 /* ComponentView */) {
                    var compViewDef = util_1.resolveDefinition(nodeDef.element.componentView);
                    componentView = types_1.Services.createComponentView(view, nodeDef, compViewDef, el);
                }
                element_1.listenToElementOutputs(view, componentView, nodeDef, el);
                nodeData = {
                    renderElement: el,
                    componentView: componentView,
                    viewContainer: null,
                    template: nodeDef.element.template ? refs_1.createTemplateData(view, nodeDef) : undefined
                };
                if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                    nodeData.viewContainer = refs_1.createViewContainerData(view, nodeDef, nodeData);
                }
                break;
            case 2 /* TypeText */:
                nodeData = text_1.createText(view, renderHost, nodeDef);
                break;
            case 512 /* TypeClassProvider */:
            case 1024 /* TypeFactoryProvider */:
            case 2048 /* TypeUseExistingProvider */:
            case 256 /* TypeValueProvider */: {
                var instance = provider_1.createProviderInstance(view, nodeDef);
                nodeData = { instance: instance };
                break;
            }
            case 16 /* TypePipe */: {
                var instance = provider_1.createPipeInstance(view, nodeDef);
                nodeData = { instance: instance };
                break;
            }
            case 16384 /* TypeDirective */: {
                var instance = provider_1.createDirectiveInstance(view, nodeDef);
                nodeData = { instance: instance };
                if (nodeDef.flags & 32768 /* Component */) {
                    var compView = types_1.asElementData(view, nodeDef.parent.index).componentView;
                    initView(compView, instance, instance);
                }
                break;
            }
            case 32 /* TypePureArray */:
            case 64 /* TypePureObject */:
            case 128 /* TypePurePipe */:
                nodeData = pure_expression_1.createPureExpression(view, nodeDef);
                break;
            case 67108864 /* TypeContentQuery */:
            case 134217728 /* TypeViewQuery */:
                nodeData = query_1.createQuery();
                break;
            case 8 /* TypeNgContent */:
                ng_content_1.appendNgContent(view, renderHost, nodeDef);
                // no runtime data needed for NgContent...
                nodeData = undefined;
                break;
        }
        nodes[i] = nodeData;
    }
    // Create the ViewData.nodes of component views after we created everything else,
    // so that e.g. ng-content works
    execComponentViewsAction(view, ViewAction.CreateViewNodes);
    // fill static content and view queries
    execQueriesAction(view, 67108864 /* TypeContentQuery */ | 134217728 /* TypeViewQuery */, 268435456 /* StaticQuery */, 0 /* CheckAndUpdate */);
}
function checkNoChangesView(view) {
    markProjectedViewsForCheck(view);
    types_1.Services.updateDirectives(view, 1 /* CheckNoChanges */);
    execEmbeddedViewsAction(view, ViewAction.CheckNoChanges);
    types_1.Services.updateRenderer(view, 1 /* CheckNoChanges */);
    execComponentViewsAction(view, ViewAction.CheckNoChanges);
    // Note: We don't check queries for changes as we didn't do this in v2.x.
    // TODO(tbosch): investigate if we can enable the check again in v5.x with a nicer error message.
    view.state &= ~(64 /* CheckProjectedViews */ | 32 /* CheckProjectedView */);
}
exports.checkNoChangesView = checkNoChangesView;
function checkAndUpdateView(view) {
    if (view.state & 1 /* BeforeFirstCheck */) {
        view.state &= ~1 /* BeforeFirstCheck */;
        view.state |= 2 /* FirstCheck */;
    }
    else {
        view.state &= ~2 /* FirstCheck */;
    }
    markProjectedViewsForCheck(view);
    types_1.Services.updateDirectives(view, 0 /* CheckAndUpdate */);
    execEmbeddedViewsAction(view, ViewAction.CheckAndUpdate);
    execQueriesAction(view, 67108864 /* TypeContentQuery */, 536870912 /* DynamicQuery */, 0 /* CheckAndUpdate */);
    provider_1.callLifecycleHooksChildrenFirst(view, 2097152 /* AfterContentChecked */ |
        (view.state & 2 /* FirstCheck */ ? 1048576 /* AfterContentInit */ : 0));
    types_1.Services.updateRenderer(view, 0 /* CheckAndUpdate */);
    execComponentViewsAction(view, ViewAction.CheckAndUpdate);
    execQueriesAction(view, 134217728 /* TypeViewQuery */, 536870912 /* DynamicQuery */, 0 /* CheckAndUpdate */);
    provider_1.callLifecycleHooksChildrenFirst(view, 8388608 /* AfterViewChecked */ |
        (view.state & 2 /* FirstCheck */ ? 4194304 /* AfterViewInit */ : 0));
    if (view.def.flags & 2 /* OnPush */) {
        view.state &= ~8 /* ChecksEnabled */;
    }
    view.state &= ~(64 /* CheckProjectedViews */ | 32 /* CheckProjectedView */);
}
exports.checkAndUpdateView = checkAndUpdateView;
function checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    if (argStyle === 0 /* Inline */) {
        return checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    }
    else {
        return checkAndUpdateNodeDynamic(view, nodeDef, v0);
    }
}
exports.checkAndUpdateNode = checkAndUpdateNode;
function markProjectedViewsForCheck(view) {
    var def = view.def;
    if (!(def.nodeFlags & 4 /* ProjectedTemplate */)) {
        return;
    }
    for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 4 /* ProjectedTemplate */) {
            var projectedViews = types_1.asElementData(view, i).template._projectedViews;
            if (projectedViews) {
                for (var i_1 = 0; i_1 < projectedViews.length; i_1++) {
                    var projectedView = projectedViews[i_1];
                    projectedView.state |= 32 /* CheckProjectedView */;
                    util_1.markParentViewsForCheckProjectedViews(projectedView, view);
                }
            }
        }
        else if ((nodeDef.childFlags & 4 /* ProjectedTemplate */) === 0) {
            // a parent with leafs
            // no child is a component,
            // then skip the children
            i += nodeDef.childCount;
        }
    }
}
function checkAndUpdateNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var changed = false;
    switch (nodeDef.flags & 201347067 /* Types */) {
        case 1 /* TypeElement */:
            changed = element_1.checkAndUpdateElementInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            break;
        case 2 /* TypeText */:
            changed = text_1.checkAndUpdateTextInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            break;
        case 16384 /* TypeDirective */:
            changed =
                provider_1.checkAndUpdateDirectiveInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            break;
        case 32 /* TypePureArray */:
        case 64 /* TypePureObject */:
        case 128 /* TypePurePipe */:
            changed =
                pure_expression_1.checkAndUpdatePureExpressionInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
            break;
    }
    return changed;
}
function checkAndUpdateNodeDynamic(view, nodeDef, values) {
    var changed = false;
    switch (nodeDef.flags & 201347067 /* Types */) {
        case 1 /* TypeElement */:
            changed = element_1.checkAndUpdateElementDynamic(view, nodeDef, values);
            break;
        case 2 /* TypeText */:
            changed = text_1.checkAndUpdateTextDynamic(view, nodeDef, values);
            break;
        case 16384 /* TypeDirective */:
            changed = provider_1.checkAndUpdateDirectiveDynamic(view, nodeDef, values);
            break;
        case 32 /* TypePureArray */:
        case 64 /* TypePureObject */:
        case 128 /* TypePurePipe */:
            changed = pure_expression_1.checkAndUpdatePureExpressionDynamic(view, nodeDef, values);
            break;
    }
    if (changed) {
        // Update oldValues after all bindings have been updated,
        // as a setter for a property might update other properties.
        var bindLen = nodeDef.bindings.length;
        var bindingStart = nodeDef.bindingIndex;
        var oldValues = view.oldValues;
        for (var i = 0; i < bindLen; i++) {
            oldValues[bindingStart + i] = values[i];
        }
    }
    return changed;
}
function checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    if (argStyle === 0 /* Inline */) {
        checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    }
    else {
        checkNoChangesNodeDynamic(view, nodeDef, v0);
    }
    // Returning false is ok here as we would have thrown in case of a change.
    return false;
}
exports.checkNoChangesNode = checkNoChangesNode;
function checkNoChangesNodeInline(view, nodeDef, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var bindLen = nodeDef.bindings.length;
    if (bindLen > 0)
        util_1.checkBindingNoChanges(view, nodeDef, 0, v0);
    if (bindLen > 1)
        util_1.checkBindingNoChanges(view, nodeDef, 1, v1);
    if (bindLen > 2)
        util_1.checkBindingNoChanges(view, nodeDef, 2, v2);
    if (bindLen > 3)
        util_1.checkBindingNoChanges(view, nodeDef, 3, v3);
    if (bindLen > 4)
        util_1.checkBindingNoChanges(view, nodeDef, 4, v4);
    if (bindLen > 5)
        util_1.checkBindingNoChanges(view, nodeDef, 5, v5);
    if (bindLen > 6)
        util_1.checkBindingNoChanges(view, nodeDef, 6, v6);
    if (bindLen > 7)
        util_1.checkBindingNoChanges(view, nodeDef, 7, v7);
    if (bindLen > 8)
        util_1.checkBindingNoChanges(view, nodeDef, 8, v8);
    if (bindLen > 9)
        util_1.checkBindingNoChanges(view, nodeDef, 9, v9);
}
function checkNoChangesNodeDynamic(view, nodeDef, values) {
    for (var i = 0; i < values.length; i++) {
        util_1.checkBindingNoChanges(view, nodeDef, i, values[i]);
    }
}
/**
 * Workaround https://github.com/angular/tsickle/issues/497
 * @suppress {misplacedTypeAnnotation}
 */
function checkNoChangesQuery(view, nodeDef) {
    var queryList = types_1.asQueryList(view, nodeDef.index);
    if (queryList.dirty) {
        throw errors_1.expressionChangedAfterItHasBeenCheckedError(types_1.Services.createDebugContext(view, nodeDef.index), "Query " + nodeDef.query.id + " not dirty", "Query " + nodeDef.query.id + " dirty", (view.state & 1 /* BeforeFirstCheck */) !== 0);
    }
}
function destroyView(view) {
    if (view.state & 128 /* Destroyed */) {
        return;
    }
    execEmbeddedViewsAction(view, ViewAction.Destroy);
    execComponentViewsAction(view, ViewAction.Destroy);
    provider_1.callLifecycleHooksChildrenFirst(view, 131072 /* OnDestroy */);
    if (view.disposables) {
        for (var i = 0; i < view.disposables.length; i++) {
            view.disposables[i]();
        }
    }
    view_attach_1.detachProjectedView(view);
    if (view.renderer.destroyNode) {
        destroyViewNodes(view);
    }
    if (util_1.isComponentView(view)) {
        view.renderer.destroy();
    }
    view.state |= 128 /* Destroyed */;
}
exports.destroyView = destroyView;
function destroyViewNodes(view) {
    var len = view.def.nodes.length;
    for (var i = 0; i < len; i++) {
        var def = view.def.nodes[i];
        if (def.flags & 1 /* TypeElement */) {
            view.renderer.destroyNode(types_1.asElementData(view, i).renderElement);
        }
        else if (def.flags & 2 /* TypeText */) {
            view.renderer.destroyNode(types_1.asTextData(view, i).renderText);
        }
    }
}
var ViewAction;
(function (ViewAction) {
    ViewAction[ViewAction["CreateViewNodes"] = 0] = "CreateViewNodes";
    ViewAction[ViewAction["CheckNoChanges"] = 1] = "CheckNoChanges";
    ViewAction[ViewAction["CheckNoChangesProjectedViews"] = 2] = "CheckNoChangesProjectedViews";
    ViewAction[ViewAction["CheckAndUpdate"] = 3] = "CheckAndUpdate";
    ViewAction[ViewAction["CheckAndUpdateProjectedViews"] = 4] = "CheckAndUpdateProjectedViews";
    ViewAction[ViewAction["Destroy"] = 5] = "Destroy";
})(ViewAction || (ViewAction = {}));
function execComponentViewsAction(view, action) {
    var def = view.def;
    if (!(def.nodeFlags & 33554432 /* ComponentView */)) {
        return;
    }
    for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 33554432 /* ComponentView */) {
            // a leaf
            callViewAction(types_1.asElementData(view, i).componentView, action);
        }
        else if ((nodeDef.childFlags & 33554432 /* ComponentView */) === 0) {
            // a parent with leafs
            // no child is a component,
            // then skip the children
            i += nodeDef.childCount;
        }
    }
}
function execEmbeddedViewsAction(view, action) {
    var def = view.def;
    if (!(def.nodeFlags & 16777216 /* EmbeddedViews */)) {
        return;
    }
    for (var i = 0; i < def.nodes.length; i++) {
        var nodeDef = def.nodes[i];
        if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
            // a leaf
            var embeddedViews = types_1.asElementData(view, i).viewContainer._embeddedViews;
            for (var k = 0; k < embeddedViews.length; k++) {
                callViewAction(embeddedViews[k], action);
            }
        }
        else if ((nodeDef.childFlags & 16777216 /* EmbeddedViews */) === 0) {
            // a parent with leafs
            // no child is a component,
            // then skip the children
            i += nodeDef.childCount;
        }
    }
}
function callViewAction(view, action) {
    var viewState = view.state;
    switch (action) {
        case ViewAction.CheckNoChanges:
            if ((viewState & 128 /* Destroyed */) === 0) {
                if ((viewState & 12 /* CatDetectChanges */) === 12 /* CatDetectChanges */) {
                    checkNoChangesView(view);
                }
                else if (viewState & 64 /* CheckProjectedViews */) {
                    execProjectedViewsAction(view, ViewAction.CheckNoChangesProjectedViews);
                }
            }
            break;
        case ViewAction.CheckNoChangesProjectedViews:
            if ((viewState & 128 /* Destroyed */) === 0) {
                if (viewState & 32 /* CheckProjectedView */) {
                    checkNoChangesView(view);
                }
                else if (viewState & 64 /* CheckProjectedViews */) {
                    execProjectedViewsAction(view, action);
                }
            }
            break;
        case ViewAction.CheckAndUpdate:
            if ((viewState & 128 /* Destroyed */) === 0) {
                if ((viewState & 12 /* CatDetectChanges */) === 12 /* CatDetectChanges */) {
                    checkAndUpdateView(view);
                }
                else if (viewState & 64 /* CheckProjectedViews */) {
                    execProjectedViewsAction(view, ViewAction.CheckAndUpdateProjectedViews);
                }
            }
            break;
        case ViewAction.CheckAndUpdateProjectedViews:
            if ((viewState & 128 /* Destroyed */) === 0) {
                if (viewState & 32 /* CheckProjectedView */) {
                    checkAndUpdateView(view);
                }
                else if (viewState & 64 /* CheckProjectedViews */) {
                    execProjectedViewsAction(view, action);
                }
            }
            break;
        case ViewAction.Destroy:
            // Note: destroyView recurses over all views,
            // so we don't need to special case projected views here.
            destroyView(view);
            break;
        case ViewAction.CreateViewNodes:
            createViewNodes(view);
            break;
    }
}
function execProjectedViewsAction(view, action) {
    execEmbeddedViewsAction(view, action);
    execComponentViewsAction(view, action);
}
function execQueriesAction(view, queryFlags, staticDynamicQueryFlag, checkType) {
    if (!(view.def.nodeFlags & queryFlags) || !(view.def.nodeFlags & staticDynamicQueryFlag)) {
        return;
    }
    var nodeCount = view.def.nodes.length;
    for (var i = 0; i < nodeCount; i++) {
        var nodeDef = view.def.nodes[i];
        if ((nodeDef.flags & queryFlags) && (nodeDef.flags & staticDynamicQueryFlag)) {
            types_1.Services.setCurrentNode(view, nodeDef.index);
            switch (checkType) {
                case 0 /* CheckAndUpdate */:
                    query_1.checkAndUpdateQuery(view, nodeDef);
                    break;
                case 1 /* CheckNoChanges */:
                    checkNoChangesQuery(view, nodeDef);
                    break;
            }
        }
        if (!(nodeDef.childFlags & queryFlags) || !(nodeDef.childFlags & staticDynamicQueryFlag)) {
            // no child has a matching query
            // then skip the children
            i += nodeDef.childCount;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILHFDQUEySDtBQUMzSCxtQ0FBcUU7QUFDckUsMkNBQTZDO0FBQzdDLHVDQUErTDtBQUMvTCxxREFBZ0k7QUFDaEksaUNBQXlEO0FBQ3pELCtCQUFtRTtBQUNuRSwrQkFBdUY7QUFDdkYsaUNBQXNQO0FBQ3RQLCtCQUF3STtBQUN4SSw2Q0FBa0Q7QUFFbEQsaUJBQ0ksS0FBZ0IsRUFBRSxLQUFnQixFQUFFLGdCQUErQixFQUNuRSxjQUE2QjtJQUMvQiw2Q0FBNkM7SUFDN0MsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7SUFDNUIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLElBQUksYUFBYSxHQUFpQixJQUFJLENBQUM7SUFDdkMsSUFBSSxnQ0FBZ0MsR0FBRyxLQUFLLENBQUM7SUFDN0MsSUFBSSxpQ0FBaUMsR0FBRyxLQUFLLENBQUM7SUFDOUMsSUFBSSxrQkFBa0IsR0FBaUIsSUFBSSxDQUFDO0lBQzVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sYUFBYSxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMzRSxJQUFNLFNBQVMsR0FBaUIsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FB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