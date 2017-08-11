"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var injection_token_1 = require("../di/injection_token");
/**
 * @experimental i18n support is experimental.
 */
exports.LOCALE_ID = new injection_token_1.InjectionToken('LocaleId');
/**
 * @experimental i18n support is experimental.
 */
exports.TRANSLATIONS = new injection_token_1.InjectionToken('Translations');
/**
 * @experimental i18n support is experimental.
 */
exports.TRANSLATIONS_FORMAT = new injection_token_1.InjectionToken('TranslationsFormat');
/**
 * @experimental i18n support is experimental.
 */
var MissingTranslationStrategy;
(function (MissingTranslationStrategy) {
    MissingTranslationStrategy[MissingTranslationStrategy["Error"] = 0] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy["Warning"] = 1] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy = exports.MissingTranslationStrategy || (exports.MissingTranslationStrategy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvaTE4bi90b2tlbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5REFBcUQ7QUFFckQ7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBRyxJQUFJLGdDQUFjLENBQVMsVUFBVSxDQUFDLENBQUM7QUFFaEU7O0dBRUc7QUFDVSxRQUFBLFlBQVksR0FBRyxJQUFJLGdDQUFjLENBQVMsY0FBYyxDQUFDLENBQUM7QUFFdkU7O0dBRUc7QUFDVSxRQUFBLG1CQUFtQixHQUFHLElBQUksZ0NBQWMsQ0FBUyxvQkFBb0IsQ0FBQyxDQUFDO0FBRXBGOztHQUVHO0FBQ0gsSUFBWSwwQkFJWDtBQUpELFdBQVksMEJBQTBCO0lBQ3BDLDZFQUFLLENBQUE7SUFDTCxpRkFBTyxDQUFBO0lBQ1AsK0VBQU0sQ0FBQTtBQUNSLENBQUMsRUFKVywwQkFBMEIsR0FBMUIsa0NBQTBCLEtBQTFCLGtDQUEwQixRQUlyQyJ9