"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var StyleWithImports = (function () {
    function StyleWithImports(style, styleUrls) {
        this.style = style;
        this.styleUrls = styleUrls;
    }
    return StyleWithImports;
}());
exports.StyleWithImports = StyleWithImports;
function isStyleUrlResolvable(url) {
    if (url == null || url.length === 0 || url[0] == '/')
        return false;
    var schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
    return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
}
exports.isStyleUrlResolvable = isStyleUrlResolvable;
/**
 * Rewrites stylesheets by resolving and removing the @import urls that
 * are either relative or don't have a `package:` scheme
 */
function extractStyleUrls(resolver, baseUrl, cssText) {
    var foundUrls = [];
    var modifiedCssText = cssText.replace(CSS_COMMENT_REGEXP, '').replace(CSS_IMPORT_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        var url = m[1] || m[2];
        if (!isStyleUrlResolvable(url)) {
            // Do not attempt to resolve non-package absolute URLs with URI scheme
            return m[0];
        }
        foundUrls.push(resolver.resolve(baseUrl, url));
        return '';
    });
    return new StyleWithImports(modifiedCssText, foundUrls);
}
exports.extractStyleUrls = extractStyleUrls;
var CSS_IMPORT_REGEXP = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
var CSS_COMMENT_REGEXP = /\/\*[\s\S]+?\*\//g;
var URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfdXJsX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3N0eWxlX3VybF9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQU9IO0lBQ0UsMEJBQW1CLEtBQWEsRUFBUyxTQUFtQjtRQUF6QyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBVTtJQUFHLENBQUM7SUFDbEUsdUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLDRDQUFnQjtBQUk3Qiw4QkFBcUMsR0FBVztJQUM5QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ25FLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN0RCxNQUFNLENBQUMsV0FBVyxLQUFLLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUM7QUFDMUYsQ0FBQztBQUpELG9EQUlDO0FBRUQ7OztHQUdHO0FBQ0gsMEJBQ0ksUUFBcUIsRUFBRSxPQUFlLEVBQUUsT0FBZTtJQUN6RCxJQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7SUFFL0IsSUFBTSxlQUFlLEdBQ2pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQUMsV0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCxzQkFBYzs7UUFDaEYsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixzRUFBc0U7WUFDdEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7UUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDO0lBQ1AsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFmRCw0Q0FlQztBQUVELElBQU0saUJBQWlCLEdBQUcsaUVBQWlFLENBQUM7QUFDNUYsSUFBTSxrQkFBa0IsR0FBRyxtQkFBbUIsQ0FBQztBQUMvQyxJQUFNLHNCQUFzQixHQUFHLGNBQWMsQ0FBQyJ9