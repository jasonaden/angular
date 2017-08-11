"use strict";
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
var animations_2 = require("@angular/platform-browser/animations");
var dom_renderer_1 = require("@angular/platform-browser/src/dom/dom_renderer");
var providers_1 = require("../../animations/src/providers");
var browser_util_1 = require("../../testing/src/browser_util");
function main() {
    describe('AnimationRenderer', function () {
        var element;
        beforeEach(function () {
            element = browser_util_1.el('<div></div>');
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.ɵAnimationEngine, useClass: MockAnimationEngine }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        function makeRenderer(animationTriggers) {
            if (animationTriggers === void 0) { animationTriggers = []; }
            var type = {
                id: 'id',
                encapsulation: null,
                styles: [],
                data: { 'animation': animationTriggers }
            };
            return testing_1.TestBed.get(core_1.RendererFactory2)
                .createRenderer(element, type);
        }
        it('should hook into the engine\'s insert operations when appending children', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            renderer.appendChild(container, element);
            expect(engine.captures['onInsert'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s insert operations when inserting a child before another', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            var element2 = browser_util_1.el('<div></div>');
            container.appendChild(element2);
            renderer.insertBefore(container, element, element2);
            expect(engine.captures['onInsert'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s insert operations when removing children', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var container = browser_util_1.el('<div></div>');
            renderer.removeChild(container, element);
            expect(engine.captures['onRemove'].pop()).toEqual([element]);
        });
        it('should hook into the engine\'s setProperty call if the property begins with `@`', function () {
            var renderer = makeRenderer();
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            renderer.setProperty(element, 'prop', 'value');
            expect(engine.captures['setProperty']).toBeFalsy();
            renderer.setProperty(element, '@prop', 'value');
            expect(engine.captures['setProperty'].pop()).toEqual([element, 'prop', 'value']);
        });
        describe('listen', function () {
            it('should hook into the engine\'s listen call if the property begins with `@`', function () {
                var renderer = makeRenderer();
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var cb = function (event) { return true; };
                renderer.listen(element, 'event', cb);
                expect(engine.captures['listen']).toBeFalsy();
                renderer.listen(element, '@event.phase', cb);
                expect(engine.captures['listen'].pop()).toEqual([element, 'event', 'phase']);
            });
            it('should resolve the body|document|window nodes given their values as strings as input', function () {
                var renderer = makeRenderer();
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var cb = function (event) { return true; };
                renderer.listen('body', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(document.body);
                renderer.listen('document', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(document);
                renderer.listen('window', '@event', cb);
                expect(engine.captures['listen'].pop()[0]).toBe(window);
            });
        });
        describe('registering animations', function () {
            it('should only create a trigger definition once even if the registered multiple times');
        });
        describe('flushing animations', function () {
            // these tests are only mean't to be run within the DOM
            if (typeof Element == 'undefined')
                return;
            it('should flush and fire callbacks when the zone becomes stable', function (async) {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    Cmp.prototype.onStart = function (event) { this.event = event; };
                    return Cmp;
                }());
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: '<div [@myAnimation]="exp" (@myAnimation.start)="onStart($event)"></div>',
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => state', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'state';
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    expect(cmp.event.triggerName).toEqual('myAnimation');
                    expect(cmp.event.phaseName).toEqual('start');
                    cmp.event = null;
                    engine.flush();
                    expect(cmp.event).toBeFalsy();
                    async();
                });
            });
            it('should properly insert/remove nodes through the animation renderer that do not contain animations', function (async) {
                var Cmp = (function () {
                    function Cmp() {
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('elm'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "element", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: '<div #elm *ngIf="exp"></div>',
                        animations: [animations_1.trigger('someAnimation', [animations_1.transition('* => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    cmp.exp = false;
                    var element = cmp.element;
                    expect(element.nativeElement.parentNode).toBeTruthy();
                    fixture.detectChanges();
                    fixture.whenStable().then(function () {
                        expect(element.nativeElement.parentNode).toBeFalsy();
                        async();
                    });
                });
            });
            it('should only queue up dom removals if the element itself contains a valid leave animation', function () {
                var Cmp = (function () {
                    function Cmp() {
                        this.exp1 = true;
                        this.exp2 = true;
                        this.exp3 = true;
                    }
                    return Cmp;
                }());
                __decorate([
                    core_1.ViewChild('elm1'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm1", void 0);
                __decorate([
                    core_1.ViewChild('elm2'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm2", void 0);
                __decorate([
                    core_1.ViewChild('elm3'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "elm3", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: "\n               <div #elm1 *ngIf=\"exp1\"></div>\n               <div #elm2 @animation1 *ngIf=\"exp2\"></div>\n               <div #elm3 @animation2 *ngIf=\"exp3\"></div>\n            ",
                        animations: [
                            animations_1.trigger('animation1', [animations_1.transition('a => b', [])]),
                            animations_1.trigger('animation2', [animations_1.transition(':leave', [])]),
                        ]
                    })
                ], Cmp);
                testing_1.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                    declarations: [Cmp]
                });
                var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_1.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                var elm1 = cmp.elm1;
                var elm2 = cmp.elm2;
                var elm3 = cmp.elm3;
                assertHasParent(elm1);
                assertHasParent(elm2);
                assertHasParent(elm3);
                engine.flush();
                finishPlayers(engine.players);
                cmp.exp1 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                cmp.exp2 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2, false);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                cmp.exp3 = false;
                fixture.detectChanges();
                assertHasParent(elm1, false);
                assertHasParent(elm2, false);
                assertHasParent(elm3);
                engine.flush();
                expect(engine.players.length).toEqual(1);
            });
        });
    });
    describe('AnimationRendererFactory', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{
                        provide: core_1.RendererFactory2,
                        useClass: ExtendedAnimationRendererFactory,
                        deps: [dom_renderer_1.DomRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
                    }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        it('should provide hooks at the start and end of change detection', function () {
            var Cmp = (function () {
                function Cmp() {
                }
                return Cmp;
            }());
            Cmp = __decorate([
                core_1.Component({
                    selector: 'my-cmp',
                    template: "\n          <div [@myAnimation]=\"exp\"></div> \n        ",
                    animations: [animations_1.trigger('myAnimation', [])]
                })
            ], Cmp);
            testing_1.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.ɵAnimationEngine, useClass: providers_1.InjectableAnimationEngine }],
                declarations: [Cmp]
            });
            var renderer = testing_1.TestBed.get(core_1.RendererFactory2);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            renderer.log = [];
            fixture.detectChanges();
            expect(renderer.log).toEqual(['begin', 'end']);
            renderer.log = [];
            fixture.detectChanges();
            expect(renderer.log).toEqual(['begin', 'end']);
        });
    });
}
exports.main = main;
var MockAnimationEngine = (function (_super) {
    __extends(MockAnimationEngine, _super);
    function MockAnimationEngine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.captures = {};
        _this.triggers = [];
        return _this;
    }
    MockAnimationEngine.prototype._capture = function (name, args) {
        var data = this.captures[name] = this.captures[name] || [];
        data.push(args);
    };
    MockAnimationEngine.prototype.registerTrigger = function (componentId, namespaceId, trigger) {
        this.triggers.push(trigger);
    };
    MockAnimationEngine.prototype.onInsert = function (namespaceId, element) { this._capture('onInsert', [element]); };
    MockAnimationEngine.prototype.onRemove = function (namespaceId, element, domFn) {
        this._capture('onRemove', [element]);
    };
    MockAnimationEngine.prototype.process = function (namespaceId, element, property, value) {
        this._capture('setProperty', [element, property, value]);
        return true;
    };
    MockAnimationEngine.prototype.listen = function (namespaceId, element, eventName, eventPhase, callback) {
        // we don't capture the callback here since the renderer wraps it in a zone
        this._capture('listen', [element, eventName, eventPhase]);
        return function () { };
    };
    MockAnimationEngine.prototype.flush = function () { };
    MockAnimationEngine.prototype.destroy = function (namespaceId) { };
    return MockAnimationEngine;
}(providers_1.InjectableAnimationEngine));
MockAnimationEngine = __decorate([
    core_1.Injectable()
], MockAnimationEngine);
var ExtendedAnimationRendererFactory = (function (_super) {
    __extends(ExtendedAnimationRendererFactory, _super);
    function ExtendedAnimationRendererFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.log = [];
        return _this;
    }
    ExtendedAnimationRendererFactory.prototype.begin = function () {
        _super.prototype.begin.call(this);
        this.log.push('begin');
    };
    ExtendedAnimationRendererFactory.prototype.end = function () {
        _super.prototype.end.call(this);
        this.log.push('end');
    };
    return ExtendedAnimationRendererFactory;
}(animations_2.ɵAnimationRendererFactory));
ExtendedAnimationRendererFactory = __decorate([
    core_1.Injectable()
], ExtendedAnimationRendererFactory);
function assertHasParent(element, yes) {
    if (yes === void 0) { yes = true; }
    var parent = element.nativeElement.parentNode;
    if (yes) {
        expect(parent).toBeTruthy();
    }
    else {
        expect(parent).toBeFalsy();
    }
}
function finishPlayers(players) {
    players.forEach(function (player) { return player.finish(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3JlbmRlcmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9yZW5kZXJlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILGtEQUEwSDtBQUMxSCx1REFBZ0Y7QUFDaEYsc0NBQXdHO0FBQ3hHLGlEQUE4QztBQUM5QyxtRUFBb0k7QUFDcEksK0VBQW1GO0FBQ25GLDREQUF5RTtBQUN6RSwrREFBa0Q7QUFFbEQ7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUFZLENBQUM7UUFDakIsVUFBVSxDQUFDO1lBQ1QsT0FBTyxHQUFHLGlCQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUIsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsMEJBQWUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztnQkFDdEUsT0FBTyxFQUFFLENBQUMsb0NBQXVCLENBQUM7YUFDbkMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxzQkFBc0IsaUJBQTZCO1lBQTdCLGtDQUFBLEVBQUEsc0JBQTZCO1lBQ2pELElBQU0sSUFBSSxHQUFrQjtnQkFDMUIsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsYUFBYSxFQUFFLElBQU07Z0JBQ3JCLE1BQU0sRUFBRSxFQUFFO2dCQUNWLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBQzthQUN2QyxDQUFDO1lBQ0YsTUFBTSxDQUFFLGlCQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUE4QjtpQkFDN0QsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FB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