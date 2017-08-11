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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var platform_browser_1 = require("@angular/platform-browser");
var browser_xhr_1 = require("../../src/backends/browser_xhr");
var xhr_backend_1 = require("../../src/backends/xhr_backend");
var base_request_options_1 = require("../../src/base_request_options");
var base_response_options_1 = require("../../src/base_response_options");
var enums_1 = require("../../src/enums");
var headers_1 = require("../../src/headers");
var interfaces_1 = require("../../src/interfaces");
var static_request_1 = require("../../src/static_request");
var url_search_params_1 = require("../../src/url_search_params");
var abortSpy;
var sendSpy;
var openSpy;
var setRequestHeaderSpy;
var existingXHRs = [];
var MockBrowserXHR = (function (_super) {
    __extends(MockBrowserXHR, _super);
    function MockBrowserXHR() {
        var _this = _super.call(this) || this;
        _this.callbacks = new Map();
        var spy = new testing_internal_1.SpyObject();
        _this.abort = abortSpy = spy.spy('abort');
        _this.send = sendSpy = spy.spy('send');
        _this.open = openSpy = spy.spy('open');
        _this.setRequestHeader = setRequestHeaderSpy = spy.spy('setRequestHeader');
        // If responseType is supported by the browser, then it should be set to an empty string.
        // (https://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
        _this.responseType = '';
        return _this;
    }
    MockBrowserXHR.prototype.setStatusCode = function (status) { this.status = status; };
    MockBrowserXHR.prototype.setStatusText = function (statusText) { this.statusText = statusText; };
    MockBrowserXHR.prototype.setResponse = function (value) { this.response = value; };
    MockBrowserXHR.prototype.setResponseText = function (value) { this.responseText = value; };
    MockBrowserXHR.prototype.setResponseURL = function (value) { this.responseURL = value; };
    MockBrowserXHR.prototype.setResponseHeaders = function (value) { this.responseHeaders = value; };
    MockBrowserXHR.prototype.getAllResponseHeaders = function () { return this.responseHeaders || ''; };
    MockBrowserXHR.prototype.getResponseHeader = function (key) {
        return headers_1.Headers.fromResponseHeaderString(this.responseHeaders).get(key);
    };
    MockBrowserXHR.prototype.addEventListener = function (type, cb) { this.callbacks.set(type, cb); };
    MockBrowserXHR.prototype.removeEventListener = function (type, cb) { this.callbacks.delete(type); };
    MockBrowserXHR.prototype.dispatchEvent = function (type) { this.callbacks.get(type)({}); };
    MockBrowserXHR.prototype.build = function () {
        var xhr = new MockBrowserXHR();
        existingXHRs.push(xhr);
        return xhr;
    };
    return MockBrowserXHR;
}(browser_xhr_1.BrowserXhr));
function main() {
    testing_internal_1.describe('XHRBackend', function () {
        var backend;
        var sampleRequest;
        testing_internal_1.beforeEachProviders(function () {
            return [{ provide: base_response_options_1.ResponseOptions, useClass: base_response_options_1.BaseResponseOptions },
                { provide: browser_xhr_1.BrowserXhr, useClass: MockBrowserXHR }, xhr_backend_1.XHRBackend,
                { provide: interfaces_1.XSRFStrategy, useValue: new xhr_backend_1.CookieXSRFStrategy() },
            ];
        });
        testing_internal_1.beforeEach(testing_internal_1.inject([xhr_backend_1.XHRBackend], function (be) {
            backend = be;
            var base = new base_request_options_1.BaseRequestOptions();
            sampleRequest =
                new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ url: 'https://google.com' })));
        }));
        testing_internal_1.afterEach(function () { existingXHRs = []; });
        testing_internal_1.describe('creating a connection', function () {
            var NoopXsrfStrategy = (function () {
                function NoopXsrfStrategy() {
                }
                NoopXsrfStrategy.prototype.configureRequest = function (req) { };
                return NoopXsrfStrategy;
            }());
            NoopXsrfStrategy = __decorate([
                core_1.Injectable()
            ], NoopXsrfStrategy);
            testing_internal_1.beforeEachProviders(function () { return [{ provide: interfaces_1.XSRFStrategy, useClass: NoopXsrfStrategy }]; });
            testing_internal_1.it('succeeds', function () { testing_internal_1.expect(function () { return backend.createConnection(sampleRequest); }).not.toThrow(); });
        });
        if (platform_browser_1.ɵgetDOM().supportsCookies()) {
            testing_internal_1.describe('XSRF support', function () {
                testing_internal_1.it('sets an XSRF header by default', function () {
                    platform_browser_1.ɵgetDOM().setCookie('XSRF-TOKEN', 'magic XSRF value');
                    backend.createConnection(sampleRequest);
                    testing_internal_1.expect(sampleRequest.headers.get('X-XSRF-TOKEN')).toBe('magic XSRF value');
                });
                testing_internal_1.it('should allow overwriting of existing headers', function () {
                    platform_browser_1.ɵgetDOM().setCookie('XSRF-TOKEN', 'magic XSRF value');
                    sampleRequest.headers.set('X-XSRF-TOKEN', 'already set');
                    backend.createConnection(sampleRequest);
                    testing_internal_1.expect(sampleRequest.headers.get('X-XSRF-TOKEN')).toBe('magic XSRF value');
                });
                testing_internal_1.describe('configuration', function () {
                    testing_internal_1.beforeEachProviders(function () { return [{
                            provide: interfaces_1.XSRFStrategy,
                            useValue: new xhr_backend_1.CookieXSRFStrategy('my cookie', 'X-MY-HEADER')
                        }]; });
                    testing_internal_1.it('uses the configured names', function () {
                        platform_browser_1.ɵgetDOM().setCookie('my cookie', 'XSRF value');
                        backend.createConnection(sampleRequest);
                        testing_internal_1.expect(sampleRequest.headers.get('X-MY-HEADER')).toBe('XSRF value');
                    });
                });
            });
        }
        testing_internal_1.describe('XHRConnection', function () {
            testing_internal_1.it('should use the injected BaseResponseOptions to create the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should complete a request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(function (res) { testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error); }, null, function () { async.done(); });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call abort when disposed', function () {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                var request = connection.response.subscribe();
                request.unsubscribe();
                testing_internal_1.expect(abortSpy).toHaveBeenCalled();
            });
            testing_internal_1.it('should create an error Response on error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    async.done();
                });
                existingXHRs[0].dispatchEvent('error');
            }));
            testing_internal_1.it('should set the status text and status code on error', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ type: enums_1.ResponseType.Error }));
                connection.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.type).toBe(enums_1.ResponseType.Error);
                    testing_internal_1.expect(res.status).toEqual(0);
                    testing_internal_1.expect(res.statusText).toEqual('');
                    async.done();
                });
                var xhr = existingXHRs[0];
                // status=0 with a text='' is common for CORS errors
                xhr.setStatusCode(0);
                xhr.setStatusText('');
                xhr.dispatchEvent('error');
            }));
            testing_internal_1.it('should call open with method and url when subscribed to', function () {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                testing_internal_1.expect(openSpy).not.toHaveBeenCalled();
                connection.response.subscribe();
                testing_internal_1.expect(openSpy).toHaveBeenCalledWith('GET', sampleRequest.url);
            });
            testing_internal_1.it('should call send on the backend with request body when subscribed to', function () {
                var body = 'Some body to love';
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                testing_internal_1.expect(sendSpy).not.toHaveBeenCalled();
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
            });
            testing_internal_1.it('should attach headers to the request', function () {
                var headers = new headers_1.Headers({ 'Content-Type': 'text/xml', 'Breaking-Bad': '<3', 'X-Multi': ['a', 'b'] });
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/xml');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Breaking-Bad', '<3');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('X-Multi', 'a,b');
            });
            testing_internal_1.it('should attach default Accept header', function () {
                var headers = new headers_1.Headers();
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy)
                    .toHaveBeenCalledWith('Accept', 'application/json, text/plain, */*');
            });
            testing_internal_1.it('should not override user provided Accept header', function () {
                var headers = new headers_1.Headers({ 'Accept': 'text/xml' });
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Accept', 'text/xml');
            });
            testing_internal_1.it('should skip content type detection if custom content type header is set', function () {
                var headers = new headers_1.Headers({ 'Content-Type': 'text/plain' });
                var body = { test: 'val' };
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/plain');
                testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith('Content-Type', 'application/json');
                testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith('content-type', 'application/json');
            });
            testing_internal_1.it('should use object body and detect content type header to the request', function () {
                var body = { test: 'val' };
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(body, null, 2));
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'application/json');
            });
            testing_internal_1.it('should use number body and detect content type header to the request', function () {
                var body = 23;
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith('23');
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/plain');
            });
            testing_internal_1.it('should use string body and detect content type header to the request', function () {
                var body = 'some string';
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/plain');
            });
            testing_internal_1.it('should use URLSearchParams body and detect content type header to the request', function () {
                var body = new url_search_params_1.URLSearchParams();
                body.set('test1', 'val1');
                body.set('test2', 'val2');
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                connection.response.subscribe();
                testing_internal_1.expect(sendSpy).toHaveBeenCalledWith('test1=val1&test2=val2');
                testing_internal_1.expect(setRequestHeaderSpy)
                    .toHaveBeenCalledWith('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            });
            if (global /** TODO #9100 */['Blob']) {
                // `new Blob(...)` throws an 'Illegal constructor' exception in Android browser <= 4.3,
                // but a BlobBuilder can be used instead
                var createBlob_1 = function (data, datatype) {
                    var newBlob;
                    try {
                        newBlob = new Blob(data || [], datatype ? { type: datatype } : {});
                    }
                    catch (e) {
                        var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder ||
                            global.MozBlobBuilder || global.MSBlobBuilder;
                        var builder = new BlobBuilder();
                        builder.append(data);
                        newBlob = builder.getBlob(datatype);
                    }
                    return newBlob;
                };
                testing_internal_1.it('should use FormData body and detect content type header to the request', function () {
                    var body = new FormData();
                    body.append('test1', 'val1');
                    body.append('test2', '123456');
                    var blob = createBlob_1(['body { color: red; }'], 'text/css');
                    body.append('userfile', blob);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use blob body and detect content type header to the request', function () {
                    var body = createBlob_1(['body { color: red; }'], 'text/css');
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('content-type', 'text/css');
                });
                testing_internal_1.it('should use blob body without type to the request', function () {
                    var body = createBlob_1(['body { color: red; }'], null);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use blob body without type with custom content type header to the request', function () {
                    var headers = new headers_1.Headers({ 'Content-Type': 'text/css' });
                    var body = createBlob_1(['body { color: red; }'], null);
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/css');
                });
                testing_internal_1.it('should use array buffer body to the request', function () {
                    var body = new ArrayBuffer(512);
                    var longInt8View = new Uint8Array(body);
                    for (var i = 0; i < longInt8View.length; i++) {
                        longInt8View[i] = i % 255;
                    }
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).not.toHaveBeenCalledWith();
                });
                testing_internal_1.it('should use array buffer body without type with custom content type header to the request', function () {
                    var headers = new headers_1.Headers({ 'Content-Type': 'text/css' });
                    var body = new ArrayBuffer(512);
                    var longInt8View = new Uint8Array(body);
                    for (var i = 0; i < longInt8View.length; i++) {
                        longInt8View[i] = i % 255;
                    }
                    var base = new base_request_options_1.BaseRequestOptions();
                    var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ body: body, headers: headers }))), new MockBrowserXHR());
                    connection.response.subscribe();
                    testing_internal_1.expect(sendSpy).toHaveBeenCalledWith(body);
                    testing_internal_1.expect(setRequestHeaderSpy).toHaveBeenCalledWith('Content-Type', 'text/css');
                });
            }
            testing_internal_1.it('should return the correct status code', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 418;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                }, function (errRes) {
                    testing_internal_1.expect(errRes.status).toBe(statusCode);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call next and complete on 200 codes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var nextCalled = false;
                var errorCalled = false;
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    nextCalled = true;
                    testing_internal_1.expect(res.status).toBe(statusCode);
                }, function (errRes) { errorCalled = true; }, function () {
                    testing_internal_1.expect(nextCalled).toBe(true);
                    testing_internal_1.expect(errorCalled).toBe(false);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set ok to true on 200 return', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.ok).toBe(true);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set ok to false on 300 return', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 300;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) { throw 'should not be called'; }, function (errRes) {
                    testing_internal_1.expect(errRes.ok).toBe(false);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should call error and not complete on 300+ codes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var nextCalled = false;
                var errorCalled = false;
                var statusCode = 301;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) { nextCalled = true; }, function (errRes) {
                    testing_internal_1.expect(errRes.status).toBe(statusCode);
                    testing_internal_1.expect(nextCalled).toBe(false);
                    async.done();
                }, function () { throw 'should not be called'; });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should normalize IE\'s 1223 status code into 204', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 1223;
                var normalizedCode = 204;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.status).toBe(normalizedCode);
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should ignore response body for 204 status code', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 204;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].setResponseText('Doge');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should normalize responseText and response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var responseBody = 'Doge';
                var connection1 = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                var connection2 = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                connection1.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe(responseBody);
                    connection2.response.subscribe(function (ress) {
                        testing_internal_1.expect(ress.text()).toBe(responseBody);
                        async.done();
                    });
                    existingXHRs[1].setStatusCode(200);
                    existingXHRs[1].setResponse(responseBody);
                    existingXHRs[1].dispatchEvent('load');
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(responseBody);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefixes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(')]}\'\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefixes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].setResponseText(')]}\',\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should strip XSSI prefix from errors', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var conn = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions());
                conn.response.subscribe(null, function (res) {
                    testing_internal_1.expect(res.text()).toBe('{json: "object"}');
                    async.done();
                });
                existingXHRs[0].setStatusCode(404);
                existingXHRs[0].setResponseText(')]}\'\n{json: "object"}');
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should parse response headers and add them to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaderString = "Date: Fri, 20 Nov 2015 01:45:26 GMT\nContent-Type: application/json; charset=utf-8\nTransfer-Encoding: chunked\nConnection: keep-alive";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.headers.get('Date')).toEqual('Fri, 20 Nov 2015 01:45:26 GMT');
                    testing_internal_1.expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8');
                    testing_internal_1.expect(res.headers.get('Transfer-Encoding')).toEqual('chunked');
                    testing_internal_1.expect(res.headers.get('Connection')).toEqual('keep-alive');
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaderString);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should add the responseURL to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://google.com');
                    async.done();
                });
                existingXHRs[0].setResponseURL('http://google.com');
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should add use the X-Request-URL in CORS situations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaders = "X-Request-URL: http://somedomain.com\n           Foo: Bar";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://somedomain.com');
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaders);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should return request url if it cannot be retrieved from response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR(), new base_response_options_1.ResponseOptions({ status: statusCode }));
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('https://google.com');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set the status text property from the XMLHttpRequest instance if present', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusText = 'test';
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.statusText).toBe(statusText);
                    async.done();
                });
                existingXHRs[0].setStatusText(statusText);
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set status text to "OK" if it is not present in XMLHttpRequest instance', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.statusText).toBe('OK');
                    async.done();
                });
                existingXHRs[0].setStatusCode(200);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set withCredentials to true when defined in request options for CORS situations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                sampleRequest.withCredentials = true;
                var mockXhr = new MockBrowserXHR();
                var connection = new xhr_backend_1.XHRConnection(sampleRequest, mockXhr, new base_response_options_1.ResponseOptions({ status: statusCode }));
                var responseHeaders = "X-Request-URL: http://somedomain.com\n           Foo: Bar";
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.url).toEqual('http://somedomain.com');
                    testing_internal_1.expect(existingXHRs[0].withCredentials).toBeTruthy();
                    async.done();
                });
                existingXHRs[0].setResponseHeaders(responseHeaders);
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should set the responseType attribute to blob when the corresponding response content type is present', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var statusCode = 200;
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ responseType: enums_1.ResponseContentType.Blob }))), new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(existingXHRs[0].responseType).toBe('blob');
                    async.done();
                });
                existingXHRs[0].setStatusCode(statusCode);
                existingXHRs[0].dispatchEvent('load');
            }));
            testing_internal_1.it('should not throw invalidStateError if response without body and responseType not equal to text', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var base = new base_request_options_1.BaseRequestOptions();
                var connection = new xhr_backend_1.XHRConnection(new static_request_1.Request(base.merge(new base_request_options_1.RequestOptions({ responseType: enums_1.ResponseContentType.Json }))), new MockBrowserXHR());
                connection.response.subscribe(function (res) {
                    testing_internal_1.expect(res.json()).toBe(null);
                    async.done();
                });
                existingXHRs[0].setStatusCode(204);
                existingXHRs[0].dispatchEvent('load');
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX2JhY2tlbmRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC9iYWNrZW5kcy94aHJfYmFja2VuZF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUF5QztBQUN6QywrRUFBbUs7QUFDbkssOERBQTREO0FBQzVELDhEQUEwRDtBQUMxRCw4REFBNkY7QUFDN0YsdUVBQWtGO0FBQ2xGLHlFQUFxRjtBQUNyRix5Q0FBa0U7QUFDbEUsNkNBQTBDO0FBQzFDLG1EQUFrRDtBQUNsRCwyREFBaUQ7QUFFakQsaUVBQTREO0FBRTVELElBQUksUUFBYSxDQUFDO0FBQ2xCLElBQUksT0FBWSxDQUFDO0FBQ2pCLElBQUksT0FBWSxDQUFDO0FBQ2pCLElBQUksbUJBQXdCLENBQUM7QUFDN0IsSUFBSSxZQUFZLEdBQXFCLEVBQUUsQ0FBQztBQUV4QztJQUE2QixrQ0FBVTtJQWVyQztRQUFBLFlBQ0UsaUJBQU8sU0FTUjtRQWpCRCxlQUFTLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFTdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSw0QkFBUyxFQUFFLENBQUM7UUFDNUIsS0FBSSxDQUFDLEtBQUssR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxLQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMxRSx5RkFBeUY7UUFDekYs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