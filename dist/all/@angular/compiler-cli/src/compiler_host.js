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
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var NODE_MODULES = '/node_modules/';
var IS_GENERATED = /\.(ngfactory|ngstyle|ngsummary)$/;
var GENERATED_FILES = /\.ngfactory\.ts$|\.ngstyle\.ts$|\.ngsummary\.ts$/;
var GENERATED_OR_DTS_FILES = /\.d\.ts$|\.ngfactory\.ts$|\.ngstyle\.ts$|\.ngsummary\.ts$/;
var SHALLOW_IMPORT = /^((\w|-)+|(@(\w|-)+(\/(\w|-)+)+))$/;
var CompilerHost = (function () {
    function CompilerHost(program, options, context, collectorOptions, metadataProvider) {
        if (metadataProvider === void 0) { metadataProvider = new tsc_wrapped_1.MetadataCollector(); }
        var _this = this;
        this.program = program;
        this.options = options;
        this.context = context;
        this.metadataProvider = metadataProvider;
        this.resolverCache = new Map();
        this.flatModuleIndexCache = new Map();
        this.flatModuleIndexNames = new Set();
        this.flatModuleIndexRedirectNames = new Set();
        this.moduleFileNames = new Map();
        // normalize the path so that it never ends with '/'.
        this.basePath = path.normalize(path.join(this.options.basePath, '.')).replace(/\\/g, '/');
        this.genDir = path.normalize(path.join(this.options.genDir, '.')).replace(/\\/g, '/');
        var genPath = path.relative(this.basePath, this.genDir);
        this.isGenDirChildOfRootDir = genPath === '' || !genPath.startsWith('..');
        this.resolveModuleNameHost = Object.create(this.context);
        // When calling ts.resolveModuleName,
        // additional allow checks for .d.ts files to be done based on
        // checks for .ngsummary.json files,
        // so that our codegen depends on fewer inputs and requires to be called
        // less often.
        // This is needed as we use ts.resolveModuleName in reflector_host
        // and it should be able to resolve summary file names.
        this.resolveModuleNameHost.fileExists = function (fileName) {
            if (_this.context.fileExists(fileName)) {
                return true;
            }
            if (DTS.test(fileName)) {
                var base = fileName.substring(0, fileName.length - 5);
                return _this.context.fileExists(base + '.ngsummary.json');
            }
            return false;
        };
    }
    // We use absolute paths on disk as canonical.
    CompilerHost.prototype.getCanonicalFileName = function (fileName) { return fileName; };
    CompilerHost.prototype.moduleNameToFileName = function (m, containingFile) {
        var key = m + ':' + (containingFile || '');
        var result = this.moduleFileNames.get(key) || null;
        if (!result) {
            if (!containingFile || !containingFile.length) {
                if (m.indexOf('.') === 0) {
                    throw new Error('Resolution of relative paths requires a containing file.');
                }
                // Any containing file gives the same result for absolute imports
                containingFile = this.getCanonicalFileName(path.join(this.basePath, 'index.ts'));
            }
            m = m.replace(EXT, '');
            var resolved = ts.resolveModuleName(m, containingFile.replace(/\\/g, '/'), this.options, this.resolveModuleNameHost)
                .resolvedModule;
            result = resolved ? this.getCanonicalFileName(resolved.resolvedFileName) : null;
            this.moduleFileNames.set(key, result);
        }
        return result;
    };
    ;
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
    CompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists it so that the `resolve` method works!
        if (importedFile !== containingFile && !this.context.fileExists(importedFile)) {
            this.context.assumeFileExists(importedFile);
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
    CompilerHost.prototype.dotRelative = function (from, to) {
        var rPath = path.relative(from, to).replace(/\\/g, '/');
        return rPath.startsWith('.') ? rPath : './' + rPath;
    };
    /**
     * Moves the path into `genDir` folder while preserving the `node_modules` directory.
     */
    CompilerHost.prototype.rewriteGenDirPath = function (filepath) {
        var nodeModulesIndex = filepath.indexOf(NODE_MODULES);
        if (nodeModulesIndex !== -1) {
            // If we are in node_modulse, transplant them into `genDir`.
            return path.join(this.genDir, filepath.substring(nodeModulesIndex));
        }
        else {
            // pretend that containing file is on top of the `genDir` to normalize the paths.
            // we apply the `genDir` => `rootDir` delta through `rootDirPrefix` later.
            return filepath.replace(this.basePath, this.genDir);
        }
    };
    CompilerHost.prototype.getSourceFile = function (filePath) {
        var sf = this.program.getSourceFile(filePath);
        if (!sf) {
            if (this.context.fileExists(filePath)) {
                var sourceText = this.context.readFile(filePath);
                return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
            }
            throw new Error("Source file " + filePath + " not present in program.");
        }
        return sf;
    };
    CompilerHost.prototype.getMetadataFor = function (filePath) {
        if (!this.context.fileExists(filePath)) {
            // If the file doesn't exists then we cannot return metadata for the file.
            // This will occur if the user referenced a declared module for which no file
            // exists for the module (i.e. jQuery or angularjs).
            return;
        }
        if (DTS.test(filePath)) {
            var metadataPath = filePath.replace(DTS, '.metadata.json');
            if (this.context.fileExists(metadataPath)) {
                return this.readMetadata(metadataPath, filePath);
            }
            else {
                // If there is a .d.ts file but no metadata file we need to produce a
                // v3 metadata from the .d.ts file as v3 includes the exports we need
                // to resolve symbols.
                return [this.upgradeVersion1Metadata({ '__symbolic': 'module', 'version': 1, 'metadata': {} }, filePath)];
            }
        }
        var sf = this.getSourceFile(filePath);
        var metadata = this.metadataProvider.getMetadata(sf);
        return metadata ? [metadata] : [];
    };
    CompilerHost.prototype.readMetadata = function (filePath, dtsFilePath) {
        var metadatas = this.resolverCache.get(filePath);
        if (metadatas) {
            return metadatas;
        }
        try {
            var metadataOrMetadatas = JSON.parse(this.context.readFile(filePath));
            var metadatas_1 = metadataOrMetadatas ?
                (Array.isArray(metadataOrMetadatas) ? metadataOrMetadatas : [metadataOrMetadatas]) :
                [];
            var v1Metadata = metadatas_1.find(function (m) { return m.version === 1; });
            var v3Metadata = metadatas_1.find(function (m) { return m.version === 3; });
            if (!v3Metadata && v1Metadata) {
                metadatas_1.push(this.upgradeVersion1Metadata(v1Metadata, dtsFilePath));
            }
            this.resolverCache.set(filePath, metadatas_1);
            return metadatas_1;
        }
        catch (e) {
            console.error("Failed to read JSON file " + filePath);
            throw e;
        }
    };
    CompilerHost.prototype.upgradeVersion1Metadata = function (v1Metadata, dtsFilePath) {
        // patch up v1 to v3 by merging the metadata with metadata collected from the d.ts file
        // as the only difference between the versions is whether all exports are contained in
        // the metadata and the `extends` clause.
        var v3Metadata = { '__symbolic': 'module', 'version': 3, 'metadata': {} };
        if (v1Metadata.exports) {
            v3Metadata.exports = v1Metadata.exports;
        }
        for (var prop in v1Metadata.metadata) {
            v3Metadata.metadata[prop] = v1Metadata.metadata[prop];
        }
        var exports = this.metadataProvider.getMetadata(this.getSourceFile(dtsFilePath));
        if (exports) {
            for (var prop in exports.metadata) {
                if (!v3Metadata.metadata[prop]) {
                    v3Metadata.metadata[prop] = exports.metadata[prop];
                }
            }
            if (exports.exports) {
                v3Metadata.exports = exports.exports;
            }
        }
        return v3Metadata;
    };
    CompilerHost.prototype.loadResource = function (filePath) {
        if (this.context.readResource)
            return this.context.readResource(filePath);
        return this.context.readFile(filePath);
    };
    CompilerHost.prototype.loadSummary = function (filePath) {
        if (this.context.fileExists(filePath)) {
            return this.context.readFile(filePath);
        }
        return null;
    };
    CompilerHost.prototype.getOutputFileName = function (sourceFilePath) {
        return sourceFilePath.replace(EXT, '') + '.d.ts';
    };
    CompilerHost.prototype.isSourceFile = function (filePath) {
        var excludeRegex = this.options.generateCodeForLibraries === false ? GENERATED_OR_DTS_FILES : GENERATED_FILES;
        if (excludeRegex.test(filePath)) {
            return false;
        }
        if (DTS.test(filePath)) {
            // Check for a bundle index.
            if (this.hasBundleIndex(filePath)) {
                var normalFilePath = path.normalize(filePath);
                return this.flatModuleIndexNames.has(normalFilePath) ||
                    this.flatModuleIndexRedirectNames.has(normalFilePath);
            }
        }
        return true;
    };
    CompilerHost.prototype.calculateEmitPath = function (filePath) {
        // Write codegen in a directory structure matching the sources.
        var root = this.options.basePath;
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var eachRootDir = _a[_i];
            if (this.options.trace) {
                console.error("Check if " + filePath + " is under rootDirs element " + eachRootDir);
            }
            if (path.relative(eachRootDir, filePath).indexOf('.') !== 0) {
                root = eachRootDir;
            }
        }
        // transplant the codegen path to be inside the `genDir`
        var relativePath = path.relative(root, filePath);
        while (relativePath.startsWith('..' + path.sep)) {
            // Strip out any `..` path such as: `../node_modules/@foo` as we want to put everything
            // into `genDir`.
            relativePath = relativePath.substr(3);
        }
        return path.join(this.options.genDir, relativePath);
    };
    CompilerHost.prototype.hasBundleIndex = function (filePath) {
        var _this = this;
        var checkBundleIndex = function (directory) {
            var result = _this.flatModuleIndexCache.get(directory);
            if (result == null) {
                if (path.basename(directory) == 'node_module') {
                    // Don't look outside the node_modules this package is installed in.
                    result = false;
                }
                else {
                    // A bundle index exists if the typings .d.ts file has a metadata.json that has an
                    // importAs.
                    try {
                        var packageFile = path.join(directory, 'package.json');
                        if (_this.context.fileExists(packageFile)) {
                            // Once we see a package.json file, assume false until it we find the bundle index.
                            result = false;
                            var packageContent = JSON.parse(_this.context.readFile(packageFile));
                            if (packageContent.typings) {
                                var typings = path.normalize(path.join(directory, packageContent.typings));
                                if (DTS.test(typings)) {
                                    var metadataFile = typings.replace(DTS, '.metadata.json');
                                    if (_this.context.fileExists(metadataFile)) {
                                        var metadata = JSON.parse(_this.context.readFile(metadataFile));
                                        if (metadata.flatModuleIndexRedirect) {
                                            _this.flatModuleIndexRedirectNames.add(typings);
                                            // Note: don't set result = true,
                                            // as this would mark this folder
                                            // as having a bundleIndex too early without
                                            // filling the bundleIndexNames.
                                        }
                                        else if (metadata.importAs) {
                                            _this.flatModuleIndexNames.add(typings);
                                            result = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var parent_1 = path.dirname(directory);
                            if (parent_1 != directory) {
                                // Try the parent directory.
                                result = checkBundleIndex(parent_1);
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                    catch (e) {
                        // If we encounter any errors assume we this isn't a bundle index.
                        result = false;
                    }
                }
                _this.flatModuleIndexCache.set(directory, result);
            }
            return result;
        };
        return checkBundleIndex(path.dirname(filePath));
    };
    return CompilerHost;
}());
exports.CompilerHost = CompilerHost;
var CompilerHostContextAdapter = (function () {
    function CompilerHostContextAdapter() {
        this.assumedExists = {};
    }
    CompilerHostContextAdapter.prototype.assumeFileExists = function (fileName) { this.assumedExists[fileName] = true; };
    return CompilerHostContextAdapter;
}());
exports.CompilerHostContextAdapter = CompilerHostContextAdapter;
var ModuleResolutionHostAdapter = (function (_super) {
    __extends(ModuleResolutionHostAdapter, _super);
    function ModuleResolutionHostAdapter(host) {
        var _this = _super.call(this) || this;
        _this.host = host;
        if (host.directoryExists) {
            _this.directoryExists = function (directoryName) { return host.directoryExists(directoryName); };
        }
        return _this;
    }
    ModuleResolutionHostAdapter.prototype.fileExists = function (fileName) {
        return this.assumedExists[fileName] || this.host.fileExists(fileName);
    };
    ModuleResolutionHostAdapter.prototype.readFile = function (fileName) { return this.host.readFile(fileName); };
    ModuleResolutionHostAdapter.prototype.readResource = function (s) {
        if (!this.host.fileExists(s)) {
            // TODO: We should really have a test for error cases like this!
            throw new Error("Compilation failed. Resource file not found: " + s);
        }
        return Promise.resolve(this.host.readFile(s));
    };
    return ModuleResolutionHostAdapter;
}(CompilerHostContextAdapter));
exports.ModuleResolutionHostAdapter = ModuleResolutionHostAdapter;
var NodeCompilerHostContext = (function (_super) {
    __extends(NodeCompilerHostContext, _super);
    function NodeCompilerHostContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeCompilerHostContext.prototype.fileExists = function (fileName) {
        return this.assumedExists[fileName] || fs.existsSync(fileName);
    };
    NodeCompilerHostContext.prototype.directoryExists = function (directoryName) {
        try {
            return fs.statSync(directoryName).isDirectory();
        }
        catch (e) {
            return false;
        }
    };
    NodeCompilerHostContext.prototype.readFile = function (fileName) { return fs.readFileSync(fileName, 'utf8'); };
    NodeCompilerHostContext.prototype.readResource = function (s) {
        if (!this.fileExists(s)) {
            // TODO: We should really have a test for error cases like this!
            throw new Error("Compilation failed. Resource file not found: " + s);
        }
        return Promise.resolve(this.readFile(s));
    };
    return NodeCompilerHostContext;
}(CompilerHostContextAdapter));
exports.NodeCompilerHostContext = NodeCompilerHostContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvY29tcGlsZXJfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFHSCxvREFBaUg7QUFDakgsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsSUFBTSxHQUFHLEdBQUcsa0NBQWtDLENBQUM7QUFDL0MsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ3ZCLElBQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDO0FBQ3RDLElBQU0sWUFBWSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3hELElBQU0sZUFBZSxHQUFHLGtEQUFrRCxDQUFDO0FBQzNFLElBQU0sc0JBQXNCLEdBQUcsMkRBQTJELENBQUM7QUFDM0YsSUFBTSxjQUFjLEdBQUcsb0NBQW9DLENBQUM7QUFTNUQ7SUFXRSxzQkFDYyxPQUFtQixFQUFZLE9BQStCLEVBQzlELE9BQTRCLEVBQUUsZ0JBQW1DLEVBQ2pFLGdCQUE0RDtRQUE1RCxpQ0FBQSxFQUFBLHVCQUF5QywrQkFBaUIsRUFBRTtRQUgxRSxpQkE2QkM7UUE1QmEsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFZLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQzlELFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBNEM7UUFWbEUsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBNEIsQ0FBQztRQUNwRCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztRQUNsRCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ3pDLGlDQUE0QixHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDakQsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztRQU92RCxxREFBcUQ7UUFDckQs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