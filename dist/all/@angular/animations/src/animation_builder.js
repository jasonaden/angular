"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AnimationBuilder is an injectable service that is available when the {@link
 * BrowserAnimationsModule BrowserAnimationsModule} or {@link NoopAnimationsModule
 * NoopAnimationsModule} modules are used within an application.
 *
 * The purpose if this service is to produce an animation sequence programmatically within an
 * angular component or directive.
 *
 * Programmatic animations are first built and then a player is created when the build animation is
 * attached to an element.
 *
 * ```ts
 * // remember to include the BrowserAnimationsModule module for this to work...
 * import {AnimationBuilder} from '@angular/animations';
 *
 * class MyCmp {
 *   constructor(private _builder: AnimationBuilder) {}
 *
 *   makeAnimation(element: any) {
 *     // first build the animation
 *     const myAnimation = this._builder.build([
 *       style({ width: 0 }),
 *       animate(1000, style({ width: '100px' }))
 *     ]);
 *
 *     // then create a player from it
 *     const player = myAnimation.create(element);
 *
 *     player.play();
 *   }
 * }
 * ```
 *
 * When an animation is built an instance of {@link AnimationFactory AnimationFactory} will be
 * returned. Using that an {@link AnimationPlayer AnimationPlayer} can be created which can then be
 * used to start the animation.
 *
 * @experimental Animation support is experimental.
 */
var AnimationBuilder = (function () {
    function AnimationBuilder() {
    }
    return AnimationBuilder;
}());
exports.AnimationBuilder = AnimationBuilder;
/**
 * An instance of `AnimationFactory` is returned from {@link AnimationBuilder#build
 * AnimationBuilder.build}.
 *
 * @experimental Animation support is experimental.
 */
var AnimationFactory = (function () {
    function AnimationFactory() {
    }
    return AnimationFactory;
}());
exports.AnimationFactory = AnimationFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZxQiw0Q0FBZ0I7QUFJdEM7Ozs7O0dBS0c7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGcUIsNENBQWdCIn0=