"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("@angular/platform-webworker/src/web_workers/shared/serializer");
var platform_location_1 = require("@angular/platform-webworker/src/web_workers/worker/platform_location");
var web_worker_test_util_1 = require("../shared/web_worker_test_util");
var spies_1 = require("./spies");
function main() {
    describe('WebWorkerPlatformLocation', function () {
        var uiBus = null;
        var workerBus = null;
        var broker = null;
        var TEST_LOCATION = new serializer_1.LocationType('http://www.example.com', 'http', 'example.com', 'example.com', '80', '/', '', '', 'http://www.example.com');
        function createWebWorkerPlatformLocation(loc) {
            broker.spy('runOnService')
                .and.callFake(function (args, returnType) {
                if (args.method === 'getLocation') {
                    return Promise.resolve(loc);
                }
            });
            var factory = new web_worker_test_util_1.MockMessageBrokerFactory(broker);
            return new platform_location_1.WebWorkerPlatformLocation(factory, workerBus, null);
        }
        function testPushOrReplaceState(pushState) {
            var platformLocation = createWebWorkerPlatformLocation(null);
            var TITLE = 'foo';
            var URL = 'http://www.example.com/foo';
            web_worker_test_util_1.expectBrokerCall(broker, pushState ? 'pushState' : 'replaceState', [null, TITLE, URL]);
            if (pushState) {
                platformLocation.pushState(null, TITLE, URL);
            }
            else {
                platformLocation.replaceState(null, TITLE, URL);
            }
        }
        beforeEach(function () {
            var buses = web_worker_test_util_1.createPairedMessageBuses();
            uiBus = buses.ui;
            workerBus = buses.worker;
            workerBus.initChannel('ng-Router');
            uiBus.initChannel('ng-Router');
            broker = new spies_1.SpyMessageBroker();
        });
        it('should throw if getBaseHrefFromDOM is called', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            expect(function () { return platformLocation.getBaseHrefFromDOM(); }).toThrowError();
        });
        it('should get location on init', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            web_worker_test_util_1.expectBrokerCall(broker, 'getLocation');
            platformLocation.init();
        });
        it('should throw if set pathname is called before init finishes', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            platformLocation.init();
            expect(function () { return platformLocation.pathname = 'TEST'; }).toThrowError();
        });
        it('should send pathname to render thread', function (done) {
            var platformLocation = createWebWorkerPlatformLocation(TEST_LOCATION);
            platformLocation.init().then(function (_) {
                var PATHNAME = '/test';
                web_worker_test_util_1.expectBrokerCall(broker, 'setPathname', [PATHNAME]);
                platformLocation.pathname = PATHNAME;
                done();
            });
        });
        it('should send pushState to render thread', function () { testPushOrReplaceState(true); });
        it('should send replaceState to render thread', function () { testPushOrReplaceState(false); });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3dvcmtlci9wbGF0Zm9ybV9sb2NhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS0gsNEZBQTRHO0FBQzVHLDBHQUErRztBQUUvRyx1RUFBb0g7QUFFcEgsaUNBQXlDO0FBRXpDO0lBQ0UsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLElBQUksS0FBSyxHQUFlLElBQU0sQ0FBQztRQUMvQixJQUFJLFNBQVMsR0FBZSxJQUFNLENBQUM7UUFDbkMsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO1FBRXZCLElBQU0sYUFBYSxHQUFHLElBQUkseUJBQVksQ0FDbEMsd0JBQXdCLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUNqRix3QkFBd0IsQ0FBQyxDQUFDO1FBRzlCLHlDQUF5QyxHQUFpQjtZQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztpQkFDckIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQWlCLEVBQUUsVUFBc0M7Z0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNQLElBQU0sT0FBTyxHQUFHLElBQUksK0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLElBQUksNkNBQXlCLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFNLENBQUMsQ0FB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