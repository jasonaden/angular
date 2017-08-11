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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var events_1 = require("../events");
var router_1 = require("../router");
var router_state_1 = require("../router_state");
/**
 * @whatItDoes Lets you link to specific parts of your app.
 *
 * @howToUse
 *
 * Consider the following route configuration:
 * `[{ path: 'user/:name', component: UserCmp }]`
 *
 * When linking to this `user/:name` route, you can write:
 * `<a routerLink='/user/bob'>link to user component</a>`
 *
 * @description
 *
 * The RouterLink directives let you link to specific parts of your app.
 *
 * When the link is static, you can use the directive as follows:
 * `<a routerLink="/user/bob">link to user component</a>`
 *
 * If you use dynamic values to generate the link, you can pass an array of path
 * segments, followed by the params for each segment.
 *
 * For instance `['/team', teamId, 'user', userName, {details: true}]`
 * means that we want to generate a link to `/team/11/user/bob;details=true`.
 *
 * Multiple static segments can be merged into one
 * (e.g., `['/team/11/user', userName, {details: true}]`).
 *
 * The first segment name can be prepended with `/`, `./`, or `../`:
 * * If the first segment begins with `/`, the router will look up the route from the root of the
 *   app.
 * * If the first segment begins with `./`, or doesn't begin with a slash, the router will
 *   instead look in the children of the current activated route.
 * * And if the first segment begins with `../`, the router will go up one level.
 *
 * You can set query params and fragment as follows:
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *   link to user component
 * </a>
 * ```
 * RouterLink will use these to generate this link: `/user/bob#education?debug=true`.
 *
 * (Deprecated in v4.0.0 use `queryParamsHandling` instead) You can also tell the
 * directive to preserve the current query params and fragment:
 *
 * ```
 * <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
 *   link to user component
 * </a>
 * ```
 *
 * You can tell the directive to how to handle queryParams, available options are:
 *  - 'merge' merge the queryParams into the current queryParams
 *  - 'preserve' preserve the current queryParams
 *  - default / '' use the queryParams only
 *  same options for {@link NavigationExtras#queryParamsHandling}
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *   link to user component
 * </a>
 * ```
 *
 * The router link directive always treats the provided input as a delta to the current url.
 *
 * For instance, if the current url is `/user/(box//aux:team)`.
 *
 * Then the following link `<a [routerLink]="['/user/jim']">Jim</a>` will generate the link
 * `/user/(jim//aux:team)`.
 *
 * @ngModule RouterModule
 *
 * See {@link Router#createUrlTree} for more information.
 *
 * @stable
 */
