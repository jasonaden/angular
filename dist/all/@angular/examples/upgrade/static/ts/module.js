"use strict";
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
// #docregion Angular Stuff
// #docregion ng2-heroes
// This Angular component will be "downgraded" to be used in AngularJS
var Ng2HeroesComponent = (function () {
    function Ng2HeroesComponent() {
        this.addHero = new core_1.EventEmitter();
        this.removeHero = new core_1.EventEmitter();
    }
    return Ng2HeroesComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], Ng2HeroesComponent.prototype, "heroes", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Ng2HeroesComponent.prototype, "addHero", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Ng2HeroesComponent.prototype, "removeHero", void 0);
Ng2HeroesComponent = __decorate([
    core_1.Component({
        selector: 'ng2-heroes',
        // This template uses the upgraded `ng1-hero` component
        // Note that because its element is compiled by Angular we must use camelCased attribute names
        template: "<header><ng-content selector=\"h1\"></ng-content></header>\n             <ng-content selector=\".extra\"></ng-content>\n             <div *ngFor=\"let hero of heroes\">\n               <ng1-hero [hero]=\"hero\" (onRemove)=\"removeHero.emit(hero)\"><strong>Super Hero</strong></ng1-hero>\n             </div>\n             <button (click)=\"addHero.emit()\">Add Hero</button>",
    })
], Ng2HeroesComponent);
// #enddocregion
// #docregion ng2-heroes-service
// This Angular service will be "downgraded" to be used in AngularJS
var HeroesService = (function () {
    // #docregion use-ng1-upgraded-service
    function HeroesService(titleCase) {
        this.heroes = [
            { name: 'superman', description: 'The man of steel' },
            { name: 'wonder woman', description: 'Princess of the Amazons' },
            { name: 'thor', description: 'The hammer-wielding god' }
        ];
        // Change all the hero names to title case, using the "upgraded" AngularJS service
        this.heroes.forEach(function (hero) { return hero.name = titleCase(hero.name); });
    }
    // #enddocregion
    HeroesService.prototype.addHero = function () {
        this.heroes =
            this.heroes.concat([{ name: 'Kamala Khan', description: 'Epic shape-shifting healer' }]);
    };
    HeroesService.prototype.removeHero = function (hero) { this.heroes = this.heroes.filter(function (item) { return item !== hero; }); };
    return HeroesService;
}());
HeroesService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject('titleCase')),
    __metadata("design:paramtypes", [Function])
], HeroesService);
// #enddocregion
// #docregion ng1-hero-wrapper
// This Angular directive will act as an interface to the "upgraded" AngularJS component
var Ng1HeroComponentWrapper = (function (_super) {
    __extends(Ng1HeroComponentWrapper, _super);
    function Ng1HeroComponentWrapper(elementRef, injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        return _super.call(this, 'ng1Hero', elementRef, injector) || this;
    }
    // For this class to work when compiled with AoT, we must implement these lifecycle hooks
    // because the AoT compiler will not realise that the super class implements them
    Ng1HeroComponentWrapper.prototype.ngOnInit = function () { _super.prototype.ngOnInit.call(this); };
    Ng1HeroComponentWrapper.prototype.ngOnChanges = function (changes) { _super.prototype.ngOnChanges.call(this, changes); };
    Ng1HeroComponentWrapper.prototype.ngDoCheck = function () { _super.prototype.ngDoCheck.call(this); };
    Ng1HeroComponentWrapper.prototype.ngOnDestroy = function () { _super.prototype.ngOnDestroy.call(this); };
    return Ng1HeroComponentWrapper;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], Ng1HeroComponentWrapper.prototype, "hero", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng1HeroComponentWrapper.prototype, "onRemove", void 0);
Ng1HeroComponentWrapper = __decorate([
    core_1.Directive({ selector: 'ng1-hero' }),
    __param(0, core_1.Inject(core_1.ElementRef)), __param(1, core_1.Inject(core_1.Injector)),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], Ng1HeroComponentWrapper);
