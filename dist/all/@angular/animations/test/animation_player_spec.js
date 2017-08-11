"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var testing_1 = require("@angular/core/testing");
var fake_async_1 = require("../../core/testing/src/fake_async");
var animation_player_1 = require("../src/players/animation_player");
function main() {
    describe('NoopAnimationPlayer', function () {
        it('should finish after the next microtask once started', testing_1.fakeAsync(function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            fake_async_1.flushMicrotasks();
            expect(log).toEqual([]);
            player.play();
            expect(log).toEqual(['started']);
            fake_async_1.flushMicrotasks();
            expect(log).toEqual(['started', 'done']);
        }));
        it('should fire all callbacks when destroyed', function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            player.onDestroy(function () { return log.push('destroy'); });
            expect(log).toEqual([]);
            player.destroy();
            expect(log).toEqual(['started', 'done', 'destroy']);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3BsYXllcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy90ZXN0L2FuaW1hdGlvbl9wbGF5ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlEQUFnRDtBQUVoRCxnRUFBa0U7QUFDbEUsb0VBQW9FO0FBRXBFO0lBQ0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxtQkFBUyxDQUFDO1lBQy9ELElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUV6QixJQUFNLE1BQU0sR0FBRyxJQUFJLHNDQUFtQixFQUFFLENBQUM7WUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFNLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztZQUN0Qyw0QkFBZSxFQUFFLENBQUM7WUFFbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUVqQyw0QkFBZSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBTSxHQUFHLEdBQWEsRUFBRSxDQUFDO1lBRXpCLElBQU0sTUFBTSxHQUFHLElBQUksc0NBQW1CLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQU0sT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBL0JELG9CQStCQyJ9