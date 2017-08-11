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
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../di");
/**
 * Combination of NgModuleFactory and ComponentFactorys.
 *
 * @experimental
 */
var ModuleWithComponentFactories = (function () {
    function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
    }
    return ModuleWithComponentFactories;
}());
exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
function _throwError() {
    throw new Error("Runtime compiler is not loaded");
}
/**
 * Low-level service for running the angular compiler during runtime
 * to create {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 *
 * Each `@NgModule` provides an own `Compiler` to its injector,
 * that will use the directives/pipes of the ng module for compilation
 * of components.
 * @stable
 */
var Compiler = (function () {
    function Compiler() {
    }
    /**
     * Compiles the given NgModule and all of its components. All templates of the components listed
     * in `entryComponents` have to be inlined.
     */
    Compiler.prototype.compileModuleSync = function (moduleType) { throw _throwError(); };
    /**
     * Compiles the given NgModule and all of its components
     */
    Compiler.prototype.compileModuleAsync = function (moduleType) { throw _throwError(); };
    /**
     * Same as {@link #compileModuleSync} but also creates ComponentFactories for all components.
     */
    Compiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        throw _throwError();
    };
    /**
     * Same as {@link #compileModuleAsync} but also creates ComponentFactories for all components.
     */
    Compiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        throw _throwError();
    };
    /**
     * Exposes the CSS-style selectors that have been used in `ngContent` directives within
     * the template of the given component.
     * This is used by the `upgrade` library to compile the appropriate transclude content
     * in the AngularJS wrapper component.
     *
     * @deprecated since v4. Use ComponentFactory.ngContentSelectors instead.
     */
    Compiler.prototype.getNgContentSelectors = function (component) { throw _throwError(); };
    /**
     * Clears all caches.
     */
    Compiler.prototype.clearCache = function () { };
    /**
     * Clears the cache for the given component/ngModule.
     */
    Compiler.prototype.clearCacheFor = function (type) { };
    return Compiler;
}());
Compiler = __decorate([
    di_1.Injectable()
], Compiler);
exports.Compiler = Compiler;
/**
 * Token to provide CompilerOptions in the platform injector.
 *
 * @experimental
 */
exports.COMPILER_OPTIONS = new di_1.InjectionToken('compilerOptions');
/**
 * A factory for creating a Compiler
 *
 * @experimental
 */
var CompilerFactory = (function () {
    function CompilerFactory() {
    }
    return CompilerFactory;
}());
exports.CompilerFactory = CompilerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw0QkFBaUU7QUFTakU7Ozs7R0FJRztBQUNIO0lBQ0Usc0NBQ1csZUFBbUMsRUFDbkMsa0JBQTJDO1FBRDNDLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQUNuQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO0lBQUcsQ0FBQztJQUM1RCxtQ0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksb0VBQTRCO0FBT3pDO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFFSCxJQUFhLFFBQVE7SUFBckI7SUE4Q0EsQ0FBQztJQTdDQzs7O09BR0c7SUFDSCxvQ0FBaUIsR0FBakIsVUFBcUIsVUFBbUIsSUFBd0IsTUFBTSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEY7O09BRUc7SUFDSCxxQ0FBa0IsR0FBbEIsVUFBc0IsVUFBbUIsSUFBaUMsTUFBTSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFaEc7O09BRUc7SUFDSCxvREFBaUMsR0FBakMsVUFBcUMsVUFBbUI7UUFDdEQsTUFBTSxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxxREFBa0MsR0FBbEMsVUFBc0MsVUFBbUI7UUFFdkQsTUFBTSxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILHdDQUFxQixHQUFyQixVQUFzQixTQUFvQixJQUFjLE1BQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlFOztPQUVHO0lBQ0gsNkJBQVUsR0FBVixjQUFvQixDQUFDO0lBRXJCOztPQUVHO0lBQ0gsZ0NBQWEsR0FBYixVQUFjLElBQWUsSUFBRyxDQUFDO0lBQ25DLGVBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDO0FBOUNZLFFBQVE7SUFEcEIsZUFBVSxFQUFFO0dBQ0EsUUFBUSxDQThDcEI7QUE5Q1ksNEJBQVE7QUFtRXJCOzs7O0dBSUc7QUFDVSxRQUFBLGdCQUFnQixHQUFHLElBQUksbUJBQWMsQ0FBb0IsaUJBQWlCLENBQUMsQ0FBQztBQUV6Rjs7OztHQUlHO0FBQ0g7SUFBQTtJQUVBLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRnFCLDBDQUFlIn0=