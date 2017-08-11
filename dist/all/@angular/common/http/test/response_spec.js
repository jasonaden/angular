"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var headers_1 = require("../src/headers");
var response_1 = require("../src/response");
function main() {
    testing_internal_1.describe('HttpResponse', function () {
        testing_internal_1.describe('constructor()', function () {
            testing_internal_1.it('fully constructs responses', function () {
                var resp = new response_1.HttpResponse({
                    body: 'test body',
                    headers: new headers_1.HttpHeaders({
                        'Test': 'Test header',
                    }),
                    status: 201,
                    statusText: 'Created',
                    url: '/test',
                });
                expect(resp.body).toBe('test body');
                expect(resp.headers instanceof headers_1.HttpHeaders).toBeTruthy();
                expect(resp.headers.get('Test')).toBe('Test header');
                expect(resp.status).toBe(201);
                expect(resp.statusText).toBe('Created');
                expect(resp.url).toBe('/test');
            });
            testing_internal_1.it('uses defaults if no args passed', function () {
                var resp = new response_1.HttpResponse({});
                expect(resp.headers).not.toBeNull();
                expect(resp.status).toBe(200);
                expect(resp.statusText).toBe('OK');
                expect(resp.body).toBeNull();
                expect(resp.ok).toBeTruthy();
                expect(resp.url).toBeNull();
            });
        });
        testing_internal_1.it('.ok is determined by status', function () {
            var good = new response_1.HttpResponse({ status: 200 });
            var alsoGood = new response_1.HttpResponse({ status: 299 });
            var badHigh = new response_1.HttpResponse({ status: 300 });
            var badLow = new response_1.HttpResponse({ status: 199 });
            expect(good.ok).toBe(true);
            expect(alsoGood.ok).toBe(true);
            expect(badHigh.ok).toBe(false);
            expect(badLow.ok).toBe(false);
        });
        testing_internal_1.describe('.clone()', function () {
            testing_internal_1.it('copies the original when given no arguments', function () {
                var clone = new response_1.HttpResponse({ body: 'test', status: 201, statusText: 'created', url: '/test' })
                    .clone();
                expect(clone.body).toBe('test');
                expect(clone.status).toBe(201);
                expect(clone.statusText).toBe('created');
                expect(clone.url).toBe('/test');
                expect(clone.headers).not.toBeNull();
            });
            testing_internal_1.it('overrides the original', function () {
                var orig = new response_1.HttpResponse({ body: 'test', status: 201, statusText: 'created', url: '/test' });
                var clone = orig.clone({ body: { data: 'test' }, status: 200, statusText: 'Okay', url: '/bar' });
                expect(clone.body).toEqual({ data: 'test' });
                expect(clone.status).toBe(200);
                expect(clone.statusText).toBe('Okay');
                expect(clone.url).toBe('/bar');
                expect(clone.headers).toBe(orig.headers);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2Vfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3QvcmVzcG9uc2Vfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFtRjtBQUVuRiwwQ0FBMkM7QUFDM0MsNENBQTZDO0FBRTdDO0lBQ0UsMkJBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsMkJBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIscUJBQUUsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSx1QkFBWSxDQUFDO29CQUM1QixJQUFJLEVBQUUsV0FBVztvQkFDakIsT0FBTyxFQUFFLElBQUkscUJBQVcsQ0FBQzt3QkFDdkIsTUFBTSxFQUFFLGFBQWE7cUJBQ3RCLENBQUM7b0JBQ0YsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLEdBQUcsRUFBRSxPQUFPO2lCQUNiLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVkscUJBQVcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMs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