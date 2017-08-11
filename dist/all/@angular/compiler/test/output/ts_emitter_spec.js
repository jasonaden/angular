"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("@angular/compiler/src/output/output_ast");
var ts_emitter_1 = require("@angular/compiler/src/output/ts_emitter");
var abstract_emitter_spec_1 = require("./abstract_emitter_spec");
var someGenFilePath = 'somePackage/someGenFile';
var someSourceFilePath = 'somePackage/someSourceFile';
var anotherModuleUrl = 'somePackage/someOtherPath';
var sameModuleIdentifier = new o.ExternalReference(null, 'someLocalId', null);
var externalModuleIdentifier = new o.ExternalReference(anotherModuleUrl, 'someExternalId', null);
function main() {
    // Not supported features of our OutputAst in TS:
    // - real `const` like in Dart
    // - final fields
    describe('TypeScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () {
            emitter = new ts_emitter_1.TypeScriptEmitter();
            someVar = o.variable('someVar', null, null);
        });
        function emitStmt(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someSourceFilePath, someGenFilePath, stmts, preamble);
            return abstract_emitter_spec_1.stripSourceMapAndNewLine(source);
        }
        it('should declare variables', function () {
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt())).toEqual("var someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Final])))
                .toEqual("const someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Exported])))
                .toEqual("export var someVar:any = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(o.INT_TYPE)))
                .toEqual("var someVar:number = 1;");
            expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(o.INFERRED_TYPE)))
                .toEqual("var someVar = 1;");
        });
        describe('declare variables with ExternExpressions as values', function () {
            it('should create no reexport if the identifier is in the same module', function () {
                // identifier is in the same module -> no reexport
                expect(emitStmt(someVar.set(o.importExpr(sameModuleIdentifier)).toDeclStmt(null, [
                    o.StmtModifier.Exported
                ]))).toEqual('export var someVar:any = someLocalId;');
            });
            it('should create no reexport if the variable is not exported', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier)).toDeclStmt())).toEqual([
                    "import * as i0 from 'somePackage/someOtherPath';", "var someVar:any = i0.someExternalId;"
                ].join('\n'));
            });
            it('should create no reexport if the variable is typed', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                    .toDeclStmt(o.DYNAMIC_TYPE, [o.StmtModifier.Exported])))
                    .toEqual([
                    "import * as i0 from 'somePackage/someOtherPath';",
                    "export var someVar:any = i0.someExternalId;"
                ].join('\n'));
            });
            it('should create a reexport', function () {
                expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                    .toDeclStmt(null, [o.StmtModifier.Exported])))
                    .toEqual([
                    "export {someExternalId as someVar} from 'somePackage/someOtherPath';", ""
                ].join('\n'));
            });
            it('should create multiple reexports from the same file', function () {
                var someVar2 = o.variable('someVar2');
                var externalModuleIdentifier2 = new o.ExternalReference(anotherModuleUrl, 'someExternalId2', null);
                expect(emitStmt([
                    someVar.set(o.importExpr(externalModuleIdentifier))
                        .toDeclStmt(null, [o.StmtModifier.Exported]),
                    someVar2.set(o.importExpr(externalModuleIdentifier2))
                        .toDeclStmt(null, [o.StmtModifier.Exported])
                ]))
                    .toEqual([
                    "export {someExternalId as someVar,someExternalId2 as someVar2} from 'somePackage/someOtherPath';",
                    ""
                ].join('\n'));
            });
        });
        it('should read and write variables', function () {
            expect(emitStmt(someVar.toStmt())).toEqual("someVar;");
            expect(emitStmt(someVar.set(o.literal(1)).toStmt())).toEqual("someVar = 1;");
            expect(emitStmt(someVar.set(o.variable('someOtherVar').set(o.literal(1))).toStmt()))
                .toEqual("someVar = (someOtherVar = 1);");
        });
        it('should read and write keys', function () {
            expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).toStmt()))
                .toEqual("someMap[someKey];");
            expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).set(o.literal(1)).toStmt()))
                .toEqual("someMap[someKey] = 1;");
        });
        it('should read and write properties', function () {
            expect(emitStmt(o.variable('someObj').prop('someProp').toStmt()))
                .toEqual("someObj.someProp;");
            expect(emitStmt(o.variable('someObj').prop('someProp').set(o.literal(1)).toStmt()))
                .toEqual("someObj.someProp = 1;");
        });
        it('should invoke functions and methods and constructors', function () {
            expect(emitStmt(o.variable('someFn').callFn([o.literal(1)]).toStmt())).toEqual('someFn(1);');
            expect(emitStmt(o.variable('someObj').callMethod('someMethod', [o.literal(1)]).toStmt()))
                .toEqual('someObj.someMethod(1);');
            expect(emitStmt(o.variable('SomeClass').instantiate([o.literal(1)]).toStmt()))
                .toEqual('new SomeClass(1);');
        });
        it('should support builtin methods', function () {
            expect(emitStmt(o.variable('arr1')
                .callMethod(o.BuiltinMethod.ConcatArray, [o.variable('arr2')])
                .toStmt()))
                .toEqual('arr1.concat(arr2);');
            expect(emitStmt(o.variable('observable')
                .callMethod(o.BuiltinMethod.SubscribeObservable, [o.variable('listener')])
                .toStmt()))
                .toEqual('observable.subscribe(listener);');
            expect(emitStmt(o.variable('fn').callMethod(o.BuiltinMethod.Bind, [o.variable('someObj')]).toStmt()))
                .toEqual('fn.bind(someObj);');
        });
        it('should support literals', function () {
            expect(emitStmt(o.literal(0).toStmt())).toEqual('0;');
            expect(emitStmt(o.literal(true).toStmt())).toEqual('true;');
            expect(emitStmt(o.literal('someStr').toStmt())).toEqual("'someStr';");
            expect(emitStmt(o.literalArr([o.literal(1)]).toStmt())).toEqual("[1];");
            expect(emitStmt(o.literalMap([
                { key: 'someKey', value: o.literal(1), quoted: false },
                { key: 'a', value: o.literal('a'), quoted: false },
                { key: '*', value: o.literal('star'), quoted: true },
            ]).toStmt())
                .replace(/\s+/gm, ''))
                .toEqual("{someKey:1,a:'a','*':'star'};");
        });
        it('should break expressions into multiple lines if they are too long', function () {
            var values = new Array(100);
            values.fill(o.literal(1));
            values.splice(50, 0, o.fn([], [new o.ReturnStatement(o.literal(1))]));
            expect(emitStmt(o.variable('fn').callFn(values).toStmt())).toEqual([
                'fn(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,',
                '    1,1,1,1,1,1,1,1,1,1,():void => {', '      return 1;',
                '    },1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,',
                '    1,1,1,1,1,1,1,1,1,1,1,1);'
            ].join('\n'));
        });
        it('should support blank literals', function () {
            expect(emitStmt(o.literal(null).toStmt())).toEqual('(null as any);');
            expect(emitStmt(o.literal(undefined).toStmt())).toEqual('(undefined as any);');
            expect(emitStmt(o.variable('a', null).isBlank().toStmt())).toEqual('(a == null);');
        });
        it('should support external identifiers', function () {
            expect(emitStmt(o.importExpr(sameModuleIdentifier).toStmt())).toEqual('someLocalId;');
            expect(emitStmt(o.importExpr(externalModuleIdentifier).toStmt())).toEqual([
                "import * as i0 from 'somePackage/someOtherPath';", "i0.someExternalId;"
            ].join('\n'));
        });
        it('should support operators', function () {
            var lhs = o.variable('lhs');
            var rhs = o.variable('rhs');
            expect(emitStmt(someVar.cast(o.INT_TYPE).toStmt())).toEqual('(<number>someVar);');
            expect(emitStmt(o.not(someVar).toStmt())).toEqual('!someVar;');
            expect(emitStmt(o.assertNotNull(someVar).toStmt())).toEqual('someVar!;');
            expect(emitStmt(someVar.conditional(o.variable('trueCase'), o.variable('falseCase')).toStmt()))
                .toEqual('(someVar? trueCase: falseCase);');
            expect(emitStmt(lhs.equals(rhs).toStmt())).toEqual('(lhs == rhs);');
            expect(emitStmt(lhs.notEquals(rhs).toStmt())).toEqual('(lhs != rhs);');
            expect(emitStmt(lhs.identical(rhs).toStmt())).toEqual('(lhs === rhs);');
            expect(emitStmt(lhs.notIdentical(rhs).toStmt())).toEqual('(lhs !== rhs);');
            expect(emitStmt(lhs.minus(rhs).toStmt())).toEqual('(lhs - rhs);');
            expect(emitStmt(lhs.plus(rhs).toStmt())).toEqual('(lhs + rhs);');
            expect(emitStmt(lhs.divide(rhs).toStmt())).toEqual('(lhs / rhs);');
            expect(emitStmt(lhs.multiply(rhs).toStmt())).toEqual('(lhs * rhs);');
            expect(emitStmt(lhs.modulo(rhs).toStmt())).toEqual('(lhs % rhs);');
            expect(emitStmt(lhs.and(rhs).toStmt())).toEqual('(lhs && rhs);');
            expect(emitStmt(lhs.or(rhs).toStmt())).toEqual('(lhs || rhs);');
            expect(emitStmt(lhs.lower(rhs).toStmt())).toEqual('(lhs < rhs);');
            expect(emitStmt(lhs.lowerEquals(rhs).toStmt())).toEqual('(lhs <= rhs);');
            expect(emitStmt(lhs.bigger(rhs).toStmt())).toEqual('(lhs > rhs);');
            expect(emitStmt(lhs.biggerEquals(rhs).toStmt())).toEqual('(lhs >= rhs);');
        });
        it('should support function expressions', function () {
            expect(emitStmt(o.fn([], []).toStmt())).toEqual(['():void => {', '};'].join('\n'));
            expect(emitStmt(o.fn([], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE).toStmt()))
                .toEqual(['():number => {', '  return 1;\n};'].join('\n'));
            expect(emitStmt(o.fn([new o.FnParam('param1', o.INT_TYPE)], []).toStmt())).toEqual([
                '(param1:number):void => {', '};'
            ].join('\n'));
        });
        it('should support function statements', function () {
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], []))).toEqual(['function someFn():void {', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [], null, [o.StmtModifier.Exported])))
                .toEqual(['export function someFn():void {', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE)))
                .toEqual(['function someFn():number {', '  return 1;', '}'].join('\n'));
            expect(emitStmt(new o.DeclareFunctionStmt('someFn', [new o.FnParam('param1', o.INT_TYPE)], []))).toEqual(['function someFn(param1:number):void {', '}'].join('\n'));
        });
        it('should support comments', function () {
            expect(emitStmt(new o.CommentStmt('a\nb'))).toEqual(['// a', '// b'].join('\n'));
        });
        it('should support if stmt', function () {
            var trueCase = o.variable('trueCase').callFn([]).toStmt();
            var falseCase = o.variable('falseCase').callFn([]).toStmt();
            expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase]))).toEqual([
                'if (cond) { trueCase(); }'
            ].join('\n'));
            expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase], [falseCase]))).toEqual([
                'if (cond) {', '  trueCase();', '} else {', '  falseCase();', '}'
            ].join('\n'));
        });
        it('should support try/catch', function () {
            var bodyStmt = o.variable('body').callFn([]).toStmt();
            var catchStmt = o.variable('catchFn').callFn([o.CATCH_ERROR_VAR, o.CATCH_STACK_VAR]).toStmt();
            expect(emitStmt(new o.TryCatchStmt([bodyStmt], [catchStmt]))).toEqual([
                'try {', '  body();', '} catch (error) {', '  const stack:any = error.stack;',
                '  catchFn(error,stack);', '}'
            ].join('\n'));
        });
        it('should support support throwing', function () { expect(emitStmt(new o.ThrowStmt(someVar))).toEqual('throw someVar;'); });
        describe('classes', function () {
            var callSomeMethod;
            beforeEach(function () { callSomeMethod = o.THIS_EXPR.callMethod('someMethod', []).toStmt(); });
            it('should support declaring classes', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, []))).toEqual(['class SomeClass {', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [], [
                    o.StmtModifier.Exported
                ]))).toEqual(['export class SomeClass {', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', o.variable('SomeSuperClass'), [], [], null, []))).toEqual(['class SomeClass extends SomeSuperClass {', '}'].join('\n'));
            });
            it('should support declaring constructors', function () {
                var superCall = o.SUPER_EXPR.callFn([o.variable('someParam')]).toStmt();
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], []), [])))
                    .toEqual(['class SomeClass {', '  constructor() {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [new o.FnParam('someParam', o.INT_TYPE)], []), [])))
                    .toEqual(['class SomeClass {', '  constructor(someParam:number) {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [superCall]), [])))
                    .toEqual([
                    'class SomeClass {', '  constructor() {', '    super(someParam);', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [callSomeMethod]), [])))
                    .toEqual([
                    'class SomeClass {', '  constructor() {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
            });
            it('should support declaring fields', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField')], [], null, [])))
                    .toEqual(['class SomeClass {', '  someField:any;', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE)], [], null, [])))
                    .toEqual(['class SomeClass {', '  someField:number;', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE, [o.StmtModifier.Private])], [], null, [])))
                    .toEqual(['class SomeClass {', '  /*private*/ someField:number;', '}'].join('\n'));
            });
            it('should support declaring getters', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [])], null, [])))
                    .toEqual(['class SomeClass {', '  get someGetter():any {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], o.INT_TYPE)], null, [])))
                    .toEqual(['class SomeClass {', '  get someGetter():number {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [callSomeMethod])], null, [])))
                    .toEqual([
                    'class SomeClass {', '  get someGetter():any {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], null, [o.StmtModifier.Private])], null, [])))
                    .toEqual(['class SomeClass {', '  private get someGetter():any {', '  }', '}'].join('\n'));
            });
            it('should support methods', function () {
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                    new o.ClassMethod('someMethod', [], [])
                ]))).toEqual(['class SomeClass {', '  someMethod():void {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                    new o.ClassMethod('someMethod', [], [], o.INT_TYPE)
                ]))).toEqual(['class SomeClass {', '  someMethod():number {', '  }', '}'].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [new o.ClassMethod('someMethod', [new o.FnParam('someParam', o.INT_TYPE)], [])])))
                    .toEqual([
                    'class SomeClass {', '  someMethod(someParam:number):void {', '  }', '}'
                ].join('\n'));
                expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [new o.ClassMethod('someMethod', [], [callSomeMethod])])))
                    .toEqual([
                    'class SomeClass {', '  someMethod():void {', '    this.someMethod();', '  }', '}'
                ].join('\n'));
            });
        });
        it('should support builtin types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(o.DYNAMIC_TYPE)))
                .toEqual('var a:any = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.BOOL_TYPE)))
                .toEqual('var a:boolean = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.INT_TYPE)))
                .toEqual('var a:number = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.NUMBER_TYPE)))
                .toEqual('var a:number = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.STRING_TYPE)))
                .toEqual('var a:string = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.FUNCTION_TYPE)))
                .toEqual('var a:Function = (null as any);');
        });
        it('should support external types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(sameModuleIdentifier))))
                .toEqual('var a:someLocalId = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(externalModuleIdentifier)))).toEqual([
                "import * as i0 from 'somePackage/someOtherPath';",
                "var a:i0.someExternalId = (null as any);"
            ].join('\n'));
        });
        it('should support expression types', function () {
            expect(emitStmt(o.variable('a').set(o.NULL_EXPR).toDeclStmt(o.expressionType(o.variable('b')))))
                .toEqual('var a:b = (null as any);');
        });
        it('should support expressions with type parameters', function () {
            expect(emitStmt(o.variable('a')
                .set(o.NULL_EXPR)
                .toDeclStmt(o.importType(externalModuleIdentifier, [o.STRING_TYPE]))))
                .toEqual([
                "import * as i0 from 'somePackage/someOtherPath';",
                "var a:i0.someExternalId<string> = (null as any);"
            ].join('\n'));
        });
        it('should support combined types', function () {
            var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(null))))
                .toEqual('var a:any[] = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(o.INT_TYPE))))
                .toEqual('var a:number[] = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(null))))
                .toEqual('var a:{[key: string]:any} = (null as any);');
            expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(o.INT_TYPE))))
                .toEqual('var a:{[key: string]:number} = (null as any);');
        });
        it('should support a preamble', function () {
            expect(emitStmt(o.variable('a').toStmt(), '/* SomePreamble */')).toBe([
                '/* SomePreamble */', 'a;'
            ].join('\n'));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfZW1pdHRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvdHNfZW1pdHRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsMkRBQTZEO0FBQzdELHNFQUEwRTtBQUUxRSxpRUFBaUU7QUFFakUsSUFBTSxlQUFlLEdBQUcseUJBQXlCLENBQUM7QUFDbEQsSUFBTSxrQkFBa0IsR0FBRyw0QkFBNEIsQ0FBQztBQUN4RCxJQUFNLGdCQUFnQixHQUFHLDJCQUEyQixDQUFDO0FBRXJELElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVoRixJQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBRW5HO0lBQ0UsaURBQWlEO0lBQ2pELDhCQUE4QjtJQUM5QixpQkFBaUI7SUFFakIsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLElBQUksT0FBMEIsQ0FBQztRQUMvQixJQUFJLE9BQXNCLENBQUM7UUFFM0IsVUFBVSxDQUFDO1lBQ1QsT0FBTyxHQUFHLElBQUksOEJBQWlCLEVBQUUsQ0FBQztZQUNsQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQWtCLElBQWlDLEVBQUUsUUFBaUI7WUFDcEUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMs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QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLE1BQU0sQ0FBQyxRQUFRLENB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