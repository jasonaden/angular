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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var MockNgModuleResolver = (function (_super) {
    __extends(MockNgModuleResolver, _super);
    function MockNgModuleResolver(_injector, reflector) {
        var _this = _super.call(this, reflector) || this;
        _this._injector = _injector;
        _this._ngModules = new Map();
        return _this;
    }
    /**
     * Overrides the {@link NgModule} for a module.
     */
    MockNgModuleResolver.prototype.setNgModule = function (type, metadata) {
        this._ngModules.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {@link NgModule} for a module:
     * - Set the {@link NgModule} to the overridden view when it exists or fallback to the
     * default
     * `NgModuleResolver`, see `setNgModule`.
     */
    MockNgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        return this._ngModules.get(type) || _super.prototype.resolve.call(this, type, throwIfNotFound);
    };
    Object.defineProperty(MockNgModuleResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(core_1.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockNgModuleResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    return MockNgModuleResolver;
}(compiler_1.NgModuleResolver));
MockNgModuleResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Injector, compiler_1.CompileReflector])
], MockNgModuleResolver);
exports.MockNgModuleResolver = MockNgModuleResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9uZ19tb2R1bGVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBcUU7QUFDckUsc0NBQTZFO0FBRzdFLElBQWEsb0JBQW9CO0lBQVMsd0NBQWdCO0lBR3hELDhCQUFvQixTQUFtQixFQUFFLFNBQTJCO1FBQXBFLFlBQXdFLGtCQUFNLFNBQVMsQ0FBQyxTQUFHO1FBQXZFLGVBQVMsR0FBVCxTQUFTLENBQVU7UUFGL0IsZ0JBQVUsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQzs7SUFFc0MsQ0FBQztJQUUzRjs7T0FFRztJQUNILDBDQUFXLEdBQVgsVUFBWSxJQUFlLEVBQUUsUUFBa0I7UUFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsc0NBQU8sR0FBUCxVQUFRLElBQWUsRUFBRSxlQUFzQjtRQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQU0sT0FBTyxZQUFDLElBQUksRUFBRSxlQUFlLENBQUcsQ0FBQztJQUM3RSxDQUFDO0lBRUQsc0JBQVksMkNBQVM7YUFBckIsY0FBb0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbEUsNkNBQWMsR0FBdEIsVUFBdUIsU0FBb0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0YsMkJBQUM7QUFBRCxDQUFDLEFBMUJELENBQTBDLDJCQUFnQixHQTBCekQ7QUExQlksb0JBQW9CO0lBRGhDLGlCQUFVLEVBQUU7cUNBSW9CLGVBQVEsRUFBYSwyQkFBZ0I7R0FIekQsb0JBQW9CLENBMEJoQztBQTFCWSxvREFBb0IifQ==