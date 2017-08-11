"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CORE = '@angular/core';
var Identifiers = (function () {
    function Identifiers() {
    }
    return Identifiers;
}());
Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
    name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
    moduleName: CORE,
    runtime: core_1.ANALYZE_FOR_ENTRY_COMPONENTS
};
Identifiers.ElementRef = { name: 'ElementRef', moduleName: CORE, runtime: core_1.ElementRef };
Identifiers.NgModuleRef = { name: 'NgModuleRef', moduleName: CORE, runtime: core_1.NgModuleRef };
Identifiers.ViewContainerRef = { name: 'ViewContainerRef', moduleName: CORE, runtime: core_1.ViewContainerRef };
Identifiers.ChangeDetectorRef = {
    name: 'ChangeDetectorRef',
    moduleName: CORE,
    runtime: core_1.ChangeDetectorRef
};
Identifiers.QueryList = { name: 'QueryList', moduleName: CORE, runtime: core_1.QueryList };
Identifiers.TemplateRef = { name: 'TemplateRef', moduleName: CORE, runtime: core_1.TemplateRef };
Identifiers.CodegenComponentFactoryResolver = {
    name: 'ɵCodegenComponentFactoryResolver',
    moduleName: CORE,
    runtime: core_1.ɵCodegenComponentFactoryResolver
};
Identifiers.ComponentFactoryResolver = {
    name: 'ComponentFactoryResolver',
    moduleName: CORE,
    runtime: core_1.ComponentFactoryResolver
};
Identifiers.ComponentFactory = { name: 'ComponentFactory', moduleName: CORE, runtime: core_1.ComponentFactory };
Identifiers.ComponentRef = { name: 'ComponentRef', moduleName: CORE, runtime: core_1.ComponentRef };
Identifiers.NgModuleFactory = { name: 'NgModuleFactory', moduleName: CORE, runtime: core_1.NgModuleFactory };
Identifiers.createModuleFactory = {
    name: 'ɵcmf',
    moduleName: CORE,
    runtime: core_1.ɵcmf,
};
Identifiers.moduleDef = {
    name: 'ɵmod',
    moduleName: CORE,
    runtime: core_1.ɵmod,
};
Identifiers.moduleProviderDef = {
    name: 'ɵmpd',
    moduleName: CORE,
    runtime: core_1.ɵmpd,
};
Identifiers.RegisterModuleFactoryFn = {
    name: 'ɵregisterModuleFactory',
    moduleName: CORE,
    runtime: core_1.ɵregisterModuleFactory,
};
Identifiers.Injector = { name: 'Injector', moduleName: CORE, runtime: core_1.Injector };
Identifiers.ViewEncapsulation = {
    name: 'ViewEncapsulation',
    moduleName: CORE,
    runtime: core_1.ViewEncapsulation
};
Identifiers.ChangeDetectionStrategy = {
    name: 'ChangeDetectionStrategy',
    moduleName: CORE,
    runtime: core_1.ChangeDetectionStrategy
};
Identifiers.SecurityContext = {
    name: 'SecurityContext',
    moduleName: CORE,
    runtime: core_1.SecurityContext,
};
Identifiers.LOCALE_ID = { name: 'LOCALE_ID', moduleName: CORE, runtime: core_1.LOCALE_ID };
Identifiers.TRANSLATIONS_FORMAT = {
    name: 'TRANSLATIONS_FORMAT',
    moduleName: CORE,
    runtime: core_1.TRANSLATIONS_FORMAT
};
Identifiers.inlineInterpolate = {
    name: 'ɵinlineInterpolate',
    moduleName: CORE,
    runtime: core_1.ɵinlineInterpolate
};
Identifiers.interpolate = { name: 'ɵinterpolate', moduleName: CORE, runtime: core_1.ɵinterpolate };
Identifiers.EMPTY_ARRAY = { name: 'ɵEMPTY_ARRAY', moduleName: CORE, runtime: core_1.ɵEMPTY_ARRAY };
Identifiers.EMPTY_MAP = { name: 'ɵEMPTY_MAP', moduleName: CORE, runtime: core_1.ɵEMPTY_MAP };
Identifiers.Renderer = { name: 'Renderer', moduleName: CORE, runtime: core_1.Renderer };
Identifiers.viewDef = { name: 'ɵvid', moduleName: CORE, runtime: core_1.ɵvid };
Identifiers.elementDef = { name: 'ɵeld', moduleName: CORE, runtime: core_1.ɵeld };
Identifiers.anchorDef = { name: 'ɵand', moduleName: CORE, runtime: core_1.ɵand };
Identifiers.textDef = { name: 'ɵted', moduleName: CORE, runtime: core_1.ɵted };
Identifiers.directiveDef = { name: 'ɵdid', moduleName: CORE, runtime: core_1.ɵdid };
Identifiers.providerDef = { name: 'ɵprd', moduleName: CORE, runtime: core_1.ɵprd };
Identifiers.queryDef = { name: 'ɵqud', moduleName: CORE, runtime: core_1.ɵqud };
Identifiers.pureArrayDef = { name: 'ɵpad', moduleName: CORE, runtime: core_1.ɵpad };
Identifiers.pureObjectDef = { name: 'ɵpod', moduleName: CORE, runtime: core_1.ɵpod };
Identifiers.purePipeDef = { name: 'ɵppd', moduleName: CORE, runtime: core_1.ɵppd };
Identifiers.pipeDef = { name: 'ɵpid', moduleName: CORE, runtime: core_1.ɵpid };
Identifiers.nodeValue = { name: 'ɵnov', moduleName: CORE, runtime: core_1.ɵnov };
Identifiers.ngContentDef = { name: 'ɵncd', moduleName: CORE, runtime: core_1.ɵncd };
Identifiers.unwrapValue = { name: 'ɵunv', moduleName: CORE, runtime: core_1.ɵunv };
Identifiers.createRendererType2 = { name: 'ɵcrt', moduleName: CORE, runtime: core_1.ɵcrt };
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
Identifiers.createComponentFactory = { name: 'ɵccf', moduleName: CORE, runtime: core_1.ɵccf };
exports.Identifiers = Identifiers;
function createTokenForReference(reference) {
    return { identifier: { reference: reference } };
}
exports.createTokenForReference = createTokenForReference;
function createTokenForExternalReference(reflector, reference) {
    return createTokenForReference(reflector.resolveExternalReference(reference));
}
exports.createTokenForExternalReference = createTokenForExternalReference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaWRlbnRpZmllcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBcWpCO0FBTXJqQixJQUFNLElBQUksR0FBRyxlQUFlLENBQUM7QUFFN0I7SUFBQTtJQXVIQSxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBdkhEO0FBQ1Msd0NBQTRCLEdBQXdCO0lBQ3pELElBQUksRUFBRSw4QkFBOEI7SUFDcEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLG1DQUE0QjtDQUN0QyxDQUFDO0FBQ0ssc0JBQVUsR0FDUyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsaUJBQVUsRUFBQyxDQUFDO0FBQy9FLHVCQUFXLEdBQ1EsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGtCQUFXLEVBQUMsQ0FBQztBQUNqRiw0QkFBZ0IsR0FDRyxFQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSx1QkFBZ0IsRUFBQyxDQUFDO0FBQzNGLDZCQUFpQixHQUF3QjtJQUM5QyxJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSx3QkFBaUI7Q0FDM0IsQ0FBQztBQUNLLHFCQUFTLEdBQXdCLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBUyxFQUFDLENBQUM7QUFDM0YsdUJBQVcsR0FDUSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsa0JBQVcsRUFBQyxDQUFDO0FBQ2pGLDJDQUErQixHQUF3QjtJQUM1RCxJQUFJLEVBQUUsa0NBQWtDO0lBQ3hDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSx1Q0FBZ0M7Q0FDMUMsQ0FBQztBQUNLLG9DQUF3QixHQUF3QjtJQUNyRCxJQUFJLEVBQUUsMEJBQTBCO0lBQ2hDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSwrQkFBd0I7Q0FDbEMsQ0FBQztBQUNLLDRCQUFnQixHQUNHLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLHVCQUFnQixFQUFDLENBQUM7QUFDM0Ysd0JBQVksR0FDTyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsbUJBQVksRUFBQyxDQUFDO0FBQ25GLDJCQUFlLEdBQ0ksRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsc0JBQWUsRUFBQyxDQUFDO0FBQ3pGLCtCQUFtQixHQUF3QjtJQUNoRCxJQUFJLEVBQUUsTUFBTTtJQUNaLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxXQUFJO0NBQ2QsQ0FBQztBQUNLLHFCQUFTLEdBQXdCO0lBQ3RDLElBQUksRUFBRSxNQUFNO0lBQ1osVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLFdBQUk7Q0FDZCxDQUFDO0FBQ0ssNkJBQWlCLEdBQXdCO0lBQzlDLElBQUksRUFBRSxNQUFNO0lBQ1osVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLFdBQUk7Q0FDZCxDQUFDO0FBQ0ssbUNBQXVCLEdBQXdCO0lBQ3BELElBQUksRUFBRSx3QkFBd0I7SUFDOUIsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLDZCQUFzQjtDQUNoQyxDQUFDO0FBQ0ssb0JBQVEsR0FBd0IsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGVBQVEsRUFBQyxDQUFDO0FBQ3hGLDZCQUFpQixHQUF3QjtJQUM5QyxJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSx3QkFBaUI7Q0FDM0IsQ0FBQztBQUNLLG1DQUF1QixHQUF3QjtJQUNwRCxJQUFJLEVBQUUseUJBQXlCO0lBQy9CLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSw4QkFBdUI7Q0FDakMsQ0FBQztBQUNLLDJCQUFlLEdBQXdCO0lBQzVDLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLHNCQUFlO0NBQ3pCLENBQUM7QUFDSyxxQkFBUyxHQUF3QixFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsZ0JBQVMsRUFBQyxDQUFDO0FBQzNGLCtCQUFtQixHQUF3QjtJQUNoRCxJQUFJLEVBQUUscUJBQXFCO0lBQzNCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSwwQkFBbUI7Q0FDN0IsQ0FBQztBQUNLLDZCQUFpQixHQUF3QjtJQUM5QyxJQUFJLEVBQUUsb0JBQW9CO0lBQzFCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSx5QkFBa0I7Q0FDNUIsQ0FBQztBQUNLLHVCQUFXLEdBQ1EsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLG1CQUFZLEVBQUMsQ0FBQztBQUNuRix1QkFBVyxHQUNRLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxtQkFBWSxFQUFDLENBQUM7QUFDbkYscUJBQVMsR0FDVSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsaUJBQVUsRUFBQyxDQUFDO0FBQy9FLG9CQUFRLEdBQXdCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxlQUFRLEVBQUMsQ0FBQztBQUN4RixtQkFBTyxHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDL0Usc0JBQVUsR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQUksRUFBQyxDQUFDO0FBQ2xGLHFCQUFTLEdBQXdCLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFJLEVBQUMsQ0FBQztBQUNqRixtQkFBTyxHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDL0Usd0JBQVksR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQUksRUFBQyxDQUFDO0FBQ3BGLHVCQUFXLEdBQXdCLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFJLEVBQUMsQ0FBQztBQUNuRixvQkFBUSxHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDaEYsd0JBQVksR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQUksRUFBQyxDQUFDO0FBQ3BGLHlCQUFhLEdBQXdCLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFJLEVBQUMsQ0FBQztBQUNyRix1QkFBVyxHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDbkYsbUJBQU8sR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQUksRUFBQyxDQUFDO0FBQy9FLHFCQUFTLEdBQXdCLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFJLEVBQUMsQ0FBQztBQUNqRix3QkFBWSxHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDcEYsdUJBQVcsR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQUksRUFBQyxDQUFDO0FBQ25GLCtCQUFtQixHQUF3QixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBSSxFQUFDLENBQUM7QUFDM0YseUJBQWEsR0FBd0I7SUFDMUMsSUFBSSxFQUFFLGVBQWU7SUFDckIsVUFBVSxFQUFFLElBQUk7SUFDaEIsWUFBWTtJQUNaLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUNLLDBCQUFjLEdBQXdCO0lBQzNDLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsVUFBVSxFQUFFLElBQUk7SUFDaEIsWUFBWTtJQUNaLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUNLLGtDQUFzQixHQUNILEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFJLEVBQUMsQ0FBQztBQXRIL0Qsa0NBQVc7QUF5SHhCLGlDQUF3QyxTQUFjO0lBQ3BELE1BQU0sQ0FBQyxFQUFDLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsRUFBQyxDQUFDO0FBQzlDLENBQUM7QUFGRCwwREFFQztBQUVELHlDQUNJLFNBQTJCLEVBQUUsU0FBOEI7SUFDN0QsTUFBTSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFIRCwwRUFHQyJ9