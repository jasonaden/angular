"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var filter_1 = require("rxjs/operator/filter");
var first_1 = require("rxjs/operator/first");
var toPromise_1 = require("rxjs/operator/toPromise");
var platform_state_1 = require("./platform_state");
var server_1 = require("./server");
var tokens_1 = require("./tokens");
var parse5 = require('parse5');
function _getPlatform(platformFactory, options) {
    var extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: tokens_1.INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then(function (moduleRef) {
        var transitionId = moduleRef.injector.get(platform_browser_1.ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\nthe server-rendered app can be properly bootstrapped into a client app.");
        }
        var applicationRef = moduleRef.injector.get(core_1.ApplicationRef);
        return toPromise_1.toPromise
            .call(first_1.first.call(filter_1.filter.call(applicationRef.isStable, function (isStable) { return isStable; })))
            .then(function () {
            var output = platform.injector.get(platform_state_1.PlatformState).renderToString();
            platform.destroy();
            return output;
        });
    });
}
/**
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {@link NgModuleFactory} with
 * {@link renderModuleFactory} instead.
 *
 * @experimental
 */
function renderModule(module, options) {
    var platform = _getPlatform(server_1.platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
}
exports.renderModule = renderModule;
/**
 * Renders a {@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * @experimental
 */
function renderModuleFactory(moduleFactory, options) {
    var platform = _getPlatform(server_1.platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}
exports.renderModuleFactory = renderModuleFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQThHO0FBQzlHLDhEQUF5RDtBQUN6RCwrQ0FBNEM7QUFDNUMsNkNBQTBDO0FBQzFDLHFEQUFrRDtBQUVsRCxtREFBK0M7QUFDL0MsbUNBQStEO0FBQy9ELG1DQUF3QztBQUV4QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFRakMsc0JBQ0ksZUFBa0UsRUFDbEUsT0FBd0I7SUFDMUIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM1RSxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3JCLEVBQUMsT0FBTyxFQUFFLHVCQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUMsRUFBQztRQUNuRixjQUFjO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGlCQUNJLFFBQXFCLEVBQUUsZ0JBQXlDO0lBQ2xFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxTQUFTO1FBQ3JDLElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlDQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQ1gscUtBQzhELENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQ0QsSUFBTSxjQUFjLEdBQW1CLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMscUJBQVM7YUFDWCxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxlQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBQyxRQUFpQixJQUFLLE9BQUEsUUFBUSxFQUFSLENBQVEsQ0FBQyxDQUFDLENBQUM7YUFDdkYsSUFBSSxDQUFDO1lBQ0osSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsOEJBQWEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3JFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxzQkFDSSxNQUFlLEVBQUUsT0FBNkU7SUFFaEcsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLDhCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBTEQsb0NBS0M7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILDZCQUNJLGFBQWlDLEVBQ2pDLE9BQTZFO0lBRS9FLElBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyx1QkFBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFORCxrREFNQyJ9