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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var resource_loader_impl_1 = require("../src/resource_loader/resource_loader_impl");
// Components for the tests.
var FancyService = (function () {
    function FancyService() {
        this.value = 'real value';
    }
    FancyService.prototype.getAsyncValue = function () { return Promise.resolve('async value'); };
    FancyService.prototype.getTimeoutValue = function () {
        return new Promise(function (resolve, reject) { setTimeout(function () { resolve('timeout value'); }, 10); });
    };
    return FancyService;
}());
var ExternalTemplateComp = (function () {
    function ExternalTemplateComp() {
    }
    return ExternalTemplateComp;
}());
ExternalTemplateComp = __decorate([
    core_1.Component({
        selector: 'external-template-comp',
        templateUrl: '/base/packages/platform-browser/test/static_assets/test.html'
    })
], ExternalTemplateComp);
var BadTemplateUrl = (function () {
    function BadTemplateUrl() {
    }
    return BadTemplateUrl;
}());
BadTemplateUrl = __decorate([
    core_1.Component({ selector: 'bad-template-comp', templateUrl: 'non-existent.html' })
], BadTemplateUrl);
// Tests for angular/testing bundle specific to the browser environment.
// For general tests, see test/testing/testing_public_spec.ts.
function main() {
    describe('test APIs for the browser', function () {
        describe('using the async helper', function () {
            var actuallyDone;
            beforeEach(function () { actuallyDone = false; });
            afterEach(function () { expect(actuallyDone).toEqual(true); });
            it('should run async tests with ResourceLoaders', testing_1.async(function () {
                var resourceLoader = new resource_loader_impl_1.ResourceLoaderImpl();
                resourceLoader.get('/base/packages/platform-browser/test/static_assets/test.html')
                    .then(function () { actuallyDone = true; });
            }), 10000); // Long timeout here because this test makes an actual ResourceLoader.
        });
        describe('using the test injector with the inject helper', function () {
            describe('setting up Providers', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: FancyService, useValue: new FancyService() }] });
                });
                it('provides a real ResourceLoader instance', testing_1.inject([compiler_1.ResourceLoader], function (resourceLoader) {
                    expect(resourceLoader instanceof resource_loader_impl_1.ResourceLoaderImpl).toBeTruthy();
                }));
                it('should allow the use of fakeAsync', testing_1.fakeAsync(testing_1.inject([FancyService], function (service /** TODO #9100 */) {
                    var value /** TODO #9100 */;
                    service.getAsyncValue().then(function (val /** TODO #9100 */) { value = val; });
                    testing_1.tick();
                    expect(value).toEqual('async value');
                })));
            });
        });
        describe('errors', function () {
            var originalJasmineIt;
            var patchJasmineIt = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineIt = jasmine.getEnv().it;
                jasmine.getEnv().it = function (description, fn /** TODO #9100 */) {
                    var done = function () { resolve(null); };
                    done.fail = function (err /** TODO #9100 */) { reject(err); };
                    fn(done);
                    return null;
                };
                return promise;
            };
            var restoreJasmineIt = function () { jasmine.getEnv().it = originalJasmineIt; };
            it('should fail when an ResourceLoader fails', function (done /** TODO #9100 */) {
                var itPromise = patchJasmineIt();
                it('should fail with an error from a promise', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [BadTemplateUrl] });
                    testing_1.TestBed.compileComponents();
                }));
                itPromise.then(function () { done.fail('Expected test to fail, but it did not'); }, function (err) {
                    expect(err.message)
                        .toEqual('Uncaught (in promise): Failed to load non-existent.html');
                    done();
                });
                restoreJasmineIt();
            }, 10000);
        });
        describe('TestBed createComponent', function () {
            it('should allow an external templateUrl', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [ExternalTemplateComp] });
                testing_1.TestBed.compileComponents().then(function () {
                    var componentFixture = testing_1.TestBed.createComponent(ExternalTemplateComp);
                    componentFixture.detectChanges();
                    expect(componentFixture.nativeElement.textContent).toEqual('from external template\n');
                });
            }), 10000); // Long timeout here because this test makes an actual ResourceLoader request, and
            // is slow
            // on Edge.
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19wdWJsaWNfYnJvd3Nlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3Rlc3QvdGVzdGluZ19wdWJsaWNfYnJvd3Nlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBQ2pELHNDQUF3QztBQUN4QyxpREFBOEU7QUFFOUUsb0ZBQStFO0FBSS9FLDRCQUE0QjtBQUM1QjtJQUFBO1FBQ0UsVUFBSyxHQUFXLFlBQVksQ0FBQztJQU0vQixDQUFDO0lBTEMsb0NBQWEsR0FBYixjQUFrQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsc0NBQWUsR0FBZjtRQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FDZCxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQU8sVUFBVSxDQUFDLGNBQVEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFNRCxJQUFNLG9CQUFvQjtJQUExQjtJQUNBLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssb0JBQW9CO0lBSnpCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsd0JBQXdCO1FBQ2xDLFdBQVcsRUFBRSw4REFBOEQ7S0FDNUUsQ0FBQztHQUNJLG9CQUFvQixDQUN6QjtBQUdELElBQU0sY0FBYztJQUFwQjtJQUNBLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssY0FBYztJQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxt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