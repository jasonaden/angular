"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var tsc_watch_1 = require("./tsc_watch");
__export(require("./tsc_watch"));
require("reflect-metadata");
function md(dir, folders) {
    if (folders.length) {
        var next = folders.shift();
        var path_1 = dir + '/' + next;
        if (!fs_1.existsSync(path_1)) {
            fs_1.mkdirSync(path_1);
        }
        md(path_1, folders);
    }
}
var tscWatch = null;
var platform = process.argv.length >= 3 ? process.argv[2] : null;
var runMode = process.argv.length >= 4 ? process.argv[3] : null;
var BaseConfig = {
    start: 'File change detected. Starting incremental compilation...',
    error: 'error',
    complete: 'Compilation complete. Watching for file changes.'
};
if (platform == 'node') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onChangeCmds: [[
                'node', 'dist/tools/cjs-jasmine', '--', '@angular/**/*_spec.js',
                '@angular/compiler-cli/test/**/*_spec.js', '@angular/benchpress/test/**/*_spec.js'
            ]]
    }, BaseConfig));
}
else if (platform == 'browser') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9876',
                'karma-js.conf.js'
            ],
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9877',
                'packages/router/karma.conf.js'
            ],
        ],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', 'karma-js.conf.js', '--port=9876'],
            ['node', 'node_modules/karma/bin/karma', 'run', '--port=9877'],
        ]
    }, BaseConfig));
}
else if (platform == 'router') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9877',
                'packages/router/karma.conf.js'
            ],
        ],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', '--port=9877'],
        ]
    }, BaseConfig));
}
else if (platform == 'browserNoRouter') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [[
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9876',
                'karma-js.conf.js'
            ]],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', 'karma-js.conf.js', '--port=9876'],
        ]
    }, BaseConfig));
}
else if (platform == 'tools') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'tools/tsconfig.json',
        onChangeCmds: [[
                'node', 'dist/tools/cjs-jasmine/index-tools', '--',
                '@angular/tsc-wrapped/**/*{_,.}spec.js'
            ]]
    }, BaseConfig));
}
else {
    throw new Error("unknown platform: " + platform);
}
if (runMode === 'watch') {
    tscWatch.watch();
}
else if (runMode === 'runCmdsOnly') {
    tscWatch.runCmdsOnly();
}
else {
    tscWatch.run();
}
//# sourceMappingURL=index.js.map