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
var testing_1 = require("@angular/core/testing");
var module_1 = require("../src/module");
function main() {
    describe('NoopAnimationsModule', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [module_1.NoopAnimationsModule] }); });
        it('should flush and fire callbacks when the zone becomes stable', function (async) {
            var Cmp = (function () {
                function Cmp() {
                }
                Cmp.prototype.onStart = function (event) { this.startEvent = event; };
                Cmp.prototype.onDone = function (event) { this.doneEvent = event; };
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'my-cmp',
                    template: '<div [@myAnimation]="exp" (@myAnimation.start)="onStart($event)" (@myAnimation.done)="onDone($event)"></div>',
                    animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => state', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'state';
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                expect(cmp.startEvent.triggerName).toEqual('myAnimation');
                expect(cmp.startEvent.phaseName).toEqual('start');
                expect(cmp.doneEvent.triggerName).toEqual('myAnimation');
                expect(cmp.doneEvent.phaseName).toEqual('done');
                async();
            });
        });
        it('should handle leave animation callbacks even if the element is destroyed in the process', function (async) {
            var Cmp = (function () {
                function Cmp() {
                }
                Cmp.prototype.onStart = function (event) { this.startEvent = event; };
                Cmp.prototype.onDone = function (event) { this.doneEvent = event; };
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'my-cmp',
                    template: '<div *ngIf="exp" @myAnimation (@myAnimation.start)="onStart($event)" (@myAnimation.done)="onDone($event)"></div>',
                    animations: [animations_1.trigger('myAnimation', [animations_1.transition(':leave', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                cmp.startEvent = null;
                cmp.doneEvent = null;
                cmp.exp = false;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    expect(cmp.startEvent.triggerName).toEqual('myAnimation');
                    expect(cmp.startEvent.phaseName).toEqual('start');
                    expect(cmp.startEvent.toState).toEqual('void');
                    expect(cmp.doneEvent.triggerName).toEqual('myAnimation');
                    expect(cmp.doneEvent.phaseName).toEqual('done');
                    expect(cmp.doneEvent.toState).toEqual('void');
                    async();
                });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vcF9hbmltYXRpb25zX21vZHVsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3Rlc3Qvbm9vcF9hbmltYXRpb25zX21vZHVsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQXdFO0FBQ3hFLHVEQUE2RDtBQUM3RCxzQ0FBd0M7QUFDeEMsaURBQThDO0FBRTlDLHdDQUFtRDtBQUVuRDtJQUNFLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixVQUFVLENBQUMsY0FBUSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsNkJBQW9CLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RixFQUFFLENBQUMsOERBQThELEVBQUUsVUFBQyxLQUFLO1lBVXZFLElBQU0sR0FBRztnQkFBVDtnQkFNQSxDQUFDO2dCQUZDLHFCQUFPLEdBQVAsVUFBUSxLQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxvQkFBTSxHQUFOLFVBQU8sS0FBVSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsVUFBQztZQUFELENBQUMsQUFORCxJQU1DO1lBTkssR0FBRztnQkFUUixnQkFBUyxDQUFDO29CQUNULFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQ0osOEdBQThHO29CQUNsSCxVQUFVLEVBQUUsQ0FBQyxvQkFBTyxDQUNoQixhQUFhLEVBQ2IsQ0FBQyx1QkFBVSxDQUNQLFlBQVksRUFBRSxDQUFDLGtCQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxvQkFBTyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFD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