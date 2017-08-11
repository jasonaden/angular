"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
var dom_element_schema_registry_1 = require("@angular/compiler/src/schema/dom_element_schema_registry");
var element_schema_registry_1 = require("@angular/compiler/src/schema/element_schema_registry");
var template_ast_1 = require("@angular/compiler/src/template_parser/template_ast");
var template_parser_1 = require("@angular/compiler/src/template_parser/template_parser");
var test_bindings_1 = require("@angular/compiler/testing/src/test_bindings");
var core_1 = require("@angular/core");
var console_1 = require("@angular/core/src/console");
var testing_1 = require("@angular/core/testing");
var identifiers_1 = require("../../src/identifiers");
var interpolation_config_1 = require("../../src/ml_parser/interpolation_config");
var util_1 = require("../../src/util");
var testing_2 = require("../../testing");
var unparser_1 = require("../expression_parser/unparser");
var someModuleUrl = 'package:someModule';
var MOCK_SCHEMA_REGISTRY = [{
        provide: element_schema_registry_1.ElementSchemaRegistry,
        useValue: new testing_2.MockSchemaRegistry({ 'invalidProp': false }, { 'mappedAttr': 'mappedProp' }, { 'unknown': false, 'un-known': false }, ['onEvent'], ['onEvent']),
    }];
