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
var ts = require("typescript");
function isParseSourceSpan(value) {
    return value && !!value.start;
}
exports.isParseSourceSpan = isParseSourceSpan;
function spanOf(span) {
    if (!span)
        return undefined;
    if (isParseSourceSpan(span)) {
        return { start: span.start.offset, end: span.end.offset };
    }
    else {
        if (span.endSourceSpan) {
            return { start: span.sourceSpan.start.offset, end: span.endSourceSpan.end.offset };
        }
        else if (span.children && span.children.length) {
            return {
                start: span.sourceSpan.start.offset,
                end: spanOf(span.children[span.children.length - 1]).end
            };
        }
        return { start: span.sourceSpan.start.offset, end: span.sourceSpan.end.offset };
    }
}
exports.spanOf = spanOf;
function inSpan(position, span, exclusive) {
    return span != null && (exclusive ? position >= span.start && position < span.end :
        position >= span.start && position <= span.end);
}
exports.inSpan = inSpan;
function offsetSpan(span, amount) {
    return { start: span.start + amount, end: span.end + amount };
}
exports.offsetSpan = offsetSpan;
function isNarrower(spanA, spanB) {
    return spanA.start >= spanB.start && spanA.end <= spanB.end;
}
exports.isNarrower = isNarrower;
function hasTemplateReference(type) {
    if (type.diDeps) {
        for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
            var diDep = _a[_i];
            if (diDep.token && diDep.token.identifier &&
                compiler_1.identifierName(diDep.token.identifier) == 'TemplateRef')
                return true;
        }
    }
    return false;
}
exports.hasTemplateReference = hasTemplateReference;
function getSelectors(info) {
    var map = new Map();
    var selectors = flatten(info.directives.map(function (directive) {
        var selectors = compiler_1.CssSelector.parse(directive.selector);
        selectors.forEach(function (selector) { return map.set(selector, directive); });
        return selectors;
    }));
    return { selectors: selectors, map: map };
}
exports.getSelectors = getSelectors;
function flatten(a) {
    return (_a = []).concat.apply(_a, a);
    var _a;
}
exports.flatten = flatten;
function removeSuffix(value, suffix) {
    if (value.endsWith(suffix))
        return value.substring(0, value.length - suffix.length);
    return value;
}
exports.removeSuffix = removeSuffix;
function uniqueByName(elements) {
    if (elements) {
        var result = [];
        var set = new Set();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            if (!set.has(element.name)) {
                set.add(element.name);
                result.push(element);
            }
        }
        return result;
    }
}
exports.uniqueByName = uniqueByName;
function isTypescriptVersion(low, high) {
    var version = ts.version;
    if (version.substring(0, low.length) < low)
        return false;
    if (high && (version.substring(0, high.length) > high))
        return false;
    return true;
}
exports.isTypescriptVersion = isTypescriptVersion;
function diagnosticInfoFromTemplateInfo(info) {
    return {
        fileName: info.fileName,
        offset: info.template.span.start,
        query: info.template.query,
        members: info.template.members,
        htmlAst: info.htmlAst,
        templateAst: info.templateAst
    };
}
exports.diagnosticInfoFromTemplateInfo = diagnosticInfoFromTemplateInfo;
function findTemplateAstAt(ast, position, allowWidening) {
    if (allowWidening === void 0) { allowWidening = false; }
    var path = [];
    var visitor = new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visit = function (ast, context) {
            var span = spanOf(ast);
            if (inSpan(position, span)) {
                var len = path.length;
                if (!len || allowWidening || isNarrower(span, spanOf(path[len - 1]))) {
                    path.push(ast);
                }
            }
            else {
                // Returning a value here will result in the children being skipped.
                return true;
            }
        };
        class_1.prototype.visitEmbeddedTemplate = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                // Ignore reference, variable and providers
                visit(ast.attrs);
                visit(ast.directives);
                visit(ast.children);
            });
        };
        class_1.prototype.visitElement = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                // Ingnore providers
                visit(ast.attrs);
                visit(ast.inputs);
                visit(ast.outputs);
                visit(ast.references);
                visit(ast.directives);
                visit(ast.children);
            });
        };
        class_1.prototype.visitDirective = function (ast, context) {
            // Ignore the host properties of a directive
            var result = this.visitChildren(context, function (visit) { visit(ast.inputs); });
            // We never care about the diretive itself, just its inputs.
            if (path[path.length - 1] == ast) {
                path.pop();
            }
            return result;
        };
        return class_1;
    }(compiler_1.RecursiveTemplateAstVisitor));
    compiler_1.templateVisitAll(visitor, ast);
    return new compiler_1.AstPath(path, position);
}
exports.findTemplateAstAt = findTemplateAstAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBNlQ7QUFFN1QsK0JBQWlDO0FBV2pDLDJCQUFrQyxLQUFVO0lBQzFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDaEMsQ0FBQztBQUZELDhDQUVDO0FBS0QsZ0JBQXVCLElBQW1DO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUM1QixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQzFELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDO1FBQ25GLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDO2dCQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dCQUNuQyxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUcsQ0FBQyxHQUFHO2FBQzNELENBQUM7UUFDSixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUM7SUFDaEYsQ0FBQztBQUNILENBQUM7QUFmRCx3QkFlQztBQUVELGdCQUF1QixRQUFnQixFQUFFLElBQVcsRUFBRSxTQUFtQjtJQUN2RSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUc7UUFDN0MsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBSEQsd0JBR0M7QUFFRCxvQkFBMkIsSUFBVSxFQUFFLE1BQWM7SUFDbkQsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBQyxDQUFDO0FBQzlELENBQUM7QUFGRCxnQ0FFQztBQUVELG9CQUEyQixLQUFXLEVBQUUsS0FBVztJQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUM5RCxDQUFDO0FBRkQsZ0NBRUM7QUFFRCw4QkFBcUMsSUFBeUI7SUFDNUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQWMsVUFBVyxFQUFYLEtBQUEsSUFBSSxDQUFDLE1BQU0sRUFBWCxjQUFXLEVBQVgsSUFBVztZQUF4QixJQUFJLEtBQUssU0FBQTtZQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVO2dCQUNyQyx5QkFBYyxDQUFDLEtBQUssQ0FBQyxLQUFPLENBQUMsVUFBWSxDQUFDLElBQUksYUFBYSxDQUFDO2dCQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFURCxvREFTQztBQUVELHNCQUE2QixJQUFrQjtJQUM3QyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBd0MsQ0FBQztJQUM1RCxJQUFNLFNBQVMsR0FBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsU0FBUztRQUNwRSxJQUFNLFNBQVMsR0FBa0Isc0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVUsQ0FBQyxDQUFDO1FBQ3pFLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNKLE1BQU0sQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFFLEdBQUcsS0FBQSxFQUFDLENBQUM7QUFDMUIsQ0FBQztBQVJELG9DQVFDO0FBRUQsaUJBQTJCLENBQVE7SUFDakMsTUFBTSxDQUFDLENBQUEsS0FBTSxFQUFHLENBQUEsQ0FBQyxNQUFNLFdBQUksQ0FBQyxFQUFFOztBQUNoQyxDQUFDO0FBRkQsMEJBRUM7QUFFRCxzQkFBNkIsS0FBYSxFQUFFLE1BQWM7SUFDeEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwRixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUhELG9DQUdDO0FBRUQsc0JBR0csUUFBeUI7SUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNiLElBQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztRQUN2QixJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxDQUFrQixVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVE7WUFBekIsSUFBTSxPQUFPLGlCQUFBO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBZkQsb0NBZUM7QUFFRCw2QkFBb0MsR0FBVyxFQUFFLElBQWE7SUFDNUQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUUzQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUV6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBRXJFLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBUkQsa0RBUUM7QUFFRCx3Q0FBK0MsSUFBa0I7SUFDL0QsTUFBTSxDQUFDO1FBQ0wsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUs7UUFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztRQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDckIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0tBQzlCLENBQUM7QUFDSixDQUFDO0FBVEQsd0VBU0M7QUFFRCwyQkFDSSxHQUFrQixFQUFFLFFBQWdCLEVBQUUsYUFBOEI7SUFBOUIsOEJBQUEsRUFBQSxxQkFBOEI7SUFDdEUsSUFBTSxJQUFJLEdBQWtCLEVBQUUsQ0FBQztJQUMvQixJQUFNLE9BQU8sR0FBRztRQUFrQiwyQkFBMkI7UUFBekM7O1FBNENwQixDQUFDO1FBM0NDLHVCQUFLLEdBQUwsVUFBTSxHQUFnQixFQUFFLE9BQVk7WUFDbEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxhQUFhLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLG9FQUFvRTtnQkFDcEUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO1FBRUQsdUNBQXFCLEdBQXJCLFVBQXNCLEdBQXdCLEVBQUUsT0FBWTtZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsVUFBQSxLQUFLO2dCQUN0QywyQ0FBMkM7Z0JBQzNDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsOEJBQVksR0FBWixVQUFhLEdBQWUsRUFBRSxPQUFZO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFBLEtBQUs7Z0JBQ3RDLG9CQUFvQjtnQkFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxnQ0FBYyxHQUFkLFVBQWUsR0FBaUIsRUFBRSxPQUFZO1lBQzVDLDRDQUE0QztZQUM1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFBLEtBQUssSUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUUsNERBQTREO1lBQzVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDSCxjQUFDO0lBQUQsQ0FBQyxBQTVDbUIsQ0FBYyxzQ0FBMkIsRUE0QzVELENBQUM7SUFFRiwyQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFL0IsTUFBTSxDQUFDLElBQUksa0JBQU8sQ0FBYyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQXBERCw4Q0FvREMifQ==