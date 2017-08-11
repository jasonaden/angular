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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zcmMvY29tbW9uL2Rvd25ncmFkZV9jb21wb25lbnRfYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFzSztBQUd0SyxtREFBaUQ7QUFDakQseUNBQW1DO0FBQ25DLCtCQUEyRjtBQUUzRixJQUFNLGFBQWEsR0FBRztJQUNwQixpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUM7QUFFRjtJQVVFLG1DQUNZLEVBQVUsRUFBVSxPQUFpQyxFQUNyRCxLQUEwQixFQUFVLEtBQXFCLEVBQ3pELE9BQW1DLEVBQVUsY0FBd0IsRUFDckUsU0FBbUMsRUFBVSxRQUFpQyxFQUM5RSxNQUE2QixFQUFVLGdCQUF1QyxFQUM5RSxZQUF5QztRQUx6QyxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFDckQsVUFBSyxHQUFMLEtBQUssQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUN6RCxZQUFPLEdBQVAsT0FBTyxDQUE0QjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFVO1FBQ3JFLGNBQVMsR0FBVCxTQUFTLENBQTBCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFDOUUsV0FBTSxHQUFOLE1BQU0sQ0FBdUI7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXVCO1FBQzlFLGlCQUFZLEdBQVosWUFBWSxDQUE2QjtRQWY3Qyx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDNUIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLGlCQUFZLEdBQWtCLEVBQUUsQ0FBQztRQWN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsbURBQWUsR0FBZjtRQUFBLGlCQWVDO1FBZEMsSUFBTSx3QkFBd0IsR0FBYSxFQUFFLENBQUM7UUFDOUMsSUFBTSxnQkFBZ0IsR0FBYSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNoRSxJQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFFcEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFPLEVBQUUsQ0FBQztRQUV2QixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtZQUNwQixNQUFNLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQWE7Z0JBQy9CLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztJQUNsQyxDQUFDO0lBRUQsbURBQWUsR0FBZixVQUFnQixnQkFBMEI7UUFDeEMsSUFBTSxhQUFhLEdBQ2YsZUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLGtCQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU3RixJQUFJLENBQUMsWUFBWTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUU1QyxvQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCwrQ0FBVyxHQUFYLFVBQVksV0FBb0IsRUFBRSxlQUFzQjtRQUF4RCxpQkErRUM7UUEvRWlDLGdDQUFBLEVBQUEsc0JBQXNCO1FBQ3RELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7Z0NBQ3pDLENBQUM7WUFDUixJQUFNLEtBQUssR0FBRyxJQUFJLGdDQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDOUUsSUFBSSxJQUFJLEdBQWdCLElBQUksQ0FBQztZQUU3QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQU0sV0FBUyxHQUFHLENBQUMsVUFBQSxJQUFJO29CQUNyQixJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUM7b0JBQzlCLE1BQU0sQ0FBQyxVQUFDLFNBQWM7d0JBQ3BCLHVFQUF1RTt3QkFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dDQUNoQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzRCQUN4QixDQUFDOzRCQUVELEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs0QkFDN0MsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFDeEIsQ0FBQztvQkFDSCxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFTLENBQUMsQ0FBQztnQkFFdEMseUZBQXlGO2dCQUN6Riw0RkFBNEY7Z0JBQzVGLDRGQUE0RjtnQkFDNUYsSUFBSSxTQUFPLEdBQWtCLE9BQUssY0FBYyxDQUFDLE1BQU0sQ0FBQztvQkFDdEQsU0FBUyxFQUFFLENBQUM7b0JBQ1osU0FBTyxHQUFHLElBQUksQ0FBQztvQkFDZixXQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztZQUVMLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFNLE9BQU8sR0FDVCxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsVUFBQyxTQUFjLEVBQUUsU0FBYztvQkFDbkMsT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUE1QyxDQUE0QyxFQUR4QyxDQUN3QyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuRSxPQUFLLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDSCxDQUFDOztRQTdDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO29CQUE3QixDQUFDO1NBNkNUO1FBRUQsK0RBQStEO1FBQy9ELElBQU0sYUFBYSxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxFQUFuQyxDQUFtQyxDQUFDO1FBQ2hFLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQWdCLFNBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUvRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixFQUFyQixDQUFxQixFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDeEUseUJBQXlCO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQU0sWUFBWSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZDLEtBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUNYLEtBQUksQ0FBQyxTQUFVLENBQUMsV0FBVyxDQUFDLFlBQWMsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFFRCwrREFBK0Q7WUFDL0QscUJBQXFCO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDckIsYUFBYSxFQUFFLENBQUM7WUFDbEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixtRkFBbUY7UUFDbkYsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVELG9EQUFvRDtRQUNwRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCxnREFBWSxHQUFaO1FBQUEsaUJBMENDO1FBekNDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0NBQzNDLENBQUM7WUFDUixJQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakYsSUFBSSxJQUFJLEdBQWdCLElBQUksQ0FBQztZQUM3QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hGLElBQU0sZ0JBQWdCLEdBQ2xCLE9BQUssTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBSSxDQUFDO1lBRXRGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pCLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQy9CLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQU0sUUFBTSxHQUFHLE9BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQyxJQUFNLFFBQU0sR0FBRyxRQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFlLElBQUkseUJBQXNCLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFDRCxJQUFNLE9BQU8sR0FBRyxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFzQixDQUFDO2dCQUNqRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNaLE9BQU8sQ0FBQyxTQUFTLENBQUM7d0JBQ2hCLElBQUksRUFBRSxVQUFVLEdBQUcsVUFBQyxDQUFNLElBQUssT0FBQSxRQUFRLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBdkIsQ0FBdUI7NEJBQ25DLFVBQUMsQ0FBTSxJQUFLLE9BQUEsUUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBakMsQ0FBaUM7cUJBQ2pFLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sSUFBSSxLQUFLLENBQ1gsc0JBQW9CLE1BQU0sQ0FBQyxJQUFJLHdCQUFtQix1QkFBZ0IsQ0FBQyxPQUFLLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFJLENBQUMsQ0FBQztnQkFDbkgsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDOztRQXRDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO29CQUE5QixDQUFDO1NBc0NUO0lBQ0gsQ0FBQztJQUVELG1EQUFlLEdBQWYsVUFBZ0IsV0FBb0I7UUFBcEMsaUJBUUM7UUFQQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUksQ0FBQyxVQUFVLEVBQUU7WUFDNUIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvQixLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtDQUFXLEdBQVgsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUV0RCwrQ0FBVyxHQUFuQixVQUFvQixJQUFZLEVBQUUsU0FBYyxFQUFFLFNBQWM7UUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQztRQUM1RixDQUFDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbkMsQ0FBQztJQUVELHlEQUFxQixHQUFyQjtRQUNFLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVUsRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FBQyxBQXpNRCxJQXlNQztBQXpNWSw4REFBeUI7QUEyTXRDOztHQUVHO0FBQ0gsOEJBQXFDLGtCQUE0QixFQUFFLEtBQWE7SUFDOUUsSUFBTSxnQkFBZ0IsR0FBYSxFQUFFLENBQUM7SUFDdEMsSUFBSSxzQkFBOEIsQ0FBQztJQUVuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDNUQsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQy9DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFNLGNBQWMsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUM1RSxFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQWpCRCxvREFpQkM7QUFFRCxvQ0FBb0MsT0FBWSxFQUFFLGtCQUE0QjtJQUM1RSxJQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUN0QyxJQUFJLHNCQUFzQixHQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbkQsSUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckIsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFeEIsRUFBRSxDQUFDLENBQUMsc0JBQXNCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUM5RCxDQUFDO0FBRUQsSUFBSSxRQUFrRCxDQUFDO0FBRXZELHlCQUF5QixFQUFPLEVBQUUsUUFBZ0I7SUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBTSxPQUFPLEdBQVEsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUN2QyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsZUFBZSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0I7WUFDL0UsT0FBTyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxPQUFPLENBQUMscUJBQXFCLENBQUM7SUFDN0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ2pGLENBQUMifQ==