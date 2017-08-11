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
function loadPage(url) {
    protractor_1.browser.ng12Hybrid = true;
    protractor_1.browser.rootEl = 'example-app';
    protractor_1.browser.get(url);
}
describe('upgrade(static)', function () {
    beforeEach(function () { loadPage('/upgrade/static/ts/'); });
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should render the `ng2-heroes` component', function () {
        expect(protractor_1.element(protractor_1.by.css('h1')).getText()).toEqual('Heroes');
        expect(protractor_1.element.all(protractor_1.by.css('p')).get(0).getText()).toEqual('There are 3 heroes.');
    });
    it('should render 3 ng1-hero components', function () {
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(3);
    });
    it('should add a new hero when the "Add Hero" button is pressed', function () {
        var addHeroButton = protractor_1.element.all(protractor_1.by.css('button')).last();
        expect(addHeroButton.getText()).toEqual('Add Hero');
        addHeroButton.click();
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.last().element(protractor_1.by.css('h2')).getText()).toEqual('Kamala Khan');
    });
    it('should remove a hero when the "Remove" button is pressed', function () {
        var firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Superman');
        var removeHeroButton = firstHero.element(protractor_1.by.css('button'));
        expect(removeHeroButton.getText()).toEqual('Remove');
        removeHeroButton.click();
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(2);
        firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Wonder Woman');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy91cGdyYWRlL3N0YXRpYy90cy9lMmVfdGVzdC9zdGF0aWNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFnRDtBQUNoRCx5REFBbUU7QUFFbkUsa0JBQWtCLEdBQVc7SUFDM0Isb0JBQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQzFCLG9CQUFPLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztJQUMvQixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLFVBQVUsQ0FBQyxjQUFRLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFFakMsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1FBQzdDLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25GLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLElBQU0sY0FBYyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1FBQ2hFLElBQU0sYUFBYSxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzRCxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFNLGNBQWMsR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1FBQzdELElBQUksU0FBUyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXRFLElBQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXpCLElBQU0sY0FBYyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFDLFNBQVMsR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=