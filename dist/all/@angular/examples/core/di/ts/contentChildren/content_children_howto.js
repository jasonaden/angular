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
var SomeDir = (function () {
    function SomeDir() {
    }
    SomeDir.prototype.ngAfterContentInit = function () {
        // contentChildren is set
    };
    return SomeDir;
}());
__decorate([
    core_1.ContentChildren(ChildDirective),
    __metadata("design:type", core_1.QueryList)
], SomeDir.prototype, "contentChildren", void 0);
SomeDir = __decorate([
    core_1.Directive({ selector: 'someDir' })
], SomeDir);
// #enddocregion 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9jaGlsZHJlbl9ob3d0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvY29udGVudENoaWxkcmVuL2NvbnRlbnRfY2hpbGRyZW5faG93dG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxtQkFBbUI7QUFDbkIsc0NBQXNGO0FBR3RGLElBQU0sY0FBYztJQUFwQjtJQUNBLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssY0FBYztJQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7R0FDbkMsY0FBYyxDQUNuQjtBQUdELElBQU0sT0FBTztJQUFiO0lBTUEsQ0FBQztJQUhDLG9DQUFrQixHQUFsQjtRQUNFLHlCQUF5QjtJQUMzQixDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTGtDO0lBQWhDLHNCQUFlLENBQUMsY0FBYyxDQUFDOzhCQUFrQixnQkFBUztnREFBaUI7QUFEeEUsT0FBTztJQURaLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUM7R0FDM0IsT0FBTyxDQU1aO0FBQ0QsZ0JBQWdCIn0=