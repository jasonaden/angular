"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/toPromise");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var client_1 = require("../src/client");
var response_1 = require("../src/response");
var backend_1 = require("../testing/src/backend");
function main() {
    testing_internal_1.describe('HttpClient', function () {
        var client = null;
        var backend = null;
        beforeEach(function () {
            backend = new backend_1.HttpClientTestingBackend();
            client = new client_1.HttpClient(backend);
        });
        afterEach(function () { backend.verify(); });
        testing_internal_1.describe('makes a basic request', function () {
            testing_internal_1.it('for JSON data', function (done) {
                client.get('/test').subscribe(function (res) {
                    expect(res['data']).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' });
            });
            testing_internal_1.it('for text data', function (done) {
                client.get('/test', { responseType: 'text' }).subscribe(function (res) {
                    expect(res).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush('hello world');
            });
            testing_internal_1.it('for an arraybuffer', function (done) {
                var body = new ArrayBuffer(4);
                client.get('/test', { responseType: 'arraybuffer' }).subscribe(function (res) {
                    expect(res).toBe(body);
                    done();
                });
                backend.expectOne('/test').flush(body);
            });
            if (typeof Blob !== 'undefined') {
                testing_internal_1.it('for a blob', function (done) {
                    var body = new Blob([new ArrayBuffer(4)]);
                    client.get('/test', { responseType: 'blob' }).subscribe(function (res) {
                        expect(res).toBe(body);
                        done();
                    });
                    backend.expectOne('/test').flush(body);
                });
            }
            testing_internal_1.it('that returns a response', function (done) {
                var body = { 'data': 'hello world' };
                client.get('/test', { observe: 'response' }).subscribe(function (res) {
                    expect(res instanceof response_1.HttpResponse).toBe(true);
                    expect(res.body).toBe(body);
                    done();
                });
                backend.expectOne('/test').flush(body);
            });
            testing_internal_1.it('that returns a stream of events', function (done) {
                client.get('/test', { observe: 'events' }).toArray().toPromise().then(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[0].type).toBe(response_1.HttpEventType.Sent);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    expect(events[1] instanceof response_1.HttpResponse).toBeTruthy();
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' });
            });
            testing_internal_1.it('with progress events enabled', function (done) {
                client.get('/test', { reportProgress: true }).subscribe(function () { return done(); });
                var req = backend.expectOne('/test');
                expect(req.request.reportProgress).toEqual(true);
                req.flush({});
            });
        });
        testing_internal_1.describe('makes a POST request', function () {
            testing_internal_1.it('with text data', function (done) {
                client.post('/test', 'text body', { observe: 'response', responseType: 'text' })
                    .subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                backend.expectOne('/test').flush('hello world');
            });
            testing_internal_1.it('with json data', function (done) {
                var body = { data: 'json body' };
                client.post('/test', body, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(body);
                testReq.flush('hello world');
            });
            testing_internal_1.it('with an arraybuffer', function (done) {
                var body = new ArrayBuffer(4);
                client.post('/test', body, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(body);
                testReq.flush('hello world');
            });
        });
        testing_internal_1.describe('makes a JSONP request', function () {
            testing_internal_1.it('with properly set method and callback', function (done) {
                client.jsonp('/test', 'myCallback').subscribe(function () { return done(); });
                backend.expectOne({ method: 'JSONP', url: '/test?myCallback=JSONP_CALLBACK' })
                    .flush('hello world');
            });
        });
        testing_internal_1.describe('makes a request for an error response', function () {
            testing_internal_1.it('with a JSON body', function (done) {
                client.get('/test').subscribe(function () { }, function (res) {
                    expect(res.error.data).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' }, { status: 500, statusText: 'Server error' });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L2NsaWVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgscUNBQW1DO0FBQ25DLHVDQUFxQztBQUVyQywrRUFBd0Y7QUFFeEYsd0NBQXlDO0FBQ3pDLDRDQUErRTtBQUMvRSxrREFBZ0U7QUFFaEU7SUFDRSwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFJLE1BQU0sR0FBZSxJQUFNLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQTZCLElBQU0sQ0FBQztRQUMvQyxVQUFVLENBQUM7WUFDVCxPQUFPLEdBQUcsSUFBSSxrQ0FBd0IsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsY0FBUSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QywyQkFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLHFCQUFFLENBQUMsZUFBZSxFQUFFLFVBQUMsSUFBWTtnQkFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO29CQUMvQixNQUFNLENBQUUsR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEVBQUUsQ0FBQztnQkFDVCxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyxlQUFlLEVBQUUs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