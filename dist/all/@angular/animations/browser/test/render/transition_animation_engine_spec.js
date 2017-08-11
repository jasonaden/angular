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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_ast_builder_1 = require("../../src/dsl/animation_ast_builder");
var animation_trigger_1 = require("../../src/dsl/animation_trigger");
var animation_style_normalizer_1 = require("../../src/dsl/style_normalization/animation_style_normalizer");
var transition_animation_engine_1 = require("../../src/render/transition_animation_engine");
var mock_animation_driver_1 = require("../../testing/src/mock_animation_driver");
var DEFAULT_NAMESPACE_ID = 'id';
function main() {
    var driver = new mock_animation_driver_1.MockAnimationDriver();
    // these tests are only mean't to be run within the DOM
    if (typeof Element == 'undefined')
        return;
    describe('TransitionAnimationEngine', function () {
        var element;
        beforeEach(function () {
            mock_animation_driver_1.MockAnimationDriver.log = [];
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { document.body.removeChild(element); });
        function makeEngine(normalizer) {
            var engine = new transition_animation_engine_1.TransitionAnimationEngine(driver, normalizer || new animation_style_normalizer_1.NoopAnimationStyleNormalizer());
            engine.createNamespace(DEFAULT_NAMESPACE_ID, element);
            return engine;
        }
        describe('trigger registration', function () {
            it('should ignore and not throw an error if the same trigger is registered twice', function () {
                // TODO (matsko): ask why this is avoided
                var engine = makeEngine();
                registerTrigger(element, engine, animations_1.trigger('trig', []));
                expect(function () { registerTrigger(element, engine, animations_1.trigger('trig', [])); }).not.toThrow();
            });
        });
        describe('property setting', function () {
            it('should invoke a transition based on a property change', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.players.length).toEqual(1);
                var player = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
                ]);
            });
            it('should not queue an animation if the property value has not changed at all', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                setProperty(element, engine, 'myTrigger', 'abc');
                engine.flush();
                expect(engine.players.length).toEqual(1);
                setProperty(element, engine, 'myTrigger', 'abc');
                engine.flush();
                expect(engine.players.length).toEqual(1);
            });
            it('should throw an error if an animation property without a matching trigger is changed', function () {
                var engine = makeEngine();
                expect(function () {
                    setProperty(element, engine, 'myTrigger', 'no');
                }).toThrowError(/The provided animation trigger "myTrigger" has not been registered!/);
            });
        });
        describe('removal operations', function () {
            it('should cleanup all inner state that\'s tied to an element once removed', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition(':leave', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.elementContainsData(DEFAULT_NAMESPACE_ID, element)).toBeTruthy();
                engine.removeNode(DEFAULT_NAMESPACE_ID, element, true);
                engine.flush();
                expect(engine.elementContainsData(DEFAULT_NAMESPACE_ID, element)).toBeTruthy();
            });
            it('should create and recreate a namespace for a host element with the same component source', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => *', animations_1.animate(1234, animations_1.style({ color: 'red' })))]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.players[0].getRealPlayer().duration)
                    .toEqual(1234);
                engine.destroy(DEFAULT_NAMESPACE_ID, null);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value2');
                engine.flush();
                expect(engine.players[0].getRealPlayer().duration)
                    .toEqual(1234);
            });
        });
        describe('event listeners', function () {
            it('should listen to the onStart operation for the animation', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                var count = 0;
                registerTrigger(element, engine, trig);
                listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', 'value');
                expect(count).toEqual(0);
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should listen to the onDone operation for the animation', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                var count = 0;
                registerTrigger(element, engine, trig);
                listen(element, engine, 'myTrigger', 'done', function () { return count++; });
                setProperty(element, engine, 'myTrigger', 'value');
                expect(count).toEqual(0);
                engine.flush();
                expect(count).toEqual(0);
                engine.players[0].finish();
                expect(count).toEqual(1);
            });
            it('should throw an error when an event is listened to that isn\'t supported', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', []);
                registerTrigger(element, engine, trig);
                expect(function () { listen(element, engine, 'myTrigger', 'explode', function () { }); })
                    .toThrowError(/The provided animation trigger event "explode" for the animation trigger "myTrigger" is not supported!/);
            });
            it('should throw an error when an event is listened for a trigger that doesn\'t exist', function () {
                var engine = makeEngine();
                expect(function () { listen(element, engine, 'myTrigger', 'explode', function () { }); })
                    .toThrowError(/Unable to listen on the animation trigger event "explode" because the animation trigger "myTrigger" doesn\'t exist!/);
            });
            it('should throw an error when an undefined event is listened for', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', []);
                registerTrigger(element, engine, trig);
                expect(function () { listen(element, engine, 'myTrigger', '', function () { }); })
                    .toThrowError(/Unable to listen on the animation trigger "myTrigger" because the provided event is undefined!/);
            });
            it('should retain event listeners and call them for successive animation state changes', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig);
                var count = 0;
                listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                expect(count).toEqual(1);
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                expect(count).toEqual(2);
            });
            it('should only fire event listener changes for when the corresponding trigger changes state', function () {
                var engine = makeEngine();
                var trig1 = animations_1.trigger('myTrigger1', [animations_1.transition('* => 123', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig1);
                var trig2 = animations_1.trigger('myTrigger2', [animations_1.transition('* => 123', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))])]);
                registerTrigger(element, engine, trig2);
                var count = 0;
                listen(element, engine, 'myTrigger1', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger1', '123');
                engine.flush();
                expect(count).toEqual(1);
                setProperty(element, engine, 'myTrigger2', '123');
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should allow a listener to be deregistered, but only after a flush occurs', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => 123', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig);
                var count = 0;
                var deregisterFn = listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                expect(count).toEqual(1);
                deregisterFn();
                engine.flush();
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should trigger a listener callback with an AnimationEvent argument', function () {
                var engine = makeEngine();
                registerTrigger(element, engine, animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1234, animations_1.style({ height: '100px' }))])
                ]));
                // we do this so that the next transition has a starting value that isn't null
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                var capture = null;
                listen(element, engine, 'myTrigger', 'start', function (e) { return capture = e; });
                listen(element, engine, 'myTrigger', 'done', function (e) { return capture = e; });
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                delete capture['_data'];
                expect(capture).toEqual({
                    element: element,
                    triggerName: 'myTrigger',
                    phaseName: 'start',
                    fromState: '123',
                    toState: '456',
                    totalTime: 1234
                });
                capture = null;
                var player = engine.players.pop();
                player.finish();
                delete capture['_data'];
                expect(capture).toEqual({
                    element: element,
                    triggerName: 'myTrigger',
                    phaseName: 'done',
                    fromState: '123',
                    toState: '456',
                    totalTime: 1234
                });
            });
        });
        describe('transition operations', function () {
            it('should persist the styles on the element as actual styles once the animation is complete', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('on', animations_1.style({ height: '100px' })), animations_1.state('off', animations_1.style({ height: '0px' })),
                    animations_1.transition('on => off', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'on');
                setProperty(element, engine, trig.name, 'off');
                engine.flush();
                expect(element.style.height).not.toEqual('0px');
                engine.players[0].finish();
                expect(element.style.height).toEqual('0px');
            });
            it('should remove all existing state styling from an element when a follow-up transition occurs on the same trigger', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ height: '100px' })), animations_1.state('b', animations_1.style({ height: '500px' })),
                    animations_1.state('c', animations_1.style({ width: '200px' })), animations_1.transition('* => *', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'b');
                engine.flush();
                var player1 = engine.players[0];
                player1.finish();
                expect(element.style.height).toEqual('500px');
                setProperty(element, engine, trig.name, 'c');
                engine.flush();
                var player2 = engine.players[0];
                expect(element.style.height).not.toEqual('500px');
                player2.finish();
                expect(element.style.width).toEqual('200px');
                expect(element.style.height).not.toEqual('500px');
            });
            it('should allow two animation transitions with different triggers to animate in parallel', function () {
                var engine = makeEngine();
                var trig1 = animations_1.trigger('something1', [
                    animations_1.state('a', animations_1.style({ width: '100px' })), animations_1.state('b', animations_1.style({ width: '200px' })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                var trig2 = animations_1.trigger('something2', [
                    animations_1.state('x', animations_1.style({ height: '500px' })), animations_1.state('y', animations_1.style({ height: '1000px' })),
                    animations_1.transition('* => *', animations_1.animate(2000))
                ]);
                registerTrigger(element, engine, trig1);
                registerTrigger(element, engine, trig2);
                var doneCount = 0;
                function doneCallback() { doneCount++; }
                setProperty(element, engine, trig1.name, 'a');
                setProperty(element, engine, trig1.name, 'b');
                setProperty(element, engine, trig2.name, 'x');
                setProperty(element, engine, trig2.name, 'y');
                engine.flush();
                var player1 = engine.players[0];
                player1.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                var player2 = engine.players[1];
                player2.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                player1.finish();
                expect(doneCount).toEqual(1);
                player2.finish();
                expect(doneCount).toEqual(2);
                expect(element.style.width).toEqual('200px');
                expect(element.style.height).toEqual('1000px');
            });
            it('should cancel a previously running animation when a follow-up transition kicks off on the same trigger', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('x', animations_1.style({ opacity: 0 })), animations_1.state('y', animations_1.style({ opacity: .5 })),
                    animations_1.state('z', animations_1.style({ opacity: 1 })), animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'x');
                setProperty(element, engine, trig.name, 'y');
                engine.flush();
                expect(parseFloat(element.style.opacity)).not.toEqual(.5);
                var player1 = engine.players[0];
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                var player2 = engine.players[0];
                expect(parseFloat(element.style.opacity)).toEqual(.5);
                player2.finish();
                expect(parseFloat(element.style.opacity)).toEqual(1);
                player1.finish();
                expect(parseFloat(element.style.opacity)).toEqual(1);
            });
            it('should pass in the previously running players into the follow-up transition player when cancelled', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('x', animations_1.style({ opacity: 0 })), animations_1.state('y', animations_1.style({ opacity: .5 })),
                    animations_1.state('z', animations_1.style({ opacity: 1 })), animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'x');
                setProperty(element, engine, trig.name, 'y');
                engine.flush();
                var player1 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                player1.setPosition(0.5);
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                var player2 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player2.previousPlayers).toEqual([player1]);
                player2.finish();
                setProperty(element, engine, trig.name, 'x');
                engine.flush();
                var player3 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player3.previousPlayers).toEqual([]);
            });
            it('should cancel all existing players if a removal animation is set to occur', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('m', animations_1.style({ opacity: 0 })), animations_1.state('n', animations_1.style({ opacity: 1 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'm');
                setProperty(element, engine, trig.name, 'n');
                engine.flush();
                var doneCount = 0;
                function doneCallback() { doneCount++; }
                var player1 = engine.players[0];
                player1.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                setProperty(element, engine, trig.name, 'void');
                engine.flush();
                expect(doneCount).toEqual(1);
            });
            it('should only persist styles that exist in the final state styles and not the last keyframe', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('0', animations_1.style({ width: '0px' })), animations_1.state('1', animations_1.style({ width: '100px' })),
                    animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ height: '200px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, '0');
                setProperty(element, engine, trig.name, '1');
                engine.flush();
                var player = engine.players[0];
                expect(element.style.width).not.toEqual('100px');
                player.finish();
                expect(element.style.height).not.toEqual('200px');
                expect(element.style.width).toEqual('100px');
            });
            it('should default to using styling from the `*` state if a matching state is not found', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ opacity: 0 })), animations_1.state('*', animations_1.style({ opacity: .5 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                engine.players[0].finish();
                expect(parseFloat(element.style.opacity)).toEqual(.5);
            });
            it('should treat `void` as `void`', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ opacity: 0 })), animations_1.state('void', animations_1.style({ opacity: .8 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'void');
                engine.flush();
                engine.players[0].finish();
                expect(parseFloat(element.style.opacity)).toEqual(.8);
            });
        });
        describe('style normalizer', function () {
            it('should normalize the style values that are animateTransitioned within an a transition animation', function () {
                var engine = makeEngine(new SuffixNormalizer('-normalized'));
                var trig = animations_1.trigger('something', [
                    animations_1.state('on', animations_1.style({ height: 100 })), animations_1.state('off', animations_1.style({ height: 0 })),
                    animations_1.transition('on => off', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'on');
                setProperty(element, engine, trig.name, 'off');
                engine.flush();
                var player = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player.keyframes).toEqual([
                    { 'height-normalized': '100-normalized', offset: 0 },
                    { 'height-normalized': '0-normalized', offset: 1 }
                ]);
            });
            it('should throw an error when normalization fails within a transition animation', function () {
                var engine = makeEngine(new ExactCssValueNormalizer({ left: '100px' }));
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ left: '0px', width: '200px' })),
                    animations_1.state('b', animations_1.style({ left: '100px', width: '100px' })), animations_1.transition('a => b', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'b');
                var errorMessage = '';
                try {
                    engine.flush();
                }
                catch (e) {
                    errorMessage = e.toString();
                }
                expect(errorMessage).toMatch(/Unable to animate due to the following errors:/);
                expect(errorMessage).toMatch(/- The CSS property `left` is not allowed to be `0px`/);
                expect(errorMessage).toMatch(/- The CSS property `width` is not allowed/);
            });
        });
        describe('view operations', function () {
            it('should perform insert operations immediately ', function () {
                var engine = makeEngine();
                var child1 = document.createElement('div');
                var child2 = document.createElement('div');
                element.appendChild(child1);
                element.appendChild(child2);
                element.appendChild(child1);
                engine.insertNode(DEFAULT_NAMESPACE_ID, child1, element, true);
                element.appendChild(child2);
                engine.insertNode(DEFAULT_NAMESPACE_ID, child2, element, true);
                expect(element.contains(child1)).toBe(true);
                expect(element.contains(child2)).toBe(true);
            });
        });
    });
}
exports.main = main;
var SuffixNormalizer = (function (_super) {
    __extends(SuffixNormalizer, _super);
    function SuffixNormalizer(_suffix) {
        var _this = _super.call(this) || this;
        _this._suffix = _suffix;
        return _this;
    }
    SuffixNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        return propertyName + this._suffix;
    };
    SuffixNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return value + this._suffix;
    };
    return SuffixNormalizer;
}(animation_style_normalizer_1.AnimationStyleNormalizer));
var ExactCssValueNormalizer = (function (_super) {
    __extends(ExactCssValueNormalizer, _super);
    function ExactCssValueNormalizer(_allowedValues) {
        var _this = _super.call(this) || this;
        _this._allowedValues = _allowedValues;
        return _this;
    }
    ExactCssValueNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        if (!this._allowedValues[propertyName]) {
            errors.push("The CSS property `" + propertyName + "` is not allowed");
        }
        return propertyName;
    };
    ExactCssValueNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        var expectedValue = this._allowedValues[userProvidedProperty];
        if (expectedValue != value) {
            errors.push("The CSS property `" + userProvidedProperty + "` is not allowed to be `" + value + "`");
        }
        return expectedValue;
    };
    return ExactCssValueNormalizer;
}(animation_style_normalizer_1.AnimationStyleNormalizer));
function registerTrigger(element, engine, metadata, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    var errors = [];
    var name = metadata.name;
    var ast = animation_ast_builder_1.buildAnimationAst(metadata, errors);
    if (errors.length) {
    }
    var trigger = animation_trigger_1.buildTrigger(name, ast);
    engine.register(id, element);
    engine.registerTrigger(id, name, trigger);
}
function setProperty(element, engine, property, value, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    engine.trigger(id, element, property, value);
}
function listen(element, engine, eventName, phaseName, callback, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    return engine.listen(id, element, eventName, phaseName, callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9yZW5kZXIvdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQWlLO0FBR2pLLDZFQUFzRTtBQUN0RSxxRUFBNkQ7QUFDN0QsMkdBQW9JO0FBQ3BJLDRGQUF1RjtBQUN2RixpRkFBaUc7QUFFakcsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFFbEM7SUFDRSxJQUFNLE1BQU0sR0FBRyxJQUFJLDJDQUFtQixFQUFFLENBQUM7SUFFekMsdURBQXVEO0lBQ3ZELEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUUxQyxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsSUFBSSxPQUFZLENBQUM7UUFFakIsVUFBVSxDQUFDO1lBQ1QsMkNBQW1CLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUM3QixPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxjQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsb0JBQW9CLFVBQXFDO1lBQ3ZELElBQU0sTUFBTSxHQUNSLElBQUksdURBQXlCLENBQUMsTUFBTSxFQUFFLFVBQVUsSUFBSSxJQUFJLHlEQUE0QixFQUFFLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsZUFB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