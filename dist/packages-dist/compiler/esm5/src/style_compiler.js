/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewEncapsulation } from '@angular/core';
import { CompileStylesheetMetadata, identifierModuleUrl, identifierName } from './compile_metadata';
import { CompilerInjectable } from './injectable';
import * as o from './output/output_ast';
import { ShadowCss } from './shadow_css';
import { UrlResolver } from './url_resolver';
var /** @type {?} */ COMPONENT_VARIABLE = '%COMP%';
var /** @type {?} */ HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var /** @type {?} */ CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = (function () {
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} setValue
     */
    function StylesCompileDependency(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
    }
    return StylesCompileDependency;
}());
export { StylesCompileDependency };
function StylesCompileDependency_tsickle_Closure_declarations() {
    /** @type {?} */
    StylesCompileDependency.prototype.name;
    /** @type {?} */
    StylesCompileDependency.prototype.moduleUrl;
    /** @type {?} */
    StylesCompileDependency.prototype.setValue;
}
var CompiledStylesheet = (function () {
    /**
     * @param {?} outputCtx
     * @param {?} stylesVar
     * @param {?} dependencies
     * @param {?} isShimmed
     * @param {?} meta
     */
    function CompiledStylesheet(outputCtx, stylesVar, dependencies, isShimmed, meta) {
        this.outputCtx = outputCtx;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
    return CompiledStylesheet;
}());
export { CompiledStylesheet };
function CompiledStylesheet_tsickle_Closure_declarations() {
    /** @type {?} */
    CompiledStylesheet.prototype.outputCtx;
    /** @type {?} */
    CompiledStylesheet.prototype.stylesVar;
    /** @type {?} */
    CompiledStylesheet.prototype.dependencies;
    /** @type {?} */
    CompiledStylesheet.prototype.isShimmed;
    /** @type {?} */
    CompiledStylesheet.prototype.meta;
}
var StyleCompiler = (function () {
    /**
     * @param {?} _urlResolver
     */
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.compileComponent = function (outputCtx, comp) {
        var /** @type {?} */ template = ((comp.template));
        return this._compileStyles(outputCtx, comp, new CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), true);
    };
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @return {?}
     */
    StyleCompiler.prototype.compileStyles = function (outputCtx, comp, stylesheet) {
        return this._compileStyles(outputCtx, comp, stylesheet, false);
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.needsStyleShim = function (comp) {
        return ((comp.template)).encapsulation === ViewEncapsulation.Emulated;
    };
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    StyleCompiler.prototype._compileStyles = function (outputCtx, comp, stylesheet, isComponentStylesheet) {
        var _this = this;
        var /** @type {?} */ shim = this.needsStyleShim(comp);
        var /** @type {?} */ styleExpressions = stylesheet.styles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        var /** @type {?} */ dependencies = [];
        stylesheet.styleUrls.forEach(function (styleUrl) {
            var /** @type {?} */ exprIndex = styleExpressions.length;
            // Note: This placeholder will be filled later.
            styleExpressions.push(/** @type {?} */ ((null)));
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, function (value) { return styleExpressions[exprIndex] = outputCtx.importExpr(value); }));
        });
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var /** @type {?} */ stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var /** @type {?} */ stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, isComponentStylesheet ? [o.StmtModifier.Final] : [
            o.StmtModifier.Final, o.StmtModifier.Exported
        ]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
    };
    /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    return StyleCompiler;
}());
export { StyleCompiler };
StyleCompiler.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
StyleCompiler.ctorParameters = function () { return [
    { type: UrlResolver, },
]; };
function StyleCompiler_tsickle_Closure_declarations() {
    /** @type {?} */
    StyleCompiler.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    StyleCompiler.ctorParameters;
    /** @type {?} */
    StyleCompiler.prototype._shadowCss;
    /** @type {?} */
    StyleCompiler.prototype._urlResolver;
}
/**
 * @param {?} component
 * @return {?}
 */
function getStylesVarName(component) {
    var /** @type {?} */ result = "styles";
    if (component) {
        result += "_" + identifierName(component.type);
    }
    return result;
}
//# sourceMappingURL=style_compiler.js.map