"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var e2e_util_1 = require("./e2e_util");
exports.verifyNoBrowserErrors = e2e_util_1.verifyNoBrowserErrors;
var yargs = require('yargs');
var nodeUuid = require('node-uuid');
var fs = require("fs-extra");
var benchpress_1 = require("@angular/benchpress");
var e2e_util_2 = require("./e2e_util");
var cmdArgs;
var runner;
function readCommandLine() {
    cmdArgs = e2e_util_2.readCommandLine({
        'sample-size': { describe: 'Used for perf: sample size.', default: 20 },
        'force-gc': { describe: 'Used for perf: force gc.', default: false, type: 'boolean' },
        'dryrun': { describe: 'If true, only run performance benchmarks once.', default: false },
        'bundles': { describe: 'Whether to use the angular bundles or not.', default: false }
    });
    runner = createBenchpressRunner();
}
exports.readCommandLine = readCommandLine;
function runBenchmark(config) {
    e2e_util_2.openBrowser(config);
    if (config.setup) {
        config.setup();
    }
    var description = { 'bundles': cmdArgs.bundles };
    config.params.forEach(function (param) { description[param.name] = param.value; });
    return runner.sample({
        id: config.id,
        execute: config.work,
        prepare: config.prepare,
        microMetrics: config.microMetrics,
        providers: [{ provide: benchpress_1.Options.SAMPLE_DESCRIPTION, useValue: description }]
    });
}
exports.runBenchmark = runBenchmark;
function createBenchpressRunner() {
    var runId = nodeUuid.v1();
    if (process.env.GIT_SHA) {
        runId = process.env.GIT_SHA + ' ' + runId;
    }
    var resultsFolder = './dist/benchmark_results';
    fs.ensureDirSync(resultsFolder);
    var providers = [
        benchpress_1.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
        { provide: benchpress_1.Options.FORCE_GC, useValue: cmdArgs['force-gc'] },
        { provide: benchpress_1.Options.DEFAULT_DESCRIPTION, useValue: { 'runId': runId } }, benchpress_1.JsonFileReporter.PROVIDERS,
        { provide: benchpress_1.JsonFileReporter.PATH, useValue: resultsFolder }
    ];
    if (!cmdArgs['dryrun']) {
        providers.push({ provide: benchpress_1.Validator, useExisting: benchpress_1.RegressionSlopeValidator });
        providers.push({ provide: benchpress_1.RegressionSlopeValidator.SAMPLE_SIZE, useValue: cmdArgs['sample-size'] });
        providers.push(benchpress_1.MultiReporter.provideWith([benchpress_1.ConsoleReporter, benchpress_1.JsonFileReporter]));
    }
    else {
        providers.push({ provide: benchpress_1.Validator, useExisting: benchpress_1.SizeValidator });
        providers.push({ provide: benchpress_1.SizeValidator.SAMPLE_SIZE, useValue: 1 });
        providers.push(benchpress_1.MultiReporter.provideWith([]));
        providers.push(benchpress_1.MultiMetric.provideWith([]));
    }
    return new benchpress_1.Runner(providers);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbW9kdWxlcy9lMmVfdXRpbC9wZXJmX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCx1Q0FBaUQ7QUFBekMsMkNBQUEscUJBQXFCLENBQUE7QUFFN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN0Qyw2QkFBK0I7QUFFL0Isa0RBQWlOO0FBQ2pOLHVDQUE4RTtBQUU5RSxJQUFJLE9BQTRGLENBQUM7QUFDakcsSUFBSSxNQUFjLENBQUM7QUFFbkI7SUFDRSxPQUFPLEdBQVEsMEJBQWtCLENBQUM7UUFDaEMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLDZCQUE2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUM7UUFDckUsVUFBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLDBCQUEwQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztRQUNuRixRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsZ0RBQWdELEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztRQUN0RixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsNENBQTRDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztLQUNwRixDQUFDLENBQUM7SUFDSCxNQUFNLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBUkQsMENBUUM7QUFFRCxzQkFBNkIsTUFTNUI7SUFDQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0QsSUFBTSxXQUFXLEdBQXlCLEVBQUMsU0FB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