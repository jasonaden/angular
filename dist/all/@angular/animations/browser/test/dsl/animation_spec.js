"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_1 = require("../../src/dsl/animation");
var animation_ast_builder_1 = require("../../src/dsl/animation_ast_builder");
var testing_1 = require("../../testing");
function createDiv() {
    return document.createElement('div');
}
function main() {
    describe('Animation', function () {
        // these tests are only mean't to be run within the DOM (for now)
        if (typeof Element == 'undefined')
            return;
        var rootElement;
        var subElement1;
        var subElement2;
        beforeEach(function () {
            rootElement = createDiv();
            subElement1 = createDiv();
            subElement2 = createDiv();
            document.body.appendChild(rootElement);
            rootElement.appendChild(subElement1);
            rootElement.appendChild(subElement2);
        });
        afterEach(function () { document.body.removeChild(rootElement); });
        describe('validation', function () {
            it('should throw an error if one or more but not all keyframes() styles contain offsets', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0 }),
                    animations_1.style({ opacity: 1, offset: 1 }),
                ]));
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/Not all style\(\) steps within the declared keyframes\(\) contain offsets/);
            });
            it('should throw an error if not all offsets are between 0 and 1', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: -1 }),
                    animations_1.style({ opacity: 1, offset: 1 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are between 0 and 1/);
                steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: 0 }),
                    animations_1.style({ opacity: 1, offset: 1.1 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are between 0 and 1/);
            });
            it('should throw an error if a smaller offset shows up after a bigger one', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: 1 }),
                    animations_1.style({ opacity: 1, offset: 0 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are in order/);
            });
            it('should throw an error if any styles overlap during parallel animations', function () {
                var steps = animations_1.group([
                    animations_1.sequence([
                        // 0 -> 2000ms
                        animations_1.style({ opacity: 0 }), animations_1.animate('500ms', animations_1.style({ opacity: .25 })),
                        animations_1.animate('500ms', animations_1.style({ opacity: .5 })), animations_1.animate('500ms', animations_1.style({ opacity: .75 })),
                        animations_1.animate('500ms', animations_1.style({ opacity: 1 }))
                    ]),
                    animations_1.animate('1s 500ms', animations_1.keyframes([
                        // 0 -> 1500ms
                        animations_1.style({ width: 0 }),
                        animations_1.style({ opacity: 1, width: 1000 }),
                    ]))
                ]);
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/The CSS property "opacity" that exists between the times of "0ms" and "2000ms" is also being animated in a parallel animation between the times of "0ms" and "1500ms"/);
            });
            it('should not throw an error if animations overlap in different query levels within different transitions', function () {
                var steps = animations_1.trigger('myAnimation', [
                    animations_1.transition('a => b', animations_1.group([
                        animations_1.query('h1', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                        animations_1.query('h2', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                    ])),
                    animations_1.transition('b => a', animations_1.group([
                        animations_1.query('h1', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                        animations_1.query('h2', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                    ])),
                ]);
                expect(function () { return validateAndThrowAnimationSequence(steps); }).not.toThrow();
            });
            it('should throw an error if an animation time is invalid', function () {
                var steps = [animations_1.animate('500xs', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/The provided timing value "500xs" is invalid/);
                var steps2 = [animations_1.animate('500ms 500ms 500ms ease-out', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/The provided timing value "500ms 500ms 500ms ease-out" is invalid/);
            });
            it('should throw if negative durations are used', function () {
                var steps = [animations_1.animate(-1000, animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Duration values below 0 are not allowed for this animation step/);
                var steps2 = [animations_1.animate('-1s', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/Duration values below 0 are not allowed for this animation step/);
            });
            it('should throw if negative delays are used', function () {
                var steps = [animations_1.animate('1s -500ms', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Delay values below 0 are not allowed for this animation step/);
                var steps2 = [animations_1.animate('1s -0.5s', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/Delay values below 0 are not allowed for this animation step/);
            });
            it('should throw if keyframes() is not used inside of animate()', function () {
                var steps = [animations_1.keyframes([])];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/keyframes\(\) must be placed inside of a call to animate\(\)/);
                var steps2 = [animations_1.group([animations_1.keyframes([])])];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/keyframes\(\) must be placed inside of a call to animate\(\)/);
            });
            it('should throw if dynamic style substitutions are used without defaults within state() definitions', function () {
                var steps = [animations_1.state('final', animations_1.style({
                        'width': '{{ one }}px',
                        'borderRadius': '{{ two }}px {{ three }}px',
                    }))];
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/state\("final", ...\) must define default values for all the following style substitutions: one, two, three/);
                var steps2 = [animations_1.state('panfinal', animations_1.style({
                        'color': '{{ greyColor }}',
                        'borderColor': '1px solid {{ greyColor }}',
                        'backgroundColor': '{{ redColor }}',
                    }), { params: { redColor: 'maroon' } })];
                expect(function () { validateAndThrowAnimationSequence(steps2); })
                    .toThrowError(/state\("panfinal", ...\) must define default values for all the following style substitutions: greyColor/);
            });
        });
        describe('keyframe building', function () {
            describe('style() / animate()', function () {
                it('should produce a balanced series of keyframes given a sequence of animate steps', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.animate(1000, animations_1.style({ height: 50 })),
                        animations_1.animate(1000, animations_1.style({ width: 100 })), animations_1.animate(1000, animations_1.style({ height: 150 })),
                        animations_1.animate(1000, animations_1.style({ width: 200 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { height: animations_1.AUTO_STYLE, width: 0, offset: 0 },
                        { height: 50, width: 0, offset: .25 },
                        { height: 50, width: 100, offset: .5 },
                        { height: 150, width: 100, offset: .75 },
                        { height: 150, width: 200, offset: 1 },
                    ]);
                });
                it('should fill in missing starting steps when a starting `style()` value is not used', function () {
                    var steps = [animations_1.animate(1000, animations_1.style({ width: 999 }))];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { width: animations_1.AUTO_STYLE, offset: 0 }, { width: 999, offset: 1 }
                    ]);
                });
                it('should merge successive style() calls together before an animate() call', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.style({ height: 0 }), animations_1.style({ width: 200 }), animations_1.style({ opacity: 0 }),
                        animations_1.animate(1000, animations_1.style({ width: 100, height: 400, opacity: 1 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { width: 200, height: 0, opacity: 0, offset: 0 },
                        { width: 100, height: 400, opacity: 1, offset: 1 }
                    ]);
                });
                it('should not merge in successive style() calls to the previous animate() keyframe', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.style({ opacity: .6 }),
                        animations_1.animate(1000, animations_1.style({ opacity: 1 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var keyframes = humanizeOffsets(players[0].keyframes, 4);
                    expect(keyframes).toEqual([
                        { opacity: 0, offset: 0 },
                        { opacity: .5, offset: .4998 },
                        { opacity: .6, offset: .5002 },
                        { opacity: 1, offset: 1 },
                    ]);
                });
                it('should support an easing value that uses cubic-bezier(...)', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('1s cubic-bezier(.29, .55 ,.53 ,1.53)', animations_1.style({ opacity: 1 }))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    var firstKeyframe = player.keyframes[0];
                    var firstKeyframeEasing = firstKeyframe['easing'];
                    expect(firstKeyframeEasing.replace(/\s+/g, '')).toEqual('cubic-bezier(.29,.55,.53,1.53)');
                });
            });
            describe('sequence()', function () {
                it('should not produce extra timelines when multiple sequences are used within each other', function () {
                    var steps = [
                        animations_1.style({ width: 0 }),
                        animations_1.animate(1000, animations_1.style({ width: 100 })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: 200 })),
                            animations_1.sequence([
                                animations_1.animate(1000, animations_1.style({ width: 300 })),
                            ]),
                        ]),
                        animations_1.animate(1000, animations_1.style({ width: 400 })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: 500 })),
                        ]),
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { width: 0, offset: 0 }, { width: 100, offset: .2 }, { width: 200, offset: .4 },
                        { width: 300, offset: .6 }, { width: 400, offset: .8 }, { width: 500, offset: 1 }
                    ]);
                });
                it('should create a new timeline after a sequence if group() or keyframe() commands are used within', function () {
                    var steps = [
                        animations_1.style({ width: 100, height: 100 }), animations_1.animate(1000, animations_1.style({ width: 150, height: 150 })),
                        animations_1.sequence([
                            animations_1.group([
                                animations_1.animate(1000, animations_1.style({ height: 200 })),
                            ]),
                            animations_1.animate(1000, animations_1.keyframes([animations_1.style({ width: 180 }), animations_1.style({ width: 200 })]))
                        ]),
                        animations_1.animate(1000, animations_1.style({ width: 500, height: 500 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { width: 200, height: 200, offset: 0 }, { width: 500, height: 500, offset: 1 }
                    ]);
                });
                it('should push the start of a sequence if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: '200px' })),
                        ], { delay: 500 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '200px', offset: 1 },
                    ]);
                    expect(finalPlayer.delay).toEqual(1500);
                });
            });
            describe('subtitutions', function () {
                it('should allow params to be subtituted even if they are not defaulted in a reusable animation', function () {
                    var myAnimation = animations_1.animation([
                        animations_1.style({ left: '{{ start }}' }),
                        animations_1.animate(1000, animations_1.style({ left: '{{ end }}' })),
                    ]);
                    var steps = [
                        animations_1.useAnimation(myAnimation, { params: { start: '0px', end: '100px' } }),
                    ];
                    var players = invokeAnimationSequence(rootElement, steps, {});
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { left: '0px', offset: 0 },
                        { left: '100px', offset: 1 },
                    ]);
                });
                it('should substitute in timing values', function () {
                    function makeAnimation(exp, options) {
                        var steps = [animations_1.style({ opacity: 0 }), animations_1.animate(exp, animations_1.style({ opacity: 1 }))];
                        return invokeAnimationSequence(rootElement, steps, options);
                    }
                    var players = makeAnimation('{{ duration }}', buildParams({ duration: '1234ms' }));
                    expect(players[0].duration).toEqual(1234);
                    players = makeAnimation('{{ duration }}', buildParams({ duration: '9s 2s' }));
                    expect(players[0].duration).toEqual(11000);
                    players = makeAnimation('{{ duration }} 1s', buildParams({ duration: '1.5s' }));
                    expect(players[0].duration).toEqual(2500);
                    players = makeAnimation('{{ duration }} {{ delay }}', buildParams({ duration: '1s', delay: '2s' }));
                    expect(players[0].duration).toEqual(3000);
                });
                it('should allow multiple substitutions to occur within the same style value', function () {
                    var steps = [
                        animations_1.style({ transform: '' }),
                        animations_1.animate(1000, animations_1.style({ transform: 'translateX({{ x }}) translateY({{ y }})' }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps, buildParams({ x: '200px', y: '400px' }));
                    expect(players[0].keyframes).toEqual([
                        { offset: 0, transform: '' },
                        { offset: 1, transform: 'translateX(200px) translateY(400px)' }
                    ]);
                });
                it('should substitute in values that are defined as parameters for inner areas of a sequence', function () {
                    var steps = animations_1.sequence([
                        animations_1.sequence([
                            animations_1.sequence([
                                animations_1.style({ height: '{{ x0 }}px' }),
                                animations_1.animate(1000, animations_1.style({ height: '{{ x2 }}px' })),
                            ], buildParams({ x2: '{{ x1 }}3' })),
                        ], buildParams({ x1: '{{ x0 }}2' })),
                    ], buildParams({ x0: '1' }));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { offset: 0, height: '1px' }, { offset: 1, height: '123px' }
                    ]);
                });
                it('should substitute in values that are defined as parameters for reusable animations', function () {
                    var anim = animations_1.animation([
                        animations_1.style({ height: '{{ start }}' }),
                        animations_1.animate(1000, animations_1.style({ height: '{{ end }}' })),
                    ]);
                    var steps = animations_1.sequence([
                        animations_1.sequence([
                            animations_1.useAnimation(anim, buildParams({ start: '{{ a }}', end: '{{ b }}' })),
                        ], buildParams({ a: '100px', b: '200px' })),
                    ], buildParams({ a: '0px' }));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { offset: 0, height: '100px' }, { offset: 1, height: '200px' }
                    ]);
                });
                it('should throw an error when an input variable is not provided when invoked and is not a default value', function () {
                    expect(function () { return invokeAnimationSequence(rootElement, [animations_1.style({ color: '{{ color }}' })]); })
                        .toThrowError(/Please provide a value for the animation param color/);
                    expect(function () { return invokeAnimationSequence(rootElement, [
                        animations_1.style({ color: '{{ start }}' }),
                        animations_1.animate('{{ time }}', animations_1.style({ color: '{{ end }}' })),
                    ], buildParams({ start: 'blue', end: 'red' })); })
                        .toThrowError(/Please provide a value for the animation param time/);
                });
            });
            describe('keyframes()', function () {
                it('should produce a sub timeline when `keyframes()` is used within a sequence', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                        animations_1.animate(1000, animations_1.keyframes([animations_1.style({ height: 0 }), animations_1.style({ height: 100 }), animations_1.style({ height: 50 })])),
                        animations_1.animate(1000, animations_1.style({ height: 0, opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(3);
                    var player0 = players[0];
                    expect(player0.delay).toEqual(0);
                    expect(player0.keyframes).toEqual([
                        { opacity: animations_1.AUTO_STYLE, offset: 0 },
                        { opacity: .5, offset: .5 },
                        { opacity: 1, offset: 1 },
                    ]);
                    var subPlayer = players[1];
                    expect(subPlayer.delay).toEqual(2000);
                    expect(subPlayer.keyframes).toEqual([
                        { height: 0, offset: 0 },
                        { height: 100, offset: .5 },
                        { height: 50, offset: 1 },
                    ]);
                    var player1 = players[2];
                    expect(player1.delay).toEqual(3000);
                    expect(player1.keyframes).toEqual([
                        { opacity: 1, height: 50, offset: 0 }, { opacity: 0, height: 0, offset: 1 }
                    ]);
                });
                it('should propagate inner keyframe style data to the parent timeline if used afterwards', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                        animations_1.animate(1000, animations_1.style({ opacity: 1 })), animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ color: 'red' }),
                            animations_1.style({ color: 'blue' }),
                        ])),
                        animations_1.animate(1000, animations_1.style({ color: 'green', opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { opacity: 1, color: 'blue', offset: 0 }, { opacity: 0, color: 'green', offset: 1 }
                    ]);
                });
                it('should feed in starting data into inner keyframes if used in an style step beforehand', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ opacity: .8, offset: .5 }),
                            animations_1.style({ opacity: 1, offset: 1 }),
                        ]))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(2);
                    var topPlayer = players[0];
                    expect(topPlayer.keyframes).toEqual([
                        { opacity: animations_1.AUTO_STYLE, offset: 0 }, { opacity: .5, offset: 1 }
                    ]);
                    var subPlayer = players[1];
                    expect(subPlayer.keyframes).toEqual([
                        { opacity: .5, offset: 0 }, { opacity: .8, offset: 0.5 }, { opacity: 1, offset: 1 }
                    ]);
                });
                it('should set the easing value as an easing value for the entire timeline', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                        animations_1.animate('1s ease-out', animations_1.keyframes([animations_1.style({ opacity: .8, offset: .5 }), animations_1.style({ opacity: 1, offset: 1 })]))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[1];
                    expect(player.easing).toEqual('ease-out');
                });
                it('should combine the starting time + the given delay as the delay value for the animated keyframes', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(500, animations_1.style({ opacity: .5 })),
                        animations_1.animate('1s 2s ease-out', animations_1.keyframes([animations_1.style({ opacity: .8, offset: .5 }), animations_1.style({ opacity: 1, offset: 1 })]))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[1];
                    expect(player.delay).toEqual(2500);
                });
                it('should not leak in additional styles used later on after keyframe styles have already been declared', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ height: '50px' })),
                        animations_1.animate(2000, animations_1.keyframes([
                            animations_1.style({ left: '0', transform: 'rotate(0deg)', offset: 0 }),
                            animations_1.style({
                                left: '40%',
                                transform: 'rotate(250deg) translateY(-200px)',
                                offset: .33
                            }),
                            animations_1.style({ left: '60%', transform: 'rotate(180deg) translateY(200px)', offset: .66 }),
                            animations_1.style({ left: 'calc(100% - 100px)', transform: 'rotate(0deg)', offset: 1 }),
                        ])),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ width: '200px' }))]),
                        animations_1.animate('2s', animations_1.style({ height: '300px' })),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ height: '500px', width: '500px' }))])
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(5);
                    var firstPlayerKeyframes = players[0].keyframes;
                    expect(firstPlayerKeyframes[0]['width']).toBeFalsy();
                    expect(firstPlayerKeyframes[1]['width']).toBeFalsy();
                    expect(firstPlayerKeyframes[0]['height']).toEqual(animations_1.AUTO_STYLE);
                    expect(firstPlayerKeyframes[1]['height']).toEqual('50px');
                    var keyframePlayerKeyframes = players[1].keyframes;
                    expect(keyframePlayerKeyframes[0]['width']).toBeFalsy();
                    expect(keyframePlayerKeyframes[0]['height']).toBeFalsy();
                    var groupPlayerKeyframes = players[2].keyframes;
                    expect(groupPlayerKeyframes[0]['width']).toEqual(animations_1.AUTO_STYLE);
                    expect(groupPlayerKeyframes[1]['width']).toEqual('200px');
                    expect(groupPlayerKeyframes[0]['height']).toBeFalsy();
                    expect(groupPlayerKeyframes[1]['height']).toBeFalsy();
                    var secondToFinalAnimatePlayerKeyframes = players[3].keyframes;
                    expect(secondToFinalAnimatePlayerKeyframes[0]['width']).toBeFalsy();
                    expect(secondToFinalAnimatePlayerKeyframes[1]['width']).toBeFalsy();
                    expect(secondToFinalAnimatePlayerKeyframes[0]['height']).toEqual('50px');
                    expect(secondToFinalAnimatePlayerKeyframes[1]['height']).toEqual('300px');
                    var finalAnimatePlayerKeyframes = players[4].keyframes;
                    expect(finalAnimatePlayerKeyframes[0]['width']).toEqual('200px');
                    expect(finalAnimatePlayerKeyframes[1]['width']).toEqual('500px');
                    expect(finalAnimatePlayerKeyframes[0]['height']).toEqual('300px');
                    expect(finalAnimatePlayerKeyframes[1]['height']).toEqual('500px');
                });
                it('should respect offsets if provided directly within the style data', function () {
                    var steps = animations_1.animate(1000, animations_1.keyframes([
                        animations_1.style({ opacity: 0, offset: 0 }), animations_1.style({ opacity: .6, offset: .6 }),
                        animations_1.style({ opacity: 1, offset: 1 })
                    ]));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: .6, offset: .6 }, { opacity: 1, offset: 1 }
                    ]);
                });
                it('should respect offsets if provided directly within the style metadata type', function () {
                    var steps = animations_1.animate(1000, animations_1.keyframes([
                        { type: 6 /* Style */, offset: 0, styles: { opacity: 0 } },
                        { type: 6 /* Style */, offset: .4, styles: { opacity: .4 } },
                        { type: 6 /* Style */, offset: 1, styles: { opacity: 1 } },
                    ]));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: .4, offset: .4 }, { opacity: 1, offset: 1 }
                    ]);
                });
            });
            describe('group()', function () {
                it('should properly tally style data within a group() for use in a follow-up animate() step', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }), animations_1.animate(1000, animations_1.style({ width: 20, height: 50 })),
                        animations_1.group([animations_1.animate('1s 1s', animations_1.style({ width: 200 })), animations_1.animate('1s', animations_1.style({ height: 500 }))]),
                        animations_1.animate(1000, animations_1.style({ width: 1000, height: 1000 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var player0 = players[0];
                    expect(player0.duration).toEqual(1000);
                    expect(player0.keyframes).toEqual([
                        { width: 0, height: 0, offset: 0 }, { width: 20, height: 50, offset: 1 }
                    ]);
                    var gPlayer1 = players[1];
                    expect(gPlayer1.duration).toEqual(2000);
                    expect(gPlayer1.delay).toEqual(1000);
                    expect(gPlayer1.keyframes).toEqual([
                        { width: 20, offset: 0 }, { width: 20, offset: .5 }, { width: 200, offset: 1 }
                    ]);
                    var gPlayer2 = players[2];
                    expect(gPlayer2.duration).toEqual(1000);
                    expect(gPlayer2.delay).toEqual(1000);
                    expect(gPlayer2.keyframes).toEqual([
                        { height: 50, offset: 0 }, { height: 500, offset: 1 }
                    ]);
                    var player1 = players[3];
                    expect(player1.duration).toEqual(1000);
                    expect(player1.delay).toEqual(3000);
                    expect(player1.keyframes).toEqual([
                        { width: 200, height: 500, offset: 0 }, { width: 1000, height: 1000, offset: 1 }
                    ]);
                });
                it('should support groups with nested sequences', function () {
                    var steps = [animations_1.group([
                            animations_1.sequence([
                                animations_1.style({ opacity: 0 }),
                                animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                            ]),
                            animations_1.sequence([
                                animations_1.style({ width: 0 }),
                                animations_1.animate(1000, animations_1.style({ width: 200 })),
                            ])
                        ])];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(2);
                    var gPlayer1 = players[0];
                    expect(gPlayer1.delay).toEqual(0);
                    expect(gPlayer1.keyframes).toEqual([
                        { opacity: 0, offset: 0 },
                        { opacity: 1, offset: 1 },
                    ]);
                    var gPlayer2 = players[1];
                    expect(gPlayer1.delay).toEqual(0);
                    expect(gPlayer2.keyframes).toEqual([{ width: 0, offset: 0 }, { width: 200, offset: 1 }]);
                });
                it('should respect delays after group entries', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }), animations_1.animate(1000, animations_1.style({ width: 50, height: 50 })), animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: 100 })),
                            animations_1.animate(1000, animations_1.style({ height: 100 })),
                        ]),
                        animations_1.animate('1s 1s', animations_1.style({ height: 200, width: 200 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(2000);
                    expect(finalPlayer.duration).toEqual(2000);
                    expect(finalPlayer.keyframes).toEqual([
                        { width: 100, height: 100, offset: 0 },
                        { width: 100, height: 100, offset: .5 },
                        { width: 200, height: 200, offset: 1 },
                    ]);
                });
                it('should respect delays after multiple calls to group()', function () {
                    var steps = [
                        animations_1.group([animations_1.animate('2s', animations_1.style({ opacity: 1 })), animations_1.animate('2s', animations_1.style({ width: '100px' }))]),
                        animations_1.animate(2000, animations_1.style({ width: 0, opacity: 0 })),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ opacity: 1 })), animations_1.animate('2s', animations_1.style({ width: '200px' }))]),
                        animations_1.animate(2000, animations_1.style({ width: 0, opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var middlePlayer = players[2];
                    expect(middlePlayer.delay).toEqual(2000);
                    expect(middlePlayer.duration).toEqual(2000);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(6000);
                    expect(finalPlayer.duration).toEqual(2000);
                });
                it('should push the start of a group if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ width: '0px', height: '0px' }),
                        animations_1.animate(1500, animations_1.style({ width: '100px', height: '100px' })),
                        animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: '200px' })),
                            animations_1.animate(2000, animations_1.style({ height: '200px' })),
                        ], { delay: 300 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalWidthPlayer = players[players.length - 2];
                    var finalHeightPlayer = players[players.length - 1];
                    expect(finalWidthPlayer.delay).toEqual(1800);
                    expect(finalWidthPlayer.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '200px', offset: 1 },
                    ]);
                    expect(finalHeightPlayer.delay).toEqual(1800);
                    expect(finalHeightPlayer.keyframes).toEqual([
                        { height: '100px', offset: 0 },
                        { height: '200px', offset: 1 },
                    ]);
                });
            });
            describe('query()', function () {
                it('should delay the query operation if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                        animations_1.query('div', [
                            animations_1.style({ width: 0 }),
                            animations_1.animate(500, animations_1.style({ width: 200 })),
                        ], { delay: 200 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(1200);
                });
                it('should throw an error when an animation query returns zero elements', function () {
                    var steps = [animations_1.query('somethingFake', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])];
                    expect(function () { invokeAnimationSequence(rootElement, steps); })
                        .toThrowError(/`query\("somethingFake"\)` returned zero elements\. \(Use `query\("somethingFake", \{ optional: true \}\)` if you wish to allow this\.\)/);
                });
                it('should allow a query to be skipped if it is set as optional and returns zero elements', function () {
                    var steps = [animations_1.query('somethingFake', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))], { optional: true })];
                    expect(function () { invokeAnimationSequence(rootElement, steps); }).not.toThrow();
                    var steps2 = [animations_1.query('fakeSomethings', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))], { optional: true })];
                    expect(function () { invokeAnimationSequence(rootElement, steps2); }).not.toThrow();
                });
                it('should delay the query operation if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1300, animations_1.style({ opacity: 1 })),
                        animations_1.query('div', [
                            animations_1.style({ width: 0 }),
                            animations_1.animate(500, animations_1.style({ width: 200 })),
                        ], { delay: 300 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var fp1 = players[players.length - 2];
                    var fp2 = players[players.length - 1];
                    expect(fp1.delay).toEqual(1600);
                    expect(fp2.delay).toEqual(1600);
                });
            });
            describe('timing values', function () {
                it('should properly combine an easing value with a delay into a set of three keyframes', function () {
                    var steps = [animations_1.style({ opacity: 0 }), animations_1.animate('3s 1s ease-out', animations_1.style({ opacity: 1 }))];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: 0, offset: .25, easing: 'ease-out' },
                        { opacity: 1, offset: 1 }
                    ]);
                });
                it('should allow easing values to exist for each animate() step', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.animate('1s linear', animations_1.style({ width: 10 })),
                        animations_1.animate('2s ease-out', animations_1.style({ width: 20 })), animations_1.animate('1s ease-in', animations_1.style({ width: 30 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { width: 0, offset: 0, easing: 'linear' }, { width: 10, offset: .25, easing: 'ease-out' },
                        { width: 20, offset: .75, easing: 'ease-in' }, { width: 30, offset: 1 }
                    ]);
                });
                it('should produce a top-level timeline only for the duration that is set as before a group kicks in', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0, opacity: 0 }),
                        animations_1.animate('1s', animations_1.style({ width: 100, height: 100, opacity: .2 })), animations_1.group([
                            animations_1.animate('500ms 1s', animations_1.style({ width: 500 })), animations_1.animate('1s', animations_1.style({ height: 500 })),
                            animations_1.sequence([
                                animations_1.animate(500, animations_1.style({ opacity: .5 })),
                                animations_1.animate(500, animations_1.style({ opacity: .6 })),
                                animations_1.animate(500, animations_1.style({ opacity: .7 })),
                                animations_1.animate(500, animations_1.style({ opacity: 1 })),
                            ])
                        ])
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    expect(player.duration).toEqual(1000);
                    expect(player.delay).toEqual(0);
                });
                it('should offset group() and keyframe() timelines with a delay which is the current time of the previous player when called', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }),
                        animations_1.animate('1500ms linear', animations_1.style({ width: 10, height: 10 })), animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: 500, height: 500 })),
                            animations_1.animate(2000, animations_1.style({ width: 500, height: 500 }))
                        ]),
                        animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ width: 200 }),
                            animations_1.style({ width: 500 }),
                        ]))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].delay).toEqual(0); // top-level animation
                    expect(players[1].delay).toEqual(1500); // first entry in group()
                    expect(players[2].delay).toEqual(1500); // second entry in group()
                    expect(players[3].delay).toEqual(3500); // animate(...keyframes())
                });
            });
            describe('state based data', function () {
                it('should create an empty animation if there are zero animation steps', function () {
                    var steps = [];
                    var fromStyles = [{ background: 'blue', height: 100 }];
                    var toStyles = [{ background: 'red' }];
                    var player = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles)[0];
                    expect(player.duration).toEqual(0);
                    expect(player.keyframes).toEqual([]);
                });
                it('should produce an animation from start to end between the to and from styles if there are animate steps in between', function () {
                    var steps = [animations_1.animate(1000)];
                    var fromStyles = [{ background: 'blue', height: 100 }];
                    var toStyles = [{ background: 'red' }];
                    var players = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles);
                    expect(players[0].keyframes).toEqual([
                        { background: 'blue', height: 100, offset: 0 },
                        { background: 'red', height: animations_1.AUTO_STYLE, offset: 1 }
                    ]);
                });
                it('should produce an animation from start to end between the to and from styles if there are animate steps in between with an easing value', function () {
                    var steps = [animations_1.animate('1s ease-out')];
                    var fromStyles = [{ background: 'blue' }];
                    var toStyles = [{ background: 'red' }];
                    var players = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles);
                    expect(players[0].keyframes).toEqual([
                        { background: 'blue', offset: 0, easing: 'ease-out' },
                        { background: 'red', offset: 1 }
                    ]);
                });
            });
        });
    });
}
exports.main = main;
function humanizeOffsets(keyframes, digits) {
    if (digits === void 0) { digits = 3; }
    return keyframes.map(function (keyframe) {
        keyframe['offset'] = Number(parseFloat(keyframe['offset']).toFixed(digits));
        return keyframe;
    });
}
function invokeAnimationSequence(element, steps, locals, startingStyles, destinationStyles, subInstructions) {
    if (locals === void 0) { locals = {}; }
    if (startingStyles === void 0) { startingStyles = []; }
    if (destinationStyles === void 0) { destinationStyles = []; }
    var driver = new testing_1.MockAnimationDriver();
    return new animation_1.Animation(driver, steps)
        .buildTimelines(element, startingStyles, destinationStyles, locals, subInstructions);
}
function validateAndThrowAnimationSequence(steps) {
    var errors = [];
    var ast = animation_ast_builder_1.buildAnimationAst(steps, errors);
    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9kc2wvYW5pbWF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBNk07QUFHN00scURBQWtEO0FBQ2xELDZFQUFzRTtBQUd0RSx5Q0FBa0Q7QUFFbEQ7SUFDRSxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQ7SUFDRSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLGlFQUFpRTtRQUNqRSxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxXQUFXLENBQUM7WUFBQyxNQUFNLENBQUM7UUFFMUMsSUFBSSxXQUFnQixDQUFDO1FBQ3JCLElBQUksV0FBZ0IsQ0FBQztRQUNyQixJQUFJLFdBQWdCLENBQUM7UUFFckIsVUFBVSxDQUFDO1lBQ1QsV0FBVyxHQUFHLFNBQVMsRUFBRSxDQUFDO1lBQzFCLFdBQVcsR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUMxQixXQUFXLEdBQUcsU0FBUyxFQUFFLENBQUM7WUFDMUIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEVBQUUsQ0FBQyxxRkFBcUYsRUFDckY7Z0JBQ0UsSUFBTSxLQUFLLEdBQUcsb0JB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