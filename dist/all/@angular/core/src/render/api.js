"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../di");
/**
 * @deprecated Use `RendererType2` (and `Renderer2`) instead.
 */
var RenderComponentType = (function () {
    function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
        this.id = id;
        this.templateUrl = templateUrl;
        this.slotCount = slotCount;
        this.encapsulation = encapsulation;
        this.styles = styles;
        this.animations = animations;
    }
    return RenderComponentType;
}());
exports.RenderComponentType = RenderComponentType;
/**
 * @deprecated Debug info is handeled internally in the view engine now.
 */
var RenderDebugInfo = (function () {
    function RenderDebugInfo() {
    }
    return RenderDebugInfo;
}());
exports.RenderDebugInfo = RenderDebugInfo;
/**
 * @deprecated Use the `Renderer2` instead.
 */
var Renderer = (function () {
    function Renderer() {
    }
    return Renderer;
}());
exports.Renderer = Renderer;
exports.Renderer2Interceptor = new di_1.InjectionToken('Renderer2Interceptor');
/**
 * Injectable service that provides a low-level interface for modifying the UI.
 *
 * Use this service to bypass Angular's templating and make custom UI changes that can't be
 * expressed declaratively. For example if you need to set a property or an attribute whose name is
 * not statically known, use {@link Renderer#setElementProperty} or {@link
 * Renderer#setElementAttribute}
 * respectively.
 *
 * If you are implementing a custom renderer, you must implement this interface.
 *
 * The default Renderer implementation is `DomRenderer`. Also available is `WebWorkerRenderer`.
 *
 * @deprecated Use `RendererFactory2` instead.
 */
var RootRenderer = (function () {
    function RootRenderer() {
    }
    return RootRenderer;
}());
exports.RootRenderer = RootRenderer;
/**
 * @experimental
 */
var RendererFactory2 = (function () {
    function RendererFactory2() {
    }
    return RendererFactory2;
}());
exports.RendererFactory2 = RendererFactory2;
/**
 * @experimental
 */
var RendererStyleFlags2;
(function (RendererStyleFlags2) {
    RendererStyleFlags2[RendererStyleFlags2["Important"] = 1] = "Important";
    RendererStyleFlags2[RendererStyleFlags2["DashCase"] = 2] = "DashCase";
})(RendererStyleFlags2 = exports.RendererStyleFlags2 || (exports.RendererStyleFlags2 = {}));
/**
 * @experimental
 */
var Renderer2 = (function () {
    function Renderer2() {
    }
    return Renderer2;
}());
exports.Renderer2 = Renderer2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDRCQUErQztBQUcvQzs7R0FFRztBQUNIO0lBQ0UsNkJBQ1csRUFBVSxFQUFTLFdBQW1CLEVBQVMsU0FBaUIsRUFDaEUsYUFBZ0MsRUFBUyxNQUEyQixFQUNwRSxVQUFlO1FBRmYsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNoRSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQUNwRSxlQUFVLEdBQVYsVUFBVSxDQUFLO0lBQUcsQ0FBQztJQUNoQywwQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksa0RBQW1CO0FBT2hDOztHQUVHO0FBQ0g7SUFBQTtJQU9BLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUHFCLDBDQUFlO0FBb0JyQzs7R0FFRztBQUNIO0lBQUE7SUE2Q0EsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDO0FBN0NxQiw0QkFBUTtBQStDakIsUUFBQSxvQkFBb0IsR0FBRyxJQUFJLG1CQUFjLENBQWMsc0JBQXNCLENBQUMsQ0FBQztBQUU1Rjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZxQixvQ0FBWTtBQWNsQzs7R0FFRztBQUNIO0lBQUE7SUFLQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxxQiw0Q0FBZ0I7QUFPdEM7O0dBRUc7QUFDSCxJQUFZLG1CQUdYO0FBSEQsV0FBWSxtQkFBbUI7SUFDN0IsdUVBQWtCLENBQUE7SUFDbEIscUVBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUhXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBRzlCO0FBRUQ7O0dBRUc7QUFDSDtJQUFBO0lBNENBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUE1Q0QsSUE0Q0M7QUE1Q3FCLDhCQUFTIn0=