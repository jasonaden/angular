"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
var config_1 = require("@angular/compiler/src/config");
var directive_normalizer_1 = require("@angular/compiler/src/directive_normalizer");
var resource_loader_1 = require("@angular/compiler/src/resource_loader");
var test_bindings_1 = require("@angular/compiler/testing/src/test_bindings");
var view_1 = require("@angular/core/src/metadata/view");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var util_1 = require("../src/util");
var spies_1 = require("./spies");
var SOME_MODULE_URL = 'package:some/module/a.js';
var SOME_HTTP_MODULE_URL = 'http://some/module/a.js';
function normalizeTemplate(normalizer, o) {
    return normalizer.normalizeTemplate({
        ngModuleType: util_1.noUndefined(o.ngModuleType),
        componentType: util_1.noUndefined(o.componentType),
        moduleUrl: util_1.noUndefined(o.moduleUrl),
        template: util_1.noUndefined(o.template),
        templateUrl: util_1.noUndefined(o.templateUrl),
        styles: util_1.noUndefined(o.styles),
        styleUrls: util_1.noUndefined(o.styleUrls),
        interpolation: util_1.noUndefined(o.interpolation),
        encapsulation: util_1.noUndefined(o.encapsulation),
        animations: util_1.noUndefined(o.animations)
    });
}
function normalizeTemplateOnly(normalizer, o) {
    return normalizer.normalizeTemplateOnly({
        ngModuleType: util_1.noUndefined(o.ngModuleType),
        componentType: util_1.noUndefined(o.componentType),
        moduleUrl: util_1.noUndefined(o.moduleUrl),
        template: util_1.noUndefined(o.template),
        templateUrl: util_1.noUndefined(o.templateUrl),
        styles: util_1.noUndefined(o.styles),
        styleUrls: util_1.noUndefined(o.styleUrls),
        interpolation: util_1.noUndefined(o.interpolation),
        encapsulation: util_1.noUndefined(o.encapsulation),
        animations: util_1.noUndefined(o.animations)
    });
}
function compileTemplateMetadata(_a) {
    var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline;
    return new compile_metadata_1.CompileTemplateMetadata({
        encapsulation: encapsulation || null,
        template: template || null,
        templateUrl: templateUrl || null,
        styles: styles || [],
        styleUrls: styleUrls || [],
        externalStylesheets: externalStylesheets || [],
        ngContentSelectors: ngContentSelectors || [],
        animations: animations || [],
        interpolation: interpolation || null,
        isInline: !!isInline,
    });
}
function normalizeLoadedTemplate(normalizer, o, template, templateAbsUrl) {
    return normalizer.normalizeLoadedTemplate({
        ngModuleType: o.ngModuleType || null,
        componentType: o.componentType || null,
        moduleUrl: o.moduleUrl || '',
        template: o.template || null,
        templateUrl: o.templateUrl || null,
        styles: o.styles || [],
        styleUrls: o.styleUrls || [],
        interpolation: o.interpolation || null,
        encapsulation: o.encapsulation || null,
        animations: o.animations || [],
    }, template, templateAbsUrl);
}
function main() {
    testing_internal_1.describe('DirectiveNormalizer', function () {
        testing_internal_1.beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: test_bindings_1.TEST_COMPILER_PROVIDERS }); });
        testing_internal_1.describe('normalizeDirective', function () {
            testing_internal_1.it('should throw if no template was specified', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                testing_internal_1.expect(function () { return normalizeTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                }); })
                    .toThrowError('No template specified for component SomeComp');
            }));
            testing_internal_1.it('should throw if template is not a string', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                testing_internal_1.expect(function () { return normalizeTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    template: {}
                }); })
                    .toThrowError('The template specified for component SomeComp is not a string');
            }));
            testing_internal_1.it('should throw if templateUrl is not a string', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                testing_internal_1.expect(function () { return normalizeTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    templateUrl: {}
                }); })
                    .toThrowError('The templateUrl specified for component SomeComp is not a string');
            }));
            testing_internal_1.it('should throw if both template and templateUrl are defined', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                testing_internal_1.expect(function () { return normalizeTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    template: '',
                    templateUrl: '',
                }); })
                    .toThrowError("'SomeComp' component cannot define both template and templateUrl");
            }));
        });
        testing_internal_1.describe('normalizeTemplateOnly sync', function () {
            testing_internal_1.it('should store the template', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: 'a',
                    templateUrl: null,
                    styles: [],
                    styleUrls: []
                });
                testing_internal_1.expect(template.template).toEqual('a');
                testing_internal_1.expect(template.templateUrl).toEqual('package:some/module/a.js');
                testing_internal_1.expect(template.isInline).toBe(true);
            }));
            testing_internal_1.it('should resolve styles on the annotation against the moduleUrl', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: '',
                    templateUrl: null,
                    styles: [],
                    styleUrls: ['test.css']
                });
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            testing_internal_1.it('should resolve styles in the template against the moduleUrl', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: '<style>@import test.css</style>',
                    templateUrl: null,
                    styles: [],
                    styleUrls: []
                });
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            testing_internal_1.it('should use ViewEncapsulation.Emulated by default', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: '',
                    templateUrl: null,
                    styles: [],
                    styleUrls: ['test.css']
                });
                testing_internal_1.expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.Emulated);
            }));
            testing_internal_1.it('should use default encapsulation provided by CompilerConfig', testing_internal_1.inject([config_1.CompilerConfig, directive_normalizer_1.DirectiveNormalizer], function (config, normalizer) {
                config.defaultEncapsulation = view_1.ViewEncapsulation.None;
                var template = normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: undefined,
                    template: '',
                    templateUrl: undefined,
                    styles: [],
                    styleUrls: ['test.css']
                });
                testing_internal_1.expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.None);
            }));
        });
        testing_internal_1.describe('templateUrl', function () {
            testing_internal_1.it('should load a template from a url that is resolved against moduleUrl', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                resourceLoader.expect('package:some/module/sometplurl.html', 'a');
                normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: null,
                    templateUrl: 'sometplurl.html',
                    styles: [],
                    styleUrls: ['test.css']
                }).then(function (template) {
                    testing_internal_1.expect(template.template).toEqual('a');
                    testing_internal_1.expect(template.templateUrl).toEqual('package:some/module/sometplurl.html');
                    testing_internal_1.expect(template.isInline).toBe(false);
                    async.done();
                });
                resourceLoader.flush();
            }));
            testing_internal_1.it('should resolve styles on the annotation against the moduleUrl', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                resourceLoader.expect('package:some/module/tpl/sometplurl.html', '');
                normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: null,
                    templateUrl: 'tpl/sometplurl.html',
                    styles: [],
                    styleUrls: ['test.css']
                }).then(function (template) {
                    testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/test.css']);
                    async.done();
                });
                resourceLoader.flush();
            }));
            testing_internal_1.it('should resolve styles in the template against the templateUrl', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                resourceLoader.expect('package:some/module/tpl/sometplurl.html', '<style>@import test.css</style>');
                normalizeTemplateOnly(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    template: null,
                    templateUrl: 'tpl/sometplurl.html',
                    styles: [],
                    styleUrls: []
                }).then(function (template) {
                    testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/tpl/test.css']);
                    async.done();
                });
                resourceLoader.flush();
            }));
        });
        testing_internal_1.describe('normalizeExternalStylesheets', function () {
            testing_internal_1.beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: [spies_1.SpyResourceLoader.PROVIDE] }); });
            testing_internal_1.it('should load an external stylesheet', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                programResourceLoaderSpy(resourceLoader, { 'package:some/module/test.css': 'a' });
                normalizer.normalizeExternalStylesheets(compileTemplateMetadata({
                    template: '',
                    templateUrl: '',
                    styleUrls: ['package:some/module/test.css']
                }))
                    .then(function (template) {
                    testing_internal_1.expect(template.externalStylesheets.length).toBe(1);
                    testing_internal_1.expect(template.externalStylesheets[0]).toEqual(new compile_metadata_1.CompileStylesheetMetadata({
                        moduleUrl: 'package:some/module/test.css',
                        styles: ['a'],
                        styleUrls: []
                    }));
                    async.done();
                });
            }));
            testing_internal_1.it('should load stylesheets referenced by external stylesheets', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                programResourceLoaderSpy(resourceLoader, {
                    'package:some/module/test.css': 'a@import "test2.css"',
                    'package:some/module/test2.css': 'b'
                });
                normalizer.normalizeExternalStylesheets(compileTemplateMetadata({
                    template: '',
                    templateUrl: '',
                    styleUrls: ['package:some/module/test.css']
                }))
                    .then(function (template) {
                    testing_internal_1.expect(template.externalStylesheets.length).toBe(2);
                    testing_internal_1.expect(template.externalStylesheets[0]).toEqual(new compile_metadata_1.CompileStylesheetMetadata({
                        moduleUrl: 'package:some/module/test.css',
                        styles: ['a'],
                        styleUrls: ['package:some/module/test2.css']
                    }));
                    testing_internal_1.expect(template.externalStylesheets[1]).toEqual(new compile_metadata_1.CompileStylesheetMetadata({
                        moduleUrl: 'package:some/module/test2.css',
                        styles: ['b'],
                        styleUrls: []
                    }));
                    async.done();
                });
            }));
        });
        testing_internal_1.describe('caching', function () {
            testing_internal_1.it('should work for templateUrl', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, directive_normalizer_1.DirectiveNormalizer, resource_loader_1.ResourceLoader], function (async, normalizer, resourceLoader) {
                resourceLoader.expect('package:some/module/cmp.html', 'a');
                var prenormMeta = {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    templateUrl: 'cmp.html',
                };
                Promise
                    .all([
                    normalizeTemplateOnly(normalizer, prenormMeta),
                    normalizeTemplateOnly(normalizer, prenormMeta)
                ])
                    .then(function (templates) {
                    testing_internal_1.expect(templates[0].template).toEqual('a');
                    testing_internal_1.expect(templates[1].template).toEqual('a');
                    async.done();
                });
                resourceLoader.flush();
            }));
        });
        testing_internal_1.describe('normalizeLoadedTemplate', function () {
            testing_internal_1.it('should store the viewEncapsulation in the result', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var viewEncapsulation = view_1.ViewEncapsulation.Native;
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: viewEncapsulation,
                    styles: [],
                    styleUrls: []
                }, '', 'package:some/module/');
                testing_internal_1.expect(template.encapsulation).toBe(viewEncapsulation);
            }));
            testing_internal_1.it('should keep the template as html', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, 'a', 'package:some/module/');
                testing_internal_1.expect(template.template).toEqual('a');
            }));
            testing_internal_1.it('should collect ngContent', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<ng-content select="a"></ng-content>', 'package:some/module/');
                testing_internal_1.expect(template.ngContentSelectors).toEqual(['a']);
            }));
            testing_internal_1.it('should normalize ngContent wildcard selector', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<ng-content></ng-content><ng-content select></ng-content><ng-content select="*"></ng-content>', 'package:some/module/');
                testing_internal_1.expect(template.ngContentSelectors).toEqual(['*', '*', '*']);
            }));
            testing_internal_1.it('should collect top level styles in the template', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<style>a</style>', 'package:some/module/');
                testing_internal_1.expect(template.styles).toEqual(['a']);
            }));
            testing_internal_1.it('should collect styles inside in elements', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<div><style>a</style></div>', 'package:some/module/');
                testing_internal_1.expect(template.styles).toEqual(['a']);
            }));
            testing_internal_1.it('should collect styleUrls in the template', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<link rel="stylesheet" href="aUrl">', 'package:some/module/');
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/aUrl']);
            }));
            testing_internal_1.it('should collect styleUrls in elements', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<div><link rel="stylesheet" href="aUrl"></div>', 'package:some/module/');
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/aUrl']);
            }));
            testing_internal_1.it('should ignore link elements with non stylesheet rel attribute', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<link href="b" rel="a">', 'package:some/module/');
                testing_internal_1.expect(template.styleUrls).toEqual([]);
            }));
            testing_internal_1.it('should ignore link elements with absolute urls but non package: scheme', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<link href="http://some/external.css" rel="stylesheet">', 'package:some/module/');
                testing_internal_1.expect(template.styleUrls).toEqual([]);
            }));
            testing_internal_1.it('should extract @import style urls into styleAbsUrl', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: ['@import "test.css";'],
                    styleUrls: []
                }, '', 'package:some/module/id');
                testing_internal_1.expect(template.styles).toEqual(['']);
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            testing_internal_1.it('should not resolve relative urls in inline styles', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: ['.foo{background-image: url(\'double.jpg\');'],
                    styleUrls: []
                }, '', 'package:some/module/id');
                testing_internal_1.expect(template.styles).toEqual(['.foo{background-image: url(\'double.jpg\');']);
            }));
            testing_internal_1.it('should resolve relative style urls in styleUrls', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: ['test.css']
                }, '', 'package:some/module/id');
                testing_internal_1.expect(template.styles).toEqual([]);
                testing_internal_1.expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            testing_internal_1.it('should resolve relative style urls in styleUrls with http directive url', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_HTTP_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: ['test.css']
                }, '', 'http://some/module/id');
                testing_internal_1.expect(template.styles).toEqual([]);
                testing_internal_1.expect(template.styleUrls).toEqual(['http://some/module/test.css']);
            }));
            testing_internal_1.it('should normalize ViewEncapsulation.Emulated to ViewEncapsulation.None if there are no styles nor stylesheets', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: view_1.ViewEncapsulation.Emulated,
                    styles: [],
                    styleUrls: []
                }, '', 'package:some/module/id');
                testing_internal_1.expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.None);
            }));
            testing_internal_1.it('should ignore ng-content in elements with ngNonBindable', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<div ngNonBindable><ng-content select="a"></ng-content></div>', 'package:some/module/');
                testing_internal_1.expect(template.ngContentSelectors).toEqual([]);
            }));
            testing_internal_1.it('should still collect <style> in elements with ngNonBindable', testing_internal_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeLoadedTemplate(normalizer, {
                    ngModuleType: null,
                    componentType: SomeComp,
                    moduleUrl: SOME_MODULE_URL,
                    encapsulation: null,
                    styles: [],
                    styleUrls: []
                }, '<div ngNonBindable><style>div {color:red}</style></div>', 'package:some/module/');
                testing_internal_1.expect(template.styles).toEqual(['div {color:red}']);
            }));
        });
    });
}
exports.main = main;
function programResourceLoaderSpy(spy, results) {
    spy.spy('get').and.callFake(function (url) {
        var result = results[url];
        if (result) {
            return Promise.resolve(result);
        }
        else {
            return Promise.reject("Unknown mock url " + url);
        }
    });
}
var SomeComp = (function () {
    function SomeComp() {
    }
    return SomeComp;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvZGlyZWN0aXZlX25vcm1hbGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLDJFQUF5SjtBQUN6Six1REFBNEQ7QUFDNUQsbUZBQStFO0FBQy9FLHlFQUFxRTtBQUVyRSw2RUFBb0Y7QUFDcEYsd0RBQWtFO0FBQ2xFLGlEQUE4QztBQUM5QywrRUFBd0g7QUFFeEgsb0NBQXdDO0FBRXhDLGlDQUEwQztBQUUxQyxJQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQztBQUNuRCxJQUFNLG9CQUFvQixHQUFHLHlCQUF5QixDQUFDO0FBRXZELDJCQUEyQixVQUErQixFQUFFLENBUTNEO0lBQ0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxZQUFZLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO1FBQ3pDLGFBQWEsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDM0MsU0FBUyxFQUFFLGtCQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxRQUFRLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ2pDLFdBQVcsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDdkMsTUFBTSxFQUFFLGtCQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM3QixTQUFTLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ25DLGFBQWEsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDM0MsYUFBYSxFQUFFLGtCQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUMzQyxVQUFVLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsVUFB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