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
var injector_1 = require("../di/injector");
var component_factory_1 = require("../linker/component_factory");
var component_factory_resolver_1 = require("../linker/component_factory_resolver");
var element_ref_1 = require("../linker/element_ref");
var ng_module_factory_1 = require("../linker/ng_module_factory");
var template_ref_1 = require("../linker/template_ref");
var util_1 = require("../util");
var version_1 = require("../version");
var ng_module_1 = require("./ng_module");
var types_1 = require("./types");
var util_2 = require("./util");
var view_attach_1 = require("./view_attach");
var EMPTY_CONTEXT = new Object();
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
function createComponentFactory(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors) {
    return new ComponentFactory_(selector, componentType, viewDefFactory, inputs, outputs, ngContentSelectors);
}
exports.createComponentFactory = createComponentFactory;
function getComponentViewDefinitionFactory(componentFactory) {
    return componentFactory.viewDefFactory;
}
exports.getComponentViewDefinitionFactory = getComponentViewDefinitionFactory;
var ComponentFactory_ = (function (_super) {
    __extends(ComponentFactory_, _super);
    function ComponentFactory_(selector, componentType, viewDefFactory, _inputs, _outputs, ngContentSelectors) {
        var _this = 
        // Attention: this ctor is called as top level function.
        // Putting any logic in here will destroy closure tree shaking!
        _super.call(this) || this;
        _this.selector = selector;
        _this.componentType = componentType;
        _this._inputs = _inputs;
        _this._outputs = _outputs;
        _this.ngContentSelectors = ngContentSelectors;
        _this.viewDefFactory = viewDefFactory;
        return _this;
    }
    Object.defineProperty(ComponentFactory_.prototype, "inputs", {
        get: function () {
            var inputsArr = [];
            var inputs = this._inputs;
            for (var propName in inputs) {
                var templateName = inputs[propName];
                inputsArr.push({ propName: propName, templateName: templateName });
            }
            return inputsArr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactory_.prototype, "outputs", {
        get: function () {
            var outputsArr = [];
            for (var propName in this._outputs) {
                var templateName = this._outputs[propName];
                outputsArr.push({ propName: propName, templateName: templateName });
            }
            return outputsArr;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new component.
     */
    ComponentFactory_.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
        if (!ngModule) {
            throw new Error('ngModule should be provided');
        }
        var viewDef = util_2.resolveDefinition(this.viewDefFactory);
        var componentNodeIndex = viewDef.nodes[0].element.componentProvider.index;
        var view = types_1.Services.createRootView(injector, projectableNodes || [], rootSelectorOrNode, viewDef, ngModule, EMPTY_CONTEXT);
        var component = types_1.asProviderData(view, componentNodeIndex).instance;
        if (rootSelectorOrNode) {
            view.renderer.setAttribute(types_1.asElementData(view, 0).renderElement, 'ng-version', version_1.VERSION.full);
        }
        return new ComponentRef_(view, new ViewRef_(view), component);
    };
    return ComponentFactory_;
}(component_factory_1.ComponentFactory));
var ComponentRef_ = (function (_super) {
    __extends(ComponentRef_, _super);
    function ComponentRef_(_view, _viewRef, _component) {
        var _this = _super.call(this) || this;
        _this._view = _view;
        _this._viewRef = _viewRef;
        _this._component = _component;
        _this._elDef = _this._view.def.nodes[0];
        return _this;
    }
    Object.defineProperty(ComponentRef_.prototype, "location", {
        get: function () {
            return new element_ref_1.ElementRef(types_1.asElementData(this._view, this._elDef.index).renderElement);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef_.prototype, "injector", {
        get: function () { return new Injector_(this._view, this._elDef); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef_.prototype, "instance", {
        get: function () { return this._component; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "hostView", {
        get: function () { return this._viewRef; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
        get: function () { return this._viewRef; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "componentType", {
        get: function () { return this._component.constructor; },
        enumerable: true,
        configurable: true
    });
    ComponentRef_.prototype.destroy = function () { this._viewRef.destroy(); };
    ComponentRef_.prototype.onDestroy = function (callback) { this._viewRef.onDestroy(callback); };
    return ComponentRef_;
}(component_factory_1.ComponentRef));
function createViewContainerData(view, elDef, elData) {
    return new ViewContainerRef_(view, elDef, elData);
}
exports.createViewContainerData = createViewContainerData;
var ViewContainerRef_ = (function () {
    function ViewContainerRef_(_view, _elDef, _data) {
        this._view = _view;
        this._elDef = _elDef;
        this._data = _data;
        /**
         * @internal
         */
        this._embeddedViews = [];
    }
    Object.defineProperty(ViewContainerRef_.prototype, "element", {
        get: function () { return new element_ref_1.ElementRef(this._data.renderElement); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef_.prototype, "injector", {
        get: function () { return new Injector_(this._view, this._elDef); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
        get: function () {
            var view = this._view;
            var elDef = this._elDef.parent;
            while (!elDef && view) {
                elDef = util_2.viewParentEl(view);
                view = view.parent;
            }
            return view ? new Injector_(view, elDef) : new Injector_(this._view, null);
        },
        enumerable: true,
        configurable: true
    });
    ViewContainerRef_.prototype.clear = function () {
        var len = this._embeddedViews.length;
        for (var i = len - 1; i >= 0; i--) {
            var view = view_attach_1.detachEmbeddedView(this._data, i);
            types_1.Services.destroyView(view);
        }
    };
    ViewContainerRef_.prototype.get = function (index) {
        var view = this._embeddedViews[index];
        if (view) {
            var ref = new ViewRef_(view);
            ref.attachToViewContainerRef(this);
            return ref;
        }
        return null;
    };
    Object.defineProperty(ViewContainerRef_.prototype, "length", {
        get: function () { return this._embeddedViews.length; },
        enumerable: true,
        configurable: true
    });
    ;
    ViewContainerRef_.prototype.createEmbeddedView = function (templateRef, context, index) {
        var viewRef = templateRef.createEmbeddedView(context || {});
        this.insert(viewRef, index);
        return viewRef;
    };
    ViewContainerRef_.prototype.createComponent = function (componentFactory, index, injector, projectableNodes, ngModuleRef) {
        var contextInjector = injector || this.parentInjector;
        if (!ngModuleRef && !(componentFactory instanceof component_factory_resolver_1.ComponentFactoryBoundToModule)) {
            ngModuleRef = contextInjector.get(ng_module_factory_1.NgModuleRef);
        }
        var componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
        this.insert(componentRef.hostView, index);
        return componentRef;
    };
    ViewContainerRef_.prototype.insert = function (viewRef, index) {
        if (viewRef.destroyed) {
            throw new Error('Cannot insert a destroyed View in a ViewContainer!');
        }
        var viewRef_ = viewRef;
        var viewData = viewRef_._view;
        view_attach_1.attachEmbeddedView(this._view, this._data, index, viewData);
        viewRef_.attachToViewContainerRef(this);
        return viewRef;
    };
    ViewContainerRef_.prototype.move = function (viewRef, currentIndex) {
        if (viewRef.destroyed) {
            throw new Error('Cannot move a destroyed View in a ViewContainer!');
        }
        var previousIndex = this._embeddedViews.indexOf(viewRef._view);
        view_attach_1.moveEmbeddedView(this._data, previousIndex, currentIndex);
        return viewRef;
    };
    ViewContainerRef_.prototype.indexOf = function (viewRef) {
        return this._embeddedViews.indexOf(viewRef._view);
    };
    ViewContainerRef_.prototype.remove = function (index) {
        var viewData = view_attach_1.detachEmbeddedView(this._data, index);
        if (viewData) {
            types_1.Services.destroyView(viewData);
        }
    };
    ViewContainerRef_.prototype.detach = function (index) {
        var view = view_attach_1.detachEmbeddedView(this._data, index);
        return view ? new ViewRef_(view) : null;
    };
    return ViewContainerRef_;
}());
function createChangeDetectorRef(view) {
    return new ViewRef_(view);
}
exports.createChangeDetectorRef = createChangeDetectorRef;
var ViewRef_ = (function () {
    function ViewRef_(_view) {
        this._view = _view;
        this._viewContainerRef = null;
        this._appRef = null;
    }
    Object.defineProperty(ViewRef_.prototype, "rootNodes", {
        get: function () { return util_2.rootRenderNodes(this._view); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef_.prototype, "context", {
        get: function () { return this._view.context; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef_.prototype, "destroyed", {
        get: function () { return (this._view.state & 128 /* Destroyed */) !== 0; },
        enumerable: true,
        configurable: true
    });
    ViewRef_.prototype.markForCheck = function () { util_2.markParentViewsForCheck(this._view); };
    ViewRef_.prototype.detach = function () { this._view.state &= ~4 /* Attached */; };
    ViewRef_.prototype.detectChanges = function () {
        var fs = this._view.root.rendererFactory;
        if (fs.begin) {
            fs.begin();
        }
        types_1.Services.checkAndUpdateView(this._view);
        if (fs.end) {
            fs.end();
        }
    };
    ViewRef_.prototype.checkNoChanges = function () { types_1.Services.checkNoChangesView(this._view); };
    ViewRef_.prototype.reattach = function () { this._view.state |= 4 /* Attached */; };
    ViewRef_.prototype.onDestroy = function (callback) {
        if (!this._view.disposables) {
            this._view.disposables = [];
        }
        this._view.disposables.push(callback);
    };
    ViewRef_.prototype.destroy = function () {
        if (this._appRef) {
            this._appRef.detachView(this);
        }
        else if (this._viewContainerRef) {
            this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
        }
        types_1.Services.destroyView(this._view);
    };
    ViewRef_.prototype.detachFromAppRef = function () {
        this._appRef = null;
        view_attach_1.renderDetachView(this._view);
        types_1.Services.dirtyParentQueries(this._view);
    };
    ViewRef_.prototype.attachToAppRef = function (appRef) {
        if (this._viewContainerRef) {
            throw new Error('This view is already attached to a ViewContainer!');
        }
        this._appRef = appRef;
    };
    ViewRef_.prototype.attachToViewContainerRef = function (vcRef) {
        if (this._appRef) {
            throw new Error('This view is already attached directly to the ApplicationRef!');
        }
        this._viewContainerRef = vcRef;
    };
    return ViewRef_;
}());
exports.ViewRef_ = ViewRef_;
function createTemplateData(view, def) {
    return new TemplateRef_(view, def);
}
exports.createTemplateData = createTemplateData;
var TemplateRef_ = (function (_super) {
    __extends(TemplateRef_, _super);
    function TemplateRef_(_parentView, _def) {
        var _this = _super.call(this) || this;
        _this._parentView = _parentView;
        _this._def = _def;
        return _this;
    }
    TemplateRef_.prototype.createEmbeddedView = function (context) {
        return new ViewRef_(types_1.Services.createEmbeddedView(this._parentView, this._def, this._def.element.template, context));
    };
    Object.defineProperty(TemplateRef_.prototype, "elementRef", {
        get: function () {
            return new element_ref_1.ElementRef(types_1.asElementData(this._parentView, this._def.index).renderElement);
        },
        enumerable: true,
        configurable: true
    });
    return TemplateRef_;
}(template_ref_1.TemplateRef));
function createInjector(view, elDef) {
    return new Injector_(view, elDef);
}
exports.createInjector = createInjector;
var Injector_ = (function () {
    function Injector_(view, elDef) {
        this.view = view;
        this.elDef = elDef;
    }
    Injector_.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.Injector.THROW_IF_NOT_FOUND; }
        var allowPrivateServices = this.elDef ? (this.elDef.flags & 33554432 /* ComponentView */) !== 0 : false;
        return types_1.Services.resolveDep(this.view, this.elDef, allowPrivateServices, { flags: 0 /* None */, token: token, tokenKey: util_2.tokenKey(token) }, notFoundValue);
    };
    return Injector_;
}());
function nodeValue(view, index) {
    var def = view.def.nodes[index];
    if (def.flags & 1 /* TypeElement */) {
        var elData = types_1.asElementData(view, def.index);
        return def.element.template ? elData.template : elData.renderElement;
    }
    else if (def.flags & 2 /* TypeText */) {
        return types_1.asTextData(view, def.index).renderText;
    }
    else if (def.flags & (20224 /* CatProvider */ | 16 /* TypePipe */)) {
        return types_1.asProviderData(view, def.index).instance;
    }
    throw new Error("Illegal state: read nodeValue for node index " + index);
}
exports.nodeValue = nodeValue;
function createRendererV1(view) {
    return new RendererAdapter(view.renderer);
}
exports.createRendererV1 = createRendererV1;
var RendererAdapter = (function () {
    function RendererAdapter(delegate) {
        this.delegate = delegate;
    }
    RendererAdapter.prototype.selectRootElement = function (selectorOrNode) {
        return this.delegate.selectRootElement(selectorOrNode);
    };
    RendererAdapter.prototype.createElement = function (parent, namespaceAndName) {
        var _a = util_2.splitNamespace(namespaceAndName), ns = _a[0], name = _a[1];
        var el = this.delegate.createElement(name, ns);
        if (parent) {
            this.delegate.appendChild(parent, el);
        }
        return el;
    };
    RendererAdapter.prototype.createViewRoot = function (hostElement) { return hostElement; };
    RendererAdapter.prototype.createTemplateAnchor = function (parentElement) {
        var comment = this.delegate.createComment('');
        if (parentElement) {
            this.delegate.appendChild(parentElement, comment);
        }
        return comment;
    };
    RendererAdapter.prototype.createText = function (parentElement, value) {
        var node = this.delegate.createText(value);
        if (parentElement) {
            this.delegate.appendChild(parentElement, node);
        }
        return node;
    };
    RendererAdapter.prototype.projectNodes = function (parentElement, nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.delegate.appendChild(parentElement, nodes[i]);
        }
    };
    RendererAdapter.prototype.attachViewAfter = function (node, viewRootNodes) {
        var parentElement = this.delegate.parentNode(node);
        var nextSibling = this.delegate.nextSibling(node);
        for (var i = 0; i < viewRootNodes.length; i++) {
            this.delegate.insertBefore(parentElement, viewRootNodes[i], nextSibling);
        }
    };
    RendererAdapter.prototype.detachView = function (viewRootNodes) {
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            var parentElement = this.delegate.parentNode(node);
            this.delegate.removeChild(parentElement, node);
        }
    };
    RendererAdapter.prototype.destroyView = function (hostElement, viewAllNodes) {
        for (var i = 0; i < viewAllNodes.length; i++) {
            this.delegate.destroyNode(viewAllNodes[i]);
        }
    };
    RendererAdapter.prototype.listen = function (renderElement, name, callback) {
        return this.delegate.listen(renderElement, name, callback);
    };
    RendererAdapter.prototype.listenGlobal = function (target, name, callback) {
        return this.delegate.listen(target, name, callback);
    };
    RendererAdapter.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        this.delegate.setProperty(renderElement, propertyName, propertyValue);
    };
    RendererAdapter.prototype.setElementAttribute = function (renderElement, namespaceAndName, attributeValue) {
        var _a = util_2.splitNamespace(namespaceAndName), ns = _a[0], name = _a[1];
        if (attributeValue != null) {
            this.delegate.setAttribute(renderElement, name, attributeValue, ns);
        }
        else {
            this.delegate.removeAttribute(renderElement, name, ns);
        }
    };
    RendererAdapter.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) { };
    RendererAdapter.prototype.setElementClass = function (renderElement, className, isAdd) {
        if (isAdd) {
            this.delegate.addClass(renderElement, className);
        }
        else {
            this.delegate.removeClass(renderElement, className);
        }
    };
    RendererAdapter.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        if (styleValue != null) {
            this.delegate.setStyle(renderElement, styleName, styleValue);
        }
        else {
            this.delegate.removeStyle(renderElement, styleName);
        }
    };
    RendererAdapter.prototype.invokeElementMethod = function (renderElement, methodName, args) {
        renderElement[methodName].apply(renderElement, args);
    };
    RendererAdapter.prototype.setText = function (renderNode, text) { this.delegate.setValue(renderNode, text); };
    RendererAdapter.prototype.animate = function () { throw new Error('Renderer.animate is no longer supported!'); };
    return RendererAdapter;
}());
function createNgModuleRef(moduleType, parent, bootstrapComponents, def) {
    return new NgModuleRef_(moduleType, parent, bootstrapComponents, def);
}
exports.createNgModuleRef = createNgModuleRef;
var NgModuleRef_ = (function () {
    function NgModuleRef_(_moduleType, _parent, _bootstrapComponents, _def) {
        this._moduleType = _moduleType;
        this._parent = _parent;
        this._bootstrapComponents = _bootstrapComponents;
        this._def = _def;
        this._destroyListeners = [];
        this._destroyed = false;
        ng_module_1.initNgModule(this);
    }
    NgModuleRef_.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.Injector.THROW_IF_NOT_FOUND; }
        return ng_module_1.resolveNgModuleDep(this, { token: token, tokenKey: util_2.tokenKey(token), flags: 0 /* None */ }, notFoundValue);
    };
    Object.defineProperty(NgModuleRef_.prototype, "instance", {
        get: function () { return this.get(this._moduleType); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModuleRef_.prototype, "componentFactoryResolver", {
        get: function () { return this.get(component_factory_resolver_1.ComponentFactoryResolver); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModuleRef_.prototype, "injector", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    NgModuleRef_.prototype.destroy = function () {
        if (this._destroyed) {
            throw new Error("The ng module " + util_1.stringify(this.instance.constructor) + " has already been destroyed.");
        }
        this._destroyed = true;
        ng_module_1.callNgModuleLifecycle(this, 131072 /* OnDestroy */);
        this._destroyListeners.forEach(function (listener) { return listener(); });
    };
    NgModuleRef_.prototype.onDestroy = function (callback) { this._destroyListeners.push(callback); };
    return NgModuleRef_;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvcmVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFJSCwyQ0FBd0M7QUFDeEMsaUVBQTJFO0FBQzNFLG1GQUE2RztBQUM3RyxxREFBaUQ7QUFDakQsaUVBQTZFO0FBQzdFLHVEQUFtRDtBQUtuRCxnQ0FBa0M7QUFDbEMsc0NBQW1DO0FBRW5DLHlDQUFvRjtBQUNwRixpQ0FBc087QUFDdE8sK0JBQTJIO0FBQzNILDZDQUF5RztBQUV6RyxJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBRW5DLDREQUE0RDtBQUM1RCwrREFBK0Q7QUFDL0QsZ0NBQ0ksUUFBZ0IsRUFBRSxhQUF3QixFQUFFLGNBQXFDLEVBQ2pGLE1BQTJDLEVBQUUsT0FBcUMsRUFDbEYsa0JBQTRCO0lBQzlCLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUN4QixRQUFRLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDcEYsQ0FBQztBQU5ELHdEQU1DO0FBRUQsMkNBQWtELGdCQUF1QztJQUV2RixNQUFNLENBQUUsZ0JBQXNDLENBQUMsY0FBYyxDQUFDO0FBQ2hFLENBQUM7QUFIRCw4RUFHQztBQUVEO0lBQWdDLHFDQUFxQjtJQU1uRCwyQkFDVyxRQUFnQixFQUFTLGFBQXdCLEVBQ3hELGNBQXFDLEVBQVUsT0FBMEMsRUFDakYsUUFBc0MsRUFBUyxrQkFBNEI7UUFIdkY7UUFJRSx3REFBd0Q7UUFDeEQsK0RBQStEO1FBQy9ELGlCQUFPLFNBRVI7UUFQVSxjQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVMsbUJBQWEsR0FBYixhQUFhLENBQVc7UUFDVCxhQUFPLEdBQVAsT0FBTyxDQUFtQztRQUNqRixjQUFRLEdBQVIsUUFBUSxD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