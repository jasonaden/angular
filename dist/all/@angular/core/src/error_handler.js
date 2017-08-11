"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
/**
 * @whatItDoes Provides a hook for centralized exception handling.
 *
 * @description
 *
 * The default implementation of `ErrorHandler` prints error messages to the `console`. To
 * intercept error handling, write a custom exception handler that replaces this default as
 * appropriate for your app.
 *
 * ### Example
 *
 * ```
 * class MyErrorHandler implements ErrorHandler {
 *   handleError(error) {
 *     // do something with the exception
 *   }
 * }
 *
 * @NgModule({
 *   providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
 * })
 * class MyModule {}
 * ```
 *
 * @stable
 */
var ErrorHandler = (function () {
    function ErrorHandler(
        /**
         * @deprecated since v4.0 parameter no longer has an effect, as ErrorHandler will never
         * rethrow.
         */
        deprecatedParameter) {
        /**
         * @internal
         */
        this._console = console;
    }
    ErrorHandler.prototype.handleError = function (error) {
        var originalError = this._findOriginalError(error);
        var context = this._findContext(error);
        // Note: Browser consoles show the place from where console.error was called.
        // We can use this to give users additional information about the error.
        var errorLogger = errors_1.getErrorLogger(error);
        errorLogger(this._console, "ERROR", error);
        if (originalError) {
            errorLogger(this._console, "ORIGINAL ERROR", originalError);
        }
        if (context) {
            errorLogger(this._console, 'ERROR CONTEXT', context);
        }
    };
    /** @internal */
    ErrorHandler.prototype._findContext = function (error) {
        if (error) {
            return errors_1.getDebugContext(error) ? errors_1.getDebugContext(error) :
                this._findContext(errors_1.getOriginalError(error));
        }
        return null;
    };
    /** @internal */
    ErrorHandler.prototype._findOriginalError = function (error) {
        var e = errors_1.getOriginalError(error);
        while (e && errors_1.getOriginalError(e)) {
            e = errors_1.getOriginalError(e);
        }
        return e;
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
function wrappedError(message, originalError) {
    var msg = message + " caused by: " + (originalError instanceof Error ? originalError.message : originalError);
    var error = Error(msg);
    error[errors_1.ERROR_ORIGINAL_ERROR] = originalError;
    return error;
}
exports.wrappedError = wrappedError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2Vycm9yX2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtQ0FBaUc7QUFJakc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSDtJQU1FO1FBQ0k7OztXQUdHO1FBQ0gsbUJBQTZCO1FBVmpDOztXQUVHO1FBQ0gsYUFBUSxHQUFZLE9BQU8sQ0FBQztJQU9RLENBQUM7SUFFckMsa0NBQVcsR0FBWCxVQUFZLEtBQVU7UUFDcEIsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsNkVBQTZFO1FBQzdFLHdFQUF3RTtRQUN4RSxJQUFNLFdBQVcsR0FBRyx1QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1osV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLG1DQUFZLEdBQVosVUFBYSxLQUFVO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLENBQUMsd0JBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyx3QkFBZSxDQUFDLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBa0IsR0FBbEIsVUFBbUIsS0FBWTtRQUM3QixJQUFJLENBQUMsR0FBRyx5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsSUFBSSx5QkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2hDLENBQUMsR0FBRyx5QkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFoREQsSUFnREM7QUFoRFksb0NBQVk7QUFrRHpCLHNCQUE2QixPQUFlLEVBQUUsYUFBa0I7SUFDOUQsSUFBTSxHQUFHLEdBQ0YsT0FBTyxxQkFBZSxhQUFhLFlBQVksS0FBSyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEdBQUUsYUFBYSxDQUFHLENBQUM7SUFDdEcsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLEtBQWEsQ0FBQyw2QkFBb0IsQ0FBQyxHQUFHLGFBQWEsQ0FBQztJQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQU5ELG9DQU1DIn0=