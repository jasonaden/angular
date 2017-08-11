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
/**
 * @whatItDoes Base for events the Router goes through, as opposed to events tied to a specific
 * Route. `RouterEvent`s will only be fired one time for any given navigation.
 *
 * Example:
 *
 * ```
 * class MyService {
 *   constructor(public router: Router, logger: Logger) {
 *     router.events.filter(e => e instanceof RouterEvent).subscribe(e => {
 *       logger.log(e.id, e.url);
 *     });
 *   }
 * }
 * ```
 *
 * @experimental
 */
var RouterEvent = (function () {
    function RouterEvent(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url) {
        this.id = id;
        this.url = url;
    }
    return RouterEvent;
}());
exports.RouterEvent = RouterEvent;
/**
 * @whatItDoes Base for events tied to a specific `Route`, as opposed to events for the Router
 * lifecycle. `RouteEvent`s may be fired multiple times during a single navigation and will
 * always receive the `Route` they pertain to.
 *
 * Example:
 *
 * ```
 * class MyService {
 *   constructor(public router: Router, spinner: Spinner) {
 *     router.events.filter(e => e instanceof RouteEvent).subscribe(e => {
 *       if (e instanceof ChildActivationStart) {
 *         spinner.start(e.route);
 *       } else if (e instanceof ChildActivationEnd) {
 *         spinner.end(e.route);
 *       }
 *     });
 *   }
 * }
 * ```
 *
 * @experimental
 */
var RouteEvent = (function () {
    function RouteEvent(
        /** @docsNotRequired */
        route) {
        this.route = route;
    }
    return RouteEvent;
}());
exports.RouteEvent = RouteEvent;
/**
 * @whatItDoes Represents an event triggered when a navigation starts.
 *
 * @stable
 */
var NavigationStart = (function (_super) {
    __extends(NavigationStart, _super);
    function NavigationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @docsNotRequired */
    NavigationStart.prototype.toString = function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationStart;
}(RouterEvent));
exports.NavigationStart = NavigationStart;
/**
 * @whatItDoes Represents an event triggered when a navigation ends successfully.
 *
 * @stable
 */
var NavigationEnd = (function (_super) {
    __extends(NavigationEnd, _super);
    function NavigationEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        return _this;
    }
    /** @docsNotRequired */
    NavigationEnd.prototype.toString = function () {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
    };
    return NavigationEnd;
}(RouterEvent));
exports.NavigationEnd = NavigationEnd;
/**
 * @whatItDoes Represents an event triggered when a navigation is canceled.
 *
 * @stable
 */
var NavigationCancel = (function (_super) {
    __extends(NavigationCancel, _super);
    function NavigationCancel(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        reason) {
        var _this = _super.call(this, id, url) || this;
        _this.reason = reason;
        return _this;
    }
    /** @docsNotRequired */
    NavigationCancel.prototype.toString = function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationCancel;
}(RouterEvent));
exports.NavigationCancel = NavigationCancel;
/**
 * @whatItDoes Represents an event triggered when a navigation fails due to an unexpected error.
 *
 * @stable
 */
var NavigationError = (function (_super) {
    __extends(NavigationError, _super);
    function NavigationError(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        error) {
        var _this = _super.call(this, id, url) || this;
        _this.error = error;
        return _this;
    }
    /** @docsNotRequired */
    NavigationError.prototype.toString = function () {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
    };
    return NavigationError;
}(RouterEvent));
exports.NavigationError = NavigationError;
/**
 * @whatItDoes Represents an event triggered when routes are recognized.
 *
 * @stable
 */
