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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_2 = require("../testing");
function main() {
    describe('MockDirectiveResolver', function () {
        var dirResolver;
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [SomeDirective, SomeOtherDirective, SomeComponent] });
        });
        beforeEach(testing_1.inject([core_1.Injector], function (injector) {
            dirResolver = new testing_2.MockDirectiveResolver(injector, new compiler_1.JitReflector());
        }));
        describe('Directive overriding', function () {
            it('should fallback to the default DirectiveResolver when templates are not overridden', function () {
                var ngModule = dirResolver.resolve(SomeComponent);
                expect(ngModule.selector).toEqual('cmp');
            });
            it('should allow overriding the @Directive', function () {
                dirResolver.setDirective(SomeComponent, new core_1.Component({ selector: 'someOtherSelector' }));
                var metadata = dirResolver.resolve(SomeComponent);
                expect(metadata.selector).toEqual('someOtherSelector');
            });
        });
        describe('View overriding', function () {
            it('should fallback to the default ViewResolver when templates are not overridden', function () {
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('template');
            });
            it('should allow overriding the @View', function () {
                dirResolver.setView(SomeComponent, new core_1.ɵViewMetadata({ template: 'overridden template' }));
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('overridden template');
            });
            it('should allow overriding a view after it has been resolved', function () {
                dirResolver.resolve(SomeComponent);
                dirResolver.setView(SomeComponent, new core_1.ɵViewMetadata({ template: 'overridden template' }));
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('overridden template');
            });
        });
        describe('inline template definition overriding', function () {
            it('should allow overriding the default template', function () {
                dirResolver.setInlineTemplate(SomeComponent, 'overridden template');
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('overridden template');
            });
            it('should allow overriding an overridden @View', function () {
                dirResolver.setView(SomeComponent, new core_1.ɵViewMetadata({ template: 'overridden template' }));
                dirResolver.setInlineTemplate(SomeComponent, 'overridden template x 2');
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('overridden template x 2');
            });
            it('should allow overriding a view after it has been resolved', function () {
                dirResolver.resolve(SomeComponent);
                dirResolver.setInlineTemplate(SomeComponent, 'overridden template');
                var view = dirResolver.resolve(SomeComponent);
                expect(view.template).toEqual('overridden template');
            });
        });
    });
}
exports.main = main;
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
SomeDirective = __decorate([
    core_1.Directive({ selector: 'some-directive' })
], SomeDirective);
var SomeComponent = (function () {
    function SomeComponent() {
    }
    return SomeComponent;
}());
SomeComponent = __decorate([
    core_1.Component({ selector: 'cmp', template: 'template' })
], SomeComponent);
var SomeOtherDirective = (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
}());
SomeOtherDirective = __decorate([
    core_1.Directive({ selector: 'some-other-directive' })
], SomeOtherDirective);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvZGlyZWN0aXZlX3Jlc29sdmVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDhDQUErQztBQUMvQyxzQ0FBNEY7QUFDNUYsaURBQXNEO0FBRXRELHNDQUFpRDtBQUVqRDtJQUNFLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxJQUFJLFdBQWtDLENBQUM7UUFFdkMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxlQUFRLENBQUMsRUFBRSxVQUFDLFFBQWtCO1lBQy9DLFdBQVcsR0FBRyxJQUFJLCtCQUFxQixDQUFDLFFBQVEsRUFBRSxJQUFJLHVCQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLG9GQUFvRixFQUNwRjtnQkFDRSxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsSUFBSSxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENB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