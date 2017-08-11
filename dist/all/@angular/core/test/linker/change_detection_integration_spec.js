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
var element_schema_registry_1 = require("@angular/compiler/src/schema/element_schema_registry");
var test_bindings_1 = require("@angular/compiler/testing/src/test_bindings");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var index_1 = require("../../../compiler/index");
function main() {
    var elSchema;
    var renderLog;
    var directiveLog;
    function createCompFixture(template, compType) {
        if (compType === void 0) { compType = TestComponent; }
        testing_1.TestBed.overrideComponent(compType, { set: new core_1.Component({ template: template }) });
        initHelpers();
        return testing_1.TestBed.createComponent(compType);
    }
    function initHelpers() {
        elSchema = testing_1.TestBed.get(element_schema_registry_1.ElementSchemaRegistry);
        renderLog = testing_1.TestBed.get(RenderLog);
        directiveLog = testing_1.TestBed.get(DirectiveLog);
        elSchema.existingProperties['someProp'] = true;
        patchLoggingRenderer2(testing_1.TestBed.get(core_1.RendererFactory2), renderLog);
    }
    function queryDirs(el, dirType) {
        var nodes = el.queryAllNodes(by_1.By.directive(dirType));
        return nodes.map(function (node) { return node.injector.get(dirType); });
    }
    function _bindSimpleProp(bindAttr, compType) {
        if (compType === void 0) { compType = TestComponent; }
        var template = "<div " + bindAttr + "></div>";
        return createCompFixture(template, compType);
    }
    function _bindSimpleValue(expression, compType) {
        if (compType === void 0) { compType = TestComponent; }
        return _bindSimpleProp("[someProp]='" + expression + "'", compType);
    }
    function _bindAndCheckSimpleValue(expression, compType) {
        if (compType === void 0) { compType = TestComponent; }
        var ctx = _bindSimpleValue(expression, compType);
        ctx.detectChanges(false);
        return renderLog.log;
    }
    describe("ChangeDetection", function () {
        // On CJS fakeAsync is not supported...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ providers: test_bindings_1.TEST_COMPILER_PROVIDERS });
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    TestData,
                    TestDirective,
                    TestComponent,
                    AnotherComponent,
                    TestLocals,
                    CompWithRef,
                    WrapCompWithRef,
                    EmitterDirective,
                    PushComp,
                    OnDestroyDirective,
                    OrderCheckDirective2,
                    OrderCheckDirective0,
                    OrderCheckDirective1,
                    Gh9882,
                    Uninitialized,
                    Person,
                    PersonHolder,
                    PersonHolderHolder,
                    CountingPipe,
                    CountingImpurePipe,
                    MultiArgPipe,
                    PipeWithOnDestroy,
                    IdentityPipe,
                    WrappedPipe,
                ],
                providers: [
                    RenderLog,
                    DirectiveLog,
                ],
            });
        });
        describe('expressions', function () {
            it('should support literals', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue(10)).toEqual(['someProp=10']); }));
            it('should strip quotes from literals', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('"str"')).toEqual(['someProp=str']); }));
            it('should support newlines in literals', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('"a\n\nb"')).toEqual(['someProp=a\n\nb']);
            }));
            it('should support + operations', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 + 2')).toEqual(['someProp=12']); }));
            it('should support - operations', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 - 2')).toEqual(['someProp=8']); }));
            it('should support * operations', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('10 * 2')).toEqual(['someProp=20']); }));
            it('should support / operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('10 / 2')).toEqual(["someProp=" + 5.0]);
            })); // dart exp=5.0, js exp=5
            it('should support % operations', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('11 % 2')).toEqual(['someProp=1']); }));
            it('should support == operations on identical', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 == 1')).toEqual(['someProp=true']);
            }));
            it('should support != operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 != 1')).toEqual(['someProp=false']);
            }));
            it('should support == operations on coerceible', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 == true')).toEqual(["someProp=true"]);
            }));
            it('should support === operations on identical', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 === 1')).toEqual(['someProp=true']);
            }));
            it('should support !== operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 !== 1')).toEqual(['someProp=false']);
            }));
            it('should support === operations on coerceible', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 === true')).toEqual(['someProp=false']);
            }));
            it('should support true < operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 < 2')).toEqual(['someProp=true']);
            }));
            it('should support false < operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 < 1')).toEqual(['someProp=false']);
            }));
            it('should support false > operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 > 2')).toEqual(['someProp=false']);
            }));
            it('should support true > operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 > 1')).toEqual(['someProp=true']);
            }));
            it('should support true <= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 <= 2')).toEqual(['someProp=true']);
            }));
            it('should support equal <= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 <= 2')).toEqual(['someProp=true']);
            }));
            it('should support false <= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 <= 1')).toEqual(['someProp=false']);
            }));
            it('should support true >= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 >= 1')).toEqual(['someProp=true']);
            }));
            it('should support equal >= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('2 >= 2')).toEqual(['someProp=true']);
            }));
            it('should support false >= operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 >= 2')).toEqual(['someProp=false']);
            }));
            it('should support true && operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true && true')).toEqual(['someProp=true']);
            }));
            it('should support false && operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true && false')).toEqual(['someProp=false']);
            }));
            it('should support true || operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('true || false')).toEqual(['someProp=true']);
            }));
            it('should support false || operations', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('false || false')).toEqual(['someProp=false']);
            }));
            it('should support negate', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('!true')).toEqual(['someProp=false']);
            }));
            it('should support double negate', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('!!true')).toEqual(['someProp=true']);
            }));
            it('should support true conditionals', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 < 2 ? 1 : 2')).toEqual(['someProp=1']);
            }));
            it('should support false conditionals', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('1 > 2 ? 1 : 2')).toEqual(['someProp=2']);
            }));
            it('should support keyed access to a list item', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('["foo", "bar"][0]')).toEqual(['someProp=foo']);
            }));
            it('should support keyed access to a map item', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('{"foo": "bar"}["foo"]')).toEqual(['someProp=bar']);
            }));
            it('should report all changes on the first run including uninitialized values', testing_1.fakeAsync(function () {
                matchers_1.expect(_bindAndCheckSimpleValue('value', Uninitialized)).toEqual(['someProp=null']);
            }));
            it('should report all changes on the first run including null values', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = null;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
            }));
            it('should support simple chained property access', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('address.city', Person);
                ctx.componentInstance.name = 'Victor';
                ctx.componentInstance.address = new Address('Grenoble');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Grenoble']);
            }));
            describe('safe navigation operator', function () {
                it('should support reading properties of nulls', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.city', Person);
                    ctx.componentInstance.address = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support calling methods on nulls', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.toString()', Person);
                    ctx.componentInstance.address = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support reading properties on non nulls', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.city', Person);
                    ctx.componentInstance.address = new Address('MTV');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
                }));
                it('should support calling methods on non nulls', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('address?.toString()', Person);
                    ctx.componentInstance.address = new Address('MTV');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
                }));
                it('should support short-circuting safe navigation', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.address.city', PersonHolder);
                    ctx.componentInstance.value = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support nested short-circuting safe navigation', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value.value?.address.city', PersonHolderHolder);
                    ctx.componentInstance.value = new PersonHolder();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support chained short-circuting safe navigation', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.value?.address.city', PersonHolderHolder);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should support short-circuting array index operations', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('value?.phones[0]', PersonHolder);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=null']);
                }));
                it('should still throw if right-side would throw', testing_1.fakeAsync(function () {
                    matchers_1.expect(function () {
                        var ctx = _bindSimpleValue('value?.address.city', PersonHolder);
                        var person = new Person();
                        person.address = null;
                        ctx.componentInstance.value = person;
                        ctx.detectChanges(false);
                    }).toThrow();
                }));
            });
            it('should support method calls', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('sayHi("Jim")', Person);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Hi, Jim']);
            }));
            it('should support function calls', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('a()(99)', TestData);
                ctx.componentInstance.a = function () { return function (a) { return a; }; };
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=99']);
            }));
            it('should support chained method calls', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('address.toString()', Person);
                ctx.componentInstance.address = new Address('MTV');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=MTV']);
            }));
            it('should support NaN', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('age', Person);
                ctx.componentInstance.age = NaN;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=NaN']);
                renderLog.clear();
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('should do simple watching', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('name', Person);
                ctx.componentInstance.name = 'misko';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=misko']);
                renderLog.clear();
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
                renderLog.clear();
                ctx.componentInstance.name = 'Misko';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=Misko']);
            }));
            it('should support literal array made of literals', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, 2]');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2]]);
            }));
            it('should support empty literal array', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('[]');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[]]);
            }));
            it('should support literal array made of expressions', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, a]', TestData);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2]]);
            }));
            it('should not recreate literal arrays unless their content changed', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('[1, a]', TestData);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                ctx.componentInstance.a = 3;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([[1, 2], [1, 3]]);
            }));
            it('should support literal maps made of literals', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: 1}');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
            }));
            it('should support empty literal map', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('{}');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues).toEqual([{}]);
            }));
            it('should support literal maps made of expressions', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: a}');
                ctx.componentInstance.a = 1;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
            }));
            it('should not recreate literal maps unless their content changed', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('{z: a}');
                ctx.componentInstance.a = 1;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                ctx.componentInstance.a = 2;
                ctx.detectChanges(false);
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.loggedValues.length).toBe(2);
                matchers_1.expect(renderLog.loggedValues[0]['z']).toEqual(1);
                matchers_1.expect(renderLog.loggedValues[1]['z']).toEqual(2);
            }));
            it('should ignore empty bindings', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleProp('[someProp]', TestData);
                ctx.componentInstance.a = 'value';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('should support interpolation', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleProp('someProp="B{{a}}A"', TestData);
                ctx.componentInstance.a = 'value';
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=BvalueA']);
            }));
            it('should output empty strings for null values in interpolation', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleProp('someProp="B{{a}}A"', TestData);
                ctx.componentInstance.a = null;
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['someProp=BA']);
            }));
            it('should escape values in literals that indicate interpolation', testing_1.fakeAsync(function () { matchers_1.expect(_bindAndCheckSimpleValue('"$"')).toEqual(['someProp=$']); }));
            it('should read locals', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<ng-template testLocals let-local="someLocal">{{local}}</ng-template>');
                ctx.detectChanges(false);
                matchers_1.expect(renderLog.log).toEqual(['{{someLocalValue}}']);
            }));
            describe('pipes', function () {
                it('should use the return value of the pipe', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingPipe', Person);
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0']);
                }));
                it('should support arguments in pipes', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"one":address.city', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.componentInstance.address = new Address('two');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value one two default']);
                }));
                it('should associate pipes right-to-left', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"a":"b" | multiArgPipe:0:1', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value a b default 0 1 default']);
                }));
                it('should support calling pure pipes with different number of arguments', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | multiArgPipe:"a":"b" | multiArgPipe:0:1:2', Person);
                    ctx.componentInstance.name = 'value';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['value a b default 0 1 2']);
                }));
                it('should do nothing when no change', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('"Megatron" | identityPipe', Person);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                    renderLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual([]);
                }));
                it('should unwrap the wrapped value and force a change', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('"Megatron" | wrappedPipe', Person);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                    renderLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
                }));
                it('should record unwrapped values via ngOnChanges', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div [testDirective]="\'aName\' | wrappedPipe" [a]="1" [b]="2 | wrappedPipe"></div>');
                    var dir = queryDirs(ctx.debugElement, TestDirective)[0];
                    ctx.detectChanges(false);
                    dir.changes = {};
                    ctx.detectChanges(false);
                    // Note: the binding for `b` did not change and has no ValueWrapper,
                    // and should therefore stay unchanged.
                    matchers_1.expect(dir.changes).toEqual({
                        'name': new core_1.SimpleChange('aName', 'aName', false),
                        'b': new core_1.SimpleChange(2, 2, false)
                    });
                    ctx.detectChanges(false);
                    matchers_1.expect(dir.changes).toEqual({
                        'name': new core_1.SimpleChange('aName', 'aName', false),
                        'b': new core_1.SimpleChange(2, 2, false)
                    });
                }));
                it('should call pure pipes only if the arguments change', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingPipe', Person);
                    // change from undefined -> null
                    ctx.componentInstance.name = null;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0']);
                    // change from null -> some value
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0', 'bob state:1']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['null state:0', 'bob state:1']);
                    // change from some value -> some other value
                    ctx.componentInstance.name = 'bart';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'null state:0', 'bob state:1', 'bart state:2'
                    ]);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'null state:0', 'bob state:1', 'bart state:2'
                    ]);
                }));
                it('should call pure pipes that are used multiple times only when the arguments change', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture("<div [someProp]=\"name | countingPipe\"></div><div [someProp]=\"age | countingPipe\"></div>" +
                        '<div *ngFor="let x of [1,2]" [someProp]="address.city | countingPipe"></div>', Person);
                    ctx.componentInstance.name = 'a';
                    ctx.componentInstance.age = 10;
                    ctx.componentInstance.address = new Address('mtv');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3'
                    ]);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3'
                    ]);
                    ctx.componentInstance.age = 11;
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([
                        'mtv state:0', 'mtv state:1', 'a state:2', '10 state:3', '11 state:4'
                    ]);
                }));
                it('should call impure pipes on each change detection run', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleValue('name | countingImpurePipe', Person);
                    ctx.componentInstance.name = 'bob';
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0']);
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual(['bob state:0', 'bob state:1']);
                }));
            });
            describe('event expressions', function () {
                it('should support field assignments', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="b=a=$event"');
                    var childEl = ctx.debugElement.children[0];
                    var evt = 'EVENT';
                    childEl.triggerEventHandler('event', evt);
                    matchers_1.expect(ctx.componentInstance.a).toEqual(evt);
                    matchers_1.expect(ctx.componentInstance.b).toEqual(evt);
                }));
                it('should support keyed assignments', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a[0]=$event"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = ['OLD'];
                    var evt = 'EVENT';
                    childEl.triggerEventHandler('event', evt);
                    matchers_1.expect(ctx.componentInstance.a).toEqual([evt]);
                }));
                it('should support chains', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a=a+1; a=a+1;"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = 0;
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual(2);
                }));
                it('should support empty literals', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="a=[{},[]]"');
                    var childEl = ctx.debugElement.children[0];
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual([{}, []]);
                }));
                it('should throw when trying to assign to a local', testing_1.fakeAsync(function () {
                    matchers_1.expect(function () {
                        _bindSimpleProp('(event)="$event=1"');
                    }).toThrowError(new RegExp('Cannot assign to a reference or variable!'));
                }));
                it('should support short-circuiting', testing_1.fakeAsync(function () {
                    var ctx = _bindSimpleProp('(event)="true ? a = a + 1 : a = a + 1"');
                    var childEl = ctx.debugElement.children[0];
                    ctx.componentInstance.a = 0;
                    childEl.triggerEventHandler('event', 'EVENT');
                    matchers_1.expect(ctx.componentInstance.a).toEqual(1);
                }));
            });
        });
        describe('RendererFactory', function () {
            it('should call the begin and end methods on the renderer factory when change detection is called', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<div testDirective [a]="42"></div>');
                var rf = testing_1.TestBed.get(core_1.RendererFactory2);
                spyOn(rf, 'begin');
                spyOn(rf, 'end');
                matchers_1.expect(rf.begin).not.toHaveBeenCalled();
                matchers_1.expect(rf.end).not.toHaveBeenCalled();
                ctx.detectChanges(false);
                matchers_1.expect(rf.begin).toHaveBeenCalled();
                matchers_1.expect(rf.end).toHaveBeenCalled();
            }));
        });
        describe('change notification', function () {
            describe('updating directives', function () {
                it('should happen without invoking the renderer', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective [a]="42"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.log).toEqual([]);
                    matchers_1.expect(queryDirs(ctx.debugElement, TestDirective)[0].a).toEqual(42);
                }));
            });
            describe('reading directives', function () {
                it('should read directive properties', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective [a]="42" ref-dir="testDirective" [someProp]="dir.a"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(renderLog.loggedValues).toEqual([42]);
                }));
            });
            describe('ngOnChanges', function () {
                it('should notify the directive when a group of records changes', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div [testDirective]="\'aName\'" [a]="1" [b]="2"></div><div [testDirective]="\'bName\'" [a]="4"></div>');
                    ctx.detectChanges(false);
                    var dirs = queryDirs(ctx.debugElement, TestDirective);
                    matchers_1.expect(dirs[0].changes).toEqual({
                        'a': new core_1.SimpleChange(undefined, 1, true),
                        'b': new core_1.SimpleChange(undefined, 2, true),
                        'name': new core_1.SimpleChange(undefined, 'aName', true)
                    });
                    matchers_1.expect(dirs[1].changes).toEqual({
                        'a': new core_1.SimpleChange(undefined, 4, true),
                        'name': new core_1.SimpleChange(undefined, 'bName', true)
                    });
                }));
            });
        });
        describe('lifecycle', function () {
            function createCompWithContentAndViewChild() {
                testing_1.TestBed.overrideComponent(AnotherComponent, {
                    set: new core_1.Component({
                        selector: 'other-cmp',
                        template: '<div testDirective="viewChild"></div>',
                    })
                });
                return createCompFixture('<div testDirective="parent"><div *ngIf="true" testDirective="contentChild"></div><other-cmp></other-cmp></div>', TestComponent);
            }
            describe('ngOnInit', function () {
                it('should be called after ngOnChanges', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    matchers_1.expect(directiveLog.filter(['ngOnInit', 'ngOnChanges'])).toEqual([]);
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit', 'ngOnChanges'])).toEqual([
                        'dir.ngOnChanges', 'dir.ngOnInit'
                    ]);
                    directiveLog.clear();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
                it('should only be called only once', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual(['dir.ngOnInit']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
                it('should not call ngOnInit again if it throws', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngOnInit"></div>');
                    var errored = false;
                    // First pass fails, but ngOnInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        matchers_1.expect(e.message).toBe('Boom!');
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual(['dir.ngOnInit']);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngOnInit should not be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        matchers_1.expect(e.message).toBe('Boom!');
                        throw new Error('Second detectChanges() should not have called ngOnInit.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngOnInit'])).toEqual([]);
                }));
            });
            describe('ngDoCheck', function () {
                it('should be called after ngOnInit', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngOnInit'])).toEqual([
                        'dir.ngOnInit', 'dir.ngDoCheck'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual(['dir.ngDoCheck']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck'])).toEqual(['dir.ngDoCheck']);
                }));
            });
            describe('ngAfterContentInit', function () {
                it('should be called after processing the content children but before the view children', testing_1.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterContentInit'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterContentInit',
                        'parent.ngAfterContentInit', 'viewChild.ngDoCheck', 'viewChild.ngAfterContentInit'
                    ]);
                }));
                it('should only be called only once', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([
                        'dir.ngAfterContentInit'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                }));
                it('should not call ngAfterContentInit again if it throws', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngAfterContentInit"></div>');
                    var errored = false;
                    // First pass fails, but ngAfterContentInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([
                        'dir.ngAfterContentInit'
                    ]);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngAfterContentInit should not be
                    // called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        throw new Error('Second detectChanges() should not have run detection.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngAfterContentInit'])).toEqual([]);
                }));
            });
            describe('ngAfterContentChecked', function () {
                it('should be called after the content children but before the view children', testing_1.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterContentChecked'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterContentChecked',
                        'parent.ngAfterContentChecked', 'viewChild.ngDoCheck',
                        'viewChild.ngAfterContentChecked'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'dir.ngAfterContentChecked'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'dir.ngAfterContentChecked'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterContentChecked'])).toEqual([
                        'child.ngAfterContentChecked', 'parent.ngAfterContentChecked',
                        'sibling.ngAfterContentChecked'
                    ]);
                }));
            });
            describe('ngAfterViewInit', function () {
                it('should be called after processing the view children', testing_1.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterViewInit'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterViewInit',
                        'viewChild.ngDoCheck', 'viewChild.ngAfterViewInit', 'parent.ngAfterViewInit'
                    ]);
                }));
                it('should only be called only once', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual(['dir.ngAfterViewInit']);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                    // re-verify that changes should not call them
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                }));
                it('should not call ngAfterViewInit again if it throws', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir" throwOn="ngAfterViewInit"></div>');
                    var errored = false;
                    // First pass fails, but ngAfterViewInit should be called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        errored = true;
                    }
                    matchers_1.expect(errored).toBe(true);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual(['dir.ngAfterViewInit']);
                    directiveLog.clear();
                    // Second change detection also fails, but this time ngAfterViewInit should not be
                    // called.
                    try {
                        ctx.detectChanges(false);
                    }
                    catch (e) {
                        throw new Error('Second detectChanges() should not have run detection.');
                    }
                    matchers_1.expect(directiveLog.filter(['ngAfterViewInit'])).toEqual([]);
                }));
            });
            describe('ngAfterViewChecked', function () {
                it('should be called after processing the view children', testing_1.fakeAsync(function () {
                    var ctx = createCompWithContentAndViewChild();
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngDoCheck', 'ngAfterViewChecked'])).toEqual([
                        'parent.ngDoCheck', 'contentChild.ngDoCheck', 'contentChild.ngAfterViewChecked',
                        'viewChild.ngDoCheck', 'viewChild.ngAfterViewChecked', 'parent.ngAfterViewChecked'
                    ]);
                }));
                it('should be called on every detectChanges run, except for checkNoChanges', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'dir.ngAfterViewChecked'
                    ]);
                    // reset directives
                    directiveLog.clear();
                    // Verify that checking should not call them.
                    ctx.checkNoChanges();
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([]);
                    // re-verify that changes are still detected
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'dir.ngAfterViewChecked'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    matchers_1.expect(directiveLog.filter(['ngAfterViewChecked'])).toEqual([
                        'child.ngAfterViewChecked', 'parent.ngAfterViewChecked', 'sibling.ngAfterViewChecked'
                    ]);
                }));
            });
            describe('ngOnDestroy', function () {
                it('should be called on view destruction', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="dir"></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual(['dir.ngOnDestroy']);
                }));
                it('should be called after processing the content and view children', testing_1.fakeAsync(function () {
                    testing_1.TestBed.overrideComponent(AnotherComponent, {
                        set: new core_1.Component({ selector: 'other-cmp', template: '<div testDirective="viewChild"></div>' })
                    });
                    var ctx = createCompFixture('<div testDirective="parent"><div *ngFor="let x of [0,1]" testDirective="contentChild{{x}}"></div>' +
                        '<other-cmp></other-cmp></div>', TestComponent);
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'contentChild0.ngOnDestroy', 'contentChild1.ngOnDestroy', 'viewChild.ngOnDestroy',
                        'parent.ngOnDestroy'
                    ]);
                }));
                it('should be called in reverse order so the child is always notified before the parent', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div testDirective="parent"><div testDirective="child"></div></div><div testDirective="sibling"></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'child.ngOnDestroy', 'parent.ngOnDestroy', 'sibling.ngOnDestroy'
                    ]);
                }));
                it('should deliver synchronous events to parent', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('<div (destroy)="a=$event" onDestroyDirective></div>');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(ctx.componentInstance.a).toEqual('destroyed');
                }));
                it('should call ngOnDestroy on pipes', testing_1.fakeAsync(function () {
                    var ctx = createCompFixture('{{true | pipeWithOnDestroy }}');
                    ctx.detectChanges(false);
                    ctx.destroy();
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy'])).toEqual([
                        'pipeWithOnDestroy.ngOnDestroy'
                    ]);
                }));
                it('should call ngOnDestroy on an injectable class', testing_1.fakeAsync(function () {
                    testing_1.TestBed.overrideDirective(TestDirective, { set: { providers: [InjectableWithLifecycle] } });
                    var ctx = createCompFixture('<div testDirective="dir"></div>', TestComponent);
                    ctx.debugElement.children[0].injector.get(InjectableWithLifecycle);
                    ctx.detectChanges(false);
                    ctx.destroy();
                    // We don't care about the exact order in this test.
                    matchers_1.expect(directiveLog.filter(['ngOnDestroy']).sort()).toEqual([
                        'dir.ngOnDestroy', 'injectable.ngOnDestroy'
                    ]);
                }));
            });
        });
        describe('enforce no new changes', function () {
            it('should throw when a record gets changed after it has been checked', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<div [someProp]="a"></div>', TestData);
                ctx.componentInstance.a = 1;
                matchers_1.expect(function () { return ctx.checkNoChanges(); })
                    .toThrowError(/Expression has changed after it was checked./g);
            }));
            it('should warn when the view has been created in a cd hook', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<div *gh9882>{{ a }}</div>', TestData);
                ctx.componentInstance.a = 1;
                matchers_1.expect(function () { return ctx.detectChanges(); })
                    .toThrowError(/It seems like the view has been created after its parent and its children have been dirty checked/);
            }));
            it('should not throw when two arrays are structurally the same', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = ['value'];
                ctx.detectChanges(false);
                ctx.componentInstance.a = ['value'];
                matchers_1.expect(function () { return ctx.checkNoChanges(); }).not.toThrow();
            }));
            it('should not break the next run', testing_1.fakeAsync(function () {
                var ctx = _bindSimpleValue('a', TestData);
                ctx.componentInstance.a = 'value';
                matchers_1.expect(function () { return ctx.checkNoChanges(); }).toThrow();
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['value']);
            }));
        });
        describe('mode', function () {
            it('Detached', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<comp-with-ref></comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('Detached should disable OnPush', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<push-cmp [value]="value"></push-cmp>');
                ctx.componentInstance.value = 0;
                ctx.detectChanges();
                renderLog.clear();
                var cmp = queryDirs(ctx.debugElement, PushComp)[0];
                cmp.changeDetectorRef.detach();
                ctx.componentInstance.value = 1;
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
            }));
            it('Detached view can be checked locally', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<wrap-comp-with-ref></wrap-comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                matchers_1.expect(renderLog.log).toEqual([]);
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
                cmp.changeDetectorRef.detectChanges();
                matchers_1.expect(renderLog.log).toEqual(['{{hello}}']);
            }));
            it('Reattaches', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<comp-with-ref></comp-with-ref>');
                var cmp = queryDirs(ctx.debugElement, CompWithRef)[0];
                cmp.value = 'hello';
                cmp.changeDetectorRef.detach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual([]);
                cmp.changeDetectorRef.reattach();
                ctx.detectChanges();
                matchers_1.expect(renderLog.log).toEqual(['{{hello}}']);
            }));
            it('Reattaches in the original cd mode', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<push-cmp></push-cmp>');
                var cmp = queryDirs(ctx.debugElement, PushComp)[0];
                cmp.changeDetectorRef.detach();
                cmp.changeDetectorRef.reattach();
                // renderCount should NOT be incremented with each CD as CD mode should be resetted to
                // on-push
                ctx.detectChanges();
                matchers_1.expect(cmp.renderCount).toBeGreaterThan(0);
                var count = cmp.renderCount;
                ctx.detectChanges();
                matchers_1.expect(cmp.renderCount).toBe(count);
            }));
        });
        describe('multi directive order', function () {
            it('should follow the DI order for the same element', testing_1.fakeAsync(function () {
                var ctx = createCompFixture('<div orderCheck2="2" orderCheck0="0" orderCheck1="1"></div>');
                ctx.detectChanges(false);
                ctx.destroy();
                matchers_1.expect(directiveLog.filter(['set'])).toEqual(['0.set', '1.set', '2.set']);
            }));
        });
        describe('nested view recursion', function () {
            it('should recurse into nested components even if there are no bindings in the component view', function () {
                var Nested = (function () {
                    function Nested() {
                        this.name = 'Tom';
                    }
                    return Nested;
                }());
                Nested = __decorate([
                    core_1.Component({ selector: 'nested', template: '{{name}}' })
                ], Nested);
                testing_1.TestBed.configureTestingModule({ declarations: [Nested] });
                var ctx = createCompFixture('<nested></nested>');
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['Tom']);
            });
            it('should recurse into nested view containers even if there are no bindings in the component view', function () {
                var Comp = (function () {
                    function Comp() {
                        this.name = 'Tom';
                    }
                    return Comp;
                }());
                __decorate([
                    core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
                    __metadata("design:type", core_1.ViewContainerRef)
                ], Comp.prototype, "vc", void 0);
                __decorate([
                    core_1.ViewChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], Comp.prototype, "template", void 0);
                Comp = __decorate([
                    core_1.Component({ template: '<ng-template #vc>{{name}}</ng-template>' })
                ], Comp);
                testing_1.TestBed.configureTestingModule({ declarations: [Comp] });
                initHelpers();
                var ctx = testing_1.TestBed.createComponent(Comp);
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual([]);
                ctx.componentInstance.vc.createEmbeddedView(ctx.componentInstance.template);
                ctx.detectChanges();
                matchers_1.expect(renderLog.loggedValues).toEqual(['Tom']);
            });
            describe('projected views', function () {
                var log;
                var DummyDirective = (function () {
                    function DummyDirective() {
                    }
                    return DummyDirective;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], DummyDirective.prototype, "i", void 0);
                DummyDirective = __decorate([
                    core_1.Directive({ selector: '[i]' })
                ], DummyDirective);
                var MainComp = (function () {
                    function MainComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    MainComp.prototype.log = function (id) { log.push("main-" + id); };
                    return MainComp;
                }());
                MainComp = __decorate([
                    core_1.Component({
                        selector: 'main-cmp',
                        template: "<span [i]=\"log('start')\"></span><outer-cmp><ng-template><span [i]=\"log('tpl')\"></span></ng-template></outer-cmp>"
                    }),
                    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                ], MainComp);
                var OuterComp = (function () {
                    function OuterComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    OuterComp.prototype.log = function (id) { log.push("outer-" + id); };
                    return OuterComp;
                }());
                __decorate([
                    core_1.ContentChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], OuterComp.prototype, "tpl", void 0);
                OuterComp = __decorate([
                    core_1.Component({
                        selector: 'outer-cmp',
                        template: "<span [i]=\"log('start')\"></span><inner-cmp [outerTpl]=\"tpl\"><ng-template><span [i]=\"log('tpl')\"></span></ng-template></inner-cmp>"
                    }),
                    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                ], OuterComp);
                var InnerComp = (function () {
                    function InnerComp(cdRef) {
                        this.cdRef = cdRef;
                    }
                    InnerComp.prototype.log = function (id) { log.push("inner-" + id); };
                    return InnerComp;
                }());
                __decorate([
                    core_1.ContentChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], InnerComp.prototype, "tpl", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", core_1.TemplateRef)
                ], InnerComp.prototype, "outerTpl", void 0);
                InnerComp = __decorate([
                    core_1.Component({
                        selector: 'inner-cmp',
                        template: "<span [i]=\"log('start')\"></span>><ng-container [ngTemplateOutlet]=\"outerTpl\"></ng-container><ng-container [ngTemplateOutlet]=\"tpl\"></ng-container>"
                    }),
                    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                ], InnerComp);
                var ctx;
                var mainComp;
                var outerComp;
                var innerComp;
                beforeEach(function () {
                    log = [];
                    ctx = testing_1.TestBed
                        .configureTestingModule({ declarations: [MainComp, OuterComp, InnerComp, DummyDirective] })
                        .createComponent(MainComp);
                    mainComp = ctx.componentInstance;
                    outerComp = ctx.debugElement.query(by_1.By.directive(OuterComp)).injector.get(OuterComp);
                    innerComp = ctx.debugElement.query(by_1.By.directive(InnerComp)).injector.get(InnerComp);
                });
                it('should dirty check projected views in regular order', function () {
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'inner-start', 'main-tpl', 'outer-tpl']);
                    log = [];
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'inner-start', 'main-tpl', 'outer-tpl']);
                });
                it('should not dirty check projected views if neither the declaration nor the insertion place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    mainComp.cdRef.detach();
                    ctx.detectChanges(false);
                    matchers_1.expect(log).toEqual([]);
                });
                it('should dirty check projected views if the insertion place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    innerComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['inner-start', 'main-tpl', 'outer-tpl']);
                });
                it('should dirty check projected views if the declaration place is dirty checked', function () {
                    ctx.detectChanges(false);
                    log = [];
                    innerComp.cdRef.detach();
                    mainComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['main-start', 'outer-start', 'main-tpl', 'outer-tpl']);
                    log = [];
                    outerComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['outer-start', 'outer-tpl']);
                    log = [];
                    outerComp.cdRef.detach();
                    mainComp.cdRef.detectChanges();
                    matchers_1.expect(log).toEqual(['main-start', 'main-tpl']);
                });
            });
        });
        describe('class binding', function () {
            it('should coordinate class attribute and class host binding', function () {
                var Comp = (function () {
                    function Comp() {
                        this.initClasses = 'init';
                    }
                    return Comp;
                }());
                Comp = __decorate([
                    core_1.Component({ template: "<div class=\"{{initClasses}}\" someDir></div>" })
                ], Comp);
                var SomeDir = (function () {
                    function SomeDir() {
                        this.fooClass = true;
                    }
                    return SomeDir;
                }());
                __decorate([
                    core_1.HostBinding('class.foo'),
                    __metadata("design:type", Object)
                ], SomeDir.prototype, "fooClass", void 0);
                SomeDir = __decorate([
                    core_1.Directive({ selector: '[someDir]' })
                ], SomeDir);
                var ctx = testing_1.TestBed
                    .configureCompiler({
                    providers: [{ provide: element_schema_registry_1.ElementSchemaRegistry, useExisting: index_1.DomElementSchemaRegistry }]
                })
                    .configureTestingModule({ declarations: [Comp, SomeDir] })
                    .createComponent(Comp);
                ctx.detectChanges();
                var divEl = ctx.debugElement.children[0];
                matchers_1.expect(divEl.nativeElement).toHaveCssClass('init');
                matchers_1.expect(divEl.nativeElement).toHaveCssClass('foo');
            });
        });
    });
}
exports.main = main;
var RenderLog = (function () {
    function RenderLog() {
        this.log = [];
        this.loggedValues = [];
    }
    RenderLog.prototype.setElementProperty = function (el, propName, propValue) {
        this.log.push(propName + "=" + propValue);
        this.loggedValues.push(propValue);
    };
    RenderLog.prototype.setText = function (node, value) {
        this.log.push("{{" + value + "}}");
        this.loggedValues.push(value);
    };
    RenderLog.prototype.clear = function () {
        this.log = [];
        this.loggedValues = [];
    };
    return RenderLog;
}());
RenderLog = __decorate([
    core_1.Injectable()
], RenderLog);
var DirectiveLogEntry = (function () {
    function DirectiveLogEntry(directiveName, method) {
        this.directiveName = directiveName;
        this.method = method;
    }
    return DirectiveLogEntry;
}());
function patchLoggingRenderer2(rendererFactory, log) {
    if (rendererFactory.__patchedForLogging) {
        return;
    }
    rendererFactory.__patchedForLogging = true;
    var origCreateRenderer = rendererFactory.createRenderer;
    rendererFactory.createRenderer = function () {
        var renderer = origCreateRenderer.apply(this, arguments);
        if (renderer.__patchedForLogging) {
            return renderer;
        }
        renderer.__patchedForLogging = true;
        var origSetProperty = renderer.setProperty;
        var origSetValue = renderer.setValue;
        renderer.setProperty = function (el, name, value) {
            log.setElementProperty(el, name, value);
            origSetProperty.call(renderer, el, name, value);
        };
        renderer.setValue = function (node, value) {
            if (dom_adapter_1.getDOM().isTextNode(node)) {
                log.setText(node, value);
            }
            origSetValue.call(renderer, node, value);
        };
        return renderer;
    };
}
var DirectiveLog = (function () {
    function DirectiveLog() {
        this.entries = [];
    }
    DirectiveLog.prototype.add = function (directiveName, method) {
        this.entries.push(new DirectiveLogEntry(directiveName, method));
    };
    DirectiveLog.prototype.clear = function () { this.entries = []; };
    DirectiveLog.prototype.filter = function (methods) {
        return this.entries.filter(function (entry) { return methods.indexOf(entry.method) !== -1; })
            .map(function (entry) { return entry.directiveName + "." + entry.method; });
    };
    return DirectiveLog;
}());
DirectiveLog = __decorate([
    core_1.Injectable()
], DirectiveLog);
var CountingPipe = (function () {
    function CountingPipe() {
        this.state = 0;
    }
    CountingPipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    return CountingPipe;
}());
CountingPipe = __decorate([
    core_1.Pipe({ name: 'countingPipe' })
], CountingPipe);
var CountingImpurePipe = (function () {
    function CountingImpurePipe() {
        this.state = 0;
    }
    CountingImpurePipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    return CountingImpurePipe;
}());
CountingImpurePipe = __decorate([
    core_1.Pipe({ name: 'countingImpurePipe', pure: false })
], CountingImpurePipe);
var PipeWithOnDestroy = (function () {
    function PipeWithOnDestroy(directiveLog) {
        this.directiveLog = directiveLog;
    }
    PipeWithOnDestroy.prototype.ngOnDestroy = function () { this.directiveLog.add('pipeWithOnDestroy', 'ngOnDestroy'); };
    PipeWithOnDestroy.prototype.transform = function (value) { return null; };
    return PipeWithOnDestroy;
}());
PipeWithOnDestroy = __decorate([
    core_1.Pipe({ name: 'pipeWithOnDestroy' }),
    __metadata("design:paramtypes", [DirectiveLog])
], PipeWithOnDestroy);
var IdentityPipe = (function () {
    function IdentityPipe() {
    }
    IdentityPipe.prototype.transform = function (value) { return value; };
    return IdentityPipe;
}());
IdentityPipe = __decorate([
    core_1.Pipe({ name: 'identityPipe' })
], IdentityPipe);
var WrappedPipe = (function () {
    function WrappedPipe() {
    }
    WrappedPipe.prototype.transform = function (value) { return core_1.WrappedValue.wrap(value); };
    return WrappedPipe;
}());
WrappedPipe = __decorate([
    core_1.Pipe({ name: 'wrappedPipe' })
], WrappedPipe);
var MultiArgPipe = (function () {
    function MultiArgPipe() {
    }
    MultiArgPipe.prototype.transform = function (value, arg1, arg2, arg3) {
        if (arg3 === void 0) { arg3 = 'default'; }
        return value + " " + arg1 + " " + arg2 + " " + arg3;
    };
    return MultiArgPipe;
}());
MultiArgPipe = __decorate([
    core_1.Pipe({ name: 'multiArgPipe' })
], MultiArgPipe);
var TestComponent = (function () {
    function TestComponent() {
    }
    return TestComponent;
}());
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', template: 'empty' })
], TestComponent);
var AnotherComponent = (function () {
    function AnotherComponent() {
    }
    return AnotherComponent;
}());
AnotherComponent = __decorate([
    core_1.Component({ selector: 'other-cmp', template: 'empty' })
], AnotherComponent);
var CompWithRef = (function () {
    function CompWithRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    CompWithRef.prototype.noop = function () { };
    return CompWithRef;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CompWithRef.prototype, "value", void 0);
CompWithRef = __decorate([
    core_1.Component({
        selector: 'comp-with-ref',
        template: '<div (event)="noop()" emitterDirective></div>{{value}}',
        host: { 'event': 'noop()' }
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], CompWithRef);
var WrapCompWithRef = (function () {
    function WrapCompWithRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    return WrapCompWithRef;
}());
WrapCompWithRef = __decorate([
    core_1.Component({ selector: 'wrap-comp-with-ref', template: '<comp-with-ref></comp-with-ref>' }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], WrapCompWithRef);
var PushComp = (function () {
    function PushComp(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.renderCount = 0;
    }
    Object.defineProperty(PushComp.prototype, "renderIncrement", {
        get: function () {
            this.renderCount++;
            return '';
        },
        enumerable: true,
        configurable: true
    });
    PushComp.prototype.noop = function () { };
    return PushComp;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PushComp.prototype, "value", void 0);
PushComp = __decorate([
    core_1.Component({
        selector: 'push-cmp',
        template: '<div (event)="noop()" emitterDirective></div>{{value}}{{renderIncrement}}',
        host: { '(event)': 'noop()' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], PushComp);
var EmitterDirective = (function () {
    function EmitterDirective() {
        this.emitter = new core_1.EventEmitter();
    }
    return EmitterDirective;
}());
__decorate([
    core_1.Output('event'),
    __metadata("design:type", Object)
], EmitterDirective.prototype, "emitter", void 0);
EmitterDirective = __decorate([
    core_1.Directive({ selector: '[emitterDirective]' })
], EmitterDirective);
var Gh9882 = (function () {
    function Gh9882(_viewContainer, _templateRef) {
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
    }
    Gh9882.prototype.ngAfterContentInit = function () { this._viewContainer.createEmbeddedView(this._templateRef); };
    return Gh9882;
}());
Gh9882 = __decorate([
    core_1.Directive({ selector: '[gh9882]' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
], Gh9882);
var TestDirective = (function () {
    function TestDirective(log) {
        this.log = log;
        this.eventEmitter = new core_1.EventEmitter();
    }
    TestDirective.prototype.onEvent = function (event) { this.event = event; };
    TestDirective.prototype.ngDoCheck = function () { this.log.add(this.name, 'ngDoCheck'); };
    TestDirective.prototype.ngOnInit = function () {
        this.log.add(this.name, 'ngOnInit');
        if (this.throwOn == 'ngOnInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngOnChanges = function (changes) {
        this.log.add(this.name, 'ngOnChanges');
        this.changes = changes;
        if (this.throwOn == 'ngOnChanges') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterContentInit = function () {
        this.log.add(this.name, 'ngAfterContentInit');
        if (this.throwOn == 'ngAfterContentInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterContentChecked = function () {
        this.log.add(this.name, 'ngAfterContentChecked');
        if (this.throwOn == 'ngAfterContentChecked') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterViewInit = function () {
        this.log.add(this.name, 'ngAfterViewInit');
        if (this.throwOn == 'ngAfterViewInit') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngAfterViewChecked = function () {
        this.log.add(this.name, 'ngAfterViewChecked');
        if (this.throwOn == 'ngAfterViewChecked') {
            throw new Error('Boom!');
        }
    };
    TestDirective.prototype.ngOnDestroy = function () {
        this.log.add(this.name, 'ngOnDestroy');
        if (this.throwOn == 'ngOnDestroy') {
            throw new Error('Boom!');
        }
    };
    return TestDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TestDirective.prototype, "a", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TestDirective.prototype, "b", void 0);
__decorate([
    core_1.Input('testDirective'),
    __metadata("design:type", String)
], TestDirective.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TestDirective.prototype, "throwOn", void 0);
TestDirective = __decorate([
    core_1.Directive({ selector: '[testDirective]', exportAs: 'testDirective' }),
    __metadata("design:paramtypes", [DirectiveLog])
], TestDirective);
var InjectableWithLifecycle = (function () {
    function InjectableWithLifecycle(log) {
        this.log = log;
        this.name = 'injectable';
    }
    InjectableWithLifecycle.prototype.ngOnDestroy = function () { this.log.add(this.name, 'ngOnDestroy'); };
    return InjectableWithLifecycle;
}());
InjectableWithLifecycle = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [DirectiveLog])
], InjectableWithLifecycle);
var OnDestroyDirective = (function () {
    function OnDestroyDirective() {
        this.emitter = new core_1.EventEmitter(false);
    }
    OnDestroyDirective.prototype.ngOnDestroy = function () { this.emitter.emit('destroyed'); };
    return OnDestroyDirective;
}());
__decorate([
    core_1.Output('destroy'),
    __metadata("design:type", Object)
], OnDestroyDirective.prototype, "emitter", void 0);
OnDestroyDirective = __decorate([
    core_1.Directive({ selector: '[onDestroyDirective]' })
], OnDestroyDirective);
var OrderCheckDirective0 = (function () {
    function OrderCheckDirective0(log) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective0.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    return OrderCheckDirective0;
}());
__decorate([
    core_1.Input('orderCheck0'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], OrderCheckDirective0.prototype, "name", null);
OrderCheckDirective0 = __decorate([
    core_1.Directive({ selector: '[orderCheck0]' }),
    __metadata("design:paramtypes", [DirectiveLog])
], OrderCheckDirective0);
var OrderCheckDirective1 = (function () {
    function OrderCheckDirective1(log, _check0) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective1.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    return OrderCheckDirective1;
}());
__decorate([
    core_1.Input('orderCheck1'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], OrderCheckDirective1.prototype, "name", null);
OrderCheckDirective1 = __decorate([
    core_1.Directive({ selector: '[orderCheck1]' }),
    __metadata("design:paramtypes", [DirectiveLog, OrderCheckDirective0])
], OrderCheckDirective1);
var OrderCheckDirective2 = (function () {
    function OrderCheckDirective2(log, _check1) {
        this.log = log;
    }
    Object.defineProperty(OrderCheckDirective2.prototype, "name", {
        set: function (value) {
            this._name = value;
            this.log.add(this._name, 'set');
        },
        enumerable: true,
        configurable: true
    });
    return OrderCheckDirective2;
}());
__decorate([
    core_1.Input('orderCheck2'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], OrderCheckDirective2.prototype, "name", null);
OrderCheckDirective2 = __decorate([
    core_1.Directive({ selector: '[orderCheck2]' }),
    __metadata("design:paramtypes", [DirectiveLog, OrderCheckDirective1])
], OrderCheckDirective2);
var TestLocalsContext = (function () {
    function TestLocalsContext(someLocal) {
        this.someLocal = someLocal;
    }
    return TestLocalsContext;
}());
var TestLocals = (function () {
    function TestLocals(templateRef, vcRef) {
        vcRef.createEmbeddedView(templateRef, new TestLocalsContext('someLocalValue'));
    }
    return TestLocals;
}());
TestLocals = __decorate([
    core_1.Directive({ selector: '[testLocals]' }),
    __metadata("design:paramtypes", [core_1.TemplateRef, core_1.ViewContainerRef])
], TestLocals);
var Person = (function () {
    function Person() {
        this.address = null;
    }
    Person.prototype.init = function (name, address) {
        if (address === void 0) { address = null; }
        this.name = name;
        this.address = address;
    };
    Person.prototype.sayHi = function (m) { return "Hi, " + m; };
    Person.prototype.passThrough = function (val) { return val; };
    Person.prototype.toString = function () {
        var address = this.address == null ? '' : ' address=' + this.address.toString();
        return 'name=' + this.name + address;
    };
    return Person;
}());
Person = __decorate([
    core_1.Component({ selector: 'root', template: 'emtpy' })
], Person);
var Address = (function () {
    function Address(_city, _zipcode) {
        if (_zipcode === void 0) { _zipcode = null; }
        this._city = _city;
        this._zipcode = _zipcode;
        this.cityGetterCalls = 0;
        this.zipCodeGetterCalls = 0;
    }
    Object.defineProperty(Address.prototype, "city", {
        get: function () {
            this.cityGetterCalls++;
            return this._city;
        },
        set: function (v) { this._city = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "zipcode", {
        get: function () {
            this.zipCodeGetterCalls++;
            return this._zipcode;
        },
        set: function (v) { this._zipcode = v; },
        enumerable: true,
        configurable: true
    });
    Address.prototype.toString = function () { return this.city || '-'; };
    return Address;
}());
var Uninitialized = (function () {
    function Uninitialized() {
        this.value = null;
    }
    return Uninitialized;
}());
Uninitialized = __decorate([
    core_1.Component({ selector: 'root', template: 'empty' })
], Uninitialized);
var TestData = (function () {
    function TestData() {
    }
    return TestData;
}());
TestData = __decorate([
    core_1.Component({ selector: 'root', template: 'empty' })
], TestData);
var TestDataWithGetter = (function () {
    function TestDataWithGetter() {
    }
    Object.defineProperty(TestDataWithGetter.prototype, "a", {
        get: function () { return this.fn(); },
        enumerable: true,
        configurable: true
    });
    return TestDataWithGetter;
}());
TestDataWithGetter = __decorate([
    core_1.Component({ selector: 'root', template: 'empty' })
], TestDataWithGetter);
var Holder = (function () {
    function Holder() {
    }
    return Holder;
}());
var PersonHolder = (function (_super) {
    __extends(PersonHolder, _super);
    function PersonHolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PersonHolder;
}(Holder));
PersonHolder = __decorate([
    core_1.Component({ selector: 'root', template: 'empty' })
], PersonHolder);
var PersonHolderHolder = (function (_super) {
    __extends(PersonHolderHolder, _super);
    function PersonHolderHolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PersonHolderHolder;
}(Holder));
PersonHolderHolder = __decorate([
    core_1.Component({ selector: 'root', template: 'empty' })
], PersonHolderHolder);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9jaGFuZ2VfZGV0ZWN0aW9uX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsZ0dBQTJGO0FBQzNGLDZFQUFvRjtBQUNwRixzQ0FBdWQ7QUFDdmQsaURBQTJFO0FBQzNFLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFLGlEQUFpRTtBQUdqRTtJQUNFLElBQUksUUFBNEIsQ0FBQztJQUNqQyxJQUFJLFNBQW9CLENBQUM7SUFDekIsSUFBSSxZQUEwQixDQUFDO0lBSS9CLDJCQUNJLFFBQWdCLEVBQUUsUUFBc0M7UUFBdEMseUJBQUEsRUFBQSxXQUF5QixhQUFhO1FBQzFELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFFdEUsV0FBVyxFQUFFLENBQUM7UUFFZCxNQUFNLENBQUMsaUJBQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEO1FBQ0UsUUFBUSxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLCtDQUFxQixDQUFDLENBQUM7UUFDOUMsU0FBUyxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLFlBQVksR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxRQUFRLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9DLHFCQUFxQixDQUFDLGlCQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELG1CQUFtQixFQUFnQixFQUFFLE9BQWtCO1FBQ3JELElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBSUQseUJBQ0ksUUFBZ0IsRUFBRSxRQUFzQztRQUF0Qyx5QkFBQSxFQUFBLFdBQXlCLGFBQWE7UUFDMUQsSUFBTSxRQUFRLEdBQUcsVUFBUSxRQUFRLFlBQVMsQ0FBQztRQUMzQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFJRCwwQkFDSSxVQUFlLEVBQUUsUUFBc0M7UUFBdEMseUJBQUEsRUFBQSxXQUF5QixhQUFhO1FBQ3pELE1BQU0sQ0FBQyxlQUFlLENBQUMsaUJBQWUsVUFBVSxNQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELGtDQUNJLFVBQWUsRUFBRSxRQUFtQztRQUFuQyx5QkFBQSxFQUFBLHdCQUFtQztRQUN0RCxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUN2QixDQUFDO0lBRUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLHVDQUF1QztRQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRTFDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBQyxTQUFTLEVBQUUsdUNBQXVCLEVBQUMsQ0FBQyxDQUFDO1lBQ2hFLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRTtvQkFDWixRQUFRO29CQUNSLGFBQWE7b0JBQ2IsYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLFVBQVU7b0JBQ1YsV0FBVztvQkFDWCxlQUFlO29CQUNmLGdCQUFnQjtvQkFDaEIsUUFBUTtvQkFDUixrQkFBa0I7b0JBQ2xCLG9CQUFvQjtvQkFDcEIsb0JBQW9CO29CQUNwQixvQkFBb0I7b0JBQ3BCLE1BQU07b0JBQ04sYUFBYTtvQkFDYixNQUFNO29CQUNOLFlBQVk7b0JBQ1osa0JBQWtCO29CQUNsQixZQUFZO29CQUNaLGtCQUFrQjtvQkFDbEIsWUFBWTtvQkFDWixpQkFBaUI7b0JBQ2pCLFlBQVk7b0JBQ1osV0FBVztpQkFDWjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsU0FBUztvQkFDVCxZQUFZO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyx5QkFBeUIsRUFDekIsbUJBQVMsQ0FBQyxjQUFRLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4RixFQUFFLENBQUMsbUNBQW1DLEVBQ25DLG1CQUFTLENBQUMsY0FBUSxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUYsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLG1CQUFTLENBQUM7Z0JBQy9DLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDNUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyw2QkFBNkIsRUFDN0IsbUJBQVMsQ0FBQyxjQUFRLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixFQUFFLENBQUMsNkJBQTZCLEVBQzdCLG1CQUFTLENBQUMsY0FBUSxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0YsRUFBRSxDQUFDLDZCQUE2QixFQUM3QixtQkFBUyxDQUFDLGNBQVEsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlGLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxtQkFBUyxDQUFDO2dCQUN2QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBWSxHQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSx5QkFBeUI7WUFFbEMsRUFBRSxDQUFDLDZCQUE2QixFQUM3QixtQkFBUyxDQUFDLGNBQVEsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxtQkFBUyxDQUFDO2dCQUNyRCxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDhCQUE4QixFQUFFLG1CQUFTLENBQUM7Z0JBQ3hDLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxtQkFBUyxDQUFDO2dCQUN0RCxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLG1CQUFTLENBQUM7Z0JBQ3RELGlCQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsK0JBQStCLEVBQUUsbUJBQVMsQ0FBQztnQkFDekMsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUMxRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLG1CQUFTLENBQUM7Z0JBQ3ZELGlCQUFNLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM1QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN2RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLG1CQUFTLENBQUM7Z0JBQzdDLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxtQkFBUyxDQUFDO2dCQUM3QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsbUJBQVMsQ0FBQztnQkFDNUMsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdkUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxtQkFBUyxDQUFDO2dCQUM3QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLG1CQUFTLENBQUM7Z0JBQzlDLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsbUJBQVMsQ0FBQztnQkFDOUMsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLG1CQUFTLENBQUM7Z0JBQzdDLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsbUJBQVMsQ0FBQztnQkFDOUMsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM5QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsbUJBQVMsQ0FBQztnQkFDN0MsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM5QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsbUJBQVMsQ0FBQztnQkFDN0MsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM5QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDakYsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBUyxDQUFDO2dCQUNqQyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsOEJBQThCLEVBQUUsbUJBQVMsQ0FBQztnQkFDeEMsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM1QyxpQkFBTSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLG1CQUFTLENBQUM7Z0JBQzdDLGlCQUFNLENBQUMsd0JBQXdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsNENBQTRDLEVBQUUsbUJBQVMsQ0FBQztnQkFDdEQsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLG1CQUFTLENBQUM7Z0JBQ3JELGlCQUFNLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQywyRUFBMkUsRUFDM0UsbUJBQVMsQ0FBQztnQkFDUixpQkFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxrRUFBa0UsRUFBRSxtQkFBUyxDQUFDO2dCQUM1RSxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzVDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUMvQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsK0NBQStDLEVBQUUsbUJBQVMsQ0FBQztnQkFDekQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ25DLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxtQkFBUyxDQUFDO29CQUN0RCxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3RELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBTSxDQUFDO29CQUN2QyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxtQkFBUyxDQUFDO29CQUNuRCxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDNUQsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxJQUFNLENBQUM7b0JBQ3ZDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLG1CQUFTLENBQUM7b0JBQzFELElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdEQsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsNkNBQTZDLEVBQUUsbUJBQVMsQ0FBQztvQkFDdkQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzVELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLG1CQUFTLENBQUM7b0JBQzFELElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUNsRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLElBQU0sQ0FBQztvQkFDckMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsdURBQXVELEVBQUUsbUJBQVMsQ0FBQztvQkFDakUsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsMkJBQTJCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDOUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO29CQUNqRCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxtQkFBUyxDQUFDO29CQUNsRSxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyw0QkFBNEIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUMvRSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxtQkFBUyxDQUFDO29CQUNqRSxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDL0QsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsOENBQThDLEVBQUUsbUJBQVMsQ0FBQztvQkFDeEQsaUJBQU0sQ0FBQzt3QkFDTCxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFDbEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQzt3QkFDNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFNLENBQUM7d0JBQ3hCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO3dCQUNyQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMzQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsbUJBQVMsQ0FBQztnQkFDdkMsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxtQkFBUyxDQUFDO2dCQUN6QyxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsY0FBTSxPQUFBLFVBQUMsQ0FBTSxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsRUFBYixDQUFhLENBQUM7Z0JBQzlDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxtQkFBUyxDQUFDO2dCQUMvQyxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDM0QsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG9CQUFvQixFQUFFLG1CQUFTLENBQUM7Z0JBQzlCLElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRXpCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFbEIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsbUJBQVMsQ0FBQztnQkFDckMsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFFckMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWxCLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVsQixHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDckMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsK0NBQStDLEVBQUUsbUJBQVMsQ0FBQztnQkFDekQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLG1CQUFTLENBQUM7Z0JBQzlDLElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsa0RBQWtELEVBQUUsbUJBQVMsQ0FBQztnQkFDNUQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsaUVBQWlFLEVBQUUsbUJBQVMsQ0FBQztnQkFDM0UsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLG1CQUFTLENBQUM7Z0JBQ3hELElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM1QyxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLG1CQUFTLENBQUM7Z0JBQzNELElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsK0RBQStELEVBQUUsbUJBQVMsQ0FBQztnQkFDekUsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdQLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxtQkFBUyxDQUFDO2dCQUN4QyxJQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDbEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsOEJBQThCLEVBQUUsbUJBQVMsQ0FBQztnQkFDeEMsSUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDbEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsOERBQThELEVBQUUsbUJBQVMsQ0FBQztnQkFDeEUsSUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDL0IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLDhEQUE4RCxFQUM5RCxtQkFBUyxDQUFDLGNBQVEsaUJBQU0sQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFGLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBUyxDQUFDO2dCQUM5QixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FDekIsdUVBQXVFLENBQUMsQ0FBQztnQkFDN0UsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUNoQixFQUFFLENBQUMseUNBQXlDLEVBQUUsbUJBQVMsQ0FBQztvQkFDbkQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzVELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxtQkFBUyxDQUFDO29CQUM3QyxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDL0UsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7b0JBQ3JDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztnQkFDcEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsbUJBQVMsQ0FBQztvQkFDaEQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsZ0RBQWdELEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3ZGLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO29CQUNyQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLHNFQUFzRSxFQUFFLG1CQUFTLENBQUM7b0JBQ2hGLElBQU0sR0FBRyxHQUNMLGdCQUFnQixDQUFDLGtEQUFrRCxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNqRixHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztvQkFDckMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO29CQUM1QyxJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQywyQkFBMkIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFFbEUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUVyRCxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2xCLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsb0RBQW9ELEVBQUUsbUJBQVMsQ0FBQztvQkFDOUQsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBRWpFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztvQkFFckQsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNsQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLG1CQUFTLENBQUM7b0JBQzFELElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUN6QixxRkFBcUYsQ0FBQyxDQUFDO29CQUMzRixJQUFNLEdBQUcsR0FBa0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNqQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixvRUFBb0U7b0JBQ3BFLHVDQUF1QztvQkFDdkMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMxQixNQUFNLEVBQUUsSUFBSSxtQkFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO3dCQUNqRCxHQUFHLEVBQUUsSUFBSSxtQkFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDO3FCQUNuQyxDQUFDLENBQUM7b0JBRUgsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMxQixNQUFNLEVBQUUsSUFBSSxtQkFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO3dCQUNqRCxHQUFHLEVBQUUsSUFBSSxtQkFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDO3FCQUNuQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMscURBQXFELEVBQUUsbUJBQVMsQ0FBQztvQkFDL0QsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzVELGdDQUFnQztvQkFDaEMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxJQUFNLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBRXpELGlDQUFpQztvQkFDakMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN4RSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFFeEUsNkNBQTZDO29CQUM3QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDcEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNyQyxjQUFjLEVBQUUsYUFBYSxFQUFFLGNBQWM7cUJBQzlDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ3JDLGNBQWMsRUFBRSxhQUFhLEVBQUUsY0FBYztxQkFDOUMsQ0FBQyxDQUFDO2dCQUVMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLG9GQUFvRixFQUNwRixtQkFBUyxDQUFDO29CQUNSLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUN6Qiw2RkFBeUY7d0JBQ3JGLDhFQUE4RSxFQUNsRixNQUFNLENBQUMsQ0FBQztvQkFDWixHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztvQkFDakMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQy9CLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDckMsYUFBYSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWTtxQkFDeEQsQ0FBQyxDQUFDO29CQUNILEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDckMsYUFBYSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWTtxQkFDeEQsQ0FBQyxDQUFDO29CQUNILEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUMvQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ3JDLGFBQWEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZO3FCQUN0RSxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsdURBQXVELEVBQUUsbUJBQVMsQ0FBQztvQkFDakUsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2xFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDekUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO2dCQUM1QixFQUFFLENBQUMsa0NBQWtDLEVBQUUsbUJBQVMsQ0FBQztvQkFDNUMsSUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQ3BELElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0MsaUJBQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBUyxDQUFDO29CQUM1QyxJQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDckQsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDO29CQUNwQixPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxQyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxtQkFBUyxDQUFDO29CQUNqQyxJQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFDdkQsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM1QixPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM5QyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLCtCQUErQixFQUFFLG1CQUFTLENBQUM7b0JBQ3pDLElBQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUNuRCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFFOUMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLCtDQUErQyxFQUFFLG1CQUFTLENBQUM7b0JBQ3pELGlCQUFNLENBQUM7d0JBQ0wsZUFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQ3hDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLE1BQU0sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLG1CQUFTLENBQUM7b0JBQzNDLElBQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO29CQUN0RSxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzlDLGlCQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsRUFBRSxDQUFDLCtGQUErRixFQUMvRixtQkFBUyxDQUFDO2dCQUNSLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLG9DQUFvQyxDQUFDLENBQUM7Z0JBQ3BFLElBQU0sRUFBRSxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLENBQUM7Z0JBQ3pDLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pCLGlCQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QyxpQkFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFFdEMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDcEMsaUJBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsUUFBUSxDQUFDLHFCQUFxQixFQUFFO2dCQUM5QixFQUFFLENBQUMsNkNBQTZDLEVBQUUsbUJBQVMsQ0FBQztvQkFDdkQsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsb0NBQW9DLENBQUMsQ0FBQztvQkFDcEUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNsQyxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDdEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLG9CQUFvQixFQUFFO2dCQUM3QixFQUFFLENBQUMsa0NBQWtDLEVBQUUsbUJBQVMsQ0FBQztvQkFDNUMsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQ3pCLCtFQUErRSxDQUFDLENBQUM7b0JBQ3JGLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxtQkFBUyxDQUFDO29CQUN2RSxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FDekIsd0dBQXdHLENBQUMsQ0FBQztvQkFDOUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsSUFBTSxJQUFJLEdBQW9CLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUN6RSxpQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzlCLEdBQUcsRUFBRSxJQUFJLG1CQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7d0JBQ3pDLEdBQUcsRUFBRSxJQUFJLG1CQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7d0JBQ3pDLE1BQU0sRUFBRSxJQUFJLG1CQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7cUJBQ25ELENBQUMsQ0FBQztvQkFDSCxpQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzlCLEdBQUcsRUFBRSxJQUFJLG1CQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7d0JBQ3pDLE1BQU0sRUFBRSxJQUFJLG1CQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7cUJBQ25ELENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDcEI7Z0JBQ0UsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDMUMsR0FBRyxFQUFFLElBQUksZ0JBQVMsQ0FBQzt3QkFDakIsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFFBQVEsRUFBRSx1Q0FBdUM7cUJBQ2xELENBQUM7aUJBQ0gsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxpQkFBaUIsQ0FDcEIsZ0hBQWdILEVBQ2hILGFBQWEsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFFRCxRQUFRLENBQUMsVUFBVSxFQUFFO2dCQUNuQixFQUFFLENBQUMsb0NBQW9DLEVBQUUsbUJBQVMsQ0FBQztvQkFDOUMsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDakUsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRXJFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMvRCxpQkFBaUIsRUFBRSxjQUFjO3FCQUNsQyxDQUFDLENBQUM7b0JBQ0gsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUVyQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxtQkFBUyxDQUFDO29CQUMzQyxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUVqRSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFFcEUsbUJBQW1CO29CQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRXJCLDZDQUE2QztvQkFDN0MsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV0RCw4Q0FBOEM7b0JBQzlDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLG1CQUFTLENBQUM7b0JBQ3ZELElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLG9EQUFvRCxDQUFDLENBQUM7b0JBRXBGLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsbURBQW1EO29CQUNuRCxJQUFJLENBQUM7d0JBQ0gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLGlCQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDaEMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDakIsQ0FBQztvQkFDRCxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFM0IsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFckIsbUZBQW1GO29CQUNuRixJQUFJLENBQUM7d0JBQ0gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLGlCQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO29CQUM3RSxDQUFDO29CQUNELGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxtQkFBUyxDQUFDO29CQUMzQyxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUVqRSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDN0QsY0FBYyxFQUFFLGVBQWU7cUJBQ2hDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx3RUFBd0UsRUFDeEUsbUJBQVMsQ0FBQztvQkFDUixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUVqRSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFFdEUsbUJBQW1CO29CQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRXJCLDZDQUE2QztvQkFDN0MsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV2RCw0Q0FBNEM7b0JBQzVDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzdCLEVBQUUsQ0FBQyxxRkFBcUYsRUFDckYsbUJBQVMsQ0FBQztvQkFDUixJQUFNLEdBQUcsR0FBRyxpQ0FBaUMsRUFBRSxDQUFDO29CQUNoRCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUN2RSxrQkFBa0IsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUM7d0JBQy9FLDJCQUEyQixFQUFFLHFCQUFxQixFQUFFLDhCQUE4QjtxQkFDbkYsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLG1CQUFTLENBQUM7b0JBQzNDLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBRWpFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDMUQsd0JBQXdCO3FCQUN6QixDQUFDLENBQUM7b0JBRUgsbUJBQW1CO29CQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRXJCLDZDQUE2QztvQkFDN0MsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRWhFLDhDQUE4QztvQkFDOUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxtQkFBUyxDQUFDO29CQUNqRSxJQUFNLEdBQUcsR0FDTCxpQkFBaUIsQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO29CQUV0RixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLDZEQUE2RDtvQkFDN0QsSUFBSSxDQUFDO3dCQUNILEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNCLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNqQixDQUFDO29CQUNELGlCQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUUzQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzFELHdCQUF3QjtxQkFDekIsQ0FBQyxDQUFDO29CQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFckIscUZBQXFGO29CQUNyRixVQUFVO29CQUNWLElBQUksQ0FBQzt3QkFDSCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMzQixDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO29CQUMzRSxDQUFDO29CQUNELGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFO2dCQUNoQyxFQUFFLENBQUMsMEVBQTBFLEVBQzFFLG1CQUFTLENBQUM7b0JBQ1IsSUFBTSxHQUFHLEdBQUcsaUNBQWlDLEVBQUUsQ0FBQztvQkFFaEQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDMUUsa0JBQWtCLEVBQUUsd0JBQXdCLEVBQUUsb0NBQW9DO3dCQUNsRiw4QkFBOEIsRUFBRSxxQkFBcUI7d0JBQ3JELGlDQUFpQztxQkFDbEMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLHdFQUF3RSxFQUN4RSxtQkFBUyxDQUFDO29CQUNSLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBRWpFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDN0QsMkJBQTJCO3FCQUM1QixDQUFDLENBQUM7b0JBRUgsbUJBQW1CO29CQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRXJCLDZDQUE2QztvQkFDN0MsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRW5FLDRDQUE0QztvQkFDNUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUM3RCwyQkFBMkI7cUJBQzVCLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxxRkFBcUYsRUFDckYsbUJBQVMsQ0FBQztvQkFDUixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FDekIsd0dBQXdHLENBQUMsQ0FBQztvQkFFOUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUM3RCw2QkFBNkIsRUFBRSw4QkFBOEI7d0JBQzdELCtCQUErQjtxQkFDaEMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUdILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUIsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLG1CQUFTLENBQUM7b0JBQy9ELElBQU0sR0FBRyxHQUFHLGlDQUFpQyxFQUFFLENBQUM7b0JBRWhELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ3BFLGtCQUFrQixFQUFFLHdCQUF3QixFQUFFLDhCQUE4Qjt3QkFDNUUscUJBQXFCLEVBQUUsMkJBQTJCLEVBQUUsd0JBQXdCO3FCQUM3RSxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsbUJBQVMsQ0FBQztvQkFDM0MsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFFakUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO29CQUVsRixtQkFBbUI7b0JBQ25CLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFFckIsNkNBQTZDO29CQUM3QyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBRXJCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFN0QsOENBQThDO29CQUM5QyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQy9ELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLG1CQUFTLENBQUM7b0JBQzlELElBQU0sR0FBRyxHQUNMLGlCQUFpQixDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBRW5GLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsMERBQTBEO29CQUMxRCxJQUFJLENBQUM7d0JBQ0gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ2pCLENBQUM7b0JBQ0QsaUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRTNCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztvQkFDbEYsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUVyQixrRkFBa0Y7b0JBQ2xGLFVBQVU7b0JBQ1YsSUFBSSxDQUFDO3dCQUNILEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNCLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7b0JBQzNFLENBQUM7b0JBQ0QsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzdCLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxtQkFBUyxDQUFDO29CQUMvRCxJQUFNLEdBQUcsR0FBRyxpQ0FBaUMsRUFBRSxDQUFDO29CQUVoRCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUN2RSxrQkFBa0IsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUM7d0JBQy9FLHFCQUFxQixFQUFFLDhCQUE4QixFQUFFLDJCQUEyQjtxQkFDbkYsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLHdFQUF3RSxFQUN4RSxtQkFBUyxDQUFDO29CQUNSLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBRWpFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXpCLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDMUQsd0JBQXdCO3FCQUN6QixDQUFDLENBQUM7b0JBRUgsbUJBQW1CO29CQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRXJCLDZDQUE2QztvQkFDN0MsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQixpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRWhFLDRDQUE0QztvQkFDNUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMxRCx3QkFBd0I7cUJBQ3pCLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxxRkFBcUYsRUFDckYsbUJBQVMsQ0FBQztvQkFDUixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FDekIsd0dBQXdHLENBQUMsQ0FBQztvQkFFOUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMxRCwwQkFBMEIsRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEI7cUJBQ3RGLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO2dCQUN0QixFQUFFLENBQUMsc0NBQXNDLEVBQUUsbUJBQVMsQ0FBQztvQkFDaEQsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDakUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVkLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGlFQUFpRSxFQUFFLG1CQUFTLENBQUM7b0JBQzNFLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUU7d0JBQzFDLEdBQUcsRUFBRSxJQUFJLGdCQUFTLENBQ2QsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx1Q0FBdUMsRUFBQyxDQUFDO3FCQUNoRixDQUFDLENBQUM7b0JBRUgsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQ3pCLG1HQUFtRzt3QkFDL0YsK0JBQStCLEVBQ25DLGFBQWEsQ0FBQyxDQUFDO29CQUVuQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWQsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFDbkQsMkJBQTJCLEVBQUUsMkJBQTJCLEVBQUUsdUJBQXVCO3dCQUNqRixvQkFBb0I7cUJBQ3JCLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxxRkFBcUYsRUFDckYsbUJBQVMsQ0FBQztvQkFDUixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FDekIsd0dBQXdHLENBQUMsQ0FBQztvQkFFOUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVkLGlCQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQ25ELG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLHFCQUFxQjtxQkFDakUsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLG1CQUFTLENBQUM7b0JBQ3ZELElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLHFEQUFxRCxDQUFDLENBQUM7b0JBRXJGLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFZCxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLG1CQUFTLENBQUM7b0JBQzVDLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLCtCQUErQixDQUFDLENBQUM7b0JBRS9ELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFZCxpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNuRCwrQkFBK0I7cUJBQ2hDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxtQkFBUyxDQUFDO29CQUMxRCxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQixhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUVsRSxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxpQ0FBaUMsRUFBRSxhQUFhLENBQUMsQ0FBQztvQkFFaEYsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNuRSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV6QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWQsb0RBQW9EO29CQUNwRCxpQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUMxRCxpQkFBaUIsRUFBRSx3QkFBd0I7cUJBQzVDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtZQUNqQyxFQUFFLENBQUMsbUVBQW1FLEVBQUUsbUJBQVMsQ0FBQztnQkFDN0UsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsNEJBQTRCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3RFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUU1QixpQkFBTSxDQUFDLGNBQU0sT0FBQSxHQUFHLENBQUMsY0FBYyxFQUFFLEVBQXBCLENBQW9CLENBQUM7cUJBQzdCLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMseURBQXlELEVBQUUsbUJBQVMsQ0FBQztnQkFDbkUsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsNEJBQTRCLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3RFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixpQkFBTSxDQUFDLGNBQU0sT0FBQSxHQUFHLENBQUMsYUFBYSxFQUFFLEVBQW5CLENBQW1CLENBQUM7cUJBQzVCLFlBQVksQ0FDVCxtR0FBbUcsQ0FBQyxDQUFDO1lBQy9HLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsNERBQTRELEVBQUUsbUJBQVMsQ0FBQztnQkFDdEUsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEMsaUJBQU0sQ0FBQyxjQUFNLE9BQUEsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsK0JBQStCLEVBQUUsbUJBQVMsQ0FBQztnQkFDekMsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDbEMsaUJBQU0sQ0FBQyxjQUFNLE9BQUEsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRTdDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDcEIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ2YsRUFBRSxDQUFDLFVBQVUsRUFBRSxtQkFBUyxDQUFDO2dCQUNwQixJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFNLEdBQUcsR0FBZ0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRS9CLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFFcEIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsbUJBQVMsQ0FBQztnQkFDMUMsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztnQkFDdkUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDcEIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVsQixJQUFNLEdBQUcsR0FBZ0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFL0IsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFFcEIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFUCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsbUJBQVMsQ0FBQztnQkFDaEQsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsMkNBQTJDLENBQUMsQ0FBQztnQkFDM0UsSUFBTSxHQUFHLEdBQWdCLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDcEIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMvQixpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFFcEIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUVsQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXRDLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdQLEVBQUUsQ0FBQyxZQUFZLEVBQUUsbUJBQVMsQ0FBQztnQkFDdEIsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDakUsSUFBTSxHQUFHLEdBQWdCLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyRSxHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDcEIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUUvQixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXBCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFbEMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUVqQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXBCLGlCQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFL0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVQLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxtQkFBUyxDQUFDO2dCQUM5QyxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLEdBQUcsR0FBYSxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMvQixHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRWpDLHNGQUFzRjtnQkFDdEYsVUFBVTtnQkFDVixHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BCLGlCQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztnQkFFOUIsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNwQixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVULENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxtQkFBUyxDQUFDO2dCQUMzRCxJQUFNLEdBQUcsR0FDTCxpQkFBaUIsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO2dCQUVyRixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRWQsaUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsRUFBRSxDQUFDLDJGQUEyRixFQUMzRjtnQkFFRSxJQUFNLE1BQU07b0JBRFo7d0JBRUUsU0FBSSxHQUFHLEtBQUssQ0FBQztvQkFDZixDQUFDO29CQUFELGFBQUM7Z0JBQUQsQ0FBQyxBQUZELElBRUM7Z0JBRkssTUFBTTtvQkFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUM7bUJBQ2hELE1BQU0sQ0FFWDtnQkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUV6RCxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNuRCxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMsZ0dBQWdHLEVBQ2hHO2dCQUVFLElBQU0sSUFBSTtvQkFEVjt3QkFFRSxTQUFJLEdBQUcsS0FBSyxDQUFDO29CQUdmLENBQUM7b0JBQUQsV0FBQztnQkFBRCxDQUFDLEFBSkQsSUFJQztnQkFGNEM7b0JBQTFDLGdCQUFTLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLHVCQUFnQixFQUFDLENBQUM7OENBQUssdUJBQWdCO2dEQUFDO2dCQUN4QztvQkFBdkIsZ0JBQVMsQ0FBQyxrQkFBVyxDQUFDOzhDQUFXLGtCQUFXO3NEQUFNO2dCQUgvQyxJQUFJO29CQURULGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUseUNBQXlDLEVBQUMsQ0FBQzttQkFDM0QsSUFBSSxDQUlUO2dCQUVELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3ZELFdBQVcsRUFBRSxDQUFDO2dCQUVkLElBQU0sR0FBRyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BCLGlCQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFM0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVFLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDcEIsaUJBQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztZQUVOLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUIsSUFBSSxHQUFhLENBQUM7Z0JBR2xCLElBQU0sY0FBYztvQkFBcEI7b0JBR0EsQ0FBQztvQkFBRCxxQkFBQztnQkFBRCxDQUFDLEFBSEQsSUFHQztnQkFEQztvQkFEQyxZQUFLLEVBQUU7O3lEQUNEO2dCQUZILGNBQWM7b0JBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7bUJBQ3ZCLGNBQWMsQ0FHbkI7Z0JBT0QsSUFBTSxRQUFRO29CQUNaLGtCQUFtQixLQUF3Qjt3QkFBeEIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7b0JBQUcsQ0FBQztvQkFDL0Msc0JBQUcsR0FBSCxVQUFJLEVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVEsRUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxlQUFDO2dCQUFELENBQUMsQUFIRCxJQUdDO2dCQUhLLFFBQVE7b0JBTGIsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsVUFBVTt3QkFDcEIsUUFBUSxFQUNKLHNIQUFrSDtxQkFDdkgsQ0FBQztxREFFMEIsd0JBQWlCO21CQUR2QyxRQUFRLENBR2I7Z0JBT0QsSUFBTSxTQUFTO29CQUliLG1CQUFtQixLQUF3Qjt3QkFBeEIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7b0JBQUcsQ0FBQztvQkFDL0MsdUJBQUcsR0FBSCxVQUFJLEVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVMsRUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxnQkFBQztnQkFBRCxDQUFDLEFBTkQsSUFNQztnQkFKQztvQkFEQyxtQkFBWSxDQUFDLGtCQUFXLENBQUM7OENBQ3JCLGtCQUFXO3NEQUFNO2dCQUZsQixTQUFTO29CQUxkLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFFBQVEsRUFDSix5SUFBbUk7cUJBQ3hJLENBQUM7cURBSzBCLHdCQUFpQjttQkFKdkMsU0FBUyxDQU1kO2dCQU9ELElBQU0sU0FBUztvQkFPYixtQkFBbUIsS0FBd0I7d0JBQXhCLFVBQUssR0FBTCxLQUFLLENBQW1CO29CQUFHLENBQUM7b0JBQy9DLHVCQUFHLEdBQUgsVUFBSSxFQUFVLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFTLEVBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsZ0JBQUM7Z0JBQUQsQ0FBQyxBQVRELElBU0M7Z0JBUEM7b0JBREMsbUJBQVksQ0FBQyxrQkFBVyxDQUFDOzhDQUNyQixrQkFBVztzREFBTTtnQkFHdEI7b0JBREMsWUFBSyxFQUFFOzhDQUNFLGtCQUFXOzJEQUFNO2dCQUx2QixTQUFTO29CQUxkLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFFBQVEsRUFDSiwwSkFBb0o7cUJBQ3pKLENBQUM7cURBUTBCLHdCQUFpQjttQkFQdkMsU0FBUyxDQVNkO2dCQUVELElBQUksR0FBK0IsQ0FBQztnQkFDcEMsSUFBSSxRQUFrQixDQUFDO2dCQUN2QixJQUFJLFNBQW9CLENBQUM7Z0JBQ3pCLElBQUksU0FBb0IsQ0FBQztnQkFFekIsVUFBVSxDQUFDO29CQUNULEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ1QsR0FBRyxHQUFHLGlCQUFPO3lCQUNGLHNCQUFzQixDQUNuQixFQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFDLENBQUM7eUJBQ3BFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDakMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNwRixTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3RGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtvQkFDeEQsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsaUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQ2YsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFFM0UsR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDVCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FDZixDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsNEdBQTRHLEVBQzVHO29CQUNFLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ1QsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDeEIsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekIsaUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO2dCQUVOLEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtvQkFDL0UsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFFVCxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNoQyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDaEUsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO29CQUNqRixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNULFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBRS9CLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFFNUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDVCxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUVoQyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUVsRCxHQUFHLEdBQUcsRUFBRSxDQUFDO29CQUNULFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBRS9CLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO2dCQUU3RCxJQUFNLElBQUk7b0JBRFY7d0JBRUUsZ0JBQVcsR0FBRyxNQUFNLENBQUM7b0JBQ3ZCLENBQUM7b0JBQUQsV0FBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxJQUFJO29CQURULGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsK0NBQTZDLEVBQUMsQ0FBQzttQkFDL0QsSUFBSSxDQUVUO2dCQUdELElBQU0sT0FBTztvQkFEYjt3QkFHRSxhQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNsQixDQUFDO29CQUFELGNBQUM7Z0JBQUQsQ0FBQyxBQUhELElBR0M7Z0JBREM7b0JBREMsa0JBQVcsQ0FBQyxXQUFXLENBQUM7O3lEQUNUO2dCQUZaLE9BQU87b0JBRFosZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQzttQkFDN0IsT0FBTyxDQUdaO2dCQUVELElBQU0sR0FBRyxHQUNMLGlCQUFPO3FCQUNGLGlCQUFpQixDQUFDO29CQUNqQixTQUFTLEVBQ0wsQ0FBQyxFQUFDLE9BQU8sRUFBRSwrQ0FBcUIsRUFBRSxXQUFXLEVBQUUsZ0NBQXdCLEVBQUMsQ0FBQztpQkFDOUUsQ0FBQztxQkFDRCxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO3FCQUN2RCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRS9CLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFFcEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGlCQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQsaUJBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUEvNUNELG9CQSs1Q0M7QUFHRCxJQUFNLFNBQVM7SUFEZjtRQUVFLFFBQUcsR0FBYSxFQUFFLENBQUM7UUFDbkIsaUJBQVksR0FBVSxFQUFFLENBQUM7SUFnQjNCLENBQUM7SUFkQyxzQ0FBa0IsR0FBbEIsVUFBbUIsRUFBTyxFQUFFLFFBQWdCLEVBQUUsU0FBYztRQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBSSxRQUFRLFNBQUksU0FBVyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELDJCQUFPLEdBQVAsVUFBUSxJQUFTLEVBQUUsS0FBYTtRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFLLEtBQUssT0FBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELHlCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFsQkQsSUFrQkM7QUFsQkssU0FBUztJQURkLGlCQUFVLEVBQUU7R0FDUCxTQUFTLENBa0JkO0FBRUQ7SUFDRSwyQkFBbUIsYUFBcUIsRUFBUyxNQUFjO1FBQTVDLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7SUFDckUsd0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVELCtCQUErQixlQUFpQyxFQUFFLEdBQWM7SUFDOUUsRUFBRSxDQUFDLENBQU8sZUFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUNLLGVBQWdCLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBQ2xELElBQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQztJQUMxRCxlQUFlLENBQUMsY0FBYyxHQUFHO1FBQy9CLElBQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0QsRUFBRSxDQUFDLENBQU8sUUFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDSyxRQUFTLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQzNDLElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDN0MsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN2QyxRQUFRLENBQUMsV0FBVyxHQUFHLFVBQVMsRUFBTyxFQUFFLElBQVksRUFBRSxLQUFVO1lBQy9ELEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDO1FBQ0YsUUFBUSxDQUFDLFFBQVEsR0FBRyxVQUFTLElBQVMsRUFBRSxLQUFhO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQixDQUFDO1lBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUdELElBQU0sWUFBWTtJQURsQjtRQUVFLFlBQU8sR0FBd0IsRUFBRSxDQUFDO0lBWXBDLENBQUM7SUFWQywwQkFBRyxHQUFILFVBQUksYUFBcUIsRUFBRSxNQUFjO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELDRCQUFLLEdBQUwsY0FBVSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUIsNkJBQU0sR0FBTixVQUFPLE9BQWlCO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDO2FBQ3RFLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFHLEtBQUssQ0FBQyxhQUFhLFNBQUksS0FBSyxDQUFDLE1BQVEsRUFBeEMsQ0FBd0MsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYkssWUFBWTtJQURqQixpQkFBVSxFQUFFO0dBQ1AsWUFBWSxDQWFqQjtBQUlELElBQU0sWUFBWTtJQURsQjtRQUVFLFVBQUssR0FBVyxDQUFDLENBQUM7SUFFcEIsQ0FBQztJQURDLGdDQUFTLEdBQVQsVUFBVSxLQUFVLElBQUksTUFBTSxDQUFJLEtBQUssZUFBVSxJQUFJLENBQUMsS0FBSyxFQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLG1CQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFISyxZQUFZO0lBRGpCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQztHQUN2QixZQUFZLENBR2pCO0FBR0QsSUFBTSxrQkFBa0I7SUFEeEI7UUFFRSxVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBRXBCLENBQUM7SUFEQyxzQ0FBUyxHQUFULFVBQVUsS0FBVSxJQUFJLE1BQU0sQ0FBSSxLQUFLLGVBQVUsSUFBSSxDQUFDLEtBQUssRUFBSyxDQUFDLENBQUMsQ0FBQztJQUNyRSx5QkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSEssa0JBQWtCO0lBRHZCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUM7R0FDMUMsa0JBQWtCLENBR3ZCO0FBR0QsSUFBTSxpQkFBaUI7SUFDckIsMkJBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO0lBQUcsQ0FBQztJQUVsRCx1Q0FBVyxHQUFYLGNBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RSxxQ0FBUyxHQUFULFVBQVUsS0FBVSxJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLHdCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOSyxpQkFBaUI7SUFEdEIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFDLENBQUM7cUNBRUUsWUFBWTtHQUQxQyxpQkFBaUIsQ0FNdEI7QUFHRCxJQUFNLFlBQVk7SUFBbEI7SUFFQSxDQUFDO0lBREMsZ0NBQVMsR0FBVCxVQUFVLEtBQVUsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6QyxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssWUFBWTtJQURqQixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUM7R0FDdkIsWUFBWSxDQUVqQjtBQUdELElBQU0sV0FBVztJQUFqQjtJQUVBLENBQUM7SUFEQywrQkFBUyxHQUFULFVBQVUsS0FBVSxJQUFJLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsa0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFdBQVc7SUFEaEIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBQyxDQUFDO0dBQ3RCLFdBQVcsQ0FFaEI7QUFHRCxJQUFNLFlBQVk7SUFBbEI7SUFJQSxDQUFDO0lBSEMsZ0NBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFTLEVBQUUsSUFBUyxFQUFFLElBQWdCO1FBQWhCLHFCQUFBLEVBQUEsZ0JBQWdCO1FBQzFELE1BQU0sQ0FBSSxLQUFLLFNBQUksSUFBSSxTQUFJLElBQUksU0FBSSxJQUFNLENBQUM7SUFDNUMsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKSyxZQUFZO0lBRGpCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQztHQUN2QixZQUFZLENBSWpCO0FBR0QsSUFBTSxhQUFhO0lBQW5CO0lBSUEsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKSyxhQUFhO0lBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztHQUMvQyxhQUFhLENBSWxCO0FBR0QsSUFBTSxnQkFBZ0I7SUFBdEI7SUFDQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGdCQUFnQjtJQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7R0FDaEQsZ0JBQWdCLENBQ3JCO0FBT0QsSUFBTSxXQUFXO0lBR2YscUJBQW1CLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO0lBQUcsQ0FBQztJQUUzRCwwQkFBSSxHQUFKLGNBQVEsQ0FBQztJQUNYLGtCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFMVTtJQUFSLFlBQUssRUFBRTs7MENBQW1CO0FBRHZCLFdBQVc7SUFMaEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxlQUFlO1FBQ3pCLFFBQVEsRUFBRSx3REFBd0Q7UUFDbEUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQztLQUMxQixDQUFDO3FDQUlzQyx3QkFBaUI7R0FIbkQsV0FBVyxDQU1oQjtBQUdELElBQU0sZUFBZTtJQUNuQix5QkFBbUIsaUJBQW9DO1FBQXBDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7SUFBRyxDQUFDO0lBQzdELHNCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxlQUFlO0lBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGlDQUFpQyxFQUFDLENBQUM7cUNBRWpELHdCQUFpQjtHQURuRCxlQUFlLENBRXBCO0FBUUQsSUFBTSxRQUFRO0lBU1osa0JBQW1CLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBUGhELGdCQUFXLEdBQVEsQ0FBQyxDQUFDO0lBTzhCLENBQUM7SUFMM0Qsc0JBQUkscUNBQWU7YUFBbkI7WUFDRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7OztPQUFBO0lBSUQsdUJBQUksR0FBSixjQUFRLENBQUM7SUFDWCxlQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFYVTtJQUFSLFlBQUssRUFBRTs7dUNBQW1CO0FBRHZCLFFBQVE7SUFOYixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFVBQVU7UUFDcEIsUUFBUSxFQUFFLDJFQUEyRTtRQUNyRixJQUFJLEVBQUUsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDO1FBQzNCLGVBQWUsRUFBRSw4QkFBdUIsQ0FBQyxNQUFNO0tBQ2hELENBQUM7cUNBVXNDLHdCQUFpQjtHQVRuRCxRQUFRLENBWWI7QUFHRCxJQUFNLGdCQUFnQjtJQUR0QjtRQUVtQixZQUFPLEdBQUcsSUFBSSxtQkFBWSxFQUFVLENBQUM7SUFDeEQsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFEa0I7SUFBaEIsYUFBTSxDQUFDLE9BQU8sQ0FBQzs7aURBQXNDO0FBRGxELGdCQUFnQjtJQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFDLENBQUM7R0FDdEMsZ0JBQWdCLENBRXJCO0FBR0QsSUFBTSxNQUFNO0lBQ1YsZ0JBQW9CLGNBQWdDLEVBQVUsWUFBaUM7UUFBM0UsbUJBQWMsR0FBZCxjQUFjLENBQWtCO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQXFCO0lBQy9GLENBQUM7SUFFRCxtQ0FBa0IsR0FBbEIsY0FBNEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLGFBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxLLE1BQU07SUFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBQyxDQUFDO3FDQUVJLHVCQUFnQixFQUF3QixrQkFBVztHQURuRixNQUFNLENBS1g7QUFHRCxJQUFNLGFBQWE7SUFZakIsdUJBQW1CLEdBQWlCO1FBQWpCLFFBQUcsR0FBSCxHQUFHLENBQWM7UUFOcEMsaUJBQVksR0FBeUIsSUFBSSxtQkFBWSxFQUFVLENBQUM7SUFNekIsQ0FBQztJQUV4QywrQkFBTyxHQUFQLFVBQVEsS0FBVSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUzQyxpQ0FBUyxHQUFULGNBQWMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckQsZ0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFRCxtQ0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQztJQUVELDBDQUFrQixHQUFsQjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRUQsNkNBQXFCLEdBQXJCO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFRCx1Q0FBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFRCwwQ0FBa0IsR0FBbEI7UUFDRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixDQUFDO0lBQ0gsQ0FBQztJQUVELG1DQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBbkVELElBbUVDO0FBakVVO0lBQVIsWUFBSyxFQUFFOzt3Q0FBUTtBQUNQO0lBQVIsWUFBSyxFQUFFOzt3Q0FBUTtBQUtRO0lBQXZCLFlBQUssQ0FBQyxlQUFlLENBQUM7OzJDQUFjO0FBRTVCO0lBQVIsWUFBSyxFQUFFOzs4Q0FBaUI7QUFWckIsYUFBYTtJQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQztxQ0FhMUMsWUFBWTtHQVpoQyxhQUFhLENBbUVsQjtBQUdELElBQU0sdUJBQXVCO0lBRTNCLGlDQUFtQixHQUFpQjtRQUFqQixRQUFHLEdBQUgsR0FBRyxDQUFjO1FBRHBDLFNBQUksR0FBRyxZQUFZLENBQUM7SUFDbUIsQ0FBQztJQUV4Qyw2Q0FBVyxHQUFYLGNBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELDhCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMSyx1QkFBdUI7SUFENUIsaUJBQVUsRUFBRTtxQ0FHYSxZQUFZO0dBRmhDLHVCQUF1QixDQUs1QjtBQUdELElBQU0sa0JBQWtCO0lBRHhCO1FBRXFCLFlBQU8sR0FBRyxJQUFJLG1CQUFZLENBQVMsS0FBSyxDQUFDLENBQUM7SUFHL0QsQ0FBQztJQURDLHdDQUFXLEdBQVgsY0FBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELHlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFIb0I7SUFBbEIsYUFBTSxDQUFDLFNBQVMsQ0FBQzs7bURBQTJDO0FBRHpELGtCQUFrQjtJQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFDLENBQUM7R0FDeEMsa0JBQWtCLENBSXZCO0FBR0QsSUFBTSxvQkFBb0I7SUFTeEIsOEJBQW1CLEdBQWlCO1FBQWpCLFFBQUcsR0FBSCxHQUFHLENBQWM7SUFBRyxDQUFDO0lBTHhDLHNCQUFJLHNDQUFJO2FBQVIsVUFBUyxLQUFhO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQzs7O09BQUE7SUFHSCwyQkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBTkM7SUFEQyxZQUFLLENBQUMsYUFBYSxDQUFDOzs7Z0RBSXBCO0FBUEcsb0JBQW9CO0lBRHpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLENBQUM7cUNBVWIsWUFBWTtHQVRoQyxvQkFBb0IsQ0FVekI7QUFHRCxJQUFNLG9CQUFvQjtJQVN4Qiw4QkFBbUIsR0FBaUIsRUFBRSxPQUE2QjtRQUFoRCxRQUFHLEdBQUgsR0FBRyxDQUFjO0lBQWtDLENBQUM7SUFMdkUsc0JBQUksc0NBQUk7YUFBUixVQUFTLEtBQWE7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDOzs7T0FBQTtJQUdILDJCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFOQztJQURDLFlBQUssQ0FBQyxhQUFhLENBQUM7OztnREFJcEI7QUFQRyxvQkFBb0I7SUFEekIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQztxQ0FVYixZQUFZLEVBQVcsb0JBQW9CO0dBVC9ELG9CQUFvQixDQVV6QjtBQUdELElBQU0sb0JBQW9CO0lBU3hCLDhCQUFtQixHQUFpQixFQUFFLE9BQTZCO1FBQWhELFFBQUcsR0FBSCxHQUFHLENBQWM7SUFBa0MsQ0FBQztJQUx2RSxzQkFBSSxzQ0FBSTthQUFSLFVBQVMsS0FBYTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7OztPQUFBO0lBR0gsMkJBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQU5DO0lBREMsWUFBSyxDQUFDLGFBQWEsQ0FBQzs7O2dEQUlwQjtBQVBHLG9CQUFvQjtJQUR6QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxDQUFDO3FDQVViLFlBQVksRUFBVyxvQkFBb0I7R0FUL0Qsb0JBQW9CLENBVXpCO0FBRUQ7SUFDRSwyQkFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUFHLENBQUM7SUFDMUMsd0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUdELElBQU0sVUFBVTtJQUNkLG9CQUFZLFdBQTJDLEVBQUUsS0FBdUI7UUFDOUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxJQUFJLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpLLFVBQVU7SUFEZixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDO3FDQUVYLGtCQUFXLEVBQTRCLHVCQUFnQjtHQUQ1RSxVQUFVLENBSWY7QUFHRCxJQUFNLE1BQU07SUFEWjtRQUlFLFlBQU8sR0FBaUIsSUFBSSxDQUFDO0lBaUIvQixDQUFDO0lBZEMscUJBQUksR0FBSixVQUFLLElBQVksRUFBRSxPQUE0QjtRQUE1Qix3QkFBQSxFQUFBLGNBQTRCO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxzQkFBSyxHQUFMLFVBQU0sQ0FBTSxJQUFZLE1BQU0sQ0FBQyxTQUFPLENBQUcsQ0FBQyxDQUFDLENBQUM7SUFFNUMsNEJBQVcsR0FBWCxVQUFZLEdBQVEsSUFBUyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUUxQyx5QkFBUSxHQUFSO1FBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWxGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDdkMsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDO0FBcEJLLE1BQU07SUFEWCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7R0FDM0MsTUFBTSxDQW9CWDtBQUVEO0lBSUUsaUJBQW1CLEtBQWEsRUFBUyxRQUFvQjtRQUFwQix5QkFBQSxFQUFBLGVBQW9CO1FBQTFDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBSDdELG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLHVCQUFrQixHQUFXLENBQUMsQ0FBQztJQUVpQyxDQUFDO0lBRWpFLHNCQUFJLHlCQUFJO2FBQVI7WUFDRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQU9ELFVBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BUDlCO0lBRUQsc0JBQUksNEJBQU87YUFBWDtZQUNFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFJRCxVQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUpwQztJQU1ELDBCQUFRLEdBQVIsY0FBcUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRCxjQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQztBQUdELElBQU0sYUFBYTtJQURuQjtRQUVFLFVBQUssR0FBUSxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxhQUFhO0lBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztHQUMzQyxhQUFhLENBRWxCO0FBR0QsSUFBTSxRQUFRO0lBQWQ7SUFFQSxDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssUUFBUTtJQURiLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztHQUMzQyxRQUFRLENBRWI7QUFHRCxJQUFNLGtCQUFrQjtJQUF4QjtJQUlBLENBQUM7SUFEQyxzQkFBSSxpQ0FBQzthQUFMLGNBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9CLHlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKSyxrQkFBa0I7SUFEdkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO0dBQzNDLGtCQUFrQixDQUl2QjtBQUVEO0lBQUE7SUFFQSxDQUFDO0lBQUQsYUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBR0QsSUFBTSxZQUFZO0lBQVMsZ0NBQWM7SUFBekM7O0lBQ0EsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQURELENBQTJCLE1BQU0sR0FDaEM7QUFESyxZQUFZO0lBRGpCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztHQUMzQyxZQUFZLENBQ2pCO0FBR0QsSUFBTSxrQkFBa0I7SUFBUyxzQ0FBc0I7SUFBdkQ7O0lBQ0EsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQURELENBQWlDLE1BQU0sR0FDdEM7QUFESyxrQkFBa0I7SUFEdkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO0dBQzNDLGtCQUFrQixDQUN2QiJ9