// #enddocregion
// #docregion ng2-module
// This NgModule represents the Angular pieces of the application
var Ng2AppModule = (function () {
    function Ng2AppModule() {
    }
    Ng2AppModule.prototype.ngDoBootstrap = function () {
    };
    return Ng2AppModule;
}());
Ng2AppModule = __decorate([
    core_1.NgModule({
        declarations: [Ng2HeroesComponent, Ng1HeroComponentWrapper],
        providers: [
            HeroesService,
            // #docregion upgrade-ng1-service
            // Register an Angular provider whose value is the "upgraded" AngularJS service
            { provide: 'titleCase', useFactory: function (i) { return i.get('titleCase'); }, deps: ['$injector'] }
            // #enddocregion
        ],
        // All components that are to be "downgraded" must be declared as `entryComponents`
        entryComponents: [Ng2HeroesComponent],
        // We must import `UpgradeModule` to get access to the AngularJS core services
        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
    })
], Ng2AppModule);
var ng1AppModule = angular.module('ng1AppModule', []);
// #enddocregion
// #docregion ng1-hero
// This AngularJS component will be "upgraded" to be used in Angular
ng1AppModule.component('ng1Hero', {
    bindings: { hero: '<', onRemove: '&' },
    transclude: true,
    template: "<div class=\"title\" ng-transclude></div>\n             <h2>{{ $ctrl.hero.name }}</h2>\n             <p>{{ $ctrl.hero.description }}</p>\n             <button ng-click=\"$ctrl.onRemove()\">Remove</button>"
});
// #enddocregion
// #docregion ng1-title-case-service
// This AngularJS service will be "upgraded" to be used in Angular
ng1AppModule.factory('titleCase', function () { return function (value) { return value.replace(/((^|\s)[a-z])/g, function (_, c) { return c.toUpperCase(); }); }; });
// #enddocregion
// #docregion downgrade-ng2-heroes-service
// Register an AngularJS service, whose value is the "downgraded" Angular injectable.
ng1AppModule.factory('heroesService', static_1.downgradeInjectable(HeroesService));
// #enddocregion
// #docregion ng2-heroes-wrapper
// This is directive will act as the interface to the "downgraded"  Angular component
ng1AppModule.directive('ng2Heroes', static_1.downgradeComponent({ component: Ng2HeroesComponent }));
// #enddocregion
// #docregion example-app
// This is our top level application component
ng1AppModule.component('exampleApp', {
    // We inject the "downgraded" HeroesService into this AngularJS component
    // (We don't need the `HeroesService` type for AngularJS DI - it just helps with TypeScript
    // compilation)
    controller: [
        'heroesService', function (heroesService) { this.heroesService = heroesService; }
    ],
    // This template make use of the downgraded `ng2-heroes` component
    // Note that because its element is compiled by AngularJS we must use kebab-case attributes for
    // inputs and outputs
    template: "<link rel=\"stylesheet\" href=\"./styles.css\">\n             <ng2-heroes [heroes]=\"$ctrl.heroesService.heroes\" (add-hero)=\"$ctrl.heroesService.addHero()\" (remove-hero)=\"$ctrl.heroesService.removeHero($event)\">\n               <h1>Heroes</h1>\n               <p class=\"extra\">There are {{ $ctrl.heroesService.heroes.length }} heroes.</p>\n             </ng2-heroes>"
});
// #enddocregion
// #enddocregion
// #docregion bootstrap
// First we bootstrap the Angular HybridModule
// (We are using the dynamic browser platform as this example has not been compiled AoT)
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2AppModule).then(function (ref) {
    // Once Angular bootstrap is complete then we bootstrap the AngularJS module
    var upgrade = ref.injector.get(static_1.UpgradeModule);
    upgrade.bootstrap(document.body, [ng1AppModule.name]);
});
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvdXBncmFkZS9zdGF0aWMvdHMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILHNDQUEwTDtBQUMxTCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLGtEQUFpSDtBQU9qSCwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLHNFQUFzRTtBQVl0RSxJQUFNLGtCQUFrQjtJQVh4QjtRQWFZLFlBQU8sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUM3QixlQUFVLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFIVTtJQUFSLFlBQUssRUFBRTs7a0RBQWdCO0FBQ2Q7SUFBVCxhQUFNLEVBQUU7O21EQUE4QjtBQUM3QjtJQUFULGFBQU0sRUFBRTs7c0RBQWlDO0FBSHRDLGtCQUFrQjtJQVh2QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFlBQVk7UUFDdEIsdURBQXVEO1FBQ3ZELDhGQUE4RjtRQUM5RixRQUFRLEVBQUUsd1hBS29EO0tBQy9ELENBQUM7R0FDSSxrQkFBa0IsQ0FJdkI7QUFDRCxnQkFBZ0I7QUFFaEIsZ0NBQWdDO0FBQ2hDLG9FQUFvRTtBQUVwRSxJQUFNLGFBQWE7SUFPakIsc0NBQXNDO0lBQ3RDLHVCQUFpQyxTQUFnQztRQVBqRSxXQUFNLEdBQVc7WUFDZixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDO1lBQ25ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUseUJBQXlCLEVBQUM7WUFDOUQsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSx5QkFBeUIsRUFBQztTQUN2RCxD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