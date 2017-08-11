"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var number_pipe_1 = require("@angular/common/src/pipes/number_pipe");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
function main() {
    testing_internal_1.describe('Number pipes', function () {
        testing_internal_1.describe('DecimalPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.DecimalPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(pipe.transform(12345)).toEqual('12,345');
                    testing_internal_1.expect(pipe.transform(123, '.2')).toEqual('123.00');
                    testing_internal_1.expect(pipe.transform(1, '3.')).toEqual('001');
                    testing_internal_1.expect(pipe.transform(1.1, '3.4-5')).toEqual('001.1000');
                    testing_internal_1.expect(pipe.transform(1.123456, '3.4-5')).toEqual('001.12346');
                    testing_internal_1.expect(pipe.transform(1.1234)).toEqual('1.123');
                });
                testing_internal_1.it('should support strings', function () {
                    testing_internal_1.expect(pipe.transform('12345')).toEqual('12,345');
                    testing_internal_1.expect(pipe.transform('123', '.2')).toEqual('123.00');
                    testing_internal_1.expect(pipe.transform('1', '3.')).toEqual('001');
                    testing_internal_1.expect(pipe.transform('1.1', '3.4-5')).toEqual('001.1000');
                    testing_internal_1.expect(pipe.transform('1.123456', '3.4-5')).toEqual('001.12346');
                    testing_internal_1.expect(pipe.transform('1.1234')).toEqual('1.123');
                });
                testing_internal_1.it('should not support other objects', function () {
                    testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError();
                    testing_internal_1.expect(function () { return pipe.transform('123abc'); }).toThrowError();
                });
            });
        });
        testing_internal_1.describe('PercentPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.PercentPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    testing_internal_1.expect(normalize(pipe.transform(1.23))).toEqual('123%');
                    testing_internal_1.expect(normalize(pipe.transform(1.2, '.2'))).toEqual('120.00%');
                });
                testing_internal_1.it('should not support other objects', function () { testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError(); });
            });
        });
        testing_internal_1.describe('CurrencyPipe', function () {
            var pipe;
            testing_internal_1.beforeEach(function () { pipe = new common_1.CurrencyPipe('en-US'); });
            testing_internal_1.describe('transform', function () {
                testing_internal_1.it('should return correct value for numbers', function () {
                    // In old Chrome, default formatiing for USD is different
                    if (browser_util_1.browserDetection.isOldChrome) {
                        testing_internal_1.expect(normalize(pipe.transform(123))).toEqual('USD123');
                    }
                    else {
                        testing_internal_1.expect(normalize(pipe.transform(123))).toEqual('USD123.00');
                    }
                    testing_internal_1.expect(normalize(pipe.transform(12, 'EUR', false, '.1'))).toEqual('EUR12.0');
                    testing_internal_1.expect(normalize(pipe.transform(5.1234, 'USD', false, '.0-3'))).toEqual('USD5.123');
                });
                testing_internal_1.it('should not support other objects', function () { testing_internal_1.expect(function () { return pipe.transform(new Object()); }).toThrowError(); });
            });
        });
        testing_internal_1.describe('isNumeric', function () {
            testing_internal_1.it('should return true when passing correct numeric string', function () { testing_internal_1.expect(number_pipe_1.isNumeric('2')).toBe(true); });
            testing_internal_1.it('should return true when passing correct double string', function () { testing_internal_1.expect(number_pipe_1.isNumeric('1.123')).toBe(true); });
            testing_internal_1.it('should return true when passing correct negative string', function () { testing_internal_1.expect(number_pipe_1.isNumeric('-2')).toBe(true); });
            testing_internal_1.it('should return true when passing correct scientific notation string', function () { testing_internal_1.expect(number_pipe_1.isNumeric('1e5')).toBe(true); });
            testing_internal_1.it('should return false when passing incorrect numeric', function () { testing_internal_1.expect(number_pipe_1.isNumeric('a')).toBe(false); });
            testing_internal_1.it('should return false when passing parseable but non numeric', function () { testing_internal_1.expect(number_pipe_1.isNumeric('2a')).toBe(false); });
        });
    });
}
exports.main = main;
// Between the symbol and the number, Edge adds a no breaking space and IE11 adds a standard space
function normalize(s) {
    return s.replace(/\u00A0| /g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L3BpcGVzL251bWJlcl9waXBlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBdUU7QUFDdkUscUVBQWdFO0FBQ2hFLCtFQUE0RjtBQUM1RixtRkFBb0Y7QUFFcEY7SUFDRSwyQkFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QiwyQkFBUSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLElBQWlCLENBQUM7WUFFdEIsNkJBQVUsQ0FBQyxjQUFRLElBQUksR0FBRyxJQUFJLG9CQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RCwyQkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIscUJBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtvQkFDNUMseUJBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQyx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN6RCx5QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxD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