function createTypeMeta(_a) {
    var reference = _a.reference, diDeps = _a.diDeps;
    return { reference: reference, diDeps: diDeps || [], lifecycleHooks: [] };
}
function compileDirectiveMetadataCreate(_a) {
    var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
    return compile_metadata_1.CompileDirectiveMetadata.create({
        isHost: !!isHost,
        type: util_1.noUndefined(type),
        isComponent: !!isComponent,
        selector: util_1.noUndefined(selector),
        exportAs: util_1.noUndefined(exportAs),
        changeDetection: null,
        inputs: inputs || [],
        outputs: outputs || [],
        host: host || {},
        providers: providers || [],
        viewProviders: viewProviders || [],
        queries: queries || [],
        viewQueries: viewQueries || [],
        entryComponents: entryComponents || [],
        template: util_1.noUndefined(template),
        componentViewType: util_1.noUndefined(componentViewType),
        rendererType: util_1.noUndefined(rendererType),
        componentFactory: util_1.noUndefined(componentFactory),
    });
}
function compileTemplateMetadata(_a) {
    var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline;
    return new compile_metadata_1.CompileTemplateMetadata({
        encapsulation: util_1.noUndefined(encapsulation),
        template: util_1.noUndefined(template),
        templateUrl: util_1.noUndefined(templateUrl),
        styles: styles || [],
        styleUrls: styleUrls || [],
        externalStylesheets: externalStylesheets || [],
        animations: animations || [],
        ngContentSelectors: ngContentSelectors || [],
        interpolation: util_1.noUndefined(interpolation),
        isInline: !!isInline
    });
}
function main() {
    var ngIf;
    var parse;
    var console;
    function commonBeforeEach() {
        beforeEach(function () {
            console = new ArrayConsole();
            testing_1.TestBed.configureCompiler({
                providers: [
                    { provide: console_1.Console, useValue: console },
                ],
            });
        });
        beforeEach(testing_1.inject([template_parser_1.TemplateParser], function (parser) {
            var someAnimation = new compile_metadata_1.CompileAnimationEntryMetadata('someAnimation', []);
            var someTemplate = compileTemplateMetadata({ animations: [someAnimation] });
            var component = compileDirectiveMetadataCreate({
                isHost: false,
                selector: 'root',
                template: someTemplate,
                type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Root' } }),
                isComponent: true
            });
            ngIf = compileDirectiveMetadataCreate({
                selector: '[ngIf]',
                template: someTemplate,
                type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'NgIf' } }),
                inputs: ['ngIf']
            }).toSummary();
            parse =
                function (template, directives, pipes, schemas) {
                    if (pipes === void 0) { pipes = null; }
                    if (schemas === void 0) { schemas = []; }
                    if (pipes === null) {
                        pipes = [];
                    }
                    return parser.parse(component, template, directives, pipes, schemas, 'TestComp')
                        .template;
                };
        }));
    }
    describe('TemplateAstVisitor', function () {
        function expectVisitedNode(visitor, node) {
            expect(node.visit(visitor, null)).toEqual(node);
        }
        it('should visit NgContentAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.visitNgContent = function (ast, context) { return ast; };
                return class_1;
            }(NullVisitor)), new template_ast_1.NgContentAst(0, 0, null));
        });
        it('should visit EmbeddedTemplateAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.visitEmbeddedTemplate = function (ast, context) { return ast; };
                return class_2;
            }(NullVisitor)), new template_ast_1.EmbeddedTemplateAst([], [], [], [], [], [], false, [], [], 0, null));
        });
        it('should visit ElementAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_3.prototype.visitElement = function (ast, context) { return ast; };
                return class_3;
            }(NullVisitor)), new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], 0, null, null));
        });
        it('should visit RefererenceAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_4, _super);
                function class_4() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_4.prototype.visitReference = function (ast, context) { return ast; };
                return class_4;
            }(NullVisitor)), new template_ast_1.ReferenceAst('foo', null, null));
        });
        it('should visit VariableAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_5, _super);
                function class_5() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_5.prototype.visitVariable = function (ast, context) { return ast; };
                return class_5;
            }(NullVisitor)), new template_ast_1.VariableAst('foo', 'bar', null));
        });
        it('should visit BoundEventAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_6, _super);
                function class_6() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_6.prototype.visitEvent = function (ast, context) { return ast; };
                return class_6;
            }(NullVisitor)), new template_ast_1.BoundEventAst('foo', 'bar', 'goo', null, null));
        });
        it('should visit BoundElementPropertyAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_7, _super);
                function class_7() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_7.prototype.visitElementProperty = function (ast, context) { return ast; };
                return class_7;
            }(NullVisitor)), new template_ast_1.BoundElementPropertyAst('foo', null, null, null, 'bar', null));
        });
        it('should visit AttrAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_8, _super);
                function class_8() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_8.prototype.visitAttr = function (ast, context) { return ast; };
                return class_8;
            }(NullVisitor)), new template_ast_1.AttrAst('foo', 'bar', null));
        });
        it('should visit BoundTextAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_9, _super);
                function class_9() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_9.prototype.visitBoundText = function (ast, context) { return ast; };
                return class_9;
            }(NullVisitor)), new template_ast_1.BoundTextAst(null, 0, null));
        });
        it('should visit TextAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_10, _super);
                function class_10() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_10.prototype.visitText = function (ast, context) { return ast; };
                return class_10;
            }(NullVisitor)), new template_ast_1.TextAst('foo', 0, null));
        });
        it('should visit DirectiveAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_11, _super);
                function class_11() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_11.prototype.visitDirective = function (ast, context) { return ast; };
                return class_11;
            }(NullVisitor)), new template_ast_1.DirectiveAst(null, [], [], [], 0, null));
        });
        it('should visit DirectiveAst', function () {
            expectVisitedNode(new (function (_super) {
                __extends(class_12, _super);
                function class_12() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_12.prototype.visitDirectiveProperty = function (ast, context) { return ast; };
                return class_12;
            }(NullVisitor)), new template_ast_1.BoundDirectivePropertyAst('foo', 'bar', null, null));
        });
        it('should skip the typed call of a visitor if visit() returns a truthy value', function () {
            var visitor = new (function (_super) {
                __extends(class_13, _super);
                function class_13() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_13.prototype.visit = function (ast, context) { return true; };
                return class_13;
            }(ThrowingVisitor));
            var nodes = [
                new template_ast_1.NgContentAst(0, 0, null),
                new template_ast_1.EmbeddedTemplateAst([], [], [], [], [], [], false, [], [], 0, null),
                new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], 0, null, null),
                new template_ast_1.ReferenceAst('foo', null, null), new template_ast_1.VariableAst('foo', 'bar', null),
                new template_ast_1.BoundEventAst('foo', 'bar', 'goo', null, null),
                new template_ast_1.BoundElementPropertyAst('foo', null, null, null, 'bar', null),
                new template_ast_1.AttrAst('foo', 'bar', null), new template_ast_1.BoundTextAst(null, 0, null),
                new template_ast_1.TextAst('foo', 0, null), new template_ast_1.DirectiveAst(null, [], [], [], 0, null),
                new template_ast_1.BoundDirectivePropertyAst('foo', 'bar', null, null)
            ];
            var result = template_ast_1.templateVisitAll(visitor, nodes, null);
            expect(result).toEqual(new Array(nodes.length).fill(true));
        });
    });
    describe('TemplateParser template transform', function () {
        beforeEach(function () { testing_1.TestBed.configureCompiler({ providers: test_bindings_1.TEST_COMPILER_PROVIDERS }); });
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({
                providers: [{ provide: template_parser_1.TEMPLATE_TRANSFORMS, useValue: new FooAstTransformer(), multi: true }]
            });
        });
        describe('single', function () {
            commonBeforeEach();
            it('should transform TemplateAST', function () {
                expect(humanizeTplAst(parse('<div>', []))).toEqual([[template_ast_1.ElementAst, 'foo']]);
            });
        });
        describe('multiple', function () {
            beforeEach(function () {
                testing_1.TestBed.configureCompiler({
                    providers: [{ provide: template_parser_1.TEMPLATE_TRANSFORMS, useValue: new BarAstTransformer(), multi: true }]
                });
            });
            commonBeforeEach();
            it('should compose transformers', function () {
                expect(humanizeTplAst(parse('<div>', []))).toEqual([[template_ast_1.ElementAst, 'bar']]);
            });
        });
    });
    describe('TemplateParser Security', function () {
        // Semi-integration test to make sure TemplateParser properly sets the security context.
        // Uses the actual DomElementSchemaRegistry.
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({
                providers: [
                    test_bindings_1.TEST_COMPILER_PROVIDERS,
                    { provide: element_schema_registry_1.ElementSchemaRegistry, useClass: dom_element_schema_registry_1.DomElementSchemaRegistry, deps: [] }
                ]
            });
        });
        commonBeforeEach();
        describe('security context', function () {
            function secContext(tpl) {
                var ast = parse(tpl, []);
                var propBinding = ast[0].inputs[0];
                return propBinding.securityContext;
            }
            it('should set for properties', function () {
                expect(secContext('<div [title]="v">')).toBe(core_1.SecurityContext.NONE);
                expect(secContext('<div [innerHTML]="v">')).toBe(core_1.SecurityContext.HTML);
            });
            it('should set for property value bindings', function () { expect(secContext('<div innerHTML="{{v}}">')).toBe(core_1.SecurityContext.HTML); });
            it('should set for attributes', function () {
                expect(secContext('<a [attr.href]="v">')).toBe(core_1.SecurityContext.URL);
                // NB: attributes below need to change case.
                expect(secContext('<a [attr.innerHtml]="v">')).toBe(core_1.SecurityContext.HTML);
                expect(secContext('<a [attr.formaction]="v">')).toBe(core_1.SecurityContext.URL);
            });
            it('should set for style', function () {
                expect(secContext('<a [style.backgroundColor]="v">')).toBe(core_1.SecurityContext.STYLE);
            });
        });
    });
    describe('TemplateParser', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ providers: [test_bindings_1.TEST_COMPILER_PROVIDERS, MOCK_SCHEMA_REGISTRY] });
        });
        commonBeforeEach();
        describe('parse', function () {
            describe('nodes without bindings', function () {
                it('should parse text nodes', function () {
                    expect(humanizeTplAst(parse('a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
                it('should parse elements with attributes', function () {
                    expect(humanizeTplAst(parse('<div a=b>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'b']]);
                });
            });
            it('should parse ngContent', function () {
                var parsed = parse('<ng-content select="a"></ng-content>', []);
                expect(humanizeTplAst(parsed)).toEqual([[template_ast_1.NgContentAst]]);
            });
            it('should parse ngContent when it contains WS only', function () {
                var parsed = parse('<ng-content select="a">    \n   </ng-content>', []);
                expect(humanizeTplAst(parsed)).toEqual([[template_ast_1.NgContentAst]]);
            });
            it('should parse ngContent regardless the namespace', function () {
                var parsed = parse('<svg><ng-content></ng-content></svg>', []);
                expect(humanizeTplAst(parsed)).toEqual([
                    [template_ast_1.ElementAst, ':svg:svg'],
                    [template_ast_1.NgContentAst],
                ]);
            });
            it('should parse bound text nodes', function () {
                expect(humanizeTplAst(parse('{{a}}', []))).toEqual([[template_ast_1.BoundTextAst, '{{ a }}']]);
            });
            it('should parse with custom interpolation config', testing_1.inject([template_parser_1.TemplateParser], function (parser) {
                var component = compile_metadata_1.CompileDirectiveMetadata.create({
                    selector: 'test',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Test' } }),
                    isComponent: true,
                    template: new compile_metadata_1.CompileTemplateMetadata({
                        interpolation: ['{%', '%}'],
                        isInline: false,
                        animations: [],
                        template: null,
                        templateUrl: null,
                        ngContentSelectors: [],
                        externalStylesheets: [],
                        styleUrls: [],
                        styles: [],
                        encapsulation: null
                    }),
                    isHost: false,
                    exportAs: null,
                    changeDetection: null,
                    inputs: [],
                    outputs: [],
                    host: {},
                    providers: [],
                    viewProviders: [],
                    queries: [],
                    viewQueries: [],
                    entryComponents: [],
                    componentViewType: null,
                    rendererType: null,
                    componentFactory: null
                });
                expect(humanizeTplAst(parser.parse(component, '{%a%}', [], [], [], 'TestComp').template, { start: '{%', end: '%}' }))
                    .toEqual([[template_ast_1.BoundTextAst, '{% a %}']]);
            }));
            describe('bound properties', function () {
                it('should parse mixed case bound properties', function () {
                    expect(humanizeTplAst(parse('<div [someProp]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'someProp', 'v', null]
                    ]);
                });
                it('should parse dash case bound properties', function () {
                    expect(humanizeTplAst(parse('<div [some-prop]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'some-prop', 'v', null]
                    ]);
                });
                it('should parse dotted name bound properties', function () {
                    expect(humanizeTplAst(parse('<div [dot.name]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'dot.name', 'v', null]
                    ]);
                });
                it('should normalize property names via the element schema', function () {
                    expect(humanizeTplAst(parse('<div [mappedAttr]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'mappedProp', 'v', null]
                    ]);
                });
                it('should parse mixed case bound attributes', function () {
                    expect(humanizeTplAst(parse('<div [attr.someAttr]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Attribute, 'someAttr', 'v', null]
                    ]);
                });
                it('should parse and dash case bound classes', function () {
                    expect(humanizeTplAst(parse('<div [class.some-class]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Class, 'some-class', 'v', null]
                    ]);
                });
                it('should parse mixed case bound classes', function () {
                    expect(humanizeTplAst(parse('<div [class.someClass]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Class, 'someClass', 'v', null]
                    ]);
                });
                it('should parse mixed case bound styles', function () {
                    expect(humanizeTplAst(parse('<div [style.someStyle]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Style, 'someStyle', 'v', null]
                    ]);
                });
                describe('errors', function () {
                    it('should throw error when binding to an unknown property', function () {
                        expect(function () { return parse('<my-component [invalidProp]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'my-component'.\n1. If 'my-component' is an Angular component and it has 'invalidProp' input, then verify that it is part of this module.\n2. If 'my-component' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. (\"<my-component [ERROR ->][invalidProp]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an unknown property of ng-container', function () {
                        expect(function () { return parse('<ng-container [invalidProp]="bar"></ng-container>', []); })
                            .toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'ng-container'.\n1. If 'invalidProp' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component.\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component." +
                            " (\"<ng-container [ERROR ->][invalidProp]=\"bar\"></ng-container>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an unknown element w/o bindings', function () {
                        expect(function () { return parse('<unknown></unknown>', []); }).toThrowError("Template parse errors:\n'unknown' is not a known element:\n1. If 'unknown' is an Angular component, then verify that it is part of this module.\n2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. (\"[ERROR ->]<unknown></unknown>\"): TestComp@0:0");
                    });
                    it('should throw error when binding to an unknown custom element w/o bindings', function () {
                        expect(function () { return parse('<un-known></un-known>', []); }).toThrowError("Template parse errors:\n'un-known' is not a known element:\n1. If 'un-known' is an Angular component, then verify that it is part of this module.\n2. If 'un-known' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. (\"[ERROR ->]<un-known></un-known>\"): TestComp@0:0");
                    });
                    it('should throw error when binding to an invalid property', function () {
                        expect(function () { return parse('<my-component [onEvent]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nBinding to property 'onEvent' is disallowed for security reasons (\"<my-component [ERROR ->][onEvent]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an invalid attribute', function () {
                        expect(function () { return parse('<my-component [attr.onEvent]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nBinding to attribute 'onEvent' is disallowed for security reasons (\"<my-component [ERROR ->][attr.onEvent]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                });
                it('should parse bound properties via [...] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [prop]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'prop', 'v', null]
                    ]);
                });
                it('should parse bound properties via bind- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bind-prop="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'prop', 'v', null]
                    ]);
                });
                it('should parse bound properties via {{...}} and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div prop="{{v}}">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'prop', '{{ v }}', null]
                    ]);
                });
                it('should parse bound properties via bind-animate- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bind-animate-someAnimation="value2">', [], [], [])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [
                            template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Animation, 'someAnimation',
                            'value2', null
                        ]
                    ]);
                });
                it('should throw an error when parsing detects non-bound properties via @ that contain a value', function () {
                    expect(function () { parse('<div @someAnimation="value2">', [], [], []); })
                        .toThrowError(/Assigning animation triggers via @prop="exp" attributes with an expression is invalid. Use property bindings \(e.g. \[@prop\]="exp"\) or use an attribute without a value \(e.g. @prop\) instead. \("<div \[ERROR ->\]@someAnimation="value2">"\): TestComp@0:5/);
                });
                it('should not issue a warning when host attributes contain a valid property-bound animation trigger', function () {
                    var animationEntries = [new compile_metadata_1.CompileAnimationEntryMetadata('prop', [])];
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        template: compileTemplateMetadata({ animations: animationEntries }),
                        type: createTypeMeta({
                            reference: { filePath: someModuleUrl, name: 'DirA' },
                        }),
                        host: { '[@prop]': 'expr' }
                    }).toSummary();
                    humanizeTplAst(parse('<div></div>', [dirA]));
                    expect(console.warnings.length).toEqual(0);
                });
                it('should throw descriptive error when a host binding is not a string expression', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'broken',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '[class.foo]': null }
                    }).toSummary();
                    expect(function () { parse('<broken></broken>', [dirA]); })
                        .toThrowError("Template parse errors:\nValue of the host property binding \"class.foo\" needs to be a string representing an expression but got \"null\" (object) (\"[ERROR ->]<broken></broken>\"): TestComp@0:0, Directive DirA");
                });
                it('should throw descriptive error when a host event is not a string expression', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'broken',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '(click)': null }
                    }).toSummary();
                    expect(function () { parse('<broken></broken>', [dirA]); })
                        .toThrowError("Template parse errors:\nValue of the host listener \"click\" needs to be a string representing an expression but got \"null\" (object) (\"[ERROR ->]<broken></broken>\"): TestComp@0:0, Directive DirA");
                });
                it('should not issue a warning when an animation property is bound without an expression', function () {
                    humanizeTplAst(parse('<div @someAnimation>', [], [], []));
                    expect(console.warnings.length).toEqual(0);
                });
                it('should parse bound properties via [@] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [@someAnimation]="value2">', [], [], []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [
                            template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Animation, 'someAnimation', 'value2',
                            null
                        ]
                    ]);
                });
            });
            describe('events', function () {
                it('should parse bound events with a target', function () {
                    expect(humanizeTplAst(parse('<div (window:event)="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundEventAst, 'event', 'window', 'v'],
                    ]);
                });
                it('should report an error on empty expression', function () {
                    expect(function () { return parse('<div (event)="">', []); })
                        .toThrowError(/Empty expressions are not allowed/);
                    expect(function () { return parse('<div (event)="  ">', []); })
                        .toThrowError(/Empty expressions are not allowed/);
                });
                it('should parse bound events via (...) and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div (event)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'event', null, 'v']]);
                });
                it('should parse event names case sensitive', function () {
                    expect(humanizeTplAst(parse('<div (some-event)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'some-event', null, 'v']]);
                    expect(humanizeTplAst(parse('<div (someEvent)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'someEvent', null, 'v']]);
                });
                it('should parse bound events via on- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div on-event="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'event', null, 'v']]);
                });
                it('should allow events on explicit embedded templates that are emitted by a directive', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'template,ng-template',
                        outputs: ['e'],
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<template (e)="f"></template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.BoundEventAst, 'e', null, 'f'],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                    expect(humanizeTplAst(parse('<ng-template (e)="f"></ng-template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.BoundEventAst, 'e', null, 'f'],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
            });
            describe('bindon', function () {
                it('should parse bound events and properties via [(...)] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [(prop)]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'prop', 'v', null],
                        [template_ast_1.BoundEventAst, 'propChange', null, 'v = $event']
                    ]);
                });
                it('should parse bound events and properties via bindon- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bindon-prop="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'prop', 'v', null],
                        [template_ast_1.BoundEventAst, 'propChange', null, 'v = $event']
                    ]);
                });
            });
            describe('directives', function () {
                it('should order directives by the directives array in the View and match them only once', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    var dirB = compileDirectiveMetadataCreate({
                        selector: '[b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    var dirC = compileDirectiveMetadataCreate({
                        selector: '[c]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirC' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a c b a b>', [dirA, dirB, dirC]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', ''], [template_ast_1.AttrAst, 'c', ''], [template_ast_1.AttrAst, 'b', ''],
                        [template_ast_1.AttrAst, 'a', ''], [template_ast_1.AttrAst, 'b', ''], [template_ast_1.DirectiveAst, dirA], [template_ast_1.DirectiveAst, dirB],
                        [template_ast_1.DirectiveAst, dirC]
                    ]);
                });
                it('should parse directive dotted properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[dot.name]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['localName: dot.name'],
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [dot.name]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'localName', 'expr'],
                    ]);
                });
                it('should locate directives in property bindings', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a=b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    var dirB = compileDirectiveMetadataCreate({
                        selector: '[b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [a]="b">', [dirA, dirB]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'a', 'b', null],
                        [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
                it('should locate directives in inline templates', function () {
                    var dirTemplate = compileDirectiveMetadataCreate({
                        selector: 'template',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'onTemplate' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div *ngIf="cond">', [ngIf, dirTemplate]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'cond'],
                        [template_ast_1.DirectiveAst, dirTemplate],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should locate directives in event bindings', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div (a)="b">', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'a', null, 'b'], [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
                it('should parse directive host properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '[a]': 'expr' }
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'a', 'expr', null]
                    ]);
                });
                it('should parse directive host listeners', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '(a)': 'expr' }
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundEventAst, 'a', null, 'expr']
                    ]);
                });
                it('should parse directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['aProp']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [aProp]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'aProp', 'expr']
                    ]);
                });
                it('should parse renamed directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['b:a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [a]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundDirectivePropertyAst, 'b', 'expr']
                    ]);
                });
                it('should parse literal directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a="literal"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'literal'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'a', '"literal"']
                    ]);
                });
                it('should favor explicit bound properties over literal properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a="literal" [a]="\'literal2\'"></div>', [dirA])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'literal'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'a', '"literal2"']
                    ]);
                });
                it('should support optional directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
            });
            describe('providers', function () {
                var nextProviderId;
                function createToken(value) {
                    var token;
                    if (value.startsWith('type:')) {
                        var name_1 = value.substring(5);
                        token = { identifier: createTypeMeta({ reference: name_1 }) };
                    }
                    else {
                        token = { value: value };
                    }
                    return token;
                }
                function createDep(value) {
                    var isOptional = false;
                    if (value.startsWith('optional:')) {
                        isOptional = true;
                        value = value.substring(9);
                    }
                    var isSelf = false;
                    if (value.startsWith('self:')) {
                        isSelf = true;
                        value = value.substring(5);
                    }
                    var isHost = false;
                    if (value.startsWith('host:')) {
                        isHost = true;
                        value = value.substring(5);
                    }
                    return {
                        token: createToken(value),
                        isOptional: isOptional,
                        isSelf: isSelf,
                        isHost: isHost
                    };
                }
                function createProvider(token, _a) {
                    var _b = _a === void 0 ? {} : _a, _c = _b.multi, multi = _c === void 0 ? false : _c, _d = _b.deps, deps = _d === void 0 ? [] : _d;
                    var compileToken = createToken(token);
                    return {
                        token: compileToken,
                        multi: multi,
                        useClass: createTypeMeta({ reference: compile_metadata_1.tokenReference(compileToken) }),
                        deps: deps.map(createDep),
                        useExisting: undefined,
                        useFactory: undefined,
                        useValue: undefined
                    };
                }
                function createDir(selector, _a) {
                    var _b = _a === void 0 ? {} : _a, _c = _b.providers, providers = _c === void 0 ? null : _c, _d = _b.viewProviders, viewProviders = _d === void 0 ? null : _d, _e = _b.deps, deps = _e === void 0 ? [] : _e, _f = _b.queries, queries = _f === void 0 ? [] : _f;
                    var isComponent = !selector.startsWith('[');
                    return compileDirectiveMetadataCreate({
                        selector: selector,
                        type: createTypeMeta({
                            reference: selector,
                            diDeps: deps.map(createDep),
                        }),
                        isComponent: isComponent,
                        template: compileTemplateMetadata({ ngContentSelectors: [] }),
                        providers: providers,
                        viewProviders: viewProviders,
                        queries: queries.map(function (value) {
                            return {
                                selectors: [createToken(value)],
                                descendants: false,
                                first: false,
                                propertyName: 'test',
                                read: undefined
                            };
                        })
                    })
                        .toSummary();
                }
                beforeEach(function () { nextProviderId = 0; });
                it('should provide a component', function () {
                    var comp = createDir('my-comp');
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.Component);
                    expect(elAst.providers[0].providers[0].useClass).toBe(comp.type);
                });
                it('should provide a directive', function () {
                    var dirA = createDir('[dirA]');
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.Directive);
                    expect(elAst.providers[0].providers[0].useClass).toBe(dirA.type);
                });
                it('should use the public providers of a directive', function () {
                    var provider = createProvider('service');
                    var dirA = createDir('[dirA]', { providers: [provider] });
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.PublicService);
                    expect(elAst.providers[0].providers).toEqual([provider]);
                });
                it('should use the private providers of a component', function () {
                    var provider = createProvider('service');
                    var comp = createDir('my-comp', { viewProviders: [provider] });
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.PrivateService);
                    expect(elAst.providers[0].providers).toEqual([provider]);
                });
                it('should support multi providers', function () {
                    var provider0 = createProvider('service0', { multi: true });
                    var provider1 = createProvider('service1', { multi: true });
                    var provider2 = createProvider('service0', { multi: true });
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1] });
                    var dirB = createDir('[dirB]', { providers: [provider2] });
                    var elAst = parse('<div dirA dirB>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[0].providers).toEqual([provider0, provider2]);
                    expect(elAst.providers[1].providers).toEqual([provider1]);
                });
                it('should overwrite non multi providers', function () {
                    var provider1 = createProvider('service0');
                    var provider2 = createProvider('service1');
                    var provider3 = createProvider('service0');
                    var dirA = createDir('[dirA]', { providers: [provider1, provider2] });
                    var dirB = createDir('[dirB]', { providers: [provider3] });
                    var elAst = parse('<div dirA dirB>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[0].providers).toEqual([provider3]);
                    expect(elAst.providers[1].providers).toEqual([provider2]);
                });
                it('should overwrite component providers by directive providers', function () {
                    var compProvider = createProvider('service0');
                    var dirProvider = createProvider('service0');
                    var comp = createDir('my-comp', { providers: [compProvider] });
                    var dirA = createDir('[dirA]', { providers: [dirProvider] });
                    var elAst = parse('<my-comp dirA>', [dirA, comp])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('should overwrite view providers by directive providers', function () {
                    var viewProvider = createProvider('service0');
                    var dirProvider = createProvider('service0');
                    var comp = createDir('my-comp', { viewProviders: [viewProvider] });
                    var dirA = createDir('[dirA]', { providers: [dirProvider] });
                    var elAst = parse('<my-comp dirA>', [dirA, comp])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('should overwrite directives by providers', function () {
                    var dirProvider = createProvider('type:my-comp');
                    var comp = createDir('my-comp', { providers: [dirProvider] });
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('if mixing multi and non multi providers', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service0', { multi: true });
                    var dirA = createDir('[dirA]', { providers: [provider0] });
                    var dirB = createDir('[dirB]', { providers: [provider1] });
                    expect(function () { return parse('<div dirA dirB>', [dirA, dirB]); })
                        .toThrowError("Template parse errors:\n" +
                        "Mixing multi and non multi provider is not possible for token service0 (\"[ERROR ->]<div dirA dirB>\"): TestComp@0:0");
                });
                it('should sort providers by their DI order, lazy providers first', function () {
                    var provider0 = createProvider('service0', { deps: ['type:[dir2]'] });
                    var provider1 = createProvider('service1');
                    var dir2 = createDir('[dir2]', { deps: ['service1'] });
                    var comp = createDir('my-comp', { providers: [provider0, provider1] });
                    var elAst = parse('<my-comp dir2>', [comp, dir2])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(comp.type);
                    expect(elAst.providers[2].providers).toEqual([provider1]);
                    expect(elAst.providers[3].providers[0].useClass).toEqual(dir2.type);
                    expect(elAst.providers[0].providers).toEqual([provider0]);
                });
                it('should sort directives by their DI order', function () {
                    var dir0 = createDir('[dir0]', { deps: ['type:my-comp'] });
                    var dir1 = createDir('[dir1]', { deps: ['type:[dir0]'] });
                    var dir2 = createDir('[dir2]', { deps: ['type:[dir1]'] });
                    var comp = createDir('my-comp');
                    var elAst = parse('<my-comp dir2 dir0 dir1>', [comp, dir2, dir0, dir1])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.directives[0].directive).toBe(comp);
                    expect(elAst.directives[1].directive).toBe(dir0);
                    expect(elAst.directives[2].directive).toBe(dir1);
                    expect(elAst.directives[3].directive).toBe(dir2);
                });
                it('should mark directives and dependencies of directives as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1], deps: ['service0'] });
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers).toEqual([provider0]);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should mark dependencies on parent elements as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1] });
                    var dirB = createDir('[dirB]', { deps: ['service0'] });
                    var elAst = parse('<div dirA><div dirB></div></div>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers).toEqual([provider0]);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should mark queried providers as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1], queries: ['service0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers).toEqual([provider0]);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should not mark dependencies across embedded views as eager', function () {
                    var provider0 = createProvider('service0');
                    var dirA = createDir('[dirA]', { providers: [provider0] });
                    var dirB = createDir('[dirB]', { deps: ['service0'] });
                    var elAst = parse('<div dirA><div *ngIf dirB></div></div>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider0]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should report missing @Self() deps as errors', function () {
                    var dirA = createDir('[dirA]', { deps: ['self:provider0'] });
                    expect(function () { return parse('<div dirA></div>', [dirA]); })
                        .toThrowError('Template parse errors:\nNo provider for provider0 ("[ERROR ->]<div dirA></div>"): TestComp@0:0');
                });
                it('should change missing @Self() that are optional to nulls', function () {
                    var dirA = createDir('[dirA]', { deps: ['optional:self:provider0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers[0].providers[0].deps[0].isValue).toBe(true);
                    expect(elAst.providers[0].providers[0].deps[0].value).toBe(null);
                });
                it('should report missing @Host() deps as errors', function () {
                    var dirA = createDir('[dirA]', { deps: ['host:provider0'] });
                    expect(function () { return parse('<div dirA></div>', [dirA]); })
                        .toThrowError('Template parse errors:\nNo provider for provider0 ("[ERROR ->]<div dirA></div>"): TestComp@0:0');
                });
                it('should change missing @Host() that are optional to nulls', function () {
                    var dirA = createDir('[dirA]', { deps: ['optional:host:provider0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers[0].providers[0].deps[0].isValue).toBe(true);
                    expect(elAst.providers[0].providers[0].deps[0].value).toBe(null);
                });
            });
            describe('references', function () {
                it('should parse references via #... and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div #a>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should parse references via ref-... and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div ref-a>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should parse camel case references', function () {
                    expect(humanizeTplAst(parse('<div ref-someA>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'someA', null]]);
                });
                it('should assign references with empty value to the element', function () {
                    expect(humanizeTplAst(parse('<div #a></div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should assign references to directives via exportAs', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        exportAs: 'dirA'
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a #a="dirA"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.AttrAst, 'a', ''],
                        [template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForReference(dirA.type.reference)],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
                it('should report references with values that dont match a directive as errors', function () {
                    expect(function () { return parse('<div #a="dirA"></div>', []); }).toThrowError("Template parse errors:\nThere is no directive with \"exportAs\" set to \"dirA\" (\"<div [ERROR ->]#a=\"dirA\"></div>\"): TestComp@0:5");
                });
                it('should report invalid reference names', function () {
                    expect(function () { return parse('<div #a-b></div>', []); }).toThrowError("Template parse errors:\n\"-\" is not allowed in reference names (\"<div [ERROR ->]#a-b></div>\"): TestComp@0:5");
                });
                it('should report variables as errors', function () {
                    expect(function () { return parse('<div let-a></div>', []); }).toThrowError("Template parse errors:\n\"let-\" is only supported on template elements. (\"<div [ERROR ->]let-a></div>\"): TestComp@0:5");
                });
                it('should report duplicate reference names', function () {
                    expect(function () { return parse('<div #a></div><div #a></div>', []); })
                        .toThrowError("Template parse errors:\nReference \"#a\" is defined several times (\"<div #a></div><div [ERROR ->]#a></div>\"): TestComp@0:19");
                });
                it('should not throw error when there is same reference name in different templates', function () {
                    expect(function () { return parse('<div #a><template #a><span>OK</span></template></div>', []); })
                        .not.toThrowError();
                    expect(function () { return parse('<div #a><ng-template #a><span>OK</span></ng-template></div>', []); })
                        .not.toThrowError();
                });
                it('should assign references with empty value to components', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        isComponent: true,
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        exportAs: 'dirA',
                        template: compileTemplateMetadata({ ngContentSelectors: [] })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a #a></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.AttrAst, 'a', ''],
                        [template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForReference(dirA.type.reference)],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
                it('should not locate directives in references', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div ref-a>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]
                    ]);
                });
            });
            describe('explicit templates', function () {
                var reflector;
                beforeEach(function () { reflector = new compiler_1.JitReflector(); });
                it('should create embedded templates for <ng-template> elements', function () {
                    expect(humanizeTplAst(parse('<template></template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst]]);
                    expect(humanizeTplAst(parse('<TEMPLATE></TEMPLATE>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst]]);
                    expect(humanizeTplAst(parse('<ng-template></ng-template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst]]);
                });
                it('should create embedded templates for <ng-template> elements regardless the namespace', function () {
                    expect(humanizeTplAst(parse('<svg><template></template></svg>', []))).toEqual([
                        [template_ast_1.ElementAst, ':svg:svg'],
                        [template_ast_1.EmbeddedTemplateAst],
                    ]);
                    expect(humanizeTplAst(parse('<svg><ng-template></ng-template></svg>', []))).toEqual([
                        [template_ast_1.ElementAst, ':svg:svg'],
                        [template_ast_1.EmbeddedTemplateAst],
                    ]);
                });
                it('should support references via #...', function () {
                    expect(humanizeTplAst(parse('<template #a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ],
                    ]);
                    expect(humanizeTplAst(parse('<ng-template #a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ],
                    ]);
                });
                it('should support references via ref-...', function () {
                    expect(humanizeTplAst(parse('<template ref-a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ]
                    ]);
                    expect(humanizeTplAst(parse('<ng-template ref-a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ]
                    ]);
                });
                it('should parse variables via let-...', function () {
                    expect(humanizeTplAst(parse('<template let-a="b">', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                    expect(humanizeTplAst(parse('<ng-template let-a="b">', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                });
                it('should not locate directives in variables', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<template let-a="b"></template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                    expect(humanizeTplAst(parse('<ng-template let-a="b"></ng-template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                });
            });
            describe('inline templates', function () {
                it('should wrap the element into an EmbeddedTemplateAST', function () {
                    expect(humanizeTplAst(parse('<div template>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should wrap the element with data-template attribute into an EmbeddedTemplateAST ', function () {
                    expect(humanizeTplAst(parse('<div data-template>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should parse bound properties', function () {
                    expect(humanizeTplAst(parse('<div template="ngIf test">', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'test'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should report an error on variables declared with #', function () {
                    expect(function () { return humanizeTplAst(parse('<div *ngIf="#a=b">', [])); })
                        .toThrowError(/Parser Error: Unexpected token # at column 1/);
                });
                it('should parse variables via let ...', function () {
                    var targetAst = [
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                        [template_ast_1.ElementAst, 'div'],
                    ];
                    expect(humanizeTplAst(parse('<div *ngIf="let a=b">', []))).toEqual(targetAst);
                    expect(humanizeTplAst(parse('<div data-*ngIf="let a=b">', []))).toEqual(targetAst);
                });
                it('should parse variables via as ...', function () {
                    var targetAst = [
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'local', 'ngIf'],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'expr'],
                        [template_ast_1.ElementAst, 'div'],
                    ];
                    expect(humanizeTplAst(parse('<div *ngIf="expr as local">', [ngIf]))).toEqual(targetAst);
                });
                describe('directives', function () {
                    it('should locate directives in property bindings', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a=b]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                            inputs: ['a']
                        }).toSummary();
                        var dirB = compileDirectiveMetadataCreate({
                            selector: '[b]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<div template="a b" b>', [dirA, dirB]))).toEqual([
                            [template_ast_1.EmbeddedTemplateAst], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundDirectivePropertyAst, 'a', 'b'],
                            [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'b', ''], [template_ast_1.DirectiveAst, dirB]
                        ]);
                    });
                    it('should not locate directives in variables', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<div template="let a=b">', [dirA]))).toEqual([
                            [template_ast_1.EmbeddedTemplateAst], [template_ast_1.VariableAst, 'a', 'b'], [template_ast_1.ElementAst, 'div']
                        ]);
                    });
                    it('should not locate directives in references', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<div ref-a>', [dirA]))).toEqual([
                            [template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]
                        ]);
                    });
                });
                it('should work with *... and use the attribute name as property binding name', function () {
                    expect(humanizeTplAst(parse('<div *ngIf="test">', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'test'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                    // https://github.com/angular/angular/issues/13800
                    expect(humanizeTplAst(parse('<div *ngIf="-1">', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', '0 - 1'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should work with *... and empty value', function () {
                    expect(humanizeTplAst(parse('<div *ngIf>', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'null'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
            });
        });
        describe('content projection', function () {
            var compCounter;
            beforeEach(function () { compCounter = 0; });
            function createComp(selector, ngContentSelectors) {
                return compileDirectiveMetadataCreate({
                    selector: selector,
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: "SomeComp" + compCounter++ } }),
                    template: compileTemplateMetadata({ ngContentSelectors: ngContentSelectors })
                })
                    .toSummary();
            }
            function createDir(selector) {
                return compileDirectiveMetadataCreate({
                    selector: selector,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: "SomeDir" + compCounter++ } })
                })
                    .toSummary();
            }
            describe('project text nodes', function () {
                it('should project text nodes with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div>hello</div>', [createComp('div', ['*'])])))
                        .toEqual([
                        ['div', null],
                        ['#text(hello)', 0],
                    ]);
                });
            });
            describe('project elements', function () {
                it('should project elements with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><span></span></div>', [
                        createComp('div', ['*'])
                    ]))).toEqual([['div', null], ['span', 0]]);
                });
                it('should project elements with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><a x></a><b></b></div>', [createComp('div', ['a[x]'])])))
                        .toEqual([
                        ['div', null],
                        ['a', 0],
                        ['b', null],
                    ]);
                });
            });
            describe('embedded templates', function () {
                it('should project embedded templates with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><template></template><ng-template></ng-template></div>', [createComp('div', ['*'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 0],
                        ['template', 0],
                    ]);
                });
                it('should project embedded templates with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-template x></ng-template><ng-template></ng-template></div>', [createComp('div', ['ng-template[x]'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 0],
                        ['template', null],
                    ]);
                });
            });
            describe('ng-content', function () {
                it('should project ng-content with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content></ng-content></div>', [
                        createComp('div', ['*'])
                    ]))).toEqual([['div', null], ['ng-content', 0]]);
                });
                it('should project ng-content with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content x></ng-content><ng-content></ng-content></div>', [createComp('div', ['ng-content[x]'])])))
                        .toEqual([['div', null], ['ng-content', 0], ['ng-content', null]]);
                });
            });
            it('should project into the first matching ng-content', function () {
                expect(humanizeContentProjection(parse('<div>hello<b></b><a></a></div>', [
                    createComp('div', ['a', 'b', '*'])
                ]))).toEqual([['div', null], ['#text(hello)', 2], ['b', 1], ['a', 0]]);
            });
            it('should project into wildcard ng-content last', function () {
                expect(humanizeContentProjection(parse('<div>hello<a></a></div>', [
                    createComp('div', ['*', 'a'])
                ]))).toEqual([['div', null], ['#text(hello)', 0], ['a', 1]]);
            });
            it('should only project direct child nodes', function () {
                expect(humanizeContentProjection(parse('<div><span><a></a></span><a></a></div>', [
                    createComp('div', ['a'])
                ]))).toEqual([['div', null], ['span', null], ['a', null], ['a', 0]]);
            });
            it('should project nodes of nested components', function () {
                expect(humanizeContentProjection(parse('<a><b>hello</b></a>', [
                    createComp('a', ['*']), createComp('b', ['*'])
                ]))).toEqual([['a', null], ['b', 0], ['#text(hello)', 0]]);
            });
            it('should project children of components with ngNonBindable', function () {
                expect(humanizeContentProjection(parse('<div ngNonBindable>{{hello}}<span></span></div>', [
                    createComp('div', ['*'])
                ]))).toEqual([['div', null], ['#text({{hello}})', 0], ['span', 0]]);
            });
            it('should match the element when there is an inline template', function () {
                expect(humanizeContentProjection(parse('<div><b *ngIf="cond"></b></div>', [
                    createComp('div', ['a', 'b']), ngIf
                ]))).toEqual([['div', null], ['template', 1], ['b', null]]);
            });
            describe('ngProjectAs', function () {
                it('should override elements', function () {
                    expect(humanizeContentProjection(parse('<div><a ngProjectAs="b"></a></div>', [
                        createComp('div', ['a', 'b'])
                    ]))).toEqual([['div', null], ['a', 1]]);
                });
                it('should override <ng-content>', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content ngProjectAs="b"></ng-content></div>', [createComp('div', ['ng-content', 'b'])])))
                        .toEqual([['div', null], ['ng-content', 1]]);
                });
                it('should override <ng-template>', function () {
                    expect(humanizeContentProjection(parse('<div><template ngProjectAs="b"></template><ng-template ngProjectAs="b"></ng-template></div>', [createComp('div', ['template', 'b'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 1],
                        ['template', 1],
                    ]);
                });
                it('should override inline templates', function () {
                    expect(humanizeContentProjection(parse('<div><a *ngIf="cond" ngProjectAs="b"></a></div>', [createComp('div', ['a', 'b']), ngIf])))
                        .toEqual([
                        ['div', null],
                        ['template', 1],
                        ['a', null],
                    ]);
                });
            });
            it('should support other directives before the component', function () {
                expect(humanizeContentProjection(parse('<div>hello</div>', [
                    createDir('div'), createComp('div', ['*'])
                ]))).toEqual([['div', null], ['#text(hello)', 0]]);
            });
        });
        describe('splitClasses', function () {
            it('should keep an empty class', function () { expect(template_parser_1.splitClasses('a')).toEqual(['a']); });
            it('should split 2 classes', function () { expect(template_parser_1.splitClasses('a b')).toEqual(['a', 'b']); });
            it('should trim classes', function () { expect(template_parser_1.splitClasses(' a  b ')).toEqual(['a', 'b']); });
        });
        describe('error cases', function () {
            it('should report when ng-content has non WS content', function () {
                expect(function () { return parse('<ng-content>content</ng-content>', []); })
                    .toThrowError("Template parse errors:\n" +
                    "<ng-content> element cannot have content. (\"[ERROR ->]<ng-content>content</ng-content>\"): TestComp@0:0");
            });
            it('should treat *attr on a template element as valid', function () {
                expect(function () { return parse('<template *ngIf>', []); }).not.toThrowError();
                expect(function () { return parse('<ng-template *ngIf>', []); }).not.toThrowError();
            });
            it('should treat template attribute on a template element as valid', function () {
                expect(function () { return parse('<template template="ngIf">', []); }).not.toThrowError();
                expect(function () { return parse('<ng-template template="ngIf">', []); }).not.toThrowError();
            });
            it('should report when multiple *attrs are used on the same element', function () {
                expect(function () { return parse('<div *ngIf *ngFor>', []); }).toThrowError("Template parse errors:\nCan't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with * (\"<div *ngIf [ERROR ->]*ngFor>\"): TestComp@0:11");
            });
            it('should report when mix of template and *attrs are used on the same element', function () {
                expect(function () { return parse('<span template="ngIf" *ngFor>', []); })
                    .toThrowError("Template parse errors:\nCan't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with * (\"<span template=\"ngIf\" [ERROR ->]*ngFor>\"): TestComp@0:22");
            });
            it('should report invalid property names', function () {
                expect(function () { return parse('<div [invalidProp]></div>', []); }).toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'div'. (\"<div [ERROR ->][invalidProp]></div>\"): TestComp@0:5");
            });
            it('should report invalid host property names', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    host: { '[invalidProp]': 'someProp' }
                }).toSummary();
                expect(function () { return parse('<div></div>', [dirA]); }).toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'div'. (\"[ERROR ->]<div></div>\"): TestComp@0:0, Directive DirA");
            });
            it('should report errors in expressions', function () {
                expect(function () { return parse('<div [prop]="a b"></div>', []); }).toThrowError("Template parse errors:\nParser Error: Unexpected token 'b' at column 3 in [a b] in TestComp@0:5 (\"<div [ERROR ->][prop]=\"a b\"></div>\"): TestComp@0:5");
            });
            it('should not throw on invalid property names if the property is used by a directive', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    inputs: ['invalidProp']
                }).toSummary();
                expect(function () { return parse('<div [invalid-prop]></div>', [dirA]); }).not.toThrow();
            });
            it('should not allow more than 1 component per element', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                var dirB = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<div>', [dirB, dirA]); })
                    .toThrowError("Template parse errors:\n" +
                    "More than one component matched on this element.\n" +
                    "Make sure that only one component's selector can match a given element.\n" +
                    "Conflicting components: DirB,DirA (\"[ERROR ->]<div>\"): TestComp@0:0");
            });
            it('should not allow components or element bindings nor dom events on explicit embedded templates', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<template [a]="b" (e)="f"></template>', [dirA]); })
                    .toThrowError("Template parse errors:\nEvent binding e not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"<template [a]=\"b\" [ERROR ->](e)=\"f\"></template>\"): TestComp@0:18\nComponents on an embedded template: DirA (\"[ERROR ->]<template [a]=\"b\" (e)=\"f\"></template>\"): TestComp@0:0\nProperty binding a not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"[ERROR ->]<template [a]=\"b\" (e)=\"f\"></template>\"): TestComp@0:0");
                expect(function () { return parse('<ng-template [a]="b" (e)="f"></ng-template>', [dirA]); })
                    .toThrowError("Template parse errors:\nEvent binding e not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"<ng-template [a]=\"b\" [ERROR ->](e)=\"f\"></ng-template>\"): TestComp@0:21\nComponents on an embedded template: DirA (\"[ERROR ->]<ng-template [a]=\"b\" (e)=\"f\"></ng-template>\"): TestComp@0:0\nProperty binding a not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"[ERROR ->]<ng-template [a]=\"b\" (e)=\"f\"></ng-template>\"): TestComp@0:0");
            });
            it('should not allow components or element bindings on inline embedded templates', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<div *a="b"></div>', [dirA]); }).toThrowError("Template parse errors:\nComponents on an embedded template: DirA (\"[ERROR ->]<div *a=\"b\"></div>\"): TestComp@0:0\nProperty binding a not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"[ERROR ->]<div *a=\"b\"></div>\"): TestComp@0:0");
            });
        });
        describe('ignore elements', function () {
            it('should ignore <script> elements', function () {
                expect(humanizeTplAst(parse('<script></script>a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <style> elements', function () {
                expect(humanizeTplAst(parse('<style></style>a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
            });
            describe('<link rel="stylesheet">', function () {
                it('should keep <link rel="stylesheet"> elements if they have an absolute non package: url', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="http://someurl">a', [])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'rel', 'stylesheet'],
                        [template_ast_1.AttrAst, 'href', 'http://someurl'], [template_ast_1.TextAst, 'a']
                    ]);
                });
                it('should keep <link rel="stylesheet"> elements if they have no uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet">a', []))).toEqual([[template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'rel', 'stylesheet'], [template_ast_1.TextAst, 'a']]);
                    expect(humanizeTplAst(parse('<link REL="stylesheet">a', []))).toEqual([[template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'REL', 'stylesheet'], [template_ast_1.TextAst, 'a']]);
                });
                it('should ignore <link rel="stylesheet"> elements if they have a relative uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="./other.css">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                    expect(humanizeTplAst(parse('<link rel="stylesheet" HREF="./other.css">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
                it('should ignore <link rel="stylesheet"> elements if they have a package: uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="package:somePackage">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
            });
            it('should ignore bindings on children of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable>{{b}}</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, '{{b}}']]);
            });
            it('should keep nested children of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><span>{{b}}</span></div>', []))).toEqual([
                    [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.ElementAst, 'span'],
                    [template_ast_1.TextAst, '{{b}}']
                ]);
            });
            it('should ignore <script> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><script></script>a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <style> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><style></style>a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <link rel="stylesheet"> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><link rel="stylesheet">a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should convert <ng-content> elements into regular elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><ng-content></ng-content>a</div>', [])))
                    .toEqual([
                    [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.ElementAst, 'ng-content'],
                    [template_ast_1.TextAst, 'a']
                ]);
            });
        });
        describe('source spans', function () {
            it('should support ng-content', function () {
                var parsed = parse('<ng-content select="a">', []);
                expect(humanizeTplAstSourceSpans(parsed)).toEqual([
                    [template_ast_1.NgContentAst, '<ng-content select="a">']
                ]);
            });
            it('should support embedded template', function () {
                expect(humanizeTplAstSourceSpans(parse('<template></template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst, '<template>']]);
                expect(humanizeTplAstSourceSpans(parse('<ng-template></ng-template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst, '<ng-template>']]);
            });
            it('should support element and attributes', function () {
                expect(humanizeTplAstSourceSpans(parse('<div key=value>', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div key=value>'], [template_ast_1.AttrAst, 'key', 'value', 'key=value']
                ]);
            });
            it('should support references', function () {
                expect(humanizeTplAstSourceSpans(parse('<div #a></div>', []))).toEqual([[template_ast_1.ElementAst, 'div', '<div #a>'], [template_ast_1.ReferenceAst, 'a', null, '#a']]);
            });
            it('should support variables', function () {
                expect(humanizeTplAstSourceSpans(parse('<template let-a="b"></template>', []))).toEqual([
                    [template_ast_1.EmbeddedTemplateAst, '<template let-a="b">'],
                    [template_ast_1.VariableAst, 'a', 'b', 'let-a="b"'],
                ]);
                expect(humanizeTplAstSourceSpans(parse('<ng-template let-a="b"></ng-template>', [])))
                    .toEqual([
                    [template_ast_1.EmbeddedTemplateAst, '<ng-template let-a="b">'],
                    [template_ast_1.VariableAst, 'a', 'b', 'let-a="b"'],
                ]);
            });
            it('should support events', function () {
                expect(humanizeTplAstSourceSpans(parse('<div (window:event)="v">', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div (window:event)="v">'],
                    [template_ast_1.BoundEventAst, 'event', 'window', 'v', '(window:event)="v"']
                ]);
            });
            it('should support element property', function () {
                expect(humanizeTplAstSourceSpans(parse('<div [someProp]="v">', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div [someProp]="v">'],
                    [
                        template_ast_1.BoundElementPropertyAst, template_ast_1.PropertyBindingType.Property, 'someProp', 'v', null,
                        '[someProp]="v"'
                    ]
                ]);
            });
            it('should support bound text', function () {
                expect(humanizeTplAstSourceSpans(parse('{{a}}', []))).toEqual([[template_ast_1.BoundTextAst, '{{ a }}', '{{a}}']]);
            });
            it('should support text nodes', function () {
                expect(humanizeTplAstSourceSpans(parse('a', []))).toEqual([[template_ast_1.TextAst, 'a', 'a']]);
            });
            it('should support directive', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                }).toSummary();
                var comp = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'ZComp' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<div a>', [dirA, comp]))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div a>'], [template_ast_1.AttrAst, 'a', '', 'a'], [template_ast_1.DirectiveAst, dirA, '<div a>'],
                    [template_ast_1.DirectiveAst, comp, '<div a>']
                ]);
            });
            it('should support directive in namespace', function () {
                var tagSel = compileDirectiveMetadataCreate({
                    selector: 'circle',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'elDir' } })
                }).toSummary();
                var attrSel = compileDirectiveMetadataCreate({
                    selector: '[href]',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'attrDir' } })
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<svg><circle /><use xlink:href="Port" /></svg>', [tagSel, attrSel])))
                    .toEqual([
                    [template_ast_1.ElementAst, ':svg:svg', '<svg>'],
                    [template_ast_1.ElementAst, ':svg:circle', '<circle />'],
                    [template_ast_1.DirectiveAst, tagSel, '<circle />'],
                    [template_ast_1.ElementAst, ':svg:use', '<use xlink:href="Port" />'],
                    [template_ast_1.AttrAst, ':xlink:href', 'Port', 'xlink:href="Port"'],
                    [template_ast_1.DirectiveAst, attrSel, '<use xlink:href="Port" />'],
                ]);
            });
            it('should support directive property', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    inputs: ['aProp']
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<div [aProp]="foo"></div>', [dirA]))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div [aProp]="foo">'], [template_ast_1.DirectiveAst, dirA, '<div [aProp]="foo">'],
                    [template_ast_1.BoundDirectivePropertyAst, 'aProp', 'foo', '[aProp]="foo"']
                ]);
            });
            it('should support endSourceSpan for elements', function () {
                var tagSel = compileDirectiveMetadataCreate({
                    selector: 'circle',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'elDir' } })
                }).toSummary();
                var result = parse('<circle></circle>', [tagSel]);
                var circle = result[0];
                expect(circle.endSourceSpan).toBeDefined();
                expect(circle.endSourceSpan.start.offset).toBe(8);
                expect(circle.endSourceSpan.end.offset).toBe(17);
            });
            it('should report undefined for endSourceSpan for elements without an end-tag', function () {
                var ulSel = compileDirectiveMetadataCreate({
                    selector: 'ul',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'ulDir' } })
                }).toSummary();
                var liSel = compileDirectiveMetadataCreate({
                    selector: 'li',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'liDir' } })
                }).toSummary();
                var result = parse('<ul><li><li></ul>', [ulSel, liSel]);
                var ul = result[0];
                var li = ul.children[0];
                expect(li.endSourceSpan).toBe(null);
            });
        });
        describe('pipes', function () {
            it('should allow pipes that have been defined as dependencies', function () {
                var testPipe = new compile_metadata_1.CompilePipeMetadata({
                    name: 'test',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    pure: false
                }).toSummary();
                expect(function () { return parse('{{a | test}}', [], [testPipe]); }).not.toThrow();
            });
            it('should report pipes as error that have not been defined as dependencies', function () {
                expect(function () { return parse('{{a | test}}', []); }).toThrowError("Template parse errors:\nThe pipe 'test' could not be found (\"{{[ERROR ->]a | test}}\"): TestComp@0:2");
            });
        });
        describe('ICU messages', function () {
            it('should expand plural messages', function () {
                var shortForm = '{ count, plural, =0 {small} many {big} }';
                var expandedForm = '<ng-container [ngPlural]="count">' +
                    '<ng-template ngPluralCase="=0">small</ng-template>' +
                    '<ng-template ngPluralCase="many">big</ng-template>' +
                    '</ng-container>';
                expect(humanizeTplAst(parse(shortForm, []))).toEqual(humanizeTplAst(parse(expandedForm, [])));
            });
            it('should expand select messages', function () {
                var shortForm = '{ sex, select, female {foo} other {bar} }';
                var expandedForm = '<ng-container [ngSwitch]="sex">' +
                    '<ng-template ngSwitchCase="female">foo</ng-template>' +
                    '<ng-template ngSwitchDefault>bar</ng-template>' +
                    '</ng-container>';
                expect(humanizeTplAst(parse(shortForm, []))).toEqual(humanizeTplAst(parse(expandedForm, [])));
            });
            it('should be possible to escape ICU messages', function () {
                var escapedForm = 'escaped {{ "{" }}  }';
                expect(humanizeTplAst(parse(escapedForm, []))).toEqual([
                    [template_ast_1.BoundTextAst, 'escaped {{ "{" }}  }'],
                ]);
            });
        });
    });
    describe('Template Parser - opt-out `<template>` support', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({
                providers: [{
                        provide: compiler_1.CompilerConfig,
                        useValue: new compiler_1.CompilerConfig({ enableLegacyTemplate: false }),
                    }],
            });
        });
        commonBeforeEach();
        it('should support * directives', function () {
            expect(humanizeTplAst(parse('<div *ngIf>', [ngIf]))).toEqual([
                [template_ast_1.EmbeddedTemplateAst],
                [template_ast_1.DirectiveAst, ngIf],
                [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'null'],
                [template_ast_1.ElementAst, 'div'],
            ]);
        });
        it('should support <ng-template>', function () {
            expect(humanizeTplAst(parse('<ng-template>', []))).toEqual([
                [template_ast_1.EmbeddedTemplateAst],
            ]);
        });
        it('should treat <template> as a regular tag', function () {
            expect(humanizeTplAst(parse('<template>', []))).toEqual([
                [template_ast_1.ElementAst, 'template'],
            ]);
        });
        it('should not special case the template attribute', function () {
            expect(humanizeTplAst(parse('<p template="ngFor">', []))).toEqual([
                [template_ast_1.ElementAst, 'p'],
                [template_ast_1.AttrAst, 'template', 'ngFor'],
            ]);
        });
    });
}
exports.main = main;
function humanizeTplAst(templateAsts, interpolationConfig) {
    var humanizer = new TemplateHumanizer(false, interpolationConfig);
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
function humanizeTplAstSourceSpans(templateAsts, interpolationConfig) {
    var humanizer = new TemplateHumanizer(true, interpolationConfig);
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
var TemplateHumanizer = (function () {
    function TemplateHumanizer(includeSourceSpan, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        this.includeSourceSpan = includeSourceSpan;
        this.interpolationConfig = interpolationConfig;
        this.result = [];
    }
    ;
    TemplateHumanizer.prototype.visitNgContent = function (ast, context) {
        var res = [template_ast_1.NgContentAst];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitEmbeddedTemplate = function (ast, context) {
        var res = [template_ast_1.EmbeddedTemplateAst];
        this.result.push(this._appendContext(ast, res));
        template_ast_1.templateVisitAll(this, ast.attrs);
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.references);
        template_ast_1.templateVisitAll(this, ast.variables);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateHumanizer.prototype.visitElement = function (ast, context) {
        var res = [template_ast_1.ElementAst, ast.name];
        this.result.push(this._appendContext(ast, res));
        template_ast_1.templateVisitAll(this, ast.attrs);
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.references);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateHumanizer.prototype.visitReference = function (ast, context) {
        var res = [template_ast_1.ReferenceAst, ast.name, ast.value];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitVariable = function (ast, context) {
        var res = [template_ast_1.VariableAst, ast.name, ast.value];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitEvent = function (ast, context) {
        var res = [template_ast_1.BoundEventAst, ast.name, ast.target, unparser_1.unparse(ast.handler, this.interpolationConfig)];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitElementProperty = function (ast, context) {
        var res = [
            template_ast_1.BoundElementPropertyAst, ast.type, ast.name, unparser_1.unparse(ast.value, this.interpolationConfig),
            ast.unit
        ];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitAttr = function (ast, context) {
        var res = [template_ast_1.AttrAst, ast.name, ast.value];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitBoundText = function (ast, context) {
        var res = [template_ast_1.BoundTextAst, unparser_1.unparse(ast.value, this.interpolationConfig)];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitText = function (ast, context) {
        var res = [template_ast_1.TextAst, ast.value];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitDirective = function (ast, context) {
        var res = [template_ast_1.DirectiveAst, ast.directive];
        this.result.push(this._appendContext(ast, res));
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.hostProperties);
        template_ast_1.templateVisitAll(this, ast.hostEvents);
        return null;
    };
    TemplateHumanizer.prototype.visitDirectiveProperty = function (ast, context) {
        var res = [
            template_ast_1.BoundDirectivePropertyAst, ast.directiveName, unparser_1.unparse(ast.value, this.interpolationConfig)
        ];
        this.result.push(this._appendContext(ast, res));
        return null;
    };
    TemplateHumanizer.prototype._appendContext = function (ast, input) {
        if (!this.includeSourceSpan)
            return input;
        input.push(ast.sourceSpan.toString());
        return input;
    };
    return TemplateHumanizer;
}());
function humanizeContentProjection(templateAsts) {
    var humanizer = new TemplateContentProjectionHumanizer();
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
var TemplateContentProjectionHumanizer = (function () {
    function TemplateContentProjectionHumanizer() {
        this.result = [];
    }
    TemplateContentProjectionHumanizer.prototype.visitNgContent = function (ast, context) {
        this.result.push(['ng-content', ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitEmbeddedTemplate = function (ast, context) {
        this.result.push(['template', ast.ngContentIndex]);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitElement = function (ast, context) {
        this.result.push([ast.name, ast.ngContentIndex]);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitReference = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitVariable = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitEvent = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitElementProperty = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitAttr = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitBoundText = function (ast, context) {
        this.result.push(["#text(" + unparser_1.unparse(ast.value) + ")", ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitText = function (ast, context) {
        this.result.push(["#text(" + ast.value + ")", ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitDirective = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    return TemplateContentProjectionHumanizer;
}());
var ThrowingVisitor = (function () {
    function ThrowingVisitor() {
    }
    ThrowingVisitor.prototype.visitNgContent = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitElement = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitReference = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitVariable = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitEvent = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitElementProperty = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitAttr = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitBoundText = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitText = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitDirective = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitDirectiveProperty = function (ast, context) {
        throw 'not implemented';
    };
    return ThrowingVisitor;
}());
var FooAstTransformer = (function (_super) {
    __extends(FooAstTransformer, _super);
    function FooAstTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FooAstTransformer.prototype.visitElement = function (ast, context) {
        if (ast.name != 'div')
            return ast;
        return new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], ast.ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    return FooAstTransformer;
}(ThrowingVisitor));
var BarAstTransformer = (function (_super) {
    __extends(BarAstTransformer, _super);
    function BarAstTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarAstTransformer.prototype.visitElement = function (ast, context) {
        if (ast.name != 'foo')
            return ast;
        return new template_ast_1.ElementAst('bar', [], [], [], [], [], [], false, [], [], ast.ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    return BarAstTransformer;
}(FooAstTransformer));
var NullVisitor = (function () {
    function NullVisitor() {
    }
    NullVisitor.prototype.visitNgContent = function (ast, context) { };
    NullVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { };
    NullVisitor.prototype.visitElement = function (ast, context) { };
    NullVisitor.prototype.visitReference = function (ast, context) { };
    NullVisitor.prototype.visitVariable = function (ast, context) { };
    NullVisitor.prototype.visitEvent = function (ast, context) { };
    NullVisitor.prototype.visitElementProperty = function (ast, context) { };
    NullVisitor.prototype.visitAttr = function (ast, context) { };
    NullVisitor.prototype.visitBoundText = function (ast, context) { };
    NullVisitor.prototype.visitText = function (ast, context) { };
    NullVisitor.prototype.visitDirective = function (ast, context) { };
    NullVisitor.prototype.visitDirectiveProperty = function (ast, context) { };
    return NullVisitor;
}());
var ArrayConsole = (function () {
    function ArrayConsole() {
        this.logs = [];
        this.warnings = [];
    }
    ArrayConsole.prototype.log = function (msg) { this.logs.push(msg); };
    ArrayConsole.prototype.warn = function (msg) { this.warnings.push(msg); };
    return ArrayConsole;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcGFyc2VyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9wYXJzZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBK0c7QUFDL0csMkVBQTJUO0FBQzNULHdHQUFrRztBQUNsRyxnR0FBMkY7QUFDM0YsbUZBQXNWO0FBQ3RWLHlGQUF3SDtBQUN4SCw2RUFBb0Y7QUFDcEYsc0NBQTJJO0FBQzNJLHFEQUFrRDtBQUNsRCxpREFBc0Q7QUFHdEQscURBQTRHO0FBQzVHLGlGQUEyRztBQUMzRyx1Q0FBMkM7QUFDM0MseUNBQWlEO0FBQ2pELDBEQUFzRDtBQUV0RCxJQUFNLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztBQUUzQyxJQUFNLG9CQUFvQixHQUFHLENBQUM7UUFDNUIsT0FBTyxFQUFFLCtDQUFxQjtRQUM5QixRQUFRLEVBQUUsSUFBSSw0QkFBa0IsQ0FDNUIsRUFBQyxhQUFhLEVBQUUsS0FBSyxFQUFDLEVBQUUsRUFBQyxZQUFZLEVBQUUsWUFBWSxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsRUFDM0YsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlCLENBQUMsQ0FBQztBQUVILHdCQUF3QixFQUFxRDtRQUFwRCx3QkFBUyxFQUFFLGtCQUFNO0lBRXhDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sSUFBSSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCx3Q0FDSSxFQXFCQztRQXJCQSxrQkFBTSxFQUFFLGNBQUksRUFBRSw0QkFBVyxFQUFFLHNCQUFRLEVBQUUs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QyxVQUFVLENBQUMsQ0FBQztvQkFDN0MsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM3QyxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDdEUsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDdkQsSUFBTSxLQUFLLEdBQ0ssS0FBSyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxP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