"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var BrowserDetection = (function () {
    function BrowserDetection(ua) {
        this._overrideUa = ua;
    }
    Object.defineProperty(BrowserDetection.prototype, "_ua", {
        get: function () {
            if (typeof this._overrideUa === 'string') {
                return this._overrideUa;
            }
            return platform_browser_1.ɵgetDOM() ? platform_browser_1.ɵgetDOM().getUserAgent() : '';
        },
        enumerable: true,
        configurable: true
    });
    BrowserDetection.setup = function () { exports.browserDetection = new BrowserDetection(null); };
    Object.defineProperty(BrowserDetection.prototype, "isFirefox", {
        get: function () { return this._ua.indexOf('Firefox') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isAndroid", {
        get: function () {
            return this._ua.indexOf('Mozilla/5.0') > -1 && this._ua.indexOf('Android') > -1 &&
                this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Chrome') == -1 &&
                this._ua.indexOf('IEMobile') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isEdge", {
        get: function () { return this._ua.indexOf('Edge') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIE", {
        get: function () { return this._ua.indexOf('Trident') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isWebkit", {
        get: function () {
            return this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Edge') == -1 &&
                this._ua.indexOf('IEMobile') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIOS7", {
        get: function () {
            return (this._ua.indexOf('iPhone OS 7') > -1 || this._ua.indexOf('iPad OS 7') > -1) &&
                this._ua.indexOf('IEMobile') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isSlow", {
        get: function () { return this.isAndroid || this.isIE || this.isIOS7; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "supportsNativeIntlApi", {
        // The Intl API is only natively supported in Chrome, Firefox, IE11 and Edge.
        // This detector is needed in tests to make the difference between:
        // 1) IE11/Edge: they have a native Intl API, but with some discrepancies
        // 2) IE9/IE10: they use the polyfill, and so no discrepancies
        get: function () {
            return !!core_1.ɵglobal.Intl && core_1.ɵglobal.Intl !== core_1.ɵglobal.IntlPolyfill;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isChromeDesktop", {
        get: function () {
            return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Mobile Safari') == -1 &&
                this._ua.indexOf('Edge') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isOldChrome", {
        // "Old Chrome" means Chrome 3X, where there are some discrepancies in the Intl API.
        // Android 4.4 and 5.X have such browsers by default (respectively 30 and 39).
        get: function () {
            return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Chrome/3') > -1 &&
                this._ua.indexOf('Edge') == -1;
        },
        enumerable: true,
        configurable: true
    });
    return BrowserDetection;
}());
exports.BrowserDetection = BrowserDetection;
BrowserDetection.setup();
function dispatchEvent(element, eventType) {
    platform_browser_1.ɵgetDOM().dispatchEvent(element, platform_browser_1.ɵgetDOM().createEvent(eventType));
}
exports.dispatchEvent = dispatchEvent;
function el(html) {
    return platform_browser_1.ɵgetDOM().firstChild(platform_browser_1.ɵgetDOM().content(platform_browser_1.ɵgetDOM().createTemplate(html)));
}
exports.el = el;
function normalizeCSS(css) {
    return css.replace(/\s+/g, ' ')
        .replace(/:\s/g, ':')
        .replace(/'/g, '"')
        .replace(/ }/g, '}')
        .replace(/url\((\"|\s)(.+)(\"|\s)\)(\s*)/g, function () {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            match[_i] = arguments[_i];
        }
        return "url(\"" + match[2] + "\")";
    })
        .replace(/\[(.+)=([^"\]]+)\]/g, function () {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            match[_i] = arguments[_i];
        }
        return "[" + match[1] + "=\"" + match[2] + "\"]";
    });
}
exports.normalizeCSS = normalizeCSS;
var _singleTagWhitelist = ['br', 'hr', 'input'];
function stringifyElement(el /** TODO #9100 */) {
    var result = '';
    if (platform_browser_1.ɵgetDOM().isElementNode(el)) {
        var tagName = platform_browser_1.ɵgetDOM().tagName(el).toLowerCase();
        // Opening tag
        result += "<" + tagName;
        // Attributes in an ordered way
        var attributeMap = platform_browser_1.ɵgetDOM().attributeMap(el);
        var keys = Array.from(attributeMap.keys()).sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var attValue = attributeMap.get(key);
            if (typeof attValue !== 'string') {
                result += " " + key;
            }
            else {
                result += " " + key + "=\"" + attValue + "\"";
            }
        }
        result += '>';
        // Children
        var childrenRoot = platform_browser_1.ɵgetDOM().templateAwareRoot(el);
        var children = childrenRoot ? platform_browser_1.ɵgetDOM().childNodes(childrenRoot) : [];
        for (var j = 0; j < children.length; j++) {
            result += stringifyElement(children[j]);
        }
        // Closing tag
        if (_singleTagWhitelist.indexOf(tagName) == -1) {
            result += "</" + tagName + ">";
        }
    }
    else if (platform_browser_1.ɵgetDOM().isCommentNode(el)) {
        result += "<!--" + platform_browser_1.ɵgetDOM().nodeValue(el) + "-->";
    }
    else {
        result += platform_browser_1.ɵgetDOM().getText(el);
    }
    return result;
}
exports.stringifyElement = stringifyElement;
function createNgZone() {
    return new core_1.NgZone({ enableLongStackTrace: true });
}
exports.createNgZone = createNgZone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0aW5nL3NyYy9icm93c2VyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBd0Q7QUFDeEQsOERBQTREO0FBSTVEO0lBWUUsMEJBQVksRUFBZTtRQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQVZ2RCxzQkFBWSxpQ0FBRzthQUFmO1lBQ0UsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzFCLENBQUM7WUFFRCxNQUFNLENBQUMsMEJBQU0sRUFBRSxHQUFHLDBCQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDakQsQ0FBQzs7O09BQUE7SUFFTSxzQkFBSyxHQUFaLGNBQWlCLHdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBSWpFLHNCQUFJLHVDQUFTO2FBQWIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFckUsc0JBQUksdUNBQVM7YUFBYjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMs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