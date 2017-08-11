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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var angular = require("@angular/upgrade/src/common/angular1");
var constants_1 = require("@angular/upgrade/src/common/constants");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    [true, false].forEach(function (propagateDigest) {
        describe("lazy-load ng2 module (propagateDigest: " + propagateDigest + ")", function () {
            beforeEach(function () { return core_1.destroyPlatform(); });
            it('should support downgrading a component and propagate inputs', testing_1.async(function () {
                var Ng2AComponent = (function () {
                    function Ng2AComponent() {
                        this.value = -1;
                    }
                    return Ng2AComponent;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2AComponent.prototype, "value", void 0);
                Ng2AComponent = __decorate([
                    core_1.Component({ selector: 'ng2A', template: 'a({{ value }}) | <ng2B [value]="value"></ng2B>' })
                ], Ng2AComponent);
                var Ng2BComponent = (function () {
                    function Ng2BComponent() {
                        this.value = -2;
                    }
                    return Ng2BComponent;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2BComponent.prototype, "value", void 0);
                Ng2BComponent = __decorate([
                    core_1.Component({ selector: 'ng2B', template: 'b({{ value }})' })
                ], Ng2BComponent);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2AComponent, Ng2BComponent],
                        entryComponents: [Ng2AComponent],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2AComponent, propagateDigest: propagateDigest }))
                    .run(function ($rootScope) { return $rootScope.value = 0; });
                var element = test_helpers_1.html('<div><ng2 [value]="value" ng-if="loadNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('value = 1');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('loadNg2 = true');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).not.toThrow();
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('a(1) | b(1)'); });
                });
            }));
            it('should support using an upgraded service', testing_1.async(function () {
                var Ng2Service = (function () {
                    function Ng2Service(ng1Value) {
                        var _this = this;
                        this.ng1Value = ng1Value;
                        this.getValue = function () { return _this.ng1Value + "-bar"; };
                    }
                    return Ng2Service;
                }());
                Ng2Service = __decorate([
                    __param(0, core_1.Inject('ng1Value')),
                    __metadata("design:paramtypes", [String])
                ], Ng2Service);
                var Ng2Component = (function () {
                    function Ng2Component(ng2Service) {
                        this.value = ng2Service.getValue();
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '{{ value }}' }),
                    __metadata("design:paramtypes", [Ng2Service])
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                        providers: [
                            Ng2Service,
                            {
                                provide: 'ng1Value',
                                useFactory: function (i) { return i.get('ng1Value'); },
                                deps: ['$injector'],
                            },
                        ],
                    })
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }))
                    .value('ng1Value', 'foo');
                var element = test_helpers_1.html('<div><ng2 ng-if="loadNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                $rootScope.$apply('loadNg2 = true');
                expect(element.textContent).toBe('');
                expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).toThrowError();
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    expect(function () { return $injector.get(constants_1.INJECTOR_KEY); }).not.toThrow();
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('foo-bar'); });
                });
            }));
            it('should create components inside the Angular zone', testing_1.async(function () {
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.inTheZone = false;
                        this.inTheZone = core_1.NgZone.isInAngularZone();
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'In the zone: {{ inTheZone }}' }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                angular.bootstrap(element, [ng1Module.name]);
                // Wait for the module to be bootstrapped.
                setTimeout(function () {
                    // Wait for `$evalAsync()` to propagate inputs.
                    setTimeout(function () { return expect(element.textContent).toBe('In the zone: true'); });
                });
            }));
            it('should propagate input changes inside the Angular zone', testing_1.async(function () {
                var ng2Component;
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.attrInput = 'foo';
                        this.propInput = 'foo';
                        ng2Component = this;
                    }
                    Ng2Component.prototype.ngOnChanges = function () { };
                    return Ng2Component;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "attrInput", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng2Component.prototype, "propInput", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '' }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }))
                    .run(function ($rootScope) {
                    $rootScope.attrVal = 'bar';
                    $rootScope.propVal = 'bar';
                });
                var element = test_helpers_1.html('<ng2 attr-input="{{ attrVal }}" [prop-input]="propVal"></ng2>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                setTimeout(function () {
                    setTimeout(function () {
                        var expectToBeInNgZone = function () { return expect(core_1.NgZone.isInAngularZone()).toBe(true); };
                        var changesSpy = spyOn(ng2Component, 'ngOnChanges').and.callFake(expectToBeInNgZone);
                        expect(ng2Component.attrInput).toBe('bar');
                        expect(ng2Component.propInput).toBe('bar');
                        $rootScope.$apply('attrVal = "baz"');
                        expect(ng2Component.attrInput).toBe('baz');
                        expect(ng2Component.propInput).toBe('bar');
                        expect(changesSpy).toHaveBeenCalledTimes(1);
                        $rootScope.$apply('propVal = "qux"');
                        expect(ng2Component.attrInput).toBe('baz');
                        expect(ng2Component.propInput).toBe('qux');
                        expect(changesSpy).toHaveBeenCalledTimes(2);
                    });
                });
            }));
            it('should wire up the component for change detection', testing_1.async(function () {
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.count = 0;
                    }
                    Ng2Component.prototype.increment = function () { ++this.count; };
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '{{ count }}<button (click)="increment()"></button>' })
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                angular.bootstrap(element, [ng1Module.name]);
                setTimeout(function () {
                    setTimeout(function () {
                        var button = element.querySelector('button');
                        expect(element.textContent).toBe('0');
                        button.click();
                        expect(element.textContent).toBe('1');
                        button.click();
                        expect(element.textContent).toBe('2');
                    });
                });
            }));
            it('should only retrieve the Angular zone once (and cache it for later use)', testing_1.fakeAsync(function () {
                var count = 0;
                var getNgZoneCount = 0;
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.count = ++count;
                        this.inTheZone = false;
                        this.inTheZone = core_1.NgZone.isInAngularZone();
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'Count: {{ count }} | In the zone: {{ inTheZone }}' }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module(injector) {
                        var originalGet = injector.get;
                        injector.get = function (token) {
                            if (token === core_1.NgZone)
                                ++getNgZoneCount;
                            return originalGet.apply(injector, arguments);
                        };
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    }),
                    __metadata("design:paramtypes", [core_1.Injector])
                ], Ng2Module);
                var tickDelay = browser_util_1.browserDetection.isIE ? 100 : 0;
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<div><ng2 ng-if="showNg2"></ng2></div>');
                var $injector = angular.bootstrap(element, [ng1Module.name]);
                var $rootScope = $injector.get(constants_1.$ROOT_SCOPE);
                $rootScope.$apply('showNg2 = true');
                testing_1.tick(tickDelay); // Wait for the module to be bootstrapped and `$evalAsync()` to
                // propagate inputs.
                var injector = $injector.get(constants_1.LAZY_MODULE_REF).injector;
                var injectorGet = injector.get;
                spyOn(injector, 'get').and.callFake(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    expect(args[0]).not.toBe(core_1.NgZone);
                    return injectorGet.apply(injector, args);
                });
                expect(element.textContent).toBe('Count: 1 | In the zone: true');
                $rootScope.$apply('showNg2 = false');
                expect(element.textContent).toBe('');
                $rootScope.$apply('showNg2 = true');
                testing_1.tick(tickDelay); // Wait for `$evalAsync()` to propagate inputs.
                expect(element.textContent).toBe('Count: 2 | In the zone: true');
                $rootScope.$destroy();
            }));
            it('should give access to both injectors in the Angular module\'s constructor', testing_1.async(function () {
                var $injectorFromNg2 = null;
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '' })
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module(injector) {
                        $injectorFromNg2 = injector.get('$injector');
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    }),
                    __metadata("design:paramtypes", [core_1.Injector])
                ], Ng2Module);
                var bootstrapFn = function (extraProviders) {
                    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(Ng2Module);
                };
                var lazyModuleName = static_1.downgradeModule(bootstrapFn);
                var ng1Module = angular.module('ng1', [lazyModuleName])
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: propagateDigest }));
                var element = test_helpers_1.html('<ng2></ng2>');
                var $injectorFromNg1 = angular.bootstrap(element, [ng1Module.name]);
                // Wait for the module to be bootstrapped.
                setTimeout(function () { return expect($injectorFromNg2).toBe($injectorFromNg1); });
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9kb3duZ3JhZGVfbW9kdWxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBK0g7QUFDL0gsaURBQTZEO0FBQzdELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsbUZBQW9GO0FBQ3BGLDhEQUFnRTtBQUNoRSxtRUFBaUc7QUFFakcsa0RBQTRFO0FBRTVFLGdEQUFxQztBQUdyQztJQUNFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLGVBQWU7UUFDbkMsUUFBUSxDQUFDLDRDQUEwQyxlQUFlLE1BQUcsRUFBRTtZQUVyRSxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1lBRXBDLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxlQUFLLENBQUM7Z0JBR25FLElBQU0sYUFBYTtvQkFGbkI7d0JBR1csVUFBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0QixDQUFDO29CQUFELG9CQUFDO2dCQUFELENBQUMsQUFGRCxJQUVDO2dCQURVO29CQUFSLFlBQUssRUFBRTs7NERBQVk7Z0JBRGhCLGFBQWE7b0JBRmxCLGdCQUFTLENBQ04sRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnREFBZ0QsRUFBQyxDQUFDO21CQUM3RSxhQUFhLENBRWxCO2dCQUdELElBQU0sYUFBYTtvQkFEbkI7d0JBRVcsVUFBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0QixDQUFDO29CQUFELG9CQUFDO2dCQUFELENBQUMsQUFGRCxJQUVDO2dCQURVO29CQUFSLFlBQUssRUFBRTs7NERBQVk7Z0JBRGhCLGFBQWE7b0JB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