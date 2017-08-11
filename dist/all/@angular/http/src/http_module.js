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
/**
 * @module
 * @description
 * The http module provides services to perform http requests. To get started, see the {@link Http}
 * class.
 */
var core_1 = require("@angular/core");
var browser_jsonp_1 = require("./backends/browser_jsonp");
var browser_xhr_1 = require("./backends/browser_xhr");
var jsonp_backend_1 = require("./backends/jsonp_backend");
var xhr_backend_1 = require("./backends/xhr_backend");
var base_request_options_1 = require("./base_request_options");
var base_response_options_1 = require("./base_response_options");
var http_1 = require("./http");
var interfaces_1 = require("./interfaces");
function _createDefaultCookieXSRFStrategy() {
    return new xhr_backend_1.CookieXSRFStrategy();
}
exports._createDefaultCookieXSRFStrategy = _createDefaultCookieXSRFStrategy;
function httpFactory(xhrBackend, requestOptions) {
    return new http_1.Http(xhrBackend, requestOptions);
}
exports.httpFactory = httpFactory;
function jsonpFactory(jsonpBackend, requestOptions) {
    return new http_1.Jsonp(jsonpBackend, requestOptions);
}
exports.jsonpFactory = jsonpFactory;
/**
 * The module that includes http's providers
 *
 * @experimental
 */
var HttpModule = (function () {
    function HttpModule() {
    }
    return HttpModule;
}());
HttpModule = __decorate([
    core_1.NgModule({
        providers: [
            // TODO(pascal): use factory type annotations once supported in DI
            // issue: https://github.com/angular/angular/issues/3183
            { provide: http_1.Http, useFactory: httpFactory, deps: [xhr_backend_1.XHRBackend, base_request_options_1.RequestOptions] },
            browser_xhr_1.BrowserXhr,
            { provide: base_request_options_1.RequestOptions, useClass: base_request_options_1.BaseRequestOptions },
            { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
            xhr_backend_1.XHRBackend,
            { provide: interfaces_1.XSRFStrategy, useFactory: _createDefaultCookieXSRFStrategy },
        ],
    })
], HttpModule);
exports.HttpModule = HttpModule;
/**
 * The module that includes jsonp's providers
 *
 * @experimental
 */
var JsonpModule = (function () {
    function JsonpModule() {
    }
    return JsonpModule;
}());
JsonpModule = __decorate([
    core_1.NgModule({
        providers: [
            // TODO(pascal): use factory type annotations once supported in DI
            // issue: https://github.com/angular/angular/issues/3183
            { provide: http_1.Jsonp, useFactory: jsonpFactory, deps: [jsonp_backend_1.JSONPBackend, base_request_options_1.RequestOptions] },
            browser_jsonp_1.BrowserJsonp,
            { provide: base_request_options_1.RequestOptions, useClass: base_request_options_1.BaseRequestOptions },
            { provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
            { provide: jsonp_backend_1.JSONPBackend, useClass: jsonp_backend_1.JSONPBackend_ },
        ],
    })
], JsonpModule);
exports.JsonpModule = JsonpModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9odHRwX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVIOzs7OztHQUtHO0FBQ0gsc0NBQXVDO0FBRXZDLDBEQUFzRDtBQUN0RCxzREFBa0Q7QUFDbEQsMERBQXFFO0FBQ3JFLHNEQUFzRTtBQUN0RSwrREFBMEU7QUFDMUUsaUVBQTZFO0FBQzdFLCtCQUFtQztBQUNuQywyQ0FBMEM7QUFHMUM7SUFDRSxNQUFNLENBQUMsSUFBSSxnQ0FBa0IsRUFBRSxDQUFDO0FBQ2xDLENBQUM7QUFGRCw0RUFFQztBQUVELHFCQUE0QixVQUFzQixFQUFFLGNBQThCO0lBQ2hGLE1BQU0sQ0FBQyxJQUFJLFdBQUksQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUZELGtDQUVDO0FBRUQsc0JBQTZCLFlBQTBCLEVBQUUsY0FBOEI7SUFDckYsTUFBTSxDQUFDLElBQUksWUFBSyxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRkQsb0NBRUM7QUFHRDs7OztHQUlHO0FBYUgsSUFBYSxVQUFVO0lBQXZCO0lBQ0EsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxVQUFVO0lBWnRCLGVBQVEsQ0FBQztRQUNSLFNBQVMsRUFBRTtZQUNULGtFQUFrRTtZQUNsRSx3REFBd0Q7WUFDeEQsRUFBQyxPQUFPLEVBQUUsV0FBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsd0JBQVUsRUFBRSxxQ0FBYyxDQUFDLEVBQUM7WUFDNUUsd0JBQVU7WUFDVixFQUFDLE9BQU8sRUFBRSxxQ0FBYyxFQUFFLFFBQVEsRUFBRSx5Q0FBa0IsRUFBQztZQUN2RCxFQUFDLE9BQU8sRUFBRSx1Q0FBZSxFQUFFLFFBQVEsRUFBRSwyQ0FBbUIsRUFBQztZQUN6RCx3QkFBVTtZQUNWLEVBQUMsT0FBTyxFQUFFLHlCQUFZLEVBQUUsVUFBVSxFQUFFLGdDQUFnQyxFQUFDO1NBQ3RFO0tBQ0YsQ0FBQztHQUNXLFVBQVUsQ0FDdEI7QUFEWSxnQ0FBVTtBQUd2Qjs7OztHQUlHO0FBWUgsSUFBYSxXQUFXO0lBQXhCO0lBQ0EsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxXQUFXO0lBWHZCLGVBQVEsQ0FBQztRQUNSLFNBQVMsRUFBRTtZQUNULGtFQUFrRTtZQUNsRSx3REFBd0Q7WUFDeEQsRUFBQyxPQUFPLEVBQUUsWUFBSyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsNEJBQVksRUFBRSxxQ0FBYyxDQUFDLEVBQUM7WUFDaEYsNEJBQVk7WUFDWixFQUFDLE9BQU8sRUFBRSxxQ0FBYyxFQUFFLFFBQVEsRUFBRSx5Q0FBa0IsRUFBQztZQUN2RCxFQUFDLE9BQU8sRUFBRSx1Q0FBZSxFQUFFLFFBQVEsRUFBRSwyQ0FBbUIsRUFBQztZQUN6RCxFQUFDLE9BQU8sRUFBRSw0QkFBWSxFQUFFLFFBQVEsRUFBRSw2QkFBYSxFQUFDO1NBQ2pEO0tBQ0YsQ0FBQztHQUNXLFdBQVcsQ0FDdkI7QUFEWSxrQ0FBVyJ9