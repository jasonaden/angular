"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var Observable_1 = require("rxjs/Observable");
var zip_1 = require("rxjs/observable/zip");
var index_1 = require("../index");
var http_utils_1 = require("../src/http_utils");
var mock_backend_1 = require("../testing/src/mock_backend");
function main() {
    testing_internal_1.describe('injectables', function () {
        var url = 'http://foo.bar';
        var http;
        var injector;
        var jsonpBackend;
        var xhrBackend;
        var jsonp;
        testing_internal_1.beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [index_1.HttpModule, index_1.JsonpModule],
                providers: [
                    { provide: index_1.XHRBackend, useClass: mock_backend_1.MockBackend },
                    { provide: index_1.JSONPBackend, useClass: mock_backend_1.MockBackend }
                ]
            });
            injector = testing_1.getTestBed();
        });
        testing_internal_1.it('should allow using jsonpInjectables and httpInjectables in same injector', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            http = injector.get(index_1.Http);
            jsonp = injector.get(index_1.Jsonp);
            jsonpBackend = injector.get(index_1.JSONPBackend);
            xhrBackend = injector.get(index_1.XHRBackend);
            var xhrCreatedConnections = 0;
            var jsonpCreatedConnections = 0;
            xhrBackend.connections.subscribe(function () {
                xhrCreatedConnections++;
                matchers_1.expect(xhrCreatedConnections).toEqual(1);
                if (jsonpCreatedConnections) {
                    async.done();
                }
            });
            http.get(url).subscribe(function () { });
            jsonpBackend.connections.subscribe(function () {
                jsonpCreatedConnections++;
                matchers_1.expect(jsonpCreatedConnections).toEqual(1);
                if (xhrCreatedConnections) {
                    async.done();
                }
            });
            jsonp.request(url).subscribe(function () { });
        }));
    });
    testing_internal_1.describe('http', function () {
        var url = 'http://foo.bar';
        var http;
        var injector;
        var backend;
        var baseResponse;
        var jsonp;
        testing_internal_1.beforeEach(function () {
            injector = core_1.Injector.create([
                { provide: index_1.BaseRequestOptions, deps: [] }, { provide: mock_backend_1.MockBackend, deps: [] }, {
                    provide: index_1.Http,
                    useFactory: function (backend, defaultOptions) {
                        return new index_1.Http(backend, defaultOptions);
                    },
                    deps: [mock_backend_1.MockBackend, index_1.BaseRequestOptions]
                },
                {
                    provide: index_1.Jsonp,
                    useFactory: function (backend, defaultOptions) {
                        return new index_1.Jsonp(backend, defaultOptions);
                    },
                    deps: [mock_backend_1.MockBackend, index_1.BaseRequestOptions]
                }
            ]);
            http = injector.get(index_1.Http);
            jsonp = injector.get(index_1.Jsonp);
            backend = injector.get(mock_backend_1.MockBackend);
            baseResponse = new index_1.Response(new index_1.ResponseOptions({ body: 'base response' }));
            spyOn(index_1.Http.prototype, 'request').and.callThrough();
        });
        testing_internal_1.afterEach(function () { return backend.verifyNoPendingRequests(); });
        testing_internal_1.describe('Http', function () {
            testing_internal_1.describe('.request()', function () {
                testing_internal_1.it('should return an Observable', function () { matchers_1.expect(http.request(url)).toBeAnInstanceOf(Observable_1.Observable); });
                testing_internal_1.it('should accept a fully-qualified request as its only parameter', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toBe('https://google.com');
                        c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                        async.done();
                    });
                    http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com' })))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should accept a fully-qualified request as its only parameter', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toBe('https://google.com');
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                        c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                        async.done();
                    });
                    http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: index_1.RequestMethod.Post })))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should perform a get request for given url if only passed a string', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection').subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a post request for given url if options include a method', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toEqual(index_1.RequestMethod.Post);
                        c.mockRespond(baseResponse);
                    });
                    var requestOptions = new index_1.RequestOptions({ method: index_1.RequestMethod.Post });
                    http.request('http://basic.connection', requestOptions).subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a post request for given url if options include a method', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toEqual(index_1.RequestMethod.Post);
                        c.mockRespond(baseResponse);
                    });
                    var requestOptions = { method: index_1.RequestMethod.Post };
                    http.request('http://basic.connection', requestOptions).subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a get request and complete the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection')
                        .subscribe(function (res) { matchers_1.expect(res.text()).toBe('base response'); }, null, function () { async.done(); });
                }));
                testing_internal_1.it('should perform multiple get requests and complete the responses', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection').subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                    });
                    http.request('http://basic.connection')
                        .subscribe(function (res) { matchers_1.expect(res.text()).toBe('base response'); }, null, function () { async.done(); });
                }));
                testing_internal_1.it('should throw if url is not a string or Request', function () {
                    var req = {};
                    matchers_1.expect(function () { return http.request(req); })
                        .toThrowError('First argument must be a url string or Request instance.');
                });
            });
            testing_internal_1.describe('.get()', function () {
                testing_internal_1.it('should perform a get request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Get);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.get(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.post()', function () {
                testing_internal_1.it('should perform a post request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.post(url, 'post me').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my post body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.post(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.put()', function () {
                testing_internal_1.it('should perform a put request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Put);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.put(url, 'put me').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my put body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.put(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.delete()', function () {
                testing_internal_1.it('should perform a delete request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Delete);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.delete(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.patch()', function () {
                testing_internal_1.it('should perform a patch request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Patch);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.patch(url, 'this is my patch body').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my patch body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.patch(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.head()', function () {
                testing_internal_1.it('should perform a head request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Head);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.head(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.options()', function () {
                testing_internal_1.it('should perform an options request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Options);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.options(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('searchParams', function () {
                testing_internal_1.it('should append search params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var params = new index_1.URLSearchParams();
                    params.append('q', 'puppies');
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=puppies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', new index_1.RequestOptions({ search: params }))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should append string search params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=piggies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', new index_1.RequestOptions({ search: 'q=piggies' }))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should produce valid url when url already contains a query', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=angular&as_eq=1.x');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com?q=angular', new index_1.RequestOptions({ search: 'as_eq=1.x' }))
                        .subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('params', function () {
                testing_internal_1.it('should append params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=puppies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', { params: { q: 'puppies' } })
                        .subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('string method names', function () {
                testing_internal_1.it('should allow case insensitive strings for method names', function () {
                    testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                        backend.connections.subscribe(function (c) {
                            matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                            c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                            async.done();
                        });
                        http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: 'PosT' })))
                            .subscribe(function (res) { });
                    });
                });
                testing_internal_1.it('should throw when invalid string parameter is passed for method name', function () {
                    matchers_1.expect(function () {
                        http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: 'Invalid' })));
                    }).toThrowError('Invalid request method. The method "Invalid" is not supported.');
                });
            });
        });
        testing_internal_1.describe('Jsonp', function () {
            testing_internal_1.describe('.request()', function () {
                testing_internal_1.it('should throw if url is not a string or Request', function () {
                    var req = {};
                    matchers_1.expect(function () { return jsonp.request(req); })
                        .toThrowError('First argument must be a url string or Request instance.');
                });
            });
        });
        testing_internal_1.describe('response buffer', function () {
            testing_internal_1.it('should attach the provided buffer to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                backend.connections.subscribe(function (c) {
                    matchers_1.expect(c.request.responseType).toBe(index_1.ResponseContentType.ArrayBuffer);
                    c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: new ArrayBuffer(32) })));
                    async.done();
                });
                http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.ArrayBuffer }))
                    .subscribe(function (res) { });
            }));
            testing_internal_1.it('should be able to consume a buffer containing a String as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toBe('base response');
                    async.done();
                });
            }));
            testing_internal_1.it('should be able to consume a buffer containing an ArrayBuffer as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var arrayBuffer = http_utils_1.stringToArrayBuffer('{"response": "ok"}');
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: arrayBuffer })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBe(arrayBuffer);
                    matchers_1.expect(res.text()).toEqual('{"response": "ok"}');
                    matchers_1.expect(res.json()).toEqual({ response: 'ok' });
                    async.done();
                });
            }));
            testing_internal_1.it('should be able to consume a buffer containing an Object as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var simpleObject = { 'content': 'ok' };
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: simpleObject })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toEqual(JSON.stringify(simpleObject, null, 2));
                    matchers_1.expect(res.json()).toBe(simpleObject);
                    async.done();
                });
            }));
            testing_internal_1.it('should preserve encoding of ArrayBuffer response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = 'é@θЂ';
                var arrayBuffer = http_utils_1.stringToArrayBuffer(message);
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: arrayBuffer })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toEqual(message);
                    async.done();
                });
            }));
            testing_internal_1.it('should preserve encoding of String response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = 'é@θЂ';
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: message })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toEqual(http_utils_1.stringToArrayBuffer(message));
                    async.done();
                });
            }));
            testing_internal_1.it('should have an equivalent response independently of the buffer used', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = { 'param': 'content' };
                backend.connections.subscribe(function (c) {
                    var body = function () {
                        switch (c.request.responseType) {
                            case index_1.ResponseContentType.Text:
                                return JSON.stringify(message, null, 2);
                            case index_1.ResponseContentType.Json:
                                return message;
                            case index_1.ResponseContentType.ArrayBuffer:
                                return http_utils_1.stringToArrayBuffer(JSON.stringify(message, null, 2));
                        }
                    };
                    c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: body() })));
                });
                zip_1.zip(http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.Text })), http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.Json })), http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.ArrayBuffer })))
                    .subscribe(function (res) {
                    matchers_1.expect(res[0].text()).toEqual(res[1].text());
                    matchers_1.expect(res[1].text()).toEqual(res[2].text());
                    async.done();
                });
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC90ZXN0L2h0dHBfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF1QztBQUN2QyxpREFBMEQ7QUFDMUQsK0VBQTJIO0FBQzNILDJFQUFzRTtBQUN0RSw4Q0FBMkM7QUFDM0MsMkNBQXdDO0FBRXhDLGtDQUF3TztBQUN4TyxnREFBc0Q7QUFDdEQsNERBQXdFO0FBRXhFO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUM7UUFDN0IsSUFBSSxJQUFVLENBQUM7UUFDZixJQUFJLFFBQWtCLENBQUM7UUFDdkIsSUFBSSxZQUF5QixDQUFDO1FBQzlCLElBQUksVUFBdUIsQ0FBQztRQUM1QixJQUFJLEtBQVksQ0FBQztRQUVqQiw2QkFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsa0JBQVUsRUFBRSxtQkFBVyxDQUFDO2dCQUNsQyxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsa0JBQVUsRUFBRSxRQUFRLEVBQUUsMEJBQVcsRUFBQztvQkFDNUMsRUFBQyxPQUFPLEVBQUUsb0JBQVksRUFBRSxRQUFRLEVBQUUsMEJBQVcsRUFBQztpQkFDL0M7YUFDRixDQUFDLENBQUM7WUFDSCxRQUFRLEdBQUcsb0JBQVUsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQywwRUFBMEUsRUFDMUUseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUVyRCxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFJLENBQUMsQ0FBQztZQUMxQixLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFLLENBQUMsQ0FB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