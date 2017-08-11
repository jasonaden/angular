"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../change_detection/constants");
var decorators_1 = require("../util/decorators");
/**
 * Directive decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Directive = decorators_1.makeDecorator('Directive', function (dir) {
    if (dir === void 0) { dir = {}; }
    return dir;
});
/**
 * Component decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Component = decorators_1.makeDecorator('Component', function (c) {
    if (c === void 0) { c = {}; }
    return (__assign({ changeDetection: constants_1.ChangeDetectionStrategy.Default }, c));
}, exports.Directive);
/**
 * Pipe decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Pipe = decorators_1.makeDecorator('Pipe', function (p) { return (__assign({ pure: true }, p)); });
/**
 * Input decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Input = decorators_1.makePropDecorator('Input', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
/**
 * Output decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.Output = decorators_1.makePropDecorator('Output', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
/**
 * HostBinding decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.HostBinding = decorators_1.makePropDecorator('HostBinding', function (hostPropertyName) { return ({ hostPropertyName: hostPropertyName }); });
/**
 * HostListener decorator and metadata.
 *
 * @stable
 * @Annotation
 */
exports.HostListener = decorators_1.makePropDecorator('HostListener', function (eventName, args) { return ({ eventName: eventName, args: args }); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL21ldGFkYXRhL2RpcmVjdGl2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILDJEQUFzRTtBQUd0RSxpREFBbUY7QUFnWW5GOzs7OztHQUtHO0FBQ1UsUUFBQSxTQUFTLEdBQ2xCLDBCQUFhLENBQUMsV0FBVyxFQUFFLFVBQUMsR0FBbUI7SUFBbkIsb0JBQUEsRUFBQSxRQUFtQjtJQUFLLE9BQUEsR0FBRztBQUFILENBQUcsQ0FBQyxDQUFDO0FBcVI3RDs7Ozs7R0FLRztBQUNVLFFBQUEsU0FBUyxHQUF1QiwwQkFBYSxDQUN0RCxXQUFXLEVBQUUsVUFBQyxDQUFpQjtJQUFqQixrQkFBQSxFQUFBLE1BQWlCO0lBQUssT0FBQSxZQUFFLGVBQWUsRUFBRSxtQ0FBdUIsQ0FBQyxPQUFPLElBQUssQ0FBQyxFQUFFO0FBQTFELENBQTBELEVBQzlGLGlCQUFTLENBQUMsQ0FBQztBQWlDZjs7Ozs7R0FLRztBQUNVLFFBQUEsSUFBSSxHQUFrQiwwQkFBYSxDQUFDLE1BQU0sRUFBRSxVQUFDLENBQU8sSUFBSyxPQUFBLFlBQUUsSUFBSSxFQUFFLElBQUksSUFBSyxDQUFDLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0FBaUU1Rjs7Ozs7R0FLRztBQUNVLFFBQUEsS0FBSyxHQUNkLDhCQUFpQixDQUFDLE9BQU8sRUFBRSxVQUFDLG1CQUE0QixJQUFLLE9BQUEsQ0FBQyxFQUFDLG1CQUFtQixxQkFBQSxFQUFDLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO0FBMkQxRjs7Ozs7R0FLRztBQUNVLFFBQUEsTUFBTSxHQUNmLDhCQUFpQixDQUFDLFFBQVEsRUFBRSxVQUFDLG1CQUE0QixJQUFLLE9BQUEsQ0FBQyxFQUFDLG1CQUFtQixxQkFBQSxFQUFDLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO0FBcUQzRjs7Ozs7R0FLRztBQUNVLFFBQUEsV0FBVyxHQUNwQiw4QkFBaUIsQ0FBQyxhQUFhLEVBQUUsVUFBQyxnQkFBeUIsSUFBSyxPQUFBLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBQyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQXVEMUY7Ozs7O0dBS0c7QUFDVSxRQUFBLFlBQVksR0FDckIsOEJBQWlCLENBQUMsY0FBYyxFQUFFLFVBQUMsU0FBa0IsRUFBRSxJQUFlLElBQUssT0FBQSxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUMifQ==