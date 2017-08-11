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
var core_1 = require("@angular/core");
var CustomDirective = (function () {
    function CustomDirective() {
    }
    return CustomDirective;
}());
;
// #docregion component
var Greet = (function () {
    function Greet() {
        this.name = 'World';
    }
    return Greet;
}());
Greet = __decorate([
    core_1.Component({ selector: 'greet', template: 'Hello {{name}}!' })
], Greet);
// #enddocregion
// #docregion attributeFactory
var Page = (function () {
    function Page(title) {
        this.title = title;
    }
    return Page;
}());
Page = __decorate([
    core_1.Component({ selector: 'page', template: 'Title: {{title}}' }),
    __param(0, core_1.Attribute('title')),
    __metadata("design:paramtypes", [String])
], Page);
// #enddocregion
// #docregion attributeMetadata
var InputAttrDirective = (function () {
    function InputAttrDirective(type) {
        // type would be 'text' in this example
    }
    return InputAttrDirective;
}());
InputAttrDirective = __decorate([
    core_1.Directive({ selector: 'input' }),
    __param(0, core_1.Attribute('type')),
    __metadata("design:paramtypes", [String])
], InputAttrDirective);
// #enddocregion
// #docregion directive
var InputDirective = (function () {
    function InputDirective() {
        // Add some logic.
    }
    return InputDirective;
}());
InputDirective = __decorate([
    core_1.Directive({ selector: 'input' }),
    __metadata("design:paramtypes", [])
], InputDirective);
// #enddocregion
// #docregion pipe
var Lowercase = (function () {
    function Lowercase() {
    }
    Lowercase.prototype.transform = function (v, args) { return v.toLowerCase(); };
    return Lowercase;
}());
Lowercase = __decorate([
    core_1.Pipe({ name: 'lowercase' })
], Lowercase);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL3RzL21ldGFkYXRhL21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW9FO0FBRXBFO0lBQUE7SUFBdUIsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQUF4QixJQUF3QjtBQUFBLENBQUM7QUFFekIsdUJBQXVCO0FBRXZCLElBQU0sS0FBSztJQURYO1FBRUUsU0FBSSxHQUFXLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssS0FBSztJQURWLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO0dBQ3RELEtBQUssQ0FFVjtBQUNELGdCQUFnQjtBQUVoQiw4QkFBOEI7QUFFOUIsSUFBTSxJQUFJO0lBRVIsY0FBZ0MsS0FBYTtRQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQUMsQ0FBQztJQUN4RSxXQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFISyxJQUFJO0lBRFQsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUM7SUFHN0MsV0FBQSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztHQUYzQixJQUFJLENBR1Q7QUFDRCxnQkFBZ0I7QUFFaEIsK0JBQStCO0FBRS9CLElBQU0sa0JBQWtCO0lBQ3RCLDRCQUErQixJQUFZO1FBQ3pDLHVDQUF1QztJQUN6QyxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpLLGtCQUFrQjtJQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO0lBRWhCLFdBQUEsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7R0FEMUIsa0JBQWtCLENBSXZCO0FBQ0QsZ0JBQWdCO0FBRWhCLHVCQUF1QjtBQUV2QixJQUFNLGNBQWM7SUFDbEI7UUFDRSxrQkFBa0I7SUFDcEIsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKSyxjQUFjO0lBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7O0dBQ3pCLGNBQWMsQ0FJbkI7QUFDRCxnQkFBZ0I7QUFFaEIsa0JBQWtCO0FBRWxCLElBQU0sU0FBUztJQUFmO0lBRUEsQ0FBQztJQURDLDZCQUFTLEdBQVQsVUFBVSxDQUFTLEVBQUUsSUFBVyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9ELGdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGSyxTQUFTO0lBRGQsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDO0dBQ3BCLFNBQVMsQ0FFZDtBQUNELGdCQUFnQiJ9