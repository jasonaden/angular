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
var core_1 = require("@angular/core");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
describe('StaticReflector', function () {
    var noContext;
    var host;
    var symbolResolver;
    var reflector;
    function init(testData, decorators, errorRecorder, collectorOptions) {
        if (testData === void 0) { testData = DEFAULT_TEST_DATA; }
        if (decorators === void 0) { decorators = []; }
        var symbolCache = new compiler_1.StaticSymbolCache();
        host = new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost(testData, collectorOptions);
        var summaryResolver = new static_symbol_resolver_spec_1.MockSummaryResolver([]);
        spyOn(summaryResolver, 'isLibraryFile').and.returnValue(false);
        symbolResolver = new compiler_1.StaticSymbolResolver(host, symbolCache, summaryResolver, errorRecorder);
        reflector = new compiler_1.StaticReflector(summaryResolver, symbolResolver, decorators, [], errorRecorder);
        noContext = reflector.getStaticSymbol('', '');
    }
    beforeEach(function () { return init(); });
    function simplify(context, value) {
        return reflector.simplify(context, value);
    }
    it('should get annotations for NgFor', function () {
        var NgFor = reflector.findDeclaration('@angular/common/src/directives/ng_for', 'NgFor');
        var annotations = reflector.annotations(NgFor);
        expect(annotations.length).toEqual(1);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('[ngFor][ngForOf]');
        expect(annotation.inputs).toEqual(['ngForTrackBy', 'ngForOf', 'ngForTemplate']);
    });
    it('should get constructor for NgFor', function () {
        var NgFor = reflector.findDeclaration('@angular/common/src/directives/ng_for', 'NgFor');
        var ViewContainerRef = reflector.findDeclaration('@angular/core', 'ViewContainerRef');
        var TemplateRef = reflector.findDeclaration('@angular/core', 'TemplateRef');
        var IterableDiffers = reflector.findDeclaration('@angular/core', 'IterableDiffers');
        var ChangeDetectorRef = reflector.findDeclaration('@angular/core', 'ChangeDetectorRef');
        var parameters = reflector.parameters(NgFor);
        expect(parameters).toEqual([
            [ViewContainerRef], [TemplateRef], [IterableDiffers], [ChangeDetectorRef]
        ]);
    });
    it('should get annotations for HeroDetailComponent', function () {
        var HeroDetailComponent = reflector.findDeclaration('src/app/hero-detail.component', 'HeroDetailComponent');
        var annotations = reflector.annotations(HeroDetailComponent);
        expect(annotations.length).toEqual(1);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('my-hero-detail');
        expect(annotation.animations).toEqual([core_1.trigger('myAnimation', [
                core_1.state('state1', core_1.style({ 'background': 'white' })),
                core_1.transition('* => *', core_1.sequence([core_1.group([core_1.animate('1s 0.5s', core_1.keyframes([core_1.style({ 'background': 'blue' }), core_1.style({ 'background': 'red' })]))])]))
            ])]);
    });
    it('should get and empty annotation list for an unknown class', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var annotations = reflector.annotations(UnknownClass);
        expect(annotations).toEqual([]);
    });
    it('should get and empty annotation list for a symbol with null value', function () {
        init({
            '/tmp/test.ts': "\n        export var x = null;\n      "
        });
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/test.ts', 'x'));
        expect(annotations).toEqual([]);
    });
    it('should get propMetadata for HeroDetailComponent', function () {
        var HeroDetailComponent = reflector.findDeclaration('src/app/hero-detail.component', 'HeroDetailComponent');
        var props = reflector.propMetadata(HeroDetailComponent);
        expect(props['hero']).toBeTruthy();
        expect(props['onMouseOver']).toEqual([new core_1.HostListener('mouseover', ['$event'])]);
    });
    it('should get an empty object from propMetadata for an unknown class', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var properties = reflector.propMetadata(UnknownClass);
        expect(properties).toEqual({});
    });
    it('should get empty parameters list for an unknown class ', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var parameters = reflector.parameters(UnknownClass);
        expect(parameters).toEqual([]);
    });
    it('should provide context for errors reported by the collector', function () {
        var SomeClass = reflector.findDeclaration('src/error-reporting', 'SomeClass');
        expect(function () { return reflector.annotations(SomeClass); })
            .toThrow(new Error('Error encountered resolving symbol values statically. A reasonable error message (position 13:34 in the original .ts file), resolving symbol ErrorSym in /tmp/src/error-references.d.ts, resolving symbol Link2 in /tmp/src/error-references.d.ts, resolving symbol Link1 in /tmp/src/error-references.d.ts, resolving symbol SomeClass in /tmp/src/error-reporting.d.ts, resolving symbol SomeClass in /tmp/src/error-reporting.d.ts'));
    });
    it('should simplify primitive into itself', function () {
        expect(simplify(noContext, 1)).toBe(1);
        expect(simplify(noContext, true)).toBe(true);
        expect(simplify(noContext, 'some value')).toBe('some value');
    });
    it('should simplify a static symbol into itself', function () {
        var staticSymbol = reflector.getStaticSymbol('', '');
        expect(simplify(noContext, staticSymbol)).toBe(staticSymbol);
    });
    it('should simplify an array into a copy of the array', function () {
        expect(simplify(noContext, [1, 2, 3])).toEqual([1, 2, 3]);
    });
    it('should simplify an object to a copy of the object', function () {
        var expr = { a: 1, b: 2, c: 3 };
        expect(simplify(noContext, expr)).toEqual(expr);
    });
    it('should simplify &&', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: true, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: true, right: false })))
            .toBe(false);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: false, right: true })))
            .toBe(false);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: false, right: false })))
            .toBe(false);
    });
    it('should simplify ||', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: true, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: true, right: false })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: false, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: false, right: false })))
            .toBe(false);
    });
    it('should simplify &', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&', left: 0x22, right: 0x0F })))
            .toBe(0x22 & 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&', left: 0x22, right: 0xF0 })))
            .toBe(0x22 & 0xF0);
    });
    it('should simplify |', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0x0F })))
            .toBe(0x22 | 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0xF0 })))
            .toBe(0x22 | 0xF0);
    });
    it('should simplify ^', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0x0F })))
            .toBe(0x22 | 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0xF0 })))
            .toBe(0x22 | 0xF0);
    });
    it('should simplify ==', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '==', left: 0x22, right: 0x22 })))
            .toBe(0x22 == 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '==', left: 0x22, right: 0xF0 })))
            .toBe(0x22 == 0xF0);
    });
    it('should simplify !=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!=', left: 0x22, right: 0x22 })))
            .toBe(0x22 != 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!=', left: 0x22, right: 0xF0 })))
            .toBe(0x22 != 0xF0);
    });
    it('should simplify ===', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '===', left: 0x22, right: 0x22 })))
            .toBe(0x22 === 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '===', left: 0x22, right: 0xF0 })))
            .toBe(0x22 === 0xF0);
    });
    it('should simplify !==', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!==', left: 0x22, right: 0x22 })))
            .toBe(0x22 !== 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!==', left: 0x22, right: 0xF0 })))
            .toBe(0x22 !== 0xF0);
    });
    it('should simplify >', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 1, right: 1 })))
            .toBe(1 > 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 1, right: 0 })))
            .toBe(1 > 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 0, right: 1 })))
            .toBe(0 > 1);
    });
    it('should simplify >=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 1, right: 1 })))
            .toBe(1 >= 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 1, right: 0 })))
            .toBe(1 >= 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 0, right: 1 })))
            .toBe(0 >= 1);
    });
    it('should simplify <=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 1, right: 1 })))
            .toBe(1 <= 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 1, right: 0 })))
            .toBe(1 <= 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 0, right: 1 })))
            .toBe(0 <= 1);
    });
    it('should simplify <', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 1, right: 1 })))
            .toBe(1 < 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 1, right: 0 })))
            .toBe(1 < 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 0, right: 1 })))
            .toBe(0 < 1);
    });
    it('should simplify <<', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<<', left: 0x55, right: 2 })))
            .toBe(0x55 << 2);
    });
    it('should simplify >>', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>>', left: 0x55, right: 2 })))
            .toBe(0x55 >> 2);
    });
    it('should simplify +', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '+', left: 0x55, right: 2 })))
            .toBe(0x55 + 2);
    });
    it('should simplify -', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '-', left: 0x55, right: 2 })))
            .toBe(0x55 - 2);
    });
    it('should simplify *', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '*', left: 0x55, right: 2 })))
            .toBe(0x55 * 2);
    });
    it('should simplify /', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '/', left: 0x55, right: 2 })))
            .toBe(0x55 / 2);
    });
    it('should simplify %', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '%', left: 0x55, right: 2 })))
            .toBe(0x55 % 2);
    });
    it('should simplify prefix -', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '-', operand: 2 }))).toBe(-2);
    });
    it('should simplify prefix ~', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '~', operand: 2 }))).toBe(~2);
    });
    it('should simplify prefix !', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '!', operand: true }))).toBe(!true);
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '!', operand: false }))).toBe(!false);
    });
    it('should simplify an array index', function () {
        expect(simplify(noContext, ({ __symbolic: 'index', expression: [1, 2, 3], index: 2 }))).toBe(3);
    });
    it('should simplify an object index', function () {
        var expr = { __symbolic: 'select', expression: { a: 1, b: 2, c: 3 }, member: 'b' };
        expect(simplify(noContext, expr)).toBe(2);
    });
    it('should simplify a file reference', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', ''), reflector.getStaticSymbol('/src/extern.d.ts', 's')))
            .toEqual('s');
    });
    it('should simplify a non existing reference as a static symbol', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', ''), reflector.getStaticSymbol('/src/extern.d.ts', 'nonExisting')))
            .toEqual(reflector.getStaticSymbol('/src/extern.d.ts', 'nonExisting'));
    });
    it('should simplify a function reference as a static symbol', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', 'myFunction'), ({ __symbolic: 'function', parameters: ['a'], value: [] })))
            .toEqual(reflector.getStaticSymbol('/src/cases', 'myFunction'));
    });
    it('should simplify values initialized with a function call', function () {
        expect(simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'one')))
            .toEqual(['some-value']);
        expect(simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'three')))
            .toEqual(3);
    });
    it('should error on direct recursive calls', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'recursion')); })
            .toThrow(new Error('Recursion not supported, resolving symbol recursive in /tmp/src/function-recursive.d.ts, resolving symbol recursion in /tmp/src/function-reference.ts, resolving symbol  in /tmp/src/function-reference.ts'));
    });
    it('should throw a SyntaxError without stack trace when the required resource cannot be resolved', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'AppModule'), ({
            __symbolic: 'error',
            message: 'Could not resolve ./does-not-exist.component relative to /tmp/src/function-reference.ts'
        })); })
            .toThrowError('Error encountered resolving symbol values statically. Could not resolve ./does-not-exist.component relative to /tmp/src/function-reference.ts, resolving symbol AppModule in /tmp/src/function-reference.ts');
    });
    it('should record data about the error in the exception', function () {
        var threw = false;
        try {
            var metadata = host.getMetadataFor('/tmp/src/invalid-metadata.ts');
            expect(metadata).toBeDefined();
            var moduleMetadata = metadata[0]['metadata'];
            expect(moduleMetadata).toBeDefined();
            var classData = moduleMetadata['InvalidMetadata'];
            expect(classData).toBeDefined();
            simplify(reflector.getStaticSymbol('/tmp/src/invalid-metadata.ts', ''), classData.decorators[0]);
        }
        catch (e) {
            expect(e.fileName).toBe('/tmp/src/invalid-metadata.ts');
            threw = true;
        }
        expect(threw).toBe(true);
    });
    it('should error on indirect recursive calls', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'indirectRecursion')); })
            .toThrow(new Error('Recursion not supported, resolving symbol indirectRecursion2 in /tmp/src/function-recursive.d.ts, resolving symbol indirectRecursion1 in /tmp/src/function-recursive.d.ts, resolving symbol indirectRecursion in /tmp/src/function-reference.ts, resolving symbol  in /tmp/src/function-reference.ts'));
    });
    it('should simplify a spread expression', function () {
        expect(simplify(reflector.getStaticSymbol('/tmp/src/spread.ts', ''), reflector.getStaticSymbol('/tmp/src/spread.ts', 'spread')))
            .toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('should be able to get metadata for a class containing a custom decorator', function () {
        var props = reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/custom-decorator-reference.ts', 'Foo'));
        expect(props).toEqual({ foo: [] });
    });
    it('should read ctor parameters with forwardRef', function () {
        var src = '/tmp/src/forward-ref.ts';
        var dep = reflector.getStaticSymbol(src, 'Dep');
        var props = reflector.parameters(reflector.getStaticSymbol(src, 'Forward'));
        expect(props).toEqual([[dep, new core_1.Inject(dep)]]);
    });
    it('should report an error for invalid function calls', function () {
        expect(function () { return reflector.annotations(reflector.getStaticSymbol('/tmp/src/invalid-calls.ts', 'MyComponent')); })
            .toThrow(new Error("Error encountered resolving symbol values statically. Calling function 'someFunction', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol MyComponent in /tmp/src/invalid-calls.ts, resolving symbol MyComponent in /tmp/src/invalid-calls.ts"));
    });
    it('should be able to get metadata for a class containing a static method call', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual({ provider: 'a', useValue: 100 });
    });
    it('should be able to get metadata for a class containing a static field reference', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-field-reference.ts', 'Foo'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([{ provider: 'a', useValue: 'Some string' }]);
    });
    it('should be able to get the metadata for a class calling a method with a conditional expression', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyCondComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([
            [{ provider: 'a', useValue: '1' }], [{ provider: 'a', useValue: '2' }]
        ]);
    });
    it('should be able to get metadata for a class with nested method calls', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyFactoryComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual({
            provide: 'c',
            useFactory: reflector.getStaticSymbol('/tmp/src/static-method.ts', 'AnotherModule', ['someFactory'])
        });
    });
    it('should be able to get the metadata for a class calling a method with default parameters', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyDefaultsComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([['a', true, false]]);
    });
    it('should be able to get metadata with a reference to a static method', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-ref.ts', 'MethodReference'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers[0].useValue.members[0]).toEqual('staticMethod');
    });
    it('should be able to get metadata for a class calling a macro function', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/call-macro-function.ts', 'MyComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers.useValue).toBe(100);
    });
    it('should be able to get metadata for a class calling a nested macro function', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/call-macro-function.ts', 'MyComponentNested'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers.useValue.useValue).toBe(100);
    });
    // #13605
    it('should not throw on unknown decorators', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/app.component.ts';
        data[file] = "\n      import { Component } from '@angular/core';\n\n      export const enum TypeEnum {\n        type\n      }\n\n      export function MyValidationDecorator(p1: any, p2: any): any {\n        return null;\n      }\n\n      export function ValidationFunction(a1: any): any {\n        return null;\n      }\n\n      @Component({\n        selector: 'my-app',\n        template: \"<h1>Hello {{name}}</h1>\",\n      })\n      export class AppComponent  {\n        name = 'Angular';\n\n        @MyValidationDecorator( TypeEnum.type, ValidationFunction({option: 'value'}))\n        myClassProp: number;\n    }";
        init(data);
        var appComponent = reflector.getStaticSymbol(file, 'AppComponent');
        expect(function () { return reflector.propMetadata(appComponent); }).not.toThrow();
    });
    it('should not throw with an invalid extends', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n\n        function InvalidParent() {\n          return InvalidParent;\n        }\n\n        @Component({\n          selector: 'tmp',\n          template: '',\n        })\n        export class BadComponent extends InvalidParent() {\n\n        }\n      ";
        init(data);
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        expect(reflector.propMetadata(badComponent)).toEqual({});
        expect(reflector.parameters(badComponent)).toEqual([]);
        expect(reflector.hasLifecycleHook(badComponent, 'onDestroy')).toEqual(false);
    });
    it('should produce a annotation even if it contains errors', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'tmp',\n          template: () => {},\n          providers: [1, 2, (() => {}), 3, !(() => {}), 4, 5, (() => {}) + (() => {}), 6, 7]\n        })\n        export class BadComponent {\n\n        }\n      ";
        init(data, [], function () { }, { verboseInvalidExpression: true });
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        var annotations = reflector.annotations(badComponent);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('tmp');
        expect(annotation.template).toBeUndefined();
        expect(annotation.providers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it('should ignore unresolved calls', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n        import {unknown} from 'unresolved';\n\n        @Component({\n          selector: 'tmp',\n          template: () => {},\n          providers: [triggers()]\n        })\n        export class BadComponent {\n\n        }\n      ";
        init(data, [], function () { }, { verboseInvalidExpression: true });
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        var annotations = reflector.annotations(badComponent);
        var annotation = annotations[0];
        expect(annotation.providers).toEqual([]);
    });
    // #15424
    it('should be able to inject a ctor parameter with a @Inject and a type expression', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Injectable, Inject} from '@angular/core';\n\n        @Injectable()\n        export class SomeClass {\n          constructor (@Inject('some-token') a: {a: string, b: string}) {}\n        }\n      ";
        init(data);
        var someClass = reflector.getStaticSymbol(file, 'SomeClass');
        var parameters = reflector.parameters(someClass);
        expect(parameters.toString()).toEqual('@Inject');
    });
    it('should reject a ctor parameter without a @Inject and a type exprssion', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Injectable} from '@angular/core';\n\n        @Injectable()\n        export class SomeClass {\n          constructor (a: {a: string, b: string}) {}\n        }\n      ";
        var error = undefined;
        init(data, [], function (err, filePath) {
            expect(error).toBeUndefined();
            error = err;
        });
        var someClass = reflector.getStaticSymbol(file, 'SomeClass');
        expect(reflector.parameters(someClass)).toEqual([[]]);
        expect(error).toBeUndefined();
    });
    describe('inheritance', function () {
        var ClassDecorator = (function () {
            function ClassDecorator(value) {
                this.value = value;
            }
            return ClassDecorator;
        }());
        var ParamDecorator = (function () {
            function ParamDecorator(value) {
                this.value = value;
            }
            return ParamDecorator;
        }());
        var PropDecorator = (function () {
            function PropDecorator(value) {
                this.value = value;
            }
            return PropDecorator;
        }());
        function initWithDecorator(testData) {
            testData['/tmp/src/decorator.ts'] = "\n            export function ClassDecorator(): any {}\n            export function ParamDecorator(): any {}\n            export function PropDecorator(): any {}\n      ";
            init(testData, [
                { filePath: '/tmp/src/decorator.ts', name: 'ClassDecorator', ctor: ClassDecorator },
                { filePath: '/tmp/src/decorator.ts', name: 'ParamDecorator', ctor: ParamDecorator },
                { filePath: '/tmp/src/decorator.ts', name: 'PropDecorator', ctor: PropDecorator }
            ]);
        }
        it('should inherit annotations', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {ClassDecorator} from './decorator';\n\n            @ClassDecorator('parent')\n            export class Parent {}\n\n            @ClassDecorator('child')\n            export class Child extends Parent {}\n\n            export class ChildNoDecorators extends Parent {}\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual([new ClassDecorator('parent')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([new ClassDecorator('parent'), new ClassDecorator('child')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildNoDecorators')))
                .toEqual([new ClassDecorator('parent')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual([]);
        });
        it('should inherit parameters', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {ParamDecorator} from './decorator';\n\n            export class A {}\n            export class B {}\n            export class C {}\n\n            export class Parent {\n              constructor(@ParamDecorator('a') a: A, @ParamDecorator('b') b: B) {}\n            }\n\n            export class Child extends Parent {}\n\n            export class ChildWithCtor extends Parent {\n              constructor(@ParamDecorator('c') c: C) {}\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual([
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'A'), new ParamDecorator('a')],
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'B'), new ParamDecorator('b')]
            ]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child'))).toEqual([
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'A'), new ParamDecorator('a')],
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'B'), new ParamDecorator('b')]
            ]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildWithCtor')))
                .toEqual([[reflector.getStaticSymbol('/tmp/src/main.ts', 'C'), new ParamDecorator('c')]]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual([]);
        });
        it('should inherit property metadata', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {PropDecorator} from './decorator';\n\n            export class A {}\n            export class B {}\n            export class C {}\n\n            export class Parent {\n              @PropDecorator('a')\n              a: A;\n              @PropDecorator('b1')\n              b: B;\n            }\n\n            export class Child extends Parent {\n              @PropDecorator('b2')\n              b: B;\n              @PropDecorator('c')\n              c: C;\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual({
                'a': [new PropDecorator('a')],
                'b': [new PropDecorator('b1')],
            });
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual({
                'a': [new PropDecorator('a')],
                'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                'c': [new PropDecorator('c')]
            });
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual({});
        });
        it('should inherit lifecycle hooks', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export class Parent {\n              hook1() {}\n              hook2() {}\n            }\n\n            export class Child extends Parent {\n              hook2() {}\n              hook3() {}\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            function hooks(symbol, names) {
                return names.map(function (name) { return reflector.hasLifecycleHook(symbol, name); });
            }
            // Check that metadata for Parent was not changed!
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([true, true, false]);
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([true, true, true]);
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([false, false, false]);
        });
        it('should allow inheritance from expressions', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export function metaClass() { return null; };\n            export class Child extends metaClass() {}\n          "
            });
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([]);
        });
        it('should allow inheritance from functions', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export let ctor: {new(): T} = function() { return null; }\n            export class Child extends ctor {}\n          "
            });
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([]);
        });
        it('should support constructor parameters with @Inject and an interface type', function () {
            var data = Object.create(DEFAULT_TEST_DATA);
            var file = '/tmp/src/inject_interface.ts';
            data[file] = "\n        import {Injectable, Inject} from '@angular/core';\n        import {F} from './f';\n\n        export interface InjectedInterface {\n\n        }\n\n        export class Token {}\n\n        @Injectable()\n        export class SomeClass {\n          constructor (@Inject(Token) injected: InjectedInterface, t: Token, @Inject(Token) f: F) {}\n        }\n      ";
            init(data);
            expect(reflector.parameters(reflector.getStaticSymbol(file, 'SomeClass'))[0].length)
                .toEqual(1);
        });
    });
    describe('expression lowering', function () {
        it('should be able to accept a lambda in a reference location', function () {
            var data = Object.create(DEFAULT_TEST_DATA);
            var file = '/tmp/src/my_component.ts';
            data[file] = "\n        import {Component, InjectionToken} from '@angular/core';\n\n        export const myLambda = () => [1, 2, 3];\n        export const NUMBERS = new InjectionToken<number[]>();\n\n        @Component({\n          template: '<div>{{name}}</div>',\n          providers: [{provide: NUMBERS, useFactory: myLambda}]\n        })\n        export class MyComponent {\n          name = 'Some name';\n        }\n      ";
            init(data);
            expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
                .providers[0]
                .useFactory)
                .toBe(reflector.getStaticSymbol(file, 'myLambda'));
        });
    });
});
var DEFAULT_TEST_DATA = {
    '/tmp/@angular/common/src/forms-deprecated/directives.d.ts': [{
            '__symbolic': 'module',
            'version': 3,
            'metadata': {
                'FORM_DIRECTIVES': [
                    {
                        '__symbolic': 'reference',
                        'name': 'NgFor',
                        'module': '@angular/common/src/directives/ng_for'
                    }
                ]
            }
        }],
    '/tmp/@angular/common/src/directives/ng_for.d.ts': {
        '__symbolic': 'module',
        'version': 3,
        'metadata': {
            'NgFor': {
                '__symbolic': 'class',
                'decorators': [
                    {
                        '__symbolic': 'call',
                        'expression': {
                            '__symbolic': 'reference',
                            'name': 'Directive',
                            'module': '@angular/core'
                        },
                        'arguments': [
                            {
                                'selector': '[ngFor][ngForOf]',
                                'inputs': ['ngForTrackBy', 'ngForOf', 'ngForTemplate']
                            }
                        ]
                    }
                ],
                'members': {
                    '__ctor__': [
                        {
                            '__symbolic': 'constructor',
                            'parameters': [
                                {
                                    '__symbolic': 'reference',
                                    'module': '@angular/core',
                                    'name': 'ViewContainerRef'
                                },
                                {
                                    '__symbolic': 'reference',
                                    'module': '@angular/core',
                                    'name': 'TemplateRef'
                                },
                                {
                                    '__symbolic': 'reference',
                                    'module': '@angular/core',
                                    'name': 'IterableDiffers'
                                },
                                {
                                    '__symbolic': 'reference',
                                    'module': '@angular/core',
                                    'name': 'ChangeDetectorRef'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    '/tmp/@angular/core/src/linker/view_container_ref.d.ts': { version: 3, 'metadata': { 'ViewContainerRef': { '__symbolic': 'class' } } },
    '/tmp/@angular/core/src/linker/template_ref.d.ts': { version: 3, 'module': './template_ref', 'metadata': { 'TemplateRef': { '__symbolic': 'class' } } },
    '/tmp/@angular/core/src/change_detection/differs/iterable_differs.d.ts': { version: 3, 'metadata': { 'IterableDiffers': { '__symbolic': 'class' } } },
    '/tmp/@angular/core/src/change_detection/change_detector_ref.d.ts': { version: 3, 'metadata': { 'ChangeDetectorRef': { '__symbolic': 'class' } } },
    '/tmp/src/app/hero-detail.component.d.ts': {
        '__symbolic': 'module',
        'version': 3,
        'metadata': {
            'HeroDetailComponent': {
                '__symbolic': 'class',
                'decorators': [
                    {
                        '__symbolic': 'call',
                        'expression': {
                            '__symbolic': 'reference',
                            'name': 'Component',
                            'module': '@angular/core'
                        },
                        'arguments': [
                            {
                                'selector': 'my-hero-detail',
                                'template': '\n  <div *ngIf="hero">\n    <h2>{{hero.name}} details!</h2>\n    <div><label>id: </label>{{hero.id}}</div>\n    <div>\n      <label>name: </label>\n      <input [(ngModel)]="hero.name" placeholder="name"/>\n    </div>\n  </div>\n',
                                'animations': [{
                                        '__symbolic': 'call',
                                        'expression': {
                                            '__symbolic': 'reference',
                                            'name': 'trigger',
                                            'module': '@angular/core'
                                        },
                                        'arguments': [
                                            'myAnimation',
                                            [{ '__symbolic': 'call',
                                                    'expression': {
                                                        '__symbolic': 'reference',
                                                        'name': 'state',
                                                        'module': '@angular/core'
                                                    },
                                                    'arguments': [
                                                        'state1',
                                                        { '__symbolic': 'call',
                                                            'expression': {
                                                                '__symbolic': 'reference',
                                                                'name': 'style',
                                                                'module': '@angular/core'
                                                            },
                                                            'arguments': [
                                                                { 'background': 'white' }
                                                            ]
                                                        }
                                                    ]
                                                }, {
                                                    '__symbolic': 'call',
                                                    'expression': {
                                                        '__symbolic': 'reference',
                                                        'name': 'transition',
                                                        'module': '@angular/core'
                                                    },
                                                    'arguments': [
                                                        '* => *',
                                                        {
                                                            '__symbolic': 'call',
                                                            'expression': {
                                                                '__symbolic': 'reference',
                                                                'name': 'sequence',
                                                                'module': '@angular/core'
                                                            },
                                                            'arguments': [[{ '__symbolic': 'call',
                                                                        'expression': {
                                                                            '__symbolic': 'reference',
                                                                            'name': 'group',
                                                                            'module': '@angular/core'
                                                                        },
                                                                        'arguments': [[{
                                                                                    '__symbolic': 'call',
                                                                                    'expression': {
                                                                                        '__symbolic': 'reference',
                                                                                        'name': 'animate',
                                                                                        'module': '@angular/core'
                                                                                    },
                                                                                    'arguments': [
                                                                                        '1s 0.5s',
                                                                                        { '__symbolic': 'call',
                                                                                            'expression': {
                                                                                                '__symbolic': 'reference',
                                                                                                'name': 'keyframes',
                                                                                                'module': '@angular/core'
                                                                                            },
                                                                                            'arguments': [[{ '__symbolic': 'call',
                                                                                                        'expression': {
                                                                                                            '__symbolic': 'reference',
                                                                                                            'name': 'style',
                                                                                                            'module': '@angular/core'
                                                                                                        },
                                                                                                        'arguments': [{ 'background': 'blue' }]
                                                                                                    }, {
                                                                                                        '__symbolic': 'call',
                                                                                                        'expression': {
                                                                                                            '__symbolic': 'reference',
                                                                                                            'name': 'style',
                                                                                                            'module': '@angular/core'
                                                                                                        },
                                                                                                        'arguments': [{ 'background': 'red' }]
                                                                                                    }]]
                                                                                        }
                                                                                    ]
                                                                                }]]
                                                                    }]]
                                                        }
                                                    ]
                                                }
                                            ]
                                        ]
                                    }]
                            }
                        ]
                    }
                ],
                'members': {
                    'hero': [
                        {
                            '__symbolic': 'property',
                            'decorators': [
                                {
                                    '__symbolic': 'call',
                                    'expression': {
                                        '__symbolic': 'reference',
                                        'name': 'Input',
                                        'module': '@angular/core'
                                    }
                                }
                            ]
                        }
                    ],
                    'onMouseOver': [
                        {
                            '__symbolic': 'method',
                            'decorators': [
                                {
                                    '__symbolic': 'call',
                                    'expression': {
                                        '__symbolic': 'reference',
                                        'module': '@angular/core',
                                        'name': 'HostListener'
                                    },
                                    'arguments': [
                                        'mouseover',
                                        [
                                            '$event'
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    '/src/extern.d.ts': { '__symbolic': 'module', 'version': 3, metadata: { s: 's' } },
    '/tmp/src/error-reporting.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            SomeClass: {
                __symbolic: 'class',
                decorators: [
                    {
                        __symbolic: 'call',
                        expression: {
                            __symbolic: 'reference',
                            name: 'Component',
                            module: '@angular/core'
                        },
                        arguments: [
                            {
                                entryComponents: [
                                    {
                                        __symbolic: 'reference',
                                        module: 'src/error-references',
                                        name: 'Link1',
                                    }
                                ]
                            }
                        ]
                    }
                ],
            }
        }
    },
    '/tmp/src/error-references.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            Link1: {
                __symbolic: 'reference',
                module: 'src/error-references',
                name: 'Link2'
            },
            Link2: {
                __symbolic: 'reference',
                module: 'src/error-references',
                name: 'ErrorSym'
            },
            ErrorSym: {
                __symbolic: 'error',
                message: 'A reasonable error message',
                line: 12,
                character: 33
            }
        }
    },
    '/tmp/src/function-declaration.d.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            one: {
                __symbolic: 'function',
                parameters: ['a'],
                value: [
                    { __symbolic: 'reference', name: 'a' }
                ]
            },
            add: {
                __symbolic: 'function',
                parameters: ['a', 'b'],
                value: {
                    __symbolic: 'binop',
                    operator: '+',
                    left: { __symbolic: 'reference', name: 'a' },
                    right: {
                        __symbolic: 'binop',
                        operator: '+',
                        left: { __symbolic: 'reference', name: 'b' },
                        right: { __symbolic: 'reference', name: 'oneLiteral' }
                    }
                }
            },
            oneLiteral: 1
        }
    },
    '/tmp/src/function-reference.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            one: {
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: './function-declaration',
                    name: 'one'
                },
                arguments: ['some-value']
            },
            three: {
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: './function-declaration',
                    name: 'add'
                },
                arguments: [1, 1]
            },
            recursion: {
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: './function-recursive',
                    name: 'recursive'
                },
                arguments: [1]
            },
            indirectRecursion: {
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: './function-recursive',
                    name: 'indirectRecursion1'
                },
                arguments: [1]
            }
        }
    },
    '/tmp/src/function-recursive.d.ts': {
        __symbolic: 'modules',
        version: 3,
        metadata: {
            recursive: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'recursive',
                    },
                    arguments: [
                        {
                            __symbolic: 'reference',
                            name: 'a'
                        }
                    ]
                }
            },
            indirectRecursion1: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'indirectRecursion2',
                    },
                    arguments: [
                        {
                            __symbolic: 'reference',
                            name: 'a'
                        }
                    ]
                }
            },
            indirectRecursion2: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'indirectRecursion1',
                    },
                    arguments: [
                        {
                            __symbolic: 'reference',
                            name: 'a'
                        }
                    ]
                }
            }
        },
    },
    '/tmp/src/spread.ts': {
        __symbolic: 'module',
        version: 3,
        metadata: {
            spread: [0, { __symbolic: 'spread', expression: [1, 2, 3, 4] }, 5]
        }
    },
    '/tmp/src/custom-decorator.ts': "\n        export function CustomDecorator(): any {\n          return () => {};\n        }\n      ",
    '/tmp/src/custom-decorator-reference.ts': "\n        import {CustomDecorator} from './custom-decorator';\n\n        @CustomDecorator()\n        export class Foo {\n          @CustomDecorator() get foo(): string { return ''; }\n        }\n      ",
    '/tmp/src/invalid-calll-definitions.ts': "\n        export function someFunction(a: any) {\n          if (Array.isArray(a)) {\n            return a;\n          }\n          return undefined;\n        }\n      ",
    '/tmp/src/invalid-calls.ts': "\n        import {someFunction} from './nvalid-calll-definitions.ts';\n        import {Component} from '@angular/core';\n        import {NgIf} from '@angular/common';\n\n        @Component({\n          selector: 'my-component',\n          entryComponents: [someFunction([NgIf])]\n        })\n        export class MyComponent {}\n\n        @someFunction()\n        @Component({\n          selector: 'my-component',\n          entryComponents: [NgIf]\n        })\n        export class MyOtherComponent { }\n      ",
    '/tmp/src/static-method.ts': "\n        import {Component} from '@angular/core/src/metadata';\n\n        @Component({\n          selector: 'stub'\n        })\n        export class MyModule {\n          static with(data: any) {\n            return { provider: 'a', useValue: data }\n          }\n          static condMethod(cond: boolean) {\n            return [{ provider: 'a', useValue: cond ? '1' : '2'}];\n          }\n          static defaultsMethod(a, b = true, c = false) {\n            return [a, b, c];\n          }\n          static withFactory() {\n            return { provide: 'c', useFactory: AnotherModule.someFactory };\n          }\n        }\n\n        export class AnotherModule {\n          static someFactory() {\n            return 'e';\n          }\n        }\n      ",
    '/tmp/src/static-method-call.ts': "\n        import {Component} from '@angular/core';\n        import {MyModule} from './static-method';\n\n        @Component({\n          providers: MyModule.with(100)\n        })\n        export class MyComponent { }\n\n        @Component({\n          providers: [MyModule.condMethod(true), MyModule.condMethod(false)]\n        })\n        export class MyCondComponent { }\n\n        @Component({\n          providers: [MyModule.defaultsMethod('a')]\n        })\n        export class MyDefaultsComponent { }\n\n        @Component({\n          providers: MyModule.withFactory()\n        })\n        export class MyFactoryComponent { }\n      ",
    '/tmp/src/static-field.ts': "\n        import {Injectable} from '@angular/core';\n\n        @Injectable()\n        export class MyModule {\n          static VALUE = 'Some string';\n        }\n      ",
    '/tmp/src/macro-function.ts': "\n        export function v(value: any) {\n          return { provide: 'a', useValue: value };\n        }\n      ",
    '/tmp/src/call-macro-function.ts': "\n        import {Component} from '@angular/core';\n        import {v} from './macro-function';\n\n        @Component({\n          providers: v(100)\n        })\n        export class MyComponent { }\n\n        @Component({\n          providers: v(v(100))\n        })\n        export class MyComponentNested { }\n      ",
    '/tmp/src/static-field-reference.ts': "\n        import {Component} from '@angular/core';\n        import {MyModule} from './static-field';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: MyModule.VALUE } ]\n        })\n        export class Foo { }\n      ",
    '/tmp/src/static-method-def.ts': "\n        export class ClassWithStatics {\n          static staticMethod() {}\n        }\n      ",
    '/tmp/src/static-method-ref.ts': "\n        import {Component} from '@angular/core';\n        import {ClassWithStatics} from './static-method-def';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: ClassWithStatics.staticMethod}]\n        })\n        export class MethodReference {\n\n        }\n      ",
    '/tmp/src/invalid-metadata.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: (() => 1)() }]\n        })\n        export class InvalidMetadata {}\n      ",
    '/tmp/src/forward-ref.ts': "\n        import {forwardRef} from '@angular/core';\n        import {Component} from '@angular/core';\n        import {Inject} from '@angular/core';\n        @Component({})\n        export class Forward {\n          constructor(@Inject(forwardRef(() => Dep)) d: Dep) {}\n        }\n        export class Dep {\n          @Input f: Forward;\n        }\n      "
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3RhdGljX3JlZmxlY3Rvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQW1JO0FBQ25JLHNDQUEySDtBQUczSCw2RUFBZ0c7QUFFaEcsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLElBQUksU0FBdUIsQ0FBQztJQUM1QixJQUFJLElBQThCLENBQUM7SUFDbkMsSUFBSSxjQUFvQyxDQUFDO0lBQ3pDLElBQUksU0FBMEIsQ0FBQztJQUUvQixjQUNJLFFBQWtELEVBQ2xELFVBQThELEVBQzlELGFBQXNELEVBQUUsZ0JBQW1DO1FBRjNGLHlCQUFBLEVBQUEsNEJBQWtEO1FBQ2xELDJCQUFBLEVBQUEsZUFBOEQ7UUFFaEUsSUFBTSxXQUFXLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDO1FBQzVDLElBQUksR0FBRyxJQUFJLDBEQUE0QixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BFLElBQU0sZUFBZSxHQUFHLElBQUksaURBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsS0FBSyxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9ELGNBQWMsR0FBRyxJQUFJLCtCQUFvQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzdGLFNBQVMsR0FBRyxJQUFJLDBCQUFlLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJ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RyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzthQUNwRixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdGLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFB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