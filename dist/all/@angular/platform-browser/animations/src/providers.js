"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animation_builder_1 = require("./animation_builder");
var animation_renderer_1 = require("./animation_renderer");
var InjectableAnimationEngine = (function (_super) {
    __extends(InjectableAnimationEngine, _super);
    function InjectableAnimationEngine(driver, normalizer) {
        return _super.call(this, driver, normalizer) || this;
    }
    return InjectableAnimationEngine;
}(browser_1.ɵAnimationEngine));
InjectableAnimationEngine = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [browser_1.AnimationDriver, browser_1.ɵAnimationStyleNormalizer])
], InjectableAnimationEngine);
exports.InjectableAnimationEngine = InjectableAnimationEngine;
function instantiateSupportedAnimationDriver() {
    if (browser_1.ɵsupportsWebAnimations()) {
        return new browser_1.ɵWebAnimationsDriver();
    }
    return new browser_1.ɵNoopAnimationDriver();
}
exports.instantiateSupportedAnimationDriver = instantiateSupportedAnimationDriver;
function instantiateDefaultStyleNormalizer() {
    return new browser_1.ɵWebAnimationsStyleNormalizer();
}
exports.instantiateDefaultStyleNormalizer = instantiateDefaultStyleNormalizer;
function instantiateRendererFactory(renderer, engine, zone) {
    return new animation_renderer_1.AnimationRendererFactory(renderer, engine, zone);
}
exports.instantiateRendererFactory = instantiateRendererFactory;
var SHARED_ANIMATION_PROVIDERS = [
    { provide: animations_1.AnimationBuilder, useClass: animation_builder_1.BrowserAnimationBuilder },
    { provide: browser_1.ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: browser_1.ɵAnimationEngine, useClass: InjectableAnimationEngine }, {
        provide: core_1.RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [platform_browser_1.ɵDomRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
exports.BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: browser_1.AnimationDriver, useFactory: instantiateSupportedAnimationDriver }
].concat(SHARED_ANIMATION_PROVIDERS);
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
exports.BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }].concat(SHARED_ANIMATION_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3NyYy9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsa0RBQXFEO0FBQ3JELHVEQUFrVztBQUNsVyxzQ0FBNkU7QUFDN0UsOERBQXNGO0FBRXRGLHlEQUE0RDtBQUM1RCwyREFBOEQ7QUFHOUQsSUFBYSx5QkFBeUI7SUFBUyw2Q0FBZTtJQUM1RCxtQ0FBWSxNQUF1QixFQUFFLFVBQW9DO2VBQ3ZFLGtCQUFNLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FBQyxBQUpELENBQStDLDBCQUFlLEdBSTdEO0FBSlkseUJBQXlCO0lBRHJDLGlCQUFVLEVBQUU7cUNBRVMseUJBQWUsRUFBYyxtQ0FBd0I7R0FEOUQseUJBQXlCLENBSXJDO0FBSlksOERBQXlCO0FBTXRDO0lBQ0UsRUFBRSxDQUFDLENBQUMsZ0NBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksOEJBQW1CLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksOEJBQW1CLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBTEQsa0ZBS0M7QUFFRDtJQUNFLE1BQU0sQ0FBQyxJQUFJLHVDQUE0QixFQUFFLENBQUM7QUFDNUMsQ0FBQztBQUZELDhFQUVDO0FBRUQsb0NBQ0ksUUFBNkIsRUFBRSxNQUF1QixFQUFFLElBQVk7SUFDdEUsTUFBTSxDQUFDLElBQUksNkNBQXdCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBSEQsZ0VBR0M7QUFFRCxJQUFNLDBCQUEwQixHQUFlO0lBQzdDLEVBQUMsT0FBTyxFQUFFLDZCQUFnQixFQUFFLFFBQVEsRUFBRSwyQ0FBdUIsRUFBQztJQUM5RCxFQUFDLE9BQU8sRUFBRSxtQ0FBd0IsRUFBRSxVQUFVLEVBQUUsaUNBQWlDLEVBQUM7SUFDbEYsRUFBQyxPQUFPLEVBQUUsMEJBQWUsRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUMsRUFBRTtRQUMvRCxPQUFPLEVBQUUsdUJBQWdCO1FBQ3pCLFVBQVUsRUFBRSwwQkFBMEI7UUFDdEMsSUFBSSxFQUFFLENBQUMsdUNBQW1CLEVBQUUsMEJBQWUsRUFBRSxhQUFNLENBQUM7S0FDckQ7Q0FDRixDQUFDO0FBRUY7OztHQUdHO0FBQ1UsUUFBQSw0QkFBNEI7SUFDdkMsRUFBQyxPQUFPLEVBQUUseUJBQWUsRUFBRSxVQUFVLEVBQUUsbUNBQW1DLEVBQUM7U0FDeEUsMEJBQTBCLEVBQzdCO0FBRUY7OztHQUdHO0FBQ1UsUUFBQSxpQ0FBaUMsSUFDekMsRUFBQyxPQUFPLEVBQUUseUJBQWUsRUFBRSxRQUFRLEVBQUUsOEJBQW1CLEVBQUMsU0FBSywwQkFBMEIsRUFBRSJ9