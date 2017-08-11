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
    Object.defineProperty(Tab.prototype, "serializedPanes", {
        get: function () {
            return this.topLevelPanes ? this.topLevelPanes.map(function (p) { return p.id; }).join(', ') : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tab.prototype, "serializedNestedPanes", {
        get: function () {
            return this.arbitraryNestedPanes ? this.arbitraryNestedPanes.map(function (p) { return p.id; }).join(', ') : '';
        },
        enumerable: true,
        configurable: true
    });
    return Tab;
}());
__decorate([
    core_1.ContentChildren(Pane),
    __metadata("design:type", core_1.QueryList)
], Tab.prototype, "topLevelPanes", void 0);
__decorate([
    core_1.ContentChildren(Pane, { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], Tab.prototype, "arbitraryNestedPanes", void 0);
Tab = __decorate([
    core_1.Component({
        selector: 'tab',
        template: "\n    <div class=\"top-level\">Top level panes: {{serializedPanes}}</div> \n    <div class=\"nested\">Arbitrary nested panes: {{serializedNestedPanes}}</div>\n  "
    })
], Tab);
exports.Tab = Tab;
var ContentChildrenComp = (function () {
    function ContentChildrenComp() {
        this.shouldShow = false;
    }
    ContentChildrenComp.prototype.show = function () { this.shouldShow = true; };
    return ContentChildrenComp;
}());
ContentChildrenComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <tab>\n      <pane id=\"1\"></pane>\n      <pane id=\"2\"></pane>\n      <pane id=\"3\" *ngIf=\"shouldShow\">\n        <tab>\n          <pane id=\"3_1\"></pane>\n          <pane id=\"3_2\"></pane>\n        </tab>\n      </pane>\n    </tab>\n    \n    <button (click)=\"show()\">Show 3</button>\n  ",
    })
], ContentChildrenComp);
exports.ContentChildrenComp = ContentChildrenComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9jaGlsZHJlbl9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy9jb250ZW50Q2hpbGRyZW4vY29udGVudF9jaGlsZHJlbl9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUFzRjtBQUd0RixJQUFhLElBQUk7SUFBakI7SUFFQSxDQUFDO0lBQUQsV0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRFU7SUFBUixZQUFLLEVBQUU7O2dDQUFZO0FBRFQsSUFBSTtJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ2pCLElBQUksQ0FFaEI7QUFGWSxvQkFBSTtBQVdqQixJQUFhLEdBQUc7SUFBaEI7SUFVQSxDQUFDO0lBTkMsc0JBQUksZ0NBQWU7YUFBbkI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEVBQUosQ0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoRixDQUFDOzs7T0FBQTtJQUNELHNCQUFJLHNDQUFxQjthQUF6QjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLEVBQUosQ0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5RixDQUFDOzs7T0FBQTtJQUNILFVBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVR3QjtJQUF0QixzQkFBZSxDQUFDLElBQUksQ0FBQzs4QkFBZ0IsZ0JBQVM7MENBQU87QUFDVjtJQUEzQyxzQkFBZSxDQUFDLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQzs4QkFBdUIsZ0JBQVM7aURBQU87QUFGdkUsR0FBRztJQVBmLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsS0FBSztRQUNmLFFBQVEsRUFBRSxtS0FHVDtLQUNGLENBQUM7R0FDVyxHQUFHLENBVWY7QUFWWSxrQkFBRztBQTZCaEIsSUFBYSxtQkFBbUI7SUFqQmhDO1FBa0JFLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFHckIsQ0FBQztJQURDLGtDQUFJLEdBQUosY0FBUyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEMsMEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLG1CQUFtQjtJQWpCL0IsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRSxpVEFhVDtLQUNGLENBQUM7R0FDVyxtQkFBbUIsQ0FJL0I7QUFKWSxrREFBbUI7QUFLaEMsZ0JBQWdCIn0=