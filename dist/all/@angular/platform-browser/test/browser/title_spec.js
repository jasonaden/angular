"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('title service', function () {
        var doc = dom_adapter_1.getDOM().createHtmlDocument();
        var initialTitle = dom_adapter_1.getDOM().getTitle(doc);
        var titleService = new platform_browser_1.Title(doc);
        afterEach(function () { dom_adapter_1.getDOM().setTitle(doc, initialTitle); });
        it('should allow reading initial title', function () { matchers_1.expect(titleService.getTitle()).toEqual(initialTitle); });
        it('should set a title on the injected document', function () {
            titleService.setTitle('test title');
            matchers_1.expect(dom_adapter_1.getDOM().getTitle(doc)).toEqual('test title');
            matchers_1.expect(titleService.getTitle()).toEqual('test title');
        });
        it('should reset title to empty string if title not provided', function () {
            titleService.setTitle(null);
            matchers_1.expect(dom_adapter_1.getDOM().getTitle(doc)).toEqual('');
        });
    });
    describe('integration test', function () {
        var DependsOnTitle = (function () {
            function DependsOnTitle(title) {
                this.title = title;
            }
            return DependsOnTitle;
        }());
        DependsOnTitle = __decorate([
            core_1.Injectable(),
            __metadata("design:paramtypes", [platform_browser_1.Title])
        ], DependsOnTitle);
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [platform_browser_1.BrowserModule],
                providers: [DependsOnTitle],
            });
        });
        it('should inject Title service when using BrowserModule', function () { matchers_1.expect(testing_1.TestBed.get(DependsOnTitle).title).toBeAnInstanceOf(platform_browser_1.Title); });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC9icm93c2VyL3RpdGxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFDekMsaURBQThDO0FBQzlDLDhEQUErRDtBQUMvRCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixJQUFNLEdBQUcsR0FBRyxvQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQyxJQUFNLFlBQVksR0FBRyxvQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQU0sWUFBWSxHQUFHLElBQUksd0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQyxTQUFTLENBQUMsY0FBUSxvQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FBQyxvQ0FBb0MsRUFDcEMsY0FBUSxpQkFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJFLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxZQUFZLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BDLGlCQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxpQkFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM3RCxZQUFZLENBQUMsUUFBUSxDQUFDLElBQU0sQ0FBQyxDQUFDO1lBQzlCLGlCQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBRzNCLElBQU0sY0FBYztZQUNsQix3QkFBbUIsS0FBWTtnQkFBWixVQUFLLEdBQUwsS0FBSyxDQUFPO1lBQUcsQ0FBQztZQUNyQyxxQkFBQztRQUFELENBQUMsQUFGRCxJQUVDO1FBRkssY0FBYztZQURuQixpQkFBVSxFQUFFOzZDQUVlLHdCQUFLO1dBRDNCLGNBQWMsQ0FFbkI7UUFFRCxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQ3RELGNBQVEsaUJBQU0sQ0FBQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF4Q0Qsb0JBd0NDIn0=