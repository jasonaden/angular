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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('NgSwitch', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function detectChangesAndExpectText(text) {
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText(text);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [common_1.CommonModule],
            });
        });
        describe('switch value changes', function () {
            it('should switch amongst when values', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a</li>' +
                    '<li *ngSwitchCase="\'b\'">when b</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b');
            });
            it('should switch amongst when values with fallback to default', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a</li>' +
                    '<li *ngSwitchDefault>when default</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when default');
                getComponent().switchValue = 'c';
                detectChangesAndExpectText('when default');
            });
            it('should support multiple whens with the same value', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a1;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b1;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a2;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b2;</li>' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a1;when a2;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b1;when b2;');
            });
        });
        describe('when values changes', function () {
            it('should switch amongst when values', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="when1">when 1;</li>' +
                    '<li *ngSwitchCase="when2">when 2;</li>' +
                    '<li *ngSwitchDefault>when default;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                getComponent().when1 = 'a';
                getComponent().when2 = 'b';
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when 1;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when 2;');
                getComponent().switchValue = 'c';
                detectChangesAndExpectText('when default;');
                getComponent().when1 = 'c';
                detectChangesAndExpectText('when 1;');
                getComponent().when1 = 'd';
                detectChangesAndExpectText('when default;');
            });
        });
        describe('corner cases', function () {
            it('should not create the default case if another case matches', function () {
                var log = [];
                var TestDirective = (function () {
                    function TestDirective(test) {
                        log.push(test);
                    }
                    return TestDirective;
                }());
                TestDirective = __decorate([
                    core_1.Directive({ selector: '[test]' }),
                    __param(0, core_1.Attribute('test')),
                    __metadata("design:paramtypes", [String])
                ], TestDirective);
                var template = '<div [ngSwitch]="switchValue">' +
                    '<div *ngSwitchCase="\'a\'" test="aCase"></div>' +
                    '<div *ngSwitchDefault test="defaultCase"></div>' +
                    '</div>';
                testing_1.TestBed.configureTestingModule({ declarations: [TestDirective] });
                testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
                    .createComponent(TestComponent);
                var fixture = testing_1.TestBed.createComponent(TestComponent);
                fixture.componentInstance.switchValue = 'a';
                fixture.detectChanges();
                matchers_1.expect(log).toEqual(['aCase']);
            });
            it('should create the default case if there is no other case', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
            });
            it('should allow defaults before cases', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a1;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b1;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a2;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a1;when a2;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b1;when b2;');
            });
        });
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
        this.switchValue = null;
        this.when1 = null;
        this.when2 = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfc3dpdGNoX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX3N3aXRjaF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUE4RDtBQUM5RCxpREFBZ0U7QUFDaEUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixJQUFJLE9BQThCLENBQUM7UUFFbkMsMEJBQXlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRTVFLG9DQUFvQyxJQUFZO1lBQzlDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixpQkFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVELFNBQVMsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2QyxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUM7YUFDeEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxJQUFNLFFBQVEsR0FBRywrQkFBK0I7b0JBQzVDLHVDQUF1QztvQkFDdkMsdUNBQXVDO29CQUN2QyxPQUFPLENBQUM7Z0JBRVosT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV4QywwQkFBMEIsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFL0IsWUFBWSxF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