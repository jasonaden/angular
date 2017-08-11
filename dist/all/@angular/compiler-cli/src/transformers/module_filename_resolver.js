"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var NODE_MODULES = '/node_modules/';
var IS_GENERATED = /\.(ngfactory|ngstyle|ngsummary)$/;
var SHALLOW_IMPORT = /^((\w|-)+|(@(\w|-)+(\/(\w|-)+)+))$/;
function createModuleFilenameResolver(tsHost, options) {
    var host = createModuleFilenameResolverHost(tsHost);
    return options.rootDirs && options.rootDirs.length > 0 ?
        new MultipleRootDirModuleFilenameResolver(host, options) :
        new SingleRootDirModuleFilenameResolver(host, options);
}
exports.createModuleFilenameResolver = createModuleFilenameResolver;
var SingleRootDirModuleFilenameResolver = (function () {
    function SingleRootDirModuleFilenameResolver(host, options) {
        this.host = host;
        this.options = options;
        this.moduleFileNames = new Map();
        // normalize the path so that it never ends with '/'.
        this.basePath = path.normalize(path.join(options.basePath, '.')).replace(/\\/g, '/');
        this.genDir = path.normalize(path.join(options.genDir, '.')).replace(/\\/g, '/');
        var genPath = path.relative(this.basePath, this.genDir);
        this.isGenDirChildOfRootDir = genPath === '' || !genPath.startsWith('..');
    }
    SingleRootDirModuleFilenameResolver.prototype.moduleNameToFileName = function (m, containingFile) {
        var key = m + ':' + (containingFile || '');
        var result = this.moduleFileNames.get(key) || null;
        if (!result) {
            if (!containingFile) {
                if (m.indexOf('.') === 0) {
                    throw new Error('Resolution of relative paths requires a containing file.');
                }
                // Any containing file gives the same result for absolute imports
                containingFile = this.getNgCanonicalFileName(path.join(this.basePath, 'index.ts'));
            }
            m = m.replace(EXT, '');
            var resolved = ts.resolveModuleName(m, containingFile.replace(/\\/g, '/'), this.options, this.host)
                .resolvedModule;
            result = resolved ? this.getNgCanonicalFileName(resolved.resolvedFileName) : null;
            this.moduleFileNames.set(key, result);
        }
        return result;
    };
    /**
     * We want a moduleId that will appear in import statements in the generated code.
     * These need to be in a form that system.js can load, so absolute file paths don't work.
     *
     * The `containingFile` is always in the `genDir`, where as the `importedFile` can be in
     * `genDir`, `node_module` or `basePath`.  The `importedFile` is either a generated file or
     * existing file.
     *
     *               | genDir   | node_module |  rootDir
     * --------------+----------+-------------+----------
     * generated     | relative |   relative  |   n/a
     * existing file |   n/a    |   absolute  |  relative(*)
     *
     * NOTE: (*) the relative path is computed depending on `isGenDirChildOfRootDir`.
     */
    SingleRootDirModuleFilenameResolver.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists it so that the `resolve` method works!
        if (!this.host.fileExists(importedFile)) {
            this.host.assumeFileExists(importedFile);
        }
        containingFile = this.rewriteGenDirPath(containingFile);
        var containingDir = path.dirname(containingFile);
        // drop extension
        importedFile = importedFile.replace(EXT, '');
        var nodeModulesIndex = importedFile.indexOf(NODE_MODULES);
        var importModule = nodeModulesIndex === -1 ?
            null :
            importedFile.substring(nodeModulesIndex + NODE_MODULES.length);
        var isGeneratedFile = IS_GENERATED.test(importedFile);
        if (isGeneratedFile) {
            // rewrite to genDir path
            if (importModule) {
                // it is generated, therefore we do a relative path to the factory
                return this.dotRelative(containingDir, this.genDir + NODE_MODULES + importModule);
            }
            else {
                // assume that import is also in `genDir`
                importedFile = this.rewriteGenDirPath(importedFile);
                return this.dotRelative(containingDir, importedFile);
            }
        }
        else {
            // user code import
            if (importModule) {
                return importModule;
            }
            else {
                if (!this.isGenDirChildOfRootDir) {
                    // assume that they are on top of each other.
                    importedFile = importedFile.replace(this.basePath, this.genDir);
                }
                if (SHALLOW_IMPORT.test(importedFile)) {
                    return importedFile;
                }
                return this.dotRelative(containingDir, importedFile);
            }
        }
    };
    // We use absolute paths on disk as canonical.
    SingleRootDirModuleFilenameResolver.prototype.getNgCanonicalFileName = function (fileName) { return fileName; };
    SingleRootDirModuleFilenameResolver.prototype.assumeFileExists = function (fileName) { this.host.assumeFileExists(fileName); };
    SingleRootDirModuleFilenameResolver.prototype.dotRelative = function (from, to) {
        var rPath = path.relative(from, to).replace(/\\/g, '/');
        return rPath.startsWith('.') ? rPath : './' + rPath;
    };
    /**
     * Moves the path into `genDir` folder while preserving the `node_modules` directory.
     */
    SingleRootDirModuleFilenameResolver.prototype.rewriteGenDirPath = function (filepath) {
        var nodeModulesIndex = filepath.indexOf(NODE_MODULES);
        if (nodeModulesIndex !== -1) {
            // If we are in node_module, transplant them into `genDir`.
            return path.join(this.genDir, filepath.substring(nodeModulesIndex));
        }
        else {
            // pretend that containing file is on top of the `genDir` to normalize the paths.
            // we apply the `genDir` => `rootDir` delta through `rootDirPrefix` later.
            return filepath.replace(this.basePath, this.genDir);
        }
    };
    return SingleRootDirModuleFilenameResolver;
}());
/**
 * This version of the AotCompilerHost expects that the program will be compiled
 * and executed with a "path mapped" directory structure, where generated files
 * are in a parallel tree with the sources, and imported using a `./` relative
 * import. This requires using TS `rootDirs` option and also teaching the module
 * loader what to do.
 */
