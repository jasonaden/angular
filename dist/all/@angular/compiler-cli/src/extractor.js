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
 * Extract i18n messages from source code
 */
// Must be imported first, because Angular decorators throw on load.
require("reflect-metadata");
var compiler = require("@angular/compiler");
var path = require("path");
var compiler_host_1 = require("./compiler_host");
var path_mapped_compiler_host_1 = require("./path_mapped_compiler_host");
var Extractor = (function () {
    function Extractor(options, ngExtractor, host, ngCompilerHost, program) {
        this.options = options;
        this.ngExtractor = ngExtractor;
        this.host = host;
        this.ngCompilerHost = ngCompilerHost;
        this.program = program;
    }
    Extractor.prototype.extract = function (formatName, outFile) {
        var _this = this;
        // Checks the format and returns the extension
        var ext = this.getExtension(formatName);
        var promiseBundle = this.extractBundle();
        return promiseBundle.then(function (bundle) {
            var content = _this.serialize(bundle, formatName);
            var dstFile = outFile || "messages." + ext;
            var dstPath = path.join(_this.options.genDir, dstFile);
            _this.host.writeFile(dstPath, content, false);
            return [dstPath];
        });
    };
    Extractor.prototype.extractBundle = function () {
        var _this = this;
        var files = this.program.getSourceFiles().map(function (sf) { return _this.ngCompilerHost.getCanonicalFileName(sf.fileName); });
        return this.ngExtractor.extract(files);
    };
    Extractor.prototype.serialize = function (bundle, formatName) {
        var _this = this;
        var format = formatName.toLowerCase();
        var serializer;
        switch (format) {
            case 'xmb':
                serializer = new compiler.Xmb();
                break;
            case 'xliff2':
            case 'xlf2':
                serializer = new compiler.Xliff2();
                break;
            case 'xlf':
            case 'xliff':
            default:
                serializer = new compiler.Xliff();
        }
        return bundle.write(serializer, function (sourcePath) { return _this.options.basePath ?
            path.relative(_this.options.basePath, sourcePath) :
            sourcePath; });
    };
    Extractor.prototype.getExtension = function (formatName) {
        var format = (formatName || 'xlf').toLowerCase();
        switch (format) {
            case 'xmb':
                return 'xmb';
            case 'xlf':
            case 'xlif':
            case 'xliff':
            case 'xlf2':
            case 'xliff2':
                return 'xlf';
        }
        throw new Error("Unsupported format \"" + formatName + "\"");
    };
    Extractor.create = function (options, program, tsCompilerHost, locale, compilerHostContext, ngCompilerHost) {
        if (!ngCompilerHost) {
            var usePathMapping = !!options.rootDirs && options.rootDirs.length > 0;
            var context = compilerHostContext || new compiler_host_1.ModuleResolutionHostAdapter(tsCompilerHost);
            ngCompilerHost = usePathMapping ? new path_mapped_compiler_host_1.PathMappedCompilerHost(program, options, context) :
                new compiler_host_1.CompilerHost(program, options, context);
        }
        var ngExtractor = compiler.Extractor.create(ngCompilerHost, locale || null).extractor;
        return new Extractor(options, ngExtractor, tsCompilerHost, ngCompilerHost, program);
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9leHRyYWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSDs7R0FFRztBQUNILG9FQUFvRTtBQUNwRSw0QkFBMEI7QUFFMUIsNENBQThDO0FBRTlDLDJCQUE2QjtBQUc3QixpREFBK0Y7QUFDL0YseUVBQW1FO0FBRW5FO0lBQ0UsbUJBQ1ksT0FBbUMsRUFBVSxXQUErQixFQUM3RSxJQUFxQixFQUFVLGNBQTRCLEVBQzFELE9BQW1CO1FBRm5CLFlBQU8sR0FBUCxPQUFPLENBQTRCO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQzdFLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWM7UUFDMUQsWUFBTyxHQUFQLE9BQU8sQ0FBWTtJQUFHLENBQUM7SUFFbkMsMkJBQU8sR0FBUCxVQUFRLFVBQWtCLEVBQUUsT0FBb0I7UUFBaEQsaUJBYUM7UUFaQyw4Q0FBOEM7UUFDOUMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxQyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQzlCLElBQU0sT0FBTyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxjQUFZLEdBQUssQ0FBQztZQUM3QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFELEtBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxD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