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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('ngIf directive', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [common_1.CommonModule],
            });
        });
        it('should work in a template attribute', testing_1.async(function () {
            var template = '<span *ngIf="booleanCondition">hello</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
        }));
        it('should work on a template element', testing_1.async(function () {
            var template = '<ng-template [ngIf]="booleanCondition">hello2</ng-template>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('hello2');
        }));
        it('should toggle node when condition changes', testing_1.async(function () {
            var template = '<span *ngIf="booleanCondition">hello</span>';
            fixture = createTestComponent(template);
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().booleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should handle nested if correctly', testing_1.async(function () {
            var template = '<div *ngIf="booleanCondition"><span *ngIf="nestedBooleanCondition">hello</span></div>';
            fixture = createTestComponent(template);
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().booleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().nestedBooleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().nestedBooleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should update several nodes with if', testing_1.async(function () {
            var template = '<span *ngIf="numberCondition + 1 >= 2">helloNumber</span>' +
                '<span *ngIf="stringCondition == \'foo\'">helloString</span>' +
                '<span *ngIf="functionCondition(stringCondition, numberCondition)">helloFunction</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(3);
            matchers_1.expect(dom_adapter_1.getDOM().getText(fixture.nativeElement))
                .toEqual('helloNumberhelloStringhelloFunction');
            getComponent().numberCondition = 0;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('helloString');
            getComponent().numberCondition = 1;
            getComponent().stringCondition = 'bar';
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('helloNumber');
        }));
        it('should not add the element twice if the condition goes from truthy to truthy', testing_1.async(function () {
            var template = '<span *ngIf="numberCondition">hello</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            var els = fixture.debugElement.queryAll(by_1.By.css('span'));
            matchers_1.expect(els.length).toEqual(1);
            dom_adapter_1.getDOM().addClass(els[0].nativeElement, 'marker');
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().numberCondition = 2;
            fixture.detectChanges();
            els = fixture.debugElement.queryAll(by_1.By.css('span'));
            matchers_1.expect(els.length).toEqual(1);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(els[0].nativeElement, 'marker')).toBe(true);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
        }));
        describe('else', function () {
            it('should support else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else elseBlock">TRUE</span>' +
                    '<ng-template #elseBlock>FALSE</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('TRUE');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE');
            }));
            it('should support then and else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; then thenBlock; else elseBlock">IGNORE</span>' +
                    '<ng-template #thenBlock>THEN</ng-template>' +
                    '<ng-template #elseBlock>ELSE</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('THEN');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('ELSE');
            }));
            it('should support dynamic else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else nestedBooleanCondition ? b1 : b2">TRUE</span>' +
                    '<ng-template #b1>FALSE1</ng-template>' +
                    '<ng-template #b2>FALSE2</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('TRUE');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE1');
                getComponent().nestedBooleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE2');
            }));
            it('should support binding to variable using let', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else elseBlock; let v">{{v}}</span>' +
                    '<ng-template #elseBlock let-v>{{v}}</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('false');
            }));
            it('should support binding to variable using as', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition as v; else elseBlock">{{v}}</span>' +
                    '<ng-template #elseBlock let-v>{{v}}</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('false');
            }));
        });
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.booleanCondition = true;
        this.nestedBooleanCondition = true;
        this.numberCondition = 1;
        this.stringCondition = 'foo';
        this.functionCondition = function (s, n) { return s == 'foo' && n == 1; };
    }
    return TestComponent;
}());
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', template: '' })
], TestComponent);
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfaWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfaWZfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBd0M7QUFDeEMsaURBQXVFO0FBQ3ZFLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLElBQUksT0FBOEIsQ0FBQztRQUVuQywwQkFBeUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFNUUsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQzthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxlQUFLLENBQUM7WUFDM0MsSUFBTSxRQUFRLEdBQUcsNkNBQTZDLENBQUM7WUFDL0QsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixpQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FB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