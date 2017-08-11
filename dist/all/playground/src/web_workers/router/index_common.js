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
var platform_webworker_1 = require("@angular/platform-webworker");
var router_1 = require("@angular/router");
var about_1 = require("./components/about");
var contact_1 = require("./components/contact");
var start_1 = require("./components/start");
var App = (function () {
    function App() {
    }
    return App;
}());
App = __decorate([
    core_1.Component({ selector: 'app', templateUrl: 'app.html' })
], App);
exports.App = App;
exports.ROUTES = [
    { path: '', component: start_1.Start }, { path: 'contact', component: contact_1.Contact },
    { path: 'about', component: about_1.About }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_webworker_1.WorkerAppModule, router_1.RouterModule.forRoot(exports.ROUTES, { useHash: true })],
        providers: [
            platform_webworker_1.WORKER_APP_LOCATION_PROVIDERS,
        ],
        bootstrap: [App],
        declarations: [App, start_1.Start, contact_1.Contact, about_1.About]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9yb3V0ZXIvaW5kZXhfY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELGtFQUEyRjtBQUMzRiwwQ0FBNkM7QUFFN0MsNENBQXlDO0FBQ3pDLGdEQUE2QztBQUM3Qyw0Q0FBeUM7QUFHekMsSUFBYSxHQUFHO0lBQWhCO0lBQ0EsQ0FBQztJQUFELFVBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLEdBQUc7SUFEZixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUM7R0FDekMsR0FBRyxDQUNmO0FBRFksa0JBQUc7QUFHSCxRQUFBLE1BQU0sR0FBRztJQUNwQixFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLGFBQUssRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQU8sRUFBQztJQUNuRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQUssRUFBQztDQUNsQyxDQUFDO0FBVUYsSUFBYSxTQUFTO0lBQXRCO0lBQ0EsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxTQUFTO0lBUnJCLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRSxDQUFDLG9DQUFlLEVBQUUscUJBQVksQ0FBQyxPQUFPLENBQUMsY0FBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDekUsU0FBUyxFQUFFO1lBQ1Qsa0RBQTZCO1NBQzlCO1FBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ2hCLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxhQUFLLEVBQUUsaUJBQU8sRUFBRSxhQUFLLENBQUM7S0FDM0MsQ0FBQztHQUNXLFNBQVMsQ0FDckI7QUFEWSw4QkFBUyJ9