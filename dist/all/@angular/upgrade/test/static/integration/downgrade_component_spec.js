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
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var angular = require("@angular/upgrade/src/common/angular1");
var static_1 = require("@angular/upgrade/static");
var test_helpers_1 = require("../test_helpers");
function main() {
    describe('downgrade ng2 component', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should bind properties, events', testing_1.async(function () {
            var ng1Module = angular.module('ng1', []).value('$exceptionHandler', function (err) {
                throw err;
            }).run(function ($rootScope) {
                $rootScope['name'] = 'world';
                $rootScope['dataA'] = 'A';
                $rootScope['dataB'] = 'B';
                $rootScope['modelA'] = 'initModelA';
                $rootScope['modelB'] = 'initModelB';
                $rootScope['eventA'] = '?';
                $rootScope['eventB'] = '?';
            });
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.ngOnChangesCount = 0;
                    this.ignore = '-';
                    this.literal = '?';
                    this.interpolate = '?';
                    this.oneWayA = '?';
                    this.oneWayB = '?';
                    this.twoWayA = '?';
                    this.twoWayB = '?';
                    this.eventA = new core_1.EventEmitter();
                    this.eventB = new core_1.EventEmitter();
                    this.twoWayAEmitter = new core_1.EventEmitter();
                    this.twoWayBEmitter = new core_1.EventEmitter();
                }
                Ng2Component.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    var assert = function (prop, value) {
                        var propVal = _this[prop];
                        if (propVal != value) {
                            throw new Error("Expected: '" + prop + "' to be '" + value + "' but was '" + propVal + "'");
                        }
                    };
                    var assertChange = function (prop, value) {
                        assert(prop, value);
                        if (!changes[prop]) {
                            throw new Error("Changes record for '" + prop + "' not found.");
                        }
                        var actualValue = changes[prop].currentValue;
                        if (actualValue != value) {
                            throw new Error("Expected changes record for'" + prop + "' to be '" + value + "' but was '" + actualValue + "'");
                        }
                    };
                    switch (this.ngOnChangesCount++) {
                        case 0:
                            assert('ignore', '-');
                            assertChange('literal', 'Text');
                            assertChange('interpolate', 'Hello world');
                            assertChange('oneWayA', 'A');
                            assertChange('oneWayB', 'B');
                            assertChange('twoWayA', 'initModelA');
                            assertChange('twoWayB', 'initModelB');
                            this.twoWayAEmitter.emit('newA');
                            this.twoWayBEmitter.emit('newB');
                            this.eventA.emit('aFired');
                            this.eventB.emit('bFired');
                            break;
                        case 1:
                            assertChange('twoWayA', 'newA');
                            assertChange('twoWayB', 'newB');
                            break;
                        case 2:
                            assertChange('interpolate', 'Hello everyone');
                            break;
                        default:
                            throw new Error('Called too many times! ' + JSON.stringify(changes));
                    }
                };
                ;
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    inputs: ['literal', 'interpolate', 'oneWayA', 'oneWayB', 'twoWayA', 'twoWayB'],
                    outputs: [
                        'eventA', 'eventB', 'twoWayAEmitter: twoWayAChange', 'twoWayBEmitter: twoWayBChange'
                    ],
                    template: 'ignore: {{ignore}}; ' +
                        'literal: {{literal}}; interpolate: {{interpolate}}; ' +
                        'oneWayA: {{oneWayA}}; oneWayB: {{oneWayB}}; ' +
                        'twoWayA: {{twoWayA}}; twoWayB: {{twoWayB}}; ({{ngOnChangesCount}})'
                })
            ], Ng2Component);
            ng1Module.directive('ng2', static_1.downgradeComponent({
                component: Ng2Component,
            }));
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var element = test_helpers_1.html("\n           <div>\n             <ng2 literal=\"Text\" interpolate=\"Hello {{name}}\"\n                 bind-one-way-a=\"dataA\" [one-way-b]=\"dataB\"\n                 bindon-two-way-a=\"modelA\" [(two-way-b)]=\"modelB\"\n                 on-event-a='eventA=$event' (event-b)=\"eventB=$event\"></ng2>\n             | modelA: {{modelA}}; modelB: {{modelB}}; eventA: {{eventA}}; eventB: {{eventB}};\n           </div>");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toEqual('ignore: -; ' +
                    'literal: Text; interpolate: Hello world; ' +
                    'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (2) | ' +
                    'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                test_helpers_1.$apply(upgrade, 'name = "everyone"');
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toEqual('ignore: -; ' +
                    'literal: Text; interpolate: Hello everyone; ' +
                    'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (3) | ' +
                    'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
            });
        }));
        it('should run change-detection on every digest (by default)', testing_1.async(function () {
            var ng2Component;
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.value1 = -1;
                    this.value2 = -1;
                    ng2Component = this;
                }
                return Ng2Component;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng2Component.prototype, "value1", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng2Component.prototype, "value2", void 0);
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: '{{ value1 }} | {{ value2 }}' }),
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope.value1 = 0;
                $rootScope.value2 = 0;
            });
            var element = test_helpers_1.html('<ng2 [value1]="value1" value2="{{ value2 }}"></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var $rootScope = upgrade.$injector.get('$rootScope');
                expect(element.textContent).toBe('0 | 0');
                // Digest should invoke CD
                $rootScope.$digest();
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Internal changes should be detected on digest
                ng2Component.value1 = 1;
                ng2Component.value2 = 2;
                $rootScope.$digest();
                expect(element.textContent).toBe('1 | 2');
                // Digest should propagate change in prop-bound input
                $rootScope.$apply('value1 = 3');
                expect(element.textContent).toBe('3 | 2');
                // Digest should propagate change in attr-bound input
                ng2Component.value1 = 4;
                $rootScope.$apply('value2 = 5');
                expect(element.textContent).toBe('4 | 5');
                // Digest should propagate changes that happened before the digest
                $rootScope.value1 = 6;
                expect(element.textContent).toBe('4 | 5');
                $rootScope.$digest();
                expect(element.textContent).toBe('6 | 5');
            });
        }));
        it('should not run change-detection on every digest when opted out', testing_1.async(function () {
            var ng2Component;
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.value1 = -1;
                    this.value2 = -1;
                    ng2Component = this;
                }
                return Ng2Component;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng2Component.prototype, "value1", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], Ng2Component.prototype, "value2", void 0);
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: '{{ value1 }} | {{ value2 }}' }),
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component, propagateDigest: false }))
                .run(function ($rootScope) {
                $rootScope.value1 = 0;
                $rootScope.value2 = 0;
            });
            var element = test_helpers_1.html('<ng2 [value1]="value1" value2="{{ value2 }}"></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var $rootScope = upgrade.$injector.get('$rootScope');
                expect(element.textContent).toBe('0 | 0');
                // Digest should not invoke CD
                $rootScope.$digest();
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Digest should not invoke CD, even if component values have changed (internally)
                ng2Component.value1 = 1;
                ng2Component.value2 = 2;
                $rootScope.$digest();
                expect(element.textContent).toBe('0 | 0');
                // Digest should invoke CD, if prop-bound input has changed
                $rootScope.$apply('value1 = 3');
                expect(element.textContent).toBe('3 | 2');
                // Digest should invoke CD, if attr-bound input has changed
                ng2Component.value1 = 4;
                $rootScope.$apply('value2 = 5');
                expect(element.textContent).toBe('4 | 5');
                // Digest should invoke CD, if input has changed before the digest
                $rootScope.value1 = 6;
                $rootScope.$digest();
                expect(element.textContent).toBe('6 | 5');
            });
        }));
        it('should initialize inputs in time for `ngOnChanges`', testing_1.async(function () {
            var Ng2Component = (function () {
                function Ng2Component() {
                    this.ngOnChangesCount = 0;
                    this.firstChangesCount = 0;
                }
                Ng2Component.prototype.ngOnChanges = function (changes) {
                    this.ngOnChangesCount++;
                    if (this.ngOnChangesCount === 1) {
                        this.initialValue = this.foo;
                    }
                    if (changes['foo'] && changes['foo'].isFirstChange()) {
                        this.firstChangesCount++;
                    }
                };
                return Ng2Component;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], Ng2Component.prototype, "foo", void 0);
            Ng2Component = __decorate([
                core_1.Component({
                    selector: 'ng2',
                    template: "\n             ngOnChangesCount: {{ ngOnChangesCount }} |\n             firstChangesCount: {{ firstChangesCount }} |\n             initialValue: {{ initialValue }}"
                })
            ], Ng2Component);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                    declarations: [Ng2Component],
                    entryComponents: [Ng2Component]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html("\n           <ng2 [foo]=\"'foo'\"></ng2>\n           <ng2 foo=\"bar\"></ng2>\n           <ng2 [foo]=\"'baz'\" ng-if=\"true\"></ng2>\n           <ng2 foo=\"qux\" ng-if=\"true\"></ng2>\n         ");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var nodes = element.querySelectorAll('ng2');
                var expectedTextWith = function (value) {
                    return "ngOnChangesCount: 1 | firstChangesCount: 1 | initialValue: " + value;
                };
                expect(test_helpers_1.multiTrim(nodes[0].textContent)).toBe(expectedTextWith('foo'));
                expect(test_helpers_1.multiTrim(nodes[1].textContent)).toBe(expectedTextWith('bar'));
                expect(test_helpers_1.multiTrim(nodes[2].textContent)).toBe(expectedTextWith('baz'));
                expect(test_helpers_1.multiTrim(nodes[3].textContent)).toBe(expectedTextWith('qux'));
            });
        }));
        it('should bind to ng-model', testing_1.async(function () {
            var ng1Module = angular.module('ng1', []).run(function ($rootScope) { $rootScope['modelA'] = 'A'; });
            var ng2Instance;
            var Ng2 = (function () {
                function Ng2() {
                    this._value = '';
                    this._onChangeCallback = function () { };
                    this._onTouchedCallback = function () { };
                    ng2Instance = this;
                }
                Ng2.prototype.writeValue = function (value) { this._value = value; };
                Ng2.prototype.registerOnChange = function (fn) { this._onChangeCallback = fn; };
                Ng2.prototype.registerOnTouched = function (fn) { this._onTouchedCallback = fn; };
                Ng2.prototype.doTouch = function () { this._onTouchedCallback(); };
                Ng2.prototype.doChange = function (newValue) {
                    this._value = newValue;
                    this._onChangeCallback(newValue);
                };
                return Ng2;
            }());
            Ng2 = __decorate([
                core_1.Component({ selector: 'ng2', template: '<span>{{_value}}</span>' }),
                __metadata("design:paramtypes", [])
            ], Ng2);
            ng1Module.directive('ng2', static_1.downgradeComponent({ component: Ng2 }));
            var element = test_helpers_1.html("<div><ng2 ng-model=\"modelA\"></ng2> | {{modelA}}</div>");
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({ declarations: [Ng2], entryComponents: [Ng2], imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
            ], Ng2Module);
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2Module).then(function (ref) {
                var adapter = ref.injector.get(static_1.UpgradeModule);
                adapter.bootstrap(element, [ng1Module.name]);
                var $rootScope = adapter.$injector.get('$rootScope');
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('A | A');
                $rootScope.modelA = 'B';
                $rootScope.$apply();
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('B | B');
                ng2Instance.doChange('C');
                expect($rootScope.modelA).toBe('C');
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('C | C');
                var downgradedElement = document.body.querySelector('ng2');
                expect(downgradedElement.classList.contains('ng-touched')).toBe(false);
                ng2Instance.doTouch();
                $rootScope.$apply();
                expect(downgradedElement.classList.contains('ng-touched')).toBe(true);
            });
        }));
        it('should properly run cleanup when ng1 directive is destroyed', testing_1.async(function () {
            var destroyed = false;
            var Ng2Component = (function () {
                function Ng2Component() {
                }
                Ng2Component.prototype.ngOnDestroy = function () { destroyed = true; };
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: 'test' })
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', function () { return { template: '<div ng-if="!destroyIt"><ng2></ng2></div>' }; })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng1></ng1>');
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2Module).then(function (ref) {
                var adapter = ref.injector.get(static_1.UpgradeModule);
                adapter.bootstrap(element, [ng1Module.name]);
                expect(element.textContent).toContain('test');
                expect(destroyed).toBe(false);
                var $rootScope = adapter.$injector.get('$rootScope');
                $rootScope.$apply('destroyIt = true');
                expect(element.textContent).not.toContain('test');
                expect(destroyed).toBe(true);
            });
        }));
        it('should work when compiled outside the dom (by fallback to the root ng2.injector)', testing_1.async(function () {
            var Ng2Component = (function () {
                function Ng2Component() {
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: 'test' })
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', [
                '$compile',
                function ($compile) {
                    return {
                        link: function ($scope, $element, $attrs) {
                            // here we compile some HTML that contains a downgraded component
                            // since it is not currently in the DOM it is not able to "require"
                            // an ng2 injector so it should use the `moduleInjector` instead.
                            var compiled = $compile('<ng2></ng2>');
                            var template = compiled($scope);
                            $element.append(template);
                        }
                    };
                }
            ])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng1></ng1>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                // the fact that the body contains the correct text means that the
                // downgraded component was able to access the moduleInjector
                // (since there is no other injector in this system)
                expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('test');
            });
        }));
        it('should allow attribute selectors for downgraded components', testing_1.async(function () {
            var WorksComponent = (function () {
                function WorksComponent() {
                }
                return WorksComponent;
            }());
            WorksComponent = __decorate([
                core_1.Component({ selector: '[itWorks]', template: 'It works' })
            ], WorksComponent);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [WorksComponent],
                    entryComponents: [WorksComponent],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', []).directive('worksComponent', static_1.downgradeComponent({ component: WorksComponent }));
            var element = test_helpers_1.html('<works-component></works-component>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works');
            });
        }));
        it('should allow attribute selectors for components in ng2', testing_1.async(function () {
            var WorksComponent = (function () {
                function WorksComponent() {
                }
                return WorksComponent;
            }());
            WorksComponent = __decorate([
                core_1.Component({ selector: '[itWorks]', template: 'It works' })
            ], WorksComponent);
            var RootComponent = (function () {
                function RootComponent() {
                }
                return RootComponent;
            }());
            RootComponent = __decorate([
                core_1.Component({ selector: 'root-component', template: '<span itWorks></span>!' })
            ], RootComponent);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [RootComponent, WorksComponent],
                    entryComponents: [RootComponent],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', []).directive('rootComponent', static_1.downgradeComponent({ component: RootComponent }));
            var element = test_helpers_1.html('<root-component></root-component>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works!');
            });
        }));
        it('should respect hierarchical dependency injection for ng2', testing_1.async(function () {
            var ParentComponent = (function () {
                function ParentComponent() {
                }
                return ParentComponent;
            }());
            ParentComponent = __decorate([
                core_1.Component({ selector: 'parent', template: 'parent(<ng-content></ng-content>)' })
            ], ParentComponent);
            var ChildComponent = (function () {
                function ChildComponent(parent) {
                }
                return ChildComponent;
            }());
            ChildComponent = __decorate([
                core_1.Component({ selector: 'child', template: 'child' }),
                __metadata("design:paramtypes", [ParentComponent])
            ], ChildComponent);
            var Ng2Module = (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                return Ng2Module;
            }());
            Ng2Module = __decorate([
                core_1.NgModule({
                    declarations: [ParentComponent, ChildComponent],
                    entryComponents: [ParentComponent, ChildComponent],
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                })
            ], Ng2Module);
            var ng1Module = angular.module('ng1', [])
                .directive('parent', static_1.downgradeComponent({ component: ParentComponent }))
                .directive('child', static_1.downgradeComponent({ component: ChildComponent }));
            var element = test_helpers_1.html('<parent><child></child></parent>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('parent(child)');
            });
        }));
        it('should work with ng2 lazy loaded components', testing_1.async(function () {
            var componentInjector;
            var Ng2Component = (function () {
                function Ng2Component(injector) {
                    componentInjector = injector;
                }
                return Ng2Component;
            }());
            Ng2Component = __decorate([
                core_1.Component({ selector: 'ng2', template: '' }),
                __metadata("design:paramtypes", [core_1.Injector])
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
                    imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                })
            ], Ng2Module);
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent(module) {
                    this.module = module;
                }
                ;
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ template: '' }),
                __metadata("design:paramtypes", [core_1.NgModuleRef])
            ], LazyLoadedComponent);
            var LazyLoadedModule = (function () {
                function LazyLoadedModule() {
                }
                return LazyLoadedModule;
            }());
            LazyLoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    entryComponents: [LazyLoadedComponent],
                })
            ], LazyLoadedModule);
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            var element = test_helpers_1.html('<ng2></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var modInjector = upgrade.injector;
                // Emulate the router lazy loading a module and creating a component
                var compiler = modInjector.get(core_1.Compiler);
                var modFactory = compiler.compileModuleSync(LazyLoadedModule);
                var childMod = modFactory.create(modInjector);
                var cmpFactory = childMod.componentFactoryResolver.resolveComponentFactory(LazyLoadedComponent);
                var lazyCmp = cmpFactory.create(componentInjector);
                expect(lazyCmp.instance.module).toBe(childMod.injector);
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9kb3duZ3JhZGVfY29tcG9uZW50X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMk07QUFDM00saURBQTRDO0FBQzVDLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsOERBQWdFO0FBQ2hFLGtEQUEwRTtBQUUxRSxnREFBbUU7QUFFbkU7SUFDRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFFbEMsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBRW5DLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxlQUFLLENBQUM7WUFDdEMsSUFBTSxTQUFTLEdBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLFVBQUMsR0FBUTtnQkFDbkMsTUFBTSxHQUFHLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxVQUEwQjtnQkFDekQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDN0IsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFlBQVksQ0FBQztnQkFDcEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFlBQVksQ0FBQztnQkFDcEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFH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