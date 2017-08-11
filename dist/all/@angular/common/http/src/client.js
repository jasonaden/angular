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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var of_1 = require("rxjs/observable/of");
var concatMap_1 = require("rxjs/operator/concatMap");
var filter_1 = require("rxjs/operator/filter");
var map_1 = require("rxjs/operator/map");
var backend_1 = require("./backend");
var params_1 = require("./params");
var request_1 = require("./request");
var response_1 = require("./response");
/**
 * Construct an instance of `HttpRequestOptions<T>` from a source `HttpMethodOptions` and
 * the given `body`. Basically, this clones the object and adds the body.
 */
function addBody(options, body) {
    return {
        body: body,
        headers: options.headers,
        observe: options.observe,
        params: options.params,
        reportProgress: options.reportProgress,
        responseType: options.responseType,
        withCredentials: options.withCredentials,
    };
}
/**
 * Perform HTTP requests.
 *
 * `HttpClient` is available as an injectable class, with methods to perform HTTP requests.
 * Each request method has multiple signatures, and the return type varies according to which
 * signature is called (mainly the values of `observe` and `responseType`).
 *
 * @experimental
 */
var HttpClient = (function () {
    function HttpClient(handler) {
        this.handler = handler;
    }
    /**
     * Constructs an `Observable` for a particular HTTP request that, when subscribed,
     * fires the request through the chain of registered interceptors and on to the
     * server.
     *
     * This method can be called in one of two ways. Either an `HttpRequest`
     * instance can be passed directly as the only parameter, or a method can be
     * passed as the first parameter, a string URL as the second, and an
     * options hash as the third.
     *
     * If a `HttpRequest` object is passed directly, an `Observable` of the
     * raw `HttpEvent` stream will be returned.
     *
     * If a request is instead built by providing a URL, the options object
     * determines the return type of `request()`. In addition to configuring
     * request parameters such as the outgoing headers and/or the body, the options
     * hash specifies two key pieces of information about the request: the
     * `responseType` and what to `observe`.
     *
     * The `responseType` value determines how a successful response body will be
     * parsed. If `responseType` is the default `json`, a type interface for the
     * resulting object may be passed as a type parameter to `request()`.
     *
     * The `observe` value determines the return type of `request()`, based on what
     * the consumer is interested in observing. A value of `events` will return an
     * `Observable<HttpEvent>` representing the raw `HttpEvent` stream,
     * including progress events by default. A value of `response` will return an
     * `Observable<HttpResponse<T>>` where the `T` parameter of `HttpResponse`
     * depends on the `responseType` and any optionally provided type parameter.
     * A value of `body` will return an `Observable<T>` with the same `T` body type.
     */
    HttpClient.prototype.request = function (first, url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var req;
        // Firstly, check whether the primary argument is an instance of `HttpRequest`.
        if (first instanceof request_1.HttpRequest) {
            // It is. The other arguments must be undefined (per the signatures) and can be
            // ignored.
            req = first;
        }
        else {
            // It's a string, so it represents a URL. Construct a request based on it,
            // and incorporate the remaining arguments (assuming GET unless a method is
            // provided.
            req = new request_1.HttpRequest(first, url, options.body || null, {
                headers: options.headers,
                params: options.params,
                reportProgress: options.reportProgress,
                // By default, JSON is assumed to be returned for all calls.
                responseType: options.responseType || 'json',
                withCredentials: options.withCredentials,
            });
        }
        // Start with an Observable.of() the initial request, and run the handler (which
        // includes all interceptors) inside a concatMap(). This way, the handler runs
        // inside an Observable chain, which causes interceptors to be re-run on every
        // subscription (this also makes retries re-run the handler, including interceptors).
        var events$ = concatMap_1.concatMap.call(of_1.of(req), function (req) { return _this.handler.handle(req); });
        // If coming via the API signature which accepts a previously constructed HttpRequest,
        // the only option is to get the event stream. Otherwise, return the event stream if
        // that is what was requested.
        if (first instanceof request_1.HttpRequest || options.observe === 'events') {
            return events$;
        }
        // The requested stream contains either the full response or the body. In either
        // case, the first step is to filter the event stream to extract a stream of
        // responses(s).
        var res$ = filter_1.filter.call(events$, function (event) { return event instanceof response_1.HttpResponse; });
        // Decide which stream to return.
        switch (options.observe || 'body') {
            case 'body':
                // The requested stream is the body. Map the response stream to the response
                // body. This could be done more simply, but a misbehaving interceptor might
                // transform the response body into a different format and ignore the requested
                // responseType. Guard against this by validating that the response is of the
                // requested type.
                switch (req.responseType) {
                    case 'arraybuffer':
                        return map_1.map.call(res$, function (res) {
                            // Validate that the body is an ArrayBuffer.
                            if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
                                throw new Error('Response is not an ArrayBuffer.');
                            }
                            return res.body;
                        });
                    case 'blob':
                        return map_1.map.call(res$, function (res) {
                            // Validate that the body is a Blob.
                            if (res.body !== null && !(res.body instanceof Blob)) {
                                throw new Error('Response is not a Blob.');
                            }
                            return res.body;
                        });
                    case 'text':
                        return map_1.map.call(res$, function (res) {
                            // Validate that the body is a string.
                            if (res.body !== null && typeof res.body !== 'string') {
                                throw new Error('Response is not a string.');
                            }
                            return res.body;
                        });
                    case 'json':
                    default:
                        // No validation needed for JSON responses, as they can be of any type.
                        return map_1.map.call(res$, function (res) { return res.body; });
                }
            case 'response':
                // The response stream was requested directly, so return it.
                return res$;
            default:
                // Guard against new future observe types being added.
                throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
        }
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * DELETE request to be executed on the server. See the individual overloads for
     * details of `delete()`'s return type based on the provided options.
     */
    HttpClient.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('DELETE', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * GET request to be executed on the server. See the individual overloads for
     * details of `get()`'s return type based on the provided options.
     */
    HttpClient.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('GET', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * HEAD request to be executed on the server. See the individual overloads for
     * details of `head()`'s return type based on the provided options.
     */
    HttpClient.prototype.head = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('HEAD', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause a request
     * with the special method `JSONP` to be dispatched via the interceptor pipeline.
     *
     * A suitable interceptor must be installed (e.g. via the `HttpClientJsonpModule`).
     * If no such interceptor is reached, then the `JSONP` request will likely be
     * rejected by the configured backend.
     */
    HttpClient.prototype.jsonp = function (url, callbackParam) {
        return this.request('JSONP', url, {
            params: new params_1.HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
            observe: 'body',
            responseType: 'json',
        });
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * OPTIONS request to be executed on the server. See the individual overloads for
     * details of `options()`'s return type based on the provided options.
     */
    HttpClient.prototype.options = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request('OPTIONS', url, options);
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * PATCH request to be executed on the server. See the individual overloads for
     * details of `patch()`'s return type based on the provided options.
     */
    HttpClient.prototype.patch = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('PATCH', url, addBody(options, body));
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * POST request to be executed on the server. See the individual overloads for
     * details of `post()`'s return type based on the provided options.
     */
    HttpClient.prototype.post = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('POST', url, addBody(options, body));
    };
    /**
     * Constructs an `Observable` which, when subscribed, will cause the configured
     * POST request to be executed on the server. See the individual overloads for
     * details of `post()`'s return type based on the provided options.
     */
    HttpClient.prototype.put = function (url, body, options) {
        if (options === void 0) { options = {}; }
        return this.request('PUT', url, addBody(options, body));
    };
    return HttpClient;
}());
HttpClient = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [backend_1.HttpHandler])
], HttpClient);
exports.HttpClient = HttpClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUV6Qyx5Q0FBdUM7QUFDdkMscURBQWtEO0FBQ2xELCtDQUE0QztBQUM1Qyx5Q0FBc0M7QUFFdEMscUNBQXNDO0FBRXRDLG1DQUFvQztBQUNwQyxxQ0FBc0M7QUFDdEMsdUNBQW1EO0FBR25EOzs7R0FHRztBQUNILGlCQUNJLE9BT0MsRUFDRCxJQUFjO0lBQ2hCLE1BQU0sQ0FBQztRQUNMLElBQUksTUFBQTtRQUNKLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztRQUN4QixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87UUFDeEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztRQUN0QyxZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7UUFDbEMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0tBQ3pDLENBQUM7QUFDSixDQUFDO0FBT0Q7Ozs7Ozs7O0dBUUc7QUFFSCxJQUFhLFVBQVU7SUFDckIsb0JBQW9CLE9BQW9CO1FBQXBCLFlBQU8sR0FBUCxPQUFPLENBQWE7SUFBRyxDQUFDO0lBd041Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BOEJHO0lBQ0gsNEJBQU8sR0FBUCxVQUFRLEtBQThCLEVBQUUsR0FBWSxFQUFFLE9BUWhEO1FBUk4saUJBOEZDO1FBOUZxRCx3QkFBQSxFQUFBLFlBUWhEO1FBQ0osSUFBSSxHQUFxQixDQUFDO1FBQzFCLCtFQUErRTtRQUMvRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVkscUJBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakMsK0VBQStFO1lBQy9FLFdBQVc7WUFDWCxHQUFHLEdBQUcsS0FBeUIs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