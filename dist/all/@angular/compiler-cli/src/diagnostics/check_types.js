"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var stubCancellationToken = {
    isCancellationRequested: function () { return false; },
    throwIfCancellationRequested: function () { }
};
var TypeChecker = (function () {
    function TypeChecker(program, tsOptions, compilerHost, aotCompilerHost, aotOptions, _analyzedModules, _generatedFiles) {
        this.program = program;
        this.tsOptions = tsOptions;
        this.compilerHost = compilerHost;
        this.aotCompilerHost = aotCompilerHost;
        this.aotOptions = aotOptions;
        this._analyzedModules = _analyzedModules;
        this._generatedFiles = _generatedFiles;
        this._currentCancellationToken = stubCancellationToken;
        this._partial = false;
    }
    TypeChecker.prototype.getDiagnostics = function (fileName, cancellationToken) {
        this._currentCancellationToken = cancellationToken || stubCancellationToken;
        try {
            return fileName ?
                this.diagnosticsByFileName.get(fileName) || [] : (_a = []).concat.apply(_a, Array.from(this.diagnosticsByFileName.values()));
        }
        finally {
            this._currentCancellationToken = stubCancellationToken;
        }
        var _a;
    };
    Object.defineProperty(TypeChecker.prototype, "partialResults", {
        get: function () { return this._partial; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "analyzedModules", {
        get: function () {
            return this._analyzedModules || (this._analyzedModules = this.aotCompiler.analyzeModulesSync(this.program.getSourceFiles().map(function (sf) { return sf.fileName; })));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "diagnosticsByFileName", {
        get: function () {
            return this._diagnosticsByFile || this.createDiagnosticsByFile();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "diagnosticProgram", {
        get: function () {
            return this._diagnosticProgram || this.createDiagnosticProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "generatedFiles", {
        get: function () {
            var result = this._generatedFiles;
            if (!result) {
                this._generatedFiles = result = this.aotCompiler.emitAllImpls(this.analyzedModules);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "aotCompiler", {
        get: function () {
            return this._aotCompiler || this.createCompilerAndReflector();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "reflector", {
        get: function () {
            var result = this._reflector;
            if (!result) {
                this.createCompilerAndReflector();
                result = this._reflector;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "factories", {
        get: function () {
            return this._factories || this.createFactories();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeChecker.prototype, "factoryNames", {
        get: function () {
            return this._factoryNames || (this.createFactories() && this._factoryNames);
        },
        enumerable: true,
        configurable: true
    });
    TypeChecker.prototype.createCompilerAndReflector = function () {
        var _a = compiler_1.createAotCompiler(this.aotCompilerHost, this.aotOptions), compiler = _a.compiler, reflector = _a.reflector;
        this._reflector = reflector;
        return this._aotCompiler = compiler;
    };
    TypeChecker.prototype.createDiagnosticProgram = function () {
        // Create a program that is all the files from the original program plus the factories.
        var existingFiles = this.program.getSourceFiles().map(function (source) { return source.fileName; });
        var host = new TypeCheckingHost(this.compilerHost, this.program, this.factories);
        return this._diagnosticProgram =
            ts.createProgram(existingFiles.concat(this.factoryNames), this.tsOptions, host);
    };
    TypeChecker.prototype.createFactories = function () {
        // Create all the factory files with enough information to map the diagnostics reported for the
        // created file back to the original source.
        var emitter = new compiler_1.TypeScriptEmitter();
        var factorySources = this.generatedFiles.filter(function (file) { return file.stmts != null && file.stmts.length; })
            .map(function (file) { return [file.genFileUrl, createFactoryInfo(emitter, file)]; });
        this._factories = new Map(factorySources);
        this._factoryNames = Array.from(this._factories.keys());
        return this._factories;
    };
    TypeChecker.prototype.createDiagnosticsByFile = function () {
        // Collect all the diagnostics binned by original source file name.
        var result = new Map();
        var diagnosticsFor = function (fileName) {
            var r = result.get(fileName);
            if (!r) {
                r = [];
                result.set(fileName, r);
            }
            return r;
        };
        var program = this.diagnosticProgram;
        for (var _i = 0, _a = this.factoryNames; _i < _a.length; _i++) {
            var factoryName = _a[_i];
            if (this._currentCancellationToken.isCancellationRequested())
                return result;
            var sourceFile = program.getSourceFile(factoryName);
            for (var _b = 0, _c = this.diagnosticProgram.getSemanticDiagnostics(sourceFile); _b < _c.length; _b++) {
                var diagnostic = _c[_b];
                var span = this.sourceSpanOf(diagnostic.file, diagnostic.start, diagnostic.length);
                if (span) {
                    var fileName = span.start.file.url;
                    var diagnosticsList = diagnosticsFor(fileName);
                    diagnosticsList.push({
                        message: diagnosticMessageToString(diagnostic.messageText),
                        category: diagnosticCategoryConverter(diagnostic.category), span: span
                    });
                }
            }
        }
        return result;
    };
    TypeChecker.prototype.sourceSpanOf = function (source, start, length) {
        // Find the corresponding TypeScript node
        var info = this.factories.get(source.fileName);
        if (info) {
            var _a = ts.getLineAndCharacterOfPosition(source, start), line = _a.line, character = _a.character;
            return info.context.spanOf(line, character);
        }
        return null;
    };
    return TypeChecker;
}());
exports.TypeChecker = TypeChecker;
function diagnosticMessageToString(message) {
    return ts.flattenDiagnosticMessageText(message, '\n');
}
function diagnosticCategoryConverter(kind) {
    // The diagnostics kind matches ts.DiagnosticCategory. Review this code if this changes.
    return kind;
}
function createFactoryInfo(emitter, file) {
    var _a = emitter.emitStatementsAndContext(file.srcFileUrl, file.genFileUrl, file.stmts), sourceText = _a.sourceText, context = _a.context;
    var source = ts.createSourceFile(file.genFileUrl, sourceText, ts.ScriptTarget.Latest, /* setParentNodes */ true);
    return { source: source, context: context };
}
var TypeCheckingHost = (function () {
    function TypeCheckingHost(host, originalProgram, factories) {
        this.host = host;
        this.originalProgram = originalProgram;
        this.factories = factories;
        this.writeFile = function () { throw new Error('Unexpected write in diagnostic program'); };
    }
    TypeCheckingHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var originalSource = this.originalProgram.getSourceFile(fileName);
        if (originalSource) {
            return originalSource;
        }
        var factoryInfo = this.factories.get(fileName);
        if (factoryInfo) {
            return factoryInfo.source;
        }
        return this.host.getSourceFile(fileName, languageVersion, onError);
    };
    TypeCheckingHost.prototype.getDefaultLibFileName = function (options) {
        return this.host.getDefaultLibFileName(options);
    };
    TypeCheckingHost.prototype.getCurrentDirectory = function () { return this.host.getCurrentDirectory(); };
    TypeCheckingHost.prototype.getDirectories = function (path) { return this.host.getDirectories(path); };
    TypeCheckingHost.prototype.getCanonicalFileName = function (fileName) {
        return this.host.getCanonicalFileName(fileName);
    };
    TypeCheckingHost.prototype.useCaseSensitiveFileNames = function () { return this.host.useCaseSensitiveFileNames(); };
    TypeCheckingHost.prototype.getNewLine = function () { return this.host.getNewLine(); };
    TypeCheckingHost.prototype.fileExists = function (fileName) {
        return this.factories.has(fileName) || this.host.fileExists(fileName);
    };
    TypeCheckingHost.prototype.readFile = function (fileName) {
        var factoryInfo = this.factories.get(fileName);
        return (factoryInfo && factoryInfo.source.text) || this.host.readFile(fileName);
    };
    return TypeCheckingHost;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tfdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL2RpYWdub3N0aWNzL2NoZWNrX3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQStOO0FBQy9OLCtCQUFpQztBQVdqQyxJQUFNLHFCQUFxQixHQUF5QjtJQUNsRCx1QkFBdUIsRUFBdkIsY0FBbUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUM7SUFDakQsNEJBQTRCLEVBQTVCLGNBQXFDLENBQUM7Q0FDdkMsQ0FBQztBQUVGO0lBVUUscUJBQ1ksT0FBbUIsRUFBVSxTQUE2QixFQUMxRCxZQUE2QixFQUFVLGVBQWdDLEVBQ3ZFLFVBQThCLEVBQVUsZ0JBQW9DLEVBQzVFLGVBQWlDO1FBSGpDLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUMxRCxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDdkUsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBQzVFLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQVByQyw4QkFBeUIsR0FBeUIscUJBQXFCLENBQUM7UUFDeEUsYUFBUSxHQUFZLEtBQUssQ0FBQztJQU1jLENBQUM7SUFFakQsb0NBQWMsR0FBZCxVQUFlLFFBQWlCLEVBQUUsaUJBQXdDO1FBQ3hFLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxpQkFBaUIsSUFBSSxxQkFBcUIsQ0FBQztRQUM1RSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsUUFBUTtnQkFDWCxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FDOUMsQ0FBQSxLQUFDLEVBQW1CLENBQUEsQ0FBQyxNQUFNLFdBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7Z0JBQVMsQ0FBQztZQUNULElBQUksQ0FBQyx5QkFBeUIsR0FBRyxxQkFBcUIsQ0FBQztRQUN6RCxDQUFDOztJQUNILENBQUM7SUFFRCxzQkFBSSx1Q0FBYzthQUFsQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXZELHNCQUFZLHdDQUFlO2FBQTNCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsQ0FBQyxRQUFRLEVBQVgsQ0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7OztPQUFBO0lBRUQsc0JBQVksOENBQXFCO2FBQWpDO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNuRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFZLDBDQUFpQjthQUE3QjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDbkUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSx1Q0FBYzthQUExQjtZQUNFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0RixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVELHNCQUFZLG9DQUFXO2FBQXZCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDaEUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSxrQ0FBUzthQUFyQjtZQUNFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO2dCQUNsQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVksQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVELHNCQUFZLGtDQUFTO2FBQXJCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ25ELENBQUM7OztPQUFBO0lBRUQsc0JBQVkscUNBQVk7YUFBeEI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBZSxDQUFDLENBQUM7UUFDaEYsQ0FBQzs7O09BQUE7SUFFTyxnREFBMEIsR0FBbEM7UUFDUSxJQUFBLHdFQUFnRixFQUEvRSxzQkFBUSxFQUFFLHdCQUFTLENBQTZEO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUN0QyxDQUFDO0lBRU8sNkNBQXVCLEdBQS9CO1FBQ0UsdUZBQXVGO1FBQ3ZGLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLFFBQVEsRUFBZixDQUFlLENBQUMsQ0FBQztRQUNuRixJQUFNLElBQUksR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkYsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0I7WUFDbkIsRUFBRSxDQUFDLGFBQWEsQ0FBSyxhQUFhLFFBQUssSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFTyxxQ0FBZSxHQUF2QjtRQUNFLCtGQUErRjtRQUMvRiw0Q0FBNEM7UUFDNUMsSUFBTSxPQUFPLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDO1FBQ3hDLElBQU0sY0FBYyxHQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUF2QyxDQUF1QyxDQUFDO2FBQ3RFLEdBQUcsQ0FDQSxVQUFBLElBQUksSUFBSSxPQUFBLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBbkQsQ0FBbUQsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRU8sNkNBQXVCLEdBQS9CO1FBQ0UsbUVBQW1FO1FBQ25FLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQy9DLElBQU0sY0FBYyxHQUFHLFVBQUMsUUFBZ0I7WUFDdEMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQztRQUNGLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUN2QyxHQUFHLENBQUMsQ0FBc0IsVUFBaUIsRUFBakIsS0FBQSxJQUFJLENBQUMsWUFBWSxFQUFqQixjQUFpQixFQUFqQixJQUFpQjtZQUF0QyxJQUFNLFdBQVcsU0FBQTtZQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzVFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEQsR0FBRyxDQUFDLENBQXFCLFVBQXlELEVBQXpELEtBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxFQUF6RCxjQUF5RCxFQUF6RCxJQUF5RDtnQkFBN0UsSUFBTSxVQUFVLFNBQUE7Z0JBQ25CLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQ3JDLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakQsZUFBZSxDQUFDLElBQUksQ0FBQzt3QkFDbkIsT0FBTyxFQUFFLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7d0JBQzFELFFBQVEsRUFBRSwyQkFBMkIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxNQUFBO3FCQUNqRSxDQUFDLENBQUM7Z0JBQ0wsQ0FBQzthQUNGO1NBQ0Y7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxrQ0FBWSxHQUFwQixVQUFxQixNQUFxQixFQUFFLEtBQWEsRUFBRSxNQUFjO1FBQ3ZFLHlDQUF5QztRQUN6QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNILElBQUEsb0RBQW1FLEVBQWxFLGNBQUksRUFBRSx3QkFBUyxDQUFvRDtZQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXpJRCxJQXlJQztBQXpJWSxrQ0FBVztBQTJJeEIsbUNBQW1DLE9BQTJDO0lBQzVFLE1BQU0sQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCxxQ0FBcUMsSUFBMkI7SUFDOUQsd0ZBQXdGO0lBQ3hGLE1BQU0sQ0FBQyxJQUFpQyxDQUFDO0FBQzNDLENBQUM7QUFFRCwyQkFBMkIsT0FBMEIsRUFBRSxJQUFtQjtJQUNsRSxJQUFBLG1GQUM4RSxFQUQ3RSwwQkFBVSxFQUFFLG9CQUFPLENBQzJEO0lBQ3JGLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEYsTUFBTSxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQ7SUFDRSwwQkFDWSxJQUFxQixFQUFVLGVBQTJCLEVBQzFELFNBQW1DO1FBRG5DLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQVk7UUFDMUQsY0FBUyxHQUFULFNBQVMsQ0FBMEI7UUFvQi9DLGNBQVMsR0FDTCxjQUFRLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQXJCdkIsQ0FBQztJQUVuRCx3Q0FBYSxHQUFiLFVBQ0ksUUFBZ0IsRUFBRSxlQUFnQyxFQUNsRCxPQUFxQztRQUN2QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxjQUFjLENBQUM7UUFDeEIsQ0FBQztRQUNELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDNUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxnREFBcUIsR0FBckIsVUFBc0IsT0FBMkI7UUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUtELDhDQUFtQixHQUFuQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6RSx5Q0FBYyxHQUFkLFVBQWUsSUFBWSxJQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakYsK0NBQW9CLEdBQXBCLFVBQXFCLFFBQWdCO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxvREFBeUIsR0FBekIsY0FBdUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEYscUNBQVUsR0FBVixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkQscUNBQVUsR0FBVixVQUFXLFFBQWdCO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsbUNBQVEsR0FBUixVQUFTLFFBQWdCO1FBQ3ZCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0MifQ==