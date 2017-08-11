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
var dom_adapter_1 = require("../dom/dom_adapter");
/**
 * Provides DOM operations in any browser environment.
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
var GenericBrowserDomAdapter = (function (_super) {
    __extends(GenericBrowserDomAdapter, _super);
    function GenericBrowserDomAdapter() {
        var _this = _super.call(this) || this;
        _this._animationPrefix = null;
        _this._transitionEnd = null;
        try {
            var element_1 = _this.createElement('div', document);
            if (_this.getStyle(element_1, 'animationName') != null) {
                _this._animationPrefix = '';
            }
            else {
                var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (_this.getStyle(element_1, domPrefixes[i] + 'AnimationName') != null) {
                        _this._animationPrefix = '-' + domPrefixes[i].toLowerCase() + '-';
                        break;
                    }
                }
            }
            var transEndEventNames_1 = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            };
            Object.keys(transEndEventNames_1).forEach(function (key) {
                if (_this.getStyle(element_1, key) != null) {
                    _this._transitionEnd = transEndEventNames_1[key];
                }
            });
        }
        catch (e) {
            _this._animationPrefix = null;
            _this._transitionEnd = null;
        }
        return _this;
    }
    GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) { return el.getDistributedNodes(); };
    GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
    };
    GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () { return true; };
    GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
        return typeof document.body.createShadowRoot === 'function';
    };
    GenericBrowserDomAdapter.prototype.getAnimationPrefix = function () { return this._animationPrefix ? this._animationPrefix : ''; };
    GenericBrowserDomAdapter.prototype.getTransitionEnd = function () { return this._transitionEnd ? this._transitionEnd : ''; };
    GenericBrowserDomAdapter.prototype.supportsAnimation = function () {
        return this._animationPrefix != null && this._transitionEnd != null;
    };
    return GenericBrowserDomAdapter;
}(dom_adapter_1.DomAdapter));
exports.GenericBrowserDomAdapter = GenericBrowserDomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJpY19icm93c2VyX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL2dlbmVyaWNfYnJvd3Nlcl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILGtEQUE4QztBQUk5Qzs7Ozs7R0FLRztBQUNIO0lBQXVELDRDQUFVO0lBRy9EO1FBQUEsWUFDRSxpQkFBTyxTQWdDUjtRQW5DTyxzQkFBZ0IsR0FBZ0IsSUFBSSxDQUFDO1FBQ3JDLG9CQUFjLEdBQWdCLElBQUksQ0FBQztRQUd6QyxJQUFJLENBQUM7WUFDSCxJQUFNLFNBQU8sR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQU8sRUFBRSxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1lBQzdCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVqRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQzt3QkFDakUsS0FBSyxDQUFDO29CQUNSLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFFRCxJQUFNLG9CQUFrQixHQUE0QjtnQkFDbEQsZ0JBQWdCLEVBQUUscUJBQXFCO2dCQUN2QyxhQUFhLEVBQUUsZUFBZTtnQkFDOUIsV0FBVyxFQUFFLCtCQUErQjtnQkFDNUMsVUFBVSxFQUFFLGVBQWU7YUFDNUIsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFXO2dCQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxLQUFJLENBQUMsY0FBYyxHQUFHLG9CQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQzs7SUFDSCxDQUFDO0lBRUQsc0RBQW1CLEdBQW5CLFVBQW9CLEVBQWUsSUFBWSxNQUFNLENBQU8sRUFBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLG9EQUFpQixHQUFqQixVQUFrQixFQUFxQixFQUFFLE9BQWUsRUFBRSxJQUFZO1FBQ3BFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDN0QsQ0FBQztJQUNELG9EQUFpQixHQUFqQixjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QywwREFBdUIsR0FBdkI7UUFDRSxNQUFNLENBQUMsT0FBWSxRQUFRLENBQUMsSUFBSyxDQUFDLGdCQUFnQixLQUFLLFVBQVUsQ0FBQztJQUNwRSxDQUFDO0lBQ0QscURBQWtCLEdBQWxCLGNBQStCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0YsbURBQWdCLEdBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRixvREFBaUIsR0FBakI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQztJQUN0RSxDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBbkRELENBQXVELHdCQUFVLEdBbURoRTtBQW5EcUIsNERBQXdCIn0=