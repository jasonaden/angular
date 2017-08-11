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
var Observable_1 = require("rxjs/Observable");
var request_1 = require("./request");
/**
 * A testing backend for `HttpClient` which both acts as an `HttpBackend`
 * and as the `HttpTestingController`.
 *
 * `HttpClientTestingBackend` works by keeping a list of all open requests.
 * As requests come in, they're added to the list. Users can assert that specific
 * requests were made and then flush them. In the end, a verify() method asserts
 * that no unexpected requests were made.
 *
 * @experimental
 */
var HttpClientTestingBackend = (function () {
    function HttpClientTestingBackend() {
        /**
         * List of pending requests which have not yet been expected.
         */
        this.open = [];
    }
    /**
     * Handle an incoming request by queueing it in the list of open requests.
     */
    HttpClientTestingBackend.prototype.handle = function (req) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var testReq = new request_1.TestRequest(req, observer);
            _this.open.push(testReq);
            observer.next({ type: http_1.HttpEventType.Sent });
            return function () { testReq._cancelled = true; };
        });
    };
    /**
     * Helper function to search for requests in the list of open requests.
     */
    HttpClientTestingBackend.prototype._match = function (match) {
        if (typeof match === 'string') {
            return this.open.filter(function (testReq) { return testReq.request.urlWithParams === match; });
        }
        else if (typeof match === 'function') {
            return this.open.filter(function (testReq) { return match(testReq.request); });
        }
        else {
            return this.open.filter(function (testReq) { return (!match.method || testReq.request.method === match.method.toUpperCase()) &&
                (!match.url || testReq.request.urlWithParams === match.url); });
        }
    };
    /**
     * Search for requests in the list of open requests, and return all that match
     * without asserting anything about the number of matches.
     */
    HttpClientTestingBackend.prototype.match = function (match) {
        var _this = this;
        var results = this._match(match);
        results.forEach(function (result) {
            var index = _this.open.indexOf(result);
            if (index !== -1) {
                _this.open.splice(index, 1);
            }
        });
        return results;
    };
    /**
     * Expect that a single outstanding request matches the given matcher, and return
     * it.
     *
     * Requests returned through this API will no longer be in the list of open requests,
     * and thus will not match twice.
     */
    HttpClientTestingBackend.prototype.expectOne = function (match, description) {
        description = description || this.descriptionFromMatcher(match);
        var matches = this.match(match);
        if (matches.length > 1) {
            throw new Error("Expected one matching request for criteria \"" + description + "\", found " + matches.length + " requests.");
        }
        if (matches.length === 0) {
            throw new Error("Expected one matching request for criteria \"" + description + "\", found none.");
        }
        return matches[0];
    };
    /**
     * Expect that no outstanding requests match the given matcher, and throw an error
     * if any do.
     */
    HttpClientTestingBackend.prototype.expectNone = function (match, description) {
        description = description || this.descriptionFromMatcher(match);
        var matches = this.match(match);
        if (matches.length > 0) {
            throw new Error("Expected zero matching requests for criteria \"" + description + "\", found " + matches.length + ".");
        }
    };
    /**
     * Validate that there are no outstanding requests.
     */
    HttpClientTestingBackend.prototype.verify = function (opts) {
        if (opts === void 0) { opts = {}; }
        var open = this.open;
        // It's possible that some requests may be cancelled, and this is expected.
        // The user can ask to ignore open requests which have been cancelled.
        if (opts.ignoreCancelled) {
            open = open.filter(function (testReq) { return !testReq.cancelled; });
        }
        if (open.length > 0) {
            // Show the methods and URLs of open requests in the error, for convenience.
            var requests = open.map(function (testReq) {
                var url = testReq.request.urlWithParams.split('?')[0];
                var method = testReq.request.method;
                return method + " " + url;
            })
                .join(', ');
            throw new Error("Expected no open requests, found " + open.length + ": " + requests);
        }
    };
    HttpClientTestingBackend.prototype.descriptionFromMatcher = function (matcher) {
        if (typeof matcher === 'string') {
            return "Match URL: " + matcher;
        }
        else if (typeof matcher === 'object') {
            var method = matcher.method || '(any)';
            var url = matcher.url || '(any)';
            return "Match method: " + method + ", URL: " + url;
        }
        else {
            return "Match by function: " + matcher.name;
        }
    };
    return HttpClientTestingBackend;
}());
HttpClientTestingBackend = __decorate([
    core_1.Injectable()
], HttpClientTestingBackend);
exports.HttpClientTestingBackend = HttpClientTestingBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3Rpbmcvc3JjL2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw2Q0FBd0Y7QUFDeEYsc0NBQXlDO0FBQ3pDLDhDQUEyQztBQUszQyxxQ0FBc0M7QUFHdEM7Ozs7Ozs7Ozs7R0FVRztBQUVILElBQWEsd0JBQXdCO0lBRHJDO1FBRUU7O1dBRUc7UUFDSyxTQUFJLEdBQWtCLEVBQUUsQ0FBQztJQWlIbkMsQ0FBQztJQS9HQzs7T0FFRztJQUNILHlDQUFNLEdBQU4sVUFBTyxHQUFxQjtRQUE1QixpQkFPQztRQU5DLE1BQU0sQ0FBQyxJQUFJLHVCQUFVLENBQUMsVUFBQyxRQUF1QjtZQUM1QyxJQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQWEsQ0FBQyxJQUFJLEVBQW9CLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsY0FBUSxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLHlDQUFNLEdBQWQsVUFBZSxLQUErRDtRQUM1RSxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxLQUFLLEtBQUssRUFBdkMsQ0FBdUMs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