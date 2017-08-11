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
var compile_reflector_1 = require("./compile_reflector");
var directive_resolver_1 = require("./directive_resolver");
var injectable_1 = require("./injectable");
function _isNgModuleMetadata(obj) {
    return obj instanceof core_1.NgModule;
}
/**
 * Resolves types to {@link NgModule}.
 */
var NgModuleResolver = (function () {
    function NgModuleResolver(_reflector) {
        this._reflector = _reflector;
    }
    NgModuleResolver.prototype.isNgModule = function (type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); };
    NgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var ngModuleMeta = directive_resolver_1.findLast(this._reflector.annotations(type), _isNgModuleMetadata);
        if (ngModuleMeta) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error("No NgModule metadata found for '" + core_1.ɵstringify(type) + "'.");
            }
            return null;
        }
    };
    return NgModuleResolver;
}());
NgModuleResolver = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [compile_reflector_1.CompileReflector])
], NgModuleResolver);
exports.NgModuleResolver = NgModuleResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL25nX21vZHVsZV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFzRTtBQUV0RSx5REFBcUQ7QUFDckQsMkRBQThDO0FBQzlDLDJDQUFnRDtBQUVoRCw2QkFBNkIsR0FBUTtJQUNuQyxNQUFNLENBQUMsR0FBRyxZQUFZLGVBQVEsQ0FBQztBQUNqQyxDQUFDO0FBRUQ7O0dBRUc7QUFFSCxJQUFhLGdCQUFnQjtJQUMzQiwwQkFBb0IsVUFBNEI7UUFBNUIsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7SUFBRyxDQUFDO0lBRXBELHFDQUFVLEdBQVYsVUFBVyxJQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RixrQ0FBTyxHQUFQLFVBQVEsSUFBZSxFQUFFLGVBQXNCO1FBQXRCLGdDQUFBLEVBQUEsc0JBQXNCO1FBQzdDLElBQU0sWUFBWSxHQUFhLDZCQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUVoRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDdEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBbUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBSSxDQUFDLENBQUM7WUFDMUUsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQWpCWSxnQkFBZ0I7SUFENUIsK0JBQWtCLEVBQUU7cUNBRWEsb0NBQWdCO0dBRHJDLGdCQUFnQixDQWlCNUI7QUFqQlksNENBQWdCIn0=