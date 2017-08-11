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
 * Conditionally includes a template based on the value of an `expression`.
 *
 * `ngIf` evaluates the `expression` and then renders the `then` or `else` template in its place
 * when expression is truthy or falsy respectively. Typically the:
 *  - `then` template is the inline template of `ngIf` unless bound to a different value.
 *  - `else` template is blank unless it is bound.
 *
 * ## Most common usage
 *
 * The most common usage of the `ngIf` directive is to conditionally show the inline template as
 * seen in this example:
 * {@example common/ngIf/ts/module.ts region='NgIfSimple'}
 *
 * ## Showing an alternative template using `else`
 *
 * If it is necessary to display a template when the `expression` is falsy use the `else` template
 * binding as shown. Note that the `else` binding points to a `<ng-template>` labeled `#elseBlock`.
 * The template can be defined anywhere in the component view but is typically placed right after
 * `ngIf` for readability.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfElse'}
 *
 * ## Using non-inlined `then` template
 *
 * Usually the `then` template is the inlined template of the `ngIf`, but it can be changed using
 * a binding (just like `else`). Because `then` and `else` are bindings, the template references can
 * change at runtime as shown in this example.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfThenElse'}
 *
 * ## Storing conditional result in a variable
 *
 * A common pattern is that we need to show a set of properties from the same object. If the
 * object is undefined, then we have to use the safe-traversal-operator `?.` to guard against
 * dereferencing a `null` value. This is especially the case when waiting on async data such as
 * when using the `async` pipe as shown in following example:
 *
 * ```
 * Hello {{ (userStream|async)?.last }}, {{ (userStream|async)?.first }}!
 * ```
 *
 * There are several inefficiencies in the above example:
 *  - We create multiple subscriptions on `userStream`. One for each `async` pipe, or two in the
 *    example above.
 *  - We cannot display an alternative screen while waiting for the data to arrive asynchronously.
 *  - We have to use the safe-traversal-operator `?.` to access properties, which is cumbersome.
 *  - We have to place the `async` pipe in parenthesis.
 *
 * A better way to do this is to use `ngIf` and store the result of the condition in a local
 * variable as shown in the the example below:
 *
 * {@example common/ngIf/ts/module.ts region='NgIfAs'}
 *
 * Notice that:
 *  - We use only one `async` pipe and hence only one subscription gets created.
 *  - `ngIf` stores the result of the `userStream|async` in the local variable `user`.
 *  - The local `user` can then be bound repeatedly in a more efficient way.
 *  - No need to use the safe-traversal-operator `?.` to access properties as `ngIf` will only
 *    display the data if `userStream` returns a value.
 *  - We can display an alternative template while waiting for the data.
 *
 * ### Syntax
 *
 * Simple form:
 * - `<div *ngIf="condition">...</div>`
 * - `<div template="ngIf condition">...</div>`
 * - `<ng-template [ngIf]="condition"><div>...</div></ng-template>`
 *
 * Form with an else block:
 * ```
 * <div *ngIf="condition; else elseBlock">...</div>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 * Form with a `then` and `else` block:
 * ```
 * <div *ngIf="condition; then thenBlock else elseBlock"></div>
 * <ng-template #thenBlock>...</ng-template>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 * Form with storing the value locally:
 * ```
 * <div *ngIf="condition as value; else elseBlock">{{value}}</div>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 * @stable
 */
var NgIf = (function () {
    function NgIf(_viewContainer, templateRef) {
        this._viewContainer = _viewContainer;
        this._context = new NgIfContext();
        this._thenTemplateRef = null;
        this._elseTemplateRef = null;
        this._thenViewRef = null;
        this._elseViewRef = null;
        this._thenTemplateRef = templateRef;
    }
    Object.defineProperty(NgIf.prototype, "ngIf", {
        set: function (condition) {
            this._context.$implicit = this._context.ngIf = condition;
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgIf.prototype, "ngIfThen", {
        set: function (templateRef) {
            this._thenTemplateRef = templateRef;
            this._thenViewRef = null; // clear previous view if any.
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgIf.prototype, "ngIfElse", {
        set: function (templateRef) {
            this._elseTemplateRef = templateRef;
            this._elseViewRef = null; // clear previous view if any.
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    NgIf.prototype._updateView = function () {
        if (this._context.$implicit) {
            if (!this._thenViewRef) {
                this._viewContainer.clear();
                this._elseViewRef = null;
                if (this._thenTemplateRef) {
                    this._thenViewRef =
                        this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
                }
            }
        }
        else {
            if (!this._elseViewRef) {
                this._viewContainer.clear();
                this._thenViewRef = null;
                if (this._elseTemplateRef) {
                    this._elseViewRef =
                        this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
                }
            }
        }
    };
    return NgIf;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], NgIf.prototype, "ngIf", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef),
    __metadata("design:paramtypes", [core_1.TemplateRef])
], NgIf.prototype, "ngIfThen", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.TemplateRef),
    __metadata("design:paramtypes", [core_1.TemplateRef])
], NgIf.prototype, "ngIfElse", null);
NgIf = __decorate([
    core_1.Directive({ selector: '[ngIf]' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
], NgIf);
exports.NgIf = NgIf;
/**
 * @stable
 */
var NgIfContext = (function () {
    function NgIfContext() {
        this.$implicit = null;
        this.ngIf = null;
    }
    return NgIfContext;
}());
exports.NgIfContext = NgIfContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfaWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfaWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBK0Y7QUFHL0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUZHO0FBRUgsSUFBYSxJQUFJO0lBT2YsY0FBb0IsY0FBZ0MsRUFBRSxXQUFxQztRQUF2RSxtQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFONUMsYUFBUSxHQUFnQixJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzFDLHFCQUFnQixHQUFrQyxJQUFJLENBQUM7UUFDdkQscUJBQWdCLEdBQWtDLElBQUksQ0FBQztRQUN2RCxpQkFBWSxHQUFzQyxJQUFJLENBQUM7UUFDdkQsaUJBQVksR0FBc0MsSUFBSSxDQUFDO1FBRzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7SUFDdEMsQ0FBQztJQUdELHNCQUFJLHNCQUFJO2FBQVIsVUFBUyxTQUFjO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFHRCxzQkFBSSwwQkFBUTthQUFaLFVBQWEsV0FBcUM7WUFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFFLDhCQUE4QjtZQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFHRCxzQkFBSSwwQkFBUTthQUFaLFVBQWEsV0FBcUM7WUFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFFLDhCQUE4QjtZQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFTywwQkFBVyxHQUFuQjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFlBQVk7d0JBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsWUFBWTt3QkFDYixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25GLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQXBERCxJQW9EQztBQXhDQztJQURDLFlBQUssRUFBRTs7O2dDQUlQO0FBR0Q7SUFEQyxZQUFLLEVBQUU7OEJBQ2tCLGtCQUFXO3FDQUFYLGtCQUFXO29DQUlwQztBQUdEO0lBREMsWUFBSyxFQUFFOzhCQUNrQixrQkFBVztxQ0FBWCxrQkFBVztvQ0FJcEM7QUE3QlUsSUFBSTtJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO3FDQVFNLHVCQUFnQixFQUFlLGtCQUFXO0dBUG5FLElBQUksQ0FvRGhCO0FBcERZLG9CQUFJO0FBc0RqQjs7R0FFRztBQUNIO0lBQUE7UUFDUyxjQUFTLEdBQVEsSUFBSSxDQUFDO1FBQ3RCLFNBQUksR0FBUSxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxrQ0FBVyJ9