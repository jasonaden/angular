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
// #docregion HowTo
var core_1 = require("@angular/core");
var ChildDirective = (function () {
    function ChildDirective() {
    }
    return ChildDirective;
}());
ChildDirective = __decorate([
    core_1.Directive({ selector: 'child-directive' })
], ChildDirective);
var SomeCmp = (function () {
    function SomeCmp() {
    }
    SomeCmp.prototype.ngAfterViewInit = function () {
        // viewChildren is set
    };
    return SomeCmp;
}());
__decorate([
    core_1.ViewChildren(ChildDirective),
    __metadata("design:type", core_1.QueryList)
], SomeCmp.prototype, "viewChildren", void 0);
SomeCmp = __decorate([
    core_1.Component({ selector: 'someCmp', templateUrl: 'someCmp.html' })
], SomeCmp);
// #enddocregion 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZHJlbl9ob3d0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvdmlld0NoaWxkcmVuL3ZpZXdfY2hpbGRyZW5faG93dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxtQkFBbUI7QUFDbkIsc0NBQTJGO0FBRzNGLElBQU0sY0FBYztJQUFwQjtJQUNBLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssY0FBYztJQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7R0FDbkMsY0FBYyxDQUNuQjtBQUdELElBQU0sT0FBTztJQUFiO0lBTUEsQ0FBQztJQUhDLGlDQUFlLEdBQWY7UUFDRSxzQkFBc0I7SUFDeEIsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQUwrQjtJQUE3QixtQkFBWSxDQUFDLGNBQWMsQ0FBQzs4QkFBZSxnQkFBUzs2Q0FBaUI7QUFEbEUsT0FBTztJQURaLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUMsQ0FBQztHQUN4RCxPQUFPLENBTVo7QUFDRCxnQkFBZ0IifQ==