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
var Tab = (function () {
    function Tab() {
    }
    return Tab;
}());
__decorate([
    core_1.ContentChild(Pane),
    __metadata("design:type", Pane)
], Tab.prototype, "pane", void 0);
Tab = __decorate([
    core_1.Component({
        selector: 'tab',
        template: "\n    <div>pane: {{pane?.id}}</div> \n  "
    })
], Tab);
exports.Tab = Tab;
var ContentChildComp = (function () {
    function ContentChildComp() {
        this.shouldShow = true;
    }
    ContentChildComp.prototype.toggle = function () { this.shouldShow = !this.shouldShow; };
    return ContentChildComp;
}());
ContentChildComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <tab>\n      <pane id=\"1\" *ngIf=\"shouldShow\"></pane>\n      <pane id=\"2\" *ngIf=\"!shouldShow\"></pane>\n    </tab>\n    \n    <button (click)=\"toggle()\">Toggle</button>\n  ",
    })
], ContentChildComp);
exports.ContentChildComp = ContentChildComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9jaGlsZF9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy9jb250ZW50Q2hpbGQvY29udGVudF9jaGlsZF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUF3RTtBQUd4RSxJQUFhLElBQUk7SUFBakI7SUFFQSxDQUFDO0lBQUQsV0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRFU7SUFBUixZQUFLLEVBQUU7O2dDQUFZO0FBRFQsSUFBSTtJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ2pCLElBQUksQ0FFaEI7QUFGWSxvQkFBSTtBQVVqQixJQUFhLEdBQUc7SUFBaEI7SUFFQSxDQUFDO0lBQUQsVUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRHFCO0lBQW5CLG1CQUFZLENBQUMsSUFBSSxDQUFDOzhCQUFPLElBQUk7aUNBQUM7QUFEcEIsR0FBRztJQU5mLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsS0FBSztRQUNmLFFBQVEsRUFBRSwwQ0FFVDtLQUNGLENBQUM7R0FDVyxHQUFHLENBRWY7QUFGWSxrQkFBRztBQWVoQixJQUFhLGdCQUFnQjtJQVg3QjtRQVlFLGVBQVUsR0FBRyxJQUFJLENBQUM7SUFHcEIsQ0FBQztJQURDLGlDQUFNLEdBQU4sY0FBVyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDbEQsdUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLGdCQUFnQjtJQVg1QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLDRMQU9UO0tBQ0YsQ0FBQztHQUNXLGdCQUFnQixDQUk1QjtBQUpZLDRDQUFnQjtBQUs3QixnQkFBZ0IifQ==