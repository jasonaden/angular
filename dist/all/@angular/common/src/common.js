"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all public APIs of the common package.
 */
__export(require("./location/index"));
var localization_1 = require("./localization");
exports.NgLocaleLocalization = localization_1.NgLocaleLocalization;
exports.NgLocalization = localization_1.NgLocalization;
var cookie_1 = require("./cookie");
exports.ɵparseCookieValue = cookie_1.parseCookieValue;
var common_module_1 = require("./common_module");
exports.CommonModule = common_module_1.CommonModule;
var index_1 = require("./directives/index");
exports.NgClass = index_1.NgClass;
exports.NgFor = index_1.NgFor;
exports.NgForOf = index_1.NgForOf;
exports.NgForOfContext = index_1.NgForOfContext;
exports.NgIf = index_1.NgIf;
exports.NgIfContext = index_1.NgIfContext;
exports.NgPlural = index_1.NgPlural;
exports.NgPluralCase = index_1.NgPluralCase;
exports.NgStyle = index_1.NgStyle;
exports.NgSwitch = index_1.NgSwitch;
exports.NgSwitchCase = index_1.NgSwitchCase;
exports.NgSwitchDefault = index_1.NgSwitchDefault;
exports.NgTemplateOutlet = index_1.NgTemplateOutlet;
exports.NgComponentOutlet = index_1.NgComponentOutlet;
var dom_tokens_1 = require("./dom_tokens");
exports.DOCUMENT = dom_tokens_1.DOCUMENT;
var index_2 = require("./pipes/index");
exports.AsyncPipe = index_2.AsyncPipe;
exports.DatePipe = index_2.DatePipe;
exports.I18nPluralPipe = index_2.I18nPluralPipe;
exports.I18nSelectPipe = index_2.I18nSelectPipe;
exports.JsonPipe = index_2.JsonPipe;
exports.LowerCasePipe = index_2.LowerCasePipe;
exports.CurrencyPipe = index_2.CurrencyPipe;
exports.DecimalPipe = index_2.DecimalPipe;
exports.PercentPipe = index_2.PercentPipe;
exports.SlicePipe = index_2.SlicePipe;
exports.UpperCasePipe = index_2.UpperCasePipe;
exports.TitleCasePipe = index_2.TitleCasePipe;
var platform_id_1 = require("./platform_id");
exports.ɵPLATFORM_BROWSER_ID = platform_id_1.PLATFORM_BROWSER_ID;
exports.ɵPLATFORM_SERVER_ID = platform_id_1.PLATFORM_SERVER_ID;
exports.ɵPLATFORM_WORKER_APP_ID = platform_id_1.PLATFORM_WORKER_APP_ID;
exports.ɵPLATFORM_WORKER_UI_ID = platform_id_1.PLATFORM_WORKER_UI_ID;
exports.isPlatformBrowser = platform_id_1.isPlatformBrowser;
exports.isPlatformServer = platform_id_1.isPlatformServer;
exports.isPlatformWorkerApp = platform_id_1.isPlatformWorkerApp;
exports.isPlatformWorkerUi = platform_id_1.isPlatformWorkerUi;
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSDs7OztHQUlHO0FBQ0gsc0NBQWlDO0FBQ2pDLCtDQUFvRTtBQUE1RCw4Q0FBQSxvQkFBb0IsQ0FBQTtBQUFFLHdDQUFBLGNBQWMsQ0FBQTtBQUM1QyxtQ0FBK0Q7QUFBdkQscUNBQUEsZ0JBQWdCLENBQXFCO0FBQzdDLGlEQUE2QztBQUFyQyx1Q0FBQSxZQUFZLENBQUE7QUFDcEIsNENBQTZNO0FBQXJNLDBCQUFBLE9BQU8sQ0FBQTtBQUFFLHdCQUFBLEtBQUssQ0FBQTtBQUFFLDBCQUFBLE9BQU8sQ0FBQTtBQUFFLGlDQUFBLGNBQWMsQ0FBQTtBQUFFLHVCQUFBLElBQUksQ0FBQTtBQUFFLDhCQUFBLFdBQVcsQ0FBQTtBQUFFLDJCQUFBLFFBQVEsQ0FBQTtBQUFFLCtCQUFBLFlBQVksQ0FBQTtBQUFFLDBCQUFBLE9BQU8sQ0FBQTtBQUFFLDJCQUFBLFFBQVEsQ0FBQTtBQUFFLCtCQUFBLFlBQVksQ0FBQTtBQUFFLGtDQUFBLGVBQWUsQ0FBQTtBQUFFLG1DQUFBLGdCQUFnQixDQUFBO0FBQUUsb0NBQUEsaUJBQWlCLENBQUE7QUFDakwsMkNBQXNDO0FBQTlCLGdDQUFBLFFBQVEsQ0FBQTtBQUNoQix1Q0FBNEw7QUFBcEwsNEJBQUEsU0FBUyxDQUFBO0FBQUUsMkJBQUEsUUFBUSxDQUFBO0FBQUUsaUNBQUEsY0FBYyxDQUFBO0FBQUUsaUNBQUEsY0FBYyxDQUFBO0FBQUUsMkJBQUEsUUFBUSxDQUFBO0FBQUUsZ0NBQUEsYUFBYSxDQUFBO0FBQUUsK0JBQUEsWUFBWSxDQUFBO0FBQUUsOEJBQUEsV0FBVyxDQUFBO0FBQUUsOEJBQUEsV0FBVyxDQUFBO0FBQUUsNEJBQUEsU0FBUyxDQUFBO0FBQUUsZ0NBQUEsYUFBYSxDQUFBO0FBQUUsZ0NBQUEsYUFBYSxDQUFBO0FBQ3JLLDZDQUF1UztBQUEvUiw2Q0FBQSxtQkFBbUIsQ0FBd0I7QUFBRSw0Q0FBQSxrQkFBa0IsQ0FBdUI7QUFBRSxnREFBQSxzQkFBc0IsQ0FBMkI7QUFBRSwrQ0FBQSxxQkFBcUIsQ0FBMEI7QUFBRSwwQ0FBQSxpQkFBaUIsQ0FBQTtBQUFFLHlDQUFBLGdCQUFnQixDQUFBO0FBQUUsNENBQUEsbUJBQW1CLENBQUE7QUFBRSwyQ0FBQSxrQkFBa0IsQ0FBQTtBQUNoUixxQ0FBa0M7QUFBMUIsNEJBQUEsT0FBTyxDQUFBIn0=