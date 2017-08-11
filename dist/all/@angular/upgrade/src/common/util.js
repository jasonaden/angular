"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DIRECTIVE_PREFIX_REGEXP = /^(?:x|data)[:\-_]/i;
var DIRECTIVE_SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;
function onError(e) {
    // TODO: (misko): We seem to not have a stack trace here!
    if (console.error) {
        console.error(e, e.stack);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log(e, e.stack);
    }
    throw e;
}
exports.onError = onError;
function controllerKey(name) {
    return '$' + name + 'Controller';
}
exports.controllerKey = controllerKey;
function directiveNormalize(name) {
    return name.replace(DIRECTIVE_PREFIX_REGEXP, '')
        .replace(DIRECTIVE_SPECIAL_CHARS_REGEXP, function (_, letter) { return letter.toUpperCase(); });
}
exports.directiveNormalize = directiveNormalize;
function getAttributesAsArray(node) {
    var attributes = node.attributes;
    var asArray = undefined;
    if (attributes) {
        var attrLen = attributes.length;
        asArray = new Array(attrLen);
        for (var i = 0; i < attrLen; i++) {
            asArray[i] = [attributes[i].nodeName, attributes[i].nodeValue];
        }
    }
    return asArray || [];
}
exports.getAttributesAsArray = getAttributesAsArray;
function getComponentName(component) {
    // Return the name of the component or the first line of its stringified version.
    return component.overriddenName || component.name || component.toString().split('\n')[0];
}
exports.getComponentName = getComponentName;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
var Deferred = (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    return Deferred;
}());
exports.Deferred = Deferred;
/**
 * @return Whether the passed-in component implements the subset of the
 *     `ControlValueAccessor` interface needed for AngularJS `ng-model`
 *     compatibility.
 */
function supportsNgModel(component) {
    return typeof component.writeValue === 'function' &&
        typeof component.registerOnChange === 'function';
}
/**
 * Glue the AngularJS `NgModelController` (if it exists) to the component
 * (if it implements the needed subset of the `ControlValueAccessor` interface).
 */
function hookupNgModel(ngModel, component) {
    if (ngModel && supportsNgModel(component)) {
        ngModel.$render = function () { component.writeValue(ngModel.$viewValue); };
        component.registerOnChange(ngModel.$setViewValue.bind(ngModel));
        if (typeof component.registerOnTouched === 'function') {
            component.registerOnTouched(ngModel.$setTouched.bind(ngModel));
        }
    }
}
exports.hookupNgModel = hookupNgModel;
/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 */
function strictEquals(val1, val2) {
    return val1 === val2 || (val1 !== val1 && val2 !== val2);
}
exports.strictEquals = strictEquals;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS0gsSUFBTSx1QkFBdUIsR0FBRyxvQkFBb0IsQ0FBQztBQUNyRCxJQUFNLDhCQUE4QixHQUFHLGFBQWEsQ0FBQztBQUVyRCxpQkFBd0IsQ0FBTTtJQUM1Qix5REFBeUQ7SUFDekQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQVRELDBCQVNDO0FBRUQsdUJBQThCLElBQVk7SUFDeEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQ25DLENBQUM7QUFGRCxzQ0FFQztBQUVELDRCQUFtQyxJQUFZO0lBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQztTQUMzQyxPQUFPLENBQUMsOEJBQThCLEVBQUUsVUFBQyxDQUFDLEVBQUUsTUFBTSxJQUFLLE9BQUEsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUhELGdEQUdDO0FBRUQsOEJBQXFDLElBQVU7SUFDN0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNuQyxJQUFJLE9BQU8sR0FBdUIsU0FBVyxDQUFDO0lBQzlDLEVB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