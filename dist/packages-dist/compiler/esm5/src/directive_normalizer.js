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
import { ViewEncapsulation, ɵstringify as stringify } from '@angular/core';
import { CompileStylesheetMetadata, CompileTemplateMetadata, templateSourceUrl } from './compile_metadata';
import { CompilerConfig } from './config';
import { CompilerInjectable } from './injectable';
import * as html from './ml_parser/ast';
import { HtmlParser } from './ml_parser/html_parser';
import { InterpolationConfig } from './ml_parser/interpolation_config';
import { ResourceLoader } from './resource_loader';
import { extractStyleUrls, isStyleUrlResolvable } from './style_url_resolver';
import { PreparsedElementType, preparseElement } from './template_parser/template_preparser';
import { UrlResolver } from './url_resolver';
import { SyncAsync, isDefined, syntaxError } from './util';
/**
 * @record
 */
export function PrenormalizedTemplateMetadata() { }
function PrenormalizedTemplateMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.ngModuleType;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.componentType;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.moduleUrl;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.template;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.templateUrl;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.styles;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.styleUrls;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.interpolation;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.encapsulation;
    /** @type {?} */
    PrenormalizedTemplateMetadata.prototype.animations;
}
var DirectiveNormalizer = (function () {
    /**
     * @param {?} _resourceLoader
     * @param {?} _urlResolver
     * @param {?} _htmlParser
     * @param {?} _config
     */
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        var /** @type {?} */ template = ((normalizedDirective.template));
        this._resourceLoaderCache.delete(/** @type {?} */ ((template.templateUrl)));
        template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(/** @type {?} */ ((stylesheet.moduleUrl))); });
    };
    /**
     * @param {?} url
     * @return {?}
     */
    DirectiveNormalizer.prototype._fetch = function (url) {
        var /** @type {?} */ result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    /**
     * @param {?} prenormData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
        var _this = this;
        if (isDefined(prenormData.template)) {
            if (isDefined(prenormData.templateUrl)) {
                throw syntaxError("'" + stringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
            }
            if (typeof prenormData.template !== 'string') {
                throw syntaxError("The template specified for component " + stringify(prenormData.componentType) + " is not a string");
            }
        }
        else if (isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw syntaxError("The templateUrl specified for component " + stringify(prenormData.componentType) + " is not a string");
            }
        }
        else {
            throw syntaxError("No template specified for component " + stringify(prenormData.componentType));
        }
        return SyncAsync.then(this.normalizeTemplateOnly(prenormData), function (result) { return _this.normalizeExternalStylesheets(result); });
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplateOnly = function (prenomData) {
        var _this = this;
        var /** @type {?} */ template;
        var /** @type {?} */ templateUrl;
        if (prenomData.template != null) {
            template = prenomData.template;
            templateUrl = prenomData.moduleUrl;
        }
        else {
            templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, /** @type {?} */ ((prenomData.templateUrl)));
            template = this._fetch(templateUrl);
        }
        return SyncAsync.then(template, function (template) { return _this.normalizeLoadedTemplate(prenomData, template, templateUrl); });
    };
    /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (prenormData, template, templateAbsUrl) {
        var /** @type {?} */ isInline = !!prenormData.template;
        var /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((prenormData.interpolation)));
        var /** @type {?} */ rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline: isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            var /** @type {?} */ errorString = rootNodesAndErrors.errors.join('\n');
            throw syntaxError("Template parse errors:\n" + errorString);
        }
        var /** @type {?} */ templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
            styles: prenormData.styles,
            styleUrls: prenormData.styleUrls,
            moduleUrl: prenormData.moduleUrl
        }));
        var /** @type {?} */ visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        var /** @type {?} */ templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        var /** @type {?} */ encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        var /** @type {?} */ styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var /** @type {?} */ styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation, isInline: isInline,
            externalStylesheets: []
        });
    };
    /**
     * @param {?} templateMeta
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeExternalStylesheets = function (templateMeta) {
        return SyncAsync.then(this._loadMissingExternalStylesheets(templateMeta.styleUrls), function (externalStylesheets) { return new CompileTemplateMetadata({
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
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return SyncAsync.then(SyncAsync.all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return SyncAsync.then(_this._fetch(styleUrl), function (loadedStyle) {
            var /** @type {?} */ stylesheet = _this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); })), function (_) { return Array.from(loadedStylesheets.values()); });
    };
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeStylesheet = function (stylesheet) {
        var _this = this;
        var /** @type {?} */ moduleUrl = ((stylesheet.moduleUrl));
        var /** @type {?} */ allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(moduleUrl, url); });
        var /** @type {?} */ allStyles = stylesheet.styles.map(function (style) {
            var /** @type {?} */ styleWithImports = extractStyleUrls(_this._urlResolver, moduleUrl, style);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    };
    return DirectiveNormalizer;
}());
export { DirectiveNormalizer };
DirectiveNormalizer.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
DirectiveNormalizer.ctorParameters = function () { return [
    { type: ResourceLoader, },
    { type: UrlResolver, },
    { type: HtmlParser, },
    { type: CompilerConfig, },
]; };
function DirectiveNormalizer_tsickle_Closure_declarations() {
    /** @type {?} */
    DirectiveNormalizer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DirectiveNormalizer.ctorParameters;
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoaderCache;
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoader;
    /** @type {?} */
    DirectiveNormalizer.prototype._urlResolver;
    /** @type {?} */
    DirectiveNormalizer.prototype._htmlParser;
    /** @type {?} */
    DirectiveNormalizer.prototype._config;
}
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var /** @type {?} */ preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                var /** @type {?} */ textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html.Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case PreparsedElementType.STYLESHEET:
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
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { html.visitAll(this, ast.cases); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) {
        html.visitAll(this, ast.expression);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
function TemplatePreparseVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngContentSelectors;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styles;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styleUrls;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngNonBindableStackCount;
}
//# sourceMappingURL=directive_normalizer.js.map