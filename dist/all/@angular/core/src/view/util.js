"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_1 = require("../change_detection/change_detection");
var view_1 = require("../metadata/view");
var util_1 = require("../util");
var errors_1 = require("./errors");
var types_1 = require("./types");
exports.NOOP = function () { };
var _tokenKeyCache = new Map();
function tokenKey(token) {
    var key = _tokenKeyCache.get(token);
    if (!key) {
        key = util_1.stringify(token) + '_' + _tokenKeyCache.size;
        _tokenKeyCache.set(token, key);
    }
    return key;
}
exports.tokenKey = tokenKey;
function unwrapValue(view, nodeIdx, bindingIdx, value) {
    if (value instanceof change_detection_1.WrappedValue) {
        value = value.wrapped;
        var globalBindingIdx = view.def.nodes[nodeIdx].bindingIndex + bindingIdx;
        var oldValue = view.oldValues[globalBindingIdx];
        if (oldValue instanceof change_detection_1.WrappedValue) {
            oldValue = oldValue.wrapped;
        }
        view.oldValues[globalBindingIdx] = new change_detection_1.WrappedValue(oldValue);
    }
    return value;
}
exports.unwrapValue = unwrapValue;
var UNDEFINED_RENDERER_TYPE_ID = '$$undefined';
var EMPTY_RENDERER_TYPE_ID = '$$empty';
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
function createRendererType2(values) {
    return {
        id: UNDEFINED_RENDERER_TYPE_ID,
        styles: values.styles,
        encapsulation: values.encapsulation,
        data: values.data
    };
}
exports.createRendererType2 = createRendererType2;
var _renderCompCount = 0;
function resolveRendererType2(type) {
    if (type && type.id === UNDEFINED_RENDERER_TYPE_ID) {
        // first time we see this RendererType2. Initialize it...
        var isFilled = ((type.encapsulation != null && type.encapsulation !== view_1.ViewEncapsulation.None) ||
            type.styles.length || Object.keys(type.data).length);
        if (isFilled) {
            type.id = "c" + _renderCompCount++;
        }
        else {
            type.id = EMPTY_RENDERER_TYPE_ID;
        }
    }
    if (type && type.id === EMPTY_RENDERER_TYPE_ID) {
        type = null;
    }
    return type || null;
}
exports.resolveRendererType2 = resolveRendererType2;
function checkBinding(view, def, bindingIdx, value) {
    var oldValues = view.oldValues;
    if ((view.state & 2 /* FirstCheck */) ||
        !util_1.looseIdentical(oldValues[def.bindingIndex + bindingIdx], value)) {
        return true;
    }
    return false;
}
exports.checkBinding = checkBinding;
function checkAndUpdateBinding(view, def, bindingIdx, value) {
    if (checkBinding(view, def, bindingIdx, value)) {
        view.oldValues[def.bindingIndex + bindingIdx] = value;
        return true;
    }
    return false;
}
exports.checkAndUpdateBinding = checkAndUpdateBinding;
function checkBindingNoChanges(view, def, bindingIdx, value) {
    var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
    if ((view.state & 1 /* BeforeFirstCheck */) || !change_detection_1.devModeEqual(oldValue, value)) {
        throw errors_1.expressionChangedAfterItHasBeenCheckedError(types_1.Services.createDebugContext(view, def.index), oldValue, value, (view.state & 1 /* BeforeFirstCheck */) !== 0);
    }
}
exports.checkBindingNoChanges = checkBindingNoChanges;
function markParentViewsForCheck(view) {
    var currView = view;
    while (currView) {
        if (currView.def.flags & 2 /* OnPush */) {
            currView.state |= 8 /* ChecksEnabled */;
        }
        currView = currView.viewContainerParent || currView.parent;
    }
}
exports.markParentViewsForCheck = markParentViewsForCheck;
function markParentViewsForCheckProjectedViews(view, endView) {
    var currView = view;
    while (currView && currView !== endView) {
        currView.state |= 64 /* CheckProjectedViews */;
        currView = currView.viewContainerParent || currView.parent;
    }
}
exports.markParentViewsForCheckProjectedViews = markParentViewsForCheckProjectedViews;
function dispatchEvent(view, nodeIndex, eventName, event) {
    try {
        var nodeDef = view.def.nodes[nodeIndex];
        var startView = nodeDef.flags & 33554432 /* ComponentView */ ?
            types_1.asElementData(view, nodeIndex).componentView :
            view;
        markParentViewsForCheck(startView);
        return types_1.Services.handleEvent(view, nodeIndex, eventName, event);
    }
    catch (e) {
        // Attention: Don't rethrow, as it would cancel Observable subscriptions!
        view.root.errorHandler.handleError(e);
    }
}
exports.dispatchEvent = dispatchEvent;
function declaredViewContainer(view) {
    if (view.parent) {
        var parentView = view.parent;
        return types_1.asElementData(parentView, view.parentNodeDef.index);
    }
    return null;
}
exports.declaredViewContainer = declaredViewContainer;
/**
 * for component views, this is the host element.
 * for embedded views, this is the index of the parent node
 * that contains the view container.
 */
function viewParentEl(view) {
    var parentView = view.parent;
    if (parentView) {
        return view.parentNodeDef.parent;
    }
    else {
        return null;
    }
}
exports.viewParentEl = viewParentEl;
function renderNode(view, def) {
    switch (def.flags & 201347067 /* Types */) {
        case 1 /* TypeElement */:
            return types_1.asElementData(view, def.index).renderElement;
        case 2 /* TypeText */:
            return types_1.asTextData(view, def.index).renderText;
    }
}
exports.renderNode = renderNode;
function elementEventFullName(target, name) {
    return target ? target + ":" + name : name;
}
exports.elementEventFullName = elementEventFullName;
function isComponentView(view) {
    return !!view.parent && !!(view.parentNodeDef.flags & 32768 /* Component */);
}
exports.isComponentView = isComponentView;
function isEmbeddedView(view) {
    return !!view.parent && !(view.parentNodeDef.flags & 32768 /* Component */);
}
exports.isEmbeddedView = isEmbeddedView;
function filterQueryId(queryId) {
    return 1 << (queryId % 32);
}
exports.filterQueryId = filterQueryId;
function splitMatchedQueriesDsl(matchedQueriesDsl) {
    var matchedQueries = {};
    var matchedQueryIds = 0;
    var references = {};
    if (matchedQueriesDsl) {
        matchedQueriesDsl.forEach(function (_a) {
            var queryId = _a[0], valueType = _a[1];
            if (typeof queryId === 'number') {
                matchedQueries[queryId] = valueType;
                matchedQueryIds |= filterQueryId(queryId);
            }
            else {
                references[queryId] = valueType;
            }
        });
    }
    return { matchedQueries: matchedQueries, references: references, matchedQueryIds: matchedQueryIds };
}
exports.splitMatchedQueriesDsl = splitMatchedQueriesDsl;
function splitDepsDsl(deps) {
    return deps.map(function (value) {
        var token;
        var flags;
        if (Array.isArray(value)) {
            flags = value[0], token = value[1];
        }
        else {
            flags = 0 /* None */;
            token = value;
        }
        return { flags: flags, token: token, tokenKey: tokenKey(token) };
    });
}
exports.splitDepsDsl = splitDepsDsl;
function getParentRenderElement(view, renderHost, def) {
    var renderParent = def.renderParent;
    if (renderParent) {
        if ((renderParent.flags & 1 /* TypeElement */) === 0 ||
            (renderParent.flags & 33554432 /* ComponentView */) === 0 ||
            (renderParent.element.componentRendererType &&
                renderParent.element.componentRendererType.encapsulation ===
                    view_1.ViewEncapsulation.Native)) {
            // only children of non components, or children of components with native encapsulation should
            // be attached.
            return types_1.asElementData(view, def.renderParent.index).renderElement;
        }
    }
    else {
        return renderHost;
    }
}
exports.getParentRenderElement = getParentRenderElement;
var DEFINITION_CACHE = new WeakMap();
function resolveDefinition(factory) {
    var value = DEFINITION_CACHE.get(factory);
    if (!value) {
        value = factory(function () { return exports.NOOP; });
        value.factory = factory;
        DEFINITION_CACHE.set(factory, value);
    }
    return value;
}
exports.resolveDefinition = resolveDefinition;
function rootRenderNodes(view) {
    var renderNodes = [];
    visitRootRenderNodes(view, 0 /* Collect */, undefined, undefined, renderNodes);
    return renderNodes;
}
exports.rootRenderNodes = rootRenderNodes;
function visitRootRenderNodes(view, action, parentNode, nextSibling, target) {
    // We need to re-compute the parent node in case the nodes have been moved around manually
    if (action === 3 /* RemoveChild */) {
        parentNode = view.renderer.parentNode(renderNode(view, view.def.lastRenderRootNode));
    }
    visitSiblingRenderNodes(view, action, 0, view.def.nodes.length - 1, parentNode, nextSibling, target);
}
exports.visitRootRenderNodes = visitRootRenderNodes;
function visitSiblingRenderNodes(view, action, startIndex, endIndex, parentNode, nextSibling, target) {
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & (1 /* TypeElement */ | 2 /* TypeText */ | 8 /* TypeNgContent */)) {
            visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target);
        }
        // jump to next sibling
        i += nodeDef.childCount;
    }
}
exports.visitSiblingRenderNodes = visitSiblingRenderNodes;
function visitProjectedRenderNodes(view, ngContentIndex, action, parentNode, nextSibling, target) {
    var compView = view;
    while (compView && !isComponentView(compView)) {
        compView = compView.parent;
    }
    var hostView = compView.parent;
    var hostElDef = viewParentEl(compView);
    var startIndex = hostElDef.index + 1;
    var endIndex = hostElDef.index + hostElDef.childCount;
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = hostView.def.nodes[i];
        if (nodeDef.ngContentIndex === ngContentIndex) {
            visitRenderNode(hostView, nodeDef, action, parentNode, nextSibling, target);
        }
        // jump to next sibling
        i += nodeDef.childCount;
    }
    if (!hostView.parent) {
        // a root view
        var projectedNodes = view.root.projectableNodes[ngContentIndex];
        if (projectedNodes) {
            for (var i = 0; i < projectedNodes.length; i++) {
                execRenderNodeAction(view, projectedNodes[i], action, parentNode, nextSibling, target);
            }
        }
    }
}
exports.visitProjectedRenderNodes = visitProjectedRenderNodes;
function visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target) {
    if (nodeDef.flags & 8 /* TypeNgContent */) {
        visitProjectedRenderNodes(view, nodeDef.ngContent.index, action, parentNode, nextSibling, target);
    }
    else {
        var rn = renderNode(view, nodeDef);
        if (action === 3 /* RemoveChild */ && (nodeDef.flags & 33554432 /* ComponentView */) &&
            (nodeDef.bindingFlags & 48 /* CatSyntheticProperty */)) {
            // Note: we might need to do both actions.
            if (nodeDef.bindingFlags & (16 /* SyntheticProperty */)) {
                execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
            }
            if (nodeDef.bindingFlags & (32 /* SyntheticHostProperty */)) {
                var compView = types_1.asElementData(view, nodeDef.index).componentView;
                execRenderNodeAction(compView, rn, action, parentNode, nextSibling, target);
            }
        }
        else {
            execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
        }
        if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
            var embeddedViews = types_1.asElementData(view, nodeDef.index).viewContainer._embeddedViews;
            for (var k = 0; k < embeddedViews.length; k++) {
                visitRootRenderNodes(embeddedViews[k], action, parentNode, nextSibling, target);
            }
        }
        if (nodeDef.flags & 1 /* TypeElement */ && !nodeDef.element.name) {
            visitSiblingRenderNodes(view, action, nodeDef.index + 1, nodeDef.index + nodeDef.childCount, parentNode, nextSibling, target);
        }
    }
}
function execRenderNodeAction(view, renderNode, action, parentNode, nextSibling, target) {
    var renderer = view.renderer;
    switch (action) {
        case 1 /* AppendChild */:
            renderer.appendChild(parentNode, renderNode);
            break;
        case 2 /* InsertBefore */:
            renderer.insertBefore(parentNode, renderNode, nextSibling);
            break;
        case 3 /* RemoveChild */:
            renderer.removeChild(parentNode, renderNode);
            break;
        case 0 /* Collect */:
            target.push(renderNode);
            break;
    }
}
var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
function splitNamespace(name) {
    if (name[0] === ':') {
        var match = name.match(NS_PREFIX_RE);
        return [match[1], match[2]];
    }
    return ['', name];
}
exports.splitNamespace = splitNamespace;
function calcBindingFlags(bindings) {
    var flags = 0;
    for (var i = 0; i < bindings.length; i++) {
        flags |= bindings[i].flags;
    }
    return flags;
}
exports.calcBindingFlags = calcBindingFlags;
function interpolate(valueCount, constAndInterp) {
    var result = '';
    for (var i = 0; i < valueCount * 2; i = i + 2) {
        result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
    }
    return result + constAndInterp[valueCount * 2];
}
exports.interpolate = interpolate;
function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
    switch (valueCount) {
        case 1:
            return c0 + _toStringWithNull(a1) + c1;
        case 2:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
        case 3:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3;
        case 4:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4;
        case 5:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
        case 6:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
        case 7:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7;
        case 8:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
        case 9:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
        default:
            throw new Error("Does not support more than 9 expressions");
    }
}
exports.inlineInterpolate = inlineInterpolate;
function _toStringWithNull(v) {
    return v != null ? v.toString() : '';
}
exports.EMPTY_ARRAY = [];
exports.EMPTY_MAP = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlFQUFnRjtBQUNoRix5Q0FBbUQ7QUFFbkQsZ0NBQWtEO0FBRWxELG1DQUFxRTtBQUNyRSxpQ0FBK1A7QUFFbFAsUUFBQSxJQUFJLEdBQVEsY0FBTyxDQUFDLENBQUM7QUFFbEMsSUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztBQUU5QyxrQkFBeUIsS0FBVTtJQUNqQyxJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNULEdBQUcsR0FBRyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO1FBQ25ELGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVBELDRCQU9DO0FBRUQscUJBQTRCLElBQWMsRUFBRSxPQUFlLEVBQUUsVUFBa0IsRUFBRSxLQUFVO0lBQ3pGLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSwrQkFBWSxDQUFDLENBQUMsQ0FBQztRQUNsQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN0QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUM7UUFDekUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLFFBQVEsWUFB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