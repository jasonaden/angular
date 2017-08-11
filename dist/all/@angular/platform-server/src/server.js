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
var browser_1 = require("@angular/animations/browser");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var http_2 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var http_3 = require("./http");
var location_1 = require("./location");
var parse5_adapter_1 = require("./parse5_adapter");
var platform_state_1 = require("./platform_state");
var server_renderer_1 = require("./server_renderer");
var styles_host_1 = require("./styles_host");
var tokens_1 = require("./tokens");
function notSupported(feature) {
    throw new Error("platform-server does not support '" + feature + "'.");
}
exports.INTERNAL_SERVER_PLATFORM_PROVIDERS = [
    { provide: platform_browser_1.DOCUMENT, useFactory: _document, deps: [core_1.Injector] },
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_SERVER_ID },
    { provide: core_1.PLATFORM_INITIALIZER, useFactory: initParse5Adapter, multi: true, deps: [core_1.Injector] }, {
        provide: common_1.PlatformLocation,
        useClass: location_1.ServerPlatformLocation,
        deps: [platform_browser_1.DOCUMENT, [core_1.Optional, tokens_1.INITIAL_CONFIG]]
    },
    { provide: platform_state_1.PlatformState, deps: [platform_browser_1.DOCUMENT] },
    // Add special provider that allows multiple instances of platformServer* to be created.
    { provide: core_1.ɵALLOW_MULTIPLE_PLATFORMS, useValue: true }
];
function initParse5Adapter(injector) {
    return function () { parse5_adapter_1.Parse5DomAdapter.makeCurrent(); };
}
function instantiateServerRendererFactory(renderer, engine, zone) {
    return new animations_1.ɵAnimationRendererFactory(renderer, engine, zone);
}
exports.instantiateServerRendererFactory = instantiateServerRendererFactory;
exports.SERVER_RENDER_PROVIDERS = [
    server_renderer_1.ServerRendererFactory2,
    {
        provide: core_1.RendererFactory2,
        useFactory: instantiateServerRendererFactory,
        deps: [server_renderer_1.ServerRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
    },
    styles_host_1.ServerStylesHost,
    { provide: platform_browser_1.ɵSharedStylesHost, useExisting: styles_host_1.ServerStylesHost },
];
/**
 * The ng module for the server.
 *
 * @experimental
 */
var ServerModule = (function () {
    function ServerModule() {
    }
    return ServerModule;
}());
ServerModule = __decorate([
    core_1.NgModule({
        exports: [platform_browser_1.BrowserModule],
        imports: [http_2.HttpModule, http_1.HttpClientModule, animations_1.NoopAnimationsModule],
        providers: [
            exports.SERVER_RENDER_PROVIDERS,
            http_3.SERVER_HTTP_PROVIDERS,
            { provide: core_1.Testability, useValue: null },
        ],
    })
], ServerModule);
exports.ServerModule = ServerModule;
function _document(injector) {
    var config = injector.get(tokens_1.INITIAL_CONFIG, null);
    if (config && config.document) {
        return parse5_adapter_1.parseDocument(config.document);
    }
    else {
        return platform_browser_1.ɵgetDOM().createHtmlDocument();
    }
}
/**
 * @experimental
 */
exports.platformServer = core_1.createPlatformFactory(core_1.platformCore, 'server', exports.INTERNAL_SERVER_PLATFORM_PROVIDERS);
/**
 * The server platform that supports the runtime compiler.
 *
 * @experimental
 */
exports.platformDynamicServer = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, 'serverDynamic', exports.INTERNAL_SERVER_PLATFORM_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tc2VydmVyL3NyYy9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCx1REFBNkQ7QUFDN0QsMENBQTRGO0FBQzVGLDZDQUFzRDtBQUN0RCw4Q0FBc0Q7QUFDdEQsc0NBQTZUO0FBQzdULHNDQUF5QztBQUN6Qyw4REFBNEk7QUFDNUksbUVBQXFHO0FBRXJHLCtCQUE2QztBQUM3Qyx1Q0FBa0Q7QUFDbEQsbURBQWlFO0FBQ2pFLG1EQUErQztBQUMvQyxxREFBeUQ7QUFDekQsNkNBQStDO0FBQy9DLG1DQUF3RDtBQUV4RCxzQkFBc0IsT0FBZTtJQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUFxQyxPQUFPLE9BQUksQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFWSxRQUFBLGtDQUFrQyxHQUFxQjtJQUNsRSxFQUFDLE9BQU8sRUFBRSwyQkFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBUSxDQUFDLEVBQUM7SUFDNUQsRUFBQyxPQUFPLEVBQUUsa0JBQVcsRUFBRSxRQUFRLEVBQUUsNEJBQWtCLEVBQUM7SUFDcEQsRUFBQyxPQUFPLEVBQUUsMkJBQW9CLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBUSxDQUFDLEVBQUMsRUFBRTtRQUM3RixPQUFPLEVBQUUseUJBQWdCO1FBQ3pCLFFBQVEsRUFBRSxpQ0FBc0I7UUFDaEMsSUFBSSxFQUFFLENBQUMsMkJBQVEsRUFBRSxDQUFDLGVBQVEsRUFBRSx1QkFBYyxDQUFDLENBQUM7S0FDN0M7SUFDRCxFQUFDLE9BQU8sRUFBRSw4QkFBYSxFQUFFLElBQUksRUFBRSxDQUFDLDJCQUFRLENBQUMsRUFBQztJQUMxQyx3RkFBd0Y7SUFDeEYsRUFBQyxPQUFPLEVBQUUsZ0NBQXdCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztDQUNwRCxDQUFDO0FBRUYsMkJBQTJCLFFBQWtCO0lBQzNDLE1BQU0sQ0FBQyxjQUFRLGlDQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCwwQ0FDSSxRQUEwQixFQUFFLE1BQXdCLEVBQUUsSUFBWTtJQUNwRSxNQUFNLENBQUMsSUFBSSxzQ0FBeUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFIRCw0RUFHQztBQUVZLFFBQUEsdUJBQXVCLEdBQWU7SUFDakQsd0NBQXNCO0lBQ3RCO1FBQ0UsT0FBTyxFQUFFLHVCQUFnQjtRQUN6QixVQUFVLEVBQUUsZ0NBQWdDO1FBQzVDLElBQUksRUFBRSxDQUFDLHdDQUFzQixFQUFFLDBCQUFnQixFQUFFLGFBQU0sQ0FBQztLQUN6RDtJQUNELDhCQUFnQjtJQUNoQixFQUFDLE9BQU8sRUFBRSxvQ0FBZ0IsRUFBRSxXQUFXLEVBQUUsOEJBQWdCLEVBQUM7Q0FDM0QsQ0FBQztBQUVGOzs7O0dBSUc7QUFVSCxJQUFhLFlBQVk7SUFBekI7SUFDQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLFlBQVk7SUFUeEIsZUFBUSxDQUFDO1FBQ1IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQyxpQkFBVSxFQUFFLHVCQUFnQixFQUFFLGlDQUFvQixDQUFDO1FBQzdELFNBQVMsRUFBRTtZQUNULCtCQUF1QjtZQUN2Qiw0QkFBcUI7WUFDckIsRUFBQyxPQUFPLEVBQUUsa0JBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1NBQ3ZDO0tBQ0YsQ0FBQztHQUNXLFlBQVksQ0FDeEI7QUFEWSxvQ0FBWTtBQUd6QixtQkFBbUIsUUFBa0I7SUFDbkMsSUFBSSxNQUFNLEdBQXdCLFFBQVEsQ0FBQyxHQUFHLENBQUMsdUJBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLDhCQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQywwQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ1UsUUFBQSxjQUFjLEdBQ3ZCLDRCQUFxQixDQUFDLG1CQUFZLEVBQUUsUUFBUSxFQUFFLDBDQUFrQyxDQUFDLENBQUM7QUFFdEY7Ozs7R0FJRztBQUNVLFFBQUEscUJBQXFCLEdBQzlCLDRCQUFxQixDQUFDLDhCQUFtQixFQUFFLGVBQWUsRUFBRSwwQ0FBa0MsQ0FBQyxDQUFDIn0=