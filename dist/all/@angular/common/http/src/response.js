"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("./headers");
/**
 * Type enumeration for the different kinds of `HttpEvent`.
 *
 * @experimental
 */
var HttpEventType;
(function (HttpEventType) {
    /**
     * The request was sent out over the wire.
     */
    HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
    /**
     * An upload progress event was received.
     */
    HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
    /**
     * The response status code and headers were received.
     */
    HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
    /**
     * A download progress event was received.
     */
    HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
    /**
     * The full response including the body was received.
     */
    HttpEventType[HttpEventType["Response"] = 4] = "Response";
    /**
     * A custom event from an interceptor or a backend.
     */
    HttpEventType[HttpEventType["User"] = 5] = "User";
})(HttpEventType = exports.HttpEventType || (exports.HttpEventType = {}));
/**
 * Base class for both `HttpResponse` and `HttpHeaderResponse`.
 *
 * @experimental
 */
var HttpResponseBase = (function () {
    /**
     * Super-constructor for all responses.
     *
     * The single parameter accepted is an initialization hash. Any properties
     * of the response passed there will override the default values.
     */
    function HttpResponseBase(init, defaultStatus, defaultStatusText) {
        if (defaultStatus === void 0) { defaultStatus = 200; }
        if (defaultStatusText === void 0) { defaultStatusText = 'OK'; }
        // If the hash has values passed, use them to initialize the response.
        // Otherwise use the default values.
        this.headers = init.headers || new headers_1.HttpHeaders();
        this.status = init.status !== undefined ? init.status : defaultStatus;
        this.statusText = init.statusText || defaultStatusText;
        this.url = init.url || null;
        // Cache the ok value to avoid defining a getter.
        this.ok = this.status >= 200 && this.status < 300;
    }
    return HttpResponseBase;
}());
exports.HttpResponseBase = HttpResponseBase;
/**
 * A partial HTTP response which only includes the status and header data,
 * but no response body.
 *
 * `HttpHeaderResponse` is a `HttpEvent` available on the response
 * event stream, only when progress events are requested.
 *
 * @experimental
 */
var HttpHeaderResponse = (function (_super) {
    __extends(HttpHeaderResponse, _super);
    /**
     * Create a new `HttpHeaderResponse` with the given parameters.
     */
    function HttpHeaderResponse(init) {
        if (init === void 0) { init = {}; }
        var _this = _super.call(this, init) || this;
        _this.type = HttpEventType.ResponseHeader;
        return _this;
    }
    /**
     * Copy this `HttpHeaderResponse`, overriding its contents with the
     * given parameter hash.
     */
    HttpHeaderResponse.prototype.clone = function (update) {
        if (update === void 0) { update = {}; }
        // Perform a straightforward initialization of the new HttpHeaderResponse,
        // overriding the current parameters with new ones if given.
        return new HttpHeaderResponse({
            headers: update.headers || this.headers,
            status: update.status !== undefined ? update.status : this.status,
            statusText: update.statusText || this.statusText,
            url: update.url || this.url || undefined,
        });
    };
    return HttpHeaderResponse;
}(HttpResponseBase));
exports.HttpHeaderResponse = HttpHeaderResponse;
/**
 * A full HTTP response, including a typed response body (which may be `null`
 * if one was not returned).
 *
 * `HttpResponse` is a `HttpEvent` available on the response event
 * stream.
 *
 * @experimental
 */
var HttpResponse = (function (_super) {
    __extends(HttpResponse, _super);
    /**
     * Construct a new `HttpResponse`.
     */
    function HttpResponse(init) {
        if (init === void 0) { init = {}; }
        var _this = _super.call(this, init) || this;
        _this.type = HttpEventType.Response;
        _this.body = init.body || null;
        return _this;
    }
    HttpResponse.prototype.clone = function (update) {
        if (update === void 0) { update = {}; }
        return new HttpResponse({
            body: (update.body !== undefined) ? update.body : this.body,
            headers: update.headers || this.headers,
            status: (update.status !== undefined) ? update.status : this.status,
            statusText: update.statusText || this.statusText,
            url: update.url || this.url || undefined,
        });
    };
    return HttpResponse;
}(HttpResponseBase));
exports.HttpResponse = HttpResponse;
/**
 * A response that represents an error or failure, either from a
 * non-successful HTTP status, an error while executing the request,
 * or some other failure which occurred during the parsing of the response.
 *
 * Any error returned on the `Observable` response stream will be
 * wrapped in an `HttpErrorResponse` to provide additional context about
 * the state of the HTTP layer when the error occurred. The error property
 * will contain either a wrapped Error object or the error response returned
 * from the server.
 *
 * @experimental
 */
