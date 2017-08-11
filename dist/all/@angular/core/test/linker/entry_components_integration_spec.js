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
var component_factory_resolver_1 = require("@angular/core/src/linker/component_factory_resolver");
var testing_1 = require("@angular/core/testing");
var console_1 = require("../../src/console");
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
exports.main = main;
var DummyConsole = (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('@Component.entryComponents', function () {
        var console;
        beforeEach(function () {
            console = new DummyConsole();
            testing_1.TestBed.configureCompiler({ useJit: useJit, providers: [{ provide: console_1.Console, useValue: console }] });
            testing_1.TestBed.configureTestingModule({ declarations: [MainComp, ChildComp, NestedChildComp] });
        });
        it('should resolve ComponentFactories from the same component', function () {
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var mainComp = compFixture.componentInstance;
            expect(compFixture.componentRef.injector.get(core_1.ComponentFactoryResolver)).toBe(mainComp.cfr);
            var cf = mainComp.cfr.resolveComponentFactory(ChildComp);
            expect(cf.componentType).toBe(ChildComp);
        });
        it('should resolve ComponentFactories via ANALYZE_FOR_ENTRY_COMPONENTS', function () {
            testing_1.TestBed.resetTestingModule();
            testing_1.TestBed.configureTestingModule({ declarations: [CompWithAnalyzeEntryComponentsProvider, NestedChildComp, ChildComp] });
            var compFixture = testing_1.TestBed.createComponent(CompWithAnalyzeEntryComponentsProvider);
            var mainComp = compFixture.componentInstance;
            var cfr = compFixture.componentRef.injector.get(core_1.ComponentFactoryResolver);
            expect(cfr.resolveComponentFactory(ChildComp).componentType).toBe(ChildComp);
            expect(cfr.resolveComponentFactory(NestedChildComp).componentType).toBe(NestedChildComp);
        });
        it('should be able to get a component form a parent component (view hiearchy)', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<child></child>' } });
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var childCompEl = compFixture.debugElement.children[0];
            var childComp = childCompEl.componentInstance;
            // declared on ChildComp directly
            expect(childComp.cfr.resolveComponentFactory(NestedChildComp).componentType)
                .toBe(NestedChildComp);
            // inherited from MainComp
            expect(childComp.cfr.resolveComponentFactory(ChildComp).componentType).toBe(ChildComp);
        });
        it('should not be able to get components from a parent component (content hierarchy)', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<child><nested></nested></child>' } });
            testing_1.TestBed.overrideComponent(ChildComp, { set: { template: '<ng-content></ng-content>' } });
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var nestedChildCompEl = compFixture.debugElement.children[0].children[0];
            var nestedChildComp = nestedChildCompEl.componentInstance;
            expect(nestedChildComp.cfr.resolveComponentFactory(ChildComp).componentType)
                .toBe(ChildComp);
            expect(function () { return nestedChildComp.cfr.resolveComponentFactory(NestedChildComp); })
                .toThrow(component_factory_resolver_1.noComponentFactoryError(NestedChildComp));
        });
    });
}
var NestedChildComp = (function () {
    function NestedChildComp(cfr) {
        this.cfr = cfr;
    }
    return NestedChildComp;
}());
NestedChildComp = __decorate([
    core_1.Component({ selector: 'nested', template: '' }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
], NestedChildComp);
var ChildComp = (function () {
    function ChildComp(cfr) {
        this.cfr = cfr;
    }
    return ChildComp;
}());
ChildComp = __decorate([
    core_1.Component({ selector: 'child', entryComponents: [NestedChildComp], template: '' }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
], ChildComp);
var MainComp = (function () {
    function MainComp(cfr) {
        this.cfr = cfr;
    }
    return MainComp;
}());
MainComp = __decorate([
    core_1.Component({
        selector: 'main',
        entryComponents: [ChildComp],
        template: '',
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
], MainComp);
var CompWithAnalyzeEntryComponentsProvider = (function () {
    function CompWithAnalyzeEntryComponentsProvider() {
    }
    return CompWithAnalyzeEntryComponentsProvider;
}());
CompWithAnalyzeEntryComponentsProvider = __decorate([
    core_1.Component({
        selector: 'comp-with-analyze',
        template: '',
        providers: [{
                provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS,
                multi: true,
                useValue: [
                    { a: 'b', component: ChildComp },
                    { b: 'c', anotherComponent: NestedChildComp },
                ]
            }]
    })
], CompWithAnalyzeEntryComponentsProvider);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfY29tcG9uZW50c19pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9lbnRyeV9jb21wb25lbnRzX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBZ0c7QUFDaEcsa0dBQTRGO0FBQzVGLGlEQUE4QztBQUU5Qyw2Q0FBMEM7QUFHMUM7SUFDRSxRQUFRLENBQUMsS0FBSyxFQUFFLGNBQVEsWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxRQUFRLENBQUMsUUFBUSxFQUFFLGNBQVEsWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBSEQsb0JBR0M7QUFFRDtJQUFBO1FBQ1MsYUFBUSxHQUFhLEVBQUUsQ0FBQztJQUlqQyxDQUFDO0lBRkMsMEJBQUcsR0FBSCxVQUFJLE9BQWUsSUFBRyxDQUFDO0lBQ3ZCLDJCQUFJLEdBQUosVUFBSyxPQUFlLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELG1CQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFFRCxzQkFBc0IsRUFBMkI7UUFBMUIsa0JBQU07SUFDM0IsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLElBQUksT0FBcUIsQ0FBQztRQUMxQixVQUFVLENBQUM7WUFDVCxPQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUM3QixpQkFBTyxDQUFDLGlCQUFpQixDQUNyQixFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDMUUsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1lBQzlELElBQU0sV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELElBQU0sUUFBUSxHQUFhLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztZQUN6RCxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLCtCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNGLElBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFHLENBQUM7WUFDN0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsaUJBQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzdCLGlCQUFPLENBQUMsc0JBQXNCLENBQzFCLEVBQUMsWUFBWSxFQUFFLENBQUMsc0NBQXNDLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUMxRixJQUFNLFdBQVcsR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3BGLElBQU0sUUFBUSxHQUEyQyxXQUFXLENBQUMsaUJBQWlCLENBQUM7WUFDdkYsSUFBTSxHQUFHLEdBQ0wsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLCtCQUF3QixDQUFDLENBQUM7WUFDcEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkVBQTJFLEVBQUU7WUFDOUUsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFFMUUsSUFBTSxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBTSxTQUFTLEdBQWMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO1lBQzNELGlDQUFpQztZQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUcsQ0FBQyxhQUFhLENBQUM7aUJBQ3pFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzQiwwQkFBMEI7WUFDMUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtGQUFrRixFQUFFO1lBQ3JGLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLGtDQUFrQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzNGLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLDJCQUEyQixFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBRXJGLElBQU0sV0FBVyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELElBQU0saUJBQWlCLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQU0sZUFBZSxHQUFvQixpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztZQUM3RSxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUcsQ0FBQyxhQUFhLENBQUM7aUJBQ3pFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsY0FBTSxPQUFBLGVBQWUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsZUFBZSxDQUFDLEVBQTVELENBQTRELENBQUM7aUJBQ3JFLE9BQU8sQ0FBQyxvREFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBR0QsSUFBTSxlQUFlO0lBQ25CLHlCQUFtQixHQUE2QjtRQUE3QixRQUFHLEdBQUgsR0FBRyxDQUEwQjtJQUFHLENBQUM7SUFDdEQsc0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLGVBQWU7SUFEcEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO3FDQUVwQiwrQkFBd0I7R0FENUMsZUFBZSxDQUVwQjtBQUdELElBQU0sU0FBUztJQUNiLG1CQUFtQixHQUE2QjtRQUE3QixRQUFHLEdBQUgsR0FBRyxDQUEwQjtJQUFHLENBQUM7SUFDdEQsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFNBQVM7SUFEZCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7cUNBRXZELCtCQUF3QjtHQUQ1QyxTQUFTLENBRWQ7QUFPRCxJQUFNLFFBQVE7SUFDWixrQkFBbUIsR0FBNkI7UUFBN0IsUUFBRyxHQUFILEdBQUcsQ0FBMEI7SUFBRyxDQUFDO0lBQ3RELGVBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFFBQVE7SUFMYixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLE1BQU07UUFDaEIsZUFBZSxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQzVCLFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQztxQ0FFd0IsK0JBQXdCO0dBRDVDLFFBQVEsQ0FFYjtBQWNELElBQU0sc0NBQXNDO0lBQTVDO0lBQ0EsQ0FBQztJQUFELDZDQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxzQ0FBc0M7SUFaM0MsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsbUNBQTRCO2dCQUNyQyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUM7b0JBQzlCLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUM7aUJBQzVDO2FBQ0YsQ0FBQztLQUNILENBQUM7R0FDSSxzQ0FBc0MsQ0FDM0MifQ==