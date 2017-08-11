"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../../src/ml_parser/ast");
function humanizeDom(parseResult, addSourceSpan) {
    if (addSourceSpan === void 0) { addSourceSpan = false; }
    if (parseResult.errors.length > 0) {
        var errorString = parseResult.errors.join('\n');
        throw new Error("Unexpected parse errors:\n" + errorString);
    }
    return humanizeNodes(parseResult.rootNodes, addSourceSpan);
}
exports.humanizeDom = humanizeDom;
function humanizeDomSourceSpans(parseResult) {
    return humanizeDom(parseResult, true);
}
exports.humanizeDomSourceSpans = humanizeDomSourceSpans;
function humanizeNodes(nodes, addSourceSpan) {
    if (addSourceSpan === void 0) { addSourceSpan = false; }
    var humanizer = new _Humanizer(addSourceSpan);
    html.visitAll(humanizer, nodes);
    return humanizer.result;
}
exports.humanizeNodes = humanizeNodes;
function humanizeLineColumn(location) {
    return location.line + ":" + location.col;
}
exports.humanizeLineColumn = humanizeLineColumn;
var _Humanizer = (function () {
    function _Humanizer(includeSourceSpan) {
        this.includeSourceSpan = includeSourceSpan;
        this.result = [];
        this.elDepth = 0;
    }
    ;
    _Humanizer.prototype.visitElement = function (element, context) {
        var res = this._appendContext(element, [html.Element, element.name, this.elDepth++]);
        this.result.push(res);
        html.visitAll(this, element.attrs);
        html.visitAll(this, element.children);
        this.elDepth--;
    };
    _Humanizer.prototype.visitAttribute = function (attribute, context) {
        var res = this._appendContext(attribute, [html.Attribute, attribute.name, attribute.value]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitText = function (text, context) {
        var res = this._appendContext(text, [html.Text, text.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitComment = function (comment, context) {
        var res = this._appendContext(comment, [html.Comment, comment.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitExpansion = function (expansion, context) {
        var res = this._appendContext(expansion, [html.Expansion, expansion.switchValue, expansion.type, this.elDepth++]);
        this.result.push(res);
        html.visitAll(this, expansion.cases);
        this.elDepth--;
    };
    _Humanizer.prototype.visitExpansionCase = function (expansionCase, context) {
        var res = this._appendContext(expansionCase, [html.ExpansionCase, expansionCase.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype._appendContext = function (ast, input) {
        if (!this.includeSourceSpan)
            return input;
        input.push(ast.sourceSpan.toString());
        return input;
    };
    return _Humanizer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0X3NwZWNfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L21sX3BhcnNlci9hc3Rfc3BlY191dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFnRDtBQUloRCxxQkFBNEIsV0FBNEIsRUFBRSxhQUE4QjtJQUE5Qiw4QkFBQSxFQUFBLHFCQUE4QjtJQUN0RixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLFdBQWEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQVBELGtDQU9DO0FBRUQsZ0NBQXVDLFdBQTRCO0lBQ2pFLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGRCx3REFFQztBQUVELHVCQUE4QixLQUFrQixFQUFFLGFBQThCO0lBQTlCLDhCQUFBLEVBQUEscUJBQThCO0lBQzlFLElBQU0sU0FBUyxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQzFCLENBQUM7QUFKRCxzQ0FJQztBQUVELDRCQUFtQyxRQUF1QjtJQUN4RCxNQUFNLENBQUksUUFBUSxDQUFDLElBQUksU0FBSSxRQUFRLENBQUMsR0FBSyxDQUFD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