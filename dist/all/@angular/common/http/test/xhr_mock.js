"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("../src/headers");
var MockXhrFactory = (function () {
    function MockXhrFactory() {
    }
    MockXhrFactory.prototype.build = function () { return (this.mock = new MockXMLHttpRequest()); };
    return MockXhrFactory;
}());
exports.MockXhrFactory = MockXhrFactory;
var MockXMLHttpRequestUpload = (function () {
    function MockXMLHttpRequestUpload(mock) {
        this.mock = mock;
    }
    MockXMLHttpRequestUpload.prototype.addEventListener = function (event, handler) {
        this.mock.addEventListener('uploadProgress', handler);
    };
    MockXMLHttpRequestUpload.prototype.removeEventListener = function (event, handler) {
        this.mock.removeEventListener('uploadProgress');
    };
    return MockXMLHttpRequestUpload;
}());
exports.MockXMLHttpRequestUpload = MockXMLHttpRequestUpload;
var MockXMLHttpRequest = (function () {
    function MockXMLHttpRequest() {
        this.mockHeaders = {};
        this.mockAborted = false;
        // Directly settable interface.
        this.withCredentials = false;
        this.responseType = 'text';
        // Mocked response interface.
        this.response = undefined;
        this.responseText = undefined;
        this.responseURL = null;
        this.status = 0;
        this.statusText = '';
        this.mockResponseHeaders = '';
        this.listeners = {};
        this.upload = new MockXMLHttpRequestUpload(this);
    }
    MockXMLHttpRequest.prototype.open = function (method, url) {
        this.method = method;
        this.url = url;
    };
    MockXMLHttpRequest.prototype.send = function (body) { this.body = body; };
    MockXMLHttpRequest.prototype.addEventListener = function (event, handler) {
        this.listeners[event] = handler;
    };
    MockXMLHttpRequest.prototype.removeEventListener = function (event) {
        delete this.listeners[event];
    };
    MockXMLHttpRequest.prototype.setRequestHeader = function (name, value) { this.mockHeaders[name] = value; };
    MockXMLHttpRequest.prototype.getAllResponseHeaders = function () { return this.mockResponseHeaders; };
    MockXMLHttpRequest.prototype.getResponseHeader = function (header) {
        return new headers_1.HttpHeaders(this.mockResponseHeaders).get(header);
    };
    MockXMLHttpRequest.prototype.mockFlush = function (status, statusText, body) {
        if (this.responseType === 'text') {
            this.responseText = body;
        }
        else {
            this.response = body;
        }
        this.status = status;
        this.statusText = statusText;
        this.mockLoadEvent();
    };
    MockXMLHttpRequest.prototype.mockDownloadProgressEvent = function (loaded, total) {
        if (this.listeners.progress) {
            this.listeners.progress({ lengthComputable: total !== undefined, loaded: loaded, total: total });
        }
    };
    MockXMLHttpRequest.prototype.mockUploadProgressEvent = function (loaded, total) {
        if (this.listeners.uploadProgress) {
            this.listeners.uploadProgress({ lengthComputable: total !== undefined, loaded: loaded, total: total, });
        }
    };
    MockXMLHttpRequest.prototype.mockLoadEvent = function () {
        if (this.listeners.load) {
            this.listeners.load();
        }
    };
    MockXMLHttpRequest.prototype.mockErrorEvent = function (error) {
        if (this.listeners.error) {
            this.listeners.error(error);
        }
    };
    MockXMLHttpRequest.prototype.abort = function () { this.mockAborted = true; };
    return MockXMLHttpRequest;
}());
exports.MockXMLHttpRequest = MockXMLHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L3hocl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQTJDO0FBRzNDO0lBQUE7SUFJQSxDQUFDO0lBREMsOEJBQUssR0FBTCxjQUEwQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBUSxDQUFDLENBQUMsQ0FBQztJQUNuRixxQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksd0NBQWM7QUFNM0I7SUFDRSxrQ0FBb0IsSUFBd0I7UUFBeEIsU0FBSSxHQUFKLElBQUksQ0FBb0I7SUFBRyxDQUFDO0lBRWhELG1EQUFnQixHQUFoQixVQUFpQixLQUFpQixFQUFFLE9BQWlCO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHNEQUFtQixHQUFuQixVQUFvQixLQUFpQixFQUFFLE9BQWlCO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVZZLDREQUF3QjtBQVlyQztJQUFBO1FBS0UsZ0JBQVcsR0FBNEIsRUFBRSxDQUFDO1FBQzFDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRTdCLCtCQUErQjtRQUMvQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyxpQkFBWSxHQUFXLE1BQU0sQ0FBQztRQUU5Qiw2QkFBNkI7UUFDN0IsYUFBUSxHQUFrQixTQUFTLENBQUM7UUFDcEMsaUJBQVksR0FBcUIsU0FBUyxDQUFDO1FBQzNDLGdCQUFXLEdBQWdCLElBQUksQ0FBQztRQUNoQyxXQUFNLEdB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