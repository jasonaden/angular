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
var testing_1 = require("@angular/compiler/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
var animations_1 = require("@angular/platform-browser/animations");
var platform_server_1 = require("@angular/platform-server");
/**
 * Platform for testing
 *
 * @experimental API related to bootstrapping are still under review.
 */
exports.platformServerTesting = core_1.createPlatformFactory(testing_1.platformCoreDynamicTesting, 'serverTesting', platform_server_1.ɵINTERNAL_SERVER_PLATFORM_PROVIDERS);
/**
 * NgModule for testing.
 *
 * @experimental API related to bootstrapping are still under review.
 */
var ServerTestingModule = (function () {
    function ServerTestingModule() {
    }
    return ServerTestingModule;
}());
ServerTestingModule = __decorate([
    core_1.NgModule({
        exports: [testing_2.BrowserDynamicTestingModule],
        imports: [animations_1.NoopAnimationsModule],
        providers: platform_server_1.ɵSERVER_RENDER_PROVIDERS
    })
], ServerTestingModule);
exports.ServerTestingModule = ServerTestingModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3Rlc3Rpbmcvc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHFEQUFxRTtBQUNyRSxzQ0FBMkY7QUFDM0YscUVBQXNGO0FBQ3RGLG1FQUEwRTtBQUMxRSw0REFBd0s7QUFHeEs7Ozs7R0FJRztBQUNVLFFBQUEscUJBQXFCLEdBQUcsNEJBQXFCLENBQ3RELG9DQUEwQixFQUFFLGVBQWUsRUFBRSxxREFBa0MsQ0FBQyxDQUFDO0FBRXJGOzs7O0dBSUc7QUFNSCxJQUFhLG1CQUFtQjtJQUFoQztJQUNBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksbUJBQW1CO0lBTC9CLGVBQVEsQ0FBQztRQUNSLE9BQU8sRUFBRSxDQUFDLHFDQUEyQixDQUFDO1FBQ3RDLE9BQU8sRUFBRSxDQUFDLGlDQUFvQixDQUFDO1FBQy9CLFNBQVMsRUFBRSwwQ0FBdUI7S0FDbkMsQ0FBQztHQUNXLG1CQUFtQixDQUMvQjtBQURZLGtEQUFtQiJ9