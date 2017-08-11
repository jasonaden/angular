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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var metadata_resolver_1 = require("@angular/compiler/src/metadata_resolver");
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
function main() {
    describe('Jit Summaries', function () {
        var instances;
        var SomeDep = (function () {
            function SomeDep() {
            }
            return SomeDep;
        }());
        var Base = (function () {
            function Base(dep) {
                this.dep = dep;
                instances.set(Object.getPrototypeOf(this).constructor, this);
            }
            return Base;
        }());
        function expectInstanceCreated(type) {
            var instance = instances.get(type);
            expect(instance).toBeDefined();
            expect(instance.dep instanceof SomeDep).toBe(true);
        }
        var SomeModule = (function (_super) {
            __extends(SomeModule, _super);
            function SomeModule() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeModule;
        }(Base));
        var SomePrivateComponent = (function (_super) {
            __extends(SomePrivateComponent, _super);
            function SomePrivateComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomePrivateComponent;
        }(Base));
        var SomePublicComponent = (function (_super) {
            __extends(SomePublicComponent, _super);
            function SomePublicComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomePublicComponent;
        }(Base));
        var SomeDirective = (function (_super) {
            __extends(SomeDirective, _super);
            function SomeDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeDirective;
        }(Base));
        var SomePipe = (function (_super) {
            __extends(SomePipe, _super);
            function SomePipe() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SomePipe.prototype.transform = function (value) { return value; };
            return SomePipe;
        }(Base));
        var SomeService = (function (_super) {
            __extends(SomeService, _super);
            function SomeService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeService;
        }(Base));
        // Move back into the it which needs it after https://github.com/angular/tsickle/issues/547 is
        // fixed.
        var TestComp3 = (function () {
            function TestComp3(service) {
            }
            return TestComp3;
        }());
        TestComp3 = __decorate([
            core_1.Component({ template: '<div someDir>{{1 | somePipe}}</div>' }),
            __metadata("design:paramtypes", [SomeService])
        ], TestComp3);
        function resetTestEnvironmentWithSummaries(summaries) {
            var _a = testing_1.getTestBed(), platform = _a.platform, ngModule = _a.ngModule;
            testing_1.TestBed.resetTestEnvironment();
            testing_1.TestBed.initTestEnvironment(ngModule, platform, summaries);
        }
        function createSummaries() {
            var resourceLoader = new resource_loader_mock_1.MockResourceLoader();
            setMetadata(resourceLoader);
            testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: resourceLoader }] });
            testing_1.TestBed.configureTestingModule({ imports: [SomeModule], providers: [SomeDep] });
            testing_1.TestBed.compileComponents().then(function () {
                var metadataResolver = testing_1.TestBed.get(metadata_resolver_1.CompileMetadataResolver);
                var summaries = [
                    metadataResolver.getNgModuleSummary(SomeModule),
                    // test nesting via closures, as we use this in the generated code too.
                    function () {
                        return [metadataResolver.getDirectiveSummary(SomePublicComponent),
                            metadataResolver.getDirectiveSummary(SomePrivateComponent),
                        ];
                    },
                    metadataResolver.getDirectiveSummary(SomeDirective),
                    metadataResolver.getPipeSummary(SomePipe),
                    metadataResolver.getInjectableSummary(SomeService)
                ];
                clearMetadata();
                resetTestEnvironmentWithSummaries(function () { return summaries; });
            });
            resourceLoader.flush();
        }
        function setMetadata(resourceLoader) {
            Base.parameters = [[SomeDep]];
            SomeModule.annotations = [new core_1.NgModule({
                    declarations: [SomePublicComponent, SomePrivateComponent, SomeDirective, SomePipe],
                    exports: [SomeDirective, SomePipe, SomePublicComponent],
                    providers: [SomeService]
                })];
            SomePublicComponent.annotations = [new core_1.Component({ templateUrl: 'somePublicUrl.html' })];
            resourceLoader.expect('somePublicUrl.html', "Hello public world!");
            SomePrivateComponent.annotations = [new core_1.Component({ templateUrl: 'somePrivateUrl.html' })];
            resourceLoader.expect('somePrivateUrl.html', "Hello private world!");
            SomeDirective.annotations = [new core_1.Directive({ selector: '[someDir]' })];
            SomePipe.annotations = [new core_1.Pipe({ name: 'somePipe' })];
            SomeService.annotations = [new core_1.Injectable()];
        }
        function clearMetadata() {
            Base.parameters = [];
            SomeModule.annotations = [];
            SomePublicComponent.annotations = [];
            SomePrivateComponent.annotations = [];
            SomeDirective.annotations = [];
            SomePipe.annotations = [];
            SomeService.annotations = [];
        }
        beforeEach(testing_1.async(function () {
            instances = new Map();
            createSummaries();
        }));
        afterEach(function () { resetTestEnvironmentWithSummaries(); });
        it('should use directive metadata from summaries', function () {
            var TestComp = (function () {
                function TestComp() {
                }
                return TestComp;
            }());
            TestComp = __decorate([
                core_1.Component({ template: '<div someDir></div>' })
            ], TestComp);
            testing_1.TestBed
                .configureTestingModule({ providers: [SomeDep], declarations: [TestComp, SomeDirective] })
                .createComponent(TestComp);
            expectInstanceCreated(SomeDirective);
        });
        it('should use pipe metadata from summaries', function () {
            var TestComp = (function () {
                function TestComp() {
                }
                return TestComp;
            }());
            TestComp = __decorate([
                core_1.Component({ template: '{{1 | somePipe}}' })
            ], TestComp);
            testing_1.TestBed.configureTestingModule({ providers: [SomeDep], declarations: [TestComp, SomePipe] })
                .createComponent(TestComp);
            expectInstanceCreated(SomePipe);
        });
        it('should use Service metadata from summaries', function () {
            testing_1.TestBed.configureTestingModule({
                providers: [SomeService, SomeDep],
            });
            testing_1.TestBed.get(SomeService);
            expectInstanceCreated(SomeService);
        });
        it('should use NgModule metadata from summaries', function () {
            testing_1.TestBed
                .configureTestingModule({ providers: [SomeDep], declarations: [TestComp3], imports: [SomeModule] })
                .createComponent(TestComp3);
            expectInstanceCreated(SomeModule);
            expectInstanceCreated(SomeDirective);
            expectInstanceCreated(SomePipe);
            expectInstanceCreated(SomeService);
        });
        it('should allow to create private components from imported NgModule summaries', function () {
            testing_1.TestBed.configureTestingModule({ providers: [SomeDep], imports: [SomeModule] })
                .createComponent(SomePrivateComponent);
            expectInstanceCreated(SomePrivateComponent);
        });
        it('should throw when trying to mock a type with a summary', function () {
            testing_1.TestBed.resetTestingModule();
            expect(function () { return testing_1.TestBed.overrideComponent(SomePrivateComponent, { add: {} }).compileComponents(); })
                .toThrowError('SomePrivateComponent was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            expect(function () { return testing_1.TestBed.overrideDirective(SomeDirective, { add: {} }).compileComponents(); })
                .toThrowError('SomeDirective was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            expect(function () { return testing_1.TestBed.overridePipe(SomePipe, { add: { name: 'test' } }).compileComponents(); })
                .toThrowError('SomePipe was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            expect(function () { return testing_1.TestBed.overrideModule(SomeModule, { add: {} }).compileComponents(); })
                .toThrowError('SomeModule was AOT compiled, so its metadata cannot be changed.');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X3N1bW1hcmllc19pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9qaXRfc3VtbWFyaWVzX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBQ2pELDZFQUFnRjtBQUNoRiwyRkFBc0Y7QUFDdEYsc0NBQXFGO0FBQ3JGLGlEQUFpRTtBQUVqRTtJQUNFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxTQUF5QixDQUFDO1FBRTlCO1lBQUE7WUFBZSxDQUFDO1lBQUQsY0FBQztRQUFELENBQUMsQUFBaEIsSUFBZ0I7UUFFaEI7WUFJRSxjQUFtQixHQUFZO2dCQUFaLFFBQUcsR0FBSCxHQUFHLENBQVM7Z0JBQzdCLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0QsQ0FBQztZQUNILFdBQUM7UUFBRCxDQUFDLEFBUEQsSUFPQztRQUVELCtCQUErQixJQUFTO1lBQ3RDLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFHLENBQUM7WUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7WUFBeUIsOEJBQUk7WUFBN0I7O1lBQStCLENBQUM7WUFBRCxpQkFBQztRQUFELENBQUMsQUFBaEMsQ0FBeUIsSUFBSSxHQUFHO1FBRWhDO1lBQW1DLHdDQUFJO1lBQXZDOztZQUF5QyxDQUFDO1lBQUQsMkJBQUM7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