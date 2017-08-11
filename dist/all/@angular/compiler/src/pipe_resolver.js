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
function _isPipeMetadata(type) {
    return type instanceof core_1.Pipe;
}
/**
 * Resolve a `Type` for {@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
var PipeResolver = (function () {
    function PipeResolver(_reflector) {
        this._reflector = _reflector;
    }
    PipeResolver.prototype.isPipe = function (type) {
        var typeMetadata = this._reflector.annotations(core_1.resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(_isPipeMetadata);
    };
    /**
     * Return {@link Pipe} for a given `Type`.
     */
    PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metas = this._reflector.annotations(core_1.resolveForwardRef(type));
        if (metas) {
            var annotation = directive_resolver_1.findLast(metas, _isPipeMetadata);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Pipe decorator found on " + core_1.ɵstringify(type));
        }
        return null;
    };
    return PipeResolver;
}());
PipeResolver = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [compile_reflector_1.CompileReflector])
], PipeResolver);
exports.PipeResolver = PipeResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9waXBlX3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXFGO0FBRXJGLHlEQUFxRDtBQUNyRCwyREFBOEM7QUFDOUMsMkNBQWdEO0FBRWhELHlCQUF5QixJQUFTO0lBQ2hDLE1BQU0sQ0FBQyxJQUFJLFlBQVksV0FBSSxDQUFDO0FBQzlCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFFSCxJQUFhLFlBQVk7SUFDdkIsc0JBQW9CLFVBQTRCO1FBQTVCLGVBQVUsR0FBVixVQUFVLENBQWtCO0lBQUcsQ0FBQztJQUVwRCw2QkFBTSxHQUFOLFVBQU8sSUFBZTtRQUNwQixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCw4QkFBTyxHQUFQLFVBQVEsSUFBZSxFQUFFLGVBQXNCO1FBQXRCLGdDQUFBLEVBQUEsc0JBQXNCO1FBQzdDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLHdCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQU0sVUFBVSxHQUFHLDZCQUFRLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNwQixDQUFDO1FBQ0gsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsaUJBQVMsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXhCRCxJQXdCQztBQXhCWSxZQUFZO0lBRHhCLCtCQUFrQixFQUFFO3FDQUVhLG9DQUFnQjtHQURyQyxZQUFZLENBd0J4QjtBQXhCWSxvQ0FBWSJ9