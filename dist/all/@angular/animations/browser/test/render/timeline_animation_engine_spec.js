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
var animation_style_normalizer_1 = require("../../src/dsl/style_normalization/animation_style_normalizer");
var timeline_animation_engine_1 = require("../../src/render/timeline_animation_engine");
var mock_animation_driver_1 = require("../../testing/src/mock_animation_driver");
function main() {
    var defaultDriver = new mock_animation_driver_1.MockAnimationDriver();
    function makeEngine(driver, normalizer) {
        return new timeline_animation_engine_1.TimelineAnimationEngine(driver || defaultDriver, normalizer || new animation_style_normalizer_1.NoopAnimationStyleNormalizer());
    }
    // these tests are only mean't to be run within the DOM
    if (typeof Element == 'undefined')
        return;
    describe('TimelineAnimationEngine', function () {
        var element;
        beforeEach(function () {
            mock_animation_driver_1.MockAnimationDriver.log = [];
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { return document.body.removeChild(element); });
        it('should animate a timeline', function () {
            var engine = makeEngine();
            var steps = [animations_1.style({ height: 100 }), animations_1.animate(1000, animations_1.style({ height: 0 }))];
            expect(mock_animation_driver_1.MockAnimationDriver.log.length).toEqual(0);
            invokeAnimation(engine, element, steps);
            expect(mock_animation_driver_1.MockAnimationDriver.log.length).toEqual(1);
        });
        it('should not destroy timeline-based animations after they have finished', function () {
            var engine = makeEngine();
            var log = [];
            function capture(value) {
                return function () { log.push(value); };
            }
            var steps = [animations_1.style({ height: 0 }), animations_1.animate(1000, animations_1.style({ height: 500 }))];
            var player = invokeAnimation(engine, element, steps);
            player.onDone(capture('done'));
            player.onDestroy(capture('destroy'));
            expect(log).toEqual([]);
            player.finish();
            expect(log).toEqual(['done']);
            player.destroy();
            expect(log).toEqual(['done', 'destroy']);
        });
        it('should normalize the style values that are animateTransitioned within an a timeline animation', function () {
            var engine = makeEngine(defaultDriver, new SuffixNormalizer('-normalized'));
            var steps = [
                animations_1.style({ width: '333px' }),
                animations_1.animate(1000, animations_1.style({ width: '999px' })),
            ];
            var player = invokeAnimation(engine, element, steps);
            expect(player.keyframes).toEqual([
                { 'width-normalized': '333px-normalized', offset: 0 },
                { 'width-normalized': '999px-normalized', offset: 1 }
            ]);
        });
        it('should normalize `*` values', function () {
            var driver = new SuperMockDriver();
            var engine = makeEngine(driver);
            var steps = [
                animations_1.style({ width: '*' }),
                animations_1.animate(1000, animations_1.style({ width: '999px' })),
            ];
            var player = invokeAnimation(engine, element, steps);
            expect(player.keyframes).toEqual([{ width: '*star*', offset: 0 }, { width: '999px', offset: 1 }]);
        });
    });
}
exports.main = main;
function invokeAnimation(engine, element, steps, id) {
    if (id === void 0) { id = 'id'; }
    engine.register(id, steps);
    return engine.create(id, element);
}
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
var SuperMockDriver = (function (_super) {
    __extends(SuperMockDriver, _super);
    function SuperMockDriver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SuperMockDriver.prototype.computeStyle = function (element, prop, defaultValue) { return '*star*'; };
    return SuperMockDriver;
}(mock_animation_driver_1.MockAnimationDriver));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBc0U7QUFFdEUsMkdBQW9JO0FBRXBJLHdGQUFtRjtBQUNuRixpRkFBaUc7QUFFakc7SUFDRSxJQUFNLGFBQWEsR0FBRyxJQUFJLDJDQUFtQixFQUFFLENBQUM7SUFFaEQsb0JBQW9CLE1BQXdCLEVBQUUsVUFBcUM7UUFDakYsTUFBTSxDQUFDLElBQUksbURBQXVCLENBQzlCLE1BQU0sSUFBSSxhQUFhLEVBQUUsVUFBVSxJQUFJLElBQUkseURBQTRCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLElBQUksV0FBVyxDQUFDO1FBQUMsTUFBTSxDQUFDO0lBRTFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtRQUNsQyxJQUFJLE9BQVksQ0FBQztRQUVqQixVQUFVLENBQUM7WUFDVCwyQ0FBbUIsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQzdCLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDO1FBRXBELEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLE1BQU0sR0FBRyxVQUFV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