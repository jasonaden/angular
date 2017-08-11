"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_BROWSER_ID = 'browser';
exports.PLATFORM_SERVER_ID = 'server';
exports.PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
exports.PLATFORM_WORKER_UI_ID = 'browserWorkerUi';
/**
 * Returns whether a platform id represents a browser platform.
 * @experimental
 */
function isPlatformBrowser(platformId) {
    return platformId === exports.PLATFORM_BROWSER_ID;
}
exports.isPlatformBrowser = isPlatformBrowser;
/**
 * Returns whether a platform id represents a server platform.
 * @experimental
 */
function isPlatformServer(platformId) {
    return platformId === exports.PLATFORM_SERVER_ID;
}
exports.isPlatformServer = isPlatformServer;
/**
 * Returns whether a platform id represents a web worker app platform.
 * @experimental
 */
function isPlatformWorkerApp(platformId) {
    return platformId === exports.PLATFORM_WORKER_APP_ID;
}
exports.isPlatformWorkerApp = isPlatformWorkerApp;
/**
 * Returns whether a platform id represents a web worker UI platform.
 * @experimental
 */
function isPlatformWorkerUi(platformId) {
    return platformId === exports.PLATFORM_WORKER_UI_ID;
}
exports.isPlatformWorkerUi = isPlatformWorkerUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1faWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BsYXRmb3JtX2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRVUsUUFBQSxtQkFBbUIsR0FBRyxTQUFTLENBQUM7QUFDaEMsUUFBQSxrQkFBa0IsR0FBRyxRQUFRLENBQUM7QUFDOUIsUUFBQSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM1QyxRQUFBLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDO0FBRXZEOzs7R0FHRztBQUNILDJCQUFrQyxVQUFrQjtJQUNsRCxNQUFNLENBQUMsVUFBVSxLQUFLLDJCQUFtQixDQUFDO0FBQzVDLENBQUM7QUFGRCw4Q0FFQztBQUVEOzs7R0FHRztBQUNILDBCQUFpQyxVQUFrQjtJQUNqRCxNQUFNLENBQUMsVUFBVSxLQUFLLDBCQUFrQixDQUFDO0FBQzNDLENBQUM7QUFGRCw0Q0FFQztBQUVEOzs7R0FHRztBQUNILDZCQUFvQyxVQUFrQjtJQUNwRCxNQUFNLENBQUMsVUFBVSxLQUFLLDhCQUFzQixDQUFDO0FBQy9DLENBQUM7QUFGRCxrREFFQztBQUVEOzs7R0FHRztBQUNILDRCQUFtQyxVQUFrQjtJQUNuRCxNQUFNLENBQUMsVUFBVSxLQUFLLDZCQUFxQixDQUFDO0FBQzlDLENBQUM7QUFGRCxnREFFQyJ9