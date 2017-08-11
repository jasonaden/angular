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
var path = require("path");
var ts = require("typescript");
var compiler_host_1 = require("./compiler_host");
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
/**
 * This version of the AotCompilerHost expects that the program will be compiled
 * and executed with a "path mapped" directory structure, where generated files
 * are in a parallel tree with the sources, and imported using a `./` relative
 * import. This requires using TS `rootDirs` option and also teaching the module
 * loader what to do.
 */
var PathMappedCompilerHost = (function (_super) {
    __extends(PathMappedCompilerHost, _super);
    function PathMappedCompilerHost(program, options, context) {
        return _super.call(this, program, options, context) || this;
    }
    PathMappedCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        if (!fileName)
            return fileName;
        // NB: the rootDirs should have been sorted longest-first
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var dir = _a[_i];
            if (fileName.indexOf(dir) === 0) {
                fileName = fileName.substring(dir.length);
            }
        }
        return fileName;
    };
    PathMappedCompilerHost.prototype.moduleNameToFileName = function (m, containingFile) {
        if (!containingFile || !containingFile.length) {
            if (m.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = this.getCanonicalFileName(path.join(this.basePath, 'index.ts'));
        }
        for (var _i = 0, _a = this.options.rootDirs || ['']; _i < _a.length; _i++) {
            var root = _a[_i];
            var rootedContainingFile = path.join(root, containingFile);
            var resolved = ts.resolveModuleName(m, rootedContainingFile, this.options, this.context).resolvedModule;
            if (resolved) {
                if (this.options.traceResolution) {
                    console.error('resolve', m, containingFile, '=>', resolved.resolvedFileName);
                }
                return this.getCanonicalFileName(resolved.resolvedFileName);
            }
        }
        return null;
    };
    /**
     * We want a moduleId that will appear in import statements in the generated code.
     * These need to be in a form that system.js can load, so absolute file paths don't work.
     * Relativize the paths by checking candidate prefixes of the absolute path, to see if
     * they are resolvable by the moduleResolution strategy from the CompilerHost.
     */
    PathMappedCompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        var _this = this;
        if (this.options.traceResolution) {
            console.error('getImportPath from containingFile', containingFile, 'to importedFile', importedFile);
        }
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists so that the `resolve` method works!
        if (!this.context.fileExists(importedFile)) {
            if (this.options.rootDirs && this.options.rootDirs.length > 0) {
                this.context.assumeFileExists(path.join(this.options.rootDirs[0], importedFile));
            }
            else {
                this.context.assumeFileExists(importedFile);
            }
        }
        var resolvable = function (candidate) {
            var resolved = _this.moduleNameToFileName(candidate, importedFile);
            return resolved && resolved.replace(EXT, '') === importedFile.replace(EXT, '');
        };
        var importModuleName = importedFile.replace(EXT, '');
        var parts = importModuleName.split(path.sep).filter(function (p) { return !!p; });
        var foundRelativeImport = undefined;
        for (var index = parts.length - 1; index >= 0; index--) {
            var candidate_1 = parts.slice(index, parts.length).join(path.sep);
            if (resolvable(candidate_1)) {
                return candidate_1;
            }
            candidate_1 = '.' + path.sep + candidate_1;
            if (resolvable(candidate_1)) {
                foundRelativeImport = candidate_1;
            }
        }
        if (foundRelativeImport)
            return foundRelativeImport;
        // Try a relative import
        var candidate = path.relative(path.dirname(containingFile), importModuleName);
        if (resolvable(candidate)) {
            return candidate;
        }
        throw new Error("Unable to find any resolvable import for " + importedFile + " relative to " + containingFile);
    };
    PathMappedCompilerHost.prototype.getMetadataFor = function (filePath) {
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var root = _a[_i];
            var rootedPath = path.join(root, filePath);
            if (!this.context.fileExists(rootedPath)) {
                // If the file doesn't exists then we cannot return metadata for the file.
                // This will occur if the user refernced a declared module for which no file
                // exists for the module (i.e. jQuery or angularjs).
                continue;
            }
            if (DTS.test(rootedPath)) {
                var metadataPath = rootedPath.replace(DTS, '.metadata.json');
                if (this.context.fileExists(metadataPath)) {
                    return this.readMetadata(metadataPath, rootedPath);
                }
            }
            else {
                var sf = this.getSourceFile(rootedPath);
                sf.fileName = sf.fileName;
                var metadata = this.metadataProvider.getMetadata(sf);
                return metadata ? [metadata] : [];
            }
        }
        return null;
    };
    return PathMappedCompilerHost;
}(compiler_host_1.CompilerHost));
exports.PathMappedCompilerHost = PathMappedCompilerHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF9tYXBwZWRfY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvcGF0aF9tYXBwZWRfY29tcGlsZXJfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFLSCwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLGlEQUFrRTtBQUVsRSxJQUFNLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQztBQUMvQyxJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFFdkI7Ozs7OztHQU1HO0FBQ0g7SUFBNEMsMENBQVk7SUFDdEQsZ0NBQVksT0FBbUIsRUFBRSxPQUErQixFQUFFLE9BQTRCO2VBQzVGLGtCQUFNLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxxREFBb0IsR0FBcEIsVUFBcUIsUUFBZ0I7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQy9CLHlEQUF5RDtRQUN6RCxHQUFHLENBQUMsQ0FBYyxVQUEyQixFQUEzQixLQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBM0IsY0FBMkIsRUFBM0IsSUFBMkI7WUFBeEMsSUFBTSxHQUFHLFNBQUE7WUFDWixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QyxDQUFDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxxREFBb0IsR0FBcEIsVUFBcUIsQ0FBUyxFQUFFLGNBQXNCO1FBQ3BELEVBQUUsQ0FBQyxDQUFD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