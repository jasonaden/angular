"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var abstract_control_directive_1 = require("./abstract_control_directive");
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * A base class that all control directive extend.
 * It binds a {@link FormControl} object to a DOM element.
 *
 * Used internally by Angular forms.
 *
 * @stable
 */
var NgControl = (function (_super) {
    __extends(NgControl, _super);
    function NgControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @internal */
        _this._parent = null;
        _this.name = null;
        _this.valueAccessor = null;
        /** @internal */
        _this._rawValidators = [];
        /** @internal */
        _this._rawAsyncValidators = [];
        return _this;
    }
    Object.defineProperty(NgControl.prototype, "validator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "asyncValidator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return NgControl;
}(abstract_control_directive_1.AbstractControlDirective));
exports.NgControl = NgControl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2NvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBR0gsMkVBQXNFO0FBS3RFO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNIO0lBQXdDLDZCQUF3QjtJQUFoRTtRQUFBLHFFQWNDO1FBYkMsZ0JBQWdCO1FBQ2hCLGFBQU8sR0FBMEIsSUFBSSxDQUFDO1FBQ3RDLFVBQUksR0FBZ0IsSUFBSSxDQUFDO1FBQ3pCLG1CQUFhLEdBQThCLElBQUksQ0FBQztRQUNoRCxnQkFBZ0I7UUFDaEIsb0JBQWMsR0FBaUMsRUFBRSxDQUFDO1FBQ2xELGdCQUFnQjtRQUNoQix5QkFBbUIsR0FBMkMsRUFBRSxDQUFDOztJQU1uRSxDQUFDO0lBSkMsc0JBQUksZ0NBQVM7YUFBYixjQUFvQyxNQUFNLENBQWMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMxRSxzQkFBSSxxQ0FBYzthQUFsQixjQUE4QyxNQUFNLENBQW1CLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFHM0YsZ0JBQUM7QUFBRCxDQUFDLEFBZEQsQ0FBd0MscURBQXdCLEdBYy9EO0FBZHFCLDhCQUFTIn0=