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
var compiler_1 = require("@angular/compiler");
var compiler_cli_1 = require("@angular/compiler-cli");
var expressions_1 = require("./expressions");
var html_info_1 = require("./html_info");
var utils_1 = require("./utils");
var TEMPLATE_ATTR_PREFIX = '*';
var hiddenHtmlElements = {
    html: true,
    script: true,
    noscript: true,
    base: true,
    body: true,
    title: true,
    head: true,
    link: true,
};
function getTemplateCompletions(templateInfo) {
    var result = undefined;
    var htmlAst = templateInfo.htmlAst, templateAst = templateInfo.templateAst, template = templateInfo.template;
    // The templateNode starts at the delimiter character so we add 1 to skip it.
    if (templateInfo.position != null) {
        var templatePosition_1 = templateInfo.position - template.span.start;
        var path_1 = compiler_1.findNode(htmlAst, templatePosition_1);
        var mostSpecific = path_1.tail;
        if (path_1.empty || !mostSpecific) {
            result = elementCompletions(templateInfo, path_1);
        }
        else {
            var astPosition_1 = templatePosition_1 - mostSpecific.sourceSpan.start.offset;
            mostSpecific.visit({
                visitElement: function (ast) {
                    var startTagSpan = utils_1.spanOf(ast.sourceSpan);
                    var tagLen = ast.name.length;
                    if (templatePosition_1 <=
                        startTagSpan.start + tagLen + 1 /* 1 for the opening angle bracked */) {
                        // If we are in the tag then return the element completions.
                        result = elementCompletions(templateInfo, path_1);
                    }
                    else if (templatePosition_1 < startTagSpan.end) {
                        // We are in the attribute section of the element (but not in an attribute).
                        // Return the attribute completions.
                        result = attributeCompletions(templateInfo, path_1);
                    }
                },
                visitAttribute: function (ast) {
                    if (!ast.valueSpan || !utils_1.inSpan(templatePosition_1, utils_1.spanOf(ast.valueSpan))) {
                        // We are in the name of an attribute. Show attribute completions.
                        result = attributeCompletions(templateInfo, path_1);
                    }
                    else if (ast.valueSpan && utils_1.inSpan(templatePosition_1, utils_1.spanOf(ast.valueSpan))) {
                        result = attributeValueCompletions(templateInfo, templatePosition_1, ast);
                    }
                },
                visitText: function (ast) {
                    // Check if we are in a entity.
                    result = entityCompletions(getSourceText(template, utils_1.spanOf(ast)), astPosition_1);
                    if (result)
                        return result;
                    result = interpolationCompletions(templateInfo, templatePosition_1);
                    if (result)
                        return result;
                    var element = path_1.first(compiler_1.Element);
                    if (element) {
                        var definition = compiler_1.getHtmlTagDefinition(element.name);
                        if (definition.contentType === compiler_1.TagContentType.PARSABLE_DATA) {
                            result = voidElementAttributeCompletions(templateInfo, path_1);
                            if (!result) {
                                // If the element can hold content Show element completions.
                                result = elementCompletions(templateInfo, path_1);
                            }
                        }
                    }
                    else {
                        // If no element container, implies parsable data so show elements.
                        result = voidElementAttributeCompletions(templateInfo, path_1);
                        if (!result) {
                            result = elementCompletions(templateInfo, path_1);
                        }
                    }
                },
                visitComment: function (ast) { },
                visitExpansion: function (ast) { },
                visitExpansionCase: function (ast) { }
            }, null);
        }
    }
    return result;
}
exports.getTemplateCompletions = getTemplateCompletions;
function attributeCompletions(info, path) {
    var item = path.tail instanceof compiler_1.Element ? path.tail : path.parentOf(path.tail);
    if (item instanceof compiler_1.Element) {
        return attributeCompletionsForElement(info, item.name, item);
    }
    return undefined;
}
function attributeCompletionsForElement(info, elementName, element) {
    var attributes = getAttributeInfosForElement(info, elementName, element);
    // Map all the attributes to a completion
    return attributes.map(function (attr) { return ({
        kind: attr.fromHtml ? 'html attribute' : 'attribute',
        name: nameOfAttr(attr),
        sort: attr.name
    }); });
}
function getAttributeInfosForElement(info, elementName, element) {
    var attributes = [];
    // Add html attributes
    var htmlAttributes = html_info_1.attributeNames(elementName) || [];
    if (htmlAttributes) {
        attributes.push.apply(attributes, htmlAttributes.map(function (name) { return ({ name: name, fromHtml: true }); }));
    }
    // Add html properties
    var htmlProperties = html_info_1.propertyNames(elementName);
    if (htmlProperties) {
        attributes.push.apply(attributes, htmlProperties.map(function (name) { return ({ name: name, input: true }); }));
    }
    // Add html events
    var htmlEvents = html_info_1.eventNames(elementName);
    if (htmlEvents) {
        attributes.push.apply(attributes, htmlEvents.map(function (name) { return ({ name: name, output: true }); }));
    }
    var _a = utils_1.getSelectors(info), selectors = _a.selectors, selectorMap = _a.map;
    if (selectors && selectors.length) {
        // All the attributes that are selectable should be shown.
        var applicableSelectors = selectors.filter(function (selector) { return !selector.element || selector.element == elementName; });
        var selectorAndAttributeNames = applicableSelectors.map(function (selector) { return ({ selector: selector, attrs: selector.attrs.filter(function (a) { return !!a; }) }); });
        var attrs_1 = utils_1.flatten(selectorAndAttributeNames.map(function (selectorAndAttr) {
            var directive = selectorMap.get(selectorAndAttr.selector);
            var result = selectorAndAttr.attrs.map(function (name) { return ({ name: name, input: name in directive.inputs, output: name in directive.outputs }); });
            return result;
        }));
        // Add template attribute if a directive contains a template reference
        selectorAndAttributeNames.forEach(function (selectorAndAttr) {
            var selector = selectorAndAttr.selector;
            var directive = selectorMap.get(selector);
            if (directive && utils_1.hasTemplateReference(directive.type) && selector.attrs.length &&
                selector.attrs[0]) {
                attrs_1.push({ name: selector.attrs[0], template: true });
            }
        });
        // All input and output properties of the matching directives should be added.
        var elementSelector = element ?
            createElementCssSelector(element) :
            createElementCssSelector(new compiler_1.Element(elementName, [], [], null, null, null));
        var matcher = new compiler_1.SelectorMatcher();
        matcher.addSelectables(selectors);
        matcher.match(elementSelector, function (selector) {
            var directive = selectorMap.get(selector);
            if (directive) {
                attrs_1.push.apply(attrs_1, Object.keys(directive.inputs).map(function (name) { return ({ name: name, input: true }); }));
                attrs_1.push.apply(attrs_1, Object.keys(directive.outputs).map(function (name) { return ({ name: name, output: true }); }));
            }
        });
        // If a name shows up twice, fold it into a single value.
        attrs_1 = foldAttrs(attrs_1);
        // Now expand them back out to ensure that input/output shows up as well as input and
        // output.
        attributes.push.apply(attributes, utils_1.flatten(attrs_1.map(expandedAttr)));
    }
    return attributes;
}
function attributeValueCompletions(info, position, attr) {
    var path = utils_1.findTemplateAstAt(info.templateAst, position);
    var mostSpecific = path.tail;
    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
    if (mostSpecific) {
        var visitor = new ExpressionVisitor(info, position, attr, function () { return compiler_cli_1.getExpressionScope(dinfo, path, false); });
        mostSpecific.visit(visitor, null);
        if (!visitor.result || !visitor.result.length) {
            // Try allwoing widening the path
            var widerPath_1 = utils_1.findTemplateAstAt(info.templateAst, position, /* allowWidening */ true);
            if (widerPath_1.tail) {
                var widerVisitor = new ExpressionVisitor(info, position, attr, function () { return compiler_cli_1.getExpressionScope(dinfo, widerPath_1, false); });
                widerPath_1.tail.visit(widerVisitor, null);
                return widerVisitor.result;
            }
        }
        return visitor.result;
    }
}
function elementCompletions(info, path) {
    var htmlNames = html_info_1.elementNames().filter(function (name) { return !(name in hiddenHtmlElements); });
    // Collect the elements referenced by the selectors
    var directiveElements = utils_1.getSelectors(info)
        .selectors.map(function (selector) { return selector.element; })
        .filter(function (name) { return !!name; });
    var components = directiveElements.map(function (name) { return ({ kind: 'component', name: name, sort: name }); });
    var htmlElements = htmlNames.map(function (name) { return ({ kind: 'element', name: name, sort: name }); });
    // Return components and html elements
    return utils_1.uniqueByName(htmlElements.concat(components));
}
function entityCompletions(value, position) {
    // Look for entity completions
    var re = /&[A-Za-z]*;?(?!\d)/g;
    var found;
    var result = undefined;
    while (found = re.exec(value)) {
        var len = found[0].length;
        if (position >= found.index && position < (found.index + len)) {
            result = Object.keys(compiler_1.NAMED_ENTITIES)
                .map(function (name) { return ({ kind: 'entity', name: "&" + name + ";", sort: name }); });
            break;
        }
    }
    return result;
}
function interpolationCompletions(info, position) {
    // Look for an interpolation in at the position.
    var templatePath = utils_1.findTemplateAstAt(info.templateAst, position);
    var mostSpecific = templatePath.tail;
    if (mostSpecific) {
        var visitor = new ExpressionVisitor(info, position, undefined, function () { return compiler_cli_1.getExpressionScope(utils_1.diagnosticInfoFromTemplateInfo(info), templatePath, false); });
        mostSpecific.visit(visitor, null);
        return utils_1.uniqueByName(visitor.result);
    }
}
// There is a special case of HTML where text that contains a unclosed tag is treated as
// text. For exaple '<h1> Some <a text </h1>' produces a text nodes inside of the H1
// element "Some <a text". We, however, want to treat this as if the user was requesting
// the attributes of an "a" element, not requesting completion in the a text element. This
// code checks for this case and returns element completions if it is detected or undefined
// if it is not.
function voidElementAttributeCompletions(info, path) {
    var tail = path.tail;
    if (tail instanceof compiler_1.Text) {
        var match = tail.value.match(/<(\w(\w|\d|-)*:)?(\w(\w|\d|-)*)\s/);
        // The position must be after the match, otherwise we are still in a place where elements
        // are expected (such as `<|a` or `<a|`; we only want attributes for `<a |` or after).
        if (match &&
            path.position >= (match.index || 0) + match[0].length + tail.sourceSpan.start.offset) {
            return attributeCompletionsForElement(info, match[3]);
        }
    }
}
var ExpressionVisitor = (function (_super) {
    __extends(ExpressionVisitor, _super);
    function ExpressionVisitor(info, position, attr, getExpressionScope) {
        var _this = _super.call(this) || this;
        _this.info = info;
        _this.position = position;
        _this.attr = attr;
        _this.getExpressionScope = getExpressionScope || (function () { return info.template.members; });
        return _this;
    }
    ExpressionVisitor.prototype.visitDirectiveProperty = function (ast) {
        this.attributeValueCompletions(ast.value);
    };
    ExpressionVisitor.prototype.visitElementProperty = function (ast) {
        this.attributeValueCompletions(ast.value);
    };
    ExpressionVisitor.prototype.visitEvent = function (ast) { this.attributeValueCompletions(ast.handler); };
    ExpressionVisitor.prototype.visitElement = function (ast) {
        var _this = this;
        if (this.attr && utils_1.getSelectors(this.info) && this.attr.name.startsWith(TEMPLATE_ATTR_PREFIX)) {
            // The value is a template expression but the expression AST was not produced when the
            // TemplateAst was produce so
            // do that now.
            var key_1 = this.attr.name.substr(TEMPLATE_ATTR_PREFIX.length);
            // Find the selector
            var selectorInfo = utils_1.getSelectors(this.info);
            var selectors = selectorInfo.selectors;
            var selector_1 = selectors.filter(function (s) { return s.attrs.some(function (attr, i) { return i % 2 == 0 && attr == key_1; }); })[0];
            var templateBindingResult = this.info.expressionParser.parseTemplateBindings(key_1, this.attr.value, null);
            // find the template binding that contains the position
            if (!this.attr.valueSpan)
                return;
            var valueRelativePosition_1 = this.position - this.attr.valueSpan.start.offset - 1;
            var bindings = templateBindingResult.templateBindings;
            var binding = bindings.find(function (binding) { return utils_1.inSpan(valueRelativePosition_1, binding.span, /* exclusive */ true); }) ||
                bindings.find(function (binding) { return utils_1.inSpan(valueRelativePosition_1, binding.span); });
            var keyCompletions = function () {
                var keys = [];
                if (selector_1) {
                    var attrNames = selector_1.attrs.filter(function (_, i) { return i % 2 == 0; });
                    keys = attrNames.filter(function (name) { return name.startsWith(key_1) && name != key_1; })
                        .map(function (name) { return lowerName(name.substr(key_1.length)); });
                }
                keys.push('let');
                _this.result = keys.map(function (key) { return ({ kind: 'key', name: key, sort: key }); });
            };
            if (!binding || (binding.key == key_1 && !binding.expression)) {
                // We are in the root binding. We should return `let` and keys that are left in the
                // selector.
                keyCompletions();
            }
            else if (binding.keyIsVar) {
                var equalLocation = this.attr.value.indexOf('=');
                this.result = [];
                if (equalLocation >= 0 && valueRelativePosition_1 >= equalLocation) {
                    // We are after the '=' in a let clause. The valid values here are the members of the
                    // template reference's type parameter.
                    var directiveMetadata = selectorInfo.map.get(selector_1);
                    if (directiveMetadata) {
                        var contextTable = this.info.template.query.getTemplateContext(directiveMetadata.type.reference);
                        if (contextTable) {
                            this.result = this.symbolsToCompletions(contextTable.values());
                        }
                    }
                }
                else if (binding.key && valueRelativePosition_1 <= (binding.key.length - key_1.length)) {
                    keyCompletions();
                }
            }
            else {
                // If the position is in the expression or after the key or there is no key, return the
                // expression completions
                if ((binding.expression && utils_1.inSpan(valueRelativePosition_1, binding.expression.ast.span)) ||
                    (binding.key &&
                        valueRelativePosition_1 > binding.span.start + (binding.key.length - key_1.length)) ||
                    !binding.key) {
                    var span = new compiler_1.ParseSpan(0, this.attr.value.length);
                    this.attributeValueCompletions(binding.expression ? binding.expression.ast :
                        new compiler_1.PropertyRead(span, new compiler_1.ImplicitReceiver(span), ''), valueRelativePosition_1);
                }
                else {
                    keyCompletions();
                }
            }
        }
    };
    ExpressionVisitor.prototype.visitBoundText = function (ast) {
        var expressionPosition = this.position - ast.sourceSpan.start.offset;
        if (utils_1.inSpan(expressionPosition, ast.value.span)) {
            var completions = expressions_1.getExpressionCompletions(this.getExpressionScope(), ast.value, expressionPosition, this.info.template.query);
            if (completions) {
                this.result = this.symbolsToCompletions(completions);
            }
        }
    };
    ExpressionVisitor.prototype.attributeValueCompletions = function (value, position) {
        var symbols = expressions_1.getExpressionCompletions(this.getExpressionScope(), value, position == null ? this.attributeValuePosition : position, this.info.template.query);
        if (symbols) {
            this.result = this.symbolsToCompletions(symbols);
        }
    };
    ExpressionVisitor.prototype.symbolsToCompletions = function (symbols) {
        return symbols.filter(function (s) { return !s.name.startsWith('__') && s.public; })
            .map(function (symbol) { return ({ kind: symbol.kind, name: symbol.name, sort: symbol.name }); });
    };
    Object.defineProperty(ExpressionVisitor.prototype, "attributeValuePosition", {
        get: function () {
            if (this.attr && this.attr.valueSpan) {
                return this.position - this.attr.valueSpan.start.offset - 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return ExpressionVisitor;
}(compiler_1.NullTemplateVisitor));
function getSourceText(template, span) {
    return template.source.substring(span.start, span.end);
}
function nameOfAttr(attr) {
    var name = attr.name;
    if (attr.output) {
        name = utils_1.removeSuffix(name, 'Events');
        name = utils_1.removeSuffix(name, 'Changed');
    }
    var result = [name];
    if (attr.input) {
        result.unshift('[');
        result.push(']');
    }
    if (attr.output) {
        result.unshift('(');
        result.push(')');
    }
    if (attr.template) {
        result.unshift('*');
    }
    return result.join('');
}
var templateAttr = /^(\w+:)?(template$|^\*)/;
function createElementCssSelector(element) {
    var cssSelector = new compiler_1.CssSelector();
    var elNameNoNs = compiler_1.splitNsName(element.name)[1];
    cssSelector.setElement(elNameNoNs);
    for (var _i = 0, _a = element.attrs; _i < _a.length; _i++) {
        var attr = _a[_i];
        if (!attr.name.match(templateAttr)) {
            var _b = compiler_1.splitNsName(attr.name), _ = _b[0], attrNameNoNs = _b[1];
            cssSelector.addAttribute(attrNameNoNs, attr.value);
            if (attr.name.toLowerCase() == 'class') {
                var classes = attr.value.split(/s+/g);
                classes.forEach(function (className) { return cssSelector.addClassName(className); });
            }
        }
    }
    return cssSelector;
}
function foldAttrs(attrs) {
    var inputOutput = new Map();
    var templates = new Map();
    var result = [];
    attrs.forEach(function (attr) {
        if (attr.fromHtml) {
            return attr;
        }
        if (attr.template) {
            var duplicate = templates.get(attr.name);
            if (!duplicate) {
                result.push({ name: attr.name, template: true });
                templates.set(attr.name, attr);
            }
        }
        if (attr.input || attr.output) {
            var duplicate = inputOutput.get(attr.name);
            if (duplicate) {
                duplicate.input = duplicate.input || attr.input;
                duplicate.output = duplicate.output || attr.output;
            }
            else {
                var cloneAttr = { name: attr.name };
                if (attr.input)
                    cloneAttr.input = true;
                if (attr.output)
                    cloneAttr.output = true;
                result.push(cloneAttr);
                inputOutput.set(attr.name, cloneAttr);
            }
        }
    });
    return result;
}
function expandedAttr(attr) {
    if (attr.input && attr.output) {
        return [
            attr, { name: attr.name, input: true, output: false },
            { name: attr.name, input: false, output: true }
        ];
    }
    return [attr];
}
function lowerName(name) {
    return name && (name[0].toLowerCase() + name.substr(1));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9jb21wbGV0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBbWY7QUFDbmYsc0RBQWlGO0FBR2pGLDZDQUF1RDtBQUN2RCx5Q0FBb0Y7QUFFcEYsaUNBQW1LO0FBRW5LLElBQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFDO0FBRWpDLElBQU0sa0JBQWtCLEdBQUc7SUFDekIsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLFFBQVEsRUFBRSxJQUFJO0lBQ2QsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUM7QUFFRixnQ0FBdUMsWUFBMEI7SUFDL0QsSUFBSSxNQUFNLEdBQTBCLFNBQVMsQ0FBQztJQUN6QyxJQUFBLDhCQUFPLEVBQUUsc0NBQVcsRUFBRSxnQ0FBUSxDQUFpQjtJQUNwRCw2RUFBNkU7SUFDN0UsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksa0JBQWdCLEdBQUcsWUFBWSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNuRSxJQUFJLE1BQUksR0FBRyxtQkFBUSxDQUFDLE9BQU8sRUFBRSxrQkFBZ0IsQ0FBQyxDQUFDO1FBQy9DLElBQUksWUFBWSxHQUFHLE1BQUksQ0FBQyxJQUFJLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsTUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxHQUFHLGtCQUFrQixD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