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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("@angular/core/src/reflection/reflection");
var reflection_capabilities_1 = require("@angular/core/src/reflection/reflection_capabilities");
var decorators_1 = require("@angular/core/src/util/decorators");
/** @Annotation */ var ClassDecorator = decorators_1.makeDecorator('ClassDecorator', function (data) { return data; });
/** @Annotation */ var ParamDecorator = decorators_1.makeParamDecorator('ParamDecorator', function (value) { return ({ value: value }); });
/** @Annotation */ var PropDecorator = decorators_1.makePropDecorator('PropDecorator', function (value) { return ({ value: value }); });
var AType = (function () {
    function AType(value) {
        this.value = value;
    }
    return AType;
}());
var ClassWithDecorators = (function () {
    function ClassWithDecorators(a, b) {
        this.a = a;
        this.b = b;
    }
    Object.defineProperty(ClassWithDecorators.prototype, "c", {
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    ClassWithDecorators.prototype.someMethod = function () { };
    return ClassWithDecorators;
}());
__decorate([
    PropDecorator('p1'), PropDecorator('p2'),
    __metadata("design:type", AType)
], ClassWithDecorators.prototype, "a", void 0);
__decorate([
    PropDecorator('p3'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassWithDecorators.prototype, "c", null);
__decorate([
    PropDecorator('p4'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassWithDecorators.prototype, "someMethod", null);
ClassWithDecorators = __decorate([
    ClassDecorator({ value: 'class' }),
    __param(0, ParamDecorator('a')), __param(1, ParamDecorator('b')),
    __metadata("design:paramtypes", [AType, AType])
], ClassWithDecorators);
var ClassWithoutDecorators = (function () {
    function ClassWithoutDecorators(a, b) {
    }
    return ClassWithoutDecorators;
}());
var TestObj = (function () {
    function TestObj(a, b) {
        this.a = a;
        this.b = b;
    }
    TestObj.prototype.identity = function (arg) { return arg; };
    return TestObj;
}());
function main() {
    describe('Reflector', function () {
        var reflector;
        beforeEach(function () { reflector = new reflection_1.Reflector(new reflection_capabilities_1.ReflectionCapabilities()); });
        describe('factory', function () {
            it('should create a factory for the given type', function () {
                var obj = reflector.factory(TestObj)(1, 2);
                expect(obj.a).toEqual(1);
                expect(obj.b).toEqual(2);
            });
        });
        describe('parameters', function () {
            it('should return an array of parameters for a type', function () {
                var p = reflector.parameters(ClassWithDecorators);
                expect(p).toEqual([[AType, new ParamDecorator('a')], [AType, new ParamDecorator('b')]]);
            });
            it('should work for a class without annotations', function () {
                var p = reflector.parameters(ClassWithoutDecorators);
                expect(p.length).toEqual(2);
            });
            // See https://github.com/angular/tsickle/issues/261
            it('should read forwardRef down-leveled type', function () {
                var Dep = (function () {
                    function Dep() {
                    }
                    return Dep;
                }());
                var ForwardLegacy = (function () {
                    function ForwardLegacy(d) {
                    }
                    return ForwardLegacy;
                }());
                // Older tsickle had a bug: wrote a forward reference
                ForwardLegacy.ctorParameters = [{ type: Dep }];
                expect(reflector.parameters(ForwardLegacy)).toEqual([[Dep]]);
                var Forward = (function () {
                    function Forward(d) {
                    }
                    return Forward;
                }());
                // Newer tsickle generates a functionClosure
                Forward.ctorParameters = function () { return [{ type: ForwardDep }]; };
                var ForwardDep = (function () {
                    function ForwardDep() {
                    }
                    return ForwardDep;
                }());
                expect(reflector.parameters(Forward)).toEqual([[ForwardDep]]);
            });
        });
        describe('propMetadata', function () {
            it('should return a string map of prop metadata for the given class', function () {
                var p = reflector.propMetadata(ClassWithDecorators);
                expect(p['a']).toEqual([new PropDecorator('p1'), new PropDecorator('p2')]);
                expect(p['c']).toEqual([new PropDecorator('p3')]);
                expect(p['someMethod']).toEqual([new PropDecorator('p4')]);
            });
            it('should also return metadata if the class has no decorator', function () {
                var Test = (function () {
                    function Test() {
                    }
                    return Test;
                }());
                __decorate([
                    PropDecorator('test'),
                    __metadata("design:type", Object)
                ], Test.prototype, "prop", void 0);
                expect(reflector.propMetadata(Test)).toEqual({ 'prop': [new PropDecorator('test')] });
            });
        });
        describe('annotations', function () {
            it('should return an array of annotations for a type', function () {
                var p = reflector.annotations(ClassWithDecorators);
                expect(p).toEqual([new ClassDecorator({ value: 'class' })]);
            });
            it('should work for a class without annotations', function () {
                var p = reflector.annotations(ClassWithoutDecorators);
                expect(p).toEqual([]);
            });
        });
        describe('getter', function () {
            it('returns a function reading a property', function () {
                var getA = reflector.getter('a');
                expect(getA(new TestObj(1, 2))).toEqual(1);
            });
        });
        describe('setter', function () {
            it('returns a function setting a property', function () {
                var setA = reflector.setter('a');
                var obj = new TestObj(1, 2);
                setA(obj, 100);
                expect(obj.a).toEqual(100);
            });
        });
        describe('method', function () {
            it('returns a function invoking a method', function () {
                var func = reflector.method('identity');
                var obj = new TestObj(1, 2);
                expect(func(obj, ['value'])).toEqual('value');
            });
        });
        describe('ctor inheritance detection', function () {
            it('should use the right regex', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                var ChildNoCtor = (function (_super) {
                    __extends(ChildNoCtor, _super);
                    function ChildNoCtor() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoCtor;
                }(Parent));
                var ChildWithCtor = (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    return ChildWithCtor;
                }(Parent));
                var ChildNoCtorPrivateProps = (function (_super) {
                    __extends(ChildNoCtorPrivateProps, _super);
                    function ChildNoCtorPrivateProps() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.x = 10;
                        return _this;
                    }
                    return ChildNoCtorPrivateProps;
                }(Parent));
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildNoCtor.toString())).toBeTruthy();
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildNoCtorPrivateProps.toString())).toBeTruthy();
                expect(reflection_capabilities_1.DELEGATE_CTOR.exec(ChildWithCtor.toString())).toBeFalsy();
            });
        });
        describe('inheritance with decorators', function () {
            it('should inherit annotations', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent = __decorate([
                    ClassDecorator({ value: 'parent' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                Child = __decorate([
                    ClassDecorator({ value: 'child' })
                ], Child);
                var ChildNoDecorators = (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                var NoDecorators = (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(NoDecorators)).toEqual([]);
                expect(reflector.annotations({})).toEqual([]);
                expect(reflector.annotations(1)).toEqual([]);
                expect(reflector.annotations(null)).toEqual([]);
            });
            it('should inherit parameters', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                // Note: We need the class decorator as well,
                // as otherwise TS won't capture the ctor arguments!
                var Parent = (function () {
                    function Parent(a, b) {
                    }
                    return Parent;
                }());
                Parent = __decorate([
                    ClassDecorator({ value: 'parent' }),
                    __param(0, ParamDecorator('a')), __param(1, ParamDecorator('b')),
                    __metadata("design:paramtypes", [A, B])
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithDecorator = (function (_super) {
                    __extends(ChildWithDecorator, _super);
                    function ChildWithDecorator() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildWithDecorator;
                }(Parent));
                ChildWithDecorator = __decorate([
                    ClassDecorator({ value: 'child' })
                ], ChildWithDecorator);
                var ChildWithDecoratorAndProps = (function (_super) {
                    __extends(ChildWithDecoratorAndProps, _super);
                    function ChildWithDecoratorAndProps() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.x = 10;
                        return _this;
                    }
                    return ChildWithDecoratorAndProps;
                }(Parent));
                ChildWithDecoratorAndProps = __decorate([
                    ClassDecorator({ value: 'child' })
                ], ChildWithDecoratorAndProps);
                // Note: We need the class decorator as well,
                // as otherwise TS won't capture the ctor arguments!
                var ChildWithCtor = (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor(c) {
                        return _super.call(this, null, null) || this;
                    }
                    return ChildWithCtor;
                }(Parent));
                ChildWithCtor = __decorate([
                    ClassDecorator({ value: 'child' }),
                    __param(0, ParamDecorator('c')),
                    __metadata("design:paramtypes", [C])
                ], ChildWithCtor);
                var ChildWithCtorNoDecorator = (function (_super) {
                    __extends(ChildWithCtorNoDecorator, _super);
                    function ChildWithCtorNoDecorator(a, b, c) {
                        return _super.call(this, null, null) || this;
                    }
                    return ChildWithCtorNoDecorator;
                }(Parent));
                var NoDecorators = (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithDecorator)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithDecoratorAndProps)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
                // If we have no decorator, we don't get metadata about the ctor params.
                // But we should still get an array of the right length based on function.length.
                expect(reflector.parameters(ChildWithCtorNoDecorator)).toEqual([
                    undefined, undefined, undefined
                ]);
                expect(reflector.parameters(NoDecorators)).toEqual([]);
                expect(reflector.parameters({})).toEqual([]);
                expect(reflector.parameters(1)).toEqual([]);
                expect(reflector.parameters(null)).toEqual([]);
            });
            it('should inherit property metadata', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                __decorate([
                    PropDecorator('a'),
                    __metadata("design:type", A)
                ], Parent.prototype, "a", void 0);
                __decorate([
                    PropDecorator('b1'),
                    __metadata("design:type", B)
                ], Parent.prototype, "b", void 0);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                __decorate([
                    PropDecorator('b2'),
                    __metadata("design:type", B)
                ], Child.prototype, "b", void 0);
                __decorate([
                    PropDecorator('c'),
                    __metadata("design:type", C)
                ], Child.prototype, "c", void 0);
                var NoDecorators = (function () {
                    function NoDecorators() {
                    }
                    return NoDecorators;
                }());
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
                expect(reflector.propMetadata(NoDecorators)).toEqual({});
                expect(reflector.propMetadata({})).toEqual({});
                expect(reflector.propMetadata(1)).toEqual({});
                expect(reflector.propMetadata(null)).toEqual({});
            });
            it('should inherit lifecycle hooks', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    Parent.prototype.hook1 = function () { };
                    Parent.prototype.hook2 = function () { };
                    return Parent;
                }());
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.hook2 = function () { };
                    Child.prototype.hook3 = function () { };
                    return Child;
                }(Parent));
                function hooks(symbol, names) {
                    return names.map(function (name) { return reflector.hasLifecycleHook(symbol, name); });
                }
                // Check that metadata for Parent was not changed!
                expect(hooks(Parent, ['hook1', 'hook2', 'hook3'])).toEqual([true, true, false]);
                expect(hooks(Child, ['hook1', 'hook2', 'hook3'])).toEqual([true, true, true]);
            });
        });
        describe('inheritance with tsickle', function () {
            it('should inherit annotations', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.decorators = [{ type: ClassDecorator, args: [{ value: 'parent' }] }];
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                Child.decorators = [{ type: ClassDecorator, args: [{ value: 'child' }] }];
                var ChildNoDecorators = (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
            });
            it('should inherit parameters', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.ctorParameters = function () {
                    return [{ type: A, decorators: [{ type: ParamDecorator, args: ['a'] }] },
                        { type: B, decorators: [{ type: ParamDecorator, args: ['b'] }] },
                    ];
                };
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithCtor = (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    return ChildWithCtor;
                }(Parent));
                ChildWithCtor.ctorParameters = function () { return [{ type: C, decorators: [{ type: ParamDecorator, args: ['c'] }] },]; };
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
            });
            it('should inherit property metadata', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.propDecorators = {
                    'a': [{ type: PropDecorator, args: ['a'] }],
                    'b': [{ type: PropDecorator, args: ['b1'] }],
                };
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                Child.propDecorators = {
                    'b': [{ type: PropDecorator, args: ['b2'] }],
                    'c': [{ type: PropDecorator, args: ['c'] }],
                };
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
            });
        });
        describe('inheritance with es5 API', function () {
            it('should inherit annotations', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.annotations = [new ClassDecorator({ value: 'parent' })];
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                Child.annotations = [new ClassDecorator({ value: 'child' })];
                var ChildNoDecorators = (function (_super) {
                    __extends(ChildNoDecorators, _super);
                    function ChildNoDecorators() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ChildNoDecorators;
                }(Parent));
                // Check that metadata for Parent was not changed!
                expect(reflector.annotations(Parent)).toEqual([new ClassDecorator({ value: 'parent' })]);
                expect(reflector.annotations(Child)).toEqual([
                    new ClassDecorator({ value: 'parent' }), new ClassDecorator({ value: 'child' })
                ]);
                expect(reflector.annotations(ChildNoDecorators)).toEqual([new ClassDecorator({ value: 'parent' })]);
            });
            it('should inherit parameters', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.parameters = [
                    [A, new ParamDecorator('a')],
                    [B, new ParamDecorator('b')],
                ];
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                var ChildWithCtor = (function (_super) {
                    __extends(ChildWithCtor, _super);
                    function ChildWithCtor() {
                        return _super.call(this) || this;
                    }
                    return ChildWithCtor;
                }(Parent));
                ChildWithCtor.parameters = [
                    [C, new ParamDecorator('c')],
                ];
                // Check that metadata for Parent was not changed!
                expect(reflector.parameters(Parent)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(Child)).toEqual([
                    [A, new ParamDecorator('a')], [B, new ParamDecorator('b')]
                ]);
                expect(reflector.parameters(ChildWithCtor)).toEqual([[C, new ParamDecorator('c')]]);
            });
            it('should inherit property metadata', function () {
                var A = (function () {
                    function A() {
                    }
                    return A;
                }());
                var B = (function () {
                    function B() {
                    }
                    return B;
                }());
                var C = (function () {
                    function C() {
                    }
                    return C;
                }());
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                Parent.propMetadata = {
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                };
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                Child.propMetadata = {
                    'b': [new PropDecorator('b2')],
                    'c': [new PropDecorator('c')],
                };
                // Check that metadata for Parent was not changed!
                expect(reflector.propMetadata(Parent)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1')],
                });
                expect(reflector.propMetadata(Child)).toEqual({
                    'a': [new PropDecorator('a')],
                    'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                    'c': [new PropDecorator('c')]
                });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVmbGVjdGlvbi9yZWZsZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzRUFBa0U7QUFDbEUsZ0dBQTJHO0FBRTNHLGdFQUF1RztBQW1Cdkcsa0JBQWtCLENBQUMsSUFBTSxjQUFjLEdBQ1osMEJBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztBQUNoRixrQkFBa0IsQ0FBQyxJQUFNLGNBQWMsR0FDbkMsK0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0FBQ3BFLGtCQUFrQixDQUFDLElBQU0sYUFBYSxHQUNsQyw4QkFBaUIsQ0FBQyxlQUFlLEVBQUUsVUFBQyxLQUFVLElBQUssT0FBQSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0FBRWxFO0lBQ0UsZUFBbUIsS0FBVTtRQUFWLFVBQUssR0FBTCxLQUFLLENBQUs7SUFBRyxDQUFDO0lBQ25DLFlBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUdELElBQU0sbUJBQW1CO0lBV3ZCLDZCQUFpQyxDQUFRLEVBQXVCLENBQVE7UUFDdEUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNiLENBQUM7SUFSRCxzQkFBSSxrQ0FBQzthQUFMLFVBQU0sS0FBVSxJQUFHLENBQUM7OztPQUFBO0lBR3BCLHdDQUFVLEdBQVYsY0FBYyxDQUFDO0lBTWpCLDBCQUFDO0FBQUQs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