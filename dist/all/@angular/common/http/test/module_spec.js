"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.JsonpCallbackContext
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
require("rxjs/add/operator/map");
var testing_1 = require("@angular/core/testing");
var client_1 = require("../src/client");
var interceptor_1 = require("../src/interceptor");
var response_1 = require("../src/response");
var api_1 = require("../testing/src/api");
var module_1 = require("../testing/src/module");
var TestInterceptor = (function () {
    function TestInterceptor(value) {
        this.value = value;
    }
    TestInterceptor.prototype.intercept = function (req, delegate) {
        var _this = this;
        var existing = req.headers.get('Intercepted');
        var next = !!existing ? existing + ',' + this.value : this.value;
        req = req.clone({ setHeaders: { 'Intercepted': next } });
        return delegate.handle(req).map(function (event) {
            if (event instanceof response_1.HttpResponse) {
                var existing_1 = event.headers.get('Intercepted');
                var next_1 = !!existing_1 ? existing_1 + ',' + _this.value : _this.value;
                return event.clone({ headers: event.headers.set('Intercepted', next_1) });
            }
            return event;
        });
    };
    return TestInterceptor;
}());
var InterceptorA = (function (_super) {
    __extends(InterceptorA, _super);
    function InterceptorA() {
        return _super.call(this, 'A') || this;
    }
    return InterceptorA;
}(TestInterceptor));
var InterceptorB = (function (_super) {
    __extends(InterceptorB, _super);
    function InterceptorB() {
        return _super.call(this, 'B') || this;
    }
    return InterceptorB;
}(TestInterceptor));
function main() {
    describe('HttpClientModule', function () {
        var injector;
        beforeEach(function () {
            injector = testing_1.TestBed.configureTestingModule({
                imports: [module_1.HttpClientTestingModule],
                providers: [
                    { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: InterceptorA, multi: true },
                    { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: InterceptorB, multi: true },
                ],
            });
        });
        it('initializes HttpClient properly', function (done) {
            injector.get(client_1.HttpClient).get('/test', { responseType: 'text' }).subscribe(function (value) {
                expect(value).toBe('ok!');
                done();
            });
            injector.get(api_1.HttpTestingController).expectOne('/test').flush('ok!');
        });
        it('intercepts outbound responses in the order in which interceptors were bound', function (done) {
            injector.get(client_1.HttpClient)
                .get('/test', { observe: 'response', responseType: 'text' })
                .subscribe(function (value) { return done(); });
            var req = injector.get(api_1.HttpTestingController).expectOne('/test');
            expect(req.request.headers.get('Intercepted')).toEqual('A,B');
            req.flush('ok!');
        });
        it('intercepts inbound responses in the right (reverse binding) order', function (done) {
            injector.get(client_1.HttpClient)
                .get('/test', { observe: 'response', responseType: 'text' })
                .subscribe(function (value) {
                expect(value.headers.get('Intercepted')).toEqual('B,A');
                done();
            });
            injector.get(api_1.HttpTestingController).expectOne('/test').flush('ok!');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L21vZHVsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILGlDQUErQjtBQUcvQixpREFBOEM7QUFJOUMsd0NBQXlDO0FBQ3pDLGtEQUFzRTtBQUV0RSw0Q0FBd0Q7QUFDeEQsMENBQXlEO0FBQ3pELGdEQUE4RDtBQUc5RDtJQUNFLHlCQUFvQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUFHLENBQUM7SUFFckMsbUNBQVMsR0FBVCxVQUFVLEdBQXFCLEVBQUUsUUFBcUI7UUFBdEQsaUJBWUM7UUFYQyxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ25FLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsVUFBVSxFQUFFLEVBQUMsYUFBYSxFQUFFLElBQUksRUFBQyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSx1QkFBWSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBTSxVQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2xELElBQU0sTUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFRLEdBQUcsVUFBUSxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsS0FBSyxH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