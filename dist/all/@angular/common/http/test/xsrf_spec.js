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
var request_1 = require("../src/request");
var xsrf_1 = require("../src/xsrf");
var backend_1 = require("../testing/src/backend");
var SampleTokenExtractor = (function () {
    function SampleTokenExtractor(token) {
        this.token = token;
    }
    SampleTokenExtractor.prototype.getToken = function () { return this.token; };
    return SampleTokenExtractor;
}());
function main() {
    describe('HttpXsrfInterceptor', function () {
        var backend;
        var interceptor = new xsrf_1.HttpXsrfInterceptor(new SampleTokenExtractor('test'), 'X-XSRF-TOKEN');
        beforeEach(function () { backend = new backend_1.HttpClientTestingBackend(); });
        it('applies XSRF protection to outgoing requests', function () {
            interceptor.intercept(new request_1.HttpRequest('POST', '/test', {}), backend).subscribe();
            var req = backend.expectOne('/test');
            expect(req.request.headers.get('X-XSRF-TOKEN')).toEqual('test');
            req.flush({});
        });
        it('does not apply XSRF protection when request is a GET', function () {
            interceptor.intercept(new request_1.HttpRequest('GET', '/test'), backend).subscribe();
            var req = backend.expectOne('/test');
            expect(req.request.headers.has('X-XSRF-TOKEN')).toEqual(false);
            req.flush({});
        });
        it('does not apply XSRF protection when request is a HEAD', function () {
            interceptor.intercept(new request_1.HttpRequest('HEAD', '/test'), backend).subscribe();
            var req = backend.expectOne('/test');
            expect(req.request.headers.has('X-XSRF-TOKEN')).toEqual(false);
            req.flush({});
        });
        it('does not overwrite existing header', function () {
            interceptor
                .intercept(new request_1.HttpRequest('POST', '/test', {}, { headers: new headers_1.HttpHeaders().set('X-XSRF-TOKEN', 'blah') }), backend)
                .subscribe();
            var req = backend.expectOne('/test');
            expect(req.request.headers.get('X-XSRF-TOKEN')).toEqual('blah');
            req.flush({});
        });
        it('does not set the header for a null token', function () {
            var interceptor = new xsrf_1.HttpXsrfInterceptor(new SampleTokenExtractor(null), 'X-XSRF-TOKEN');
            interceptor.intercept(new request_1.HttpRequest('POST', '/test', {}), backend).subscribe();
            var req = backend.expectOne('/test');
            expect(req.request.headers.has('X-XSRF-TOKEN')).toEqual(false);
            req.flush({});
        });
        afterEach(function () { backend.verify(); });
    });
    describe('HttpXsrfCookieExtractor', function () {
        var document;
        var extractor;
        beforeEach(function () {
            document = {
                cookie: 'XSRF-TOKEN=test',
            };
            extractor = new xsrf_1.HttpXsrfCookieExtractor(document, 'browser', 'XSRF-TOKEN');
        });
        it('parses the cookie from document.cookie', function () { expect(extractor.getToken()).toEqual('test'); });
        it('does not re-parse if document.cookie has not changed', function () {
            expect(extractor.getToken()).toEqual('test');
            expect(extractor.getToken()).toEqual('test');
            expect(extractor.parseCount).toEqual(1);
        });
        it('re-parses if document.cookie changes', function () {
            expect(extractor.getToken()).toEqual('test');
            document['cookie'] = 'XSRF-TOKEN=blah';
            expect(extractor.getToken()).toEqual('blah');
            expect(extractor.parseCount).toEqual(2);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHNyZl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdC94c3JmX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwwQ0FBMkM7QUFDM0MsMENBQTJDO0FBQzNDLG9DQUF5RTtBQUV6RSxrREFBZ0U7QUFFaEU7SUFDRSw4QkFBb0IsS0FBa0I7UUFBbEIsVUFBSyxHQUFMLEtBQUssQ0FBYTtJQUFHLENBQUM7SUFFMUMsdUNBQVEsR0FBUixjQUEwQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEQsMkJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEO0lBQ0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLElBQUksT0FBaUMsQ0FBQztRQUN0QyxJQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFtQixDQUFDLElBQUksb0JBQW9CLENBQUMsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDOUYsVUFBVSxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQUksa0NBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUkscUJBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pGLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVB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