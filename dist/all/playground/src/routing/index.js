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
var router_1 = require("@angular/router");
var inbox_app_1 = require("./app/inbox-app");
function main() {
    var RoutingExampleModule = (function () {
        function RoutingExampleModule() {
        }
        return RoutingExampleModule;
    }());
    RoutingExampleModule = __decorate([
        core_1.NgModule({
            providers: [inbox_app_1.DbService],
            declarations: [inbox_app_1.InboxCmp, inbox_app_1.DraftsCmp, inbox_app_1.InboxApp],
            imports: [router_1.RouterModule.forRoot(inbox_app_1.ROUTER_CONFIG, { useHash: true }), platform_browser_1.BrowserModule],
            bootstrap: [inbox_app_1.InboxApp]
        })
    ], RoutingExampleModule);
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(RoutingExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3JvdXRpbmcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBdUM7QUFDdkMsOERBQXdEO0FBQ3hELDhFQUF5RTtBQUN6RSwwQ0FBNkM7QUFFN0MsNkNBQXdGO0FBRXhGO0lBT0UsSUFBTSxvQkFBb0I7UUFBMUI7UUFDQSxDQUFDO1FBQUQsMkJBQUM7SUFBRCxDQUFDLEFBREQsSUFDQztJQURLLG9CQUFvQjtRQU56QixlQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxxQkFBUyxDQUFDO1lBQ3RCLFlBQVksRUFBRSxDQUFDLG9CQUFRLEVBQUUscUJBQVMsRUFBRSxvQkFBUSxDQUFDO1lBQzdDLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUMsT0FBTyxDQUFDLHlCQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRSxnQ0FBYSxDQUFDO1lBQzlFLFNBQVMsRUFBRSxDQUFDLG9CQUFRLENBQUM7U0FDdEIsQ0FBQztPQUNJLG9CQUFvQixDQUN6QjtJQUNELGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDakUsQ0FBQztBQVZELG9CQVVDIn0=