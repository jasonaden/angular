"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Must be imported first, because Angular decorators throw on load.
require("reflect-metadata");
var compiler_1 = require("@angular/compiler");
var fs = require("fs");
var path = require("path");
var perform_compile_1 = require("./perform-compile");
function main(args, consoleError, checkFunc) {
    if (consoleError === void 0) { consoleError = console.error; }
    if (checkFunc === void 0) { checkFunc = perform_compile_1.throwOnDiagnostics; }
    try {
        var parsedArgs = require('minimist')(args);
        var project = parsedArgs.p || parsedArgs.project || '.';
        var projectDir = fs.lstatSync(project).isFile() ? path.dirname(project) : project;
        // file names in tsconfig are resolved relative to this absolute path
        var basePath = path.resolve(process.cwd(), projectDir);
        var _a = perform_compile_1.readConfiguration(project, basePath, checkFunc), parsed = _a.parsed, ngOptions = _a.ngOptions;
        // CLI arguments can override the i18n options
        var ngcOptions = mergeCommandLine(parsedArgs, ngOptions);
        var res = perform_compile_1.performCompilation(basePath, parsed.fileNames, parsed.options, ngcOptions, consoleError, checkFunc);
        return res.errorCode;
    }
    catch (e) {
        if (compiler_1.isSyntaxError(e)) {
            consoleError(e.message);
            return 1;
        }
        consoleError(e.stack);
        consoleError('Compilation failed');
        return 2;
    }
}
exports.main = main;
// Merge command line parameters
function mergeCommandLine(parsedArgs, options) {
    if (parsedArgs.i18nFile)
        options.i18nInFile = parsedArgs.i18nFile;
    if (parsedArgs.i18nFormat)
        options.i18nInFormat = parsedArgs.i18nFormat;
    if (parsedArgs.locale)
        options.i18nInLocale = parsedArgs.locale;
    var mt = parsedArgs.missingTranslation;
    if (mt === 'error' || mt === 'warning' || mt === 'ignore') {
        options.i18nInMissingTranslations = mt;
    }
    return options;
}
// CLI entry point
if (require.main === module) {
    process.exit(main(process.argv.slice(2), function (s) { return console.error(s); }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxvRUFBb0U7QUFDcEUsNEJBQTBCO0FBRTFCLDhDQUFnRDtBQUNoRCx1QkFBeUI7QUFDekIsMkJBQTZCO0FBRTdCLHFEQUE0RjtBQUc1RixjQUNJLElBQWMsRUFBRSxZQUFpRCxFQUNqRSxTQUFxRTtJQURyRCw2QkFBQSxFQUFBLGVBQW9DLE9BQU8sQ0FBQyxLQUFLO0lBQ2pFLDBCQUFBLEVBQUEsWUFBbUQsb0NBQWtCO0lBQ3ZFLElBQUksQ0FBQztRQUNILElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO1FBRTFELElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7UUFFcEYscUVBQXFFO1FBQ3JFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELElBQUEsc0VBQXFFLEVBQXBFLGtCQUFNLEVBQUUsd0JBQVMsQ0FBb0Q7UUFFNUUsOENBQThDO1FBQzlDLElBQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUzRCxJQUFNLEdBQUcsR0FBRyxvQ0FBa0IsQ0FDMUIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXJGLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsRUFBRSxDQUFDLENBQUMsd0JBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7QUFDSCxDQUFDO0FBOUJELG9CQThCQztBQUVELGdDQUFnQztBQUNoQywwQkFDSSxVQUFpQyxFQUFFLE9BQXdCO0lBQzdELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDbEUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztJQUN4RSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ2hFLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztJQUN6QyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssT0FBTyxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUQsT0FBTyxDQUFDLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsa0JBQWtCO0FBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUMifQ==