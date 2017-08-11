"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.JsonpCallbackContext
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var jsonp_1 = require("../src/jsonp");
var request_1 = require("../src/request");
var response_1 = require("../src/response");
var jsonp_mock_1 = require("./jsonp_mock");
function runOnlyCallback(home, data) {
    var keys = Object.keys(home);
    expect(keys.length).toBe(1);
    var callback = home[keys[0]];
    delete home[keys[0]];
    callback(data);
}
var SAMPLE_REQ = new request_1.HttpRequest('JSONP', '/test');
function main() {
    testing_internal_1.describe('JsonpClientBackend', function () {
        var home = {};
        var document;
        var backend;
        beforeEach(function () {
            home = {};
            document = new jsonp_mock_1.MockDocument();
            backend = new jsonp_1.JsonpClientBackend(home, document);
        });
        testing_internal_1.it('handles a basic request', function (done) {
            backend.handle(SAMPLE_REQ).toArray().subscribe(function (events) {
                expect(events.map(function (event) { return event.type; })).toEqual([
                    response_1.HttpEventType.Sent,
                    response_1.HttpEventType.Response,
                ]);
                done();
            });
            runOnlyCallback(home, { data: 'This is a test' });
            document.mockLoad();
        });
        testing_internal_1.it('handles an error response properly', function (done) {
            var error = new Error('This is a test error');
            backend.handle(SAMPLE_REQ).toArray().subscribe(undefined, function (err) {
                expect(err.status).toBe(0);
                expect(err.error).toBe(error);
                done();
            });
            document.mockError(error);
        });
        testing_internal_1.describe('throws an error', function () {
            testing_internal_1.it('when request method is not JSONP', function () { return expect(function () { return backend.handle(SAMPLE_REQ.clone({ method: 'GET' })); })
                .toThrowError(jsonp_1.JSONP_ERR_WRONG_METHOD); });
            testing_internal_1.it('when response type is not json', function () { return expect(function () { return backend.handle(SAMPLE_REQ.clone({ responseType: 'text' })); })
                .toThrowError(jsonp_1.JSONP_ERR_WRONG_RESPONSE_TYPE); });
            testing_internal_1.it('when callback is never called', function (done) {
                backend.handle(SAMPLE_REQ).subscribe(undefined, function (err) {
                    expect(err.status).toBe(0);
                    expect(err.error instanceof Error).toEqual(true);
                    expect(err.error.message).toEqual(jsonp_1.JSONP_ERR_NO_CALLBACK);
                    done();
                });
                document.mockLoad();
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3QvanNvbnBfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFtRjtBQUVuRixzQ0FBOEg7QUFDOUgsMENBQTJDO0FBQzNDLDRDQUFpRTtBQUVqRSwyQ0FBMEM7QUFFMUMseUJBQXlCLElBQVMsRUFBRSxJQUFZO0lBQzlDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQixDQUFDO0FBRUQsSUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBVyxDQUFRLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU1RDtJQUNFLDJCQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxRQUFzQixDQUFDO1FBQzNCLElBQUksT0FBMkIsQ0FBQztRQUNoQyxVQUFVLENBQUM7WUFDVCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1YsUUFBUSxHQUFHLElBQUkseUJBQVksRUFBRSxDQUFDO1lBQzlCLE9BQU8sR0FBRyxJQUFJLDBCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFFLENBQUMseUJBQXlCLEVBQUUsVUFBQyxJQUFZO1lBQ3pD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