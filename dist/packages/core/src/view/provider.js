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
import { ChangeDetectorRef, SimpleChange, WrappedValue } from '../change_detection/change_detection';
import { Injector } from '../di';
import { ElementRef } from '../linker/element_ref';
import { TemplateRef } from '../linker/template_ref';
import { ViewContainerRef } from '../linker/view_container_ref';
import { Renderer as RendererV1, Renderer2 } from '../render/api';
import { createChangeDetectorRef, createInjector, createRendererV1 } from './refs';
import { Services, asElementData, asProviderData } from './types';
import { calcBindingFlags, checkBinding, dispatchEvent, isComponentView, splitDepsDsl, splitMatchedQueriesDsl, tokenKey, viewParentEl } from './util';
const /** @type {?} */ RendererV1TokenKey = tokenKey(RendererV1);
const /** @type {?} */ Renderer2TokenKey = tokenKey(Renderer2);
const /** @type {?} */ ElementRefTokenKey = tokenKey(ElementRef);
const /** @type {?} */ ViewContainerRefTokenKey = tokenKey(ViewContainerRef);
const /** @type {?} */ TemplateRefTokenKey = tokenKey(TemplateRef);
const /** @type {?} */ ChangeDetectorRefTokenKey = tokenKey(ChangeDetectorRef);
const /** @type {?} */ InjectorRefTokenKey = tokenKey(Injector);
const /** @type {?} */ NOT_CREATED = new Object();
/**
 * @param {?} flags
 * @param {?} matchedQueries
 * @param {?} childCount
 * @param {?} ctor
 * @param {?} deps
 * @param {?=} props
 * @param {?=} outputs
 * @return {?}
 */
export function directiveDef(flags, matchedQueries, childCount, ctor, deps, props, outputs) {
    const /** @type {?} */ bindings = [];
    if (props) {
        for (let /** @type {?} */ prop in props) {
            const [bindingIndex, nonMinifiedName] = props[prop];
            bindings[bindingIndex] = {
                flags: 8 /* TypeProperty */,
                name: prop, nonMinifiedName,
                ns: null,
                securityContext: null,
                suffix: null
            };
        }
    }
    const /** @type {?} */ outputDefs = [];
    if (outputs) {
        for (let /** @type {?} */ propName in outputs) {
            outputDefs.push({ type: 1 /* DirectiveOutput */, propName, target: null, eventName: outputs[propName] });
        }
    }
    flags |= 16384 /* TypeDirective */;
    return _def(flags, matchedQueries, childCount, ctor, ctor, deps, bindings, outputDefs);
}
/**
 * @param {?} flags
 * @param {?} ctor
 * @param {?} deps
 * @return {?}
 */
export function pipeDef(flags, ctor, deps) {
    flags |= 16 /* TypePipe */;
    return _def(flags, null, 0, ctor, ctor, deps);
}
/**
 * @param {?} flags
 * @param {?} matchedQueries
 * @param {?} token
 * @param {?} value
 * @param {?} deps
 * @return {?}
 */
export function providerDef(flags, matchedQueries, token, value, deps) {
    return _def(flags, matchedQueries, 0, token, value, deps);
}
/**
 * @param {?} flags
 * @param {?} matchedQueriesDsl
 * @param {?} childCount
 * @param {?} token
 * @param {?} value
 * @param {?} deps
 * @param {?=} bindings
 * @param {?=} outputs
 * @return {?}
 */
export function _def(flags, matchedQueriesDsl, childCount, token, value, deps, bindings, outputs) {
    const { matchedQueries, references, matchedQueryIds } = splitMatchedQueriesDsl(matchedQueriesDsl);
    if (!outputs) {
        outputs = [];
    }
    if (!bindings) {
        bindings = [];
    }
    const /** @type {?} */ depDefs = splitDepsDsl(deps);
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0, matchedQueries, matchedQueryIds, references,
        ngContentIndex: -1, childCount, bindings,
        bindingFlags: calcBindingFlags(bindings), outputs,
        element: null,
        provider: { token, value, deps: depDefs },
        text: null,
        query: null,
        ngContent: null
    };
}
/**
 * @param {?} view
 * @param {?} def
 * @return {?}
 */
export function createProviderInstance(view, def) {
    return def.flags & 4096 /* LazyProvider */ ? NOT_CREATED : _createProviderInstance(view, def);
}
/**
 * @param {?} view
 * @param {?} def
 * @return {?}
 */
export function createPipeInstance(view, def) {
    // deps are looked up from component.
    let /** @type {?} */ compView = view;
    while (compView.parent && !isComponentView(compView)) {
        compView = compView.parent;
    }
    // pipes can see the private services of the component
    const /** @type {?} */ allowPrivateServices = true;
    // pipes are always eager and classes!
    return createClass(/** @type {?} */ ((compView.parent)), /** @type {?} */ ((viewParentEl(compView))), allowPrivateServices, /** @type {?} */ ((def.provider)).value, /** @type {?} */ ((def.provider)).deps);
}
/**
 * @param {?} view
 * @param {?} def
 * @return {?}
 */
export function createDirectiveInstance(view, def) {
    // components can see other private services, other directives can't.
    const /** @type {?} */ allowPrivateServices = (def.flags & 32768 /* Component */) > 0;
    // directives are always eager and classes!
    const /** @type {?} */ instance = createClass(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((def.provider)).value, /** @type {?} */ ((def.provider)).deps);
    if (def.outputs.length) {
        for (let /** @type {?} */ i = 0; i < def.outputs.length; i++) {
            const /** @type {?} */ output = def.outputs[i];
            const /** @type {?} */ subscription = instance[((output.propName))].subscribe(eventHandlerClosure(view, /** @type {?} */ ((def.parent)).index, output.eventName)); /** @type {?} */
            ((view.disposables))[def.outputIndex + i] = subscription.unsubscribe.bind(subscription);
        }
    }
    return instance;
}
/**
 * @param {?} view
 * @param {?} index
 * @param {?} eventName
 * @return {?}
 */
function eventHandlerClosure(view, index, eventName) {
    return (event) => dispatchEvent(view, index, eventName, event);
}
/**
 * @param {?} view
 * @param {?} def
 * @param {?} v0
 * @param {?} v1
 * @param {?} v2
 * @param {?} v3
 * @param {?} v4
 * @param {?} v5
 * @param {?} v6
 * @param {?} v7
 * @param {?} v8
 * @param {?} v9
 * @return {?}
 */
export function checkAndUpdateDirectiveInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    const /** @type {?} */ providerData = asProviderData(view, def.index);
    const /** @type {?} */ directive = providerData.instance;
    let /** @type {?} */ changed = false;
    let /** @type {?} */ changes = ((undefined));
    const /** @type {?} */ bindLen = def.bindings.length;
    if (bindLen > 0 && checkBinding(view, def, 0, v0)) {
        changed = true;
        changes = updateProp(view, providerData, def, 0, v0, changes);
    }
    if (bindLen > 1 && checkBinding(view, def, 1, v1)) {
        changed = true;
        changes = updateProp(view, providerData, def, 1, v1, changes);
    }
    if (bindLen > 2 && checkBinding(view, def, 2, v2)) {
        changed = true;
        changes = updateProp(view, providerData, def, 2, v2, changes);
    }
    if (bindLen > 3 && checkBinding(view, def, 3, v3)) {
        changed = true;
        changes = updateProp(view, providerData, def, 3, v3, changes);
    }
    if (bindLen > 4 && checkBinding(view, def, 4, v4)) {
        changed = true;
        changes = updateProp(view, providerData, def, 4, v4, changes);
    }
    if (bindLen > 5 && checkBinding(view, def, 5, v5)) {
        changed = true;
        changes = updateProp(view, providerData, def, 5, v5, changes);
    }
    if (bindLen > 6 && checkBinding(view, def, 6, v6)) {
        changed = true;
        changes = updateProp(view, providerData, def, 6, v6, changes);
    }
    if (bindLen > 7 && checkBinding(view, def, 7, v7)) {
        changed = true;
        changes = updateProp(view, providerData, def, 7, v7, changes);
    }
    if (bindLen > 8 && checkBinding(view, def, 8, v8)) {
        changed = true;
        changes = updateProp(view, providerData, def, 8, v8, changes);
    }
    if (bindLen > 9 && checkBinding(view, def, 9, v9)) {
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
/**
 * @param {?} view
 * @param {?} def
 * @param {?} values
 * @return {?}
 */
export function checkAndUpdateDirectiveDynamic(view, def, values) {
    const /** @type {?} */ providerData = asProviderData(view, def.index);
    const /** @type {?} */ directive = providerData.instance;
    let /** @type {?} */ changed = false;
    let /** @type {?} */ changes = ((undefined));
    for (let /** @type {?} */ i = 0; i < values.length; i++) {
        if (checkBinding(view, def, i, values[i])) {
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
/**
 * @param {?} view
 * @param {?} def
 * @return {?}
 */
function _createProviderInstance(view, def) {
    // private services can see other private services
    const /** @type {?} */ allowPrivateServices = (def.flags & 8192 /* PrivateProvider */) > 0;
    const /** @type {?} */ providerDef = def.provider;
    let /** @type {?} */ injectable;
    switch (def.flags & 201347067 /* Types */) {
        case 512 /* TypeClassProvider */:
            injectable = createClass(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).value, /** @type {?} */ ((providerDef)).deps);
            break;
        case 1024 /* TypeFactoryProvider */:
            injectable = callFactory(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).value, /** @type {?} */ ((providerDef)).deps);
            break;
        case 2048 /* TypeUseExistingProvider */:
            injectable = resolveDep(view, /** @type {?} */ ((def.parent)), allowPrivateServices, /** @type {?} */ ((providerDef)).deps[0]);
            break;
        case 256 /* TypeValueProvider */:
            injectable = ((providerDef)).value;
            break;
    }
    return injectable;
}
/**
 * @param {?} view
 * @param {?} elDef
 * @param {?} allowPrivateServices
 * @param {?} ctor
 * @param {?} deps
 * @return {?}
 */
function createClass(view, elDef, allowPrivateServices, ctor, deps) {
    const /** @type {?} */ len = deps.length;
    let /** @type {?} */ injectable;
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
            const /** @type {?} */ depValues = new Array(len);
            for (let /** @type {?} */ i = 0; i < len; i++) {
                depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
            }
            injectable = new ctor(...depValues);
    }
    return injectable;
}
/**
 * @param {?} view
 * @param {?} elDef
 * @param {?} allowPrivateServices
 * @param {?} factory
 * @param {?} deps
 * @return {?}
 */
function callFactory(view, elDef, allowPrivateServices, factory, deps) {
    const /** @type {?} */ len = deps.length;
    let /** @type {?} */ injectable;
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
            const /** @type {?} */ depValues = Array(len);
            for (let /** @type {?} */ i = 0; i < len; i++) {
                depValues[i] = resolveDep(view, elDef, allowPrivateServices, deps[i]);
            }
            injectable = factory(...depValues);
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
export const /** @type {?} */ NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = {};
/**
 * @param {?} view
 * @param {?} elDef
 * @param {?} allowPrivateServices
 * @param {?} depDef
 * @param {?=} notFoundValue
 * @return {?}
 */
export function resolveDep(view, elDef, allowPrivateServices, depDef, notFoundValue = Injector.THROW_IF_NOT_FOUND) {
    if (depDef.flags & 8 /* Value */) {
        return depDef.token;
    }
    const /** @type {?} */ startView = view;
    if (depDef.flags & 2 /* Optional */) {
        notFoundValue = null;
    }
    const /** @type {?} */ tokenKey = depDef.tokenKey;
    if (tokenKey === ChangeDetectorRefTokenKey) {
        // directives on the same element as a component should be able to control the change detector
        // of that component as well.
        allowPrivateServices = !!(elDef && ((elDef.element)).componentView);
    }
    if (elDef && (depDef.flags & 1 /* SkipSelf */)) {
        allowPrivateServices = false;
        elDef = ((elDef.parent));
    }
    while (view) {
        if (elDef) {
            switch (tokenKey) {
                case RendererV1TokenKey: {
                    const /** @type {?} */ compView = findCompView(view, elDef, allowPrivateServices);
                    return createRendererV1(compView);
                }
                case Renderer2TokenKey: {
                    const /** @type {?} */ compView = findCompView(view, elDef, allowPrivateServices);
                    return compView.renderer;
                }
                case ElementRefTokenKey:
                    return new ElementRef(asElementData(view, elDef.index).renderElement);
                case ViewContainerRefTokenKey:
                    return asElementData(view, elDef.index).viewContainer;
                case TemplateRefTokenKey: {
                    if (((elDef.element)).template) {
                        return asElementData(view, elDef.index).template;
                    }
                    break;
                }
                case ChangeDetectorRefTokenKey: {
                    let /** @type {?} */ cdView = findCompView(view, elDef, allowPrivateServices);
                    return createChangeDetectorRef(cdView);
                }
                case InjectorRefTokenKey:
                    return createInjector(view, elDef);
                default:
                    const /** @type {?} */ providerDef = (((allowPrivateServices ? ((elDef.element)).allProviders : ((elDef.element)).publicProviders)))[tokenKey];
                    if (providerDef) {
                        const /** @type {?} */ providerData = asProviderData(view, providerDef.index);
                        if (providerData.instance === NOT_CREATED) {
                            providerData.instance = _createProviderInstance(view, providerDef);
                        }
                        return providerData.instance;
                    }
            }
        }
        allowPrivateServices = isComponentView(view);
        elDef = ((viewParentEl(view)));
        view = ((view.parent));
    }
    const /** @type {?} */ value = startView.root.injector.get(depDef.token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR);
    if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR ||
        notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR) {
        // Return the value from the root element injector when
        // - it provides it
        //   (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
        // - the module injector should not be checked
        //   (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
        return value;
    }
    return startView.root.ngModule.injector.get(depDef.token, notFoundValue);
}
/**
 * @param {?} view
 * @param {?} elDef
 * @param {?} allowPrivateServices
 * @return {?}
 */
function findCompView(view, elDef, allowPrivateServices) {
    let /** @type {?} */ compView;
    if (allowPrivateServices) {
        compView = asElementData(view, elDef.index).componentView;
    }
    else {
        compView = view;
        while (compView.parent && !isComponentView(compView)) {
            compView = compView.parent;
        }
    }
    return compView;
}
/**
 * @param {?} view
 * @param {?} providerData
 * @param {?} def
 * @param {?} bindingIdx
 * @param {?} value
 * @param {?} changes
 * @return {?}
 */
function updateProp(view, providerData, def, bindingIdx, value, changes) {
    if (def.flags & 32768 /* Component */) {
        const /** @type {?} */ compView = asElementData(view, /** @type {?} */ ((def.parent)).index).componentView;
        if (compView.def.flags & 2 /* OnPush */) {
            compView.state |= 8 /* ChecksEnabled */;
        }
    }
    const /** @type {?} */ binding = def.bindings[bindingIdx];
    const /** @type {?} */ propName = ((binding.name));
    // Note: This is still safe with Closure Compiler as
    // the user passed in the property name as an object has to `providerDef`,
    // so Closure Compiler will have renamed the property correctly already.
    providerData.instance[propName] = value;
    if (def.flags & 524288 /* OnChanges */) {
        changes = changes || {};
        let /** @type {?} */ oldValue = view.oldValues[def.bindingIndex + bindingIdx];
        if (oldValue instanceof WrappedValue) {
            oldValue = oldValue.wrapped;
        }
        const /** @type {?} */ binding = def.bindings[bindingIdx];
        changes[((binding.nonMinifiedName))] =
            new SimpleChange(oldValue, value, (view.state & 2 /* FirstCheck */) !== 0);
    }
    view.oldValues[def.bindingIndex + bindingIdx] = value;
    return changes;
}
/**
 * @param {?} view
 * @param {?} lifecycles
 * @return {?}
 */
export function callLifecycleHooksChildrenFirst(view, lifecycles) {
    if (!(view.def.nodeFlags & lifecycles)) {
        return;
    }
    const /** @type {?} */ nodes = view.def.nodes;
    for (let /** @type {?} */ i = 0; i < nodes.length; i++) {
        const /** @type {?} */ nodeDef = nodes[i];
        let /** @type {?} */ parent = nodeDef.parent;
        if (!parent && nodeDef.flags & lifecycles) {
            // matching root node (e.g. a pipe)
            callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        if ((nodeDef.childFlags & lifecycles) === 0) {
            // no child matches one of the lifecycles
            i += nodeDef.childCount;
        }
        while (parent && (parent.flags & 1 /* TypeElement */) &&
            i === parent.index + parent.childCount) {
            // last child of an element
            if (parent.directChildFlags & lifecycles) {
                callElementProvidersLifecycles(view, parent, lifecycles);
            }
            parent = parent.parent;
        }
    }
}
/**
 * @param {?} view
 * @param {?} elDef
 * @param {?} lifecycles
 * @return {?}
 */
function callElementProvidersLifecycles(view, elDef, lifecycles) {
    for (let /** @type {?} */ i = elDef.index + 1; i <= elDef.index + elDef.childCount; i++) {
        const /** @type {?} */ nodeDef = view.def.nodes[i];
        if (nodeDef.flags & lifecycles) {
            callProviderLifecycles(view, i, nodeDef.flags & lifecycles);
        }
        // only visit direct children
        i += nodeDef.childCount;
    }
}
/**
 * @param {?} view
 * @param {?} index
 * @param {?} lifecycles
 * @return {?}
 */
function callProviderLifecycles(view, index, lifecycles) {
    const /** @type {?} */ provider = asProviderData(view, index).instance;
    if (provider === NOT_CREATED) {
        return;
    }
    Services.setCurrentNode(view, index);
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
//# sourceMappingURL=provider.js.map