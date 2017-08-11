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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy9jb21tb24vdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILElBQU0sdUJBQXVCLEdBQUcsb0JBQW9CLENBQUM7QUFDckQsSUFBTSw4QkFBOEIsR0FBRyxhQUFhLENBQUM7QUFFckQsaUJBQXdCLENBQU07SUFDNUIseURBQXlEO0lBQ3pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQztBQUNWLENBQUM7QUFURCwwQkFTQztBQUVELHVCQUE4QixJQUFZO0lBQ3hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQztBQUNuQyxDQUFDO0FBRkQsc0NBRUM7QUFFRCw0QkFBbUMsSUFBWTtJQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUM7U0FDM0MsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSyxPQUFBLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFIRCxnREFHQztBQUVELDhCQUFxQyxJQUFVO0lBQzdDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDbkMsSUFBSSxPQUFPLEdBQXVCLFNBQVcsQ0FB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