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
var ast_path_1 = require("../ast_path");
var Text = (function () {
    function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    Text.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return Text;
}());
exports.Text = Text;
var Expansion = (function () {
    function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    Expansion.prototype.visit = function (visitor, context) { return visitor.visitExpansion(this, context); };
    return Expansion;
}());
exports.Expansion = Expansion;
var ExpansionCase = (function () {
    function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    ExpansionCase.prototype.visit = function (visitor, context) { return visitor.visitExpansionCase(this, context); };
    return ExpansionCase;
}());
exports.ExpansionCase = ExpansionCase;
var Attribute = (function () {
    function Attribute(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
    }
    Attribute.prototype.visit = function (visitor, context) { return visitor.visitAttribute(this, context); };
    return Attribute;
}());
exports.Attribute = Attribute;
var Element = (function () {
    function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
        if (startSourceSpan === void 0) { startSourceSpan = null; }
        if (endSourceSpan === void 0) { endSourceSpan = null; }
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    Element.prototype.visit = function (visitor, context) { return visitor.visitElement(this, context); };
    return Element;
}());
exports.Element = Element;
var Comment = (function () {
    function Comment(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    Comment.prototype.visit = function (visitor, context) { return visitor.visitComment(this, context); };
    return Comment;
}());
exports.Comment = Comment;
function visitAll(visitor, nodes, context) {
    if (context === void 0) { context = null; }
    var result = [];
    var visit = visitor.visit ?
        function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    nodes.forEach(function (ast) {
        var astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
exports.visitAll = visitAll;
var RecursiveVisitor = (function () {
    function RecursiveVisitor() {
    }
    RecursiveVisitor.prototype.visitElement = function (ast, context) {
        this.visitChildren(context, function (visit) {
            visit(ast.attrs);
            visit(ast.children);
        });
    };
    RecursiveVisitor.prototype.visitAttribute = function (ast, context) { };
    RecursiveVisitor.prototype.visitText = function (ast, context) { };
    RecursiveVisitor.prototype.visitComment = function (ast, context) { };
    RecursiveVisitor.prototype.visitExpansion = function (ast, context) {
        return this.visitChildren(context, function (visit) { visit(ast.cases); });
    };
    RecursiveVisitor.prototype.visitExpansionCase = function (ast, context) { };
    RecursiveVisitor.prototype.visitChildren = function (context, cb) {
        var results = [];
        var t = this;
        function visit(children) {
            if (children)
                results.push(visitAll(t, children, context));
        }
        cb(visit);
        return [].concat.apply([], results);
    };
    return RecursiveVisitor;
}());
exports.RecursiveVisitor = RecursiveVisitor;
function spanOf(ast) {
    var start = ast.sourceSpan.start.offset;
    var end = ast.sourceSpan.end.offset;
    if (ast instanceof Element) {
        if (ast.endSourceSpan) {
            end = ast.endSourceSpan.end.offset;
        }
        else if (ast.children && ast.children.length) {
            end = spanOf(ast.children[ast.children.length - 1]).end;
        }
    }
    return { start: start, end: end };
}
function findNode(nodes, position) {
    var path = [];
    var visitor = new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visit = function (ast, context) {
            var span = spanOf(ast);
            if (span.start <= position && position < span.end) {
                path.push(ast);
            }
            else {
                // Returning a value here will result in the children being skipped.
                return true;
            }
        };
        return class_1;
    }(RecursiveVisitor));
    visitAll(visitor, nodes);
    return new ast_path_1.AstPath(path, position);
}
exports.findNode = findNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsd0NBQW9DO0FBUXBDO0lBQ0UsY0FBbUIsS0FBYSxFQUFTLFVBQTJCO1FBQWpELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtJQUFHLENBQUM7SUFDeEUsb0JBQUssR0FBTCxVQUFNLE9BQWdCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsV0FBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksb0JBQUk7QUFLakI7SUFDRSxtQkFDVyxXQUFtQixFQUFTLElBQVksRUFBUyxLQUFzQixFQUN2RSxVQUEyQixFQUFTLHFCQUFzQztRQUQxRSxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN2RSxlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUFTLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBaUI7SUFBRyxDQUFDO0lBQ3pGLHlCQUFLLEdBQUwsVUFBTSxPQUFnQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlGLGdCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMWSw4QkFBUztBQU90QjtJQUNFLHVCQUNXLEtBQWEsRUFBUyxVQUFrQixFQUFTLFVBQTJCLEVBQzVFLGVBQWdDLEVBQVMsYUFBOEI7UUFEdkUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUM1RSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7SUFBRyxDQUFDO0lBRXRGLDZCQUFLLEdBQUwsVUFBTSxPQUFnQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEcsb0JBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLHNDQUFhO0FBUTFCO0lBQ0UsbUJBQ1csSUFBWSxFQUFTLEtBQWEsRUFBUyxVQUEyQixFQUN0RSxTQUEyQjtRQUQzQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQ3RFLGNBQVMsR0FBVCxTQUFTLENBQWtCO0lBQUcsQ0FBQztJQUMxQyx5QkFBSyxHQUFMLFVBQU0sT0FBZ0IsRUFBRSxPQUFZLElBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RixnQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksOEJBQVM7QUFPdEI7SUFDRSxpQkFDVyxJQUFZLEVBQVMsS0FBa0IsRUFBUyxRQUFnQixFQUNoRSxVQUEyQixFQUFTLGVBQTRDLEVBQ2hGLGFBQTBDO1FBRE4sZ0NBQUEsRUFBQSxzQkFBNEM7UUFDaEYsOEJBQUEsRUFBQSxvQkFBMEM7UUFGMUMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQWE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hFLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQTZCO1FBQ2hGLGtCQUFhLEdBQWIsYUFBYSxDQUE2QjtJQUFHLENBQUM7SUFDekQsdUJBQUssR0FBTCxVQUFNLE9BQWdCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUYsY0FBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTlksMEJBQU87QUFRcEI7SUFDRSxpQkFBbUIsS0FBa0IsRUFBUyxVQUEyQjtRQUF0RCxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7SUFBRyxDQUFDO0lBQzdFLHVCQUFLLEdBQUwsVUFBTSxPQUFnQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVGLGNBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLDBCQUFPO0FBa0JwQixrQkFBeUIsT0FBZ0IsRUFBRSxLQUFhLEVBQUUsT0FBbUI7SUFBbkIsd0JBQUEsRUFBQSxjQUFtQjtJQUMzRSxJQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7SUFFekIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUs7UUFDdkIsVUFBQyxHQUFTLElBQUssT0FBQSxPQUFPLENBQUMsS0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBNUQsQ0FBNEQ7UUFDM0UsVUFBQyxHQUFTLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztRQUNmLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFiRCw0QkFhQztBQUVEO0lBQ0U7SUFBZSxDQUFDO0lBRWhCLHVDQUFZLEdBQVosVUFBYSxHQUFZLEVBQUUsT0FBWTtRQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFBLEtBQUs7WUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlDQUFjLEdBQWQsVUFBZSxHQUFjLEVBQUUsT0FBWSxJQUFRLENBQUM7SUFDcEQsb0NBQVMsR0FBVCxVQUFVLEdBQVMsRUFBRSxPQUFZLElBQVEsQ0FBQztJQUMxQyx1Q0FBWSxHQUFaLFVBQWEsR0FBWSxFQUFFLE9BQVksSUFBUSxDQUFDO0lBRWhELHlDQUFjLEdBQWQsVUFBZSxHQUFjLEVBQUUsT0FBWTtRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsVUFBQSxLQUFLLElBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCw2Q0FBa0IsR0FBbEIsVUFBbUIsR0FBa0IsRUFBRSxPQUFZLElBQVEsQ0FBQztJQUVwRCx3Q0FBYSxHQUFyQixVQUNJLE9BQVksRUFBRSxFQUF3RTtRQUN4RixJQUFJLE9BQU8sR0FBWSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2IsZUFBK0IsUUFBeUI7WUFDdEQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ1YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBOUJELElBOEJDO0FBOUJZLDRDQUFnQjtBQWtDN0IsZ0JBQWdCLEdBQVM7SUFDdkIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN0QixHQUFHLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3JDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0MsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUMsQ0FBQztBQUN0QixDQUFDO0FBRUQsa0JBQXlCLEtBQWEsRUFBRSxRQUFnQjtJQUN0RCxJQUFNLElBQUksR0FBVyxFQUFFLENBQUM7SUFFeEIsSUFBTSxPQUFPLEdBQUc7UUFBa0IsMkJBQWdCO1FBQTlCOztRQVVwQixDQUFDO1FBVEMsdUJBQUssR0FBTCxVQUFNLEdBQVMsRUFBRSxPQUFZO1lBQzNCLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLG9FQUFvRTtnQkFDcEUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO1FBQ0gsY0FBQztJQUFELENBQUMsQUFWbUIsQ0FBYyxnQkFBZ0IsRUFVakQsQ0FBQztJQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFekIsTUFBTSxDQUFDLElBQUksa0JBQU8sQ0FBTyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQWxCRCw0QkFrQkMifQ==