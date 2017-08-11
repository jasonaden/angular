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
var ng_component_outlet_1 = require("@angular/common/src/directives/ng_component_outlet");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('insert/remove', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [TestModule] }); });
        it('should do nothing if component is null', testing_1.async(function () {
            var template = "<ng-template *ngComponentOutlet=\"currentComponent\"></ng-template>";
            testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.componentInstance.currentComponent = null;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should insert content specified by a component', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('foo');
        }));
        it('should emit a ComponentRef once a component was created', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.cmpRef = null;
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('foo');
            matchers_1.expect(fixture.componentInstance.cmpRef).toBeAnInstanceOf(core_1.ComponentRef);
            matchers_1.expect(fixture.componentInstance.cmpRef.instance).toBeAnInstanceOf(InjectedComponent);
        }));
        it('should clear view if component becomes null', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('foo');
            fixture.componentInstance.currentComponent = null;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should swap content if component changes', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('foo');
            fixture.componentInstance.currentComponent = InjectedComponentAgain;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('bar');
        }));
        it('should use the injector, if one supplied', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            var uniqueValue = {};
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.componentInstance.injector = core_1.Injector.create([{ provide: TEST_TOKEN, useValue: uniqueValue }], fixture.componentRef.injector);
            fixture.detectChanges();
            var cmpRef = fixture.componentInstance.cmpRef;
            matchers_1.expect(cmpRef).toBeAnInstanceOf(core_1.ComponentRef);
            matchers_1.expect(cmpRef.instance).toBeAnInstanceOf(InjectedComponent);
            matchers_1.expect(cmpRef.instance.testToken).toBe(uniqueValue);
        }));
        it('should resolve a with injector', testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.componentInstance.cmpRef = null;
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.detectChanges();
            var cmpRef = fixture.componentInstance.cmpRef;
            matchers_1.expect(cmpRef).toBeAnInstanceOf(core_1.ComponentRef);
            matchers_1.expect(cmpRef.instance).toBeAnInstanceOf(InjectedComponent);
            matchers_1.expect(cmpRef.instance.testToken).toBeNull();
        }));
        it('should render projectable nodes, if supplied', testing_1.async(function () {
            var template = "<ng-template>projected foo</ng-template>" + TEST_CMP_TEMPLATE;
            testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
                .configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] });
            testing_1.TestBed
                .overrideComponent(InjectedComponent, { set: { template: "<ng-content></ng-content>" } })
                .configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] });
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.currentComponent = InjectedComponent;
            fixture.componentInstance.projectables =
                [fixture.componentInstance.vcRef
                        .createEmbeddedView(fixture.componentInstance.tplRefs.first)
                        .rootNodes];
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('projected foo');
        }));
        it('should resolve components from other modules, if supplied', testing_1.async(function () {
            var compiler = testing_1.TestBed.get(core_1.Compiler);
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            fixture.componentInstance.module = compiler.compileModuleSync(TestModule2);
            fixture.componentInstance.currentComponent = Module2InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('baz');
        }));
        it('should clean up moduleRef, if supplied', testing_1.async(function () {
            var destroyed = false;
            var compiler = testing_1.TestBed.get(core_1.Compiler);
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.componentInstance.module = compiler.compileModuleSync(TestModule2);
            fixture.componentInstance.currentComponent = Module2InjectedComponent;
            fixture.detectChanges();
            var moduleRef = fixture.componentInstance.ngComponentOutlet['_moduleRef'];
            spyOn(moduleRef, 'destroy').and.callThrough();
            matchers_1.expect(moduleRef.destroy).not.toHaveBeenCalled();
            fixture.destroy();
            matchers_1.expect(moduleRef.destroy).toHaveBeenCalled();
        }));
        it('should not re-create moduleRef when it didn\'t actually change', testing_1.async(function () {
            var compiler = testing_1.TestBed.get(core_1.Compiler);
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.componentInstance.module = compiler.compileModuleSync(TestModule2);
            fixture.componentInstance.currentComponent = Module2InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('baz');
            var moduleRef = fixture.componentInstance.ngComponentOutlet['_moduleRef'];
            fixture.componentInstance.currentComponent = Module2InjectedComponent2;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('baz2');
            matchers_1.expect(moduleRef).toBe(fixture.componentInstance.ngComponentOutlet['_moduleRef']);
        }));
        it('should re-create moduleRef when changed', testing_1.async(function () {
            var compiler = testing_1.TestBed.get(core_1.Compiler);
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            fixture.componentInstance.module = compiler.compileModuleSync(TestModule2);
            fixture.componentInstance.currentComponent = Module2InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('baz');
            fixture.componentInstance.module = compiler.compileModuleSync(TestModule3);
            fixture.componentInstance.currentComponent = Module3InjectedComponent;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('bat');
        }));
    });
}
exports.main = main;
var TEST_TOKEN = new core_1.InjectionToken('TestToken');
var InjectedComponent = (function () {
    function InjectedComponent(testToken) {
        this.testToken = testToken;
    }
    return InjectedComponent;
}());
InjectedComponent = __decorate([
    core_1.Component({ selector: 'injected-component', template: 'foo' }),
    __param(0, core_1.Optional()), __param(0, core_1.Inject(TEST_TOKEN)),
    __metadata("design:paramtypes", [Object])
], InjectedComponent);
var InjectedComponentAgain = (function () {
    function InjectedComponentAgain() {
    }
    return InjectedComponentAgain;
}());
InjectedComponentAgain = __decorate([
    core_1.Component({ selector: 'injected-component-again', template: 'bar' })
], InjectedComponentAgain);
var TEST_CMP_TEMPLATE = "<ng-template *ngComponentOutlet=\"currentComponent; injector: injector; content: projectables; ngModuleFactory: module;\"></ng-template>";
var TestComponent = (function () {
    function TestComponent(vcRef) {
        this.vcRef = vcRef;
    }
    Object.defineProperty(TestComponent.prototype, "cmpRef", {
        get: function () { return this.ngComponentOutlet['_componentRef']; },
        set: function (value) { this.ngComponentOutlet['_componentRef'] = value; },
        enumerable: true,
        configurable: true
    });
    return TestComponent;
}());
__decorate([
    core_1.ViewChildren(core_1.TemplateRef),
    __metadata("design:type", core_1.QueryList)
], TestComponent.prototype, "tplRefs", void 0);
__decorate([
    core_1.ViewChild(ng_component_outlet_1.NgComponentOutlet),
    __metadata("design:type", ng_component_outlet_1.NgComponentOutlet)
], TestComponent.prototype, "ngComponentOutlet", void 0);
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', template: TEST_CMP_TEMPLATE }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef])
], TestComponent);
var TestModule = (function () {
    function TestModule() {
    }
    return TestModule;
}());
TestModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [TestComponent, InjectedComponent, InjectedComponentAgain],
        exports: [TestComponent, InjectedComponent, InjectedComponentAgain],
        entryComponents: [InjectedComponent, InjectedComponentAgain]
    })
], TestModule);
exports.TestModule = TestModule;
var Module2InjectedComponent = (function () {
    function Module2InjectedComponent() {
    }
    return Module2InjectedComponent;
}());
Module2InjectedComponent = __decorate([
    core_1.Component({ selector: 'module-2-injected-component', template: 'baz' })
], Module2InjectedComponent);
var Module2InjectedComponent2 = (function () {
    function Module2InjectedComponent2() {
    }
    return Module2InjectedComponent2;
}());
Module2InjectedComponent2 = __decorate([
    core_1.Component({ selector: 'module-2-injected-component-2', template: 'baz2' })
], Module2InjectedComponent2);
var TestModule2 = (function () {
    function TestModule2() {
    }
    return TestModule2;
}());
TestModule2 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [Module2InjectedComponent, Module2InjectedComponent2],
        exports: [Module2InjectedComponent, Module2InjectedComponent2],
        entryComponents: [Module2InjectedComponent, Module2InjectedComponent2]
    })
], TestModule2);
exports.TestModule2 = TestModule2;
var Module3InjectedComponent = (function () {
    function Module3InjectedComponent() {
    }
    return Module3InjectedComponent;
}());
Module3InjectedComponent = __decorate([
    core_1.Component({ selector: 'module-3-injected-component', template: 'bat' })
], Module3InjectedComponent);
var TestModule3 = (function () {
    function TestModule3() {
    }
    return TestModule3;
}());
TestModule3 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [Module3InjectedComponent],
        exports: [Module3InjectedComponent],
        entryComponents: [Module3InjectedComponent]
    })
], TestModule3);
exports.TestModule3 = TestModule3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29tcG9uZW50X291dGxldF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvZGlyZWN0aXZlcy9uZ19jb21wb25lbnRfb3V0bGV0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBNkM7QUFDN0MsMEZBQXFGO0FBQ3JGLHNDQUFrUDtBQUNsUCxpREFBZ0U7QUFDaEUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUV4QixVQUFVLENBQUMsY0FBUSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0UsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLGVBQUssQ0FBQztZQUM5QyxJQUFNLFFBQVEsR0FBRyxxRUFBbUUsQ0FBQztZQUNyRixpQkFBTyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDdEUsSUFBSSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFckQsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUNsRCxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsZ0RBQWdELEVBQUUsZUFBSyxDQUFDO1lBQ3RELElBQUksT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxD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