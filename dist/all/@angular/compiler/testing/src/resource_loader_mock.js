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
var compiler_1 = require("@angular/compiler");
/**
 * A mock implementation of {@link ResourceLoader} that allows outgoing requests to be mocked
 * and responded to within a single test, without going to the network.
 */
var MockResourceLoader = (function (_super) {
    __extends(MockResourceLoader, _super);
    function MockResourceLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._expectations = [];
        _this._definitions = new Map();
        _this._requests = [];
        return _this;
    }
    MockResourceLoader.prototype.get = function (url) {
        var request = new _PendingRequest(url);
        this._requests.push(request);
        return request.getPromise();
    };
    MockResourceLoader.prototype.hasPendingRequests = function () { return !!this._requests.length; };
    /**
     * Add an expectation for the given URL. Incoming requests will be checked against
     * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
     * can be used to check if any expectations have not yet been met.
     *
     * The response given will be returned if the expectation matches.
     */
    MockResourceLoader.prototype.expect = function (url, response) {
        var expectation = new _Expectation(url, response);
        this._expectations.push(expectation);
    };
    /**
     * Add a definition for the given URL to return the given response. Unlike expectations,
     * definitions have no order and will satisfy any matching request at any time. Also
     * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
     * to return an error.
     */
    MockResourceLoader.prototype.when = function (url, response) { this._definitions.set(url, response); };
    /**
     * Process pending requests and verify there are no outstanding expectations. Also fails
     * if no requests are pending.
     */
    MockResourceLoader.prototype.flush = function () {
        if (this._requests.length === 0) {
            throw new Error('No pending requests to flush');
        }
        do {
            this._processRequest(this._requests.shift());
        } while (this._requests.length > 0);
        this.verifyNoOutstandingExpectations();
    };
    /**
     * Throw an exception if any expectations have not been satisfied.
     */
    MockResourceLoader.prototype.verifyNoOutstandingExpectations = function () {
        if (this._expectations.length === 0)
            return;
        var urls = [];
        for (var i = 0; i < this._expectations.length; i++) {
            var expectation = this._expectations[i];
            urls.push(expectation.url);
        }
        throw new Error("Unsatisfied requests: " + urls.join(', '));
    };
    MockResourceLoader.prototype._processRequest = function (request) {
        var url = request.url;
        if (this._expectations.length > 0) {
            var expectation = this._expectations[0];
            if (expectation.url == url) {
                remove(this._expectations, expectation);
                request.complete(expectation.response);
                return;
            }
        }
        if (this._definitions.has(url)) {
            var response = this._definitions.get(url);
            request.complete(response == null ? null : response);
            return;
        }
        throw new Error("Unexpected request " + url);
    };
    return MockResourceLoader;
}(compiler_1.ResourceLoader));
exports.MockResourceLoader = MockResourceLoader;
var _PendingRequest = (function () {
    function _PendingRequest(url) {
        var _this = this;
        this.url = url;
        this.promise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    _PendingRequest.prototype.complete = function (response) {
        if (response == null) {
            this.reject("Failed to load " + this.url);
        }
        else {
            this.resolve(response);
        }
    };
    _PendingRequest.prototype.getPromise = function () { return this.promise; };
    return _PendingRequest;
}());
var _Expectation = (function () {
    function _Expectation(url, response) {
        this.url = url;
        this.response = response;
    }
    return _Expectation;
}());
function remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
        list.splice(index, 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9yZXNvdXJjZV9sb2FkZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBaUQ7QUFFakQ7OztHQUdHO0FBQ0g7SUFBd0Msc0NBQWM7SUFBdEQ7UUFBQSxxRUFvRkM7UUFuRlMsbUJBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ25DLGtCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDekMsZUFBUyxHQUFzQixFQUFFLENBQUM7O0lBaUY1QyxDQUFDO0lBL0VDLGdDQUFHLEdBQUgsVUFBSSxHQUFXO1FBQ2IsSUFBTSxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsK0NBQWtCLEdBQWxCLGNBQXVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRXhEOzs7Ozs7T0FNRztJQUNILG1DQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsUUFBZ0I7UUFDbEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGlDQUFJLEdBQUosVUFBSyxHQUFXLEVBQUUsUUFBZ0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUs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