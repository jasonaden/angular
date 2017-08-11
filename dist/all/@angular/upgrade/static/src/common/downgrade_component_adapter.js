"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var component_info_1 = require("./component_info");
var constants_1 = require("./constants");
var util_1 = require("./util");
var INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
var DowngradeComponentAdapter = (function () {
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
        this.element[0].id = id;
        this.componentScope = scope.$new();
        this.appRef = parentInjector.get(core_1.ApplicationRef);
    }
    DowngradeComponentAdapter.prototype.compileContents = function () {
        var _this = this;
        var compiledProjectableNodes = [];
        var projectableNodes = this.groupProjectableNodes();
        var linkFns = projectableNodes.map(function (nodes) { return _this.$compile(nodes); });
        this.element.empty();
        linkFns.forEach(function (linkFn) {
            linkFn(_this.scope, function (clone) {
                compiledProjectableNodes.push(clone);
                _this.element.append(clone);
            });
        });
        return compiledProjectableNodes;
    };
    DowngradeComponentAdapter.prototype.createComponent = function (projectableNodes) {
        var childInjector = core_1.Injector.create([{ provide: constants_1.$SCOPE, useValue: this.componentScope }], this.parentInjector);
        this.componentRef =
            this.componentFactory.create(childInjector, projectableNodes, this.element[0]);
        this.changeDetector = this.componentRef.changeDetectorRef;
        this.component = this.componentRef.instance;
        util_1.hookupNgModel(this.ngModel, this.component);
    };
    DowngradeComponentAdapter.prototype.setupInputs = function (needsNgZone, propagateDigest) {
        var _this = this;
        if (propagateDigest === void 0) { propagateDigest = true; }
        var attrs = this.attrs;
        var inputs = this.componentFactory.inputs || [];
        var _loop_1 = function (i) {
            var input = new component_info_1.PropertyBinding(inputs[i].propName, inputs[i].templateName);
            var expr = null;
            if (attrs.hasOwnProperty(input.attr)) {
                var observeFn_1 = (function (prop) {
                    var prevValue = INITIAL_VALUE;
                    return function (currValue) {
                        // Initially, both `$observe()` and `$watch()` will call this function.
                        if (!util_1.strictEquals(prevValue, currValue)) {
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
                var unwatch_1 = this_1.componentScope.$watch(function () {
                    unwatch_1();
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
                var watchFn = (function (prop) { return function (currValue, prevValue) {
                    return _this.updateInput(prop, prevValue, currValue);
                }; })(input.prop);
                this_1.componentScope.$watch(expr, watchFn);
            }
        };
        var this_1 = this;
        for (var i = 0; i < inputs.length; i++) {
            _loop_1(i);
        }
        // Invoke `ngOnChanges()` and Change Detection (when necessary)
        var detectChanges = function () { return _this.changeDetector.detectChanges(); };
        var prototype = this.componentFactory.componentType.prototype;
        this.implementsOnChanges = !!(prototype && prototype.ngOnChanges);
        this.componentScope.$watch(function () { return _this.inputChangeCount; }, this.wrapCallback(function () {
            // Invoke `ngOnChanges()`
            if (_this.implementsOnChanges) {
                var inputChanges = _this.inputChanges;
                _this.inputChanges = {};
                _this.component.ngOnChanges(inputChanges);
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
    DowngradeComponentAdapter.prototype.setupOutputs = function () {
        var _this = this;
        var attrs = this.attrs;
        var outputs = this.componentFactory.outputs || [];
        var _loop_2 = function (j) {
            var output = new component_info_1.PropertyBinding(outputs[j].propName, outputs[j].templateName);
            var expr = null;
            var assignExpr = false;
            var bindonAttr = output.bindonAttr.substring(0, output.bindonAttr.length - 6);
            var bracketParenAttr = "[(" + output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8) + ")]";
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
                var getter_1 = this_2.$parse(expr);
                var setter_1 = getter_1.assign;
                if (assignExpr && !setter_1) {
                    throw new Error("Expression '" + expr + "' is not assignable!");
                }
                var emitter = this_2.component[output.prop];
                if (emitter) {
                    emitter.subscribe({
                        next: assignExpr ? function (v) { return setter_1(_this.scope, v); } :
                            function (v) { return getter_1(_this.scope, { '$event': v }); }
                    });
                }
                else {
                    throw new Error("Missing emitter '" + output.prop + "' on component '" + util_1.getComponentName(this_2.componentFactory.componentType) + "'!");
                }
            }
        };
        var this_2 = this;
        for (var j = 0; j < outputs.length; j++) {
            _loop_2(j);
        }
    };
    DowngradeComponentAdapter.prototype.registerCleanup = function (needsNgZone) {
        var _this = this;
        this.element.on('$destroy', function () {
            _this.componentScope.$destroy();
            _this.componentRef.destroy();
            if (needsNgZone) {
                _this.appRef.detachView(_this.componentRef.hostView);
            }
        });
    };
    DowngradeComponentAdapter.prototype.getInjector = function () { return this.componentRef.injector; };
    DowngradeComponentAdapter.prototype.updateInput = function (prop, prevValue, currValue) {
        if (this.implementsOnChanges) {
            this.inputChanges[prop] = new core_1.SimpleChange(prevValue, currValue, prevValue === currValue);
        }
        this.inputChangeCount++;
        this.component[prop] = currValue;
    };
    DowngradeComponentAdapter.prototype.groupProjectableNodes = function () {
        var ngContentSelectors = this.componentFactory.ngContentSelectors;
        return groupNodesBySelector(ngContentSelectors, this.element.contents());
    };
    return DowngradeComponentAdapter;
}());
exports.DowngradeComponentAdapter = DowngradeComponentAdapter;
/**
 * Group a set of DOM nodes into `ngContent` groups, based on the given content selectors.
 */
function groupNodesBySelector(ngContentSelectors, nodes) {
    var projectableNodes = [];
    var wildcardNgContentIndex;
    for (var i = 0, ii = ngContentSelectors.length; i < ii; ++i) {
        projectableNodes[i] = [];
    }
    for (var j = 0, jj = nodes.length; j < jj; ++j) {
        var node = nodes[j];
        var ngContentIndex = findMatchingNgContentIndex(node, ngContentSelectors);
        if (ngContentIndex != null) {
            projectableNodes[ngContentIndex].push(node);
        }
    }
    return projectableNodes;
}
exports.groupNodesBySelector = groupNodesBySelector;
function findMatchingNgContentIndex(element, ngContentSelectors) {
    var ngContentIndices = [];
    var wildcardNgContentIndex = -1;
    for (var i = 0; i < ngContentSelectors.length; i++) {
        var selector = ngContentSelectors[i];
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
var _matches;
function matchesSelector(el, selector) {
    if (!_matches) {
        var elProto = Element.prototype;
        _matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
            elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
    }
    return el.nodeType === Node.ELEMENT_NODE ? _matches.call(el, selector) : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zdGF0aWMvc3JjL2NvbW1vbi9kb3duZ3JhZGVfY29tcG9uZW50X2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBc0s7QUFHdEssbURBQWlEO0FBQ2pELHlDQUFtQztBQUNuQywrQkFBMkY7QUFFM0YsSUFBTSxhQUFhLEdBQUc7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDO0FBRUY7SUFVRSxtQ0FDWSxFQUFVLEVBQVUsT0FBaUMsRUFDckQsS0FBMEIsRUFBVSxLQUFxQixFQUN6RCxPQUFtQyxFQUFVLGNBQXdCLEVBQ3JFLFNBQW1DLEVBQVUsUUFBaUMsRUFDOUUsTUFBNkIsRUFBVSxnQkFBdUMsRUFDOUUsWUFBeUM7UUFMekMsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQ3JELFVBQUssR0FBTCxLQUFLLENBQXFCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDekQsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBVTtRQUNyRSxjQUFTLEdBQVQsU0FBUyxDQUEwQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQzlFLFdBQU0sR0FBTixNQUFNLENBQXVCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF1QjtRQUM5RSxpQkFBWSxHQUFaLFlBQVksQ0FBNkI7UUFmN0Msd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQzVCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixpQkFBWSxHQUFrQixFQUFFLENBQUM7UUFjdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2pD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