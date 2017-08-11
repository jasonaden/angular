"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("@angular/core/src/errors");
var error_handler_1 = require("../src/error_handler");
var MockConsole = (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.error = function () {
        var s = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            s[_i] = arguments[_i];
        }
        this.res.push(s);
    };
    return MockConsole;
}());
function main() {
    function errorToString(error) {
        var logger = new MockConsole();
        var errorHandler = new error_handler_1.ErrorHandler();
        errorHandler._console = logger;
        errorHandler.handleError(error);
        return logger.res.map(function (line) { return line.join('#'); }).join('\n');
    }
    describe('ErrorHandler', function () {
        it('should output exception', function () {
            var e = errorToString(new Error('message!'));
            expect(e).toContain('message!');
        });
        describe('context', function () {
            it('should print nested context', function () {
                var cause = new Error('message!');
                var context = { source: 'context!', toString: function () { return 'Context'; } };
                var original = debugError(cause, context);
                var e = errorToString(error_handler_1.wrappedError('message', original));
                expect(e).toEqual("ERROR#Error: message caused by: Error in context! caused by: message!\nORIGINAL ERROR#Error: message!\nERROR CONTEXT#Context");
            });
        });
        describe('original exception', function () {
            it('should print original exception message if available (original is Error)', function () {
                var realOriginal = new Error('inner');
                var original = error_handler_1.wrappedError('wrapped', realOriginal);
                var e = errorToString(error_handler_1.wrappedError('wrappedwrapped', original));
                expect(e).toContain('inner');
            });
            it('should print original exception message if available (original is not Error)', function () {
                var realOriginal = new Error('custom');
                var original = error_handler_1.wrappedError('wrapped', realOriginal);
                var e = errorToString(error_handler_1.wrappedError('wrappedwrapped', original));
                expect(e).toContain('custom');
            });
        });
        it('should use the error logger on the error', function () {
            var err = new Error('test');
            var console = new MockConsole();
            var errorHandler = new error_handler_1.ErrorHandler();
            errorHandler._console = console;
            var logger = jasmine.createSpy('logger');
            err[errors_1.ERROR_LOGGER] = logger;
            errorHandler.handleError(err);
            expect(console.res).toEqual([]);
            expect(logger).toHaveBeenCalledWith(console, 'ERROR', err);
        });
    });
}
exports.main = main;
function debugError(originalError, context) {
    var error = error_handler_1.wrappedError("Error in " + context.source, originalError);
    error[errors_1.ERROR_DEBUG_CONTEXT] = context;
    error[errors_1.ERROR_TYPE] = debugError;
    return error;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfaGFuZGxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2Vycm9yX2hhbmRsZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1EQUF1RjtBQUV2RixzREFBZ0U7QUFFaEU7SUFBQTtRQUNFLFFBQUcsR0FBWSxFQUFFLENBQUM7SUFFcEIsQ0FBQztJQURDLDJCQUFLLEdBQUw7UUFBTSxXQUFXO2FBQVgsVUFBVyxFQUFYLHFCQUFXLEVBQVgsSUFBVztZQUFYLHNCQUFXOztRQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUNoRCxrQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBRUQ7SUFDRSx1QkFBdUIsS0FBVTtRQUMvQixJQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLElBQU0sWUFBWSxHQUFHLElBQUksNEJBQVksRUFBRSxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxRQUFRLEdBQUcsTUFBYSxDQUFDO1FBQ3RDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLElBQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFB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