var RouterLink = (function () {
    function RouterLink(router, route, tabIndex, renderer, el) {
        this.router = router;
        this.route = route;
        this.commands = [];
        if (tabIndex == null) {
            renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
    }
    Object.defineProperty(RouterLink.prototype, "routerLink", {
        set: function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLink.prototype, "preserveQueryParams", {
        /**
         * @deprecated 4.0.0 use `queryParamsHandling` instead.
         */
        set: function (value) {
            if (core_1.isDevMode() && console && console.warn) {
                console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    RouterLink.prototype.onClick = function () {
        var extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return true;
    };
    Object.defineProperty(RouterLink.prototype, "urlTree", {
        get: function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    return RouterLink;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RouterLink.prototype, "queryParams", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RouterLink.prototype, "fragment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RouterLink.prototype, "queryParamsHandling", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLink.prototype, "preserveFragment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLink.prototype, "skipLocationChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLink.prototype, "replaceUrl", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RouterLink.prototype, "routerLink", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], RouterLink.prototype, "preserveQueryParams", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Boolean)
], RouterLink.prototype, "onClick", null);
RouterLink = __decorate([
    core_1.Directive({ selector: ':not(a)[routerLink]' }),
    __param(2, core_1.Attribute('tabindex')),
    __metadata("design:paramtypes", [router_1.Router, router_state_1.ActivatedRoute, String, core_1.Renderer2, core_1.ElementRef])
], RouterLink);
exports.RouterLink = RouterLink;
/**
 * @whatItDoes Lets you link to specific parts of your app.
 *
 * See {@link RouterLink} for more information.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
var RouterLinkWithHref = (function () {
    function RouterLinkWithHref(router, route, locationStrategy) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof events_1.NavigationEnd) {
                _this.updateTargetUrlAndHref();
            }
        });
    }
    Object.defineProperty(RouterLinkWithHref.prototype, "routerLink", {
        set: function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLinkWithHref.prototype, "preserveQueryParams", {
        set: function (value) {
            if (core_1.isDevMode() && console && console.warn) {
                console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    RouterLinkWithHref.prototype.ngOnChanges = function (changes) { this.updateTargetUrlAndHref(); };
    RouterLinkWithHref.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterLinkWithHref.prototype.onClick = function (button, ctrlKey, metaKey, shiftKey) {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        var extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return false;
    };
    RouterLinkWithHref.prototype.updateTargetUrlAndHref = function () {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
    };
    Object.defineProperty(RouterLinkWithHref.prototype, "urlTree", {
        get: function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    return RouterLinkWithHref;
}());
__decorate([
    core_1.HostBinding('attr.target'), core_1.Input(),
    __metadata("design:type", String)
], RouterLinkWithHref.prototype, "target", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RouterLinkWithHref.prototype, "queryParams", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RouterLinkWithHref.prototype, "fragment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], RouterLinkWithHref.prototype, "queryParamsHandling", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLinkWithHref.prototype, "preserveFragment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLinkWithHref.prototype, "skipLocationChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], RouterLinkWithHref.prototype, "replaceUrl", void 0);
__decorate([
    core_1.HostBinding(),
    __metadata("design:type", String)
], RouterLinkWithHref.prototype, "href", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RouterLinkWithHref.prototype, "routerLink", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], RouterLinkWithHref.prototype, "preserveQueryParams", null);
__decorate([
    core_1.HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Boolean, Boolean]),
    __metadata("design:returntype", Boolean)
], RouterLinkWithHref.prototype, "onClick", null);
RouterLinkWithHref = __decorate([
    core_1.Directive({ selector: 'a[routerLink]' }),
    __metadata("design:paramtypes", [router_1.Router, router_state_1.ActivatedRoute,
        common_1.LocationStrategy])
], RouterLinkWithHref);
exports.RouterLinkWithHref = RouterLinkWithHref;
function attrBoolValue(s) {
    return s === '' || !!s;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL2RpcmVjdGl2ZXMvcm91dGVyX2xpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBaUQ7QUFDakQsc0NBQTZJO0FBSTdJLG9DQUF3QztBQUN4QyxvQ0FBaUM7QUFDakMsZ0RBQStDO0FBRy9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEVHO0FBRUgsSUFBYSxVQUFVO0lBVXJCLG9CQUNZLE1BQWMsRUFBVSxLQUFxQixFQUM5QixRQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBYztRQURwRSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFKakQsYUFBUSxHQUFVLEVBQUUsQ0FBQztRQU0zQixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDSCxDQUFDO0lBR0Qsc0JBQUksa0NBQVU7YUFBZCxVQUFlLFFBQXNCO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLENBQUM7UUFDSCxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLDJDQUFtQjtRQUp2Qjs7V0FFRzthQUVILFVBQXdCLEtBQWM7WUFDcEMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsRUFBRSxJQUFTLE9BQU8sSUFBUyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckQsT0FBTyxDQUFDLElBQUksQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1lBQ3ZGLENBQUM7WUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUdELDRCQUFPLEdBQVA7UUFDRSxJQUFNLE1BQU0sR0FBRztZQUNiLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7WUFDMUQsVUFBVSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzNDLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsc0JBQUksK0JBQU87YUFBWDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUM5QyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixtQkFBbUIsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDakQsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtnQkFDN0MsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzthQUN2RCxDQUFDLENBQUM7UUFDTCxDQUFDOzs7T0FBQTtJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQTFERCxJQTBEQztBQXpEVTtJQUFSLFlBQUssRUFBRTs7K0NBQWlDO0FBQ2hDO0lBQVIsWUFBSyxFQUFFOzs0Q0FBa0I7QUFDakI7SUFBUixZQUFLLEVBQUU7O3VEQUEwQztBQUN6QztJQUFSLFlBQUssRUFBRTs7b0RBQTJCO0FBQzFCO0lBQVIsWUFBSyxFQUFFOztzREFBNkI7QUFDNUI7SUFBUixZQUFLLEVBQUU7OzhDQUFxQjtBQWE3QjtJQURDLFlBQUssRUFBRTs7OzRDQU9QO0FBTUQ7SUFEQyxZQUFLLEVBQUU7OztxREFNUDtBQUdEO0lBREMsbUJBQVksQ0FBQyxPQUFPLENBQUM7Ozs7eUNBUXJCO0FBOUNVLFVBQVU7SUFEdEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBQyxDQUFDO0lBYXRDLFdBQUEsZ0JBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtxQ0FETixlQUFNLEVBQWlCLDZCQUFjLFVBQ0YsZ0JBQVMsRUFBTSxpQkFBVTtHQVpyRSxVQUFVLENBMER0QjtBQTFEWSxnQ0FBVTtBQTREdkI7Ozs7Ozs7O0dBUUc7QUFFSCxJQUFhLGtCQUFrQjtJQWU3Qiw0QkFDWSxNQUFjLEVBQVUsS0FBcUIsRUFDN0MsZ0JBQWtDO1FBRjlDLGlCQVFDO1FBUFcsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQzdDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFUdEMsYUFBUSxHQUFVLEVBQUUsQ0FBQztRQVUzQixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksc0JBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCxzQkFBSSwwQ0FBVTthQUFkLFVBQWUsUUFBc0I7WUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDckIsQ0FBQztRQUNILENBQUM7OztPQUFBO0lBR0Qsc0JBQUksbURBQW1CO2FBQXZCLFVBQXdCLEtBQWM7WUFDcEMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsRUFBRSxJQUFTLE9BQU8sSUFBUyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckQsT0FBTyxDQUFDLElBQUksQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1lBQ3RGLENBQUM7WUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHdDQUFXLEdBQVgsVUFBWSxPQUFXLElBQVMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLHdDQUFXLEdBQVgsY0FBcUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFHdkQsb0NBQU8sR0FBUCxVQUFRLE1BQWMsRUFBRSxPQUFnQixFQUFFLE9BQWdCLEVBQUUsUUFBaUI7UUFDM0UsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHO1lBQ2Isa0JBQWtCLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUMxRCxVQUFVLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDM0MsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxtREFBc0IsR0FBOUI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsc0JBQUksdUNBQU87YUFBWDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUM5QyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixtQkFBbUIsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDakQsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtnQkFDN0MsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzthQUN2RCxDQUFDLENBQUM7UUFDTCxDQUFDOzs7T0FBQTtJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTdFRCxJQTZFQztBQTVFc0M7SUFBcEMsa0JBQVcsQ0FBQyxhQUFhLENBQUMsRUFBRSxZQUFLLEVBQUU7O2tEQUFnQjtBQUMzQztJQUFSLFlBQUssRUFBRTs7dURBQWlDO0FBQ2hDO0lBQVIsWUFBSyxFQUFFOztvREFBa0I7QUFDakI7SUFBUixZQUFLLEVBQUU7OytEQUEwQztBQUN6QztJQUFSLFlBQUssRUFBRTs7NERBQTJCO0FBQzFCO0lBQVIsWUFBSyxFQUFFOzs4REFBNkI7QUFDNUI7SUFBUixZQUFLLEVBQUU7O3NEQUFxQjtBQU1kO0lBQWQsa0JBQVcsRUFBRTs7Z0RBQWM7QUFhNUI7SUFEQyxZQUFLLEVBQUU7OztvREFPUDtBQUdEO0lBREMsWUFBSyxFQUFFOzs7NkRBTVA7QUFNRDtJQURDLG1CQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7Ozs7aURBZ0IvRjtBQTdEVSxrQkFBa0I7SUFEOUIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQztxQ0FpQmpCLGVBQU0sRUFBaUIsNkJBQWM7UUFDM0IseUJBQWdCO0dBakJuQyxrQkFBa0IsQ0E2RTlCO0FBN0VZLGdEQUFrQjtBQStFL0IsdUJBQXVCLENBQU07SUFDM0IsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixDQUFDIn0=