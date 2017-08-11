#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var tsc = require("@angular/tsc-wrapped");
var fs = require("fs");
var path = require("path");
var ngc = require("./ngc");
var compiler_1 = require("@angular/compiler");
var perform_compile_1 = require("./perform-compile");
var codegen_1 = require("./codegen");
function codegen(ngOptions, cliOptions, program, host) {
    if (ngOptions.enableSummariesForJit === undefined) {
        // default to false
        ngOptions.enableSummariesForJit = false;
    }
    return codegen_1.CodeGenerator.create(ngOptions, cliOptions, program, host).codegen();
}
function main(args, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    var project = args.p || args.project || '.';
    var cliOptions = new tsc.NgcCliOptions(args);
    return tsc.main(project, cliOptions, codegen).then(function () { return 0; }).catch(function (e) {
        if (e instanceof tsc.UserError || compiler_1.isSyntaxError(e)) {
            consoleError(e.message);
            return Promise.resolve(1);
        }
        else {
            consoleError(e.stack);
            consoleError('Compilation failed');
            return Promise.resolve(1);
        }
    });
}
exports.main = main;
// CLI entry point
if (require.main === module) {
    var args = process.argv.slice(2);
    var parsedArgs = require('minimist')(args);
    var project = parsedArgs.p || parsedArgs.project || '.';
    var projectDir = fs.lstatSync(project).isFile() ? path.dirname(project) : project;
    // file names in tsconfig are resolved relative to this absolute path
    var basePath = path.resolve(process.cwd(), projectDir);
    var ngOptions = perform_compile_1.readConfiguration(project, basePath).ngOptions;
    if (ngOptions.disableTransformerPipeline) {
        main(parsedArgs).then(function (exitCode) { return process.exit(exitCode); });
    }
    else {
        process.exit(ngc.main(args, function (s) { return console.error(s); }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFVQSw0QkFBMEI7QUFHMUIsMENBQTRDO0FBQzVDLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsMkJBQTZCO0FBRTdCLDhDQUFnRDtBQUVoRCxxREFBb0Q7QUFFcEQscUNBQXdDO0FBRXhDLGlCQUNJLFNBQXFDLEVBQUUsVUFBNkIsRUFBRSxPQUFtQixFQUN6RixJQUFxQjtJQUN2QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNsRCxtQkFBbUI7UUFDbkIsU0FBUyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUMxQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLHVCQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlFLENBQUM7QUFFRCxjQUNJLElBQVMsRUFBRSxZQUFpRDtJQUFqRCw2QkFBQSxFQUFBLGVBQW9DLE9BQU8sQ0FBQyxLQUFLO0lBQzlELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUM7SUFDOUMsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQztRQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxDQUFDLFNBQVMsSUFBSSx3QkFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWZELG9CQWVDO0FBRUQsa0JBQWtCO0FBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztJQUUxRCxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBRXBGLHFFQUFxRTtJQUNyRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNsRCxJQUFBLDRFQUFTLENBQXlDO0lBRXpELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQWdCLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7QUFDSCxDQUFDIn0=