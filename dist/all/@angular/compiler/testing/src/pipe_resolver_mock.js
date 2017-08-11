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
var MockPipeResolver = (function (_super) {
    __extends(MockPipeResolver, _super);
    function MockPipeResolver(_injector, refector) {
        var _this = _super.call(this, refector) || this;
        _this._injector = _injector;
        _this._pipes = new Map();
        return _this;
    }
    Object.defineProperty(MockPipeResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(core_1.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockPipeResolver.prototype._clearCacheFor = function (pipe) { this._compiler.clearCacheFor(pipe); };
    /**
     * Overrides the {@link Pipe} for a pipe.
     */
    MockPipeResolver.prototype.setPipe = function (type, metadata) {
        this._pipes.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {@link Pipe} for a pipe:
     * - Set the {@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     */
    MockPipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        return metadata;
    };
    return MockPipeResolver;
}(compiler_1.PipeResolver));
MockPipeResolver = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Injector, compiler_1.CompileReflector])
], MockPipeResolver);
exports.MockPipeResolver = MockPipeResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlcl9tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdGluZy9zcmMvcGlwZV9yZXNvbHZlcl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUFpRTtBQUNqRSxzQ0FBeUU7QUFHekUsSUFBYSxnQkFBZ0I7SUFBUyxvQ0FBWTtJQUdoRCwwQkFBb0IsU0FBbUIsRUFBRSxRQUEwQjtRQUFuRSxZQUF1RSxrQkFBTSxRQUFRLENBQUMsU0FBRztRQUFyRSxlQUFTLEdBQVQsU0FBUyxDQUFVO1FBRi9CLFlBQU0sR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQzs7SUFFNEMsQ0FBQztJQUV6RixzQkFBWSx1Q0FBUzthQUFyQixjQUFvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVsRSx5Q0FBYyxHQUF0QixVQUF1QixJQUFlLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9FOztPQUVHO0lBQ0gsa0NBQU8sR0FBUCxVQUFRLElBQWUsRUFBRSxRQUFjO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGtDQUFPLEdBQVAsVUFBUSxJQUFlLEVBQUUsZUFBc0I7UUFBdEIsZ0NBQUEsRUFBQSxzQkFBc0I7UUFDN0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsUUFBUSxHQUFHLGlCQUFNLE9BQU8sWUFBQyxJQUFJLEVBQUUsZUFBZSxDQUFHLENBQUM7UUFDcEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQTlCRCxDQUFzQyx1QkFBWSxHQThCakQ7QUE5QlksZ0JBQWdCO0lBRDVCLGlCQUFVLEVBQUU7cUNBSW9CLGVBQVEsRUFBWSwyQkFBZ0I7R0FIeEQsZ0JBQWdCLENBOEI1QjtBQTlCWSw0Q0FBZ0IifQ==