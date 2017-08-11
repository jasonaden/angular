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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var source_map_util_1 = require("@angular/compiler/test/output/source_map_util");
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var core_1 = require("@angular/core");
var errors_1 = require("@angular/core/src/errors");
var testing_1 = require("@angular/core/testing");
function main() {
    describe('jit source mapping', function () {
        var jitSpy;
        var resourceLoader;
        beforeEach(function () {
            jitSpy = spyOn(core_1.ɵglobal, 'Function').and.callThrough();
            resourceLoader = new resource_loader_mock_1.MockResourceLoader();
            testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: resourceLoader }] });
        });
        function getErrorLoggerStack(e) {
            var logStack = undefined;
            errors_1.getErrorLogger(e)({ error: function () { return logStack = new Error().stack; } }, e.message);
            return logStack;
        }
        function getSourceMap(genFile) {
            var jitSources = jitSpy.calls.all().map(function (call) { return call.args[call.args.length - 1]; });
            return jitSources.map(function (source) { return source_map_util_1.extractSourceMap(source); })
                .find(function (map) { return !!(map && map.file === genFile); });
        }
        function getSourcePositionForStack(stack) {
            var ngFactoryLocations = stack
                .split('\n')
                .map(function (line) { return /\((.*\.ngfactory\.js):(\d+):(\d+)/.exec(line); })
                .filter(function (match) { return !!match; })
                .map(function (match) { return ({
                file: match[1],
                line: parseInt(match[2], 10),
                column: parseInt(match[3], 10)
            }); });
            var ngFactoryLocation = ngFactoryLocations[0];
            var sourceMap = getSourceMap(ngFactoryLocation.file);
            return source_map_util_1.originalPositionFor(sourceMap, { line: ngFactoryLocation.line, column: ngFactoryLocation.column });
        }
        function compileAndCreateComponent(comType) {
            testing_1.TestBed.configureTestingModule({ declarations: [comType] });
            var error;
            testing_1.TestBed.compileComponents().catch(function (e) { return error = e; });
            if (resourceLoader.hasPendingRequests()) {
                resourceLoader.flush();
            }
            testing_1.tick();
            if (error) {
                throw error;
            }
            return testing_1.TestBed.createComponent(comType);
        }
        describe('inline templates', function () {
            var ngUrl = 'ng:///DynamicTestModule/MyComp.html';
            function templateDecorator(template) { return { template: template }; }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        describe('external templates', function () {
            var ngUrl = 'ng:///some/url.html';
            var templateUrl = 'http://localhost:1234/some/url.html';
            function templateDecorator(template) {
                resourceLoader.expect(templateUrl, template);
                return { templateUrl: templateUrl };
            }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        function declareTests(_a) {
            var ngUrl = _a.ngUrl, templateDecorator = _a.templateDecorator;
            it('should use the right source url in html parse errors', testing_1.fakeAsync(function () {
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator('<div>\n  </error>')))
                ], MyComp);
                expect(function () { return compileAndCreateComponent(MyComp); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl.replace('$', '\\$') + "@1:2"));
            }));
            it('should use the right source url in template parse errors', testing_1.fakeAsync(function () {
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator('<div>\n  <div unknown="{{ctxProp}}"></div>')))
                ], MyComp);
                expect(function () { return compileAndCreateComponent(MyComp); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl.replace('$', '\\$') + "@1:7"));
            }));
            it('should create a sourceMap for templates', testing_1.fakeAsync(function () {
                var template = "Hello World!";
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator(template)))
                ], MyComp);
                compileAndCreateComponent(MyComp);
                var sourceMap = getSourceMap('ng:///DynamicTestModule/MyComp.ngfactory.js');
                expect(sourceMap.sources).toEqual([
                    'ng:///DynamicTestModule/MyComp.ngfactory.js', ngUrl
                ]);
                expect(sourceMap.sourcesContent).toEqual([' ', template]);
            }));
            it('should report source location for di errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <div   someDir></div></div>";
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator(template)))
                ], MyComp);
                var SomeDir = (function () {
                    function SomeDir() {
                        throw new Error('Test');
                    }
                    return SomeDir;
                }());
                SomeDir = __decorate([
                    core_1.Directive({ selector: '[someDir]' }),
                    __metadata("design:paramtypes", [])
                ], SomeDir);
                testing_1.TestBed.configureTestingModule({ declarations: [SomeDir] });
                var error;
                try {
                    compileAndCreateComponent(MyComp);
                }
                catch (e) {
                    error = e;
                }
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
            it('should report di errors with multiple elements and directives', testing_1.fakeAsync(function () {
                var template = "<div someDir></div><div someDir=\"throw\"></div>";
                var MyComp = (function () {
                    function MyComp() {
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator(template)))
                ], MyComp);
                var SomeDir = (function () {
                    function SomeDir(someDir) {
                        if (someDir === 'throw') {
                            throw new Error('Test');
                        }
                    }
                    return SomeDir;
                }());
                SomeDir = __decorate([
                    core_1.Directive({ selector: '[someDir]' }),
                    __param(0, core_1.Attribute('someDir')),
                    __metadata("design:paramtypes", [String])
                ], SomeDir);
                testing_1.TestBed.configureTestingModule({ declarations: [SomeDir] });
                var error;
                try {
                    compileAndCreateComponent(MyComp);
                }
                catch (e) {
                    error = e;
                }
                // The error should be logged from the 2nd-element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 1,
                    column: 19,
                    source: ngUrl,
                });
            }));
            it('should report source location for binding errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <span   [title]=\"createError()\"></span></div>";
                var MyComp = (function () {
                    function MyComp() {
                    }
                    MyComp.prototype.createError = function () { throw new Error('Test'); };
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator(template)))
                ], MyComp);
                var comp = compileAndCreateComponent(MyComp);
                var error;
                try {
                    comp.detectChanges();
                }
                catch (e) {
                    error = e;
                }
                // the stack should point to the binding
                expect(getSourcePositionForStack(error.stack)).toEqual({
                    line: 2,
                    column: 12,
                    source: ngUrl,
                });
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
            it('should report source location for event errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <span   (click)=\"createError()\"></span></div>";
                var MyComp = (function () {
                    function MyComp() {
                    }
                    MyComp.prototype.createError = function () { throw new Error('Test'); };
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component(__assign({}, templateDecorator(template)))
                ], MyComp);
                var comp = compileAndCreateComponent(MyComp);
                var error;
                var errorHandler = testing_1.TestBed.get(core_1.ErrorHandler);
                spyOn(errorHandler, 'handleError').and.callFake(function (e) { return error = e; });
                comp.debugElement.children[0].children[0].triggerEventHandler('click', 'EVENT');
                expect(error).toBeTruthy();
                // the stack should point to the binding
                expect(getSourcePositionForStack(error.stack)).toEqual({
                    line: 2,
                    column: 12,
                    source: ngUrl,
                });
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF9pbnRlZ3JhdGlvbl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvc291cmNlX21hcF9pbnRlZ3JhdGlvbl9ub2RlX29ubHlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBRWpELGlGQUFvRztBQUNwRywyRkFBc0Y7QUFDdEYsc0NBQXFGO0FBQ3JGLG1EQUF3RDtBQUN4RCxpREFBaUY7QUFFakY7SUFDRSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxNQUFtQixDQUFDO1FBQ3hCLElBQUksY0FBa0MsQ0FBQztRQUV2QyxVQUFVLENBQUM7WUFDVCxNQUFNLEdBQUcsS0FBSyxDQUFDLGNBQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsY0FBYyxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQztZQUMxQyxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUseUJBQWMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDLENBQUM7UUFFSCw2QkFBNkIsQ0FBUTtZQUNuQyxJQUFJLFFBQVEsR0FBVyxTQUFXLENBQUM7WUFDbkMsdUJBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBTSxFQUFDLEtBQUssRUFBRSxjQUFNLE9BQUEsUUFBUSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsS0FBTyxFQUE5QixDQUE4QixFQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUVELHNCQUFzQixPQUFlO1lB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