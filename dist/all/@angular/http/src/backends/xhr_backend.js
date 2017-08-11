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
var platform_browser_1 = require("@angular/platform-browser");
var Observable_1 = require("rxjs/Observable");
var base_response_options_1 = require("../base_response_options");
var enums_1 = require("../enums");
var headers_1 = require("../headers");
var http_utils_1 = require("../http_utils");
var interfaces_1 = require("../interfaces");
var static_response_1 = require("../static_response");
var browser_xhr_1 = require("./browser_xhr");
var XSSI_PREFIX = /^\)\]\}',?\n/;
/**
 * Creates connections using `XMLHttpRequest`. Given a fully-qualified
 * request, an `XHRConnection` will immediately create an `XMLHttpRequest` object and send the
 * request.
 *
 * This class would typically not be created or interacted with directly inside applications, though
 * the {@link MockConnection} may be interacted with in tests.
 *
 * @experimental
 */
var XHRConnection = (function () {
    function XHRConnection(req, browserXHR, baseResponseOptions) {
        var _this = this;
        this.request = req;
        this.response = new Observable_1.Observable(function (responseObserver) {
            var _xhr = browserXHR.build();
            _xhr.open(enums_1.RequestMethod[req.method].toUpperCase(), req.url);
            if (req.withCredentials != null) {
                _xhr.withCredentials = req.withCredentials;
            }
            // load event handler
            var onLoad = function () {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                var status = _xhr.status === 1223 ? 204 : _xhr.status;
                var body = null;
                // HTTP 204 means no content
                if (status !== 204) {
                    // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                    // response/responseType properties were introduced in ResourceLoader Level2 spec
                    // (supported by IE10)
                    body = (typeof _xhr.response === 'undefined') ? _xhr.responseText : _xhr.response;
                    // Implicitly strip a potential XSSI prefix.
                    if (typeof body === 'string') {
                        body = body.replace(XSSI_PREFIX, '');
                    }
                }
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = body ? 200 : 0;
                }
                var headers = headers_1.Headers.fromResponseHeaderString(_xhr.getAllResponseHeaders());
                // IE 9 does not provide the way to get URL of response
                var url = http_utils_1.getResponseURL(_xhr) || req.url;
                var statusText = _xhr.statusText || 'OK';
                var responseOptions = new base_response_options_1.ResponseOptions({ body: body, status: status, headers: headers, statusText: statusText, url: url });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                var response = new static_response_1.Response(responseOptions);
                response.ok = http_utils_1.isSuccess(status);
                if (response.ok) {
                    responseObserver.next(response);
                    // TODO(gdi2290): defer complete if array buffer until done
                    responseObserver.complete();
                    return;
                }
                responseObserver.error(response);
            };
            // error event handler
            var onError = function (err) {
                var responseOptions = new base_response_options_1.ResponseOptions({
                    body: err,
                    type: enums_1.ResponseType.Error,
                    status: _xhr.status,
                    statusText: _xhr.statusText,
                });
                if (baseResponseOptions != null) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new static_response_1.Response(responseOptions));
            };
            _this.setDetectedContentType(req, _xhr);
            if (req.headers == null) {
                req.headers = new headers_1.Headers();
            }
            if (!req.headers.has('Accept')) {
                req.headers.append('Accept', 'application/json, text/plain, */*');
            }
            req.headers.forEach(function (values, name) { return _xhr.setRequestHeader(name, values.join(',')); });
            // Select the correct buffer type to store the response
            if (req.responseType != null && _xhr.responseType != null) {
                switch (req.responseType) {
                    case enums_1.ResponseContentType.ArrayBuffer:
                        _xhr.responseType = 'arraybuffer';
                        break;
                    case enums_1.ResponseContentType.Json:
                        _xhr.responseType = 'json';
                        break;
                    case enums_1.ResponseContentType.Text:
                        _xhr.responseType = 'text';
                        break;
                    case enums_1.ResponseContentType.Blob:
                        _xhr.responseType = 'blob';
                        break;
                    default:
                        throw new Error('The selected responseType is not supported');
                }
            }
            _xhr.addEventListener('load', onLoad);
            _xhr.addEventListener('error', onError);
            _xhr.send(_this.request.getBody());
            return function () {
                _xhr.removeEventListener('load', onLoad);
                _xhr.removeEventListener('error', onError);
                _xhr.abort();
            };
        });
    }
    XHRConnection.prototype.setDetectedContentType = function (req /** TODO Request */, _xhr /** XMLHttpRequest */) {
        // Skip if a custom Content-Type header is provided
        if (req.headers != null && req.headers.get('Content-Type') != null) {
            return;
        }
        // Set the detected content type
        switch (req.contentType) {
            case enums_1.ContentType.NONE:
                break;
            case enums_1.ContentType.JSON:
                _xhr.setRequestHeader('content-type', 'application/json');
                break;
            case enums_1.ContentType.FORM:
                _xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                break;
            case enums_1.ContentType.TEXT:
                _xhr.setRequestHeader('content-type', 'text/plain');
                break;
            case enums_1.ContentType.BLOB:
                var blob = req.blob();
                if (blob.type) {
                    _xhr.setRequestHeader('content-type', blob.type);
                }
                break;
        }
    };
    return XHRConnection;
}());
exports.XHRConnection = XHRConnection;
/**
 * `XSRFConfiguration` sets up Cross Site Request Forgery (XSRF) protection for the application
 * using a cookie. See https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
 * for more information on XSRF.
 *
 * Applications can configure custom cookie and header names by binding an instance of this class
 * with different `cookieName` and `headerName` values. See the main HTTP documentation for more
 * details.
 *
 * @experimental
 */
