"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var MockAotContext = (function () {
    function MockAotContext(currentDirectory, files) {
        this.currentDirectory = currentDirectory;
        this.files = files;
    }
    MockAotContext.prototype.fileExists = function (fileName) { return typeof this.getEntry(fileName) === 'string'; };
    MockAotContext.prototype.directoryExists = function (path) { return typeof this.getEntry(path) === 'object'; };
    MockAotContext.prototype.readFile = function (fileName) {
        var data = this.getEntry(fileName);
        if (typeof data === 'string') {
            return data;
        }
        return undefined;
    };
    MockAotContext.prototype.readResource = function (fileName) {
        var result = this.readFile(fileName);
        if (result == null) {
            return Promise.reject(new Error("Resource not found: " + fileName));
        }
        return Promise.resolve(result);
    };
    MockAotContext.prototype.writeFile = function (fileName, data) {
        var parts = fileName.split('/');
        var name = parts.pop();
        var entry = this.getEntry(parts);
        if (entry && typeof entry !== 'string') {
            entry[name] = data;
        }
    };
    MockAotContext.prototype.assumeFileExists = function (fileName) { this.writeFile(fileName, ''); };
    MockAotContext.prototype.getEntry = function (fileName) {
        var parts = typeof fileName === 'string' ? fileName.split('/') : fileName;
        if (parts[0]) {
            parts = this.currentDirectory.split('/').concat(parts);
        }
        parts.shift();
        parts = normalize(parts);
        var current = this.files;
        while (parts.length) {
            var part = parts.shift();
            if (typeof current === 'string') {
                return undefined;
            }
            var next = current[part];
            if (next === undefined) {
                return undefined;
            }
            current = next;
        }
        return current;
    };
    MockAotContext.prototype.getDirectories = function (path) {
        var dir = this.getEntry(path);
        if (typeof dir !== 'object') {
            return [];
        }
        else {
            return Object.keys(dir).filter(function (key) { return typeof dir[key] === 'object'; });
        }
    };
    return MockAotContext;
}());
exports.MockAotContext = MockAotContext;
function normalize(parts) {
    var result = [];
    while (parts.length) {
        var part = parts.shift();
        switch (part) {
            case '.':
                break;
            case '..':
                result.pop();
                break;
            default:
                result.push(part);
        }
    }
    return result;
}
var MockCompilerHost = (function () {
    function MockCompilerHost(context) {
        var _this = this;
        this.context = context;
        this.writeFile = function (fileName, text) { _this.context.writeFile(fileName, text); };
    }
    MockCompilerHost.prototype.fileExists = function (fileName) { return this.context.fileExists(fileName); };
    MockCompilerHost.prototype.readFile = function (fileName) { return this.context.readFile(fileName); };
    MockCompilerHost.prototype.directoryExists = function (directoryName) {
        return this.context.directoryExists(directoryName);
    };
    MockCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var sourceText = this.context.readFile(fileName);
        if (sourceText) {
            return ts.createSourceFile(fileName, sourceText, languageVersion);
        }
        else {
            return undefined;
        }
    };
    MockCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return ts.getDefaultLibFileName(options);
    };
    MockCompilerHost.prototype.getCurrentDirectory = function () { return this.context.currentDirectory; };
    MockCompilerHost.prototype.getCanonicalFileName = function (fileName) { return fileName; };
    MockCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    MockCompilerHost.prototype.getNewLine = function () { return '\n'; };
    MockCompilerHost.prototype.getDirectories = function (path) { return this.context.getDirectories(path); };
    return MockCompilerHost;
}());
exports.MockCompilerHost = MockCompilerHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9tb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUFpQztBQU1qQztJQUNFLHdCQUFtQixnQkFBd0IsRUFBVSxLQUFZO1FBQTlDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQU87SUFBRyxDQUFDO0lBRXJFLG1DQUFVLEdBQVYsVUFBVyxRQUFnQixJQUFhLE1BQU0sQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztJQUU3Rix3Q0FBZSxHQUFmLFVBQWdCLElBQVksSUFBYSxNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFMUYsaUNBQVEsR0FBUixVQUFTLFFBQWdCO1FBQ3ZCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELHFDQUFZLEdBQVosVUFBYSxRQUFnQjtRQUMzQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF1QixRQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3RF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