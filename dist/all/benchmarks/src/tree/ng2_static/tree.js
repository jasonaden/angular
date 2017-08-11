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
var trustedEmptyColor;
var trustedGreyColor;
function createTreeComponent(level, isLeaf) {
    var nextTreeEl = "tree" + (level + 1);
    var template = "<span [style.backgroundColor]=\"bgColor\"> {{data.value}} </span>";
    if (!isLeaf) {
        template +=
            "<" + nextTreeEl + " [data]='data.right'></" + nextTreeEl + "><" + nextTreeEl + " [data]='data.left'></" + nextTreeEl + ">";
    }
    var TreeComponent = (function () {
        function TreeComponent() {
        }
        Object.defineProperty(TreeComponent.prototype, "bgColor", {
            get: function () { return this.data.depth % 2 ? trustedEmptyColor : trustedGreyColor; },
            enumerable: true,
            configurable: true
        });
        return TreeComponent;
    }());
    __decorate([
        core_1.Input(),
        __metadata("design:type", util_1.TreeNode)
    ], TreeComponent.prototype, "data", void 0);
    TreeComponent = __decorate([
        core_1.Component({ selector: "tree" + level, template: template })
    ], TreeComponent);
    return TreeComponent;
}
var RootTreeComponent = (function () {
    function RootTreeComponent() {
        this.data = util_1.emptyTree;
    }
    return RootTreeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", util_1.TreeNode)
], RootTreeComponent.prototype, "data", void 0);
RootTreeComponent = __decorate([
    core_1.Component({ selector: 'tree', template: "<tree0 *ngIf=\"data.left != null\" [data]='data'></tree0>" })
], RootTreeComponent);
exports.RootTreeComponent = RootTreeComponent;
function createModule() {
    var components = [RootTreeComponent];
    for (var i = 0; i <= util_1.maxDepth; i++) {
        components.push(createTreeComponent(i, i === util_1.maxDepth));
    }
    var AppModule = (function () {
        function AppModule(sanitizer) {
            trustedEmptyColor = sanitizer.bypassSecurityTrustStyle('');
            trustedGreyColor = sanitizer.bypassSecurityTrustStyle('grey');
        }
        return AppModule;
    }());
    AppModule = __decorate([
        core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [RootTreeComponent], declarations: [components] }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
    ], AppModule);
    return AppModule;
}
exports.AppModule = createModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfc3RhdGljL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFDekQsOERBQWlGO0FBRWpGLGdDQUFzRDtBQUV0RCxJQUFJLGlCQUE0QixDQUFDO0FBQ2pDLElBQUksZ0JBQTJCLENBQUM7QUFFaEMsNkJBQTZCLEtBQWEsRUFBRSxNQUFlO0lBQ3pELElBQU0sVUFBVSxHQUFHLFVBQU8sS0FBSyxHQUFDLENBQUMsQ0FBRSxDQUFDO0lBQ3BDLElBQUksUUFBUSxHQUFHLG1FQUFpRSxDQUFDO0lBQ2pGLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNaLFFBQVE7WUFDSixNQUFJLFVBQVUsK0JBQTBCLFVBQVUsVUFBSyxVQUFVLDhCQUF5QixVQUFVLE1BQUcsQ0FBQztJQUM5RyxDQUFDO0lBR0QsSUFBTSxhQUFhO1FBQW5CO1FBSUEsQ0FBQztRQURDLHNCQUFJLGtDQUFPO2lCQUFYLGNBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUN0RixvQkFBQztJQUFELENBQUMsQUFKRCxJQUlDO0lBRkM7UUFEQyxZQUFLLEVBQUU7a0NBQ0YsZUFBUTsrQ0FBQztJQUZYLGFBQWE7UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxTQUFPLEtBQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7T0FDcEQsYUFBYSxDQUlsQjtJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQUdELElBQWEsaUJBQWlCO0lBRDlCO1FBR0UsU0FBSSxHQUFhLGdCQUFTLENBQUM7SUFDN0IsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFEQztJQURDLFlBQUssRUFBRTs4QkFDRixlQUFROytDQUFhO0FBRmhCLGlCQUFpQjtJQUQ3QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsMkRBQXlELEVBQUMsQ0FBQztHQUN0RixpQkFBaUIsQ0FHN0I7QUFIWSw4Q0FBaUI7QUFLOUI7SUFDRSxJQUFNLFVBQVUsR0FBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDOUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxlQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNuQyxVQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssZUFBUSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBR0QsSUFBTSxTQUFTO1FBQ2IsbUJBQVksU0FBdUI7WUFDakMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNELGdCQUFnQixHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQ0gsZ0JBQUM7SUFBRCxDQUFDLEFBTEQsSUFLQztJQUxLLFNBQVM7UUFEZCxlQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBQyxDQUFDO3lDQUV4RSwrQkFBWTtPQUQvQixTQUFTLENBS2Q7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFWSxRQUFBLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQyJ9