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
var testing_2 = require("@angular/core/testing");
var animations_2 = require("@angular/platform-browser/animations");
var router_1 = require("@angular/router");
var testing_3 = require("@angular/router/testing");
function main() {
    // these tests are only mean't to be run within the DOM (for now)
    if (typeof Element == 'undefined')
        return;
    describe('Animation Router Tests', function () {
        beforeEach(function () {
            testing_2.TestBed.configureTestingModule({
                imports: [testing_3.RouterTestingModule, animations_2.BrowserAnimationsModule],
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }]
            });
        });
        it('should query the old and new routes via :leave and :enter', testing_2.fakeAsync(function () {
            var ContainerCmp = (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                return ContainerCmp;
            }());
            ContainerCmp = __decorate([
                core_1.Component({
                    animations: [
                        animations_1.trigger('routerAnimations', [
                            animations_1.transition('page1 => page2', [
                                animations_1.query(':leave', animations_1.animateChild()),
                                animations_1.query(':enter', animations_1.animateChild()),
                            ]),
                        ]),
                    ],
                    template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], ContainerCmp);
            var Page1Cmp = (function () {
                function Page1Cmp() {
                    this.doAnimate = true;
                }
                return Page1Cmp;
            }());
            __decorate([
                core_1.HostBinding('@page1Animation'),
                __metadata("design:type", Object)
            ], Page1Cmp.prototype, "doAnimate", void 0);
            Page1Cmp = __decorate([
                core_1.Component({
                    selector: 'page1',
                    template: "page1",
                    animations: [
                        animations_1.trigger('page1Animation', [
                            animations_1.transition(':leave', [
                                animations_1.style({ width: '200px' }),
                                animations_1.animate(1000, animations_1.style({ width: '0px' })),
                            ]),
                        ]),
                    ]
                })
            ], Page1Cmp);
            var Page2Cmp = (function () {
                function Page2Cmp() {
                    this.doAnimate = true;
                }
                return Page2Cmp;
            }());
            __decorate([
                core_1.HostBinding('@page2Animation'),
                __metadata("design:type", Object)
            ], Page2Cmp.prototype, "doAnimate", void 0);
            Page2Cmp = __decorate([
                core_1.Component({
                    selector: 'page2',
                    template: "page2",
                    animations: [
                        animations_1.trigger('page2Animation', [
                            animations_1.transition(':enter', [
                                animations_1.style({ opacity: 0 }),
                                animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                            ]),
                        ]),
                    ]
                })
            ], Page2Cmp);
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.duration).toEqual(1000);
            expect(p1.keyframes).toEqual([
                { offset: 0, width: '200px' },
                { offset: 1, width: '0px' },
            ]);
            expect(p2.duration).toEqual(2000);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: .5, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
        }));
        it('should allow inner enter animations to be emulated within a routed item', testing_2.fakeAsync(function () {
            var ContainerCmp = (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                return ContainerCmp;
            }());
            ContainerCmp = __decorate([
                core_1.Component({
                    animations: [
                        animations_1.trigger('routerAnimations', [
                            animations_1.transition('page1 => page2', [
                                animations_1.query(':enter', animations_1.animateChild()),
                            ]),
                        ]),
                    ],
                    template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], ContainerCmp);
            var Page1Cmp = (function () {
                function Page1Cmp() {
                }
                return Page1Cmp;
            }());
            Page1Cmp = __decorate([
                core_1.Component({ selector: 'page1', template: "page1", animations: [] })
            ], Page1Cmp);
            var Page2Cmp = (function () {
                function Page2Cmp() {
                    this.doAnimate = true;
                    this.exp = true;
                }
                return Page2Cmp;
            }());
            __decorate([
                core_1.HostBinding('@page2Animation'),
                __metadata("design:type", Object)
            ], Page2Cmp.prototype, "doAnimate", void 0);
            Page2Cmp = __decorate([
                core_1.Component({
                    selector: 'page2',
                    template: "\n          <h1>Page 2</h1>\n          <div *ngIf=\"exp\" class=\"if-one\" @ifAnimation></div>\n          <div *ngIf=\"exp\" class=\"if-two\" @ifAnimation></div>\n        ",
                    animations: [
                        animations_1.trigger('page2Animation', [
                            animations_1.transition(':enter', [animations_1.query('.if-one', animations_1.animateChild()), animations_1.query('.if-two', animations_1.animateChild())]),
                        ]),
                        animations_1.trigger('ifAnimation', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])
                    ]
                })
            ], Page2Cmp);
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '0' },
                { offset: .5, opacity: '0' },
                { offset: 1, opacity: '1' },
            ]);
        }));
        it('should allow inner leave animations to be emulated within a routed item', testing_2.fakeAsync(function () {
            var ContainerCmp = (function () {
                function ContainerCmp(router) {
                    this.router = router;
                }
                ContainerCmp.prototype.prepareRouteAnimation = function (r) {
                    var animation = r.activatedRouteData['animation'];
                    var value = animation ? animation['value'] : null;
                    return value;
                };
                return ContainerCmp;
            }());
            ContainerCmp = __decorate([
                core_1.Component({
                    animations: [
                        animations_1.trigger('routerAnimations', [
                            animations_1.transition('page1 => page2', [
                                animations_1.query(':leave', animations_1.animateChild()),
                            ]),
                        ]),
                    ],
                    template: "\n          <div [@routerAnimations]=\"prepareRouteAnimation(r)\">\n            <router-outlet #r=\"outlet\"></router-outlet>\n          </div>\n        "
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], ContainerCmp);
            var Page1Cmp = (function () {
                function Page1Cmp() {
                    this.doAnimate = true;
                    this.exp = true;
                }
                return Page1Cmp;
            }());
            __decorate([
                core_1.HostBinding('@page1Animation'),
                __metadata("design:type", Object)
            ], Page1Cmp.prototype, "doAnimate", void 0);
            Page1Cmp = __decorate([
                core_1.Component({
                    selector: 'page1',
                    template: "\n          <h1>Page 1</h1>\n          <div *ngIf=\"exp\" class=\"if-one\" @ifAnimation></div>\n          <div *ngIf=\"exp\" class=\"if-two\" @ifAnimation></div>\n        ",
                    animations: [
                        animations_1.trigger('page1Animation', [
                            animations_1.transition(':leave', [animations_1.query('.if-one', animations_1.animateChild()), animations_1.query('.if-two', animations_1.animateChild())]),
                        ]),
                        animations_1.trigger('ifAnimation', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])]),
                    ]
                })
            ], Page1Cmp);
            var Page2Cmp = (function () {
                function Page2Cmp() {
                }
                return Page2Cmp;
            }());
            Page2Cmp = __decorate([
                core_1.Component({ selector: 'page2', template: "page2", animations: [] })
            ], Page2Cmp);
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(2);
            var p1 = players[0], p2 = players[1];
            expect(p1.keyframes).toEqual([
                { offset: 0, opacity: '1' },
                { offset: 1, opacity: '0' },
            ]);
            expect(p2.keyframes).toEqual([
                { offset: 0, opacity: '1' },
                { offset: .5, opacity: '1' },
                { offset: 1, opacity: '0' },
            ]);
        }));
        it('should properly collect :enter / :leave router nodes even when another non-router *template component is within the trigger boundaries', testing_2.fakeAsync(function () {
            var ContainerCmp = (function () {
                function ContainerCmp(router) {
                    this.router = router;
                    this.loading = false;
                }
                ContainerCmp.prototype.prepRoute = function (outlet) { return outlet.activatedRouteData['animation']; };
                return ContainerCmp;
            }());
            ContainerCmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    animations: [
                        animations_1.trigger('pageAnimation', [
                            animations_1.transition('page1 => page2', [
                                animations_1.query('.router-container :leave', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                                animations_1.query('.router-container :enter', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                            ]),
                        ]),
                    ],
                    template: "\n          <div [@pageAnimation]=\"prepRoute(outlet)\">\n            <header>\n              <div class=\"inner\">\n                <div *ngIf=\"!loading\" class=\"title\">Page Ready</div>\n                <div *ngIf=\"loading\" class=\"loading\">loading...</div>\n              </div>\n            </header>\n            <section class=\"router-container\">\n              <router-outlet #outlet=\"outlet\"></router-outlet>\n            </section>\n          </div>\n        "
                }),
                __metadata("design:paramtypes", [router_1.Router])
            ], ContainerCmp);
            var Page1Cmp = (function () {
                function Page1Cmp() {
                }
                return Page1Cmp;
            }());
            Page1Cmp = __decorate([
                core_1.Component({ selector: 'page1', template: "page1" })
            ], Page1Cmp);
            var Page2Cmp = (function () {
                function Page2Cmp() {
                }
                return Page2Cmp;
            }());
            Page2Cmp = __decorate([
                core_1.Component({ selector: 'page2', template: "page2" })
            ], Page2Cmp);
            testing_2.TestBed.configureTestingModule({
                declarations: [Page1Cmp, Page2Cmp, ContainerCmp],
                imports: [testing_3.RouterTestingModule.withRoutes([
                        { path: 'page1', component: Page1Cmp, data: makeAnimationData('page1') },
                        { path: 'page2', component: Page2Cmp, data: makeAnimationData('page2') }
                    ])]
            });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(ContainerCmp);
            var cmp = fixture.componentInstance;
            cmp.router.initialNavigation();
            testing_2.tick();
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page1');
            testing_2.tick();
            cmp.loading = true;
            fixture.detectChanges();
            engine.flush();
            cmp.router.navigateByUrl('/page2');
            testing_2.tick();
            cmp.loading = false;
            fixture.detectChanges();
            engine.flush();
            var players = engine.players;
            expect(players.length).toEqual(1);
            var p1 = players[0];
            var innerPlayers = p1.getRealPlayer().players;
            expect(innerPlayers.length).toEqual(2);
            var ip1 = innerPlayers[0], ip2 = innerPlayers[1];
            expect(ip1.element.innerText).toEqual('page1');
            expect(ip2.element.innerText).toEqual('page2');
        }));
    });
}
exports.main = main;
function makeAnimationData(value, params) {
    if (params === void 0) { params = {}; }
    return { 'animation': { value: value, params: params } };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3JvdXRlcl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2FuaW1hdGlvbi9hbmltYXRpb25fcm91dGVyX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBNEk7QUFDNUksdURBQThFO0FBQzlFLCtEQUE2RjtBQUM3RixzQ0FBcUQ7QUFDckQsaURBQStEO0FBQy9ELG1FQUE2RTtBQUM3RSwwQ0FBcUQ7QUFDckQsbURBQTREO0FBRTVEO0lBQ0UsaUVBQWlFO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUUxQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsNkJBQW1CLEVBQUUsb0NBQXVCLENBQUM7Z0JBQ3ZELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkRBQTJELEVBQUUsbUJBQVMsQ0FBQztZQW9CckUsSUFBTSxZQUFZO2dCQUNoQixzQkFBbUIsTUFBYztvQkFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO2dCQUFHLENBQUM7Z0JBRXJDLDRDQUFxQixHQUFyQixVQUFzQixDQUFlO29CQUNuQyxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3BELElBQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFD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