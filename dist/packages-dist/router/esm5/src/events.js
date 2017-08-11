/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * \@whatItDoes Base for events the Router goes through, as opposed to events tied to a specific
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
 * \@experimental
 */
var RouterEvent = (function () {
    /**
     * @param {?} id
     * @param {?} url
     */
    function RouterEvent(id, url) {
        this.id = id;
        this.url = url;
    }
    return RouterEvent;
}());
export { RouterEvent };
function RouterEvent_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RouterEvent.prototype.id;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RouterEvent.prototype.url;
}
/**
 * \@whatItDoes Base for events tied to a specific `Route`, as opposed to events for the Router
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
 * \@experimental
 */
var RouteEvent = (function () {
    /**
     * @param {?} route
     */
    function RouteEvent(route) {
        this.route = route;
    }
    return RouteEvent;
}());
export { RouteEvent };
function RouteEvent_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RouteEvent.prototype.route;
}
/**
 * \@whatItDoes Represents an event triggered when a navigation starts.
 *
 * \@stable
 */
var NavigationStart = (function (_super) {
    tslib_1.__extends(NavigationStart, _super);
    function NavigationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationStart.prototype.toString = function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationStart;
}(RouterEvent));
export { NavigationStart };
/**
 * \@whatItDoes Represents an event triggered when a navigation ends successfully.
 *
 * \@stable
 */
var NavigationEnd = (function (_super) {
    tslib_1.__extends(NavigationEnd, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     */
    function NavigationEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        return _this;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationEnd.prototype.toString = function () {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
    };
    return NavigationEnd;
}(RouterEvent));
export { NavigationEnd };
function NavigationEnd_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    NavigationEnd.prototype.urlAfterRedirects;
}
/**
 * \@whatItDoes Represents an event triggered when a navigation is canceled.
 *
 * \@stable
 */
var NavigationCancel = (function (_super) {
    tslib_1.__extends(NavigationCancel, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} reason
     */
    function NavigationCancel(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, reason) {
        var _this = _super.call(this, id, url) || this;
        _this.reason = reason;
        return _this;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationCancel.prototype.toString = function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationCancel;
}(RouterEvent));
export { NavigationCancel };
function NavigationCancel_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    NavigationCancel.prototype.reason;
}
/**
 * \@whatItDoes Represents an event triggered when a navigation fails due to an unexpected error.
 *
 * \@stable
 */
var NavigationError = (function (_super) {
    tslib_1.__extends(NavigationError, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} error
     */
    function NavigationError(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, error) {
        var _this = _super.call(this, id, url) || this;
        _this.error = error;
        return _this;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationError.prototype.toString = function () {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
    };
    return NavigationError;
}(RouterEvent));
export { NavigationError };
function NavigationError_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    NavigationError.prototype.error;
}
/**
 * \@whatItDoes Represents an event triggered when routes are recognized.
 *
 * \@stable
 */
