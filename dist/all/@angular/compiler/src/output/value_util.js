"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var o = require("./output_ast");
exports.QUOTED_KEYS = '$quoted$';
function convertValueToOutputAst(ctx, value, type) {
    if (type === void 0) { type = null; }
    return util_1.visitValue(value, new _ValueOutputAstTransformer(ctx), type);
}
exports.convertValueToOutputAst = convertValueToOutputAst;
var _ValueOutputAstTransformer = (function () {
    function _ValueOutputAstTransformer(ctx) {
        this.ctx = ctx;
    }
    _ValueOutputAstTransformer.prototype.visitArray = function (arr, type) {
        var _this = this;
        return o.literalArr(arr.map(function (value) { return util_1.visitValue(value, _this, null); }), type);
    };
    _ValueOutputAstTransformer.prototype.visitStringMap = function (map, type) {
        var _this = this;
        var entries = [];
        var quotedSet = new Set(map && map[exports.QUOTED_KEYS]);
        Object.keys(map).forEach(function (key) {
            entries.push(new o.LiteralMapEntry(key, util_1.visitValue(map[key], _this, null), quotedSet.has(key)));
        });
        return new o.LiteralMapExpr(entries, type);
    };
    _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, type) { return o.literal(value, type); };
    _ValueOutputAstTransformer.prototype.visitOther = function (value, type) {
        if (value instanceof o.Expression) {
            return value;
        }
        else {
            return this.ctx.importExpr(value);
        }
    };
    return _ValueOutputAstTransformer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvdmFsdWVfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGdDQUFvRTtBQUVwRSxnQ0FBa0M7QUFFckIsUUFBQSxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBRXRDLGlDQUNJLEdBQWtCLEVBQUUsS0FBVSxFQUFFLElBQTBCO0lBQTFCLHFCQUFBLEVBQUEsV0FBMEI7SUFDNUQsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFFLElBQUksMEJBQTBCLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEUsQ0FBQztBQUhELDBEQUdDO0FBRUQ7SUFDRSxvQ0FBb0IsR0FBa0I7UUFBbEIsUUFBRyxHQUFILEdBQUcsQ0FBZTtJQUFHLENBQUM7SUFDMUMsK0NBQVUsR0FBVixVQUFXLEdBQVUsRUFBRSxJQUFZO1FBQW5DLGlCQUVDO1FBREMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLGlCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksRUFBRSxJQUFJLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxtREFBYyxHQUFkLFVBQWUsR0FBeUIsRUFBRSxJQUFlO1FBQXpELGlCQVFDO1FBUEMsSUFBTSxPQUFPLEdBQXdCLEVBQUUsQ0FBQztRQUN4QyxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLG1CQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUMxQixPQUFPLENBQUMsSUFBSSxDQUNSLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsaUJBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELG1EQUFjLEdBQWQsVUFBZSxLQUFVLEVBQUUsSUFBWSxJQUFrQixNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpGLCtDQUFVLEdBQVYsVUFBVyxLQUFVLEVBQUUsSUFBWTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDO0lBQ0gsQ0FBQztJQUNILGlDQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQyJ9