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
var content_children_example_1 = require("./content_children_example");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [content_children_example_1.ContentChildrenComp, content_children_example_1.Pane, content_children_example_1.Tab],
        bootstrap: [content_children_example_1.ContentChildrenComp]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy9jb250ZW50Q2hpbGRyZW4vbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXVDO0FBQ3ZDLDhEQUF3RDtBQUN4RCx1RUFBMEU7QUFPMUUsSUFBYSxTQUFTO0lBQXRCO0lBQ0EsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxTQUFTO0lBTHJCLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7UUFDeEIsWUFBWSxFQUFFLENBQUMsOENBQW1CLEVBQUUsK0JBQUksRUFBRSw4QkFBRyxDQUFDO1FBQzlDLFNBQVMsRUFBRSxDQUFDLDhDQUFtQixDQUFDO0tBQ2pDLENBQUM7R0FDVyxTQUFTLENBQ3JCO0FBRFksOEJBQVMifQ==