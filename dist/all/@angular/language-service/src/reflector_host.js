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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_cli_1 = require("@angular/compiler-cli");
var ReflectorModuleModuleResolutionHost = (function () {
    function ReflectorModuleModuleResolutionHost(host) {
        var _this = this;
        this.host = host;
        if (host.directoryExists)
            this.directoryExists = function (directoryName) { return _this.host.directoryExists(directoryName); };
    }
    ReflectorModuleModuleResolutionHost.prototype.fileExists = function (fileName) { return !!this.host.getScriptSnapshot(fileName); };
    ReflectorModuleModuleResolutionHost.prototype.readFile = function (fileName) {
        var snapshot = this.host.getScriptSnapshot(fileName);
        if (snapshot) {
            return snapshot.getText(0, snapshot.getLength());
        }
        // Typescript readFile() declaration should be `readFile(fileName: string): string | undefined
        return undefined;
    };
    return ReflectorModuleModuleResolutionHost;
}());
// This reflector host's purpose is to first set verboseInvalidExpressions to true so the
// reflector will collect errors instead of throwing, and second to all deferring the creation
// of the program until it is actually needed.
var ReflectorHost = (function (_super) {
    __extends(ReflectorHost, _super);
    function ReflectorHost(getProgram, serviceHost, options) {
        var _this = _super.call(this, 
        // The ancestor value for program is overridden below so passing null here is safe.
        /* program */ null, options, new compiler_cli_1.ModuleResolutionHostAdapter(new ReflectorModuleModuleResolutionHost(serviceHost)), { verboseInvalidExpression: true }) || this;
        _this.getProgram = getProgram;
        return _this;
    }
    Object.defineProperty(ReflectorHost.prototype, "program", {
        get: function () { return this.getProgram(); },
        set: function (value) {
            // Discard the result set by ancestor constructor
        },
        enumerable: true,
        configurable: true
    });
    return ReflectorHost;
}(compiler_cli_1.CompilerHost));
exports.ReflectorHost = ReflectorHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9yZWZsZWN0b3JfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzREFBeUg7QUFHekg7SUFDRSw2Q0FBb0IsSUFBNEI7UUFBaEQsaUJBR0M7UUFIbUIsU0FBSSxHQUFKLElBQUksQ0FBd0I7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLFVBQUEsYUFBYSxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxlQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUExQyxDQUEwQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCx3REFBVSxHQUFWLFVBQVcsUUFBZ0IsSUFBYSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpGLHNEQUFRLEdBQVIsVUFBUyxRQUFnQjtRQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELDhGQUE4RjtRQUM5RixNQUFNLENBQUMsU0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFHSCwwQ0FBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFFRCx5RkFBeUY7QUFDekYsOEZBQThGO0FBQzlGLDhDQUE4QztBQUM5QztJQUFtQyxpQ0FBWTtJQUM3Qyx1QkFDWSxVQUE0QixFQUFFLFdBQW1DLEVBQ3pFLE9BQStCO1FBRm5DLFlBR0U7UUFDSSxtRkFBbUY7UUFDbkYsYUFBYSxDQUFDLElBQU0sRUFBRSxPQUFPLEVBQzdCLElBQUksMENBQTJCLENBQUMsSUFBSSxtQ0FBbUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUNyRixFQUFDLHdCQUF3QixFQUFFLElBQUksRUFBQyxDQUFDLFNBQ3RDO1FBUFcsZ0JBQVUsR0FBVixVQUFVLENBQWtCOztJQU94QyxDQUFDO0lBRUQsc0JBQWMsa0NBQU87YUFBckIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDckQsVUFBc0IsS0FBaUI7WUFDckMsaURBQWlEO1FBQ25ELENBQUM7OztPQUhvRDtJQUl2RCxvQkFBQztBQUFELENBQUMsQUFmRCxDQUFtQywyQkFBWSxHQWU5QztBQWZZLHNDQUFhIn0=