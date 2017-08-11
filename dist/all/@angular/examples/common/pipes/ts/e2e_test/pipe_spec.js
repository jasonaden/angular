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
var e2e_util_1 = require("../../../../_common/e2e_util");
function waitForElement(selector) {
    var EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('pipe', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('async', function () {
        var URL = '/common/pipes/ts/';
        it('should resolve and display promise', function () {
            protractor_1.browser.get(URL);
            waitForElement('async-promise-pipe');
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it...');
            protractor_1.element(protractor_1.by.css('async-promise-pipe button')).click();
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it... hi there!');
        });
        it('should update lowercase/uppercase', function () {
            protractor_1.browser.get(URL);
            waitForElement('lowerupper-pipe');
            protractor_1.element(protractor_1.by.css('lowerupper-pipe input')).sendKeys('Hello World!');
            expect(protractor_1.element.all(protractor_1.by.css('lowerupper-pipe pre')).get(0).getText())
                .toEqual('\'hello world!\'');
            expect(protractor_1.element.all(protractor_1.by.css('lowerupper-pipe pre')).get(1).getText())
                .toEqual('\'HELLO WORLD!\'');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL2UyZV90ZXN0L3BpcGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUF1RTtBQUN2RSx5REFBbUU7QUFFbkUsd0JBQXdCLFFBQWdCO0lBQ3RDLElBQU0sRUFBRSxHQUFHLCtCQUFrQixDQUFDO0lBQzlCLGdFQUFnRTtJQUNoRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFFakMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixJQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQztRQUVoQyxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDL0Isb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyRCxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNsRSxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtZQUN0QyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNsQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUM5RCxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUM5RCxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==