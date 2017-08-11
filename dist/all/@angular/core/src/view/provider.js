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
var di_1 = require("../di");
var element_ref_1 = require("../linker/element_ref");
var template_ref_1 = require("../linker/template_ref");
var view_container_ref_1 = require("../linker/view_container_ref");
var api_1 = require("../render/api");
var refs_1 = require("./refs");
var types_1 = require("./types");
var util_1 = require("./util");
var RendererV1TokenKey = util_1.tokenKey(api_1.Renderer);
var Renderer2TokenKey = util_1.tokenKey(api_1.Renderer2);
var ElementRefTokenKey = util_1.tokenKey(element_ref_1.ElementRef);
var ViewContainerRefTokenKey = util_1.tokenKey(view_container_ref_1.ViewContainerRef);
var TemplateRefTokenKey = util_1.tokenKey(template_ref_1.TemplateRef);
var ChangeDetectorRefTokenKey = util_1.tokenKey(change_detection_1.ChangeDetectorRef);
var InjectorRefTokenKey = util_1.tokenKey(di_1.Injector);
var NOT_CREATED = new Object();
function directiveDef(flags, matchedQueries, childCount, ctor, deps, props, outputs) {
    var bindings = [];
    if (props) {
        for (var prop in props) {
            var _a = props[prop], bindingIndex = _a[0], nonMinifiedName = _a[1];
            bindings[bindingIndex] = {
                flags: 8 /* TypeProperty */,
                name: prop, nonMinifiedName: nonMinifiedName,
                ns: null,
                securityContext: null,
                suffix: null
            };
        }
    }
    var outputDefs = [];
    if (outputs) {
        for (var propName in outputs) {
            outputDefs.push({ type: 1 /* DirectiveOutput */, propName: propName, target: null, eventName: outputs[propName] });
        }
    }
    flags |= 16384 /* TypeDirective */;
    return _def(flags, matchedQueries, childCount, ctor, ctor, deps, bindings, outputDefs);
}
exports.directiveDef = directiveDef;
function pipeDef(flags, ctor, deps) {
    flags |= 16 /* TypePipe */;
    return _def(flags, null, 0, ctor, ctor, deps);
}
exports.pipeDef = pipeDef;
function providerDef(flags, matchedQueries, token, value, deps) {
    return _def(flags, matchedQueries, 0, token, value, deps);
}
exports.providerDef = providerDef;
function _def(flags, matchedQueriesDsl, childCount, token, value, deps, bindings, outputs) {
    var _a = util_1.splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
    if (!outputs) {
        outputs = [];
    }
    if (!bindings) {
        bindings = [];
    }
    var depDefs = util_1.splitDepsDsl(deps);
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
        childMatchedQueries: 0, matchedQueries: matchedQueries, matchedQueryIds: matchedQueryIds, references: references,
        ngContentIndex: -1, childCount: childCount, bindings: bindings,
        bindingFlags: util_1.calcBindingFlags(bindings), outputs: outputs,
        element: null,
        provider: { token: token, value: value, deps: depDefs },
        text: null,
        query: null,
        ngContent: null
    };
}
exports._def = _def;
function createProviderInstance(view, def) {
    return def.flags & 4096 /* LazyProvider */ ? NOT_CREATED : _createProviderInstance(view, def);
}
exports.createProviderInstance = createProviderInstance;
function createPipeInstance(view, def) {
    // deps are looked up from component.
    var compView = view;
    while (compView.parent && !util_1.isComponentView(compView)) {
        compView = compView.parent;
    }
    // pipes can see the private services of the component
    var allowPrivateServices = true;
    // pipes are always eager and classes!
    return createClass(compView.parent, util_1.viewParentEl(compView), allowPrivateServices, def.provider.value, def.provider.deps);
}
exports.createPipeInstance = createPipeInstance;
function createDirectiveInstance(view, def) {
    // components can see other private services, other directives can't.
    var allowPrivateServices = (def.flags & 32768 /* Component */) > 0;
    // directives are always eager and classes!
    var instance = createClass(view, def.parent, allowPrivateServices, def.provider.value, def.provider.deps);
    if (def.outputs.length) {
        for (var i = 0; i < def.outputs.length; i++) {
            var output = def.outputs[i];
            var subscription = instance[output.propName].subscribe(eventHandlerClosure(view, def.parent.index, output.eventName));
            view.disposables[def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
        }
    }
    return instance;
}
exports.createDirectiveInstance = createDirectiveInstance;
function eventHandlerClosure(view, index, eventName) {
    return function (event) { return util_1.dispatchEvent(view, index, eventName, event); };
}
function checkAndUpdateDirectiveInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var providerData = types_1.asProviderData(view, def.index);
    var directive = providerData.instance;
    var changed = false;
    var changes = undefined;
    var bindLen = def.bindings.length;
    if (bindLen > 0 && util_1.checkBinding(view, def, 0, v0)) {
        changed = true;
        changes = updateProp(view, providerData, def, 0, v0, changes);
    }
    if (bindLen > 1 && util_1.checkBinding(view, def, 1, v1)) {
        changed = true;
        changes = updateProp(view, providerData, def, 1, v1, changes);
    }
    if (bindLen > 2 && util_1.checkBinding(view, def, 2, v2)) {
        changed = true;
        changes = updateProp(view, providerData, def, 2, v2, changes);
    }
    if (bindLen > 3 && util_1.checkBinding(view, def, 3, v3)) {
        changed = true;
        changes = updateProp(view, providerData, def, 3, v3, changes);
    }
    if (bindLen > 4 && util_1.checkBinding(view, def, 4, v4)) {
        changed = true;
        changes = updateProp(view, providerData, def, 4, v4, changes);
    }
    if (bindLen > 5 && util_1.checkBinding(view, def, 5, v5)) {
        changed = true;
        changes = updateProp(view, providerData, def, 5, v5, changes);
    }
    if (bindLen > 6 && util_1.checkBinding(view, def, 6, v6)) {
        changed = true;
        changes = updateProp(view, providerData, def, 6, v6, changes);
    }
    if (bindLen > 7 && util_1.checkBinding(view, def, 7, v7)) {
        changed = true;
        changes = updateProp(view, providerData, def, 7, v7, changes);
    }
    if (bindLen > 8 && util_1.checkBinding(view, def, 8, v8)) {
        changed = true;
        changes = updateProp(view, providerData, def, 8, v8, changes);
    }
    if (bindLen > 9 && util_1.checkBinding(view, def, 9, v9)) {
        changed = true;
        changes = updateProp(view, providerData, def, 9, v9, changes);
    }
    if (changes) {
        directive.ngOnChanges(changes);
    }
    if ((view.state & 2 /* FirstCheck */) && (def.flags & 65536 /* OnInit */)) {
        directive.ngOnInit();
    }
    if (def.flags & 262144 /* DoCheck */) {
        directive.ngDoCheck();
    }
    return changed;
}
exports.checkAndUpdateDirectiveInline = checkAndUpdateDirectiveInline;
function checkAndUpdateDirectiveDynamic(view, def, values) {
    var providerData = types_1.asProviderData(view, def.index);
    var directive = providerData.instance;
    var changed = false;
    var changes = undefined;
    for (var i = 0; i < values.length; i++) {
        if (util_1.checkBinding(view, def, i, values[i])) {
            changed = true;
            changes = updateProp(view, providerData, def, i, values[i], changes);
        }
    }
    if (changes) {
        directive.ngOnChanges(changes);
    }
    if ((view.state & 2 /* FirstCheck */) && (def.flags & 65536 /* OnInit */)) {
        directive.ngOnInit();
    }
    if (def.flags & 262144 /* DoCheck */) {
        directive.ngDoCheck();
    }
    return changed;
}
exports.checkAndUpdateDirectiveDynamic = checkAndUpdateDirectiveDynamic;
function _createProviderInstance(view, def) {
    // private services can see other private services
    var allowPrivateServices = (def.flags & 8192 /* PrivateProvider */) > 0;
    var providerDef = def.provider;
    var injectable;
    switch (def.flags & 201347067 /* Types */) {
        case 512 /* TypeClassProvider */:
            injectable = createClass(view, def.parent, allowPrivateServices, providerDef.value, providerDef.deps);
            break;
        case 1024 /* TypeFactoryProvider */:
            injectable = callFactory(view, def.parent, allowPrivateServices, providerDef.value, providerDef.deps);
            break;
        case 2048 /* TypeUseExistingProvider */:
            injectable = resolveDep(view, def.parent, allowPrivateServices, providerDef.deps[0]);
            break;
        case 256 /* TypeValueProvider */:
            injectable = providerDef.value;
            break;
    }
    return injectable;
}
function createClass(view, elDef, allowPrivateServices, ctor, deps) {
    var len = deps.length;
    var injectable;
    switch (len) {
        case 0:
            injectable = new ctor();
            break;
        case 1:
            injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]));
            break;
        case 2:
            injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
            break;
        case 3:
            injectable = new ctor(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
            break;
        default:
            var depValues = new Array(len);
            for (var i = 0; i < len; i++) {
                depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
            }
            injectable = new (ctor.bind.apply(ctor, [void 0].concat(depValues)))();
    }
    return injectable;
}
function callFactory(view, elDef, allowPrivateServices, factory, deps) {
    var len = deps.length;
    var injectable;
    switch (len) {
        case 0:
            injectable = factory();
            break;
        case 1:
            injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]));
            break;
        case 2:
            injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]));
            break;
        case 3:
            injectable = factory(resolveDep(view, elDef, allowPrivateServices, deps[0]), resolveDep(view, elDef, allowPrivateServices, deps[1]), resolveDep(view, elDef, allowPrivateServices, deps[2]));
            break;
        default:
            var depValues = Array(len);
            for (var i = 0; i < len; i++) {
                depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
            }
            injectable = factory.apply(void 0, depValues);
    }
    return injectable;
}
// This default value is when checking the hierarchy for a token.
//
// It means both:
// - the token is not provided by the current injector,
// - only the element injectors should be checked (ie do not check module injectors
//
//          mod1
//         /
//       el1   mod2
//         \  /
//         el2
//
// When requesting el2.injector.get(token), we should check in the following order and return the
// first found value:
// - el2.injector.get(token, default)
// - el1.injector.get(token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) -> do not check the module
// - mod2.injector.get(token, default)
exports.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
function resolveDep(view, elDef, allowPrivateServices, depDef, notFoundValue) {
    if (notFoundValue === void 0) { notFoundValue = di_1.Injector.THROW_IF_NOT_FOUND; }
    if (depDef.flags & 8 /* Value */) {
        return depDef.token;
    }
    var startView = view;
    if (depDef.flags & 2 /* Optional */) {
        notFoundValue = null;
    }
    var tokenKey = depDef.tokenKey;
    if (tokenKey === ChangeDetectorRefTokenKey) {
        // directives on the same element as a component should be able to control the change detector
        // of that component as well.
        allowPrivateServices = !!(elDef && elDef.element.componentView);
    }
    if (elDef && (depDef.flags & 1 /* SkipSelf */)) {
        allowPrivateServices = false;
        elDef = elDef.parent;
    }
    while (view) {
        if (elDef) {
            switch (tokenKey) {
                case RendererV1TokenKey: {
                    var compView = findCompView(view, elDef, allowPrivateServices);
                    return refs_1.createRendererV1(compView);
                }
                case Renderer2TokenKey: {
                    var compView = findCompView(view, elDef, allowPrivateServices);
                    return compView.renderer;
                }
                case ElementRefTokenKey:
                    return new element_ref_1.ElementRef(types_1.asElementData(view, elDef.index).renderElement);
                case ViewContainerRefTokenKey:
                    return types_1.asElementData(view, elDef.index).viewContainer;
                case TemplateRefTokenKey: {
                    if (elDef.element.template) {
                        return types_1.asElementData(view, elDef.index).template;
                    }
                    break;
                }
                case ChangeDetectorRefTokenKey: {
                    var cdView = findCompView(view, elDef, allowPrivateServices);
                    return refs_1.createChangeDetectorRef(cdView);
                }
                case InjectorRefTokenKey:
                    return refs_1.createInjector(view, elDef);
                default:
                    var providerDef_1 = (allowPrivateServices ? elDef.element.allProviders :
                        elDef.element.publicProviders)[tokenKey];
                    if (providerDef_1) {
                        var providerData = types_1.asProviderData(view, providerDef_1.index);
                        if (providerData.instance === NOT_CREATED) {
                            providerData.instance = _createProviderInstance(view, providerDef_1);
                        }
                        return providerData.instance;
                    }
            }
        }
        allowPrivateServices = util_1.isComponentView(view);
        elDef = util_1.viewParentEl(view);
        view = view.parent;
    }
    var value = startView.root.injector.get(depDef.token, exports.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);
    if (value !== exports.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR ||
        notFoundValue === exports.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
        // Return the value from the root element injector when
        // - it provides it
        //   (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
        // - the module injector should not be checked
        //   (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
        return value;
    }
    return startView.root.ngModule.injector.get(depDef.token, notFoundValue);
}
exports.resolveDep = resolveDep;
function findCompView(view, elDef, allowPrivateServices) {
    var compView;
    if (allowPrivateServices) {
        compView = types_1.asElementData(view, elDef.index).componentView;
    }
    else {
        compView = view;
        while (compView.parent && !util_1.isComponentView(compView)) {
            compView = compView.parent;
        }
    }
    return compView;
}
function updateProp(view, providerData, def, bindingIdx, value, changes) {
    if (def.flags & 32768 /* Component */) {
        var compView = types_1.asElementData(view, def.parent.index).componentView;
        if (compView.def.flags & 2 /* OnPush */) {
            compView.state |= 8 /* ChecksEnabled */;
        }
    }
    var binding = def.bindings[bindingIdx];
    var propName = binding.name;
    // Note: This is still safe with Closure Compiler as
    // the user passed in the property name as an object has to `providerDef`,
    // so Closure Compiler will have renamed the property correctly already.
    providerData.instance[propName] = value;
    if (def.flags & 524288 /* OnChanges */) {
        changes = changes || {};
        var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
        if (oldValue instanceof change_detection_1.WrappedValue) {
            oldValue = oldValue.wrapped;
        }
        var binding_1 = def.bindings[bindingIdx];
        changes[binding_1.nonMinifiedName] =
            new change_detection_1.SimpleChange(oldValue, value, (view.state & 2 /* FirstCheck */) !== 0);
    }
    view.oldValues[def.bindingIndex + bindingIdx] = value;
    return changes;
}
function callLifecycleHooksChildrenFirst(view, lifecycles) {
    if (!(view.def.nodeFlags & lifecycles)) {
        return;
    }
    var nodes = view.def.nodes;
    for (var i = 0; i < nodes.length; i++) {
        var nodeDef = nodes[i];
        var parent_1 = nodeDef.parent;
        if (!parent_1 && nodeDef.flags & lifecycles) {
            // matching root node (e.g. a pipe)
            callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        if ((nodeDef.childFlags & lifecycles) === 0) {
            // no child matches one of the lifecycles
            i += nodeDef.childCount;
        }
        while (parent_1 && (parent_1.flags & 1 /* TypeElement */) &&
            i === parent_1.index + parent_1.childCount) {
            // last child of an element
            if (parent_1.directChildFlags & lifecycles) {
                callElementProvidersLifecycles(view, parent_1, lifecycles);
            }
            parent_1 = parent_1.parent;
        }
    }
}
exports.callLifecycleHooksChildrenFirst = callLifecycleHooksChildrenFirst;
function callElementProvidersLifecycles(view, elDef, lifecycles) {
    for (var i = elDef.index + 1; i <= elDef.index + elDef.childCount; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & lifecycles) {
            callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        // only visit direct children
        i += nodeDef.childCount;
    }
}
function callProviderLifecycles(view, index, lifecycles) {
    var provider = types_1.asProviderData(view, index).instance;
    if (provider === NOT_CREATED) {
        return;
    }
    types_1.Services.setCurrentNode(view, index);
    if (lifecycles & 1048576 /* AfterContentInit */) {
        provider.ngAfterContentInit();
    }
    if (lifecycles & 2097152 /* AfterContentChecked */) {
        provider.ngAfterContentChecked();
    }
    if (lifecycles & 4194304 /* AfterViewInit */) {
        provider.ngAfterViewInit();
    }
    if (lifecycles & 8388608 /* AfterViewChecked */) {
        provider.ngAfterViewChecked();
    }
    if (lifecycles & 131072 /* OnDestroy */) {
        provider.ngOnDestroy();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3Byb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUVBQWtIO0FBQ2xILDRCQUErQjtBQUMvQixxREFBaUQ7QUFDakQsdURBQW1EO0FBQ25ELG1FQUE4RDtBQUM5RCxxQ0FBZ0U7QUFFaEUsK0JBQWlGO0FBQ2pGLGlDQUFxTjtBQUNyTiwrQkFBb0o7QUFFcEosSUFBTSxrQkFBa0IsR0FBRyxlQUFRLENBQUMsY0FBVSxDQUFDLENBQUM7QUFDaEQsSUFBTSxpQkFBaUIsR0FBRyxlQUFRLENBQUMsZUFBUyxDQUFDLENBQUM7QUFDOUMsSUFBTSxrQkFBa0IsR0FBRyxlQUFRLENBQUMsd0JBQVUsQ0FBQyxDQUFDO0FBQ2hELElBQU0sd0JBQXdCLEdBQUcsZUFBUSxDQUFDLHFDQUFnQixDQUFDLENBQUM7QUFDNUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFRLENBQUMsMEJBQVcsQ0FBQyxDQUFDO0FBQ2xELElBQU0seUJBQXlCLEdBQUcsZUFBUSxDQUFDLG9DQUFpQixDQUFDLENBQUM7QUFDOUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFRLENBQUMsYUFBUSxDQUFDLENBQUM7QUFFL0MsSUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUVqQyxzQkFDSSxLQUFnQixFQUFFLGNBQW1ELEVBQUUsVUFBa0IsRUFDekYsSUFBUyxFQUFFLElBQStCLEVBQUUsS0FBMEMsRUFDdEYsT0FBa0M7SUFDcEMsSUFBTSxRQUFRLEdBQWlCLEVBQUUsQ0FBQztJQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1YsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFBLGdCQUE2QyxFQUE1QyxvQkFBWSxF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