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
var TreeComponent = (function () {
    function TreeComponent() {
        this.data = util_1.emptyTree;
    }
    Object.defineProperty(TreeComponent.prototype, "bgColor", {
        get: function () { return this.data.depth % 2 ? trustedEmptyColor : trustedGreyColor; },
        enumerable: true,
        configurable: true
    });
    return TreeComponent;
}());
TreeComponent = __decorate([
    core_1.Component({
        selector: 'tree',
        inputs: ['data'],
        template: "<span [style.backgroundColor]=\"bgColor\"> {{data.value}} </span><tree *ngIf='data.right != null' [data]='data.right'></tree><tree *ngIf='data.left != null' [data]='data.left'></tree>"
    })
], TreeComponent);
exports.TreeComponent = TreeComponent;
var AppModule = (function () {
    function AppModule(sanitizer) {
        trustedEmptyColor = sanitizer.bypassSecurityTrustStyle('');
        trustedGreyColor = sanitizer.bypassSecurityTrustStyle('grey');
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [TreeComponent], declarations: [TreeComponent] }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzIvdHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCw4REFBaUY7QUFFakYsZ0NBQTRDO0FBRTVDLElBQUksaUJBQTRCLENBQUM7QUFDakMsSUFBSSxnQkFBMkIsQ0FBQztBQVFoQyxJQUFhLGFBQWE7SUFOMUI7UUFPRSxTQUFJLEdBQWEsZ0JBQVMsQ0FBQztJQUU3QixDQUFDO0lBREMsc0JBQUksa0NBQU87YUFBWCxjQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEYsb0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLGFBQWE7SUFOekIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUNoQixRQUFRLEVBQ0oseUxBQXVMO0tBQzVMLENBQUM7R0FDVyxhQUFhLENBR3pCO0FBSFksc0NBQWE7QUFNMUIsSUFBYSxTQUFTO0lBQ3BCLG1CQUFZLFNBQXVCO1FBQ2pDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRCxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMWSxTQUFTO0lBRHJCLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBQyxDQUFDO3FDQUV2RSwrQkFBWTtHQUR4QixTQUFTLENBS3JCO0FBTFksOEJBQVMifQ==