/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { CompilerHost, ModuleResolutionHostAdapter } from '@angular/compiler-cli';
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
    tslib_1.__extends(ReflectorHost, _super);
    function ReflectorHost(getProgram, serviceHost, options) {
        var _this = _super.call(this, 
        // The ancestor value for program is overridden below so passing null here is safe.
        /* program */ null, options, new ModuleResolutionHostAdapter(new ReflectorModuleModuleResolutionHost(serviceHost)), { verboseInvalidExpression: true }) || this;
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
}(CompilerHost));
export { ReflectorHost };
//# sourceMappingURL=reflector_host.js.map