var CookieXSRFStrategy = (function () {
    function CookieXSRFStrategy(_cookieName, _headerName) {
        if (_cookieName === void 0) { _cookieName = 'XSRF-TOKEN'; }
        if (_headerName === void 0) { _headerName = 'X-XSRF-TOKEN'; }
        this._cookieName = _cookieName;
        this._headerName = _headerName;
    }
    CookieXSRFStrategy.prototype.configureRequest = function (req) {
        var xsrfToken = platform_browser_1.ɵgetDOM().getCookie(this._cookieName);
        if (xsrfToken) {
            req.headers.set(this._headerName, xsrfToken);
        }
    };
    return CookieXSRFStrategy;
}());
exports.CookieXSRFStrategy = CookieXSRFStrategy;
/**
 * Creates {@link XHRConnection} instances.
 *
 * This class would typically not be used by end users, but could be
 * overridden if a different backend implementation should be used,
 * such as in a node backend.
 *
 * ### Example
 *
 * ```
 * import {Http, MyNodeBackend, HTTP_PROVIDERS, BaseRequestOptions} from '@angular/http';
 * @Component({
 *   viewProviders: [
 *     HTTP_PROVIDERS,
 *     {provide: Http, useFactory: (backend, options) => {
 *       return new Http(backend, options);
 *     }, deps: [MyNodeBackend, BaseRequestOptions]}]
 * })
 * class MyComponent {
 *   constructor(http:Http) {
 *     http.request('people.json').subscribe(res => this.people = res.json());
 *   }
 * }
 * ```
 * @experimental
 */
var XHRBackend = (function () {
    function XHRBackend(_browserXHR, _baseResponseOptions, _xsrfStrategy) {
        this._browserXHR = _browserXHR;
        this._baseResponseOptions = _baseResponseOptions;
        this._xsrfStrategy = _xsrfStrategy;
    }
    XHRBackend.prototype.createConnection = function (request) {
        this._xsrfStrategy.configureRequest(request);
        return new XHRConnection(request, this._browserXHR, this._baseResponseOptions);
    };
    return XHRBackend;
}());
XHRBackend = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [browser_xhr_1.BrowserXhr, base_response_options_1.ResponseOptions,
        interfaces_1.XSRFStrategy])
], XHRBackend);
exports.XHRBackend = XHRBackend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX2JhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9iYWNrZW5kcy94aHJfYmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6Qyw4REFBNEQ7QUFDNUQsOENBQTJDO0FBRTNDLGtFQUF5RDtBQUN6RCxrQ0FBbUc7QUFDbkcsc0NBQW1DO0FBQ25DLDRDQUF3RDtBQUN4RCw0Q0FBMEU7QUFFMUUsc0RBQTRDO0FBQzVDLDZDQUF5QztBQUV6QyxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7QUFFbkM7Ozs7Ozs7OztHQVNHO0FBQ0g7SUFRRSx1QkFBWSxHQUFZLEVBQUUsVUFBc0IsRUFBRSxtQkFBcUM7UUFBdkYsaUJBNkdDO1FBNUdDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBVSxDQUFXLFVBQUMsZ0JBQW9DO1lBQzVFLElBQU0sSUFBSSxHQUFtQixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDN0MsQ0FBQztZQUNELHFCQUFxQjtZQUNyQixJQUFNLE1BQU0sR0FBRztnQkFDYix5REFBeUQ7Z0JBQ3pELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dC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