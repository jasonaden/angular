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
function main() {
    describe('NgStyle', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function expectNativeEl(fixture) {
            return expect(fixture.debugElement.children[0].nativeElement);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent], imports: [common_1.CommonModule] });
        });
        it('should add styles specified in an object literal', testing_1.async(function () {
            var template = "<div [ngStyle]=\"{'max-width': '40px'}\"></div>";
            fixture = createTestComponent(template);
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
        }));
        it('should add and change styles specified in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            var expr = getComponent().expr;
            expr['max-width'] = '30%';
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '30%' });
        }));
        it('should add and remove styles specified using style.unit notation', testing_1.async(function () {
            var template = "<div [ngStyle]=\"{'max-width.px': expr}\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = '40';
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            getComponent().expr = null;
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
        }));
        it('should update styles using style.unit notation when unit changes', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width.px': '40' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            getComponent().expr = { 'max-width.em': '40' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40em' });
        }));
        // keyValueDiffer is sensitive to key order #9115
        it('should change styles specified in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = {
                // height, width order is important here
                height: '10px',
                width: '10px'
            };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'height': '10px', 'width': '10px' });
            getComponent().expr = {
                // width, height order is important here
                width: '5px',
                height: '5px',
            };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'height': '5px', 'width': '5px' });
        }));
        it('should remove styles when deleting a key in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
        }));
        it('should co-operate with the style attribute', testing_1.async(function () {
            var template = "<div style=\"font-size: 12px\" [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px', 'font-size': '12px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
            expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '12px' });
        }));
        it('should co-operate with the style.[styleName]="expr" special-case in the compiler', testing_1.async(function () {
            var template = "<div [style.font-size.px]=\"12\" [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px', 'font-size': '12px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
            expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '12px' });
        }));
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfc3R5bGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfc3R5bGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBd0M7QUFDeEMsaURBQXVFO0FBRXZFO0lBQ0UsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixJQUFJLE9BQThCLENBQUM7UUFFbkMsMEJBQXlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRTVFLHdCQUF3QixPQUE4QjtZQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFRCxTQUFTLENBQUMsY0FBUSxPQUFPLEdBQUcsSUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUUsZUFBSyxDQUFDO1lBQ3hELElBQU0sUUFBUSxHQUFHLGlEQUErQyxDQUFDO1lBQ2pFLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFF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