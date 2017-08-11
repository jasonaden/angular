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
var Subject_1 = require("rxjs/Subject");
// #docregion NgIfSimple
var NgIfSimple = (function () {
    function NgIfSimple() {
        this.show = true;
    }
    return NgIfSimple;
}());
NgIfSimple = __decorate([
    core_1.Component({
        selector: 'ng-if-simple',
        template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show\">Text to show</div>\n"
    })
], NgIfSimple);
// #enddocregion
// #docregion NgIfElse
var NgIfElse = (function () {
    function NgIfElse() {
        this.show = true;
    }
    return NgIfElse;
}());
NgIfElse = __decorate([
    core_1.Component({
        selector: 'ng-if-else',
        template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show; else elseBlock\">Text to show</div>\n    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>\n"
    })
], NgIfElse);
// #enddocregion
// #docregion NgIfThenElse
var NgIfThenElse = (function () {
    function NgIfThenElse() {
        this.thenBlock = null;
        this.show = true;
        this.primaryBlock = null;
        this.secondaryBlock = null;
    }
    NgIfThenElse.prototype.switchPrimary = function () {
        this.thenBlock = this.thenBlock === this.primaryBlock ? this.secondaryBlock : this.primaryBlock;
    };
    NgIfThenElse.prototype.ngOnInit = function () { this.thenBlock = this.primaryBlock; };
    return NgIfThenElse;
}());
__decorate([
    core_1.ViewChild('primaryBlock'),
    __metadata("design:type", core_1.TemplateRef)
], NgIfThenElse.prototype, "primaryBlock", void 0);
__decorate([
    core_1.ViewChild('secondaryBlock'),
    __metadata("design:type", core_1.TemplateRef)
], NgIfThenElse.prototype, "secondaryBlock", void 0);
NgIfThenElse = __decorate([
    core_1.Component({
        selector: 'ng-if-then-else',
        template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    <button (click)=\"switchPrimary()\">Switch Primary</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show; then thenBlock; else elseBlock\">this is ignored</div>\n    <ng-template #primaryBlock>Primary text to show</ng-template>\n    <ng-template #secondaryBlock>Secondary text to show</ng-template>\n    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>\n"
    })
], NgIfThenElse);
// #enddocregion
// #docregion NgIfAs
var NgIfAs = (function () {
    function NgIfAs() {
        this.userObservable = new Subject_1.Subject();
        this.first = ['John', 'Mike', 'Mary', 'Bob'];
        this.firstIndex = 0;
        this.last = ['Smith', 'Novotny', 'Angular'];
        this.lastIndex = 0;
    }
    NgIfAs.prototype.nextUser = function () {
        var first = this.first[this.firstIndex++];
        if (this.firstIndex >= this.first.length)
            this.firstIndex = 0;
        var last = this.last[this.lastIndex++];
        if (this.lastIndex >= this.last.length)
            this.lastIndex = 0;
        this.userObservable.next({ first: first, last: last });
    };
    return NgIfAs;
}());
NgIfAs = __decorate([
    core_1.Component({
        selector: 'ng-if-let',
        template: "\n    <button (click)=\"nextUser()\">Next User</button>\n    <br>\n    <div *ngIf=\"userObservable | async as user; else loading\">\n      Hello {{user.last}}, {{user.first}}!\n    </div>\n    <ng-template #loading let-user>Waiting... (user is {{user|json}})</ng-template>\n"
    })
], NgIfAs);
// #enddocregion
var ExampleApp = (function () {
    function ExampleApp() {
    }
    return ExampleApp;
}());
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <ng-if-simple></ng-if-simple>\n    <hr>\n    <ng-if-else></ng-if-else>\n    <hr>\n    <ng-if-then-else></ng-if-then-else>\n    <hr>\n    <ng-if-let></ng-if-let>\n    <hr>\n"
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
        declarations: [ExampleApp, NgIfSimple, NgIfElse, NgIfThenElse, NgIfAs],
        bootstrap: [ExampleApp]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWtGO0FBQ2xGLDhEQUF3RDtBQUN4RCx3Q0FBcUM7QUFHckMsd0JBQXdCO0FBVXhCLElBQU0sVUFBVTtJQVRoQjtRQVVFLFNBQUksR0FBWSxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxVQUFVO0lBVGYsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFFBQVEsRUFBRSx5SkFLWDtLQUNBLENBQUM7R0FDSSxVQUFVLENBRWY7QUFDRCxnQkFBZ0I7QUFFaEIsc0JBQXNCO0FBV3RCLElBQU0sUUFBUTtJQVZkO1FBV0UsU0FBSSxHQUFZLElBQUksQ0FBQztJQUN2QixDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssUUFBUTtJQVZiLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsWUFBWTtRQUN0QixRQUFRLEVBQUUsZ1FBTVg7S0FDQSxDQUFDO0dBQ0ksUUFBUSxDQUViO0FBQ0QsZ0JBQWdCO0FBRWhCLDBCQUEwQjtBQWMxQixJQUFNLFlBQVk7SUFibEI7UUFjRSxjQUFTLEdBQTBCLElBQUksQ0FBQztRQUN4QyxTQUFJLEdBQVksSUFBSSxDQUFDO1FBR3JCLGlCQUFZLEdBQTBCLElBQUksQ0FBQztRQUUzQyxtQkFBYyxHQUEwQixJQUFJLENBQUM7SUFPL0MsQ0FBQztJQUxDLG9DQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7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