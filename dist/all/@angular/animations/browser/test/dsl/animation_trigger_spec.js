"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var testing_1 = require("../../testing");
var shared_1 = require("../shared");
function main() {
    describe('AnimationTrigger', function () {
        // these tests are only mean't to be run within the DOM (for now)
        if (typeof Element == 'undefined')
            return;
        var element;
        beforeEach(function () {
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { document.body.removeChild(element); });
        describe('trigger validation', function () {
            it('should group errors together for an animation trigger', function () {
                expect(function () {
                    shared_1.makeTrigger('myTrigger', [animations_1.transition('12345', animations_1.animate(3333))]);
                }).toThrowError(/Animation parsing for the myTrigger trigger have failed/);
            });
            it('should throw an error when a transition within a trigger contains an invalid expression', function () {
                expect(function () { shared_1.makeTrigger('name', [animations_1.transition('somethingThatIsWrong', animations_1.animate(3333))]); })
                    .toThrowError(/- The provided transition expression "somethingThatIsWrong" is not supported/);
            });
            it('should throw an error if an animation alias is used that is not yet supported', function () {
                expect(function () {
                    shared_1.makeTrigger('name', [animations_1.transition(':angular', animations_1.animate(3333))]);
                }).toThrowError(/- The transition alias value ":angular" is not supported/);
            });
        });
        describe('trigger usage', function () {
            it('should construct a trigger based on the states and transition data', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('on', animations_1.style({ width: 0 })),
                    animations_1.state('off', animations_1.style({ width: 100 })),
                    animations_1.transition('on => off', animations_1.animate(1000)),
                    animations_1.transition('off => on', animations_1.animate(1000)),
                ]);
                expect(result.states['on'].buildStyles({}, [])).toEqual({ width: 0 });
                expect(result.states['off'].buildStyles({}, [])).toEqual({ width: 100 });
                expect(result.transitionFactories.length).toEqual(2);
            });
            it('should allow multiple state values to use the same styles', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('on, off', animations_1.style({ width: 50 })), animations_1.transition('on => off', animations_1.animate(1000)),
                    animations_1.transition('off => on', animations_1.animate(1000))
                ]);
                expect(result.states['on'].buildStyles({}, [])).toEqual({ width: 50 });
                expect(result.states['off'].buildStyles({}, [])).toEqual({ width: 50 });
            });
            it('should find the first transition that matches', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', animations_1.animate(1234)), animations_1.transition('b => c', animations_1.animate(5678))]);
                var trans = buildTransition(result, element, 'b', 'c');
                expect(trans.timelines.length).toEqual(1);
                var timeline = trans.timelines[0];
                expect(timeline.duration).toEqual(5678);
            });
            it('should find a transition with a `*` value', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.transition('* => b', animations_1.animate(1234)), animations_1.transition('b => *', animations_1.animate(5678)),
                    animations_1.transition('* => *', animations_1.animate(9999))
                ]);
                var trans = buildTransition(result, element, 'b', 'c');
                expect(trans.timelines[0].duration).toEqual(5678);
                trans = buildTransition(result, element, 'a', 'b');
                expect(trans.timelines[0].duration).toEqual(1234);
                trans = buildTransition(result, element, 'c', 'c');
                expect(trans.timelines[0].duration).toEqual(9999);
            });
            it('should null when no results are found', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', animations_1.animate(1111))]);
                var trigger = result.matchTransition('b', 'a');
                expect(trigger).toBeFalsy();
            });
            it('should support bi-directional transition expressions', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a <=> b', animations_1.animate(2222))]);
                var t1 = buildTransition(result, element, 'a', 'b');
                expect(t1.timelines[0].duration).toEqual(2222);
                var t2 = buildTransition(result, element, 'b', 'a');
                expect(t2.timelines[0].duration).toEqual(2222);
            });
            it('should support multiple transition statements in one string', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b, b => a, c => *', animations_1.animate(1234))]);
                var t1 = buildTransition(result, element, 'a', 'b');
                expect(t1.timelines[0].duration).toEqual(1234);
                var t2 = buildTransition(result, element, 'b', 'a');
                expect(t2.timelines[0].duration).toEqual(1234);
                var t3 = buildTransition(result, element, 'c', 'a');
                expect(t3.timelines[0].duration).toEqual(1234);
            });
            describe('params', function () {
                it('should support transition-level animation variable params', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', [animations_1.style({ height: '{{ a }}' }), animations_1.animate(1000, animations_1.style({ height: '{{ b }}' }))], buildParams({ a: '100px', b: '200px' }))]);
                    var trans = buildTransition(result, element, 'a', 'b');
                    var keyframes = trans.timelines[0].keyframes;
                    expect(keyframes).toEqual([{ height: '100px', offset: 0 }, { height: '200px', offset: 1 }]);
                });
                it('should subtitute variable params provided directly within the transition match', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', [animations_1.style({ height: '{{ a }}' }), animations_1.animate(1000, animations_1.style({ height: '{{ b }}' }))], buildParams({ a: '100px', b: '200px' }))]);
                    var trans = buildTransition(result, element, 'a', 'b', {}, buildParams({ a: '300px' }));
                    var keyframes = trans.timelines[0].keyframes;
                    expect(keyframes).toEqual([{ height: '300px', offset: 0 }, { height: '200px', offset: 1 }]);
                });
            });
            it('should match `true` and `false` given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('false', animations_1.style({ color: 'red' })), animations_1.state('true', animations_1.style({ color: 'green' })),
                    animations_1.transition('true <=> false', animations_1.animate(1234))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].duration).toEqual(1234);
            });
            it('should match `1` and `0` given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('0', animations_1.style({ color: 'red' })), animations_1.state('1', animations_1.style({ color: 'green' })),
                    animations_1.transition('1 <=> 0', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].duration).toEqual(4567);
            });
            it('should match `true` and `false` state styles on a `1 <=> 0` boolean transition given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('false', animations_1.style({ color: 'red' })), animations_1.state('true', animations_1.style({ color: 'green' })),
                    animations_1.transition('1 <=> 0', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].keyframes).toEqual([
                    { offset: 0, color: 'red' }, { offset: 1, color: 'green' }
                ]);
            });
            it('should match `1` and `0` state styles on a `true <=> false` boolean transition given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('0', animations_1.style({ color: 'orange' })), animations_1.state('1', animations_1.style({ color: 'blue' })),
                    animations_1.transition('true <=> false', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].keyframes).toEqual([
                    { offset: 0, color: 'orange' }, { offset: 1, color: 'blue' }
                ]);
            });
            describe('aliases', function () {
                it('should alias the :enter transition as void => *', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition(':enter', animations_1.animate(3333))]);
                    var trans = buildTransition(result, element, 'void', 'something');
                    expect(trans.timelines[0].duration).toEqual(3333);
                });
                it('should alias the :leave transition as * => void', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition(':leave', animations_1.animate(3333))]);
                    var trans = buildTransition(result, element, 'something', 'void');
                    expect(trans.timelines[0].duration).toEqual(3333);
                });
            });
        });
    });
}
exports.main = main;
function buildTransition(trigger, element, fromState, toState, fromOptions, toOptions) {
    var trans = trigger.matchTransition(fromState, toState);
    if (trans) {
        var driver = new testing_1.MockAnimationDriver();
        return trans.build(driver, element, fromState, toState, fromOptions, toOptions);
    }
    return null;
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyaWdnZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci90ZXN0L2RzbC9hbmltYXRpb25fdHJpZ2dlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0RBQXdGO0FBSXhGLHlDQUFrRDtBQUNsRCxvQ0FBc0M7QUFFdEM7SUFDRSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsaUVBQWlFO1FBQ2pFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUUxQyxJQUFJLE9BQVksQ0FBQztRQUNqQixVQUFVLENBQUM7WUFDVCxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxjQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtnQkFDMUQsTUFBTSxDQUFDO29CQUNMLG9CQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsdUJBQVUsQ0FBQyxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseUZBQXlGLEVBQ3pGO2dCQUNFLE1BQU0sQ0FDRixjQUFRLG9CQUFXLENBQUMsTUFBTSxFQUFFLENB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