var MultipleRootDirModuleFilenameResolver = (function () {
    function MultipleRootDirModuleFilenameResolver(host, options) {
        this.host = host;
        this.options = options;
        // normalize the path so that it never ends with '/'.
        this.basePath = path.normalize(path.join(options.basePath, '.')).replace(/\\/g, '/');
    }
    MultipleRootDirModuleFilenameResolver.prototype.getNgCanonicalFileName = function (fileName) {
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
    MultipleRootDirModuleFilenameResolver.prototype.assumeFileExists = function (fileName) { this.host.assumeFileExists(fileName); };
    MultipleRootDirModuleFilenameResolver.prototype.moduleNameToFileName = function (m, containingFile) {
        if (!containingFile) {
            if (m.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = this.getNgCanonicalFileName(path.join(this.basePath, 'index.ts'));
        }
        for (var _i = 0, _a = this.options.rootDirs || ['']; _i < _a.length; _i++) {
            var root = _a[_i];
            var rootedContainingFile = path.join(root, containingFile);
            var resolved = ts.resolveModuleName(m, rootedContainingFile, this.options, this.host).resolvedModule;
            if (resolved) {
                if (this.options.traceResolution) {
                    console.error('resolve', m, containingFile, '=>', resolved.resolvedFileName);
                }
                return this.getNgCanonicalFileName(resolved.resolvedFileName);
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
    MultipleRootDirModuleFilenameResolver.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        var _this = this;
        if (this.options.traceResolution) {
            console.error('getImportPath from containingFile', containingFile, 'to importedFile', importedFile);
        }
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists so that the `resolve` method works!
        if (!this.host.fileExists(importedFile)) {
            if (this.options.rootDirs && this.options.rootDirs.length > 0) {
                this.host.assumeFileExists(path.join(this.options.rootDirs[0], importedFile));
            }
            else {
                this.host.assumeFileExists(importedFile);
            }
        }
        var resolvable = function (candidate) {
            var resolved = _this.moduleNameToFileName(candidate, importedFile);
            return resolved && resolved.replace(EXT, '') === importedFile.replace(EXT, '');
        };
        var importModuleName = importedFile.replace(EXT, '');
        var parts = importModuleName.split(path.sep).filter(function (p) { return !!p; });
        var foundRelativeImport;
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
    return MultipleRootDirModuleFilenameResolver;
}());
function createModuleFilenameResolverHost(host) {
    var assumedExists = new Set();
    var resolveModuleNameHost = Object.create(host);
    // When calling ts.resolveModuleName, additional allow checks for .d.ts files to be done based on
    // checks for .ngsummary.json files, so that our codegen depends on fewer inputs and requires
    // to be called less often.
    // This is needed as we use ts.resolveModuleName in reflector_host and it should be able to
    // resolve summary file names.
    resolveModuleNameHost.fileExists = function (fileName) {
        if (assumedExists.has(fileName)) {
            return true;
        }
        if (host.fileExists(fileName)) {
            return true;
        }
        if (DTS.test(fileName)) {
            var base = fileName.substring(0, fileName.length - 5);
            return host.fileExists(base + '.ngsummary.json');
        }
        return false;
    };
    resolveModuleNameHost.assumeFileExists = function (fileName) { return assumedExists.add(fileName); };
    // Make sure we do not `host.realpath()` from TS as we do not want to resolve symlinks.
    // https://github.com/Microsoft/TypeScript/issues/9552
    resolveModuleNameHost.realpath = function (fileName) { return fileName; };
    return resolveModuleNameHost;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZpbGVuYW1lX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvbW9kdWxlX2ZpbGVuYW1lX3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUlqQyxJQUFNLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQztBQUMvQyxJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFDdkIsSUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsSUFBTSxZQUFZLEdBQUcsa0NBQWtDLENBQUM7QUFDeEQsSUFBTSxjQUFjLEdBQUcsb0NBQW9DLENBQUM7QUFFNUQsc0NBQ0ksTUFBK0IsRUFBRSxPQUF3QjtJQUMzRCxJQUFNLElBQUksR0FBRyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV0RCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ2xELElBQUkscUNBQXFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUN4RCxJQUFJLG1DQUFtQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBUEQsb0VBT0M7QUFFRDtJQU1FLDZDQUFvQixJQUFrQyxFQUFVLE9BQXdCO1FBQXBFLFNBQUksR0FBSixJQUFJLENBQThCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFGaEYsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztRQUd2RCxxREFBcUQ7UUFDckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9B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