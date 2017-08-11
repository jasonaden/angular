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
    describe('ViewChild', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [ViewChildTypeSelectorComponent, ViewChildStringSelectorComponent, Simple],
                schemas: [core_1.NO_ERRORS_SCHEMA],
            });
        });
        it('should support type selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildTypeSelectorComponent, { set: { template: "<simple [marker]=\"'1'\"></simple><simple [marker]=\"'2'\"></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildTypeSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.child).toBeDefined();
            expect(view.componentInstance.child.marker).toBe('1');
        });
        it('should support string selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildStringSelectorComponent, { set: { template: "<simple #child></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildStringSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.child).toBeDefined();
        });
    });
    describe('ViewChildren', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [ViewChildrenTypeSelectorComponent, ViewChildrenStringSelectorComponent, Simple],
                schemas: [core_1.NO_ERRORS_SCHEMA],
            });
        });
        it('should support type selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildrenTypeSelectorComponent, { set: { template: "<simple></simple><simple></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildrenTypeSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.children).toBeDefined();
            expect(view.componentInstance.children.length).toBe(2);
        });
        it('should support string selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildrenStringSelectorComponent, { set: { template: "<simple #child1></simple><simple #child2></simple>" } });
            var view = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                .createComponent(ViewChildrenStringSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.children).toBeDefined();
            expect(view.componentInstance.children.length).toBe(2);
        });
    });
}
exports.main = main;
var Simple = (function () {
    function Simple() {
    }
    return Simple;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Simple.prototype, "marker", void 0);
Simple = __decorate([
    core_1.Directive({ selector: 'simple' })
], Simple);
var ViewChildTypeSelectorComponent = (function () {
    function ViewChildTypeSelectorComponent() {
    }
    return ViewChildTypeSelectorComponent;
}());
__decorate([
    core_1.ViewChild(Simple),
    __metadata("design:type", Simple)
], ViewChildTypeSelectorComponent.prototype, "child", void 0);
ViewChildTypeSelectorComponent = __decorate([
    core_1.Component({ selector: 'view-child-type-selector', template: '' })
], ViewChildTypeSelectorComponent);
var ViewChildStringSelectorComponent = (function () {
    function ViewChildStringSelectorComponent() {
    }
    return ViewChildStringSelectorComponent;
}());
__decorate([
    core_1.ViewChild('child'),
    __metadata("design:type", core_1.ElementRef)
], ViewChildStringSelectorComponent.prototype, "child", void 0);
ViewChildStringSelectorComponent = __decorate([
    core_1.Component({ selector: 'view-child-string-selector', template: '' })
], ViewChildStringSelectorComponent);
var ViewChildrenTypeSelectorComponent = (function () {
    function ViewChildrenTypeSelectorComponent() {
    }
    return ViewChildrenTypeSelectorComponent;
}());
__decorate([
    core_1.ViewChildren(Simple),
    __metadata("design:type", core_1.QueryList)
], ViewChildrenTypeSelectorComponent.prototype, "children", void 0);
ViewChildrenTypeSelectorComponent = __decorate([
    core_1.Component({ selector: 'view-children-type-selector', template: '' })
], ViewChildrenTypeSelectorComponent);
var ViewChildrenStringSelectorComponent = (function () {
    function ViewChildrenStringSelectorComponent() {
    }
    return ViewChildrenStringSelectorComponent;
}());
__decorate([
    core_1.ViewChildren('child1 , child2'),
    __metadata("design:type", core_1.QueryList)
], ViewChildrenStringSelectorComponent.prototype, "children", void 0);
ViewChildrenStringSelectorComponent = __decorate([
    core_1.Component({ selector: 'view-child-string-selector', template: '' })
], ViewChildrenStringSelectorComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9tZXRhZGF0YS9kaV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTRIO0FBQzVILGlEQUE4QztBQUU5QztJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxDQUFDO2dCQUN4RixPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQzthQUM1QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQiw4QkFBOEIsRUFDOUIsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsc0VBQWtFLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDM0YsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUVyRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIsZ0NBQWdDLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsMEJBQTBCLEVBQUMs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