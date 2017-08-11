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
var config_1 = require("./config");
var injectable_1 = require("./injectable");
var html = require("./ml_parser/ast");
var html_parser_1 = require("./ml_parser/html_parser");
var interpolation_config_1 = require("./ml_parser/interpolation_config");
var resource_loader_1 = require("./resource_loader");
var style_url_resolver_1 = require("./style_url_resolver");
var template_preparser_1 = require("./template_parser/template_preparser");
var url_resolver_1 = require("./url_resolver");
var util_1 = require("./util");
var DirectiveNormalizer = (function () {
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
    DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        var template = normalizedDirective.template;
        this._resourceLoaderCache.delete(template.templateUrl);
        template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(stylesheet.moduleUrl); });
    };
    DirectiveNormalizer.prototype._fetch = function (url) {
        var result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
        var _this = this;
        if (util_1.isDefined(prenormData.template)) {
            if (util_1.isDefined(prenormData.templateUrl)) {
                throw util_1.syntaxError("'" + core_1.ɵstringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
            }
            if (typeof prenormData.template !== 'string') {
                throw util_1.syntaxError("The template specified for component " + core_1.ɵstringify(prenormData.componentType) + " is not a string");
            }
        }
        else if (util_1.isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw util_1.syntaxError("The templateUrl specified for component " + core_1.ɵstringify(prenormData.componentType) + " is not a string");
            }
        }
        else {
            throw util_1.syntaxError("No template specified for component " + core_1.ɵstringify(prenormData.componentType));
        }
        return util_1.SyncAsync.then(this.normalizeTemplateOnly(prenormData), function (result) { return _this.normalizeExternalStylesheets(result); });
    };
    DirectiveNormalizer.prototype.normalizeTemplateOnly = function (prenomData) {
        var _this = this;
        var template;
        var templateUrl;
        if (prenomData.template != null) {
            template = prenomData.template;
            templateUrl = prenomData.moduleUrl;
        }
        else {
            templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, prenomData.templateUrl);
            template = this._fetch(templateUrl);
        }
        return util_1.SyncAsync.then(template, function (template) { return _this.normalizeLoadedTemplate(prenomData, template, templateUrl); });
    };
    DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (prenormData, template, templateAbsUrl) {
        var isInline = !!prenormData.template;
        var interpolationConfig = interpolation_config_1.InterpolationConfig.fromArray(prenormData.interpolation);
        var rootNodesAndErrors = this._htmlParser.parse(template, compile_metadata_1.templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline: isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw util_1.syntaxError("Template parse errors:\n" + errorString);
        }
        var templateMetadataStyles = this.normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({
            styles: prenormData.styles,
            styleUrls: prenormData.styleUrls,
            moduleUrl: prenormData.moduleUrl
        }));
        var visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        var templateStyles = this.normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        var encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        var styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === core_1.ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = core_1.ViewEncapsulation.None;
        }
        return new compile_metadata_1.CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation, isInline: isInline,
            externalStylesheets: []
        });
    };
    DirectiveNormalizer.prototype.normalizeExternalStylesheets = function (templateMeta) {
        return util_1.SyncAsync.then(this._loadMissingExternalStylesheets(templateMeta.styleUrls), function (externalStylesheets) { return new compile_metadata_1.CompileTemplateMetadata({
            encapsulation: templateMeta.encapsulation,
            template: templateMeta.template,
            templateUrl: templateMeta.templateUrl,
            styles: templateMeta.styles,
            styleUrls: templateMeta.styleUrls,
            externalStylesheets: externalStylesheets,
            ngContentSelectors: templateMeta.ngContentSelectors,
            animations: templateMeta.animations,
            interpolation: templateMeta.interpolation,
            isInline: templateMeta.isInline,
        }); });
    };
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return util_1.SyncAsync.then(util_1.SyncAsync.all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return util_1.SyncAsync.then(_this._fetch(styleUrl), function (loadedStyle) {
            var stylesheet = _this.normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); })), function (_) { return Array.from(loadedStylesheets.values()); });
    };
    DirectiveNormalizer.prototype.normalizeStylesheet = function (stylesheet) {
        var _this = this;
        var moduleUrl = stylesheet.moduleUrl;
        var allStyleUrls = stylesheet.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(moduleUrl, url); });
        var allStyles = stylesheet.styles.map(function (style) {
            var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, moduleUrl, style);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new compile_metadata_1.CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    };
    return DirectiveNormalizer;
}());
DirectiveNormalizer = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [resource_loader_1.ResourceLoader, url_resolver_1.UrlResolver,
        html_parser_1.HtmlParser, config_1.CompilerConfig])
], DirectiveNormalizer);
exports.DirectiveNormalizer = DirectiveNormalizer;
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var preparsedElement = template_preparser_1.preparseElement(ast);
        switch (preparsedElement.type) {
            case template_preparser_1.PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case template_preparser_1.PreparsedElementType.STYLE:
                var textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html.Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case template_preparser_1.PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        html.visitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { html.visitAll(this, ast.cases); };
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) {
        html.visitAll(this, ast.expression);
    };
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvZGlyZWN0aXZlX25vcm1hbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUU7QUFFekUsdURBQWtLO0FBQ2xLLG1DQUF3QztBQUN4QywyQ0FBZ0Q7QUFDaEQsc0NBQXdDO0FBQ3hDLHVEQUFtRDtBQUNuRCx5RUFBcUU7QUFDckUscURBQWlEO0FBQ2pELDJEQUE0RTtBQUM1RSwyRUFBMkY7QUFDM0YsK0NBQTJDO0FBQzNDLCtCQUF5RDtBQWdCekQsSUFBYSxtQkFBbUI7SUFHOUIsNkJBQ1ksZUFBK0IsRUFBVSxZQUF5QixFQUNsRSxXQUF1QixFQUFVLE9BQXVCO1FBRHhELG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQ2xFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFKNUQseUJBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQTZCLENBQUM7SUFJRyxDQUFDO0lBRXhFLHdDQUFVLEdBQVYsY0FBcUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6RCwyQ0FBYSxHQUFiLFVBQWMsbUJBQTZDO1FBQTNELGlCQVFDO1FBUEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQztRQUNULENBQUM7UUFDRCxJQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxRQUFVLENBQUM7UUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBYSxDQUFDLENBQUM7UUFDekQsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8s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