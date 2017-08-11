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
 * Entry point for all public APIs of the language service package.
 */
var language_service_1 = require("./src/language_service");
exports.createLanguageService = language_service_1.createLanguageService;
__export(require("./src/ts_plugin"));
var typescript_host_1 = require("./src/typescript_host");
exports.TypeScriptServiceHost = typescript_host_1.TypeScriptServiceHost;
exports.createLanguageServiceFromTypescript = typescript_host_1.createLanguageServiceFromTypescript;
var version_1 = require("./src/version");
exports.VERSION = version_1.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7O0FBRUg7Ozs7R0FJRztBQUNILDJEQUE2RDtBQUFyRCxtREFBQSxxQkFBcUIsQ0FBQTtBQUM3QixxQ0FBZ0M7QUFFaEMseURBQWlHO0FBQXpGLGtEQUFBLHFCQUFxQixDQUFBO0FBQUUsZ0VBQUEsbUNBQW1DLENBQUE7QUFDbEUseUNBQXNDO0FBQTlCLDRCQUFBLE9BQU8sQ0FBQSJ9