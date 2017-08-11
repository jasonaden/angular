"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var module_filename_resolver_1 = require("./module_filename_resolver");
exports.createModuleFilenameResolver = module_filename_resolver_1.createModuleFilenameResolver;
var program_1 = require("./program");
exports.createProgram = program_1.createProgram;
function createHost(_a) {
    var tsHost = _a.tsHost, options = _a.options;
    var resolver = module_filename_resolver_1.createModuleFilenameResolver(tsHost, options);
    var host = Object.create(tsHost);
    host.moduleNameToFileName = resolver.moduleNameToFileName.bind(resolver);
    host.fileNameToModuleName = resolver.fileNameToModuleName.bind(resolver);
    host.getNgCanonicalFileName = resolver.getNgCanonicalFileName.bind(resolver);
    host.assumeFileExists = resolver.assumeFileExists.bind(resolver);
    // Make sure we do not `host.realpath()` from TS as we do not want to resolve symlinks.
    // https://github.com/Microsoft/TypeScript/issues/9552
    host.realpath = function (fileName) { return fileName; };
    return host;
}
exports.createHost = createHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvZW50cnlfcG9pbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS0gsdUVBQXdFO0FBRWhFLHVDQUZBLHVEQUE0QixDQUVBO0FBRHBDLHFDQUF3QztBQUFoQyxrQ0FBQSxhQUFhLENBQUE7QUFHckIsb0JBQTJCLEVBQXNFO1FBQXJFLGtCQUFNLEVBQUUsb0JBQU87SUFFekMsSUFBTSxRQUFRLEdBQUcsdURBQTRCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9ELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFbkMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekUsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0UsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakUsdUZBQXVGO0lBQ3ZGLHNEQUFzRDtJQUN0RCxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQUMsUUFBZ0IsSUFBSyxPQUFBLFFBQVEsRUFBUixDQUFRLENBQUM7SUFFL0MsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFoQkQsZ0NBZ0JDIn0=