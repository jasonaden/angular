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
var upgrade_1 = require("@angular/upgrade");
var styles = ["\n    .border {\n      border: solid 2px DodgerBlue;\n    }\n    .title {\n      background-color: LightSkyBlue;\n      padding: .2em 1em;\n      font-size: 1.2em;\n    }\n    .content {\n      padding: 1em;\n    }\n  "];
var adapter = new upgrade_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2AppModule; }));
var ng1module = angular.module('myExample', []);
ng1module.controller('Index', function ($scope) { $scope.name = 'World'; });
ng1module.directive('ng1User', function () {
    return {
        scope: { handle: '@', reset: '&' },
        template: "\n      User: {{handle}}\n      <hr>\n      <button ng-click=\"reset()\">clear</button>"
    };
});
var Pane = (function () {
    function Pane() {
    }
    return Pane;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Pane.prototype, "title", void 0);
Pane = __decorate([
    core_1.Component({
        selector: 'pane',
        template: "<div class=\"border\">\n    <div class=\"title\">{{title}}</div>\n    <div class=\"content\"><ng-content></ng-content></div>\n    </div>",
        styles: styles
    })
], Pane);
var UpgradeApp = (function () {
    function UpgradeApp() {
        this.reset = new core_1.EventEmitter();
    }
    return UpgradeApp;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UpgradeApp.prototype, "user", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UpgradeApp.prototype, "reset", void 0);
UpgradeApp = __decorate([
    core_1.Component({
        selector: 'upgrade-app',
        template: "<div class=\"border\">\n      <pane title=\"Title: {{user}}\">\n        <table cellpadding=\"3\">\n          <tr>\n            <td><ng-content></ng-content></td>\n            <td><ng1-user [handle]=\"user\" (reset)=\"reset.emit()\"></ng1-user></td>\n          </tr>\n        </table>\n      </pane>\n    </div>",
        styles: styles
    }),
    __metadata("design:paramtypes", [])
], UpgradeApp);
var Ng2AppModule = (function () {
    function Ng2AppModule() {
    }
    return Ng2AppModule;
}());
Ng2AppModule = __decorate([
    core_1.NgModule({
        declarations: [Pane, UpgradeApp, adapter.upgradeNg1Component('ng1User')],
        imports: [platform_browser_1.BrowserModule]
    })
], Ng2AppModule);
ng1module.directive('upgradeApp', adapter.downgradeNg2Component(UpgradeApp));
function main() {
    adapter.bootstrap(document.body, ['myExample']);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3VwZ3JhZGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkY7QUFDM0YsOERBQXdEO0FBQ3hELDRDQUFnRDtBQUtoRCxJQUFNLE1BQU0sR0FBRyxDQUFDLDROQVliLENBQUMsQ0FBQztBQUVMLElBQU0sT0FBTyxHQUFHLElBQUksd0JBQWMsQ0FBQyxpQkFBVSxDQUFDLGNBQU0sT0FBQSxZQUFZLEVBQVosQ0FBWSxDQUFDLENBQUMsQ0FBQztBQUNuRSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUVsRCxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFTLE1BQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWhGLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO0lBQzdCLE1BQU0sQ0FBQztRQUNMLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQztRQUNoQyxRQUFRLEVBQUUseUZBR2tDO0tBQzdDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQVVILElBQU0sSUFBSTtJQUFWO0lBRUEsQ0FBQztJQUFELFdBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQURVO0lBQVIsWUFBSyxFQUFFOzttQ0FBZTtBQURuQixJQUFJO0lBUlQsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSwwSUFHRDtRQUNULE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQztHQUNJLElBQUksQ0FFVDtBQWlCRCxJQUFNLFVBQVU7SUFHZDtRQURVLFVBQUssR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBQ2xCLGlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFIVTtJQUFSLFlBQUssRUFBRTs7d0NBQWM7QUFDWjtJQUFULGFBQU0sRUFBRTs7eUNBQTRCO0FBRmpDLFVBQVU7SUFkZixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLHdUQVNEO1FBQ1QsTUFBTSxFQUFFLE1BQU07S0FDZixDQUFDOztHQUNJLFVBQVUsQ0FJZjtBQU1ELElBQU0sWUFBWTtJQUFsQjtJQUNBLENBQUM7SUFBRCxtQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssWUFBWTtJQUpqQixlQUFRLENBQUM7UUFDUixZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO0tBQ3pCLENBQUM7R0FDSSxZQUFZLENBQ2pCO0FBR0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFN0U7SUFDRSxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFGRCxvQkFFQyJ9