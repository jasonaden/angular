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
var core_1 = require("@angular/core");
var compile_metadata_1 = require("./compile_metadata");
var injectable_1 = require("./injectable");
var o = require("./output/output_ast");
var shadow_css_1 = require("./shadow_css");
var url_resolver_1 = require("./url_resolver");
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = (function () {
    function StylesCompileDependency(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
    }
    return StylesCompileDependency;
}());
exports.StylesCompileDependency = StylesCompileDependency;
var CompiledStylesheet = (function () {
    function CompiledStylesheet(outputCtx, stylesVar, dependencies, isShimmed, meta) {
        this.outputCtx = outputCtx;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
    return CompiledStylesheet;
}());
exports.CompiledStylesheet = CompiledStylesheet;
var StyleCompiler = (function () {
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new shadow_css_1.ShadowCss();
    }
    StyleCompiler.prototype.compileComponent = function (outputCtx, comp) {
        var template = comp.template;
        return this._compileStyles(outputCtx, comp, new compile_metadata_1.CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: compile_metadata_1.identifierModuleUrl(comp.type)
        }), true);
    };
    StyleCompiler.prototype.compileStyles = function (outputCtx, comp, stylesheet) {
        return this._compileStyles(outputCtx, comp, stylesheet, false);
    };
    StyleCompiler.prototype.needsStyleShim = function (comp) {
        return comp.template.encapsulation === core_1.ViewEncapsulation.Emulated;
    };
    StyleCompiler.prototype._compileStyles = function (outputCtx, comp, stylesheet, isComponentStylesheet) {
        var _this = this;
        var shim = this.needsStyleShim(comp);
        var styleExpressions = stylesheet.styles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        var dependencies = [];
        stylesheet.styleUrls.forEach(function (styleUrl) {
            var exprIndex = styleExpressions.length;
            // Note: This placeholder will be filled later.
            styleExpressions.push(null);
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, function (value) { return styleExpressions[exprIndex] = outputCtx.importExpr(value); }));
        });
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, isComponentStylesheet ? [o.StmtModifier.Final] : [
            o.StmtModifier.Final, o.StmtModifier.Exported
        ]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
    };
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    return StyleCompiler;
}());
StyleCompiler = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [url_resolver_1.UrlResolver])
], StyleCompiler);
exports.StyleCompiler = StyleCompiler;
function getStylesVarName(component) {
    var result = "styles";
    if (component) {
        result += "_" + compile_metadata_1.identifierName(component.type);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBZ0Q7QUFFaEQsdURBQXVKO0FBQ3ZKLDJDQUFnRDtBQUNoRCx1Q0FBeUM7QUFDekMsMkNBQXVDO0FBQ3ZDLCtDQUEyQztBQUczQyxJQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxJQUFNLFNBQVMsR0FBRyxhQUFXLGtCQUFvQixDQUFDO0FBQ2xELElBQU0sWUFBWSxHQUFHLGdCQUFjLGtCQUFvQixDQUFDO0FBRXhEO0lBQ0UsaUNBQ1csSUFBWSxFQUFTLFNBQWlCLEVBQVMsUUFBOEI7UUFBN0UsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFzQjtJQUFHLENBQUM7SUFDOUYsOEJBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLDBEQUF1QjtBQUtwQztJQUNFLDRCQUNXLFNBQXdCLEVBQVMsU0FBaUIsRUFDbEQsWUFBdUMsRUFBUyxTQUFrQixFQUNsRSxJQUErQjtRQUYvQixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNsRCxpQkFBWSxHQUFaLFlBQVksQ0FBMkI7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xFLFNBQUksR0FBSixJQUFJLENBQTJCO0lBQUcsQ0FBQztJQUNoRCx5QkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksZ0RBQWtCO0FBUS9CLElBQWEsYUFBYTtJQUd4Qix1QkFBb0IsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7UUFGckMsZUFBVSxHQUFjLElBQUksc0JBQVMsRUFBRSxDQUFDO0lBRUEsQ0FBQztJ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