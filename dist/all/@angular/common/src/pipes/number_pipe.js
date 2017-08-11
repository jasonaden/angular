"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var intl_1 = require("./intl");
var invalid_pipe_argument_error_1 = require("./invalid_pipe_argument_error");
var _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
    if (currency === void 0) { currency = null; }
    if (currencyAsSymbol === void 0) { currencyAsSymbol = false; }
    if (value == null)
        return null;
    // Convert strings to numbers
    value = typeof value === 'string' && isNumeric(value) ? +value : value;
    if (typeof value !== 'number') {
        throw invalid_pipe_argument_error_1.invalidPipeArgumentError(pipe, value);
    }
    var minInt = undefined;
    var minFraction = undefined;
    var maxFraction = undefined;
    if (style !== intl_1.NumberFormatStyle.Currency) {
        // rely on Intl default for currency
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
    }
    if (digits) {
        var parts = digits.match(_NUMBER_FORMAT_REGEXP);
        if (parts === null) {
            throw new Error(digits + " is not a valid digit info for number pipes");
        }
        if (parts[1] != null) {
            minInt = parseIntAutoRadix(parts[1]);
        }
        if (parts[3] != null) {
            minFraction = parseIntAutoRadix(parts[3]);
        }
        if (parts[5] != null) {
            maxFraction = parseIntAutoRadix(parts[5]);
        }
    }
    return intl_1.NumberFormatter.format(value, locale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyAsSymbol: currencyAsSymbol,
    });
}
/**
 * @ngModule CommonModule
 * @whatItDoes Formats a number according to locale rules.
 * @howToUse `number_expression | number[:digitInfo]`
 *
 * Formats a number as text. Group sizing and separator and other locale-specific
 * configurations are based on the active locale.
 *
 * where `expression` is a number:
 *  - `digitInfo` is a `string` which has a following format: <br>
 *     <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>
 *   - `minIntegerDigits` is the minimum number of integer digits to use. Defaults to `1`.
 *   - `minFractionDigits` is the minimum number of digits after fraction. Defaults to `0`.
 *   - `maxFractionDigits` is the maximum number of digits after fraction. Defaults to `3`.
 *
 * For more information on the acceptable range for each of these numbers and other
 * details see your native internationalization library.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * ### Example
 *
 * {@example common/pipes/ts/number_pipe.ts region='NumberPipe'}
 *
 * @stable
 */
var DecimalPipe = DecimalPipe_1 = (function () {
    function DecimalPipe(_locale) {
        this._locale = _locale;
    }
    DecimalPipe.prototype.transform = function (value, digits) {
        return formatNumber(DecimalPipe_1, this._locale, value, intl_1.NumberFormatStyle.Decimal, digits);
    };
    return DecimalPipe;
}());
DecimalPipe = DecimalPipe_1 = __decorate([
    core_1.Pipe({ name: 'number' }),
    __param(0, core_1.Inject(core_1.LOCALE_ID)),
    __metadata("design:paramtypes", [String])
], DecimalPipe);
exports.DecimalPipe = DecimalPipe;
/**
 * @ngModule CommonModule
 * @whatItDoes Formats a number as a percentage according to locale rules.
 * @howToUse `number_expression | percent[:digitInfo]`
 *
 * @description
 *
 * Formats a number as percentage.
 *
 * - `digitInfo` See {@link DecimalPipe} for detailed description.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * ### Example
 *
 * {@example common/pipes/ts/number_pipe.ts region='PercentPipe'}
 *
 * @stable
 */
var PercentPipe = PercentPipe_1 = (function () {
    function PercentPipe(_locale) {
        this._locale = _locale;
    }
    PercentPipe.prototype.transform = function (value, digits) {
        return formatNumber(PercentPipe_1, this._locale, value, intl_1.NumberFormatStyle.Percent, digits);
    };
    return PercentPipe;
}());
PercentPipe = PercentPipe_1 = __decorate([
    core_1.Pipe({ name: 'percent' }),
    __param(0, core_1.Inject(core_1.LOCALE_ID)),
    __metadata("design:paramtypes", [String])
], PercentPipe);
exports.PercentPipe = PercentPipe;
/**
 * @ngModule CommonModule
 * @whatItDoes Formats a number as currency using locale rules.
 * @howToUse `number_expression | currency[:currencyCode[:symbolDisplay[:digitInfo]]]`
 * @description
 *
 * Use `currency` to format a number as currency.
 *
 * - `currencyCode` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, such
 *    as `USD` for the US dollar and `EUR` for the euro.
 * - `symbolDisplay` is a boolean indicating whether to use the currency symbol or code.
 *   - `true`: use symbol (e.g. `$`).
 *   - `false`(default): use code (e.g. `USD`).
 * - `digitInfo` See {@link DecimalPipe} for detailed description.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * ### Example
 *
 * {@example common/pipes/ts/number_pipe.ts region='CurrencyPipe'}
 *
 * @stable
 */
var CurrencyPipe = CurrencyPipe_1 = (function () {
    function CurrencyPipe(_locale) {
        this._locale = _locale;
    }
    CurrencyPipe.prototype.transform = function (value, currencyCode, symbolDisplay, digits) {
        if (currencyCode === void 0) { currencyCode = 'USD'; }
        if (symbolDisplay === void 0) { symbolDisplay = false; }
        return formatNumber(CurrencyPipe_1, this._locale, value, intl_1.NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    };
    return CurrencyPipe;
}());
CurrencyPipe = CurrencyPipe_1 = __decorate([
    core_1.Pipe({ name: 'currency' }),
    __param(0, core_1.Inject(core_1.LOCALE_ID)),
    __metadata("design:paramtypes", [String])
], CurrencyPipe);
exports.CurrencyPipe = CurrencyPipe;
function parseIntAutoRadix(text) {
    var result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}
function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}
exports.isNumeric = isNumeric;
var DecimalPipe_1, PercentPipe_1, CurrencyPipe_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL251bWJlcl9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJFO0FBQzNFLCtCQUEwRDtBQUMxRCw2RUFBdUU7QUFFdkUsSUFBTSxxQkFBcUIsR0FBRyw2QkFBNkIsQ0FBQztBQUU1RCxzQkFDSSxJQUFlLEVBQUUsTUFBYyxFQUFFLEtBQXNCLEVBQUUsS0FBd0IsRUFDakYsTUFBc0IsRUFBRSxRQUE4QixFQUN0RCxnQkFBaUM7SUFEVCx5QkFBQSxFQUFBLGVBQThCO0lBQ3RELGlDQUFBLEVBQUEsd0JBQWlDO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBRS9CLDZCQUE2QjtJQUM3QixLQUFLLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkUsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLHNEQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsSUFBSSxNQUFNLEdBQXFCLFNBQVMsQ0FBQztJQUN6QyxJQUFJLFdBQVcsR0FBcUIsU0FBUyxDQUFDO0lBQzlDLElBQUksV0FBVyxHQUFxQixTQUFTLENBQUM7SUFDOUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLHdCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDekMsb0NBQW9DO1FBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFdBQVcs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