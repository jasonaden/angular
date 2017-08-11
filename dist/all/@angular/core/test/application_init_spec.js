"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var application_init_1 = require("../src/application_init");
var testing_1 = require("../testing");
function main() {
    describe('ApplicationInitStatus', function () {
        describe('no initializers', function () {
            it('should return true for `done`', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                expect(status.done).toBe(true);
            })));
            it('should return a promise that resolves immediately for `donePromise`', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                status.donePromise.then(function () { expect(status.done).toBe(true); });
            })));
        });
        describe('with async initializers', function () {
            var resolve;
            var promise;
            var completerResolver = false;
            beforeEach(function () {
                var initializerFactory = function (injector) {
                    return function () {
                        var initStatus = injector.get(application_init_1.ApplicationInitStatus);
                        initStatus.donePromise.then(function () { expect(completerResolver).toBe(true); });
                    };
                };
                promise = new Promise(function (res) { resolve = res; });
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: application_init_1.APP_INITIALIZER, multi: true, useValue: function () { return promise; } },
                        {
                            provide: application_init_1.APP_INITIALIZER,
                            multi: true,
                            useFactory: initializerFactory,
                            deps: [core_1.Injector]
                        },
                    ]
                });
            });
            it('should update the status once all async initializers are done', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                setTimeout(function () {
                    completerResolver = true;
                    resolve(null);
                });
                expect(status.done).toBe(false);
                status.donePromise.then(function () {
                    expect(status.done).toBe(true);
                    expect(completerResolver).toBe(true);
                });
            })));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25faW5pdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2FwcGxpY2F0aW9uX2luaXRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHNDQUF1QztBQUN2Qyw0REFBK0U7QUFDL0Usc0NBQWtEO0FBRWxEO0lBQ0UsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUUxQixFQUFFLENBQUMsK0JBQStCLEVBQy9CLGVBQUssQ0FBQyxnQkFBTSxDQUFDLENBQUMsd0NBQXFCLENBQUMsRUFBRSxVQUFDLE1BQTZCO2dCQUNsRSxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVSLEVBQUUsQ0FBQyxxRUFBcUUsRUFDckUsZUFBSyxDQUFDLGdCQUFNLENBQUMsQ0FBQyx3Q0FBcUIsQ0FBQyxFQUFFLFVBQUMsTUFBNkI7Z0JBQ2xFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1lBQ2xDLElBQUksT0FBOEIsQ0FBQztZQUNuQyxJQUFJLE9BQXFCLENBQUM7WUFDMUIsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDOUIsVUFBVSxDQUFDO2dCQUNULElBQUksa0JBQWtCLEdBQUcsVUFBQyxRQUFrQjtvQkFDMUMsTUFBTSxDQUFDO3dCQUNMLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsd0NBQXFCLENBQUMsQ0FBQzt3QkFDdkQsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0UsQ0FBQyxDQUFDO2dCQUNKLENBQUMsQ0FBQztnQkFDRixPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxHQUFHLElBQU8sT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO29CQUM3QixTQUFTLEVBQUU7d0JBQ1QsRUFBQyxPQUFPLEVBQUUsa0NBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxjQUFNLE9BQUEsT0FBTyxFQUFQLENBQU8sRUFBQzt3QkFDaEU7NEJBQ0UsT0FBTyxFQUFFLGtDQUFlOzRCQUN4QixLQUFLLEVBQUUsSUFBSTs0QkFDWCxVQUFVLEVBQUUsa0JBQWtCOzRCQUM5QixJQUFJLEVBQUUsQ0FBQyxlQUFRLENBQUM7eUJBQ2pCO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUMvRCxlQUFLLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLHdDQUFxQixDQUFDLEVBQUUsVUFBQyxNQUE2QjtnQkFDbEUsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUV6QixVQUFVLENBQUM7b0JBQ1QsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztvQkFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTNERCxvQkEyREMifQ==