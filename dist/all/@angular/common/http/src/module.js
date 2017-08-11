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
var backend_1 = require("./backend");
var client_1 = require("./client");
var interceptor_1 = require("./interceptor");
var jsonp_1 = require("./jsonp");
var xhr_1 = require("./xhr");
var xsrf_1 = require("./xsrf");
/**
 * Constructs an `HttpHandler` that applies a bunch of `HttpInterceptor`s
 * to a request before passing it to the given `HttpBackend`.
 *
 * Meant to be used as a factory function within `HttpClientModule`.
 *
 * @experimental
 */
function interceptingHandler(backend, interceptors) {
    if (interceptors === void 0) { interceptors = []; }
    if (!interceptors) {
        return backend;
    }
    return interceptors.reduceRight(function (next, interceptor) { return new interceptor_1.HttpInterceptorHandler(next, interceptor); }, backend);
}
exports.interceptingHandler = interceptingHandler;
/**
 * Factory function that determines where to store JSONP callbacks.
 *
 * Ordinarily JSONP callbacks are stored on the `window` object, but this may not exist
 * in test environments. In that case, callbacks are stored on an anonymous object instead.
 *
 * @experimental
 */
function jsonpCallbackContext() {
    if (typeof window === 'object') {
        return window;
    }
    return {};
}
exports.jsonpCallbackContext = jsonpCallbackContext;
/**
 * `NgModule` which adds XSRF protection support to outgoing requests.
 *
 * Provided the server supports a cookie-based XSRF protection system, this
 * module can be used directly to configure XSRF protection with the correct
 * cookie and header names.
 *
 * If no such names are provided, the default is to use `X-XSRF-TOKEN` for
 * the header name and `XSRF-TOKEN` for the cookie name.
 *
 * @experimental
 */
var HttpClientXsrfModule = HttpClientXsrfModule_1 = (function () {
    function HttpClientXsrfModule() {
    }
    /**
     * Disable the default XSRF protection.
     */
    HttpClientXsrfModule.disable = function () {
        return {
            ngModule: HttpClientXsrfModule_1,
            providers: [
                { provide: xsrf_1.HttpXsrfInterceptor, useClass: interceptor_1.NoopInterceptor },
            ],
        };
    };
    /**
     * Configure XSRF protection to use the given cookie name or header name,
     * or the default names (as described above) if not provided.
     */
    HttpClientXsrfModule.withOptions = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: HttpClientXsrfModule_1,
            providers: [
                options.cookieName ? { provide: xsrf_1.XSRF_COOKIE_NAME, useValue: options.cookieName } : [],
                options.headerName ? { provide: xsrf_1.XSRF_HEADER_NAME, useValue: options.headerName } : [],
            ],
        };
    };
    return HttpClientXsrfModule;
}());
HttpClientXsrfModule = HttpClientXsrfModule_1 = __decorate([
    core_1.NgModule({
        providers: [
            xsrf_1.HttpXsrfInterceptor,
            { provide: interceptor_1.HTTP_INTERCEPTORS, useExisting: xsrf_1.HttpXsrfInterceptor, multi: true },
            { provide: xsrf_1.HttpXsrfTokenExtractor, useClass: xsrf_1.HttpXsrfCookieExtractor },
            { provide: xsrf_1.XSRF_COOKIE_NAME, useValue: 'XSRF-TOKEN' },
            { provide: xsrf_1.XSRF_HEADER_NAME, useValue: 'X-XSRF-TOKEN' },
        ],
    })
], HttpClientXsrfModule);
exports.HttpClientXsrfModule = HttpClientXsrfModule;
/**
 * `NgModule` which provides the `HttpClient` and associated services.
 *
 * Interceptors can be added to the chain behind `HttpClient` by binding them
 * to the multiprovider for `HTTP_INTERCEPTORS`.
 *
 * @experimental
 */
var HttpClientModule = (function () {
    function HttpClientModule() {
    }
    return HttpClientModule;
}());
HttpClientModule = __decorate([
    core_1.NgModule({
        imports: [
            HttpClientXsrfModule.withOptions({
                cookieName: 'XSRF-TOKEN',
                headerName: 'X-XSRF-TOKEN',
            }),
        ],
        providers: [
            client_1.HttpClient,
            // HttpHandler is the backend + interceptors and is constructed
            // using the interceptingHandler factory function.
            {
                provide: backend_1.HttpHandler,
                useFactory: interceptingHandler,
                deps: [backend_1.HttpBackend, [new core_1.Optional(), new core_1.Inject(interceptor_1.HTTP_INTERCEPTORS)]],
            },
            xhr_1.HttpXhrBackend,
            { provide: backend_1.HttpBackend, useExisting: xhr_1.HttpXhrBackend },
            xhr_1.BrowserXhr,
            { provide: xhr_1.XhrFactory, useExisting: xhr_1.BrowserXhr },
        ],
    })
], HttpClientModule);
exports.HttpClientModule = HttpClientModule;
/**
 * `NgModule` which enables JSONP support in `HttpClient`.
 *
 * Without this module, Jsonp requests will reach the backend
 * with method JSONP, where they'll be rejected.
 *
 * @experimental
 */
