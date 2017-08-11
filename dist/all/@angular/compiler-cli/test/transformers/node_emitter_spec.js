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
var ts = require("typescript");
var node_emitter_1 = require("../../src/transformers/node_emitter");
var mocks_1 = require("../mocks");
var someGenFilePath = '/somePackage/someGenFile';
var someGenFileName = someGenFilePath + '.ts';
var someSourceFilePath = '/somePackage/someSourceFile';
var anotherModuleUrl = '/somePackage/someOtherPath';
var sameModuleIdentifier = new o.ExternalReference(null, 'someLocalId', null);
var externalModuleIdentifier = new o.ExternalReference(anotherModuleUrl, 'someExternalId', null);
describe('TypeScriptNodeEmitter', function () {
    var context;
    var host;
    var emitter;
    var someVar;
    beforeEach(function () {
        context = new mocks_1.MockAotContext('/', FILES);
        host = new mocks_1.MockCompilerHost(context);
        emitter = new node_emitter_1.TypeScriptNodeEmitter();
        someVar = o.variable('someVar', null, null);
    });
    function emitStmt(stmt, preamble) {
        var stmts = Array.isArray(stmt) ? stmt : [stmt];
        var program = ts.createProgram([someGenFileName], { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 }, host);
        var moduleSourceFile = program.getSourceFile(someGenFileName);
        var transformers = {
            before: [function (context) {
                    return function (sourceFile) {
                        var newSourceFile = emitter.updateSourceFile(sourceFile, stmts, preamble)[0];
                        return newSourceFile;
                    };
                }]
        };
        var result = '';
        var emitResult = program.emit(moduleSourceFile, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            if (fileName.startsWith(someGenFilePath)) {
                result = data;
            }
        }, undefined, undefined, transformers);
        return normalizeResult(result);
    }
    it('should declare variables', function () {
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt())).toEqual("var someVar = 1;");
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Final])))
            .toEqual("var someVar = 1;");
        expect(emitStmt(someVar.set(o.literal(1)).toDeclStmt(null, [o.StmtModifier.Exported])))
            .toEqual("var someVar = 1; exports.someVar = someVar;");
    });
    describe('declare variables with ExternExpressions as values', function () {
        it('should create no reexport if the identifier is in the same module', function () {
            // identifier is in the same module -> no reexport
            expect(emitStmt(someVar.set(o.importExpr(sameModuleIdentifier)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]))).toEqual('var someVar = someLocalId; exports.someVar = someVar;');
        });
        it('should create no reexport if the variable is not exported', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier)).toDeclStmt()))
                .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); var someVar = i0.someExternalId;");
        });
        it('should create no reexport if the variable is typed', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                .toDeclStmt(o.DYNAMIC_TYPE, [o.StmtModifier.Exported])))
                .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); var someVar = i0.someExternalId; exports.someVar = someVar;");
        });
        it('should create a reexport', function () {
            expect(emitStmt(someVar.set(o.importExpr(externalModuleIdentifier))
                .toDeclStmt(null, [o.StmtModifier.Exported])))
                .toEqual("var someOtherPath_1 = require(\"/somePackage/someOtherPath\"); exports.someVar = someOtherPath_1.someExternalId;");
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
                .toEqual("var someOtherPath_1 = require(\"/somePackage/someOtherPath\"); exports.someVar = someOtherPath_1.someExternalId; exports.someVar2 = someOtherPath_1.someExternalId2;");
        });
    });
    it('should read and write variables', function () {
        expect(emitStmt(someVar.toStmt())).toEqual("someVar;");
        expect(emitStmt(someVar.set(o.literal(1)).toStmt())).toEqual("someVar = 1;");
        expect(emitStmt(someVar.set(o.variable('someOtherVar').set(o.literal(1))).toStmt()))
            .toEqual("someVar = someOtherVar = 1;");
    });
    it('should read and write keys', function () {
        expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).toStmt()))
            .toEqual("someMap[someKey];");
        expect(emitStmt(o.variable('someMap').key(o.variable('someKey')).set(o.literal(1)).toStmt()))
            .toEqual("someMap[someKey] = 1;");
    });
    it('should read and write properties', function () {
        expect(emitStmt(o.variable('someObj').prop('someProp').toStmt())).toEqual("someObj.someProp;");
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
        expect(emitStmt(o.literal('someStr').toStmt())).toEqual("\"someStr\";");
        expect(emitStmt(o.literalArr([o.literal(1)]).toStmt())).toEqual("[1];");
        expect(emitStmt(o.literalMap([
            { key: 'someKey', value: o.literal(1), quoted: false },
            { key: 'a', value: o.literal('a'), quoted: false },
            { key: '*', value: o.literal('star'), quoted: true },
        ]).toStmt())
            .replace(/\s+/gm, ''))
            .toEqual("({someKey:1,a:\"a\",\"*\":\"star\"});");
    });
    it('should support blank literals', function () {
        expect(emitStmt(o.literal(null).toStmt())).toEqual('null;');
        expect(emitStmt(o.literal(undefined).toStmt())).toEqual('undefined;');
        expect(emitStmt(o.variable('a', null).isBlank().toStmt())).toEqual('a == null;');
    });
    it('should support external identifiers', function () {
        expect(emitStmt(o.importExpr(sameModuleIdentifier).toStmt())).toEqual('someLocalId;');
        expect(emitStmt(o.importExpr(externalModuleIdentifier).toStmt()))
            .toEqual("const i0 = require(\"/somePackage/someOtherPath\"); i0.someExternalId;");
    });
    it('should support operators', function () {
        var lhs = o.variable('lhs');
        var rhs = o.variable('rhs');
        expect(emitStmt(someVar.cast(o.INT_TYPE).toStmt())).toEqual('someVar;');
        expect(emitStmt(o.not(someVar).toStmt())).toEqual('!someVar;');
        expect(emitStmt(o.assertNotNull(someVar).toStmt())).toEqual('someVar;');
        expect(emitStmt(someVar.conditional(o.variable('trueCase'), o.variable('falseCase')).toStmt()))
            .toEqual('someVar ? trueCase : falseCase;');
        expect(emitStmt(lhs.equals(rhs).toStmt())).toEqual('lhs == rhs;');
        expect(emitStmt(lhs.notEquals(rhs).toStmt())).toEqual('lhs != rhs;');
        expect(emitStmt(lhs.identical(rhs).toStmt())).toEqual('lhs === rhs;');
        expect(emitStmt(lhs.notIdentical(rhs).toStmt())).toEqual('lhs !== rhs;');
        expect(emitStmt(lhs.minus(rhs).toStmt())).toEqual('lhs - rhs;');
        expect(emitStmt(lhs.plus(rhs).toStmt())).toEqual('lhs + rhs;');
        expect(emitStmt(lhs.divide(rhs).toStmt())).toEqual('lhs / rhs;');
        expect(emitStmt(lhs.multiply(rhs).toStmt())).toEqual('lhs * rhs;');
        expect(emitStmt(lhs.modulo(rhs).toStmt())).toEqual('lhs % rhs;');
        expect(emitStmt(lhs.and(rhs).toStmt())).toEqual('lhs && rhs;');
        expect(emitStmt(lhs.or(rhs).toStmt())).toEqual('lhs || rhs;');
        expect(emitStmt(lhs.lower(rhs).toStmt())).toEqual('lhs < rhs;');
        expect(emitStmt(lhs.lowerEquals(rhs).toStmt())).toEqual('lhs <= rhs;');
        expect(emitStmt(lhs.bigger(rhs).toStmt())).toEqual('lhs > rhs;');
        expect(emitStmt(lhs.biggerEquals(rhs).toStmt())).toEqual('lhs >= rhs;');
    });
    it('should support function expressions', function () {
        expect(emitStmt(o.fn([], []).toStmt())).toEqual("(function () { });");
        expect(emitStmt(o.fn([], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE).toStmt()))
            .toEqual("(function () { return 1; });");
        expect(emitStmt(o.fn([new o.FnParam('param1', o.INT_TYPE)], []).toStmt()))
            .toEqual("(function (param1) { });");
    });
    it('should support function statements', function () {
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], []))).toEqual('function someFn() { }');
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [], null, [o.StmtModifier.Exported])))
            .toEqual("function someFn() { } exports.someFn = someFn;");
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [], [new o.ReturnStatement(o.literal(1))], o.INT_TYPE)))
            .toEqual("function someFn() { return 1; }");
        expect(emitStmt(new o.DeclareFunctionStmt('someFn', [new o.FnParam('param1', o.INT_TYPE)], []))).toEqual("function someFn(param1) { }");
    });
    it('should support comments', function () { expect(emitStmt(new o.CommentStmt('a\nb'))).toEqual(''); });
    it('should support if stmt', function () {
        var trueCase = o.variable('trueCase').callFn([]).toStmt();
        var falseCase = o.variable('falseCase').callFn([]).toStmt();
        expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase])))
            .toEqual('if (cond) { trueCase(); }');
        expect(emitStmt(new o.IfStmt(o.variable('cond'), [trueCase], [falseCase])))
            .toEqual('if (cond) { trueCase(); } else { falseCase(); }');
    });
    it('should support try/catch', function () {
        var bodyStmt = o.variable('body').callFn([]).toStmt();
        var catchStmt = o.variable('catchFn').callFn([o.CATCH_ERROR_VAR, o.CATCH_STACK_VAR]).toStmt();
        expect(emitStmt(new o.TryCatchStmt([bodyStmt], [catchStmt])))
            .toEqual("try { body(); } catch (error) { var stack = error.stack; catchFn(error, stack); }");
    });
    it('should support support throwing', function () { expect(emitStmt(new o.ThrowStmt(someVar))).toEqual('throw someVar;'); });
    describe('classes', function () {
        var callSomeMethod;
        beforeEach(function () { callSomeMethod = o.THIS_EXPR.callMethod('someMethod', []).toStmt(); });
        it('should support declaring classes', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, []))).toEqual('class SomeClass { }');
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [], [
                o.StmtModifier.Exported
            ]))).toEqual('class SomeClass { } exports.SomeClass = SomeClass;');
            expect(emitStmt(new o.ClassStmt('SomeClass', o.variable('SomeSuperClass'), [], [], null, []))).toEqual('class SomeClass extends SomeSuperClass { }');
        });
        it('should support declaring constructors', function () {
            var superCall = o.SUPER_EXPR.callFn([o.variable('someParam')]).toStmt();
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], []), [])))
                .toEqual("class SomeClass { constructor() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [new o.FnParam('someParam', o.INT_TYPE)], []), [])))
                .toEqual("class SomeClass { constructor(someParam) { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [superCall]), [])))
                .toEqual("class SomeClass { constructor() { super(someParam); } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], new o.ClassMethod(null, [], [callSomeMethod]), [])))
                .toEqual("class SomeClass { constructor() { this.someMethod(); } }");
        });
        it('should support declaring fields', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField')], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE)], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [new o.ClassField('someField', o.INT_TYPE, [o.StmtModifier.Private])], [], null, [])))
                .toEqual("class SomeClass { constructor() { this.someField = null; } }");
        });
        it('should support declaring getters', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [])], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], o.INT_TYPE)], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [callSomeMethod])], null, [])))
                .toEqual("class SomeClass { get someGetter() { this.someMethod(); } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [new o.ClassGetter('someGetter', [], null, [o.StmtModifier.Private])], null, [])))
                .toEqual("class SomeClass { get someGetter() { } }");
        });
        it('should support methods', function () {
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [])
            ]))).toEqual("class SomeClass { someMethod() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [], o.INT_TYPE)
            ]))).toEqual("class SomeClass { someMethod() { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [new o.FnParam('someParam', o.INT_TYPE)], [])
            ]))).toEqual("class SomeClass { someMethod(someParam) { } }");
            expect(emitStmt(new o.ClassStmt('SomeClass', null, [], [], null, [
                new o.ClassMethod('someMethod', [], [callSomeMethod])
            ]))).toEqual("class SomeClass { someMethod() { this.someMethod(); } }");
        });
    });
    it('should support builtin types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(o.DYNAMIC_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.BOOL_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.INT_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.NUMBER_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.STRING_TYPE))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.FUNCTION_TYPE))).toEqual('var a = null;');
    });
    it('should support external types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(sameModuleIdentifier))))
            .toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(o.importType(externalModuleIdentifier))))
            .toEqual("var a = null;");
    });
    it('should support expression types', function () {
        expect(emitStmt(o.variable('a').set(o.NULL_EXPR).toDeclStmt(o.expressionType(o.variable('b')))))
            .toEqual('var a = null;');
    });
    it('should support expressions with type parameters', function () {
        expect(emitStmt(o.variable('a')
            .set(o.NULL_EXPR)
            .toDeclStmt(o.importType(externalModuleIdentifier, [o.STRING_TYPE]))))
            .toEqual("var a = null;");
    });
    it('should support combined types', function () {
        var writeVarExpr = o.variable('a').set(o.NULL_EXPR);
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(null)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.ArrayType(o.INT_TYPE)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(null)))).toEqual('var a = null;');
        expect(emitStmt(writeVarExpr.toDeclStmt(new o.MapType(o.INT_TYPE)))).toEqual('var a = null;');
    });
    it('should support a preamble', function () {
        expect(emitStmt(o.variable('a').toStmt(), '/* SomePreamble */')).toBe('/* SomePreamble */ a;');
    });
});
var FILES = {
    somePackage: { 'someGenFile.ts': "export var a: number;" }
};
function normalizeResult(result) {
    // Remove TypeScript prefixes
    // Remove new lines
    // Squish adjacent spaces
    // Remove prefix and postfix spaces
    return result.replace('"use strict";', ' ')
        .replace('exports.__esModule = true;', ' ')
        .replace('Object.defineProperty(exports, "__esModule", { value: true });', ' ')
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
        .replace(/^ /g, '')
        .replace(/ $/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9lbWl0dGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC90cmFuc2Zvcm1lcnMvbm9kZV9lbWl0dGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyREFBNkQ7QUFDN0QsK0JBQWlDO0FBRWpDLG9FQUEwRTtBQUMxRSxrQ0FBcUU7QUFFckUsSUFBTSxlQUFlLEdBQUcsMEJBQTBCLENBQUM7QUFDbkQsSUFBTSxlQUFlLEdBQUcsZUFBZSxHQUFHLEtBQUssQ0FBQztBQUNoRCxJQUFNLGtCQUFrQixHQUFHLDZCQUE2QixDQUFDO0FBQ3pELElBQU0sZ0JBQWdCLEdBQUcsNEJBQTRCLENBQUM7QUFFdEQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRWhGLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFbkcsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLElBQUksT0FBdUIsQ0FBQztJQUM1QixJQUFJLElBQXNCLENBQUM7SUFDM0IsSUFBSSxPQUE4QixDQUFDO0lBQ25DLElBQUksT0FBc0IsQ0FBQztJQUUzQixVQUFVLENBQUM7UUFDVCxPQUFPLEdBQUcsSUFBSSxzQkFBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsSUFBSSx3QkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxPQUFPLEdBQUcsSUFBSSxvQ0FBcUIsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFD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LENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDeEYsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDL0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7UUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUs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Q0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzFGLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBRWhELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FB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