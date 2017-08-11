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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var api_1 = require("./api");
var backend_1 = require("./backend");
/**
 * Configures `HttpClientTestingBackend` as the `HttpBackend` used by `HttpClient`.
 *
 * Inject `HttpTestingController` to expect and flush requests in your tests.
 *
 * @experimental
 */
var HttpClientTestingModule = (function () {
    function HttpClientTestingModule() {
    }
    return HttpClientTestingModule;
}());
HttpClientTestingModule = __decorate([
    core_1.NgModule({
        imports: [
            http_1.HttpClientModule,
        ],
        providers: [
            backend_1.HttpClientTestingBackend,
            { provide: http_1.HttpBackend, useExisting: backend_1.HttpClientTestingBackend },
            { provide: api_1.HttpTestingController, useExisting: backend_1.HttpClientTestingBackend },
        ],
    })
], HttpClientTestingModule);
exports.HttpClientTestingModule = HttpClientTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdGluZy9zcmMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsNkNBQW1FO0FBQ25FLHNDQUF1QztBQUV2Qyw2QkFBNEM7QUFDNUMscUNBQW1EO0FBR25EOzs7Ozs7R0FNRztBQVdILElBQWEsdUJBQXVCO0lBQXBDO0lBQ0EsQ0FBQztJQUFELDhCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSx1QkFBdUI7SUFWbkMsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFO1lBQ1AsdUJBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFO1lBQ1Qsa0NBQXdCO1lBQ3hCLEVBQUMsT0FBTyxFQUFFLGtCQUFXLEVBQUUsV0FBVyxFQUFFLGtDQUF3QixFQUFDO1lBQzdELEVBQUMsT0FBTyxFQUFFLDJCQUFxQixFQUFFLFdBQVcsRUFBRSxrQ0FBd0IsRUFBQztTQUN4RTtLQUNGLENBQUM7R0FDVyx1QkFBdUIsQ0FDbkM7QUFEWSwwREFBdUIifQ==