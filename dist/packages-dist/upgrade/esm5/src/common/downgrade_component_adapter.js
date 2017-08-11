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
import { ApplicationRef, Injector, SimpleChange } from '@angular/core';
import { PropertyBinding } from './component_info';
import { $SCOPE } from './constants';
import { getComponentName, hookupNgModel, strictEquals } from './util';
var /** @type {?} */ INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
var DowngradeComponentAdapter = (function () {
    /**
     * @param {?} id
     * @param {?} element
     * @param {?} attrs
     * @param {?} scope
     * @param {?} ngModel
     * @param {?} parentInjector
     * @param {?} $injector
     * @param {?} $compile
     * @param {?} $parse
     * @param {?} componentFactory
     * @param {?} wrapCallback
     */
    function DowngradeComponentAdapter(id, element, attrs, scope, ngModel, parentInjector, $injector, $compile, $parse, componentFactory, wrapCallback) {
        this.id = id;
        this.element = element;
        this.attrs = attrs;
        this.scope = scope;
        this.ngModel = ngModel;
        this.parentInjector = parentInjector;
        this.$injector = $injector;
        this.$compile = $compile;
        this.$parse = $parse;
        this.componentFactory = componentFactory;
        this.wrapCallback = wrapCallback;
        this.implementsOnChanges = false;
        this.inputChangeCount = 0;
        this.inputChanges = {};
        ((this.element[0])).id = id;
        this.componentScope = scope.$new();
        this.appRef = parentInjector.get(ApplicationRef);
    }
    /**
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.compileContents = function () {
        var _this = this;
        var /** @type {?} */ compiledProjectableNodes = [];
        var /** @type {?} */ projectableNodes = this.groupProjectableNodes();
        var /** @type {?} */ linkFns = projectableNodes.map(function (nodes) { return _this.$compile(nodes); }); /** @type {?} */
        ((this.element.empty))();
        linkFns.forEach(function (linkFn) {
            linkFn(_this.scope, function (clone) {
                compiledProjectableNodes.push(clone); /** @type {?} */
                ((_this.element.append))(clone);
            });
        });
        return compiledProjectableNodes;
    };
    /**
     * @param {?} projectableNodes
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.createComponent = function (projectableNodes) {
        var /** @type {?} */ childInjector = Injector.create([{ provide: $SCOPE, useValue: this.componentScope }], this.parentInjector);
        this.componentRef =
            this.componentFactory.create(childInjector, projectableNodes, this.element[0]);
        this.changeDetector = this.componentRef.changeDetectorRef;
        this.component = this.componentRef.instance;
        hookupNgModel(this.ngModel, this.component);
    };
    /**
     * @param {?} needsNgZone
     * @param {?=} propagateDigest
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.setupInputs = function (needsNgZone, propagateDigest) {
        var _this = this;
        if (propagateDigest === void 0) { propagateDigest = true; }
        var /** @type {?} */ attrs = this.attrs;
        var /** @type {?} */ inputs = this.componentFactory.inputs || [];
        var _loop_1 = function (i) {
            var /** @type {?} */ input = new PropertyBinding(inputs[i].propName, inputs[i].templateName);
            var /** @type {?} */ expr = null;
            if (attrs.hasOwnProperty(input.attr)) {
                var /** @type {?} */ observeFn_1 = (function (prop) {
                    var /** @type {?} */ prevValue = INITIAL_VALUE;
                    return function (currValue) {
                        // Initially, both `$observe()` and `$watch()` will call this function.
                        if (!strictEquals(prevValue, currValue)) {
                            if (prevValue === INITIAL_VALUE) {
                                prevValue = currValue;
                            }
                            _this.updateInput(prop, prevValue, currValue);
                            prevValue = currValue;
                        }
                    };
                })(input.prop);
                attrs.$observe(input.attr, observeFn_1);
                // Use `$watch()` (in addition to `$observe()`) in order to initialize the input  in time
                // for `ngOnChanges()`. This is necessary if we are already in a `$digest`, which means that
                // `ngOnChanges()` (which is called by a watcher) will run before the `$observe()` callback.
                var /** @type {?} */ unwatch_1 = this_1.componentScope.$watch(function () {
                    ((unwatch_1))();
                    unwatch_1 = null;
                    observeFn_1(attrs[input.attr]);
                });
            }
            else if (attrs.hasOwnProperty(input.bindAttr)) {
                expr = attrs[input.bindAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketAttr)) {
                expr = attrs[input.bracketAttr];
            }
            else if (attrs.hasOwnProperty(input.bindonAttr)) {
                expr = attrs[input.bindonAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                expr = attrs[input.bracketParenAttr];
            }
            if (expr != null) {
                var /** @type {?} */ watchFn = (function (prop) { return function (currValue, prevValue) {
                    return _this.updateInput(prop, prevValue, currValue);
                }; })(input.prop);
                this_1.componentScope.$watch(expr, watchFn);
            }
        };
        var this_1 = this;
        for (var /** @type {?} */ i = 0; i < inputs.length; i++) {
            _loop_1(/** @type {?} */ i);
        }
        // Invoke `ngOnChanges()` and Change Detection (when necessary)
        var /** @type {?} */ detectChanges = function () { return _this.changeDetector.detectChanges(); };
        var /** @type {?} */ prototype = this.componentFactory.componentType.prototype;
        this.implementsOnChanges = !!(prototype && ((prototype)).ngOnChanges);
        this.componentScope.$watch(function () { return _this.inputChangeCount; }, this.wrapCallback(function () {
            // Invoke `ngOnChanges()`
            if (_this.implementsOnChanges) {
                var /** @type {?} */ inputChanges = _this.inputChanges;
                _this.inputChanges = {};
                ((_this.component)).ngOnChanges(/** @type {?} */ ((inputChanges)));
            }
            // If opted out of propagating digests, invoke change detection
            // when inputs change
            if (!propagateDigest) {
                detectChanges();
            }
        }));
        // If not opted out of propagating digests, invoke change detection on every digest
        if (propagateDigest) {
            this.componentScope.$watch(this.wrapCallback(detectChanges));
        }
        // Attach the view so that it will be dirty-checked.
        if (needsNgZone) {
            this.appRef.attachView(this.componentRef.hostView);
        }
    };
    /**
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.setupOutputs = function () {
        var _this = this;
        var /** @type {?} */ attrs = this.attrs;
        var /** @type {?} */ outputs = this.componentFactory.outputs || [];
        var _loop_2 = function (j) {
            var /** @type {?} */ output = new PropertyBinding(outputs[j].propName, outputs[j].templateName);
            var /** @type {?} */ expr = null;
            var /** @type {?} */ assignExpr = false;
            var /** @type {?} */ bindonAttr = output.bindonAttr.substring(0, output.bindonAttr.length - 6);
            var /** @type {?} */ bracketParenAttr = "[(" + output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8) + ")]";
            if (attrs.hasOwnProperty(output.onAttr)) {
                expr = attrs[output.onAttr];
            }
            else if (attrs.hasOwnProperty(output.parenAttr)) {
                expr = attrs[output.parenAttr];
            }
            else if (attrs.hasOwnProperty(bindonAttr)) {
                expr = attrs[bindonAttr];
                assignExpr = true;
            }
            else if (attrs.hasOwnProperty(bracketParenAttr)) {
                expr = attrs[bracketParenAttr];
                assignExpr = true;
            }
            if (expr != null && assignExpr != null) {
                var /** @type {?} */ getter_1 = this_2.$parse(expr);
                var /** @type {?} */ setter_1 = getter_1.assign;
                if (assignExpr && !setter_1) {
                    throw new Error("Expression '" + expr + "' is not assignable!");
                }
                var /** @type {?} */ emitter = (this_2.component[output.prop]);
                if (emitter) {
                    emitter.subscribe({
                        next: assignExpr ? function (v) { /** @type {?} */ return ((setter_1))(_this.scope, v); } :
                            function (v) { return getter_1(_this.scope, { '$event': v }); }
                    });
                }
                else {
                    throw new Error("Missing emitter '" + output.prop + "' on component '" + getComponentName(this_2.componentFactory.componentType) + "'!");
                }
            }
        };
        var this_2 = this;
        for (var /** @type {?} */ j = 0; j < outputs.length; j++) {
            _loop_2(/** @type {?} */ j);
        }
    };
    /**
     * @param {?} needsNgZone
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.registerCleanup = function (needsNgZone) {
        var _this = this;
        ((this.element.on))('$destroy', function () {
            _this.componentScope.$destroy();
            _this.componentRef.destroy();
            if (needsNgZone) {
                _this.appRef.detachView(_this.componentRef.hostView);
            }
        });
    };
    /**
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.getInjector = function () { return this.componentRef.injector; };
    /**
     * @param {?} prop
     * @param {?} prevValue
     * @param {?} currValue
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.updateInput = function (prop, prevValue, currValue) {
        if (this.implementsOnChanges) {
            this.inputChanges[prop] = new SimpleChange(prevValue, currValue, prevValue === currValue);
        }
        this.inputChangeCount++;
        this.component[prop] = currValue;
    };
    /**
     * @return {?}
     */
    DowngradeComponentAdapter.prototype.groupProjectableNodes = function () {
        var /** @type {?} */ ngContentSelectors = this.componentFactory.ngContentSelectors;
        return groupNodesBySelector(ngContentSelectors, /** @type {?} */ ((this.element.contents))());
    };
    return DowngradeComponentAdapter;
}());
export { DowngradeComponentAdapter };
function DowngradeComponentAdapter_tsickle_Closure_declarations() {
    /** @type {?} */
    DowngradeComponentAdapter.prototype.implementsOnChanges;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.inputChangeCount;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.inputChanges;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.componentScope;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.componentRef;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.component;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.changeDetector;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.appRef;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.id;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.element;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.attrs;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.scope;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.ngModel;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.parentInjector;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.$injector;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.$compile;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.$parse;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.componentFactory;
    /** @type {?} */
    DowngradeComponentAdapter.prototype.wrapCallback;
}
/**
 * Group a set of DOM nodes into `ngContent` groups, based on the given content selectors.
 * @param {?} ngContentSelectors
 * @param {?} nodes
 * @return {?}
 */