var HttpClientJsonpModule = (function () {
    function HttpClientJsonpModule() {
    }
    return HttpClientJsonpModule;
}());
HttpClientJsonpModule = __decorate([
    core_1.NgModule({
        providers: [
            jsonp_1.JsonpClientBackend,
            { provide: jsonp_1.JsonpCallbackContext, useFactory: jsonpCallbackContext },
            { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: jsonp_1.JsonpInterceptor, multi: true },
        ],
    })
], HttpClientJsonpModule);
exports.HttpClientJsonpModule = HttpClientJsonpModule;
var HttpClientXsrfModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUE4RTtBQUU5RSxxQ0FBbUQ7QUFDbkQsbUNBQW9DO0FBQ3BDLDZDQUEwRztBQUMxRyxpQ0FBbUY7QUFDbkYsNkJBQTZEO0FBQzdELCtCQUFnSTtBQUloSTs7Ozs7OztHQU9HO0FBQ0gsNkJBQ0ksT0FBb0IsRUFBRSxZQUEyQztJQUEzQyw2QkFBQSxFQUFBLGlCQUEyQztJQUNuRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQzNCLFVBQUMsSUFBSSxFQUFFLFdBQVcsSUFBSyxPQUFBLElBQUksb0NBQXNCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUE3QyxDQUE2QyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFQRCxrREFPQztBQUVEOzs7Ozs7O0dBT0c7QUFDSDtJQUNFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFMRCxvREFLQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBVUgsSUFBYSxvQkFBb0I7SUFBakM7SUE2QkEsQ0FBQztJQTVCQzs7T0FFRztJQUNJLDRCQUFPLEdBQWQ7UUFDRSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSwwQkFBbUIsRUFBRSxRQUFRLEVBQUUsNkJBQWUsRUFBQzthQUMxRDtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksZ0NBQVcsR0FBbEIsVUFBbUIsT0FHYjtRQUhhLHdCQUFBLEVBQUEsWUFHYjtRQUNKLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxzQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNULE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBQyxPQUFPLEVBQUUsdUJBQWdCLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUMsR0FBRyxFQUFFO2dCQUNuRixPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUMsT0FBTyxFQUFFLHVCQUFnQixFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsVUFBVSxFQUFDLEdBQUcsRUFBRTthQUNwRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBN0JZLG9CQUFvQjtJQVRoQyxlQUFRLENBQUM7UUFDUixTQUFTLEVBQUU7WUFDVCwwQkFBbUI7WUFDbkIsRUFBQyxPQUFPLEVBQUUsK0JBQWlCLEVBQUUsV0FBVyxFQUFFLDBCQUFtQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7WUFDM0UsRUFBQyxPQUFPLEVBQUUsNkJBQXNCLEVBQUUsUUFBUSxFQUFFLDhCQUF1QixFQUFDO1lBQ3BFLEVBQUMsT0FBTyxFQUFFLHVCQUFnQixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUM7WUFDbkQsRUFBQyxPQUFPLEVBQUUsdUJBQWdCLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQztTQUN0RDtLQUNGLENBQUM7R0FDVyxvQkFBb0IsQ0E2QmhDO0FBN0JZLG9EQUFvQjtBQStCakM7Ozs7Ozs7R0FPRztBQXVCSCxJQUFhLGdCQUFnQjtJQUE3QjtJQUNBLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksZ0JBQWdCO0lBdEI1QixlQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCxvQkFBb0IsQ0FBQyxXQUFXLENBQUM7Z0JBQy9CLFVBQVUsRUFBRSxZQUFZO2dCQUN4QixVQUFVLEVBQUUsY0FBYzthQUMzQixDQUFDO1NBQ0g7UUFDRCxTQUFTLEVBQUU7WUFDVCxtQkFBVTtZQUNWLCtEQUErRDtZQUMvRCxrREFBa0Q7WUFDbEQ7Z0JBQ0UsT0FBTyxFQUFFLHFCQUFXO2dCQUNwQixVQUFVLEVBQUUsbUJBQW1CO2dCQUMvQixJQUFJLEVBQUUsQ0FBQyxxQkFBVyxFQUFFLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRSxJQUFJLGFBQU0sQ0FBQywrQkFBaUIsQ0FBQyxDQUFDLENBQUM7YUFDckU7WUFDRCxvQkFBYztZQUNkLEVBQUMsT0FBTyxFQUFFLHFCQUFXLEVBQUUsV0FBVyxFQUFFLG9CQUFjLEVBQUM7WUFDbkQsZ0JBQVU7WUFDVixFQUFDLE9BQU8sRUFBRSxnQkFBVSxFQUFFLFdBQVcsRUFBRSxnQkFBVSxFQUFDO1NBQy9DO0tBQ0YsQ0FBQztHQUNXLGdCQUFnQixDQUM1QjtBQURZLDRDQUFnQjtBQUc3Qjs7Ozs7OztHQU9HO0FBUUgsSUFBYSxxQkFBcUI7SUFBbEM7SUFDQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLHFCQUFxQjtJQVBqQyxlQUFRLENBQUM7UUFDUixTQUFTLEVBQUU7WUFDVCwwQkFBa0I7WUFDbEIsRUFBQyxPQUFPLEVBQUUsNEJBQW9CLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFDO1lBQ2pFLEVBQUMsT0FBTyxFQUFFLCtCQUFpQixFQUFFLFFBQVEsRUFBRSx3QkFBZ0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO1NBQ3RFO0tBQ0YsQ0FBQztHQUNXLHFCQUFxQixDQUNqQztBQURZLHNEQUFxQiJ9