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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var control_container_1 = require("./control_container");
var ng_control_1 = require("./ng_control");
var AbstractControlStatus = (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () { return this._cd.control ? this._cd.control.untouched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () { return this._cd.control ? this._cd.control.touched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () { return this._cd.control ? this._cd.control.pristine : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () { return this._cd.control ? this._cd.control.dirty : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () { return this._cd.control ? this._cd.control.valid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () { return this._cd.control ? this._cd.control.invalid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPending", {
        get: function () { return this._cd.control ? this._cd.control.pending : false; },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
exports.AbstractControlStatus = AbstractControlStatus;
exports.ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid',
    '[class.ng-pending]': 'ngClassPending',
};
/**
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status. The following classes are applied as the properties
 * become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @stable
 */
var NgControlStatus = (function (_super) {
    __extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
    }
    return NgControlStatus;
}(AbstractControlStatus));
NgControlStatus = __decorate([
    core_1.Directive({ selector: '[formControlName],[ngModel],[formControl]', host: exports.ngControlStatusHost }),
    __param(0, core_1.Self()),
    __metadata("design:paramtypes", [ng_control_1.NgControl])
], NgControlStatus);
exports.NgControlStatus = NgControlStatus;
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @stable
 */
var NgControlStatusGroup = (function (_super) {
    __extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
    }
    return NgControlStatusGroup;
}(AbstractControlStatus));
NgControlStatusGroup = __decorate([
    core_1.Directive({
        selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
        host: exports.ngControlStatusHost
    }),
    __param(0, core_1.Self()),
    __metadata("design:paramtypes", [control_container_1.ControlContainer])
], NgControlStatusGroup);
exports.NgControlStatusGroup = NgControlStatusGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBOEM7QUFHOUMseURBQXFEO0FBQ3JELDJDQUF1QztBQUV2QztJQUdFLCtCQUFZLEVBQTRCO1FBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFBQyxDQUFDO0lBRTVELHNCQUFJLG1EQUFnQjthQUFwQixjQUFrQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2pHLHNCQUFJLGlEQUFjO2FBQWxCLGNBQWdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDN0Ysc0JBQUksa0RBQWU7YUFBbkIsY0FBaUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRixzQkFBSSwrQ0FBWTthQUFoQixjQUE4QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pGLHNCQUFJLCtDQUFZO2FBQWhCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDekYsc0JBQUksaURBQWM7YUFBbEIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3RixzQkFBSSxpREFBYzthQUFsQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9GLDRCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxzREFBcUI7QUFjckIsUUFBQSxtQkFBbUIsR0FBRztJQUNqQyxzQkFBc0IsRUFBRSxrQkFBa0I7SUFDMUMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLHFCQUFxQixFQUFFLGlCQUFpQjtJQUN4QyxrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLG9CQUFvQixFQUFFLGdCQUFnQjtDQUN2QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxJQUFhLGVBQWU7SUFBUyxtQ0FBcUI7SUFDeEQseUJBQW9CLEVBQWE7ZUFBSSxrQkFBTSxFQUFFLENBQUM7SUFBRSxDQUFDO0lBQ25ELHNCQUFDO0FBQUQsQ0FBQyxBQUZELENBQXFDLHFCQUFxQixHQUV6RDtBQUZZLGVBQWU7SUFEM0IsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSwyQ0FBMkMsRUFBRSxJQUFJLEVBQUUsMkJBQW1CLEVBQUMsQ0FBQztJQUUvRSxXQUFBLFdBQUksRUFBRSxDQUFBO3FDQUFLLHNCQUFTO0dBRHRCLGVBQWUsQ0FFM0I7QUFGWSwwQ0FBZTtBQUk1Qjs7Ozs7R0FLRztBQU1ILElBQWEsb0JBQW9CO0lBQVMsd0NBQXFCO0lBQzdELDhCQUFvQixFQUFvQjtlQUFJLGtCQUFNLEVBQUUsQ0FBQztJQUFFLENBQUM7SUFDMUQsMkJBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBMEMscUJBQXFCLEdBRTlEO0FBRlksb0JBQW9CO0lBTGhDLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQ0osMEZBQTBGO1FBQzlGLElBQUksRUFBRSwyQkFBbUI7S0FDMUIsQ0FBQztJQUVhLFdBQUEsV0FBSSxFQUFFLENBQUE7cUNBQUssb0NBQWdCO0dBRDdCLG9CQUFvQixDQUVoQztBQUZZLG9EQUFvQiJ9