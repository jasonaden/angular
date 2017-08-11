"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
var async_pipe_1 = require("./async_pipe");
exports.AsyncPipe = async_pipe_1.AsyncPipe;
var case_conversion_pipes_1 = require("./case_conversion_pipes");
exports.LowerCasePipe = case_conversion_pipes_1.LowerCasePipe;
exports.TitleCasePipe = case_conversion_pipes_1.TitleCasePipe;
exports.UpperCasePipe = case_conversion_pipes_1.UpperCasePipe;
var date_pipe_1 = require("./date_pipe");
exports.DatePipe = date_pipe_1.DatePipe;
var i18n_plural_pipe_1 = require("./i18n_plural_pipe");
exports.I18nPluralPipe = i18n_plural_pipe_1.I18nPluralPipe;
var i18n_select_pipe_1 = require("./i18n_select_pipe");
exports.I18nSelectPipe = i18n_select_pipe_1.I18nSelectPipe;
var json_pipe_1 = require("./json_pipe");
exports.JsonPipe = json_pipe_1.JsonPipe;
var number_pipe_1 = require("./number_pipe");
exports.CurrencyPipe = number_pipe_1.CurrencyPipe;
exports.DecimalPipe = number_pipe_1.DecimalPipe;
exports.PercentPipe = number_pipe_1.PercentPipe;
var slice_pipe_1 = require("./slice_pipe");
exports.SlicePipe = slice_pipe_1.SlicePipe;
/**
 * A collection of Angular pipes that are likely to be used in each and every application.
 */
exports.COMMON_PIPES = [
    async_pipe_1.AsyncPipe,
    case_conversion_pipes_1.UpperCasePipe,
    case_conversion_pipes_1.LowerCasePipe,
    json_pipe_1.JsonPipe,
    slice_pipe_1.SlicePipe,
    number_pipe_1.DecimalPipe,
    number_pipe_1.PercentPipe,
    case_conversion_pipes_1.TitleCasePipe,
    number_pipe_1.CurrencyPipe,
    date_pipe_1.DatePipe,
    i18n_plural_pipe_1.I18nPluralPipe,
    i18n_select_pipe_1.I18nSelectPipe,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7R0FJRztBQUNILDJDQUF1QztBQVVyQyxvQkFWTSxzQkFBUyxDQVVOO0FBVFgsaUVBQW9GO0FBZ0JsRix3QkFoQk0scUNBQWEsQ0FnQk47QUFHYix3QkFuQnFCLHFDQUFhLENBbUJyQjtBQUNiLHdCQXBCb0MscUNBQWEsQ0FvQnBDO0FBbkJmLHlDQUFxQztBQVVuQyxtQkFWTSxvQkFBUSxDQVVOO0FBVFYsdURBQWtEO0FBV2hELHlCQVhNLGlDQUFjLENBV047QUFWaEIsdURBQWtEO0FBV2hELHlCQVhNLGlDQUFjLENBV047QUFWaEIseUNBQXFDO0FBV25DLG1CQVhNLG9CQUFRLENBV047QUFWViw2Q0FBcUU7QUFLbkUsdUJBTE0sMEJBQVksQ0FLTjtBQUVaLHNCQVBvQix5QkFBVyxDQU9wQjtBQUtYLHNCQVppQyx5QkFBVyxDQVlqQztBQVhiLDJDQUF1QztBQVlyQyxvQkFaTSxzQkFBUyxDQVlOO0FBTVg7O0dBRUc7QUFDVSxRQUFBLFlBQVksR0FBRztJQUMxQixzQkFBUztJQUNULHFDQUFhO0lBQ2IscUNBQWE7SUFDYixvQkFBUTtJQUNSLHNCQUFTO0lBQ1QseUJBQVc7SUFDWCx5QkFBVztJQUNYLHFDQUFhO0lBQ2IsMEJBQVk7SUFDWixvQkFBUTtJQUNSLGlDQUFjO0lBQ2QsaUNBQWM7Q0FDZixDQUFDIn0=