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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
// A service available to the Injector, used by the HelloCmp component.
var GreetingService = (function () {
    function GreetingService() {
        this.greeting = 'hello';
    }
    return GreetingService;
}());
GreetingService = __decorate([
    core_1.Injectable()
], GreetingService);
exports.GreetingService = GreetingService;
// Directives are light-weight. They don't allow new
// expression contexts (use @Component for those needs).
var RedDec = (function () {
    // ElementRef is always injectable and it wraps the element on which the
    // directive was found by the compiler.
    function RedDec(el, renderer) {
        renderer.setElementStyle(el.nativeElement, 'color', 'red');
    }
    return RedDec;
}());
RedDec = __decorate([
    core_1.Directive({ selector: '[red]' }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], RedDec);
exports.RedDec = RedDec;
// Angular supports 2 basic types of directives:
// - Component - the basic building blocks of Angular apps. Backed by
//   ShadowDom.(http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/)
// - Directive - add behavior to existing elements.
var HelloCmp = (function () {
    function HelloCmp(service) {
        this.greeting = service.greeting;
    }
    HelloCmp.prototype.changeGreeting = function () { this.greeting = 'howdy'; };
    return HelloCmp;
}());
HelloCmp = __decorate([
    core_1.Component({
        // The Selector prop tells Angular on which elements to instantiate this
        // class. The syntax supported is a basic subset of CSS selectors, for example
        // 'element', '[attr]', [attr=foo]', etc.
        selector: 'hello-app',
        // These are services that would be created if a class in the component's
        // template tries to inject them.
        viewProviders: [GreetingService],
        // Expressions in the template (like {{greeting}}) are evaluated in the
        // context of the HelloCmp class below.
        template: "<div class=\"greeting\">{{greeting}} <span red>world</span>!</div>\n           <button class=\"changeButton\" (click)=\"changeGreeting()\">change greeting</button>"
    }),
    __metadata("design:paramtypes", [GreetingService])
], HelloCmp);
exports.HelloCmp = HelloCmp;
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [HelloCmp, RedDec], bootstrap: [HelloCmp], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2hlbGxvX3dvcmxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQStGO0FBQy9GLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFFekU7SUFDRSxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsb0JBRUM7QUFFRCx1RUFBdUU7QUFFdkUsSUFBYSxlQUFlO0lBRDVCO1FBRUUsYUFBUSxHQUFXLE9BQU8sQ0FBQztJQUM3QixDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLGVBQWU7SUFEM0IsaUJBQVUsRUFBRTtHQUNBLGVBQWUsQ0FFM0I7QUFGWSwwQ0FBZTtBQUk1QixvREFBb0Q7QUFDcEQsd0RBQXdEO0FBRXhELElBQWEsTUFBTTtJQUNqQix3RUFBd0U7SUFDeEUsdUNBQXVDO0lBQ3ZDLGdCQUFZLEVBQWMsRUFBRSxRQUFrQjtRQUM1QyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSxNQUFNO0lBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7cUNBSWIsaUJBQVUsRUFBWSxlQUFRO0dBSG5DLE1BQU0sQ0FNbEI7QUFOWSx3QkFBTTtBQVFuQixnREFBZ0Q7QUFDaEQscUVBQXFFO0FBQ3JFLGdGQUFnRjtBQUNoRixtREFBbUQ7QUFlbkQsSUFBYSxRQUFRO0lBR25CLGtCQUFZLE9BQXdCO1FBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQUMsQ0FBQztJQUUzRSxpQ0FBYyxHQUFkLGNBQXlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxlQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSxRQUFRO0lBYnBCLGdCQUFTLENBQUM7UUFDVCx3RUFBd0U7UUFDeEUsOEVBQThFO1FBQzlFLHlDQUF5QztRQUN6QyxRQUFRLEVBQUUsV0FBVztRQUNyQix5RUFBeUU7UUFDekUsaUNBQWlDO1FBQ2pDLGFBQWEsRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUNoQyx1RUFBdUU7UUFDdkUsdUNBQXVDO1FBQ3ZDLFFBQVEsRUFBRSxxS0FDZ0Y7S0FDM0YsQ0FBQztxQ0FJcUIsZUFBZTtHQUh6QixRQUFRLENBTXBCO0FBTlksNEJBQVE7QUFTckIsSUFBTSxhQUFhO0lBQW5CO0lBQ0EsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxhQUFhO0lBRGxCLGVBQVEsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUMsQ0FBQztHQUN4RixhQUFhLENBQ2xCIn0=