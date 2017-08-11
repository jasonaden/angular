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
/**
 * A segment of text within the template.
 */
var TextAst = (function () {
    function TextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return TextAst;
}());
exports.TextAst = TextAst;
/**
 * A bound expression within the text of a template.
 */
var BoundTextAst = (function () {
    function BoundTextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    BoundTextAst.prototype.visit = function (visitor, context) {
        return visitor.visitBoundText(this, context);
    };
    return BoundTextAst;
}());
exports.BoundTextAst = BoundTextAst;
/**
 * A plain attribute on an element.
 */
var AttrAst = (function () {
    function AttrAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
    return AttrAst;
}());
exports.AttrAst = AttrAst;
/**
 * A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
 * `[@trigger]="stateExp"`)
 */
var BoundElementPropertyAst = (function () {
    function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
    }
    BoundElementPropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitElementProperty(this, context);
    };
    Object.defineProperty(BoundElementPropertyAst.prototype, "isAnimation", {
        get: function () { return this.type === PropertyBindingType.Animation; },
        enumerable: true,
        configurable: true
    });
    return BoundElementPropertyAst;
}());
exports.BoundElementPropertyAst = BoundElementPropertyAst;
/**
 * A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
 * `(@trigger.phase)="callback($event)"`).
 */
var BoundEventAst = (function () {
    function BoundEventAst(name, target, phase, handler, sourceSpan) {
        this.name = name;
        this.target = target;
        this.phase = phase;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
    }
    BoundEventAst.calcFullName = function (name, target, phase) {
        if (target) {
            return target + ":" + name;
        }
        else if (phase) {
            return "@" + name + "." + phase;
        }
        else {
            return name;
        }
    };
    BoundEventAst.prototype.visit = function (visitor, context) {
        return visitor.visitEvent(this, context);
    };
    Object.defineProperty(BoundEventAst.prototype, "fullName", {
        get: function () { return BoundEventAst.calcFullName(this.name, this.target, this.phase); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundEventAst.prototype, "isAnimation", {
        get: function () { return !!this.phase; },
        enumerable: true,
        configurable: true
    });
    return BoundEventAst;
}());
exports.BoundEventAst = BoundEventAst;
/**
 * A reference declaration on an element (e.g. `let someName="expression"`).
 */
var ReferenceAst = (function () {
    function ReferenceAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    ReferenceAst.prototype.visit = function (visitor, context) {
        return visitor.visitReference(this, context);
    };
    return ReferenceAst;
}());
exports.ReferenceAst = ReferenceAst;
/**
 * A variable declaration on a <ng-template> (e.g. `var-someName="someLocalName"`).
 */
var VariableAst = (function () {
    function VariableAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    VariableAst.prototype.visit = function (visitor, context) {
        return visitor.visitVariable(this, context);
    };
    return VariableAst;
}());
exports.VariableAst = VariableAst;
/**
 * An element declaration in a template.
 */
var ElementAst = (function () {
    function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.references = references;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    ElementAst.prototype.visit = function (visitor, context) {
        return visitor.visitElement(this, context);
    };
    return ElementAst;
}());
exports.ElementAst = ElementAst;
/**
 * A `<ng-template>` element included in an Angular template.
 */
var EmbeddedTemplateAst = (function () {
    function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
        this.attrs = attrs;
        this.outputs = outputs;
        this.references = references;
        this.variables = variables;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    };
    return EmbeddedTemplateAst;
}());
exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
/**
 * A directive property with a bound value (e.g. `*ngIf="condition").
 */
var BoundDirectivePropertyAst = (function () {
    function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
        this.directiveName = directiveName;
        this.templateName = templateName;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
    };
    return BoundDirectivePropertyAst;
}());
exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
/**
 * A directive declared on an element.
 */
var DirectiveAst = (function () {
    function DirectiveAst(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
        this.directive = directive;
        this.inputs = inputs;
        this.hostProperties = hostProperties;
        this.hostEvents = hostEvents;
        this.contentQueryStartId = contentQueryStartId;
        this.sourceSpan = sourceSpan;
    }
    DirectiveAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirective(this, context);
    };
    return DirectiveAst;
}());
exports.DirectiveAst = DirectiveAst;
/**
 * A provider declared on an element
 */
var ProviderAst = (function () {
    function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
        this.token = token;
        this.multiProvider = multiProvider;
        this.eager = eager;
        this.providers = providers;
        this.providerType = providerType;
        this.lifecycleHooks = lifecycleHooks;
        this.sourceSpan = sourceSpan;
    }
    ProviderAst.prototype.visit = function (visitor, context) {
        // No visit method in the visitor for now...
        return null;
    };
    return ProviderAst;
}());
exports.ProviderAst = ProviderAst;
var ProviderAstType;
(function (ProviderAstType) {
    ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
    ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
    ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
    ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
    ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
})(ProviderAstType = exports.ProviderAstType || (exports.ProviderAstType = {}));
/**
 * Position where content is to be projected (instance of `<ng-content>` in a template).
 */