var HttpErrorResponse = (function (_super) {
    __extends(HttpErrorResponse, _super);
    function HttpErrorResponse(init) {
        var _this = 
        // Initialize with a default status of 0 / Unknown Error.
        _super.call(this, init, 0, 'Unknown Error') || this;
        _this.name = 'HttpErrorResponse';
        /**
         * Errors are never okay, even when the status code is in the 2xx success range.
         */
        _this.ok = false;
        // If the response was successful, then this was a parse error. Otherwise, it was
        // a protocol-level failure of some sort. Either the request failed in transit
        // or the server returned an unsuccessful status code.
        if (_this.status >= 200 && _this.status < 300) {
            _this.message = "Http failure during parsing for " + (init.url || '(unknown url)');
        }
        else {
            _this.message =
                "Http failure response for " + (init.url || '(unknown url)') + ": " + init.status + " " + init.statusText;
        }
        _this.error = init.error || null;
        return _this;
    }
    return HttpErrorResponse;
}(HttpResponseBase));
exports.HttpErrorResponse = HttpErrorResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC9zcmMvcmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgscUNBQXNDO0FBRXRDOzs7O0dBSUc7QUFDSCxJQUFZLGFBOEJYO0FBOUJELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILGlEQUFJLENBQUE7SUFFSjs7T0FFRztJQUNILHFFQUFjLENBQUE7SUFFZDs7T0FFRztJQUNILHFFQUFjLENBQUE7SUFFZDs7T0FFRztJQUNILHlFQUFnQixDQUFBO0lBRWhCOztPQUVHO0lBQ0gseURBQVEsQ0FBQTtJQUVSOztPQUVHO0lBQ0gsaURBQUksQ0FBQTtBQUNOLENBQUMsRUE5QlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUE4QnhCO0FBNEZEOzs7O0dBSUc7QUFDSDtJQWlDRTs7Ozs7T0FLRztJQUNILDBCQUNJLElBS0MsRUFDRCxhQUEyQixFQUFFLGlCQUFnQztRQUE3RCw4QkFBQSxFQUFBLG1CQUEyQjtRQUFFLGtDQUFBLEVBQUEsd0JBQWdDO1FBQy9ELHNFQUFzRTtRQUN0RSxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUkscUJBQVcsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7UUFDdEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLGlCQUFpQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUM7UUFFNUIsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFDcEQsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQXpERCxJQXlEQztBQXpEcUIsNENBQWdCO0FBMkR0Qzs7Ozs7Ozs7R0FRRztBQUNIO0lBQXdDLHNDQUFnQjtJQUN0RDs7T0FFRztJQUNILDRCQUFZLElBS047UUFMTSxxQkFBQSxFQUFBLFNBS047UUFMTixZQU1FLGtCQUFNLElBQUksQ0FBQyxTQUNaO1FBRVEsVUFBSSxHQUFpQyxhQUFhLENBQUMsY0FBYyxDQUFDOztJQUYzRSxDQUFDO0lBSUQ7OztPQUdHO0lBQ0gsa0NBQUssR0FBTCxVQUFNLE1BQXlGO1FBQXpGLHVCQUFBLEVBQUEsV0FBeUY7UUFFN0YsMEVBQTBFO1FBQzFFLDREQUE0RDtRQUM1RCxNQUFNLENBQUMsSUFBSSxrQkFBa0IsQ0FBQztZQUM1QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTztZQUN2QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtZQUNqRSxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNoRCxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLFNBQVM7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTlCRCxDQUF3QyxnQkFBZ0IsR0E4QnZEO0FBOUJZLGdEQUFrQjtBQWdDL0I7Ozs7Ozs7O0dBUUc7QUFDSDtJQUFxQyxnQ0FBZ0I7SUFNbkQ7O09BRUc7SUFDSCxzQkFBWSxJQUVOO1FBRk0scUJBQUEsRUFBQSxTQUVOO1FBRk4sWUFHRSxrQkFBTSxJQUFJLENBQUMsU0FFWjtRQUVRLFVBQUksR0FBMkIsYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUg3RCxLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDOztJQUNoQyxDQUFDO0lBVUQsNEJBQUssR0FBTCxVQUFNLE1BRUE7UUFGQSx1QkFBQSxFQUFBLFdBRUE7UUFDSixNQUFNLENBQUMsSUFBSSxZQUFZLENBQU07WUFDM0IsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJO1lBQzNELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ3ZDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtZQUNuRSxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNoRCxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLFNBQVM7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQW5DRCxDQUFxQyxnQkFBZ0IsR0FtQ3BEO0FBbkNZLG9DQUFZO0FBcUN6Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSDtJQUF1QyxxQ0FBZ0I7SUFVckQsMkJBQVksSUFFWDtRQUZEO1FBR0UseURBQXlEO1FBQ3pELGtCQUFNLElBQUksRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDLFNBWWhDO1FBekJRLFVBQUksR0FBRyxtQkFBbUIsQ0FBQztRQUlwQzs7V0FFRztRQUNNLFFBQUUsR0FBRyxLQUFLLENBQUM7UUFRbEIsaUZBQWlGO1FBQ2pGLDhFQUE4RTtRQUM5RSxzREFBc0Q7UUFDdEQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUksQ0FBQyxPQUFPLEdBQUcsc0NBQW1DLElBQUksQ0FBQyxHQUFHLElBQUksZUFBZSxDQUFFLENBQUM7UUFDbEYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSSxDQUFDLE9BQU87Z0JBQ1IsZ0NBQTZCLElBQUksQ0FBQyxHQUFHLElBQUksZUFBZSxXQUFLLElBQUksQ0FBQyxNQUFNLFNBQUksSUFBSSxDQUFDLFVBQVksQ0FBQztRQUNwRyxDQUFDO1FBQ0QsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQzs7SUFDbEMsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQTNCRCxDQUF1QyxnQkFBZ0IsR0EyQnREO0FBM0JZLDhDQUFpQiJ9