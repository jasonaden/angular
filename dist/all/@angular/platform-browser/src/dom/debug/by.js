"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_adapter_1 = require("../../dom/dom_adapter");
/**
 * Predicates for use with {@link DebugElement}'s query functions.
 *
 * @experimental All debugging apis are currently experimental.
 */
var By = (function () {
    function By() {
    }
    /**
     * Match all elements.
     *
     * ## Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     */
    By.all = function () { return function (debugElement) { return true; }; };
    /**
     * Match elements by the given CSS selector.
     *
     * ## Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     */
    By.css = function (selector) {
        return function (debugElement) {
            return debugElement.nativeElement != null ?
                dom_adapter_1.getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        };
    };
    /**
     * Match elements that have the given directive present.
     *
     * ## Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     */
    By.directive = function (type) {
        return function (debugElement) { return debugElement.providerTokens.indexOf(type) !== -1; };
    };
    return By;
}());
exports.By = By;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZGVidWcvYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxxREFBNkM7QUFJN0M7Ozs7R0FJRztBQUNIO0lBQUE7SUFtQ0EsQ0FBQztJQWxDQzs7Ozs7O09BTUc7SUFDSSxNQUFHLEdBQVYsY0FBd0MsTUFBTSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDLENBQUM7SUFFeEU7Ozs7OztPQU1HO0lBQ0ksTUFBRyxHQUFWLFVBQVcsUUFBZ0I7UUFDekIsTUFBTSxDQUFDLFVBQUMsWUFBWTtZQUNsQixNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsSUFBSSxJQUFJO2dCQUNyQyxvQkFBTSxFQUFFLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDO2dCQUM3RCxLQUFLLENBQUM7UUFDWixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksWUFBUyxHQUFoQixVQUFpQixJQUFlO1FBQzlCLE1BQU0sQ0FBQyxVQUFDLFlBQVksSUFBSyxPQUFBLFlBQVksQ0FBQyxjQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQztJQUM5RSxDQUFDO0lBQ0gsU0FBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksZ0JBQUUifQ==