"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 *
 * Please make sure to keep to edits in sync with the source file.
 *
 * Source:
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 *
 * The original file level comment is reproduced below
 */
/*
  This is a limited shim for ShadowDOM css styling.
  https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles

  The intention here is to support only the styling features which can be
  relatively simply implemented. The goal is to allow users to avoid the
  most obvious pitfalls and do so without compromising performance significantly.
  For ShadowDOM styling that's not covered here, a set of best practices
  can be provided that should allow users to accomplish more complex styling.

  The following is a list of specific ShadowDOM styling features and a brief
  discussion of the approach used to shim.

  Shimmed features:

  * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
  element using the :host rule. To shim this feature, the :host styles are
  reformatted and prefixed with a given scope name and promoted to a
  document level stylesheet.
  For example, given a scope name of .foo, a rule like this:

    :host {
        background: red;
      }
    }

  becomes:

    .foo {
      background: red;
    }

  * encapsulation: Styles defined within ShadowDOM, apply only to
  dom inside the ShadowDOM. Polymer uses one of two techniques to implement
  this feature.

  By default, rules are prefixed with the host element tag name
  as a descendant selector. This ensures styling does not leak out of the 'top'
  of the element's ShadowDOM. For example,

  div {
      font-weight: bold;
    }

  becomes:

  x-foo div {
      font-weight: bold;
    }

  becomes:


  Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
  selectors are scoped by adding an attribute selector suffix to each
  simple selector that contains the host element tag name. Each element
  in the element's ShadowDOM template is also given the scope attribute.
  Thus, these rules match only elements that have the scope attribute.
  For example, given a scope name of x-foo, a rule like this:

    div {
      font-weight: bold;
    }

  becomes:

    div[x-foo] {
      font-weight: bold;
    }

  Note that elements that are dynamically added to a scope must have the scope
  selector added to them manually.

  * upper/lower bound encapsulation: Styles which are defined outside a
  shadowRoot should not cross the ShadowDOM boundary and should not apply
  inside a shadowRoot.

  This styling behavior is not emulated. Some possible ways to do this that
  were rejected due to complexity and/or performance concerns include: (1) reset
  every possible property for every possible selector for a given scope name;
  (2) re-implement css in javascript.

  As an alternative, users should make sure to use selectors
  specific to the scope in which they are working.

  * ::distributed: This behavior is not emulated. It's often not necessary
  to style the contents of a specific insertion point and instead, descendants
  of the host element can be styled selectively. Users can also create an
  extra node around an insertion point and style that node's contents
  via descendent selectors. For example, with a shadowRoot like this:

    <style>
      ::content(div) {
        background: red;
      }
    </style>
    <content></content>

  could become:

    <style>
      / *@polyfill .content-container div * /
      ::content(div) {
        background: red;
      }
    </style>
    <div class="content-container">
      <content></content>
    </div>

  Note the use of @polyfill in the comment above a ShadowDOM specific style
  declaration. This is a directive to the styling shim to use the selector
  in comments in lieu of the next selector when running under polyfill.
*/
var ShadowCss = (function () {
    function ShadowCss() {
        this.strictStyling = true;
    }
    /*
    * Shim some cssText with the given selector. Returns cssText that can
    * be included in the document via WebComponents.ShadowCSS.addCssToDocument(css).
    *
    * When strictStyling is true:
    * - selector is the attribute added to all elements inside the host,
    * - hostSelector is the attribute added to the host itself.
    */
    ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        var sourceMappingUrl = extractSourceMappingUrl(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
    };
    ShadowCss.prototype._insertDirectives = function (cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    };
    /*
     * Process styles to convert native ShadowDOM rules that will trip
     * up the css parser; we rely on decorating the stylesheet with inert rules.
     *
     * For example, we convert this rule:
     *
     * polyfill-next-selector { content: ':host menu-item'; }
     * ::content menu-item {
     *
     * to this:
     *
     * scopeName menu-item {
     *
    **/
    ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentNextSelectorRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            return m[2] + '{';
        });
    };
    /*
     * Process styles to add rules which will only apply under the polyfill
     *
     * For example, we convert this rule:
     *
     * polyfill-rule {
     *   content: ':host menu-item';
     * ...
     * }
     *
     * to this:
     *
     * scopeName menu-item {...}
     *
    **/
    ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentRuleRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            var rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    };
    /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
     *
     *  .foo {... }
     *
     *  and converts this to
     *
     *  scopeName .foo { ... }
    */
    ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
        var unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
            cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
    };
    /*
     * Process styles to add rules which will only apply under the polyfill
     * and do not process via CSSOM. (CSSOM is destructive to rules on rare
     * occasions, e.g. -webkit-calc on Safari.)
     * For example, we convert this rule:
     *
     * @polyfill-unscoped-rule {
     *   content: 'menu-item';
     * ... }
     *
     * to this:
     *
     * menu-item {...}
     *
    **/
    ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        var r = '';
        var m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            var rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    };
    /*
     * convert a rule like :host(.foo) > .bar { }
     *
     * to
     *
     * .foo<scopeName> > .bar
    */
    ShadowCss.prototype._convertColonHost = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    };
    /*
     * convert a rule like :host-context(.foo) > .bar { }
     *
     * to
     *
     * .foo<scopeName> > .bar, .foo scopeName > .bar { }
     *
     * and
     *
     * :host-context(.foo:host) .bar { ... }
     *
     * to
     *
     * .foo<scopeName> .bar { ... }
    */
    ShadowCss.prototype._convertColonHostContext = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    };
    ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
        // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
        return cssText.replace(regExp, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            if (m[2]) {
                var parts = m[2].split(',');
                var r = [];
                for (var i = 0; i < parts.length; i++) {
                    var p = parts[i].trim();
                    if (!p)
                        break;
                    r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
            }
            else {
                return _polyfillHostNoCombinator + m[3];
            }
        });
    };
    ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    };
    ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
    };
    /*
     * Convert combinators like ::shadow and pseudo-elements like ::content
     * by replacing with space.
    */
    ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
        return _shadowDOMSelectorsRe.reduce(function (result, pattern) { return result.replace(pattern, ' '); }, cssText);
    };
    // change a selector like 'div' to 'name div'
    ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
        var _this = this;
        return processRules(cssText, function (rule) {
            var selector = rule.selector;
            var content = rule.content;
            if (rule.selector[0] != '@') {
                selector =
                    _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            return new CssRule(selector, content);
        });
    };
    ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
        var _this = this;
        return selector.split(',')
            .map(function (part) { return part.trim().split(_shadowDeepSelectors); })
            .map(function (deepParts) {
            var shallowPart = deepParts[0], otherParts = deepParts.slice(1);
            var applyScope = function (shallowPart) {
                if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart)].concat(otherParts).join(' ');
        })
            .join(', ');
    };
    ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
        var re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    };
    ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
        var lre = /\[/g;
        var rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    };
    ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
        // Difference from webcomponents.js: scopeSelector could not be an array
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    };
    // scope via name and [is=name]
    ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
        // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            var replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, function (hnc, selector) {
                return selector.replace(/([^:]*)(:*)(.*)/, function (_, before, colon, after) {
                    return before + replaceBy_1 + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy_1 + ' ');
        }
        return scopeSelector + ' ' + selector;
    };
    // return a selector with [name] suffix on each simple selector
    // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
    ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector, hostSelector) {
        var _this = this;
        var isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, function (_) {
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            return parts[0];
        });
        var attrName = '[' + scopeSelector + ']';
        var _scopeSelectorPart = function (p) {
            var scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                // remove :host since it should be unnecessary
                var t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    var matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        var safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        var scopedSelector = '';
        var startIndex = 0;
        var res;
        var sep = /( |>|\+|~(?!=))\s*/g;
        var scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
        while ((res = sep.exec(selector)) !== null) {
            var separator = res[1];
            var part = selector.slice(startIndex, res.index).trim();
            // if a selector appears before :host-context it should not be shimmed as it
            // matches on ancestor elements and not on elements in the host's shadow
            var scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
            scopedSelector += scopedPart + " " + separator + " ";
            startIndex = sep.lastIndex;
        }
        scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    };
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    };
    return ShadowCss;
}());
exports.ShadowCss = ShadowCss;
var SafeSelector = (function () {
    function SafeSelector(selector) {
        var _this = this;
        this.placeholders = [];
        this.index = 0;
        // Replaces attribute selectors with placeholders.
        // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        selector = selector.replace(/(\[[^\]]*\])/g, function (_, keep) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(keep);
            _this.index++;
            return replaceBy;
        });
        // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
        // WS and "+" would otherwise be interpreted as selector separators.
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function (_, pseudo, exp) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(exp);
            _this.index++;
            return pseudo + replaceBy;
        });
    }
    ;
    SafeSelector.prototype.restore = function (content) {
        var _this = this;
        return content.replace(/__ph-(\d+)__/g, function (ph, index) { return _this.placeholders[+index]; });
    };
    SafeSelector.prototype.content = function () { return this._content; };
    return SafeSelector;
}());
var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _polyfillHost = '-shadowcsshost';
// note: :host-context pre-processed to -shadowcsshostcontext.
var _polyfillHostContext = '-shadowcsscontext';
var _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
var _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
var _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
var _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    // Deprecated selectors
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
// The deep combinator is deprecated in the CSS spec
// Support for `>>>`, `deep`, `::ng-deep` is then also deprecated and will be removed in the future.
// see https://github.com/angular/angular/pull/17677
var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var _polyfillHostRe = /-shadowcsshost/gim;
var _colonHostRe = /:host/gim;
var _colonHostContextRe = /:host-context/gim;
var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
function stripComments(input) {
    return input.replace(_commentRe, '');
}
// all comments except inline source mapping
var _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
function extractSourceMappingUrl(input) {
    var matcher = input.match(_sourceMappingUrlRe);
    return matcher ? matcher[0] : '';
}
var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
var _curlyRe = /([{}])/g;
var OPEN_CURLY = '{';
var CLOSE_CURLY = '}';
var BLOCK_PLACEHOLDER = '%BLOCK%';
var CssRule = (function () {
    function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
    }
    return CssRule;
}());
exports.CssRule = CssRule;
function processRules(input, ruleCallback) {
    var inputWithEscapedBlocks = escapeBlocks(input);
    var nextBlockIndex = 0;
    return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        var selector = m[2];
        var content = '';
        var suffix = m[4];
        var contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        var rule = ruleCallback(new CssRule(selector, content));
        return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
    });
}
exports.processRules = processRules;
var StringWithEscapedBlocks = (function () {
    function StringWithEscapedBlocks(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
    return StringWithEscapedBlocks;
}());
function escapeBlocks(input) {
    var inputParts = input.split(_curlyRe);
    var resultParts = [];
    var escapedBlocks = [];
    var bracketCount = 0;
    var currentBlockParts = [];
    for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
        var part = inputParts[partIndex];
        if (part == CLOSE_CURLY) {
            bracketCount--;
        }
        if (bracketCount > 0) {
            currentBlockParts.push(part);
        }
        else {
            if (currentBlockParts.length > 0) {
                escapedBlocks.push(currentBlockParts.join(''));
                resultParts.push(BLOCK_PLACEHOLDER);
                currentBlockParts = [];
            }
            resultParts.push(part);
        }
        if (part == OPEN_CURLY) {
            bracketCount++;
        }
    }
    if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
    }
    return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93X2Nzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9zaGFkb3dfY3NzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7Ozs7OztHQVNHO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUhFO0FBRUY7SUFHRTtRQUZBLGtCQUFhLEdBQVksSUFBSSxDQUFDO0lBRWYsQ0FBQztJQUVoQjs7Ozs7OztNQU9FO0lBQ0YsK0JBQVcsR0FBWCxVQUFZLE9BQWUsRUFBRSxRQUFnQixFQUFFLFlBQXlCO1FBQXpCLDZCQUFBLEVBQUEsaUJBQXlCO1FBQ3RFLElBQU0sZ0JBQWdCLEdBQVcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEUsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7SUFDaEYsQ0FBQztJQUVPLHFDQUFpQixHQUF6QixVQUEwQixPQUFlO1FBQ3ZDLE9BQU8sR0FBRyxJQUFJLENBQUMsa0NBQWtDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNLLHNEQUFrQyxHQUExQyxVQUEyQyxPQUFlO1FBQ3hELDZEQUE2RDtRQUM3RCxNQUFNLENBQUMsT0FB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