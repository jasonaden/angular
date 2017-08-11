"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
var protractor_1 = require("protractor");
var yargs = require('yargs');
var webdriver = require("selenium-webdriver");
var cmdArgs;
function readCommandLine(extraOptions) {
    var options = {
        'bundles': { describe: 'Whether to use the angular bundles or not.', default: false }
    };
    for (var key in extraOptions) {
        options[key] = extraOptions[key];
    }
    cmdArgs = yargs.usage('Angular e2e test options.').options(options).help('ng-help').wrap(40).argv;
    return cmdArgs;
}
exports.readCommandLine = readCommandLine;
function openBrowser(config) {
    if (config.ignoreBrowserSynchronization) {
        protractor_1.browser.ignoreSynchronization = true;
    }
    var params = config.params || [];
    if (!params.some(function (param) { return param.name === 'bundles'; })) {
        params = params.concat([{ name: 'bundles', value: cmdArgs.bundles }]);
    }
    var urlParams = [];
    params.forEach(function (param) { urlParams.push(param.name + '=' + param.value); });
    var url = encodeURI(config.url + '?' + urlParams.join('&'));
    protractor_1.browser.get(url);
    if (config.ignoreBrowserSynchronization) {
        protractor_1.browser.sleep(2000);
    }
}
exports.openBrowser = openBrowser;
/**
 * @experimental This API will be moved to Protractor.
 */
function verifyNoBrowserErrors() {
    // TODO(tbosch): Bug in ChromeDriver: Need to execute at least one command
    // so that the browser logs can be read out!
    protractor_1.browser.executeScript('1+1');
    protractor_1.browser.manage().logs().get('browser').then(function (browserLog) {
        var filteredLog = browserLog.filter(function (logEntry) {
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                console.log('>> ' + logEntry.message);
            }
            return logEntry.level.value > webdriver.logging.Level.WARNING.value;
        });
        expect(filteredLog).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9tb2R1bGVzL2UyZV91dGlsL2UyZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQWdDO0FBQ2hDLHlDQUFtQztBQUVuQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsOENBQWdEO0FBRWhELElBQUksT0FBNkIsQ0FBQztBQUlsQyx5QkFBZ0MsWUFBbUM7SUFDakUsSUFBTSxPQUFPLEdBQXlCO1FBQ3BDLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSw0Q0FBNEMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO0tBQ3BGLENBQUM7SUFDRixHQUFHLENBQUMsQ0FBQyxJQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2xHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQVZELDBDQVVDO0FBRUQscUJBQTRCLE1BSTNCO0lBQ0MsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztRQUN4QyxvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUN2QyxDQUFDO0lBQ0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELElBQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxJQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RCxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLG9CQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBcEJELGtDQW9CQztBQUVEOztHQUVHO0FBQ0g7SUFDRSwwRUFBMEU7SUFDMUUsNENBQTRDO0lBQzVDLG9CQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLFVBQWU7UUFDbEUsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFTLFFBQWE7WUFDMUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWJELHNEQWFDIn0=