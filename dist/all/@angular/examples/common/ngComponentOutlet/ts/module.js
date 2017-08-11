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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// #docregion SimpleExample
var HelloWorld = (function () {
    function HelloWorld() {
    }
    return HelloWorld;
}());
HelloWorld = __decorate([
    core_1.Component({ selector: 'hello-world', template: 'Hello World!' })
], HelloWorld);
var NgTemplateOutletSimpleExample = (function () {
    function NgTemplateOutletSimpleExample() {
        // This field is necessary to expose HelloWorld to the template.
        this.HelloWorld = HelloWorld;
    }
    return NgTemplateOutletSimpleExample;
}());
NgTemplateOutletSimpleExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-simple-example',
        template: "<ng-container *ngComponentOutlet=\"HelloWorld\"></ng-container>"
    })
], NgTemplateOutletSimpleExample);
// #enddocregion
// #docregion CompleteExample
var Greeter = (function () {
    function Greeter() {
        this.suffix = '!';
    }
    return Greeter;
}());
Greeter = __decorate([
    core_1.Injectable()
], Greeter);
var CompleteComponent = (function () {
    function CompleteComponent(greeter) {
        this.greeter = greeter;
    }
    return CompleteComponent;
}());
CompleteComponent = __decorate([
    core_1.Component({
        selector: 'complete-component',
        template: "Complete: <ng-content></ng-content> <ng-content></ng-content>{{ greeter.suffix }}"
    }),
    __metadata("design:paramtypes", [Greeter])
], CompleteComponent);
var NgTemplateOutletCompleteExample = (function () {
    function NgTemplateOutletCompleteExample(injector) {
        // This field is necessary to expose CompleteComponent to the template.
        this.CompleteComponent = CompleteComponent;
        this.myContent = [[document.createTextNode('Ahoj')], [document.createTextNode('Svet')]];
        this.myInjector = core_1.ReflectiveInjector.resolveAndCreate([Greeter], injector);
    }
    return NgTemplateOutletCompleteExample;
}());
NgTemplateOutletCompleteExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-complete-example',
        template: "\n    <ng-container *ngComponentOutlet=\"CompleteComponent; \n                                      injector: myInjector; \n                                      content: myContent\"></ng-container>"
    }),
    __metadata("design:paramtypes", [core_1.Injector])
], NgTemplateOutletCompleteExample);
// #enddocregion
// #docregion NgModuleFactoryExample
var OtherModuleComponent = (function () {
    function OtherModuleComponent() {
    }
    return OtherModuleComponent;
}());
OtherModuleComponent = __decorate([
    core_1.Component({ selector: 'other-module-component', template: "Other Module Component!" })
], OtherModuleComponent);
var NgTemplateOutletOtherModuleExample = (function () {
    function NgTemplateOutletOtherModuleExample(compiler) {
        // This field is necessary to expose OtherModuleComponent to the template.
        this.OtherModuleComponent = OtherModuleComponent;
        this.myModule = compiler.compileModuleSync(OtherModule);
    }
    return NgTemplateOutletOtherModuleExample;
}());
NgTemplateOutletOtherModuleExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-other-module-example',
        template: "\n    <ng-container *ngComponentOutlet=\"OtherModuleComponent;\n                                      ngModuleFactory: myModule;\"></ng-container>"
    }),
    __metadata("design:paramtypes", [core_1.Compiler])
], NgTemplateOutletOtherModuleExample);
// #enddocregion
var ExampleApp = (function () {
    function ExampleApp() {
    }
    return ExampleApp;
}());
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "<ng-component-outlet-simple-example></ng-component-outlet-simple-example>\n             <hr/>\n             <ng-component-outlet-complete-example></ng-component-outlet-complete-example>\n             <hr/>\n             <ng-component-outlet-other-module-example></ng-component-outlet-other-module-example>"
    })
], ExampleApp);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [
            ExampleApp, NgTemplateOutletSimpleExample, NgTemplateOutletCompleteExample,
            NgTemplateOutletOtherModuleExample, HelloWorld, CompleteComponent
        ],
        entryComponents: [HelloWorld, CompleteComponent],
        bootstrap: [ExampleApp]
    })
], AppModule);
exports.AppModule = AppModule;
var OtherModule = (function () {
    function OtherModule() {
    }
    return OtherModule;
}());
OtherModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [OtherModuleComponent],
        entryComponents: [OtherModuleComponent]
    })
], OtherModule);
exports.OtherModule = OtherModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nQ29tcG9uZW50T3V0bGV0L3RzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBdUg7QUFDdkgsOERBQXdEO0FBSXhELDJCQUEyQjtBQUUzQixJQUFNLFVBQVU7SUFBaEI7SUFDQSxDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLFVBQVU7SUFEZixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUM7R0FDekQsVUFBVSxDQUNmO0FBTUQsSUFBTSw2QkFBNkI7SUFKbkM7UUFLRSxnRUFBZ0U7UUFDaEUsZUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMxQixDQUFDO0lBQUQsb0NBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhLLDZCQUE2QjtJQUpsQyxnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9DQUFvQztRQUM5QyxRQUFRLEVBQUUsaUVBQStEO0tBQzFFLENBQUM7R0FDSSw2QkFBNkIsQ0FHbEM7QUFDRCxnQkFBZ0I7QUFFaEIsNkJBQTZCO0FBRTdCLElBQU0sT0FBTztJQURiO1FBRUUsV0FBTSxHQUFHLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxPQUFPO0lBRFosaUJBQVUsRUFBRTtHQUNQLE9BQU8sQ0FFWjtBQU1ELElBQU0saUJBQWlCO0lBQ3JCLDJCQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQUN6Qyx3QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssaUJBQWlCO0lBSnRCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUs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