var RoutesRecognized = (function (_super) {
    tslib_1.__extends(RoutesRecognized, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    function RoutesRecognized(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    RoutesRecognized.prototype.toString = function () {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return RoutesRecognized;
}(RouterEvent));
export { RoutesRecognized };
function RoutesRecognized_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RoutesRecognized.prototype.urlAfterRedirects;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RoutesRecognized.prototype.state;
}
/**
 * \@whatItDoes Represents the start of the Guard phase of routing.
 *
 * \@experimental
 */
var GuardsCheckStart = (function (_super) {
    tslib_1.__extends(GuardsCheckStart, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    function GuardsCheckStart(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    GuardsCheckStart.prototype.toString = function () {
        return "GuardsCheckStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return GuardsCheckStart;
}(RouterEvent));
export { GuardsCheckStart };
function GuardsCheckStart_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    GuardsCheckStart.prototype.urlAfterRedirects;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    GuardsCheckStart.prototype.state;
}
/**
 * \@whatItDoes Represents the end of the Guard phase of routing.
 *
 * \@experimental
 */
var GuardsCheckEnd = (function (_super) {
    tslib_1.__extends(GuardsCheckEnd, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     * @param {?} shouldActivate
     */
    function GuardsCheckEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects, state, shouldActivate) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        _this.shouldActivate = shouldActivate;
        return _this;
    }
    /**
     * @return {?}
     */
    GuardsCheckEnd.prototype.toString = function () {
        return "GuardsCheckEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ", shouldActivate: " + this.shouldActivate + ")";
    };
    return GuardsCheckEnd;
}(RouterEvent));
export { GuardsCheckEnd };
function GuardsCheckEnd_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    GuardsCheckEnd.prototype.urlAfterRedirects;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    GuardsCheckEnd.prototype.state;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    GuardsCheckEnd.prototype.shouldActivate;
}
/**
 * \@whatItDoes Represents the start of the Resolve phase of routing. The timing of this
 * event may change, thus it's experimental. In the current iteration it will run
 * in the "resolve" phase whether there's things to resolve or not. In the future this
 * behavior may change to only run when there are things to be resolved.
 *
 * \@experimental
 */
var ResolveStart = (function (_super) {
    tslib_1.__extends(ResolveStart, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    function ResolveStart(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    ResolveStart.prototype.toString = function () {
        return "ResolveStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveStart;
}(RouterEvent));
export { ResolveStart };
function ResolveStart_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    ResolveStart.prototype.urlAfterRedirects;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    ResolveStart.prototype.state;
}
/**
 * \@whatItDoes Represents the end of the Resolve phase of routing. See note on
 * {\@link ResolveStart} for use of this experimental API.
 *
 * \@experimental
 */
var ResolveEnd = (function (_super) {
    tslib_1.__extends(ResolveEnd, _super);
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    function ResolveEnd(
        /** @docsNotRequired */
        id, 
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    ResolveEnd.prototype.toString = function () {
        return "ResolveEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveEnd;
}(RouterEvent));
export { ResolveEnd };
function ResolveEnd_tsickle_Closure_declarations() {
    /**
     * \@docsNotRequired
     * @type {?}
     */
    ResolveEnd.prototype.urlAfterRedirects;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    ResolveEnd.prototype.state;
}
/**
 * \@whatItDoes Represents an event triggered before lazy loading a route config.
 *
 * \@experimental
 */
var RouteConfigLoadStart = (function (_super) {
    tslib_1.__extends(RouteConfigLoadStart, _super);
    function RouteConfigLoadStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    RouteConfigLoadStart.prototype.toString = function () { return "RouteConfigLoadStart(path: " + this.route.path + ")"; };
    return RouteConfigLoadStart;
}(RouteEvent));
export { RouteConfigLoadStart };
/**
 * \@whatItDoes Represents an event triggered when a route has been lazy loaded.
 *
 * \@experimental
 */
var RouteConfigLoadEnd = (function (_super) {
    tslib_1.__extends(RouteConfigLoadEnd, _super);
    function RouteConfigLoadEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    RouteConfigLoadEnd.prototype.toString = function () { return "RouteConfigLoadEnd(path: " + this.route.path + ")"; };
    return RouteConfigLoadEnd;
}(RouteEvent));
export { RouteConfigLoadEnd };
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationEnd} for use of this experimental API.
 *
 * \@experimental
 */
var ChildActivationStart = (function (_super) {
    tslib_1.__extends(ChildActivationStart, _super);
    function ChildActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    ChildActivationStart.prototype.toString = function () { return "ChildActivationStart(path: '" + this.route.path + "')"; };
    return ChildActivationStart;
}(RouteEvent));
export { ChildActivationStart };
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationStart} for use of this experimental API.
 *
 * \@experimental
 */
var ChildActivationEnd = (function (_super) {
    tslib_1.__extends(ChildActivationEnd, _super);
    function ChildActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    ChildActivationEnd.prototype.toString = function () { return "ChildActivationEnd(path: '" + this.route.path + "')"; };
    return ChildActivationEnd;
}(RouteEvent));
export { ChildActivationEnd };
//# sourceMappingURL=events.js.map