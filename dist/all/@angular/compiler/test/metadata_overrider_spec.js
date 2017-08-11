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
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var metadata_overrider_1 = require("../testing/src/metadata_overrider");
var SomeMetadata = (function () {
    function SomeMetadata(options) {
        this.plainProp = options.plainProp;
        this._getterProp = options.getterProp;
        this.arrayProp = options.arrayProp;
    }
    Object.defineProperty(SomeMetadata.prototype, "getterProp", {
        get: function () { return this._getterProp; },
        enumerable: true,
        configurable: true
    });
    return SomeMetadata;
}());
var OtherMetadata = (function (_super) {
    __extends(OtherMetadata, _super);
    function OtherMetadata(options) {
        var _this = _super.call(this, {
            plainProp: options.plainProp,
            getterProp: options.getterProp,
            arrayProp: options.arrayProp
        }) || this;
        _this.otherPlainProp = options.otherPlainProp;
        return _this;
    }
    return OtherMetadata;
}(SomeMetadata));
function main() {
    describe('metadata overrider', function () {
        var overrider;
        beforeEach(function () { overrider = new metadata_overrider_1.MetadataOverrider(); });
        it('should return a new instance with the same values', function () {
            var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someInput' });
            var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, {});
            matchers_1.expect(newInstance).not.toBe(oldInstance);
            matchers_1.expect(newInstance).toBeAnInstanceOf(SomeMetadata);
            matchers_1.expect(newInstance).toEqual(oldInstance);
        });
        it('should set individual properties and keep others', function () {
            var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
            var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { set: { plainProp: 'newPlainProp' } });
            matchers_1.expect(newInstance)
                .toEqual(new SomeMetadata({ plainProp: 'newPlainProp', getterProp: 'someGetterProp' }));
        });
        describe('add properties', function () {
            it('should replace non array values', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { add: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: 'newPlainProp', getterProp: 'someGetterProp' }));
            });
            it('should add to array values', function () {
                var oldInstance = new SomeMetadata({ arrayProp: ['a'] });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { add: { arrayProp: ['b'] } });
                matchers_1.expect(newInstance).toEqual(new SomeMetadata({ arrayProp: ['a', 'b'] }));
            });
        });
        describe('remove', function () {
            it('should set values to undefined if their value matches', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { plainProp: 'somePlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: undefined, getterProp: 'someGetterProp' }));
            });
            it('should leave values if their value does not match', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' }));
            });
            it('should remove a value from an array', function () {
                var oldInstance = new SomeMetadata({ arrayProp: ['a', 'b', 'c'], getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { arrayProp: ['a', 'c'] } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ arrayProp: ['b'], getterProp: 'someGetterProp' }));
            });
            it('should support types as values', function () {
                var Class1 = (function () {
                    function Class1() {
                    }
                    return Class1;
                }());
                var Class2 = (function () {
                    function Class2() {
                    }
                    return Class2;
                }());
                var Class3 = (function () {
                    function Class3() {
                    }
                    return Class3;
                }());
                var instance1 = new SomeMetadata({ arrayProp: [Class1, Class2, Class3] });
                var instance2 = overrider.overrideMetadata(SomeMetadata, instance1, { remove: { arrayProp: [Class1] } });
                matchers_1.expect(instance2).toEqual(new SomeMetadata({ arrayProp: [Class2, Class3] }));
                var instance3 = overrider.overrideMetadata(SomeMetadata, instance2, { remove: { arrayProp: [Class3] } });
                matchers_1.expect(instance3).toEqual(new SomeMetadata({ arrayProp: [Class2] }));
            });
        });
        describe('subclasses', function () {
            it('should set individual properties and keep others', function () {
                var oldInstance = new OtherMetadata({
                    plainProp: 'somePlainProp',
                    getterProp: 'someGetterProp',
                    otherPlainProp: 'newOtherProp'
                });
                var newInstance = overrider.overrideMetadata(OtherMetadata, oldInstance, { set: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance).toEqual(new OtherMetadata({
                    plainProp: 'newPlainProp',
                    getterProp: 'someGetterProp',
                    otherPlainProp: 'newOtherProp'
                }));
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfb3ZlcnJpZGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L21ldGFkYXRhX292ZXJyaWRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDJFQUFzRTtBQUN0RSx3RUFBb0U7QUFZcEU7SUFNRSxzQkFBWSxPQUF5QjtRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBWSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVcsQ0FBQztJQUN2QyxDQUFDO0lBUEQsc0JBQUksb0NBQVU7YUFBZCxjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBUXZELG1CQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFFRDtJQUE0QixpQ0FBWTtJQUd0Qyx1QkFBWSxPQUEwQjtRQUF0QyxZQUNFLGtCQUFNO1lBQ0osU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQzVCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtZQUM5QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7U0FDN0IsQ0FBQyxTQUdIO1FBREMsS0FBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBZ0IsQ0FBQzs7SUFDakQsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVpELENBQTRCLFlBQVksR0FZdkM7QUFFRDtJQUNFLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM3QixJQUFJLFNBQTRCLENBQUM7UUFFakMsVUFBVSxDQUFDLGNBQVEsU0FBUyxHQUFHLElBQUksc0NBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FB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