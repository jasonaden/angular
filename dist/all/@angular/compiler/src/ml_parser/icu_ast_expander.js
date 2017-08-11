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
var parse_util_1 = require("../parse_util");
var html = require("./ast");
// http://cldr.unicode.org/index/cldr-spec/plural-rules
var PLURAL_CASES = ['zero', 'one', 'two', 'few', 'many', 'other'];
/**
 * Expands special forms into elements.
 *
 * For example,
 *
 * ```
 * { messages.length, plural,
 *   =0 {zero}
 *   =1 {one}
 *   other {more than one}
 * }
 * ```
 *
 * will be expanded into
 *
 * ```
 * <ng-container [ngPlural]="messages.length">
 *   <ng-template ngPluralCase="=0">zero</ng-template>
 *   <ng-template ngPluralCase="=1">one</ng-template>
 *   <ng-template ngPluralCase="other">more than one</ng-template>
 * </ng-container>
 * ```
 */
function expandNodes(nodes) {
    var expander = new _Expander();
    return new ExpansionResult(html.visitAll(expander, nodes), expander.isExpanded, expander.errors);
}
exports.expandNodes = expandNodes;
var ExpansionResult = (function () {
    function ExpansionResult(nodes, expanded, errors) {
        this.nodes = nodes;
        this.expanded = expanded;
        this.errors = errors;
    }
    return ExpansionResult;
}());
exports.ExpansionResult = ExpansionResult;
var ExpansionError = (function (_super) {
    __extends(ExpansionError, _super);
    function ExpansionError(span, errorMsg) {
        return _super.call(this, span, errorMsg) || this;
    }
    return ExpansionError;
}(parse_util_1.ParseError));
exports.ExpansionError = ExpansionError;
/**
 * Expand expansion forms (plural, select) to directives
 *
 * @internal
 */
var _Expander = (function () {
    function _Expander() {
        this.isExpanded = false;
        this.errors = [];
    }
    _Expander.prototype.visitElement = function (element, context) {
        return new html.Element(element.name, element.attrs, html.visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
    };
    _Expander.prototype.visitAttribute = function (attribute, context) { return attribute; };
    _Expander.prototype.visitText = function (text, context) { return text; };
    _Expander.prototype.visitComment = function (comment, context) { return comment; };
    _Expander.prototype.visitExpansion = function (icu, context) {
        this.isExpanded = true;
        return icu.type == 'plural' ? _expandPluralForm(icu, this.errors) :
            _expandDefaultForm(icu, this.errors);
    };
    _Expander.prototype.visitExpansionCase = function (icuCase, context) {
        throw new Error('Should not be reached');
    };
    return _Expander;
}());
// Plural forms are expanded to `NgPlural` and `NgPluralCase`s
function _expandPluralForm(ast, errors) {
    var children = ast.cases.map(function (c) {
        if (PLURAL_CASES.indexOf(c.value) == -1 && !c.value.match(/^=\d+$/)) {
            errors.push(new ExpansionError(c.valueSourceSpan, "Plural cases should be \"=<number>\" or one of " + PLURAL_CASES.join(", ")));
        }
        var expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        return new html.Element("ng-template", [new html.Attribute('ngPluralCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    var switchAttr = new html.Attribute('[ngPlural]', ast.switchValue, ast.switchValueSourceSpan);
    return new html.Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}
// ICU messages (excluding plural form) are expanded to `NgSwitch`  and `NgSwitchCase`s
function _expandDefaultForm(ast, errors) {
    var children = ast.cases.map(function (c) {
        var expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        if (c.value === 'other') {
            // other is the default case when no values match
            return new html.Element("ng-template", [new html.Attribute('ngSwitchDefault', '', c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
        }
        return new html.Element("ng-template", [new html.Attribute('ngSwitchCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    var switchAttr = new html.Attribute('[ngSwitch]', ast.switchValue, ast.switchValueSourceSpan);
    return new html.Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWN1X2FzdF9leHBhbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9tbF9wYXJzZXIvaWN1X2FzdF9leHBhbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw0Q0FBMEQ7QUFFMUQsNEJBQThCO0FBRTlCLHVEQUF1RDtBQUN2RCxJQUFNLFlBQVksR0FBYSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFOUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxxQkFBNEIsS0FBa0I7SUFDNUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUNqQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkcsQ0FBQztBQUhELGtDQUdDO0FBRUQ7SUFDRSx5QkFBbUIsS0FBa0IsRUFBUyxRQUFpQixFQUFTLE1BQW9CO1FBQXpFLFVBQUssR0FBTCxLQUFLLENBQWE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBYztJQUFHLENBQUM7SUFDbEcsc0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLDBDQUFlO0FBSTVCO0lBQW9DLGtDQUFVO0lBQzVDLHdCQUFZLElBQXFCLEVBQUUsUUFBZ0I7ZUFBSSxrQkFBTSxJQUFJLEVBQUUsUUFBUSxDQUFDO0lBQUUsQ0FBQztJQUNqRixxQkFBQztBQUFELENBQUMsQUFGRCxDQUFvQyx1QkFBVSxHQUU3QztBQUZZLHdDQUFjO0FBSTNCOzs7O0dBSUc7QUFDSDtJQUFBO1FB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