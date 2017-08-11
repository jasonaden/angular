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
var animation_builder_1 = require("../../animations/src/animation_builder");
var browser_util_1 = require("../../testing/src/browser_util");
function main() {
    describe('BrowserAnimationBuilder', function () {
        var element;
        beforeEach(function () {
            element = browser_util_1.el('<div></div>');
            testing_2.TestBed.configureTestingModule({
                imports: [animations_2.NoopAnimationsModule],
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }]
            });
        });
        it('should inject AnimationBuilder into a component', function () {
            var Cmp = (function () {
                function Cmp(builder) {
                    this.builder = builder;
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: '...',
                }),
                __metadata("design:paramtypes", [animations_1.AnimationBuilder])
            ], Cmp);
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            fixture.detectChanges();
            expect(cmp.builder instanceof animation_builder_1.BrowserAnimationBuilder).toBeTruthy();
        });
        it('should listen on start and done on the animation builder\'s player', testing_2.fakeAsync(function () {
            var Cmp = (function () {
                function Cmp(builder) {
                    this.builder = builder;
                }
                Cmp.prototype.build = function () {
                    var definition = this.builder.build([animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]);
                    return definition.create(this.target);
                };
                return Cmp;
            }());
            __decorate([
                core_1.ViewChild('target'),
                __metadata("design:type", Object)
            ], Cmp.prototype, "target", void 0);
            Cmp = __decorate([
                core_1.Component({
                    selector: 'ani-cmp',
                    template: '...',
                }),
                __metadata("design:paramtypes", [animations_1.AnimationBuilder])
            ], Cmp);
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            fixture.detectChanges();
            var player = cmp.build();
            var started = false;
            player.onStart(function () { return started = true; });
            var finished = false;
            player.onDone(function () { return finished = true; });
            var destroyed = false;
            player.onDestroy(function () { return destroyed = true; });
            player.init();
            testing_2.flushMicrotasks();
            expect(started).toBeFalsy();
            expect(finished).toBeFalsy();
            expect(destroyed).toBeFalsy();
            player.play();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeFalsy();
            expect(destroyed).toBeFalsy();
            player.finish();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeTruthy();
            expect(destroyed).toBeFalsy();
            player.destroy();
            testing_2.flushMicrotasks();
            expect(started).toBeTruthy();
            expect(finished).toBeTruthy();
            expect(destroyed).toBeTruthy();
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9hbmltYXRpb25fYnVpbGRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2FuaW1hdGlvbi9icm93c2VyX2FuaW1hdGlvbl9idWlsZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBcUU7QUFDckUsdURBQTREO0FBQzVELCtEQUF3RTtBQUN4RSxzQ0FBbUQ7QUFDbkQsaURBQTBFO0FBQzFFLG1FQUEwRTtBQUUxRSw0RUFBK0U7QUFDL0UsK0RBQWtEO0FBRWxEO0lBQ0UsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1FBQ2xDLElBQUksT0FBWSxDQUFDO1FBQ2pCLFVBQVUsQ0FBQztZQUNULE9BQU8sR0FBRyxpQkFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVCLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLGlDQUFvQixDQUFDO2dCQUMvQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZSxFQUFFLFFBQVEsRUFBRSw2QkFBbUIsRUFBQyxDQUFDO2FBQ3ZFLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBS3BELElBQU0sR0FBRztnQkFDUCxhQUFtQixPQUF5QjtvQkFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7Z0JBQUcsQ0FBQztnQkFDbEQsVUFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRkssR0FBRztnQkFKUixnQkFBUyxDQUFDO29CQUNULFFBQVEsRUFBRSxTQUFTO29CQUNuQixRQUFRLEVBQUUsS0FBSztpQkFDaEIsQ0FBQztpREFFNEIsNkJBQWdCO2VBRHhDLEdBQUcsQ0FFUjtZQUVELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVB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