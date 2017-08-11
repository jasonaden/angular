"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var shared_1 = require("./shared");
/**
 * @experimental
 */
var NoopAnimationDriver = (function () {
    function NoopAnimationDriver() {
    }
    NoopAnimationDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    NoopAnimationDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    NoopAnimationDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    NoopAnimationDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return defaultValue || '';
    };
    NoopAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        return new animations_1.NoopAnimationPlayer();
    };
    return NoopAnimationDriver;
}());
exports.NoopAnimationDriver = NoopAnimationDriver;
/**
 * @experimental
 */
var AnimationDriver = (function () {
    function AnimationDriver() {
    }
    return AnimationDriver;
}());
AnimationDriver.NOOP = new NoopAnimationDriver();
exports.AnimationDriver = AnimationDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2RyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2FuaW1hdGlvbl9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBeUU7QUFFekUsbUNBQXNFO0FBR3RFOztHQUVHO0FBQ0g7SUFBQTtJQW9CQSxDQUFDO0lBbkJDLDRDQUFjLEdBQWQsVUFBZSxPQUFZLEVBQUUsUUFBZ0I7UUFDM0MsTUFBTSxDQUFDLHVCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCw2Q0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxJQUFTLElBQWEsTUFBTSxDQUFDLHdCQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixtQ0FBSyxHQUFMLFVBQU0sT0FBWSxFQUFFLFFBQWdCLEVBQUUsS0FBYztRQUNsRCxNQUFNLENBQUMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsT0FBWSxFQUFFLElBQVksRUFBRSxZQUFxQjtRQUM1RCxNQUFNLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQscUNBQU8sR0FBUCxVQUNJLE9BQVksRUFBRSxTQUE2QyxFQUFFLFFBQWdCLEVBQUUsS0FBYSxFQUM1RixNQUFjLEVBQUUsZUFBMkI7UUFBM0IsZ0NBQUEsRUFBQSxvQkFBMkI7UUFDN0MsTUFBTSxDQUFDLElBQUksZ0NBQW1CLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDO0FBcEJZLGtEQUFtQjtBQXNCaEM7O0dBRUc7QUFDSDtJQUFBO0lBY0EsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQWREO0FBQ1Msb0JBQUksR0FBb0IsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBRHJDLDBDQUFlIn0=