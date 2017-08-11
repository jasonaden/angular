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
var assertEventsContainsName = function (events, eventName) {
    var found = false;
    for (var i = 0; i < events.length; ++i) {
        if (events[i].name == eventName) {
            found = true;
            break;
        }
    }
    expect(found).toBeTruthy();
};
describe('firefox extension', function () {
    var TEST_URL = 'http://localhost:8001/playground/src/hello_world/index.html';
    it('should measure performance', function () {
        protractor_1.browser.sleep(3000); // wait for extension to load
        protractor_1.browser.driver.get(TEST_URL);
        protractor_1.browser.executeScript('window.startProfiler()').then(function () {
            console.log('started measuring perf');
        });
        protractor_1.browser.executeAsyncScript('setTimeout(arguments[0], 1000);');
        protractor_1.browser.executeScript('window.forceGC()');
        protractor_1.browser.executeAsyncScript('var cb = arguments[0]; window.getProfile(cb);')
            .then(function (profile) {
            assertEventsContainsName(profile, 'gc');
            assertEventsContainsName(profile, 'script');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQWdDO0FBQ2hDLHlDQUFtQztBQUVuQyxJQUFNLHdCQUF3QixHQUFHLFVBQVMsTUFBYSxFQUFFLFNBQWlCO0lBQ3hFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLEtBQUssQ0FBQztRQUNSLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUVGLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixJQUFNLFFBQVEsR0FBRyw2REFBNkQsQ0FBQztJQUUvRSxFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDL0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSw2QkFBNkI7UUFFbkQsb0JBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdCLG9CQUFPLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILG9CQUFPLENBQUMsa0JBQWtCLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUM5RCxvQkFBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTFDLG9CQUFPLENBQUMsa0JBQWtCLENBQUMsK0NBQStDLENBQUM7YUFDdEUsSUFBSSxDQUFDLFVBQVMsT0FBWTtZQUN6Qix3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9