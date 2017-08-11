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
export class DirectiveNormalizer {
    /**
     * @param {?} _resourceLoader
     * @param {?} _urlResolver
     * @param {?} _htmlParser
     * @param {?} _config
     */
    constructor(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    clearCache() { this._resourceLoaderCache.clear(); }
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    clearCacheFor(normalizedDirective) {
        if (!normalizedDirective.isComponent) {
            return;
        }
        const /** @type {?} */ template = ((normalizedDirective.template));
        this._resourceLoaderCache.delete(/** @type {?} */ ((template.templateUrl)));
        template.externalStylesheets.forEach((stylesheet) => { this._resourceLoaderCache.delete(/** @type {?} */ ((stylesheet.moduleUrl))); });
    }
    /**
     * @param {?} url
     * @return {?}
     */
    _fetch(url) {
        let /** @type {?} */ result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    }
    /**
     * @param {?} prenormData
     * @return {?}
     */
    normalizeTemplate(prenormData) {
        if (isDefined(prenormData.template)) {
            if (isDefined(prenormData.templateUrl)) {
                throw syntaxError(`'${stringify(prenormData.componentType)}' component cannot define both template and templateUrl`);
            }
            if (typeof prenormData.template !== 'string') {
                throw syntaxError(`The template specified for component ${stringify(prenormData.componentType)} is not a string`);
            }
        }
        else if (isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw syntaxError(`The templateUrl specified for component ${stringify(prenormData.componentType)} is not a string`);
            }
        }
        else {
            throw syntaxError(`No template specified for component ${stringify(prenormData.componentType)}`);
        }
        return SyncAsync.then(this.normalizeTemplateOnly(prenormData), (result) => this.normalizeExternalStylesheets(result));
    }
    /**
     * @param {?} prenomData
     * @return {?}
     */
    normalizeTemplateOnly(prenomData) {
        let /** @type {?} */ template;
        let /** @type {?} */ templateUrl;
        if (prenomData.template != null) {
            template = prenomData.template;
            templateUrl = prenomData.moduleUrl;
        }
        else {
            templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, /** @type {?} */ ((prenomData.templateUrl)));
            template = this._fetch(templateUrl);
        }
        return SyncAsync.then(template, (template) => this.normalizeLoadedTemplate(prenomData, template, templateUrl));
    }
    /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    normalizeLoadedTemplate(prenormData, template, templateAbsUrl) {
        const /** @type {?} */ isInline = !!prenormData.template;
        const /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((prenormData.interpolation)));
        const /** @type {?} */ rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            const /** @type {?} */ errorString = rootNodesAndErrors.errors.join('\n');
            throw syntaxError(`Template parse errors:\n${errorString}`);
        }
        const /** @type {?} */ templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
            styles: prenormData.styles,
            styleUrls: prenormData.styleUrls,
            moduleUrl: prenormData.moduleUrl
        }));
        const /** @type {?} */ visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        const /** @type {?} */ templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        let /** @type {?} */ encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        const /** @type {?} */ styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        const /** @type {?} */ styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation,
            template,
            templateUrl: templateAbsUrl, styles, styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation, isInline,
            externalStylesheets: []
        });
    }
    /**
     * @param {?} templateMeta
     * @return {?}
     */
    normalizeExternalStylesheets(templateMeta) {
        return SyncAsync.then(this._loadMissingExternalStylesheets(templateMeta.styleUrls), (externalStylesheets) => new CompileTemplateMetadata({
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
        }));
    }
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    _loadMissingExternalStylesheets(styleUrls, loadedStylesheets = new Map()) {
        return SyncAsync.then(SyncAsync.all(styleUrls.filter((styleUrl) => !loadedStylesheets.has(styleUrl))
            .map(styleUrl => SyncAsync.then(this._fetch(styleUrl), (loadedStyle) => {
            const /** @type {?} */ stylesheet = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }))), (_) => Array.from(loadedStylesheets.values()));
    }
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    normalizeStylesheet(stylesheet) {
        const /** @type {?} */ moduleUrl = ((stylesheet.moduleUrl));
        const /** @type {?} */ allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(moduleUrl, url));
        const /** @type {?} */ allStyles = stylesheet.styles.map(style => {
            const /** @type {?} */ styleWithImports = extractStyleUrls(this._urlResolver, moduleUrl, style);
            allStyleUrls.push(...styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    }
}
DirectiveNormalizer.decorators = [
    { type: CompilerInjectable },
];
/** @nocollapse */
DirectiveNormalizer.ctorParameters = () => [
    { type: ResourceLoader, },
    { type: UrlResolver, },
    { type: HtmlParser, },
    { type: CompilerConfig, },
];
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
class TemplatePreparseVisitor {
    constructor() {
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
    visitElement(ast, context) {
        const /** @type {?} */ preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                let /** @type {?} */ textContent = '';
                ast.children.forEach(child => {
                    if (child instanceof html.Text) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
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
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExpansion(ast, context) { html.visitAll(this, ast.cases); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(ast, context) {
        html.visitAll(this, ast.expression);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitComment(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAttribute(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitText(ast, context) { return null; }
}
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