var RoutesRecognized = (function (_super) {
    __extends(RoutesRecognized, _super);
    function RoutesRecognized(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects, 
        /** @docsNotRequired */
        state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /** @docsNotRequired */
    RoutesRecognized.prototype.toString = function () {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return RoutesRecognized;
}(RouterEvent));
exports.RoutesRecognized = RoutesRecognized;
/**
 * @whatItDoes Represents the start of the Guard phase of routing.
 *
 * @experimental
 */
var GuardsCheckStart = (function (_super) {
    __extends(GuardsCheckStart, _super);
    function GuardsCheckStart(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects, 
        /** @docsNotRequired */
        state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    GuardsCheckStart.prototype.toString = function () {
        return "GuardsCheckStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return GuardsCheckStart;
}(RouterEvent));
exports.GuardsCheckStart = GuardsCheckStart;
/**
 * @whatItDoes Represents the end of the Guard phase of routing.
 *
 * @experimental
 */
var GuardsCheckEnd = (function (_super) {
    __extends(GuardsCheckEnd, _super);
    function GuardsCheckEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects, 
        /** @docsNotRequired */
        state, 
        /** @docsNotRequired */
        shouldActivate) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        _this.shouldActivate = shouldActivate;
        return _this;
    }
    GuardsCheckEnd.prototype.toString = function () {
        return "GuardsCheckEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ", shouldActivate: " + this.shouldActivate + ")";
    };
    return GuardsCheckEnd;
}(RouterEvent));
exports.GuardsCheckEnd = GuardsCheckEnd;
/**
 * @whatItDoes Represents the start of the Resolve phase of routing. The timing of this
 * event may change, thus it's experimental. In the current iteration it will run
 * in the "resolve" phase whether there's things to resolve or not. In the future this
 * behavior may change to only run when there are things to be resolved.
 *
 * @experimental
 */
var ResolveStart = (function (_super) {
    __extends(ResolveStart, _super);
    function ResolveStart(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects, 
        /** @docsNotRequired */
        state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    ResolveStart.prototype.toString = function () {
        return "ResolveStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveStart;
}(RouterEvent));
exports.ResolveStart = ResolveStart;
/**
 * @whatItDoes Represents the end of the Resolve phase of routing. See note on
 * {@link ResolveStart} for use of this experimental API.
 *
 * @experimental
 */
var ResolveEnd = (function (_super) {
    __extends(ResolveEnd, _super);
    function ResolveEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, 
        /** @docsNotRequired */
        urlAfterRedirects, 
        /** @docsNotRequired */
        state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    ResolveEnd.prototype.toString = function () {
        return "ResolveEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveEnd;
}(RouterEvent));
exports.ResolveEnd = ResolveEnd;
/**
 * @whatItDoes Represents an event triggered before lazy loading a route config.
 *
 * @experimental
 */
var RouteConfigLoadStart = (function (_super) {
    __extends(RouteConfigLoadStart, _super);
    function RouteConfigLoadStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteConfigLoadStart.prototype.toString = function () { return "RouteConfigLoadStart(path: " + this.route.path + ")"; };
    return RouteConfigLoadStart;
}(RouteEvent));
exports.RouteConfigLoadStart = RouteConfigLoadStart;
/**
 * @whatItDoes Represents an event triggered when a route has been lazy loaded.
 *
 * @experimental
 */
var RouteConfigLoadEnd = (function (_super) {
    __extends(RouteConfigLoadEnd, _super);
    function RouteConfigLoadEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteConfigLoadEnd.prototype.toString = function () { return "RouteConfigLoadEnd(path: " + this.route.path + ")"; };
    return RouteConfigLoadEnd;
}(RouteEvent));
exports.RouteConfigLoadEnd = RouteConfigLoadEnd;
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ChildActivationEnd} for use of this experimental API.
 *
 * @experimental
 */
var ChildActivationStart = (function (_super) {
    __extends(ChildActivationStart, _super);
    function ChildActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChildActivationStart.prototype.toString = function () { return "ChildActivationStart(path: '" + this.route.path + "')"; };
    return ChildActivationStart;
}(RouteEvent));
exports.ChildActivationStart = ChildActivationStart;
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ChildActivationStart} for use of this experimental API.
 *
 * @experimental
 */
var ChildActivationEnd = (function (_super) {
    __extends(ChildActivationEnd, _super);
    function ChildActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChildActivationEnd.prototype.toString = function () { return "ChildActivationEnd(path: '" + this.route.path + "')"; };
    return ChildActivationEnd;
}(RouteEvent));
exports.ChildActivationEnd = ChildActivationEnd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBS0g7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0g7SUFDRTtRQUNJLHVCQUF1QjtRQUNoQixFQUFVO1FBQ2pCLHVCQUF1QjtRQUNoQixHQUFXO1FBRlgsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUVWLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0lBQzVCLGtCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSxrQ0FBVztBQVF4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNIO0lBQ0U7UUFDSSx1QkFBdUI7UUFDaEIsS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87SUFBRyxDQUFDO0lBQzdCLGlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxnQ0FBVTtBQU12Qjs7OztHQUlHO0FBQ0g7SUFBcUMsbUNBQVc7SUFBaEQ7O0lBR0EsQ0FBQztJQUZDLHVCQUF1QjtJQUN2QixrQ0FBUSxHQUFSLGNBQXFCLE1BQU0sQ0FBQyx5QkFBdUIsSUFBSSxDQUFDLEVBQUUsZ0JBQVcsSUFBSSxDQUFDLEdBQUcsT0FBSSxDQUFDLENBQUMsQ0FBQztJQUN0RixzQkFBQztBQUFELENBQUMsQUFIRCxDQUFxQyxXQUFXLEdBRy9DO0FBSFksMENBQWU7QUFLNUI7Ozs7R0FJRztBQUNIO0lBQW1DLGlDQUFXO0lBQzVDO1FBQ0ksdUJBQXVCO1FBQ3ZCLEVBQVU7UUFDVix1QkFBdUI7UUFDdkIsR0FBVztRQUNYLHVCQUF1QjtRQUNoQixpQkFBeUI7UUFOcEMsWUFPRSxrQkFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQ2Y7UUFGVSx1QkFBaUIsR0FBakIsaUJBQWlCLENBQVE7O0lBRXBDLENBQUM7SUFFRCx1QkFB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