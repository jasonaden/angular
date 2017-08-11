"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var testing_1 = require("@angular/animations/browser/testing");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animations_2 = require("@angular/platform-browser/animations");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var testing_2 = require("../../testing");
var DEFAULT_NAMESPACE_ID = 'id';
var DEFAULT_COMPONENT_ID = '1';
function main() {
    // these tests are only mean't to be run within the DOM (for now)
    if (typeof Element == 'undefined')
        return;
    describe('animation tests', function () {
        function getLog() {
            return testing_1.MockAnimationDriver.log;
        }
        function resetLog() { testing_1.MockAnimationDriver.log = []; }
        beforeEach(function () {
            resetLog();
            testing_2.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        describe('fakeAsync testing', function () {
            it('should only require one flushMicrotasks call to kick off animation callbacks', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                        this.status = '';
                    }
                    Cmp.prototype.cb = function (status) { this.status = status; };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"cb('start')\" (@myAnimation.done)=\"cb('done')\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on, * => off', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                fixture.detectChanges();
                expect(cmp.status).toEqual('');
                testing_2.flushMicrotasks();
                expect(cmp.status).toEqual('start');
                var player = testing_1.MockAnimationDriver.log.pop();
                player.finish();
                expect(cmp.status).toEqual('done');
                cmp.status = '';
                cmp.exp = 'off';
                fixture.detectChanges();
                expect(cmp.status).toEqual('');
                player = testing_1.MockAnimationDriver.log.pop();
                player.finish();
                expect(cmp.status).toEqual('');
                testing_2.flushMicrotasks();
                expect(cmp.status).toEqual('done');
            }));
        });
        describe('component fixture integration', function () {
            describe('whenRenderingDone', function () {
                it('should wait until the animations are finished until continuing', testing_2.fakeAsync(function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n              <div [@myAnimation]=\"exp\"></div>\n            ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    expect(isDone).toBe(false);
                    cmp.exp = 'on';
                    fixture.detectChanges();
                    engine.flush();
                    expect(isDone).toBe(false);
                    var players = engine.players;
                    expect(players.length).toEqual(1);
                    players[0].finish();
                    expect(isDone).toBe(false);
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
                it('should wait for a noop animation to finish before continuing', testing_2.fakeAsync(function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n              <div [@myAnimation]=\"exp\"></div>\n            ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({
                        providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                        declarations: [Cmp]
                    });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    expect(isDone).toBe(false);
                    cmp.exp = 'off';
                    fixture.detectChanges();
                    engine.flush();
                    expect(isDone).toBe(false);
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
                it('should wait for active animations to finish even if they have already started', testing_2.fakeAsync(function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n                <div [@myAnimation]=\"exp\"></div>\n              ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.exp = 'on';
                    fixture.detectChanges();
                    engine.flush();
                    var players = engine.players;
                    expect(players.length).toEqual(1);
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(false);
                    players[0].finish();
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
            });
        });
        describe('animation triggers', function () {
            it('should trigger a state change animation from void => state', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div *ngIf=\"exp\" [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }
                ]);
            });
            it('should allow a state value to be `0`', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('0 => 1', [animations_1.style({ height: '0px' }), animations_1.animate(1234, animations_1.style({ height: '100px' }))]),
                                animations_1.transition('* => 1', [animations_1.style({ width: '0px' }), animations_1.animate(4567, animations_1.style({ width: '100px' }))])
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 0;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                var player = getLog().pop();
                expect(player.duration).toEqual(1234);
            });
            it('should always cancel the previous transition if a follow-up transition is not matched', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    Cmp.prototype.callback = function (event) {
                        if (event.phaseName == 'done') {
                            this.doneEvent = event;
                        }
                        else {
                            this.startEvent = event;
                        }
                    };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
                expect(engine.players.length).toEqual(0);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('a');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(cmp.startEvent.toState).toEqual('a');
                expect(cmp.startEvent.totalTime).toEqual(0);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(engine.players.length).toEqual(1);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('b');
                expect(cmp.startEvent.totalTime).toEqual(500);
                expect(cmp.startEvent.toState).toEqual('b');
                expect(cmp.startEvent.totalTime).toEqual(500);
                resetLog();
                var completed = false;
                players[0].onDone(function () { return completed = true; });
                cmp.exp = 'c';
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(0);
                expect(getLog().length).toEqual(0);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('c');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(cmp.startEvent.toState).toEqual('c');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(completed).toBe(true);
            }));
            it('should only turn a view removal as into `void` state transition', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp1 = false;
                        this.exp2 = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div *ngIf=\"exp1\" [@myAnimation]=\"exp2\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('void <=> *', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))]),
                                animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                function resetState() {
                    cmp.exp2 = 'something';
                    fixture.detectChanges();
                    engine.flush();
                    resetLog();
                }
                cmp.exp1 = true;
                cmp.exp2 = null;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: 1, width: '100px' }
                ]);
                resetState();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = 0;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = '';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = undefined;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp1 = false;
                cmp.exp2 = 'abc';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: 1, width: '100px' }
                ]);
            });
            it('should stringify boolean triggers to `1` and `0`', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('void => 1', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                animations_1.transition('1 => 0', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }
                ]);
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '1' }, { offset: 1, opacity: '0' }
                ]);
            });
            it('should not throw an error if a trigger with the same name exists in separate components', function () {
                var Cmp1 = (function () {
                    function Cmp1() {
                    }
                    return Cmp1;
                }());
                Cmp1 = __decorate([
                    core_1.Component({ selector: 'cmp1', template: '...', animations: [animations_1.trigger('trig', [])] })
                ], Cmp1);
                var Cmp2 = (function () {
                    function Cmp2() {
                    }
                    return Cmp2;
                }());
                Cmp2 = __decorate([
                    core_1.Component({ selector: 'cmp2', template: '...', animations: [animations_1.trigger('trig', [])] })
                ], Cmp2);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp1, Cmp2] });
                var cmp1 = testing_2.TestBed.createComponent(Cmp1);
                var cmp2 = testing_2.TestBed.createComponent(Cmp2);
            });
            describe('host bindings', function () {
                it('should trigger a state change animation from state => state on the component host element', testing_2.fakeAsync(function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = 'a';
                        }
                        return Cmp;
                    }());
                    __decorate([
                        core_1.HostBinding('@myAnimation'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "exp", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: '...',
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = 'b';
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var data = getLog().pop();
                    expect(data.element).toEqual(fixture.elementRef.nativeElement);
                    expect(data.keyframes).toEqual([{ offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }]);
                }));
                // nonAnimationRenderer => animationRenderer
                it('should trigger a leave animation when the inner components host binding updates', testing_2.fakeAsync(function () {
                    var ParentCmp = (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        return ParentCmp;
                    }());
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            template: "\n                <child-cmp *ngIf=\"exp\"></child-cmp>\n              "
                        })
                    ], ParentCmp);
                    var ChildCmp = (function () {
                        function ChildCmp() {
                            this.hostAnimation = true;
                        }
                        return ChildCmp;
                    }());
                    __decorate([
                        core_1.HostBinding('@host'),
                        __metadata("design:type", Object)
                    ], ChildCmp.prototype, "hostAnimation", void 0);
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: '...',
                            animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])]
                        })
                    ], ChildCmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var player = getLog()[0];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    player.finish();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                // animationRenderer => nonAnimationRenderer
                it('should trigger a leave animation when the outer components element binding updates on the host component element', testing_2.fakeAsync(function () {
                    var ParentCmp = (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        return ParentCmp;
                    }());
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])],
                            template: "\n                <child-cmp *ngIf=\"exp\" @host></child-cmp>\n              "
                        })
                    ], ParentCmp);
                    var ChildCmp = (function () {
                        function ChildCmp() {
                        }
                        return ChildCmp;
                    }());
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: '...',
                        })
                    ], ChildCmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var player = getLog()[0];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    player.finish();
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                // animationRenderer => animationRenderer
                it('should trigger a leave animation when both the inner and outer components trigger on the same element', testing_2.fakeAsync(function () {
                    var ParentCmp = (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        return ParentCmp;
                    }());
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ height: '100px' }), animations_1.animate(1000, animations_1.style({ height: '0px' }))])])],
                            template: "\n                <child-cmp *ngIf=\"exp\" @host></child-cmp>\n              "
                        })
                    ], ParentCmp);
                    var ChildCmp = (function () {
                        function ChildCmp() {
                            this.hostAnimation = true;
                        }
                        return ChildCmp;
                    }());
                    __decorate([
                        core_1.HostBinding('@host'),
                        __metadata("design:type", Object)
                    ], ChildCmp.prototype, "hostAnimation", void 0);
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: '...',
                            animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ width: '100px' }), animations_1.animate(1000, animations_1.style({ width: '0px' }))])])]
                        })
                    ], ChildCmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(2);
                    var _a = getLog(), p1 = _a[0], p2 = _a[1];
                    expect(p1.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '0px', offset: 1 },
                    ]);
                    expect(p2.keyframes).toEqual([
                        { height: '100px', offset: 0 },
                        { height: '0px', offset: 1 },
                    ]);
                    p1.finish();
                    p2.finish();
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                it('should not throw when the host element is removed and no animation triggers', testing_2.fakeAsync(function () {
                    var ParentCmp = (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        return ParentCmp;
                    }());
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            template: "\n                <child-cmp *ngIf=\"exp\"></child-cmp>\n              "
                        })
                    ], ParentCmp);
                    var ChildCmp = (function () {
                        function ChildCmp() {
                            this.hostAnimation = 'a';
                        }
                        return ChildCmp;
                    }());
                    __decorate([
                        core_1.HostBinding('@host'),
                        __metadata("design:type", Object)
                    ], ChildCmp.prototype, "hostAnimation", void 0);
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: '...',
                            animations: [animations_1.trigger('host', [animations_1.transition('a => b', [animations_1.style({ height: '100px' })])])],
                        })
                    ], ChildCmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    engine.flush();
                    testing_2.flushMicrotasks();
                    expect(getLog().length).toEqual(0);
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
            });
            it('should cancel and merge in mid-animation styles into the follow-up animation, but only for animation keyframes that start right away', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('a => b', [
                                    animations_1.style({ 'opacity': '0' }),
                                    animations_1.animate(500, animations_1.style({ 'opacity': '1' })),
                                ]),
                                animations_1.transition('b => c', [
                                    animations_1.group([
                                        animations_1.animate(500, animations_1.style({ 'width': '100px' })),
                                        animations_1.animate(500, animations_1.style({ 'height': '100px' })),
                                    ]),
                                    animations_1.animate(500, animations_1.keyframes([
                                        animations_1.style({ 'opacity': '0' }),
                                        animations_1.style({ 'opacity': '1' })
                                    ]))
                                ]),
                            ])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                resetLog();
                cmp.exp = 'c';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.previousStyles).toEqual({ opacity: animations_1.AUTO_STYLE });
                expect(p2.previousStyles).toEqual({ opacity: animations_1.AUTO_STYLE });
                expect(p3.previousStyles).toEqual({});
            });
            it('should provide the styling of previous players that are grouped', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('1 => 2', [
                                    animations_1.group([
                                        animations_1.animate(500, animations_1.style({ 'width': '100px' })),
                                        animations_1.animate(500, animations_1.style({ 'height': '100px' })),
                                    ]),
                                    animations_1.animate(500, animations_1.keyframes([
                                        animations_1.style({ 'opacity': '0' }),
                                        animations_1.style({ 'opacity': '1' })
                                    ]))
                                ]),
                                animations_1.transition('2 => 3', [
                                    animations_1.style({ 'opacity': '0' }),
                                    animations_1.animate(500, animations_1.style({ 'opacity': '1' })),
                                ]),
                            ])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                cmp.exp = '1';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(3);
                resetLog();
                cmp.exp = '3';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                var pp = player.previousPlayers;
                expect(pp.length).toEqual(3);
                expect(pp[0].currentSnapshot).toEqual({ width: animations_1.AUTO_STYLE });
                expect(pp[1].currentSnapshot).toEqual({ height: animations_1.AUTO_STYLE });
                expect(pp[2].currentSnapshot).toEqual({ opacity: animations_1.AUTO_STYLE });
            });
            it('should provide the styling of previous players that are grouped and queried and make sure match the players with the correct elements', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div class=\"container\" [@myAnimation]=\"exp\">\n            <div class=\"inner\"></div>\n          </div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('1 => 2', [
                                    animations_1.style({ fontSize: '10px' }),
                                    animations_1.query('.inner', [
                                        animations_1.style({ fontSize: '20px' }),
                                    ]),
                                    animations_1.animate('1s', animations_1.style({ fontSize: '100px' })),
                                    animations_1.query('.inner', [
                                        animations_1.animate('1s', animations_1.style({ fontSize: '200px' })),
                                    ]),
                                ]),
                                animations_1.transition('2 => 3', [
                                    animations_1.animate('1s', animations_1.style({ fontSize: '0px' })),
                                    animations_1.query('.inner', [
                                        animations_1.animate('1s', animations_1.style({ fontSize: '0px' })),
                                    ]),
                                ]),
                            ]),
                        ],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                cmp.exp = '1';
                fixture.detectChanges();
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                resetLog();
                cmp.exp = '3';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
                var _a = players, p1 = _a[0], p2 = _a[1];
                var pp1 = p1.previousPlayers;
                expect(p1.element.classList.contains('container')).toBeTruthy();
                for (var i = 0; i < pp1.length; i++) {
                    expect(pp1[i].element).toEqual(p1.element);
                }
                var pp2 = p2.previousPlayers;
                expect(p2.element.classList.contains('inner')).toBeTruthy();
                for (var i = 0; i < pp2.length; i++) {
                    expect(pp2[i].element).toEqual(p2.element);
                }
            });
            it('should properly balance styles between states even if there are no destination state styles', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div @myAnimation *ngIf=\"exp\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.state('void', animations_1.style({ opacity: 0, width: '0px', height: '0px' })),
                                animations_1.transition(':enter', animations_1.animate(1000))
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                var p1 = getLog()[0];
                expect(p1.keyframes).toEqual([
                    { opacity: '0', width: '0px', height: '0px', offset: 0 },
                    { opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE, offset: 1 }
                ]);
            });
            it('should not apply the destination styles if the final animate step already contains styles', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div @myAnimation *ngIf=\"exp\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.state('void', animations_1.style({ color: 'red' })), animations_1.state('*', animations_1.style({ color: 'blue' })),
                                animations_1.transition(':enter', [animations_1.style({ fontSize: '0px ' }), animations_1.animate(1000, animations_1.style({ fontSize: '100px' }))])
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                // notice how the final color is NOT blue
                expect(players[0].keyframes).toEqual([
                    { fontSize: '0px', color: 'red', offset: 0 },
                    { fontSize: '100px', color: 'red', offset: 1 }
                ]);
            });
            it('should invoke an animation trigger that is state-less', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div *ngFor=\"let item of items\" @myAnimation></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [1, 2, 3, 4, 5];
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var item = getLog()[i];
                    expect(item.duration).toEqual(1000);
                    expect(item.keyframes).toEqual([{ opacity: '0', offset: 0 }, { opacity: '1', offset: 1 }]);
                }
            });
            it('should retain styles on the element once the animation is complete', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('green'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "element", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #green @green></div>\n          ",
                        animations: [animations_1.trigger('green', [
                                animations_1.state('*', animations_1.style({ backgroundColor: 'green' })), animations_1.transition('* => *', animations_1.animate(500))
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                var player = engine.players.pop();
                player.finish();
                expect(dom_adapter_1.getDOM().hasStyle(cmp.element.nativeElement, 'background-color', 'green'))
                    .toBeTruthy();
            });
            it('should animate removals of nodes to the `void` state for each animation trigger', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = true;
                        this.exp2 = 'state';
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div *ngIf=\"exp\" class=\"ng-if\" [@trig1]=\"exp2\" @trig2></div>\n          ",
                        animations: [
                            animations_1.trigger('trig1', [animations_1.transition('state => void', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])]),
                            animations_1.trigger('trig2', [animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ width: '0px' }))])])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var element = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, '.ng-if');
                assertHasParent(element, true);
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                assertHasParent(element, true);
                expect(getLog().length).toEqual(2);
                var player2 = getLog().pop();
                var player1 = getLog().pop();
                expect(player2.keyframes).toEqual([
                    { width: animations_1.AUTO_STYLE, offset: 0 },
                    { width: '0px', offset: 1 },
                ]);
                expect(player1.keyframes).toEqual([
                    { opacity: animations_1.AUTO_STYLE, offset: 0 }, { opacity: '0', offset: 1 }
                ]);
                player2.finish();
                player1.finish();
                assertHasParent(element, false);
            });
            it('should properly cancel all existing animations when a removal occurs', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div *ngIf=\"exp\" [@myAnimation]=\"exp\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                var player1 = getLog()[0];
                resetLog();
                var finished = false;
                player1.onDone(function () { return finished = true; });
                var destroyed = false;
                player1.onDestroy(function () { return destroyed = true; });
                cmp.exp = null;
                fixture.detectChanges();
                engine.flush();
                expect(finished).toBeTruthy();
                expect(destroyed).toBeTruthy();
            });
            it('should not run inner child animations when a parent is set to be removed', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = true;
                        this.exp2 = '0';
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div *ngIf=\"exp\" class=\"parent\" >\n              <div [@myAnimation]=\"exp2\"></div>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.animate(1000, animations_1.style({ width: '0px' }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = false;
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
            });
            it('should cancel all active inner child animations when a parent removal animation is set to go', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div *ngIf=\"exp1\" @parent>\n              <div [@child]=\"exp2\" class=\"child1\"></div>\n              <div [@child]=\"exp2\" class=\"child2\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [animations_1.transition(':leave', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                            animations_1.trigger('child', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                var count = 0;
                p1.onDone(function () { return count++; });
                p2.onDone(function () { return count++; });
                cmp.exp1 = false;
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(2);
            });
            it('should destroy inner animations when a parent node is set for removal', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "parentElement", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\">\n              <div [@child]=\"exp\" class=\"child1\"></div>\n              <div [@child]=\"exp\" class=\"child2\"></div>\n            </div>\n          ",
                        animations: [animations_1.trigger('child', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                var someTrigger = animations_1.trigger('someTrigger', []);
                var hostElement = fixture.nativeElement;
                engine.register(DEFAULT_NAMESPACE_ID, hostElement);
                engine.registerTrigger(DEFAULT_COMPONENT_ID, DEFAULT_NAMESPACE_ID, hostElement, someTrigger.name, someTrigger);
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                var count = 0;
                p1.onDone(function () { return count++; });
                p2.onDone(function () { return count++; });
                engine.onRemove(DEFAULT_NAMESPACE_ID, cmp.parentElement.nativeElement, null);
                expect(count).toEqual(2);
            });
            it('should allow inner removals to happen when a non removal-based parent animation is set to animate', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "parent", void 0);
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "child", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent [@parent]=\"exp1\" class=\"parent\">\n              <div #child *ngIf=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                        animations: [animations_1.trigger('parent', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = true;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp1 = 'b';
                fixture.detectChanges();
                engine.flush();
                var player = getLog()[0];
                var p = cmp.parent.nativeElement;
                var c = cmp.child.nativeElement;
                expect(p.contains(c)).toBeTruthy();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c)).toBeFalsy();
                player.finish();
                expect(p.contains(c)).toBeFalsy();
            });
            it('should make inner removals wait until a parent based removal animation has finished', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "parent", void 0);
                __decorate([
                    core_1.ViewChild('child1'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "child1Elm", void 0);
                __decorate([
                    core_1.ViewChild('child2'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "child2Elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent *ngIf=\"exp1\" @parent class=\"parent\">\n              <div #child1 *ngIf=\"exp2\" class=\"child1\"></div>\n              <div #child2 *ngIf=\"exp2\" class=\"child2\"></div>\n            </div>\n          ",
                        animations: [animations_1.trigger('parent', [animations_1.transition(':leave', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = true;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var p = cmp.parent.nativeElement;
                var c1 = cmp.child1Elm.nativeElement;
                var c2 = cmp.child2Elm.nativeElement;
                cmp.exp1 = false;
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c1)).toBeTruthy();
                expect(p.contains(c2)).toBeTruthy();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c1)).toBeTruthy();
                expect(p.contains(c2)).toBeTruthy();
            });
            it('should detect trigger changes based on object.value properties', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"{value:exp}\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => 1', [animations_1.animate(1234, animations_1.style({ opacity: 0 }))]),
                                animations_1.transition('* => 2', [animations_1.animate(5678, animations_1.style({ opacity: 0 }))]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = '1';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(1234);
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(5678);
            });
            it('should not render animations when the object expression value is the same as it was previously', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"{value:exp,params:params}\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => *', [animations_1.animate(1234, animations_1.style({ opacity: 0 }))]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = '1';
                cmp.params = {};
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(1234);
                resetLog();
                cmp.exp = '1';
                cmp.params = {};
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(0);
            });
            it('should update the final state styles when params update even if the expression hasn\'t changed', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"{value:exp,params:{color:color}}\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.state('*', animations_1.style({ color: '{{ color }}' }), { params: { color: 'black' } }),
                                animations_1.transition('* => 1', animations_1.animate(500))
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = '1';
                cmp.color = 'red';
                fixture.detectChanges();
                var player = getLog()[0];
                var element = player.element;
                player.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'red')).toBeTruthy();
                cmp.exp = '1';
                cmp.color = 'blue';
                fixture.detectChanges();
                resetLog();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'blue')).toBeTruthy();
                cmp.exp = '1';
                cmp.color = null;
                fixture.detectChanges();
                resetLog();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'black')).toBeTruthy();
            }));
            it('should substitute in values if the provided state match is an object with values', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ opacity: '{{ start }}' }), animations_1.animate(1000, animations_1.style({ opacity: '{{ end }}' }))], buildParams({ start: '0', end: '1' }))])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = { value: 'a' };
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = { value: 'b', params: { start: .3, end: .6 } };
                fixture.detectChanges();
                engine.flush();
                var player = getLog().pop();
                expect(player.keyframes).toEqual([
                    { opacity: '0.3', offset: 0 }, { opacity: '0.6', offset: 1 }
                ]);
            });
            it('should retain substituted styles on the element once the animation is complete if referenced in the final state', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"{value:exp, params: { color: color }}\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.state('start', animations_1.style({
                                    color: '{{ color }}',
                                    fontSize: '{{ fontSize }}px',
                                    width: '{{ width }}'
                                }), { params: { color: 'red', fontSize: '200', width: '10px' } }),
                                animations_1.state('final', animations_1.style({ color: '{{ color }}', fontSize: '{{ fontSize }}px', width: '888px' }), { params: { color: 'green', fontSize: '50', width: '100px' } }),
                                animations_1.transition('start => final', animations_1.animate(500)),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'start';
                cmp.color = 'red';
                fixture.detectChanges();
                resetLog();
                cmp.exp = 'final';
                cmp.color = 'blue';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.keyframes).toEqual([
                    { color: 'red', fontSize: '200px', width: '10px', offset: 0 },
                    { color: 'blue', fontSize: '50px', width: '888px', offset: 1 }
                ]);
                var element = p1.element;
                p1.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'blue')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'fontSize', '50px')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'width', '888px')).toBeTruthy();
            }));
            it('should only evaluate final state param substitutions from the expression and state values and not from the transition options ', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.state('start', animations_1.style({
                                    width: '{{ width }}',
                                    height: '{{ height }}',
                                }), { params: { width: '0px', height: '0px' } }),
                                animations_1.state('final', animations_1.style({
                                    width: '{{ width }}',
                                    height: '{{ height }}',
                                }), { params: { width: '100px', height: '100px' } }),
                                animations_1.transition('start => final', [animations_1.animate(500)], { params: { width: '333px', height: '666px' } }),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'start';
                fixture.detectChanges();
                resetLog();
                cmp.exp = 'final';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.keyframes).toEqual([
                    { width: '0px', height: '0px', offset: 0 },
                    { width: '100px', height: '100px', offset: 1 },
                ]);
                var element = p1.element;
                p1.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'width', '100px')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'height', '100px')).toBeTruthy();
            }));
            it('should not flush animations twice when an inner component runs change detection', function () {
                var OuterCmp = (function () {
                    function OuterCmp() {
                        this.exp = null;
                    }
                    OuterCmp.prototype.update = function () { this.exp = 'go'; };
                    OuterCmp.prototype.ngDoCheck = function () {
                        if (this.exp == 'go') {
                            this.inner.update();
                        }
                    };
                    return OuterCmp;
                }());
                __decorate([
                    core_1.ViewChild('inner'),
                    __metadata("design:type", Object)
                ], OuterCmp.prototype, "inner", void 0);
                OuterCmp = __decorate([
                    core_1.Component({
                        selector: 'outer-cmp',
                        template: "\n            <div *ngIf=\"exp\" @outer></div>\n            <inner-cmp #inner></inner-cmp>\n          ",
                        animations: [animations_1.trigger('outer', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate('1s', animations_1.style({ opacity: 1 }))])])]
                    })
                ], OuterCmp);
                var InnerCmp = (function () {
                    function InnerCmp(_ref) {
                        this._ref = _ref;
                    }
                    InnerCmp.prototype.update = function () {
                        this.exp = 'go';
                        this._ref.detectChanges();
                    };
                    return InnerCmp;
                }());
                InnerCmp = __decorate([
                    core_1.Component({
                        selector: 'inner-cmp',
                        template: "\n            <div *ngIf=\"exp\" @inner></div>\n          ",
                        animations: [animations_1.trigger('inner', [animations_1.transition(':enter', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                ])])]
                    }),
                    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                ], InnerCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [OuterCmp, InnerCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(OuterCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                expect(getLog()).toEqual([]);
                cmp.update();
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
            });
            describe('transition aliases', function () {
                describe(':increment', function () {
                    it('should detect when a value has incremented', function () {
                        var Cmp = (function () {
                            function Cmp() {
                                this.exp = 0;
                            }
                            return Cmp;
                        }());
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition(':increment', [
                                            animations_1.animate(1234, animations_1.style({ background: 'red' })),
                                        ]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                        var fixture = testing_2.TestBed.createComponent(Cmp);
                        var cmp = fixture.componentInstance;
                        fixture.detectChanges();
                        var players = getLog();
                        expect(players.length).toEqual(0);
                        cmp.exp++;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                        resetLog();
                        cmp.exp = 5;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                    });
                });
                describe(':decrement', function () {
                    it('should detect when a value has decremented', function () {
                        var Cmp = (function () {
                            function Cmp() {
                                this.exp = 5;
                            }
                            return Cmp;
                        }());
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition(':decrement', [
                                            animations_1.animate(1234, animations_1.style({ background: 'red' })),
                                        ]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                        var fixture = testing_2.TestBed.createComponent(Cmp);
                        var cmp = fixture.componentInstance;
                        fixture.detectChanges();
                        var players = getLog();
                        expect(players.length).toEqual(0);
                        cmp.exp--;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                        resetLog();
                        cmp.exp = 0;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                    });
                });
            });
        });
        describe('animation listeners', function () {
            it('should trigger a `start` state change listener for when the animation changes state from void => state', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div *ngIf=\"exp\" [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'true';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation');
                expect(cmp.event.phaseName).toEqual('start');
                expect(cmp.event.totalTime).toEqual(500);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('true');
            }));
            it('should trigger a `done` state change listener for when the animation changes state from a => b', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div *ngIf=\"exp\" [@myAnimation123]=\"exp\" (@myAnimation123.done)=\"callback($event)\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation123', [animations_1.transition('* => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event).toBeFalsy();
                var player = engine.players.pop();
                player.finish();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation123');
                expect(cmp.event.phaseName).toEqual('done');
                expect(cmp.event.totalTime).toEqual(999);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('b');
            }));
            it('should handle callbacks for multiple triggers running simultaneously', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp1 = false;
                        this.exp2 = false;
                        this.callback1 = function (event) { _this.event1 = event; };
                        this.callback2 = function (event) { _this.event2 = event; };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@ani1]=\"exp1\" (@ani1.done)=\"callback1($event)\"></div>\n          <div [@ani2]=\"exp2\" (@ani2.done)=\"callback2($event)\"></div>\n        ",
                        animations: [
                            animations_1.trigger('ani1', [
                                animations_1.transition('* => a', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))]),
                            ]),
                            animations_1.trigger('ani2', [
                                animations_1.transition('* => b', [animations_1.style({ 'width': '0px' }), animations_1.animate(999, animations_1.style({ 'width': '100px' }))]),
                            ])
                        ],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                var player1 = engine.players[0];
                var player2 = engine.players[1];
                player1.finish();
                player2.finish();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                testing_2.flushMicrotasks();
                expect(cmp.event1.triggerName).toBeTruthy('ani1');
                expect(cmp.event2.triggerName).toBeTruthy('ani2');
            }));
            it('should handle callbacks for multiple triggers running simultaneously on the same element', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp1 = false;
                        this.exp2 = false;
                        this.callback1 = function (event) { _this.event1 = event; };
                        this.callback2 = function (event) { _this.event2 = event; };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@ani1]=\"exp1\" (@ani1.done)=\"callback1($event)\" [@ani2]=\"exp2\" (@ani2.done)=\"callback2($event)\"></div>\n        ",
                        animations: [
                            animations_1.trigger('ani1', [
                                animations_1.transition('* => a', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))]),
                            ]),
                            animations_1.trigger('ani2', [
                                animations_1.transition('* => b', [animations_1.style({ 'width': '0px' }), animations_1.animate(999, animations_1.style({ 'width': '100px' }))]),
                            ])
                        ],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                var player1 = engine.players[0];
                var player2 = engine.players[1];
                player1.finish();
                player2.finish();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                testing_2.flushMicrotasks();
                expect(cmp.event1.triggerName).toBeTruthy('ani1');
                expect(cmp.event2.triggerName).toBeTruthy('ani2');
            }));
            it('should trigger a state change listener for when the animation changes state from void => state on the host element', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.HostBinding('@myAnimation2'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "exp", void 0);
                __decorate([
                    core_1.HostListener('@myAnimation2.start', ['$event']),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "callback", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "...",
                        animations: [animations_1.trigger('myAnimation2', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(1000, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'TRUE';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation2');
                expect(cmp.event.phaseName).toEqual('start');
                expect(cmp.event.totalTime).toEqual(1000);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('TRUE');
            }));
            it('should always fire callbacks even when a transition is not detected', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.log = [];
                        this.callback = function (event) { return _this.log.push(event.phaseName + " => " + event.toState); };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n              <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n            ",
                        animations: [animations_1.trigger('myAnimation', [])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                    declarations: [Cmp]
                });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => a', 'done => a']);
                cmp.log = [];
                cmp.exp = 'b';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => b', 'done => b']);
            }));
            it('should fire callback events for leave animations even if there is no leave transition', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.log = [];
                        this.callback = function (event) {
                            var state = event.toState || '_default_';
                            _this.log.push(event.phaseName + " => " + state);
                        };
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n              <div *ngIf=\"exp\" @myAnimation (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n            ",
                        animations: [animations_1.trigger('myAnimation', [])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                    declarations: [Cmp]
                });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => _default_', 'done => _default_']);
                cmp.log = [];
                cmp.exp = false;
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => void', 'done => void']);
            }));
            it('should fire callbacks on a sub animation once it starts and finishes', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.log = [];
                    }
                    Cmp.prototype.cb = function (name, event) { this.log.push(name); };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n              <div class=\"parent\"\n                  [@parent]=\"exp1\"\n                  (@parent.start)=\"cb('parent-start',$event)\"\n                  (@parent.done)=\"cb('parent-done', $event)\">\n                <div class=\"child\"\n                  [@child]=\"exp2\"\n                  (@child.start)=\"cb('child-start',$event)\"\n                  (@child.done)=\"cb('child-done', $event)\"></div>\n              </div>\n            ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ width: '0px' }),
                                    animations_1.animate(1000, animations_1.style({ width: '100px' })),
                                    animations_1.query('.child', [
                                        animations_1.animateChild({ duration: '1s' }),
                                    ]),
                                    animations_1.animate(1000, animations_1.style({ width: '0px' })),
                                ]),
                            ]),
                            animations_1.trigger('child', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ height: '0px' }),
                                    animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                ]),
                            ])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go';
                cmp.exp2 = 'go';
                fixture.detectChanges();
                engine.flush();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-start', 'child-start']);
                cmp.log = [];
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                p1.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                p2.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                p3.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-done', 'child-done']);
            }));
            it('should fire callbacks and collect the correct the totalTime and element details for any queried sub animations', testing_2.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.log = [];
                        this.events = {};
                        this.items = [0, 1, 2, 3];
                    }
                    Cmp.prototype.cb = function (name, phase, event) {
                        this.log.push(name + '-' + phase);
                        this.events[name] = event;
                    };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n              <div class=\"parent\" [@parent]=\"exp\" (@parent.done)=\"cb('all','done', $event)\">\n                <div *ngFor=\"let item of items\"\n                     class=\"item item-{{ item }}\"\n                     @child\n                     (@child.start)=\"cb('c-' + item, 'start', $event)\"\n                     (@child.done)=\"cb('c-' + item, 'done', $event)\">\n                  {{ item }}\n                </div>\n              </div>\n            ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    animations_1.query('.item', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 }))
                                    ]),
                                    animations_1.query('.item', [
                                        animations_1.animateChild({ duration: '1.8s', delay: '300ms' })
                                    ])
                                ])
                            ]),
                            animations_1.trigger('child', [
                                animations_1.transition(':enter', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate(1500, animations_1.style({ opactiy: 1 }))
                                ])
                            ])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['c-0-start', 'c-1-start', 'c-2-start', 'c-3-start']);
                cmp.log = [];
                var players = getLog();
                // 1 + 4 + 4 = 9 players
                expect(players.length).toEqual(9);
                var _a = getLog(), pA = _a[0], pq1a = _a[1], pq1b = _a[2], pq1c = _a[3], pq1d = _a[4], pq2a = _a[5], pq2b = _a[6], pq2c = _a[7], pq2d = _a[8];
                pA.finish();
                pq1a.finish();
                pq1b.finish();
                pq1c.finish();
                pq1d.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                pq2a.finish();
                pq2b.finish();
                pq2c.finish();
                pq2d.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['all-done', 'c-0-done', 'c-1-done', 'c-2-done', 'c-3-done']);
                expect(cmp.events['c-0'].totalTime).toEqual(4100); // 1000 + 1000 + 1800 + 300
                expect(cmp.events['c-0'].element.innerText.trim()).toEqual('0');
                expect(cmp.events['c-1'].totalTime).toEqual(4100);
                expect(cmp.events['c-1'].element.innerText.trim()).toEqual('1');
                expect(cmp.events['c-2'].totalTime).toEqual(4100);
                expect(cmp.events['c-2'].element.innerText.trim()).toEqual('2');
                expect(cmp.events['c-3'].totalTime).toEqual(4100);
                expect(cmp.events['c-3'].element.innerText.trim()).toEqual('3');
            }));
        });
        describe('animation control flags', function () {
            describe('[@.disabled]', function () {
                it('should disable child animations when set to true', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = false;
                            this.disableExp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n              <div [@.disabled]=\"disableExp\">\n                <div [@myAnimation]=\"exp\"></div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => 1, * => 2', [
                                        animations_1.animate(1234, animations_1.style({ width: '100px' })),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                    expect(players[0].totalTime).toEqual(1234);
                });
                it('should not disable animations for the element that they are disabled on', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = false;
                            this.disableExp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n              <div [@.disabled]=\"disableExp\" [@myAnimation]=\"exp\"></div>\n            ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => 1, * => 2', [
                                        animations_1.animate(1234, animations_1.style({ width: '100px' })),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(1);
                    expect(players[0].totalTime).toEqual(1234);
                    resetLog();
                    cmp.disableExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                    expect(players[0].totalTime).toEqual(1234);
                });
                it('should respect inner disabled nodes once a parent becomes enabled', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.disableParentExp = false;
                            this.disableChildExp = false;
                            this.exp = '';
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n              <div [@.disabled]=\"disableParentExp\">\n                <div [@.disabled]=\"disableChildExp\">\n                  <div [@myAnimation]=\"exp\"></div>\n                </div>\n              </div>\n            ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => 1, * => 2, * => 3', [animations_1.animate(1234, animations_1.style({ width: '100px' }))])])]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableParentExp = true;
                    cmp.disableChildExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableParentExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableChildExp = false;
                    cmp.exp = '3';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                });
                it('should properly handle dom operations when disabled', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.disableExp = false;
                            this.exp = false;
                        }
                        return Cmp;
                    }());
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parentElm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n              <div [@.disabled]=\"disableExp\" #parent>\n                <div *ngIf=\"exp\" @myAnimation></div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1234, animations_1.style({ opacity: 1 })),
                                    ]),
                                    animations_1.transition(':leave', [
                                        animations_1.animate(1234, animations_1.style({ opacity: 0 })),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    var parent = cmp.parentElm.nativeElement;
                    cmp.exp = true;
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    expect(parent.childElementCount).toEqual(1);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    expect(parent.childElementCount).toEqual(0);
                });
                it('should properly resolve animation event listeners when disabled', testing_2.fakeAsync(function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.disableExp = false;
                            this.exp = '';
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n              <div [@.disabled]=\"disableExp\">\n                <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"startEvent=$event\" (@myAnimation.done)=\"doneEvent=$event\"></div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => 1, * => 2', [animations_1.style({ opacity: 0 }), animations_1.animate(9876, animations_1.style({ opacity: 1 }))]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    expect(cmp.startEvent).toBeFalsy();
                    expect(cmp.doneEvent).toBeFalsy();
                    cmp.exp = '1';
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    expect(cmp.startEvent.totalTime).toEqual(0);
                    expect(cmp.doneEvent.totalTime).toEqual(0);
                    cmp.exp = '2';
                    cmp.disableExp = false;
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    expect(cmp.startEvent.totalTime).toEqual(9876);
                    // the done event isn't fired because it's an actual animation
                }));
                it('should work when there are no animations on the component handling the disable/enable flag', function () {
                    var ParentCmp = (function () {
                        function ParentCmp() {
                            this.child = null;
                            this.disableExp = false;
                        }
                        return ParentCmp;
                    }());
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", ChildCmp)
                    ], ParentCmp.prototype, "child", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            template: "\n              <div [@.disabled]=\"disableExp\">\n                <child-cmp #child></child-cmp>\n              </div>\n                "
                        })
                    ], ParentCmp);
                    var ChildCmp = (function () {
                        function ChildCmp() {
                            this.exp = '';
                        }
                        return ChildCmp;
                    }());
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: "\n                <div [@myAnimation]=\"exp\"></div>\n                ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go, * => goAgain', [animations_1.style({ opacity: 0 }), animations_1.animate('1s', animations_1.style({ opacity: 1 }))])])]
                        })
                    ], ChildCmp);
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    var child = cmp.child;
                    child.exp = 'go';
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    resetLog();
                    cmp.disableExp = false;
                    child.exp = 'goAgain';
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(1);
                });
            });
        });
        describe('animation normalization', function () {
            it('should convert hyphenated properties to camelcase by default', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'cmp',
                        template: "\n               <div [@myAnimation]=\"exp\"></div>\n             ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ 'background-color': 'red', height: '100px', fontSize: '100px' }),
                                    animations_1.animate('1s', animations_1.style({ 'background-color': 'blue', height: '200px', fontSize: '200px' })),
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].keyframes).toEqual([
                    { backgroundColor: 'red', height: '100px', fontSize: '100px', offset: 0 },
                    { backgroundColor: 'blue', height: '200px', fontSize: '200px', offset: 1 },
                ]);
            });
            it('should convert hyphenated properties to camelcase by default that are auto/pre style properties', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'cmp',
                        template: "\n               <div [@myAnimation]=\"exp\"></div>\n             ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ 'background-color': animations_1.AUTO_STYLE, 'font-size': '100px' }),
                                    animations_1.animate('1s', animations_1.style({ 'background-color': 'blue', 'font-size': animations_1.ɵPRE_STYLE })),
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].keyframes).toEqual([
                    { backgroundColor: animations_1.AUTO_STYLE, fontSize: '100px', offset: 0 },
                    { backgroundColor: 'blue', fontSize: animations_1.ɵPRE_STYLE, offset: 1 },
                ]);
            });
        });
        it('should throw neither state() or transition() are used inside of trigger()', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.exp = false;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'if-cmp',
                    template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                    animations: [animations_1.trigger('myAnimation', [animations_1.animate(1000, animations_1.style({ width: '100px' }))])]
                })
            ], Cmp);
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            expect(function () { testing_2.TestBed.createComponent(Cmp); })
                .toThrowError(/only state\(\) and transition\(\) definitions can sit inside of a trigger\(\)/);
        });
        it('should combine multiple errors together into one exception when an animation fails to be built', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.fooExp = false;
                    this.barExp = false;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'if-cmp',
                    template: "\n          <div [@foo]=\"fooExp\" [@bar]=\"barExp\"></div>\n        ",
                    animations: [
                        animations_1.trigger('foo', [
                            animations_1.transition(':enter', []),
                            animations_1.transition('* => *', [
                                animations_1.query('foo', animations_1.animate(1000, animations_1.style({ background: 'red' }))),
                            ]),
                        ]),
                        animations_1.trigger('bar', [
                            animations_1.transition(':enter', []),
                            animations_1.transition('* => *', [
                                animations_1.query('bar', animations_1.animate(1000, animations_1.style({ background: 'blue' }))),
                            ]),
                        ]),
                    ]
                })
            ], Cmp);
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            fixture.detectChanges();
            cmp.fooExp = 'go';
            cmp.barExp = 'go';
            var errorMsg = '';
            try {
                fixture.detectChanges();
            }
            catch (e) {
                errorMsg = e.message;
            }
            expect(errorMsg).toMatch(/@foo has failed due to:/);
            expect(errorMsg).toMatch(/`query\("foo"\)` returned zero elements/);
            expect(errorMsg).toMatch(/@bar has failed due to:/);
            expect(errorMsg).toMatch(/`query\("bar"\)` returned zero elements/);
        });
        it('should not throw an error if styles overlap in separate transitions', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.exp = false;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'if-cmp',
                    template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                    animations: [
                        animations_1.trigger('myAnimation', [
                            animations_1.transition('void => *', [
                                animations_1.style({ opacity: 0 }),
                                animations_1.animate('0.5s 1s', animations_1.style({ opacity: 1 })),
                            ]),
                            animations_1.transition('* => void', [animations_1.animate(1000, animations_1.style({ height: 0 })), animations_1.animate(1000, animations_1.style({ opacity: 0 }))]),
                        ]),
                    ]
                })
            ], Cmp);
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            expect(function () { testing_2.TestBed.createComponent(Cmp); }).not.toThrowError();
        });
        describe('errors for not using the animation module', function () {
            beforeEach(function () {
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: core_1.RendererFactory2, useExisting: platform_browser_1.ɵDomRendererFactory2 }],
                });
            });
            it('should throw when using an @prop binding without the animation module', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({ template: "<div [@myAnimation]=\"true\"></div>" })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var comp = testing_2.TestBed.createComponent(Cmp);
                expect(function () { return comp.detectChanges(); })
                    .toThrowError('Found the synthetic property @myAnimation. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.');
            });
            it('should throw when using an @prop listener without the animation module', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({ template: "<div (@myAnimation.start)=\"a = true\"></div>" })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                expect(function () { return testing_2.TestBed.createComponent(Cmp); })
                    .toThrowError('Found the synthetic listener @myAnimation.start. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.');
            });
        });
    });
}
exports.main = main;
function assertHasParent(element, yes) {
    var parent = dom_adapter_1.getDOM().parentElement(element);
    if (yes) {
        expect(parent).toBeTruthy();
    }
    else {
        expect(parent).toBeFalsy();
    }
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQTZMO0FBQzdMLHVEQUFvRztBQUNwRywrREFBNkY7QUFDN0Ysc0NBQW1IO0FBQ25ILDhEQUErRDtBQUMvRCxtRUFBNkU7QUFDN0UsNkVBQXFFO0FBRXJFLHlDQUFrRTtBQUVsRSxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQztJQUNFLGlFQUFpRTtJQUNqRSxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxXQUFXLENBQUM7UUFBQyxNQUFNLENBQUM7SUFFMUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCO1lBQ0UsTUFBTSxDQUFDLDZCQUFtQixDQUFDLEdBQTRCLENBQUM7UUFDMUQsQ0FBQztRQUVELHNCQUFzQiw2QkFBbUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyRCxVQUFVLENBQUM7WUFDVCxRQUFRLEVBQUUsQ0FBQztZQUNYLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDLENBQUM7Z0JBQ3RFLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLEVBQUUsQ0FBQyw4RUFBOEUsRUFDOUUsbUJBQVMsQ0FBQztnQkFVUixJQUFNLEdBQUc7b0JBVFQ7d0JBVUUsUUFB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