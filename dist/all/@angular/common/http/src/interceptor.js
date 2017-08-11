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
/**
 * `HttpHandler` which applies an `HttpInterceptor` to an `HttpRequest`.
 *
 * @experimental
 */
var HttpInterceptorHandler = (function () {
    function HttpInterceptorHandler(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
    }
    HttpInterceptorHandler.prototype.handle = function (req) {
        return this.interceptor.intercept(req, this.next);
    };
    return HttpInterceptorHandler;
}());
exports.HttpInterceptorHandler = HttpInterceptorHandler;
/**
 * A multi-provider token which represents the array of `HttpInterceptor`s that
 * are registered.
 *
 * @experimental
 */
exports.HTTP_INTERCEPTORS = new core_1.InjectionToken('HTTP_INTERCEPTORS');
var NoopInterceptor = (function () {
    function NoopInterceptor() {
    }
    NoopInterceptor.prototype.intercept = function (req, next) {
        return next.handle(req);
    };
    return NoopInterceptor;
}());
NoopInterceptor = __decorate([
    core_1.Injectable()
], NoopInterceptor);
exports.NoopInterceptor = NoopInterceptor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC9zcmMvaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFzQ3pEOzs7O0dBSUc7QUFDSDtJQUNFLGdDQUFvQixJQUFpQixFQUFVLFdBQTRCO1FBQXZELFNBQUksR0FBSixJQUFJLENBQWE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7SUFBRyxDQUFDO0lBRS9FLHVDQUFNLEdBQU4sVUFBTyxHQUFxQjtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLHdEQUFzQjtBQVFuQzs7Ozs7R0FLRztBQUNVLFFBQUEsaUJBQWlCLEdBQUcsSUFBSSxxQkFBYyxDQUFvQixtQkFBbUIsQ0FBQyxDQUFDO0FBRzVGLElBQWEsZUFBZTtJQUE1QjtJQUlBLENBQUM7SUFIQyxtQ0FBUyxHQUFULFVBQVUsR0FBcUIsRUFBRSxJQUFpQjtRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLGVBQWU7SUFEM0IsaUJBQVUsRUFBRTtHQUNBLGVBQWUsQ0FJM0I7QUFKWSwwQ0FBZSJ9