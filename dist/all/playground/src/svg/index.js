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
var SvgGroup = (function () {
    function SvgGroup() {
    }
    return SvgGroup;
}());
SvgGroup = __decorate([
    core_1.Component({ selector: '[svg-group]', template: "<svg:text x=\"20\" y=\"20\">Hello</svg:text>" })
], SvgGroup);
var SvgApp = (function () {
    function SvgApp() {
    }
    return SvgApp;
}());
SvgApp = __decorate([
    core_1.Component({
        selector: 'svg-app',
        template: "<svg>\n    <g svg-group></g>\n  </svg>"
    })
], SvgApp);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ bootstrap: [SvgApp], declarations: [SvgApp, SvgGroup], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3N2Zy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFrRDtBQUNsRCw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBR3pFLElBQU0sUUFBUTtJQUFkO0lBQ0EsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLFFBQVE7SUFEYixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsOENBQTBDLEVBQUMsQ0FBQztHQUNyRixRQUFRLENBQ2I7QUFRRCxJQUFNLE1BQU07SUFBWjtJQUNBLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxNQUFNO0lBTlgsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxTQUFTO1FBQ25CLFFBQVEsRUFBRSx3Q0FFSDtLQUNSLENBQUM7R0FDSSxNQUFNLENBQ1g7QUFHRCxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZUFBUSxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBQyxDQUFDO0dBQ3RGLGFBQWEsQ0FDbEI7QUFFRDtJQUNFLGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCxvQkFFQyJ9