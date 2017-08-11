"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a private API for the ngtools toolkit.
 *
 * This API should be stable for NG 2. It can be removed in NG 4..., but should be replaced by
 * something else.
 */
var compiler_1 = require("@angular/compiler");
var codegen_1 = require("./codegen");
var compiler_host_1 = require("./compiler_host");
var extractor_1 = require("./extractor");
var ngtools_impl_1 = require("./ngtools_impl");
var path_mapped_compiler_host_1 = require("./path_mapped_compiler_host");
/**
 * A ModuleResolutionHostAdapter that overrides the readResource() method with the one
 * passed in the interface.
 */
var CustomLoaderModuleResolutionHostAdapter = (function (_super) {
    __extends(CustomLoaderModuleResolutionHostAdapter, _super);
    function CustomLoaderModuleResolutionHostAdapter(_readResource, host) {
        var _this = _super.call(this, host) || this;
        _this._readResource = _readResource;
        return _this;
    }
    CustomLoaderModuleResolutionHostAdapter.prototype.readResource = function (path) { return this._readResource(path); };
    return CustomLoaderModuleResolutionHostAdapter;
}(compiler_host_1.ModuleResolutionHostAdapter));
/**
 * @internal
 */
var NgTools_InternalApi_NG_2 = (function () {
    function NgTools_InternalApi_NG_2() {
    }
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.codeGen = function (options) {
        var hostContext = new CustomLoaderModuleResolutionHostAdapter(options.readResource, options.host);
        var cliOptions = {
            i18nFormat: options.i18nFormat,
            i18nFile: options.i18nFile,
            locale: options.locale,
            missingTranslation: options.missingTranslation,
            basePath: options.basePath
        };
        var ngOptions = options.angularCompilerOptions;
        if (ngOptions.enableSummariesForJit === undefined) {
            // default to false
            ngOptions.enableSummariesForJit = false;
        }
        // Create the Code Generator.
        var codeGenerator = codegen_1.CodeGenerator.create(ngOptions, cliOptions, options.program, options.host, hostContext);
        return codeGenerator.codegen();
    };
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.listLazyRoutes = function (options) {
        var angularCompilerOptions = options.angularCompilerOptions;
        var program = options.program;
        var moduleResolutionHost = new compiler_host_1.ModuleResolutionHostAdapter(options.host);
        var usePathMapping = !!angularCompilerOptions.rootDirs && angularCompilerOptions.rootDirs.length > 0;
        var ngCompilerHost = usePathMapping ?
            new path_mapped_compiler_host_1.PathMappedCompilerHost(program, angularCompilerOptions, moduleResolutionHost) :
            new compiler_host_1.CompilerHost(program, angularCompilerOptions, moduleResolutionHost);
        var symbolCache = new compiler_1.StaticSymbolCache();
        var summaryResolver = new compiler_1.AotSummaryResolver(ngCompilerHost, symbolCache);
        var symbolResolver = new compiler_1.StaticSymbolResolver(ngCompilerHost, symbolCache, summaryResolver);
        var staticReflector = new compiler_1.StaticReflector(summaryResolver, symbolResolver);
        var routeMap = ngtools_impl_1.listLazyRoutesOfModule(options.entryModule, ngCompilerHost, staticReflector);
        return Object.keys(routeMap).reduce(function (acc, route) {
            acc[route] = routeMap[route].absoluteFilePath;
            return acc;
        }, {});
    };
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.extractI18n = function (options) {
        var hostContext = new CustomLoaderModuleResolutionHostAdapter(options.readResource, options.host);
        // Create the i18n extractor.
        var locale = options.locale || null;
        var extractor = extractor_1.Extractor.create(options.angularCompilerOptions, options.program, options.host, locale, hostContext);
        return extractor.extract(options.i18nFormat, options.outFile || null);
    };
    return NgTools_InternalApi_NG_2;
}());
exports.NgTools_InternalApi_NG_2 = NgTools_InternalApi_NG_2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0b29sc19hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndG9vbHNfYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVIOzs7OztHQUtHO0FBRUgsOENBQWdJO0FBSWhJLHFDQUF3QztBQUN4QyxpREFBK0Y7QUFDL0YseUNBQXNDO0FBQ3RDLCtDQUFzRDtBQUN0RCx5RUFBbUU7QUE2Q25FOzs7R0FHRztBQUNIO0lBQXNELDJEQUEyQjtJQUMvRSxpREFDWSxhQUFnRCxFQUFFLElBQTZCO1FBRDNGLFlBRUUsa0JBQU0sSUFBSSxDQUFDLFNBQ1o7UUFGVyxtQkFBYSxHQUFiLGFBQWEsQ0FBbUM7O0lBRTVELENBQUM7SUFFRCw4REFBWSxHQUFaLFVBQWEsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRSw4Q0FBQztBQUFELENBQUMsQUFQRCxDQUFzRCwyQ0FBMkIsR0FPaEY7QUFFRDs7R0FFRztBQUNIO0lBQUE7SUF1RUEsQ0FBQztJQXRFQzs7T0FFRztJQUNJLGdDQUFPLEdBQWQsVUFBZSxPQUFnRDtRQUM3RCxJQUFNLFdBQVcsR0FDYixJQUFJLHVDQUF1QyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBGLElBQU0sVUFBVSxHQUFrQjtZQUNoQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVk7WUFDaEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFVO1lBQzVCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBUTtZQUN4QixrQkFBa0IsRUFBRSxPQUFPLENBQUMsa0JBQW9CO1lBQ2hELFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtTQUMzQixDQUFDO1FBQ0YsSUFBTSxTQUFTLEdBQUcsT0FBTyxD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