"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var security_1 = require("../security");
var types_1 = require("./types");
var util_1 = require("./util");
function anchorDef(flags, matchedQueriesDsl, ngContentIndex, childCount, handleEvent, templateFactory) {
    flags |= 1 /* TypeElement */;
    var _a = util_1.splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
    var template = templateFactory ? util_1.resolveDefinition(templateFactory) : null;
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0, matchedQueries: matchedQueries, matchedQueryIds: matchedQueryIds, references: references, ngContentIndex: ngContentIndex, childCount: childCount,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: {
            ns: null,
            name: null,
            attrs: null, template: template,
            componentProvider: null,
            componentView: null,
            componentRendererType: null,
            publicProviders: null,
            allProviders: null,
            handleEvent: handleEvent || util_1.NOOP
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
}
exports.anchorDef = anchorDef;
function elementDef(flags, matchedQueriesDsl, ngContentIndex, childCount, namespaceAndName, fixedAttrs, bindings, outputs, handleEvent, componentView, componentRendererType) {
    if (fixedAttrs === void 0) { fixedAttrs = []; }
    if (!handleEvent) {
        handleEvent = util_1.NOOP;
    }
    var _a = util_1.splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
    var ns = null;
    var name = null;
    if (namespaceAndName) {
        _b = util_1.splitNamespace(namespaceAndName), ns = _b[0], name = _b[1];
    }
    bindings = bindings || [];
    var bindingDefs = new Array(bindings.length);
    for (var i = 0; i < bindings.length; i++) {
        var _c = bindings[i], bindingFlags = _c[0], namespaceAndName_1 = _c[1], suffixOrSecurityContext = _c[2];
        var _d = util_1.splitNamespace(namespaceAndName_1), ns_1 = _d[0], name_1 = _d[1];
        var securityContext = undefined;
        var suffix = undefined;
        switch (bindingFlags & 15 /* Types */) {
            case 4 /* TypeElementStyle */:
                suffix = suffixOrSecurityContext;
                break;
            case 1 /* TypeElementAttribute */:
            case 8 /* TypeProperty */:
                securityContext = suffixOrSecurityContext;
                break;
        }
        bindingDefs[i] =
            { flags: bindingFlags, ns: ns_1, name: name_1, nonMinifiedName: name_1, securityContext: securityContext, suffix: suffix };
    }
    outputs = outputs || [];
    var outputDefs = new Array(outputs.length);
    for (var i = 0; i < outputs.length; i++) {
        var _e = outputs[i], target = _e[0], eventName = _e[1];
        outputDefs[i] = {
            type: 0 /* ElementOutput */,
            target: target, eventName: eventName,
            propName: null
        };
    }
    fixedAttrs = fixedAttrs || [];
    var attrs = fixedAttrs.map(function (_a) {
        var namespaceAndName = _a[0], value = _a[1];
        var _b = util_1.splitNamespace(namespaceAndName), ns = _b[0], name = _b[1];
        return [ns, name, value];
    });
    componentRendererType = util_1.resolveRendererType2(componentRendererType);
    if (componentView) {
        flags |= 33554432 /* ComponentView */;
    }
    flags |= 1 /* TypeElement */;
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0, matchedQueries: matchedQueries, matchedQueryIds: matchedQueryIds, references: references, ngContentIndex: ngContentIndex, childCount: childCount,
        bindings: bindingDefs,
        bindingFlags: util_1.calcBindingFlags(bindingDefs),
        outputs: outputDefs,
        element: {
            ns: ns,
            name: name,
            attrs: attrs,
            template: null,
            // will bet set by the view definition
            componentProvider: null,
            componentView: componentView || null,
            componentRendererType: componentRendererType,
            publicProviders: null,
            allProviders: null,
            handleEvent: handleEvent || util_1.NOOP,
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
    var _b;
}
exports.elementDef = elementDef;
function createElement(view, renderHost, def) {
    var elDef = def.element;
    var rootSelectorOrNode = view.root.selectorOrNode;
    var renderer = view.renderer;
    var el;
    if (view.parent || !rootSelectorOrNode) {
        if (elDef.name) {
            el = renderer.createElement(elDef.name, elDef.ns);
        }
        else {
            el = renderer.createComment('');
        }
        var parentEl = util_1.getParentRenderElement(view, renderHost, def);
        if (parentEl) {
            renderer.appendChild(parentEl, el);
        }
    }
    else {
        el = renderer.selectRootElement(rootSelectorOrNode);
    }
    if (elDef.attrs) {
        for (var i = 0; i < elDef.attrs.length; i++) {
            var _a = elDef.attrs[i], ns = _a[0], name_2 = _a[1], value = _a[2];
            renderer.setAttribute(el, name_2, value, ns);
        }
    }
    return el;
}
exports.createElement = createElement;
function listenToElementOutputs(view, compView, def, el) {
    for (var i = 0; i < def.outputs.length; i++) {
        var output = def.outputs[i];
        var handleEventClosure = renderEventHandlerClosure(view, def.index, util_1.elementEventFullName(output.target, output.eventName));
        var listenTarget = output.target;
        var listenerView = view;
        if (output.target === 'component') {
            listenTarget = null;
            listenerView = compView;
        }
        var disposable = listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure);
        view.disposables[def.outputIndex + i] = disposable;
    }
}
exports.listenToElementOutputs = listenToElementOutputs;
function renderEventHandlerClosure(view, index, eventName) {
    return function (event) { return util_1.dispatchEvent(view, index, eventName, event); };
}
function checkAndUpdateElementInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var bindLen = def.bindings.length;
    var changed = false;
    if (bindLen > 0 && checkAndUpdateElementValue(view, def, 0, v0))
        changed = true;
    if (bindLen > 1 && checkAndUpdateElementValue(view, def, 1, v1))
        changed = true;
    if (bindLen > 2 && checkAndUpdateElementValue(view, def, 2, v2))
        changed = true;
    if (bindLen > 3 && checkAndUpdateElementValue(view, def, 3, v3))
        changed = true;
    if (bindLen > 4 && checkAndUpdateElementValue(view, def, 4, v4))
        changed = true;
    if (bindLen > 5 && checkAndUpdateElementValue(view, def, 5, v5))
        changed = true;
    if (bindLen > 6 && checkAndUpdateElementValue(view, def, 6, v6))
        changed = true;
    if (bindLen > 7 && checkAndUpdateElementValue(view, def, 7, v7))
        changed = true;
    if (bindLen > 8 && checkAndUpdateElementValue(view, def, 8, v8))
        changed = true;
    if (bindLen > 9 && checkAndUpdateElementValue(view, def, 9, v9))
        changed = true;
    return changed;
}
exports.checkAndUpdateElementInline = checkAndUpdateElementInline;
function checkAndUpdateElementDynamic(view, def, values) {
    var changed = false;
    for (var i = 0; i < values.length; i++) {
        if (checkAndUpdateElementValue(view, def, i, values[i]))
            changed = true;
    }
    return changed;
}
exports.checkAndUpdateElementDynamic = checkAndUpdateElementDynamic;
function checkAndUpdateElementValue(view, def, bindingIdx, value) {
    if (!util_1.checkAndUpdateBinding(view, def, bindingIdx, value)) {
        return false;
    }
    var binding = def.bindings[bindingIdx];
    var elData = types_1.asElementData(view, def.index);
    var renderNode = elData.renderElement;
    var name = binding.name;
    switch (binding.flags & 15 /* Types */) {
        case 1 /* TypeElementAttribute */:
            setElementAttribute(view, binding, renderNode, binding.ns, name, value);
            break;
        case 2 /* TypeElementClass */:
            setElementClass(view, renderNode, name, value);
            break;
        case 4 /* TypeElementStyle */:
            setElementStyle(view, binding, renderNode, name, value);
            break;
        case 8 /* TypeProperty */:
            var bindView = (def.flags & 33554432 /* ComponentView */ &&
                binding.flags & 32 /* SyntheticHostProperty */) ?
                elData.componentView :
                view;
            setElementProperty(bindView, binding, renderNode, name, value);
            break;
    }
    return true;
}
function setElementAttribute(view, binding, renderNode, ns, name, value) {
    var securityContext = binding.securityContext;
    var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
    renderValue = renderValue != null ? renderValue.toString() : null;
    var renderer = view.renderer;
    if (value != null) {
        renderer.setAttribute(renderNode, name, renderValue, ns);
    }
    else {
        renderer.removeAttribute(renderNode, name, ns);
    }
}
function setElementClass(view, renderNode, name, value) {
    var renderer = view.renderer;
    if (value) {
        renderer.addClass(renderNode, name);
    }
    else {
        renderer.removeClass(renderNode, name);
    }
}
function setElementStyle(view, binding, renderNode, name, value) {
    var renderValue = view.root.sanitizer.sanitize(security_1.SecurityContext.STYLE, value);
    if (renderValue != null) {
        renderValue = renderValue.toString();
        var unit = binding.suffix;
        if (unit != null) {
            renderValue = renderValue + unit;
        }
    }
    else {
        renderValue = null;
    }
    var renderer = view.renderer;
    if (renderValue != null) {
        renderer.setStyle(renderNode, name, renderValue);
    }
    else {
        renderer.removeStyle(renderNode, name);
    }
}
function setElementProperty(view, binding, renderNode, name, value) {
    var securityContext = binding.securityContext;
    var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
    view.renderer.setProperty(renderNode, name, renderValue);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHdDQUE0QztBQUU1QyxpQ0FBK0w7QUFDL0wsK0JBQW1OO0FBRW5OLG1CQUNJLEtBQWdCLEVBQUUsaUJBQXNELEVBQ3hFLGNBQXNCLEVBQUUsVUFBa0IsRUFBRSxXQUFrQyxFQUM5RSxlQUF1QztJQUN6QyxLQUFLLHVCQUF5QixDQUFDO0lBQ3pCLElBQUEscURBQXlGLEVBQXhGLGtDQUFjLEVBQUUsMEJBQVUsRUFBRSxvQ0FBZSxDQUE4QztJQUNoRyxJQUFNLFFBQVEsR0FBRyxlQUFlLEdBQUcsd0JBQWlCLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTdFLE1BQU0sQ0FBQztRQUNMLHNDQUFzQztRQUN0QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUUsSUFBSTtRQUNsQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDZixpQkFBaUI7UUFDakIsS0FBSyxPQUFBO1FBQ0wsVUFBVSxFQUFFLENBQUM7UUFDYixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLG1CQUFtQixFQUFFLENBQUMsRUFBRSxjQUFjLGdCQUFBLEVBQUUsZUFBZSxpQkFBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLGNBQWMsZ0JBQUEsRUFBRSxVQUFVLFlBQUE7UUFDL0YsUUFBUSxFQUFFLEVBQUU7UUFDWixZQUFZLEVBQUUsQ0FBQztRQUNmLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFO1lBQ1AsRUFBRSxFQUFFLElBQUk7WUFDUixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxVQUFBO1lBQ3JCLGlCQUFpQixF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LEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ2hGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksMEJBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFB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