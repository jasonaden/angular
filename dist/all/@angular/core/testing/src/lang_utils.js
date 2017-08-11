"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function getTypeOf(instance /** TODO #9100 */) {
    return instance.constructor;
}
exports.getTypeOf = getTypeOf;
function instantiateType(type, params) {
    if (params === void 0) { params = []; }
    return new ((_a = type).bind.apply(_a, [void 0].concat(params)))();
    var _a;
}
exports.instantiateType = instantiateType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ191dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvbGFuZ191dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1CQUEwQixRQUFhLENBQUMsaUJBQWlCO0lBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQzlCLENBQUM7QUFGRCw4QkFFQztBQUVELHlCQUFnQyxJQUFjLEVBQUUsTUFBa0I7SUFBbEIsdUJBQUEsRUFBQSxXQUFrQjtJQUNoRSxNQUFNLE1BQUssQ0FBQSxLQUFNLElBQUssQ0FBQSxnQ0FBSSxNQUFNLE1BQUU7O0FBQ3BDLENBQUM7QUFGRCwwQ0FFQyJ9