var NgContentAst = (function () {
    function NgContentAst(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    NgContentAst.prototype.visit = function (visitor, context) {
        return visitor.visitNgContent(this, context);
    };
    return NgContentAst;
}());
exports.NgContentAst = NgContentAst;
/**
 * Enumeration of types of property bindings.
 */
var PropertyBindingType;
(function (PropertyBindingType) {
    /**
     * A normal binding to a property (e.g. `[property]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
    /**
     * A binding to an element attribute (e.g. `[attr.name]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
    /**
     * A binding to a CSS class (e.g. `[class.name]="condition"`).
     */
    PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
    /**
     * A binding to a style rule (e.g. `[style.rule]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
    /**
     * A binding to an animation reference (e.g. `[animate.key]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Animation"] = 4] = "Animation";
})(PropertyBindingType = exports.PropertyBindingType || (exports.PropertyBindingType = {}));
/**
 * A visitor that accepts each node but doesn't do anything. It is intended to be used
 * as the base class for a visitor that is only interested in a subset of the node types.
 */
var NullTemplateVisitor = (function () {
    function NullTemplateVisitor() {
    }
    NullTemplateVisitor.prototype.visitNgContent = function (ast, context) { };
    NullTemplateVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { };
    NullTemplateVisitor.prototype.visitElement = function (ast, context) { };
    NullTemplateVisitor.prototype.visitReference = function (ast, context) { };
    NullTemplateVisitor.prototype.visitVariable = function (ast, context) { };
    NullTemplateVisitor.prototype.visitEvent = function (ast, context) { };
    NullTemplateVisitor.prototype.visitElementProperty = function (ast, context) { };
    NullTemplateVisitor.prototype.visitAttr = function (ast, context) { };
    NullTemplateVisitor.prototype.visitBoundText = function (ast, context) { };
    NullTemplateVisitor.prototype.visitText = function (ast, context) { };
    NullTemplateVisitor.prototype.visitDirective = function (ast, context) { };
    NullTemplateVisitor.prototype.visitDirectiveProperty = function (ast, context) { };
    return NullTemplateVisitor;
}());
exports.NullTemplateVisitor = NullTemplateVisitor;
/**
 * Base class that can be used to build a visitor that visits each node
 * in an template ast recursively.
 */
var RecursiveTemplateAstVisitor = (function (_super) {
    __extends(RecursiveTemplateAstVisitor, _super);
    function RecursiveTemplateAstVisitor() {
        return _super.call(this) || this;
    }
    // Nodes with children
    RecursiveTemplateAstVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        return this.visitChildren(context, function (visit) {
            visit(ast.attrs);
            visit(ast.references);
            visit(ast.variables);
            visit(ast.directives);
            visit(ast.providers);
            visit(ast.children);
        });
    };
    RecursiveTemplateAstVisitor.prototype.visitElement = function (ast, context) {
        return this.visitChildren(context, function (visit) {
            visit(ast.attrs);
            visit(ast.inputs);
            visit(ast.outputs);
            visit(ast.references);
            visit(ast.directives);
            visit(ast.providers);
            visit(ast.children);
        });
    };
    RecursiveTemplateAstVisitor.prototype.visitDirective = function (ast, context) {
        return this.visitChildren(context, function (visit) {
            visit(ast.inputs);
            visit(ast.hostProperties);
            visit(ast.hostEvents);
        });
    };
    RecursiveTemplateAstVisitor.prototype.visitChildren = function (context, cb) {
        var results = [];
        var t = this;
        function visit(children) {
            if (children && children.length)
                results.push(templateVisitAll(t, children, context));
        }
        cb(visit);
        return [].concat.apply([], results);
    };
    return RecursiveTemplateAstVisitor;
}(NullTemplateVisitor));
exports.RecursiveTemplateAstVisitor = RecursiveTemplateAstVisitor;
/**
 * Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
 */
function templateVisitAll(visitor, asts, context) {
    if (context === void 0) { context = null; }
    var result = [];
    var visit = visitor.visit ?
        function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    asts.forEach(function (ast) {
        var astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
exports.templateVisitAll = templateVisitAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBMkJIOztHQUVHO0FBQ0g7SUFDRSxpQkFDVyxLQUFhLEVBQVMsY0FBc0IsRUFBUyxVQUEyQjtRQUFoRixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtJQUFHLENBQUM7SUFDL0YsdUJBQUssR0FBTCxVQUFNLE9BQTJCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEcsY0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksMEJBQU87QUFNcEI7O0dBRUc7QUFDSDtJQUNFLHNCQUNXLEtBQVUsRUFBUyxjQUFzQixFQUFTLFVBQTJCO1FBQTdFLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWlCO0lBQUcsQ0FBQztJQUM1Riw0QkFBSyxHQUFMLFVBQU0sT0FBMkIsRUFBRSxPQUFZO1FBQzdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLG9DQUFZO0FBUXpCOztHQUVHO0FBQ0g7SUFDRSxpQkFBbUIsSUFBWSxFQUFTLEtBQWEsRUFBUyxVQUEyQjtRQUF0RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLGVBQVUsR0FBVixV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