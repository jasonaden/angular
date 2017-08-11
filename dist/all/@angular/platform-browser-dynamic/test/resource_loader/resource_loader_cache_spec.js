"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var resource_loader_cache_1 = require("../../src/resource_loader/resource_loader_cache");
var resource_loader_cache_setter_1 = require("./resource_loader_cache_setter");
function main() {
    describe('CachedResourceLoader', function () {
        var resourceLoader;
        function createCachedResourceLoader() {
            resource_loader_cache_setter_1.setTemplateCache({ 'test.html': '<div>Hello</div>' });
            return new resource_loader_cache_1.CachedResourceLoader();
        }
        beforeEach(testing_1.fakeAsync(function () {
            testing_1.TestBed.configureCompiler({
                providers: [
                    { provide: compiler_1.UrlResolver, useClass: TestUrlResolver, deps: [] },
                    { provide: compiler_1.ResourceLoader, useFactory: createCachedResourceLoader, deps: [] }
                ]
            });
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent] });
            testing_1.TestBed.compileComponents();
        }));
        it('should throw exception if $templateCache is not found', function () {
            resource_loader_cache_setter_1.setTemplateCache(null);
            matchers_1.expect(function () {
                resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            }).toThrowError('CachedResourceLoader: Template cache was not found in $templateCache.');
        });
        it('should resolve the Promise with the cached file content on success', testing_1.async(function () {
            resource_loader_cache_setter_1.setTemplateCache({ 'test.html': '<div>Hello</div>' });
            resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            resourceLoader.get('test.html').then(function (text) { matchers_1.expect(text).toBe('<div>Hello</div>'); });
        }));
        it('should reject the Promise on failure', testing_1.async(function () {
            resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            resourceLoader.get('unknown.html')
                .then(function (text) { throw new Error('Not expected to succeed.'); })
                .catch(function (error) { });
        }));
        it('should allow fakeAsync Tests to load components with templateUrl synchronously', testing_1.fakeAsync(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent] });
            testing_1.TestBed.compileComponents();
            testing_1.tick();
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            // This should initialize the fixture.
            testing_1.tick();
            matchers_1.expect(fixture.debugElement.children[0].nativeElement).toHaveText('Hello');
        }));
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
    }
    return TestComponent;
}());
TestComponent = __decorate([
    core_1.Component({ selector: 'test-cmp', templateUrl: 'test.html' })
], TestComponent);
var TestUrlResolver = (function (_super) {
    __extends(TestUrlResolver, _super);
    function TestUrlResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestUrlResolver.prototype.resolve = function (baseUrl, url) {
        // Don't use baseUrl to get the same URL as templateUrl.
        // This is to remove any difference between Dart and TS tests.
        return url;
    };
    return TestUrlResolver;
}(compiler_1.UrlResolver));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2NhY2hlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvdGVzdC9yZXNvdXJjZV9sb2FkZXIvcmVzb3VyY2VfbG9hZGVyX2NhY2hlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQThEO0FBQzlELHNDQUF3QztBQUN4QyxpREFBc0U7QUFDdEUsMkVBQXNFO0FBRXRFLHlGQUFxRjtBQUVyRiwrRUFBZ0U7QUFFaEU7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxjQUFvQyxDQUFDO1FBRXpDO1lBQ0UsK0NBQWdCLENBQUMsRUFBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLDRDQUFvQixFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELFVBQVUsQ0FBQyxtQkFBUyxDQUFDO1lBQ25CLGlCQUFPLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxzQkFBVyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztvQkFDM0QsRUFBQyxPQUFPLEVBQUUseUJBQWMsRUFBRSxVQUFVLEVBQUUsMEJBQTBCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztpQkFDNUU7YUFDRixDQUFDLENBQUM7WUFFSCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ2hFLGlCQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELCtDQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLGlCQUFNLENBQUM7Z0JBQ0wsY0FBYyxHQUFHLElBQUksNENBQW9CLEVBQUUsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsdUVBQXVFLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRSxlQUFLLENBQUM7WUFDMUUsK0NBQWdCLENBQUMsRUFBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1lBQ3BELGNBQWMsR0FBRyxJQUFJLDRDQUFvQixFQUFFLENBQUM7WUFDNUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQU8saUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdGLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsZUFBSyxDQUFDO1lBQzVDLGNBQWMsR0FBRyxJQUFJLDRDQUFvQixFQUFFLENBQUM7WUFDNUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7aUJBQzdCLElBQUksQ0FBQyxVQUFDLElBQUksSUFBTyxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2hFLEtBQUssQ0FBQyxVQUFDLEtBQUssSUFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxnRkFBZ0YsRUFDaEYsbUJBQVMsQ0FBQztZQUNSLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDaEUsaUJBQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzVCLGNBQUksRUFBRSxDQUFDO1lBRVAsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFdkQsc0NBQXNDO1lBQ3RDLGNBQUksRUFBRSxDQUFDO1lBRVAsaUJBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXRERCxvQkFzREM7QUFHRCxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDO0dBQ3RELGFBQWEsQ0FDbEI7QUFFRDtJQUE4QixtQ0FBVztJQUF6Qzs7SUFNQSxDQUFDO0lBTEMsaUNBQU8sR0FBUCxVQUFRLE9BQWUsRUFBRSxHQUFXO1FBQ2xDLHdEQUF3RDtRQUN4RCw4REFBOEQ7UUFDOUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFORCxDQUE4QixzQkFBVyxHQU14QyJ9