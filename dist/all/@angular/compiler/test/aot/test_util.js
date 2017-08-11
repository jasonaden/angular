"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var nodeModulesPath;
var angularSourcePath;
var rootPath;
calcPathsOnDisc();
function isDirectory(data) {
    return typeof data !== 'string';
}
exports.isDirectory = isDirectory;
var NODE_MODULES = '/node_modules/';
var IS_GENERATED = /\.(ngfactory|ngstyle)$/;
var angularts = /@angular\/(\w|\/|-)+\.tsx?$/;
var rxjs = /\/rxjs\//;
var tsxfile = /\.tsx$/;
exports.settings = {
    target: ts.ScriptTarget.ES5,
    declaration: true,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    removeComments: false,
    noImplicitAny: false,
    skipLibCheck: true,
    strictNullChecks: true,
    lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
    types: []
};
function calcPathsOnDisc() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    if (distIndex >= 0) {
        rootPath = moduleFilename.substr(0, distIndex);
        nodeModulesPath = path.join(rootPath, 'node_modules');
        angularSourcePath = path.join(rootPath, 'packages');
    }
}
var EmittingCompilerHost = (function () {
    function EmittingCompilerHost(scriptNames, options) {
        var _this = this;
        this.options = options;
        this.addedFiles = new Map();
        this.writtenFiles = new Map();
        this.root = '/';
        this.collector = new tsc_wrapped_1.MetadataCollector();
        this.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            _this.addWrittenFile(fileName, data);
            if (_this.options.emitMetadata && sourceFiles && sourceFiles.length && DTS.test(fileName)) {
                var metadataFilePath = fileName.replace(DTS, '.metadata.json');
                var metadata = _this.collector.getMetadata(sourceFiles[0]);
                if (metadata) {
                    _this.addWrittenFile(metadataFilePath, JSON.stringify(metadata));
                }
            }
        };
        // Rewrite references to scripts with '@angular' to its corresponding location in
        // the source tree.
        this.scriptNames = scriptNames.map(function (f) { return _this.effectiveName(f); });
        this.root = rootPath;
    }
    EmittingCompilerHost.prototype.writtenAngularFiles = function (target) {
        if (target === void 0) { target = new Map(); }
        this.written.forEach(function (value, key) {
            var path = "/node_modules/@angular" + key.substring(angularSourcePath.length);
            target.set(path, value);
        });
        return target;
    };
    EmittingCompilerHost.prototype.addScript = function (fileName, content) {
        var scriptName = this.effectiveName(fileName);
        this.addedFiles.set(scriptName, content);
        this.scriptNames.push(scriptName);
    };
    EmittingCompilerHost.prototype.override = function (fileName, content) {
        var scriptName = this.effectiveName(fileName);
        this.addedFiles.set(scriptName, content);
    };
    EmittingCompilerHost.prototype.addWrittenFile = function (fileName, content) {
        this.writtenFiles.set(this.effectiveName(fileName), content);
    };
    EmittingCompilerHost.prototype.getWrittenFiles = function () {
        return Array.from(this.writtenFiles).map(function (f) { return ({ name: f[0], content: f[1] }); });
    };
    Object.defineProperty(EmittingCompilerHost.prototype, "scripts", {
        get: function () { return this.scriptNames; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmittingCompilerHost.prototype, "written", {
        get: function () { return this.writtenFiles; },
        enumerable: true,
        configurable: true
    });
    EmittingCompilerHost.prototype.effectiveName = function (fileName) {
        var prefix = '@angular/';
        return fileName.startsWith('@angular/') ?
            path.join(angularSourcePath, fileName.substr(prefix.length)) :
            fileName;
    };
    // ts.ModuleResolutionHost
    EmittingCompilerHost.prototype.fileExists = function (fileName) {
        return this.addedFiles.has(fileName) || open(fileName, this.options.mockData) != null ||
            fs.existsSync(fileName);
    };
    EmittingCompilerHost.prototype.readFile = function (fileName) {
        var result = this.addedFiles.get(fileName) || open(fileName, this.options.mockData);
        if (result)
            return result;
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(exports.settings);
            return fs.readFileSync(path.join(path.dirname(libPath), basename), 'utf8');
        }
        return fs.readFileSync(fileName, 'utf8');
    };
    EmittingCompilerHost.prototype.directoryExists = function (directoryName) {
        return directoryExists(directoryName, this.options.mockData) ||
            (fs.existsSync(directoryName) && fs.statSync(directoryName).isDirectory());
    };
    EmittingCompilerHost.prototype.getCurrentDirectory = function () { return this.root; };
    EmittingCompilerHost.prototype.getDirectories = function (dir) {
        var result = open(dir, this.options.mockData);
        if (result && typeof result !== 'string') {
            return Object.keys(result);
        }
        return fs.readdirSync(dir).filter(function (p) {
            var name = path.join(dir, p);
            var stat = fs.statSync(name);
            return stat && stat.isDirectory();
        });
    };
    // ts.CompilerHost
    EmittingCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var content = this.readFile(fileName);
        if (content) {
            return ts.createSourceFile(fileName, content, languageVersion, /* setParentNodes */ true);
        }
        throw new Error("File not found '" + fileName + "'.");
    };
    EmittingCompilerHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    EmittingCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return fileName;
    };
    EmittingCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    EmittingCompilerHost.prototype.getNewLine = function () { return '\n'; };
    return EmittingCompilerHost;
}());
exports.EmittingCompilerHost = EmittingCompilerHost;
var MockCompilerHost = (function () {
    function MockCompilerHost(scriptNames, data) {
        var _this = this;
        this.data = data;
        this.overrides = new Map();
        this.writtenFiles = new Map();
        this.sourceFiles = new Map();
        this.assumeExists = new Set();
        this.traces = [];
        this.writeFile = function (fileName, data, writeByteOrderMark) {
            _this.writtenFiles.set(fileName, data);
            _this.sourceFiles.delete(fileName);
        };
        this.scriptNames = scriptNames.slice(0);
    }
    // Test API
    MockCompilerHost.prototype.override = function (fileName, content) {
        if (content) {
            this.overrides.set(fileName, content);
        }
        else {
            this.overrides.delete(fileName);
        }
        this.sourceFiles.delete(fileName);
    };
    MockCompilerHost.prototype.addScript = function (fileName, content) {
        this.overrides.set(fileName, content);
        this.scriptNames.push(fileName);
        this.sourceFiles.delete(fileName);
    };
    MockCompilerHost.prototype.assumeFileExists = function (fileName) { this.assumeExists.add(fileName); };
    MockCompilerHost.prototype.remove = function (files) {
        var _this = this;
        // Remove the files from the list of scripts.
        var fileSet = new Set(files);
        this.scriptNames = this.scriptNames.filter(function (f) { return fileSet.has(f); });
        // Remove files from written files
        files.forEach(function (f) { return _this.writtenFiles.delete(f); });
    };
    // ts.ModuleResolutionHost
    MockCompilerHost.prototype.fileExists = function (fileName) {
        if (this.overrides.has(fileName) || this.writtenFiles.has(fileName) ||
            this.assumeExists.has(fileName)) {
            return true;
        }
        var effectiveName = this.getEffectiveName(fileName);
        if (effectiveName == fileName) {
            return open(fileName, this.data) != null;
        }
        if (fileName.match(rxjs)) {
            return fs.existsSync(effectiveName);
        }
        return false;
    };
    MockCompilerHost.prototype.readFile = function (fileName) { return this.getFileContent(fileName); };
    MockCompilerHost.prototype.trace = function (s) { this.traces.push(s); };
    MockCompilerHost.prototype.getCurrentDirectory = function () { return '/'; };
    MockCompilerHost.prototype.getDirectories = function (dir) {
        var effectiveName = this.getEffectiveName(dir);
        if (effectiveName === dir) {
            var data_1 = find(dir, this.data);
            if (isDirectory(data_1)) {
                return Object.keys(data_1).filter(function (k) { return isDirectory(data_1[k]); });
            }
        }
        return [];
    };
    // ts.CompilerHost
    MockCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var result = this.sourceFiles.get(fileName);
        if (!result) {
            var content = this.getFileContent(fileName);
            if (content) {
                result = ts.createSourceFile(fileName, content, languageVersion);
                this.sourceFiles.set(fileName, result);
            }
        }
        return result;
    };
    MockCompilerHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return fileName;
    };
    MockCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    MockCompilerHost.prototype.getNewLine = function () { return '\n'; };
    // Private methods
    MockCompilerHost.prototype.getFileContent = function (fileName) {
        if (this.overrides.has(fileName)) {
            return this.overrides.get(fileName);
        }
        if (this.writtenFiles.has(fileName)) {
            return this.writtenFiles.get(fileName);
        }
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(exports.settings);
            return fs.readFileSync(path.join(path.dirname(libPath), basename), 'utf8');
        }
        var effectiveName = this.getEffectiveName(fileName);
        if (effectiveName === fileName) {
            return open(fileName, this.data);
        }
        if (fileName.match(rxjs) && fs.existsSync(fileName)) {
            return fs.readFileSync(fileName, 'utf8');
        }
    };
    MockCompilerHost.prototype.getEffectiveName = function (name) {
        var node_modules = 'node_modules';
        var rxjs = '/rxjs';
        if (name.startsWith('/' + node_modules)) {
            if (nodeModulesPath && name.startsWith('/' + node_modules + rxjs)) {
                return path.join(nodeModulesPath, name.substr(node_modules.length + 1));
            }
        }
        return name;
    };
    return MockCompilerHost;
}());
exports.MockCompilerHost = MockCompilerHost;
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var GENERATED_FILES = /\.ngfactory\.ts$|\.ngstyle\.ts$/;
var MockAotCompilerHost = (function () {
    function MockAotCompilerHost(tsHost) {
        this.tsHost = tsHost;
        this.metadataCollector = new tsc_wrapped_1.MetadataCollector();
        this.metadataVisible = true;
        this.dtsAreSource = true;
    }
    MockAotCompilerHost.prototype.hideMetadata = function () { this.metadataVisible = false; };
    MockAotCompilerHost.prototype.tsFilesOnly = function () { this.dtsAreSource = false; };
    // StaticSymbolResolverHost
    MockAotCompilerHost.prototype.getMetadataFor = function (modulePath) {
        if (!this.tsHost.fileExists(modulePath)) {
            return undefined;
        }
        if (DTS.test(modulePath)) {
            if (this.metadataVisible) {
                var metadataPath = modulePath.replace(DTS, '.metadata.json');
                if (this.tsHost.fileExists(metadataPath)) {
                    var result = JSON.parse(this.tsHost.readFile(metadataPath));
                    return Array.isArray(result) ? result : [result];
                }
            }
        }
        else {
            var sf = this.tsHost.getSourceFile(modulePath, ts.ScriptTarget.Latest);
            var metadata = this.metadataCollector.getMetadata(sf);
            return metadata ? [metadata] : [];
        }
        return undefined;
    };
    MockAotCompilerHost.prototype.moduleNameToFileName = function (moduleName, containingFile) {
        if (!containingFile || !containingFile.length) {
            if (moduleName.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = path.join('/', 'index.ts');
        }
        moduleName = moduleName.replace(EXT, '');
        var resolved = ts.resolveModuleName(moduleName, containingFile.replace(/\\/g, '/'), { baseDir: '/', genDir: '/' }, this.tsHost)
            .resolvedModule;
        return resolved ? resolved.resolvedFileName : null;
    };
    // AotSummaryResolverHost
    MockAotCompilerHost.prototype.loadSummary = function (filePath) { return this.tsHost.readFile(filePath); };
    MockAotCompilerHost.prototype.isSourceFile = function (sourceFilePath) {
        return !GENERATED_FILES.test(sourceFilePath) &&
            (this.dtsAreSource || !DTS.test(sourceFilePath));
    };
    MockAotCompilerHost.prototype.getOutputFileName = function (sourceFilePath) {
        return sourceFilePath.replace(EXT, '') + '.d.ts';
    };
    // AotCompilerHost
    MockAotCompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        return importedFile.replace(EXT, '');
    };
    MockAotCompilerHost.prototype.loadResource = function (path) {
        if (this.tsHost.fileExists(path)) {
            return this.tsHost.readFile(path);
        }
        else {
            throw new Error("Resource " + path + " not found.");
        }
    };
    return MockAotCompilerHost;
}());
exports.MockAotCompilerHost = MockAotCompilerHost;
var MockMetadataBundlerHost = (function () {
    function MockMetadataBundlerHost(host) {
        this.host = host;
        this.collector = new tsc_wrapped_1.MetadataCollector();
    }
    MockMetadataBundlerHost.prototype.getMetadataFor = function (moduleName) {
        var source = this.host.getSourceFile(moduleName + '.ts', ts.ScriptTarget.Latest);
        return this.collector.getMetadata(source);
    };
    return MockMetadataBundlerHost;
}());
exports.MockMetadataBundlerHost = MockMetadataBundlerHost;
function find(fileName, data) {
    if (!data)
        return undefined;
    var names = fileName.split('/');
    if (names.length && !names[0].length)
        names.shift();
    var current = data;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (typeof current !== 'object') {
            return undefined;
        }
        current = current[name_1];
    }
    return current;
}
function open(fileName, data) {
    var result = find(fileName, data);
    if (typeof result === 'string') {
        return result;
    }
    return undefined;
}
function directoryExists(dirname, data) {
    var result = find(dirname, data);
    return !!result && typeof result !== 'string';
}
function toMockFileArray(data, target) {
    if (target === void 0) { target = []; }
    if (data instanceof Map) {
        mapToMockFileArray(data, target);
    }
    else if (Array.isArray(data)) {
        data.forEach(function (entry) { return toMockFileArray(entry, target); });
    }
    else {
        mockDirToFileArray(data, '', target);
    }
    return target;
}
exports.toMockFileArray = toMockFileArray;
function mockDirToFileArray(dir, path, target) {
    Object.keys(dir).forEach(function (localFileName) {
        var value = dir[localFileName];
        var fileName = path + "/" + localFileName;
        if (typeof value === 'string') {
            target.push({ fileName: fileName, content: value });
        }
        else {
            mockDirToFileArray(value, fileName, target);
        }
    });
}
function mapToMockFileArray(files, target) {
    files.forEach(function (content, fileName) { target.push({ fileName: fileName, content: content }); });
}
function arrayToMockMap(arr) {
    var map = new Map();
    arr.forEach(function (_a) {
        var fileName = _a.fileName, content = _a.content;
        map.set(fileName, content);
    });
    return map;
}
exports.arrayToMockMap = arrayToMockMap;
function arrayToMockDir(arr) {
    var rootDir = {};
    arr.forEach(function (_a) {
        var fileName = _a.fileName, content = _a.content;
        var pathParts = fileName.split('/');
        // trim trailing slash
        var startIndex = pathParts[0] ? 0 : 1;
        // get/create the directory
        var currentDir = rootDir;
        for (var i = startIndex; i < pathParts.length - 1; i++) {
            var pathPart = pathParts[i];
            var localDir = currentDir[pathPart];
            if (!localDir) {
                currentDir[pathPart] = localDir = {};
            }
            currentDir = localDir;
        }
        // write the file
        currentDir[pathParts[pathParts.length - 1]] = content;
    });
    return rootDir;
}
exports.arrayToMockDir = arrayToMockDir;
var minCoreIndex = "\n  export * from './src/application_module';\n  export * from './src/change_detection';\n  export * from './src/metadata';\n  export * from './src/di/metadata';\n  export * from './src/di/injector';\n  export * from './src/di/injection_token';\n  export * from './src/linker';\n  export * from './src/render';\n  export * from './src/codegen_private_exports';\n";
function setup(options) {
    if (options === void 0) { options = {
        compileAngular: true,
        compileAnimations: true,
    }; }
    var angularFiles = new Map();
    beforeAll(function () {
        if (options.compileAngular) {
            var emittingHost = new EmittingCompilerHost([], { emitMetadata: true });
            emittingHost.addScript('@angular/core/index.ts', minCoreIndex);
            var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
            emittingProgram.emit();
            emittingHost.writtenAngularFiles(angularFiles);
        }
        if (options.compileAnimations) {
            var emittingHost = new EmittingCompilerHost(['@angular/animations/index.ts'], { emitMetadata: true });
            var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
            emittingProgram.emit();
            emittingHost.writtenAngularFiles(angularFiles);
        }
    });
    return angularFiles;
}
exports.setup = setup;
function expectNoDiagnostics(program) {
    function fileInfo(diagnostic) {
        if (diagnostic.file) {
            return diagnostic.file.fileName + "(" + diagnostic.start + "): ";
        }
        return '';
    }
    function chars(len, ch) { return new Array(len).fill(ch).join(''); }
    function lineNoOf(offset, text) {
        var result = 1;
        for (var i = 0; i < offset; i++) {
            if (text[i] == '\n')
                result++;
        }
        return result;
    }
    function lineInfo(diagnostic) {
        if (diagnostic.file) {
            var start = diagnostic.start;
            var end = diagnostic.start + diagnostic.length;
            var source = diagnostic.file.text;
            var lineStart = start;
            var lineEnd = end;
            while (lineStart > 0 && source[lineStart] != '\n')
                lineStart--;
            if (lineStart < start)
                lineStart++;
            while (lineEnd < source.length && source[lineEnd] != '\n')
                lineEnd++;
            var line = source.substring(lineStart, lineEnd);
            var lineIndex = line.indexOf('/n');
            if (lineIndex > 0) {
                line = line.substr(0, lineIndex);
                end = start + lineIndex;
            }
            var lineNo = lineNoOf(start, source) + ': ';
            return '\n' + lineNo + line + '\n' + chars(start - lineStart + lineNo.length, ' ') +
                chars(end - start, '^');
        }
        return '';
    }
    function expectNoDiagnostics(diagnostics) {
        if (diagnostics && diagnostics.length) {
            throw new Error('Errors from TypeScript:\n' +
                diagnostics.map(function (d) { return "" + fileInfo(d) + d.messageText + lineInfo(d); }).join(' \n'));
        }
    }
    expectNoDiagnostics(program.getOptionsDiagnostics());
    expectNoDiagnostics(program.getSyntacticDiagnostics());
    expectNoDiagnostics(program.getSemanticDiagnostics());
}
exports.expectNoDiagnostics = expectNoDiagnostics;
function isSource(fileName) {
    return !/\.d\.ts$/.test(fileName) && /\.ts$/.test(fileName);
}
exports.isSource = isSource;
function compile(rootDirs, options, tsOptions) {
    if (options === void 0) { options = {}; }
    if (tsOptions === void 0) { tsOptions = {}; }
    // when using summaries, always emit so the next step can use the results.
    var emit = options.emit || options.useSummaries;
    var preCompile = options.preCompile || (function () { });
    var postCompile = options.postCompile || expectNoDiagnostics;
    var rootDirArr = toMockFileArray(rootDirs);
    var scriptNames = rootDirArr.map(function (entry) { return entry.fileName; }).filter(isSource);
    var host = new MockCompilerHost(scriptNames, arrayToMockDir(rootDirArr));
    var aotHost = new MockAotCompilerHost(host);
    if (options.useSummaries) {
        aotHost.hideMetadata();
        aotHost.tsFilesOnly();
    }
    var tsSettings = __assign({}, exports.settings, tsOptions);
    var program = ts.createProgram(host.scriptNames.slice(0), tsSettings, host);
    preCompile(program);
    var _a = compiler_1.createAotCompiler(aotHost, options), compiler = _a.compiler, reflector = _a.reflector;
    var analyzedModules = compiler.analyzeModulesSync(program.getSourceFiles().map(function (sf) { return sf.fileName; }));
    var genFiles = options.stubsOnly ? compiler.emitAllStubs(analyzedModules) :
        compiler.emitAllImpls(analyzedModules);
    genFiles.forEach(function (file) {
        var source = file.source || compiler_1.toTypeScript(file);
        if (isSource(file.genFileUrl)) {
            host.addScript(file.genFileUrl, source);
        }
        else {
            host.override(file.genFileUrl, source);
        }
    });
    var newProgram = ts.createProgram(host.scriptNames.slice(0), tsSettings, host);
    postCompile(newProgram);
    if (emit) {
        newProgram.emit();
    }
    var outDir = {};
    if (emit) {
        outDir = arrayToMockDir(toMockFileArray([
            host.writtenFiles, host.overrides
        ]).filter(function (entry) { return !isSource(entry.fileName); }));
    }
    return { genFiles: genFiles, outDir: outDir };
}
exports.compile = compile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3QvdGVzdF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBc0g7QUFDdEgsb0RBQTRGO0FBQzVGLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLElBQUksZUFBdUIsQ0FBQztBQUM1QixJQUFJLGlCQUF5QixDQUFDO0FBQzlCLElBQUksUUFBZ0IsQ0FBQztBQUVyQixlQUFlLEVBQUUsQ0FBQztBQVFsQixxQkFBNEIsSUFBcUM7SUFDL0QsTUFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUNsQyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxJQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQztBQUN0QyxJQUFNLFlBQVksR0FBRyx3QkFBd0IsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyw2QkFBNkIsQ0FBQztBQUNoRCxJQUFNLElBQUksR0FBRyxVQUFVLENBQUM7QUFDeEIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ1osUUFBQSxRQUFRLEdBQXVCO0lBQzFDLE1BQU0sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUc7SUFDM0IsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUTtJQUM5QixnQkFBZ0IsRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsTUFBTTtJQUNoRCxxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLHNCQUFzQixFQUFFLElBQUk7SUFDNUIsY0FBYyxFQUFFLEtBQUs7SUFDckIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsWUFBWSxFQUFFLElBQUk7SUFDbEIsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxj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