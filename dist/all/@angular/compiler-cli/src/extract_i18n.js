#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var tsc = require("@angular/tsc-wrapped");
var extractor_1 = require("./extractor");
function extract(ngOptions, cliOptions, program, host) {
    return extractor_1.Extractor.create(ngOptions, program, host, cliOptions.locale)
        .extract(cliOptions.i18nFormat, cliOptions.outFile);
}
// Entry point
if (require.main === module) {
    var args = require('minimist')(process.argv.slice(2));
    var project = args.p || args.project || '.';
    var cliOptions = new tsc.I18nExtractionCliOptions(args);
    tsc.main(project, cliOptions, extract, { noEmit: true })
        .then(function (exitCode) { return process.exit(exitCode); })
        .catch(function (e) {
        console.error(e.stack);
        console.error('Extraction failed');
        process.exit(1);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9pMThuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9leHRyYWN0X2kxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBY0EsNEJBQTBCO0FBRTFCLDBDQUE0QztBQUc1Qyx5Q0FBc0M7QUFFdEMsaUJBQ0ksU0FBcUMsRUFBRSxVQUF3QyxFQUMvRSxPQUFtQixFQUFFLElBQXFCO0lBQzVDLE1BQU0sQ0FBQyxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQy9ELE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBWSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRUQsY0FBYztBQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO0lBQzlDLElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDakQsSUFBSSxDQUFDLFVBQUMsUUFBYSxJQUFLLE9BQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQztTQUMvQyxLQUFLLENBQUMsVUFBQyxDQUFNO1FBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFDVCxDQUFDIn0=