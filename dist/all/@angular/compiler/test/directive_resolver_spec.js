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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var directive_resolver_1 = require("@angular/compiler/src/directive_resolver");
var metadata_1 = require("@angular/core/src/metadata");
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
SomeDirective = __decorate([
    metadata_1.Directive({ selector: 'someDirective' })
], SomeDirective);
var SomeDirectiveWithInputs = (function () {
    function SomeDirectiveWithInputs() {
    }
    return SomeDirectiveWithInputs;
}());
__decorate([
    metadata_1.Input(),
    __metadata("design:type", Object)
], SomeDirectiveWithInputs.prototype, "a", void 0);
__decorate([
    metadata_1.Input('renamed'),
    __metadata("design:type", Object)
], SomeDirectiveWithInputs.prototype, "b", void 0);
SomeDirectiveWithInputs = __decorate([
    metadata_1.Directive({ selector: 'someDirective', inputs: ['c'] })
], SomeDirectiveWithInputs);
var SomeDirectiveWithOutputs = (function () {
    function SomeDirectiveWithOutputs() {
    }
    return SomeDirectiveWithOutputs;
}());
__decorate([
    metadata_1.Output(),
    __metadata("design:type", Object)
], SomeDirectiveWithOutputs.prototype, "a", void 0);
__decorate([
    metadata_1.Output('renamed'),
    __metadata("design:type", Object)
], SomeDirectiveWithOutputs.prototype, "b", void 0);
SomeDirectiveWithOutputs = __decorate([
    metadata_1.Directive({ selector: 'someDirective', outputs: ['c'] })
], SomeDirectiveWithOutputs);
var SomeDirectiveWithSetterProps = (function () {
    function SomeDirectiveWithSetterProps() {
    }
    Object.defineProperty(SomeDirectiveWithSetterProps.prototype, "a", {
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    return SomeDirectiveWithSetterProps;
}());
__decorate([
    metadata_1.Input('renamed'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SomeDirectiveWithSetterProps.prototype, "a", null);
SomeDirectiveWithSetterProps = __decorate([
    metadata_1.Directive({ selector: 'someDirective' })
], SomeDirectiveWithSetterProps);
var SomeDirectiveWithGetterOutputs = (function () {
    function SomeDirectiveWithGetterOutputs() {
    }
    Object.defineProperty(SomeDirectiveWithGetterOutputs.prototype, "a", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    return SomeDirectiveWithGetterOutputs;
}());
__decorate([
    metadata_1.Output('renamed'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SomeDirectiveWithGetterOutputs.prototype, "a", null);
SomeDirectiveWithGetterOutputs = __decorate([
    metadata_1.Directive({ selector: 'someDirective' })
], SomeDirectiveWithGetterOutputs);
var SomeDirectiveWithHostBindings = (function () {
    function SomeDirectiveWithHostBindings() {
    }
    return SomeDirectiveWithHostBindings;
}());
__decorate([
    metadata_1.HostBinding(),
    __metadata("design:type", Object)
], SomeDirectiveWithHostBindings.prototype, "a", void 0);
__decorate([
    metadata_1.HostBinding('renamed'),
    __metadata("design:type", Object)
], SomeDirectiveWithHostBindings.prototype, "b", void 0);
SomeDirectiveWithHostBindings = __decorate([
    metadata_1.Directive({ selector: 'someDirective', host: { '[c]': 'c' } })
], SomeDirectiveWithHostBindings);
var SomeDirectiveWithHostListeners = (function () {
    function SomeDirectiveWithHostListeners() {
    }
    SomeDirectiveWithHostListeners.prototype.onA = function () { };
    SomeDirectiveWithHostListeners.prototype.onB = function (value) { };
    return SomeDirectiveWithHostListeners;
}());
__decorate([
    metadata_1.HostListener('a'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SomeDirectiveWithHostListeners.prototype, "onA", null);
__decorate([
    metadata_1.HostListener('b', ['$event.value']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SomeDirectiveWithHostListeners.prototype, "onB", null);
SomeDirectiveWithHostListeners = __decorate([
    metadata_1.Directive({ selector: 'someDirective', host: { '(c)': 'onC()' } })
], SomeDirectiveWithHostListeners);
var SomeDirectiveWithContentChildren = (function () {
    function SomeDirectiveWithContentChildren() {
    }
    return SomeDirectiveWithContentChildren;
}());
__decorate([
    metadata_1.ContentChildren('a'),
    __metadata("design:type", Object)
], SomeDirectiveWithContentChildren.prototype, "as", void 0);
SomeDirectiveWithContentChildren = __decorate([
    metadata_1.Directive({ selector: 'someDirective', queries: { 'cs': new metadata_1.ContentChildren('c') } })
], SomeDirectiveWithContentChildren);
var SomeDirectiveWithViewChildren = (function () {
    function SomeDirectiveWithViewChildren() {
    }
    return SomeDirectiveWithViewChildren;
}());
__decorate([
    metadata_1.ViewChildren('a'),
    __metadata("design:type", Object)
], SomeDirectiveWithViewChildren.prototype, "as", void 0);
SomeDirectiveWithViewChildren = __decorate([
    metadata_1.Directive({ selector: 'someDirective', queries: { 'cs': new metadata_1.ViewChildren('c') } })
], SomeDirectiveWithViewChildren);
var SomeDirectiveWithContentChild = (function () {
    function SomeDirectiveWithContentChild() {
    }
    return SomeDirectiveWithContentChild;
}());
__decorate([
    metadata_1.ContentChild('a'),
    __metadata("design:type", Object)
], SomeDirectiveWithContentChild.prototype, "a", void 0);
SomeDirectiveWithContentChild = __decorate([
    metadata_1.Directive({ selector: 'someDirective', queries: { 'c': new metadata_1.ContentChild('c') } })
], SomeDirectiveWithContentChild);
var SomeDirectiveWithViewChild = (function () {
    function SomeDirectiveWithViewChild() {
    }
    return SomeDirectiveWithViewChild;
}());
__decorate([
    metadata_1.ViewChild('a'),
    __metadata("design:type", Object)
], SomeDirectiveWithViewChild.prototype, "a", void 0);
SomeDirectiveWithViewChild = __decorate([
    metadata_1.Directive({ selector: 'someDirective', queries: { 'c': new metadata_1.ViewChild('c') } })
], SomeDirectiveWithViewChild);
var ComponentWithTemplate = (function () {
    function ComponentWithTemplate() {
    }
    return ComponentWithTemplate;
}());
ComponentWithTemplate = __decorate([
    metadata_1.Component({ selector: 'sample', template: 'some template', styles: ['some styles'] })
], ComponentWithTemplate);
var SomeDirectiveWithSameHostBindingAndInput = (function () {
    function SomeDirectiveWithSameHostBindingAndInput() {
    }
    return SomeDirectiveWithSameHostBindingAndInput;
}());
__decorate([
    metadata_1.Input(), metadata_1.HostBinding(),
    __metadata("design:type", Object)
], SomeDirectiveWithSameHostBindingAndInput.prototype, "prop", void 0);
SomeDirectiveWithSameHostBindingAndInput = __decorate([
    metadata_1.Directive({
        selector: 'someDirective',
        host: { '[decorator]': 'decorator' },
        inputs: ['decorator'],
    })
], SomeDirectiveWithSameHostBindingAndInput);
var SomeDirectiveWithMalformedHostBinding1 = (function () {
    function SomeDirectiveWithMalformedHostBinding1() {
    }
    SomeDirectiveWithMalformedHostBinding1.prototype.onA = function () { };
    return SomeDirectiveWithMalformedHostBinding1;
}());
__decorate([
    metadata_1.HostBinding('(a)'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SomeDirectiveWithMalformedHostBinding1.prototype, "onA", null);
SomeDirectiveWithMalformedHostBinding1 = __decorate([
    metadata_1.Directive({ selector: 'someDirective' })
], SomeDirectiveWithMalformedHostBinding1);
var SomeDirectiveWithMalformedHostBinding2 = (function () {
    function SomeDirectiveWithMalformedHostBinding2() {
    }
    SomeDirectiveWithMalformedHostBinding2.prototype.onA = function () { };
    return SomeDirectiveWithMalformedHostBinding2;
}());
__decorate([
    metadata_1.HostBinding('[a]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SomeDirectiveWithMalformedHostBinding2.prototype, "onA", null);
SomeDirectiveWithMalformedHostBinding2 = __decorate([
    metadata_1.Directive({ selector: 'someDirective' })
], SomeDirectiveWithMalformedHostBinding2);
var SomeDirectiveWithoutMetadata = (function () {
    function SomeDirectiveWithoutMetadata() {
    }
    return SomeDirectiveWithoutMetadata;
}());
function main() {
    describe('DirectiveResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new directive_resolver_1.DirectiveResolver(new compiler_1.JitReflector()); });
        it('should read out the Directive metadata', function () {
            var directiveMetadata = resolver.resolve(SomeDirective);
            expect(directiveMetadata).toEqual(new metadata_1.Directive({
                selector: 'someDirective',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                exportAs: undefined,
                providers: undefined
            }));
        });
        it('should throw if not matching metadata is found', function () {
            expect(function () {
                resolver.resolve(SomeDirectiveWithoutMetadata);
            }).toThrowError('No Directive annotation found on SomeDirectiveWithoutMetadata');
        });
        it('should support inheriting the Directive metadata', function () {
            var Parent = (function () {
                function Parent() {
                }
                return Parent;
            }());
            Parent = __decorate([
                metadata_1.Directive({ selector: 'p' })
            ], Parent);
            var ChildNoDecorator = (function (_super) {
                __extends(ChildNoDecorator, _super);
                function ChildNoDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildNoDecorator;
            }(Parent));
            var ChildWithDecorator = (function (_super) {
                __extends(ChildWithDecorator, _super);
                function ChildWithDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildWithDecorator;
            }(Parent));
            ChildWithDecorator = __decorate([
                metadata_1.Directive({ selector: 'c' })
            ], ChildWithDecorator);
            expect(resolver.resolve(ChildNoDecorator)).toEqual(new metadata_1.Directive({
                selector: 'p',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                exportAs: undefined,
                providers: undefined
            }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(new metadata_1.Directive({
                selector: 'c',
                inputs: [],
                outputs: [],
                host: {},
                queries: {},
                exportAs: undefined,
                providers: undefined
            }));
        });
        describe('inputs', function () {
            it('should append directive inputs', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithInputs);
                expect(directiveMetadata.inputs).toEqual(['c', 'a', 'b: renamed']);
            });
            it('should work with getters and setters', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithSetterProps);
                expect(directiveMetadata.inputs).toEqual(['a: renamed']);
            });
            it('should remove duplicate inputs', function () {
                var SomeDirectiveWithDuplicateInputs = (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    return SomeDirectiveWithDuplicateInputs;
                }());
                SomeDirectiveWithDuplicateInputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', inputs: ['a', 'a'] })
                ], SomeDirectiveWithDuplicateInputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['a']);
            });
            it('should use the last input if duplicate inputs (with rename)', function () {
                var SomeDirectiveWithDuplicateInputs = (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    return SomeDirectiveWithDuplicateInputs;
                }());
                SomeDirectiveWithDuplicateInputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', inputs: ['a', 'localA: a'] })
                ], SomeDirectiveWithDuplicateInputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['localA: a']);
            });
            it('should prefer @Input over @Directive.inputs', function () {
                var SomeDirectiveWithDuplicateInputs = (function () {
                    function SomeDirectiveWithDuplicateInputs() {
                    }
                    return SomeDirectiveWithDuplicateInputs;
                }());
                __decorate([
                    metadata_1.Input('a'),
                    __metadata("design:type", Object)
                ], SomeDirectiveWithDuplicateInputs.prototype, "propA", void 0);
                SomeDirectiveWithDuplicateInputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', inputs: ['a'] })
                ], SomeDirectiveWithDuplicateInputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateInputs);
                expect(directiveMetadata.inputs).toEqual(['propA: a']);
            });
            it('should support inheriting inputs', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                __decorate([
                    metadata_1.Input(),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p1", void 0);
                __decorate([
                    metadata_1.Input('p21'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p2", void 0);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.Input('p22'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p2", void 0);
                __decorate([
                    metadata_1.Input(),
                    __metadata("design:type", Object)
                ], Child.prototype, "p3", void 0);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.inputs).toEqual(['p1', 'p2: p22', 'p3']);
            });
        });
        describe('outputs', function () {
            it('should append directive outputs', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithOutputs);
                expect(directiveMetadata.outputs).toEqual(['c', 'a', 'b: renamed']);
            });
            it('should work with getters and setters', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithGetterOutputs);
                expect(directiveMetadata.outputs).toEqual(['a: renamed']);
            });
            it('should remove duplicate outputs', function () {
                var SomeDirectiveWithDuplicateOutputs = (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                SomeDirectiveWithDuplicateOutputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', outputs: ['a', 'a'] })
                ], SomeDirectiveWithDuplicateOutputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['a']);
            });
            it('should use the last output if duplicate outputs (with rename)', function () {
                var SomeDirectiveWithDuplicateOutputs = (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                SomeDirectiveWithDuplicateOutputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', outputs: ['a', 'localA: a'] })
                ], SomeDirectiveWithDuplicateOutputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['localA: a']);
            });
            it('should prefer @Output over @Directive.outputs', function () {
                var SomeDirectiveWithDuplicateOutputs = (function () {
                    function SomeDirectiveWithDuplicateOutputs() {
                    }
                    return SomeDirectiveWithDuplicateOutputs;
                }());
                __decorate([
                    metadata_1.Output('a'),
                    __metadata("design:type", Object)
                ], SomeDirectiveWithDuplicateOutputs.prototype, "propA", void 0);
                SomeDirectiveWithDuplicateOutputs = __decorate([
                    metadata_1.Directive({ selector: 'someDirective', outputs: ['a'] })
                ], SomeDirectiveWithDuplicateOutputs);
                var directiveMetadata = resolver.resolve(SomeDirectiveWithDuplicateOutputs);
                expect(directiveMetadata.outputs).toEqual(['propA: a']);
            });
            it('should support inheriting outputs', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                __decorate([
                    metadata_1.Output(),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p1", void 0);
                __decorate([
                    metadata_1.Output('p21'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p2", void 0);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.Output('p22'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p2", void 0);
                __decorate([
                    metadata_1.Output(),
                    __metadata("design:type", Object)
                ], Child.prototype, "p3", void 0);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.outputs).toEqual(['p1', 'p2: p22', 'p3']);
            });
        });
        describe('host', function () {
            it('should append host bindings', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithHostBindings);
                expect(directiveMetadata.host).toEqual({ '[c]': 'c', '[a]': 'a', '[renamed]': 'b' });
            });
            it('should append host binding and input on the same property', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithSameHostBindingAndInput);
                expect(directiveMetadata.host).toEqual({ '[decorator]': 'decorator', '[prop]': 'prop' });
                expect(directiveMetadata.inputs).toEqual(['decorator', 'prop']);
            });
            it('should append host listeners', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithHostListeners);
                expect(directiveMetadata.host)
                    .toEqual({ '(c)': 'onC()', '(a)': 'onA()', '(b)': 'onB($event.value)' });
            });
            it('should throw when @HostBinding name starts with "("', function () {
                expect(function () { return resolver.resolve(SomeDirectiveWithMalformedHostBinding1); })
                    .toThrowError('@HostBinding can not bind to events. Use @HostListener instead.');
            });
            it('should throw when @HostBinding name starts with "["', function () {
                expect(function () { return resolver.resolve(SomeDirectiveWithMalformedHostBinding2); })
                    .toThrowError("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
            });
            it('should support inheriting host bindings', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                __decorate([
                    metadata_1.HostBinding(),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p1", void 0);
                __decorate([
                    metadata_1.HostBinding('p21'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p2", void 0);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.HostBinding('p22'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p2", void 0);
                __decorate([
                    metadata_1.HostBinding(),
                    __metadata("design:type", Object)
                ], Child.prototype, "p3", void 0);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host)
                    .toEqual({ '[p1]': 'p1', '[p21]': 'p2', '[p22]': 'p2', '[p3]': 'p3' });
            });
            it('should support inheriting host listeners', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    Parent.prototype.p1 = function () { };
                    Parent.prototype.p2 = function () { };
                    return Parent;
                }());
                __decorate([
                    metadata_1.HostListener('p1'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Parent.prototype, "p1", null);
                __decorate([
                    metadata_1.HostListener('p21'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Parent.prototype, "p2", null);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.p2 = function () { };
                    Child.prototype.p3 = function () { };
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.HostListener('p22'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Child.prototype, "p2", null);
                __decorate([
                    metadata_1.HostListener('p3'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Child.prototype, "p3", null);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host)
                    .toEqual({ '(p1)': 'p1()', '(p21)': 'p2()', '(p22)': 'p2()', '(p3)': 'p3()' });
            });
            it('should combine host bindings and listeners during inheritance', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    Parent.prototype.p1 = function () { };
                    return Parent;
                }());
                __decorate([
                    metadata_1.HostListener('p11'), metadata_1.HostListener('p12'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Parent.prototype, "p1", null);
                __decorate([
                    metadata_1.HostBinding('p21'), metadata_1.HostBinding('p22'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p2", void 0);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Child.prototype.p1 = function () { };
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.HostListener('c1'),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Child.prototype, "p1", null);
                __decorate([
                    metadata_1.HostBinding('c2'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p2", void 0);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.host).toEqual({
                    '(p11)': 'p1()',
                    '(p12)': 'p1()',
                    '(c1)': 'p1()',
                    '[p21]': 'p2',
                    '[p22]': 'p2',
                    '[c2]': 'p2'
                });
            });
        });
        describe('queries', function () {
            it('should append ContentChildren', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithContentChildren);
                expect(directiveMetadata.queries)
                    .toEqual({ 'cs': new metadata_1.ContentChildren('c'), 'as': new metadata_1.ContentChildren('a') });
            });
            it('should append ViewChildren', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithViewChildren);
                expect(directiveMetadata.queries)
                    .toEqual({ 'cs': new metadata_1.ViewChildren('c'), 'as': new metadata_1.ViewChildren('a') });
            });
            it('should append ContentChild', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithContentChild);
                expect(directiveMetadata.queries)
                    .toEqual({ 'c': new metadata_1.ContentChild('c'), 'a': new metadata_1.ContentChild('a') });
            });
            it('should append ViewChild', function () {
                var directiveMetadata = resolver.resolve(SomeDirectiveWithViewChild);
                expect(directiveMetadata.queries)
                    .toEqual({ 'c': new metadata_1.ViewChild('c'), 'a': new metadata_1.ViewChild('a') });
            });
            it('should support inheriting queries', function () {
                var Parent = (function () {
                    function Parent() {
                    }
                    return Parent;
                }());
                __decorate([
                    metadata_1.ContentChild('p1'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p1", void 0);
                __decorate([
                    metadata_1.ContentChild('p21'),
                    __metadata("design:type", Object)
                ], Parent.prototype, "p2", void 0);
                Parent = __decorate([
                    metadata_1.Directive({ selector: 'p' })
                ], Parent);
                var Child = (function (_super) {
                    __extends(Child, _super);
                    function Child() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return Child;
                }(Parent));
                __decorate([
                    metadata_1.ContentChild('p22'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p2", void 0);
                __decorate([
                    metadata_1.ContentChild('p3'),
                    __metadata("design:type", Object)
                ], Child.prototype, "p3", void 0);
                var directiveMetadata = resolver.resolve(Child);
                expect(directiveMetadata.queries).toEqual({
                    'p1': new metadata_1.ContentChild('p1'),
                    'p2': new metadata_1.ContentChild('p22'),
                    'p3': new metadata_1.ContentChild('p3')
                });
            });
        });
        describe('Component', function () {
            it('should read out the template related metadata from the Component metadata', function () {
                var compMetadata = resolver.resolve(ComponentWithTemplate);
                expect(compMetadata.template).toEqual('some template');
                expect(compMetadata.styles).toEqual(['some styles']);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2RpcmVjdGl2ZV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUErQztBQUMvQywrRUFBMkU7QUFDM0UsdURBQWtLO0FBR2xLLElBQU0sYUFBYTtJQUFuQjtJQUNBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssYUFBYTtJQURsQixvQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxDQUFDO0dBQ2pDLGFBQWEsQ0FDbEI7QUFHRCxJQUFNLHVCQUF1QjtJQUE3QjtJQUlBLENBQUM7SUFBRCw4QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSFU7SUFBUixnQkFBSyxFQUFFOztrREFBUTtBQUNFO0lBQWpCLGdCQUFLLENBQUMsU0FBUyxDQUFDOztrREFBUTtBQUZyQix1QkFBdUI7SUFENUIsb0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztHQUNoRCx1QkFBdUIsQ0FJNUI7QUFHRCxJQUFNLHdCQUF3QjtJQUE5QjtJQUlBLENBQUM7SUFBRCwrQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSFc7SUFBVCxpQkFBTSxFQUFFOzttREFBUTtBQUNFO0lBQWxCLGlCQUFNLENBQUMsU0FBUyxDQUFDOzttREFBUTtBQUZ0Qix3QkFBd0I7SUFEN0Isb0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztHQUNqRCx3QkFBd0IsQ0FJN0I7QUFHRCxJQUFNLDRCQUE0QjtJQUFsQztJQUdBLENBQUM7SUFEQyxzQkFB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