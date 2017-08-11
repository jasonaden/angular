"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var errors_1 = require("@angular/core/src/errors");
var index_1 = require("@angular/core/src/view/index");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
function main() {
    describe("View Providers", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function embeddedViewDef(nodes, update) {
            return function () { return index_1.viewDef(0 /* None */, nodes, update); };
        }
        function createAndGetRootNodes(viewDef) {
            var view = helper_1.createRootView(viewDef, {});
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        describe('create', function () {
            var instance;
            var SomeService = (function () {
                function SomeService(dep) {
                    this.dep = dep;
                    instance = this;
                }
                return SomeService;
            }());
            beforeEach(function () { instance = null; });
            it('should create providers eagerly', function () {
                createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, [])
                ]));
                expect(instance instanceof SomeService).toBe(true);
            });
            it('should create providers lazily', function () {
                var lazy = undefined;
                var LazyService = (function () {
                    function LazyService() {
                        lazy = this;
                    }
                    return LazyService;
                }());
                createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(512 /* TypeClassProvider */ | 4096 /* LazyProvider */, null, LazyService, LazyService, []),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.Injector])
                ]));
                expect(lazy).toBeUndefined();
                instance.dep.get(LazyService);
                expect(lazy instanceof LazyService).toBe(true);
            });
            it('should create value providers', function () {
                createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someValue', []),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should create factory providers', function () {
                function someFactory() { return 'someValue'; }
                createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(1024 /* TypeFactoryProvider */, null, 'someToken', someFactory, []),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should create useExisting providers', function () {
                createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 3, 'span'),
                    index_1.providerDef(256 /* TypeValueProvider */, null, 'someExistingToken', 'someValue', []),
                    index_1.providerDef(2048 /* TypeUseExistingProvider */, null, 'someToken', null, ['someExistingToken']),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should add a DebugContext to errors in provider factories', function () {
                var SomeService = (function () {
                    function SomeService() {
                        throw new Error('Test');
                    }
                    return SomeService;
                }());
                var err;
                try {
                    helper_1.createRootView(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([index_1.textDef(null, ['a'])]); }),
                        index_1.directiveDef(32768 /* Component */, null, 0, SomeService, [])
                    ]), testing_1.TestBed.get(core_1.Injector), [], dom_adapter_1.getDOM().createElement('div'));
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBeTruthy();
                expect(debugCtx.nodeIndex).toBe(1);
            });
            describe('deps', function () {
                var Dep = (function () {
                    function Dep() {
                    }
                    return Dep;
                }());
                it('should inject deps from the same element', function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, Dep, []),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [Dep])
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should inject deps from a parent element', function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 3, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, Dep, []),
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [Dep])
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should not inject deps from sibling root elements', function () {
                    var nodes = [
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, Dep, []),
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [Dep])
                    ];
                    // root elements
                    expect(function () { return createAndGetRootNodes(compViewDef(nodes)); })
                        .toThrowError('StaticInjectorError[Dep]: \n' +
                        '  StaticInjectorError[Dep]: \n' +
                        '    NullInjectorError: No provider for Dep!');
                    // non root elements
                    expect(function () { return createAndGetRootNodes(compViewDef([index_1.elementDef(0 /* None */, null, null, 4, 'span')].concat(nodes))); })
                        .toThrowError('StaticInjectorError[Dep]: \n' +
                        '  StaticInjectorError[Dep]: \n' +
                        '    NullInjectorError: No provider for Dep!');
                });
                it('should inject from a parent element in a parent view', function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [Dep])
                        ]); }),
                        index_1.directiveDef(32768 /* Component */, null, 0, Dep, []),
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should throw for missing dependencies', function () {
                    expect(function () { return createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, ['nonExistingDep'])
                    ])); })
                        .toThrowError('StaticInjectorError[nonExistingDep]: \n' +
                        '  StaticInjectorError[nonExistingDep]: \n' +
                        '    NullInjectorError: No provider for nonExistingDep!');
                });
                it('should use null for optional missing dependencies', function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [[2 /* Optional */, 'nonExistingDep']])
                    ]));
                    expect(instance.dep).toBe(null);
                });
                it('should skip the current element when using SkipSelf', function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 4, 'span'),
                        index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someParentValue', []),
                        index_1.elementDef(0 /* None */, null, null, 2, 'span'),
                        index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someValue', []),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [[1 /* SkipSelf */, 'someToken']])
                    ]));
                    expect(instance.dep).toBe('someParentValue');
                });
                it('should ask the root injector', testing_1.withModule({ providers: [{ provide: 'rootDep', useValue: 'rootValue' }] }, function () {
                    createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, ['rootDep'])
                    ]));
                    expect(instance.dep).toBe('rootValue');
                }));
                describe('builtin tokens', function () {
                    it('should inject ViewContainerRef', function () {
                        createAndGetRootNodes(compViewDef([
                            index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 1),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.ViewContainerRef])
                        ]));
                        expect(instance.dep.createEmbeddedView).toBeTruthy();
                    });
                    it('should inject TemplateRef', function () {
                        createAndGetRootNodes(compViewDef([
                            index_1.anchorDef(0 /* None */, null, null, 1, null, embeddedViewDef([index_1.anchorDef(0 /* None */, null, null, 0)])),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.TemplateRef])
                        ]));
                        expect(instance.dep.createEmbeddedView).toBeTruthy();
                    });
                    it('should inject ElementRef', function () {
                        var view = createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.ElementRef])
                        ])).view;
                        expect(instance.dep.nativeElement).toBe(index_1.asElementData(view, 0).renderElement);
                    });
                    it('should inject Injector', function () {
                        var view = createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.Injector])
                        ])).view;
                        expect(instance.dep.get(SomeService)).toBe(instance);
                    });
                    it('should inject ChangeDetectorRef for non component providers', function () {
                        var view = createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(0 /* None */, null, 0, SomeService, [core_1.ChangeDetectorRef])
                        ])).view;
                        expect(instance.dep._view).toBe(view);
                    });
                    it('should inject ChangeDetectorRef for component providers', function () {
                        var _a = createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return compViewDef([
                                index_1.elementDef(0 /* None */, null, null, 0, 'span'),
                            ]); }),
                            index_1.directiveDef(32768 /* Component */, null, 0, SomeService, [core_1.ChangeDetectorRef]),
                        ])), view = _a.view, rootNodes = _a.rootNodes;
                        var compView = index_1.asElementData(view, 0).componentView;
                        expect(instance.dep._view).toBe(compView);
                    });
                    it('should inject RendererV1', function () {
                        createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span', null, null, null, null, function () { return compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]); }),
                            index_1.directiveDef(32768 /* Component */, null, 0, SomeService, [core_1.Renderer])
                        ]));
                        expect(instance.dep.createElement).toBeTruthy();
                    });
                    it('should inject Renderer2', function () {
                        createAndGetRootNodes(compViewDef([
                            index_1.elementDef(0 /* None */, null, null, 1, 'span', null, null, null, null, function () { return compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]); }),
                            index_1.directiveDef(32768 /* Component */, null, 0, SomeService, [core_1.Renderer2])
                        ]));
                        expect(instance.dep.createElement).toBeTruthy();
                    });
                });
            });
        });
        describe('data binding', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var instance = undefined;
                    var SomeService = (function () {
                        function SomeService() {
                            instance = this;
                        }
                        return SomeService;
                    }());
                    var _a = createAndGetRootNodes(compViewDef([
                        index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(0 /* None */, null, 0, SomeService, [], { a: [0, 'a'], b: [1, 'b'] })
                    ], function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 1, inlineDynamic, ['v1', 'v2']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    expect(instance.a).toBe('v1');
                    expect(instance.b).toBe('v2');
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getAttribute(el, 'ng-reflect-a')).toBe('v1');
                });
            });
        });
        describe('outputs', function () {
            it('should listen to provider events', function () {
                var emitter = new core_1.EventEmitter();
                var unsubscribeSpy;
                var SomeService = (function () {
                    function SomeService() {
                        this.emitter = {
                            subscribe: function (callback) {
                                var subscription = emitter.subscribe(callback);
                                unsubscribeSpy = spyOn(subscription, 'unsubscribe').and.callThrough();
                                return subscription;
                            }
                        };
                    }
                    return SomeService;
                }());
                var handleEvent = jasmine.createSpy('handleEvent');
                var subscribe = spyOn(emitter, 'subscribe').and.callThrough();
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span', null, null, null, handleEvent),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, [], null, { emitter: 'someEventName' })
                ])), view = _a.view, rootNodes = _a.rootNodes;
                emitter.emit('someEventInstance');
                expect(handleEvent).toHaveBeenCalledWith(view, 'someEventName', 'someEventInstance');
                index_1.Services.destroyView(view);
                expect(unsubscribeSpy).toHaveBeenCalled();
            });
            it('should report debug info on event errors', function () {
                var handleErrorSpy = spyOn(testing_1.TestBed.get(core_1.ErrorHandler), 'handleError');
                var emitter = new core_1.EventEmitter();
                var SomeService = (function () {
                    function SomeService() {
                        this.emitter = emitter;
                    }
                    return SomeService;
                }());
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span', null, null, null, function () { throw new Error('Test'); }),
                    index_1.directiveDef(0 /* None */, null, 0, SomeService, [], null, { emitter: 'someEventName' })
                ])), view = _a.view, rootNodes = _a.rootNodes;
                emitter.emit('someEventInstance');
                var err = handleErrorSpy.calls.mostRecent().args[0];
                expect(err).toBeTruthy();
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                // events are emitted with the index of the element, not the index of the provider.
                expect(debugCtx.nodeIndex).toBe(0);
            });
        });
        describe('lifecycle hooks', function () {
            it('should call the lifecycle hooks in the right order', function () {
                var instanceCount = 0;
                var log = [];
                var SomeService = (function () {
                    function SomeService() {
                        this.id = instanceCount++;
                    }
                    SomeService.prototype.ngOnInit = function () { log.push(this.id + "_ngOnInit"); };
                    SomeService.prototype.ngDoCheck = function () { log.push(this.id + "_ngDoCheck"); };
                    SomeService.prototype.ngOnChanges = function () { log.push(this.id + "_ngOnChanges"); };
                    SomeService.prototype.ngAfterContentInit = function () { log.push(this.id + "_ngAfterContentInit"); };
                    SomeService.prototype.ngAfterContentChecked = function () { log.push(this.id + "_ngAfterContentChecked"); };
                    SomeService.prototype.ngAfterViewInit = function () { log.push(this.id + "_ngAfterViewInit"); };
                    SomeService.prototype.ngAfterViewChecked = function () { log.push(this.id + "_ngAfterViewChecked"); };
                    SomeService.prototype.ngOnDestroy = function () { log.push(this.id + "_ngOnDestroy"); };
                    return SomeService;
                }());
                var allFlags = 65536 /* OnInit */ | 262144 /* DoCheck */ | 524288 /* OnChanges */ |
                    1048576 /* AfterContentInit */ | 2097152 /* AfterContentChecked */ | 4194304 /* AfterViewInit */ |
                    8388608 /* AfterViewChecked */ | 131072 /* OnDestroy */;
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 3, 'span'),
                    index_1.directiveDef(allFlags, null, 0, SomeService, [], { a: [0, 'a'] }),
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(allFlags, null, 0, SomeService, [], { a: [0, 'a'] })
                ], function (check, view) {
                    check(view, 1, 0 /* Inline */, 'someValue');
                    check(view, 3, 0 /* Inline */, 'someValue');
                })), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.checkAndUpdateView(view);
                // Note: After... hooks are called bottom up.
                expect(log).toEqual([
                    '0_ngOnChanges',
                    '0_ngOnInit',
                    '0_ngDoCheck',
                    '1_ngOnChanges',
                    '1_ngOnInit',
                    '1_ngDoCheck',
                    '1_ngAfterContentInit',
                    '1_ngAfterContentChecked',
                    '0_ngAfterContentInit',
                    '0_ngAfterContentChecked',
                    '1_ngAfterViewInit',
                    '1_ngAfterViewChecked',
                    '0_ngAfterViewInit',
                    '0_ngAfterViewChecked',
                ]);
                log = [];
                index_1.Services.checkAndUpdateView(view);
                // Note: After... hooks are called bottom up.
                expect(log).toEqual([
                    '0_ngDoCheck', '1_ngDoCheck', '1_ngAfterContentChecked', '0_ngAfterContentChecked',
                    '1_ngAfterViewChecked', '0_ngAfterViewChecked'
                ]);
                log = [];
                index_1.Services.destroyView(view);
                // Note: ngOnDestroy ist called bottom up.
                expect(log).toEqual(['1_ngOnDestroy', '0_ngOnDestroy']);
            });
            it('should call ngOnChanges with the changed values and the non minified names', function () {
                var changesLog = [];
                var currValue = 'v1';
                var SomeService = (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngOnChanges = function (changes) {
                        changesLog.push(changes['nonMinifiedA']);
                    };
                    return SomeService;
                }());
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(524288 /* OnChanges */, null, 0, SomeService, [], { a: [0, 'nonMinifiedA'] })
                ], function (check, view) { check(view, 1, 0 /* Inline */, currValue); })), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.checkAndUpdateView(view);
                expect(changesLog).toEqual([new core_1.SimpleChange(undefined, 'v1', true)]);
                currValue = 'v2';
                changesLog = [];
                index_1.Services.checkAndUpdateView(view);
                expect(changesLog).toEqual([new core_1.SimpleChange('v1', 'v2', false)]);
            });
            it('should add a DebugContext to errors in provider afterXXX lifecycles', function () {
                var SomeService = (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngAfterContentChecked = function () { throw new Error('Test'); };
                    return SomeService;
                }());
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(2097152 /* AfterContentChecked */, null, 0, SomeService, [], { a: [0, 'a'] }),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var err;
                try {
                    index_1.Services.checkAndUpdateView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(1);
            });
            it('should add a DebugContext to errors inServices.destroyView', function () {
                var SomeService = (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngOnDestroy = function () { throw new Error('Test'); };
                    return SomeService;
                }());
                var _a = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(131072 /* OnDestroy */, null, 0, SomeService, [], { a: [0, 'a'] }),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var err;
                try {
                    index_1.Services.destroyView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(1);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3Byb3ZpZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBaVk7QUFDalksbURBQXlEO0FBQ3pELHNEQUF5VjtBQUN6VixpREFBa0U7QUFDbEUsNkVBQXFFO0FBRXJFLG1DQUE4RjtBQUU5RjtJQUNFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixxQkFDSSxLQUFnQixFQUFFLGdCQUErQixFQUFFLGNBQTZCLEVBQ2hGLFNBQXFDO1lBQXJDLDBCQUFBLEVBQUEsd0JBQXFDO1lBQ3ZDLE1BQU0sQ0FBQyxlQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQseUJBQXlCLEtBQWdCLEVBQUUsTUFBcUI7WUFDOUQsTUFBTSxDQUFDLGNBQU0sT0FBQSxlQUFPLGVBQWlCLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQztRQUN0RCxDQUFDO1FBRUQsK0JBQStCLE9BQXVCO1lBQ3BELElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLFFBQXFCLENBQUM7WUFFMUI7Z0JBQ0UscUJBQW1CLEdBQVE7b0JBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztvQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUFDLENBQUM7Z0JBQ25ELGtCQUFDO1lBQUQsQ0FBQyxB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