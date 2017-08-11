"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var selenium_webdriver_1 = require("selenium-webdriver");
var fs = require('fs');
var sourceMap = require('source-map');
describe('sourcemaps', function () {
    var URL = 'all/playground/src/sourcemap/index.html';
    it('should map sources', function () {
        protractor_1.browser.get(URL);
        protractor_1.$('error-app .errorButton').click();
        // TODO(tbosch): Bug in ChromeDriver: Need to execute at least one command
        // so that the browser logs can be read out!
        protractor_1.browser.executeScript('1+1');
        protractor_1.browser.manage().logs().get(selenium_webdriver_1.logging.Type.BROWSER).then(function (logs) {
            var errorLine = null;
            var errorColumn = null;
            logs.forEach(function (log) {
                var match = log.message.match(/\.createError\s+\(.+:(\d+):(\d+)/m);
                if (match) {
                    errorLine = parseInt(match[1]);
                    errorColumn = parseInt(match[2]);
                }
            });
            expect(errorLine).not.toBeNull();
            expect(errorColumn).not.toBeNull();
            var content = fs.readFileSync('dist/all/playground/src/sourcemap/index.js').toString('utf8');
            var marker = '//# sourceMappingURL=data:application/json;base64,';
            var index = content.indexOf(marker);
            var sourceMapData = new Buffer(content.substring(index + marker.length), 'base64').toString('utf8');
            var decoder = new sourceMap.SourceMapConsumer(JSON.parse(sourceMapData));
            var originalPosition = decoder.originalPositionFor({ line: errorLine, column: errorColumn });
            var sourceCodeLines = fs.readFileSync('modules/playground/src/sourcemap/index.ts', {
                encoding: 'UTF-8'
            }).split('\n');
            expect(sourceCodeLines[originalPosition.line - 1])
                .toMatch(/throw new Error\(\'Sourcemap test\'\)/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3Qvc291cmNlbWFwL3NvdXJjZW1hcF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXNDO0FBQ3RDLHlEQUEyQztBQUUzQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXhDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsSUFBTSxHQUFHLEdBQUcseUNBQXlDLENBQUM7SUFFdEQsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLGNBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBDLDBFQUEwRTtRQUMxRSw0Q0FBNEM7UUFDNUMsb0JBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0Isb0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsNEJBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBUztZQUN2RSxJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUM7WUFDN0IsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFRO2dCQUM1QixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO2dCQUNyRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLFdBQVcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUduQyxJQUFNLE9BQU8sR0FDVCxFQUFFLENBQUMsWUFBWSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25GLElBQU0sTUFBTSxHQUFHLG9EQUFvRCxDQUFDO1lBQ3BFLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsSUFBTSxhQUFhLEdBQ2YsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVwRixJQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFFM0UsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1lBRTdGLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsMkNBQTJDLEVBQUU7Z0JBQ3pELFFBQVEsRUFBRSxPQUFPO2FBQ2xCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQzdDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9