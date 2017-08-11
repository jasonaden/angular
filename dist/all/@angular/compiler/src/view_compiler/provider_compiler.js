"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var identifiers_1 = require("../identifiers");
var lifecycle_reflector_1 = require("../lifecycle_reflector");
var o = require("../output/output_ast");
var value_util_1 = require("../output/value_util");
var template_ast_1 = require("../template_parser/template_ast");
function providerDef(ctx, providerAst) {
    var flags = 0 /* None */;
    if (!providerAst.eager) {
        flags |= 4096 /* LazyProvider */;
    }
    if (providerAst.providerType === template_ast_1.ProviderAstType.PrivateService) {
        flags |= 8192 /* PrivateProvider */;
    }
    providerAst.lifecycleHooks.forEach(function (lifecycleHook) {
        // for regular providers, we only support ngOnDestroy
        if (lifecycleHook === lifecycle_reflector_1.LifecycleHooks.OnDestroy ||
            providerAst.providerType === template_ast_1.ProviderAstType.Directive ||
            providerAst.providerType === template_ast_1.ProviderAstType.Component) {
            flags |= lifecycleHookToNodeFlag(lifecycleHook);
        }
    });
    var _a = providerAst.multiProvider ?
        multiProviderDef(ctx, flags, providerAst.providers) :
        singleProviderDef(ctx, flags, providerAst.providerType, providerAst.providers[0]), providerExpr = _a.providerExpr, providerFlags = _a.flags, depsExpr = _a.depsExpr;
    return {
        providerExpr: providerExpr,
        flags: providerFlags, depsExpr: depsExpr,
        tokenExpr: tokenExpr(ctx, providerAst.token),
    };
}
exports.providerDef = providerDef;
function multiProviderDef(ctx, flags, providers) {
    var allDepDefs = [];
    var allParams = [];
    var exprs = providers.map(function (provider, providerIndex) {
        var expr;
        if (provider.useClass) {
            var depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
            expr = ctx.importExpr(provider.useClass.reference).instantiate(depExprs);
        }
        else if (provider.useFactory) {
            var depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
            expr = ctx.importExpr(provider.useFactory.reference).callFn(depExprs);
        }
        else if (provider.useExisting) {
            var depExprs = convertDeps(providerIndex, [{ token: provider.useExisting }]);
            expr = depExprs[0];
        }
        else {
            expr = value_util_1.convertValueToOutputAst(ctx, provider.useValue);
        }
        return expr;
    });
    var providerExpr = o.fn(allParams, [new o.ReturnStatement(o.literalArr(exprs))], o.INFERRED_TYPE);
    return {
        providerExpr: providerExpr,
        flags: flags | 1024 /* TypeFactoryProvider */,
        depsExpr: o.literalArr(allDepDefs)
    };
    function convertDeps(providerIndex, deps) {
        return deps.map(function (dep, depIndex) {
            var paramName = "p" + providerIndex + "_" + depIndex;
            allParams.push(new o.FnParam(paramName, o.DYNAMIC_TYPE));
            allDepDefs.push(depDef(ctx, dep));
            return o.variable(paramName);
        });
    }
}
function singleProviderDef(ctx, flags, providerType, providerMeta) {
    var providerExpr;
    var deps;
    if (providerType === template_ast_1.ProviderAstType.Directive || providerType === template_ast_1.ProviderAstType.Component) {
        providerExpr = ctx.importExpr(providerMeta.useClass.reference);
        flags |= 16384 /* TypeDirective */;
        deps = providerMeta.deps || providerMeta.useClass.diDeps;
    }
    else {
        if (providerMeta.useClass) {
            providerExpr = ctx.importExpr(providerMeta.useClass.reference);
            flags |= 512 /* TypeClassProvider */;
            deps = providerMeta.deps || providerMeta.useClass.diDeps;
        }
        else if (providerMeta.useFactory) {
            providerExpr = ctx.importExpr(providerMeta.useFactory.reference);
            flags |= 1024 /* TypeFactoryProvider */;
            deps = providerMeta.deps || providerMeta.useFactory.diDeps;
        }
        else if (providerMeta.useExisting) {
            providerExpr = o.NULL_EXPR;
            flags |= 2048 /* TypeUseExistingProvider */;
            deps = [{ token: providerMeta.useExisting }];
        }
        else {
            providerExpr = value_util_1.convertValueToOutputAst(ctx, providerMeta.useValue);
            flags |= 256 /* TypeValueProvider */;
            deps = [];
        }
    }
    var depsExpr = o.literalArr(deps.map(function (dep) { return depDef(ctx, dep); }));
    return { providerExpr: providerExpr, flags: flags, depsExpr: depsExpr };
}
function tokenExpr(ctx, tokenMeta) {
    return tokenMeta.identifier ? ctx.importExpr(tokenMeta.identifier.reference) :
        o.literal(tokenMeta.value);
}
function depDef(ctx, dep) {
    // Note: the following fields have already been normalized out by provider_analyzer:
    // - isAttribute, isSelf, isHost
    var expr = dep.isValue ? value_util_1.convertValueToOutputAst(ctx, dep.value) : tokenExpr(ctx, dep.token);
    var flags = 0 /* None */;
    if (dep.isSkipSelf) {
        flags |= 1 /* SkipSelf */;
    }
    if (dep.isOptional) {
        flags |= 2 /* Optional */;
    }
    if (dep.isValue) {
        flags |= 8 /* Value */;
    }
    return flags === 0 /* None */ ? expr : o.literalArr([o.literal(flags), expr]);
}
exports.depDef = depDef;
function lifecycleHookToNodeFlag(lifecycleHook) {
    var nodeFlag = 0 /* None */;
    switch (lifecycleHook) {
        case lifecycle_reflector_1.LifecycleHooks.AfterContentChecked:
            nodeFlag = 2097152 /* AfterContentChecked */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterContentInit:
            nodeFlag = 1048576 /* AfterContentInit */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterViewChecked:
            nodeFlag = 8388608 /* AfterViewChecked */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterViewInit:
            nodeFlag = 4194304 /* AfterViewInit */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.DoCheck:
            nodeFlag = 262144 /* DoCheck */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnChanges:
            nodeFlag = 524288 /* OnChanges */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnDestroy:
            nodeFlag = 131072 /* OnDestroy */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnInit:
            nodeFlag = 65536 /* OnInit */;
            break;
    }
    return nodeFlag;
}
exports.lifecycleHookToNodeFlag = lifecycleHookToNodeFlag;
function componentFactoryResolverProviderDef(reflector, ctx, flags, entryComponents) {
    var entryComponentFactories = entryComponents.map(function (entryComponent) { return ctx.importExpr(entryComponent.componentFactory); });
    var token = identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.ComponentFactoryResolver);
    var classMeta = {
        diDeps: [
            { isValue: true, value: o.literalArr(entryComponentFactories) },
            { token: token, isSkipSelf: true, isOptional: true },
            { token: identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.NgModuleRef) },
        ],
        lifecycleHooks: [],
        reference: reflector.resolveExternalReference(identifiers_1.Identifiers.CodegenComponentFactoryResolver)
    };
    var _a = singleProviderDef(ctx, flags, template_ast_1.ProviderAstType.PrivateService, {
        token: token,
        multi: false,
        useClass: classMeta,
    }), providerExpr = _a.providerExpr, providerFlags = _a.flags, depsExpr = _a.depsExpr;
    return { providerExpr: providerExpr, flags: providerFlags, depsExpr: depsExpr, tokenExpr: tokenExpr(ctx, token) };
}
exports.componentFactoryResolverProviderDef = componentFactoryResolverProviderDef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvdmlld19jb21waWxlci9wcm92aWRlcl9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQU1ILDhDQUE0RTtBQUM1RSw4REFBc0Q7QUFDdEQsd0NBQTBDO0FBQzFDLG1EQUE2RDtBQUM3RCxnRUFBNkU7QUFHN0UscUJBQTRCLEdBQWtCLEVBQUUsV0FBd0I7SUFNdEUsSUFBSSxLQUFLLGVBQWlCLENBQUM7SUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLDJCQUEwQixDQUFDO0lBQ2xDLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxLQUFLLDhCQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRSxLQUFLLDhCQUE2QixDQUFDO0lBQ3JDLENBQUM7SUFDRCxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGFBQWE7UUFDL0MscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxvQ0FBYyxDQUFDLFNBQVM7WUFDMUMsV0FBVyxDQUFDLFlBQVksS0FBSyw4QkFBZSxDQUFDLFNBQVM7WUFDdEQsV0FBVyxDQUFDLFlBQVksS0FBSyw4QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsS0FBSyxJQUFJLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNHLElBQUE7O3lGQUUrRSxFQUY5RSw4QkFBWSxFQUFFLHdCQUFvQixFQUFFLHNCQUFRLENBRW1DO0lBQ3RGLE1BQU0sQ0FBQztRQUNMLFlBQVksY0FBQTtRQUNaLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFB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