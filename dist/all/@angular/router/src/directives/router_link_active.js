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
var events_1 = require("../events");
var router_1 = require("../router");
var router_link_1 = require("./router_link");
/**
 * @whatItDoes Lets you add a CSS class to an element when the link's route becomes active.
 *
 * @howToUse
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * @description
 *
 * The RouterLinkActive directive lets you add a CSS class to an element when the link's route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * When the url is either '/user' or '/user/bob', the active-link class will
 * be added to the `a` tag. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
 * <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
 * ```
 *
 * You can configure RouterLinkActive by passing `exact: true`. This will add the classes
 * only when the url matches the link exactly.
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
 * true}">Bob</a>
 * ```
 *
 * You can assign the RouterLinkActive instance to a template variable and directly check
 * the `isActive` status.
 * ```
 * <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
 *   Bob {{ rla.isActive ? '(already open)' : ''}}
 * </a>
 * ```
 *
 * Finally, you can apply the RouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
 *   <a routerLink="/user/jim">Jim</a>
 *   <a routerLink="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either '/user/jim' or
 * '/user/bob'.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
var RouterLinkActive = (function () {
    function RouterLinkActive(router, element, renderer, cdr) {
        var _this = this;
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.classes = [];
        this.active = false;
        this.routerLinkActiveOptions = { exact: false };
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof events_1.NavigationEnd) {
                _this.update();
            }
        });
    }
    Object.defineProperty(RouterLinkActive.prototype, "isActive", {
        get: function () { return this.active; },
        enumerable: true,
        configurable: true
    });
    RouterLinkActive.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.links.changes.subscribe(function (_) { return _this.update(); });
        this.linksWithHrefs.changes.subscribe(function (_) { return _this.update(); });
        this.update();
    };
    Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
        set: function (data) {
            var classes = Array.isArray(data) ? data : data.split(' ');
            this.classes = classes.filter(function (c) { return !!c; });
        },
        enumerable: true,
        configurable: true
    });
    RouterLinkActive.prototype.ngOnChanges = function (changes) { this.update(); };
    RouterLinkActive.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterLinkActive.prototype.update = function () {
        var _this = this;
        if (!this.links || !this.linksWithHrefs || !this.router.navigated)
            return;
        var hasActiveLinks = this.hasActiveLinks();
        // react only when status has changed to prevent unnecessary dom updates
        if (this.active !== hasActiveLinks) {
            this.classes.forEach(function (c) {
                if (hasActiveLinks) {
                    _this.renderer.addClass(_this.element.nativeElement, c);
                }
                else {
                    _this.renderer.removeClass(_this.element.nativeElement, c);
                }
            });
            Promise.resolve(hasActiveLinks).then(function (active) { return _this.active = active; });
        }
    };
    RouterLinkActive.prototype.isLinkActive = function (router) {
        var _this = this;
        return function (link) {
            return router.isActive(link.urlTree, _this.routerLinkActiveOptions.exact);
        };
    };
    RouterLinkActive.prototype.hasActiveLinks = function () {
        return this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    };
    return RouterLinkActive;
}());
__decorate([
    core_1.ContentChildren(router_link_1.RouterLink, { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], RouterLinkActive.prototype, "links", void 0);
__decorate([
    core_1.ContentChildren(router_link_1.RouterLinkWithHref, { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], RouterLinkActive.prototype, "linksWithHrefs", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RouterLinkActive.prototype, "routerLinkActiveOptions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RouterLinkActive.prototype, "routerLinkActive", null);
RouterLinkActive = __decorate([
    core_1.Directive({
        selector: '[routerLinkActive]',
        exportAs: 'routerLinkActive',
    }),
    __metadata("design:paramtypes", [router_1.Router, core_1.ElementRef, core_1.Renderer2,
        core_1.ChangeDetectorRef])
], RouterLinkActive);
exports.RouterLinkActive = RouterLinkActive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfYWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX2FjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUE0SztBQUU1SyxvQ0FBd0M7QUFDeEMsb0NBQWlDO0FBQ2pDLDZDQUE2RDtBQUU3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZERztBQUtILElBQWEsZ0JBQWdCO0lBWTNCLDBCQUNZLE1BQWMsRUFBVSxPQUFtQixFQUFVLFFBQW1CLEVBQ3hFLEdBQXNCO1FBRmxDLGlCQVFDO1FBUFcsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3hFLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBUjFCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFdkIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUV2Qiw0QkFBdUIsR0FBcUIsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFLbEUsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLHNCQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHNCQUFJLHNDQUFRO2FBQVosY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUUvQyw2Q0FBa0IsR0FBbEI7UUFBQSxpQkFJQztRQUhD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