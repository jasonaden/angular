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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var browser_adapter_1 = require("./browser/browser_adapter");
var browser_platform_location_1 = require("./browser/location/browser_platform_location");
var meta_1 = require("./browser/meta");
var server_transition_1 = require("./browser/server-transition");
var testability_1 = require("./browser/testability");
var title_1 = require("./browser/title");
var ng_probe_1 = require("./dom/debug/ng_probe");
var dom_renderer_1 = require("./dom/dom_renderer");
var dom_tokens_1 = require("./dom/dom_tokens");
var dom_events_1 = require("./dom/events/dom_events");
var event_manager_1 = require("./dom/events/event_manager");
var hammer_gestures_1 = require("./dom/events/hammer_gestures");
var key_events_1 = require("./dom/events/key_events");
var shared_styles_host_1 = require("./dom/shared_styles_host");
var dom_sanitization_service_1 = require("./security/dom_sanitization_service");
exports.INTERNAL_BROWSER_PLATFORM_PROVIDERS = [
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_BROWSER_ID },
    { provide: core_1.PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    { provide: common_1.PlatformLocation, useClass: browser_platform_location_1.BrowserPlatformLocation, deps: [dom_tokens_1.DOCUMENT] },
    { provide: dom_tokens_1.DOCUMENT, useFactory: _document, deps: [] },
];
/**
 * @security Replacing built-in sanitization providers exposes the application to XSS risks.
 * Attacker-controlled data introduced by an unsanitized provider could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 * @experimental
 */
exports.BROWSER_SANITIZATION_PROVIDERS = [
    { provide: core_1.Sanitizer, useExisting: dom_sanitization_service_1.DomSanitizer },
    { provide: dom_sanitization_service_1.DomSanitizer, useClass: dom_sanitization_service_1.DomSanitizerImpl, deps: [dom_tokens_1.DOCUMENT] },
];
/**
 * @stable
 */
exports.platformBrowser = core_1.createPlatformFactory(core_1.platformCore, 'browser', exports.INTERNAL_BROWSER_PLATFORM_PROVIDERS);
function initDomAdapter() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    testability_1.BrowserGetTestability.init();
}
exports.initDomAdapter = initDomAdapter;
function errorHandler() {
    return new core_1.ErrorHandler();
}
exports.errorHandler = errorHandler;
function _document() {
    return document;
}
exports._document = _document;
/**
 * The ng module for the browser.
 *
 * @stable
 */
