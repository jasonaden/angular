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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('ngPlural', function () {
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
                providers: [{ provide: common_1.NgLocalization, useClass: TestLocalization }],
                imports: [common_1.CommonModule]
            });
        });
        it('should display the template according to the exact value', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0"><li>you have no messages.</li></ng-template>' +
                '<ng-template ngPluralCase="=1"><li>you have one message.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        it('should display the template according to the exact numeric value', testing_1.async(function () {
            var template = '<div>' +
                '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="0"><li>you have no messages.</li></ng-template>' +
                '<ng-template ngPluralCase="1"><li>you have one message.</li></ng-template>' +
                '</ul></div>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        // https://github.com/angular/angular/issues/9868
        // https://github.com/angular/angular/issues/9882
        it('should not throw when ngPluralCase contains expressions', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0"><li>{{ switchValue }}</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            matchers_1.expect(function () { return fixture.detectChanges(); }).not.toThrow();
        }));
        it('should be applicable to <ng-container> elements', testing_1.async(function () {
            var template = '<ng-container [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0">you have no messages.</ng-template>' +
                '<ng-template ngPluralCase="=1">you have one message.</ng-template>' +
                '</ng-container>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        it('should display the template according to the category', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="many"><li>you have many messages.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 2;
            detectChangesAndExpectText('you have a few messages.');
            getComponent().switchValue = 8;
            detectChangesAndExpectText('you have many messages.');
        }));
        it('should default to other when no matches are found', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="other"><li>default message.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 100;
            detectChangesAndExpectText('default message.');
        }));
        it('should prioritize value matches over category matches', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="=2">you have two messages.</ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 2;
            detectChangesAndExpectText('you have two messages.');
            getComponent().switchValue = 3;
            detectChangesAndExpectText('you have a few messages.');
        }));
    });
}
exports.main = main;
var TestLocalization = (function (_super) {
    __extends(TestLocalization, _super);
    function TestLocalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestLocalization.prototype.getPluralCategory = function (value) {
        if (value > 1 && value < 4) {
            return 'few';
        }
        if (value >= 4 && value < 10) {
            return 'many';
        }
        return 'other';
    };
    return TestLocalization;
}(common_1.NgLocalization));
TestLocalization = __decorate([
    core_1.Injectable()
], TestLocalization);
var TestComponent = (function () {
    function TestComponent() {
        this.switchValue = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfcGx1cmFsX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX3BsdXJhbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDBDQUE2RDtBQUM3RCxzQ0FBb0Q7QUFDcEQsaURBQXVFO0FBQ3ZFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBSSxPQUE4QixDQUFDO1FBRW5DLDBCQUF5QyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUU1RSxvQ0FBdUMsSUFBWTtZQUNqRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxTQUFTLENBQUMsY0FBUSxPQUFPLEdBQUcsSUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBYyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO2dCQUNsRSxPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO2FBQ3hCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFLGVBQUssQ0FBQztZQUNoRSxJQUFNLFFBQVEsR0FBRywrQkFBK0I7Z0JBQzVDLDZFQUE2RTtnQkFDN0UsNkVBQTZFO2dCQUM3RSxPQUFPLENBQUM7WUFFWixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFB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