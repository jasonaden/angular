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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// #docregion NgTemplateOutlet
var NgTemplateOutletExample = (function () {
    function NgTemplateOutletExample() {
        this.myContext = { $implicit: 'World', localSk: 'Svet' };
    }
    return NgTemplateOutletExample;
}());
NgTemplateOutletExample = __decorate([
    core_1.Component({
        selector: 'ng-template-outlet-example',
        template: "\n    <ng-container *ngTemplateOutlet=\"greet\"></ng-container>\n    <hr>\n    <ng-container *ngTemplateOutlet=\"eng; context: myContext\"></ng-container>\n    <hr>\n    <ng-container *ngTemplateOutlet=\"svk; context: myContext\"></ng-container>\n    <hr>\n    \n    <ng-template #greet><span>Hello</span></ng-template>\n    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>\n    <ng-template #svk let-person=\"localSk\"><span>Ahoj {{person}}!</span></ng-template>\n"
    })
], NgTemplateOutletExample);
// #enddocregion
var ExampleApp = (function () {
    function ExampleApp() {
    }
    return ExampleApp;
}());
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "<ng-template-outlet-example></ng-template-outlet-example>"
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
        declarations: [ExampleApp, NgTemplateOutletExample],
        bootstrap: [ExampleApp]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nVGVtcGxhdGVPdXRsZXQvdHMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtGO0FBQ2xGLDhEQUF3RDtBQUl4RCw4QkFBOEI7QUFnQjlCLElBQU0sdUJBQXVCO0lBZjdCO1FBZ0JFLGNBQVMsR0FBRyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBQyxDQUFDO0lBQ3BELENBQUM7SUFBRCw4QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssdUJBQXVCO0lBZjVCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsNEJBQTRCO1FBQ3RDLFFBQVEsRUFBRSx3ZUFXWDtLQUNBLENBQUM7R0FDSSx1QkFBdUIsQ0FFNUI7QUFDRCxnQkFBZ0I7QUFPaEIsSUFBTSxVQUFVO0lBQWhCO0lBQ0EsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxVQUFVO0lBSmYsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRSwyREFBMkQ7S0FDdEUsQ0FBQztHQUNJLFVBQVUsQ0FDZjtBQU9ELElBQWEsU0FBUztJQUF0QjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksU0FBUztJQUxyQixlQUFRLENBQUM7UUFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1FBQ3hCLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSx1QkFBdUIsQ0FBQztRQUNuRCxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7S0FDeEIsQ0FBQztHQUNXLFNBQVMsQ0FDckI7QUFEWSw4QkFBUyJ9