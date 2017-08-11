"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @whatItDoes Provides a way to migrate AngularJS applications to Angular.
 *
 * @experimental
 */
var UrlHandlingStrategy = (function () {
    function UrlHandlingStrategy() {
    }
    return UrlHandlingStrategy;
}());
exports.UrlHandlingStrategy = UrlHandlingStrategy;
/**
 * @experimental
 */
var DefaultUrlHandlingStrategy = (function () {
    function DefaultUrlHandlingStrategy() {
    }
    DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) { return true; };
    DefaultUrlHandlingStrategy.prototype.extract = function (url) { return url; };
    DefaultUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) { return newUrlPart; };
    return DefaultUrlHandlingStrategy;
}());
exports.DefaultUrlHandlingStrategy = DefaultUrlHandlingStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX2hhbmRsaW5nX3N0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy91cmxfaGFuZGxpbmdfc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSDs7OztHQUlHO0FBQ0g7SUFBQTtJQXFCQSxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJxQixrREFBbUI7QUF1QnpDOztHQUVHO0FBQ0g7SUFBQTtJQUlBLENBQUM7SUFIQyxxREFBZ0IsR0FBaEIsVUFBaUIsR0FBWSxJQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELDRDQUFPLEdBQVAsVUFBUSxHQUFZLElBQWEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsMENBQUssR0FBTCxVQUFNLFVBQW1CLEVBQUUsUUFBaUIsSUFBYSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMvRSxpQ0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksZ0VBQTBCIn0=