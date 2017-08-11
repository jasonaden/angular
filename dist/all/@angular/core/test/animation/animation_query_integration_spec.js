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
var shared_1 = require("@angular/animations/browser/src/render/shared");
var util_1 = require("@angular/animations/browser/src/util");
var testing_1 = require("@angular/animations/browser/testing");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var directives_1 = require("../../src/metadata/directives");
var testing_2 = require("../../testing");
var fake_async_1 = require("../../testing/src/fake_async");
function main() {
    // these tests are only mean't to be run within the DOM (for now)
    if (typeof Element == 'undefined')
        return;
    describe('animation query tests', function () {
        function getLog() {
            return testing_1.MockAnimationDriver.log;
        }
        function resetLog() { testing_1.MockAnimationDriver.log = []; }
        beforeEach(function () {
            resetLog();
            testing_2.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }],
                imports: [animations_2.BrowserAnimationsModule, common_1.CommonModule]
            });
        });
        describe('query()', function () {
            it('should be able to query all elements that contain animation triggers via @*', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"a\" [@a]=\"exp1\"></div>\n              <div class=\"b\" [@b]=\"exp2\"></div>\n              <section>\n                <div class=\"c\" @c></div>\n              </section>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition('* => go', [
                                    animations_1.query('@*', [
                                        animations_1.style({ backgroundColor: 'blue' }),
                                        animations_1.animate(1000, animations_1.style({ backgroundColor: 'red' })),
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('a', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ]),
                            ]),
                            animations_1.trigger('b', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                    animations_1.query('.b-inner', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('c', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp0 = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3); // a,b,c
                resetLog();
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('a')).toBeTruthy();
                expect(p2.element.classList.contains('b')).toBeTruthy();
                expect(p3.element.classList.contains('c')).toBeTruthy();
            });
            it('should be able to query currently animating elements via :animating', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"a\" [@a]=\"exp1\"></div>\n              <div class=\"b\" [@b]=\"exp2\">\n                <div class=\"b-inner\"></div>\n              </div>\n              <div class=\"c\" [@c]=\"exp3\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition('* => go', [
                                    animations_1.query(':animating', [
                                        animations_1.style({ backgroundColor: 'blue' }),
                                        animations_1.animate(1000, animations_1.style({ backgroundColor: 'red' })),
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('a', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ]),
                            ]),
                            animations_1.trigger('b', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                    animations_1.query('.b-inner', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('c', [
                                animations_1.transition('* => 1', [
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp0 = '';
                cmp.exp1 = 1;
                cmp.exp2 = 1;
                // note that exp3 is skipped here
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3); // a,b,b-inner and not c
                resetLog();
                cmp.exp0 = 'go';
                fixture.detectChanges();
                var expectedKeyframes = [
                    { backgroundColor: 'blue', offset: 0 },
                    { backgroundColor: 'red', offset: 1 },
                ];
                players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('a')).toBeTruthy();
                expect(p1.keyframes).toEqual(expectedKeyframes);
                expect(p2.element.classList.contains('b')).toBeTruthy();
                expect(p2.keyframes).toEqual(expectedKeyframes);
                expect(p3.element.classList.contains('b-inner')).toBeTruthy();
                expect(p3.keyframes).toEqual(expectedKeyframes);
            });
            it('should be able to query triggers directly by name', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp0\">\n              <div class=\"f1\" @foo></div>\n              <div class=\"f2\" [@foo]></div>\n              <div class=\"f3\" [@foo]=\"exp1\"></div>\n              <div class=\"b1\" @bar></div>\n              <div class=\"b2\" [@bar]></div>\n              <div class=\"b3\" [@bar]=\"exp2\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('foo', []),
                            animations_1.trigger('bar', []),
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => foo', [
                                    animations_1.query('@foo', [
                                        animations_1.animate(1000, animations_1.style({ color: 'red' })),
                                    ]),
                                ]),
                                animations_1.transition('* => bar', [
                                    animations_1.query('@bar', [
                                        animations_1.animate(1000, animations_1.style({ color: 'blue' })),
                                    ]),
                                ])
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp0 = 'foo';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                resetLog();
                expect(p1.element.classList.contains('f1')).toBeTruthy();
                expect(p2.element.classList.contains('f2')).toBeTruthy();
                expect(p3.element.classList.contains('f3')).toBeTruthy();
                cmp.exp0 = 'bar';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                var p4 = players[0], p5 = players[1], p6 = players[2];
                resetLog();
                expect(p4.element.classList.contains('b1')).toBeTruthy();
                expect(p5.element.classList.contains('b2')).toBeTruthy();
                expect(p6.element.classList.contains('b3')).toBeTruthy();
            });
            it('should be able to query all active animations using :animating in a query', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" #parent>\n              <div *ngFor=\"let item of items\" class=\"item e-{{ item }}\">\n              </div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => a', [
                                    animations_1.query('.item:nth-child(odd)', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                                animations_1.transition('* => b', [
                                    animations_1.query('.item:animating', [
                                        animations_1.style({ opacity: 1 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                    ]),
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.classList.contains('e-0')).toBeTruthy();
                expect(players[1].element.classList.contains('e-2')).toBeTruthy();
                expect(players[2].element.classList.contains('e-4')).toBeTruthy();
            });
            it('should be able to query all actively queued animation triggers via `@*:animating`', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"c1\" [@child]=\"exp1\"></div>\n              <div class=\"c2\" [@child]=\"exp2\"></div>\n              <div class=\"c3\" [@child]=\"exp3\"></div>\n              <div class=\"c4\" [@child]=\"exp4\"></div>\n              <div class=\"c5\" [@child]=\"exp5\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition('* => *', [
                                    animations_1.query('@*:animating', [animations_1.animate(1000, animations_1.style({ background: 'red' }))], { optional: true }),
                                ]),
                            ]),
                            animations_1.trigger('child', [
                                animations_1.transition('* => *', []),
                            ])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp0 = 0;
                cmp.exp1 = 0;
                cmp.exp2 = 0;
                cmp.exp3 = 0;
                cmp.exp4 = 0;
                cmp.exp5 = 0;
                fixture.detectChanges();
                engine.flush();
                var players = engine.players;
                cancelAllPlayers(players);
                cmp.exp0 = 1;
                cmp.exp2 = 1;
                cmp.exp4 = 1;
                fixture.detectChanges();
                engine.flush();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(3);
                cmp.exp0 = 2;
                cmp.exp1 = 2;
                cmp.exp2 = 2;
                cmp.exp3 = 2;
                cmp.exp4 = 2;
                cmp.exp5 = 2;
                fixture.detectChanges();
                engine.flush();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(6);
                cmp.exp0 = 3;
                fixture.detectChanges();
                engine.flush();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(1);
            });
            it('should collect styles for the same elements between queries', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\">\n              <header></header> \n              <footer></footer> \n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query(':self, header, footer', animations_1.style({ opacity: '0.01' })),
                                    animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                    animations_1.query('header, footer', [
                                        animations_1.stagger(500, [
                                            animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                        ])
                                    ])
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
                var players = getLog();
                expect(players.length).toEqual(6);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4], p6 = players[5];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(0);
                expect(p1.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(0);
                expect(p2.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p3.delay).toEqual(0);
                expect(p3.duration).toEqual(0);
                expect(p3.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p4.delay).toEqual(0);
                expect(p4.duration).toEqual(1000);
                expect(p4.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
                expect(p5.delay).toEqual(1000);
                expect(p5.duration).toEqual(1000);
                expect(p5.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
                expect(p6.delay).toEqual(1500);
                expect(p6.duration).toEqual(1000);
                expect(p6.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
            });
            it('should retain style values when :self is used inside of a query', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go', [
                                    animations_1.query(':self', animations_1.style({ opacity: '0.5' })),
                                    animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                ])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(0);
                expect(p1.keyframes).toEqual([{ opacity: '0.5', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(1000);
                expect(p2.keyframes).toEqual([{ opacity: '0.5', offset: 0 }, { opacity: '1', offset: 1 }]);
            });
            it('should properly apply stagger after various other steps within a query', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\">\n              <header></header> \n              <footer></footer> \n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query(':self, header, footer', [
                                        animations_1.style({ opacity: '0' }),
                                        animations_1.animate(1000, animations_1.style({ opacity: '0.3' })),
                                        animations_1.animate(1000, animations_1.style({ opacity: '0.6' })),
                                        animations_1.stagger(500, [
                                            animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                        ])
                                    ])
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
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(3000);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(3500);
                expect(p3.delay).toEqual(0);
                expect(p3.duration).toEqual(4000);
            });
            it('should properly apply pre styling before a stagger is issued', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"item\">\n              {{ item }} \n            </div> \n          </div> \n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.stagger(100, [
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                    ]),
                                ]),
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
                var players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var kf = player.keyframes;
                    var limit = kf.length - 1;
                    var staggerDelay = 100 * i;
                    var duration = 1000 + staggerDelay;
                    expect(kf[0]).toEqual({ opacity: '0', offset: 0 });
                    if (limit > 1) {
                        var offsetAtStaggerDelay = staggerDelay / duration;
                        expect(kf[1]).toEqual({ opacity: '0', offset: offsetAtStaggerDelay });
                    }
                    expect(kf[limit]).toEqual({ opacity: '1', offset: 1 });
                    expect(player.duration).toEqual(duration);
                }
            });
            it('should apply a full stagger step delay if the timing data is left undefined', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"item\">\n              {{ item }} \n            </div> \n          </div> \n        ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go', [animations_1.query('.item', [animations_1.stagger('full', [
                                            animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                                            animations_1.animate(500, animations_1.style({ opacity: 1 }))
                                        ])])])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4];
                expect(p1.delay).toEqual(0);
                expect(p2.delay).toEqual(1500);
                expect(p3.delay).toEqual(3000);
                expect(p4.delay).toEqual(4500);
                expect(p5.delay).toEqual(6000);
            });
            it('should persist inner sub trigger styles once their animation is complete', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div @parent *ngIf=\"exp1\">\n              <div class=\"child\" [@child]=\"exp2\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [
                                animations_1.transition(':enter', [
                                    animations_1.query('.child', [
                                        animations_1.animateChild(),
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('child', [
                                animations_1.state('*, void', animations_1.style({ height: '0px' })),
                                animations_1.state('b', animations_1.style({ height: '444px' })),
                                animations_1.transition('* => *', animations_1.animate(500)),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                expect(player.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '444px', offset: 1 }
                ]);
                player.finish();
                expect(player.element.style.height).toEqual('444px');
            });
            it('should find newly inserted items in the component via :enter', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div @myAnimation>\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition(':enter', [
                                    animations_1.query(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                                    ]),
                                ]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.innerText.trim()).toEqual('0');
                expect(p2.element.innerText.trim()).toEqual('1');
                expect(p3.element.innerText.trim()).toEqual('2');
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([{ opacity: '0', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                });
            });
            it('should cleanup :enter and :leave artifacts from nodes when any animation sequences fail to be built', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('container'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "container", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"items.length\" class=\"parent\" #container>\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n              <div *ngIf=\"items.length == 0\" class=\"child\">Leave!</div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => 0', []),
                                animations_1.transition('* => *', [
                                    animations_1.query('.child:enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    ]),
                                    animations_1.query('.incorrect-child:leave', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                    ]),
                                ]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [];
                fixture.detectChanges();
                cmp.items = [0, 1, 2, 3, 4];
                expect(function () { fixture.detectChanges(); }).toThrow();
                var children = cmp.container.nativeElement.querySelectorAll('.child');
                expect(children.length).toEqual(5);
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    expect(child.classList.contains(util_1.ENTER_CLASSNAME)).toBe(false);
                    expect(child.classList.contains(util_1.LEAVE_CLASSNAME)).toBe(false);
                }
            });
            it('should find elements that have been removed via :leave', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [4, 2, 0];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('a => b', [animations_1.query(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: .5 }))])]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'b';
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.innerText.trim()).toEqual('4');
                expect(p2.element.innerText.trim()).toEqual('2');
                expect(p3.element.innerText.trim()).toEqual('0');
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([{ opacity: '1', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                });
            });
            it('should find :enter nodes that have been inserted around non enter nodes', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'no';
                cmp.items = [2];
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'go';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(4);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3];
                expect(p1.element.innerText.trim()).toEqual('0');
                expect(p2.element.innerText.trim()).toEqual('1');
                expect(p3.element.innerText.trim()).toEqual('3');
                expect(p4.element.innerText.trim()).toEqual('4');
            });
            it('should find :enter/:leave nodes that are nested inside of ng-container elements', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"items.length\" class=\"parent\">\n              <ng-container *ngFor=\"let item of items\">\n                <section>\n                  <div *ngIf=\"item % 2 == 0\">even {{ item }}</div>\n                  <div *ngIf=\"item % 2 == 1\">odd {{ item }}</div>\n                </section>\n              </ng-container>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('0 => 5', [
                                    animations_1.query(':enter', [
                                        animations_1.style({ opacity: '0' }),
                                        animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                    ])
                                ]),
                                animations_1.transition('5 => 0', [
                                    animations_1.query(':leave', [
                                        animations_1.style({ opacity: '1' }),
                                        animations_1.animate(1000, animations_1.style({ opacity: '0' }))
                                    ])
                                ]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var player = players[i];
                    expect(player.keyframes).toEqual([
                        { opacity: '0', offset: 0 },
                        { opacity: '1', offset: 1 },
                    ]);
                    var elm = player.element;
                    var text = i % 2 == 0 ? "even " + i : "odd " + i;
                    expect(elm.innerText.trim()).toEqual(text);
                }
                resetLog();
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var player = players[i];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    var elm = player.element;
                    var text = i % 2 == 0 ? "even " + i : "odd " + i;
                    expect(elm.innerText.trim()).toEqual(text);
                }
            });
            it('should properly cancel items that were queried into a former animation and pass in the associated styles into the follow-up players per element', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('* => on', [
                                    animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    animations_1.query(':enter', [animations_1.style({ width: 0 }), animations_1.animate(1000, animations_1.style({ height: 200 }))])
                                ]),
                                animations_1.transition('* => off', [
                                    animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ width: 0 }))]),
                                    animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])
                                ]),
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var previousPlayers = getLog();
                expect(previousPlayers.length).toEqual(10);
                resetLog();
                cmp.exp = 'off';
                cmp.items = [0, 1, 2];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(4);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3];
                // p1 && p2 are the starting players for item3 and item4
                expect(p1.previousStyles)
                    .toEqual({ opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE });
                expect(p2.previousStyles)
                    .toEqual({ opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE });
                // p3 && p4 are the following players for item3 and item4
                expect(p3.previousStyles).toEqual({});
                expect(p4.previousStyles).toEqual({});
            });
            it('should not remove a parent container if its contents are queried into by an ancestor element', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp1 = '';
                        this.exp2 = true;
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('ancestor'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "ancestorElm", void 0);
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "parentElm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp1\" class=\"ancestor\" #ancestor>\n              <div class=\"parent\" *ngIf=\"exp2\" #parent>\n                <div class=\"child\"></div>\n                <div class=\"child\"></div>\n              </div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query('.child', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    ]),
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
                engine.flush();
                resetLog();
                var ancestorElm = cmp.ancestorElm.nativeElement;
                var parentElm = cmp.parentElm.nativeElement;
                cmp.exp1 = 'go';
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(ancestorElm.contains(parentElm)).toBe(true);
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(parentElm.contains(p1.element)).toBe(true);
                expect(parentElm.contains(p2.element)).toBe(true);
                cancelAllPlayers(players);
                expect(ancestorElm.contains(parentElm)).toBe(false);
            });
            it('should only retain a to-be-removed node if the inner queried items are apart of an animation issued by an ancestor', fake_async_1.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp1 = '';
                        this.exp2 = '';
                        this.parentExp = true;
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('ancestor'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "ancestorElm", void 0);
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "parentElm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@one]=\"exp1\" [@two]=\"exp2\" class=\"ancestor\" #ancestor>\n              <header>hello</header>\n              <div class=\"parent\" *ngIf=\"parentExp\" #parent>\n                <div class=\"child\">child</div>\n              </div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('one', [
                                animations_1.transition('* => go', [
                                    animations_1.query('.child', [
                                        animations_1.style({ height: '100px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '0px' })),
                                    ]),
                                ]),
                            ]),
                            animations_1.trigger('two', [
                                animations_1.transition('* => go', [animations_1.query('header', [
                                        animations_1.style({ width: '100px' }),
                                        animations_1.animate(1000, animations_1.style({ width: '0px' })),
                                    ])]),
                            ]),
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var ancestorElm = cmp.ancestorElm.nativeElement;
                var parentElm = cmp.parentElm.nativeElement;
                expect(ancestorElm.contains(parentElm)).toBe(true);
                cmp.exp1 = 'go';
                fixture.detectChanges();
                engine.flush();
                expect(ancestorElm.contains(parentElm)).toBe(true);
                var onePlayers = getLog();
                expect(onePlayers.length).toEqual(1); // element.child
                var childPlayer = onePlayers[0];
                var childPlayerComplete = false;
                childPlayer.onDone(function () { return childPlayerComplete = true; });
                resetLog();
                fake_async_1.flushMicrotasks();
                expect(childPlayerComplete).toBe(false);
                cmp.exp2 = 'go';
                cmp.parentExp = false;
                fixture.detectChanges();
                engine.flush();
                var twoPlayers = getLog();
                expect(twoPlayers.length).toEqual(1); // the header element
                expect(ancestorElm.contains(parentElm)).toBe(false);
                expect(childPlayerComplete).toBe(true);
            }));
            it('should finish queried players in an animation when the next animation takes over', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('* => on', [
                                    animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                ]),
                                animations_1.transition('* => off', [])
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                cmp.exp = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
            });
            it('should finish queried players when the previous player is finished', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [
                                animations_1.transition('* => on', [
                                    animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                ]),
                                animations_1.transition('* => off', [])
                            ])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                expect(engine.players.length).toEqual(1);
                engine.players[0].finish();
                expect(count).toEqual(5);
            });
            it('should allow multiple triggers to animate on queried elements at the same time', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@one]=\"exp1\" [@two]=\"exp2\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [
                            animations_1.trigger('one', [
                                animations_1.transition('* => on', [
                                    animations_1.query('.child', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ width: '100px' }))
                                    ])
                                ]),
                                animations_1.transition('* => off', [])
                            ]),
                            animations_1.trigger('two', [
                                animations_1.transition('* => on', [
                                    animations_1.query('.child:nth-child(odd)', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '100px' }))
                                    ])
                                ]),
                                animations_1.transition('* => off', [])
                            ])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                resetLog();
                expect(count).toEqual(0);
                cmp.exp2 = 'on';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(0);
                players = getLog();
                expect(players.length).toEqual(3);
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                cmp.exp1 = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
                cmp.exp2 = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(8);
            });
            it('should cancel inner queried animations if a trigger state value changes, but isn\'t detected as a valid transition', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [
                                    animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                ])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                cmp.exp = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
            });
            it('should allow for queried items to restore their styling back to the original state via animate(time, "*")', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }} \n              </div> \n            </div>\n          ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('* => on', [
                                    animations_1.query(':enter', [
                                        animations_1.style({ opacity: '0', width: '0px', height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                        animations_1.animate(1000, animations_1.style(['*', { height: '200px' }]))
                                    ])
                                ])
                            ])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([
                        { opacity: '0', width: '0px', height: '0px', offset: 0 },
                        { opacity: '1', width: '0px', height: '0px', offset: .5 },
                        { opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: '200px', offset: 1 }
                    ]);
                });
            });
            it('should query elements in sub components that do not contain animations using the :enter selector', function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "child", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\">\n              <child-cmp #child></child-cmp>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])])]
                    })
                ], ParentCmp);
                var ChildCmp = (function () {
                    function ChildCmp() {
                        this.items = [];
                    }
                    return ChildCmp;
                }());
                ChildCmp = __decorate([
                    core_1.Component({
                        selector: 'child-cmp',
                        template: "\n            <div *ngFor=\"let item of items\">\n              {{ item }}\n            </div>\n          "
                    })
                ], ChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                cmp.exp = 'on';
                cmp.child.items = [1, 2, 3];
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.innerText.trim()).toEqual('1');
                expect(players[1].element.innerText.trim()).toEqual('2');
                expect(players[2].element.innerText.trim()).toEqual('3');
            });
            it('should query elements in sub components that do not contain animations using the :leave selector', function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "child", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        template: "\n            <div [@myAnimation]=\"exp\">\n              <child-cmp #child></child-cmp>\n            </div>\n          ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])])]
                    })
                ], ParentCmp);
                var ChildCmp = (function () {
                    function ChildCmp() {
                        this.items = [];
                    }
                    return ChildCmp;
                }());
                ChildCmp = __decorate([
                    core_1.Component({
                        selector: 'child-cmp',
                        template: "\n            <div *ngFor=\"let item of items\">\n              {{ item }}\n            </div>\n          "
                    })
                ], ChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                cmp.child.items = [4, 5, 6];
                fixture.detectChanges();
                cmp.exp = 'on';
                cmp.child.items = [];
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.innerText.trim()).toEqual('4');
                expect(players[1].element.innerText.trim()).toEqual('5');
                expect(players[2].element.innerText.trim()).toEqual('6');
            });
        });
        describe('sub triggers', function () {
            it('should animate a sub trigger that exists in an inner element in the template', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm1", void 0);
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm2", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div #child class=\"child\" [@child]=\"exp2\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [animations_1.transition('* => go1', [
                                    animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' })),
                                    animations_1.query('.child', [animations_1.animateChild()])
                                ])]),
                            animations_1.trigger('child', [animations_1.transition('* => go2', [
                                    animations_1.style({ height: '0px' }),
                                    animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                ])])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go1';
                cmp.exp2 = 'go2';
                fixture.detectChanges();
                engine.flush();
                var elm1 = cmp.elm1;
                var elm2 = cmp.elm2;
                var _a = getLog(), p1 = _a[0], p2 = _a[1];
                expect(p1.delay).toEqual(0);
                expect(p1.element).toEqual(elm1.nativeElement);
                expect(p1.duration).toEqual(1000);
                expect(p1.keyframes).toEqual([{ width: '0px', offset: 0 }, { width: '100px', offset: 1 }]);
                expect(p2.delay).toEqual(0);
                expect(p2.element).toEqual(elm2.nativeElement);
                expect(p2.duration).toEqual(2000);
                expect(p2.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '0px', offset: .5 }, { height: '100px', offset: 1 }
                ]);
            });
            it('should run and operate a series of triggers on a list of elements with overridden timing data', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp\">\n              <div class=\"item\" *ngFor=\"let item of items\" @child></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [animations_1.transition('* => go', [
                                    animations_1.style({ opacity: '0' }), animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                    animations_1.query('.item', [animations_1.animateChild({ duration: '2.5s', delay: '500ms' })]),
                                    animations_1.animate(1000, animations_1.style({ opacity: '0' }))
                                ])]),
                            animations_1.trigger('child', [animations_1.transition(':enter', [
                                    animations_1.style({ height: '0px' }),
                                    animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                ])])
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
                var parent = cmp.elm.nativeElement;
                var elements = parent.querySelectorAll('.item');
                var players = getLog();
                expect(players.length).toEqual(7);
                var pA = players[0], pc1 = players[1], pc2 = players[2], pc3 = players[3], pc4 = players[4], pc5 = players[5], pZ = players[6];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pc1.element).toEqual(elements[0]);
                expect(pc1.delay).toEqual(0);
                expect(pc1.duration).toEqual(4000);
                expect(pc2.element).toEqual(elements[1]);
                expect(pc2.delay).toEqual(0);
                expect(pc2.duration).toEqual(4000);
                expect(pc3.element).toEqual(elements[2]);
                expect(pc3.delay).toEqual(0);
                expect(pc3.duration).toEqual(4000);
                expect(pc4.element).toEqual(elements[3]);
                expect(pc4.delay).toEqual(0);
                expect(pc4.duration).toEqual(4000);
                expect(pc5.element).toEqual(elements[4]);
                expect(pc5.delay).toEqual(0);
                expect(pc5.duration).toEqual(4000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(4000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should silently continue if a sub trigger is animated that doesn\'t exist', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp\">\n              <div class=\"child\"></div>\n            </div>\n          ",
                        animations: [animations_1.trigger('parent', [animations_1.transition('* => go', [
                                    animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('.child', [animations_1.animateChild({ duration: '1s' })]),
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ])])]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var parent = cmp.elm.nativeElement;
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should silently continue if a sub trigger is animated that doesn\'t contain a trigger that is setup for animation', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@child]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('child', [animations_1.transition('a => z', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                            animations_1.trigger('parent', [animations_1.transition('a => z', [
                                    animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('.child', [animations_1.animateChild({ duration: '1s' })]),
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ])])
                        ]
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp1 = 'z';
                fixture.detectChanges();
                engine.flush();
                var parent = cmp.elm.nativeElement;
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should animate all sub triggers on the element at the same time', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@w]=\"exp2\" [@h]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('w', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ width: 0 }),
                                    animations_1.animate(1800, animations_1.style({ width: '100px' }))
                                ])
                            ]),
                            animations_1.trigger('h', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ height: 0 }),
                                    animations_1.animate(1500, animations_1.style({ height: '100px' }))
                                ])
                            ]),
                            animations_1.trigger('parent', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('.child', [
                                        animations_1.animateChild()
                                    ]),
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ])
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
                var players = getLog();
                expect(players.length).toEqual(4);
                var pA = players[0], pc1 = players[1], pc2 = players[2], pZ = players[3];
                expect(pc1.delay).toEqual(0);
                expect(pc1.duration).toEqual(2800);
                expect(pc2.delay).toEqual(0);
                expect(pc2.duration).toEqual(2500);
                expect(pZ.delay).toEqual(2800);
                expect(pZ.duration).toEqual(1000);
            });
            it('should skip a sub animation when a zero duration value is passed in', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@child]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('child', [animations_1.transition('* => go', [animations_1.style({ width: 0 }), animations_1.animate(1800, animations_1.style({ width: '100px' }))])]),
                            animations_1.trigger('parent', [animations_1.transition('* => go', [
                                    animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('.child', [animations_1.animateChild({ duration: '0' })]),
                                    animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                ])])
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
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should only allow a sub animation to be used up by a parent trigger once', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('parent'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div [@parent]=\"exp1\" class=\"parent1\" #parent>\n              <div [@parent]=\"exp1\" class=\"parent2\">\n                <div [@child]=\"exp2\" class=\"child\">\n                </div>\n              </div>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('parent', [animations_1.transition('* => go', [
                                    animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('.child', animations_1.animateChild())
                                ])]),
                            animations_1.trigger('child', [animations_1.transition('* => go', [animations_1.style({ opacity: 0 }), animations_1.animate(1800, animations_1.style({ opacity: 1 }))])])
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
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                // parent2 is evaluated first because it is inside of parent1
                expect(p1.element.classList.contains('parent2')).toBeTruthy();
                expect(p2.element.classList.contains('child')).toBeTruthy();
                expect(p3.element.classList.contains('parent1')).toBeTruthy();
            });
            it('should emulate a leave animation on the nearest sub host elements when a parent is removed', fake_async_1.fakeAsync(function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                        this.exp = true;
                    }
                    ParentCmp.prototype.animateStart = function (event) {
                        if (event.toState == 'void') {
                            this.childEvent = event;
                        }
                    };
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "childElm", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        template: "\n            <div @parent *ngIf=\"exp\" class=\"parent1\" #parent>\n              <child-cmp #child @leave (@leave.start)=\"animateStart($event)\"></child-cmp>\n            </div>\n          ",
                        animations: [
                            animations_1.trigger('leave', [
                                animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ color: 'gold' }))]),
                            ]),
                            animations_1.trigger('parent', [
                                animations_1.transition(':leave', [animations_1.query(':leave', animations_1.animateChild())]),
                            ]),
                        ]
                    })
                ], ParentCmp);
                var ChildCmp = (function () {
                    function ChildCmp() {
                        this.animate = true;
                    }
                    ChildCmp.prototype.animateStart = function (event) {
                        if (event.toState == 'void') {
                            this.childEvent = event;
                        }
                    };
                    return ChildCmp;
                }());
                __decorate([
                    core_1.HostBinding('@child'),
                    __metadata("design:type", Object)
                ], ChildCmp.prototype, "animate", void 0);
                __decorate([
                    directives_1.HostListener('@child.start', ['$event']),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], ChildCmp.prototype, "animateStart", null);
                ChildCmp = __decorate([
                    core_1.Component({
                        selector: 'child-cmp',
                        template: '...',
                        animations: [
                            animations_1.trigger('child', [
                                animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ color: 'gold' }))]),
                            ]),
                        ]
                    })
                ], ChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                var childCmp = cmp.childElm;
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                fake_async_1.flushMicrotasks();
                expect(cmp.childEvent.toState).toEqual('void');
                expect(cmp.childEvent.totalTime).toEqual(1000);
                expect(childCmp.childEvent.toState).toEqual('void');
                expect(childCmp.childEvent.totalTime).toEqual(1000);
            }));
            it('should only mark outermost *directive nodes :enter and :leave when inserts and removals occur', function () {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        animations: [
                            animations_1.trigger('anim', [
                                animations_1.transition('* => enter', [
                                    animations_1.query(':enter', [animations_1.animate(1000, animations_1.style({ color: 'red' }))]),
                                ]),
                                animations_1.transition('* => leave', [
                                    animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ color: 'blue' }))]),
                                ]),
                            ]),
                        ],
                        template: "\n            <section class=\"container\" [@anim]=\"exp ? 'enter' : 'leave'\">\n              <div class=\"a\" *ngIf=\"exp\">\n                <div class=\"b\" *ngIf=\"exp\">\n                  <div class=\"c\" *ngIf=\"exp\">\n                    text\n                  </div>\n                </div>\n              </div>\n              <div>\n                <div class=\"d\" *ngIf=\"exp\">\n                  text2\n                </div>\n              </div>\n            </section>\n          "
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                var container = fixture.elementRef.nativeElement;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                resetLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.element.classList.contains('a'));
                expect(p2.element.classList.contains('d'));
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                resetLog();
                expect(players.length).toEqual(2);
                var p3 = players[0], p4 = players[1];
                expect(p3.element.classList.contains('a'));
                expect(p4.element.classList.contains('d'));
            });
            it('should collect multiple root levels of :enter and :leave nodes', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.page1 = false;
                        this.page2 = false;
                        this.loading = false;
                    }
                    Object.defineProperty(Cmp.prototype, "title", {
                        get: function () {
                            if (this.page1) {
                                return 'hello from page1';
                            }
                            return 'greetings from page2';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Cmp.prototype, "status", {
                        get: function () {
                            if (this.loading)
                                return 'loading';
                            if (this.page1)
                                return 'page1';
                            if (this.page2)
                                return 'page2';
                            return '';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        animations: [
                            animations_1.trigger('pageAnimation', [
                                animations_1.transition(':enter', []),
                                animations_1.transition('* => *', [
                                    animations_1.query(':leave', [
                                        animations_1.animate('1s', animations_1.style({ opacity: 0 }))
                                    ], { optional: true }),
                                    animations_1.query(':enter', [
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 }))
                                    ], { optional: true })
                                ])
                            ])
                        ],
                        template: "\n            <div [@pageAnimation]=\"status\">\n              <header>\n                <div *ngIf=\"!loading\" class=\"title\">{{ title }}</div>\n                <div *ngIf=\"loading\" class=\"loading\">loading...</div>\n              </header>\n              <section>\n                <div class=\"page\">\n                  <div *ngIf=\"page1\" class=\"page1\">\n                    <div *ngIf=\"true\">page 1</div>\n                  </div>\n                  <div *ngIf=\"page2\" class=\"page2\">\n                    <div *ngIf=\"true\">page 2</div>\n                  </div>\n                </div>\n              </section>\n            </div>  \n          "
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.loading = true;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                resetLog();
                cancelAllPlayers(players);
                cmp.page1 = true;
                cmp.loading = false;
                fixture.detectChanges();
                engine.flush();
                var p1;
                var p2;
                var p3;
                players = getLog();
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('loading')).toBe(true);
                expect(p2.element.classList.contains('title')).toBe(true);
                expect(p3.element.classList.contains('page1')).toBe(true);
                resetLog();
                cancelAllPlayers(players);
                cmp.page1 = false;
                cmp.loading = true;
                fixture.detectChanges();
                players = getLog();
                cancelAllPlayers(players);
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('title')).toBe(true);
                expect(p2.element.classList.contains('page1')).toBe(true);
                expect(p3.element.classList.contains('loading')).toBe(true);
                resetLog();
                cancelAllPlayers(players);
                cmp.page2 = true;
                cmp.loading = false;
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('loading')).toBe(true);
                expect(p2.element.classList.contains('title')).toBe(true);
                expect(p3.element.classList.contains('page2')).toBe(true);
            });
            it('should emulate leave animation callbacks for all sub elements that have leave triggers within the component', fake_async_1.fakeAsync(function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.log = [];
                    }
                    Cmp.prototype.callback = function (event) {
                        this.log.push(event.element.getAttribute('data-name') + '-' + event.phaseName);
                    };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'ani-cmp',
                        animations: [
                            animations_1.trigger('parent', []), animations_1.trigger('child', []),
                            animations_1.trigger('childWithAnimation', [
                                animations_1.transition(':leave', [
                                    animations_1.animate(1000, animations_1.style({ background: 'red' })),
                                ]),
                            ])
                        ],
                        template: "\n            <div data-name=\"p\" class=\"parent\" @parent *ngIf=\"exp\" (@parent.start)=\"callback($event)\" (@parent.done)=\"callback($event)\">\n              <div data-name=\"c1\" @child (@child.start)=\"callback($event)\" (@child.done)=\"callback($event)\"></div>\n              <div data-name=\"c2\" @child (@child.start)=\"callback($event)\" (@child.done)=\"callback($event)\"></div>\n              <div data-name=\"c3\" @childWithAnimation (@childWithAnimation.start)=\"callback($event)\" (@childWithAnimation.done)=\"callback($event)\"></div>\n            </div>\n          "
                    })
                ], Cmp);
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                cmp.log = [];
                cmp.exp = false;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.log).toEqual([
                    'c1-start', 'c1-done', 'c2-start', 'c2-done', 'p-start', 'p-done', 'c3-start',
                    'c3-done'
                ]);
            }));
            it('should build, but not run sub triggers when a parent animation is scheduled', function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "childCmp", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        animations: [animations_1.trigger('parent', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])],
                        template: '<div [@parent]="exp"><child-cmp #child></child-cmp></div>'
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
                        animations: [animations_1.trigger('child', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ color: 'red' }))])])],
                        template: '<div [@child]="exp"></div>'
                    })
                ], ChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var childCmp = cmp.childCmp;
                cmp.exp = 1;
                childCmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                // we have 2 players, but the child is not used even though
                // it is created.
                var players = getLog();
                expect(players.length).toEqual(2);
                expect(engine.players.length).toEqual(1);
                expect(engine.players[0].getRealPlayer()).toBe(players[1]);
            });
            it('should stretch the starting keyframe of a child animation queries are issued by the parent', function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "childCmp", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        animations: [animations_1.trigger('parent', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ color: 'red' })), animations_1.query('@child', animations_1.animateChild())])])],
                        template: '<div [@parent]="exp"><child-cmp #child></child-cmp></div>'
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
                        animations: [animations_1.trigger('child', [animations_1.transition('* => *', [animations_1.style({ color: 'blue' }), animations_1.animate(1000, animations_1.style({ color: 'red' }))])])],
                        template: '<div [@child]="exp" class="child"></div>'
                    })
                ], ChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var childCmp = cmp.childCmp;
                cmp.exp = 1;
                childCmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(1); // child player, parent cover, parent player
                var groupPlayer = engine.players[0].getRealPlayer();
                var childPlayer = groupPlayer.players.find(function (player) {
                    if (player instanceof testing_1.MockAnimationPlayer) {
                        return shared_1.matchesElement(player.element, '.child');
                    }
                    return false;
                });
                var keyframes = childPlayer.keyframes.map(function (kf) {
                    delete kf['offset'];
                    return kf;
                });
                expect(keyframes.length).toEqual(3);
                var k1 = keyframes[0], k2 = keyframes[1], k3 = keyframes[2];
                expect(k1).toEqual(k2);
            });
            it('should allow a parent trigger to control child triggers across multiple template boundaries even if there are no animations in between', function () {
                var ParentCmp = (function () {
                    function ParentCmp() {
                    }
                    return ParentCmp;
                }());
                __decorate([
                    core_1.ViewChild('child'),
                    __metadata("design:type", Object)
                ], ParentCmp.prototype, "innerCmp", void 0);
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        animations: [
                            animations_1.trigger('parentAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.query(':self, @grandChildAnimation', animations_1.style({ opacity: 0 })),
                                    animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    animations_1.query('@grandChildAnimation', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.animateChild(),
                                    ]),
                                ]),
                            ]),
                        ],
                        template: '<div [@parentAnimation]="exp"><child-cmp #child></child-cmp></div>'
                    })
                ], ParentCmp);
                var ChildCmp = (function () {
                    function ChildCmp() {
                    }
                    return ChildCmp;
                }());
                __decorate([
                    core_1.ViewChild('grandchild'),
                    __metadata("design:type", Object)
                ], ChildCmp.prototype, "innerCmp", void 0);
                ChildCmp = __decorate([
                    core_1.Component({ selector: 'child-cmp', template: '<grandchild-cmp #grandchild></grandchild-cmp>' })
                ], ChildCmp);
                var GrandChildCmp = (function () {
                    function GrandChildCmp() {
                    }
                    return GrandChildCmp;
                }());
                GrandChildCmp = __decorate([
                    core_1.Component({
                        selector: 'grandchild-cmp',
                        animations: [
                            animations_1.trigger('grandChildAnimation', [
                                animations_1.transition('* => go', [
                                    animations_1.style({ width: '0px' }),
                                    animations_1.animate(1000, animations_1.style({ width: '200px' })),
                                ]),
                            ]),
                        ],
                        template: '<div [@grandChildAnimation]="exp"></div>'
                    })
                ], GrandChildCmp);
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp, GrandChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var grandChildCmp = cmp.innerCmp.innerCmp;
                cmp.exp = 'go';
                grandChildCmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4];
                expect(p5.keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: .67, width: '0px' }, { offset: 1, width: '200px' }
                ]);
            });
        });
        describe('animation control flags', function () {
            describe('[@.disabled]', function () {
                it('should allow a parent animation to query and animate inner nodes that are in a disabled region', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = '';
                            this.disableExp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'some-cmp',
                            template: "\n              <div [@myAnimation]=\"exp\">\n                <div [@.disabled]=\"disabledExp\">\n                  <div class=\"header\"></div>\n                  <div class=\"footer\"></div>\n                </div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query('.header', animations_1.animate(750, animations_1.style({ opacity: 0 }))),
                                        animations_1.query('.footer', animations_1.animate(250, animations_1.style({ opacity: 0 }))),
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
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(2);
                    var p1 = players[0], p2 = players[1];
                    expect(p1.duration).toEqual(750);
                    expect(p1.element.classList.contains('header'));
                    expect(p2.duration).toEqual(250);
                    expect(p2.element.classList.contains('footer'));
                });
                it('should allow a parent animation to query and animate sub animations that are in a disabled region', function () {
                    var Cmp = (function () {
                        function Cmp() {
                            this.exp = '';
                            this.disableExp = false;
                        }
                        return Cmp;
                    }());
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'some-cmp',
                            template: "\n              <div class=\"parent\" [@parentAnimation]=\"exp\">\n                <div [@.disabled]=\"disabledExp\">\n                  <div class=\"child\" [@childAnimation]=\"exp\"></div>\n                </div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('parentAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query('@childAnimation', animations_1.animateChild()),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                                animations_1.trigger('childAnimation', [
                                    animations_1.transition('* => go', [animations_1.animate(500, animations_1.style({ opacity: 0 }))]),
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
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(2);
                    var p1 = players[0], p2 = players[1];
                    expect(p1.duration).toEqual(500);
                    expect(p1.element.classList.contains('child'));
                    expect(p2.duration).toEqual(1000);
                    expect(p2.element.classList.contains('parent'));
                });
            });
        });
    });
}
exports.main = main;
function cancelAllPlayers(players) {
    players.forEach(function (p) { return p.destroy(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3F1ZXJ5X2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9xdWVyeV9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQXlMO0FBQ3pMLHVEQUE4RTtBQUM5RSx3RUFBNkU7QUFDN0UsNkRBQXNGO0FBQ3RGLCtEQUE2RjtBQUM3RiwwQ0FBNkM7QUFDN0Msc0NBQWdFO0FBQ2hFLG1FQUE2RTtBQUU3RSw0REFBMkQ7QUFDM0QseUNBQXNDO0FBQ3RDLDJEQUF3RTtBQUd4RTtJQUNFLGlFQUFpRTtJQUNqRSxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxXQUFXLENBQUM7UUFBQyxNQUFNLENBQUM7SUFFMUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDO1lBQ0UsTUFBTSxDQUFDLDZCQUFtQixDQUFDLEdBQTRCLENBQUM7UUFDMUQsQ0FBQztRQUVELHNCQUFzQiw2QkFBbUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyRCxVQUFVLENBQUM7WUFDVCxRQUFRLEVBQUUsQ0FBQztZQUNYLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDLENBQUM7Z0JBQ3RFLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixFQUFFLHFCQUFZLENBQUM7YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyw2RUFBNkUsRUFBRTtnQkFxRGhGLElBQU0sR0FBRztvQkFBVDtvQkFJQSxDQUFDO29CQUFELFVBQUM7Z0JB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LE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUN6QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUViLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUN6QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUN6QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMsNkRBQTZELEVBQUU7Z0JB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LENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDN0IsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDMUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDMUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxD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