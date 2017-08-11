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
var util_1 = require("../util");
var TreeComponent = (function () {
    function TreeComponent() {
        this.data = util_1.emptyTree;
    }
    return TreeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", util_1.TreeNode)
], TreeComponent.prototype, "data", void 0);
TreeComponent = __decorate([
    core_1.Component({
        selector: 'tree',
        template: "<ng-container [ngSwitch]=\"data.depth % 2\">\n    <span *ngSwitchCase=\"0\" style=\"background-color: grey\"> {{data.value}} </span>\n    <span *ngSwitchDefault> {{data.value}} </span>\n    <tree *ngIf='data.right != null' [data]='data.right'></tree><tree *ngIf='data.left != null' [data]='data.left'></tree>"
    })
], TreeComponent);
exports.TreeComponent = TreeComponent;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        bootstrap: [TreeComponent],
        declarations: [TreeComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfc3dpdGNoL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFDekQsOERBQXdEO0FBRXhELGdDQUE0QztBQVM1QyxJQUFhLGFBQWE7SUFQMUI7UUFTRSxTQUFJLEdBQWEsZ0JBQVMsQ0FBQztJQUM3QixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQURDO0lBREMsWUFBSyxFQUFFOzhCQUNGLGVBQVE7MkNBQWE7QUFGaEIsYUFBYTtJQVB6QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLE1BQU07UUFDaEIsUUFBUSxFQUFFLHNUQUcrRztLQUMxSCxDQUFDO0dBQ1csYUFBYSxDQUd6QjtBQUhZLHNDQUFhO0FBVTFCLElBQWEsU0FBUztJQUF0QjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksU0FBUztJQUxyQixlQUFRLENBQUM7UUFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO1FBQ3hCLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMxQixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7S0FDOUIsQ0FBQztHQUNXLFNBQVMsQ0FDckI7QUFEWSw4QkFBUyJ9