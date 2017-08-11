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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("@angular/upgrade/src/common/angular1");
var constants_1 = require("@angular/upgrade/src/common/constants");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    describe('upgrade ng1 component', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        describe('template/templateUrl', function () {
            it('should support `template` (string)', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { template: 'Hello, Angular!' };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `template` (function)', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { template: function () { return 'Hello, Angular!'; } };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support not pass any arguments to `template` function', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: function ($attrs, $element) {
                        expect($attrs).toBeUndefined();
                        expect($element).toBeUndefined();
                        return 'Hello, Angular!';
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `templateUrl` (string) fetched from `$templateCache`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: 'ng1.component.html' };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support `templateUrl` (function) fetched from `$templateCache`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            it('should support not pass any arguments to `templateUrl` function', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    templateUrl: function ($attrs, $element) {
                        expect($attrs).toBeUndefined();
                        expect($element).toBeUndefined();
                        return 'ng1.component.html';
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', 'Hello, Angular!');
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Hello, Angular!');
                });
            }));
            // NOT SUPPORTED YET
            xit('should support `templateUrl` (string) fetched from the server', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: 'ng1.component.html' };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .value('$httpBackend', function (method, url, post, callback) {
                    return setTimeout(function () { return callback(200, (method + ":" + url).toLowerCase()); }, 1000);
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('get:ng1.component.html');
                });
            }));
            // NOT SUPPORTED YET
            xit('should support `templateUrl` (function) fetched from the server', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .value('$httpBackend', function (method, url, post, callback) {
                    return setTimeout(function () { return callback(200, (method + ":" + url).toLowerCase()); }, 1000);
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                    testing_1.tick(500);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('get:ng1.component.html');
                });
            }));
            it('should support empty templates', testing_1.async(function () {
                // Define `ng1Component`s
                var ng1ComponentA = { template: '' };
                var ng1ComponentB = { template: function () { return ''; } };
                var ng1ComponentC = { templateUrl: 'ng1.component.html' };
                var ng1ComponentD = { templateUrl: function () { return 'ng1.component.html'; } };
                // Define `Ng1ComponentFacade`s
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(e, i) {
                        return _super.call(this, 'ng1A', e, i) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(e, i) {
                        return _super.call(this, 'ng1B', e, i) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                var Ng1ComponentCFacade = (function (_super) {
                    __extends(Ng1ComponentCFacade, _super);
                    function Ng1ComponentCFacade(e, i) {
                        return _super.call(this, 'ng1C', e, i) || this;
                    }
                    return Ng1ComponentCFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentCFacade = __decorate([
                    core_1.Directive({ selector: 'ng1C' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentCFacade);
                var Ng1ComponentDFacade = (function (_super) {
                    __extends(Ng1ComponentDFacade, _super);
                    function Ng1ComponentDFacade(e, i) {
                        return _super.call(this, 'ng1D', e, i) || this;
                    }
                    return Ng1ComponentDFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentDFacade = __decorate([
                    core_1.Directive({ selector: 'ng1D' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentDFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1A>Ignore this</ng1A>\n               <ng1B>Ignore this</ng1B>\n               <ng1C>Ignore this</ng1C>\n               <ng1D>Ignore this</ng1D>\n             "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1A', ng1ComponentA)
                    .component('ng1B', ng1ComponentB)
                    .component('ng1C', ng1ComponentC)
                    .component('ng1D', ng1ComponentD)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($templateCache) {
                    return $templateCache.put('ng1.component.html', '');
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [
                            Ng1ComponentAFacade, Ng1ComponentBFacade, Ng1ComponentCFacade, Ng1ComponentDFacade,
                            Ng2Component
                        ],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('');
                });
            }));
        });
        describe('bindings', function () {
            it('should support `@` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '@inputAttrA', inputB: '@' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input('inputAttrA'),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputA", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputB", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 inputAttrA=\"{{ dataA }}\" inputB=\"{{ dataB }}\"></ng1>\n               | Outside: {{ dataA }}, {{ dataB }}\n             "
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = 'baz';
                    ng1Controller.inputB = 'qux';
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = 'foo2';
                    ng2ComponentInstance.dataB = 'bar2';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `<` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '<inputAttrA', inputB: '<' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input('inputAttrA'),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputA", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputB", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 [inputAttrA]=\"dataA\" [inputB]=\"dataB\"></ng1>\n               | Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `=` bindings', testing_1.fakeAsync(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '=inputAttrA', inputB: '=' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input('inputAttrA'),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputA", void 0);
                __decorate([
                    core_1.Output('inputAttrAChange'),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputB", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "inputBChange", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 [(inputAttrA)]=\"dataA\" [(inputB)]=\"dataB\"></ng1>\n               | Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: baz, qux');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                });
            }));
            it('should support `&` bindings', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: -',
                    bindings: { outputA: '&outputAttrA', outputB: '&' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Output('outputAttrA'),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "outputA", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "outputB", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 (outputAttrA)=\"dataA = $event\" (outputB)=\"dataB = $event\"></ng1>\n               | Outside: {{ dataA }}, {{ dataB }}\n             "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: foo, bar');
                    ng1Controller.outputA('baz');
                    ng1Controller.outputB('qux');
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: baz, qux');
                });
            }));
            it('should bind properties, events', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: "\n               Hello {{ $ctrl.fullName }};\n               A: {{ $ctrl.modelA }};\n               B: {{ $ctrl.modelB }};\n               C: {{ $ctrl.modelC }}\n             ",
                    bindings: { fullName: '@', modelA: '<dataA', modelB: '=dataB', modelC: '=', event: '&' },
                    controller: function ($scope) {
                        var _this = this;
                        $scope.$watch('$ctrl.modelB', function (v) {
                            if (v === 'Savkin') {
                                _this.modelB = 'SAVKIN';
                                _this.event('WORKS');
                                // Should not update because `modelA: '<dataA'` is uni-directional.
                                _this.modelA = 'VICTOR';
                                // Should not update because `[modelC]` is uni-directional.
                                _this.modelC = 'sf';
                            }
                        });
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "fullName", void 0);
                __decorate([
                    core_1.Input('dataA'),
                    __metadata("design:type", Object)
                ], Ng1ComponentFacade.prototype, "modelA", void 0);
                __decorate([
                    core_1.Input('dataB'),
                    __metadata("design:type", Object)
                ], Ng1ComponentFacade.prototype, "modelB", void 0);
                __decorate([
                    core_1.Output('dataBChange'),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "modelBChange", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentFacade.prototype, "modelC", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "modelCChange", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "event", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                        this.city = 'SF';
                        this.event = '?';
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 fullName=\"{{ last }}, {{ first }}, {{ city }}\"\n                   [(dataA)]=\"first\" [(dataB)]=\"last\" [modelC]=\"city\"\n                   (event)=\"event = $event\">\n               </ng1> |\n               <ng1 fullName=\"{{ 'TEST' }}\" dataA=\"First\" dataB=\"Last\" modelC=\"City\"></ng1> |\n               {{ event }} - {{ last }}, {{ first }}, {{ city }}\n             "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Hello Savkin, Victor, SF; A: VICTOR; B: SAVKIN; C: sf | ' +
                        'Hello TEST; A: First; B: Last; C: City | ' +
                        'WORKS - SAVKIN, Victor, SF');
                    // Detect changes
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Hello SAVKIN, Victor, SF; A: VICTOR; B: SAVKIN; C: sf | ' +
                        'Hello TEST; A: First; B: Last; C: City | ' +
                        'WORKS - SAVKIN, Victor, SF');
                });
            }));
            it('should bind optional properties', testing_1.fakeAsync(function () {
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '=?inputAttrA', inputB: '=?', outputA: '&?outputAttrA', outputB: '&?' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input('inputAttrA'),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputA", void 0);
                __decorate([
                    core_1.Output('inputAttrAChange'),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputB", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "inputBChange", void 0);
                __decorate([
                    core_1.Output('outputAttrA'),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "outputA", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "outputB", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = { value: 'foo' };
                        this.dataB = { value: 'bar' };
                    }
                    Ng2Component.prototype.updateDataB = function (value) { this.dataB.value = value; };
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               <ng1 [(inputAttrA)]=\"dataA\" [(inputB)]=\"dataB.value\"></ng1> |\n               <ng1 inputB=\"Bar\" (outputAttrA)=\"dataA = $event\"></ng1> |\n               <ng1 (outputB)=\"updateDataB($event)\"></ng1> |\n               <ng1></ng1> |\n               Outside: {{ dataA.value }}, {{ dataB.value }}\n             "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1s = element.querySelectorAll('ng1');
                    var ng1Controller0 = angular.element(ng1s[0]).controller('ng1');
                    var ng1Controller1 = angular.element(ng1s[1]).controller('ng1');
                    var ng1Controller2 = angular.element(ng1s[2]).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo, bar | Inside: , Bar | Inside: , | Inside: , | Outside: foo, bar');
                    ng1Controller0.inputA.value = 'baz';
                    ng1Controller0.inputB = 'qux';
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: baz, qux | Inside: , Bar | Inside: , | Inside: , | Outside: baz, qux');
                    ng1Controller1.outputA({ value: 'foo again' });
                    ng1Controller2.outputB('bar again');
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(ng1Controller0.inputA).toEqual({ value: 'foo again' });
                    expect(ng1Controller0.inputB).toEqual('bar again');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo again, bar again | Inside: , Bar | Inside: , | Inside: , | ' +
                        'Outside: foo again, bar again');
                });
            }));
            it('should bind properties, events to scope when bindToController is not used', testing_1.fakeAsync(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ someText }} - Data: {{ inputA }} - Length: {{ inputA.length }}',
                    scope: { inputA: '=', outputA: '&' },
                    controller: function ($scope) {
                        $scope['someText'] = 'ng1';
                        this.$scope = $scope;
                    }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "inputA", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "inputAChange", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata("design:type", core_1.EventEmitter)
                ], Ng1ComponentFacade.prototype, "outputA", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: '[ng1]' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.someText = 'ng2';
                        this.dataA = [1, 2, 3];
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n                <div ng1 [(inputA)]=\"dataA\" (outputA)=\"dataA.push($event)\"></div> |\n                {{ someText }} - Data: {{ dataA }} - Length: {{ dataA.length }}\n              "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var ng1 = element.querySelector('[ng1]');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [1,2,3] - Length: 3 | ng2 - Data: 1,2,3 - Length: 3');
                    ng1Controller.$scope.inputA = [4, 5];
                    testing_1.tick();
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [4,5] - Length: 2 | ng2 - Data: 4,5 - Length: 2');
                    ng1Controller.$scope.outputA(6);
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(ng1Controller.$scope.inputA).toEqual([4, 5, 6]);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('ng1 - Data: [4,5,6] - Length: 3 | ng2 - Data: 4,5,6 - Length: 3');
                });
            }));
        });
        describe('compiling', function () {
            it('should compile the ng1 template in the correct DOM context', testing_1.async(function () {
                var grandParentNodeName;
                // Define `ng1Component`
                var ng1ComponentA = { template: 'ng1A(<ng1-b></ng1-b>)' };
                var ng1DirectiveB = {
                    compile: function (tElem) {
                        grandParentNodeName = tElem.parent().parent()[0].nodeName;
                        return {};
                    }
                };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                // Define `Ng2ComponentX`
                var Ng2ComponentX = (function () {
                    function Ng2ComponentX() {
                    }
                    return Ng2ComponentX;
                }());
                Ng2ComponentX = __decorate([
                    core_1.Component({ selector: 'ng2-x', template: 'ng2X(<ng1A></ng1A>)' })
                ], Ng2ComponentX);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .component('ng1A', ng1ComponentA)
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2X', static_1.downgradeComponent({ component: Ng2ComponentX }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentAFacade, Ng2ComponentX],
                        entryComponents: [Ng2ComponentX],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2-x></ng2-x>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(grandParentNodeName).toBe('NG2-X');
                });
            }));
        });
        describe('linking', function () {
            it('should run the pre-linking after instantiating the controller', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '',
                    link: { pre: function () { return log.push('ng1-pre'); } },
                    controller: (function () {
                        function class_1() {
                            log.push('ng1-ctrl');
                        }
                        return class_1;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1-ctrl', 'ng1-pre']);
                });
            }));
            it('should run the pre-linking function before linking', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: { pre: function () { return log.push('ng1A-pre'); } }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentAFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1A-pre', 'ng1B-post']);
                });
            }));
            it('should run the post-linking function after linking (link: object)', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: { post: function () { return log.push('ng1A-post'); } }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentAFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                });
            }));
            it('should run the post-linking function after linking (link: function)', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '<ng1-b></ng1-b>',
                    link: function () { return log.push('ng1A-post'); }
                };
                var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                // Define `Ng1ComponentAFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentAFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                });
            }));
            it('should run the post-linking function before `$postLink`', testing_1.async(function () {
                var log = [];
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '',
                    link: function () { return log.push('ng1-post'); },
                    controller: (function () {
                        function class_2() {
                        }
                        class_2.prototype.$postLink = function () { log.push('ng1-$post'); };
                        return class_2;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(log).toEqual(['ng1-post', 'ng1-$post']);
                });
            }));
        });
        describe('controller', function () {
            it('should support `controllerAs`', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ vm.scope }}; {{ vm.isClass }}; {{ vm.hasElement }}; {{ vm.isPublished() }}',
                    scope: true,
                    controllerAs: 'vm',
                    controller: (function () {
                        function class_3($element, $scope) {
                            this.$element = $element;
                            this.hasElement = $element[0].nodeName;
                            this.scope = $scope.$parent.$parent === $scope.$root ? 'scope' : 'wrong-scope';
                            this.verifyIAmAClass();
                        }
                        class_3.prototype.isPublished = function () {
                            return this.$element.controller('ng1') === this ? 'published' : 'not-published';
                        };
                        class_3.prototype.verifyIAmAClass = function () { this.isClass = 'isClass'; };
                        return class_3;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('scope; isClass; NG1; published');
                });
            }));
            it('should support `bindToController` (boolean)', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Scope: {{ title }}; Controller: {{ $ctrl.title }}',
                    scope: { title: '@' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_4() {
                        }
                        return class_4;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Scope: {{ title }}; Controller: {{ $ctrl.title }}',
                    scope: { title: '@' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_5() {
                        }
                        return class_5;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentAFacade.prototype, "title", void 0);
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentBFacade.prototype, "title", void 0);
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n            <ng1A title=\"WORKS\"></ng1A> |\n            <ng1B title=\"WORKS\"></ng1B>\n          "
                    })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Scope: WORKS; Controller: | Scope: ; Controller: WORKS');
                });
            }));
            it('should support `bindToController` (object)', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ $ctrl.title }}',
                    scope: {},
                    bindToController: { title: '@' },
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_6() {
                        }
                        return class_6;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "title", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.dataA = 'foo';
                        this.dataB = 'bar';
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('WORKS');
                });
            }));
            it('should support `controller` as string', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1Directive = {
                    template: '{{ $ctrl.title }} {{ $ctrl.text }}',
                    scope: { title: '@' },
                    bindToController: true,
                    controller: 'Ng1Controller as $ctrl'
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng1ComponentFacade.prototype, "title", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .controller('Ng1Controller', (function () {
                    function class_7() {
                        this.text = 'GREAT';
                    }
                    return class_7;
                }()))
                    .directive('ng1', function () { return ng1Directive; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('WORKS GREAT');
                });
            }));
            it('should insert the compiled content before instantiating the controller', testing_1.async(function () {
                var compiledContent;
                var getCurrentContent;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Hello, {{ $ctrl.name }}!',
                    controller: (function () {
                        function class_8($element) {
                            this.name = 'world';
                            getCurrentContent = function () { return $element.text(); };
                            compiledContent = getCurrentContent();
                        }
                        return class_8;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(compiledContent)).toBe('Hello, {{ $ctrl.name }}!');
                    expect(test_helpers_1.multiTrim(getCurrentContent())).toBe('Hello, world!');
                });
            }));
        });
        describe('require', function () {
            // NOT YET SUPPORTED
            xdescribe('in pre-/post-link', function () {
                it('should resolve to its own controller if falsy', testing_1.async(function () {
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: 'Pre: {{ pre }} | Post: {{ post }}',
                        controller: (function () {
                            function class_9() {
                                this.value = 'foo';
                            }
                            return class_9;
                        }()),
                        link: {
                            pre: function (scope, elem, attrs, ctrl) {
                                scope['pre'] = ctrl.value;
                            },
                            post: function (scope, elem, attrs, ctrl) {
                                scope['post'] = ctrl.value;
                            }
                        }
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentFacade = (function (_super) {
                        __extends(Ng1ComponentFacade, _super);
                        function Ng1ComponentFacade(elementRef, injector) {
                            return _super.call(this, 'ng1', elementRef, injector) || this;
                        }
                        return Ng1ComponentFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .directive('ng1', function () { return ng1Directive; })
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('Pre: foo | Post: foo');
                    });
                }));
                // TODO: Add more tests
            });
            describe('in controller', function () {
                it('should be available to children', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng1-b></ng1-b>',
                        controller: (function () {
                            function class_10() {
                                this.value = 'ng1A';
                            }
                            return class_10;
                        }())
                    };
                    var ng1ComponentB = {
                        template: 'Required: {{ $ctrl.required.value }}',
                        require: { required: '^^ng1A' }
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentAFacade = (function (_super) {
                        __extends(Ng1ComponentAFacade, _super);
                        function Ng1ComponentAFacade(elementRef, injector) {
                            return _super.call(this, 'ng1A', elementRef, injector) || this;
                        }
                        return Ng1ComponentAFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentAFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('Required: ng1A');
                    });
                }));
                it('should throw if required controller cannot be found', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = { require: { foo: 'iDoNotExist' } };
                    var ng1ComponentB = { require: { foo: '^iDoNotExist' } };
                    var ng1ComponentC = { require: { foo: '^^iDoNotExist' } };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentAFacade = (function (_super) {
                        __extends(Ng1ComponentAFacade, _super);
                        function Ng1ComponentAFacade(elementRef, injector) {
                            return _super.call(this, 'ng1A', elementRef, injector) || this;
                        }
                        return Ng1ComponentAFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentAFacade = __decorate([
                        core_1.Directive({ selector: 'ng1A' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentAFacade);
                    var Ng1ComponentBFacade = (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    var Ng1ComponentCFacade = (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentCFacade = __decorate([
                        core_1.Directive({ selector: 'ng1C' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentCFacade);
                    // Define `Ng2Component`
                    var Ng2ComponentA = (function () {
                        function Ng2ComponentA() {
                        }
                        return Ng2ComponentA;
                    }());
                    Ng2ComponentA = __decorate([
                        core_1.Component({ selector: 'ng2-a', template: '<ng1A></ng1A>' })
                    ], Ng2ComponentA);
                    var Ng2ComponentB = (function () {
                        function Ng2ComponentB() {
                        }
                        return Ng2ComponentB;
                    }());
                    Ng2ComponentB = __decorate([
                        core_1.Component({ selector: 'ng2-b', template: '<ng1B></ng1B>' })
                    ], Ng2ComponentB);
                    var Ng2ComponentC = (function () {
                        function Ng2ComponentC() {
                        }
                        return Ng2ComponentC;
                    }());
                    Ng2ComponentC = __decorate([
                        core_1.Component({ selector: 'ng2-c', template: '<ng1C></ng1C>' })
                    ], Ng2ComponentC);
                    // Define `ng1Module`
                    var mockExceptionHandler = jasmine.createSpy('$exceptionHandler');
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                        .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }))
                        .directive('ng2C', static_1.downgradeComponent({ component: Ng2ComponentC }))
                        .value('$exceptionHandler', mockExceptionHandler);
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                Ng1ComponentAFacade, Ng1ComponentBFacade, Ng1ComponentCFacade, Ng2ComponentA,
                                Ng2ComponentB, Ng2ComponentC
                            ],
                            entryComponents: [Ng2ComponentA, Ng2ComponentB, Ng2ComponentC],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var elementA = test_helpers_1.html("<ng2-a></ng2-a>");
                    var elementB = test_helpers_1.html("<ng2-b></ng2-b>");
                    var elementC = test_helpers_1.html("<ng2-c></ng2-c>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementA, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'iDoNotExist\' in upgraded directive \'ng1A\'.'));
                    });
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementB, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'^iDoNotExist\' in upgraded directive \'ng1B\'.'));
                    });
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, elementC, ng1Module).then(function () {
                        expect(mockExceptionHandler)
                            .toHaveBeenCalledWith(new Error('Unable to find required \'^^iDoNotExist\' in upgraded directive \'ng1C\'.'));
                    });
                }));
                it('should not throw if missing required controller is optional', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1Component = {
                        require: {
                            foo: '?iDoNotExist',
                            bar: '^?iDoNotExist',
                            baz: '?^^iDoNotExist',
                        }
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentFacade = (function (_super) {
                        __extends(Ng1ComponentFacade, _super);
                        function Ng1ComponentFacade(elementRef, injector) {
                            return _super.call(this, 'ng1', elementRef, injector) || this;
                        }
                        return Ng1ComponentFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentFacade = __decorate([
                        core_1.Directive({ selector: 'ng1' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var mockExceptionHandler = jasmine.createSpy('$exceptionHandler');
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                        .value('$exceptionHandler', mockExceptionHandler);
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(mockExceptionHandler).not.toHaveBeenCalled();
                    });
                }));
                it('should assign resolved values to the controller instance (if `require` is not object)', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: 'ng1A(<div><ng2></ng2></div>)',
                        controller: (function () {
                            function class_11() {
                                this.value = 'A';
                            }
                            return class_11;
                        }())
                    };
                    var ng1ComponentB = {
                        template: "ng1B({{ $ctrl.getProps() }})",
                        require: '^ng1A',
                        controller: (function () {
                            function class_12() {
                            }
                            class_12.prototype.getProps = function () {
                                // If all goes well, there should be no keys on `this`
                                return Object.keys(this).join(', ');
                            };
                            return class_12;
                        }())
                    };
                    var ng1ComponentC = {
                        template: "ng1C({{ $ctrl.getProps() }})",
                        require: ['?ng1A', '^ng1A', '^^ng1A', 'ng1C', '^ng1C', '?^^ng1C'],
                        controller: (function () {
                            function class_13() {
                            }
                            class_13.prototype.getProps = function () {
                                // If all goes well, there should be no keys on `this`
                                return Object.keys(this).join(', ');
                            };
                            return class_13;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    var Ng1ComponentCFacade = (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentCFacade = __decorate([
                        core_1.Directive({ selector: 'ng1C' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentCFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'ng2(<div><ng1B></ng1B> | <ng1C></ng1C></div>)' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentBFacade, Ng1ComponentCFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng1A(ng2(ng1B() | ng1C()))');
                    });
                }));
                it('should assign resolved values to the controller instance (if `require` is object)', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: 'ng1A(<div><ng2></ng2></div>)',
                        controller: (function () {
                            function class_14() {
                                this.value = 'A';
                            }
                            return class_14;
                        }())
                    };
                    var ng1ComponentB = {
                        template: "ng1B(\n                 ng1A: {{ $ctrl.ng1ASelf.value }} |\n                 ^ng1A: {{ $ctrl.ng1ASelfUp.value }} |\n                 ^^ng1A: {{ $ctrl.ng1AParentUp.value }} |\n                 ng1B: {{ $ctrl.ng1BSelf.value }} |\n                 ^ng1B: {{ $ctrl.ng1BSelfUp.value }} |\n                 ^^ng1B: {{ $ctrl.ng1BParentUp.value }}\n               )",
                        require: {
                            ng1ASelf: '?ng1A',
                            ng1ASelfUp: '^ng1A',
                            ng1AParentUp: '^^ng1A',
                            ng1BSelf: 'ng1B',
                            ng1BSelfUp: '^ng1B',
                            ng1BParentUp: '?^^ng1B',
                        },
                        controller: (function () {
                            function class_15() {
                                this.value = 'B';
                            }
                            return class_15;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: 'ng2(<div><ng1B></ng1B></div>)' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent))
                            .toBe('ng1A(ng2(ng1B( ng1A: | ^ng1A: A | ^^ng1A: A | ng1B: B | ^ng1B: B | ^^ng1B: )))');
                    });
                }));
                it('should assign to controller before calling `$onInit()`', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng2></ng2>',
                        controller: (function () {
                            function class_16() {
                                this.value = 'ng1A';
                            }
                            return class_16;
                        }())
                    };
                    var ng1ComponentB = {
                        template: '$onInit: {{ $ctrl.onInitValue }}',
                        require: { required: '^^ng1A' },
                        controller: (function () {
                            function class_17() {
                            }
                            class_17.prototype.$onInit = function () {
                                var self = this;
                                self.onInitValue = self.required.value;
                            };
                            return class_17;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentBFacade = (function (_super) {
                        __extends(Ng1ComponentBFacade, _super);
                        function Ng1ComponentBFacade(elementRef, injector) {
                            return _super.call(this, 'ng1B', elementRef, injector) || this;
                        }
                        return Ng1ComponentBFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentBFacade = __decorate([
                        core_1.Directive({ selector: 'ng1B' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentBFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1B></ng1B>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentBFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng1-a></ng1-a>");
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('$onInit: ng1A');
                    });
                }));
                it('should use the key as name if the required controller name is omitted', testing_1.async(function () {
                    // Define `ng1Component`
                    var ng1ComponentA = {
                        template: '<ng1-b></ng1-b>',
                        controller: (function () {
                            function class_18() {
                                this.value = 'A';
                            }
                            return class_18;
                        }())
                    };
                    var ng1ComponentB = { template: '<ng2></ng2>', controller: (function () {
                            function class_19() {
                                this.value = 'B';
                            }
                            return class_19;
                        }()) };
                    var ng1ComponentC = {
                        template: 'ng1A: {{ $ctrl.ng1A.value }} | ng1B: {{ $ctrl.ng1B.value }} | ng1C: {{ $ctrl.ng1C.value }}',
                        require: {
                            ng1A: '^^',
                            ng1B: '?^',
                            ng1C: '',
                        },
                        controller: (function () {
                            function class_20() {
                                this.value = 'C';
                            }
                            return class_20;
                        }())
                    };
                    // Define `Ng1ComponentFacade`
                    var Ng1ComponentCFacade = (function (_super) {
                        __extends(Ng1ComponentCFacade, _super);
                        function Ng1ComponentCFacade(elementRef, injector) {
                            return _super.call(this, 'ng1C', elementRef, injector) || this;
                        }
                        return Ng1ComponentCFacade;
                    }(static_1.UpgradeComponent));
                    Ng1ComponentCFacade = __decorate([
                        core_1.Directive({ selector: 'ng1C' }),
                        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                    ], Ng1ComponentCFacade);
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1C></ng1C>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1A', ng1ComponentA)
                        .component('ng1B', ng1ComponentB)
                        .component('ng1C', ng1ComponentC)
                        .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        Ng2Module.prototype.ngDoBootstrap = function () { };
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [Ng1ComponentCFacade, Ng2Component],
                            entryComponents: [Ng2Component],
                            imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html('<ng1-a></ng1-a>');
                    test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng1A: A | ng1B: B | ng1C: C');
                    });
                }));
            });
        });
        describe('transclusion', function () {
            it('should support single-slot transclusion', testing_1.async(function () {
                var ng2ComponentAInstance;
                var ng2ComponentBInstance;
                // Define `ng1Component`
                var ng1Component = { template: 'ng1(<div ng-transclude></div>)', transclude: true };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2ComponentA = (function () {
                    function Ng2ComponentA() {
                        this.value = 'foo';
                        this.showB = false;
                        ng2ComponentAInstance = this;
                    }
                    return Ng2ComponentA;
                }());
                Ng2ComponentA = __decorate([
                    core_1.Component({
                        selector: 'ng2A',
                        template: 'ng2A(<ng1>{{ value }} | <ng2B *ngIf="showB"></ng2B></ng1>)'
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2ComponentA);
                var Ng2ComponentB = (function () {
                    function Ng2ComponentB() {
                        this.value = 'bar';
                        ng2ComponentBInstance = this;
                    }
                    return Ng2ComponentB;
                }());
                Ng2ComponentB = __decorate([
                    core_1.Component({ selector: 'ng2B', template: 'ng2B({{ value }})' }),
                    __metadata("design:paramtypes", [])
                ], Ng2ComponentB);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                        entryComponents: [Ng2ComponentA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(foo | ))');
                    ng2ComponentAInstance.value = 'baz';
                    ng2ComponentAInstance.showB = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(bar)))');
                    ng2ComponentBInstance.value = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(qux)))');
                });
            }));
            it('should support single-slot transclusion with fallback content', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(<div ng-transclude>{{ $ctrl.value }}</div>)',
                    transclude: true,
                    controller: (function () {
                        function class_21() {
                            this.value = 'from-ng1';
                            ng1ControllerInstances.push(this);
                        }
                        return class_21;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.value = 'from-ng2';
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'ng2(<ng1>{{ value }}</ng1> | <ng1></ng1>)' }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2(ng1(from-ng2) | ng1(from-ng1))');
                    ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-foo'; });
                    ng2ComponentInstance.value = 'ng2-bar';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2(ng1(ng2-bar) | ng1(ng1-foo))');
                });
            }));
            it('should support multi-slot transclusion', testing_1.async(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(x(<div ng-transclude="slotX"></div>) | y(<div ng-transclude="slotY"></div>))',
                    transclude: { slotX: 'contentX', slotY: 'contentY' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.x = 'foo';
                        this.y = 'bar';
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               ng2(\n                 <ng1>\n                   <content-x>{{ x }}1</content-x>\n                   <content-y>{{ y }}1</content-y>\n                   <content-x>{{ x }}2</content-x>\n                   <content-y>{{ y }}2</content-y>\n                 </ng1>\n               )"
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1foo2)|y(bar1bar2)))');
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1baz2)|y(qux1qux2)))');
                });
            }));
            it('should support default slot (with fallback content)', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(default(<div ng-transclude="">fallback-{{ $ctrl.value }}</div>))',
                    transclude: { slotX: 'contentX', slotY: 'contentY' },
                    controller: (function () {
                        function class_22() {
                            this.value = 'ng1';
                            ng1ControllerInstances.push(this);
                        }
                        return class_22;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.x = 'foo';
                        this.y = 'bar';
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               ng2(\n                 <ng1>\n                   ({{ x }})\n                   <content-x>ignored x</content-x>\n                   {{ x }}-<span>{{ y }}</span>\n                   <content-y>ignored y</content-y>\n                   <span>({{ y }})</span>\n                 </ng1> |\n                 <!--\n                   Remove any whitespace, because in AngularJS versions prior to 1.6\n                   even whitespace counts as transcluded content.\n                 -->\n                 <ng1><content-x>ignored x</content-x><content-y>ignored y</content-y></ng1>\n               )"
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(default((foo)foo-bar(bar)))|ng1(default(fallback-ng1)))');
                    ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-plus'; });
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(default((baz)baz-qux(qux)))|ng1(default(fallback-ng1-plus)))');
                });
            }));
            it('should support optional transclusion slots (with fallback content)', testing_1.async(function () {
                var ng1ControllerInstances = [];
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: "\n               ng1(\n                x(<div ng-transclude=\"slotX\">{{ $ctrl.x }}</div>) |\n                y(<div ng-transclude=\"slotY\">{{ $ctrl.y }}</div>)\n               )",
                    transclude: { slotX: '?contentX', slotY: '?contentY' },
                    controller: (function () {
                        function class_23() {
                            this.x = 'ng1X';
                            this.y = 'ng1Y';
                            ng1ControllerInstances.push(this);
                        }
                        return class_23;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.x = 'ng2X';
                        this.y = 'ng2Y';
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               ng2(\n                 <ng1><content-x>{{ x }}</content-x></ng1> |\n                 <ng1><content-y>{{ y }}</content-y></ng1>\n               )"
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(x(ng2X)|y(ng1Y))|ng1(x(ng1X)|y(ng2Y)))');
                    ng1ControllerInstances.forEach(function (ctrl) {
                        ctrl.x = 'ng1X-foo';
                        ctrl.y = 'ng1Y-bar';
                    });
                    ng2ComponentInstance.x = 'ng2X-baz';
                    ng2ComponentInstance.y = 'ng2Y-qux';
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true))
                        .toBe('ng2(ng1(x(ng2X-baz)|y(ng1Y-bar))|ng1(x(ng1X-foo)|y(ng2Y-qux)))');
                });
            }));
            it('should throw if a non-optional slot is not filled', testing_1.async(function () {
                var errorMessage;
                // Define `ng1Component`
                var ng1Component = {
                    template: '',
                    transclude: { slotX: '?contentX', slotY: 'contentY' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .value('$exceptionHandler', function (error) { return errorMessage = error.message; })
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(errorMessage)
                        .toContain('Required transclusion slot \'slotY\' on directive: ng1');
                });
            }));
            it('should support structural directives in transcluded content', testing_1.async(function () {
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'ng1(x(<div ng-transclude="slotX"></div>) | default(<div ng-transclude=""></div>))',
                    transclude: { slotX: 'contentX' }
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.x = 'foo';
                        this.y = 'bar';
                        this.show = true;
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "\n               ng2(\n                 <ng1>\n                   <content-x><div *ngIf=\"show\">{{ x }}1</div></content-x>\n                   <div *ngIf=\"!show\">{{ y }}1</div>\n                   <content-x><div *ngIf=\"!show\">{{ x }}2</div></content-x>\n                   <div *ngIf=\"show\">{{ y }}2</div>\n                 </ng1>\n               )"
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        schemas: [core_1.NO_ERRORS_SCHEMA]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1)|default(bar2)))');
                    ng2ComponentInstance.x = 'baz';
                    ng2ComponentInstance.y = 'qux';
                    ng2ComponentInstance.show = false;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz2)|default(qux1)))');
                    ng2ComponentInstance.show = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1)|default(qux2)))');
                });
            }));
        });
        describe('lifecycle hooks', function () {
            it('should call `$onChanges()` on binding destination (prototype)', testing_1.fakeAsync(function () {
                var scopeOnChanges = jasmine.createSpy('scopeOnChanges');
                var controllerOnChangesA = jasmine.createSpy('controllerOnChangesA');
                var controllerOnChangesB = jasmine.createSpy('controllerOnChangesB');
                var ng2ComponentInstance;
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '',
                    scope: { inputA: '<' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_24() {
                        }
                        class_24.prototype.$onChanges = function (changes) { controllerOnChangesA(changes); };
                        return class_24;
                    }())
                };
                var ng1DirectiveB = {
                    template: '',
                    scope: { inputB: '<' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_25() {
                        }
                        class_25.prototype.$onChanges = function (changes) { controllerOnChangesB(changes); };
                        return class_25;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentAFacade.prototype, "inputA", void 0);
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentBFacade.prototype, "inputB", void 0);
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.data = { foo: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '<ng1A [inputA]="data"></ng1A> | <ng1B [inputB]="data"></ng1B>'
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                    .run(function ($rootScope) {
                    Object.getPrototypeOf($rootScope)['$onChanges'] = scopeOnChanges;
                });
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeOnChanges.calls.count()).toBe(1);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(1);
                    expect(scopeOnChanges.calls.argsFor(0)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(0)[0].inputA.currentValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChanges.calls.argsFor(0)[0].inputA.isFirstChange()).toBe(true);
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.currentValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.isFirstChange()).toBe(true);
                    // Change: Re-assign `data`
                    ng2ComponentInstance.data = { foo: 'baz' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(2);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    expect(scopeOnChanges.calls.argsFor(1)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.previousValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.currentValue).toEqual({ foo: 'baz' });
                    expect(scopeOnChanges.calls.argsFor(1)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.previousValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.currentValue).toEqual({
                        foo: 'baz'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.isFirstChange()).toBe(false);
                    // No change: Update internal property
                    ng2ComponentInstance.data.foo = 'qux';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(2);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    // Change: Re-assign `data` (even if it looks the same)
                    ng2ComponentInstance.data = { foo: 'qux' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChanges.calls.count()).toBe(3);
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(3);
                    expect(scopeOnChanges.calls.argsFor(2)[0]).toEqual({ inputA: jasmine.any(Object) });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.previousValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.currentValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChanges.calls.argsFor(2)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.previousValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.currentValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.isFirstChange()).toBe(false);
                });
            }));
            it('should call `$onChanges()` on binding destination (instance)', testing_1.fakeAsync(function () {
                var scopeOnChangesA = jasmine.createSpy('scopeOnChangesA');
                var scopeOnChangesB = jasmine.createSpy('scopeOnChangesB');
                var controllerOnChangesA = jasmine.createSpy('controllerOnChangesA');
                var controllerOnChangesB = jasmine.createSpy('controllerOnChangesB');
                var ng2ComponentInstance;
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: '',
                    scope: { inputA: '<' },
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_26($scope) {
                            $scope['$onChanges'] = scopeOnChangesA;
                            this.$onChanges = controllerOnChangesA;
                        }
                        return class_26;
                    }())
                };
                var ng1DirectiveB = {
                    template: '',
                    scope: { inputB: '<' },
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_27($scope) {
                            $scope['$onChanges'] = scopeOnChangesB;
                            this.$onChanges = controllerOnChangesB;
                        }
                        return class_27;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentAFacade.prototype, "inputA", void 0);
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentBFacade.prototype, "inputB", void 0);
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                        this.data = { foo: 'bar' };
                        ng2ComponentInstance = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '<ng1A [inputA]="data"></ng1A> | <ng1B [inputB]="data"></ng1B>'
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeOnChangesA.calls.count()).toBe(1);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(1);
                    expect(scopeOnChangesA.calls.argsFor(0)[0].inputA.currentValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChangesA.calls.argsFor(0)[0].inputA.isFirstChange()).toBe(true);
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.currentValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(0)[0].inputB.isFirstChange()).toBe(true);
                    // Change: Re-assign `data`
                    ng2ComponentInstance.data = { foo: 'baz' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(2);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.previousValue).toEqual({ foo: 'bar' });
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.currentValue).toEqual({ foo: 'baz' });
                    expect(scopeOnChangesA.calls.argsFor(1)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.previousValue).toEqual({
                        foo: 'bar'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.currentValue).toEqual({
                        foo: 'baz'
                    });
                    expect(controllerOnChangesB.calls.argsFor(1)[0].inputB.isFirstChange()).toBe(false);
                    // No change: Update internal property
                    ng2ComponentInstance.data.foo = 'qux';
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(2);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(2);
                    // Change: Re-assign `data` (even if it looks the same)
                    ng2ComponentInstance.data = { foo: 'qux' };
                    test_helpers_1.$digest(adapter);
                    testing_1.tick();
                    expect(scopeOnChangesA.calls.count()).toBe(3);
                    expect(scopeOnChangesB).not.toHaveBeenCalled();
                    expect(controllerOnChangesA).not.toHaveBeenCalled();
                    expect(controllerOnChangesB.calls.count()).toBe(3);
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.previousValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.currentValue).toEqual({ foo: 'qux' });
                    expect(scopeOnChangesA.calls.argsFor(2)[0].inputA.isFirstChange()).toBe(false);
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.previousValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.currentValue).toEqual({
                        foo: 'qux'
                    });
                    expect(controllerOnChangesB.calls.argsFor(2)[0].inputB.isFirstChange()).toBe(false);
                });
            }));
            it('should call `$onInit()` on controller', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: (function () {
                        function class_28($scope) {
                            this.$scope = $scope;
                            $scope['called'] = 'no';
                        }
                        class_28.prototype.$onInit = function () { this.$scope['called'] = 'yes'; };
                        return class_28;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: (function () {
                        function class_29($scope) {
                            $scope['called'] = 'no';
                            this['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_29;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: yes | Called: yes');
                });
            }));
            it('should not call `$onInit()` on scope', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: (function () {
                        function class_30($scope) {
                            $scope['called'] = 'no';
                            $scope['$onInit'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_30;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: (function () {
                        function class_31($scope) {
                            $scope['called'] = 'no';
                            $scope['$onInit'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$onInit'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_31;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: no | Called: no');
                });
            }));
            it('should call `$postLink()` on controller', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: (function () {
                        function class_32($scope) {
                            this.$scope = $scope;
                            $scope['called'] = 'no';
                        }
                        class_32.prototype.$postLink = function () { this.$scope['called'] = 'yes'; };
                        return class_32;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: (function () {
                        function class_33($scope) {
                            $scope['called'] = 'no';
                            this['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_33;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: yes | Called: yes');
                });
            }));
            it('should not call `$postLink()` on scope', testing_1.async(function () {
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'Called: {{ called }}',
                    bindToController: false,
                    controller: (function () {
                        function class_34($scope) {
                            $scope['called'] = 'no';
                            $scope['$postLink'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_34;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'Called: {{ called }}',
                    bindToController: true,
                    controller: (function () {
                        function class_35($scope) {
                            $scope['called'] = 'no';
                            $scope['$postLink'] = function () { return $scope['called'] = 'yes'; };
                            Object.getPrototypeOf($scope)['$postLink'] = function () { return $scope['called'] = 'yes'; };
                        }
                        return class_35;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Called: no | Called: no');
                });
            }));
            it('should call `$doCheck()` on controller', testing_1.async(function () {
                var controllerDoCheckA = jasmine.createSpy('controllerDoCheckA');
                var controllerDoCheckB = jasmine.createSpy('controllerDoCheckB');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    bindToController: false,
                    controller: (function () {
                        function class_36() {
                        }
                        class_36.prototype.$doCheck = function () { controllerDoCheckA(); };
                        return class_36;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    bindToController: true,
                    controller: (function () {
                        function class_37() {
                            this['$doCheck'] = controllerDoCheckB;
                        }
                        return class_37;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(controllerDoCheckA.calls.count()).toBe(1);
                    expect(controllerDoCheckB.calls.count()).toBe(1);
                    // Run a `$digest`
                    // (Since it's the first one since the `$doCheck` watcher was added,
                    //  the `watchFn` will be run twice.)
                    test_helpers_1.$digest(adapter);
                    expect(controllerDoCheckA.calls.count()).toBe(3);
                    expect(controllerDoCheckB.calls.count()).toBe(3);
                    // Run another `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(controllerDoCheckA.calls.count()).toBe(4);
                    expect(controllerDoCheckB.calls.count()).toBe(4);
                });
            }));
            it('should not call `$doCheck()` on scope', testing_1.async(function () {
                var scopeDoCheck = jasmine.createSpy('scopeDoCheck');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    bindToController: false,
                    controller: (function () {
                        function class_38($scope) {
                            this.$scope = $scope;
                            $scope['$doCheck'] = scopeDoCheck;
                        }
                        return class_38;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    bindToController: true,
                    controller: (function () {
                        function class_39($scope) {
                            this.$scope = $scope;
                            $scope['$doCheck'] = scopeDoCheck;
                        }
                        return class_39;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1A></ng1A> | <ng1B></ng1B>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    // Initial change
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                    // Run a `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                    // Run another `$digest`
                    test_helpers_1.$digest(adapter);
                    expect(scopeDoCheck).not.toHaveBeenCalled();
                });
            }));
            it('should call `$onDestroy()` on controller', testing_1.async(function () {
                var controllerOnDestroyA = jasmine.createSpy('controllerOnDestroyA');
                var controllerOnDestroyB = jasmine.createSpy('controllerOnDestroyB');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    scope: {},
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_40() {
                        }
                        class_40.prototype.$onDestroy = function () { controllerOnDestroyA(); };
                        return class_40;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    scope: {},
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_41() {
                            this['$onDestroy'] = controllerOnDestroyB;
                        }
                        return class_41;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Boolean)
                ], Ng2Component.prototype, "show", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<div *ngIf="show"><ng1A></ng1A> | <ng1B></ng1B></div>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html('<ng2 [show]="!destroyFromNg2" ng-if="!destroyFromNg1"></ng2>');
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var $rootScope = adapter.$injector.get('$rootScope');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(controllerOnDestroyA).not.toHaveBeenCalled();
                    expect(controllerOnDestroyB).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(controllerOnDestroyA).toHaveBeenCalled();
                    expect(controllerOnDestroyB).toHaveBeenCalled();
                    controllerOnDestroyA.calls.reset();
                    controllerOnDestroyB.calls.reset();
                    $rootScope.$apply('destroyFromNg1 = false');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(controllerOnDestroyA).not.toHaveBeenCalled();
                    expect(controllerOnDestroyB).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg2 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(controllerOnDestroyA).toHaveBeenCalled();
                    expect(controllerOnDestroyB).toHaveBeenCalled();
                });
            }));
            it('should not call `$onDestroy()` on scope', testing_1.async(function () {
                var scopeOnDestroy = jasmine.createSpy('scopeOnDestroy');
                // Define `ng1Directive`
                var ng1DirectiveA = {
                    template: 'ng1A',
                    scope: {},
                    bindToController: false,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_42($scope) {
                            $scope['$onDestroy'] = scopeOnDestroy;
                            Object.getPrototypeOf($scope)['$onDestroy'] = scopeOnDestroy;
                        }
                        return class_42;
                    }())
                };
                var ng1DirectiveB = {
                    template: 'ng1B',
                    scope: {},
                    bindToController: true,
                    controllerAs: '$ctrl',
                    controller: (function () {
                        function class_43($scope) {
                            $scope['$onDestroy'] = scopeOnDestroy;
                            Object.getPrototypeOf($scope)['$onDestroy'] = scopeOnDestroy;
                        }
                        return class_43;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentAFacade = (function (_super) {
                    __extends(Ng1ComponentAFacade, _super);
                    function Ng1ComponentAFacade(elementRef, injector) {
                        return _super.call(this, 'ng1A', elementRef, injector) || this;
                    }
                    return Ng1ComponentAFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentAFacade = __decorate([
                    core_1.Directive({ selector: 'ng1A' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentAFacade);
                var Ng1ComponentBFacade = (function (_super) {
                    __extends(Ng1ComponentBFacade, _super);
                    function Ng1ComponentBFacade(elementRef, injector) {
                        return _super.call(this, 'ng1B', elementRef, injector) || this;
                    }
                    return Ng1ComponentBFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentBFacade = __decorate([
                    core_1.Directive({ selector: 'ng1B' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentBFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Boolean)
                ], Ng2Component.prototype, "show", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<div *ngIf="show"><ng1A></ng1A> | <ng1B></ng1B></div>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .directive('ng1A', function () { return ng1DirectiveA; })
                    .directive('ng1B', function () { return ng1DirectiveB; })
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html('<ng2 [show]="!destroyFromNg2" ng-if="!destroyFromNg1"></ng2>');
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var $rootScope = adapter.$injector.get('$rootScope');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg1 = false');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1A | ng1B');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                    $rootScope.$apply('destroyFromNg2 = true');
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(scopeOnDestroy).not.toHaveBeenCalled();
                });
            }));
            it('should be called in order `$onChanges()` > `$onInit()` > `$doCheck()` > `$postLink()`', testing_1.async(function () {
                // Define `ng1Component`
                var ng1Component = {
                    // `$doCheck()` will keep getting called as long as the interpolated value keeps
                    // changing (by appending `> $doCheck`). Only care about the first 4 values.
                    template: '{{ $ctrl.calls.slice(0, 4).join(" > ") }}',
                    bindings: { value: '<' },
                    controller: (function () {
                        function class_44() {
                            this.calls = [];
                        }
                        class_44.prototype.$onChanges = function () { this.calls.push('$onChanges'); };
                        class_44.prototype.$onInit = function () { this.calls.push('$onInit'); };
                        class_44.prototype.$doCheck = function () { this.calls.push('$doCheck'); };
                        class_44.prototype.$postLink = function () { this.calls.push('$postLink'); };
                        return class_44;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Object)
                ], Ng1ComponentFacade.prototype, "value", void 0);
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 value="foo"></ng1>' })
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('$onChanges > $onInit > $doCheck > $postLink');
                });
            }));
        });
        describe('destroying the upgraded component', function () {
            it('should destroy `$componentScope`', testing_1.async(function () {
                var scopeDestroyListener = jasmine.createSpy('scopeDestroyListener');
                var ng2ComponentAInstance;
                // Define `ng1Component`
                var ng1Component = {
                    controller: (function () {
                        function class_45($scope) {
                            $scope.$on('$destroy', scopeDestroyListener);
                        }
                        return class_45;
                    }())
                };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2ComponentA = (function () {
                    function Ng2ComponentA() {
                        this.destroyIt = false;
                        ng2ComponentAInstance = this;
                    }
                    return Ng2ComponentA;
                }());
                Ng2ComponentA = __decorate([
                    core_1.Component({ selector: 'ng2A', template: '<ng2B *ngIf="!destroyIt"></ng2B>' }),
                    __metadata("design:paramtypes", [])
                ], Ng2ComponentA);
                var Ng2ComponentB = (function () {
                    function Ng2ComponentB() {
                    }
                    return Ng2ComponentB;
                }());
                Ng2ComponentB = __decorate([
                    core_1.Component({ selector: 'ng2B', template: '<ng1></ng1>' })
                ], Ng2ComponentB);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                        entryComponents: [Ng2ComponentA],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2-a></ng2-a>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    expect(scopeDestroyListener).not.toHaveBeenCalled();
                    ng2ComponentAInstance.destroyIt = true;
                    test_helpers_1.$digest(adapter);
                    expect(scopeDestroyListener).toHaveBeenCalled();
                });
            }));
            it('should clean up `$doCheck()` watchers from the parent scope', testing_1.async(function () {
                var ng2Component;
                // Define `ng1Component`
                var ng1Component = { template: 'ng1', controller: (function () {
                        function class_46() {
                        }
                        class_46.prototype.$doCheck = function () { };
                        return class_46;
                    }()) };
                // Define `Ng1ComponentFacade`
                var Ng1ComponentFacade = (function (_super) {
                    __extends(Ng1ComponentFacade, _super);
                    function Ng1ComponentFacade(elementRef, injector) {
                        return _super.call(this, 'ng1', elementRef, injector) || this;
                    }
                    return Ng1ComponentFacade;
                }(static_1.UpgradeComponent));
                Ng1ComponentFacade = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1ComponentFacade);
                // Define `Ng2Component`
                var Ng2Component = (function () {
                    function Ng2Component($scope) {
                        this.$scope = $scope;
                        this.doShow = false;
                        ng2Component = this;
                    }
                    return Ng2Component;
                }());
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 *ngIf="doShow"></ng1>' }),
                    __param(0, core_1.Inject(constants_1.$SCOPE)),
                    __metadata("design:paramtypes", [Object])
                ], Ng2Component);
                // Define `ng1Module`
                var ng1Module = angular.module('ng1Module', [])
                    .component('ng1', ng1Component)
                    .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    Ng2Module.prototype.ngDoBootstrap = function () { };
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng1ComponentFacade, Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                    var getWatcherCount = function () {
                        return ng2Component.$scope.$$watchers.length;
                    };
                    var baseWatcherCount = getWatcherCount();
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    ng2Component.doShow = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1');
                    expect(getWatcherCount()).toBe(baseWatcherCount + 1);
                    ng2Component.doShow = false;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('');
                    expect(getWatcherCount()).toBe(baseWatcherCount);
                    ng2Component.doShow = true;
                    test_helpers_1.$digest(adapter);
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng1');
                    expect(getWatcherCount()).toBe(baseWatcherCount + 1);
                });
            }));
        });
        it('should support ng2 > ng1 > ng2 (no inputs/outputs)', testing_1.async(function () {
            // Define `ng1Component`
            var ng1Component = { template: 'ng1X(<ng2-b></ng2-b>)' };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentFacade = (function (_super) {
                __extends(Ng1ComponentFacade, _super);
                function Ng1ComponentFacade(elementRef, injector) {
                    return _super.call(this, 'ng1X', elementRef, injector) || this;
                }
                return Ng1ComponentFacade;
            }(static_1.UpgradeComponent));
            Ng1ComponentFacade = __decorate([
                core_1.Directive({ selector: 'ng1X' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1ComponentFacade);
            // Define `Ng2Component`
            var Ng2ComponentA = (function () {
                function Ng2ComponentA() {
                }
                return Ng2ComponentA;
            }());
            Ng2ComponentA = __decorate([
                core_1.Component({ selector: 'ng2-a', template: 'ng2A(<ng1X></ng1X>)' })
            ], Ng2ComponentA);
            var Ng2ComponentB = (function () {
                function Ng2ComponentB() {
                }
                return Ng2ComponentB;
            }());
            Ng2ComponentB = __decorate([
                core_1.Component({ selector: 'ng2-b', template: 'ng2B' })
            ], Ng2ComponentB);
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1X', ng1Component)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1ComponentFacade, Ng2ComponentA, Ng2ComponentB],
                    entryComponents: [Ng2ComponentA, Ng2ComponentB],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                })
            ], Ng2Module);
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('ng2A(ng1X(ng2B))');
            });
        }));
        it('should support ng2 > ng1 > ng2 (with inputs/outputs)', testing_1.fakeAsync(function () {
            var ng2ComponentAInstance;
            var ng2ComponentBInstance;
            var ng1ControllerXInstance;
            // Define `ng1Component`
            var Ng1ControllerX = (function () {
                function Ng1ControllerX() {
                    ng1ControllerXInstance = this;
                }
                return Ng1ControllerX;
            }());
            var ng1Component = {
                template: "\n              ng1X({{ $ctrl.ng1XInputA }}, {{ $ctrl.ng1XInputB.value }}, {{ $ctrl.ng1XInputC.value }}) |\n              <ng2-b\n                [ng2-b-input1]=\"$ctrl.ng1XInputA\"\n                [ng2-b-input-c]=\"$ctrl.ng1XInputC.value\"\n                (ng2-b-output-c)=\"$ctrl.ng1XInputC = {value: $event}\">\n              </ng2-b>\n            ",
                bindings: {
                    ng1XInputA: '@',
                    ng1XInputB: '<',
                    ng1XInputC: '=',
                    ng1XOutputA: '&',
                    ng1XOutputB: '&'
                },
                controller: Ng1ControllerX
            };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentXFacade = (function (_super) {
                __extends(Ng1ComponentXFacade, _super);
                function Ng1ComponentXFacade(elementRef, injector) {
                    return _super.call(this, 'ng1X', elementRef, injector) || this;
                }
                return Ng1ComponentXFacade;
            }(static_1.UpgradeComponent));
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], Ng1ComponentXFacade.prototype, "ng1XInputA", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng1ComponentXFacade.prototype, "ng1XInputB", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng1ComponentXFacade.prototype, "ng1XInputC", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], Ng1ComponentXFacade.prototype, "ng1XInputCChange", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], Ng1ComponentXFacade.prototype, "ng1XOutputA", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], Ng1ComponentXFacade.prototype, "ng1XOutputB", void 0);
            Ng1ComponentXFacade = __decorate([
                core_1.Directive({ selector: 'ng1X' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1ComponentXFacade);
            // Define `Ng2Component`
            var Ng2ComponentA = (function () {
                function Ng2ComponentA() {
                    this.ng2ADataA = { value: 'foo' };
                    this.ng2ADataB = { value: 'bar' };
                    this.ng2ADataC = { value: 'baz' };
                    ng2ComponentAInstance = this;
                }
                return Ng2ComponentA;
            }());
            Ng2ComponentA = __decorate([
                core_1.Component({
                    selector: 'ng2-a',
                    template: "\n              ng2A({{ ng2ADataA.value }}, {{ ng2ADataB.value }}, {{ ng2ADataC.value }}) |\n              <ng1X\n                  ng1XInputA=\"{{ ng2ADataA.value }}\"\n                  bind-ng1XInputB=\"ng2ADataB\"\n                  [(ng1XInputC)]=\"ng2ADataC\"\n                  (ng1XOutputA)=\"ng2ADataA = $event\"\n                  on-ng1XOutputB=\"ng2ADataB.value = $event\">\n              </ng1X>\n            "
                }),
                __metadata("design:paramtypes", [])
            ], Ng2ComponentA);
            var Ng2ComponentB = (function () {
                function Ng2ComponentB() {
                    this.ng2BOutputC = new core_1.EventEmitter();
                    ng2ComponentBInstance = this;
                }
                return Ng2ComponentB;
            }());
            __decorate([
                core_1.Input('ng2BInput1'),
                __metadata("design:type", Object)
            ], Ng2ComponentB.prototype, "ng2BInputA", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng2ComponentB.prototype, "ng2BInputC", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", Object)
            ], Ng2ComponentB.prototype, "ng2BOutputC", void 0);
            Ng2ComponentB = __decorate([
                core_1.Component({ selector: 'ng2-b', template: 'ng2B({{ ng2BInputA }}, {{ ng2BInputC }})' }),
                __metadata("design:paramtypes", [])
            ], Ng2ComponentB);
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1X', ng1Component)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1ComponentXFacade, Ng2ComponentA, Ng2ComponentB],
                    entryComponents: [Ng2ComponentA, Ng2ComponentB],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                })
            ], Ng2Module);
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (adapter) {
                // Initial value propagation.
                // (ng2A > ng1X > ng2B)
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz) | ng1X(foo, bar, baz) | ng2B(foo, baz)');
                // Update `ng2BInputA`/`ng2BInputC`.
                // (Should not propagate upwards.)
                ng2ComponentBInstance.ng2BInputA = 'foo2';
                ng2ComponentBInstance.ng2BInputC = 'baz2';
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz) | ng1X(foo, bar, baz) | ng2B(foo2, baz2)');
                // Emit from `ng2BOutputC`.
                // (Should propagate all the way up to `ng1ADataC` and back all the way down to
                // `ng2BInputC`.)
                ng2ComponentBInstance.ng2BOutputC.emit('baz3');
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz3) | ng1X(foo, bar, baz3) | ng2B(foo2, baz3)');
                // Update `ng1XInputA`/`ng1XInputB`.
                // (Should not propagate upwards, only downwards.)
                ng1ControllerXInstance.ng1XInputA = 'foo4';
                ng1ControllerXInstance.ng1XInputB = { value: 'bar4' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz3) | ng1X(foo4, bar4, baz3) | ng2B(foo4, baz3)');
                // Update `ng1XInputC`.
                // (Should propagate upwards and downwards.)
                ng1ControllerXInstance.ng1XInputC = { value: 'baz5' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz5) | ng1X(foo4, bar4, baz5) | ng2B(foo4, baz5)');
                // Update a property on `ng1XInputC`.
                // (Should propagate upwards and downwards.)
                ng1ControllerXInstance.ng1XInputC.value = 'baz6';
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo, bar, baz6) | ng1X(foo4, bar4, baz6) | ng2B(foo4, baz6)');
                // Emit from `ng1XOutputA`.
                // (Should propagate upwards to `ng1ADataA` and back all the way down to `ng2BInputA`.)
                ng1ControllerXInstance.ng1XOutputA({ value: 'foo7' });
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo7, bar, baz6) | ng1X(foo7, bar4, baz6) | ng2B(foo7, baz6)');
                // Emit from `ng1XOutputB`.
                // (Should propagate upwards to `ng1ADataB`, but not downwards,
                //  since `ng1XInputB` has been re-assigned (i.e. `ng2ADataB !== ng1XInputB`).)
                ng1ControllerXInstance.ng1XOutputB('bar8');
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo7, bar8, baz6) | ng1X(foo7, bar4, baz6) | ng2B(foo7, baz6)');
                // Update `ng2ADataA`/`ng2ADataB`/`ng2ADataC`.
                // (Should propagate everywhere.)
                ng2ComponentAInstance.ng2ADataA = { value: 'foo9' };
                ng2ComponentAInstance.ng2ADataB = { value: 'bar9' };
                ng2ComponentAInstance.ng2ADataC = { value: 'baz9' };
                test_helpers_1.$digest(adapter);
                testing_1.tick();
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(foo9, bar9, baz9) | ng1X(foo9, bar9, baz9) | ng2B(foo9, baz9)');
            });
        }));
        it('should support ng2 > ng1 > ng2 > ng1 (with `require`)', testing_1.async(function () {
            // Define `ng1Component`
            var ng1ComponentA = {
                template: 'ng1A(<ng2-b></ng2-b>)',
                controller: (function () {
                    function class_47() {
                        this.value = 'ng1A';
                    }
                    return class_47;
                }())
            };
            var ng1ComponentB = {
                template: 'ng1B(^^ng1A: {{ $ctrl.ng1A.value }} | ?^^ng1B: {{ $ctrl.ng1B.value }} | ^ng1B: {{ $ctrl.ng1BSelf.value }})',
                require: { ng1A: '^^', ng1B: '?^^', ng1BSelf: '^ng1B' },
                controller: (function () {
                    function class_48() {
                        this.value = 'ng1B';
                    }
                    return class_48;
                }())
            };
            // Define `Ng1ComponentFacade`
            var Ng1ComponentAFacade = (function (_super) {
                __extends(Ng1ComponentAFacade, _super);
                function Ng1ComponentAFacade(elementRef, injector) {
                    return _super.call(this, 'ng1A', elementRef, injector) || this;
                }
                return Ng1ComponentAFacade;
            }(static_1.UpgradeComponent));
            Ng1ComponentAFacade = __decorate([
                core_1.Directive({ selector: 'ng1A' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1ComponentAFacade);
            var Ng1ComponentBFacade = (function (_super) {
                __extends(Ng1ComponentBFacade, _super);
                function Ng1ComponentBFacade(elementRef, injector) {
                    return _super.call(this, 'ng1B', elementRef, injector) || this;
                }
                return Ng1ComponentBFacade;
            }(static_1.UpgradeComponent));
            Ng1ComponentBFacade = __decorate([
                core_1.Directive({ selector: 'ng1B' }),
                __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
            ], Ng1ComponentBFacade);
            // Define `Ng2Component`
            var Ng2ComponentA = (function () {
                function Ng2ComponentA() {
                }
                return Ng2ComponentA;
            }());
            Ng2ComponentA = __decorate([
                core_1.Component({ selector: 'ng2-a', template: 'ng2A(<ng1A></ng1A>)' })
            ], Ng2ComponentA);
            var Ng2ComponentB = (function () {
                function Ng2ComponentB() {
                }
                return Ng2ComponentB;
            }());
            Ng2ComponentB = __decorate([
                core_1.Component({ selector: 'ng2-b', template: 'ng2B(<ng1B></ng1B>)' })
            ], Ng2ComponentB);
            // Define `ng1Module`
            var ng1Module = angular.module('ng1', [])
                .component('ng1A', ng1ComponentA)
                .component('ng1B', ng1ComponentB)
                .directive('ng2A', static_1.downgradeComponent({ component: Ng2ComponentA }))
                .directive('ng2B', static_1.downgradeComponent({ component: Ng2ComponentB }));
            // Define `Ng2Module`
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [Ng1ComponentAFacade, Ng1ComponentBFacade, Ng2ComponentA, Ng2ComponentB],
                    entryComponents: [Ng2ComponentA, Ng2ComponentB],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                })
            ], Ng2Module);
            // Bootstrap
            var element = test_helpers_1.html("<ng2-a></ng2-a>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function () {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2A(ng1A(ng2B(ng1B(^^ng1A: ng1A | ?^^ng1B: | ^ng1B: ng1B))))');
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9jb21wb25lbnRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9zdGF0aWMvaW50ZWdyYXRpb24vdXBncmFkZV9jb21wb25lbnRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0w7QUFDeEwsaURBQTZEO0FBQzdELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsOERBQWdFO0FBQ2hFLG1FQUE2RDtBQUM3RCxrREFBNEY7QUFFNUYsZ0RBQW9FO0FBRXBFO0lBQ0UsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBRWhDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUVuQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLGVBQUssQ0FBQztnQkFDMUMsd0JBQXdCO2dCQUN4QixJQUFNLFlBQVksR0FBdUIsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztnQkFFdkUsOEJBQThCO2dCQUU5QixJQUFNLGtCQUFrQjtvQkFBUyxzQ0FBZ0I7b0JBQy9DLDRCQUFZLFVBQXNCLEVBQUUsUUFBa0I7K0JBQ3BELGtCQUFNLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO29CQUNwQyxDQUFDO29CQUNILHlCQUFDO2dCQUFELENBQUMsQUFKRCxDQUFpQyx5QkFBZ0IsR0FJaEQ7Z0JBSkssa0JBQWtCO29CQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO3FEQUVILGlCQUFVLEVBQVksZUFBUTttQkFEbEQsa0JBQWtCLENBSXZCO2dC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