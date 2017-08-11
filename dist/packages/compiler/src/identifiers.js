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
import { ANALYZE_FOR_ENTRY_COMPONENTS, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, LOCALE_ID, NgModuleFactory, NgModuleRef, QueryList, Renderer, SecurityContext, TRANSLATIONS_FORMAT, TemplateRef, ViewContainerRef, ViewEncapsulation, ɵCodegenComponentFactoryResolver, ɵEMPTY_ARRAY, ɵEMPTY_MAP, ɵand, ɵccf, ɵcmf, ɵcrt, ɵdid, ɵeld, ɵinlineInterpolate, ɵinterpolate, ɵmod, ɵmpd, ɵncd, ɵnov, ɵpad, ɵpid, ɵpod, ɵppd, ɵprd, ɵqud, ɵregisterModuleFactory, ɵted, ɵunv, ɵvid } from '@angular/core';
const /** @type {?} */ CORE = '@angular/core';
export class Identifiers {
}
Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
    name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
    moduleName: CORE,
    runtime: ANALYZE_FOR_ENTRY_COMPONENTS
};
Identifiers.ElementRef = { name: 'ElementRef', moduleName: CORE, runtime: ElementRef };
Identifiers.NgModuleRef = { name: 'NgModuleRef', moduleName: CORE, runtime: NgModuleRef };
Identifiers.ViewContainerRef = { name: 'ViewContainerRef', moduleName: CORE, runtime: ViewContainerRef };
Identifiers.ChangeDetectorRef = {
    name: 'ChangeDetectorRef',
    moduleName: CORE,
    runtime: ChangeDetectorRef
};
Identifiers.QueryList = { name: 'QueryList', moduleName: CORE, runtime: QueryList };
Identifiers.TemplateRef = { name: 'TemplateRef', moduleName: CORE, runtime: TemplateRef };
Identifiers.CodegenComponentFactoryResolver = {
    name: 'ɵCodegenComponentFactoryResolver',
    moduleName: CORE,
    runtime: ɵCodegenComponentFactoryResolver
};
Identifiers.ComponentFactoryResolver = {
    name: 'ComponentFactoryResolver',
    moduleName: CORE,
    runtime: ComponentFactoryResolver
};
Identifiers.ComponentFactory = { name: 'ComponentFactory', moduleName: CORE, runtime: ComponentFactory };
Identifiers.ComponentRef = { name: 'ComponentRef', moduleName: CORE, runtime: ComponentRef };
Identifiers.NgModuleFactory = { name: 'NgModuleFactory', moduleName: CORE, runtime: NgModuleFactory };
Identifiers.createModuleFactory = {
    name: 'ɵcmf',
    moduleName: CORE,
    runtime: ɵcmf,
};
Identifiers.moduleDef = {
    name: 'ɵmod',
    moduleName: CORE,
    runtime: ɵmod,
};
Identifiers.moduleProviderDef = {
    name: 'ɵmpd',
    moduleName: CORE,
    runtime: ɵmpd,
};
Identifiers.RegisterModuleFactoryFn = {
    name: 'ɵregisterModuleFactory',
    moduleName: CORE,
    runtime: ɵregisterModuleFactory,
};
Identifiers.Injector = { name: 'Injector', moduleName: CORE, runtime: Injector };
Identifiers.ViewEncapsulation = {
    name: 'ViewEncapsulation',
    moduleName: CORE,
    runtime: ViewEncapsulation
};
Identifiers.ChangeDetectionStrategy = {
    name: 'ChangeDetectionStrategy',
    moduleName: CORE,
    runtime: ChangeDetectionStrategy
};
Identifiers.SecurityContext = {
    name: 'SecurityContext',
    moduleName: CORE,
    runtime: SecurityContext,
};
Identifiers.LOCALE_ID = { name: 'LOCALE_ID', moduleName: CORE, runtime: LOCALE_ID };
Identifiers.TRANSLATIONS_FORMAT = {
    name: 'TRANSLATIONS_FORMAT',
    moduleName: CORE,
    runtime: TRANSLATIONS_FORMAT
};
Identifiers.inlineInterpolate = {
    name: 'ɵinlineInterpolate',
    moduleName: CORE,
    runtime: ɵinlineInterpolate
};
Identifiers.interpolate = { name: 'ɵinterpolate', moduleName: CORE, runtime: ɵinterpolate };
Identifiers.EMPTY_ARRAY = { name: 'ɵEMPTY_ARRAY', moduleName: CORE, runtime: ɵEMPTY_ARRAY };
Identifiers.EMPTY_MAP = { name: 'ɵEMPTY_MAP', moduleName: CORE, runtime: ɵEMPTY_MAP };
Identifiers.Renderer = { name: 'Renderer', moduleName: CORE, runtime: Renderer };
Identifiers.viewDef = { name: 'ɵvid', moduleName: CORE, runtime: ɵvid };
Identifiers.elementDef = { name: 'ɵeld', moduleName: CORE, runtime: ɵeld };
Identifiers.anchorDef = { name: 'ɵand', moduleName: CORE, runtime: ɵand };
Identifiers.textDef = { name: 'ɵted', moduleName: CORE, runtime: ɵted };
Identifiers.directiveDef = { name: 'ɵdid', moduleName: CORE, runtime: ɵdid };
Identifiers.providerDef = { name: 'ɵprd', moduleName: CORE, runtime: ɵprd };
Identifiers.queryDef = { name: 'ɵqud', moduleName: CORE, runtime: ɵqud };
Identifiers.pureArrayDef = { name: 'ɵpad', moduleName: CORE, runtime: ɵpad };
Identifiers.pureObjectDef = { name: 'ɵpod', moduleName: CORE, runtime: ɵpod };
Identifiers.purePipeDef = { name: 'ɵppd', moduleName: CORE, runtime: ɵppd };
Identifiers.pipeDef = { name: 'ɵpid', moduleName: CORE, runtime: ɵpid };
Identifiers.nodeValue = { name: 'ɵnov', moduleName: CORE, runtime: ɵnov };
Identifiers.ngContentDef = { name: 'ɵncd', moduleName: CORE, runtime: ɵncd };
Identifiers.unwrapValue = { name: 'ɵunv', moduleName: CORE, runtime: ɵunv };
Identifiers.createRendererType2 = { name: 'ɵcrt', moduleName: CORE, runtime: ɵcrt };
Identifiers.RendererType2 = {
    name: 'RendererType2',
    moduleName: CORE,
    // type only
    runtime: null
};
Identifiers.ViewDefinition = {
    name: 'ɵViewDefinition',
    moduleName: CORE,
    // type only
    runtime: null
};
Identifiers.createComponentFactory = { name: 'ɵccf', moduleName: CORE, runtime: ɵccf };
function Identifiers_tsickle_Closure_declarations() {
    /** @type {?} */
    Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS;
    /** @type {?} */
    Identifiers.ElementRef;
    /** @type {?} */
    Identifiers.NgModuleRef;
    /** @type {?} */
    Identifiers.ViewContainerRef;
    /** @type {?} */
    Identifiers.ChangeDetectorRef;
    /** @type {?} */
    Identifiers.QueryList;
    /** @type {?} */
    Identifiers.TemplateRef;
    /** @type {?} */
    Identifiers.CodegenComponentFactoryResolver;
    /** @type {?} */
    Identifiers.ComponentFactoryResolver;
    /** @type {?} */
    Identifiers.ComponentFactory;
    /** @type {?} */
    Identifiers.ComponentRef;
    /** @type {?} */
    Identifiers.NgModuleFactory;
    /** @type {?} */
    Identifiers.createModuleFactory;
    /** @type {?} */
    Identifiers.moduleDef;
    /** @type {?} */
    Identifiers.moduleProviderDef;
    /** @type {?} */
    Identifiers.RegisterModuleFactoryFn;
    /** @type {?} */
    Identifiers.Injector;
    /** @type {?} */
    Identifiers.ViewEncapsulation;
    /** @type {?} */
    Identifiers.ChangeDetectionStrategy;
    /** @type {?} */
    Identifiers.SecurityContext;
    /** @type {?} */
    Identifiers.LOCALE_ID;
    /** @type {?} */
    Identifiers.TRANSLATIONS_FORMAT;
    /** @type {?} */
    Identifiers.inlineInterpolate;
    /** @type {?} */
    Identifiers.interpolate;
    /** @type {?} */
    Identifiers.EMPTY_ARRAY;
    /** @type {?} */
    Identifiers.EMPTY_MAP;
    /** @type {?} */
    Identifiers.Renderer;
    /** @type {?} */
    Identifiers.viewDef;
    /** @type {?} */
    Identifiers.elementDef;
    /** @type {?} */
    Identifiers.anchorDef;
    /** @type {?} */
    Identifiers.textDef;
    /** @type {?} */
    Identifiers.directiveDef;
    /** @type {?} */
    Identifiers.providerDef;
    /** @type {?} */
    Identifiers.queryDef;
    /** @type {?} */
    Identifiers.pureArrayDef;
    /** @type {?} */
    Identifiers.pureObjectDef;
    /** @type {?} */
    Identifiers.purePipeDef;
    /** @type {?} */
    Identifiers.pipeDef;
    /** @type {?} */
    Identifiers.nodeValue;
    /** @type {?} */
    Identifiers.ngContentDef;
    /** @type {?} */
    Identifiers.unwrapValue;
    /** @type {?} */
    Identifiers.createRendererType2;
    /** @type {?} */
    Identifiers.RendererType2;
    /** @type {?} */
    Identifiers.ViewDefinition;
    /** @type {?} */
    Identifiers.createComponentFactory;
}
/**
 * @param {?} reference
 * @return {?}
 */
export function createTokenForReference(reference) {
    return { identifier: { reference: reference } };
}
/**
 * @param {?} reflector
 * @param {?} reference
 * @return {?}
 */
export function createTokenForExternalReference(reflector, reference) {
    return createTokenForReference(reflector.resolveExternalReference(reference));
}
//# sourceMappingURL=identifiers.js.map