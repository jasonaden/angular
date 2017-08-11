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
/**
 * Allows to refer to references which are not yet defined.
 *
 * For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
 * DI is declared,
 * but not yet defined. It is also used when the `token` which we use when creating a query is not
 * yet defined.
 *
 * ### Example
 * {@example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref'}
 * @experimental
 */
function forwardRef(forwardRefFn) {
    forwardRefFn.__forward_ref__ = forwardRef;
    forwardRefFn.toString = function () { return util_1.stringify(this()); };
    return forwardRefFn;
}
exports.forwardRef = forwardRef;
/**
 * Lazily retrieves the reference value from a forwardRef.
 *
 * Acts as the identity function when given a non-forward-ref value.
 *
 * ### Example ([live demo](http://plnkr.co/edit/GU72mJrk1fiodChcmiDR?p=preview))
 *
 * {@example core/di/ts/forward_ref/forward_ref_spec.ts region='resolve_forward_ref'}
 *
 * See: {@link forwardRef}
 * @experimental
 */
function resolveForwardRef(type) {
    if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__') &&
        type.__forward_ref__ === forwardRef) {
        return type();
    }
    else {
        return type;
    }
}
exports.resolveForwardRef = resolveForwardRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZF9yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9mb3J3YXJkX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGdDQUFrQztBQWNsQzs7Ozs7Ozs7Ozs7R0FXRztBQUNILG9CQUEyQixZQUEwQjtJQUM3QyxZQUFhLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztJQUMzQyxZQUFhLENBQUMsUUFBUSxHQUFHLGNBQWEsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RSxNQUFNLENBQWtCLFlBQWEsQ0FBQztBQUN4QyxDQUFDO0FBSkQsZ0NBSUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILDJCQUFrQyxJQUFTO0lBQ3pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO1FBQ3BFLElBQUksQ0FBQyxlQUFlLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQWdCLElBQUssRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQztBQVBELDhDQU9DIn0=