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
// #docregion Component
var core_1 = require("@angular/core");
var Pane = (function () {
    function Pane() {
    }
    return Pane;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Pane.prototype, "id", void 0);
Pane = __decorate([
    core_1.Directive({ selector: 'pane' })
], Pane);
exports.Pane = Pane;
var ViewChildrenComp = (function () {
    function ViewChildrenComp() {
        this.serializedPanes = '';
        this.shouldShow = false;
    }
    ViewChildrenComp.prototype.show = function () { this.shouldShow = true; };
    ViewChildrenComp.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.calculateSerializedPanes();
        this.panes.changes.subscribe(function (r) { _this.calculateSerializedPanes(); });
    };
    ViewChildrenComp.prototype.calculateSerializedPanes = function () {
        var _this = this;
        setTimeout(function () { _this.serializedPanes = _this.panes.map(function (p) { return p.id; }).join(', '); }, 0);
    };
    return ViewChildrenComp;
}());
__decorate([
    core_1.ViewChildren(Pane),
    __metadata("design:type", core_1.QueryList)
], ViewChildrenComp.prototype, "panes", void 0);
ViewChildrenComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <pane id=\"1\"></pane>\n    <pane id=\"2\"></pane>\n    <pane id=\"3\" *ngIf=\"shouldShow\"></pane>\n    \n    <button (click)=\"show()\">Show 3</button>\n       \n    <div>panes: {{serializedPanes}}</div> \n  ",
    })
], ViewChildrenComp);
exports.ViewChildrenComp = ViewChildrenComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZHJlbl9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy92aWV3Q2hpbGRyZW4vdmlld19jaGlsZHJlbl9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUFrRztBQUdsRyxJQUFhLElBQUk7SUFBakI7SUFFQSxDQUFDO0lBQUQsV0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRFU7SUFBUixZQUFLLEVBQUU7O2dDQUFZO0FBRFQsSUFBSTtJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ2pCLElBQUksQ0FFaEI7QUFGWSxvQkFBSTtBQWdCakIsSUFBYSxnQkFBZ0I7SUFaN0I7UUFjRSxvQkFBZSxHQUFXLEVBQUUsQ0FBQztRQUU3QixlQUFVLEdBQUcsS0FBSyxDQUFDO0lBWXJCLENBQUM7SUFWQywrQkFBSSxHQUFKLGNBQVMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRWxDLDBDQUFlLEdBQWY7UUFBQSxpQkFHQztRQUZDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUMsSUFBTyxLQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxtREFBd0IsR0FBeEI7UUFBQSxpQkFFQztRQURDLFVBQVUsQ0FBQyxjQUFRLEtBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxFQUFKLENBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBZnFCO0lBQW5CLG1CQUFZLENBQUMsSUFBSSxDQUFDOzhCQUFRLGdCQUFTOytDQUFPO0FBRGhDLGdCQUFnQjtJQVo1QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLDBOQVFUO0tBQ0YsQ0FBQztHQUNXLGdCQUFnQixDQWdCNUI7QUFoQlksNENBQWdCO0FBaUI3QixnQkFBZ0IifQ==