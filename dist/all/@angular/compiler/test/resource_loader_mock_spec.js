"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
function main() {
    testing_internal_1.describe('MockResourceLoader', function () {
        var resourceLoader;
        testing_internal_1.beforeEach(function () { resourceLoader = new resource_loader_mock_1.MockResourceLoader(); });
        function expectResponse(request, url, response, done) {
            if (done === void 0) { done = null; }
            function onResponse(text) {
                if (response === null) {
                    throw "Unexpected response " + url + " -> " + text;
                }
                else {
                    testing_internal_1.expect(text).toEqual(response);
                    if (done != null)
                        done();
                }
                return text;
            }
            function onError(error) {
                if (response !== null) {
                    throw "Unexpected error " + url;
                }
                else {
                    testing_internal_1.expect(error).toEqual("Failed to load " + url);
                    if (done != null)
                        done();
                }
                return error;
            }
            request.then(onResponse, onError);
        }
        testing_internal_1.it('should return a response from the definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.when(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return an error from the definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            resourceLoader.when(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return a response from the expectations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.expect(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should return an error from the expectations', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            var response = null;
            resourceLoader.expect(url, response);
            expectResponse(resourceLoader.get(url), url, response, function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should not reuse expectations', function () {
            var url = '/foo';
            var response = 'bar';
            resourceLoader.expect(url, response);
            resourceLoader.get(url);
            resourceLoader.get(url);
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unexpected request /foo');
        });
        testing_internal_1.it('should return expectations before definitions', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var url = '/foo';
            resourceLoader.when(url, 'when');
            resourceLoader.expect(url, 'expect');
            expectResponse(resourceLoader.get(url), url, 'expect');
            expectResponse(resourceLoader.get(url), url, 'when', function () { return async.done(); });
            resourceLoader.flush();
        }));
        testing_internal_1.it('should throw when there is no definitions or expectations', function () {
            resourceLoader.get('/foo');
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unexpected request /foo');
        });
        testing_internal_1.it('should throw when flush is called without any pending requests', function () {
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('No pending requests to flush');
        });
        testing_internal_1.it('should throw on unsatisfied expectations', function () {
            resourceLoader.expect('/foo', 'bar');
            resourceLoader.when('/bar', 'foo');
            resourceLoader.get('/bar');
            testing_internal_1.expect(function () { resourceLoader.flush(); }).toThrowError('Unsatisfied requests: /foo');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvcmVzb3VyY2VfbG9hZGVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJGQUFzRjtBQUN0RiwrRUFBd0g7QUFFeEg7SUFDRSwyQkFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksY0FBa0MsQ0FBQztRQUV2Qyw2QkFBVSxDQUFDLGNBQVEsY0FBYyxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpFLHdCQUNJLE9BQXdCLEVBQUUsR0FBVyxFQUFFLFFBQWdCLEVBQUUsSUFBeUI7WUFBekIscUJBQUEsRUFBQSxPQUFtQixJQUFNO1lBQ3BGLG9CQUFvQixJQUFZO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSx5QkFBdUIsR0FBRyxZQUFPLElBQU0sQ0FBQztnQkFDaEQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTix5QkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQzt3QkFBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELGlCQUFpQixLQUFhO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxzQkFBb0IsR0FBSyxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxD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