var BrowserModule = BrowserModule_1 = (function () {
    function BrowserModule(parentModule) {
        if (parentModule) {
            throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
        }
    }
    /**
     * Configures a browser-based application to transition from a server-rendered app, if
     * one is present on the page. The specified parameters must include an application id,
     * which must match between the client and server applications.
     *
     * @experimental
     */
    BrowserModule.withServerTransition = function (params) {
        return {
            ngModule: BrowserModule_1,
            providers: [
                { provide: core_1.APP_ID, useValue: params.appId },
                { provide: server_transition_1.TRANSITION_ID, useExisting: core_1.APP_ID },
                server_transition_1.SERVER_TRANSITION_PROVIDERS,
            ],
        };
    };
    return BrowserModule;
}());
BrowserModule = BrowserModule_1 = __decorate([
    core_1.NgModule({
        providers: [
            exports.BROWSER_SANITIZATION_PROVIDERS,
            { provide: core_1.ErrorHandler, useFactory: errorHandler, deps: [] },
            { provide: event_manager_1.EVENT_MANAGER_PLUGINS, useClass: dom_events_1.DomEventsPlugin, multi: true },
            { provide: event_manager_1.EVENT_MANAGER_PLUGINS, useClass: key_events_1.KeyEventsPlugin, multi: true },
            { provide: event_manager_1.EVENT_MANAGER_PLUGINS, useClass: hammer_gestures_1.HammerGesturesPlugin, multi: true },
            { provide: hammer_gestures_1.HAMMER_GESTURE_CONFIG, useClass: hammer_gestures_1.HammerGestureConfig },
            dom_renderer_1.DomRendererFactory2,
            { provide: core_1.RendererFactory2, useExisting: dom_renderer_1.DomRendererFactory2 },
            { provide: shared_styles_host_1.SharedStylesHost, useExisting: shared_styles_host_1.DomSharedStylesHost },
            shared_styles_host_1.DomSharedStylesHost,
            core_1.Testability,
            event_manager_1.EventManager,
            ng_probe_1.ELEMENT_PROBE_PROVIDERS,
            meta_1.Meta,
            title_1.Title,
        ],
        exports: [common_1.CommonModule, core_1.ApplicationModule]
    }),
    __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()),
    __metadata("design:paramtypes", [BrowserModule])
], BrowserModule);
exports.BrowserModule = BrowserModule;
var BrowserModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBNEc7QUFDNUcsc0NBQXNSO0FBRXRSLDZEQUE0RDtBQUM1RCwwRkFBcUY7QUFDckYsdUNBQW9DO0FBQ3BDLGlFQUF1RjtBQUN2RixxREFBNEQ7QUFDNUQseUNBQXNDO0FBQ3RDLGlEQUE2RDtBQUU3RCxtREFBdUQ7QUFDdkQsK0NBQTBDO0FBQzFDLHNEQUF3RDtBQUN4RCw0REFBK0U7QUFDL0UsZ0VBQThHO0FBQzlHLHNEQUF3RDtBQUN4RCwrREFBK0U7QUFDL0UsZ0ZBQW1GO0FBRXRFLFFBQUEsbUNBQW1DLEdBQXFCO0lBQ25FLEVBQUMsT0FBTyxFQUFFLGtCQUFXLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDO0lBQ3JELEVBQUMsT0FBTyxFQUFFLDJCQUFvQixFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUN0RSxFQUFDLE9BQU8sRUFBRSx5QkFBZ0IsRUFBRSxRQUFRLEVBQUUsbURBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQVEsQ0FBQyxFQUFDO0lBQ2hGLEVBQUMsT0FBTyxFQUFFLHFCQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0NBQ3JELENBQUM7QUFFRjs7Ozs7R0FLRztBQUNVLFFBQUEsOEJBQThCLEdBQXFCO0lBQzlELEVBQUMsT0FBTyxFQUFFLGdCQUFTLEVBQUUsV0FBVyxFQUFFLHVDQUFZLEVBQUM7SUFDL0MsRUFBQyxPQUFPLEVBQUUsdUNBQVksRUFBRSxRQUFRLEVBQUUsMkNBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQVEsQ0FBQyxFQUFDO0NBQ3RFLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUN4Qiw0QkFBcUIsQ0FBQyxtQkFBWSxFQUFFLFNBQVMsRUFBRSwyQ0FBbUMsQ0FBQyxDQUFDO0FBRXhGO0lBQ0UsbUNBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsbUNBQXFCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0IsQ0FBQztBQUhELHdDQUdDO0FBRUQ7SUFDRSxNQUFNLENBQUMsSUFBSSxtQkFBWSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUZELG9DQUVDO0FBRUQ7SUFDRSxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFGRCw4QkFFQztBQUVEOzs7O0dBSUc7QUFxQkgsSUFBYSxhQUFhO0lBQ3hCLHVCQUFvQyxZQUEyQjtRQUM3RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQ1gsK0pBQStKLENBQUMsQ0FBQztRQUN2SyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGtDQUFvQixHQUEzQixVQUE0QixNQUF1QjtRQUNqRCxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsZUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsYUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFDO2dCQUN6QyxFQUFDLE9BQU8sRUFBRSxpQ0FBYSxFQUFFLFdBQVcsRUFBRSxhQUFNLEVBQUM7Z0JBQzdDLCtDQUEyQjthQUM1QjtTQUNGLENBQUM7SUFDSixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDO0FBekJZLGFBQWE7SUFwQnpCLGVBQVEsQ0FBQztRQUNSLFNBQVMsRUFBRTtZQUNULHNDQUE4QjtZQUM5QixFQUFDLE9BQU8sRUFBRSxtQkFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztZQUMzRCxFQUFDLE9BQU8sRUFBRSxxQ0FBcUIsRUFBRSxRQUFRLEVBQUUsNEJBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1lBQ3hFLEVBQUMsT0FBTyxFQUFFLHFDQUFxQixFQUFFLFFBQVEsRUFBRSw0QkFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7WUFDeEUsRUFBQyxPQUFPLEVBQUUscUNBQXFCLEVBQUUsUUFBUSxFQUFFLHNDQUFvQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7WUFDN0UsRUFBQyxPQUFPLEVBQUUsdUNBQXFCLEVBQUUsUUFBUSxFQUFFLHFDQUFtQixFQUFDO1lBQy9ELGtDQUFtQjtZQUNuQixFQUFDLE9BQU8sRUFBRSx1QkFBZ0IsRUFBRSxXQUFXLEVBQUUsa0NBQW1CLEVBQUM7WUFDN0QsRUFBQyxPQUFPLEVBQUUscUNBQWdCLEVBQUUsV0FBVyxFQUFFLHdDQUFtQixFQUFDO1lBQzdELHdDQUFtQjtZQUNuQixrQkFBVztZQUNYLDRCQUFZO1lBQ1osa0NBQXVCO1lBQ3ZCLFdBQUk7WUFDSixhQUFLO1NBQ047UUFDRCxPQUFPLEVBQUUsQ0FBQyxxQkFBWSxFQUFFLHdCQUFpQixDQUFDO0tBQzNDLENBQUM7SUFFYSxXQUFBLGVBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxlQUFRLEVBQUUsQ0FBQTtxQ0FBZSxhQUFhO0dBRHBELGFBQWEsQ0F5QnpCO0FBekJZLHNDQUFhIn0=