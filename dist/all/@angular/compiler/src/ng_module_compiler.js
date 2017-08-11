"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("./compile_metadata");
var compile_reflector_1 = require("./compile_reflector");
var identifiers_1 = require("./identifiers");
var injectable_1 = require("./injectable");
var o = require("./output/output_ast");
var parse_util_1 = require("./parse_util");
var provider_analyzer_1 = require("./provider_analyzer");
var provider_compiler_1 = require("./view_compiler/provider_compiler");
var NgModuleCompileResult = (function () {
    function NgModuleCompileResult(ngModuleFactoryVar) {
        this.ngModuleFactoryVar = ngModuleFactoryVar;
    }
    return NgModuleCompileResult;
}());
exports.NgModuleCompileResult = NgModuleCompileResult;
var LOG_VAR = o.variable('_l');
var NgModuleCompiler = (function () {
    function NgModuleCompiler(reflector) {
        this.reflector = reflector;
    }
    NgModuleCompiler.prototype.compile = function (ctx, ngModuleMeta, extraProviders) {
        var sourceSpan = parse_util_1.typeSourceSpan('NgModule', ngModuleMeta.type);
        var entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents;
        var bootstrapComponents = ngModuleMeta.bootstrapComponents;
        var providerParser = new provider_analyzer_1.NgModuleProviderAnalyzer(this.reflector, ngModuleMeta, extraProviders, sourceSpan);
        var providerDefs = [provider_compiler_1.componentFactoryResolverProviderDef(this.reflector, ctx, 0 /* None */, entryComponentFactories)]
            .concat(providerParser.parse().map(function (provider) { return provider_compiler_1.providerDef(ctx, provider); }))
            .map(function (_a) {
            var providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, flags = _a.flags, tokenExpr = _a.tokenExpr;
            return o.importExpr(identifiers_1.Identifiers.moduleProviderDef).callFn([
                o.literal(flags), tokenExpr, providerExpr, depsExpr
            ]);
        });
        var ngModuleDef = o.importExpr(identifiers_1.Identifiers.moduleDef).callFn([o.literalArr(providerDefs)]);
        var ngModuleDefFactory = o.fn([new o.FnParam(LOG_VAR.name)], [new o.ReturnStatement(ngModuleDef)], o.INFERRED_TYPE);
        var ngModuleFactoryVar = compile_metadata_1.identifierName(ngModuleMeta.type) + "NgFactory";
        this._createNgModuleFactory(ctx, ngModuleMeta.type.reference, o.importExpr(identifiers_1.Identifiers.createModuleFactory).callFn([
            ctx.importExpr(ngModuleMeta.type.reference),
            o.literalArr(bootstrapComponents.map(function (id) { return ctx.importExpr(id.reference); })),
            ngModuleDefFactory
        ]));
        if (ngModuleMeta.id) {
            var registerFactoryStmt = o.importExpr(identifiers_1.Identifiers.RegisterModuleFactoryFn)
                .callFn([o.literal(ngModuleMeta.id), o.variable(ngModuleFactoryVar)])
                .toStmt();
            ctx.statements.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(ngModuleFactoryVar);
    };
    NgModuleCompiler.prototype.createStub = function (ctx, ngModuleReference) {
        this._createNgModuleFactory(ctx, ngModuleReference, o.NULL_EXPR);
    };
    NgModuleCompiler.prototype._createNgModuleFactory = function (ctx, reference, value) {
        var ngModuleFactoryVar = compile_metadata_1.identifierName({ reference: reference }) + "NgFactory";
        var ngModuleFactoryStmt = o.variable(ngModuleFactoryVar)
            .set(value)
            .toDeclStmt(o.importType(identifiers_1.Identifiers.NgModuleFactory, [o.expressionType(ctx.importExpr(reference))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]);
        ctx.statements.push(ngModuleFactoryStmt);
    };
    return NgModuleCompiler;
}());
NgModuleCompiler = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [compile_reflector_1.CompileReflector])
], NgModuleCompiler);
exports.NgModuleCompiler = NgModuleCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL25nX21vZHVsZV9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUlILHVEQUFvRztBQUNwRyx5REFBcUQ7QUFDckQsNkNBQTBDO0FBQzFDLDJDQUFnRDtBQUNoRCx1Q0FBeUM7QUFDekMsMkNBQTRDO0FBQzVDLHlEQUE2RDtBQUU3RCx1RUFBMkc7QUFFM0c7SUFDRSwrQkFBbUIsa0JBQTBCO1FBQTFCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBUTtJQUFHLENBQUM7SUFDbkQsNEJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLHNEQUFxQjtBQUlsQyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBR2pDLElBQWEsZ0JBQWdCO0lBQzNCLDBCQUFvQixTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtJQUFHLENBQUM7SUFDbkQsa0NBQU8sR0FBUCxVQUNJLEdBQWtCLEVBQUUsWUFBcUMsRUFDekQsY0FBeUM7UUFDM0MsSUFBTSxVQUFVLEdBQUcsMkJBQWMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pFLElBQU0sdUJBQXVCLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztRQUM5RSxJQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RCxJQUFNLGNBQWMsR0FDaEIsSUFBSSw0Q0FBd0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDM0YsSUFBTSxZQUFZLEdBQ2QsQ0FBQyx1REFBbUMsQ0FDL0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFH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