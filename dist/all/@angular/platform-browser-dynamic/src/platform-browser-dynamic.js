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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var platform_providers_1 = require("./platform_providers");
var resource_loader_cache_1 = require("./resource_loader/resource_loader_cache");
__export(require("./private_export"));
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
/**
 * @experimental
 */
exports.RESOURCE_CACHE_PROVIDER = [{ provide: compiler_1.ResourceLoader, useClass: resource_loader_cache_1.CachedResourceLoader, deps: [] }];
/**
 * @stable
 */
exports.platformBrowserDynamic = core_1.createPlatformFactory(compiler_1.platformCoreDynamic, 'browserDynamic', platform_providers_1.INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tYnJvd3Nlci1keW5hbWljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3NyYy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCw4Q0FBc0U7QUFDdEUsc0NBQTJGO0FBRTNGLDJEQUFpRjtBQUNqRixpRkFBNkU7QUFFN0Usc0NBQWlDO0FBQ2pDLHFDQUFrQztBQUExQiw0QkFBQSxPQUFPLENBQUE7QUFDZjs7R0FFRztBQUNVLFFBQUEsdUJBQXVCLEdBQ2hDLENBQUMsRUFBQyxPQUFPLEVBQUUseUJBQWMsRUFBRSxRQUFRLEVBQUUsNENBQW9CLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7QUFFMUU7O0dBRUc7QUFDVSxRQUFBLHNCQUFzQixHQUFHLDRCQUFxQixDQUN2RCw4QkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxnRUFBMkMsQ0FBQyxDQUFDIn0=