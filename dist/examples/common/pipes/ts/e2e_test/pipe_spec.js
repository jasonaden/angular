"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const e2e_util_1 = require("../../../../_common/e2e_util");
function waitForElement(selector) {
    const EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('pipe', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    describe('async', () => {
        const URL = '/common/pipes/ts/';
        it('should resolve and display promise', () => {
            protractor_1.browser.get(URL);
            waitForElement('async-promise-pipe');
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it...');
            protractor_1.element(protractor_1.by.css('async-promise-pipe button')).click();
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it... hi there!');
        });
        it('should update lowercase/uppercase', () => {
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
//# sourceMappingURL=pipe_spec.js.map