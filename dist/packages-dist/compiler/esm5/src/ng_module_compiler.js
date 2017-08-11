/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { identifierName } from './compile_metadata';
import { CompileReflector } from './compile_reflector';
import { Identifiers } from './identifiers';
import { CompilerInjectable } from './injectable';
import * as o from './output/output_ast';
import { typeSourceSpan } from './parse_util';
import { NgModuleProviderAnalyzer } from './provider_analyzer';
import { componentFactoryResolverProviderDef, providerDef } from './view_compiler/provider_compiler';
var NgModuleCompileResult = (function () {
    /**
     * @param {?} ngModuleFactoryVar
     */
    function NgModuleCompileResult(ngModuleFactoryVar) {
        this.ngModuleFactoryVar = ngModuleFactoryVar;
    }
    return NgModuleCompileResult;
}());
export { NgModuleCompileResult };
function NgModuleCompileResult_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleCompileResult.prototype.ngModuleFactoryVar;
}
var /** @type {?} */ LOG_VAR = o.variable('_l');
var NgModuleCompiler = (function () {
    /**
     * @param {?} reflector
     */
    function NgModuleCompiler(reflector) {
        this.reflector = reflector;
    }
    /**
     * @param {?} ctx
     * @param {?} ngModuleMeta
     * @param {?} extraProviders
     * @return {?}
     */
    NgModuleCompiler.prototype.compile = function (ctx, ngModuleMeta, extraProviders) {
        var /** @type {?} */ sourceSpan = typeSourceSpan('NgModule', ngModuleMeta.type);
        var /** @type {?} */ entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents;
        var /** @type {?} */ bootstrapComponents = ngModuleMeta.bootstrapComponents;
        var /** @type {?} */ providerParser = new NgModuleProviderAnalyzer(this.reflector, ngModuleMeta, extraProviders, sourceSpan);
        var /** @type {?} */ providerDefs = [componentFactoryResolverProviderDef(this.reflector, ctx, 0 /* None */, entryComponentFactories)]
            .concat(providerParser.parse().map(function (provider) { return providerDef(ctx, provider); }))
            .map(function (_a) {
            var providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, flags = _a.flags, tokenExpr = _a.tokenExpr;
            return o.importExpr(Identifiers.moduleProviderDef).callFn([
                o.literal(flags), tokenExpr, providerExpr, depsExpr
            ]);
        });
        var /** @type {?} */ ngModuleDef = o.importExpr(Identifiers.moduleDef).callFn([o.literalArr(providerDefs)]);
        var /** @type {?} */ ngModuleDefFactory = o.fn([new o.FnParam(/** @type {?} */ ((LOG_VAR.name)))], [new o.ReturnStatement(ngModuleDef)], o.INFERRED_TYPE);
        var /** @type {?} */ ngModuleFactoryVar = identifierName(ngModuleMeta.type) + "NgFactory";
        this._createNgModuleFactory(ctx, ngModuleMeta.type.reference, o.importExpr(Identifiers.createModuleFactory).callFn([
            ctx.importExpr(ngModuleMeta.type.reference),
            o.literalArr(bootstrapComponents.map(function (id) { return ctx.importExpr(id.reference); })),
            ngModuleDefFactory
        ]));
        if (ngModuleMeta.id) {
            var /** @type {?} */ registerFactoryStmt = o.importExpr(Identifiers.RegisterModuleFactoryFn)
                .callFn([o.literal(ngModuleMeta.id), o.variable(ngModuleFactoryVar)])
                .toStmt();
            ctx.statements.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(ngModuleFactoryVar);
    };
    /**
     * @param {?} ctx
     * @param {?} ngModuleReference
     * @return {?}
     */
    NgModuleCompiler.prototype.createStub = function (ctx, ngModuleReference) {
        this._createNgModuleFactory(ctx, ngModuleReference, o.NULL_EXPR);
    };
    /**
     * @param {?} ctx
     * @param {?} reference
     * @param {?} value
     * @return {?}
     */
    NgModuleCompiler.prototype._createNgModuleFactory = function (ctx, reference, value) {
        var /** @type {?} */ ngModuleFactoryVar = identifierName({ reference: reference }) + "NgFactory";
        var /** @type {?} */ ngModuleFactoryStmt = o.variable(ngModuleFactoryVar)
            .set(value)
            .toDeclStmt(o.importType(Identifiers.NgModuleFactory, [/** @type {?} */ ((o.expressionType(ctx.importExpr(reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]);
        ctx.statements.push(ngModuleFactoryStmt);
    };
    return NgModuleCompiler;
}());
export { NgModuleCompiler };
NgModuleCompiler.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
NgModuleCompiler.ctorParameters = function () { return [
    { type: CompileReflector, },
]; };
function NgModuleCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleCompiler.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgModuleCompiler.ctorParameters;
    /** @type {?} */
    NgModuleCompiler.prototype.reflector;
}
//# sourceMappingURL=ng_module_compiler.js.map