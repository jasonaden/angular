"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var testing_1 = require("../../testing");
function main() {
    // these tests are only mean't to be run within the DOM (for now)
    // Buggy in Chromium 39, see https://github.com/angular/angular/issues/15793
    if (typeof Element == 'undefined' || !browser_1.ɵsupportsWebAnimations())
        return;
    describe('animation integration tests using web animations', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵWebAnimationsDriver }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        it('should compute (*) animation styles for a container that is being removed', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.exp = false;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: "\n          <div @auto *ngIf=\"exp\">\n            <div style=\"line-height:20px;\">1</div>\n            <div style=\"line-height:20px;\">2</div>\n            <div style=\"line-height:20px;\">3</div>\n            <div style=\"line-height:20px;\">4</div>\n            <div style=\"line-height:20px;\">5</div>\n          </div>\n        ",
                    animations: [animations_1.trigger('auto', [
                            animations_1.state('void', animations_1.style({ height: '0px' })), animations_1.state('*', animations_1.style({ height: '*' })),
                            animations_1.transition('* => *', animations_1.animate(1000))
                        ])]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            var webPlayer = engine.players[0].getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
            ]);
            if (!browser_util_1.browserDetection.isOldChrome) {
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(1);
                webPlayer = engine.players[0].getRealPlayer();
                expect(webPlayer.keyframes).toEqual([
                    { height: '100px', offset: 0 }, { height: '0px', offset: 1 }
                ]);
            }
        });
        it('should compute (!) animation styles for a container that is being inserted', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.exp = false;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: "\n          <div @auto *ngIf=\"exp\">\n            <div style=\"line-height:20px;\">1</div>\n            <div style=\"line-height:20px;\">2</div>\n            <div style=\"line-height:20px;\">3</div>\n            <div style=\"line-height:20px;\">4</div>\n            <div style=\"line-height:20px;\">5</div>\n          </div>\n        ",
                    animations: [animations_1.trigger('auto', [animations_1.transition(':enter', [animations_1.style({ height: '!' }), animations_1.animate(1000, animations_1.style({ height: '120px' }))])])]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            var webPlayer = engine.players[0].getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '100px', offset: 0 }, { height: '120px', offset: 1 }
            ]);
        });
        it('should compute pre (!) and post (*) animation styles with different dom states', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.items = [0, 1, 2, 3, 4];
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: "\n            <div [@myAnimation]=\"exp\" #parent>\n              <div *ngFor=\"let item of items\" class=\"child\" style=\"line-height:20px\">\n                - {{ item }} \n              </div>\n            </div>\n          ",
                    animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => *', [animations_1.style({ height: '!' }), animations_1.animate(1000, animations_1.style({ height: '*' }))])])]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 1;
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            var player = engine.players[0];
            var webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
            ]);
            // we destroy the player because since it has started and is
            // at 0ms duration a height value of `0px` will be extracted
            // from the element and passed into the follow-up animation.
            player.destroy();
            cmp.exp = 2;
            cmp.items = [0, 1, 2, 6];
            fixture.detectChanges();
            engine.flush();
            expect(engine.players.length).toEqual(1);
            player = engine.players[0];
            webPlayer = player.getRealPlayer();
            expect(webPlayer.keyframes).toEqual([
                { height: '100px', offset: 0 }, { height: '80px', offset: 1 }
            ]);
        });
        it('should compute intermediate styles properly when an animation is cancelled', function () {
            var Cmp = (function () {
                function Cmp() {
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: "\n          <div [@myAnimation]=\"exp\">...</div>\n        ",
                    animations: [
                        animations_1.trigger('myAnimation', [
                            animations_1.transition('* => a', [
                                animations_1.style({ width: 0, height: 0 }),
                                animations_1.animate('1s', animations_1.style({ width: '300px', height: '600px' })),
                            ]),
                            animations_1.transition('* => b', [animations_1.animate('1s', animations_1.style({ opacity: 0 }))]),
                        ]),
                    ]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'a';
            fixture.detectChanges();
            var player = engine.players[0];
            var webPlayer = player.getRealPlayer();
            webPlayer.setPosition(0.5);
            cmp.exp = 'b';
            fixture.detectChanges();
            player = engine.players[0];
            webPlayer = player.getRealPlayer();
            expect(approximate(parseFloat(webPlayer.previousStyles['width']), 150))
                .toBeLessThan(0.05);
            expect(approximate(parseFloat(webPlayer.previousStyles['height']), 300))
                .toBeLessThan(0.05);
        });
        it('should compute intermediate styles properly for multiple queried elements when an animation is cancelled', function () {
            var Cmp = (function () {
                function Cmp() {
                    this.items = [];
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"target\"></div>\n          </div>\n        ",
                    animations: [
                        animations_1.trigger('myAnimation', [
                            animations_1.transition('* => full', [animations_1.query('.target', [
                                    animations_1.style({ width: 0, height: 0 }),
                                    animations_1.animate('1s', animations_1.style({ width: '500px', height: '1000px' })),
                                ])]),
                            animations_1.transition('* => empty', [animations_1.query('.target', [animations_1.animate('1s', animations_1.style({ opacity: 0 }))])]),
                        ]),
                    ]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'full';
            cmp.items = [0, 1, 2, 3, 4];
            fixture.detectChanges();
            var player = engine.players[0];
            var groupPlayer = player.getRealPlayer();
            var players = groupPlayer.players;
            expect(players.length).toEqual(5);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                p.setPosition(0.5);
            }
            cmp.exp = 'empty';
            cmp.items = [];
            fixture.detectChanges();
            player = engine.players[0];
            groupPlayer = player.getRealPlayer();
            players = groupPlayer.players;
            expect(players.length).toEqual(5);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                expect(approximate(parseFloat(p.previousStyles['width']), 250))
                    .toBeLessThan(0.05);
                expect(approximate(parseFloat(p.previousStyles['height']), 500))
                    .toBeLessThan(0.05);
            }
        });
    });
}
exports.main = main;
function approximate(value, target) {
    return Math.abs(target - value) / value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uc193aXRoX3dlYl9hbmltYXRpb25zX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbnNfd2l0aF93ZWJfYW5pbWF0aW9uc19pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQXNGO0FBQ3RGLHVEQUFrSjtBQUVsSixzQ0FBd0M7QUFDeEMsbUVBQTZFO0FBQzdFLG1GQUFvRjtBQUVwRix5Q0FBc0M7QUFFdEM7SUFDRSxpRUFBaUU7SUFDakUsNEVBQTRFO0lBQzVFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsSUFBSSxDQUFDLGdDQUFzQixFQUFFLENBQUM7UUFBQyxNQUFNLENBQUM7SUFFdkUsUUFBUSxDQUFDLGtEQUFrRCxFQUFFO1FBRTNELFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDhCQUFvQixFQUFDLENBQUM7Z0JBQ3ZFLE9BQU8sRUFBRSxDQUFDLG9DQUF1QixDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBbUI5RSxJQUFNLEdBQUc7Z0JBbEJUO29CQW1CUyxRQUFHLEdBQVksS0FBSyxDQUFDO2dCQUM5QixDQUFDO2dCQUFELFVBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUZLLEdBQUc7Z0JBbEJSLGdCQUFTLENBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFFBQVEsRUFBRSxpVkFRVDtvQkFDRCxVQUFVLEVBQUUsQ0FBQyxvQkFBTyxDQUNoQixNQUFNLEVBQ047NEJBQ0Usa0JB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