export function groupNodesBySelector(ngContentSelectors, nodes) {
    var /** @type {?} */ projectableNodes = [];
    var /** @type {?} */ wildcardNgContentIndex;
    for (var /** @type {?} */ i = 0, /** @type {?} */ ii = ngContentSelectors.length; i < ii; ++i) {
        projectableNodes[i] = [];
    }
    for (var /** @type {?} */ j = 0, /** @type {?} */ jj = nodes.length; j < jj; ++j) {
        var /** @type {?} */ node = nodes[j];
        var /** @type {?} */ ngContentIndex = findMatchingNgContentIndex(node, ngContentSelectors);
        if (ngContentIndex != null) {
            projectableNodes[ngContentIndex].push(node);
        }
    }
    return projectableNodes;
}
/**
 * @param {?} element
 * @param {?} ngContentSelectors
 * @return {?}
 */
function findMatchingNgContentIndex(element, ngContentSelectors) {
    var /** @type {?} */ ngContentIndices = [];
    var /** @type {?} */ wildcardNgContentIndex = -1;
    for (var /** @type {?} */ i = 0; i < ngContentSelectors.length; i++) {
        var /** @type {?} */ selector = ngContentSelectors[i];
        if (selector === '*') {
            wildcardNgContentIndex = i;
        }
        else {
            if (matchesSelector(element, selector)) {
                ngContentIndices.push(i);
            }
        }
    }
    ngContentIndices.sort();
    if (wildcardNgContentIndex !== -1) {
        ngContentIndices.push(wildcardNgContentIndex);
    }
    return ngContentIndices.length ? ngContentIndices[0] : null;
}
var /** @type {?} */ _matches;
/**
 * @param {?} el
 * @param {?} selector
 * @return {?}
 */
function matchesSelector(el, selector) {
    if (!_matches) {
        var /** @type {?} */ elProto = (Element.prototype);
        _matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
            elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
    }
    return el.nodeType === Node.ELEMENT_NODE ? _matches.call(el, selector) : false;
}
//# sourceMappingURL=downgrade_component_adapter.js.map