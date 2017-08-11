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
var upgrade_adapter_1 = require("@angular/upgrade/src/dynamic/upgrade_adapter");
var test_helpers_1 = require("./test_helpers");
function main() {
    describe('adapter: ng1 to ng2', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        describe('(basic use)', function () {
            it('should have AngularJS loaded', function () { return expect(angular.version.major).toBe(1); });
            it('should instantiate ng2 in ng1 template and project content', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "{{ 'NG2' }}(<ng-content></ng-content>)",
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ \'ng-content\' }}~</ng2>{{ \']\' }}</div>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng1[NG2(~ng-content~)]');
                    ref.dispose();
                });
            }));
            it('should instantiate ng1 in ng2 template and project content', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "{{ 'ng2(' }}<ng1>{{'transclude'}}</ng1>{{ ')' }}",
                    })
                ], Ng2);
                ;
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng1', function () {
                    return { transclude: true, template: '{{ "ng1" }}(<ng-transclude></ng-transclude>)' };
                });
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<div>{{\'ng1(\'}}<ng2></ng2>{{\')\'}}</div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng1(ng2(ng1(transclude)))');
                    ref.dispose();
                });
            }));
            it('supports the compilerOptions argument', testing_1.async(function () {
                var platformRef = platform_browser_dynamic_1.platformBrowserDynamic();
                spyOn(platformRef, '_bootstrapModuleWithZone').and.callThrough();
                var ng1Module = angular.module('ng1', []);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: "{{ 'NG2' }}(<ng-content></ng-content>)" })
                ], Ng2);
                var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ \'ng-content\' }}~</ng2>{{ \']\' }}</div>');
                var Ng2AppModule = (function () {
                    function Ng2AppModule() {
                    }
                    Ng2AppModule.prototype.ngDoBootstrap = function () { };
                    return Ng2AppModule;
                }());
                Ng2AppModule = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2AppModule);
                ;
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2AppModule, { providers: [] });
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(platformRef._bootstrapModuleWithZone)
                        .toHaveBeenCalledWith(jasmine.any(Function), { providers: [] }, jasmine.any(Object));
                    ref.dispose();
                });
            }));
        });
        describe('bootstrap errors', function () {
            var adapter;
            beforeEach(function () {
                angular.module('ng1', []);
                var ng2Component = (function () {
                    function ng2Component() {
                    }
                    return ng2Component;
                }());
                ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "<BAD TEMPLATE div></div>",
                    })
                ], ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [ng2Component],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
            });
            it('should throw an uncaught error', testing_1.fakeAsync(function () {
                var resolveSpy = jasmine.createSpy('resolveSpy');
                spyOn(console, 'error');
                expect(function () {
                    adapter.bootstrap(test_helpers_1.html('<ng2></ng2>'), ['ng1']).ready(resolveSpy);
                    testing_1.flushMicrotasks();
                }).toThrowError();
                expect(resolveSpy).not.toHaveBeenCalled();
            }));
            it('should output an error message to the console and re-throw', testing_1.fakeAsync(function () {
                var consoleErrorSpy = spyOn(console, 'error');
                expect(function () {
                    adapter.bootstrap(test_helpers_1.html('<ng2></ng2>'), ['ng1']);
                    testing_1.flushMicrotasks();
                }).toThrowError();
                var args = consoleErrorSpy.calls.mostRecent().args;
                expect(consoleErrorSpy).toHaveBeenCalled();
                expect(args.length).toBeGreaterThan(0);
                expect(args[0]).toEqual(jasmine.any(Error));
            }));
        });
        describe('scope/component change-detection', function () {
            it('should interleave scope and component expressions', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var log = [];
                var l = function (value) {
                    log.push(value);
                    return value + ';';
                };
                ng1Module.directive('ng1a', function () { return ({ template: '{{ l(\'ng1a\') }}' }); });
                ng1Module.directive('ng1b', function () { return ({ template: '{{ l(\'ng1b\') }}' }); });
                ng1Module.run(function ($rootScope) {
                    $rootScope.l = l;
                    $rootScope.reset = function () { return log.length = 0; };
                });
                var Ng2 = (function () {
                    function Ng2() {
                        this.l = l;
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "{{l('2A')}}<ng1a></ng1a>{{l('2B')}}<ng1b></ng1b>{{l('2C')}}"
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1a'), adapter.upgradeNg1Component('ng1b'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<div>{{reset(); l(\'1A\');}}<ng2>{{l(\'1B\')}}</ng2>{{l(\'1C\')}}</div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('1A;2A;ng1a;2B;ng1b;2C;1C;');
                    // https://github.com/angular/angular.js/issues/12983
                    expect(log).toEqual(['1A', '1C', '2A', '2B', '2C', 'ng1a', 'ng1b']);
                    ref.dispose();
                });
            }));
            it('should propagate changes to a downgraded component inside the ngZone', testing_1.async(function () {
                var appComponent;
                var upgradeRef;
                var AppComponent = (function () {
                    function AppComponent() {
                        appComponent = this;
                    }
                    return AppComponent;
                }());
                AppComponent = __decorate([
                    core_1.Component({ selector: 'my-app', template: '<my-child [value]="value"></my-child>' }),
                    __metadata("design:paramtypes", [])
                ], AppComponent);
                var ChildComponent = (function () {
                    function ChildComponent(zone) {
                        this.zone = zone;
                    }
                    Object.defineProperty(ChildComponent.prototype, "value", {
                        set: function (v) { expect(core_1.NgZone.isInAngularZone()).toBe(true); },
                        enumerable: true,
                        configurable: true
                    });
                    ChildComponent.prototype.ngOnChanges = function (changes) {
                        var _this = this;
                        if (changes['value'].isFirstChange())
                            return;
                        this.zone.onMicrotaskEmpty.subscribe(function () {
                            expect(element.textContent).toEqual('5');
                            upgradeRef.dispose();
                        });
                        Promise.resolve().then(function () { return _this.valueFromPromise = changes['value'].currentValue; });
                    };
                    return ChildComponent;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Number),
                    __metadata("design:paramtypes", [Number])
                ], ChildComponent.prototype, "value", null);
                ChildComponent = __decorate([
                    core_1.Component({
                        selector: 'my-child',
                        template: '<div>{{valueFromPromise}}',
                    }),
                    __metadata("design:paramtypes", [core_1.NgZone])
                ], ChildComponent);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [AppComponent, ChildComponent], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []).directive('myApp', adapter.downgradeNg2Component(AppComponent));
                var element = test_helpers_1.html('<my-app></my-app>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    upgradeRef = ref;
                    appComponent.value = 5;
                });
            }));
            // This test demonstrates https://github.com/angular/angular/issues/6385
            // which was invalidly fixed by https://github.com/angular/angular/pull/6386
            // it('should not trigger $digest from an async operation in a watcher', async(() => {
            //      @Component({selector: 'my-app', template: ''})
            //      class AppComponent {
            //      }
            //      @NgModule({declarations: [AppComponent], imports: [BrowserModule]})
            //      class Ng2Module {
            //      }
            //      const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));
            //      const ng1Module = angular.module('ng1', []).directive(
            //          'myApp', adapter.downgradeNg2Component(AppComponent));
            //      const element = html('<my-app></my-app>');
            //      adapter.bootstrap(element, ['ng1']).ready((ref) => {
            //        let doTimeout = false;
            //        let timeoutId: number;
            //        ref.ng1RootScope.$watch(() => {
            //          if (doTimeout && !timeoutId) {
            //            timeoutId = window.setTimeout(function() {
            //              timeoutId = null;
            //            }, 10);
            //          }
            //        });
            //        doTimeout = true;
            //      });
            //    }));
        });
        describe('downgrade ng2 component', function () {
            it('should allow non-element selectors for downgraded components', testing_1.async(function () {
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
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [WorksComponent], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(WorksComponent));
                var element = test_helpers_1.html('<ng2></ng2>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toBe('It works');
                });
            }));
            it('should bind properties, events', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []).value('$exceptionHandler', function (err) { throw err; });
                ng1Module.run(function ($rootScope) {
                    $rootScope.name = 'world';
                    $rootScope.dataA = 'A';
                    $rootScope.dataB = 'B';
                    $rootScope.modelA = 'initModelA';
                    $rootScope.modelB = 'initModelB';
                    $rootScope.eventA = '?';
                    $rootScope.eventB = '?';
                });
                var Ng2 = (function () {
                    function Ng2() {
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
                    Ng2.prototype.ngOnChanges = function (changes) {
                        var _this = this;
                        var assert = function (prop, value) {
                            if (_this[prop] != value) {
                                throw new Error("Expected: '" + prop + "' to be '" + value + "' but was '" + _this[prop] + "'");
                            }
                        };
                        var assertChange = function (prop, value) {
                            assert(prop, value);
                            if (!changes[prop]) {
                                throw new Error("Changes record for '" + prop + "' not found.");
                            }
                            var actValue = changes[prop].currentValue;
                            if (actValue != value) {
                                throw new Error("Expected changes record for'" + prop + "' to be '" + value + "' but was '" + actValue + "'");
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
                    return Ng2;
                }());
                Ng2 = __decorate([
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
                ], Ng2);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ;
                var element = test_helpers_1.html("<div>\n              <ng2 literal=\"Text\" interpolate=\"Hello {{name}}\"\n                   bind-one-way-a=\"dataA\" [one-way-b]=\"dataB\"\n                   bindon-two-way-a=\"modelA\" [(two-way-b)]=\"modelB\"\n                   on-event-a='eventA=$event' (event-b)=\"eventB=$event\"></ng2>\n              | modelA: {{modelA}}; modelB: {{modelB}}; eventA: {{eventA}}; eventB: {{eventB}};\n              </div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ignore: -; ' +
                        'literal: Text; interpolate: Hello world; ' +
                        'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (2) | ' +
                        'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                    ref.ng1RootScope.$apply('name = "everyone"');
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ignore: -; ' +
                        'literal: Text; interpolate: Hello everyone; ' +
                        'oneWayA: A; oneWayB: B; twoWayA: newA; twoWayB: newB; (3) | ' +
                        'modelA: newA; modelB: newB; eventA: aFired; eventB: bFired;');
                    ref.dispose();
                });
            }));
            it('should initialize inputs in time for `ngOnChanges`', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
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
                        template: "\n               ngOnChangesCount: {{ ngOnChangesCount }} |\n               firstChangesCount: {{ firstChangesCount }} |\n               initialValue: {{ initialValue }}"
                    })
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [Ng2Component] })
                ], Ng2Module);
                var ng1Module = angular.module('ng1', []).directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                var element = test_helpers_1.html("\n             <ng2 [foo]=\"'foo'\"></ng2>\n             <ng2 foo=\"bar\"></ng2>\n             <ng2 [foo]=\"'baz'\" ng-if=\"true\"></ng2>\n             <ng2 foo=\"qux\" ng-if=\"true\"></ng2>\n           ");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var nodes = element.querySelectorAll('ng2');
                    var expectedTextWith = function (value) {
                        return "ngOnChangesCount: 1 | firstChangesCount: 1 | initialValue: " + value;
                    };
                    expect(test_helpers_1.multiTrim(nodes[0].textContent)).toBe(expectedTextWith('foo'));
                    expect(test_helpers_1.multiTrim(nodes[1].textContent)).toBe(expectedTextWith('bar'));
                    expect(test_helpers_1.multiTrim(nodes[2].textContent)).toBe(expectedTextWith('baz'));
                    expect(test_helpers_1.multiTrim(nodes[3].textContent)).toBe(expectedTextWith('qux'));
                    ref.dispose();
                });
            }));
            it('should bind to ng-model', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.run(function ($rootScope /** TODO #9100 */) { $rootScope.modelA = 'A'; });
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
                    core_1.Component({ selector: 'ng2', template: '{{_value}}' }),
                    __metadata("design:paramtypes", [])
                ], Ng2);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2 ng-model=\"modelA\"></ng2> | {{modelA}}</div>");
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2],
                        imports: [platform_browser_1.BrowserModule],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    })
                ], Ng2Module);
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var $rootScope = ref.ng1RootScope;
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
                    ref.dispose();
                });
            }));
            it('should properly run cleanup when ng1 directive is destroyed', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var onDestroyed = new core_1.EventEmitter();
                ng1Module.directive('ng1', function () {
                    return {
                        template: '<div ng-if="!destroyIt"><ng2></ng2></div>',
                        controller: function ($rootScope, $timeout) {
                            $timeout(function () { $rootScope.destroyIt = true; });
                        }
                    };
                });
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    Ng2.prototype.ngOnDestroy = function () { onDestroyed.emit('destroyed'); };
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'test' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<ng1></ng1>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    onDestroyed.subscribe(function () { ref.dispose(); });
                });
            }));
            it('should fallback to the root ng2.injector when compiled outside the dom', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.directive('ng1', [
                    '$compile',
                    function ($compile) {
                        return {
                            link: function ($scope, $element, $attrs) {
                                var compiled = $compile('<ng2></ng2>');
                                var template = compiled($scope);
                                $element.append(template);
                            }
                        };
                    }
                ]);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'test' })
                ], Ng2);
                ;
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html('<ng1></ng1>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('test');
                    ref.dispose();
                });
            }));
            it('should support multi-slot projection', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '2a(<ng-content select=".ng1a"></ng-content>)' +
                            '2b(<ng-content select=".ng1b"></ng-content>)'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                // The ng-if on one of the projected children is here to make sure
                // the correct slot is targeted even with structural directives in play.
                var element = test_helpers_1.html('<ng2><div ng-if="true" class="ng1a">1a</div><div' +
                    ' class="ng1b">1b</div></ng2>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('2a(1a)2b(1b)');
                    ref.dispose();
                });
            }));
            it('should correctly project structural directives', testing_1.async(function () {
                var Ng2Component = (function () {
                    function Ng2Component() {
                    }
                    return Ng2Component;
                }());
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng2Component.prototype, "itemId", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'ng2-{{ itemId }}(<ng-content></ng-content>)' })
                ], Ng2Component);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [Ng2Component] })
                ], Ng2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                var ng1Module = angular.module('ng1', [])
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component))
                    .run(function ($rootScope) {
                    $rootScope['items'] = [
                        { id: 'a', subitems: [1, 2, 3] }, { id: 'b', subitems: [4, 5, 6] },
                        { id: 'c', subitems: [7, 8, 9] }
                    ];
                });
                var element = test_helpers_1.html("\n             <ng2 ng-repeat=\"item in items\" [item-id]=\"item.id\">\n               <div ng-repeat=\"subitem in item.subitems\">{{ subitem }}</div>\n             </ng2>\n           ");
                adapter.bootstrap(element, [ng1Module.name]).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toBe('ng2-a( 123 )ng2-b( 456 )ng2-c( 789 )');
                    ref.dispose();
                });
            }));
            it('should allow attribute selectors for components in ng2', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return MyNg2Module; }));
                var ng1Module = angular.module('myExample', []);
                var WorksComponent = (function () {
                    function WorksComponent() {
                    }
                    return WorksComponent;
                }());
                WorksComponent = __decorate([
                    core_1.Component({ selector: '[works]', template: 'works!' })
                ], WorksComponent);
                var RootComponent = (function () {
                    function RootComponent() {
                    }
                    return RootComponent;
                }());
                RootComponent = __decorate([
                    core_1.Component({ selector: 'root-component', template: 'It <div works></div>' })
                ], RootComponent);
                var MyNg2Module = (function () {
                    function MyNg2Module() {
                    }
                    return MyNg2Module;
                }());
                MyNg2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [RootComponent, WorksComponent] })
                ], MyNg2Module);
                ng1Module.directive('rootComponent', adapter.downgradeNg2Component(RootComponent));
                document.body.innerHTML = '<root-component></root-component>';
                adapter.bootstrap(document.body.firstElementChild, ['myExample']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('It works!');
                    ref.dispose();
                });
            }));
        });
        describe('upgrade ng1 component', function () {
            it('should support `@` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA }}, {{ $ctrl.inputB }}',
                    bindings: { inputA: '@inputAttrA', inputB: '@' }
                };
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
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                        imports: [platform_browser_1.BrowserModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = 'baz';
                    ng1Controller.inputB = 'qux';
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = 'foo2';
                    ng2ComponentInstance.dataB = 'bar2';
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `<` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '<inputAttrA', inputB: '<' }
                };
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
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                        imports: [platform_browser_1.BrowserModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: foo, bar');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `=` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng2ComponentInstance;
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: {{ $ctrl.inputA.value }}, {{ $ctrl.inputB.value }}',
                    bindings: { inputA: '=inputAttrA', inputB: '=' }
                };
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
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                        imports: [platform_browser_1.BrowserModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: foo, bar | Outside: foo, bar');
                    ng1Controller.inputA = { value: 'baz' };
                    ng1Controller.inputB = { value: 'qux' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: baz, qux | Outside: baz, qux');
                    ng2ComponentInstance.dataA = { value: 'foo2' };
                    ng2ComponentInstance.dataB = { value: 'bar2' };
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent))
                        .toBe('Inside: foo2, bar2 | Outside: foo2, bar2');
                    ref.dispose();
                });
            }));
            it('should support `&` bindings', testing_1.fakeAsync(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                // Define `ng1Component`
                var ng1Component = {
                    template: 'Inside: -',
                    bindings: { outputA: '&outputAttrA', outputB: '&' }
                };
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
                    .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                // Define `Ng2Module`
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                        imports: [platform_browser_1.BrowserModule]
                    })
                ], Ng2Module);
                // Bootstrap
                var element = test_helpers_1.html("<ng2></ng2>");
                adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                    var ng1 = element.querySelector('ng1');
                    var ng1Controller = angular.element(ng1).controller('ng1');
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: foo, bar');
                    ng1Controller.outputA('baz');
                    ng1Controller.outputB('qux');
                    test_helpers_1.$digest(ref);
                    expect(test_helpers_1.multiTrim(element.textContent)).toBe('Inside: - | Outside: baz, qux');
                    ref.dispose();
                });
            }));
            it('should bind properties, events', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        template: 'Hello {{fullName}}; A: {{modelA}}; B: {{modelB}}; C: {{modelC}}; | ',
                        scope: { fullName: '@', modelA: '=dataA', modelB: '=dataB', modelC: '=', event: '&' },
                        link: function (scope) {
                            scope.$watch('modelB', function (v) {
                                if (v == 'Savkin') {
                                    scope.modelB = 'SAVKIN';
                                    scope.event('WORKS');
                                    // Should not update because [model-a] is uni directional
                                    scope.modelA = 'VICTOR';
                                }
                            });
                        }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                        this.city = 'SF';
                        this.event = '?';
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '<ng1 fullName="{{last}}, {{first}}, {{city}}" [dataA]="first" [(dataB)]="last" [modelC]="city" ' +
                            '(event)="event=$event"></ng1>' +
                            '<ng1 fullName="{{\'TEST\'}}" dataA="First" dataB="Last" modelC="City"></ng1>' +
                            '{{event}}-{{last}}, {{first}}, {{city}}'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('Hello SAVKIN, Victor, SF; A: VICTOR; B: SAVKIN; C: SF; | Hello TEST; A: First; B: Last; C: City; | WORKS-SAVKIN, Victor, SF');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind optional properties', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        template: 'Hello; A: {{modelA}}; B: {{modelB}}; | ',
                        scope: { modelA: '=?dataA', modelB: '=?' }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                        this.first = 'Victor';
                        this.last = 'Savkin';
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '<ng1 [dataA]="first" [modelB]="last"></ng1>' +
                            '<ng1 dataA="First" modelB="Last"></ng1>' +
                            '<ng1></ng1>' +
                            '<ng1></ng1>'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('Hello; A: Victor; B: Savkin; | Hello; A: First; B: Last; | Hello; A: ; B: ; | Hello; A: ; B: ; |');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind properties, events in controller when bindToController is not used', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        restrict: 'E',
                        template: '{{someText}} - Length: {{data.length}}',
                        scope: { data: '=' },
                        controller: function ($scope) { $scope.someText = 'ng1 - Data: ' + $scope.data; }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                        this.dataList = [1, 2, 3];
                        this.someText = 'ng2';
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '{{someText}} - Length: {{dataList.length}} | <ng1 [(data)]="dataList"></ng1>'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('ng2 - Length: 3 | ng1 - Data: 1,2,3 - Length: 3');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should bind properties, events in link function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        restrict: 'E',
                        template: '{{someText}} - Length: {{data.length}}',
                        scope: { data: '=' },
                        link: function ($scope) { $scope.someText = 'ng1 - Data: ' + $scope.data; }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                        this.dataList = [1, 2, 3];
                        this.someText = 'ng2';
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '{{someText}} - Length: {{dataList.length}} | <ng1 [(data)]="dataList"></ng1>'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    // we need to do setTimeout, because the EventEmitter uses setTimeout to schedule
                    // events, and so without this we would not see the events processed.
                    setTimeout(function () {
                        expect(test_helpers_1.multiTrim(document.body.textContent))
                            .toEqual('ng2 - Length: 3 | ng1 - Data: 1,2,3 - Length: 3');
                        ref.dispose();
                    }, 0);
                });
            }));
            it('should support templateUrl fetched from $httpBackend', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.value('$httpBackend', function (method, url, post, cbFn) {
                    cbFn(200, method + ":" + url);
                });
                var ng1 = function () { return { templateUrl: 'url.html' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('GET:url.html');
                    ref.dispose();
                });
            }));
            it('should support templateUrl as a function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.value('$httpBackend', function (method, url, post, cbFn) {
                    cbFn(200, method + ":" + url);
                });
                var ng1 = function () { return { templateUrl: function () { return 'url.html'; } }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('GET:url.html');
                    ref.dispose();
                });
            }));
            it('should support empty template', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () { return { template: '' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('');
                    ref.dispose();
                });
            }));
            it('should support template as a function', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () { return { template: function () { return ''; } }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('');
                    ref.dispose();
                });
            }));
            it('should support templateUrl fetched from $templateCache', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                ng1Module.run(function ($templateCache) { return $templateCache.put('url.html', 'WORKS'); });
                var ng1 = function () { return { templateUrl: 'url.html' }; };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support controller with controllerAs', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: true,
                        template: '{{ctl.scope}}; {{ctl.isClass}}; {{ctl.hasElement}}; {{ctl.isPublished()}}',
                        controllerAs: 'ctl',
                        controller: (function () {
                            function class_1($scope, $element) {
                                this.verifyIAmAClass();
                                this.scope = $scope.$parent.$parent == $scope.$root ? 'scope' : 'wrong-scope';
                                this.hasElement = $element[0].nodeName;
                                this.$element = $element;
                            }
                            class_1.prototype.verifyIAmAClass = function () { this.isClass = 'isClass'; };
                            class_1.prototype.isPublished = function () {
                                return this.$element.controller('ng1') == this ? 'published' : 'not-published';
                            };
                            return class_1;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('scope; isClass; NG1; published');
                    ref.dispose();
                });
            }));
            it('should support bindToController', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{ctl.title}}',
                        controllerAs: 'ctl',
                        controller: (function () {
                            function class_2() {
                            }
                            return class_2;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support bindToController with bindings', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function () {
                    return {
                        scope: {},
                        bindToController: { title: '@' },
                        template: '{{ctl.title}}',
                        controllerAs: 'ctl',
                        controller: (function () {
                            function class_3() {
                            }
                            return class_3;
                        }())
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 title="WORKS"></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support single require in linking fn', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = function ($rootScope) {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{ctl.status}}',
                        require: 'ng1',
                        controllerAs: 'ctrl',
                        controller: (function () {
                            function class_4() {
                                this.status = 'WORKS';
                            }
                            return class_4;
                        }()),
                        link: function (scope, element, attrs, linkController) {
                            expect(scope.$root).toEqual($rootScope);
                            expect(element[0].nodeName).toEqual('NG1');
                            expect(linkController.status).toEqual('WORKS');
                            scope.ctl = linkController;
                        }
                    };
                };
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('WORKS');
                    ref.dispose();
                });
            }));
            it('should support array require in linking fn', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var parent = function () { return { controller: (function () {
                        function class_5() {
                            this.parent = 'PARENT';
                        }
                        return class_5;
                    }()) }; };
                var ng1 = function () {
                    return {
                        scope: { title: '@' },
                        bindToController: true,
                        template: '{{parent.parent}}:{{ng1.status}}',
                        require: ['ng1', '^parent', '?^^notFound'],
                        controllerAs: 'ctrl',
                        controller: (function () {
                            function class_6() {
                                this.status = 'WORKS';
                            }
                            return class_6;
                        }()),
                        link: function (scope, element, attrs, linkControllers) {
                            expect(linkControllers[0].status).toEqual('WORKS');
                            expect(linkControllers[1].parent).toEqual('PARENT');
                            expect(linkControllers[2]).toBe(undefined);
                            scope.ng1 = linkControllers[0];
                            scope.parent = linkControllers[1];
                        }
                    };
                };
                ng1Module.directive('parent', parent);
                ng1Module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><parent><ng2></ng2></parent></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('PARENT:WORKS');
                    ref.dispose();
                });
            }));
            describe('with lifecycle hooks', function () {
                it('should call `$onInit()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onInitSpyA = jasmine.createSpy('$onInitA');
                    var $onInitSpyB = jasmine.createSpy('$onInitB');
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: (function () {
                            function class_7() {
                            }
                            class_7.prototype.$onInit = function () { $onInitSpyA(); };
                            return class_7;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$onInit = $onInitSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($onInitSpyA).toHaveBeenCalled();
                        expect($onInitSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$onInit()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onInitSpy = jasmine.createSpy('$onInit');
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$onInit = $onInitSpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$onInit'] = $onInitSpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($onInitSpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$doCheck()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $doCheckSpyA = jasmine.createSpy('$doCheckA');
                    var $doCheckSpyB = jasmine.createSpy('$doCheckB');
                    var changeDetector;
                    var Ng2Component = (function () {
                        function Ng2Component(cd) {
                            changeDetector = cd;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: (function () {
                            function class_8() {
                            }
                            class_8.prototype.$doCheck = function () { $doCheckSpyA(); };
                            return class_8;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$doCheck = $doCheckSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($doCheckSpyA).toHaveBeenCalled();
                        expect($doCheckSpyB).toHaveBeenCalled();
                        $doCheckSpyA.calls.reset();
                        $doCheckSpyB.calls.reset();
                        changeDetector.detectChanges();
                        expect($doCheckSpyA).toHaveBeenCalled();
                        expect($doCheckSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$doCheck()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $doCheckSpyA = jasmine.createSpy('$doCheckA');
                    var $doCheckSpyB = jasmine.createSpy('$doCheckB');
                    var changeDetector;
                    var Ng2Component = (function () {
                        function Ng2Component(cd) {
                            changeDetector = cd;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$doCheck = $doCheckSpyA;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$doCheck'] = $doCheckSpyB;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        $doCheckSpyA.calls.reset();
                        $doCheckSpyB.calls.reset();
                        changeDetector.detectChanges();
                        expect($doCheckSpyA).not.toHaveBeenCalled();
                        expect($doCheckSpyB).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$postLink()` on controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $postLinkSpyA = jasmine.createSpy('$postLinkA');
                    var $postLinkSpyB = jasmine.createSpy('$postLinkB');
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: (function () {
                            function class_9() {
                            }
                            class_9.prototype.$postLink = function () { $postLinkSpyA(); };
                            return class_9;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$postLink = $postLinkSpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($postLinkSpyA).toHaveBeenCalled();
                        expect($postLinkSpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$postLink()` on scope', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $postLinkSpy = jasmine.createSpy('$postLink');
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a> | <ng1-b></ng1-b>' })
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$postLink = $postLinkSpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$postLink'] = $postLinkSpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        expect($postLinkSpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should call `$onChanges()` on binding destination', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onChangesControllerSpyA = jasmine.createSpy('$onChangesControllerA');
                    var $onChangesControllerSpyB = jasmine.createSpy('$onChangesControllerB');
                    var $onChangesScopeSpy = jasmine.createSpy('$onChangesScope');
                    var ng2Instance;
                    var Ng2Component = (function () {
                        function Ng2Component() {
                            ng2Instance = this;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: '<ng1-a [valA]="val"></ng1-a> | <ng1-b [valB]="val"></ng1-b>'
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    angular.module('ng1', [])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: { valA: '<' },
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            this.$onChanges = $onChangesControllerSpyA;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: { valB: '<' },
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: (function () {
                            function class_10() {
                            }
                            class_10.prototype.$onChanges = function (changes) { $onChangesControllerSpyB(changes); };
                            return class_10;
                        }())
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component))
                        .run(function ($rootScope) {
                        Object.getPrototypeOf($rootScope).$onChanges = $onChangesScopeSpy;
                    });
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        // Initial `$onChanges()` call
                        testing_1.tick();
                        expect($onChangesControllerSpyA.calls.count()).toBe(1);
                        expect($onChangesControllerSpyA.calls.argsFor(0)[0]).toEqual({
                            valA: jasmine.any(core_1.SimpleChange)
                        });
                        expect($onChangesControllerSpyB).not.toHaveBeenCalled();
                        expect($onChangesScopeSpy.calls.count()).toBe(1);
                        expect($onChangesScopeSpy.calls.argsFor(0)[0]).toEqual({
                            valB: jasmine.any(core_1.SimpleChange)
                        });
                        $onChangesControllerSpyA.calls.reset();
                        $onChangesControllerSpyB.calls.reset();
                        $onChangesScopeSpy.calls.reset();
                        // `$onChanges()` call after a change
                        ng2Instance.val = 'new value';
                        testing_1.tick();
                        ref.ng1RootScope.$digest();
                        expect($onChangesControllerSpyA.calls.count()).toBe(1);
                        expect($onChangesControllerSpyA.calls.argsFor(0)[0]).toEqual({
                            valA: jasmine.objectContaining({ currentValue: 'new value' })
                        });
                        expect($onChangesControllerSpyB).not.toHaveBeenCalled();
                        expect($onChangesScopeSpy.calls.count()).toBe(1);
                        expect($onChangesScopeSpy.calls.argsFor(0)[0]).toEqual({
                            valB: jasmine.objectContaining({ currentValue: 'new value' })
                        });
                        ref.dispose();
                    });
                }));
                it('should call `$onDestroy()` on controller', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onDestroySpyA = jasmine.createSpy('$onDestroyA');
                    var $onDestroySpyB = jasmine.createSpy('$onDestroyB');
                    var ng2ComponentInstance;
                    var Ng2Component = (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n                <div *ngIf=\"!ng2Destroy\">\n                  <ng1-a></ng1-a> | <ng1-b></ng1-b>\n                </div>\n              "
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be
                    // on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: (function () {
                            function class_11() {
                            }
                            class_11.prototype.$onDestroy = function () { $onDestroySpyA(); };
                            return class_11;
                        }())
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function () { this.$onDestroy = $onDestroySpyB; }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div ng-if=\"!ng1Destroy\"><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).not.toHaveBeenCalled();
                        expect($onDestroySpyB).not.toHaveBeenCalled();
                        $rootScope.ng1Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).toHaveBeenCalled();
                        expect($onDestroySpyB).toHaveBeenCalled();
                        $onDestroySpyA.calls.reset();
                        $onDestroySpyB.calls.reset();
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).not.toHaveBeenCalled();
                        expect($onDestroySpyB).not.toHaveBeenCalled();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpyA).toHaveBeenCalled();
                        expect($onDestroySpyB).toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
                it('should not call `$onDestroy()` on scope', testing_1.fakeAsync(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var $onDestroySpy = jasmine.createSpy('$onDestroy');
                    var ng2ComponentInstance;
                    var Ng2Component = (function () {
                        function Ng2Component() {
                            this.ng2Destroy = false;
                            ng2ComponentInstance = this;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n                <div *ngIf=\"!ng2Destroy\">\n                  <ng1-a></ng1-a> | <ng1-b></ng1-b>\n                </div>\n              "
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // On browsers that don't support `requestAnimationFrame` (IE 9, Android <= 4.3),
                    // `$animate` will use `setTimeout(..., 16.6)` instead. This timeout will still be
                    // on
                    // the queue at the end of the test, causing it to fail.
                    // Mocking animations (via `ngAnimateMock`) avoids the issue.
                    angular.module('ng1', ['ngAnimateMock'])
                        .directive('ng1A', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: true,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            Object.getPrototypeOf($scope).$onDestroy = $onDestroySpy;
                        }
                    }); })
                        .directive('ng1B', function () { return ({
                        template: '',
                        scope: {},
                        bindToController: false,
                        controllerAs: '$ctrl',
                        controller: function ($scope) {
                            $scope['$onDestroy'] = $onDestroySpy;
                        }
                    }); })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            declarations: [
                                adapter.upgradeNg1Component('ng1A'), adapter.upgradeNg1Component('ng1B'),
                                Ng2Component
                            ],
                            imports: [platform_browser_1.BrowserModule],
                        })
                    ], Ng2Module);
                    var element = test_helpers_1.html("<div ng-if=\"!ng1Destroy\"><ng2></ng2></div>");
                    adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                        var $rootScope = ref.ng1RootScope;
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        $rootScope.ng1Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        $rootScope.ng1Destroy = false;
                        testing_1.tick();
                        $rootScope.$digest();
                        ng2ComponentInstance.ng2Destroy = true;
                        testing_1.tick();
                        $rootScope.$digest();
                        expect($onDestroySpy).not.toHaveBeenCalled();
                        ref.dispose();
                    });
                }));
            });
            describe('linking', function () {
                it('should run the pre-linking after instantiating the controller', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: '',
                        link: { pre: function () { return log.push('ng1-pre'); } },
                        controller: (function () {
                            function class_12() {
                                log.push('ng1-ctrl');
                            }
                            return class_12;
                        }())
                    };
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
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1-ctrl', 'ng1-pre']);
                    });
                }));
                it('should run the pre-linking function before linking', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: { pre: function () { return log.push('ng1A-pre'); } }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1A-pre', 'ng1B-post']);
                    });
                }));
                it('should run the post-linking function after linking (link: object)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: { post: function () { return log.push('ng1A-post'); } }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                    });
                }));
                it('should run the post-linking function after linking (link: function)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1DirectiveA = {
                        template: '<ng1-b></ng1-b>',
                        link: function () { return log.push('ng1A-post'); }
                    };
                    var ng1DirectiveB = { link: function () { return log.push('ng1B-post'); } };
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({ selector: 'ng2', template: '<ng1-a></ng1-a>' })
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1', [])
                        .directive('ng1A', function () { return ng1DirectiveA; })
                        .directive('ng1B', function () { return ng1DirectiveB; })
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1A'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1B-post', 'ng1A-post']);
                    });
                }));
                it('should run the post-linking function before `$postLink`', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var log = [];
                    // Define `ng1Directive`
                    var ng1Directive = {
                        template: '',
                        link: function () { return log.push('ng1-post'); },
                        controller: (function () {
                            function class_13() {
                            }
                            class_13.prototype.$postLink = function () { log.push('ng1-$post'); };
                            return class_13;
                        }())
                    };
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
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1']).ready(function () {
                        expect(log).toEqual(['ng1-post', 'ng1-$post']);
                    });
                }));
            });
            describe('transclusion', function () {
                it('should support single-slot transclusion', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentAInstance;
                    var ng2ComponentBInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(<div ng-transclude></div>)',
                        transclude: true
                    };
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
                        .directive('ng2A', adapter.downgradeNg2Component(Ng2ComponentA));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2ComponentA, Ng2ComponentB]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2-a></ng2-a>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(foo | ))');
                        ng2ComponentAInstance.value = 'baz';
                        ng2ComponentAInstance.showB = true;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(bar)))');
                        ng2ComponentBInstance.value = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent)).toBe('ng2A(ng1(baz | ng2B(qux)))');
                    });
                }));
                it('should support single-slot transclusion with fallback content', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(<div ng-transclude>{{ $ctrl.value }}</div>)',
                        transclude: true,
                        controller: (function () {
                            function class_14() {
                                this.value = 'from-ng1';
                                ng1ControllerInstances.push(this);
                            }
                            return class_14;
                        }())
                    };
                    // Define `Ng2Component`
                    var Ng2Component = (function () {
                        function Ng2Component() {
                            this.value = 'from-ng2';
                            ng2ComponentInstance = this;
                        }
                        return Ng2Component;
                    }());
                    Ng2Component = __decorate([
                        core_1.Component({
                            selector: 'ng2',
                            template: "\n                ng2(\n                  <ng1><div>{{ value }}</div></ng1> |\n\n                  <!-- Interpolation-only content should still be detected as transcluded content. -->\n                  <ng1>{{ value }}</ng1> |\n\n                  <ng1></ng1>\n                )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(from-ng2)|ng1(from-ng2)|ng1(from-ng1))');
                        ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-foo'; });
                        ng2ComponentInstance.value = 'ng2-bar';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(ng2-bar)|ng1(ng2-bar)|ng1(ng1-foo))');
                    });
                }));
                it('should support multi-slot transclusion', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(x(<div ng-transclude="slotX"></div>) | y(<div ng-transclude="slotY"></div>))',
                        transclude: { slotX: 'contentX', slotY: 'contentY' }
                    };
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
                            template: "\n                ng2(\n                  <ng1>\n                    <content-x>{{ x }}1</content-x>\n                    <content-y>{{ y }}1</content-y>\n                    <content-x>{{ x }}2</content-x>\n                    <content-y>{{ y }}2</content-y>\n                  </ng1>\n                )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(foo1foo2)|y(bar1bar2)))');
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(baz1baz2)|y(qux1qux2)))');
                    });
                }));
                it('should support default slot (with fallback content)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(default(<div ng-transclude="">fallback-{{ $ctrl.value }}</div>))',
                        transclude: { slotX: 'contentX', slotY: 'contentY' },
                        controller: (function () {
                            function class_15() {
                                this.value = 'ng1';
                                ng1ControllerInstances.push(this);
                            }
                            return class_15;
                        }())
                    };
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
                            template: "\n                ng2(\n                  <ng1>\n                    ({{ x }})\n                    <content-x>ignored x</content-x>\n                    {{ x }}-<span>{{ y }}</span>\n                    <content-y>ignored y</content-y>\n                    <span>({{ y }})</span>\n                  </ng1> |\n\n                  <!--\n                    Remove any whitespace, because in AngularJS versions prior to 1.6\n                    even whitespace counts as transcluded content.\n                  -->\n                  <ng1><content-x>ignored x</content-x><content-y>ignored y</content-y></ng1> |\n\n                  <!--\n                    Interpolation-only content should still be detected as transcluded content.\n                  -->\n                  <ng1>{{ x }}<content-x>ignored x</content-x>{{ y + x }}<content-y>ignored y</content-y>{{ y }}</ng1>\n                )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(default((foo)foo-bar(bar)))|ng1(default(fallback-ng1))|ng1(default(foobarfoobar)))');
                        ng1ControllerInstances.forEach(function (ctrl) { return ctrl.value = 'ng1-plus'; });
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(default((baz)baz-qux(qux)))|ng1(default(fallback-ng1-plus))|ng1(default(bazquxbazqux)))');
                    });
                }));
                it('should support optional transclusion slots (with fallback content)', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng1ControllerInstances = [];
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: "\n                ng1(\n                  x(<div ng-transclude=\"slotX\">{{ $ctrl.x }}</div>) |\n                  y(<div ng-transclude=\"slotY\">{{ $ctrl.y }}</div>)\n                )",
                        transclude: { slotX: '?contentX', slotY: '?contentY' },
                        controller: (function () {
                            function class_16() {
                                this.x = 'ng1X';
                                this.y = 'ng1Y';
                                ng1ControllerInstances.push(this);
                            }
                            return class_16;
                        }())
                    };
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
                            template: "\n                ng2(\n                  <ng1><content-x>{{ x }}</content-x></ng1> |\n                  <ng1><content-y>{{ y }}</content-y></ng1>\n                )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(ng2X)|y(ng1Y))|ng1(x(ng1X)|y(ng2Y)))');
                        ng1ControllerInstances.forEach(function (ctrl) {
                            ctrl.x = 'ng1X-foo';
                            ctrl.y = 'ng1Y-bar';
                        });
                        ng2ComponentInstance.x = 'ng2X-baz';
                        ng2ComponentInstance.y = 'ng2Y-qux';
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true))
                            .toBe('ng2(ng1(x(ng2X-baz)|y(ng1Y-bar))|ng1(x(ng1X-foo)|y(ng2Y-qux)))');
                    });
                }));
                it('should throw if a non-optional slot is not filled', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var errorMessage;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: '',
                        transclude: { slotX: '?contentX', slotY: 'contentY' }
                    };
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
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(errorMessage)
                            .toContain('Required transclusion slot \'slotY\' on directive: ng1');
                    });
                }));
                it('should support structural directives in transcluded content', testing_1.async(function () {
                    var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                    var ng2ComponentInstance;
                    // Define `ng1Component`
                    var ng1Component = {
                        template: 'ng1(x(<div ng-transclude="slotX"></div>) | default(<div ng-transclude=""></div>))',
                        transclude: { slotX: 'contentX' }
                    };
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
                            template: "\n                ng2(\n                  <ng1>\n                    <content-x><div *ngIf=\"show\">{{ x }}1</div></content-x>\n                    <div *ngIf=\"!show\">{{ y }}1</div>\n                    <content-x><div *ngIf=\"!show\">{{ x }}2</div></content-x>\n                    <div *ngIf=\"show\">{{ y }}2</div>\n                  </ng1>\n                )"
                        }),
                        __metadata("design:paramtypes", [])
                    ], Ng2Component);
                    // Define `ng1Module`
                    var ng1Module = angular.module('ng1Module', [])
                        .component('ng1', ng1Component)
                        .directive('ng2', adapter.downgradeNg2Component(Ng2Component));
                    // Define `Ng2Module`
                    var Ng2Module = (function () {
                        function Ng2Module() {
                        }
                        return Ng2Module;
                    }());
                    Ng2Module = __decorate([
                        core_1.NgModule({
                            imports: [platform_browser_1.BrowserModule],
                            declarations: [adapter.upgradeNg1Component('ng1'), Ng2Component],
                            schemas: [core_1.NO_ERRORS_SCHEMA]
                        })
                    ], Ng2Module);
                    // Bootstrap
                    var element = test_helpers_1.html("<ng2></ng2>");
                    adapter.bootstrap(element, ['ng1Module']).ready(function (ref) {
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(foo1)|default(bar2)))');
                        ng2ComponentInstance.x = 'baz';
                        ng2ComponentInstance.y = 'qux';
                        ng2ComponentInstance.show = false;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz2)|default(qux1)))');
                        ng2ComponentInstance.show = true;
                        test_helpers_1.$digest(ref);
                        expect(test_helpers_1.multiTrim(element.textContent, true)).toBe('ng2(ng1(x(baz1)|default(qux2)))');
                    });
                }));
            });
            it('should bind input properties (<) of components', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = {
                    bindings: { personProfile: '<' },
                    template: 'Hello {{$ctrl.personProfile.firstName}} {{$ctrl.personProfile.lastName}}',
                    controller: (function () {
                        function class_17() {
                        }
                        return class_17;
                    }())
                };
                ng1Module.component('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                        this.goku = { firstName: 'GOKU', lastName: 'SAN' };
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({ selector: 'ng2', template: '<ng1 [personProfile]="goku"></ng1>' })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                ng1Module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                var element = test_helpers_1.html("<div><ng2></ng2></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual("Hello GOKU SAN");
                    ref.dispose();
                });
            }));
            it('should support ng2 > ng1 > ng2', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var ng1Module = angular.module('ng1', []);
                var ng1 = {
                    template: 'ng1(<ng2b></ng2b>)',
                };
                ng1Module.component('ng1', ng1);
                var Ng2a = (function () {
                    function Ng2a() {
                    }
                    return Ng2a;
                }());
                Ng2a = __decorate([
                    core_1.Component({ selector: 'ng2a', template: 'ng2a(<ng1></ng1>)' })
                ], Ng2a);
                ng1Module.directive('ng2a', adapter.downgradeNg2Component(Ng2a));
                var Ng2b = (function () {
                    function Ng2b() {
                    }
                    return Ng2b;
                }());
                Ng2b = __decorate([
                    core_1.Component({ selector: 'ng2b', template: 'ng2b' })
                ], Ng2b);
                ng1Module.directive('ng2b', adapter.downgradeNg2Component(Ng2b));
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2a, Ng2b],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                var element = test_helpers_1.html("<div><ng2a></ng2a></div>");
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent)).toEqual('ng2a(ng1(ng2b))');
                });
            }));
        });
        describe('injection', function () {
            function SomeToken() { }
            it('should export ng2 instance to ng1', testing_1.async(function () {
                var MyNg2Module = (function () {
                    function MyNg2Module() {
                    }
                    return MyNg2Module;
                }());
                MyNg2Module = __decorate([
                    core_1.NgModule({
                        providers: [{ provide: SomeToken, useValue: 'correct_value' }],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], MyNg2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                var module = angular.module('myExample', []);
                module.factory('someToken', adapter.downgradeNg2Provider(SomeToken));
                adapter.bootstrap(test_helpers_1.html('<div>'), ['myExample']).ready(function (ref) {
                    expect(ref.ng1Injector.get('someToken')).toBe('correct_value');
                    ref.dispose();
                });
            }));
            it('should export ng1 instance to ng2', testing_1.async(function () {
                var MyNg2Module = (function () {
                    function MyNg2Module() {
                    }
                    return MyNg2Module;
                }());
                MyNg2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                ], MyNg2Module);
                ;
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                var module = angular.module('myExample', []);
                module.value('testValue', 'secreteToken');
                adapter.upgradeNg1Provider('testValue');
                adapter.upgradeNg1Provider('testValue', { asToken: 'testToken' });
                adapter.upgradeNg1Provider('testValue', { asToken: String });
                adapter.bootstrap(test_helpers_1.html('<div>'), ['myExample']).ready(function (ref) {
                    expect(ref.ng2Injector.get('testValue')).toBe('secreteToken');
                    expect(ref.ng2Injector.get(String)).toBe('secreteToken');
                    expect(ref.ng2Injector.get('testToken')).toBe('secreteToken');
                    ref.dispose();
                });
            }));
            it('should respect hierarchical dependency injection for ng2', testing_1.async(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2Parent = (function () {
                    function Ng2Parent() {
                    }
                    return Ng2Parent;
                }());
                Ng2Parent = __decorate([
                    core_1.Component({ selector: 'ng2-parent', template: "ng2-parent(<ng-content></ng-content>)" })
                ], Ng2Parent);
                var Ng2Child = (function () {
                    function Ng2Child(parent) {
                    }
                    return Ng2Child;
                }());
                Ng2Child = __decorate([
                    core_1.Component({ selector: 'ng2-child', template: "ng2-child" }),
                    __metadata("design:paramtypes", [Ng2Parent])
                ], Ng2Child);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [Ng2Parent, Ng2Child], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                var element = test_helpers_1.html('<ng2-parent><ng2-child></ng2-child></ng2-parent>');
                var adapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2Parent', adapter.downgradeNg2Component(Ng2Parent))
                    .directive('ng2Child', adapter.downgradeNg2Component(Ng2Child));
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(document.body.textContent).toEqual('ng2-parent(ng2-child)');
                    ref.dispose();
                });
            }));
        });
        describe('testability', function () {
            it('should handle deferred bootstrap', testing_1.async(function () {
                var MyNg2Module = (function () {
                    function MyNg2Module() {
                    }
                    return MyNg2Module;
                }());
                MyNg2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                ], MyNg2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                angular.module('ng1', []);
                var bootstrapResumed = false;
                var element = test_helpers_1.html('<div></div>');
                window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    expect(bootstrapResumed).toEqual(true);
                    ref.dispose();
                });
                setTimeout(function () {
                    bootstrapResumed = true;
                    window.angular.resumeBootstrap();
                }, 100);
            }));
            it('should wait for ng2 testability', testing_1.async(function () {
                var MyNg2Module = (function () {
                    function MyNg2Module() {
                    }
                    return MyNg2Module;
                }());
                MyNg2Module = __decorate([
                    core_1.NgModule({ imports: [platform_browser_1.BrowserModule] })
                ], MyNg2Module);
                var adapter = new upgrade_adapter_1.UpgradeAdapter(MyNg2Module);
                angular.module('ng1', []);
                var element = test_helpers_1.html('<div></div>');
                adapter.bootstrap(element, ['ng1']).ready(function (ref) {
                    var ng2Testability = ref.ng2Injector.get(core_1.Testability);
                    ng2Testability.increasePendingRequestCount();
                    var ng2Stable = false;
                    angular.getTestability(element).whenStable(function () {
                        expect(ng2Stable).toEqual(true);
                        ref.dispose();
                    });
                    setTimeout(function () {
                        ng2Stable = true;
                        ng2Testability.decreasePendingRequestCount();
                    }, 100);
                });
            }));
        });
        describe('examples', function () {
            it('should verify UpgradeAdapter example', testing_1.async(function () {
                var adapter = new upgrade_adapter_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
                var module = angular.module('myExample', []);
                var ng1 = function () {
                    return {
                        scope: { title: '=' },
                        transclude: true,
                        template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
                    };
                };
                module.directive('ng1', ng1);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        inputs: ['name'],
                        template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [adapter.upgradeNg1Component('ng1'), Ng2],
                        imports: [platform_browser_1.BrowserModule],
                    })
                ], Ng2Module);
                module.directive('ng2', adapter.downgradeNg2Component(Ng2));
                document.body.innerHTML = '<ng2 name="World">project</ng2>';
                adapter.bootstrap(document.body.firstElementChild, ['myExample']).ready(function (ref) {
                    expect(test_helpers_1.multiTrim(document.body.textContent))
                        .toEqual('ng2[ng1[Hello World!](transclude)](project)');
                    ref.dispose();
                });
            }));
        });
        describe('registerForNg1Tests', function () {
            var upgradeAdapterRef;
            var $compile;
            var $rootScope;
            beforeEach(function () {
                var ng1Module = angular.module('ng1', []);
                var Ng2 = (function () {
                    function Ng2() {
                    }
                    return Ng2;
                }());
                Ng2 = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: 'Hello World',
                    })
                ], Ng2);
                var Ng2Module = (function () {
                    function Ng2Module() {
                    }
                    return Ng2Module;
                }());
                Ng2Module = __decorate([
                    core_1.NgModule({ declarations: [Ng2], imports: [platform_browser_1.BrowserModule] })
                ], Ng2Module);
                var upgradeAdapter = new upgrade_adapter_1.UpgradeAdapter(Ng2Module);
                ng1Module.directive('ng2', upgradeAdapter.downgradeNg2Component(Ng2));
                upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['ng1']);
            });
            beforeEach(inject(function (_$compile_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
            }));
            it('should be able to test ng1 components that use ng2 components', testing_1.async(function () {
                upgradeAdapterRef.ready(function () {
                    var element = $compile('<ng2></ng2>')($rootScope);
                    $rootScope.$digest();
                    expect(element[0].textContent).toContain('Hello World');
                });
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L2R5bmFtaWMvdXBncmFkZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNNO0FBQ3RNLGlEQUE4RTtBQUM5RSw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLDhEQUFnRTtBQUNoRSxnRkFBK0Y7QUFDL0YsK0NBQXdEO0FBRXhEO0lBQ0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUVuQyxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxjQUFNLE9BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7WUFFaEYsRUFBRSxDQUFDLDREQUE0RCxFQUFFLGVBQUssQ0FBQztnQkFDbEUsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBTTVDLElBQU0sR0FBRztvQkFBVDtvQkFDQSxDQUFDO29CQUFELFVBQUM7Z0JBQUQsQ0FBQyxBQURELElBQ0M7Z0JBREssR0FBRztvQkFKUixnQkFBUyxDQUFDO3dCQUNULFFBQVEsRUFBRSxLQUFLO3dCQUNmLFFBQVEsRUFBRSx3Q0FBd0M7cUJBQ25ELENBQUM7bUJBQ0ksR0FBRyxDQUNSO2dCQUdELElBQU0sU0FBUztvQkFBZjtvQkFDQSxDQUFDO29CQUFELGdCQUFDO2dCQUFELENBQUMs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