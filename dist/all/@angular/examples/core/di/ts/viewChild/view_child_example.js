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
var ViewChildComp = (function () {
    function ViewChildComp() {
        this.selectedPane = '';
        this.shouldShow = true;
    }
    Object.defineProperty(ViewChildComp.prototype, "pane", {
        set: function (v) {
            var _this = this;
            setTimeout(function () { _this.selectedPane = v.id; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    ViewChildComp.prototype.toggle = function () { this.shouldShow = !this.shouldShow; };
    return ViewChildComp;
}());
__decorate([
    core_1.ViewChild(Pane),
    __metadata("design:type", Pane),
    __metadata("design:paramtypes", [Pane])
], ViewChildComp.prototype, "pane", null);
ViewChildComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <pane id=\"1\" *ngIf=\"shouldShow\"></pane>\n    <pane id=\"2\" *ngIf=\"!shouldShow\"></pane>\n    \n    <button (click)=\"toggle()\">Toggle</button>\n       \n    <div>Selected: {{selectedPane}}</div> \n  ",
    })
], ViewChildComp);
exports.ViewChildComp = ViewChildComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZF9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy92aWV3Q2hpbGQvdmlld19jaGlsZF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUFxRTtBQUdyRSxJQUFhLElBQUk7SUFBakI7SUFFQSxDQUFDO0lBQUQsV0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRFU7SUFBUixZQUFLLEVBQUU7O2dDQUFZO0FBRFQsSUFBSTtJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ2pCLElBQUksQ0FFaEI7QUFGWSxvQkFBSTtBQWVqQixJQUFhLGFBQWE7SUFYMUI7UUFnQkUsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFDMUIsZUFBVSxHQUFHLElBQUksQ0FBQztJQUVwQixDQUFDO0lBTkMsc0JBQUksK0JBQUk7YUFBUixVQUFTLENBQU87WUFEaEIsaUJBR0M7WUFEQyxVQUFVLENBQUMsY0FBUSxLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQzs7O09BQUE7SUFHRCw4QkFBTSxHQUFOLGNBQVcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2xELG9CQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFOQztJQURDLGdCQUFTLENBQUMsSUFBSSxDQUFDOzhCQUNKLElBQUk7cUNBQUosSUFBSTt5Q0FFZjtBQUpVLGFBQWE7SUFYekIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRSxzTkFPVDtLQUNGLENBQUM7R0FDVyxhQUFhLENBUXpCO0FBUlksc0NBQWE7QUFTMUIsZ0JBQWdCIn0=