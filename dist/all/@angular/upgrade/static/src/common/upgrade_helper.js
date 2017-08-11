"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("./angular1");
var constants_1 = require("./constants");
var util_1 = require("./util");
// Constants
var REQUIRE_PREFIX_RE = /^(\^\^?)?(\?)?(\^\^?)?/;
// Classes
var UpgradeHelper = (function () {
    function UpgradeHelper(injector, name, elementRef, directive) {
        this.injector = injector;
        this.name = name;
        this.$injector = injector.get(constants_1.$INJECTOR);
        this.$compile = this.$injector.get(constants_1.$COMPILE);
        this.$controller = this.$injector.get(constants_1.$CONTROLLER);
        this.element = elementRef.nativeElement;
        this.$element = angular.element(this.element);
        this.directive = directive || UpgradeHelper.getDirective(this.$injector, name);
    }
    UpgradeHelper.getDirective = function ($injector, name) {
        var directives = $injector.get(name + 'Directive');
        if (directives.length > 1) {
            throw new Error("Only support single directive definition for: " + name);
        }
        var directive = directives[0];
        // AngularJS will transform `link: xyz` to `compile: () => xyz`. So we can only tell there was a
        // user-defined `compile` if there is no `link`. In other cases, we will just ignore `compile`.
        if (directive.compile && !directive.link)
            notSupported(name, 'compile');
        if (directive.replace)
            notSupported(name, 'replace');
        if (directive.terminal)
            notSupported(name, 'terminal');
        return directive;
    };
    UpgradeHelper.getTemplate = function ($injector, directive, fetchRemoteTemplate) {
        if (fetchRemoteTemplate === void 0) { fetchRemoteTemplate = false; }
        if (directive.template !== undefined) {
            return getOrCall(directive.template);
        }
        else if (directive.templateUrl) {
            var $templateCache_1 = $injector.get(constants_1.$TEMPLATE_CACHE);
            var url_1 = getOrCall(directive.templateUrl);
            var template = $templateCache_1.get(url_1);
            if (template !== undefined) {
                return template;
            }
            else if (!fetchRemoteTemplate) {
                throw new Error('loading directive templates asynchronously is not supported');
            }
            return new Promise(function (resolve, reject) {
                var $httpBackend = $injector.get(constants_1.$HTTP_BACKEND);
                $httpBackend('GET', url_1, null, function (status, response) {
                    if (status === 200) {
                        resolve($templateCache_1.put(url_1, response));
                    }
                    else {
                        reject("GET component template from '" + url_1 + "' returned '" + status + ": " + response + "'");
                    }
                });
            });
        }
        else {
            throw new Error("Directive '" + directive.name + "' is not a component, it is missing template.");
        }
    };
    UpgradeHelper.prototype.buildController = function (controllerType, $scope) {
        // TODO: Document that we do not pre-assign bindings on the controller instance.
        // Quoted properties below so that this code can be optimized with Closure Compiler.
        var locals = { '$scope': $scope, '$element': this.$element };
        var controller = this.$controller(controllerType, locals, null, this.directive.controllerAs);
        this.$element.data(util_1.controllerKey(this.directive.name), controller);
        return controller;
    };
    UpgradeHelper.prototype.compileTemplate = function (template) {
        if (template === undefined) {
            template = UpgradeHelper.getTemplate(this.$injector, this.directive);
        }
        return this.compileHtml(template);
    };
    UpgradeHelper.prototype.prepareTransclusion = function () {
        var _this = this;
        var transclude = this.directive.transclude;
        var contentChildNodes = this.extractChildNodes();
        var $template = contentChildNodes;
        var attachChildrenFn = function (scope, cloneAttach) {
            return cloneAttach($template, scope);
        };
        if (transclude) {
            var slots_1 = Object.create(null);
            if (typeof transclude === 'object') {
                $template = [];
                var slotMap_1 = Object.create(null);
                var filledSlots_1 = Object.create(null);
                // Parse the element selectors.
                Object.keys(transclude).forEach(function (slotName) {
                    var selector = transclude[slotName];
                    var optional = selector.charAt(0) === '?';
                    selector = optional ? selector.substring(1) : selector;
                    slotMap_1[selector] = slotName;
                    slots_1[slotName] = null; // `null`: Defined but not yet filled.
                    filledSlots_1[slotName] = optional; // Consider optional slots as filled.
                });
                // Add the matching elements into their slot.
                contentChildNodes.forEach(function (node) {
                    var slotName = slotMap_1[util_1.directiveNormalize(node.nodeName.toLowerCase())];
                    if (slotName) {
                        filledSlots_1[slotName] = true;
                        slots_1[slotName] = slots_1[slotName] || [];
                        slots_1[slotName].push(node);
                    }
                    else {
                        $template.push(node);
                    }
                });
                // Check for required slots that were not filled.
                Object.keys(filledSlots_1).forEach(function (slotName) {
                    if (!filledSlots_1[slotName]) {
                        throw new Error("Required transclusion slot '" + slotName + "' on directive: " + _this.name);
                    }
                });
                Object.keys(slots_1).filter(function (slotName) { return slots_1[slotName]; }).forEach(function (slotName) {
                    var nodes = slots_1[slotName];
                    slots_1[slotName] = function (scope, cloneAttach) {
                        return cloneAttach(nodes, scope);
                    };
                });
            }
            // Attach `$$slots` to default slot transclude fn.
            attachChildrenFn.$$slots = slots_1;
            // AngularJS v1.6+ ignores empty or whitespace-only transcluded text nodes. But Angular
            // removes all text content after the first interpolation and updates it later, after
            // evaluating the expressions. This would result in AngularJS failing to recognize text
            // nodes that start with an interpolation as transcluded content and use the fallback
            // content instead.
            // To avoid this issue, we add a
            // [zero-width non-joiner character](https://en.wikipedia.org/wiki/Zero-width_non-joiner)
            // to empty text nodes (which can only be a result of Angular removing their initial content).
            // NOTE: Transcluded text content that starts with whitespace followed by an interpolation
            //       will still fail to be detected by AngularJS v1.6+
            $template.forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE && !node.nodeValue) {
                    node.nodeValue = '\u200C';
                }
            });
        }
        return attachChildrenFn;
    };
    UpgradeHelper.prototype.resolveAndBindRequiredControllers = function (controllerInstance) {
        var directiveRequire = this.getDirectiveRequire();
        var requiredControllers = this.resolveRequire(directiveRequire);
        if (controllerInstance && this.directive.bindToController && isMap(directiveRequire)) {
            var requiredControllersMap_1 = requiredControllers;
            Object.keys(requiredControllersMap_1).forEach(function (key) {
                controllerInstance[key] = requiredControllersMap_1[key];
            });
        }
        return requiredControllers;
    };
    UpgradeHelper.prototype.compileHtml = function (html) {
        this.element.innerHTML = html;
        return this.$compile(this.element.childNodes);
    };
    UpgradeHelper.prototype.extractChildNodes = function () {
        var childNodes = [];
        var childNode;
        while (childNode = this.element.firstChild) {
            this.element.removeChild(childNode);
            childNodes.push(childNode);
        }
        return childNodes;
    };
    UpgradeHelper.prototype.getDirectiveRequire = function () {
        var require = this.directive.require || (this.directive.controller && this.directive.name);
        if (isMap(require)) {
            Object.keys(require).forEach(function (key) {
                var value = require[key];
                var match = value.match(REQUIRE_PREFIX_RE);
                var name = value.substring(match[0].length);
                if (!name) {
                    require[key] = match[0] + key;
                }
            });
        }
        return require;
    };
    UpgradeHelper.prototype.resolveRequire = function (require, controllerInstance) {
        var _this = this;
        if (!require) {
            return null;
        }
        else if (Array.isArray(require)) {
            return require.map(function (req) { return _this.resolveRequire(req); });
        }
        else if (typeof require === 'object') {
            var value_1 = {};
            Object.keys(require).forEach(function (key) { return value_1[key] = _this.resolveRequire(require[key]); });
            return value_1;
        }
        else if (typeof require === 'string') {
            var match = require.match(REQUIRE_PREFIX_RE);
            var inheritType = match[1] || match[3];
            var name_1 = require.substring(match[0].length);
            var isOptional = !!match[2];
            var searchParents = !!inheritType;
            var startOnParent = inheritType === '^^';
            var ctrlKey = util_1.controllerKey(name_1);
            var elem = startOnParent ? this.$element.parent() : this.$element;
            var value = searchParents ? elem.inheritedData(ctrlKey) : elem.data(ctrlKey);
            if (!value && !isOptional) {
                throw new Error("Unable to find required '" + require + "' in upgraded directive '" + this.name + "'.");
            }
            return value;
        }
        else {
            throw new Error("Unrecognized 'require' syntax on upgraded directive '" + this.name + "': " + require);
        }
    };
    return UpgradeHelper;
}());
exports.UpgradeHelper = UpgradeHelper;
function getOrCall(property) {
    return util_1.isFunction(property) ? property() : property;
}
// NOTE: Only works for `typeof T !== 'object'`.
function isMap(value) {
    return value && !Array.isArray(value) && typeof value === 'object';
}
function notSupported(name, feature) {
    throw new Error("Upgraded directive '" + name + "' contains unsupported feature: '" + feature + "'.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvY29tbW9uL3VwZ3JhZGVfaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsb0NBQXNDO0FBQ3RDLHlDQUE2RjtBQUM3RiwrQkFBcUU7QUFHckUsWUFBWTtBQUNaLElBQU0saUJBQWlCLEdBQUcsd0JBQXdCLENBQUM7QUFlbkQsVUFBVTtBQUNWO0lBU0UsdUJBQ1ksUUFBa0IsRUFBVSxJQUFZLEVBQUUsVUFBc0IsRUFDeEUsU0FBOEI7UUFEdEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUFFbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFTLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFRLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUFXLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVNLDBCQUFZLEdBQW5CLFVBQW9CLFNBQW1DLEVBQUUsSUFBWTtRQUNuRSxJQUFNLFVBQVUsR0FBeUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcs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