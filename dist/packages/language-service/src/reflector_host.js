/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompilerHost, ModuleResolutionHostAdapter } from '@angular/compiler-cli';
class ReflectorModuleModuleResolutionHost {
    constructor(host) {
        this.host = host;
        if (host.directoryExists)
            this.directoryExists = directoryName => this.host.directoryExists(directoryName);
    }
    fileExists(fileName) { return !!this.host.getScriptSnapshot(fileName); }
    readFile(fileName) {
        let snapshot = this.host.getScriptSnapshot(fileName);
        if (snapshot) {
            return snapshot.getText(0, snapshot.getLength());
        }
        // Typescript readFile() declaration should be `readFile(fileName: string): string | undefined
        return undefined;
    }
}
// This reflector host's purpose is to first set verboseInvalidExpressions to true so the
// reflector will collect errors instead of throwing, and second to all deferring the creation
// of the program until it is actually needed.
export class ReflectorHost extends CompilerHost {
    constructor(getProgram, serviceHost, options) {
        super(
        // The ancestor value for program is overridden below so passing null here is safe.
        /* program */ null, options, new ModuleResolutionHostAdapter(new ReflectorModuleModuleResolutionHost(serviceHost)), { verboseInvalidExpression: true });
        this.getProgram = getProgram;
    }
    get program() { return this.getProgram(); }
    set program(value) {
        // Discard the result set by ancestor constructor
    }
}
//# sourceMappingURL=reflector_host.js.map