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
exports.XSRF_COOKIE_NAME = new core_1.InjectionToken('XSRF_COOKIE_NAME');
exports.XSRF_HEADER_NAME = new core_1.InjectionToken('XSRF_HEADER_NAME');
/**
 * Retrieves the current XSRF token to use with the next outgoing request.
 *
 * @experimental
 */
var HttpXsrfTokenExtractor = (function () {
    function HttpXsrfTokenExtractor() {
    }
    return HttpXsrfTokenExtractor;
}());
exports.HttpXsrfTokenExtractor = HttpXsrfTokenExtractor;
/**
 * `HttpXsrfTokenExtractor` which retrieves the token from a cookie.
 */
var HttpXsrfCookieExtractor = (function () {
    function HttpXsrfCookieExtractor(doc, platform, cookieName) {
        this.doc = doc;
        this.platform = platform;
        this.cookieName = cookieName;
        this.lastCookieString = '';
        this.lastToken = null;
        /**
         * @internal for testing
         */
        this.parseCount = 0;
    }
    HttpXsrfCookieExtractor.prototype.getToken = function () {
        if (this.platform === 'server') {
            return null;
        }
        var cookieString = this.doc.cookie || '';
        if (cookieString !== this.lastCookieString) {
            this.parseCount++;
            this.lastToken = common_1.ɵparseCookieValue(cookieString, this.cookieName);
            this.lastCookieString = cookieString;
        }
        return this.lastToken;
    };
    return HttpXsrfCookieExtractor;
}());
HttpXsrfCookieExtractor = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(common_1.DOCUMENT)), __param(1, core_1.Inject(core_1.PLATFORM_ID)),
    __param(2, core_1.Inject(exports.XSRF_COOKIE_NAME)),
    __metadata("design:paramtypes", [Object, String, String])
], HttpXsrfCookieExtractor);
exports.HttpXsrfCookieExtractor = HttpXsrfCookieExtractor;
/**
 * `HttpInterceptor` which adds an XSRF token to eligible outgoing requests.
 */
var HttpXsrfInterceptor = (function () {
    function HttpXsrfInterceptor(tokenService, headerName) {
        this.tokenService = tokenService;
        this.headerName = headerName;
    }
    HttpXsrfInterceptor.prototype.intercept = function (req, next) {
        var lcUrl = req.url.toLowerCase();
        // Skip both non-mutating requests and absolute URLs.
        // Non-mutating requests don't require a token, and absolute URLs require special handling
        // anyway as the cookie set
        // on our origin is not the same as the token expected by another origin.
        if (req.method === 'GET' || req.method === 'HEAD' || lcUrl.startsWith('http://') ||
            lcUrl.startsWith('https://')) {
            return next.handle(req);
        }
        var token = this.tokenService.getToken();
        // Be careful not to overwrite an existing header of the same name.
        if (token !== null && !req.headers.has(this.headerName)) {
            req = req.clone({ headers: req.headers.set(this.headerName, token) });
        }
        return next.handle(req);
    };
    return HttpXsrfInterceptor;
}());
HttpXsrfInterceptor = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(exports.XSRF_HEADER_NAME)),
    __metadata("design:paramtypes", [HttpXsrfTokenExtractor, String])
], HttpXsrfInterceptor);
exports.HttpXsrfInterceptor = HttpXsrfInterceptor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHNyZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3NyYy94c3JmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsMENBQWdGO0FBQ2hGLHNDQUE4RTtBQVFqRSxRQUFBLGdCQUFnQixHQUFHLElBQUkscUJBQWMsQ0FBUyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2xFLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxxQkFBYyxDQUFTLGtCQUFrQixDQUFDLENBQUM7QUFFL0U7Ozs7R0FJRztBQUNIO0lBQUE7SUFPQSxDQUFDO0lBQUQsNkJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBxQix3REFBc0I7QUFTNUM7O0dBRUc7QUFFSCxJQUFhLHVCQUF1QjtJQVNsQyxpQ0FDOEIsR0FBUSxFQUErQixRQUFnQixFQUMvQyxVQUFrQjtRQUQxQixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQStCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDL0MsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQVZoRCxxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDOUIsY0FBUyxHQUFnQixJQUFJLENBQUM7UUFFdEM7O1dBRUc7UUFDSCxlQUFVLEdBQVcsQ0FBQyxDQUFDO0lBSW9DLENBQUM7SUFFNUQsMENBQVEsR0FBUjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRywwQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUM7UUFDdkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksdUJBQXVCO0lBRG5DLGlCQUFVLEVBQUU7SUFXTixXQUFBLGFBQU0sQ0FBQyxpQkFBUSxDQUFDLENBQUEsRUFBb0IsV0FBQSxhQUFNLENBQUMsa0JBQVcsQ0FBQyxDQUFBO0lBQ3ZELFdBQUEsYUFBTSxDQUFDLHdCQUFnQixDQUFDLENBQUE7O0dBWGxCLHVCQUF1QixDQXlCbkM7QUF6QlksMERBQXVCO0FBMkJwQzs7R0FFRztBQUVILElBQWEsbUJBQW1CO0lBQzlCLDZCQUNZLFlBQW9DLEVBQ1YsVUFBa0I7UUFENUMsaUJBQVksR0FBWixZQUFZLENBQXdCO1FBQ1YsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUFHLENBQUM7SUFFNUQsdUNBQVMsR0FBVCxVQUFVLEdBQXFCLEVBQUUsSUFBaUI7UUFDaEQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQyxxREFBcUQ7UUFDckQsMEZBQTBGO1FBQzFGLDJCQUEyQjtRQUMzQix5RUFBeUU7UUFDekUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDNUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFM0MsbUVBQW1FO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBdkJELElBdUJDO0FBdkJZLG1CQUFtQjtJQUQvQixpQkFBVSxFQUFFO0lBSU4sV0FBQSxhQUFNLENBQUMsd0JBQWdCLENBQUMsQ0FBQTtxQ0FESCxzQkFBc0I7R0FGckMsbUJBQW1CLENBdUIvQjtBQXZCWSxrREFBbUIifQ==