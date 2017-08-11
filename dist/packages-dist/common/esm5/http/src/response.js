/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpHeaders } from './headers';
export var HttpEventType = {};
HttpEventType.Sent = 0;
HttpEventType.UploadProgress = 1;
HttpEventType.ResponseHeader = 2;
HttpEventType.DownloadProgress = 3;
HttpEventType.Response = 4;
HttpEventType.User = 5;
HttpEventType[HttpEventType.Sent] = "Sent";
HttpEventType[HttpEventType.UploadProgress] = "UploadProgress";
HttpEventType[HttpEventType.ResponseHeader] = "ResponseHeader";
HttpEventType[HttpEventType.DownloadProgress] = "DownloadProgress";
HttpEventType[HttpEventType.Response] = "Response";
HttpEventType[HttpEventType.User] = "User";
/**
 * Base interface for progress events.
 *
 * \@experimental
 * @record
 */
export function HttpProgressEvent() { }
function HttpProgressEvent_tsickle_Closure_declarations() {
    /**
     * Progress event type is either upload or download.
     * @type {?}
     */
    HttpProgressEvent.prototype.type;
    /**
     * Number of bytes uploaded or downloaded.
     * @type {?}
     */
    HttpProgressEvent.prototype.loaded;
    /**
     * Total number of bytes to upload or download. Depending on the request or
     * response, this may not be computable and thus may not be present.
     * @type {?|undefined}
     */
    HttpProgressEvent.prototype.total;
}
/**
 * A download progress event.
 *
 * \@experimental
 * @record
 */
export function HttpDownloadProgressEvent() { }
function HttpDownloadProgressEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpDownloadProgressEvent.prototype.type;
    /**
     * The partial response body as downloaded so far.
     *
     * Only present if the responseType was `text`.
     * @type {?|undefined}
     */
    HttpDownloadProgressEvent.prototype.partialText;
}
/**
 * An upload progress event.
 *
 * \@experimental
 * @record
 */
export function HttpUploadProgressEvent() { }
function HttpUploadProgressEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpUploadProgressEvent.prototype.type;
}
/**
 * An event indicating that the request was sent to the server. Useful
 * when a request may be retried multiple times, to distinguish between
 * retries on the final event stream.
 *
 * \@experimental
 * @record
 */
export function HttpSentEvent() { }
function HttpSentEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpSentEvent.prototype.type;
}
/**
 * A user-defined event.
 *
 * Grouping all custom events under this type ensures they will be handled
 * and forwarded by all implementations of interceptors.
 *
 * \@experimental
 * @record
 */
export function HttpUserEvent() { }
function HttpUserEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpUserEvent.prototype.type;
}
/**
 * An error that represents a failed attempt to JSON.parse text coming back
 * from the server.
 *
 * It bundles the Error object with the actual response body that failed to parse.
 *
 * \@experimental
 * @record
 */
export function HttpJsonParseError() { }
function HttpJsonParseError_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpJsonParseError.prototype.error;
    /** @type {?} */
    HttpJsonParseError.prototype.text;
}
/**
 * Base class for both `HttpResponse` and `HttpHeaderResponse`.
 *
 * \@experimental
 * @abstract
 */
var HttpResponseBase = (function () {
    /**
     * Super-constructor for all responses.
     *
     * The single parameter accepted is an initialization hash. Any properties
     * of the response passed there will override the default values.
     * @param {?} init
     * @param {?=} defaultStatus
     * @param {?=} defaultStatusText
     */
    function HttpResponseBase(init, defaultStatus, defaultStatusText) {
        if (defaultStatus === void 0) { defaultStatus = 200; }
        if (defaultStatusText === void 0) { defaultStatusText = 'OK'; }
        // If the hash has values passed, use them to initialize the response.
        // Otherwise use the default values.
        this.headers = init.headers || new HttpHeaders();
        this.status = init.status !== undefined ? init.status : defaultStatus;
        this.statusText = init.statusText || defaultStatusText;
        this.url = init.url || null;
        // Cache the ok value to avoid defining a getter.
        this.ok = this.status >= 200 && this.status < 300;
    }
    return HttpResponseBase;
}());
export { HttpResponseBase };
function HttpResponseBase_tsickle_Closure_declarations() {
    /**
     * All response headers.
     * @type {?}
     */
    HttpResponseBase.prototype.headers;
    /**
     * Response status code.
     * @type {?}
     */
    HttpResponseBase.prototype.status;
    /**
     * Textual description of response status code.
     *
     * Do not depend on this.
     * @type {?}
     */
    HttpResponseBase.prototype.statusText;
    /**
     * URL of the resource retrieved, or null if not available.
     * @type {?}
     */
    HttpResponseBase.prototype.url;
    /**
     * Whether the status code falls in the 2xx range.
     * @type {?}
     */
    HttpResponseBase.prototype.ok;
    /**
     * Type of the response, narrowed to either the full response or the header.
     * @type {?}
     */
    HttpResponseBase.prototype.type;
}
/**
 * A partial HTTP response which only includes the status and header data,
 * but no response body.
 *
 * `HttpHeaderResponse` is a `HttpEvent` available on the response
 * event stream, only when progress events are requested.
 *
 * \@experimental
 */
var HttpHeaderResponse = (function (_super) {
    tslib_1.__extends(HttpHeaderResponse, _super);
    /**
     * Create a new `HttpHeaderResponse` with the given parameters.
     * @param {?=} init
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
     * @param {?=} update
     * @return {?}
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
export { HttpHeaderResponse };
function HttpHeaderResponse_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpHeaderResponse.prototype.type;
}
/**
 * A full HTTP response, including a typed response body (which may be `null`
 * if one was not returned).
 *
 * `HttpResponse` is a `HttpEvent` available on the response event
 * stream.
 *
 * \@experimental
 */
var HttpResponse = (function (_super) {
    tslib_1.__extends(HttpResponse, _super);
    /**
     * Construct a new `HttpResponse`.
     * @param {?=} init
     */
    function HttpResponse(init) {
        if (init === void 0) { init = {}; }
        var _this = _super.call(this, init) || this;
        _this.type = HttpEventType.Response;
        _this.body = init.body || null;
        return _this;
    }
    /**
     * @param {?=} update
     * @return {?}
     */
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
export { HttpResponse };
function HttpResponse_tsickle_Closure_declarations() {
    /**
     * The response body, or `null` if one was not returned.
     * @type {?}
     */
    HttpResponse.prototype.body;
    /** @type {?} */
    HttpResponse.prototype.type;
}
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
 * \@experimental
 */
var HttpErrorResponse = (function (_super) {
    tslib_1.__extends(HttpErrorResponse, _super);
    /**
     * @param {?} init
     */
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
export { HttpErrorResponse };
function HttpErrorResponse_tsickle_Closure_declarations() {
    /** @type {?} */
    HttpErrorResponse.prototype.name;
    /** @type {?} */
    HttpErrorResponse.prototype.message;
    /** @type {?} */
    HttpErrorResponse.prototype.error;
    /**
     * Errors are never okay, even when the status code is in the 2xx success range.
     * @type {?}
     */
    HttpErrorResponse.prototype.ok;
}
//# sourceMappingURL=response.js.map