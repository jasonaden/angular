"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var core_1 = require("@angular/core");
/**
 * @ngModule CommonModule
 *
 * @whatItDoes Inserts an embedded view from a prepared `TemplateRef`
 *
 * @howToUse
 * ```
 * <ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
 * ```
 *
 * @description
 *
 * You can attach a context object to the `EmbeddedViewRef` by setting `[ngTemplateOutletContext]`.
 * `[ngTemplateOutletContext]` should be an object, the object's keys will be available for binding
 * by the local template `let` declarations.
 *
 * Note: using the key `$implicit` in the context object will set it's value as default.
 *
 * ## Example
 *
 * {@example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}
 *
 * @experimental
 */
var NgTemplateOutlet = (function () {
    function NgTemplateOutlet(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
    }
    Object.defineProperty(NgTemplateOutlet.prototype, "ngOutletContext", {
        /**
         * @deprecated v4.0.0 - Renamed to ngTemplateOutletContext.
         */
        set: function (context) { this.ngTemplateOutletContext = context; },
        enumerable: true,
        configurable: true
    });
    NgTemplateOutlet.prototype.ngOnChanges = function (changes) {
        var recreateView = this._shouldRecreateView(changes);
        if (recreateView) {
            if (this._viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
            }
            if (this.ngTemplateOutlet) {
                this._viewRef = this._viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext);
            }
        }
        else {
            if (this._viewRef && this.ngTemplateOutletContext) {
                this._updateExistingContext(this.ngTemplateOutletContext);
            }
        }
    };
    /**
     * We need to re-create existing embedded view if:
     * - templateRef has changed
     * - context has changes
     *
     * To mark context object as changed when the corresponding object
     * shape changes (new properties are added or existing properties are removed).
     * In other words we consider context with the same properties as "the same" even
     * if object reference changes (see https://github.com/angular/angular/issues/13407).
     */
    NgTemplateOutlet.prototype._shouldRecreateView = function (changes) {
        var ctxChange = changes['ngTemplateOutletContext'];
        return !!changes['ngTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
    };
    NgTemplateOutlet.prototype._hasContextShapeChanged = function (ctxChange) {
        var prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        var currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
            for (var _i = 0, currCtxKeys_1 = currCtxKeys; _i < currCtxKeys_1.length; _i++) {
                var propName = currCtxKeys_1[_i];
                if (prevCtxKeys.indexOf(propName) === -1) {
                    return true;
                }
            }
            return false;
        }
        else {
            return true;
        }
    };
    NgTemplateOutlet.prototype._updateExistingContext = function (ctx) {
        for (var _i = 0, _a = Object.keys(ctx); _i < _a.length; _i++) {
            var propName = _a[_i];
            this._viewRef.context[propName] = this.ngTemplateOutletContext[propName];
        }
    };
    return NgTemplateOutlet;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], NgTemplateOutlet.prototype, "ngTemplateOutletContext", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef)
], NgTemplateOutlet.prototype, "ngTemplateOutlet", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], NgTemplateOutlet.prototype, "ngOutletContext", null);
NgTemplateOutlet = __decorate([
    core_1.Directive({ selector: '[ngTemplateOutlet]' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef])
], NgTemplateOutlet);
exports.NgTemplateOutlet = NgTemplateOutlet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfdGVtcGxhdGVfb3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX3RlbXBsYXRlX291dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF1STtBQUV2STs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFFSCxJQUFhLGdCQUFnQjtJQU8zQiwwQkFBb0IsaUJBQW1DO1FBQW5DLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7SUFBRyxDQUFDO0lBTTNELHNCQUFJLDZDQUFlO1FBSm5COztXQUVHO2FBRUgsVUFBb0IsT0FBZSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVoRixzQ0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMvRSxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQ3JELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUMzRCxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ssOENBQW1CLEdBQTNCLFVBQTRCLE9BQXNCO1FBQ2hELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVPLGtEQUF1QixHQUEvQixVQUFnQyxTQUF1QjtRQUNyRCxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUMsR0FBRyxDQUFDLENBQWlCLFVBQVcsRUFBWCwyQkFBVyxFQUFYLHlCQUFXLEVBQVgsSUFBVztnQkFBM0IsSUFBSSxRQUFRLG9CQUFBO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRjtZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFTyxpREFBc0IsR0FBOUIsVUFBK0IsR0FBVztRQUN4QyxHQUFHLENBQUMsQ0FBaUIsVUFBZ0IsRUFBaEIsS0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFoQixjQUFnQixFQUFoQixJQUFnQjtZQUFoQyxJQUFJLFFBQVEsU0FBQTtZQUNULElBQUksQ0FBQyxRQUFRLENBQUMsT0FBUSxDQUFDLFFBQVEsQ0FBQyxHQUFTLElBQUksQ0FBQyx1QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4RjtJQUNILENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUF0RUQsSUFzRUM7QUFuRVU7SUFBUixZQUFLLEVBQUU7OEJBQWlDLE1BQU07aUVBQUM7QUFFdkM7SUFBUixZQUFLLEVBQUU7OEJBQTBCLGtCQUFXOzBEQUFNO0FBUW5EO0lBREMsWUFBSyxFQUFFOzhCQUNxQixNQUFNO3FDQUFOLE1BQU07dURBQTZDO0FBYnJFLGdCQUFnQjtJQUQ1QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFDLENBQUM7cUNBUUgsdUJBQWdCO0dBUDVDLGdCQUFnQixDQXNFNUI7QUF0RVksNENBQWdCIn0=