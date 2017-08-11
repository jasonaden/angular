"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var compiler_1 = require("@angular/compiler");
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
function main() {
    describe('DatePipe', function () {
        var date;
        var isoStringWithoutTime = '2015-01-01';
        var pipe;
        // Check the transformation of a date into a pattern
        function expectDateFormatAs(date, pattern, output) {
            expect(pipe.transform(date, pattern)).toEqual(output);
        }
        // TODO: reactivate the disabled expectations once emulators are fixed in SauceLabs
        // In some old versions of Chrome in Android emulators, time formatting returns dates in the
        // timezone of the VM host,
        // instead of the device timezone. Same symptoms as
        // https://bugs.chromium.org/p/chromium/issues/detail?id=406382
        // This happens locally and in SauceLabs, so some checks are disabled to avoid failures.
        // Tracking issue: https://github.com/angular/angular/issues/11187
        beforeEach(function () {
            date = new Date(2015, 5, 15, 9, 3, 1);
            pipe = new common_1.DatePipe('en-US');
        });
        it('should be marked as pure', function () {
            expect(new pipe_resolver_1.PipeResolver(new compiler_1.JitReflector()).resolve(common_1.DatePipe).pure).toEqual(true);
        });
        describe('supports', function () {
            it('should support date', function () { expect(function () { return pipe.transform(date); }).not.toThrow(); });
            it('should support int', function () { expect(function () { return pipe.transform(123456789); }).not.toThrow(); });
            it('should support numeric strings', function () { expect(function () { return pipe.transform('123456789'); }).not.toThrow(); });
            it('should support decimal strings', function () { expect(function () { return pipe.transform('123456789.11'); }).not.toThrow(); });
            it('should support ISO string', function () { return expect(function () { return pipe.transform('2015-06-15T21:43:11Z'); }).not.toThrow(); });
            it('should return null for empty string', function () { return expect(pipe.transform('')).toEqual(null); });
            it('should return null for NaN', function () { return expect(pipe.transform(Number.NaN)).toEqual(null); });
            it('should support ISO string without time', function () { expect(function () { return pipe.transform(isoStringWithoutTime); }).not.toThrow(); });
            it('should not support other objects', function () { return expect(function () { return pipe.transform({}); }).toThrowError(/InvalidPipeArgument/); });
        });
        describe('transform', function () {
            it('should format each component correctly', function () {
                var dateFixtures = {
                    'y': '2015',
                    'yy': '15',
                    'M': '6',
                    'MM': '06',
                    'MMM': 'Jun',
                    'MMMM': 'June',
                    'd': '15',
                    'dd': '15',
                    'EEE': 'Mon',
                    'EEEE': 'Monday'
                };
                var isoStringWithoutTimeFixtures = {
                    'y': '2015',
                    'yy': '15',
                    'M': '1',
                    'MM': '01',
                    'MMM': 'Jan',
                    'MMMM': 'January',
                    'd': '1',
                    'dd': '01',
                    'EEE': 'Thu',
                    'EEEE': 'Thursday'
                };
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['h'] = '9';
                    dateFixtures['hh'] = '09';
                    dateFixtures['j'] = '9 AM';
                    isoStringWithoutTimeFixtures['h'] = '12';
                    isoStringWithoutTimeFixtures['hh'] = '12';
                    isoStringWithoutTimeFixtures['j'] = '12 AM';
                }
                // IE and Edge can't format a date to minutes and seconds without hours
                if (!browser_util_1.browserDetection.isEdge && !browser_util_1.browserDetection.isIE ||
                    !browser_util_1.browserDetection.supportsNativeIntlApi) {
                    if (!browser_util_1.browserDetection.isOldChrome) {
                        dateFixtures['HH'] = '09';
                        isoStringWithoutTimeFixtures['HH'] = '00';
                    }
                    dateFixtures['E'] = 'M';
                    dateFixtures['L'] = 'J';
                    dateFixtures['m'] = '3';
                    dateFixtures['s'] = '1';
                    dateFixtures['mm'] = '03';
                    dateFixtures['ss'] = '01';
                    isoStringWithoutTimeFixtures['m'] = '0';
                    isoStringWithoutTimeFixtures['s'] = '0';
                    isoStringWithoutTimeFixtures['mm'] = '00';
                    isoStringWithoutTimeFixtures['ss'] = '00';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
                if (!browser_util_1.browserDetection.isOldChrome) {
                    Object.keys(isoStringWithoutTimeFixtures).forEach(function (pattern) {
                        expectDateFormatAs(isoStringWithoutTime, pattern, isoStringWithoutTimeFixtures[pattern]);
                    });
                }
                expect(pipe.transform(date, 'Z')).toBeDefined();
            });
            it('should format common multi component patterns', function () {
                var dateFixtures = {
                    'EEE, M/d/y': 'Mon, 6/15/2015',
                    'EEE, M/d': 'Mon, 6/15',
                    'MMM d': 'Jun 15',
                    'dd/MM/yyyy': '15/06/2015',
                    'MM/dd/yyyy': '06/15/2015',
                    'yMEEEd': '20156Mon15',
                    'MEEEd': '6Mon15',
                    'MMMd': 'Jun15',
                    'yMMMMEEEEd': 'Monday, June 15, 2015'
                };
                // IE and Edge can't format a date to minutes and seconds without hours
                if (!browser_util_1.browserDetection.isEdge && !browser_util_1.browserDetection.isIE ||
                    !browser_util_1.browserDetection.supportsNativeIntlApi) {
                    dateFixtures['ms'] = '31';
                }
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['jm'] = '9:03 AM';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
            });
            it('should format with pattern aliases', function () {
                var dateFixtures = {
                    'MM/dd/yyyy': '06/15/2015',
                    'fullDate': 'Monday, June 15, 2015',
                    'longDate': 'June 15, 2015',
                    'mediumDate': 'Jun 15, 2015',
                    'shortDate': '6/15/2015'
                };
                if (!browser_util_1.browserDetection.isOldChrome) {
                    // IE and Edge do not add a coma after the year in these 2 cases
                    if ((browser_util_1.browserDetection.isEdge || browser_util_1.browserDetection.isIE) &&
                        browser_util_1.browserDetection.supportsNativeIntlApi) {
                        dateFixtures['medium'] = 'Jun 15, 2015 9:03:01 AM';
                        dateFixtures['short'] = '6/15/2015 9:03 AM';
                    }
                    else {
                        dateFixtures['medium'] = 'Jun 15, 2015, 9:03:01 AM';
                        dateFixtures['short'] = '6/15/2015, 9:03 AM';
                    }
                }
                if (!browser_util_1.browserDetection.isOldChrome) {
                    dateFixtures['mediumTime'] = '9:03:01 AM';
                    dateFixtures['shortTime'] = '9:03 AM';
                }
                Object.keys(dateFixtures).forEach(function (pattern) {
                    expectDateFormatAs(date, pattern, dateFixtures[pattern]);
                });
            });
            it('should format invalid in IE ISO date', function () { return expect(pipe.transform('2017-01-11T09:25:14.014-0500')).toEqual('Jan 11, 2017'); });
            it('should format invalid in Safari ISO date', function () { return expect(pipe.transform('2017-01-20T19:00:00+0000')).toEqual('Jan 20, 2017'); });
            it('should remove bidi control characters', function () { return expect(pipe.transform(date, 'MM/dd/yyyy').length).toEqual(10); });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZV9waXBlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9waXBlcy9kYXRlX3BpcGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUF5QztBQUN6Qyw4Q0FBK0M7QUFDL0MscUVBQWlFO0FBQ2pFLG1GQUFvRjtBQUVwRjtJQUNFLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBSSxJQUFVLENBQUM7UUFDZixJQUFNLG9CQUFvQixHQUFHLFlBQVksQ0FBQztRQUMxQyxJQUFJLElBQWMsQ0FBQztRQUVuQixvREFBb0Q7UUFDcEQsNEJBQTRCLElBQW1CLEVBQUUsT0FBWSxFQUFFLE1BQWM7WUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRCxtRkFBbUY7UUFDbkYsNEZBQTRGO1FBQzVGLDJCQUEyQjtRQUMzQixtREFBbUQ7UUFDbkQsK0RBQStEO1FBQy9ELHdGQUF3RjtRQUN4RixrRUFBa0U7UUFFbEUsVUFBVSxDQUFDO1lBQ1QsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxHQUFHLElBQUksaUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtZQUM3QixNQUFNLENBQUMsSUFBSSw0QkFBWSxDQUFDLElBQUksdUJBQVksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFRLENBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZGLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFDaEMsY0FBUSxNQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RSxFQUFFLENBQUMsZ0NBQWdDLEVBQ2hDLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUE5QixDQUE4QixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUUsRUFBRSxDQUFDLDJCQUEyQixFQUMzQixjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQWxFLENBQWtFLENBQUMsQ0FBQztZQUU3RSxFQUFFLENBQUMscUNBQXFDLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7WUFFMUYsRUFBRSxDQUFDLDRCQUE0QixFQUFFLGNBQU0sT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWhELENBQWdELENBQUMsQ0FBQztZQUV6RixFQUFFLENBQUMsd0NBQXdDLEVBQ3hDLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRixFQUFFLENBQUMsa0NBQWtDLEVBQ2xDLGNBQU0sT0FBQSxNQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsRUFBcEUsQ0FBb0UsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUNwQixFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLElBQU0sWUFBWSxHQUFRO29CQUN4QixHQUFHLEVBQUUsTUFBTTtvQkFDWCxJQUFJLEVBQUUsSUFBSTtvQkFDVixHQUFHLEVBQUUsR0FBRztvQkFDUixJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsS0FBSztvQkFDWixNQUFNLEVBQUUsTUFBTTtvQkFDZCxHQUFHLEVBQUUsSUFBSTtvQkFDVCxJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsS0FBSztvQkFDWixNQUFNLEVBQUUsUUFBUTtpQkFDakIsQ0FBQztnQkFFRixJQUFNLDRCQUE0QixHQUFRO29CQUN4QyxHQUFHLEVBQUUsTUFBTTtvQkFDWCxJQUFJLEVBQUUsSUFBSTtvQkFDVixHQUFHLEVBQUUsR0FBRztvQkFDUixJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsS0FBSztvQkFDWixNQUFNLEVBQUUsU0FBUztvQkFDakIsR0FBRyxFQUFFLEdBQUc7b0JBQ1IsSUFBSSxFQUFFLElBQUk7b0JBQ1YsS0FBSyxFQUFFLEtBQUs7b0JBQ1osTUFBTSxFQUFFLFVBQVU7aUJBQ25CLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUN4QixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUMxQixZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUMzQiw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDMUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUM5QyxDQUFDO2dCQUVELHVFQUF1RTtnQkFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxNQUFNLElBQUksQ0FBQywrQkFBZ0IsQ0FBQyxJQUFJO29CQUNsRCxDQUFDLCtCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUMxQiw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzVDLENBQUM7b0JBQ0QsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDeEIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDeEIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDeEIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDeEIsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDMUIsNEJBQTRCLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUN4Qyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ3hDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDMUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUM1QyxDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBZTtvQkFDaEQsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBZTt3QkFDaEUsa0JBQWtCLENBQ2Qsb0JBQW9CLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7Z0JBQ2xELElBQU0sWUFBWSxHQUFRO29CQUN4QixZQUFZLEVBQUUsZ0JBQWdCO29CQUM5QixVQUFVLEVBQUUsV0FBVztvQkFDdkIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFlBQVksRUFBRSxZQUFZO29CQUMxQixZQUFZLEVBQUUsWUFBWTtvQkFDMUIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLE9BQU8sRUFBRSxRQUFRO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixZQUFZLEVBQUUsdUJBQXVCO2lCQUN0QyxDQUFDO2dCQUVGLHVFQUF1RTtnQkFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxNQUFNLElBQUksQ0FBQywrQkFBZ0IsQ0FBQyxJQUFJO29CQUNsRCxDQUFDLCtCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztvQkFDNUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDNUIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLCtCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQ2pDLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFlO29CQUNoRCxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO2dCQUN2QyxJQUFNLFlBQVksR0FBUTtvQkFDeEIsWUFBWSxFQUFFLFlBQVk7b0JBQzFCLFVBQVUsRUFBRSx1QkFBdUI7b0JBQ25DLFVBQVUsRUFBRSxlQUFlO29CQUMzQixZQUFZLEVBQUUsY0FBYztvQkFDNUIsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxnRUFBZ0U7b0JBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsK0JBQWdCLENBQUMsTUFBTSxJQUFJLCtCQUFnQixDQUFDLElBQUksQ0FBQzt3QkFDbEQsK0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcseUJBQXlCLENBQUM7d0JBQ25ELFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztvQkFDOUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsMEJBQTBCLENBQUM7d0JBQ3BELFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztvQkFDL0MsQ0FBQztnQkFDSCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsK0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLFlBQVksQ0FBQztvQkFDMUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQWU7b0JBQ2hELGtCQUFrQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzNELENBQUMsQ0FBQyxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQ3RDLGNBQU0sT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUE5RSxDQUE4RSxDQUFDLENBQUM7WUFFekYsRUFBRSxDQUFDLDBDQUEwQyxFQUMxQyxjQUFNLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBMUUsQ0FBMEUsQ0FBQyxDQUFDO1lBRXJGLEVBQUUsQ0FBQyx1Q0FBdUMsRUFDdkMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQS9ELENBQStELENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWxNRCxvQkFrTUMifQ==