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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vdXBncmFkZV9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxvQ0FBc0M7QUFDdEMseUNBQTZGO0FBQzdGLCtCQUFxRTtBQUdyRSxZQUFZO0FBQ1osSUFBTSxpQkFBaUIsR0FBRyx3QkFBd0IsQ0FBQztBQWVuRCxVQUFVO0FBQ1Y7SUFTRSx1QkFDWSxRQUFrQixFQUFVLElBQVksRUFBRSxVQUFzQixFQUN4RSxTQUE4QjtRQUR0QixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUVsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQVMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQVEsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQVcsQ0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRU0sMEJBQVksR0FBbkIsVUFBb0IsU0FBbUMsRUFBRSxJQUFZO1FBQ25FLElBQU0sVUFBVSxHQUF5QixTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMs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