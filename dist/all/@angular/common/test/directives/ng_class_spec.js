"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
function main() {
    describe('binding to CSS class list', function () {
        var fixture;
        function normalizeClassNames(classes) {
            return classes.trim().split(' ').sort().join(' ');
        }
        function detectChangesAndExpectClassName(classes) {
            fixture.detectChanges();
            var nonNormalizedClassName = fixture.debugElement.children[0].nativeElement.className;
            expect(normalizeClassNames(nonNormalizedClassName)).toEqual(normalizeClassNames(classes));
        }
        function getComponent() { return fixture.debugElement.componentInstance; }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
            });
        });
        it('should clean up when the directive is destroyed', testing_1.async(function () {
            fixture = createTestComponent('<div *ngFor="let item of items" [ngClass]="item"></div>');
            getComponent().items = [['0']];
            fixture.detectChanges();
            getComponent().items = [['1']];
            detectChangesAndExpectClassName('1');
        }));
        describe('expressions evaluating to objects', function () {
            it('should add classes specified in an object literal', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="{foo: true, bar: false}"></div>');
                detectChangesAndExpectClassName('foo');
            }));
            it('should add classes specified in an object literal without change in class names', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"{'foo-bar': true, 'fooBar': true}\"></div>");
                detectChangesAndExpectClassName('foo-bar fooBar');
            }));
            it('should add and remove classes based on changes in object literal values', testing_1.async(function () {
                fixture =
                    createTestComponent('<div [ngClass]="{foo: condition, bar: !condition}"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().condition = false;
                detectChangesAndExpectClassName('bar');
            }));
            it('should add and remove classes based on changes to the expression object', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                var objExpr = getComponent().objExpr;
                detectChangesAndExpectClassName('foo');
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('foo bar');
                objExpr['baz'] = true;
                detectChangesAndExpectClassName('foo bar baz');
                delete (objExpr['bar']);
                detectChangesAndExpectClassName('foo baz');
            }));
            it('should add and remove classes based on reference changes to the expression object', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().objExpr = { foo: true, bar: true };
                detectChangesAndExpectClassName('foo bar');
                getComponent().objExpr = { baz: true };
                detectChangesAndExpectClassName('baz');
            }));
            it('should remove active classes when expression evaluates to null', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().objExpr = null;
                detectChangesAndExpectClassName('');
                getComponent().objExpr = { 'foo': false, 'bar': true };
                detectChangesAndExpectClassName('bar');
            }));
            it('should allow multiple classes per expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                getComponent().objExpr = { 'bar baz': true, 'bar1 baz1': true };
                detectChangesAndExpectClassName('bar baz bar1 baz1');
                getComponent().objExpr = { 'bar baz': false, 'bar1 baz1': true };
                detectChangesAndExpectClassName('bar1 baz1');
            }));
            it('should split by one or more spaces between classes', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
                getComponent().objExpr = { 'foo bar     baz': true };
                detectChangesAndExpectClassName('foo bar baz');
            }));
        });
        describe('expressions evaluating to lists', function () {
            it('should add classes specified in a list literal', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"['foo', 'bar', 'foo-bar', 'fooBar']\"></div>");
                detectChangesAndExpectClassName('foo bar foo-bar fooBar');
            }));
            it('should add and remove classes based on changes to the expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                var arrExpr = getComponent().arrExpr;
                detectChangesAndExpectClassName('foo');
                arrExpr.push('bar');
                detectChangesAndExpectClassName('foo bar');
                arrExpr[1] = 'baz';
                detectChangesAndExpectClassName('foo baz');
                getComponent().arrExpr = arrExpr.filter(function (v) { return v !== 'baz'; });
                detectChangesAndExpectClassName('foo');
            }));
            it('should add and remove classes when a reference changes', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().arrExpr = ['bar'];
                detectChangesAndExpectClassName('bar');
            }));
            it('should take initial classes into account when a reference changes', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().arrExpr = ['bar'];
                detectChangesAndExpectClassName('foo bar');
            }));
            it('should ignore empty or blank class names', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = ['', '  '];
                detectChangesAndExpectClassName('foo');
            }));
            it('should trim blanks from class names', testing_1.async(function () {
                fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = [' bar  '];
                detectChangesAndExpectClassName('foo bar');
            }));
            it('should allow multiple classes per item in arrays', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
                getComponent().arrExpr = ['foo bar baz', 'foo1 bar1   baz1'];
                detectChangesAndExpectClassName('foo bar baz foo1 bar1 baz1');
                getComponent().arrExpr = ['foo bar   baz foobar'];
                detectChangesAndExpectClassName('foo bar baz foobar');
            }));
            it('should throw with descriptive error message when CSS class is not a string', function () {
                fixture = createTestComponent("<div [ngClass]=\"['foo', {}]\"></div>");
                expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/NgClass can only toggle CSS classes expressed as strings, got \[object Object\]/);
            });
        });
        describe('expressions evaluating to sets', function () {
            it('should add and remove classes if the set instance changed', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="setExpr"></div>');
                var setExpr = new Set();
                setExpr.add('bar');
                getComponent().setExpr = setExpr;
                detectChangesAndExpectClassName('bar');
                setExpr = new Set();
                setExpr.add('baz');
                getComponent().setExpr = setExpr;
                detectChangesAndExpectClassName('baz');
            }));
        });
        describe('expressions evaluating to string', function () {
            it('should add classes specified in a string literal', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"'foo bar foo-bar fooBar'\"></div>");
                detectChangesAndExpectClassName('foo bar foo-bar fooBar');
            }));
            it('should add and remove classes based on changes to the expression', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="strExpr"></div>');
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = 'foo bar';
                detectChangesAndExpectClassName('foo bar');
                getComponent().strExpr = 'baz';
                detectChangesAndExpectClassName('baz');
            }));
            it('should remove active classes when switching from string to null', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"strExpr\"></div>");
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = null;
                detectChangesAndExpectClassName('');
            }));
            it('should take initial classes into account when switching from string to null', testing_1.async(function () {
                fixture = createTestComponent("<div class=\"foo\" [ngClass]=\"strExpr\"></div>");
                detectChangesAndExpectClassName('foo');
                getComponent().strExpr = null;
                detectChangesAndExpectClassName('foo');
            }));
            it('should ignore empty and blank strings', testing_1.async(function () {
                fixture = createTestComponent("<div class=\"foo\" [ngClass]=\"strExpr\"></div>");
                getComponent().strExpr = '';
                detectChangesAndExpectClassName('foo');
            }));
        });
        describe('cooperation with other class-changing constructs', function () {
            it('should co-operate with the class attribute', testing_1.async(function () {
                fixture = createTestComponent('<div [ngClass]="objExpr" class="init foo"></div>');
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo bar');
                objExpr['foo'] = false;
                detectChangesAndExpectClassName('init bar');
                getComponent().objExpr = null;
                detectChangesAndExpectClassName('init foo');
            }));
            it('should co-operate with the interpolated class attribute', testing_1.async(function () {
                fixture = createTestComponent("<div [ngClass]=\"objExpr\" class=\"{{'init foo'}}\"></div>");
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName("init foo bar");
                objExpr['foo'] = false;
                detectChangesAndExpectClassName("init bar");
                getComponent().objExpr = null;
                detectChangesAndExpectClassName("init foo");
            }));
            it('should co-operate with the class attribute and binding to it', testing_1.async(function () {
                fixture =
                    createTestComponent("<div [ngClass]=\"objExpr\" class=\"init\" [class]=\"'foo'\"></div>");
                var objExpr = getComponent().objExpr;
                objExpr['bar'] = true;
                detectChangesAndExpectClassName("init foo bar");
                objExpr['foo'] = false;
                detectChangesAndExpectClassName("init bar");
                getComponent().objExpr = null;
                detectChangesAndExpectClassName("init foo");
            }));
            it('should co-operate with the class attribute and class.name binding', testing_1.async(function () {
                var template = '<div class="init foo" [ngClass]="objExpr" [class.baz]="condition"></div>';
                fixture = createTestComponent(template);
                var objExpr = getComponent().objExpr;
                detectChangesAndExpectClassName('init foo baz');
                objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo baz bar');
                objExpr['foo'] = false;
                detectChangesAndExpectClassName('init baz bar');
                getComponent().condition = false;
                detectChangesAndExpectClassName('init bar');
            }));
            it('should co-operate with initial class and class attribute binding when binding changes', testing_1.async(function () {
                var template = '<div class="init" [ngClass]="objExpr" [class]="strExpr"></div>';
                fixture = createTestComponent(template);
                var cmp = getComponent();
                detectChangesAndExpectClassName('init foo');
                cmp.objExpr['bar'] = true;
                detectChangesAndExpectClassName('init foo bar');
                cmp.strExpr = 'baz';
                detectChangesAndExpectClassName('init bar baz foo');
                cmp.objExpr = null;
                detectChangesAndExpectClassName('init baz');
            }));
        });
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.condition = true;
        this.arrExpr = ['foo'];
        this.setExpr = new Set();
        this.objExpr = { 'foo': true, 'bar': false };
        this.strExpr = 'foo';
        this.setExpr.add('foo');
    }
    return TestComponent;
}());
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', template: '' }),
    __metadata("design:paramtypes", [])
], TestComponent);
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY2xhc3Nfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfY2xhc3Nfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF3QztBQUN4QyxpREFBdUU7QUFFdkU7SUFDRSxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsSUFBSSxPQUFtQyxDQUFDO1FBRXhDLDZCQUE2QixPQUFlO1lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQseUNBQXlDLE9BQWU7WUFDdEQsT0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzFCLElBQUksc0JBQXNCLEdBQUcsT0FBUyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztZQUN4RixNQUFNLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVGLENBQUM7UUFFRCwwQkFBeUMsTUFBTSxDQUFDLE9BQVMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRTNGLFNBQVMsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyQyxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVB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