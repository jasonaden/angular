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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("../../src/reflection/reflection");
var decorators_1 = require("../../src/util/decorators");
var DecoratedParent = (function () {
    function DecoratedParent() {
    }
    return DecoratedParent;
}());
var DecoratedChild = (function (_super) {
    __extends(DecoratedChild, _super);
    function DecoratedChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DecoratedChild;
}(DecoratedParent));
function main() {
    var TerminalDecorator = decorators_1.makeDecorator('TerminalDecorator', function (data) { return (__assign({ terminal: true }, data)); });
    var TestDecorator = decorators_1.makeDecorator('TestDecorator', function (data) { return data; }, Object, function (fn) { return fn.Terminal = TerminalDecorator; });
    describe('Property decorators', function () {
        // https://github.com/angular/angular/issues/12224
        it('should work on the "watch" property', function () {
            var Prop = decorators_1.makePropDecorator('Prop', function (value) { return ({ value: value }); });
            var TestClass = (function () {
                function TestClass() {
                }
                return TestClass;
            }());
            __decorate([
                Prop('firefox!'),
                __metadata("design:type", Object)
            ], TestClass.prototype, "watch", void 0);
            var p = reflection_1.reflector.propMetadata(TestClass);
            expect(p['watch']).toEqual([new Prop('firefox!')]);
        });
        it('should work with any default plain values', function () {
            var Default = decorators_1.makePropDecorator('Default', function (data) { return ({ value: data != null ? data : 5 }); });
            expect(new Default(0)['value']).toEqual(0);
        });
        it('should work with any object values', function () {
            // make sure we don't walk up the prototype chain
            var Default = decorators_1.makePropDecorator('Default', function (data) { return (__assign({ value: 5 }, data)); });
            var value = Object.create({ value: 10 });
            expect(new Default(value)['value']).toEqual(5);
        });
    });
    describe('decorators', function () {
        it('should invoke as decorator', function () {
            function Type() { }
            TestDecorator({ marker: 'WORKS' })(Type);
            var annotations = Type[decorators_1.ANNOTATIONS];
            expect(annotations[0].marker).toEqual('WORKS');
        });
        it('should invoke as new', function () {
            var annotation = new TestDecorator({ marker: 'WORKS' });
            expect(annotation instanceof TestDecorator).toEqual(true);
            expect(annotation.marker).toEqual('WORKS');
        });
        it('should not apply decorators from the prototype chain', function () {
            TestDecorator({ marker: 'parent' })(DecoratedParent);
            TestDecorator({ marker: 'child' })(DecoratedChild);
            var annotations = DecoratedChild[decorators_1.ANNOTATIONS];
            expect(annotations.length).toBe(1);
            expect(annotations[0].marker).toEqual('child');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9yc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3V0aWwvZGVjb3JhdG9yc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOERBQTBEO0FBQzFELHdEQUF3RjtBQUV4RjtJQUFBO0lBQXVCLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFBeEIsSUFBd0I7QUFDeEI7SUFBNkIsa0NBQWU7SUFBNUM7O0lBQThDLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFBL0MsQ0FBNkIsZUFBZSxHQUFHO0FBRS9DO0lBQ0UsSUFBTSxpQkFBaUIsR0FDbkIsMEJBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLFlBQUUsUUFBUSxFQUFFLElBQUksSUFBSyxJQUFJLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBQ25GLElBQU0sYUFBYSxHQUFHLDBCQUFhLENBQy9CLGVBQWUsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLEVBQUUsTUFBTSxFQUFFLFVBQUMsRUFBTyxJQUFLLE9BQUEsRUFBRSxDQUFDLFFBQVEsR0FBRyxpQkFBaUIsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO0lBRWhHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixrREFBa0Q7UUFDbEQsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sSUFBSSxHQUFHLDhCQUFpQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVUsSUFBSyxPQUFBLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUM7WUFFbEU7Z0JBQUE7Z0JBR0EsQ0FBQztnQkFBRCxnQkFBQztZQUFELENBQUMsQUFIRCxJQUdDO1lBREM7Z0JBREMsSUFB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