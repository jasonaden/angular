"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var angularts = /@angular\/(\w|\/|-)+\.tsx?$/;
var rxjsts = /rxjs\/(\w|\/)+\.tsx?$/;
var rxjsmetadata = /rxjs\/(\w|\/)+\.metadata\.json?$/;
var tsxfile = /\.tsx$/;
/* The missing cache does two things. First it improves performance of the
   tests as it reduces the number of OS calls made during testing. Also it
   improves debugging experience as fewer exceptions are raised allow you
   to use stopping on all exceptions. */
var missingCache = new Map();
var cacheUsed = new Set();
var reportedMissing = new Set();
/**
 * The cache is valid if all the returned entries are empty.
 */
function validateCache() {
    var exists = [];
    var unused = [];
    for (var _i = 0, _a = iterableToArray(missingCache.keys()); _i < _a.length; _i++) {
        var fileName = _a[_i];
        if (fs.existsSync(fileName)) {
            exists.push(fileName);
        }
        if (!cacheUsed.has(fileName)) {
            unused.push(fileName);
        }
    }
    return { exists: exists, unused: unused, reported: iterableToArray(reportedMissing.keys()) };
}
exports.validateCache = validateCache;
missingCache.set('/node_modules/@angular/core.d.ts', true);
missingCache.set('/node_modules/@angular/animations.d.ts', true);
missingCache.set('/node_modules/@angular/platform-browser/animations.d.ts', true);
missingCache.set('/node_modules/@angular/common.d.ts', true);
missingCache.set('/node_modules/@angular/forms.d.ts', true);
missingCache.set('/node_modules/@angular/core/src/di/provider.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/change_detection/pipe_transform.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/reflection/types.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/reflection/platform_reflection_capabilities.metadata.json', true);
missingCache.set('/node_modules/@angular/forms/src/directives/form_interface.metadata.json', true);
var MockTypescriptHost = (function () {
    function MockTypescriptHost(scriptNames, data) {
        this.scriptNames = scriptNames;
        this.data = data;
        this.scriptVersion = new Map();
        this.overrides = new Map();
        this.projectVersion = 0;
        this.overrideDirectory = new Set();
        var moduleFilename = module.filename.replace(/\\/g, '/');
        var angularIndex = moduleFilename.indexOf('@angular');
        if (angularIndex >= 0)
            this.angularPath = moduleFilename.substr(0, angularIndex).replace('/all/', '/all/@angular/');
        var distIndex = moduleFilename.indexOf('/dist/all');
        if (distIndex >= 0)
            this.nodeModulesPath = path.join(moduleFilename.substr(0, distIndex), 'node_modules');
        this.options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
        };
    }
    MockTypescriptHost.prototype.override = function (fileName, content) {
        this.scriptVersion.set(fileName, (this.scriptVersion.get(fileName) || 0) + 1);
        if (fileName.endsWith('.ts')) {
            this.projectVersion++;
        }
        if (content) {
            this.overrides.set(fileName, content);
            this.overrideDirectory.add(path.dirname(fileName));
        }
        else {
            this.overrides.delete(fileName);
        }
    };
    MockTypescriptHost.prototype.addScript = function (fileName, content) {
        this.projectVersion++;
        this.overrides.set(fileName, content);
        this.overrideDirectory.add(path.dirname(fileName));
        this.scriptNames.push(fileName);
    };
    MockTypescriptHost.prototype.forgetAngular = function () { this.angularPath = undefined; };
    MockTypescriptHost.prototype.overrideOptions = function (cb) {
        this.options = cb(Object.assign({}, this.options));
        this.projectVersion++;
    };
    MockTypescriptHost.prototype.getCompilationSettings = function () { return this.options; };
    MockTypescriptHost.prototype.getProjectVersion = function () { return this.projectVersion.toString(); };
    MockTypescriptHost.prototype.getScriptFileNames = function () { return this.scriptNames; };
    MockTypescriptHost.prototype.getScriptVersion = function (fileName) {
        return (this.scriptVersion.get(fileName) || 0).toString();
    };
    MockTypescriptHost.prototype.getScriptSnapshot = function (fileName) {
        var content = this.getFileContent(fileName);
        if (content)
            return ts.ScriptSnapshot.fromString(content);
        return undefined;
    };
    MockTypescriptHost.prototype.getCurrentDirectory = function () { return '/'; };
    MockTypescriptHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockTypescriptHost.prototype.directoryExists = function (directoryName) {
        if (this.overrideDirectory.has(directoryName))
            return true;
        var effectiveName = this.getEffectiveName(directoryName);
        if (effectiveName === directoryName)
            return directoryExists(directoryName, this.data);
        else
            return fs.existsSync(effectiveName);
    };
    MockTypescriptHost.prototype.getMarkerLocations = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content) {
            return getLocationMarkers(content);
        }
    };
    MockTypescriptHost.prototype.getReferenceMarkers = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content) {
            return getReferenceMarkers(content);
        }
    };
    MockTypescriptHost.prototype.getFileContent = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content)
            return removeReferenceMarkers(removeLocationMarkers(content));
    };
    MockTypescriptHost.prototype.getRawFileContent = function (fileName) {
        if (this.overrides.has(fileName)) {
            return this.overrides.get(fileName);
        }
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(this.getCompilationSettings());
            return fs.readFileSync(path.join(path.dirname(libPath), basename), 'utf8');
        }
        else {
            if (missingCache.has(fileName)) {
                cacheUsed.add(fileName);
                return undefined;
            }
            var effectiveName = this.getEffectiveName(fileName);
            if (effectiveName === fileName)
                return open(fileName, this.data);
            else if (!fileName.match(angularts) && !fileName.match(rxjsts) && !fileName.match(rxjsmetadata) &&
                !fileName.match(tsxfile)) {
                if (fs.existsSync(effectiveName)) {
                    return fs.readFileSync(effectiveName, 'utf8');
                }
                else {
                    missingCache.set(fileName, true);
                    reportedMissing.add(fileName);
                    cacheUsed.add(fileName);
                }
            }
        }
    };
    MockTypescriptHost.prototype.getEffectiveName = function (name) {
        var node_modules = 'node_modules';
        var at_angular = '/@angular';
        if (name.startsWith('/' + node_modules)) {
            if (this.nodeModulesPath && !name.startsWith('/' + node_modules + at_angular)) {
                var result = path.join(this.nodeModulesPath, name.substr(node_modules.length + 1));
                if (!name.match(rxjsts))
                    if (fs.existsSync(result)) {
                        return result;
                    }
            }
            if (this.angularPath && name.startsWith('/' + node_modules + at_angular)) {
                return path.join(this.angularPath, name.substr(node_modules.length + at_angular.length + 1));
            }
        }
        return name;
    };
    return MockTypescriptHost;
}());
exports.MockTypescriptHost = MockTypescriptHost;
function iterableToArray(iterator) {
    var result = [];
    while (true) {
        var next = iterator.next();
        if (next.done)
            break;
        result.push(next.value);
    }
    return result;
}
function find(fileName, data) {
    var names = fileName.split('/');
    if (names.length && !names[0].length)
        names.shift();
    var current = data;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (typeof current === 'string')
            return undefined;
        else
            current = current[name_1];
        if (!current)
            return undefined;
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
var locationMarker = /\~\{(\w+(-\w+)*)\}/g;
function removeLocationMarkers(value) {
    return value.replace(locationMarker, '');
}
function getLocationMarkers(value) {
    value = removeReferenceMarkers(value);
    var result = {};
    var adjustment = 0;
    value.replace(locationMarker, function (match, name, _, index) {
        result[name] = index - adjustment;
        adjustment += match.length;
        return '';
    });
    return result;
}
var referenceMarker = /«(((\w|\-)+)|([^∆]*∆(\w+)∆.[^»]*))»/g;
var definitionMarkerGroup = 1;
var nameMarkerGroup = 2;
function getReferenceMarkers(value) {
    var references = {};
    var definitions = {};
    value = removeLocationMarkers(value);
    var adjustment = 0;
    var text = value.replace(referenceMarker, function (match, text, reference, _, definition, definitionName, index) {
        var result = reference ? text : text.replace(/∆/g, '');
        var span = { start: index - adjustment, end: index - adjustment + result.length };
        var markers = reference ? references : definitions;
        var name = reference || definitionName;
        (markers[name] = (markers[name] || [])).push(span);
        adjustment += match.length - result.length;
        return result;
    });
    return { text: text, definitions: definitions, references: references };
}
function removeReferenceMarkers(value) {
    return value.replace(referenceMarker, function (match, text) { return text.replace(/∆/g, ''); });
}
function noDiagnostics(diagnostics) {
    if (diagnostics && diagnostics.length) {
        throw new Error("Unexpected diagnostics: \n  " + diagnostics.map(function (d) { return d.message; }).join('\n  '));
    }
}
exports.noDiagnostics = noDiagnostics;
function includeDiagnostic(diagnostics, message, p1, p2) {
    expect(diagnostics).toBeDefined();
    if (diagnostics) {
        var diagnostic = diagnostics.find(function (d) { return d.message.indexOf(message) >= 0; });
        expect(diagnostic).toBeDefined();
        if (diagnostic && p1 != null) {
            var at = typeof p1 === 'number' ? p1 : p2.indexOf(p1);
            var len = typeof p2 === 'number' ? p2 : p1.length;
            expect(diagnostic.span.start).toEqual(at);
            if (len != null) {
                expect(diagnostic.span.end - diagnostic.span.start).toEqual(len);
            }
        }
    }
}
exports.includeDiagnostic = includeDiagnostic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC90ZXN0X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFVakMsSUFBTSxTQUFTLEdBQUcsNkJBQTZCLENBQUM7QUFDaEQsSUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUM7QUFDdkMsSUFBTSxZQUFZLEdBQUcsa0NBQWtDLENBQUM7QUFDeEQsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBRXpCOzs7d0NBR3dDO0FBQ3hDLElBQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO0FBQ2hELElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7QUFDcEMsSUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztBQUUxQzs7R0FFRztBQUNIO0lBQ0UsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUM1QixHQUFHLENBQUMsQ0FBbUIsVUFBb0MsRUFBcEMsS0FBQSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQXBDLGNBQW9DLEVBQXBDLElBQW9DO1FBQXRELElBQU0sUUFBUSxTQUFBO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztR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