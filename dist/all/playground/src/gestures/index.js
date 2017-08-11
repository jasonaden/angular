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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var GesturesCmp = (function () {
    function GesturesCmp() {
        this.swipeDirection = '-';
        this.pinchScale = 1;
        this.rotateAngle = 0;
    }
    GesturesCmp.prototype.onSwipe = function (event) { this.swipeDirection = event.deltaX > 0 ? 'right' : 'left'; };
    GesturesCmp.prototype.onPinch = function (event) { this.pinchScale = event.scale; };
    GesturesCmp.prototype.onRotate = function (event) { this.rotateAngle = event.rotation; };
    return GesturesCmp;
}());
GesturesCmp = __decorate([
    core_1.Component({ selector: 'gestures-app', templateUrl: 'template.html' })
], GesturesCmp);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [GesturesCmp], bootstrap: [GesturesCmp], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2dlc3R1cmVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFHekUsSUFBTSxXQUFXO0lBRGpCO1FBRUUsbUJBQWMsR0FBVyxHQUFHLENBQUM7UUFDN0IsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixnQkFBVyxHQUFXLENBQUMsQ0FBQztJQU8xQixDQUFDO0lBTEMsNkJBQU8sR0FBUCxVQUFRLEtBQWtCLElBQVUsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVoRyw2QkFBTyxHQUFQLFVBQVEsS0FBa0IsSUFBVSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRXBFLDhCQUFRLEdBQVIsVUFBUyxLQUFrQixJQUFVLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0Usa0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVZLLFdBQVc7SUFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDO0dBQzlELFdBQVcsQ0FVaEI7QUFHRCxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZUFBUSxDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFDLENBQUM7R0FDdEYsYUFBYSxDQUNsQjtBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=