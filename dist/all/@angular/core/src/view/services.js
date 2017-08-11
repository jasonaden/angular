"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var application_ref_1 = require("../application_ref");
var debug_node_1 = require("../debug/debug_node");
var error_handler_1 = require("../error_handler");
var api_1 = require("../render/api");
var security_1 = require("../security");
var errors_1 = require("./errors");
var provider_1 = require("./provider");
var query_1 = require("./query");
var refs_1 = require("./refs");
var types_1 = require("./types");
var util_1 = require("./util");
var view_1 = require("./view");
var initialized = false;
function initServicesIfNeeded() {
    if (initialized) {
        return;
    }
    initialized = true;
    var services = application_ref_1.isDevMode() ? createDebugServices() : createProdServices();
    types_1.Services.setCurrentNode = services.setCurrentNode;
    types_1.Services.createRootView = services.createRootView;
    types_1.Services.createEmbeddedView = services.createEmbeddedView;
    types_1.Services.createComponentView = services.createComponentView;
    types_1.Services.createNgModuleRef = services.createNgModuleRef;
    types_1.Services.overrideProvider = services.overrideProvider;
    types_1.Services.clearProviderOverrides = services.clearProviderOverrides;
    types_1.Services.checkAndUpdateView = services.checkAndUpdateView;
    types_1.Services.checkNoChangesView = services.checkNoChangesView;
    types_1.Services.destroyView = services.destroyView;
    types_1.Services.resolveDep = provider_1.resolveDep;
    types_1.Services.createDebugContext = services.createDebugContext;
    types_1.Services.handleEvent = services.handleEvent;
    types_1.Services.updateDirectives = services.updateDirectives;
    types_1.Services.updateRenderer = services.updateRenderer;
    types_1.Services.dirtyParentQueries = query_1.dirtyParentQueries;
}
exports.initServicesIfNeeded = initServicesIfNeeded;
function createProdServices() {
    return {
        setCurrentNode: function () { },
        createRootView: createProdRootView,
        createEmbeddedView: view_1.createEmbeddedView,
        createComponentView: view_1.createComponentView,
        createNgModuleRef: refs_1.createNgModuleRef,
        overrideProvider: util_1.NOOP,
        clearProviderOverrides: util_1.NOOP,
        checkAndUpdateView: view_1.checkAndUpdateView,
        checkNoChangesView: view_1.checkNoChangesView,
        destroyView: view_1.destroyView,
        createDebugContext: function (view, nodeIndex) { return new DebugContext_(view, nodeIndex); },
        handleEvent: function (view, nodeIndex, eventName, event) {
            return view.def.handleEvent(view, nodeIndex, eventName, event);
        },
        updateDirectives: function (view, checkType) { return view.def.updateDirectives(checkType === 0 /* CheckAndUpdate */ ? prodCheckAndUpdateNode :
            prodCheckNoChangesNode, view); },
        updateRenderer: function (view, checkType) { return view.def.updateRenderer(checkType === 0 /* CheckAndUpdate */ ? prodCheckAndUpdateNode :
            prodCheckNoChangesNode, view); },
    };
}
function createDebugServices() {
    return {
        setCurrentNode: debugSetCurrentNode,
        createRootView: debugCreateRootView,
        createEmbeddedView: debugCreateEmbeddedView,
        createComponentView: debugCreateComponentView,
        createNgModuleRef: debugCreateNgModuleRef,
        overrideProvider: debugOverrideProvider,
        clearProviderOverrides: debugClearProviderOverrides,
        checkAndUpdateView: debugCheckAndUpdateView,
        checkNoChangesView: debugCheckNoChangesView,
        destroyView: debugDestroyView,
        createDebugContext: function (view, nodeIndex) { return new DebugContext_(view, nodeIndex); },
        handleEvent: debugHandleEvent,
        updateDirectives: debugUpdateDirectives,
        updateRenderer: debugUpdateRenderer,
    };
}
function createProdRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
    var rendererFactory = ngModule.injector.get(api_1.RendererFactory2);
    return view_1.createRootView(createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode), def, context);
}
function debugCreateRootView(elInjector, projectableNodes, rootSelectorOrNode, def, ngModule, context) {
    var rendererFactory = ngModule.injector.get(api_1.RendererFactory2);
    var root = createRootData(elInjector, ngModule, new DebugRendererFactory2(rendererFactory), projectableNodes, rootSelectorOrNode);
    var defWithOverride = applyProviderOverridesToView(def);
    return callWithDebugContext(DebugAction.create, view_1.createRootView, null, [root, defWithOverride, context]);
}
function createRootData(elInjector, ngModule, rendererFactory, projectableNodes, rootSelectorOrNode) {
    var sanitizer = ngModule.injector.get(security_1.Sanitizer);
    var errorHandler = ngModule.injector.get(error_handler_1.ErrorHandler);
    var renderer = rendererFactory.createRenderer(null, null);
    return {
        ngModule: ngModule,
        injector: elInjector, projectableNodes: projectableNodes,
        selectorOrNode: rootSelectorOrNode, sanitizer: sanitizer, rendererFactory: rendererFactory, renderer: renderer, errorHandler: errorHandler
    };
}
function debugCreateEmbeddedView(parentView, anchorDef, viewDef, context) {
    var defWithOverride = applyProviderOverridesToView(viewDef);
    return callWithDebugContext(DebugAction.create, view_1.createEmbeddedView, null, [parentView, anchorDef, defWithOverride, context]);
}
function debugCreateComponentView(parentView, nodeDef, viewDef, hostElement) {
    var defWithOverride = applyProviderOverridesToView(viewDef);
    return callWithDebugContext(DebugAction.create, view_1.createComponentView, null, [parentView, nodeDef, defWithOverride, hostElement]);
}
function debugCreateNgModuleRef(moduleType, parentInjector, bootstrapComponents, def) {
    var defWithOverride = applyProviderOverridesToNgModule(def);
    return refs_1.createNgModuleRef(moduleType, parentInjector, bootstrapComponents, defWithOverride);
}
var providerOverrides = new Map();
function debugOverrideProvider(override) {
    providerOverrides.set(override.token, override);
}
function debugClearProviderOverrides() {
    providerOverrides.clear();
}
// Notes about the algorithm:
// 1) Locate the providers of an element and check if one of them was overwritten
// 2) Change the providers of that element
//
// We only create new datastructures if we need to, to keep perf impact
// reasonable.
function applyProviderOverridesToView(def) {
    if (providerOverrides.size === 0) {
        return def;
    }
    var elementIndicesWithOverwrittenProviders = findElementIndicesWithOverwrittenProviders(def);
    if (elementIndicesWithOverwrittenProviders.length === 0) {
        return def;
    }
    // clone the whole view definition,
    // as it maintains references between the nodes that are hard to update.
    def = def.factory(function () { return util_1.NOOP; });
    for (var i = 0; i < elementIndicesWithOverwrittenProviders.length; i++) {
        applyProviderOverridesToElement(def, elementIndicesWithOverwrittenProviders[i]);
    }
    return def;
    function findElementIndicesWithOverwrittenProviders(def) {
        var elIndicesWithOverwrittenProviders = [];
        var lastElementDef = null;
        for (var i = 0; i < def.nodes.length; i++) {
            var nodeDef = def.nodes[i];
            if (nodeDef.flags & 1 /* TypeElement */) {
                lastElementDef = nodeDef;
            }
            if (lastElementDef && nodeDef.flags & 3840 /* CatProviderNoDirective */ &&
                providerOverrides.has(nodeDef.provider.token)) {
                elIndicesWithOverwrittenProviders.push(lastElementDef.index);
                lastElementDef = null;
            }
        }
        return elIndicesWithOverwrittenProviders;
    }
    function applyProviderOverridesToElement(viewDef, elIndex) {
        for (var i = elIndex + 1; i < viewDef.nodes.length; i++) {
            var nodeDef = viewDef.nodes[i];
            if (nodeDef.flags & 1 /* TypeElement */) {
                // stop at the next element
                return;
            }
            if (nodeDef.flags & 3840 /* CatProviderNoDirective */) {
                // Make all providers lazy, so that we don't get into trouble
                // with ordering problems of providers on the same element
                nodeDef.flags |= 4096 /* LazyProvider */;
                var provider = nodeDef.provider;
                var override = providerOverrides.get(provider.token);
                if (override) {
                    nodeDef.flags = (nodeDef.flags & ~3840 /* CatProviderNoDirective */) | override.flags;
                    provider.deps = util_1.splitDepsDsl(override.deps);
                    provider.value = override.value;
                }
            }
        }
    }
}
// Notes about the algorithm:
// We only create new datastructures if we need to, to keep perf impact
// reasonable.
function applyProviderOverridesToNgModule(def) {
    if (providerOverrides.size === 0 || !hasOverrrides(def)) {
        return def;
    }
    // clone the whole view definition,
    // as it maintains references between the nodes that are hard to update.
    def = def.factory(function () { return util_1.NOOP; });
    applyProviderOverrides(def);
    return def;
    function hasOverrrides(def) {
        return def.providers.some(function (node) {
            return !!(node.flags & 3840 /* CatProviderNoDirective */) && providerOverrides.has(node.token);
        });
    }
    function applyProviderOverrides(def) {
        for (var i = 0; i < def.providers.length; i++) {
            var provider = def.providers[i];
            // Make all providers lazy, so that we don't get into trouble
            // with ordering problems of providers on the same element
            provider.flags |= 4096 /* LazyProvider */;
            var override = providerOverrides.get(provider.token);
            if (override) {
                provider.flags = (provider.flags & ~3840 /* CatProviderNoDirective */) | override.flags;
                provider.deps = util_1.splitDepsDsl(override.deps);
                provider.value = override.value;
            }
        }
    }
}
function prodCheckAndUpdateNode(view, nodeIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var nodeDef = view.def.nodes[nodeIndex];
    view_1.checkAndUpdateNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    return (nodeDef.flags & 224 /* CatPureExpression */) ?
        types_1.asPureExpressionData(view, nodeIndex).value :
        undefined;
}
function prodCheckNoChangesNode(view, nodeIndex, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var nodeDef = view.def.nodes[nodeIndex];
    view_1.checkNoChangesNode(view, nodeDef, argStyle, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9);
    return (nodeDef.flags & 224 /* CatPureExpression */) ?
        types_1.asPureExpressionData(view, nodeIndex).value :
        undefined;
}
function debugCheckAndUpdateView(view) {
    return callWithDebugContext(DebugAction.detectChanges, view_1.checkAndUpdateView, null, [view]);
}
function debugCheckNoChangesView(view) {
    return callWithDebugContext(DebugAction.checkNoChanges, view_1.checkNoChangesView, null, [view]);
}
function debugDestroyView(view) {
    return callWithDebugContext(DebugAction.destroy, view_1.destroyView, null, [view]);
}
var DebugAction;
(function (DebugAction) {
    DebugAction[DebugAction["create"] = 0] = "create";
    DebugAction[DebugAction["detectChanges"] = 1] = "detectChanges";
    DebugAction[DebugAction["checkNoChanges"] = 2] = "checkNoChanges";
    DebugAction[DebugAction["destroy"] = 3] = "destroy";
    DebugAction[DebugAction["handleEvent"] = 4] = "handleEvent";
})(DebugAction || (DebugAction = {}));
var _currentAction;
var _currentView;
var _currentNodeIndex;
function debugSetCurrentNode(view, nodeIndex) {
    _currentView = view;
    _currentNodeIndex = nodeIndex;
}
function debugHandleEvent(view, nodeIndex, eventName, event) {
    debugSetCurrentNode(view, nodeIndex);
    return callWithDebugContext(DebugAction.handleEvent, view.def.handleEvent, null, [view, nodeIndex, eventName, event]);
}
function debugUpdateDirectives(view, checkType) {
    if (view.state & 128 /* Destroyed */) {
        throw errors_1.viewDestroyedError(DebugAction[_currentAction]);
    }
    debugSetCurrentNode(view, nextDirectiveWithBinding(view, 0));
    return view.def.updateDirectives(debugCheckDirectivesFn, view);
    function debugCheckDirectivesFn(view, nodeIndex, argStyle) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            values[_i - 3] = arguments[_i];
        }
        var nodeDef = view.def.nodes[nodeIndex];
        if (checkType === 0 /* CheckAndUpdate */) {
            debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
        }
        else {
            debugCheckNoChangesNode(view, nodeDef, argStyle, values);
        }
        if (nodeDef.flags & 16384 /* TypeDirective */) {
            debugSetCurrentNode(view, nextDirectiveWithBinding(view, nodeIndex));
        }
        return (nodeDef.flags & 224 /* CatPureExpression */) ?
            types_1.asPureExpressionData(view, nodeDef.index).value :
            undefined;
    }
}
function debugUpdateRenderer(view, checkType) {
    if (view.state & 128 /* Destroyed */) {
        throw errors_1.viewDestroyedError(DebugAction[_currentAction]);
    }
    debugSetCurrentNode(view, nextRenderNodeWithBinding(view, 0));
    return view.def.updateRenderer(debugCheckRenderNodeFn, view);
    function debugCheckRenderNodeFn(view, nodeIndex, argStyle) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            values[_i - 3] = arguments[_i];
        }
        var nodeDef = view.def.nodes[nodeIndex];
        if (checkType === 0 /* CheckAndUpdate */) {
            debugCheckAndUpdateNode(view, nodeDef, argStyle, values);
        }
        else {
            debugCheckNoChangesNode(view, nodeDef, argStyle, values);
        }
        if (nodeDef.flags & 3 /* CatRenderNode */) {
            debugSetCurrentNode(view, nextRenderNodeWithBinding(view, nodeIndex));
        }
        return (nodeDef.flags & 224 /* CatPureExpression */) ?
            types_1.asPureExpressionData(view, nodeDef.index).value :
            undefined;
    }
}
function debugCheckAndUpdateNode(view, nodeDef, argStyle, givenValues) {
    var changed = view_1.checkAndUpdateNode.apply(void 0, [view, nodeDef, argStyle].concat(givenValues));
    if (changed) {
        var values = argStyle === 1 /* Dynamic */ ? givenValues[0] : givenValues;
        if (nodeDef.flags & 16384 /* TypeDirective */) {
            var bindingValues = {};
            for (var i = 0; i < nodeDef.bindings.length; i++) {
                var binding = nodeDef.bindings[i];
                var value = values[i];
                if (binding.flags & 8 /* TypeProperty */) {
                    bindingValues[normalizeDebugBindingName(binding.nonMinifiedName)] =
                        normalizeDebugBindingValue(value);
                }
            }
            var elDef = nodeDef.parent;
            var el = types_1.asElementData(view, elDef.index).renderElement;
            if (!elDef.element.name) {
                // a comment.
                view.renderer.setValue(el, "bindings=" + JSON.stringify(bindingValues, null, 2));
            }
            else {
                // a regular element.
                for (var attr in bindingValues) {
                    var value = bindingValues[attr];
                    if (value != null) {
                        view.renderer.setAttribute(el, attr, value);
                    }
                    else {
                        view.renderer.removeAttribute(el, attr);
                    }
                }
            }
        }
    }
}
function debugCheckNoChangesNode(view, nodeDef, argStyle, values) {
    view_1.checkNoChangesNode.apply(void 0, [view, nodeDef, argStyle].concat(values));
}
function normalizeDebugBindingName(name) {
    // Attribute names with `$` (eg `x-y$`) are valid per spec, but unsupported by some browsers
    name = camelCaseToDashCase(name.replace(/[$@]/g, '_'));
    return "ng-reflect-" + name;
}
var CAMEL_CASE_REGEXP = /([A-Z])/g;
function camelCaseToDashCase(input) {
    return input.replace(CAMEL_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return '-' + m[1].toLowerCase();
    });
}
function normalizeDebugBindingValue(value) {
    try {
        // Limit the size of the value as otherwise the DOM just gets polluted.
        return value != null ? value.toString().slice(0, 30) : value;
    }
    catch (e) {
        return '[ERROR] Exception while trying to serialize the value';
    }
}
function nextDirectiveWithBinding(view, nodeIndex) {
    for (var i = nodeIndex; i < view.def.nodes.length; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & 16384 /* TypeDirective */ && nodeDef.bindings && nodeDef.bindings.length) {
            return i;
        }
    }
    return null;
}
function nextRenderNodeWithBinding(view, nodeIndex) {
    for (var i = nodeIndex; i < view.def.nodes.length; i++) {
        var nodeDef = view.def.nodes[i];
        if ((nodeDef.flags & 3 /* CatRenderNode */) && nodeDef.bindings && nodeDef.bindings.length) {
            return i;
        }
    }
    return null;
}
var DebugContext_ = (function () {
    function DebugContext_(view, nodeIndex) {
        this.view = view;
        this.nodeIndex = nodeIndex;
        if (nodeIndex == null) {
            this.nodeIndex = nodeIndex = 0;
        }
        this.nodeDef = view.def.nodes[nodeIndex];
        var elDef = this.nodeDef;
        var elView = view;
        while (elDef && (elDef.flags & 1 /* TypeElement */) === 0) {
            elDef = elDef.parent;
        }
        if (!elDef) {
            while (!elDef && elView) {
                elDef = util_1.viewParentEl(elView);
                elView = elView.parent;
            }
        }
        this.elDef = elDef;
        this.elView = elView;
    }
    Object.defineProperty(DebugContext_.prototype, "elOrCompView", {
        get: function () {
            // Has to be done lazily as we use the DebugContext also during creation of elements...
            return types_1.asElementData(this.elView, this.elDef.index).componentView || this.view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "injector", {
        get: function () { return refs_1.createInjector(this.elView, this.elDef); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "component", {
        get: function () { return this.elOrCompView.component; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "context", {
        get: function () { return this.elOrCompView.context; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "providerTokens", {
        get: function () {
            var tokens = [];
            if (this.elDef) {
                for (var i = this.elDef.index + 1; i <= this.elDef.index + this.elDef.childCount; i++) {
                    var childDef = this.elView.def.nodes[i];
                    if (childDef.flags & 20224 /* CatProvider */) {
                        tokens.push(childDef.provider.token);
                    }
                    i += childDef.childCount;
                }
            }
            return tokens;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "references", {
        get: function () {
            var references = {};
            if (this.elDef) {
                collectReferences(this.elView, this.elDef, references);
                for (var i = this.elDef.index + 1; i <= this.elDef.index + this.elDef.childCount; i++) {
                    var childDef = this.elView.def.nodes[i];
                    if (childDef.flags & 20224 /* CatProvider */) {
                        collectReferences(this.elView, childDef, references);
                    }
                    i += childDef.childCount;
                }
            }
            return references;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "componentRenderElement", {
        get: function () {
            var elData = findHostElement(this.elOrCompView);
            return elData ? elData.renderElement : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext_.prototype, "renderNode", {
        get: function () {
            return this.nodeDef.flags & 2 /* TypeText */ ? util_1.renderNode(this.view, this.nodeDef) :
                util_1.renderNode(this.elView, this.elDef);
        },
        enumerable: true,
        configurable: true
    });
    DebugContext_.prototype.logError = function (console) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var logViewDef;
        var logNodeIndex;
        if (this.nodeDef.flags & 2 /* TypeText */) {
            logViewDef = this.view.def;
            logNodeIndex = this.nodeDef.index;
        }
        else {
            logViewDef = this.elView.def;
            logNodeIndex = this.elDef.index;
        }
        // Note: we only generate a log function for text and element nodes
        // to make the generated code as small as possible.
        var renderNodeIndex = getRenderNodeIndex(logViewDef, logNodeIndex);
        var currRenderNodeIndex = -1;
        var nodeLogger = function () {
            currRenderNodeIndex++;
            if (currRenderNodeIndex === renderNodeIndex) {
                return (_a = console.error).bind.apply(_a, [console].concat(values));
            }
            else {
                return util_1.NOOP;
            }
            var _a;
        };
        logViewDef.factory(nodeLogger);
        if (currRenderNodeIndex < renderNodeIndex) {
            console.error('Illegal state: the ViewDefinitionFactory did not call the logger!');
            console.error.apply(console, values);
        }
    };
    return DebugContext_;
}());
function getRenderNodeIndex(viewDef, nodeIndex) {
    var renderNodeIndex = -1;
    for (var i = 0; i <= nodeIndex; i++) {
        var nodeDef = viewDef.nodes[i];
        if (nodeDef.flags & 3 /* CatRenderNode */) {
            renderNodeIndex++;
        }
    }
    return renderNodeIndex;
}
function findHostElement(view) {
    while (view && !util_1.isComponentView(view)) {
        view = view.parent;
    }
    if (view.parent) {
        return types_1.asElementData(view.parent, util_1.viewParentEl(view).index);
    }
    return null;
}
function collectReferences(view, nodeDef, references) {
    for (var refName in nodeDef.references) {
        references[refName] = query_1.getQueryValue(view, nodeDef, nodeDef.references[refName]);
    }
}
function callWithDebugContext(action, fn, self, args) {
    var oldAction = _currentAction;
    var oldView = _currentView;
    var oldNodeIndex = _currentNodeIndex;
    try {
        _currentAction = action;
        var result = fn.apply(self, args);
        _currentView = oldView;
        _currentNodeIndex = oldNodeIndex;
        _currentAction = oldAction;
        return result;
    }
    catch (e) {
        if (errors_1.isViewDebugError(e) || !_currentView) {
            throw e;
        }
        throw errors_1.viewWrappedDebugError(e, getCurrentDebugContext());
    }
}
function getCurrentDebugContext() {
    return _currentView ? new DebugContext_(_currentView, _currentNodeIndex) : null;
}
exports.getCurrentDebugContext = getCurrentDebugContext;
var DebugRendererFactory2 = (function () {
    function DebugRendererFactory2(delegate) {
        this.delegate = delegate;
    }
    DebugRendererFactory2.prototype.createRenderer = function (element, renderData) {
        return new DebugRenderer2(this.delegate.createRenderer(element, renderData));
    };
    DebugRendererFactory2.prototype.begin = function () {
        if (this.delegate.begin) {
            this.delegate.begin();
        }
    };
    DebugRendererFactory2.prototype.end = function () {
        if (this.delegate.end) {
            this.delegate.end();
        }
    };
    DebugRendererFactory2.prototype.whenRenderingDone = function () {
        if (this.delegate.whenRenderingDone) {
            return this.delegate.whenRenderingDone();
        }
        return Promise.resolve(null);
    };
    return DebugRendererFactory2;
}());
var DebugRenderer2 = (function () {
    function DebugRenderer2(delegate) {
        this.delegate = delegate;
    }
    Object.defineProperty(DebugRenderer2.prototype, "data", {
        get: function () { return this.delegate.data; },
        enumerable: true,
        configurable: true
    });
    DebugRenderer2.prototype.destroyNode = function (node) {
        debug_node_1.removeDebugNodeFromIndex(debug_node_1.getDebugNode(node));
        if (this.delegate.destroyNode) {
            this.delegate.destroyNode(node);
        }
    };
    DebugRenderer2.prototype.destroy = function () { this.delegate.destroy(); };
    DebugRenderer2.prototype.createElement = function (name, namespace) {
        var el = this.delegate.createElement(name, namespace);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
            var debugEl = new debug_node_1.DebugElement(el, null, debugCtx);
            debugEl.name = name;
            debug_node_1.indexDebugNode(debugEl);
        }
        return el;
    };
    DebugRenderer2.prototype.createComment = function (value) {
        var comment = this.delegate.createComment(value);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
            debug_node_1.indexDebugNode(new debug_node_1.DebugNode(comment, null, debugCtx));
        }
        return comment;
    };
    DebugRenderer2.prototype.createText = function (value) {
        var text = this.delegate.createText(value);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
            debug_node_1.indexDebugNode(new debug_node_1.DebugNode(text, null, debugCtx));
        }
        return text;
    };
    DebugRenderer2.prototype.appendChild = function (parent, newChild) {
        var debugEl = debug_node_1.getDebugNode(parent);
        var debugChildEl = debug_node_1.getDebugNode(newChild);
        if (debugEl && debugChildEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.addChild(debugChildEl);
        }
        this.delegate.appendChild(parent, newChild);
    };
    DebugRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        var debugEl = debug_node_1.getDebugNode(parent);
        var debugChildEl = debug_node_1.getDebugNode(newChild);
        var debugRefEl = debug_node_1.getDebugNode(refChild);
        if (debugEl && debugChildEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.insertBefore(debugRefEl, debugChildEl);
        }
        this.delegate.insertBefore(parent, newChild, refChild);
    };
    DebugRenderer2.prototype.removeChild = function (parent, oldChild) {
        var debugEl = debug_node_1.getDebugNode(parent);
        var debugChildEl = debug_node_1.getDebugNode(oldChild);
        if (debugEl && debugChildEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.removeChild(debugChildEl);
        }
        this.delegate.removeChild(parent, oldChild);
    };
    DebugRenderer2.prototype.selectRootElement = function (selectorOrNode) {
        var el = this.delegate.selectRootElement(selectorOrNode);
        var debugCtx = getCurrentDebugContext();
        if (debugCtx) {
            debug_node_1.indexDebugNode(new debug_node_1.DebugElement(el, null, debugCtx));
        }
        return el;
    };
    DebugRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            var fullName = namespace ? namespace + ':' + name : name;
            debugEl.attributes[fullName] = value;
        }
        this.delegate.setAttribute(el, name, value, namespace);
    };
    DebugRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            var fullName = namespace ? namespace + ':' + name : name;
            debugEl.attributes[fullName] = null;
        }
        this.delegate.removeAttribute(el, name, namespace);
    };
    DebugRenderer2.prototype.addClass = function (el, name) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.classes[name] = true;
        }
        this.delegate.addClass(el, name);
    };
    DebugRenderer2.prototype.removeClass = function (el, name) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.classes[name] = false;
        }
        this.delegate.removeClass(el, name);
    };
    DebugRenderer2.prototype.setStyle = function (el, style, value, flags) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.styles[style] = value;
        }
        this.delegate.setStyle(el, style, value, flags);
    };
    DebugRenderer2.prototype.removeStyle = function (el, style, flags) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.styles[style] = null;
        }
        this.delegate.removeStyle(el, style, flags);
    };
    DebugRenderer2.prototype.setProperty = function (el, name, value) {
        var debugEl = debug_node_1.getDebugNode(el);
        if (debugEl && debugEl instanceof debug_node_1.DebugElement) {
            debugEl.properties[name] = value;
        }
        this.delegate.setProperty(el, name, value);
    };
    DebugRenderer2.prototype.listen = function (target, eventName, callback) {
        if (typeof target !== 'string') {
            var debugEl = debug_node_1.getDebugNode(target);
            if (debugEl) {
                debugEl.listeners.push(new debug_node_1.EventListener(eventName, callback));
            }
        }
        return this.delegate.listen(target, eventName, callback);
    };
    DebugRenderer2.prototype.parentNode = function (node) { return this.delegate.parentNode(node); };
    DebugRenderer2.prototype.nextSibling = function (node) { return this.delegate.nextSibling(node); };
    DebugRenderer2.prototype.setValue = function (node, value) { return this.delegate.setValue(node, value); };
    return DebugRenderer2;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3NlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0RBQTZDO0FBQzdDLGtEQUFtSTtBQUVuSSxrREFBOEM7QUFFOUMscUNBQThGO0FBQzlGLHdDQUFzQztBQUd0QyxtQ0FBcUY7QUFDckYsdUNBQXNDO0FBQ3RDLGlDQUEwRDtBQUMxRCwrQkFBeUQ7QUFDekQsaUNBQTBSO0FBQzFSLCtCQUFxRjtBQUNyRiwrQkFBNEs7QUFHNUssSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBRXhCO0lBQ0UsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUM7SUFDVCxDQUFDO0lBQ0QsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRywyQkFBUyxFQUFFLEdBQUcsbUJBQW1CLEVBQUUsR0FBRyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVFLGdCQUFRLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7SUFDbEQsZ0JBQVEsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztJQUNsRCxnQkFBUSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztJQUMxRCxnQkFBUSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztJQUM1RCxnQkFBUSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztJQUN4RCxnQkFBUSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztJQUN0RCxnQkFBUSxDQUFDLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQztJQUNsRSxnQkFBUSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxr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