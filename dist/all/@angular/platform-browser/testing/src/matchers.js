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
var _global = (typeof window === 'undefined' ? core_1.ɵglobal : window);
/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * ## Example
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 */
exports.expect = _global.expect;
// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
Map.prototype['jasmineToString'] = function () {
    var m = this;
    if (!m) {
        return '' + m;
    }
    var res = [];
    m.forEach(function (v, k) { res.push(k + ":" + v); });
    return "{ " + res.join(',') + " }";
};
_global.beforeEach(function () {
    jasmine.addMatchers({
        // Custom handler for Map as Jasmine does not support it yet
        toEqual: function (util) {
            return {
                compare: function (actual, expected) {
                    return { pass: util.equals(actual, expected, [compareMap]) };
                }
            };
            function compareMap(actual, expected) {
                if (actual instanceof Map) {
                    var pass_1 = actual.size === expected.size;
                    if (pass_1) {
                        actual.forEach(function (v, k) { pass_1 = pass_1 && util.equals(v, expected.get(k)); });
                    }
                    return pass_1;
                }
                else {
                    // TODO(misko): we should change the return, but jasmine.d.ts is not null safe
                    return undefined;
                }
            }
        },
        toBePromise: function () {
            return {
                compare: function (actual) {
                    var pass = typeof actual === 'object' && typeof actual.then === 'function';
                    return { pass: pass, get message() { return 'Expected ' + actual + ' to be a promise'; } };
                }
            };
        },
        toBeAnInstanceOf: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && actual instanceof expectedClass;
                    return {
                        pass: pass,
                        get message() {
                            return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                        }
                    };
                }
            };
        },
        toHaveText: function () {
            return {
                compare: function (actual, expectedText) {
                    var actualText = elementText(actual);
                    return {
                        pass: actualText == expectedText,
                        get message() { return 'Expected ' + actualText + ' to be equal to ' + expectedText; }
                    };
                }
            };
        },
        toHaveCssClass: function () {
            return { compare: buildError(false), negativeCompare: buildError(true) };
            function buildError(isNot) {
                return function (actual, className) {
                    return {
                        pass: platform_browser_1.ɵgetDOM().hasClass(actual, className) == !isNot,
                        get message() {
                            return "Expected " + actual.outerHTML + " " + (isNot ? 'not ' : '') + "to contain the CSS class \"" + className + "\"";
                        }
                    };
                };
            }
        },
        toHaveCssStyle: function () {
            return {
                compare: function (actual, styles) {
                    var allPassed;
                    if (typeof styles === 'string') {
                        allPassed = platform_browser_1.ɵgetDOM().hasStyle(actual, styles);
                    }
                    else {
                        allPassed = Object.keys(styles).length !== 0;
                        Object.keys(styles).forEach(function (prop) {
                            allPassed = allPassed && platform_browser_1.ɵgetDOM().hasStyle(actual, prop, styles[prop]);
                        });
                    }
                    return {
                        pass: allPassed,
                        get message() {
                            var expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
                            return "Expected " + actual.outerHTML + " " + (!allPassed ? ' ' : 'not ') + "to contain the\n                      CSS " + (typeof styles === 'string' ? 'property' : 'styles') + " \"" + expectedValueStr + "\"";
                        }
                    };
                }
            };
        },
        toContainError: function () {
            return {
                compare: function (actual, expectedText) {
                    var errorMessage = actual.toString();
                    return {
                        pass: errorMessage.indexOf(expectedText) > -1,
                        get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                    };
                }
            };
        },
        toImplement: function () {
            return {
                compare: function (actualObject, expectedInterface) {
                    var intProps = Object.keys(expectedInterface.prototype);
                    var missedMethods = [];
                    intProps.forEach(function (k) {
                        if (!actualObject.constructor.prototype[k])
                            missedMethods.push(k);
                    });
                    return {
                        pass: missedMethods.length == 0,
                        get message() {
                            return 'Expected ' + actualObject + ' to have the following methods: ' +
                                missedMethods.join(', ');
                        }
                    };
                }
            };
        }
    });
});
function elementText(n) {
    var hasNodes = function (n) {
        var children = platform_browser_1.ɵgetDOM().childNodes(n);
        return children && children.length > 0;
    };
    if (n instanceof Array) {
        return n.map(elementText).join('');
    }
    if (platform_browser_1.ɵgetDOM().isCommentNode(n)) {
        return '';
    }
    if (platform_browser_1.ɵgetDOM().isElementNode(n) && platform_browser_1.ɵgetDOM().tagName(n) == 'CONTENT') {
        return elementText(Array.prototype.slice.apply(platform_browser_1.ɵgetDOM().getDistributedNodes(n)));
    }
    if (platform_browser_1.ɵgetDOM().hasShadowRoot(n)) {
        return elementText(platform_browser_1.ɵgetDOM().childNodesAsList(platform_browser_1.ɵgetDOM().getShadowRoot(n)));
    }
    if (hasNodes(n)) {
        return elementText(platform_browser_1.ɵgetDOM().childNodesAsList(n));
    }
    return platform_browser_1.ɵgetDOM().getText(n);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3Rpbmcvc3JjL21hdGNoZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsc0NBQWdEO0FBQ2hELDhEQUE0RDtBQTZFNUQsSUFBTSxPQUFPLEdBQVEsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsY0FBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBRXZFOzs7Ozs7R0FNRztBQUNVLFFBQUEsTUFBTSxHQUFxQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBR3ZFLGtFQUFrRTtBQUNsRSx3Q0FBd0M7QUFDeEMsaUVBQWlFO0FBQ2pFLG9CQUFvQjtBQUNuQixHQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7SUFDMUMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBTSxFQUFFLENBQU0sSUFBTyxHQUFHLENBQUMsSUFBSSxDQUFJLENBQUMsU0FBSSxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxPQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQUksQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDbEIsNERBQTREO1FBQzVELE9BQU8sRUFBRSxVQUFTLElBQUk7WUFDcEIsTUFBTSxDQUFDO2dCQUNMLE9BQU8sRUFBRSxVQUFTLE1B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